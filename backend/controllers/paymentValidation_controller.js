const { extractUidFromImage } = require("../utils/extractUidFromImage");
const { getFileHash } = require("../utils/fileHash");
const { getClient } = require("../config/db");


exports.validatePaymentProof = async (req, res) => {
  const client = await getClient();

  try {
    const { uid, email, amount } = req.body;

    if (!uid || !req.file) {
      return res.status(400).json({
        success: false,
        message: "UID and screenshot are required"
      });
    }

    // ✅ Validate UID format
    if (!/^\d{12,16}$/.test(uid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid UID format"
      });
    }

    const screenshotHash = getFileHash(req.file.path);

    // 🧠 OCR extraction
    // let ocrUid = null;

    // try {
    //     ocrUid = await extractUidFromImage(req.file.path);
    // } catch (e) {
    //     console.warn("OCR failed, manual review required");
    // }

    // ❌ If OCR found UID but mismatch
    // if (ocrUid && ocrUid !== uid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Entered UID does not match screenshot UID",
    //     ocr_uid: ocrUid
    //   });
    // }

    await client.query("BEGIN");

    const existing = await client.query(
      `SELECT id, status, amount FROM payment_proofs WHERE uid = $1`,
      [uid]
    );

    if (existing.rowCount > 0) {
      const payment = existing.rows[0];

      if (payment.status !== 'PENDING') {
        return res.status(409).json({
          success: false,
          message: "Payment already completed. UTR cannot be reused."
        });
      }
      
      if (payment.amount != amount) {
        return res.status(409).json({
          success: false,
          message: "Event mismatch with previous selection"
        });
      }

      // ✅ Status is PENDING → allow re-registration
      await client.query(
        `
        UPDATE payment_proofs
        SET
          email = $1,
          screenshot_hash = $2,
          screenshot_path = $3,
          amount = $4,
          created_at = NOW()
        WHERE uid = $5
        `,
        [email, screenshotHash, req.file.path, amount, uid]
      );

      await client.query("COMMIT");

      return res.json({
        success: true,
        message: "Pending payment reused successfully"
      });
    }

    // ❌ Duplicate EMAIL
    const emailCheck = await client.query(
      "SELECT id FROM payment_proofs WHERE email = $1",
      [email]
    );

    if (emailCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Email already used"
      });
    }

    // ❌ Duplicate Screenshot
    const hashCheck = await client.query(
      "SELECT id FROM payment_proofs WHERE screenshot_hash = $1",
      [screenshotHash]
    );

    if (hashCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Screenshot already submitted"
      });
    }

    // ✅ Insert record
    await client.query(
      `
      INSERT INTO payment_proofs 
      (uid, email, screenshot_hash, screenshot_path, amount)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [uid, email, screenshotHash, req.file.path, amount]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Payment proof submitted",
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Validation error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  } finally {
    client.release();
  }
};
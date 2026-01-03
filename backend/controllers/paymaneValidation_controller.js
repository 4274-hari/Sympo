const { extractUidFromImage } = require("../utils/extractUidFromImage");
const { getFileHash } = require("../utils/fileHash");
const { getClient } = require("../config/db");


exports.validatePaymentProof = async (req, res) => {
  const client = await getClient();

  try {
    const { uid, email } = req.body;

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

    // ❌ Duplicate UID
    const uidCheck = await client.query(
      "SELECT id FROM payment_proofs WHERE uid = $1",
      [uid]
    );

    if (uidCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "UID already used"
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
      (uid, email, screenshot_hash, screenshot_path)
      VALUES ($1, $2, $3, $4)
      `,
      [uid, email, screenshotHash, req.file.path]
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
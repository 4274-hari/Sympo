const { getClient } = require("../config/db");
const { validateFoodQR } = require("../services/qr_service");
const { ValidationError } = require("../errors/error");

async function scanFoodQR(req, res, next) {
  const client = await getClient(); // 🔐 single DB connection

  try {
    const { token } = req.body;

    if (!token) {
      throw ValidationError("QR token is required");
    }

    /* ===============================
       BEGIN TRANSACTION
    =============================== */
    await client.query("BEGIN");

    await validateFoodQR({ client, token });

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Food access granted"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err); // 🔥 centralized error handling
  } finally {
    client.release(); // 🔓 ALWAYS release
  }
}

module.exports = { scanFoodQR };

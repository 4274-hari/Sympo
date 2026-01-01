const {
  ValidationError,
  ConflictError
} = require("../errors/error");

/* ===============================
   VALIDATE & CONSUME FOOD QR
=============================== */
async function validateFoodQR({ client, token }) {

  if (!token) {
    throw ValidationError("QR token is required");
  }

  /* 🔒 LOCK THE ROW */
  const result = await client.query(
    `SELECT id, is_used, registration_id
     FROM food_tokens
     WHERE token = $1
     FOR UPDATE`,
    [token]
  );

  if (result.rowCount === 0) {
    throw ValidationError("Invalid QR code");
  }

  const qr = result.rows[0];

  if (qr.is_used) {
    throw ConflictError("QR code already used");
  }

  /* ✅ MARK AS USED */
  await client.query(
    `UPDATE food_tokens
     SET is_used = true, used_at = NOW()
     WHERE token = $1`,
    [token]
  );

  return {
    registration_id: qr.registration_id
  };
}

module.exports = { validateFoodQR };

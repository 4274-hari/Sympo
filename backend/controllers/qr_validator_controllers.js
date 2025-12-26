const { query } = require("../config/db");

async function scanFoodQR(req, res) {
  const { token } = req.body;

  const result = await query(
    `SELECT * FROM food_tokens WHERE token=$1`,
    [token]
  );

  if (result.rowCount === 0) {
    return res.status(400).json({ valid: false, reason: "Invalid QR" });
  }

  const food = result.rows[0];

  if (food.is_used) {
    return res.status(400).json({ valid: false, reason: "Already used" });
  }

  await query(
    `UPDATE food_tokens SET is_used=true, used_at=NOW() WHERE id=$1`,
    [food.id]
  );

  return res.json({
    valid: true,
    food_type: food.food_type
  });
}

module.exports = { scanFoodQR };

const { getClient } = require("../config/db");
const AppError = require("../errors/error");

exports.loginUser = async (email, dob) => {
  const client = await getClient();

  const result = await client.query(
    `SELECT id, name, email, role
     FROM users
     WHERE email = $1 AND dob = $2`,
    [email, dob]
  );

  if (result.rowCount === 0) {
    throw new AppError("Invalid credentials", 401);
  }

  return result.rows[0];
};

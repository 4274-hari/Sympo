require("dotenv").config();
const {Pool} = require("pg")


const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

/**
 * Ensure database exists
 */
async function ensureDatabaseExists() {
  // connect to default postgres database
  const adminPool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres",
  });

  try {
    const result = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (result.rowCount === 0) {
      console.log(`⚠️ Database "${DB_NAME}" not found. Creating...`);
      await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Database "${DB_NAME}" created`);
    }
  } catch (err) {
    console.error("❌ DB creation error:", err.message);
    process.exit(1);
  } finally {
    await adminPool.end();
  }
}


module.exports= {ensureDatabaseExists}

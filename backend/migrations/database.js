require("dotenv").config();
const { Pool } = require("pg");

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

/* ===============================
   ENSURE DATABASE EXISTS
=============================== */
async function ensureDatabaseExists() {
  const adminPool = new Pool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres",
    connectionTimeoutMillis: 5000
  });

  try {
    /* 🔎 Check DB existence */
    const result = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (result.rowCount === 0) {
      console.log(`⚠️ Database "${DB_NAME}" not found. Creating...`);

      // ⚠️ Cannot parameterize DB name
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);

      console.log(`✅ Database "${DB_NAME}" created`);
    } else {
      console.log(`✅ Database "${DB_NAME}" already exists`);
    }

  } catch (err) {
    console.error("❌ Database bootstrap error:", err);
    throw err; // ❗ let caller decide exit
  } finally {
    await adminPool.end();
  }
}

module.exports = { ensureDatabaseExists };

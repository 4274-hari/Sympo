const fs = require("fs");
const path = require("path");
const { getClient } = require("../config/db");

/* ===============================
   RUN SQL MIGRATIONS
=============================== */
async function tablecreation() {
  const migrationsDir = __dirname;

  const files = fs
    .readdirSync(migrationsDir)
    .filter(file => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("ℹ️ No migrations found");
    return;
  }

  console.log("📦 Running migrations...");

  const client = await getClient(); // 🔒 single connection

  try {
    /* ===============================
       MIGRATION LOCK
    =============================== */
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    for (const file of files) {
      const alreadyRun = await client.query(
        `SELECT 1 FROM migrations WHERE filename = $1`,
        [file]
      );

      if (alreadyRun.rowCount > 0) {
        continue; // skip executed migration
      }

      const sql = fs.readFileSync(
        path.join(migrationsDir, file),
        "utf8"
      );

      console.log(`➡️ Running ${file}`);

      await client.query(sql);

      await client.query(
        `INSERT INTO migrations (filename) VALUES ($1)`,
        [file]
      );

      console.log(`✅ Executed ${file}`);
    }

    await client.query("COMMIT");
    console.log("🎉 All migrations completed");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { tablecreation };

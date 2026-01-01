const { Pool } = require("pg");
require("dotenv").config();

/* ===============================
   POSTGRES CONNECTION POOL
=============================== */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,                      // 🔒 max concurrent connections
  idleTimeoutMillis: 30000,     // ♻️ close idle clients after 30s
  connectionTimeoutMillis: 5000 // ⏱️ fail fast if DB unreachable
});

/* ===============================
   POOL ERROR HANDLING
=============================== */
pool.on("error", (err) => {
  console.error("❌ Unexpected Postgres pool error", err);
  process.exit(1); // unrecoverable
});

/* ===============================
   QUERY HELPERS
=============================== */
const query = (text, params) => pool.query(text, params);

/* 🔐 For TRANSACTIONS */
const getClient = () => pool.connect();

module.exports = {
  query,
  getClient
};

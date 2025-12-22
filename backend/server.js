const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const { initDB,pool } = require("./config/db");

const app = express();
app.use(express.json());

(async () => {
  await initDB(); // 👈 creates DB if missing

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();
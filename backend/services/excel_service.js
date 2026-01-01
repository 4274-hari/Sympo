const axios = require("axios");
const { AppError } = require("../errors/error");

/* ===============================
   APPEND TO GOOGLE SHEET
   (NON-CRITICAL SIDE EFFECT)
=============================== */
async function appendToGoogleSheet(data) {
  try {
    const response = await axios.post(
      process.env.GSHEET_WEBHOOK_URL,
      data,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Optional sanity check
    if (response.status !== 200) {
      throw new Error(`Unexpected status: ${response.status}`);
    }

    return true; // ✅ explicitly signal success

  } catch (err) {
    /* -----------------------------
       DO NOT THROW (side-effect)
       BUT LOG MEANINGFULLY
    ----------------------------- */

    if (err.response) {
      // Google Apps Script responded with error
      console.error("📄 Google Sheet Error:", {
        status: err.response.status,
        data: err.response.data
      });
    } else if (err.request) {
      // No response received
      console.error("📄 Google Sheet Timeout / No Response");
    } else {
      // Code / config error
      console.error("📄 Google Sheet Internal Error:", err.message);
    }

    return false; // ❌ caller can detect failure
  }
}

module.exports = { appendToGoogleSheet };

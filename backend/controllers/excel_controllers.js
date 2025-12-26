const axios = require("axios");

async function appendToGoogleSheet(data) {
  try {
    await axios.post(
      "https://script.google.com/macros/s/AKfycbwiQ4rcBLtfyrO4j9ktRwgjJsLcdjcz92X7y4MPfu_Dwg2ujpnOZ3CLYCzJf_Fe1L2LJA/exec",
      data,
      { timeout: 5000 }
    );
  } catch (err) {
    console.error("Google Sheet Append Failed:", err.message);
  }
}



 

module.exports = { appendToGoogleSheet };

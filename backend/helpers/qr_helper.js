const crypto = require("crypto");
const QRCode = require("qrcode");

/* 🔐 Generate secure token */
function generateFoodToken() {
  return crypto.randomBytes(32).toString("hex"); // 64-char secure token
}

/* 🧾 Generate QR as base64 */
async function generateFoodQRBuffer(token) {
  return await QRCode.toBuffer(token);
}

/* 🧾 Convert buffer → base64 */
function bufferToBase64(buffer) {
  return buffer.toString("base64");
}

module.exports = {
  generateFoodToken,
  generateFoodQRBuffer,
  bufferToBase64
};

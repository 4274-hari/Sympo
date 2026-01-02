const crypto = require('crypto')
const fs = require('fs')

const getFileHash = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

module.exports = { getFileHash }
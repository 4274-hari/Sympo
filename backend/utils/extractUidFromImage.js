const fs = require("fs");
const Tesseract = require("tesseract.js");
const { preprocessImageForOCR } = require("./preprocessImage");

const extractUidFromImage = async (imagePath) => {
  const processedImage = await preprocessImageForOCR(imagePath);

  const imageBuffer = fs.readFileSync(processedImage);

  try {
    const result = await Tesseract.recognize(
      imageBuffer,
      "eng",
      {
        logger: m => console.log("OCR:", m.status)
      }
    );

    const text = result.data.text;
    console.log("OCR TEXT:", text);

    const match = text.match(/[0-9IO]{12,16}/);
    if (!match) return null;

    return match[0]
      .replace(/I/g, "1")
      .replace(/O/g, "0");

  } catch (err) {
    console.error("OCR error:", err.message);
    throw err;
  }
};

module.exports = { extractUidFromImage };
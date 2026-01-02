const sharp = require("sharp");
const path = require("path");

const preprocessImageForOCR = async (inputPath) => {
  const outputPath = inputPath.replace(
    path.extname(inputPath),
    "_ocr.png"
  );

  await sharp(inputPath)
    .extract({
        left: 0,
        top: 900,     // adjust if needed
        width: 1080,
        height: 600
    })
    .resize({ width: 1200 })
    .grayscale()
    .threshold(180)
    .png()
    .toFile(outputPath);

  return outputPath;
};

module.exports = { preprocessImageForOCR };
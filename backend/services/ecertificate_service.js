const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

async function generateCertificate({ name, eventName, certificateId }) {
  const templatePath = path.join(
    __dirname,
    "../assets/ecertificate.webp"
  );

  const outputPath = path.join(
    __dirname,
    `../generated-certificates/${certificateId}.png`
  );

  const template = await loadImage(templatePath);
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(template, 0, 0);

  ctx.font = "bold 48px Serif";
  ctx.fillStyle = "#1b2a4e";
  ctx.textAlign = "center";
  ctx.fillText(name, canvas.width / 2, 330);

  ctx.font = "32px Serif";
  ctx.fillStyle = "#444";
  ctx.fillText(eventName, canvas.width / 2, 400);

  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
  return outputPath;
}

module.exports = { generateCertificate };

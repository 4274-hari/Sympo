function generateImageHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}

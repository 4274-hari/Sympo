const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/payments",
  fileFilter: (_, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Unsupported image format"));
    }
    cb(null, true);
    },
  filename: (_, file, cb) => {
    cb(null, `pay_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  }
});

module.exports = { upload }
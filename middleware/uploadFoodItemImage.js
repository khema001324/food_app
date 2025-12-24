const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ⭐ Create uploads/food folder automatically
const uploadsDir = path.join(__dirname, "..", "uploads", "food");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ⭐ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `food_${Date.now()}${ext}`); // unique filename
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;

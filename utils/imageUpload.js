// utils/fileUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { validateImageFormat } = require("./validation"); // Assuming you have this validation utility

// Function to set up storage for Multer
const setupMulter = (folderName) => {
  const baseUploadDir = path.join(__dirname, "../uploads", folderName);

  // Ensure the folder exists
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, baseUploadDir); // Use the specific folder for this type of upload
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!validateImageFormat([file])) {
        return cb(new Error("Only JPG, JPEG, and PNG formats are allowed!"));
      }
      cb(null, true);
    },
  });
};

module.exports = setupMulter;

// routes/homeImageRoutes.js
const express = require("express");
const router = express.Router();
const imageController = require("../controllers/homeImageController");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/home_images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, and PNG images are allowed."));
    }
  },
});

// Create: Upload images
router.post("/upload/", upload.array("images", 5), imageController.uploadImages);

// Read: Get all images
router.get("/fetch/", imageController.getAllImages);

// Read by ID: Get an image by its ID
router.get("/:id", imageController.getImageById);

// Update: Update an image by its ID
router.put("/update/:id", upload.single("image"), imageController.updateImageById);

// Delete: Remove an image by its ID
router.delete("/remove/image/:id", imageController.deleteImageById);

module.exports = router;

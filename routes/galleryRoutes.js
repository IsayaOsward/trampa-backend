const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

router.post("/upload", uploadMiddleware, galleryController.uploadPicture);
router.get("/", galleryController.getAllPictures);

module.exports = router;

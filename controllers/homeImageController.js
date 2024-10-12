// controllers/homeImageController.js
const path = require("path");
const fs = require("fs");
const Image = require("../models/homeImage");

// Create: Upload and save images
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    const incomingImagesCount = req.files.length;

    // Check how many images are already in the database
    const existingImagesCount = await Image.countNotDeletedImages();

    // Validate if the total images do not exceed the limit of 5
    if (existingImagesCount + incomingImagesCount > 5) {
      return res.status(400).json({
        message: `You can only upload a maximum of 5 images. You currently have ${existingImagesCount} images. You can delete some old images to add new one`,
      });
    }

    const savedImages = [];

    for (let file of req.files) {
      if (!allowedFormats.includes(file.mimetype)) {
        return res
          .status(400)
          .json({ message: "Only JPG, JPEG, and PNG images are allowed." });
      }

      const imagePath = path.join("uploads/home_images", file.filename);
      await Image.saveImagePath(imagePath);
      savedImages.push(imagePath);
    }

    res.status(201).json({
      message: "Images uploaded and saved successfully!",
      images: savedImages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read: Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.getAllImages();
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read by ID: Get image by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.getImageById(id);

    if (!image.length) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update: Update image by ID
exports.updateImageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Image file is required for update." });
    }

    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedFormats.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only JPG, JPEG, and PNG images are allowed." });
    }

    const newImagePath = path.join("uploads/home_images", req.file.filename);

    // Fetch old image to delete it
    const oldImage = await Image.getImageById(id);
    if (oldImage.length) {
      const oldImagePath = oldImage[0].image_path;

      // Delete old file
      fs.unlinkSync(oldImagePath);
    }

    await Image.updateImageById(id, newImagePath);

    res.status(200).json({
      message: "Image updated successfully",
      imagePath: newImagePath,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete: Remove image by ID
exports.deleteImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.getImageById(id);
    if (!image.length) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imagePath = image[0].image_path;

    // Delete file from the uploads folder
    // fs.unlinkSync(imagePath);

    await Image.deleteImageById(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Gallery = require("../models/galleryModel");
const path = require("path");

exports.uploadPicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file_name = req.file.originalname;
    let file_path = path.join("/upload/gallery/", req.file.filename);

    // Normalize path to ensure forward slashes (useful in Windows environments)
    file_path = file_path.replace(/\\/g, "/");

    const file_for = req.body.file_for;

    const newImage = new Gallery(file_name, file_path, file_for);
    await Gallery.create(newImage);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while uploading the image",
    });
  }
};

exports.getAllPictures = async (req, res) => {
  try {
    const images = await Gallery.getAll();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the images",
    });
  }
};

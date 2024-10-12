// models/homeImage.js
const { queryStatement } = require("../utils/queryStatement");

const Image = {
  // Create: Save image path to the database
  saveImagePath: async (imagePath) => {
    const sql = "INSERT INTO home_images (image_path) VALUES (?)";
    return queryStatement(sql, [imagePath]);
  },

  // Count: Count images not marked as deleted
  countNotDeletedImages: async () => {
    const sql = "SELECT COUNT(*) AS count FROM home_images WHERE isDeleted = ?";
    const result = await queryStatement(sql, ["false"]);
    return result[0].count; // Assuming queryStatement returns an array of results
  },
  // Read: Get all images from the database
  getAllImages: async () => {
    const sql = "SELECT * FROM home_images WHERE isDeleted = ?";
    return queryStatement(sql, ["false"]);
  },

  // Read by ID: Get an image by its ID
  getImageById: async (id) => {
    const sql = "SELECT * FROM home_images WHERE id = ? AND isDeleted = ?";
    return queryStatement(sql, [id, "false"]);
  },

  // Update: Update image path by its ID
  updateImageById: async (id, newImagePath) => {
    const sql = "UPDATE home_images SET image_path = ? WHERE id = ?";
    return queryStatement(sql, [newImagePath, id]);
  },

  //SOTF Delete by ID
  deleteImageById: async (id) => {
    const sql = "UPDATE home_images SET isDeleted = ? WHERE id = ?";
    return queryStatement(sql, ["true", id]);
  },
};

module.exports = Image;

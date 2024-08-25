const crypto = require("crypto");
const BlogPost = require("../models/blogModel"); // Adjust path as needed

// Function to generate a random alphanumeric string
const generateRandomId = (length = 20) => {
  return crypto
    .randomBytes(length)
    .toString("hex")
    .toUpperCase()
    .slice(0, length);
};

// Function to ensure the generated ID is unique
const generateUniqueBlogId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = generateRandomId(); // Generate a new ID

    // Check if the ID already exists in the database
    const existingBlogPost = await BlogPost.findById(uniqueId);
    if (!existingBlogPost) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};

module.exports = generateUniqueBlogId;

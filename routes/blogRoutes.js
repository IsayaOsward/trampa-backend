// routes/blogRoutes.js
const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

// Route to create a blog post
router.post(
  "/blogs/create/",
  blogController.setBlogId,
  blogController.upload.array("images", 10),
  blogController.preValidateBlog,
  blogController.createBlog
);

// Route to get all blog posts with pagination
router.get("/blogs/fetch/", blogController.getBlogs);

// Route to preview blog posts
// routes/blogRoutes.js
router.get("/blogs/previews/", blogController.getBlogPreview);

// Route to get specific blog posts
router.get("/blogs/fetch/:id", blogController.getBlogById);

module.exports = router;

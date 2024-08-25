// controllers/blogController.js
const BlogPost = require("../models/blogModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { validateImageFormat } = require("../utils/validation");
const generateUniqueBlogId = require('../utils/generateBlogId');

// Ensure uploads folder exists
const baseUploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    //fetching blog ID from middleware
    const blogId = req.blogId;
    const uploadDir = path.join(baseUploadDir, blogId);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Use the created folder for the blog ID
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!validateImageFormat([file])) {
      return cb(new Error("Only JPG, JPEG, and PNG formats are allowed!"));
    }
    cb(null, true);
  },
});

// Exporting the upload
exports.upload = upload;

// Middleware to set blog ID before file upload
exports.setBlogId = async (req, res, next) => {
  try {
    req.blogId = await generateUniqueBlogId(); // Generate and set blog ID
    next();
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to generate unique blog ID." });
  }
};

// Validate blog inputs before upload
exports.preValidateBlog = (req, res, next) => {
  const { title, body } = req.body;
  if (!title) {
    return res.status(400).send({
      success: false,
      message: "Please provide the blog title.",
    });
  }

  if (!body) {
    return res.status(400).send({
      success: false,
      message: "Please provide the blog body content.",
    });
  }

  next();
};

//creating a blog
exports.createBlog = async (req, res) => {
  const { title, body } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).send({
      success: false,
      message: "Please upload between 1 and 10 images.",
    });
  }

  const images = req.files.map((file) => file.filename);

  if (!BlogPost.validateImages(images)) {
    return res.status(400).send({
      success: false,
      message: "Please upload between 1 and 10 images.",
    });
  }

  const blogPost = new BlogPost(req.blogId,title, body, images);

  try {
    await BlogPost.save(blogPost);
    res
      .status(201)
      .send({ success: true, message: "Blog post created successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ success: true, message: "Failed to create blog post." });
  }
};

exports.getBlogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 posts per page

  try {
    const blogs = await BlogPost.findAll({ page, limit });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).send({success:false, message: "Failed to retrieve blog posts."});
  }
};

// Preview blog posts
exports.getBlogPreview = async (req, res) => {
  try {
    const blogs = await BlogPost.findPreviews();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).send({success: false, message: "Failed to retrieve blog previews."});
  }
};

// Fetch single blog post for reading more
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await BlogPost.findById(id);
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).send({success: false, message: "Blog post not found."});
    }
  } catch (error) {
    res.status(500).send({success:false, message: "Failed to retrieve blog post."});
  }
};

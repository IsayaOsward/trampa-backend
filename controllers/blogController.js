// controllers/blogController.js
const BlogPost = require("../models/blogModel");
const setupMulter = require("../utils/imageUpload") // Import the utility function
const generateUniqueBlogId = require("../utils/generateBlogId");

const upload = setupMulter("blogs"); // Pass the folder name

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
// Fetch paginated blog posts
exports.getBlogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 posts per page

  try {
    const blogs = await BlogPost.findAll({ page, limit });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).send({success: false, message: "Failed to retrieve blog posts."});
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
    res.status(500).send({success: false, message: "Failed to retrieve blog post."});
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



// Creating a blog
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

  const blogPost = new BlogPost(req.blogId, title, body, images);

  try {
    await BlogPost.save(blogPost);
    res
      .status(201)
      .send({ success: true, message: "Blog post created successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to create blog post." });
  }
};

// Export the upload instance for blog-specific usage
exports.upload = upload;

// routes/messageRoutes.js
const express = require("express");
const {
  fetchMessages,
  sendMessage,
} = require("../controllers/messageController");

const router = express.Router();

// RESTful API route to get messages for a specific blog post
router.get("/messages/:blogPostId", async (req, res) => {
  try {
    const { blogPostId } = req.params;
    const messages = await fetchMessages(blogPostId);
    res.json({ success: true, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching messages." });
  }
});

module.exports = router;

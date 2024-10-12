// models/messageModel.js
const { queryStatement } = require("../config/database");

const createMessage = async (content, blogPostId) => {
  const sql = "INSERT INTO messages (content, blog_post_id) VALUES (?, ?)";
  return await queryStatement(sql, [content, blogPostId]);
};

const getMessagesByBlogPostId = async (blogPostId) => {
  const sql = "SELECT * FROM messages WHERE blog_post_id = ?";
  return await queryStatement(sql, [blogPostId]);
};

module.exports = { createMessage, getMessagesByBlogPostId };

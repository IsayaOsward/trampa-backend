// models/blogModel.js
const { queryStatement } = require("../utils/queryStatement");

class BlogPost {
  constructor(id, title, body, images) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.images = images;
  }

  static validateImages(images) {
    return images && images.length >= 1 && images.length <= 10;
  }

  static async save(blogPost) {
    const sql =
      "INSERT INTO blog_posts (id, title, body, images) VALUES (?,?, ?, ?)";
    const params = [
      blogPost.id,
      blogPost.title,
      blogPost.body,
      JSON.stringify(blogPost.images),
    ];

    try {
      const result = await queryStatement(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findAll({ page, limit }) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT * FROM blog_posts
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const params = [parseInt(limit), parseInt(offset)];

    try {
      const result = await queryStatement(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findPreviews() {
    const sql = `
      SELECT id, title, JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) AS image, 
             LEFT(body, 150) AS snippet 
      FROM blog_posts
      ORDER BY created_at DESC
    `;
    try {
      const result = await queryStatement(sql);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const sql = "SELECT * FROM blog_posts WHERE id = ? AND isDeleted = ?";
    try {
      const result = await queryStatement(sql, [id,'false']);
      return result.length ? result[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BlogPost;

// db.js
require("dotenv").config();
const mysql = require("mysql");

// Create a connection pool
const connection = mysql.createPool({
  connectionLimit: 10, // Adjust based on your requirements
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_USER_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Export the pool for reuse
module.exports = connection;

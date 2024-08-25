// utils/token.js
const jwt = require("jsonwebtoken");
const accessTokenSecret = "yourAccessTokenSecret"; // Replace with your own secret key
const refreshTokenSecret = "yourRefreshTokenSecret"; // Replace with your own secret key

// Function to generate an access token
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" }); // Access token valid for 15 minutes
}

// Function to generate a refresh token
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "1d" }); // Refresh token valid for 1 days
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

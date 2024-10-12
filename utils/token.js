// utils/token.js
const jwt = require("jsonwebtoken");
const accessTokenSecret = "yourAccessTokenSecret"; // Replace with your own secret key
const refreshTokenSecret = "yourRefreshTokenSecret"; // Replace with your own secret key


function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" }); // Access token valid for 15 minutes
}

function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "1d" });
}

function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Function to verify a refresh token
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, refreshTokenSecret);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

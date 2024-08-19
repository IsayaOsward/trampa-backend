const crypto = require("crypto");

function generateUserID() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = generateUserID;
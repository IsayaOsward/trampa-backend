// utils/nodemailerConfig.js
const nodemailer = require("nodemailer");

// Create and export the transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // fetching this from environment variables
    pass: process.env.EMAIL_PASSWORD, // fetching this from environment variables
  },
});

module.exports = transporter;

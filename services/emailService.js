const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a Nodemailer transporter object for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_PROVIDER, // Gmail SMTP server
  port: process.env.SMTP_PORT, // Port 465 for secure connections
  secure: true, // Use SSL (secure connection)
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your app password
  },
});

// Function to send an email
const sendEmailMessage = async (to, subject, text, html) => {
  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"TRAMPA" <${process.env.EMAIL_USER}>`, // Sender address
      to: to, // Receiver(s)
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmailMessage,
};

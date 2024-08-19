// services/emailService.js
const transporter = require("../config/nodemailerConfig");

class EmailService {
  static async sendEmail(to, subject, text, html) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email could not be sent");
    }
  }
}

module.exports = EmailService;

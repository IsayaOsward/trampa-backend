const axios = require("axios");
require("dotenv").config();

class SmsService {
  static apiKey = process.env.HUDUMA_API_KEY;
  static apiUrl = process.env.SMS_API;
  static senderId = process.env.TRAMPA_SENDER_ID;

  static async sendMessages(numbers, message) {
    const payload = {
      sender_id: SmsService.senderId,
      schedule: "none",
      sms: message,
      recipients: numbers.map((number) => ({ number })),
    };

    try {
      const response = await axios.post(SmsService.apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${SmsService.apiKey}`,
        },
      });

      // Check if the API indicates success in the response data
      if (response.data && response.data.success) {
        return {
          success: true,
          message: "Messages sent successfully",
          data: response.data, // Include additional data if needed
        };
      } else {
        // Handle case where response is not successful
        return {
          success: false,
          message: response.data.message || "Failed to send messages",
        };
      }
    } catch (error) {
      console.error("Error sending messages:", error.message);
      return {
        success: false,
        message: "Failed to send messages: " + error.message,
      };
    }
  }
}

module.exports = SmsService;

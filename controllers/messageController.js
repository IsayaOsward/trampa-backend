// controllers/messageController.js
const {
  createMessage,
  getMessagesByBlogPostId,
} = require("../models/messageModel");

const sendMessage = async (ws, messageData) => {
  try {
    const { content, blogPostId } = messageData;
    // Save the message to the database
    await createMessage(content, blogPostId);

    // Broadcast the new message to all connected clients
    ws.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ content, blogPostId }));
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const fetchMessages = async (blogPostId) => {
  try {
    const messages = await getMessagesByBlogPostId(blogPostId);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

module.exports = { sendMessage, fetchMessages };

const crypto = require("crypto");
const Event = require("../models/eventsModel"); // Adjust path as needed

// Function to generate a random alphanumeric string
const generateRandomId = (length = 15) => {
  return crypto
    .randomBytes(length)
    .toString("hex")
    .toUpperCase()
    .slice(0, length);
};

// Function to ensure the generated event ID is unique
const generateUniqueEventId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = generateRandomId(); // Generate a new ID

    // Check if the ID already exists in the database
    const existingEvent = await Event.findById({ event_id: uniqueId });
    if (!existingEvent) {
      isUnique = true; // ID is unique
    }
  }

  return uniqueId;
};

module.exports = generateUniqueEventId;

const EventModel = require("../models/eventsModel");
const generateUniqueEventId = require("../utils/generateUniqueEventID");
const setupMulter = require("../utils/imageUpload");

class EventController {
  static async registerEventFunction(req, res) {
    try {
      // Generate a unique event ID
      const event_id = await generateUniqueEventId();
      const eventData = { ...req.body, event_id };

      console.log("The event id is: " + event_id);

      // Check if there's an image uploaded by Multer
      if (req.file) {
        // Save the image path in eventData
        eventData.image = req.file.path;
        console.log("Image uploaded at path:", req.file.path);
      }

      // Call the EventModel to register the event
      const result = await EventModel.registerEvent(eventData);

      // Send a success response
      res.status(201).json({
        success: true,
        message: "Event registered successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in EventController.registerEventFunction:", error);

      // Send an error response
      res.status(500).json({
        success: false,
        message: "Failed to register event",
        error: error.message,
      });
    }
  }
}

module.exports = EventController;
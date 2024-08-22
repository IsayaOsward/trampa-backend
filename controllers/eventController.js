const EventModel = require("../models/eventsModel");

class EventController {
  static async registerEventFunction(req, res) {
    try {
      // Extract data from the request body
      const userData = req.body;
      console.log("registerUser called with userData:", userData); // Log

      // Call the EventModel to register the event
      const result = await EventModel.registerEvent(userData);

      // Send a success response
      res.status(201).json({
        success: true,
        message: "Event registered successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in EventController.registerUser:", error);

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

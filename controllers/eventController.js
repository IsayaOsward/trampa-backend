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

  // Fetch events with pagination, sorting, and optional filtering
  static async fetchEventsFunction(req, res) {
    try {
      const events = await EventModel.fetchEvents();
      return res.status(200).json({
        success: true,
        message: "Events fetched successfully",
        data: events,
      });
    } catch (error) {
      console.error("Error in EventController.fetchEventsFunction:", error);

      // return res.status(500).json({
      //   success: false,
      //   message: "Failed to fetch events",
      //   error: error.message,
      // });
    }
  }

  // Method to fetch a single event
  static async fetchEvent(req, res) {
    const { id } = req.params;
    try {
      const event = await EventModel.findById(id);
      if (!event || event.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }
      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event",
        error: error.message,
      });
    }
  }

  // Method to update an event
  static async updateEvent(req, res) {
    const { id } = req.params;
    try {
      const updated = await EventModel.updateEvent(id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Event not found or already deleted",
        });
      }
      res.status(200).json({
        success: true,
        message: "Event updated successfully",
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update event",
        error: error.message,
      });
    }
  }

  // Method to delete an event
  static async deleteEvent(req, res) {
    const { id } = req.params;
    try {
      const deleted = await EventModel.deleteEvent(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Event not found or already deleted",
        });
      }
      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete event",
        error: error.message,
      });
    }
  }
}

module.exports = EventController;
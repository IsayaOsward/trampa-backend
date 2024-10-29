// controllers/eventController.js
const EventModel = require("../models/eventsModel");
const generateUniqueEventId = require("../utils/generateUniqueEventID");
const setupMulter = require("../utils/imageUpload");
const path = require("path");
const fs = require("fs");

class EventController {
  static async registerEventFunction(req, res) {
    try {
      const eventType = req.body.event_type || "events";
      const baseUploadDir = path.join(__dirname, "../uploads", eventType);

      if (!fs.existsSync(baseUploadDir)) {
        fs.mkdirSync(baseUploadDir, { recursive: true });
      }

      const upload = setupMulter(eventType).single("image");
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Failed to upload image",
            error: err.message,
          });
        }

        const event_id = await generateUniqueEventId();
        const eventData = { ...req.body, event_id };

        if (req.file) {
          eventData.image = req.file.path;
        }

        const result = await EventModel.registerEvent(eventData);

        res.status(201).json({
          success: true,
          message: "Event registered successfully",
          data: result,
        });
      });
    } catch (error) {
      console.error("Error in registerEventFunction:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register event",
        error: error.message,
      });
    }
  }

  static async fetchEventsFunction(req, res) {
    try {
      const events = await EventModel.fetchEvents();
      res.status(200).json({
        success: true,
        message: "Events fetched successfully",
        data: events,
      });
    } catch (error) {
      console.error("Error in fetchEventsFunction:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch events",
        error: error.message,
      });
    }
  }

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
      console.error("Error in fetchEvent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event",
        error: error.message,
      });
    }
  }

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
      console.error("Error in updateEvent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update event",
        error: error.message,
      });
    }
  }

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
      console.error("Error in deleteEvent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete event",
        error: error.message,
      });
    }
  }
}

module.exports = EventController;

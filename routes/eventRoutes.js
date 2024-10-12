const express = require("express");
const EventController = require("../controllers/eventController");
const setupMulter = require("../utils/imageUpload");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Middleware to set up the correct upload folder based on event_type
const dynamicMulterMiddleware = (req, res, next) => {
  const eventType = req.body.event_type || "events"; // Default folder if event_type is missing

  // Create the folder if it doesn't exist
  const baseUploadDir = path.join(__dirname, "../uploads", eventType);
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  // Set up Multer with the dynamically created directory
  const upload = setupMulter(eventType).single("image");

  // Apply the Multer middleware
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload image",
        error: err.message,
      });
    }
    next();
  });
};

// GET /events - Route to fetch all events with pagination and sorting
router.get("/fetch/events", async (req, res) => {
  // Destructure query parameters and parse page and limit to integers
  // const { sort, category } = req.query;
  // let { page, limit } = req.query;

  // // Parse page and limit, with default values if not provided
  // page = parseInt(page, 10) || 1; // Default to 1 if NaN
  // limit = parseInt(limit, 10) || 10; // Default to 10 if NaN

  // console.log(`Fetching events - Page: ${page}, Limit: ${limit}`);

  try {
    const events = await EventController.fetchEventsFunction();

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});


// GET /events/:id - Route to fetch a single event by ID
router.get("/event/:id", async (req, res) => {
  try {
    const event = await EventController.fetchEvent(req.params.id);
    if (event) {
      res.status(200).json({
        success: true,
        data: event,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
});

// POST /events/register-event - Route to register a new event
router.post(
  "/register-event",
  dynamicMulterMiddleware, // Dynamic Multer middleware
  EventController.registerEventFunction
);

// PUT /events/:id - Route to update an existing event by ID
router.put("/events/:id", async (req, res) => {
  try {
    const updatedEvent = await EventController.updateEvent(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
});

// DELETE /events/:id - Route to delete an event (soft delete) by ID
router.delete("/events/:id", async (req, res) => {
  try {
    await EventController.deleteEvent(req.params.id);
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
});

module.exports = router;

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

// POST /events/register - Route to register a new event
router.post(
  "/register-event",
  dynamicMulterMiddleware, // Dynamic Multer middleware
  EventController.registerEventFunction
);

module.exports = router;

// routes/events.js
const express = require("express");
const EventController = require("../controllers/eventController");

const router = express.Router();

// GET /events - Route to fetch all events
router.get("/fetch/events", EventController.fetchEventsFunction);

// GET /events/:id - Route to fetch a single event by ID
router.get("/event/:id", EventController.fetchEvent);

// POST /events/register-event - Route to register a new event
router.post("/register-event", EventController.registerEventFunction);

// PUT /events/:id - Route to update an existing event by ID
router.put("/events/:id", EventController.updateEvent);

// DELETE /events/:id - Route to delete an event (soft delete) by ID
router.delete("/events/:id", EventController.deleteEvent);

module.exports = router;

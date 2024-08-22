const express = require("express");
const EventController = require("../controllers/eventController");

const router = express.Router();

// POST /events/register - Route to register a new event
router.post("/register-event", EventController.registerEventFunction);

module.exports = router;

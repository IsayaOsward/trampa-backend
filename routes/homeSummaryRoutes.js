const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeSummaryController");

router.get("/home", homeController.fetchHomeSummary);

module.exports = router;

const express = require("express");
const MembershipController = require("../controllers/MembershipController");

const router = express.Router();

router.post("/generate-id", MembershipController.generateMembershipId);
router.get("/", MembershipController.getMemberships);

module.exports = router;

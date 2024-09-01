const express = require("express");
const ResourceController = require("../controllers/resourceController");
const upload = require("../utils/fileUpload");

const router = express.Router();

router.post(
  "/resources",
  upload.single("resource"),
  ResourceController.createResource
);
router.get("/resources", ResourceController.getResources);

module.exports = router;

const express = require("express");
const {
  createAnnouncement,
  fetchAllAnnouncements,
  fetchAnnouncementById,
  fetchAnnouncementsByAccess,
  updateAnnouncementById,
  deleteAnnouncementById,
  getAnnouncementPreviews,
  fetchAttachmentById,
} = require("../controllers/announcementsController");

const router = express.Router();

router.post("/announcements", createAnnouncement);
// Route for fetching announcement previews
router.get('/announcements/previews', getAnnouncementPreviews);
router.get("/announcements", fetchAllAnnouncements);
router.get("/announcements/:id", fetchAnnouncementById);
router.get("/announcements/access/:access", fetchAnnouncementsByAccess); // Access type filter
router.put("/announcements/:id", updateAnnouncementById);
router.get("/announcements/:id/attachment", fetchAttachmentById);
router.delete("/announcements/:id", deleteAnnouncementById);

module.exports = router;

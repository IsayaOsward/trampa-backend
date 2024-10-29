const {
  saveAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByAccess,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementPreviewsModel,
} = require("../models/announcementModel");
const generateAnnouncementId = require("../utils/generateAnnouncementID");

const createAnnouncement = async (req, res) => {
  const { title, description, type, attachment } = req.body;
  if (!title || !description || !type) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const announcementId = await generateAnnouncementId();
    await saveAnnouncement({
      announcementId,
      title,
      description,
      type,
      attachment,
    });
    res
      .status(201)
      .json({ message: "Announcement created successfully", announcementId });
  } catch (error) {
    console.error("Error in createAnnouncement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAllAnnouncements = async (req, res) => {
  try {
    const announcements = await getAllAnnouncements();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await getAnnouncementById(id);
    if (announcement.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const { attachment, ...announcementData } = announcement[0];

    // Add a flag to indicate whether an attachment is available
    announcementData.hasAttachment = !!attachment; // true if attachment exists, false otherwise

    return res.status(200).json(announcementData); // Send announcement data without attachment
  } catch (error) {
    console.error("Error fetching announcement:", error); // Logging the error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAttachmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await getAnnouncementById(id);
    if (announcement.length === 0 || !announcement[0].attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const binaryData = Buffer.from(announcement[0].attachment, "base64");
    res.setHeader("Content-Type", "application/pdf"); // Adjust MIME type as needed
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="attachment.pdf"'
    );
    return res.status(200).send(binaryData);
  } catch (error) {
    console.error("Error fetching attachment:", error); // Logging the error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAnnouncementsByAccess = async (req, res) => {
  const { access } = req.params;
  try {
    const announcements = await getAnnouncementsByAccess(access);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAnnouncementPreviews = async (req, res) => {
  try {
    const previews = await getAnnouncementPreviewsModel();
    res.status(200).json({ success: true, data: previews });
  } catch (error) {
    console.error("Error fetching announcement previews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAnnouncementById = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, attachment } = req.body;
  try {
    await updateAnnouncement({
      id,
      title,
      description,
      type,
      attachment,
    });
    res.status(200).json({ message: "Announcement updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAnnouncement(id);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAnnouncement,
  fetchAllAnnouncements,
  fetchAnnouncementById,
  fetchAnnouncementsByAccess,
  updateAnnouncementById,
  deleteAnnouncementById,
  getAnnouncementPreviews,
  fetchAttachmentById,
};

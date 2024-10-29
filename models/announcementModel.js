const { queryStatement } = require("../utils/queryStatement");

const saveAnnouncement = async ({
  announcementId,
  title,
  description,
  type,
  attachment,
}) => {
  const sql = `
    INSERT INTO announcements (id, title, description, type, attachment)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [announcementId, title, description, type, attachment];
  return await queryStatement(sql, params);
};

const getAllAnnouncements = async () => {
  const sql = "SELECT * FROM announcements WHERE isDeleted=?";
  return await queryStatement(sql, ["false"]);
};

const getAnnouncementById = async (id) => {
  const sql =
    "SELECT * FROM announcements WHERE id = ? AND isDeleted=? ORDER BY created_at DESC";
  return await queryStatement(sql, [id, "false"]);
};

const getAnnouncementsByAccess = async (access) => {
  const sql =
    "SELECT * FROM announcements WHERE type = ? AND isDeleted=? ORDER BY created_at DESC";
  return await queryStatement(sql, [access, "false"]);
};

const updateAnnouncement = async ({
  id,
  title,
  description,
  type,
  attachment,
}) => {
  const sql = `
    UPDATE announcements 
    SET title = ?, description = ?, type = ?, attachment = ?
    WHERE id = ?
  `;
  const params = [title, description, type, attachment, id];
  return await queryStatement(sql, params);
};

const deleteAnnouncement = async (id) => {
  const sql =
    "UPDATE announcements SET isDeleted = ? WHERE id = ? AND isDeleted = ?";
  return await queryStatement(sql, ["true", id, "false"]);
};

const getAnnouncementPreviewsModel = async () => {
  const sql = `
    SELECT id, title, description, type, created_at 
    FROM announcements 
    WHERE isDeleted = ? 
    ORDER BY created_at DESC
  `;
  return await queryStatement(sql, ["false"]);
};

module.exports = {
  saveAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByAccess,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementPreviewsModel,
};

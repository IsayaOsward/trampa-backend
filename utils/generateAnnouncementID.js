const crypto = require("crypto");
const { queryStatement } = require("../utils/queryStatement");

const generateAnnouncementId = async () => {
  let announcementId;
  let isUnique = false;

  while (!isUnique) {
    announcementId = crypto.randomBytes(8).toString("hex").toUpperCase();
    const result = await queryStatement(
      "SELECT COUNT(*) AS count FROM announcements WHERE id = ?",
      [announcementId]
    );
    if (result[0].count === 0) {
      isUnique = true;
    }
  }

  return announcementId;
};

module.exports = generateAnnouncementId;

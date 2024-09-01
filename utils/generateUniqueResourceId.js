const crypto = require("crypto");
const { queryStatement } = require("../utils/queryStatement");

const generateUniqueEventId = async () => {
  let resourceId;
  let isUnique = false;

  while (!isUnique) {
    resourceId = crypto.randomBytes(8).toString("hex").toUpperCase();
    const result = await queryStatement(
      "SELECT COUNT(*) AS count FROM resources WHERE resource_id = ?",
      [resourceId]
    );
    if (result[0].count === 0) {
      isUnique = true;
    }
  }

  return resourceId;
};

module.exports = generateUniqueEventId;

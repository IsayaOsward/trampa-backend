const { queryStatement } = require("../utils/queryStatement");

class EventModel {
  static async registerEvent(userData, callback) {
    console.log("registerUser called with userData:", userData); // Log
    const { event_id, title, theme, venue, date } = userData;
    const registerEventSQL =
      "INSERT INTO register_events(event_id, title, theme, venue, date) VALUES (?, ?, ?, ?, ?)";
    const result = await queryStatement(registerEventSQL, [
      event_id,
      title,
      theme,
      venue,
      date,
    ]);
    return result[0];
  }
}

module.exports = EventModel;
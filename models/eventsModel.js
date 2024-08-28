const { queryStatement } = require("../utils/queryStatement");

class EventModel {
  // Check if event ID already exists
  static async findById(id) {
    const sql = "SELECT * FROM register_events WHERE event_id = ?";
    try {
      const result = await queryStatement(sql, [id]);
      return result.length ? result[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async registerEvent(eventData) {
    console.log("registerEvent called with eventData:", eventData); // Log
    const { event_id, event_type, guest, title, theme, venue, date, image } =
      eventData;

    const registerEventSQL =
      "INSERT INTO register_events(event_id, event_type, title, theme, venue, date, guest, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await queryStatement(registerEventSQL, [
      event_id,
      event_type,
      title,
      theme,
      venue,
      date,
      guest,
      image,
    ]);
    return result[0];
  }
}

module.exports = EventModel;

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
    const {
      event_id,
      event_type,
      guest,
      title,
      theme,
      venue,
      date,
      description,
      image,
    } = eventData;

    const registerEventSQL =
      "INSERT INTO register_events(event_id, event_type, title, theme, venue, date, guest, image,description) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?)";
    const result = await queryStatement(registerEventSQL, [
      event_id,
      event_type,
      title,
      theme,
      venue,
      date,
      guest,
      image,
      description,
    ]);
    return result[0];
  }

  // static async fetchEvents() {
  //   try {
  //     let sql = `SELECT * FROM register_events WHERE isDeleted = ?`;
  //     const results = await queryStatement(sql,[false]);
  //     return results;
  //   } catch (error) {
  //     throw new Error("Failed to fetch events: " + error.message);
  //   }
  // }

  static async fetchEvents() {
    console.log("Fetching applicants"); // Log
    const awaits = "false";
    const sql =
      "SELECT * FROM register_events WHERE register_events.isDeleted =?";
    const results = await queryStatement(sql, [awaits]);

    return results;
  }






































  // Update an event
  static async updateEvent(event_id, updatedData) {
    const { event_type, guest, title, theme, venue, date, description, image } =
      updatedData;

    // Check if the event exists
    const existingEvent = await this.findById(event_id);
    if (!existingEvent) {
      throw new Error("Event not found");
    }

    const sql = `
      UPDATE register_events
      SET event_type = ?, guest = ?, title = ?, theme = ?, venue = ?, date = ?, description = ?, image = ?
      WHERE event_id = ? AND isDeleted = false
    `;
    const result = await queryStatement(sql, [
      event_type,
      guest,
      title,
      theme,
      venue,
      date,
      description,
      image,
      event_id,
    ]);
    return result.affectedRows > 0; // Return true if update was successful
  }

  // Soft delete an event
  static async deleteEvent(event_id) {
    const sql = `
      UPDATE register_events
      SET isDeleted = true
      WHERE event_id = ? AND isDeleted = false
    `;
    const result = await queryStatement(sql, [event_id]);
    return result.affectedRows > 0; // Return true if deletion was successful
  }
}

module.exports = EventModel;

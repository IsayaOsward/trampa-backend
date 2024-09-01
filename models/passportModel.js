const { queryStatement } = require("../utils/queryStatement");

class Passport {
  constructor(image_path, user_id) {
    this.image_path = image_path;
    this.user_id = user_id;
  }

  static async create(passport) {
    const sql = "INSERT INTO passport (image_path, user_id) VALUES (?, ?)";
    const params = [passport.image_path, passport.user_id];
    return queryStatement(sql, params);
  }

  static async getByUserId(user_id) {
    const sql = `
      SELECT 
        p.image_path, 
        u.first_name, 
        u.lastname, 
        u.org_role, 
        u.salutation
      FROM passport p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.user_id = ?
    `;
    const params = [user_id];
    return queryStatement(sql, params);
  }
}

module.exports = Passport;

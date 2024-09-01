const { queryStatement } = require("../utils/queryStatement");

class MembershipModel {
  
  static async getUserDetails(user_id) {
    const sql = `SELECT first_name, lastname FROM users WHERE user_id = ?`;
    const result = await queryStatement(sql, [user_id]);
    return result[0];
  }

  /**
   * Saves a new membership record to the database.
   * @param {object} membershipData - Contains membership_id, user_id
   * @returns {object} - Result of the INSERT operation
   */
  static async saveMembership(membershipData) {
    const sql = `INSERT INTO membership (membership_id, user_id) VALUES (?, ?)`;
    const params = [
      membershipData.membership_id,
      membershipData.user_id,
      membershipData.issued_date,
    ];
    return queryStatement(sql, params);
  }

  /**
   * Retrieves memberships with optional filters.
   * @param {object} filters - Contains sortBy, order, price, startDate, endDate
   * @returns {array} - List of memberships
   */
  static async getMemberships({
    sortBy = "issued_date",
    order = "DESC",
    price,
    startDate,
    endDate,
  } = {}) {
    let sql = `SELECT * FROM membership WHERE 1 = 1`;
    const params = [];

    if (price) {
      sql += ` AND price <= ?`;
      params.push(price);
    }

    if (startDate) {
      sql += ` AND issued_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      sql += ` AND issued_date <= ?`;
      params.push(endDate);
    }

    // Whitelist sortable fields to prevent SQL injection
    const sortableFields = ["issued_date", "membership_id"];
    if (!sortableFields.includes(sortBy)) {
      sortBy = "issued_date";
    }

    const orderOptions = ["ASC", "DESC"];
    if (!orderOptions.includes(order.toUpperCase())) {
      order = "DESC";
    }

    sql += ` ORDER BY ${sortBy} ${order}`;

    return queryStatement(sql, params);
  }
}

module.exports = MembershipModel;
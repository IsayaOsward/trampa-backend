const { queryStatement } = require("../utils/queryStatement");

class ResourceModel {
  static async createResource(data) {
    const sql = `INSERT INTO resources (resource_id, title, description, price, file_path) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      data.resource_id,
      data.title,
      data.description,
      data.price,
      data.file_path,
    ];
    return queryStatement(sql, params);
  }

  static async getResources({
    sortBy = "created_at",
    order = "DESC",
    price,
  } = {}) {
    let sql = `SELECT * FROM resources WHERE 1 = 1`;
    const params = [];

    if (price) {
      sql += ` AND price <= ?`;
      params.push(price);
    }

    sql += ` ORDER BY ${sortBy} ${order}`;
    return queryStatement(sql, params);
  }
}

module.exports = ResourceModel;

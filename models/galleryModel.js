const { queryStatement } = require("../utils/queryStatement"); 
class Gallery {
  constructor(file_name, file_path, file_for, issued_date) {
    this.file_name = file_name;
    this.file_path = file_path;
    this.file_for = file_for;
    this.issued_date = issued_date;
  }

  static async create(newImage) {
    const sql = `INSERT INTO gallery (file_name, file_path, file_for) VALUES (?, ?, ?)`;
    const values = [
      newImage.file_name,
      newImage.file_path,
      newImage.file_for,
    ];
    return await queryStatement(sql, values);
  }

  static async getAll() {
    const sql = `SELECT * FROM gallery`;
    return await queryStatement(sql);
  }
}

module.exports = Gallery;

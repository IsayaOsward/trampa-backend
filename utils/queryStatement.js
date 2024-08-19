const connection = require('../config/database');

const queryStatement = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {queryStatement};
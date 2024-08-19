const pool = require("../config/database");

class userModel {
  static findUserByEmail(email, callback) {
    const statement = "SELECT * FROM users WHERE email = ?";
    pool.query(statement, [email], (err, results) => {
      if (typeof callback === "function") {
        if (err) return callback(err, null);
        callback(null, results[0]);
      } else {
        throw new TypeError("Callback is not a function");
      }
    });
  }

  static findUserByPhone(phone_number, callback) {
    const statement = "SELECT * FROM users WHERE phone_number = ?";
    pool.query(statement, [phone_number], (err, results) => {
      if (typeof callback === "function") {
        if (err) return callback(err, null);
        callback(null, results[0]);
      } else {
        throw new TypeError("Callback is not a function");
      }
    });
  }

  static findByUserID(userID, callback) {
    const sql = "SELECT * FROM users WHERE user_id = ?";
    pool.query(sql, [userID], (err, results) => {
      if (typeof callback === "function") {
        if (err) return callback(err, null);
        callback(null, results[0]);
      } else {
        throw new TypeError("Callback is not a function");
      }
    });
  }

  static registerUser(userData, callback) {
    const { user_id, first_name, lastname, gender, phone_number, email } =
      userData;
    const registerSQL =
      "INSERT INTO users(user_id, first_name, lastname, gender, phone_number, email) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(
      registerSQL,
      [user_id, first_name, lastname, gender, phone_number, email],
      (err, results) => {
        if (typeof callback === "function") {
          if (err) return callback(err, null);
          callback(null, results);
        } else {
          throw new TypeError("Callback is not a function");
        }
      }
    );
  }

  // function to save credentials to the database
  static saveCredentials(user_id, password_hash, role, callback) {
    const statement =
      "INSERT INTO credentials (user_id, password_hash, role) VALUES (?, ?, ?)";
    pool.query(statement, [user_id, password_hash, role], (err, results) => {
      if (typeof callback === "function") {
        if (err) return callback(err, null);
        callback(null, results);
      } else {
        throw new TypeError("Callback is not a function");
      }
    });
  }


// a transaction based execution to ensure that all details are filled before commiting a change
  static registerUserWithCredentials(userData, credentialsData, callback) {
    pool.getConnection((err, connection) => {
      if (err) return callback(err, null);

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err, null);
        }

        const registerSQL =
          "INSERT INTO users(user_id, first_name, lastname, gender, phone_number, email) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(
          registerSQL,
          [
            userData.user_id,
            userData.first_name,
            userData.lastname,
            userData.gender,
            userData.phone_number,
            userData.email,
          ],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err, null);
              });
            }

            const credentialsSQL =
              "INSERT INTO credentials (user_id, password_hash, role) VALUES (?, ?, ?)";
            connection.query(
              credentialsSQL,
              [
                credentialsData.user_id,
                credentialsData.password_hash,
                credentialsData.role,
              ],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    callback(err, null);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      callback(err, null);
                    });
                  }

                  connection.release();
                  callback(null, {
                    success: true,
                    message: "User registered successfully",
                  });
                });
              }
            );
          }
        );
      });
    });
  }
}

module.exports = userModel;

const pool = require("../config/database");
const { queryStatement } = require("../utils/queryStatement");
const bcrypt = require("bcrypt");

class userModel {
  static checkUserByEmail(email, callback) {
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
    console.log("findByUserID called with userID:", userID); // Log
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

  static async findUserById(userId, isDeleted) {
    const sql = "SELECT * FROM users WHERE user_id = ? AND isDeleted = ?";
    const results = await queryStatement(sql, [userId, isDeleted]);
    return results[0];
  }

  static async setUserPassword(userId, userPassword) {
    try {
      const sql = "UPDATE credentials SET password_hash = ? WHERE user_id = ?";

      const passwordHash = await this.hashPassword(userPassword);
      const results = await queryStatement(sql, [passwordHash, userId]);

      return results.affectedRows; // Return number of affected rows for confirmation
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error; // Re-throw the error for higher-level handling if necessary
    }
  }

  static async findMembershipByUserId(userId, isDeleted) {
    const sql = "SELECT * FROM membership WHERE user_id = ? AND isDeleted = ?";
    const results = await queryStatement(sql, [userId, isDeleted]);
    return results[0];
  }

  static registerUser(userData, callback) {
    console.log("registerUser called with userData:", userData); // Log
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

  static saveCredentials(user_id, password_hash, role, callback) {
    console.log("saveCredentials called with user_id:", user_id, "role:", role); // Log
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

  static registerUserWithCredentials(userData, credentialsData, callback) {
    console.log("registerUserWithCredentials called with userData:", userData); // Log
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection:", err);
        return callback(err, null);
      }

      connection.beginTransaction((err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          connection.release();
          return callback(err, null);
        }

        const registerSQL =
          "INSERT INTO users(user_id, first_name, lastname, gender, phone_number, email, nationality, salutation, employmentStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(
          registerSQL,
          [
            userData.user_id,
            userData.first_name,
            userData.lastname,
            userData.gender,
            userData.phone_number,
            userData.email,
            userData.nationality,
            userData.salutation,
            userData.hasJob,
          ],
          (err) => {
            if (err) {
              console.error("Error inserting user:", err);
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
                  console.error("Error inserting credentials:", err);
                  return connection.rollback(() => {
                    connection.release();
                    callback(err, null);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    return connection.rollback(() => {
                      connection.release();
                      callback(err, null);
                    });
                  }

                  console.log("User registered successfully"); // Log
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

  // Logging in logics

  static async findUserByEmail(email) {
    const sql = `SELECT users.user_id AS user_id, users.first_name, users.lastname, users.email, credentials.password_hash, credentials.role, credentials.loginAttempts FROM users JOIN credentials ON users.user_id = credentials.user_id WHERE users.email = ? LIMIT 1;`;
    const results = await queryStatement(sql, [email]);
    return results[0];
  }

  static async getRegisteredUsersPending(status) {
    // console.log("findUserByEmail (login) called with email:", email); // Log
    const sql = `SELECT users.first_name, users.lastname, users.email,users.phone_number FROM users WHERE users.status = ?`;
    const results = await queryStatement(sql, [status]);
    return results[0];
  }

  static async incrementLoginAttempts(user_id) {
    console.log("incrementLoginAttempts called with user_id:", user_id); // Log
    const sql =
      "UPDATE credentials SET loginAttempts = loginAttempts + 1 WHERE user_id = ?";
    await queryStatement(sql, [user_id]);
  }

  static async resetLoginAttempts(user_id) {
    console.log("resetLoginAttempts called with user_id:", user_id); // Log
    const sql = "UPDATE credentials SET loginAttempts = 0 WHERE user_id = ?";
    await queryStatement(sql, [user_id]);
  }

  //fetching applicants logics
  static async fetchApplicants() {
    console.log("Fetching applicants"); // Log
    const awaits = 1;
    const sql =
      "SELECT id,first_name,lastname,gender,phone_number,email,status FROM users WHERE users.status =?";
    const results = await queryStatement(sql, [awaits]);

    return results;
  }

  // FETCH ALL USERS FROM THE DATABASE
  static async fetchAllApplicants() {
    console.log("Fetching applicants"); // Log
    const isDeleted = "false";
    const sql =
      "SELECT user_id,first_name,lastname,gender,phone_number,email,status FROM users WHERE users.isDeleted =?";
    const results = await queryStatement(sql, [isDeleted]);
    return results;
  }

  static async fetchPayments() {
    console.log("Fetching applicants"); // Log
    const pending = 593287;
    const sql =
      "SELECT id,first_name,lastname,gender,phone_number,email,status FROM users WHERE users.status =?";
    const results = await queryStatement(sql, [pending]);
    return results;
  }

  // Single or bulk approve applicants
  static async approveApplicants(phoneNumbers, statuses) {
    if (!Array.isArray(phoneNumbers)) {
      phoneNumbers = [phoneNumbers];
      statuses = [statuses];
    }

    // Check if phoneNumbers and statuses are arrays and have the same length
    if (phoneNumbers.length !== statuses.length) {
      throw new Error(
        "Phone numbers and statuses arrays must have the same length."
      );
    }

    // Prepare the SQL for bulk update using CASE
    const sql = `
      UPDATE users 
      SET status = CASE phone_number 
      ${phoneNumbers.map((_, index) => `WHEN ? THEN ?`).join(" ")}
      END 
      WHERE phone_number IN (${phoneNumbers.map(() => "?").join(",")});
    `;

    // Flatten the params array (phone_number and status alternately, followed by the phone_numbers at the end)
    const params = phoneNumbers
      .reduce((arr, phone, index) => {
        return arr.concat(phone, statuses[index]);
      }, [])
      .concat(phoneNumbers);

    // Execute the query
    const results = await queryStatement(sql, params);
    return results;
  }

  static async getUserByPhoneNumber(phoneNumber) {
    const sql =
      "SELECT users.user_id, users.first_name, users.lastname, users.email FROM users  WHERE users.phone_number = ?";
    const results = await queryStatement(sql, [phoneNumber]);
    return results;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

module.exports = userModel;

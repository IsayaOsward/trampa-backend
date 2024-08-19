const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const generateUserID = require("../utils/generateUserID");
const {
  isValidEmail,
  isValidName,
  isValidPassword,
} = require("../utils/validation");

// Hash password using bcrypt
async function hashPassword(password) {
  const saltRounds = 10; // You can adjust the salt rounds as needed
  return bcrypt.hash(password, saltRounds);
}

// This is a function that receives data from the frontend and sends it to the model
async function registerController(req, res) {
  try {
    let { first_name, lastname, gender, phone_number, email, password, role } =
      req.body;

    // Default role to "user" if not provided
    if (!role) {
      role = "user";
    }

    // Revalidate user inputs since they are also done in frontend
    if (!first_name || !lastname || !email || !gender || !phone_number) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email address" });
    }
    if (!isValidName(first_name) || !isValidName(lastname)) {
      return res
        .status(400)
        .send({ success: false, message: "Names can only contain letters" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({
        success: false,
        message:
          "Password must be at least 8 characters long and include both letters, special characters, and numbers",
      });
    }

    // Verify whether a new user is using an existing email
    userModel.findUserByEmail(email, (err, emailExist) => {
      if (err) {
        console.error("Error checking email existence:", err);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
        });
      }

      if (emailExist) {
        return res
          .status(409)
          .send({ success: false, message: "Please use another email" });
      }

      // Verify whether a new user is using an existing phone number
      userModel.findUserByPhone(phone_number, (err, existingPhone) => {
        if (err) {
          console.error("Error checking phone existence:", err);
          return res.status(500).send({
            success: false,
            message: "Internal server error",
          });
        }

        if (existingPhone) {
          return res.status(409).send({
            success: false,
            message: "Please use another phone number",
          });
        }

        // Generate a unique user ID
        generateUniqueUserID()
          .then((user_id) => {
            // Hash the password
            return hashPassword(password).then((password_hash) => {
              // Proceed with creating a new user and save credentials in a transaction
              userModel.registerUserWithCredentials(
                {
                  user_id,
                  first_name,
                  lastname,
                  gender,
                  phone_number,
                  email,
                },
                {
                  user_id,
                  password_hash,
                  role,
                },
                (err, registerResult) => {
                  if (err) {
                    console.error("Error registering user:", err);
                    return res.status(500).send({
                      success: false,
                      message: "Internal server error",
                    });
                  }

                  return res.status(201).send({
                    // success: true,
                    // message: "User registered successfully",
                    data: registerResult,
                  });
                }
              );
            });
          })
          .catch((error) => {
            console.error(
              "Error generating user ID or hashing password:",
              error
            );
            res.status(500).send({
              success: false,
              message: "Internal server error",
            });
          });
      });
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error has occurred",
    });
  }
}

// Generate a unique user ID
async function generateUniqueUserID() {
  let user_id;
  let userIdExist;

  do {
    user_id = generateUserID();

    // Check if the generated user ID already exists
    userIdExist = await new Promise((resolve, reject) => {
      userModel.findByUserID(user_id, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  } while (userIdExist);

  return user_id;
}

module.exports = { registerController };

const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const generateUserID = require("../utils/generateUserID");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const {
  isValidEmail,
  isValidName,
  isValidPassword,
} = require("../utils/validation");

// Hash password using bcrypt
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Login Controller
async function loginController(req, res) {
  console.log("Login request received:", req.body); // Log the incoming request

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findUserByEmail(email);
    console.log("The find user by email result "+user);
    

    // If user is not found
    if (!user) {
      console.log("User is not found");
      
      return res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    }

    // Check if the account is locked due to too many incorrect login attempts
    if (user.loginAttempts >= 5) {
      return res.status(403).send({
        success: false,
        message:
          "Your account is locked due to too many incorrect login attempts.",
      });
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      // Increment login attempts on failed login
      await userModel.incrementLoginAttempts(user.user_id);
      return res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    }

    // Reset login attempts on successful login
    await userModel.resetLoginAttempts(user.user_id);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Prepare the response data
    const response = {
      username: `${user.first_name} ${user.lastname}`,
      email: user.email,
      accessToken,
      refreshToken,
    };

    // Send response
    return res.status(200).send({ success: true, data: response });
  } catch (error) {
    console.error("Error in loginController:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}

// Register Controller
async function registerController(req, res) {
  console.log("Register request received:", req.body); // Log the incoming request

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
    userModel.checkUserByEmail(email, (err, emailExist) => {
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
                    success: true,
                    message: "User registered successfully",
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

module.exports = { registerController, loginController };

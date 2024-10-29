const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const generateUserID = require("../utils/generateUserID");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const {
  isValidEmail,
  isValidName,
  isValidPassword,
} = require("../utils/validation");
const {sendEmailMessage} = require("../services/emailService");
const SmsService = require("../services/smsService");

// Hash password using bcrypt
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Login Controller
async function loginController(req, res) {

  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {

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

    var code = "0000";
    if(user.role =="admin")
    {
      code = "9000";
    }
    else if (user.role == "user"){
      code = "5000";
    }
    // Prepare the response data
    const response = {
      username: `${user.first_name} ${user.lastname}`,
      email: user.email,
      code: code,
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
// Register Controller
async function registerController(req, res) {
  console.log("Register request received: ", req.body);
  var password;
  try {
    let {
      fname,
      lname,
      gender,
      phone,
      salutation,
      educationLevel,
      workingOrg,
      nationality,
      email,
      role,
    } = req.body;


    password = lname.toUpperCase();
    let hasJob;
    if(!workingOrg)
    {
      hasJob=true;
    }
    // Default role to "user" if not provided
    if (!role) {
      role = "user";
    }

    // Revalidate user inputs since they are also done in frontend
    if (!fname || !lname || !email || !gender || !phone || !salutation || !nationality || !hasJob || !educationLevel) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email address" });
    }
    if (!isValidName(fname) || !isValidName(lname)) {
      return res
        .status(400)
        .send({ success: false, message: "Names can only contain letters" });
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
      userModel.findUserByPhone(phone, (err, existingPhone) => {
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
                  fname,
                  lname,
                  gender,
                  phone,
                  email,
                  salutation,
                  educationLevel,hasJob,
                  nationality,
                  attachmentEducation
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

// fetching all users regadless of their status
// fetching pending applicants Controller
async function fetchAllUsersController(req, res) {
  try {
    // Find user by email
    const applicants = await userModel.fetchAllApplicants();
    // approveApplicants;
    // Send response
    return res.status(200).send({ success: true, data: applicants });
  } catch (error) {
    console.error("Error in FetchApplicantsController:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}









//
// fetching pending applicants Controller
async function fetchApplicantsController(req, res) {
  try {
    // Find user by email
    const applicants = await userModel.fetchApplicants();
    // approveApplicants;
    // Send response
    return res.status(200).send({ success: true, data: applicants });
  } catch (error) {
    console.error("Error in FetchApplicantsController:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}









// fetching pending applicants Controller
async function fetchPaymentController(req, res) {
  try {
    // Find user by email
    const applicants = await userModel.fetchPayments();
    // approveApplicants;
    // Send response
    return res.status(200).send({ success: true, data: applicants });
  } catch (error) {
    console.error("Error in FetchApplicantsController:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}

async function approveApplicantsController(req, res) {
  try {
    const data = req.body; // Can be a single object or an array of objects

    // Check if data is an array or single object
    const applicants = Array.isArray(data) ? data : [data];

    // Validate that each object contains phone_number and status
    for (let i = 0; i < applicants.length; i++) {
      const { phone_number, status } = applicants[i];
      if (!phone_number || status === undefined) {
        return res.status(400).send({
          success: false,
          message: "Each applicant must have a phone number and a status.",
        });
      }
    }

    // Process each applicant (phone_number and status)
    const results = [];
    for (let applicant of applicants) {
      const { phone_number, status } = applicant;

      // Set message and email subject based on status
      let message;
      let subject;
      if (status === 989898) {
        message = `Hello, your account has been rejected. Please contact support for more information.`;
        subject = "Account Rejected";
      } else if (status === 126798) {
        message = `Hello, your payments have been completed, and your account is now activated!`;
        subject = "Account Activated";
      } else {
        message = `Hello, your account has been approved successfully. Kindly login to complete the registration process.`;
        subject = "Account Approved";
      }

      const result = await userModel.approveApplicants(phone_number, status);

      if (result.affectedRows === 0) {
        results.push({
          phone_number,
          success: false,
          message: "User not found or no update made.",
        });
        continue; // Skip to the next applicant
      }

      // Fetch the user details after approval or rejection
      const user = await userModel.getUserByPhoneNumber(phone_number);

      // Send SMS and email to the user
      const smsResponse = await SmsService.sendMessages(
        [user.phone_number],
        message
      );
      const emailResponse = await sendEmailMessage(
        user.email,
        subject,
        message
      );

      // Add result to the results array
      results.push({
        phone_number,
        email: user.email,
        sms: smsResponse,
        email: emailResponse,
        success: smsResponse.success && emailResponse.success,
        message:
          smsResponse.success && emailResponse.success
            ? "User notified successfully."
            : "User processed but failed to notify via SMS or email.",
      });
    }

    // Send success response
    return res.status(200).send({
      success: true,
      message: "Applicants processed successfully.",
      results,
    });
  } catch (error) {
    console.error("Error in ApproveApplicantsController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


async function remindApplicantsController(req, res) {
  try {
    const data = req.body;

    // Check if data is an array or single object
    const applicants = Array.isArray(data) ? data : [data];

    // Process each applicant
    const results = [];
    for (let applicant of applicants) {
      const { phone_number } = applicant;

      // Fetch user details from the database
      const user = await userModel.getUserByPhoneNumber(phone_number);

      if (!user) {
        results.push({
          phone_number,
          success: false,
          message: "User not found.",
        });
        continue; // Skip to the next applicant
      }

      // Set the message and subject
      const message = `Hello ${user.first_name} ${user.lastname}, your account is pending activation. Please pay your bills to activate your account.`;
      const subject = "Account Activation Reminder";

      // Send SMS and email to the user
      const smsResponse = await SmsService.sendMessages(
        [user.phone_number],
        message
      );
      const emailResponse = await sendEmailMessage(
        user.email,
        subject,
        message
      );

      // Add result to the results array
      results.push({
        phone_number,
        email: user.email,
        sms: smsResponse,
        email: emailResponse,
        success: smsResponse.success && emailResponse.success,
        message:
          smsResponse.success && emailResponse.success
            ? "User notified successfully."
            : "User processed but failed to notify via SMS or email.",
      });
    }

    // Send success response
    return res.status(200).send({
      success: true,
      message: "Reminders sent successfully.",
      results,
    });
  } catch (error) {
    console.error("Error in remindApplicantsController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}



async function pendingRegController(req, res) {
  console.log("Request received:", req.body); // Log the incoming request

  const pending = req.query.pending;

  try {
    // Find user by email
    const user = await userModel.findUserByEmail(pending);
    console.log("The find user by email result " + user);

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





async function getUserAndMembership(req, res) {
    const { userId } = req.params;
    
    console.log(userId);
    
    try {
      const user = await userModel.findUserById(userId,'false');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const membership = await userModel.findMembershipByUserId(userId,'false');
      res.json({ user, membership });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data', error });
    }
  }

async function setUserPassword(req, res) {
  const { userId, password } = req.body;

  try {
    // Update user password
    const result = await userModel.setUserPassword(userId, password);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user role from the credentials table
    const role = await userModel.getUserRoleByUserId(userId);

    // Return user role in the response
    res.json({ userId, role });
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({ message: "Error updating password", error });
  }
}



module.exports = {
  registerController,
  loginController,
  fetchApplicantsController,
  approveApplicantsController,
  pendingRegController,
  fetchPaymentController,
  fetchAllUsersController,
  remindApplicantsController,
  getUserAndMembership,
  setUserPassword,
};

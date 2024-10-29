const Passport = require("../models/passportModel");
const path = require("path");

exports.registerPassport = async (req, res) => {  
  try {
    const { user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Adjust the image path to match the format expected by the database
    const image_path = path
      .join("uploads/passports", req.file.filename)
      .replace(/\\/g, "/");
    const newPassport = new Passport(image_path, user_id);
    await Passport.create(newPassport);

    res.status(201).json({
      success: true,
      message: "Passport registered successfully",
      data: newPassport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while registering the passport",
    });
  }
};

exports.getPassportDetails = async (req, res) => {
  try {
    const { user_id } = req.params;

    const passportDetails = await Passport.getByUserId(user_id);

    if (passportDetails.length === 0) {
      return res.status(404).json({ error: "No passport found for this user" });
    }

    // Adjust the image path format if necessary
    passportDetails.forEach((detail) => {
      detail.image_path = detail.image_path.replace(/\\/g, "/");
    });

    res.status(200).json({
      success: true,
      data: passportDetails[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the passport details",
    });
  }
};

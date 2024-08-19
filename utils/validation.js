const validator = require("validator");

function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidPassword(password) {
  // Check that the password is at least 8 characters long
  // and contains at least one letter and one number.
  return (
    validator.isLength(password, { min: 8 }) &&
    /[a-zA-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

function isValidName(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

function formatAndValidatePhoneNumber(phoneNumber) {
  let cleaned;
  // Check if the phone number starts with '+'
  if (phoneNumber.startsWith("+")) {
    cleaned = phoneNumber.substring(1); // Remove '+'
  } else if (phoneNumber.length === 10 && phoneNumber.startsWith("0")) {
    // If the phone number is 10 digits long and starts with '0'
    cleaned = "255" + phoneNumber.substring(1); // Replace '0' with '255'
  } else {
    cleaned = phoneNumber;
  }
  // Validate that the cleaned phone number is 12 digits long and contains only digits
  return cleaned.length === 12 && /^[0-9]+$/.test(cleaned) ? cleaned : null;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  formatAndValidatePhoneNumber,
};

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rateLimit = require("express-rate-limit");
// request remiter to registration route to prevent unauthorized actions

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 5 requests per windowMs
  message:
    "Too many registration attempts from this IP, please try again later.",
});
//route for registration
router.post("/register/", registerLimiter, userController.registerController);

//route for login
router.post("/login/",userController.loginController);

module.exports = router;

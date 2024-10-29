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


//route for fetching user whose registration awaits approval.
router.get("/pending/registration/",userController.pendingRegController);

//route for fetching applicants data
router.get("/fetch/applicants",userController.fetchApplicantsController);


//route for fetching applicants data
router.get("/fetch/all/users",userController.fetchAllUsersController);

//
router.get("/fetch/payments", userController.fetchPaymentController);

//approve applicants
router.post("/update/applicants", userController.approveApplicantsController);

router.post("/remind/applicants", userController.remindApplicantsController);

router.get("/user/:userId", userController.getUserAndMembership);

router.put("/update/user/", userController.setUserPassword);

module.exports = router;

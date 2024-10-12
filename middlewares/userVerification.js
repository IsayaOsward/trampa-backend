const { queryStatement } = require("../utils/queryStatement"); // Adjust the path as necessary

const userVerificationMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userStatusQuery = `SELECT status, loginAttempts FROM credentials WHERE user_id = ? AND isDeleted = ?`;

    const userStatusResult = await queryStatement(userStatusQuery, [userId,0]);

    if (userStatusResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { status, login_attempts } = userStatusResult[0];

    // Check if user is banned
    if (status === 1) {
      return res.status(403).json({ message: "User is banned" });
    }

    // Check if user exceeded login attempts
    if (login_attempts >= 5) {
      return res
        .status(403)
        .json({ message: "Too many failed login attempts" });
    }

    // Query to check membership status
    const membershipQuery = `
      SELECT expiry_date 
      FROM membership 
      WHERE user_id = ?`;

    const membershipResult = await queryStatement(membershipQuery, [userId]);

    if (membershipResult.length === 0) {
      return res.status(403).json({ message: "No active membership found" });
    }

    const { expiration_date } = membershipResult[0];
    const currentDate = new Date();

    // Check if membership has expired
    if (new Date(expiration_date) < currentDate) {
      return res.status(403).json({ message: "Membership has expired" });
    }

    // If all checks pass, move to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = userVerificationMiddleware;

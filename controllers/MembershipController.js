const MembershipModel = require("../models/MembershipModel");
const generateUniqueMembershipId = require("../utils/generateUniqueMembershipId");

class MembershipController {
  /**
   * Generates a new membership ID and saves it to the database.
   * Expects `user_id` in the request body.
   */
  static async generateMembershipId(req, res) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res
          .status(400)
          .json({ success: false, message: "user_id is required" });
      }

      // Fetch user details from the database
      const userDetails = await MembershipModel.getUserDetails(user_id);

      if (!userDetails) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Extract user first name and last name
      const { first_name, lastname } = userDetails;

      // Generate unique membership_id
      const membership_id = await generateUniqueMembershipId(
        first_name,
        lastname
      );


      // Prepare membership data
      const membershipData = { membership_id, user_id};

      // Save the membership data to the database
      await MembershipModel.saveMembership(membershipData);

      return res.status(201).json({
        success: true,
        message: "Membership ID generated successfully",
        data: {
          membership_id,
        },
      });
    } catch (error) {
      console.error("Error generating membership ID:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
  }

  static async getMemberships(req, res) {
    try {
      const { sortBy, order, price, startDate, endDate } = req.query;

      // Validate date formats if provided
      if (
        (startDate && isNaN(Date.parse(startDate))) ||
        (endDate && isNaN(Date.parse(endDate)))
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid date format for startDate or endDate",
          });
      }

      const filters = {
        sortBy,
        order,
        price,
        startDate,
        endDate,
      };

      const memberships = await MembershipModel.getMemberships(filters);

      return res.status(200).json({
        success: true,
        data: memberships,
      });
    } catch (error) {
      console.error("Error retrieving memberships:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
  }
}

module.exports = MembershipController;
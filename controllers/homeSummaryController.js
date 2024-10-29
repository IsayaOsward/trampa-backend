const HomeSummaryModel = require("../models/homeSummaryModel");

class HomeSummaryController {
  static async fetchHomeSummary(req, res) {
    try {
      const results = await HomeSummaryModel.fetchMembershipCount();
      console.log(results);

      res.status(200).json({
        success: true,
        message: "Successfully",
        data: results,
      });
    } catch (error) {
      console.error("Error in fetchHomeSummary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch events",
        error: error.message,
      });
    }
  }
}

module.exports = HomeSummaryController;

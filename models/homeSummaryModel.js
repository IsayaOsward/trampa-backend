const { queryStatement } = require("../utils/queryStatement");

class HomeSummaryModel {
  static async fetchMembershipCount() {
    const membersCountSql = `SELECT COUNT(*) AS total_memberships FROM membership WHERE isDeleted = ?`;
    const membersCount = await queryStatement(membersCountSql, ["false"]);

    const pendingRegCountSql = `SELECT COUNT(*) AS total_pendingReg FROM users WHERE isDeleted = ? AND status=?`;
    const pendingReg = await queryStatement(pendingRegCountSql, ["false", 1]);

    const blogCountSql = `SELECT COUNT(*) AS total_blogs FROM blog_posts WHERE isDeleted = ?`;
    const blogCount = await queryStatement(blogCountSql, ["false"]);

    const upcomingEventsSql = `SELECT COUNT(*) AS total_upcoming_events FROM register_events WHERE STR_TO_DATE(date, '%Y-%m-%d') > CURDATE() AND isDeleted = ?`;
    const upcomingEvents = await queryStatement(upcomingEventsSql, ["false"]);

    // Access the counts from the result of queryStatement
    const result = {
      total_memberships: membersCount[0].total_memberships,
      total_pendingReg: pendingReg[0].total_pendingReg,
      total_blogs: blogCount[0].total_blogs,
      upcoming_events: upcomingEvents[0].total_upcoming_events,
    };

    return result;
  }
}

module.exports = HomeSummaryModel;

const crypto = require("crypto");
const { queryStatement } = require("../utils/queryStatement");

/**
 * Generates a unique membership ID in the format "TR-MM-YYHHDK-FL"
 * Ensures that the generated ID is unique in the `membership` table.
 *
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} - Unique membership ID
 */
const generateUniqueMembershipId = async (firstName, lastName) => {
  let membershipId;
  console.log("User is called " + firstName + " " + lastName);

  let isUnique = false;

  // Extract initials
  const FL = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  while (!isUnique) {
    const now = new Date();
    const MM = String(now.getMonth() + 1).padStart(2, "0"); // Current month
    const YY = String(now.getFullYear()).slice(-2); // Last two digits of the year
    const HHDK = `${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`; // Hour and minutes

    membershipId = `TR-${MM}-${YY}${HHDK}-${FL}`;

    // Check uniqueness
    const result = await queryStatement(
      "SELECT COUNT(*) AS count FROM membership WHERE membership_id = ?",
      [membershipId]
    );
    if (result[0].count === 0) {
      isUnique = true;

    } 
    else {
      // If not unique, wait a minute to change the timestamp
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }

  return membershipId;
};

module.exports = generateUniqueMembershipId;

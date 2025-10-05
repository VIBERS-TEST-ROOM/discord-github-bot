// utils/validation.js
const { Octokit } = require("@octokit/rest");

// GitHub client
const octokit = new Octokit({ auth: process.env.DISCORD_GITHUB_TOKEN });

module.exports = {
  /**
   * Check if a bounty/issue is open
   * @param {string} owner - GitHub repo owner
   * @param {string} repo - GitHub repo name
   * @param {string} bountyId - Bounty ID or issue title identifier
   * @returns {object|null} - Returns the issue object if open, null otherwise
   */
  async isBountyOpen(owner, repo, bountyId) {
    try {
      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: "open",
      });

      const issue = issues.find((i) => i.title.toLowerCase().includes(bountyId.toLowerCase()));
      return issue || null;
    } catch (err) {
      console.error("Error checking bounty status:", err);
      return null;
    }
  },

  /**
   * Check if a user has already submitted to a bounty
   * @param {string} owner - GitHub repo owner
   * @param {string} repo - GitHub repo name
   * @param {number} issueNumber - GitHub issue number
   * @param {string} username - Discord username
   * @returns {boolean} - True if already submitted
   */
  async hasUserSubmitted(owner, repo, issueNumber, username) {
    try {
      const { data: comments } = await octokit.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
      });

      return comments.some((c) => c.user.login === username);
    } catch (err) {
      console.error("Error checking previous submissions:", err);
      return false;
    }
  },

  /**
   * Optional: check if user is allowed to submit based on role
   * @param {object} member - Discord guild member object
   * @param {string[]} allowedRoles - Array of role IDs allowed to submit
   * @returns {boolean}
   */
  canUserSubmit(member, allowedRoles) {
    if (!member || !allowedRoles || allowedRoles.length === 0) return true; // default allow
    return member.roles.cache.some((role) => allowedRoles.includes(role.id));
  },
};

const { Octokit } = require("@octokit/rest");
const { getTemplate } = require("./templates"); // Import template service

// Load GitHub token from environment variables
const DISCORD_GITHUB_TOKEN = process.env.DISCORD_GITHUB_TOKEN;

// Initialize Octokit client
const octokit = new Octokit({ auth: DISCORD_GITHUB_TOKEN });

/**
 * Create a new GitHub issue in the specified repo
 * @param {string} owner - GitHub org/user
 * @param {string} repo - Repository name
 * @param {string} title - Issue title
 * @param {string} templateName - Optional template name to populate issue body
 * @param {Array} labels - Optional array of labels
 * @param {string} customBody - Optional override body if needed
 * @returns {Promise<object>} GitHub issue data
 */
async function createIssue({ owner, repo, title, templateName = null, labels = [], customBody = "" }) {
  try {
    let body = customBody;

    // If a templateName is provided, fetch template content
    if (templateName) {
      const templateContent = await getTemplate(templateName);
      if (templateContent) {
        body = templateContent;
      }
    }

    const result = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
    });
    return result.data;
  } catch (err) {
    console.error("Error creating GitHub issue:", err);
    throw err;
  }
}

/**
 * Add a comment to an existing GitHub issue
 */
async function addComment({ owner, repo, issueNumber, comment }) {
  try {
    const result = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: comment,
    });
    return result.data;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
}

/**
 * Get issue by number
 */
async function getIssue({ owner, repo, issueNumber }) {
  try {
    const result = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });
    return result.data;
  } catch (err) {
    console.error("Error fetching GitHub issue:", err);
    throw err;
  }
}

/**
 * Close a GitHub issue
 */
async function closeIssue({ owner, repo, issueNumber }) {
  try {
    const result = await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: "closed",
    });
    return result.data;
  } catch (err) {
    console.error("Error closing GitHub issue:", err);
    throw err;
  }
}

module.exports = {
  createIssue,
  addComment,
  getIssue,
  closeIssue,
};

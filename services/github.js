import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup for ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load channel → repo mappings
const channelsPath = path.join(__dirname, "../config/channels.json");
let channels = {};
try {
  channels = JSON.parse(fs.readFileSync(channelsPath, "utf8"));
  console.log(`📁 Loaded channel → repo mappings: ${Object.keys(channels).length}`);
} catch (err) {
  console.error("⚠️ Could not load channels.json:", err);
}

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Create a new GitHub issue based on Discord channel mapping
 */
export async function createIssue({ channelId, title, body }) {
  try {
    const repoFullName = channels[channelId];
    if (!repoFullName) throw new Error(`No GitHub repo mapped for channel ${channelId}`);

    const [owner, repo] = repoFullName.split("/");
    const issue = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
    });

    console.log(`✅ Created issue in ${repoFullName}: #${issue.data.number}`);
    return issue;
  } catch (err) {
    console.error("❌ Failed to create issue:", err);
    throw err;
  }
}

/**
 * Add a comment to an existing issue (used for bounty submissions)
 */
export async function createComment({ owner, repo, issue_number, body }) {
  try {
    const comment = await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });
    console.log(`💬 Added comment to issue #${issue_number} in ${repo}`);
    return comment.data;
  } catch (err) {
    console.error("❌ Error creating comment:", err);
    throw err;
  }
}

/**
 * Fetch a single GitHub issue (used for validation checks)
 */
export async function getIssue({ owner, repo, issue_number }) {
  try {
    const issue = await octokit.issues.get({
      owner,
      repo,
      issue_number,
    });
    return issue.data;
  } catch (err) {
    console.error("❌ Error fetching issue:", err);
    throw err;
  }
}

export default { createIssue, createComment, getIssue };

const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

// Load Discord → GitHub repo mapping
const channelsPath = path.join(__dirname, "../config/channels.json");
const channelRepoMap = JSON.parse(fs.readFileSync(channelsPath, "utf8"));

// GitHub client
const octokit = new Octokit({
  auth: process.env.DISCORD_GITHUB_TOKEN,
});

async function createIssue({ channelId, title, body }) {
  const repoFullName = channelRepoMap[channelId];

  if (!repoFullName) {
    throw new Error(`❌ No repo mapping found for channel ID ${channelId}`);
  }

  const [owner, repo] = repoFullName.split("/");

  try {
    const issue = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body, // 👈 ensure body is included!
    });

    return issue;
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
}

module.exports = { createIssue };

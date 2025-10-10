const { Octokit } = require("@octokit/rest");
const channels = require("../config/channels.json");

const octokit = new Octokit({ auth: process.env.DISCORD_GITHUB_TOKEN });

async function createIssue({ channelId, title, body }) {
  const repoInfo = channels[channelId];
  if (!repoInfo) throw new Error(`No GitHub repo mapped for channel ${channelId}`);
  const [owner, repo] = repoInfo.split("/");

  return await octokit.issues.create({
    owner,
    repo,
    title,
    body,
  });
}

async function addComment({ repoInfo, issueNumber, body }) {
  const [owner, repo] = repoInfo.split("/");
  return await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
}

module.exports = { createIssue, addComment };

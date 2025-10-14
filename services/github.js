// services/github.js
import { Octokit } from "@octokit/rest";
import channels from "../config/channels.json" assert { type: "json" };

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Resolve GitHub repo info from Discord channel ID.
 * @param {string} channelId
 * @returns {{ owner: string, repo: string }}
 */
function resolveRepo(channelId) {
  const repoFull = channels[channelId];
  if (!repoFull) throw new Error(`No repo mapping found for channel ${channelId}`);
  const [owner, repo] = repoFull.split("/");
  return { owner, repo };
}

/**
 * Create a new GitHub issue
 */
export async function createIssue({ channelId, title, body }) {
  const { owner, repo } = resolveRepo(channelId);
  const result = await octokit.issues.create({
    owner,
    repo,
    title,
    body,
  });
  return result;
}

/**
 * Fetch an existing GitHub issue
 */
export async function getIssue(channelId, issueNumber) {
  const { owner, repo } = resolveRepo(channelId);
  const { data } = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });
  return data;
}

/**
 * Add a comment to an existing GitHub issue
 */
export async function addComment(channelId, issueNumber, commentBody) {
  const { owner, repo } = resolveRepo(channelId);
  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: commentBody,
  });
  return data;
}

console.log("✅ GitHub service initialized.");


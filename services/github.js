import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---- Resolve Directory Paths ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Initialize GitHub Client ----
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in environment variables.");
  process.exit(1);
}

export const octokit = new Octokit({ auth: GITHUB_TOKEN });

// ---- Load Channel-to-Repo Mapping ----
// Instead of using "assert { type: 'json' }", we’ll load JSON manually.
const channelsPath = path.join(__dirname, "../config/channels.json");
let channels = {};

try {
  const fileData = fs.readFileSync(channelsPath, "utf-8");
  channels = JSON.parse(fileData);
  console.log("📁 Loaded channel → repo mappings:", Object.keys(channels).length);
} catch (err) {
  console.error("⚠️ Could not load config/channels.json:", err);
}

// ---- Core Function: Create Issue ----
export async function createIssue({ channelId, title, body }) {
  try {
    const repoInfo = channels[channelId];
    if (!repoInfo) throw new Error(`No repository mapping found for channel ID ${channelId}`);

    const [owner, repo] = repoInfo.split("/");
    const issue = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
    });

    console.log(`✅ Created issue: ${issue.data.html_url}`);
    return issue;
  } catch (error) {
    console.error("❌ Error creating issue:", error);
    throw error;
  }
}

// ---- Core Function: Add Comment to Issue ----
export async function addComment({ channelId, issueNumber, comment }) {
  try {
    const repoInfo = channels[channelId];
    if (!repoInfo) throw new Error(`No repository mapping found for channel ID ${channelId}`);

    const [owner, repo] = repoInfo.split("/");
    const response = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: comment,
    });

    console.log(`💬 Added comment to issue #${issueNumber}`);
    return response;
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    throw error;
  }
}


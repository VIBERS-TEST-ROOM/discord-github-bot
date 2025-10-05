// commands/submit.js
const { Octokit } = require("@octokit/rest");
const { sendEphemeral } = require("../utils/messageUtils");
const validation = require("../utils/validation");
const channelsConfig = require("../config/channels.json");

// GitHub client
const octokit = new Octokit({ auth: process.env.DISCORD_GITHUB_TOKEN });

module.exports = {
  name: "submit",
  description: "Submit a response for an open bounty",
  async execute(message, args) {
    if (!args || args.length === 0) {
      return sendEphemeral(message, "⚠️ You must provide a submission in format: `BountyID | Your submission description | optional link`");
    }

    const channelId = message.channel.id;
    const repoMapping = channelsConfig[channelId];

    if (!repoMapping) {
      return sendEphemeral(message, "⚠️ This channel is not mapped to a GitHub repository.");
    }

    const { owner, repo } = repoMapping;

    // Expect format: BountyID | description | optional link
    const parts = args.join(" ").split("|").map((p) => p.trim());
    if (parts.length < 2) {
      return sendEphemeral(message, "⚠️ Submission must include BountyID and description.");
    }

    const [bountyId, description, link] = parts;

    try {
      // Fetch the issue matching bountyId
      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: "open",
      });

      const issue = issues.find((i) => i.title.toLowerCase().includes(bountyId.toLowerCase()));
      if (!issue) {
        return sendEphemeral(message, `⚠️ Bounty "${bountyId}" not found or already closed.`);
      }

      // Optional: check if user already submitted
      const { data: comments } = await octokit.issues.listComments({
        owner,
        repo,
        issue_number: issue.number,
      });

      const alreadySubmitted = comments.some((c) => c.user.login === message.author.username);
      if (alreadySubmitted) {
        return sendEphemeral(message, "⚠️ You have already submitted to this bounty.");
      }

      // Post submission as comment
      const submissionBody = `**Submission by:** ${message.author.username}\n**Description:** ${description}${link ? `\n**Link:** ${link}` : ""}`;

      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issue.number,
        body: submissionBody,
      });

      sendEphemeral(message, `✅ Your submission has been recorded for bounty "${bountyId}"!`);
    } catch (err) {
      console.error(err);
      sendEphemeral(message, "⚠️ Failed to submit to the bounty. Please try again later.");
    }
  },
};

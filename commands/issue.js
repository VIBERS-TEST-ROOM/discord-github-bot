// commands/issue.js
const { Octokit } = require("@octokit/rest");
const { getTemplate } = require("../services/templates");
const { sendEphemeral } = require("../utils/messageUtils");
const channelsConfig = require("../config/channels.json");

// GitHub client
const octokit = new Octokit({ auth: process.env.DISCORD_GITHUB_TOKEN });

module.exports = {
  name: "issue",
  description: "Create a GitHub issue from Discord with template support",
  async execute(message, args) {
    if (!args || args.length === 0) {
      return sendEphemeral(message, "⚠️ You must provide a template name or title|description.");
    }

    const channelId = message.channel.id;
    const repoMapping = channelsConfig[channelId];

    if (!repoMapping) {
      return sendEphemeral(message, "⚠️ No GitHub repository mapped to this channel.");
    }

    const { owner, repo } = repoMapping;

    // Determine if the user provided a template name
    let title, description;

    if (args[0].startsWith("template:")) {
      const templateName = args[0].replace("template:", "").trim();
      const template = getTemplate(templateName);

      if (!template) {
        return sendEphemeral(message, `⚠️ Template "${templateName}" not found.`);
      }

      title = template.title.replace("{{user}}", message.author.username);
      description = template.body.replace("{{user}}", message.author.username);
    } else {
      // Expect format: title|description
      if (!args.join(" ").includes("|")) {
        return sendEphemeral(message, "⚠️ Provide issue in format: `Title | Description`");
      }
      [title, description] = args.join(" ").split("|").map((s) => s.trim());
    }

    try {
      const result = await octokit.issues.create({
        owner,
        repo,
        title,
        body: description,
      });

      message.reply(`✅ Issue created: ${result.data.html_url}`);
    } catch (err) {
      console.error(err);
      sendEphemeral(message, "⚠️ Failed to create the GitHub issue.");
    }
  },
};

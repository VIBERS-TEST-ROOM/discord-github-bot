// commands/issue.js
const { SlashCommandBuilder } = require("discord.js");
const { createIssue } = require("../services/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("issue")
    .setDescription("Create a GitHub issue")
    .addStringOption(option =>
      option
        .setName("content")
        .setDescription("Title and description separated by |, e.g. 'Title | Description'")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("content");

    // Split into title and body
    const [rawTitle, rawBody] = input.split("|").map(s => s.trim());
    const title = rawTitle || "New issue from Discord";
    const body = rawBody || "No description provided.";

    await interaction.deferReply({ ephemeral: true });

    try {
      const result = await createIssue({
        channelId: interaction.channelId,
        title,
        body,
      });

      await interaction.editReply({
        content: `✅ Issue created: ${result.data.html_url}`,
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: "⚠️ Failed to create issue.",
      });
    }
  },
};

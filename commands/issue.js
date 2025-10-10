const { SlashCommandBuilder } = require("discord.js");
const { createIssue } = require("../services/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("issue")
    .setDescription("Create a GitHub issue in the mapped repo.")
    .addStringOption(option =>
      option
        .setName("content")
        .setDescription("Format: Title | Description")
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString("content");
    const [rawTitle, rawBody] = input.split("|").map(s => s.trim());
    const title = rawTitle || "New issue from Discord";
    const body = rawBody || "No description provided.";

    await interaction.deferReply({ ephemeral: true });

    try {
      const issue = await createIssue({
        channelId: interaction.channelId,
        title,
        body,
      });
      await interaction.editReply(`✅ Issue created: ${issue.data.html_url}`);
    } catch (err) {
      console.error("❌ Issue creation error:", err);
      await interaction.editReply("⚠️ Failed to create issue.");
    }
  },
};

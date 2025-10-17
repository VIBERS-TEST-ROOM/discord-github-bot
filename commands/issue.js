// commands/issue.js
import { SlashCommandBuilder } from "discord.js";
import { createIssue } from "../services/github.js";

export default {
  data: new SlashCommandBuilder()
    .setName("issue")
    .setDescription("Create a GitHub issue in the mapped repository.")
    .addStringOption(option =>
      option
        .setName("content")
        .setDescription("Use this format: Title | Description")
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
      await interaction.editReply(`✅ Issue created successfully:\n${issue.data.html_url}`);
    } catch (err) {
      console.error("❌ Failed to create issue:", err);
      await interaction.editReply("⚠️ Something went wrong creating the issue.");
    }
  },
};


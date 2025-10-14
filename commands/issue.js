import { SlashCommandBuilder } from "discord.js";
import { createIssue } from "../services/github.js";

export const data = new SlashCommandBuilder()
  .setName("issue")
  .setDescription("Create a GitHub issue from Discord.")
  .addStringOption(option =>
    option
      .setName("content")
      .setDescription("Enter: Title | Description")
      .setRequired(true)
  );

export async function execute(interaction) {
  const input = interaction.options.getString("content");
  const [rawTitle, rawBody] = input.split("|").map(s => s.trim());
  const title = rawTitle || "Untitled issue";
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
    console.error("❌ Error creating issue:", err);
    await interaction.editReply("⚠️ Failed to create issue.");
  }
}

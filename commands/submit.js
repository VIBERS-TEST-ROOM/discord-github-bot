import { SlashCommandBuilder } from "discord.js";
import { submitToIssue } from "../services/github.js";

export const data = new SlashCommandBuilder()
  .setName("submit")
  .setDescription("Submit work for a bounty or issue.")
  .addStringOption(option =>
    option
      .setName("bounty")
      .setDescription("The GitHub issue number or title.")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("submission")
      .setDescription("Your work: link, notes, etc.")
      .setRequired(true)
  );

export async function execute(interaction) {
  const bounty = interaction.options.getString("bounty");
  const submission = interaction.options.getString("submission");

  await interaction.deferReply({ ephemeral: true });

  try {
    const comment = await submitToIssue({
      channelId: interaction.channelId,
      bounty,
      submission,
      user: interaction.user.username,
    });

    await interaction.editReply(`✅ Submission added: ${comment.data.html_url}`);
  } catch (err) {
    console.error("❌ Error submitting:", err);
    await interaction.editReply("⚠️ Failed to submit work.");
  }
}

// commands/submit.js
import { SlashCommandBuilder } from "discord.js";
import { createComment } from "../services/github.js";
import { validateBountyOpen } from "../utils/validation.js";

export default {
  data: new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Submit your bounty entry or contribution.")
    .addStringOption(option =>
      option
        .setName("bounty_id")
        .setDescription("The GitHub issue number or bounty ID")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("submission")
        .setDescription("Your submission (link, description, or note)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const bountyId = interaction.options.getString("bounty_id");
    const submission = interaction.options.getString("submission");
    const channelId = interaction.channelId;
    const discordUser = interaction.user.tag;

    await interaction.deferReply({ ephemeral: true });

    try {
      // 1️⃣ Validate if bounty is open
      const isOpen = await validateBountyOpen(channelId, bountyId);
      if (!isOpen) {
        await interaction.editReply("⚠️ This bounty is closed or invalid.");
        return;
      }

      // 2️⃣ Post comment to GitHub issue
      const commentBody = `💬 **Submission by:** ${discordUser}\n\n${submission}`;
      const comment = await createComment({
        channelId,
        issueNumber: bountyId,
        body: commentBody,
      });

      await interaction.editReply(`✅ Submission posted successfully!\n🔗 ${comment.data.html_url}`);
    } catch (err) {
      console.error("❌ Submission error:", err);
      await interaction.editReply("⚠️ Failed to post your submission. Please try again.");
    }
  },
};


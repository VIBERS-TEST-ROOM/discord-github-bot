const { SlashCommandBuilder } = require("discord.js");
const { addComment } = require("../services/github");
const channels = require("../config/channels.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Submit work for a bounty.")
    .addStringOption(o => o.setName("bounty").setDescription("Bounty ID or Issue Number").setRequired(true))
    .addStringOption(o => o.setName("link").setDescription("Your submission link").setRequired(true))
    .addStringOption(o => o.setName("notes").setDescription("Extra notes").setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const bountyId = interaction.options.getString("bounty");
    const link = interaction.options.getString("link");
    const notes = interaction.options.getString("notes") || "";

    const repoInfo = channels[interaction.channelId];
    if (!repoInfo) return interaction.editReply("⚠️ This channel isn’t linked to a GitHub repo.");

    const body = `💎 **Submission from @${interaction.user.tag}**\n🔗 ${link}\n📝 ${notes}`;

    try {
      await addComment({ repoInfo, issueNumber: bountyId, body });
      await interaction.editReply("✅ Submission posted successfully!");
    } catch (err) {
      console.error(err);
      await interaction.editReply("⚠️ Failed to submit.");
    }
  },
};

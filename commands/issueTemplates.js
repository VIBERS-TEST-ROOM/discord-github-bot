const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { createIssue } = require("../services/github");
const { listTemplates, getTemplate } = require("../services/templates");
const channelsConfig = require("../config/channels.json");

/**
 * Handle the /issue_templates command
 * - Shows available templates
 * - Opens a form/modal for user input
 * - Creates issue in the mapped GitHub repo
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("issue_templates")
    .setDescription("Create a GitHub issue from a pre-defined template."),

  async execute(interaction) {
    const user = interaction.user;
    const channelId = interaction.channelId;

    // Only allow certain roles to use this (optional)
    if (!interaction.member.roles.cache.some(r => ["WG Lead", "Admin"].includes(r.name))) {
      return interaction.reply({ content: "❌ You don’t have permission to use this command.", ephemeral: true });
    }

    // Map channel to GitHub repo from config
    const repoConfig = channelsConfig[channelId];
    if (!repoConfig) {
      return interaction.reply({ content: "⚠️ No GitHub repo linked to this channel.", ephemeral: true });
    }

    const { owner, repo } = repoConfig;

    // List available templates
    const templates = listTemplates(); // returns array of template names
    if (!templates.length) {
      return interaction.reply({ content: "⚠️ No templates available.", ephemeral: true });
    }

    // Send a form/modal for user to choose template + add title
    const modal = new ModalBuilder()
      .setCustomId(`issue_template_modal|${owner}|${repo}`)
      .setTitle("Create Issue from Template");

    const templateInput = new TextInputBuilder()
      .setCustomId("templateName")
      .setLabel(`Choose a template: ${templates.join(", ")}`)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const titleInput = new TextInputBuilder()
      .setCustomId("issueTitle")
      .setLabel("Issue Title")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const bodyInput = new TextInputBuilder()
      .setCustomId("issueBody")
      .setLabel("Optional: Additional description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(new ActionRowBuilder().addComponents(templateInput));
    modal.addComponents(new ActionRowBuilder().addComponents(titleInput));
    modal.addComponents(new ActionRowBuilder().addComponents(bodyInput));

    await interaction.showModal(modal);
  },

  /**
   * Handle the modal submit
   */
  async handleModalSubmit(interaction) {
    const [_, owner, repo] = interaction.customId.split("|");

    const templateName = interaction.fields.getTextInputValue("templateName");
    const issueTitle = interaction.fields.getTextInputValue("issueTitle");
    const issueBodyExtra = interaction.fields.getTextInputValue("issueBody");

    try {
      const issue = await createIssue({
        owner,
        repo,
        title: issueTitle,
        templateName,
        customBody: issueBodyExtra || "",
      });

      await interaction.reply({
        content: `✅ Issue created: ${issue.html_url}`,
        ephemeral: true, // only visible to user
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "⚠️ Failed to create issue.",
        ephemeral: true,
      });
    }
  },
};

const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { getTemplates } = require("../services/templates");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("issue_templates")
    .setDescription("Choose a GitHub issue template."),

  async execute(interaction) {
    const templates = await getTemplates();
    if (templates.length === 0) {
      return interaction.reply({ content: "No templates available.", ephemeral: true });
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId("select-template")
      .setPlaceholder("Select a template")
      .addOptions(
        templates.map(t => ({ label: t.name, description: t.description, value: t.name }))
      );

    const row = new ActionRowBuilder().addComponents(menu);
    await interaction.reply({ content: "Select a template to use:", components: [row], ephemeral: true });
  },
};

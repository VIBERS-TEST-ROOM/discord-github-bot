// commands/issueTemplates.js
import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { listTemplates, getTemplateContent } from "../services/templates.js";
import { createIssue } from "../services/github.js";

export default {
  data: new SlashCommandBuilder()
    .setName("issue_templates")
    .setDescription("Browse and create issues using available GitHub templates."),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const templates = listTemplates();

      if (!templates.length) {
        await interaction.editReply("⚠️ No templates found in the bot repository.");
        return;
      }

      // Create a select menu for available templates
      const options = templates.map(t => ({
        label: t.replace(".yml", ""),
        value: t,
      }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId("select-template")
        .setPlaceholder("Select a template to create an issue")
        .addOptions(options);

      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.editReply({
        content: "🧩 Choose a template to start your issue:",
        components: [row],
      });

      // Collector for user template selection
      const collector = interaction.channel.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 60_000,
      });

      collector.on("collect", async i => {
        const templateName = i.values[0];
        const template = getTemplateContent(templateName);

        if (!template) {
          await i.reply({ content: "⚠️ Template not found!", ephemeral: true });
          return;
        }

        await i.reply({
          content: `📝 Using **${templateName.replace(".yml", "")}** template.\n\nPlease enter your issue details in this format:\n\`/issue content: Title | Description\``,
          ephemeral: true,
        });
      });
    } catch (error) {
      console.error("❌ Template command error:", error);
      await interaction.editReply("⚠️ Failed to load issue templates.");
    }
  },
};


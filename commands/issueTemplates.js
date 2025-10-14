// commands/issueTemplates.js
import { SlashCommandBuilder } from "discord.js";
import { loadTemplates, getTemplateByName } from "../services/templates.js";
import { createIssue } from "../services/github.js";

export const data = new SlashCommandBuilder()
  .setName("issue_template")
  .setDescription("Create a GitHub issue using a saved template.")
  .addStringOption(option =>
    option
      .setName("template")
      .setDescription("Choose a template (e.g. proposal, bounty, meeting-notes)")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("title")
      .setDescription("The title for your issue")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("details")
      .setDescription("Additional information or body text for your issue")
      .setRequired(false)
  );

export async function execute(interaction) {
  const templateName = interaction.options.getString("template");
  const title = interaction.options.getString("title");
  const extraDetails = interaction.options.getString("details") || "";

  await interaction.deferReply({ ephemeral: true });

  try {
    const availableTemplates = loadTemplates();
    const match = availableTemplates.find(t => t.name === templateName);

    if (!match) {
      await interaction.editReply(
        `⚠️ Template "${templateName}" not found. Available templates: ${availableTemplates.map(t => t.name).join(", ")}`
      );
      return;
    }

    const templateBody = getTemplateByName(templateName);
    const finalBody = `${templateBody}\n\n---\n**Additional Details:**\n${extraDetails}`;

    // Create issue in correct repo based on channel
    const issue = await createIssue({
      channelId: interaction.channelId,
      title,
      body: finalBody,
    });

    await interaction.editReply(`✅ Issue created successfully: ${issue.data.html_url}`);
  } catch (error) {
    console.error("❌ Error creating issue from template:", error);
    await interaction.editReply("⚠️ Failed to create issue using template.");
  }
}

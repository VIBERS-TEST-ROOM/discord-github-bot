// utils/messageUtils.js
/**
 * Send an ephemeral (private) reply to the user
 */
export async function sendEphemeral(interaction, content) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content, ephemeral: true });
    } else {
      await interaction.reply({ content, ephemeral: true });
    }
  } catch (error) {
    console.error("⚠️ Failed to send ephemeral message:", error);
  }
}

/**
 * Format a message for better readability in Discord or GitHub
 */
export function formatMessage(title, body) {
  return `**${title}**\n\n${body}`;
}

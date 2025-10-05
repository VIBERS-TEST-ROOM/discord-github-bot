/**
 * Send an ephemeral reply to a user (only visible to them)
 * @param {CommandInteraction | Message} interactionOrMessage - Discord interaction or message object
 * @param {string} content - The message content
 */
async function sendEphemeral(interactionOrMessage, content) {
  try {
    // Slash commands (interaction)
    if (interactionOrMessage.reply && interactionOrMessage.isCommand?.()) {
      await interactionOrMessage.reply({ content, ephemeral: true });
    } 
    // Normal messages
    else if (interactionOrMessage.reply) {
      await interactionOrMessage.reply(content);
    }
  } catch (err) {
    console.error("Failed to send ephemeral message:", err);
  }
}

module.exports = {
  sendEphemeral,
};

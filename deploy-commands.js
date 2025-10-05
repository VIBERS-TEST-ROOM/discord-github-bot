const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("issue_templates")
    .setDescription("Create a GitHub issue using a pre-defined template"),
  new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Submit work for a bounty"),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ Slash commands registered successfully.");
  } catch (error) {
    console.error(error);
  }
})();

// deploy-commands.js
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // Your Bot's Application ID
const GUILD_ID = process.env.GUILD_ID;   // Your Test Server ID

const commands = [];
const commandsPath = path.join(__dirname, "commands");

// Read command files
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith(".js")) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
});

// Create REST instance
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Deploy commands
(async () => {
  try {
    console.log(`🚀 Started refreshing ${commands.length} application (slash) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log(`✅ Successfully reloaded application (slash) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

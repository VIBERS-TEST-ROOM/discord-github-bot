// index.js
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

// Load environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_GITHUB_TOKEN = process.env.DISCORD_GITHUB_TOKEN;

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// GitHub client
const octokit = new Octokit({ auth: DISCORD_GITHUB_TOKEN });

// Command collection
client.commands = new Collection();

// Load command files dynamically
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith(".js")) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }
});

// Ready event
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Interaction handler (slash commands)
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, octokit);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "⚠️ There was an error while executing this command.",
      ephemeral: true
    });
  }
});

// Login Discord
client.login(DISCORD_TOKEN);

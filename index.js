const { Client, GatewayIntentBits } = require("discord.js");
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

// Load environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_GITHUB_TOKEN = process.env.DISCORD_GITHUB_TOKEN;

// Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// GitHub client
const octokit = new Octokit({ auth: DISCORD_GITHUB_TOKEN });

// Load channel mappings
const channelsConfig = require("./config/channels.json");

// Load commands dynamically from commands folder
client.commands = new Map();
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith(".js")) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
  }
});

// When bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle incoming messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = "!"; // change to your preferred prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check if command exists
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute({ message, args, client, octokit, channelsConfig });
  } catch (error) {
    console.error(error);
    message.reply("⚠️ Something went wrong executing that command.");
  }
});

// Login bot
client.login(DISCORD_TOKEN);

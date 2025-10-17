import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, Collection, GatewayIntentBits, Events } from "discord.js";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Initialize Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Attach command collection
client.commands = new Collection();

// Load all command files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

// Register commands
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: ${command.data.name}`);
  } else {
    console.warn(`⚠️ Skipped invalid command file: ${file}`);
  }
}

// Initialize GitHub client
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Bot ready event
client.once(Events.ClientReady, (readyClient) => {
  console.log(`🤖 Git-dis Bot is online as ${readyClient.user.tag}`);
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`❌ Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, octokit);
  } catch (error) {
    console.error(`❌ Error executing command ${interaction.commandName}:`, error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: "⚠️ There was an error executing that command.", ephemeral: true });
    } else {
      await interaction.reply({ content: "⚠️ There was an error executing that command.", ephemeral: true });
    }
  }
});

// Log in the bot
client.login(DISCORD_TOKEN);

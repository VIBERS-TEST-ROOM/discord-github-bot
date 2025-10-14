// index.js
import "dotenv/config";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Discord + GitHub clients
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const octokit = new Octokit({ auth: process.env.DISCORD_GITHUB_TOKEN });

// Load all commands from /commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const { data, execute } = await import(`./commands/${file}`);
  client.commands.set(data.name, { data, execute });
}

// Bot ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle slash command interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, octokit);
  } catch (error) {
    console.error("❌ Command execution error:", error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "⚠️ There was an error executing this command.", ephemeral: true });
    } else {
      await interaction.reply({ content: "⚠️ There was an error executing this command.", ephemeral: true });
    }
  }
});

// Login the bot
client.login(process.env.DISCORD_TOKEN);


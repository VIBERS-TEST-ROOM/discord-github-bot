// deploy-commands.js
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  if (!command || !command.data) {
    console.warn(`⚠️ Skipping ${file} — no command data found.`);
    continue;
  }
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`📁 Loaded ${commands.length} slash commands.`);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Slash commands deployed successfully!");
  } catch (err) {
    console.error("❌ Failed to deploy commands:", err);
  }
})();

const { Client, GatewayIntentBits } = require("discord.js");
const { Octokit } = require("@octokit/rest");

// Load tokens from environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// GitHub client
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// When bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Simple test command
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Just a ping test
  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }

  // Example: create GitHub issue
  if (message.content.startsWith("!issue")) {
    const issueTitle = message.content.replace("!issue", "").trim() || "New issue from Discord";
    
    try {
      const result = await octokit.issues.create({
        owner: "YOUR_ORG_OR_USERNAME",
        repo: "YOUR_REPO_NAME",
        title: issueTitle,
      });
      message.reply(`✅ Issue created: ${result.data.html_url}`);
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Failed to create issue.");
    }
  }
});

// Login bot
client.login(DISCORD_TOKEN);

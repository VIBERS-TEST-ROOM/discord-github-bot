README.md
# 🤖 Git-dis Bot

Git-dis Bot is a Discord → GitHub bridge that helps communities collaborate without leaving Discord.  
It allows users to **create GitHub issues**, **submit bounties**, and **use templates** directly through slash commands — keeping your workflow organized and on-chain.

---

## 🚀 Features

- 🧩 **Slash commands** for smooth interaction  
  - `/issue` → Create a GitHub issue (Title + Description)
  - `/submit` → Submit work or a bounty claim
- 🗂️ **Template support** for different issue types (proposal, report, task, etc.)
- 🔄 **Channel-to-Repo mapping** via `config/channels.json`
- 🪄 **Ephemeral Discord replies** for private user feedback
- 💬 **Automatic GitHub comments** for bounty submissions
- 🌐 **Deploys automatically** to [Railway](https://railway.app)

---

## 🧠 Project Structure

discord-github-bot/
├─ index.js # Main bot entry point
├─ deploy-commands.js # Registers slash commands
├─ config/
│ └─ channels.json # Maps Discord channels → GitHub repos
├─ commands/
│ ├─ ping.js # Simple test command
│ ├─ issue.js # Handles /issue command
│ ├─ issueTemplates.js # Loads and displays issue templates
│ └─ submit.js # Handles /submit for bounties
├─ services/
│ ├─ github.js # GitHub API wrapper
│ └─ templates.js # Manages issue templates
├─ utils/
│ ├─ messageUtils.js # Helper for ephemeral messages
│ └─ validation.js # Validation checks (permissions, status, etc.)
├─ templates/ # GitHub issue templates (YAML)
│ ├─ proposal.yml
│ ├─ report.yml
│ ├─ task-bounty.yml
│ ├─ meeting-notes.yml
│ ├─ workflow.yml
│ └─ pull-request.yml
├─ .gitignore # Excludes node_modules and env files
├─ package.json
└─ README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- Node.js v18 or later
- Discord Bot Token
- GitHub Personal Access Token (with `repo` scope)
- Railway account (for deployment)

---

### 2️⃣ Create a `.env` file

Create a `.env` file in your project root and add:

DISCORD_TOKEN=your_discord_bot_token
GITHUB_TOKEN=your_github_pat
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_server_i

---

### 3️⃣ Install Dependencies

```bash
npm install
4️⃣ Deploy Slash Commands
npm run deploy
5️⃣ Start the Bot
npm start
Usage

Once the bot is live in your server:

Type /ping to verify it’s active.

Use /issue to create a new GitHub issue directly from Discord:
/issue content: Title | Description of the issue
Use /submit to submit bounty work — your submission is posted as a GitHub comment.
Configuration

To map Discord channels to repositories, update:
{
  "123456789012345678": "YourOrg/RepoA",
  "234567890123456789": "YourOrg/BountyRepo"
}
Contributing

Contributions are welcome!

Fork the repository

Create a new branch (feature/new-command)

Submit a Pull Request
Contributing

Contributions are welcome!

Fork the repository

Create a new branch (feature/new-command)

Submit a Pull Request
Credits

Built with 💡 by Gnericvibes — empowering communities through automation and collaboration.

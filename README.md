# Git-dis Bot

**Git-dis Bot** is a Discord bot that bridges your Discord server with GitHub repositories. It allows your Working Groups (WGs) to:

- Create GitHub issues directly from Discord with title and description.
- Select GitHub repositories based on the Discord channel.
- Use predefined GitHub issue templates stored in `.github/ISSUE_TEMPLATE`.
- Submit work for bounties and track submissions.
- Send ephemeral messages for forms and confirmations.
- Restrict certain commands to specific Discord roles.

---

## Project Structure
discord-github-bot/
├─ index.js # Main entry point, initializes the bot
├─ config/
│ └─ channels.json # Maps Discord channel IDs → GitHub repo/issues
├─ commands/
│ ├─ ping.js # Simple ping command
│ ├─ issue.js # Handles !issue command
│ ├─ issueTemplates.js # Handles !issue_templates and template form submissions
│ └─ submit.js # Handles /submit for bounties
├─ services/
│ ├─ github.js # GitHub API wrapper
│ └─ templates.js # Load and manage GitHub templates
├─ utils/
│ ├─ messageUtils.js # Helpers for ephemeral messages, formatting
│ └─ validation.js # Checks, e.g., if bounty is open, if user is allowed
├─ .env # Discord/GitHub tokens (not committed)
├─ package.json
└─ README.md
Commands
General

!ping — Check if the bot is online.

Issue Management

!issue <title> — Create a GitHub issue in the mapped repository.

!issue_templates — View and select predefined GitHub issue templates (restricted to specific roles).

Bounty Submissions

/submit <bounty> — Submit work for a bounty. The bot guides the user with forms:

Upload files

Submit links

Add descriptions or notes

Only the submitting user can see the form until submission.

License

MIT License © OYAREBU_GLADYS

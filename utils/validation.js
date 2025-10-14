// utils/validation.js
import { getIssue } from "../services/github.js";

/**
 * Validates if a bounty (GitHub issue) exists and is open.
 * @param {string} channelId Discord channel ID (maps to repo)
 * @param {string|number} issueNumber GitHub issue number
 * @returns {Promise<{isOpen: boolean, issue?: object}>}
 */
export async function validateBountyStatus(channelId, issueNumber) {
  try {
    const issue = await getIssue(channelId, issueNumber);
    const isOpen = issue?.state === "open";

    return { isOpen, issue };
  } catch (error) {
    console.error("⚠️ Error validating bounty:", error);
    return { isOpen: false };
  }
}

import { getIssue } from "../services/github.js";

/**
 * Check if a bounty issue is open before allowing submission
 */
export async function validateBountyOpen({ owner, repo, issue_number }) {
  try {
    const issue = await getIssue({ owner, repo, issue_number });
    if (issue.state !== "open") {
      return { valid: false, reason: "This bounty is closed." };
    }
    return { valid: true };
  } catch (err) {
    console.error("❌ Error validating bounty:", err);
    return { valid: false, reason: "Could not verify bounty status." };
  }
}

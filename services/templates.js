// services/templates.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, "../templates");

// List available templates
export function listTemplates() {
  return fs
    .readdirSync(TEMPLATES_DIR)
    .filter(file => file.endsWith(".yml"))
    .map(file => file.replace(".yml", ""));
}

// Get the contents of a specific template
export function getTemplateContent(templateName) {
  const filePath = path.join(TEMPLATES_DIR, `${templateName}.yml`);
  if (!fs.existsSync(filePath)) throw new Error("Template not found");
  return fs.readFileSync(filePath, "utf-8");
}


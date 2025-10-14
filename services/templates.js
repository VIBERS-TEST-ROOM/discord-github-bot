// services/templates.js
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

// Path to your local templates directory
const TEMPLATES_DIR = path.join(__dirname, "templates");

/**
 * Load all available templates from the /templates directory.
 * Templates are stored as YAML or Markdown files.
 */
export function loadTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.warn("⚠️ No templates directory found.");
    return [];
  }

  return fs.readdirSync(TEMPLATES_DIR)
    .filter(file => file.endsWith(".yml") || file.endsWith(".yaml") || file.endsWith(".md"))
    .map(file => ({
      name: file.replace(/\.(yml|yaml|md)$/, ""),
      path: path.join(TEMPLATES_DIR, file),
    }));
}

/**
 * Get a specific template by name
 */
export function getTemplateByName(name) {
  const templates = loadTemplates();
  const template = templates.find(t => t.name === name);
  if (!template) {
    throw new Error(`Template "${name}" not found.`);
  }
  return fs.readFileSync(template.path, "utf8");
}

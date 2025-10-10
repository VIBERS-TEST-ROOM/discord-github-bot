const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const TEMPLATES_DIR = path.join(__dirname, "../templates");

async function getTemplates() {
  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith(".yml") || f.endsWith(".yaml"));
  return files.map(file => {
    const content = yaml.load(fs.readFileSync(path.join(TEMPLATES_DIR, file), "utf8"));
    return { name: content.name || file.replace(".yml", ""), description: content.about || "No description" };
  });
}

module.exports = { getTemplates };

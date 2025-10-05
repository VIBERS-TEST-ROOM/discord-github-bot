const fs = require("fs");
const path = require("path");

// Path to your templates folder inside the bot repo
const templatesDir = path.join(__dirname, "../templates");

function loadTemplates() {
  const templates = {};
  const files = fs.readdirSync(templatesDir);

  files.forEach((file) => {
    if (file.endsWith(".yml") || file.endsWith(".yaml")) {
      const content = fs.readFileSync(path.join(templatesDir, file), "utf8");
      // The template key is the filename without extension
      const key = path.basename(file, path.extname(file));
      templates[key] = content;
    }
  });

  return templates;
}

module.exports = {
  loadTemplates,
};

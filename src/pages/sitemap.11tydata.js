const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const contentDir = path.resolve(__dirname, "../content");
const navbarData = YAML.parse(
  fs.readFileSync(path.join(contentDir, "navbar.yml"), "utf8"),
);

module.exports = {
  navbar: navbarData,
};

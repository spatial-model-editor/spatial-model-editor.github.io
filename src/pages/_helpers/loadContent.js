const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const contentDir = path.resolve(__dirname, "../../content");
const navbarData = YAML.parse(
  fs.readFileSync(path.join(contentDir, "navbar.yml"), "utf8"),
);

module.exports = function loadContent(ymlFilename) {
  const data = YAML.parse(
    fs.readFileSync(path.join(contentDir, ymlFilename), "utf8"),
  );

  const slug = ymlFilename.replace(".yml", "");
  const outputFilename = slug + ".html";

  return {
    ...data,
    navbar: { ...navbarData },
    permalink: `/${outputFilename}`,
    eleventyComputed: {
      navbar: (data) => ({
        ...data.navbar,
        current: outputFilename,
      }),
    },
  };
};

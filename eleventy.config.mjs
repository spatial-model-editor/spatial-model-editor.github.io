import fs from "node:fs";
import { minify } from "html-minifier-terser";
import YAML from "yaml";

export default function (eleventyConfig) {
  // Allow page content & global data to be written in YAML
  eleventyConfig.addDataExtension("yml", (contents) => YAML.parse(contents));

  // Copy assets to output
  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
    "src/css": "css",
    "src/js": "js",
    "node_modules/bootstrap/dist/css/bootstrap.min.css*": "css",
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js*": "js",
  });

  // Inline an svg icon, e.g. {% icon "github" %}
  // from src/icons if it exists there, otherwise from https://icons.getbootstrap.com
  eleventyConfig.addShortcode("icon", (name) => {
    const localFile = `src/icons/${name}.svg`;
    const file = fs.existsSync(localFile)
      ? localFile
      : `node_modules/bootstrap-icons/icons/${name}.svg`;
    const svg = fs.readFileSync(file, "utf8");
    const viewBox = svg.match(/viewBox="([^"]*)"/)[1];
    return svg.replace(
      /<svg[^>]*>/,
      `<svg class="bi" viewBox="${viewBox}" fill="currentColor" aria-hidden="true">`,
    );
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return minify(content, {
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  return {
    dir: {
      input: "src/pages",
      output: "dist",
    },
  };
}

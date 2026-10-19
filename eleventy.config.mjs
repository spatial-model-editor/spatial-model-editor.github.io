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
    "node_modules/bootstrap-icons/font/bootstrap-icons.min.css":
      "css/bootstrap-icons.min.css",
    "node_modules/bootstrap-icons/font/fonts": "css/fonts",
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

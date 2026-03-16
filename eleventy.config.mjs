import { minify } from "html-minifier";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  // Exclude data helper modules from template processing
  eleventyConfig.ignores.add("src/pages/_helpers/**");

  // Copy assets to output
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Watch content YAML files for changes
  eleventyConfig.addWatchTarget("src/content/");

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return minify(content, {
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  // Convert PNG images to WebP after build
  eleventyConfig.on("eleventy.after", async () => {
    const assetsDir = path.resolve(__dirname, "dist/assets");
    if (!fs.existsSync(assetsDir)) return;
    await convertPngsToWebp(assetsDir);
  });

  return {
    dir: {
      input: "src/pages",
      output: "dist",
    },
  };
}

async function convertPngsToWebp(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await convertPngsToWebp(fullPath);
    } else if (entry.name.endsWith(".png")) {
      const outFile = fullPath.replace(/\.png$/, ".webp");
      await sharp(fullPath).toFile(outFile);
    }
  }
}

#!/usr/bin/env node

// Fetches CHANGELOG.md from the spatial-model-editor repo on GitHub
// and generates src/content/news.yml from it.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../src/content/news.yml");

const changelogUrl =
  "https://raw.githubusercontent.com/spatial-model-editor/spatial-model-editor/main/CHANGELOG.md";

const response = await fetch(changelogUrl);
if (!response.ok) {
  console.error(`Failed to fetch CHANGELOG.md: ${response.status}`);
  process.exit(1);
}
const changelog = await response.text();

// Parse changelog into releases
const releases = [];
let current = null;
let currentSection = null;

for (const line of changelog.split("\n")) {
  // Match release header: ## [1.11.0] - 2026-02-04
  const releaseMatch = line.match(
    /^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{1,2}-\d{1,2})/,
  );
  if (releaseMatch) {
    if (current) releases.push(current);
    current = {
      version: releaseMatch[1],
      date: releaseMatch[2],
      sections: {},
    };
    currentSection = null;
    continue;
  }

  // Skip unreleased and non-release lines
  if (!current) continue;

  // Match section header: ### Added, ### Fixed, etc.
  const sectionMatch = line.match(/^### (\w+)/);
  if (sectionMatch) {
    currentSection = sectionMatch[1];
    if (!current.sections[currentSection]) {
      current.sections[currentSection] = [];
    }
    continue;
  }

  // Match list items
  if (currentSection && line.match(/^- /)) {
    current.sections[currentSection].push(line.slice(2));
  } else if (currentSection && line.match(/^ {2,}- /)) {
    // Sub-items: append to the last item
    const items = current.sections[currentSection];
    if (items.length > 0) {
      items[items.length - 1] += "\n" + line;
    }
  }

  // Special case: "First official release." (1.0.0)
  if (!currentSection && line.match(/\S/) && !line.startsWith("#")) {
    current.sections["_text"] = [line.trim()];
  }
}
if (current) releases.push(current);

// Convert markdown links to HTML: [text](url) -> <a href="url">text</a>
function mdLinksToHtml(text) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// Convert a single item's markdown to HTML, handling sub-lists
function itemToHtml(item) {
  const lines = item.split("\n");
  let html = mdLinksToHtml(lines[0]);
  if (lines.length > 1) {
    html += "<ul>";
    for (const subLine of lines.slice(1)) {
      html += `<li>${mdLinksToHtml(subLine.replace(/^\s*- /, ""))}</li>`;
    }
    html += "</ul>";
  }
  return html;
}

// Convert inline code to <code> tags
function inlineCodeToHtml(text) {
  return text.replace(/`([^`]+)`/g, "<code>$1</code>");
}

// Build description HTML for a release
function buildDescription(sections) {
  if (sections["_text"]) {
    return `<p>${sections["_text"][0]}</p>`;
  }

  let html = "";
  for (const [section, items] of Object.entries(sections)) {
    html += `<h6>${section}</h6>\n`;
    html += "<ul>\n";
    for (const item of items) {
      html += `<li>${inlineCodeToHtml(itemToHtml(item))}</li>\n`;
    }
    html += "</ul>\n";
  }
  return html.trim();
}

// Escape YAML string value
function yamlStr(str) {
  return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

// Generate YAML
let yaml = "page_title: News\nnews:\n";
for (const release of releases) {
  const description = buildDescription(release.sections);
  yaml += `  - date: ${release.date}\n`;
  yaml += `    title: Version ${release.version} released\n`;
  yaml += `    url: https://github.com/spatial-model-editor/spatial-model-editor/releases/tag/${release.version}\n`;
  yaml += `    description: >\n`;
  for (const line of description.split("\n")) {
    yaml += `      ${line}\n`;
  }
}

fs.writeFileSync(outputPath, yaml);
console.log(`Generated ${outputPath} with ${releases.length} releases.`);

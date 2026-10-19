// Fetches CHANGELOG.md from the spatial-model-editor repo on GitHub
// and splits it into a list of releases with their notes as HTML.

import EleventyFetch from "@11ty/eleventy-fetch";
import MarkdownIt from "markdown-it";

const changelogUrl =
  "https://raw.githubusercontent.com/spatial-model-editor/spatial-model-editor/main/CHANGELOG.md";
const releaseUrl =
  "https://github.com/spatial-model-editor/spatial-model-editor/releases/tag/";

const md = new MarkdownIt();

export default async function () {
  const changelog = await EleventyFetch(changelogUrl, {
    duration: "1d",
    type: "text",
  });

  // Remove the footer, which would otherwise end up in the notes of the oldest release
  const body = changelog.replace(/^Changelog format based on .*$/m, "");

  // Split on release headers, e.g. "## [1.11.0] - 2026-02-04"
  // (this skips "# Changelog" and "## [Unreleased]" before the first release)
  const parts = body.split(
    /^## \[(\d+\.\d+\.\d+)\] - (\d{4})-(\d{1,2})-(\d{1,2})$/m,
  );
  const releases = [];
  for (let i = 1; i < parts.length; i += 5) {
    const [version, year, month, day, notes] = parts.slice(i, i + 5);
    releases.push({
      version,
      date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      url: releaseUrl + version,
      notes: md.render(notes),
    });
  }
  return releases;
}

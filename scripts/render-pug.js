"use strict";
const fs = require("fs");
const upath = require("upath");
const pug = require("pug");
const sh = require("shelljs");
const minify = require("html-minifier").minify;

function render(filePath) {
  const destPath = filePath
    .replace(/src\/pug\//, "dist/")
    .replace(/\.pug$/, ".html");
  const srcPath = upath.resolve(upath.dirname(__filename), "../src");
  const jsonPath = filePath
    .replace(/\/pug\//, "/json/")
    .replace(/\.pug$/, ".json");

  console.log(`JSON <-- ${jsonPath}`);
  var json = JSON.parse(fs.readFileSync(jsonPath));
  json.navbar = JSON.parse(
    fs.readFileSync(upath.join(srcPath, "json/navbar.json"))
  );
  json.navbar.current = upath.basename(destPath);

  console.log(`Pug  <-- ${filePath}`);
  const html = pug.renderFile(filePath, {
    doctype: "html",
    filename: filePath,
    basedir: srcPath,
    fs: fs,
    json: json,
  });

  console.log(`HTML --> ${destPath}`);
  const mini = minify(html, { removeComments: true });

  const destPathDirname = upath.dirname(destPath);
  if (!sh.test("-e", destPathDirname)) {
    sh.mkdir("-p", destPathDirname);
  }

  fs.writeFileSync(destPath, mini);
  console.log();
}

function isPage(filePath) {
  return (
    !filePath.match(/includes/) &&
    !filePath.match(/mixins/) &&
    !filePath.match(/layouts/)
  );
}

module.exports = { render, isPage };

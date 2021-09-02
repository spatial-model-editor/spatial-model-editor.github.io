"use strict";
const fs = require("fs");
const upath = require("upath");
const pug = require("pug");
const sh = require("shelljs");
const minify = require("html-minifier").minify;

module.exports = function renderPug(filePath) {
  const destPath = filePath
    .replace(/src\/pug\//, "dist/")
    .replace(/\.pug$/, ".html");
  const srcPath = upath.resolve(upath.dirname(__filename), "../src");

  console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
  const html = pug.renderFile(filePath, {
    doctype: "html",
    filename: filePath,
    basedir: srcPath,
    fs: fs,
  });

  const mini = minify(html, { removeComments: true });

  const destPathDirname = upath.dirname(destPath);
  if (!sh.test("-e", destPathDirname)) {
    sh.mkdir("-p", destPathDirname);
  }

  fs.writeFileSync(destPath, mini);
};

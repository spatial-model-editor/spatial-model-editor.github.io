"use strict";

const chokidar = require("chokidar");
const upath = require("upath");
const renderAssets = require("./render-assets");
const renderPug = require("./render-pug");
const renderScriptsScss = require("./render-scripts-scss");

const watcher = chokidar.watch("src", {
  persistent: true,
});

let READY = false;

process.title = "pug-watch";
process.stdout.write("Loading");
let allPugFiles = {};

watcher.on("add", (filePath) => _processFile(upath.resolve(filePath), "add"));
watcher.on("change", (filePath) =>
  _processFile(upath.resolve(filePath), "change"),
);
watcher.on("ready", () => {
  READY = true;
  console.log(" READY TO ROLL!");
});

renderScriptsScss();

function _processFile(filePath, watchEvent) {
  if (!READY) {
    if (filePath.match(/\.pug$/) && renderPug.isPage(filePath)) {
      allPugFiles[filePath] = true;
    }
    process.stdout.write(".");
    return;
  }

  if (filePath.match(/\.pug$/)) {
    if (renderPug.isPage(filePath)) {
      return renderPug.render(filePath);
    }
    if (watchEvent === "change" && !renderPug.isPage(filePath)) {
      _.each(allPugFiles, (value, filePath) => {
        renderPug.render(filePath);
      });
    }
  }

  if (filePath.match(/\.yml/)) {
    const pugFilePath = filePath
      .replace(/\/content\//, "/pug/")
      .replace(/\.yml/, ".pug");
    return renderPug.render(pugFilePath);
  }

  if (filePath.match(/\.scss$/) || filePath.match(/\.js$/)) {
    if (watchEvent === "change") {
      return renderScriptsScss();
    }
    return;
  }

  if (filePath.match(/src\/assets\//)) {
    return renderAssets();
  }
}

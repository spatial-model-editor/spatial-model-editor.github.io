"use strict";

const _ = require("lodash");
const chokidar = require("chokidar");
const upath = require("upath");
const renderAssets = require("./render-assets");
const renderPug = require("./render-pug");
const renderScripts = require("./render-scripts");
const renderSCSS = require("./render-scss");

const watcher = chokidar.watch("src", {
  persistent: true,
});

let READY = false;

process.title = "pug-watch";
process.stdout.write("Loading");
let allPugFiles = {};

watcher.on("add", (filePath) => _processFile(upath.resolve(filePath), "add"));
watcher.on("change", (filePath) =>
  _processFile(upath.resolve(filePath), "change")
);
watcher.on("ready", () => {
  READY = true;
  console.log(" READY TO ROLL!");
});

_handleSCSS();

function _processFile(filePath, watchEvent) {
  if (!READY) {
    if (filePath.match(/\.pug$/) && renderPug.isPage(filePath)) {
      allPugFiles[filePath] = true;
    }
    process.stdout.write(".");
    return;
  }

  if (filePath.match(/\.pug$/)) {
    return _handlePug(filePath, watchEvent);
  }

  if (filePath.match(/\.json/)) {
    return _handleJson(filePath, watchEvent);
  }

  if (filePath.match(/\.scss$/)) {
    if (watchEvent === "change") {
      return _handleSCSS(filePath, watchEvent);
    }
    return;
  }

  if (filePath.match(/src\/js\//)) {
    return renderScripts();
  }

  if (filePath.match(/src\/assets\//)) {
    return renderAssets();
  }
}

function _handlePug(filePath, watchEvent) {
  if (renderPug.isPage(filePath)) {
    return renderPug.render(filePath);
  }
  if (watchEvent === "change" && !renderPug.isPage(filePath)) {
    return _renderAllPug();
  }
}

function _handleJson(filePath, watchEvent) {
  const pugFilePath = filePath
    .replace(/\/json\//, "/pug/")
    .replace(/\.json$/, ".pug");
  return renderPug.render(pugFilePath);
}

function _renderAllPug() {
  _.each(allPugFiles, (value, filePath) => {
    renderPug.render(filePath);
  });
}

function _handleSCSS() {
  renderSCSS();
}

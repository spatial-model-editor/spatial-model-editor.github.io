"use strict";
const webpack = require("webpack");
const upath = require("upath");
// const sh = require("shelljs");
// const minify = require("uglify-js").minify;

module.exports = function renderScripts() {
  const destPath = upath.resolve(upath.dirname(__filename), "../dist/js/.");

  const config = {
    entry: "./src/js/scripts.js",
    output: {
      filename: "bundle.js",
      path: destPath,
    },
    mode: "production",
  };

  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err.message);
    }
    console.log(stats.message);
  });

  // const destPathDirname = upath.resolve(upath.dirname(__filename), "../dist/js");
  // if (!sh.test("-e", destPathDirname)) {
  //   sh.mkdir("-p", destPathDirname);
  // }

  // const sourcePath = upath.resolve(upath.dirname(__filename), "../node_modules/bootstrap/js/dist/carousel.js");
  // const script = fs.readFileSync(sourcePath, 'utf-8');
  // const mini = minify(script);
  // console.log(`CODE: ${mini.code}`);
  // console.log(`ERROR: ${mini.error}`);
  // const destPath = upath.resolve(upath.dirname(__filename), "../dist/js/carousel.js");
  // fs.writeFileSync(destPath, mini.code);
};

"use strict";
const upath = require("upath");
const sh = require("shelljs");
const sharp = require("sharp");

module.exports = function renderAssets() {
  const sourcePath = upath.resolve(upath.dirname(__filename), "../src/assets");
  const destPath = upath.resolve(upath.dirname(__filename), "../dist/.");

  // copy original images
  sh.cp("-R", sourcePath, destPath);

  // make webp versions of png images
  for (const inFile of sh.find(destPath)) {
    if (inFile.match(/\.png$/)) {
      const outFile = inFile.replace(/\.png$/, ".webp");
      sharp(inFile)
        .toFile(outFile)
        .then((info) => {
          const relIn = upath.relative(destPath, inFile);
          const relOut = upath.relative(destPath, outFile);
          console.log(`- ${relIn} --> ${relOut}`);
        });
    }
  }
};

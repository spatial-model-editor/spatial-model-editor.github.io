"use strict";
const fs = require("fs");
const upath = require("upath");
const sh = require("shelljs");
const libSquoosh = require("@squoosh/lib");

module.exports = async function renderAssets() {
  const sourcePath = upath.resolve(upath.dirname(__filename), "../src/assets");
  const destPath = upath.resolve(upath.dirname(__filename), "../dist/.");

  // copy original images
  sh.cp("-R", sourcePath, destPath);

  // set low number of workers: default is nthreads, but gives asm out of memory error
  const imagePool = new libSquoosh.ImagePool(4);

  // make webp versions of png images
  await _convertPngImages(destPath, imagePool);
};

async function _convertPngImages(destPath, imagePool) {
  var images = [];
  for (const filePath of sh.find(destPath)) {
    if (filePath.match(/\.png$/)) {
      console.log(filePath);
      images.push(imagePool.ingestImage(filePath));
    }
  }

  await Promise.all(images.map((a) => a.decoded));

  const encodeOptions = {
    webp: {
      lossless: true,
      method: 6,
    },
  };

  var encodes = [];
  for (const image of images) {
    encodes.push(image.encode(encodeOptions));
    console.log(image.file);
  }
  await Promise.all(encodes);

  var outputs = [];
  for (const image of images) {
    const outFile = image.file.replace(/\.png$/, ".webp");
    const rawData = (await image.encodedWith.webp).binary;
    outputs.push(
      fs.writeFile(outFile, rawData, (err) => {
        if (err) throw err;
        console.log(outFile);
      })
    );
  }
  await Promise.all(outputs);

  return imagePool.close();
}

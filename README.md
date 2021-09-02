<img align="left" width="64" height="64" src="https://raw.githubusercontent.com/spatial-model-editor/spatial-model-editor/master/src/core/resources/icon.iconset/icon_32x32@2x.png" alt="icon">

# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

[![Build and deploy to gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml)

## How it works

- [master](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/master) branch contains the source code
- [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages) branch contains the generated html/css/js/image files
- each page has a [json](/src/json) file of editable content
- uses the [npm](https://www.npmjs.com/) package manager, the [Bootstrap](https://getbootstrap.com/) CSS framework, and the [pug](https://pugjs.org/) HTML templating engine.

## Structure

- [src/json](/src/json)
  - each page has a json file with the content for that page
  - this data is made available to the pug template of the same name as `json`
- [src/pug](/src/pug)
  - each page has a [pug](https://pugjs.org/) template
  - the html page is generated from this template
  - it inherits the base layout from [src/pug/layouts/base.pug](/src/pug/layouts/base.pug)
  - it can use functions ('mixins') from [src/pug/mixins](/src/pug/mixins)
- [src/assets](/src/assets)
  - contains the image and video files
- [src/scss](/src/scss)
  - import and customize [Bootstrap css](https://getbootstrap.com/docs/5.1/customize/sass/)
- [src/js](/src/js)
  - any extra (client-side) javascript can be added here

## Content

- [index](/src/json/index.json)
  - title, icon and contents of each feature card can be edited via the json file
- [screenshots](/src/json/screenshots.json)
  - displays all images in [src/assets/screenshots](/src/assets/screenshots)
  - to add an image, just add the image file to this folder, no changes to the json required
- [videos](/src/json/videos.json)
  - videos can be edited and added via the json file

## Adding a new page

To add a page `X`:

- create a text file `src/pug/X.pug` with the contents `extends layouts/base`
- create a text file `src/json/X.pug` with the contents `{"page_title" : "X"}`
- add an entry for it to the list of pages in [src/json/navbar.json](src/json/navbar.json)

## Deployment

On every commit to the master branch:

- [deploy.yml](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml) action builds website & deploys to [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages)
- github pages hosts these files at [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

## How to edit locally

- clone this repo
  - `git clone https://github.com/spatial-model-editor/spatial-model-editor.github.io.git`
  - `cd spatial-model-editor.github.io`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install node (ideally v16 to match deploy job)
  - macOS: `brew install node`
  - windows: https://nodejs.org/en/
  - ubuntu: `sudo apt install nodejs npm`
  - linux/macOS tool to manage multiple node versions: https://github.com/nodenv/nodenv
  - (many) more options: https://nodejs.org/en/download/package-manager
- install website node dependencies
  - `npm install`
- start a live in-browser local preview of the website
  - `npm start`
- make changes to the files in `src/` and the preview will update automatically

## Acknowledgements

- based on https://github.com/StartBootstrap/startbootstrap-heroic-features

<img align="left" width="64" height="64" src="https://raw.githubusercontent.com/spatial-model-editor/spatial-model-editor/master/src/core/resources/icon.iconset/icon_32x32@2x.png" alt="icon">

# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

[![Build and deploy to gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml)

## How it works

- [master](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/master) branch contains the source code
- [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages) branch contains the generated html/css/js/image files
- uses [npm](https://www.npmjs.com/) for package management, the [Bootstrap](https://getbootstrap.com/) CSS framework, and the [pug](https://pugjs.org/) HTML templating engine.

## Structure

- [src/pug](/src/pug)
  - each html page is generated from a [pug](https://pugjs.org/) template
  - it inherits the base layout from [src/pug/layouts/base.pug](/src/pug/layouts/base.pug)
  - it can use functions ('mixins') from [src/pug/mixins](/src/pug/mixins)
  - when adding a new page, it should also be added to the list in [src/pug/mixins/navbar.pug](/src/pug/mixins/navbar.pug)
- [src/assets](/src/assets)
  - contains the image and video files
- [src/scss](/src/scss)
  - import and customize [Bootstrap css](https://getbootstrap.com/docs/5.0/customize/sass/)
- [src/js](/src/js)
  - extra javascript can be added here

## Deployment

On every commit to the master branch:

- [deploy.yml](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml) action builds website & deploys to [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages)
- github pages hosts these files at [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

## How to edit locally

- clone this repo
  - `git clone https://github.com/spatial-model-editor/spatial-model-editor.github.io.git`
  - `cd spatial-model-editor.github.io.git`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install node 16
  - https://nodejs.org/en/download/package-manager
  - ubuntu specific: https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
- install website node dependencies
  - `npm install`
- start a live in-browser local preview of the website
  - `npm start`
- make changes to the files in `src/pug/` and the preview will update automatically

## Acknowledgements

- based on https://github.com/StartBootstrap/startbootstrap-heroic-features

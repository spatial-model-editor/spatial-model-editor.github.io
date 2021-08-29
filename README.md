# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/) [![Build and deploy to gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml)

## How it works

- [https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/master](master) branch contains the source code
- [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages) branch contains the generated html/css/js/image files
- uses [npm](https://www.npmjs.com/), [Boostrap](https://getbootstrap.com/), and [pug](https://pugjs.org/)

## Structure

- [src/pug](/src/pug) contains a [pug](https://pugjs.org/) template for each html page
- [src/assets](/src/assets) contains the image files
- [src/scss/styles.scss](/src/scss/styles.scss) import and customize [Bootstrap css](https://getbootstrap.com/docs/5.0/customize/sass/)

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

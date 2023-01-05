<img align="left" width="64" height="64" src="https://raw.githubusercontent.com/spatial-model-editor/spatial-model-editor/main/core/resources/icon.iconset/icon_32x32@2x.png" alt="icon">

# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

[![Build and deploy to gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml)
[![W3C Validation](https://img.shields.io/w3c-validation/html?targetUrl=https%3A%2F%2Fspatial-model-editor.github.io)](https://validator.w3.org/nu/?doc=https%3A%2F%2Fspatial-model-editor.github.io%2F)

## How it works

- [main](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/main) branch contains the source code
- [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages) branch contains the generated website
- the contents of each page are stored in [yaml](https://yaml.org/) format in [src/content](/src/content)
- there is a corresponding [pug](https://pugjs.org/) HTML template for each page in [src/pug](/src/pug)
- uses CSS and icons from the [Bootstrap](https://getbootstrap.com/) framework
- uses [npm](https://www.npmjs.com/) and [webpack](https://webpack.js.org/) to manage the build and dependencies

## Structure

- [src/content](/src/content)
  - each page has a yaml file with the content for that page
  - this data is made available as `content` to the pug template of the same name
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
  - additional client-side javascript
- [src/index.js](/src/index.js)
  - webpack entry point: import all js and css dependencies

## Deployment

On every commit to the main branch:

- [deploy.yml](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml) action builds website & deploys to [gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/tree/gh-pages)
- github pages hosts these files at [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

## How to edit locally

- clone this repo
  - `git clone https://github.com/spatial-model-editor/spatial-model-editor.github.io.git`
  - `cd spatial-model-editor.github.io`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install node (ideally v18 to match deploy job)
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

## Adding a new page

To add a page `X`:

- create a text file `src/pug/X.pug` with the contents `extends layouts/base`
- create a text file `src/content/X.yml` with the contents `page_title: "X"`
- add an entry for it to the list of pages in [src/content/navbar.yml](src/content/navbar.yml)

## Acknowledgements

- based on https://github.com/StartBootstrap/startbootstrap-heroic-features

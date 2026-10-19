<img align="left" width="64" height="64" src="https://raw.githubusercontent.com/spatial-model-editor/spatial-model-editor/main/core/resources/icon.iconset/icon_32x32@2x.png" alt="icon">

# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

[![Build and deploy to gh-pages](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml)
[![W3C Validation](https://img.shields.io/w3c-validation/html?targetUrl=https%3A%2F%2Fspatial-model-editor.github.io)](https://validator.w3.org/nu/?doc=https%3A%2F%2Fspatial-model-editor.github.io%2F)

## How it works

- each page is a [Nunjucks](https://mozilla.github.io/nunjucks/) HTML template in [src/pages](/src/pages)
- the contents of each page are stored in a corresponding [yaml](https://yaml.org/) file next to the template
- uses CSS, JS and icons from the [Bootstrap](https://getbootstrap.com/) framework
- uses [pnpm](https://pnpm.io/) to manage dependencies
- uses [Eleventy](https://www.11ty.dev/) as the static site generator

## Structure

- [src/pages](/src/pages)
  - each page `X` has a [Nunjucks](https://mozilla.github.io/nunjucks/) template `X.njk`
  - and a yaml file `X.11tydata.yml` with the content for that page, which is made available to the template
  - the html page `X.html` is generated from this template
  - it inherits the base layout from [src/pages/\_includes/layouts/base.njk](/src/pages/_includes/layouts/base.njk)
  - it can use functions ('macros') from [src/pages/\_includes/macros](/src/pages/_includes/macros)
- [src/pages/\_data](/src/pages/_data)
  - global data available to all pages, e.g. the list of pages in the navbar
  - the news page content is generated from the [CHANGELOG](https://github.com/spatial-model-editor/spatial-model-editor/blob/main/CHANGELOG.md) by [releases.js](/src/pages/_data/releases.js)
- [src/assets](/src/assets)
  - contains the image and video files
- [src/icons](/src/icons)
  - svg icons that are not in [Bootstrap Icons](https://icons.getbootstrap.com/)
- [src/css](/src/css)
  - custom CSS styles
- [src/js](/src/js)
  - additional client-side javascript

## Deployment

On every commit to the main branch:

- [deploy.yml](https://github.com/spatial-model-editor/spatial-model-editor.github.io/actions/workflows/deploy.yml) action builds website & deploys to github-pages at [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

## How to edit locally

- clone this repo
  - `git clone https://github.com/spatial-model-editor/spatial-model-editor.github.io.git`
  - `cd spatial-model-editor.github.io`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install [pnpm](https://pnpm.io/installation)
  - windows: `iwr https://get.pnpm.io/install.ps1 -useb | iex`
  - linux/macOS: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
- install website dependencies
  - `pnpm install`
- start a live in-browser local preview of the website
  - `pnpm start`
- make changes to the files in `src/` and the preview will update automatically

## Adding a new page

To add a page `X`:

- create a text file `src/pages/X.11tydata.yml` with the contents `page_title: "X"`
- create a text file `src/pages/X.njk` that extends the base layout
- add an entry for it to the list of pages in [src/pages/\_data/navbar.yml](src/pages/_data/navbar.yml)

## Acknowledgements

- based on https://github.com/StartBootstrap/startbootstrap-heroic-features

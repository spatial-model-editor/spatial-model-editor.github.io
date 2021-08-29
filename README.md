# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

## How it works

- this repo contains the source code for the website
- src/pug contains pug templates for each page
- commits to the master branch cause a build & deploy of the website to `gh-pages` branch
- the `gh-pages` branch is the website

## How to edit locally

- clone this repo: `git clone https://github.com/spatial-model-editor/spatial-model-editor.github.io.git`
- `cd spatial-model-editor.github.io.git`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install node dependencies
  - (first install node, e.g. `sudo apt install npm` on ubuntu)
  - `npm install`
- start a live in-browser preview of website
  - `npm start`
- make changes to src/pug/ and the preview will update automatically

## Acknowledgements

- based on https://github.com/StartBootstrap/startbootstrap-heroic-features

# [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)

## How it works

- `master` branch contains the source code for generating [spatial-model-editor.github.io](https://spatial-model-editor.github.io/)
- `gh-pages` branch contains the generated html/css that is deployed by github pages
- [src/pug](/src/pug) contains a [pug](https://pugjs.org/) template for each page
- [src/assets](/src/assets) contains the image files
- on each commit to master the website is built & deployed to the gh-pages branch

## How to edit locally

- clone this repo
  - `git clone https://github.com/spatial-model-editor/spatial-model-editor.github.io.git`
  - `cd spatial-model-editor.github.io.git`
- (optional) install pre-commit to auto-format code
  - `pip install pre-commit`
  - `pre-commit install`
- install node dependencies
  - (first install node, e.g. `sudo apt install npm` on ubuntu)
  - `npm install`
- start a live in-browser local preview of the website
  - `npm start`
- make changes to the files in `src/pug/` and the preview will update automatically

## Acknowledgements

- based on https://github.com/StartBootstrap/startbootstrap-heroic-features

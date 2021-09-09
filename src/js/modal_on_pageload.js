// if url has #[modal_id], show that modal on page load

const bs = require("bootstrap");
const hash = document.URL.split("#")[1];
if (hash) {
  const elem = document.getElementById(hash);
  if (elem && elem.classList.contains("modal")) {
    var myModal = new bs.Modal(elem, {});
    myModal.show();
  }
}

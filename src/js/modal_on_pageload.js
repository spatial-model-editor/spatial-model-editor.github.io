// if url has #[modal_id], show that modal on page load

const elem = location.hash && document.getElementById(location.hash.slice(1));
if (elem && elem.classList.contains("modal")) {
  bootstrap.Modal.getOrCreateInstance(elem).show();
}

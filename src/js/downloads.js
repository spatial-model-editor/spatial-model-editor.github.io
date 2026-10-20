// make the download for the visitor's OS & CPU architecture the main one

function detectOs() {
  const platform = navigator.userAgentData?.platform || navigator.userAgent;
  // check these first: Android user agents contain "Linux", iOS ones contain "Mac OS X"
  if (/Android|iPhone|iPad|CrOS|Chrome OS/i.test(platform)) return null;
  if (/Win/i.test(platform)) return "windows";
  // iPads also report as a Mac
  if (/Mac/i.test(platform))
    return navigator.maxTouchPoints > 1 ? null : "macos";
  if (/Linux/i.test(platform)) return "linux";
  return null;
}

function showMainDownload(os, arch) {
  const download =
    document.querySelector(`.download[data-platform="${os}-${arch}"]`) ||
    document.querySelector(`.download[data-platform^="${os}-"]`);
  if (download) {
    document.querySelector(".download-main")?.classList.remove("download-main");
    download.classList.add("download-main");
  }
}

const os = detectOs();
if (os) {
  // the user agent string usually only reveals arm64 on Linux
  showMainDownload(
    os,
    /aarch64|arm64/i.test(navigator.userAgent) ? "arm64" : "x64",
  );
  // Chromium-based browsers can provide the actual CPU architecture
  navigator.userAgentData
    ?.getHighEntropyValues(["architecture"])
    .then(({ architecture }) => {
      if (architecture) {
        showMainDownload(os, architecture === "arm" ? "arm64" : "x64");
      }
    })
    .catch(() => {});
}

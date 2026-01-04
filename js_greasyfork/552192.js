// ==UserScript==
// @name         Preload BP images
// @version      1.2.1
// @description  Make BP images and GIFs
// @author       Anon
// @match        https://bitporn.eu/torrents*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/552192/Preload%20BP%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/552192/Preload%20BP%20images.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("Running script");

  let href = location.href;
  const cache = document.createElement("cache");
  cache.style =
    "display:block;position:relative;z-index:-1000;opacity:0;overflow:hidden";

  document.addEventListener("DOMContentLoaded", async () => {
    document.body.appendChild(cache);

    initialPreload();

    const observer = new MutationObserver((mutations) => {
      if (location.href !== href) {
        clearCache();
        href = location.href;
      }

      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!isTorrentRow(node)) continue;
          const anchor = node.querySelector("a.torrent-search--list__name");
          append(anchor.dataset.src);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

  function append(url) {
    if (!url) return;
    const img = new Image();
    img.src = url;
    img.style = "position:absolute";
    cache.appendChild(img);
  }

  function isTorrentRow(node) {
    return node.tagName === "TR" && node.dataset.torrentId;
  }

  async function initialPreload() {
    const anchors = Array.from(
      document.querySelectorAll("a.torrent-search--list__name")
    );

    for (const anchor of anchors) {
      append(anchor.dataset.src);
    }
  }

  function clearCache() {
    console.log("Clearing cache");
    while (cache.firstChild) {
      cache.removeChild(cache.lastChild);
    }
  }
})();

// ==UserScript==
// @name         Funny BTWLoad.gif
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace all instances of images/custom/BTWLoad.gif with a custom gif
// @author       You
// @match        https://my.btwholesale.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547837/Funny%20BTWLoadgif.user.js
// @updateURL https://update.greasyfork.org/scripts/547837/Funny%20BTWLoadgif.meta.js
// ==/UserScript==

(function() {
  const customGif = "https://i.pinimg.com/originals/d9/f2/15/d9f21515b1e38d83e94fdbce88f623b6.gif";

  // --- 1. Replace any <img> tags after DOM loads ---
  const replaceImgs = () => {
    document.querySelectorAll('img[src*="images/custom/BTWLoad.gif"]').forEach(img => {
      if (img.src !== customGif) {
        img.src = customGif;
        img.width = 120;
        img.height = 120;
      }
    });
  };

  // Run once DOM is ready
  document.addEventListener("DOMContentLoaded", replaceImgs);

  // Also watch for dynamically inserted loaders
  const observer = new MutationObserver(replaceImgs);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // --- 2. Rewrite HTML before it even parses (covers inline references) ---
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === "string" && url.includes("images/custom/BTWLoad.gif")) {
      arguments[1] = customGif; // redirect request
    }
    return origOpen.apply(this, arguments);
  };

  // For fetch API
  const origFetch = window.fetch;
  window.fetch = function(resource, init) {
    if (typeof resource === "string" && resource.includes("images/custom/BTWLoad.gif")) {
      resource = customGif;
    }
    return origFetch(resource, init);
  };
})();

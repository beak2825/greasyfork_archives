// ==UserScript==
// @name Fix iframe referrerpolicy
// @name:en Fix iframe referrerpolicy
// @description playing around
// @match https://hqpornero.com/*
// @run-at document-start
// @version 0.0.1.20260119220858
// @namespace https://greasyfork.org/users/1562504
// @downloadURL https://update.greasyfork.org/scripts/563279/Fix%20iframe%20referrerpolicy.user.js
// @updateURL https://update.greasyfork.org/scripts/563279/Fix%20iframe%20referrerpolicy.meta.js
// ==/UserScript==

(() => {
  const recreate = iframe => {
    if (iframe.dataset._refixed) return;
    if (!iframe.hasAttribute("referrerpolicy")) return;

    const clone = document.createElement("iframe");
    for (const attr of iframe.attributes) {
      if (attr.name !== "referrerpolicy") {
        clone.setAttribute(attr.name, attr.value);
      }
    }

    clone.src = iframe.src;
    clone.dataset._refixed = "1";
    iframe.replaceWith(clone);
  };

  const scan = () => {
    document.querySelectorAll('iframe[referrerpolicy="no-referrer"]').forEach(recreate);
  };

  new MutationObserver(scan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  scan();
})();
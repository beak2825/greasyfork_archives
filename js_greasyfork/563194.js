// ==UserScript==
// @namespace    Reveal Password On Hover
// @name         Reveal Password On Hover
// @match        *://*/*
// @description  Show password when focus on password field
// @author       webberLV
// @license      MIT
// @version      1.1
// @downloadURL https://update.greasyfork.org/scripts/563194/Reveal%20Password%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/563194/Reveal%20Password%20On%20Hover.meta.js
// ==/UserScript==


(function () {
  "use strict";

  function applyToField(field) {
    if (field.dataset.showpass) return;
    field.dataset.showpass = "true";

    field.addEventListener("focus", function () {
      try { this.type = "text"; } catch(e) {}
    });

    field.addEventListener("blur", function () {
      try { this.type = "password"; } catch(e) {}
    });
  }

  function scan(root = document) {
    root.querySelectorAll("input[type='password']").forEach(applyToField);
  }

  scan();

  let scheduled = false;

  const observer = new MutationObserver((mutations) => {
    let relevant = false;

    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;

        if (
          (n.tagName === "INPUT" && n.type === "password") ||
          n.querySelector?.("input[type='password']")
        ) {
          relevant = true;
          break;
        }
      }
      if (relevant) break;
    }

    if (!relevant || scheduled) return;

    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

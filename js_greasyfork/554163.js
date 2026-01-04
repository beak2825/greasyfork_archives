// ==UserScript==
// @name         Collapse all Hacker News comments by default
// @namespace    https://github.com/marcosnils/orange-juicer
// @version      0.1.1
// @description  Thanks to the original browser extension! I just ported it to userscript. https://github.com/marcosnils/orange-juicer
// @author       marcosnils & contributors
// @match        https://news.ycombinator.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554163/Collapse%20all%20Hacker%20News%20comments%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/554163/Collapse%20all%20Hacker%20News%20comments%20by%20default.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Ensure .noshow rows are hidden even if site CSS changes
  const style = document.createElement("style");
  style.textContent = `
    .noshow { display: none !important; }
    .comhead a.togg { margin-left: 6px; }
  `;
  document.documentElement.appendChild(style);

  // fetchParentWithClass traverses parents until it finds one
  // that contains the specified class or else returns undefined
  const fetchParentWithClass = function (element, className) {
    while (element && !element.classList.contains(className)) {
      element = element.parentElement;
    }
    return element;
  };

  function init() {
    const form = document.querySelector("form");

    const colexpButton = document.createElement("input");
    colexpButton.setAttribute("type", "button");
    colexpButton.value = "exp/col parent";

    colexpButton.addEventListener("click", function () {
      const toHide = document.querySelectorAll('img:not([width="0"])');
      for (const img of toHide) {
        const commentRow = fetchParentWithClass(img, "comtr");
        if (commentRow) {
          commentRow.classList.toggle("noshow");
        }
      }
    });

    // Adds a space after the "add comment" button and injects our button
    if (form) {
      form.appendChild(document.createTextNode("\u00A0"));
      form.appendChild(colexpButton);
    } else {
      // Fallback if form not found (e.g., no comment box on page)
      const header =
        document.querySelector(".pagetop, .subtext, .title") || document.body;
      header.appendChild(colexpButton);
    }

    // Process anchor toggles
    const commHeads = document.querySelectorAll(".comhead");
    for (const chead of commHeads) {
      // MODDED:
      const commentNum = chead.querySelector("a.togg.clicky")?.getAttribute("n") ?? 0;

      const childExpandToggle = document.createElement("a");
      childExpandToggle.classList.add("togg");
      childExpandToggle.textContent =
        commentNum > 1 ? `[*${commentNum}]` : "[*]";
      childExpandToggle.setAttribute("href", "javascript:void(0)");

      childExpandToggle.addEventListener("click", function () {
        const parent = fetchParentWithClass(this.parentElement, "comtr");
        if (parent) {
          let sibling = parent.nextElementSibling;
          while (sibling) {
            // Found the next parent post, break loop
            if (sibling.querySelectorAll('img[width="0"]').length > 0) {
              break;
            }
            sibling.classList.toggle("noshow");
            sibling = sibling.nextElementSibling;
          }
        }
      });
      chead.appendChild(document.createTextNode(" "));
      chead.appendChild(childExpandToggle);
    }

    // Auto-toggle on load if enabled
    const AUTO_KEY = "hnToggleValue";
    const autoToggle =
      typeof GM_getValue === "function" ? GM_getValue(AUTO_KEY, true) : true;
    if (autoToggle) {
      colexpButton.click();
    }

    // Menu command to toggle the auto-toggle preference
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand(
        `Auto toggle on load: ${autoToggle ? "ON" : "OFF"}`,
        () => {
          const newVal = !GM_getValue(AUTO_KEY, true);
          GM_setValue(AUTO_KEY, newVal);
          alert(
            `Orange Juicer: Auto toggle on load is now ${
              newVal ? "ON" : "OFF"
            }.\nReload the page to apply.`
          );
        }
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

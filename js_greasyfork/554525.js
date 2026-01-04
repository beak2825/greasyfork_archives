// ==UserScript==
// @name         Auto-select PN_DIALLER
// @namespace    https://plusnet.local
// @version      1.0.1
// @description  Preselect PN_DIALLER in #allocate without submitting
// @match        http://cccsolutions.intra.bt.com/sms/main.asp
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554525/Auto-select%20PN_DIALLER.user.js
// @updateURL https://update.greasyfork.org/scripts/554525/Auto-select%20PN_DIALLER.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TARGET_SELECTOR = "#allocate";
  const TARGET_TEXT = "PN_DIALLER";
  const TARGET_VALUE = "2064"; // fallback if text match fails

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function waitFor(selector, timeout = 10000) {
    const start = performance.now();
    while (performance.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(50);
    }
    return null;
  }

  function pickOption(selectEl) {
    // Try by visible text first
    let opt = Array.from(selectEl.options).find(
      (o) => o.text.trim() === TARGET_TEXT
    );
    // Fallback by value
    if (!opt) {
      opt = Array.from(selectEl.options).find((o) => o.value === TARGET_VALUE);
    }
    if (!opt) return false;

    // Only change if different
    if (selectEl.value !== opt.value) {
      selectEl.value = opt.value;               // sets selection
      // Also mark the option selected for good measure
      Array.from(selectEl.options).forEach((o) => (o.selected = o === opt));
      // Fire change so any UI logic reacts
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  (async function init() {
    const selectEl = await waitFor(TARGET_SELECTOR, 15000);
    if (!selectEl) return; // give up quietly if not found

    // Run once on load
    pickOption(selectEl);

    // If the select is replaced dynamically later, a light observer
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") {
          const sel = document.querySelector(TARGET_SELECTOR);
          if (sel) {
            pickOption(sel);
            obs.disconnect(); // one-and-done; don't fight user changes
            break;
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  })();
})();

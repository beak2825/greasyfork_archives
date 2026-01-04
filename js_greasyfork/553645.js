// ==UserScript==
// @name         Select food when editing Quantity
// @namespace    http://tampermonkey.net/
// @version      2025-10-25 v2
// @description  Automatically check the checkbox when editing the quantity textbox in favorites table
// @author       Alexandru Lache
// @match        https://www.myfitnesspal.com/food/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myfitnesspal.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553645/Select%20food%20when%20editing%20Quantity.user.js
// @updateURL https://update.greasyfork.org/scripts/553645/Select%20food%20when%20editing%20Quantity.meta.js
// ==/UserScript==


(function() {
  'use strict';

  function setupAutoCheck() {
    // Select all quantity inputs in favorites table
    const qtyInputs = document.querySelectorAll('input[name^="favorites"][name$="[quantity]"]');

    qtyInputs.forEach(input => {
      input.addEventListener('input', () => {
        const index = input.name.match(/\[(\d+)\]/)?.[1];
        if (!index) return;

        const checkbox = document.querySelector(`input[name="favorites[${index}][checked]"].checkbox`);
        if (checkbox) checkbox.checked = true;
      });
    });
  }

  // Run once after page loads
  window.addEventListener('load', setupAutoCheck);

  // Also re-run if the page dynamically adds rows (e.g., AJAX)
  const observer = new MutationObserver(setupAutoCheck);
  observer.observe(document.body, { childList: true, subtree: true });
})();
// ==UserScript==
// @name         hoggson's Torn Light and Dark Mode Sync
// @namespace    https://torn.com/
// @version      1.5
// @description  Sync Torn with system light/dark mode.
// @author       hoggson [2319584]
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554023/hoggson%27s%20Torn%20Light%20and%20Dark%20Mode%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/554023/hoggson%27s%20Torn%20Light%20and%20Dark%20Mode%20Sync.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  function getCurrentTheme() {
    return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  }

  function toggleCheckboxIfNeeded(targetMode) {
    const checkbox = document.querySelector('#dark-mode-state');
    if (!checkbox) {
      console.warn('[Torn Theme Sync] Checkbox not found. Retrying...');
      setTimeout(() => toggleCheckboxIfNeeded(targetMode), 500);
      return;
    }

    const isChecked = checkbox.checked;
    const shouldBeChecked = targetMode === 'dark';

    if (isChecked !== shouldBeChecked) {
      checkbox.click(); // simulate user toggle
      console.log(`[Torn Theme Sync] Toggled checkbox to ${targetMode} mode.`);
    }
  }

  function syncTheme() {
    toggleCheckboxIfNeeded(prefersDark() ? 'dark' : 'light');
  }

  // React to system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    toggleCheckboxIfNeeded(e.matches ? 'dark' : 'light');
  });

  // Wait for checkbox to appear
  const waitForCheckbox = setInterval(() => {
    if (document.querySelector('#dark-mode-state')) {
      clearInterval(waitForCheckbox);
      syncTheme();
    }
  }, 300);
})();

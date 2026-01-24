// ==UserScript==
// @name         RetroAchievements Cleanup Unlocks
// @namespace    https://metalsnake.space/
// @version      0.4
// @description  Hide total unlocks and remove parentheses from hardcore unlocks on game pages
// @author       MetalSnake
// @match        *://retroachievements.org/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        none
// @license      GPL-3.0-or-later; https://spdx.org/licenses/GPL-3.0-or-later.html
// @downloadURL https://update.greasyfork.org/scripts/558210/RetroAchievements%20Cleanup%20Unlocks.user.js
// @updateURL https://update.greasyfork.org/scripts/558210/RetroAchievements%20Cleanup%20Unlocks.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let lastUrl = location.href;

  function processUnlocks() {
    const totalSpans = document.querySelectorAll('span.cursor-help[title="Total unlocks"]');

    totalSpans.forEach(totalSpan => {
      // Hide total unlocks span
      totalSpan.style.display = 'none';

      // Look for the next hardcore unlocks span
      let sibling = totalSpan.nextElementSibling;
      while (sibling && !sibling.matches('span.cursor-help.font-bold[title="Hardcore unlocks"]')) {
        sibling = sibling.nextElementSibling;
      }

      if (sibling && sibling.textContent) {
        // Remove parentheses from the hardcore unlocks text
        sibling.textContent = sibling.textContent.replace(/[()]/g, '');
      }
    });
  }

  function onUrlChange() {
    // kleiner Delay, damit der neue DOM aufgebaut werden kann
    setTimeout(processUnlocks, 50);
  }

  // Initialer Seitenaufruf
  // Run once on load
   setTimeout(() => {
        processUnlocks();
    }, 100);


  // pushState / replaceState hooken
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  };

  // Browser zurück / vor
  window.addEventListener('popstate', () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      onUrlChange();
    }
  });



})();
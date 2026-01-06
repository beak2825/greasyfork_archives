// ==UserScript==
// @name 00 Abroad Item Hider
// @namespace glitchey
// @version 1.0.2
// @author Glitchey [3446062]
// @description Hides all items except the specified ones.
// @license GPLv3
// @copyright 2025
// @match https://www.torn.com/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/561616/00%20Abroad%20Item%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/561616/00%20Abroad%20Item%20Hider.meta.js
// ==/UserScript==

const ItemsToShow = new Map([
    ['Mexico', [258, 260, 1429]],
    ['Cayman Islands', [618, 617]],
    ['Canada', [261, 263, 1348, 328]],
    ['Hawaii', [264]],
    ['United Kingdom', [266, 268, 267, 1361]],
    ['Argentina', [269, 271, 1466]],
    ['Switzerland', [273, 272]],
    ['Japan', [277, 437]],
    ['China', [274, 276]],
    ['UAE', [385, 384,1264]],
    ['South Africa', [281, 282, 206, 226]]
]);

(function () {
  'use strict';

  function hideItems(country) {
    const listItems = document.querySelectorAll('.shops___kC_Li li');
    console.log("[Abroad Hider] Processing", listItems.length, "items for", country);

    let hiddenCount = 0;
    for (const item of listItems) {
      const img = item.querySelector("img.torn-item");
      if (!img) continue;

      const srcset = img.getAttribute("srcset") || img.getAttribute("src");
      if (!srcset) continue;

      const match = srcset.match(/\/images\/items\/(\d+)\//);
      if (!match?.[1]) continue;

      const itemId = Number.parseInt(match[1]);

      if (ItemsToShow.get(country).includes(itemId)) {
        item.style.display = '';  // Show item
      } else {
        item.style.display = 'none';  // Hide item
        hiddenCount++;
      }
    }
    console.log("[Abroad Hider] Hidden", hiddenCount, "items");
  }

  function isAbroadPage() {
    return document.querySelector('.travel-home-header-button') !== null;
  }

  function getCountry() {
    return document.querySelector('h4.title___rhtB4')?.innerText?.trim();
  }

  function init() {
    if (!isAbroadPage()) {
      console.log("[Abroad Hider] Not on abroad page");
      return;
    }

    const country = getCountry();
    if (!country || !ItemsToShow.has(country)) {
      console.warn("[Abroad Hider] Country not found or not configured:", country);
      return;
    }

    console.log("[Abroad Hider] Detected country:", country);

    // Initial hide
    hideItems(country);

    // Watch for changes (sorting, filtering, etc.)
    const observer = new MutationObserver(() => {
      hideItems(country);
    });

    const shopsContainer = document.querySelector('.shops___kC_Li');
    if (shopsContainer) {
      observer.observe(shopsContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(init, 1000);
    });
  } else {
    setTimeout(init, 1000);
  }

})();

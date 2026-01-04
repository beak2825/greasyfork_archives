// ==UserScript==
// @name         Geoguessr Spaceplonking
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.0.0
// @description  Prevent zooming in on the map in GeoGuessr.
// @author       Your Name
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-end
// @grant        none
// @noframes
// @compatible   chrome Latest
// @compatible   firefox Latest
// @compatible   edge Latest
// @downloadURL https://update.greasyfork.org/scripts/550394/Geoguessr%20Spaceplonking.user.js
// @updateURL https://update.greasyfork.org/scripts/550394/Geoguessr%20Spaceplonking.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Robust selector for hashed class names used by GeoGuessr for the small guess map.
  // Example: <div class="game_guessMap__8jK3B">...</div>
  var MAP_SELECTOR = '[class^="game_guessMap__"], [class*=" game_guessMap__"]';

  // Utility: check if an event target is inside the guess map (supports Shadow DOM).
  function isInsideGuessMap(target) {
    while (target && target !== document && target !== window) {
      if (target.matches && target.matches(MAP_SELECTOR)) return true;
      // If inside a shadow root, hop to its host; otherwise walk up the DOM.
      target = target.parentNode || target.host;
    }
    return false;
  }

  // Block scroll-wheel/trackpad zoom when the pointer is over the guess map.
  function wheelBlocker(e) {
    if (isInsideGuessMap(e.target)) {
      e.preventDefault();
      // Stop immediately so the map library never sees the event.
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return false;
    }
  }

  // Block double-click zoom on the guess map (does not affect single-click to place pin).
  function dblClickBlocker(e) {
    if (isInsideGuessMap(e.target)) {
      e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return false;
    }
  }

  // Attach capture-phase, non-passive listeners so preventDefault works before the app handles events.
  var opts = { capture: true, passive: false };

  // Wheel/scroll zoom blockers (modern + legacy event names).
  window.addEventListener('wheel', wheelBlocker, opts);
  document.addEventListener('wheel', wheelBlocker, opts);
  window.addEventListener('mousewheel', wheelBlocker, opts);      // legacy
  document.addEventListener('mousewheel', wheelBlocker, opts);
  window.addEventListener('DOMMouseScroll', wheelBlocker, opts);  // Firefox legacy
  document.addEventListener('DOMMouseScroll', wheelBlocker, opts);

  // Double-click zoom blocker.
  window.addEventListener('dblclick', dblClickBlocker, opts);
  document.addEventListener('dblclick', dblClickBlocker, opts);

  // SPA safety: if GeoGuessr re-renders or navigates between rounds, these global listeners still apply.
  // We keep a very light MutationObserver just in case the document root is hot-swapped.
  if (window.MutationObserver) {
    var observer = new MutationObserver(function () {
      // No re-attachment needed; listeners are already global.
      // This observer simply ensures the script stays active across heavy DOM changes.
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // --- Changelog ---
  // 1.0.0: Initial Greasy Fork release. Blocks wheel/trackpad zoom and double-click zoom over the guess map using capture-phase, non-passive listeners.
})();

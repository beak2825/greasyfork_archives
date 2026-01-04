// ==UserScript==
// @name         GeoGuessr Challenge Standings — Top Right
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Moves the standings box to the top-right corner
// @match        https://www.geoguessr.com/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550372/GeoGuessr%20Challenge%20Standings%20%E2%80%94%20Top%20Right.user.js
// @updateURL https://update.greasyfork.org/scripts/550372/GeoGuessr%20Challenge%20Standings%20%E2%80%94%20Top%20Right.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var STANDINGS_SELECTOR =
    '[class^="current-standings_container__"], [class*=" current-standings_container__"]';

  function injectCSS() {
    if (document.getElementById('gg-standings-style')) return;
    var style = document.createElement('style');
    style.id = 'gg-standings-style';
    style.textContent = `
      ${STANDINGS_SELECTOR} {
        position: fixed !important;
        top: 80px !important;      /* 👈 adjust how far down from the top */
        right: 10px !important;
        left: auto !important;
        margin: 0 !important;
        z-index: 99999 !important;
        width: auto !important;
        min-width: 320px !important;
        max-width: 600px !important;
      }
    `;
    document.head.appendChild(style);
  }

  injectCSS();

  // Keep styles alive across SPA navigation and re-renders
  if (window.MutationObserver) {
    var obs = new MutationObserver(injectCSS);
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Hook history navigation too
  function wrap(fn) {
    return function () {
      var r = fn.apply(this, arguments);
      setTimeout(injectCSS, 0);
      setTimeout(injectCSS, 200);
      return r;
    };
  }
  try {
    if (!history.__ggFixedWrapped) {
      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', function () { setTimeout(injectCSS, 0); }, false);
      history.__ggFixedWrapped = true;
    }
  } catch (e) {}
})();

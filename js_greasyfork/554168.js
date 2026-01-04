// ==UserScript==
// @name         claimtrx feyorra refresh
// @namespace    https://example.com/
// @version      1.0
// @description  Auto refresh claimtrx feyorra.top every 1 minute
// @author       KukuModz
// @match        https://claimtrx.com/faucet*
// @match        https://feyorra.top/faucet*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554168/claimtrx%20feyorra%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/554168/claimtrx%20feyorra%20refresh.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Interval in milliseconds (60 seconds)
  const INTERVAL_MS = 60 * 1000;

  // Optional: show a console message so you know the script is active
  console.log('Faucet Auto-Refresher running — page will reload every', INTERVAL_MS / 1000, 'seconds');

  // Optional: if you want the first reload to happen after the interval
  // use setInterval directly. If you want an immediate reload on load + repeated,
  // uncomment the next line:
  // location.reload();

  setInterval(() => {
    try {
      // If you prefer a soft reload (re-run without cache) use location.reload();
      // If you prefer to force reload from server, use location.reload(true) — note: modern browsers ignore the boolean.
      location.reload();
    } catch (err) {
      console.error('Auto-refresh failed:', err);
    }
  }, INTERVAL_MS);
})();

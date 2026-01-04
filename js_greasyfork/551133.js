// ==UserScript==
// @name         Ice Hockey xG
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automaticky otevře visualizaci (xG) v nové záložce.
// @author       JV
// @match        https://www.ice.hockey/en/stats/gamestats*
// @match        https://www.ice.hockey/stats/spielstats*
// @match        https://ice.hockey/en/stats/gamestats*
// @match        https://ice.hockey/stats/spielstats*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551133/Ice%20Hockey%20xG.user.js
// @updateURL https://update.greasyfork.org/scripts/551133/Ice%20Hockey%20xG.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function openXG() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('gameId');
    if (!gameId) {
      console.log('[xG] gameId nebyl nalezen v URL.');
      return;
    }
    const url = `https://icestats.at/visualization/deserve2win/${gameId}`;
    console.log('[xG] Otevírám v nové záložce:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  window.addEventListener('load', openXG);
})();
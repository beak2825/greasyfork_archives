// ==UserScript==
// @name         SnookerScores - přepíše href na API
// @namespace    https://snookerscores.net/
// @description  Přepisuje odkazy /scoreboard/match/* (včetně /sheet) na /scoreboard/api/match/* na stránce knockout.
// @version      1.0
// @author       JV
// @match        https://snookerscores.net/tournament-manager/*/knockout*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550342/SnookerScores%20-%20p%C5%99ep%C3%AD%C5%A1e%20href%20na%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/550342/SnookerScores%20-%20p%C5%99ep%C3%AD%C5%A1e%20href%20na%20API.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const toApi = (u) => {
    const url = new URL(u, location.origin);
    url.pathname = url.pathname
      .replace('/scoreboard/match/', '/scoreboard/api/match/')
      .replace(/\/sheet\/?$/, ''); // odstranit koncové /sheet
    return url.toString();
  };

  const rewrite = (a) => {
    if (a.dataset.ssApiRewritten) return;
    if (!a.href || !a.href.includes('/scoreboard/match/')) return;
    a.href = toApi(a.href);
    a.dataset.ssApiRewritten = '1';
  };

  const process = () => {
    document.querySelectorAll('a[href*="/scoreboard/match/"]').forEach(rewrite);
  };

  // první průchod + re-run při změnách DOM (lazy-load apod.)
  process();
  new MutationObserver(process).observe(document.body, { childList: true, subtree: true });
})();

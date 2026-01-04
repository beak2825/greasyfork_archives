// ==UserScript==
// @name         NBL – přepsat href na AtriumSports fixture_detail
// @namespace    lukas.nbl.fixturelink
// @version      1.0
// @description  U všech dlaždic zápasů nbl.com.au přepiš href na eapi...fixture_detail?fixtureId=<data-match-link>
// @match        https://nbl.com.au/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550688/NBL%20%E2%80%93%20p%C5%99epsat%20href%20na%20AtriumSports%20fixture_detail.user.js
// @updateURL https://update.greasyfork.org/scripts/550688/NBL%20%E2%80%93%20p%C5%99epsat%20href%20na%20AtriumSports%20fixture_detail.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BASE = 'https://eapi.web.prod.cloud.atriumsports.com/v1/embed/298/fixture_detail?fixtureId=';

  function processAnchor(a) {
    if (!a || a.dataset._fixtureHrefDone === '1') return;
    const id = a.getAttribute('data-match-link') || a.dataset.matchLink;
    if (!id) return;

    a.href = BASE + encodeURIComponent(id);
    // volitelně otevřít do nové karty:
    // a.target = '_blank'; a.rel = 'noopener noreferrer';

    a.dataset._fixtureHrefDone = '1';
  }

  function scan() {
    // bereme všechny odkazy s data-match-link (dlaždice, karousely, atd.)
    document.querySelectorAll('a[data-match-link]').forEach(processAnchor);
  }

  // první průchod
  scan();

  // reaguj na dynamické načítání
  const mo = new MutationObserver(() => scan());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

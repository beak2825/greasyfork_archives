// ==UserScript==
// @name         Wykop Przeprosiny Stop
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  Ukrywa #banner_top_1 na wykop.pl
// @author       mug3m
// @match        https://wykop.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wykop.pl
// @grant        none
// @run-at       document-end
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/562782/Wykop%20Przeprosiny%20Stop.user.js
// @updateURL https://update.greasyfork.org/scripts/562782/Wykop%20Przeprosiny%20Stop.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("Wykop uczy, wykop radzi, wykop nigdy cię nie zdradzi!");

  function hideBanner() {
    const el = document.getElementById('banner_top_1');
    if (el) {
      el.style.display = 'none';
      return true;
    }
    return false;
  }

  if (hideBanner()) return;

  const obs = new MutationObserver(() => {
    if (hideBanner()) obs.disconnect();
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(() => obs.disconnect(), 10000);
})();
// ==UserScript==
// @name         SA – Auto-rozwiń "Log czynności"
// @namespace    premiumtech
// @version      1.0
// @author       Dawid  
// @description  Automatycznie rozwija sekcję "Log czynności" na karcie zamówienia w SellAsist
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @run-at       document-idle
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/552140/SA%20%E2%80%93%20Auto-rozwi%C5%84%20%22Log%20czynno%C5%9Bci%22.user.js
// @updateURL https://update.greasyfork.org/scripts/552140/SA%20%E2%80%93%20Auto-rozwi%C5%84%20%22Log%20czynno%C5%9Bci%22.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let expandedOnce = false;
  function tryExpandLog() {
    const heading = document.querySelector('.m-logs-panel__heading.js-admin-log-show');
    if (!heading) return false;
    const isCollapsed = heading.classList.contains('is-inactive');

    if (isCollapsed) {
      heading.click();
      expandedOnce = true;
      return true;
    }
    return false;
  }
  tryExpandLog();
  const startTs = Date.now();
  const interval = setInterval(() => {
    if (expandedOnce) {
      clearInterval(interval);
      return;
    }
    const done = tryExpandLog();
    const timedOut = Date.now() - startTs > 10_000;
    if (done || timedOut) {
      clearInterval(interval);
    }
  }, 300);
  const mo = new MutationObserver(() => {
    if (!expandedOnce) {
      const done = tryExpandLog();
      if (done) mo.disconnect();
    } else {
      mo.disconnect();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
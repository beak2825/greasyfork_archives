// ==UserScript==
// @name         Stake.bet — Hide currency conversion
// @namespace    https://stake.bet/
// @version      1.1
// @description  Hide the currency conversion widget on all stake.bet pages
// @match        *://stake.bet/*
// @match        *://*.stake.bet/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551706/Stakebet%20%E2%80%94%20Hide%20currency%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/551706/Stakebet%20%E2%80%94%20Hide%20currency%20conversion.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .currency-conversion {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.documentElement.appendChild(style);
})();
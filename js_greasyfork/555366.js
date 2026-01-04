// ==UserScript==
// @name         Steam Store Width CSS fix
// @namespace    https://store.steampowered.com/
// @version      1.0
// @description  Set a fixed width constant for Steam store page layout.
// @match        https://store.steampowered.com/app/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555366/Steam%20Store%20Width%20CSS%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/555366/Steam%20Store%20Width%20CSS%20fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define your width constant (in px)
  const STORE_PAGE_WIDTH = 1000;

  const css = `
    body.v6.widestore {
      --store-page-width: ${STORE_PAGE_WIDTH}px !important;
    }
    body.v6.widestore .page_content {
      max-width: ${STORE_PAGE_WIDTH + 100}px !important; /* e.g., width + margin/padding */
      width: 100% !important;
      margin: 0 auto !important;
    }
    .widestore .queue_ctn {
      max-width: ${STORE_PAGE_WIDTH + 100}px !important;
      width: 100% !important;
      background: rgba(0, 0, 0, 0.2) !important;
      margin: 0 auto 16px auto !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

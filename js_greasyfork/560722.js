// ==UserScript==
// @name         GitHub+
// @namespace    https://github.com
// @version      1.0.5
// @description  Always expand "Show more" repositories on GitHub dashboard
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560722/GitHub%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/560722/GitHub%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isDashboard = () =>
    location.pathname === '/' || location.pathname.startsWith('/dashboard');

  function clickShowMore() {
    if (!isDashboard()) return;

    const button = document.querySelector(
      '.js-more-repos-form button[type="submit"]'
    );

    if (button && !button.disabled && button.offsetParent !== null) {
      button.click();
    }
  }

  setInterval(clickShowMore, 1000);
})();

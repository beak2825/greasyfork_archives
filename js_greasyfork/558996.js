// ==UserScript==
// @name         scroll
// @version      1.0.0
// @description  Custom spacebar scroll distance
// @match        *://*/*
// @namespace https://greasyfork.org/users/1524800
// @downloadURL https://update.greasyfork.org/scripts/558996/scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/558996/scroll.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCROLL_PERCENT = 40; // Percentage of viewport height to scroll

  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || e.target !== document.body) return;
    e.preventDefault();
    window.scrollBy({
      top: (e.shiftKey ? -1 : 1) * window.innerHeight * SCROLL_PERCENT / 100,
      behavior: 'smooth',
    });
  });
})();
// ==UserScript==
// @name        Instagram Next/Prev Shortcut 2 (custom)
// @namespace   https://github.com/gslin/instagram-next-prev-shortcut-userscript
// @match       https://www.instagram.com/*
// @grant       none
// @version     0.20230608.0
// @author      me
// @description Add shortcuts for Instagram Next/Prev buttons
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/562507/Instagram%20NextPrev%20Shortcut%202%20%28custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562507/Instagram%20NextPrev%20Shortcut%202%20%28custom%29.meta.js
// ==/UserScript==

(() => {
  document.addEventListener('keyup', function(event) {
    if ('input' === document.activeElement.tagName.toLowerCase()) {
      return;
    }

	if ('q' === event.key) {
      const el = document.querySelector('div[role="dialog"] button[aria-label="Go back"]');
      el?.click();
      return;
    }

	if ('e' === event.key) {
      const el = document.querySelector('div[role="dialog"] button[aria-label="Next"]');
      el?.click();
      return;
	}
   	if ('1' === event.key) {
      const el = document.querySelector('div[role="dialog"] button[aria-label="Go back"]');
      el?.click();
      return;
	}
    if ('3' === event.key) {
      const el = document.querySelector('div[role="dialog"] button[aria-label="Next"]');
      el?.click();
      return;
	}
  });
})();
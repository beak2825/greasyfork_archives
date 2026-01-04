// ==UserScript==
// @name         YouTube Hide Homepage Filter
// @description  Hides the YouTube homepage filter bar.
// @namespace    https://greasyfork.org/users/1476331-jon78
// @version      1.0
// @author       jon78
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/554086/YouTube%20Hide%20Homepage%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/554086/YouTube%20Hide%20Homepage%20Filter.meta.js
// ==/UserScript==

(() => {
  const css = `
    ytd-feed-filter-chip-bar-renderer { display: none !important; }
    #frosted-glass.ytd-app { height: 56px !important; }
  `;
  const add = () => {
    const { pathname, search } = location;
    if ((pathname === '/' || pathname === '/index') && !search.includes('v=')) {
      if (!document.querySelector('#hide-home-filter-style')) {
        const s = document.createElement('style');
        s.id = 'hide-home-filter-style';
        s.textContent = css;
        (document.head || document.documentElement).appendChild(s);
      }
    }
  };
  add();
  window.addEventListener('yt-navigate-finish', add, { passive: true });
})();
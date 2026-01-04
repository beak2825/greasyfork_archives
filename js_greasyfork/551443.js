// ==UserScript==
// @name         CB modifier
// @description  Remove Lock/Overlay + Zoom Hover
// @namespace    aravvn.tools
// @version      1.1.0
// @match        *://*.chaturbate.*/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/551443/CB%20modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/551443/CB%20modifier.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const clean = () => {
    // Lock Icons löschen
    document.querySelectorAll('[data-testid="lock-icon"]').forEach(el => el.remove());
    // graue Overlays löschen (direkte divs ohne data-testid)
    document.querySelectorAll('a[data-testid="photo-video-item"] > div:not([data-testid])').forEach(el => el.remove());
  };

  clean();
  new MutationObserver(clean).observe(document.body, { childList: true, subtree: true });

  // Zoom-Effekt per CSS
  GM_addStyle(`
    a[data-testid="photo-video-item"] img[data-testid="photo-video-preview"] {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: block;
    }
    a[data-testid="photo-video-item"]:hover img[data-testid="photo-video-preview"] {
      transform: scale(1.5);
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
      z-index: 2;
      position: relative;
    }
  `);
})();
// ==UserScript==
// @name         YouTube – Force All Videos as Watched
// @namespace    https://github.com/endsouls
// @version      1.0.0
// @description  Visually forces all YouTube video thumbnails to appear fully watched. 
// @author       endsouls
// @copyright    © 2026 endsouls
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561204/YouTube%20%E2%80%93%20Force%20All%20Videos%20as%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/561204/YouTube%20%E2%80%93%20Force%20All%20Videos%20as%20Watched.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BAR_HEIGHT = '3px';
  const BAR_COLOR = '#ff0000';

  function apply() {
    document.querySelectorAll('ytd-thumbnail').forEach(thumbnail => {
      let overlay = thumbnail.querySelector(
        'ytd-thumbnail-overlay-resume-playback-renderer[data-endsouls]'
      );

      if (!overlay) {
        overlay = document.createElement(
          'ytd-thumbnail-overlay-resume-playback-renderer'
        );
        overlay.setAttribute('data-endsouls', 'true');
        overlay.style.cssText = `
          display:block !important;
          opacity:1 !important;
          pointer-events:none;
        `;

        const progress = document.createElement('div');
        progress.style.cssText = `
          width:100%;
          height:${BAR_HEIGHT};
          background:${BAR_COLOR};
        `;

        progress.id = 'progress';
        overlay.appendChild(progress);
        thumbnail.appendChild(overlay);
      }
    });
  }

  const observer = new MutationObserver(apply);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener('yt-navigate-finish', apply);
})();

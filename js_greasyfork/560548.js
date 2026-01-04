// ==UserScript==
// @name         Twitch – Show Full Video Titles
// @namespace    twitch-full-titles
// @version      1.0.0
// @description  Remove Twitch title line-clamping and show full video titles everywhere
// @author       GPT
// @license      MIT
// @match        https://www.twitch.tv/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560548/Twitch%20%E2%80%93%20Show%20Full%20Video%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/560548/Twitch%20%E2%80%93%20Show%20Full%20Video%20Titles.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'twitch-full-title-style';

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Core title elements */
      h3[class*="Title"],
      h4[class*="Title"],
      h3[class*="CoreText"],
      h4[class*="CoreText"],
      .tw-title,
      [data-test-selector="preview-card-title"] {
        overflow: visible !important;
        text-overflow: unset !important;
        white-space: normal !important;
        max-height: none !important;
        height: auto !important;
        display: block !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: unset !important;
      }

      /* Common Twitch clamp containers */
      [class*="ScTextWrapper"],
      [class*="preview-card"],
      [class*="video-card"],
      [class*="media-card"] {
        overflow: visible !important;
        max-height: none !important;
      }

      /* Kill box-based clamps explicitly */
      [style*="-webkit-line-clamp"] {
        -webkit-line-clamp: unset !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function fixInlineClamps(root = document) {
    root.querySelectorAll('h3, h4').forEach(el => {
      const s = el.style;
      if (
        s.webkitLineClamp ||
        s.maxHeight ||
        s.overflow === 'hidden'
      ) {
        s.webkitLineClamp = 'unset';
        s.maxHeight = 'none';
        s.overflow = 'visible';
        s.whiteSpace = 'normal';
        s.textOverflow = 'unset';
        s.display = 'block';
      }
    });
  }

  injectCSS();
  fixInlineClamps();

  // Twitch is React + chaos, so we observe mutations
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          fixInlineClamps(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

})();

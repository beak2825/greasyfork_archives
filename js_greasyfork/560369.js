// ==UserScript==
// @name         X Trans Flag Merger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Merge split transgender flag images into a single emoji on X.com
// @author       Yumeka
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560369/X%20Trans%20Flag%20Merger.user.js
// @updateURL https://update.greasyfork.org/scripts/560369/X%20Trans%20Flag%20Merger.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // SVG identifiers based on Twitter's Twemoji filenames
  // 1f3f3 = White Flag, 26a7 = Male with Stroke etc (Trans Symbol part)
  const SEL_FLAG = 'img[src*="1f3f3.svg"]';
  const SEL_SYMBOL = 'src*="26a7.svg"';

  let pendingFrame = null;

  function mergeFlags() {
    const flags = document.querySelectorAll(SEL_FLAG);

    for (const flag of flags) {
      // Check adjacent elements for the broken sequence
      // Sequence: [Flag Img] + [Span/Text (ZWJ)] + [Symbol Img]
      const spacer = flag.nextElementSibling;
      if (!spacer) continue;

      const symbol = spacer.nextElementSibling;
      if (!symbol || symbol.tagName !== 'IMG' || !symbol.src.includes('26a7')) continue;

      // Verify structure matches the split emoji pattern
      // Replace the entire sequence with the standard emoji
      const emojiNode = document.createTextNode('🏳️‍⚧️');

      // Insert emoji before the flag
      flag.parentNode.insertBefore(emojiNode, flag);

      // Remove the broken pieces
      flag.remove();
      spacer.remove();
      symbol.remove();
    }
    pendingFrame = null;
  }

  function scheduleMerge() {
    if (pendingFrame) return;
    pendingFrame = requestAnimationFrame(mergeFlags);
  }

  // Observe DOM changes to handle dynamic content loading
  const observer = new MutationObserver(scheduleMerge);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  scheduleMerge();
})();

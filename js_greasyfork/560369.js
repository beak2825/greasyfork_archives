// ==UserScript==
// @name         X Trans Flag Merger
// @namespace    http://tampermonkey.net/
// @version      26.1.21
// @description  Merge split transgender flag images into a single emoji on X.com
// @author       Yumeka
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
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
      const emojiNode = document.createElement('img');
      emojiNode.alt = '🏳️‍⚧️';
      emojiNode.draggable = false;
      emojiNode.src = 'https://abs-0.twimg.com/emoji/v2/svg/1f3f3-fe0f-200d-26a7-fe0f.svg';
      emojiNode.title = '跨性别者旗帜';
      emojiNode.className = 'r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl';

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
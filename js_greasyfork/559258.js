// ==UserScript==
// @name         NZBKing Pagination Fix
// @namespace    https://github.com/Kodi-Allen/
// @version      2.5.0
// @description  Adds missing "next 50 posts" link on NZBKing search results
// @author       Kodi-Allen
// @match        https://www.nzbking.com/*
// @match        http://www.nzbking.com/*
// @match        https://nzbking.com/*
// @match        http://nzbking.com/*
// @match        *://*.nzbking.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559258/NZBKing%20Pagination%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559258/NZBKing%20Pagination%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const STEP = 50;
  const CHECK_INTERVAL = 500; // Check every 500ms

  // Helper: Build URL with new offset
  function buildHrefWithOffset(href, newOffset) {
    const u = new URL(href, location.origin);
    u.searchParams.set('o', String(newOffset));
    return u.toString();
  }

  // Main function - SUPER SIMPLE!
  function addNextLinkIfMissing() {
    // Only run on search results pages
    if (!location.pathname.startsWith('/')) return;
    if (!document.querySelector('form#nzblist')) return;

    const pag = document.querySelector('div.pagination');
    if (!pag) return; // No pagination div

    // Check if ANY next link already exists (ours or NZBKing's)
    const allLinks = Array.from(pag.querySelectorAll('a'));
    const hasNextLink = allLinks.some(a => {
      const text = a.textContent.toLowerCase();
      return text.includes('next') || a.textContent.includes('❯');
    });

    if (hasNextLink) {
      return; // Next link exists, we're done
    }

    // Get current offset
    const urlParams = new URLSearchParams(location.search);
    const currentOffset = parseInt(urlParams.get('o') || '0', 10);
    const nextOffset = currentOffset + STEP;

    // Create next link
    const nextLink = document.createElement('a');
    nextLink.href = buildHrefWithOffset(location.href, nextOffset);
    nextLink.textContent = `next ${STEP} posts ❯`;
    nextLink.setAttribute('data-tm-added', '1'); // Mark as ours

    // Find prev link to insert after it
    const prevLink = allLinks.find(a => {
      const text = a.textContent.toLowerCase();
      return text.includes('prev') || a.textContent.includes('❮');
    });

    if (prevLink) {
      // We're on page 2+, insert after prev
      prevLink.insertAdjacentText('afterend', '\n');
      prevLink.insertAdjacentElement('afterend', nextLink);
      console.log(`[NZBKing v2.5] Added next link after prev (offset ${currentOffset} -> ${nextOffset})`);
    } else if (currentOffset === 0) {
      // Page 1, no prev link, append to pagination
      pag.appendChild(nextLink);
      console.log(`[NZBKing v2.5] Added next link on page 1 (offset 0 -> ${nextOffset})`);
    }
  }

  // Run immediately
  console.log('[NZBKing v2.5] Script loaded, starting...');
  addNextLinkIfMissing();

  // Run again after short delays (for dynamic content)
  setTimeout(addNextLinkIfMissing, 100);
  setTimeout(addNextLinkIfMissing, 300);
  setTimeout(addNextLinkIfMissing, 800);

  // Keep checking every 500ms FOREVER
  setInterval(addNextLinkIfMissing, CHECK_INTERVAL);

  // Also watch for DOM changes
  const observer = new MutationObserver(() => {
    addNextLinkIfMissing();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  console.log('[NZBKing v2.5] Persistent monitoring active');
})();
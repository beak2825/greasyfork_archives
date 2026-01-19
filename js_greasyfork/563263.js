// ==UserScript==
// @name        itch.io Victory Cache Spoofer
// @namespace   Violentmonkey Scripts
// @match       https://itch.io/*
// @grant       GM_openInTab
// @version     1.2
// @description Forces paid cache and opens victory page in new tab
// @author      Anon
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/563263/itchio%20Victory%20Cache%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/563263/itchio%20Victory%20Cache%20Spoofer.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  // Override fetch to spoof cache status
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const modifiedInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
        'X-Itch-Cache-Status': 'purchased=true'
      }
    };
    return originalFetch(input, modifiedInit);
  };

  // Open purified victory tab after cache loads
  setTimeout(() => {
    const cleanURL = new URL(window.location.href);
    cleanURL.searchParams.set('force_cache', 'paid');
    GM_openInTab(cleanURL.toString(), { 
      active: true,
      loadInBackground: false
    });
  }, 2000);
});
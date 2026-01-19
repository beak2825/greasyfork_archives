// ==UserScript==
// @name        itch.io Paid Cache Spoofer
// @namespace   Violentmonkey Scripts
// @match       https://itch.io/*
// @grant       none
// @version     1.0
// @description Forces itch.io to serve cached "paid" content by modifying request headers
// @author      Anon
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/563262/itchio%20Paid%20Cache%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/563262/itchio%20Paid%20Cache%20Spoofer.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
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
  
  console.log('Cache spoofing active');
});
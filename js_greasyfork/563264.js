// ==UserScript==
// @name        itch.io Ultimate Victory Unlocker
// @namespace   Violentmonkey Scripts
// @match       https://itch.io/*
// @grant       GM_addStyle
// @version     1.4
// @description Unlocks victory screen via cached links popup
// @author      Anon
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/563264/itchio%20Ultimate%20Victory%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/563264/itchio%20Ultimate%20Victory%20Unlocker.meta.js
// ==/UserScript==

GM_addStyle(`
  #unlocker-popup {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #222;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 9999;
    color: white;
    font-family: sans-serif;
  }
  #unlocker-popup a {
    color: #4af;
    display: block;
    margin: 8px 0;
  }
`);

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

setTimeout(() => {
  const popup = document.createElement('div');
  popup.id = 'unlocker-popup';
  popup.innerHTML = `
    <h3>🎉 Unlocked Content</h3>
    <a href="${window.location.href}?force_cache=paid" target="_blank">Victory Screen</a>
    <small>Click above to access</small>
  `;
  document.body.appendChild(popup);
}, 2000);
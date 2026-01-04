// ==UserScript==
// @name         Torn Faction Inactives Button 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds an "Inactives" button to your faction profile with dark-mode compatible, styled modal.
// @author       —
// @match        https://www.torn.com/factions.php?step=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556275/Torn%20Faction%20Inactives%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/556275/Torn%20Faction%20Inactives%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ——— CONFIG ———
    const API_KEY = 'API_KEY'; // ← your Torn API key

    // ——— INJECT STYLES FOR DARK/LIGHT ———
    const style = document.createElement('style');
    style.textContent = `
    :root {
      --bg: #ffffff;
      --text: #000000;
      --overlay: rgba(0,0,0,0.5);
      --btn-bg: #f0f0f0;
      --btn-text: #007bff;
      --btn-hover: rgba(0,123,255,0.1);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #1e1e1e;
        --text: #e0e0e0;
        --overlay: rgba(0,0,0,0.8);
        --btn-bg: #2a2a2a;
        --btn-text: #66b2ff;
        --btn-hover: rgba(102,178,255,0.1);
      }
    }
    .inactives-modal {
      position: fixed;
      inset: 0;
      background: var(--overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .inactives-modal .modal-box {
      background: var(--bg);
      color: var(--text);
      padding: 20px;
      border-radius: 8px;
      max-height: 80vh;
      overflow-y: auto;
      width: 320px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      position: relative;
      font-family: Arial, sans-serif;
    }
    .inactives-modal h3 {
      margin: 0 0 10px;
      font-size: 1.2em;
    }
    .inactives-modal ul {
      padding-left: 20px;
      margin: 0;
    }
    .inactives-modal li {
      margin: 6px 0;
    }
    .inactives-modal .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 1.2em;
      cursor: pointer;
      color: var(--text);
    }
    .inactives-btn {
      margin-right: 10px;
      background: var(--btn-bg);
      color: var(--btn-text) !important;
      border: 1px solid var(--btn-text);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.9em;
      line-height: 1.5;
      text-decoration: none;
      transition: background 0.2s;
    }
    .inactives-btn:hover {
      background: var(--btn-hover);
      text-decoration: none;
    }
    `;
    document.head.appendChild(style);

    // ——— WAIT FOR ELEMENT ———
    function waitFor(selector, timeout = 10000) {
      return new Promise((res, rej) => {
        const interval = 100;
        let elapsed = 0;
        const iv = setInterval(() => {
          const el = document.querySelector(selector);
          if (el) { clearInterval(iv); res(el); }
          else if ((elapsed += interval) > timeout) { clearInterval(iv); rej(); }
        }, interval);
      });
    }

    // ——— SHOW MODAL ———
    function showModal(items) {
      document.querySelectorAll('.inactives-modal').forEach(e => e.remove());
      const overlay = document.createElement('div'); overlay.className = 'inactives-modal';
      const box = document.createElement('div'); box.className = 'modal-box';
      box.innerHTML = '<h3>Inactives (>1 day)</h3>';

      const close = document.createElement('button');
      close.className = 'close-btn'; close.textContent = '✕';
      close.onclick = () => overlay.remove();
      box.appendChild(close);

      if (!items.length) {
        const p = document.createElement('p');
        p.textContent = 'All members active within the last day.';
        box.appendChild(p);
      } else {
        const ul = document.createElement('ul');
        items.forEach(m => {
          const li = document.createElement('li');
          li.textContent = `${m.name} — last seen ${m.relative}`;
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }

      overlay.appendChild(box);
      document.body.appendChild(overlay);
    }

    // ——— FETCH & FILTER ———
    async function fetchInactives() {
      try {
        // extract faction ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const factionId = urlParams.get('ID');
        const apiUrl = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true`;

        const res = await fetch(apiUrl, {
          headers: { 'Authorization': `ApiKey ${API_KEY}` }
        });
        const data = await res.json();
        if (!data.members) throw new Error('Invalid API response');

        const now = Math.floor(Date.now()/1000);
        const list = data.members
          .filter(m => now - m.last_action.timestamp > 86400)
          .map(m => ({ name: m.name, relative: m.last_action.relative }))
          .sort((a,b) => parseInt(b.relative) - parseInt(a.relative));

        showModal(list);
      } catch (e) {
        console.error(e);
        alert('Error fetching inactives: ' + e.message);
      }
    }

    // ——— INIT BUTTON ———
    waitFor('#top-page-links-list')
      .then(container => {
        const btn = document.createElement('a');
        btn.href = '#'; btn.textContent = 'Inactives';
        btn.className = 'inactives-btn';
        btn.onclick = e => { e.preventDefault(); fetchInactives(); };
        container.insertBefore(btn, container.firstChild);
      })
      .catch(() => console.error('Inactives: container not found'));
})();
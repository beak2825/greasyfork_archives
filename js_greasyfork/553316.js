// ==UserScript==
// @name         Eclesiar War Dropchance One-Shot Tracker
// @namespace    https://eclesiar.com/
// @version      1.2
// @description  Shows drop chance (%) for the next fight request only on Eclesiar War pages
// @author       jeppe
// @match        https://eclesiar.com/war/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553316/Eclesiar%20War%20Dropchance%20One-Shot%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/553316/Eclesiar%20War%20Dropchance%20One-Shot%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';
const textDropOff = "Click to check drop next hit"
const textDropOn = "Checking drop next hit"

  // --- UI elements ---
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'flex-end',
    fontFamily: 'monospace'
  });

  const dropBox = document.createElement('div');
  Object.assign(dropBox.style, {
    background: 'rgba(0,0,0,0.8)',
    color: '#00ff80',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    minWidth: '150px',
    textAlign: 'right',
  });
  dropBox.textContent = 'Drop Chance: --';

  const toggleBtn = document.createElement('button');
  Object.assign(toggleBtn.style, {
    background: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '13px',
  });
  toggleBtn.textContent = textDropOff


  container.appendChild(toggleBtn);
  document.body.appendChild(container);

  // --- State ---
  let watchNext = false;
  const currentText = watchNext ? textDropOn : textDropOff

  toggleBtn.addEventListener('click', () => {
    watchNext = !watchNext;
    toggleBtn.textContent = currentText
    toggleBtn.style.background = watchNext ? '#007a33' : '#444';
    container.appendChild(dropBox);

  });

  function updateBox(chance) {
    if (typeof chance === 'number') {
      dropBox.textContent = `Drop Chance: ${(chance / 100).toFixed(2)}%`;
      dropBox.style.color = '#00ff80';
      dropBox.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 300 });
    } else {
      dropBox.textContent = 'Drop Chance: N/A';
      dropBox.style.color = '#ff0';
    }
  }

  const isFightRequest = (url) => typeof url === 'string' && url.includes('/war/fight');

  // --- Intercept fetch ---
  const origFetch = window.fetch;
  window.fetch = async (...args) => {
    const res = await origFetch(...args);
    try {
      const url = args[0];
      if (watchNext && isFightRequest(url)) {
        watchNext = false;
        toggleBtn.textContent = textDropOff
        toggleBtn.style.background = '#444';

        const cloned = res.clone();
        const json = await cloned.json().catch(() => null);
        const chance = json?.data?.drop?.chance;
        updateBox(chance);
      }
    } catch (e) {
      console.warn('Fetch intercept error:', e);
    }
    return res;
  };

  // --- Intercept XMLHttpRequest ---
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._isFight = isFightRequest(url);
    return origOpen.call(this, method, url, ...rest);
  };

  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    if (this._isFight) {
      this.addEventListener('load', function () {
        if (!watchNext) return;
        watchNext = false;
        toggleBtn.textContent = '⚪️ Drop OFF';
        toggleBtn.style.background = '#444';

        try {
          if (this.status === 200 && this.responseText) {
            const json = JSON.parse(this.responseText);
            const chance = json?.data?.drop?.chance;
            updateBox(chance);
          }
        } catch (e) {
          console.warn('XHR intercept error:', e);
        }
      });
    }
    return origSend.call(this, ...args);
  };
})();

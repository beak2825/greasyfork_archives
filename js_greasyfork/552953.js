// ==UserScript==
// @name         Sinister Streets Tower Hotkeys
// @namespace    https://sinisterstreets.com/
// @version      1.2.1
// @description  Use number keys (1–8) to focus and click tower buttons on Sinister Streets tower page.
// @match        https://sinisterstreets.com/tower.php
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552953/Sinister%20Streets%20Tower%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/552953/Sinister%20Streets%20Tower%20Hotkeys.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ✅ Key to selector map
  const keyMap = {
    '1': '#attack-btn',
    '2': '#continue-tower-btn',
    '3': '#continue-tower-btn',
    '4': '#repeat-floor-btn',
    '5': '#next-floor-btn',
    '6': '#use-item-btn',
    '7': 'button.healing-item-btn[data-id="25734"]',
    '8': 'button.healing-item-btn[data-id="25735"]'
  };

  const pressCooldown = 400; // ms for double press detection
  const lastPress = {};

  // Random delay range (ms)
  const minDelay = 80;
  const maxDelay = 250;

  function randomDelay() {
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  }

  function isTyping(e) {
    const t = e.target;
    const tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || t.isContentEditable;
  }

  function focusElement(el) {
    if (!el) return;
    el.focus({ preventScroll: true });
    el.classList.add('hotkey-focus');
    setTimeout(() => el.classList.remove('hotkey-focus'), 200);
  }

  function clickElement(el) {
    if (!el) return;
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    el.click();
  }

  window.addEventListener('keydown', (e) => {
    if (isTyping(e)) return;

    const key = e.key;
    if (!keyMap[key]) return;

    const el = document.querySelector(keyMap[key]);
    if (!el) return;

    e.preventDefault();

    const now = Date.now();
    if (lastPress[key] && now - lastPress[key] < pressCooldown) {
      // Second press → click after random delay
      const delay = randomDelay();
      setTimeout(() => {
        clickElement(el);
      }, delay);
      lastPress[key] = 0;
    } else {
      // First press → focus immediately
      focusElement(el);
      lastPress[key] = now;
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    .hotkey-focus {
      outline: 3px solid gold !important;
      box-shadow: 0 0 10px gold !important;
    }
  `;
  document.head.appendChild(style);
})();

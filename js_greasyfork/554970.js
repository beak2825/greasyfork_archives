// ==UserScript==
// @name         GeoGuessr: Leave Game Shortcut (Q)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.2.0
// @description  Press Q to leave game quickly.
// @author       Rotski
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554970/GeoGuessr%3A%20Leave%20Game%20Shortcut%20%28Q%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554970/GeoGuessr%3A%20Leave%20Game%20Shortcut%20%28Q%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Tweaks ----
  const HOTKEY     = 'q';   // trigger key
  const DELAY_MS   = 50;   // wait after ESC
  const TIMEOUT_MS = 5000;  // max time to keep searching for the button

  function isTypingTarget(el){
    const t = (el && el.tagName || '').toLowerCase();
    return t === 'input' || t === 'textarea' || (el && el.isContentEditable);
  }

  function sendEscEverywhere(){
    const opts = { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true, cancelable: true, composed: true };
    const targets = [window, document, document.documentElement, document.body, document.activeElement].filter(Boolean);
    for (const tg of targets) tg.dispatchEvent(new KeyboardEvent('keydown', opts));
    for (const tg of targets) tg.dispatchEvent(new KeyboardEvent('keyup', opts));
  }

  function isVisible(el){
    return !!(el && el.offsetParent !== null);
  }

  function findWrapperButtons() {
    // exact wrapper class
    const wrappers = Array.from(document.querySelectorAll('.button_wrapper__zayJ3'));
    // or any hashed variant if it ever changes:
    const wildcards = Array.from(document.querySelectorAll('[class^="button_wrapper__"], [class*=" button_wrapper__"]'));
    const all = wrappers.length ? wrappers : wildcards;

    // Map to closest <button>
    const buttons = [];
    for (const w of all) {
      const btn = w.closest('button');
      if (btn && isVisible(btn) && !buttons.includes(btn)) buttons.push(btn);
    }
    return buttons;
  }

  function looksSecondary(btn){
    return Array.from(btn.classList).some(c => /^button_variantSecondary__/.test(c));
  }

  function pickTargetButton(){
    const candidates = findWrapperButtons();
    if (!candidates.length) return null;

    // Prefer Secondary variant
    const secondary = candidates.find(looksSecondary);
    if (secondary) return secondary;

    // Otherwise first visible
    return candidates[0];
  }

  function clickAfterDelay() {
    const start = performance.now();
    return new Promise((resolve) => {
      const tryClick = () => {
        const btn = pickTargetButton();
        if (btn) { btn.click(); resolve(true); return; }
        if (performance.now() - start > TIMEOUT_MS) { resolve(false); return; }
        setTimeout(tryClick, 100);
      };
      setTimeout(tryClick, DELAY_MS);
    });
  }

  window.addEventListener('keydown', async (e) => {
    if ((e.key || '').toLowerCase() !== HOTKEY) return;
    if (e.repeat) return;
    if (isTypingTarget(e.target)) return;

    e.preventDefault();
    e.stopPropagation();

    sendEscEverywhere();
    await clickAfterDelay();
  }, true);
})();

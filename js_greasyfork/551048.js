// ==UserScript==
// @name         ChatGPT Alt+A Thinking Mode Toggle
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0.0
// @description  Assign Alt+A to toggle ChatGPT thinking mode between Standard and Extended via the composer menu.
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551048/ChatGPT%20Alt%2BA%20Thinking%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/551048/ChatGPT%20Alt%2BA%20Thinking%20Mode%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const EXTENDED_PILL_SELECTOR = 'button[aria-label*="Extended thinking"]';
  const STANDARD_PILL_SELECTOR = 'button[aria-label*="생각 중"]';

  function findThinkingToggleButton() {
    const candidates = document.querySelectorAll('button.__composer-pill[aria-haspopup="menu"]');
    for (const btn of candidates) {
      const text = btn.textContent || '';
      if (/extended thinking|생각 중/i.test(text)) return btn;
    }
    return null;
  }

  function simulateClick(el) {
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch {}
    const opts = { bubbles: true, cancelable: true, composed: true, view: window };
    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
      el.dispatchEvent(new MouseEvent(type, { ...opts, buttons: type === 'mousedown' ? 1 : 0 }));
    });
  }

  function normalizeLabel(text) {
    return text ? text.replace(/\s+/g, ' ').trim() : '';
  }

  function findMenuItemByLabelFragment(fragment) {
    const target = normalizeLabel(fragment);
    if (!target) return null;
    const items = document.querySelectorAll(
      '[role="menuitem"],[role="menuitemradio"],[role="menuitemcheckbox"]'
    );
    for (const item of items) {
      const label = normalizeLabel(item.textContent || '');
      if (label && label.includes(target)) return item;
    }
    return null;
  }

  function ensureMenuOpen(afterOpen) {
    const toggle = findThinkingToggleButton();
    if (!toggle) return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      afterOpen(toggle);
      return;
    }
    simulateClick(toggle);
    setTimeout(() => afterOpen(toggle), 40);
  }

  function waitAndClickMenuItem(fragment, attempt = 0) {
    const item = findMenuItemByLabelFragment(fragment);
    if (item) {
      simulateClick(item);
      return;
    }
    if (attempt >= 40) return;
    setTimeout(() => waitAndClickMenuItem(fragment, attempt + 1), 50);
  }

  function switchToStandard() {
    ensureMenuOpen(() => {
      waitAndClickMenuItem('Standard');
    });
  }

  function switchToExtended() {
    ensureMenuOpen(() => {
      waitAndClickMenuItem('Extended');
    });
  }

  function toggleThinkingMode() {
    const extendedPill = document.querySelector(EXTENDED_PILL_SELECTOR);
    if (extendedPill) {
      switchToStandard();
      return;
    }

    const standardPill = document.querySelector(STANDARD_PILL_SELECTOR);
    if (standardPill) {
      switchToExtended();
      return;
    }
  }

  window.addEventListener(
    'keydown',
    (e) => {
      if (e.code !== 'KeyA') return;
      if (!e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();
      requestAnimationFrame(toggleThinkingMode);
    },
    true
  );
})();

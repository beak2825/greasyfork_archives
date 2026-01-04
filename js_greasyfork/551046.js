// ==UserScript==
// @name         ChatGPT Alt+C Deep Research Toggle
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0.0
// @description  Assign Alt+C to toggle the ChatGPT Deep Research tag via the composer menu.
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551046/ChatGPT%20Alt%2BC%20Deep%20Research%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/551046/ChatGPT%20Alt%2BC%20Deep%20Research%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function findPopupButton() {
    return (
      document.querySelector('#composer-plus-btn') ||
      document.querySelector('button[aria-label*="파일 추가"]') ||
      document.querySelector('button[data-testid="composer-plus-btn"]')
    );
  }

  function ensureMenuOpen(afterOpen) {
    const btn = findPopupButton();
    if (!btn) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      afterOpen(btn);
      return;
    }
    simulateClick(btn);
    setTimeout(() => afterOpen(btn), 40);
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

  function findDeepResearchItem() {
    return findMenuItemByLabelFragment('심층 리서치');
  }

  function findRemoveResearchButton() {
    return document.querySelector('button[aria-label="리서치, 클릭해 제거"]');
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

  function runDeepResearchFlow() {
    const removeBtn = findRemoveResearchButton();
    if (removeBtn) {
      simulateClick(removeBtn);
      return;
    }

    ensureMenuOpen(() => {
      waitForDeepResearchItem();
    });
  }

  function waitForDeepResearchItem(attempt = 0) {
    const item = findDeepResearchItem();
    if (item) {
      simulateClick(item);
      return;
    }
    if (attempt >= 20) return;
    setTimeout(() => waitForDeepResearchItem(attempt + 1), 50);
  }

  window.addEventListener(
    'keydown',
    (e) => {
      if (e.code !== 'KeyC') return;
      if (!e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();
      requestAnimationFrame(runDeepResearchFlow);
    },
    true
  );
})();

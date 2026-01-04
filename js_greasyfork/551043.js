// ==UserScript==
// @name         ChatGPT Alt+Z Web Search Toggle
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0.0
// @description  Assign Alt+Z to toggle the ChatGPT web search option via the composer menu.
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551043/ChatGPT%20Alt%2BZ%20Web%20Search%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/551043/ChatGPT%20Alt%2BZ%20Web%20Search%20Toggle.meta.js
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

  function findMoreMenuItem() {
    return findMenuItemByLabelFragment('더 보기');
  }

  function findWebSearchItem() {
    return findMenuItemByLabelFragment('웹 검색');
  }

  function findRemoveSearchButton() {
    return document.querySelector('button[aria-label="검색, 클릭해 제거"]');
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

  function simulateHover(el) {
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch {}
    const pointerOpts = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      buttons: 0,
    };
    if (typeof PointerEvent === 'function') {
      ['pointerenter', 'pointerover', 'pointermove'].forEach(type => {
        try {
          el.dispatchEvent(new PointerEvent(type, pointerOpts));
        } catch {}
      });
    }
    const mouseOpts = { bubbles: true, cancelable: true, composed: true, view: window };
    ['mouseenter', 'mouseover', 'mousemove'].forEach(type => {
      el.dispatchEvent(new MouseEvent(type, mouseOpts));
    });
  }

  function runWebSearchFlow() {
    const removeBtn = findRemoveSearchButton();
    if (removeBtn) {
      simulateClick(removeBtn);
      return;
    }

    ensureMenuOpen(() => {
      waitForMoreItem();
    });
  }

  function waitForMoreItem(attempt = 0) {
    const moreItem = findMoreMenuItem();
    if (!moreItem) {
      if (attempt >= 20) return;
      setTimeout(() => waitForMoreItem(attempt + 1), 50);
      return;
    }
    simulateHover(moreItem);
    waitForWebSearchItem(moreItem);
  }

  function waitForWebSearchItem(moreItem, attempt = 0) {
    const webSearch = findWebSearchItem();
    if (webSearch) {
      simulateClick(webSearch);
      return;
    }
    if (attempt >= 40) return;
    simulateHover(moreItem);
    setTimeout(() => waitForWebSearchItem(moreItem, attempt + 1), 50);
  }

  function onKeyDown(e) {
    if (e.code !== 'KeyZ') return;
    if (!e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    e.stopPropagation();

    const removeBtn = findRemoveSearchButton();
    if (removeBtn) {
      requestAnimationFrame(() => simulateClick(removeBtn));
      return;
    }

    requestAnimationFrame(runWebSearchActivation);
  }

  function runWebSearchActivation() {
    ensureMenuOpen(() => {
      waitForMoreItem();
    });
  }

  window.addEventListener('keydown', onKeyDown, true);
})();

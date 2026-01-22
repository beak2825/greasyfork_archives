// ==UserScript==
// @name         Binance Auto Close Notification (Human Click, URL-change)
// @namespace    https://binance.com/
// @version      1.0.0
// @description  Human-like click for Binance notifications & modal, trigger on URL change only
// @match        https://www.binance.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563453/Binance%20Auto%20Close%20Notification%20%28Human%20Click%2C%20URL-change%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563453/Binance%20Auto%20Close%20Notification%20%28Human%20Click%2C%20URL-change%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ================= CONFIG ================= */
  const CONFIG = {
    retry: {
      durationMs: 5000,
      stepMs: 150,
    },

    timing: {
      afterUrlChangeDelay: 100,
    },

    selectors: {
      notificationClose:
        'svg.bn-notification-close[role="button"], svg.bn-notification-close[aria-label="close"]',

      modalDialog:
        'div[role="dialog"][aria-modal="true"]',

      modalConfirmText: 'I understand',
    },

    flags: {
      doneAttr: 'tmDone',
    },
  };
  /* ========================================== */

  /* ---------- Human click (Binance-friendly) ---------- */
  function humanClick(el) {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const opts = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: rect.left + Math.min(5, rect.width / 2),
      clientY: rect.top + Math.min(5, rect.height / 2),
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
    };

    try {
      if (window.PointerEvent) {
        el.dispatchEvent(new PointerEvent('pointerdown', opts));
        el.dispatchEvent(new PointerEvent('pointerup', opts));
      }
    } catch (_) {}

    try {
      el.dispatchEvent(new MouseEvent('mousedown', opts));
      el.dispatchEvent(new MouseEvent('mouseup', opts));
      el.dispatchEvent(new MouseEvent('click', opts));
    } catch (_) {}

    // fallback cuối cùng (React đôi khi chỉ nghe native click)
    try { el.click(); } catch (_) {}
  }

  /* ---------- Close notifications ---------- */
  function closeNotifications(root = document) {
    const buttons = root.querySelectorAll(CONFIG.selectors.notificationClose);

    buttons.forEach(btn => {
      if (btn.dataset[CONFIG.flags.doneAttr]) return;
      btn.dataset[CONFIG.flags.doneAttr] = '1';
      humanClick(btn);
    });
  }

  /* ---------- Confirm modal ---------- */
  function confirmModal(root = document) {
    const dialogs = root.querySelectorAll(CONFIG.selectors.modalDialog);

    dialogs.forEach(dialog => {
      const buttons = dialog.querySelectorAll('button');
      for (const btn of buttons) {
        const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();
        if (text === CONFIG.selectors.modalConfirmText) {
          if (btn.dataset[CONFIG.flags.doneAttr]) return;
          btn.dataset[CONFIG.flags.doneAttr] = '1';
          humanClick(btn);
          return;
        }
      }
    });
  }

  function runAll() {
    closeNotifications(document);
    confirmModal(document);
  }

  /* ---------- Retry window (late render safe) ---------- */
  function runAllWithRetry() {
    const { durationMs, stepMs } = CONFIG.retry;
    const start = Date.now();

    (function tick() {
      runAll();
      if (Date.now() - start < durationMs) {
        setTimeout(tick, stepMs);
      }
    })();
  }

  /* ---------- URL change detection (SPA) ---------- */
  let lastUrl = location.href;

  function onUrlChange() {
    const current = location.href;
    if (current === lastUrl) return;
    lastUrl = current;

    setTimeout(runAllWithRetry, CONFIG.timing.afterUrlChangeDelay);
  }

  const _pushState = history.pushState;
  history.pushState = function () {
    _pushState.apply(this, arguments);
    onUrlChange();
  };

  const _replaceState = history.replaceState;
  history.replaceState = function () {
    _replaceState.apply(this, arguments);
    onUrlChange();
  };

  window.addEventListener('popstate', onUrlChange);

  /* ---------- Initial ---------- */
  runAllWithRetry();
})();

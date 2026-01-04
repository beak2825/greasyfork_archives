// ==UserScript==
// @name        Auto Close NotebookLM Panels
// @namespace   Violentmonkey Scripts
// @match       https://notebooklm.google.com/*
// @run-at      document-start
// @version     1.0
// @author      Bui Quoc Dung
// @description Close the source & studio panels after navigating to notebooklm
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548000/Auto%20Close%20NotebookLM%20Panels.user.js
// @updateURL https://update.greasyfork.org/scripts/548000/Auto%20Close%20NotebookLM%20Panels.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DELAY_MS = 2000;
  const SELECTORS = [
    'button.toggle-source-panel-button',
    'button.toggle-studio-panel-button'
  ];

  let lastHandledUrl = null;

  function closePanelsOnceForCurrentUrl() {
    if (!location.pathname.startsWith('/notebook/')) return;
    if (lastHandledUrl === location.href) return;
    lastHandledUrl = location.href;

    setTimeout(() => {
      for (const sel of SELECTORS) {
        try {
          const btn = document.querySelector(sel);
          if (btn) btn.click();
        } catch (e) {
        }
      }
    }, DELAY_MS);
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', closePanelsOnceForCurrentUrl);
  } else {
    closePanelsOnceForCurrentUrl();
  }

  (function patchHistory() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    history.pushState = function (...args) {
      const res = _push.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return res;
    };

    history.replaceState = function (...args) {
      const res = _replace.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return res;
    };

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', closePanelsOnceForCurrentUrl);
  })();

})();

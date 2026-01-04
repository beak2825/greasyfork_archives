// ==UserScript==
// @name        Auto Close Google AI Studio Settings Panel
// @namespace   Violentmonkey Scripts
// @match       https://aistudio.google.com/*
// @run-at      document-start
// @version     1.2
// @author      Bui Quoc Dung
// @description Close the Run settings panel after page aistudio load
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547997/Auto%20Close%20Google%20AI%20Studio%20Settings%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/547997/Auto%20Close%20Google%20AI%20Studio%20Settings%20Panel.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DELAY_MS = 1000;
  const RETRY_TIMES = 2;
  const SELECTOR = 'button[aria-label="Close run settings panel"]';
  let lastHandledUrl = null;

  function closeSettingsPanelWithRetries() {
    if (lastHandledUrl === location.href) return;
    lastHandledUrl = location.href;

    for (let i = 0; i < RETRY_TIMES; i++) {
      setTimeout(() => {
        try {
          const button = document.querySelector(SELECTOR);
          if (button) {
            button.click();
          }
        } catch (e) {
        }
      }, DELAY_MS * (i + 1));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', closeSettingsPanelWithRetries);
  } else {
    closeSettingsPanelWithRetries();
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

    window.addEventListener('popstate', () =>
      window.dispatchEvent(new Event('locationchange'))
    );
    window.addEventListener('locationchange', closeSettingsPanelWithRetries);
  })();
})();

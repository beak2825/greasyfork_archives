// ==UserScript==
// @name        Auto Close Panel & Enable Grounding/Context in Google AI Studio
// @namespace   Violentmonkey Scripts
// @match       https://aistudio.google.com/*
// @run-at      document-start
// @version     1.0
// @author      Bui Quoc Dung
// @description Automatically enables "Grounding with Google Search" and "Browse the URL context" and closes the Run settings panel after the aistudio page loads.
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/555375/Auto%20Close%20Panel%20%20Enable%20GroundingContext%20in%20Google%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/555375/Auto%20Close%20Panel%20%20Enable%20GroundingContext%20in%20Google%20AI%20Studio.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DELAY_MS_CLOSE_PANEL = 1000;
  const RETRY_TIMES_CLOSE_PANEL = 2;
  const SELECTOR_CLOSE_BUTTON = 'button[aria-label="Close run settings panel"]';
  let lastHandledUrlForPanel = null;
    const SELECTORS_ENABLE_BUTTONS = [
    'button[aria-label="Grounding with Google Search"]',
    'button[aria-label="Browse the url context"]'
  ];
  let lastHandledUrlForEnable = null;
  function closeSettingsPanelWithRetries() {
    if (lastHandledUrlForPanel === location.href) return;
    lastHandledUrlForPanel = location.href;

    for (let i = 0; i < RETRY_TIMES_CLOSE_PANEL; i++) {
      setTimeout(() => {
        try {
          const button = document.querySelector(SELECTOR_CLOSE_BUTTON);
          if (button) {
            button.click();
          }
        } catch (e) {
          console.error('Error trying to close settings panel:', e);
        }
      }, DELAY_MS_CLOSE_PANEL * (i + 1));
    }
  }

  function waitForElement(selector, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if ((elapsed += interval) >= timeout) {
          clearInterval(timer);
          reject(new Error(`Element not found for selector: ${selector}`));
        }
      }, interval);
    });
  }

  async function enableSwitches() {
      if (lastHandledUrlForEnable === location.href) return;
      lastHandledUrlForEnable = location.href;

    for (const selector of SELECTORS_ENABLE_BUTTONS) {
      try {
        const button = await waitForElement(selector, 2000);
        if (button.getAttribute('aria-checked') === 'false') {
          button.click();
        }
      } catch (err) {
      }
    }
  }

  function runAllTasks() {
      setTimeout(() => {
        enableSwitches();
        closeSettingsPanelWithRetries();
      }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTasks);
  } else {
    runAllTasks();
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
    window.addEventListener('locationchange', runAllTasks);
  })();
})();
// ==UserScript==
// @name         [Lemmy] Hides Virtual Keyboard On Search
// @match        *://*/*
// @noframes
// @run-at       document-end
// @inject-into  content
// @grant        none
// @namespace    Violentmonkey Scripts
// @author       SedapnyaTidur
// @version      1.0.0
// @license      MIT
// @revision     1/12/2026, 6:16:10 PM
// @description  Hides virtual keyboard after pressing Enter key or clicking search button in search input field.
// @downloadURL https://update.greasyfork.org/scripts/562200/%5BLemmy%5D%20Hides%20Virtual%20Keyboard%20On%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/562200/%5BLemmy%5D%20Hides%20Virtual%20Keyboard%20On%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!document.head.querySelector(':scope > meta[name="Description"][content="Lemmy"]')) return;

  let abortController, observer, searchInterval = 0, searchTimeout = 0;

  const configs = [{
    path: /^\/search/,
    input: ':scope > div#root > div > main > div > div > form > div:nth-child(1) > input[type="text"]',
    button: ':scope > div#root > div > main > div > div > form > div:nth-child(2) > button'
  }, {
    path: /^\/communities/,
    input: ':scope > div#root > div > main > div > div > div > div:nth-of-type(1) > div:last-child > form > div:nth-child(1) > input[type="text"]',
    button: ':scope > div#root > div > main > div > div > div > div:nth-of-type(1) > div:last-child > form > div:nth-child(2) > button'
  }, {
    path: /^\/(?:c|comment|post)\//,
    input: ':scope > div#root > div > main > div > div > div > aside > div > aside > div > section:nth-child(1) > div > form > input',
    button: ':scope > div#root > div > main > div > div > div > aside > div > aside > div > section:nth-child(1) > div > form > button',
  }];

  const hideKeyboard = function() {
    window.setTimeout(() => document.activeElement?.blur(), 0);
  };

  const start = function(config) {
    if (!config) return;

    searchTimeout = window.setTimeout(() => window.clearInterval(searchInterval), 10000);

    searchInterval = window.setInterval(() => {
      const input = document.body.querySelector(config.input);
      if (!input) return;
      const button = document.body.querySelector(config.button);
      if (!button) return;
      window.clearInterval(searchInterval);
      window.clearTimeout(searchTimeout);
      searchInterval = searchTimeout = 0;

      abortController = new AbortController();

      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') hideKeyboard();
      }, { capture: false, signal: abortController.signal });

      button.addEventListener('click', function(event) {
        hideKeyboard();
      }, { capture: false, signal: abortController.signal });

      observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.tagName.toLowerCase() === 'svg' && node.classList.contains('spin')) {
              hideKeyboard();
              return;
            }
          }
        }
      });
      observer.observe(button, { childList: true });

      if (button.firstChild?.tagName.toLowerCase() === 'svg' && button.firstChild.classList.contains('spin')) {
        hideKeyboard();
      }
    }, 1000);
  };

  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLLinkElement && node.rel === 'canonical') {
          window.clearInterval(searchInterval);
          window.clearTimeout(searchTimeout);
          searchInterval = searchTimeout = 0;
          // The URL and canonical link changed when applying different filters.
          // Thus, the previous listeners and observer must be stopped.
          if (observer) {
            abortController.abort();
            observer.disconnect();
            observer = null;
          }
          start(configs.find(({path}) => path.test(window.location.pathname)));
          return;
        }
      }
    }
  }).observe(document.head, { childList: true });

  start(configs.find(({path}) => path.test(window.location.pathname)));

})();

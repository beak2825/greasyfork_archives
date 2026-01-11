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
// @revision     1/11/2026, 6:36:34 PM
// @description  Hides virtual keyboard after pressing Enter key or clicking search button in search input field.
// @downloadURL https://update.greasyfork.org/scripts/562200/%5BLemmy%5D%20Hides%20Virtual%20Keyboard%20On%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/562200/%5BLemmy%5D%20Hides%20Virtual%20Keyboard%20On%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!document.head.querySelector(':scope > meta[name="Description"][content="Lemmy"]')) return;

  let searchInterval = 0, searchTimeout = 0;

  const configs = [{
    path: '/search',
    input: ':scope > div#root > div > main > div > div > form > div:nth-child(1) > input[type="text"]',
    button: ':scope > div#root > div > main > div > div > form > div:nth-child(2) > button'
  }, {
    path: '/communities',
    input: ':scope > div#root > div > main > div > div > div > div:nth-of-type(1) > div:last-child > form > div:nth-child(1) > input[type="text"]',
    button: ':scope > div#root > div > main > div > div > div > div:nth-of-type(1) > div:last-child > form > div:nth-child(2) > button'
  }, {
    path: '/c/',
    input: ':scope > div#root > div > main > div > div > div > aside > div > aside > div > section:nth-child(1) > div > form > input',
    button: ':scope > div#root > div > main > div > div > div > aside > div > aside > div > section:nth-child(1) > div > form > button',
  }];

  const unfocus = function() {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.style.height = '0px';
    input.style.opacity = 0;
    input.style.outline = 'none';
    document.body.appendChild(input);

    window.setTimeout(() => {
      input.focus();
      window.setTimeout(() => {
        input.style.display = 'none';
        input.remove();
      }, 0);
    }, 0);
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

      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') unfocus();
      }, false);
      button.addEventListener('click', function(event) { unfocus(); }, false);
    }, 1000);
  };

  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLLinkElement && node.rel === 'canonical') {
          window.clearInterval(searchInterval);
          window.clearTimeout(searchTimeout);
          searchInterval = searchTimeout = 0;
          start(configs.find(({path}) => window.location.pathname.startsWith(path)));
          return;
        }
      }
    }
  }).observe(document.head, { childList: true });

  start(configs.find(({path}) => window.location.pathname.startsWith(path)));

})();

// ==UserScript==
// @name         ChatGPT Alt+T Search
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0.0
// @description  Assign Alt+T to fire the Ctrl+K keyboard shortcut on ChatGPT.
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551050/ChatGPT%20Alt%2BT%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/551050/ChatGPT%20Alt%2BT%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isMac = /mac/i.test(navigator.platform);

  function dispatchShortcut(target) {
    const options = {
      key: 'k',
      code: 'KeyK',
      keyCode: 75,
      which: 75,
      ctrlKey: !isMac,
      metaKey: isMac,
      altKey: false,
      shiftKey: false,
      bubbles: true,
      cancelable: true,
      composed: true,
    };

    const down = new KeyboardEvent('keydown', options);
    const up = new KeyboardEvent('keyup', options);

    target.dispatchEvent(down);
    target.dispatchEvent(up);
  }

  function triggerCtrlK() {
    const active = document.activeElement || document.body;
    dispatchShortcut(active);
  }

  window.addEventListener(
    'keydown',
    (e) => {
      if (e.code !== 'KeyT') return;
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      e.stopPropagation();
      requestAnimationFrame(triggerCtrlK);
    },
    true
  );
})();

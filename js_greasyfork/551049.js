// ==UserScript==
// @name         ChatGPT Ctrl+Shift+Z New Chat
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0.0
// @description  Remap Ctrl+Shift+Z to emit Ctrl+Shift+O inside ChatGPT.
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551049/ChatGPT%20Ctrl%2BShift%2BZ%20New%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/551049/ChatGPT%20Ctrl%2BShift%2BZ%20New%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function dispatchCtrlShiftO(originalEvent) {
    const target = document.activeElement || document.body;
    const useMeta = originalEvent.metaKey && !originalEvent.ctrlKey ? true : false;
    const useCtrl = !useMeta ? originalEvent.ctrlKey || !/mac/i.test(navigator.platform) : false;

    const base = {
      key: 'o',
      code: 'KeyO',
      keyCode: 79,
      which: 79,
      ctrlKey: useCtrl,
      metaKey: useMeta,
      shiftKey: true,
      altKey: false,
      bubbles: true,
      cancelable: true,
      composed: true,
    };

    const down = new KeyboardEvent('keydown', base);
    const up = new KeyboardEvent('keyup', base);

    target.dispatchEvent(down);
    target.dispatchEvent(up);
  }

  window.addEventListener(
    'keydown',
    (e) => {
      const key = e.key?.toLowerCase();
      const isZ = key === 'z';
      const hasShift = e.shiftKey;
      const hasCtrl = e.ctrlKey;
      const hasMeta = e.metaKey;

      if (!isZ || !hasShift) return;
      if (e.altKey) return;
      if (!hasCtrl && !hasMeta) return;

      e.preventDefault();
      e.stopPropagation();
      requestAnimationFrame(() => dispatchCtrlShiftO(e));
    },
    true
  );
})();

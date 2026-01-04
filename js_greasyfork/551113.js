// ==UserScript==
// @name         ChatGPT Editing Message Enter→Send
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0.0
// @description  When pressing Enter while typing, click the visible "보내기" (or Send) button on chatgpt.com. Shift+Enter = newline.
// @author       zeronox
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://i.namu.wiki/i/9yf4h0kNu7QBf_SABY4CQJ8IFmv9Kby2YRVNQADCntaBn8kQyiAMcGNT9JgMcI2Ec2NCqTTIx6eg9TZK7h1NbQ.svg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551113/ChatGPT%20Editing%20Message%20Enter%E2%86%92Send.user.js
// @updateURL https://update.greasyfork.org/scripts/551113/ChatGPT%20Editing%20Message%20Enter%E2%86%92Send.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let composing = false;
  window.addEventListener('compositionstart', () => (composing = true), true);
  window.addEventListener('compositionend', () => (composing = false), true);

  function isTypingContext(el) {
    if (!el) return false;
    if (el.tagName === 'TEXTAREA') return true;
    if (
      el.tagName === 'INPUT' &&
      !['button', 'submit', 'checkbox', 'radio', 'file', 'color', 'range', 'reset'].includes(
        (el.type || '').toLowerCase()
      )
    )
      return true;
    if (el.isContentEditable) return true;
    if (el.getAttribute && el.getAttribute('role') === 'textbox') return true;
    return false;
  }

  function isVisible(el) {
    if (!el || el.disabled) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function findSendButton() {
    const quick = document.querySelector('button.btn.btn-primary, button[class*="btn-primary"]');
    if (quick) {
      const t = (quick.textContent || '').trim();
      const a = (quick.getAttribute('aria-label') || '').trim();
      if ((t && /보내기|send/i.test(t)) || (a && /보내기|send/i.test(a))) {
        if (isVisible(quick)) return quick;
      }
    }
    const candidates = document.querySelectorAll('button');
    for (const btn of candidates) {
      const text = (btn.textContent || '').trim();
      const aria = (btn.getAttribute('aria-label') || '').trim();
      if ((/보내기|send/i.test(text) || /보내기|send/i.test(aria)) && isVisible(btn)) {
        return btn;
      }
    }
    return null;
  }

  window.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Enter') return;
      if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.isComposing || composing) return;
      if (e.repeat) return;
      if (!isTypingContext(document.activeElement)) return;

      const sendBtn = findSendButton();
      if (!sendBtn) return;

      e.preventDefault();
      e.stopPropagation();
      requestAnimationFrame(() => sendBtn.click());
    },
    true
  );
})();

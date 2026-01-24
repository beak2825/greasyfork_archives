// ==UserScript==
// @name         AI Chat: Enter = Newline
// @namespace    https://mekineer.com
// @author       mekineer and Nova (ChatGPT 5.2 Thinking)
// @version      1.3.1
// @description  Forces Enter to insert a newline in chat composers; Ctrl/Cmd+Enter sends.
// @license      GPL-3.0-or-later
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @match        *://claude.ai/*
// @match        *://gemini.google.com/*
// @match        *://poe.com/*
// @match        *://www.perplexity.ai/*
// @match        *://grok.com/*
// @match        *://x.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563837/AI%20Chat%3A%20Enter%20%3D%20Newline.user.js
// @updateURL https://update.greasyfork.org/scripts/563837/AI%20Chat%3A%20Enter%20%3D%20Newline.meta.js
// ==/UserScript==

(() => {
  'use strict';

  function getComposerFrom(target) {
    if (!(target instanceof Element)) return null;

    // ChatGPT: textarea OR ProseMirror editor
    const byId = target.closest?.('#prompt-textarea');
    if (byId) return byId;

    const byName = target.closest?.('textarea[name="prompt-textarea"]');
    if (byName) return byName;

    const pm = target.closest?.('.ProseMirror[contenteditable="true"]');
    if (pm) return pm;

    // Generic: any textarea or textbox-like contenteditable
    const ta = target.closest?.('textarea');
    if (ta) return ta;

    const ce = target.closest?.('[contenteditable="true"], [role="textbox"]');
    if (ce) return ce;

    return null;
  }

  function insertNewline(el) {
    if (el instanceof HTMLTextAreaElement) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      el.setRangeText('\n', start, end, 'end');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    // ProseMirror / contenteditable: simulate Shift+Enter (line break)
    const evt = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      composed: true
    });
    el.dispatchEvent(evt);
  }

  function clickSendNear(el) {
    const form = el.closest?.('form') || document;
    const btn = form.querySelector?.(
      'button[data-testid="send-button"], button#composer-submit-button, button[type="submit"]'
    );
    if (btn && btn instanceof HTMLButtonElement && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  }

  // Extra safety: block submit triggered by Enter paths
  let blockSubmitOnce = false;
  document.addEventListener('submit', (e) => {
    if (!blockSubmitOnce) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    blockSubmitOnce = false;
  }, true);

  function onKeyDown(e) {
    if (e.key !== 'Enter') return;
    if (!e.isTrusted) return;
    if (e.isComposing || e.keyCode === 229) return;

    const composer = getComposerFrom(e.target) || getComposerFrom(document.activeElement);
    if (!composer) return;

    const wantsSend = e.ctrlKey || e.metaKey;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (wantsSend) {
      blockSubmitOnce = false;
      clickSendNear(composer);
    } else {
      blockSubmitOnce = true;
      insertNewline(composer);
      setTimeout(() => (blockSubmitOnce = false), 0);
    }
  }

  // IMPORTANT: window capture (beats most site handlers)
  window.addEventListener('keydown', onKeyDown, true);
})();

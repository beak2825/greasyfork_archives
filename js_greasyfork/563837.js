// ==UserScript==
// @name         AI Chat: Enter = Newline (Never Send)
// @namespace    https://mekineer.com
// @author       mekineer and Nova (GPT-5.2 Thinking)
// @version      1.2
// @description  Forces Enter to insert a newline in chat composers; Ctrl/Cmd+Enter sends.
// @license      GPL-3.0-or-later
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://gemini.google.com/*
// @match        *://poe.com/*
// @match        *://www.perplexity.ai/*
// @match        *://x.com/*
// @match        *://grok.com/*
// @match        *://*.openrouter.ai/*
// @match        *://*.mistral.ai/*
// @match        *://*.cohere.com/*
// @match        *://*.huggingface.co/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563837/AI%20Chat%3A%20Enter%20%3D%20Newline%20%28Never%20Send%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563837/AI%20Chat%3A%20Enter%20%3D%20Newline%20%28Never%20Send%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- helpers ----------
  function isProbablyChatComposer(el) {
    if (!el) return false;

    // Textareas are almost always safe to treat as composers.
    if (el.tagName === 'TEXTAREA') return true;

    // Some portals use contenteditable divs for the prompt box.
    const isCE = el.isContentEditable || el.getAttribute('contenteditable') === 'true';
    if (isCE) {
      const role = (el.getAttribute('role') || '').toLowerCase();
      if (role === 'textbox') return true;

      // Heuristic: contenteditable with "prompt/message" hints nearby.
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const ph = (el.getAttribute('data-placeholder') || '').toLowerCase();
      if (aria.includes('message') || aria.includes('prompt') || aria.includes('chat') ||
          ph.includes('message') || ph.includes('prompt')) return true;
    }

    return false;
  }

  function insertNewline(target) {
    // TEXTAREA: clean insertion with cursor preserved
    if (target && target.tagName === 'TEXTAREA') {
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? target.value.length;
      target.setRangeText('\n', start, end, 'end');
      target.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    // contenteditable: use execCommand as a pragmatic cross-site solution
    if (target && (target.isContentEditable || target.getAttribute('contenteditable') === 'true')) {
      // Insert a line break at caret position
      document.execCommand('insertLineBreak');
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function findSendButtonNear(target) {
    // Walk up a bit and look for a likely send button
    let root = target;
    for (let i = 0; i < 6 && root; i++) root = root.parentElement;

    const scope = root || document;

    // Common patterns across portals
    const candidates = scope.querySelectorAll(
      [
        'button[type="submit"]',
        'button[aria-label*="Send" i]',
        'button[aria-label*="send" i]',
        'button[data-testid*="send" i]',
        'button[class*="send" i]',
        'button[title*="Send" i]'
      ].join(',')
    );

    // Prefer enabled, visible buttons
    for (const btn of candidates) {
      const style = window.getComputedStyle(btn);
      const visible = style && style.display !== 'none' && style.visibility !== 'hidden' && btn.offsetParent !== null;
      if (!btn.disabled && visible) return btn;
    }
    return null;
  }

  // ---------- key handler ----------
  function onKeyDown(e) {
    // Ignore IME composition (Japanese/Chinese input etc.)
    if (e.isComposing || e.keyCode === 229) return;

    const t = e.target;

    // Only affect chat composer-ish inputs
    if (!isProbablyChatComposer(t)) return;

    // Ctrl/Cmd+Enter => try to send
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      const btn = findSendButtonNear(t);
      if (btn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        btn.click();
      }
      return;
    }

    // Plain Enter => newline (never send)
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      e.stopImmediatePropagation();
      insertNewline(t);
    }
  }

  // Capture phase so we beat site handlers that send on Enter
  window.addEventListener('keydown', onKeyDown, true);
})();

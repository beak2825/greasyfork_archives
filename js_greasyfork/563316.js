// ==UserScript==
// @name         ChatGPT: Preserve Line Breaks on Paste
// @author       mekineer and Nova (ChatGPT 5.2 Thinking)
// @namespace    https://mekineer.com
// @license      GPL-3.0-or-later
// @version      1.1.0
// @description  Auto-wrap multiline paste in Markdown code fences so line breaks display correctly after sending.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563316/ChatGPT%3A%20Preserve%20Line%20Breaks%20on%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/563316/ChatGPT%3A%20Preserve%20Line%20Breaks%20on%20Paste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getBox() {
    return document.querySelector('#prompt-textarea');
  }

  // Pick a backtick fence long enough to contain any backticks in the pasted text.
  // CommonMark: closing fence must be >= opening fence length. :contentReference[oaicite:2]{index=2}
  function pickFence(pasted) {
    const runs = pasted.match(/`+/g) || [];
    const maxRun = runs.reduce((m, r) => Math.max(m, r.length), 0);
    const fenceLen = Math.max(3, maxRun + 1);
    return '`'.repeat(fenceLen);
  }

  // Detect whether cursor is inside an existing fenced code block.
  function isInsideFence(fullText, cursorPos) {
    const before = fullText.slice(0, cursorPos);
    const lines = before.split(/\r?\n/);

    let open = null; // { ch: '`'|'~', len: number }

    for (const line of lines) {
      const m = line.match(/^\s{0,3}([`~]{3,})/);
      if (!m) continue;

      const seq = m[1];
      const ch = seq[0];
      const len = seq.length;

      if (!open) {
        open = { ch, len };
      } else if (open.ch === ch && len >= open.len) {
        open = null; // closes the fence
      }
    }
    return !!open;
  }

  function wrapIfMultiline(pasted) {
    if (!pasted.includes('\n')) return pasted; // single-line: leave alone

    const fence = pickFence(pasted);

    // Preserve paste exactly, but ensure there’s a newline before the closing fence.
    let body = pasted;
    if (!body.endsWith('\n')) body += '\n';

    return `${fence}\n${body}${fence}`;
  }

  function insertAtSelection(box, text) {
    const start = box.selectionStart ?? box.value.length;
    const end = box.selectionEnd ?? box.value.length;

    box.setRangeText(text, start, end, 'end'); // replace selection, caret to end
    box.dispatchEvent(new Event('input', { bubbles: true })); // React/ChatGPT notices change
  }

  function install(box) {
    if (box.__preserveLineBreaksInstalled) return;
    box.__preserveLineBreaksInstalled = true;

    box.addEventListener('paste', (e) => {
      const pasted = e.clipboardData?.getData('text/plain');
      if (!pasted) return;

      // If inside an existing fenced block, don’t fence again.
      const inside = isInsideFence(box.value, box.selectionStart ?? 0);

      // Only intervene for multiline pastes (or if inside-fence logic says “leave it alone”).
      if (!pasted.includes('\n') || inside) return;

      e.preventDefault();

      const wrapped = wrapIfMultiline(pasted);
      box.focus();
      insertAtSelection(box, wrapped);
    });
  }

  // SPA-safe: poll until the box exists.
  const timer = setInterval(() => {
    const box = getBox();
    if (box) {
      clearInterval(timer);
      install(box);
    }
  }, 300);
})();

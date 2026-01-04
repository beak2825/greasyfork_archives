// ==UserScript==
// @name         Lark 3-in-1: Export Transcripts + Unwatermark + Copy-Unblock
// @namespace    https://example.com
// @version      1.0.2
// @description  Export full meeting transcripts, remove watermarks, and prevent copy/select blocking on Lark/Feishu.
// @match        https://*.larksuite.com/*
// @match        https://*.feishu.cn/*
// @match        https://*.larkoffice.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549426/Lark%203-in-1%3A%20Export%20Transcripts%20%2B%20Unwatermark%20%2B%20Copy-Unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/549426/Lark%203-in-1%3A%20Export%20Transcripts%20%2B%20Unwatermark%20%2B%20Copy-Unblock.meta.js
// ==/UserScript==

/* -------------------------------------------
   Minimal utilities
-------------------------------------------- */
(function () {
  'use strict';

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // GM_addStyle polyfill (for Greasemonkey v4+ / environments without it)
  if (typeof GM_addStyle === 'undefined') {
    // eslint-disable-next-line no-implicit-globals
    this.GM_addStyle = (css) => {
      const head = document.head || document.getElementsByTagName('head')[0];
      if (!head) return null;
      const style = document.createElement('style');
      style.type = 'text/css';
      style.textContent = css;
      head.appendChild(style);
      return style;
    };
  }

  /* -------------------------------------------
     (A) Copy/Select Unblocker (document-start)
  -------------------------------------------- */
  (function enableCopyEverywhere() {
    const immune = new Set(['copy', 'cut', 'contextmenu', 'selectstart']);
    const realPrevent = Event.prototype.preventDefault;

    // Patch preventDefault so "copy-ish" events cannot be blocked.
    Event.prototype.preventDefault = function patchedPreventDefault() {
      if (immune.has(this.type)) return;
      return realPrevent.call(this);
    };

    // CSS antidote for user-select
    GM_addStyle(`*{user-select:text!important;-webkit-user-select:text!important}`);
  })();

  /* -------------------------------------------
     (B) Watermark Removal (document-start)
     (Based on lbb00's public utility, folded in)
  -------------------------------------------- */
  (function removeWatermarks() {
    const bgImageNone = '{background-image: none !important;}';
    const genStyle = (selector) => `${selector}${bgImageNone}`;

    // Global
    GM_addStyle(genStyle('[class*="watermark"]'));
    GM_addStyle(genStyle('[style*="pointer-events: none"]'));

    // Docs
    GM_addStyle(genStyle('.ssrWaterMark'));
    GM_addStyle(genStyle('body>div>div>div>div[style*="position: fixed"]:not(:has(*))'));
    // Firefox doesn't support :has()
    GM_addStyle(genStyle('[class*="TIAWBFTROSIDWYKTTIAW"]'));

    // Readonly fix
    GM_addStyle(genStyle('body>div[style*="position: fixed"]:not(:has(*))'));

    // Workbench
    GM_addStyle(genStyle('#watermark-cache-container'));
    GM_addStyle(genStyle('body>div[style*="inset: 0px;"]:not(:has(*))'));

    // Web Chat
    GM_addStyle(genStyle('.chatMessages>div[style*="inset: 0px;"]'));
  })();

  /* -------------------------------------------
     (C) Export Full Meeting Transcripts (onReady)
  -------------------------------------------- */
  onReady(() => {
    // Selectors (kept from original)
    const PARAGRAPH_SELECTOR = '.paragraph-editor-wrapper';
    const SPEAKER_SELECTOR = '.p-user-name';
    const TIME_SELECTOR = '.p-time';
    const TEXT_LINE_SELECTOR = '.ace-line';
    const VLIST_CONTAINER_SELECTOR = '.rc-virtual-list-holder';

    // UI: export button
    const btn = document.createElement('button');
    btn.textContent = 'Export Full Transcripts';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 99999,
      padding: '6px 12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      font: '12px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial',
      boxShadow: '0 2px 6px rgba(0,0,0,.15)'
    });
    document.body.appendChild(btn);

    const seen = new Set();

    const extractParagraphData = (paragraph) => {
      const key = paragraph.getAttribute('data-zone-id') || paragraph.dataset.__exportSeenKey;
      if (key && seen.has(key)) return null;

      // If no data-zone-id, synthesize a stable-ish key once.
      if (!paragraph.getAttribute('data-zone-id') && !paragraph.dataset.__exportSeenKey) {
        paragraph.dataset.__exportSeenKey = `seen:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
      }
      const finalKey = paragraph.getAttribute('data-zone-id') || paragraph.dataset.__exportSeenKey;
      if (finalKey) seen.add(finalKey);

      const speakerEl = paragraph.querySelector(SPEAKER_SELECTOR);
      const timeEl = paragraph.querySelector(TIME_SELECTOR);
      const textEls = paragraph.querySelectorAll(TEXT_LINE_SELECTOR);

      const speaker =
        (speakerEl && (speakerEl.getAttribute('user-name-content') || speakerEl.textContent.trim())) || '';
      const time =
        (timeEl && (timeEl.getAttribute('time-content') || timeEl.textContent.trim())) || '';

      let text = '';
      textEls.forEach((line) => (text += (line.innerText || '').trim() + ' '));

      return { speaker, time, text: text.trim() };
    };

    const downloadJSON = (filename, obj) => {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    const scrollAndCollect = async () => {
      const container = document.querySelector(VLIST_CONTAINER_SELECTOR);
      if (!container) {
        alert('Transcript container not found.');
        return [];
      }

      const results = [];
      let previousScrollTop = -1;

      while (true) {
        const paragraphs = document.querySelectorAll(PARAGRAPH_SELECTOR);
        for (const p of paragraphs) {
          const data = extractParagraphData(p);
          if (data) results.push(data);
        }

        container.scrollTop += 500;
        await sleep(300); // wait for virtualized content to render

        if (container.scrollTop === previousScrollTop) break; // reached bottom
        previousScrollTop = container.scrollTop;
      }

      return results;
    };

    btn.addEventListener('click', async () => {
      const original = btn.textContent;
      btn.textContent = 'Exporting...';
      btn.disabled = true;

      try {
        const results = await scrollAndCollect();
        downloadJSON('full_transcript.json', results);
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  });
})();

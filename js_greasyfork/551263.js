// ==UserScript==
// @name         YouTube Live Chat: Waiting Room + Clean Overlay
// @namespace    yt-livechat-autohide
// @version      3.1
// @description  Filter spam in a small "waiting room" chat and show a clean, throttled overlay of approved messages
// @match        *://*.youtube.com/*
// @match        *://youtu.be/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551263/YouTube%20Live%20Chat%3A%20Waiting%20Room%20%2B%20Clean%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/551263/YouTube%20Live%20Chat%3A%20Waiting%20Room%20%2B%20Clean%20Overlay.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- FILTER CONFIG ----------
  const KEYWORD_PATTERNS = [
    /\bfree\s*palestine\b/i,
    /\bsave\s*gaza\b/i,
    /\bshare\b/i,
    /\bwatching\b/i,
    /\ballahim\b/i,
    /\beyes\b/i,
    /\bspam\b/i,
    /\ballah\b/i,
    /\bgod\b/i,
    /\bjesus\b/i,
    /\bbible\b/i,
    /\bpalestina\b/i,
    /\bpalestine\b/i,
    /\bspamming\b/i,
    /\bfree\b/i,
    /face-/i // catch emoji labels like face-red-heart-shape
  ];
  const ARABIC_SCRIPT = /\p{Script=Arabic}/u;                 // any Arabic-script char
  const ANY_FLAG_PAIR = /[\u{1F1E6}-\u{1F1FF}]{2,}/u;         // any flag (regional indicator pair)
  const EMOJI_ONLY = /^[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}\s]+$/u; // emoji-only

  // ---------- UI CONFIG ----------
  const OVERLAY_WIDTH_PX = 360;
  const OVERLAY_MAX_LINES = 30;       // keep last N lines
  const OVERLAY_FLUSH_MS = 1000;      // batch every 1s
  const WAITING_ROOM_HEIGHT_PX = 120; // native chat strip height
  const COLLAPSE_INSTEAD_OF_REMOVE = true;
  const HIDE_PAID_AND_MEMBERSHIP = true;

  // ---------- STATE ----------
  let enabled = true;
  let overlayEnabled = true;
  let waitingRoomEnabled = true;

  let overlayBox = null;
  let overlayList = null;
  let allowedBuffer = [];
  let overlayFlushTimer = null;
  let manualOffset = 0;

  // ---------- HELPERS ----------
  function isLiveChatDoc() {
    return location.pathname.startsWith('/live_chat');
  }

  function extractMessageText(el) {
    let text = (el?.innerText || el?.textContent || '').trim();

    // Include emoji alt/labels
    const imgs = el.querySelectorAll('img');
    for (const img of imgs) {
      const alt = (img.getAttribute('alt') || img.getAttribute('aria-label') || '').trim();
      if (alt) text += ' ' + alt;
    }
    const spans = el.querySelectorAll('[aria-label]');
    for (const sp of spans) {
      const al = sp.getAttribute('aria-label');
      if (al && al.length <= 24) text += ' ' + al;
    }
    return text;
  }

  function extractAuthor(el) {
    const a = el.querySelector('#author-name') || el.querySelector('#timestamp ~ #author-name');
    return (a?.innerText || a?.textContent || '').trim();
  }

  function shouldHideFromText(text) {
    if (!text) return false;
    if (text.length > 2 && EMOJI_ONLY.test(text)) return true; // emoji-only floods
    if (ANY_FLAG_PAIR.test(text)) return true;                  // any flag cluster
    if (ARABIC_SCRIPT.test(text)) return true;                  // Arabic script
    for (const r of KEYWORD_PATTERNS) if (r.test(text)) return true; // keywords
    return false;
  }

  function hideNode(node) {
    if (node.getAttribute('data-ylc-hidden') === '1') return;
    if (COLLAPSE_INSTEAD_OF_REMOVE) {
      node.style.opacity = '0.2';
      node.style.filter = 'grayscale(1)';
      node.style.maxHeight = '0px';
      node.style.margin = '0';
      node.style.padding = '0';
      node.style.border = '0';
      node.style.overflow = 'hidden';
    } else {
      node.remove();
    }
    node.setAttribute('data-ylc-hidden', '1');
  }

  // ---------- OVERLAY POSITION ----------
  function computeOverlayBottom() {
    const selectors = [
      'yt-live-chat-message-input-renderer',
      'yt-live-chat-app #input',
      '#input.yt-live-chat-renderer',
      '#panel-pages #input'
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width && r.height) {
          const margin = 12;
          return Math.max(8, window.innerHeight - r.top + margin + manualOffset);
        }
      }
    }
    return 8 + manualOffset; // fallback
  }

  // ---------- OVERLAY UI ----------
  function ensureOverlay() {
    if (overlayBox) return;

    const style = document.createElement('style');
    style.textContent = `
      .ylc-overlay {
        position: fixed;
        right: 8px;
        bottom: 8px; /* updated dynamically */
        width: ${OVERLAY_WIDTH_PX}px;
        max-height: 65vh;
        background: rgba(0,0,0,0.82);
        color: #fff;
        font: 12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        border-radius: 10px;
        padding: 8px 8px 6px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        z-index: 2147483647;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 6px;
        pointer-events: none;
      }
      .ylc-header { font-weight: 600; font-size: 11px; letter-spacing: .5px; opacity: .7; }
      .ylc-list { overflow: hidden; display: flex; flex-direction: column; gap: 4px; }
      .ylc-line {
        opacity: 0;
        transform: translateY(6px);
        transition: opacity .16s ease-out, transform .16s ease-out;
        word-break: break-word; white-space: normal;
      }
      .ylc-line.show { opacity: 1; transform: translateY(0); }
      .ylc-author { color: #9ad0ff; margin-right: 6px; }
      .ylc-text { color: #fff; }
      .ylc-waiting-room {
        max-height: ${WAITING_ROOM_HEIGHT_PX}px !important;
        height: ${WAITING_ROOM_HEIGHT_PX}px !important;
        overflow: hidden !important;
        mask-image: linear-gradient(180deg, rgba(0,0,0,.9) 70%, rgba(0,0,0,0) 100%);
        -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.9) 70%, rgba(0,0,0,0) 100%);
      }
    `;
    document.documentElement.appendChild(style);

    overlayBox = document.createElement('div');
    overlayBox.className = 'ylc-overlay';

    const header = document.createElement('div');
    header.className = 'ylc-header';
    header.textContent = 'Clean chat (batched)';

    overlayList = document.createElement('div');
    overlayList.className = 'ylc-list';

    overlayBox.appendChild(header);
    overlayBox.appendChild(overlayList);
    document.documentElement.appendChild(overlayBox);

    overlayBox.style.bottom = computeOverlayBottom() + 'px';
    overlayBox.style.display = overlayEnabled ? 'flex' : 'none';

    const reflow = () => {
      if (overlayBox) overlayBox.style.bottom = computeOverlayBottom() + 'px';
    };
    window.addEventListener('resize', reflow, { passive: true });
    window.addEventListener('scroll', reflow, { passive: true });
    const ro = new MutationObserver(reflow);
    ro.observe(document.documentElement, { childList: true, subtree: true });
    overlayBox.__ylcReflowObs = ro;

    if (!overlayFlushTimer) overlayFlushTimer = setInterval(flushOverlay, OVERLAY_FLUSH_MS);
  }

  function pushAllowedToOverlay(author, text) {
    if (!overlayEnabled) return;
    allowedBuffer.push({ author, text });
  }

  function flushOverlay() {
    if (!overlayEnabled || allowedBuffer.length === 0 || !overlayList) return;

    const batch = allowedBuffer.splice(0, allowedBuffer.length);
    for (const { author, text } of batch) {
      const line = document.createElement('div');
      line.className = 'ylc-line';
      const a = document.createElement('span');
      a.className = 'ylc-author';
      a.textContent = author ? `${author}:` : '';
      const t = document.createElement('span');
      t.className = 'ylc-text';
      t.textContent = text;
      line.appendChild(a);
      line.appendChild(t);
      overlayList.appendChild(line);

      while (overlayList.childNodes.length > OVERLAY_MAX_LINES) {
        overlayList.removeChild(overlayList.firstChild);
      }
      requestAnimationFrame(() => line.classList.add('show'));
    }
  }

  // ---------- WAITING ROOM ----------
  function applyWaitingRoom(container) {
    if (!waitingRoomEnabled || !container) return;
    const scroller =
      container.querySelector('#item-scroller') ||
      container.querySelector('#items') ||
      container;
    scroller.classList.add('ylc-waiting-room');
  }

  // ---------- PIPELINE ----------
  function processMessageEl(el) {
    if (!el || el.getAttribute('data-ylc-scan') === '1') return;
    el.setAttribute('data-ylc-scan', '1');

    const msgEl = el.querySelector('#message') || el.querySelector('#content') || el;
    const text = extractMessageText(msgEl);
    const author = extractAuthor(el);

    if (shouldHideFromText(text)) {
      hideNode(el); // filtered in waiting room
      return;
    }
    // Passed: keep in waiting room and mirror to overlay (batched)
    pushAllowedToOverlay(author, text);
  }

  function scanOnce(root = document) {
    root.querySelectorAll('yt-live-chat-text-message-renderer:not([data-ylc-scan])')
      .forEach(processMessageEl);

    if (HIDE_PAID_AND_MEMBERSHIP) {
      root.querySelectorAll('yt-live-chat-paid-message-renderer:not([data-ylc-scan]), yt-live-chat-paid-sticker-renderer:not([data-ylc-scan]), yt-live-chat-membership-item-renderer:not([data-ylc-scan])')
        .forEach(processMessageEl);
    }
  }

  function observeChatDoc() {
    const container =
      document.querySelector('#items') ||
      document.querySelector('#chat #items') ||
      document.querySelector('yt-live-chat-app #contents') ||
      document.querySelector('yt-live-chat-app') ||
      document.body;

    if (!container) return;

    applyWaitingRoom(container);
    ensureOverlay();

    if (container.__ylcObserver) return;
    const obs = new MutationObserver(muts => {
      if (!enabled) return;
      for (const m of muts) {
        m.addedNodes && m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches?.('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-paid-sticker-renderer, yt-live-chat-membership-item-renderer')) {
            processMessageEl(node);
          } else {
            scanOnce(node);
          }
        });
      }
    });
    obs.observe(container, { childList: true, subtree: true });
    container.__ylcObserver = obs;

    scanOnce(container);
  }

  // ---------- MENU ----------
  function registerMenu() {
    try {
      GM_registerMenuCommand(`Toggle filter (now ${enabled ? 'ON' : 'OFF'})`, () => {
        enabled = !enabled;
        alert(`Filter ${enabled ? 'ON' : 'OFF'}`);
      });
      GM_registerMenuCommand(`Toggle overlay (now ${overlayEnabled ? 'ON' : 'OFF'})`, () => {
        overlayEnabled = !overlayEnabled;
        if (overlayBox) overlayBox.style.display = overlayEnabled ? 'flex' : 'none';
      });
      GM_registerMenuCommand(`Toggle waiting room (now ${waitingRoomEnabled ? 'ON' : 'OFF'})`, () => {
        waitingRoomEnabled = !waitingRoomEnabled;
        const wr = document.querySelector('.ylc-waiting-room');
        if (wr) {
          if (waitingRoomEnabled) {
            wr.style.maxHeight = `${WAITING_ROOM_HEIGHT_PX}px`;
            wr.style.height = `${WAITING_ROOM_HEIGHT_PX}px`;
            wr.style.overflow = 'hidden';
          } else {
            wr.style.maxHeight = '';
            wr.style.height = '';
            wr.style.overflow = '';
          }
        }
      });
      GM_registerMenuCommand('Nudge overlay up (+12px)', () => {
        manualOffset += 12;
        if (overlayBox) overlayBox.style.bottom = computeOverlayBottom() + 'px';
      });
      GM_registerMenuCommand('Nudge overlay down (-12px)', () => {
        manualOffset = Math.max(0, manualOffset - 12);
        if (overlayBox) overlayBox.style.bottom = computeOverlayBottom() + 'px';
      });
    } catch {}
  }

  // ---------- BOOT ----------
  function main() {
    registerMenu();
    if (isLiveChatDoc()) observeChatDoc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main, { once: true });
  } else {
    main();
  }
})();

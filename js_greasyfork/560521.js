// ==UserScript==
// @name         Trump Fatigue Syndrome
// @namespace    https://greasyfork.org/en/users/yourname
// @version      1.0.1
// @description  YouTube-only background filter: hides video tiles whose title/channel/metadata match blocked keywords (default: trump, maga).
// @author       You
// @match        https://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560521/Trump%20Fatigue%20Syndrome.user.js
// @updateURL https://update.greasyfork.org/scripts/560521/Trump%20Fatigue%20Syndrome.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /**********************
   * CONFIG
   **********************/
  // Keywords are case-insensitive. Add/remove as you like.
  const BLOCKED_KEYWORDS = [
    'trump',
    'maga',
  ];

  // true  => match anywhere in text (more aggressive; recommended)
  // false => word-ish matches (less aggressive)
  const SUBSTRING_MATCH = true;

  // Hide strategy:
  // - 'hide'      => display:none (fast, no gaps)
  // - 'collapse'  => keep tiny placeholder height (rarely useful)
  const HIDE_MODE = 'hide';

  /**********************
   * Build matcher
   **********************/
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const escaped = BLOCKED_KEYWORDS
    .map(k => k.trim())
    .filter(Boolean)
    .map(escapeRegex);

  const keywordRegex = escaped.length
    ? (SUBSTRING_MATCH
        ? new RegExp(`(${escaped.join('|')})`, 'i')
        : new RegExp(`\\b(${escaped.join('|')})\\b`, 'i'))
    : null;

  function matches(text) {
    if (!keywordRegex) return false;
    if (!text) return false;
    return keywordRegex.test(text);
  }

  /**********************
   * YouTube selectors
   **********************/
  // These cover most surfaces: Home, Search, Subs, Channel, Sidebar, Playlists
  const VIDEO_TILE_SELECTORS = [
    'ytd-rich-item-renderer',      // home feed tiles
    'ytd-video-renderer',          // search results / lists
    'ytd-grid-video-renderer',     // channel grid
    'ytd-compact-video-renderer',  // sidebar suggestions
    'ytd-playlist-video-renderer', // playlist entries
  ].join(',');

  function extractTextFromTile(tile) {
    const title =
      tile.querySelector('#video-title')?.textContent ||
      tile.querySelector('a#video-title-link')?.textContent ||
      '';

    const channel =
      tile.querySelector('#channel-name')?.textContent ||
      tile.querySelector('ytd-channel-name')?.textContent ||
      '';

    const meta =
      tile.querySelector('#metadata')?.textContent ||
      tile.querySelector('#meta')?.textContent ||
      '';

    return `${title} ${channel} ${meta}`.replace(/\s+/g, ' ').trim();
  }

  function hideTile(tile) {
    if (tile.getAttribute('data-tfs-hidden') === '1') return;

    if (HIDE_MODE === 'collapse') {
      tile.style.maxHeight = '0px';
      tile.style.overflow = 'hidden';
      tile.style.margin = '0';
      tile.style.padding = '0';
    } else {
      tile.style.display = 'none';
    }

    tile.setAttribute('data-tfs-hidden', '1');
  }

  function scan(root = document) {
    const tiles = root.querySelectorAll(VIDEO_TILE_SELECTORS);
    tiles.forEach(tile => {
      if (tile.getAttribute('data-tfs-checked') === '1') return;
      tile.setAttribute('data-tfs-checked', '1');

      const text = extractTextFromTile(tile);
      if (matches(text)) hideTile(tile);
    });
  }

  /**********************
   * Dynamic loading support
   **********************/
  let scanQueued = false;
  function queueFullScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(() => {
      scanQueued = false;
      scan(document);
    });
  }

  function startObserver() {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (!m.addedNodes || m.addedNodes.length === 0) continue;

        // Scan added nodes for speed
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          scan(node);
        });

        // Also queue a full scan in case YouTube reshuffled tiles
        queueFullScan();
        break;
      }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  /**********************
   * Handle YouTube SPA navigation
   **********************/
  function resetCheckedFlags() {
    document
      .querySelectorAll('[data-tfs-checked="1"]')
      .forEach(el => el.removeAttribute('data-tfs-checked'));
  }

  let lastUrl = location.href;
  function startUrlWatcher() {
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        resetCheckedFlags();
        queueFullScan();
      }
    }, 700);
  }

  /**********************
   * Boot
   **********************/
  queueFullScan();
  startObserver();
  startUrlWatcher();
})();

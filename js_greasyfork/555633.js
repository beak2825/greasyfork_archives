// ==UserScript==
// @name         Google Photos – Show Albums on Hover
// @namespace    https://buymeacoffee.com/sircluckingtonx
// @version      2.8
// @description  Displays album names when hovering over photos in Google Photos. Requires Google Photos Toolkit (GPTK). Optionally keeps red "(not in any albums)" labels visible after hover (configurable in script).
// @author       SirCluckingtonX
// @license      MIT
// @homepageURL  https://buymeacoffee.com/sircluckingtonx
// @supportURL   https://buymeacoffee.com/sircluckingtonx
// @match        https://photos.google.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555633/Google%20Photos%20%E2%80%93%20Show%20Albums%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/555633/Google%20Photos%20%E2%80%93%20Show%20Albums%20on%20Hover.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /*
   * =============================================================
   *  Google Photos – Show Albums on Hover
   *  Author: SirCluckingtonX
   *  License: MIT
   *
   *  ⚠️  Prerequisite:
   *  This script requires Google Photos Toolkit (GPTK)
   *  → https://github.com/xob0t/Google-Photos-Toolkit
   * =============================================================
   */

  /* ===== Configuration ===== */
  // Set this to true if you want "(not in any albums)" red labels
  // to stay visible after hover (default: false).
  const PERSIST_NOT_IN_ALBUMS = false;

  // How long (in ms) album info stays cached before refreshing.
  const CACHE_TTL = 60000;

  /* ===== Wait for GPTK API ===== */
  let tries = 0;
  while (!window.gptkApi && tries < 40) {
    await new Promise(r => setTimeout(r, 300));
    tries++;
  }
  if (!window.gptkApi) {
    console.warn('[GP-Albums] GPTK API not found — this script requires Google Photos Toolkit. Get it here: https://github.com/xob0t/Google-Photos-Toolkit');
    return;
  }

  /* ===== CSS ===== */
  const style = document.createElement('style');
  style.textContent = `
    .gpalb-label {
      position: absolute;
      left: 2px;
      bottom: 8px;
      padding: 5px 8px;
      background: rgba(20,20,20,0.82);
      color: #fff;
      font-size: 11px;
      border-radius: 4px;
      line-height: 1.25;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity .15s ease, transform .15s ease, max-height .25s ease, padding .15s ease, background .25s ease;
      white-space: normal;
      z-index: 2147483647;
      width: calc(100% - 6px);
      max-height: 40%;
      overflow-y: hidden;
      overflow-x: hidden;
    }
    .gpalb-label--show { opacity: 1; transform: translateY(0); }
    .gpalb-label--none { background: rgba(120, 0, 0, 0.85); }
    .gpalb-label .album-line {
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
      transition: all .15s ease;
    }
    .gpalb-label:hover {
      max-height: 60%;
      padding: 6px 9px;
      overflow-y: auto;
    }
    .gpalb-label:hover .album-line {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      word-break: break-word;
    }
    .gpalb-label::-webkit-scrollbar { width: 6px; }
    .gpalb-label::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.25);
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);

  /* ===== Cache & Banner Watcher ===== */
  const cache = new Map();

  const clearAlbumCache = () => {
    cache.clear();
    console.log('[GP-Albums] Album cache cleared after banner detected');
  };

  const bannerKeywords = [
    /item added to album/i,
    /items added to album/i,
    /new item added/i
  ];
  const bannerObserver = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        const txt = node.textContent?.trim() || '';
        if (bannerKeywords.some(r => r.test(txt))) {
          clearAlbumCache();
          return;
        }
      }
    }
  });
  bannerObserver.observe(document.body, { childList: true, subtree: true });

  /* ===== Helpers ===== */
  const getTile = el => el?.classList?.contains('RY3tic') ? el : el?.closest('.RY3tic');
  const extractMediaKey = tileEl => {
    const href = tileEl?.closest('a[href*="/photo/"]')?.getAttribute('href') || '';
    const m = href.match(/\/photo\/([A-Za-z0-9_-]+)/);
    if (m) return m[1];
    const bg = tileEl?.style?.backgroundImage || '';
    const n = bg.match(/(AF1Qip|AP1Gcz)[A-Za-z0-9_-]+/);
    return n ? n[0] : null;
  };

  async function resolveAlbums(mediaKey, forceRefresh = false) {
    if (!mediaKey) return [];
    const now = Date.now();
    const cached = cache.get(mediaKey);
    if (!forceRefresh && cached && now - cached.time < CACHE_TTL) return cached.names;
    try {
      const info = await gptkApi.getItemInfoExt(mediaKey);
      const albums = info?.albums || info?.albumInfos || info?.collections || info?.containers || [];
      const names = Array.isArray(albums)
        ? albums.map(a => a?.title || a?.name || a?.displayName || '').filter(Boolean)
        : [];
      cache.set(mediaKey, { names, time: now });
      return names;
    } catch (e) {
      console.warn('[GP-Albums] getItemInfoExt failed', e);
      cache.set(mediaKey, { names: [], time: now });
      return [];
    }
  }

  function ensureLabel(tile) {
    let label = tile.querySelector('.gpalb-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'gpalb-label';
      tile.appendChild(label);
    }
    return label;
  }

  async function showFor(el, evt) {
    const tile = getTile(el);
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const localX = evt?.clientX - rect.left;
    const localY = evt?.clientY - rect.top;
    if (localX < 40 && localY < 40) return; // ignore checkbox corner

    const label = ensureLabel(tile);
    label.classList.remove('gpalb-label--none');
    label.innerHTML = '<span class="album-line">Checking albums…</span>';
    label.classList.add('gpalb-label--show');

    const key = extractMediaKey(tile);
    if (!key) { label.classList.remove('gpalb-label--show'); return; }

    const names = await resolveAlbums(key);
    if (!names.length) {
      label.classList.add('gpalb-label--none');
      label.innerHTML = '<span class="album-line">(not in any albums)</span>';
      if (!PERSIST_NOT_IN_ALBUMS) {
        setTimeout(() => {
          if (!tile.matches(':hover')) label.classList.remove('gpalb-label--show');
        }, 2000);
      }
    } else {
      label.classList.remove('gpalb-label--none');
      label.innerHTML = names.map(n => `<span class="album-line" title="${n}">${n}</span>`).join('');
    }
  }

  function hideFor(el) {
    const tile = getTile(el);
    if (!tile) return;
    const label = tile.querySelector('.gpalb-label');
    if (!label) return;
    if (PERSIST_NOT_IN_ALBUMS && label.classList.contains('gpalb-label--none')) return;
    setTimeout(() => {
      if (!tile.matches(':hover')) label.classList.remove('gpalb-label--show');
    }, 100);
  }

  function attach(tile) {
    if (!tile || tile.dataset.gpalbAttached) return;
    tile.dataset.gpalbAttached = '1';
    tile.addEventListener('mouseenter', e => showFor(tile, e));
    tile.addEventListener('mouseleave', () => hideFor(tile));
  }

  function scan() {
    document.querySelectorAll('.RY3tic').forEach(attach);
  }

  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  setInterval(scan, 1500);
})();

/*
MIT License

Copyright (c) 2025 SirCluckingtonX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

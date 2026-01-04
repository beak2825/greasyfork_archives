// ==UserScript==
// @name         Google Photos – Show Filename on Hover
// @namespace    https://buymeacoffee.com/sircluckingtonx
// @version      3.0
// @description  Displays filenames when hovering over photos in Google Photos.
// @author       SirCluckingtonX
// @license      MIT
// @homepageURL  https://buymeacoffee.com/sircluckingtonx
// @supportURL   https://buymeacoffee.com/sircluckingtonx
// @match        https://photos.google.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555635/Google%20Photos%20%E2%80%93%20Show%20Filename%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/555635/Google%20Photos%20%E2%80%93%20Show%20Filename%20on%20Hover.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /*
   * =============================================================
   *  Google Photos – Show Filename on Hover
   *  Author: SirCluckingtonX
   *  License: MIT
   *
   *  ⚙️  Prerequisite:
   *  Requires Google Photos Toolkit (GPTK)
   *  → https://github.com/xob0t/Google-Photos-Toolkit
   * =============================================================
   */

  /* ===== Wait for GPTK API ===== */
  let tries = 0;
  while (!window.gptkApi && tries < 30) {
    await new Promise(r => setTimeout(r, 300));
    tries++;
  }
  const hasApi = !!window.gptkApi;
  if (!hasApi)
    console.warn('[GP-Filename] GPTK API not found — filenames may remain "(unknown)". Install Google Photos Toolkit: https://github.com/xob0t/Google-Photos-Toolkit');

  /* ===== Styles ===== */
  const style = document.createElement('style');
  style.textContent = `
    .gpfn-label {
      position: absolute;
      left: 32px;
      top: 10px;
      padding: 3px 8px;
      background: rgba(20,20,20,0.72);
      color: #fff;
      font-size: 11px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(-4px);
      transition: opacity .15s ease, transform .15s ease, max-width .2s ease;
      max-width: calc(100% - 56px);
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 100000;
    }
    .gpfn-label--show {
      opacity: 1;
      transform: translateY(0);
    }
    .gpfn-label:hover {
      white-space: normal;
      word-break: break-all;
      background: rgba(20,20,20,0.9);
      max-width: 90%;
    }
    .gpfn-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 99999;
    }
  `;
  document.head.appendChild(style);

  const cache = new Map();

  /* ===== Helpers ===== */
  function getTile(el) {
    if (!el) return null;
    if (el.classList?.contains('RY3tic')) return el;
    const p = el.parentElement;
    return p?.querySelector('.RY3tic') || el.closest('.RY3tic');
  }

  function extractMediaKeyFromAnchor(tileEl) {
    const a = tileEl?.closest('a[href*="/photo/"]') || tileEl?.parentElement?.querySelector('a[href*="/photo/"]');
    const m = a?.getAttribute('href')?.match(/\/photo\/([A-Za-z0-9_\-]+)/);
    return m ? m[1] : null;
  }

  function extractAnyKeyFromStyle(tileEl) {
    const bg = tileEl?.style?.backgroundImage || '';
    const m = bg.match(/(AF1Qip|AP1Gcz)[A-Za-z0-9_\-]+/);
    return m ? m[0] : null;
  }

  async function resolveFilename(key) {
    if (!key) return '(unknown)';
    if (cache.has(key)) return cache.get(key);
    if (!hasApi) return '(unknown)';
    try {
      const info = await window.gptkApi.getItemInfoExt(key);
      const fn = info?.fileName || info?.filename || info?.originalFilename || '(unknown)';
      cache.set(key, fn);
      return fn;
    } catch (e) {
      console.warn('[GP-Filename] getItemInfoExt failed', e);
      cache.set(key, '(unknown)');
      return '(unknown)';
    }
  }

  function ensureOverlay(tileEl) {
    let overlay = tileEl.querySelector('.gpfn-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'gpfn-overlay';
      const label = document.createElement('div');
      label.className = 'gpfn-label';
      overlay.appendChild(label);
      tileEl.appendChild(overlay);
    }
    return overlay.querySelector('.gpfn-label');
  }

  async function showFor(el) {
    const tile = getTile(el);
    if (!tile) return;

    const label = ensureOverlay(tile);
    label.textContent = '…';
    label.classList.add('gpfn-label--show');

    // Raise above selection overlay when selected
    const checkbox = tile.parentElement?.querySelector('.QcpS9c.ckGgle[aria-checked="true"]');
    if (checkbox) {
      label.style.zIndex = '2147483647';
      label.parentElement.style.zIndex = '2147483646';
    }

    const key = extractMediaKeyFromAnchor(tile) || extractAnyKeyFromStyle(tile);
    const name = await resolveFilename(key);
    label.textContent = name;
  }

  function hideFor(el) {
    const tile = getTile(el);
    if (!tile) return;
    const label = tile.querySelector('.gpfn-label');
    if (!label) return;
    setTimeout(() => {
      if (!tile.matches(':hover')) label.classList.remove('gpfn-label--show');
    }, 100);
  }

  function attachToTile(tile) {
    if (!tile || tile.dataset.gpfnTileAttached) return;
    tile.dataset.gpfnTileAttached = '1';
    tile.addEventListener('mouseenter', () => showFor(tile));
    tile.addEventListener('mouseleave', () => hideFor(tile));
  }

  function attachToCheckbox(cb) {
    if (!cb || cb.dataset.gpfnCbAttached) return;
    cb.dataset.gpfnCbAttached = '1';
    cb.addEventListener('mouseenter', () => showFor(cb));
    cb.addEventListener('mouseleave', () => hideFor(cb));
  }

  function scan() {
    document.querySelectorAll('.RY3tic').forEach(attachToTile);
    document.querySelectorAll('.QcpS9c.ckGgle').forEach(attachToCheckbox);
  }

  scan();
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });
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

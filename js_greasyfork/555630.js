// ==UserScript==
// @name         Google Photos Easy Album Adder (with Selection Recall)
// @namespace    https://buymeacoffee.com/sircluckingtonx
// @version      4.3.5
// @description  Easily add selected photos to albums in Google Photos using Shift+Q. Recall your last selection with Shift+W. (Hold Shift while pressing the letter key.) Hotkeys can be customized inside the script.
// @author       SirCluckingtonX
// @license      MIT
// @homepageURL  https://buymeacoffee.com/sircluckingtonx
// @supportURL   https://buymeacoffee.com/sircluckingtonx
// @match        https://photos.google.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555630/Google%20Photos%20Easy%20Album%20Adder%20%28with%20Selection%20Recall%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555630/Google%20Photos%20Easy%20Album%20Adder%20%28with%20Selection%20Recall%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ======= CONFIG: Set your hotkeys here =======
  // Hold SHIFT while pressing the letter key.
  // Example: Shift + Q = add to album; Shift + W = recall selection
  const HOTKEY_ADD    = { key: 'q', shift: true,  alt: false, ctrl: false, meta: false }; // Shift + Q
  const HOTKEY_RECALL = { key: 'w', shift: true,  alt: false, ctrl: false, meta: false }; // Shift + W
  // =============================================

  const LOG_PREFIX = '[GP]';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const visible = (el) => el && el.offsetParent !== null;
  const log = (...a) => console.log(LOG_PREFIX, ...a);

  // === Toast helper ===
  const toast = (msg, { duration = 1800 } = {}) => {
    let el = document.getElementById('gp-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gp-toast';
      el.style.cssText = `
        position:fixed;right:16px;bottom:16px;z-index:999999;
        background:rgba(30,30,30,.92);color:#fff;padding:8px 14px;
        border-radius:8px;font:13px/1.4 system-ui;box-shadow:0 4px 14px rgba(0,0,0,.4);
        pointer-events:none;transition:opacity .25s ease;
      `;
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => (el.style.opacity = '0'), duration);
  };

  // === Core checks ===
  const busyTexts = [
    /Adding/i,
    /Deleting album/i,
    /Album deleted/i,
    /Waiting for Photos/i,
    /\b\d+\s+(?:item|items)\s+(?:added to album|already in album|new item added)/i
  ];

  function isBusy() {
    return qsa('aside.zyTWof-Ng57nc,[aria-live],[role="status"]').some((el) => {
      if (!visible(el)) return false;
      const text = (el.textContent || '').trim();
      return text && busyTexts.some((r) => r.test(text));
    });
  }

  async function closeBanners() {
    let closed = 0;
    qsa('.zyTWof-gIZMF').forEach((msgDiv) => {
      const banner = msgDiv.closest('aside.zyTWof-Ng57nc');
      if (!banner || !visible(banner)) return;
      const closeBtn = banner.querySelector('button[aria-label="Close"].zyTWof-TolmDb');
      if (closeBtn && visible(closeBtn)) {
        ['pointerdown', 'mouseup', 'click'].forEach((t) =>
          closeBtn.dispatchEvent(new MouseEvent(t, { bubbles: true, composed: true, cancelable: true }))
        );
        closed++;
      }
    });

    qsa('button[aria-label="Close"],button[aria-label="Dismiss"]').forEach((btn) => {
      if (visible(btn)) {
        btn.click();
        closed++;
      }
    });

    if (closed) {
      log(`Closed ${closed} banner(s)`);
      await sleep(300);
    }
  }

  const getSel = () => qsa('div[role="checkbox"][aria-checked="true"].QcpS9c');
  const getAll = () => qsa('div[role="checkbox"].QcpS9c');
  const checkboxKey = (cb) => cb.getAttribute('aria-label') || '';
  const saveSel = () =>
    localStorage.setItem(
      'gp_last_selection_ids',
      JSON.stringify(getSel().map(checkboxKey))
    );
  const loadSel = () => JSON.parse(localStorage.getItem('gp_last_selection_ids') || '[]');

  const isInViewer = () =>
    qsa('button[aria-label="Open info"],button[aria-label="Info"]').some((b) => b.offsetParent);
  const isAddModal = () =>
    qsa('div[jsshadow],div[role="dialog"]').some((d) => /Search albums/i.test(d.textContent || ''));
  const findVisible = (arr) => arr.find((e) => e && visible(e));

  async function addInViewer() {
    const more = findVisible(qsa('button[aria-label="More options"]'));
    if (!more) throw Error('More options not found');
    ['pointerdown', 'mouseup', 'click'].forEach((t) =>
      more.dispatchEvent(new MouseEvent(t, { bubbles: true, composed: true, cancelable: true }))
    );

    let item = null;
    for (let i = 0; i < 10; i++) {
      await sleep(60);
      item = qsa('[role="menuitem"]').find((e) => /Add to album/i.test(e.textContent || ''));
      if (item) break;
    }
    if (!item) throw Error('"Add to album" not found');

    ['pointerdown', 'mouseup', 'click'].forEach((t) =>
      item.dispatchEvent(new MouseEvent(t, { bubbles: true, composed: true, cancelable: true }))
    );

    for (let i = 0; i < 12; i++) {
      await sleep(60);
      if (isAddModal()) break;
    }

    const input = findVisible(qsa('input[placeholder="Search albums"]'));
    input?.focus({ preventScroll: true });
  }

  async function addInGrid() {
    if (getSel().length < 1) throw Error('No photos selected');
    const btn = findVisible(qsa('button[aria-label="Create or add to album"]'));
    if (!btn) throw Error('Button not found');
    ['pointerdown', 'mouseup', 'click'].forEach((t) =>
      btn.dispatchEvent(new MouseEvent(t, { bubbles: true, composed: true, cancelable: true }))
    );

    let albumOpt = null;
    for (let i = 0; i < 12; i++) {
      await sleep(60);
      albumOpt = qsa('[role="menuitem"],[role="option"]').find((e) => /Album\b/i.test(e.textContent || ''));
      if (albumOpt) break;
    }
    if (!albumOpt) throw Error('"Album" entry not found');

    ['pointerdown', 'mouseup', 'click'].forEach((t) =>
      albumOpt.dispatchEvent(new MouseEvent(t, { bubbles: true, composed: true, cancelable: true }))
    );

    for (let i = 0; i < 12; i++) {
      await sleep(60);
      if (isAddModal()) break;
    }

    const input = findVisible(qsa('input[placeholder="Search albums"]'));
    input?.focus({ preventScroll: true });
  }

  async function addAlbum() {
    await closeBanners();
    if (isBusy()) {
      toast('Waiting for Photos to finish...');
      for (let i = 0; i < 15; i++) {
        await sleep(200);
        if (!isBusy()) break;
      }
    }
    if (isBusy()) return toast('Photos is still busy');
    if (isInViewer()) await addInViewer();
    else await addInGrid();
  }

  // === Hotkey matcher ===
  function matchHotkey(e, hotkey) {
    return (
      e.key?.toLowerCase() === hotkey.key &&
      !!e.shiftKey === !!hotkey.shift &&
      !!e.altKey === !!hotkey.alt &&
      !!e.ctrlKey === !!hotkey.ctrl &&
      !!e.metaKey === !!hotkey.meta
    );
  }

  // === Hotkeys ===
  window.addEventListener('keydown', async (e) => {
    if (e.target.matches('input,textarea') || e.target.isContentEditable) return;
    if (isAddModal()) return; // Disable while "Add to album" modal open

    if (matchHotkey(e, HOTKEY_ADD)) {
      e.preventDefault();
      try {
        await addAlbum();
        saveSel();
      } catch (err) {
        toast(err?.message || 'Could not open Add to album');
      }
    }

    if (matchHotkey(e, HOTKEY_RECALL)) {
      e.preventDefault();
      const ids = loadSel();
      if (!ids.length) return toast('No saved selection');
      let matched = 0;
      for (const cb of getAll()) {
        const key = checkboxKey(cb);
        if (ids.includes(key)) {
          ['pointerdown', 'mouseup', 'click'].forEach((t) =>
            cb.dispatchEvent(new MouseEvent(t, { bubbles: true, composed: true, cancelable: true }))
          );
          matched++;
        }
      }
      toast(`Re-selected ${matched}/${ids.length}`);
    }
  });

  document.addEventListener(
    'click',
    (e) => {
      if (e.target.closest('div[role="checkbox"].QcpS9c')) setTimeout(saveSel, 60);
    },
    true
  );

  log('Helper loaded (v4.3.5). Hotkeys: Shift+Q = Add, Shift+W = Recall');
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

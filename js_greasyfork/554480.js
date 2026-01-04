// ==UserScript==
// @name         Claim Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  banner with live counts for "valid" and "invalid" claims, history, undo and reset.
// @author       KukuModZ
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554480/Claim%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/554480/Claim%20Counter.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 KukuModZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
  'use strict';

  const STORAGE_KEY = `claimCounter_v1::${location.hostname}`;
  const MAX_HISTORY = 50;

  const defaultState = {
    valid: 0,
    invalid: 0,
    history: []
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {...defaultState};
      const parsed = JSON.parse(raw);
      return {
        valid: Number(parsed.valid || 0),
        invalid: Number(parsed.invalid || 0),
        history: Array.isArray(parsed.history) ? parsed.history.slice(0, MAX_HISTORY) : []
      };
    } catch (e) {
      console.error('ClaimCounter: load error', e);
      return {...defaultState};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('ClaimCounter: save error', e);
    }
  }

  function createBanner() {
    if (document.getElementById('claim-counter-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'claim-counter-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 14px;
      right: 14px;
      width: 360px;
      max-width: calc(100% - 28px);
      background: linear-gradient(135deg,#0f172a,#021124);
      color: #e6f0ff;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(2,6,23,0.6);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      padding: 12px;
      font-size: 14px;
      user-select: none;
    `;

    banner.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="font-size:18px; font-weight:700;">Claim Counter</div>
          <div id="claim-host" style="opacity:.8; font-size:12px; padding:4px 8px; border-radius:6px; background: rgba(255,255,255,0.02);">
            ${location.hostname}
          </div>
        </div>

        <div style="display:flex; gap:8px; align-items:center;">
          <button id="ccb-toggle" title="Toggle collapse" style="background:transparent; border:none; color:inherit; cursor:pointer; font-size:18px;">—</button>
          <button id="ccb-reset" title="Reset counts" style="background:#ff4d4f; color:white; border:none; padding:6px 8px; border-radius:8px; cursor:pointer;">Reset</button>
        </div>
      </div>

      <div id="ccb-body" style="margin-top:10px; display:block;">
        <div style="display:flex; gap:8px; align-items:center; justify-content:space-between;">
          <div style="display:flex; gap:8px; align-items:center;">
            <div style="text-align:center; padding:8px 10px; border-radius:8px; background: rgba(255,255,255,0.03);">
              <div style="font-size:12px; opacity:.8;">Valid</div>
              <div id="ccb-valid" style="font-size:22px; font-weight:800; margin-top:4px;">0</div>
              <div style="font-size:20px; margin-top:4px;">✅</div>
            </div>

            <div style="text-align:center; padding:8px 10px; border-radius:8px; background: rgba(255,255,255,0.03);">
              <div style="font-size:12px; opacity:.8;">Invalid</div>
              <div id="ccb-invalid" style="font-size:22px; font-weight:800; margin-top:4px;">0</div>
              <div style="font-size:20px; margin-top:4px;">❌</div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            <div style="display:flex; gap:6px;">
              <button id="ccb-add-valid" style="background:#10b981; border:none; color:white; padding:8px 10px; border-radius:8px; cursor:pointer; font-weight:700;">+ Valid (V)</button>
              <button id="ccb-add-invalid" style="background:#ef4444; border:none; color:white; padding:8px 10px; border-radius:8px; cursor:pointer; font-weight:700;">+ Invalid (I)</button>
            </div>
            <div style="display:flex; gap:6px;">
              <button id="ccb-undo" style="background:transparent; border:1px solid rgba(255,255,255,0.08); color:inherit; padding:6px 8px; border-radius:8px; cursor:pointer;">Undo (U)</button>
            </div>
          </div>
        </div>

        <div style="margin-top:12px;">
          <div style="font-size:12px; opacity:.8; margin-bottom:6px;">Recent activity</div>
          <div id="ccb-history" style="max-height:100px; overflow:auto; padding:8px; background: rgba(255,255,255,0.02); border-radius:8px; font-size:13px;">
            <div style="opacity:.6; text-align:center;">No activity yet</div>
          </div>
        </div>

        <div style="margin-top:10px; font-size:12px; opacity:.8; display:flex; justify-content:space-between;">
          <div>Keyboard: V=valid, I=invalid, U=undo, R=reset</div>
          <div id="ccb-last-sync" style="opacity:.7;">Saved</div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    makeDraggable(banner);

    const addValidBtn = document.getElementById('ccb-add-valid');
    const addInvalidBtn = document.getElementById('ccb-add-invalid');
    const undoBtn = document.getElementById('ccb-undo');
    const resetBtn = document.getElementById('ccb-reset');
    const toggleBtn = document.getElementById('ccb-toggle');

    addValidBtn.addEventListener('click', () => addEntry('valid'));
    addInvalidBtn.addEventListener('click', () => addEntry('invalid'));
    undoBtn.addEventListener('click', undoLast);
    resetBtn.addEventListener('click', resetCounts);
    toggleBtn.addEventListener('click', toggleCollapse);

    window.addEventListener('keydown', (ev) => {
      const tag = (ev.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || ev.target.isContentEditable) return;

      if (ev.key.toLowerCase() === 'v') addEntry('valid');
      else if (ev.key.toLowerCase() === 'i') addEntry('invalid');
      else if (ev.key.toLowerCase() === 'u') undoLast();
      else if (ev.key.toLowerCase() === 'r') resetCounts();
    });
  }

  function makeDraggable(el) {
    let isDragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;
    const header = el.querySelector('div');
    header.style.cursor = 'grab';

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origLeft = rect.left; origTop = rect.top;
      header.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      el.style.left = origLeft + dx + 'px';
      el.style.top = origTop + dy + 'px';
      el.style.right = 'auto'; el.style.bottom = 'auto';
      el.style.position = 'fixed';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      header.style.cursor = 'grab';
    });
  }

  let state = loadState();

  function updateUI() {
    document.getElementById('ccb-valid').textContent = state.valid;
    document.getElementById('ccb-invalid').textContent = state.invalid;

    const histEl = document.getElementById('ccb-history');
    histEl.innerHTML = '';

    if (!state.history.length) {
      const empty = document.createElement('div');
      empty.style.opacity = '0.6';
      empty.style.textAlign = 'center';
      empty.textContent = 'No activity yet';
      histEl.appendChild(empty);
    } else {
      state.history.slice().reverse().forEach((entry) => {
        const row = document.createElement('div');
        row.style.cssText = `
          display:flex; justify-content:space-between;
          padding:4px 6px; border-radius:6px; margin-bottom:4px; align-items:center; font-size:13px;
          background:${entry.type === 'valid' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)'};
        `;
        const left = document.createElement('div');
        left.textContent = entry.type === 'valid' ? '✅ Valid' : '❌ Invalid';
        left.style.fontWeight = '600';

        const right = document.createElement('div');
        right.textContent = new Date(entry.ts).toLocaleTimeString();
        right.style.opacity = '0.75';
        right.style.fontSize = '12px';

        row.appendChild(left); row.appendChild(right);
        histEl.appendChild(row);
      });
    }

    document.getElementById('ccb-last-sync').textContent = `Saved ${new Date().toLocaleTimeString()}`;
  }

  function addEntry(type) {
    if (type === 'valid') state.valid++;
    else state.invalid++;

    state.history.push({ type, ts: Date.now() });
    if (state.history.length > MAX_HISTORY) state.history = state.history.slice(-MAX_HISTORY);

    saveState(state);
    updateUI();
  }

  function undoLast() {
    if (!state.history.length) return flashMessage('No action to undo');
    const last = state.history.pop();
    if (last.type === 'valid') state.valid = Math.max(0, state.valid - 1);
    else state.invalid = Math.max(0, state.invalid - 1);

    saveState(state);
    updateUI();
    flashMessage('Last action undone');
  }

  function resetCounts() {
    if (!confirm('Reset counts and history?')) return;
    state = {...defaultState};
    saveState(state);
    updateUI();
    flashMessage('Counts reset');
  }

  function toggleCollapse() {
    const body = document.getElementById('ccb-body');
    const btn = document.getElementById('ccb-toggle');
    if (body.style.display === 'none') {
      body.style.display = 'block';
      btn.textContent = '—';
    } else {
      body.style.display = 'none';
      btn.textContent = '+';
    }
  }

  function flashMessage(msg, ms = 1200) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; right: 20px; bottom: 120px;
      background: rgba(0,0,0,0.8); color: white;
      padding: 8px 12px; border-radius: 8px; z-index: 1000000; font-size: 13px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), ms);
  }

  function start() {
    createBanner();
    updateUI();
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        state = loadState();
        updateUI();
        flashMessage('Counts synced');
      }
    });
  }

  start();

})();

// ==UserScript==
// @name         RealTimeTrains — RRQ toggle simple
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a toggle button to hide, highlight, or show "runs as required" trains on realtimetrains.co.uk
// @match        https://www.realtimetrains.co.uk/*
// @match        https://realtimetrains.co.uk/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555134/RealTimeTrains%20%E2%80%94%20RRQ%20toggle%20simple.user.js
// @updateURL https://update.greasyfork.org/scripts/555134/RealTimeTrains%20%E2%80%94%20RRQ%20toggle%20simple.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const ROW_SELECTOR = 'a.service, a.service.nonpax, a.service.pax';
  const MODES = ['hide', 'highlight', 'none'];
  const STORAGE_KEY = 'rtt_rrq_mode_simple';
  let mode = localStorage.getItem(STORAGE_KEY) || 'hide';

  function isRunsAsRequired(row) {
    if (!row) return false;
    if (row.querySelector('.rrq')) return true;
    if (/\(Q\)/.test(row.textContent)) return true;
    if (/runs as required/i.test(row.textContent)) return true;
    const els = [row].concat(Array.from(row.querySelectorAll('*')));
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const tt = el.getAttribute('tooltip') || el.getAttribute('data-tooltip') || el.getAttribute('title') || el.getAttribute('aria-label');
      if (tt && /runs as required/i.test(tt)) return true;
    }
    return false;
  }

  function applyMode() {
    const rows = document.querySelectorAll(ROW_SELECTOR);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const match = isRunsAsRequired(row);
      row.style.display = '';
      row.style.outline = '';
      if (match) {
        if (mode === 'hide') {
          row.style.display = 'none';
        } else if (mode === 'highlight') {
          row.style.outline = '2px solid orange';
        }
      }
    }
    updateButton();
  }

  function updateButton() {
    const btn = document.getElementById('rrqToggleBtn');
    if (!btn) return;
    if (mode === 'hide') btn.textContent = 'RRQ: Hidden';
    else if (mode === 'highlight') btn.textContent = 'RRQ: Highlighted';
    else btn.textContent = 'RRQ: Shown';
  }

  function cycleMode() {
    const idx = MODES.indexOf(mode);
    mode = MODES[(idx + 1) % MODES.length];
    localStorage.setItem(STORAGE_KEY, mode);
    applyMode();
  }

  function createButton() {
    if (document.getElementById('rrqToggleBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'rrqToggleBtn';
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '99999';
    btn.style.background = '#222';
    btn.style.color = '#fff';
    btn.style.border = '1px solid #555';
    btn.style.padding = '6px 10px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontFamily = 'sans-serif';
    btn.addEventListener('click', cycleMode);
    document.body.appendChild(btn);
    updateButton();
  }

  function init() {
    createButton();
    applyMode();
    setTimeout(applyMode, 2000);
  }

  window.addEventListener('load', init);
})();

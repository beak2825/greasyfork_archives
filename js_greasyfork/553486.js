// ==UserScript==
// @name         Roblox Visual Robux Display (Abbreviated Format)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Cosmetic-only Robux display editor with automatic Roblox-style abbreviations (K, M, +). Press "=" or "M" to toggle.
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553486/Roblox%20Visual%20Robux%20Display%20%28Abbreviated%20Format%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553486/Roblox%20Visual%20Robux%20Display%20%28Abbreviated%20Format%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const UI_ID = 'robux-visual-editor-ui';
  const STORAGE_KEY = 'robux_visual_value';
  const STORAGE_ENABLED = 'robux_visual_enabled';

  // --- FORMAT ROBUX LIKE ROBLOX DOES ---
  function formatRobux(num) {
    num = Number(num);
    if (isNaN(num)) return num;
    if (num >= 10000000) return (num / 1000000).toFixed(0) + 'M+';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toLocaleString();
  }

  function getBalanceElement() {
    let el = document.querySelector('[data-testid="nav-robux-amount"]');
    if (!el) el = document.querySelector('.icon-nav-robux-balance, .rbx-text-navbar-right');
    return el;
  }

  function applyVisualValue(value) {
    const el = getBalanceElement();
    if (el) el.textContent = formatRobux(value);
  }

  function restoreRealValue() {
    location.reload();
  }

  function createUI() {
    if (document.getElementById(UI_ID)) return;

    const ui = document.createElement('div');
    ui.id = UI_ID;
    ui.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 12px;
      border-radius: 8px;
      z-index: 999999;
      width: 220px;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: opacity 0.25s ease;
    `;
    ui.innerHTML = `
      <h4 style="margin-top:0;">Visual Robux Editor</h4>
      <label style="font-size:13px;">Amount:</label>
      <input type="number" id="${UI_ID}-val" style="width:100%;margin:4px 0;padding:5px;border-radius:4px;border:1px solid #555;background:#222;color:white;" />
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button id="${UI_ID}-apply" style="flex:1;background:#007bff;color:white;border:none;border-radius:6px;padding:6px;">Apply</button>
        <button id="${UI_ID}-reset" style="flex:1;background:#444;color:white;border:none;border-radius:6px;padding:6px;">Reset</button>
      </div>
      <p style="font-size:11px;color:#ccc;margin-top:6px;">Press "=" or "M" to toggle<br>Visual only — doesn't change your balance.</p>
    `;
    document.body.appendChild(ui);
    ui.style.display = 'none';
    ui.style.opacity = '0';

    const valInput = document.getElementById(`${UI_ID}-val`);
    valInput.value = localStorage.getItem(STORAGE_KEY) || '';

    document.getElementById(`${UI_ID}-apply`).onclick = () => {
      const val = valInput.value;
      if (!val) return;
      localStorage.setItem(STORAGE_KEY, val);
      localStorage.setItem(STORAGE_ENABLED, '1');
      applyVisualValue(val);
    };

    document.getElementById(`${UI_ID}-reset`).onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_ENABLED);
      restoreRealValue();
    };
  }

  function toggleUI() {
    const ui = document.getElementById(UI_ID);
    if (!ui) createUI();
    const visible = ui.style.display !== 'none';
    if (visible) {
      ui.style.opacity = '0';
      setTimeout(() => ui.style.display = 'none', 250);
    } else {
      ui.style.display = 'block';
      setTimeout(() => ui.style.opacity = '1', 10);
    }
  }

  window.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === '=' || e.key.toLowerCase() === 'm') {
      e.preventDefault();
      toggleUI();
    }
  });

  setTimeout(() => {
    createUI();
    const val = localStorage.getItem(STORAGE_KEY);
    const enabled = !!localStorage.getItem(STORAGE_ENABLED);
    if (val && enabled) applyVisualValue(val);
  }, 1500);
})();


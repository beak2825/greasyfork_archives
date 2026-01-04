// ==UserScript==
// @name         🌓 Smart Dark Mode Tuner
// @namespace    https://melashri.net
// @version      1.0
// @description  Adjustable dark mode
// @author       melashri
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      GPLv3
// @icon         image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.51-.05-1-.14-1.48l1.47-1.47c.39.58.67 1.26.67 2.05 0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.73 0 3.34.47 4.72 1.31L12 3z"/></svg>
// @downloadURL https://update.greasyfork.org/scripts/557925/%F0%9F%8C%93%20Smart%20Dark%20Mode%20Tuner.user.js
// @updateURL https://update.greasyfork.org/scripts/557925/%F0%9F%8C%93%20Smart%20Dark%20Mode%20Tuner.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ── Keys ────────────────────────────────────────────────────────
  const STYLE_ID = 'smart-dark-style';
  const PANEL_ID = 'smart-dark-panel';
  const TOGGLE_BTN_ID = 'smart-dark-toggle-btn';
  const SETTINGS_KEY = `darkTuner_${location.hostname}`;
  const UI_VISIBLE_KEY = 'smartDark.showUI'; // global, cross-tab

  const DEFAULT_SETTINGS = {
    enabled: false,
    invert: 1.0,
    contrast: 1.0,
    brightness: 1.0,
    saturate: 1.0,
    textShadow: true,
  };

  // Load settings
  let settings = Object.assign(
    {}, DEFAULT_SETTINGS,
    JSON.parse(GM_getValue(SETTINGS_KEY, '{}'))
  );

  // Read current UI visibility (shared across tabs)
  let showUI = localStorage.getItem(UI_VISIBLE_KEY) === 'true';

  // ── Helpers ──────────────────────────────────────────────────────
  function whenReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ── Style Engine ─────────────────────────────────────────────────
  function updateStyle() {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = Object.assign(document.createElement('style'), { id: STYLE_ID });
      document.head.appendChild(el);
    }

    if (!settings.enabled) {
      el.textContent = '';
      return;
    }

    const { invert, contrast, brightness, saturate, textShadow } = settings;
    el.textContent = `
      html {
        filter: invert(${invert}) contrast(${contrast}) brightness(${brightness}) saturate(${saturate});
        background: #000 !important;
        color-scheme: dark;
      }
      img, video, canvas, svg:not(:root), iframe, embed, object,
      [aria-label*="emoji" i], [role="img"], .emoji, .notion-emoji,
      .katex, .math, .MathJax_Display {
        filter: invert(${invert}) contrast(${contrast}) brightness(${brightness}) saturate(${saturate}) !important;
        color-scheme: light;
      }
      ${textShadow ? `
        * { text-shadow: 0 0 0.5px #0008, 0 0 1px #0004 !important; }
      ` : ''}
    `;
  }

  function saveSettings() {
    GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    updateStyle();
  }

  // ── Create Full Panel ───────────────────────────────────────────
  function createPanel() {
    // Ensure clean state
    hideUIElements();

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div style="
        position: fixed; top: 12px; right: 12px; z-index: 2147483640;
        background: #1e1e1e; color: #e0e0e0; padding: 12px; border-radius: 8px;
        font: 13px system-ui; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08);
        max-width: 280px;
      ">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <b>🌓 Dark Tuner</b>
          <span id="toggleBtn" style="
            cursor:pointer; padding:2px 8px; border-radius:4px;
            background:${settings.enabled ? '#4caf50' : '#f44336'};
            color:white; font:500 12px sans-serif;
          ">${settings.enabled ? 'ON' : 'OFF'}</span>
        </div>

        <div id="controls" style="${settings.enabled ? '' : 'display:none'}">
          <label style="display:block;margin:6px 0;">
            Invert: <code id="invVal">${settings.invert.toFixed(2)}</code><br>
            <input type="range" id="inv" min="0" max="1" step="0.01" value="${settings.invert}">
          </label>
          <label style="display:block;margin:6px 0;">
            Contrast: <code id="conVal">${settings.contrast.toFixed(2)}</code><br>
            <input type="range" id="con" min="0.5" max="2" step="0.05" value="${settings.contrast}">
          </label>
          <label style="display:block;margin:6px 0;">
            Brightness: <code id="briVal">${settings.brightness.toFixed(2)}</code><br>
            <input type="range" id="bri" min="0.3" max="1.5" step="0.05" value="${settings.brightness}">
          </label>
          <label style="display:block;margin:6px 0;">
            Saturation: <code id="satVal">${settings.saturate.toFixed(2)}</code><br>
            <input type="range" id="sat" min="0" max="2" step="0.05" value="${settings.saturate}">
          </label>
          <label style="display:flex;align-items:center;gap:6px;margin:8px 0">
            <input type="checkbox" id="textShadow" ${settings.textShadow ? 'checked' : ''}>
            <span>Text shadow</span>
          </label>
        </div>

        <div style="display:flex;gap:6px;margin-top:8px;font-size:12px">
          <button id="reset" style="flex:1;padding:4px;background:#333;border:1px solid #555;border-radius:4px">↺ Reset</button>
          <button id="hide" style="flex:1;padding:4px;background:#555;border:1px solid #777;border-radius:4px">⨯ Hide UI</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    const $ = (sel) => panel.querySelector(sel);

    $('#toggleBtn').onclick = () => {
      settings.enabled = !settings.enabled;
      $('#toggleBtn').innerText = settings.enabled ? 'ON' : 'OFF';
      $('#toggleBtn').style.background = settings.enabled ? '#4caf50' : '#f44336';
      $('#controls').style.display = settings.enabled ? '' : 'none';
      saveSettings();
    };

    const bind = (id, key, display) => {
      const el = $(id);
      el.oninput = () => {
        settings[key] = parseFloat(el.value);
        $(display).textContent = settings[key].toFixed(2);
        saveSettings();
      };
    };
    bind('#inv', 'invert', '#invVal');
    bind('#con', 'contrast', '#conVal');
    bind('#bri', 'brightness', '#briVal');
    bind('#sat', 'saturate', '#satVal');

    $('#textShadow').onchange = () => {
      settings.textShadow = $('#textShadow').checked;
      saveSettings();
    };

    $('#reset').onclick = () => {
      Object.assign(settings, DEFAULT_SETTINGS);
      ['#inv','#con','#bri','#sat'].forEach(id => $(id).value = settings[id.slice(1)]);
      $('#textShadow').checked = settings.textShadow;
      ['#invVal','#conVal','#briVal','#satVal'].forEach((id,i) =>
        $(id).textContent = [settings.invert,settings.contrast,settings.brightness,settings.saturate][i].toFixed(2)
      );
      $('#toggleBtn').innerText = 'OFF';
      $('#toggleBtn').style.background = '#f44336';
      $('#controls').style.display = 'none';
      saveSettings();
    };

    $('#hide').onclick = hideUIGlobally;

    // Draggable
    const header = panel.firstChild;
    let drag = false, ox, oy;
    header.onmousedown = (e) => {
      if (e.target.closest('button,input,label')) return;
      drag = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop;
      e.preventDefault();
    };
    document.addEventListener('mousemove', e => {
      if (drag) {
        panel.style.left = (e.clientX - ox) + 'px';
        panel.style.top = (e.clientY - oy) + 'px';
        panel.style.right = 'auto';
      }
    });
    document.addEventListener('mouseup', () => drag = false);
  }

  // ── Toggle Button ───────────────────────────────────────────────
  function createToggleButton() {
    hideUIElements();
    const btn = document.createElement('div');
    btn.id = TOGGLE_BTN_ID;
    btn.innerHTML = '🌓';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      zIndex: '2147483640',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#333',
      color: '#ddd',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      userSelect: 'none',
    });
    btn.title = 'Open Dark Mode Tuner';
    btn.onclick = showUIGlobally;
    document.body.appendChild(btn);
  }

  // ── Unified UI control ──────────────────────────────────────────
  function hideUIElements() {
    const panel = document.getElementById(PANEL_ID);
    const btn = document.getElementById(TOGGLE_BTN_ID);
    if (panel) panel.remove();
    if (btn) btn.remove();
  }

  function hideUIGlobally() {
    hideUIElements();
    localStorage.setItem(UI_VISIBLE_KEY, 'false');
    // Broadcast to other tabs
    // (localStorage change triggers 'storage' event elsewhere)
  }

  function showUIGlobally() {
    hideUIElements(); // remove toggle btn first
    localStorage.setItem(UI_VISIBLE_KEY, 'true');
    createPanel();
  }

  // ── Hotkey ──────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      showUIGlobally();
    }
  });

  // ── Cross-Tab Sync via Storage Event ────────────────────────────
  window.addEventListener('storage', (e) => {
    if (e.key === UI_VISIBLE_KEY) {
      // Another tab changed the UI visibility → sync immediately
      const shouldBeVisible = e.newValue !== 'false';
      if (shouldBeVisible) {
        // Another tab requested UI → we open it *only if user interacts* (avoid intrusion)
        // But we *do* clean up our own toggle button to stay consistent
        hideUIElements();
        createToggleButton(); // let user choose to open
      } else {
        // Another tab hid UI → we hide ours too
        hideUIElements();
      }
    }
  });

  // ── TM Menu ─────────────────────────────────────────────────────
  function exposeOpenUI() {
    const globalKey = '__openDarkTunerUI__';
    window[globalKey] = showUIGlobally;
    window.addEventListener('beforeunload', () => { delete window[globalKey]; });
  }

  try {
    exposeOpenUI();
    GM_registerMenuCommand('🌓 Open Dark Tuner UI', showUIGlobally);
    GM_registerMenuCommand(
      `🌓 Dark Mode: ${settings.enabled ? 'Disable' : 'Enable'}`,
      () => {
        settings.enabled = !settings.enabled;
        saveSettings();
      }
    );
  } catch (e) {
    console.warn('[Dark Tuner] GM_registerMenuCommand unavailable');
  }

  // ── Initialize ──────────────────────────────────────────────────
  whenReady(() => {
    updateStyle();

    if (showUI) {
      createPanel();
    }
    // Don't create toggle button automatically
  });

})();
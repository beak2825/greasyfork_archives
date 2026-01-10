// ==UserScript==
// @name         🌓 Smart Dark Mode Tuner
// @namespace    https://melashri.net
// @version      1.1
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
        background: #1e1e1e; color: #e0e0e0; padding: 16px; border-radius: 8px;
        font: 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.08);
        max-width: 300px;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
      ">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;cursor:move;">
          <b style="font-size:15px;">🌓 Dark Tuner</b>
          <span id="toggleBtn" style="
            cursor:pointer; padding:4px 12px; border-radius:4px;
            background:${settings.enabled ? '#4caf50' : '#f44336'};
            color:white; font:600 13px sans-serif;
            touch-action: manipulation;
          ">${settings.enabled ? 'ON' : 'OFF'}</span>
        </div>

        <div id="controls" style="${settings.enabled ? '' : 'display:none'}">
          <label style="display:block;margin:8px 0;">
            Invert: <code id="invVal">${settings.invert.toFixed(2)}</code><br>
            <input type="range" id="inv" min="0" max="1" step="0.01" value="${settings.invert}"
              style="width:100%;margin-top:4px;">
          </label>
          <label style="display:block;margin:8px 0;">
            Contrast: <code id="conVal">${settings.contrast.toFixed(2)}</code><br>
            <input type="range" id="con" min="0.5" max="2" step="0.05" value="${settings.contrast}"
              style="width:100%;margin-top:4px;">
          </label>
          <label style="display:block;margin:8px 0;">
            Brightness: <code id="briVal">${settings.brightness.toFixed(2)}</code><br>
            <input type="range" id="bri" min="0.3" max="1.5" step="0.05" value="${settings.brightness}"
              style="width:100%;margin-top:4px;">
          </label>
          <label style="display:block;margin:8px 0;">
            Saturation: <code id="satVal">${settings.saturate.toFixed(2)}</code><br>
            <input type="range" id="sat" min="0" max="2" step="0.05" value="${settings.saturate}"
              style="width:100%;margin-top:4px;">
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin:10px 0;cursor:pointer;">
            <input type="checkbox" id="textShadow" ${settings.textShadow ? 'checked' : ''}
              style="width:18px;height:18px;cursor:pointer;">
            <span>Text shadow</span>
          </label>
        </div>

        <div style="display:flex;gap:8px;margin-top:10px;font-size:13px">
          <button id="reset" style="
            flex:1;padding:8px;background:#333;color:#fff;border:1px solid #555;
            border-radius:4px;cursor:pointer;font-weight:500;
            touch-action: manipulation;
          ">↺ Reset</button>
          <button id="hide" style="
            flex:1;padding:8px;background:#555;color:#fff;border:1px solid #777;
            border-radius:4px;cursor:pointer;font-weight:500;
            touch-action: manipulation;
          ">⨯ Hide UI</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    const $ = (sel) => panel.querySelector(sel);
    const panelDiv = panel.firstChild;

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
      ['#inv','#con','#bri','#sat'].forEach(id => {
        const key = id === '#inv' ? 'invert' : id === '#con' ? 'contrast' : id === '#bri' ? 'brightness' : 'saturate';
        $(id).value = settings[key];
      });
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

    // Draggable (Mouse + Touch support for iOS)
    const header = panelDiv;
    let drag = false, ox = 0, oy = 0;

    const startDrag = (clientX, clientY, target) => {
      if (target.closest('button,input,label')) return false;
      drag = true;
      ox = clientX - panelDiv.offsetLeft;
      oy = clientY - panelDiv.offsetTop;
      return true;
    };

    const doDrag = (clientX, clientY) => {
      if (drag) {
        panelDiv.style.left = (clientX - ox) + 'px';
        panelDiv.style.top = (clientY - oy) + 'px';
        panelDiv.style.right = 'auto';
      }
    };

    const endDrag = () => {
      drag = false;
    };

    // Mouse events
    header.addEventListener('mousedown', (e) => {
      if (startDrag(e.clientX, e.clientY, e.target)) {
        e.preventDefault();
      }
    });
    document.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    // Touch events for iOS
    header.addEventListener('touchstart', (e) => {
      if (e.target.closest('button,input,label')) return;
      const touch = e.touches[0];
      if (startDrag(touch.clientX, touch.clientY, e.target)) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (drag && e.touches.length > 0) {
        const touch = e.touches[0];
        doDrag(touch.clientX, touch.clientY);
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);
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
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#333',
      color: '#ddd',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent',
    });
    btn.title = 'Open Dark Mode Tuner';
    btn.onclick = showUIGlobally;
    btn.ontouchend = (e) => {
      e.preventDefault();
      showUIGlobally();
    };
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
  }

  function showUIGlobally() {
    hideUIElements();
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
      const shouldBeVisible = e.newValue === 'true';
      if (shouldBeVisible) {
        hideUIElements();
        createToggleButton();
      } else {
        hideUIElements();
      }
    }
  });

  // ── TM Menu ─────────────────────────────────────────────────────
  function exposeOpenUI() {
    const globalKey = '__openDarkTunerUI__';
    window[globalKey] = showUIGlobally;
    window.addEventListener('beforeunload', () => {
      window[globalKey] = null;
    });
  }

  // Register menu commands separately from exposeOpenUI
  exposeOpenUI();

  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('🌓 Open Dark Tuner UI', showUIGlobally);
    GM_registerMenuCommand(
      `🌓 Dark Mode: ${settings.enabled ? 'Disable' : 'Enable'}`,
      () => {
        settings.enabled = !settings.enabled;
        saveSettings();
      }
    );
  } else {
    console.warn('[Dark Tuner] GM_registerMenuCommand unavailable');
  }

  // ── Initialize ──────────────────────────────────────────────────
  whenReady(() => {
    updateStyle();

    if (showUI) {
      createPanel();
    } else {
      // Show toggle button by default so users can access the UI
      createToggleButton();
    }
  });

})();
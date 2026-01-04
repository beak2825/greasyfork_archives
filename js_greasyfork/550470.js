// ==UserScript==
// @name         Pinterest Dark Mode V2.0!
// @namespace    https://github.com/trojaninfect
// @version      2.0
// @description  Force dark mode on pinterest.com with integrated dev mode toggle in settings gear, keeps images/svg normal, supports toggle and persists choice, now with live CSS editor in dev panel.
// @author       NoSleep
// @match        https://*.pinterest.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550470/Pinterest%20Dark%20Mode%20V20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/550470/Pinterest%20Dark%20Mode%20V20%21.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'tm-pinterest-dark-style-v1';
  let enabled = GM_getValue('tm_pinterest_dark_enabled', true);
  let devModeEnabled = GM_getValue('tm_pinterest_dev_enabled', false);

  const defaultDarkCSS = `
    html.tm-pinterest-dark, html.tm-pinterest-dark body {
      background: #0b0b0b !important;
      color: #e6e6e6 !important;
    }
    html.tm-pinterest-dark body,
    html.tm-pinterest-dark header,
    html.tm-pinterest-dark main,
    html.tm-pinterest-dark nav,
    html.tm-pinterest-dark section,
    html.tm-pinterest-dark aside,
    html.tm-pinterest-dark footer,
    html.tm-pinterest-dark article,
    html.tm-pinterest-dark div,
    html.tm-pinterest-dark li,
    html.tm-pinterest-dark a,
    html.tm-pinterest-dark p,
    html.tm-pinterest-dark span,
    html.tm-pinterest-dark button,
    html.tm-pinterest-dark input,
    html.tm-pinterest-dark textarea {
      background-color: transparent !important;
      color: #e6e6e6 !important;
      border-color: rgba(255,255,255,0.06) !important;
    }
    html.tm-pinterest-dark .BoardPage,
    html.tm-pinterest-dark .Grid,
    html.tm-pinterest-dark .GrowthUnauthPage,
    html.tm-pinterest-dark .Collection,
    html.tm-pinterest-dark .pin,
    html.tm-pinterest-dark .Modal,
    html.tm-pinterest-dark .modal,
    html.tm-pinterest-dark [data-test-id="pin"] {
      background: #0f0f10 !important;
      box-shadow: 0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 20px rgba(0,0,0,0.6) !important;
    }
    html.tm-pinterest-dark header[role="banner"],
    html.tm-pinterest-dark nav[role="navigation"],
    html.tm-pinterest-dark .Header,
    html.tm-pinterest-dark .topNav {
      background: linear-gradient(180deg,#0d0d0d,#0a0a0a) !important;
      border-bottom: 1px solid rgba(255,255,255,0.04) !important;
    }
    html.tm-pinterest-dark input,
    html.tm-pinterest-dark textarea,
    html.tm-pinterest-dark select {
      background: rgba(255,255,255,0.03) !important;
      color: #e6e6e6 !important;
      border: 1px solid rgba(255,255,255,0.04) !important;
    }
    html.tm-pinterest-dark a,
    html.tm-pinterest-dark a:visited {
      color: #ff7a7a !important;
    }
    html.tm-pinterest-dark img,
    html.tm-pinterest-dark svg,
    html.tm-pinterest-dark video,
    html.tm-pinterest-dark picture {
      filter: none !important;
      background: transparent !important;
    }
    html.tm-pinterest-dark img[style],
    html.tm-pinterest-dark img {
      image-rendering: auto !important;
    }
    html.tm-pinterest-dark .tappable,
    html.tm-pinterest-dark .small,
    html.tm-pinterest-dark .meta,
    html.tm-pinterest-dark .description {
      color: rgba(230,230,230,0.75) !important;
    }
    html.tm-pinterest-dark .Overlay,
    html.tm-pinterest-dark .Tooltip,
    html.tm-pinterest-dark .Popover {
      background: rgba(12,12,12,0.95) !important;
      color: #e6e6e6 !important;
    }
    html.tm-pinterest-dark * {
      box-shadow: none !important;
    }
    html.tm-pinterest-dark ::-webkit-scrollbar { width: 10px; height: 10px; }
    html.tm-pinterest-dark ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
    html.tm-pinterest-dark ::-webkit-scrollbar-track { background: rgba(0,0,0,0.12); }

    html.tm-pinterest-dark svg:not(:root) {
      fill: #ffffff !important;
      stroke: #ffffff !important;
      background: transparent !important;
    }

    html.tm-pinterest-dark .ProfilePageHeader,
    html.tm-pinterest-dark .ProfilePageHeader-content,
    html.tm-pinterest-dark [data-test-id="profile-header"],
    html.tm-pinterest-dark .ProfilePageHeader-content > *,
    html.tm-pinterest-dark [data-test-id="profile-header"] > * {
      position: relative !important;
      top: auto !important;
      z-index: auto !important;
      background: #0b0b0b !important;
    }

    html.tm-pinterest-dark .qiB,
    html.tm-pinterest-dark [data-test-id="self-profile-header"] {
      position: relative !important;
      top: auto !important;
      z-index: auto !important;
      background: #0b0b0b !important;
    }
  `;

  // Load custom CSS if saved, else default
  let currentCSS = GM_getValue('tm_custom_dark_css', defaultDarkCSS);

  function applyStyle(on) {
    const html = document.documentElement;
    if (on) html.classList.add('tm-pinterest-dark');
    else html.classList.remove('tm-pinterest-dark');

    let el = document.getElementById(STYLE_ID);
    if (on) {
      if (!el) {
        try {
          if (typeof GM_addStyle === 'function') {
            GM_addStyle(currentCSS);
            el = document.querySelector('style');
            if (el) el.id = STYLE_ID;
          } else {
            el = document.createElement('style');
            el.id = STYLE_ID;
            el.type = 'text/css';
            el.textContent = currentCSS;
            document.head.appendChild(el);
          }
        } catch (e) {
          el = document.createElement('style');
          el.id = STYLE_ID;
          el.type = 'text/css';
          el.textContent = currentCSS;
          document.head.appendChild(el);
        }
      } else {
        el.textContent = currentCSS;
      }
    } else {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
  }

  function setEnabled(value) {
    enabled = !!value;
    GM_setValue('tm_pinterest_dark_enabled', enabled);
    applyStyle(enabled);
  }

  function toggle() {
    setEnabled(!enabled);
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'D' && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
      toggle();
      e.preventDefault();
    }
  }, true);

  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(
        enabled ? 'Disable Pinterest Dark Mode' : 'Enable Pinterest Dark Mode',
        toggle
      );
    }
  } catch (e) { }

  const observer = new MutationObserver(() => {
    if (enabled && !document.getElementById(STYLE_ID)) {
      applyStyle(true);
    }
    if (enabled && !document.documentElement.classList.contains('tm-pinterest-dark')) {
      document.documentElement.classList.add('tm-pinterest-dark');
    }
  });

  function startObserver() {
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyStyle(enabled);
      startObserver();
    }, { once: true });
  } else {
    applyStyle(enabled);
    startObserver();
  }

  try { applyStyle(enabled); } catch (e) { }

  // NEW REAPPLY FIX
  window.addEventListener('load', () => {
    applyStyle(enabled);
  });

  // --- POPUP NOTICE (refresh tip) ---
  function showDarkModeNotice() {
    if (document.getElementById('tm-darkmode-notice')) return;

    const notice = document.createElement('div');
    notice.id = 'tm-darkmode-notice';
    notice.textContent = '⚠️ If dark mode doesn’t load properly, please refresh the page.';
    Object.assign(notice.style, {
      position: 'fixed',
      top: '-100px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '800px',
      background: 'linear-gradient(90deg, #ff7a7a, #ff4d4d)',
      color: '#fff',
      fontWeight: '700',
      textAlign: 'center',
      padding: '14px 0',
      zIndex: '999999',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: '16px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(255, 0, 0, 0.4), 0 3px 10px rgba(0,0,0,0.5)',
      cursor: 'pointer',
      opacity: '0',
      transition: 'all 0.8s ease'
    });

    document.body.appendChild(notice);

    setTimeout(() => {
      notice.style.top = '20px';
      notice.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      notice.style.opacity = '0';
      notice.style.top = '-100px';
      setTimeout(() => notice.remove(), 800);
    }, 6000);

    notice.addEventListener('click', () => {
      notice.style.opacity = '0';
      notice.style.top = '-100px';
      setTimeout(() => notice.remove(), 800);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showDarkModeNotice, { once: true });
  } else {
    showDarkModeNotice();
  }

  // --- SETTINGS GEAR MENU (polished version with dev mode toggle) ---
  function createGearMenu() {
    if (document.getElementById('tm-dark-gear')) return;

    // Gear container (gear icon)
    const gear = document.createElement('div');
    gear.id = 'tm-dark-gear';
    gear.innerHTML = '⚙️';
    Object.assign(gear.style, {
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '28px',
      cursor: 'pointer',
      zIndex: '999999',
      animation: 'tm-gear-spin 6s linear infinite',
      color: '#ff7a7a',
      userSelect: 'none',
      textShadow: '0 0 8px rgba(255, 122, 122, 0.8)'
    });

    // Menu box container
    const menu = document.createElement('div');
menu.id = 'tm-dark-menu';
Object.assign(menu.style, {
  position: 'fixed',
  right: '60px',
  top: '50%',
  transform: 'translateY(-50%) translateX(10px)',
  background: 'rgba(15,15,15,0.85)',
  backdropFilter: 'blur(24px)',          // <-- Changed from 12px to 24px
  WebkitBackdropFilter: 'blur(24px)',    // <-- Changed from 12px to 24px
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '14px 16px',
  display: 'none',
  flexDirection: 'column',
  gap: '10px',
  color: '#fff',
  fontFamily: 'Segoe UI, sans-serif',
  fontSize: '14px',
  boxShadow: '0 0 25px rgba(0,0,0,0.7), 0 0 6px rgba(255,122,122,0.25)',
  zIndex: '999999',
  minWidth: '320px',                    // <-- I also made the menu wider for the editor
  maxHeight: 'calc(100vh - 80px)',     // <-- added max height and scroll for usability
  overflowY: 'auto',
  opacity: '0',
  transition: 'opacity 0.4s ease, transform 0.4s ease'
});


    // Text color label + picker
    const label = document.createElement('div');
    label.textContent = 'Text color:';
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = GM_getValue('tm_text_color', '#e6e6e6');
    Object.assign(colorPicker.style, {
      width: '100%',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      outline: 'none'
    });

    // Feedback button
    const feedbackBtn = document.createElement('button');
    feedbackBtn.textContent = '💬 Give Feedback';
    Object.assign(feedbackBtn.style, {
      background: '#ff7a7a',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s, transform 0.2s'
    });
    feedbackBtn.onmouseenter = () => feedbackBtn.style.background = '#ff4d4d';
    feedbackBtn.onmouseleave = () => feedbackBtn.style.background = '#ff7a7a';
    feedbackBtn.onmousedown = () => feedbackBtn.style.transform = 'scale(0.96)';
    feedbackBtn.onmouseup = () => feedbackBtn.style.transform = 'scale(1)';
    feedbackBtn.onclick = () => window.open('https://github.com/trojaninfect/Pinterest-Dark-Mode/issues', '_blank');

    // Dev Mode Toggle Button inside menu
    const devToggleBtn = document.createElement('button');
    devToggleBtn.textContent = devModeEnabled ? '🧠 Developer Mode: ON' : '🧠 Developer Mode: OFF';
    Object.assign(devToggleBtn.style, {
      background: devModeEnabled ? '#7a33ff' : '#444',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s, transform 0.2s'
    });

    devToggleBtn.onmouseenter = () => {
      devToggleBtn.style.background = devModeEnabled ? '#9b63ff' : '#666';
    };
    devToggleBtn.onmouseleave = () => {
      devToggleBtn.style.background = devModeEnabled ? '#7a33ff' : '#444';
    };
    devToggleBtn.onmousedown = () => devToggleBtn.style.transform = 'scale(0.96)';
    devToggleBtn.onmouseup = () => devToggleBtn.style.transform = 'scale(1)';

    devToggleBtn.onclick = () => {
      devModeEnabled = !devModeEnabled;
      GM_setValue('tm_pinterest_dev_enabled', devModeEnabled);
      devToggleBtn.textContent = devModeEnabled ? '🧠 Developer Mode: ON' : '🧠 Developer Mode: OFF';
      devToggleBtn.style.background = devModeEnabled ? '#7a33ff' : '#444';

      if (devModeEnabled) {
        showAdvancedPanel();
      } else {
        removeAdvancedPanel();
      }
    };

    // Append normal settings to menu
    menu.appendChild(label);
    menu.appendChild(colorPicker);
    menu.appendChild(feedbackBtn);
    menu.appendChild(devToggleBtn);

    document.body.appendChild(gear);
    document.body.appendChild(menu);

    // Toggle animation + menu behavior
    let spinning = true;
    gear.addEventListener('click', () => {
      spinning = !spinning;
      gear.style.animation = spinning ? 'tm-gear-spin 6s linear infinite' : 'none';
      if (spinning) {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-50%) translateX(10px)';
        setTimeout(() => (menu.style.display = 'none'), 400);
        removeAdvancedPanel();
      } else {
        menu.style.display = 'flex';
        requestAnimationFrame(() => {
          menu.style.opacity = '1';
          menu.style.transform = 'translateY(-50%) translateX(0)';
        });

        // If dev mode is enabled, show advanced panel
        if (devModeEnabled) showAdvancedPanel();
      }
    });

    // Color picker input
    colorPicker.addEventListener('input', () => {
      const newColor = colorPicker.value;
      GM_setValue('tm_text_color', newColor);
      document.documentElement.style.setProperty('--tm-text-color', newColor);
      updateTextColor(newColor);
    });

    // Initialize dev mode panel if enabled
    if (devModeEnabled) {
      // If menu is open, show panel immediately
      if (menu.style.display === 'flex') {
        showAdvancedPanel();
      }
    }

    // CSS animation for gear
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tm-gear-spin {
        from { transform: translateY(-50%) rotate(0deg); }
        to { transform: translateY(-50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Load saved color
    const savedColor = GM_getValue('tm_text_color', '#e6e6e6');
    document.documentElement.style.setProperty('--tm-text-color', savedColor);
    updateTextColor(savedColor);
  }

  // Update text color dynamically inside darkCSS styles (placeholder)
  function updateTextColor(color) {
    // Optional: update relevant CSS variables or styles if needed
  }

  // Show the advanced panel inside the settings menu
  function showAdvancedPanel() {
    if (document.getElementById('tm-advanced-panel')) return;

    const menu = document.getElementById('tm-dark-menu');
    if (!menu) return;

    const panel = document.createElement('div');
    panel.id = 'tm-advanced-panel';
    panel.innerHTML = `
      <h3 style="margin:0 0 8px 0; font-weight:700; font-size:16px;">Developer Mode Panel</h3>
      <p style="font-size:13px; margin:0 0 10px 0;">Advanced debugging and options here.</p>

      <label for="tm-css-editor" style="font-weight:600; font-size:14px;">Live CSS Editor:</label>
      <textarea id="tm-css-editor" spellcheck="false" style="
        width: 100%;
        height: 260px;
        font-family: monospace;
        font-size: 12px;
        background: #111;
        color: #eee;
        border: 1px solid #555;
        border-radius: 6px;
        resize: vertical;
        padding: 8px;
        box-sizing: border-box;
        margin-bottom: 8px;
      ">${currentCSS.trim()}</textarea>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="tm-adv-save-css" style="
          background: #7a33ff;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        ">💾 Save CSS</button>
        <button id="tm-adv-reset-css" style="
          background: #444;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        ">♻️ Reset CSS</button>
        <button id="tm-adv-refresh-btn" style="
          background: #7a33ff;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        ">🔄 Refresh Styles</button>
      </div>
    `;

    Object.assign(panel.style, {
      borderTop: '1px solid rgba(255,255,255,0.15)',
      paddingTop: '12px',
      marginTop: '12px',
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      color: '#ddd',
      maxHeight: '350px',
      overflowY: 'auto',
    });

    menu.appendChild(panel);

    const cssEditor = panel.querySelector('#tm-css-editor');
    const saveBtn = panel.querySelector('#tm-adv-save-css');
    const resetBtn = panel.querySelector('#tm-adv-reset-css');
    const refreshBtn = panel.querySelector('#tm-adv-refresh-btn');

    // Live update style on input (debounced)
    let liveUpdateTimeout;
    cssEditor.addEventListener('input', () => {
      clearTimeout(liveUpdateTimeout);
      liveUpdateTimeout = setTimeout(() => {
        currentCSS = cssEditor.value;
        applyStyle(enabled);
      }, 300);
    });

    // Save CSS button
    saveBtn.onclick = () => {
      currentCSS = cssEditor.value;
      GM_setValue('tm_custom_dark_css', currentCSS);
      alert('Custom CSS saved!');
      applyStyle(enabled);
    };

    // Reset CSS button (to default)
    resetBtn.onclick = () => {
      if (confirm('Reset CSS to default? All unsaved changes will be lost.')) {
        currentCSS = defaultDarkCSS;
        GM_deleteValue('tm_custom_dark_css');
        cssEditor.value = currentCSS.trim();
        applyStyle(enabled);
      }
    };

    // Refresh styles button (reapply current CSS)
    refreshBtn.onclick = () => {
      applyStyle(enabled);
      alert('Styles refreshed!');
    };
  }

  // Remove advanced panel
  function removeAdvancedPanel() {
    const panel = document.getElementById('tm-advanced-panel');
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
  }

  // Create gear menu on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createGearMenu);
  } else {
    createGearMenu();
  }
})();

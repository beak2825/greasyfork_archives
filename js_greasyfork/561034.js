// ==UserScript==
// @name         Swift Client Style Menu (iPad Safari)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Swift-style heavy-blur centered menu for bloxd.io (Backquote ` to toggle, Shadow DOM, main menu + in-game)
// @author       NotNightmare + Copilot
// @match        https://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561034/Swift%20Client%20Style%20Menu%20%28iPad%20Safari%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561034/Swift%20Client%20Style%20Menu%20%28iPad%20Safari%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent double-injection
    if (window.__swiftMenuInjected) return;
    window.__swiftMenuInjected = true;

    // --------- Shadow DOM host ---------
    const host = document.createElement('div');
    host.id = 'swift-menu-host';
    host.style.position = 'fixed';
    host.style.inset = '0';
    host.style.zIndex = '999999'; // above game UI
    host.style.pointerEvents = 'none'; // enabled only when menu is open
    host.style.display = 'block';
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // --------- Shadow DOM structure ---------
    const overlay = document.createElement('div');
    overlay.id = 'swift-overlay';

    const panel = document.createElement('div');
    panel.id = 'swift-menu';

    panel.innerHTML = `
      <div id="swift-menu-inner">
        <div id="swift-sidebar">
          <div id="swift-logo">
            <div id="swift-logo-main">Swift Client</div>
            <div id="swift-logo-sub">bloxd.io</div>
          </div>
          <div class="swift-tab swift-active" data-tab="home">
            <span>Home</span>
          </div>
          <div class="swift-tab" data-tab="crosshair">
            <span>Crosshair</span>
          </div>
          <div class="swift-tab" data-tab="cosmetics">
            <span>Cosmetics</span>
          </div>
          <div class="swift-tab" data-tab="hotbar">
            <span>Hotbar</span>
          </div>
          <div class="swift-tab" data-tab="settings">
            <span>Settings</span>
          </div>
        </div>
        <div id="swift-content">
          <div id="swift-page-home" class="swift-page swift-active">
            <div class="swift-header">
              <div class="swift-title">Home</div>
              <div class="swift-subtitle">Swift-style menu overlay for bloxd.io</div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Client Info</div>
              <div class="swift-info-grid">
                <div class="swift-info-item">
                  <div class="swift-info-label">Name</div>
                  <div class="swift-info-value">Swift Client</div>
                </div>
                <div class="swift-info-item">
                  <div class="swift-info-label">Version</div>
                  <div class="swift-info-value">1.0 (Menu Only)</div>
                </div>
                <div class="swift-info-item">
                  <div class="swift-info-label">Environment</div>
                  <div class="swift-info-value">iPad Safari</div>
                </div>
                <div class="swift-info-item">
                  <div class="swift-info-label">Keybind</div>
                  <div class="swift-info-value">\` (Backquote)</div>
                </div>
              </div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Quick Toggles (visual)</div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Enable client menu</span>
                <label class="swift-switch">
                  <input type="checkbox" checked disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Block clicks behind menu</span>
                <label class="swift-switch">
                  <input type="checkbox" checked disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div id="swift-page-crosshair" class="swift-page">
            <div class="swift-header">
              <div class="swift-title">Crosshair</div>
              <div class="swift-subtitle">Visual controls for future crosshair logic.</div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Size</div>
              <div class="swift-slider-row">
                <span class="swift-slider-label">Crosshair size</span>
                <input id="swift-crosshair-size" type="range" min="10" max="60" value="30">
                <span id="swift-crosshair-size-value" class="swift-slider-value">30</span>
              </div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Effects</div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Pulse on hit</span>
                <label class="swift-switch">
                  <input type="checkbox" disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Breathing animation</span>
                <label class="swift-switch">
                  <input type="checkbox" disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div id="swift-page-cosmetics" class="swift-page">
            <div class="swift-header">
              <div class="swift-title">Cosmetics</div>
              <div class="swift-subtitle">Menu-only cosmetics for now.</div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Menu Look</div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Heavy dark blur</span>
                <label class="swift-switch">
                  <input type="checkbox" checked disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Swift accent gradient</span>
                <label class="swift-switch">
                  <input type="checkbox" checked disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div id="swift-page-hotbar" class="swift-page">
            <div class="swift-header">
              <div class="swift-title">Hotbar</div>
              <div class="swift-subtitle">Reserved for future in-game hotbar styling.</div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Themes</div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Swift red theme</span>
                <label class="swift-switch">
                  <input type="checkbox" disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Gold selected slot</span>
                <label class="swift-switch">
                  <input type="checkbox" disabled>
                  <span class="swift-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div id="swift-page-settings" class="swift-page">
            <div class="swift-header">
              <div class="swift-title">Settings</div>
              <div class="swift-subtitle">Menu behavior and basic options.</div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">Menu</div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Close when clicking overlay</span>
                <label class="swift-switch">
                  <input id="swift-close-on-overlay" type="checkbox" checked>
                  <span class="swift-slider"></span>
                </label>
              </div>
              <div class="swift-toggle-row">
                <span class="swift-toggle-label">Animate open/close</span>
                <label class="swift-switch">
                  <input id="swift-animate-toggle" type="checkbox" checked>
                  <span class="swift-slider"></span>
                </label>
              </div>
            </div>

            <div class="swift-section">
              <div class="swift-section-title">About</div>
              <div class="swift-about">
                This menu is a Swift-style overlay built for iPad Safari.
                Visual only; gameplay logic can be wired later.
              </div>
            </div>
          </div>

          <div id="swift-footer">
            Press <span class="swift-key">\`</span> to toggle the menu
          </div>
        </div>
      </div>
    `;

    shadow.appendChild(overlay);
    shadow.appendChild(panel);

    // --------- Styles in Shadow DOM ---------
    const style = document.createElement('style');
    style.textContent = `
      :host {
        all: initial;
      }

      #swift-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.18s ease-out;
      }

      #swift-menu {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 600px;
        height: 420px;
        transform: translate(-50%, -50%) scale(0.9);
        background: rgba(10, 10, 18, 0.78);
        border-radius: 16px;
        box-shadow: 0 18px 45px rgba(0,0,0,0.6);
        color: #ffffff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 0.18s ease-out,
          transform 0.18s ease-out;
      }

      #swift-menu.swift-open {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
        pointer-events: auto;
      }

      #swift-overlay.swift-open {
        opacity: 1;
        pointer-events: auto;
      }

      #swift-menu-inner {
        display: flex;
        width: 100%;
        height: 100%;
      }

      #swift-sidebar {
        width: 170px;
        padding: 14px 10px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(180deg, rgba(20,20,32,0.9), rgba(10,10,18,0.9));
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      #swift-logo {
        margin-bottom: 10px;
      }

      #swift-logo-main {
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.03em;
      }

      #swift-logo-sub {
        font-size: 11px;
        opacity: 0.6;
      }

      .swift-tab {
        padding: 8px 10px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        color: #d3d7e0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition:
          background 0.12s ease-out,
          color 0.12s ease-out,
          transform 0.08s ease-out;
      }

      .swift-tab span {
        pointer-events: none;
      }

      .swift-tab:hover {
        background: rgba(255,255,255,0.06);
        color: #ffffff;
        transform: translateY(-1px);
      }

      .swift-tab.swift-active {
        background: linear-gradient(135deg, #ff4b4b, #ffb347);
        color: #111;
        font-weight: 600;
      }

      #swift-content {
        flex: 1;
        padding: 14px 16px 10px 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }

      .swift-page {
        display: none;
        flex: 1;
        overflow: auto;
      }

      .swift-page.swift-active {
        display: block;
      }

      .swift-header {
        margin-bottom: 10px;
      }

      .swift-title {
        font-size: 18px;
        font-weight: 600;
      }

      .swift-subtitle {
        font-size: 12px;
        opacity: 0.7;
        margin-top: 2px;
      }

      .swift-section {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
      }

      .swift-section-title {
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 6px;
        opacity: 0.85;
      }

      .swift-info-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 12px;
      }

      .swift-info-item {
        font-size: 12px;
      }

      .swift-info-label {
        opacity: 0.6;
      }

      .swift-info-value {
        opacity: 0.95;
      }

      .swift-toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 4px 0;
        font-size: 12px;
      }

      .swift-toggle-label {
        margin-right: 10px;
        opacity: 0.9;
      }

      .swift-switch {
        position: relative;
        width: 40px;
        height: 20px;
      }

      .swift-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .swift-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: rgba(255,255,255,0.14);
        transition: 0.2s;
        border-radius: 999px;
      }

      .swift-slider:before {
        content: "";
        position: absolute;
        height: 14px;
        width: 14px;
        left: 3px;
        top: 3px;
        background-color: #ffffff;
        transition: 0.2s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }

      .swift-switch input:checked + .swift-slider {
        background: linear-gradient(135deg, #ff4b4b, #ffb347);
      }

      .swift-switch input:checked + .swift-slider:before {
        transform: translateX(18px);
      }

      .swift-slider-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 4px 0;
        font-size: 12px;
      }

      .swift-slider-label {
        opacity: 0.9;
      }

      .swift-slider-row input[type="range"] {
        width: 160px;
        accent-color: #ff6a4b;
      }

      .swift-slider-value {
        min-width: 28px;
        text-align: right;
        opacity: 0.8;
      }

      .swift-about {
        font-size: 12px;
        opacity: 0.8;
      }

      #swift-footer {
        font-size: 11px;
        opacity: 0.6;
        text-align: right;
        margin-top: 6px;
        border-top: 1px solid rgba(255,255,255,0.05);
        padding-top: 4px;
      }

      .swift-key {
        display: inline-block;
        padding: 1px 5px;
        border-radius: 4px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(255,255,255,0.06);
        font-family: "SF Mono", ui-monospace, Menlo, monospace;
        font-size: 10px;
      }

      /* Basic scroll styling inside content */
      .swift-page::-webkit-scrollbar {
        width: 6px;
      }
      .swift-page::-webkit-scrollbar-track {
        background: transparent;
      }
      .swift-page::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.15);
        border-radius: 3px;
      }
    `;
    shadow.appendChild(style);

    // --------- State & behavior ---------
    let menuOpen = false;

    function setMenuOpen(open) {
      menuOpen = open;
      if (open) {
        host.style.pointerEvents = 'auto';
        overlay.classList.add('swift-open');
        panel.classList.add('swift-open');
      } else {
        overlay.classList.remove('swift-open');
        panel.classList.remove('swift-open');
        // Wait for animation
        setTimeout(() => {
          if (!menuOpen) {
            host.style.pointerEvents = 'none';
          }
        }, 190);
      }
    }

    function toggleMenu() {
      setMenuOpen(!menuOpen);
    }

    // Tabs
    const tabs = Array.from(panel.querySelectorAll('.swift-tab'));
    const pages = {
      home: panel.querySelector('#swift-page-home'),
      crosshair: panel.querySelector('#swift-page-crosshair'),
      cosmetics: panel.querySelector('#swift-page-cosmetics'),
      hotbar: panel.querySelector('#swift-page-hotbar'),
      settings: panel.querySelector('#swift-page-settings'),
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('swift-active'));
        Object.values(pages).forEach(p => p.classList.remove('swift-active'));
        tab.classList.add('swift-active');
        if (pages[target]) pages[target].classList.add('swift-active');
      });
    });

    // Overlay close behavior
    const closeOnOverlay = panel.querySelector('#swift-close-on-overlay');
    overlay.addEventListener('click', () => {
      if (!closeOnOverlay || closeOnOverlay.checked) {
        setMenuOpen(false);
      }
    });

    // Crosshair size display (visual only)
    const sizeSlider = panel.querySelector('#swift-crosshair-size');
    const sizeValue = panel.querySelector('#swift-crosshair-size-value');
    if (sizeSlider && sizeValue) {
      sizeSlider.addEventListener('input', () => {
        sizeValue.textContent = sizeSlider.value;
      });
    }

    // --------- Keybind: Backquote (`) ---------
    // Hybrid load: listener is active immediately, but it only toggles this overlay,
    // which is safe even if game UI isn't ready yet.
    document.addEventListener('keydown', (e) => {
      // iPad Safari often only exposes e.key === "`"
      if (e.key === '`' || e.code === 'Backquote') {
        // Avoid toggling while typing in inputs
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
          return;
        }
        e.preventDefault();
        toggleMenu();
      }
    }, true);

    // No game DOM hooking here = no "Something bad happen on join"
    // Menu is independent, safe on main menu and in-game.

})();

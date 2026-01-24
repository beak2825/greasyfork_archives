// ==UserScript==
// @name         Null Client
// @namespace    null.client
// @version      1.2
// @match        https://bloxd.io/*
// @match        https://staging.bloxd.io/*
// @match        https://www.bloxdforge.com/studio/play/*
// @match        https://www.crazygames.com/game/bloxdhop-io/*
// @description  Null Client — #1 Best Bloxd.io Client! 100+ Installs! v1.2 Launched!
// @author       Nullscape
// @icon         https://i.postimg.cc/xjzYxS0R/Null-Client.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561920/Null%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/561920/Null%20Client.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "null_client_v1.2_state";
  const DEFAULT_STATE = {
    version: "1.2",
    keystrokes: false,
    keystrokeMode: "wasd",
    cps: false,
    ping: false,
    armor: false,
    fps_display: false,
    coords: false,
    speedometer: false,
    cape: null,
    customCapes: [],
    locked: true,
    positions: {
      keystrokes: { bottom: 18, left: 18 },
      cps: { bottom: 66, left: 18 },
      ping: { bottom: 98, left: 18 },
      armor: { top: 18, right: 18 },
      fps_display: { top: 18, left: 18 },
      coords: { top: 50, left: 18 },
      speedometer: { top: 82, left: 18 },
      capeOverlay: { top: 54, right: 40 }
    },
    texture: "",
    fps: {
      scale: 1,
      pauseAnimations: false,
      removeBackgrounds: false
    },
    armorImage: null,
    keystrokeColors: {
      active: "#1f6feb",
      inactive: "#0c0d0e",
      text: "#ffffff",
      textInactive: "#cfe7ff"
    },
    zoom: 100,
    fov: 90,
    fullbright: false,
    noFire: false,
    noPumpkinBlur: false,
    lowFire: false,
    smoothZoom: false,
    noAds: true
  };

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      const parsed = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  // Remove advertisements
  function removeAds() {
    const adSelectors = [
      'iframe[src*="ads"]',
      'div[class*="ad-"]',
      'div[id*="ad-"]',
      'div[class*="advertisement"]',
      'div[id*="advertisement"]',
      '.afs_ads',
      '[data-ad-slot]',
      'ins.adsbygoogle',
      'div[class*="sponsor"]',
      'div[id*="sponsor"]'
    ];

    const style = document.createElement('style');
    style.textContent = adSelectors.join(',') + ' { display: none !important; visibility: hidden !important; }';
    (document.head || document.documentElement).appendChild(style);

    const observer = new MutationObserver(() => {
      adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none';
          el.remove();
        });
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Replace Bloxd branding with Null Client
  function replaceBranding() {
    const observer = new MutationObserver(() => {
      // Replace logo images
      document.querySelectorAll('img[src*="bloxd"], img[alt*="bloxd"], img[alt*="Bloxd"]').forEach(img => {
        img.src = 'https://i.postimg.cc/xjzYxS0R/Null-Client.png';
        img.alt = 'Null Client';
      });

      // Replace text
      document.querySelectorAll('h1, h2, .logo, [class*="logo"]').forEach(el => {
        if (el.textContent.toLowerCase().includes('bloxd')) {
          el.textContent = el.textContent.replace(/bloxd/gi, 'Null Client');
        }
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Custom loading screen
  function replaceLoadingScreen() {
    const style = document.createElement('style');
    style.textContent = `
      .loading-screen, [class*="loading"], [id*="loading"] {
        background: url('https://i.postimg.cc/ZnX3Fd5Y/68686868.png') center/cover no-repeat !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('.loading-screen, [class*="loading"], [id*="loading"]').forEach(el => {
        el.style.background = "url('https://i.postimg.cc/ZnX3Fd5Y/68686868.png') center/cover no-repeat";
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Smooth Zoom Implementation
  let currentZoom = 1;
  let targetZoom = 1;
  let isZooming = false;

  function smoothZoom() {
    if (!state.smoothZoom) return;

    const zoomSpeed = 0.15;
    const diff = targetZoom - currentZoom;

    if (Math.abs(diff) > 0.001) {
      currentZoom += diff * zoomSpeed;
      applyZoomToCamera(currentZoom);
      requestAnimationFrame(smoothZoom);
    } else {
      currentZoom = targetZoom;
      isZooming = false;
    }
  }

  function applyZoomToCamera(zoom) {
    try {
      const fov = 90 / zoom;
      if (window.camera && window.camera.fov !== undefined) {
        window.camera.fov = fov;
        if (window.camera.updateProjectionMatrix) {
          window.camera.updateProjectionMatrix();
        }
      } else if (window.game && window.game.camera) {
        window.game.camera.fov = fov;
        if (window.game.camera.updateProjectionMatrix) {
          window.game.camera.updateProjectionMatrix();
        }
      }
    } catch (e) {}
  }

  document.addEventListener('keydown', (e) => {
    if (!state.smoothZoom) return;

    if (e.code === 'KeyZ') {
      targetZoom = 2;
      if (!isZooming) {
        isZooming = true;
        smoothZoom();
      }
    } else if (e.code === 'KeyX') {
      targetZoom = 0.5;
      if (!isZooming) {
        isZooming = true;
        smoothZoom();
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    if (!state.smoothZoom) return;

    if (e.code === 'KeyZ' || e.code === 'KeyX') {
      targetZoom = 1;
      if (!isZooming) {
        isZooming = true;
        smoothZoom();
      }
    }
  });

  let uiRoot = null;
  let uiOpen = false;

  document.addEventListener("keydown", e => {
    if (e.code === "ShiftRight") {
      e.preventDefault();
      uiOpen = !uiOpen;
      if (uiOpen) showUI();
      else hideUI();
    }
  });

  function showUI() {
    if (!uiRoot) createUI();
    uiRoot.style.display = "block";
  }

  function hideUI() {
    if (uiRoot) uiRoot.style.display = "none";
  }

  let createUICalled = false;

  function createUI() {
    if (createUICalled) return;
    createUICalled = true;
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", createUI, { once: true });
      return;
    }

    uiRoot = document.createElement("div");
    uiRoot.style.cssText = "position:fixed; inset:0; z-index:2147483646; display:none; backdrop-filter: blur(2px);";
    document.body.appendChild(uiRoot);

    const shadow = uiRoot.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 0; }

        .frame {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 580px;
          background: linear-gradient(135deg, #0f1113 0%, #0b0c0d 100%);
          border-radius: 16px;
          display: flex;
          color: #e7eef6;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05);
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .sidebar {
          width: 190px;
          background: linear-gradient(180deg, #0b0c0d 0%, #08090a 100%);
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-right: 1px solid rgba(255,255,255,0.03);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .logo img {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .brand {
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #fff 0%, #a0b5c9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .version {
          font-size: 11px;
          color: #6b7680;
        }

        .nav {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav button {
          background: transparent;
          border: 1px solid transparent;
          color: #9ca8b3;
          text-align: left;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .nav button:hover {
          background: rgba(255,255,255,0.03);
          color: #d4dfe8;
        }

        .nav button.active {
          background: linear-gradient(135deg, #1a1d20 0%, #141618 100%);
          border-color: rgba(255,255,255,0.06);
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .nav .spacer {
          flex: 1;
          min-height: 20px;
        }

        .main {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .main::-webkit-scrollbar {
          width: 8px;
        }

        .main::-webkit-scrollbar-track {
          background: transparent;
        }

        .main::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .title {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 0.3px;
        }

        .subtitle {
          color: #7d8b98;
          font-size: 13px;
          margin-top: 2px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .card {
          background: linear-gradient(135deg, #0e1012 0%, #0a0b0c 100%);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.04);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          transition: all 0.2s ease;
        }

        .card:hover {
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }

        .card-title {
          font-weight: 700;
          margin-bottom: 6px;
          font-size: 14px;
          color: #e8f1f9;
        }

        .card-desc {
          color: #8793a0;
          font-size: 12px;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #0a0b0c 0%, #08090a 100%);
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .toggle-row .label {
          font-size: 13px;
          color: #d4e1ed;
          font-weight: 500;
        }

        .switch {
          width: 48px;
          height: 26px;
          border-radius: 13px;
          background: #1a1d20;
          position: relative;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s ease;
        }

        .switch:hover {
          border-color: rgba(255,255,255,0.1);
        }

        .switch.on {
          background: linear-gradient(90deg, #2b9aff 0%, #1fb1ff 100%);
          box-shadow: 0 0 12px rgba(43,154,255,0.4);
        }

        .knob {
          width: 22px;
          height: 22px;
          border-radius: 11px;
          background: #fff;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .switch.on .knob {
          left: 24px;
        }

        .small {
          font-size: 12px;
          color: #8a96a3;
        }

        .footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #7d8b98;
          font-size: 12px;
        }

        .btn {
          padding: 8px 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1c1f22 0%, #181b1d 100%);
          border: 1px solid rgba(255,255,255,0.06);
          color: #e7eef6;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .btn:hover {
          background: linear-gradient(135deg, #242729 0%, #1f2224 100%);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn-primary {
          background: linear-gradient(135deg, #2b9aff 0%, #1fb1ff 100%);
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 4px 12px rgba(43,154,255,0.25);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #3da8ff 0%, #2fbdff 100%);
          box-shadow: 0 6px 16px rgba(43,154,255,0.35);
        }

        .color-picker {
          width: 44px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.15);
          transition: all 0.2s ease;
        }

        .color-picker:hover {
          border-color: rgba(255,255,255,0.3);
          transform: scale(1.05);
        }

        input[type="color"] {
          opacity: 0;
          position: absolute;
          width: 0;
          height: 0;
        }

        input[type="text"],
        input[type="url"],
        input[type="number"],
        select {
          padding: 8px 12px;
          border-radius: 8px;
          background: #0a0b0c;
          color: #dfe8ef;
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 13px;
          transition: all 0.2s ease;
        }

        input[type="text"]:focus,
        input[type="url"]:focus,
        input[type="number"]:focus,
        select:focus {
          outline: none;
          border-color: #2b9aff;
          box-shadow: 0 0 0 3px rgba(43,154,255,0.1);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          margin: 12px 0;
        }

        .feature-group {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .feature-group-title {
          font-size: 12px;
          color: #7d8b98;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .slider-container {
          margin-top: 10px;
        }

        .slider {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #1a1d20;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2b9aff 0%, #1fb1ff 100%);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(43,154,255,0.4);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2b9aff 0%, #1fb1ff 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(43,154,255,0.4);
        }
      </style>

      <div class="frame" id="frame">
        <div class="sidebar">
          <div class="logo">
            <img src="https://i.postimg.cc/xjzYxS0R/Null-Client.png" alt="logo">
            <div>
              <div class="brand">Null Client</div>
              <div class="version">v1.2</div>
            </div>
          </div>
          <div class="nav" id="nav">
            <button data-tab="player" class="active">🎮Player</button>
            <button data-tab="accessories">✨Accessories</button>
            <button data-tab="visual">🎨Visual</button>
            <button data-tab="extra">⚡Extra Client Features</button>
            <button data-tab="combat">⚔️Combat</button>
            <div class="spacer"></div>
            <button data-tab="settings">⚙️Settings</button>
            <button id="closeBtn">❌Exit</button>
          </div>
        </div>

        <div class="main">
          <div class="header">
            <div>
              <div class="title" id="mainTitle">Player Widgets</div>
              <div class="subtitle" id="mainSub">Client-side overlays and HUD elements</div>
            </div>
            <div>
              <button class="btn" id="lockToggle">🔒Locked</button>
            </div>
          </div>

          <div class="grid" id="gridArea"></div>

          <div class="footer">
            <div>Press <strong>Right Shift</strong> to toggle menu</div>
            <div class="small">All features are client-side only • Made by Nullscape</div>
          </div>
        </div>
      </div>
    `;

    const lockBtn = shadow.getElementById("lockToggle");
    lockBtn.textContent = state.locked ? "🔒Locked" : "🔓Unlocked";
    lockBtn.onclick = () => {
      state.locked = !state.locked;
      lockBtn.textContent = state.locked ? "🔒Locked" : "🔓Unlocked";
      saveState();
      updateLockState();
      showToast(state.locked ? "Widgets locked" : "Widgets unlocked - drag to reposition");
    };

    const nav = shadow.getElementById("nav");
    nav.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.id === "closeBtn") {
        uiOpen = false;
        hideUI();
        return;
      }
      for (const b of nav.querySelectorAll("button")) b.classList.remove("active");
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      const title = shadow.getElementById("mainTitle");
      const sub = shadow.getElementById("mainSub");
      const grid = shadow.getElementById("gridArea");
      grid.innerHTML = "";

      if (tab === "player") {
        title.textContent = "Player Widgets";
        sub.textContent = "Keystrokes, CPS, Ping, Armor, FPS, Coords & Speed";
        renderPlayerGrid(grid);
      } else if (tab === "accessories") {
        title.textContent = "Accessories";
        sub.textContent = "Client capes with realistic physics";
        renderAccessoriesGrid(grid);
      } else if (tab === "visual") {
        title.textContent = "Visual Enhancements";
        sub.textContent = "Texture packs, FPS boost & rendering options";
        renderVisualGrid(grid);
      } else if (tab === "extra") {
        title.textContent = "Extra Client Features";
        sub.textContent = "Advanced Bloxd.io enhancements";
        renderExtraGrid(grid);
      } else if (tab === "combat") {
        title.textContent = "Combat";
        sub.textContent = "Cosmetic combat tools (no cheats)";
        renderCombatGrid(grid);
      } else if (tab === "settings") {
        title.textContent = "Settings";
        sub.textContent = "Persistence, widget management & reset";
        renderSettingsGrid(grid);
      }
    });

    const initialGrid = shadow.getElementById("gridArea");
    renderPlayerGrid(initialGrid);
  }

  function makeToggleCard(title, desc, stateKey, onChange) {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card-title">${title}</div>
      <div class="card-desc">${desc}</div>
      <div class="toggle-row">
        <div class="label small">Enable</div>
        <div class="switch ${state[stateKey] ? "on" : ""}" data-key="${stateKey}">
          <div class="knob"></div>
        </div>
      </div>
    `;
    const sw = el.querySelector(".switch");
    sw.addEventListener("click", () => {
      const key = sw.dataset.key;
      state[key] = !state[key];
      saveState();
      sw.classList.toggle("on", !!state[key]);
      if (typeof onChange === "function") onChange(state[key]);

      if (key === "keystrokes") toggleKeystrokes(state[key]);
      if (key === "cps") toggleCPS(state[key]);
      if (key === "ping") togglePing(state[key]);
      if (key === "armor") toggleArmor(state[key]);
      if (key === "fps_display") toggleFPSDisplay(state[key]);
      if (key === "coords") toggleCoords(state[key]);
      if (key === "speedometer") toggleSpeedometer(state[key]);
      if (key === "fullbright") applyFullbright(state[key]);
      if (key === "noFire") applyNoFire(state[key]);
      if (key === "noPumpkinBlur") applyNoPumpkinBlur(state[key]);
      if (key === "lowFire") applyLowFire(state[key]);
      if (key === "smoothZoom") {
        if (state[key]) {
          showToast("Smooth Zoom enabled - Press Z/X to zoom");
        } else {
          showToast("Smooth Zoom disabled");
          currentZoom = 1;
          targetZoom = 1;
          applyZoomToCamera(1);
        }
      }
    });
    return el;
  }

  function renderPlayerGrid(container) {
    container.appendChild(makeToggleCard(
      "CPS Counter",
      "Counts left and right mouse clicks per second (Format: L | R)",
      "cps"
    ));

    container.appendChild(makeToggleCard(
      "Ping Display",
      "Shows your estimated network latency in milliseconds",
      "ping"
    ));

    container.appendChild(makeToggleCard(
      "FPS Counter",
      "Real-time frames per second display",
      "fps_display"
    ));

    container.appendChild(makeToggleCard(
      "Coordinates",
      "Shows your current X, Y, Z position in the world",
      "coords"
    ));

    container.appendChild(makeToggleCard(
      "Speedometer",
      "Displays your current movement speed (blocks/sec)",
      "speedometer"
    ));

    const ksCard = makeToggleCard(
      "Keystrokes Display",
      "Shows keyboard input with customizable colors and modes",
      "keystrokes"
    );

    const ksExtras = document.createElement("div");
    ksExtras.className = "feature-group";
    ksExtras.innerHTML = `
      <div class="feature-group-title">Keystroke Mode</div>
      <select id="ks-mode" style="width:100%; margin-bottom:10px;">
        <option value="wasd" ${state.keystrokeMode === "wasd" ? "selected" : ""}>WASD Keys</option>
        <option value="arrows" ${state.keystrokeMode === "arrows" ? "selected" : ""}>Arrow Keys</option>
      </select>
      <div class="feature-group-title">Color Customization</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px;">
        <div>
          <label class="small" style="display:block; margin-bottom:4px;">Active Color</label>
          <div class="color-picker" style="background:${state.keystrokeColors.active};" id="ks-active"></div>
        </div>
        <div>
          <label class="small" style="display:block; margin-bottom:4px;">Inactive Color</label>
          <div class="color-picker" style="background:${state.keystrokeColors.inactive};" id="ks-inactive"></div>
        </div>
      </div>
    `;
    ksCard.appendChild(ksExtras);

    ksCard.querySelector("#ks-mode").onchange = (e) => {
      state.keystrokeMode = e.target.value;
      saveState();
      if (keyUI) {
        toggleKeystrokes(false);
        toggleKeystrokes(true);
      }
      showToast(`Keystroke mode: ${e.target.value.toUpperCase()}`);
    };

    ksCard.querySelector("#ks-active").onclick = () => {
      const input = document.createElement("input");
      input.type = "color";
      input.value = state.keystrokeColors.active;
      input.onchange = (e) => {
        state.keystrokeColors.active = e.target.value;
        saveState();
        ksCard.querySelector("#ks-active").style.background = e.target.value;
        refreshKeyUI();
      };
      input.click();
    };

    ksCard.querySelector("#ks-inactive").onclick = () => {
      const input = document.createElement("input");
      input.type = "color";
      input.value = state.keystrokeColors.inactive;
      input.onchange = (e) => {
        state.keystrokeColors.inactive = e.target.value;
        saveState();
        ksCard.querySelector("#ks-inactive").style.background = e.target.value;
        refreshKeyUI();
      };
      input.click();
    };

    container.appendChild(ksCard);

    container.appendChild(makeToggleCard(
      "Armor Display",
      "Shows your current armor equipment (syncs with game state)",
      "armor"
    ));
  }

  function renderAccessoriesGrid(container) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.gridColumn = "1 / -1";
    card.innerHTML = `
      <div class="card-title">🎭Client Capes with Physics</div>
      <div class="card-desc">Only you can see these capes • Now with realistic Optifine-style physics!</div>

      <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
        <button id="cape-none" class="btn">No Cape</button>
        <button id="cape-gray" class="btn">Gray Cape</button>
        <button id="cape-dark" class="btn">Dark Cape</button>
        <button id="cape-rainbow" class="btn">Rainbow Cape</button>
      </div>

      <div class="divider"></div>

      <div class="feature-group-title">Add Custom Cape</div>
      <div style="display:grid; grid-template-columns:1fr auto; gap:8px; margin-top:8px;">
        <input id="capeUrl" type="url" placeholder="Paste image URL here..." style="width:100%;">
        <button id="addUrl" class="btn btn-primary">Add URL</button>
      </div>

      <div style="margin-top:8px;">
        <input id="capeFile" type="file" accept="image/*" style="color:#dfe8ef; font-size:12px;">
        <button id="addFile" class="btn" style="margin-top:6px;">Upload Image</button>
      </div>

      <div class="divider"></div>

      <div class="feature-group-title">Your Custom Capes</div>
      <div id="customCapesList" style="max-height:150px; overflow-y:auto; margin-top:8px;"></div>
    `;
    container.appendChild(card);

    function updateList() {
      const list = card.querySelector("#customCapesList");
      list.innerHTML = "";
      if (!state.customCapes || state.customCapes.length === 0) {
        const p = document.createElement("div");
        p.className = "small";
        p.textContent = "No custom capes added yet.";
        p.style.padding = "12px";
        p.style.textAlign = "center";
        p.style.color = "#6b7680";
        list.appendChild(p);
        return;
      }
      state.customCapes.forEach((c, i) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.marginBottom = "8px";
        row.style.padding = "8px";
        row.style.background = "rgba(255,255,255,0.02)";
        row.style.borderRadius = "8px";

        const thumb = document.createElement("div");
        thumb.style.width = "80px";
        thumb.style.height = "50px";
        thumb.style.background = c.dataUrl ? `url(${c.dataUrl}) center/cover no-repeat` : "#0f0f0f";
        thumb.style.borderRadius = "6px";
        thumb.style.border = "1px solid rgba(255,255,255,0.1)";

        const name = document.createElement("div");
        name.textContent = c.name || ("Custom Cape " + (i + 1));
        name.style.color = "#dfe8ef";
        name.style.flex = "1";
        name.style.fontSize = "13px";

        const sel = document.createElement("button");
        sel.textContent = "Select";
        sel.className = "btn";
        sel.style.fontSize = "12px";
        sel.onclick = () => {
          state.cape = "custom:" + i;
          saveState();
          applyCape(state.cape);
          showToast("Custom cape selected!");
        };

        const rem = document.createElement("button");
        rem.textContent = "Remove";
        rem.className = "btn";
        rem.style.fontSize = "12px";
        rem.onclick = () => {
          if (!confirm("Remove this custom cape?")) return;
          state.customCapes.splice(i, 1);
          if ((state.cape || "").startsWith("custom:")) {
            const cur = parseInt(state.cape.split(":")[1], 10);
            if (cur === i) state.cape = null;
            else if (cur > i) state.cape = "custom:" + (cur - 1);
          }
          saveState();
          updateList();
          applyCape(state.cape);
        };

        row.appendChild(thumb);
        row.appendChild(name);
        row.appendChild(sel);
        row.appendChild(rem);
        list.appendChild(row);
      });
    }

    card.querySelector("#cape-none").onclick = () => {
      state.cape = null;
      saveState();
      applyCape(null);
      showToast("Cape disabled");
    };
    card.querySelector("#cape-gray").onclick = () => {
      state.cape = "gray";
      saveState();
      applyCape("gray");
      showToast("Gray cape enabled");
    };
    card.querySelector("#cape-dark").onclick = () => {
      state.cape = "dark";
      saveState();
      applyCape("dark");
      showToast("Dark cape enabled");
    };
    card.querySelector("#cape-rainbow").onclick = () => {
      state.cape = "rainbow";
      saveState();
      applyCape("rainbow");
      showToast("Rainbow cape enabled");
    };

    card.querySelector("#addUrl").onclick = () => {
      const url = (card.querySelector("#capeUrl").value || "").trim();
      if (!url) {
        alert("Please paste an image URL.");
        return;
      }
      state.customCapes.push({
        name: url.split("/").pop() || "custom",
        dataUrl: url
      });
      saveState();
      updateList();
      showToast("Custom cape added!");
      card.querySelector("#capeUrl").value = "";
    };

    card.querySelector("#addFile").onclick = () => {
      const f = card.querySelector("#capeFile").files[0];
      if (!f) {
        alert("Choose a file first.");
        return;
      }
      const r = new FileReader();
      r.onload = () => {
        state.customCapes.push({
          name: f.name,
          dataUrl: r.result
        });
        saveState();
        updateList();
        showToast("Custom cape uploaded!");
      };
      r.readAsDataURL(f);
    };

    updateList();
  }

  function renderVisualGrid(container) {
    const textureCard = document.createElement("div");
    textureCard.className = "card";
    textureCard.innerHTML = `
      <div class="card-title">🎨Texture Pack</div>
      <div class="card-desc">Client-side visual filters for different aesthetics</div>
      <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
        <button id="texReset" class="btn">Reset</button>
        <button id="texMono" class="btn">Monochrome</button>
        <button id="texHigh" class="btn">High Contrast</button>
      </div>
    `;
    container.appendChild(textureCard);

    textureCard.querySelector("#texReset").onclick = () => {
      state.texture = "";
      applyTexture("");
      saveState();
      showToast("Texture reset");
    };
    textureCard.querySelector("#texMono").onclick = () => {
      state.texture = "mono";
      applyTexture("mono");
      saveState();
      showToast("Monochrome texture applied");
    };
    textureCard.querySelector("#texHigh").onclick = () => {
      state.texture = "highcontrast";
      applyTexture("highcontrast");
      saveState();
      showToast("High contrast texture applied");
    };

    const fpsCard = document.createElement("div");
    fpsCard.className = "card";
    fpsCard.innerHTML = `
      <div class="card-title">⚡ FPS Boost</div>
      <div class="card-desc">Optimize rendering for better performance</div>
      <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
        <button id="fpsReset" class="btn">Reset (1.0x)</button>
        <button id="fps075" class="btn">Scale 0.75x</button>
        <button id="fps05" class="btn">Scale 0.5x</button>
      </div>
      <div class="feature-group">
        <label class="small" style="display:block; margin-bottom:6px;">
          <input id="fpsPause" type="checkbox" style="margin-right:6px;">
          Pause CSS animations
        </label>
        <label class="small" style="display:block;">
          <input id="fpsBg" type="checkbox" style="margin-right:6px;">
          Remove background images
        </label>
      </div>
    `;
    container.appendChild(fpsCard);

    fpsCard.querySelector("#fps075").onclick = () => {
      state.fps.scale = 0.75;
      applyFPSState();
      saveState();
      showToast("Canvas scaled to 0.75x");
    };
    fpsCard.querySelector("#fps05").onclick = () => {
      state.fps.scale = 0.5;
      applyFPSState();
      saveState();
      showToast("Canvas scaled to 0.5x");
    };
    fpsCard.querySelector("#fpsReset").onclick = () => {
      state.fps.scale = 1;
      state.fps.pauseAnimations = false;
      state.fps.removeBackgrounds = false;
      fpsCard.querySelector("#fpsPause").checked = false;
      fpsCard.querySelector("#fpsBg").checked = false;
      applyFPSState();
      saveState();
      showToast("FPS settings reset");
    };

    fpsCard.querySelector("#fpsPause").checked = !!state.fps.pauseAnimations;
    fpsCard.querySelector("#fpsBg").checked = !!state.fps.removeBackgrounds;
    fpsCard.querySelector("#fpsPause").onchange = (e) => {
      state.fps.pauseAnimations = e.target.checked;
      applyFPSState();
      saveState();
    };
    fpsCard.querySelector("#fpsBg").onchange = (e) => {
      state.fps.removeBackgrounds = e.target.checked;
      applyFPSState();
      saveState();
    };
  }

  function renderExtraGrid(container) {
    container.appendChild(makeToggleCard(
      "💡Fullbright",
      "Maximum brightness - see everything clearly in dark areas",
      "fullbright"
    ));

    container.appendChild(makeToggleCard(
      "🔥No Fire Overlay",
      "Removes fire overlay when burning for better visibility",
      "noFire"
    ));

    container.appendChild(makeToggleCard(
      "🔻Low Fire",
      "Lowers fire overlay height for improved view",
      "lowFire"
    ));

    container.appendChild(makeToggleCard(
      "🎃No Pumpkin Blur",
      "Removes pumpkin helmet overlay blur effect",
      "noPumpkinBlur"
    ));

    container.appendChild(makeToggleCard(
      "🔍Smooth Zoom",
      "Smooth zoom in/out with Z and X keys for better gameplay",
      "smoothZoom"
    ));

    const zoomCard = document.createElement("div");
    zoomCard.className = "card";
    zoomCard.innerHTML = `
      <div class="card-title">🎯FOV Adjuster</div>
      <div class="card-desc">Customize your field of view (30° - 110°)</div>
      <div class="slider-container">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span class="small">FOV:</span>
          <span class="small" id="fovValue">${state.fov}°</span>
        </div>
        <input type="range" min="30" max="110" value="${state.fov}" class="slider" id="fovSlider">
      </div>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button id="fovDefault" class="btn">Default (90°)</button>
        <button id="fovZoom" class="btn">Wide (110°)</button>
      </div>
    `;
    container.appendChild(zoomCard);

    const fovSlider = zoomCard.querySelector("#fovSlider");
    const fovValue = zoomCard.querySelector("#fovValue");

    fovSlider.oninput = (e) => {
      const val = parseInt(e.target.value);
      fovValue.textContent = val + "°";
      state.fov = val;
      applyFOV(val);
      saveState();
    };

    zoomCard.querySelector("#fovDefault").onclick = () => {
      state.fov = 90;
      fovSlider.value = 90;
      fovValue.textContent = "90°";
      applyFOV(90);
      saveState();
      showToast("FOV reset to 90°");
    };

    zoomCard.querySelector("#fovZoom").onclick = () => {
      state.fov = 110;
      fovSlider.value = 110;
      fovValue.textContent = "110°";
      applyFOV(110);
      saveState();
      showToast("Wide FOV activated (110°)");
    };
  }

  function renderCombatGrid(container) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-title">⚔️ Combat (Cosmetic Only)</div>
      <div class="card-desc">These features are purely visual and do not provide gameplay advantages.</div>
      <div style="margin-top:12px;">
        <div class="toggle-row">
          <div class="label small">Local target outline</div>
          <div class="switch" data-key="outline"><div class="knob"></div></div>
        </div>
        <div style="height:10px"></div>
        <div class="toggle-row">
          <div class="label small">Local auto-hotbar visuals</div>
          <div class="switch" data-key="hotbar"><div class="knob"></div></div>
        </div>
      </div>
      <div style="margin-top:12px; padding:10px; background:rgba(255,200,100,0.05); border-radius:8px; border:1px solid rgba(255,200,100,0.1);">
        <div class="small" style="color:#ffc864;">⚠️Note: These are cosmetic-only features that do not affect actual gameplay or give any competitive advantage.</div>
      </div>
    `;
    container.appendChild(card);

    card.querySelectorAll(".switch").forEach(s => {
      s.addEventListener("click", () => {
        s.classList.toggle("on");
        showToast("This is cosmetic-only");
      });
    });
  }

  function renderSettingsGrid(container) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.gridColumn = "1 / -1";
    card.innerHTML = `
      <div class="card-title">⚙️Client Settings</div>
      <div class="card-desc">Manage your Null Client configuration</div>

      <div class="feature-group">
        <div class="feature-group-title">Widget Management</div>
        <div style="padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; margin-top:8px;">
          <div class="small" style="margin-bottom:8px;">
            • Click the <strong>🔒 Lock/Unlock</strong> button in the header to enable widget dragging<br>
            • When unlocked, drag widgets to reposition them<br>
            • Single-click any widget to toggle it on/off<br>
            • All positions are automatically saved
          </div>
        </div>
      </div>

      <div class="feature-group">
        <div class="feature-group-title">Reset Options</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button id="resetPositions" class="btn">Reset Widget Positions</button>
          <button id="resetAll" class="btn" style="background:linear-gradient(135deg,#ff4444,#cc0000); border-color:rgba(255,255,255,0.1);">Reset All Settings</button>
        </div>
      </div>

      <div class="feature-group">
        <div class="feature-group-title">About</div>
        <div style="padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; margin-top:8px;">
          <div class="small">
            <strong>Null Client v1.2</strong><br>
            Created by Nullscape<br><br>
            Features:<br>
            • 10+ HUD widgets with full customization<br>
            • Capes with realistic physics<br>
            • Smooth zoom & FOV control<br>
            • Ad-free experience<br>
            • FPS optimization tools<br>
            • All features are client-side only<br><br>
            Compatible with Tampermonkey 5.4.1 and latest Bloxd.io version
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);

    card.querySelector("#resetPositions").onclick = () => {
      if (!confirm("Reset all widget positions to default?")) return;
      state.positions = JSON.parse(JSON.stringify(DEFAULT_STATE.positions));
      saveState();
      showToast("Widget positions reset");
      setTimeout(() => location.reload(), 1000);
    };

    card.querySelector("#resetAll").onclick = () => {
      if (!confirm("⚠️Reset ALL Null Client settings?\n\nThis will:\n• Remove all custom capes\n• Reset widget positions\n• Reset all preferences\n• Clear all saved data\n\nThis cannot be undone!")) return;
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      showToast("Settings reset - reloading...");
      setTimeout(() => location.reload(), 1000);
    };
  }

  // Widget implementations (keystrokes, CPS, ping, etc.)
  let keyUI = null;
  const keyState = { key1: false, key2: false, key3: false, key4: false };

  function toggleKeystrokes(on) {
    if (on && !keyUI) {
      keyUI = document.createElement("div");
      keyUI.style.cssText = widgetStyle("keystrokes") + "display:flex;gap:6px;align-items:center;justify-content:center;padding:8px 10px;font-size:13px;backdrop-filter:blur(4px);";

      const keys = state.keystrokeMode === "wasd" ? ["W", "A", "S", "D"] : ["↑", "←", "↓", "→"];
      const keyCodes = state.keystrokeMode === "wasd" ? ["w", "a", "s", "d"] : ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];

      keys.forEach((k, i) => {
        const b = document.createElement("div");
        b.textContent = k;
        b.dataset.keyindex = i;
        Object.assign(b.style, {
          padding: "8px 10px",
          background: state.keystrokeColors.inactive,
          borderRadius: "8px",
          color: state.keystrokeColors.textInactive,
          border: "1px solid rgba(255,255,255,0.08)",
          minWidth: "28px",
          textAlign: "center",
          transition: "all 0.1s ease",
          fontWeight: "600",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        });
        keyUI.appendChild(b);
      });

      const ctrl = document.createElement("div");
      ctrl.style.display = "flex";
      ctrl.style.flexDirection = "column";
      ctrl.style.marginLeft = "10px";
      ctrl.style.gap = "4px";

      const lmb = document.createElement("div");
      lmb.textContent = "LMB";
      lmb.style.fontSize = "10px";
      lmb.style.color = "#8fa5b8";
      lmb.style.opacity = "0.7";
      lmb.style.fontWeight = "600";
      lmb.dataset.btn = "lmb";

      const rmb = document.createElement("div");
      rmb.textContent = "RMB";
      rmb.style.fontSize = "10px";
      rmb.style.color = "#8fa5b8";
      rmb.style.opacity = "0.7";
      rmb.style.fontWeight = "600";
      rmb.dataset.btn = "rmb";

      ctrl.appendChild(lmb);
      ctrl.appendChild(rmb);
      keyUI.appendChild(ctrl);

      document.body.appendChild(keyUI);
      positionWidget(keyUI, "keystrokes");
      attachWidgetClickToggle(keyUI, "keystrokes");
      if (!state.locked) makeDraggable(keyUI, "keystrokes");

      window.addEventListener("keydown", keyDownHandler);
      window.addEventListener("keyup", keyUpHandler);
      window.addEventListener("mousedown", mouseDownHandlerForKeys);
      window.addEventListener("mouseup", mouseUpHandlerForKeys);
    } else if (!on && keyUI) {
      keyUI.remove();
      keyUI = null;
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("mousedown", mouseDownHandlerForKeys);
      window.removeEventListener("mouseup", mouseUpHandlerForKeys);
    }
  }

  function keyDownHandler(e) {
    const keyCodes = state.keystrokeMode === "wasd" ? ["w", "a", "s", "d"] : ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    const k = e.key.toLowerCase();
    const idx = keyCodes.findIndex(code => code.toLowerCase() === k || code.toLowerCase() === e.key || code === e.key);
    if (idx !== -1) {
      keyState["key" + (idx + 1)] = true;
      refreshKeyUI();
    }
  }

  function keyUpHandler(e) {
    const keyCodes = state.keystrokeMode === "wasd" ? ["w", "a", "s", "d"] : ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    const k = e.key.toLowerCase();
    const idx = keyCodes.findIndex(code => code.toLowerCase() === k || code.toLowerCase() === e.key || code === e.key);
    if (idx !== -1) {
      keyState["key" + (idx + 1)] = false;
      refreshKeyUI();
    }
  }

  function refreshKeyUI() {
    if (!keyUI) return;
    for (const child of keyUI.children) {
      const idx = child.dataset && child.dataset.keyindex;
      if (idx === undefined) continue;
      const keyNum = parseInt(idx) + 1;
      if (keyState["key" + keyNum]) {
        child.style.background = state.keystrokeColors.active;
        child.style.color = state.keystrokeColors.text;
        child.style.transform = "translateY(-2px)";
        child.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
      } else {
        child.style.background = state.keystrokeColors.inactive;
        child.style.color = state.keystrokeColors.textInactive;
        child.style.transform = "";
        child.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      }
    }
  }

  function mouseDownHandlerForKeys(e) {
    if (!keyUI) return;
    const l = keyUI.querySelector("[data-btn='lmb']");
    const r = keyUI.querySelector("[data-btn='rmb']");
    if (e.button === 0 && l) {
      l.style.opacity = "1";
      l.style.color = state.keystrokeColors.active;
    }
    if (e.button === 2 && r) {
      r.style.opacity = "1";
      r.style.color = state.keystrokeColors.active;
    }
  }

  function mouseUpHandlerForKeys(e) {
    if (!keyUI) return;
    const l = keyUI.querySelector("[data-btn='lmb']");
    const r = keyUI.querySelector("[data-btn='rmb']");
    if (e.button === 0 && l) {
      l.style.opacity = "0.7";
      l.style.color = "#8fa5b8";
    }
    if (e.button === 2 && r) {
      r.style.opacity = "0.7";
      r.style.color = "#8fa5b8";
    }
  }

  // CPS Widget
  let cpsUI = null;
  let leftClicks = 0;
  let rightClicks = 0;

  document.addEventListener("mousedown", e => {
    if (e.button === 0) leftClicks++;
    else if (e.button === 2) rightClicks++;
  });

  setInterval(() => {
    if (cpsUI) {
      cpsUI.textContent = leftClicks + " | " + rightClicks + " CPS";
      leftClicks = 0;
      rightClicks = 0;
    } else {
      leftClicks = 0;
      rightClicks = 0;
    }
  }, 1000);

  function toggleCPS(on) {
    if (on && !cpsUI) {
      cpsUI = document.createElement("div");
      cpsUI.style.cssText = widgetStyle("cps") + "width:110px;height:34px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;";
      cpsUI.textContent = "0 | 0 CPS";
      document.body.appendChild(cpsUI);
      positionWidget(cpsUI, "cps");
      attachWidgetClickToggle(cpsUI, "cps");
      if (!state.locked) makeDraggable(cpsUI, "cps");
    } else if (!on && cpsUI) {
      cpsUI.remove();
      cpsUI = null;
    }
  }

  // Ping Widget
  let pingUI = null;
  let pingInterval = null;

  async function measurePing() {
    try {
      const url = location.origin + "/favicon.ico?t=" + Date.now();
      const start = performance.now();
      await fetch(url, { method: "HEAD", cache: "no-store" });
      const ms = Math.max(0, Math.round(performance.now() - start));
      if (pingUI) pingUI.textContent = ms + " ms";
    } catch (err) {
      if (pingUI) pingUI.textContent = "— ms";
    }
  }

  function togglePing(on) {
    if (on && !pingUI) {
      pingUI = document.createElement("div");
      pingUI.style.cssText = widgetStyle("ping") + "width:90px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;";
      pingUI.textContent = "... ms";
      document.body.appendChild(pingUI);
      positionWidget(pingUI, "ping");
      measurePing();
      pingInterval = setInterval(measurePing, 2500);
      attachWidgetClickToggle(pingUI, "ping");
      if (!state.locked) makeDraggable(pingUI, "ping");
    } else if (!on && pingUI) {
      clearInterval(pingInterval);
      pingInterval = null;
      pingUI.remove();
      pingUI = null;
    }
  }

  // FPS Display Widget
  let fpsUI = null;
  let lastTime = performance.now();
  let frames = 0;

  function updateFPS() {
    frames++;
    const currentTime = performance.now();
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      if (fpsUI) fpsUI.textContent = fps + " FPS";
      frames = 0;
      lastTime = currentTime;
    }
    if (fpsUI) requestAnimationFrame(updateFPS);
  }

  function toggleFPSDisplay(on) {
    if (on && !fpsUI) {
      fpsUI = document.createElement("div");
      fpsUI.style.cssText = widgetStyle("fps_display") + "width:90px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;";
      fpsUI.textContent = "60 FPS";
      document.body.appendChild(fpsUI);
      positionWidget(fpsUI, "fps_display");
      attachWidgetClickToggle(fpsUI, "fps_display");
      if (!state.locked) makeDraggable(fpsUI, "fps_display");
      lastTime = performance.now();
      frames = 0;
      requestAnimationFrame(updateFPS);
    } else if (!on && fpsUI) {
      fpsUI.remove();
      fpsUI = null;
    }
  }

  // Coordinates Widget
  let coordsUI = null;
  let coordsInterval = null;

  function updateCoords() {
    try {
      let x = 0, y = 0, z = 0;
      if (window.player && window.player.position) {
        x = Math.round(window.player.position.x || 0);
        y = Math.round(window.player.position.y || 0);
        z = Math.round(window.player.position.z || 0);
      } else if (window.game && window.game.player && window.game.player.position) {
        x = Math.round(window.game.player.position.x || 0);
        y = Math.round(window.game.player.position.y || 0);
        z = Math.round(window.game.player.position.z || 0);
      }
      if (coordsUI) {
        coordsUI.innerHTML = `
          <div style="font-size:10px; color:#8fa5b8; margin-bottom:2px;">XYZ</div>
          <div style="font-size:12px; font-weight:600;">${x}, ${y}, ${z}</div>
        `;
      }
    } catch (err) {
      if (coordsUI) coordsUI.textContent = "X:0 Y:0 Z:0";
    }
  }

  function toggleCoords(on) {
    if (on && !coordsUI) {
      coordsUI = document.createElement("div");
      coordsUI.style.cssText = widgetStyle("coords") + "width:130px;height:42px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;";
      coordsUI.textContent = "Loading...";
      document.body.appendChild(coordsUI);
      positionWidget(coordsUI, "coords");
      updateCoords();
      coordsInterval = setInterval(updateCoords, 100);
      attachWidgetClickToggle(coordsUI, "coords");
      if (!state.locked) makeDraggable(coordsUI, "coords");
    } else if (!on && coordsUI) {
      clearInterval(coordsInterval);
      coordsInterval = null;
      coordsUI.remove();
      coordsUI = null;
    }
  }

  // Speedometer Widget
  let speedUI = null;
  let speedInterval = null;
  let lastPos = { x: 0, y: 0, z: 0, time: Date.now() };

  function updateSpeed() {
    try {
      let x = 0, y = 0, z = 0;
      if (window.player && window.player.position) {
        x = window.player.position.x || 0;
        y = window.player.position.y || 0;
        z = window.player.position.z || 0;
      } else if (window.game && window.game.player && window.game.player.position) {
        x = window.game.player.position.x || 0;
        y = window.game.player.position.y || 0;
        z = window.game.player.position.z || 0;
      }
      const now = Date.now();
      const dt = (now - lastPos.time) / 1000;
      if (dt > 0) {
        const dx = x - lastPos.x;
        const dz = z - lastPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const speed = (dist / dt).toFixed(2);
        if (speedUI) {
          speedUI.innerHTML = `
            <div style="font-size:10px; color:#8fa5b8; margin-bottom:2px;">SPEED</div>
            <div style="font-size:13px; font-weight:700;">${speed} b/s</div>
          `;
        }
        lastPos = { x, y, z, time: now };
      }
    } catch (err) {
      if (speedUI) speedUI.textContent = "0.00 b/s";
    }
  }

  function toggleSpeedometer(on) {
    if (on && !speedUI) {
      speedUI = document.createElement("div");
      speedUI.style.cssText = widgetStyle("speedometer") + "width:100px;height:42px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;";
      speedUI.textContent = "0.00 b/s";
      document.body.appendChild(speedUI);
      positionWidget(speedUI, "speedometer");
      if (window.player && window.player.position) {
        lastPos = { x: window.player.position.x || 0, y: window.player.position.y || 0, z: window.player.position.z || 0, time: Date.now() };
      }
      speedInterval = setInterval(updateSpeed, 100);
      attachWidgetClickToggle(speedUI, "speedometer");
      if (!state.locked) makeDraggable(speedUI, "speedometer");
    } else if (!on && speedUI) {
      clearInterval(speedInterval);
      speedInterval = null;
      speedUI.remove();
      speedUI = null;
    }
  }

  // Armor View Widget
  let armorUI = null;
  let armorInterval = null;

  function updateArmorPreview() {
    if (!armorUI) return;
    const img = armorUI.querySelector("img");
    let found = null;
    try {
      if (window.player && window.player.armor) found = window.player.armor;
      else if (window.player && window.player.avatar && window.player.avatar.armorImage) found = window.player.avatar.armorImage;
      else if (window.game && window.game.player && window.game.player.armorUrl) found = window.game.player.armorUrl;
      else if (window.game && window.game.player && window.game.player.armor) found = window.game.player.armor;
    } catch (e) {}
    if (!found && state.armorImage) found = state.armorImage;
    if (found) {
      img.src = typeof found === 'string' ? found : (found.src || found.url || "");
      img.style.background = "";
      img.style.opacity = "1";
    } else {
      img.src = "";
      img.style.background = "linear-gradient(135deg, #1a1d20, #0f1113)";
      img.style.opacity = "0.5";
    }
  }

  function toggleArmor(on) {
    if (on && !armorUI) {
      armorUI = document.createElement("div");
      armorUI.style.cssText = widgetStyle("armor") + "width:150px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px;";
      const title = document.createElement("div");
      title.textContent = "ARMOR";
      title.style.fontSize = "11px";
      title.style.color = "#8fa5b8";
      title.style.marginBottom = "8px";
      title.style.fontWeight = "700";
      title.style.letterSpacing = "1px";
      const img = document.createElement("img");
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.objectFit = "contain";
      img.style.borderRadius = "10px";
      img.style.border = "2px solid rgba(255,255,255,0.1)";
      armorUI.appendChild(title);
      armorUI.appendChild(img);
      document.body.appendChild(armorUI);
      positionWidget(armorUI, "armor");
      updateArmorPreview();
      armorInterval = setInterval(updateArmorPreview, 500);
      attachWidgetClickToggle(armorUI, "armor");
      if (!state.locked) makeDraggable(armorUI, "armor");
    } else if (!on && armorUI) {
      clearInterval(armorInterval);
      armorInterval = null;
      armorUI.remove();
      armorUI = null;
    }
  }

  // Cape with Physics
  let capeOverlay = null;
  let capePhysics = { rotation: 0, velocity: 0, targetRotation: 0 };
  let capeAnimFrame = null;

  function applyCape(spec) {
    if (capeOverlay) {
      capeOverlay.remove();
      capeOverlay = null;
      if (capeAnimFrame) cancelAnimationFrame(capeAnimFrame);
    }
    if (!spec) return;
    capeOverlay = document.createElement("div");
    capeOverlay.style.position = "fixed";
    capeOverlay.style.width = "140px";
    capeOverlay.style.height = "200px";
    capeOverlay.style.pointerEvents = "none";
    capeOverlay.style.zIndex = "2147483645";
    capeOverlay.style.borderRadius = "8px";
    capeOverlay.style.boxShadow = "0 8px 24px rgba(0,0,0,0.6)";
    capeOverlay.style.transformOrigin = "top center";
    capeOverlay.style.transition = "none";
    const pos = state.positions.capeOverlay || { top: 54, right: 40 };
    capeOverlay.style.top = (pos.top || 54) + "px";
    capeOverlay.style.right = (pos.right || 40) + "px";
    if (spec === "gray") capeOverlay.style.background = "linear-gradient(180deg, #ddd, #888)";
    else if (spec === "dark") capeOverlay.style.background = "linear-gradient(180deg, #1a1a1a, #0a0a0a)";
    else if (spec === "rainbow") capeOverlay.style.background = "linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0, #9d00ff)";
    else if (spec.startsWith("custom:")) {
      const i = parseInt(spec.split(":")[1], 10);
      const obj = state.customCapes[i];
      if (obj && obj.dataUrl) {
        capeOverlay.style.background = `url(${obj.dataUrl}) center/cover no-repeat`;
      } else {
        capeOverlay.style.background = "#0f0f0f";
      }
    } else {
      capeOverlay.style.background = "#0f0f0f";
    }
    document.body.appendChild(capeOverlay);
    attachWidgetClickToggle(capeOverlay, "cape");
    if (!state.locked) makeDraggable(capeOverlay, "capeOverlay", { storePositionAs: "capeOverlay" });
    animateCape();
  }

  function animateCape() {
    if (!capeOverlay) return;
    let speed = 0;
    try {
      if (window.player && window.player.velocity) {
        const v = window.player.velocity;
        speed = Math.sqrt((v.x || 0) ** 2 + (v.z || 0) ** 2);
      } else if (window.game && window.game.player && window.game.player.velocity) {
        const v = window.game.player.velocity;
        speed = Math.sqrt((v.x || 0) ** 2 + (v.z || 0) ** 2);
      }
    } catch (e) {}
    capePhysics.targetRotation = Math.min(speed * 3, 15) * (Math.random() > 0.5 ? 1 : -1);
    const diff = capePhysics.targetRotation - capePhysics.rotation;
    capePhysics.velocity += diff * 0.05;
    capePhysics.velocity *= 0.85;
    capePhysics.rotation += capePhysics.velocity;
    const wave = Math.sin(Date.now() / 500) * 2;
    capeOverlay.style.transform = `
      perspective(500px)
      rotateY(${capePhysics.rotation}deg)
      rotateX(${wave}deg)
      translateZ(-10px)
    `;
    capeAnimFrame = requestAnimationFrame(animateCape);
  }

  // Extra Client Features
  const FULLBRIGHT_STYLE_ID = "null-fullbright-style";

  function applyFullbright(on) {
    const old = document.getElementById(FULLBRIGHT_STYLE_ID);
    if (old) old.remove();
    if (on) {
      const css = `
        canvas, #gameCanvas, [id*="canvas"], [class*="canvas"] {
          filter: brightness(1.8) !important;
        }
        body {
          background: #1a1a1a !important;
        }
      `;
      const s = document.createElement("style");
      s.id = FULLBRIGHT_STYLE_ID;
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      showToast("Fullbright enabled");
    } else {
      showToast("Fullbright disabled");
    }
  }

  const NOFIRE_STYLE_ID = "null-nofire-style";

  function applyNoFire(on) {
    const old = document.getElementById(NOFIRE_STYLE_ID);
    if (old) old.remove();
    if (on) {
      const css = `
        [class*="fire"], [id*="fire"], .fire-overlay, #fireOverlay {
          display: none !important;
          opacity: 0 !important;
        }
      `;
      const s = document.createElement("style");
      s.id = NOFIRE_STYLE_ID;
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      showToast("No Fire enabled");
    } else {
      showToast("No Fire disabled");
    }
  }

  const LOWFIRE_STYLE_ID = "null-lowfire-style";

  function applyLowFire(on) {
    const old = document.getElementById(LOWFIRE_STYLE_ID);
    if (old) old.remove();
    if (on) {
      const css = `
        [class*="fire"], [id*="fire"], .fire-overlay, #fireOverlay {
          transform: scale(0.4) translateY(60%) !important;
          opacity: 0.6 !important;
        }
      `;
      const s = document.createElement("style");
      s.id = LOWFIRE_STYLE_ID;
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      showToast("Low Fire enabled");
    } else {
      showToast("Low Fire disabled");
    }
  }

  const NOPUMPKIN_STYLE_ID = "null-nopumpkin-style";

  function applyNoPumpkinBlur(on) {
    const old = document.getElementById(NOPUMPKIN_STYLE_ID);
    if (old) old.remove();
    if (on) {
      const css = `
        [class*="pumpkin"], [id*="pumpkin"], .pumpkin-blur, #pumpkinOverlay {
          display: none !important;
          opacity: 0 !important;
          filter: none !important;
        }
      `;
      const s = document.createElement("style");
      s.id = NOPUMPKIN_STYLE_ID;
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      showToast("No Pumpkin Blur enabled");
    } else {
      showToast("No Pumpkin Blur disabled");
    }
  }

  function applyFOV(value) {
    try {
      if (window.camera && window.camera.fov !== undefined) {
        window.camera.fov = value;
        if (window.camera.updateProjectionMatrix) {
          window.camera.updateProjectionMatrix();
        }
      } else if (window.game && window.game.camera) {
        window.game.camera.fov = value;
        if (window.game.camera.updateProjectionMatrix) {
          window.game.camera.updateProjectionMatrix();
        }
      }
    } catch (e) {
      console.log("FOV adjust:", e.message);
    }
  }

  const CLIENT_STYLE_ID = "null-client-style";

  function applyTexture(mode) {
    removeClientStyle();
    if (!mode) return;
    let css = "";
    if (mode === "mono") {
      css = `
        canvas, img, video, [data-game-canvas] {
          filter: grayscale(1) contrast(1.3) brightness(1.1) !important;
        }
        body {
          background: #0f0f0f !important;
        }
      `;
    } else if (mode === "highcontrast") {
      css = `
        canvas, img, video, [data-game-canvas] {
          filter: contrast(1.6) brightness(0.95) saturate(1.2) !important;
        }
        body {
          background: #0a0a0a !important;
        }
      `;
    }
    if (css) {
      const s = document.createElement("style");
      s.id = CLIENT_STYLE_ID;
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  function removeClientStyle() {
    const old = document.getElementById(CLIENT_STYLE_ID);
    if (old) old.remove();
  }

  const FPS_STYLE_ID = "null-client-fps-style";
  const canvasesScaled = new WeakMap();

  function applyFPSState() {
    const scale = (state.fps && state.fps.scale) ? state.fps.scale : 1;
    document.querySelectorAll("canvas").forEach(c => {
      try {
        const meta = canvasesScaled.get(c);
        if (meta) {
          if (scale === 1) {
            c.width = meta.origWidth;
            c.height = meta.origHeight;
            c.style.transform = meta.origTransform || "";
            c.style.imageRendering = meta.origImageRendering || "";
            canvasesScaled.delete(c);
          } else {
            c.width = Math.round(meta.origWidth * scale);
            c.height = Math.round(meta.origHeight * scale);
            c.style.transform = `scale(${1 / scale})`;
            c.style.transformOrigin = "0 0";
            c.style.imageRendering = "pixelated";
          }
        } else {
          if (scale !== 1) {
            const origW = c.width;
            const origH = c.height;
            canvasesScaled.set(c, {
              origWidth: origW,
              origHeight: origH,
              origTransform: c.style.transform || "",
              origImageRendering: c.style.imageRendering || ""
            });
            c.width = Math.round(origW * scale);
            c.height = Math.round(origH * scale);
            c.style.transform = `scale(${1 / scale})`;
            c.style.transformOrigin = "0 0";
            c.style.imageRendering = "pixelated";
          }
        }
      } catch (e) {}
    });
    const old = document.getElementById(FPS_STYLE_ID);
    if (old) old.remove();
    let css = "";
    if (state.fps.pauseAnimations) {
      css += `* { animation-play-state: paused !important; transition: none !important; }`;
    }
    if (state.fps.removeBackgrounds) {
      css += `body, [style*="background"], [style*="background-image"] { background-image: none !important; background: #0a0a0a !important; }`;
    }
    if (css) {
      const s = document.createElement("style");
      s.id = FPS_STYLE_ID;
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  function widgetStyle(key) {
    const pos = (state.positions && state.positions[key]) ? state.positions[key] : {};
    const pieces = [];
    if (pos.bottom !== undefined) pieces.push("bottom:" + pos.bottom + "px");
    if (pos.top !== undefined) pieces.push("top:" + pos.top + "px");
    if (pos.left !== undefined) pieces.push("left:" + pos.left + "px");
    if (pos.right !== undefined) pieces.push("right:" + pos.right + "px");
    pieces.push("position:fixed");
    pieces.push("background:rgba(10,11,12,0.88)");
    pieces.push("border-radius:10px");
    pieces.push("border:1px solid rgba(255,255,255,0.08)");
    pieces.push("color:#e8f3ff");
    pieces.push("padding:8px");
    pieces.push("box-shadow:0 4px 16px rgba(0,0,0,0.5)");
    pieces.push("backdrop-filter:blur(4px)");
    pieces.push("z-index:2147483644");
    return pieces.join(";") + ";";
  }

  function positionWidget(el, key) {
    const pos = (state.positions && state.positions[key]) ? state.positions[key] : {};
    if (pos.top !== undefined) el.style.top = pos.top + "px";
    if (pos.bottom !== undefined) el.style.bottom = pos.bottom + "px";
    if (pos.left !== undefined) el.style.left = pos.left + "px";
    if (pos.right !== undefined) el.style.right = pos.right + "px";
  }

  const DRAGMAP = new WeakMap();

  function makeDraggable(el, key, opts = {}) {
    removeDraggable(el);
    el.style.cursor = "move";
    const storeKey = opts.storePositionAs || key;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    const onDown = (ev) => {
      if (ev.button !== 0) return;
      ev.preventDefault();
      startX = ev.clientX;
      startY = ev.clientY;
      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      const onMove = (mv) => {
        mv.preventDefault();
        const dx = mv.clientX - startX;
        const dy = mv.clientY - startY;
        if (!dragging && Math.hypot(dx, dy) > 6) dragging = true;
        if (dragging) {
          const newLeft = Math.max(0, Math.round(startLeft + dx));
          const newTop = Math.max(0, Math.round(startTop + dy));
          el.style.left = newLeft + "px";
          el.style.top = newTop + "px";
          el.style.right = "";
          el.style.bottom = "";
        }
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        if (dragging) {
          const b = el.getBoundingClientRect();
          state.positions = state.positions || {};
          state.positions[storeKey] = {
            top: Math.max(0, Math.round(b.top)),
            left: Math.max(0, Math.round(b.left))
          };
          saveState();
        }
        setTimeout(() => { dragging = false; }, 10);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    el.addEventListener("mousedown", onDown);
    DRAGMAP.set(el, onDown);
  }

  function removeDraggable(el) {
    const h = DRAGMAP.get(el);
    if (h) {
      el.removeEventListener("mousedown", h);
      DRAGMAP.delete(el);
    }
    el.style.cursor = "";
  }

  function updateLockState() {
    const keys = ["keystrokes", "cps", "ping", "armor", "fps_display", "coords", "speedometer", "capeOverlay"];
    for (const k of keys) {
      const el = getWidget(k);
      if (!el) continue;
      if (!state.locked) {
        makeDraggable(el, k, { storePositionAs: k === "capeOverlay" ? "capeOverlay" : k });
      } else {
        removeDraggable(el);
      }
    }
  }

  function getWidget(key) {
    if (key === "keystrokes") return keyUI;
    if (key === "cps") return cpsUI;
    if (key === "ping") return pingUI;
    if (key === "armor") return armorUI;
    if (key === "fps_display") return fpsUI;
    if (key === "coords") return coordsUI;
    if (key === "speedometer") return speedUI;
    if (key === "capeOverlay") return capeOverlay;
    return null;
  }

  function attachWidgetClickToggle(el, widgetKey) {
    if (!el) return;
    let down = null;
    const downHandler = (ev) => {
      if (ev.button !== 0) return;
      down = { x: ev.clientX, y: ev.clientY, t: Date.now() };
    };
    const upHandler = (ev) => {
      if (!down) return;
      const dx = ev.clientX - down.x;
      const dy = ev.clientY - down.y;
      if (Math.hypot(dx, dy) <= 6 && (Date.now() - down.t) < 500) {
        if (widgetKey === "keystrokes") {
          state.keystrokes = !state.keystrokes;
          toggleKeystrokes(state.keystrokes);
          saveState();
          showToast("Keystrokes " + (state.keystrokes ? "ON" : "OFF"));
        } else if (widgetKey === "cps") {
          state.cps = !state.cps;
          toggleCPS(state.cps);
          saveState();
          showToast("CPS " + (state.cps ? "ON" : "OFF"));
        } else if (widgetKey === "ping") {
          state.ping = !state.ping;
          togglePing(state.ping);
          saveState();
          showToast("Ping " + (state.ping ? "ON" : "OFF"));
        } else if (widgetKey === "armor") {
          state.armor = !state.armor;
          toggleArmor(state.armor);
          saveState();
          showToast("Armor " + (state.armor ? "ON" : "OFF"));
        } else if (widgetKey === "fps_display") {
          state.fps_display = !state.fps_display;
          toggleFPSDisplay(state.fps_display);
          saveState();
          showToast("FPS Display " + (state.fps_display ? "ON" : "OFF"));
        } else if (widgetKey === "coords") {
          state.coords = !state.coords;
          toggleCoords(state.coords);
          saveState();
          showToast("Coords " + (state.coords ? "ON" : "OFF"));
        } else if (widgetKey === "speedometer") {
          state.speedometer = !state.speedometer;
          toggleSpeedometer(state.speedometer);
          saveState();
          showToast("Speedometer " + (state.speedometer ? "ON" : "OFF"));
        } else if (widgetKey === "cape") {
          if (state.cape) {
            state.cape = null;
            applyCape(null);
            saveState();
            showToast("Cape disabled");
          } else {
            showToast("Select a cape from Accessories tab");
          }
        }
      }
      down = null;
    };
    el.addEventListener("mousedown", downHandler);
    el.addEventListener("mouseup", upHandler);
  }

  let toastEl = null;

  function showToast(msg, ms = 1500) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.cssText = `
        position:fixed;
        left:50%;
        bottom:30px;
        transform:translateX(-50%);
        background:linear-gradient(135deg, rgba(10,12,14,0.95), rgba(6,8,10,0.95));
        color:#e8f3ff;
        padding:12px 20px;
        border-radius:10px;
        z-index:2147483650;
        font-size:14px;
        font-weight:600;
        border:1px solid rgba(255,255,255,0.1);
        box-shadow:0 8px 24px rgba(0,0,0,0.6);
        backdrop-filter:blur(8px);
        pointer-events:none;
      `;
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(-50%) translateY(0)";
    setTimeout(() => {
      if (toastEl) {
        toastEl.style.opacity = "0";
        toastEl.style.transform = "translateX(-50%) translateY(10px)";
      }
    }, ms);
  }

  window.addEventListener("beforeunload", saveState);

  // Initialize everything
  setTimeout(() => {
    console.log("🎮Null Client v1.2 Initialized");

    // Apply branding changes
    removeAds();
    replaceBranding();
    replaceLoadingScreen();

    // Restore widgets
    if (state.keystrokes) toggleKeystrokes(true);
    if (state.cps) toggleCPS(true);
    if (state.ping) togglePing(true);
    if (state.armor) toggleArmor(true);
    if (state.fps_display) toggleFPSDisplay(true);
    if (state.coords) toggleCoords(true);
    if (state.speedometer) toggleSpeedometer(true);

    // Restore cape
    if (state.cape) applyCape(state.cape);

    // Restore visual settings
    if (state.texture) applyTexture(state.texture);
    applyFPSState();

    // Restore features
    if (state.fullbright) applyFullbright(true);
    if (state.noFire) applyNoFire(true);
    if (state.lowFire) applyLowFire(true);
    if (state.noPumpkinBlur) applyNoPumpkinBlur(true);
    if (state.fov !== 90) applyFOV(state.fov);

    // Update lock state
    setTimeout(updateLockState, 400);

    showToast("🎮Null Client v1.2 Loaded!");
  }, 500);

})();
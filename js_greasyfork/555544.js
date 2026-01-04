// ==UserScript==
// @name         🎹 CHEAT CLIENT v3.5 – GPOP.IO AUTO PLAYER + TINY PANEL
// @namespace    http://tampermonkey.net/
// @version      3.5.0
// @description  GPOP.IO AUTOPLAY BOT | HITZONE LINES | COMBO COUNTER | DRAGGABLE MINIMIZABLE BUTTON | FPS | AUTO-RESTART | LONG NOTES | HOTKEYS: ; (toggle) | R (reload lanes) | 50 NOTES/FRAME | MONOCHROME THEME
// @author       Emulation
// @match        https://gpop.io
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555544/%F0%9F%8E%B9%20CHEAT%20CLIENT%20v35%20%E2%80%93%20GPOPIO%20AUTO%20PLAYER%20%2B%20TINY%20PANEL.user.js
// @updateURL https://update.greasyfork.org/scripts/555544/%F0%9F%8E%B9%20CHEAT%20CLIENT%20v35%20%E2%80%93%20GPOPIO%20AUTO%20PLAYER%20%2B%20TINY%20PANEL.meta.js
// ==/UserScript==

/*
================================================================================
   ______ _          _     __  __           _       _   _          _ _ 
  |  ____(_)        | |   |  \/  |         | |     | | (_)        | | |
  | |__   _ _ __ ___| |   | \  / | ___   __| | ___ | |_ _ ______ _| | |
  |  __| | | '__/ _ \ |   | |\/| |/ _ \ / _` |/ _ \| __| |______| | | |
  | |    | | | |  __/ |   | |  | | (_) | (_| | (_) | |_| |      | | | |
  |_|    |_|_|  \___|_|   |_|  |_|\___/ \__,_|\___/ \__|_|      |_|_|_|
                                                                      
                       // == FIXED CHEAT CLIENT v3.5 ==
                       // == DARK MODE HELL + TINY PANEL ==
                       // == AUTOPLAY | HITZONE LINES | COMBO COUNTER ==
                       // == DRAGGABLE BUTTON | MINIMIZE MODE | FPS DISPLAY ==
                       // == AUTO-RESTART ON FAIL | HOTKEYS: ; & R ==
                       // == LONG NOTE SUPPORT | 50 NOTES/FRAME LIMIT ==
                       // == ULTRA-DARK UI | BACKDROP BLUR | MONOSPACE VIBES ==
                       // == WRITTEN BY A MAD HACKER IN A BASEMENT AT 3AM ==

    "In a world where rhythm games are law... one script breaks free."
    "No more missed notes. No more rage quits. Just pure, unholy perfection."
    "Welcome to the dark side. We've got perfects."

    CAST:
      - You: The Player (but really, the spectator)
      - The Cheat: 🤖 (silent protagonist, does all the work)
      - The Notes: Screaming pixels falling to their doom
      - The Game: Thinks it's in control... adorable.

    ACT 1: Injection
    ACT 2: Domination
    ACT 3: Eternal Combo

================================================================================
*/
(() => {
  // ==================== [ CONFIG – DARKER AS FUCK ] ====================
  const CONFIG = {
    // --- CORE ---
    HIT_THRESHOLD: 21,
    ANTICIPATION_PX: 0,
    HIT_RATIO: 2.15,
    MAX_NOTES_PER_FRAME: 50,
    // --- INPUT ---
    KEY_PRESS_DURATION: 30,
    LONG_PRESS_CHECK_INTERVAL: 16,
    ENABLE_LONG_NOTES: true,
    LONG_NOTE_MIN_HEIGHT: 50,
    KEY_MAP: { 'a': 'a', 's': 's', 'd': 'k', 'f': 'l' },
    // --- SELECTORS ---
    LANE_CONTAINER_SELECTOR: ".pp-lanes, .pp-container2",
    LANE_SELECTOR: ".pp-lane",
    KEY_SELECTOR: ".pp-key.kkey",
    SQUARE_SELECTOR: ".pp-square",
    NOTE_SELECTOR: ".pp-note:not(.pp-note-hit)",
    NOTE_TEXT_SELECTOR: "t",
    // --- VISUALS ---
    ENABLE_HITZONE_LINES: true,
    HITZONE_LINE_COLOR: "#666666", // Darker grey
    HITZONE_LINE_WIDTH: 1.2,
    SHOW_COMBO_COUNTER: true,
    COMBO_TEXT_COLOR: "#bbbbbb",
    SHOW_FPS: true,
    FPS_TEXT_COLOR: "#999999",
    // --- DARKER UI THEME ---
    BUTTON_BG_IDLE: "#1a1a1a", // Near-black
    BUTTON_BG_ACTIVE: "#0a0a0a", // Pure hell
    BUTTON_TEXT_COLOR: "#d0d0d0",
    BUTTON_BORDER: "1px solid #333333",
    PANEL_BG: "rgba(17, 17, 17, 0.95)", // #111 darker semi-trans
    PANEL_TEXT: "#c0c0c0",
    OVERLAY_OPACITY: 0.88,
    // --- BUTTON ---
    BUTTON_POSITION: "bottom-right",
    ENABLE_BUTTON_DRAG: true,
    ENABLE_MINIMIZE_BUTTON: true,
    // --- AUTO ---
    AUTO_START_ON_LOAD: true,
    AUTO_RESTART_ON_FAIL: true,
    RESTART_DELAY: 500, // Faster retry
    // --- DEBUG ---
    ENABLE_DEBUG_LOG: false,
    // --- HOTKEYS ---
    HOTKEY_TOGGLE: ";",
    HOTKEY_RELOAD_LANES: "r",
  };
  // --- STATE ---
  const state = {
    running: false,
    pressed: new Set(),
    lanes: new Map(),
    button: null,
    panel: null,
    canvas: null,
    combo: 0,
    lastHitTime: 0,
    fps: 0,
    frameCount: 0,
    lastFpsTime: performance.now(),
    buttonMinimized: false,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    retryCount: 0,
  };
  // ==================== [ FIXED UI – TINY + DARK ] ====================
  function createClientUI() {
    createControlPanel(); // Tiny 180px
    createButton();
    if (CONFIG.ENABLE_HITZONE_LINES) createCanvas();
    createComboDisplay();
  }
  function createControlPanel() {
    if (state.panel) return;
    state.panel = document.createElement('div');
    state.panel.innerHTML = `
      <div style="padding:8px; font-family:monospace; font-size:11px;">
        <div style="margin-bottom:6px; color:#888888; font-size:12px;">CHEAT v3.5</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:11px;">
          <div>Status: <span id="status">OFF</span></div>
          <div>Combo: <span id="combo">0</span></div>
          <div>Lanes: <span id="lanes">0/4</span></div>
          <div>FPS: <span id="fps">0</span></div>
        </div>
        <div style="margin-top:8px; font-size:10px; color:#666666;">
          ; Toggle | R Reload
        </div>
      </div>
    `;
    Object.assign(state.panel.style, {
      position: 'fixed',
      top: '15px',
      left: '15px',
      background: CONFIG.PANEL_BG,
      color: CONFIG.PANEL_TEXT,
      border: CONFIG.BUTTON_BORDER,
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '11px',
      zIndex: '999999',
      boxShadow: '0 0 12px rgba(0,0,0,0.8)',
      backdropFilter: 'blur(6px)',
      width: '180px', // TINY AF
      userSelect: 'none',
    });
    document.body.appendChild(state.panel);
    state.statusEl = state.panel.querySelector('#status');
    state.comboPanelEl = state.panel.querySelector('#combo');
    state.lanesEl = state.panel.querySelector('#lanes');
    state.fpsPanelEl = state.panel.querySelector('#fps');
  }
  function createButton() {
    if (state.button) return;
    state.button = document.createElement('div');
    state.button.innerHTML = '🤖';
    applyButtonStyle();
    state.button.addEventListener('click', (e) => {
      if (state.buttonMinimized && CONFIG.ENABLE_MINIMIZE_BUTTON) toggleMinimize();
      else toggleRunning();
    });
    if (CONFIG.ENABLE_BUTTON_DRAG) state.button.addEventListener('mousedown', startDrag);
    document.body.appendChild(state.button);
  }
  function applyButtonStyle() {
    const isMin = state.buttonMinimized;
    const size = isMin ? '32px' : 'auto';
    const padding = isMin ? '0' : '8px 14px';
    const font = isMin ? '18px' : '12px';
    const pos = CONFIG.BUTTON_POSITION;
    const style = {
      position: 'fixed',
      width: size,
      height: size,
      padding,
      background: state.running ? CONFIG.BUTTON_BG_ACTIVE : CONFIG.BUTTON_BG_IDLE,
      color: CONFIG.BUTTON_TEXT_COLOR,
      fontWeight: 'bold',
      fontFamily: 'monospace',
      fontSize: font,
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: '999999',
      boxShadow: '0 0 10px rgba(0,0,0,0.7)',
      transition: 'all 0.2s ease',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: CONFIG.BUTTON_BORDER,
      backdropFilter: 'blur(3px)',
    };
    if (pos.includes('bottom')) style.bottom = '15px'; else style.top = '15px';
    if (pos.includes('right')) style.right = '15px'; else style.left = '15px';
    Object.assign(state.button.style, style);
    state.button.innerHTML = state.buttonMinimized ? '🤖' : (state.running ? 'STOP' : 'START');
  }
  function updateButtonText() {
    if (!state.button) return;
    state.button.innerHTML = state.buttonMinimized ? '🤖' : (state.running ? 'STOP' : 'START');
    state.button.style.background = state.running ? CONFIG.BUTTON_BG_ACTIVE : CONFIG.BUTTON_BG_IDLE;
  }
  function toggleMinimize() {
    state.buttonMinimized = !state.buttonMinimized;
    applyButtonStyle();
  }
  // ==================== [ DRAG HANDLERS ] ====================
  function startDrag(e) {
    if (e.button !== 0) return;
    state.isDragging = true;
    const rect = state.button.getBoundingClientRect();
    state.dragOffset.x = e.clientX - rect.left;
    state.dragOffset.y = e.clientY - rect.top;
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  }
  function doDrag(e) {
    if (!state.isDragging) return;
    state.button.style.left = (e.clientX - state.dragOffset.x) + 'px';
    state.button.style.top = (e.clientY - state.dragOffset.y) + 'px';
    state.button.style.right = 'auto';
    state.button.style.bottom = 'auto';
  }
  function stopDrag() {
    state.isDragging = false;
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
  }
  // ==================== [ CANVAS & HITLINES – FIXED ] ====================
  function createCanvas() {
    if (state.canvas || !CONFIG.ENABLE_HITZONE_LINES) return;
    state.canvas = document.createElement('canvas');
    state.canvas.style.position = 'fixed';
    state.canvas.style.top = '0';
    state.canvas.style.left = '0';
    state.canvas.style.pointerEvents = 'none';
    state.canvas.style.zIndex = '999991';
    state.canvas.style.opacity = CONFIG.OVERLAY_OPACITY;
    document.body.appendChild(state.canvas);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  function resizeCanvas() {
    if (!state.canvas) return;
    state.canvas.width = window.innerWidth;
    state.canvas.height = window.innerHeight;
  }
  function drawHitzones() {
    if (!state.canvas || !CONFIG.ENABLE_HITZONE_LINES || state.lanes.size === 0) return;
    const ctx = state.canvas.getContext('2d');
    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    ctx.strokeStyle = CONFIG.HITZONE_LINE_COLOR;
    ctx.lineWidth = CONFIG.HITZONE_LINE_WIDTH;
    state.lanes.forEach(lane => {
      try {
        const squareRect = lane.square.getBoundingClientRect();
        if (!squareRect.width) return;
        const hitY = squareRect.top + squareRect.height * CONFIG.HIT_RATIO;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(squareRect.left, hitY);
        ctx.lineTo(squareRect.right, hitY);
        ctx.stroke();
        ctx.setLineDash([]);
      } catch (err) {
        if (CONFIG.ENABLE_DEBUG_LOG) console.warn("[Cheat] Hitline draw error:", err);
      }
    });
  }
  function createComboDisplay() {
    if (!CONFIG.SHOW_COMBO_COUNTER) return;
    state.comboEl = document.createElement('div');
    Object.assign(state.comboEl.style, {
      position: 'fixed',
      bottom: '70px',
      right: '20px',
      color: CONFIG.COMBO_TEXT_COLOR,
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      zIndex: '999992',
      pointerEvents: 'none',
      textShadow: '0 0 8px #000',
      opacity: '0.9'
    });
    document.body.appendChild(state.comboEl);
  }
  // ==================== [ UI UPDATE ] ====================
  function updateUI() {
    if (state.statusEl) {
      state.statusEl.textContent = state.running ? 'ON' : 'OFF';
      state.statusEl.style.color = state.running ? '#00ff00' : '#ff4444';
    }
    if (state.comboPanelEl) state.comboPanelEl.textContent = state.combo;
    if (state.lanesEl) state.lanesEl.textContent = `${state.lanes.size}/4`;
    if (state.fpsPanelEl) state.fpsPanelEl.textContent = state.fps;
    if (state.comboEl) state.comboEl.textContent = state.combo > 5 ? `x${state.combo}` : '';
  }
  function updateFps() {
    state.frameCount++;
    const now = performance.now();
    if (now - state.lastFpsTime >= 1000) {
      state.fps = Math.round(state.frameCount * 1000 / (now - state.lastFpsTime));
      state.frameCount = 0;
      state.lastFpsTime = now;
    }
    updateUI();
  }
  // ==================== [ CORE LOGIC – FIXED LANE RETRY ] ====================
  function initLanes() {
    state.lanes.clear();
    const container = document.querySelector(CONFIG.LANE_CONTAINER_SELECTOR);
    if (!container) return false;
    const laneEls = container.querySelectorAll(CONFIG.LANE_SELECTOR);
    laneEls.forEach(lane => {
      const keyDiv = lane.querySelector(CONFIG.KEY_SELECTOR);
      if (!keyDiv) return;
      const key = keyDiv.getAttribute("kkey")?.toLowerCase();
      if (!key || !CONFIG.KEY_MAP[key]) return;
      const square = lane.querySelector(CONFIG.SQUARE_SELECTOR);
      if (!square) return;
      state.lanes.set(key, { square, inputKey: CONFIG.KEY_MAP[key] });
    });
    const success = state.lanes.size === 4;
    if (success) state.retryCount = 0;
    updateUI();
    return success;
  }
  function pressKey(kkey, isLong = false, noteEl = null) {
    const key = CONFIG.KEY_MAP[kkey];
    if (!key || state.pressed.has(key)) return false;
    const props = { key, code: `Key${key.toUpperCase()}`, bubbles: true, cancelable: true };
    document.dispatchEvent(new KeyboardEvent("keydown", props));
    state.pressed.add(key);
    if (!isLong) {
      setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent("keyup", props));
        state.pressed.delete(key);
      }, CONFIG.KEY_PRESS_DURATION);
    } else if (noteEl && CONFIG.ENABLE_LONG_NOTES) {
      const check = setInterval(() => {
        if (!document.body.contains(noteEl) || noteEl.classList.contains("pp-note-hit")) {
          document.dispatchEvent(new KeyboardEvent("keyup", props));
          state.pressed.delete(key);
          clearInterval(check);
        }
      }, CONFIG.LONG_PRESS_CHECK_INTERVAL);
    }
    return true;
  }
  function scan() {
    if (!state.running) return;
    updateFps();
    if (document.visibilityState === "hidden") {
      setTimeout(scan, 200);
      return;
    }
    const notes = Array.from(document.querySelectorAll(CONFIG.NOTE_SELECTOR));
    let processed = 0;
    for (const note of notes) {
      if (processed >= CONFIG.MAX_NOTES_PER_FRAME) break;
      const t = note.querySelector(CONFIG.NOTE_TEXT_SELECTOR);
      if (!t) continue;
      const noteKey = t.textContent.trim().toLowerCase();
      const lane = state.lanes.get(noteKey);
      if (!lane) continue;
      try {
        const noteRect = note.getBoundingClientRect();
        const squareRect = lane.square.getBoundingClientRect();
        const hitPoint = squareRect.top + squareRect.height * CONFIG.HIT_RATIO;
        const distance = Math.abs(noteRect.bottom - hitPoint);
        const isLong = noteRect.height > CONFIG.LONG_NOTE_MIN_HEIGHT;
        if (distance <= CONFIG.HIT_THRESHOLD && noteRect.bottom <= hitPoint + CONFIG.ANTICIPATION_PX) {
          if (pressKey(noteKey, isLong, isLong ? note : null)) {
            processed++;
            state.combo++;
            state.lastHitTime = performance.now();
            if (!isLong) note.classList.add("pp-note-hit");
          }
        }
      } catch (err) {
        if (CONFIG.ENABLE_DEBUG_LOG) console.warn("[Cheat] Note scan error:", err);
      }
    }
    if (performance.now() - state.lastHitTime > 600) state.combo = 0;
    drawHitzones();
    updateUI();
    if (state.running) requestAnimationFrame(scan);
  }
  function toggleRunning() {
    if (state.running) stop(); else start();
  }
  function start() {
    if (state.running) return;
    if (!initLanes()) {
      if (CONFIG.AUTO_RESTART_ON_FAIL && state.retryCount < 10) {
        state.retryCount++;
        setTimeout(start, CONFIG.RESTART_DELAY);
      }
      return;
    }
    state.running = true;
    requestAnimationFrame(scan);
    updateButtonText();
    updateUI();
  }
  function stop() {
    if (!state.running) return;
    state.running = false;
    state.pressed.forEach(key => {
      document.dispatchEvent(new KeyboardEvent("keyup", { key, code: `Key${key.toUpperCase()}`, bubbles: true }));
    });
    state.pressed.clear();
    updateButtonText();
    updateUI();
  }
  // ==================== [ HOTKEYS ] ====================
  document.addEventListener('keydown', e => {
    if (e.key === CONFIG.HOTKEY_TOGGLE) { e.preventDefault(); toggleRunning(); }
    if (e.key === CONFIG.HOTKEY_RELOAD_LANES) { e.preventDefault(); initLanes(); }
  });
  // ==================== [ INIT ] ====================
  createClientUI();
  if (CONFIG.AUTO_START_ON_LOAD) start();
})();
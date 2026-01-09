// ==UserScript==
// @name         Null Client
// @namespace    null.client
// @version      1.2
// @match        https://bloxd.io/*
// @match        https://staging.bloxd.io/*
// @description  Null Client — Best Bloxd.io Client. Use this for The Smoothest Experience
// @author       Nullscape
// @icon         https://i.postimg.cc/xjzYxS0R/Null-Client.png
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561920/Null%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/561920/Null%20Client.meta.js
// ==/UserScript==
(function () {
  "use strict";
  // Persistence & defaults
  const STORAGE_KEY = "null_client_v1_2_state";
  const DEFAULT_STATE = {
    version: "1.2",
    keystrokes: false,
    cps: false,
    ping: false,
    armor: false,
    cape: null,
    customCapes: [],
    builtInCapesImported: false,
    locked: true,
    positions: {
      keystrokes: { bottom: 18, left: 18 },
      cps: { bottom: 66, left: 18 },
      ping: { bottom: 98, left: 18 },
      armor: { top: 18, right: 18 },
      cape: { top: 54, right: 40 },
      compactHud: { bottom: 18, right: 18 }
    },
    texture: "",
    fps: { scale: 1, pauseAnimations: false, removeBackgrounds: false },
    armorImage: null,
    bound: { armorPath: null, chatPath: null, playerPath: null },
    safeMode: true,
    enableCapeFollow: false,
    compactHud: false
  };

  function deepCopy(v) { return JSON.parse(JSON.stringify(v)); }

  function migrateState(parsed) {
    const s = Object.assign(deepCopy(DEFAULT_STATE), parsed || {});
    if (s.positions && s.positions.capeOverlay && !s.positions.cape) {
      s.positions.cape = s.positions.capeOverlay;
      delete s.positions.capeOverlay;
    }
    s.positions = Object.assign(deepCopy(DEFAULT_STATE.positions), s.positions || {});
    s.fps = Object.assign(deepCopy(DEFAULT_STATE.fps), s.fps || {});
    s.bound = Object.assign(deepCopy(DEFAULT_STATE.bound), s.bound || {});
    if (s.safeMode) {
      s.enableCapeFollow = false;
      if (s.fps && s.fps.scale && s.fps.scale !== 1) s.fps.scale = 1;
    }
    s.version = DEFAULT_STATE.version;
    return s;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepCopy(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return migrateState(parsed);
    } catch (e) {
      return deepCopy(DEFAULT_STATE);
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  let state = loadState();

  // Globals
  let pingValue = null;
  let uiRoot = null, uiOpen = false;
  let keyUI = null, cpsUI = null, pingUI = null, armorUI = null, compactHudEl = null, compactHudInterval = null;
  let leftClicks = 0, rightClicks = 0, lastLeftCPS = 0, lastRightCPS = 0;
  let cpsListenerAdded = false, cpsIntervalId = null;
  let capeCanvas = null, capeCtx = null, capeImage = null, cloth = null, clothAnim = null;
  const canvasesMeta = new WeakMap();
  let canvasObserver = null;
  let canvasObserverScheduled = false;
  const pendingCanvasNodes = new Set();

  // small helper to safely get shadow root
  function getShadowRoot() { return uiRoot && uiRoot.shadowRoot ? uiRoot.shadowRoot : null; }

  // Helpers
  function isTypingTarget(el) {
    if (!el) return false;
    try {
      if (el.tagName && (/input|textarea/i).test(el.tagName)) return true;
      if (el.isContentEditable) return true;
    } catch (e) {}
    return false;
  }

  function isClientUIEvent(el) {
    if (!el || !uiRoot) return false;
    try {
      if (uiRoot.contains(el)) return true;
      if (el.getRootNode && el.getRootNode() === getShadowRoot()) return true;
    } catch (e) {}
    return false;
  }

  function getDomPath(el) {
    if (!el || el === document) return null;
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.documentElement) {
      let part = el.nodeName.toLowerCase();
      if (el.id) { part += `#${el.id}`; parts.unshift(part); break; }
      let nth = 1; let sib = el;
      while ((sib = sib.previousElementSibling)) if (sib.nodeName.toLowerCase() === el.nodeName.toLowerCase()) nth++;
      part += `:nth-of-type(${nth})`;
      parts.unshift(part);
      el = el.parentElement;
    }
    return parts.join(" > ");
  }

  function queryDomPath(path) {
    try { if (!path) return null; return document.querySelector(path); } catch (e) { return null; }
  }

  // UI toggle (Right Shift)
  document.addEventListener("keydown", e => {
    if (e.code !== "ShiftRight") return;
    const tg = e.target;
    if (isTypingTarget(tg)) return;
    if (isClientUIEvent(tg)) return;
    uiOpen = !uiOpen;
    uiOpen ? showUI() : hideUI();
  }, true);

  function showUI() {
    if (!uiRoot) createUI();
    if (!uiRoot) return;
    const shadow = getShadowRoot();
    uiRoot.style.display = "block";
    if (!shadow) return;
    const frame = shadow.querySelector(".frame");
    if (!frame) return;
    requestAnimationFrame(() => frame.classList.add("open"));
  }
  function hideUI() {
    if (!uiRoot) return;
    const shadow = getShadowRoot();
    if (!shadow) { uiRoot.style.display = "none"; return; }
    const frame = shadow.querySelector(".frame");
    if (frame) frame.classList.remove("open");
    setTimeout(() => { if (uiRoot) uiRoot.style.display = "none"; }, 220);
  }

  // Toast
  let toastEl = null;
  function showToast(msg, ms = 1200) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.cssText = "position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:rgba(6,10,12,0.84);color:#e7f6ff;padding:8px 12px;border-radius:8px;z-index:2147483650;font-size:13px;transition:opacity .18s;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    setTimeout(() => { if (toastEl) toastEl.style.opacity = "0"; }, ms);
  }

  // CPS handling
  function globalMouseDown(e) {
    try {
      if (e.defaultPrevented) return;
      if (!document.hasFocus()) return;
      if (isClientUIEvent(e.target)) return;
      if (e.button === 0) leftClicks++;
      if (keyUI) {
        const l = keyUI.querySelector("[data-btn='lmb']"), r = keyUI.querySelector("[data-btn='rmb']");
        if (e.button === 0 && l) l.style.opacity = "1";
        if (e.button === 2 && r) r.style.opacity = "1";
      }
    } catch (err) {}
  }

  function globalMouseUp(e) {
    try {
      if (e.button === 2) {
        if (!isClientUIEvent(e.target)) rightClicks++;
      }
      if (keyUI) {
        const l = keyUI.querySelector("[data-btn='lmb']"), r = keyUI.querySelector("[data-btn='rmb']");
        if (e.button === 0 && l) l.style.opacity = "0.7";
        if (e.button === 2 && r) r.style.opacity = "0.7";
      }
    } catch (err) {}
  }

  function globalContextMenu(e) {
    // rely on mouseup counting for right clicks across browsers
  }

  function addCPSListeners() {
    if (cpsListenerAdded) return;
    window.addEventListener("mousedown", globalMouseDown, true);
    window.addEventListener("mouseup", globalMouseUp, true);
    window.addEventListener("contextmenu", globalContextMenu, true);
    cpsListenerAdded = true;
  }
  function removeCPSListeners() {
    if (!cpsListenerAdded) return;
    try {
      window.removeEventListener("mousedown", globalMouseDown, true);
      window.removeEventListener("mouseup", globalMouseUp, true);
      window.removeEventListener("contextmenu", globalContextMenu, true);
    } catch (e) {}
    cpsListenerAdded = false;
  }

  function startCPSInterval() {
    if (cpsIntervalId) return;
    cpsIntervalId = setInterval(() => {
      lastLeftCPS = leftClicks; lastRightCPS = rightClicks;
      if (cpsUI) cpsUI.textContent = lastLeftCPS + " | " + lastRightCPS;
      leftClicks = 0; rightClicks = 0;
    }, 1000);
  }
  function stopCPSInterval() { if (!cpsIntervalId) return; clearInterval(cpsIntervalId); cpsIntervalId = null; }

  function checkCPSUsage() {
    if (!state.cps && !state.compactHud) { removeCPSListeners(); stopCPSInterval(); }
    else { addCPSListeners(); startCPSInterval(); }
  }

  // Keystrokes
  const keyState = { w:false, a:false, s:false, d:false };
  let keyHandlersAdded = false;
  function keyDownHandler(e) {
    try {
      const tg = e.target;
      if (isClientUIEvent(tg)) return;
      if (isTypingTarget(tg)) return;
      const k = (e.key || "").toLowerCase();
      if (k in keyState && !keyState[k]) { keyState[k] = true; refreshKeyUI(); }
    } catch (e) {}
  }
  function keyUpHandler(e) {
    try {
      const tg = e.target;
      if (isClientUIEvent(tg)) return;
      if (isTypingTarget(tg)) return;
      const k = (e.key || "").toLowerCase();
      if (k in keyState && keyState[k]) { keyState[k] = false; refreshKeyUI(); }
    } catch (e) {}
  }
  function ensureKeyHandlers() { if (keyHandlersAdded) return; window.addEventListener("keydown", keyDownHandler); window.addEventListener("keyup", keyUpHandler); keyHandlersAdded = true; }

  // Ping
  let pingIntervalRef = null;
  async function measurePingAndStore() {
    try {
      const url = location.origin + "/favicon.ico";
      const start = performance.now();
      await fetch(url, { method: "HEAD", cache: "no-store" });
      const ms = Math.max(0, Math.round(performance.now() - start));
      pingValue = ms;
      if (pingUI) pingUI.textContent = "Ping: " + ms + " ms";
    } catch (e) { pingValue = null; if (pingUI) pingUI.textContent = "Ping: —"; }
  }

  // Armorr preview
  let armorInterval = null;
  function startArmorPolling() { if (armorInterval) return; armorInterval = setInterval(updateArmorPreview, 2500); }
  function stopArmorPolling() { if (!armorInterval) return; clearInterval(armorInterval); armorInterval = null; }

  function updateArmorPreview() {
    if (!armorUI) return;
    const img = armorUI.querySelector("img");
    let found = null;
    try {
      if (window.player && window.player.avatar && window.player.avatar.armorImage) found = window.player.avatar.armorImage;
      else if (window.game && window.game.player && window.game.player.armorUrl) found = window.game.player.armorUrl;
      if (!found) {
        const selectors = ["img.armor-image", ".player-armor img", ".avatar-armor img", "[data-armor] img"];
        for (const s of selectors) {
          try { const el = document.querySelector(s); if (el && el.src) { found = el.src; break; } } catch (e) {}
        }
      }
      if (!found && state.bound && state.bound.armorPath) {
        const el = queryDomPath(state.bound.armorPath);
        if (el) {
          if (el.tagName === "IMG" && el.src) found = el.src;
          else {
            const bg = window.getComputedStyle(el).backgroundImage || "";
            const m = bg.match(/url\(["']?(.*?)["']?\)/);
            if (m && m[1]) found = m[1];
          }
        }
      }
    } catch (e) {}
    if (!found && state.armorImage) found = state.armorImage;
    if (found) { img.src = found; img.style.display = ""; } else { img.src = ""; img.style.display = "none"; }
  }

  // Cape / cloth sim
  function applyCape(spec) {
    cleanupCapeResources();
    if (!spec) return;
    if (spec === "gray" || spec === "dark" || spec === "rainbow") {
      const tmp = document.createElement("canvas"); tmp.width = 160; tmp.height = 240;
      const ctx = tmp.getContext("2d");
      if (spec === "gray") { const g = ctx.createLinearGradient(0,0,0,tmp.height); g.addColorStop(0,"#ddd"); g.addColorStop(1,"#999"); ctx.fillStyle=g; ctx.fillRect(0,0,tmp.width,tmp.height); }
      else if (spec === "dark") { const g = ctx.createLinearGradient(0,0,0,tmp.height); g.addColorStop(0,"#111"); g.addColorStop(1,"#333"); ctx.fillStyle=g; ctx.fillRect(0,0,tmp.width,tmp.height); }
      else { const g = ctx.createLinearGradient(0,0,tmp.width,0); g.addColorStop(0,"red"); g.addColorStop(0.25,"orange"); g.addColorStop(0.5,"yellow"); g.addColorStop(0.75,"green"); g.addColorStop(1,"blue"); ctx.fillStyle = g; ctx.fillRect(0,0,tmp.width,tmp.height); }
      const img = new Image(); img.src = tmp.toDataURL(); img.onload = () => initCapeCanvas(img);
      return;
    }
    if (spec.startsWith("custom:")) {
      const i = parseInt(spec.split(":")[1], 10);
      const obj = state.customCapes[i];
      if (obj && obj.dataUrl) {
        const img = new Image(); img.crossOrigin = "anonymous";
        img.onload = () => initCapeCanvas(img);
        img.onerror = () => showToast("Failed to load cape image");
        img.src = obj.dataUrl;
      }
      return;
    }
    const tmp = document.createElement("canvas"); tmp.width = 160; tmp.height = 240;
    const ctx = tmp.getContext("2d"); ctx.fillStyle = "#222"; ctx.fillRect(0,0,tmp.width,tmp.height);
    const img = new Image(); img.src = tmp.toDataURL(); img.onload = () => initCapeCanvas(img);
  }

  function initCapeCanvas(img) {
    cleanupCapeResources();
    capeImage = img;
    capeCanvas = document.createElement("canvas");
    capeCanvas.width = Math.max(64, img.width);
    capeCanvas.height = Math.max(96, img.height);
    capeCanvas.style.position = "fixed";
    capeCanvas.style.pointerEvents = "none";
    capeCanvas.style.zIndex = "2147483645";

    const saved = (state.positions && state.positions.cape) ? state.positions.cape : null;
    if (saved) {
      if (saved.left !== undefined) { capeCanvas.style.left = saved.left + "px"; capeCanvas.style.right = ""; }
      else if (saved.right !== undefined) { capeCanvas.style.right = saved.right + "px"; capeCanvas.style.left = ""; }
      if (saved.top !== undefined) { capeCanvas.style.top = saved.top + "px"; capeCanvas.style.bottom = ""; }
      else if (saved.bottom !== undefined) { capeCanvas.style.bottom = saved.bottom + "px"; capeCanvas.style.top = ""; }
    } else {
      capeCanvas.style.left = "0px"; capeCanvas.style.top = "0px";
    }

    capeCanvas.style.width = capeCanvas.width + "px";
    capeCanvas.style.height = capeCanvas.height + "px";
    capeCanvas.style.transformOrigin = "0 0";
    capeCanvas.style.imageRendering = "pixelated";

    document.body.appendChild(capeCanvas);
    capeCtx = capeCanvas.getContext("2d");

    if (!state.locked) makeDraggable(capeCanvas, "cape", { storePositionAs: "cape" });

    const cols = 8, rows = 12;
    cloth = { cols, rows, nodes: [], width: capeCanvas.width, height: capeCanvas.height };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / (cols - 1)) * cloth.width;
        const y = (r / (rows - 1)) * cloth.height;
        cloth.nodes.push({ x, y, px: x, py: y, locked: r === 0 });
      }
    }

    try { capeCtx.drawImage(capeImage, 0, 0, capeCanvas.width, capeCanvas.height); } catch (e) {}

    if (state.enableCapeFollow && !state.safeMode && state.bound && state.bound.playerPath) startCapeClothLoop();
  }

  function cleanupCapeResources() {
    try { if (clothAnim) cancelAnimationFrame(clothAnim); } catch (e) {}
    clothAnim = null;
    try { if (capeCanvas) { removeDraggable(capeCanvas); capeCanvas.remove(); } } catch (e) {}
    capeCanvas = null; capeCtx = null; capeImage = null; cloth = null;
  }

  function startCapeClothLoop() {
    if (!capeCanvas || !cloth || !capeCtx || !capeImage) return;
    if (state.safeMode) return;
    if (document.hidden) return;
    if (clothAnim) cancelAnimationFrame(clothAnim);
    let last = performance.now();
    const cols = cloth.cols, rows = cloth.rows, nodes = cloth.nodes;

    function step() {
      if (!capeCanvas || !capeImage || !state.cape) { try { if (clothAnim) cancelAnimationFrame(clothAnim); } catch (e) {} clothAnim = null; return; }
      if (document.hidden) { clothAnim = requestAnimationFrame(step); return; }
      clothAnim = requestAnimationFrame(step);
      const now = performance.now(); const dt = Math.min(0.033, (now - last) / 1000); last = now;

      const anchorEl = queryDomPath(state.bound.playerPath);
      if (!anchorEl) return;
      const rect = anchorEl.getBoundingClientRect();
      const anchorX = rect.left + rect.width / 2;
      const anchorY = rect.top + rect.height * 0.18;
      const baseX = anchorX - (cloth.width / 2);
      const baseY = anchorY;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.locked) {
          const col = i % cols;
          const nx = baseX + (col / (cols - 1)) * cloth.width;
          const ny = baseY;
          n.x = n.px = nx; n.y = n.py = ny;
          continue;
        }
        const vx = (n.x - n.px), vy = (n.y - n.py);
        n.px = n.x; n.py = n.y;
        n.x += vx * 0.99;
        n.y += vy * 0.99 + (980 * dt * dt);
      }

      const iterations = 3;
      for (let it = 0; it < iterations; it++) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            if (c < cols - 1) relax(nodes[i], nodes[i + 1], cloth.width / (cols - 1));
            if (r < rows - 1) relax(nodes[i], nodes[i + cols], cloth.height / (rows - 1));
          }
        }
      }

      capeCtx.clearRect(0, 0, capeCanvas.width, capeCanvas.height);
      try { capeCtx.drawImage(capeImage, 0, 0, capeCanvas.width, capeCanvas.height); } catch (e) { capeCtx.fillStyle = "#222"; capeCtx.fillRect(0, 0, capeCanvas.width, capeCanvas.height); }
      capeCtx.globalCompositeOperation = "multiply"; capeCtx.fillStyle = "rgba(0,0,0,0.06)";
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const n00 = nodes[r * cols + c], n11 = nodes[(r + 1) * cols + (c + 1)];
          const cx = (n00.x + n11.x) / 2 - baseX;
          const cy = (n00.y + n11.y) / 2 - baseY;
          capeCtx.fillRect(cx - 2, cy - 2, 4, 4);
        }
      }
      capeCtx.globalCompositeOperation = "source-over";
      capeCanvas.style.left = Math.round(baseX) + "px";
      capeCanvas.style.top = Math.round(baseY) + "px";
    }

    clothAnim = requestAnimationFrame(step);
  }

  function stopCapeFollow() { try { if (clothAnim) cancelAnimationFrame(clothAnim); } catch (e) {} clothAnim = null; }

  function relax(a, b, rest) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const diff = (dist - rest) / dist;
    const invA = a.locked ? 0 : 1, invB = b.locked ? 0 : 1;
    const sum = invA + invB;
    if (sum === 0) return;
    const k = 0.5;
    if (!a.locked) { a.x += dx * diff * (invA / sum) * k; a.y += dy * diff * (invA / sum) * k; }
    if (!b.locked) { b.x -= dx * diff * (invB / sum) * k; b.y -= dy * diff * (invB / sum) * k; }
  }

  // Picker
  let pickerActive = false, pickerMode = null;
  function startElementPicker(mode) {
    if (pickerActive) return;
    pickerActive = true; pickerMode = mode;
    showToast(`Picker: click element to bind (${mode}). Esc to cancel.`, 3000);

    const onMove = ev => { document.documentElement.style.cursor = "crosshair"; ev.stopPropagation(); };
    const onClick = ev => {
      ev.preventDefault(); ev.stopPropagation(); document.documentElement.style.cursor = "";
      const el = ev.target;
      if (isClientUIEvent(el)) { cleanup("Picker cancelled (clicked client UI)"); return; }
      const path = getDomPath(el);
      if (!path) { cleanup("Can't bind that element."); return; }
      if (pickerMode === "armor") {
        state.bound.armorPath = path;
        if (el.tagName === "IMG" && el.src) state.armorImage = el.src;
        else {
          const bg = window.getComputedStyle(el).backgroundImage || "";
          const m = bg.match(/url\(["']?(.*?)["']?\)/);
          if (m && m[1]) state.armorImage = m[1];
        }
        saveState(); updateArmorPreview(); cleanup("Armor bound.");
      } else if (pickerMode === "chat") {
        state.bound.chatPath = path; saveState(); applyChatTransparency(); cleanup("Chat bound (75% opacity).");
      } else if (pickerMode === "player") {
        state.bound.playerPath = path; saveState();
        if (state.enableCapeFollow && !state.safeMode && state.cape) startCapeClothLoop();
        cleanup("Player bound.");
      } else cleanup("Unknown pick mode.");
    };

    const onKey = ev => { if (ev.key === "Escape") cleanup("Picker cancelled."); };

    function cleanup(msg) {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      document.documentElement.style.cursor = "";
      pickerActive = false; pickerMode = null;
      if (msg) showToast(msg);
    }

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
  }

  // -----------------------
  // Chat transparency / texture / FPS
  // -----------------------
  let chatStyleEl = null;
  function applyChatTransparency() {
    if (chatStyleEl) chatStyleEl.remove();
    if (!state.bound || !state.bound.chatPath) return;
    const sel = state.bound.chatPath;
    const css = `${sel} { opacity: 0.75 !important; }`;
    chatStyleEl = document.createElement("style"); chatStyleEl.id = "null-client-chat-style"; chatStyleEl.textContent = css;
    (document.head || document.documentElement).appendChild(chatStyleEl);
  }

  const CLIENT_STYLE_ID = "null-client-style";
  function applyTexture(mode) {
    removeClientStyle();
    state.texture = mode || "";
    if (!mode) { saveState(); return; }
    let css = "";
    if (mode === "mono") css = `canvas, img, video, [data-game-canvas] { filter: grayscale(1) contrast(1.2) !important; }`;
    else if (mode === "highcontrast") css = `canvas, img, video, [data-game-canvas] { filter: contrast(1.5) brightness(0.95) !important; }`;
    if (css) { const s = document.createElement("style"); s.id = CLIENT_STYLE_ID; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
    saveState();
  }
  function removeClientStyle() { const old = document.getElementById(CLIENT_STYLE_ID); if (old) old.remove(); }

  // FPS
  const FPS_STYLE_ID = "null-client-fps-style";
  function applyFPSStateToCanvas(c) {
    try {
      if (!(c instanceof HTMLCanvasElement)) return;
      if (!canvasesMeta.has(c)) {
        canvasesMeta.set(c, {
          origWidth: c.width,
          origHeight: c.height,
          origStyleWidth: c.style.width || c.width + "px",
          origStyleHeight: c.style.height || c.height + "px",
          origTransform: c.style.transform || "",
          origImageRendering: c.style.imageRendering || ""
        });
      }
      const meta = canvasesMeta.get(c);
      if (state.fps.scale === 1) {
        c.style.transform = meta.origTransform;
        c.style.width = meta.origStyleWidth;
        c.style.height = meta.origStyleHeight;
        c.style.imageRendering = meta.origImageRendering;
      } else {
        if (state.safeMode) {
          c.style.transform = meta.origTransform;
          c.style.width = meta.origStyleWidth;
          c.style.height = meta.origStyleHeight;
          c.style.imageRendering = meta.origImageRendering;
        } else {
          const inv = 1 / state.fps.scale;
          c.style.transformOrigin = "0 0";
          c.style.transform = `scale(${inv})`;
          c.style.width = meta.origStyleWidth;
          c.style.height = meta.origStyleHeight;
          c.style.imageRendering = "pixelated";
        }
      }
    } catch (e) {}
  }

  function applyFPSState() {
    if (state.safeMode && state.fps.scale !== 1) { state.fps.scale = 1; saveState(); showToast("Canvas scaling disabled by Safe Mode"); }
    document.querySelectorAll("canvas").forEach(c => applyFPSStateToCanvas(c));
    const old = document.getElementById(FPS_STYLE_ID); if (old) old.remove();
    let css = "";
    if (state.fps.pauseAnimations) css += `canvas, [data-game-canvas], .game-root, .game-root * { animation-play-state: paused !important; transition: none !important; }`;
    if (state.fps.removeBackgrounds) css += `.game-root, [data-game-canvas] { background-image: none !important; background: none !important; }`;
    if (css) { const s = document.createElement("style"); s.id = FPS_STYLE_ID; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  }

  function ensureCanvasObserver() {
    if (canvasObserver) return;
    canvasObserver = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 200) continue;
        for (const node of m.addedNodes) {
          try {
            if (!node || node.nodeType !== 1) continue;
            if (node.tagName === "CANVAS") pendingCanvasNodes.add(node);
            else {
              const found = node.querySelectorAll && node.querySelectorAll("canvas");
              if (found && found.length) {
                for (let i = 0; i < found.length && i < 50; i++) pendingCanvasNodes.add(found[i]);
              }
            }
          } catch (e) {}
        }
      }
      if (!canvasObserverScheduled) {
        canvasObserverScheduled = true;
        requestAnimationFrame(() => {
          canvasObserverScheduled = false;
          if (pendingCanvasNodes.size === 0) return;
          const toProcess = Array.from(pendingCanvasNodes);
          pendingCanvasNodes.clear();
          toProcess.forEach(c => { try { applyFPSStateToCanvas(c); } catch (e) {} });
        });
      }
    });
    try { canvasObserver.observe(document.documentElement || document.body, { childList: true, subtree: true }); } catch (e) {}
  }

  function disconnectCanvasObserver() { if (!canvasObserver) return; canvasObserver.disconnect(); canvasObserver = null; pendingCanvasNodes.clear(); }

  // Widget utilities
  function widgetStyle(key) {
    const pos = (state.positions && state.positions[key]) ? state.positions[key] : {};
    const pieces = [];
    if (pos.bottom !== undefined) pieces.push("bottom:" + pos.bottom + "px");
    if (pos.top !== undefined) pieces.push("top:" + pos.top + "px");
    if (pos.left !== undefined) pieces.push("left:" + pos.left + "px");
    if (pos.right !== undefined) pieces.push("right:" + pos.right + "px");
    pieces.push("position:fixed");
    pieces.push("background:rgba(12,13,14,0.85)");
    pieces.push("border-radius:8px");
    pieces.push("border:1px solid rgba(255,255,255,0.03)");
    pieces.push("color:#dff3ff");
    pieces.push("padding:6px");
    pieces.push("transition:left .12s ease, top .12s ease, transform .12s ease, opacity .12s ease");
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
    let startX = 0, startY = 0, startLeft = 0, startTop = 0, dragging = false;

    const onDown = (ev) => {
      if (ev.button !== 0) return;
      ev.preventDefault();
      startX = ev.clientX; startY = ev.clientY;
      const rect = el.getBoundingClientRect(); startLeft = rect.left; startTop = rect.top;
      dragging = false;
      const onMove = (mv) => {
        mv.preventDefault();
        const dx = mv.clientX - startX, dy = mv.clientY - startY;
        if (!dragging && Math.hypot(dx, dy) > 6) dragging = true;
        if (dragging) {
          const nl = Math.max(0, Math.round(startLeft + dx));
          const nt = Math.max(0, Math.round(startTop + dy));
          el.style.left = nl + "px"; el.style.top = nt + "px"; el.style.right = ""; el.style.bottom = "";
        }
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        if (dragging) {
          const b = el.getBoundingClientRect();
          state.positions = state.positions || {};
          state.positions[storeKey] = { top: Math.max(0, Math.round(b.top)), left: Math.max(0, Math.round(b.left)) };
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
    if (!el) return;
    const h = DRAGMAP.get(el);
    if (h) { el.removeEventListener("mousedown", h); DRAGMAP.delete(el); }
    el.style.cursor = "";
  }

  function updateLockState() {
    const keys = ["keystrokes", "cps", "ping", "armor", "cape", "compactHud"];
    for (const k of keys) {
      const el = getWidget(k);
      if (!el) continue;
      if (!state.locked) makeDraggable(el, k, { storePositionAs: k === "cape" ? "cape" : k });
      else removeDraggable(el);
    }
  }

  function getWidget(key) {
    if (key === "keystrokes") return keyUI;
    if (key === "cps") return cpsUI;
    if (key === "ping") return pingUI;
    if (key === "armor") return armorUI;
    if (key === "cape") return capeCanvas || null;
    if (key === "compactHud") return compactHudEl;
    return null;
  }

  function attachWidgetClickToggle(el, widgetKey) {
    if (!el) return;
    let down = null;
    const downHandler = (ev) => { if (ev.button !== 0) return; down = { x: ev.clientX, y: ev.clientY, t: Date.now() }; };
    const upHandler = (ev) => {
      if (!down) return;
      const dx = ev.clientX - down.x, dy = ev.clientY - down.y;
      if (Math.hypot(dx, dy) <= 6 && (Date.now() - down.t) < 500) {
        if (widgetKey === "keystrokes") { state.keystrokes = !state.keystrokes; toggleKeystrokes(state.keystrokes); saveState(); showToast("Keystrokes " + (state.keystrokes ? "enabled" : "disabled")); }
        else if (widgetKey === "cps") { state.cps = !state.cps; toggleCPS(state.cps); saveState(); showToast("CPS " + (state.cps ? "enabled" : "disabled")); }
        else if (widgetKey === "ping") { state.ping = !state.ping; togglePing(state.ping); saveState(); showToast("Ping " + (state.ping ? "enabled" : "disabled")); }
        else if (widgetKey === "armor") { state.armor = !state.armor; toggleArmor(state.armor); saveState(); showToast("Armor view " + (state.armor ? "enabled" : "disabled")); }
        else if (widgetKey === "cape") { if (state.cape) { state.cape = null; applyCape(null); saveState(); cleanupCapeResources(); showToast("Cape disabled"); } else showToast("Select a cape in Accessories"); }
        else if (widgetKey === "compactHud") { state.compactHud = !state.compactHud; toggleCompactHud(state.compactHud); saveState(); showToast("Compact HUD " + (state.compactHud ? "enabled" : "disabled")); }
      }
      down = null;
    };
    el.addEventListener("mousedown", downHandler);
    el.addEventListener("mouseup", upHandler);
  }

  // Toggle implementations
  function toggleKeystrokes(on) {
    if (on && !keyUI) {
      keyUI = document.createElement("div");
      keyUI.style.cssText = widgetStyle("keystrokes") + "display:flex;gap:6px;align-items:center;justify-content:center;padding:6px 8px;font-size:12px;";
      ["W","A","S","D"].forEach(k => {
        const b = document.createElement("div"); b.textContent = k; b.dataset.key = k.toLowerCase();
        Object.assign(b.style, { padding:"6px 8px", background:"#0c0d0e", borderRadius:"6px", color:"#cfe7ff", border:"1px solid rgba(255,255,255,0.03)", minWidth:"20px", textAlign:"center", transition:"background .12s" });
        keyUI.appendChild(b);
      });
      const ctrl = document.createElement("div"); ctrl.style.display="flex"; ctrl.style.flexDirection="column"; ctrl.style.marginLeft="8px"; ctrl.style.gap="4px";
      const lmb = document.createElement("div"); lmb.textContent="LMB"; lmb.style.fontSize="11px"; lmb.style.color="#9fbddf"; lmb.dataset.btn="lmb";
      const rmb = document.createElement("div"); rmb.textContent="RMB"; rmb.style.fontSize="11px"; rmb.style.color="#9fbddf"; rmb.dataset.btn="rmb";
      ctrl.appendChild(lmb); ctrl.appendChild(rmb); keyUI.appendChild(ctrl);
      document.body.appendChild(keyUI);
      positionWidget(keyUI, "keystrokes");
      attachWidgetClickToggle(keyUI, "keystrokes");
      if (!state.locked) makeDraggable(keyUI, "keystrokes");
      ensureKeyHandlers();
    } else if (!on && keyUI) { keyUI.remove(); keyUI = null; }
  }

  function refreshKeyUI() {
    if (!keyUI) return;
    for (const child of keyUI.children) {
      const k = child.dataset && child.dataset.key;
      if (!k) continue;
      if (keyState[k]) { child.style.background = "#1f6feb"; child.style.color = "#fff"; child.style.transform = "translateY(-1px)"; }
      else { child.style.background = "#0c0d0e"; child.style.color = "#cfe7ff"; child.style.transform = ""; }
    }
  }

  function toggleCPS(on) {
    state.cps = !!on; saveState(); checkCPSUsage();
    if (on && !cpsUI) {
      cpsUI = document.createElement("div");
      cpsUI.style.cssText = widgetStyle("cps") + "width:94px;height:30px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;";
      cpsUI.textContent = lastLeftCPS + " | " + lastRightCPS;
      document.body.appendChild(cpsUI);
      positionWidget(cpsUI, "cps");
      attachWidgetClickToggle(cpsUI, "cps");
      if (!state.locked) makeDraggable(cpsUI, "cps");
    } else if (!on && cpsUI) { cpsUI.remove(); cpsUI = null; checkCPSUsage(); }
  }

  function togglePing(on) {
    state.ping = !!on; saveState();
    if (on && !pingUI) {
      pingUI = document.createElement("div");
      pingUI.style.cssText = widgetStyle("ping") + "width:110px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;";
      pingUI.textContent = pingValue !== null ? "Ping: " + pingValue + " ms" : "Ping: ...";
      document.body.appendChild(pingUI);
      positionWidget(pingUI, "ping");
      measurePingAndStore();
      pingIntervalRef = setInterval(measurePingAndStore, 2000);
      attachWidgetClickToggle(pingUI, "ping");
      if (!state.locked) makeDraggable(pingUI, "ping");
    } else if (!on && pingUI) { clearInterval(pingIntervalRef); pingIntervalRef = null; pingUI.remove(); pingUI = null; }
  }

  function toggleArmor(on) {
    state.armor = !!on; saveState();
    if (on && !armorUI) {
      armorUI = document.createElement("div");
      armorUI.style.cssText = widgetStyle("armor") + "width:140px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;";
      const title = document.createElement("div"); title.textContent = "Armor"; title.style.fontSize = "12px"; title.style.color = "#dbeffb";
      const img = document.createElement("img"); img.style.width = "96px"; img.style.height = "96px"; img.style.objectFit = "cover"; img.style.borderRadius = "8px";
      armorUI.appendChild(title); armorUI.appendChild(img);
      document.body.appendChild(armorUI);
      positionWidget(armorUI, "armor");
      updateArmorPreview();
      attachWidgetClickToggle(armorUI, "armor");
      if (!state.locked) makeDraggable(armorUI, "armor");
      startArmorPolling();
    } else if (!on && armorUI) { armorUI.remove(); armorUI = null; stopArmorPolling(); }
  }

  function toggleCompactHud(on) { state.compactHud = !!on; saveState(); if (on) createCompactHud(); else removeCompactHud(); }

  // Compact HUD
  function createCompactHud() {
    if (compactHudEl) return;
    compactHudEl = document.createElement("div");
    compactHudEl.style.cssText = widgetStyle("compactHud") + "display:flex;gap:8px;align-items:center;padding:8px;border-radius:10px;min-width:140px;background:rgba(8,9,10,0.78);backdrop-filter:blur(4px);";
    const cpsPart = document.createElement("div"); cpsPart.style.fontWeight = "700"; cpsPart.style.fontSize = "13px"; cpsPart.style.color = "#e6f3ff"; cpsPart.textContent = "0 | 0";
    const keysPart = document.createElement("div"); keysPart.style.display = "flex"; keysPart.style.gap = "6px"; keysPart.style.alignItems = "center";
    ["W","A","S","D"].forEach(k => { const b=document.createElement("div"); b.textContent=k; b.style.padding="4px 6px"; b.style.background="#0c0d0e"; b.style.borderRadius="6px"; b.style.color="#cfe7ff"; b.style.fontSize="12px"; b.dataset.key=k.toLowerCase(); keysPart.appendChild(b); });
    const pingPart = document.createElement("div"); pingPart.style.fontSize = "12px"; pingPart.style.color = "#cfe7ff"; pingPart.textContent = pingValue !== null ? "Ping: " + pingValue + " ms" : "Ping: ...";
    compactHudEl.appendChild(cpsPart); compactHudEl.appendChild(keysPart); compactHudEl.appendChild(pingPart);
    document.body.appendChild(compactHudEl);
    positionWidget(compactHudEl, "compactHud");
    attachWidgetClickToggle(compactHudEl, "compactHud");
    if (!state.locked) makeDraggable(compactHudEl, "compactHud");

    compactHudInterval = setInterval(() => {
      if (!compactHudEl) return;
      cpsPart.textContent = (lastLeftCPS || 0) + " | " + (lastRightCPS || 0);
      pingPart.textContent = pingValue !== null ? "Ping: " + pingValue + " ms" : "Ping: ...";
      for (const child of keysPart.children) {
        const k = child.dataset.key;
        if (keyState[k]) { child.style.background = "#1f6feb"; child.style.color = "#fff"; child.style.transform = "translateY(-1px)"; } else { child.style.background = "#0c0d0e"; child.style.color = "#cfe7ff"; child.style.transform = ""; }
      }
    }, 500);

    checkCPSUsage();
  }
  function removeCompactHud() { if (!compactHudEl) return; if (compactHudInterval) { clearInterval(compactHudInterval); compactHudInterval = null; } compactHudEl.remove(); compactHudEl = null; checkCPSUsage(); }

  // UI creation & renderers
  function createUI() {
    if (uiRoot) return;
    uiRoot = document.createElement("div");
    uiRoot.style.cssText = "position:fixed; inset:0; z-index:2147483646; display:none;";
    document.body.appendChild(uiRoot);
    const shadow = uiRoot.attachShadow({ mode: "open" });

    // use innerHTML once, then always query from the shadow root using querySelector
    shadow.innerHTML = `
      <style>
        :host{ all: initial; } *{ box-sizing:border-box; font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,Arial; }
        .frame{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(.98); width:860px; height:460px; background:linear-gradient(180deg,#0f1113,#0b0c0d); border-radius:12px; color:#e7eef6; box-shadow:0 10px 40px rgba(2,6,10,0.75); overflow:hidden; border:1px solid rgba(255,255,255,0.03); opacity:0; transition:opacity .18s ease, transform .18s ease; }
        .frame.open{ opacity:1; transform:translate(-50%,-50%) scale(1); }
        .sidebar{ width:170px; background:linear-gradient(180deg,#0b0c0d,#0a0b0c); padding:14px; display:flex; flex-direction:column; gap:10px; border-right:1px solid rgba(255,255,255,0.02); }
        .logo{ display:flex; align-items:center; gap:10px; } .logo img{ width:34px; height:34px; border-radius:6px; } .brand{ font-weight:700; font-size:14px; } .version{ font-size:11px; color:#99a2ad; }
        .nav{ margin-top:8px; display:flex; flex-direction:column; gap:6px; } .nav button{ background:transparent; border:1px solid transparent; color:#cfd8df; text-align:left; padding:8px 10px; border-radius:8px; cursor:pointer; font-size:13px; transition:background .12s; }
        .nav button.active{ background:#121416; border-color:rgba(255,255,255,0.02); color:#fff; }
        .main{ flex:1; padding:18px; display:flex; flex-direction:column; } .header{ display:flex; justify-content:space-between; align-items:center; }
        .title{ font-weight:700; font-size:16px; } .subtitle{ color:#98a2ac; font-size:12px; }
        .grid{ margin-top:14px; display:flex; gap:12px; flex-wrap:wrap; }
        .card{ width:240px; min-height:92px; background:linear-gradient(180deg,#0e1012,#0b0c0d); border-radius:10px; padding:12px; border:1px solid rgba(255,255,255,0.02); box-shadow:0 8px 18px rgba(2,6,10,0.5); transition:transform .12s; }
        .card:hover{ transform:translateY(-6px); } .card-title{ font-weight:700; margin-bottom:8px; font-size:13px; } .card-desc{ color:#98a2ac; font-size:12px; margin-bottom:8px; }
        .toggle-row{ display:flex; align-items:center; justify-content:space-between; background:linear-gradient(180deg,#0b0c0d,#0a0b0c); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.02); }
        .switch{ width:46px; height:24px; border-radius:14px; background:#202427; position:relative; cursor:pointer; border:1px solid rgba(255,255,255,0.03); transition:background .12s; }
        .switch.on{ background:linear-gradient(90deg,#2b9aff,#1fb1ff); } .knob{ width:20px; height:20px; border-radius:10px; background:#fff; position:absolute; top:2px; left:2px; transition:all .12s; } .switch.on .knob{ left:24px; }
        .small{ font-size:12px; color:#9aa6b0; } .btn{ padding:6px 10px; border-radius:8px; background:#1c1f22; border:1px solid rgba(255,255,255,0.03); color:#e7eef6; cursor:pointer; }
        .picker-hint{ font-size:12px; color:#9aa6b0; margin-top:8px; } input[type="url"], input[type="file"]{ color:#dfe8ef; background:#0b0b0b; padding:6px; border-radius:6px; border:1px solid rgba(255,255,255,0.03); }
      </style>

      <div class="frame" id="frame">
        <div class="sidebar">
          <div class="logo"><img src="https://i.postimg.cc/xjzYxS0R/Null-Client.png" alt="logo"><div><div class="brand">Null Client</div><div class="version">v1.2</div></div></div>
          <div class="nav" id="nav">
            <button data-tab="player" class="active">Player</button>
            <button data-tab="accessories">Accessories</button>
            <button data-tab="visual">Visual</button>
            <button data-tab="combat">Combat</button>
            <div class="spacer"></div>
            <button data-tab="settings">Settings</button>
            <button id="closeBtn">Exit</button>
          </div>
        </div>

        <div class="main">
          <div class="header"><div><div class="title" id="mainTitle">Player</div><div class="subtitle" id="mainSub">Client-side player widgets</div></div><div><button class="btn" id="hideHelp">Help</button></div></div>
          <div class="grid" id="gridArea"></div>
          <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; color:#98a2ac; font-size:12px;">
            <div>Right Shift to open/close</div>
            <div class="small">Client-only • Safe Mode ON by default</div>
          </div>
        </div>
      </div>
    `;

    // robust queries / guard against null
    const s = getShadowRoot();
    if (!s) return;

    const nav = s.querySelector("#nav");
    if (nav) {
      nav.addEventListener("click", e => {
        const btn = e.target.closest("button"); if (!btn) return;
        if (btn.id === "closeBtn") { uiOpen = false; hideUI(); return; }
        for (const b of nav.querySelectorAll("button")) b.classList.remove("active");
        btn.classList.add("active");
        const tab = btn.dataset.tab;
        const title = s.querySelector("#mainTitle");
        const sub = s.querySelector("#mainSub");
        const grid = s.querySelector("#gridArea");
        if (!grid) return;
        grid.innerHTML = "";
        if (tab === "player") { if (title) title.textContent = "Player"; if (sub) sub.textContent = "Widgets: Keystrokes, CPS, Ping, Armor"; renderPlayerGrid(grid); }
        else if (tab === "accessories") { if (title) title.textContent = "Accessories"; if (sub) sub.textContent = "Capes & binding tools"; renderAccessoriesGrid(grid); }
        else if (tab === "visual") { if (title) title.textContent = "Visual"; if (sub) sub.textContent = "Texture pack & FPS boost"; renderVisualGrid(grid); }
        else if (tab === "combat") { if (title) title.textContent = "Combat"; if (sub) sub.textContent = "Cosmetic combat tools"; renderCombatGrid(grid); }
        else if (tab === "settings") { if (title) title.textContent = "Settings"; if (sub) sub.textContent = "Safe Mode, locking, import capes"; renderSettingsGrid(grid); }
      });
    }

    // initial render
    const initialGrid = s.querySelector("#gridArea");
    if (initialGrid) renderPlayerGrid(initialGrid);
    const hideBtn = s.querySelector("#hideHelp");
    if (hideBtn) hideBtn.onclick = () => showToast("Help available in Settings and in the included docs.");
  }

  // Renderers & startup
  function makeToggleCard(title, desc, stateKey) {
    const el = document.createElement("div"); el.className = "card";
    el.innerHTML = `<div class="card-title">${title}</div><div class="card-desc">${desc}</div><div class="toggle-row"><div class="label small">Enable</div><div class="switch ${state[stateKey] ? "on" : ""}" data-key="${stateKey}"><div class="knob"></div></div></div>`;
    const sw = el.querySelector(".switch");
    if (sw) {
      sw.addEventListener("click", () => {
        const key = sw.dataset.key;
        state[key] = !state[key]; saveState(); sw.classList.toggle("on", !!state[key]);
        if (key === "keystrokes") toggleKeystrokes(state[key]);
        if (key === "cps") toggleCPS(state[key]);
        if (key === "ping") togglePing(state[key]);
        if (key === "armor") toggleArmor(state[key]);
        if (key === "compactHud") toggleCompactHud(state[key]);
        checkCPSUsage();
      });
    }
    return el;
  }

  function renderPlayerGrid(container) {
    if (!container) return;
    container.appendChild(makeToggleCard("CPS Counter", "Counts left & right clicks per second (left | right)", "cps"));
    container.appendChild(makeToggleCard("Ping Counter", "Estimate network latency (client-side)", "ping"));
    container.appendChild(makeToggleCard("Keystrokes", "Shows WASD input (small overlay)", "keystrokes"));

    const armorCard = makeToggleCard("Armor View", "Local armor preview (no background)", "armor");
    const detectDiv = document.createElement("div"); detectDiv.className = "small"; detectDiv.style.marginTop = "8px";
    detectDiv.innerHTML = `<button id="detectArmor" class="btn">Detect / Bind armor element</button> <span class="picker-hint">Click the armor image or player name label</span>`;
    armorCard.appendChild(detectDiv);
    container.appendChild(armorCard);
    setTimeout(()=>{ const btn = armorCard.querySelector("#detectArmor"); if (btn) btn.onclick = () => startElementPicker("armor"); }, 0);

    const compactCard = document.createElement("div"); compactCard.className = "card";
    compactCard.innerHTML = `<div class="card-title">Compact HUD</div><div class="card-desc">Combine CPS / Keystrokes / Ping into a single small movable panel</div><div style="margin-top:8px;"><label class="small"><input id="compactToggle" type="checkbox"> Enable Compact HUD</label></div>`;
    container.appendChild(compactCard);
    setTimeout(()=> {
      const chk = compactCard.querySelector("#compactToggle");
      if (chk) {
        chk.checked = !!state.compactHud;
        chk.onchange = e => { state.compactHud = !!e.target.checked; saveState(); toggleCompactHud(state.compactHud); checkCPSUsage(); };
      }
    }, 0);
  }

  function renderAccessoriesGrid(container) {
    if (!container) return;
    const capesCard = document.createElement("div"); capesCard.className = "card";
    capesCard.innerHTML = `<div class="card-title">Capes</div><div class="card-desc">Apply a local cape (client-side only). Custom capes can be uploaded.</div>`;
    const btnRow = document.createElement("div"); btnRow.style.display = "flex"; btnRow.style.flexWrap = "wrap"; btnRow.style.gap = "8px"; btnRow.style.marginTop = "8px";

    const built = [
      { id: "gray", title: "Gray" },
      { id: "dark", title: "Dark" },
      { id: "rainbow", title: "Rainbow" }
    ];
    built.forEach(b => {
      const bb = document.createElement("button"); bb.className = "btn"; bb.textContent = b.title;
      bb.onclick = () => { state.cape = b.id; saveState(); applyCape(state.cape); showToast("Cape applied: " + b.title); };
      btnRow.appendChild(bb);
    });

    const disableBtn = document.createElement("button"); disableBtn.className = "btn"; disableBtn.textContent = "Disable";
    disableBtn.onclick = () => { state.cape = null; saveState(); cleanupCapeResources(); showToast("Cape disabled"); };
    btnRow.appendChild(disableBtn);

    const upload = document.createElement("input"); upload.type = "file"; upload.accept = "image/*"; upload.style.marginTop = "8px";
    upload.onchange = async (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        state.customCapes = state.customCapes || [];
        state.customCapes.push({ name: f.name || ("cape" + (state.customCapes.length + 1)), dataUrl: r.result });
        saveState();
        showToast("Custom cape imported");
        container.innerHTML = "";
        renderAccessoriesGrid(container);
      };
      r.readAsDataURL(f);
    };

    capesCard.appendChild(btnRow);
    capesCard.appendChild(upload);

    const importDiv = document.createElement("div"); importDiv.style.marginTop = "10px";
    const importBtn = document.createElement("button"); importBtn.className = "btn"; importBtn.textContent = state.builtInCapesImported ? "Sample capes imported" : "Import sample capes (console)";
    importBtn.onclick = () => {
      if (!state.builtInCapesImported) {
        state.builtInCapesImported = true; saveState();
        showToast("Call window.nullClientImportSampleCapes([...urls]) in console to add samples.");
      } else showToast("Already imported.");
    };
    importDiv.appendChild(importBtn);
    capesCard.appendChild(importDiv);

    const list = document.createElement("div"); list.style.marginTop = "10px";
    list.className = "small";
    list.innerHTML = "<div style='margin-bottom:6px;font-weight:700;'>Custom capes</div>";
    (state.customCapes || []).forEach((c, idx) => {
      const row = document.createElement("div"); row.style.display = "flex"; row.style.alignItems = "center"; row.style.justifyContent = "space-between"; row.style.gap = "8px";
      const name = document.createElement("div"); name.textContent = c.name || ("custom " + idx); name.style.flex = "1";
      const apply = document.createElement("button"); apply.className = "btn"; apply.textContent = "Apply";
      apply.onclick = () => { state.cape = "custom:" + idx; saveState(); applyCape(state.cape); showToast("Custom cape applied: " + (c.name || idx)); };
      const del = document.createElement("button"); del.className = "btn"; del.textContent = "Delete";
      del.onclick = () => {
        state.customCapes.splice(idx, 1);
        saveState();
        showToast("Custom cape removed");
        container.innerHTML = "";
        renderAccessoriesGrid(container);
      };
      row.appendChild(name); row.appendChild(apply); row.appendChild(del);
      list.appendChild(row);
    });
    capesCard.appendChild(list);

    const bindCard = document.createElement("div"); bindCard.className = "card";
    bindCard.innerHTML = `<div class="card-title">Binding Tools</div><div class="card-desc">Bind DOM elements for armor, chat or player to enable additional features.</div>`;
    const armorBind = document.createElement("button"); armorBind.className = "btn"; armorBind.textContent = "Pick Armor Element";
    armorBind.onclick = () => startElementPicker("armor");
    const chatBind = document.createElement("button"); chatBind.className = "btn"; chatBind.textContent = "Pick Chat Element";
    chatBind.style.marginLeft = "8px"; chatBind.onclick = () => startElementPicker("chat");
    const playerBind = document.createElement("button"); playerBind.className = "btn"; playerBind.textContent = "Pick Player Element";
    playerBind.style.marginLeft = "8px"; playerBind.onclick = () => startElementPicker("player");
    bindCard.appendChild(armorBind); bindCard.appendChild(chatBind); bindCard.appendChild(playerBind);

    const followDiv = document.createElement("div"); followDiv.style.marginTop = "8px";
    followDiv.innerHTML = `<label class="small"><input type="checkbox" id="capeFollowToggle"> Enable cape follow (requires player bind)</label>`;
    capesCard.appendChild(followDiv);

    container.appendChild(capesCard);
    container.appendChild(bindCard);

    setTimeout(() => {
      const t = container.querySelector("#capeFollowToggle");
      if (t) {
        t.checked = !!state.enableCapeFollow;
        t.onchange = (e) => {
          state.enableCapeFollow = !!e.target.checked;
          if (state.enableCapeFollow && (!state.bound || !state.bound.playerPath)) {
            showToast("Bind player element first to use follow.");
            state.enableCapeFollow = false;
            t.checked = false;
            return;
          }
          saveState();
          if (state.enableCapeFollow && state.cape && !state.safeMode) startCapeClothLoop();
          else stopCapeFollow();
        };
      }
    }, 0);
  }

  function renderVisualGrid(container) {
    if (!container) return;
    const texCard = document.createElement("div"); texCard.className = "card";
    texCard.innerHTML = `<div class="card-title">Texture / Filters</div><div class="card-desc">Apply client-side visual filters and texture modes.</div>`;
    const noneBtn = document.createElement("button"); noneBtn.className = "btn"; noneBtn.textContent = "None";
    noneBtn.onclick = () => { applyTexture(""); showToast("Texture cleared"); };
    const monoBtn = document.createElement("button"); monoBtn.className = "btn"; monoBtn.textContent = "Mono";
    monoBtn.style.marginLeft = "8px"; monoBtn.onclick = () => { applyTexture("mono"); showToast("Mono texture applied"); };
    const hcBtn = document.createElement("button"); hcBtn.className = "btn"; hcBtn.textContent = "High Contrast";
    hcBtn.style.marginLeft = "8px"; hcBtn.onclick = () => { applyTexture("highcontrast"); showToast("High contrast applied"); };
    texCard.appendChild(noneBtn); texCard.appendChild(monoBtn); texCard.appendChild(hcBtn);

    const fpsCard = document.createElement("div"); fpsCard.className = "card";
    fpsCard.innerHTML = `<div class="card-title">FPS / Canvas</div><div class="card-desc">Scale canvas to improve FPS (client-side) and pause animations or remove backgrounds.</div>`;
    const scaleRow = document.createElement("div"); scaleRow.style.marginTop = "8px";
    scaleRow.innerHTML = `<label class="small">Canvas scale: <input id="fpsScale" type="number" min="1" max="4" step="0.25" style="width:70px;"></label>`;
    fpsCard.appendChild(scaleRow);

    const pauseRow = document.createElement("div"); pauseRow.style.marginTop = "8px";
    pauseRow.innerHTML = `<label class="small"><input id="pauseAnim" type="checkbox"> Pause animations</label>`;
    fpsCard.appendChild(pauseRow);

    const bgRow = document.createElement("div"); bgRow.style.marginTop = "8px";
    bgRow.innerHTML = `<label class="small"><input id="removeBg" type="checkbox"> Remove game backgrounds</label>`;
    fpsCard.appendChild(bgRow);

    container.appendChild(texCard); container.appendChild(fpsCard);

    setTimeout(() => {
      const scaleEl = container.querySelector("#fpsScale");
      const pauseEl = container.querySelector("#pauseAnim");
      const bgEl = container.querySelector("#removeBg");
      if (!scaleEl || !pauseEl || !bgEl) return;
      scaleEl.value = state.fps && state.fps.scale ? state.fps.scale : 1;
      pauseEl.checked = !!(state.fps && state.fps.pauseAnimations);
      bgEl.checked = !!(state.fps && state.fps.removeBackgrounds);

      scaleEl.onchange = () => {
        const v = parseFloat(scaleEl.value) || 1;
        if (state.safeMode && v !== 1) {
          showToast("Safe Mode prevents canvas scaling");
          scaleEl.value = 1;
          return;
        }
        state.fps = state.fps || {};
        state.fps.scale = Math.max(1, Math.min(4, v));
        saveState(); applyFPSState(); showToast("Canvas scale set to " + state.fps.scale);
      };
      pauseEl.onchange = () => {
        state.fps = state.fps || {};
        state.fps.pauseAnimations = !!pauseEl.checked;
        saveState(); applyFPSState(); showToast("Animations " + (state.fps.pauseAnimations ? "paused" : "resumed"));
      };
      bgEl.onchange = () => {
        state.fps = state.fps || {};
        state.fps.removeBackgrounds = !!bgEl.checked;
        saveState(); applyFPSState(); showToast("Backgrounds " + (state.fps.removeBackgrounds ? "removed" : "restored"));
      };
    }, 0);
  }

  function renderCombatGrid(container) {
    if (!container) return;
    const card = document.createElement("div"); card.className = "card";
    card.innerHTML = `<div class="card-title">Combat Tools</div><div class="card-desc">Cosmetic combat widgets (no gameplay manipulation).</div>`;
    const info = document.createElement("div"); info.className = "small"; info.style.marginTop = "8px";
    info.textContent = "No combat-only features implemented in v1.2. Planned: cosmetic crosshairs, hit effects.";
    card.appendChild(info);
    container.appendChild(card);
  }

  function renderSettingsGrid(container) {
    if (!container) return;
    const safeCard = document.createElement("div"); safeCard.className = "card";
    safeCard.innerHTML = `<div class="card-title">Behavior</div><div class="card-desc">Safe Mode prevents risky features. Lock prevents moving widgets.</div>`;
    const safeRow = document.createElement("div"); safeRow.style.marginTop = "8px";
    safeRow.innerHTML = `<label class="small"><input type="checkbox" id="safeModeToggle"> Safe Mode (recommended)</label>`;
    safeCard.appendChild(safeRow);
    const lockRow = document.createElement("div"); lockRow.style.marginTop = "8px";
    lockRow.innerHTML = `<label class="small"><input type="checkbox" id="lockToggle"> Lock widgets (prevent dragging)</label>`;
    safeCard.appendChild(lockRow);

    container.appendChild(safeCard);

    const bindCard = document.createElement("div"); bindCard.className = "card";
    bindCard.innerHTML = `<div class="card-title">Bindings</div><div class="card-desc">Current bound DOM paths and quick actions.</div>`;
    const bindingsList = document.createElement("div"); bindingsList.style.marginTop = "8px"; bindingsList.className = "small";
    const updateBindings = () => {
      bindingsList.innerHTML = "";
      const bp = state.bound || {};
      const makeLine = (label, key) => {
        const row = document.createElement("div"); row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.alignItems = "center"; row.style.gap = "8px"; row.style.marginBottom = "6px";
        const left = document.createElement("div"); left.textContent = label + ": " + (bp[key] || "none");
        left.style.flex = "1"; left.style.wordBreak = "break-word";
        const pick = document.createElement("button"); pick.className = "btn"; pick.textContent = "Pick";
        pick.onclick = () => startElementPicker(key === "chatPath" ? "chat" : (key === "armorPath" ? "armor" : "player"));
        const clear = document.createElement("button"); clear.className = "btn"; clear.textContent = "Clear";
        clear.onclick = () => { state.bound[key] = null; saveState(); applyChatTransparency(); updateBindings(); showToast(label + " unbound"); };
        row.appendChild(left); row.appendChild(pick); row.appendChild(clear);
        bindingsList.appendChild(row);
      };
      makeLine("Armor", "armorPath");
      makeLine("Chat", "chatPath");
      makeLine("Player", "playerPath");
    };
    bindCard.appendChild(bindingsList);
    container.appendChild(bindCard);
    updateBindings();

    const stateCard = document.createElement("div"); stateCard.className = "card";
    stateCard.innerHTML = `<div class="card-title">State</div><div class="card-desc">Export, import, or reset your client settings.</div>`;
    const exportBtn = document.createElement("button"); exportBtn.className = "btn"; exportBtn.textContent = "Export Settings";
    exportBtn.onclick = () => {
      try {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "null-client-settings.json"; document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        showToast("Settings exported");
      } catch (e) { showToast("Failed to export"); }
    };
    const importInput = document.createElement("input"); importInput.type = "file"; importInput.accept = "application/json"; importInput.style.marginLeft = "8px";
    importInput.onchange = (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const parsed = JSON.parse(r.result);
          state = migrateState(parsed);
          saveState();
          showToast("Settings imported — reload recommended");
          applyChatTransparency();
          applyTexture(state.texture);
          applyFPSState();
          if (state.cape) applyCape(state.cape);
        } catch (e) { showToast("Invalid settings file"); }
      };
      r.readAsText(f);
    };
    const resetBtn = document.createElement("button"); resetBtn.className = "btn"; resetBtn.textContent = "Reset to defaults";
    resetBtn.style.marginLeft = "8px";
    resetBtn.onclick = () => {
      state = deepCopy(DEFAULT_STATE);
      saveState();
      showToast("Settings reset — reload recommended");
    };
    stateCard.appendChild(exportBtn); stateCard.appendChild(importInput); stateCard.appendChild(resetBtn);
    container.appendChild(stateCard);

    setTimeout(() => {
      const safeToggle = container.querySelector("#safeModeToggle");
      const lockToggle = container.querySelector("#lockToggle");
      if (safeToggle) {
        safeToggle.checked = !!state.safeMode;
        safeToggle.onchange = () => {
          state.safeMode = !!safeToggle.checked;
          if (state.safeMode) {
            state.enableCapeFollow = false;
            if (state.fps && state.fps.scale && state.fps.scale !== 1) state.fps.scale = 1;
            applyFPSState();
            stopCapeFollow();
          }
          saveState();
          showToast("Safe Mode " + (state.safeMode ? "ON" : "OFF"));
        };
      }
      if (lockToggle) {
        lockToggle.checked = !!state.locked;
        lockToggle.onchange = () => {
          state.locked = !!lockToggle.checked;
          saveState();
          updateLockState();
          showToast("Widgets " + (state.locked ? "locked" : "unlocked"));
        };
      }
    }, 0);
  }

  // initial startup
  setTimeout(() => {
    try {
      createUI();
      checkCPSUsage();
      ensureCanvasObserver();
      if (state.keystrokes) toggleKeystrokes(true);
      if (state.cps) toggleCPS(true);
      if (state.ping) togglePing(true);
      if (state.armor) toggleArmor(true);
      if (state.cape) applyCape(state.cape);
      if (state.texture) applyTexture(state.texture);
      applyFPSState();
      if (state.bound && state.bound.chatPath) applyChatTransparency();
      if (state.compactHud) createCompactHud();
      if (state.bound && state.bound.playerPath && state.cape && state.enableCapeFollow && !state.safeMode) startCapeClothLoop();
      setTimeout(updateLockState, 300);
    } catch (e) {
      // initialization shouldn't completely kill page — log and continue
      console.error("Null Client init error:", e);
    }
  }, 400);

  window.addEventListener("beforeunload", () => {
    saveState();
    removeCPSListeners();
    stopCPSInterval();
    stopCapeFollow();
    stopArmorPolling();
    disconnectCanvasObserver();
  });

  // console helper
  window.nullClientImportSampleCapes = function(urls) {
    if (!Array.isArray(urls)) return;
    urls.forEach(u => state.customCapes.push({ name: u.split("/").pop() || "sample", dataUrl: u }));
    state.builtInCapesImported = true; saveState(); showToast("Imported sample capes via console.");
  };

})();
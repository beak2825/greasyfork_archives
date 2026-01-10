// ==UserScript==
// @name         Null Client
// @namespace    null.client
// @version      1.1
// @match        https://bloxd.io/*
// @match        *://staging.bloxd.io/*
// @match        https://www.bloxdforge.com/studio/play/*
// @match        https://www.crazygames.com/game/bloxdhop-io/*
// @description  Null Client — The Best Client on Bloxd.io And Gives an Smooth Experience For ur Gameplay!.
// @author       Nullscape
// @icon         https://i.postimg.cc/xjzYxS0R/Null-Client.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561920/Null%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/561920/Null%20Client.meta.js
// ==/UserScript==
(function () {
  // Persistence and defaults-
  const STORAGE_KEY = "null_client_v1_state";
  const DEFAULT_STATE = {
    version: "1.8",
    keystrokes: false,
    cps: false,
    ping: false,
    armor: false,
    cape: null, // e.g. "gray" | "dark" | "rainbow" | "custom:0"
    customCapes: [], // { name, dataUrl }
    locked: true,
    positions: {
      keystrokes: { bottom: 18, left: 18 },
      cps: { bottom: 66, left: 18 },
      ping: { bottom: 98, left: 18 },
      armor: { top: 18, right: 18 },
      capeOverlay: { top: 54, right: 40 }
    },
    texture: "",
    fps: {
      scale: 1,
      pauseAnimations: false,
      removeBackgrounds: false
    },
    armorImage: null
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
 
  // UI root, toggle key
  let uiRoot = null;
  let uiOpen = false;
  document.addEventListener("keydown", e => {
    if (e.code === "ShiftRight") {
      uiOpen = !uiOpen;
      if (uiOpen) showUI(); else hideUI();
    }
  });
 
  function showUI() {
    if (!uiRoot) createUI();
    uiRoot.style.display = "block";
  }
  function hideUI() {
    if (uiRoot) uiRoot.style.display = "none";
  }
 
  // Ensure body exists for @run-at document-start
  let createUICalled = false;
  function createUI() {
    if (createUICalled) return;
    createUICalled = true;
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", createUI, { once: true });
      return;
    }
 
    uiRoot = document.createElement("div");
    uiRoot.style.cssText = "position:fixed; inset:0; z-index:2147483646; display:none;";
    document.body.appendChild(uiRoot);
 
    const shadow = uiRoot.attachShadow({ mode: "open" });
 
    // Natural UI styling
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
        .frame {
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:860px; height:460px;
          background: linear-gradient(180deg, #0f1113, #0b0c0d);
          border-radius:12px;
          display:flex;
          color:#e7eef6;
          box-shadow: 0 10px 40px rgba(2,6,10,0.75);
          overflow:hidden;
          border:1px solid rgba(255,255,255,0.03);
        }
        .sidebar {
          width:170px; background: linear-gradient(180deg,#0b0c0d,#0a0b0c);
          padding:14px; display:flex; flex-direction:column; gap:10px; border-right:1px solid rgba(255,255,255,0.02);
        }
        .logo { display:flex; align-items:center; gap:10px; }
        .logo img { width:34px; height:34px; border-radius:6px; }
        .brand { font-weight:700; font-size:14px; letter-spacing:0.4px; }
        .version { font-size:11px; color:#99a2ad; }
        .nav { margin-top:8px; display:flex; flex-direction:column; gap:6px; }
        .nav button {
          background:transparent; border:1px solid transparent; color:#cfd8df; text-align:left;
          padding:8px 10px; border-radius:8px; cursor:pointer; font-size:13px;
        }
        .nav button.active { background:#121416; border-color:rgba(255,255,255,0.02); color:#fff; box-shadow: inset 0 -1px 0 rgba(255,255,255,0.01); }
        .nav .spacer { flex:1; }
        .main { flex:1; padding:18px; display:flex; flex-direction:column; }
        .header { display:flex; justify-content:space-between; align-items:center; }
        .title { font-weight:700; font-size:16px; }
        .subtitle { color:#98a2ac; font-size:12px; }
        .grid { margin-top:14px; display:flex; gap:12px; flex-wrap:wrap; }
        .card {
          width:240px; min-height:92px;
          background: linear-gradient(180deg,#0e1012,#0b0c0d);
          border-radius:10px; padding:12px; border:1px solid rgba(255,255,255,0.02);
          box-shadow: 0 8px 18px rgba(2,6,10,0.5);
        }
        .card-title { font-weight:700; margin-bottom:8px; font-size:13px; }
        .card-desc { color:#98a2ac; font-size:12px; margin-bottom:8px; }
        .toggle-row { display:flex; align-items:center; justify-content:space-between; background:linear-gradient(180deg,#0b0c0d,#0a0b0c); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.02); }
        .toggle-row .label { font-size:13px; color:#e7eef6; }
        .switch { width:46px; height:24px; border-radius:14px; background:#202427; position:relative; cursor:pointer; border:1px solid rgba(255,255,255,0.03); }
        .switch.on { background:linear-gradient(90deg,#2b9aff,#1fb1ff); }
        .knob { width:20px; height:20px; border-radius:10px; background:#fff; position:absolute; top:2px; left:2px; transition:all .12s ease; box-shadow: 0 3px 8px rgba(0,0,0,0.45); }
        .switch.on .knob { left:24px; }
        .small { font-size:12px; color:#9aa6b0; }
        .footer { margin-top:auto; display:flex; justify-content:space-between; align-items:center; color:#98a2ac; font-size:12px; }
        .btn { padding:6px 10px; border-radius:8px; background:#1c1f22; border:1px solid rgba(255,255,255,0.03); color:#e7eef6; cursor:pointer; }
        .btn:hover { background:#232629; }
      </style>
 
      <div class="frame" id="frame">
        <div class="sidebar">
          <div class="logo"><img src="https://i.postimg.cc/xjzYxS0R/Null-Client.png" alt="logo"><div><div class="brand">Null Client</div><div class="version">v1.8</div></div></div>
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
 
          <div class="footer"><div>Right Shift to open/close</div><div class="small">All features are client-side only</div></div>
        </div>
      </div>
    `;
 
    // hook nav
    const nav = shadow.getElementById("nav");
    nav.addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.id === "closeBtn") { uiOpen = false; hideUI(); return; }
      for (const b of nav.querySelectorAll("button")) b.classList.remove("active");
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      const title = shadow.getElementById("mainTitle");
      const sub = shadow.getElementById("mainSub");
      const grid = shadow.getElementById("gridArea");
      grid.innerHTML = "";
      if (tab === "player") { title.textContent = "Player"; sub.textContent = "Widgets: Keystrokes, CPS, Ping, Armor"; renderPlayerGrid(grid); }
      else if (tab === "accessories") { title.textContent = "Accessories"; sub.textContent = "Client capes & previews"; renderAccessoriesGrid(grid); }
      else if (tab === "visual") { title.textContent = "Visual"; sub.textContent = "Texture pack & FPS boost"; renderVisualGrid(grid); }
      else if (tab === "combat") { title.textContent = "Combat"; sub.textContent = "Cosmetic combat tools (no cheats)"; renderCombatGrid(grid); }
      else if (tab === "settings") { title.textContent = "Settings"; sub.textContent = "Persistence and widget locking"; renderSettingsGrid(grid); }
    });
 
    // initial fill
    const initialGrid = shadow.getElementById("gridArea");
    renderPlayerGrid(initialGrid);
 
    shadow.getElementById("hideHelp").onclick = () => { alert("Help available in Settings or in the included docs."); };
  }
 
  // Grid card renderers
  function makeToggleCard(title, desc, stateKey, onChange) {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card-title">${title}</div>
      <div class="card-desc">${desc}</div>
      <div class="toggle-row">
        <div class="label small">Enable</div>
        <div class="switch ${state[stateKey] ? "on" : ""}" data-key="${stateKey}"><div class="knob"></div></div>
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
    });
    return el;
  }
 
  function renderPlayerGrid(container) {
    container.appendChild(makeToggleCard("CPS Counter", "Counts left and right mouse button clicks per second (format: left | right)", "cps", (v) => {}));
    container.appendChild(makeToggleCard("Ping Counter", "Estimate network latency (client-side)", "ping", (v) => {}));
    container.appendChild(makeToggleCard("Keystrokes", "Shows WASD input (small overlay)", "keystrokes", (v) => {}));
    container.appendChild(makeToggleCard("Armor View", "Local armor preview (client-only)", "armor", (v) => {}));
  }
 
  function renderAccessoriesGrid(container) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-title">Capes (client-only)</div>
      <div class="card-desc">Only you see these capes — upload or paste URLs to add custom capes.</div>
      <div style="margin-top:8px;">
        <button id="cape-none" class="btn">No Cape</button>
        <button id="cape-gray" class="btn">Gray</button>
        <button id="cape-dark" class="btn">Dark</button>
        <button id="cape-rainbow" class="btn">Rainbow</button>
      </div>
      <div style="margin-top:10px;" class="small">Add custom cape via URL or upload:</div>
      <div style="margin-top:6px;">
        <input id="capeUrl" type="url" placeholder="https://..." style="padding:6px; border-radius:6px; background:#0b0b0b; color:#dfe8ef; border:1px solid rgba(255,255,255,0.03); width:64%;">
        <button id="addUrl" class="btn">Add URL</button>
      </div>
      <div style="margin-top:6px;">
        <input id="capeFile" type="file" accept="image/*" style="color:#dfe8ef;">
        <button id="addFile" class="btn">Upload</button>
      </div>
      <div id="customCapesList" style="margin-top:8px; max-height:120px; overflow:auto;"></div>
    `;
    container.appendChild(card);
 
    function updateList() {
      const list = card.querySelector("#customCapesList");
      list.innerHTML = "";
      if (!state.customCapes || state.customCapes.length === 0) {
        const p = document.createElement("div"); p.className = "small"; p.textContent = "No custom capes added."; list.appendChild(p); return;
      }
      state.customCapes.forEach((c, i) => {
        const row = document.createElement("div");
        row.style.display = "flex"; row.style.alignItems = "center"; row.style.gap = "8px"; row.style.marginTop = "6px";
        const thumb = document.createElement("div"); thumb.style.width="72px"; thumb.style.height="46px"; thumb.style.background = c.dataUrl ? `url(${c.dataUrl}) center/cover no-repeat` : "#0f0f0f"; thumb.style.borderRadius="6px";
        const name = document.createElement("div"); name.textContent = c.name || ("Custom " + (i+1)); name.style.color="#dfe8ef"; name.style.flex="1";
        const sel = document.createElement("button"); sel.textContent = "Select"; sel.className = "btn"; sel.onclick = () => { state.cape = "custom:" + i; saveState(); applyCape(state.cape); showToast("Custom cape selected"); };
        const rem = document.createElement("button"); rem.textContent = "Remove"; rem.className = "btn"; rem.onclick = () => { if (!confirm("Remove custom cape?")) return; state.customCapes.splice(i,1); if ((state.cape||"").startsWith("custom:")) { const cur = parseInt(state.cape.split(":")[1],10); if (cur===i) state.cape=null; else if (cur>i) state.cape="custom:"+(cur-1); } saveState(); updateList(); applyCape(state.cape); };
        row.appendChild(thumb); row.appendChild(name); row.appendChild(sel); row.appendChild(rem);
        list.appendChild(row);
      });
    }
 
    card.querySelector("#cape-none").onclick = () => { state.cape = null; saveState(); applyCape(null); showToast("Cape disabled"); };
    card.querySelector("#cape-gray").onclick = () => { state.cape = "gray"; saveState(); applyCape("gray"); showToast("Gray cape enabled"); };
    card.querySelector("#cape-dark").onclick = () => { state.cape = "dark"; saveState(); applyCape("dark"); showToast("Dark cape enabled"); };
    card.querySelector("#cape-rainbow").onclick = () => { state.cape = "rainbow"; saveState(); applyCape("rainbow"); showToast("Rainbow cape enabled"); };
 
    card.querySelector("#addUrl").onclick = () => {
      const url = (card.querySelector("#capeUrl").value || "").trim();
      if (!url) return alert("Please paste an image URL.");
      state.customCapes.push({ name: url.split("/").pop() || "custom", dataUrl: url });
      saveState(); updateList(); showToast("Custom cape added");
      card.querySelector("#capeUrl").value = "";
    };
    card.querySelector("#addFile").onclick = () => {
      const f = card.querySelector("#capeFile").files[0];
      if (!f) return alert("Choose a file first.");
      const r = new FileReader();
      r.onload = () => {
        state.customCapes.push({ name: f.name, dataUrl: r.result });
        saveState(); updateList(); showToast("Custom cape uploaded");
      };
      r.readAsDataURL(f);
    };
 
    updateList();
  }
 
  function renderVisualGrid(container) {
    const textureCard = document.createElement("div");
    textureCard.className = "card";
    textureCard.innerHTML = `
      <div class="card-title">Texture Pack</div>
      <div class="card-desc">Client-side visual filters (grayscale / high contrast)</div>
      <div style="margin-top:8px;">
        <button id="texReset" class="btn">Reset</button>
        <button id="texMono" class="btn">Monochrome</button>
        <button id="texHigh" class="btn">High Contrast</button>
      </div>
    `;
    container.appendChild(textureCard);
    textureCard.querySelector("#texReset").onclick = () => { state.texture = ""; applyTexture(""); saveState(); };
    textureCard.querySelector("#texMono").onclick = () => { state.texture = "mono"; applyTexture("mono"); saveState(); };
    textureCard.querySelector("#texHigh").onclick = () => { state.texture = "highcontrast"; applyTexture("highcontrast"); saveState(); };
 
    const fpsCard = document.createElement("div");
    fpsCard.className = "card";
    fpsCard.innerHTML = `
      <div class="card-title">FPS Boost</div>
      <div class="card-desc">Lower canvas rendering & pause animations to improve frame-rate</div>
      <div style="margin-top:8px;">
        <button id="fpsReset" class="btn">Reset</button>
        <button id="fps075" class="btn">Scale 0.75</button>
        <button id="fps05" class="btn">Scale 0.5</button>
      </div>
      <div style="margin-top:8px;">
        <label class="small"><input id="fpsPause" type="checkbox"> Pause CSS animations</label><br>
        <label class="small"><input id="fpsBg" type="checkbox"> Remove background images</label>
      </div>
    `;
    container.appendChild(fpsCard);
    fpsCard.querySelector("#fps075").onclick = () => { state.fps.scale = 0.75; applyFPSState(); saveState(); showToast("Canvas scaled 0.75"); };
    fpsCard.querySelector("#fps05").onclick = () => { state.fps.scale = 0.5; applyFPSState(); saveState(); showToast("Canvas scaled 0.5"); };
    fpsCard.querySelector("#fpsReset").onclick = () => { state.fps.scale = 1; applyFPSState(); saveState(); showToast("FPS settings reset"); };
    fpsCard.querySelector("#fpsPause").checked = !!state.fps.pauseAnimations;
    fpsCard.querySelector("#fpsBg").checked = !!state.fps.removeBackgrounds;
    fpsCard.querySelector("#fpsPause").onchange = (e)=> { state.fps.pauseAnimations = e.target.checked; applyFPSState(); saveState(); };
    fpsCard.querySelector("#fpsBg").onchange = (e)=> { state.fps.removeBackgrounds = e.target.checked; applyFPSState(); saveState(); };
  }
 
  function renderCombatGrid(container) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-title">Combat (Cosmetic-only)</div>
      <div class="card-desc">I will not implement cheats that affect other players. The toggles here are decorative and client-only.</div>
      <div style="margin-top:10px;">
        <div class="toggle-row"><div class="label small">Local target outline</div><div class="switch" data-key="outline"><div class="knob"></div></div></div>
        <div style="height:8px"></div>
        <div class="toggle-row"><div class="label small">Local auto-hotbar visuals</div><div class="switch" data-key="hotbar"><div class="knob"></div></div></div>
      </div>
    `;
    container.appendChild(card);
    card.querySelectorAll(".switch").forEach(s => s.addEventListener("click", () => { s.classList.toggle("on"); alert("This is cosmetic-only and does not affect gameplay."); }));
  }
 
  function renderSettingsGrid(container) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-title">Settings</div>
      <div class="card-desc">Widget locking, reset and how to install</div>
      <div style="margin-top:8px;">
        <label class="small"><input id="lockWidgets" type="checkbox"> Lock widget positions</label>
        <div style="margin-top:8px;"><button id="resetAll" class="btn">Reset all settings</button></div>
      </div>
      <div style="margin-top:10px;" class="small">Tip: single-click any visible widget to toggle it on/off. Drag widgets when unlocked to reposition them.</div>
    `;
    container.appendChild(card);
    const lockEl = card.querySelector("#lockWidgets");
    lockEl.checked = !!state.locked;
    lockEl.onchange = e => { state.locked = e.target.checked; saveState(); updateLockState(); showToast("Lock " + (state.locked ? "enabled" : "disabled")); };
 
    card.querySelector("#resetAll").onclick = () => {
      if (!confirm("Reset Null Client settings? This will remove custom capes and widget positions.")) return;
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      location.reload();
    };
  }
 
  // Widgets implementation
  // Keystrokes overlay
  let keyUI = null;
  const keyState = { w:false,a:false,s:false,d:false };
  function toggleKeystrokes(on) {
    if (on && !keyUI) {
      keyUI = document.createElement("div");
      keyUI.style.cssText = widgetStyle("keystrokes") + "display:flex;gap:6px;align-items:center;justify-content:center;padding:6px 8px;font-size:12px;backdrop-filter: blur(3px);";
      ["W","A","S","D"].forEach(k => {
        const b = document.createElement("div");
        b.textContent = k;
        b.dataset.key = k.toLowerCase();
        Object.assign(b.style, { padding:"6px 8px", background:"#0c0d0e", borderRadius:"6px", color:"#cfe7ff", border:"1px solid rgba(255,255,255,0.03)", minWidth:"20px", textAlign:"center" });
        keyUI.appendChild(b);
      });
      // LMB/RMB small indicators
      const ctrl = document.createElement("div");
      ctrl.style.display="flex"; ctrl.style.flexDirection="column"; ctrl.style.marginLeft="8px"; ctrl.style.gap="4px";
      const lmb = document.createElement("div"); lmb.textContent="LMB"; lmb.style.fontSize="11px"; lmb.style.color="#9fbddf"; lmb.dataset.btn="lmb";
      const rmb = document.createElement("div"); rmb.textContent="RMB"; rmb.style.fontSize="11px"; rmb.style.color="#9fbddf"; rmb.dataset.btn="rmb";
      ctrl.appendChild(lmb); ctrl.appendChild(rmb);
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
      keyUI.remove(); keyUI = null;
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("mousedown", mouseDownHandlerForKeys);
      window.removeEventListener("mouseup", mouseUpHandlerForKeys);
    }
  }
  function keyDownHandler(e) {
    const k = e.key.toLowerCase();
    if (["w","a","s","d"].includes(k)) { keyState[k]=true; refreshKeyUI(); }
  }
  function keyUpHandler(e) {
    const k = e.key.toLowerCase();
    if (["w","a","s","d"].includes(k)) { keyState[k]=false; refreshKeyUI(); }
  }
  function refreshKeyUI() {
    if (!keyUI) return;
    for (const child of keyUI.children) {
      const k = child.dataset && child.dataset.key;
      if (!k) continue;
      if (keyState[k]) { child.style.background="#1f6feb"; child.style.color="#fff"; child.style.transform="translateY(-1px)"; }
      else { child.style.background="#0c0d0e"; child.style.color="#cfe7ff"; child.style.transform=""; }
    }
  }
  function mouseDownHandlerForKeys(e) {
    if (!keyUI) return;
    const l = keyUI.querySelector("[data-btn='lmb']");
    const r = keyUI.querySelector("[data-btn='rmb']");
    if (e.button === 0) { if (l) l.style.opacity="1"; }
    if (e.button === 2) { if (r) r.style.opacity="1"; }
  }
  function mouseUpHandlerForKeys(e) {
    if (!keyUI) return;
    const l = keyUI.querySelector("[data-btn='lmb']");
    const r = keyUI.querySelector("[data-btn='rmb']");
    if (e.button === 0) { if (l) l.style.opacity="0.7"; }
    if (e.button === 2) { if (r) r.style.opacity="0.7"; }
  }
 
  // CPS widget shows Left | Right counts per second
  let cpsUI = null;
  let leftClicks = 0;
  let rightClicks = 0;
  document.addEventListener("mousedown", e => {
    if (e.button === 0) leftClicks++;
    else if (e.button === 2) rightClicks++;
  });
  setInterval(() => {
    if (cpsUI) {
      cpsUI.textContent = leftClicks + " | " + rightClicks;
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
      cpsUI.style.cssText = widgetStyle("cps") + "width:94px;height:30px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;";
      cpsUI.textContent = "0 | 0";
      document.body.appendChild(cpsUI);
      positionWidget(cpsUI, "cps");
      attachWidgetClickToggle(cpsUI, "cps");
      if (!state.locked) makeDraggable(cpsUI, "cps");
    } else if (!on && cpsUI) {
      cpsUI.remove(); cpsUI = null;
    }
  }
 
  // Ping widget
  let pingUI = null, pingInterval = null;
  async function measurePing() {
    try {
      const url = location.origin + "/favicon.ico";
      const start = performance.now();
      await fetch(url, { method: "HEAD", cache: "no-store" });
      const ms = Math.max(0, Math.round(performance.now() - start));
      if (pingUI) pingUI.textContent = "Ping: " + ms + " ms";
    } catch (err) { if (pingUI) pingUI.textContent = "Ping: —"; }
  }
  function togglePing(on) {
    if (on && !pingUI) {
      pingUI = document.createElement("div");
      pingUI.style.cssText = widgetStyle("ping") + "width:110px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;";
      pingUI.textContent = "Ping: ...";
      document.body.appendChild(pingUI);
      positionWidget(pingUI, "ping");
      measurePing();
      pingInterval = setInterval(measurePing, 2000);
      attachWidgetClickToggle(pingUI, "ping");
      if (!state.locked) makeDraggable(pingUI, "ping");
    } else if (!on && pingUI) {
      clearInterval(pingInterval); pingInterval = null;
      pingUI.remove(); pingUI = null;
    }
  }
 
  // Armor view (client-side preview)
  let armorUI = null;
  function toggleArmor(on) {
    if (on && !armorUI) {
      armorUI = document.createElement("div");
      armorUI.style.cssText = widgetStyle("armor") + "width:140px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;";
      const title = document.createElement("div"); title.textContent = "Armor"; title.style.fontSize="12px"; title.style.color="#dbeffb";
      const img = document.createElement("img"); img.style.width="96px"; img.style.height="96px"; img.style.objectFit="cover"; img.style.borderRadius="8px";
      armorUI.appendChild(title); armorUI.appendChild(img);
      document.body.appendChild(armorUI);
      positionWidget(armorUI, "armor");
      updateArmorPreview();
      attachWidgetClickToggle(armorUI, "armor");
      if (!state.locked) makeDraggable(armorUI, "armor");
    } else if (!on && armorUI) {
      armorUI.remove(); armorUI = null;
    }
  }
  function updateArmorPreview() {
    if (!armorUI) return;
    const img = armorUI.querySelector("img");
    let found = null;
    try {
      if (window.player && window.player.avatar && window.player.avatar.armorImage) found = window.player.avatar.armorImage;
      else if (window.game && window.game.player && window.game.player.armorUrl) found = window.game.player.armorUrl;
    } catch (e) {}
    if (!found && state.armorImage) found = state.armorImage;
    if (found) { img.src = found; img.style.background=""; } else { img.src=""; img.style.background="linear-gradient(180deg,#222,#111)"; }
  }
 
  // Cape overlay
  let capeOverlay = null;
  function applyCape(spec) {
    if (capeOverlay) { capeOverlay.remove(); capeOverlay = null; }
    if (!spec) return;
    capeOverlay = document.createElement("div");
    capeOverlay.style.position = "fixed";
    capeOverlay.style.width = "160px"; capeOverlay.style.height = "240px"; capeOverlay.style.pointerEvents = "none";
    capeOverlay.style.zIndex = "2147483645"; capeOverlay.style.borderRadius="7px"; capeOverlay.style.boxShadow="0 8px 20px rgba(0,0,0,0.55)";
    const pos = state.positions.capeOverlay || { top:54, right:40 };
    capeOverlay.style.top = (pos.top||54) + "px"; capeOverlay.style.right = (pos.right||40) + "px";
    if (spec === "gray") capeOverlay.style.background = "linear-gradient(#ddd,#999)";
    else if (spec === "dark") capeOverlay.style.background = "linear-gradient(#111,#333)";
    else if (spec === "rainbow") capeOverlay.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue)";
    else if (spec.startsWith("custom:")) {
      const i = parseInt(spec.split(":")[1],10);
      const obj = state.customCapes[i];
      if (obj && obj.dataUrl) capeOverlay.style.background = `url(${obj.dataUrl}) center/cover no-repeat`;
      else capeOverlay.style.background = "#0f0f0f";
    } else capeOverlay.style.background = "#0f0f0f";
    document.body.appendChild(capeOverlay);
    attachWidgetClickToggle(capeOverlay, "cape");
    if (!state.locked) makeDraggable(capeOverlay, "capeOverlay", { storePositionAs: "capeOverlay" });
  }
 
  // Texture / FPS implementations
  const CLIENT_STYLE_ID = "null-client-style";
  function applyTexture(mode) {
    removeClientStyle();
    if (!mode) return;
    let css = "";
    if (mode === "mono") css = `canvas, img, video, [data-game-canvas] { filter: grayscale(1) contrast(1.2) !important; } body { background:#0f0f0f !important; }`;
    else if (mode === "highcontrast") css = `canvas, img, video, [data-game-canvas] { filter: contrast(1.5) brightness(0.95) !important; } body { background:#0a0a0a !important; }`;
    if (css) {
      const s = document.createElement("style"); s.id = CLIENT_STYLE_ID; s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    }
  }
  function removeClientStyle() { const old = document.getElementById(CLIENT_STYLE_ID); if (old) old.remove(); }
 
  const FPS_STYLE_ID = "null-client-fps-style";
  const canvasesScaled = new WeakMap();
  function applyFPSState() {
    const scale = (state.fps && state.fps.scale) ? state.fps.scale : 1;
    document.querySelectorAll("canvas").forEach(c => {
      try {
        const meta = canvasesScaled.get(c);
        if (meta) {
          if (scale === 1) {
            c.width = meta.origWidth; c.height = meta.origHeight; c.style.transform = meta.origTransform || ""; c.style.imageRendering = meta.origImageRendering || "";
            canvasesScaled.delete(c);
          } else {
            c.width = Math.round(meta.origWidth * scale); c.height = Math.round(meta.origHeight * scale);
            c.style.transform = `scale(${1/scale})`; c.style.transformOrigin = "0 0"; c.style.imageRendering = "pixelated";
          }
        } else {
          if (scale !== 1) {
            const origW = c.width; const origH = c.height;
            canvasesScaled.set(c, { origWidth: origW, origHeight: origH, origTransform: c.style.transform || "", origImageRendering: c.style.imageRendering || "" });
            c.width = Math.round(origW * scale); c.height = Math.round(origH * scale);
            c.style.transform = `scale(${1/scale})`; c.style.transformOrigin = "0 0"; c.style.imageRendering = "pixelated";
          }
        }
      } catch (e) {}
    });
 
    // CSS toggles
    const old = document.getElementById(FPS_STYLE_ID);
    if (old) old.remove();
    let css = "";
    if (state.fps.pauseAnimations) css += `* { animation-play-state: paused !important; transition: none !important; }`;
    if (state.fps.removeBackgrounds) css += `body, [style*="background"], [style*="background-image"] { background-image: none !important; background: none !important; }`;
    if (css) {
      const s = document.createElement("style"); s.id = FPS_STYLE_ID; s.textContent = css; (document.head || document.documentElement).appendChild(s);
    }
  }
 
  // Widget helpers: style, position, drag, single-click toggles
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
    let dragging = false, startX=0, startY=0, startLeft=0, startTop=0;
    const onDown = (ev) => {
      if (ev.button !== 0) return;
      ev.preventDefault();
      startX = ev.clientX; startY = ev.clientY;
      const rect = el.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      const onMove = (mv) => {
        mv.preventDefault();
        const dx = mv.clientX - startX, dy = mv.clientY - startY;
        if (!dragging && Math.hypot(dx,dy) > 6) dragging = true;
        if (dragging) {
          const newLeft = Math.max(0, Math.round(startLeft + dx));
          const newTop = Math.max(0, Math.round(startTop + dy));
          el.style.left = newLeft + "px"; el.style.top = newTop + "px";
          el.style.right = ""; el.style.bottom = "";
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
        setTimeout(()=>{ dragging=false; }, 10);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    el.addEventListener("mousedown", onDown);
    DRAGMAP.set(el, onDown);
  }
  function removeDraggable(el) {
    const h = DRAGMAP.get(el);
    if (h) { el.removeEventListener("mousedown", h); DRAGMAP.delete(el); }
    el.style.cursor = "";
  }
  function updateLockState() {
    const keys = ["keystrokes","cps","ping","armor","capeOverlay"];
    for (const k of keys) {
      const el = getWidget(k);
      if (!el) continue;
      if (!state.locked) makeDraggable(el, k, { storePositionAs: k === "capeOverlay" ? "capeOverlay" : k });
      else removeDraggable(el);
    }
  }
  function getWidget(key) {
    if (key === "keystrokes") return keyUI;
    if (key === "cps") return cpsUI;
    if (key === "ping") return pingUI;
    if (key === "armor") return armorUI;
    if (key === "capeOverlay") return capeOverlay;
    return null;
  }
 
  // Single-click toggle (distinguish drag vs click)
  function attachWidgetClickToggle(el, widgetKey) {
    if (!el) return;
    let down = null;
    const downHandler = (ev) => { if (ev.button !== 0) return; down = { x: ev.clientX, y: ev.clientY, t: Date.now() }; };
    const upHandler = (ev) => {
      if (!down) return;
      const dx = ev.clientX - down.x, dy = ev.clientY - down.y;
      if (Math.hypot(dx,dy) <= 6 && (Date.now() - down.t) < 500) {
        // treat as click: toggle appropriate feature
        if (widgetKey === "keystrokes") { state.keystrokes = !state.keystrokes; toggleKeystrokes(state.keystrokes); saveState(); showToast("Keystrokes " + (state.keystrokes ? "enabled":"disabled")); }
        else if (widgetKey === "cps") { state.cps = !state.cps; toggleCPS(state.cps); saveState(); showToast("CPS " + (state.cps ? "enabled":"disabled")); }
        else if (widgetKey === "ping") { state.ping = !state.ping; togglePing(state.ping); saveState(); showToast("Ping " + (state.ping ? "enabled":"disabled")); }
        else if (widgetKey === "armor") { state.armor = !state.armor; toggleArmor(state.armor); saveState(); showToast("Armor view " + (state.armor ? "enabled":"disabled")); }
        else if (widgetKey === "cape") {
          if (state.cape) { state.cape = null; applyCape(null); saveState(); showToast("Cape disabled"); }
          else showToast("Select a cape from Accessories tab");
        }
      }
      down = null;
    };
    el.addEventListener("mousedown", downHandler);
    el.addEventListener("mouseup", upHandler);
  }
 
  // Utility: toast message
  let toastEl = null;
  function showToast(msg, ms = 1100) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.cssText = "position:fixed; left:50%; bottom:26px; transform:translateX(-50%); background:rgba(6,10,12,0.84); color:#e7f6ff; padding:8px 12px; border-radius:8px; z-index:2147483650; font-size:13px;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    setTimeout(()=>{ if (toastEl) toastEl.style.opacity = "0"; }, ms);
  }
 
  // Save before unload
  window.addEventListener("beforeunload", saveState);
 
  // Init: apply persisted widgets & settings
  setTimeout(() => {
    if (state.keystrokes) toggleKeystrokes(true);
    if (state.cps) toggleCPS(true);
    if (state.ping) togglePing(true);
    if (state.armor) toggleArmor(true);
    if (state.cape) applyCape(state.cape);
    if (state.texture) applyTexture(state.texture);
    applyFPSState();
    setTimeout(updateLockState, 300);
  }, 400);
 
  // End of userscript
})();
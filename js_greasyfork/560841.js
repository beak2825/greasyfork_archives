// ==UserScript==
// @name         Gota.io UI Overlay (made by N1ght)
// @namespace    https://example.com
// @version      1.0.0
// @description  modern overlay ui + click visuals + settings storage (no gameplay automation). made by N1ght
// @match        *https://play.gota.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560841/Gotaio%20UI%20Overlay%20%28made%20by%20N1ght%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560841/Gotaio%20UI%20Overlay%20%28made%20by%20N1ght%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ---------- utils ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const storeKey = "n1ght-ui-settings";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const loadSettings = () => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const saveSettings = (s) => {
    localStorage.setItem(storeKey, JSON.stringify(s));
  };

  const defaultSettings = {
    ui: {
      openKey: "Shift+O",
      accent: 210, // hue
      blur: true,
      compact: false,
    },
    visuals: {
      clickRipples: true,
      clickParticles: true,
      particleCount: 14,
      rippleSize: 22,
      intensity: 0.9,
    },
    hud: {
      crosshair: false,
      centerDot: true,
      fpsBadge: true,
    },
  };

  const settings = Object.assign({}, defaultSettings, loadSettings() || {});
  // deep merge basics
  settings.ui = Object.assign({}, defaultSettings.ui, settings.ui || {});
  settings.visuals = Object.assign({}, defaultSettings.visuals, settings.visuals || {});
  settings.hud = Object.assign({}, defaultSettings.hud, settings.hud || {});
  saveSettings(settings);

  // ---------- styles ----------
  const style = document.createElement("style");
  style.textContent = `
    :root{
      --n1-accent-h: ${settings.ui.accent};
      --n1-accent: hsl(var(--n1-accent-h) 90% 58%);
      --n1-accent-2: hsl(var(--n1-accent-h) 90% 68%);
      --n1-bg: rgba(16, 16, 18, .78);
      --n1-card: rgba(28, 28, 33, .72);
      --n1-border: rgba(255,255,255,.10);
      --n1-text: rgba(255,255,255,.92);
      --n1-muted: rgba(255,255,255,.62);
      --n1-shadow: 0 18px 45px rgba(0,0,0,.45);
      --n1-radius: 18px;
      --n1-radius2: 12px;
      --n1-font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }

    .n1-overlay{
      position: fixed;
      inset: 0;
      display: none;
      z-index: 999999;
      background: rgba(0,0,0,.25);
      ${settings.ui.blur ? "backdrop-filter: blur(10px);" : ""}
    }
    .n1-overlay.n1-show{ display:block; animation: n1fade .18s ease-out; }
    @keyframes n1fade{ from{opacity:0} to{opacity:1} }

    .n1-panel{
      position: absolute;
      top: 50%;
      left: 50%;
      width: min(920px, calc(100vw - 26px));
      transform: translate(-50%, -50%);
      background: var(--n1-bg);
      border: 1px solid var(--n1-border);
      border-radius: var(--n1-radius);
      box-shadow: var(--n1-shadow);
      overflow: hidden;
      color: var(--n1-text);
      font-family: var(--n1-font);
    }

    .n1-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--n1-border);
      background: linear-gradient(180deg, rgba(255,255,255,.06), transparent);
      cursor: grab;
      user-select:none;
    }

    .n1-title{
      display:flex;
      align-items:center;
      gap: 10px;
      font-weight: 700;
      letter-spacing: .2px;
    }

    .n1-badge{
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      color: rgba(0,0,0,.85);
      background: linear-gradient(135deg, var(--n1-accent), var(--n1-accent-2));
      box-shadow: 0 10px 26px rgba(0,0,0,.35);
    }

    .n1-sub{
      font-size: 12px;
      color: var(--n1-muted);
      font-weight: 600;
    }

    .n1-actions{
      display:flex;
      align-items:center;
      gap: 8px;
    }

    .n1-btn{
      border: 1px solid var(--n1-border);
      background: rgba(255,255,255,.06);
      color: var(--n1-text);
      padding: 8px 10px;
      border-radius: 12px;
      font-size: 13px;
      cursor: pointer;
      transition: transform .08s ease, background .15s ease, border-color .15s ease;
    }
    .n1-btn:hover{ background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.16); }
    .n1-btn:active{ transform: translateY(1px); }

    .n1-body{
      display:grid;
      grid-template-columns: 220px 1fr;
      min-height: 420px;
    }

    .n1-sidebar{
      padding: 12px;
      border-right: 1px solid var(--n1-border);
      background: rgba(0,0,0,.12);
    }

    .n1-tab{
      display:flex;
      align-items:center;
      gap: 10px;
      padding: 10px 10px;
      border-radius: 14px;
      cursor:pointer;
      color: rgba(255,255,255,.80);
      border: 1px solid transparent;
      transition: background .15s ease, border-color .15s ease;
      margin-bottom: 8px;
      font-weight: 650;
      font-size: 13px;
    }
    .n1-tab:hover{ background: rgba(255,255,255,.06); }
    .n1-tab.n1-active{
      background: rgba(255,255,255,.08);
      border-color: rgba(255,255,255,.10);
      color: rgba(255,255,255,.94);
    }
    .n1-dot{
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--n1-accent);
      box-shadow: 0 0 0 5px rgba(255,255,255,.05);
    }

    .n1-content{
      padding: 14px;
    }

    .n1-grid{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .n1-card{
      background: var(--n1-card);
      border: 1px solid var(--n1-border);
      border-radius: var(--n1-radius2);
      padding: 12px;
    }

    .n1-card h3{
      margin: 0 0 8px 0;
      font-size: 14px;
      letter-spacing: .2px;
    }
    .n1-row{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 10px;
      padding: 8px 0;
      border-top: 1px solid rgba(255,255,255,.06);
    }
    .n1-row:first-of-type{ border-top: none; }
    .n1-row .l{
      display:flex;
      flex-direction:column;
      gap: 2px;
    }
    .n1-row .label{ font-size: 13px; font-weight: 650; color: rgba(255,255,255,.90); }
    .n1-row .hint{ font-size: 12px; color: rgba(255,255,255,.58); }

    .n1-toggle{
      width: 44px; height: 26px;
      border-radius: 999px;
      background: rgba(255,255,255,.12);
      border: 1px solid rgba(255,255,255,.12);
      position: relative;
      cursor: pointer;
      transition: background .15s ease, border-color .15s ease;
      flex: 0 0 auto;
    }
    .n1-toggle::after{
      content:"";
      width: 20px; height: 20px;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      position:absolute;
      top: 50%;
      left: 3px;
      transform: translateY(-50%);
      transition: left .15s ease, background .15s ease;
      box-shadow: 0 10px 22px rgba(0,0,0,.35);
    }
    .n1-toggle[data-on="true"]{
      background: rgba(0,0,0,.22);
      border-color: rgba(255,255,255,.18);
    }
    .n1-toggle[data-on="true"]::after{
      left: 21px;
      background: linear-gradient(135deg, var(--n1-accent), var(--n1-accent-2));
    }

    .n1-slider{
      width: 180px;
      accent-color: var(--n1-accent);
    }

    .n1-key{
      min-width: 140px;
      text-align:center;
      padding: 8px 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(0,0,0,.18);
      color: rgba(255,255,255,.92);
      font-weight: 700;
      font-size: 12px;
      cursor:pointer;
      user-select:none;
    }

    .n1-note{
      margin-top: 10px;
      font-size: 12px;
      color: rgba(255,255,255,.62);
      line-height: 1.4;
    }

    /* HUD */
    .n1-hud{
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999998;
      font-family: var(--n1-font);
    }
    .n1-crosshair{
      position:absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 26px; height: 26px;
      opacity: .85;
      display:none;
    }
    .n1-crosshair::before,
    .n1-crosshair::after{
      content:"";
      position:absolute;
      left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255,255,255,.80);
      box-shadow: 0 0 14px rgba(0,0,0,.4);
      border-radius: 999px;
    }
    .n1-crosshair::before{ width: 2px; height: 26px; }
    .n1-crosshair::after{ width: 26px; height: 2px; }

    .n1-centerdot{
      position:absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 4px; height: 4px;
      border-radius: 999px;
      background: var(--n1-accent);
      box-shadow: 0 0 0 7px rgba(255,255,255,.05), 0 14px 30px rgba(0,0,0,.35);
      display:none;
    }

    .n1-fps{
      position: fixed;
      right: 12px;
      top: 12px;
      padding: 8px 10px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(0,0,0,.28);
      color: rgba(255,255,255,.88);
      font-weight: 750;
      font-size: 12px;
      pointer-events:none;
      display:none;
    }

    /* Click visuals */
    .n1-ripple{
      position: fixed;
      width: 10px; height: 10px;
      border-radius: 999px;
      border: 2px solid rgba(255,255,255,.9);
      transform: translate(-50%, -50%) scale(.2);
      opacity: .85;
      pointer-events:none;
      z-index: 999997;
      animation: n1ripple .55s ease-out forwards;
    }
    @keyframes n1ripple{
      to { transform: translate(-50%, -50%) scale(1.0); opacity: 0; }
    }
    .n1-particle{
      position: fixed;
      width: 6px; height: 6px;
      border-radius: 999px;
      background: var(--n1-accent);
      transform: translate(-50%, -50%);
      pointer-events:none;
      z-index: 999997;
      opacity: .95;
      filter: drop-shadow(0 10px 18px rgba(0,0,0,.45));
    }

    @media (max-width: 780px){
      .n1-body{ grid-template-columns: 1fr; }
      .n1-sidebar{ border-right:none; border-bottom: 1px solid var(--n1-border); display:flex; gap:8px; overflow:auto; }
      .n1-tab{ margin-bottom:0; white-space:nowrap; }
      .n1-grid{ grid-template-columns: 1fr; }
      .n1-slider{ width: 140px; }
    }
  `;
  document.documentElement.appendChild(style);

  // ---------- HUD container ----------
  const hud = document.createElement("div");
  hud.className = "n1-hud";
  hud.innerHTML = `
    <div class="n1-crosshair" id="n1-crosshair"></div>
    <div class="n1-centerdot" id="n1-centerdot"></div>
    <div class="n1-fps" id="n1-fps">fps: --</div>
  `;
  document.body.appendChild(hud);

  const crosshairEl = $("#n1-crosshair");
  const centerDotEl = $("#n1-centerdot");
  const fpsEl = $("#n1-fps");

  const applyHud = () => {
    crosshairEl.style.display = settings.hud.crosshair ? "block" : "none";
    centerDotEl.style.display = settings.hud.centerDot ? "block" : "none";
    fpsEl.style.display = settings.hud.fpsBadge ? "block" : "none";
  };
  applyHud();

  // FPS ticker
  let last = performance.now();
  let frames = 0;
  let fps = 0;
  const fpsLoop = (t) => {
    frames++;
    if (t - last >= 500) {
      fps = Math.round((frames * 1000) / (t - last));
      frames = 0;
      last = t;
      if (settings.hud.fpsBadge) fpsEl.textContent = `fps: ${fps}`;
    }
    requestAnimationFrame(fpsLoop);
  };
  requestAnimationFrame(fpsLoop);

  // ---------- overlay UI ----------
  const overlay = document.createElement("div");
  overlay.className = "n1-overlay";
  overlay.innerHTML = `
    <div class="n1-panel" id="n1-panel">
      <div class="n1-header" id="n1-drag">
        <div class="n1-title">
          <span class="n1-dot"></span>
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span>N1ght Overlay</span>
              <span class="n1-badge">made by N1ght</span>
            </div>
            <div class="n1-sub">ui + visuals • open/close with <span id="n1-openkey"></span></div>
          </div>
        </div>
        <div class="n1-actions">
          <button class="n1-btn" id="n1-reset">reset</button>
          <button class="n1-btn" id="n1-close">close</button>
        </div>
      </div>

      <div class="n1-body">
        <div class="n1-sidebar">
          <div class="n1-tab n1-active" data-tab="visuals"><span class="n1-dot"></span>visuals</div>
          <div class="n1-tab" data-tab="hud"><span class="n1-dot"></span>hud</div>
          <div class="n1-tab" data-tab="ui"><span class="n1-dot"></span>ui</div>
          <div class="n1-tab" data-tab="about"><span class="n1-dot"></span>about</div>
        </div>

        <div class="n1-content">
          <div class="n1-page" data-page="visuals">
            <div class="n1-grid">
              <div class="n1-card">
                <h3>click effects</h3>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">ripples</div>
                    <div class="hint">ring burst on click</div>
                  </div>
                  <div class="n1-toggle" data-key="visuals.clickRipples"></div>
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">particles</div>
                    <div class="hint">small accent particles on click</div>
                  </div>
                  <div class="n1-toggle" data-key="visuals.clickParticles"></div>
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">particle count</div>
                    <div class="hint">how many per click</div>
                  </div>
                  <input class="n1-slider" type="range" min="0" max="40" step="1" data-key="visuals.particleCount" />
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">ripple size</div>
                    <div class="hint">bigger ring</div>
                  </div>
                  <input class="n1-slider" type="range" min="10" max="60" step="1" data-key="visuals.rippleSize" />
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">intensity</div>
                    <div class="hint">overall effect strength</div>
                  </div>
                  <input class="n1-slider" type="range" min="0" max="1" step="0.05" data-key="visuals.intensity" />
                </div>
              </div>

              <div class="n1-card">
                <h3>accent</h3>
                <div class="n1-row">
                  <div class="l">
                    <div class="label">accent hue</div>
                    <div class="hint">changes the whole theme</div>
                  </div>
                  <input class="n1-slider" type="range" min="0" max="360" step="1" data-key="ui.accent" />
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">background blur</div>
                    <div class="hint">glass look</div>
                  </div>
                  <div class="n1-toggle" data-key="ui.blur"></div>
                </div>

                <div class="n1-note">
                  this ui is designed to be premium + clean. it only controls overlays/visuals, not gameplay.
                </div>
              </div>
            </div>
          </div>

          <div class="n1-page" data-page="hud" style="display:none;">
            <div class="n1-grid">
              <div class="n1-card">
                <h3>hud</h3>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">crosshair</div>
                    <div class="hint">simple cross</div>
                  </div>
                  <div class="n1-toggle" data-key="hud.crosshair"></div>
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">center dot</div>
                    <div class="hint">tiny accent dot</div>
                  </div>
                  <div class="n1-toggle" data-key="hud.centerDot"></div>
                </div>

                <div class="n1-row">
                  <div class="l">
                    <div class="label">fps badge</div>
                    <div class="hint">small counter top-right</div>
                  </div>
                  <div class="n1-toggle" data-key="hud.fpsBadge"></div>
                </div>
              </div>

              <div class="n1-card">
                <h3>tips</h3>
                <div class="n1-note">
                  if you want, i can also add a nicer draggable mini-button on the game ui to open this,
                  plus presets (profiles) you can save/load.
                </div>
              </div>
            </div>
          </div>

          <div class="n1-page" data-page="ui" style="display:none;">
            <div class="n1-grid">
              <div class="n1-card">
                <h3>open key</h3>
                <div class="n1-row">
                  <div class="l">
                    <div class="label">toggle overlay</div>
                    <div class="hint">click to set a new hotkey</div>
                  </div>
                  <div class="n1-key" id="n1-bind">set key</div>
                </div>
                <div class="n1-note">
                  current: <strong id="n1-bind-current"></strong>
                </div>
              </div>

              <div class="n1-card">
                <h3>layout</h3>
                <div class="n1-row">
                  <div class="l">
                    <div class="label">compact mode</div>
                    <div class="hint">tighter spacing</div>
                  </div>
                  <div class="n1-toggle" data-key="ui.compact"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="n1-page" data-page="about" style="display:none;">
            <div class="n1-card">
              <h3>about</h3>
              <div class="n1-note">
                <strong>made by N1ght</strong><br><br>
                this is a ui + visual overlay userscript. it avoids gameplay automation or macros.
                if you want “legit” improvements, i can also help you build:
                presets, import/export, better keybind ui, and more visual polish.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const panel = $("#n1-panel");
  const openKeyLabel = $("#n1-openkey");
  const bindBtn = $("#n1-bind");
  const bindCurrent = $("#n1-bind-current");

  const updateHeaderKeyText = () => {
    openKeyLabel.textContent = settings.ui.openKey;
    bindCurrent.textContent = settings.ui.openKey;
    document.documentElement.style.setProperty("--n1-accent-h", String(settings.ui.accent));
    // blur toggle needs full refresh of style rules; simplest: toggle class-like effect via overlay bg
    overlay.style.backdropFilter = settings.ui.blur ? "blur(10px)" : "none";
  };
  updateHeaderKeyText();

  // tabs
  $$(".n1-tab", overlay).forEach((t) => {
    t.addEventListener("click", () => {
      $$(".n1-tab", overlay).forEach(x => x.classList.remove("n1-active"));
      t.classList.add("n1-active");
      const tab = t.dataset.tab;
      $$(".n1-page", overlay).forEach(p => {
        p.style.display = (p.dataset.page === tab) ? "block" : "none";
      });
    });
  });

  // close behavior
  const closeOverlay = () => overlay.classList.remove("n1-show");
  const openOverlay = () => overlay.classList.add("n1-show");
  const toggleOverlay = () => overlay.classList.toggle("n1-show");

  $("#n1-close").addEventListener("click", closeOverlay);
  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // reset
  $("#n1-reset").addEventListener("click", () => {
    Object.assign(settings.ui, defaultSettings.ui);
    Object.assign(settings.visuals, defaultSettings.visuals);
    Object.assign(settings.hud, defaultSettings.hud);
    saveSettings(settings);
    syncUI();
    applyHud();
    updateHeaderKeyText();
  });

  // toggles + sliders binding
  const getPath = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), settings);
  const setPath = (path, val) => {
    const parts = path.split(".");
    const last = parts.pop();
    const root = parts.reduce((o, k) => (o[k] ??= {}), settings);
    root[last] = val;
    saveSettings(settings);
  };

  const syncUI = () => {
    // toggles
    $$(".n1-toggle", overlay).forEach((tog) => {
      const key = tog.dataset.key;
      const on = !!getPath(key);
      tog.dataset.on = String(on);
    });
    // sliders
    $$("input[type='range'][data-key]", overlay).forEach((r) => {
      const key = r.dataset.key;
      const v = getPath(key);
      if (typeof v === "number") r.value = String(v);
    });
  };

  overlay.addEventListener("click", (e) => {
    const t = e.target.closest(".n1-toggle");
    if (!t) return;
    const key = t.dataset.key;
    const next = !getPath(key);
    setPath(key, next);
    t.dataset.on = String(next);

    if (key.startsWith("hud.")) applyHud();
    if (key.startsWith("ui.")) updateHeaderKeyText();
  });

  overlay.addEventListener("input", (e) => {
    const r = e.target.closest("input[type='range'][data-key]");
    if (!r) return;
    const key = r.dataset.key;

    let val = r.value;
    if (key === "visuals.intensity") val = parseFloat(val);
    else val = parseInt(val, 10);

    if (key === "visuals.particleCount") val = clamp(val, 0, 60);
    if (key === "visuals.rippleSize") val = clamp(val, 8, 90);
    if (key === "ui.accent") val = clamp(val, 0, 360);

    setPath(key, val);
    if (key.startsWith("ui.")) updateHeaderKeyText();
  });

  syncUI();

  // ---------- drag panel ----------
  (() => {
    const drag = $("#n1-drag");
    let dragging = false;
    let sx = 0, sy = 0;
    let px = 0, py = 0;

    const getTranslate = () => {
      // panel is centered via translate(-50%, -50%) so we emulate offsets via left/top
      const rect = panel.getBoundingClientRect();
      return { left: rect.left, top: rect.top };
    };

    drag.addEventListener("mousedown", (e) => {
      dragging = true;
      drag.style.cursor = "grabbing";
      sx = e.clientX; sy = e.clientY;
      const pos = getTranslate();
      px = pos.left; py = pos.top;

      // switch panel to fixed pixel positioning for drag
      panel.style.left = px + "px";
      panel.style.top = py + "px";
      panel.style.transform = "translate(0, 0)";
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;

      const w = panel.offsetWidth;
      const h = panel.offsetHeight;
      const nx = clamp(px + dx, 10, window.innerWidth - w - 10);
      const ny = clamp(py + dy, 10, window.innerHeight - h - 10);

      panel.style.left = nx + "px";
      panel.style.top = ny + "px";
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      drag.style.cursor = "grab";
    });
  })();

  // ---------- open hotkey ----------
  const parseHotkey = (str) => {
    const s = String(str || "").toLowerCase().replace(/\s+/g, "");
    // example: shift+o, ctrl+alt+k
    const parts = s.split("+").filter(Boolean);
    const mods = { shift:false, ctrl:false, alt:false, meta:false, key:"" };
    for (const p of parts) {
      if (p === "shift") mods.shift = true;
      else if (p === "ctrl" || p === "control") mods.ctrl = true;
      else if (p === "alt") mods.alt = true;
      else if (p === "meta" || p === "win" || p === "cmd" || p === "command") mods.meta = true;
      else mods.key = p;
    }
    return mods;
  };

  const hotkey = () => parseHotkey(settings.ui.openKey);

  const matchHotkey = (e, hk) => {
    const k = (e.key || "").toLowerCase();
    return (
      e.shiftKey === hk.shift &&
      e.ctrlKey === hk.ctrl &&
      e.altKey === hk.alt &&
      e.metaKey === hk.meta &&
      k === hk.key
    );
  };

  window.addEventListener("keydown", (e) => {
    // don't steal typing
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const hk = hotkey();
    if (hk.key && matchHotkey(e, hk)) {
      e.preventDefault();
      toggleOverlay();
    }
  });

  // ---------- keybind capture UI ----------
  let capturing = false;
  const niceKeyName = (e) => {
    const parts = [];
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    if (e.metaKey) parts.push("Meta");
    const k = (e.key || "").toUpperCase();
    if (!["CONTROL","SHIFT","ALT","META"].includes(k) && k.length) parts.push(k);
    return parts.join("+");
  };

  bindBtn.textContent = "set key";
  bindBtn.addEventListener("click", () => {
    capturing = true;
    bindBtn.textContent = "press keys…";
  });

  window.addEventListener("keydown", (e) => {
    if (!capturing) return;
    e.preventDefault();
    const name = niceKeyName(e);
    // require at least one modifier + a real key (to avoid accidental single letter)
    const hasModifier = e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
    const keyOk = e.key && !["Control","Shift","Alt","Meta"].includes(e.key);

    if (hasModifier && keyOk) {
      settings.ui.openKey = name;
      saveSettings(settings);
      capturing = false;
      bindBtn.textContent = "set key";
      updateHeaderKeyText();
    }
  }, { capture:true });

  // ---------- click visuals ----------
  const spawnRipple = (x, y) => {
    const r = document.createElement("div");
    r.className = "n1-ripple";
    const size = settings.visuals.rippleSize * (0.9 + settings.visuals.intensity * 0.3);
    r.style.left = x + "px";
    r.style.top = y + "px";
    r.style.width = size + "px";
    r.style.height = size + "px";
    r.style.borderColor = `hsla(${settings.ui.accent}, 90%, 62%, ${0.7 * settings.visuals.intensity})`;
    document.body.appendChild(r);
    r.addEventListener("animationend", () => r.remove(), { once:true });
  };

  const spawnParticles = (x, y) => {
    const n = clamp(settings.visuals.particleCount, 0, 60);
    if (n <= 0) return;

    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "n1-particle";
      p.style.left = x + "px";
      p.style.top = y + "px";

      const ang = Math.random() * Math.PI * 2;
      const dist = (18 + Math.random() * 42) * (0.55 + settings.visuals.intensity * 0.75);
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const life = 260 + Math.random() * 260;

      const hueJitter = (Math.random() * 26 - 13);
      p.style.background = `hsla(${settings.ui.accent + hueJitter}, 90%, 62%, ${0.95 * settings.visuals.intensity})`;

      document.body.appendChild(p);

      const start = performance.now();
      const tick = (t) => {
        const k = clamp((t - start) / life, 0, 1);
        const ease = 1 - Math.pow(1 - k, 3);
        const nx = x + dx * ease;
        const ny = y + dy * ease + (k * k) * 18; // subtle gravity
        p.style.left = nx + "px";
        p.style.top = ny + "px";
        p.style.opacity = String((1 - k) * 0.95);

        if (k < 1) requestAnimationFrame(tick);
        else p.remove();
      };
      requestAnimationFrame(tick);
    }
  };

  window.addEventListener("pointerdown", (e) => {
    // don't fire when overlay is open and you click inside it (optional)
    if (overlay.classList.contains("n1-show") && panel.contains(e.target)) return;

    if (settings.visuals.clickRipples) spawnRipple(e.clientX, e.clientY);
    if (settings.visuals.clickParticles) spawnParticles(e.clientX, e.clientY);
  });

  // start closed
  closeOverlay();

})();

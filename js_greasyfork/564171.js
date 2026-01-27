// ==UserScript==
// @name         R4G3RUNN3R's Recruitment Agency
// @namespace    r4g3runn3r.recruitment.agency
// @version      1.6.3
// @description  Recruitment Agency for Torn. Bible logic preserved + UI state, themes, density, docking, and safer reset location. Fixes paste-truncation syntax errors.
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564171/R4G3RUNN3R%27s%20Recruitment%20Agency.user.js
// @updateURL https://update.greasyfork.org/scripts/564171/R4G3RUNN3R%27s%20Recruitment%20Agency.meta.js
// ==/UserScript==
 
(() => {
  "use strict";
 
  // ---------------------------------------------------------
  // QUICK SYNTAX SANITY (won't run if script is actually broken)
  // ---------------------------------------------------------
  // If you still get "Unexpected end of input", your paste is truncated.
  // This code does not cause that error; missing bytes do.
  try { void 0; } catch (_) {}
 
  /* -----------------------------
     CONFIG & STATE
  ----------------------------- */
  const THREAD_ID = 15907925;
  const FORUM_F = 46;
  const PAGE_SIZE = 20;
  const DB_NAME = "tornWorkerDB";
  const REQUIRED_DB_VERSION = 4;
  const BOOTSTRAP_DELAY_MS = 1100;
 
  // UI state: "open" | "minimized" | "closed"
  let raUIState = "minimized";
 
  // Dock icon enabled by default (safer, so you always have a way back in)
  let raDockEnabled = true;
 
  const COMPANY_OPTIONS = [
    { value: "", label: "Any" }, { value: "adult_novelties", label: "Adult Novelties" }, { value: "amusement_park", label: "Amusement Park" },
    { value: "candle_shop", label: "Candle Shop" }, { value: "car_dealership", label: "Car Dealership" },
    { value: "clothing_store", label: "Clothing Store" }, { value: "cruise_line", label: "Cruise Line" },
    { value: "cyber_cafe", label: "Cyber Cafe" }, { value: "detective_agency", label: "Detective Agency" },
    { value: "farm", label: "Farm" }, { value: "firework_stand", label: "Firework Stand" },
    { value: "fitness_center", label: "Fitness Center" }, { value: "flower_shop", label: "Flower Shop" },
    { value: "furniture_store", label: "Furniture Store" }, { value: "game_shop", label: "Game Shop" },
    { value: "gas_station", label: "Gas Station" }, { value: "gents_strip_club", label: "Gentleman's Club" },
    { value: "grocery_store", label: "Grocery Store" }, { value: "gun_shop", label: "Gun Shop" },
    { value: "hair_salon", label: "Hair Salon" }, { value: "ladies_strip_club", label: "Ladies Strip Club" },
    { value: "law_firm", label: "Law Firm" }, { value: "lingerie_store", label: "Lingerie Store" },
    { value: "logistics_management", label: "Logistics Management" }, { value: "meat_warehouse", label: "Meat Warehouse" },
    { value: "mechanic_shop", label: "Mechanic Shop" }, { value: "mining_corporation", label: "Mining Corporation" },
    { value: "music_store", label: "Music Store" }, { value: "nightclub", label: "Nightclub" },
    { value: "oil_rig", label: "Oil Rig" }, { value: "private_security_firm", label: "Private Security Firm (PSF)" },
    { value: "property_broker", label: "Property Broker" }, { value: "pub", label: "Pub" },
    { value: "restaurant", label: "Restaurant" }, { value: "software_corporation", label: "Software Corporation" },
    { value: "sweet_shop", label: "Sweet Shop" }, { value: "television_network", label: "Television Network" },
    { value: "theater", label: "Theater" }, { value: "toy_shop", label: "Toy Shop" },
    { value: "travel_agency", label: "Travel Agency" }, { value: "wedding_chapel", label: "Wedding Chapel" },
    { value: "zoo", label: "Zoo" }
  ];
 
  let db = null;
  let dbReady = false;
  let scanRunning = false;
  let currentSearchPage = 1;
  let filteredResultsCache = [];
 
  /* -----------------------------
     PDA DETECTION
  ----------------------------- */
  function isPDA() {
    try {
      // eslint-disable-next-line no-undef
      const uw = typeof unsafeWindow !== "undefined" ? unsafeWindow : null;
      return (
        /PDA|Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ||
        (uw && uw.PDA !== undefined)
      );
    } catch {
      return /PDA|Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
    }
  }
 
  /* -----------------------------
     DOM SENTINEL & UI
  ----------------------------- */
  function ensureUI() {
    if (!document.getElementById("ra-panel")) injectPanel();
    if (!document.getElementById("ra-float-wrap")) ensureFloatingButton();
    applyDockSetting();
    applyUIState();
  }
 
  const observer = new MutationObserver(() => ensureUI());
  observer.observe(document.documentElement, { childList: true, subtree: true });
 
  function applyUIState() {
    const panel = document.getElementById("ra-panel");
    const floatWrap = document.getElementById("ra-float-wrap");
    if (!panel) return;
 
    if (raUIState === "open" && isPDA()) panel.classList.add("ra-expanded");
    if (raUIState !== "open") panel.classList.remove("ra-expanded");
 
    if (raUIState === "open") {
      panel.style.display = "block";
      requestAnimationFrame(() => panel.classList.add("ra-visible"));
      if (floatWrap) floatWrap.style.display = "none";
      return;
    }
 
    if (raUIState === "minimized") {
      panel.classList.remove("ra-visible");
      panel.style.display = "none";
      if (floatWrap) floatWrap.style.display = "block";
      return;
    }
 
    panel.classList.remove("ra-visible");
    panel.style.display = "none";
    if (floatWrap) floatWrap.style.display = "none";
  }
 
  function centerPanel() {
    const p = document.getElementById("ra-panel");
    if (!p) return;
    const r = p.getBoundingClientRect();
    p.style.left = Math.max(20, (window.innerWidth - r.width) / 2) + "px";
    p.style.top = Math.max(20, (window.innerHeight - r.height) / 2) + "px";
  }
 
  function openPanel() {
    raUIState = "open";
    const p = document.getElementById("ra-panel");
    if (p && (!p.style.left || !p.style.top)) centerPanel();
    applyUIState();
    persistUIState().catch(() => {});
  }
 
  function minimizePanel() {
    raUIState = "minimized";
    applyUIState();
    persistUIState().catch(() => {});
  }
 
  function closePanel() {
    raUIState = "closed";
    applyUIState();
    persistUIState().catch(() => {});
  }
 
  function injectStyles() {
    if (document.getElementById("ra-styles")) return;
 
    const s = document.createElement("style");
    s.id = "ra-styles";
    s.textContent = `
:root {
  --ra-bg-main: rgba(14,16,20,0.96);
  --ra-bg-soft: rgba(18,20,26,0.98);
  --ra-border: rgba(255,255,255,0.14);
  --ra-text-main: #f3f4f6;
  --ra-text-muted: #9ca3af;
  --ra-accent: #22c55e;
  --ra-danger: #b91c1c;
  --ra-danger-soft: rgba(127,29,29,0.15);
  --ra-radius: 14px;
  --ra-shadow: 0 14px 40px rgba(0,0,0,0.45);
  --ra-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --ra-fontsize: 12px;
  --ra-gap: 10px;
  --ra-pad: 12px;
  --ra-card-pad: 10px;
  --ra-input-pad: 6px;
}
 
:root[data-ra-theme="light"] {
  --ra-bg-main: #f9fafb;
  --ra-bg-soft: #ffffff;
  --ra-border: #d1d5db;
  --ra-text-main: #111827;
  --ra-text-muted: #6b7280;
  --ra-accent: #16a34a;
  --ra-shadow: 0 12px 30px rgba(0,0,0,0.18);
}
 
:root[data-ra-density="compact"] {
  --ra-fontsize: 11px;
  --ra-gap: 8px;
  --ra-pad: 10px;
  --ra-card-pad: 8px;
  --ra-input-pad: 5px;
}
 
/* FLOAT BUTTON */
#ra-float-wrap{
  position:fixed;
  right:14px;
  top:50%;
  transform:translateY(-50%);
  z-index:2147483647;
  width:160px;
  font-family: var(--ra-font);
}
#ra-float-btn{
  background:rgba(34,197,94,0.95);
  color:#fff;
  border:2px solid rgba(255,255,255,0.4);
  padding:10px 14px;
  border-radius:12px;
  cursor:pointer;
  font-weight:900;
  box-shadow:0 8px 32px rgba(34,197,94,0.4);
  animation: ra-pulse 2s infinite;
  width:100%;
}
@keyframes ra-pulse{
  0%{ box-shadow: 0 0 0 0 rgba(34,197,94, 0.65); }
  70%{ box-shadow: 0 0 0 12px rgba(34,197,94, 0); }
  100%{ box-shadow: 0 0 0 0 rgba(34,197,94, 0); }
}
 
/* PANEL */
#ra-panel{
  position:fixed;
  z-index:2147483646;
  background:var(--ra-bg-main);
  color:var(--ra-text-main);
  border:1px solid var(--ra-border);
  border-radius:var(--ra-radius);
  width:440px;
  min-width:360px;
  min-height:260px;
  box-shadow:var(--ra-shadow);
  resize:both !important;
  overflow:hidden !important;
  display:none;
  top:100px;
  left:100px;
  font-family: var(--ra-font);
  font-size: var(--ra-fontsize);
  line-height: 1.4;
  opacity:0;
  transform: scale(0.985);
  transition: opacity 120ms ease, transform 120ms ease;
}
#ra-panel.ra-visible{
  opacity:1;
  transform: scale(1);
}
#ra-panel.ra-expanded{
  top:0 !important;
  left:0 !important;
  width:100vw !important;
  height:100vh !important;
  border-radius:0 !important;
}
 
.ra-header{
  background:var(--ra-bg-soft);
  padding:10px 12px;
  cursor:move;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom: 1px solid var(--ra-border);
}
.ra-title{
  font-size: 14px;
  font-weight: 900;
  letter-spacing: .2px;
  display:flex;
  align-items:center;
  gap:8px;
}
.ra-headbtns{
  display:flex;
  gap:6px;
  align-items:center;
}
.ra-headbtns button{
  min-width:26px;
  min-height:22px;
  padding:2px 8px;
}
 
.ra-inner{
  padding:var(--ra-pad);
  height: calc(100% - 52px);
  overflow-y:auto;
}
.ra-toprow{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
}
.ra-gear{
  background:none;
  border:none;
  color:var(--ra-text-main);
  cursor:pointer;
  font-size:16px;
}
 
.ra-card{
  border:1px solid rgba(255,255,255,0.12);
  padding:var(--ra-card-pad);
  border-radius:12px;
  margin-bottom:8px;
  background:rgba(0,0,0,0.12);
}
:root[data-ra-theme="light"] .ra-card{
  background:rgba(0,0,0,0.03);
  border-color: var(--ra-border);
}
.ra-card-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:6px;
}
.ra-k{
  font-size:10px;
  color:var(--ra-text-muted);
  font-weight:900;
}
.ra-v{
  font-size:11px;
  font-weight:900;
}
.ra-tag{
  font-size:10px;
  padding:3px 8px;
  border-radius:999px;
}
.ra-tag-green{ background:rgba(34,197,94,0.2); color:#4ade80; }
.ra-tag-amber{ background:rgba(245,158,11,0.2); color:#fbbf24; }
:root[data-ra-theme="light"] .ra-tag-green{ color:#166534; background: rgba(34,197,94,0.14); }
:root[data-ra-theme="light"] .ra-tag-amber{ color:#92400e; background: rgba(245,158,11,0.16); }
 
.ra-btn{
  padding:8px 10px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.22);
  color:var(--ra-text-main);
  cursor:pointer;
  font-weight:900;
}
:root[data-ra-theme="light"] .ra-btn{
  background: rgba(0,0,0,0.05);
  border-color: var(--ra-border);
}
.ra-primary{
  border-color: var(--ra-accent);
}
.ra-actions{
  display:flex;
  gap:10px;
  align-items:center;
}
 
.ra-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:var(--ra-gap);
  margin-bottom:12px;
}
.ra-field label{
  display:block;
  font-size:11px;
  font-weight:900;
  margin-bottom:4px;
  color: var(--ra-text-muted);
}
.ra-field input, .ra-field select{
  width:100%;
  padding: var(--ra-input-pad);
  background: rgba(0,0,0,0.35);
  color: var(--ra-text-main);
  border:1px solid rgba(255,255,255,0.16);
  border-radius:10px;
}
:root[data-ra-theme="light"] .ra-field input,
:root[data-ra-theme="light"] .ra-field select{
  background: rgba(0,0,0,0.03);
  border-color: var(--ra-border);
}
 
.ra-fill{
  height:100%;
  background: var(--ra-accent);
  width:0%;
  transition: width 0.3s;
}
.ra-hr{
  border:0;
  border-top:1px solid rgba(255,255,255,0.14);
  margin:15px 0;
}
:root[data-ra-theme="light"] .ra-hr{ border-top-color: var(--ra-border); }
 
#ra-settings{
  display:none;
  padding:10px;
  background: rgba(0,0,0,0.18);
  border-radius:12px;
  margin-bottom:10px;
  border:1px solid rgba(255,255,255,0.16);
}
:root[data-ra-theme="light"] #ra-settings{
  background: rgba(0,0,0,0.03);
  border-color: var(--ra-border);
}
.ra-settings-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin:6px 0;
}
.ra-toggle{
  display:flex;
  align-items:center;
  gap:8px;
  font-weight:900;
  color: var(--ra-text-main);
}
.ra-muted{
  color: var(--ra-text-muted);
  font-size: 11px;
}
.ra-danger-zone{
  margin-top:10px;
  padding:10px;
  border:1px solid var(--ra-danger);
  border-radius:12px;
  background: var(--ra-danger-soft);
}
.ra-danger-title{
  font-size:12px;
  font-weight:900;
  color:#fecaca;
  margin-bottom:6px;
}
.ra-danger-desc{
  font-size:11px;
  color:#fecaca;
  margin-bottom:8px;
}
.ra-btn-danger{
  border-color: var(--ra-danger);
  color:#fecaca;
}
.ra-btn-ghost{
  background: transparent;
}
 
.ra-dock-icon{
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(34,197,94,0.18);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition: transform 120ms ease, background 120ms ease;
}
.ra-dock-icon:hover{
  transform: scale(1.05);
  background: rgba(34,197,94,0.28);
}
.ra-dock-icon::before{
  content:"🔎";
  font-size: 14px;
}
.ra-post-icon {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  cursor: help;
  position: relative;
  color: var(--ra-text-muted);
}

.ra-post-icon:hover::after {
  content: attr(data-post);
  position: absolute;
  left: 0;
  top: 18px;
  max-width: 340px;
  padding: 8px 10px;
  background: var(--ra-bg-soft);
  color: var(--ra-text-main);
  border: 1px solid var(--ra-border);
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.4;
  white-space: normal;
  z-index: 9999;
  box-shadow: var(--ra-shadow);
}
`;
    document.head.appendChild(s);
  }
 
  function injectPanel() {
    if (document.getElementById("ra-panel")) return;
 
    const p = document.createElement("div");
    p.id = "ra-panel";
    p.innerHTML = `
      <div class="ra-header" id="ra-drag">
        <div class="ra-title">
          <span class="ra-badge" title="Recruitment Agency">🏷️</span>
          Recruitment Agency
        </div>
        <div class="ra-headbtns">
          <button class="ra-btn" id="ra-min-p" title="Minimize">▁</button>
          <button class="ra-btn" id="ra-close-p" title="Close">✕</button>
        </div>
      </div>
      <div class="ra-inner">
        <div class="ra-toprow">
          <div id="ra-status">Loading DB...</div>
          <button id="ra-gear" class="ra-gear" title="Settings">⚙</button>
        </div>
 
        <div id="ra-settings">
          <div class="ra-settings-row">
            <label class="ra-toggle"><input type="checkbox" id="ra-set-inactive"> Include inactive</label>
            <button class="ra-btn" id="ra-settings-close">Close</button>
          </div>
 
          <hr class="ra-hr">
 
          <div class="ra-settings-row">
            <label class="ra-toggle">
              <input type="checkbox" id="ra-theme-toggle">
              Light theme
            </label>
            <div class="ra-muted">Applies instantly</div>
          </div>
 
          <div class="ra-settings-row">
            <label class="ra-toggle">
              <input type="checkbox" id="ra-density-toggle">
              Compact density
            </label>
            <div class="ra-muted">Less padding</div>
          </div>
 
          <div class="ra-settings-row">
            <label class="ra-toggle">
              <input type="checkbox" id="ra-dock-toggle">
              Dock icon
            </label>
            <div class="ra-muted">Top status bar</div>
          </div>
 
          <div class="ra-settings-row">
            <button class="ra-btn ra-btn-ghost" id="ra-close-completely" title="Hide panel and floating button (dock icon can reopen)">
              Close completely
            </button>
            <div class="ra-muted">Dock icon reopens</div>
          </div>
 
          <div class="ra-danger-zone">
            <div class="ra-danger-title">⚠ Danger Zone</div>
            <div class="ra-danger-desc">This permanently deletes all stored data and resets the script.</div>
            <button class="ra-btn ra-btn-danger" id="ra-nuke-settings">☢ Hard Reset (NUKE)</button>
          </div>
        </div>
 
        <div id="ra-progress" style="display:none; margin-bottom:10px;">
          <div style="height:8px; background:rgba(255,255,255,0.10); border-radius:6px; overflow:hidden;">
            <div id="ra-fill" class="ra-fill"></div>
          </div>
          <div id="ra-progline" style="font-size:10px; text-align:center; color:var(--ra-text-muted); margin-top:4px;">0%</div>
        </div>
 
        <div class="ra-actions">
          <button class="ra-btn ra-primary" id="ra-do-scan">First Scan</button>
          <button class="ra-btn ra-primary" id="ra-do-update" style="display:none;">Update DB</button>
        </div>
 
        <hr class="ra-hr">
 
        <div class="ra-grid">
          <div class="ra-field" style="grid-column: span 2;">
            <label class="ra-k">👤 NAME / ID</label>
            <input type="text" id="ra-name-search">
          </div>
          <div class="ra-field">
            <label class="ra-k">💪 MAN≥</label>
            <input type="number" id="ra-man">
          </div>
          <div class="ra-field">
            <label class="ra-k">🧠 INT≥</label>
            <input type="number" id="ra-int">
          </div>
          <div class="ra-field">
            <label class="ra-k">🔋 END≥</label>
            <input type="number" id="ra-end">
          </div>
          <div class="ra-field">
            <label class="ra-k">📈 TOTAL≥</label>
            <input type="number" id="ra-total-min">
          </div>
          <div class="ra-field" style="grid-column: span 2;">
            <label class="ra-k">🏢 COMPANY</label>
            <select id="ra-company"></select>
          </div>
        </div>
 
        <div class="ra-actions">
          <button class="ra-btn ra-primary" id="ra-do-search" style="width:100%;">🔍 Search</button>
        </div>
 
        <div id="ra-results" style="margin-top:15px;"></div>
      </div>
    `;
 
    document.body.appendChild(p);
 
    const sel = p.querySelector("#ra-company");
    COMPANY_OPTIONS.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      sel.appendChild(o);
    });
 
    p.querySelector("#ra-min-p").onclick = minimizePanel;
    p.querySelector("#ra-close-p").onclick = minimizePanel;
 
    p.querySelector("#ra-gear").onclick = () => {
      const s = p.querySelector("#ra-settings");
      s.style.display = (s.style.display === "none" || s.style.display === "") ? "block" : "none";
    };
    p.querySelector("#ra-settings-close").onclick = () => {
      p.querySelector("#ra-settings").style.display = "none";
    };
 
    p.querySelector("#ra-do-scan").onclick = () => runScan(true);
    p.querySelector("#ra-do-update").onclick = () => runScan(false);
    p.querySelector("#ra-do-search").onclick = () => runSearch(true);
 
    p.querySelector("#ra-theme-toggle").addEventListener("change", async (e) => {
      const theme = e.target.checked ? "light" : "dark";
      applyTheme(theme);
      await persistSettings({ theme });
    });
 
    p.querySelector("#ra-density-toggle").addEventListener("change", async (e) => {
      const density = e.target.checked ? "compact" : "comfortable";
      applyDensity(density);
      await persistSettings({ density });
    });
 
    p.querySelector("#ra-dock-toggle").addEventListener("change", async (e) => {
      raDockEnabled = !!e.target.checked;
      applyDockSetting();
      await persistSettings({ dockEnabled: raDockEnabled });
    });
 
    p.querySelector("#ra-close-completely").addEventListener("click", () => {
      closePanel();
    });
 
    p.querySelector("#ra-nuke-settings").addEventListener("click", async () => {
      if (
        confirm("☢ HARD PURGE?\nThis deletes all data and resets the script.") &&
        prompt("Type 'NUKE IT' to confirm:") === "NUKE IT"
      ) {
        try { if (db) db.close(); } catch (_) {}
        await deleteDatabase(DB_NAME);
        location.reload();
      }
    });
 
    makeDraggable(p, p.querySelector("#ra-drag"));
 
    p.querySelector("#ra-name-search").addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearch(true);
    });
  }
 
  function ensureFloatingButton() {
    if (document.getElementById("ra-float-wrap")) return;
 
    const w = document.createElement("div");
    w.id = "ra-float-wrap";
    w.innerHTML = `<button id="ra-float-btn" title="Open Recruitment Agency">🔍 Worker Search</button>`;
    w.querySelector("#ra-float-btn").addEventListener("click", openPanel);
    document.body.appendChild(w);
  }
 
  /* -----------------------------
     THEME & DENSITY
  ----------------------------- */
  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-ra-theme", t);
    const toggle = document.getElementById("ra-theme-toggle");
    if (toggle) toggle.checked = (t === "light");
  }
 
  function applyDensity(density) {
    const d = density === "compact" ? "compact" : "comfortable";
    document.documentElement.setAttribute("data-ra-density", d);
    const toggle = document.getElementById("ra-density-toggle");
    if (toggle) toggle.checked = (d === "compact");
  }
 
  /* -----------------------------
     DOCKING
  ----------------------------- */
  function isDockEnabled() {
    return raDockEnabled !== false;
  }
 
  function findStatusIconsBar() {
    const candidates = [
      'ul[class*="status-icons"]',
      'ul[class*="statusIcons"]',
      'div[class*="status-icons"] ul',
      'div[class*="statusIcons"] ul'
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
 
  function ensureDockIcon() {
    if (!isDockEnabled()) return;
    const bar = findStatusIconsBar();
    if (!bar) return;
    if (bar.querySelector(".ra-dock-icon")) return;
 
    const li = document.createElement("li");
    li.className = "ra-dock-icon";
    li.title = "Recruitment Agency";
    li.addEventListener("click", openPanel);
 
    try { bar.prepend(li); } catch (_) { bar.appendChild(li); }
  }
 
  function applyDockSetting() {
    const icon = document.querySelector(".ra-dock-icon");
    if (isDockEnabled()) {
      ensureDockIcon();
    } else if (icon) {
      icon.remove();
    }
    const toggle = document.getElementById("ra-dock-toggle");
    if (toggle) toggle.checked = isDockEnabled();
  }
 
  /* -----------------------------
     DB & LOGIC
  ----------------------------- */
  async function openDBSmart() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, REQUIRED_DB_VERSION);
 
      req.onupgradeneeded = (e) => {
        const _db = e.target.result;
        if (!_db.objectStoreNames.contains("users")) _db.createObjectStore("users", { keyPath: "userId" });
        if (!_db.objectStoreNames.contains("meta")) _db.createObjectStore("meta", { keyPath: "key" });
      };
 
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB open failed"));
    });
  }
 
  function deleteDatabase(name) {
    return new Promise((resolve) => {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    });
  }
 
  const idb = {
    get: (store, key) => new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(store, "readonly");
        const st = tx.objectStore(store);
        const req = st.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    }),
    put: (store, value) => new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(store, "readwrite");
        const st = tx.objectStore(store);
        const req = st.put(value);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    }),
    getAll: (store) => new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(store, "readonly");
        const st = tx.objectStore(store);
        const req = st.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    })
  };
 
  async function runScan(full = true) {
    if (!dbReady || scanRunning) return;
 
    scanRunning = true;
    try {
      const prog = document.getElementById("ra-progress");
      if (prog) prog.style.display = "block";
 
      const startHtml = await (await fetch(
        `https://www.torn.com/forums.php?a=0&f=${FORUM_F}&p=threads&t=${THREAD_ID}`,
        { credentials: "include" }
      )).text();
 
      const lp = detectLP(new DOMParser().parseFromString(startHtml, "text/html"));
      const startP = full ? 1 : Math.max(1, lp - 9);
 
      for (let p = startP; p <= lp; p++) {
        const h = await (await fetch(
          `https://www.torn.com/forums.php?a=0&f=${FORUM_F}&p=threads&t=${THREAD_ID}&start=${(p - 1) * PAGE_SIZE}`,
          { credentials: "include" }
        )).text();
 
        const doc = new DOMParser().parseFromString(h, "text/html");
 
        const posts = Array.from(doc.querySelectorAll('a[href*="profiles.php"][href*="XID="]'))
          .map(l => {
            let c = l;
            for (let i = 0; i < 24 && c; i++) {
              if (c && /Posted on/i.test(c.textContent)) return c;
              c = c.parentElement;
            }
            return null;
          })
          .filter(Boolean);
 
        for (const post of posts) {
          const up = parseUser(post);
          if (up) {
            const ex = await idb.get("users", up.userId);
            await idb.put(
              "users",
              ex ? { ...ex, ...up, lastSeenPost: Math.max(ex.lastSeenPost || 0, up.lastSeenPost) } : up
            );
          }
        }
 
        const fill = document.getElementById("ra-fill");
        const progline = document.getElementById("ra-progline");
        if (fill) fill.style.width = ((p / lp) * 100) + "%";
        if (progline) progline.textContent = `${((p / lp) * 100).toFixed(1)}% (${p}/${lp})`;
 
        await new Promise(r => setTimeout(r, BOOTSTRAP_DELAY_MS));
      }
 
      const m = await idb.get("meta", "global");
      if (m) {
        m.bootstrapComplete = true;
        await idb.put("meta", m);
        syncUI(m);
      }
    } catch (e) {
      console.error("Recruitment Agency scan error:", e);
    } finally {
      scanRunning = false;
      const prog = document.getElementById("ra-progress");
      if (prog) prog.style.display = "none";
    }
  }
 
  async function runSearch(reset = true) {
    if (!dbReady) return;
    if (reset) currentSearchPage = 1;
 
    const panel = document.getElementById("ra-panel");
    if (!panel) return;
 
    const includeInactive = !!panel.querySelector("#ra-set-inactive")?.checked;
 
    if (reset) {
      const users = await idb.getAll("users");
      const nameQ = (panel.querySelector("#ra-name-search")?.value || "").toLowerCase().trim();
 
      const manMin = numOrNull(panel.querySelector("#ra-man")?.value);
      const intMin = numOrNull(panel.querySelector("#ra-int")?.value);
      const endMin = numOrNull(panel.querySelector("#ra-end")?.value);
      const totalMin = numOrNull(panel.querySelector("#ra-total-min")?.value);
 
      // COMPANY filter exists in UI; original logic didn't apply it.
      // Preserved behavior: still not filtering by company.
      filteredResultsCache = users
        .filter(u => {
          if (!includeInactive && u.status === "inactive") return false;
          if (nameQ && !u.name.toLowerCase().includes(nameQ) && !String(u.userId).includes(nameQ)) return false;
 
          const man = (u.stats && u.stats.man) ? u.stats.man : 0;
          const intl = (u.stats && u.stats.int) ? u.stats.int : 0;
          const end = (u.stats && u.stats.end) ? u.stats.end : 0;
          const total = (u.stats && u.stats.total) ? u.stats.total : (man + intl + end);
 
          if (manMin !== null && man < manMin) return false;
          if (intMin !== null && intl < intMin) return false;
          if (endMin !== null && end < endMin) return false;
          if (totalMin !== null && total < totalMin) return false;
 
          return true;
        })
        .sort((a, b) => (b.lastSeenPost || 0) - (a.lastSeenPost || 0));
    }
 
    const list = filteredResultsCache.slice((currentSearchPage - 1) * 20, currentSearchPage * 20);
 
    const getValColor = (v) => v >= 1000000 ? "#fbbf24" : (v >= 100000 ? "#4ade80" : "var(--ra-text-main)");
 
    const results = document.getElementById("ra-results");
    if (!results) return;
 
    results.innerHTML = list.map(u => `
      <div class="ra-card">
        <div class="ra-card-top" style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <a href="https://www.torn.com/profiles.php?XID=${u.userId}" target="_blank" rel="noopener noreferrer"
             style="color:var(--ra-text-main); font-weight:900; text-decoration:none; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
             ${escapeHtml(u.name)} [${u.userId}]
          </a>
          <span class="ra-tag ${u.status === "active" ? "ra-tag-green" : "ra-tag-amber"}">${u.status}</span>
        </div>
        <div class="ra-card-grid">
          <div><span class="ra-k">💪 MAN</span><br><span class="ra-v" style="color:${getValColor((u.stats?.man)||0)}">${((u.stats?.man)||0).toLocaleString()}</span></div>
          <div><span class="ra-k">🧠 INT</span><br><span class="ra-v" style="color:${getValColor((u.stats?.int)||0)}">${((u.stats?.int)||0).toLocaleString()}</span></div>
          <div>
  <span class="ra-k">🔋 END</span><br>
  <span class="ra-v" style="color:${getValColor((u.stats?.end)||0)}">
    ${((u.stats?.end)||0).toLocaleString()}
  </span>
  ${u.postText ? `
    <span class="ra-post-icon" data-post="${escapeHtml(u.postText)}">💬</span>
  ` : ""}
</div>
          <div><span class="ra-k">📈 TOTAL</span><br><span class="ra-v">${((u.stats?.total)||0).toLocaleString()}</span></div>
          <div><span class="ra-k">🎖️ EE</span><br><span class="ra-v">${(u.ee && u.ee.value !== null) ? (u.ee.value + "/10") : "—"}</span></div>
          <div style="font-size:10px; color:var(--ra-text-muted); grid-column: span 3; border-top:1px solid rgba(255,255,255,0.12); margin-top:5px; padding-top:6px;">
            Last LFW: ${formatDateSafe(u.lastSeenPost)}
          </div>
        </div>
      </div>
    `).join("");
  }
 
  /* -----------------------------
     HELPERS
  ----------------------------- */
  function parseUser(post) {
    const link = post.querySelector('a[href*="profiles.php"][href*="XID="]');
    if (!link) return null;
 
    const uid = Number((String(link.getAttribute("href") || "").match(/XID=(\d+)/i) || [])[1]);
    if (!Number.isFinite(uid) || uid <= 0) return null;
 
    const txt = post.textContent.trim().replace(/\u00A0/g, " ");
 
    const mEE = txt.match(/\b(\d{1,2})\s*(?:\/\s*10\s*)?(?:ee\b|effectiveness)\b/i);
 
    const g = (re) => {
      const m = txt.match(re);
      return m ? Number(m[1].replace(/,/g, "")) : 0;
    };
 
    const man = g(/(?:manual\s+labou?r|manual)[:\s]\s*([0-9,]+)/i);
    const end = g(/(?:endurance)[:\s]\s*([0-9,]+)/i);
    const intl = g(/(?:intelligence)[:\s]\s*([0-9,]+)/i);
 
    const mDate = txt.match(/Posted on\s+(\d{2}:\d{2}:\d{2})\s*-\s*(\d{2}\/\d{2}\/\d{2})/i);
    const lastSeen = mDate
      ? new Date(
          2000 + parseInt(mDate[2].split("/")[2], 10),
          parseInt(mDate[2].split("/")[1], 10) - 1,
          parseInt(mDate[2].split("/")[0], 10),
          ...mDate[1].split(":").map(n => parseInt(n, 10))
        ).getTime()
      : Date.now();
 
    return {
      userId: uid,
      name: link.textContent.trim(),
      stats: { man, int: intl, end, total: man + intl + end },
      ee: { value: mEE ? parseInt(mEE[1], 10) : null },
      lastSeenPost: lastSeen,
      status: /closed|found|filled/i.test(txt) ? "inactive" : "active",
      postText: txt,
      preference: { tags: [] }
    };
  }
 
  function detectLP(d) {
    const nums = Array.from(d.querySelectorAll("a"))
      .map(a => (a.textContent || "").trim())
      .filter(t => /^\d+$/.test(t))
      .map(Number);
    return nums.length ? Math.max(...nums) : 1;
  }
 
  function makeDraggable(panel, header) {
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
 
    header.onmousedown = (e) => {
      if (panel.classList.contains("ra-expanded")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = panel.getBoundingClientRect();
      startLeft = r.left;
      startTop = r.top;
      e.preventDefault();
    };
 
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      panel.style.left = (startLeft + (e.clientX - startX)) + "px";
      panel.style.top = (startTop + (e.clientY - startY)) + "px";
    });
 
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      persistPanelRect().catch(() => {});
    });
  }
 
  async function persistPanelRect() {
    const p = document.getElementById("ra-panel");
    if (!p || !dbReady) return;
    const r = p.getBoundingClientRect();
    const m = await idb.get("meta", "global");
    if (!m) return;
 
    m.ui = {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height
    };
 
    await idb.put("meta", m);
  }
 
  async function persistUIState() {
    if (!dbReady) return;
    const m = await idb.get("meta", "global");
    if (!m) return;
    m.settings = m.settings || {};
    m.settings.uiState = raUIState;
    await idb.put("meta", m);
  }
 
  async function persistSettings(partial) {
    if (!dbReady) return;
    const m = await idb.get("meta", "global");
    if (!m) return;
    m.settings = m.settings || {};
    Object.assign(m.settings, partial);
    await idb.put("meta", m);
  }
 
  function syncUI(m) {
    const scanBtn = document.getElementById("ra-do-scan");
    const updateBtn = document.getElementById("ra-do-update");
    const status = document.getElementById("ra-status");
    if (scanBtn) scanBtn.style.display = m.bootstrapComplete ? "none" : "inline-block";
    if (updateBtn) updateBtn.style.display = m.bootstrapComplete ? "inline-block" : "none";
    if (status) status.textContent = m.bootstrapComplete ? "Ready." : "Database empty.";
  }
 
  function numOrNull(v) {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
 
  function formatDateSafe(ts) {
    try {
      const n = Number(ts);
      if (!Number.isFinite(n) || n <= 0) return "—";
      return new Date(n).toLocaleString();
    } catch {
      return "—";
    }
  }
 
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
 
  /* -----------------------------
     INIT
  ----------------------------- */
  injectStyles();
  injectPanel();
  ensureFloatingButton();
 
  (async () => {
    try {
      db = await openDBSmart();
      dbReady = true;
 
      let m = await idb.get("meta", "global");
      if (!m) {
        m = {
          key: "global",
          bootstrapComplete: false,
          ui: {},
          settings: {
            includeInactive: false,
            theme: "dark",
            density: "comfortable",
            dockEnabled: true,
            uiState: "minimized"
          }
        };
        await idb.put("meta", m);
      }
 
      m.settings = m.settings || {};
      const includeInactive = !!m.settings.includeInactive;
 
      const theme = m.settings.theme || "dark";
      const density = m.settings.density || "comfortable";
 
      raDockEnabled = (m.settings.dockEnabled !== false);
      raUIState = (m.settings.uiState === "open" || m.settings.uiState === "closed" || m.settings.uiState === "minimized")
        ? m.settings.uiState
        : "minimized";
 
      applyTheme(theme);
      applyDensity(density);
 
      const inactiveToggle = document.getElementById("ra-set-inactive");
      if (inactiveToggle) inactiveToggle.checked = includeInactive;
 
      const themeToggle = document.getElementById("ra-theme-toggle");
      if (themeToggle) themeToggle.checked = (theme === "light");
 
      const densityToggle = document.getElementById("ra-density-toggle");
      if (densityToggle) densityToggle.checked = (density === "compact");
 
      const dockToggle = document.getElementById("ra-dock-toggle");
      if (dockToggle) dockToggle.checked = raDockEnabled !== false;
 
      if (inactiveToggle) {
        inactiveToggle.addEventListener("change", async (e) => {
          await persistSettings({ includeInactive: !!e.target.checked });
        });
      }
 
      if (m.ui && typeof m.ui.left === "number" && typeof m.ui.top === "number") {
        const p = document.getElementById("ra-panel");
        if (p) {
          p.style.left = m.ui.left + "px";
          p.style.top = m.ui.top + "px";
          if (typeof m.ui.width === "number") p.style.width = m.ui.width + "px";
          if (typeof m.ui.height === "number") p.style.height = m.ui.height + "px";
        }
      }
 
      applyDockSetting();
      applyUIState();
 
      if (raUIState === "closed" && !isDockEnabled()) {
        raUIState = "minimized";
        await persistUIState();
        applyUIState();
      }
 
      syncUI(m);
    } catch (e) {
      console.error("Recruitment Agency init error:", e);
    }
  })();
 
})(); // <-- if your pasted script doesn't end with this, you WILL get Unexpected end of input.
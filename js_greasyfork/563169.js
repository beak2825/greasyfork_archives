// ==UserScript==
// @name         Inbound Stow Control Panel (Vantage)
// @namespace    urdanetx.inbound.stow.vantage.panel
// @version      1.0
// @description  Dark-mode overlay for Vantage Inbound Stow: Top 5 (gold), Bottom 5 (red), others (orange), Andon badges (purple/blue), click-to-details modal, and a color guide.
// @author       Rafael Urdaneta
// @license      MIT
// @match        https://vantage.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563169/Inbound%20Stow%20Control%20Panel%20%28Vantage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563169/Inbound%20Stow%20Control%20Panel%20%28Vantage%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /******************************************************************
   * CONFIG (You will adjust these ONCE for your Vantage page)
   ******************************************************************/
  const CFG = {
    // Where the stower "cards" live (pick the container that holds ALL stower cards)
    STOWER_CARD_SELECTOR: ".stower-card", // TODO: replace

    // Inside each stower card:
    NAME_SELECTOR: ".stower-name",        // TODO: replace
    LOGIN_SELECTOR: ".stower-login",      // optional
    STATION_SELECTOR: ".stower-station",  // TODO: replace
    UPH_SELECTOR: ".stower-uph",          // TODO: replace (Rate/UPH)
    IMG_SELECTOR: "img",                  // usually fine

    // Optional extra metrics (show in modal only if found)
    CYCLE_TIME_SELECTOR: ".cycle-time",
    POD_GAP_SELECTOR: ".pod-gap",
    NSTA_SELECTOR: ".nsta",
    LOGGED_HOURS_SELECTOR: ".logged-hours",

    // Andon table (Station + Andon Type)
    ANDON_ROW_SELECTOR: "table tbody tr", // TODO: narrow to the andon table container if possible
    ANDON_STATION_CELL_SELECTOR: "td:nth-child(1)", // TODO: station column
    ANDON_TYPE_CELL_SELECTOR: "td:nth-child(2)",    // TODO: type column

    // A fast way to detect you're on the right view (optional)
    // If you set this to a container that exists only on your Inbound Stow page,
    // the script will only run when it's present.
    PAGE_GUARD_SELECTOR: "body",

    // UI
    TOP_N: 5,
    LOW_N: 5,

    // Andon badge colors (locked per your request)
    COLOR_ANDON_BLOCKING: "#a855f7", // purple
    COLOR_ANDON_NONBLOCK: "#3b82f6", // blue

    // Performance border colors
    COLOR_BORDER_TOP: "#facc15",     // gold
    COLOR_BORDER_LOW: "#ef4444",     // red
    COLOR_BORDER_MID: "#f59e0b",     // orange

    // Debounce render (ms)
    RENDER_DEBOUNCE_MS: 400,
  };

  /******************************************************************
   * INTERNAL STATE
   ******************************************************************/
  const IDS = {
    TOGGLE: "iscp-toggle",
    PANEL: "iscp-panel",
    MODAL_BACKDROP: "iscp-modal-backdrop",
    MODAL: "iscp-modal",
  };

  let enabled = true;
  let renderTimer = null;

  /******************************************************************
   * UTILS
   ******************************************************************/
  const txt = (el) => (el ? (el.textContent || "").trim() : "");
  const num = (s) => {
    // extracts first number (handles "172.74 UPH", "13.56%", etc.)
    const m = String(s || "").replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  const safeId = (s) => String(s || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-_]/g, "");

  function debounceRender() {
    if (!enabled) return;
    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = setTimeout(render, CFG.RENDER_DEBOUNCE_MS);
  }

  /******************************************************************
   * UI: TOGGLE + PANEL + MODAL
   ******************************************************************/
  function ensureToggle() {
    if (document.getElementById(IDS.TOGGLE)) return;

    const btn = document.createElement("button");
    btn.id = IDS.TOGGLE;
    btn.textContent = "🟢 Inbound Stow Panel v1.0";
    btn.style.cssText = `
      position: fixed;
      top: 12px;
      right: 18px;
      z-index: 2147483647;
      background: #0b1220;
      color: #e5e7eb;
      border: 1px solid #22c55e;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,.35);
    `;

    btn.addEventListener("click", () => {
      enabled = !enabled;
      btn.textContent = enabled ? "🟢 Inbound Stow Panel v1.0" : "⚫ Inbound Stow Panel v1.0";
      btn.style.borderColor = enabled ? "#22c55e" : "#64748b";
      btn.style.opacity = enabled ? "1" : "0.85";
      const panel = document.getElementById(IDS.PANEL);
      if (panel) panel.style.display = enabled ? "grid" : "none";
      if (enabled) debounceRender();
      closeModal();
    });

    document.body.appendChild(btn);
  }

  function ensurePanel() {
    if (document.getElementById(IDS.PANEL)) return;

    const panel = document.createElement("div");
    panel.id = IDS.PANEL;
    panel.style.cssText = `
      position: fixed;
      top: 52px;
      left: 0;
      width: 100%;
      height: calc(100% - 52px);
      z-index: 2147483646;
      background: #020617; /* dark mode */
      color: #e5e7eb;
      overflow: auto;
      padding: 14px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px;
    `;
    document.body.appendChild(panel);
  }

  function ensureModal() {
    if (document.getElementById(IDS.MODAL_BACKDROP)) return;

    const backdrop = document.createElement("div");
    backdrop.id = IDS.MODAL_BACKDROP;
    backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.6);
      z-index: 2147483647;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
    `;
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

    const modal = document.createElement("div");
    modal.id = IDS.MODAL;
    modal.style.cssText = `
      width: min(520px, 96vw);
      background: #0b1220;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 14px 14px 12px 14px;
      color: #e5e7eb;
      box-shadow: 0 12px 42px rgba(0,0,0,.55);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
  }

  function openModal(html) {
    ensureModal();
    const backdrop = document.getElementById(IDS.MODAL_BACKDROP);
    const modal = document.getElementById(IDS.MODAL);
    if (!backdrop || !modal) return;
    modal.innerHTML = html;
    backdrop.style.display = "flex";
  }

  function closeModal() {
    const backdrop = document.getElementById(IDS.MODAL_BACKDROP);
    if (backdrop) backdrop.style.display = "none";
  }

  /******************************************************************
   * DATA READERS
   ******************************************************************/
  function readStowersFromPage() {
    const cards = Array.from(document.querySelectorAll(CFG.STOWER_CARD_SELECTOR));
    const out = [];

    for (const card of cards) {
      const name = txt(card.querySelector(CFG.NAME_SELECTOR));
      const login = txt(card.querySelector(CFG.LOGIN_SELECTOR));
      const station = txt(card.querySelector(CFG.STATION_SELECTOR));
      const uphRaw = txt(card.querySelector(CFG.UPH_SELECTOR));
      const uph = num(uphRaw);

      const imgEl = card.querySelector(CFG.IMG_SELECTOR);
      const img = imgEl && imgEl.src ? imgEl.src : "";

      // Optional metrics
      const cycleTime = num(txt(card.querySelector(CFG.CYCLE_TIME_SELECTOR)));
      const podGap = num(txt(card.querySelector(CFG.POD_GAP_SELECTOR)));
      const nsta = num(txt(card.querySelector(CFG.NSTA_SELECTOR)));
      const loggedHours = txt(card.querySelector(CFG.LOGGED_HOURS_SELECTOR));

      // Build stable ID
      const id = safeId(login || name || station || Math.random());

      // Keep only likely valid entries
      if (!name && !login && !station) continue;

      out.push({
        id,
        name: name || login || "Unknown",
        login,
        station,
        uph: Number.isFinite(uph) ? uph : 0,
        img,
        metrics: {
          uphRaw,
          cycleTime: Number.isFinite(cycleTime) ? cycleTime : null,
          podGap: Number.isFinite(podGap) ? podGap : null,
          nsta: Number.isFinite(nsta) ? nsta : null,
          loggedHours: loggedHours || null,
        }
      });
    }

    return out;
  }

  function readAndonsFromPage() {
    // NOTE: You should narrow ANDON_ROW_SELECTOR to the andon table container to avoid random tables.
    const rows = Array.from(document.querySelectorAll(CFG.ANDON_ROW_SELECTOR));
    const map = new Map(); // station -> { category, type }

    for (const row of rows) {
      const station = txt(row.querySelector(CFG.ANDON_STATION_CELL_SELECTOR));
      const type = txt(row.querySelector(CFG.ANDON_TYPE_CELL_SELECTOR));
      if (!station || !type) continue;

      const lower = type.toLowerCase();
      const isBlocking = lower.includes("blocking") || lower.includes("conveyance") || lower.includes("amnesty") || lower.includes("robot");
      // We’ll label:
      // - Blocking Andon: purple
      // - Non-Blocking / OOWA: blue
      const category = isBlocking ? "Blocking" : "Non-Blocking / OOWA";

      map.set(station, { category, type });
    }

    return map;
  }

  /******************************************************************
   * RENDER
   ******************************************************************/
  function render() {
    if (!enabled) return;
    if (!document.querySelector(CFG.PAGE_GUARD_SELECTOR)) return;

    ensureToggle();
    ensurePanel();
    ensureModal();

    const panel = document.getElementById(IDS.PANEL);
    if (!panel) return;

    const stowers = readStowersFromPage();
    const andonMap = readAndonsFromPage();

    // Sort by UPH
    const sorted = [...stowers].sort((a, b) => b.uph - a.uph);
    const topSet = new Set(sorted.slice(0, CFG.TOP_N).map(s => s.id));
    const lowSet = new Set(sorted.slice(-CFG.LOW_N).map(s => s.id));

    panel.innerHTML = "";

    for (const s of sorted) {
      const isTop = topSet.has(s.id);
      const isLow = lowSet.has(s.id);

      const borderColor = isTop
        ? CFG.COLOR_BORDER_TOP
        : isLow
        ? CFG.COLOR_BORDER_LOW
        : CFG.COLOR_BORDER_MID;

      // Andon badge (by station)
      const andon = (s.station && andonMap.has(s.station)) ? andonMap.get(s.station) : null;
      const andonBadge = andon
        ? `<span style="
            display:inline-flex;align-items:center;gap:6px;
            padding:3px 6px;border-radius:999px;
            font-size:10px;line-height:1;
            border:1px solid rgba(255,255,255,.12);
            background:${andon.category.startsWith("Blocking") ? CFG.COLOR_ANDON_BLOCKING : CFG.COLOR_ANDON_NONBLOCK};
            color:#0b1220;
            font-weight:700;
          ">
            ${andon.category.startsWith("Blocking") ? "BLOCKING ANDON" : "OOWA / NON-BLOCKING"}
          </span>`
        : "";

      const rankBadge = isTop
        ? `<div style="
            position:absolute;top:8px;right:8px;
            background:${CFG.COLOR_BORDER_TOP};
            color:#0b1220;
            font-weight:800;
            font-size:11px;
            padding:3px 6px;
            border-radius:999px;
          ">#${sorted.indexOf(s)+1}</div>`
        : "";

      const card = document.createElement("div");
      card.style.cssText = `
        position: relative;
        background: #0b1220;
        border: 2px solid ${borderColor};
        border-radius: 12px;
        padding: 10px;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        min-height: 92px;
        cursor: pointer;
        box-shadow: 0 10px 26px rgba(0,0,0,.35);
      `;

      // Compact layout (photo small)
      const imgHtml = s.img
        ? `<img src="${s.img}" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.12);" />`
        : `<div style="width:34px;height:34px;border-radius:50%;background:#111827;border:1px solid rgba(255,255,255,.12);"></div>`;

      card.innerHTML = `
        ${rankBadge}
        <div style="display:flex;gap:10px;align-items:flex-start;">
          ${imgHtml}
          <div style="min-width:0;flex:1;">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
              <div style="min-width:0;">
                <div style="font-weight:800;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${escapeHtml(s.name)}${s.login ? ` <span style="opacity:.75;font-weight:700;">(${escapeHtml(s.login)})</span>` : ""}
                </div>
                <div style="opacity:.85;font-size:11px;margin-top:2px;">
                  Station: <span style="font-weight:700;">${escapeHtml(s.station || "—")}</span>
                </div>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:10px;">
              <div style="font-size:12px;">
                <span style="opacity:.8;">UPH</span>
                <span style="font-weight:900;margin-left:6px;">${Number.isFinite(s.uph) ? s.uph.toFixed(2) : "—"}</span>
              </div>
              ${andonBadge}
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        const andonInfo = andon
          ? `
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);">
              <div style="font-weight:900;margin-bottom:6px;">ANDON</div>
              <div style="opacity:.9;">Status: <b>Active</b></div>
              <div style="opacity:.9;">Category: <b>${escapeHtml(andon.category)}</b></div>
              <div style="opacity:.9;">Type: <b>${escapeHtml(andon.type)}</b></div>
            </div>
          `
          : `
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);">
              <div style="font-weight:900;margin-bottom:6px;">ANDON</div>
              <div style="opacity:.9;">Status: <b>None detected</b></div>
            </div>
          `;

        const m = s.metrics || {};
        const metricLine = (label, value) => {
          if (value === null || value === undefined || value === "" || Number.isNaN(value)) return "";
          return `<div style="opacity:.9;">${label}: <b>${escapeHtml(String(value))}</b></div>`;
        };

        openModal(`
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
            <div style="font-weight:900;font-size:14px;">${escapeHtml(s.name)}${s.login ? ` <span style="opacity:.7;font-weight:800;">(${escapeHtml(s.login)})</span>` : ""}</div>
            <button id="iscp-close" style="
              background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
              border-radius:8px;padding:6px 10px;font-weight:800;cursor:pointer;
            ">Close</button>
          </div>

          <div style="margin-top:10px;opacity:.95;">
            ${metricLine("Station", s.station || "—")}
            ${metricLine("UPH", Number.isFinite(s.uph) ? s.uph.toFixed(2) : "—")}
            ${metricLine("Cycle Time", m.cycleTime)}
            ${metricLine("Pod Gap %", m.podGap)}
            ${metricLine("NSTA", m.nsta)}
            ${metricLine("Logged Hours", m.loggedHours)}
          </div>

          ${andonInfo}

          <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);opacity:.8;font-size:12px;">
            Tip: Performance border = UPH ranking. Andon is shown as a badge.
          </div>
        `);

        // bind close
        setTimeout(() => {
          const closeBtn = document.getElementById("iscp-close");
          if (closeBtn) closeBtn.onclick = closeModal;
        }, 0);
      });

      panel.appendChild(card);
    }

    // Footer legend at bottom of scroll (full width)
    panel.appendChild(renderLegend());
  }

  function renderLegend() {
    const legend = document.createElement("div");
    legend.style.cssText = `
      grid-column: 1 / -1;
      margin-top: 8px;
      padding: 12px 12px;
      background: rgba(15, 23, 42, .65);
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 12px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      font-size: 12px;
      color: #e5e7eb;
    `;

    const chip = (color) => `<span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${color};margin-right:8px;vertical-align:middle;"></span>`;

    legend.innerHTML = `
      <div style="font-weight:900;margin-bottom:8px;">Color Guide</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:6px 12px;opacity:.95;">
        <div>${chip(CFG.COLOR_BORDER_TOP)} <b>Gold border</b> — Top 5 Performers (UPH)</div>
        <div>${chip(CFG.COLOR_BORDER_LOW)} <b>Red border</b> — Bottom 5 Low Performers (UPH)</div>
        <div>${chip(CFG.COLOR_BORDER_MID)} <b>Orange border</b> — All Other Stowers</div>
        <div>${chip(CFG.COLOR_ANDON_BLOCKING)} <b>Purple badge</b> — Blocking Andon Active</div>
        <div>${chip(CFG.COLOR_ANDON_NONBLOCK)} <b>Blue badge</b> — Non-Blocking / OOWA Active</div>
      </div>
      <div style="margin-top:8px;opacity:.8;">Tip: Click a card for details.</div>
    `;
    return legend;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /******************************************************************
   * OBSERVE (Use Vantage native refresh: we just re-render on DOM changes)
   ******************************************************************/
  function startObserver() {
    const target = document.body;
    const obs = new MutationObserver(() => debounceRender());
    obs.observe(target, { childList: true, subtree: true });
  }

  /******************************************************************
   * INIT
   ******************************************************************/
  function init() {
    // Only run if the page guard exists
    if (!document.querySelector(CFG.PAGE_GUARD_SELECTOR)) return;

    ensureToggle();
    ensurePanel();
    ensureModal();

    render();
    startObserver();
  }

  // Give Vantage time to load
  setTimeout(init, 2500);
})();
// ==UserScript==
// @name         Torn Poker Odds (Monte Carlo) - V5.1 Mobile Fixed + Pointer Drag + Layout Toggle
// @namespace    https://openuserjs.org/users/torn/pokerodds_mc_v5_dark_series
// @version      0.5.2
// @description  Descriptive-only Monte Carlo estimates for Torn Hold'em with dark blue UI. Fixes hand-ranking score (no more high-card beating pairs), cancels stale sims when state changes, improves card parsing robustness across UI variants, and shows exact opponent count used. No advice.
// @author       You
// @match        https://www.torn.com/page.php?sid=holdem
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559870/Torn%20Poker%20Odds%20%28Monte%20Carlo%29%20-%20V51%20Mobile%20Fixed%20%2B%20Pointer%20Drag%20%2B%20Layout%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/559870/Torn%20Poker%20Odds%20%28Monte%20Carlo%29%20-%20V51%20Mobile%20Fixed%20%2B%20Pointer%20Drag%20%2B%20Layout%20Toggle.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ============================================================
  // Utils
  // ============================================================
  const HAND_TYPES = [
    "High Card", "Pair", "Two Pair", "Three of a Kind", "Straight",
    "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush"
  ];

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmtPct = (p) => (isFinite(p) ? (p * 100).toFixed(2) + "%" : "—");
  const fmtPct100 = (p100) => (isFinite(p100) ? p100.toFixed(1) + "%" : "—");

  function parseMoney(text) {
    if (!text) return NaN;
    const t = String(text).replace(/[^\d]/g, "");
    if (!t) return NaN;
    return Number(t);
  }

  function fmtMoney(n) {
    if (!isFinite(n)) return "—";
    return "$" + Math.round(n).toLocaleString();
  }

  function wilsonCI(effWins, n, z = 1.96) {
    if (n <= 0) return [NaN, NaN];
    const p = effWins / n;
    const denom = 1 + (z * z) / n;
    const center = (p + (z * z) / (2 * n)) / denom;
    const margin = (z * Math.sqrt((p * (1 - p) / n) + (z * z) / (4 * n * n))) / denom;
    return [Math.max(0, center - margin), Math.min(1, center + margin)];
  }

  function addStyle(css) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================================
  // Layout detection + persistence
  // ============================================================
  const LS_KEY = "tpoc_layout_mode_v5_1"; // keep same so users don’t lose preference

  function isProbablyMobile() {
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const small = Math.min(window.innerWidth, window.innerHeight) <= 740;
    const touch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    return coarse || (touch && small);
  }

  function getSavedLayoutMode() {
    const v = localStorage.getItem(LS_KEY);
    if (v === "mobile" || v === "desktop" || v === "auto") return v;
    return "auto";
  }

  function resolveLayoutMode() {
    const saved = getSavedLayoutMode();
    if (saved === "mobile") return "mobile";
    if (saved === "desktop") return "desktop";
    return isProbablyMobile() ? "mobile" : "desktop";
  }

  function cycleLayoutMode() {
    // cycles: auto -> mobile -> desktop -> auto
    const cur = getSavedLayoutMode();
    const next = (cur === "auto") ? "mobile" : (cur === "mobile" ? "desktop" : "auto");
    localStorage.setItem(LS_KEY, next);
    applyLayoutMode(resolveLayoutMode());
    renderLayoutBtn();
  }

  // ============================================================
  // Dark Blue UI CSS (+ mobile fixed mode)
  // ============================================================
  addStyle(`
    :root {
      --tpoc-bg0: #070b14;
      --tpoc-bg1: #0b1222;
      --tpoc-panel: rgba(16, 24, 40, 0.82);
      --tpoc-panel2: rgba(12, 18, 32, 0.92);
      --tpoc-border: rgba(130, 170, 255, 0.22);
      --tpoc-border2: rgba(130, 170, 255, 0.14);
      --tpoc-text: #e7eefc;
      --tpoc-muted: rgba(231, 238, 252, 0.72);
      --tpoc-faint: rgba(231, 238, 252, 0.55);
      --tpoc-blue: #4ea1ff;
      --tpoc-blueGlow: rgba(78, 161, 255, 0.35);
      --tpoc-radius: 18px;
      --tpoc-radius-sm: 12px;
    }

    #tpocF-root, #tpocF-root * {
      box-sizing: border-box;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }

    #tpocF-root {
      position: fixed;
      top: 90px;
      right: 18px;
      width: 640px;
      height: 720px;

      color: var(--tpoc-text);
      background:
        radial-gradient(1200px 700px at 10% 0%, rgba(79, 121, 255, 0.16), transparent 55%),
        radial-gradient(900px 600px at 100% 0%, rgba(78, 161, 255, 0.12), transparent 50%),
        linear-gradient(180deg, var(--tpoc-bg1), var(--tpoc-bg0));

      border: 1px solid var(--tpoc-border);
      border-radius: var(--tpoc-radius);
      box-shadow:
        0 16px 40px rgba(0,0,0,0.55),
        0 0 0 1px rgba(78,161,255,0.08) inset;

      z-index: 999999;
      overflow: hidden;
      resize: both;
      min-width: 460px;
      min-height: 420px;
      max-width: 92vw;
      max-height: 90vh;
      touch-action: manipulation;
    }

    /* --- MOBILE FIXED MODE --- */
    #tpocF-root.tpoc-mobile {
      top: auto !important;
      left: auto !important;
      right: 10px !important;
      bottom: calc(10px + env(safe-area-inset-bottom, 0px)) !important;

      width: min(92vw, 420px) !important;
      height: min(75vh, 560px) !important;

      min-width: 0 !important;
      min-height: 0 !important;

      max-width: 100vw !important;
      max-height: calc(100vh - 18px - env(safe-area-inset-bottom, 0px)) !important;

      resize: none !important;
      border-radius: 16px !important;
    }

    #tpocF-header {
      display:flex;
      align-items:center;
      justify-content: space-between;
      padding: 10px 12px;
      background: linear-gradient(180deg, rgba(20, 30, 55, 0.92), rgba(10, 14, 26, 0.86));
      border-bottom: 1px solid var(--tpoc-border2);
      cursor: move;
      user-select: none;
      touch-action: none;
    }

    #tpocF-root.tpoc-mobile #tpocF-header {
      cursor: default;
      touch-action: manipulation;
    }

    #tpocF-title { font-size: 20px; font-weight: 900; letter-spacing: 0.2px; }
    #tpocF-sub { font-size: 14px; color: var(--tpoc-muted); font-weight: 700; margin-left: 10px; }

    #tpocF-header .btnRow { display:flex; gap:8px; align-items:center; }
    #tpocF-header button {
      font-size: 14px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid rgba(78,161,255,0.22);
      background: linear-gradient(180deg, rgba(18, 28, 52, 0.9), rgba(10, 14, 26, 0.85));
      color: var(--tpoc-text);
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(0,0,0,0.35),
        0 0 0 1px rgba(78,161,255,0.06) inset;
      min-height: 40px;
    }
    #tpocF-header button:active { transform: translateY(1px); }

    #tpocF-body {
      height: calc(100% - 56px);
      overflow: auto;
      padding: 14px;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }

    #tpocF-body::-webkit-scrollbar { width: 10px; }
    #tpocF-body::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 999px; }
    #tpocF-body::-webkit-scrollbar-thumb { background: rgba(78,161,255,0.28); border-radius: 999px; }
    #tpocF-body::-webkit-scrollbar-thumb:hover { background: rgba(78,161,255,0.40); }

    .tpocF-controls {
      padding: 14px;
      border-radius: var(--tpoc-radius);
      border: 1px solid var(--tpoc-border2);
      background: linear-gradient(180deg, rgba(16,24,40,0.74), rgba(10,14,26,0.62));
      box-shadow: 0 10px 30px rgba(0,0,0,0.30);
      margin-bottom: 12px;
    }

    .tpocF-controlsGrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: start;
    }
    #tpocF-root.tpoc-mobile .tpocF-controlsGrid { grid-template-columns: 1fr; }

    .tpocF-row { display:flex; gap:10px; align-items:center; flex-wrap: wrap; }
    .tpocF-label { font-size: 16px; font-weight: 800; color: var(--tpoc-text); }
    .tpocF-controls input[type="checkbox"] { transform: scale(1.10); accent-color: var(--tpoc-blue); }

    .tpocF-controls input[type="range"]{
      width: 300px;
      accent-color: var(--tpoc-blue);
      min-height: 34px;
    }
    #tpocF-root.tpoc-mobile .tpocF-controls input[type="range"]{
      width: min(72vw, 320px);
    }

    .tpocF-btn {
      font-size: 15px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid rgba(78,161,255,0.22);
      background: linear-gradient(180deg, rgba(18, 28, 52, 0.9), rgba(10, 14, 26, 0.85));
      color: var(--tpoc-text);
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(0,0,0,0.35),
        0 0 0 1px rgba(78,161,255,0.06) inset;
      min-height: 44px;
    }

    .tpocF-pillRow { display:flex; gap:10px; flex-wrap:wrap; margin-top: 10px; }
    .tpocF-pill {
      border: 1px solid rgba(78,161,255,0.20);
      background: rgba(10, 14, 26, 0.55);
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 13px;
      color: var(--tpoc-text);
      white-space: nowrap;
      box-shadow: 0 8px 18px rgba(0,0,0,0.22);
    }
    .tpocF-muted { color: var(--tpoc-muted) !important; }
    .tpocF-note { font-size: 15px; color: var(--tpoc-muted); line-height: 1.35; }
    .tpocF-cap { font-size: 18px; font-weight: 900; margin: 10px 0; }
    .tpocF-right { text-align: right; }

    details.tpocF-panel {
      border: 1px solid rgba(78,161,255,0.18);
      border-radius: var(--tpoc-radius);
      background: linear-gradient(180deg, rgba(16,24,40,0.74), rgba(10,14,26,0.62));
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.30);
    }
    details.tpocF-panel summary {
      padding: 12px 14px;
      cursor: pointer;
      font-weight: 900;
      background: linear-gradient(180deg, rgba(20, 30, 55, 0.92), rgba(10, 14, 26, 0.86));
      border-bottom: 1px solid rgba(78,161,255,0.14);
      user-select: none;
      color: var(--tpoc-text);
    }
    details.tpocF-panel .content {
      padding: 14px;
      background: rgba(5, 8, 16, 0.25);
      color: var(--tpoc-text);
    }

    .tpocF-cardline { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
    .tpocF-cardchip {
      border: 1px solid rgba(78,161,255,0.20);
      background: rgba(10, 14, 26, 0.55);
      padding: 6px 10px;
      border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 14px;
      color: var(--tpoc-text);
      box-shadow: 0 8px 18px rgba(0,0,0,0.20);
    }

    .tpocF-grid { display:grid; grid-template-columns: 1fr; gap: 14px; }
    @media (min-width: 980px) { .tpocF-grid { grid-template-columns: 1fr 1fr; } }
    #tpocF-root.tpoc-mobile .tpocF-grid { grid-template-columns: 1fr; }

    table.tpocF {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
      background: rgba(10, 14, 26, 0.35);
      border: 1px solid rgba(78,161,255,0.16);
      border-radius: var(--tpoc-radius);
    }
    table.tpocF thead th {
      background: linear-gradient(180deg, rgba(35, 90, 255, 0.25), rgba(78, 161, 255, 0.14));
      color: var(--tpoc-text);
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 900;
      border-bottom: 1px solid rgba(78,161,255,0.16);
    }
    table.tpocF tbody td {
      color: var(--tpoc-text);
      padding: 10px 12px;
      font-size: 14px;
      border-bottom: 1px solid rgba(78,161,255,0.08);
    }
    table.tpocF tbody tr:nth-child(odd) td { background: rgba(8, 12, 22, 0.48); }
    table.tpocF tbody tr:nth-child(even) td { background: rgba(12, 18, 32, 0.48); }
    table.tpocF tbody tr:hover td { background: rgba(78,161,255,0.10); }
    table.tpocF tbody tr:last-child td { border-bottom: none; }

    .tpocF-miniInput {
      width: 90px;
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(78,161,255,0.18);
      background: rgba(10, 14, 26, 0.55);
      color: var(--tpoc-text);
      font-size: 14px;
      font-weight: 800;
      outline: none;
      min-height: 44px;
    }
  `);

  // ============================================================
  // UI Creation
  // ============================================================
  let minimized = false;

  function applyLayoutMode(mode) {
    const root = document.getElementById("tpocF-root");
    if (!root) return;

    if (mode === "mobile") root.classList.add("tpoc-mobile");
    else root.classList.remove("tpoc-mobile");

    if (mode === "desktop") {
      root.style.display = "";
      if (!root.style.top) root.style.top = "90px";
      if (!root.style.right) root.style.right = "18px";
    }
  }

  function renderLayoutBtn() {
    const btn = document.getElementById("tpocF-layoutBtn");
    if (!btn) return;

    const saved = getSavedLayoutMode();
    const resolved = resolveLayoutMode();
    const icon = resolved === "mobile" ? "📱" : "🖥️";
    const label = saved === "auto" ? "Auto" : (saved === "mobile" ? "Mobile" : "Desktop");
    btn.textContent = `${icon} ${label}`;
    btn.title = `Layout: ${label}. Tap to cycle Auto → Mobile → Desktop.`;
  }

  function ensureUI() {
    if (document.getElementById("tpocF-root")) return;

    const root = document.createElement("div");
    root.id = "tpocF-root";
    root.innerHTML = `
      <div id="tpocF-header">
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span id="tpocF-title">Torn Poker Odds</span>
          <span id="tpocF-sub">descriptive-only • v5.2</span>
        </div>

        <div class="btnRow">
          <button id="tpocF-layoutBtn" title="Toggle layout">📱 Auto</button>
          <button id="tpocF-popBtn" title="Pop / focus">🟡</button>
          <button id="tpocF-minBtn" title="Minimize">–</button>
          <button id="tpocF-closeBtn" title="Hide">×</button>
        </div>
      </div>

      <div id="tpocF-body">
        <div class="tpocF-controls tpocF-controlsGrid" id="tpocF-controls">

          <div style="display:grid; gap:10px;">
            <div class="tpocF-row">
              <div class="tpocF-label">Quality (1–10):</div>
              <input id="tpocF-quality" type="range" min="1" max="10" step="1" value="8">
              <span class="tpocF-pill" id="tpocF-qualityVal">8</span>
            </div>

            <div class="tpocF-row">
              <div class="tpocF-label">Auto opponents:</div>
              <input id="tpocF-autoOpp" type="checkbox" checked>
              <span class="tpocF-pill" id="tpocF-autoOppPill">auto</span>
            </div>

            <div class="tpocF-row" style="gap:12px; margin-top:6px;">
              <button class="tpocF-btn" id="tpocF-start">Start</button>
              <button class="tpocF-btn" id="tpocF-pause">Pause</button>
              <button class="tpocF-btn" id="tpocF-stop">Stop</button>
            </div>
          </div>

          <div style="display:grid; gap:10px;">
            <div class="tpocF-row">
              <div class="tpocF-label">Opponents (1–10):</div>
              <input id="tpocF-opp" type="range" min="1" max="10" step="1" value="2">
              <span class="tpocF-pill" id="tpocF-oppVal">2</span>
            </div>

            <div class="tpocF-row">
              <div class="tpocF-label">Stop on converge:</div>
              <input id="tpocF-converge" type="checkbox" checked>
              <span class="tpocF-pill" id="tpocF-ciTarget">CI width ≤ 1.6%</span>
            </div>

            <div class="tpocF-row">
              <div class="tpocF-label">Series Best-of:</div>
              <input id="tpocF-bestOf" class="tpocF-miniInput" type="number" min="1" step="2" value="7">
              <button class="tpocF-btn" id="tpocF-resetSeries">Reset Series</button>
            </div>
          </div>

          <div style="grid-column: 1 / -1; margin-top:10px;">
            <div class="tpocF-pillRow" id="tpocF-status">
              <span class="tpocF-pill" id="tpocF-mode">Mode: —</span>
              <span class="tpocF-pill" id="tpocF-street">Street: —</span>
              <span class="tpocF-pill" id="tpocF-known">Known: —</span>
              <span class="tpocF-pill" id="tpocF-unknown">Unknown board: —</span>
              <span class="tpocF-pill" id="tpocF-players">Players: —</span>
              <span class="tpocF-pill" id="tpocF-pot">Pot: —</span>
              <span class="tpocF-pill" id="tpocF-stack">My stack: —</span>
              <span class="tpocF-pill" id="tpocF-samples">Samples: —</span>
              <span class="tpocF-pill" id="tpocF-runtime">Runtime: —</span>
              <span class="tpocF-pill" id="tpocF-state">State: idle</span>
            </div>
          </div>

          <div style="grid-column: 1 / -1; margin-top:10px;">
            <details class="tpocF-panel" open>
              <summary>Best-of-N Tracker</summary>
              <div class="content">
                <div style="display:flex; justify-content:space-between; gap:14px; flex-wrap:wrap;">
                  <div style="min-width: 240px;">
                    <div class="tpocF-cap" style="margin:0 0 6px 0;">Score: <span id="tpocF-seriesScore">0-0</span> <span class="tpocF-muted">(ties <span id="tpocF-seriesTies">0</span>)</span></div>
                    <div class="tpocF-note">Net chips: <b id="tpocF-netChips">+0</b></div>
                  </div>
                  <div style="min-width: 240px;">
                    <div class="tpocF-cap" style="margin:0 0 6px 0;">Hands: <span id="tpocF-seriesHands">0</span></div>
                    <div class="tpocF-note">Avg win%: <b id="tpocF-avgWin">0.0%</b></div>
                  </div>
                </div>

                <div class="tpocF-note" style="margin-top:10px;">
                  Series win/loss is inferred from <b>my stack change between river and next hand</b>.
                  (Still descriptive-only.)
                </div>
              </div>
            </details>
          </div>

          <div style="grid-column: 1 / -1; margin-top:10px;">
            <details class="tpocF-panel" open>
              <summary>Detected State (What the script thinks is known)</summary>
              <div class="content">
                <div class="tpocF-note"><b>My hole cards:</b></div>
                <div class="tpocF-cardline" id="tpocF-holeLine"></div>

                <div class="tpocF-note" style="margin-top:10px;"><b>Community cards:</b></div>
                <div class="tpocF-cardline" id="tpocF-boardLine"></div>

                <div class="tpocF-note" style="margin-top:10px;">
                  <b>Parse mode:</b> <span class="tpocF-cardchip" id="tpocF-parseMode">—</span>
                </div>
              </div>
            </details>
          </div>

          <div style="grid-column: 1 / -1; margin-top:12px;">
            <div class="tpocF-grid">
              <div>
                <div class="tpocF-cap">Current Snapshot</div>
                <table class="tpocF">
                  <thead>
                    <tr>
                      <th>Best Hand (now)</th>
                      <th class="tpocF-right">Top % (est.)</th>
                      <th class="tpocF-right">Win % (est.)</th>
                      <th class="tpocF-right">95% CI</th>
                    </tr>
                  </thead>
                  <tbody id="tpocF-nowBody">
                    <tr><td colspan="4" class="tpocF-muted">—</td></tr>
                  </tbody>
                </table>

                <div class="tpocF-cap" style="margin-top:12px;">Your Final Hand Type (to River)</div>
                <table class="tpocF">
                  <thead>
                    <tr><th>Final Hand Type</th><th class="tpocF-right">Chance</th></tr>
                  </thead>
                  <tbody id="tpocF-myDist">
                    <tr><td colspan="2" class="tpocF-muted">—</td></tr>
                  </tbody>
                </table>

                <div class="tpocF-cap" style="margin-top:12px;">Opponents Final Hand Types (best of N)</div>
                <table class="tpocF">
                  <thead>
                    <tr><th>Hand Type</th><th class="tpocF-right">Chance</th></tr>
                  </thead>
                  <tbody id="tpocF-oppDist">
                    <tr><td colspan="2" class="tpocF-muted">—</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <div class="tpocF-cap">Per-Street Panels</div>
                <div style="display:grid; gap:12px;">
                  <details class="tpocF-panel" open>
                    <summary>Preflop</summary>
                    <div class="content"><div id="tpocF-preflop" class="tpocF-note tpocF-muted">—</div></div>
                  </details>
                  <details class="tpocF-panel">
                    <summary>Flop</summary>
                    <div class="content"><div id="tpocF-flop" class="tpocF-note tpocF-muted">—</div></div>
                  </details>
                  <details class="tpocF-panel">
                    <summary>Turn</summary>
                    <div class="content"><div id="tpocF-turn" class="tpocF-note tpocF-muted">—</div></div>
                  </details>
                  <details class="tpocF-panel">
                    <summary>River</summary>
                    <div class="content"><div id="tpocF-river" class="tpocF-note tpocF-muted">—</div></div>
                  </details>
                </div>

                <div class="tpocF-cap" style="margin-top:12px;">Notes</div>
                <div class="tpocF-note">
                  This tool is <b>descriptive-only</b>. It reports Monte Carlo estimates and confidence intervals.
                  It does <b>not</b> recommend actions.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(root);

    applyLayoutMode(resolveLayoutMode());
    renderLayoutBtn();

    const body = root.querySelector("#tpocF-body");

    root.querySelector("#tpocF-closeBtn").addEventListener("click", () => {
      root.style.display = "none";
    });

    root.querySelector("#tpocF-minBtn").addEventListener("click", () => {
      minimized = !minimized;
      body.style.display = minimized ? "none" : "block";
      root.style.height = minimized ? "56px" : (root.classList.contains("tpoc-mobile") ? "min(75vh, 560px)" : "720px");
    });

    root.querySelector("#tpocF-popBtn").addEventListener("click", () => {
      root.style.display = "";
      root.style.zIndex = String(999999 + Math.floor(Math.random() * 1000));
      root.style.boxShadow = "0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(78,161,255,0.08) inset, 0 0 24px rgba(78,161,255,0.25)";
      setTimeout(() => { root.style.boxShadow = ""; }, 450);
    });

    root.querySelector("#tpocF-layoutBtn").addEventListener("click", cycleLayoutMode);

    // Pointer drag (desktop only)
    const header = root.querySelector("#tpocF-header");
    let drag = { on: false, dx: 0, dy: 0, pid: null };

    function canDragNow() { return !root.classList.contains("tpoc-mobile"); }

    header.addEventListener("pointerdown", (e) => {
      if (!canDragNow()) return;
      const t = e.target;
      if (t && t.tagName === "BUTTON") return;

      drag.on = true;
      drag.pid = e.pointerId;

      const rect = root.getBoundingClientRect();
      drag.dx = e.clientX - rect.left;
      drag.dy = e.clientY - rect.top;

      try { header.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    header.addEventListener("pointermove", (e) => {
      if (!drag.on || e.pointerId !== drag.pid) return;
      if (!canDragNow()) return;

      const x = clamp(e.clientX - drag.dx, 0, window.innerWidth - 60);
      const y = clamp(e.clientY - drag.dy, 0, window.innerHeight - 40);

      root.style.left = `${x}px`;
      root.style.top = `${y}px`;
      root.style.right = "auto";
      root.style.bottom = "auto";

      e.preventDefault();
    }, { passive: false });

    function endDrag(e) {
      if (!drag.on) return;
      if (e && drag.pid !== null && e.pointerId !== drag.pid) return;
      drag.on = false;
      drag.pid = null;
      try { header.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    header.addEventListener("pointerup", endDrag);
    header.addEventListener("pointercancel", endDrag);

    window.addEventListener("resize", () => {
      if (getSavedLayoutMode() === "auto") {
        applyLayoutMode(resolveLayoutMode());
        renderLayoutBtn();
      }
    });
  }

  ensureUI();

  // ============================================================
  // DOM Parsing: robust card extraction
  // ============================================================

  function normalizeCardToken(token) {
    if (!token) return null;
    let s = String(token).split("_")[0];
    if (!s || s === "cardSize") return null;

    s = s.replace("-A", "-14").replace("-K", "-13").replace("-Q", "-12").replace("-J", "-11");
    s = s.replace("-T", "-10");

    if (!/^(hearts|diamonds|spades|clubs)-(\d+)$/.test(s)) return null;

    const v = parseInt(s.split("-")[1], 10);
    if (!(v >= 2 && v <= 14)) return null;

    return s;
  }

  function extractCardFromEl(el) {
    if (!el || !el.classList) return null;
    for (const cls of Array.from(el.classList)) {
      const c = normalizeCardToken(cls);
      if (c) return c;
    }
    return null;
  }

  function readCardsFromContainer(container) {
    if (!container) return [];
    const els = Array.from(container.querySelectorAll("div"));
    const out = [];
    for (const e of els) {
      const c = extractCardFromEl(e);
      if (c) out.push(c);
    }
    const seen = new Set();
    return out.filter(c => (seen.has(c) ? false : (seen.add(c), true)));
  }

  function detectMyHoleCards() {
    const meNode = document.querySelector("[class*='playerMeGateway___']");
    if (!meNode) return [];
    const els = Array.from(meNode.querySelectorAll("div[class*='front___'] > div"));
    const cards = els.map(extractCardFromEl).filter(Boolean);
    return cards.slice(-2);
  }

  function detectCommunityCardsWithMode(myHole) {
    const containerSelectors = [
      "[class*='community']",
      "[class*='board']",
      "[id*='community']",
      "[id*='board']",
    ];
    for (const sel of containerSelectors) {
      const c = document.querySelector(sel);
      const cards = readCardsFromContainer(c);
      const cleaned = cards.filter(x => !myHole.includes(x)).slice(0, 5);
      if (cleaned.length >= 3 && cleaned.length <= 5) return { cards: cleaned, mode: `container:${sel}` };
      if (cleaned.length > 5) return { cards: cleaned.slice(0, 5), mode: `container:${sel}` };
    }

    const allFronts = Array.from(document.querySelectorAll("[class*='flipper___'] > div[class*='front___']"));
    const raw = [];
    for (const front of allFronts) {
      const els = Array.from(front.querySelectorAll("div"));
      for (const e of els) {
        const c = extractCardFromEl(e);
        if (c) raw.push(c);
      }
    }
    const seen = new Set();
    const uniq = raw.filter(c => (seen.has(c) ? false : (seen.add(c), true)));
    const cleaned = uniq.filter(x => !myHole.includes(x)).slice(0, 5);
    return { cards: cleaned, mode: "flipper-scan:fallback" };
  }

  function getStreetName(nBoard) {
    if (nBoard <= 0) return "Preflop";
    if (nBoard === 3) return "Flop";
    if (nBoard === 4) return "Turn";
    if (nBoard >= 5) return "River";
    return "Preflop";
  }

  // More robust folded detection than only "folded___"
  function nodeLooksFolded(n) {
    const cls = String(n?.className || "");
    if (/fold/i.test(cls)) return true;
    const txt = String(n?.textContent || "").toLowerCase();
    if (txt.includes("folded")) return true;

    // Many folded seats are dimmed/disabled
    try {
      const st = window.getComputedStyle(n);
      if (st && isFinite(parseFloat(st.opacity)) && parseFloat(st.opacity) < 0.65) return true;
    } catch (_) {}

    // If there are clear "Folded" labels in the seat area
    const foldedBadge = n.querySelector("[class*='fold'],[id*='fold']");
    if (foldedBadge) {
      const t = String(foldedBadge.textContent || "").toLowerCase();
      if (t.includes("fold")) return true;
    }

    return false;
  }

  function detectPlayersAndOpponents() {
    const playersRoot = document.querySelector("[class*='players___']");
    if (!playersRoot) return { playersTotal: NaN, oppActive: NaN, oppAll: NaN };

    const oppNodes = Array.from(playersRoot.querySelectorAll("[id^='player-']"));

    // Guard against weird duplication
    if (oppNodes.length > 12) return { playersTotal: NaN, oppActive: NaN, oppAll: NaN };

    const playersTotal = oppNodes.length;

    let active = 0;
    for (const n of oppNodes) {
      if (!nodeLooksFolded(n)) active++;
    }

    const hasMe = !!document.querySelector("[class*='playerMeGateway___']");
    const oppAll = hasMe ? Math.max(0, playersTotal - 1) : playersTotal;
    const oppActive = hasMe ? Math.max(0, active - 1) : active;

    return { playersTotal: hasMe ? playersTotal : (playersTotal + 1), oppActive, oppAll };
  }

  function detectPot() {
    const potEl = document.querySelector("[class*='roundPot___']");
    if (!potEl) return NaN;
    return parseMoney(potEl.textContent);
  }

  function detectMyStack() {
    const me = document.querySelector("[class*='playerMeGateway___']");
    if (me) {
      const moneyLike = Array.from(me.querySelectorAll("*"))
        .map(e => (e && e.textContent || "").trim())
        .find(t => /^\$\d[\d,]*$/.test(t));
      if (moneyLike) return parseMoney(moneyLike);
    }

    const allTexts = Array.from(document.querySelectorAll("[class*='money']"))
      .map(e => (e.textContent || "").trim())
      .filter(t => /^\$\d[\d,]*$/.test(t));
    if (allTexts.length) return parseMoney(allTexts[0]);

    return NaN;
  }

  function detectState() {
    const myHole = detectMyHoleCards();
    const comm = detectCommunityCardsWithMode(myHole);
    const community = (comm.cards || []).slice(0, 5);
    const street = getStreetName(community.length);
    const unknownBoard = Math.max(0, 5 - community.length);
    const knownCount = myHole.length + community.length;

    const { playersTotal, oppActive, oppAll } = detectPlayersAndOpponents();
    const pot = detectPot();
    const myStack = detectMyStack();

    return {
      myHole,
      community,
      street,
      unknownBoard,
      knownCount,
      parseMode: comm.mode,
      playersTotal,
      oppActive,
      oppAll,
      pot,
      myStack,
    };
  }

  function stateSig(s) {
    // include oppActive *and* community size so it changes correctly across streets
    return JSON.stringify({ h: s.myHole, b: s.community, p: s.oppActive });
  }

  // ============================================================
  // Visible rendering
  // ============================================================
  function chipLine(el, cards) {
    el.innerHTML = "";
    if (!cards || !cards.length) {
      const span = document.createElement("span");
      span.className = "tpocF-muted";
      span.textContent = "—";
      el.appendChild(span);
      return;
    }
    for (const c of cards) {
      const chip = document.createElement("span");
      chip.className = "tpocF-cardchip";
      chip.textContent = c;
      el.appendChild(chip);
    }
  }

  function setText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }

  function renderDetectedState(s, oppUsed) {
    chipLine(document.getElementById("tpocF-holeLine"), s.myHole);
    chipLine(document.getElementById("tpocF-boardLine"), s.community);
    setText("tpocF-parseMode", s.parseMode || "—");

    setText("tpocF-street", `Street: ${s.street}`);
    setText("tpocF-known", `Known: ${s.knownCount}`);
    setText("tpocF-unknown", `Unknown board: ${s.unknownBoard}`);

    const playersTxt = isFinite(s.playersTotal) ? s.playersTotal : "—";
    setText("tpocF-players", `Players: ${playersTxt}${isFinite(oppUsed) ? ` (opp used: ${oppUsed})` : ""}`);
    setText("tpocF-pot", `Pot: ${fmtMoney(s.pot)}`);
    setText("tpocF-stack", `My stack: ${fmtMoney(s.myStack)}`);
  }

  function renderNow(bestNow, topPct, equityP, ciLo, ciHi) {
    const nowBody = document.getElementById("tpocF-nowBody");
    nowBody.innerHTML = `
      <tr>
        <td>${bestNow || "—"}</td>
        <td class="tpocF-right">${isFinite(topPct) ? `Top ${fmtPct100(topPct)}` : "—"}</td>
        <td class="tpocF-right">${isFinite(equityP) ? fmtPct(equityP) : "—"}</td>
        <td class="tpocF-right">${(isFinite(ciLo) && isFinite(ciHi)) ? `${fmtPct(ciLo)} – ${fmtPct(ciHi)}` : "—"}</td>
      </tr>
    `;
  }

  function renderDist(tbody, counts, total) {
    const rows = [];
    for (let i = HAND_TYPES.length - 1; i >= 0; i--) {
      const c = counts[i] || 0;
      if (!c) continue;
      rows.push({ name: HAND_TYPES[i], c });
    }
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="2" class="tpocF-muted">—</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.slice(0, 10).map(r => `
      <tr>
        <td>${r.name}</td>
        <td class="tpocF-right">${fmtPct(r.c / total)}</td>
      </tr>
    `).join("");
  }

  function setPanelText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }

  function renderPanelsForStreet(street, equityP, ciLo, ciHi, usedSamples, oppCount) {
    const eq = isFinite(equityP) ? `${(equityP * 100).toFixed(2)}%` : "—";
    const ci = (isFinite(ciLo) && isFinite(ciHi)) ? `${(ciLo * 100).toFixed(2)}–${(ciHi * 100).toFixed(2)}%` : "—";
    const samp = isFinite(usedSamples) ? `${usedSamples.toLocaleString()}` : "—";
    const oppTxt = isFinite(oppCount) ? `${oppCount}` : "—";

    setPanelText("tpocF-preflop", street === "Preflop"
      ? `Estimated equity vs ${oppTxt} opponent(s): ${eq} (95% CI: ${ci}), samples: ${samp}`
      : "—");
    setPanelText("tpocF-flop", street === "Flop"
      ? `Estimated equity to showdown vs ${oppTxt} opponent(s): ${eq} (95% CI: ${ci}), samples: ${samp}`
      : "—");
    setPanelText("tpocF-turn", street === "Turn"
      ? `Estimated equity to showdown vs ${oppTxt} opponent(s): ${eq} (95% CI: ${ci}), samples: ${samp}`
      : "—");
    setPanelText("tpocF-river", street === "River"
      ? `Estimated equity vs ${oppTxt} opponent(s): ${eq} (95% CI: ${ci}), samples: ${samp}`
      : "—");
  }

  // ============================================================
  // Worker for Monte Carlo (FIXED ranking + Top% definition)
  // ============================================================
  function makeWorker() {
    const src = `
      const randInt = (n)=> (Math.random()*n)|0;

      function parseCard(cardStr) {
        const [suit, vStr] = cardStr.split("-");
        return { suit, v: parseInt(vStr, 10) };
      }
      function fullDeck() {
        const suits = ["hearts","diamonds","spades","clubs"];
        const deck = [];
        for (const s of suits) for (let v=2; v<=14; v++) deck.push(s+"-"+v);
        return deck;
      }
      function removeKnown(deck, known) {
        const set = new Set(known);
        return deck.filter(c => !set.has(c));
      }
      function sampleK(deck, k) {
        const arr = deck.slice();
        for (let i=0; i<k; i++) {
          const j = i + randInt(arr.length - i);
          const tmp = arr[i]; arr[i]=arr[j]; arr[j]=tmp;
        }
        return arr.slice(0,k);
      }
      function groupBySuit(cards) {
        const m = new Map();
        for (const c of cards) {
          if (!m.has(c.suit)) m.set(c.suit, []);
          m.get(c.suit).push(c.v);
        }
        return m;
      }
      function groupByValue(cards) {
        const m = new Map();
        for (const c of cards) m.set(c.v, (m.get(c.v)||0) + 1);
        return m;
      }

      // Best straight top card (A2345 -> 5), else 0
      function bestStraightTop(valsDescUnique) {
        const vals = valsDescUnique.slice();
        if (vals.includes(14)) vals.push(1);
        const uniq = Array.from(new Set(vals)).sort((a,b)=>b-a);

        let run = 1;
        for (let i=0; i<uniq.length-1; i++) {
          if (uniq[i] - 1 === uniq[i+1]) {
            run++;
            if (run >= 5) return uniq[i-3];
          } else run = 1;
        }
        return 0;
      }

      // FIX: Fixed-width score prevents high-card outranking pairs, etc.
      const POW15_5 = 15**5;
      function scoreFixed(typeIndex, kickers) {
        const k = kickers.slice(0,5);
        while (k.length < 5) k.push(0);
        let s = typeIndex * POW15_5;
        s += k[0]*(15**4) + k[1]*(15**3) + k[2]*(15**2) + k[3]*15 + k[4];
        return s;
      }

      function bestFiveOfSeven(seven) {
        const bySuit = groupBySuit(seven);
        const byVal = groupByValue(seven);
        const valuesDesc = Array.from(byVal.keys()).sort((a,b)=>b-a);

        // Flush detection
        let flushValsDesc = null;
        for (const [,vals] of bySuit.entries()) {
          if (vals.length >= 5) { flushValsDesc = vals.slice().sort((a,b)=>b-a); break; }
        }

        // Straight flush / Royal
        if (flushValsDesc) {
          const uniqFlush = Array.from(new Set(flushValsDesc)).sort((a,b)=>b-a);
          const sfTop = bestStraightTop(uniqFlush);
          if (sfTop) {
            const present = new Set(uniqFlush);
            const isRoyal = [10,11,12,13,14].every(x=>present.has(x));
            if (isRoyal) return { typeIndex:9, score: scoreFixed(9,[14]), typeName:"Royal Flush" };
            return { typeIndex:8, score: scoreFixed(8,[sfTop]), typeName:"Straight Flush" };
          }
        }

        const counts = Array.from(byVal.entries()).map(([v,n])=>({v,n}));
        counts.sort((a,b)=> (b.n-a.n) || (b.v-a.v));

        if (counts[0]?.n === 4) {
          const quad = counts[0].v;
          const kick = valuesDesc.filter(v=>v!==quad)[0];
          return { typeIndex:7, score: scoreFixed(7,[quad,kick]), typeName:"Four of a Kind" };
        }

        if (counts[0]?.n === 3) {
          const trips = counts.filter(x=>x.n===3).map(x=>x.v).sort((a,b)=>b-a);
          const pairs = counts.filter(x=>x.n>=2).map(x=>x.v).filter(v=>v!==trips[0]).sort((a,b)=>b-a);
          if (pairs.length) return { typeIndex:6, score: scoreFixed(6,[trips[0],pairs[0]]), typeName:"Full House" };
          if (trips.length>1) return { typeIndex:6, score: scoreFixed(6,[trips[0],trips[1]]), typeName:"Full House" };
        }

        if (flushValsDesc) {
          const top5 = flushValsDesc.slice(0,5);
          return { typeIndex:5, score: scoreFixed(5, top5), typeName:"Flush" };
        }

        const stTop = bestStraightTop(valuesDesc);
        if (stTop) return { typeIndex:4, score: scoreFixed(4,[stTop]), typeName:"Straight" };

        if (counts[0]?.n === 3) {
          const t = counts[0].v;
          const kicks = valuesDesc.filter(v=>v!==t).slice(0,2);
          return { typeIndex:3, score: scoreFixed(3,[t,...kicks]), typeName:"Three of a Kind" };
        }

        const pairVals = counts.filter(x=>x.n===2).map(x=>x.v).sort((a,b)=>b-a);
        if (pairVals.length >= 2) {
          const p1=pairVals[0], p2=pairVals[1];
          const kick = valuesDesc.filter(v=>v!==p1 && v!==p2)[0];
          return { typeIndex:2, score: scoreFixed(2,[p1,p2,kick]), typeName:"Two Pair" };
        }
        if (pairVals.length === 1) {
          const p=pairVals[0];
          const kicks = valuesDesc.filter(v=>v!==p).slice(0,3);
          return { typeIndex:1, score: scoreFixed(1,[p,...kicks]), typeName:"Pair" };
        }

        const top5 = valuesDesc.slice(0,5);
        return { typeIndex:0, score: scoreFixed(0, top5), typeName:"High Card" };
      }

      function wilsonWidth(effWins, n, z=1.96) {
        if (n<=0) return Infinity;
        const p = effWins/n;
        const denom = 1 + (z*z)/n;
        const center = (p + (z*z)/(2*n))/denom;
        const margin = (z * Math.sqrt((p*(1-p)/n) + (z*z)/(4*n*n)))/denom;
        const lo = Math.max(0, center - margin);
        const hi = Math.min(1, center + margin);
        return hi - lo;
      }

      onmessage = (ev) => {
        const { runId, community, myHole, oppCount, maxSamples, batchSize, ciWidthTarget } = ev.data;

        const nBoard = community.length;
        const missingBoard = Math.max(0, 5 - nBoard);
        const known = [...community, ...myHole];
        const deck = removeKnown(fullDeck(), known);

        const commP = community.map(parseCard);
        const myP = myHole.map(parseCard);

        let bestNow = null;
        if (myP.length === 2 && (commP.length >= 3)) {
          bestNow = bestFiveOfSeven([...commP, ...myP]);
        } else if (myP.length === 2 && commP.length === 0) {
          bestNow = { typeName: "Preflop (hole cards)" };
        } else if (myP.length === 2 && commP.length > 0 && commP.length < 3) {
          bestNow = { typeName: "Early street (partial board)" };
        }

        let wins=0, ties=0, losses=0, n=0;

        // "Top%" as: fraction of simulations hero is ahead vs TABLE best (half ties)
        let ahead=0, equal=0, total=0;

        const myTypeCounts = Array(10).fill(0);
        const oppBestTypeCounts = Array(10).fill(0);

        const totalNeedDraw = missingBoard + 2*oppCount;
        const BS = Math.max(500, batchSize|0);

        while (n < maxSamples) {
          const remaining = maxSamples - n;
          const iter = Math.min(BS, remaining);

          for (let t=0; t<iter; t++) {
            const draw = sampleK(deck, totalNeedDraw);
            const addBoard = draw.slice(0, missingBoard);

            const finalBoard = community.concat(addBoard).map(parseCard);
            const myEv = bestFiveOfSeven([...finalBoard, ...myP]);
            myTypeCounts[myEv.typeIndex]++;

            let oppBest = null;
            for (let o=0; o<oppCount; o++) {
              const hole = draw.slice(missingBoard + o*2, missingBoard + o*2 + 2).map(parseCard);
              const oppEv = bestFiveOfSeven([...finalBoard, ...hole]);
              if (!oppBest || oppEv.score > oppBest.score) oppBest = oppEv;
            }
            oppBestTypeCounts[oppBest.typeIndex]++;

            if (myEv.score > oppBest.score) { wins++; ahead++; }
            else if (myEv.score < oppBest.score) { losses++; }
            else { ties++; equal++; }
            total++;
          }

          n += iter;

          const effWins = wins + 0.5*ties;
          const ciW = wilsonWidth(effWins, n);

          postMessage({ type:"progress", runId, done:n, maxSamples, ciWidth: ciW });

          if (ciWidthTarget > 0 && n >= Math.max(2000, BS) && ciW <= ciWidthTarget) break;
        }

        const winP = wins / n;
        const tieP = ties / n;
        const lossP = losses / n;

        const topFrac = (ahead + 0.5*equal) / Math.max(1, total);
        const topPct = topFrac * 100;

        postMessage({
          type:"done",
          runId,
          usedSamples: n,
          bestNow: bestNow ? bestNow.typeName : null,
          topPct,
          winP,
          tieP,
          lossP,
          myTypeCounts,
          oppBestTypeCounts
        });
      };
    `;

    const blob = new Blob([src], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  }

  // ============================================================
  // Controls + mapping
  // ============================================================
  const qualityEl = document.getElementById("tpocF-quality");
  const qualityValEl = document.getElementById("tpocF-qualityVal");
  const oppEl = document.getElementById("tpocF-opp");
  const oppValEl = document.getElementById("tpocF-oppVal");
  const autoOppEl = document.getElementById("tpocF-autoOpp");
  const autoOppPill = document.getElementById("tpocF-autoOppPill");
  const convergeEl = document.getElementById("tpocF-converge");
  const ciTargetEl = document.getElementById("tpocF-ciTarget");

  const resetSeriesBtn = document.getElementById("tpocF-resetSeries");

  const startBtn = document.getElementById("tpocF-start");
  const pauseBtn = document.getElementById("tpocF-pause");
  const stopBtn = document.getElementById("tpocF-stop");

  const samplesPill = document.getElementById("tpocF-samples");
  const runtimePill = document.getElementById("tpocF-runtime");
  const statePill = document.getElementById("tpocF-state");

  const myDistBody = document.getElementById("tpocF-myDist");
  const oppDistBody = document.getElementById("tpocF-oppDist");

  const seriesScoreEl = document.getElementById("tpocF-seriesScore");
  const seriesTiesEl = document.getElementById("tpocF-seriesTies");
  const seriesHandsEl = document.getElementById("tpocF-seriesHands");
  const netChipsEl = document.getElementById("tpocF-netChips");
  const avgWinEl = document.getElementById("tpocF-avgWin");

  function setState(txt) {
    if (statePill) statePill.textContent = `State: ${txt}`;
  }

  function qualityToMaxSamples(q, street) {
    const base = 9000 + (q * q) * 1400; // ~10k..149k
    if (street === "Preflop") return Math.round(base * 0.85);
    if (street === "Flop") return Math.round(base * 0.95);
    return Math.round(base);
  }

  function qualityToBatchSize(q) { return 1500 + q * 900; }
  function qualityToCiTarget(q) {
    const widthPct = 4.0 - (q - 1) * (2.8 / 9); // 4.0 -> 1.2
    return widthPct / 100;
  }

  function updateQualityUI() {
    const q = parseInt(qualityEl.value, 10);
    qualityValEl.textContent = String(q);
    const w = qualityToCiTarget(q) * 100;
    ciTargetEl.textContent = `CI width ≤ ${w.toFixed(1)}%`;
  }

  function updateOppUI() {
    oppValEl.textContent = String(parseInt(oppEl.value, 10));
  }

  qualityEl.addEventListener("input", updateQualityUI);
  oppEl.addEventListener("input", updateOppUI);
  autoOppEl.addEventListener("change", () => {
    autoOppPill.textContent = autoOppEl.checked ? "auto" : "manual";
  });

  updateQualityUI();
  updateOppUI();
  autoOppPill.textContent = autoOppEl.checked ? "auto" : "manual";

  // ============================================================
  // Best-of series tracking (inferred from stack changes)
  // ============================================================
  const series = {
    wins: 0,
    losses: 0,
    ties: 0,
    hands: 0,
    netChips: 0,
    sumEquity: 0,
    sumEquityN: 0,
    lastStreet: null,
    lastStackAtRiver: NaN,
    awaitingNextHand: false,
  };

  function renderSeries() {
    seriesScoreEl.textContent = `${series.wins}-${series.losses}`;
    seriesTiesEl.textContent = String(series.ties);
    seriesHandsEl.textContent = String(series.hands);

    const sign = series.netChips >= 0 ? "+" : "";
    netChipsEl.textContent = `${sign}${series.netChips.toLocaleString()}`;

    const avg = series.sumEquityN > 0 ? (series.sumEquity / series.sumEquityN) : 0;
    avgWinEl.textContent = `${avg.toFixed(1)}%`;
  }

  function resetSeries() {
    series.wins = 0;
    series.losses = 0;
    series.ties = 0;
    series.hands = 0;
    series.netChips = 0;
    series.sumEquity = 0;
    series.sumEquityN = 0;
    series.lastStreet = null;
    series.lastStackAtRiver = NaN;
    series.awaitingNextHand = false;
    renderSeries();
  }

  resetSeriesBtn.addEventListener("click", resetSeries);

  // ============================================================
  // Run loop + worker management
  // ============================================================
  let running = true;
  let busy = false;
  let worker = null;
  let runId = 0;
  let lastSig = "";
  let activeRunSig = ""; // FIX: track signature actually being simulated
  let lastStreet = "—";
  let t0 = 0;

  let lastEquityP = NaN;
  let lastOppUsed = NaN;

  function stopWorker() {
    if (worker) { worker.terminate(); worker = null; }
    busy = false;
    activeRunSig = "";
  }

  function pause() { running = false; setState("paused"); }
  function start() { running = true; setState("running"); lastSig = ""; }
  function stop() {
    running = false;
    stopWorker();
    setState("stopped");
    runtimePill.textContent = "Runtime: —";
    samplesPill.textContent = "Samples: —";
  }

  pauseBtn.addEventListener("click", pause);
  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);

  // ============================================================
  // Series inference logic
  // ============================================================
  function updateSeriesFromState(s) {
    const street = s.street;

    if (street === "River" && isFinite(s.myStack)) {
      series.lastStackAtRiver = s.myStack;
      series.awaitingNextHand = true;
    }

    const isNewHand = (street === "Preflop" && (s.community.length === 0));
    if (series.awaitingNextHand && isNewHand && isFinite(series.lastStackAtRiver) && isFinite(s.myStack)) {
      const delta = s.myStack - series.lastStackAtRiver;
      const THRESH = 1;

      if (Math.abs(delta) <= THRESH) series.ties += 1;
      else if (delta > 0) series.wins += 1;
      else series.losses += 1;

      series.hands += 1;
      series.netChips += Math.round(delta);

      if (isFinite(lastEquityP)) {
        series.sumEquity += lastEquityP * 100;
        series.sumEquityN += 1;
      }

      series.awaitingNextHand = false;
      series.lastStackAtRiver = NaN;

      renderSeries();
    }

    series.lastStreet = street;
  }

  // ============================================================
  // Auto opponents selection
  // ============================================================
  function getOppCountForRun(s) {
    if (autoOppEl.checked) {
      if (isFinite(s.oppActive) && s.oppActive >= 1) return clamp(s.oppActive, 1, 10);
      if (isFinite(s.oppAll) && s.oppAll >= 1) return clamp(s.oppAll, 1, 10);
      // If auto is broken, fall back to manual slider (do NOT silently assume 1 from NaN)
      return clamp(parseInt(oppEl.value, 10), 1, 10);
    }
    return clamp(parseInt(oppEl.value, 10), 1, 10);
  }

  // ============================================================
  // Compute loop
  // ============================================================
  function computeIfNeeded() {
    const s = detectState();
    const sig = stateSig(s);

    // Always show current detected state; if we have a "lastOppUsed", show it too.
    renderDetectedState(s, isFinite(lastOppUsed) ? lastOppUsed : NaN);
    updateSeriesFromState(s);

    // FIX: if the game state changes while we’re simming, cancel stale run immediately
    if (busy && sig !== activeRunSig) {
      stopWorker();
      setState("state changed • restarting…");
      return;
    }

    if (!running || busy) return;

    if (s.myHole.length < 2) {
      setState("running (waiting for hole cards)");
      return;
    }

    if (sig === lastSig) return;

    // Sanity checks (avoid simming nonsense)
    if (s.street === "River" && s.community.length !== 5) {
      setState(`parse issue: river but board=${s.community.length}`);
      return;
    }
    const allKnown = [...s.myHole, ...s.community];
    if (new Set(allKnown).size !== allKnown.length) {
      setState("parse issue: duplicate known card");
      return;
    }

    lastSig = sig;
    activeRunSig = sig;
    lastStreet = s.street;

    stopWorker();
    worker = makeWorker();
    busy = true;
    runId++;
    const thisRun = runId;

    const q = parseInt(qualityEl.value, 10);
    const oppCount = getOppCountForRun(s);
    lastOppUsed = oppCount;

    // FIX: show exact opponent count used (removes “feels wrong” ambiguity)
    setText("tpocF-mode", `Mode: ${autoOppEl.checked ? "auto" : "manual"} • opp used: ${oppCount}`);

    if (autoOppEl.checked && isFinite(oppCount)) {
      oppEl.value = String(oppCount);
      updateOppUI();
    }

    const maxSamples = clamp(qualityToMaxSamples(q, s.street), 2000, 200000);
    const batchSize = clamp(qualityToBatchSize(q), 1000, 20000);
    const ciTarget = convergeEl.checked ? qualityToCiTarget(q) : -1;

    samplesPill.textContent = `Samples: 0 / ${maxSamples.toLocaleString()}`;
    runtimePill.textContent = "Runtime: running…";
    setState("running");

    renderNow("—", NaN, NaN, NaN, NaN);
    myDistBody.innerHTML = `<tr><td colspan="2" class="tpocF-muted">Computing…</td></tr>`;
    oppDistBody.innerHTML = `<tr><td colspan="2" class="tpocF-muted">Computing…</td></tr>`;
    renderPanelsForStreet(s.street, NaN, NaN, NaN, NaN, oppCount);

    t0 = performance.now();

    worker.onmessage = (ev) => {
      const msg = ev.data;
      if (!msg || msg.runId !== thisRun) return;

      if (msg.type === "progress") {
        const dt = (performance.now() - t0) / 1000;
        runtimePill.textContent = `Runtime: ${dt.toFixed(2)}s`;
        samplesPill.textContent = `Samples: ${msg.done.toLocaleString()} / ${maxSamples.toLocaleString()}`;

        const ciW = msg.ciWidth * 100;
        const targetW = (ciTarget > 0 ? ciTarget * 100 : null);
        const convTxt = (targetW !== null)
          ? `CI width ~ ${ciW.toFixed(2)}% (≤ ${targetW.toFixed(2)}%)`
          : `CI width ~ ${ciW.toFixed(2)}% (no converge stop)`;
        statePill.textContent = `State: running • ${convTxt}`;
        return;
      }

      if (msg.type === "done") {
        const dt = (performance.now() - t0) / 1000;
        runtimePill.textContent = `Runtime: ${dt.toFixed(2)}s`;
        samplesPill.textContent = `Samples: ${msg.usedSamples.toLocaleString()} (stopped)`;
        busy = false;

        const effWins = (msg.winP * msg.usedSamples) + 0.5 * (msg.tieP * msg.usedSamples);
        const [ciLo, ciHi] = wilsonCI(effWins, msg.usedSamples);
        const equityP = effWins / msg.usedSamples;

        lastEquityP = equityP;

        renderNow(msg.bestNow, msg.topPct, equityP, ciLo, ciHi);
        renderDist(myDistBody, msg.myTypeCounts, msg.usedSamples);
        renderDist(oppDistBody, msg.oppBestTypeCounts, msg.usedSamples);
        renderPanelsForStreet(lastStreet, equityP, ciLo, ciHi, msg.usedSamples, oppCount);

        setState(running ? "running (idle)" : "paused");
      }
    };

    worker.postMessage({
      runId: thisRun,
      community: s.community,
      myHole: s.myHole,
      oppCount,
      maxSamples,
      batchSize,
      ciWidthTarget: ciTarget
    });
  }

  // ============================================================
  // Boot state
  // ============================================================
  renderSeries();
  setText("tpocF-mode", `Mode: ${autoOppEl.checked ? "auto" : "manual"} • opp used: —`);
  setState("running (idle)");

  // Poll
  setInterval(computeIfNeeded, 650);
})();

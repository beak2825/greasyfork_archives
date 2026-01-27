// ==UserScript==
// @name         Torn - Slots Pattern Tally
// @namespace    https://www.torn.com/
// @version      01.26.2026.21.40
// @description  Tracks Slots spins by watching Tokens decrease and reading Won. Tables: wins after X losses, token-start wins, combo wins. Backward compatible V6/V7. File import and save export. Visible-tab safe.
// @author       KillerCleat [2842410]
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/563086-torn-slots-pattern-tally
// @supportURL   https://greasyfork.org/en/scripts/563086-torn-slots-pattern-tally/feedback
// @match        https://www.torn.com/page.php?sid=slots*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563086/Torn%20-%20Slots%20Pattern%20Tally.user.js
// @updateURL https://update.greasyfork.org/scripts/563086/Torn%20-%20Slots%20Pattern%20Tally.meta.js
// ==/UserScript==

/*
NOTES & REQUIREMENTS
Version: 01.26.2026.21.40
Author: KillerCleat [2842410]
Greasy Fork: https://greasyfork.org/en/scripts/563086-torn-slots-pattern-tally

Rules:
- No more than 2 consecutive spaces anywhere in this script.
- Uses ONLY data from the Slots page you loaded and are currently viewing (DOM).
- Makes NO additional requests to Torn.
- Visible-tab safe:
  - Does not process results unless document.visibilityState === "visible".
  - Disconnects observers when tab is hidden.
- Does not auto-click, bet, spin, or interact with gameplay.

Canonical data shape (V7):
- winByStreak: { "X": winsAfterXLosses }
- winsByTokenStart: { "T": winsWhenSpinStartedAtTokenT }
- spinsByTokenStart: { "T": spinsObservedStartingAtTokenT }
- winsByCombo: { "X|T": winsWhenCombo(X losses, token start T) }
- spinsByCombo: { "X|T": spinsObservedForCombo(X losses, token start T) }

Import/export:
- Export includes full maps (not top 15).
- Import merges maps (merge-only).
- Auto-migrates legacy localStorage keys if found.

Spin detection:
- A spin is counted when Tokens decreases.
- Won is read from the page:
  - Won == 0 => LOSS
  - Won > 0  => WIN
*/

(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  const GF_URL = "https://greasyfork.org/en/scripts/563086-torn-slots-pattern-tally";
  const STORAGE_KEY = "KC_SLOTS_HISTOGRAM_V7";
  const LEGACY_KEYS = [
    "KC_SLOTS_HISTOGRAM_V6",
    "KC_SLOTS_HISTOGRAM_V5",
    "KC_SLOTS_HISTOGRAM_V4",
    "KC_SLOTS_HISTOGRAM_V3",
    "KC_SLOTS_TALLY_V6",
    "KC_SLOTS_TALLY_V5",
    "KC_SLOTS_TALLY_V4",
    "KC_SLOTS_TALLY_V3"
  ];

  const PANEL_ID = "kc-slots-panel";
  const STYLE_ID = "kc-slots-style";
  const INLINE_ID = "kc-token-inline-info";
  const FILE_INPUT_ID = "kc-import-file-input";

  const HOT_TOP_N = 3;
  const MAX_ROWS = 30;
  const TOP_TOKENS_N = 15;
  const TOP_COMBOS_N = 15;

  const WON_REREAD_DELAY_MS = 200;

  const POS_KEY = "KC_SLOTS_TALLY_POS_V1";
  const MIN_KEY = "KC_SLOTS_TALLY_MIN_V1";

  // =========================
  // TAB GATING
  // =========================
  function isVisibleTab() {
    return document.visibilityState === "visible";
  }

  // =========================
  // HELPERS
  // =========================
  function parseIntSafe(raw) {
    if (raw === null || raw === undefined) return null;
    const n = parseInt(String(raw).trim().replace(/,/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  }

  function parseMoneyLike(raw) {
    if (raw === null || raw === undefined) return null;
    const cleaned = String(raw).replace(/[^\d,]/g, "");
    return parseIntSafe(cleaned);
  }

  function nowStamp() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss} TCT`;
  }

  function sumMapValues(mapObj) {
    let s = 0;
    if (!mapObj || typeof mapObj !== "object") return 0;
    for (const v of Object.values(mapObj)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) s += n;
    }
    return s;
  }

  function mergeNumberMap(dst, src) {
    if (!src || typeof src !== "object") return 0;
    let added = 0;
    for (const [k, v] of Object.entries(src)) {
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0) continue;
      dst[k] = (Number(dst[k]) || 0) + n;
      added += n;
    }
    return added;
  }

  // =========================
  // READ VALUES
  // =========================
  function readTokensById() {
    const el = document.getElementById("tokens");
    if (!el) return null;
    return parseIntSafe(el.textContent);
  }

  function readWonById() {
    const el = document.getElementById("moneyWon");
    if (!el) return null;
    return parseMoneyLike(el.textContent);
  }

  function readTokensWonByScan() {
    const root = document.querySelector(".slots-main-wrap") || document.querySelector(".slots-area-wrap") || document.body;
    const text = (root && (root.innerText || root.textContent)) ? (root.innerText || root.textContent) : "";
    if (!text) return { tokens: null, won: null };

    const tMatch = text.match(/Tokens:\s*([0-9,]+)/i);
    const wMatch = text.match(/Won:\s*\$?\s*([0-9,]+)/i);

    const tokens = tMatch ? parseIntSafe(tMatch[1]) : null;
    const won = wMatch ? parseIntSafe(wMatch[1]) : null;

    return { tokens, won };
  }

  function readTokens() {
    const byId = readTokensById();
    if (byId !== null) return byId;
    return readTokensWonByScan().tokens;
  }

  function readWon() {
    const byId = readWonById();
    if (byId !== null) return byId;
    return readTokensWonByScan().won;
  }

  // =========================
  // STATE
  // =========================
  function defaultState() {
    return {
      winByStreak: {},
      winsByTokenStart: {},
      spinsByTokenStart: {},
      winsByCombo: {},
      spinsByCombo: {},
      currentLossStreak: 0,
      totalWins: 0,
      lastTokens: null,
      untrackedSpins: 0,
      debugLast: { tokensFrom: null, tokensTo: null, won: null, when: "" }
    };
  }

  function normalizeState(st) {
    const out = defaultState();
    if (!st || typeof st !== "object") return out;

    out.winByStreak = (st.winByStreak && typeof st.winByStreak === "object") ? st.winByStreak : {};
    out.winsByTokenStart = (st.winsByTokenStart && typeof st.winsByTokenStart === "object") ? st.winsByTokenStart : {};
    out.spinsByTokenStart = (st.spinsByTokenStart && typeof st.spinsByTokenStart === "object") ? st.spinsByTokenStart : {};
    out.winsByCombo = (st.winsByCombo && typeof st.winsByCombo === "object") ? st.winsByCombo : {};
    out.spinsByCombo = (st.spinsByCombo && typeof st.spinsByCombo === "object") ? st.spinsByCombo : {};

    out.currentLossStreak = Number.isFinite(st.currentLossStreak) ? st.currentLossStreak : 0;

    const tw = Number(st.totalWins);
    out.totalWins = Number.isFinite(tw) && tw >= 0 ? tw : 0;
    if (!out.totalWins) out.totalWins = sumMapValues(out.winByStreak);

    out.lastTokens = Number.isFinite(st.lastTokens) ? st.lastTokens : null;
    out.untrackedSpins = Number.isFinite(st.untrackedSpins) ? st.untrackedSpins : 0;

    if (st.debugLast && typeof st.debugLast === "object") {
      out.debugLast.tokensFrom = Number.isFinite(st.debugLast.tokensFrom) ? st.debugLast.tokensFrom : null;
      out.debugLast.tokensTo = Number.isFinite(st.debugLast.tokensTo) ? st.debugLast.tokensTo : null;
      out.debugLast.won = Number.isFinite(st.debugLast.won) ? st.debugLast.won : null;
      out.debugLast.when = typeof st.debugLast.when === "string" ? st.debugLast.when : "";
    }

    // Back-compat: tokenStats style (if a prior edit created it)
    if (st.tokenStats && typeof st.tokenStats === "object") {
      for (const [k, v] of Object.entries(st.tokenStats)) {
        if (!v || typeof v !== "object") continue;
        const wins = Number(v.wins);
        const spins = Number(v.spins);
        if (Number.isFinite(wins) && wins > 0) out.winsByTokenStart[k] = (Number(out.winsByTokenStart[k]) || 0) + wins;
        if (Number.isFinite(spins) && spins > 0) out.spinsByTokenStart[k] = (Number(out.spinsByTokenStart[k]) || 0) + spins;
      }
      if (!out.totalWins) out.totalWins = sumMapValues(out.winByStreak);
    }

    return out;
  }

  function loadRaw(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveState(st) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  }

  function migrateLegacyInto(base) {
    let changed = false;
    for (const k of LEGACY_KEYS) {
      const legacy = loadRaw(k);
      if (!legacy) continue;
      const norm = normalizeState(legacy);
      mergeNumberMap(base.winByStreak, norm.winByStreak);
      mergeNumberMap(base.winsByTokenStart, norm.winsByTokenStart);
      mergeNumberMap(base.spinsByTokenStart, norm.spinsByTokenStart);
      mergeNumberMap(base.winsByCombo, norm.winsByCombo);
      mergeNumberMap(base.spinsByCombo, norm.spinsByCombo);
      if (base.lastTokens === null && Number.isFinite(norm.lastTokens)) base.lastTokens = norm.lastTokens;
      changed = true;
    }
    if (changed) {
      base.totalWins = sumMapValues(base.winByStreak);
      saveState(base);
    }
    return base;
  }

  function loadState() {
    const cur = normalizeState(loadRaw(STORAGE_KEY));
    return migrateLegacyInto(cur);
  }

  // =========================
  // DATA RECORDING
  // =========================
  function recordLoss(st) {
    st.currentLossStreak += 1;
  }

  function recordWin(st) {
    const x = st.currentLossStreak;
    const key = String(x);
    st.winByStreak[key] = (Number(st.winByStreak[key]) || 0) + 1;
    st.totalWins += 1;
    st.currentLossStreak = 0;
  }

  function bumpSpinTokenStart(st, tokenStart) {
    const k = String(tokenStart);
    st.spinsByTokenStart[k] = (Number(st.spinsByTokenStart[k]) || 0) + 1;
  }

  function bumpWinTokenStart(st, tokenStart) {
    const k = String(tokenStart);
    st.winsByTokenStart[k] = (Number(st.winsByTokenStart[k]) || 0) + 1;
  }

  function comboKey(xLosses, tokenStart) {
    return `${xLosses}|${tokenStart}`;
  }

  function bumpSpinCombo(st, xLosses, tokenStart) {
    const k = comboKey(xLosses, tokenStart);
    st.spinsByCombo[k] = (Number(st.spinsByCombo[k]) || 0) + 1;
  }

  function bumpWinCombo(st, xLosses, tokenStart) {
    const k = comboKey(xLosses, tokenStart);
    st.winsByCombo[k] = (Number(st.winsByCombo[k]) || 0) + 1;
  }

  // =========================
  // SORTERS
  // =========================
  function sortedHistogramEntries(winByStreak) {
    return Object.entries(winByStreak || {})
      .map(([k, v]) => ({ x: parseInt(k, 10), y: Number(v) }))
      .filter(o => Number.isFinite(o.x) && o.x >= 0 && Number.isFinite(o.y) && o.y > 0)
      .sort((a, b) => (b.y - a.y) || (a.x - b.x));
  }

  function getHotStreakKeys(winByStreak) {
    return sortedHistogramEntries(winByStreak).slice(0, HOT_TOP_N).map(o => String(o.x));
  }

  function topTokenStarts(st, limit) {
    const rows = [];
    for (const [k, winsV] of Object.entries(st.winsByTokenStart || {})) {
      const t = parseInt(k, 10);
      const wins = Number(winsV);
      const spins = Number((st.spinsByTokenStart || {})[k] || 0);
      if (!Number.isFinite(t) || t < 0) continue;
      if (!Number.isFinite(wins) || wins <= 0) continue;
      rows.push({ t, wins, spins });
    }
    rows.sort((a, b) => (b.wins - a.wins) || (a.t - b.t));
    return rows.slice(0, limit);
  }

  function topCombos(st, limit) {
    const rows = [];
    for (const [k, winsV] of Object.entries(st.winsByCombo || {})) {
      const parts = String(k).split("|");
      const x = parseInt(parts[0], 10);
      const t = parseInt(parts[1], 10);
      const wins = Number(winsV);
      const spins = Number((st.spinsByCombo || {})[k] || 0);
      if (!Number.isFinite(x) || x < 0) continue;
      if (!Number.isFinite(t) || t < 0) continue;
      if (!Number.isFinite(wins) || wins <= 0) continue;
      rows.push({ x, t, wins, spins });
    }
    rows.sort((a, b) => (b.wins - a.wins) || (a.x - b.x) || (a.t - b.t));
    return rows.slice(0, limit);
  }

  // =========================
  // INLINE TOKENS LINE
  // =========================
  function updateInlineTokenStats(st) {
    const tokensEl = document.getElementById("tokens");
    if (!tokensEl || !tokensEl.parentElement) return;

    let infoEl = document.getElementById(INLINE_ID);
    if (!infoEl) {
      infoEl = document.createElement("span");
      infoEl.id = INLINE_ID;
      infoEl.style.marginLeft = "8px";
      infoEl.style.fontSize = "11px";
      infoEl.style.opacity = "0.85";
      infoEl.style.whiteSpace = "nowrap";
      tokensEl.parentElement.appendChild(infoEl);
    }

    const tokenVal = parseIntSafe(tokensEl.textContent);
    if (tokenVal === null) {
      infoEl.textContent = "";
      return;
    }

    const k = String(tokenVal);
    const wins = Number((st.winsByTokenStart || {})[k] || 0);
    if (!wins || !st.totalWins) {
      infoEl.textContent = " | no wins logged";
      return;
    }
    const pct = ((wins / st.totalWins) * 100).toFixed(1);
    infoEl.textContent = ` | ${wins} wins @ ${pct}%`;
  }

  // =========================
  // UI
  // =========================
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const css =
`#${PANEL_ID}{
  position: fixed;
  top: 140px;
  right: 14px;
  width: 340px;
  z-index: 2147483000;
  background: rgba(20,20,20,0.92);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  overflow: hidden;
}
#${PANEL_ID} .kc-head{
  padding: 10px;
  font-weight: 700;
  font-size: 13px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
}
#${PANEL_ID} .kc-actions{
  display: flex;
  gap: 6px;
  cursor: default;
}
#${PANEL_ID} .kc-actions button{
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  color: #fff;
  padding: 4px 6px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 11px;
}
#${PANEL_ID} .kc-actions button:hover{ background: rgba(255,255,255,0.12); }
#${PANEL_ID} .kc-body{ padding: 10px; font-size: 12px; }
#${PANEL_ID} .kc-row{
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}
#${PANEL_ID} .kc-mini{
  margin-top: 6px;
  font-size: 11px;
  color: rgba(255,255,255,0.75);
  line-height: 1.3;
}
#${PANEL_ID} .kc-hot{ font-weight: 700; }
#${PANEL_ID} .kc-sub{
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.10);
}
#${PANEL_ID} .kc-title{
  font-weight: 700;
  margin-top: 8px;
}
#${PANEL_ID} .kc-list{
  margin-top: 8px;
  max-height: 200px;
  overflow: auto;
  padding-right: 4px;
  font-variant-numeric: tabular-nums;
}
#${PANEL_ID} .kc-item{
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 8px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 8px;
  margin-bottom: 6px;
  background: rgba(255,255,255,0.06);
}
#${PANEL_ID} .kc-item.kc-current{
  border: 2px solid rgba(255,255,255,0.60);
  background: rgba(255,255,255,0.10);
}
#${PANEL_ID} .kc-btns{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}
#${PANEL_ID} .kc-btns button{
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  color: #fff;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 11px;
}
#${PANEL_ID} .kc-btns button:hover{ background: rgba(255,255,255,0.12); }
#${PANEL_ID} .kc-io{
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.10);
}
#${PANEL_ID} textarea{
  width: 100%;
  height: 90px;
  resize: vertical;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #fff;
  padding: 8px;
  font-size: 11px;
  line-height: 1.3;
  box-sizing: border-box;
}
#${PANEL_ID} a{
  color: rgba(255,255,255,0.85);
  text-decoration: underline;
}
#${PANEL_ID}.kc-min .kc-sub,
#${PANEL_ID}.kc-min .kc-io,
#${PANEL_ID}.kc-min #kc-debug,
#${PANEL_ID}.kc-min #kc-hint{
  display: none;
}
#${PANEL_ID}.kc-min{ width: 290px; }`;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function loadPanelPos() {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (!p || typeof p !== "object") return null;
      if (!Number.isFinite(p.top) || !Number.isFinite(p.left)) return null;
      return p;
    } catch (e) {
      return null;
    }
  }

  function savePanelPos(top, left) {
    localStorage.setItem(POS_KEY, JSON.stringify({ top, left }));
  }

  function loadMinimized() {
    return localStorage.getItem(MIN_KEY) === "1";
  }

  function saveMinimized(v) {
    localStorage.setItem(MIN_KEY, v ? "1" : "0");
  }

  function ensureHiddenFileInput(panel) {
    let input = document.getElementById(FILE_INPUT_ID);
    if (input) return input;

    input = document.createElement("input");
    input.id = FILE_INPUT_ID;
    input.type = "file";
    input.accept = ".json,application/json,text/plain";
    input.style.display = "none";
    panel.appendChild(input);
    return input;
  }

  function toastMini(panel, msg) {
    const old = panel.querySelector("#kc-toast");
    if (old) old.remove();

    const d = document.createElement("div");
    d.id = "kc-toast";
    d.style.position = "absolute";
    d.style.left = "10px";
    d.style.bottom = "10px";
    d.style.padding = "6px 8px";
    d.style.borderRadius = "8px";
    d.style.background = "rgba(0,0,0,0.55)";
    d.style.border = "1px solid rgba(255,255,255,0.12)";
    d.style.fontSize = "11px";
    d.style.pointerEvents = "none";
    d.textContent = msg;

    panel.appendChild(d);
    setTimeout(() => {
      try { d.remove(); } catch (e) {}
    }, 1800);
  }

  function copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
      return;
    } catch (e) {}
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
  }

  function buildFileName(ext) {
    const d = new Date();
    const y = String(d.getFullYear());
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `KC_Slots_Export_${y}${mo}${da}_${hh}${mm}${ss}.${ext}`;
  }

  function downloadTextFile(text, filename, mime) {
    try {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try { a.remove(); } catch (e) {}
        try { URL.revokeObjectURL(url); } catch (e) {}
      }, 250);
    } catch (e) {}
  }

  function makeDraggable(panel, handle) {
    if (!panel || !handle) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startTop = 0;
    let startLeft = 0;

    function onDown(e) {
      if (e && e.target && e.target.tagName === "BUTTON") return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startTop = rect.top;
      startLeft = rect.left;
      panel.style.right = "auto";
      panel.style.left = `${startLeft}px`;
      panel.style.top = `${startTop}px`;
      document.addEventListener("pointermove", onMove, true);
      document.addEventListener("pointerup", onUp, true);
    }

    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newTop = Math.max(0, startTop + dy);
      const newLeft = Math.max(0, startLeft + dx);
      panel.style.top = `${newTop}px`;
      panel.style.left = `${newLeft}px`;
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerup", onUp, true);
      const rect = panel.getBoundingClientRect();
      savePanelPos(Math.round(rect.top), Math.round(rect.left));
    }

    handle.addEventListener("pointerdown", onDown, true);
  }

  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;

    injectStyles();

    const wrap = document.createElement("div");
    wrap.id = PANEL_ID;

    wrap.innerHTML =
      `<div class="kc-head" id="kc-drag">
         <div>SLOTS PATTERN TALLY</div>
         <div class="kc-actions">
           <button type="button" id="kc-minbtn">MIN</button>
         </div>
       </div>
       <div class="kc-body">
         <div class="kc-row"><span>Current loss streak</span><span id="kc-streak">0</span></div>
         <div class="kc-row"><span>Tokens now</span><span id="kc-tokensnow">?</span></div>
         <div class="kc-row"><span>Status</span><span id="kc-status">Paused</span></div>
         <div class="kc-row"><span>Untracked spins</span><span id="kc-untracked">0</span></div>

         <div class="kc-mini" id="kc-hint"></div>
         <div class="kc-mini" id="kc-debug"></div>

         <div class="kc-sub">
           <div class="kc-title">Wins after X losses (X - WINS)</div>
           <div class="kc-list" id="kc-list-streak"></div>

           <div class="kc-title">Top Token Wins at Spin Start (Top 15)</div>
           <div class="kc-list" id="kc-list-tokens"></div>

           <div class="kc-title">Top Combo Wins (X losses + Token start) (Top 15)</div>
           <div class="kc-list" id="kc-list-combos"></div>

           <div class="kc-btns">
             <button type="button" id="kc-reset">RESET</button>
             <button type="button" id="kc-resetpos">RESET POS</button>
             <button type="button" id="kc-copyjson">COPY JSON</button>
             <button type="button" id="kc-copycsv">COPY CSV</button>
             <button type="button" id="kc-savejson">SAVE JSON</button>
             <button type="button" id="kc-savecsv">SAVE CSV</button>
           </div>
         </div>

         <div class="kc-io">
           <div class="kc-mini">IMPORT (MERGE ONLY): paste JSON here, then click IMPORT. Or use IMPORT FILE.</div>
           <textarea id="kc-importbox" placeholder="Paste JSON export here"></textarea>
           <div class="kc-btns">
             <button type="button" id="kc-importbtn">IMPORT</button>
             <button type="button" id="kc-importfile">IMPORT FILE</button>
             <button type="button" id="kc-clearimport">CLEAR</button>
           </div>
           <div class="kc-mini">Official page: <a href="${GF_URL}" target="_blank" rel="noreferrer">Greasy Fork</a></div>
         </div>
       </div>`;

    document.body.appendChild(wrap);

    const pos = loadPanelPos();
    if (pos) {
      wrap.style.top = `${pos.top}px`;
      wrap.style.left = `${pos.left}px`;
      wrap.style.right = "auto";
    }

    if (loadMinimized()) wrap.classList.add("kc-min");

    const fileInput = ensureHiddenFileInput(wrap);

    const minBtn = wrap.querySelector("#kc-minbtn");
    minBtn.textContent = wrap.classList.contains("kc-min") ? "MAX" : "MIN";
    minBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isMin = wrap.classList.toggle("kc-min");
      saveMinimized(isMin);
      minBtn.textContent = isMin ? "MAX" : "MIN";
    });

    wrap.querySelector("#kc-reset").addEventListener("click", () => {
      const st = defaultState();
      st.lastTokens = readTokens();
      saveState(st);
      render(st);
      toastMini(wrap, "Reset complete.");
    });

    wrap.querySelector("#kc-resetpos").addEventListener("click", () => {
      wrap.style.top = "140px";
      wrap.style.right = "14px";
      wrap.style.left = "auto";
      localStorage.removeItem(POS_KEY);
      toastMini(wrap, "Position reset.");
    });

    wrap.querySelector("#kc-copyjson").addEventListener("click", () => {
      const st = loadState();
      const payload = exportJson(st);
      copyToClipboard(payload);
      toastMini(wrap, "JSON copied.");
    });

    wrap.querySelector("#kc-copycsv").addEventListener("click", () => {
      const st = loadState();
      const csv = exportCsv(st);
      copyToClipboard(csv);
      toastMini(wrap, "CSV copied.");
    });

    wrap.querySelector("#kc-savejson").addEventListener("click", () => {
      const st = loadState();
      const payload = exportJson(st);
      downloadTextFile(payload, buildFileName("json"), "application/json");
      toastMini(wrap, "JSON saved.");
    });

    wrap.querySelector("#kc-savecsv").addEventListener("click", () => {
      const st = loadState();
      const csv = exportCsv(st);
      downloadTextFile(csv, buildFileName("csv"), "text/csv");
      toastMini(wrap, "CSV saved.");
    });

    wrap.querySelector("#kc-importbtn").addEventListener("click", () => {
      const box = wrap.querySelector("#kc-importbox");
      const raw = (box.value || "").trim();
      const res = importMerge(raw);
      if (res.ok) {
        toastMini(wrap, `Imported: merged ${res.mergedWins} wins.`);
        render(loadState());
      } else {
        toastMini(wrap, `Import failed: ${res.err}`);
      }
    });

    wrap.querySelector("#kc-importfile").addEventListener("click", () => {
      try { fileInput.value = ""; } catch (e) {}
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
      if (!f) return;

      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "").trim();
        const box = wrap.querySelector("#kc-importbox");
        box.value = text;
        const res = importMerge(text);
        if (res.ok) {
          toastMini(wrap, `Imported file: merged ${res.mergedWins} wins.`);
          render(loadState());
        } else {
          toastMini(wrap, `Import failed: ${res.err}`);
        }
      };
      reader.onerror = () => {
        toastMini(wrap, "Import failed: file read error.");
      };
      reader.readAsText(f);
    });

    wrap.querySelector("#kc-clearimport").addEventListener("click", () => {
      const box = wrap.querySelector("#kc-importbox");
      box.value = "";
      toastMini(wrap, "Cleared.");
    });

    makeDraggable(wrap, wrap.querySelector("#kc-drag"));
  }

  // =========================
  // EXPORT
  // =========================
  function exportJson(st) {
    const payload = {
      format: "KC_SLOTS_TALLY_EXPORT_V7",
      exportedAt: nowStamp(),
      winByStreak: st.winByStreak,
      winsByTokenStart: st.winsByTokenStart,
      spinsByTokenStart: st.spinsByTokenStart,
      winsByCombo: st.winsByCombo,
      spinsByCombo: st.spinsByCombo,
      totalWins: st.totalWins
    };

    // Extra safety: include tokenStats mirror for anyone who ever used that model
    const tokenStats = {};
    for (const [k, spinsV] of Object.entries(st.spinsByTokenStart || {})) {
      const spins = Number(spinsV) || 0;
      const wins = Number((st.winsByTokenStart || {})[k] || 0);
      if (spins > 0 || wins > 0) tokenStats[k] = { spins, wins };
    }
    payload.tokenStats = tokenStats;

    return JSON.stringify(payload, null, 2);
  }

  function exportCsv(st) {
    // CSV rows for 3 tables plus summary
    const lines = [];
    lines.push("table,key,wins,spins,win_pct,total_wins,total_spins");
    const totalWins = Number(st.totalWins) || sumMapValues(st.winByStreak);

    // Streak table
    const streakEntries = sortedHistogramEntries(st.winByStreak);
    for (const e of streakEntries) {
      const winPct = totalWins ? ((e.y / totalWins) * 100).toFixed(4) : "";
      lines.push(`streak,${e.x},${e.y},,${winPct},${totalWins},`);
    }

    // Token start table (all, not top 15)
    const tokenKeys = new Set([
      ...Object.keys(st.spinsByTokenStart || {}),
      ...Object.keys(st.winsByTokenStart || {})
    ]);
    const tokenArr = Array.from(tokenKeys).map(k => {
      const t = parseInt(k, 10);
      return { k, t };
    }).filter(o => Number.isFinite(o.t) && o.t >= 0).sort((a, b) => a.t - b.t);

    for (const o of tokenArr) {
      const wins = Number((st.winsByTokenStart || {})[o.k] || 0);
      const spins = Number((st.spinsByTokenStart || {})[o.k] || 0);
      const wr = spins ? ((wins / spins) * 100).toFixed(4) : "";
      const pctWins = totalWins ? ((wins / totalWins) * 100).toFixed(4) : "";
      lines.push(`token,${o.t},${wins},${spins},${wr},${totalWins},${pctWins}`);
    }

    // Combo table (all)
    const comboKeys = new Set([
      ...Object.keys(st.spinsByCombo || {}),
      ...Object.keys(st.winsByCombo || {})
    ]);
    const comboArr = Array.from(comboKeys).map(k => {
      const parts = String(k).split("|");
      const x = parseInt(parts[0], 10);
      const t = parseInt(parts[1], 10);
      return { k, x, t };
    }).filter(o => Number.isFinite(o.x) && o.x >= 0 && Number.isFinite(o.t) && o.t >= 0)
      .sort((a, b) => (a.x - b.x) || (a.t - b.t));

    for (const o of comboArr) {
      const wins = Number((st.winsByCombo || {})[o.k] || 0);
      const spins = Number((st.spinsByCombo || {})[o.k] || 0);
      const wr = spins ? ((wins / spins) * 100).toFixed(4) : "";
      const pctWins = totalWins ? ((wins / totalWins) * 100).toFixed(4) : "";
      lines.push(`combo,${o.x}+${o.t},${wins},${spins},${wr},${totalWins},${pctWins}`);
    }

    return lines.join("\n");
  }

  // =========================
  // IMPORT (MERGE ONLY)
  // =========================
  function importMerge(rawText) {
    if (!rawText) return { ok: false, err: "empty" };
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      return { ok: false, err: "invalid JSON" };
    }
    if (!parsed || typeof parsed !== "object") return { ok: false, err: "bad JSON object" };

    // Accept V7 export shape or direct state shape
    const incoming = normalizeState(parsed);

    // Also accept explicit export maps if present
    if (parsed.winByStreak && typeof parsed.winByStreak === "object") incoming.winByStreak = parsed.winByStreak;
    if (parsed.winsByTokenStart && typeof parsed.winsByTokenStart === "object") incoming.winsByTokenStart = parsed.winsByTokenStart;
    if (parsed.spinsByTokenStart && typeof parsed.spinsByTokenStart === "object") incoming.spinsByTokenStart = parsed.spinsByTokenStart;
    if (parsed.winsByCombo && typeof parsed.winsByCombo === "object") incoming.winsByCombo = parsed.winsByCombo;
    if (parsed.spinsByCombo && typeof parsed.spinsByCombo === "object") incoming.spinsByCombo = parsed.spinsByCombo;

    // Merge into current
    const st = loadState();

    const addedStreakWins = mergeNumberMap(st.winByStreak, incoming.winByStreak);
    mergeNumberMap(st.winsByTokenStart, incoming.winsByTokenStart);
    mergeNumberMap(st.spinsByTokenStart, incoming.spinsByTokenStart);
    mergeNumberMap(st.winsByCombo, incoming.winsByCombo);
    mergeNumberMap(st.spinsByCombo, incoming.spinsByCombo);

    st.totalWins = sumMapValues(st.winByStreak);

    saveState(st);
    return { ok: true, mergedWins: addedStreakWins };
  }

  // =========================
  // RENDER
  // =========================
  function render(st) {
    ensurePanel();

    const streakEl = document.getElementById("kc-streak");
    const tokensNowEl = document.getElementById("kc-tokensnow");
    const statusEl = document.getElementById("kc-status");
    const untrackedEl = document.getElementById("kc-untracked");

    const hintEl = document.getElementById("kc-hint");
    const debugEl = document.getElementById("kc-debug");

    const listStreak = document.getElementById("kc-list-streak");
    const listTokens = document.getElementById("kc-list-tokens");
    const listCombos = document.getElementById("kc-list-combos");

    const tokensNow = readTokens();

    if (streakEl) streakEl.textContent = String(st.currentLossStreak || 0);
    if (tokensNowEl) tokensNowEl.textContent = tokensNow !== null ? String(tokensNow) : "?";
    if (statusEl) statusEl.textContent = isVisibleTab() ? "Active" : "Paused";
    if (untrackedEl) untrackedEl.textContent = String(st.untrackedSpins || 0);

    const hotKeys = getHotStreakKeys(st.winByStreak);
    const isHotNow = hotKeys.includes(String(st.currentLossStreak));

    if (hintEl) {
      if (!st.totalWins) {
        hintEl.textContent = "Log some wins to build your pattern tables.";
      } else {
        const hotText = hotKeys.length ? hotKeys.join(", ") : "none";
        hintEl.innerHTML = isHotNow
          ? `<span class="kc-hot">HOT (based on your log):</span> Current loss streak matches one of your top ${HOT_TOP_N} streak lengths: ${hotText}`
          : `Top ${HOT_TOP_N} streak lengths (based on your log): ${hotText}`;
      }
    }

    if (debugEl) {
      const d = st.debugLast || {};
      if (d.tokensFrom !== null && d.tokensTo !== null) {
        const wonText = (d.won !== null) ? `$${Number(d.won).toLocaleString()}` : "?";
        debugEl.textContent = `Last spin: Tokens ${d.tokensFrom} -> ${d.tokensTo} | Won ${wonText} | ${d.when || ""}`;
      } else {
        debugEl.textContent = "Debug: waiting for first detected spin...";
      }
    }

    if (listStreak) {
      listStreak.innerHTML = "";
      const entries = sortedHistogramEntries(st.winByStreak);
      if (!entries.length) {
        const d = document.createElement("div");
        d.className = "kc-mini";
        d.textContent = "No wins logged yet.";
        listStreak.appendChild(d);
      } else {
        const slice = entries.slice(0, MAX_ROWS);
        for (const e of slice) {
          const row = document.createElement("div");
          row.className = "kc-item";
          if (String(e.x) === String(st.currentLossStreak)) row.classList.add("kc-current");
          row.innerHTML = `<span>${e.x} - ${e.y}</span><span></span>`;
          listStreak.appendChild(row);
        }
      }
    }

    if (listTokens) {
      listTokens.innerHTML = "";
      const rows = topTokenStarts(st, TOP_TOKENS_N);
      if (!rows.length) {
        const d = document.createElement("div");
        d.className = "kc-mini";
        d.textContent = "No token-start wins logged yet.";
        listTokens.appendChild(d);
      } else {
        for (const r of rows) {
          const pctWins = st.totalWins ? ((r.wins / st.totalWins) * 100).toFixed(1) : "0.0";
          const wr = r.spins ? ((r.wins / r.spins) * 100).toFixed(1) : "0.0";
          const row = document.createElement("div");
          row.className = "kc-item";
          row.innerHTML = `<span>Tokens: ${r.t}</span><span>${r.wins} wins @ ${pctWins}% | WR: ${wr}% (${r.wins}/${r.spins || 0})</span>`;
          listTokens.appendChild(row);
        }
      }
    }

    if (listCombos) {
      listCombos.innerHTML = "";
      const rows = topCombos(st, TOP_COMBOS_N);
      if (!rows.length) {
        const d = document.createElement("div");
        d.className = "kc-mini";
        d.textContent = "No combo wins logged yet.";
        listCombos.appendChild(d);
      } else {
        for (const r of rows) {
          const pctWins = st.totalWins ? ((r.wins / st.totalWins) * 100).toFixed(1) : "0.0";
          const wr = r.spins ? ((r.wins / r.spins) * 100).toFixed(1) : "0.0";
          const row = document.createElement("div");
          row.className = "kc-item";
          row.innerHTML = `<span>X:${r.x} + T:${r.t}</span><span>${r.wins} wins @ ${pctWins}% | WR: ${wr}% (${r.wins}/${r.spins || 0})</span>`;
          listCombos.appendChild(row);
        }
      }
    }

    updateInlineTokenStats(st);
  }

  // =========================
  // SPIN PROCESSING
  // =========================
  function applyOutcome(st, tokensFrom, tokensTo, wonAmount, tokenStart, xLossesBefore) {
    const delta = tokensFrom - tokensTo;
    if (delta > 1) st.untrackedSpins += (delta - 1);

    bumpSpinTokenStart(st, tokenStart);
    bumpSpinCombo(st, xLossesBefore, tokenStart);

    if (wonAmount !== null && wonAmount > 0) {
      recordWin(st);
      bumpWinTokenStart(st, tokenStart);
      bumpWinCombo(st, xLossesBefore, tokenStart);
    } else {
      recordLoss(st);
    }

    st.debugLast = {
      tokensFrom,
      tokensTo,
      won: wonAmount,
      when: nowStamp()
    };
  }

  function processSpinIfAny() {
    if (!isVisibleTab()) return;

    const st = loadState();
    const tokensNow = readTokens();
    if (tokensNow === null) return;

    if (st.lastTokens === null) {
      st.lastTokens = tokensNow;
      saveState(st);
      render(st);
      return;
    }

    if (tokensNow < st.lastTokens) {
      const from = st.lastTokens;
      const to = tokensNow;

      const tokenStart = from;
      const xLossesBefore = st.currentLossStreak;

      const wonImmediate = readWon();
      setTimeout(() => {
        if (!isVisibleTab()) return;

        const st2 = loadState();
        const wonDelayed = readWon();
        const wonFinal = (wonDelayed !== null ? wonDelayed : wonImmediate);

        if (st2.lastTokens !== from) return;

        applyOutcome(st2, from, to, wonFinal, tokenStart, xLossesBefore);

        st2.lastTokens = to;
        saveState(st2);
        render(st2);
      }, WON_REREAD_DELAY_MS);

      return;
    }

    if (tokensNow > st.lastTokens) {
      st.lastTokens = tokensNow;
      saveState(st);
      render(st);
    }
  }

  // =========================
  // OBSERVERS
  // =========================
  let valueObserver = null;
  let rebinderObserver = null;
  let rebindTimer = null;

  function disconnectAll() {
    try { if (valueObserver) valueObserver.disconnect(); } catch (e) {}
    try { if (rebinderObserver) rebinderObserver.disconnect(); } catch (e) {}
    valueObserver = null;
    rebinderObserver = null;
    if (rebindTimer) {
      clearTimeout(rebindTimer);
      rebindTimer = null;
    }
  }

  function bindValueObserver() {
    const tokensEl = document.getElementById("tokens");
    const wonEl = document.getElementById("moneyWon");

    const fallbackRoot = document.querySelector(".slots-main-wrap") || document.querySelector(".slots-area-wrap") || document.body;

    const targets = [];
    if (tokensEl) targets.push(tokensEl);
    if (wonEl) targets.push(wonEl);
    if (!targets.length && fallbackRoot) targets.push(fallbackRoot);

    if (!targets.length) return;

    valueObserver = new MutationObserver(() => {
      processSpinIfAny();
    });

    for (const t of targets) {
      valueObserver.observe(t, { childList: true, subtree: true, characterData: true });
    }

    processSpinIfAny();
  }

  function scheduleRebind() {
    if (rebindTimer) return;
    rebindTimer = setTimeout(() => {
      rebindTimer = null;
      if (!isVisibleTab()) return;
      try { if (valueObserver) valueObserver.disconnect(); } catch (e) {}
      valueObserver = null;
      bindValueObserver();
    }, 250);
  }

  function startRebinder() {
    const root = document.body;
    if (!root) return;

    rebinderObserver = new MutationObserver(() => {
      if (!isVisibleTab()) return;
      scheduleRebind();
    });

    rebinderObserver.observe(root, { childList: true, subtree: true });
  }

  // =========================
  // INIT
  // =========================
  function init() {
    if (!/page\.php\?sid=slots/i.test(location.href)) return;

    const st = loadState();
    ensurePanel();

    const t = readTokens();
    if (st.lastTokens === null && t !== null) {
      st.lastTokens = t;
      saveState(st);
    }

    render(loadState());

    function onVisChange() {
      if (!isVisibleTab()) {
        disconnectAll();
        render(loadState());
        return;
      }
      disconnectAll();
      bindValueObserver();
      startRebinder();
      render(loadState());
    }

    document.addEventListener("visibilitychange", onVisChange, true);
    onVisChange();
  }

  init();
})();

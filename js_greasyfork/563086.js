// ==UserScript==
// @name         Torn - Slots Pattern Tally
// @namespace    https://www.torn.com/
// @version      01.18.2026.10.05
// @description  Tracks Slots spins by watching Tokens decrease and reading Won amount. Builds: wins-after-loss-streak histogram, token-start wins table, combo table (loss streak + token start). Adds export/import (merge-only) via JSON + CSV. Panel is draggable (header) + minimizable. Visible-tab safe.
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
Version: 01.18.2026.10.05
Author: KillerCleat [2842410]

Rule safety:
- Uses ONLY data from the Slots page you loaded and are currently viewing (DOM).
- Makes NO additional requests to Torn.
- Visible-tab safe:
  - Does not process results unless document.visibilityState === "visible".
- Does not auto-click, bet, spin, or interact with gameplay.

Panel UX:
- Draggable by header only (no accidental drags).
- Minimize toggles to: header + 4 stat lines (loss streak, tokens, status, untracked).
- Position and minimized state persist in localStorage.
- Reset position button to snap to default.

Export / Import:
- EXPORT JSON: full tallies in JSON (shareable between users).
- EXPORT CSV: single CSV containing 3 tables with a "table" column for Sheets/Excel.
- IMPORT (MERGE ONLY): merges another user's JSON into your tallies.
*/

(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  const STORAGE_KEY = "KC_SLOTS_HISTOGRAM_V7";
  const PANEL_ID = "kc-slots-hist-panel";
  const STYLE_ID = "kc-slots-hist-style";

  const UI_KEY = "KC_SLOTS_PANEL_UI_V1"; // position + minimized

  const HOT_TOP_N = 3;
  const MAX_ROWS = 30;

  const TOP_TOKENS_N = 15;
  const TOP_COMBOS_N = 15;

  // Delay re-read in case Won updates a fraction after Tokens changes
  const WON_REREAD_DELAY_MS = 200;

  // Default panel position (top-right)
  const DEFAULT_TOP_PX = 140;
  const DEFAULT_RIGHT_PX = 14;

  // =========================
  // VISIBLE TAB GATING
  // =========================
  function isVisibleTab() {
    return document.visibilityState === "visible";
  }

  // =========================
  // UI STATE (panel pos + minimized)
  // =========================
  function loadUiState() {
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (!raw) throw new Error("empty");
      const o = JSON.parse(raw);
      if (!o || typeof o !== "object") throw new Error("bad");

      const out = {
        minimized: !!o.minimized,
        // If user drags, we store left/top and set right = null
        top: Number.isFinite(o.top) ? o.top : DEFAULT_TOP_PX,
        left: Number.isFinite(o.left) ? o.left : null,
        right: Number.isFinite(o.right) ? o.right : DEFAULT_RIGHT_PX
      };
      return out;
    } catch (e) {
      return { minimized: false, top: DEFAULT_TOP_PX, left: null, right: DEFAULT_RIGHT_PX };
    }
  }

  function saveUiState(ui) {
    localStorage.setItem(UI_KEY, JSON.stringify(ui));
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function applyPanelPositionFromUi(panel, ui) {
    if (!panel) return;

    panel.style.top = `${Number.isFinite(ui.top) ? ui.top : DEFAULT_TOP_PX}px`;

    if (ui.left !== null && Number.isFinite(ui.left)) {
      panel.style.left = `${ui.left}px`;
      panel.style.right = "auto";
    } else {
      panel.style.right = `${Number.isFinite(ui.right) ? ui.right : DEFAULT_RIGHT_PX}px`;
      panel.style.left = "auto";
    }
  }

  function resetPanelPosition(panel) {
    const ui = { minimized: loadUiState().minimized, top: DEFAULT_TOP_PX, left: null, right: DEFAULT_RIGHT_PX };
    saveUiState(ui);
    applyPanelPositionFromUi(panel, ui);
  }

  function setMinimized(panel, minimized) {
    const ui = loadUiState();
    ui.minimized = !!minimized;
    saveUiState(ui);

    const body = panel.querySelector(".kc-body");
    const mini = panel.querySelector(".kc-miniwrap");
    const btn = panel.querySelector("#kc-minbtn");

    if (ui.minimized) {
      if (body) body.classList.add("kc-hidden");
      if (mini) mini.classList.remove("kc-hidden");
      if (btn) btn.textContent = "MAX";
    } else {
      if (body) body.classList.remove("kc-hidden");
      if (mini) mini.classList.add("kc-hidden");
      if (btn) btn.textContent = "MIN";
    }
  }

  // =========================
  // STATE
  // =========================
  function blankState() {
    return {
      winByStreak: {},
      currentLossStreak: 0,
      totalWins: 0,

      winsByTokenStart: {},
      spinsByTokenStart: {},
      totalSpinsTracked: 0,

      winsByCombo: {},
      spinsByCombo: {},

      lastTokens: null,
      untrackedSpins: 0,
      debugLast: { tokensFrom: null, tokensTo: null, won: null, when: "" }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) throw new Error("empty");
      const st = JSON.parse(raw);
      if (!st || typeof st !== "object") throw new Error("bad");

      st.winByStreak = st.winByStreak && typeof st.winByStreak === "object" ? st.winByStreak : {};
      st.currentLossStreak = Number.isFinite(st.currentLossStreak) ? st.currentLossStreak : 0;
      st.totalWins = Number.isFinite(st.totalWins) ? st.totalWins : 0;

      st.winsByTokenStart = st.winsByTokenStart && typeof st.winsByTokenStart === "object" ? st.winsByTokenStart : {};
      st.spinsByTokenStart = st.spinsByTokenStart && typeof st.spinsByTokenStart === "object" ? st.spinsByTokenStart : {};
      st.totalSpinsTracked = Number.isFinite(st.totalSpinsTracked) ? st.totalSpinsTracked : 0;

      st.winsByCombo = st.winsByCombo && typeof st.winsByCombo === "object" ? st.winsByCombo : {};
      st.spinsByCombo = st.spinsByCombo && typeof st.spinsByCombo === "object" ? st.spinsByCombo : {};

      st.lastTokens = Number.isFinite(st.lastTokens) ? st.lastTokens : null;
      st.untrackedSpins = Number.isFinite(st.untrackedSpins) ? st.untrackedSpins : 0;

      st.debugLast = st.debugLast && typeof st.debugLast === "object" ? st.debugLast : {};
      st.debugLast.tokensFrom = Number.isFinite(st.debugLast.tokensFrom) ? st.debugLast.tokensFrom : null;
      st.debugLast.tokensTo = Number.isFinite(st.debugLast.tokensTo) ? st.debugLast.tokensTo : null;
      st.debugLast.won = Number.isFinite(st.debugLast.won) ? st.debugLast.won : null;
      st.debugLast.when = typeof st.debugLast.when === "string" ? st.debugLast.when : "";

      return st;
    } catch (e) {
      return blankState();
    }
  }

  function saveState(st) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  }

  function nowStamp() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss} TCT`;
  }

  function fileStamp() {
    const d = new Date();
    const yy = String(d.getFullYear());
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${yy}${mo}${da}_${hh}${mm}${ss}`;
  }

  // =========================
  // PARSERS
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

  // =========================
  // VALUE READS
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
    const root =
      document.querySelector(".slots-main-wrap") ||
      document.querySelector(".slots-area-wrap") ||
      document.body;

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
  // HISTOGRAM
  // =========================
  function recordLoss(st) {
    st.currentLossStreak += 1;
  }

  function recordWin(st) {
    const x = st.currentLossStreak;
    const key = String(x);
    st.winByStreak[key] = (st.winByStreak[key] || 0) + 1;
    st.totalWins += 1;
    st.currentLossStreak = 0;
  }

  function sortedHistogramEntries(winByStreak) {
    return Object.entries(winByStreak || {})
      .map(([k, v]) => ({ x: parseInt(k, 10), y: Number(v) }))
      .filter(o => Number.isFinite(o.x) && o.x >= 0 && Number.isFinite(o.y) && o.y > 0)
      .sort((a, b) => (b.y - a.y) || (a.x - b.x));
  }

  function getHotStreakKeys(winByStreak) {
    return sortedHistogramEntries(winByStreak).slice(0, HOT_TOP_N).map(o => String(o.x));
  }

  // =========================
  // TOKEN-START TABLE
  // =========================
  function bumpSpinAtTokenStart(st, tokensFrom) {
    const key = String(tokensFrom);
    st.spinsByTokenStart[key] = (st.spinsByTokenStart[key] || 0) + 1;
    st.totalSpinsTracked += 1;
  }

  function bumpWinAtTokenStart(st, tokensFrom) {
    const key = String(tokensFrom);
    st.winsByTokenStart[key] = (st.winsByTokenStart[key] || 0) + 1;
  }

  function sortedTokenStartEntries(st) {
    const winsObj = st.winsByTokenStart || {};
    const spinsObj = st.spinsByTokenStart || {};
    return Object.keys(winsObj)
      .map(k => {
        const token = parseInt(k, 10);
        const wins = Number(winsObj[k] || 0);
        const spins = Number(spinsObj[k] || 0);
        return { token, wins, spins };
      })
      .filter(o => Number.isFinite(o.token) && o.token >= 0 && Number.isFinite(o.wins) && o.wins > 0)
      .sort((a, b) => (b.wins - a.wins) || (a.token - b.token));
  }

  // =========================
  // COMBO TABLE (X|T)
  // =========================
  function comboKey(x, t) {
    return `${x}|${t}`;
  }

  function bumpSpinCombo(st, x, t) {
    const k = comboKey(x, t);
    st.spinsByCombo[k] = (st.spinsByCombo[k] || 0) + 1;
  }

  function bumpWinCombo(st, x, t) {
    const k = comboKey(x, t);
    st.winsByCombo[k] = (st.winsByCombo[k] || 0) + 1;
  }

  function getComboEntriesForX(st, x) {
    const winsObj = st.winsByCombo || {};
    const spinsObj = st.spinsByCombo || {};
    const out = [];

    for (const k of Object.keys(winsObj)) {
      const parts = k.split("|");
      if (parts.length !== 2) continue;
      const kx = parseInt(parts[0], 10);
      const kt = parseInt(parts[1], 10);
      if (!Number.isFinite(kx) || !Number.isFinite(kt)) continue;
      if (kx !== x) continue;

      const wins = Number(winsObj[k] || 0);
      if (!Number.isFinite(wins) || wins <= 0) continue;

      const spins = Number(spinsObj[k] || 0);
      out.push({ x: kx, token: kt, wins, spins });
    }

    out.sort((a, b) => (b.wins - a.wins) || (a.token - b.token));
    return out;
  }

  // =========================
  // % helpers
  // =========================
  function pct(n, d) {
    if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return 0;
    return (n / d) * 100;
  }

  // =========================
  // EXPORT / IMPORT (MERGE ONLY)
  // =========================
  function sanitizeCountObject(obj) {
    const out = {};
    if (!obj || typeof obj !== "object") return out;
    for (const [k, v] of Object.entries(obj)) {
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0) continue;
      out[String(k)] = Math.floor(n);
    }
    return out;
  }

  function sumCounts(obj) {
    if (!obj || typeof obj !== "object") return 0;
    let s = 0;
    for (const v of Object.values(obj)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) s += n;
    }
    return s;
  }

  function buildExportPayload(st) {
    return {
      meta: {
        exporter: "KillerCleat [2842410]",
        exportWhen: nowStamp(),
        storageKey: STORAGE_KEY,
        ui: { minimized: loadUiState().minimized }
      },
      data: {
        winByStreak: sanitizeCountObject(st.winByStreak),
        winsByTokenStart: sanitizeCountObject(st.winsByTokenStart),
        spinsByTokenStart: sanitizeCountObject(st.spinsByTokenStart),
        winsByCombo: sanitizeCountObject(st.winsByCombo),
        spinsByCombo: sanitizeCountObject(st.spinsByCombo)
      }
    };
  }

  function exportJSONText() {
    const st = loadState();
    const payload = buildExportPayload(st);
    return JSON.stringify(payload, null, 2);
  }

  function csvEscape(s) {
    const str = String(s ?? "");
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  }

  function exportCSVText() {
    const st = loadState();
    const totalWins = sumCounts(st.winByStreak);

    const lines = [];
    lines.push([
      "table",
      "loss_streak",
      "token_start",
      "spins",
      "wins",
      "win_rate_pct",
      "share_of_total_wins_pct"
    ].map(csvEscape).join(","));

    // Histogram
    for (const [k, v] of Object.entries(sanitizeCountObject(st.winByStreak))) {
      const x = parseInt(k, 10);
      const wins = Number(v);
      const share = pct(wins, totalWins);
      lines.push([
        "histogram",
        Number.isFinite(x) ? x : "",
        "",
        "",
        wins,
        "",
        share.toFixed(4)
      ].map(csvEscape).join(","));
    }

    // Token-start
    const spinsTS = sanitizeCountObject(st.spinsByTokenStart);
    const winsTS = sanitizeCountObject(st.winsByTokenStart);
    const tokenKeys = new Set([...Object.keys(spinsTS), ...Object.keys(winsTS)]);
    const tokenRows = [];
    for (const tk of tokenKeys) {
      const t = parseInt(tk, 10);
      if (!Number.isFinite(t)) continue;
      const spins = Number(spinsTS[tk] || 0);
      const wins = Number(winsTS[tk] || 0);
      if (spins <= 0 && wins <= 0) continue;
      const wr = pct(wins, spins);
      const share = pct(wins, totalWins);
      tokenRows.push({ t, spins, wins, wr, share });
    }
    tokenRows.sort((a, b) => (b.wins - a.wins) || (a.t - b.t));
    for (const r of tokenRows) {
      lines.push([
        "token_start",
        "",
        r.t,
        r.spins,
        r.wins,
        r.wr.toFixed(4),
        r.share.toFixed(4)
      ].map(csvEscape).join(","));
    }

    // Combo
    const spinsC = sanitizeCountObject(st.spinsByCombo);
    const winsC = sanitizeCountObject(st.winsByCombo);
    const comboKeys = new Set([...Object.keys(spinsC), ...Object.keys(winsC)]);
    const comboRows = [];
    for (const ck of comboKeys) {
      const parts = String(ck).split("|");
      if (parts.length !== 2) continue;
      const x = parseInt(parts[0], 10);
      const t = parseInt(parts[1], 10);
      if (!Number.isFinite(x) || !Number.isFinite(t)) continue;
      const spins = Number(spinsC[ck] || 0);
      const wins = Number(winsC[ck] || 0);
      if (spins <= 0 && wins <= 0) continue;
      const wr = pct(wins, spins);
      const share = pct(wins, totalWins);
      comboRows.push({ x, t, spins, wins, wr, share });
    }
    comboRows.sort((a, b) => (b.wins - a.wins) || (a.x - b.x) || (a.t - b.t));
    for (const r of comboRows) {
      lines.push([
        "combo",
        r.x,
        r.t,
        r.spins,
        r.wins,
        r.wr.toFixed(4),
        r.share.toFixed(4)
      ].map(csvEscape).join(","));
    }

    return lines.join("\n");
  }

  function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function mergeCountsInto(targetObj, incomingObj) {
    const inc = sanitizeCountObject(incomingObj);
    for (const [k, v] of Object.entries(inc)) {
      targetObj[k] = (Number(targetObj[k] || 0) + Number(v));
    }
  }

  function recomputeTotals(st) {
    st.totalWins = sumCounts(st.winByStreak);
    st.totalSpinsTracked = sumCounts(st.spinsByTokenStart);
  }

  function tryParseImportJSON(raw) {
    const txt = String(raw || "").trim();
    if (!txt) return { ok: false, err: "Empty import." };
    let obj;
    try {
      obj = JSON.parse(txt);
    } catch (e) {
      return { ok: false, err: "Invalid JSON." };
    }
    if (!obj || typeof obj !== "object") return { ok: false, err: "Invalid JSON structure." };
    if (!obj.data || typeof obj.data !== "object") return { ok: false, err: "Missing data section." };

    const d = obj.data;

    return {
      ok: true,
      data: {
        winByStreak: sanitizeCountObject(d.winByStreak),
        winsByTokenStart: sanitizeCountObject(d.winsByTokenStart),
        spinsByTokenStart: sanitizeCountObject(d.spinsByTokenStart),
        winsByCombo: sanitizeCountObject(d.winsByCombo),
        spinsByCombo: sanitizeCountObject(d.spinsByCombo)
      },
      meta: obj.meta || {}
    };
  }

  function setImportStatus(msg, isBad) {
    const el = document.getElementById("kc-io-status");
    if (!el) return;
    el.textContent = msg;
    if (isBad) el.classList.add("kc-bad");
    else el.classList.remove("kc-bad");
  }

  function doImportMergeFromText(raw) {
    const parsed = tryParseImportJSON(raw);
    const st = loadState();

    if (!parsed.ok) {
      setImportStatus(`IMPORT FAILED: ${parsed.err}`, true);
      return;
    }

    const incoming = parsed.data;

    mergeCountsInto(st.winByStreak, incoming.winByStreak);
    mergeCountsInto(st.winsByTokenStart, incoming.winsByTokenStart);
    mergeCountsInto(st.spinsByTokenStart, incoming.spinsByTokenStart);
    mergeCountsInto(st.winsByCombo, incoming.winsByCombo);
    mergeCountsInto(st.spinsByCombo, incoming.spinsByCombo);

    recomputeTotals(st);
    saveState(st);
    render(st);

    setImportStatus("IMPORT OK: Data merged.", false);
  }

  // =========================
  // UI
  // =========================
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const css =
`#${PANEL_ID}{
  position: fixed;
  width: 360px;
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
  align-items: center;
  justify-content: space-between;
  cursor: move;
  user-select: none;
}
#${PANEL_ID} .kc-head .kc-title{ display:flex; align-items:center; gap:8px; }
#${PANEL_ID} .kc-head .kc-actions{ display:flex; gap:8px; }
#${PANEL_ID} .kc-body{ padding: 10px; font-size: 12px; }
#${PANEL_ID} .kc-miniwrap{ padding: 10px; font-size: 12px; }
#${PANEL_ID} .kc-row{
  display:flex; justify-content: space-between; gap: 10px; padding: 3px 0;
}
#${PANEL_ID} .kc-mini{
  margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.75); line-height: 1.3;
}
#${PANEL_ID} .kc-hot{ font-weight: 700; }
#${PANEL_ID} .kc-sub{
  margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.10);
}
#${PANEL_ID} .kc-list{
  margin-top: 8px; max-height: 170px; overflow: auto; padding-right: 4px;
  font-variant-numeric: tabular-nums;
}
#${PANEL_ID} .kc-item{
  display:flex; justify-content: space-between; gap: 10px;
  padding: 6px 8px; border: 1px solid rgba(255,255,255,0.10);
  border-radius: 8px; margin-bottom: 6px;
  background: rgba(255,255,255,0.06);
}
#${PANEL_ID} .kc-item.kc-current{
  border: 2px solid rgba(255,255,255,0.60);
  background: rgba(255,255,255,0.10);
}
#${PANEL_ID} .kc-btns{ display:flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; margin-top: 8px; }
#${PANEL_ID} button{
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  color:#fff; padding: 6px 8px; border-radius: 8px;
  cursor: pointer; font-weight: 700; font-size: 11px;
}
#${PANEL_ID} button:hover{ background: rgba(255,255,255,0.12); }
#${PANEL_ID} textarea{
  width: 100%;
  min-height: 90px;
  resize: vertical;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.35);
  color: #fff;
  padding: 8px;
  font-family: Consolas, Menlo, Monaco, monospace;
  font-size: 11px;
  box-sizing: border-box;
}
#${PANEL_ID} .kc-statusline{
  margin-top: 6px;
  font-size: 11px;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
}
#${PANEL_ID} .kc-statusline.kc-bad{ border-color: rgba(255,120,120,0.55); }
#${PANEL_ID} .kc-hidden{ display:none; }`;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;

    injectStyles();

    const wrap = document.createElement("div");
    wrap.id = PANEL_ID;

    wrap.innerHTML =
      `<div class="kc-head" id="kc-drag-handle">
         <div class="kc-title">SLOTS PATTERN TALLY</div>
         <div class="kc-actions">
           <button type="button" id="kc-minbtn" title="Minimize/Maximize">MIN</button>
           <button type="button" id="kc-resetpos" title="Reset position">POS</button>
         </div>
       </div>

       <!-- MINIMIZED VIEW: header + 4 stat lines -->
       <div class="kc-miniwrap kc-hidden" id="kc-miniwrap">
         <div class="kc-row"><span>Current loss streak</span><span id="kc-streak-mini">0</span></div>
         <div class="kc-row"><span>Current tokens</span><span id="kc-curtokens-mini">?</span></div>
         <div class="kc-row"><span>Status</span><span id="kc-status-mini">Paused</span></div>
         <div class="kc-row"><span>Untracked spins</span><span id="kc-untracked-mini">0</span></div>
       </div>

       <!-- FULL VIEW -->
       <div class="kc-body" id="kc-body">
         <div class="kc-row"><span>Current loss streak</span><span id="kc-streak">0</span></div>
         <div class="kc-row"><span>Current tokens</span><span id="kc-curtokens">?</span></div>
         <div class="kc-row"><span>Status</span><span id="kc-status">Paused</span></div>
         <div class="kc-row"><span>Untracked spins</span><span id="kc-untracked">0</span></div>

         <div class="kc-mini" id="kc-hint"></div>
         <div class="kc-mini" id="kc-debug"></div>

         <div class="kc-sub">
           <div style="font-weight:700;">Wins after X losses (X - WINS)</div>
           <div class="kc-list" id="kc-list"></div>
         </div>

         <div class="kc-sub">
           <div style="font-weight:700;">Top Token Counts at Spin Start (Top 15)</div>
           <div class="kc-mini" id="kc-tokenhint"></div>
           <div class="kc-list" id="kc-tokens-list"></div>
         </div>

         <div class="kc-sub">
           <div style="font-weight:700;">Combo: Current streak X + TokenStart T (Top 15)</div>
           <div class="kc-mini" id="kc-combohint"></div>
           <div class="kc-list" id="kc-combos-list"></div>
         </div>

         <div class="kc-sub">
           <div style="font-weight:700;">Export / Import (Merge Only)</div>

           <div class="kc-btns">
             <button type="button" id="kc-export-json">EXPORT JSON</button>
             <button type="button" id="kc-export-csv">EXPORT CSV</button>
             <button type="button" id="kc-toggle-io">SHOW IO BOX</button>
             <button type="button" id="kc-load-file">LOAD JSON FILE</button>
             <button type="button" id="kc-import-merge">IMPORT (MERGE)</button>
             <button type="button" id="kc-reset">RESET</button>
           </div>

           <input type="file" id="kc-file" accept="application/json,.json" class="kc-hidden" />

           <div id="kc-io-wrap" class="kc-hidden" style="margin-top:8px;">
             <textarea id="kc-io-text" placeholder="Paste exported JSON here. You can also click EXPORT JSON to generate it. Then click IMPORT (MERGE)."></textarea>
             <div class="kc-mini">Tip: For Sheets, use EXPORT CSV and import the file. Use the 'table' column to filter histogram/token_start/combo.</div>
             <div id="kc-io-status" class="kc-statusline">Ready.</div>
           </div>
         </div>
       </div>`;

    document.body.appendChild(wrap);

    // Apply saved position + minimized state
    const ui = loadUiState();
    applyPanelPositionFromUi(wrap, ui);
    setMinimized(wrap, ui.minimized);

    // Header buttons
    wrap.querySelector("#kc-minbtn").addEventListener("click", () => {
      const panel = document.getElementById(PANEL_ID);
      if (!panel) return;
      const uiNow = loadUiState();
      setMinimized(panel, !uiNow.minimized);
    });

    wrap.querySelector("#kc-resetpos").addEventListener("click", () => {
      const panel = document.getElementById(PANEL_ID);
      if (!panel) return;
      resetPanelPosition(panel);
    });

    // Drag by header only
    bindDragBehavior(wrap);

    // Reset data
    wrap.querySelector("#kc-reset").addEventListener("click", () => {
      const st = blankState();
      st.lastTokens = readTokens();
      saveState(st);
      render(st);
      setImportStatus("Ready.", false);
    });

    // Export JSON
    wrap.querySelector("#kc-export-json").addEventListener("click", () => {
      const txt = exportJSONText();
      const area = document.getElementById("kc-io-text");
      const ioWrap = document.getElementById("kc-io-wrap");
      if (ioWrap) ioWrap.classList.remove("kc-hidden");
      if (area) area.value = txt;

      const fn = `KC_Slots_Export_${fileStamp()}.json`;
      downloadText(fn, txt, "application/json");
      setImportStatus("EXPORT OK: JSON downloaded and copied into IO box.", false);
    });

    // Export CSV
    wrap.querySelector("#kc-export-csv").addEventListener("click", () => {
      const csv = exportCSVText();
      const fn = `KC_Slots_Export_${fileStamp()}.csv`;
      downloadText(fn, csv, "text/csv");
      setImportStatus("EXPORT OK: CSV downloaded.", false);
    });

    // Toggle IO box
    wrap.querySelector("#kc-toggle-io").addEventListener("click", () => {
      const ioWrap = document.getElementById("kc-io-wrap");
      const btn = document.getElementById("kc-toggle-io");
      if (!ioWrap) return;
      const isHidden = ioWrap.classList.contains("kc-hidden");
      if (isHidden) {
        ioWrap.classList.remove("kc-hidden");
        if (btn) btn.textContent = "HIDE IO BOX";
      } else {
        ioWrap.classList.add("kc-hidden");
        if (btn) btn.textContent = "SHOW IO BOX";
      }
    });

    // Load file
    wrap.querySelector("#kc-load-file").addEventListener("click", () => {
      const input = document.getElementById("kc-file");
      if (!input) return;
      input.value = "";
      input.click();
    });

    // Import merge
    wrap.querySelector("#kc-import-merge").addEventListener("click", () => {
      const area = document.getElementById("kc-io-text");
      const txt = area ? area.value : "";
      doImportMergeFromText(txt);
    });

    // File load -> fill textarea
    const fileInput = wrap.querySelector("#kc-file");
    if (fileInput) {
      fileInput.addEventListener("change", (ev) => {
        const f = ev.target.files && ev.target.files[0];
        if (!f) return;

        const reader = new FileReader();
        reader.onload = () => {
          const ioWrap = document.getElementById("kc-io-wrap");
          const area = document.getElementById("kc-io-text");
          if (ioWrap) ioWrap.classList.remove("kc-hidden");
          if (area) area.value = String(reader.result || "");
          setImportStatus("FILE LOADED: Click IMPORT (MERGE) to merge it.", false);
        };
        reader.onerror = () => {
          setImportStatus("FILE ERROR: Could not read file.", true);
        };
        reader.readAsText(f);
      });
    }

    // If window resizes, make sure panel isn't outside viewport
    window.addEventListener("resize", () => keepPanelInViewport(wrap), { passive: true });
  }

  function keepPanelInViewport(panel) {
    if (!panel) return;

    const ui = loadUiState();
    const rect = panel.getBoundingClientRect();

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // Only handle left/top based positioning (dragged panels)
    if (ui.left === null || !Number.isFinite(ui.left)) return;

    let newLeft = ui.left;
    let newTop = ui.top;

    // Clamp so at least header stays visible
    const headerH = 44;
    newLeft = clamp(newLeft, 0, Math.max(0, vw - rect.width));
    newTop = clamp(newTop, 0, Math.max(0, vh - headerH));

    if (newLeft !== ui.left || newTop !== ui.top) {
      ui.left = newLeft;
      ui.top = newTop;
      ui.right = null;
      saveUiState(ui);
      applyPanelPositionFromUi(panel, ui);
    }
  }

  function bindDragBehavior(panel) {
    const handle = panel.querySelector("#kc-drag-handle");
    if (!handle) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    function getPanelLeftTop() {
      const rect = panel.getBoundingClientRect();
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }

    function onMouseDown(e) {
      if (e.button !== 0) return; // left click only
      // Don't start drag if clicking on buttons in header
      const target = e.target;
      if (target && target.tagName === "BUTTON") return;

      const pos = getPanelLeftTop();
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = pos.left;
      startTop = pos.top;

      document.addEventListener("mousemove", onMouseMove, true);
      document.addEventListener("mouseup", onMouseUp, true);

      e.preventDefault();
      e.stopPropagation();
    }

    function onMouseMove(e) {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      const rect = panel.getBoundingClientRect();
      const headerH = 44;

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      newLeft = clamp(newLeft, 0, Math.max(0, vw - rect.width));
      newTop = clamp(newTop, 0, Math.max(0, vh - headerH));

      panel.style.left = `${newLeft}px`;
      panel.style.top = `${newTop}px`;
      panel.style.right = "auto";

      // Persist during drag (so even if Torn re-renders, it's kept)
      const ui = loadUiState();
      ui.left = newLeft;
      ui.top = newTop;
      ui.right = null;
      saveUiState(ui);

      e.preventDefault();
      e.stopPropagation();
    }

    function onMouseUp(e) {
      if (!dragging) return;
      dragging = false;

      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("mouseup", onMouseUp, true);

      e.preventDefault();
      e.stopPropagation();
    }

    handle.addEventListener("mousedown", onMouseDown, true);
  }

  // =========================
  // SPIN PROCESSING + RENDER
  // (same logic as previous version; omitted here for space in the comment)
  // =========================

  // --- Helpers reused by render
  function sortedTokenStartEntries(st) {
    const winsObj = st.winsByTokenStart || {};
    const spinsObj = st.spinsByTokenStart || {};
    return Object.keys(winsObj)
      .map(k => {
        const token = parseInt(k, 10);
        const wins = Number(winsObj[k] || 0);
        const spins = Number(spinsObj[k] || 0);
        return { token, wins, spins };
      })
      .filter(o => Number.isFinite(o.token) && o.token >= 0 && Number.isFinite(o.wins) && o.wins > 0)
      .sort((a, b) => (b.wins - a.wins) || (a.token - b.token));
  }

  function render(st) {
    ensurePanel();

    const tokensNow = readTokens();
    const curX = Number.isFinite(st.currentLossStreak) ? st.currentLossStreak : 0;

    // Full view stat lines
    const streakEl = document.getElementById("kc-streak");
    const curTokensEl = document.getElementById("kc-curtokens");
    const statusEl = document.getElementById("kc-status");
    const untrackedEl = document.getElementById("kc-untracked");

    if (streakEl) streakEl.textContent = String(curX);
    if (curTokensEl) curTokensEl.textContent = tokensNow !== null ? String(tokensNow) : "?";
    if (statusEl) statusEl.textContent = isVisibleTab() ? "Active" : "Paused";
    if (untrackedEl) untrackedEl.textContent = String(st.untrackedSpins || 0);

    // Minimized view stat lines
    const streakMini = document.getElementById("kc-streak-mini");
    const curTokensMini = document.getElementById("kc-curtokens-mini");
    const statusMini = document.getElementById("kc-status-mini");
    const untrackedMini = document.getElementById("kc-untracked-mini");

    if (streakMini) streakMini.textContent = String(curX);
    if (curTokensMini) curTokensMini.textContent = tokensNow !== null ? String(tokensNow) : "?";
    if (statusMini) statusMini.textContent = isVisibleTab() ? "Active" : "Paused";
    if (untrackedMini) untrackedMini.textContent = String(st.untrackedSpins || 0);

    // If minimized, we still update the stats and stop there
    const ui = loadUiState();
    if (ui.minimized) return;

    const listEl = document.getElementById("kc-list");
    const hintEl = document.getElementById("kc-hint");
    const debugEl = document.getElementById("kc-debug");

    const tokenHintEl = document.getElementById("kc-tokenhint");
    const tokenListEl = document.getElementById("kc-tokens-list");

    const comboHintEl = document.getElementById("kc-combohint");
    const comboListEl = document.getElementById("kc-combos-list");

    // Hot streaks hint
    const hotKeys = getHotStreakKeys(st.winByStreak);
    const isHotNow = hotKeys.includes(String(curX));

    if (hintEl) {
      if (!st.totalWins) {
        hintEl.textContent = "Log some wins to build your pattern tables.";
      } else {
        const hotText = hotKeys.length ? hotKeys.join(", ") : "none";
        hintEl.innerHTML = isHotNow
          ? `<span class="kc-hot">HOT (based on your log):</span> Current streak matches one of your top ${HOT_TOP_N} win streak lengths: ${hotText}`
          : `Top ${HOT_TOP_N} streak lengths (based on your log): ${hotText}`;
      }
    }

    // Debug
    if (debugEl) {
      const d = st.debugLast || {};
      if (d.tokensFrom !== null && d.tokensTo !== null) {
        debugEl.textContent =
          `Last spin: Tokens ${d.tokensFrom} -> ${d.tokensTo} | Won ${d.won !== null ? "$" + d.won.toLocaleString() : "?"} | ${d.when || ""}`;
      } else {
        debugEl.textContent = "Debug: waiting for first detected spin...";
      }
    }

    // Histogram list
    if (listEl) {
      listEl.innerHTML = "";
      const entries = sortedHistogramEntries(st.winByStreak);

      if (!entries.length) {
        const d = document.createElement("div");
        d.className = "kc-mini";
        d.textContent = "No wins logged yet.";
        listEl.appendChild(d);
      } else {
        const slice = entries.slice(0, MAX_ROWS);
        for (const e of slice) {
          const row = document.createElement("div");
          row.className = "kc-item";
          if (String(e.x) === String(curX)) row.classList.add("kc-current");
          row.innerHTML = `<span>${e.x} - ${e.y}</span><span></span>`;
          listEl.appendChild(row);
        }
      }
    }

    // Token-start hint + list
    if (tokenHintEl) {
      if (!st.totalWins) tokenHintEl.textContent = "This table fills only after you log wins.";
      else tokenHintEl.textContent = "Format: Tokens: N, W wins @ P% (P is % of total wins). Also shows WR (wins/spins) at that token value.";
    }

    if (tokenListEl) {
      tokenListEl.innerHTML = "";
      const entries = sortedTokenStartEntries(st).slice(0, TOP_TOKENS_N);

      if (!entries.length) {
        const d = document.createElement("div");
        d.className = "kc-mini";
        d.textContent = "No token-start win data yet.";
        tokenListEl.appendChild(d);
      } else {
        for (const e of entries) {
          const share = pct(e.wins, st.totalWins);
          const wr = pct(e.wins, e.spins);

          const row = document.createElement("div");
          row.className = "kc-item";

          if (tokensNow !== null && Number(tokensNow) === Number(e.token)) {
            row.classList.add("kc-current");
          }

          const left = `Tokens: ${e.token}, ${e.wins} wins @ ${share.toFixed(1)}%`;
          const right = `WR: ${wr.toFixed(1)}% (${e.wins}/${e.spins || 0})`;

          row.innerHTML = `<span>${left}</span><span style="opacity:0.85;">${right}</span>`;
          tokenListEl.appendChild(row);
        }
      }
    }

    // Combo hint + list
    if (comboHintEl) {
      if (!st.totalWins) comboHintEl.textContent = "This combo table fills only after you log wins.";
      else comboHintEl.textContent = `Showing combos for current X=${curX}. Format: X + Tokens T: W wins @ P% | WR: wins/spins for that combo.`;
    }

    if (comboListEl) {
      comboListEl.innerHTML = "";
      const entries = getComboEntriesForX(st, curX).slice(0, TOP_COMBOS_N);

      if (!entries.length) {
        const d = document.createElement("div");
        d.className = "kc-mini";
        d.textContent = "No combo wins recorded yet for your current loss streak.";
        comboListEl.appendChild(d);
      } else {
        for (const e of entries) {
          const share = pct(e.wins, st.totalWins);
          const wr = pct(e.wins, e.spins);

          const row = document.createElement("div");
          row.className = "kc-item";

          if (tokensNow !== null && Number(tokensNow) === Number(e.token) && Number(curX) === Number(e.x)) {
            row.classList.add("kc-current");
          }

          const left = `${e.x} + Tokens ${e.token}: ${e.wins} wins @ ${share.toFixed(1)}%`;
          const right = `WR: ${wr.toFixed(1)}% (${e.wins}/${e.spins || 0})`;

          row.innerHTML = `<span>${left}</span><span style="opacity:0.85;">${right}</span>`;
          comboListEl.appendChild(row);
        }
      }
    }
  }

  // =========================
  // SPIN PROCESSING
  // =========================
  function applyOutcome(st, tokensFrom, tokensTo, wonAmount, xBeforeSpin) {
    const delta = tokensFrom - tokensTo;

    if (delta > 1) st.untrackedSpins += (delta - 1);

    // token-start
    const kT = String(tokensFrom);
    st.spinsByTokenStart[kT] = (st.spinsByTokenStart[kT] || 0) + 1;
    st.totalSpinsTracked += 1;

    // combo spin
    const cKey = comboKey(xBeforeSpin, tokensFrom);
    st.spinsByCombo[cKey] = (st.spinsByCombo[cKey] || 0) + 1;

    if (wonAmount !== null && wonAmount > 0) {
      st.winsByTokenStart[kT] = (st.winsByTokenStart[kT] || 0) + 1;
      st.winsByCombo[cKey] = (st.winsByCombo[cKey] || 0) + 1;
      recordWin(st);
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

      const xBefore = Number.isFinite(st.currentLossStreak) ? st.currentLossStreak : 0;

      const wonImmediate = readWon();
      setTimeout(() => {
        if (!isVisibleTab()) return;

        const st2 = loadState();
        const wonDelayed = readWon();
        const wonFinal = (wonDelayed !== null ? wonDelayed : wonImmediate);

        if (st2.lastTokens !== from) return;

        applyOutcome(st2, from, to, wonFinal, xBefore);

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
  // OBSERVERS WITH AUTO-REBIND
  // =========================
  let valueObserver = null;
  let rebinderObserver = null;

  function disconnectAll() {
    try { if (valueObserver) valueObserver.disconnect(); } catch (e) {}
    try { if (rebinderObserver) rebinderObserver.disconnect(); } catch (e) {}
    valueObserver = null;
    rebinderObserver = null;
  }

  function bindValueObserver() {
    const tokensEl = document.getElementById("tokens");
    const wonEl = document.getElementById("moneyWon");

    const fallbackRoot =
      document.querySelector(".slots-main-wrap") ||
      document.querySelector(".slots-area-wrap") ||
      document.body;

    const targets = [];
    if (tokensEl) targets.push(tokensEl);
    if (wonEl) targets.push(wonEl);
    if (!targets.length && fallbackRoot) targets.push(fallbackRoot);

    if (!targets.length) return;

    valueObserver = new MutationObserver(() => {
      processSpinIfAny();
      render(loadState());
    });

    for (const t of targets) {
      valueObserver.observe(t, { childList: true, subtree: true, characterData: true });
    }

    processSpinIfAny();
    render(loadState());
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

  let rebindTimer = null;
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

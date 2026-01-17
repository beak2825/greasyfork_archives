// ==UserScript==
// @name         Torn Web: Mug Intel Mini-Card (v0.1)
// @namespace    grimsnecrosis.mugintel.web
// @version      0.0.4
// @description  SHIFT+Click a player name to show a mini intel card + history-based mug EV. Normal click stays normal. Left-pinned + minimizable.
// @author       Grimsnecrosis
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/562984/Torn%20Web%3A%20Mug%20Intel%20Mini-Card%20%28v01%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562984/Torn%20Web%3A%20Mug%20Intel%20Mini-Card%20%28v01%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /**********************
   * STORAGE
   **********************/
  const STORAGE_KEY = "mugintel_targets_v03";
  const UI_KEY_MIN = "mugintel_ui_minimized_v1";

  function loadTargets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function saveTargets(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function uiIsMinimized() {
    return localStorage.getItem(UI_KEY_MIN) === "1";
  }
  function setUiMinimized(v) {
    localStorage.setItem(UI_KEY_MIN, v ? "1" : "0");
  }

  function getApiKey() {
    const k = typeof GM_getValue === "function" ? GM_getValue("TORN_API_KEY", "") : "";
    return k || localStorage.getItem("TORN_API_KEY") || "";
  }
  function setApiKey(key) {
    if (typeof GM_setValue === "function") GM_setValue("TORN_API_KEY", key);
    localStorage.setItem("TORN_API_KEY", key);
  }

  /**********************
   * UTIL
   **********************/
  const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
  const nowMs = () => Date.now();

  function fmtMoney(n) {
    if (typeof n !== "number" || !isFinite(n)) return "N/A";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "b";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "m";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "k";
    return String(Math.floor(n));
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function parseRelativeToHours(relative) {
    if (!relative || typeof relative !== "string") return null;
    const s = relative.toLowerCase();
    if (s.includes("just") || s.includes("now")) return 0;

    const parts = [
      { re: /(\d+)\s*day/, mult: 24 },
      { re: /(\d+)\s*hour/, mult: 1 },
      { re: /(\d+)\s*minute/, mult: 1 / 60 },
      { re: /(\d+)\s*second/, mult: 1 / 3600 },
    ];

    let hours = 0;
    let found = false;
    for (const p of parts) {
      const m = s.match(p.re);
      if (m) {
        hours += parseInt(m[1], 10) * p.mult;
        found = true;
      }
    }
    return found ? hours : null;
  }

  function median(arr) {
    if (!arr.length) return null;
    const a = arr.slice().sort((x, y) => x - y);
    const mid = Math.floor(a.length / 2);
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
  }

  /**********************
   * UI (LEFT + MINIMIZE)
   **********************/
  GM_addStyle(`
    #mugintel-card {
      position: fixed;
      left: 14px;            /* <<< LEFT PINNED */
      right: auto;
      bottom: 14px;
      width: 380px;
      max-width: calc(100vw - 28px);
      z-index: 999999;
      background: rgba(20,20,22,0.96);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 10px 12px 12px;
      color: #f2f2f2;
      font-family: -apple-system, system-ui, Segoe UI, Roboto, Arial, sans-serif;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    }

    #mugintel-header {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      user-select:none;
      cursor: default;
      margin-bottom: 6px;
    }

    #mugintel-title {
      display:flex;
      align-items:center;
      gap:10px;
    }

    #mugintel-card h3 { margin: 0; font-size: 14px; font-weight: 800; }
    #mugintel-card .row { display:flex; justify-content:space-between; gap:10px; margin: 4px 0; font-size: 12px; opacity: 0.95; }
    #mugintel-card .muted { opacity: 0.75; }
    #mugintel-card .pill { display:inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; border:1px solid rgba(255,255,255,0.14); }
    #mugintel-card .good { background: rgba(46, 204, 113, 0.18); }
    #mugintel-card .mid  { background: rgba(241, 196, 15, 0.18); }
    #mugintel-card .bad  { background: rgba(231, 76, 60, 0.18); }

    #mugintel-card textarea, #mugintel-card input {
      width: 100%;
      box-sizing: border-box;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      color: #fff;
      padding: 8px;
      font-size: 12px;
      outline: none;
    }

    #mugintel-card .btnrow { display:flex; gap:8px; margin-top:8px; }
    #mugintel-card button {
      flex:1;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.08);
      color: #fff;
      padding: 8px 10px;
      font-size: 12px;
      cursor: pointer;
    }
    #mugintel-card button:hover { background: rgba(255,255,255,0.12); }

    .mi-iconbtn {
      width: 30px;
      min-width: 30px;
      max-width: 30px;
      padding: 6px 0 !important;
      line-height: 1;
      flex: 0 0 auto !important;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.08);
      color: #fff;
      cursor: pointer;
      opacity: 0.95;
    }
    .mi-iconbtn:hover { background: rgba(255,255,255,0.12); }

    #mugintel-body.minimized {
      display: none;
    }

    #mugintel-hint {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 4px;
    }

    #mugintel-card .divider {
      height: 1px;
      background: rgba(255,255,255,0.10);
      margin: 10px 0;
    }
  `);

  function ensureCard() {
    let card = document.getElementById("mugintel-card");
    if (card) return card;

    card = document.createElement("div");
    card.id = "mugintel-card";
    card.innerHTML = `
      <div id="mugintel-header">
        <div id="mugintel-title">
          <h3>Mug Intel</h3>
          <span id="mi-key-status" class="pill bad">missing</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="mi-min" class="mi-iconbtn" title="Minimize / Expand">_</button>
          <button id="mi-close" class="mi-iconbtn" title="Close">✕</button>
        </div>
      </div>

      <div id="mugintel-body">
        <div class="row"><span class="muted">Tip:</span><span class="muted">SHIFT+Click a player name</span></div>

        <div class="btnrow">
          <button id="mi-setkey">Set API Key</button>
          <button id="mi-clear">Clear</button>
        </div>

        <div id="mi-body" style="margin-top:10px;"></div>

        <div id="mugintel-hint" class="muted">
          Normal click works normally. Use SHIFT+Click to open intel without leaving the page.
        </div>
      </div>
    `;

    card.querySelector("#mi-close").addEventListener("click", () => card.remove());

    card.querySelector("#mi-clear").addEventListener("click", () => {
      card.querySelector("#mi-body").innerHTML = "";
    });

    card.querySelector("#mi-setkey").addEventListener("click", () => {
      const current = getApiKey();
      const key = prompt("Paste your Torn API key (stored locally):", current || "");
      if (key && key.trim().length > 10) {
        setApiKey(key.trim());
        updateKeyStatus();
      }
    });

    card.querySelector("#mi-min").addEventListener("click", () => {
      const body = card.querySelector("#mugintel-body");
      const willMin = !body.classList.contains("minimized");
      body.classList.toggle("minimized", willMin);
      setUiMinimized(willMin);
    });

    document.body.appendChild(card);
    updateKeyStatus();

    // apply saved minimized state
    if (uiIsMinimized()) {
      card.querySelector("#mugintel-body").classList.add("minimized");
    }

    return card;
  }

  function updateKeyStatus() {
    const card = document.getElementById("mugintel-card");
    if (!card) return;
    const badge = card.querySelector("#mi-key-status");
    const hasKey = !!getApiKey();
    badge.textContent = hasKey ? "set" : "missing";
    badge.className = "pill " + (hasKey ? "good" : "bad");
  }

  /**********************
   * TORN API
   **********************/
  async function tornApiUser(playerId) {
    const key = getApiKey();
    if (!key) throw new Error("Missing API key");
    const url = `https://api.torn.com/user/${playerId}?selections=basic,profile&key=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) throw new Error(`API Error ${json.error.code}: ${json.error.error}`);
    return json;
  }

  /**********************
   * HISTORY / INTEL
   **********************/
  function ensureTargetRecord(db, playerId) {
    if (!db[playerId]) db[playerId] = { mugs: [] };
    if (!Array.isArray(db[playerId].mugs)) db[playerId].mugs = [];
    return db[playerId];
  }

  function computeHistoryStats(record) {
    const mugs = Array.isArray(record?.mugs) ? record.mugs : [];
    const amounts = mugs.map(m => Number(m.a || 0)).filter(Number.isFinite);

    const totalMugs = amounts.length;
    const total = amounts.reduce((s, x) => s + x, 0);
    const avg = totalMugs ? total / totalMugs : null;
    const med = median(amounts);
    const max = totalMugs ? Math.max(...amounts) : null;

    const smallCutoff = 100;
    const worthCutoff = 500000;

    const dudCount = amounts.filter(a => a <= smallCutoff).length;
    const worthCount = amounts.filter(a => a >= worthCutoff).length;

    const dudRate = totalMugs ? dudCount / totalMugs : null;
    const worthRate = totalMugs ? worthCount / totalMugs : null;

    let lastHitMs = null;
    if (mugs.length) {
      lastHitMs = mugs.reduce((mx, m) => Math.max(mx, Number(m.t || 0)), 0);
      if (!Number.isFinite(lastHitMs) || lastHitMs <= 0) lastHitMs = null;
    }

    let medianDeltaHours = null;
    if (mugs.length >= 2) {
      const sorted = mugs
        .map(m => Number(m.t || 0))
        .filter(t => Number.isFinite(t) && t > 0)
        .sort((a, b) => a - b);

      const deltas = [];
      for (let i = 1; i < sorted.length; i++) {
        const dh = (sorted[i] - sorted[i - 1]) / 3600000;
        if (Number.isFinite(dh) && dh >= 0) deltas.push(dh);
      }
      medianDeltaHours = median(deltas);
    }

    return { totalMugs, total, avg, med, max, dudRate, worthRate, lastHitMs, medianDeltaHours };
  }

  function classifyTarget(stats) {
    if (!stats || !stats.totalMugs) return { label: "NEW", cls: "mid" };

    if (stats.totalMugs >= 8 && (stats.worthRate ?? 0) >= 0.35 && (stats.med ?? 0) >= 200000) {
      return { label: "FARM", cls: "good" };
    }
    if ((stats.max ?? 0) >= 2000000 && (stats.totalMugs <= 5 || (stats.worthRate ?? 0) < 0.25)) {
      return { label: "SNIPE", cls: "mid" };
    }
    if (stats.totalMugs >= 5 && (stats.dudRate ?? 0) >= 0.30 && (stats.med ?? 0) < 20000) {
      return { label: "TRASH", cls: "bad" };
    }
    return { label: "OK", cls: "mid" };
  }

  function cooldownHint(stats) {
    if (!stats?.lastHitMs) return { text: "No hit history", cls: "mid" };
    const hoursSince = (nowMs() - stats.lastHitMs) / 3600000;
    const typical = stats.medianDeltaHours;

    if (hoursSince < 15) return { text: `${hoursSince.toFixed(1)}h since last hit (reduction risk)`, cls: "bad" };

    if (Number.isFinite(typical) && typical) {
      if (hoursSince < typical * 0.6) return { text: `${hoursSince.toFixed(1)}h since last (early vs ~${typical.toFixed(1)}h)`, cls: "mid" };
      return { text: `${hoursSince.toFixed(1)}h since last (typical ~${typical.toFixed(1)}h)`, cls: "good" };
    }
    return { text: `${hoursSince.toFixed(1)}h since last hit`, cls: "good" };
  }

  function scoreUser(userJson, histStats) {
    const level = Number(userJson.level || 0);

    const lastRel = userJson.last_action?.relative || "";
    const inactiveHours = parseRelativeToHours(lastRel);
    const inactiveScore = inactiveHours == null ? 5 : clamp(inactiveHours * 0.8, 0, 30);
    const levelScore = clamp(level / 3, 0, 20);

    const med = histStats?.med ?? null;
    const worthRate = histStats?.worthRate ?? null;
    const dudRate = histStats?.dudRate ?? null;

    const medianValue = med == null ? 0 : clamp(Math.log10(med + 1) * 10, 0, 35);
    const worthBonus = worthRate == null ? 0 : clamp(worthRate * 30, 0, 30);
    const dudPenalty = dudRate == null ? 0 : clamp(dudRate * 25, 0, 25);

    let cooldownPenalty = 0;
    if (histStats?.lastHitMs) {
      const hoursSince = (nowMs() - histStats.lastHitMs) / 3600000;
      if (hoursSince < 15) cooldownPenalty = 25;
      else if (hoursSince < 24) cooldownPenalty = 10;
    }

    const value = clamp(inactiveScore + levelScore + medianValue + worthBonus, 0, 100);
    const risk = clamp(dudPenalty + cooldownPenalty, 0, 100);
    const ev = Math.round(value - risk);

    const label =
      ev >= 25 ? { text: "GREEN", cls: "good" } :
      ev >= 10 ? { text: "YELLOW", cls: "mid" } :
      { text: "RED", cls: "bad" };

    return { value: Math.round(value), risk: Math.round(risk), ev, label };
  }

  /**********************
   * LINK HANDLING
   **********************/
  function extractPlayerIdFromHref(href) {
    try {
      const url = new URL(href, location.origin);
      if (!url.hostname.includes("torn.com")) return null;
      const xid = url.searchParams.get("XID");
      if (xid && /^\d+$/.test(xid)) return xid;
      return null;
    } catch {
      return null;
    }
  }

  function isPlayerLink(a) {
    if (!(a instanceof HTMLAnchorElement)) return false;
    const href = a.href || "";
    return href.includes("profiles.php") && href.includes("XID=");
  }

  /**********************
   * RENDER
   **********************/
  function renderUserCard(playerId, userJson) {
    const card = ensureCard();
    const bodyWrap = card.querySelector("#mugintel-body");
    if (bodyWrap.classList.contains("minimized")) {
      // auto-expand when you open intel
      bodyWrap.classList.remove("minimized");
      setUiMinimized(false);
    }

    const body = card.querySelector("#mi-body");

    const db = loadTargets();
    const rec = ensureTargetRecord(db, playerId);

    const name = userJson.name || rec.name || `Player ${playerId}`;
    const level = userJson.level ?? rec.level ?? "N/A";
    const last = userJson.last_action?.relative || "N/A";
    const status = userJson.status?.description || userJson.last_action?.status || "N/A";
    const networth = userJson.networth;

    rec.name = name;
    rec.level = Number(level) || rec.level || 0;
    rec.lastSeen = nowMs();

    const hist = computeHistoryStats(rec);
    const classif = classifyTarget(hist);
    const cd = cooldownHint(hist);
    const score = scoreUser(userJson, hist);

    saveTargets(db);

    const lastYield = hist.totalMugs ? fmtMoney(Number(rec.mugs[rec.mugs.length - 1]?.a || 0)) : "N/A";
    const avgYield = hist.avg == null ? "N/A" : fmtMoney(hist.avg);
    const medYield = hist.med == null ? "N/A" : fmtMoney(hist.med);
    const maxYield = hist.max == null ? "N/A" : fmtMoney(hist.max);

    const worthRatePct = hist.worthRate == null ? "N/A" : `${Math.round(hist.worthRate * 100)}%`;
    const dudRatePct = hist.dudRate == null ? "N/A" : `${Math.round(hist.dudRate * 100)}%`;

    body.innerHTML = `
      <div class="row">
        <span><strong>${name}</strong> <span class="muted">[${playerId}]</span></span>
        <span class="pill ${score.label.cls}">${score.label.text} EV ${score.ev}</span>
      </div>

      <div class="row">
        <span class="pill ${classif.cls}">${classif.label}</span>
        <span class="pill ${cd.cls}">${cd.text}</span>
      </div>

      <div class="divider"></div>

      <div class="row"><span class="muted">Level</span><span>${level}</span></div>
      <div class="row"><span class="muted">Last action</span><span>${last}</span></div>
      <div class="row"><span class="muted">Status</span><span>${status}</span></div>
      <div class="row"><span class="muted">Networth</span><span>${fmtMoney(networth)}</span></div>
      <div class="row"><span class="muted">Value / Risk</span><span>${score.value} / ${score.risk}</span></div>

      <div class="divider"></div>

      <div class="row"><span class="muted">History (you)</span><span class="muted">${hist.totalMugs} mugs</span></div>
      <div class="row"><span class="muted">Last / Avg / Med</span><span>${lastYield} / ${avgYield} / ${medYield}</span></div>
      <div class="row"><span class="muted">Max</span><span>${maxYield}</span></div>
      <div class="row"><span class="muted">Worth / Dud rate</span><span>${worthRatePct} / ${dudRatePct}</span></div>

      <div style="margin-top:10px;">
        <div class="row"><span class="muted">Log mug amount</span><span class="muted">numbers only</span></div>
        <input id="mi-log-amount" placeholder="e.g. 4359668" />
        <div class="btnrow">
          <button id="mi-log-save">Add to history</button>
          <button id="mi-log-undo">Undo last</button>
        </div>
      </div>

      <div style="margin-top:8px;">
        <div class="row"><span class="muted">Notes/tags</span><span class="muted">tough/shared/banks fast</span></div>
        <textarea id="mi-notes" rows="3" placeholder="Your notes…">${rec.notes || ""}</textarea>
      </div>

      <div class="btnrow">
        <button id="mi-save-notes">Save notes</button>
        <button id="mi-open">Open Profile</button>
      </div>
    `;

    body.querySelector("#mi-open").addEventListener("click", () => {
      window.open(`https://www.torn.com/profiles.php?XID=${playerId}`, "_blank");
    });

    body.querySelector("#mi-save-notes").addEventListener("click", () => {
      const db2 = loadTargets();
      const r2 = ensureTargetRecord(db2, playerId);
      r2.name = name;
      r2.level = Number(level) || r2.level || 0;
      r2.notes = body.querySelector("#mi-notes").value.trim();
      r2.lastSeen = nowMs();
      saveTargets(db2);
      alert("Notes saved.");
    });

    body.querySelector("#mi-log-save").addEventListener("click", () => {
      const amtRaw = body.querySelector("#mi-log-amount").value.trim().replace(/[,$]/g, "");
      const amt = safeNum(amtRaw);
      if (amt == null || amt < 0) return alert("Enter a valid number amount.");

      const db2 = loadTargets();
      const r2 = ensureTargetRecord(db2, playerId);

      r2.name = name;
      r2.level = Number(level) || r2.level || 0;
      r2.lastSeen = nowMs();

      r2.mugs.push({ t: nowMs(), a: Math.floor(amt) });

      saveTargets(db2);
      renderUserCard(playerId, userJson);
    });

    body.querySelector("#mi-log-undo").addEventListener("click", () => {
      const db2 = loadTargets();
      const r2 = ensureTargetRecord(db2, playerId);
      if (!r2.mugs.length) return alert("No history to undo.");
      r2.mugs.pop();
      saveTargets(db2);
      renderUserCard(playerId, userJson);
    });
  }

  /**********************
   * MAIN: SHIFT+CLICK ONLY
   **********************/
  let busy = false;

  async function onDocClick(e) {
    const a = e.target?.closest?.("a");
    if (!a || !isPlayerLink(a)) return;

    // IMPORTANT CHANGE:
    // - Normal click: do nothing (Torn behaves normally)
    // - SHIFT+Click: open intel and prevent navigation
    if (!e.shiftKey) return;

    const playerId = extractPlayerIdFromHref(a.href);
    if (!playerId) return;

    e.preventDefault();
    e.stopPropagation();

    ensureCard();

    if (!getApiKey()) {
      updateKeyStatus();
      const key = prompt("Paste your Torn API key (stored locally):", "");
      if (key && key.trim().length > 10) {
        setApiKey(key.trim());
        updateKeyStatus();
      } else {
        return;
      }
    }

    if (busy) return;
    busy = true;

    try {
      const u = await tornApiUser(playerId);
      renderUserCard(playerId, u);
    } catch (err) {
      const card = ensureCard();
      // auto expand if error
      const bodyWrap = card.querySelector("#mugintel-body");
      bodyWrap.classList.remove("minimized");
      setUiMinimized(false);

      card.querySelector("#mi-body").innerHTML =
        `<div class="row"><span class="pill bad">Error</span><span class="muted">${String(err.message || err)}</span></div>`;
      updateKeyStatus();
    } finally {
      busy = false;
    }
  }

  document.addEventListener("click", onDocClick, true);

  // Boot card once
  ensureCard();
})();

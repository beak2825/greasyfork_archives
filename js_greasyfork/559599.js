// ==UserScript==
// @name         Torn — Chest Helper
// @namespace    https://torn.com/
// @version      1.2.1
// @description  Christmas combination chest helper
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559599/Torn%20%E2%80%94%20Chest%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/559599/Torn%20%E2%80%94%20Chest%20Helper.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STORAGE_KEY = "sg_chest_helper_v121";
  const POOL = [1,2,3,4,5,6,7,8,9];
  const DIGITS = 3;
  const TOTAL_ATTEMPTS = 4;
  const EXTRA_AFTER_FIRST = 3;
  const FIRST_GUESS = "123";

  const COLORS = {
    none: { bg: "#f2f2f2", fg: "#111" },
    R: { bg: "#ff3b30", fg: "#111" },
    O: { bg: "#ff9500", fg: "#111" },
    G: { bg: "#34c759", fg: "#111" }
  };

  const allCodes = buildAllCodes(POOL);
  const state = loadState();

  let candidates = filterByAttempts(allCodes, getAllAttempts());

  GM_addStyle(`
    #ch-helper {
      position: fixed;
      left: ${state.ui.x}px;
      top: ${state.ui.y}px;
      width: 280px;
      z-index: 999999;
      background: #e6e6e6;
      border: 2px solid #39ff14;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #111;
      user-select: none;
      overflow: hidden;
    }
    #ch-helper * { box-sizing: border-box; }

    #ch-header {
      padding: 10px 12px;
      background: #dcdcdc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: grab;
      border-bottom: 1px solid rgba(0,0,0,.12);
    }
    #ch-title {
      font-weight: 900;
      letter-spacing: .2px;
      font-size: 14px;
    }
    #ch-mini {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,.2);
      background: #f0f0f0;
      cursor: pointer;
    }

    #ch-body { padding: 10px 12px 12px; }
    #ch-hint {
      font-size: 12px;
      line-height: 1.25;
      opacity: .9;
      margin-bottom: 10px;
    }

    #ch-topline {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      font-weight: 900;
      opacity: .95;
      margin-bottom: 8px;
    }

    #ch-row-digits {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }
    .ch-digit {
      height: 46px;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,.22);
      background: #f2f2f2;
      font-size: 18px;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
    }
    .ch-digit:active { transform: translateY(1px); }

    #ch-row-meta {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      margin-bottom: 10px;
      opacity: .95;
    }

    #ch-msg {
      font-size: 12px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 10px;
      background: rgba(255,255,255,.55);
      border: 1px solid rgba(0,0,0,.10);
      min-height: 34px;
      display: flex;
      align-items: center;
      white-space: pre-wrap;
    }

    .ch-btn {
      width: 100%;
      height: 40px;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,.22);
      background: #f0f0f0;
      cursor: pointer;
      font-weight: 900;
      letter-spacing: .2px;
      margin-top: 8px;
    }
    .ch-btn:active { transform: translateY(1px); }
    .ch-btn[disabled] { opacity: .55; cursor: not-allowed; }

    #ch-log {
      margin-top: 10px;
      font-size: 12px;
      opacity: .95;
      max-height: 140px;
      overflow: auto;
      padding-right: 4px;
    }
    .ch-logline {
      padding: 6px 0;
      border-top: 1px dashed rgba(0,0,0,.18);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .ch-badges { display: inline-flex; gap: 4px; align-items: center; }
    .ch-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 18px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,.15);
      background: rgba(255,255,255,.55);
      font-weight: 900;
      font-size: 11px;
    }
  `);

  const root = document.createElement("div");
  root.id = "ch-helper";
  root.innerHTML = `
    <div id="ch-header">
      <div id="ch-title">Chest Helper</div>
      <button id="ch-mini" type="button">${state.ui.minimized ? "Expand" : "Minimize"}</button>
    </div>
    <div id="ch-body" style="display:${state.ui.minimized ? "none" : "block"}">
      <div id="ch-hint">Red = wrong number, Orange = wrong position, Green = OK</div>
      <div id="ch-topline">
        <div id="ch-attempt"></div>
        <div id="ch-guess"></div>
      </div>
      <div id="ch-row-digits">
        <button class="ch-digit" data-idx="0" type="button">0</button>
        <button class="ch-digit" data-idx="1" type="button">0</button>
        <button class="ch-digit" data-idx="2" type="button">0</button>
      </div>
      <div id="ch-row-meta">
        <div id="ch-steps">remaining steps: 3</div>
        <div id="ch-cands">candidates: 0</div>
      </div>
      <div id="ch-msg"></div>
      <button id="ch-next" class="ch-btn" type="button">Next Step</button>
      <button id="ch-reset" class="ch-btn" type="button">Reset</button>
      <button id="ch-unlock" class="ch-btn" type="button">Unlock Code</button>
      <div id="ch-log"></div>
    </div>
  `;
  document.body.appendChild(root);

  const header = root.querySelector("#ch-header");
  const miniBtn = root.querySelector("#ch-mini");
  const body = root.querySelector("#ch-body");
  const attemptEl = root.querySelector("#ch-attempt");
  const guessEl = root.querySelector("#ch-guess");
  const digitBtns = [...root.querySelectorAll(".ch-digit")];
  const stepsEl = root.querySelector("#ch-steps");
  const candsEl = root.querySelector("#ch-cands");
  const msgEl = root.querySelector("#ch-msg");
  const nextBtn = root.querySelector("#ch-next");
  const resetBtn = root.querySelector("#ch-reset");
  const unlockBtn = root.querySelector("#ch-unlock");
  const logEl = root.querySelector("#ch-log");

  makeDraggable(root, header);

  miniBtn.addEventListener("click", () => {
    state.ui.minimized = !state.ui.minimized;
    body.style.display = state.ui.minimized ? "none" : "block";
    miniBtn.textContent = state.ui.minimized ? "Expand" : "Minimize";
    saveState();
  });

  digitBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = Number(btn.dataset.idx);
      state.currentFeedback[idx] = nextFeedback(state.currentFeedback[idx]);
      applyFeedbackStyles();
      saveState();
    });
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const idx = Number(btn.dataset.idx);
      state.currentFeedback[idx] = prevFeedback(state.currentFeedback[idx]);
      applyFeedbackStyles();
      saveState();
    });
  });

  nextBtn.addEventListener("click", () => {
    if (state.firstRecorded && state.extraAttempts.length >= EXTRA_AFTER_FIRST) {
      setMessage("No remaining steps. Press Unlock Code or Reset.");
      render();
      return;
    }

    const pat = feedbackToPattern(state.currentFeedback);
    if (!pat) {
      setMessage("Set colors for all 3 digits, then press Next Step.");
      return;
    }

    if (!state.firstRecorded) {
      state.firstPattern = pat;
      state.firstRecorded = true;
    } else {
      state.extraAttempts.push({ guess: state.currentGuess, pattern: pat });
    }

    state.currentFeedback = ["none","none","none"];

    candidates = filterByAttempts(allCodes, getAllAttempts());

    if (candidates.length === 0) {
      setMessage("No candidates. Re-check the colors you entered (or Reset).");
      render();
      saveState();
      return;
    }

    if (candidates.length === 1) {
      state.currentGuess = candidates[0];
      setMessage(`Unique code found: ${candidates[0]}\nPress Unlock Code.`);
      render();
      saveState();
      return;
    }

    if (state.extraAttempts.length >= EXTRA_AFTER_FIRST) {
      setMessage(`Not unique (${candidates.length} candidates). You would have to guess.`);
      render();
      saveState();
      return;
    }

    const suggested = pickBestGuess(candidates, allCodes);
    state.currentGuess = suggested;

    const remainingAfter = EXTRA_AFTER_FIRST - state.extraAttempts.length;
    if (remainingAfter === 1) {
      setMessage(`Last attempt next. Candidates: ${candidates.length}\nSuggested: ${suggested}`);
    } else {
      setMessage(`Candidates: ${candidates.length}\nSuggested next: ${suggested}`);
    }

    render();
    saveState();
  });

  resetBtn.addEventListener("click", () => {
    state.firstRecorded = false;
    state.firstPattern = "";
    state.extraAttempts = [];
    state.currentGuess = FIRST_GUESS;
    state.currentFeedback = ["none","none","none"];
    candidates = allCodes.slice();
    setMessage("Start: 123 is already your in-game attempt #1. Enter its colors, then Next Step.");
    render();
    saveState();
  });

  unlockBtn.addEventListener("click", () => {
    candidates = filterByAttempts(allCodes, getAllAttempts());

    if (!state.firstRecorded) {
      setMessage("Enter colors for 123 first, then Next Step.");
      renderMeta();
      return;
    }

    if (candidates.length === 0) {
      setMessage("No candidates. Reset or fix inputs.");
      renderMeta();
      return;
    }

    if (candidates.length === 1) {
      setMessage(`Unlock Code: ${candidates[0]}`);
      renderMeta();
      return;
    }

    const maxShow = 30;
    const list = candidates.slice(0, maxShow).join("  ");
    const more = candidates.length > maxShow ? `\n(+${candidates.length - maxShow} more)` : "";
    setMessage(`Not unique yet (${candidates.length} candidates):\n${list}${more}`);
    renderMeta();
  });

  if (!state.currentGuess || !/^[1-9]{3}$/.test(state.currentGuess)) state.currentGuess = FIRST_GUESS;

  candidates = filterByAttempts(allCodes, getAllAttempts());

  if (!state.message) {
    setMessage("Start: 123 is already your in-game attempt #1. Enter its colors, then Next Step.");
  }

  render();

  function getAllAttempts() {
    const out = [];
    if (state.firstRecorded && /^[ROG]{3}$/.test(state.firstPattern)) {
      out.push({ guess: FIRST_GUESS, pattern: state.firstPattern });
    }
    if (Array.isArray(state.extraAttempts)) {
      for (const a of state.extraAttempts) {
        if (isAttempt(a)) out.push(a);
      }
    }
    return out;
  }

  function render() {
    renderTop();
    renderDigits();
    applyFeedbackStyles();
    renderMeta();
    renderLog();
    nextBtn.disabled = state.firstRecorded && state.extraAttempts.length >= EXTRA_AFTER_FIRST;
  }

  function renderTop() {
    if (!state.firstRecorded) {
      attemptEl.textContent = `Attempt 1/${TOTAL_ATTEMPTS}`;
      guessEl.textContent = `Guess: ${FIRST_GUESS}`;
      return;
    }
    const nextNum = Math.min(2 + state.extraAttempts.length, TOTAL_ATTEMPTS);
    attemptEl.textContent = `Attempt ${nextNum}/${TOTAL_ATTEMPTS}`;
    guessEl.textContent = `Guess: ${state.currentGuess}`;
  }

  function renderDigits() {
    const g = (!state.firstRecorded ? FIRST_GUESS : (state.currentGuess || FIRST_GUESS));
    const arr = String(g).split("");
    for (let i = 0; i < DIGITS; i++) digitBtns[i].textContent = arr[i] || "0";
  }

  function renderMeta() {
    const remaining = Math.max(0, EXTRA_AFTER_FIRST - (state.extraAttempts?.length || 0));
    stepsEl.textContent = `remaining steps: ${remaining}`;
    candsEl.textContent = `candidates: ${candidates.length}`;
  }

  function renderLog() {
    const lines = [];
    if (state.firstRecorded && /^[ROG]{3}$/.test(state.firstPattern)) {
      lines.push(renderLogLine(1, FIRST_GUESS, state.firstPattern));
    }
    const extras = Array.isArray(state.extraAttempts) ? state.extraAttempts.filter(isAttempt) : [];
    for (let i = 0; i < extras.length; i++) {
      lines.push(renderLogLine(2 + i, extras[i].guess, extras[i].pattern));
    }
    logEl.innerHTML = lines.join("");
  }

  function renderLogLine(n, guess, pat) {
    const badges = pat.split("").map((ch) => `<span class="ch-badge">${ch}</span>`).join("");
    return `<div class="ch-logline"><div><b>#${n}</b> ${guess}</div><div class="ch-badges">${badges}</div></div>`;
  }

  function applyFeedbackStyles() {
    for (let i = 0; i < DIGITS; i++) {
      const v = state.currentFeedback[i] || "none";
      const c = COLORS[v] || COLORS.none;
      digitBtns[i].style.background = c.bg;
      digitBtns[i].style.color = c.fg;
    }
  }

  function setMessage(text) {
    msgEl.textContent = text || "";
    state.message = text || "";
  }

  function nextFeedback(v) {
    if (v === "none") return "R";
    if (v === "R") return "O";
    if (v === "O") return "G";
    return "R";
  }

  function prevFeedback(v) {
    if (v === "none") return "G";
    if (v === "G") return "O";
    if (v === "O") return "R";
    return "G";
  }

  function feedbackToPattern(arr) {
    if (!Array.isArray(arr) || arr.length !== 3) return "";
    for (const v of arr) if (v !== "R" && v !== "O" && v !== "G") return "";
    return arr.join("");
  }

  function buildAllCodes(pool) {
    const out = [];
    for (let i = 0; i < pool.length; i++) {
      for (let j = 0; j < pool.length; j++) {
        if (j === i) continue;
        for (let k = 0; k < pool.length; k++) {
          if (k === i || k === j) continue;
          out.push(String(pool[i]) + String(pool[j]) + String(pool[k]));
        }
      }
    }
    return out;
  }

  function filterByAttempts(base, attempts) {
    let cur = base;
    for (const a of attempts) {
      cur = cur.filter((code) => evalPattern(code, a.guess) === a.pattern);
      if (!cur.length) break;
    }
    return cur;
  }

  function evalPattern(code, guess) {
    const c = code.split("");
    const g = guess.split("");
    const res = ["R","R","R"];
    const counts = Object.create(null);

    for (let i = 0; i < 3; i++) {
      if (c[i] === g[i]) {
        res[i] = "G";
      } else {
        counts[c[i]] = (counts[c[i]] || 0) + 1;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (res[i] === "G") continue;
      const d = g[i];
      if ((counts[d] || 0) > 0) {
        res[i] = "O";
        counts[d] -= 1;
      } else {
        res[i] = "R";
      }
    }

    return res.join("");
  }

  function pickBestGuess(cands, guessSpace) {
    if (cands.length <= 2) return cands[0];

    let best = guessSpace[0];
    let bestWorst = Infinity;
    let bestAvg = Infinity;
    let bestIsCandidate = false;

    for (let i = 0; i < guessSpace.length; i++) {
      const guess = guessSpace[i];
      const buckets = new Map();

      for (let j = 0; j < cands.length; j++) {
        const code = cands[j];
        const pat = evalPattern(code, guess);
        buckets.set(pat, (buckets.get(pat) || 0) + 1);
      }

      let worst = 0;
      let sumSq = 0;
      for (const v of buckets.values()) {
        if (v > worst) worst = v;
        sumSq += v * v;
      }
      const avg = sumSq / cands.length;

      const isCand = cands.includes(guess);

      if (
        worst < bestWorst ||
        (worst === bestWorst && avg < bestAvg) ||
        (worst === bestWorst && avg === bestAvg && isCand && !bestIsCandidate)
      ) {
        bestWorst = worst;
        bestAvg = avg;
        best = guess;
        bestIsCandidate = isCand;
        if (bestWorst === 1) break;
      }
    }

    return best;
  }

  function loadState() {
    const raw = GM_getValue(STORAGE_KEY, "");
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }
    const s = parsed && typeof parsed === "object" ? parsed : {};

    const migrated = migrateFromOld(s);

    return {
      ui: {
        x: clampInt(migrated?.ui?.x ?? 40, 0, window.innerWidth - 320),
        y: clampInt(migrated?.ui?.y ?? 120, 0, window.innerHeight - 240),
        minimized: !!(migrated?.ui?.minimized)
      },
      firstRecorded: !!migrated.firstRecorded,
      firstPattern: typeof migrated.firstPattern === "string" ? migrated.firstPattern : "",
      extraAttempts: Array.isArray(migrated.extraAttempts) ? migrated.extraAttempts.filter(isAttempt).slice(0, EXTRA_AFTER_FIRST) : [],
      currentGuess: typeof migrated.currentGuess === "string" ? migrated.currentGuess : FIRST_GUESS,
      currentFeedback: Array.isArray(migrated.currentFeedback) ? normalizeFeedback(migrated.currentFeedback) : ["none","none","none"],
      message: typeof migrated.message === "string" ? migrated.message : ""
    };
  }

  function migrateFromOld(s) {
    if ("firstRecorded" in s || "extraAttempts" in s) return s;

    const out = { ...s };
    out.firstRecorded = false;
    out.firstPattern = "";
    out.extraAttempts = [];

    if (Array.isArray(s.attempts)) {
      const attempts = s.attempts.filter(isAttempt);
      const first = attempts.find(a => a.guess === FIRST_GUESS);
      if (first) {
        out.firstRecorded = true;
        out.firstPattern = first.pattern;
      }
      out.extraAttempts = attempts.filter(a => a.guess !== FIRST_GUESS).slice(0, EXTRA_AFTER_FIRST);
    }

    out.currentGuess = typeof s.currentGuess === "string" ? s.currentGuess : FIRST_GUESS;
    out.currentFeedback = Array.isArray(s.currentFeedback) ? s.currentFeedback : ["none","none","none"];
    out.message = typeof s.message === "string" ? s.message : "";
    out.ui = s.ui || {};
    return out;
  }

  function saveState() {
    GM_setValue(STORAGE_KEY, JSON.stringify({
      ui: state.ui,
      firstRecorded: state.firstRecorded,
      firstPattern: state.firstPattern,
      extraAttempts: state.extraAttempts,
      currentGuess: state.currentGuess,
      currentFeedback: state.currentFeedback,
      message: state.message
    }));
  }

  function normalizeFeedback(a) {
    const out = ["none","none","none"];
    for (let i = 0; i < 3; i++) {
      const v = a[i];
      out[i] = (v === "R" || v === "O" || v === "G") ? v : "none";
    }
    return out;
  }

  function isAttempt(x) {
    return x && typeof x === "object"
      && typeof x.guess === "string" && /^[1-9]{3}$/.test(x.guess)
      && typeof x.pattern === "string" && /^[ROG]{3}$/.test(x.pattern);
  }

  function clampInt(v, min, max) {
    const n = Number.isFinite(Number(v)) ? Math.floor(Number(v)) : min;
    return Math.max(min, Math.min(max, n));
  }

  function makeDraggable(panel, handle) {
    let dragging = false;
    let ox = 0, oy = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      if (e.target && e.target.id === "ch-mini") return;
      dragging = true;
      handle.style.cursor = "grabbing";
      const r = panel.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      e.preventDefault();
    });

    const onMove = (e) => {
      if (!dragging) return;
      const x = clampInt(e.clientX - ox, 0, window.innerWidth - panel.offsetWidth);
      const y = clampInt(e.clientY - oy, 0, window.innerHeight - panel.offsetHeight);
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      state.ui.x = x;
      state.ui.y = y;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      handle.style.cursor = "grab";
      saveState();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("blur", onUp);

    window.addEventListener("resize", () => {
      state.ui.x = clampInt(state.ui.x, 0, window.innerWidth - panel.offsetWidth);
      state.ui.y = clampInt(state.ui.y, 0, window.innerHeight - panel.offsetHeight);
      panel.style.left = `${state.ui.x}px`;
      panel.style.top = `${state.ui.y}px`;
      saveState();
    });
  }
})();

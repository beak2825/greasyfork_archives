// ==UserScript==
// @name         Torn Chest Solver – MadMan Method (Probe Early-Stop + Smart Guess #3) v3.1
// @namespace    torn.chest.MadMan
// @version      3.1.9
// @license MIT
// @description  MadMan method: probe 123/456/789 ONLY until 3 digits are found, then relocate. Adds smart guess #3: if you already have 2/3 digits after two probes, skip 1 digit from final probe group and use that slot to test placement.
// @match        https://www.torn.com/christmas_town.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560633/Torn%20Chest%20Solver%20%E2%80%93%20MadMan%20Method%20%28Probe%20Early-Stop%20%2B%20Smart%20Guess%203%29%20v31.user.js
// @updateURL https://update.greasyfork.org/scripts/560633/Torn%20Chest%20Solver%20%E2%80%93%20MadMan%20Method%20%28Probe%20Early-Stop%20%2B%20Smart%20Guess%203%29%20v31.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /********************
   * ASSUMPTIONS
   * - 3 digit code
   * - Digits 1–9
   * - No repeated digits
   * - Max 4 attempts
   ********************/
  const PROBES = ["123", "456", "789"];
  const DIGITS = "123456789";
  const MAX_ATTEMPTS = 4;

  let attempt = 0;         // commits made
  let feedback = "";       // live FB being entered e.g. "XOG"
  let history = [];        // [{guess, feedback}]
  let possible = [];       // remaining candidates
  let knownDigits = new Set(); // digits confirmed present (from O/G)
  let excludedDigits = new Set(); // digits confirmed NOT present (from X)
  let usedProbes = new Set();

  /********************
   * CORE LOGIC
   ********************/
  function generateAll() {
    const out = [];
    for (let a of DIGITS)
      for (let b of DIGITS)
        for (let c of DIGITS)
          if (a !== b && a !== c && b !== c)
            out.push(a + b + c);
    return out;
  }

  function score(guess, code) {
    let s = "";
    for (let i = 0; i < 3; i++) {
      if (guess[i] === code[i]) s += "G";
      else if (code.includes(guess[i])) s += "O";
      else s += "X";
    }
    return s;
  }

  function filterPossible(guess, fb) {
    possible = possible.filter(c => score(guess, c) === fb);
  }

  function updateKnownDigits(guess, fb) {
    for (let i = 0; i < 3; i++) {
      if (fb[i] === "G" || fb[i] === "O") knownDigits.add(guess[i]);
    }
  }

  function updateExcludedDigits(guess, fb) {
    for (let i = 0; i < 3; i++) {
      if (fb[i] === "X") excludedDigits.add(guess[i]);
    }
  }

  function inferFinalDigitIfForced() {
    // If we already know 2 digits are in the code and have ruled out 6 digits,
    // the final digit is forced (digits 1-9, no repeats, 3-digit code).
    if (knownDigits.size !== 2) return;

    const remaining = [];
    for (const d of DIGITS) {
      if (knownDigits.has(d)) continue;
      if (excludedDigits.has(d)) continue;
      remaining.push(d);
    }
    if (remaining.length === 1) knownDigits.add(remaining[0]);
  }

  function remainingAttempts() {
    return MAX_ATTEMPTS - attempt;
  }

  function relocationMode() {
    return knownDigits.size >= 3 || usedProbes.size >= 3;
  }

  function possiblePositionsForDigit(d) {
    // Based on history: G locks a digit to a position; O rules a position out.
    const possiblePos = new Set([0, 1, 2]);
    for (const h of history) {
      for (let i = 0; i < 3; i++) {
        if (h.guess[i] !== d) continue;
        if (h.feedback[i] === "G") return [i];
        if (h.feedback[i] === "O") possiblePos.delete(i);
      }
    }
    return [...possiblePos];
  }

  function pickKnownDigitToProbe() {
    for (const d of knownDigits) {
      const pos = possiblePositionsForDigit(d);
      if (pos.length > 1) return d;
    }
    return null;
  }

  function partitionSizesForGuess(guess, codes) {
    const counts = new Map();
    for (const c of codes) {
      const fb = score(guess, c);
      counts.set(fb, (counts.get(fb) || 0) + 1);
    }
    return counts;
  }

  function pickMinimaxGuess(guesses, codes) {
    if (!guesses.length) return null;

    const last = history.length ? history[history.length - 1].guess : null;
    let best = null;
    let bestWorst = Infinity;
    let bestIsPossible = false;

    for (const g of guesses) {
      if (g === last) continue;
      const parts = partitionSizesForGuess(g, codes);
      let worst = 0;
      for (const v of parts.values()) worst = Math.max(worst, v);

      const isPossible = codes.includes(g);
      if (
        worst < bestWorst ||
        (worst === bestWorst && isPossible && !bestIsPossible)
      ) {
        best = g;
        bestWorst = worst;
        bestIsPossible = isPossible;
      }
    }

    return best || guesses[0];
  }

  function probeWithRelocationGuess(probe) {
    // Special-case guess #3 (attempt===2): if the next probe is 789 but we already found
    // at least 1 digit, we can often do better than raw 789 by "relocating" a known digit
    // into the probe to test its position while still probing new digits.
    if (attempt !== 2) return null;
    if (knownDigits.size < 1 || knownDigits.size >= 3) return null;
    if (!probe) return null;

    const probeDigits = probe.split("");
    const pool = new Set(probeDigits);
    for (const d of knownDigits) pool.add(d);

    const poolArr = [...pool];
    if (poolArr.length < 3) return null;

    // Build all 3-digit permutations from the pool (no repeats)
    const guesses = [];
    for (let i = 0; i < poolArr.length; i++) {
      for (let j = 0; j < poolArr.length; j++) {
        for (let k = 0; k < poolArr.length; k++) {
          const a = poolArr[i], b = poolArr[j], c = poolArr[k];
          if (a === b || a === c || b === c) continue;
          const g = a + b + c;
          guesses.push(g);
        }
      }
    }

    // Prefer guesses that contain at least 2 digits from the probe (so we still "discover" digits)
    const filtered = guesses.filter(g => {
      const digits = new Set(g.split(""));
      let fromProbe = 0;
      for (const d of probeDigits) if (digits.has(d)) fromProbe++;
      return fromProbe >= 2;
    });

    const candidateSet = filtered.length ? filtered : guesses;
    return pickMinimaxGuess(candidateSet, possible);
  }

  function eliminationProbeGuess() {
    // Special-case guess #3:
    // If we already know 2/3 digits after the first two probes, we can guess only 2 of 7-8-9
    // (and deduce the 3rd by elimination) while using the freed slot to probe a known digit's position.
    if (attempt !== 2) return null;
    if (knownDigits.size !== 2) return null;

    const probe = nextProbeIfNeeded();
    if (probe !== "789") return null;

    const probeDigit = pickKnownDigitToProbe();
    if (!probeDigit) return null;

    const probePositions = possiblePositionsForDigit(probeDigit);
    if (!probePositions.length) return null;
    const probePos = probePositions[0];

    const pool = ["7", "8", "9"].filter(d => d !== probeDigit);
    if (pool.length < 2) return null;
    const two = pool.slice(-2);

    const out = [null, null, null];
    out[probePos] = probeDigit;
    let k = 0;
    for (let i = 0; i < 3; i++) {
      if (out[i] !== null) continue;
      out[i] = two[k++];
    }

    // Ensure uniqueness (defensive)
    const s = out.join("");
    if (new Set(s.split("")).size !== 3) return null;
    return s;
  }

  // Pick next probe that can still discover NEW digits (i.e. contains digits not in knownDigits)
  function nextProbeIfNeeded() {
    if (knownDigits.size >= 3) return null;
    for (const p of PROBES) {
      if (usedProbes.has(p)) continue;
      const hasNew = [...p].some(d => !knownDigits.has(d));
      if (hasNew) return p;
    }
    // no probe can add new digits
    return null;
  }

  // Choose a relocation guess that tries to maximize progress:
  // - If only 1 possible: done
  // - Else: pick a candidate that differs from last guess (to avoid repeats)
  function pickRelocationGuess() {
    if (!possible.length) return "---";
    if (possible.length === 1) return possible[0];

    const last = history.length ? history[history.length - 1].guess : null;
    const cand = possible.find(c => c !== last);
    return cand || possible[0];
  }

  function nextGuess() {
    if (!possible.length) return "---";
    if (possible.length === 1) return possible[0];

    const special = eliminationProbeGuess();
    if (special && remainingAttempts() > 0) return special;

    // PROBE PHASE: only if we still need digits and we have attempts to spend
    const probe = nextProbeIfNeeded();
    if (probe && remainingAttempts() > 0) {
      const relocatedProbe = probeWithRelocationGuess(probe);
      if (relocatedProbe) return relocatedProbe;
      return probe;
    }

    // RELOCATE PHASE
    return pickRelocationGuess();
  }

  /********************
   * UI
   ********************/
  const CSS = `
  #craigSolver {
    position: fixed; top: 120px; right: 20px;
    width: 340px;
    max-width: calc(100vw - 24px);
    background: #0b0b0b;
    border: 2px solid #ff8c00;
    border-radius: 12px;
    z-index: 999999;
    padding: 12px;
    color: #eee;
    font-family: Arial, sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,.45);
  }
  #craigSolver.collapsed #craigSolverBody { display: none; }
  #craigSolver.collapsed #craigTitleLeft { display: none; }
  #craigSolver.collapsed #craigAttemptInfo { display: none; }
  #craigSolver.collapsed .title { margin-bottom: 0; align-items: center; }
  #craigSolver.collapsed {
    width: auto;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }
  #craigSolver.collapsed #btnToggle { padding: 10px 12px; font-size: 13px; }
  #craigSolver .title {
    display:flex; align-items:baseline; justify-content:space-between;
    margin-bottom: 8px;
  }
  #craigSolver .title b { color:#ff8c00; font-size: 16px; letter-spacing:.2px; }
  #craigSolver .title small { color:#bbb; }

  #btnToggle {
    background: rgba(255,255,255,.08);
    color:#ddd;
    border:1px solid rgba(255,255,255,.18);
    padding: 8px 10px;
    font-weight: 900;
    border-radius: 10px;
  }

  #craigSolver .guessRow { display:flex; gap:10px; margin: 8px 0 10px 0; }
  .digitBox {
    width: 92px; height: 74px;
    display:flex; align-items:center; justify-content:center;
    border-radius: 12px;
    border: 2px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.06);
    font-size: 38px;
    font-weight: 900;
    user-select:none;
  }
  .fb-G { background: rgba(0,180,0,.35) !important; border-color: rgba(0,220,0,.75) !important; }
  .fb-O { background: rgba(255,140,0,.35) !important; border-color: rgba(255,170,0,.9) !important; }
  .fb-X { background: rgba(200,0,0,.28) !important; border-color: rgba(255,60,60,.75) !important; }

  #craigSolver .fbRow { display:flex; align-items:center; gap:8px; margin: 6px 0 10px 0; }
  #craigSolver button {
    border: none;
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    font-weight: 900;
    letter-spacing:.3px;
  }
  #craigSolver button:active { transform: translateY(1px); }

  #btnG { background: rgba(0,180,0,.35); color:#eaffea; border:1px solid rgba(0,220,0,.75); }
  #btnO { background: rgba(255,140,0,.35); color:#fff4e6; border:1px solid rgba(255,170,0,.9); }
  #btnX { background: rgba(200,0,0,.28); color:#ffecec; border:1px solid rgba(255,60,60,.75); }
  #craigSolver .miniBtn {
    background: rgba(255,255,255,.08);
    color:#ddd;
    border:1px solid rgba(255,255,255,.18);
    padding: 10px 10px;
    font-weight:800;
  }

  #craigSolver .meta { display:flex; gap:10px; flex-wrap:wrap; color:#bbb; font-size: 12px; margin-top: 8px; }
  #craigSolver .meta span b { color:#fff; }

  #craigSolver .history {
    margin-top: 10px;
    border-top: 1px solid rgba(255,255,255,.12);
    padding-top: 10px;
  }
  #craigSolver .historyTitle { display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; }
  #craigSolver .historyTitle b { color:#ff8c00; font-size: 13px; }
  #craigSolver .histList { max-height: 240px; overflow:auto; padding-right: 4px; }

  .histItem {
    display:flex; align-items:center; justify-content:space-between;
    gap:10px;
    padding: 6px 6px;
    border-radius: 10px;
    background: rgba(255,255,255,.04);
    margin-bottom: 6px;
    border: 1px solid rgba(255,255,255,.08);
  }
  .histDigits { display:flex; gap:6px; }
  .histDigits .digitBox {
    width: 46px; height: 38px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 900;
  }
  .histLabel { font-size: 12px; color:#bbb; white-space:nowrap; }

  #craigSolver .hint {
    margin-top: 8px;
    font-size: 12px;
    color: #cfcfcf;
    line-height: 1.35;
    background: rgba(255,140,0,.10);
    border: 1px solid rgba(255,140,0,.25);
    padding: 8px;
    border-radius: 10px;
  }
  #craigSolver .warn {
    margin-top: 8px;
    font-size: 12px;
    color: #ffecec;
    line-height: 1.35;
    background: rgba(200,0,0,.18);
    border: 1px solid rgba(255,60,60,.35);
    padding: 8px;
    border-radius: 10px;
    display:none;
  }

  @media (max-width: 520px) {
    #craigSolver {
      top: auto;
      bottom: 12px;
      right: 12px;
      left: 12px;
      width: auto;
      padding: 10px;
    }
    #craigSolver .title b { font-size: 15px; }
    #craigSolver .guessRow { gap: 8px; }
    .digitBox {
      width: calc((100vw - 24px - 20px - 16px) / 3);
      max-width: 100px;
      height: 60px;
      font-size: 32px;
    }
    #craigSolver button { padding: 10px 10px; }
    #craigSolver .histList { max-height: 160px; }
  }
  `;

  function ensureUI() {
    if (document.getElementById("craigSolver")) return;

    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const box = document.createElement("div");
    box.id = "craigSolver";
    box.innerHTML = `
      <div class="title">
        <div id="craigTitleLeft">
          <b>Chest Solver</b><br>
          <small>Craig Method (probe early-stop → relocate)</small>
        </div>
        <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
          <button id="btnToggle" title="Show/Hide">Hide</button>
          <div id="craigAttemptInfo">
            <small>Attempt</small><br>
            <b id="attShow" style="color:#fff">0</b><small style="color:#bbb">/4</small>
          </div>
        </div>
      </div>

      <div id="craigSolverBody">
        <div style="color:#bbb;font-size:12px;margin-top:4px;">Next guess</div>
        <div class="guessRow" id="guessRow">
          <div class="digitBox" id="d0">-</div>
          <div class="digitBox" id="d1">-</div>
          <div class="digitBox" id="d2">-</div>
        </div>

        <div style="color:#bbb;font-size:12px;">Tap feedback (left→right)</div>
        <div class="fbRow">
          <button id="btnG">GREEN</button>
          <button id="btnO">ORANGE</button>
          <button id="btnX">RED</button>
          <button id="btnBk" class="miniBtn" title="Backspace">⌫</button>
        </div>

        <div class="fbRow" style="justify-content:space-between;">
          <div style="font-size:13px;color:#bbb;">
            Feedback: <b id="fbShow" style="color:#fff">---</b>
          </div>
          <div style="display:flex; gap:8px;">
            <button id="btnCommit" class="miniBtn">Commit</button>
            <button id="btnReset" class="miniBtn">Reset</button>
          </div>
        </div>

        <div class="meta">
          <span>Possible: <b id="posShow">0</b></span>
          <span>Left: <b id="leftShow">4</b></span>
          <span>Known digits: <b id="knownShow">0</b></span>
          <span>Mode: <b id="modeShow">Probing</b></span>
        </div>

        <div class="hint" id="hintBox"></div>
        <div class="warn" id="warnBox"></div>

        <div class="history">
          <div class="historyTitle">
            <b>History</b>
            <span class="histLabel">Reset when you start a new chest</span>
          </div>
          <div class="histList" id="histList"></div>
        </div>
      </div>
    `;
    document.body.appendChild(box);

    document.getElementById("btnG").onclick = () => pushFB("G");
    document.getElementById("btnO").onclick = () => pushFB("O");
    document.getElementById("btnX").onclick = () => pushFB("X");
    document.getElementById("btnBk").onclick = () => backspaceFB();
    document.getElementById("btnCommit").onclick = commit;
    document.getElementById("btnReset").onclick = reset;

    const toggle = document.getElementById("btnToggle");
    const applyCollapsedUI = (collapsed) => {
      box.classList.toggle("collapsed", collapsed);
      toggle.textContent = collapsed ? "Show" : "Hide";
      try { localStorage.setItem("craigSolverCollapsed", collapsed ? "1" : "0"); } catch (_) {}
    };
    const initialCollapsed = (() => {
      try { return localStorage.getItem("craigSolverCollapsed") === "1"; } catch (_) { return false; }
    })();
    applyCollapsedUI(initialCollapsed);
    toggle.onclick = () => applyCollapsedUI(!box.classList.contains("collapsed"));
  }

  function pushFB(ch) {
    if (feedback.length >= 3) return;
    feedback += ch;
    update();
  }
  function backspaceFB() {
    feedback = feedback.slice(0, -1);
    update();
  }

  function fbClass(ch) {
    if (ch === "G") return "fb-G";
    if (ch === "O") return "fb-O";
    if (ch === "X") return "fb-X";
    return "";
  }

  function renderGuessBoxes(guess, fb) {
    const digits = guess.split("");
    for (let i = 0; i < 3; i++) {
      const el = document.getElementById("d" + i);
      el.textContent = digits[i] || "-";
      el.classList.remove("fb-G", "fb-O", "fb-X");
      const f = fb && fb[i] ? fb[i] : null;
      if (f) el.classList.add(fbClass(f));
    }
  }

  function setHintAndWarn() {
    const hint = document.getElementById("hintBox");
    const warn = document.getElementById("warnBox");
    warn.style.display = "none";
    warn.textContent = "";

    const ng = nextGuess();
    if (ng === "---") {
      hint.textContent = "No candidates left (feedback mismatch). Hit Reset and re-enter carefully.";
      return;
    }

    if (possible.length === 1) {
      hint.textContent = `Locked in ✅ Next guess should open it: ${possible[0]}`;
      return;
    }

    const probe = nextProbeIfNeeded();
    const mode = relocationMode() ? "Relocating" : "Probing";

    if (!relocationMode() && probe) {
      hint.textContent = `🔎 Probing: try ${ng}. We stop probing instantly when we’ve found all 3 digits.`;
    } else {
      hint.textContent = `🧠 Relocating: we’re permuting digits based on all orange/green rules. Next: ${ng}`;
    }

    // True ambiguity warning: last attempt and still 2 possible
    if (remainingAttempts() === 1 && possible.length > 1) {
      warn.style.display = "block";
      warn.textContent =
        `⚠️ Heads up: you’re on the FINAL attempt and there are still ${possible.length} valid codes. ` +
        `That’s a real 50/50 (or worse) with the info given. The game feedback can’t distinguish them.`;
    }
  }

  function renderHistory() {
    const wrap = document.getElementById("histList");
    wrap.innerHTML = "";

    history.slice().reverse().forEach((h, idx) => {
      const row = document.createElement("div");
      row.className = "histItem";

      const left = document.createElement("div");
      left.className = "histDigits";

      for (let i = 0; i < 3; i++) {
        const b = document.createElement("div");
        b.className = "digitBox";
        b.textContent = h.guess[i];
        b.classList.add(fbClass(h.feedback[i]));
        left.appendChild(b);
      }

      const right = document.createElement("div");
      right.className = "histLabel";
      right.textContent = `#${history.length - idx}  ${h.feedback}`;

      row.appendChild(left);
      row.appendChild(right);
      wrap.appendChild(row);
    });
  }

  /********************
   * GAME FLOW
   ********************/
  function commit() {
    if (feedback.length !== 3) return;
    if (attempt >= MAX_ATTEMPTS) return;

    const guess = nextGuess();
    if (!guess || guess === "---") return;

    history.push({ guess, feedback });

    // mark probe used (only if it matches a probe)
    if (PROBES.includes(guess)) usedProbes.add(guess);

    updateKnownDigits(guess, feedback);
    updateExcludedDigits(guess, feedback);
    inferFinalDigitIfForced();
    filterPossible(guess, feedback);

    attempt++;
    feedback = "";
    update();
  }

  function reset() {
    attempt = 0;
    feedback = "";
    history = [];
    possible = generateAll();
    knownDigits = new Set();
    excludedDigits = new Set();
    usedProbes = new Set();
    update();
  }

  function update() {
    ensureUI();
    const ng = nextGuess();

    // live coloring on the current "Next guess" boxes as user enters FB
    renderGuessBoxes(ng, feedback);

    document.getElementById("fbShow").textContent = feedback.padEnd(3, "-");
    document.getElementById("attShow").textContent = attempt;
    document.getElementById("posShow").textContent = possible.length;
    document.getElementById("leftShow").textContent = remainingAttempts();
    document.getElementById("knownShow").textContent = String(knownDigits.size);

    const mode = (!relocationMode() && nextProbeIfNeeded()) ? "Probing" : "Relocating";
    document.getElementById("modeShow").textContent = mode;

    setHintAndWarn();
    renderHistory();
  }

  reset();
})();
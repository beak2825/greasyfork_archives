// ==UserScript==
// @name         Torn Racing Filter (Standalone)
// @namespace    https://torn.com/
// @version      1.0.2
// @description  Adds filters to Custom Races list (hide protected/incompatible/paid/full, time, laps, drivers, track, name) and shows statistics.
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561734/Torn%20Racing%20Filter%20%28Standalone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561734/Torn%20Racing%20Filter%20%28Standalone%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Hard singleton guard that works across userscript sandboxes by storing a marker on the real DOM.
  // This prevents duplicate panels even if the script is injected twice / installed twice.
  const ROOT = document.documentElement;
  const MARKER_ATTR = "data-tt-racing-filter-loaded";
  if (ROOT && ROOT.hasAttribute(MARKER_ATTR)) return;
  if (ROOT) ROOT.setAttribute(MARKER_ATTR, "1");

  // Prevent running in iframes as well (extra safety).
  if (window.top !== window.self) return;

  console.log("[TT] Racing Filter userscript loaded");

  const PANEL_ID = "tt-racing-filter-panel";
  const STYLE_ID = "tt-racing-filter-style";
  const STORAGE_KEY = "tt_racing_filter_settings_v1";

  const TRACKS = [
    "Uptown",
    "Withdrawal",
    "Underdog",
    "Parkland",
    "Docks",
    "Commerce",
    "Two Islands",
    "Industrial",
    "Vector",
    "Mudpit",
    "Hammerhead",
    "Sewage",
    "Meltdown",
    "Speedway",
    "Stone Park",
    "Convict",
  ];

  const DEFAULTS = {
    hideRaces: [],
    timeStart: 0,
    timeEnd: 48,
    lapsMin: 1,
    lapsMax: 100,
    driversMin: 2,
    driversMax: 100,
    track: [],
    name: "",
  };

  let state = loadSettings();
  let mounted = false;
  let panelEl = null;
  let listObserver = null;
  let routeTick = null;
  let applyTick = null;

  injectStylesOnce();
  startRouteWatcher();

  function startRouteWatcher() {
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function () {
      origPushState.apply(this, arguments);
      onRouteChange();
    };
    history.replaceState = function () {
      origReplaceState.apply(this, arguments);
      onRouteChange();
    };
    window.addEventListener("popstate", onRouteChange);

    routeTick = setInterval(onRouteChange, 700);
    onRouteChange();
  }

  async function onRouteChange() {
    const isRacingCustom = isOnRacingCustomRace();
    if (!isRacingCustom) {
      if (mounted) unmount();
      return;
    }

    await requireElement(".custom-events-wrap", 20000).catch(() => null);
    await requireElement(".events-list", 20000).catch(() => null);

    if (!isOnRacingCustomRace()) {
      if (mounted) unmount();
      return;
    }

    if (!mounted) mount();

    scheduleApply();
  }

  function isOnRacingCustomRace() {
    const href = location.href;
    const sidOk = /[?&#]sid=racing\b/i.test(href) || /\bsid=racing\b/i.test(href);
    const tabOk = /[?&#]tab=customrace\b/i.test(href) || /\btab=customrace\b/i.test(href);
    const domHints = !!document.querySelector(".custom-events-wrap") && !!document.querySelector(".events-list");
    return (sidOk && tabOk) || domHints;
  }

  function mount() {
    // De-dupe any previous panel(s), even from older versions or duplicates.
    // Keep only one, and make sure it is the one with PANEL_ID.
    const existingById = document.getElementById(PANEL_ID);
    const allPanels = Array.from(document.querySelectorAll("section.tt-racing-filter"));
    allPanels.forEach((p) => {
      if (p !== existingById) p.remove();
    });

    if (existingById) {
      panelEl = existingById;
      mounted = true;
      attachListObserver();
      scheduleApply();
      return;
    }

    mounted = true;

    const anchor = document.querySelector(".custom-events-wrap");
    if (!anchor) return;

    panelEl = buildPanel();
    anchor.parentNode.insertBefore(panelEl, anchor);

    attachListObserver();
    scheduleApply();
  }

  function unmount() {
    mounted = false;

    if (listObserver) {
      listObserver.disconnect();
      listObserver = null;
    }

    const p = document.getElementById(PANEL_ID);
    if (p) p.remove();

    // Also remove any stray duplicates if they exist
    document.querySelectorAll("section.tt-racing-filter").forEach((x) => x.remove());

    panelEl = null;

    document.querySelectorAll(".events-list > li.tt-hidden").forEach((li) => li.classList.remove("tt-hidden"));
  }

  function attachListObserver() {
    const list = document.querySelector(".events-list");
    if (!list) return;

    if (listObserver) listObserver.disconnect();

    listObserver = new MutationObserver(() => scheduleApply());
    listObserver.observe(list, { childList: true, subtree: true, characterData: true });
  }

  function buildPanel() {
    const wrap = document.createElement("section");
    wrap.id = PANEL_ID;
    wrap.className = "tt-racing-filter tt-card";

    const header = document.createElement("div");
    header.className = "tt-card-header";

    const title = document.createElement("div");
    title.className = "tt-card-title";
    title.textContent = "Racing Filter";

    const stats = document.createElement("div");
    stats.className = "tt-stats";
    stats.innerHTML = `<span class="tt-stat">Showing <strong id="tt-showing">0</strong> of <strong id="tt-total">0</strong></span>`;

    header.appendChild(title);
    header.appendChild(stats);

    const body = document.createElement("div");
    body.className = "tt-card-body";

    const hideBox = document.createElement("div");
    hideBox.className = "tt-block";
    hideBox.innerHTML = `<div class="tt-block-title">Hide races</div>`;
    const hideGrid = document.createElement("div");
    hideGrid.className = "tt-grid";

    const hideOpts = [
      { key: "protected", label: "Protected" },
      { key: "incompatible", label: "Incompatible" },
      { key: "paid", label: "Paid fee" },
      { key: "full", label: "Full" },
    ];

    for (const opt of hideOpts) {
      const id = `tt-hide-${opt.key}`;
      const item = document.createElement("label");
      item.className = "tt-check";
      item.innerHTML = `<input type="checkbox" id="${id}"><span>${opt.label}</span>`;
      const input = item.querySelector("input");
      input.checked = state.hideRaces.includes(opt.key);
      input.addEventListener("change", () => {
        state.hideRaces = hideOpts
          .filter((o) => document.getElementById(`tt-hide-${o.key}`)?.checked)
          .map((o) => o.key);
        saveSettings(state);
        scheduleApply();
      });
      hideGrid.appendChild(item);
    }

    hideBox.appendChild(hideGrid);

    const sliders = document.createElement("div");
    sliders.className = "tt-block";

    sliders.appendChild(makeRangePair({
      id: "time",
      label: "Race Start In (hours)",
      min: 0,
      max: 48,
      step: 1,
      low: state.timeStart,
      high: state.timeEnd,
      onChange: (low, high) => {
        state.timeStart = low;
        state.timeEnd = high;
        saveSettings(state);
        scheduleApply();
      }
    }));

    sliders.appendChild(makeRangePair({
      id: "laps",
      label: "Laps",
      min: 1,
      max: 100,
      step: 1,
      low: state.lapsMin,
      high: state.lapsMax,
      onChange: (low, high) => {
        state.lapsMin = low;
        state.lapsMax = high;
        saveSettings(state);
        scheduleApply();
      }
    }));

    sliders.appendChild(makeRangePair({
      id: "drivers",
      label: "Maximum Drivers Allowed",
      min: 2,
      max: 100,
      step: 1,
      low: state.driversMin,
      high: state.driversMax,
      onChange: (low, high) => {
        state.driversMin = low;
        state.driversMax = high;
        saveSettings(state);
        scheduleApply();
      }
    }));

    const trackBox = document.createElement("div");
    trackBox.className = "tt-block";
    const trackTitle = document.createElement("div");
    trackTitle.className = "tt-block-title";
    trackTitle.textContent = "Track";
    const trackSelect = document.createElement("select");
    trackSelect.id = "tt-track";
    trackSelect.multiple = true;
    trackSelect.size = 6;
    trackSelect.className = "tt-select";
    TRACKS.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      opt.selected = state.track.includes(t);
      trackSelect.appendChild(opt);
    });
    trackSelect.addEventListener("change", () => {
      state.track = Array.from(trackSelect.selectedOptions).map((o) => o.value);
      saveSettings(state);
      scheduleApply();
    });

    const trackHint = document.createElement("div");
    trackHint.className = "tt-hint";
    trackHint.textContent = "Tip: hold Ctrl/⌘ to select multiple (or just tap multiple times on mobile).";

    trackBox.appendChild(trackTitle);
    trackBox.appendChild(trackSelect);
    trackBox.appendChild(trackHint);

    const nameBox = document.createElement("div");
    nameBox.className = "tt-block";
    const nameTitle = document.createElement("div");
    nameTitle.className = "tt-block-title";
    nameTitle.textContent = "Race name contains";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "tt-name";
    nameInput.className = "tt-input";
    nameInput.placeholder = "e.g. fun run";
    nameInput.value = state.name || "";
    nameInput.addEventListener("input", () => {
      state.name = nameInput.value || "";
      saveSettings(state);
      scheduleApply();
    });

    const actions = document.createElement("div");
    actions.className = "tt-actions";
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "tt-btn";
    resetBtn.textContent = "Reset filters";
    resetBtn.addEventListener("click", () => {
      state = { ...DEFAULTS };
      saveSettings(state);

      const existing = document.getElementById(PANEL_ID);
      if (existing) existing.remove();

      panelEl = buildPanel();
      const anchor = document.querySelector(".custom-events-wrap");
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(panelEl, anchor);

      scheduleApply();
    });
    actions.appendChild(resetBtn);

    nameBox.appendChild(nameTitle);
    nameBox.appendChild(nameInput);

    body.appendChild(hideBox);
    body.appendChild(sliders);
    body.appendChild(trackBox);
    body.appendChild(nameBox);
    body.appendChild(actions);

    wrap.appendChild(header);
    wrap.appendChild(body);

    return wrap;
  }

  function makeRangePair({ id, label, min, max, step, low, high, onChange }) {
    const block = document.createElement("div");
    block.className = "tt-range-block";

    const top = document.createElement("div");
    top.className = "tt-range-top";

    const title = document.createElement("div");
    title.className = "tt-range-title";
    title.textContent = label;

    const value = document.createElement("div");
    value.className = "tt-range-value";
    value.id = `tt-${id}-value`;
    value.textContent = `${low} - ${high}`;

    top.appendChild(title);
    top.appendChild(value);

    const row = document.createElement("div");
    row.className = "tt-range-row";

    const lowInput = document.createElement("input");
    lowInput.type = "range";
    lowInput.min = String(min);
    lowInput.max = String(max);
    lowInput.step = String(step);
    lowInput.value = String(low);
    lowInput.id = `tt-${id}-low`;

    const highInput = document.createElement("input");
    highInput.type = "range";
    highInput.min = String(min);
    highInput.max = String(max);
    highInput.step = String(step);
    highInput.value = String(high);
    highInput.id = `tt-${id}-high`;

    const sync = () => {
      let a = parseInt(lowInput.value, 10);
      let b = parseInt(highInput.value, 10);
      if (a > b) [a, b] = [b, a];
      lowInput.value = String(a);
      highInput.value = String(b);
      value.textContent = `${a} - ${b}`;
      onChange(a, b);
    };

    lowInput.addEventListener("input", sync);
    highInput.addEventListener("input", sync);

    row.appendChild(lowInput);
    row.appendChild(highInput);

    block.appendChild(top);
    block.appendChild(row);

    return block;
  }

  function scheduleApply() {
    if (applyTick) clearTimeout(applyTick);
    applyTick = setTimeout(applyFilters, 120);
  }

  async function applyFilters() {
    if (!mounted || !isOnRacingCustomRace()) return;

    const list = document.querySelector(".events-list");
    if (!list) return;

    const items = Array.from(document.querySelectorAll(".events-list > li"));
    if (!items.length) {
      updateStats(0, 0);
      return;
    }

    const hide = state.hideRaces || [];
    const timeStart = toInt(state.timeStart, 0);
    const timeEnd = toInt(state.timeEnd, 48);
    const minLaps = toInt(state.lapsMin, 1);
    const maxLaps = toInt(state.lapsMax, 100);
    const driversMin = toInt(state.driversMin, 2);
    const driversMax = toInt(state.driversMax, 100);
    const trackFilter = Array.isArray(state.track) ? state.track : [];
    const nameNeedle = (state.name || "").toLowerCase().trim();

    let total = 0;
    let showing = 0;

    for (const li of items) {
      if (li.className === "clear") continue;
      total++;

      const isProtected = li.classList.contains("protected");
      const isIncompatible = li.classList.contains("no-suitable");

      let hasFee = false;
      const feeElement = li.querySelector("li.fee");
      if (feeElement) {
        const feeText = (feeElement.textContent || "").replace(/\D/g, "");
        const feeAmount = parseInt(feeText || "0", 10);
        hasFee = feeAmount > 0;
      }

      let isFull = false;
      let maxDriversAllowed = 0;
      const driversElement = li.querySelector("li.drivers");
      if (driversElement) {
        const text = (driversElement.textContent || "").replace(/\s+/g, "");
        const match = text.match(/(\d+)\/(\d+)/);
        if (match) {
          const driversJoined = parseInt(match[1], 10);
          maxDriversAllowed = parseInt(match[2], 10);
          if (driversJoined >= maxDriversAllowed) isFull = true;
        }
      }

      let laps = 0;
      const lapsEl = li.querySelector(".laps");
      if (lapsEl) {
        const m = (lapsEl.textContent || "").match(/\d+/);
        laps = m ? parseInt(m[0], 10) : 0;
      }

      let totalHours = 0;
      const timeEl = li.querySelector(".event-wrap .startTime");
      const timeText = (timeEl ? timeEl.textContent : "").trim();
      if (!timeText || timeText.toLowerCase() === "waiting") {
        totalHours = -1;
      } else {
        const clean = timeText.toLowerCase();
        const hoursMatch = clean.match(/(\d+)\s*h/);
        const minsMatch = clean.match(/(\d+)\s*m/);
        const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
        const minutes = minsMatch ? parseInt(minsMatch[1], 10) : 0;
        totalHours = hours + Math.floor(minutes / 60);
      }

      let trackName = "";
      const trackElement = li.querySelector("li.track");
      if (trackElement) {
        trackName = Array.from(trackElement.childNodes)
          .filter((n) => n && n.nodeType === Node.TEXT_NODE)
          .map((n) => (n.textContent || "").trim())
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
      }

      let raceName = "";
      const raceNameEl = li.querySelector(".event-wrap .name");
      if (raceNameEl) raceName = raceNameEl.textContent || "";

      if (hide.includes("protected") && isProtected) {
        hideRow(li);
        continue;
      }
      if (hide.includes("incompatible") && isIncompatible) {
        hideRow(li);
        continue;
      }
      if (hide.includes("paid") && hasFee) {
        hideRow(li);
        continue;
      }
      if (hide.includes("full") && isFull) {
        hideRow(li);
        continue;
      }

      if (maxDriversAllowed < driversMin || maxDriversAllowed > driversMax) {
        hideRow(li);
        continue;
      }

      if (laps < minLaps || laps > maxLaps) {
        hideRow(li);
        continue;
      }

      if (timeStart === 0 && timeEnd === 0 && totalHours === -1) {
      } else if ((timeStart && totalHours < timeStart) || (timeEnd !== 48 && totalHours >= timeEnd)) {
        hideRow(li);
        continue;
      }

      if (trackFilter.length && !trackFilter.includes(trackName)) {
        hideRow(li);
        continue;
      }

      if (nameNeedle && !raceName.toLowerCase().includes(nameNeedle)) {
        hideRow(li);
        continue;
      }

      showRow(li);
      showing++;
    }

    updateStats(showing, total);
  }

  function updateStats(showing, total) {
    const showingEl = document.getElementById("tt-showing");
    const totalEl = document.getElementById("tt-total");
    if (showingEl) showingEl.textContent = String(showing);
    if (totalEl) totalEl.textContent = String(total);
  }

  function showRow(li) {
    li.classList.remove("tt-hidden");
  }

  function hideRow(li) {
    li.classList.add("tt-hidden");
  }

  function toInt(v, fallback) {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;

    const css = `
      .events-list > li.tt-hidden { display: none !important; }

      .tt-card {
        margin-top: 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.25);
        backdrop-filter: blur(6px);
        overflow: hidden;
      }
      .tt-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.10);
      }
      .tt-card-title {
        font-weight: 800;
        letter-spacing: 0.2px;
      }
      .tt-stats {
        font-size: 12px;
        opacity: 0.9;
      }
      .tt-card-body {
        padding: 12px;
        display: grid;
        gap: 12px;
      }
      .tt-block-title {
        font-weight: 700;
        margin-bottom: 8px;
        opacity: 0.95;
      }
      .tt-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px 10px;
      }
      .tt-check {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 13px;
        user-select: none;
      }
      .tt-check input { transform: translateY(1px); }

      .tt-range-block {
        padding: 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.04);
        margin-bottom: 10px;
      }
      .tt-range-top {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
        font-size: 13px;
      }
      .tt-range-title { font-weight: 700; }
      .tt-range-value { opacity: 0.9; font-variant-numeric: tabular-nums; }
      .tt-range-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .tt-range-row input[type="range"] { width: 100%; }

      .tt-select {
        width: 100%;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.18);
        color: inherit;
        padding: 8px;
        outline: none;
      }
      .tt-input {
        width: 100%;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.18);
        color: inherit;
        padding: 10px 10px;
        outline: none;
      }
      .tt-hint {
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.75;
      }
      .tt-actions { display: flex; justify-content: flex-end; }
      .tt-btn {
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color: inherit;
        padding: 8px 10px;
        font-weight: 700;
        cursor: pointer;
      }
      .tt-btn:active { transform: translateY(1px); }
    `.trim();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function loadSettings() {
    try {
      const raw = gmGet(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return normalizeSettings(parsed);
    } catch {
      return { ...DEFAULTS };
    }
  }

  function saveSettings(next) {
    try {
      gmSet(STORAGE_KEY, JSON.stringify(normalizeSettings(next)));
    } catch {
    }
  }

  function normalizeSettings(v) {
    const o = (v && typeof v === "object") ? v : {};
    const out = { ...DEFAULTS };

    out.hideRaces = Array.isArray(o.hideRaces) ? o.hideRaces.filter((x) => typeof x === "string") : DEFAULTS.hideRaces;
    out.timeStart = clampInt(o.timeStart, 0, 48, DEFAULTS.timeStart);
    out.timeEnd = clampInt(o.timeEnd, 0, 48, DEFAULTS.timeEnd);
    out.lapsMin = clampInt(o.lapsMin, 1, 100, DEFAULTS.lapsMin);
    out.lapsMax = clampInt(o.lapsMax, 1, 100, DEFAULTS.lapsMax);
    out.driversMin = clampInt(o.driversMin, 2, 100, DEFAULTS.driversMin);
    out.driversMax = clampInt(o.driversMax, 2, 100, DEFAULTS.driversMax);
    out.track = Array.isArray(o.track) ? o.track.filter((t) => TRACKS.includes(t)) : DEFAULTS.track;
    out.name = typeof o.name === "string" ? o.name : DEFAULTS.name;

    if (out.timeStart > out.timeEnd) [out.timeStart, out.timeEnd] = [out.timeEnd, out.timeStart];
    if (out.lapsMin > out.lapsMax) [out.lapsMin, out.lapsMax] = [out.lapsMax, out.lapsMin];
    if (out.driversMin > out.driversMax) [out.driversMin, out.driversMax] = [out.driversMax, out.driversMin];

    return out;
  }

  function clampInt(v, min, max, fallback) {
    const n = parseInt(String(v), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function gmGet(key) {
    try {
      if (typeof GM_getValue === "function") return GM_getValue(key, "");
    } catch {}
    try {
      return localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function gmSet(key, value) {
    try {
      if (typeof GM_setValue === "function") return GM_setValue(key, value);
    } catch {}
    try {
      localStorage.setItem(key, value);
    } catch {}
  }

  function requireElement(selector, timeoutMs) {
    const el = document.querySelector(selector);
    if (el) return Promise.resolve(el);

    const start = Date.now();
    return new Promise((resolve, reject) => {
      const obs = new MutationObserver(() => {
        const node = document.querySelector(selector);
        if (node) {
          obs.disconnect();
          resolve(node);
        } else if (Date.now() - start > timeoutMs) {
          obs.disconnect();
          reject(new Error("Timeout waiting for " + selector));
        }
      });

      obs.observe(document.documentElement, { childList: true, subtree: true });

      const t = setInterval(() => {
        const node = document.querySelector(selector);
        if (node) {
          clearInterval(t);
          obs.disconnect();
          resolve(node);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(t);
          obs.disconnect();
          reject(new Error("Timeout waiting for " + selector));
        }
      }, 250);
    });
  }
})();

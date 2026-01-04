// ==UserScript==
// @name         TIDAL Availability
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tidal.com
// @namespace    https://tidal.com/
// @version      2.3.1
// @author       Zxcvr
// @description  TIDAL track/album availability across regions. Qobuz-style UI/UX: auto-start, search, copy icons, progress bar, floating+minimize (remembered), preferred countries (global highlight). No login.
// @match        https://tidal.com/*
// @match        https://www.tidal.com/*
// @match        https://listen.tidal.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      api.tidal.com
// @downloadURL https://update.greasyfork.org/scripts/559043/TIDAL%20Availability.user.js
// @updateURL https://update.greasyfork.org/scripts/559043/TIDAL%20Availability.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ---------- CONFIG ----------
  const API_BASE = "https://api.tidal.com/v1";
  const FALLBACK_X_TIDAL_TOKEN = "gsFXkJqGrUNoYMQPZe4k3WKwijnrp8iGSwn3bApe";
  const CONCURRENCY = 8;

  const AUTO_DELAY_MS = 550;
  const AUTO_MAX_TRIES = 6;

  // Persist globally (TIDAL-only keys)
  const STORE_KEY_FLOAT = "ta_av_floating_v1";
  const STORE_KEY_MIN   = "ta_av_minimized_v1";
  const STORE_KEY_PREF  = "ta_av_prefCountries_v1";

  const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  // TIDAL supported countries list (fallback / union)
  const TIDAL_MARKETS = [
    "NG","ZA","UG",
    "HK","IL","MY","SG","TH","AE",
    "AL","AD","AT","BE","BA","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","MC","ME","NL","MK","NO","PL","PT","RO","RS","SK","SI","ES","SE","CH","GB",
    "CA","DO","JM","MX","PR","US",
    "AR","BR","CL","CO","PE",
    "AU","NZ"
  ].sort();

  // ---------- TOKEN CAPTURE (guest-friendly) ----------
  let observedXToken = null;
  hookFetchAndXHR();

  function hookFetchAndXHR() {
    const ofetch = window.fetch;
    window.fetch = function (input, init) {
      try {
        const headers = new Headers((init && init.headers) || (input && input.headers) || undefined);
        const xt = headers.get("x-tidal-token") || headers.get("X-Tidal-Token");
        if (xt && !observedXToken) observedXToken = xt;
      } catch {}
      return ofetch.apply(this, arguments);
    };

    const oset = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
      try {
        if (!observedXToken && String(name).toLowerCase() === "x-tidal-token") observedXToken = value;
      } catch {}
      return oset.apply(this, arguments);
    };
  }

  function getXToken() {
    return observedXToken || FALLBACK_X_TIDAL_TOKEN;
  }

  // ---------- COUNTRY NAMES (fallback to Intl) ----------
  const regionNames = (() => {
    try { return new Intl.DisplayNames(["en"], { type: "region" }); } catch { return null; }
  })();

  function fallbackName(cc) {
    const c = String(cc || "").toUpperCase();
    if (regionNames) {
      try { return regionNames.of(c) || c; } catch { return c; }
    }
    return c;
  }

  // ---------- FLAGS (Twemoji SVG) ----------
  function flagSvgUrl(cc) {
    cc = String(cc || "").toUpperCase();
    if (!/^[A-Z]{2}$/.test(cc)) return null;
    const base = 0x1F1E6;
    const a = base + (cc.charCodeAt(0) - 65);
    const b = base + (cc.charCodeAt(1) - 65);
    const hex = (n) => n.toString(16);
    return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${hex(a)}-${hex(b)}.svg`;
  }

  // ---------- RESOURCE PARSE ----------
  function parseResource() {
    const m = location.pathname.match(/\/(?:browse\/)?(album|track)\/(\d+)/i);
    if (!m) return null;
    return { type: m[1].toLowerCase(), id: m[2] };
  }

  // ---------- NETWORK ----------
  function gmJson(url, headers) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers,
        responseType: "json",
        timeout: 25000,
        onload: (r) => resolve({ status: r.status, data: r.response }),
        onerror: (e) => reject(e),
        ontimeout: () => reject(new Error("Request timed out")),
      });
    });
  }

  async function getMarketsAndNames() {
    const headers = { "x-tidal-token": getXToken(), "accept": "application/json" };
    const nameMap = new Map();

    try {
      const r = await gmJson(`${API_BASE}/countries`, headers);
      if (r.status === 200 && Array.isArray(r.data)) {
        for (const x of r.data) {
          const code = String(x?.countryCode || "").toUpperCase();
          if (!/^[A-Z]{2}$/.test(code)) continue;
          const nm = String(x?.name || x?.countryName || x?.country || "").trim();
          if (nm) nameMap.set(code, nm);
        }
      }
    } catch { /* ignore */ }

    const codes = new Set(TIDAL_MARKETS);
    for (const k of nameMap.keys()) codes.add(k);

    for (const c of codes) {
      if (!nameMap.has(c)) nameMap.set(c, fallbackName(c));
    }

    return { codes: Array.from(codes).sort(), names: nameMap };
  }

  async function checkOne(resource, cc) {
    const url = `${API_BASE}/${resource.type}s/${resource.id}?countryCode=${encodeURIComponent(cc)}`;
    const headers = { "x-tidal-token": getXToken(), "accept": "application/json" };

    let r = await gmJson(url, headers);
    if (r.status === 429) { await sleep(800); r = await gmJson(url, headers); }

    if (r.status === 200) return true;
    if (r.status === 404 || r.status === 400) return false;

    if (r.status === 401 || r.status === 403) throw new Error(`Token rejected (${r.status}).`);
    return null;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ---------- PREF (global highlight) ----------
  const PREF = {
    set: new Set(),
    allowed: new Set(TIDAL_MARKETS),
    load() {
      try {
        const raw = lsGet(STORE_KEY_PREF);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return;
        this.set = new Set(
          arr.map(x => String(x || "").toUpperCase()).filter(x => this.allowed.has(x))
        );
      } catch {}
    },
    save() { try { lsSet(STORE_KEY_PREF, JSON.stringify(Array.from(this.set).sort())); } catch {} },
    has(cc) { return this.set.has(String(cc || "").toUpperCase()); },
    toggle(cc) {
      cc = String(cc || "").toUpperCase();
      if (!cc) return;
      if (this.set.has(cc)) this.set.delete(cc);
      else this.set.add(cc);
      this.save();
    }
  };
  PREF.load();

  // ---------- PLACEMENT (copied from your original TIDAL logic) ----------
  function findHeadingAnchor(root, texts) {
    const els = Array.from(root.querySelectorAll("h1,h2,h3,h4,[role='heading']"));
    for (const el of els) {
      const t = (el.textContent || "").trim().toLowerCase();
      if (!t) continue;
      if (texts.some(x => t === x.toLowerCase())) return el.closest("section,div") || el;
    }
    return null;
  }

  function findTracklist(root) {
    const footer = root.querySelector("footer") || document.querySelector("footer");
    const lists = Array.from(root.querySelectorAll("ol,ul")).filter(L => !(footer && footer.contains(L)));
    const timeRe = /\b\d{1,2}:\d{2}\b/;

    let best = null, bestScore = -1;
    for (const L of lists) {
      const items = Array.from(L.querySelectorAll("li"));
      if (items.length < 3) continue;
      let hits = 0;
      for (const li of items.slice(0, 30)) if (timeRe.test(li.textContent || "")) hits++;
      const score = hits * 100 + items.length;
      if (score > bestScore) { bestScore = score; best = L; }
    }
    return best;
  }

  function mountBox(node) {
    if (!node) return;

    // floating: keep in <body> to avoid weird scroll containers/transform parents
    if (node.classList.contains("ta-floating")) {
      if (node.parentElement !== document.body) document.body.appendChild(node);
      return;
    }

    const main =
      document.querySelector("main,[role='main']") ||
      document.querySelector("#__next") ||
      document.body;

    const anchor = findHeadingAnchor(main, ["Related Artists","You might also like","More by","Appears On","Related Albums"]);
    if (anchor && anchor.parentElement) {
      if (node.parentElement !== anchor.parentElement || node.nextSibling !== anchor) {
        anchor.parentElement.insertBefore(node, anchor);
      }
      return;
    }

    const trackList = findTracklist(main);
    if (trackList && trackList.parentElement) {
      const parent = trackList.parentElement;
      const ref = trackList.nextSibling;
      if (node.parentElement !== parent || node.nextSibling !== ref) parent.insertBefore(node, ref);
      return;
    }

    if (node.parentElement !== main) main.prepend(node);
  }

  // ---------- UI (Qobuz-style panel) ----------
  const COPY_SVG = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 9h10v10H9V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  let box = null;
  let lastHref = location.href;
  let cancelRequested = false;
  let autoRunTimer = null;
  let autoTries = 0;

  const STATE = {
    codes: TIDAL_MARKETS.slice(),
    names: new Map(TIDAL_MARKETS.map(cc => [cc, fallbackName(cc)])),
    filter: "",
    availableLive: [],
    unavailableLive: [],
    unknownLive: []
  };

  GM_addStyle(`
    .ta-av-wrap{
      margin:10px auto;
      padding:10px 10px 8px;
      max-width: 920px;
      width: calc(100% - 24px);
      border:1px solid rgba(255,255,255,.18);
      border-radius:14px;
      background:rgba(0,0,0,.35);
      color:#fff;
      font: 13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      backdrop-filter: blur(6px);
      box-shadow: 0 12px 34px rgba(0,0,0,.20);
      z-index:999999;
    }

    .ta-titlebar{display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;}
    .ta-title{font-size:18px;font-weight:900;margin:0; display:flex; align-items:baseline; gap:10px;}
    .ta-credit{font-size:12px; font-weight:900; opacity:.7; letter-spacing:.2px;}

    .ta-titlebtns{display:flex;gap:8px;align-items:center}
    .ta-iconbtn{
      width:34px;height:34px;border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      color:#fff; cursor:pointer;
      display:inline-flex;align-items:center;justify-content:center;
      font-weight:900;
    }
    .ta-iconbtn:hover{background:rgba(255,255,255,.12)}
    .ta-av-wrap:not(.ta-floating) .ta-iconbtn.minbtn{display:none;}

    .ta-toprow{display:flex; gap:10px; flex-wrap:wrap; align-items:center}
    .ta-toprow input{
      width: 260px; max-width: 65vw;
      padding:7px 10px;border-radius:9999px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.06);
      color:#fff; outline:none; font-weight:700;
    }
    .ta-btns{display:flex;gap:8px;flex-wrap:wrap}
    .ta-btns button{
      padding:7px 10px;border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      color:#fff; cursor:pointer; font-weight:700
    }
    .ta-btns button:hover{background:rgba(255,255,255,.12)}

    .ta-progress{font-size:12px; opacity:.9; margin:6px 0 6px; min-height:14px;}

    #ta_bar{
      width:100%; height:6px; display:none; margin:6px 0 0;
      border-radius:9999px; overflow:hidden; accent-color:#18c1c1;
    }
    #ta_bar::-webkit-progress-bar{background:rgba(255,255,255,.14);border-radius:9999px;}
    #ta_bar::-webkit-progress-value{background:rgba(24,193,193,.90);border-radius:9999px;}
    #ta_bar::-moz-progress-bar{background:rgba(24,193,193,.90);border-radius:9999px;}

    .ta-block{background:rgba(0,0,0,.30); border:1px solid rgba(255,255,255,.12); padding:10px; border-radius:12px; margin-top:10px;}
    .ta-h{font-weight:900;margin:0 0 8px;font-size:16px}

    .ta-section-head{display:flex; align-items:center; gap:8px; margin:10px 0 7px; font-weight:900; font-size:15px;}
    .ta-copybtn{
      width:34px;height:34px;border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      display:inline-flex; align-items:center; justify-content:center;
      cursor:pointer;
    }
    .ta-copybtn:hover{background:rgba(255,255,255,.12)}
    .ta-copybtn svg{width:18px;height:18px;opacity:.95}

    .ta-row{display:flex;flex-wrap:wrap;gap:8px}

    .ta-chip{
      position:relative;
      display:inline-flex; align-items:center; gap:8px;
      padding:6px 10px; border-radius:9999px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.06);
      font-weight:900; color:#fff; user-select:none;
    }
    .ta-chip:hover{background:rgba(255,255,255,.10)}
    .ta-chip.ta-unav{opacity:.55;background:rgba(255,255,255,.04)}
    .ta-chip.ta-hidden{display:none}

    .ta-chip.ta-pref{
      border-color: rgba(24,193,193,.75);
      box-shadow: 0 0 0 1px rgba(24,193,193,.35) inset;
      background: rgba(24,193,193,.10);
    }

    .ta-flag{width:18px;height:18px;border-radius:2px;object-fit:cover;display:block;box-shadow:0 0 0 1px rgba(255,255,255,.12) inset;}

    .ta-chip:hover::after{
      content: attr(data-name);
      position:absolute; left:0; top:calc(100% + 8px);
      background: rgba(10,10,10,0.98);
      border: 1px solid rgba(255,255,255,.22);
      padding: 6px 10px;
      border-radius: 10px;
      white-space: nowrap;
      z-index: 999999;
      font-weight: 800;
      pointer-events:none;
    }

    .ta-floating{
      position:fixed;right:14px;bottom:14px;
      width:min(560px, calc(100vw - 28px));
      max-width:none;
      max-height:75vh;overflow:auto;
      margin:0;
    }
    .ta-floating.ta-minimized{
      width:360px; max-height:none; overflow:hidden; padding:10px 10px 10px;
    }
    .ta-minimized .ta-toprow,
    .ta-minimized #ta_out,
    .ta-minimized #ta_progress,
    .ta-minimized #ta_bar,
    .ta-minimized #ta_adv{display:none;}

    #ta_adv{margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.12);}
    #ta_adv summary{cursor:pointer;list-style:none;font-weight:900;opacity:.9;user-select:none;}
    #ta_adv summary::-webkit-details-marker{display:none;}
    #ta_pref_list{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;max-height:180px;overflow:auto;padding-right:6px;}
  `);

  function setProgress(msg) {
    const el = box?.querySelector("#ta_progress");
    if (el) el.textContent = msg || "";
  }

  function showBar(total) {
    const bar = box?.querySelector("#ta_bar");
    if (!bar) return;
    bar.max = total || 1;
    bar.value = 0;
    bar.style.display = "block";
  }
  function setBar(done, total) {
    const bar = box?.querySelector("#ta_bar");
    if (!bar) return;
    if (typeof total === "number") bar.max = total || 1;
    bar.value = done || 0;
  }
  function hideBar() {
    const bar = box?.querySelector("#ta_bar");
    if (!bar) return;
    bar.style.display = "none";
    bar.value = 0;
  }

  function updateMinBtn() {
    const btn = box?.querySelector("#ta_min");
    if (!btn) return;
    const minimized = box.classList.contains("ta-minimized");
    btn.textContent = minimized ? "▢" : "—";
    btn.title = minimized ? "Expand" : "Minimize";
  }

  function applySavedFloatMinState() {
    const floatOn = lsGet(STORE_KEY_FLOAT) === "1";
    box.classList.toggle("ta-floating", floatOn);

    const minOn = lsGet(STORE_KEY_MIN) === "1";
    box.classList.toggle("ta-minimized", floatOn && minOn);

    updateMinBtn();
  }

  function setMinimized(on) {
    box.classList.toggle("ta-minimized", !!on);
    lsSet(STORE_KEY_MIN, on ? "1" : "0");
    updateMinBtn();
  }

  function applyPrefsToRendered() {
    if (!box) return;
    for (const el of box.querySelectorAll(".ta-chip[data-code],.ta-chip[data-cc]")) {
      const cc = String(el.dataset.code || el.dataset.cc || "").toUpperCase();
      el.classList.toggle("ta-pref", PREF.has(cc));
    }
  }

  function applyFilter(q) {
    STATE.filter = (q || "").trim().toLowerCase();
    if (!box) return;
    const chips = box.querySelectorAll(".ta-chip[data-code]");
    chips.forEach(ch => {
      const cc = (ch.dataset.code || "").toLowerCase();
      const name = (ch.dataset.name || "").toLowerCase();
      const ok = !STATE.filter || cc.includes(STATE.filter) || name.includes(STATE.filter);
      ch.classList.toggle("ta-hidden", !ok);
    });
  }

  function renderPrefChooser() {
    const host = box?.querySelector("#ta_pref_list");
    if (!host) return;

    host.innerHTML = "";
    const codes = (STATE.codes && STATE.codes.length ? STATE.codes : TIDAL_MARKETS).slice().sort();
    PREF.allowed = new Set(codes);

    for (const cc of codes) {
      const name = STATE.names.get(cc) || fallbackName(cc);

      const el = document.createElement("span");
      el.className = "ta-chip";
      el.dataset.cc = cc;
      el.dataset.name = name;
      el.title = name;

      const svg = flagSvgUrl(cc);
      if (svg) {
        const img = document.createElement("img");
        img.className = "ta-flag";
        img.alt = "";
        img.src = svg;
        img.addEventListener("error", () => img.remove(), { once: true });
        setTimeout(() => { if (!img.complete || img.naturalWidth === 0) img.remove(); }, 2500);
        el.appendChild(img);
      }

      const label = document.createElement("span");
      label.textContent = cc;
      el.appendChild(label);

      el.addEventListener("click", () => {
        PREF.toggle(cc);
        applyPrefsToRendered();
      });

      host.appendChild(el);
    }

    applyPrefsToRendered();
  }

  function ensureBox() {
    if (box && document.contains(box)) return box;

    box = document.createElement("div");
    box.className = "ta-av-wrap";
    box.innerHTML = `
      <div class="ta-titlebar">
        <div class="ta-title">TIDAL Availability <span class="ta-credit">by Zxcvr</span></div>
        <div class="ta-titlebtns">
          <button class="ta-iconbtn minbtn" id="ta_min" title="Minimize">—</button>
        </div>
      </div>

      <div class="ta-toprow">
        <input id="ta_filter" placeholder="Search (JP / Japan / United...)" />
        <div class="ta-btns">
          <button id="ta_float">Toggle Floating</button>
        </div>
      </div>

      <div class="ta-progress" id="ta_progress"></div>
      <progress id="ta_bar" max="1" value="0"></progress>
      <div id="ta_out"></div>

      <details id="ta_adv">
        <summary>Advanced</summary>
        <div style="font-weight:900; opacity:.9; margin-top:8px;">Choose default country(s)</div>
        <div id="ta_pref_list"></div>
      </details>
    `;

    applySavedFloatMinState();
    mountBox(box);

    box.querySelector("#ta_min").onclick = () => setMinimized(!box.classList.contains("ta-minimized"));

    box.querySelector("#ta_float").onclick = () => {
      const nowOn = !box.classList.contains("ta-floating");
      box.classList.toggle("ta-floating", nowOn);
      lsSet(STORE_KEY_FLOAT, nowOn ? "1" : "0");

      if (nowOn) {
        const savedMin = lsGet(STORE_KEY_MIN) === "1";
        box.classList.toggle("ta-minimized", savedMin);
      } else {
        box.classList.remove("ta-minimized");
      }
      updateMinBtn();
      mountBox(box);
    };

    box.querySelector("#ta_filter").oninput = (e) => applyFilter(e.target.value);

    updateMinBtn();
    renderPrefChooser();
    return box;
  }

  function makeChip(cc, name, cls) {
    const el = document.createElement("span");
    el.className = `ta-chip ${cls || ""}`.trim();
    el.dataset.code = cc;
    el.dataset.name = name;
    el.title = name;

    const svg = flagSvgUrl(cc);
    if (svg) {
      const img = document.createElement("img");
      img.className = "ta-flag";
      img.alt = "";
      img.src = svg;
      img.addEventListener("error", () => img.remove(), { once: true });
      setTimeout(() => { if (!img.complete || img.naturalWidth === 0) img.remove(); }, 2500);
      el.appendChild(img);
    }

    const label = document.createElement("span");
    label.textContent = cc;
    el.appendChild(label);

    if (PREF.has(cc)) el.classList.add("ta-pref");
    return el;
  }

  function renderLiveShell(kind) {
    const out = box.querySelector("#ta_out");
    out.innerHTML = `
      <div class="ta-block">
        <div class="ta-h">${kind} Availability</div>

        <div class="ta-section-head">
          <span id="ta_av_count">Available in (0):</span>
          <button class="ta-copybtn" id="ta_copy_av" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="ta-row" id="ta_av_list"></div>

        <div class="ta-section-head" style="margin-top:12px;">
          <span id="ta_un_count">Unavailable in (0):</span>
          <button class="ta-copybtn" id="ta_copy_un" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="ta-row" id="ta_un_list"></div>

        <div class="ta-section-head" id="ta_uk_head" style="margin-top:12px; display:none;">
          <span id="ta_uk_count">Unknown in (0):</span>
          <button class="ta-copybtn" id="ta_copy_uk" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="ta-row" id="ta_uk_list"></div>
      </div>
    `;

    out.querySelector("#ta_copy_av").onclick = () => GM_setClipboard(STATE.availableLive.map(x => x.cc).join(", "));
    out.querySelector("#ta_copy_un").onclick = () => GM_setClipboard(STATE.unavailableLive.map(x => x.cc).join(", "));
    out.querySelector("#ta_copy_uk").onclick = () => GM_setClipboard(STATE.unknownLive.map(x => x.cc).join(", "));
  }

  function renderFinal(kind) {
    const out = box.querySelector("#ta_out");

    const available = STATE.availableLive.slice().sort((a, b) => a.cc.localeCompare(b.cc));
    const unavailable = STATE.unavailableLive.slice().sort((a, b) => a.cc.localeCompare(b.cc));
    const unknown = STATE.unknownLive.slice().sort((a, b) => a.cc.localeCompare(b.cc));

    const mkRow = (title, arr, btnId, cls = "") => `
      <div class="ta-section-head">
        <span>${title} (${arr.length}):</span>
        <button class="ta-copybtn" id="${btnId}" title="Copy">${COPY_SVG}</button>
      </div>
      <div class="ta-row">${arr.map(x => {
        const svg = flagSvgUrl(x.cc);
        const img = svg ? `<img class="ta-flag" data-flag="1" alt="" src="${svg}">` : "";
        const pref = PREF.has(x.cc) ? " ta-pref" : "";
        return `<span class="ta-chip ${cls}${pref}" data-code="${x.cc}" data-name="${x.name}" title="${x.name}">${img}<span>${x.cc}</span></span>`;
      }).join("")}</div>
    `;

    out.innerHTML = `
      <div class="ta-block">
        <div class="ta-h">${kind} Availability</div>
        ${mkRow("Available in", available, "ta_copy_av2")}
        ${mkRow("Unavailable in", unavailable, "ta_copy_un2", "ta-unav")}
        ${unknown.length ? mkRow("Unknown in", unknown, "ta_copy_uk2", "ta-unav") : ""}
      </div>
    `;

    out.querySelectorAll('img[data-flag="1"]').forEach(img => {
      img.addEventListener("error", () => img.remove(), { once: true });
      setTimeout(() => { if (!img.complete || img.naturalWidth === 0) img.remove(); }, 2500);
    });

    out.querySelector("#ta_copy_av2").onclick = () => GM_setClipboard(available.map(x => x.cc).join(", "));
    out.querySelector("#ta_copy_un2").onclick = () => GM_setClipboard(unavailable.map(x => x.cc).join(", "));
    if (unknown.length) out.querySelector("#ta_copy_uk2").onclick = () => GM_setClipboard(unknown.map(x => x.cc).join(", "));

    applyFilter(box.querySelector("#ta_filter").value);
    applyPrefsToRendered();
  }

  async function run(isAuto = false) {
    const res = parseResource();
    if (!res) {
      if (isAuto && autoTries < AUTO_MAX_TRIES) scheduleAutoRun(AUTO_DELAY_MS, true);
      return;
    }

    autoTries = 0;
    cancelRequested = false;
    ensureBox();
    mountBox(box);

    const kind = res.type === "album" ? "Album" : "Track";

    STATE.availableLive = [];
    STATE.unavailableLive = [];
    STATE.unknownLive = [];

    setProgress("Loading region list…");
    showBar(1);
    setBar(0, 1);

    let markets;
    try {
      markets = await getMarketsAndNames();
    } catch (e) {
      setProgress(e?.message ? `Failed: ${e.message}` : "Failed to load regions.");
      hideBar();
      return;
    }

    STATE.codes = markets.codes;
    STATE.names = markets.names;

    renderPrefChooser();
    renderLiveShell(kind);

    const total = STATE.codes.length;
    const avList = box.querySelector("#ta_av_list");
    const unList = box.querySelector("#ta_un_list");
    const ukList = box.querySelector("#ta_uk_list");
    const avCount = box.querySelector("#ta_av_count");
    const unCount = box.querySelector("#ta_un_count");
    const ukHead = box.querySelector("#ta_uk_head");
    const ukCount = box.querySelector("#ta_uk_count");

    showBar(total);
    setBar(0, total);

    let done = 0;
    setProgress(`Scanning… ${done}/${total}`);

    const queue = STATE.codes.slice();
    let lastUi = 0;

    const worker = async () => {
      while (queue.length && !cancelRequested) {
        const cc = queue.shift();
        if (!cc) return;

        let ok = null;
        try {
          ok = await checkOne(res, cc);
        } catch (e) {
          setProgress(e?.message || String(e));
          cancelRequested = true;
          return;
        }

        if (cancelRequested) return;

        const name = STATE.names.get(cc) || fallbackName(cc);

        if (ok === true) {
          STATE.availableLive.push({ cc, name });
          avList.appendChild(makeChip(cc, name, ""));
          avCount.textContent = `Available in (${STATE.availableLive.length}):`;
        } else if (ok === false) {
          STATE.unavailableLive.push({ cc, name });
          unList.appendChild(makeChip(cc, name, "ta-unav"));
          unCount.textContent = `Unavailable in (${STATE.unavailableLive.length}):`;
        } else {
          STATE.unknownLive.push({ cc, name });
          ukHead.style.display = "";
          ukList.appendChild(makeChip(cc, name, "ta-unav"));
          ukCount.textContent = `Unknown in (${STATE.unknownLive.length}):`;
        }

        done++;
        setBar(done, total);

        const now = performance.now();
        if (now - lastUi > 120 || done === total) {
          lastUi = now;
          setProgress(`Scanning… ${done}/${total}`);
          applyFilter(box.querySelector("#ta_filter").value);
          applyPrefsToRendered();
        }

        await sleep(25);
      }
    };

    await Promise.allSettled(Array.from({ length: CONCURRENCY }, worker));

    if (cancelRequested) { hideBar(); return; }

    renderFinal(kind);
    setProgress("");
    hideBar();
    mountBox(box);
  }

  function scheduleAutoRun(delayMs = AUTO_DELAY_MS, isRetry = false) {
    clearTimeout(autoRunTimer);
    autoRunTimer = setTimeout(() => {
      if (cancelRequested) return;
      if (!isRetry) autoTries = 0;
      autoTries++;
      run(true).catch(() => {});
    }, delayMs);
  }

  function wire() {
    ensureBox();
    mountBox(box);
    scheduleAutoRun(AUTO_DELAY_MS, false);
  }

  function onNavMaybe() {
    if (location.href === lastHref) return;
    lastHref = location.href;

    clearTimeout(autoRunTimer);
    cancelRequested = true;

    // keep UI (don’t nuke), just re-mount + re-run
    setTimeout(() => {
      cancelRequested = false;
      ensureBox();
      mountBox(box);
      scheduleAutoRun(AUTO_DELAY_MS, false);
    }, 200);
  }

  function installNavHooks() {
    const trigger = () => setTimeout(onNavMaybe, 50);

    const ps = history.pushState;
    history.pushState = function () { ps.apply(this, arguments); trigger(); };

    const rs = history.replaceState;
    history.replaceState = function () { rs.apply(this, arguments); trigger(); };

    window.addEventListener("popstate", trigger);
    window.addEventListener("hashchange", trigger);

    // SPA keep-alive: re-mount if TIDAL moves/rebuilds DOM
    const mo = new MutationObserver(() => {
      if (!document.body) return;
      if (!box || !document.contains(box)) {
        box = null;
        if (parseResource()) {
          ensureBox();
          mountBox(box);
        }
      } else {
        // keep it pinned near “Related Albums/Artists” etc when NOT floating
        mountBox(box);
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  async function boot() {
    for (let i = 0; i < 120; i++) { if (document.body) break; await sleep(50); }
    wire();
    installNavHooks();
  }

  boot();
})();

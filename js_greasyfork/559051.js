// ==UserScript==
// @name         Spotify Availability
// @namespace    https://github.com/zxcvresque/Music-Availability
// @version      1.0.4
// @description  Spotify track/album availability across countries (search, copy, thin progress, floating/minimize, preferred countries).
// @author       Zxcvr (adapted from pawllo01)
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559051/Spotify%20Availability.user.js
// @updateURL https://update.greasyfork.org/scripts/559051/Spotify%20Availability.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const START_DELAY_MS = 1100;

  const COUNTRIES = {
    AD:"Andorra", AE:"United Arab Emirates", AG:"Antigua and Barbuda", AL:"Albania", AM:"Armenia",
    AO:"Angola", AR:"Argentina", AT:"Austria", AU:"Australia", AZ:"Azerbaijan",
    BA:"Bosnia and Herzegovina", BB:"Barbados", BD:"Bangladesh", BE:"Belgium", BF:"Burkina Faso",
    BG:"Bulgaria", BH:"Bahrain", BI:"Burundi", BJ:"Benin", BN:"Brunei Darussalam",
    BO:"Bolivia, Plurinational State of", BR:"Brazil", BS:"Bahamas", BT:"Bhutan", BW:"Botswana",
    BY:"Belarus", BZ:"Belize", CA:"Canada", CD:"Congo, Democratic Republic of the", CG:"Congo",
    CH:"Switzerland", CI:"Côte d'Ivoire", CL:"Chile", CM:"Cameroon", CO:"Colombia",
    CR:"Costa Rica", CV:"Cabo Verde", CW:"Curaçao", CY:"Cyprus", CZ:"Czechia",
    DE:"Germany", DJ:"Djibouti", DK:"Denmark", DM:"Dominica", DO:"Dominican Republic",
    DZ:"Algeria", EC:"Ecuador", EE:"Estonia", EG:"Egypt", ES:"Spain",
    ET:"Ethiopia", FI:"Finland", FJ:"Fiji", FM:"Micronesia, Federated States of", FR:"France",
    GA:"Gabon", GB:"United Kingdom of Great Britain and Northern Ireland", GD:"Grenada", GE:"Georgia", GH:"Ghana",
    GM:"Gambia", GN:"Guinea", GQ:"Equatorial Guinea", GR:"Greece", GT:"Guatemala",
    GW:"Guinea-Bissau", GY:"Guyana", HK:"Hong Kong", HN:"Honduras", HR:"Croatia",
    HT:"Haiti", HU:"Hungary", ID:"Indonesia", IE:"Ireland", IL:"Israel",
    IN:"India", IQ:"Iraq", IS:"Iceland", IT:"Italy", JM:"Jamaica",
    JO:"Jordan", JP:"Japan", KE:"Kenya", KG:"Kyrgyzstan", KH:"Cambodia",
    KI:"Kiribati", KM:"Comoros", KN:"Saint Kitts and Nevis", KR:"Korea, Republic of", KW:"Kuwait",
    KZ:"Kazakhstan", LA:"Lao People's Democratic Republic", LB:"Lebanon", LC:"Saint Lucia", LI:"Liechtenstein",
    LK:"Sri Lanka", LR:"Liberia", LS:"Lesotho", LT:"Lithuania", LU:"Luxembourg",
    LV:"Latvia", LY:"Libya", MA:"Morocco", MC:"Monaco", MD:"Moldova, Republic of",
    ME:"Montenegro", MG:"Madagascar", MH:"Marshall Islands", MK:"North Macedonia", ML:"Mali",
    MN:"Mongolia", MO:"Macao", MR:"Mauritania", MT:"Malta", MU:"Mauritius",
    MV:"Maldives", MW:"Malawi", MX:"Mexico", MY:"Malaysia", MZ:"Mozambique",
    NA:"Namibia", NE:"Niger", NG:"Nigeria", NI:"Nicaragua", NL:"Netherlands, Kingdom of the",
    NO:"Norway", NP:"Nepal", NR:"Nauru", NZ:"New Zealand", OM:"Oman",
    PA:"Panama", PE:"Peru", PG:"Papua New Guinea", PH:"Philippines", PK:"Pakistan",
    PL:"Poland", PR:"Puerto Rico", PS:"Palestine, State of", PT:"Portugal", PW:"Palau",
    PY:"Paraguay", QA:"Qatar", RO:"Romania", RS:"Serbia", RW:"Rwanda",
    SA:"Saudi Arabia", SB:"Solomon Islands", SC:"Seychelles", SE:"Sweden", SG:"Singapore",
    SI:"Slovenia", SK:"Slovakia", SL:"Sierra Leone", SM:"San Marino", SN:"Senegal",
    SR:"Suriname", ST:"Sao Tome and Principe", SV:"El Salvador", SZ:"Eswatini", TD:"Chad",
    TG:"Togo", TH:"Thailand", TJ:"Tajikistan", TL:"Timor-Leste", TN:"Tunisia",
    TO:"Tonga", TR:"Türkiye", TT:"Trinidad and Tobago", TV:"Tuvalu", TW:"Taiwan, Province of China",
    TZ:"Tanzania, United Republic of", UA:"Ukraine", UG:"Uganda", US:"United States of America", UY:"Uruguay",
    UZ:"Uzbekistan", VC:"Saint Vincent and the Grenadines", VE:"Venezuela, Bolivarian Republic of", VN:"Viet Nam", VU:"Vanuatu",
    WS:"Samoa", XK:"Kosovo", ZA:"South Africa", ZM:"Zambia", ZW:"Zimbabwe",
  };
  const ALL_CODES = Object.keys(COUNTRIES).sort();

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const flagImgUrl = (cc) => `https://flagcdn.com/h20/${String(cc||"").toLowerCase()}.png`;

  const STORE_KEY_FLOAT = "sp_av_floating_v1";
  const STORE_KEY_MIN   = "sp_av_minimized_v1";
  const STORE_KEY_PREF  = "sp_av_prefCountries_v1";

  const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  const PREF = {
    set: new Set(),
    load() {
      try {
        const raw = lsGet(STORE_KEY_PREF);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return;
        this.set = new Set(arr.map(x => String(x||"").toUpperCase()).filter(x => COUNTRIES[x]));
      } catch {}
    },
    save() { try { lsSet(STORE_KEY_PREF, JSON.stringify(Array.from(this.set).sort())); } catch {} },
    has(cc) { return this.set.has(String(cc||"").toUpperCase()); },
    toggle(cc) {
      cc = String(cc||"").toUpperCase();
      if (!COUNTRIES[cc]) return;
      if (this.set.has(cc)) this.set.delete(cc);
      else this.set.add(cc);
      this.save();
    }
  };
  PREF.load();

  const STYLE_ID = "sp_av_style_v4";
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      .sp-av-wrap{
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

      .sp-titlebar{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }
      .sp-av-title{ font-size:18px; font-weight:900; margin:0; display:flex; align-items:baseline; gap:10px; }
      .sp-credit{ font-size:12px; font-weight:900; opacity:.7; letter-spacing:.2px; }

      .sp-titlebtns{ display:flex; gap:8px; align-items:center }
      .sp-iconbtn{
        width:34px;height:34px;
        border-radius:10px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.08);
        color:#fff; cursor:pointer;
        display:inline-flex;align-items:center;justify-content:center;
        font-weight:900;
      }
      .sp-iconbtn:hover{ background:rgba(255,255,255,.12) }
      .sp-av-wrap:not(.sp-av-floating) .sp-iconbtn.minbtn{ display:none; }

      .sp-toprow{ display:flex; gap:10px; flex-wrap:wrap; align-items:center }
      .sp-toprow input{
        width: 260px; max-width: 65vw;
        padding:7px 10px;
        border-radius:9999px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.06);
        color:#fff;
        outline:none;
        font-weight:700;
      }
      .sp-btns{ display:flex; gap:8px; flex-wrap:wrap }
      .sp-btns button{
        padding:7px 10px;
        border-radius:10px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.08);
        color:#fff; cursor:pointer; font-weight:700;
      }
      .sp-btns button:hover{ background:rgba(255,255,255,.12) }

      .sp-progress{ font-size:12px; opacity:.9; margin:6px 0 6px; min-height:14px; }

      #sp_bar{
        width:100%;
        height:6px;
        display:none;
        margin:6px 0 0;
        border-radius:9999px;
        overflow:hidden;
        accent-color:#18c1c1;
      }
      #sp_bar::-webkit-progress-bar{ background: rgba(255,255,255,.14); border-radius:9999px; }
      #sp_bar::-webkit-progress-value{ background: rgba(24,193,193,.90); border-radius:9999px; }
      #sp_bar::-moz-progress-bar{ background: rgba(24,193,193,.90); border-radius:9999px; }

      .sp-block{
        background:rgba(0,0,0,.30);
        border:1px solid rgba(255,255,255,.12);
        padding:10px;
        border-radius:12px;
        margin-top:10px;
      }
      .sp-h{ font-weight:900; margin:0 0 8px; font-size:16px }

      .sp-section-head{
        display:flex; align-items:center; gap:8px;
        margin:10px 0 7px;
        font-weight:900;
        font-size:15px;
      }

      .sp-copybtn{
        width:34px;height:34px;
        border-radius:10px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.08);
        display:inline-flex; align-items:center; justify-content:center;
        cursor:pointer;
      }
      .sp-copybtn:hover{ background:rgba(255,255,255,.12) }
      .sp-copybtn svg{ width:18px;height:18px;opacity:.95 }

      .sp-listbox{
        max-height: 260px;
        overflow: auto;
        padding-right: 6px;
        border-radius: 12px;
      }
      .sp-av-floating .sp-listbox{ max-height: 44vh; }

      .sp-row{ display:flex; flex-wrap:wrap; gap:8px }

      .sp-chip{
        display:inline-flex; align-items:center; gap:8px;
        padding:6px 10px;
        border-radius:9999px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(255,255,255,.06);
        font-weight:900;
        color:#fff;
        user-select:none;
      }
      .sp-chip:hover{ background:rgba(255,255,255,.10) }
      .sp-chip.unav{ opacity:.55; background:rgba(255,255,255,.04) }
      .sp-chip.hidden{ display:none }
      .sp-chip.sp-pref{
        border-color: rgba(24,193,193,.75);
        box-shadow: 0 0 0 1px rgba(24,193,193,.35) inset;
        background: rgba(24,193,193,.10);
      }

      .sp-flag{
        width:18px;height:12px;border-radius:2px;
        object-fit:cover;display:block;
        box-shadow: 0 0 0 1px rgba(255,255,255,.12) inset;
      }

      .sp-av-floating{
        position:fixed;right:14px;bottom:14px;
        width:min(560px, calc(100vw - 28px));
        max-width:none;
        margin:0;
        max-height:75vh;
        overflow:auto;
      }
      .sp-av-floating.sp-minimized{
        width:360px;
        max-height:none;
        overflow:hidden;
        padding:10px 10px 10px;
      }
      .sp-minimized .sp-toprow,
      .sp-minimized #sp_progress,
      .sp-minimized #sp_bar,
      .sp-minimized #sp_out,
      .sp-minimized #sp_adv { display:none; }

      #sp_adv{ margin-top:10px; padding-top:8px; border-top:1px solid rgba(255,255,255,.12); }
      #sp_adv summary{
        cursor:pointer; list-style:none;
        font-weight:900; opacity:.9; user-select:none;
      }
      #sp_adv summary::-webkit-details-marker{ display:none; }
      #sp_adv .sp-adv-body{ margin-top:8px; }
      #sp_pref_list{
        display:flex; flex-wrap:wrap; gap:8px;
        margin-top:6px;
        max-height:220px;
        overflow:auto;
        padding-right:6px;
      }
      .sp-prefopt{ cursor:pointer; }
    `;
    document.documentElement.appendChild(s);
  }

  const COPY_SVG = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 9h10v10H9V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  let apiTokenUrlPromise = null;
  function getApiTokenUrl() {
    if (apiTokenUrlPromise) return apiTokenUrlPromise;
    apiTokenUrlPromise = new Promise((resolve) => {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (String(entry.name || "").includes("/api/token")) {
            try { po.disconnect(); } catch {}
            resolve(entry.name);
            return;
          }
        }
      });
      try { po.observe({ type: "resource", buffered: true }); } catch { resolve(null); }
    });
    return apiTokenUrlPromise;
  }

  const tokenCache = { token: null, exp: 0 };

  async function getToken() {
    if (tokenCache.token && Date.now() < tokenCache.exp - 60_000) return tokenCache.token;

    try {
      const r = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=web_player", { credentials: "include" });
      if (r.ok) {
        const j = await r.json();
        if (j?.accessToken) {
          tokenCache.token = j.accessToken;
          tokenCache.exp = Number(j.accessTokenExpirationTimestampMs || 0) || (Date.now() + 30 * 60 * 1000);
          return tokenCache.token;
        }
      }
    } catch {}

    try {
      const url = await promiseTimeout(getApiTokenUrl(), 6500);
      if (!url) return null;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.accessToken) {
        tokenCache.token = data.accessToken;
        tokenCache.exp = Number(data.accessTokenExpirationTimestampMs || 0) || (Date.now() + 30 * 60 * 1000);
        return tokenCache.token;
      }
    } catch {}

    return null;
  }

  function promiseTimeout(p, ms) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => resolve(null), ms);
      p.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
    });
  }

  async function spFetchJson(url) {
    const token = await getToken();
    if (!token) return null;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, credentials: "omit" });
    if (!res.ok) return null;
    return res.json();
  }

  const getAlbumData = (id) => spFetchJson(`https://api.spotify.com/v1/albums/${encodeURIComponent(id)}`);
  const getTrackData = (id) => spFetchJson(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`);

  let box = null;
  let lastHref = location.href;
  let autoTimer = null;
  let runSeq = 0;

  function parseResource() {
    const m = location.pathname.match(/\/(album|track)\/([A-Za-z0-9]+)/i);
    if (!m) return null;
    return { type: m[1].toLowerCase(), id: m[2] };
  }

  async function waitForBody(maxMs = 15000) {
    const t0 = Date.now();
    while (!document.body) {
      if (Date.now() - t0 > maxMs) break;
      await sleep(25);
    }
  }

  function findTrackActionBarAnchor() {
    const trackPage = document.querySelector('section[data-testid="track-page"]') || document.querySelector('[data-testid="track-page"]');
    const root = trackPage || document;
    const actionBar = root.querySelector('div[data-testid="action-bar-row"]');
    if (actionBar) return actionBar;

    const playBtn = root.querySelector('button[data-testid="play-button"]');
    if (playBtn) {
      const a = playBtn.closest('div[data-testid="action-bar-row"]') || playBtn.closest("header") || playBtn.closest("section,div");
      if (a) return a;
    }
    return null;
  }

  function findAlbumTracklistByTime() {
    const albumPage = document.querySelector('section[data-testid="album-page"]') || document.querySelector('[data-testid="album-page"]');
    if (!albumPage) return null;

    const explicit = albumPage.querySelector('[data-testid="tracklist"]');
    if (explicit) return explicit;

    const timeRe = /\b\d{1,2}:\d{2}\b/;
    const candidates = new Set();

    for (const el of albumPage.querySelectorAll('ol,ul')) candidates.add(el);

    const rows = Array.from(albumPage.querySelectorAll('[data-testid="tracklist-row"]'));
    for (const r of rows.slice(0, 6)) {
      let p = r.parentElement;
      for (let i = 0; i < 6 && p && p !== albumPage; i++) {
        candidates.add(p);
        p = p.parentElement;
      }
    }

    const score = (el) => {
      const items = Array.from(el.querySelectorAll('li,[data-testid="tracklist-row"],div[role="row"]'));
      if (items.length < 3) return -1;

      let hits = 0;
      for (const it of items.slice(0, 40)) {
        if (timeRe.test(it.textContent || "")) hits++;
      }
      return hits * 100 + items.length;
    };

    let best = null, bestScore = -1;
    for (const el of candidates) {
      const sc = score(el);
      if (sc > bestScore) { bestScore = sc; best = el; }
    }

    if (best && bestScore >= 300) return best;
    return best || null;
  }

  function bestFallbackMount() {
    return document.querySelector("main") || document.querySelector("#root") || document.body;
  }

  async function mountPanel(panel, resourceType) {
    if (!panel) return;

    if (panel.classList.contains("sp-av-floating")) {
      if (panel.parentElement !== document.body) document.body.appendChild(panel);
      return;
    }

    const t0 = Date.now();

    while (Date.now() - t0 < 5200) {
      if (resourceType === "album") {
        const tracklist = findAlbumTracklistByTime();
        if (tracklist && tracklist.parentElement) {
          if (panel.parentElement !== tracklist.parentElement || panel.previousSibling !== tracklist) {
            tracklist.parentElement.insertBefore(panel, tracklist.nextSibling);
          }
          return;
        }
      } else {
        const anchor = findTrackActionBarAnchor();
        if (anchor && anchor.parentElement) {
          const node = anchor.closest("section,div") || anchor;
          if (panel.parentElement !== node.parentElement || panel.previousSibling !== node) {
            node.parentElement.insertBefore(panel, node.nextSibling);
          }
          return;
        }
      }

      await sleep(140);
    }

    const mount = bestFallbackMount();
    if (panel.parentElement !== mount) mount.prepend(panel);
  }

  function updateMinBtn() {
    const btn = box?.querySelector("#sp_min");
    if (!btn) return;
    const minimized = box.classList.contains("sp-minimized");
    btn.textContent = minimized ? "▢" : "—";
    btn.title = minimized ? "Expand" : "Minimize";
  }

  function applySavedFloatMinState() {
    const floatOn = lsGet(STORE_KEY_FLOAT) === "1";
    box.classList.toggle("sp-av-floating", floatOn);

    const minOn = lsGet(STORE_KEY_MIN) === "1";
    box.classList.toggle("sp-minimized", floatOn && minOn);

    updateMinBtn();
  }

  function setMinimized(on) {
    box.classList.toggle("sp-minimized", !!on);
    lsSet(STORE_KEY_MIN, on ? "1" : "0");
    updateMinBtn();
  }

  function setProgress(msg) {
    const el = box?.querySelector("#sp_progress");
    if (el) el.textContent = msg || "";
  }

  function showBar(total) {
    const bar = box?.querySelector("#sp_bar");
    if (!bar) return;
    bar.max = total || 1;
    bar.value = 0;
    bar.style.display = "block";
  }
  function setBar(done, total) {
    const bar = box?.querySelector("#sp_bar");
    if (!bar) return;
    if (typeof total === "number") bar.max = total || 1;
    bar.value = done || 0;
  }
  function hideBar() {
    const bar = box?.querySelector("#sp_bar");
    if (!bar) return;
    bar.style.display = "none";
    bar.value = 0;
  }

  function applyFilter(q) {
    q = (q || "").trim().toLowerCase();
    if (!box) return;
    for (const ch of box.querySelectorAll(".sp-chip[data-cc]")) {
      const cc = (ch.dataset.cc || "").toLowerCase();
      const name = (ch.dataset.name || "").toLowerCase();
      const ok = !q || cc.includes(q) || name.includes(q);
      ch.classList.toggle("hidden", !ok);
    }
  }

  function applyPrefsToRendered() {
    if (!box) return;
    for (const el of box.querySelectorAll(".sp-chip[data-cc]")) {
      const cc = (el.dataset.cc || "").toUpperCase();
      el.classList.toggle("sp-pref", PREF.has(cc));
    }
    for (const el of box.querySelectorAll(".sp-prefopt[data-cc]")) {
      const cc = (el.dataset.cc || "").toUpperCase();
      el.classList.toggle("sp-pref", PREF.has(cc));
    }
  }

  function renderPrefChooser() {
    const host = box?.querySelector("#sp_pref_list");
    if (!host) return;

    host.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (const cc of ALL_CODES) {
      const el = document.createElement("span");
      el.className = "sp-chip sp-prefopt";
      el.dataset.cc = cc;
      el.dataset.name = COUNTRIES[cc];
      el.title = COUNTRIES[cc];

      const flag = document.createElement("img");
      flag.className = "sp-flag";
      flag.alt = "";
      flag.src = flagImgUrl(cc);
      flag.addEventListener("error", () => flag.remove(), { once: true });

      const label = document.createElement("span");
      label.textContent = cc;

      el.append(flag, label);

      el.addEventListener("click", () => {
        PREF.toggle(cc);
        applyPrefsToRendered();
      });

      frag.appendChild(el);
    }

    host.appendChild(frag);
    applyPrefsToRendered();
  }

  function createChipEl(cc, cls) {
    const name = COUNTRIES[cc] || cc;

    const el = document.createElement("span");
    el.className = `sp-chip ${cls || ""} ${PREF.has(cc) ? "sp-pref" : ""}`.trim();
    el.dataset.cc = cc;
    el.dataset.name = name;
    el.title = name;

    const flag = document.createElement("img");
    flag.className = "sp-flag";
    flag.alt = "";
    flag.src = flagImgUrl(cc);
    flag.addEventListener("error", () => flag.remove(), { once: true });

    const label = document.createElement("span");
    label.textContent = cc;

    el.append(flag, label);
    return el;
  }

  async function copySection(kind) {
    if (!box) return;

    const selector = kind === "available"
      ? '#sp_av_box .sp-chip:not(.hidden)'
      : '#sp_un_box .sp-chip:not(.hidden)';

    const codes = Array.from(box.querySelectorAll(selector))
      .map(n => n.dataset.cc)
      .filter(Boolean);

    if (!codes.length) return;

    try { await navigator.clipboard.writeText(codes.join(", ")); } catch {}
  }

  function renderShell(kindLabel) {
    const out = box.querySelector("#sp_out");
    out.innerHTML = `
      <div class="sp-block">
        <div class="sp-h">${kindLabel} Availability</div>

        <div class="sp-section-head">
          <span id="sp_av_count">Available in (0):</span>
          <button class="sp-copybtn" id="sp_copy_av" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="sp-listbox" id="sp_av_box">
          <div class="sp-row" id="sp_av_list"></div>
        </div>

        <div class="sp-section-head" style="margin-top:12px;">
          <span id="sp_un_count">Unavailable in (0):</span>
          <button class="sp-copybtn" id="sp_copy_un" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="sp-listbox" id="sp_un_box">
          <div class="sp-row" id="sp_un_list"></div>
        </div>
      </div>
    `;

    out.querySelector("#sp_copy_av").onclick = () => copySection("available");
    out.querySelector("#sp_copy_un").onclick = () => copySection("unavailable");
  }

  function tryInjectMeta(resourceType, data) {
    try {
      const candidates = document.querySelectorAll("div.contentSpacing");
      if (!candidates?.length) return;
      const target = candidates[candidates.length - 1];
      if (!target) return;

      if (resourceType === "album") {
        const label = data?.label || "";
        const upc = data?.external_ids?.upc || "";
        if (!label && !upc) return;

        target.insertAdjacentHTML(
          "beforeend",
          `<p dir="auto" data-encore-id="type" class="Type__TypeElement-sc-goli3j-0 gBYjgG">Label: ${label}</p>
           <p dir="auto" data-encore-id="type" class="Type__TypeElement-sc-goli3j-0 gBYjgG">UPC: ${upc}</p>`
        );
      } else if (resourceType === "track") {
        const isrc = data?.external_ids?.isrc || "";
        if (!isrc) return;
        target.insertAdjacentHTML(
          "beforeend",
          `<p dir="auto" data-encore-id="type" class="Type__TypeElement-sc-goli3j-0 gBYjgG">ISRC: ${isrc}</p>`
        );
      }
    } catch {}
  }

  function computeCountries(availableMarkets) {
    const available = (availableMarkets || [])
      .map(x => String(x).toUpperCase())
      .filter(x => COUNTRIES[x])
      .sort();

    const set = new Set(available);
    const unavailable = ALL_CODES.filter(cc => !set.has(cc));
    return { available, unavailable };
  }

  function removePanelIfAny() {
    const el = document.getElementById("sp_av_panel");
    if (el) el.remove();
    box = null;
  }

  function ensureBox() {
    if (box && document.contains(box)) return box;

    box = document.createElement("div");
    box.className = "sp-av-wrap";
    box.id = "sp_av_panel";
    box.innerHTML = `
      <div class="sp-titlebar">
        <div class="sp-av-title">Spotify Availability <span class="sp-credit">by Zxcvr</span></div>
        <div class="sp-titlebtns">
          <button class="sp-iconbtn minbtn" id="sp_min" title="Minimize">—</button>
        </div>
      </div>

      <div class="sp-toprow">
        <input id="sp_filter" placeholder="Search (JP / Japan / United...)" />
        <div class="sp-btns">
          <button id="sp_float">Toggle Floating</button>
        </div>
      </div>

      <div class="sp-progress" id="sp_progress"></div>
      <progress id="sp_bar" max="1" value="0"></progress>

      <div id="sp_out"></div>

      <details id="sp_adv">
        <summary>Advanced</summary>
        <div class="sp-adv-body">
          <div style="font-weight:900; opacity:.9;">Choose default country(s)</div>
          <div id="sp_pref_list"></div>
        </div>
      </details>
    `;

    document.body.appendChild(box);
    applySavedFloatMinState();

    box.querySelector("#sp_min").onclick = () => setMinimized(!box.classList.contains("sp-minimized"));

    box.querySelector("#sp_float").onclick = async () => {
      const nowOn = !box.classList.contains("sp-av-floating");
      box.classList.toggle("sp-av-floating", nowOn);
      lsSet(STORE_KEY_FLOAT, nowOn ? "1" : "0");

      if (nowOn) {
        const savedMin = lsGet(STORE_KEY_MIN) === "1";
        box.classList.toggle("sp-minimized", savedMin);
        document.body.appendChild(box);
      } else {
        box.classList.remove("sp-minimized");
        const r = parseResource();
        await mountPanel(box, r?.type || "track");
      }
      updateMinBtn();
    };

    box.querySelector("#sp_filter").oninput = () => applyFilter(box.querySelector("#sp_filter").value);

    updateMinBtn();
    renderPrefChooser();
    return box;
  }

  function scheduleAutoRun(delayMs = START_DELAY_MS) {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => run().catch(()=>{}), delayMs);
  }

  async function run() {
    const resource = parseResource();
    if (!resource) { removePanelIfAny(); return; }

    runSeq++;
    const mySeq = runSeq;

    await waitForBody();
    if (mySeq !== runSeq) return;

    ensureBox();

    const title = resource.type === "track" ? "Spotify Track Availability" : "Spotify Album Availability";
    box.querySelector(".sp-av-title").innerHTML = `${title} <span class="sp-credit">by Zxcvr</span>`;

    await mountPanel(box, resource.type);
    if (mySeq !== runSeq) return;

    renderShell(resource.type === "track" ? "Track" : "Album");
    applyPrefsToRendered();

    setProgress("Loading…");
    showBar(ALL_CODES.length);
    setBar(0, ALL_CODES.length);

    const token = await getToken();
    if (!token) {
      setProgress("Failed to load (token not found). Refresh once or wait a second and reload.");
      hideBar();
      return;
    }

    const data = resource.type === "album" ? await getAlbumData(resource.id) : await getTrackData(resource.id);
    if (mySeq !== runSeq) return;

    if (!data) {
      setProgress("Failed to load. Refresh the page.");
      hideBar();
      return;
    }

    const { available } = computeCountries(data.available_markets || []);
    tryInjectMeta(resource.type, data);

    const avList = box.querySelector("#sp_av_list");
    const unList = box.querySelector("#sp_un_list");
    const avCount = box.querySelector("#sp_av_count");
    const unCount = box.querySelector("#sp_un_count");

    avList.innerHTML = "";
    unList.innerHTML = "";

    const avSet = new Set(available);

    let done = 0, avN = 0, unN = 0;
    const BATCH = 24;

    setProgress(`Scanning… 0/${ALL_CODES.length}`);

    for (let i = 0; i < ALL_CODES.length; i += BATCH) {
      if (mySeq !== runSeq) return;

      const slice = ALL_CODES.slice(i, i + BATCH);
      const fragAv = document.createDocumentFragment();
      const fragUn = document.createDocumentFragment();

      for (const cc of slice) {
        if (avSet.has(cc)) { fragAv.appendChild(createChipEl(cc, "")); avN++; }
        else { fragUn.appendChild(createChipEl(cc, "unav")); unN++; }
        done++;
      }

      avList.appendChild(fragAv);
      unList.appendChild(fragUn);

      avCount.textContent = `Available in (${avN}):`;
      unCount.textContent = `Unavailable in (${unN}):`;

      setBar(done, ALL_CODES.length);
      setProgress(`Scanning… ${done}/${ALL_CODES.length}`);

      applyFilter(box.querySelector("#sp_filter").value);
      applyPrefsToRendered();

      await new Promise(requestAnimationFrame);
    }

    setProgress("");
    hideBar();
    applyFilter(box.querySelector("#sp_filter").value);
    applyPrefsToRendered();
  }

  function onNavMaybe() {
    if (location.href === lastHref) return;
    lastHref = location.href;

    clearTimeout(autoTimer);
    runSeq++;
    scheduleAutoRun(650);
  }

  function installNavHooks() {
    const trigger = () => setTimeout(onNavMaybe, 50);

    const ps = history.pushState;
    history.pushState = function () { ps.apply(this, arguments); trigger(); };

    const rs = history.replaceState;
    history.replaceState = function () { rs.apply(this, arguments); trigger(); };

    window.addEventListener("popstate", trigger);
    window.addEventListener("hashchange", trigger);

    const mo = new MutationObserver(() => {
      const r = parseResource();
      if (!r) return;
      if (!document.getElementById("sp_av_panel")) scheduleAutoRun(650);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  getApiTokenUrl();
  scheduleAutoRun(START_DELAY_MS);
  installNavHooks();
})();

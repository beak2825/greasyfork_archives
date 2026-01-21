// ==UserScript==
// @name         MoDuL's: Custom Race Filter
// @namespace    modul.torn.racing
// @version      2.1.7
// @description  Custom Race filter. (OG Car Names & PDA compatible)
// @author       MoDuL
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562954/MoDuL%27s%3A%20Custom%20Race%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/562954/MoDuL%27s%3A%20Custom%20Race%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SUPPORTER_PUBKEY_B64URL = "8YI-0Q7DT3xSsls2wIZ6QVBquxYhGTKz3DPww5OI2XE";
  const SUPPORTER_FEATURES = ["advanced", "persist", "pw", "urt", "car", "start", "bet"];

  const BECOME_SUPPORTER_URL = "https://www.torn.com/messages.php#/p=compose&XID=4022159";
  const KOFI_URL = "https://ko-fi.com/modul";

  const STORE = {
    license: "modul_racefilter_license_v1",
    settings: "modul_racefilter_settings_v1"
  };

  const BATCH_SIZE = 22;
  const DEBOUNCE_MS = 220;

  const TRACKS = [
    "Any", "Commerce", "Convict", "Docks", "Hammerhead", "Industrial", "Meltdown", "Mudpit",
    "Parkland", "Sewage", "Speedway", "Stone Park", "Two Islands", "Underdog", "Uptown", "Vector", "Withdrawal"
  ];

  const CARCLASS_OPTIONS = [
    "Any",
    "A", "B", "C", "D", "E",
    "Stock A", "Stock B", "Stock C", "Stock D", "Stock E",
    "Stormatti Casteon",
    "Veloria LFA",
    "Mercia SLR",
    "Weston Marlin 177",
    "Lambrini Torobravo",
    "Volt GT",
    "Lolo 458",
    "Zaibatsu GT-R",
    "Echo R8",
    "Edomondo NSX",
    "Tsubasa Impressor",
    "Echo S4",
    "Volt MNG",
    "Dart Rampager",
    "Yotsuhada EVX",
    "Bavaria M5",
    "Cosmos EX",
    "Sturmfahrt 111",
    "Colina Tanprice",
    "Wington GGU",
    "Volt RS",
    "Oceania SS",
    "Edomondo IR",
    "Chevalier CZ06",
    "Edomondo S2",
    "Nano Cavalier",
    "Knight Firebrand",
    "Bavaria Z8",
    "Echo Quadrato",
    "Echo S3",
    "Tabata RM2",
    "Invader H3",
    "Bavaria X5",
    "Bedford Nova",
    "Verpestung Insecta",
    "Verpestung Sport",
    "Chevalier CVR",
    "Alpha Milano 156",
    "Coche Basurero",
    "Edomondo ACD",
    "Limoen Saxon",
    "Papani Colé",
    "Edomondo Localé",
    "Çagoutte 10-6",
    "Zaibatsu Macro",
    "Trident",
    "Stålhög 860",
    "Nano Pioneer",
    "Vita Bravo",
    "Bedford Racer"
  ];

  const CAR_FICTIONAL_TO_REAL = {
    "Yotsuhada EVX": "Mitsubishi Evo X",
    "Stålhög 860": "Volvo 850",
    "Stalhog 860": "Volvo 850",
    "Alpha Milano 156": "Alfa Romeo 156",
    "Bavaria X5": "BMW X5",
    "Coche Basurero": "Seat Leon Cupra",
    "Bedford Nova": "Vauxhall Astra GSI",
    "Verpestung Sport": "Volkswagen Golf GTI",
    "Echo S3": "Audi S3",
    "Volt RS": "Ford Focus RS",
    "Edomondo S2": "Honda S2000",
    "Nano Cavalier": "Mini Cooper S",
    "Colina Tanprice": "Ford Sierra Cosworth",
    "Cosmos EX": "Lotus Exige",
    "Bedford Racer": "Vauxhall Corsa",
    "Sturmfahrt 111": "Porsche 911 GT3",
    "Tsubasa Impressor": "Subaru Impreza STI",
    "Wington GGU": "TVR Sagaris",
    "Weston Marlin 177": "Aston Martin One-77",
    "Echo R8": "Audi R8",
    "Stormatti Casteon": "Bugatti Veyron",
    "Lolo 458": "Ferrari 458",
    "Lambrini Torobravo": "Lamborghini Gallardo",
    "Veloria LFA": "Lexus LFA",
    "Mercia SLR": "Mercedes SLR",
    "Zaibatsu GT-R": "Nissan GT-R",
    "Edomondo Localé": "Honda Civic",
    "Edomondo Locale": "Honda Civic",
    "Edomondo NSX": "Honda NSX",
    "Echo Quadrato": "Audi TT Quattro",
    "Bavaria M5": "BMW M5",
    "Bavaria Z8": "BMW Z8",
    "Chevalier CZ06": "Chevrolet Corvette Z06",
    "Dart Rampager": "Dodge Charger",
    "Knight Firebrand": "Pontiac Firebird",
    "Volt GT": "Ford GT",
    "Invader H3": "Hummer H3",
    "Echo S4": "Audi S4",
    "Edomondo IR": "Honda Integra Type R",
    "Edomondo ACD": "Honda Accord",
    "Tabata RM2": "Toyota MR2",
    "Verpestung Insecta": "Volkswagen Beetle",
    "Chevalier CVR": "Chevrolet Cavalier",
    "Volt MNG": "Ford Mustang",
    "Trident": "Reliant Robin",
    "Oceania SS": "Holden SS",
    "Limoen Saxon": "Citroen Saxo",
    "Nano Pioneer": "Classic Mini",
    "Vita Bravo": "Fiat Punto",
    "Zaibatsu Macro": "Nissan Micra",
    "Çagoutte 10-6": "Peugeot 106",
    "Cagoutte 10-6": "Peugeot 106",
    "Papani Colé": "Renault Clio",
    "Papani Cole": "Renault Clio"
  };
const POPULARITY_MIN_OPTS = [
  { v: "Any", label: "Any" },
  { v: "30", label: "≥ 30%" },
  { v: "50", label: "≥ 50%" },
  { v: "70", label: "≥ 70%" }
];

  const START_MAX_OPTS = [
    { v: "Any", label: "Any" },
    { v: "0", label: "Now/Waiting" },
    { v: "5", label: "≤ 5m" },
    { v: "10", label: "≤ 10m" },
    { v: "15", label: "≤ 15m" },
    { v: "30", label: "≤ 30m" },
    { v: "60", label: "≤ 1h" },
    { v: "120", label: "≤ 2h" },
    { v: "240", label: "≤ 4h" },
    { v: "480", label: "≤ 8h" },
    { v: "720", label: "≤ 12h" }
  ];

  const DEFAULTS = {
    enabled: true,
    track: "Any",
    laps: "Any",
    lapsMode: "exact",
    useRealCarNames: false,
    advOpen: false,
    pw: "Any",
    urt: "Any",
    carClass: "Any",
    startMax: "Any",
    popMin: "Any",
    bet: "Any",
    showFull: false
  };

  const hasGM = (typeof GM_getValue === "function" && typeof GM_setValue === "function");
  function gmGet(key, def) { try { return hasGM ? GM_getValue(key, def) : def; } catch (_) { return def; } }
  function gmSet(key, val) { try { if (hasGM) GM_setValue(key, val); } catch (_) {} }

  function b64urlToBytes(s) {
    s = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function nowSec() { return Math.floor(Date.now() / 1000); }

  function parseLicense(str) {
    if (!str || typeof str !== "string") return null;
    const parts = str.trim().split(".");
    if (parts.length !== 2) return null;
    const payloadB64 = parts[0];
    const sigB64 = parts[1];
    let payloadBytes, sigBytes, payload;
    try {
      payloadBytes = b64urlToBytes(payloadB64);
      sigBytes = b64urlToBytes(sigB64);
      payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    } catch (_) {
      return null;
    }
    return { payloadBytes, sigBytes, payload };
  }

  function hasAllSupporterFeatures(payload) {
    const feats = payload?.features;
    if (!Array.isArray(feats)) return false;
    return SUPPORTER_FEATURES.every(f => feats.includes(f));
  }

  function getMyUserId() {
    const candidates = [];
    const roots = [
      document.querySelector("#topbar"),
      document.querySelector("#header"),
      document.querySelector(".top-bar"),
      document.querySelector(".topbar"),
      document.querySelector(".header"),
      document.querySelector(".user"),
      document.querySelector(".user-info"),
      document.querySelector(".user-information"),
      document.body
    ].filter(Boolean);

    for (const root of roots) {
      const links = Array.from(root.querySelectorAll('a[href*="profiles.php?XID="]'));
      for (const a of links) {
        if (a.closest(".custom-events-wrap") || a.closest(".events-list")) continue;
        const href = a.getAttribute("href") || "";
        const m = href.match(/profiles\.php\?XID=(\d+)/i);
        if (!m) continue;

        const cls = (a.className || "").toLowerCase();
        const id = (a.id || "").toLowerCase();
        const txt = (a.textContent || "").trim().toLowerCase();

        let score = 1000;
        if (cls.includes("profile") || cls.includes("user") || id.includes("profile") || id.includes("user")) score -= 300;
        if (txt.length > 0) score -= 50;

        const r = a.getBoundingClientRect?.();
        if (r) score += Math.max(0, r.top) + Math.max(0, r.left) * 0.1;

        candidates.push({ uid: parseInt(m[1], 10), score });
      }
    }

    if (candidates.length) {
      candidates.sort((a, b) => a.score - b.score);
      return candidates[0].uid;
    }

    const html = document.documentElement?.innerHTML || "";
    const m2 =
      html.match(/"userID"\s*:\s*(\d{4,10})/) ||
      html.match(/"userid"\s*:\s*(\d{4,10})/) ||
      html.match(/\buserID\b[^0-9]{0,20}(\d{4,10})/i);

    if (m2) return parseInt(m2[1], 10);
    return null;
  }

  async function verifyLicenseAsync(licenseStr) {
    const lic = parseLicense(licenseStr);
    if (!lic) return { ok: false, reason: "Bad format" };

    const myUid = getMyUserId();
    if (!myUid) return { ok: false, reason: "No userID detected" };

    const uid = Number(lic.payload?.uid);
    if (!uid || uid !== myUid) return { ok: false, reason: `Not for this user (${myUid})` };

    const exp = Number(lic.payload?.exp || 0);
    if (exp > 0 && nowSec() > exp) return { ok: false, reason: "Expired" };

    if (!hasAllSupporterFeatures(lic.payload)) return { ok: false, reason: "Missing features" };

    try {
      if (!crypto?.subtle) return { ok: false, reason: "No WebCrypto" };

      const pubRaw = b64urlToBytes(SUPPORTER_PUBKEY_B64URL);
      if (pubRaw.length !== 32) return { ok: false, reason: "Bad pubkey" };

      const key = await crypto.subtle.importKey("raw", pubRaw, { name: "Ed25519" }, false, ["verify"]);
      const ok = await crypto.subtle.verify({ name: "Ed25519" }, key, lic.sigBytes, lic.payloadBytes);

      return ok ? { ok: true, payload: lic.payload } : { ok: false, reason: "Bad signature" };
    } catch (_) {
      return { ok: false, reason: "Verify not supported" };
    }
  }

  const supporter = { unlocked: false, reason: "Locked" };
  let state = Object.assign({}, DEFAULTS);

  function loadSupporterSettings() {
    const raw = gmGet(STORE.settings, "");
    if (!raw) return Object.assign({}, DEFAULTS);
    try {
      const obj = JSON.parse(raw);
      return Object.assign({}, DEFAULTS, obj || {});
    } catch (_) { return Object.assign({}, DEFAULTS); }
  }

  function saveSupporterSettings() {
    if (!supporter.unlocked) return;
    try { gmSet(STORE.settings, JSON.stringify(state)); } catch (_) {}
  }

  function setState(patch) {
    state = Object.assign({}, state, patch);
    saveSupporterSettings();
  }

  if (typeof GM_addStyle === "function") {
    GM_addStyle(`
      #modulRF {
        margin:8px 0; padding:10px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:10px;
        background:rgba(20,20,20,.92);
      }
      #modulRF button, #modulRF select{
        font-size:13px; color:#fff;
        border-radius:8px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(45,45,45,.95);
        padding:7px 10px;
        width:100%;
        box-sizing:border-box;
      }
      #modulRF .supportTop{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:8px 10px;
        border:1px dashed rgba(255,255,255,.22);
        border-radius:10px;
        background:rgba(0,0,0,.18);
        margin-bottom:10px;
        font-size:13px;
      }
      #modulRF .supportTop .tag{
        display:flex;
        align-items:center;
        gap:8px;
        opacity:.95;
        white-space:nowrap;
      }
      #modulRF .btnSmall{
        width:auto !important;
        padding:6px 10px !important;
        font-size:12px !important;
        border-radius:8px !important;
        white-space:nowrap;
      }
      #modulRF .topBtns{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:10px;
        margin-bottom:10px;
      }
      @media (max-width:420px){
        #modulRF .topBtns{ grid-template-columns: 1fr; }
      }
      #modulRF .grid{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:10px;
        align-items:start;
      }
      #modulRF .col{ display:flex; flex-direction:column; gap:8px; }
      #modulRF .pair{
        display:grid;
        grid-template-columns: 126px 1fr;
        gap:8px;
        align-items:center;
      }
      #modulRF .lbl{
        font-size:12px;
        color:rgba(255,255,255,.88);
        white-space:nowrap;
      }
      #modulRF .plainChk{
        display:flex;
        align-items:center;
        gap:8px;
        padding:4px 0;
        color:#fff;
        font-size:13px;
      }
      #modulRF input[type=checkbox]{ width:16px; height:16px; margin:0; }
      #modulRF .rtLocked{
        opacity:.55;
        filter: grayscale(.15);
      }
      #modulRF .footer{
        margin-top:10px;
        padding-top:10px;
        border-top:1px solid rgba(255,255,255,.10);
      }
      #modulRF .footerBtns{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:10px;
      }
      @media (max-width:420px){
        #modulRF .footerBtns{ grid-template-columns: 1fr; }
      }
      @media (max-width:420px){
        #modulRF .grid{ grid-template-columns: 1fr; }
      }
    `);
  }

  function $(sel, root = document) { return root.querySelector(sel); }
  function getList() { return $(".custom-events-wrap .events-list"); }
  function getItems() {
    const list = getList();
    if (!list) return [];
    return Array.from(list.children).filter(li => li && li.tagName === "LI");
  }

  function norm(s) {
    return String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  const toInt = (t) => {
    const m = (t || "").match(/\d+/);
    return m ? (m[0] | 0) : null;
  };

  function getTrackName(li) {
    const trackLi = li.querySelector(".event-header li.track");
    if (!trackLi) return "";
    const lapsEl = trackLi.querySelector(".laps");
    const fullText = (trackLi.textContent || "").replace(/\s+/g, " ").trim();
    const lapsText = (lapsEl?.textContent || "").replace(/\s+/g, " ").trim();
    return lapsText ? fullText.replace(lapsText, "").trim() : fullText;
  }

  function getLaps(li) {
    if (li.dataset.rfLaps) return parseInt(li.dataset.rfLaps, 10);
    const n = toInt(li.querySelector(".event-header li.track .laps")?.textContent);
    if (Number.isFinite(n)) li.dataset.rfLaps = String(n);
    return n;
  }

  function getDrivers(li) {
    if (li.dataset.rfCur && li.dataset.rfMax) {
      return { cur: parseInt(li.dataset.rfCur, 10), max: parseInt(li.dataset.rfMax, 10) };
    }
    const txt = li.querySelector(".acc-body li.drivers")?.textContent || "";
    const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return { cur: null, max: null };
    const cur = m[1] | 0, max = m[2] | 0;
    li.dataset.rfCur = String(cur);
    li.dataset.rfMax = String(max);
    return { cur, max };
  }

  function getFee(li) {
    if (li.dataset.rfFee) return parseInt(li.dataset.rfFee, 10);
    const txt = li.querySelector(".acc-body li.fee")?.textContent || "";
    const m = txt.match(/\$[\d,]+/);
    if (!m) return null;
    const n = parseInt(m[0].replace(/[^\d]/g, ""), 10);
    if (Number.isFinite(n)) li.dataset.rfFee = String(n);
    return Number.isFinite(n) ? n : null;
  }

  function isPasswordProtected(li) {
    if (li.dataset.rfPw) return li.dataset.rfPw === "1";
    const prot = !!li.querySelector(".event-header li.password.protected");
    li.dataset.rfPw = prot ? "1" : "0";
    return prot;
  }

  function isChampionshipURT(li) {
    if (li.dataset.rfUrt) return li.dataset.rfUrt === "1";
    const ok = li.classList.contains("gold") || li.classList.contains("gold_protected");
    li.dataset.rfUrt = ok ? "1" : "0";
    return ok;
  }

  function getStartMinutes(li) {
    if (li.dataset.rfStart) return parseInt(li.dataset.rfStart, 10);
    const txt = (li.textContent || "").toLowerCase();
    if (txt.includes("waiting") || txt.includes("asap")) { li.dataset.rfStart = "0"; return 0; }
    const hm = txt.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/);
    const mOnly = txt.match(/\b(\d+)\s*m\b/);
    let mins = null;
    if (hm) {
      const h = parseInt(hm[1], 10) || 0;
      const m = hm[2] ? (parseInt(hm[2], 10) || 0) : 0;
      mins = h * 60 + m;
    } else if (mOnly) {
      mins = parseInt(mOnly[1], 10) || 0;
    }
    if (mins != null && Number.isFinite(mins)) { li.dataset.rfStart = String(mins); return mins; }
    return null;
  }

  function getCarNameFictional(li) {
    const el = li.querySelector(".event-header li.car span.t-hide");
    const txt = (el?.textContent || "").trim();
    if (txt) return txt;
    const t2 = (li.querySelector(".event-header li.car")?.textContent || "").trim();
    return t2 || "";
  }

  function getCarNameReal(li) {
    const fic = getCarNameFictional(li);
    return CAR_FICTIONAL_TO_REAL[fic] || fic || "";
  }

  function getCarNameForMode(li) {
    return state.useRealCarNames ? getCarNameReal(li) : getCarNameFictional(li);
  }

  function buildLapOptions() {
    const vals = ["Any"];
    for (let i = 1; i <= 10; i++) vals.push(String(i));
    for (let i = 15; i <= 50; i += 5) vals.push(String(i));
    for (let i = 75; i <= 100; i += 25) vals.push(String(i));
    return vals;
  }

  function buildCarOptionsForMode() {
    const fixed = [
      "Any",
      "A", "B", "C", "D", "E",
      "Stock A", "Stock B", "Stock C", "Stock D", "Stock E"
    ];
    const carsFictional = CARCLASS_OPTIONS.filter(v => fixed.indexOf(v) === -1);
    const carsReal = carsFictional.map(f => CAR_FICTIONAL_TO_REAL[f] || f);
    return state.useRealCarNames ? fixed.concat(carsReal) : fixed.concat(carsFictional);
  }

  function lapsOk(li) {
    if (state.laps === "Any") return true;
    const target = parseInt(state.laps, 10);
    if (!Number.isFinite(target)) return true;
    const n = getLaps(li);
    if (n == null) return true;
    return state.lapsMode === "min" ? n >= target : n === target;
  }

  function trackOk(li) {
    if (state.track === "Any") return true;
    return getTrackName(li) === state.track;
  }

  function pwOk(li) {
    if (!supporter.unlocked) return true;
    if (state.pw === "any") return true;
    const prot = isPasswordProtected(li);
    if (state.pw === "hide") return !prot;
    if (state.pw === "show") return prot;
    return true;
  }

  function urtOk(li) {
    if (!supporter.unlocked) return true;
    if (state.urt === "any") return true;
    const champ = isChampionshipURT(li);
    if (state.urt === "only") return champ;
    if (state.urt === "hide") return !champ;
    return true;
  }

  function carClassOk(li) {
    if (!supporter.unlocked) return true;
    if (!state.carClass || state.carClass === "Any") return true;

    const v = state.carClass;
    const vLow = norm(v);

    const rowText = norm(li.textContent);

    if (vLow === "a" || vLow === "b" || vLow === "c" || vLow === "d" || vLow === "e") {
      const re = new RegExp(`\\bclass\\s*${vLow}\\b|\\b${vLow}\\s*class\\b`, "i");
      return re.test(rowText);
    }

    if (vLow.startsWith("stock ")) {
      const cls = vLow.replace("stock ", "");
      const re = new RegExp(`\\bstock\\b.*\\bclass\\s*${cls}\\b|\\bstock\\s*${cls}\\b`, "i");
      return re.test(rowText);
    }

    const carInRow = norm(getCarNameForMode(li));
    if (!carInRow) return true;

    return carInRow === vLow || carInRow.indexOf(vLow) !== -1;
  }

  function startOk(li) {
    if (!supporter.unlocked) return true;
    if (!state.startMax || state.startMax === "Any") return true;
    const maxMins = parseInt(state.startMax, 10);
    if (!Number.isFinite(maxMins)) return true;
    const mins = getStartMinutes(li);
    if (mins == null) return true;
    return mins <= maxMins;
  }
function popularityOk(li) {
  if (!supporter.unlocked) return true;
  if (!state.popMin || state.popMin === "Any") return true;

  const minPct = parseInt(state.popMin, 10);
  if (!Number.isFinite(minPct)) return true;

  const { cur, max } = getDrivers(li);
  if (cur == null || max == null || max <= 0) return true;

  const pct = (cur / max) * 100;
  return pct >= minPct;
}

  function showFullOk(li) {
    if (!supporter.unlocked) return true;
    if (state.showFull) return true;
    const { cur, max } = getDrivers(li);
    if (cur == null || max == null) return true;
    return cur < max;
  }

  function betOk(li) {
    if (!supporter.unlocked) return true;
    if (state.bet === "any") return true;
    const fee = getFee(li);
    if (fee == null) return true;
    return state.bet === "free" ? fee === 0 : fee > 0;
  }

  function keep(li) {
    if (!state.enabled) return true;

    if (!trackOk(li)) return false;
    if (!lapsOk(li)) return false;

    if (!pwOk(li)) return false;
    if (!urtOk(li)) return false;
    if (!carClassOk(li)) return false;

    if (!startOk(li)) return false;
    if (!betOk(li)) return false;
    if (!popularityOk(li)) return false;
    if (!showFullOk(li)) return false;

    return true;
  }

  let applyToken = 0;
  function applyBatched() {
    const items = getItems();
    if (!items.length) return;

    const myToken = ++applyToken;
    let i = 0;

    function step() {
      if (myToken !== applyToken) return;

      const end = Math.min(i + BATCH_SIZE, items.length);
      for (; i < end; i++) {
        const li = items[i];
        const shouldShow = keep(li);
        const last = li.dataset.rfShow;
        const now = shouldShow ? "1" : "0";
        if (last !== now) {
          li.dataset.rfShow = now;
          li.style.display = shouldShow ? "" : "none";
        }
      }
      if (i < items.length) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  let tmr = null;
  function scheduleApply() {
    if (tmr) clearTimeout(tmr);
    tmr = setTimeout(() => { tmr = null; applyBatched(); }, DEBOUNCE_MS);
  }

  function makePair(labelText, controlEl) {
    const pair = document.createElement("div");
    pair.className = "pair";
    const lab = document.createElement("div");
    lab.className = "lbl";
    lab.textContent = labelText;
    pair.append(lab, controlEl);
    return pair;
  }

  function makePlainChkPair(labelText, checkboxEl, text) {
    const pair = document.createElement("div");
    pair.className = "pair";
    const lab = document.createElement("div");
    lab.className = "lbl";
    lab.textContent = labelText;
    const box = document.createElement("label");
    box.className = "plainChk";
    box.append(checkboxEl, document.createTextNode(" " + text));
    pair.append(lab, box);
    return pair;
  }

  function lockEl(el, locked) {
    el.disabled = !!locked;
    el.classList.toggle("rtLocked", !!locked);
    if (locked) el.title = "Supporter feature";
    else el.title = "";
  }

  function mountUI() {
    const wrap = document.querySelector(".custom-events-wrap");
    if (!wrap || document.getElementById("modulRF")) return false;

    const bar = document.createElement("div");
    bar.id = "modulRF";

    const supportTop = document.createElement("div");
    supportTop.className = "supportTop";

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = supporter.unlocked ? "💎 Supporter: Verified ✅" : "💎 Supporter: Locked 🔒";

    const btnVerify = document.createElement("button");
    btnVerify.className = "btnSmall";
    btnVerify.textContent = supporter.unlocked ? "Manage" : "Verify";
    btnVerify.onclick = async () => {
      if (supporter.unlocked) {
        const ok = confirm("Disable supporter and clear saved license?");
        if (!ok) return;
        gmSet(STORE.license, "");
        gmSet(STORE.settings, "");
        location.reload();
        return;
      }

      const myUid = getMyUserId();
      const shown = myUid ? `Detected ID: ${myUid}\n\n` : "";
      const lic = prompt(shown + "Paste supporter license:");
      if (!lic) return;

      const res = await verifyLicenseAsync(lic);
      if (!res.ok) {
        alert("License rejected: " + res.reason);
        return;
      }

      gmSet(STORE.license, lic.trim());
      alert("Supporter verified.");
      location.reload();
    };

    supportTop.append(tag, btnVerify);

    const topBtns = document.createElement("div");
    topBtns.className = "topBtns";

    const btnFilter = document.createElement("button");
    btnFilter.textContent = state.enabled ? "Filter: ON" : "Filter: OFF";
    btnFilter.onclick = () => {
      setState({ enabled: !state.enabled });
      btnFilter.textContent = state.enabled ? "Filter: ON" : "Filter: OFF";
      scheduleApply();
    };

    const btnAdv = document.createElement("button");
    btnAdv.textContent = supporter.unlocked ? (state.advOpen ? "Advanced ▲" : "Advanced ▼") : "Advanced (Supporter)";

    const advWrap = document.createElement("div");
    advWrap.style.display = (!supporter.unlocked) ? "block" : (state.advOpen ? "block" : "none");

    btnAdv.onclick = () => {
      if (!supporter.unlocked) return;
      setState({ advOpen: !state.advOpen });
      btnAdv.textContent = state.advOpen ? "Advanced ▲" : "Advanced ▼";
      advWrap.style.display = state.advOpen ? "block" : "none";
    };

    topBtns.append(btnFilter, btnAdv);

    const grid = document.createElement("div");
    grid.className = "grid";

    const col1 = document.createElement("div");
    col1.className = "col";

    const col2 = document.createElement("div");
    col2.className = "col";

    const selTrack = document.createElement("select");
    selTrack.innerHTML = TRACKS.map(t => `<option value="${t}">${t}</option>`).join("");
    selTrack.value = state.track;
    selTrack.onchange = () => { setState({ track: selTrack.value }); scheduleApply(); };

    const selLaps = document.createElement("select");
    selLaps.innerHTML = buildLapOptions().map(v => `<option value="${v}">${v}</option>`).join("");
    selLaps.value = state.laps;
    selLaps.onchange = () => { setState({ laps: selLaps.value }); scheduleApply(); };

    const selMode = document.createElement("select");
    selMode.innerHTML = `<option value="exact">Exact</option><option value="min">Min</option>`;
    selMode.value = state.lapsMode;
    selMode.onchange = () => { setState({ lapsMode: selMode.value }); scheduleApply(); };

    const selCarNames = document.createElement("select");
    selCarNames.innerHTML = `<option value="fictional">Fictional</option><option value="real">Real (OG)</option>`;
    selCarNames.value = state.useRealCarNames ? "real" : "fictional";

    const selCar = document.createElement("select");

    function refillCarSelect() {
      const opts = buildCarOptionsForMode();
      selCar.innerHTML = opts.map(v => `<option value="${v}">${v}</option>`).join("");
      if (opts.indexOf(state.carClass) === -1) setState({ carClass: "Any" });
      selCar.value = state.carClass;
    }

    refillCarSelect();

    selCarNames.onchange = () => {
      setState({ useRealCarNames: selCarNames.value === "real", carClass: "Any" });
      refillCarSelect();
      scheduleApply();
    };

    col1.append(
      makePair("🗺️ Track", selTrack),
      makePair("🎯 Lap mode", selMode),
      makePair("🔁 Laps", selLaps),
      makePair("🏷️ Car names", selCarNames)
    );

    const selPw = document.createElement("select");
    selPw.innerHTML = `<option value="any">Any</option><option value="show">Show</option><option value="hide">Hide</option>`;
    selPw.value = state.pw;
    selPw.onchange = () => { setState({ pw: selPw.value }); scheduleApply(); };

    const selURT = document.createElement("select");
    selURT.innerHTML = `<option value="any">Any</option><option value="only">Only</option><option value="hide">Hide</option>`;
    selURT.value = state.urt;
    selURT.onchange = () => { setState({ urt: selURT.value }); scheduleApply(); };

    selCar.onchange = () => { setState({ carClass: selCar.value }); scheduleApply(); };

    const selStart = document.createElement("select");
    selStart.innerHTML = START_MAX_OPTS.map(o => `<option value="${o.v}">${o.label}</option>`).join("");
    selStart.value = state.startMax;
    selStart.onchange = () => { setState({ startMax: selStart.value }); scheduleApply(); };

    const selPop = document.createElement("select");
    selPop.innerHTML = POPULARITY_MIN_OPTS
        .map(o => `<option value="${o.v}">${o.label}</option>`)
        .join("");
    selPop.value = state.popMin;
    selPop.onchange = () => { setState({ popMin: selPop.value }); scheduleApply(); };

    const selBet = document.createElement("select");
    selBet.innerHTML = `<option value="any">Any</option><option value="free">Free</option><option value="bet">Bet</option>`;
    selBet.value = state.bet;
    selBet.onchange = () => { setState({ bet: selBet.value }); scheduleApply(); };

    const cbFull = document.createElement("input");
    cbFull.type = "checkbox";
    cbFull.checked = !!state.showFull;
    cbFull.onchange = () => { setState({ showFull: cbFull.checked }); scheduleApply(); };

    const supporterControls = [btnAdv, selPw, selURT, selCar, selStart, selBet, selPop, cbFull];
    supporterControls.forEach(el => lockEl(el, !supporter.unlocked));


    advWrap.append(
      makePair("🔒 Password", selPw),
      makePair("⭐ URT", selURT),
      makePair("🚗 Car/Class", selCar),
      makePair("⏱️ Start", selStart),
      makePair("💰 Bet", selBet),
      makePair("📈 Popularity", selPop),
      makePlainChkPair("👥 Status", cbFull, "Show full")
    );

    col2.append(advWrap);
    grid.append(col1, col2);

    const footer = document.createElement("div");
    footer.className = "footer";

    const footerBtns = document.createElement("div");
    footerBtns.className = "footerBtns";

    const btnBecome = document.createElement("button");
    btnBecome.textContent = "Become a supporter";
    btnBecome.onclick = () => window.open(BECOME_SUPPORTER_URL, "_blank", "noopener,noreferrer");

    const btnKofi = document.createElement("button");
    btnKofi.textContent = "☕⭐ Buy me a Ko-fi";
    btnKofi.onclick = () => window.open(KOFI_URL, "_blank", "noopener,noreferrer");

    if (!supporter.unlocked) footerBtns.append(btnBecome);
    footerBtns.append(btnKofi);
    footer.append(footerBtns);

    bar.append(supportTop, topBtns, grid, footer);
    wrap.parentNode.insertBefore(bar, wrap);

    scheduleApply();
    return true;
  }

  async function boot() {
    state = Object.assign({}, DEFAULTS);

    const savedLic = gmGet(STORE.license, "");
    if (savedLic) {
      const res = await verifyLicenseAsync(savedLic);
      supporter.unlocked = !!res.ok;
      supporter.reason = res.ok ? "Verified" : res.reason;

      if (supporter.unlocked) {
        state = loadSupporterSettings();
      } else {
        gmSet(STORE.license, "");
        gmSet(STORE.settings, "");
        supporter.unlocked = false;
      }
    }

    if (mountUI()) return;

    const obs = new MutationObserver(() => {
      if (mountUI()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), 6000);
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", boot)
    : boot();

})();

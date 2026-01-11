// ==UserScript==
// @name         Torn Profile + Crimes Helper (Unified)
// @namespace    https://www.torn.com/
// @version      1.4
// @description  Profile names clear + Crimes progress bar enhancer + CT-Chest helper tab + Chain watcher tab + Jewelry tab
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556886/Torn%20Profile%20%2B%20Crimes%20Helper%20%28Unified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556886/Torn%20Profile%20%2B%20Crimes%20Helper%20%28Unified%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PROFILE_SETTINGS_KEY = 'pnc_settings_v3';
  const PROFILE_DEFAULTS = {
    fontSource: 'system',
    googleFamily: '',
    fontFamily: 'Tahoma, serif',
    fontSize: 12,
    bold: false,
    color: '#ffffff',
    align: 'left',
    panel: { x: 24, y: 80, visible: true }
  };

  const CRIME_SETTINGS_KEY = 'tmCrimeBarSettings';
  const CRIME_DEFAULTS = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    barHeight: 20,
    enabled: true,
    fontSource: 'system',
    googleFamily: ''
  };

  // ===== CT-CHEST =====
  const CT_STORAGE_KEY = "sg_chest_helper_v121";
  const CT_POOL = [1,2,3,4,5,6,7,8,9];
  const CT_DIGITS = 3;
  const CT_TOTAL_ATTEMPTS = 4;
  const CT_EXTRA_AFTER_FIRST = 3;
  const CT_FIRST_GUESS = "123";
  const CT_COLORS = {
    none: { bg: "#f2f2f2", fg: "#111" },
    R:    { bg: "#ff3b30", fg: "#111" },
    O:    { bg: "#ff9500", fg: "#111" },
    G:    { bg: "#34c759", fg: "#111" }
  };

  // ===== CHAIN WATCHER (Integrated) =====
  const CH_STORAGE_PREFIX    = 'tm_torn_chain_';
  const CH_DATA_KEY          = CH_STORAGE_PREFIX + 'data';
  const CH_LAST_FETCH_KEY    = CH_STORAGE_PREFIX + 'lastFetch';
  const CH_FETCH_LOCK_KEY    = CH_STORAGE_PREFIX + 'fetchLock';
  const CH_API_KEY_KEY       = CH_STORAGE_PREFIX + 'apiKey';
  const CH_ENABLED_KEY       = CH_STORAGE_PREFIX + 'enabled';
  const CH_SOUND_ENABLED_KEY = CH_STORAGE_PREFIX + 'soundEnabled';
  const CH_SOUND_VOLUME_KEY  = CH_STORAGE_PREFIX + 'soundVolume';

  const CH_FETCH_INTERVAL_MS = 15 * 1000;
  const CH_LOCK_TTL_MS       = 5 * 1000;

  // ===== JEWELRY (Integrated, per-page ON/OFF) =====
  const JW_PREFIX            = 'tm_torn_jewelry_';
  const JW_API_KEY_KEY       = JW_PREFIX + 'apiKey';
  const JW_ENABLED_PAGES_KEY = JW_PREFIX + 'enabledPages'; // JSON map { [pageId]: true/false }
  const JW_DATA_KEY          = JW_PREFIX + 'data';
  const JW_LAST_FETCH_KEY    = JW_PREFIX + 'lastFetch';
  const JW_FETCH_LOCK_KEY    = JW_PREFIX + 'fetchLock';
  const JW_FETCH_INTERVAL_MS = 60 * 1000;
  const JW_LOCK_TTL_MS       = 5 * 1000;

  const tabId = 'tab-' + Date.now() + '-' + Math.random().toString(16).slice(2);

  let chChainData = null;
  let chLastDataRaw = null;

  let chAudioCtx = null;
  let chBeepIntervalId = null;
  let chIsBeeping = false;

  let jwData = null;
  let jwLastDataRaw = null;

  const SYSTEM_FONT_CANDIDATES = [
    'Arial','Verdana','Tahoma','Trebuchet MS','Segoe UI','Calibri','Cambria','Georgia','Times New Roman',
    'Courier New','Consolas','Menlo','Monaco','Lucida Console','Lucida Sans Unicode','Helvetica Neue',
    'Helvetica','Ubuntu','Cantarell','Roboto','Noto Sans','Noto Serif','Source Sans Pro','Inter'
  ];
  const GOOGLE_FONTS = [
    'Inter','Roboto','Open Sans','Lato','Montserrat','Poppins','Nunito','Raleway','Oswald','Merriweather',
    'Playfair Display','Source Sans 3','Noto Sans','Noto Serif','Rubik','Quicksand','Work Sans','IBM Plex Sans'
  ];

  const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
  const isMobile = () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  const normHex = c => { if(!c) return '#ffffff'; c=c.trim(); if(!c.startsWith('#')) c='#'+c; return /^#([0-9a-fA-F]{6})$/.test(c)?c:'#ffffff'; };

  let storedProfile = null;
  try { storedProfile = JSON.parse(localStorage.getItem(PROFILE_SETTINGS_KEY)); } catch {}
  let profileSettings = Object.assign({}, PROFILE_DEFAULTS, storedProfile || {});
  if (!storedProfile) {
    try { localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(profileSettings)); } catch {}
  }

  function saveProfileSettings() {
    try { localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(profileSettings)); } catch {}
  }

  function loadCrimeSettings() {
    let saved;
    try { saved = GM_getValue(CRIME_SETTINGS_KEY, {}); } catch { saved = {}; }
    if (!saved || typeof saved !== 'object') saved = {};
    return Object.assign({}, CRIME_DEFAULTS, saved);
  }

  let crimeSettings = loadCrimeSettings();

  function saveCrimeSettings() {
    try { GM_setValue(CRIME_SETTINGS_KEY, crimeSettings); } catch {}
  }

  function ensureLink(id, href, rel, crossorigin){
    if (document.getElementById(id)) return;
    const l=document.createElement('link');
    l.id=id;
    l.rel=rel;
    l.href=href;
    if (crossorigin) l.crossOrigin='anonymous';
    document.head.appendChild(l);
  }

  let loadedGoogleFonts = [];

  function loadGoogleFont(family){
    if (!family) return;
    const name = family.trim();
    if (!name) return;
    if (!loadedGoogleFonts.includes(name)) loadedGoogleFonts.push(name);
    ensureLink('pnc-preconnect-gf1','https://fonts.googleapis.com','preconnect');
    ensureLink('pnc-preconnect-gf2','https://fonts.gstatic.com','preconnect', true);
    let link=document.getElementById('pnc-google-font');
    if(!link){
      link=document.createElement('link');
      link.id='pnc-google-font';
      link.rel='stylesheet';
      document.head.appendChild(link);
    }
    const params = loadedGoogleFonts.map(f => 'family=' + encodeURIComponent(f).replace(/%20/g,'+')).join('&');
    link.href=`https://fonts.googleapis.com/css2?${params}&display=swap`;
  }

  function isFontPresent(font){
    const testStr='mmmmmmmmmmlliWWWWW', bases=['monospace','sans-serif','serif'];
    const body=document.body||document.documentElement, def={}, spans={};
    bases.forEach(base=>{ const s=document.createElement('span'); s.style.position='absolute'; s.style.left='-9999px'; s.style.fontSize='72px'; s.style.fontFamily=base; s.textContent=testStr; body.appendChild(s); def[base]=s.getBoundingClientRect().width; spans[base]=s; });
    let ok=false;
    bases.forEach(base=>{ spans[base].style.fontFamily=`"${font}", ${base}`; if (spans[base].getBoundingClientRect().width!==def[base]) ok=true; });
    bases.forEach(base=>spans[base].remove());
    return ok;
  }

  let panelRef=null;

  function injectCSS(){
    const css = `
    :root {
      --tm-crime-bar-font-family: ${crimeSettings.fontFamily};
      --tm-crime-bar-font-size: ${crimeSettings.fontSize}px;
      --tm-crime-bar-height: ${crimeSettings.barHeight}px;
    }

    .pnc-panel, .pnc-panel * { box-sizing: border-box; }
    .pnc-panel{
      position:fixed;
      top:${profileSettings.panel.y}px;
      left:${profileSettings.panel.x}px;
      width:340px;
      background:#1e2227;
      color:#eaecef;
      border:1px solid #3a3f45;
      border-radius:10px;
      box-shadow:0 12px 30px rgba(0,0,0,.35);
      z-index:2147483647;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Arial,Helvetica Neue,Noto Sans,Emoji;
    }
    .pnc-panel.hidden{ display:none; }

    .pnc-panel-header{
      padding:10px 12px;
      border-bottom:1px solid #2e3338;
      font-size:14px;
      font-weight:600;
      cursor:move;
      display:flex;
      align-items:center;
      justify-content:space-between;
      user-select:none;
      gap:8px;
    }
    .pnc-tabs{ display:flex; gap:4px; flex-wrap:wrap; }
    .pnc-tab-btn{
      padding:4px 8px;
      border-radius:6px;
      border:1px solid #3a4047;
      background:#262b31;
      color:#eaecef;
      font-size:11px;
      cursor:pointer;
      white-space:nowrap;
    }
    .pnc-tab-btn.active{ background:#3a3f45; }

    .pnc-close{
      cursor:pointer;
      padding:2px 8px;
      border-radius:6px;
      background:#2b2f36;
      flex:0 0 auto;
    }
    .pnc-panel-body{
      padding:12px;
      display:grid;
      gap:12px;
      font-size:13px;
    }
    .pnc-field label{
      display:block;
      margin-bottom:6px;
      color:#b7c0cc;
      font-size:12px;
    }
    .pnc-select, .pnc-input{
      width:100%;
      max-width:100%;
      padding:8px 10px;
      background:#262b31;
      border:1px solid #3a4047;
      color:#eaecef;
      border-radius:8px;
      outline:none;
    }
    .pnc-row{ display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; }
    .pnc-seg{ display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
    .pnc-seg button{
      padding:6px 8px;
      background:#262b31;
      border:1px solid #3a4047;
      color:#eaecef;
      border-radius:8px;
      cursor:pointer;
    }
    .pnc-seg button.active{ background:#3a3f45; }
    .pnc-color{
      appearance:none;
      -webkit-appearance:none;
      width:32px;
      height:32px;
      padding:0;
      border:1px solid #3a4047;
      border-radius:999px;
      background:conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
      cursor:pointer;
    }
    .pnc-color::-webkit-color-swatch-wrapper { padding:0; border-radius:999px; }
    .pnc-color::-webkit-color-swatch { border:none; border-radius:999px; }
    .pnc-gear-btn{
      position:fixed;
      bottom:16px;
      left:16px;
      right:auto;
      width:36px;
      height:36px;
      line-height:36px;
      text-align:center;
      border-radius:50%;
      background:#2b2f36;
      color:#fff;
      cursor:pointer;
      z-index:2147483647;
      font-weight:700;
      box-shadow:0 4px 12px rgba(0,0,0,.3);
      user-select:none;
    }
    .pnc-row-left{
      display:flex;
      align-items:center;
      justify-content:flex-start;
      gap:8px;
    }
    .pnc-row-left input[type="checkbox"]{ margin:0; }
    .pnc-button{
      padding:6px 8px;
      background:#262b31;
      border:1px solid #3a4047;
      color:#eaecef;
      border-radius:8px;
      cursor:pointer;
      width:100%;
    }
    .pnc-button:hover{ background:#3a3f45; }

    .honor-text-wrap .honor-text-svg{
      position:absolute !important;
      left:0 !important;
      right:0 !important;
      width:100% !important;
      top:50% !important;
      transform:translateY(-50%) !important;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      padding:0 2px;
    }
    .honor-text-wrap .honor-text-svg + .honor-text{ display:none !important; }

    body.tm-crime-enabled .tm-crime-progress-label{
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%, -50%);
      pointer-events:none;
      font-family:var(--tm-crime-bar-font-family);
      font-size:var(--tm-crime-bar-font-size);
      font-weight:bold;
      color:#fff;
      text-shadow:0 0 3px #000, 0 0 5px #000;
      white-space:nowrap;
      z-index:2;
      display:block;
    }
    body:not(.tm-crime-enabled) .tm-crime-progress-label{
      display:none !important;
    }
    body.tm-crime-enabled .tm-crime-progress-track{ height:var(--tm-crime-bar-height) !important; }
    body.tm-crime-enabled .tm-crime-progress-fill{ height:var(--tm-crime-bar-height) !important; }

    /* ===== CT-CHEST ===== */
    #ct-hint{
      font-size:12px;
      color:#b7c0cc;
      line-height:1.25;
      margin-bottom:10px;
    }
    #ct-topline{
      display:flex;
      justify-content:space-between;
      gap:10px;
      font-size:12px;
      font-weight:800;
      opacity:.95;
      margin-bottom:8px;
    }
    #ct-row-digits{
      display:grid;
      grid-template-columns:repeat(3, 1fr);
      gap:8px;
      margin-bottom:10px;
    }
    .ct-digit{
      height:46px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.14);
      background:#f2f2f2;
      font-size:18px;
      font-weight:900;
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      outline:none;
      color:#111;
      user-select:none;
    }
    .ct-digit:active{ transform:translateY(1px); }
    #ct-row-meta{
      display:flex;
      justify-content:space-between;
      gap:10px;
      font-size:12px;
      margin-bottom:10px;
      opacity:.95;
      color:#eaecef;
    }
    #ct-msg{
      font-size:12px;
      margin-bottom:10px;
      padding:8px 10px;
      border-radius:10px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.10);
      min-height:34px;
      display:flex;
      align-items:center;
      white-space:pre-wrap;
      color:#eaecef;
    }
    .ct-btn{
      width:100%;
      height:40px;
      border-radius:12px;
      border:1px solid #3a4047;
      background:#262b31;
      color:#eaecef;
      cursor:pointer;
      font-weight:800;
      letter-spacing:.2px;
      margin-top:8px;
    }
    .ct-btn:hover{ background:#3a3f45; }
    .ct-btn:active{ transform:translateY(1px); }
    .ct-btn[disabled]{ opacity:.55; cursor:not-allowed; }
    #ct-log{
      margin-top:10px;
      font-size:12px;
      opacity:.95;
      max-height:140px;
      overflow:auto;
      padding-right:4px;
    }
    .ct-logline{
      padding:6px 0;
      border-top:1px dashed rgba(255,255,255,.18);
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
    }
    .ct-badges{ display:inline-flex; gap:4px; align-items:center; }
    .ct-badge{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:20px;
      height:18px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.15);
      background:rgba(255,255,255,.08);
      font-weight:900;
      font-size:11px;
      color:#eaecef;
    }

    /* ===== CHAIN ===== */
    #ch-hint{
      font-size:12px;
      color:#b7c0cc;
      line-height:1.25;
      margin-bottom:10px;
    }
    #ch-display{
      font-size:34px;
      font-weight:900;
      margin-top:6px;
      padding:8px 10px;
      border-radius:10px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.10);
      text-align:left;
    }
    .ch-inline{
      display:grid;
      grid-template-columns:1fr auto;
      gap:8px;
      align-items:center;
    }
    .ch-mini{
      font-size:11px;
      color:#b7c0cc;
      margin-top:6px;
      white-space:pre-wrap;
      line-height:1.25;
    }

    .pnc-panel.tm-chain-alert{
      border-color:#00ff66 !important;
      animation: tm-chain-alert-blink 1s infinite;
      box-shadow:0 0 4px rgba(0,255,102,0.35), 0 0 18px rgba(0,255,102,0.35);
    }
    @keyframes tm-chain-alert-blink{
      0%,100%{ box-shadow:0 0 4px rgba(0,255,102,0.25), 0 0 10px rgba(0,255,102,0.25); }
      50%{ box-shadow:0 0 10px rgba(0,255,102,0.95), 0 0 26px rgba(0,255,102,0.95); }
    }

    /* ===== JEWELRY ===== */
    #jw-hint{
      font-size:12px;
      color:#b7c0cc;
      line-height:1.25;
      margin-bottom:10px;
    }
    #jw-status{
      font-size:11px;
      color:#b7c0cc;
      margin-top:6px;
      white-space:pre-wrap;
      line-height:1.25;
    }
    #jw-line{
      margin-top:10px;
      padding:8px 10px;
      border-radius:10px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.10);
      font-size:13px;
      font-weight:800;
    }
    `;
    GM_addStyle(css);
  }

  function styleHonor(el){
    el.style.fontFamily = profileSettings.fontFamily;
    el.style.fontSize   = `${parseInt(profileSettings.fontSize,10)||12}px`;
    el.style.fontWeight = profileSettings.bold ? '700' : '400';
    el.style.color      = normHex(profileSettings.color);
    el.style.textAlign  = profileSettings.align;
    el.style.borderRadius = '5px';
    if (isMobile()) el.style.textShadow='2px 2px 3px #000';
    else el.style.textShadow='4px 4px 5px #000';
  }

  function processHonor(){
    const list = document.querySelectorAll('.honor-text-svg');
    list.forEach(el=>{
      if(!el.dataset.cleaned){
        const spans=el.querySelectorAll('span[data-char]');
        if(spans.length){
          let t=''; spans.forEach(s=> t += s.getAttribute('data-char'));
          el.textContent=t;
        }
        el.dataset.cleaned='true';
      }
      const sib = el.nextElementSibling;
      if (sib && sib.classList.contains('honor-text')) sib.style.display='none';
      styleHonor(el);
    });
  }

  function extractCrimeLabelFromAria(aria) {
    if (!aria) return '';
    const m = aria.match(/Crime skill:\s*([\d,]+)\s*\((\d+)%\)/i);
    if (m) return `Crime level ${m[1]} - ${m[2]}%`;
    return aria;
  }

  function updateCrimeCssVars() {
    document.documentElement.style.setProperty('--tm-crime-bar-font-family', crimeSettings.fontFamily);
    document.documentElement.style.setProperty('--tm-crime-bar-font-size', crimeSettings.fontSize + 'px');
    document.documentElement.style.setProperty('--tm-crime-bar-height', crimeSettings.barHeight + 'px');
  }

  function applyCrimeEnabledState() {
    if (crimeSettings.enabled) document.body.classList.add('tm-crime-enabled');
    else document.body.classList.remove('tm-crime-enabled');
  }

  function enhanceCrimeProgressBar(bar) {
    if (!bar || bar.dataset.tmCrimeEnhanced === '1') return;
    const track = bar.querySelector('div[class^="progressTrack___"], div[class*=" progressTrack___"]');
    const fill = bar.querySelector('div[aria-label^="Crime skill"]');
    if (!track || !fill) return;
    bar.dataset.tmCrimeEnhanced = '1';
    track.classList.add('tm-crime-progress-track');
    fill.classList.add('tm-crime-progress-fill');
    if (getComputedStyle(bar).position === 'static') {
      bar.style.position = 'relative';
    }
    const label = document.createElement('div');
    label.className = 'tm-crime-progress-label';
    label.textContent = extractCrimeLabelFromAria(fill.getAttribute('aria-label'));
    bar.appendChild(label);
    const observer = new MutationObserver(() => {
      label.textContent = extractCrimeLabelFromAria(fill.getAttribute('aria-label'));
    });
    observer.observe(fill, { attributes: true, attributeFilter: ['aria-label'] });
  }

  function enhanceAllCrimeBars() {
    if (!/page\.php\?sid=crimes/.test(location.href)) return;
    const bars = document.querySelectorAll('div[class^="progressBar___"], div[class*=" progressBar___"]');
    bars.forEach(enhanceCrimeProgressBar);
  }

  function makeMovable(box, handle){
    let sx=0, sy=0, sl=0, st=0, drag=false;
    const down=e=>{ drag=true; sx=e.clientX; sy=e.clientY; const r=box.getBoundingClientRect(); sl=r.left; st=r.top; document.addEventListener('pointermove', move); document.addEventListener('pointerup', up, {once:true}); };
    const move=e=>{ if(!drag) return; box.style.left=`${sl+(e.clientX-sx)}px`; box.style.top=`${st+(e.clientY-sy)}px`; };
    const up=()=>{ drag=false; document.removeEventListener('pointermove', move); const r=box.getBoundingClientRect(); profileSettings.panel.x=Math.round(r.left); profileSettings.panel.y=Math.round(r.top); saveProfileSettings(); };
    handle.style.touchAction='none';
    handle.addEventListener('pointerdown', down);
  }

  function openPanel(){
    if (!panelRef) return;
    profileSettings.panel.visible=true;
    saveProfileSettings();
    panelRef.classList.remove('hidden');
  }

  function applyProfileNow(){
    document.querySelectorAll('.honor-text-svg').forEach(styleHonor);
  }

  // ===== CT-CHEST ENGINE =====
  const ctAllCodes = ctBuildAllCodes(CT_POOL);

  function ctLoadState() {
    const raw = GM_getValue(CT_STORAGE_KEY, "");
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }
    const s = parsed && typeof parsed === "object" ? parsed : {};
    const migrated = ctMigrateFromOld(s);

    return {
      ui: migrated.ui || {},
      firstRecorded: !!migrated.firstRecorded,
      firstPattern: typeof migrated.firstPattern === "string" ? migrated.firstPattern : "",
      extraAttempts: Array.isArray(migrated.extraAttempts) ? migrated.extraAttempts.filter(ctIsAttempt).slice(0, CT_EXTRA_AFTER_FIRST) : [],
      currentGuess: typeof migrated.currentGuess === "string" ? migrated.currentGuess : CT_FIRST_GUESS,
      currentFeedback: Array.isArray(migrated.currentFeedback) ? ctNormalizeFeedback(migrated.currentFeedback) : ["none","none","none"],
      message: typeof migrated.message === "string" ? migrated.message : ""
    };
  }

  function ctMigrateFromOld(s) {
    if ("firstRecorded" in s || "extraAttempts" in s) return s;

    const out = { ...s };
    out.firstRecorded = false;
    out.firstPattern = "";
    out.extraAttempts = [];

    if (Array.isArray(s.attempts)) {
      const attempts = s.attempts.filter(ctIsAttempt);
      const first = attempts.find(a => a.guess === CT_FIRST_GUESS);
      if (first) {
        out.firstRecorded = true;
        out.firstPattern = first.pattern;
      }
      out.extraAttempts = attempts.filter(a => a.guess !== CT_FIRST_GUESS).slice(0, CT_EXTRA_AFTER_FIRST);
    }

    out.currentGuess = typeof s.currentGuess === "string" ? s.currentGuess : CT_FIRST_GUESS;
    out.currentFeedback = Array.isArray(s.currentFeedback) ? s.currentFeedback : ["none","none","none"];
    out.message = typeof s.message === "string" ? s.message : "";
    out.ui = s.ui || {};
    return out;
  }

  function ctSaveState(state) {
    GM_setValue(CT_STORAGE_KEY, JSON.stringify({
      ui: state.ui,
      firstRecorded: state.firstRecorded,
      firstPattern: state.firstPattern,
      extraAttempts: state.extraAttempts,
      currentGuess: state.currentGuess,
      currentFeedback: state.currentFeedback,
      message: state.message
    }));
  }

  function ctNormalizeFeedback(a) {
    const out = ["none","none","none"];
    for (let i = 0; i < 3; i++) {
      const v = a[i];
      out[i] = (v === "R" || v === "O" || v === "G") ? v : "none";
    }
    return out;
  }

  function ctIsAttempt(x) {
    return x && typeof x === "object"
      && typeof x.guess === "string" && /^[1-9]{3}$/.test(x.guess)
      && typeof x.pattern === "string" && /^[ROG]{3}$/.test(x.pattern);
  }

  function ctFeedbackToPattern(arr) {
    if (!Array.isArray(arr) || arr.length !== 3) return "";
    for (const v of arr) if (v !== "R" && v !== "O" && v !== "G") return "";
    return arr.join("");
  }

  function ctNextFeedback(v) {
    if (v === "none") return "R";
    if (v === "R") return "O";
    if (v === "O") return "G";
    return "R";
  }

  function ctPrevFeedback(v) {
    if (v === "none") return "G";
    if (v === "G") return "O";
    if (v === "O") return "R";
    return "G";
  }

  function ctBuildAllCodes(pool) {
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

  function ctEvalPattern(code, guess) {
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

  function ctFilterByAttempts(base, attempts) {
    let cur = base;
    for (const a of attempts) {
      cur = cur.filter((code) => ctEvalPattern(code, a.guess) === a.pattern);
      if (!cur.length) break;
    }
    return cur;
  }

  function ctPickBestGuess(cands, guessSpace) {
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
        const pat = ctEvalPattern(code, guess);
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

  // ===== CHAIN ENGINE =====
  function chEnabledDefaultTrue() {
    const enabledStored = localStorage.getItem(CH_ENABLED_KEY);
    return (enabledStored === null) ? true : (enabledStored === '1');
  }

  function chSoundEnabled() {
    return localStorage.getItem(CH_SOUND_ENABLED_KEY) === '1';
  }

  function chSoundVolume() {
    const raw = localStorage.getItem(CH_SOUND_VOLUME_KEY);
    const v = raw ? Number(raw) : 100;
    if (Number.isNaN(v)) return 100;
    return Math.min(300, Math.max(0, v));
  }

  function chFormatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const mm = (m < 10 ? '0' : '') + m;
    const ss = (s < 10 ? '0' : '') + s;
    return mm + ':' + ss;
  }

  function chEnsureAudioContext() {
    if (!chAudioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) chAudioCtx = new AC();
    }
  }

  function chPlayBeep(volumePercent) {
    if (!chAudioCtx) return;
    const osc = chAudioCtx.createOscillator();
    const gain = chAudioCtx.createGain();
    const gainValue = Math.max(0, Math.min(3, volumePercent / 100));
    gain.gain.value = gainValue;
    osc.frequency.value = 880;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(chAudioCtx.destination);
    const now = chAudioCtx.currentTime;
    osc.start(now);
    osc.stop(now + 0.2);
  }

  function chStartBeepLoop(volumePercent) {
    if (chIsBeeping) return;
    chEnsureAudioContext();
    if (!chAudioCtx) return;
    if (chAudioCtx.state === 'suspended') chAudioCtx.resume();
    chIsBeeping = true;
    chPlayBeep(volumePercent);
    chBeepIntervalId = setInterval(() => chPlayBeep(volumePercent), 1000);
  }

  function chStopBeepLoop() {
    if (!chIsBeeping) return;
    chIsBeeping = false;
    if (chBeepIntervalId) {
      clearInterval(chBeepIntervalId);
      chBeepIntervalId = null;
    }
  }

  function chMaybeFetch() {
    if (!chEnabledDefaultTrue()) return;

    const apiKey = (localStorage.getItem(CH_API_KEY_KEY) || '').trim();
    if (!apiKey) return;

    const now = Date.now();
    const lastFetch = Number(localStorage.getItem(CH_LAST_FETCH_KEY) || '0');
    if (now - lastFetch < CH_FETCH_INTERVAL_MS) return;

    const lockRaw = localStorage.getItem(CH_FETCH_LOCK_KEY);
    if (lockRaw) {
      try {
        const lock = JSON.parse(lockRaw);
        if (lock && lock.timestamp && (now - lock.timestamp) < CH_LOCK_TTL_MS && lock.tabId !== tabId) {
          return;
        }
      } catch {}
    }

    localStorage.setItem(CH_FETCH_LOCK_KEY, JSON.stringify({ tabId, timestamp: now }));

    const lastFetch2 = Number(localStorage.getItem(CH_LAST_FETCH_KEY) || '0');
    const now2 = Date.now();
    if (now2 - lastFetch2 < CH_FETCH_INTERVAL_MS) return;

    chFetchChain(apiKey);
  }

  function chFetchChain(apiKey) {
    const url = `https://api.torn.com/faction/?selections=chain&key=${encodeURIComponent(apiKey)}`;
    fetch(url, { credentials: 'omit' })
      .then(r => r.json())
      .then(json => {
        if (!json || json.error || !json.chain) return;
        const chain = json.chain;
        const now = Date.now();

        const timeoutSeconds = typeof chain.timeout === 'number' ? chain.timeout : 0;
        let expiresAt = 0;
        if (typeof chain.end === 'number' && chain.end > 0) expiresAt = chain.end * 1000;
        else expiresAt = now + timeoutSeconds * 1000;

        const data = {
          current: chain.current,
          max: chain.max,
          timeout: timeoutSeconds,
          modifier: chain.modifier,
          cooldown: chain.cooldown,
          start: chain.start,
          end: chain.end,
          receivedAt: now,
          expiresAt,
          cooldownExpiresAt: (chain.cooldown && chain.cooldown > 0) ? now + chain.cooldown * 1000 : 0
        };

        const raw = JSON.stringify(data);
        chLastDataRaw = raw;
        chChainData = data;
        localStorage.setItem(CH_DATA_KEY, raw);
        localStorage.setItem(CH_LAST_FETCH_KEY, String(now));
        chUpdateDisplay();
      })
      .catch(() => {});
  }

  // ===== JEWELRY ENGINE =====
  function jwPageId() {
    return location.pathname + location.search;
  }

  function jwLoadEnabledPages() {
    const raw = localStorage.getItem(JW_ENABLED_PAGES_KEY);
    if (!raw) return {};
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object') return obj;
    } catch {}
    return {};
  }

  function jwIsEnabledOnThisPage() {
    const pages = jwLoadEnabledPages();
    const id = jwPageId();
    if (typeof pages[id] === 'boolean') return pages[id];
    return true; // default ON (same behavior as before)
  }

  function jwSetEnabledOnThisPage(val) {
    const pages = jwLoadEnabledPages();
    pages[jwPageId()] = !!val;
    localStorage.setItem(JW_ENABLED_PAGES_KEY, JSON.stringify(pages));
  }

  function jwMaybeFetch() {
    if (!jwIsEnabledOnThisPage()) return;

    const apiKey = (localStorage.getItem(JW_API_KEY_KEY) || '').trim();
    if (!apiKey) return;

    const now = Date.now();
    const lastFetch = Number(localStorage.getItem(JW_LAST_FETCH_KEY) || '0');
    if (now - lastFetch < JW_FETCH_INTERVAL_MS) return;

    const lockRaw = localStorage.getItem(JW_FETCH_LOCK_KEY);
    if (lockRaw) {
      try {
        const lock = JSON.parse(lockRaw);
        if (lock && lock.timestamp && (now - lock.timestamp) < JW_LOCK_TTL_MS && lock.tabId !== tabId) {
          return;
        }
      } catch {}
    }

    localStorage.setItem(JW_FETCH_LOCK_KEY, JSON.stringify({ tabId, timestamp: now }));

    const lastFetch2 = Number(localStorage.getItem(JW_LAST_FETCH_KEY) || '0');
    const now2 = Date.now();
    if (now2 - lastFetch2 < JW_FETCH_INTERVAL_MS) return;

    jwFetch(apiKey);
  }

  function jwFetch(apiKey) {
    const url = `https://api.torn.com/torn/?selections=shoplifting&key=${encodeURIComponent(apiKey)}`;
    fetch(url, { credentials: 'omit' })
      .then(r => r.json())
      .then(json => {
        if (!json || json.error || !json.shoplifting || !json.shoplifting.jewelry_store) return;

        const jewelry = json.shoplifting.jewelry_store;
        if (!Array.isArray(jewelry)) return;

        const camerasEntry = jewelry.find(e => e && typeof e.title === 'string' && /camera/i.test(e.title));
        const guardEntry   = jewelry.find(e => e && typeof e.title === 'string' && /guard/i.test(e.title));

        const camerasStatus = (camerasEntry && camerasEntry.disabled === false) ? 'enabled' : 'disabled';
        const guardStatus   = (guardEntry && guardEntry.disabled === false) ? 'on' : 'off';

        const data = {
          camerasStatus,
          guardStatus,
          lastUpdate: Date.now()
        };

        const raw = JSON.stringify(data);
        jwLastDataRaw = raw;
        jwData = data;
        localStorage.setItem(JW_DATA_KEY, raw);
        localStorage.setItem(JW_LAST_FETCH_KEY, String(data.lastUpdate));
        jwUpdateDisplay();
      })
      .catch(() => {});
  }

  // UI refs set later
  const ui = {
    // chain
    chApiInput: null,
    chSaveBtn: null,
    chToggle: null,
    chSoundToggle: null,
    chSoundVolume: null,
    chDisplay: null,
    chMini: null,
    chainTabBtn: null,

    // jewelry
    jwApiInput: null,
    jwSaveBtn: null,
    jwTogglePage: null,
    jwStatus: null,
    jwLine: null
  };

  function chSyncFromStorageIfChanged() {
    const raw = localStorage.getItem(CH_DATA_KEY);
    if (raw && raw !== chLastDataRaw) {
      chLastDataRaw = raw;
      try {
        const parsed = JSON.parse(raw);
        if (!chChainData || !chChainData.receivedAt || !parsed.receivedAt || parsed.receivedAt >= chChainData.receivedAt) {
          chChainData = parsed;
          if (chChainData &&
              typeof chChainData.cooldown === 'number' &&
              chChainData.cooldown > 0 &&
              !chChainData.cooldownExpiresAt &&
              chChainData.receivedAt) {
            chChainData.cooldownExpiresAt = chChainData.receivedAt + chChainData.cooldown * 1000;
          }
        }
      } catch {}
    }
  }

  function jwSyncFromStorageIfChanged() {
    const raw = localStorage.getItem(JW_DATA_KEY);
    if (raw && raw !== jwLastDataRaw) {
      jwLastDataRaw = raw;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') jwData = parsed;
      } catch {}
    }
  }

  function chUpdateDisplay() {
    const displayEl = ui.chDisplay;
    if (!displayEl) return;

    const enabled = ui.chToggle ? ui.chToggle.checked : chEnabledDefaultTrue();
    const soundOn = ui.chSoundToggle ? ui.chSoundToggle.checked : chSoundEnabled();
    const vol = ui.chSoundVolume ? Number(ui.chSoundVolume.value || 0) : chSoundVolume();

    if (!chChainData || typeof chChainData.current !== 'number') {
      displayEl.textContent = 'Chain: --';
      if (ui.chMini) ui.chMini.textContent = enabled ? 'Auto update: ON (15s global)' : 'Auto update: OFF';
      chStopBeepLoop();
      if (panelRef) panelRef.classList.remove('tm-chain-alert');
      if (ui.chainTabBtn) ui.chainTabBtn.textContent = 'Chain';
      return;
    }

    const now = Date.now();

    if (typeof chChainData.cooldown === 'number' &&
        chChainData.cooldown > 0 &&
        typeof chChainData.cooldownExpiresAt === 'number') {

      const remainingCooldown = Math.max(0, Math.floor((chChainData.cooldownExpiresAt - now) / 1000));
      if (remainingCooldown > 0) {
        displayEl.textContent = `cooldown - ${chFormatTime(remainingCooldown)}`;
        if (ui.chMini) ui.chMini.textContent = enabled ? 'Auto update: ON (15s global)' : 'Auto update: OFF';
        chStopBeepLoop();
        if (panelRef) panelRef.classList.remove('tm-chain-alert');
        if (ui.chainTabBtn) ui.chainTabBtn.textContent = 'Chain';
        return;
      }
    }

    let remainingSeconds = 0;
    if (typeof chChainData.expiresAt === 'number') {
      remainingSeconds = Math.max(0, Math.floor((chChainData.expiresAt - now) / 1000));
    } else if (typeof chChainData.timeout === 'number' && typeof chChainData.receivedAt === 'number') {
      remainingSeconds = Math.max(0, Math.floor(chChainData.timeout - (now - chChainData.receivedAt) / 1000));
    }

    const timeStr = chFormatTime(remainingSeconds);

    const alertActive =
      remainingSeconds > 0 &&
      remainingSeconds < 60 &&
      chChainData.current > 10 &&
      (!chChainData.cooldown || chChainData.cooldown <= 0);

    if (alertActive && enabled && panelRef) panelRef.classList.add('tm-chain-alert');
    else if (panelRef) panelRef.classList.remove('tm-chain-alert');

    if (alertActive && enabled && soundOn) chStartBeepLoop(vol);
    else chStopBeepLoop();

    displayEl.textContent = `#${chChainData.current} - ${timeStr}`;
    if (ui.chMini) ui.chMini.textContent = enabled ? 'Auto update: ON (15s global)' : 'Auto update: OFF';

    if (ui.chainTabBtn) {
      ui.chainTabBtn.textContent = alertActive ? `Chain !` : 'Chain';
    }
  }

  function jwUpdateDisplay() {
    if (!ui.jwLine) return;

    const enabled = ui.jwTogglePage ? ui.jwTogglePage.checked : jwIsEnabledOnThisPage();
    const apiKey = (localStorage.getItem(JW_API_KEY_KEY) || '').trim();

    if (!enabled) {
      if (ui.jwStatus) ui.jwStatus.textContent = 'Disabled on this page.';
      ui.jwLine.style.color = '#eaecef';
      ui.jwLine.textContent = 'Jewelry_store: Cameras: -, Guard: -';
      return;
    }

    if (!apiKey) {
      if (ui.jwStatus) ui.jwStatus.textContent = 'Waiting for API key...';
      ui.jwLine.style.color = '#eaecef';
      ui.jwLine.textContent = 'Jewelry_store: Cameras: -, Guard: -';
      return;
    }

    if (!jwData || !jwData.camerasStatus || !jwData.guardStatus) {
      if (ui.jwStatus) ui.jwStatus.textContent = 'No data yet (waiting for next fetch)...';
      ui.jwLine.style.color = '#eaecef';
      ui.jwLine.textContent = 'Jewelry_store: Cameras: -, Guard: -';
      return;
    }

    const cam = jwData.camerasStatus;
    const grd = jwData.guardStatus;

    const camColor = (cam === 'disabled') ? 'limegreen' : 'red';
    const grdColor = (grd === 'off') ? 'limegreen' : 'red';

    ui.jwLine.innerHTML =
      'Jewelry_store: ' +
      'Cameras: <span style="color:' + camColor + ';">' + cam + '</span>, ' +
      'Guard: <span style="color:' + grdColor + ';">' + grd + '</span>';

    if (ui.jwStatus) {
      const t = jwData.lastUpdate ? new Date(jwData.lastUpdate) : null;
      ui.jwStatus.textContent = t && !Number.isNaN(t.getTime())
        ? ('Last update: ' + t.toLocaleTimeString())
        : 'Last update: -';
    }
  }

  function createUI(){
    const gear=document.createElement('div');
    gear.className='pnc-gear-btn';
    gear.title='Settings';
    gear.textContent='⚙️';
    gear.addEventListener('click', openPanel);
    document.body.appendChild(gear);

    const panel=document.createElement('div');
    panel.className='pnc-panel'+(profileSettings.panel.visible?'':' hidden');
    panel.innerHTML=`
      <div class="pnc-panel-header" id="pnc-drag">
        <div class="pnc-tabs">
          <button type="button" class="pnc-tab-btn active" data-tab="profile">Profile</button>
          <button type="button" class="pnc-tab-btn" data-tab="crime">Crimes</button>
          <button type="button" class="pnc-tab-btn" data-tab="ctchest">CT-Chest</button>
          <button type="button" class="pnc-tab-btn" data-tab="chain" id="pnc-tabbtn-chain">Chain</button>
          <button type="button" class="pnc-tab-btn" data-tab="jewelry" id="pnc-tabbtn-jewelry">Jewelry</button>
        </div>
        <span class="pnc-close" id="pnc-close">✕</span>
      </div>

      <div class="pnc-panel-body">
        <div id="pnc-tab-profile">
          <div class="pnc-field">
            <label for="pnc-font-select">Font</label>
            <select id="pnc-font-select" class="pnc-select"></select>
          </div>
          <div class="pnc-field" id="pnc-custom-wrap" style="display:none;">
            <label for="pnc-font-custom">Custom</label>
            <input id="pnc-font-custom" class="pnc-input" type="text" placeholder='"Tahoma, serif"'>
          </div>
          <div class="pnc-field">
            <label for="pnc-size">Size</label>
            <div class="pnc-row"><input id="pnc-size" class="pnc-input" type="number" min="8" max="48" step="1"></div>
          </div>
          <div class="pnc-field">
            <label>Bold</label>
            <div class="pnc-row-left"><input id="pnc-bold" type="checkbox"></div>
          </div>
          <div class="pnc-field">
            <label>Color</label>
            <input id="pnc-color" class="pnc-color" type="color">
          </div>
          <div class="pnc-field">
            <label>Align</label>
            <div class="pnc-seg" id="pnc-align">
              <button type="button" data-align="left">Left</button>
              <button type="button" data-align="center">Center</button>
              <button type="button" data-align="right">Right</button>
            </div>
          </div>
        </div>

        <div id="pnc-tab-crime" style="display:none;">
          <div class="pnc-field">
            <label for="th-crime-font-select">Font</label>
            <select id="th-crime-font-select" class="pnc-select"></select>
          </div>
          <div class="pnc-field" id="th-crime-custom-wrap" style="display:none;">
            <label for="th-crime-font-custom">Custom</label>
            <input id="th-crime-font-custom" class="pnc-input" type="text" placeholder='"Arial, sans-serif"'>
          </div>
          <div class="pnc-field">
            <label for="th-crime-size">Font size (px)</label>
            <input id="th-crime-size" class="pnc-input" type="number" min="8" max="40">
          </div>
          <div class="pnc-field">
            <label for="th-crime-height">Bar height (px)</label>
            <input id="th-crime-height" class="pnc-input" type="number" min="8" max="50">
          </div>
          <div class="pnc-field">
            <button type="button" id="th-crime-reset" class="pnc-button">Reset to default</button>
          </div>
          <div class="pnc-field">
            <label class="pnc-row-left">
              <input id="th-crime-enabled" type="checkbox">
              Crime bar script ON
            </label>
          </div>
        </div>

        <div id="pnc-tab-ctchest" style="display:none;">
          <div id="ct-hint">Red = wrong number, Orange = wrong position, Green = OK</div>
          <div id="ct-topline">
            <div id="ct-attempt"></div>
            <div id="ct-guess"></div>
          </div>

          <div id="ct-row-digits">
            <button class="ct-digit" id="ct-digit-0" type="button" data-idx="0">0</button>
            <button class="ct-digit" id="ct-digit-1" type="button" data-idx="1">0</button>
            <button class="ct-digit" id="ct-digit-2" type="button" data-idx="2">0</button>
          </div>

          <div id="ct-row-meta">
            <div id="ct-steps"></div>
            <div id="ct-cands"></div>
          </div>

          <div id="ct-msg"></div>

          <button id="ct-next" class="ct-btn" type="button">Next Step</button>
          <button id="ct-reset" class="ct-btn" type="button">Reset</button>
          <button id="ct-unlock" class="ct-btn" type="button">Unlock Code</button>

          <div id="ct-log"></div>
        </div>

        <div id="pnc-tab-chain" style="display:none;">
          <div id="ch-hint">Faction chain monitor (global 15s polling). Alert when under 60s and chain > 10.</div>

          <div class="pnc-field">
            <label>API Key</label>
            <div class="ch-inline">
              <input id="ch-api-key" class="pnc-input" type="password" placeholder="Torn API key">
              <button id="ch-save-key" class="pnc-button" type="button" style="width:auto; padding:8px 12px;">Save</button>
            </div>
          </div>

          <div class="pnc-field">
            <label class="pnc-row-left">
              <input id="ch-toggle" type="checkbox">
              Auto update (15s global)
            </label>
          </div>

          <div class="pnc-field">
            <label class="pnc-row-left">
              <input id="ch-sound-toggle" type="checkbox">
              Sound alert
            </label>
            <input id="ch-sound-volume" type="range" min="0" max="300" value="100" style="width:100%; margin-top:8px;">
            <div class="ch-mini" id="ch-mini"></div>
          </div>

          <div id="ch-display">Chain: --</div>
        </div>

        <div id="pnc-tab-jewelry" style="display:none;">
          <div id="jw-hint">Shoplifting → Jewelry store: Cameras / Guard status (single API caller across tabs). Toggle is per-page.</div>

          <div class="pnc-field">
            <label class="pnc-row-left">
              <input id="jw-toggle-page" type="checkbox">
              Enable on this page
            </label>
          </div>

          <div class="pnc-field">
            <label>API Key</label>
            <div class="ch-inline">
              <input id="jw-api-key" class="pnc-input" type="password" placeholder="Torn API key">
              <button id="jw-save-key" class="pnc-button" type="button" style="width:auto; padding:8px 12px;">Save</button>
            </div>
            <div id="jw-status">Waiting for API key...</div>
          </div>

          <div id="jw-line">Jewelry_store: Cameras: -, Guard: -</div>
        </div>
      </div>`;
    document.body.appendChild(panel);
    panelRef=panel;

    const titleDrag = panel.querySelector('#pnc-drag');
    const closeBtn  = panel.querySelector('#pnc-close');

    const fontSelect=panel.querySelector('#pnc-font-select');
    const customWrap=panel.querySelector('#pnc-custom-wrap');
    const customInput=panel.querySelector('#pnc-font-custom');
    const sizeInput=panel.querySelector('#pnc-size');
    const boldInput=panel.querySelector('#pnc-bold');
    const colorInput=panel.querySelector('#pnc-color');
    const alignSeg=panel.querySelector('#pnc-align');

    const tabButtons = panel.querySelectorAll('.pnc-tab-btn');
    const tabProfile = panel.querySelector('#pnc-tab-profile');
    const tabCrime   = panel.querySelector('#pnc-tab-crime');
    const tabCtChest = panel.querySelector('#pnc-tab-ctchest');
    const tabChain   = panel.querySelector('#pnc-tab-chain');
    const tabJewelry = panel.querySelector('#pnc-tab-jewelry');

    ui.chainTabBtn = panel.querySelector('#pnc-tabbtn-chain');

    const crimeFontSelect = panel.querySelector('#th-crime-font-select');
    const crimeCustomWrap = panel.querySelector('#th-crime-custom-wrap');
    const crimeCustomInput = panel.querySelector('#th-crime-font-custom');
    const crimeSizeInput = panel.querySelector('#th-crime-size');
    const crimeHeightInput = panel.querySelector('#th-crime-height');
    const crimeEnabledInput = panel.querySelector('#th-crime-enabled');
    const crimeResetBtn = panel.querySelector('#th-crime-reset');

    function activateTab(name) {
      tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
      tabProfile.style.display = name === 'profile' ? 'block' : 'none';
      tabCrime.style.display   = name === 'crime' ? 'block' : 'none';
      tabCtChest.style.display = name === 'ctchest' ? 'block' : 'none';
      tabChain.style.display   = name === 'chain' ? 'block' : 'none';
      tabJewelry.style.display = name === 'jewelry' ? 'block' : 'none';
    }

    tabButtons.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));

    (function buildSystemProfile(){
      const available=SYSTEM_FONT_CANDIDATES.filter(isFontPresent);
      const og=document.createElement('optgroup');
      og.label='System';
      available.forEach(n=>{ const o=document.createElement('option'); o.value=`sys:${n}`; o.textContent=n; og.appendChild(o); });
      if(!available.length){ const o=document.createElement('option'); o.disabled=true; o.textContent='(none detected)'; og.appendChild(o); }
      fontSelect.appendChild(og);
    })();
    (function buildGoogleProfile(){
      const og=document.createElement('optgroup');
      og.label='Google';
      GOOGLE_FONTS.forEach(n=>{ const o=document.createElement('option'); o.value=`g:${n}`; o.textContent=n; og.appendChild(o); });
      fontSelect.appendChild(og);
    })();
    (function buildCustomProfile(){
      const og=document.createElement('optgroup');
      og.label='Other';
      const opt=document.createElement('option');
      opt.value='custom';
      opt.textContent='Custom';
      og.appendChild(opt);
      fontSelect.appendChild(og);
    })();

    (function buildSystemCrime(){
      const available=SYSTEM_FONT_CANDIDATES.filter(isFontPresent);
      const og=document.createElement('optgroup');
      og.label='System';
      available.forEach(n=>{ const o=document.createElement('option'); o.value=`sys:${n}`; o.textContent=n; og.appendChild(o); });
      if(!available.length){ const o=document.createElement('option'); o.disabled=true; o.textContent='(none detected)'; og.appendChild(o); }
      crimeFontSelect.appendChild(og);
    })();
    (function buildGoogleCrime(){
      const og=document.createElement('optgroup');
      og.label='Google';
      GOOGLE_FONTS.forEach(n=>{ const o=document.createElement('option'); o.value=`g:${n}`; o.textContent=n; og.appendChild(o); });
      crimeFontSelect.appendChild(og);
    })();
    (function buildCustomCrime(){
      const og=document.createElement('optgroup');
      og.label='Other';
      const opt=document.createElement('option');
      opt.value='custom';
      opt.textContent='Custom';
      og.appendChild(opt);
      crimeFontSelect.appendChild(og);
    })();

    sizeInput.value=parseInt(profileSettings.fontSize,10);
    boldInput.checked=!!profileSettings.bold;
    colorInput.value=normHex(profileSettings.color);

    function setInitialFontSelection(){
      if (profileSettings.fontSource==='google' && profileSettings.googleFamily){
        fontSelect.value=`g:${profileSettings.googleFamily}`;
        customWrap.style.display='none';
      } else if (profileSettings.fontSource==='system'){
        const first=(profileSettings.fontFamily||PROFILE_DEFAULTS.fontFamily).split(',')[0].replace(/["']/g,'').trim();
        const sysVal=`sys:${first}`;
        if ([...fontSelect.options].some(o=>o.value===sysVal)){
          fontSelect.value=sysVal;
          customWrap.style.display='none';
        } else {
          fontSelect.value='custom';
          customWrap.style.display='';
        }
      } else {
        fontSelect.value='custom';
        customWrap.style.display='';
      }
      customInput.value=profileSettings.fontFamily;
    }
    setInitialFontSelection();

    function updateAlignUI(){
      alignSeg.querySelectorAll('button').forEach(b=> b.classList.toggle('active', b.dataset.align===profileSettings.align));
    }
    updateAlignUI();

    fontSelect.addEventListener('change', ()=>{
      const v=fontSelect.value;
      if (v.startsWith('sys:')){
        const n=v.slice(4);
        profileSettings.fontSource='system';
        profileSettings.googleFamily='';
        profileSettings.fontFamily=`"${n}", sans-serif`;
        customWrap.style.display='none';
      } else if (v.startsWith('g:')){
        const f=v.slice(2);
        profileSettings.fontSource='google';
        profileSettings.googleFamily=f;
        profileSettings.fontFamily=`"${f}", sans-serif`;
        customWrap.style.display='none';
        loadGoogleFont(f);
      } else {
        profileSettings.fontSource='custom';
        customWrap.style.display='';
      }
      saveProfileSettings();
      applyProfileNow();
    });

    customInput.addEventListener('input', ()=>{
      profileSettings.fontSource='custom';
      profileSettings.fontFamily=(customInput.value||PROFILE_DEFAULTS.fontFamily).trim();
      saveProfileSettings();
      applyProfileNow();
    });

    sizeInput.addEventListener('input', ()=>{
      profileSettings.fontSize=clamp(parseInt(sizeInput.value,10)||PROFILE_DEFAULTS.fontSize,8,48);
      saveProfileSettings();
      applyProfileNow();
    });

    boldInput.addEventListener('change', ()=>{
      profileSettings.bold=!!boldInput.checked;
      saveProfileSettings();
      applyProfileNow();
    });

    colorInput.addEventListener('input', ()=>{
      profileSettings.color=normHex(colorInput.value);
      saveProfileSettings();
      applyProfileNow();
    });

    alignSeg.querySelectorAll('button').forEach(btn=>
      btn.addEventListener('click', ()=>{
        profileSettings.align=btn.dataset.align;
        saveProfileSettings();
        updateAlignUI();
        applyProfileNow();
      })
    );

    function setInitialCrimeFontSelection(){
      if (crimeSettings.fontSource==='google' && crimeSettings.googleFamily){
        crimeFontSelect.value=`g:${crimeSettings.googleFamily}`;
        crimeCustomWrap.style.display='none';
      } else if (crimeSettings.fontSource==='system'){
        const first=(crimeSettings.fontFamily||CRIME_DEFAULTS.fontFamily).split(',')[0].replace(/["']/g,'').trim();
        const sysVal=`sys:${first}`;
        if ([...crimeFontSelect.options].some(o=>o.value===sysVal)){
          crimeFontSelect.value=sysVal;
          crimeCustomWrap.style.display='none';
        } else {
          crimeFontSelect.value='custom';
          crimeCustomWrap.style.display='';
        }
      } else {
        crimeFontSelect.value='custom';
        crimeCustomWrap.style.display='';
      }
      crimeCustomInput.value=crimeSettings.fontFamily;
    }
    setInitialCrimeFontSelection();

    crimeFontSelect.addEventListener('change', ()=>{
      const v=crimeFontSelect.value;
      if (v.startsWith('sys:')){
        const n=v.slice(4);
        crimeSettings.fontSource='system';
        crimeSettings.googleFamily='';
        crimeSettings.fontFamily=`"${n}", sans-serif`;
        crimeCustomWrap.style.display='none';
      } else if (v.startsWith('g:')){
        const f=v.slice(2);
        crimeSettings.fontSource='google';
        crimeSettings.googleFamily=f;
        crimeSettings.fontFamily=`"${f}", sans-serif`;
        crimeCustomWrap.style.display='none';
        loadGoogleFont(f);
      } else {
        crimeSettings.fontSource='custom';
        crimeCustomWrap.style.display='';
      }
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeCustomInput.addEventListener('input', ()=>{
      crimeSettings.fontSource='custom';
      crimeSettings.fontFamily=(crimeCustomInput.value||CRIME_DEFAULTS.fontFamily).trim();
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeSizeInput.value = parseInt(crimeSettings.fontSize, 10);
    crimeHeightInput.value = parseInt(crimeSettings.barHeight, 10);
    crimeEnabledInput.checked = !!crimeSettings.enabled;

    crimeSizeInput.addEventListener('input', () => {
      const v = parseInt(crimeSizeInput.value, 10);
      crimeSettings.fontSize = clamp(v || CRIME_DEFAULTS.fontSize, 8, 40);
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeHeightInput.addEventListener('input', () => {
      const v = parseInt(crimeHeightInput.value, 10);
      crimeSettings.barHeight = clamp(v || CRIME_DEFAULTS.barHeight, 8, 50);
      saveCrimeSettings();
      updateCrimeCssVars();
    });

    crimeEnabledInput.addEventListener('change', () => {
      crimeSettings.enabled = !!crimeEnabledInput.checked;
      saveCrimeSettings();
      applyCrimeEnabledState();
    });

    crimeResetBtn.addEventListener('click', () => {
      crimeSettings = Object.assign({}, CRIME_DEFAULTS);
      crimeFontSelect.value = 'sys:Arial';
      crimeCustomWrap.style.display = 'none';
      crimeCustomInput.value = crimeSettings.fontFamily;
      crimeSizeInput.value = crimeSettings.fontSize;
      crimeHeightInput.value = crimeSettings.barHeight;
      crimeEnabledInput.checked = crimeSettings.enabled;
      saveCrimeSettings();
      updateCrimeCssVars();
      applyCrimeEnabledState();
    });

    closeBtn.addEventListener('click', ()=>{
      profileSettings.panel.visible=false;
      saveProfileSettings();
      panel.classList.add('hidden');
      chStopBeepLoop();
      if (panelRef) panelRef.classList.remove('tm-chain-alert');
    });

    makeMovable(panel, titleDrag);

    if (typeof GM_registerMenuCommand==='function'){
      GM_registerMenuCommand('TORN Helper: Open Settings', openPanel);
    }

    if (!profileSettings.panel.visible) panel.classList.add('hidden');

    // ===== CT-CHEST UI Wiring =====
    const ctAttemptEl = panel.querySelector("#ct-attempt");
    const ctGuessEl   = panel.querySelector("#ct-guess");
    const ctDigitBtns = [
      panel.querySelector("#ct-digit-0"),
      panel.querySelector("#ct-digit-1"),
      panel.querySelector("#ct-digit-2")
    ];
    const ctStepsEl   = panel.querySelector("#ct-steps");
    const ctCandsEl   = panel.querySelector("#ct-cands");
    const ctMsgEl     = panel.querySelector("#ct-msg");
    const ctNextBtn   = panel.querySelector("#ct-next");
    const ctResetBtn  = panel.querySelector("#ct-reset");
    const ctUnlockBtn = panel.querySelector("#ct-unlock");
    const ctLogEl     = panel.querySelector("#ct-log");

    const ctState = ctLoadState();
    let ctCandidates = ctFilterByAttempts(ctAllCodes, ctGetAllAttempts(ctState));

    if (!ctState.currentGuess || !/^[1-9]{3}$/.test(ctState.currentGuess)) ctState.currentGuess = CT_FIRST_GUESS;
    if (!ctState.message) {
      ctSetMessage(ctState, ctMsgEl, "Start: 123 is already your in-game attempt #1. Enter its colors, then Next Step.");
    }

    ctRenderAll();

    ctDigitBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = Number(btn.dataset.idx);
        ctState.currentFeedback[idx] = ctNextFeedback(ctState.currentFeedback[idx]);
        ctApplyFeedbackStyles();
        ctSaveState(ctState);
      });
      btn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const idx = Number(btn.dataset.idx);
        ctState.currentFeedback[idx] = ctPrevFeedback(ctState.currentFeedback[idx]);
        ctApplyFeedbackStyles();
        ctSaveState(ctState);
      });
    });

    ctNextBtn.addEventListener("click", () => {
      if (ctState.firstRecorded && ctState.extraAttempts.length >= CT_EXTRA_AFTER_FIRST) {
        ctSetMessage(ctState, ctMsgEl, "No remaining steps. Press Unlock Code or Reset.");
        ctRenderAll();
        ctSaveState(ctState);
        return;
      }

      const pat = ctFeedbackToPattern(ctState.currentFeedback);
      if (!pat) {
        ctSetMessage(ctState, ctMsgEl, "Set colors for all 3 digits, then press Next Step.");
        ctSaveState(ctState);
        return;
      }

      if (!ctState.firstRecorded) {
        ctState.firstPattern = pat;
        ctState.firstRecorded = true;
      } else {
        ctState.extraAttempts.push({ guess: ctState.currentGuess, pattern: pat });
      }

      ctState.currentFeedback = ["none","none","none"];
      ctCandidates = ctFilterByAttempts(ctAllCodes, ctGetAllAttempts(ctState));

      if (ctCandidates.length === 0) {
        ctSetMessage(ctState, ctMsgEl, "No candidates. Re-check the colors you entered (or Reset).");
        ctRenderAll();
        ctSaveState(ctState);
        return;
      }

      if (ctCandidates.length === 1) {
        ctState.currentGuess = ctCandidates[0];
        ctSetMessage(ctState, ctMsgEl, `Unique code found: ${ctCandidates[0]}\nPress Unlock Code.`);
        ctRenderAll();
        ctSaveState(ctState);
        return;
      }

      if (ctState.extraAttempts.length >= CT_EXTRA_AFTER_FIRST) {
        ctSetMessage(ctState, ctMsgEl, `Not unique (${ctCandidates.length} candidates). You would have to guess.`);
        ctRenderAll();
        ctSaveState(ctState);
        return;
      }

      const suggested = ctPickBestGuess(ctCandidates, ctAllCodes);
      ctState.currentGuess = suggested;

      const remainingAfter = CT_EXTRA_AFTER_FIRST - ctState.extraAttempts.length;
      if (remainingAfter === 1) {
        ctSetMessage(ctState, ctMsgEl, `Last attempt next. Candidates: ${ctCandidates.length}\nSuggested: ${suggested}`);
      } else {
        ctSetMessage(ctState, ctMsgEl, `Candidates: ${ctCandidates.length}\nSuggested next: ${suggested}`);
      }

      ctRenderAll();
      ctSaveState(ctState);
    });

    ctResetBtn.addEventListener("click", () => {
      ctState.firstRecorded = false;
      ctState.firstPattern = "";
      ctState.extraAttempts = [];
      ctState.currentGuess = CT_FIRST_GUESS;
      ctState.currentFeedback = ["none","none","none"];
      ctCandidates = ctAllCodes.slice();
      ctSetMessage(ctState, ctMsgEl, "Start: 123 is already your in-game attempt #1. Enter its colors, then Next Step.");
      ctRenderAll();
      ctSaveState(ctState);
    });

    ctUnlockBtn.addEventListener("click", () => {
      ctCandidates = ctFilterByAttempts(ctAllCodes, ctGetAllAttempts(ctState));

      if (!ctState.firstRecorded) {
        ctSetMessage(ctState, ctMsgEl, "Enter colors for 123 first, then Next Step.");
        ctRenderMeta();
        ctSaveState(ctState);
        return;
      }

      if (ctCandidates.length === 0) {
        ctSetMessage(ctState, ctMsgEl, "No candidates. Reset or fix inputs.");
        ctRenderMeta();
        ctSaveState(ctState);
        return;
      }

      if (ctCandidates.length === 1) {
        ctSetMessage(ctState, ctMsgEl, `Unlock Code: ${ctCandidates[0]}`);
        ctRenderMeta();
        ctSaveState(ctState);
        return;
      }

      const maxShow = 30;
      const list = ctCandidates.slice(0, maxShow).join("  ");
      const more = ctCandidates.length > maxShow ? `\n(+${ctCandidates.length - maxShow} more)` : "";
      ctSetMessage(ctState, ctMsgEl, `Not unique yet (${ctCandidates.length} candidates):\n${list}${more}`);
      ctRenderMeta();
      ctSaveState(ctState);
    });

    function ctGetAllAttempts(s) {
      const out = [];
      if (s.firstRecorded && /^[ROG]{3}$/.test(s.firstPattern)) {
        out.push({ guess: CT_FIRST_GUESS, pattern: s.firstPattern });
      }
      if (Array.isArray(s.extraAttempts)) {
        for (const a of s.extraAttempts) {
          if (ctIsAttempt(a)) out.push(a);
        }
      }
      return out;
    }

    function ctSetMessage(s, el, text) {
      el.textContent = text || "";
      s.message = text || "";
    }

    function ctRenderAll() {
      ctRenderTop();
      ctRenderDigits();
      ctApplyFeedbackStyles();
      ctRenderMeta();
      ctRenderLog();
      ctNextBtn.disabled = ctState.firstRecorded && ctState.extraAttempts.length >= CT_EXTRA_AFTER_FIRST;
    }

    function ctRenderTop() {
      if (!ctState.firstRecorded) {
        ctAttemptEl.textContent = `Attempt 1/${CT_TOTAL_ATTEMPTS}`;
        ctGuessEl.textContent = `Guess: ${CT_FIRST_GUESS}`;
        return;
      }
      const nextNum = Math.min(2 + ctState.extraAttempts.length, CT_TOTAL_ATTEMPTS);
      ctAttemptEl.textContent = `Attempt ${nextNum}/${CT_TOTAL_ATTEMPTS}`;
      ctGuessEl.textContent = `Guess: ${ctState.currentGuess}`;
    }

    function ctRenderDigits() {
      const g = (!ctState.firstRecorded ? CT_FIRST_GUESS : (ctState.currentGuess || CT_FIRST_GUESS));
      const arr = String(g).split("");
      for (let i = 0; i < CT_DIGITS; i++) ctDigitBtns[i].textContent = arr[i] || "0";
    }

    function ctRenderMeta() {
      const remaining = Math.max(0, CT_EXTRA_AFTER_FIRST - (ctState.extraAttempts?.length || 0));
      ctStepsEl.textContent = `remaining steps: ${remaining}`;
      ctCandsEl.textContent = `candidates: ${ctCandidates.length}`;
    }

    function ctRenderLog() {
      const lines = [];
      if (ctState.firstRecorded && /^[ROG]{3}$/.test(ctState.firstPattern)) {
        lines.push(ctRenderLogLine(1, CT_FIRST_GUESS, ctState.firstPattern));
      }
      const extras = Array.isArray(ctState.extraAttempts) ? ctState.extraAttempts.filter(ctIsAttempt) : [];
      for (let i = 0; i < extras.length; i++) {
        lines.push(ctRenderLogLine(2 + i, extras[i].guess, extras[i].pattern));
      }
      ctLogEl.innerHTML = lines.join("");
    }

    function ctRenderLogLine(n, guess, pat) {
      const badges = pat.split("").map((ch) => `<span class="ct-badge">${ch}</span>`).join("");
      return `<div class="ct-logline"><div><b>#${n}</b> ${guess}</div><div class="ct-badges">${badges}</div></div>`;
    }

    function ctApplyFeedbackStyles() {
      for (let i = 0; i < CT_DIGITS; i++) {
        const v = ctState.currentFeedback[i] || "none";
        const c = CT_COLORS[v] || CT_COLORS.none;
        ctDigitBtns[i].style.background = c.bg;
        ctDigitBtns[i].style.color = c.fg;
      }
    }

    // ===== CHAIN UI Wiring =====
    ui.chApiInput = panel.querySelector('#ch-api-key');
    ui.chSaveBtn = panel.querySelector('#ch-save-key');
    ui.chToggle = panel.querySelector('#ch-toggle');
    ui.chSoundToggle = panel.querySelector('#ch-sound-toggle');
    ui.chSoundVolume = panel.querySelector('#ch-sound-volume');
    ui.chDisplay = panel.querySelector('#ch-display');
    ui.chMini = panel.querySelector('#ch-mini');

    ui.chApiInput.value = localStorage.getItem(CH_API_KEY_KEY) || '';
    ui.chToggle.checked = chEnabledDefaultTrue();
    ui.chSoundToggle.checked = chSoundEnabled();
    ui.chSoundVolume.value = String(chSoundVolume());

    ui.chSaveBtn.addEventListener('click', () => {
      localStorage.setItem(CH_API_KEY_KEY, (ui.chApiInput.value || '').trim());
      chUpdateDisplay();
    });

    ui.chToggle.addEventListener('change', () => {
      localStorage.setItem(CH_ENABLED_KEY, ui.chToggle.checked ? '1' : '0');
      if (!ui.chToggle.checked) {
        chStopBeepLoop();
        if (panelRef) panelRef.classList.remove('tm-chain-alert');
      }
      chUpdateDisplay();
    });

    ui.chSoundToggle.addEventListener('change', () => {
      localStorage.setItem(CH_SOUND_ENABLED_KEY, ui.chSoundToggle.checked ? '1' : '0');
      if (!ui.chSoundToggle.checked) {
        chStopBeepLoop();
      } else {
        chEnsureAudioContext();
        if (chAudioCtx && chAudioCtx.state === 'suspended') chAudioCtx.resume();
      }
      chUpdateDisplay();
    });

    ui.chSoundVolume.addEventListener('input', () => {
      localStorage.setItem(CH_SOUND_VOLUME_KEY, String(ui.chSoundVolume.value));
      chUpdateDisplay();
    });

    chSyncFromStorageIfChanged();
    chUpdateDisplay();

    // ===== JEWELRY UI Wiring =====
    ui.jwApiInput = panel.querySelector('#jw-api-key');
    ui.jwSaveBtn = panel.querySelector('#jw-save-key');
    ui.jwTogglePage = panel.querySelector('#jw-toggle-page');
    ui.jwStatus = panel.querySelector('#jw-status');
    ui.jwLine = panel.querySelector('#jw-line');

    ui.jwApiInput.value = localStorage.getItem(JW_API_KEY_KEY) || '';
    ui.jwTogglePage.checked = jwIsEnabledOnThisPage();

    ui.jwSaveBtn.addEventListener('click', () => {
      localStorage.setItem(JW_API_KEY_KEY, (ui.jwApiInput.value || '').trim());
      jwUpdateDisplay();
      jwMaybeFetch();
    });

    ui.jwTogglePage.addEventListener('change', () => {
      jwSetEnabledOnThisPage(ui.jwTogglePage.checked);
      jwUpdateDisplay();
      if (ui.jwTogglePage.checked) jwMaybeFetch();
    });

    jwSyncFromStorageIfChanged();
    jwUpdateDisplay();
  }

  function start(){
    if (!document.body) { setTimeout(start, 50); return; }
    injectCSS();
    createUI();

    processHonor();
    if (profileSettings.fontSource==='google' && profileSettings.googleFamily) loadGoogleFont(profileSettings.googleFamily);
    if (crimeSettings.fontSource==='google' && crimeSettings.googleFamily) loadGoogleFont(crimeSettings.googleFamily);

    const obs=new MutationObserver(processHonor);
    obs.observe(document.body, { childList:true, subtree:true });

    updateCrimeCssVars();
    applyCrimeEnabledState();

    if (/page\.php\?sid=crimes/.test(location.href)) {
      enhanceAllCrimeBars();
      const crimeObs = new MutationObserver(enhanceAllCrimeBars);
      crimeObs.observe(document.body, { childList:true, subtree:true });
    }

    setInterval(() => {
      chSyncFromStorageIfChanged();
      chUpdateDisplay();

      jwSyncFromStorageIfChanged();
      jwUpdateDisplay();
    }, 1000);

    setInterval(() => {
      chMaybeFetch();
      jwMaybeFetch();
    }, 1000);

    chMaybeFetch();
    jwMaybeFetch();
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

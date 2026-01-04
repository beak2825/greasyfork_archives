// ==UserScript==
// @name         SG CardCheck
// @namespace    mb.sg.cards
// @version      2.7.0
// @description  Adds a green/red card icon after the 4 native icons; moves points before the title; rate-limits Steam checks with TTL cache; recolors the 4 native icons (with reset). Options button under avatar (fallback: floating). Green icon optionally opens the Steam badge page. Now uses Steam Market fallback for more reliable trading card detection.
// @author       BuzzyX + ChatGPT
// @license      MIT
// @match        https://www.steamgifts.com/*
// @icon         https://i.imgur.com/U12QcGS.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550469/SG%20CardCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/550469/SG%20CardCheck.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== Section: Constants & Defaults ===== */

  const LS = {
    ttlMs: 'sgc_ttl_ms',
    rateCount: 'sgc_rate_count',
    rateSecs: 'sgc_rate_secs',
    cachePrefix: 'sgc_app_',
    n1: 'sgc_native_color_1',
    n2: 'sgc_native_color_2',
    n3: 'sgc_native_color_3',
    n4: 'sgc_native_color_4',
    clickBadge: 'sgc_click_to_badge',          // Open Steam badge page on green icon
    cardOk: 'sgc_card_ok_color',               // NEW: user color for green icon
    cardBad: 'sgc_card_bad_color',             // NEW: user color for red icon
  };
  const DEFAULT_TTL_MS   = 14 * 24 * 60 * 60 * 1000;
  const DEFAULT_RATE_CNT = 5;
  const DEFAULT_RATE_SEC = 2;
  const DEFAULT_NATIVE_COLORS = ['#93a0b3','#93a0b3','#93a0b3','#93a0b3']; // SG-like grey
  const DEFAULT_CLICK_BADGE   = true; // enabled by default (green only)

  // Default card icon colors
  const DEFAULT_CARD_OK  = '#28a745';
  const DEFAULT_CARD_BAD = '#dc3545';
  const DEFAULT_CARD_UNK = '#6c757d'; // unchanged, not user-configurable (optional if you want later)

  /* ===== Section: Styles & Fonts ===== */

  injectMaterialSymbols();

  GM_addStyle(`
    :root {
      --sgc-ok: ${getStored(LS.cardOk, DEFAULT_CARD_OK)};
      --sgc-bad: ${getStored(LS.cardBad, DEFAULT_CARD_BAD)};
      --sgc-unk: ${DEFAULT_CARD_UNK};
    }

    /* SG-like button */
    .sgc-nav-btn{
      display:inline-flex; align-items:center; gap:8px;
      background: linear-gradient(#586270, #3e4651);
      border: 1px solid rgba(0,0,0,.35);
      border-radius: 10px;
      color: #e9eef5;
      padding: 8px 12px;
      font-weight: 600;
      line-height: 1;
      cursor: pointer;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 1px 2px rgba(0,0,0,.25);
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
    }
    .sgc-nav-btn:hover{ filter: brightness(1.05); }
    .sgc-nav-btn:active{ transform: translateY(1px); }
    #sgc-menu-btn .ms{ font-family:'Material Symbols Outlined'; font-size:18px; }

    /* Under-avatar anchor */
    #sgc-under-avatar{
      position: fixed; /* track avatar rect and place ourselves */
      z-index: 9997;
      pointer-events: none; /* container doesn't eat clicks */
    }
    #sgc-under-avatar > .sgc-nav-btn{ pointer-events: auto; }

    /* Fallback floating button */
    #sgc-float{ position: fixed; bottom: 16px; right: 16px; z-index: 9996; }
    #sgc-float #sgc-menu-btn{ border-radius: 12px; }

    /* Card icon next to games */
    .sgc-card-slot{ margin-left:6px; display:inline-flex; align-items:center }
    .sgc-card-icon{
      display:inline-flex; align-items:center; justify-content:center;
      font-family:'Material Symbols Outlined';
      font-variation-settings:'OPSZ' 20,'wght' 400,'FILL' 0;
      font-size:16px; width:18px; height:18px; line-height:1;
      margin-left:6px; vertical-align:middle; opacity:.95;
      cursor: default; /* becomes pointer only when clickable */
    }
    .sgc-clickable{ cursor:pointer }
    .sgc-ok{color: var(--sgc-ok)} .sgc-bad{color: var(--sgc-bad)} .sgc-unk{color: var(--sgc-unk)}

    /* Points before game name */
    .sgc-points-pill{
      display:inline-flex; align-items:center; gap:4px;
      padding:2px 6px; border-radius:8px;
      background:#2a2e35; color:#e9eef5; font-size:12px; font-weight:600;
      margin-right:6px
    }
    .sgc-hide-original-points{ display:none !important }

    /* Options modal */
    .sgc-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:9998;
                   display:flex; align-items:center; justify-content:center }
    .sgc-modal{
      background:#1b1e22; color:#e9ecef; width:min(620px,94vw);
      border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.35); padding:18px; z-index:9999
    }
    .sgc-modal h3{ margin:0 0 10px; font-size:18px }
    .sgc-row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap }
    .sgc-modal input[type="number"]{
      width:120px; padding:6px 8px; border-radius:8px; border:1px solid #444; background:#111; color:#eee
    }
    .sgc-modal input[type="color"]{ width:40px; height:28px; padding:0; border:1px solid #444; background:#111; border-radius:6px }
    .sgc-hint{ font-size:12px; color:#adb5bd }
    .sgc-actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:16px }
    .sgc-btn{ padding:8px 12px; border-radius:8px; background:#2d2f33; color:#fff; cursor:pointer; border:0 }
    .sgc-btn.primary{ background:#2b6cb0 } .sgc-btn.danger{ background:#b02b2b }
    .sgc-stat{ font-size:12px; color:#c7d0da; margin-left:6px }
    /* Checkbox row alignment */
    .sgc-row.sgc-check .sgc-checkline{ display:flex; align-items:center; gap:8px; cursor:pointer; }
    .sgc-row.sgc-check .sgc-checkline input{ margin:0 }
  `);

  /* ===== Section: Preferences API ===== */

  const getTTL       = () => numOr(localStorage.getItem(LS.ttlMs), DEFAULT_TTL_MS);
  const setTTL       = (ms) => localStorage.setItem(LS.ttlMs, String(ms));
  const getRateCount = () => intOr(localStorage.getItem(LS.rateCount), DEFAULT_RATE_CNT);
  const setRateCount = (n) => localStorage.setItem(LS.rateCount, String(n));
  const getRateSecs  = () => numOr(localStorage.getItem(LS.rateSecs), DEFAULT_RATE_SEC);
  const setRateSecs  = (n) => localStorage.setItem(LS.rateSecs, String(n));

  const getNativeColors = () => ([
    localStorage.getItem(LS.n1) || DEFAULT_NATIVE_COLORS[0],
    localStorage.getItem(LS.n2) || DEFAULT_NATIVE_COLORS[1],
    localStorage.getItem(LS.n3) || DEFAULT_NATIVE_COLORS[2],
    localStorage.getItem(LS.n4) || DEFAULT_NATIVE_COLORS[3],
  ]);
  const setNativeColors = (arr) => {
    localStorage.setItem(LS.n1, arr[0]);
    localStorage.setItem(LS.n2, arr[1]);
    localStorage.setItem(LS.n3, arr[2]);
    localStorage.setItem(LS.n4, arr[3]);
  };

  // Card icon color prefs
  const getCardOk  = () => getStored(LS.cardOk, DEFAULT_CARD_OK);
  const getCardBad = () => getStored(LS.cardBad, DEFAULT_CARD_BAD);
  const setCardOk  = (hex) => localStorage.setItem(LS.cardOk, String(hex));
  const setCardBad = (hex) => localStorage.setItem(LS.cardBad, String(hex));

  const getClickToBadge = () => {
    const v = localStorage.getItem(LS.clickBadge);
    return v === null ? DEFAULT_CLICK_BADGE : v === '1';
  };
  const setClickToBadge = (on) => localStorage.setItem(LS.clickBadge, on ? '1' : '0');

  function getStored(key, def){ const v = localStorage.getItem(key); return v ? String(v) : def; }
  function numOr(v, d){ const n=parseFloat(v); return Number.isFinite(n)&&n>0?n:d }
  function intOr(v, d){ const n=parseInt(v||'',10); return Number.isFinite(n)&&n>0?n:d }

  /* ===== Section: Cache ===== */

  const keyFor = (appid) => `sgc_app_${appid}`;
  const readCache = (appid) => { try { return JSON.parse(localStorage.getItem(keyFor(appid))||'null') } catch { return null } };
  const writeCache = (appid, has) => localStorage.setItem(keyFor(appid), JSON.stringify({ has, ts: Date.now() }));
  function clearCache(){ Object.keys(localStorage).forEach(k => { if (k.startsWith('sgc_app_')) localStorage.removeItem(k) }); }

  /* ===== Section: Steam Detection (Store + Market fallback) ===== */

  // Returns: true / false / null (null = unknown/error)
  async function fetchHasCards(appid){
    // A) Fast attempt via Store appdetails (may be missing on older titles)
    const hasFromStore = await new Promise(resolve=>{
      GM_xmlhttpRequest({
        method:'GET',
        url:`https://store.steampowered.com/api/appdetails?appids=${appid}&l=en&cc=us`,
        timeout:15000,
        onload:(res)=>{
          try{
            const data = JSON.parse(res.responseText||'{}');
            const item = data?.[appid];
            if (!item || !item.success || !item.data) return resolve(null);

            const cats = (item.data.categories||[]).map(c => (c && c.description) || '');
            // features can be array of objects or strings
            const feats = (item.data.features||[]).map(f => (typeof f==='string' ? f : (f && f.description) || ''));
            const list = [...cats, ...feats].map(s => String(s).toLowerCase());

            const hit = list.some(s => s.includes('trading card'));
            resolve(hit ? true : false);
          }catch{ resolve(null); }
        },
        onerror:()=>resolve(null),
        ontimeout:()=>resolve(null),
      });
    });

    if (hasFromStore === true) return true; // confirmed by Store

    // B) Robust fallback via Steam Market search
    // If any trading card exists for this app, Market (appid 753) with tag_app_<APPID> will return total_count > 0
    const encTag = encodeURIComponent(`tag_app_${appid}`);
    return await new Promise(resolve=>{
      GM_xmlhttpRequest({
        method:'GET',
        url:`https://steamcommunity.com/market/search/render/?query=&start=0&count=1&appid=753&category_753_Game[]=${encTag}&norender=1`,
        timeout:15000,
        onload:(res)=>{
          try{
            const json = JSON.parse(res.responseText||'{}');
            if (Number.isFinite(json.total_count) && json.total_count > 0) return resolve(true);
            resolve(false);
          }catch{ resolve(null); }
        },
        onerror:()=>resolve(null),
        ontimeout:()=>resolve(null),
      });
    });
  }

  /* ===== Section: Rate Limiter ===== */

  const taskQueue = []; let ticking = false;
  function enqueue(task){ taskQueue.push(task); startTicker(); }
  function startTicker(){
    if (ticking) return; ticking = true;
    const tick = async () => {
      const n = Math.min(getRateCount(), taskQueue.length);
      const slice = taskQueue.splice(0, n);
      await Promise.all(slice.map(fn => fn().catch(()=>{})));
      if (taskQueue.length === 0){ ticking = false; }
      else setTimeout(tick, getRateSecs()*1000);
    };
    setTimeout(tick, 0);
  }

  /* ===== Section: Bootstrapping ===== */

  // Apply user card colors at startup (CSS variables)
  applyCardColors();

  // Build the options button UI and start scanning
  addUnderAvatarButton();

  observeForNewBlocks();              // Watch for infinite scroll
  scan(document);                     // First pass

  /* ===== Section: Under-avatar placement ===== */

  function addUnderAvatarButton(){
    let btn = document.getElementById('sgc-menu-btn');
    if (!btn){
      btn = document.createElement('button');
      btn.id = 'sgc-menu-btn';
      btn.className = 'sgc-nav-btn';
      btn.type = 'button';
      btn.innerHTML = `<span class="ms">tune</span>`;
      btn.addEventListener('click', openOptions);
    }

    const anchor = document.getElementById('sgc-under-avatar') || (() => {
      const d = document.createElement('div');
      d.id = 'sgc-under-avatar';
      document.body.appendChild(d);
      return d;
    })();

    anchor.innerHTML = '';
    anchor.appendChild(btn);

    const place = () => {
      const av = findAvatar();
      if (!av) { fallbackFloat(); return; }
      const r = av.getBoundingClientRect();
      anchor.style.left = Math.round(r.left) + 'px';
      anchor.style.top  = Math.round(r.bottom + 6) + 'px';
      anchor.style.display = 'block';
      removeFallback();
    };
    window.addEventListener('resize', place, { passive:true });
    window.addEventListener('scroll', place, { passive:true });
    let tries = 0;
    const iv = setInterval(()=>{ place(); if (++tries > 20) clearInterval(iv); }, 250);
    place();
  }

  // Find the avatar element in the top navigation
  function findAvatar(){
    const img = document.querySelector(
      '.navigation__right img, .nav__right img, .navigation img.avatar, img[src*="avatars"]'
    );
    if (img) return img.closest('a,button,div') || img;

    const avatarBtn = Array.from(document.querySelectorAll(
      '.navigation__right a, .navigation__right button, .nav__right a, .nav__right button'
    )).find(el => el.querySelector && el.querySelector('img'));
    return avatarBtn || null;
  }

  function fallbackFloat(){
    if (document.getElementById('sgc-float')) return;
    const wrap = document.createElement('div');
    wrap.id = 'sgc-float';
    const btn = document.getElementById('sgc-menu-btn');
    if (btn && btn.parentNode !== wrap){
      wrap.appendChild(btn);
      document.body.appendChild(wrap);
    }
    const anchor = document.getElementById('sgc-under-avatar');
    if (anchor) anchor.style.display = 'none';
  }
  function removeFallback(){
    const f = document.getElementById('sgc-float');
    if (f) f.remove();
  }

  /* ===== Section: Observers & Scanning ===== */

  function observeForNewBlocks(){
    const mo = new MutationObserver(muts=>{
      for (const m of muts){
        if (m.addedNodes && m.addedNodes.length){
          m.addedNodes.forEach(n => { if (n.nodeType===1) scan(n); });
        }
      }
    });
    mo.observe(document.body, { childList:true, subtree:true });
  }

  function scan(root){
    root.querySelectorAll('.giveaway__row-outer-wrap').forEach(row => handleBlock(row));
    const single = root.querySelector('.giveaway__heading');
    if (single && !single.closest('.giveaway__row-outer-wrap')) handleBlock(single);
  }

  function handleBlock(el){
    const root = el.closest('.giveaway__row-outer-wrap') || el;
    if (root.dataset.sgcDone === '1') return;
    root.dataset.sgcDone = '1';

    const header = root.querySelector('.giveaway__heading') || root;
    const nameNode = header.querySelector('.giveaway__heading__name');
    if (!nameNode) return;

    // Points: move before name (only once)
    if (!header.querySelector('.sgc-points-pill')) {
      const { points, nodeToHide } = extractPoints(header);
      if (points != null) {
        const pill = document.createElement('span');
        pill.className = 'sgc-points-pill';
        pill.textContent = `${points}P`;
        nameNode.parentNode.insertBefore(pill, nameNode);
        if (nodeToHide) nodeToHide.classList.add('sgc-hide-original-points');
      }
    }

    // Ensure slot strictly AFTER the 4 native icons
    const slot = ensureCardSlotAfterNativeRow(header, nameNode);

    // Always (re)apply native icon colors
    colorNativeIcons(header);

    // Avoid duplicate card icon
    if (slot.querySelector('.sgc-card-icon')) return;

    const steamUrl = findSteamUrl(root);
    const parsed = parseSteamUrl(steamUrl);

    const placeholder = renderIcon('unknown', null);
    slot.appendChild(placeholder);

    if (parsed.type !== 'app' || !parsed.id) {
      placeholder.replaceWith(renderIcon('unknown', null));
      return;
    }

    const appid = parsed.id;
    const ttl = getTTL();
    const cached = readCache(appid);
    const now = Date.now();

    if (cached && (now - cached.ts) < ttl && typeof cached.has === 'boolean'){
      placeholder.replaceWith(renderIcon(cached.has ? 'yes' : 'no', appid));
    } else {
      placeholder.title = 'Checking…';
      enqueue(async () => {
        const res = await fetchHasCards(appid); // true/false/null
        if (typeof res === 'boolean') writeCache(appid, res);
        placeholder.replaceWith(renderIcon(res===true ? 'yes' : res===false ? 'no' : 'unknown', appid));
      });
    }
  }

  /* ===== Section: Placement Helpers (row) ===== */

  function ensureCardSlotAfterNativeRow(header, nameNode){
    const existing = header.querySelector('.sgc-card-slot');
    if (existing) return existing;

    const slot = document.createElement('span');
    slot.className = 'sgc-card-slot';

    const nativeRow =
      header.querySelector('.giveaway__heading__icons, .giveaway__icons, .giveaway__icon-container');

    if (nativeRow && nativeRow.lastElementChild) {
      nativeRow.parentNode.insertBefore(slot, nativeRow.nextSibling);
      return slot;
    }

    const icons = Array.from(header.querySelectorAll([
      '.giveaway__icon',
      '.giveaway__heading__icon',
      'i[class*="icon"]',
      'span[class*="icon"]',
      'svg'
    ].join(',')));
    const lastIcon = icons.length ? icons[Math.min(icons.length-1, 3)] : null;

    if (lastIcon) insertAfter(slot, lastIcon);
    else insertAfter(slot, nameNode);

    return slot;
  }

  function insertAfter(newNode, ref){
    if (ref && ref.parentNode) {
      if (ref.nextSibling) ref.parentNode.insertBefore(newNode, ref.nextSibling);
      else ref.parentNode.appendChild(newNode);
    }
  }

  /* ===== Section: Data Extraction ===== */

  function extractPoints(header){
    const spans = header.querySelectorAll('span');
    for (const s of spans){
      const t = s.textContent.trim();
      const m = t.match(/\((\d+)P\)/i);
      if (m){ return { points: parseInt(m[1],10), nodeToHide: s }; }
    }
    const text = header.textContent || '';
    const m2 = text.match(/\((\d+)P\)/i);
    return { points: m2 ? parseInt(m2[1],10) : null, nodeToHide: null };
  }

  /* ===== Section: Card Icon Rendering (green-only clickable) ===== */

  function renderIcon(state, appid){
    const el = document.createElement('span');
    el.className = 'sgc-card-icon ' + (state==='yes'?'sgc-ok':state==='no'?'sgc-bad':'sgc-unk');
    el.textContent = 'playing_cards';
    el.title = state==='yes' ? 'Steam Trading Cards: YES'
              : state==='no' ? 'Steam Trading Cards: NO'
              : 'Unknown';

    // clickable ONLY if enabled and green
    if (state === 'yes' && appid && getClickToBadge()){
      el.classList.add('sgc-clickable');
      el.title += ' — Click: open Steam badge page';
      el.addEventListener('click', (ev)=>{
        ev.preventDefault(); ev.stopPropagation();
        window.open(`https://steamcommunity.com/my/gamecards/${appid}`, '_blank', 'noopener');
      });
    }
    return el;
  }

  function findSteamUrl(root){
    const a = root.querySelector('a[href*="store.steampowered.com/"]');
    return a ? a.href : null;
  }

  function parseSteamUrl(url){
    if (!url) return {type:null, id:null};
    const mApp    = url.match(/store\.steampowered\.com\/app\/(\d+)/i);    if (mApp)    return { type:'app', id:mApp[1] };
    const mSub    = url.match(/store\.steampowered\.com\/sub\/(\d+)/i);    if (mSub)    return { type:'sub', id:mSub[1] };
    const mBundle = url.match(/store\.steampowered\.com\/bundle\/(\d+)/i); if (mBundle) return { type:'bundle', id:mBundle[1] };
    return { type:null, id:null };
  }

  /* ===== Section: Native Icons Coloring ===== */

  function colorNativeIcons(header){
    const colors = getNativeColors();
    const row =
      header.querySelector('.giveaway__heading__icons, .giveaway__icons, .giveaway__icon-container') ||
      header;

    const icons = Array.from(row.querySelectorAll([
      '.giveaway__icon',
      '.giveaway__heading__icon',
      'i[class*="icon"]',
      'span[class*="icon"]',
      'svg'
    ].join(','))).slice(0, 4);

    icons.forEach((el, idx) => tintNode(el, colors[idx]));
  }

  function tintNode(el, hex){
    el.style.color = hex;
    const svg = el.tagName === 'svg' ? el : el.querySelector('svg');
    if (svg) { svg.style.fill = hex; svg.style.color = hex; }
    const img = el.tagName === 'img' ? el : el.querySelector('img');
    if (img) {
      img.style.filter = `grayscale(1) brightness(0) invert(1) sepia(1) saturate(600%) hue-rotate(${hueFromHex(hex)}deg)`;
    }
  }

  function hueFromHex(hex){
    const c = hex.replace('#','');
    const n = parseInt(c.length===3 ? c.split('').map(x=>x+x).join('') : c, 16);
    const r = (n>>16)&255, g=(n>>8)&255, b=n&255;
    const rf=r/255, gf=g/255, bf=b/255;
    const max=Math.max(rf,gf,bf), min=Math.min(rf,gf,bf);
    let h, d=max-min;
    if(max===min){ h=0; } else {
      switch(max){
        case rf: h=(gf-bf)/d+(gf<bf?6:0); break;
        case gf: h=(bf-rf)/d+2; break;
        default: h=(rf-gf)/d+4;
      } h*=60;
    }
    return Math.round(h||0);
  }

  function applyNativeColorsAll(){
    document.querySelectorAll('.giveaway__heading').forEach(h => colorNativeIcons(h));
  }

  // Apply card colors to CSS variables
  function applyCardColors(){
    const root = document.documentElement;
    root.style.setProperty('--sgc-ok',  getCardOk());
    root.style.setProperty('--sgc-bad', getCardBad());
    // --sgc-unk remains default (can be exposed later if desired)
  }

  /* ===== Section: Options UI ===== */

  function openOptions(){
    const [c1,c2,c3,c4] = getNativeColors();
    const clickToBadge = getClickToBadge();
    const cardOkColor  = getCardOk();
    const cardBadColor = getCardBad();

    const backdrop = document.createElement('div');
    backdrop.className = 'sgc-backdrop';
    const modal = document.createElement('div');
    modal.className = 'sgc-modal';
    modal.innerHTML = `
      <h3>Trading Cards — Options</h3>

      <label>Check X apps every Y seconds</label>
      <div class="sgc-row">
        <input id="sgc-rate-count" type="number" min="1" step="1" value="${getRateCount()}">
        <span>apps</span>
        <span>every</span>
        <input id="sgc-rate-secs" type="number" min="0.5" step="0.5" value="${getRateSecs()}">
        <span>seconds</span>
      </div>
      <span class="sgc-hint">Only giveaways that appear are queued. The scheduler processes batches until the queue is empty.</span>

      <label for="sgc-ttl">Re-check period (days)</label>
      <div class="sgc-row">
        <input id="sgc-ttl" type="number" min="1" step="1" value="${Math.max(1, Math.round(getTTL()/86400000))}">
        <span class="sgc-hint">Within this period, cached results are reused; Steam is not queried again.</span>
      </div>

      <label>Native icons color (by position)</label>
      <div class="sgc-row">
        <span class="sgc-hint">These affect the 4 default SG icons next to the title. Cards always stay green/red according to settings below.</span>
      </div>
      <div class="sgc-row">
        <span>#1</span><input id="sgc-n1" type="color" value="${c1}">
        <span>#2</span><input id="sgc-n2" type="color" value="${c2}">
        <span>#3</span><input id="sgc-n3" type="color" value="${c3}">
        <span>#4</span><input id="sgc-n4" type="color" value="${c4}">
      </div>

      <div class="sgc-row" style="margin-top:8px">
        <button class="sgc-btn" id="sgc-reset-colors">Reset native colors</button>
        <span class="sgc-hint">Restores the 4 default SG icon colors to the original grey.</span>
      </div>

      <hr style="border:none;border-top:1px solid #2b2f33; margin:10px 0">

      <label>Card icon colors</label>
      <div class="sgc-row">
        <span>Green</span><input id="sgc-card-ok" type="color" value="${cardOkColor}">
        <span>Red</span><input id="sgc-card-bad" type="color" value="${cardBadColor}">
      </div>
      <div class="sgc-row" style="margin-top:8px">
        <button class="sgc-btn" id="sgc-reset-card-colors">Reset card colors</button>
        <span class="sgc-hint">Restores green/red to defaults (${DEFAULT_CARD_OK} / ${DEFAULT_CARD_BAD}).</span>
      </div>

      <hr style="border:none;border-top:1px solid #2b2f33; margin:10px 0">

      <div class="sgc-row sgc-check">
        <label class="sgc-checkline" for="sgc-click-badge">
          <input type="checkbox" id="sgc-click-badge" ${clickToBadge ? 'checked' : ''}>
          <span>Open the Steam badge page when clicking the card icon (green only)</span>
        </label>
      </div>

      <div class="sgc-row" style="margin-top:8px">
        <button class="sgc-btn danger" id="sgc-clear">Clear card cache</button>
        <span class="sgc-hint">Forces fresh checks next time giveaways appear.</span>
      </div>

      <div class="sgc-actions">
        <span class="sgc-stat" id="sgc-qstat"></span>
        <button class="sgc-btn" id="sgc-close">Close</button>
        <button class="sgc-btn primary" id="sgc-save">Save</button>
      </div>
    `;
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const q = modal.querySelector('#sgc-qstat');
    const upd = () => q.textContent = `Queue: ${taskQueue.length} pending`;
    upd(); const timer = setInterval(upd, 500);

    modal.querySelector('#sgc-reset-colors').addEventListener('click', () => {
      setNativeColors(DEFAULT_NATIVE_COLORS);
      modal.querySelector('#sgc-n1').value = DEFAULT_NATIVE_COLORS[0];
      modal.querySelector('#sgc-n2').value = DEFAULT_NATIVE_COLORS[1];
      modal.querySelector('#sgc-n3').value = DEFAULT_NATIVE_COLORS[2];
      modal.querySelector('#sgc-n4').value = DEFAULT_NATIVE_COLORS[3];
      applyNativeColorsAll();
      alert('Native icon colors reset.');
    });

    modal.querySelector('#sgc-reset-card-colors').addEventListener('click', () => {
      setCardOk(DEFAULT_CARD_OK);
      setCardBad(DEFAULT_CARD_BAD);
      modal.querySelector('#sgc-card-ok').value  = DEFAULT_CARD_OK;
      modal.querySelector('#sgc-card-bad').value = DEFAULT_CARD_BAD;
      applyCardColors();
      alert('Card icon colors reset.');
    });

    modal.querySelector('#sgc-clear').addEventListener('click', ()=>{
      if (confirm('Clear cached card results?')) { clearCache(); alert('Cache cleared.'); }
    });

    modal.querySelector('#sgc-close').addEventListener('click', close);
    modal.querySelector('#sgc-save').addEventListener('click', ()=>{
      const cnt  = parseInt(modal.querySelector('#sgc-rate-count').value,10);
      const sec  = parseFloat(modal.querySelector('#sgc-rate-secs').value);
      const days = parseInt(modal.querySelector('#sgc-ttl').value,10);
      if (!Number.isFinite(cnt)||cnt<1) return alert('Invalid "apps".');
      if (!Number.isFinite(sec)||sec<=0) return alert('Invalid "seconds".');
      if (!Number.isFinite(days)||days<1) return alert('Invalid "re-check period".');

      const nc = [
        modal.querySelector('#sgc-n1').value,
        modal.querySelector('#sgc-n2').value,
        modal.querySelector('#sgc-n3').value,
        modal.querySelector('#sgc-n4').value,
      ];
      setRateCount(cnt); setRateSecs(sec); setTTL(days*86400000); setNativeColors(nc);

      const okHex  = modal.querySelector('#sgc-card-ok').value;
      const badHex = modal.querySelector('#sgc-card-bad').value;
      setCardOk(okHex); setCardBad(badHex);
      applyCardColors();

      const click = modal.querySelector('#sgc-click-badge').checked;
      setClickToBadge(click);

      applyNativeColorsAll();
      alert('Options saved.');
      close();
    });

    backdrop.addEventListener('click', (e)=>{ if (e.target===backdrop) close(); });

    function close(){
      clearInterval(timer);
      backdrop.remove();
    }
  }

  /* ===== Section: Utilities ===== */

  function injectMaterialSymbols(){
    if (document.getElementById('sgc-material-symbols')) return;
    const link = document.createElement('link');
    link.id = 'sgc-material-symbols';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    document.head.appendChild(link);
  }

})();
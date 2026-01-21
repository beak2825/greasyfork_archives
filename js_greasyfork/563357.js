// ==UserScript==
// @name         Torn Mugger + Saved Hits + Quick Mug Calc (🔪) — min/typ/high only
// @namespace    https://torn.tools/
// @version      2.0
// @description  Reduced-API mugger with saved hits, 1-minute API meter (color-coded Run), and a simplified Quick Mug Return calculator (Minimum/Typical/High). Supports negative tolerance (e.g., -10%) to find under-market items and ignores $1 items in bazaar totals. Includes "Session-Based" 7* Clothing Store Scraper.
// @author       dirt-fairy
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/*
// @run-at       document-idle
// @connect      api.torn.com
// @connect      www.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563357/Torn%20Mugger%20%2B%20Saved%20Hits%20%2B%20Quick%20Mug%20Calc%20%28%F0%9F%94%AA%29%20%E2%80%94%20mintyphigh%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/563357/Torn%20Mugger%20%2B%20Saved%20Hits%20%2B%20Quick%20Mug%20Calc%20%28%F0%9F%94%AA%29%20%E2%80%94%20mintyphigh%20only.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // ---------- LocalStorage keys ----------
  const LS = {
    apiKey: 'tornApiKey',
    minMug: 'mugThreshold',
    tolerance: 'priceTolerance',
    uiPos: 'mugUI_pos',
    uiHidden: 'mugUI_hidden',
    marketCache: 'mug_market_cache',
    marketTs: 'mug_market_ts',
    // Saved row render
    lastResults: 'mug_last_results',
    autoShowSaved: 'mug_auto_show_saved',
    // Hits
    hits: 'mug_hits',
    hitsTTLHours: 'mug_hits_ttl_hours',
    hitsMax: 'mug_hits_max',
    // API 1-minute rolling timestamps
    apiTs: 'mug_api_ts',
    // Calculator UI
    calcPos: 'mugCalc_ui_pos',
    calcHidden: 'mugCalc_ui_hidden',
    calcInputs: 'mugCalc_inputs',
    // Protected Companies (7*+ Clothing Stores)
    protectedCos: 'mug_protected_companies',
    scrapeTs: 'mug_scrape_ts',
    // New Session Data
    scanSession: 'mug_scan_session'
  };

  const DEF = { minMug: 100000000, tolerance: 5 };
  const HITS_DEF = { ttlHours: 24, max: 400 };

  // Tweak these to your pages
  const SCOPE_SELECTORS = [
    '.userlist-wrapper', // User List
    '.faction-members', // Faction pages
    '.table-body', '.table-wrap', '.content', '#mainContainer',
  ];

  const EXCLUDE_SELECTORS = [
    'header', 'footer', 'nav', 'aside',
    '#chatRoot', '#sidebarroot', '#sidebar', '.sidebar',
    '.tooltip', '[role="tooltip"]',
    '.context-menu', '.dropdown-menu', '.popover', '.modal', '.overlay',
  ];

  // ---------- Styles ----------
  GM_addStyle(`
  /* Mug icon next to Torn icons in rows */
  .tm_mug_icon{
    display:inline-flex; align-items:center; justify-content:center;
    width:16px; height:16px; font-size:16px; line-height:1;
    vertical-align:middle; margin:0 2px; text-decoration:none;
    transform: translateY(-3.5px);
  }
  .tm_mug_li, .tm_mug_li a{ background:none !important; -webkit-mask-image:none !important; mask-image:none !important; }
  .tm_mug_li::before, .tm_mug_li::after, .tm_mug_li a::before, .tm_mug_li a::after{ content:none !important; }
  .tm_mug_li { display:inline-block; }
  .tm_mug_li a{ display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; line-height:16px; text-decoration:none; }

  #mugStatusUI, #mugStatusUI *, #mugFab { box-sizing: border-box; }
  #mugStatusUI{position:fixed;top:84px;right:24px;z-index:999999;background:#0a0a0a;color:#fff;
    border:1px solid #2b2b2b;border-radius:12px;padding:12px;box-shadow:0 8px 24px rgba(0,0,0,.55);
    font:12px/1.35 Arial, sans-serif;min-width:290px;max-width:340px}
  #mugStatusUI .hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;cursor:move}
  #mugStatusUI .title{font-weight:700;letter-spacing:.2px}
  #mugStatusUI .small{opacity:.8;font-weight:400}
  #mugStatusUI input[type="text"],#mugStatusUI input[type="number"]{
    width:100%;padding:8px 10px;background:#151515;border:1px solid #2e2e2e;border-radius:8px;color:#eee;margin-top:4px}
  #mugStatusUI label{display:block;margin-top:8px}
  #mugStatusUI .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  #mugStatusUI .btn{background:#1d1d1d;border:1px solid #2e2e2e;color:#ddd;border-radius:7px;padding:4px 10px;cursor:pointer}
  #mugStatusUI .btn.small{padding:3px 8px}
  /* Color-coded Run button */
  #mugRunTop.ok     { background:#14532d; border-color:#1b6b3b; color:#fff; }
  #mugRunTop.warn   { background:#7a5d00; border-color:#9a7a00; color:#fff; }
  #mugRunTop.danger { background:#7a1a1a; border-color:#a11c1c; color:#fff; }
  #mugRunTop.ok:hover, #mugRunTop.warn:hover, #mugRunTop.danger:hover { filter:brightness(1.05); }

  /* FAB (collapsed mug button) */
  #mugFab{position:fixed;top:84px;right:24px;z-index:999998;width:48px;height:48px;border-radius:50%;
    display:none;align-items:center;justify-content:center;background:#1d1d1d;border:2px solid #2e2e2e;
    color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.55);cursor:pointer;font-size:26px;user-select:none}
  #mugFab:hover{filter:brightness(1.1)}

  /* ——— Hits panel ——— */
  #mugHitsPanel{
    position:fixed; top:84px; right:380px; z-index:999999;
    background:#0a0a0a; color:#fff; border:1px solid #2b2b2b; border-radius:12px;
    box-shadow:0 8px 24px rgba(0,0,0,.55); width:360px; max-height:66vh; overflow:auto; display:none;
    font:12px/1.35 Arial, sans-serif;
  }
  #mugHitsPanel .hdr{display:flex;justify-content:space-between;align-items:center;padding:10px;cursor:move}
  #mugHitsPanel .body{padding:10px}
  #hitsControls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
  #hitsList{display:flex;flex-direction:column;gap:6px}
  .hitRow{display:flex;justify-content:space-between;gap:8px;align-items:center;
    background:#111;border:1px solid #2e2e2e;border-radius:8px;padding:8px}
  .hitMain{min-width:0}
  .hitMain .val{font-weight:700}
  .hitMain .em{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;font-size:16px;transform:translateY(-2px);margin-right:4px}
  .hitMeta{opacity:.8}
  .hitActions{display:flex;gap:6px;flex-wrap:wrap}
  .hitActions .btn{padding:2px 8px;border-radius:7px;border:1px solid #2e2e2e;background:#1d1d1d;color:#ddd;cursor:pointer}
  #hitsCfg{display:flex;gap:6px;align-items:center;margin-top:6px;opacity:.9}
  #hitsCfg input{width:70px;padding:4px 6px;background:#151515;border:1px solid #2e2e2e;border-radius:8px;color:#eee}

  /* ——— Calculator panel ——— */
  #mugCalcUI, #mugCalcUI * { box-sizing: border-box; font-family: Arial, sans-serif; }
  #mugCalcUI{
    position:fixed; top:84px; right:84px; z-index:999999;
    background:#0a0a0a; color:#fff; border:1px solid #2b2b2b; border-radius:12px;
    padding:12px; width:320px; box-shadow:0 8px 24px rgba(0,0,0,.55);
    font-size:12px; line-height:1.35;
  }
  #mugCalcUI .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;cursor:move}
  #mugCalcUI .title{font-weight:700;letter-spacing:.2px}
  #mugCalcUI .btn{background:#1d1d1d;border:1px solid #2e2e2e;color:#ddd;border-radius:8px;padding:6px 10px;cursor:pointer}
  #mugCalcUI .btn.small{padding:4px 8px}
  #mugCalcUI .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  #mugCalcUI label{display:flex;flex-direction:column;gap:4px;margin-top:6px}
  #mugCalcUI input[type="text"], #mugCalcUI input[type="number"], #mugCalcUI select {
    width:100%; background:#151515; color:#eee; border:1px solid #2e2e2e; border-radius:8px; padding:8px 10px;
  }
  #mugCalcUI .muted{opacity:.8}
  #mugCalcUI .results{ margin-top:10px; display:grid; grid-template-columns:1fr; gap:8px; }
  .card{ background:#101010; border:1px solid #2a2a2a; border-radius:10px; padding:10px; }
  .kpi{display:flex; align-items:baseline; justify-content:space-between; gap:8px}
  .kpi .lbl{opacity:.9} .kpi .val{font-size:16px; font-weight:700}
  .fine{font-size:11px; opacity:.8; margin-top:4px}
  .row2{ display:grid; grid-template-columns:1fr 1fr; gap:8px }

  /* Knife FAB */
  #mugCalcFab{
    position:fixed; top:84px; right:144px; z-index:999998;
    width:48px; height:48px; border-radius:50%;
    display:none; align-items:center; justify-content:center;
    background:#1d1d1d; border:2px solid #2e2e2e; color:#fff;
    box-shadow:0 8px 24px rgba(0,0,0,.55); cursor:pointer; font-size:26px; user-select:none;
  }
  #mugCalcFab:hover{ filter:brightness(1.1) }

  /* Scraper button */
  #mugScrapeBtn {
    position: fixed; top: 10px; right: 10px; z-index: 999999;
    padding: 10px 15px; background: #0a0a0a; color: #fff;
    border: 2px solid #2b2b2b; border-radius: 8px; cursor: pointer;
    font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }
  #mugScrapeBtn:hover { background: #1d1d1d; border-color: #4caf50; }
  `);

  // ---------- Helpers ----------
  const $ = (s, r=document)=> r.querySelector(s);
  const $$ = (s, r=document)=> Array.from(r.querySelectorAll(s));
  const save=(k,v)=> localStorage.setItem(k, typeof v==='string'?v:JSON.stringify(v));
  const load=(k,d=null)=>{ const v=localStorage.getItem(k); if(v==null) return d; try{return JSON.parse(v)}catch(_){return v} };
  const setStat=t=>{ const s=$('#mugStatusStat'); if(s) s.textContent=t?` — ${t}`:''; };

  // ---------- API counters + 1-minute rate tracking ----------
  let API_COUNT = 0; // this run
  const loadApiTs = () => { try { return JSON.parse(localStorage.getItem(LS.apiTs) || '[]'); } catch { return []; } };
  const saveApiTs = (arr)=> localStorage.setItem(LS.apiTs, JSON.stringify(arr||[]));
  const pruneApiTs = (arr, now=Date.now()) => arr.filter(t => typeof t==='number' && t > (now-60000));
  const apiCount1m = () => { const now=Date.now(); const a=pruneApiTs(loadApiTs(), now); saveApiTs(a); return a.length; };
  const recordApiTs = () => { const now=Date.now(); let a=loadApiTs(); a.push(now); a=pruneApiTs(a, now); saveApiTs(a); return a.length; };
  const apiReset = () => { API_COUNT = 0; };
  const bumpApi = () => { API_COUNT++; recordApiTs(); };

  // ---------- Parsing helpers ----------
  function parseCurrencyInput(val) {
    if (typeof val !== 'string') return Number(val)||0;
    val = val.toLowerCase().replace(/[$, ]/g, '').trim();
    if (val.endsWith('b')) return Math.round(parseFloat(val) * 1_000_000_000);
    if (val.endsWith('m')) return Math.round(parseFloat(val) * 1_000_000);
    if (val.endsWith('k')) return Math.round(parseFloat(val) * 1_000);
    return Math.round(parseFloat(val)||0);
  }
  function formatCurrency(val){ const n = Number(val)||0; return '$' + n.toLocaleString('en-US'); }

  function dragify(el){
    if (!el) return;
    const hdr = el.querySelector('.hdr'); if (!hdr) return;
    let sx=0, sy=0, ox=0, oy=0, drag=false;
    const onMove=e=>{
      if(!drag) return;
      el.style.left = (ox + (e.clientX - sx))+'px';
      el.style.top = (oy + (e.clientY - sy))+'px';
      el.style.right='auto';
    };
    const onUp=()=>{
      if(!drag) return;
      drag=false;
      document.removeEventListener('mousemove',onMove);
      document.removeEventListener('mouseup',onUp);
      const r=el.getBoundingClientRect();
      save(LS.uiPos,{x:r.left,y:r.top});
    };
    hdr.addEventListener('mousedown',e=>{
      drag=true; sx=e.clientX; sy=e.clientY;
      const r=el.getBoundingClientRect(); ox=r.left; oy=r.top;
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });
  }

  // separate drag for calc (saves to LS.calcPos)
  function dragifyWithKey(el, lsKey){
    const hdr = el.querySelector('.hdr'); if (!hdr) return;
    let sx=0, sy=0, ox=0, oy=0, dragging=false;
    hdr.addEventListener('mousedown', e=>{
      dragging=true; sx=e.clientX; sy=e.clientY; const r=el.getBoundingClientRect(); ox=r.left; oy=r.top;
      const onMove=ev=>{ if(!dragging) return; el.style.left=(ox+(ev.clientX-sx))+'px'; el.style.top=(oy+(ev.clientY-sy))+'px'; el.style.right='auto'; };
      const onUp=()=>{ dragging=false; document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp);
        const r=el.getBoundingClientRect(); localStorage.setItem(lsKey, JSON.stringify({x:r.left,y:r.top})); };
      document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
    });
  }

  // ---------- Saved Results (row icons) ----------
  function loadSavedResults(){ try { return JSON.parse(localStorage.getItem(LS.lastResults) || '{}'); } catch { return {}; } }
  function saveSavedResults(obj){ localStorage.setItem(LS.lastResults, JSON.stringify(obj||{})); }

  // ---------- Protected Companies (Scraper + Session) ----------
  function getProtectedCompanies(){
    try { return JSON.parse(localStorage.getItem(LS.protectedCos) || '[]'); } catch { return []; }
  }
  function saveProtectedList(list) {
    localStorage.setItem(LS.protectedCos, JSON.stringify(list));
  }

  // Session Management
  function getSession() {
    try { return JSON.parse(localStorage.getItem(LS.scanSession) || '{"pages":[], "ids":[]}'); } catch { return {pages:[], ids:[]}; }
  }
  function saveSession(s) {
    localStorage.setItem(LS.scanSession, JSON.stringify(s));
  }
  function clearSession() {
    localStorage.removeItem(LS.scanSession);
  }

  // ---------- Time / Stale Logic (Sunday 18:30 TCT) ----------
  // Returns the timestamp (ms) of the MOST RECENT Sunday 18:30 TCT (UTC)
  function getLastSunday1830UTC() {
    const now = new Date();
    // Get current time in UTC
    const currentUTC = now.getTime();

    // Create a date object for "Today" but manipulate it to be Sunday 18:30 UTC
    const date = new Date();
    const day = date.getUTCDay(); // 0 = Sunday

    // If it's Sunday...
    if (day === 0) {
      // Set to 18:30 UTC today
      date.setUTCHours(18, 30, 0, 0);
      // If we are currently PAST 18:30 UTC, then today IS the last update.
      if (currentUTC > date.getTime()) {
        return date.getTime();
      } else {
        // If we are currently BEFORE 18:30 UTC, the last update was LAST Sunday (7 days ago).
        date.setUTCDate(date.getUTCDate() - 7);
        return date.getTime();
      }
    } else {
      // If it's not Sunday (Mon-Sat), subtract 'day' to go back to Sunday
      date.setUTCDate(date.getUTCDate() - day);
      date.setUTCHours(18, 30, 0, 0);
      return date.getTime();
    }
  }

  function isDataStale() {
    const lastScrape = Number(localStorage.getItem(LS.scrapeTs) || 0);
    if (!lastScrape) return true;
    const lastUpdateDeadline = getLastSunday1830UTC();
    return lastScrape < lastUpdateDeadline;
  }

  // ---------- Hits helpers ----------
  function _getHitsConfig(){
    const ttl = Number(localStorage.getItem(LS.hitsTTLHours)) || HITS_DEF.ttlHours;
    const max = Number(localStorage.getItem(LS.hitsMax)) || HITS_DEF.max;
    return { ttlHours: Math.max(0, ttl), max: Math.max(1, max) };
  }
  function loadHits(){ try { return JSON.parse(localStorage.getItem(LS.hits) || '{}'); } catch { return {}; } }
  function saveHits(h){ localStorage.setItem(LS.hits, JSON.stringify(h || {})); }
  function hitsCount(h){ const obj = h || loadHits(); return Object.keys(obj).length; }
  function pruneHits(h, opt={}){
    const { ttlHours, max } = _getHitsConfig();
    const now = Date.now();
    const ttlMs = (opt.ttlHours ?? ttlHours) > 0 ? (opt.ttlHours ?? ttlHours) * 3600000 : 0;

    if (ttlMs){
      for (const xid of Object.keys(h)){
        const it = h[xid];
        if (!it?.pinned && it?.addedAt && (now - it.addedAt) > ttlMs){
          delete h[xid];
        }
      }
    }
    const keys = Object.keys(h);
    if (keys.length > (opt.max ?? max)){
      const arr = keys.map(k => ({ xid:k, t:h[k]?.addedAt||0, pinned: !!h[k]?.pinned }));
      arr.sort((a,b)=> (a.pinned===b.pinned) ? (a.t-b.t) : (a.pinned?1:-1));
      while (arr.length && Object.keys(h).length > (opt.max ?? max)){
        const x = arr.shift();
        if (x && !h[x.xid]?.pinned) delete h[x.xid];
      }
    }
    return h;
  }

  function inferEmojiFromHit(r){
    if (!r) return '';
    const minMug = Number(load(LS.minMug, DEF.minMug));
    const isMugable = Number(r.mugValue||0) >= minMug;
    const out = determineEmoji(r.status || '', r.lastAction || '', null, isMugable, Number(r.mugValue||0), minMug);
    return out.emoji || '';
  }

  function addHit({xid, mugValue, lastAction, status, emoji, title}){
    if (!xid) return false;
    const h = loadHits();
    const now = Date.now();
    const profileUrl = `/profiles.php?XID=${xid}`;
    const bazaarUrl = `/bazaar.php?userID=${xid}`;
    const existing = h[xid];

    if (existing){
      existing.mugValue = Math.max(Number(existing.mugValue||0), Number(mugValue||0));
      existing.lastAction= lastAction || existing.lastAction || '';
      existing.status = status || existing.status || '';
      existing.emoji  = emoji || existing.emoji || '';
      existing.title  = title || existing.title || '';
      existing.updatedAt = now;
      existing.seenCount = (existing.seenCount||0) + 1;
      existing.profileUrl = existing.profileUrl || profileUrl;
      existing.bazaarUrl = existing.bazaarUrl || bazaarUrl;
    } else {
      h[xid] = {
        xid: String(xid), profileUrl, bazaarUrl,
        mugValue: Number(mugValue||0), lastAction: lastAction || '', status: status || '',
        emoji: emoji || '', title: title || '',
        addedAt: now, updatedAt: now, seenCount: 1, pinned: false, note: '',
        src: location.pathname + location.search
      };
    }

    pruneHits(h);
    saveHits(h);
    return true;
  }

  function getHitsSorted(sort='value'){
    const list = Object.values(loadHits());
    if (sort==='recent') list.sort((a,b)=> (b.updatedAt||0)-(a.updatedAt||0));
    else list.sort((a,b)=> Number(b.mugValue||0) - Number(a.mugValue||0));
    return list;
  }

  const timeAgo = (ts)=> {
    if(!ts) return '—';
    const s = Math.max(0, Math.floor((Date.now()-ts)/1000));
    if (s<60) return `${s}s ago`;
    const m = Math.floor(s/60); if (m<60) return `${m}m ago`;
    const h = Math.floor(m/60); if (h<48) return `${h}h ago`;
    const d = Math.floor(h/24); return `${d}d ago`;
  };
    // ---------- Networking ----------
  function http(url){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url,
        onload:r=>resolve({status:r.status,text:r.responseText}),
        onerror:reject, ontimeout:reject
      });
    });
  }

  const ITEMS_MAX_AGE = 60*60*1000; // 1 hour
  function itemsCacheFresh(){
    const ts = Number(localStorage.getItem(LS.marketTs) || 0);
    return ts && (Date.now() - ts) < ITEMS_MAX_AGE;
  }

  async function getMarketMap(apiKey){
    const cacheRaw = localStorage.getItem(LS.marketCache);
    if (cacheRaw && itemsCacheFresh()){
      try { return JSON.parse(cacheRaw) || {}; } catch(_){}
    }
    if (apiCount1m() >= 100) throw new Error('API minute limit reached (items)');
    bumpApi();
    const {text} = await http(`https://api.torn.com/torn/?selections=items&key=${apiKey}`);
    const data = JSON.parse(text);
    if (data.error) throw new Error('items error');
    const map = {};
    for (const id in data.items) {
      const it = data.items[id];
      map[id] = it.market_value ?? it.marketValue ?? 0;
    }
    localStorage.setItem(LS.marketCache, JSON.stringify(map));
    localStorage.setItem(LS.marketTs, String(Date.now()));
    return map;
  }

  async function fetchUser(xid, apiKey){
    if (apiCount1m() >= 100) throw new Error('API minute limit reached (user)');
    bumpApi();
    const {text} = await http(`https://api.torn.com/user/${xid}?selections=profile,bazaar&key=${apiKey}`);
    const data = JSON.parse(text);
    if (data.error) throw new Error('user error '+xid);
    return data;
  }

  // ---------- DOM ----------
  function clearIcons(){
    $$('.tm_mug_icon').forEach(n=>n.remove());
    $$('.tm_mug_li').forEach(n=>n.remove());
  }

  // Bazaar-first: only rows with bazaar icons
  function getRows(){
    const scopes = SCOPE_SELECTORS.map(s => document.querySelector(s)).filter(Boolean);
    const roots = scopes.length ? scopes : [document.body];

    const excludeSel = EXCLUDE_SELECTORS.join(',');
    const bazaarLinks = roots.flatMap(root =>
      Array.from(root.querySelectorAll('a[href*="/bazaar.php?user"]'))
        .filter(a => {
          if (a.closest(excludeSel)) return false;
          if (a.offsetParent === null) return false;
          if (a.closest('[role="menu"], [role="dialog"], [aria-hidden="true"], .menu, .dropdown, .tooltip, .popover, .modal')) return false;
          return true;
        })
    );

    const findRowRoot = (node) =>
      node.closest('li, tr') ||
      node.closest('.table-row, .result-row, .user-row, .member, .list-item') ||
      node.closest('.row, .wrap, .card') ||
      node.parentElement;

    const map = new Map();

    for (const a of bazaarLinks){
      const href = a.getAttribute('href') || a.href || '';
      const m = href.match(/[?&]user(?:ID|Id|id)=(\d+)/);
      const xid = m ? m[1] : null;
      if (!xid || map.has(xid)) continue;

      const row = findRowRoot(a);
      const statusCell =
        row.querySelector('.user-icons, .icons .icons-wrap, .icons-wrap, .status, .right, .controls, [data-status-cell]') ||
        a.parentElement;

      const searchRoot = row || statusCell?.closest('li, tr') || statusCell || a.parentElement;

      const companyNode =
        searchRoot.querySelector('li.iconShow[title*="Clothing Store" i]') ||
        searchRoot.querySelector('li.iconShow[title*="Company" i]') ||
        searchRoot.querySelector('[title*="Clothing Store" i]') ||
        searchRoot.querySelector('[data-tip*="Clothing Store" i]') ||
        searchRoot.querySelector('[data-tooltip*="Clothing Store" i]') ||
        searchRoot.querySelector('[aria-label*="Clothing Store" i]');

      const companyAttr =
        (companyNode && (
          companyNode.getAttribute('title') ||
          companyNode.getAttribute('data-tip') ||
          companyNode.getAttribute('data-tooltip') ||
          companyNode.getAttribute('aria-label')
        )) || '';

      const companyTitle = companyAttr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const isClothingDom = /Clothing\s*Store/i.test(companyTitle);

      map.set(xid, { row, statusCell, link: a, hasBazaarDom: true, companyTitle, isClothingDom });
    }

    return map;
  }

  function placeIcon(statusCell, emoji, title){
    (statusCell.querySelector('.tm_mug_icon') || statusCell.querySelector('.tm_mug_li'))?.remove();

    const rowRoot = statusCell.closest('li, tr, .table-row, .result-row, .user-row, .member, .list-item, .row, .wrap, .card') || statusCell;
    const bazA =
      statusCell.querySelector('a[href*="/bazaar.php?user"]') ||
      rowRoot.querySelector('a[href*="/bazaar.php?user"]');

    const bazLi = bazA ? (bazA.closest('li') || bazA.parentElement) : null;
    const list = bazLi ? bazLi.parentElement
                      : (statusCell.querySelector('ul,ol') || rowRoot.querySelector('ul,ol'));

    if (list){
      list.style.whiteSpace = 'nowrap';
      const cs = getComputedStyle(list);
      if (cs.display.includes('flex')) list.style.flexWrap = 'nowrap';

      const li = document.createElement('li');
      li.className = 'iconShow tm_mug_li';
      li.style.marginBottom = '0px';
      if (title) li.title = title;

      const a = document.createElement('a');
      a.href = 'javascript:void(0)';
      a.setAttribute('aria-label', title || '');
      a.className = 'tm_mug_icon';
      a.textContent = emoji;

      li.appendChild(a);

      if (bazLi && bazLi.parentElement === list){
        bazLi.insertAdjacentElement('afterend', li);
      } else {
        list.appendChild(li);
      }
      return;
    }

    const span = document.createElement('span');
    span.className = 'tm_mug_icon';
    span.textContent = emoji;
    if (title) span.title = title;
    statusCell.appendChild(span);
  }

  function parseRelativeMinutes(text) {
    if (!text) return 0;
    const match = text.match(/(\d+)\s*(second|minute|hour|day)/i);
    if (!match) return 0;
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit.startsWith('second')) return 0;
    if (unit.startsWith('minute')) return value;
    if (unit.startsWith('hour')) return value * 60;
    if (unit.startsWith('day')) return value * 1440;
    return 0;
  }

  function determineEmoji(status, lastAction, _revivable, isMugable, mugValue, minMug) {
    if (!isMugable) return { emoji: '⚪', title: 'Skipped' };

    const mins = parseRelativeMinutes(lastAction || '');
    const abroad = status?.startsWith('In ') && !status.includes('Torn');

    if (/hospital/i.test(status)) {
      return _revivable === 1 ? { emoji: '🟡', title: 'Revivable' } : { emoji: '🔴', title: 'Not revivable' };
    }
    if (/flying|traveling|returning/i.test(status)) return { emoji: '✈️', title: status };
    if (abroad) return { emoji: '🍹', title: status };
    if (/okay/i.test(status)) {
      if (mugValue >= minMug) {
        if (mins <= 10) return { emoji: '🟢', title: 'Mugable & Active' };
        else return { emoji: '💰', title: 'Mugable & Inactive' };
      }
    }
    return { emoji: '⚪', title: 'Skipped' };
  }

  function bazaarTotal(user, marketMap, tolPct){
    const arr = Array.isArray(user.bazaar) ? user.bazaar : Object.values(user.bazaar || {});
    if (!arr.length) return { total: 0, hadBazaar: false };
    const tol = Math.max(-99, Math.min(200, Number(tolPct))) / 100; // allow under-market filters
    let sum = 0;
    for (const it of arr){
      const mv = marketMap[it.ID] || 0;
      const price = Number(it.price || 0);
      const qty = Number(it.quantity || 1);
      if (mv > 0 && price > 1 && price <= mv * (1 + tol)){ // ignore $1; honor negative tol
        sum += price * qty;
      }
    }
    return { total: sum, hadBazaar: true };
  }

  // ---------- Render saved icons ----------
  function renderFromSaved(){
    clearIcons();
    const saved = loadSavedResults();
    const rows = getRows();
    let shown = 0;

    for (const [xid, obj] of rows){
      const r = saved[xid];
      if (!r) continue;
      const suffix = r.lastAction ? ` • ${r.lastAction}` : ' • —';
      const mv = (r.mugValue||0).toLocaleString();
      const ageMin = Math.floor((Date.now() - (r.ts||0))/60000);
      const ageStr = isFinite(ageMin) && ageMin>=0 ? ` • saved ${ageMin}m ago` : ' • saved';
      placeIcon(obj.statusCell, r.emoji || '⚪', `${r.title || 'Saved'}${suffix} • $${mv}${ageStr}`);
      shown++;
    }
    setStat(shown ? `Showing saved (${shown})` : 'No saved results');
  }

  // ---------- Run button color ----------
  function estimateRunCalls(){
    const rows = getRows();
    let eligible = 0;
    // We no longer skip clothing stores in the DOM automatically
    for (const [, r] of rows){ eligible++; }
    let est = eligible; // one user call per eligible
    if (eligible > 0 && !itemsCacheFresh()) est += 1; // items call if cache stale
    return est;
  }
  function setRunBtnState(state, tip){
    const btn = $('#mugRunTop'); if (!btn) return;
    btn.classList.remove('ok','warn','danger');
    btn.classList.add(state);
    btn.title = tip || '';
  }
  function updateRunBtnColor(){
    const used = apiCount1m();
    const est = estimateRunCalls();
    const proj = used + est;
    if (proj >= 100) setRunBtnState('danger', `Projected ${proj}/100 in last minute. Running now would exceed the limit.`);
    else if (proj >= 90) setRunBtnState('warn', `Projected ${proj}/100 in last minute.`);
    else {
        // NEW: Check stale data logic for green state
        if (isDataStale()) {
            setRunBtnState('warn', `WARNING: Company data stale (Older than last Sunday 18:30 TCT). Update needed.`);
        } else {
            setRunBtnState('ok', `Projected ${proj}/100 in last minute.`);
        }
    }
  }

  // ---------- Main run ----------
  let RUNNING = false;

  async function run(){
    if (RUNNING) return;

    // NEW: Check Stale Data
    if (isDataStale()) {
        const proceed = confirm("⚠️ WARNING: Your protected company list is stale!\n\nIt is older than the last weekly update (Sunday 18:30 TCT).\nStar ratings may have changed, meaning you might mug a 7*+ store by accident.\n\nPlease go to the Job List and click 'Save High-Star Stores' first.\n\nContinue anyway?");
        if (!proceed) return;
    }

    RUNNING = true;
    apiReset();
    clearIcons();

    const used = apiCount1m();
    const est = estimateRunCalls();
    if (used + est >= 100){
      alert(`Projected API usage ${(used+est)}/100 in the last minute.\nRun aborted to avoid exceeding the limit.`);
      RUNNING = false; return;
    }
    if (used + est >= 90){
      const ok = confirm(`Warning: projected API usage ${(used+est)}/100 in the last minute.\nProceed?`);
      if (!ok){ RUNNING = false; return; }
    }

    setStat('Starting…');

    const apiKey = (localStorage.getItem(LS.apiKey) || $('#mugApi')?.value || '').trim();
    const minMug = parseCurrencyInput($('#mugMin').value || DEF.minMug);
    const tolerance = parseFloat($('#mugTol').value || DEF.tolerance);
    const protectedCompanies = getProtectedCompanies(); // Get the list of 7* IDs

    save(LS.minMug, String(minMug));
    save(LS.tolerance, String(tolerance));
    if (apiKey) localStorage.setItem(LS.apiKey, apiKey);
    $('#mugMin').value = formatCurrency(minMug);

    const rows = getRows();
    if (rows.size === 0){ setStat('No bazaar rows'); RUNNING=false; return; }

    const savedBag = {};
    const eligible = [];
    for (const [xid, obj] of rows){
        eligible.push([xid, obj]);
    }

    if (eligible.length === 0){
      saveSavedResults(savedBag);
      lastRunHitsDelta = 0; updateHitsCountBtn();
      setStat('Done • Hits unchanged');
      RUNNING = false; updateRunBtnColor(); return;
    }

    if (!apiKey){ setStat('Enter API key'); RUNNING=false; return; }

    if (apiCount1m() >= 100){ setStat('API 1m limit reached (items)'); RUNNING=false; return; }
    let market = {};
    try{
      market = await getMarketMap(apiKey);
    }catch(e){
      console.error('[MUG] market fetch failed', e);
      setStat('Market fetch failed');
      RUNNING=false; return;
    }

    let hitsAddedThisRun = 0;
    for (const [xid, obj] of eligible){
      if (apiCount1m() >= 100){
        setStat('API limit reached — partial run stopped');
        break;
      }
      try{
        const data = await fetchUser(xid, apiKey);

        const companyType = data?.job?.company_type;
        const companyId = data?.job?.company_id;

        // Check 1: Is it a Clothing Store?
        if (companyType === 5){
          // Check 2: Is it in our 'Protected' list (7*+)?
          if (companyId && protectedCompanies.includes(Number(companyId))) {
            placeIcon(obj.statusCell, '⚪', 'Skipped • 7*+ Clothing Store');
            savedBag[xid] = { emoji: '⚪', title: 'Skipped • 7*+ Clothing Store', mugValue: 0, lastAction: '', status: '', ts: Date.now() };
            continue;
          }
          // If NOT in the protected list, we assume it's safe (low stars) and proceed to mug check.
        }

        const { total: mugValue, hadBazaar } = bazaarTotal(data, market, tolerance);
        const isMugable = hadBazaar && mugValue >= minMug;

        if (!isMugable){
          const reason = !hadBazaar ? 'Skipped • no bazaar' : `Skipped • $${mugValue.toLocaleString()} < threshold`;
          placeIcon(obj.statusCell, '⚪', reason);
          savedBag[xid] = {
            emoji: '⚪',
            title: reason,
            mugValue,
            lastAction: data.last_action?.relative || '',
            status: data.status?.description || data.status?.state || '',
            ts: Date.now()
          };
          continue;
        }

        const status = data.status?.description || data.status?.state || '';
        const lastAction = data.last_action?.relative || '';
        const {emoji, title} = determineEmoji(status, lastAction, data.revivable, isMugable, mugValue, minMug);
        placeIcon(obj.statusCell, emoji, `${title} • ${lastAction || '—'} • $${(mugValue||0).toLocaleString()}`);

        savedBag[xid] = { emoji, title, mugValue, lastAction, status, ts: Date.now() };

        if (addHit({xid, mugValue, lastAction, status, emoji, title})) hitsAddedThisRun++;
      }catch(err){
        console.error('[MUG] user fetch fail', xid, err);
        placeIcon(obj.statusCell, '⚪', 'Error');
        savedBag[xid] = { emoji: '⚪', title: 'Error', mugValue: 0, lastAction: '', status: '', ts: Date.now() };
      }
    }

    saveSavedResults(savedBag);
    lastRunHitsDelta = hitsAddedThisRun;
    updateHitsCountBtn();
    setStat(`Hits total ${hitsCount()}${hitsAddedThisRun ? ` (+${hitsAddedThisRun})` : ''}`);
    RUNNING = false;
    updateRunBtnColor();
  }

  // Expose run on window
  window.__mugRun = run;

  // ---------- Scraper Logic (Session-Based) ----------
  function scrapeHighStarClothingStores(){
    const rows = $$('ul.company-list > li, .company-list > li, .list-company > li, .companies-list > li');
    if (!rows.length) { alert('No company list rows found! Please check you are on the "Job List" page.'); return; }

    // 1. Identify Page Number
    let pageNum = 1;
    const activePageNode = document.querySelector('.pagination a.active, .pagination .current-page');
    if (activePageNode) {
        const txt = activePageNode.textContent.trim();
        pageNum = parseInt(txt) || 1;
    } else {
        // Fallback: Check URL for 'start='
        const m = location.href.match(/start=(\d+)/);
        if (m) {
            // Usually start=0 is page 1, start=20 is page 2
            const startVal = parseInt(m[1]);
            // Attempt to guess page from start val (assuming 20 per page?)
            // We'll just rely on "0" being page 1 for reset purposes
            if (startVal === 0) pageNum = 1;
            else pageNum = (startVal / 20) + 1; // Rough guess if text fails
        }
    }

    // 2. Manage Session
    let session = getSession();
    if (pageNum === 1) {
        // Reset session on Page 1
        session = { pages: [], ids: [] };
    }

    if (!session.pages.includes(pageNum)) {
        session.pages.push(pageNum);
    }

    let foundOnThisPage = 0;
    let seenLowStar = false; // Flag if we see < 7*

    for (const row of rows) {
      // Find ID
      const link = row.querySelector('a[href*="ID="]');
      if (!link) continue;
      const m = link.href.match(/ID=(\d+)/);
      if (!m) continue;
      const id = Number(m[1]);

      // Count Stars
      const ratingDiv = row.querySelector('[class*="rating"]') || row.querySelector('.ranks');
      let stars = 0;
      if (ratingDiv) {
         const starNodes = ratingDiv.querySelectorAll('[class*="star"]');
         let activeStars = 0;
         starNodes.forEach(node => {
             const c = node.className.toLowerCase();
             if (!c.includes('empty') && !c.includes('gray') && !c.includes('grey') && !c.includes('inactive')) {
                 activeStars++;
             }
         });
         stars = activeStars;
         // Fallback
         if (stars === 0) {
            const txt = ratingDiv.innerText || ratingDiv.getAttribute('aria-label') || '';
            const m2 = txt.match(/(\d+)/);
            if (m2) stars = parseInt(m2[1]);
         }
      }

      if (stars >= 7) {
        if (!session.ids.includes(id)) {
            session.ids.push(id);
        }
        foundOnThisPage++;
        row.style.border = '2px solid green'; // Mark safe
      } else {
        seenLowStar = true;
        row.style.border = '2px solid red'; // Mark unsafe trigger
      }
    }

    saveSession(session);

    // 3. Logic Trigger
    if (seenLowStar) {
        // We hit the end of the high-star list.
        // Validate Continuity: Do we have pages 1..pageNum in the session?
        // We sort the pages array and check if it matches the sequence
        session.pages.sort((a,b)=>a-b);
        const maxPage = session.pages[session.pages.length-1];

        let valid = true;
        let missing = [];
        for (let i=1; i<=maxPage; i++) {
            if (!session.pages.includes(i)) {
                valid = false;
                missing.push(i);
            }
        }

        if (valid) {
            // SUCCESS: Full chain verified.
            const oldLen = getProtectedCompanies().length;
            const newLen = session.ids.length;

            saveProtectedList(session.ids);
            localStorage.setItem(LS.scrapeTs, Date.now());
            clearSession(); // Cleanup

            alert(`✅ FULL SCAN COMPLETE!\n\nVerified continuous scan from Page 1 to ${pageNum}.\nFound ${newLen} high-star stores.\nDatabase has been fully synchronized (Old count: ${oldLen}).\n\nYou are now safe.`);
        } else {
            // FAILURE: Gaps detected
            alert(`⚠️ SCAN INCOMPLETE!\n\nWe found low-star stores, BUT you missed pages: ${missing.join(', ')}.\n\nYou MUST scan those pages to ensure you have the full list.\nGo back and click Save on the missing pages.`);
        }

    } else {
        // No low stars yet. Keep going.
        alert(`Session Active (Page ${pageNum}).\nFound ${foundOnThisPage} high-star stores this page.\nTotal in session: ${session.ids.length}.\n\nKeep going until you see stores with fewer than 7 stars.`);
    }
  }
   // ---------- UI ----------
  let lastRunHitsDelta = 0;

  function makeUI(){
    // If we are on the Job List page, add scraper button
    if (location.href.includes('joblist.php')) {
      const btn = document.createElement('button');
      btn.id = 'mugScrapeBtn';
      btn.innerHTML = '💾 Save High-Star Stores';
      btn.onclick = scrapeHighStarClothingStores;
      document.body.appendChild(btn);
      return;
    }

    if($('#mugStatusUI')) return;

    const el=document.createElement('div');
    el.id='mugStatusUI';
    el.innerHTML=`
      <div class="hdr">
        <div class="title">Mug Status
          <span id="mugStatusStat" class="small"></span>
        </div>
        <div style="display:flex;gap:6px">
          <button id="mugRunTop" class="btn small" type="button">Apply/Run</button>
          <button id="mugHitsBtn" class="btn small" type="button">Hits (0)</button>
          <button id="mugHide" class="btn small" type="button">Hide</button>
        </div>
      </div>

      <div id="apiMaskRow" style="display:none;margin-bottom:2px">
        <button id="editKeyBtn" class="btn" type="button" title="Edit API Key">Edit API Key</button>
      </div>
      <label id="apiRow">API Key
        <input id="mugApi" type="text" placeholder="Enter Torn API key">
        <button id="saveKeyBtn" class="btn small" type="button" style="margin-top:6px">Save Key</button>
      </label>

      <div class="row">
        <label>Minimum Mug
          <input id="mugMin" type="text" placeholder="$100,000,000">
        </label>
        <label>Tolerance %
          <input id="mugTol" type="number" min="-99" step="0.1" placeholder="5">
        </label>
      </div>

      <label style="display:flex;align-items:center;gap:8px;margin-top:8px">
        <input id="autoShowSaved" type="checkbox">
        <span>Auto-show last results (no API)</span>
      </label>
      <div style="display:flex;gap:8px;margin-top:6px">
        <button id="mugShowSaved" class="btn small" type="button" title="Render last saved icons without fetching">Show Saved</button>
        <button id="mugClearSaved" class="btn small" type="button" title="Clear saved icons">Clear Saved</button>
      </div>

      <details>
        <summary>Legend</summary>
        <div style="margin-top:4px">
          🟢 Mugable & Active — 💰 Mugable & Inactive — 🟡 Revivable — 🔴 Not Revivable — ✈️ Flying — 🍹 Abroad — ⚪ Skipped
        </div>
      </details>

      <div id="mugHitsPanel">
        <div class="hdr">
          <div class="title">Saved Hits <span id="hitsHdrCount" class="small"></span></div>
          <div style="display:flex;gap:6px"><button id="hitsClose" class="btn small" type="button">Close</button></div>
        </div>
        <div class="body">
          <div id="hitsControls">
            <label>Sort
              <select id="hitsSort">
                <option value="value">Value (desc)</option>
                <option value="recent">Most recent</option>
              </select>
            </label>
            <button id="hitsExport" class="btn small" type="button">Export CSV</button>
            <button id="hitsClearUnpinned" class="btn small" type="button" title="Remove all unpinned hits">Clear Unpinned</button>
            <button id="hitsClearAll" class="btn small" type="button">Clear All</button>
          </div>

          <div id="hitsCfg">
            <span>TTL h</span><input id="hitsTTL" type="number" min="0" step="1">
            <span>Max</span><input id="hitsMax" type="number" min="50" step="50">
            <button id="hitsSaveCfg" class="btn small" type="button">Save</button>
          </div>

          <div id="hitsList"></div>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    const fab = document.createElement('div');
    fab.id = 'mugFab';
    fab.textContent = '💰';
    document.body.appendChild(fab);

    // restore values
    const savedKey = localStorage.getItem(LS.apiKey) || '';
    $('#mugApi').value = savedKey;
    const savedMin = load(LS.minMug, DEF.minMug);
    $('#mugMin').value = formatCurrency(savedMin);
    $('#mugTol').value = load(LS.tolerance, DEF.tolerance);

    if (savedKey) { $('#apiRow').style.display = 'none'; $('#apiMaskRow').style.display = 'block'; }

    // Enter key → run
    ['mugApi','mugMin','mugTol'].forEach(id=>{
      const inp = document.getElementById(id);
      if (!inp) return;
      inp.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); $('#mugRunTop').click(); }});
    });
    $('#mugMin').addEventListener('blur', ()=>{ const n = parseCurrencyInput($('#mugMin').value); $('#mugMin').value = formatCurrency(n); });

    const pos = load(LS.uiPos,null);
    if(pos && pos.x!=null && pos.y!=null){
      el.style.left=pos.x+'px'; el.style.top=pos.y+'px'; el.style.right='auto';
      fab.style.left=(pos.x)+'px'; fab.style.top=(pos.y)+'px'; fab.style.right='auto';
    }

    const hidden = JSON.parse(localStorage.getItem(LS.uiHidden) || 'false');
    el.style.display = hidden ? 'none' : '';
    fab.style.display = hidden ? 'flex' : 'none';

    const runNow = (e)=>{ e?.preventDefault?.(); e?.stopPropagation?.(); run().catch(err=>console.error('[MUG] run error', err)); };
    $('#mugRunTop').addEventListener('click', runNow);
    $('#mugHide').addEventListener('click', ()=>{ el.style.display='none'; fab.style.display='flex'; localStorage.setItem(LS.uiHidden,'true'); });
    fab.addEventListener('click', ()=>{ el.style.display=''; fab.style.display='none'; localStorage.setItem(LS.uiHidden,'false'); });

    $('#saveKeyBtn').addEventListener('click', ()=>{ const key = ($('#mugApi').value||'').trim(); localStorage.setItem(LS.apiKey, key); $('#apiRow').style.display = 'none'; $('#apiMaskRow').style.display = 'block'; });
    $('#editKeyBtn').addEventListener('click', ()=>{ $('#apiMaskRow').style.display = 'none'; $('#apiRow').style.display = 'block'; setTimeout(()=>$('#mugApi').focus(), 0); });

    // Hits panel events
    $('#mugHitsBtn').addEventListener('click', ()=> showHitsPanel());
    $('#hitsClose').addEventListener('click', ()=> hideHitsPanel());
    $('#hitsSort').addEventListener('change', ()=> renderHitsPanel());
    $('#hitsList').addEventListener('click', async (e)=>{
      const btn = e.target.closest('[data-act]'); if (!btn) return;
      const row = btn.closest('.hitRow'); if (!row) return;
      const xid = row.dataset.xid;
      const h = loadHits(); const r = h[xid]; if (!r) return;
      const act = btn.dataset.act;
      if (act==='profile'){ window.open(r.profileUrl, '_blank'); }
      else if (act==='bazaar'){ window.open(r.bazaarUrl, '_blank'); }
      else if (act==='copy'){
        try { await navigator.clipboard.writeText(xid); btn.textContent='Copied'; setTimeout(() => { btn.textContent='Copy XID'; }, 900); }
        catch { prompt('Copy XID', xid); }
      }
      else if (act==='calc'){ openCalcWithAmount(Number(r.mugValue||0)); }
      else if (act==='pin'){ r.pinned = !r.pinned; saveHits(h); renderHitsPanel(); }
      else if (act==='remove'){ delete h[xid]; saveHits(h); renderHitsPanel(); }
    });
    $('#hitsExport').addEventListener('click', ()=>{
      const rows = getHitsSorted('value');
      const csv = ['xid,profileUrl,bazaarUrl,mugValue,lastAction,status,emoji,title,addedAt,updatedAt,seenCount,pinned,note'].concat(
        rows.map(r=>[
          r.xid, `"${r.profileUrl}"`, `"${r.bazaarUrl}"`, r.mugValue,
          `"${(r.lastAction||'').replace(/"/g,'""')}"`,
          `"${(r.status||'').replace(/"/g,'""')}"`,
          `"${(r.emoji||'').replace(/"/g,'""')}"`,
          `"${(r.title||'').replace(/"/g,'""')}"`,
          r.addedAt, r.updatedAt, r.seenCount||0, r.pinned?1:0, `"${(r.note||'').replace(/"/g,'""')}"`
        ].join(','))
      ).join('\n');
      const blob = new Blob([csv], {type:'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='mug_hits.csv'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 1000);
    });
    $('#hitsClearUnpinned').addEventListener('click', ()=>{ const h = loadHits(); for (const k of Object.keys(h)){ if (!h[k]?.pinned) delete h[k]; } saveHits(h); renderHitsPanel(); });
    $('#hitsClearAll').addEventListener('click', ()=>{ if (!confirm('Clear ALL hits?')) return; saveHits({}); renderHitsPanel(); });
    $('#hitsSaveCfg').addEventListener('click', ()=>{
      const ttl = Math.max(0, Number($('#hitsTTL').value||0));
      const max = Math.max(1, Number($('#hitsMax').value||0));
      localStorage.setItem(LS.hitsTTLHours, String(ttl));
      localStorage.setItem(LS.hitsMax, String(max));
      const h = pruneHits(loadHits(), { ttlHours: ttl, max });
      saveHits(h); renderHitsPanel();
    });

    dragify(el);
    dragify($('#mugHitsPanel'));

    // live color state for Run button
    updateRunBtnColor();
    setInterval(updateRunBtnColor, 2000);

    updateHitsCountBtn();
  }

  makeUI();

  // Auto-show saved results on load (no API)
  if (JSON.parse(localStorage.getItem(LS.autoShowSaved) || 'true')) {
    setTimeout(renderFromSaved, 0);
  }

  // ---------- Hits panel UI helpers ----------
  function updateHitsCountBtn(){
    const n = hitsCount();
    const b = $('#mugHitsBtn'); if (b) b.textContent = lastRunHitsDelta > 0 ? `Hits (${n} +${lastRunHitsDelta})` : `Hits (${n})`;
    const h = $('#hitsHdrCount'); if (h) h.textContent = `— ${n}`;
  }
  function showHitsPanel(){ renderHitsPanel(); $('#mugHitsPanel').style.display='block'; }
  function hideHitsPanel(){ $('#mugHitsPanel').style.display='none'; }

  function renderHitsPanel(){
    const ttl = Number(localStorage.getItem(LS.hitsTTLHours)) || HITS_DEF.ttlHours;
    const max = Number(localStorage.getItem(LS.hitsMax)) || HITS_DEF.max;
    $('#hitsTTL').value = String(ttl);
    $('#hitsMax').value = String(max);

    const sort = ($('#hitsSort')?.value)||'value';
    const list = getHitsSorted(sort);
    const cont = $('#hitsList'); cont.innerHTML = '';

    for (const r of list){
      const em = r.emoji || inferEmojiFromHit(r) || '💰';
      const row = document.createElement('div'); row.className = 'hitRow'; row.dataset.xid = r.xid;
      const main = document.createElement('div'); main.className = 'hitMain';
      main.innerHTML = `
        <div><span class="em">${em}</span><span class="val">$${Number(r.mugValue||0).toLocaleString()}</span> • XID ${r.xid}</div>
        <div class="hitMeta">${r.lastAction || '—'}${r.title ? ` • ${r.title}` : ''} • ${timeAgo(r.updatedAt)}${r.pinned ? ' • 📌' : ''}</div>
      `;
      const actions = document.createElement('div'); actions.className = 'hitActions';
      actions.innerHTML = `
        <button class="btn" data-act="profile">Profile</button>
        <button class="btn" data-act="bazaar">Bazaar</button>
        <button class="btn" data-act="copy">Copy XID</button>
        <button class="btn" data-act="calc">Calc</button>
        <button class="btn" data-act="pin">${r.pinned ? 'Unpin' : 'Pin'}</button>
        <button class="btn" data-act="remove">Remove</button>
      `;
      row.appendChild(main); row.appendChild(actions); cont.appendChild(row);
    }
    updateHitsCountBtn();
  }

  // ---------- Calculator show/hide helpers ----------
  function showCalc(){
    const ui = document.getElementById('mugCalcUI');
    const fab = document.getElementById('mugCalcFab');
    if (!ui || !fab) return;
    ui.style.display = 'block';
    fab.style.display = 'none';
    localStorage.setItem(LS.calcHidden, 'false');
  }
  function hideCalc(){
    const ui = document.getElementById('mugCalcUI');
    const fab = document.getElementById('mugCalcFab');
    if (!ui || !fab) return;
    ui.style.display = 'none';
    fab.style.display = 'flex';
    localStorage.setItem(LS.calcHidden, 'true');
  }

  // ---------- Calculator: UI + logic (Minimum/Typical/High) ----------
  function buildCalcUI(){
    if ($('#mugCalcUI')) return;

    const ui = document.createElement('div');
    ui.id = 'mugCalcUI';
    ui.innerHTML = `
      <div class="hdr">
        <div class="title">Quick Mug Return</div>
        <div style="display:flex; gap:6px">
          <button id="mugCalcHide" class="btn small" type="button">Hide</button>
        </div>
      </div>

      <div class="row">
        <label>Target Wallet
          <input id="mcWallet" type="text" placeholder="$50,000,000">
        </label>
        <label>Merits (ML 0–10)
          <input id="mcMerits" type="number" min="0" max="10" step="1" value="0">
        </label>
      </div>

      <div class="row">
        <label>Plunder Bonus %
          <input id="mcPlunder" type="number" min="0" max="100" step="1" value="0">
        </label>
        <div></div>
      </div>

      <div class="results">
        <div class="card">
          <div class="kpi"><span class="lbl">Minimum (guaranteed, base 5%)</span><span class="val" id="mcMin">$0</span></div>
          <div class="fine" id="mcMinBreak"></div>
        </div>
        <div class="row2">
          <div class="card">
            <div class="kpi"><span class="lbl">Typical (base 6%)</span><span class="val" id="mcTyp">$0</span></div>
            <div class="fine" id="mcTypBreak"></div>
          </div>
          <div class="card">
            <div class="kpi"><span class="lbl">High (base 10%)</span><span class="val" id="mcMax">$0</span></div>
            <div class="fine" id="mcMaxBreak"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(ui);

    // Knife FAB
    const fab = document.createElement('div');
    fab.id = 'mugCalcFab';
    fab.textContent = '🔪';
    document.body.appendChild(fab);

    // Restore position
    const pos = load(LS.calcPos, null);
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      ui.style.left = pos.x + 'px';
      ui.style.top = pos.y + 'px';
      ui.style.right = 'auto';
      fab.style.left = pos.x + 'px';
      fab.style.top = pos.y + 'px';
      fab.style.right = 'auto';
    }

    // Restore hidden
    const hidden = load(LS.calcHidden, true) === true;
    if (hidden) hideCalc(); else showCalc();

    // Hide/show buttons
    document.getElementById('mugCalcHide').addEventListener('click', hideCalc);
    fab.addEventListener('click', showCalc);

    // Enter-to-calc
    function applyOnEnter(e){
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (e.target && e.target.id === 'mcWallet'){
        const n = parseCurrencyInput($('#mcWallet').value);
        $('#mcWallet').value = n ? formatCurrency(n) : '';
      }
      persistInputs(); calcUpdate();
    }
    $$('#mugCalcUI input, #mugCalcUI select').forEach(el => el.addEventListener('keydown', applyOnEnter));

    // Pretty-format wallet on blur
    $('#mcWallet').addEventListener('blur', ()=>{
      const n = parseCurrencyInput($('#mcWallet').value);
      $('#mcWallet').value = n ? formatCurrency(n) : '';
      persistInputs(); calcUpdate();
    });

    // Inputs -> update
    ['mcMerits','mcPlunder'].forEach(id=>{
      $('#'+id).addEventListener('input', ()=>{ persistInputs(); calcUpdate(); });
      $('#'+id).addEventListener('change', ()=>{ persistInputs(); calcUpdate(); });
    });

    // Load previous inputs
    const prev = load(LS.calcInputs, null);
    if (prev){
      if (prev.wallet) $('#mcWallet').value = formatCurrency(prev.wallet);
      if (Number.isFinite(prev.merits)) $('#mcMerits').value = prev.merits;
      if (Number.isFinite(prev.plunder)) $('#mcPlunder').value = prev.plunder;
    }

    dragifyWithKey(ui, LS.calcPos);
    calcUpdate();

    function persistInputs(){
      const data = {
        wallet: parseCurrencyInput($('#mcWallet').value),
        merits: Number($('#mcMerits').value||0),
        plunder: Number($('#mcPlunder').value||0),
      };
      save(LS.calcInputs, data);
    }

    function calcPct(basePct, merits, plunderPct){
      const mlPct = 5 * Math.max(0, Math.min(10, Number(merits)||0)); // ML as %
      const plPct = Math.max(0, Math.min(100, Number(plunderPct)||0)); // Plunder as %
      return basePct * (1 + mlPct/100 + plPct/100); // ADDITIVE model
    }

    function calcUpdate(){
      const wallet = parseCurrencyInput($('#mcWallet').value);
      const merits = Number($('#mcMerits').value||0);
      const plunder = Number($('#mcPlunder').value||0);

      const pctMin = calcPct(5, merits, plunder);
      const pctTyp = calcPct(6, merits, plunder);
      const pctMax = calcPct(10, merits, plunder);

      const minAmt = Math.round(wallet * (pctMin/100));
      const typAmt = Math.round(wallet * (pctTyp/100));
      const maxAmt = Math.round(wallet * (pctMax/100));

      $('#mcMin').textContent = formatCurrency(minAmt);
      $('#mcTyp').textContent = formatCurrency(typAmt);
      $('#mcMax').textContent = formatCurrency(maxAmt);

      const mlPct = 5 * Math.max(0, Math.min(10, merits));
      const line = (base)=> `= ${formatCurrency(wallet)} × (${base}% × (1 + ${mlPct}% + ${plunder}%))`;
      $('#mcMinBreak').textContent = line(5);
      $('#mcTypBreak').textContent = line(6);
      $('#mcMaxBreak').textContent = line(10);
    }

    // expose for hits "Calc" button
    window.__openCalcWithAmount = openCalcWithAmount;
  }

  function openCalcWithAmount(amount){
    buildCalcUI();
    showCalc();
    $('#mcWallet').value = formatCurrency(Number(amount)||0);
    const evt = new KeyboardEvent('keydown', {key:'Enter'});
    $('#mcWallet').dispatchEvent(evt);
  }

  // build calculator (lazy-visible)
  buildCalcUI();

  // keep Run button color fresh
  setInterval(updateRunBtnColor, 2000);

})();
// ==UserScript==
// @name         AutoReels — autoplay Facebook Reels
// @namespace    auto.reels.dir.toggle
// @version      1.8.41.1
// @description  Autoplay Facebook reels with direction toggle, pause/resume/stop, progress, scan counter
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        https://m.facebook.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553718/AutoReels%20%E2%80%94%20autoplay%20Facebook%20Reels.user.js
// @updateURL https://update.greasyfork.org/scripts/553718/AutoReels%20%E2%80%94%20autoplay%20Facebook%20Reels.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===================== Debug Console ===================== */
  (function () {
    const LS_KEY = 'AutoReels:DebugEnabled';
    const LS_STICKY = 'AutoReels:DebugSticky';
    const css = `
    .ar-debug-root{position:fixed;z-index:2147483647;right:12px;bottom:12px;width:420px;max-height:45vh;display:flex;flex-direction:column;background:#0f172a;
      color:#e5e7eb;border:1px solid #334155;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.35);font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;overflow:hidden}
    .ar-debug-header{display:flex;align-items:center;gap:8px;background:#111827;padding:8px 10px;border-bottom:1px solid #334155}
    .ar-debug-header .title{font-weight:600;letter-spacing:.2px}
    .ar-debug-header .sp{flex:1}
    .ar-debug-btn{cursor:pointer;border:1px solid #475569;background:#1f2937;color:#e5e7eb;padding:4px 8px;border-radius:6px;user-select:none}
    .ar-debug-btn:hover{background:#243244}
    .ar-debug-body{overflow:auto;padding:8px 10px}
    .ar-debug-row{display:flex;gap:8px;align-items:flex-start;padding:4px 0;border-bottom:1px dashed #1f2937}
    .ar-debug-ts{opacity:.7;min-width:92px}
    .ar-debug-tag{font-weight:700;padding:1px 6px;border-radius:999px;background:#334155;color:#d1d5db}
    .ar-debug-tag.INFO{background:#1e3a8a}
    .ar-debug-tag.WARN{background:#a16207}
    .ar-debug-tag.ERROR{background:#7f1d1d}
    .ar-debug-msg{white-space:pre-wrap;word-break:break-word;flex:1}
    .ar-debug-collapsed .ar-debug-body{display:none}
    .ar-debug-footer{display:flex;gap:8px;padding:8px 10px;border-top:1px solid #334155;background:#0b1220}
    .ar-debug-chip{font-size:11px;border:1px solid #475569;border-radius:999px;padding:2px 8px;opacity:.9}
    `;
    function fmtTime(d=new Date()){ const p=n=>String(n).padStart(2,'0'); return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3,'0')}`; }
    function el(tag, props={}, ...children){ const e=document.createElement(tag); Object.assign(e, props); children.forEach(c=>{ if(c==null)return; if(typeof c==='string') e.appendChild(document.createTextNode(c)); else e.appendChild(c); }); return e; }
    function safeStringify(v){ try{ return JSON.stringify(v, (_k,val)=>{ if(val instanceof Node) return `<${val.nodeName.toLowerCase()}>`; if(typeof val==='function') return '[fn]'; return val; }, 2);}catch{ return String(v);} }

    class ARDebugConsole{
      constructor(){ this.enabled=JSON.parse(localStorage.getItem(LS_KEY)||'false'); this.sticky=JSON.parse(localStorage.getItem(LS_STICKY)||'true'); this._groupDepth=0; this._ensureUI(); this._renderState(); this._bindHotkeys(); if(!this.enabled) this.root.style.display='none'; }
      _ensureUI(){
        const style=el('style',{textContent:css}); document.documentElement.appendChild(style);
        const header=el('div',{className:'ar-debug-header'},
          el('span',{className:'title'},'AutoReels Debug'), el('span',{className:'sp'}),
          this.stickyBtn=el('button',{className:'ar-debug-btn',title:'Stick logs across page nav'},'Sticky'),
          this.collapseBtn=el('button',{className:'ar-debug-btn',title:'Collapse / expand'},'Collapse'),
          this.clearBtn=el('button',{className:'ar-debug-btn',title:'Clear logs'},'Clear'),
          this.hideBtn=el('button',{className:'ar-debug-btn',title:'Hide (Ctrl+`)'},'Hide'));
        const body=this.body=el('div',{className:'ar-debug-body'});
        const footer=el('div',{className:'ar-debug-footer'}, this.stateChip=el('span',{className:'ar-debug-chip'},'state: idle'));
        const root=this.root=el('div',{className:'ar-debug-root'}, header, body, footer);
        document.body.appendChild(root);
        this.collapseBtn.addEventListener('click',()=>{ this.root.classList.toggle('ar-debug-collapsed'); });
        this.clearBtn.addEventListener('click',()=>this.clear());
        this.hideBtn.addEventListener('click',()=>this.setEnabled(false));
        this.stickyBtn.addEventListener('click',()=>this.setSticky(!this.sticky));
      }
      _bindHotkeys(){ window.addEventListener('keydown',(e)=>{ if(e.ctrlKey && e.key==='`'){ this.setEnabled(!this.enabled);} },true); }
      _renderState(){ this.stickyBtn.style.opacity=this.sticky?'1':'.6'; this.stateChip.textContent=`state: ${this._state||'idle'}`; }
      setState(s){ this._state=s; this._renderState(); }
      setSticky(v){ this.sticky=!!v; localStorage.setItem(LS_STICKY, JSON.stringify(this.sticky)); this._renderState(); this.info('Sticky',{sticky:this.sticky}); }
      setEnabled(v){ this.enabled=!!v; localStorage.setItem(LS_KEY, JSON.stringify(this.enabled)); this.root.style.display=this.enabled?'flex':'none'; if(this.enabled) this.info('Debug enabled'); }
      isEnabled(){ return !!this.enabled; }
      attachToButton(btn){ if(!btn) return; const sync=()=> btn.ariaPressed=String(this.enabled); btn.addEventListener('click',()=>{ this.setEnabled(!this.enabled); sync(); }); sync(); }
      clear(){ this.body.textContent=''; }
      _row(level, tag, msg, data){
        const row = el('div',{className:'ar-debug-row'});
        const ts=el('span',{className:'ar-debug-ts'},fmtTime());
        const badge=el('span',{className:`ar-debug-tag ${tag}`},tag);
        const indent=this._groupDepth?'│  '.repeat(this._groupDepth):'';
        const body=el('div',{className:'ar-debug-msg'});
        body.appendChild(document.createTextNode(`${indent}${msg||''}`));
        if(data!==undefined){
          const pre=el('pre',{style:'margin:4px 0 0;white-space:pre-wrap;'});
          pre.textContent=safeStringify(data);
          body.appendChild(pre);
        }
        row.append(ts, badge, body);
        this.body.appendChild(row);
        this.body.scrollTop=this.body.scrollHeight;
        try{ (console[level]||console.log).call(console, `[AR][${tag}] ${msg}`, data);}catch{}
      }
      log(m,d){this._row('log','LOG',m,d);} info(m,d){this._row('info','INFO',m,d);} warn(m,d){this._row('warn','WARN',m,d);} error(m,d){this._row('error','ERROR',m,d);}
      group(m){this._row('log','LOG',m); this._groupDepth++;} groupEnd(){ if(this._groupDepth>0) this._groupDepth--; }
      logCompare(p){ this._row('info','INFO','Compare reel IDs', p); }
      logRetry(p){ this._row('warn','WARN','Retry', p); }
      logAdvance(p){ this._row('info','INFO','Advance', p); }
      logDecision(p){ this._row(p?.canAdvance?'info':'warn', p?.canAdvance?'INFO':'WARN', 'Advance decision', p); }
    }
    window.ARDebug = new ARDebugConsole();
  })();

  /* ===================== SPA URL hook ===================== */
  const URL_EVT = 'ar-urlchange';
  (function hookHistory(){
    const _ps = history.pushState, _rs = history.replaceState;
    function fire(){ window.dispatchEvent(new Event(URL_EVT)); }
    history.pushState   = function(){ const r=_ps.apply(this, arguments); fire(); return r; };
    history.replaceState= function(){ const r=_rs.apply(this, arguments); fire(); return r; };
    window.addEventListener('popstate', fire, true);
  })();

  /* ===================== tiny utils ===================== */
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  const onReel = ()=> /\/reel\/\d+\/?$/.test(location.pathname);

  // --- normalized paths/signatures ---
  const normalizePath = (p)=> (p||'/').replace(/[?#].*$/,'').replace(/\/+$/,'').replace(/^$/,'/');
  const inferGridPathFromReel = (p)=> normalizePath((p||location.pathname).replace(/\/reel\/\d+\/?$/, '/reels'));
  const urlId  = ()=>{ const m=location.pathname.match(/\/reel\/(\d+)/); return m?m[1]:null; };
  const allVids= ()=> Array.from(document.querySelectorAll('video'));
  const fmtTime = s => { if(!isFinite(s)||s<0) return '00:00'; s=Math.floor(s); const m=Math.floor(s/60), ss=(s%60+'').padStart(2,'0'); return `${m}:${ss}`; };
  const clamp01 = (x)=> Math.max(0, Math.min(1, x));

  // --- profile reels tab helpers & signatures ---
  function isProfileReelsTab(u = location) {
    try {
      const sp = new URLSearchParams(u.search || '');
      return normalizePath(u.pathname) === '/profile.php' && sp.get('sk') === 'reels_tab' && !!sp.get('id');
    } catch { return false; }
  }
  function gridSignatureFromURL(u = location) {
    try {
      const path = normalizePath(u.pathname);
      if (path === '/profile.php') {
        const sp = new URLSearchParams(u.search || '');
        if (sp.get('sk') === 'reels_tab' && sp.get('id')) {
          return `/profile:${sp.get('id')}/reels`;
        }
      }
      if (/^\/[^/]+\/reels\/?$/.test(path)) return path;
      if (/^\/reels\/?$/.test(path)) return '/reels';
    } catch {}
    return null;
  }

  // Grid detection (supports profile.php reels tab)
  const onGrid = () => {
    if (isProfileReelsTab()) return true;
    const p = normalizePath(location.pathname);
    return /^\/reels\/?$/.test(p) || /^\/[^/]+\/reels$/.test(p);
  };

  /* ===================== persistence helpers ===================== */
  function saveStr(k,v){ try{ localStorage.setItem(k,v);}catch{} }
  function loadStr(k,def){ try{ const v=localStorage.getItem(k); return v==null?def:v;}catch{ return def; } }
  function saveInt(k,v){ try{ localStorage.setItem(k,String(v|0));}catch{} }
  function loadInt(k,def){ try{ const v=localStorage.getItem(k); return v==null?def:(parseInt(v,10)||def);}catch{ return def; } }
  function saveBool(k,v){ saveStr(k, v?'1':'0'); }
  function loadBool(k,def){ const v=loadStr(k,null); if(v===null) return def; return v==='1'; }

  const LS_LAST_GRID_PATH = 'AR_LAST_GRID_PATH';
  const gridKey = (sig) => `AR_QUEUE:${sig || '/'}`;

  function saveGridPath(sig){
    if (!sig) return;
    saveStr(LS_LAST_GRID_PATH, sig);
    window.ARDebug?.info?.('Saved grid signature', { sig });
  }
  function loadGridPath(){
    const sig = loadStr(LS_LAST_GRID_PATH, '') || '';
    return sig || null;
  }

  // legacy quick check (still used in a couple of guards)
  const idsDiffer = (beforeId)=>{ const now=urlId(); return !!(beforeId && now && now!==beforeId); };

  /* ===================== config ===================== */
  const ADV_WAIT_MS = 3000;
  const VERIFY_STABLE_MS = 800;
  const MIN_ADVANCE_GAP_MS = 2500;

  const POST_END_RETRY_WAVES = 3;
  const POST_END_RETRY_TRIES_PER_WAVE = 6;
  const POST_END_RETRY_DELAY_MS = 250;
  const POST_END_GUARD_PAUSE_MS = 600;
  const POST_END_INITIAL_RETRY_DELAY_MS = 3000;

  let   MAX_GRID_SCROLLS = loadInt('AR_SCAN_DEPTH', 30);
  const GRID_SCROLL_DELAY = 900;

  /* ===================== state ===================== */
  let STOP=false, PAUSED=false;
  let ADVANCING=false, lastAdvanceAt=0;
  let _pauseResolver=null;
  let _progRAF=null, _lastT=0, _stallMs=0;

  let ADV_DIR = loadStr('AR_ADV_DIR', 'down'); // 'down' | 'up'
  let DIR_VER = 0; // increments each direction change

  // Pause mode: 'loop' (pause loop only) | 'media' (pause loop + pause video)
  const LS_PAUSE_MODE='AR_PAUSE_MODE';
  let PAUSE_MODE = loadStr(LS_PAUSE_MODE,'loop');

  // Audio
  let USER_MUTED_PREF = loadBool('AR_MUTED_PREF', false);
  let USER_VOLUME     = clamp01(parseFloat(loadStr('AR_VOLUME', '1')) || 1);

  // signature binding + in-memory cache
  let CURRENT_GRID_PATH = null; // signature string
  let ACTIVE_QUEUE = null; // { path(sig), ids, ts }

  // guard & sequencing
  let ADVANCE_SEQ_ACTIVE = false;
  let ADVANCE_SOURCE_ID = null;
  let LAST_ADVANCED_FROM_ID = null;

  // --- singleton run loop + cooldown ---
  let RUN_GEN = 0;              // increases whenever we "restart" the loop
  let RUN_ACTIVE = 0;           // the gen for the currently running loop
  let BOOT_TIMER = null;        // debounce bootRunSoon calls
  let nextAdvanceAllowedAt = 0; // global cooldown timestamp
  const ADV_COOLDOWN_MS = 1200; // small guard to absorb router-settle + stray events

  // --- baseline while waiting ---
  let BASELINE_WAIT_ID = null;
  let BASELINE_WAIT_VIDEO = null;

  // --- End→Advance hold: hard-pause media until next reel is confirmed ---
  let HOLD_MEDIA = false;

  /* ===================== FSM (authoritative state) + Idle watchdog ===================== */
  const FSM_KEY = 'AR_FSM_STATE';
  const FSM = Object.freeze({ IDLE:'IDLE', GRID:'GRID', PLAYING:'PLAYING', ADVANCING:'ADVANCING', PAUSED:'PAUSED', STOPPED:'STOPPED', SCANNING:'SCANNING' });
  let FSM_STATE = (loadStr(FSM_KEY, FSM.IDLE) in FSM) ? loadStr(FSM_KEY, FSM.IDLE) : FSM.IDLE;
  let _watchdogTimer = null;

  function setFSM(next, reason){
    if(!FSM[next]) next = FSM.IDLE;
    const prev = FSM_STATE;
    FSM_STATE = next;
    saveStr(FSM_KEY, next);
    window.ARDebug?.setState?.(next.toLowerCase());
    if(reason) window.ARDebug?.info?.('FSM transition', { from: prev, to: next, reason });
  }

  function startWatchdog(){
    stopWatchdog();
    _watchdogTimer = setInterval(async ()=>{
      try{
        if (STOP) return;

        const gridBadge = document.getElementById('ar-gridbadge');

        // If we're on the grid: ensure badge exists + is visible
        if (onGrid()){
          if (!gridBadge) { mountGridBadge(); }
          else { gridBadge.style.display = ''; } // show
          if (FSM_STATE!==FSM.GRID && !PAUSED) setFSM(FSM.GRID,'watchdog grid');
          return;
        }

        // If we're on a reel: hide the grid badge
        if (onReel()){
          if (gridBadge) gridBadge.style.display = 'none';

          // revive controls / playback if needed
          const panel = document.getElementById('ar-controls');
          const needRevive = !panel || FSM_STATE===FSM.IDLE || FSM_STATE===FSM.STOPPED;
          if (needRevive){
            mountControls();
            setFSM(PAUSED ? FSM.PAUSED : FSM.PLAYING, 'watchdog revive controls');
          }
          const v = getForegroundVideo();
          if (v){
            if (!_progRAF){ startProgress(); }
            if (!PAUSED && FSM_STATE!==FSM.PLAYING && FSM_STATE!==FSM.ADVANCING){
              setFSM(FSM.PLAYING,'watchdog playing');
            }
          }
          return;
        }

        // Neither grid nor reel: hide badge and set IDLE
        if (gridBadge) gridBadge.style.display = 'none';
        if (FSM_STATE!==FSM.IDLE && !PAUSED) setFSM(FSM.IDLE,'watchdog other');

      } catch(err){
        /* swallow watchdog errors */
      }
    }, 2000);
  }
  function stopWatchdog(){ if(_watchdogTimer){ clearInterval(_watchdogTimer); _watchdogTimer=null; } }

  /* ===================== pause gate ===================== */
  function pauseGate(){ if(!PAUSED) return Promise.resolve(); return new Promise(res=>{ _pauseResolver=res; }); }

  function getForegroundVideo(){
    const candidates=allVids().filter(v=>v.offsetParent!==null);
    const inView=candidates.filter(v=>{ const r=v.getBoundingClientRect(); return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth; });
    for(const v of inView){
      const r=v.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
      if(x>=0&&y>=0&&x<=innerWidth&&y<=innerHeight){
        const stack=document.elementsFromPoint(x,y); if(stack && stack.includes(v)) return v;
      }
    }
    let best=null,area=-1;
    for(const v of inView){
      const r=v.getBoundingClientRect();
      const x1=Math.max(0,Math.min(innerWidth,r.left)), y1=Math.max(0,Math.min(innerHeight,r.top));
      const x2=Math.max(0,Math.min(innerWidth,r.right)), y2=Math.max(0,Math.min(innerHeight,r.bottom));
      const a=Math.max(0,x2-x1)*Math.max(0,y2-y1); if(a>area){ area=a; best=v; }
    }
    return best||candidates[0]||null;
  }

  function setPaused(val){
    PAUSED=val;
    setFSM(val ? FSM.PAUSED : FSM.PLAYING, val ? 'user paused' : 'user resumed');
    window.ARDebug?.info?.(val ? 'Paused by user' : 'Resumed by user', { mode: PAUSE_MODE });

    // Loop gate behavior
    if (!PAUSED && _pauseResolver){ _pauseResolver(); _pauseResolver=null; }

    // Media pause behavior (optional)
    const v = getForegroundVideo();
    if (PAUSE_MODE === 'media') {
      if (PAUSED) { try{ v && v.pause(); }catch{} }
      else { try{ v && v.play && v.play(); }catch{} }
    }

    updateUI();
  }

  /* ===================== styles & controls ===================== */
  function ensureStyles(){
    if (document.getElementById('ar-style')) return;
    const style=document.createElement('style'); style.id='ar-style';
    style.textContent=`
      :root{
        --ar-bg:#0b1220; --ar-fg:#f2f5ff; --ar-sub:#b9c2d0; --ar-border:#21304a; --ar-shadow:0 6px 20px rgba(0,0,0,.35);
        --ar-btn-bg:#1b2a46; --ar-btn-fg:#e8eeff; --ar-btn-hover:#253a62;
        --ar-stop:#e5484d; --ar-stop-hover:#c0353a;
        --ar-pause:#f5a524; --ar-pause-hover:#d28918;
        --ar-play:#2bb673; --ar-play-hover:#21995f;
        --ar-track:#24314d; --ar-fill:#4da3ff; --ar-fill2:#2bb673;
        --ar-input-bg:#0e1a30; --ar-input-fg:#e8eeff; --ar-input-border:#21304a;
        --ar-grid-top: 72px; --ar-scan-height: 40px; --ar-gap: 12px;
      }
      @media (prefers-color-scheme: light){
        :root{
          --ar-bg:#fff; --ar-fg:#0f172a; --ar-sub:#475569; --ar-border:#e2e8f0; --ar-shadow:0 6px 18px rgba(2,6,23,.12);
          --ar-btn-bg:#f1f5f9; --ar-btn-fg:#0f172a; --ar-btn-hover:#e2e8f0;
          --ar-stop:#dc2626; --ar-stop-hover:#b91c1c;
          --ar-pause:#d97706; --ar-pause-hover:#b45309;
          --ar-play:#16a34a; --ar-play-hover:#15803d;
          --ar-track:#e5e7eb; --ar-fill:#3b82f6; --ar-fill2:#16a34a;
          --ar-input-bg:#fff; --ar-input-fg:#0f172a; --ar-input-border:#cbd5e1;
        }
      }

      /* Collapsible helpers */
      .ar-collapsed .ar-collapsible{ display:none !important; }
      .ar-caret{ display:inline-block; transform:rotate(0deg); transition:transform .15s ease; }
      .ar-collapsed .ar-caret{ transform:rotate(-90deg); }

      #ar-controls{ position:fixed; top:calc(var(--ar-grid-top) + var(--ar-scan-height) + var(--ar-gap)); right:12px; z-index:2147483647;
        display:flex; flex-direction:column; gap:8px; padding:10px 12px; background:var(--ar-bg); color:var(--ar-fg);
        border:1px solid var(--ar-border); border-radius:12px; box-shadow:var(--ar-shadow); width:min(500px, 92vw);
        font:13px system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Arial; }
      #ar-toprow{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
      #ar-status{ margin-right:auto; color:var(--ar-sub); user-select:none; }
      #ar-count{ color:var(--ar-sub); user-select:none; }
      #ar-dir{ color:var(--ar-sub); user-select:none; font-size:15px; }
      #ar-ctrlrow{ display:flex; gap:8px; flex-wrap:wrap; margin-top:6px; }
      .ar-btn{ appearance:none; border:1px solid var(--ar-border); background:var(--ar-btn-bg); color:var(--ar-btn-fg);
        padding:6px 10px; border-radius:10px; cursor:pointer; line-height:1; display:inline-flex; align-items:center; gap:6px; font-weight:600;
        transition:background .15s ease, transform .05s ease; }
      .ar-btn:hover{ background:var(--ar-btn-hover);} .ar-btn:active{ transform:translateY(1px); }
      .ar-btn.ar-stop{ background:var(--ar-stop); border-color:transparent; color:#fff; }
      .ar-btn.ar-stop:hover{ background:var(--ar-stop-hover); }
      .ar-btn.ar-pause{ background:var(--ar-pause); border-color:transparent; color:#0b0b0b; }
      .ar-btn.ar-play{ background:var(--ar-play); border-color:transparent; color:#0b0b0b; }
      .ar-btn.ar-play:hover{ background:var(--ar-play-hover); }
      .ar-ico{ font-size:14px; }
      .ar-row{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
      .ar-field{ display:flex; align-items:center; gap:8px; padding:6px 8px; background:transparent; border:1px dashed var(--ar-border); border-radius:10px; }
      .ar-label{ color:var(--ar-sub); font-weight:600; }
      .ar-input{ width:100px; padding:6px 8px; border:1px solid var(--ar-input-border); border-radius:8px; background:var(--ar-input-bg); color:var(--ar-input-fg); outline:none; }
      .ar-input:focus{ box-shadow:0 0 0 3px rgba(77,163,255,.25); }

      #ar-progress{ display:flex; flex-direction:column; gap:6px; }
      #ar-track{ position:relative; height:8px; border-radius:999px; background:var(--ar-track); overflow:hidden; border:1px solid var(--ar-border); }
      #ar-fill{ position:absolute; inset:0 auto 0 0; width:0%; background:linear-gradient(90deg, var(--ar-fill), var(--ar-fill2)); border-radius:999px; transition: width .12s linear; }
      #ar-time{ display:flex; justify-content:space-between; align-items:center; color:var(--ar-sub); font-variant-numeric: tabular-nums; }
      #ar-stall{ width:8px; height:8px; border-radius:50%; background:#00d084; box-shadow:0 0 0 2px rgba(0,0,0,.1) inset; }
      #ar-stall.stalled{ background:#e11d48; }
      #ar-title{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:160px; }

      /* Advance notice inside panel (status variants) */
      #ar-advance{
        display:none; align-items:center; gap:8px;
        margin-top:6px; padding:8px 10px;
        background:var(--ar-btn-bg); color:var(--ar-btn-fg); font-weight:700;
        border-radius:10px; border:1px solid var(--ar-border);
        box-shadow:var(--ar-shadow);
        transition: opacity .25s ease;
      }
      #ar-advance.show{ display:flex; opacity:1; }
      #ar-advance.fade{ opacity:0; }
      #ar-advance .ar-ico{ font-size:14px; }
      #ar-advance.info { background: var(--ar-fill); color:#0b0b0b; }
      #ar-advance.warn { background: var(--ar-pause); color:#0b0b0b; }
      #ar-advance.success { background: var(--ar-play); color:#0b0b0b; }
      #ar-advance.error { background: var(--ar-stop); color:#fff; border-color: transparent; }

      /* Grid badge fixed top-right (collapsible) */
      #ar-gridbadge{ position:fixed; top:var(--ar-grid-top); right:12px; z-index:2147483647; display:flex; flex-direction:column; gap:8px; min-width:260px; }
      #ar-gridbadge .row{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
      #ar-gridbadge .ar-btn{ background:var(--ar-play); color:#0b0b0b; border-color:transparent; }
      #ar-gridbadge .ar-btn.ar-stop{ background:var(--ar-stop)!important; color:#fff!important; }
    `;
    document.head.appendChild(style);
  }

  function exitReel(){
    const fireEsc = ()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));
    fireEsc(); setTimeout(fireEsc,120); setTimeout(fireEsc,240);
    setTimeout(()=>{ if(onReel()){ try{ history.back(); }catch{} } },600);
    setTimeout(()=>{ if(onReel()){ try{ location.href = inferGridPathFromReel(location.pathname); }catch{} } },1400);
  }

  /* ===================== advance status helpers ===================== */
  let advanceFadeTimer=null, advanceHideTimer=null;
  function ensureAdvancePanel(){
    const panel = document.getElementById('ar-controls'); if(!panel) return null;
    let n = document.getElementById('ar-advance');
    if(!n){
      n = document.createElement('div'); n.id='ar-advance';
      n.innerHTML = `<span class="ar-ico">➡️</span><span class="ar-msg"></span>`;
      panel.appendChild(n);
    }
    return n;
  }
  function setAdvanceStatus(kind, text){
    const n = ensureAdvancePanel(); if(!n) return;
    clearTimeout(advanceFadeTimer); clearTimeout(advanceHideTimer);
    n.classList.remove('fade','info','warn','success','error');
    if (kind) n.classList.add(kind);
    n.querySelector('.ar-msg').textContent = text || '';
    n.classList.add('show');
  }
  function fadeAdvanceSoon(kind, text, fadeDelay=700, hideDelay=1200){
    setAdvanceStatus(kind, text);
    const n = document.getElementById('ar-advance'); if(!n) return;
    advanceFadeTimer = setTimeout(()=>{ n.classList.add('fade'); }, fadeDelay);
    advanceHideTimer = setTimeout(()=>{ n.classList.remove('show','fade'); }, hideDelay);
  }
  function hideAdvanceNow(){
    const n = document.getElementById('ar-advance'); if(!n) return;
    clearTimeout(advanceFadeTimer); clearTimeout(advanceHideTimer);
    n.classList.remove('show','fade','info','warn','success','error');
  }

  /* ===================== controls ===================== */
  const LS_CONTROLS_COLLAPSED = 'AR_CONTROLS_COLLAPSED';
  const LS_GRID_COLLAPSED = 'AR_GRID_COLLAPSED';

  function dirArrow(){ return ADV_DIR==='down'?'↓':'↑'; }

  function mountControls(){
    ensureStyles();
    let panel=document.getElementById('ar-controls'); if(panel) return panel;

    panel=document.createElement('div'); panel.id='ar-controls'; panel.role='group'; panel.ariaLabel='AutoReels Controls';

    const top=document.createElement('div'); top.id='ar-toprow';
    const caret=document.createElement('button'); caret.type='button'; caret.className='ar-btn'; caret.title='Collapse / expand controls';
    caret.innerHTML='<span class="ar-caret">▾</span>';
    const status=document.createElement('span'); status.id='ar-status'; status.textContent='Status: Ready';
    const count=document.createElement('span'); count.id='ar-count'; count.textContent='—';
    const dirLabel=document.createElement('span'); dirLabel.id='ar-dir'; dirLabel.textContent=dirArrow();
    const toggleDirBtn=document.createElement('button'); toggleDirBtn.type='button'; toggleDirBtn.id='ar-toggle-dir'; toggleDirBtn.className='ar-btn';
    toggleDirBtn.textContent='Toggle'; toggleDirBtn.title='Toggle advance direction (Shift+D)';
    toggleDirBtn.onclick=()=>{
      ADV_DIR=(ADV_DIR==='down'?'up':'down');
      DIR_VER++;
      BASELINE_WAIT_ID=null; BASELINE_WAIT_VIDEO=null;
      saveStr('AR_ADV_DIR', ADV_DIR);
      dirLabel.textContent=dirArrow();
      updateCountUI();
      window.ARDebug?.info?.('Direction toggled',{dir:ADV_DIR, dirVer:DIR_VER});
    };
    top.append(caret, status, count, dirLabel, toggleDirBtn);

    const body=document.createElement('div'); body.className='ar-collapsible';

    const ctrlRow=document.createElement('div'); ctrlRow.id='ar-ctrlrow';
    const pauseBtn=document.createElement('button'); pauseBtn.type='button'; pauseBtn.id='ar-pause'; pauseBtn.className='ar-btn ar-pause';
    pauseBtn.innerHTML='<span class="ar-ico">⏸</span><span>Pause</span>'; pauseBtn.onclick=()=>setPaused(true);

    const resumeBtn=document.createElement('button'); resumeBtn.type='button'; resumeBtn.id='ar-resume'; resumeBtn.className='ar-btn ar-play';
    resumeBtn.innerHTML='<span class="ar-ico">▶</span><span>Resume</span>'; resumeBtn.onclick=()=>setPaused(false);

    const stopBtn=document.createElement('button'); stopBtn.type='button'; stopBtn.id='ar-stop'; stopBtn.className='ar-btn ar-stop';
    stopBtn.innerHTML='<span class="ar-ico">■</span><span>Stop</span>'; stopBtn.title='Exit the reel (Esc) and stop script';
    stopBtn.onclick=()=>{
      STOP=true; window.ARDebug?.warn?.('Stopping requested'); setFSM(FSM.STOPPED,'user stop');
      hideAdvanceNow(); exitReel();
      const p=document.getElementById('ar-controls'); if(p) p.remove();
      ADVANCE_SEQ_ACTIVE=false; ADVANCE_SOURCE_ID=null; console.log('[AutoReels] Stopped & exiting reel');
    };

    // Pause Mode toggle (placed before Pause/Resume/Stop)
    const pauseModeBtn=document.createElement('button'); pauseModeBtn.type='button'; pauseModeBtn.id='ar-pause-mode'; pauseModeBtn.className='ar-btn';
    function renderPauseMode(){ pauseModeBtn.textContent = `Pause mode: ${PAUSE_MODE==='media'?'Media':'Loop'}`; pauseModeBtn.title = 'Shift+P to toggle'; }
    renderPauseMode();
    pauseModeBtn.onclick=()=>{ PAUSE_MODE = (PAUSE_MODE==='loop'?'media':'loop'); saveStr(LS_PAUSE_MODE, PAUSE_MODE); renderPauseMode(); window.ARDebug?.info?.('Pause mode changed',{mode:PAUSE_MODE}); };

    const dbgBtn=document.createElement('button'); dbgBtn.type='button'; dbgBtn.id='ar-debug'; dbgBtn.className='ar-btn';
    dbgBtn.innerHTML='<span class="ar-ico">🛠️</span><span>Debug</span>'; dbgBtn.title='Show/hide debug console (Ctrl+`)';
    window.ARDebug?.attachToButton?.(dbgBtn);

    // Order: Pause Mode, then Pause/Resume/Stop, then Debug
    ctrlRow.append(pauseModeBtn, pauseBtn, resumeBtn, stopBtn, dbgBtn);

    const audioRow=document.createElement('div'); audioRow.className='ar-row';
    const muteBtn=document.createElement('button'); muteBtn.type='button'; muteBtn.className='ar-btn';
    function refreshMuteBtn(){ muteBtn.innerHTML=USER_MUTED_PREF?'<span class="ar-ico">🔇</span><span>Unmute</span>':'<span class="ar-ico">🔊</span><span>Mute</span>'; }
    refreshMuteBtn();
    muteBtn.title='Toggle mute preference (persists)';
    muteBtn.onclick=()=>{ USER_MUTED_PREF=!USER_MUTED_PREF; saveBool('AR_MUTED_PREF', USER_MUTED_PREF); refreshMuteBtn(); const v=getForegroundVideo(); if(v) v.muted=USER_MUTED_PREF; window.ARDebug?.info?.('Mute toggled',{muted:USER_MUTED_PREF}); };

    const volField=document.createElement('div'); volField.className='ar-field';
    const vLabel=document.createElement('span'); vLabel.className='ar-label'; vLabel.textContent='Volume:';
    const vSlider=document.createElement('input'); vSlider.type='range'; vSlider.min='0'; vSlider.max='1'; vSlider.step='0.01'; vSlider.value=String(USER_VOLUME); vSlider.className='ar-input'; vSlider.style.width='140px';
    const vVal=document.createElement('span'); vVal.className='ar-label'; vVal.textContent=Math.round(USER_VOLUME*100)+'%';
    vSlider.oninput=()=>{ USER_VOLUME=clamp01(parseFloat(vSlider.value)||0); vVal.textContent=Math.round(USER_VOLUME*100)+'%'; saveStr('AR_VOLUME', String(USER_VOLUME)); const v=getForegroundVideo(); if(v) v.volume=USER_VOLUME; };
    volField.append(vLabel, vSlider, vVal);
    audioRow.append(muteBtn, volField);

    const prog=document.createElement('div'); prog.id='ar-progress'; prog.className='ar-collapsible';
    const track=document.createElement('div'); track.id='ar-track'; const fill=document.createElement('div'); fill.id='ar-fill'; track.appendChild(fill);
    const timeRow=document.createElement('div'); timeRow.id='ar-time'; const title=document.createElement('span'); title.id='ar-title'; title.textContent='Reel';
    const times=document.createElement('span'); times.id='ar-times'; times.textContent='00:00 / 00:00'; const stall=document.createElement('span'); stall.id='ar-stall';
    timeRow.append(title, times, stall);

    body.append(ctrlRow, audioRow, prog);
    const wrap=document.createElement('div'); wrap.append(top, body);
    panel.append(wrap, track, timeRow); (document.body||document.documentElement).appendChild(panel);

    // collapse wiring
    const applyCollapsed = (c)=>{ panel.classList.toggle('ar-collapsed', !!c); };
    let collapsed = loadBool(LS_CONTROLS_COLLAPSED, false);
    applyCollapsed(collapsed);
    caret.addEventListener('click', ()=>{
      collapsed = !collapsed; saveBool(LS_CONTROLS_COLLAPSED, collapsed); applyCollapsed(collapsed);
    });

    updateUI();
    window.addEventListener('keydown',(e)=>{
      if(!e.shiftKey) return;
      const k=e.key.toLowerCase();
      if(k==='a'){ e.preventDefault(); setPaused(!PAUSED); }
      if(k==='d'){
        e.preventDefault();
        ADV_DIR=(ADV_DIR==='down'?'up':'down');
        DIR_VER++;
        BASELINE_WAIT_ID=null; BASELINE_WAIT_VIDEO=null;
        saveStr('AR_ADV_DIR', ADV_DIR);
        document.getElementById('ar-dir').textContent=dirArrow();
        updateCountUI();
        window.ARDebug?.info?.('Direction toggled',{dir:ADV_DIR, dirVer:DIR_VER});
      }
      if(k==='p'){ e.preventDefault(); PAUSE_MODE = (PAUSE_MODE==='loop'?'media':'loop'); saveStr(LS_PAUSE_MODE, PAUSE_MODE); const btn=document.getElementById('ar-pause-mode'); if(btn){ btn.textContent=`Pause mode: ${PAUSE_MODE==='media'?'Media':'Loop'}`; } window.ARDebug?.info?.('Pause mode changed via hotkey',{mode:PAUSE_MODE}); }
      if(k==='m'){ e.preventDefault(); muteBtn.click(); }
      if(k==='x'){ e.preventDefault(); exitReel(); hideAdvanceNow(); window.ARDebug?.warn?.('Exit requested via hotkey'); }
    }, true);

    return panel;
  }

  function updateUI(){
    const status=document.getElementById('ar-status');
    const pauseBtn=document.getElementById('ar-pause');
    const resumeBtn=document.getElementById('ar-resume');
    if(!status||!pauseBtn||!resumeBtn) return;
    if(STOP){ status.textContent='Loop Status: Stopped'; pauseBtn.disabled=true; resumeBtn.disabled=true; return; }
    if(PAUSED){ status.textContent='Loop Status: Paused'; pauseBtn.disabled=true; resumeBtn.disabled=false; }
    else { status.textContent='Loop Status: Playing'; pauseBtn.disabled=false; resumeBtn.disabled=true; }
  }

  async function ensureBody(){
    if(document.body) return;
    await new Promise(res=>{ const obs=new MutationObserver(()=>{ if(document.body){ obs.disconnect(); res(); }}); obs.observe(document.documentElement,{childList:true,subtree:true}); });
  }

  /* ===================== queue storage + aliases + cache ===================== */
  function saveQueue(pathSig, ids){
    try {
      const obj = { path: pathSig, ids, ts: Date.now() };
      localStorage.setItem(gridKey(pathSig), JSON.stringify(obj));
      ACTIVE_QUEUE = { path: obj.path, ids: obj.ids.slice(), ts: obj.ts };
      window.ARDebug?.info?.('Queue cached in-memory', { path: ACTIVE_QUEUE.path, total: ACTIVE_QUEUE.ids.length });
    } catch {}
  }
  function loadQueue(pathSig){
    try { const raw=localStorage.getItem(gridKey(pathSig)); if(!raw) return null; const q=JSON.parse(raw); if(!q||!Array.isArray(q.ids)) return null; return q; } catch { return null; }
  }
  function mostRecentQueue(){
    let best=null, bestTs=0;
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k && k.startsWith('AR_QUEUE:')){
        try{ const q=JSON.parse(localStorage.getItem(k)); if(q && q.path && Array.isArray(q.ids) && q.ts>bestTs){ best=q; bestTs=q.ts; } }catch{}
      }
    }
    return best;
  }
  function saveLastWatched(pathSig, reelId){ try { localStorage.setItem(`AR_LAST:${pathSig}`, reelId); } catch {} }

  function detectGridPathFromDOM() {
    try {
      const hitCount = new Map();
      const addSig = (sig) => { if (!sig) return; hitCount.set(sig, (hitCount.get(sig)||0)+1); };

      // Standard links to /reels and /{user}/reels
      document.querySelectorAll('a[href*="/reels"]').forEach(a => {
        const href=a.getAttribute('href')||'';
        try{
          const u=new URL(href, location.origin);
          const path=normalizePath(u.pathname);
          if (/^\/reels\/?$/.test(path) || /^\/[^/]+\/reels\/?$/.test(path)) {
            addSig(gridSignatureFromURL(u));
          }
        }catch{}
      });

      // profile.php?id=…&sk=reels_tab
      document.querySelectorAll('a[href*="profile.php"]').forEach(a=>{
        const href=a.getAttribute('href')||'';
        try{
          const u=new URL(href, location.origin);
          const sp=new URLSearchParams(u.search||'');
          if (normalizePath(u.pathname)==='/profile.php' && sp.get('sk')==='reels_tab' && sp.get('id')) {
            addSig(`/profile:${sp.get('id')}/reels`);
          }
        }catch{}
      });

      // Visible “Reels” links heuristics
      document.querySelectorAll('a[role="link"], a[tabindex]').forEach(a=>{
        const text=(a.textContent||'').trim().toLowerCase();
        if (!text || !text.includes('reels')) return;
        const href=a.getAttribute('href')||'';
        if (!href) return;
        try{
          const u=new URL(href, location.origin);
          const sig=gridSignatureFromURL(u);
          if (sig) addSig(sig);
        }catch{}
      });

      let best=null, bestN=0;
      for(const [sig,n] of hitCount.entries()) if(n>bestN){ best=sig; bestN=n; }

      if(best) window.ARDebug?.info?.('DOM grid signature candidate', { sig: best, hits: bestN });
      return best || null;
    } catch { return null; }
  }

  function pathAliases(sig) {
    sig = (sig || '').trim();
    const out = new Set();
    if (sig) out.add(sig);
    // Provide a generic fallback alias to reuse queues
    out.add('/reels');
    return Array.from(out);
  }

  function loadQueueSmart(sig) {
    for (const p of pathAliases(sig)) {
      const q = loadQueue(p);
      if (q && q.ids && q.ids.length) {
        ACTIVE_QUEUE = { path: p, ids: q.ids.slice(), ts: q.ts || Date.now() };
        return { q, key: p };
      }
    }
    return null;
  }

  function currentGridPathGuess(){
    const hereSig = gridSignatureFromURL();
    if (hereSig) return hereSig;
    const saved = loadGridPath();
    if (saved) return saved;
    if (onGrid()) {
      const sig = gridSignatureFromURL();
      if (sig) return sig;
    }
    const domSig = detectGridPathFromDOM();
    if (domSig) return domSig;
    const recent = mostRecentQueue();
    if (recent?.path) return recent.path;
    if (onReel()) return '/reels';
    return null;
  }

  // persist flag controls whether we call saveGridPath()
  function adoptNearestQueue(reason='adopt', persist=true){
    let desired = CURRENT_GRID_PATH || loadGridPath() || currentGridPathGuess();
    let bound = null;
    if (desired) {
      const hit = loadQueueSmart(desired);
      if (hit) bound = hit.key;
      else {
        const recent = mostRecentQueue();
        if (recent?.path && recent.ids?.length) bound = recent.path;
      }
    } else {
      const recent = mostRecentQueue();
      if (recent?.path && recent.ids?.length) bound = recent.path;
    }
    CURRENT_GRID_PATH = bound || desired || null;
    if (persist && CURRENT_GRID_PATH) saveGridPath(CURRENT_GRID_PATH);
    window.ARDebug?.info?.('Queue adopt', { reason, path: CURRENT_GRID_PATH || '(none)', persisted: !!(persist && CURRENT_GRID_PATH) });
    updateCountUI();
  }

  /* ===================== Count UI (signature-aware + cache) ===================== */
  function updateCountUI(){
    const c=document.getElementById('ar-count'); if(!c) return;
    let sig = CURRENT_GRID_PATH || loadGridPath();
    const tried = [];
    if (sig) tried.push(sig, ...pathAliases(sig).filter(a => a!==sig));
    tried.push('(mostRecentQueue)', '(ACTIVE_QUEUE)');

    let hit = sig ? loadQueueSmart(sig) : null;
    let q = hit ? hit.q : null;

    if (hit && hit.key && sig !== hit.key) {
      CURRENT_GRID_PATH = hit.key;
      saveGridPath(CURRENT_GRID_PATH);
      window.ARDebug?.info?.('CountUI alias rebind', { from: sig, to: hit.key, total: q.ids.length });
      sig = hit.key;
    }

    if ((!q || !q.ids?.length)) {
      const recent = mostRecentQueue();
      if (recent?.path && recent.ids?.length) {
        sig = recent.path;
        q = recent;
        CURRENT_GRID_PATH = sig;
        saveGridPath(sig);
        window.ARDebug?.info?.('CountUI fallback to recent queue', { path: sig, total: q.ids.length });
      }
    }

    if ((!q || !q.ids?.length) && ACTIVE_QUEUE && ACTIVE_QUEUE.ids?.length) {
      q = { path: ACTIVE_QUEUE.path, ids: ACTIVE_QUEUE.ids };
      window.ARDebug?.info?.('CountUI using ACTIVE_QUEUE cache', { path: ACTIVE_QUEUE.path, total: ACTIVE_QUEUE.ids.length });
    }

    if (!q || !q.ids || !q.ids.length) {
      c.textContent = 'Count: scan grid to enable';
      window.ARDebug?.warn?.('CountUI no queue found', { tried });
      return;
    }

    const id = urlId();
    const total = q.ids.length;
    const idx = id ? q.ids.indexOf(id) : -1;
    if (idx >= 0) {
      const left = ADV_DIR==='down' ? Math.max(0, total - idx - 1) : Math.max(0, idx);
      c.textContent = `Count: ${idx+1} / ${total} • ${left} left (${dirArrow()})`;
    } else {
      c.textContent = `Count: – / ${total} (${dirArrow()})`;
    }
    window.ARDebug?.info?.('CountUI rendered', { signature: sig || q.path || '(n/a)', total: q.ids.length, idx });
  }

  /* ===================== progress ===================== */
  function startProgress(){
    stopProgress();
    _lastT=0; _stallMs=0;
    const fill=document.getElementById('ar-fill');
    const times=document.getElementById('ar-times');
    const stall=document.getElementById('ar-stall');
    const title=document.getElementById('ar-title');

    let _lastT_ts=performance.now();
    const step=(ts)=>{
      if(STOP) return;
      const v=getForegroundVideo(); if(!v){ _progRAF=requestAnimationFrame(step); return; }
      if(title){ const src=(v.currentSrc||v.src||'').split('?')[0]; const base=src?src.split('/').pop():'Reel'; title.textContent=base||'Reel'; }
      const d=(v.duration && isFinite(v.duration) && v.duration>0) ? v.duration : NaN;
      const t=(v.currentTime && isFinite(v.currentTime)) ? v.currentTime : 0;
      if(fill){ const pct=(isFinite(d)&&d>0)?Math.max(0,Math.min(100,(t/d)*100)):0; fill.style.width=`${pct}%`; }
      if(times) times.textContent=isFinite(d)?`${fmtTime(t)} / ${fmtTime(d)}`:`${fmtTime(t)} / 00:00`;
      if(!PAUSED && !v.paused){ if(Math.abs(t-_lastT)<0.01) _stallMs+=(ts-_lastT_ts); else _stallMs=0; } else { _stallMs=0; }
      if(stall) stall.classList.toggle('stalled', _stallMs>=1000);
      _lastT=t; _lastT_ts=ts; _progRAF=requestAnimationFrame(step);
    };
    _progRAF=requestAnimationFrame(step);
  }
  function stopProgress(){ if(_progRAF){ cancelAnimationFrame(_progRAF); _progRAF=null; } }

  /* ===================== playback helpers ===================== */
  async function ensurePlayingOnlyForeground(vfg){
    for(const v of allVids()){ if(v!==vfg){ try{ v.pause(); }catch{} } }
    if(!vfg) return;
    try{ vfg.muted=USER_MUTED_PREF; vfg.volume=USER_VOLUME; vfg.playsInline=true; }catch{}
    // Hold during End→Advance window or respect user media pause
    if (HOLD_MEDIA || (PAUSED && PAUSE_MODE==='media')) {
      try{ vfg.pause(); }catch{}
      return;
    }
    // Otherwise ensure only the foreground is playing.
    try{ await vfg.play(); }catch{}
    if(vfg.paused){ vfg.play().catch(()=>{}); }
  }

  /* ===================== strict stable-different check (NEW) ===================== */
  async function stablyOnDifferentReel(beforeId, initialVideo, ms = 900, step = 100) {
    const needConsecutive = Math.max(3, Math.floor(ms / step / 2));
    let consecutive = 0;
    let lastId = null;

    for (let elapsed = 0; elapsed < ms; elapsed += step) {
      const nowId = urlId();
      const v = getForegroundVideo();
      const idChanged = !!(beforeId && nowId && nowId !== beforeId);
      const videoChanged = !!(initialVideo && v && v !== initialVideo);

      if (idChanged && videoChanged) {
        if (nowId === lastId) {
          consecutive++;
        } else {
          consecutive = 1;
          lastId = nowId;
        }
        if (consecutive >= needConsecutive) return true;
      } else {
        consecutive = 0;
        lastId = null;
      }
      await sleep(step);
    }
    return false;
  }

  /* ===================== strict ID-only change ===================== */
  async function waitForIdChange(beforeId){
    const start=performance.now(); let stableFor=0; let lastSeen=null;
    while(performance.now()-start<ADV_WAIT_MS){
      await pauseGate(); if(STOP) return null;
      const id=urlId()||null;
      if(id && id!==beforeId){
        if(id===lastSeen){ stableFor+=100; if(stableFor>=VERIFY_STABLE_MS) return { id }; }
        else { lastSeen=id; stableFor=0; }
      }
      await sleep(100);
    }
    return null;
  }

  /* ===================== advance primitives ===================== */
  function pressArrowDown(){ window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',code:'ArrowDown',bubbles:true})); }
  function pressArrowUp(){ window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',code:'ArrowUp',bubbles:true})); }
  function wheelDelta(el,dy){ const target=el ? (function getScrollableAncestor(n){ while(n&&n!==document.body){ const st=getComputedStyle(n); if((st.overflowY==='auto'||st.overflowY==='scroll')&&n.scrollHeight>n.clientHeight) return n; n=n.parentElement; } return document.scrollingElement||document.documentElement||document.body; })(el) : (document.scrollingElement||document.documentElement||document.body); target.dispatchEvent(new WheelEvent('wheel',{deltaY:dy,bubbles:true})); if(target && target.scrollBy){ target.scrollBy({top:dy,behavior:'smooth'}); } }
  function wheelDown(el){ wheelDelta(el,+1200); }
  function wheelUp(el){ wheelDelta(el,-1200); }
  function touchSwipe(el, yStartFrac, yEndFrac){ try{ const x=Math.floor(innerWidth/2), yStart=Math.floor(innerHeight*yStartFrac), yEnd=Math.floor(innerHeight*yEndFrac); const target=el||document.elementFromPoint(x,yStart)||document.body; const mkTouch=(y)=> new Touch({identifier:Date.now(),target,clientX:x,clientY:y,radiusX:2,radiusY:2,force:0.5}); target.dispatchEvent(new TouchEvent('touchstart',{touches:[mkTouch(yStart)],bubbles:true,cancelable:true})); target.dispatchEvent(new TouchEvent('touchmove',{touches:[mkTouch(Math.floor((yStart+yEnd)/2))],bubbles:true,cancelable:true})); target.dispatchEvent(new TouchEvent('touchmove',{touches:[mkTouch(yEnd)],bubbles:true,cancelable:true})); target.dispatchEvent(new TouchEvent('touchend',{touches:[],changedTouches:[mkTouch(yEnd)],bubbles:true,cancelable:true})); }catch{} }
  function touchSwipeUpOver(el){ touchSwipe(el,0.70,0.30); }
  function touchSwipeDownOver(el){ touchSwipe(el,0.30,0.70); }

  async function tryAdvanceDirectional(direction, beforeId){
    if (urlId() && beforeId && urlId() !== beforeId) return null;
    if (Date.now() < nextAdvanceAllowedAt) return null;

    if(ADVANCING) return null;
    ADVANCING=true; setFSM(FSM.ADVANCING,'advance start');
    const v=getForegroundVideo();

    const doTry = async (label, action)=>{
      action();
      const out=await waitForIdChange(beforeId);
      if(out && out.id && out.id!==beforeId){
        window.ARDebug?.logAdvance?.({fromId:beforeId,toId:out.id,via:label});
        ADVANCING=false; setFSM(PAUSED ? FSM.PAUSED : FSM.PLAYING,'advance success'); return out;
      }
      window.ARDebug?.info?.('No ID change after attempt',{via:label,beforeId,nowId:urlId()});
      return null;
    };

    let out=null;
    if(direction==='down'){
      out=await doTry('ArrowDown',()=>pressArrowDown());
      if(!out) out=await doTry('wheelDown',()=>wheelDown(v));
      if(!out) out=await doTry('touchSwipeUp',()=>touchSwipeUpOver(v));
      if(!out) out=await doTry('scrollBy+1400',()=>{ const sc=(function getScrollableAncestor(n){ while(n&&n!==document.body){ const st=getComputedStyle(n); if((st.overflowY==='auto'||st.overflowY==='scroll')&&n.scrollHeight>n.clientHeight) return n; n=n.parentElement; } return document.scrollingElement||document.documentElement||document.body; })(v||document.body); if(sc && sc.scrollBy) sc.scrollBy({top:1400,behavior:'smooth'}); });
    } else {
      out=await doTry('ArrowUp',()=>pressArrowUp());
      if(!out) out=await doTry('wheelUp',()=>wheelUp(v));
      if(!out) out=await doTry('touchSwipeDown',()=>touchSwipeDownOver(v));
      if(!out) out=await doTry('scrollBy-1400',()=>{ const sc=(function getScrollableAncestor(n){ while(n&&n!==document.body){ const st=getComputedStyle(n); if((st.overflowY==='auto'||st.overflowY==='scroll')&&n.scrollHeight>n.clientHeight) return n; n=n.parentElement; } return document.scrollingElement||document.documentElement||document.body; })(v||document.body); if(sc && sc.scrollBy) sc.scrollBy({top:-1400,behavior:'smooth'}); });
    }
    ADVANCING=false; setFSM(PAUSED ? FSM.PAUSED : FSM.PLAYING,'advance end'); return out||null;
  }

  /* ===================== grid scan + controls (collapsible) ===================== */
  function mountGridBadge(){
    ensureStyles();
    if(!onGrid()) return;
    if(document.getElementById('ar-gridbadge')) return;

    const badge=document.createElement('div'); badge.id='ar-gridbadge';

    // header row with caret
    const header=document.createElement('div'); header.className='row';
    const caret=document.createElement('button'); caret.className='ar-btn'; caret.title='Collapse / expand scan';
    caret.innerHTML='<span class="ar-caret">▾</span>';
    const title=document.createElement('span'); title.className='ar-label'; title.textContent='Reels Scan';
    header.append(caret, title);

    const body=document.createElement('div'); body.className='ar-collapsible';

    const row=document.createElement('div'); row.className='row';
    const scanBtn=document.createElement('button'); scanBtn.className='ar-btn'; scanBtn.textContent='Scan Reels'; scanBtn.title='Scan this grid to count total reels';

    const stopBtn=document.createElement('button'); stopBtn.className='ar-btn ar-stop'; stopBtn.textContent='Stop Scan'; stopBtn.title='Stop the current scan'; stopBtn.disabled=true;

    const field=document.createElement('div'); field.className='ar-field';
    const label=document.createElement('span'); label.className='ar-label'; label.textContent='Scan depth:';
    const input=document.createElement('input'); input.className='ar-input'; input.type='number'; input.min='5'; input.max='2000'; input.step='5'; input.value=String(MAX_GRID_SCROLLS);
    input.title='Number of scroll passes when scanning the grid (5–2000). Press Enter or click Apply.';
    const apply=document.createElement('button'); apply.className='ar-btn'; apply.textContent='Apply'; apply.title='Apply scan depth';

    function setScanDepthFromInput(showAlert=true){ let n=parseInt(input.value,10); if(!Number.isFinite(n)) n=MAX_GRID_SCROLLS; n=Math.max(5,Math.min(2000,n|0)); input.value=String(n); MAX_GRID_SCROLLS=n; saveInt('AR_SCAN_DEPTH',n); if(showAlert) alert('AutoReels: MAX_GRID_SCROLLS set to '+n); window.ARDebug?.info?.('Scan depth set',{MAX_GRID_SCROLLS}); }
    apply.onclick=()=> setScanDepthFromInput(true);
    input.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.preventDefault(); setScanDepthFromInput(true);} });
    input.addEventListener('blur',()=> setScanDepthFromInput(false));
    field.append(label, input, apply);

    row.append(scanBtn, stopBtn);
    body.append(row, field);
    badge.append(header, body);
    (document.body||document.documentElement).appendChild(badge);

    // collapse wiring (sticky)
    const applyCollapsed = (c)=>{ badge.classList.toggle('ar-collapsed', !!c); };
    let collapsed = loadBool(LS_GRID_COLLAPSED, false);
    applyCollapsed(collapsed);
    caret.addEventListener('click', ()=>{
      collapsed = !collapsed; saveBool(LS_GRID_COLLAPSED, collapsed); applyCollapsed(collapsed);
    });

    let scanning=false; let cancelScan=false;
    stopBtn.onclick=()=>{ if(!scanning) return; cancelScan=true; stopBtn.disabled=true; window.ARDebug?.warn?.('Grid scan: stop requested'); setFSM(FSM.IDLE,'scan stop requested'); };

    scanBtn.onclick=async ()=>{
      if(scanning) return; scanning=true; cancelScan=false;
      scanBtn.disabled=true; scanBtn.textContent='Scanning…'; stopBtn.disabled=false; input.disabled=true; apply.disabled=false;

      const sig = gridSignatureFromURL() || normalizePath(location.pathname);
      const seen=new Set();
      const collect=()=>{ document.querySelectorAll('a[href*="/reel/"]').forEach(a=>{ const href=a.getAttribute('href')||''; const m=href.match(/\/reel\/(\d+)/); if(m) seen.add(m[1]); }); };
      collect();

      let i=0; setFSM(FSM.SCANNING,'grid scan start'); window.ARDebug?.info?.('Grid scan started',{sig, MAX_GRID_SCROLLS});
      while(i<MAX_GRID_SCROLLS && !cancelScan){
        window.scrollBy({top:2000,behavior:'smooth'}); await sleep(GRID_SCROLL_DELAY); collect(); i++;
      }

      const ids=Array.from(seen);
      // Save under signature + generic
      saveQueue(sig, ids);
      if (sig !== '/reels') saveQueue('/reels', ids);
      saveGridPath(sig);
      CURRENT_GRID_PATH=sig;
      window.ARDebug?.info?.('Grid scan saved',{sig, saved:ids.length});

      scanning=false; scanBtn.disabled=false; scanBtn.textContent='Scan Reels'; stopBtn.disabled=true; input.disabled=false; apply.disabled=false;
      setFSM(FSM.GRID,'grid scan end');

      alert(cancelScan
        ? `AutoReels: scan stopped early after ${i}/${MAX_GRID_SCROLLS} passes. Saved ${ids.length} reel IDs for ${sig}.`
        : `AutoReels: saved ${ids.length} reel IDs for ${sig}.`);

      updateCountUI();
    };
  }

  /* ===================== auto-retry orchestrator ===================== */
  async function advanceWithAutoRetry(beforeId){
    const total=POST_END_RETRY_WAVES*POST_END_RETRY_TRIES_PER_WAVE;
    const doAttempt=async(direction)=>{
      const r=await tryAdvanceDirectional(direction, beforeId);
      if(r && r.id && r.id!==beforeId){ await sleep(POST_END_GUARD_PAUSE_MS); if(idsDiffer(beforeId)) return true; }
      return false;
    };

    for(let wave=0; wave<POST_END_RETRY_WAVES && !STOP; wave++){
      for(let t=0; t<POST_END_RETRY_TRIES_PER_WAVE && !STOP; t++){
        await pauseGate(); if(STOP) return false;

        if (await stablyOnDifferentReel(beforeId, getForegroundVideo())) {
          window.ARDebug?.info?.('Detected new ID mid-retries; stopping', { fromId: beforeId, nowId: urlId() });
          return true;
        }

        const fg=getForegroundVideo(); if(fg){ try{ fg.click(); }catch{} }
        const attemptNum=wave*POST_END_RETRY_TRIES_PER_WAVE+(t+1);
        window.ARDebug?.logRetry?.({attempt:attemptNum, max:total, currId:beforeId, lastId:LAST_ADVANCED_FROM_ID, action:'advance', delayMs: t?POST_END_RETRY_DELAY_MS:0});
        setAdvanceStatus('warn', `Retry ${attemptNum}/${total}…`);
        if(await doAttempt(ADV_DIR)) return true;
        await sleep(POST_END_RETRY_DELAY_MS);
      }
    }
    window.ARDebug?.warn?.('All retries exhausted without ID change',{beforeId, nowId:urlId()});
    return false;
  }

  /* ===================== init / run loop ===================== */
  async function run(myGen) {
    if (myGen !== RUN_GEN) return;
    RUN_ACTIVE = myGen;

    await ensureBody();
    startWatchdog();

    if(onGrid()){
      ADVANCE_SEQ_ACTIVE=false; ADVANCE_SOURCE_ID=null;
      mountGridBadge();
      adoptNearestQueue('enter-grid', true);
      setFSM(FSM.GRID,'enter grid');
      return;
    }

    if(!onReel()){
      ADVANCE_SEQ_ACTIVE=false; ADVANCE_SOURCE_ID=null;
      setFSM(FSM.IDLE,'not grid/reel');
      return;
    }

    mountControls();
    adoptNearestQueue('enter-reel', true);
    updateUI(); updateCountUI();

    window.addEventListener(URL_EVT, ()=>{ ADVANCE_SEQ_ACTIVE=false; ADVANCE_SOURCE_ID=null; }, { once:true });

    function releaseHoldAndMaybePlay(){
      HOLD_MEDIA = false;
      // If the user isn’t in media-pause mode with PAUSED=true, resume foreground playback.
      if (!(PAUSED && PAUSE_MODE==='media')) {
        const nv = getForegroundVideo();
        if (nv) { ensurePlayingOnlyForeground(nv); }
      }
    }

    while(!STOP){
      if (RUN_ACTIVE !== RUN_GEN) break;

      await pauseGate(); if(STOP) break;

      let v=getForegroundVideo(); if(!v){ await sleep(300); continue; }
      await ensurePlayingOnlyForeground(v);
      setFSM(PAUSED ? FSM.PAUSED : FSM.PLAYING,'loop ensure playing');

      if(!CURRENT_GRID_PATH || !loadQueueSmart(CURRENT_GRID_PATH)){
        const domSig = detectGridPathFromDOM();
        if(domSig){ CURRENT_GRID_PATH=domSig; saveGridPath(CURRENT_GRID_PATH); window.ARDebug?.info?.('Bound to DOM grid signature during reel',{path:CURRENT_GRID_PATH}); }
        else adoptNearestQueue('rebind-during-reel', true);
      }

      let beforeId=urlId();
      const dirVerAtStart = DIR_VER;
      if(beforeId){
        const domSig = detectGridPathFromDOM();
        const sigToSave = domSig || CURRENT_GRID_PATH || gridSignatureFromURL() || '/reels';
        saveLastWatched(sigToSave, beforeId);
      }

      window.ARDebug?.info?.('Current reel detected',{currId:beforeId, url:location.href});
      updateCountUI();

      const endedRes=await waitForEndedStrict(v); if(STOP || endedRes!=='ended') break;

      setAdvanceStatus('info', 'End detected — attempting advance…');
      // Freeze media during advance window so it doesn't keep playing the ended reel.
      HOLD_MEDIA = true;
      // Hard pause anything that might still be playing.
      allVids().forEach(vv=>{ try{ vv.pause(); }catch{} });

      if (DIR_VER !== dirVerAtStart) {
        window.ARDebug?.info?.('Dir changed during wait; refreshing beforeId', { was: beforeId, now: urlId(), dirVerAtStart, dirVerNow: DIR_VER });
      }
      beforeId = urlId();

      BASELINE_WAIT_VIDEO = getForegroundVideo();
      BASELINE_WAIT_ID = urlId();
      window.ARDebug?.info?.('Baseline captured (wait state)', { id: BASELINE_WAIT_ID });

      const initialVideoRef = BASELINE_WAIT_VIDEO || v;
      if (await stablyOnDifferentReel(beforeId, initialVideoRef)) {
        window.ARDebug?.info?.('Already on a new reel; skipping retries', { fromId: beforeId, nowId: urlId() });
        nextAdvanceAllowedAt = Date.now() + ADV_COOLDOWN_MS;
        lastAdvanceAt = Date.now();
        LAST_ADVANCED_FROM_ID = beforeId;
        updateCountUI();
        fadeAdvanceSoon('info', 'Already on next reel');
        releaseHoldAndMaybePlay();
        await sleep(MIN_ADVANCE_GAP_MS);
        continue;
      }

      if (ADVANCE_SEQ_ACTIVE && ADVANCE_SOURCE_ID === beforeId) {
        window.ARDebug?.warn?.('Duplicate advance trigger suppressed', { reelId: beforeId });
        await sleep(400);
        continue;
      }
      if (LAST_ADVANCED_FROM_ID === beforeId && Date.now() - lastAdvanceAt < 8000) {
        window.ARDebug?.warn?.('Recent advance from same reel; skipping to prevent double-advance', { reelId: beforeId });
        hideAdvanceNow();
        await sleep(300);
        continue;
      }

      ADVANCE_SEQ_ACTIVE = true;
      ADVANCE_SOURCE_ID = beforeId;
      window.ARDebug?.setState?.('advancing');

      const now = Date.now(), since = now - lastAdvanceAt;
      if (since < MIN_ADVANCE_GAP_MS) await sleep(MIN_ADVANCE_GAP_MS - since);

      if (await stablyOnDifferentReel(beforeId, initialVideoRef, 500, 100)) {
        lastAdvanceAt = Date.now();
        nextAdvanceAllowedAt = Date.now() + ADV_COOLDOWN_MS;
        fadeAdvanceSoon('success', 'Advanced');
        releaseHoldAndMaybePlay();
        continue;
      }

      let success = false;
      const immediate = await tryAdvanceDirectional(ADV_DIR, beforeId);

      let nowId = urlId();
      const maxWait = 1000; const step = 100;
      for (let waited = 0; waited < maxWait && nowId === beforeId; waited += step) {
        await sleep(step);
        nowId = urlId();
      }

      const vAfter = getForegroundVideo();
      if (nowId && nowId !== beforeId && vAfter && vAfter !== initialVideoRef) {
        window.ARDebug?.logCompare?.({
          currId: nowId,
          lastId: beforeId,
          shouldAdvance: true,
          reason: 'Confirmed ID + video change after settle-wait'
        });
        fadeAdvanceSoon('success', 'Advanced');
        success = true;
        nextAdvanceAllowedAt = Date.now() + ADV_COOLDOWN_MS;
        lastAdvanceAt = Date.now();
        LAST_ADVANCED_FROM_ID = beforeId;
        adoptNearestQueue('post-advance', false);
        updateCountUI();
        releaseHoldAndMaybePlay();
      } else {
        window.ARDebug?.logCompare?.({
          currId: nowId || '(same)',
          lastId: beforeId,
          shouldAdvance: false,
          reason: 'No stable ID+video change after 1 s wait'
        });
        setAdvanceStatus('warn', 'No change; auto-retry in 10 s…');
      }

      if (!success) {
        window.ARDebug?.info?.('Waiting before auto-retries', { delayMs: POST_END_INITIAL_RETRY_DELAY_MS });
        await sleep(POST_END_INITIAL_RETRY_DELAY_MS);

        if (!await stablyOnDifferentReel(beforeId, initialVideoRef)) {
          const advanced = await advanceWithAutoRetry(beforeId);
          if (advanced) {
            fadeAdvanceSoon('success', 'Advanced');
            nextAdvanceAllowedAt = Date.now() + ADV_COOLDOWN_MS;
            success = true;
            lastAdvanceAt = Date.now();
            LAST_ADVANCED_FROM_ID = beforeId;
            adoptNearestQueue('post-advance', false);
            updateCountUI();
            releaseHoldAndMaybePlay();
          }
        } else {
          fadeAdvanceSoon('success', 'Advanced');
          nextAdvanceAllowedAt = Date.now() + ADV_COOLDOWN_MS;
          success = true;
          lastAdvanceAt = Date.now();
          LAST_ADVANCED_FROM_ID = beforeId;
          adoptNearestQueue('post-advance', false);
          updateCountUI();
          releaseHoldAndMaybePlay();
        }
      }

      if (!success) {
        fadeAdvanceSoon('error', 'Advance failed — still on same reel');
        window.ARDebug?.warn?.('Advance failed — still on same reel?', { beforeId, nowId: urlId() });
        // We didn't advance — let playback resume as it was.
        releaseHoldAndMaybePlay();
      }

      ADVANCE_SEQ_ACTIVE = false;
      ADVANCE_SOURCE_ID = null;
      window.ARDebug?.setState?.('playing');
      updateUI();
      await sleep(200);
    }
    stopProgress();
    HOLD_MEDIA = false;
  }

  async function waitForEndedStrict(vStart){
    let v=vStart||getForegroundVideo();
    if(!v){ window.ARDebug?.warn?.('No foreground video'); return 'no-video'; }
    startProgress(); await ensurePlayingOnlyForeground(v);
    let ended=false; const onEnd=()=>ended=true;
    const volListener = ()=>{ try{ USER_MUTED_PREF=!!v.muted; saveBool('AR_MUTED_PREF', USER_MUTED_PREF); USER_VOLUME=clamp01(v.volume||0); saveStr('AR_VOLUME', String(USER_VOLUME)); }catch{} };
    v.addEventListener('ended', onEnd, { once:true }); v.addEventListener('volumechange', volListener);
    setFSM(PAUSED ? FSM.PAUSED : FSM.PLAYING,'entered waitForEnded');

    while(!STOP && !ended){
      await pauseGate(); if(STOP) break;
      const cur=getForegroundVideo();
      if(cur && cur!==v){
        v.removeEventListener('ended', onEnd); v.removeEventListener('volumechange', volListener);
        v=cur; await ensurePlayingOnlyForeground(v);
        v.addEventListener('ended', onEnd, { once:true }); v.addEventListener('volumechange', volListener);
        window.ARDebug?.info?.('Foreground video changed');
      }
      // In loop-pause mode, we auto-ensure playback; but not while HOLD_MEDIA is active
      if(PAUSE_MODE!=='media' && !HOLD_MEDIA && v.paused){ await ensurePlayingOnlyForeground(v); }
      await sleep(200);
    }
    v.removeEventListener('ended', onEnd); v.removeEventListener('volumechange', volListener); stopProgress();
    if(ended) window.ARDebug?.info?.('Ended event observed');
    return ended ? 'ended' : 'stopped';
  }

  // --- Debounced boot & event wiring ---
  function bootRunSoon() {
    if (BOOT_TIMER) clearTimeout(BOOT_TIMER);
    BOOT_TIMER = setTimeout(() => {
      // IMPORTANT: allow restart after Stop by resetting flags on every boot
      STOP = false;
      HOLD_MEDIA = false;
      RUN_GEN++;
      run(RUN_GEN);
    }, 60);
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      bootRunSoon();
    }
  });

  window.addEventListener(URL_EVT, () => {
    // IMPORTANT: also clear Stop on navigation so choosing a new reel restarts the loop
    STOP = false;
    HOLD_MEDIA = false;
    ADVANCE_SEQ_ACTIVE = false;
    ADVANCE_SOURCE_ID = null;
    bootRunSoon();
  });

  window.addEventListener('visibilitychange', () => {
    if (!document.hidden) bootRunSoon();
  });
  window.addEventListener('focus', bootRunSoon);

})();

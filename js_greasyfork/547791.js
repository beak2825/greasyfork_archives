// ==UserScript==
// @name         Educated Perfection PRO (V1.0)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Capture word lists and search manually. Clean profiles, vibrant themes, hotkeys HUD, docking, import/export (JSON in Settings), Study View overlay. No live capture. No auto-answer hotkeys. No "paste top" button.
// @author       SuspendStill
// @match        https://app.educationperfect.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=educationperfect.com
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/547791/Educated%20Perfection%20PRO%20%28V10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547791/Educated%20Perfection%20PRO%20%28V10%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------------------ Selectors ------------------
  const SEL = {
    baseList:  'div.baseLanguage, [data-testid="baseLanguage"], .base-language, [data-ep="base"], .term-source, .word-base',
    targetList:'div.targetLanguage, [data-testid="targetLanguage"], .target-language, [data-ep="target"], .term-target, .word-target',
    question:  '#question-text, [data-testid="question-text"], .question-text, [class*="QuestionText"], [data-ep="question"]',
    answerBox: 'input#answer-text, input[name*="answer"], input[aria-label*="answer"], input[type="text"], textarea, [contenteditable="true"]'
  };

  // ------------------ Keys & Namespaces ------------------
  const NS = 'ep_pro_';
  const KEY = {
    dicts: NS + 'dicts',
    profile: NS + 'profile',
    theme: NS + 'theme',
    pos: NS + 'pos',
    minimized: NS + 'minimized',   // 0/1
    minSticky: NS + 'minSticky',   // 0/1 — if user minimized, don't auto-open on new Q
    settings: NS + 'settings',
    hotkeys: NS + 'hotkeys',
    migrateOld: 'ep_lite_dict'
  };

  // ------------------ Storage helpers ------------------
  const Store = {
    get(k, def) { try { const v = GM_getValue(k, undefined); if (typeof v !== 'undefined') return v; } catch {} try { const raw = localStorage.getItem(k); return raw == null ? def : JSON.parse(raw); } catch {} return def; },
    set(k, v) { try { GM_setValue(k, v); } catch {} try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  // ------------------ Defaults ------------------
  const DEFAULTS = {
    theme: 'cyberwave',
    profile: 'Default',
    settings: {
      showConfidence: true,
      caseSensitive: false,
      // DO NOT NORMALIZE DIACRITICS
      normalizeDiacritics: false,
      autoOpenOnQuestion: false, // respect minimize
      edgeSnap: true,
      hudOnAltH: true
    },
    hotkeys: {
      togglePanel: 'Alt+P',
      capture: 'Alt+R',
      nextSuggestion: 'Alt+ArrowDown',
      prevSuggestion: 'Alt+ArrowUp',
      toggleCollapse: 'Alt+0',
      openSearch: 'Alt+K',
      showHUD: 'Alt+H'
    }
  };

  // ------------------ Migrate old dict (one-time) ------------------
  (function migrateOld() {
    const dicts = Store.get(KEY.dicts, null);
    if (dicts) return;
    const old = Store.get(KEY.migrateOld, null);
    if (old && typeof old === 'object') Store.set(KEY.dicts, { [DEFAULTS.profile]: old });
    else Store.set(KEY.dicts, { [DEFAULTS.profile]: {} });
  })();

  // ------------------ State ------------------
  const STATE = {
    dicts: Store.get(KEY.dicts, { [DEFAULTS.profile]: {} }),
    profile: Store.get(KEY.profile, DEFAULTS.profile),
    theme: Store.get(KEY.theme, DEFAULTS.theme),
    minimized: Store.get(KEY.minimized, 0) ? 1 : 0,
    minimizedSticky: Store.get(KEY.minSticky, 0) ? 1 : 0,
    settings: { ...DEFAULTS.settings, ...(Store.get(KEY.settings, {})) },
    hotkeys: { ...DEFAULTS.hotkeys, ...(Store.get(KEY.hotkeys, {})) },
    lastQ: '',
    selectedIndex: 0,
    captureCount: 0
  };
  // force-disable diacritics normalization to match user requirement
  STATE.settings.normalizeDiacritics = false; Store.set(KEY.settings, STATE.settings);
  if (!STATE.dicts[STATE.profile]) STATE.dicts[STATE.profile] = {};

  // ------------------ Themes (existing + your custom ones if you added them) ------------------
  const THEMES = {
    // Dark-ish vibrant
    cyberwave: { bg:'#0a0b1a', ink:'#e7f0ff', sub:'#a5b7ff', chip:'#161a33', chipH:'#1d2446', line:'rgba(167,189,255,.22)', accent:'#7b8cff', grad:'linear-gradient(135deg, rgba(123,140,255,.18), rgba(123,255,218,.12))' },
    aurora:    { bg:'#071722', ink:'#e6fbff', sub:'#bdeaff', chip:'#0f2a3a', chipH:'#13374c', line:'rgba(189,234,255,.20)', accent:'#74f0ff', grad:'linear-gradient(135deg, rgba(116,240,255,.22), rgba(121,196,255,.12))' },
    neonberry: { bg:'#1a0a16', ink:'#ffecf8', sub:'#ffc4e7', chip:'#33152a', chipH:'#421b36', line:'rgba(255,196,231,.22)', accent:'#ff69c9', grad:'linear-gradient(135deg, rgba(255,105,201,.20), rgba(255,223,246,.10))' },
    // Light themes (actually bright)
    cottoncandy: { bg:'#fff6fb', ink:'#1b1020', sub:'#6c4a6f', chip:'#ffe3f3', chipH:'#ffd3ec', line:'rgba(27,16,32,.10)', accent:'#ff52b7', grad:'linear-gradient(135deg, rgba(255,170,221,.30), rgba(255,255,255,.0))' },
    sunrise:     { bg:'#fff6e8', ink:'#1a1208', sub:'#6f5a3a', chip:'#ffe6bf', chipH:'#ffdc9e', line:'rgba(26,18,8,.12)', accent:'#ff8c3a', grad:'linear-gradient(135deg, rgba(255,198,112,.35), rgba(255,255,255,.0))' },
    mintlight:   { bg:'#f4fff9', ink:'#0f241b', sub:'#345a47', chip:'#d7f6e6', chipH:'#c7f0db', line:'rgba(15,36,27,.10)', accent:'#2fd399', grad:'linear-gradient(135deg, rgba(139,255,209,.35), rgba(255,255,255,.0))' },
    // Classic
    midnight:  { bg:'#0f1420', ink:'#eaf0ff', sub:'#b8c1dd', chip:'#2b3043', chipH:'#3a415a', line:'rgba(234,240,255,.14)', accent:'#8aa8ff', grad:'linear-gradient(135deg, rgba(138,168,255,.14), rgba(15,20,32,.0))' }
  };

  function injectThemeVars(themeName) {
    const t = THEMES[themeName] || THEMES.cyberwave;
    let tag = document.getElementById('ep-theme-live');
    const css = `#ep-assist-wrap{--ep-bg:${t.bg};--ep-ink:${t.ink};--ep-sub:${t.sub};--ep-chip:${t.chip};--ep-chip-hover:${t.chipH};--ep-line:${t.line};--ep-accent:${t.accent};--ep-grad:${t.grad||'none'};}`;
    if (!tag) { tag = document.createElement('style'); tag.id = 'ep-theme-live'; document.head.appendChild(tag); }
    tag.textContent = css;
  }

  // ------------------ Fonts (Lato preferred) ------------------
  (function injectFonts(){
    if (!document.getElementById('ep-fonts')) {
      const l = document.createElement('link');
      l.id = 'ep-fonts';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700;800&display=swap';
      document.head.appendChild(l);
    }
  })();

  // ------------------ Styles (UI improvements + theme select text black) ------------------
  GM_addStyle(`
    #ep-assist-wrap, #ep-assist-wrap *, #ep-study-wrap, #ep-study-wrap * {
      font-family: "Lato","Aptos","Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif !important;
    }
    .ep-hidden{display:none !important}

    .ep-panel{
      position:fixed; z-index:2147483647;
      width:700px; background:var(--ep-bg); background-image:var(--ep-grad);
      color:var(--ep-ink); border-radius:16px;
      border:1px solid var(--ep-line);
      box-shadow:0 26px 70px rgba(0,0,0,.6);
      overflow:hidden; user-select:none; resize:both;
      min-width:520px; min-height:360px;
      backdrop-filter:saturate(120%) blur(6px)
    }
    .ep-topbar{ display:flex; align-items:center; gap:10px; padding:12px 14px; background:rgba(255,255,255,.06); cursor:move; white-space:nowrap }
    .ep-brand{ font:800 15px/1 "Lato","Aptos","Segoe UI",system-ui,-apple-system,Roboto,sans-serif; margin-right:auto; letter-spacing:.2px }
    .ep-select,.ep-input{
      -webkit-appearance:none; appearance:none;
      background:var(--ep-chip);
      color:var(--ep-ink);
      padding:10px 34px 10px 14px; border:1px solid var(--ep-line);
      border-radius:12px; font:600 12.5px/1 "Lato","Aptos","Segoe UI",system-ui,-apple-system,Roboto,sans-serif;
      outline:none; transition: box-shadow .15s ease, background .15s ease, transform .05s ease;
    }
    /* Theme dropdown text should be black */
    #ep-theme.ep-select { color:#000 !important; }
    #ep-theme option { color:#000; }
    .ep-input:focus, .ep-select:focus { box-shadow:0 0 0 2px var(--ep-accent); }

    .ep-toprow{ display:flex; gap:8px; align-items:center }
    .ep-caret{ position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; opacity:.8 }
    .ep-iconbar{ display:flex; gap:8px; margin-left:8px }
    .ep-ibtn{
      min-width:28px; height:28px; padding:0 8px; display:inline-flex; align-items:center; justify-content:center;
      background:var(--ep-chip); border:1px solid var(--ep-line); border-radius:10px; cursor:pointer; font-weight:800; color:var(--ep-ink);
      transition: transform .06s ease, background .1s ease
    }
    .ep-ibtn:hover{ background:var(--ep-chip-hover) }
    .ep-ibtn:active{ transform: translateY(1px) }
    .ep-subhdr{ display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(255,255,255,.04); border-top:1px solid var(--ep-line); border-bottom:1px solid var(--ep-line) }

    .ep-body{ padding:12px; display:flex; flex-direction:column; gap:10px; height: calc(100% - 116px) }
    .ep-search{ display:flex; gap:8px; align-items:center }
    .ep-search input{ flex:1 }

    .ep-controls{ display:flex; gap:8px; flex-wrap:wrap; margin-top:2px; align-items:center }
    .ep-btn{
      border:1px solid var(--ep-line); padding:8px 14px; border-radius:999px; background:var(--ep-chip); color:var(--ep-ink); cursor:pointer; font:800 12.5px/1 "Lato","Aptos","Segoe UI",system-ui,-apple-system,Roboto,sans-serif;
      transition: transform .06s ease, background .1s ease
    }
    .ep-btn:hover{ background:var(--ep-chip-hover) }
    .ep-btn:active{ transform: translateY(1px) }
    .ep-btn.small{ padding:5px 10px; font-weight:700; opacity:.95 }

    #ep-assist-results{ flex:1; min-height:130px; overflow:auto; border-top:1px dashed var(--ep-line); padding-top:8px; display:flex; flex-direction:column; gap:8px }
    .ep-sugg{
      padding:11px 12px; border-radius:14px;
      background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03));
      border:1px solid var(--ep-line);
      display:flex; justify-content:space-between; gap:12px; cursor:pointer; outline:0;
      transition: transform .06s ease, background .1s ease
    }
    .ep-sugg:hover,.ep-sugg[aria-selected="true"]{ background:rgba(255,255,255,.12) }
    .ep-sugg:active{ transform: translateY(1px) }
    .ep-sugg b{ font-weight:800 }
    .ep-sugg i{ font-style:normal; color:var(--ep-sub) }
    .ep-right{ opacity:.85; font-size:12px }
    .ep-collapsed .ep-body{ display:none }

    .ep-settings{ position:absolute; inset:50px 10px 10px 10px; background:rgba(0,0,0,.35); backdrop-filter: blur(6px); border:1px solid var(--ep-line); border-radius:12px; padding:12px; overflow:auto }
    .ep-settings h4{ margin:6px 0 8px 0; font-size:13px }
    .ep-grid{ display:grid; grid-template-columns: 1fr auto; gap:8px; align-items:center }
    .ep-kbd{ padding:4px 8px; border-radius:8px; border:1px solid var(--ep-line); background:rgba(255,255,255,.06) }

    .ep-overlay{ position:fixed; z-index:2147483646; left:50%; top:14px; transform:translateX(-50%); background:var(--ep-bg); color:var(--ep-ink); padding:8px 12px; border-radius:10px; border:1px solid var(--ep-line); box-shadow:0 12px 24px rgba(0,0,0,.35) }
    .ep-minihelp{ color:var(--ep-sub); font-size:11px; opacity:.95 }

    /* Study View + Backdrop (kept if you still use it) */
    .ep-backdrop{
      position:fixed; inset:0; z-index:2147483645;
      background:rgba(0,0,0,.45); backdrop-filter: blur(2px);
    }
    .ep-study-wrap{
      position:fixed; z-index:2147483646; inset:40px;
      background:var(--ep-bg); background-image:var(--ep-grad); color:var(--ep-ink);
      border:1px solid var(--ep-line); border-radius:14px;
      box-shadow:0 24px 60px rgba(0,0,0,.55); display:flex; flex-direction:column
    }
    .ep-study-top{ display:flex; align-items:center; gap:8px; padding:10px; border-bottom:1px solid var(--ep-line) }
    .ep-study-body{ flex:1; overflow:auto; padding:10px }
    .ep-table{ width:100%; border-collapse:collapse; font:600 13px "Lato","Aptos","Segoe UI",system-ui,-apple-system,Roboto,sans-serif }
    .ep-table th,.ep-table td{ border-bottom:1px dashed var(--ep-line); padding:8px 6px; text-align:left }
    .ep-table th{ position:sticky; top:0; background:rgba(0,0,0,.06) }
  `);

  // ------------------ Utils ------------------
  function notify(text){ try{ GM_notification({ title:'Educated Perfection', text, timeout:1600 }); } catch { console.log('[EP]', text); } }
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // no diacritic normalization, per spec
  function stripDiacritics(s){ return s; }
  function cleanString(s){
    // keep diacritics; just trim and simplify separators
    return String(s||'').replace(/\([^)]*\)/g,'').replace(/\s+/g,' ').trim().split(/[;|,]/)[0].trim();
  }
  function cmp(a,b){ return a===b ? 0 : a>b ? 1 : -1; }

  function getActiveDict(){ return STATE.dicts[STATE.profile] || (STATE.dicts[STATE.profile] = {}); }
  function setActiveDict(obj){ STATE.dicts[STATE.profile] = obj; persistDicts(); }
  function persistDicts(){ Store.set(KEY.dicts, STATE.dicts); }

  function setInputValue(el,val){
    if (!el) return;
    const isCE = el.getAttribute && el.getAttribute('contenteditable') === 'true';
    if (isCE) { el.focus(); document.execCommand('selectAll', false, null); document.execCommand('insertText', false, val); return; }
    el.focus(); el.value = val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }

  // scoring
  function scorePair(q, k, v){
    if (!q) return 0;
    const s = STATE.settings.caseSensitive ? String(q) : String(q).toLowerCase();
    const key0 = STATE.settings.caseSensitive ? String(k) : String(k).toLowerCase();
    const val0 = STATE.settings.caseSensitive ? String(v) : String(v).toLowerCase();
    const key = cleanString(key0), val = cleanString(val0); const qc = cleanString(s);
    let sc = 0;
    if (key0 === s || val0 === s) sc += 120;
    if (key === qc || val === qc) sc += 90;
    if (key.startsWith(qc) || val.startsWith(qc)) sc += 35;
    if (key.includes(qc) || val.includes(qc)) sc += 22;
    const lenDiff = Math.abs((val||'').length - (qc||'').length);
    sc += Math.max(0, 16 - Math.min(16, lenDiff));
    return sc;
  }

  function topSuggestions(query, limit=9){
    const dict = getActiveDict(); const ent = Object.entries(dict);
    if (!query || !ent.length) return [];
    return ent.map(([k,v])=>[k,v,scorePair(query,k,v)])
      .filter(x=>x[2]>0)
      .sort((a,b)=>b[2]-a[2])
      .slice(0,limit);
  }

  function fmtConfidence(sc){ if (!STATE.settings.showConfidence) return ''; const pct = Math.max(1, Math.min(100, Math.round(sc))); return pct + '%'; }

  function suggestProfileName(){
    const texts = qsa('h1,h2,h3,.title,[aria-label],[data-testid]').map(el=>el.textContent.trim()).filter(Boolean).slice(0,20).join(' ');
    const hint = (texts.match(/([A-Za-zÀ-ž]+)\s*[→>-]\s*([A-Za-zÀ-ž]+)/) || [])[0];
    return hint || 'Profile '+(Object.keys(STATE.dicts).length+1);
  }

  // ------------------ Dragging / placement ------------------
  function restorePanelPos(el){
    const pos = Store.get(KEY.pos, null);
    const vw = window.innerWidth, vh = window.innerHeight;
    const def = { left: 16, top: 16, w: Math.min(740, vw-32), h: 540 };
    const p = pos ? { ...def, ...pos } : def;
    el.style.left = Math.max(0, Math.min(vw - 300, p.left)) + 'px';
    el.style.top  = Math.max(0, Math.min(vh - 180, p.top)) + 'px';
    el.style.width  = p.w + 'px';
    el.style.height = p.h + 'px';
  }
  function savePanelPos(el){
    const r = el.getBoundingClientRect();
    Store.set(KEY.pos, { left: Math.round(r.left), top: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
  }
  function edgeSnap(el){
    if (!STATE.settings.edgeSnap) return;
    const r = el.getBoundingClientRect(); const margin = 8; const vw = window.innerWidth; const vh = window.innerHeight;
    const snapLeft = Math.abs(r.left - margin) < 24;
    const snapRight = Math.abs((vw - (r.left + r.width)) - margin) < 24;
    const snapTop = Math.abs(r.top - margin) < 24;
    const snapBottom = Math.abs((vh - (r.top + r.height)) - margin) < 24;
    if (snapLeft) el.style.left = margin + 'px';
    if (snapRight) el.style.left = (vw - r.width - margin) + 'px';
    if (snapTop) el.style.top = margin + 'px';
    if (snapBottom) el.style.top = (vh - r.height - margin) + 'px';
  }
  function makeDraggable(panel, handle){
    let sx=0,sy=0,sl=0,st=0,drag=false, moved=false;
    handle.addEventListener('mousedown', e=>{
      if (e.button !== 0) return;
      if (e.target.closest('select, button, input, textarea, label')) return;
      drag=true; moved=false; const r=panel.getBoundingClientRect();
      sx=e.clientX; sy=e.clientY; sl=r.left; st=r.top;
    });
    window.addEventListener('mousemove', e=>{
      if(!drag) return; const dx=e.clientX-sx, dy=e.clientY-sy;
      if (!moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) { moved = true; e.preventDefault(); }
      if (!moved) return;
      panel.style.left=Math.max(0, Math.min(window.innerWidth-panel.offsetWidth, sl+dx))+'px';
      panel.style.top =Math.max(0, Math.min(window.innerHeight-panel.offsetHeight, st+dy))+'px';
    });
    window.addEventListener('mouseup', ()=>{
      if(!drag) return; drag=false; edgeSnap(panel); savePanelPos(panel);
    });
    const ro = new ResizeObserver(()=> savePanelPos(panel));
    ro.observe(panel);
  }

  // ------------------ UI ------------------
  function ensureAssistUI(){
    if(qs('#ep-assist-wrap')) return;
    const wrap = document.createElement('div');
    wrap.id = 'ep-assist-wrap';
    wrap.className = 'ep-panel';

    wrap.innerHTML = `
      <div class="ep-topbar" id="ep-topbar">
        <div class="ep-brand">Educated Perfection PRO</div>
        <div class="ep-toprow">
          <div class="ep-theme-wrap" style="position:relative">
            <select id="ep-theme" class="ep-select" title="Theme">
              ${Object.keys(THEMES).map(k=>`<option value="${k}">${k[0].toUpperCase()+k.slice(1)}</option>`).join('')}
            </select>
            <span class="ep-caret">▾</span>
          </div>
          <div class="ep-theme-wrap" style="position:relative; display:flex; gap:6px; align-items:center">
            <label style="font:700 12px; opacity:.9">Profile</label>
            <select id="ep-profile" class="ep-select" title="Select profile"></select>
            <button id="ep-prof-add" class="ep-ibtn" title="New profile">＋</button>
            <button id="ep-prof-ren" class="ep-ibtn" title="Rename profile">✎</button>
            <button id="ep-prof-del" class="ep-ibtn" title="Delete profile">🗑</button>
          </div>
        </div>
        <div class="ep-iconbar">
          <button id="ep-study" class="ep-ibtn" title="Open Study View">📚</button>
          <button id="ep-settings-btn" class="ep-ibtn" title="Settings">⚙</button>
          <!-- collapse removed previously -->
          <button id="ep-min" class="ep-ibtn" title="Minimize (${STATE.hotkeys.togglePanel})">—</button>
        </div>
      </div>
      <div class="ep-subhdr">
        <div class="left">Translations</div>
        <div class="right"><span id="ep-status">Ready</span></div>
      </div>
      <div class="ep-body">
        <div class="ep-search">
          <input id="ep-search" class="ep-input" type="text" placeholder="Search your dictionary or leave blank to use the current question"/>
        </div>
        <div id="ep-assist-results" role="listbox" aria-label="Suggestions"></div>
        <div class="ep-controls">
          <button id="ep-capture" class="ep-btn" title="Capture word list (${STATE.hotkeys.capture})">Capture</button>
          <button id="ep-clear" class="ep-btn" title="Clear the dictionary">Clear</button>
          <span class="ep-right" id="ep-stats"></span>
          <span style="flex:1"></span>
          <button id="ep-export" class="ep-btn small" title="Export to JSON">Export</button>
          <button id="ep-import" class="ep-btn small" title="Import JSON">Import</button>
        </div>
        <div class="ep-minihelp">Hotkeys: ${STATE.hotkeys.togglePanel} toggle • ${STATE.hotkeys.capture} capture • ${STATE.hotkeys.openSearch} focus search • ${STATE.hotkeys.prevSuggestion}/${STATE.hotkeys.nextSuggestion} select • ${STATE.hotkeys.showHUD} show hotkeys</div>
      </div>
      <div id="ep-settings" class="ep-settings ep-hidden" aria-hidden="true">
        <h4>Settings</h4>
        <div class="ep-grid">
          <label title="Shows a % hint based on how closely an entry matches the query">Show confidence %</label><input type="checkbox" id="ep-cfg-conf">
          <label title="If on, comparisons do not lower-case; exact case must match">Case sensitive matching</label><input type="checkbox" id="ep-cfg-case">
          <label title="Treat é=e, ñ=n when matching">Normalize diacritics</label><input type="checkbox" id="ep-cfg-dia">
          <label title="Open panel automatically when the question changes (ignored if you manually minimized)">Auto-open on new question</label><input type="checkbox" id="ep-cfg-open">
          <label title="Snap panel to edges when dropped near borders">Edge snap on drag</label><input type="checkbox" id="ep-cfg-snap">
        </div>
        <h4 style="margin-top:10px">Hotkeys</h4>
        <div id="ep-hotkeys" class="ep-grid"></div>
        <div style="margin-top:8px; display:flex; gap:8px">
          <button id="ep-reset-hotkeys" class="ep-btn">Reset hotkeys</button>
          <button id="ep-close-settings" class="ep-btn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    // Position, theme, profile
    restorePanelPos(wrap);
    makeDraggable(wrap, qs('#ep-topbar'));
    const themeSel = qs('#ep-theme');
    themeSel.value = STATE.theme; injectThemeVars(STATE.theme);
    themeSel.addEventListener('change', ()=>{ STATE.theme = themeSel.value; Store.set(KEY.theme, STATE.theme); injectThemeVars(STATE.theme); nudgeReflow(wrap); });

    // Profiles
    const profSel = qs('#ep-profile');
    const btnAdd = qs('#ep-prof-add'), btnRen = qs('#ep-prof-ren'), btnDel = qs('#ep-prof-del');
    function refreshProfiles(){
      profSel.innerHTML = '';
      const names = Object.keys(STATE.dicts).sort(cmp);
      if (!names.includes(STATE.profile)) names.push(STATE.profile);
      for (const n of names) { const opt = document.createElement('option'); opt.value = n; opt.textContent = n; profSel.appendChild(opt); }
      profSel.value = STATE.profile;
    }
    refreshProfiles();

    profSel.addEventListener('change', ()=>{ STATE.profile = profSel.value; Store.set(KEY.profile, STATE.profile); refreshAssist(true); updateStats(); });

    btnAdd.onclick = ()=> {
      const nm = prompt('New profile name', suggestProfileName()); if (!nm) return;
      if (STATE.dicts[nm]) { alert('Profile already exists.'); return; }
      STATE.dicts[nm] = {}; STATE.profile = nm; Store.set(KEY.profile, nm); persistDicts(); refreshProfiles(); refreshAssist(true); updateStats();
    };
    btnRen.onclick = ()=> {
      const nm = prompt('Rename profile', STATE.profile); if (!nm || nm === STATE.profile) return;
      if (STATE.dicts[nm]) { alert('Target name already exists.'); return; }
      STATE.dicts[nm] = getActiveDict(); delete STATE.dicts[STATE.profile]; STATE.profile = nm; Store.set(KEY.profile, nm); persistDicts(); refreshProfiles(); refreshAssist(true); updateStats();
    };
    btnDel.onclick = ()=> {
      if (!confirm('Delete profile "'+STATE.profile+'"? This cannot be undone.')) return;
      delete STATE.dicts[STATE.profile];
      STATE.profile = Object.keys(STATE.dicts)[0] || 'Default';
      if (!STATE.dicts[STATE.profile]) STATE.dicts[STATE.profile] = {};
      Store.set(KEY.profile, STATE.profile); persistDicts(); refreshProfiles(); refreshAssist(true); updateStats();
    };

    // Buttons
    qs('#ep-min').onclick = () => setMinimized(true, true);
    qs('#ep-capture').onclick = ()=> capturePairs();
    qs('#ep-export').onclick = ()=> exportDictJSON();
    qs('#ep-import').onclick = ()=> importDictJSON();
    qs('#ep-clear').onclick = ()=> clearDict();
    const svBtn = qs('#ep-study'); if (svBtn) svBtn.onclick = ()=> openStudyView();

    // Search
    const search = qs('#ep-search');
    search.addEventListener('input', ()=> refreshAssist(false));

    // Settings view
    const setBtn = qs('#ep-settings-btn');
    if (setBtn) setBtn.onclick = ()=> toggleSettings(true);
    const closeSet = qs('#ep-close-settings');
    if (closeSet) closeSet.onclick = ()=> toggleSettings(false);

    // Settings inputs
    const cConf = qs('#ep-cfg-conf'), cCase = qs('#ep-cfg-case'), cDia = qs('#ep-cfg-dia'), cOpen = qs('#ep-cfg-open'), cSnap = qs('#ep-cfg-snap');
    if (cConf) cConf.checked = !!STATE.settings.showConfidence;
    if (cCase) cCase.checked = !!STATE.settings.caseSensitive;
    if (cDia)  cDia.checked  = false; // force off visibly too
    if (cOpen) cOpen.checked = !!STATE.settings.autoOpenOnQuestion;
    if (cSnap) cSnap.checked = !!STATE.settings.edgeSnap;

    if (cConf) cConf.onchange = e=> saveSetting('showConfidence', e.target.checked);
    if (cCase) cCase.onchange = e=> saveSetting('caseSensitive', e.target.checked);
    if (cDia)  cDia.onchange  = ()=> { STATE.settings.normalizeDiacritics = false; Store.set(KEY.settings, STATE.settings); };
    if (cOpen) cOpen.onchange = e=> saveSetting('autoOpenOnQuestion', e.target.checked);
    if (cSnap) cSnap.onchange = e=> saveSetting('edgeSnap', e.target.checked);

    // Hotkeys editor
    buildHotkeysEditor();
    const hkReset = qs('#ep-reset-hotkeys'); if (hkReset) hkReset.onclick = ()=>{ STATE.hotkeys = { ...DEFAULTS.hotkeys }; Store.set(KEY.hotkeys, STATE.hotkeys); buildHotkeysEditor(); };

    // Initial draw
    updateStats();
    updateStatus('Ready');
    if (STATE.minimized) setMinimized(true);
  }

  function updateStatus(msg){ const s = qs('#ep-status'); if (s) s.textContent = msg; }
  function showOverlay(msg){ const n = document.createElement('div'); n.className='ep-overlay'; n.textContent = msg; document.body.appendChild(n); setTimeout(()=> n.remove(), 1100); }
  function updateStats(){ const st = qs('#ep-stats'); if (!st) return; const size = Object.keys(getActiveDict()).length; st.textContent = `Entries: ${size}${STATE.captureCount?` • Last capture +${STATE.captureCount}`:''}`; STATE.captureCount = 0; }
  function nudgeReflow(el){ el.style.transform='translateZ(0)'; requestAnimationFrame(()=> { el.style.transform=''; }); }

  function toggleSettings(show){ const st = qs('#ep-settings'); if (!st) return; st.classList.toggle('ep-hidden', !show); st.setAttribute('aria-hidden', String(!show)); }
  function saveSetting(k, v){ STATE.settings[k] = v; Store.set(KEY.settings, STATE.settings); }

  function buildHotkeysEditor(){
    const cont = qs('#ep-hotkeys'); if (!cont) return; cont.innerHTML = '';
    const entries = Object.entries(STATE.hotkeys);
    for (const [act, combo] of entries) {
      const lab = document.createElement('label'); lab.textContent = act;
      const box = document.createElement('input'); box.className='ep-kbd'; box.value = combo; box.readOnly = true; box.title = 'Click then press new combo';
      box.addEventListener('keydown', e=>{
        e.preventDefault(); e.stopPropagation();
        // do not allow modifier-only combos (fixes "Alt opens menu" trap)
        if (['Alt','Control','Shift','Meta'].includes(e.key)) return;
        const comboNew = comboFromEvent(e);
        box.value = comboNew; STATE.hotkeys[act] = comboNew; Store.set(KEY.hotkeys, STATE.hotkeys); updateHotkeyTitleRefs();
      });
      cont.appendChild(lab); cont.appendChild(box);
    }
    updateHotkeyTitleRefs();
  }
  function updateHotkeyTitleRefs(){
    const m = STATE.hotkeys;
    const btnMin = qs('#ep-min'); if (btnMin) btnMin.title = 'Minimize (' + m.togglePanel + ')';
    const btnCap = qs('#ep-capture'); if (btnCap) btnCap.title = 'Capture (' + m.capture + ')';
  }

  // ------------------ Rendering ------------------
  function renderSuggestions(list){
    const res = qs('#ep-assist-results'); if(!res) return;
    res.innerHTML = '';
    if(!list.length){ res.innerHTML = '<div style="opacity:.85; padding:6px 2px">No suggestions.</div>'; return; }
    const selIdx = Math.max(1, Math.min(list.length, STATE.selectedIndex));
    list.forEach(([k,v,sc],i)=>{
      const row = document.createElement('div');
      row.className = 'ep-sugg';
      row.setAttribute('role','option');
      row.setAttribute('tabindex','0');
      row.setAttribute('aria-selected', String(i+1 === selIdx));
      row.dataset.index = i+1;
      const conf = fmtConfidence(sc);
      row.innerHTML = `<b>${i+1}. ${escapeHtml(v||k)}</b><i>${escapeHtml(k||'')}${conf?` • ${conf}`:''}</i>`;
      row.onclick = () => insertIntoAnswer(v||k);
      res.appendChild(row);
    });
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch])); }

  // ------------------ Capture (robust, row-paired, visible-only) ------------------
  function isVisible(el){
    if (!el) return false;
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    // must be on-screen-ish and have size
    return r && r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0;
  }
  function findRowContainer(el){
    // smallest ancestor that contains exactly 1 base + 1 target
    let n = el;
    for (let depth = 0; depth < 6 && n; depth++){
      const b = n.querySelectorAll(SEL.baseList);
      const t = n.querySelectorAll(SEL.targetList);
      if (b.length === 1 && t.length === 1) return n;
      n = n.parentElement;
    }
    return null;
  }

  function capturePairs(){
    const baseEls = qsa(SEL.baseList).filter(isVisible);
    const targetEls = qsa(SEL.targetList).filter(isVisible);
    if (!baseEls.length || !targetEls.length) {
      notify('No pairs found. Make sure you are on the word list page and the items are visible.');
      return;
    }

    const dict = { ...getActiveDict() };
    let added = 0;
    const seenContainers = new Set();

    // 1) Preferred: per-row containers (most accurate on EP lists)
    for (const b of baseEls){
      const cont = findRowContainer(b);
      if (!cont || seenContainers.has(cont)) continue;
      const be = cont.querySelector(SEL.baseList);
      const te = cont.querySelector(SEL.targetList);
      if (!be || !te || !isVisible(be) || !isVisible(te)) continue;
      const bRaw = be.textContent.trim();
      const tRaw = te.textContent.trim();
      if (!bRaw || !tRaw) continue;

      const bc = cleanString(bRaw), tc = cleanString(tRaw);
      if (dict[bRaw] !== tc) { dict[bRaw] = tc; added++; }
      if (dict[tRaw] !== bc) { dict[tRaw] = bc; added++; }
      if (dict[bc]   !== tc) { dict[bc]   = tc; added++; }
      if (dict[tc]   !== bc) { dict[tc]   = bc; added++; }

      seenContainers.add(cont);
    }

    // 2) Fallback: old equal-length list capture but only on visible items
    if (added === 0) {
      const bases = baseEls.map(e=>e.textContent.trim()).filter(Boolean);
      const targets = targetEls.map(e=>e.textContent.trim()).filter(Boolean);
      if (bases.length && bases.length === targets.length) {
        for (let i=0;i<bases.length;i++){
          const bRaw = bases[i], tRaw = targets[i];
          const bc = cleanString(bRaw), tc = cleanString(tRaw);
          if (dict[bRaw] !== tc) { dict[bRaw] = tc; added++; }
          if (dict[tRaw] !== bc) { dict[tRaw] = bc; added++; }
          if (dict[bc]   !== tc) { dict[bc]   = tc; added++; }
          if (dict[tc]   !== bc) { dict[tc]   = bc; added++; }
        }
      }
    }

    if (!added) { notify('No row-paired items detected. Try scrolling the list into view.'); return; }
    setActiveDict(dict); STATE.captureCount = added; updateStats();
    notify('Captured '+added+' entries.');
    refreshAssist(true);
  }

  // ------------------ Export / Import ------------------
  function exportDictJSON(){
    const data = JSON.stringify(getActiveDict(), null, 2);
    const blob=new Blob([data],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ep_dict_'+safeFile(STATE.profile)+'.json'; a.click(); URL.revokeObjectURL(a.href);
  }
  function safeFile(s){ return String(s).replace(/[^A-Za-z0-9._-]/g,'_'); }

  function importDictJSON(){
    const inp=document.createElement('input'); inp.type='file'; inp.accept='application/json';
    inp.onchange=()=>{
      const f=inp.files && inp.files[0]; if(!f) return;
      const r=new FileReader();
      r.onload=()=>{
        try{
          const j=JSON.parse(String(r.result||'{}'));
          if(typeof j!== 'object' || Array.isArray(j)) throw 0;
          const dict = getActiveDict();
          let merged = 0; for (const [k,v] of Object.entries(j)) { if (dict[k] !== v) { dict[k]=v; merged++; } }
          setActiveDict(dict); updateStats(); notify('Imported '+merged+' entries.'); refreshAssist(true);
        } catch { notify('Invalid file.'); }
      };
      r.readAsText(f);
    };
    inp.click();
  }

  function clearDict(){ if(!confirm('Clear all entries in profile "'+STATE.profile+'"?')) return; setActiveDict({}); updateStats(); refreshAssist(true); }

  function insertIntoAnswer(txt){ const box=qs(SEL.answerBox); if(!box) { notify('Answer box not found.'); return; } setInputValue(box, txt); showOverlay('Pasted'); }

  function computeSuggestions(){
    const qEl = qs(SEL.question); const qText = qEl ? qEl.textContent.trim() : '';
    const manual = (qs('#ep-search') || {}).value || '';
    const query = manual || qText;
    const list = topSuggestions(query, 9);
    return list;
  }
  function refreshAssist(resetIndex){
    const list = computeSuggestions();
    if (resetIndex) STATE.selectedIndex = 1;
    renderSuggestions(list);
  }

  // ------------------ Hotkeys ------------------
  function comboFromEvent(e){
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.metaKey) parts.push('Meta');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    let key = e.key; if (key === ' ') key = 'Space';
    parts.push(key.length === 1 ? key.toUpperCase() : key);
    return parts.join('+');
  }
  function matchesCombo(e, combo){
    if (!combo) return false;
    const parts = combo.split('+'); const need = { Ctrl:false, Meta:false, Alt:false, Shift:false }; let key = null;
    for (const p of parts) { if (need.hasOwnProperty(p)) need[p] = true; else key = p; }
    if (!!need.Ctrl !== !!e.ctrlKey) return false;
    if (!!need.Meta !== !!e.metaKey) return false;
    if (!!need.Alt !== !!e.altKey) return false;
    if (!!need.Shift !== !!e.shiftKey) return false;
    const ek = (e.key.length===1? e.key.toUpperCase(): (e.key===' ' ? 'Space' : e.key));
    return !key ? false : ek === key; // require a real non-modifier key
  }

  window.addEventListener('keydown', (e)=>{
    // ignore plain modifier presses entirely (fixes "Alt opens menu")
    if (['Alt','Control','Shift','Meta'].includes(e.key)) return;

    const isTyping = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable')==='true');
    const HK = STATE.hotkeys;

    if (matchesCombo(e, HK.togglePanel)) { e.preventDefault(); e.stopPropagation(); togglePanel(); return; }
    if (matchesCombo(e, HK.capture))     { e.preventDefault(); capturePairs(); return; }
    if (matchesCombo(e, HK.openSearch))  { e.preventDefault(); const s=qs('#ep-search'); if (s) { s.focus(); s.select(); } return; }
    if (matchesCombo(e, HK.showHUD))     { e.preventDefault(); if (STATE.settings.hudOnAltH) showOverlay(Object.entries(STATE.hotkeys).map(([a,c])=>`${a}: ${c}`).join('  |  ')); return; }

    // suggestion nav requires a modifier; if user is typing, don't steal keys
    if (!(e.altKey || e.ctrlKey || e.metaKey)) return;
    if (matchesCombo(e, HK.nextSuggestion)) { e.preventDefault(); moveSelection(1); return; }
    if (matchesCombo(e, HK.prevSuggestion)) { e.preventDefault(); moveSelection(-1); return; }
    if (isTyping) return;
  }, true);

  function togglePanel(){ if (!qs('#ep-assist-wrap')) ensureAssistUI(); if (STATE.minimized) { setMinimized(false); STATE.minimizedSticky = 0; Store.set(KEY.minSticky, 0); } else { setMinimized(true, true); } }
  function setMinimized(min, sticky){ const wrap = qs('#ep-assist-wrap'); if(!wrap) return; wrap.style.display = min ? 'none' : 'block'; STATE.minimized = min?1:0; Store.set(KEY.minimized, STATE.minimized); if (typeof sticky === 'boolean') { STATE.minimizedSticky = sticky?1:0; Store.set(KEY.minSticky, STATE.minimizedSticky); } }
  function moveSelection(d){ const list = computeSuggestions(); if (!list.length) return; const n = list.length; STATE.selectedIndex = ((STATE.selectedIndex-1 + d + n) % n) + 1; renderSuggestions(list); }

  // ------------------ Observers ------------------
  const domObs = new MutationObserver(()=>{
    ensureAssistUI();
    const q=qs(SEL.question); const t=q?q.textContent.trim():'';
    if(t!==STATE.lastQ){
      STATE.lastQ=t;
      clearTimeout(refreshAssist._t);
      refreshAssist._t=setTimeout(()=>{
        if (STATE.settings.autoOpenOnQuestion && !STATE.minimizedSticky) setMinimized(false);
        refreshAssist(true);
      },120);
    }
  });
  domObs.observe(document.documentElement,{ childList:true, subtree:true });

  // ------------------ Study View (with backdrop if used) ------------------
  function openStudyView(){
    const old = qs('#ep-study-wrap'); if (old) old.remove();
    const oldB = qs('#ep-study-backdrop'); if (oldB) oldB.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'ep-backdrop';
    backdrop.id = 'ep-study-backdrop';
    document.body.appendChild(backdrop);

    const wrap = document.createElement('div'); wrap.className='ep-study-wrap'; wrap.id='ep-study-wrap';
    wrap.innerHTML = `
      <div class="ep-study-top">
        <b style="font:800 14px">Study View — ${escapeHtml(STATE.profile)}</b>
        <input id="ep-sv-filter" class="ep-input" placeholder="Filter (matches key or value)" style="margin-left:12px; flex:1; max-width:400px">
        <button id="ep-sv-shuffle" class="ep-btn">Shuffle</button>
        <button id="ep-sv-copy" class="ep-btn small" title="Copy as TSV">Copy</button>
        <button id="ep-sv-close" class="ep-btn">Close</button>
      </div>
      <div class="ep-study-body">
        <table class="ep-table" id="ep-sv-table">
          <thead><tr><th style="width:48%">Base</th><th>Target</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>`;
    document.body.appendChild(wrap);

    function rows(filter = ''){
      const dict = getActiveDict();
      const items = Object.entries(dict)
        .filter(([k,v]) => k && v && k !== v)
        .filter(([k,v]) => !filter || (k.toLowerCase().includes(filter) || v.toLowerCase().includes(filter)));
      const seen = new Set();
      const out = [];
      for (const [k,v] of items) {
        const key = k+'→'+v, rev = v+'→'+k;
        if (seen.has(key) || seen.has(rev)) continue;
        seen.add(key); out.push([k,v]);
      }
      return out;
    }
    function render(filter=''){
      const body = qs('#ep-sv-table tbody'); body.innerHTML = '';
      for (const [k,v] of rows(filter.toLowerCase())) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td>`;
        body.appendChild(tr);
      }
    }
    function closeSV(){ const b=qs('#ep-study-backdrop'); if (b) b.remove(); const w=qs('#ep-study-wrap'); if (w) w.remove(); }

    qs('#ep-sv-filter').addEventListener('input', e=> render(e.target.value));
    qs('#ep-sv-close').onclick = closeSV;
    backdrop.addEventListener('click', closeSV);

    qs('#ep-sv-shuffle').onclick = ()=>{
      const arr = rows(qs('#ep-sv-filter').value.toLowerCase());
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      const body = qs('#ep-sv-table tbody'); body.innerHTML = '';
      for (const [k,v] of arr) { const tr = document.createElement('tr'); tr.innerHTML = `<td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td>`; body.appendChild(tr); }
    };
    qs('#ep-sv-copy').onclick = ()=>{
      const tsv = rows(qs('#ep-sv-filter').value.toLowerCase()).map(([k,v])=>`${k}\t${v}`).join('\n');
      if (navigator.clipboard?.writeText) { navigator.clipboard.writeText(tsv).then(()=> showOverlay('Copied')); }
      else { const ta=document.createElement('textarea'); ta.value=tsv; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); showOverlay('Copied'); }
    };

    render('');
  }

  // ------------------ Console API ------------------
  window.EP = {
    open: ()=>{ if(!qs('#ep-assist-wrap')) ensureAssistUI(); STATE.minimizedSticky = 0; Store.set(KEY.minSticky, 0); setMinimized(false); },
    capture: capturePairs,
    search: (q)=>{ const inp=qs('#ep-search'); if (inp){ inp.value=String(q||''); refreshAssist(true); } },
    insert: (text)=>{ const box=qs(SEL.answerBox); setInputValue(box, text); },
    setTheme: (t)=>{ const sel=qs('#ep-theme'); if(sel){ sel.value=t; sel.dispatchEvent(new Event('change',{bubbles:true})); } },
    setProfile: (p)=>{ const sel=qs('#ep-profile'); if(sel){ sel.value=p; sel.dispatchEvent(new Event('change',{bubbles:true})); } }
  };

  // ------------------ Init ------------------
  ensureAssistUI();

})();

// ==UserScript==
// @name         Sinister Streets Tower UI - new tower -
// @namespace    http://tampermonkey.net/
// @version      100.1
// @description  Sinister Streets Tower UI
// @match        https://sinisterstreets.com/tower.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554695/Sinister%20Streets%20Tower%20UI%20-%20new%20tower%20-.user.js
// @updateURL https://update.greasyfork.org/scripts/554695/Sinister%20Streets%20Tower%20UI%20-%20new%20tower%20-.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ---------------- helpers ---------------- */
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
const visibleEl = (e) => e && e.offsetParent !== null &&
  getComputedStyle(e).display !== 'none' &&
  getComputedStyle(e).visibility !== 'hidden';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hexOk = (h) => /^#[0-9a-fA-F]{6}$/.test(h);
const stripHTML = (s) => s.replace(/<[^>]*>/g, '').trim();
const span = (t)=>{ const s=document.createElement('span'); s.textContent=t; return s; };
const isDesktop = matchMedia('(pointer: fine)').matches;

/* -------- robust stat readers -------- */
const getHP = () => {
  let e = qs('#player-hp-value');
  if (e) { const m = e.textContent.match(/(\d+)\s*\/\s*(\d+)/); if (m) return (+m[1]/+m[2])*100; }
  e = qs('#health-value'); // fallback
  if (e) { const m = e.textContent.match(/(\d+)\s*\/\s*(\d+)/); if (m) return (+m[1]/+m[2])*100; }
  const f = qs('#health-bar') || qs('#player-hp-bar') || qs('.stat-fill.health');
  if (f) { const raw = (f.style.width || getComputedStyle(f).width || '').toString(); const pct = parseFloat(raw.replace('%','')); if (!Number.isNaN(pct)) return pct; }
  return null;
};
const getEP = () => { const e = qs('#energy-value'); if (!e) return null; const m = e.textContent.match(/(\d+)\s*\/\s*(\d+)/); return m ? (+m[1]/+m[2])*100 : null; };
const getSP = () => { const e = qs('#stamina-value'); if (!e) return null; const m = e.textContent.match(/(\d+)\s*\/\s*(\d+)/); return m ? (+m[1]/+m[2])*100 : null; };
const getFloor = () => { const b = qs('.tower-progress-label-compact .floor-badge'); return b ? (+b.textContent.replace(/\D/g,''))||0 : 0; };

/* wait for layout anchor (stats bar) */
function waitForStats() {
  const sb = qs('.stats-bar');
  if (!sb) return setTimeout(waitForStats, 200);
  init(sb);
}

/* ---------------- main ---------------- */
function init(statsBar) {
  /* === gameplay & UI state === */
  const s = {
    // Items
    useHealthKit: JSON.parse(localStorage.ss_useHealthKit ?? true),
    useCandyCorn: JSON.parse(localStorage.ss_useCandyCorn ?? false),
    healthThreshold: +localStorage.ss_healthThreshold || 50,

    useEnergyPill:  JSON.parse(localStorage.ss_useEnergyPill  ?? false),
    useEnergyBar:   JSON.parse(localStorage.ss_useEnergyBar   ?? false),
    useEnergyDrink: JSON.parse(localStorage.ss_useEnergyDrink ?? false),
    energyThreshold: +localStorage.ss_energyThreshold || 40,

    useMouldyApple: JSON.parse(localStorage.ss_useMouldyApple ?? false),
    useStamJuice:   JSON.parse(localStorage.ss_useStamJuice   ?? false),
    useStamRoids:   JSON.parse(localStorage.ss_useStamRoids   ?? false),
    staminaThreshold: +localStorage.ss_staminaThreshold || 40,

    // Play style
    enableNextFloor:   JSON.parse(localStorage.ss_enableNextFloor   ?? true),
    enableRepeatFloor: JSON.parse(localStorage.ss_enableRepeatFloor ?? false),
    enableEndRun:      JSON.parse(localStorage.ss_enableEndRun      ?? false),
    endRunFloor: +localStorage.ss_endRunFloorThreshold || 0,
  };

  /* === advanced settings === */
  const adv = {
    debug: JSON.parse(localStorage.ss_debugMode ?? false),
    refreshRate: clamp(+localStorage.ss_refreshRate || 120, 50, 500),

    // Look & feel
    uiColor: (localStorage.ss_uiColor && hexOk(localStorage.ss_uiColor)) ? localStorage.ss_uiColor : '#222222',
    uiOpacity: clamp(+localStorage.ss_uiOpacity || 1.0, 0.5, 1.0),
    uiFontSize: clamp(+localStorage.ss_uiFontSize || 14, 12, 20),
    fontWhite: JSON.parse(localStorage.ss_fontWhite ?? true),

    // Placement
    anchorPos: localStorage.ss_anchorPos || 'center',
    floating: JSON.parse(localStorage.ss_floating ?? true),

    // Alerts
    highlightLowResource: JSON.parse(localStorage.ss_highlightLowResource ?? true),
    lowResourceThreshold: clamp(+localStorage.ss_lowResourceThreshold || 5, 1, 20),
    beepOnAlert: JSON.parse(localStorage.ss_beepOnAlert ?? false),
    beepVolume: clamp(+localStorage.ss_beepVolume || 20, 0, 100),

    // Sizes
    minWidth: 280,
    maxCardWidth: 420,
    maxCardHeightVh: clamp(+localStorage.ss_maxCardHeightVh || 80, 60, 100),

    // Delays
    delayMin: clamp(+localStorage.ss_delayMin || 200, 0, 4000),
    delayMax: clamp(+localStorage.ss_delayMax || 800, 0, 4000),

    // Drop chime (independent)
    dropSound: JSON.parse(localStorage.ss_dropSound ?? true),
    dropVolume: clamp(+localStorage.ss_dropVolume || 50, 0, 100),
  };
  const randDelay = () => Math.floor(Math.random() * (adv.delayMax - adv.delayMin + 1)) + adv.delayMin;

  /* ---------------- DEBUG CONSOLE ---------------- */
  let debugRoot = null, debugList = null;
  const MAX_STORE = 10000, LINE_EM = 1.45, LINES = 8;
  function setDebugEnabled(on) {
    adv.debug = !!on; localStorage.ss_debugMode = adv.debug;
    if (adv.debug) makeDebugUI(); else destroyDebugUI();
  }
  function makeDebugUI() {
    if (debugRoot) debugRoot.remove();
    debugRoot = document.createElement('div');
    Object.assign(debugRoot.style, {
      position: 'fixed', bottom: '0', right: '0',
      width: 'min(92vw,380px)', background: 'rgba(20,20,20,0.78)', color: '#fff',
      borderRadius: '10px 10px 0 0', boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      zIndex: '2147483647', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      touchAction: 'none'
    });
    const hdr = document.createElement('div');
    hdr.textContent = 'Debug Console';
    Object.assign(hdr.style, { padding: '6px 10px', fontWeight: 'bold', textAlign: 'center', background: 'rgba(255,255,255,0.10)', userSelect: 'none' });
    debugList = document.createElement('div');
    Object.assign(debugList.style, {
      padding: '8px 10px 10px', overflowY: 'auto', overflowX: 'hidden',
      maxHeight: `${Math.round(LINE_EM * LINES * 12)}px`,
      fontSize: '12px', lineHeight: String(LINE_EM), whiteSpace: 'pre-wrap'
    });
    debugRoot.append(hdr, debugList);
    document.body.appendChild(debugRoot);
    try {
      const arr = JSON.parse(localStorage.ss_debugLog || '[]');
      const frag = document.createDocumentFragment();
      arr.forEach(line => { const div = document.createElement('div'); div.textContent = line; frag.appendChild(div); });
      debugList.appendChild(frag);
      debugList.scrollTop = debugList.scrollHeight;
    } catch {}
  }
  function destroyDebugUI() {
    if (debugRoot) debugRoot.remove();
    debugRoot = null; debugList = null;
    localStorage.removeItem('ss_debugLog');
  }
  function saveDebug(line) {
    try {
      const arr = JSON.parse(localStorage.ss_debugLog || '[]');
      arr.push(line);
      while (arr.length > MAX_STORE) arr.shift();
      localStorage.ss_debugLog = JSON.stringify(arr);
    } catch {}
  }
  function logDebug(msg) {
    if (!adv.debug) return;
    const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
    saveDebug(line);
    if (debugList) {
      const div = document.createElement('div');
      div.textContent = line;
      debugList.appendChild(div);
      debugList.scrollTop = debugList.scrollHeight;
    }
    console.log('%c[SS Tower]', 'color:#9afc9a;font-weight:bold;', msg);
  }
  if (adv.debug) makeDebugUI();

  /* -------- Audio: (1) Low-resource alert beep, (2) Drop chime -------- */
  function playBeep(type) {
    if (!adv.beepOnAlert || !adv.highlightLowResource) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const gain = ctx.createGain();
    gain.gain.value = clamp((adv.beepVolume / 100) * 0.75, 0, 1);
    gain.connect(ctx.destination);

    const chime = (baseFreq, duration, startTime) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(baseFreq, startTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, startTime);
      osc1.connect(gain);
      osc2.connect(gain);
      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    let t = ctx.currentTime;
    if (type === "low") {
      chime(660, 0.5, t);
    } else {
      chime(880, 0.45, t);
      t += 0.35;
      chime(1040, 0.45, t);
    }

    gain.gain.setTargetAtTime(0, ctx.currentTime + 1, 0.3);
    setTimeout(() => ctx.close(), 2000);
  }

  function playDropChime() {
    if (!adv.dropSound) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = clamp(adv.dropVolume / 100, 0, 1);
    master.connect(ctx.destination);

    const tone = (freq, t0, dur, type="sine", detune=0) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (detune) osc.detune.setValueAtTime(detune, t0);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.8, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(g); g.connect(master);
      osc.start(t0); osc.stop(t0 + dur + 0.05);
    };

    const now = ctx.currentTime;
    tone(880, now, 0.35, "sine", -5);
    tone(1108.73, now + 0.12, 0.4, "sine", +6);
    tone(1760, now + 0.02, 0.25, "triangle", -8);

    setTimeout(() => ctx.close(), 1200);
  }

  /* -------- main container -------- */
  const cont = document.createElement('div'); cont.id = 'ss-tower-ui';
  applyCardStyles(cont, adv);
  mountUnderStatsBar(cont);

  // Scrollbar styling
  const style = document.createElement('style');
  style.textContent = `
    #ss-tower-ui .scroll-area::-webkit-scrollbar { width: 6px; }
    #ss-tower-ui .scroll-area::-webkit-scrollbar-thumb { background-color: rgba(40,40,40,0.8); border-radius: 4px; }
    #ss-tower-ui .scroll-area::-webkit-scrollbar-track { background-color: rgba(10,10,10,0.3); }
    #ss-tower-ui .scroll-area { scrollbar-width: thin; scrollbar-color: rgba(40,40,40,0.8) rgba(10,10,10,0.3); }
  `;
  document.head.appendChild(style);

  // Header group: pinned tabs + dynamic button (stay visible)
  const headerGroup = document.createElement('div');
  Object.assign(headerGroup.style, { position:'relative',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    gap:'4px',
    padding:'6px 0 0 0',
    flex:'0 0 auto',
  });
  cont.appendChild(headerGroup);

  /* -------- dynamic button (pinned) -------- */
  const dyn = document.createElement('button');
  dyn.id = 'ss-dyn-btn';
  dyn.className = 'tower-btn';
  Object.assign(dyn.style, { width: '180px', height: '42px', fontSize: '16px', transition: 'opacity .2s', zIndex: '2147483647', alignSelf: 'center' });
  headerGroup.appendChild(dyn);

  let curLabel = '';
  const setDyn = (lbl, fn) => {
    const wrapped = fn ? () => { logDebug(`UI click → ${stripHTML(lbl)}`); fn(); } : null;
    if (curLabel === lbl && wrapped && dyn.onclick) return;
    dyn.innerHTML = lbl; dyn.disabled = !wrapped; dyn.style.opacity = wrapped ? '1' : '0.6'; dyn.onclick = wrapped; curLabel = lbl;
  };

  /* -------- Main Tab bar (pinned, first row) -------- */
  const tabBar = document.createElement('div'); tabBar.className = 'tab-bar';
  Object.assign(tabBar.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '2px',
    flex:'0 0 auto',
  });
  headerGroup.appendChild(tabBar);

  const mkTab = (labelHTML, extraStyle={}) => {
    const el = document.createElement('div');
    el.innerHTML = labelHTML;
    Object.assign(el.style, {
      cursor: 'pointer',
      userSelect: 'none',
      padding: '6px 12px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.08)',
      flex:'0 0 auto'
    }, extraStyle);
    return el;
  };

  const uiTab   = mkTab('🎮 <b>UI Settings</b>');
  const advTab  = mkTab('⚙️ <b>Advanced Settings</b>');
  const soonTab = mkTab('🧭 <b>Coming Soon</b>');
  tabBar.append(uiTab, advTab, soonTab);

  const setActiveMain = (which) => {
    const glow = adv.fontWhite ? '0 0 6px rgba(200,200,200,0.65)' : '0 0 6px rgba(60,60,60,0.65)';
    uiTab.style.textShadow  = (which === 'ui')  ? glow : 'none';
    advTab.style.textShadow = (which === 'adv') ? glow : 'none';
    soonTab.style.textShadow= (which === 'soon')? glow : 'none';
  };

  /* -------- Sub Tab bar (pinned, second row) -------- */
  const subTabBar = document.createElement('div');
  Object.assign(subTabBar.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '0px',
    flex: '0 0 auto',
    paddingTop: '2px',
    paddingBottom: '0px'
  });
  headerGroup.appendChild(subTabBar);

  const dropsTab = mkTab('📦 <b>Drops</b>');
  const itemsTab = mkTab('🧰 <b>Items Used</b>');
  const resetTab = mkTab('🧨 <b>Reset UI</b>', { color:'#ff5a5a' });
  subTabBar.append(dropsTab, itemsTab, resetTab);

  const setActiveSub = (which) => {
    const glow = adv.fontWhite ? '0 0 6px rgba(200,200,200,0.65)' : '0 0 6px rgba(60,60,60,0.65)';
    dropsTab.style.textShadow = (which==='drops') ? glow : 'none';
    itemsTab.style.textShadow = (which==='items') ? glow : 'none';
    resetTab.style.textShadow = (which==='reset') ? glow : 'none';
  };

  /* -------- Scrollable content area (only this scrolls) -------- */
  const scrollArea = document.createElement('div');
  scrollArea.className = 'scroll-area';
  Object.assign(scrollArea.style, {
    overflowY:'auto',
    overflowX:'hidden',
    width:'100%',
    flex:'1 1 auto',
    marginTop:'6px',
  });
  cont.appendChild(scrollArea);

  /* -------- containers that live INSIDE scrollArea -------- */
  const uiWrap = document.createElement('div');
  Object.assign(uiWrap.style, { display: 'none', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%', marginTop: '4px' });
  scrollArea.appendChild(uiWrap);

  const advBodyOuter = document.createElement('div');
  Object.assign(advBodyOuter.style, {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    marginTop: '4px'
  });
  scrollArea.appendChild(advBodyOuter);

  const soonBody = document.createElement('div');
  Object.assign(soonBody.style, { display: 'none', flexDirection:'column', alignItems:'center', gap:'6px', width:'100%', marginTop:'4px' });
  scrollArea.appendChild(soonBody);

  // Sub-tab bodies
  const dropsBody = document.createElement('div');
  const itemsBody = document.createElement('div');
  const resetBody = document.createElement('div');
  [dropsBody, itemsBody, resetBody].forEach(b=>{
    Object.assign(b.style,{
      display:'none',
      flexDirection:'column',
      alignItems:'center',
      gap:'6px',
      width:'100%',
      marginTop:'4px'
    });
    scrollArea.appendChild(b);
  });

  /* -------- Main & Sub tab toggles (UNIFIED) -------- */
  let mainOpen = null; // 'ui'|'adv'|'soon'|null
  let subOpen  = null; // 'drops'|'items'|'reset'|null

  function openMain(which) {
    uiWrap.style.display       = (which === 'ui')   ? 'flex' : 'none';
    advBodyOuter.style.display = (which === 'adv')  ? 'flex' : 'none';
    soonBody.style.display     = (which === 'soon') ? 'flex' : 'none';
    setActiveMain(which);
    mainOpen = which;
    scrollArea.scrollTop = 0;
  }
  function openSub(which) {
    dropsBody.style.display = (which === 'drops') ? 'flex' : 'none';
    itemsBody.style.display = (which === 'items') ? 'flex' : 'none';
    resetBody.style.display = (which === 'reset') ? 'flex' : 'none';
    setActiveSub(which);
    subOpen = which;
    scrollArea.scrollTop = 0;
    if (which === 'drops') renderDrops();
    if (which === 'items') renderItemsUsed();
  }

  // UNIFIED behavior
  uiTab.onclick    = () => { if (isLocked()) return; openSub(null); openMain(mainOpen==='ui'   ? null : 'ui');   };
  advTab.onclick   = () => { if (isLocked()) return; openSub(null); openMain(mainOpen==='adv'  ? null : 'adv');  };
  soonTab.onclick  = () => { if (isLocked()) return; openSub(null); openMain(mainOpen==='soon' ? null : 'soon'); };

  dropsTab.onclick = () => { if (isLocked()) return; openMain(null); openSub(subOpen==='drops' ? null : 'drops'); };
  itemsTab.onclick = () => { if (isLocked()) return; openMain(null); openSub(subOpen==='items' ? null : 'items'); };
  resetTab.onclick = () => { if (isLocked()) return; openMain(null); openSub(subOpen==='reset' ? null : 'reset'); };

  /* -------- UI Settings content (unchanged) -------- */
  const panel = document.createElement('div');
  Object.assign(panel.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' });
  uiWrap.appendChild(panel);

  const mainPanel = document.createElement('div');
  Object.assign(mainPanel.style, {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: '560px',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignSelf: 'center'
  });
  panel.appendChild(mainPanel);

  const sections = [
    { key: 'hp',   title: '🩸 Health'  },
    { key: 'ep',   title: '⚡ Energy'  },
    { key: 'sp',   title: '💪 Stamina' },
    { key: 'play', title: '🎮 Play Style' }
  ];
  const secMap = {};
  sections.forEach(sec => {
    const head = document.createElement('div');
    head.textContent = sec.title;
    Object.assign(head.style, { fontWeight: 'bold', textAlign: 'center', marginTop: '4px' });
    const wrap = document.createElement('div');
    Object.assign(wrap.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' });
    mainPanel.append(head, wrap);
    secMap[sec.key] = wrap;
  });
  const hS = { inner: secMap.hp };
  const eS = { inner: secMap.ep };
  const stS = { inner: secMap.sp };
  const pS = { inner: secMap.play };

  const addThr = (sec, lbl, key, val, field) => {
    const row = document.createElement('div');
    Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' });
    const lab = document.createElement('label'); lab.textContent = lbl + ' ';
    const input = document.createElement('input'); Object.assign(input, { type: 'number', min: '1', max: '100', value: val });
    Object.assign(input.style, { width: '60px', borderRadius: '5px', border: 'none', padding: '2px 3px', textAlign: 'center', height: '20px' });
    const pct = document.createElement('span'); pct.textContent = '%';
    input.onchange = e => {
      let v = +e.target.value || val; v = clamp(v,1,100);
      s[field]=v; localStorage[key]=v; e.target.value=v; logDebug(`${lbl}: ${v}%`);
    };
    row.append(lab, input, pct); sec.append(row);
  };

  // Exclusives (scoped per section)
  const addExclusive = (sec, lbl, key, group) => {
    const lab = document.createElement('label');
    Object.assign(lab.style, { display:'flex', alignItems:'center', gap:'8px', justifyContent:'center' });
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = s[key];
    cb.style.transform = 'scale(1.2)';
    lab.append(cb, document.createTextNode(lbl));
    sec.append(lab);
    cb.onchange = (e) => {
      const parent = sec;
      group.forEach(g => {
        const isThis = g === key;
        s[g] = isThis && e.target.checked;
        localStorage['ss_' + g] = s[g];
      });
      qsa('input[type=checkbox]', parent).forEach(n => {
        if (n !== cb && group.includes(n.dataset.groupKey)) n.checked = false;
      });
      logDebug(`Toggle ${lbl}: ${e.target.checked ? 'ON' : 'OFF'}`);
    };
    cb.dataset.groupKey = key;
  };

  // Health
  addExclusive(hS.inner, 'Health Kit', 'useHealthKit', ['useHealthKit','useCandyCorn']);
  addExclusive(hS.inner, 'Candy Corn', 'useCandyCorn', ['useHealthKit','useCandyCorn']);
  addThr(hS.inner, 'Use below', 'ss_healthThreshold', s.healthThreshold, 'healthThreshold');

  // Energy
  addExclusive(eS.inner, 'Energy Pill',  'useEnergyPill',  ['useEnergyPill','useEnergyBar','useEnergyDrink']);
  addExclusive(eS.inner, 'Energy Bar',   'useEnergyBar',   ['useEnergyPill','useEnergyBar','useEnergyDrink']);
  addExclusive(eS.inner, 'Energy Drink', 'useEnergyDrink', ['useEnergyPill','useEnergyBar','useEnergyDrink']);
  addThr(eS.inner, 'Use below', 'ss_energyThreshold', s.energyThreshold, 'energyThreshold');

  // Stamina
  addExclusive(stS.inner, 'Mouldy Apple', 'useMouldyApple', ['useMouldyApple','useStamJuice','useStamRoids']);
  addExclusive(stS.inner, 'Stam Juice',   'useStamJuice',   ['useMouldyApple','useStamJuice','useStamRoids']);
  addExclusive(stS.inner, 'Stam-roids',   'useStamRoids',   ['useMouldyApple','useStamJuice','useStamRoids']);
  addThr(stS.inner, 'Use below', 'ss_staminaThreshold', s.staminaThreshold, 'staminaThreshold');

  // Play Style
  const playKeys = ['enableNextFloor','enableRepeatFloor','enableEndRun'];
  const updPlay = kOn => { playKeys.forEach(k=>{ s[k]=(k===kOn); localStorage['ss_'+k]=s[k]; }); };
  const addPlay = (lbl, key) => {
    const lab = document.createElement('label'); Object.assign(lab.style, { display:'flex', alignItems:'center', gap:'8px', justifyContent:'center' });
    const c = document.createElement('input'); c.type='checkbox'; c.checked = s[key]; c.style.transform='scale(1.2)';
    lab.append(c, document.createTextNode(lbl)); pS.inner.append(lab);
    c.onchange = e => { if (e.target.checked) { updPlay(key); qsa('input[type=checkbox]', pS.inner).forEach(n => { if (n!==c) n.checked=false; }); logDebug(`Play Style → ${lbl}`); } };
  };
  addPlay('Next Floor', 'enableNextFloor');
  addPlay('Repeat Floor', 'enableRepeatFloor');
  addPlay('Tower Loop', 'enableEndRun');

  const endDiv = document.createElement('div');
  Object.assign(endDiv.style, { display:'flex', alignItems:'center', gap:'8px', justifyContent:'center', flexWrap:'wrap' });
  endDiv.innerHTML = `<label>End Run at Floor <input type="number" min="0" value="${s.endRunFloor}" style="width:80px;margin-left:6px;border:none;border-radius:6px;padding:4px;text-align:center;height:22px;"></label>`;
  pS.inner.append(endDiv);
  endDiv.querySelector('input').onchange = e => { s.endRunFloor = +e.target.value || 0; localStorage.ss_endRunFloorThreshold = s.endRunFloor; logDebug(`End Run Floor → ${s.endRunFloor}`); };

  /* -------- Advanced Settings UI -------- */
  const advCard = document.createElement('div');
  Object.assign(advCard.style, {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: '560px',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignSelf: 'center'
  });
  advBodyOuter.appendChild(advCard);

  const advBody = document.createElement('div');
  Object.assign(advBody.style, { display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', width:'100%' });
  advCard.appendChild(advBody);

  // helpers for rows
  const wrapRow = (el) => { const box=document.createElement('div'); Object.assign(box.style,{display:'flex',flexDirection:'column',gap:'4px',alignItems:'center',width:'100%'}); box.append(el); return box; };
  const addHelpRow = (row, text) => {
    const h=document.createElement('div'); h.textContent=`⤷ ${text}`;
    Object.assign(h.style,{fontStyle:'normal',opacity:.8,fontSize:'13px',textAlign:'center',marginTop:'2px',fontWeight:'400'});
    row.append(h);
  };
  const rowToggle = (label, value, onChange) => {
    const lab = document.createElement('label'); Object.assign(lab.style,{display:'flex',alignItems:'center',gap:'8px',justifyContent:'center'});
    const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=value; cb.style.transform='scale(1.2)';
    lab.append(cb, document.createTextNode(label)); cb.onchange=(e)=>onChange(!!e.target.checked); return wrapRow(lab);
  };
  const rowNumber = (label, value, min, max, onChange) => {
    const box = document.createElement('div'); Object.assign(box.style,{display:'flex',gap:'10px',alignItems:'center',justifyContent:'center',flexWrap:'wrap'});
    const sp = document.createElement('span'); sp.textContent = label;
    const ip = document.createElement('input'); Object.assign(ip,{type:'number', value, min:String(min), max:String(max)});
    ip.style.width='100px'; ip.style.textAlign='center'; ip.style.height='22px'; ip.style.padding='2px 3px';
    ip.onchange = e=> { let v=+e.target.value||value; v=clamp(v,min,max); onChange(v); ip.value=String(v); };
    const row = wrapRow(box); box.append(sp, ip); return row;
  };
  const rowRange = (label, value, min, max, step, onInput, fmt=(v)=>String(v)) => {
    const box = document.createElement('div'); Object.assign(box.style,{display:'flex',gap:'10px',alignItems:'center',justifyContent:'center',flexWrap:'wrap'});
    const sp = document.createElement('span'); sp.textContent=label;
    const ip = document.createElement('input'); Object.assign(ip,{type:'range',min:String(min),max:String(max),step:String(step),value:String(value)});
    const val = document.createElement('span'); val.textContent=fmt(value);
    ip.oninput = e=>{ const v = clamp(parseFloat(e.target.value)||value, min, max); onInput(v); val.textContent=fmt(v); };
    const row = wrapRow(box); box.append(sp, ip, val); return row;
  };
  const rowSelect = (label, options, current, onChange) => {
    const box = document.createElement('div'); Object.assign(box.style,{display:'flex',gap:'10px',alignItems:'center',justifyContent:'center',flexWrap:'wrap'});
    const sp = document.createElement('span'); sp.textContent=label;
    const sel = document.createElement('select');
    options.forEach(opt=>{ const o=document.createElement('option'); o.value=opt; o.textContent=opt[0].toUpperCase()+opt.slice(1); if(opt===current) o.selected=true; sel.appendChild(o); });
    sel.onchange = ()=> onChange(sel.value);
    const row = wrapRow(box); box.append(sp, sel); return row;
  };
  const rowColor = (hex, onChange) => {
    const box = document.createElement('div'); Object.assign(box.style,{display:'flex',gap:'10px',alignItems:'center',justifyContent:'center',flexWrap:'wrap'});
    const pickWrap = document.createElement('label'); Object.assign(pickWrap.style,{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 10px',borderRadius:'8px',background:'rgba(0,0,0,0.35)',border:'1px solid #666',cursor:'pointer'});
    const picker = document.createElement('input'); picker.type='color'; picker.value=hex; Object.assign(picker.style,{width:'28px',height:'28px',border:'none',padding:'0',background:'transparent'});
    const pickLbl = document.createElement('span'); pickLbl.textContent = 'Choose Color';
    pickWrap.append(picker, pickLbl);
    const hexBox = document.createElement('input'); hexBox.type='text'; hexBox.value=hex; hexBox.placeholder='#222222';
    Object.assign(hexBox.style,{width:'110px',borderRadius:'5px',border:'1px solid #666',padding:'2px 4px',color:'inherit',background:'rgba(0,0,0,0.35)',textAlign:'center',height:'22px'});
    const commit = (v)=>{ if(!hexOk(v)) return; onChange(v); picker.value=v; hexBox.value=v; };
    picker.addEventListener('input', e=>commit(e.target.value));
    hexBox.addEventListener('change', e=>commit(e.target.value));
    const row = wrapRow(box); box.append(pickWrap, hexBox); return row;
  };
  const mkSectionTitle = (label) => {
    const t = document.createElement('div');
    t.textContent = label;
    Object.assign(t.style, { fontWeight:'bold', fontSize:'16px', textAlign:'center', marginTop:'4px' });
    return t;
  };

  // TIMING & DELAY
  (function buildTimingSection(){
    const title = mkSectionTitle('⏱ Timing & Delay');
    const section = document.createElement('div'); Object.assign(section.style,{display:'flex',flexDirection:'column',gap:'6px',alignItems:'center'});
    advBody.append(title, section);

    const refRow = rowNumber('Refresh (ms)', adv.refreshRate, 50, 500, (v)=>{ adv.refreshRate=v; localStorage.ss_refreshRate=v; resetUpdateTimer(); logDebug(`Refresh → ${v}ms`); });
    addHelpRow(refRow, 'How often the script checks Tower state.');
    section.append(refRow);

    const delayBox = document.createElement('div'); Object.assign(delayBox.style,{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap',justifyContent:'center'});
    const dMin = document.createElement('input'); Object.assign(dMin, {type:'number', min:'0', max:'4000', value:String(adv.delayMin)}); dMin.style.width='100px'; dMin.style.textAlign='center'; dMin.style.height='22px'; dMin.style.padding='2px 3px';
    const dMax = document.createElement('input'); Object.assign(dMax, {type:'number', min:'0', max:'4000', value:String(adv.delayMax)}); dMax.style.width='100px'; dMax.style.textAlign='center'; dMax.style.height='22px'; dMax.style.padding='2px 3px';
    dMin.onchange = e=>{ adv.delayMin = clamp(+e.target.value||200, 0, 4000); localStorage.ss_delayMin=adv.delayMin; logDebug(`Delay Min → ${adv.delayMin}ms`); };
    dMax.onchange = e=>{ adv.delayMax = clamp(+e.target.value||800, 0, 4000); localStorage.ss_delayMax=adv.delayMax; logDebug(`Delay Max → ${adv.delayMax}ms`); };
    delayBox.append(span('Min'), dMin, span('Max'), dMax);
    const delayRow = wrapRow(delayBox); addHelpRow(delayRow, 'Adds a small random delay between item actions.');
    section.append(delayRow);

    const dbgRow = rowToggle('Enable debug logs (shows popup)', adv.debug, (on)=> setDebugEnabled(on));
    addHelpRow(dbgRow, 'Shows a live log of your clicks & decisions. Clears when disabled.');
    section.append(dbgRow);
  })();

  // COLOR & FONT
  (function buildColorFontSection(){
    const title = mkSectionTitle('🎨 Color & Font');
    const section = document.createElement('div'); Object.assign(section.style,{display:'flex',flexDirection:'column',gap:'6px',alignItems:'center'});
    advBody.append(title, section);

    const colorRowEl = rowColor(adv.uiColor, (hex)=>{ if(!hexOk(hex)) return; adv.uiColor=hex; localStorage.ss_uiColor=hex; cont.style.background=hex; applyLiveLook(cont, adv); logDebug(`UI Color → ${hex}`); });
    addHelpRow(colorRowEl, 'Choose background color (hex picker).');
    section.append(colorRowEl);

    const opRow = rowRange('Opacity', adv.uiOpacity, 0.5, 1, 0.05, (v)=>{ adv.uiOpacity=v; cont.style.opacity=v; localStorage.ss_uiOpacity=v; });
    addHelpRow(opRow, 'Make the UI more/less transparent.');
    section.append(opRow);

    const fsRow = rowRange('Font Size', adv.uiFontSize, 12, 20, 1, (v)=>{ adv.uiFontSize=v; cont.style.fontSize=v+'px'; localStorage.ss_uiFontSize=v; }, (v)=> v+'px');
    addHelpRow(fsRow, 'Adjust text size inside the UI.');
    section.append(fsRow);

    const fontRow = rowToggle('White Text', adv.fontWhite, (on)=>{ adv.fontWhite = !!on; localStorage.ss_fontWhite = adv.fontWhite; applyLiveLook(cont, adv); });
    addHelpRow(fontRow, 'Uncheck for black text (useful if you choose a light background).');
    section.append(fontRow);
  })();

  // POSITION & ALIGNMENT
  (function buildPositionSection(){
    const title = mkSectionTitle('📍 Position & Alignment');
    const section = document.createElement('div'); Object.assign(section.style,{display:'flex',flexDirection:'column',gap:'6px',alignItems:'center'});
    advBody.append(title, section);

    const anchorRow = rowSelect('Anchor Position', ['left','center','right'], adv.anchorPos, (val)=>{ adv.anchorPos=val; localStorage.ss_anchorPos=val; placeCard(cont, adv, true); logDebug(`Anchor → ${val}`); });
    addHelpRow(anchorRow, 'Align the UI left/center/right under the header.');
    section.append(anchorRow);

    const floatingRow = rowToggle('Floating mode (overlay over game)', adv.floating, (on)=>{ adv.floating=on; localStorage.ss_floating=on; placeCard(cont, adv, true); logDebug(`Floating → ${on?'overlay':'in-flow'}`); });
    addHelpRow(floatingRow, 'Overlay = sits on top of game; In-flow = pushes page down.');
    section.append(floatingRow);
  })();

  // LOW RESOURCE ALERTS
  ;(function buildAlertsSection(){
    const title = mkSectionTitle('⚠️ Low Resource & Audio');
    const section = document.createElement('div'); Object.assign(section.style,{display:'flex',flexDirection:'column',gap:'6px',alignItems:'center'});
    advBody.append(title, section);

    const lowRow = rowToggle('Low Resource Pop-Up', adv.highlightLowResource, (on)=>{ adv.highlightLowResource=on; localStorage.ss_highlightLowResource=on; audioWrap.style.display = on?'':'none'; });
    addHelpRow(lowRow, 'Show warm amber when stock is low; red when out.');
    section.append(lowRow);

    const threshRow = rowRange('Low Resource Alert', adv.lowResourceThreshold, 1, 20, 1, (v)=>{ adv.lowResourceThreshold=v; localStorage.ss_lowResourceThreshold=v; }, (v)=> String(v));
    addHelpRow(threshRow, 'Alert when items drop to this number or below.');
    section.append(threshRow);

    var audioWrap = document.createElement('div'); Object.assign(audioWrap.style, { display: adv.highlightLowResource?'':'none', width:'100%' });
    const beepRow = rowToggle('🔊 Beep on Alert', adv.beepOnAlert, (on)=>{ adv.beepOnAlert=on; localStorage.ss_beepOnAlert=on; });
    const volRow  = rowRange('Alert Volume', adv.beepVolume, 0, 100, 1, (v)=>{ adv.beepVolume=v; localStorage.ss_beepVolume=v; }, (v)=> v+'%');
    audioWrap.append(beepRow, volRow);
    addHelpRow(audioWrap, 'Low stock = single chime · Out of stock = double chime.');
    section.append(audioWrap);
  })();

  // DROP NOTIFICATIONS
  ;(function buildDropSection(){
    const title = mkSectionTitle('📦 Drop Notifications');
    const section = document.createElement('div'); Object.assign(section.style,{display:'flex',flexDirection:'column',gap:'6px',alignItems:'center'});
    advBody.append(title, section);

    const toggleRow = rowToggle('Play Chime on Drop', adv.dropSound, (on)=>{ adv.dropSound=on; localStorage.ss_dropSound=on; });
    section.append(toggleRow);

    const volRow  = rowRange('Drop Chime Volume', adv.dropVolume, 0, 100, 1, (v)=>{ adv.dropVolume=v; localStorage.ss_dropVolume=v; }, (v)=> v+'%');
    addHelpRow(volRow, 'Pleasant soft chime when a drop is found.');
    section.append(volRow);
  })();

  // Coming Soon
  ;(function buildSoon(){
    const card=document.createElement('div');
    Object.assign(card.style,{
      background:'rgba(255,255,255,0.08)',
      borderRadius:'10px',
      padding:'10px',
      width:'100%',
      maxWidth:'560px',
      color:'inherit',
      textAlign:'center'
    });
    card.innerHTML='<b>🧭 Coming Soon</b><br><br>More tower analytics, event tracking, and UI tools are on the way.';
    soonBody.appendChild(card);
  })();

  /* -------- Reset UI (SUB TAB now) -------- */
  (function buildResetTab(){
    const card = document.createElement('div');
    Object.assign(card.style, {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '12px',
      width: '100%',
      maxWidth: '560px',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignSelf: 'center'
    });

    const title = document.createElement('div');
    title.textContent = '⚠️ Danger!';
    Object.assign(title.style, { fontWeight:'bold', fontSize:'18px', textAlign:'center', color:'#ff5a5a' });

    const msg = document.createElement('div');
    msg.innerHTML = 'Clicking <b>YES</b> will clear all saved Tower UI data.<br>You’ll have to reconfigure everything from scratch.';
    Object.assign(msg.style, { textAlign:'center' });

    const actions = document.createElement('div');
    Object.assign(actions.style, { display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' });

    const yesBtn = document.createElement('button');
    yesBtn.className = 'tower-btn';
    yesBtn.textContent = 'YES, RESET EVERYTHING';
    Object.assign(yesBtn.style, { background:'#8b0000', color:'#fff', padding:'8px 12px', borderRadius:'8px' });
    yesBtn.onclick = () => {
      if (!confirm('Are you absolutely sure? This will clear all Tower UI settings.')) return;
      Object.keys(localStorage).filter(k=>/^ss_/.test(k)).forEach(k=>localStorage.removeItem(k));
      localStorage.removeItem('sstui_locked');
      location.reload();
    };

    const noBtn = document.createElement('button');
    noBtn.className = 'tower-btn';
    noBtn.textContent = 'NO, CANCEL';
    Object.assign(noBtn.style, { padding:'8px 12px', borderRadius:'8px' });
    noBtn.onclick = () => { openSub(null); };

    actions.append(yesBtn, noBtn);
    card.append(title, msg, actions);
    resetBody.append(card);
  })();

  /* ---------------- LOCK FEATURE ---------------- */
  const LS_LOCK = 'sstui_locked';
  function isLocked() { try { return localStorage.getItem(LS_LOCK) === '1'; } catch { return false; } }
  function setLockedState(v) { try { v ? localStorage.setItem(LS_LOCK,'1') : localStorage.removeItem(LS_LOCK); } catch {} }

  const lockBtn = document.createElement('button');
  Object.assign(lockBtn.style, { position:'absolute', left:'4px', top:'16px', background:'transparent', border:'none', padding:'0', margin:'0', cursor:'default', fontSize:'16px', lineHeight:'1', color:'inherit' });
  lockBtn.id = 'ss-lock-btn';
  lockBtn.title = isLocked() ? 'Unlock UI' : 'Lock UI';

  function setLockIcon(locked) {
    lockBtn.innerHTML = locked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-unlock"></i>';
    lockBtn.title = locked ? 'Unlock UI' : 'Lock UI';
    lockBtn.setAttribute('aria-pressed', locked ? 'true' : 'false');
  }
  setLockIcon(isLocked());
  headerGroup.appendChild(lockBtn);

  function collectInteractives() {
    const nodes = qsa('button, input, select, textarea, a[href], [role="button"]', cont);
    return nodes.filter(el => el !== dyn && el !== lockBtn && !lockBtn.contains(el));
  }
  function setDisabled(els, disabled) {
    els.forEach(el => {
      if ('disabled' in el) el.disabled = !!disabled;
      el.style.pointerEvents = disabled ? 'none' : '';
      if (disabled) { el.setAttribute('aria-disabled','true'); el.setAttribute('tabindex','-1'); }
      else { el.setAttribute('aria-disabled','false'); el.removeAttribute('tabindex'); }
    });
  }
  function applyLock(locked) {
    setLockIcon(locked);
    setDisabled(collectInteractives(), locked);
    if (locked) {
      openMain(null);
      openSub(null);
    }
    cont.setAttribute('data-ss-locked', locked ? '1' : '0');
  }
  applyLock(isLocked());
  lockBtn.addEventListener('click', ()=>{ const newState = !isLocked(); setLockedState(newState); applyLock(newState); });

  /* -------- confirm clone overlay -------- */
  let clone = null;
  function manageClone() {
    const list = ['#item-use-confirm-yes', '#energy-confirm-yes', '#end-run-confirm-yes', '#energy-start-yes'];
    const active = list.find(sel => visibleEl(qs(sel)));
    if (active) {
      const real = qs(active);
      if (real && !clone) {
        const rect = dyn.getBoundingClientRect();
        const c = document.createElement('button'); c.className = 'tower-btn';
        Object.assign(c.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${dyn.offsetWidth}px`, height: `${dyn.offsetHeight}px`, fontSize: '16px', zIndex: '2147483647' });
        const label = real.textContent.trim() || 'Confirm';
        c.innerHTML = `<i class="fas fa-check"></i> ${label}`;
        c.onclick = () => { logDebug(`Confirm: ${label}`); real.click(); };
        document.body.appendChild(c); clone = c;
      }
    } else if (clone) { clone.remove(); clone = null; }
  }

  /* -------- generic popup (used for low-resource alerts) -------- */
  function popup(kind, msg, type = 'out') {
    const colors = { low: 'rgba(255,179,71,0.92)', out: 'rgba(220,40,40,0.92)' };
    const pop = document.createElement('div');
    Object.assign(pop.style, {
      position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
      width: 'min(94vw, 420px)', padding: '12px', textAlign: 'center', fontWeight: 'bold',
      background: colors[type] || colors.out, color: '#fff', borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)', zIndex: '2147483647',
      opacity: '0', transition: 'opacity .2s linear', pointerEvents: 'none'
    });
    const icon = document.createElement('i');
    if (kind === 'hp') icon.className = 'fas fa-heart';
    else if (kind === 'ep') icon.className = 'fas fa-bolt';
    else icon.className = 'fas fa-running';
    const txt = document.createElement('span'); txt.textContent = '  ' + msg;
    pop.append(icon, txt); document.body.appendChild(pop);
    requestAnimationFrame(() => pop.style.opacity = '1');
    playBeep(type);
    const life = (type==='out') ? 2600 : 2200;
    setTimeout(() => { pop.style.opacity = '0'; setTimeout(() => pop.remove(), 220); }, life);
  }

  /* -------- item helpers -------- */
  const healPick   = () => { const a = qsa('.healing-item-btn'); if (s.useCandyCorn) return a.find(x => /Candy/i.test(x.dataset.name || x.textContent)); if (s.useHealthKit) return a.find(x => /Fixers|Health/i.test(x.dataset.name || x.textContent)); };
  const energyPick = () => { const a = qsa('.healing-item-btn'); if (s.useEnergyPill) return a.find(x => /Pill/i.test(x.dataset.name || x.textContent)); if (s.useEnergyBar) return a.find(x => /Bar/i.test(x.dataset.name || x.textContent)); if (s.useEnergyDrink) return a.find(x => /Drink/i.test(x.dataset.name || x.textContent)); };
  const stamPick   = () => { const a = qsa('.healing-item-btn'); if (s.useMouldyApple) return a.find(x => /Mouldy/i.test(x.dataset.name || x.textContent)); if (s.useStamJuice) return a.find(x => /Stam Juice/i.test(x.dataset.name || x.textContent)); if (s.useStamRoids) return a.find(x => /Stam-roids/i.test(x.dataset.name || x.textContent)); };

  function qtyFromBtn(btn) {
    if (!btn) return 0;
    const t = btn.textContent || ''; const m = t.match(/\[(\d+)\]/);
    if (m) return +m[1];
    const ds = btn.dataset && btn.dataset.count; if (ds) return +ds;
    return 0;
  }
  function nameFromBtn(btn) {
    return (btn && (btn.dataset?.name || btn.textContent.trim().replace(/\s*\[\d+\]\s*$/, ''))) || 'Item';
  }

  /* ===================== SESSION ITEMS USED (NEW) ===================== */
  const ITEMS_CANON = ['Health Kit','Candy Corn','Energy Pill','Energy Bar','Energy Drink','Mouldy Apple','Stam Juice','Stam-roids'];
  const ITEMS_MATCHERS = [
    {canon:'Health Kit',   re: /health\s*kit|fixers?/i},
    {canon:'Candy Corn',   re: /candy\s*corn/i},
    {canon:'Energy Pill',  re: /energy\s*pill/i},
    {canon:'Energy Bar',   re: /energy\s*bar/i},
    {canon:'Energy Drink', re: /energy\s*drink/i},
    {canon:'Mouldy Apple', re: /mouldy\s*apple/i},
    {canon:'Stam Juice',   re: /stam\s*juice/i},
    {canon:'Stam-roids',   re: /stam-?roids/i},
  ];
  function canonFromName(nm){
    const txt = (nm||'').toString().trim();
    for (const m of ITEMS_MATCHERS){ if (m.re.test(txt)) return m.canon; }
    return null;
  }
  function loadItemsUsed(){ try { return JSON.parse(sessionStorage.ss_itemsUsedSession || '{}'); } catch { return {}; } }
  function saveItemsUsed(map){ sessionStorage.ss_itemsUsedSession = JSON.stringify(map || {}); }
  function resetItemsUsed(){ saveItemsUsed({}); if (subOpen==='items') renderItemsUsed(); }

  // Sub-tab renderer (Reset button removed; count formatting updated)
  function renderItemsUsed(){
    itemsBody.innerHTML = '';
    const card = document.createElement('div');
    Object.assign(card.style,{
      background:'rgba(255,255,255,0.08)',
      borderRadius:'10px',
      padding:'10px',
      width:'100%',
      maxWidth:'560px',
      color:'inherit',
      display:'flex',
      flexDirection:'column',
      gap:'6px',
      alignSelf:'center'
    });
    const title = document.createElement('div');
    title.innerHTML = '<b>🧰 Items Used (This Run)</b>';
    title.style.textAlign='center';
    card.appendChild(title);

    const map = loadItemsUsed();
    const order = ITEMS_CANON.filter(k => map[k]>0);
    if (order.length === 0){
      const none = document.createElement('div');
      none.textContent = 'No items used yet.';
      none.style.textAlign='center';
      card.appendChild(none);
    } else {
      order.forEach(k=>{
        const row = document.createElement('div');
        // Removed parentheses around count
        row.textContent = `${k} x ${map[k]||0}`;
        row.style.textAlign='center';
        card.appendChild(row);
      });
    }

    // (Reset This Run button removed by request)

    itemsBody.appendChild(card);
  }

  // Battle log observer handle
  const battleLog = document.getElementById('battle-log');

  /* ===================== DROPS TRACKER ===================== */
  function loadDrops() { try { return JSON.parse(localStorage.ss_bossDrops || '[]'); } catch { return []; } }
  function saveDrops(arr) { localStorage.ss_bossDrops = JSON.stringify(arr); }
  function renderDrops() {
    dropsBody.innerHTML = '';
    const list = loadDrops().sort((a,b)=> new Date(b.time)-new Date(a.time));
    const card = document.createElement('div');
    Object.assign(card.style,{
      background:'rgba(255,255,255,0.08)',
      borderRadius:'10px',
      padding:'10px',
      width:'100%',
      maxWidth:'560px',
      color:'inherit',
      display:'flex',
      flexDirection:'column',
      gap:'6px'
    });

    const title = document.createElement('div');
    title.innerHTML = '<b>📦 Recorded Drops</b>';
    title.style.textAlign = 'center';
    card.appendChild(title);

    if (list.length === 0) {
      const none = document.createElement('div');
      none.textContent = 'No drops recorded yet.';
      none.style.textAlign='center';
      card.appendChild(none);
    } else {
      list.forEach((d)=>{
        const line = document.createElement('div');
        const time = new Date(d.time).toLocaleString();
        const star = d.isBoss ? '⭐ ' : '';
        line.textContent = `${time} • Floor ${d.floor} • ${star}${d.item}`;
        line.style.textAlign='center';
        card.appendChild(line);
      });
    }

    const clearBtn = document.createElement('button');
    clearBtn.className = 'tower-btn';
    clearBtn.textContent = 'Clear Drop Log';
    clearBtn.onclick = () => {
      if (confirm('Delete all recorded drops?')) {
        localStorage.removeItem('ss_bossDrops');
        renderDrops();
      }
    };
    clearBtn.style.marginTop = '8px';
    card.appendChild(clearBtn);

    dropsBody.appendChild(card);
  }

  // Observe #battle-log for drops + items used, with strict de-dupe
  if (battleLog) {
    const seenNodes = new WeakSet();
    const seenTexts = new Set(); // extra de-dupe guard

    // Support both old and new formats:
    // Old:  "You found a/an (world|boss) drop: <b>Item</b>"
    // New:  "Boss dropped: <b>Item</b>!"
    const DROP_OLD = /You found (?:a|an)\s+(world|boss)\s+drop:\s*<b>([^<]+)<\/b>/i;
    const DROP_NEW = /Boss dropped:\s*<b>([^<]+)<\/b>/i;

    // Three resilient patterns for "you used ..."
    const usedPatterns = [
      /you used\s*<b>([^<]+)<\/b>/i,                    // HTML bolded item
      /you used[^<]*:\s*<b>([^<]+)<\/b>/i,              // HTML with colon variant
      /you used\s+(?:a|an)?\s*([A-Za-z][\w\s\-']+)/i    // plain text
    ];

    const tryMatchUsed = (htmlOrText) => {
      for (const re of usedPatterns) {
        const m = htmlOrText.match(re);
        if (m) return (m[1]||'').trim();
      }
      return null;
    };

    const obs = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (seenNodes.has(node)) continue;
          let html = '';
          if (node.nodeType === 1) html = node.outerHTML || node.textContent || '';
          else if (node.nodeType === 3) html = node.textContent || '';
          const clean = html || '';
          if (!clean) continue;
          seenNodes.add(node);
          if (seenTexts.has(clean)) continue; // de-dupe identical log lines
          seenTexts.add(clean);
          if (seenTexts.size > 400) { // trim memory
            const arr=[...seenTexts]; seenTexts.clear(); arr.slice(-200).forEach(t=>seenTexts.add(t));
          }

          // Drops (supports both formats)
          let isDrop = false, isBoss = false, item = null;
          const dOld = clean.match(DROP_OLD);
          if (dOld) {
            isDrop = true;
            isBoss = (dOld[1] || '').toLowerCase() === 'boss';
            item = (dOld[2] || '').trim();
          } else {
            const dNew = clean.match(DROP_NEW);
            if (dNew) {
              isDrop = true;
              isBoss = true; // "Boss dropped:" implies boss drop
              item = (dNew[1] || '').trim();
            }
          }

          if (isDrop && item) {
            const floor = getFloor();
            const time = new Date().toISOString();
            const list = loadDrops();
            if (!list.some(x=>x.item===item && x.floor===floor)) {
              list.push({ time, floor, item, isBoss });
              saveDrops(list);
              logDebug(`Drop → ${isBoss ? '⭐ ' : ''}${item} (Floor ${floor})`);
              // Popup
              const pop = document.createElement('div');
              Object.assign(pop.style, {
                position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
                width: 'min(94vw, 420px)', padding: '12px', textAlign: 'center', fontWeight: 'bold',
                background: 'rgba(173,216,230,0.95)', color: '#000', borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.35)', zIndex: '2147483647',
                opacity: '0', transition: 'opacity .25s linear', pointerEvents: 'none'
              });
              const msg = document.createElement('span');
              msg.textContent = `📦 Drop Found: ${isBoss ? '⭐ ' : ''}${item} (Floor ${floor})`;
              pop.append(msg);
              document.body.appendChild(pop);
              requestAnimationFrame(() => pop.style.opacity = '1');
              playDropChime();
              setTimeout(() => { pop.style.opacity = '0'; setTimeout(() => pop.remove(), 250); }, 2600);
              if (subOpen === 'drops') renderDrops();
            }
            continue;
          }

          // Items Used
          const usedRaw = tryMatchUsed(clean);
          if (usedRaw) {
            const canon = canonFromName(usedRaw);
            if (canon) {
              const map = loadItemsUsed();
              map[canon] = (map[canon] || 0) + 1;
              saveItemsUsed(map);
              if (subOpen === 'items') renderItemsUsed();
              logDebug(`Used → ${canon} (${map[canon]})`);
            }
          }
        }
      }
    });
    obs.observe(battleLog, { childList: true, subtree: true });
  }

  /* -------- update loop (dyn button logic) -------- */
  let energyUsedThisFloor = false, lastEnergyUse = 0, timer = null, loopPausedUntil = 0;
  function pause(ms) { loopPausedUntil = Date.now() + ms; }

  let nextCooldownUntil = 0;

  const getFloorClearedState = () => {
    const bar = qs('#floor-cleared-bar'); if (!bar) return null;
    const n = qs('#next-floor-btn', bar), r = qs('#repeat-floor-btn', bar), e = qs('#end-run-here-btn', bar);
    if (visibleEl(n) || visibleEl(r) || visibleEl(e)) return { n, r, e };
    return null;
  };

  async function update() {
    if (Date.now() < loopPausedUntil) return;
    manageClone();

    const atk = qs('#attack-btn');
    const contBtn = qs('#continue-tower-btn');
    const startBtn = qs('#start-tower');
    const items = qs('#use-item-btn');

    const hp = getHP(), ep = getEP(), sp = getSP(), floor = getFloor();

    const cleared = getFloorClearedState();
    if (cleared) {
      const { n, r, e } = cleared;

      if (s.enableEndRun && s.endRunFloor > 0 && floor >= s.endRunFloor && visibleEl(e)) {
        return setDyn('<i class="fas fa-skull"></i> End Run', () => { energyUsedThisFloor = false; e.click(); });
      }

      if (s.enableRepeatFloor && visibleEl(r)) {
        return setDyn('<i class="fas fa-sync"></i> Repeat', () => { energyUsedThisFloor = false; r.click(); });
      }

      if ((s.enableNextFloor || s.enableEndRun) && visibleEl(n)) {
        return setDyn('<i class="fas fa-arrow-up"></i> Next', () => {
          const now = Date.now();
          if (now < nextCooldownUntil) { logDebug('Next blocked (cooldown)'); return; }
          nextCooldownUntil = now + 1000; // 1s guard
          energyUsedThisFloor = false;
          n.click();
        });
      }
    }

    if (visibleEl(startBtn)) return setDyn('<i class="fas fa-play"></i> Start Tower', () => { startBtn.click(); });

    if (hp !== null && hp < s.healthThreshold && (s.useHealthKit || s.useCandyCorn)) {
      if (visibleEl(items)) {
        return setDyn('<i class="fas fa-briefcase-medical"></i> Items', async () => {
          items.click(); await wait(clamp(randDelay(), 100, 1200));
          const pick = healPick(); const qty = qtyFromBtn(pick); const nm = nameFromBtn(pick);
          if (pick) {
            if (adv.highlightLowResource && qty <= adv.lowResourceThreshold) popup('hp', `Only ${qty} ${nm} left!`, 'low');
            pick.click();
          } else {
            popup('hp', 'Out of Healing Items!', 'out'); pause(2500);
          }
        });
      }
      return;
    }

    if (!energyUsedThisFloor && ep !== null && ep < s.energyThreshold &&
      (s.useEnergyPill || s.useEnergyBar || s.useEnergyDrink) &&
      Date.now() - lastEnergyUse > 6000) {
      if (visibleEl(items)) {
        return setDyn('<i class="fas fa-briefcase-medical"></i> Items', async () => {
          items.click(); await wait(clamp(randDelay(), 100, 1200));
          const pick = energyPick(); const qty = qtyFromBtn(pick); const nm = nameFromBtn(pick);
          if (pick) {
            if (adv.highlightLowResource && qty <= adv.lowResourceThreshold) popup('ep', `Only ${qty} ${nm} left!`, 'low');
            energyUsedThisFloor = true; lastEnergyUse = Date.now();
            pick.click();
            const atkBtn = qs('#attack-btn'); if (atkBtn) setDyn('<i class="fas fa-bolt"></i> Attack', () => { atkBtn.click(); });
          } else {
            popup('ep', 'Out of Energy Items!', 'out'); pause(2500);
          }
        });
      }
      return;
    }

    const lowHPorEP = (hp !== null && hp < s.healthThreshold) || (ep !== null && ep < s.energyThreshold);
    if (!lowHPorEP && sp !== null && sp < s.staminaThreshold && (s.useMouldyApple || s.useStamJuice || s.useStamRoids)) {
      if (visibleEl(items)) {
        return setDyn('<i class="fas fa-briefcase-medical"></i> Items', async () => {
          items.click(); await wait(clamp(randDelay(), 100, 1200));
          const pick = stamPick(); const qty = qtyFromBtn(pick); const nm = nameFromBtn(pick);
          if (pick) {
            if (adv.highlightLowResource && qty <= adv.lowResourceThreshold) popup('sp', `Only ${qty} ${nm} left!`, 'low');
            pick.click();
          } else {
            popup('sp', 'Out of Stamina Items!', 'out'); pause(2500);
          }
        });
      }
      return;
    }

    if (visibleEl(atk)) return setDyn('<i class="fas fa-bolt"></i> Attack', () => { atk.click(); });
    if (visibleEl(contBtn)) return setDyn('<i class="fas fa-redo"></i> Continue', () => { contBtn.click(); });
    setDyn('<i class="fas fa-clock"></i> Waiting...', null);
  }

  /* -------- refresh loop -------- */
  function resetUpdateTimer() { if (timer) clearInterval(timer); timer = setInterval(update, adv.refreshRate); }
  resetUpdateTimer(); update();

  /* -------- styles & placement -------- */
  function applyCardStyles(node, adv) {
    Object.assign(node.style, {
      background: hexOk(adv.uiColor) ? adv.uiColor : '#222222',
      borderRadius: '14px', boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
      padding: '12px', marginTop: '6px', width: '95vw', maxWidth: adv.maxCardWidth + 'px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      maxHeight: `${adv.maxCardHeightVh}vh`, overflow: 'hidden', overscrollBehavior: 'contain',
      touchAction: 'pan-y',
      fontSize: adv.uiFontSize + 'px',
      opacity: adv.uiOpacity,
      zIndex: '2147483647'
    });
  }
  function mountUnderStatsBar(el) { if (statsBar && statsBar.parentElement) statsBar.insertAdjacentElement('afterend', el); else document.body.appendChild(el); }
  function placeCard(el, adv) {
    const bar = qs('.stats-bar');
    if (adv.floating) {
      el.style.position = 'fixed';
      if (bar) {
        const r = bar.getBoundingClientRect();
        el.style.top = Math.max(10, Math.round(r.bottom + 4)) + 'px';
        const w = el.offsetWidth;
        if (adv.anchorPos === 'left') { el.style.left = Math.round(r.left + 8) + 'px'; el.style.right = ''; }
        else if (adv.anchorPos === 'right') { el.style.left = Math.round(r.right - w - 8) + 'px'; el.style.right = ''; }
        else { el.style.left = Math.round(r.left + (r.width - w) / 2) + 'px'; el.style.right = ''; }
      } else {
        el.style.top = '60px';
        const w = el.offsetWidth;
        if (adv.anchorPos === 'left') el.style.left = '8px';
        else if (adv.anchorPos === 'right') el.style.left = (window.innerWidth - w - 8) + 'px';
        else el.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
      }
      el.style.zIndex = '2147483647';
    } else {
      el.style.position = 'relative'; el.style.top = ''; el.style.left = ''; el.style.right = ''; el.style.zIndex = 'auto';
      el.style.marginLeft = ''; el.style.marginRight = '';
      if (adv.anchorPos === 'left') { el.style.marginLeft = '8px'; el.style.marginRight = 'auto'; }
      else if (adv.anchorPos === 'right') { el.style.marginLeft = 'auto'; el.style.marginRight = '8px'; }
      else { el.style.marginLeft = 'auto'; el.style.marginRight = 'auto'; }
    }
  }

  function applyLiveLook(el, adv) {
    el.style.opacity = adv.uiOpacity;
    el.style.fontSize = adv.uiFontSize + 'px';
    el.style.background = adv.uiColor;
    el.style.color = adv.fontWhite ? '#ffffff' : '#000000';
    qsa('#ss-tower-ui input, #ss-tower-ui select, #ss-tower-ui textarea, #ss-tower-ui button').forEach(n=>{
      if (n.type === 'color') return;
      n.style.color = adv.fontWhite ? '#ffffff' : '#000000';
      if (['INPUT','SELECT','TEXTAREA'].includes(n.tagName)) {
        if (adv.fontWhite) {
          n.style.background = 'rgba(0,0,0,0.35)';
          n.style.border = '1px solid rgba(255,255,255,0.3)';
        } else {
          n.style.background = 'rgba(255,255,255,0.88)';
          n.style.border = '1px solid rgba(0,0,0,0.25)';
        }
      }
      if (n.tagName === 'BUTTON' && n.className.includes('tower-btn')) {
        n.style.color = adv.fontWhite ? '#ffffff' : '#000000';
      }
    });
  }

  applyLiveLook(cont, adv);
  placeCard(cont, adv, true);

  // Tabs start collapsed by default (no open section)
  openMain(null);
  openSub(null);

  /* -------- global safe-click capture + session reset on Start/End -------- */
  (function(){
    let lastStart=0, lastNext=0;
    document.addEventListener('click', (e)=>{
      const now = Date.now();
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.id === 'start-tower') {
        if (now - lastStart < 6000) { e.stopImmediatePropagation(); e.preventDefault(); return false; }
        lastStart = now;
        resetItemsUsed(); // NEW: reset at Start Tower
      }
      if (btn.id === 'next-floor-btn') {
        if (now - lastNext < 1000) { e.stopImmediatePropagation(); e.preventDefault(); return false; }
        lastNext = now;
      }
      if (btn.id === 'end-run-here-btn') {
        // Reset items upon End Run click
        resetItemsUsed();
      }
    }, true);
  })();

} // end init

/* -------- run -------- */
if (document.readyState === 'complete' || document.readyState === 'interactive') { waitForStats(); }
else { window.addEventListener('DOMContentLoaded', waitForStats); }

})();

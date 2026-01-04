// ==UserScript==
// @name         Challenge Link Generator (World)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Randomize mode->map->timer, create Geoguessr challenge links and push to Google Sheet. Interval in seconds; robust child-tab close (parent fallback + multiple child close fallbacks). Adds 5s delay before deleting the child tab. Uses React Fiber onChange for reliable slider set. Weighted mode selection & expanded map pools. Mode posted as pretty label ("Moving"/"No Move"/"NMPZ").
// @author       You
// @match        https://www.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      script.google.com
// @downloadURL https://update.greasyfork.org/scripts/555782/Challenge%20Link%20Generator%20%28World%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555782/Challenge%20Link%20Generator%20%28World%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzWblyQ1r7rKrPOzHcuSpZjCS5AMZpbypVwGDRQY9BNW7mx7KqgU89IdTsk5GwnNiV5/exec";
  const SECRET = "ThisIsAVerySecretSecret";
  const TARGET_SHEET = "Sheet1"; // explicit sheet target for this script

  const MAPS = {
    moving: [
      { name: "An Informed World", url: "https://www.geoguessr.com/maps/676340ae2f718dbabdf30331" },
      { name: "An Official World", url: "https://www.geoguessr.com/maps/652ba0d9002aa0d36f996153" },
      { name: "A Community World", url: "https://www.geoguessr.com/maps/62a44b22040f04bd36e8a914" },
      { name: "A Tweaked World", url: "https://www.geoguessr.com/maps/64205c50e014cf9bb1a04e01" }
    ],
    nomove: [
      { name: "A Varied World", url: "https://www.geoguessr.com/maps/64ce812adc7614680516ff8c" },
      { name: "A Competitive World", url: "https://www.geoguessr.com/maps/668ea3252973190af74233b5" },
      { name: "An Arbitrary Rural World", url: "https://www.geoguessr.com/maps/643dbc7ccc47d3a344307998" },
      { name: "A Pro World", url: "https://www.geoguessr.com/maps/6620b311f64a7b842b2ca83a" },
      { name: "An Improved World", url: "https://www.geoguessr.com/maps/5b0a80f8596695b708122809" },
      { name: "A Souvlaki World", url: "https://www.geoguessr.com/maps/66c65a243165335bb951ec5b" },
      { name: "Dirty World", url: "https://www.geoguessr.com/maps/63f3ff1e0355e40ded075e0c" },
      { name: "A Rainbolt World", url: "https://www.geoguessr.com/maps/65c86935d327035509fd616f" },
      { name: "Less-Extreme Region Guessing", url: "https://www.geoguessr.com/maps/658a3ef12255cca9e7f39c06" },
      { name: "GeoTime", url: "https://www.geoguessr.com/maps/63c23ec9563ddfcf1b8cd67e" },
      { name: "A Pro-Gamer World", url: "https://www.geoguessr.com/maps/669fc42c1d248092df0c5155" },
      { name: "Geoguessr Saturday", url: "https://www.geoguessr.com/maps/661ecb894e20c3a560ef26eb" },
      { name: "BRRRRRRRR", url: "https://www.geoguessr.com/maps/6760eebfd424c6e85409ced0" },
      { name: "AI Generated World", url: "https://www.geoguessr.com/maps/5dbaf08ed0d2a478444d2e8e" },
      { name: "A NoruJumping World", url: "https://www.geoguessr.com/maps/66d3dfcceb6dd31fd6db1c5e" }
    ],
    nmpz: [
      { name: "A Varied World", url: "https://www.geoguessr.com/maps/64ce812adc7614680516ff8c" },
      { name: "A Competitive World", url: "https://www.geoguessr.com/maps/668ea3252973190af74233b5" },
      { name: "An Arbitrary Rural World", url: "https://www.geoguessr.com/maps/643dbc7ccc47d3a344307998" },
      { name: "A Pro World", url: "https://www.geoguessr.com/maps/6620b311f64a7b842b2ca83a" },
      { name: "An Improved World", url: "https://www.geoguessr.com/maps/5b0a80f8596695b708122809" },
      { name: "A Souvlaki World", url: "https://www.geoguessr.com/maps/66c65a243165335bb951ec5b" },
      { name: "Dirty World", url: "https://www.geoguessr.com/maps/63f3ff1e0355e40ded075e0c" },
      { name: "A Rainbolt World", url: "https://www.geoguessr.com/maps/65c86935d327035509fd616f" },
      { name: "Less-Extreme Region Guessing", url: "https://www.geoguessr.com/maps/658a3ef12255cca9e7f39c06" },
      { name: "GeoTime", url: "https://www.geoguessr.com/maps/63c23ec9563ddfcf1b8cd67e" },
      { name: "A Skewed World", url: "https://www.geoguessr.com/maps/6165f7176c26ac00016bca3d" },
      { name: "A Curated Planet", url: "https://www.geoguessr.com/maps/642a97be3c5b7968a1eb1af3" },
      { name: "A Pro-Gamer World", url: "https://www.geoguessr.com/maps/669fc42c1d248092df0c5155" },
      { name: "Geoguessr Saturday", url: "https://www.geoguessr.com/maps/661ecb894e20c3a560ef26eb" },
      { name: "BRRRRRRRR", url: "https://www.geoguessr.com/maps/6760eebfd424c6e85409ced0" },
      { name: "AI Generated World", url: "https://www.geoguessr.com/maps/5dbaf08ed0d2a478444d2e8e" },
      { name: "A NoruJumping World", url: "https://www.geoguessr.com/maps/66d3dfcceb6dd31fd6db1c5e" }
    ]
  };

  const TIMER_RANGES = { moving:[40,80], nomove:[20,40], nmpz:[10,40] };

  // DEFAULT_INTERVAL now in seconds (change while testing if you want a smaller default)
  const DEFAULT_INTERVAL_SECONDS = 15;
  const BUSY_TIMEOUT_MS = 5 * 60 * 1000;

  // Delay before closing child windows (milliseconds)
  const CHILD_CLOSE_DELAY_MS = 5000;

  // BroadcastChannel for parent<->child cooperation (if available)
  let bc = null; try { bc = new BroadcastChannel('gg-gen-channel'); } catch(e){ bc = null; }

  let busy=false, queue=0, busyTimeoutId=null, currentRequestId=null;

  // track opened windows by request id so the parent can forcibly close them if needed
  const openWindows = {};

  GM_addStyle(`
    #gg-gen-panel { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; background: rgba(20,20,25,0.95); color: #fff; padding: 10px 12px; border-radius:10px; font-family: Arial, sans-serif; font-size:13px; box-shadow: 0 6px 18px rgba(0,0,0,0.4); max-width: 420px; }
    #gg-gen-panel button { margin:4px; padding:6px 8px; background:#2d7ef7; color:#fff; border:none; border-radius:6px; cursor:pointer; }
    #gg-gen-panel input, #gg-gen-panel select { margin:4px 2px; padding:4px; border-radius:6px; border:1px solid #666; background:#111; color:#fff; }
    #gg-gen-log { max-height:220px; overflow:auto; margin-top:6px; font-size:12px; color:#ddd; background:rgba(255,255,255,0.02); padding:6px; border-radius:6px; }
  `);

  function createPanel(){
    if (document.getElementById('gg-gen-panel')) return document.getElementById('gg-gen-panel');
    const p = document.createElement('div'); p.id='gg-gen-panel';
    p.innerHTML = `
      <div style="font-weight:bold;margin-bottom:6px">World Generator</div>
      <div>
        <button id="gg-toggle">Start</button>
        <button id="gg-now">Generate Now</button>
        Interval (sec): <input id="gg-interval" type="number" min="1" value="${DEFAULT_INTERVAL_SECONDS}" style="width:100px"/>
      </div>
      <div style="margin-top:6px">Mode preference: <select id="gg-modepref"><option value="any">Any</option><option value="moving">Moving</option><option value="nomove">No Move</option><option value="nmpz">NMPZ</option></select></div>
      <div id="gg-gen-log"></div>
    `;
    document.body.appendChild(p);
    setTimeout(()=>{ document.getElementById('gg-toggle')?.addEventListener('click', toggleRunning); document.getElementById('gg-now')?.addEventListener('click', ()=>{ if (isAutoChild()) { log('Generate controls disabled in auto-challenge tab.'); return; } generateAndOpen(); }); },300);
    return p;
  }

  const panel = createPanel();
  function log(msg){ try{ const box=document.getElementById('gg-gen-log'); if (box){ const line=document.createElement('div'); line.textContent = `[${(new Date()).toLocaleTimeString()}] ${msg}`; box.prepend(line); } console.log('[GeoGen]',msg);}catch(e){console.log('[GeoGen]',msg);} }

  function isAutoChild(){ try{ return new URL(location.href).searchParams.get('auto_challenge')==='1'; }catch(e){ return false; } }
  if (isAutoChild()) panel.style.display='none'; else panel.style.display='block';
  document.addEventListener('keydown',(e)=>{ if (e.ctrlKey && e.shiftKey && (e.key==='G'||e.key==='g')){ const p=document.getElementById('gg-gen-panel'); if(p) p.style.display=(p.style.display==='none')?'block':'none'; log('Panel toggled by keyboard'); } });

  let running=false, intervalId=null;

  // Weighted mode picker:
  // moving: 10%, nomove: 55%, nmpz: 40%
  function pickMode(pref){
    if (pref && pref!=='any') return pref;
    const r = Math.random();
    if (r < 0.1) return 'moving';
    if (r < 0.1 + 0.55) return 'nomove';
    return 'nmpz';
  }

  function pickMapForMode(mode){ const pool=MAPS[mode]; return pool[Math.floor(Math.random()*pool.length)]; }
  function pickTimer(mode){ const r=TIMER_RANGES[mode]; return Math.floor(Math.random()*(r[1]-r[0]+1))+r[0]; }

  function toggleRunning(){ if (isAutoChild()){ log('Generate controls disabled in auto-challenge tab.'); return; } running=!running; document.getElementById('gg-toggle').textContent = running ? 'Stop' : 'Start'; if (running){ const secs = parseInt(document.getElementById('gg-interval').value,10)||DEFAULT_INTERVAL_SECONDS; intervalId=setInterval(()=>generateAndOpen(), secs*1000); log(`Auto mode ON — every ${secs} seconds`);} else { clearInterval(intervalId); intervalId=null; log('Auto mode OFF'); } }

  // parent: handle messages from child windows or BroadcastChannel
  function handleChannelMessage(m){
    try{
      const data = (m && m.data) ? m.data : m;
      if(!data) return;

      // special explicit close request from child (fallback when child couldn't close itself)
      if (data && data.type === 'gg-close-request' && data.id) {
        try {
          const w = openWindows[data.id];
          if (w && !w.closed) {
            // delay close by CHILD_CLOSE_DELAY_MS
            setTimeout(()=>{
              try {
                if (w && !w.closed) {
                  w.close();
                  log(`Parent closed child tab on explicit request (id=${data.id}) after ${CHILD_CLOSE_DELAY_MS}ms delay`);
                }
              } catch(e) { console.warn('parent close-request error', e); }
              try{ delete openWindows[data.id]; }catch(e){}
            }, CHILD_CLOSE_DELAY_MS);
          } else {
            try{ delete openWindows[data.id]; }catch(e){}
          }
        }catch(e){ console.warn('parent close-request error', e); }
        return;
      }

      if (data.type === 'gg-gen-done') {
        // ignore old responses
        if (data.id && currentRequestId && data.id !== currentRequestId) {
          log(`Received done for old id ${data.id} (current ${currentRequestId}) — ignoring.`);
          return;
        }
        busy = false;
        currentRequestId = null;
        if (busyTimeoutId){ clearTimeout(busyTimeoutId); busyTimeoutId = null; }
        log(`Child finished${data.mapName? ' — '+data.mapName: ''}${data.link? ' (link found)':''}${data.sheetOk? ' — sheet ok':''}.`);

        // Parent fallback: close the child window after CHILD_CLOSE_DELAY_MS
        try {
          if (data.id && openWindows[data.id]) {
            const w = openWindows[data.id];
            setTimeout(()=>{
              try {
                if (w && !w.closed) {
                  w.close();
                  log(`Closed child tab for id ${data.id} (parent fallback, ${CHILD_CLOSE_DELAY_MS}ms delay).`);
                }
              } catch(e) { console.warn('Error parent-closing child window', e); }
              try{ delete openWindows[data.id]; }catch(e){}
            }, CHILD_CLOSE_DELAY_MS);
          }
        } catch(e){ console.warn('auto-close error', e); }

        if (queue>0){ queue--; setTimeout(()=>generateAndOpen(),500); }
      }
    }catch(e){ console.warn('channel handler error', e); }
  }

  if (bc) bc.onmessage = (ev) => handleChannelMessage(ev);
  window.addEventListener('message', (ev) => {
    try {
      const d = ev.data || {};
      if (d && d.gg_gen_done) { handleChannelMessage({ data:{ type:'gg-gen-done', id:d.rqId||null, mapName:d.mapName||null, link:d.link||null, sheetOk:!!d.sheetOk } }); }
      if (d && d.gg_gen_trigger) { log('External trigger received (postMessage) — generating now'); setTimeout(()=>generateAndOpen(),50); }
      if (d && d.gg_gen_show) { try{ document.getElementById('gg-gen-panel').style.display='block'; log('Panel shown (postMessage)'); }catch(e){} }
      // child explicit close request: { close_child: true, rqId: '...' }
      if (d && d.close_child && d.rqId) {
        try {
          const w = openWindows[d.rqId];
          if (w && !w.closed) {
            setTimeout(()=>{
              try {
                w.close();
                log(`Parent closing child on explicit postMessage request (id=${d.rqId}) after ${CHILD_CLOSE_DELAY_MS}ms delay`);
              } catch(e) { console.warn('parent postMessage close error', e); }
              try{ delete openWindows[d.rqId]; }catch(e){}
            }, CHILD_CLOSE_DELAY_MS);
          } else {
            try{ delete openWindows[d.rqId]; }catch(e){}
          }
        } catch(e) { console.warn('parent postMessage close error', e); }
      }
    } catch(e) { console.warn('postMessage handler error', e); }
  });

  try{ window.Geogen = window.Geogen||{}; }catch(e){}

  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  function generateAndOpen(){
    try{
      if (isAutoChild()){ log('generateAndOpen blocked in child tab'); return; }
      if (busy){ queue++; log(`Currently busy — request queued (queue length: ${queue}).`); return; }
      const prefEl=document.getElementById('gg-modepref');
      const pref = prefEl?prefEl.value:'any';
      const mode = pickMode(pref);
      const map = pickMapForMode(mode);
      const timer = pickTimer(mode);
      const rqId = `${Date.now()}-${Math.floor(Math.random()*100000)}`;
      const openUrl = map.url + `?auto_challenge=1&mode=${encodeURIComponent(mode)}&timer=${encodeURIComponent(timer)}&mapName=${encodeURIComponent(map.name)}&rqId=${encodeURIComponent(rqId)}`;

      const win = window.open(openUrl, '_blank');
      if (!win) { log('Popup blocked — could not open new tab.'); return; }

      // store for fallback close
      try { openWindows[rqId] = win; } catch(e){ /* ignore */ }

      busy = true;
      currentRequestId = rqId;
      if (busyTimeoutId) clearTimeout(busyTimeoutId);
      busyTimeoutId = setTimeout(()=>{ busy=false; currentRequestId=null; busyTimeoutId=null; log('Busy timeout reached — marking as available.'); if(queue>0){ queue--; setTimeout(()=>generateAndOpen(),500); } }, BUSY_TIMEOUT_MS);

      log(`Opened tab for ${map.name} (${mode}) ${timer}s — waiting for child to finish (id=${rqId}).`);
      try{ if (bc) bc.postMessage({ type:'gg-gen-start', id:rqId, mapName:map.name, mode, timer }); }catch(e){}

    }catch(e){ console.error('generateAndOpen error', e); }
  }

  window.Geogen.generateAndOpen = generateAndOpen;
  window.Geogen.showPanel = ()=>{ const p=document.getElementById('gg-gen-panel'); if (p) p.style.display='block'; };

  async function waitForLoadAndCreate(forcedMode, forcedTimer, mapName, rqId){
    function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
    async function retry(fn, tries=8, delay=700){ for (let i=0;i<tries;i++){ try{ const ok = await fn(); if (ok) return ok; }catch(e){} await wait(delay);} return false; }
    async function waitForElement(selector, timeout=8000){ const start = Date.now(); while (Date.now()-start < timeout){ const el=document.querySelector(selector); if (el) return el; await wait(150); } return null; }
    function byInnerTextContains(nodeList,candidate){ for (const el of nodeList){ try{ const t=(el.innerText||el.textContent||'').trim().toLowerCase(); if (t && t.includes(candidate.toLowerCase())) return el; }catch(e){} } return null; }
    function safeClick(el){ if(!el) return false; try{ el.scrollIntoView({block:'center'}); el.dispatchEvent(new MouseEvent('pointerover',{bubbles:true})); el.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true})); el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true})); el.click(); el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true})); el.dispatchEvent(new MouseEvent('pointerup',{bubbles:true})); el.focus(); return true; }catch(e){ try{ el.click(); return true; }catch(_){ return false; } } }

    await wait(1200);

    function notifyOpener(foundLink,payloadMapName,sheetOk,errMsg){
      const msg={ type:'gg-gen-done', id:rqId||null, mapName:payloadMapName||mapName, link:foundLink||null, sheetOk:!!sheetOk, error:errMsg||null };
      try{ if (bc) bc.postMessage(msg); }catch(e){}
      try{ if (window.opener && !window.opener.closed){ window.opener.postMessage(Object.assign({ gg_gen_done:true, rqId: rqId||null }, msg), '*'); } }catch(e){}
    }

    // Precompute/decide the timer immediately
    const urlTimerParam = parseInt(new URL(location.href).searchParams.get('timer'),10);
    let decidedTimer = (forcedTimer !== null && forcedTimer !== undefined && !isNaN(forcedTimer)) ? forcedTimer : (!isNaN(urlTimerParam) ? urlTimerParam : null);
    if (decidedTimer !== null){ const roundTo = 10; decidedTimer = Math.max(0, Math.round(decidedTimer / roundTo) * roundTo); log('Decided timer (precomputed): '+decidedTimer+'s'); }

    // 1) ensure Challenge
    const ensureChallengeSelected = async ()=>{ const modeButtons=Array.from(document.querySelectorAll('[data-qa^="play-mode"], button, div')); const challengeBtn=byInnerTextContains(modeButtons,'challenge'); if (challengeBtn){ if (safeClick(challengeBtn)){ log('Clicked "Challenge" mode option'); return true; } } return false; };
    await retry(ensureChallengeSelected,6,900);
    await wait(800);

    // 2) select mode
    const selectMode = async ()=>{ const labels={ moving:'Moving', nomove:'No move', nmpz:'NMPZ' }; const modeToUse = forcedMode || 'moving'; const targetLabel = labels[modeToUse] || 'Moving'; const buttons=Array.from(document.querySelectorAll('button.play-setting-button_root__AfG8z, button')); const found = byInnerTextContains(buttons, targetLabel) || byInnerTextContains(buttons, modeToUse); if (found){ if (safeClick(found)){ log(`Clicked mode button: ${targetLabel}`); return true; } } const anyBtn=document.querySelector('button.play-setting-button_root__AfG8z'); if (anyBtn){ if (safeClick(anyBtn)){ log('Clicked default play-setting-button'); return true; } } return false; };
    await retry(selectMode,6,700);
    await wait(600);

    // 3) open round time panel
    const openRoundTimePanel = async ()=>{ const btn=document.querySelector('.round-time-settings_roundTime__rzSbW, .round-time-settings_roundTimeButton__o4BUX, button[data-qa="round-time-button"]'); if (btn){ if (safeClick(btn)){ log('Opened round time panel'); return true; } } const any = byInnerTextContains(document.querySelectorAll('button,div,span'),'round time') || byInnerTextContains(document.querySelectorAll('button,div,span'),'round-time'); if (any && safeClick(any)){ log('Opened round time via text match'); return true; } return false; };
    await retry(openRoundTimePanel,6,300);
    await wait(300);

    // 4) set timer (React Fiber onChange approach)
    const setTimer = async () => {
      let timerSec = decidedTimer;
      if (timerSec === null || timerSec === undefined) return true;

      const wait = (ms)=>new Promise(r=>setTimeout(r,ms));
      const dispatchInputChange = (el)=>{ try{ el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){} };

      function searchFiber(fiber, maxDepth = 400) {
        let depth = 0;
        while (fiber && depth < maxDepth) {
          try{
            const props = fiber.memoizedProps;
            if (props) {
              if (typeof props.onChange === 'function') {
                log(`[GG-fiber] 🎯 Found onChange at depth ${depth}`);
                return props;
              }
            }
          }catch(e){}
          fiber = fiber.return;
          depth++;
        }
        return null;
      }

      const slider = document.querySelector('[aria-valuemin][aria-valuemax], [role="slider"]');
      if (!slider) { log('[GG-fiber] No slider element found'); return false; }

      const fiberKey = Object.keys(slider).find(k => k.startsWith("__reactFiber") || k.startsWith("__reactInternalInstance"));
      const fiberRoot = fiberKey ? slider[fiberKey] : null;
      if (!fiberRoot) {
        // fallback search
        const alt = document.querySelector('[role="slider"]');
        if (alt) {
          const altKey = Object.keys(alt).find(k => k.startsWith("__reactFiber") || k.startsWith("__reactInternalInstance"));
          if (altKey) {
            const altRoot = alt[altKey];
            if (altRoot) {
              const altProps = searchFiber(altRoot);
              if (altProps) {
                try{
                  log(`[GG-fiber] Setting timer to ${timerSec}s via onChange/onReleased (alt slider)`);
                  altProps.onChange(timerSec);
                  altProps.onReleased?.(timerSec);
                  await wait(300);
                  try{ alt.setAttribute && alt.setAttribute('aria-valuenow', String(timerSec)); alt.setAttribute && alt.setAttribute('aria-valuetext', `${timerSec}s`); dispatchInputChange(alt); }catch(e){}
                  return true;
                }catch(e){ log('[GG-fiber] Error calling onChange on alt slider: '+e); }
              }
            }
          }
        }
        return false;
      }

      const targetProps = searchFiber(fiberRoot);
      if (!targetProps) { log('[GG-fiber] Didn’t find props with onChange in fiber tree'); return false; }

      try {
        log(`[GG-fiber] Setting timer to ${timerSec}s via onChange/onReleased`);
        targetProps.onChange(timerSec);
        if (typeof targetProps.onReleased === 'function') {
          try{ targetProps.onReleased(timerSec); }catch(e){}
        }
        await wait(300);
        try{
          slider.setAttribute && slider.setAttribute('aria-valuenow', String(timerSec));
          slider.setAttribute && slider.setAttribute('aria-valuetext', `${timerSec}s`);
          dispatchInputChange(slider);
        }catch(e){}
        log('[GG-fiber] setTimer: attempted onChange + aria update');
        return true;
      } catch (e) {
        log('[GG-fiber] Error calling onChange: ' + e);
        return false;
      }
    };

    const timerSet = await retry(setTimer,8,550);
    if (!timerSet) log('Timer set possibly failed (UI may differ).');

    await wait(500);

    // 5) click Generate/Create (improved to handle icon-only primary buttons)
    const clickGenerate = async () => {
      try {
        // helper to test visibility/disabled
        const isClickable = (el) => {
          if (!el) return false;
          if (el.disabled) return false;
          if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') return false;
          try {
            const cs = getComputedStyle(el);
            if (!cs || cs.display === 'none' || cs.visibility === 'hidden' || el.offsetParent === null) return false;
          } catch (e) {}
          return true;
        };

        // 1) Try the primary button by class first (click even if text is just an icon)
        const primaries = Array.from(document.querySelectorAll('button.button_button__aR6_e.button_variantPrimary__u3WzI'));
        for (const b of primaries) {
          if (!isClickable(b)) continue;
          // prefer buttons that look like play/create buttons; if text is empty (icon) still try it
          const txt = ((b.innerText || b.getAttribute('aria-label') || b.title) || '').trim().toLowerCase();
          if (txt.includes('challenge') || txt.includes('create') || txt.includes('start') || txt.includes('generate') || txt.length === 0) {
            if (safeClick(b)) { log('Clicked primary button by class (fallback for icon-only buttons)'); return true; }
          }
        }

        // 2) Try the wrapper-specific button that sometimes wraps the primary (e.g. function-lock_blurWrapper)
        const wrapperBtn = document.querySelector('.function-lock_blurWrapper__NlD1J button, .function-lock_blurWrapper__NlD1J');
        if (wrapperBtn && isClickable(wrapperBtn)) {
          if (safeClick(wrapperBtn)) { log('Clicked button inside .function-lock_blurWrapper__NlD1J'); return true; }
        }

        // 3) Try existing container-based strategy from before
        const containers = Array.from(document.querySelectorAll('.map-selector_playButtons__JrkFM, .playButtons_root__'));
        for (const pc of containers){
          const b = pc.querySelector('button.button_button__aR6_e.button_variantPrimary__u3WzI, button');
          if (b && isClickable(b)){
            const text=(b.innerText||b.textContent||'').trim().toLowerCase();
            if (text && (text.includes('challenge')||text.includes('create')||text.includes('start')||text.includes('generate'))){
              if (safeClick(b)){ log('Clicked primary play button in container'); return true; }
            }
            const span = b.querySelector('.button_label__ERkjz');
            if (span){
              const t=(span.innerText||span.textContent||'').trim().toLowerCase();
              if (t && (t.includes('challenge')||t.includes('create')||t.includes('start'))){
                if (safeClick(b)){ log('Clicked primary play button (span match)'); return true; }
              }
            }
            // also try icon-only primary
            if (!text) {
              if (safeClick(b)) { log('Clicked primary (icon) button in container fallback'); return true; }
            }
          }
        }

        // 4) scan all primary buttons and click by text match (previous fallback)
        const primaryBtns = Array.from(document.querySelectorAll('button.button_button__aR6_e.button_variantPrimary__u3WzI, button'));
        for (const bb of primaryBtns){
          if (!isClickable(bb)) continue;
          const txt=(bb.innerText||bb.textContent||'').trim().toLowerCase();
          if (txt && (txt.includes('challenge')||txt.includes('create')||txt.includes('start')||txt.includes('generate'))){
            if (safeClick(bb)){ log('Clicked primary button by text'); return true; }
          }
        }

        // 5) final fallback: any element whose visible text matches
        const everyone = Array.from(document.querySelectorAll('button'));
        const gen = byInnerTextContains(everyone,'create')||byInnerTextContains(everyone,'generate')||byInnerTextContains(everyone,'start')||byInnerTextContains(everyone,'challenge');
        if (gen && isClickable(gen)){ if (safeClick(gen)){ log('Clicked generate fallback'); return true; } }

        return false;
      } catch(e) {
        console.warn('clickGenerate error', e);
        return false;
      }
    };

    const genClicked = await retry(clickGenerate,10,600);
    if (!genClicked){ log('Could not click generate/create. Aborting.'); notifyOpener(null,null,false,'generate click failed'); return; }

    // 6) click create challenge
    const clickCreateChallenge = async ()=>{
      const btn = await waitForElement('button[data-qa="start-challenge-button"]',10000);
      if (btn){ if (safeClick(btn)){ log('Clicked "Create challenge" (data-qa=start-challenge-button)'); return true; } }
      const txtBtn = byInnerTextContains(document.querySelectorAll('button,a,div'),'challenge')||byInnerTextContains(document.querySelectorAll('button,a,div'),'continue')||byInnerTextContains(document.querySelectorAll('button,a,div'),'start challenge');
      if (txtBtn){ if (safeClick(txtBtn)){ log('Clicked fallback Create/Continue'); return true; } }
      return false;
    };
    const created = await retry(clickCreateChallenge,8,900);
    if (!created){ log('Create challenge button not found/clicked — check DOM.'); notifyOpener(null,null,false,'create challenge not found'); return; }
    await wait(1000);

    // 7) click copy link
    const clickCopy = async ()=>{
      const copyContainer=document.querySelector('.copy-link_button__mZ5Io');
      if (copyContainer){
        const b=copyContainer.querySelector('button.button_button__aR6_e.button_variantSecondary__hvM_F, button');
        if (b){ if (safeClick(b)){ log('Clicked Copy link button'); return true; } }
      }
      const anyCopy = byInnerTextContains(document.querySelectorAll('button,a,div'),'copy link')||byInnerTextContains(document.querySelectorAll('button,a,div'),'copy');
      if (anyCopy){ if (safeClick(anyCopy)){ log('Clicked alt copy button'); return true; } }
      return false;
    };
    const copyClicked = await retry(clickCopy,8,600);
    if (!copyClicked) log('Copy button not found. Trying to locate link by DOM/anchors/inputs.');
    await wait(700);

    // 8) find link
    let challengeLink=null;
    try{
      const inputs=Array.from(document.querySelectorAll('input'));
      for (const input of inputs){
        try{
          const val=(input.value||input.getAttribute('value')||'').trim();
          if (val && (val.includes('/challenge')||val.includes('geoguessr.com'))){ challengeLink=val; break; }
        }catch(e){}
      }
      if (!challengeLink){
        const anchors=Array.from(document.querySelectorAll('a'));
        for (const a of anchors){
          try{
            const href=(a.href||a.getAttribute('href')||'').trim();
            if (href && (href.includes('/challenge/')||href.includes('/challenge?')||href.includes('geoguessr.com'))){ challengeLink=href; break; }
          }catch(e){}
        }
      }
      if (!challengeLink && navigator.clipboard){
        try{
          const clip = await navigator.clipboard.readText().catch(()=>null);
          if (clip && (clip.includes('/challenge')||clip.includes('geoguessr.com'))) challengeLink = clip.trim();
        }catch(e){}
      }
    }catch(e){ console.error('link find error', e); }

    if (!challengeLink){ log('FAILED to find challenge link. Leaving tab open for debugging.'); notifyOpener(null,null,false,'link not found'); return; }
    log('Found challenge link: '+challengeLink);

    // Notify opener immediately that we have the link (parent can close as fallback)
    try{ notifyOpener(challengeLink, mapName || document.title, false, null); }catch(e){}

    // 9) post (use GM_xmlhttpRequest — then close on success)
    try {
      // Pretty labels for sheet output
      const prettyModeMap = { moving: "Moving", nomove: "No Move", nmpz: "NMPZ" };
      const urlMode = (new URL(location.href).searchParams.get('mode')) || null;
      const chosenModeKey = forcedMode || urlMode || null;
      const modeLabel = prettyModeMap[chosenModeKey] || (chosenModeKey ? (chosenModeKey.charAt(0).toUpperCase()+chosenModeKey.slice(1)) : 'unknown');

      const payload = {
        secret: SECRET,
        sheetName: TARGET_SHEET, // <-- explicit target sheet for this script
        mapName: mapName || document.title,
        mode: modeLabel,
        timer: (decidedTimer !== null ? decidedTimer : (forcedTimer || new URL(location.href).searchParams.get('timer') || '')),
        link: challengeLink
      };

      GM_xmlhttpRequest({
        method: 'POST',
        url: WEBHOOK_URL,
        data: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        onload: function(res){
          try{
            const data = JSON.parse(res.responseText||'{}');
            if (data.ok) log('Pushed to sheet successfully.');
            else if (data.error) log('Sheet error: '+data.error);
            else log('Sheet response: '+res.responseText);

            notifyOpener(challengeLink,payload.mapName,!!data.ok);

            // Attempt robust self-close sequence AFTER a delay (CHILD_CLOSE_DELAY_MS)
            setTimeout(()=> {
              (function attemptCloseSequence(){
                try {
                  window.close();
                } catch(e) { /* continue */ }

                try { window.open('','_self'); } catch(e) {}
                try { window.close(); } catch(e) {}

                try { location.href = 'about:blank'; } catch(e) {}
                setTimeout(()=>{ try { window.close(); } catch(e){} }, 300);

                setTimeout(()=> {
                  try {
                    if (window.opener && !window.opener.closed) {
                      window.opener.postMessage({ close_child: true, rqId: rqId }, '*');
                    }
                    if (bc) {
                      try { bc.postMessage({ type:'gg-close-request', id: rqId }); }catch(e){}
                    }
                  } catch(e) { /* ignore */ }
                }, 800);
              })();
            }, CHILD_CLOSE_DELAY_MS);

          }catch(e){
            log('Sheet response parse error: '+res.responseText);
            notifyOpener(challengeLink,payload.mapName,false,'sheet parse error');
            // intentionally do not close to let you inspect
          }
        },
        onerror: function(){
          log('POST failed; check Apps Script endpoint and secret.');
          notifyOpener(challengeLink,payload.mapName,false,'POST failed');
          // intentionally do not close so you can inspect
        }
      });
    } catch (e) {
      log('Failed sending to sheet: '+e);
      notifyOpener(challengeLink,mapName,false,String(e));
      // don't close so you can debug
    }
  }

  // expose for debugging
  try{ window.waitForLoadAndCreate = waitForLoadAndCreate; }catch(e){}

  try{
    const urlParams = new URL(location.href).searchParams;
    if (urlParams.get('auto_challenge') === '1') {
      const forcedMode = urlParams.get('mode');
      const forcedTimer = parseInt(urlParams.get('timer'),10) || null;
      const mapName = urlParams.get('mapName') || document.title || location.href;
      const rqId = urlParams.get('rqId') || null;
      log('Auto-challenge tab detected — starting challenge creation...');
      (async ()=>{ await waitForLoadAndCreate(forcedMode, forcedTimer, mapName, rqId); })();
    }
  }catch(e){}

})();

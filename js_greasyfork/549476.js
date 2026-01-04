// ==UserScript==
// @name         Loot Finder
// @namespace    Zega
// @version      1.2.1
// @description  No color for ≤50k; Orange 50,001–89,999; Red ≥90k; BLUE for Mastercrafted-like items. Fast Scan, legend, progress bar, top-row fix, MC confirmation, mouse-movement shield. Slot-sticky highlights with icon-signature guards and debounced forgetting so colors persist correctly after moves.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        https://www.fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @run-at       document-start
// @all-frames   true
// @grant        none
//
// Changes in 1.2.1:
// - Moving one “identical-looking” item could unhighlight another identical item. Fixed by:
//   (a) Migrating slot memory when indices shift (slot-key refresh).
//   (b) Debouncing mastercrafted “forget” on temporary signature mismatches during drag/reflow.
// @downloadURL https://update.greasyfork.org/scripts/549476/Loot%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/549476/Loot%20Finder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- config & constants ---------- */
  const GREEN_MAX  = 50000;
  const ORANGE_MAX = 89999;
  const COLORS = {
    orange: 'rgba(255,165,0,.55)',
    red:    'rgba(220,40,40,.55)',
    blue:   'rgba(60,140,255,.55)',
    border: 'rgba(255,255,255,.95)'
  };

  /* ---------- storage keys ---------- */
  const LS_KEY_TYPES_V2 = 'df_scrap_color_types_v2'; // key: `${type}||${iconSig}` -> 'orange'|'red'
  const LS_KEY_ENABLED  = 'df_scrap_enabled_v1';
  const LS_KEY_MC_SLOTS = 'df_mc_slots_v3';         // { [pageKey]: { [slotKey]: {sig} } }
  const SS_KEY_SLOT_COL = 'df_slot_colors_v2';      // sessionStorage: { [pageKey]: { [slotKey]: {sig, type, col, val} } }

  // retire old broad type memory
  try { localStorage.removeItem('df_scrap_color_types_v1'); } catch {}

  /* ---------- page key (separate per DF page) ---------- */
  const PAGE_KEY = (()=>{ try{
    const u = new URL(location.href);
    const gp = new URLSearchParams(u.search).get('page') || '';
    return u.pathname + '?page=' + gp;
  }catch{ return location.pathname; } })();

  /* ---------- tiny JSON helpers ---------- */
  const jget  = (s,k,def)=>{ try{ const v=s.getItem(k); return v?JSON.parse(v):def; }catch{ return def; } };
  const jset  = (s,k,v)=>{ try{ s.setItem(k, JSON.stringify(v)); }catch{} };

  /* ---------- enable/disable ---------- */
  function loadEnabled(){ try{ const v = localStorage.getItem(LS_KEY_ENABLED); return v==null? true : v==='1'; }catch{ return true; } }
  function saveEnabled(v){ try{ localStorage.setItem(LS_KEY_ENABLED, v?'1':'0'); }catch{} }
  let ENABLED = loadEnabled();

  /* ---------- memories ---------- */
  const COLOR_TYPES = jget(localStorage, LS_KEY_TYPES_V2, {}); // `${type}||${sig}` -> 'orange'|'red'
  const ALL_MC      = jget(localStorage, LS_KEY_MC_SLOTS, {});
  if (!ALL_MC[PAGE_KEY]) ALL_MC[PAGE_KEY] = {};
  const MC_SLOTS = ALL_MC[PAGE_KEY]; // slotKey -> { sig }
  const saveMc   = ()=>{ ALL_MC[PAGE_KEY] = MC_SLOTS; jset(localStorage, LS_KEY_MC_SLOTS, ALL_MC); };

  const ALL_SLOT_COL = jget(sessionStorage, SS_KEY_SLOT_COL, {});
  if (!ALL_SLOT_COL[PAGE_KEY]) ALL_SLOT_COL[PAGE_KEY] = {};
  const SLOT_COL = ALL_SLOT_COL[PAGE_KEY]; // slotKey -> { sig, type, col, val }
  const saveSlot = ()=>{ ALL_SLOT_COL[PAGE_KEY] = SLOT_COL; jset(sessionStorage, SS_KEY_SLOT_COL, ALL_SLOT_COL); };

  /* ---------- mouse + scan gate ---------- */
  let mouseX=0, mouseY=0, SCANNING=false;
  const onMove = e => { if (!SCANNING){ mouseX=e.clientX; mouseY=e.clientY; } };
  document.addEventListener('mousemove', onMove, true);
  document.addEventListener('mouseover', onMove, true);

  /* ---------- tooltip parsing ---------- */
  const htmlToText = s => { const t=document.createElement('textarea'); t.innerHTML=s||''; return t.value.replace(/\u00A0/g,' ').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,' '); };
  function readTooltipFromDoc(doc){
    const ids=['dhtmltooltip','tiplayer','toolTip','tooltip'];
    for(const id of ids){
      const el = doc.getElementById && doc.getElementById(id);
      if(el && el.offsetParent !== null && (el.textContent||'').length) return el.innerHTML||el.textContent;
    }
    const cand = Array.from(doc.querySelectorAll('div')).find(d =>
      d.offsetParent !== null && (d.textContent||'').length < 800 && /Scrap\s*(Price|Value)/i.test(d.textContent||'')
    );
    return cand ? (cand.innerHTML||cand.textContent) : null;
  }
  function liveTooltipHTML(){
    let h = readTooltipFromDoc(document); if(h) return h;
    try{ if (window.parent && window.parent!==window){ h=readTooltipFrom(window.parent.document); if(h) return h; } }catch{}
    try{
      const top = window.top||window;
      h=readTooltipFrom(top.document); if(h) return h;
      for(let i=0;i<top.frames.length;i++){ try{ h=readTooltipFrom(top.frames[i].document); if(h) return h; }catch{} }
    }catch{}
    return null;
  }
  function parseScrapStrict(text){
    if(!text) return null;
    const s = htmlToText(text);
    const m = s.match(/Scrap\s*(?:Price|Value)\s*:\s*\$?\s*([0-9][0-9,.\s]*)/i);
    if (!m) return null;
    const n = Number(String(m[1]).replace(/[,.\s]/g,''));
    return Number.isFinite(n) ? n : null;
  }
  function isMastercrafted(html){
    if(!html) return false;
    if (/(color\s*[:=]\s*["']?\s*(?:#?ffff00|#?ff0|yellow))/i.test(html)) return true;
    const txt = htmlToText(html);
    if (/\+\s*\d+\s+(Accuracy|Critical|Reload|Reload Speed|Recoil|Damage|Fortitude|Agility|Dodging|Blocking|Running|Searching|Looting|SPR|DPS)/i.test(txt)) return true;
    return false;
  }

  /* ---------- geometry/helpers ---------- */
  const isSquareish = r => r && r.width>=35 && r.width<=160 && r.height>=35 && r.height<=160 && (r.width/r.height)>0.75 && (r.width/r.height)<1.33;
  function pickBoxFrom(el){
    let p=el;
    for(let i=0;i<8 && p && p!==document.body;i++,p=p.parentElement){
      const r=p.getBoundingClientRect(); if(isSquareish(r)) return p;
    }
    return el;
  }
  function hasBgImage(node){ if(!node) return false; const bg=getComputedStyle(node).backgroundImage; return !!(bg && bg!=='none'); }
  function boxHasIconFromItem(itemEl){ return !!(itemEl && hasBgImage(itemEl)); }

  // Robust icon signature: image + position + size
  function getIconSig(itemEl){
    try{
      const cs = getComputedStyle(itemEl);
      const img = cs.backgroundImage || '';
      const pos = (cs.backgroundPosition || ((cs.backgroundPositionX||'')+' '+(cs.backgroundPositionY||''))).trim();
      const size = cs.backgroundSize || '';
      return [img, pos, size].join('|');
    }catch{ return null; }
  }

  function colorFor(scrap){
    if (scrap <= GREEN_MAX) return 'none';
    if (scrap <= ORANGE_MAX) return 'orange';
    return 'red';
  }

  /* ---------- slot identity ---------- */
  function computeSlotKey(itemEl){
    const container = itemEl.closest('.playerInv, .inventory, .storage, .invGrid, td, div') || itemEl.parentElement || document.body;
    let list = Array.from(container.querySelectorAll('div.item'));
    let idx  = list.indexOf(itemEl);
    if (idx < 0) { list = Array.from(document.querySelectorAll('div.item')); idx = list.indexOf(itemEl); }
    const tag = (container.tagName||'DIV');
    const id  = (container.id||'').slice(0,40);
    const cls = (container.className||'').toString().split(/\s+/).slice(0,3).join('.');
    return `${tag}#${id}.${cls}::${idx}`;
  }

  /* ---------- MC slot memory ---------- */
  function rememberMaster(itemEl){
    const slotKey = computeSlotKey(itemEl);
    const sig = getIconSig(itemEl) || '';
    itemEl.dataset.dfSlotKey = slotKey;
    itemEl.dataset.dfMaster  = '1';
    MC_SLOTS[slotKey] = { sig };
    saveMc();
  }
  function forgetMasterAtSlot(slotKey){
    if (MC_SLOTS[slotKey]){ delete MC_SLOTS[slotKey]; saveMc(); }
  }

  /* ---------- non-MC slot memory ---------- */
  function rememberSlotColor(itemEl, col, val){
    if (!itemEl) return;
    if (col==='none' || col==='blue') return; // only persist orange/red
    const slotKey = computeSlotKey(itemEl);
    const sig = getIconSig(itemEl) || '';
    const type = (itemEl.dataset && itemEl.dataset.type ? String(itemEl.dataset.type).toLowerCase() : '');
    itemEl.dataset.dfSlotKey = slotKey;
    SLOT_COL[slotKey] = { sig, type, col, val: Number(val)||null };
    saveSlot();
  }
  function slotEntryMatches(itemEl, entry){
    if (!entry) return false;
    const sigNow = getIconSig(itemEl) || '';
    const typeNow = (itemEl.dataset && itemEl.dataset.type ? String(itemEl.dataset.type).toLowerCase() : '');
    if (entry.sig && entry.sig !== sigNow) return false;
    if (entry.type && entry.type !== typeNow) return false;
    return true;
  }

  /* ---------- painter ---------- */
  function clearBox(box){
    if (!box) return;
    box.style.outline=''; box.style.boxShadow=''; box.style.borderRadius='';
    box.removeAttribute('data-df-scrap-painted');
    box.removeAttribute('data-df-scrap-color');
    const pill = box.querySelector('.df-scrap-pill'); if (pill) pill.remove();
  }
  function paintBox(box, scrap, color){
    if (!box) return;
    if (color === 'none'){ clearBox(box); return; }
    if (getComputedStyle(box).position === 'static') box.style.position='relative';
    box.dataset.dfScrapPainted='1';
    box.dataset.dfScrapValue  = String(scrap);
    box.dataset.dfScrapColor  = color;
    const col = COLORS[color];
    box.style.outline      = `2px solid ${COLORS.border}`;
    box.style.boxShadow    = `0 0 0 4px ${col} inset, 0 0 10px 0 ${col}`;
    box.style.borderRadius = '6px';
    let tag = box.querySelector('.df-scrap-pill');
    if(!tag){ tag = document.createElement('div'); tag.className='df-scrap-pill'; Object.assign(tag.style,{display:'none'}); box.appendChild(tag); }
  }

  /* ---------- migrate slot keys when indices shift ---------- */
  function refreshSlotKeys(){
    document.querySelectorAll('div.item').forEach(item=>{
      const oldKey = item.dataset.dfSlotKey;
      const newKey = computeSlotKey(item);
      if (!oldKey){ item.dataset.dfSlotKey = newKey; return; }
      if (oldKey === newKey) return;

      const sig = getIconSig(item) || '';

      // Move MC memory if signature still matches
      const mc = MC_SLOTS[oldKey];
      if (mc && mc.sig === sig){
        delete MC_SLOTS[oldKey];
        MC_SLOTS[newKey] = mc;
        item.dataset.dfMaster = '1';
        saveMc();
      }

      // Move non-MC slot color if signature still matches
      const sc = SLOT_COL[oldKey];
      if (sc && sc.sig === sig){
        delete SLOT_COL[oldKey];
        SLOT_COL[newKey] = sc;
        saveSlot();
      }

      item.dataset.dfSlotKey = newKey;
    });
  }

  /* ---------- re-appliers ---------- */
  const MC_MISMATCH_SINCE = {}; // slotKey -> timestamp
  const MC_FORGET_DELAY = 800;  // ms

  function paintAllMasters(){
    document.querySelectorAll('div.item').forEach(item=>{
      const slotKey = computeSlotKey(item);               // use current key
      const sigNow  = getIconSig(item) || '';
      const entry   = MC_SLOTS[slotKey];

      // if nothing stored for this slot, clear debounce and skip
      if (!entry){ delete MC_MISMATCH_SINCE[slotKey]; return; }

      // If icon temporarily blank/hidden during drag, don't forget yet
      const box = pickBoxFrom(item);
      const rect = box && box.getBoundingClientRect();
      const visible = !!(rect && rect.width>0 && rect.height>0);
      if (!visible || !sigNow){ return; }

      // Debounced forgetting when signature differs
      if (entry.sig !== sigNow){
        const now = performance.now();
        if (!MC_MISMATCH_SINCE[slotKey]){ MC_MISMATCH_SINCE[slotKey] = now; return; }
        if (now - MC_MISMATCH_SINCE[slotKey] < MC_FORGET_DELAY) return;
        delete MC_MISMATCH_SINCE[slotKey];
        forgetMasterAtSlot(slotKey);
        return;
      }
      delete MC_MISMATCH_SINCE[slotKey];

      // Paint if matches
      item.dataset.dfMaster = '1';
      item.dataset.dfSlotKey = slotKey;
      if (rect && isSquareish(rect) && boxHasIconFromItem(item)){
        const val = Number(item.dataset.dfScrapValue) || GREEN_MAX;
        paintBox(box, val, 'blue');
      }
    });
  }

  function paintAllBySlot(){
    document.querySelectorAll('div.item').forEach(item=>{
      const slotKey = computeSlotKey(item);
      const entry = SLOT_COL[slotKey];
      if (!entry) return;
      if (!slotEntryMatches(item, entry)){ delete SLOT_COL[slotKey]; saveSlot(); return; }
      const box = pickBoxFrom(item);
      const rect = box && box.getBoundingClientRect();
      if (rect && isSquareish(rect) && boxHasIconFromItem(item)){
        const val = Number(item.dataset.dfScrapValue);
        paintBox(box, Number.isFinite(val)? val : (entry.val||GREEN_MAX), entry.col);
      }
    });
  }

  function paintAllByType(type, color){
    if (!type || color==='none') return;
    const key = String(type).toLowerCase();
    document.querySelectorAll('div.item').forEach(item=>{
      const sk = computeSlotKey(item);
      if (MC_SLOTS[sk]) return;                            // don't override MC
      if (SLOT_COL[sk] && slotEntryMatches(item, SLOT_COL[sk])) return; // nor explicit slot color

      const t = item.dataset && item.dataset.type ? item.dataset.type.toLowerCase() : '';
      if (t !== key) return;

      const box = pickBoxFrom(item);
      const rect = box && box.getBoundingClientRect();
      if (rect && isSquareish(rect) && boxHasIconFromItem(item)){
        const val = Number(item.dataset.dfScrapValue) || GREEN_MAX;
        paintBox(box, val, color);
      }
    });
  }

  /* ---------- hover-driven loop ---------- */
  function tick(){
    try{
      if (!ENABLED || SCANNING) return;
      const tipHTML = liveTooltipHTML(); if(!tipHTML) return;
      const target = document.elementFromPoint(mouseX, mouseY); if(!target) return;
      const itemEl = target.closest && target.closest('div.item'); if(!itemEl) return;

      const scrap = parseScrapStrict(tipHTML); if(scrap==null) return;

      const box = pickBoxFrom(itemEl);
      const rect = box && box.getBoundingClientRect();
      if(!(rect && isSquareish(rect) && boxHasIconFromItem(itemEl))) return;

      const master = isMastercrafted(tipHTML);
      itemEl.dataset.dfScrapValue = String(scrap);

      const sig = getIconSig(itemEl) || '';
      const type = (itemEl.dataset && itemEl.dataset.type) ? itemEl.dataset.type.toLowerCase() : '';

      if (master){
        rememberMaster(itemEl);
        paintBox(box, scrap, 'blue');
        const sk = itemEl.dataset.dfSlotKey || computeSlotKey(itemEl);
        if (SLOT_COL[sk]){ delete SLOT_COL[sk]; saveSlot(); }
      } else {
        const col = colorFor(scrap);
        paintBox(box, scrap, col);
        if (col!=='none') rememberSlotColor(itemEl, col, scrap);

        if (col!=='none' && type){
          const tkey = `${type}||${sig}`;
          if (COLOR_TYPES[tkey] !== col){
            COLOR_TYPES[tkey] = col;
            jset(localStorage, LS_KEY_TYPES_V2, COLOR_TYPES);
          }
        }
      }
    }catch{}
  }
  setInterval(tick, 120);

  /* ---------- reapply flow ---------- */
  function reapplyAll(){
    if (!ENABLED) return;
    refreshSlotKeys(); // NEW: keep memories lined up with shifted indices
    paintAllMasters();
    paintAllBySlot();
    Object.entries(COLOR_TYPES).forEach(([k,col])=>{
      if (!col || col==='none') return;
      const [type, sig] = k.split('||');
      document.querySelectorAll('div.item').forEach(item=>{
        const t = (item.dataset && item.dataset.type) ? item.dataset.type.toLowerCase() : '';
        if (t !== (type||'')) return;
        const sk = computeSlotKey(item);
        if (MC_SLOTS[sk]) return;
        if (SLOT_COL[sk] && slotEntryMatches(item, SLOT_COL[sk])) return;
        if ((getIconSig(item)||'') !== (sig||'')) return;

        const box = pickBoxFrom(item);
        const rect = box && box.getBoundingClientRect();
        if (rect && isSquareish(rect) && boxHasIconFromItem(item)){
          const val = Number(item.dataset.dfScrapValue) || GREEN_MAX;
          paintBox(box, val, col);
        }
      });
    });
  }

  /* ---------- debounced observer ---------- */
  let reapplyScheduled=false;
  function scheduleReapply(){
    if (reapplyScheduled) return;
    reapplyScheduled=true;
    requestAnimationFrame(()=>{ reapplyScheduled=false; reapplyAll(); });
  }
  const mo = new MutationObserver(()=>{ try{ scheduleReapply(); }catch{} });

  /* ---------- scan helpers / quick scan ---------- */
  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function dispatchMouse(el, type, x, y){
    const ev=new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,view:window});
    try{ el.dispatchEvent(ev); }catch{}
  }
  async function hoverForTooltip(el, baseWait=20, duringScan=false){
    const r=el.getBoundingClientRect();
    if(!r || r.width===0 || r.height===0) return null;
    let x=Math.max(2,Math.min(window.innerWidth-2,Math.floor(r.left+r.width*0.5)));
    let y=Math.max(2,Math.min(window.innerHeight-2,Math.floor(r.top +r.height*0.6)));
    const target = duringScan ? el : (document.elementFromPoint(x,y) || el);
    dispatchMouse(target,'mouseover',x,y);
    dispatchMouse(target,'mousemove',x,y);
    await sleep(baseWait);
    let best=liveTooltipHTML();
    if(!best || !isMastercrafted(best)){
      for(let k=0;k<2;k++){
        y=Math.min(window.innerHeight-2, y+1+k);
        dispatchMouse(target,'mousemove',x,y);
        await sleep(baseWait+8);
        const h=liveTooltipHTML();
        if ((h && (!best || h.length>best.length)) || isMastercrafted(h)) best=h;
        if (isMastercrafted(best)) break;
      }
    }
    return { html: best };
  }
  async function confirmMastercrafted(el, baseWait=20){
    const first = await hoverForTooltip(el, baseWait, true);
    const tip1 = first && first.html;
    const isMC1 = !!tip1 && isMastercrafted(tip1);
    if (!isMC1) return { tip: tip1, master:false };
    const tip2 = liveTooltipHTML();
    const isMC2 = !!tip2 && isMastercrafted(tip2);
    const s1 = parseScrapStrict(tip1);
    const s2 = parseScrapStrict(tip2);
    const ok = (s1==null || s2==null) ? true : (s1===s2);
    return { tip: tip2||tip1, master: (isMC1 && isMC2 && ok) };
  }

  let scanning=false;
  async function quickScan(updateLabel){
    if (!ENABLED || scanning) return;
    scanning=true; SCANNING=true;

    const items = Array.from(document.querySelectorAll('div.item')).filter(it=>{
      const b=pickBoxFrom(it); const r=b&&b.getBoundingClientRect();
      return r && r.width>0 && r.height>0 && r.bottom>0 && r.top<window.innerHeight;
    });
    const MAX = Math.min(items.length, 120);
    const HOVER=20, PAUSE=2;

    for(let i=0;i<MAX;i++){
      const it=items[i];
      try{
        const { tip, master } = await confirmMastercrafted(it, HOVER);
        if (tip){
          const scrap = parseScrapStrict(tip);
          if (scrap!=null){
            const box = pickBoxFrom(it);
            if (box && boxHasIconFromItem(it)){
              it.dataset.dfScrapValue = String(scrap);
              if (master){
                rememberMaster(it);
                paintBox(box, scrap, 'blue');
                const sk = it.dataset.dfSlotKey || computeSlotKey(it);
                if (SLOT_COL[sk]){ delete SLOT_COL[sk]; saveSlot(); }
              }else{
                const col = colorFor(scrap);
                paintBox(box, scrap, col);
                if (col!=='none') rememberSlotColor(it, col, scrap);

                const sig = getIconSig(it) || '';
                const type = (it.dataset && it.dataset.type) ? it.dataset.type.toLowerCase() : '';
                if (col!=='none' && type){
                  const tkey = `${type}||${sig}`;
                  if (COLOR_TYPES[tkey] !== col){
                    COLOR_TYPES[tkey] = col;
                    jset(localStorage, LS_KEY_TYPES_V2, COLOR_TYPES);
                  }
                }
              }
            }
          }
        }
      }catch{}
      if (updateLabel) updateLabel(`Scanning ${i+1}/${MAX}…`);
      await sleep(PAUSE);
    }

    reapplyAll();
    SCANNING=false; scanning=false;
    if (updateLabel) updateLabel('Scan Items');
  }

  /* ---------- toggle + boot UI ---------- */
  function toggleEnabled(btn){
    ENABLED=!ENABLED; saveEnabled(ENABLED);
    if (ENABLED){
      try{ if (document.body) mo.observe(document.body, {subtree:true, childList:true}); }catch{}
      reapplyAll();
    }else{
      try{ mo.disconnect(); }catch{}
      document.querySelectorAll('[data-df-scrap-painted="1"]').forEach(el=>{
        el.style.outline=''; el.style.boxShadow=''; el.style.borderRadius='';
        el.removeAttribute('data-df-scrap-painted'); el.removeAttribute('data-df-scrap-color');
      });
    }
    if (btn) btn.textContent = ENABLED ? 'Scrap Highlight: ON' : 'Scrap Highlight: OFF';
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    try{ if (ENABLED && document.body) mo.observe(document.body, {subtree:true, childList:true}); }catch{}
    if (ENABLED) reapplyAll();

    // Recalculate after player moves items
    ['dragstart','dragend','drop','mouseup'].forEach(ev =>
      document.addEventListener(ev, ()=>{ scheduleReapply(); }, true)
    );

    const wrap=document.createElement('div');
    Object.assign(wrap.style,{
      position:'fixed', left:'8px', bottom:'8px', zIndex:2147483647,
      display:'flex', gap:'6px', alignItems:'center'
    });

    const toggleBtn=document.createElement('button');
    toggleBtn.textContent = ENABLED ? 'Scrap Highlight: ON' : 'Scrap Highlight: OFF';
    Object.assign(toggleBtn.style,{
      font:'12px system-ui, Arial, sans-serif', padding:'6px 10px',
      background:'#111', color:'#fff', border:'1px solid rgba(255,255,255,.25)',
      borderRadius:'6px', opacity:'0.9', cursor:'pointer'
    });
    toggleBtn.addEventListener('mouseenter',()=>toggleBtn.style.opacity='1');
    toggleBtn.addEventListener('mouseleave',()=>toggleBtn.style.opacity='0.9');
    toggleBtn.addEventListener('click',()=>toggleEnabled(toggleBtn));

    const scanBtn=document.createElement('button');
    scanBtn.textContent='Scan Items';
    Object.assign(scanBtn.style,{
      font:'12px system-ui, Arial, sans-serif', padding:'6px 10px',
      background:'#153b7a', color:'#fff', border:'1px solid rgba(255,255,255,.25)',
      borderRadius:'6px', opacity:'0.9', cursor:'pointer'
    });
    const setScanLabel=(t)=>{ scanBtn.textContent=t; };
    scanBtn.addEventListener('mouseenter',()=>scanBtn.style.opacity='1');
    scanBtn.addEventListener('mouseleave',()=>scanBtn.style.opacity='0.9');
    scanBtn.addEventListener('click', async ()=>{
      if (scanning) return;
      const prev=scanBtn.textContent;
      setScanLabel('Scanning…');
      scanBtn.disabled=true;
      try{ await quickScan(setScanLabel); } finally { scanBtn.disabled=false; setScanLabel(prev); }
    });

    wrap.appendChild(toggleBtn);
    wrap.appendChild(scanBtn);
    document.body.appendChild(wrap);
  });

})();

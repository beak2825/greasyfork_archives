// ==UserScript==
// @name         SnapScore Automater
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Multi-step auto-snap (Cam, Picture, Send, Final). Drag/upload profiles. Delay applies between every step. X = emergency stop.
// @match        https://www.snapchat.com/web*
// @match        https://web.snapchat.com/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/550901/SnapScore%20Automater.user.js
// @updateURL https://update.greasyfork.org/scripts/550901/SnapScore%20Automater.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /* ---------- UI ---------- */
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', top:'12px', right:'12px', zIndex:2147483647,
    background:'rgba(0,0,0,0.80)', color:'#fff', padding:'10px',
    borderRadius:'8px', fontFamily:'Inter, Arial, sans-serif', fontSize:'13px', minWidth:'460px',
    boxShadow:'0 6px 24px rgba(0,0,0,0.5)'
  });
  overlay.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <strong>Snap AutoClick</strong>
      <div style="display:flex;gap:6px;align-items:center">
        <button id="ac-close" title="Remove overlay" style="background:transparent;border:0;color:#fff;cursor:pointer">✕</button>
      </div>
    </div>

    <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
      <button class="ac-set-btn" data-type="cam">Cam ON</button>
      <button class="ac-set-btn" data-type="picture">Picture</button>
      <button class="ac-set-btn" data-type="send">Send</button>
      <button class="ac-set-btn" data-type="final">Final Send</button>
    </div>

    <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
      <label style="font-size:12px">Delay (s):</label>
      <input id="ac-delay" type="text" value="0.2" style="width:70px;padding:4px;border-radius:4px;border:none"/>
      <button id="ac-start">Start</button>
      <button id="ac-stop">Stop</button>
      <button id="ac-clear">Clear All</button>
      <button id="ac-upload">Upload</button>
    </div>

    <div style="margin-top:8px;font-size:12px;color:#ddd">Profiles (drag images here or use Upload):</div>
    <div id="ac-drop" style="border:1px dashed #888;min-height:80px;padding:6px;margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;align-items:flex-start;overflow:auto;max-height:160px;"></div>

    <div id="ac-preview" style="margin-top:8px;font-size:12px;color:#9f9;max-height:80px;overflow:auto;border:1px solid #555;padding:6px">Preview: <i>none</i></div>
    <div id="ac-status" style="margin-top:8px;font-size:12px;color:#9f9">Status: idle</div>

    <div style="margin-top:8px;font-size:11px;opacity:0.85">
      Notes: X = emergency stop. Click a Set button then click the page element to save it. Script ignores left 1/3 of screen.
    </div>
  `;
  document.documentElement.appendChild(overlay);

  /* ---------- elements ---------- */
  const dropEl = document.getElementById('ac-drop');
  const startBtn = document.getElementById('ac-start');
  const stopBtn = document.getElementById('ac-stop');
  const clearBtn = document.getElementById('ac-clear');
  const uploadBtn = document.getElementById('ac-upload');
  const delayInput = document.getElementById('ac-delay');
  const statusEl = document.getElementById('ac-status');
  const previewEl = document.getElementById('ac-preview');

  /* ---------- state ---------- */
  // setButtons: each is { sel: string|null, el: Element|null }
  const setButtons = { cam:{sel:null,el:null}, picture:{sel:null,el:null}, send:{sel:null,el:null}, final:{sel:null,el:null} };
  let captureMode = null;
  let running = false;
  let emergency = false;
  // profiles
  let profileList = []; // {id, type:'data'|'url', src, name, w?, h?, enabled:true}
  let profileIdCounter = 1;

  /* ---------- utilities & safety fixes ---------- */
  function buildSelector(el){
    if(!el || el.nodeType !== 1) return null;
    if(el.id) return `#${CSS.escape(el.id)}`;
    const parts = [];
    let node = el;
    while(node && node.nodeType === 1 && node.tagName.toLowerCase() !== 'html'){
      let part = node.tagName.toLowerCase();
      if(node.className && typeof node.className === 'string'){
        const cls = node.className.split(/\s+/).filter(Boolean)[0];
        if(cls) part += `.${CSS.escape(cls)}`;
      }
      const parent = node.parentElement;
      if(parent){
        const siblings = Array.from(parent.children).filter(ch => ch.tagName === node.tagName);
        if(siblings.length > 1) part += `:nth-child(${Array.from(parent.children).indexOf(node)+1})`;
      }
      parts.unshift(part);
      node = node.parentElement;
      if(parts.length > 8) break;
    }
    return parts.length ? parts.join(' > ') : null;
  }

  function safeQuery(sel){
    try { return sel ? document.querySelector(sel) : null; } catch(e){ return null; }
  }

  function updateStatus(msg){
    if(msg) statusEl.textContent = msg;
    else statusEl.textContent = running ? `Running (delay ${delayInput.value}s)` : 'Status: idle';
    highlightSetButtons();
  }

  function highlightSetButtons(){
    document.querySelectorAll('.ac-set-btn').forEach(btn=>{
      const t = btn.dataset.type;
      const s = setButtons[t];
      if(s && (s.sel || s.el)){
        btn.style.border = '2px solid #0f0';
        btn.style.boxShadow = '0 0 6px rgba(0,255,0,0.12)';
      } else {
        btn.style.border = '1px solid #888';
        btn.style.boxShadow = 'none';
      }
    });
  }

  function updatePreview(){
    previewEl.innerHTML = profileList.length ? ('Profiles: ' + profileList.filter(p=>p.enabled).map(p=>p.name).join(', ') + (profileList.filter(p=>!p.enabled).length? ' <span style="color:#f88">(some disabled)</span>':'') ) : 'Preview: <i>none</i>';
  }

  function minDelayMs(){ return 20; } // minimum 20ms for fast but realistic timing

  function getDelayMs(){
    let d = parseFloat(delayInput.value);
    if(isNaN(d) || d < 0) d = 0.02;
    const ms = Math.round(d * 1000);
    return Math.max(ms, minDelayMs());
  }

  /* ---------- profile UI and drag/drop ---------- */
  function makeProfileCard(profile){
    const div = document.createElement('div');
    Object.assign(div.style, {display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', width:'96px', padding:'6px', background:'rgba(255,255,255,0.03)', borderRadius:'6px'});
    const img = document.createElement('img'); img.src = profile.src; img.style.width='48px'; img.style.height='48px'; img.style.objectFit='cover'; img.style.borderRadius='6px';
    const label = document.createElement('div'); label.textContent = profile.name; label.style.fontSize='11px'; label.style.width='100%'; label.style.whiteSpace='nowrap'; label.style.overflow='hidden'; label.style.textOverflow='ellipsis'; label.style.color='#fff';
    const row = document.createElement('div'); row.style.display='flex'; row.style.gap='6px'; row.style.alignItems='center';
    const checkbox = document.createElement('input'); checkbox.type='checkbox'; checkbox.checked = !!profile.enabled; checkbox.addEventListener('change', ()=>{ profile.enabled = checkbox.checked; updatePreview(); });
    const del = document.createElement('button'); del.textContent='X'; Object.assign(del.style,{background:'#900', color:'#fff', border:'0', padding:'2px 6px', borderRadius:'6px', cursor:'pointer'}); del.addEventListener('click', ()=>{ profileList = profileList.filter(p=>p.id!==profile.id); renderProfiles(); updatePreview(); });
    row.appendChild(checkbox); row.appendChild(del);
    div.appendChild(img); div.appendChild(label); div.appendChild(row);
    return div;
  }

  function renderProfiles(){
    dropEl.innerHTML = '';
    profileList.forEach(p => dropEl.appendChild(makeProfileCard(p)));
  }

  // drag/drop handlers
  dropEl.addEventListener('dragover', e => { e.preventDefault(); dropEl.style.borderColor='#fff'; });
  dropEl.addEventListener('dragleave', e => { dropEl.style.borderColor='#888'; });
  dropEl.addEventListener('drop', e => {
    e.preventDefault(); dropEl.style.borderColor='#888';
    // files
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0){
      Array.from(e.dataTransfer.files).forEach(file => {
        if(!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const src = ev.target.result;
          const id = profileIdCounter++;
          const profile = { id, type:'data', src, name: file.name, enabled:true };
          const img = new Image();
          img.onload = () => { profile.w = img.naturalWidth; profile.h = img.naturalHeight; profileList.push(profile); renderProfiles(); updatePreview(); };
          img.src = src;
        };
        reader.readAsDataURL(file);
      });
    }
    // dragged-from-page URL fallback
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if(url){
      const first = url.split('\n')[0].trim();
      if(first){
        const id = profileIdCounter++;
        const profile = { id, type:'url', src:first, name: first.split('/').pop()||'dragged-image', enabled:true };
        const img = new Image(); img.crossOrigin='anonymous';
        img.onload = () => { profile.w = img.naturalWidth; profile.h = img.naturalHeight; profileList.push(profile); renderProfiles(); updatePreview(); };
        img.onerror = () => { profileList.push(profile); renderProfiles(); updatePreview(); };
        img.src = first;
      }
    }
  });

  // explicit Upload button (prevents accidental file opens)
  uploadBtn.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
    inp.onchange = () => {
      Array.from(inp.files || []).forEach(file => {
        if(!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const src = ev.target.result;
          const id = profileIdCounter++;
          const profile = { id, type:'data', src, name:file.name, enabled:true };
          const img = new Image(); img.onload = () => { profile.w = img.naturalWidth; profile.h = img.naturalHeight; profileList.push(profile); renderProfiles(); updatePreview(); };
          img.src = src;
        };
        reader.readAsDataURL(file);
      });
    };
    inp.click();
  });

  /* ---------- click helpers: ignore left 1/3, find smallest clickable ---------- */
  function inRightArea(rect){ return rect.left >= (window.innerWidth / 3); }

  function findSmallestClickableWithin(el){
    if(!el) return null;
    const candidates = [el].concat(Array.from(el.querySelectorAll('button, a, [role="button"], [onclick], img')));
    let best = null; let bestArea = Infinity;
    candidates.forEach(c => {
      try{
        const r = c.getBoundingClientRect();
        if(r.width <= 0 || r.height <= 0) return;
        if(!inRightArea(r)) return;
        const area = r.width * r.height;
        if(area > 0 && area < bestArea) { bestArea = area; best = c; }
      }catch(e){}
    });
    return best;
  }

  function clickElement(el){
    if(!el) return false;
    const target = findSmallestClickableWithin(el) || el;
    if(!target) return false;
    const rect = target.getBoundingClientRect();
    if(!inRightArea(rect)) return false;
    const props = { bubbles:true, cancelable:true, view:window, clientX: Math.round(rect.left + rect.width/2), clientY: Math.round(rect.top + rect.height/2) };
    try{
      target.dispatchEvent(new PointerEvent('pointerdown', props));
      target.dispatchEvent(new PointerEvent('pointerup', props));
      target.dispatchEvent(new MouseEvent('click', props));
      // flash highlight (safe restore)
      const prev = target.style.boxShadow;
      try{ target.style.boxShadow = '0 0 0 4px rgba(0,255,0,0.25)'; }catch(e){}
      setTimeout(()=>{ try{ target.style.boxShadow = prev; }catch(e){} }, 120);
      return true;
    }catch(e){ console.warn('click failed', e); return false; }
  }

  /* ---------- profile matching ---------- */
  function lastSegment(url){
    try{ return (new URL(url)).pathname.split('/').filter(Boolean).pop() || url; }catch(e){ return url.split('/').pop() || url; }
  }

  function findMatchingThumbnail(profile){
    const allImgs = Array.from(document.querySelectorAll('img'));
    const candidates = allImgs.filter(img=>{
      try{
        const r = img.getBoundingClientRect();
        if(r.width <= 0 || r.height <= 0) return false;
        if(!inRightArea(r)) return false;
        if(r.width <= 48 && r.height <= 48) return true;
        return false;
      }catch(e){ return false; }
    });
    if(candidates.length === 0) return null;

    let best = null; let bestScore = Infinity;
    candidates.forEach(img=>{
      try{
        const src = (img.currentSrc || img.src || '').toString();
        const r = img.getBoundingClientRect();
        const area = r.width * r.height;
        let score = 1000;
        if(profile.src && src === profile.src) score = 0;
        else if(profile.src && lastSegment(src) && lastSegment(profile.src) && lastSegment(src) === lastSegment(profile.src)) score = 10;
        if(profile.w && profile.h){
          const w = img.naturalWidth || img.width || r.width;
          const h = img.naturalHeight || img.height || r.height;
          score += Math.abs((w||0) - profile.w) + Math.abs((h||0) - profile.h);
        }
        score += area / 100;
        if(profile.type === 'data' && src.startsWith('data:')) score -= 5;
        if(score < bestScore){ bestScore = score; best = img; }
      }catch(e){}
    });
    return best;
  }

  /* ---------- capture logic for set buttons ---------- */
  document.querySelectorAll('.ac-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      captureMode = btn.dataset.type;
      updateStatus(`Capture: click page element for "${captureMode}"`);
      const handler = e => {
        if(e.composedPath && e.composedPath().includes(overlay)) return;
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const el = e.target;
        const sel = buildSelector(el);
        setButtons[captureMode] = { sel, el };
        captureMode = null;
        document.removeEventListener('click', handler, true);
        updateStatus();
      };
      document.addEventListener('click', handler, true);
    });
  });

  /* ---------- runner (async, respects delay for every step) ---------- */
  async function runSequenceOnce(delayMs){
    // 1) main buttons
    for(const k of ['cam','picture','send']){
      if(emergency) return false;
      const s = setButtons[k];
      const el = s && (s.sel ? safeQuery(s.sel) : s.el) || null;
      if(el) clickElement(el);
      await sleep(delayMs);
    }

    // 2) profiles in order
    for(const p of profileList){
      if(emergency) return false;
      if(!p.enabled) continue;
      const match = findMatchingThumbnail(p);
      if(match) clickElement(match);
      await sleep(delayMs);
    }

    // 3) final
    if(setButtons.final && (setButtons.final.sel || setButtons.final.el)){
      const sf = setButtons.final;
      const fe = sf.sel ? safeQuery(sf.sel) : sf.el;
      if(fe) clickElement(fe);
      await sleep(delayMs);
    }
    return true;
  }

  function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

  async function startRunner(){
    if(running) return;
    running = true;
    emergency = false;
    updateStatus();
    const delayMs = getDelayMs();
    // loop until stopped or emergency
    while(running && !emergency){
      const ok = await runSequenceOnce(delayMs);
      if(!ok) break;
      // short micro-yield between sequences to avoid lock, but main pacing is delayMs inside
      await sleep(2);
    }
    running = false;
    updateStatus();
  }

  function stopRunner(){
    running = false;
  }

  /* ---------- UI wiring ---------- */
  startBtn.addEventListener('click', () => {
    const anyBtn = Object.values(setButtons).some(s => s && (s.sel || s.el));
    if(!anyBtn && profileList.length===0){ updateStatus('Set a button or add profiles first'); setTimeout(()=>updateStatus(), 1200); return; }
    startRunner();
  });

  stopBtn.addEventListener('click', ()=>{ emergency = true; stopRunner(); updateStatus('Stopped'); setTimeout(()=>updateStatus(), 400); });

  clearBtn.addEventListener('click', ()=>{
    Object.keys(setButtons).forEach(k => setButtons[k] = { sel:null, el:null });
    profileList = [];
    profileIdCounter = 1;
    renderProfiles();
    updatePreview();
    updateStatus('Cleared');
    setTimeout(()=>updateStatus(), 800);
  });

  document.getElementById('ac-close').addEventListener('click', ()=>{ emergency=true; stopRunner(); overlay.remove(); });

  document.addEventListener('keydown', e => {
    if(e.key && e.key.toLowerCase() === 'x'){ emergency = true; stopRunner(); updateStatus('EMERGENCY STOP'); setTimeout(()=>{ emergency=false; updateStatus(); }, 700); }
  });

  /* ---------- init ---------- */
  renderProfiles();
  updatePreview();
  updateStatus();

  // debugging handle
  window.__SnapAutoClick = { startRunner, stopRunner, profileList, setButtons };

})();

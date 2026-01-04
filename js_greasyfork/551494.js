// ==UserScript==
// @name         PestPac Paste New Customer Info
// @namespace    http://tampermonkey.net/
// @version      2.18
// @description  Paste/Drop JSON -> fill PestPac form. Mapping editor (source only, branch renamed), picker overlay selects underlying elements, no persistent panel.
// @match        https://app.pestpac.com/location/add.asp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551494/PestPac%20Paste%20New%20Customer%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/551494/PestPac%20Paste%20New%20Customer%20Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'pp_precise_dragdrop_mappings_v1';
  const BTN_ID = 'pp_pastejson_direct_btn';
  const EDIT_BTN_ID = 'pp_edit_mappings_btn';
  const UI_ID = 'pp_pastejson_ui_precise';
  const DROP_ID = 'pp_pastejson_drop_target';
  const PICK_OVERLAY_ID = 'pp_pick_overlay';

  const SAMPLE = {"firstName":"First","lastName":"Last","streetAddress":"123 Main St","apt":"Apt 1","city":"Anytown","state":"CA","zip":"12345","email":"user@example.com","phone":"555-555-5555","source":"web","branch":false};

  // Timing
  const ZIP_PRE_DELAY = 300;
  const ZIP_POST_DELAY = 350;
  const WAIT_AFTER_SOURCE_WRITE = 250;
  const AUTOCOMPLETE_WAIT_TIMEOUT = 1400;
  const BRANCH_KEY_DELAY = 120;

  function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

  function loadMappingsRaw(){
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) return {};
      const parsed = JSON.parse(v);
      if (!parsed || typeof parsed !== 'object') return {};
      return parsed;
    } catch(e){ console.warn('failed parse mappings', e); return {}; }
  }
  function sanitizeMappings(m){
    const out = {};
    if (!m || typeof m !== 'object') return out;
    for (const k of Object.keys(m)){
      try { const v = m[k]; if (typeof v === 'string' && v.trim()) out[k] = v.trim(); } catch(e){}
    }
    return out;
  }
  function saveMappings(m){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m || {})); } catch(e){ console.warn(e); } }

  // Insert header buttons (v2.14 style)
  function insertHeaderButtons(){
    try {
      const headerButtons = document.querySelector('#page-header .buttons') || document.querySelector('#page-header');
      if (!headerButtons) {
        let fb = document.getElementById('pp_fallback_toolbar');
        if (!fb) {
          fb = document.createElement('div');
          fb.id = 'pp_fallback_toolbar';
          fb.style = 'position:fixed;top:8px;right:12px;z-index:999999;background:#fff;border:1px solid #ddd;padding:6px;border-radius:6px';
          document.body.appendChild(fb);
        }
        if (!document.getElementById(BTN_ID)) {
          const btn = document.createElement('button');
          btn.id = BTN_ID; btn.type = 'button'; btn.className = 'input-nav'; btn.style.marginLeft='8px';
          btn.textContent = 'Paste JSON'; btn.title = 'Paste JSON from clipboard and apply saved mappings';
          btn.addEventListener('click', onPasteClickApplyDirect);
          fb.appendChild(btn);
        }
        if (!document.getElementById(EDIT_BTN_ID)) {
          const edit = document.createElement('button');
          edit.id = EDIT_BTN_ID; edit.type = 'button'; edit.className = 'input-nav'; edit.style.marginLeft='6px';
          edit.textContent = 'Edit mappings'; edit.title = 'Open mapping editor'; edit.addEventListener('click', () => openUI(null,true));
          fb.appendChild(edit);
        }
        return;
      }

      if (!document.getElementById(BTN_ID)) {
        const btn = document.createElement('button');
        btn.id = BTN_ID; btn.type = 'button'; btn.className = 'input-nav'; btn.style.marginLeft='8px';
        btn.textContent = 'Paste JSON'; btn.title = 'Paste JSON from clipboard and apply saved mappings';
        btn.addEventListener('click', onPasteClickApplyDirect);
        headerButtons.appendChild(btn);
      }
      if (!document.getElementById(EDIT_BTN_ID)) {
        const edit = document.createElement('button');
        edit.id = EDIT_BTN_ID; edit.type = 'button'; edit.className = 'input-nav'; edit.style.marginLeft='6px';
        edit.textContent = 'Edit mappings'; edit.title = 'Open mapping editor'; edit.addEventListener('click', () => openUI(null,true));
        headerButtons.appendChild(edit);
      }
    } catch (e) { console.warn('insertHeaderButtons failed', e); }
  }

  // Paste handler
  async function onPasteClickApplyDirect(){
    try {
      const txt = await navigator.clipboard.readText();
      if (!txt) { alert('Clipboard empty'); return; }
      let data;
      try { data = JSON.parse(txt); } catch(e){ alert('Clipboard content is not valid JSON'); return; }
      const raw = loadMappingsRaw();
      const mappings = sanitizeMappings(raw);
      ensureAutoDetectedSelectors(mappings);
      await applyMappingsToPageWithZipDelayAndSpecials(data, mappings);
      focusFinalFieldBasedOnData(data);
    } catch(e){ console.warn(e); alert('Paste failed'); }
  }

  // Drop target
  function ensureDropTarget(){
    if (document.getElementById(DROP_ID)) return;
    const t = document.createElement('div');
    t.id = DROP_ID;
    t.style = 'position:fixed;left:10px;bottom:10px;z-index:2147483646;padding:8px 10px;border-radius:6px;background:#f5f5f5;border:1px dashed #999;color:#333;font-size:13px;opacity:0.9';
    t.textContent = 'Drop JSON here';
    t.addEventListener('dragover', e => { e.preventDefault(); t.style.background = '#eef'; });
    t.addEventListener('dragleave', e => { e.preventDefault(); t.style.background = '#f5f5f5'; });
    t.addEventListener('drop', async (e) => {
      e.preventDefault(); t.style.background = '#f5f5f5';
      const items = e.dataTransfer && e.dataTransfer.items;
      if (items) {
        for (let i=0;i<items.length;i++){
          try {
            const it = items[i];
            if (it.kind === 'string') {
              it.getAsString(async s => {
                try {
                  const j = JSON.parse(s);
                  const mappings = sanitizeMappings(loadMappingsRaw());
                  ensureAutoDetectedSelectors(mappings);
                  await applyMappingsToPageWithZipDelayAndSpecials(j, mappings);
                  focusFinalFieldBasedOnData(j);
                } catch(e){ alert('Dropped text is not valid JSON'); }
              });
              return;
            } else if (it.kind === 'file') {
              const f = it.getAsFile();
              const text = await f.text();
              try {
                const j = JSON.parse(text);
                const mappings = sanitizeMappings(loadMappingsRaw());
                ensureAutoDetectedSelectors(mappings);
                await applyMappingsToPageWithZipDelayAndSpecials(j, mappings);
                focusFinalFieldBasedOnData(j);
              } catch(e){ alert('Dropped file does not contain valid JSON'); }
              return;
            }
          } catch(e){}
        }
      } else {
        const files = e.dataTransfer.files;
        if (files && files.length) {
          try {
            const text = await files[0].text();
            const j = JSON.parse(text);
            const mappings = sanitizeMappings(loadMappingsRaw());
            ensureAutoDetectedSelectors(mappings);
            await applyMappingsToPageWithZipDelayAndSpecials(j, mappings);
            focusFinalFieldBasedOnData(j);
          } catch(e){ alert('Dropped file does not contain valid JSON'); }
        }
      }
    });
    document.body.appendChild(t);
  }

  // Focus logic
  function focusFinalFieldBasedOnData(jsonData) {
    try {
      const phoneInJson = !!getByPath(jsonData, 'phone') && String(getByPath(jsonData,'phone')).trim().length > 0;
      if (!phoneInJson) {
        const mobileEl = detectMobileField();
        if (mobileEl) { focusAndPlaceCaret(mobileEl); return; }
        const phoneEl = detectPhoneField();
        if (phoneEl) { focusAndPlaceCaret(phoneEl); return; }
      }
      const commentEl = document.querySelector('#Comment') || document.querySelector('input[name="Comment"], textarea[name="Comment"]');
      if (commentEl) { focusAndPlaceCaret(commentEl); return; }
    } catch (e) { console.warn('focusFinalFieldBasedOnData error', e); }
  }
  function focusAndPlaceCaret(el) {
    try {
      el.focus();
      const val = el.value || '';
      try {
        if (typeof el.setSelectionRange === 'function') {
          const len = val.length;
          el.setSelectionRange(len, len);
        } else if ('selectionStart' in el) {
          el.selectionStart = el.selectionEnd = val.length;
        }
      } catch (err) {}
      try { el.scrollIntoView({block: 'center', behavior: 'auto'}); } catch(e) {}
      dispatchEvents(el);
    } catch(e){ console.warn('focusAndPlaceCaret', e); }
  }

  function detectMobileField() {
    const inputs = Array.from(document.querySelectorAll('input'));
    for (const i of inputs) {
      try {
        const nid = ((i.name||'') + ' ' + (i.id||'') + ' ' + (i.className||'')).toLowerCase();
        if (/mobile|cell|cellphone|mphone|mobilephone/.test(nid)) return i;
      } catch(e){}
    }
    return null;
  }
  function detectPhoneField() {
    const candidates = Array.from(document.querySelectorAll('input'));
    for (const c of candidates) {
      try {
        const nid = ((c.name||'') + ' ' + (c.id||'')).toLowerCase();
        if (/phone|tel|telephone/.test(nid)) return c;
      } catch(e){}
    }
    for (const c of candidates) {
      try {
        const ml = parseInt(c.maxLength, 10) || 0;
        if (ml >= 7 && ml <= 16) {
          const val = (c.value || '').replace(/\D/g,'');
          if (!val) return c;
        }
      } catch(e){}
    }
    return null;
  }

  // Auto-detect helpers
  function ensureAutoDetectedSelectors(map){
    try {
      if (!hasMapKey(map,'apt')) { const s = detectAptSelector(); if (s) map['apt']=s; }
      if (!hasMapKey(map,'branch')) { const s = detectBranchSelect(); if (s) map['branch']=s; }
      if (!hasMapKey(map,'source')) { const s = document.querySelector('#Source') ? '#Source' : detectSourceSelector(); if (s) map['source']=s; }
      if (!hasMapKey(map,'state')) { const s = detectStateSelector(); if (s) map['state']=s; }
      if (!hasMapKey(map,'zip')) { const s = detectZipSelector(); if (s) map['zip']=s; }
      if (!hasMapKey(map,'phone')) { const s = detectPhoneSelector(); if (s) map['phone']=s; }
    } catch(e){ console.warn(e); }
  }
  function hasMapKey(map, key){
    try { for (const k of Object.keys(map||{})) if ((k||'').split('.').slice(-1)[0].toLowerCase()===key.toLowerCase()) return true; } catch(e){} return false;
  }
  function detectAptSelector(){ try { for (const el of document.querySelectorAll('label,td,span')){ const t=(el.textContent||'').toLowerCase(); if (!t) continue; if (['apt','unit','suite','apartment','ste'].some(k=>t.includes(k))) { const f=findNearestFieldForElement(el); if(f) return cssSelectorForElement(f); } } for (const i of document.querySelectorAll('input,textarea')){ const nid=((i.name||'')+' '+(i.id||'')).toLowerCase(); if (/apt|unit|suite|ste/.test(nid)) return cssSelectorForElement(i); } } catch(e){} return null; }
  function detectBranchSelect(){ try { for (const s of document.querySelectorAll('select')) { const opts = Array.from(s.options).map(o=> (o.text||'').toLowerCase()); if (opts.some(t=>t.includes('maryland')) || opts.some(t=>t.includes('tidewater')) || opts.some(t=>t.includes('virginia'))) return cssSelectorForElement(s); } for (const s of document.querySelectorAll('select')) { const nid = ((s.name||'')+' '+(s.id||'')).toLowerCase(); if (/branch|office|location/.test(nid)) return cssSelectorForElement(s); } } catch(e){} return null; }
  function detectSourceSelector(){ try { if (document.querySelector('#Source')) return '#Source'; for (const el of document.querySelectorAll('label,td,span')){ const t=(el.textContent||'').toLowerCase(); if (/source/.test(t)) { const f = findNearestFieldForElement(el); if (f) return cssSelectorForElement(f); } } for (const f of document.querySelectorAll('input,select,textarea')) { const nid = ((f.name||'')+' '+(f.id||'')).toLowerCase(); if (/source/.test(nid)) return cssSelectorForElement(f); } } catch(e){} return null; }
  function detectStateSelector(){ try { for (const s of document.querySelectorAll('select')) { const nid = ((s.name||'')+' '+(s.id||'')).toLowerCase(); if (nid.includes('state')) return cssSelectorForElement(s); const opts = Array.from(s.options).map(o => (o.value||o.text||'').toString().toUpperCase()); if (opts.some(v => /^[A-Z]{2}$/.test(v))) return cssSelectorForElement(s); } for (const i of document.querySelectorAll('input')) { const nid = ((i.name||'')+' '+(i.id||'')).toLowerCase(); if (nid.includes('state') || nid.includes('st')) return cssSelectorForElement(i); } } catch(e){} return null; }
  function detectZipSelector(){ try { for (const i of document.querySelectorAll('input')) { const nid = ((i.name||'')+' '+(i.id||'')+' '+(i.className||'')).toLowerCase(); if (/zip|postal/.test(nid)) return cssSelectorForElement(i); } } catch(e){} return null; }
  function detectPhoneSelector(){ try { for (const i of document.querySelectorAll('input')) { const nid = ((i.name||'')+' '+(i.id||'')+' '+(i.className||'')).toLowerCase(); if (/phone|tel|telephone/.test(nid)) return cssSelectorForElement(i); } } catch(e){} return null; }

  // Core apply logic (v2.14 behavior)
  async function applyMappingsToPageWithZipDelayAndSpecials(jsonData, mappings){
    try {
      const entries = Object.entries(mappings||{});
      const ZIP_TOKENS=['zip','zipcode','postal','postalcode','zip_code','postal_code','zipCode','postalCode'];
      const isZip = ([p,s]) => { const last=(p||'').split('.').slice(-1)[0].toLowerCase(); if (ZIP_TOKENS.includes(last)) return true; const sel=(s||'').toLowerCase(); return ZIP_TOKENS.some(t=>sel.includes(t)); };

      const nonZip = entries.filter(e=>!isZip(e));
      const zips = entries.filter(e=>isZip(e));
      const applied=[]; const missing=[];

      const normalApply = async ([path,sel])=>{
        try {
          const val = getByPath(jsonData,path);
          if (val === undefined) { missing.push(path); return; }
          const el = document.querySelector(sel);
          if (!el) { missing.push(path); return; }
          fillElement(el, val);
          applied.push(path);
        } catch(e){ console.warn('normalApply error', e); missing.push(path); }
      };

      for (const [p,sel] of nonZip){
        const key=(p||'').split('.').slice(-1)[0].toLowerCase();
        if (['apt','branch','source','leadsource','lead','state','zip','phone','mobile'].includes(key)) continue;
        await normalApply([p,sel]);
      }

      const aptEntry = entries.find(([p])=> (p||'').split('.').slice(-1)[0].toLowerCase() === 'apt');
      if (aptEntry) await normalApply(aptEntry);

      const branchEntry = entries.find(([p])=> ['branch','branchlocation','branch_location'].includes((p||'').split('.').slice(-1)[0].toLowerCase()));
      let branchSelect = branchEntry ? document.querySelector(branchEntry[1]) : null;
      if (!branchSelect) { const detected = detectBranchSelect(); if (detected) branchSelect = document.querySelector(detected); }

      // determine desired branch from JSON (support both new "branch" and legacy "tidewater")
      let desiredBranchFromJson = null;
      try {
        const stJson = (getByPath(jsonData,'state') || '').toString().trim().toUpperCase();

        // legacy/two-name support: check both "branch" and "tidewater"
        const branchVal = getByPath(jsonData,'branch');
        const tideVal = getByPath(jsonData,'tidewater');

        // If explicit branch string provided, prefer it
        if (branchVal !== undefined && branchVal !== null) {
          if (typeof branchVal === 'string') {
            const b = String(branchVal).trim().toLowerCase();
            if (b.includes('tide')) desiredBranchFromJson = 'Tidewater';
            else if (b.includes('mary')) desiredBranchFromJson = 'Maryland';
            else if (b.includes('virg')) desiredBranchFromJson = 'Virginia';
          } else if (branchVal === true) {
            if (stJson === 'VA') desiredBranchFromJson = 'Tidewater';
            else if (stJson === 'MD' || stJson === 'DC') desiredBranchFromJson = 'Maryland';
          }
        }

        // If no explicit branch found, honor legacy "tidewater": true/false or string
        if (!desiredBranchFromJson && tideVal !== undefined && tideVal !== null) {
          if (typeof tideVal === 'string') {
            const t = String(tideVal).trim().toLowerCase();
            if (t === 'true' || t.includes('true')) {
              if (stJson === 'VA') desiredBranchFromJson = 'Tidewater';
              else if (stJson === 'MD' || stJson === 'DC') desiredBranchFromJson = 'Maryland';
            } else {
              if (t.includes('tide')) desiredBranchFromJson = 'Tidewater';
              else if (t.includes('mary')) desiredBranchFromJson = 'Maryland';
              else if (t.includes('virg')) desiredBranchFromJson = 'Virginia';
            }
          } else if (tideVal === true) {
            if (stJson === 'VA') desiredBranchFromJson = 'Tidewater';
            else if (stJson === 'MD' || stJson === 'DC') desiredBranchFromJson = 'Maryland';
          }
        }

        // fallback: infer from state only if still unset
        if (!desiredBranchFromJson && stJson) {
          if (stJson === 'MD' || stJson === 'DC') desiredBranchFromJson = 'Maryland';
          else if (stJson === 'VA') desiredBranchFromJson = 'Virginia';
        }
      } catch(e){}

      // SOURCE: only "source" handled (no leadSource override)
      let sourceEntry = entries.find(([p])=> { const last=(p||'').split('.').slice(-1)[0].toLowerCase(); return last === 'source' || last === 'leadsource' || last === 'lead'; });
      if (!sourceEntry) {
        const detected = detectSourceSelector(); if (detected) sourceEntry = ['source', detected];
      }
      if (sourceEntry) {
        const [path, sel] = sourceEntry;
        const valRaw = getByPath(jsonData, path);
        if (valRaw !== undefined) {
          try {
            const el = document.querySelector(sel) || document.querySelector('#Source');
            if (!el) { missing.push(path); }
            else {
              const code = String(valRaw || '').trim();
              const token = mapSourceCodeToToken(code);
              el.focus();
              setNativeValue(el, token);
              dispatchEvents(el);
              await sleep(WAIT_AFTER_SOURCE_WRITE);
              const clicked = await clickAutocompleteMenuItemMatching(token);
              if (!clicked) dispatchEvents(el);
              applied.push(path);
            }
          } catch(e){ console.warn('source handling failed', e); missing.push(path); }
        }
      }

      for (const [p,sel] of nonZip){
        const last=(p||'').split('.').slice(-1)[0].toLowerCase();
        if (['apt','branch','source','leadsource','lead','state','zip','phone','mobile'].includes(last)) continue;
        if (!applied.includes(p)) await normalApply([p,sel]);
      }

      if (zips.length){
        await sleep(ZIP_PRE_DELAY);
        for (const [p,sel] of zips){
          try {
            const val = getByPath(jsonData,p);
            if (val === undefined) { missing.push(p); continue; }
            const el = document.querySelector(sel);
            if (!el) { missing.push(p); continue; }
            fillElement(el, val); applied.push(p);
          } catch(e){ console.warn('zip apply error', e); missing.push(p); }
        }
        await sleep(ZIP_POST_DELAY);
      }

      try {
        let stateText = '';
        const stateEntry = entries.find(([p])=> (p||'').split('.').slice(-1)[0].toLowerCase() === 'state');
        if (stateEntry) {
          const stateEl = document.querySelector(stateEntry[1]);
          if (stateEl) stateText = (stateEl.value || '').toString().trim();
        }
        if (!stateText) {
          const detected = detectStateSelector();
          if (detected) {
            const el = document.querySelector(detected);
            if (el) stateText = (el.value || '').toString().trim();
          }
        }
        if (stateText) {
          try { await navigator.clipboard.writeText(stateText); } catch(e) {}
        }
        if (!desiredBranchFromJson && stateText) {
          const st = stateText.toString().trim().toUpperCase();
          if (st === 'DC' || st === 'MD') desiredBranchFromJson = 'Maryland';
          else if (st === 'VA') desiredBranchFromJson = 'Virginia';
        }
      } catch(e){ console.warn('post-zip state read/copy failed', e); }

      if (branchSelect && desiredBranchFromJson) {
        try {
          const desiredBranch = desiredBranchFromJson;
          const opt = Array.from(branchSelect.options).find(o => (o.text||'').trim().toLowerCase()===desiredBranch.toLowerCase() || (o.text||'').trim().toLowerCase().includes(desiredBranch.toLowerCase()));
          if (opt){ branchSelect.value = opt.value; dispatchEvents(branchSelect); }
          else {
            const mapping={'maryland':1,'tidewater':2,'virginia':3};
            const downs = mapping[desiredBranch.toLowerCase()]||0;
            branchSelect.focus(); try{ branchSelect.click(); }catch(e){}
            for (let i=0;i<downs;i++){ dispatchKeyOnElement(branchSelect,'ArrowDown'); await sleep(BRANCH_KEY_DELAY); }
            dispatchKeyOnElement(branchSelect,'Enter'); await sleep(120);
          }
          applied.push('branch');
        } catch(e){ console.warn('apply branch failed', e); }
      }

      const stateEntryNow = entries.find(([p])=> (p||'').split('.').slice(-1)[0].toLowerCase() === 'state');
      if (stateEntryNow && !applied.includes(stateEntryNow[0])) {
        const val = getByPath(jsonData, stateEntryNow[0]);
        if (val !== undefined) {
          const el = document.querySelector(stateEntryNow[1]);
          if (el) { fillElement(el, val); applied.push(stateEntryNow[0]); }
        }
      }

      const mobileEntry = entries.find(([p])=> (p||'').split('.').slice(-1)[0].toLowerCase() === 'mobile');
      if (mobileEntry) {
        const val = getByPath(jsonData, mobileEntry[0]);
        if (val !== undefined) {
          const el = document.querySelector(mobileEntry[1]);
          if (el) { fillElement(el, val); applied.push(mobileEntry[0]); }
        }
      }
      const phoneEntry = entries.find(([p])=> (p||'').split('.').slice(-1)[0].toLowerCase() === 'phone');
      if (phoneEntry) {
        const val = getByPath(jsonData, phoneEntry[0]);
        if (val !== undefined) {
          const el = document.querySelector(phoneEntry[1]);
          if (el) { fillElement(el, val); applied.push(phoneEntry[0]); }
        }
      }

      console.log('Applied fields:', applied, 'Missing:', missing);
      if (!applied.length) console.warn('No fields applied. Check mappings.');
    } catch(e){ console.warn('applyMappings failed', e); }
  }

function normalizeForMatch(s){
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/\u00A0/g, ' ')         // non‑breaking space -> space
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, '');    // drop punctuation/symbols
}

function mapSourceCodeToToken(code){
  if (code === null || code === undefined) return '';
  const raw = normalizeForMatch(String(code));

  // canonical groups (normalized)
  const googleKeys = new Set(['g','gci','google','googleci','google ci','google callin','google call in']);
  const haKeys     = new Set(['h','ha','angi','homeadvisor','home advisor','ha angi','ha / angi','ha/angi']);
  const lizardKeys = new Set(['l','lizard']);
  const webformKeys= new Set(['web','webform','web form']);
  const batonKeys  = new Set(['baton','baton referrals','baton referral']);
  const referralKeys = new Set(['ref','referral','customer referral','referrals']);
  const unknownKeys = new Set(['','unknown','other']);

  if (googleKeys.has(raw)) return 'GOOGLE CI';
  if (haKeys.has(raw)) return 'HA / ANGI';
  if (lizardKeys.has(raw)) return 'LIZARD';
  if (webformKeys.has(raw)) return 'WEBFORM';
  if (batonKeys.has(raw)) return 'BATON';
  if (referralKeys.has(raw)) return 'REFERRAL';
  if (unknownKeys.has(raw)) return 'UNKNOWN';

  // heuristics
  if (raw.indexOf('google') !== -1) return 'GOOGLE CI';
  if (raw.indexOf('angi') !== -1 || raw.indexOf('homeadvisor') !== -1 || raw.indexOf('home advisor') !== -1) return 'HA / ANGI';
  if (raw.indexOf('lizard') !== -1) return 'LIZARD';
  if (raw.indexOf('baton') !== -1) return 'BATON';
  if (raw.indexOf('referr') !== -1) return 'REFERRAL';
  if (raw.indexOf('web') !== -1) return 'WEBFORM';

  // fallback: return trimmed upper string to try matching first-span text
  return String(code).trim().toUpperCase();
}

async function clickAutocompleteMenuItemMatching(token){
  if (!token && token !== 0) return false;
  const wantNorm = normalizeForMatch(String(token));
  const start = Date.now();
  let menu = null;

  while (Date.now() - start < AUTOCOMPLETE_WAIT_TIMEOUT){
    const uls = Array.from(document.querySelectorAll('ul.ui-autocomplete')).filter(u => {
      try {
        const style = window.getComputedStyle(u);
        return style && style.display !== 'none' && u.offsetParent !== null;
      } catch(e){ return false; }
    });
    if (uls.length) { menu = uls[0]; break; }
    await sleep(100);
  }
  if (!menu) return false;

  const items = Array.from(menu.querySelectorAll('li.ui-menu-item'));

  // helper to normalize span text/title quickly
  const normSpan = (span) => normalizeForMatch(span && (span.getAttribute && span.getAttribute('title') || span.textContent || ''));

  // 1) Try to match by second span title/text (descriptive), best for human labels
  for (const li of items){
    try {
      const a = li.querySelector('a') || li;
      const spans = Array.from(a.querySelectorAll('span'));
      if (spans.length >= 2) {
        const secondNorm = normSpan(spans[1]);
        if (!secondNorm) continue;
        if (secondNorm === wantNorm) { clickMenuAnchor(a); return true; }
        if (secondNorm.indexOf(wantNorm) !== -1) { clickMenuAnchor(a); return true; }
      }
    } catch(e){}
  }

  // 2) Match by first span (short code) exact or startsWith (normalized)
  for (const li of items){
    try {
      const a = li.querySelector('a') || li;
      const spans = Array.from(a.querySelectorAll('span'));
      if (spans.length > 0) {
        const firstNorm = normSpan(spans[0]);
        if (!firstNorm) continue;
        if (firstNorm === wantNorm) { clickMenuAnchor(a); return true; }
        if (firstNorm.startsWith(wantNorm)) { clickMenuAnchor(a); return true; }
      }
    } catch(e){}
  }

  // 3) Fallback: match by any item text content
  for (const li of items){
    try {
      const a = li.querySelector('a') || li;
      const txtNorm = normalizeForMatch(a.textContent || '');
      if (!txtNorm) continue;
      if (txtNorm.indexOf(wantNorm) !== -1) { clickMenuAnchor(a); return true; }
    } catch(e){}
  }

  return false;
}
  function clickMenuAnchor(a){
    try { a.click(); a.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true})); a.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,cancelable:true})); } catch(e){ console.warn('clickMenuAnchor', e); }
  }

  // Utilities
  function dispatchKeyOnElement(el, keyName){ try { const key = keyName; const code = (keyName==='Tab'?'Tab': (keyName.length===1 ? 'Key'+keyName.toUpperCase() : keyName)); el.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles:true, cancelable:true })); el.dispatchEvent(new KeyboardEvent('keypress', { key, code, bubbles:true, cancelable:true })); el.dispatchEvent(new KeyboardEvent('keyup', { key, code, bubbles:true, cancelable:true })); if (keyName.length===1) el.dispatchEvent(new InputEvent('input', { data:keyName, bubbles:true, cancelable:true })); } catch(e){} }
  function findNearestFieldForElement(el){ if (!el) return null; if (el.matches && el.matches('input,select,textarea')) return el; const tr = el.closest && el.closest('tr'); if (tr){ const f = tr.querySelector('input,select,textarea'); if (f) return f; } const next = el.parentElement ? el.parentElement.nextElementSibling : null; if (next){ const f = next.querySelector('input,select,textarea'); if (f) return f; } const direct = el.nextElementSibling; if (direct && direct.matches && direct.matches('input,select,textarea')) return direct; const parent = el.closest && (el.closest('form') || el.parentElement); if (parent){ const f = parent.querySelector('input,select,textarea'); if (f) return f; } const inputs = Array.from(document.querySelectorAll('input,select,textarea')); if (!inputs.length) return null; let best=null, bestDist=Infinity; let r; try{ r = el.getBoundingClientRect(); }catch(e){ r={left:0,top:0,width:0,height:0}; } const cx = r.left + r.width/2, cy = r.top + r.height/2; for (const i of inputs){ let b; try{ b=i.getBoundingClientRect(); }catch(e){ continue; } const icx=b.left+b.width/2, icy=b.top+b.height/2; const dx=icx-cx, dy=icy-cy; const d=Math.sqrt(dx*dx+dy*dy); if (d<bestDist){ bestDist=d; best=i; } } return best; }
  function cssSelectorForElement(el){ if (!el) return ''; if (el.id) return '#'+el.id; if (el.name) return `${el.tagName.toLowerCase()}[name="${el.name}"]`; const parts=[]; let cur=el; while(cur && cur.nodeType===1 && cur!==document.body && parts.length<8){ let p=cur.tagName.toLowerCase(); if (cur.className && typeof cur.className==='string'){ const cls=cur.className.trim().split(/\s+/)[0]; if (cls) p += '.'+cls; } const parent = cur.parentElement; if (parent){ const siblings=Array.from(parent.children).filter(c => c.tagName===cur.tagName); if (siblings.length>1){ const idx=siblings.indexOf(cur)+1; p += `:nth-of-type(${idx})`; } } parts.unshift(p); cur=cur.parentElement; } return parts.join(' > '); }
  function fillElement(el, value){ if (!el) return; const tag=(el.tagName||'').toLowerCase(); try { if (tag==='input' || tag==='textarea'){ const type=(el.type||'').toLowerCase(); if (type==='checkbox') el.checked = !!value; else if (type==='radio'){ const rr = document.querySelectorAll(`input[type=radio][name="${el.name}"]`); let found=false; rr.forEach(r=>{ if (String(r.value)===String(value)){ r.checked=true; found=true; }}); if (!found) setNativeValue(el, String(value)); } else setNativeValue(el, String(value)); } else if (tag==='select'){ const opt = Array.from(el.options).find(o => (o.value||'').toLowerCase()===String(value).toLowerCase() || (o.text||'').toLowerCase()===String(value).toLowerCase()); if (opt) el.value = opt.value; else el.value = value; dispatchEvents(el); } else { if (el.isContentEditable) el.innerText = String(value); else el.textContent = String(value); } dispatchEvents(el); } catch(e){ console.warn('fillElement', e); } }
  function setNativeValue(el, value){ try { const proto = Object.getPrototypeOf(el); const desc = Object.getOwnPropertyDescriptor(proto, 'value'); if (desc && desc.set) desc.set.call(el, value); else el.value = value; } catch(e){ try{ el.value = value; }catch(e){} } }
  function dispatchEvents(el){ try{ ['input','change','blur'].forEach(n => el.dispatchEvent(new Event(n,{bubbles:true}))); }catch(e){} }
  function getByPath(obj, path){ if (!path) return undefined; const parts = path.split('.'); let cur = obj; for (const p of parts){ if (cur==null) return undefined; cur = cur[p]; } return cur; }

  // Mapping editor UI (source-only, branch label)
  function openUI(jsonData, forceSample){
    try {
      removeUI();
      const header = document.querySelector('#page-header') || document.body;
      const ui = document.createElement('div');
      ui.id = UI_ID;
      ui.style = 'position:relative;margin:12px 0;padding:10px;border:1px solid #ddd;background:#fff;z-index:2147483646;max-width:980px';
      ui.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:600">Mapping Editor</div>
          <div style="display:flex;gap:8px">
            <button id="${UI_ID}_loadsample" type="button">Load sample</button>
            <button id="${UI_ID}_clearmap" type="button">Clear mappings</button>
            <button id="${UI_ID}_close" type="button">Close</button>
          </div>
        </div>
        <div id="${UI_ID}_body" style="max-height:360px;overflow:auto"></div>
        <div style="text-align:right;margin-top:8px">
          <button id="${UI_ID}_save" type="button">Save mappings</button>
        </div>
      `;
      try{ header.parentNode.insertBefore(ui, header.nextSibling); }catch(e){ document.body.appendChild(ui); }
      document.getElementById(UI_ID+'_close').addEventListener('click', removeUI);
      document.getElementById(UI_ID+'_loadsample').addEventListener('click', ()=> populateUIWithData(SAMPLE));
      document.getElementById(UI_ID+'_clearmap').addEventListener('click', ()=> {
        if (!confirm('Clear all saved mappings?')) return;
        saveMappings({});
        populateUIWithData(SAMPLE);
        alert('Mappings cleared');
      });
      document.getElementById(UI_ID+'_save').addEventListener('click', ()=> {
        const rows = Array.from(document.querySelectorAll(`#${UI_ID}_body .pp-row`));
        const newMap = loadMappingsRaw();
        rows.forEach(r=>{
          const key = r.dataset.key;
          const sel = r.querySelector('input.pp-selector').value.trim();
          if (sel) newMap[key] = sel; else delete newMap[key];
        });
        saveMappings(sanitizeMappings(newMap));
        alert('Mappings saved');
      });

      const saved = loadMappingsRaw()||{};
      const keysSet = new Set();
      Object.keys(saved||{}).forEach(k=>keysSet.add(k));
      Object.keys(SAMPLE||{}).forEach(k=>keysSet.add(k));
      if (jsonData && typeof jsonData === 'object') Object.keys(jsonData).forEach(k=>keysSet.add(k));
      // ensure source and branch appear, and avoid showing leadSource as separate label
      keysSet.add('source'); keysSet.add('branch');
      const keys = Array.from(keysSet);
      const body = document.getElementById(UI_ID+'_body');
      body.innerHTML = '';
      keys.forEach(k=>{
        const row=document.createElement('div'); row.className='pp-row'; row.dataset.key=k;
        row.style='display:flex;gap:8px;align-items:center;margin-bottom:6px;padding:6px;border:1px solid #eee;background:#fafafa';
        const val = (jsonData && jsonData[k] !== undefined) ? String(jsonData[k]) : (SAMPLE[k] !== undefined ? String(SAMPLE[k]) : '');
        const existing = saved[k] || '';
        row.innerHTML = `<div style="width:28%">${k}</div>
          <input class="pp-selector" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px" value="${escapeHtml(existing)}">
          <div style="width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:6px">${escapeHtml(val)}</div>
          <span class="pp-pick-button" role="button" tabindex="0" style="margin-left:6px;padding:4px 8px;border-radius:4px;border:1px solid #ccc;background:#fff;cursor:pointer;user-select:none">Pick</span>`;
        body.appendChild(row);
        const pickBtn = row.querySelector('.pp-pick-button');
        if (pickBtn) {
          pickBtn.addEventListener('click', function pickClickHandler(e) {
            try { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); startClickPickForRow(k, row.querySelector('input.pp-selector')); } catch (err) { console.warn('pickClickHandler', err); }
          }, { capture: true });
          pickBtn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); startClickPickForRow(k, row.querySelector('input.pp-selector')); } });
        }
      });
    } catch(e){ console.warn('openUI failed', e); alert('Mapping editor failed to open'); }
  }
  function removeUI(){ const ui=document.getElementById(UI_ID); if(ui)ui.remove(); removePickOverlay(); }
  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // Picker overlay: uses pointer-events toggle to select underlying element
  function startClickPickForRow(key,inputEl){
    removePickOverlay();
    const overlay=document.createElement('div'); overlay.id = PICK_OVERLAY_ID;
    overlay.style='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.12);cursor:crosshair';
    overlay.innerHTML = `<div style="position:fixed;left:50%;top:12px;transform:translateX(-50%);background:#222;color:#fff;padding:8px;border-radius:6px;pointer-events:none">Click element for ${key} (Esc to cancel)</div>`;
    document.body.appendChild(overlay);

    let lastHover = null;
    function clearPickHover(){ if (lastHover) { try { lastHover.style.outline = lastHover.__pp_old_outline || ''; } catch(e){} try { delete lastHover.__pp_old_outline; } catch(e){} lastHover = null; } }
    function underlyingElementAt(x,y){ try { overlay.style.pointerEvents = 'none'; const el = document.elementFromPoint(x, y); overlay.style.pointerEvents = ''; return el; } catch(e){ try { overlay.style.pointerEvents = ''; } catch(e){} return null; } }

    function onMove(e){
      try {
        const el = underlyingElementAt(e.clientX, e.clientY);
        if (!el) { clearPickHover(); return; }
        if (el === overlay || overlay.contains(el)) { clearPickHover(); return; }
        if (el === lastHover) return;
        clearPickHover();
        try { lastHover = el; lastHover.__pp_old_outline = lastHover.style.outline; lastHover.style.outline = '3px solid #ff0'; } catch(err){ lastHover = null; }
      } catch(err){ console.warn('picker onMove', err); }
    }

    function onClick(e){
      try {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const el = underlyingElementAt(e.clientX, e.clientY);
        if (!el || el === overlay || overlay.contains(el)) { cleanup(); return; }
        inputEl.value = cssSelectorForElement(el);
        try { inputEl.dispatchEvent(new Event('input', {bubbles:true})); inputEl.dispatchEvent(new Event('change', {bubbles:true})); } catch(e){}
        cleanup();
      } catch(err){ console.warn('picker onClick', err); cleanup(); }
    }

    function onKey(e){
      if (e.key === 'Escape') { try { e.preventDefault(); e.stopPropagation(); } catch(e){} cleanup(); }
    }

    function cleanup(){
      clearPickHover();
      overlay.removeEventListener('mousemove', onMove, {capture:false});
      overlay.removeEventListener('click', onClick, {capture:true});
      document.removeEventListener('keydown', onKey, {capture:false});
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    overlay.addEventListener('mousemove', onMove, {capture:false});
    overlay.addEventListener('click', onClick, {capture:true});
    document.addEventListener('keydown', onKey, {capture:false});
  }
  function removePickOverlay(){ const o=document.getElementById(PICK_OVERLAY_ID); if(o) o.remove(); }

  // init
  function ready(fn){ if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(()=>{
    insertHeaderButtons();
    new MutationObserver(()=>{ if(!document.getElementById(BTN_ID)) insertHeaderButtons(); }).observe(document.body,{childList:true,subtree:true});
    ensureDropTarget();
    // persistent panel intentionally removed per request
  });

})();
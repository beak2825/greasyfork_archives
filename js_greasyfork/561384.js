// ==UserScript==
// @name         WM Norway + Sweden — gulesider + 1881 + ratsit + mrkoll + BE loader 
// @namespace    qc-automation
// @version      2.0.4
// @description  Scrape (ratsit/mrkoll/gulesider/1881) → last-only cache → BE fill (address, phones, spouse & DOB, positions). Liquidity parser for events. Diacritics normalized at scrape + fill. Robust UI injection. Black pop-ups preserved (ratsit/mrkoll) with Save to cache button.
// @match        https://www.gulesider.no/*
// @match        https://www.1881.no/*
// @match        https://www.ratsit.se/*
// @match        https://mrkoll.se/person/*
// @match        https://admin.mergermarket.com/*
// @run-at       document-idle
// @allFrames    true
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/561384/WM%20Norway%20%2B%20Sweden%20%E2%80%94%20gulesider%20%2B%201881%20%2B%20ratsit%20%2B%20mrkoll%20%2B%20BE%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/561384/WM%20Norway%20%2B%20Sweden%20%E2%80%94%20gulesider%20%2B%201881%20%2B%20ratsit%20%2B%20mrkoll%20%2B%20BE%20loader.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /*** Shared constants ***/
  const CACHE_NS = 'wm-person-cache-no';      // last-only cache for NO & SE
  const MAP_NS   = 'wm-no-muni-county-map';   // optional municipality→legacy county map (NO)
  const host     = location.host;

  /*** Generic helpers ***/
  const byId = (id) => document.getElementById(id);
  const q    = (sel, root=document) => root.querySelector(sel);
  const qa   = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const text = (el) => (el && el.textContent || '').trim();
  const sleep= (ms) => new Promise(res => setTimeout(res, ms));
  function getTopDoc(){ try { return window.top.document; } catch { return document; } }
  function byIdTop(id){ try { return getTopDoc().getElementById(id); } catch { return null; } }

  function toast(msg){
    const el = document.createElement('div');
    el.textContent = msg;
    el.style = 'position:fixed;right:20px;bottom:20px;background:#111;color:#fff;padding:8px 12px;border:none;border-radius:6px;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.35);font:12px/1.3 system-ui';
    (document.body || document.documentElement).appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
  function todayDDMMYYYY(){
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  /*** Special character normalization ***/
  function fixSpecialChars(s){
    return String(s||'')
      .replace(/æ/g,'ae').replace(/Æ/g,'AE')
      .replace(/ø/g,'o').replace(/Ø/g,'O')
      .replace(/å/g,'a').replace(/Å/g,'A')
      .replace(/ä/g,'a').replace(/Ä/g,'A')
      .replace(/ö/g,'o').replace(/Ö/g,'O')
      .replace(/é/g,'e').replace(/É/g,'E');
  }

  /*** GM storage — LAST RECORD ONLY ***/
  async function loadLast(){
    const raw = await GM_getValue(CACHE_NS, '{}');
    let parsed;
    try { parsed = JSON.parse(raw || '{}'); } catch { parsed = {}; }
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.updatedAt) return parsed;
    const vals = Object.values(parsed || {}).filter(v => v && typeof v === 'object' && v.updatedAt);
    if (vals.length){
      const latest = vals.sort((a,b) => (b.updatedAt||'').localeCompare(a.updatedAt||''))[0];
      await GM_setValue(CACHE_NS, JSON.stringify(latest));
      return latest;
    }
    return null;
  }
  async function saveLast(rec){
    await GM_setValue(CACHE_NS, JSON.stringify(rec || {}));
  }
  async function setLastPerson(patch){
    const current = await loadLast();
    const merged = { ...(current || {}), ...patch, updatedAt: todayDDMMYYYY() };
    await saveLast(merged);
    console.log('[Cache] Saved last:', merged.name, merged);
  }

  /*** Municipality→county map (optional for NO) ***/
  async function getMap(){
    const raw = await GM_getValue(MAP_NS, 'null');
    try { return JSON.parse(raw || 'null') || {}; } catch { return {}; }
  }
  async function setMap(obj){
    await GM_setValue(MAP_NS, JSON.stringify(obj || {}));
  }

  /*** Normalization helpers ***/
  function normKey(s){
    return (String(s)||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/\s+/g,' ').trim();
  }
  function titleCaseNO(s){ return String(s||'').split(/\s+/).map(w => w ? (w[0].toLocaleUpperCase()+w.slice(1)) : w).join(' '); }
  function restoreNO(s){
    return titleCaseNO(String(s||'')
      .replace(/\boe\b/g,'ø').replace(/oe/g,'ø')
      .replace(/\bae\b/g,'æ').replace(/ae/g,'æ')
      .replace(/\baa\b/g,'å').replace(/aa/g,'å')
    ).replace(/\s+/g,' ').trim();
  }
  function makeDisplayAddress(address1, postcode, city){
    const line1 = String(address1 || '').trim();
    const line2 = [String(postcode || '').trim(), String(city || '').trim()].filter(Boolean).join(' ');
    return [line1, line2].filter(Boolean).join('\n');
  }

  /*** Legacy county mapping (NO) ***/
  const MUNICIPALITY_TO_LEGACY_DEFAULT = {
    'Sør-Odal':'Hedmark','Nord-Odal':'Hedmark','Kongsvinger':'Hedmark','Hamar':'Hedmark','Stange':'Hedmark','Løten':'Hedmark','Ringsaker':'Hedmark',
    'Lillehammer':'Oppland','Gjøvik':'Oppland','Østre Toten':'Oppland','Vestre Toten':'Oppland',
    'Tvedestrand':'Aust-Agder','Risør':'Aust-Agder','Arendal':'Aust-Agder','Grimstad':'Aust-Agder','Froland':'Aust-Agder','Vegårshei':'Aust-Agder','Gjerstad':'Aust-Agder',
    'Kristiansand':'Vest-Agder','Lindesnes':'Vest-Agder','Lyngdal':'Vest-Agder','Vennesla':'Vest-Agder','Farsund':'Vest-Agder','Sirdal':'Vest-Agder','Kvinesdal':'Vest-Agder','Åseral':'Vest-Agder','Hægebostad':'Vest-Agder',
    'Oslo':'Oslo','Bærum':'Akershus','Asker':'Akershus','Lørenskog':'Akershus','Ullensaker':'Akershus',
    'Sandefjord':'Vestfold','Tønsberg':'Vestfold','Larvik':'Vestfold','Færder':'Vestfold',
    'Skien':'Telemark','Porsgrunn':'Telemark','Bamble':'Telemark','Nome':'Telemark',
    'Stavanger':'Rogaland','Sandnes':'Rogaland','Haugesund':'Rogaland',
    'Bergen':'Hordaland','Askøy':'Hordaland','Øygarden':'Hordaland',
    'Førde':'Sogn og Fjordane','Sogndal':'Sogn og Fjordane','Stryn':'Sogn og Fjordane'
  };
  function legacyCountyFromPostcodePrefix(postcode){
    const pfx = parseInt(String(postcode || '').slice(0,2), 10);
    if (isNaN(pfx)) return '';
    if (pfx >= 0 && pfx <= 12) return 'Oslo';
    if (pfx >= 13 && pfx <= 14) return 'Akershus';
    if (pfx >= 15 && pfx <= 18) return 'Ostfold';
    if (pfx >= 19 && pfx <= 21) return 'Akershus';
    if (pfx >= 21 && pfx <= 25) return 'Hedmark';
    if (pfx >= 26 && pfx <= 29) return 'Oppland';
    if (pfx === 30) return 'Buskerud';
    if (pfx >= 30 && pfx <= 32) return 'Vestfold';
    if (pfx >= 33 && pfx <= 36) return 'Buskerud';
    if (pfx >= 36 && pfx <= 39) return 'Telemark';
    if (pfx >= 40 && pfx <= 44) return 'Rogaland';
    if (pfx >= 44 && pfx <= 47) return 'Vest-Agder';
    if (pfx >= 48 && pfx <= 49) return 'Aust-Agder';
    if ([50,51,52,53,54,56,58].includes(pfx)) return 'Hordaland';
    if ([57,59,67,68,69].includes(pfx)) return 'Sogn og Fjordane';
    if (pfx >= 60 && pfx <= 66) return 'More og Romsdal';
    if (pfx >= 70 && pfx <= 75) return 'Sor-Trondelag';
    if (pfx >= 76 && pfx <= 79) return 'Nord-Trondelag';
    if (pfx >= 79 && pfx <= 89) return 'Nordland';
    if (pfx >= 90 && pfx <= 94) return 'Troms';
    if (pfx >= 95 && pfx <= 99) return 'Finnmark';
    return '';
  }
  async function deriveLegacyCounty(municipality, postcode){
    const userMap = await getMap();
    const base = { ...MUNICIPALITY_TO_LEGACY_DEFAULT, ...userMap };
    const lookup = {};
    for (const [k,v] of Object.entries(base)){
      lookup[k] = v;
      lookup[fixSpecialChars(k)] = v; // normalized alias
    }
    const m = String(municipality || '').trim();
    if (m && lookup[m]) return lookup[m];
    return legacyCountyFromPostcodePrefix(postcode) || '';
  }

  /*** ===================== ROUTING ===================== ***/

  /*** -------- ratsit.se scraper + black pop-up -------- ***/
  if (host.includes('ratsit.se')) {
    if (!/\/\d{8}-/.test(location.pathname)) return;

    const COLOR_POPUP_BG = '#1a1a1a';
    const COLOR_CONTROL_BAR = '#252525';
    const COLOR_FOOTER_BAR = '#222';
    const COLOR_DIVIDER = '#333';
    const COLOR_TEXT_DEFAULT = '#e0e0e0';
    const COLOR_EDIT_BG = '#353840';
    const INITIAL_WIDTH = 700, INITIAL_HEIGHT = 700, MIN_WIDTH = 400, MIN_HEIGHT = 400;

    function capitalizeFirstLetter(str){ return !str ? str : str.charAt(0).toUpperCase() + str.slice(1); }
    function cleanSE(str){
      return fixSpecialChars(String(str||''))
        .replace(/\s+/g,' ').trim();
    }
    function fixCitySE(str){ return String(str||'').replace(/Göteborg/gi, 'Gothenburg'); }
    function fixPhoneSE(raw){
      const d = String(raw||'').replace(/\D/g,'').replace(/^46/,'').replace(/^0/,'');
      if (!d || d.length < 6) return '';
      return `(0)${d.slice(0, 2)} ${d.slice(2)}`;
    }
    function fixDateSE(txt){
      const mon = { januari:'01', februari:'02', mars:'03', april:'04', maj:'05', juni:'06',
                    juli:'07', augusti:'08', september:'09', oktober:'10', november:'11', december:'12' };
      const m = String(txt||'').toLowerCase().match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/);
      if (!m) return '';
      return `${String(m[1]).padStart(2,'0')}/${mon[m[2]]}/${m[3]}`;
    }

    function extractRatsitRecord(){
      const rec = {
        country:'SWE',
        id:'',
        name:'',
        address1:'',
        postcode:'',
        city:'',
        countyRaw:'',
        spouse:'',
        dob:'',
        phones:[],
        positionsBlock:'',
        sources:{ addrPhoneSrc: 'ratsit.se' },
        displayAddressLines:'',
        updatedAt: todayDDMMYYYY()
      };

      const name = text(q('h1'));
      if (name) rec.name = cleanSE(name);

      // Address street + line with zip & city
      let street='', postal='';
      const divs = qa('div');
      for (let i = 0; i < divs.length - 1; i++) {
        const a = text(divs[i]);
        const b = text(divs[i+1]);
        if (/^[A-Za-zÅÄÖåäöéÉ\s\-\.]+\s+\d/.test(a) && /^\d{3}\s?\d{2}\s+[A-Za-zÅÄÖåäöéÉ]/.test(b)) {
          street = capitalizeFirstLetter(cleanSE(a.replace(/\s+lgh\s+\d+/i,'')));
          const cleanedPostal = cleanSE(fixCitySE(b));
          const m = cleanedPostal.match(/(\d{3}\s?\d{2})\s+(.+)/);
          if (m){ postal = m[1]; rec.city = capitalizeFirstLetter(m[2].trim()); }
          break;
        }
      }
      const lm = (document.body.innerText||'').match(/Län:\s*([^\n(]+)/i);
      if (lm) rec.countyRaw = cleanSE(lm[1].trim());
      rec.address1 = street;
      rec.postcode = postal;
      rec.city = cleanSE(rec.city);
      rec.displayAddressLines = makeDisplayAddress(rec.address1, rec.postcode, rec.city);

      // Phones
      const nameTxt = rec.name;
      const phones = new Set();
      qa('a[href^="tel:"]').forEach(a=>{
        const parentDiv = a.closest('div');
        if (parentDiv){
          const strongTag = parentDiv.querySelector('strong');
          if (strongTag && strongTag.innerText.trim() && strongTag.innerText.trim() !== nameTxt) return;
        }
        let p=a;
        for (let i=0;i<5;i++){
          p=p.parentElement; if(!p) break;
          if (p.innerText.includes(nameTxt)){
            const fixed = fixPhoneSE(text(a));
            if (fixed) phones.add(fixed);
            break;
          }
        }
      });
      rec.phones = Array.from(phones);

      // Spouse
      const mSp = (document.body.innerText||'').match(/är gift med\s+([^\n]+)/i);
      if (mSp){
        const spouseFirst = capitalizeFirstLetter(cleanSE(mSp[1].trim().split(' ')[0]));
        rec.spouse = spouseFirst;
      }

      // DOB
      qa('p').forEach(p=>{
        if (p.innerText.includes('Födelsedag:')){
          const d = fixDateSE(p.innerText);
          if (d) rec.dob = d;
        }
      });

      // Other positions
      const roles = {
        'Ordförande':'Chairman','Verkställande direktör':'CEO','VD':'CEO','Extern VD':'CEO',
        'Vice VD':'Deputy CEO','Styrelseledamot':'Board Member','Styrelsesuppleant':'Deputy Board Member','Vice ordförande':'Deputy Chairman'
      };
      const skip = ['Verklig Huvudman','Revisor','Innehavare'];
      const comp = new Map();
      qa('table tbody tr').forEach(tr=>{
        const tds = tr.querySelectorAll('td'); if (tds.length < 4) return;
        const cname = cleanSE(tds[0].innerText.trim());
        const status= tds[2].innerText;
        const role  = tds[3].innerText;
        if (!/Aktiv/.test(status)) return;
        if (skip.some(s=>role.includes(s))) return;
        const rs = new Set();
        for (const [sv,en] of Object.entries(roles)) if (role.includes(sv)) rs.add(en);
        if (!rs.size) return;
        if (!comp.has(cname)) comp.set(cname,new Set());
        rs.forEach(r=>comp.get(cname).add(r));
      });
      if (comp.size){
        const rolePriority = { 'CEO':1,'Chairman':2,'Deputy Chairman':3,'Deputy CEO':4,'Deputy Board Member':5,'Board Member':6 };
        const lines=['Other positions:'];
        comp.forEach((rs,cn)=>{
          let rolesArr=Array.from(rs);
          if ((rolesArr.includes('Chairman')||rolesArr.includes('Deputy Chairman')) && rolesArr.includes('Board Member')){
            rolesArr=rolesArr.filter(r=>r!=='Board Member');
          }
          const sorted = rolesArr.sort((a,b)=> (rolePriority[a]||999)-(rolePriority[b]||999));
          lines.push(`- ${cn}, ${sorted.join(', ')}`);
        });
        rec.positionsBlock = lines.join('\n');
      }

      rec.id = `SWE:${normKey(rec.name)}:${normKey(rec.postcode||'')}`;
      return rec;
    }

    function formatRatsitText(rec){
      const out=[];
      if (rec.name) { out.push(rec.name); out.push(''); }
      if (rec.address1) out.push(rec.address1);
      if (rec.postcode || rec.city) out.push([rec.postcode, rec.city].filter(Boolean).join(' '));
      if (rec.countyRaw) out.push(`(lan ${rec.countyRaw})`);
      if (rec.phones?.length){ out.push(''); rec.phones.forEach(p=>out.push(p)); }
      if (rec.spouse) { out.push(''); out.push(`Spouse's name: ${rec.spouse}`); }
      if (rec.dob)    { out.push(''); out.push(`Date of birth: ${rec.dob}`); }
      if (rec.positionsBlock){ out.push(''); out.push(rec.positionsBlock); }
      out.push(''); out.push('ratsit');
      return out.join('\n');
    }

    function showRatsitPopup(rec){
      try { window.top.document.getElementById('ratsitPop')?.remove(); } catch {}
      document.getElementById('ratsitPop')?.remove();

      const topDoc = getTopDoc();
      const popup = topDoc.createElement('div'); popup.id='ratsitPop';

      const buttonStyle = `background:#3a3a3a;color:#e0e0e0;border:1px solid #555;border-radius:4px;cursor:pointer;transition:background .2s,border-color .2s,color .2s;font-weight:bold;`;
      const smallButtonStyle = `${buttonStyle} padding:4px 8px;font-size:14px;`;
      const mainButtonStyle  = `${buttonStyle} flex:1; padding:6px 12px; font-size:14px;`;
      popup.innerHTML = `
        <div id="popupContainer" style="position:fixed; top:60px; right:20px; width:700px; height:700px; max-width:90vw; background:#1a1a1a; border:2px solid #333; border-radius:12px; z-index:999999; font-family:Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.6); display:flex; flex-direction:column; overflow:hidden; min-width:400px; min-height:400px;">
          <div id="rDragHandle" style="padding:10px 14px; background:#252525; display:flex; justify-content:flex-end; align-items:center; border-bottom:1px solid #333; cursor: grab;">
            <button id="rClose" style="background:none; border:none; color:#888; font-size:20px; cursor:pointer; padding:4px 8px; border-radius:4px;">✕</button>
          </div>
          <textarea id="rText" style="flex:1; background:#1a1a1a; color:#e0e0e0; border:none; padding:16px; font-family:monospace; font-size:13px; resize:none; outline:none;" readonly>${formatRatsitText(rec)}</textarea>
          <div id="rControlBar" style="padding:10px 14px 4px 14px; display:flex; gap:8px; align-items:center; background:#222; border-top:1px solid #333; position: relative;">
            <button id="rEdit" style="${mainButtonStyle}">Edit</button>
            <button id="rCopy" style="${mainButtonStyle}">Copy</button>
            <button id="rSave" style="${mainButtonStyle};background:#1565c0;">Save to cache (SE)</button>
            <div id="rCopyFeedback" style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: #252525; color: #e0e0e0; padding: 4px 10px; border-radius: 6px; font-size: 24px; opacity: 0; pointer-events: none; transition: opacity 0.3s ease-out; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">🍻 Copied!</div>
          </div>
          <div style="padding:4px 14px 10px 14px; display:flex; gap:8px; justify-content:center; align-items:center; background:#222; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
            <button id="rZoomIn" title="Zoom in" style="${smallButtonStyle}">+</button>
            <button id="rZoomOut" title="Zoom out" style="${smallButtonStyle}">-</button>
          </div>
        </div>`;

      (topDoc.body || topDoc.documentElement).appendChild(popup);
      const container = topDoc.getElementById('popupContainer');
      const dragHandle = topDoc.getElementById('rDragHandle');
      const ta = topDoc.getElementById('rText');
      const editBtn = topDoc.getElementById('rEdit');
      const copyBtn = topDoc.getElementById('rCopy');
      const saveBtn = topDoc.getElementById('rSave');
      const closeBtn = topDoc.getElementById('rClose');
      const zoomIn = topDoc.getElementById('rZoomIn');
      const zoomOut = topDoc.getElementById('rZoomOut');

      let isEditing = false, fontSize = 13, isDragging = false, offsetX, offsetY;
      dragHandle.onmousedown = (e) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
        container.style.removeProperty('right');
        container.style.left = `${rect.left}px`; container.style.top = `${rect.top}px`;
        e.preventDefault();
      };
      topDoc.onmousemove = (e) => { if (isDragging) { container.style.left = `${e.clientX - offsetX}px`; container.style.top = `${e.clientY - offsetY}px`; } };
      topDoc.onmouseup = () => { isDragging = false; };
      editBtn.onclick = () => {
        isEditing = !isEditing;
        ta.readOnly = !isEditing;
        ta.style.background = isEditing ? '#353840' : '#1a1a1a';
        editBtn.textContent = isEditing ? 'Done' : 'Edit';
      };
      copyBtn.onclick = () => { GM_setClipboard(ta.value); topDoc.getElementById('rCopyFeedback').style.opacity = '1'; setTimeout(() => { topDoc.getElementById('rCopyFeedback').style.opacity = '0'; }, 1500); };
      saveBtn.onclick = async () => { await setLastPerson(rec); toast(`Saved last to cache (SE · ratsit): ${rec.name}`); };
      closeBtn.onclick = () => popup.remove();
      zoomIn.onclick = () => { fontSize++; ta.style.fontSize = fontSize + 'px'; };
      zoomOut.onclick = () => { fontSize--; ta.style.fontSize = fontSize + 'px'; };

      // Keyboard fallback
      topDoc.addEventListener('keydown', (e)=>{ if (e.altKey && e.key.toLowerCase()==='s'){ e.preventDefault(); saveBtn.click(); } });
    }

    const rec = extractRatsitRecord();
    showRatsitPopup(rec);
  }

  /*** -------- mrkoll.se scraper + black pop-up -------- ***/
  else if (host.includes('mrkoll.se')) {
    const COLOR_POPUP_BG = '#1a1a1a';
    const COLOR_CONTROL_BAR = '#252525';
    const COLOR_FOOTER_BAR = '#222';
    const COLOR_DIVIDER = '#333';
    const COLOR_TEXT_DEFAULT = '#e0e0e0';
    const COLOR_EDIT_BG = '#353840';

    function cleanSE(str){ return fixSpecialChars(String(str||'')).trim(); }
    function fixCitySE(str){ return String(str||'').replace(/Göteborg/gi, 'Gothenburg'); }
    function fixPhoneSE(raw){
      const d = String(raw||'').replace(/\D/g,'').replace(/^46/,'').replace(/^0/,'');
      if (!d || d.length < 6) return '';
      if (d.length <= 7) return `(0)${d.slice(0,1)} ${d.slice(1)}`;
      return `(0)${d.slice(0,2)} ${d.slice(2)}`;
    }
    function fixDateSE(txt){
      const mon = { januari:'01', februari:'02', mars:'03', april:'04', maj:'05', juni:'06',
                    juli:'07', augusti:'08', september:'09', oktober:'10', november:'11', december:'12' };
      const m = String(txt||'').toLowerCase().match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/);
      if (!m) return '';
      return `${String(m[1]).padStart(2,'0')}/${mon[m[2]]}/${m[3]}`;
    }

    function extractMrkollRecord(){
      const rec = {
        country:'SWE',
        id:'',
        name:'',
        address1:'',
        postcode:'',
        city:'',
        countyRaw:'',
        spouse:'',
        dob:'',
        phones:[],
        positionsBlock:'',
        sources:{ addrPhoneSrc: 'mrkoll.se' },
        displayAddressLines:'',
        updatedAt: todayDDMMYYYY()
      };

      const nameEl = q('h1.infoH1person');
      if (nameEl) rec.name = cleanSE(text(nameEl));

      const addressLines = qa('span.f_line2.pl65');
      if (addressLines.length >= 2) {
        let street = text(addressLines[0]).replace(/\s+lgh\s+\d+/i, '').trim();
        rec.address1 = cleanSE(street);
        let zipCity = text(addressLines[1]).trim();
        let formattedZipCity = zipCity.replace(/^(\d{3})(\d{2})/, '$1 $2');
        const m = formattedZipCity.match(/(\d{3}\s?\d{2})\s+(.+)/);
        if (m){ rec.postcode = m[1]; rec.city = cleanSE(fixCitySE(m[2])); }
        const allLabels = qa('span.f_head1');
        let countyStr = "";
        allLabels.forEach(label => {
          if (label.innerText.includes("Län")) {
            const countyVal = label.nextElementSibling;
            if (countyVal) countyStr = text(countyVal).replace(/\s+län/i, '').trim();
          }
        });
        if (countyStr) rec.countyRaw = cleanSE(countyStr);
      }

      const phoneDiv = q('div.phone_div');
      if (phoneDiv) {
        const phones = new Set();
        qa('a[href^="tel:"]', phoneDiv).forEach(a => {
          const fixed = fixPhoneSE(text(a));
          if (fixed) phones.add(fixed);
        });
        rec.phones = Array.from(phones);
      }

      const maritalHeader = Array.from(qa('span.f_line1.ins_edu')).find(el => el.innerText.includes("gift"));
      if (maritalHeader) {
        const spouseBlock = maritalHeader.nextElementSibling;
        const spouseStrong = spouseBlock ? spouseBlock.querySelector('strong') : null;
        if (spouseStrong) rec.spouse = cleanSE(text(spouseStrong).split(' ')[0]);
      }

      const personInfoDiv = q('div.personInfo.pBlock1');
      if (personInfoDiv) {
        const dobMatch = personInfoDiv.innerText.match(/den\s+(\d{1,2}\s+[a-zåäö]+\s+\d{4})/i);
        if (dobMatch) {
          const dob = fixDateSE(dobMatch[1]);
          if (dob) rec.dob = dob;
        }
      }

      const rolesMap = {
        'ordförande': 'Chairman','verkställande direktör': 'CEO','vd': 'CEO','extern vd': 'CEO',
        'vice vd': 'Deputy CEO','styrelseledamot': 'Board Member','styrelsesuppleant': 'Deputy Board Member',
        'vice ordförande': 'Deputy Chairman'
      };
      const companyData = new Map();
      qa('div.resBlockContentInfo p.f_line5').forEach(p => {
        const strongEl = p.querySelector('strong');
        if (!strongEl) return;
        const companyName = cleanSE(text(strongEl));
        const roleText = p.innerText.toLowerCase();
        const rs = new Set();
        for (const [sv, en] of Object.entries(rolesMap)) { if (roleText.includes(sv)) rs.add(en); }
        if (rs.size > 0) {
          if (!companyData.has(companyName)) companyData.set(companyName, new Set());
          rs.forEach(r => companyData.get(companyName).add(r));
        }
      });
      if (companyData.size > 0) {
        const rolePriority = { 'CEO': 1, 'Chairman': 2, 'Deputy Chairman': 3, 'Board Member': 4, 'Deputy Board Member': 5 };
        const lines=['Other positions:'];
        companyData.forEach((rs, cn) => {
          let rolesArray = Array.from(rs);
          if ((rolesArray.includes('Chairman') || rolesArray.includes('CEO')) && rolesArray.includes('Board Member')) {
            rolesArray = rolesArray.filter(r => r !== 'Board Member');
          }
          rolesArray.sort((a, b) => (rolePriority[a] || 99) - (rolePriority[b] || 99));
          lines.push(`- ${cn}, ${rolesArray.join(', ')}`);
        });
        rec.positionsBlock = lines.join('\n');
      }

      rec.displayAddressLines = makeDisplayAddress(rec.address1, rec.postcode, rec.city);
      rec.id = `SWE:${normKey(rec.name)}:${normKey(rec.postcode||'')}`;
      return rec;
    }

    function formatMrkollText(rec){
      const out=[];
      if (rec.name) { out.push(rec.name); out.push(''); }
      if (rec.address1) out.push(rec.address1);
      if (rec.postcode || rec.city) out.push([rec.postcode, rec.city].filter(Boolean).join(' '));
      if (rec.countyRaw) out.push(`(lan ${rec.countyRaw})`);
      if (rec.phones?.length){ out.push(''); rec.phones.forEach(p=>out.push(p)); }
      if (rec.spouse) { out.push(''); out.push(`Spouse's name: ${rec.spouse}`); }
      if (rec.dob)    { out.push(''); out.push(`Date of birth: ${rec.dob}`); }
      if (rec.positionsBlock){ out.push(''); out.push(rec.positionsBlock); }
      out.push(''); out.push('mrkoll');
      return out.join('\n');
    }

    function showMrkollPopup(rec){
      try { window.top.document.getElementById('mrkollPop')?.remove(); } catch {}
      document.getElementById('mrkollPop')?.remove();

      const topDoc = getTopDoc();
      const popup = topDoc.createElement('div'); popup.id='mrkollPop';
      const buttonStyle = `background:#3a3a3a; color:#e0e0e0; border:1px solid #555; border-radius:4px; cursor:pointer; font-weight:bold;`;
      const smallButtonStyle = `${buttonStyle} padding:4px 8px; font-size:14px;`;
      const mainButtonStyle  = `${buttonStyle} flex:1; padding:6px 12px; font-size:14px;`;
      popup.innerHTML = `
        <div id="popupContainer" style="position:fixed; top:60px; right:20px; width:700px; height:700px; max-width:90vw; background:#1a1a1a; border:2px solid #333; border-radius:12px; z-index:999999; font-family:Arial, sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.6); display:flex; flex-direction:column; overflow:hidden; min-width:400px; min-height:400px;">
          <div id="mDragHandle" style="padding:10px 14px; background:#252525; display:flex; justify-content:flex-end; align-items:center; border-bottom:1px solid #333; cursor:grab;">
            <button id="mClose" style="background:none; border:none; color:#888; font-size:20px; cursor:pointer; padding:4px 8px;">✕</button>
          </div>
          <textarea id="mText" style="flex:1; background:#1a1a1a; color:#e0e0e0; border:none; padding:16px; font-family:monospace; font-size:13px; resize:none; outline:none;" readonly>${formatMrkollText(rec)}</textarea>
          <div id="mControlBar" style="padding:10px 14px 4px 14px; display:flex; gap:8px; background:#222; border-top:1px solid #333; position:relative;">
            <button id="mEdit" style="${mainButtonStyle}">Edit</button>
            <button id="mCopy" style="${mainButtonStyle}">Copy</button>
            <button id="mSave" style="${mainButtonStyle};background:#1565c0;">Save to cache (SE)</button>
            <div id="mCopyFeedback" style="position:absolute; top:-35px; left:50%; transform:translateX(-50%); background:#252525; color:#e0e0e0; padding:4px 10px; border-radius:6px; font-size:20px; opacity:0; pointer-events:none; transition:opacity .3s;">🍻 Copied!</div>
          </div>
          <div style="padding:4px 14px 10px 14px; display:flex; gap:8px; justify-content:center; background:#222; border-bottom-left-radius:12px; border-bottom-right-radius:12px;">
            <button id="mZoomIn" style="${smallButtonStyle}">+</button>
            <button id="mZoomOut" style="${smallButtonStyle}">-</button>
          </div>
        </div>`;

      (topDoc.body || topDoc.documentElement).appendChild(popup);

      const container = topDoc.getElementById('popupContainer');
      const dragHandle = topDoc.getElementById('mDragHandle');
      const ta = topDoc.getElementById('mText');
      const editBtn = topDoc.getElementById('mEdit');
      const copyBtn = topDoc.getElementById('mCopy');
      const saveBtn = topDoc.getElementById('mSave');
      const closeBtn = topDoc.getElementById('mClose');
      const zoomIn = topDoc.getElementById('mZoomIn');
      const zoomOut = topDoc.getElementById('mZoomOut');

      let isEditing=false, fontSize=13, isDragging=false, offsetX,offsetY;
      dragHandle.onmousedown = (e)=>{ isDragging=true; const rect=container.getBoundingClientRect();
        offsetX=e.clientX-rect.left; offsetY=e.clientY-rect.top; container.style.removeProperty('right');
        container.style.left=`${rect.left}px`; container.style.top=`${rect.top}px`; e.preventDefault();
      };
      topDoc.onmousemove = (e)=>{ if (isDragging) { container.style.left=`${e.clientX-offsetX}px`; container.style.top=`${e.clientY-offsetY}px`; } };
      topDoc.onmouseup = ()=>{ isDragging=false; };

      editBtn.onclick = ()=>{ isEditing=!isEditing; ta.readOnly=!isEditing; ta.style.background= isEditing?COLOR_EDIT_BG:COLOR_POPUP_BG; editBtn.textContent=isEditing?'Done':'Edit'; };
      copyBtn.onclick = ()=>{ GM_setClipboard(ta.value); topDoc.getElementById('mCopyFeedback').style.opacity='1'; setTimeout(()=>{ topDoc.getElementById('mCopyFeedback').style.opacity='0'; },1500); };
      saveBtn.onclick = async ()=>{ await setLastPerson(rec); toast(`Saved last to cache (SE · mrkoll): ${rec.name}`); };
      closeBtn.onclick = ()=> popup.remove();
      zoomIn.onclick = ()=>{ fontSize++; ta.style.fontSize=fontSize+'px'; };
      zoomOut.onclick = ()=>{ fontSize--; ta.style.fontSize=fontSize+'px'; };

      topDoc.addEventListener('keydown', (e)=>{ if (e.altKey && e.key.toLowerCase()==='s'){ e.preventDefault(); saveBtn.click(); } });
    }

    const rec = extractMrkollRecord();
    showMrkollPopup(rec);
  }

  /*** -------- gulesider.no scraper -------- ***/
  else if (host.includes('gulesider.no')) {
    function findValueByLabel(labelText){
      const target = String(labelText || '').toLowerCase();
      const ps = qa('p');
      const idx = ps.findIndex(p => text(p).toLowerCase() === target);
      if (idx < 0) return '';
      for (let i = idx + 1; i < ps.length; i++) {
        const v = text(ps[i]);
        if (v && v.toLowerCase() !== target) return v;
      }
      return '';
    }
    function extractName(){
      const h1 = q('h1.font-sans-serif.text-xl.font-medium.leading-7.text-secondary-600') || q('h1');
      return text(h1);
    }
    function sanitizePhone(display){ return String(display || '').replace(/[^\d\s]/g,'').replace(/\s+/g,' ').trim(); }
    function dedupeByDigits(list){ const out=[]; const seen=new Set();
      for (const p of list){ const k=p.replace(/\D/g,''); if (!k || seen.has(k)) continue; seen.add(k); out.push(p); }
      return out;
    }
    function clickShowAllNumbersButton(){
      const btn = q('button[data-guv-click="person_phone_show"]') ||
                  q('button[data-gmc-click="ps_ip_phone_number_button_show_click"]') ||
                  qa('button').find(b => /vis alle nummer/i.test(b.textContent || ''));
      if (!btn) return false;
      btn.click();
      return true;
    }
    async function extractPhones() {
      const out = [];
      const primary = findValueByLabel('Telefonnummer');
      if (primary) out.push(sanitizePhone(primary));
      const clicked = clickShowAllNumbersButton();
      if (clicked) {
        for (let tries = 0; tries < 20; tries++) {
          const ps = qa('p.text-base.text-neutral-black.whitespace-nowrap.font-sans.font-medium');
          if (ps.length) { ps.forEach(p => { const num = sanitizePhone(text(p)); if (num) out.push(num); }); break; }
          await sleep(150);
        }
        const close = qa('button').find(b => /kopier/i.test(b.textContent||'') === false && /×|x/i.test(b.textContent||''));
        if (close) close.click();
      }
      qa('a[href^="tel:"]').forEach(a => { const t = sanitizePhone(text(a)); if (t) out.push(t); });
      return dedupeByDigits(out);
    }
    function extractAddress(){
      const address1 = findValueByLabel('Adresse');
      const city     = findValueByLabel('Poststed');
      const postcode = findValueByLabel('Postnummer');
      return { address1, city, postcode };
    }
    function extractMunicipality(){ const a = q('a[data-guv-click="person_bc_municipality"]'); return titleCaseNO(text(a)); }
    function extractPostalArea(){ const a = q('a[data-guv-click="person_bc_postal-area"]'); return titleCaseNO(text(a)); }

    async function scrapeAndSave(){
      const nameRaw = extractName();
      const phones = await extractPhones();
      const { address1: a1Raw, city: cityRaw, postcode } = extractAddress();
      const municipalityRaw = extractMunicipality() || '';
      const postalAreaRaw   = extractPostalArea() || '';
      if (!nameRaw){ toast('No name found'); return; }

      const record = {
        country:'NOR',
        id: `NOR:${normKey(fixSpecialChars(nameRaw))}:${normKey(postcode || '')}`,
        name: fixSpecialChars(nameRaw),
        address1: fixSpecialChars(a1Raw),
        city: fixSpecialChars(cityRaw),
        postcode,
        municipality: fixSpecialChars(municipalityRaw),
        postalArea: fixSpecialChars(postalAreaRaw),
        phones,
        spouse:'', dob:'',
        positionsBlock:'', notes:'',
        sources: { addrPhoneSrc: 'gulesider.no' },
        displayAddressLines: makeDisplayAddress(fixSpecialChars(a1Raw), postcode, fixSpecialChars(cityRaw)),
        updatedAt: todayDDMMYYYY()
      };
      await setLastPerson(record);
      toast(`Saved last to cache (NO): ${record.name}`);
    }

    function btnStyle(bg){ return `background:${bg};color:#fff;padding:8px 12px;border:none;border-radius:6px;cursor:pointer;font:12px/1.3 system-ui`; }
    function ensureButtons(){
      if (byId('noSaveBtn')) return;
      const wrap = document.createElement('div');
      wrap.style = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;display:flex;flex-direction:column;gap:8px';
      (document.body || document.documentElement).appendChild(wrap);

      const saveBtn = document.createElement('button');
      saveBtn.id = 'noSaveBtn';
      saveBtn.textContent = 'Save to cache (NO)';
      saveBtn.style = btnStyle('#1565c0');
      saveBtn.onclick = async () => { await scrapeAndSave(); };

      const pasteMapBtn = document.createElement('button');
      pasteMapBtn.textContent = 'Paste municipality→legacy county JSON';
      pasteMapBtn.style = btnStyle('#6b7280');
      pasteMapBtn.onclick = async () => {
        const input = prompt('Paste JSON like {"Sør-Odal":"Hedmark","Tvedestrand":"Aust-Agder", ...}');
        if (!input) return;
        try { const obj = JSON.parse(input); await setMap(obj); toast(`Map updated (${Object.keys(obj).length})`); }
        catch { toast('Invalid JSON'); }
      };

      wrap.appendChild(saveBtn);
      wrap.appendChild(pasteMapBtn);
    }
    function boot(){ ensureButtons(); new MutationObserver(() => ensureButtons()).observe(document.documentElement, { childList:true, subtree:true }); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  }

  /*** -------- 1881.no scraper (robust top-doc button) -------- ***/
  else if (host.includes('1881.no')) {
    function extractName(){ const h1 = q('h1') || q('.person-headline h1') || q('.box__head h2'); return text(h1); }
    function sanitizePhone(display){ return String(display || '').replace(/[^\d\s]/g,'').replace(/\s+/g,' ').trim(); }
    function dedupeByDigits(list){
      const out = []; const seen = new Set();
      for (const p of list){ const k=p.replace(/\D/g,''); if (!k || seen.has(k)) continue; seen.add(k); out.push(p); }
      return out;
    }
    function extractPhones(){
      const out = [];
      const primary = q('span.button-call__number'); // usually landline
      if (primary) out.push(sanitizePhone(text(primary)));
      qa('a[href^="tel:"]').forEach(a => { const t = sanitizePhone(text(a)); if (t) out.push(t); });
      return dedupeByDigits(out);
    }
    function extractAddress(){
      const h2 = q('.box__head h2') || q('h2'); const raw = text(h2);
      let address1='', postcode='', city='';
      if (raw){ const parts = raw.split(','); address1 = String(parts[0]||'').trim();
        const m = String(parts[1]||'').trim().match(/^(\d{4})\s+(.+)$/); if (m){ postcode=m[1]; city=m[2]; } }
      return { address1, postcode, city };
    }
    function extractMunicipalityFromURL(){
      try { const segs = location.pathname.split('/').filter(Boolean); const i = segs.indexOf('person'); const slug = (i>=0 && segs[i+1])?segs[i+1]:''; return restoreNO(slug.replace(/-/g,' ')); }
      catch { return ''; }
    }
    function extractPostalAreaFromURL(){
      try { const segs = location.pathname.split('/').filter(Boolean); const i = segs.indexOf('person'); const slug = (i>=0 && segs[i+2])?segs[i+2]:''; return restoreNO(slug.replace(/-/g,' ')); }
      catch { return ''; }
    }

    async function scrapeAndSave(){
      const nameRaw = extractName();
      const phones = extractPhones();
      const { address1: a1Raw, postcode, city: cityRaw } = extractAddress();
      const municipalityRaw = extractMunicipalityFromURL() || '';
      const postalAreaRaw   = extractPostalAreaFromURL() || '';
      if (!nameRaw){ toast('No name found'); return; }

      const record = {
        country:'NOR',
        id: `NOR:${normKey(fixSpecialChars(nameRaw))}:${normKey(postcode || '')}`,
        name: fixSpecialChars(nameRaw),
        address1: fixSpecialChars(a1Raw),
        city: fixSpecialChars(cityRaw),
        postcode,
        municipality: fixSpecialChars(municipalityRaw),
        postalArea: fixSpecialChars(postalAreaRaw),
        phones,
        spouse:'', dob:'',
        positionsBlock:'', notes:'',
        sources: { addrPhoneSrc: '1881.no' },
        displayAddressLines: makeDisplayAddress(fixSpecialChars(a1Raw), postcode, fixSpecialChars(cityRaw)),
        updatedAt: todayDDMMYYYY()
      };
      await setLastPerson(record);
      toast(`Saved last to cache (NO · 1881): ${record.name}`);
    }

    function btnStyle(bg){ return `background:${bg};color:#fff;padding:8px 12px;border:none;border-radius:6px;cursor:pointer;font:12px/1.3 system-ui`; }

    function ensureButtons1881(forceLog=false){
      const topDoc = getTopDoc();
      const topBody = topDoc && (topDoc.body || topDoc.documentElement);
      if (!topBody) { if (forceLog) console.log('[1881 UI] Top doc body not ready; retry...'); setTimeout(()=>ensureButtons1881(forceLog), 250); return; }
      if (byIdTop('noSaveBtn1881')) { if (forceLog) console.log('[1881 UI] Button exists.'); return; }

      const wrap = topDoc.createElement('div');
      wrap.id = 'noButtonsWrap1881';
      wrap.style = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;display:flex;flex-direction:column;gap:8px';
      topBody.appendChild(wrap);

      const saveBtn = topDoc.createElement('button');
      saveBtn.id = 'noSaveBtn1881';
      saveBtn.textContent = 'Save to cache (NO · 1881)';
      saveBtn.style = btnStyle('#1565c0');
      saveBtn.onclick = async () => { await scrapeAndSave(); };
      wrap.appendChild(saveBtn);

      console.log('[1881 UI] Injected Save to cache (NO · 1881) into top doc.');
    }
    function boot1881(){
      ensureButtons1881(true);
      try {
        const topDoc = getTopDoc();
        new MutationObserver(()=>ensureButtons1881()).observe(topDoc.documentElement, { childList:true, subtree:true });
      } catch (e) { console.warn('[1881 UI] Failed to observe top doc:', e); }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot1881); else boot1881();

  }

  /*** -------- admin.mergermarket.com (BE loader + Liquidity) -------- ***/
  else if (host.includes('admin.mergermarket.com')) {
    /** DOM helpers **/
    function setInputValue(id, value){
      const el = byId(id) || q(`[name="${id}"]`); if (!el) return;
      el.value = String(value || '');
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    }
    function setInputByName(name, value){
      const el = q(`[name="${name}"]`); if (!el) return;
      el.value = String(value || '');
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    }
    function selectDropdownByValue(el, value){
      if (!el) return false;
      const ok = Array.from(el.options).some(o => o.value === value);
      if (ok){ el.value = value; el.dispatchEvent(new Event('change',{bubbles:true})); }
      return ok;
    }
    function selectDropdownByExactText(el, targetText){
      if (!el || !targetText) return false;
      const t = String(targetText).trim().toLowerCase();
      const opt = Array.from(el.options).find(o => String(o.textContent).trim().toLowerCase() === t);
      if (opt){ el.value = opt.value; el.dispatchEvent(new Event('change',{bubbles:true})); return true; }
      return false;
    }

    /** NO county (legacy) **/
    async function deriveLegacyCounty_BE(municipality, postcode){
      const userMap = await getMap();
      const base = { ...MUNICIPALITY_TO_LEGACY_DEFAULT, ...userMap };
      const lookup = {};
      for (const [k,v] of Object.entries(base)){ lookup[k]=v; lookup[fixSpecialChars(k)]=v; }
      const m = String(municipality || '').trim();
      if (m && lookup[m]) return lookup[m];
      return legacyCountyFromPostcodePrefix(postcode) || '';
    }

    /** Phones — NO classification **/
    function classifyNO(noDisplay){
      const digitsOnly = String(noDisplay || '').replace(/\D+/g,'');
      const first = digitsOnly.charAt(0);
      return (first === '4' || first === '9') ? 'mobile' : 'phone';
    }
    function sortPhonesLandlineFirst(list){
      const land = [], mob = [];
      for (const p of list) (classifyNO(p) === 'phone' ? land : mob).push(p);
      return [...land, ...mob];
    }

    /*** Address fill (NO) — WITH per-phone source label fix ***/
    async function fillAddressFromRecordNO(rec){
      if (!rec) return;
      const countrySel = byId('addr_countrycode'); if (countrySel) selectDropdownByValue(countrySel, 'NOR');

      const hasAddress = !!(rec.address1 && rec.postcode && rec.city);
      if (hasAddress){
        setInputValue('addr_address1', rec.address1);
        setInputValue('addr_zip',     rec.postcode);
        setInputValue('addr_city',    rec.city);
      }

      const legacyCounty = await deriveLegacyCounty_BE(rec.municipality, rec.postcode);
      const stateSel = byId('addr_state');
      if (stateSel && legacyCounty){
        let tries = 0;
        const t = setInterval(() => {
          tries++;
          const ok = selectDropdownByExactText(stateSel, legacyCounty);
          if (ok || tries > 20) clearInterval(t);
        }, 120);
      }

      const addrTypeSel = byId('addr_typecode'); if (addrTypeSel) selectDropdownByValue(addrTypeSel, 'home');

      const addrPrincipal = byId('addr_principalflag');
      if (addrPrincipal){ addrPrincipal.checked = true; addrPrincipal.dispatchEvent(new Event('change',{bubbles:true})); }

      const srcEl = byId('addr_sourcetext') || q('input[name="addr_sourcetext"]');
      if (srcEl){
        const today = todayDDMMYYYY();
        const srcSite = (rec.sources && rec.sources.addrPhoneSrc) || '';
        let srcLabel = 'proff.no';
        if (/gulesider\.no/i.test(srcSite)) srcLabel = 'proff.no, gulesider';
        else if (/1881\.no/i.test(srcSite)) srcLabel = 'proff.no, 1881.no';
        srcEl.value = `${srcLabel} as at ${today}.`;
        srcEl.dispatchEvent(new Event('input',{bubbles:true}));
        srcEl.dispatchEvent(new Event('change',{bubbles:true}));
      }

      // Phones — landlines first, principal = first landline; PER-PHONE source label
      const classifyNO = (noDisplay) => {
        const d = String(noDisplay || '').replace(/\D+/g,''); const f=d.charAt(0);
        return (f==='4' || f==='9') ? 'mobile' : 'phone';
      };
      const raw = (rec.phones || []).filter(Boolean);
      const ordered = sortPhonesLandlineFirst(raw);
      const site = (rec.sources && rec.sources.addrPhoneSrc) || '';
      let phoneSrcLabel = '';
      if (/gulesider\.no/i.test(site)) phoneSrcLabel = 'gulesider';
      else if (/1881\.no/i.test(site)) phoneSrcLabel = '1881.no';
      else phoneSrcLabel = site.replace(/^https?:\/\//,'').replace(/\/.*/,'') || 'as at';

      const today = todayDDMMYYYY();

      for (let i = 0; i < ordered.length; i++) {
        const idcSel   = byId('tel_idccode');
        const numInput = byId('tel_number');
        const numType  = byId('tel_numbertypecode');
        const typeCode = byId('tel_typecode');
        const principal= byId('tel_principleflag');
        const srcInput = byId('tel_sourcetext');
        const addBtn   = byId('btnTelDetailsAdd');
        if (!idcSel || !numInput || !numType || !typeCode || !addBtn) break;

        selectDropdownByValue(idcSel, 'NOR');
        numInput.value = String(ordered[i]).trim();
        numInput.dispatchEvent(new Event('input',{bubbles:true}));
        numInput.dispatchEvent(new Event('change',{bubbles:true}));

        const kind = classifyNO(ordered[i]);
        selectDropdownByValue(numType, kind);
        selectDropdownByValue(typeCode, kind==='mobile'?'work':'home');

        if (principal) { principal.checked = (i===0 && kind==='phone'); principal.dispatchEvent(new Event('change',{bubbles:true})); }

        if (srcInput){
          srcInput.value = `${phoneSrcLabel} as at ${today}.`;
          srcInput.dispatchEvent(new Event('input',{bubbles:true}));
          srcInput.dispatchEvent(new Event('change',{bubbles:true}));
        }

        addBtn.click();
        await sleep(250);
      }

      if (rec.spouse) setInputValue('detail_maritalstatusdetails', `Spouse's name: ${rec.spouse}`);
      if (rec.dob) setInputValue('detail_dtsbirth', rec.dob);

      const notesEl = byId('detail_notes');
      if (notesEl && rec.positionsBlock && !String(notesEl.value || '').trim()) {
        notesEl.value = String(rec.positionsBlock || '').trim();
        notesEl.dispatchEvent(new Event('input',{bubbles:true}));
        notesEl.dispatchEvent(new Event('change',{bubbles:true}));
      }

      toast('✅ Address + ordered phones (NO) filled from last cached record.');
    }

    /*** Address fill (SE) — WITH county fix + phone source label fix ***/
    async function fillAddressFromRecordSE(rec){
      if (!rec) return;
      const countrySel = byId('addr_countrycode'); if (countrySel) selectDropdownByValue(countrySel, 'SWE');

      const hasAddress = !!(rec.address1 && rec.postcode && rec.city);
      if (hasAddress){
        setInputValue('addr_address1', rec.address1);
        setInputValue('addr_zip',     rec.postcode);
        setInputValue('addr_city',    rec.city);
      }

      const stateSel = byId('addr_state');
      if (stateSel && rec.countyRaw){
        // Robust län selection
        const SE_COUNTY_MAP = {
          'varmland': 'Värmlands län','vastra gotaland':'Västra Götalands län','stockholm':'Stockholms län','skane':'Skåne län',
          'uppsala':'Uppsala län','orebro':'Örebro län','ostergotland':'Östergötlands län','sodermanland':'Södermanlands län',
          'gavleborg':'Gävleborgs län','jonkoping':'Jönköpings län','halland':'Hallands län','hallands':'Hallands län',
          'dalarnas':'Dalarnas län','dalarna':'Dalarnas län','vasternorrland':'Västernorrlands län','vastmanland':'Västmanlands län',
          'vasterbotten':'Västerbottens län','norrbotten':'Norrbottens län','kronoberg':'Kronobergs län','kalmar':'Kalmar län',
          'gotland':'Gotlands län','jammland':'Jämtlands län','jamtland':'Jämtlands län','blekinge':'Blekinge län'
        };
        const countyKey = fixSpecialChars(String(rec.countyRaw || '').toLowerCase()).replace(/\slan\b/g,'').replace(/\blan\b/g,'').trim();
        const mappedText = SE_COUNTY_MAP[countyKey] || rec.countyRaw || rec.city;

        function norm(s){ return fixSpecialChars(String(s||'').toLowerCase()).replace(/\s+/g,' ').trim(); }
        const targetNorm = norm(mappedText);

        let tries = 0;
        const timer = setInterval(() => {
          tries++;
          const opts = Array.from(stateSel.options || []);
          // Strategy 1: exact text
          let opt = opts.find(o => norm(o.textContent) === targetNorm);
          // Strategy 2: contains match
          if (!opt) opt = opts.find(o => norm(o.textContent).includes(targetNorm));
          // Strategy 3: token includes (e.g., matching "gavleborg")
          if (!opt && countyKey) opt = opts.find(o => norm(o.textContent).includes(countyKey));

          if (opt){
            stateSel.value = opt.value;
            stateSel.dispatchEvent(new Event('change',{bubbles:true}));
            clearInterval(timer);
          } else if (tries > 30){
            clearInterval(timer);
          }
        }, 200);
      }

      const addrTypeSel = byId('addr_typecode'); if (addrTypeSel) selectDropdownByValue(addrTypeSel, 'home');
      const principalChk = byId('addr_principalflag'); if (principalChk){ principalChk.checked = true; principalChk.dispatchEvent(new Event('change',{bubbles:true})); }

      const srcEl = byId('addr_sourcetext') || q('input[name="addr_sourcetext"]');
      if (srcEl){
        const today = todayDDMMYYYY();
        const srcSite = (rec.sources && rec.sources.addrPhoneSrc) || 'ratsit';
        let srcLabel = srcSite.replace(/^https?:\/\//,'').replace(/\/.*/,'').replace(/\.se$/,'');
        srcEl.value = `${srcLabel} as at ${today}.`;
        srcEl.dispatchEvent(new Event('input',{bubbles:true}));
        srcEl.dispatchEvent(new Event('change',{bubbles:true}));
      }

      // Phones (SE): principal = first landline if any; PER-PHONE source label
      const classifySE = (numberRaw) => { const clean = String(numberRaw || '').replace(/\s+/g,''); const m=clean.match(/^\(0\)(\d)/); return m && m[1]==='7' ? 'mobile':'phone'; };
      const raw = (rec.phones || []).filter(Boolean);
      let principalIdx = 0; for (let i = 0; i < raw.length; i++) { if (classifySE(raw[i]) === 'phone') { principalIdx = i; break; } }

      const site = (rec.sources && rec.sources.addrPhoneSrc) || 'ratsit';
      let phoneSrcLabel = site.replace(/^https?:\/\//,'').replace(/\/.*/,'').replace(/\.se$/,'');
      if (/ratsit/i.test(phoneSrcLabel)) phoneSrcLabel = 'ratsit';
      else if (/mrkoll/i.test(phoneSrcLabel)) phoneSrcLabel = 'mrkoll';
      const today = todayDDMMYYYY();

      for (let i = 0; i < raw.length; i++) {
        const idcSel   = byId('tel_idccode');
        const numInput = byId('tel_number');
        const numType  = byId('tel_numbertypecode');
        const typeCode = byId('tel_typecode');
        const principal= byId('tel_principleflag');
        const srcInput = byId('tel_sourcetext');
        const addBtn   = byId('btnTelDetailsAdd');
        if (!idcSel || !numInput || !numType || !typeCode || !addBtn) break;

        selectDropdownByValue(idcSel, 'SWE');
        numInput.value = String(raw[i]).trim();
        numInput.dispatchEvent(new Event('input',{bubbles:true}));
        numInput.dispatchEvent(new Event('change',{bubbles:true}));

        const kind = classifySE(raw[i]);
        selectDropdownByValue(numType, kind);
        selectDropdownByValue(typeCode, 'home');
        if (principal) { principal.checked = (i===principalIdx); principal.dispatchEvent(new Event('change',{bubbles:true})); }

        if (srcInput){
          srcInput.value = `${phoneSrcLabel} as at ${today}.`;
          srcInput.dispatchEvent(new Event('input',{bubbles:true}));
          srcInput.dispatchEvent(new Event('change',{bubbles:true}));
        }

        addBtn.click();
        await sleep(250);
      }

      // Spouse & marital status
      if (rec.spouse) {
        setInputValue('detail_maritalstatusdetails', `Spouse's name: ${rec.spouse}`);
        const ms = byId('detail_maritalstatuscode'); if (ms) selectDropdownByValue(ms, 'married');
      }
      // DOB
      if (rec.dob) setInputValue('detail_dtsbirth', rec.dob);
      // Positions block (append only if notes are empty — biography not set)
      const notesEl = byId('detail_notes');
      if (notesEl && rec.positionsBlock && !String(notesEl.value || '').trim()) {
        const existing = String(notesEl.value || '').trim();
        const prefix = existing && !/\n$/.test(existing) ? '\n' : '';
        notesEl.value = existing + prefix + rec.positionsBlock;
        notesEl.dispatchEvent(new Event('input',{bubbles:true}));
        notesEl.dispatchEvent(new Event('change',{bubbles:true}));
      }

      toast('✅ Address, phones, spouse & DOB (SE) filled from last cached record.');
    }

    /*** Liquidity parser (unchanged behavior you liked) ***/
    function fixSC(s){ return fixSpecialChars(s); }
    const EVENT_TYPE_MAP = {
      'pot stake sale':'potstakesale','potential stake sale':'potstakesale',
      'stake sale':'stakesale','pot ipo':'potipo','potential ipo':'potipo','ipo':'ipo',
      'potential extr dividends':'potextrdividends','pot extr dividends':'potextrdividends',
      'extra dividends':'extrdividends','extr dividends':'extrdividends',
      'potsmc':'potsmc','pot smc':'potsmc','smc':'smc',
      'pot earn out':'potearndeffered','potential earn out':'potearndeffered',
      'earn out':'earndeffered','deferred payment':'earndeffered',
      'pot exercise of warrants':'potexwarrants','pot ex warrants':'potexwarrants',
      'exercise of warrants':'exwarrants','ex warrants':'exwarrants',
      'pot exercise sale':'potexsale','pot exercise/sale':'potexsale',
      'exercise sale':'exsale','exercise/sale':'exsale',
      'other':'other','bonus':'bonus',
      'long term holdings':'longtermhold','long-term holdings':'longtermhold',
      'capital raises':'capraises','settlement payout':'settlementpayout','settlement/payout':'settlementpayout',
      'salary':'salary'
    };
    const CURRENCY_ALLOWED = new Set(['EUR','GBP','USD','AUD','CNY','HKD','INR','JPY','CHF']);

    function parseInstructions(raw){
      const s = fixSC(String(raw||''));
      const lower = s.toLowerCase();

      let typeCode = '';
      for (const [phrase, code] of Object.entries(EVENT_TYPE_MAP)) {
        if (lower.includes(phrase)) { typeCode = code; break; }
      }

      let stakePercent = null;
      { const m = lower.match(/stake\s*[:=]?\s*([\d.,]+)\s*%?/); if (m){ const num=parseFloat(m[1].replace(/,/g,'')); if (!isNaN(num)) stakePercent=num; } }

      let currencyCode = '';
      let amount = null;
      let unit = 'm';
      {
        let m = s.match(/value\s+([A-Z]{3})\s+([\d.,]+)\s*(bn|billion|billions|m|mn|million|millions)?/i);
        if (!m) m = s.match(/\b([A-Z]{3})\s+([\d.,]+)\s*(bn|billion|billions|m|mn|million|millions)\b/i);
        if (!m) {
          const m2 = s.match(/value\s+([\d.,]+)\s*(bn|billion|billions|m|mn|million|millions)\s+([A-Z]{3})/i);
          if (m2) m = [m2[0], m2[3], m2[1], m2[2]];
        }
        if (m){
          const cur = m[1].toUpperCase(); if (CURRENCY_ALLOWED.has(cur)) currencyCode = cur;
          amount = parseFloat(String(m[2]).replace(/,/g,'')); const u=(m[3]||'m').toLowerCase();
          unit = /bn|billion/.test(u) ? 'bn' : 'm';
        }
      }
      if (!currencyCode){ for (const cur of CURRENCY_ALLOWED) { if (s.includes(cur)) { currencyCode = cur; break; } } }

      let stakeSource = ''; { const m=s.match(/stake\s*source\s*:\s*([^\n]+)/i); if (m) stakeSource = m[1].trim(); }
      let liqSource = '';   { const m=s.match(/liq(?:uidity)?\s*event\s*source\s*:\s*([^\n]+)/i); if (m) liqSource = m[1].trim(); }

      let liqNote = ''; { const m=s.match(/liq(?:uidity)?\s*event\s*note\s*:\s*([\s\S]*?)(?:\n\s*(?:liq(?:uidity)?\s*event\s*source|stake\s*source)\s*:|$)/i); if (m) liqNote = m[1].trim(); }

      let valueMillions = null;
      if (typeof amount === 'number' && !isNaN(amount)) valueMillions = (unit === 'bn') ? amount * 1000 : amount;

      return { typeCode, stakePercent, currencyCode, valueMillions, stakeSource, liqSource, liqNote };
    }

    function truncateUpTo4DecimalsNoRound(num){ if (typeof num!=='number'||!isFinite(num)) return ''; return String(Math.floor(num*10000)/10000); }
    function getAppointmentDate(){ const el=q('[name="ind_dateappointment"]'); const val=el?String(el.value||'').trim():''; return /^\d{2}\/\d{2}\/\d{4}$/.test(val)?val:''; }
    function splitSentences(note){ const parts=(note||'').match(/[^.?!]+[.?!]?/g)||[]; return parts.map(s=>s.trim()).filter(Boolean); }
    function collectShareSentences(note){
      const normalized = fixSC(note || '');
      const sentences = splitSentences(normalized);
      const shareSentences = sentences.filter(s => /^(shares held|stake held)/i.test(s.replace(/^[\s"']+|[\s"']+$/g,'')));
      return shareSentences.join(' ');
    }

    function applyLiquidity(parsed){
      const { typeCode, stakePercent, currencyCode, valueMillions, stakeSource, liqSource, liqNote } = parsed || {};
      const appt = getAppointmentDate();
      if (!appt) toast('⚠️ Appointment date missing or invalid (dd/mm/yyyy). Fill it first.');

      const typeSel = byId('newwealth_typecode'); if (typeSel && typeCode){ selectDropdownByValue(typeSel, typeCode); }

      if (typeof stakePercent === 'number' && !isNaN(stakePercent)) {
        setInputByName('share_stake', String(stakePercent));
        setInputByName('share_percentshares', String(stakePercent));
      }

      const finalStakeSource = fixSC((stakeSource || 'proff.no').trim());
      setInputByName('share_sourcetext', appt ? `${finalStakeSource} as at ${appt}.` : finalStakeSource);

      const currSel = byId('newwealth_currencycode'); if (currSel && currencyCode) {
        selectDropdownByValue(currSel, currencyCode);
      }

      if (typeof stakePercent === 'number' && typeof valueMillions === 'number') {
        setInputValue('newwealth_value', truncateUpTo4DecimalsNoRound((stakePercent / 100) * valueMillions));
      }

      if (liqSource) setInputByName('newwealth_sourcetext', appt ? `${fixSC(liqSource)} as at ${appt}.` : fixSC(liqSource));

      if (liqNote) { const noteEl = byId('newwealth_notes'); if (noteEl) { noteEl.value = fixSC(liqNote.trim()); noteEl.dispatchEvent(new Event('input',{bubbles:true})); noteEl.dispatchEvent(new Event('change',{bubbles:true})); } }
      const shareReplicate = collectShareSentences(liqNote || ''); if (shareReplicate) setInputByName('share_sharenotes', fixSC(shareReplicate));

      const displayChk = byId('newwealth_notes_displayflag'); if (displayChk) { displayChk.checked = true; displayChk.dispatchEvent(new Event('change',{bubbles:true})); }

      const lastUpdateEl = byId('detail_dtsLastUpdate') || q('input[name="detail_dtsLastUpdate"]');
      const allocatedEl  = q('input[name="share_dtsallocated"]');
      if (appt) {
        if (lastUpdateEl){ lastUpdateEl.value = appt; lastUpdateEl.dispatchEvent(new Event('input',{bubbles:true})); lastUpdateEl.dispatchEvent(new Event('change',{bubbles:true})); }
        if (allocatedEl){ allocatedEl.value = appt; allocatedEl.dispatchEvent(new Event('input',{bubbles:true})); allocatedEl.dispatchEvent(new Event('change',{bubbles:true})); }
      }

      toast('✅ Liquidity event filled; notes intact; share sentences replicated; sources dated.');
    }

    /*** Loader button & Liquidity panel — inject into top document ***/
    function ensureBEButtons(){
      const topDoc = getTopDoc();
      const topBody = topDoc && (topDoc.body || topDoc.documentElement);
      if (!topBody) { setTimeout(ensureBEButtons, 250); return; }
      if (byIdTop('loadNoCacheBtn')) return;

      const wrap = topDoc.createElement('div');
      wrap.id = 'beButtonsWrap';
      wrap.style = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;display:flex;gap:8px;align-items:flex-start';
      topBody.appendChild(wrap);

      const loadBtn = topDoc.createElement('button');
      loadBtn.id = 'loadNoCacheBtn';
      loadBtn.textContent = 'Load last (NO/SE) & Fill address';
      loadBtn.style = 'background:#1565c0;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer';
      loadBtn.onclick = async () => {
        const rec = await loadLast();
        if (!rec || !rec.name){ toast('Cache empty — save from ratsit/mrkoll or gulesider/1881 first.'); return; }
        if (String(rec.country||'').toUpperCase() === 'SWE') await fillAddressFromRecordSE(rec);
        else await fillAddressFromRecordNO(rec);
      };

      const liqBox = topDoc.createElement('div');
      liqBox.style = 'display:flex;flex-direction:column;gap:6px;background:#1f2937;color:#e5e7eb;padding:10px 12px;border-radius:6px;max-width:420px';
      const liqLabel = topDoc.createElement('div'); liqLabel.textContent='Liquidity instructions:'; liqLabel.style='font-weight:600';
      const liqText = topDoc.createElement('textarea');
      liqText.id = 'wmLiqInstructions';
      liqText.placeholder = 'e.g.\nstake sale, stake 0.7777, value USD 99m\n\nstake source: ratsit\n\nliq event note: Based on the implied equity value... Stake held... Shares held...\n\nliq event source: ABS Holco annual report';
      liqText.style = 'width:420px;height:140px;background:#111;color:#eee;border:1px solid #374151;border-radius:4px;padding:8px;font:12px/1.4 system-ui';
      const liqApply = topDoc.createElement('button');
      liqApply.textContent = 'Apply Liquidity';
      liqApply.style = 'background:#6a1b9a;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;align-self:flex-start';
      liqApply.onclick = () => { const raw = byIdTop('wmLiqInstructions')?.value || ''; const parsed = parseInstructions(raw); applyLiquidity(parsed); };

      liqBox.appendChild(liqLabel);
      liqBox.appendChild(liqText);
      liqBox.appendChild(liqApply);

      wrap.appendChild(loadBtn);
      wrap.appendChild(liqBox);

      try {
        new MutationObserver(()=>ensureBEButtons()).observe(topDoc.documentElement, { childList:true, subtree:true });
      } catch (e) { console.warn('[BE UI] Observer failed:', e); }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureBEButtons); else ensureBEButtons();
  }
})();

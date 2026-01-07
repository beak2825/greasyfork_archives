// ==UserScript==
// @name         WM Norway + Sweden — gulesider + 1881 + ratsit + mrkoll + BE loader
// @namespace    qc-automation
// @version      2.0.22
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
// @downloadURL https://update.greasyfork.org/scripts/561657/WM%20Norway%20%2B%20Sweden%20%E2%80%94%20gulesider%20%2B%201881%20%2B%20ratsit%20%2B%20mrkoll%20%2B%20BE%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/561657/WM%20Norway%20%2B%20Sweden%20%E2%80%94%20gulesider%20%2B%201881%20%2B%20ratsit%20%2B%20mrkoll%20%2B%20BE%20loader.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /* ========= Shared ========= */
  const CACHE_NS='wm-person-cache-no', MAP_NS='wm-no-muni-county-map', host=location.host;
  const byId=(id)=>document.getElementById(id), q=(sel,root=document)=>root.querySelector(sel),
        qa=(sel,root=document)=>Array.from(root.querySelectorAll(sel)),
        text=(el)=>(el&&el.textContent||'').trim(), sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  const getTopDoc=()=>{ try{return window.top.document;}catch{return document;} }, byIdTop=(id)=>{ try{return getTopDoc().getElementById(id);}catch{return null;} };

  const todayDDMMYYYY=()=>{ const d=new Date(); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`; };
  const toast=(m)=>{ const el=document.createElement('div'); el.textContent=m; el.style='position:fixed;right:20px;bottom:20px;background:#111;color:#fff;padding:8px 12px;border:none;border-radius:6px;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.35);font:12px/1.3 system-ui'; (document.body||document.documentElement).appendChild(el); setTimeout(()=>el.remove(),5500); };

  const fixSpecialChars=(s)=>String(s||'')
    .replace(/æ/g,'ae').replace(/Æ/g,'AE').replace(/ø/g,'o').replace(/Ø/g,'O').replace(/å/g,'a').replace(/Å/g,'A')
    .replace(/ä/g,'a').replace(/Ä/g,'A').replace(/ö/g,'o').replace(/Ö/g,'O').replace(/é/g,'e').replace(/É/g,'E');
  const normKey=(s)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const makeDisplayAddress=(a1,zip,city)=>[String(a1||'').trim(),[String(zip||'').trim(),String(city||'').trim()].filter(Boolean).join(' ')].filter(Boolean).join('\n');

  async function loadLast(){
    const raw=await GM_getValue(CACHE_NS,'{}'); let parsed;
    try{parsed=JSON.parse(raw||'{}');}catch{parsed={};}
    if(parsed&&typeof parsed==='object'&&parsed.id&&parsed.updatedAt) return parsed;
    const vals=Object.values(parsed||{}).filter(v=>v&&typeof v==='object'&&v.updatedAt);
    if(vals.length){ const latest=vals.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''))[0]; await GM_setValue(CACHE_NS,JSON.stringify(latest)); return latest; }
    return null;
  }
  async function saveLast(rec){ await GM_setValue(CACHE_NS, JSON.stringify(rec||{})); }
  async function setLastPerson(patch){ const current=await loadLast(); const merged={...(current||{}),...patch,updatedAt:todayDDMMYYYY()}; await saveLast(merged); }

  /* ========= NO legacy county helpers ========= */
  const MUNICIPALITY_TO_LEGACY_DEFAULT={
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
  async function getMap(){ const raw=await GM_getValue(MAP_NS,'null'); try{ return JSON.parse(raw||'null')||{}; }catch{ return {}; } }
  function legacyCountyFromPostcodePrefix(postcode){
    const pfx=parseInt(String(postcode||'').slice(0,2),10); if(isNaN(pfx)) return '';
    if(pfx<=12) return 'Oslo'; if(pfx<=14) return 'Akershus'; if(pfx<=18) return 'Ostfold'; if(pfx<=21) return 'Akershus';
    if(pfx<=25) return 'Hedmark'; if(pfx<=29) return 'Oppland'; if(pfx===30) return 'Buskerud';
    if(pfx<=32) return 'Vestfold'; if(pfx<=36) return 'Buskerud'; if(pfx<=39) return 'Telemark';
    if(pfx<=44) return 'Rogaland'; if(pfx<=47) return 'Vest-Agder'; if(pfx<=49) return 'Aust-Agder';
    if([50,51,52,53,54,56,58].includes(pfx)) return 'Hordaland'; if([57,59,67,68,69].includes(pfx)) return 'Sogn og Fjordane';
    if(pfx<=66) return 'More og Romsdal'; if(pfx<=75) return 'Sor-Trondelag'; if(pfx<=79) return 'Nord-Trondelag';
    if(pfx<=89) return 'Nordland'; if(pfx<=94) return 'Troms'; if(pfx<=99) return 'Finnmark'; return '';
  }
  async function deriveLegacyCounty(municipality, postcode){
    const userMap=await getMap(); const base={...MUNICIPALITY_TO_LEGACY_DEFAULT,...userMap}, lookup={};
    for(const [k,v] of Object.entries(base)){ lookup[k]=v; lookup[fixSpecialChars(k)]=v; }
    const m=String(municipality||'').trim(); if(m&&lookup[m]) return lookup[m]; return legacyCountyFromPostcodePrefix(postcode)||'';
  }

  /* ========= ratsit.se ========= */
  if (host.includes('ratsit.se')) {
    const COLOR_POPUP_BG='#1a1a1a', COLOR_EDIT_BG='#353840';
    const cleanSE=(s)=>fixSpecialChars(String(s||'')).replace(/\s+/g,' ').trim();
    const fixCitySE=(s)=>String(s||'').replace(/Göteborg/gi,'Gothenburg');
    const fixPhoneSE=(raw)=>{ const d=String(raw||'').replace(/\D/g,'').replace(/^46/,'').replace(/^0/,''); if(!d||d.length<6) return ''; return `(0)${d.slice(0,2)} ${d.slice(2)}`; };
    const fixDateSE=(txt)=>{ const mon={januari:'01',februari:'02',mars:'03',april:'04',maj:'05',juni:'06',juli:'07',augusti:'08',september:'09',oktober:'10',november:'11',december:'12'}; const m=String(txt||'').toLowerCase().match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/); return m?`${String(m[1]).padStart(2,'0')}/${mon[m[2]]}/${m[3]}`:''; };
    const capitalize=(s)=>!s?s:(s[0].toUpperCase()+s.slice(1));

    function extractRatsitRecord(){
      const rec={ country:'SWE', id:'', name:'', address1:'', postcode:'', city:'', countyRaw:'',
        spouse:'', dob:'', phones:[], positionsBlock:'', sources:{addrPhoneSrc:'ratsit.se'}, displayAddressLines:'', updatedAt:todayDDMMYYYY() };
      const name=text(q('h1')); if(name) rec.name=cleanSE(name);
      let street='', postal='';
      const divs=qa('div');
      for(let i=0;i<divs.length-1;i++){
        const a=text(divs[i]), b=text(divs[i+1]);
        if(/^[A-Za-zÅÄÖåäöéÉ\s\-\.]+\s+\d/.test(a) && /^\d{3}\s?\d{2}\s+[A-Za-zÅÄÖåäöéÉ]/.test(b)){
          street=capitalize(cleanSE(a.replace(/\s+lgh\s+\d+/i,'')));
          const cleaned=cleanSE(fixCitySE(b)), m=cleaned.match(/(\d{3}\s?\d{2})\s+(.+)/);
          if(m){ postal=m[1]; rec.city=capitalize(m[2].trim()); }
          break;
        }
      }
      const lm=(document.body.innerText||'').match(/Län:\s*([^\n(]+)/i); if(lm) rec.countyRaw=cleanSE(lm[1].trim());
      rec.address1=street; rec.postcode=postal; rec.city=cleanSE(rec.city); rec.displayAddressLines=makeDisplayAddress(rec.address1, rec.postcode, rec.city);

      const nameTxt=rec.name, phones=new Set();
      qa('a[href^="tel:"]').forEach(a=>{
        const parentDiv=a.closest('div');
        if(parentDiv){
          const strong=parentDiv.querySelector('strong');
          if(strong && strong.innerText.trim() && strong.innerText.trim()!==nameTxt) return;
        }
        let p=a;
        for(let i=0;i<5;i++){
          p=p.parentElement; if(!p) break;
          if(p.innerText.includes(nameTxt)){ const fixed=fixPhoneSE(text(a)); if(fixed) phones.add(fixed); break; }
        }
      });
      rec.phones=Array.from(phones);

      const mSp=(document.body.innerText||'').match(/är gift med\s+([^\n]+)/i);
      if(mSp){ const spouseFirst=capitalize(cleanSE(mSp[1].trim().split(' ')[0])); rec.spouse=spouseFirst; }
      qa('p').forEach(p=>{ if(p.innerText.includes('Födelsedag:')){ const d=fixDateSE(p.innerText); if(d) rec.dob=d; } });

      const roles={'Ordförande':'Chairman','Verkställande direktör':'CEO','VD':'CEO','Extern VD':'CEO','Vice VD':'Deputy CEO','Styrelseledamot':'Board Member','Styrelsesuppleant':'Deputy Board Member','Vice ordförande':'Deputy Chairman'};
      const skip=['Verklig Huvudman','Revisor','Innehavare'], comp=new Map();
      qa('table tbody tr').forEach(tr=>{
        const tds=tr.querySelectorAll('td'); if(tds.length<4) return;
        const cname=cleanSE(tds[0].innerText.trim()), status=tds[2].innerText, role=tds[3].innerText;
        if(!/Aktiv/.test(status)) return; if(skip.some(s=>role.includes(s))) return;
        const rs=new Set(); for(const [sv,en] of Object.entries(roles)) if(role.includes(sv)) rs.add(en);
        if(!rs.size) return; if(!comp.has(cname)) comp.set(cname,new Set()); rs.forEach(r=>comp.get(cname).add(r));
      });
      if(comp.size){
        const rolePriority={'CEO':1,'Chairman':2,'Deputy Chairman':3,'Deputy CEO':4,'Deputy Board Member':5,'Board Member':6};
        const lines=['Other positions:']; comp.forEach((rs,cn)=>{ let arr=Array.from(rs);
          if((arr.includes('Chairman')||arr.includes('Deputy Chairman')) && arr.includes('Board Member')) arr=arr.filter(r=>'Board Member'!==r);
          const sorted=arr.sort((a,b)=>(rolePriority[a]||999)-(rolePriority[b]||999));
          lines.push(`- ${cn}, ${sorted.join(', ')}`); });
        rec.positionsBlock=lines.join('\n');
      }
      rec.id=`SWE:${normKey(rec.name)}:${normKey(rec.postcode||'')}`;
      return rec;
    }

    function formatRatsitText(rec){
      const out=[]; if(rec.name){ out.push(rec.name); out.push(''); }
      if(rec.address1) out.push(rec.address1);
      if(rec.postcode||rec.city) out.push([rec.postcode,rec.city].filter(Boolean).join(' '));
      if(rec.countyRaw) out.push(`(lan ${rec.countyRaw})`);
      if(rec.phones?.length){ out.push(''); rec.phones.forEach(p=>out.push(p)); }
      if(rec.spouse){ out.push(''); out.push(`Spouse's name: ${rec.spouse}`); }
      if(rec.dob){ out.push(''); out.push(`Date of birth: ${rec.dob}`); }
      if(rec.positionsBlock){ out.push(''); out.push(rec.positionsBlock); }
      out.push(''); out.push('ratsit'); return out.join('\n');
    }

    function showRatsitPopup(rec){
      try{window.top.document.getElementById('ratsitPop')?.remove();}catch{} document.getElementById('ratsitPop')?.remove();
      const topDoc=getTopDoc(), popup=topDoc.createElement('div'); popup.id='ratsitPop';
      const btn=`background:#3a3a3a;color:#e0e0e0;border:1px solid #555;border-radius:4px;cursor:pointer;font-weight:bold;`, small=`${btn} padding:4px 8px;font-size:14px;`, main=`${btn} flex:1;padding:6px 12px;font-size:14px;`;
      popup.innerHTML=`
      <div id="popupContainer" style="position:fixed;top:60px;right:20px;width:700px;height:700px;max-width:90vw;background:#1a1a1a;border:2px solid #333;border-radius:12px;z-index:999999;font-family:Arial,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.6);display:flex;flex-direction:column;overflow:hidden;min-width:400px;min-height:400px;">
        <div id="rDragHandle" style="padding:10px 14px;background:#252525;display:flex;justify-content:flex-end;align-items:center;border-bottom:1px solid #333;cursor:grab;">
          <button id="rClose" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:4px 8px;border-radius:4px;">✕</button>
        </div>
        <textarea id="rText" style="flex:1;background:#1a1a1a;color:#e0e0e0;border:none;padding:16px;font-family:monospace;font-size:13px;resize:none;outline:none;" readonly>${formatRatsitText(rec)}</textarea>
        <div id="rControlBar" style="padding:10px 14px 4px 14px;display:flex;gap:8px;align-items:center;background:#222;border-top:1px solid #333;position:relative;">
          <button id="rEdit" style="${main}">Edit</button>
          <button id="rCopy" style="${main}">Copy</button>
          <button id="rSave" style="${main}">Save</button>
          <div id="rCopyFeedback" style="position:absolute;top:-35px;left:50%;transform:translateX(-50%);background:#252525;color:#e0e0e0;padding:4px 10px;border-radius:6px;font-size:24px;opacity:0;pointer-events:none;transition:opacity .3s;box-shadow:0 2px 5px rgba(0,0,0,.4);">Copied!</div>
        </div>
        <div style="padding:4px 14px 10px 14px;display:flex;gap:8px;justify-content:center;align-items:center;background:#222;border-bottom-left-radius:12px;border-bottom-right-radius:12px;">
          <button id="rZoomIn" title="Zoom in" style="${small}">+</button>
          <button id="rZoomOut" title="Zoom out" style="${small}">-</button>
        </div>
      </div>`;
      (topDoc.body||topDoc.documentElement).appendChild(popup);
      const container=topDoc.getElementById('popupContainer'), drag=topDoc.getElementById('rDragHandle'),
            ta=topDoc.getElementById('rText'), edit=topDoc.getElementById('rEdit'), copy=topDoc.getElementById('rCopy'),
            save=topDoc.getElementById('rSave'), close=topDoc.getElementById('rClose'),
            zoomIn=topDoc.getElementById('rZoomIn'), zoomOut=topDoc.getElementById('rZoomOut');
      let isEditing=false,fontSize=13,isDragging=false,ox,oy;
      drag.onmousedown=(e)=>{ isDragging=true; const r=container.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; container.style.removeProperty('right'); container.style.left=`${r.left}px`; container.style.top=`${r.top}px`; e.preventDefault(); };
      getTopDoc().onmousemove=(e)=>{ if(isDragging){ container.style.left=`${e.clientX-ox}px`; container.style.top=`${e.clientY-oy}px`; } };
      getTopDoc().onmouseup=()=>{ isDragging=false; };
      edit.onclick=()=>{ isEditing=!isEditing; ta.readOnly=!isEditing; ta.style.background=isEditing?COLOR_EDIT_BG:COLOR_POPUP_BG; edit.textContent=isEditing?'Done':'Edit'; };
      copy.onclick=()=>{ GM_setClipboard(ta.value); getTopDoc().getElementById('rCopyFeedback').style.opacity='1'; setTimeout(()=>{ getTopDoc().getElementById('rCopyFeedback').style.opacity='0'; },1500); };
      save.onclick=async()=>{ await setLastPerson(rec); toast(`Saved: ${rec.name}`); };
      close.onclick=()=>popup.remove(); zoomIn.onclick=()=>{ fontSize++; ta.style.fontSize=fontSize+'px'; }; zoomOut.onclick=()=>{ fontSize--; ta.style.fontSize=fontSize+'px'; };
      getTopDoc().addEventListener('keydown',(e)=>{ if(e.altKey && e.key.toLowerCase()==='s'){ e.preventDefault(); save.click(); } });
    }
    function bootRatsit(){ const topDoc=getTopDoc(), topBody=topDoc&&(topDoc.body||topDoc.documentElement); if(!topBody){ setTimeout(bootRatsit,200); return; }
      try{ const rec=extractRatsitRecord(); showRatsitPopup(rec); }catch(e){ setTimeout(()=>{ try{ const rec=extractRatsitRecord(); showRatsitPopup(rec);}catch{} },500); }
      topDoc.addEventListener('keydown',(e)=>{ if(e.altKey && e.key.toLowerCase()==='p'){ e.preventDefault(); const rec=extractRatsitRecord(); showRatsitPopup(rec);} });
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bootRatsit); else bootRatsit();
  }

  /* ========= mrkoll.se ========= */
  else if (host.includes('mrkoll.se')) {
    const COLOR_POPUP_BG='#1a1a1a', COLOR_EDIT_BG='#353840';
    const cleanSE=(s)=>fixSpecialChars(String(s||'')).trim(), fixCitySE=(s)=>String(s||'').replace(/Göteborg/gi,'Gothenburg');
    const fixPhoneSE=(raw)=>{ const d=String(raw||'').replace(/\D/g,'').replace(/^46/,'').replace(/^0/,''); if(!d||d.length<=5) return ''; if(d.length<=7) return `(0)${d.slice(0,1)} ${d.slice(1)}`; return `(0)${d.slice(0,2)} ${d.slice(2)}`; };
    const fixDateSE=(txt)=>{ const mon={januari:'01',februari:'02',mars:'03',april:'04',maj:'05',juni:'06',juli:'07',augusti:'08',september:'09',oktober:'10',november:'11',december:'12'}; const m=String(txt||'').toLowerCase().match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/); return m?`${String(m[1]).padStart(2,'0')}/${mon[m[2]]}/${m[3]}`:''; };

    function extractMrkollRecord(){
      const rec={ country:'SWE', id:'', name:'', address1:'', postcode:'', city:'', countyRaw:'',
        spouse:'', dob:'', phones:[], positionsBlock:'', sources:{addrPhoneSrc:'mrkoll.se'}, displayAddressLines:'', updatedAt:todayDDMMYYYY() };
      const nameEl=q('h1.infoH1person'); if(nameEl) rec.name=cleanSE(text(nameEl));
      const addressLines=qa('span.f_line2.pl65');
      if(addressLines.length>=2){
        let street=text(addressLines[0]).replace(/\s+lgh\s+\d+/i,'').trim(); rec.address1=cleanSE(street);
        let zipCity=text(addressLines[1]).trim().replace(/^(\d{3})(\d{2})/,'$1 $2');
        const m=zipCity.match(/(\d{3}\s?\d{2})\s+(.+)/); if(m){ rec.postcode=m[1]; rec.city=cleanSE(fixCitySE(m[2])); }
        const allLabels=qa('span.f_head1'); let countyStr="";
        allLabels.forEach(label=>{ if(label.innerText.includes("Län")){ const val=label.nextElementSibling; if(val) countyStr=text(val).replace(/\s+län/i,'').trim(); } });
        if(countyStr) rec.countyRaw=cleanSE(countyStr);
      }
      const phoneDiv=q('div.phone_div'); if(phoneDiv){ const phones=new Set(); qa('a[href^="tel:"]', phoneDiv).forEach(a=>{ const fixed=fixPhoneSE(text(a)); if(fixed) phones.add(fixed); }); rec.phones=Array.from(phones); }
      const maritalHeader=Array.from(qa('span.f_line1.ins_edu')).find(el=>el.innerText.includes("gift"));
      if(maritalHeader){ const spouseBlock=maritalHeader.nextElementSibling; const spouseStrong=spouseBlock?spouseBlock.querySelector('strong'):null; if(spouseStrong) rec.spouse=cleanSE(text(spouseStrong).split(' ')[0]); }
      const personInfoDiv=q('div.personInfo.pBlock1'); if(personInfoDiv){ const dobMatch=personInfoDiv.innerText.match(/den\s+(\d{1,2}\s+[a-zåäö]+\s+\d{4})/i); if(dobMatch){ const dob=fixDateSE(dobMatch[1]); if(dob) rec.dob=dob; } }

      const rolesMap={'ordförande':'Chairman','verkställande direktör':'CEO','vd':'CEO','extern vd':'CEO','vice vd':'Deputy CEO','styrelseledamot':'Board Member','styrelsesuppleant':'Deputy Board Member','vice ordförande':'Deputy Chairman'};
      const companyData=new Map();
      qa('div.resBlockContentInfo p.f_line5').forEach(p=>{ const strong=p.querySelector('strong'); if(!strong) return; const companyName=cleanSE(text(strong)); const roleText=p.innerText.toLowerCase();
        const rs=new Set(); for(const [sv,en] of Object.entries(rolesMap)) if(roleText.includes(sv)) rs.add(en);
        if(rs.size>0){ if(!companyData.has(companyName)) companyData.set(companyName,new Set()); rs.forEach(r=>companyData.get(companyName).add(r)); }
      });
      if(companyData.size>0){ const rolePriority={'CEO':1,'Chairman':2,'Deputy Chairman':3,'Board Member':4,'Deputy Board Member':5}; const lines=['Other positions:'];
        companyData.forEach((rs,cn)=>{ let arr=Array.from(rs); if((arr.includes('Chairman')||arr.includes('CEO')) && arr.includes('Board Member')) arr=arr.filter(r=>r!=='Board Member'); arr.sort((a,b)=>(rolePriority[a]||99)-(rolePriority[b]||99)); lines.push(`- ${cn}, ${arr.join(', ')}`); });
        rec.positionsBlock=lines.join('\n');
      }
      rec.displayAddressLines=makeDisplayAddress(rec.address1, rec.postcode, rec.city);
      rec.id=`SWE:${normKey(rec.name)}:${normKey(rec.postcode||'')}`; return rec;
    }

    function formatMrkollText(rec){
      const out=[]; if(rec.name){ out.push(rec.name); out.push(''); }
      if(rec.address1) out.push(rec.address1);
      if(rec.postcode||rec.city) out.push([rec.postcode,rec.city].filter(Boolean).join(' '));
      if(rec.countyRaw) out.push(`(lan ${rec.countyRaw})`);
      if(rec.phones?.length){ out.push(''); rec.phones.forEach(p=>out.push(p)); }
      if(rec.spouse){ out.push(''); out.push(`Spouse's name: ${rec.spouse}`); }
      if(rec.dob){ out.push(''); out.push(`Date of birth: ${rec.dob}`); }
      if(rec.positionsBlock){ out.push(''); out.push(rec.positionsBlock); }
      out.push(''); out.push('mrkoll'); return out.join('\n');
    }

    function showMrkollPopup(rec){
      try{window.top.document.getElementById('mrkollPop')?.remove();}catch{} document.getElementById('mrkollPop')?.remove();
      const topDoc=getTopDoc(), popup=topDoc.createElement('div'); popup.id='mrkollPop';
      const btn=`background:#3a3a3a;color:#e0e0e0;border:1px solid #555;border-radius:4px;cursor:pointer;font-weight:bold;`, small=`${btn} padding:4px 8px;font-size:14px;`, main=`${btn} flex:1;padding:6px 12px;font-size:14px;`;
      popup.innerHTML=`
      <div id="popupContainer" style="position:fixed;top:60px;right:20px;width:700px;height:700px;max-width:90vw;background:#1a1a1a;border:2px solid #333;border-radius:12px;z-index:999999;font-family:Arial,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.6);display:flex;flex-direction:column;overflow:hidden;min-width:400px;min-height:400px;">
        <div id="mDragHandle" style="padding:10px 14px;background:#252525;display:flex;justify-content:flex-end;align-items:center;border-bottom:1px solid #333;cursor:grab;">
          <button id="mClose" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:4px 8px;">✕</button>
        </div>
        <textarea id="mText" style="flex:1;background:#1a1a1a;color:#e0e0e0;border:none;padding:16px;font-family:monospace;font-size:13px;resize:none;outline:none;" readonly>${formatMrkollText(rec)}</textarea>
        <div id="mControlBar" style="padding:10px 14px 4px 14px;display:flex;gap:8px;background:#222;border-top:1px solid #333;position:relative;">
          <button id="mEdit" style="${main}">Edit</button>
          <button id="mCopy" style="${main}">Copy</button>
          <button id="mSave" style="${main}">Save</button>
          <div id="mCopyFeedback" style="position:absolute;top:-35px;left:50%;transform:translateX(-50%);background:#252525;color:#e0e0e0;padding:4px 10px;border-radius:6px;font-size:20px;opacity:0;pointer-events:none;transition:opacity .3s;">Copied!</div>
        </div>
        <div style="padding:4px 14px 10px 14px;display:flex;gap:8px;justify-content:center;background:#222;border-bottom-left-radius:12px;border-bottom-right-radius:12px;">
          <button id="mZoomIn" style="${small}">+</button>
          <button id="mZoomOut" style="${small}">-</button>
        </div>
      </div>`;
      (topDoc.body||topDoc.documentElement).appendChild(popup);
      const container=topDoc.getElementById('popupContainer'), drag=topDoc.getElementById('mDragHandle'),
            ta=topDoc.getElementById('mText'), edit=topDoc.getElementById('mEdit'), copy=topDoc.getElementById('mCopy'),
            save=topDoc.getElementById('mSave'), close=topDoc.getElementById('mClose'),
            zoomIn=topDoc.getElementById('mZoomIn'), zoomOut=topDoc.getElementById('mZoomOut');
      let isEditing=false,fontSize=13,isDragging=false,ox,oy;
      drag.onmousedown=(e)=>{ isDragging=true; const r=container.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; container.style.removeProperty('right'); container.style.left=`${r.left}px`; container.style.top=`${r.top}px`; e.preventDefault(); };
      getTopDoc().onmousemove=(e)=>{ if(isDragging){ container.style.left=`${e.clientX-ox}px`; container.style.top=`${e.clientY-oy}px`; } };
      getTopDoc().onmouseup=()=>{ isDragging=false; };
      edit.onclick=()=>{ isEditing=!isEditing; ta.readOnly=!isEditing; ta.style.background=isEditing?COLOR_EDIT_BG:COLOR_POPUP_BG; edit.textContent=isEditing?'Done':'Edit'; };
      copy.onclick=()=>{ GM_setClipboard(ta.value); getTopDoc().getElementById('mCopyFeedback').style.opacity='1'; setTimeout(()=>{ getTopDoc().getElementById('mCopyFeedback').style.opacity='0'; },1500); };
      save.onclick=async()=>{ const fresh=extractMrkollRecord(); await setLastPerson(fresh); toast(`Save: ${fresh.name}`); };
      close.onclick=()=>popup.remove(); zoomIn.onclick=()=>{ fontSize++; ta.style.fontSize=fontSize+'px'; }; zoomOut.onclick=()=>{ fontSize--; ta.style.fontSize=fontSize+'px'; };
      getTopDoc().addEventListener('keydown',(e)=>{ if(e.altKey && e.key.toLowerCase()==='s'){ e.preventDefault(); save.click(); } });
    }
    function bootMrkoll(){ const topDoc=getTopDoc(), topBody=topDoc&&(topDoc.body||topDoc.documentElement); if(!topBody){ setTimeout(bootMrkoll,200); return; }
      try{ const rec=extractMrkollRecord(); showMrkollPopup(rec);}catch(e){ setTimeout(()=>{ try{ const rec=extractMrkollRecord(); showMrkollPopup(rec); }catch{} },500); }
      topDoc.addEventListener('keydown',(e)=>{ if(e.altKey && e.key.toLowerCase()==='p'){ e.preventDefault(); const rec=extractMrkollRecord(); showMrkollPopup(rec);} });
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bootMrkoll); else bootMrkoll();
  }

  /* ========= gulesider.no ========= */
  else if (host.includes('gulesider.no')) {
    const findValueByLabel=(label)=>{ const target=String(label||'').toLowerCase(), ps=qa('p'); const idx=ps.findIndex(p=>text(p).toLowerCase()===target); if(idx<0) return ''; for(let i=idx+1;i<ps.length;i++){ const v=text(ps[i]); if(v&&v.toLowerCase()!==target) return v; } return ''; };
    const extractName=()=> text(q('h1.font-sans-serif.text-xl.font-medium.leading-7.text-secondary-600')||q('h1'));
    const sanitizePhone=(d)=>String(d||'').replace(/[^\d\s]/g,'').replace(/\s+/g,' ').trim();
    const dedupe=(list)=>{ const out=[], seen=new Set(); for(const p of list){ const k=p.replace(/\D/g,''); if(!k||seen.has(k)) continue; seen.add(k); out.push(p);} return out; };
    const clickShowAllNumbersButton=()=>{ const btn=q('button[data-guv-click="person_phone_show"]')||q('button[data-gmc-click="ps_ip_phone_number_button_show_click"]')||qa('button').find(b=>/vis alle nummer/i.test(b.textContent||'')); if(!btn) return false; btn.click(); return true; };
    async function extractPhones(){
      const out=[], primary=findValueByLabel('Telefonnummer'); if(primary) out.push(sanitizePhone(primary));
      const clicked=clickShowAllNumbersButton(); if(clicked){
        for(let tries=0;tries<20;tries++){
          const ps=qa('p.text-base.text-neutral-black.whitespace-nowrap.font-sans.font-medium');
          if(ps.length){ ps.forEach(p=>{ const num=sanitizePhone(text(p)); if(num) out.push(num); }); break; }
          await sleep(150);
        }
        const close=qa('button').find(b=>/kopier/i.test(b.textContent||'')===false && /×|x/i.test(b.textContent||'')); if(close) close.click();
      }
      qa('a[href^="tel:"]').forEach(a=>{ const t=sanitizePhone(text(a)); if(t) out.push(t); }); return dedupe(out);
    }
    const extractAddress=()=>({ address1:findValueByLabel('Adresse'), city:findValueByLabel('Poststed'), postcode:findValueByLabel('Postnummer') });

    async function scrapeAndSave(){
      const nameRaw=extractName(), phones=await extractPhones(); const {address1:a1Raw, city:cityRaw, postcode}=extractAddress();
      if(!nameRaw){ toast('No name found'); return; }
      const record={ country:'NOR', id:`NOR:${normKey(fixSpecialChars(nameRaw))}:${normKey(postcode||'')}`, name:fixSpecialChars(nameRaw),
        address1:fixSpecialChars(a1Raw), city:fixSpecialChars(cityRaw), postcode, municipality:'', postalArea:'', phones,
        spouse:'', dob:'', positionsBlock:'', notes:'', sources:{addrPhoneSrc:'gulesider.no'},
        displayAddressLines:makeDisplayAddress(fixSpecialChars(a1Raw), postcode, fixSpecialChars(cityRaw)), updatedAt:todayDDMMYYYY() };
      await setLastPerson(record); toast(`Saved: ${record.name}`);
    }

    const btnStyle=(bg)=>`background:${bg};color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;`;
    function ensureButtons(){ if(byId('noSaveBtn')) return;
      const wrap=document.createElement('div'); wrap.style='position:fixed;right:20px;bottom:20px;z-index:2147483647;display:flex;flex-direction:column;gap:8px'; (document.body||document.documentElement).appendChild(wrap);
      const saveBtn=document.createElement('button'); saveBtn.id='noSaveBtn'; saveBtn.textContent='Save'; saveBtn.style=btnStyle('rgb(49 108 174)'); saveBtn.onclick=async()=>{ await scrapeAndSave(); };
      wrap.appendChild(saveBtn);
    }
    function boot(){ ensureButtons(); new MutationObserver(()=>ensureButtons()).observe(document.documentElement,{childList:true,subtree:true}); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  }

  /* ========= 1881.no ========= */
  else if (host.includes('1881.no')) {
    const extractName=()=> text(q('h1')||q('.person-headline h1')||q('.box__head h2'));
    const sanitizePhone=(d)=>String(d||'').replace(/[^\d\s]/g,'').replace(/\s+/g,' ').trim();
    const dedupe=(list)=>{ const out=[], seen=new Set(); for(const p of list){ const k=p.replace(/\D/g,''); if(!k||seen.has(k)) continue; seen.add(k); out.push(p);} return out; };
    function extractPhones(){ const out=[]; const primary=q('span.button-call__number'); if(primary) out.push(sanitizePhone(text(primary))); qa('a[href^="tel:"]').forEach(a=>{ const t=sanitizePhone(text(a)); if(t) out.push(t); }); return dedupe(out); }
    function extractAddress(){ const h2=q('.box__head h2')||q('h2'); const raw=text(h2); let address1='',postcode='',city=''; if(raw){ const parts=raw.split(','); address1=String(parts[0]||'').trim(); const m=String(parts[1]||'').trim().match(/^(\d{4})\s+(.+)$/); if(m){ postcode=m[1]; city=m[2]; } } return { address1, postcode, city }; }

    async function scrapeAndSave(){
      const nameRaw=extractName(), phones=extractPhones(); const { address1:a1Raw, postcode, city:cityRaw }=extractAddress();
      if(!nameRaw){ toast('No name found'); return; }
      const record={ country:'NOR', id:`NOR:${normKey(fixSpecialChars(nameRaw))}:${normKey(postcode||'')}`, name:fixSpecialChars(nameRaw),
        address1:fixSpecialChars(a1Raw), city:fixSpecialChars(cityRaw), postcode, municipality:'', postalArea:'', phones,
        spouse:'', dob:'', positionsBlock:'', notes:'', sources:{addrPhoneSrc:'1881.no'},
        displayAddressLines:makeDisplayAddress(fixSpecialChars(a1Raw), postcode, fixSpecialChars(cityRaw)), updatedAt:todayDDMMYYYY() };
      await setLastPerson(record); toast(`Saved: ${record.name}`);
    }

    const btnStyle=(bg)=>`background:${bg};color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;`;
    function ensureButtons1881(forceLog=false){
      const topDoc=getTopDoc(), topBody=topDoc&&(topDoc.body||topDoc.documentElement);
      if(!topBody){ if(forceLog) console.log('[1881 UI] Top doc body not ready; retry...'); setTimeout(()=>ensureButtons1881(forceLog),250); return; }
      if(byIdTop('noSaveBtn1881')){ if(forceLog) console.log('[1881 UI] Button exists.'); return; }
      const wrap=topDoc.createElement('div'); wrap.id='noButtonsWrap1881'; wrap.style='position:fixed;right:20px;bottom:20px;z-index:2147483647;display:flex;flex-direction:column;gap:8px'; topBody.appendChild(wrap);
      const saveBtn=topDoc.createElement('button'); saveBtn.id='noSaveBtn1881'; saveBtn.textContent='Save'; saveBtn.style=btnStyle('rgb(49 108 174)'); saveBtn.onclick=async()=>{ await scrapeAndSave(); };
      wrap.appendChild(saveBtn);
    }
    function boot1881(){ ensureButtons1881(true); try{ const topDoc=getTopDoc(); new MutationObserver(()=>ensureButtons1881()).observe(topDoc.documentElement,{childList:true,subtree:true}); }catch(e){ console.warn('[1881 UI] Observer failed:', e); } }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot1881); else boot1881();
  }

  /* ========= BE loader + Liquidity (NO observers; build once; toggle visibility) ========= */
  else if (host.includes('admin.mergermarket.com')) {
    const isIndividual=/^\/wealthmonitor\/wmindividual/i.test(location.pathname); if(!isIndividual) return;
    const isIndividualPopup=/\/wealthmonitor\/wmindividualpopup\.asp/i.test(location.pathname); if(isIndividualPopup) return;

    /* DOM helpers */
    const setInputValue=(id,val)=>{ const el=byId(id)||q(`[name="${id}"]`); if(!el) return; el.value=String(val||''); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); };
    const setInputByName=(name,val)=>{ const el=q(`[name="${name}"]`); if(!el) return; el.value=String(val||''); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); };
    const selectDropdownByValue=(el,value)=>{ if(!el) return false; const ok=Array.from(el.options).some(o=>o.value===value); if(ok){ el.value=value; el.dispatchEvent(new Event('change',{bubbles:true})); } return ok; };
    const selectDropdownByExactText=(el,t)=>{ if(!el||!t) return false; const target=String(t).trim().toLowerCase(); const opt=Array.from(el.options).find(o=>String(o.textContent).trim().toLowerCase()===target); if(opt){ el.value=opt.value; el.dispatchEvent(new Event('change',{bubbles:true})); return true; } return false; };

    /* NO helpers */
    const classifyNO=(noDisplay)=>{ const digits=String(noDisplay||'').replace(/\D+/g,''); const first=digits.charAt(0); return (first==='4'||first==='9')?'mobile':'phone'; };
    const sortPhonesLandlineFirst=(list)=>{ const land=[],mob=[]; for(const p of list)(classifyNO(p)==='phone'?land:mob).push(p); return [...land,...mob]; };

    /* Robust setters — stake % and exact worth */
    function setAnyStakePercent(v){
      const candidates=['share_stake','share_percentshares','share_percent','share_percentshare'];
      for(const name of candidates){
        const el=q(`input[name="${name}"]`)||byId(name);
        if(el){ el.value=String(v||''); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }
      }
    }
    function setAnyExactWorthMillions(v){
      const candidates=['newwealth_value','newwealth_exacteventworth','newwealth_eventworth','newwealth_exacteventworthm'];
      for(const name of candidates){
        const el=q(`input[name="${name}"]`)||byId(name);
        if(el){ el.value=String(v||''); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }
      }
    }

    /* Address fill (NO) — gated by hasAddress */
    async function fillAddressFromRecordNO(rec){
      if(!rec) return;
      const hasAddress=!!(rec.address1 && rec.postcode && rec.city);

      if(hasAddress){
        const countrySel=byId('addr_countrycode'); if(countrySel) selectDropdownByValue(countrySel,'NOR');
        setInputValue('addr_address1', rec.address1);
        setInputValue('addr_zip', rec.postcode);
        setInputValue('addr_city', rec.city);

        const legacyCounty=await deriveLegacyCounty(rec.municipality, rec.postcode);
        const stateSel=byId('addr_state');
        if(stateSel && legacyCounty){
          let tries=0; const t=setInterval(()=>{ tries++; const ok=selectDropdownByExactText(stateSel, legacyCounty); if(ok||tries>20) clearInterval(t); }, 120);
        }

        const addrTypeSel=byId('addr_typecode'); if(addrTypeSel) selectDropdownByValue(addrTypeSel,'home');
        const addrPrincipal=byId('addr_principalflag'); if(addrPrincipal){ addrPrincipal.checked=true; addrPrincipal.dispatchEvent(new Event('change',{bubbles:true})); }

        const srcEl=byId('addr_sourcetext')||q('input[name="addr_sourcetext"]');
        if(srcEl){
          const today=todayDDMMYYYY(); const site=(rec.sources&&rec.sources.addrPhoneSrc)||'';
          let srcLabel='proff.no'; if(/gulesider\.no/i.test(site)) srcLabel='proff.no, gulesider'; else if(/1881\.no/i.test(site)) srcLabel='proff.no, 1881.no';
          srcEl.value = `${srcLabel} as at ${today}.`; srcEl.dispatchEvent(new Event('input',{bubbles:true})); srcEl.dispatchEvent(new Event('change',{bubbles:true}));
        }
      }

      /* Phones (always) */
      const raw=(rec.phones||[]).filter(Boolean), ordered=sortPhonesLandlineFirst(raw);
      const site=(rec.sources&&rec.sources.addrPhoneSrc)||'', today=todayDDMMYYYY();
      let phoneSrcLabel=''; if(/gulesider\.no/i.test(site)) phoneSrcLabel='gulesider'; else if(/1881\.no/i.test(site)) phoneSrcLabel='1881.no'; else phoneSrcLabel=site.replace(/^https?:\/\//,'').replace(/\/.*/,'')||'as at';

      for(let i=0;i<ordered.length;i++){
        const idcSel=byId('tel_idccode'), numInput=byId('tel_number'), numType=byId('tel_numbertypecode'), typeCode=byId('tel_typecode'), principal=byId('tel_principleflag'), srcInput=byId('tel_sourcetext'), addBtn=byId('btnTelDetailsAdd');
        if(!idcSel||!numInput||!numType||!typeCode||!addBtn) break;
        selectDropdownByValue(idcSel,'NOR');
        numInput.value=String(ordered[i]).trim(); numInput.dispatchEvent(new Event('input',{bubbles:true})); numInput.dispatchEvent(new Event('change',{bubbles:true}));
        const kind=classifyNO(ordered[i]); selectDropdownByValue(numType, kind); selectDropdownByValue(typeCode, kind==='mobile'?'work':'home');
        if(principal){ principal.checked=(i===0 && kind==='phone'); principal.dispatchEvent(new Event('change',{bubbles:true})); }
        if(srcInput){ srcInput.value=`${phoneSrcLabel} as at ${today}.`; srcInput.dispatchEvent(new Event('input',{bubbles:true})); srcInput.dispatchEvent(new Event('change',{bubbles:true})); }
        addBtn.click(); await sleep(250);
      }

      if(rec.spouse) setInputValue('detail_maritalstatusdetails', `Spouse's name: ${rec.spouse}`);
      if(rec.dob) setInputValue('detail_dtsbirth', rec.dob);
      const notesEl=byId('detail_notes'); if(notesEl && rec.positionsBlock && !String(notesEl.value||'').trim()){ notesEl.value=String(rec.positionsBlock||'').trim(); notesEl.dispatchEvent(new Event('input',{bubbles:true})); notesEl.dispatchEvent(new Event('change',{bubbles:true})); }

      toast(hasAddress ? '✅ Address + ordered phones (NO) filled from last cached record.' : '✅ Ordered phones (NO) filled (no address found).');
    }

    /* Address fill (SE) — unchanged behavior */
    async function fillAddressFromRecordSE(rec){
      if(!rec) return;
      const countrySel=byId('addr_countrycode'); if(countrySel) selectDropdownByValue(countrySel,'SWE');
      const hasAddress=!!(rec.address1 && rec.postcode && rec.city);
      if(hasAddress){ setInputValue('addr_address1', rec.address1); setInputValue('addr_zip', rec.postcode); setInputValue('addr_city', rec.city); }
      const stateSel=byId('addr_state');
      if(stateSel && rec.countyRaw){
        const SE_MAP={ 'varmland':'Värmlands län','vastra gotaland':'Västra Götalands län','stockholm':'Stockholms län','skane':'Skåne län','uppsala':'Uppsala län','orebro':'Örebro län','ostergotland':'Östergötlands län','sodermanland':'Södermanlands län','gavleborg':'Gävleborgs län','jonkoping':'Jönköpings län','halland':'Hallands län','hallands':'Hallands län','dalarnas':'Dalarnas län','dalarna':'Dalarnas län','vasternorrland':'Västernorrlands län','vastmanland':'Västmanlands län','vasterbotten':'Västerbottens län','norrbotten':'Norrbottens län','kronoberg':'Kronobergs län','kalmar':'Kalmar län','gotland':'Gotlands län','jammland':'Jämtlands län','jamtland':'Jämtlands län','blekinge':'Blekinge län' };
        const key=fixSpecialChars(String(rec.countyRaw||'').toLowerCase()).replace(/\slan\b/g,'').replace(/\blan\b/g,'').trim();
        const mapped=SE_MAP[key] || rec.countyRaw || rec.city;
        const norm=(s)=>fixSpecialChars(String(s||'').toLowerCase()).replace(/\s+/g,' ').trim();
        const target=norm(mapped);
        let tries=0; const timer=setInterval(()=>{ tries++; const opts=Array.from(stateSel.options||[]); let opt=opts.find(o=>norm(o.textContent)===target); if(!opt) opt=opts.find(o=>norm(o.textContent).includes(target)); if(!opt && key) opt=opts.find(o=>norm(o.textContent).includes(key)); if(opt){ stateSel.value=opt.value; stateSel.dispatchEvent(new Event('change',{bubbles:true})); clearInterval(timer);} else if(tries>30){ clearInterval(timer);} },200);
      }
      const addrTypeSel=byId('addr_typecode'); if(addrTypeSel) selectDropdownByValue(addrTypeSel,'home');
      const principalChk=byId('addr_principalflag'); if(principalChk){ principalChk.checked=true; principalChk.dispatchEvent(new Event('change',{bubbles:true})); }
      const srcEl=byId('addr_sourcetext')||q('input[name="addr_sourcetext"]'); if(srcEl){ const site=(rec.sources&&rec.sources.addrPhoneSrc)||'ratsit'; let label=site.replace(/^https?:\/\//,'').replace(/\/.*/,'').replace(/\.se$/,''); if(/ratsit/i.test(label)) label='ratsit'; else if(/mrkoll/i.test(label)) label='mrkoll'; srcEl.value=`${label} as at ${todayDDMMYYYY()}.`; srcEl.dispatchEvent(new Event('input',{bubbles:true})); srcEl.dispatchEvent(new Event('change',{bubbles:true})); }
      const classifySE=(raw)=>{ const clean=String(raw||'').replace(/\s+/g,''); const m=clean.match(/^\(0\)(\d)/); return m&&m[1]==='7'?'mobile':'phone'; };
      const raw=(rec.phones||[]).filter(Boolean); let principalIdx=0; for(let i=0;i<raw.length;i++){ if(classifySE(raw[i])==='phone'){ principalIdx=i; break; } }
      const site=(rec.sources&&rec.sources.addrPhoneSrc)||'ratsit'; let phoneSrcLabel=site.replace(/^https?:\/\//,'').replace(/\/.*/,'').replace(/\.se$/,''); if(/ratsit/i.test(phoneSrcLabel)) phoneSrcLabel='ratsit'; else if(/mrkoll/i.test(phoneSrcLabel)) phoneSrcLabel='mrkoll';
      for(let i=0;i<raw.length;i++){ const idcSel=byId('tel_idccode'), numInput=byId('tel_number'), numType=byId('tel_numbertypecode'), typeCode=byId('tel_typecode'), principal=byId('tel_principleflag'), srcInput=byId('tel_sourcetext'), addBtn=byId('btnTelDetailsAdd'); if(!idcSel||!numInput||!numType||!typeCode||!addBtn) break;
        selectDropdownByValue(idcSel,'SWE'); numInput.value=String(raw[i]).trim(); numInput.dispatchEvent(new Event('input',{bubbles:true})); numInput.dispatchEvent(new Event('change',{bubbles:true}));
        const kind=classifySE(raw[i]); selectDropdownByValue(numType, kind); selectDropdownByValue(typeCode,'home'); if(principal){ principal.checked=(i===principalIdx); principal.dispatchEvent(new Event('change',{bubbles:true})); }
        if(srcInput){ srcInput.value=`${phoneSrcLabel} as at ${todayDDMMYYYY()}.`; srcInput.dispatchEvent(new Event('input',{bubbles:true})); srcInput.dispatchEvent(new Event('change',{bubbles:true})); }
        addBtn.click(); await sleep(250);
      }
      if(rec.spouse){ setInputValue('detail_maritalstatusdetails', `Spouse's name: ${rec.spouse}`); const ms=byId('detail_maritalstatuscode'); if(ms) selectDropdownByValue(ms,'married'); }
      if(rec.dob) setInputValue('detail_dtsbirth', rec.dob);
      const notesEl=byId('detail_notes'); if(notesEl && rec.positionsBlock){ const existing=String(notesEl.value||'').trim(); const prefix=existing && !/\n$/.test(existing)?'\n':''; notesEl.value=existing+prefix+rec.positionsBlock; notesEl.dispatchEvent(new Event('input',{bubbles:true})); notesEl.dispatchEvent(new Event('change',{bubbles:true})); }
      toast('✅ Address, phones, spouse & DOB (SE) filled from last cached record.');
    }

    /* Liquidity panel + loader buttons — build once; toggle visibility; attach listeners once */
    let beBuilt=false; // prevents re-builds
    function ensureBEButtons(){
      if(beBuilt) return; // build only once
      const topDoc=getTopDoc(), topBody=topDoc&&(topDoc.body||topDoc.documentElement); if(!topBody){ setTimeout(ensureBEButtons,250); return; }
      beBuilt=true;

      // Wrapper
      const wrap=topDoc.createElement('div');
      wrap.id='beButtonsWrap';
      wrap.style='position:fixed;right:20px;bottom:20px;z-index:2147483647;display:flex;gap:12px;align-items:flex-end';
      topBody.appendChild(wrap);

      // Main load button
      const loadBtn=topDoc.createElement('button');
      loadBtn.id='loadNoCacheBtn';
      loadBtn.textContent='Fill person details';
      loadBtn.title='Fill person details from the saved record';
      loadBtn.style='background:rgb(49 108 174);color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;align-self:flex-end';
      loadBtn.onclick=async()=>{
        const rec=await loadLast();
        if(!rec||!rec.name){ toast('Cache empty — save from ratsit/mrkoll or gulesider/1881 first.'); return; }
        if(String(rec.country||'').toUpperCase()==='SWE') await fillAddressFromRecordSE(rec); else await fillAddressFromRecordNO(rec);
      };
      wrap.appendChild(loadBtn);

      // Liquidity panel
      const LIQ_BOX_HIDDEN_KEY='wm-liq-box-hidden';

      const liqBox=topDoc.createElement('div');
      liqBox.id='wmLiqBox';
      liqBox.style='display:flex;flex-direction:column;gap:6px;background:#1f2937;color:#e5e7eb;padding:10px 12px;border-radius:6px;max-width:420px;position:relative';
      wrap.appendChild(liqBox);

      const closeBtn=topDoc.createElement('button');
      closeBtn.textContent='✕';
      closeBtn.title='Close';
      closeBtn.style='position:absolute;top:6px;right:6px;background:#374151;color:#e5e7eb;border:none;border-radius:4px;cursor:pointer;padding:2px 6px;font-size:12px;line-height:1;';
      closeBtn.onclick=()=>{
        try{ window.top.localStorage.setItem(LIQ_BOX_HIDDEN_KEY,'1'); }catch{}
        liqBox.style.display='none';
        showBtn.style.display='inline-block';
      };

      const liqLabel=topDoc.createElement('div'); liqLabel.textContent='Liquidity instructions:'; liqLabel.style='font-weight:600;padding-right:24px';
      const liqText=topDoc.createElement('textarea');
      liqText.id='wmLiqInstructions';
      liqText.placeholder='e.g.\nstake sale, stake 0.7777, value USD 99m\n\nstake source: ratsit\n\nliq event note: Based on the implied equity value... Stake held... Shares held...\n\nliq event source: ABS Holco annual report';
      liqText.style='width:380px;height:140px;background:#111;color:#eee;border:1px solid #374151;border-radius:2px;padding:6px;font:10px/1.4 system-ui';

      const liqApply=topDoc.createElement('button');
      liqApply.textContent='Apply';
      liqApply.style='background:rgb(49 108 174);color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;align-self:flex-start';

      // build show button once
      const showBtn=topDoc.createElement('button');
      showBtn.id='wmShowLiqBtn';
      showBtn.textContent='Show liquidity panel';
      showBtn.style='background:#4b5563;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;margin-right:8px;display:none;';
      showBtn.onclick=()=>{
        try{ window.top.localStorage.removeItem(LIQ_BOX_HIDDEN_KEY);}catch{}
        liqBox.style.display='flex';
        showBtn.style.display='none';
      };
      wrap.appendChild(showBtn);

      // initial visibility from localStorage
      const hidden=(function(){ try{ return (window.top.localStorage.getItem(LIQ_BOX_HIDDEN_KEY)==='1'); }catch{ return false; } })();
      liqBox.style.display = hidden ? 'none' : 'flex';
      showBtn.style.display = hidden ? 'inline-block' : 'none';

      // ---- Parser (robust event type + decimals preserved) ----
      const EVENT_TYPE_MAP={
        'pot stake sale':'potstakesale','potential stake sale':'potstakesale','stake sale':'stakesale',
        'pot ipo':'potipo','potential ipo':'potipo','ipo':'ipo',
        'potential extr dividends':'potextrdividends','pot extr dividends':'potextrdividends','extra dividends':'extrdividends','extr dividends':'extrdividends',
        'potsmc':'potsmc','pot smc':'potsmc','smc':'smc',
        'pot earn out':'potearndeffered','potential earn out':'potearndeffered','earn out':'earndeffered',
        'deferred payment':'earndeffered',
        'pot earn out deferred payment':'potearndeffered',
        'earn out deferred payment':'earndeffered',
        'pot exercise of warrants':'potexwarrants','pot ex warrants':'potexwarrants','exercise of warrants':'exwarrants','ex warrants':'exwarrants',
        'pot exercise sale':'potexsale','pot exercise/sale':'potexsale','exercise sale':'exsale','exercise/sale':'exsale',
        'other':'other','bonus':'bonus',
        'long term holdings':'longtermhold','long-term holdings':'longtermhold',
        'capital raises':'capraises',
        'settlement payout':'settlementpayout','settlement/payout':'settlementpayout',
        'salary':'salary'
      };
      const CURRENCY_ALLOWED=new Set(['EUR','GBP','USD','AUD','CNY','HKD','INR','JPY','CHF']);

      const parse=(raw)=>{
        const s=fixSpecialChars(String(raw||''));          // original string (preserve decimals)
        const lower=s.toLowerCase();

        // Normalize ONLY for event-type (ignore punctuation)
        const evtLower=lower.replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();

        let typeCode='';
        for(const [phrase,code] of Object.entries(EVENT_TYPE_MAP)){
          if(evtLower.includes(phrase)){ typeCode=code; break; }
        }

        // stake (preserve decimals)
        let stakePercent=null; {
          const m=lower.match(/stake\s*[:=]?\s*([\d.,]+)\s*%?/);
          if(m){ const num=parseFloat(m[1].replace(/,/g,'')); if(!isNaN(num)) stakePercent=num; }
        }

        // currency + value (millions)
        let currencyCode='', amount=null, unit='m'; {
          let m=s.match(/value\s+([A-Z]{3})\s+([\d.,]+)\s*(bn|billion|billions|m|mn|million|millions)?/i);
          if(!m) m=s.match(/\b([A-Z]{3})\s+([\d.,]+)\s*(bn|billion|billions|m|mn|million|millions)\b/i);
          if(!m){ const m2=s.match(/value\s+([\d.,]+)\s*(bn|billion|billions|m|mn|million|millions)\s+([A-Z]{3})/i); if(m2) m=[m2[0],m2[3],m2[1],m2[2]]; }
          if(m){
            const cur=m[1].toUpperCase(); if(CURRENCY_ALLOWED.has(cur)) currencyCode=cur;
            amount=parseFloat(String(m[2]).replace(/,/g,'')); const u=(m[3]||'m').toLowerCase(); unit=/bn|billion/.test(u)?'bn':'m';
          }
        }
        { const mCur=s.match(/\bvalue\s*[:=]?\s*([A-Z]{3})\b(?!\s*[\d.,])/i); if(mCur){ const cur=mCur[1].toUpperCase(); if(CURRENCY_ALLOWED.has(cur)) currencyCode=cur; amount=null; } }
        if(!currencyCode){ for(const cur of CURRENCY_ALLOWED){ if(s.includes(cur)){ currencyCode=cur; break; } } }

        // sources/notes
        let stakeSource=''; {
          let m=s.match(/stake\s*source\s*:\s*([^\n]+)/i);
          if(!m) m=s.match(/source\s*for\s*stake\s*:\s*([^\n]+)/i);
          if(m) stakeSource=m[1].trim(); else { const g=s.match(/\bsource\s*:\s*([^\n]+)/i); if(g) stakeSource=g[1].trim(); }
        }
        let liqSource=''; {
          let m=s.match(/liq(?:uidity)?\s*event\s*source\s*:\s*([^\n]+)/i);
          if(!m) m=s.match(/source\s*for\s*liq(?:uidity)?\s*event\s*:\s*([^\n]+)/i);
          liqSource=m?m[1].trim():stakeSource||'';
        }
        let liqNote=''; {
          let m=s.match(/liq(?:uidity)?\s*event\s*note\s*:\s*([\s\S]*?)(?:\n\s*(?:liq(?:uidity)?\s*event\s*source|source\s*for\s*liq(?:uidity)?\s*event|stake\s*source|source\s*for\s*stake|source)\s*:|$)/i);
          if(!m) m=s.match(/liq\s*note\s*:\s*([\s\S]*?)(?:\n\s*(?:liq(?:uidity)?\s*event\s*source|source\s*for\s*liq(?:uidity)?\s*event|stake\s*source|source\s*for\s*stake|source)\s*:|$)/i);
          if(m) liqNote=m[1].trim();
        }

        const valueMillions=(typeof amount==='number' && !isNaN(amount)) ? (unit==='bn'? amount*1000 : amount) : null;
        return { typeCode, stakePercent, currencyCode, valueMillions, stakeSource, liqSource, liqNote };
      };

      const truncate4=(n)=> (typeof n!=='number'||!isFinite(n)) ? '' : String(Math.floor(n*10000)/10000);
      const getAppt=()=>{ const el=q('[name="ind_dateappointment"]'); const v=el?String(el.value||'').trim():''; return /^\d{2}\/\d{2}\/\d{4}$/.test(v)?v:''; };
      const extractStakeSentences=(note)=>{ const raw=String(note||'').replace(/\r\n/g,'\n').replace(/\r/g,'\n'); const matches=[]; const re=/(^|[\s"'`])((?:Stake|Shares)\s+held[^\n\.]*\.?)/gi; let m; while((m=re.exec(raw))!==null){ const s=(m[2]||'').trim(); if(s) matches.push(s); } return matches; };

      const apply=(parsed)=>{
        const {typeCode,stakePercent,currencyCode,valueMillions,stakeSource,liqSource,liqNote}=parsed||{};
        const appt=getAppt(); if(!appt) toast('⚠️ Appointment date missing or invalid (dd/mm/yyyy). Fill it first.');

        const typeSel=byId('newwealth_typecode'); if(typeSel && typeCode) selectDropdownByValue(typeSel,typeCode);

        const stakeUnavailable=/size of stake held not available|exact breakdown of ownership not available/i.test(liqNote||'');

        if(typeof stakePercent==='number' && !isNaN(stakePercent) && !stakeUnavailable){
          setAnyStakePercent(stakePercent);
        }

        const atTxt=appt?` as at ${appt}.`:'';
        if(typeof stakePercent==='number' && !isNaN(stakePercent) && !stakeUnavailable){
          const finalStakeSource=fixSpecialChars((stakeSource||'proff.no').trim());
          const shareSourceText=appt?`${finalStakeSource}${atTxt}`:finalStakeSource;
          setInputByName('share_sourcetext', shareSourceText);
          setInputByName('share_sourcenotes', shareSourceText);
          setInputByName('share_sourcenote', shareSourceText);
          setInputByName('share_sourcenotes_text', shareSourceText);
          setInputValue('share_sourcenotes', shareSourceText);
        }

        const currSel=byId('newwealth_currencycode'); if(currSel && currencyCode) selectDropdownByValue(currSel,currencyCode);

        if(typeCode!=='capraises' && typeof stakePercent==='number' && typeof valueMillions==='number'){
          const exactWorth=truncate4((stakePercent/100) * valueMillions);
          setAnyExactWorthMillions(exactWorth);
        }

        const finalLiqSource=fixSpecialChars((liqSource||stakeSource||'').trim());
        if(finalLiqSource){
          const liqSourceText=appt?`${finalLiqSource}${atTxt}`:finalLiqSource;
          setInputByName('newwealth_sourcetext', liqSourceText);
          setInputByName('newwealth_sourcenotes', liqSourceText);
          setInputByName('newwealth_sourcenote', liqSourceText);
          setInputByName('newwealth_sourcenotes_text', liqSourceText);
          setInputValue('newwealth_sourcenotes', liqSourceText);
        }

        if(!stakeUnavailable){
          const stakeSentences=extractStakeSentences(liqNote||'');
          if(stakeSentences.length) setInputByName('share_sharenotes', fixSpecialChars(stakeSentences.join(' ')));
        }

        if(liqNote){
          const noteEl=byId('newwealth_notes');
          if(noteEl){
            noteEl.value=fixSpecialChars(String(liqNote).trim());
            noteEl.dispatchEvent(new Event('input',{bubbles:true}));
            noteEl.dispatchEvent(new Event('change',{bubbles:true}));
          }
        }
        const displayChk=byId('newwealth_notes_displayflag'); if(displayChk){ displayChk.checked=true; displayChk.dispatchEvent(new Event('change',{bubbles:true})); }

        const lastUpdateEl=byId('detail_dtsLastUpdate')||q('input[name="detail_dtsLastUpdate"]'), allocatedEl=q('input[name="share_dtsallocated"]');
        if(appt){
          if(lastUpdateEl){
            lastUpdateEl.value=appt;
            lastUpdateEl.dispatchEvent(new Event('input',{bubbles:true}));
            lastUpdateEl.dispatchEvent(new Event('change',{bubbles:true}));
          }
          if(typeof stakePercent==='number' && !isNaN(stakePercent) && !stakeUnavailable && allocatedEl){
            allocatedEl.value=appt;
            allocatedEl.dispatchEvent(new Event('input',{bubbles:true}));
            allocatedEl.dispatchEvent(new Event('change',{bubbles:true}));
          }
        }

        toast('✅ stake and liq event filled');
      };

      liqBox.appendChild(closeBtn); liqBox.appendChild(liqLabel); liqBox.appendChild(liqText); liqBox.appendChild(liqApply);

      liqApply.onclick=()=>{ const raw=byIdTop('wmLiqInstructions')?.value||''; const parsed=parse(raw); apply(parsed); };

      // ALT+L hotkey (installed once)
      if(!byIdTop('wmAltLHandler')){
        const marker=topDoc.createElement('div'); marker.id='wmAltLHandler'; marker.style='display:none'; topDoc.body.appendChild(marker);
        topDoc.addEventListener('keydown',(e)=>{ if(e.altKey && e.key.toLowerCase()==='l'){ e.preventDefault(); try{ window.top.localStorage.removeItem(LIQ_BOX_HIDDEN_KEY); }catch{} liqBox.style.display='flex'; showBtn.style.display='none'; } });
      }
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ensureBEButtons); else ensureBEButtons();
  }
})();

// ==UserScript==
// @name         Trade Republic Kreditkarten-Umsätze → CSV/XLSX (v4.6 + minimize)
// @namespace    de.user.traderepublic.csv.export
// @version      4.6
// @description  Start per Button; Monat/Jahr-Filter (+ Startjahr); Kategorie-Filter; Einnahmen/Ausgaben; CSV (UTF-16LE) & XLSX; automatischer Jahres-Rollover; Zusatzspalten Jahr & Monat; Minimize/Restore.
// @match        https://app.traderepublic.com/profile/transactions*
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license      MIT
// @copyright    (c) 2025 CGIELER
// @note         Uses SheetJS/xlsx via @require (Apache-2.0). No code is bundled
// @downloadURL https://update.greasyfork.org/scripts/548389/Trade%20Republic%20Kreditkarten-Ums%C3%A4tze%20%E2%86%92%20CSVXLSX%20%28v46%20%2B%20minimize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548389/Trade%20Republic%20Kreditkarten-Ums%C3%A4tze%20%E2%86%92%20CSVXLSX%20%28v46%20%2B%20minimize%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- XLSX robust laden (Fallback, falls @require blockiert wird) ----------
  async function ensureXLSX(){
    if (window.XLSX) return true;
    return await new Promise(res=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload=()=>res(true);
      s.onerror=()=>res(false);
      document.head.appendChild(s);
    });
  }

  // ---------- UI ----------
  const css = `
  #trBox{position:fixed;top:12px;right:12px;z-index:999999;background:#111;color:#fff;border:1px solid #2a2a2a;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);width:590px;max-height:84vh;display:flex;flex-direction:column;overflow:hidden;font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial}
  #trBox header{padding:10px 12px;background:#1b1b1b;font-weight:700;display:flex;align-items:center;justify-content:space-between}
  #trBox .hdrRight{display:flex;align-items:center;gap:8px}
  #trBox .pill{background:#2a2a2a;border:1px solid #3a3a3a;border-radius:999px;padding:2px 8px}
  #trBox .body{padding:10px 12px;overflow:auto}
  #trBox button{background:#2a2a2a;color:#fff;border:1px solid #3a3a3a;border-radius:8px;padding:6px 10px;cursor:pointer}
  #trBox button:disabled{opacity:.5;cursor:not-allowed}
  #trMin{width:28px;min-width:28px;padding:4px 0;text-align:center;border-radius:8px}
  #trBox textarea{width:100%;min-height:170px;background:#0f0f0f;color:#cde3ff;border:1px solid #262626;border-radius:8px;padding:8px;white-space:pre}
  .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0}
  .row label{display:flex;align-items:center;gap:6px}
  input.mmYY{width:90px;padding:4px 6px;border-radius:6px;border:1px solid #333;background:#0f0f0f;color:#fff}
  input.year{width:80px;padding:4px 6px;border-radius:6px;border:1px solid #333;background:#0f0f0f;color:#fff}

  /* Collapsed / minimized */
  #trBox.collapsed{top:auto;bottom:12px;right:12px;width:240px}
  #trBox.collapsed .body{display:none}
  #trBox.collapsed header{cursor:pointer}
  `;
  try { GM_addStyle?.(css); } catch { const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }

  const ui = document.createElement('div');
  ui.id = 'trBox';
  ui.innerHTML = `
    <header id="trHeader">
      <div>TR Kreditkarten-Export</div>
      <div class="hdrRight">
        <div class="pill" id="trStatus">Bereit</div>
        <button id="trMin" title="Minimieren">—</button>
      </div>
    </header>
    <div class="body">
      <div class="row">
        <button id="trStart">Scan starten</button>
        <button id="trStop" disabled>Stop</button>
        <button id="trExportCsv" disabled>CSV speichern</button>
        <button id="trExportXlsx" disabled>XLSX speichern</button>
        <span id="trDbg" style="opacity:.85;font-size:11px;margin-left:auto"></span>
      </div>

      <div class="row">
        <label>Von (MM.YYYY)<input id="trFrom" class="mmYY" placeholder="MM.YYYY"></label>
        <label>Bis (MM.YYYY)<input id="trTo" class="mmYY" placeholder="MM.YYYY"></label>
        <label>Startjahr<input id="trBaseYear" class="year" placeholder="auto"></label>
        <button id="btnPrevMonth" title="Filter auf letzten Kalendermonat setzen">Letzter Monat</button>
      </div>

      <div class="row">
        <label><input type="checkbox" id="cbCard" checked> Kartenzahlungen</label>
        <label><input type="checkbox" id="cbIn"   checked> Einzahlungen</label>
        <label><input type="checkbox" id="cbOut"  checked> Auszahlungen</label>
        <label><input type="checkbox" id="cbPlan" checked> Sparpläne/Saveback/Round up</label>
      </div>

      <div>Zeilen (gefiltert/gesamt): <b id="trCount">0/0</b> · Scrolls: <b id="trScrolls">0</b> · DOM-Einträge: <b id="trNodes">0</b></div>
      <textarea id="trPreview" placeholder="Vorschau …"></textarea>
    </div>
  `;
  document.documentElement.appendChild(ui);
  const $ = (s)=>ui.querySelector(s);
  const elStatus=$('#trStatus'), elCount=$('#trCount'), elScrolls=$('#trScrolls'),
        elNodes=$('#trNodes'), elPreview=$('#trPreview'), elDbg=$('#trDbg'),
        btnStart=$('#trStart'), btnStop=$('#trStop'),
        btnExportCsv=$('#trExportCsv'), btnExportXlsx=$('#trExportXlsx'),
        inFrom=$('#trFrom'), inTo=$('#trTo'), inBaseYear=$('#trBaseYear'),
        cbCard=$('#cbCard'), cbIn=$('#cbIn'), cbOut=$('#cbOut'), cbPlan=$('#cbPlan'),
        btnPrevMonth=$('#btnPrevMonth'), btnMin=$('#trMin'), header=$('#trHeader');

  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

  // ---------- Minimize / Restore ----------
  const STORE_KEY='trBoxCollapsed';
  function setCollapsed(c){
    ui.classList.toggle('collapsed', !!c);
    btnMin.textContent = c ? '▣' : '—';
    btnMin.title = c ? 'Wieder öffnen' : 'Minimieren';
    try{ localStorage.setItem(STORE_KEY, c?'1':'0'); }catch{}
  }
  setCollapsed(localStorage.getItem(STORE_KEY)==='1');
  btnMin.addEventListener('click', (e)=>{ e.stopPropagation(); setCollapsed(!ui.classList.contains('collapsed')); });
  header.addEventListener('dblclick', ()=> setCollapsed(!ui.classList.contains('collapsed')));

  // ---------- Utils ----------
  const NBSP = /\u00A0/g;
  function clean(s){ return (s||'').replace(NBSP,' ').replace(/\s+\n/g,'\n').trim(); }
  function txt(el){ return clean(el?.innerText || ''); }

  const monthMap = {Jan:'01', Feb:'02', Mär:'03', Mrz:'03', Apr:'04', Mai:'05', Jun:'06', Jul:'07', Aug:'08', Sep:'09', Okt:'10', Nov:'11', Dez:'12'};
  const reDateNum = /(^|\s)(\d{1,2})\.(\d{2})\.(?=\s|$|[^0-9])/;
  const reDateMon = /(^|\s)(\d{1,2})\.\s*(Jan|Feb|Mär|Mrz|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)\.(?=\s|$)/;

  function dateParts(s){
    s = clean(s);
    let m = s.match(reDateNum);
    if (m) return { d: parseInt(m[2],10), m: parseInt(m[3],10) };
    m = s.match(reDateMon);
    if (m) return { d: parseInt(m[2],10), m: parseInt(monthMap[m[3]],10) };
    return null;
  }
  function parseDateDE(ddmmyyyy){ const [d,m,y] = ddmmyyyy.split('.').map(x=>parseInt(x,10)); return new Date(y, m-1, d); }
  function parseMonthInput(s){ const m=/^\s*(\d{1,2})\.(\d{4})\s*$/.exec(s||''); if(!m) return null; return [parseInt(m[2],10), Math.min(Math.max(parseInt(m[1],10),1),12)]; }
  function lastMonthRange(){ const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()-1); const y=d.getFullYear(), m=d.getMonth()+1, mm=String(m).padStart(2,'0'); return {from:`${mm}.${y}`, to:`${mm}.${y}`}; }
  function inRangeByMonth(ddmmyyyy, fromStr, toStr){
    if (!fromStr && !toStr) return true;
    const d = parseDateDE(ddmmyyyy);
    let ok = true;
    if (fromStr){ const [fy,fm]=parseMonthInput(fromStr)||[]; if (fy){ ok = ok && (d >= new Date(fy, fm-1, 1)); } }
    if (toStr){   const [ty,tm]=parseMonthInput(toStr)||[];   if (ty){ ok = ok && (d <= new Date(ty, tm, 0)); } }
    return ok;
  }
  function normNumDE(text){
    let s=clean(text).replace(/[^\d,.\-+]/g,'').trim();
    if(!s) return '';
    const i=Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));
    let sign=''; if (/^[+-]/.test(s)){ sign = s[0]==='-'?'-':''; s=s.slice(1); }
    if (i>=0){
      const intp=s.slice(0,i).replace(/[^\d]/g,'');
      const decp=s.slice(i+1).replace(/[^\d]/g,'').slice(0,2).padEnd(2,'0');
      return sign + (intp||'0') + ',' + decp;
    }
    return sign + s.replace(/[^\d]/g,'');
  }
  const numFromDE = s => s ? parseFloat(s.replace(/\./g,'').replace(',','.')) : null;

  function currencyCodeFrom(text){
    const t = clean(text);
    if (/GBP|£/.test(t)) return 'GBP';
    if (/USD|\$/.test(t)) return 'USD';
    if (/EUR|€/.test(t)) return 'EUR';
    if (/CHF|Fr\b/.test(t)) return 'CHF';
    if (/PLN|zł/.test(t)) return 'PLN';
    if (/CZK|Kč/.test(t)) return 'CZK';
    if (/TRY|₺/.test(t)) return 'TRY';
    if (/JPY|¥/.test(t)) return 'JPY';
    if (/\bSEK\b|\bDKK\b|\bNOK\b|\bkr\b/.test(t)) return 'SEK';
    if (/HUF|Ft/.test(t)) return 'HUF';
    if (/RON|lei/.test(t)) return 'RON';
    return '';
  }

  // ---------- Scroll ----------
  function isScrollable(el){ if (!el) return false; const cs=getComputedStyle(el); const oy=cs.overflowY||cs.overflow; return /(auto|scroll)/.test(oy) && (el.scrollHeight - el.clientHeight > 100); }
  function findScrollEl(){
    try {
      const prefs = [
        document.querySelector('main#layout__main'),
        document.querySelector('section.layout__extended'), // korrekt
        document.querySelector('.layout__extended'),
        document.querySelector('.timeline'),
        document.scrollingElement,
        document.documentElement,
        document.body
      ];
      for (const el of prefs){
        if (el && isScrollable(el)) return el;
      }
    } catch (e) {
      console.warn('findScrollEl error', e);
    }
    return document.scrollingElement || document.documentElement || document.body;
  }
  function getTop(el){ return (el===document.documentElement||el===document.body||el===document.scrollingElement) ? (window.pageYOffset||document.documentElement.scrollTop||0) : el.scrollTop; }
  function doScroll(el,top){ const isDoc=(el===document.documentElement||el===document.body||el===document.scrollingElement); if (isDoc) window.scrollTo({top,behavior:'smooth'}); else el.scrollTo({top,behavior:'smooth'}); }

  // ---------- DOM ----------
  function getAllEntryNodes(scope){
    const root = scope || document;
    const nodes = Array.from(root.querySelectorAll('ol.timeline__entries li.timeline__entry > div.timelineEventAction[role="button"]'));
    return nodes.filter(n => n.offsetParent !== null && !n.closest('[aria-hidden="true"]'));
  }
  function qAny(container, selectors){ for (const s of selectors){ const n=container.querySelector(s); if (n) return n; } return null; }

  // ---------- Parsing & Klassifizierung ----------
  function classify(name, subtitle, eurTxt){
    const lowerName=(name||'').toLowerCase(), lowerSub=(subtitle||'').toLowerCase();
    const isPlus=/^\s*\+/.test(clean(eurTxt)), isMinus=/^\s*-/.test(clean(eurTxt));
    if (lowerName.includes('einzahlung')) return {category:'Einzahlung',flow:'Einnahme'};
    if (lowerName.includes('auszahlung')) return {category:'Auszahlung',flow:'Ausgabe'};
    if (lowerSub.includes('sparplan')||lowerSub.includes('saveback')||lowerSub.includes('round up')||lowerSub.includes('roundup')) return {category:'Sparplan',flow:'Ausgabe'};
    if (isPlus)  return {category:'Einzahlung',flow:'Einnahme'};
    if (isMinus) return {category:'Kartenzahlung',flow:'Ausgabe'};
    return {category:'Kartenzahlung',flow:'Ausgabe'};
  }

  function parseNode(node){
    const c = node.querySelector('.timelineV2Event') || node;
    const nameEl=qAny(c,['h2[class*="__title"]','h2[title]','h2']);
    const dateEl=qAny(c,['p[class*="__subtitle"]','p']);
    const priceBox=qAny(c,['div[class*="__price"]','div']);
    const majorEl=priceBox?qAny(priceBox,['p:not([class*="subPrice"])','p']):null;
    const fxEl   =priceBox?qAny(priceBox,['p[class*="subPrice"]']):null;

    const name=(nameEl?.getAttribute('title')||txt(nameEl)||'').trim();
    const subtitle=txt(dateEl);
    const dp = dateParts(subtitle) || dateParts(txt(c));
    if (!dp) return null;

    let eurTxt=txt(majorEl); if (!eurTxt && priceBox) eurTxt = txt(priceBox);
    const amountEur = normNumDE(eurTxt);
    if (!name || !amountEur) return null;

    const fxRaw=txt(fxEl)||''; const fxAmount = fxRaw ? normNumDE(fxRaw) : ''; const fxCode = fxRaw ? currencyCodeFrom(fxRaw) : '';

    const {category, flow} = classify(name, subtitle, eurTxt);
    const einnahmen = (flow==='Einnahme') ? amountEur : '';
    const ausgaben  = (flow==='Ausgabe')  ? amountEur : '';

    // Jahr wird später zugewiesen
    return { day:dp.d, month:dp.m, year:null, date:'', name, category, flow, amountEur, einnahmen, ausgaben, fxAmount, fxCode, fxRaw, raw: clean(c.innerText) };
  }

  function dedupe(items){
    const seen=new Set(), out=[];
    for (const it of items){ if (!it) continue;
      const key = `${it.day}.${it.month}|${it.name}|${it.amountEur}|${it.fxAmount}|${it.fxCode}`;
      if(!seen.has(key)){ seen.add(key); out.push(it); }
    }
    return out;
  }

  // ---------- Jahr zuweisen ----------
  function getBaseYear(){
    const user = parseInt(inBaseYear.value,10);
    if (!Number.isNaN(user) && user>1900 && user<3000) return user;
    const from = parseMonthInput(inFrom.value); if (from) return from[0];
    return (new Date()).getFullYear();
  }
  function assignYears(items){
    if (!items.length) return;
    let year = getBaseYear();
    let prevMonth = items[0].month;
    items[0].year = year;
    items[0].date = `${String(items[0].day).padStart(2,'0')}.${String(items[0].month).padStart(2,'0')}.${year}`;
    for (let i=1;i<items.length;i++){
      const m = items[i].month;
      if (m > prevMonth) year -= 1; // neu→alt: Monat springt hoch → Vorjahr
      items[i].year = year;
      items[i].date = `${String(items[i].day).padStart(2,'0')}.${String(m).padStart(2,'0')}.${year}`;
      prevMonth = m;
    }
    const minYear = items.reduce((a,b)=>Math.min(a, b.year||a), year);
    elDbg.textContent = `Startjahr=${getBaseYear()} → minJahr=${minYear}`;
  }

  // ---------- Filter ----------
  function passesCategory(it){
    if (it.category==='Kartenzahlung' && !cbCard.checked) return false;
    if (it.category==='Einzahlung'    && !cbIn.checked)   return false;
    if (it.category==='Auszahlung'    && !cbOut.checked)  return false;
    if (it.category==='Sparplan'      && !cbPlan.checked) return false;
    return true;
  }
  function filterItems(items){
    return items.filter(it => passesCategory(it) && inRangeByMonth(it.date, inFrom.value, inTo.value));
  }

  // ---------- CSV (UTF-16LE) ----------
  function toCSV(items){
    const esc=t=>{ t=t==null?'':String(t); return /[\";\n]/.test(t)?`"${t.replace(/"/g,'""')}"`:t; };
    const header=[
      'Datum (DD.MM.YYYY)','Jahr','Monat',
      'Kategorie','An wen','Betrag EUR','Einnahmen EUR','Ausgaben EUR','FX Betrag','FX Währung','Raw Text'
    ];
    const rows=items.map(it=>[
      esc(it.date), it.year, it.month,
      esc(it.category), esc(it.name), esc(it.amountEur), esc(it.einnahmen), esc(it.ausgaben),
      esc(it.fxAmount), esc(it.fxCode), esc(it.raw)
    ].join(';'));
    return 'sep=;\n'+header.join(';')+'\n'+rows.join('\n');
  }
  function utf16leBlob(str){
    const buf = new Uint8Array(2 + str.length*2); buf[0]=0xFF; buf[1]=0xFE;
    for (let i=0;i<str.length;i++){ const c=str.charCodeAt(i); buf[2+i*2]=c & 0xFF; buf[3+i*2]=c>>8; }
    return new Blob([buf], {type:'text/csv;charset=utf-16le'});
  }

  // ---------- XLSX ----------
  function toXLSXBlob(items){
    const header=[
      'Datum (DD.MM.YYYY)','Jahr','Monat',
      'Kategorie','An wen','Betrag EUR','Einnahmen EUR','Ausgaben EUR','FX Betrag','FX Währung','Raw Text'
    ];
    const rows=items.map(it=>[
      it.date, it.year, it.month,
      it.category, it.name,
      numFromDE(it.amountEur), numFromDE(it.einnahmen), numFromDE(it.ausgaben),
      numFromDE(it.fxAmount), it.fxCode || '', it.raw
    ]);
    const aoa=[header,...rows];
    const wb=XLSX.utils.book_new();
    const ws=XLSX.utils.aoa_to_sheet(aoa);
    ['F','G','H','I'].forEach(col=>{
      for(let r=2;r<=aoa.length;r++){
        const addr=col+r, cell=ws[addr];
        if(cell && typeof cell.v==='number') cell.z='0.00';
      }
    });
    XLSX.utils.book_append_sheet(wb, ws, 'Umsaetze');
    const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
    return new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }

  // ---------- Runner ----------
  let running=false, scrolls=0, scrollEl=null, allItems=[];

  function refreshPreview(){
    assignYears(allItems);
    const filtered = filterItems(allItems);
    elPreview.value = filtered.slice(0,150).map(i =>
      `${i.date} | ${i.year}-${String(i.month).padStart(2,'0')} | ${i.category} | ${i.name} | ${i.amountEur} €${i.fxAmount?` | ${i.fxAmount} ${i.fxCode}`:''}`
    ).join('\n');
    elCount.textContent = `${filtered.length}/${allItems.length}`;
    const disabled = (filtered.length === 0);
    btnExportCsv.disabled = disabled;
    btnExportXlsx.disabled = disabled;
  }

  async function autoScan(maxIdle=14, maxScrolls=2000){
    running=true; btnStart.disabled=true; btnStop.disabled=false; elStatus.textContent='Scanne …';
    scrollEl = findScrollEl();
    let idle=0, lastCount=0, lastTop=-1;

    while (running && scrolls < maxScrolls && idle < maxIdle){
      scrolls++; elScrolls.textContent = String(scrolls);
      const topNow=getTop(scrollEl), maxH=scrollEl.scrollHeight||document.body.scrollHeight, vh=scrollEl.clientHeight||window.innerHeight;
      const nextTop=Math.min(topNow+Math.round(vh*0.9),maxH);
      doScroll(scrollEl,nextTop);
      await sleep(900);
      if (getTop(scrollEl)===topNow){ window.scrollTo({top:nextTop,behavior:'smooth'}); await sleep(500); }

      const nodes = getAllEntryNodes(scrollEl);
      elNodes.textContent = String(nodes.length);

      allItems = dedupe(nodes.map(parseNode).filter(Boolean));
      assignYears(allItems);
      refreshPreview();

      const reachedEnd = getTop(scrollEl) >= ((scrollEl.scrollHeight - (scrollEl.clientHeight || window.innerHeight) - 2));
      if (allItems.length > lastCount) { lastCount = allItems.length; idle = 0; }
      else if (!reachedEnd && (getTop(scrollEl) !== lastTop)) { idle = 0; }
      else { idle++; }
      lastTop = getTop(scrollEl);
      if (reachedEnd) idle++;
    }

    elStatus.textContent='Fertig (keine neuen Daten)';
    btnStart.disabled=false; btnStop.disabled=true;
    refreshPreview();
    running=false;
  }

  function stopScan(){ running=false; elStatus.textContent='Pausiert'; btnStart.disabled=false; btnStop.disabled=true; }

  function downloadCSV(){
    assignYears(allItems);
    const items = filterItems(allItems);
    if (!items.length) return;
    const blob = utf16leBlob(toCSV(items));
    const url = URL.createObjectURL(blob);
    const name = `trade_republic_kreditkarten_umsatz_${new Date().toISOString().slice(0,10)}.csv`;
    try { GM_download?.({url, name, saveAs:true}); } catch { const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
  }

  async function downloadXLSX(){
    assignYears(allItems);
    const items = filterItems(allItems);
    if (!items.length) return;
    const ok = await ensureXLSX();
    if (!ok || !window.XLSX){ alert('XLSX-Bibliothek konnte nicht geladen werden. Bitte CSV nutzen.'); return; }
    const blob = toXLSXBlob(items);
    const url = URL.createObjectURL(blob);
    const name = `trade_republic_kreditkarten_umsatz_${new Date().toISOString().slice(0,10)}.xlsx`;
    try { GM_download?.({url, name, saveAs:true}); } catch { const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
  }

  // Events
  btnStart.addEventListener('click', ()=>{ scrolls=0; allItems=[]; elPreview.value=''; elCount.textContent='0/0'; autoScan(); });
  btnStop.addEventListener('click',  stopScan);
  btnExportCsv.addEventListener('click', downloadCSV);
  btnExportXlsx.addEventListener('click', downloadXLSX);
  [inFrom,inTo,inBaseYear,cbCard,cbIn,cbOut,cbPlan].forEach(el => el.addEventListener('input', refreshPreview));
  btnPrevMonth.addEventListener('click', ()=>{ const r=lastMonthRange(); inFrom.value=r.from; inTo.value=r.to; refreshPreview(); });

  // kein Autostart
})();

// ==UserScript==
// @name         Table Cell Sum Overlay
// @author       @NOWARATN
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  CTRL+klik/drag po <td>/<th>; klik w „Suma” kopiuje sumę; Ctrl+C=TSV; DblClick<th>=zaznacz kolumna; Ctrl+Shift: równoległe pasma (zamraża zakres wierszy na zboczu Shift).
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555039/Table%20Cell%20Sum%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/555039/Table%20Cell%20Sum%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLASS_SELECTED = 'tm-cell-selected';
    const OVERLAY_ID = 'tm-sum-overlay';
    const CONFIG = { csvDelimiter: ';' };

    // --- Styles (jak wcześniej) ---
    const style = document.createElement('style');
    style.textContent = `
    .${CLASS_SELECTED}{outline:2px solid #4a9eff!important;outline-offset:-2px!important;background-image:linear-gradient(0deg,rgba(74,158,255,.12),rgba(74,158,255,.12))!important}
    #${OVERLAY_ID}{position:fixed;right:0;bottom:0;z-index:2147483647;font:12px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Ubuntu,Arial,sans-serif;color:#0f172a;background:rgba(248,250,252,.98);border-top:1px solid rgba(0,0,0,.08);border-left:1px solid rgba(0,0,0,.08);box-shadow:-2px -2px 12px rgba(15,23,42,.08);padding:6px 10px;user-select:none;display:none;gap:10px;align-items:center;border-top-left-radius:6px;backdrop-filter:saturate(140%) blur(4px)}
    #${OVERLAY_ID} .tm-chip{padding:2px 6px;border-radius:999px;background:#e2e8f0;font-weight:600;white-space:nowrap}
    #${OVERLAY_ID} .tm-chip.copyable{cursor:pointer}
    #${OVERLAY_ID} .tm-actions{display:flex;gap:6px;margin-left:6px}
    #${OVERLAY_ID} button{font:inherit;padding:2px 6px;border-radius:6px;border:1px solid rgba(0,0,0,.12);background:#fff;cursor:pointer}
    #${OVERLAY_ID} button:hover{background:#f1f5f9}
    @media (prefers-color-scheme: dark){
      #${OVERLAY_ID}{background:rgba(15,23,42,.9);color:#e2e8f0;border-color:rgba(255,255,255,.06);box-shadow:-2px -2px 12px rgba(0,0,0,.35)}
      #${OVERLAY_ID} .tm-chip{background:#334155;color:#e2e8f0}
      #${OVERLAY_ID} button{background:#0b1220;color:#e2e8f0;border-color:#263043}
      #${OVERLAY_ID} button:hover{background:#111a2e}
    }`;
    document.documentElement.appendChild(style);

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.innerHTML = `
    <span class="tm-chip" id="tm-count">0 kom.</span>
    <span class="tm-chip" id="tm-uniq">Unikaty: 0</span>
    <span class="tm-chip copyable" id="tm-sum">Suma: 0</span>
    <span class="tm-chip" id="tm-avg">Śr.: 0</span>
    <div class="tm-actions">
      <button id="tm-copy-tsv">TSV</button>
      <button id="tm-copy-csv">CSV</button>
      <button id="tm-clear">Wyczyść</button>
    </div>`;
    document.body.appendChild(overlay);
    const elCount=overlay.querySelector('#tm-count'), elUniq=overlay.querySelector('#tm-uniq'),
          elSum=overlay.querySelector('#tm-sum'), elAvg=overlay.querySelector('#tm-avg'),
          btnTSV=overlay.querySelector('#tm-copy-tsv'), btnCSV=overlay.querySelector('#tm-copy-csv'),
          btnClear=overlay.querySelector('#tm-clear');

    // --- Helpers ---
    const isCell = el => (el && el.closest) ? el.closest('td, th') : null;
    const getTable = el => el?.closest ? el.closest('table') : null;
    const getCellPlainText = c => (c?.innerText ?? '').replace(/\u00A0/g,' ').replace(/\s*\n+\s*/g,' ').replace(/\s{2,}/g,' ').trim();
    function parseNumberFromText(t){
        if(!t) return NaN;
        const isPct=/%/.test(t), isParen=/\(\s*[-+]?\s*[\d.,\s]+\s*\)/.test(t);
        t=t.replace(/\u00A0/g,' ').replace(/[^\d.,\-+]/g,' ').trim();
        const m=t.match(/[+-]?\s*\d[\d\s.,]*/); if(!m) return NaN;
        t=m[0].replace(/\s+/g,'');
        const d=t.lastIndexOf('.'), c=t.lastIndexOf(','), dec=(d===-1&&c===-1)?null:(d>c?'.':',');
        if(dec){ const th=dec==='.'? ',':'.'; t=t.replace(new RegExp('\\'+th,'g'), ''); if(dec===',') t=t.replace(',', '.'); }
        else t=t.replace(/[.,]/g,'');
        let n=Number(t); if(!Number.isFinite(n)) return NaN;
        if(isParen) n=-Math.abs(n); if(isPct) n/=100; return n;
    }
    const formatNum=n=>{ try{return new Intl.NumberFormat(undefined,{maximumFractionDigits:6}).format(n);}catch{return String(n);} };
    const normalize=n=>Number(n).toPrecision(12);

    const selected = new Set();
    function toggleCell(cell, forceAdd=null){
        if(!cell) return;
        const add = forceAdd===null ? !selected.has(cell) : forceAdd;
        if(add){ selected.add(cell); cell.classList.add(CLASS_SELECTED); }
        else   { selected.delete(cell); cell.classList.remove(CLASS_SELECTED); }
    }
    function updateOverlay(){
        const values=[], uniq=new Set();
        for(const c of selected){ if(!c.isConnected) continue; const v=parseNumberFromText(c.textContent); if(Number.isFinite(v)){ values.push(v); uniq.add(normalize(v)); } }
        const count=values.length, sum=values.reduce((a,b)=>a+b,0), avg=count?sum/count:0;
        elCount.textContent=`${count} kom.`; elUniq.textContent=`Unikaty: ${uniq.size}`;
        elSum.textContent=`Suma: ${formatNum(sum)}`; elAvg.textContent=`Śr.: ${count?formatNum(avg):'0'}`;
        overlay.style.display = count ? 'inline-flex' : 'none';
    }
    function applyAndRefresh(fn){ fn(); updateOverlay(); managePruneTimer(); }
    function clearSelection(){ for(const c of selected){ c.classList.remove(CLASS_SELECTED);} selected.clear(); updateOverlay(); managePruneTimer(); }

    function buildTSV(){
        const rowMap=new Map();
        for(const c of selected){ if(!c.isConnected) continue; const tr=c.closest('tr')||null; if(!rowMap.has(tr)) rowMap.set(tr,[]); rowMap.get(tr).push(c); }
        const rows=Array.from(rowMap.keys());
        rows.sort((a,b)=>{ if(a===b) return 0; if(!a) return -1; if(!b) return 1; const p=a.compareDocumentPosition(b); return (p&Node.DOCUMENT_POSITION_FOLLOWING)?-1:1; });
        const lines=[];
        for(const tr of rows){ const cells=rowMap.get(tr).sort((a,b)=>a.cellIndex-b.cellIndex); lines.push(cells.map(getCellPlainText).join('\t')); }
        return lines.join('\n');
    }
    function buildCSV(){ return buildTSV().split('\n').map(line=>line.split('\t').map(f=>(/[;"\n;]/.test(f)?`"${f.replace(/"/g,'""')}"`:f)).join(CONFIG.csvDelimiter)).join('\n'); }
    async function writeClipboard(text){ try{ await navigator.clipboard.writeText(text); return true; } catch { window.prompt('Skopiuj ręcznie:', text); return false; } }

    // Klik w „Suma” -> skopiuj sumę
    elSum.addEventListener('click', async () => {
        const ok = await writeClipboard(elSum.textContent.replace(/^Suma:\s*/, ''));
        if(ok){ const old=elSum.textContent; elSum.textContent='Skopiowano sumę!'; setTimeout(()=>elSum.textContent=old,1200); }
    });
    // TSV/CSV
    btnTSV.addEventListener('click', async ()=>{ if(await writeClipboard(buildTSV())){ btnTSV.textContent='Skopiowano TSV!'; setTimeout(()=>btnTSV.textContent='TSV',1200);} });
    btnCSV.addEventListener('click', async ()=>{ if(await writeClipboard(buildCSV())){ btnCSV.textContent='Skopiowano CSV!'; setTimeout(()=>btnCSV.textContent='CSV',1200);} });
    document.addEventListener('keydown', async (e)=>{
        const meta=e.ctrlKey||e.metaKey; if(!meta || (e.key!=='c' && e.key!=='C')) return;
        if(selected.size===0) return;
        const a=document.activeElement, isEd=a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable); if(isEd) return;
        const sel=window.getSelection(); if(sel && String(sel).trim().length>0) return;
        e.preventDefault(); e.stopPropagation(); if(await writeClipboard(buildTSV())){ btnTSV.textContent='Skopiowano TSV!'; setTimeout(()=>btnTSV.textContent='TSV',1200); }
    }, {capture:true});

    // Dblclick <th> -> kolumna (replace / Ctrl add / Ctrl+Alt remove)
    function toggleColumnFromTH(th, mode){
        const table=getTable(th); if(!table) return; const col=th.cellIndex; if(col==null||col<0) return;
        applyAndRefresh(()=>{
            if(mode==='replace'){ for(const c of selected){ c.classList.remove(CLASS_SELECTED);} selected.clear(); }
            for(const tr of table.querySelectorAll('tr')){
                const cells=Array.from(tr.children).filter(el=>el.matches('td,th')); const c=cells[col]; if(!c) continue;
                if(mode==='remove'){ if(selected.has(c)){ selected.delete(c); c.classList.remove(CLASS_SELECTED);} }
                else { selected.add(c); c.classList.add(CLASS_SELECTED); }
            }
        });
        anchorTable = table;
    }
    document.addEventListener('dblclick', (e)=>{
        const th=e.target?.closest?.('th'); if(!th) return;
        let mode='replace'; if(e.ctrlKey||e.metaKey) mode=e.altKey?'remove':'add';
        e.preventDefault(); e.stopPropagation(); toggleColumnFromTH(th, mode);
    }, {capture:true});

    // --- Pruning timer ---
    let pruneTimer=null;
    function managePruneTimer(){
        const visible=overlay.style.display!=='none';
        if(visible && !pruneTimer){
            pruneTimer=setInterval(()=>{ let changed=false; for(const c of Array.from(selected)){ if(!c.isConnected){ selected.delete(c); changed=true; } } if(changed) updateOverlay(); if(selected.size===0) managePruneTimer(); },1000);
        } else if(!visible && pruneTimer){ clearInterval(pruneTimer); pruneTimer=null; }
    }

    // --- Pointer selection with Ctrl / Ctrl+Shift parallel stripes ---
    let isCtrlSelecting=false, dragAdd=true;
    let anchorCell=null, anchorTable=null, dragStartCell=null;

    // parallel state
    let parallelMode=false, parallelRowMin=null, parallelRowMax=null, parallelColStart=null, wasShift=false;

    function getCellFromPoint(x,y){ return isCell(document.elementFromPoint(x,y)); }

    document.addEventListener('pointerdown', (e)=>{
        if(e.button!==0 || !e.ctrlKey) return;
        const cell=isCell(e.target); if(!cell) return;
        e.preventDefault(); e.stopPropagation(); try{ e.target.setPointerCapture(e.pointerId);}catch{}
        isCtrlSelecting=true; dragAdd=!selected.has(cell);
        anchorCell=cell; dragStartCell=cell; anchorTable=getTable(cell);
        parallelMode=false; parallelRowMin=parallelRowMax=parallelColStart=null; wasShift=false;
        applyAndRefresh(()=> toggleCell(cell, dragAdd));
    }, {capture:true});

    document.addEventListener('pointermove', (e)=>{
        if(!isCtrlSelecting) return;
        const cell=getCellFromPoint(e.clientX,e.clientY); if(!cell) return;
        const table=anchorTable||getTable(dragStartCell); const addNow=e.altKey ? !dragAdd : dragAdd;

        applyAndRefresh(()=>{
            const shiftNow = !!e.shiftKey;
            // ENTER parallel mode on Shift rising edge while Ctrl is held
            if((e.ctrlKey||e.metaKey) && shiftNow && !wasShift && dragStartCell && table){
                const rows=Array.from(table.querySelectorAll('tr'));
                const rIdx = c => rows.indexOf(c.closest('tr'));
                const rStart = rIdx(dragStartCell);
                const rNow   = rIdx(cell);
                if(rStart!==-1 && rNow!==-1){
                    parallelRowMin = Math.min(rStart, rNow);
                    parallelRowMax = Math.max(rStart, rNow);
                    parallelColStart = dragStartCell.cellIndex;  // kolumna startu DRAGU
                    parallelMode = true;
                }
            }
            wasShift = shiftNow;

            if(parallelMode && (e.ctrlKey||e.metaKey) && shiftNow && table){
                // równoległe pasma: zamrożony [rowMin..rowMax], kolumny od startowej do bieżącej
                const rows=Array.from(table.querySelectorAll('tr'));
                const currentCol = cell.cellIndex;
                let cmin = Math.min(parallelColStart, currentCol);
                let cmax = Math.max(parallelColStart, currentCol);
                for(let r=parallelRowMin; r<=parallelRowMax; r++){
                    const tr=rows[r]; if(!tr) continue;
                    const cols=Array.from(tr.children).filter(el=>el.matches('td,th'));
                    for(let c=cmin; c<=cmax; c++){ const cc=cols[c]; if(cc) toggleCell(cc, addNow); }
                }
                // nie zmieniamy anchorów w parallelMode
                return;
            }

            // zwykły Shift (prostokąt) — gdy nie w parallelMode
            if(e.shiftKey && anchorCell){
                // prostokąt między anchorCell a cell (dynamiczny)
                const tbl1=getTable(anchorCell), tbl2=getTable(cell);
                if(tbl1 && tbl1===tbl2){
                    const rows=Array.from(tbl1.querySelectorAll('tr'));
                    const pos = c => { const tr=c.closest('tr'); return {r:rows.indexOf(tr), c:c.cellIndex}; };
                    const p1=pos(anchorCell), p2=pos(cell); if(p1.r!==-1 && p2.r!==-1){
                        const rmin=Math.min(p1.r,p2.r), rmax=Math.max(p1.r,p2.r);
                        const cmin=Math.min(p1.c,p2.c), cmax=Math.max(p1.c,p2.c);
                        for(let r=rmin;r<=rmax;r++){
                            const tr=rows[r]; if(!tr) continue;
                            const cols=Array.from(tr.children).filter(el=>el.matches('td,th'));
                            for(let c=cmin;c<=cmax;c++){ const cc=cols[c]; if(cc) toggleCell(cc, addNow); }
                        }
                    }
                    anchorCell = cell;
                    return;
                }
            }

            // ten sam wiersz — wypełnij poziomo
            if(anchorCell && cell.closest('tr')===anchorCell.closest('tr')){
                const tr=anchorCell.closest('tr');
                const start=Math.min(anchorCell.cellIndex, cell.cellIndex);
                const end  =Math.max(anchorCell.cellIndex, cell.cellIndex);
                const cols=Array.from(tr.children).filter(el=>el.matches('td,th'));
                for(let i=start;i<=end;i++){ const cc=cols[i]; if(cc) toggleCell(cc, addNow); }
            }else{
                // pojedynczy skok
                toggleCell(cell, addNow);
            }
            anchorCell = cell; // aktualizuj anchor poza parallelMode
        });
    }, {capture:true, passive:true});

    document.addEventListener('pointerup', (e)=>{
        if(!isCtrlSelecting) return;
        try{ e.target.releasePointerCapture(e.pointerId);}catch{}
        isCtrlSelecting=false;
        parallelMode=false; parallelRowMin=parallelRowMax=parallelColStart=null; wasShift=false;
        anchorCell=null; dragStartCell=null;
    }, {capture:true, passive:true});

    // Blokuj default tylko dla CTRL+klik po komórce
    document.addEventListener('click', (e)=>{
        if(e.button!==0 || !e.ctrlKey) return;
        if(!isCell(e.target)) return;
        e.preventDefault(); e.stopPropagation();
    }, {capture:true});

    // Klawisze: Esc / Ctrl+A
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') clearSelection(); }, {passive:true});
    document.addEventListener('keydown', (e)=>{
        const meta=e.ctrlKey||e.metaKey; if(!meta || (e.key!=='a' && e.key!=='A')) return;
        // zaznacz całą tabelę, jeśli mamy jakąś w dragu
        const table = anchorTable || document.querySelector('table'); if(!table) return;
        const a=document.activeElement, isEd=a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable); if(isEd) return;
        e.preventDefault(); e.stopPropagation();
        applyAndRefresh(()=>{ for(const c of selected){ c.classList.remove(CLASS_SELECTED);} selected.clear(); for(const c of table.querySelectorAll('td,th')){ selected.add(c); c.classList.add(CLASS_SELECTED);} });
    }, {capture:true});
})();

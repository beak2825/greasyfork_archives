// ==UserScript==
// @name         LAZADA REPORT 2025
// @namespace    https://markg.dev/userscripts/lazada-drive
// @version      1.3
// @description  Lazada: pick dates → fetch conversions → build CSV → upload to Drive (replace if exists). GAS logs status to DAILY2025!E1.
// @author       Mark
// @match        https://adsense.lazada.com.ph/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      adsense.lazada.com.ph
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/548368/LAZADA%20REPORT%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/548368/LAZADA%20REPORT%202025.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ====== CONFIG (SET THIS) ====== ***/
  const GAS_UPLOAD_URL  = 'https://script.google.com/macros/s/AKfycbwCfUTQqTQwu163I4RMDAUdGhnu268SdYSrP1XFhUei5RWhvFGel_1Kt6nVxy6tUzxC/exec'; // your working /exec Web App
  const DRIVE_FOLDER_ID = '1yN00c2ib0tW-mUfVeON_Fz6gaZhwJO9l'; // Lazada folder
  const DEFAULT_ACCOUNT = 'lazMG'; // prefix in filename

  // NEW: we REPLACE/REWRITE if a file with the same name already exists (GAS handles it)
  const REPLACE_IF_EXISTS = true;

  /*** ====== DATE HELPERS ====== ***/
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function pad2(n){ return (n<10?'0':'')+n; }
  function yyyyMmDd(d){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
  function getYesterdayISO(){ const d=new Date(); d.setDate(d.getDate()-1); return yyyyMmDd(d); }
  function dayStartISO(iso){ return `${iso}T00:00:00`; }
  function dayEndISO(iso){ return `${iso}T23:59:59`; }

  function formatFilename(startISO, endISO){
    const s = new Date(startISO), e = new Date(endISO);
    const same = s.getFullYear()===e.getFullYear() && s.getMonth()===e.getMonth() && s.getDate()===e.getDate();
    const single = `${months[s.getMonth()]}_${s.getDate()}_${s.getFullYear()}`;
    const range  = `${months[s.getMonth()]}_${s.getDate()}_${e.getDate()}_${e.getFullYear()}`;
    return `${DEFAULT_ACCOUNT}_${same?single:range}.csv`;
  }

  function sanitizeBaseName(name){
    name = (name||'').split(/\r?\n/)[0]
      .replace(/[\\/:*?"<>|]+/g,'_')
      .replace(/\s+/g,'_')
      .replace(/_+/g,'_')
      .replace(/^_+|_+$/g,'');
    if (!name) name = 'export.csv';
    if (!/\.csv$/i.test(name)) name += '.csv';
    return name;
  }

  /*** ====== UI HELPERS ====== ***/
  function logLine(out, msg){ out.style.display='block'; out.textContent+=(out.textContent?'\n':'')+msg; }

  function createPanel(){
    const wrap=document.createElement('div');
    Object.assign(wrap.style,{
      position:'fixed', left:'50%', bottom:'12px', transform:'translateX(-50%)',
      width:'92vw', maxWidth:'420px',
      background:'#fff', border:'1px solid #e5e7eb', borderRadius:'14px',
      boxShadow:'0 10px 30px rgba(0,0,0,0.12)', zIndex: 999999,
      fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Arial', padding:'12px'
    });

    const header=document.createElement('div');
    header.textContent='Lazada → Drive CSV';
    Object.assign(header.style,{fontWeight:700, fontSize:'16px', marginBottom:'8px'});

    const row1=document.createElement('div'); row1.style.display='flex'; row1.style.gap='8px'; row1.style.margin='8px 0';
    const startInput=document.createElement('input');
    startInput.type='date'; startInput.value=getYesterdayISO();
    startInput.style.flex='1'; startInput.style.padding='10px'; startInput.style.border='1px solid #e5e7eb'; startInput.style.borderRadius='10px';

    const endInput=document.createElement('input');
    endInput.type='date'; endInput.value=getYesterdayISO();
    endInput.style.flex='1'; endInput.style.padding='10px'; endInput.style.border='1px solid #e5e7eb'; endInput.style.borderRadius='10px';

    row1.appendChild(startInput); row1.appendChild(endInput);

    const goBtn=document.createElement('button');
    goBtn.textContent='GENERATE & UPLOAD CSV';
    Object.assign(goBtn.style,{
      width:'100%', padding:'12px', border:'none', borderRadius:'12px',
      background:'#0d6efd', color:'#fff', fontWeight:700, cursor:'pointer'
    });

    const out=document.createElement('pre');
    Object.assign(out.style,{display:'none', background:'#f6f8fa', border:'1px solid #eef2f7', padding:'10px', borderRadius:'10px', maxHeight:'260px', overflow:'auto', marginTop:'10px', fontSize:'12px'});

    wrap.appendChild(header);
    wrap.appendChild(row1);
    wrap.appendChild(goBtn);
    wrap.appendChild(out);
    document.body.appendChild(wrap);

    goBtn.addEventListener('click', async ()=>{
      out.textContent='';
      try{
        const sISO = startInput.value, eISO = endInput.value;
        if(!sISO || !eISO){ logLine(out,'Please pick both start and end dates.'); return; }
        const from = dayStartISO(sISO), to = dayEndISO(eISO);
        const base = 'https://adsense.lazada.com.ph/report/conversionReport.json';
        const firstUrl = `${base}?pageNo=1&pageSize=1&fromDateTime=${encodeURIComponent(from)}&toDateTime=${encodeURIComponent(to)}&status=&offerGuidedType=&inviteId=&isCode=&sortField=&sortType=`;

        logLine(out, 'Fetching total…');
        const total = await getTotal(firstUrl);
        logLine(out, `Total rows: ${total}`);

if (total <= 0){
  logLine(out,'No data in range.');
  await logOnlyToGAS(DEFAULT_ACCOUNT, 'No Data', out);
  return;
}

        logLine(out,'Fetching pages…');
        const rows = await fetchAllPages(base, from, to, total);
        logLine(out, `Fetched ${rows.length} rows.`);

        const csv = buildCsv(rows);

        // Guard: do not upload if effectively 0 KB (empty or just header)
        const byteLen = new Blob([csv], {type:'text/csv'}).size;
      if (!csv || csv.trim().length === 0 || byteLen === 0) {
  logLine(out, 'Abort: CSV is empty (0 KB) — not uploading.');
  await logOnlyToGAS(DEFAULT_ACCOUNT, 'No Data', out);
  return;
}


        const fname = sanitizeBaseName(formatFilename(sISO, eISO));
// use a safe local flag so we never crash if the const is missing elsewhere
const replaceFlag = (typeof REPLACE_IF_EXISTS !== 'undefined') ? REPLACE_IF_EXISTS : true;

logLine(out, `Uploading: ${fname} ${replaceFlag ? '(replace-if-exists ON)' : '(replace-if-exists OFF)'}`);
await uploadCsvToDrive(csv, fname, out, DEFAULT_ACCOUNT, replaceFlag);

        logLine(out,'Done ✓');
      }catch(err){
        logLine(out, 'ERROR: '+(err?.message||String(err)));
        console.error(err);
      }
    });
  }

  /*** ====== LAZADA API ====== ***/
  function gmGet(url){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url, responseType:'json',
        onload:(res)=>{
          try{
            const j = typeof res.response === 'object' ? res.response : JSON.parse(res.responseText||'{}');
            resolve({status:res.status, data:j});
          }catch(e){ reject(e); }
        },
        onerror:reject
      });
    });
  }

  async function getTotal(firstUrl){
    const {status, data} = await gmGet(firstUrl);
    if (status!==200) throw new Error('HTTP '+status+' on total');
    return data?.data?.total || 0;
  }

  async function fetchAllPages(base, from, to, total){
    const pageSize = 500;
    const pages = Math.ceil(total / pageSize);
    const all = [];
    for(let p=1; p<=pages; p++){
      const url = `${base}?pageNo=${p}&pageSize=${pageSize}&fromDateTime=${encodeURIComponent(from)}&toDateTime=${encodeURIComponent(to)}&status=&offerGuidedType=&inviteId=&isCode=&sortField=&sortType=`;
      const {status, data} = await gmGet(url);
      if (status!==200) throw new Error('HTTP '+status+' on page '+p);
      const list = data?.data?.reportItem || [];
      for (const it of list){
        all.push({
          conversionTime: it.conversionTime ?? '',
          affiliateSubId: it.affiliateSubId ?? '',
          estPayout:      it.estPayout ?? '',
          status:         it.status ?? ''
        });
      }
    }
    return all;
  }

  /*** ====== CSV + UPLOAD ====== ***/
  function toCsvField(v){
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  }
  function buildCsv(rows){
    const header = ['conversionTime','affiliateSubId','estPayout','status'];
    const lines = [header.join(',')];
    for (const r of rows){
      lines.push([r.conversionTime, r.affiliateSubId, r.estPayout, r.status].map(toCsvField).join(','));
    }
    return lines.join('\n');
  }

 // Send CSV to GAS and include logUser so the server can append [user,status] on AUTOMATION
async function uploadCsvToDrive(csvText, filename, out, logUser, replaceIfExists){
  const base64 = btoa(unescape(encodeURIComponent(csvText)));

const payload = {
  folderId: DRIVE_FOLDER_ID,
  filename: filename,
  mimeType: 'text/csv',
  base64: base64,
  // use the passed-in flag (default true if undefined)
  replaceIfExists: (typeof replaceIfExists === 'boolean') ? replaceIfExists : true,
  // who did this run (shown in AUTOMATION!A)
  logUser: (logUser || '')
};


  await new Promise((resolve,reject)=>{
    GM_xmlhttpRequest({
      method:'POST',
      url: GAS_UPLOAD_URL,
      headers:{'Content-Type':'application/json'},
      data: JSON.stringify(payload),
      onload:(res)=>{
        try{
          const j = JSON.parse(res.responseText||'{}');

          if (j.ok){
            const action = j.replaced ? 'Replaced' : 'Uploaded';
            logLine(out, `${action} ✓ File ID: ${j.fileId}`);
            if (j.log && j.log.ok) {
              // Row index of appended log on AUTOMATION
              logLine(out, `Logged to AUTOMATION ✓ (row ${j.log.row})`);
            }
            resolve(j);
            return;
          }

          if (j.exists) {
            logLine(out, `Skipped: file already exists (${j.fileId}).`);
            resolve(j);
            return;
          }

          logLine(out, `GAS error: ${j.error||'Unknown'}`);
          reject(new Error(j.error||'GAS upload failed'));
        }catch(e){
          const preview = (res.responseText||'').slice(0,200).replace(/\s+/g,' ');
          logLine(out, `GAS parse error. HTTP ${res.status}. Preview: ${preview}`);
          reject(new Error('Non-JSON from GAS'));
        }
      },
      onerror: (e)=>{ logLine(out,'Network error calling GAS.'); reject(e); }
    });
  });
}

    // Log-only to GAS (no file upload): appends [user, status] to AUTOMATION
function logOnlyToGAS(user, status, out){
  const payload = {
    logOnly: true,
    logUser: (user || ''),
    logStatus: (status || 'No Data')
  };
  return new Promise((resolve,reject)=>{
    GM_xmlhttpRequest({
      method:'POST',
      url: GAS_UPLOAD_URL,
      headers:{'Content-Type':'application/json'},
      data: JSON.stringify(payload),
      onload:(res)=>{
        try{
          const j = JSON.parse(res.responseText||'{}');
          if (j.ok && j.log && j.log.ok){
            logLine(out, `Logged (no file) ✓ AUTOMATION row ${j.log.row}`);
            resolve(j);
          } else {
            logLine(out, `GAS log-only error: ${j.error||'Unknown'}`);
            reject(new Error(j.error||'GAS log-only failed'));
          }
        }catch(e){
          const preview = (res.responseText||'').slice(0,200).replace(/\s+/g,' ');
          logLine(out, `GAS log-only parse error. Preview: ${preview}`);
          reject(e);
        }
      },
      onerror: (e)=>{ logLine(out, 'Network error calling GAS (log-only).'); reject(e); }
    });
  });
}


  /*** ====== INIT ====== ***/
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', createPanel);
  else createPanel();

})();

// ==UserScript==
// @name         SP INCOME Report — Drive Export (Saved Task URL)
// @namespace    https://markg.dev/userscripts/sp-income-drive
// @version      3.1.0
// @description  Shopee affiliate export: pick dates → export CSV → save to Google Drive; also save task URL for manual retry/open/clear
// @author       Mark
// @match        https://affiliate.shopee.ph/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      affiliate.shopee.ph
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/548311/SP%20INCOME%20Report%20%E2%80%94%20Drive%20Export%20%28Saved%20Task%20URL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548311/SP%20INCOME%20Report%20%E2%80%94%20Drive%20Export%20%28Saved%20Task%20URL%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ====== CONFIG (SET THIS) ====== ***/
  const GAS_UPLOAD_URL = 'https://script.google.com/macros/s/AKfycbwCfUTQqTQwu163I4RMDAUdGhnu268SdYSrP1XFhUei5RWhvFGel_1Kt6nVxy6tUzxC/exec';
  const DRIVE_FOLDER_ID = '1jAVUfyE2Qe6hVG13PSfFPB6385wAHuhi';

  /*** ====== CONSTS / STORAGE ====== ***/
  const LS_KEY_SAVED = 'sp_income_last_export_v1';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // --- Add this helper after `const months = [...]` ---
function sanitizeBaseName(name) {
  name = (name || '').split(/\r?\n/)[0];      // only first line; drop any headers accidentally appended
  name = name.replace(/[\\/:*?"<>|]+/g, '_');  // forbidden chars → _
  name = name.replace(/\s+/g, '_');           // spaces → _
  name = name.replace(/_+/g, '_');            // collapse repeats
  name = name.replace(/^_+|_+$/g, '');        // trim
  if (!name) name = 'export.csv';
  if (!/\.csv$/i.test(name)) name += '.csv';  // ensure .csv extension
  return name;
}


  /*** ====== DATE HELPERS ====== ***/
  function yyyyMmDd(d) {
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  }
  function getYesterdayISO(){ const d=new Date(); d.setDate(d.getDate()-1); return yyyyMmDd(d); }
  function dayStartUnix(iso){ return Math.floor(new Date(iso+'T00:00:00').getTime()/1000); }
  function dayEndUnix(iso){ return Math.floor(new Date(iso+'T23:59:59').getTime()/1000); }
  function formatFilename(username, startISO, endISO, extHint){
    const s=new Date(startISO), e=new Date(endISO);
    const same = s.getFullYear()===e.getFullYear() && s.getMonth()===e.getMonth() && s.getDate()===e.getDate();
    const single = `${months[s.getMonth()]}_${s.getDate()}_${s.getFullYear()}`;
    const range  = `${months[s.getMonth()]}_${s.getDate()}_${e.getDate()}_${e.getFullYear()}`;
    return `${username}_${same?single:range}.${extHint||'csv'}`;
  }

  /*** ====== UI HELPER ====== ***/
  function logLine(out, msg){ out.style.display='block'; out.textContent+=(out.textContent?'\n':'')+msg; }

  /*** ====== CORE API ====== ***/
  function fetchShopeeUsername(){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET',
        url:'https://affiliate.shopee.ph/api/v3/user/profile',
        onload:(res)=>{
          try{
            const j=JSON.parse(res.responseText);
            const name=j?.data?.shopee_user_name || j?.data?.username;
            if(name) resolve(name); else reject(new Error('shopee_user_name not found'));
          }catch(e){reject(e);}
        },
        onerror:reject
      });
    });
  }

  function triggerExport(startISO, endISO){
    const s=dayStartUnix(startISO), e=dayEndUnix(endISO);
    const url=`https://affiliate.shopee.ph/api/v1/report/download?page_size=20&page_num=1&purchase_time_s=${s}&purchase_time_e=${e}&version=1`;
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url,
        onload:(res)=>{
          try{
            const j=JSON.parse(res.responseText);
            const taskId=j?.data?.task_id;
            if(!taskId) return reject(new Error('No task_id in response'));
            resolve({taskId, startISO, endISO});
          }catch(e){reject(e);}
        },
        onerror:reject
      });
    });
  }

  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  async function downloadWhenReady(taskId, out, opts={}){
    const maxAttempts = opts.maxAttempts ?? 30;
    const intervalMs  = opts.intervalMs  ?? 3000;
    for(let i=1;i<=maxAttempts;i++){
      logLine(out, `Checking export status (attempt ${i}/${maxAttempts})...`);
      const blob = await tryDownload(taskId);
      if (blob) return blob;
      await sleep(intervalMs);
    }
    throw new Error('File not ready after multiple attempts.');
  }

  function tryDownload(taskId){
    const url=`https://affiliate.shopee.ph/api/v1/export/download?task_id=${encodeURIComponent(taskId)}`;
    return new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:'GET',
        url,
        responseType:'arraybuffer',
        onload:(res)=>{
          const headers=res.responseHeaders||'';
          const ctMatch=headers.match(/content-type:\s*([^\r\n]+)/i);
          const dispMatch=headers.match(/content-disposition:\s*attachment/ig);
          const contentType=(ctMatch?ctMatch[1]:'').trim().toLowerCase();
          const isDownloadish = !!dispMatch || /text\/csv|application\/octet-stream/i.test(contentType);
          const ok = res.status===200 && res.response && res.response.byteLength>128 && isDownloadish;

          if(ok){
            let ext='csv';
            const nameFromDisp=headers.match(/filename="?([^"]+)"?/i);
            if(nameFromDisp && nameFromDisp[1]){
              const nm=nameFromDisp[1].trim();
              const dot=nm.lastIndexOf('.');
              if(dot>-1) ext=nm.slice(dot+1).toLowerCase();
            }
            const blob=new Blob([res.response], {type: contentType || 'text/csv;charset=utf-8'});
            blob.__extHint=ext;
            blob.__sourceURL=url;
            resolve(blob);
          }else{
            resolve(null);
          }
        },
        onerror:()=>resolve(null)
      });
    });
  }

  async function blobToBase64(blob){
    const buf=await blob.arrayBuffer();
    let binary=''; const bytes=new Uint8Array(buf);
    for(let i=0;i<bytes.length;i++) binary+=String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

async function uploadToDriveViaGAS(fileBlob, filename, out){
  // force simple CSV MIME; Shopee may label as application-stream which GAS rejects
  const safeMime = 'text/csv';

  // sanitize filename defensively on the client too
  const safeName = sanitizeBaseName(filename);

  const base64 = await blobToBase64(fileBlob);
  const payload = {
    folderId: DRIVE_FOLDER_ID,
    filename: safeName,
    mimeType: safeMime,
    base64: base64
  };

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: GAS_UPLOAD_URL,            // must be the Web App /exec URL
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      onload: (res) => {
        const text = res.responseText || '';
        try {
          const j = JSON.parse(text);
          if (j.ok) {
            logLine(out, `Uploaded to Drive ✓ File ID: ${j.fileId}`);
            resolve(j);
          } else {
            logLine(out, `GAS error: ${j.error || 'Unknown error'}`);
            reject(new Error(j.error || 'GAS upload failed'));
          }
        } catch {
          const preview = text.slice(0, 200).replace(/\s+/g, ' ');
          logLine(out, `GAS response parse error. HTTP ${res.status}. Preview: ${preview}`);
          reject(new Error('GAS returned non-JSON.'));
        }
      },
      onerror: (e) => {
        logLine(out, 'Network error calling GAS.');
        reject(e);
      }
    });
  });
}


  /*** ====== SAVE / LOAD LAST TASK ====== ***/
  function saveLastExport(obj){
    localStorage.setItem(LS_KEY_SAVED, JSON.stringify(obj));
  }
  function loadLastExport(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY_SAVED)||'null'); }catch(_){ return null; }
  }
  function clearLastExport(){
    localStorage.removeItem(LS_KEY_SAVED);
  }

  /*** ====== UI ====== ***/
  function createGUI(){
    const wrap=document.createElement('div');
    Object.assign(wrap.style,{
      position:'fixed', right:'10px', bottom:'10px', zIndex:999999,
      background:'#fff', border:'1px solid #ddd', borderRadius:'10px',
      padding:'12px', width:'340px', fontFamily:'Inter, Arial, sans-serif',
      boxShadow:'0 6px 20px rgba(0,0,0,0.15)'
    });

    const toggle=document.createElement('button');
    toggle.textContent='HIDE';
    Object.assign(toggle.style,{width:'100%',marginBottom:'8px',padding:'8px',cursor:'pointer'});

    // Date pickers
    const row1=document.createElement('div'); row1.style.marginBottom='8px';
    const row2=document.createElement('div'); row2.style.marginBottom='8px';
    const startLbl=document.createElement('label'); startLbl.textContent='Start date: ';
    const endLbl=document.createElement('label');   endLbl.textContent='End date: ';
    const startInput=document.createElement('input'); startInput.type='date'; startInput.value=getYesterdayISO();
    const endInput=document.createElement('input');   endInput.type='date';   endInput.value=getYesterdayISO();
    startInput.style.margin='4px 0'; endInput.style.margin='4px 0';

    // Action button
    const goBtn=document.createElement('button');
    goBtn.textContent='EXPORT → DRIVE';
    Object.assign(goBtn.style,{width:'100%',padding:'10px',cursor:'pointer',background:'#0d6efd',color:'#fff',border:'none',borderRadius:'6px'});

    // Saved export panel
    const savedBox=document.createElement('div');
    Object.assign(savedBox.style,{borderTop:'1px solid #eee',marginTop:'10px',paddingTop:'10px'});

    const savedTitle=document.createElement('div');
    savedTitle.textContent='Saved export (manual options)';
    savedTitle.style.fontWeight='600';
    savedTitle.style.marginBottom='6px';

    const savedInfo=document.createElement('div');
    savedInfo.style.fontSize='12px';
    savedInfo.style.marginBottom='6px';

    const linkOpen=document.createElement('a');
    linkOpen.href='#';
    linkOpen.textContent='Open download URL';
    linkOpen.style.display='inline-block';
    linkOpen.style.marginRight='8px';

    const btnManualReDownload=document.createElement('button');
    btnManualReDownload.textContent='Manual Download → Drive';
    Object.assign(btnManualReDownload.style,{padding:'6px 8px',marginRight:'8px',cursor:'pointer'});

    const btnClear=document.createElement('button');
    btnClear.textContent='Clear Saved';
    Object.assign(btnClear.style,{padding:'6px 8px',cursor:'pointer'});

    // Output area
    const out=document.createElement('pre');
    Object.assign(out.style,{display:'none',background:'#f6f8fa',border:'1px solid #eee',padding:'8px',maxHeight:'260px',overflow:'auto',borderRadius:'6px',fontSize:'12px',marginTop:'10px'});

    // Toggle behavior
    toggle.addEventListener('click', ()=>{
      const hidden = startInput.style.display==='none';
      for(const el of [startInput,endInput,startLbl,endLbl,goBtn,savedBox,out]){
        el.style.display = hidden ? (el===out && !out.textContent ? 'none' : 'block') : 'none';
      }
      startLbl.style.display = hidden ? 'inline' : 'none';
      endLbl.style.display   = hidden ? 'inline' : 'none';
      startInput.style.display = hidden ? 'inline-block' : 'none';
      endInput .style.display = hidden ? 'inline-block' : 'none';
      toggle.textContent = hidden ? 'HIDE' : 'SHOW';
    });

    // Layout
    row1.appendChild(startLbl); row1.appendChild(startInput);
    row2.appendChild(endLbl);   row2.appendChild(endInput);
    wrap.appendChild(toggle);
    wrap.appendChild(row1);
    wrap.appendChild(row2);
    wrap.appendChild(goBtn);
    // Saved panel
    savedBox.appendChild(savedTitle);
    savedBox.appendChild(savedInfo);
    savedBox.appendChild(linkOpen);
    savedBox.appendChild(btnManualReDownload);
    savedBox.appendChild(btnClear);
    wrap.appendChild(savedBox);
    wrap.appendChild(out);
    document.body.appendChild(wrap);

    // Load & render saved
    function renderSaved(){
      const saved=loadLastExport();
      if(!saved){
        savedInfo.textContent='(none)';
        linkOpen.style.pointerEvents='none';
        linkOpen.style.opacity='0.5';
        btnManualReDownload.disabled=true;
        btnClear.disabled=true;
        return;
      }
      const {username,startISO,endISO,taskId,downloadURL}=saved;
      savedInfo.textContent=`User: ${username} | ${startISO} → ${endISO} | task_id: ${taskId}`;
      linkOpen.href = downloadURL || `https://affiliate.shopee.ph/api/v1/export/download?task_id=${encodeURIComponent(taskId)}`;
      linkOpen.style.pointerEvents='auto';
      linkOpen.style.opacity='1';
      btnManualReDownload.disabled=false;
      btnClear.disabled=false;
    }
    renderSaved();

    // Main export flow
    goBtn.addEventListener('click', async ()=>{
      out.textContent='';
      try{
        const startISO=startInput.value, endISO=endInput.value;
        if(!startISO || !endISO){ logLine(out,'Please pick both start and end dates.'); return; }

        logLine(out,'Getting Shopee username…');
        const username=await fetchShopeeUsername();
        logLine(out,`Username: ${username}`);

        logLine(out,'Requesting export task…');
        const {taskId}=await triggerExport(startISO,endISO);
        logLine(out,`task_id: ${taskId}`);

        // Save the task URL so you can retry later
        const downloadURL=`https://affiliate.shopee.ph/api/v1/export/download?task_id=${encodeURIComponent(taskId)}`;
        saveLastExport({username,startISO,endISO,taskId,downloadURL});
        renderSaved();

        logLine(out,'Waiting for file to be ready…');
        const blob=await downloadWhenReady(taskId,out);
        logLine(out,`File ready (${(blob.size/1024).toFixed(1)} KB)`);

       const rawName = formatFilename(username, startISO, endISO, blob.__extHint);
const safeName = sanitizeBaseName(rawName);
logLine(out, `Uploading to Drive as: ${safeName}`);
await uploadToDriveViaGAS(blob, safeName, out);

        logLine(out,'Done ✓');
      }catch(err){
        logLine(out,'ERROR: '+(err?.message||String(err)));
        console.error(err);
      }
    });

    // Manual open (browser handles it)
    linkOpen.addEventListener('click', (e)=>{
      const saved=loadLastExport();
      if(!saved) return;
      // allow default navigation in new tab
      linkOpen.target='_blank';
    });

    // Manual re-download → Drive (re-uses saved task)
    btnManualReDownload.addEventListener('click', async ()=>{
      out.textContent='';
      const saved=loadLastExport();
      if(!saved){ logLine(out,'No saved export to download.'); return; }
      const {username,startISO,endISO,taskId}=saved;
      try{
        logLine(out,`Retrying download for task_id ${taskId}…`);
        const blob=await downloadWhenReady(taskId,out, {maxAttempts: 60, intervalMs: 3000}); // a bit longer for manual
        logLine(out,`File ready (${(blob.size/1024).toFixed(1)} KB)`);

        const rawName = formatFilename(username, startISO, endISO, blob.__extHint);
const safeName = sanitizeBaseName(rawName);
logLine(out, `Uploading to Drive as: ${safeName}`);
await uploadToDriveViaGAS(blob, safeName, out);

        logLine(out,'Done ✓');
      }catch(err){
        logLine(out,'ERROR: '+(err?.message||String(err)));
      }
    });

    // Clear saved export
    btnClear.addEventListener('click', ()=>{
      clearLastExport();
      renderSaved();
      out.textContent='';
      logLine(out,'Cleared saved export.');
    });
  }

  /*** ====== INIT ====== ***/
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', createGUI); }
  else{ createGUI(); }
})();

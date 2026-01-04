// ==UserScript==
// @name         Shopee Bulk Upload Aff Shortener
// @namespace    https://markg.dev/userscripts/shopee-aio-upload-xlsx
// @version      1.0.1
// @description  One button: get XLSX from GAS (Drive), upload to Shopee, poll export, download result, save back to Drive (no Google Client ID).
// @match        https://affiliate.shopee.ph/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      affiliate.shopee.ph
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/550333/Shopee%20Bulk%20Upload%20Aff%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/550333/Shopee%20Bulk%20Upload%20Aff%20Shortener.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /** ====== CONFIG ====== **/
  const GAS_URL          = 'https://script.google.com/macros/s/AKfycbzagCvyCKh-kgJv2JvVUX7wgI_Nm5RaVUH0_Uz4PFX86rvyOtn9xzEWvtJzS52YjfD8/exec';
  const DRIVE_FOLDER_ID  = '1Ny7NiXSqwIA75dSrW3DrbWLV51ogHgFe';
  const XLSX_BASENAME    = 'Batch Custom Links'; // matches "Batch Custom Links" or "...xlsx"
  const SAVE_REPLACE     = true;                 // replace same-name on save
  const SHARED_SECRET    = '';                   // if you set SHARED_SECRET in GAS, set it here too

  // Shopee endpoints
  const UPLOAD_URL       = '/api/v1/upload/tasks';
  const LIST_URL         = '/api/v1/export/list?file_name=&type=&page_size=10&page_num=1';
  const DOWNLOAD_URL     = (taskId) => `https://affiliate.shopee.ph/api/v1/export/download?task_id=${encodeURIComponent(taskId)}`;

  const PICK_TYPE        = 'offer';
  const POLL_INTERVAL_MS = 5000;
  const POLL_TIMEOUT_MS  = 15 * 60 * 1000;

  /** ====== UI ====== **/
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position:'fixed', right:'12px', bottom:'12px', zIndex:999999,
    background:'#0b1020', color:'#fff', border:'1px solid #1f2937',
    padding:'10px 12px', borderRadius:'12px', boxShadow:'0 8px 24px rgba(0,0,0,.35)',
    font:'12px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial'
  });
  const btn = mkBtn('RUN ALL (Drive XLSX → Upload → Monitor → Save)', runAll);
  const out = document.createElement('pre');
  Object.assign(out.style,{marginTop:'6px',whiteSpace:'pre-wrap',maxWidth:'560px',maxHeight:'280px',overflow:'auto'});
  panel.appendChild(btn); panel.appendChild(out); document.documentElement.appendChild(panel);
  function mkBtn(t,cb){ const b=document.createElement('button'); b.textContent=t;
    Object.assign(b.style,{background:'#334155',color:'#fff',border:'none',padding:'8px 10px',borderRadius:'10px',cursor:'pointer',fontSize:'12px'}); b.onclick=cb; return b; }
  const log = (m)=>{ out.textContent = (out.textContent? out.textContent+'\n':'') + `[${new Date().toLocaleTimeString()}] ${m}`; };

  /** ====== FLOW ====== **/
  async function runAll(){
    try {
      btn.disabled = true;
      if (!GAS_URL) throw new Error('Set GAS_URL to your Web App exec link.');

      // 1) Fetch XLSX from Drive via GAS
      log(`Fetching XLSX "${XLSX_BASENAME}" from Drive (via GAS)…`);
      const x = await gmPostJson(GAS_URL, { mode:'getXlsx', folderId:DRIVE_FOLDER_ID, baseName:XLSX_BASENAME, token:SHARED_SECRET||undefined });
      if (!x.ok) throw new Error('GAS getXlsx error: '+(x.error||'unknown'));
      const xlsxBlob = base64ToBlob(x.base64, x.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const xlsxName = x.name || (XLSX_BASENAME + '.xlsx');
      log(`Got ${xlsxName} (${(xlsxBlob.size/1024).toFixed(1)} KB)`);

      // 2) Upload to Shopee
      log('Uploading to Shopee /api/v1/upload/tasks…');
      await uploadToShopee(xlsxBlob, xlsxName);
      log('Upload OK. Monitoring latest "offer" export…');

      // 3) Poll for latest offer progress==100
      const { taskId } = await pollLatestOfferDone();
      log(`Download export task_id=${taskId}…`);
      const { blob: exportBlob, filename } = await downloadExport(taskId);
      const saveName = filename || `Shopee_${PICK_TYPE}_${taskId}.csv`;
      log(`Got export ${saveName} (${(exportBlob.size/1024).toFixed(1)} KB). Saving to Drive…`);

      // 4) Save back to Drive via GAS
      const saved = await gmPostJson(GAS_URL, {
        mode:'saveFile',
        folderId:DRIVE_FOLDER_ID,
        filename: saveName,
        mimeType: exportBlob.type || 'text/csv',
        base64: await blobToBase64(exportBlob),
        replaceIfExists: SAVE_REPLACE,
        token: SHARED_SECRET || undefined
      });
      if (!saved.ok) throw new Error('GAS saveFile error: '+(saved.error||'unknown'));
      log(`✅ Saved to Drive (fileId=${saved.fileId})${saved.replaced?' [replaced]':''}`);
    } catch (e) {
      log('❌ ' + (e?.message || String(e)));
      console.error(e);
    } finally {
      btn.disabled = false;
    }
  }

  /** ====== Shopee helpers ====== **/
  async function uploadToShopee(fileBlob, fileName){
    const fd = new FormData();
    fd.append('taskType','batch_get_custom_link');
    fd.append('file', new File([fileBlob], fileName, { type: fileBlob.type }));
    const res = await fetch(UPLOAD_URL, { method:'POST', credentials:'include', body: fd });
    const txt = await res.text();
    let j = null; try { j = JSON.parse(txt); } catch {}
    if (!res.ok) throw new Error(`Upload HTTP ${res.status}: ${txt}`);
    if (j && j.code !== 0) throw new Error(`Upload returned code ${j.code}: ${txt}`);
  }

  async function pollLatestOfferDone(){
    const start = Date.now();
    while (true) {
      const r = await fetch(LIST_URL, { credentials:'include' });
      if (!r.ok) throw new Error(`List HTTP ${r.status}`);
      const data = await r.json().catch(()=> ({}));
      const list = data?.data?.list || [];

      const offers = list.filter(x => x?.type === 'offer');
      if (offers.length) {
        offers.sort((a,b)=> (Date.parse(b.export_time||b.exportTime||0)||0) - (Date.parse(a.export_time||a.exportTime||0)||0));
        const latest = offers[0];
        log(`Latest offer: task_id=${latest.task_id}, progress=${latest.progress}%`);
        if (Number(latest.progress) === 100) return { taskId: latest.task_id };
      } else {
        log('No offer exports yet…');
      }
      if (Date.now() - start > POLL_TIMEOUT_MS) throw new Error('Timeout waiting for export completion');
      await sleep(POLL_INTERVAL_MS);
    }
  }

  function downloadExport(taskId){
    return new Promise((resolve, reject)=>{
      GM_xmlhttpRequest({
        method:'GET',
        url: DOWNLOAD_URL(taskId),
        responseType:'arraybuffer',
        onload:(res)=>{
          if (res.status >= 200 && res.status < 300 && res.response) {
            const headers = res.responseHeaders || '';
            const cd = /filename\*=UTF-8''([^;\r\n]+)/i.exec(headers) || /filename="?([^";\r\n]+)"?/i.exec(headers);
            const name = cd ? decodeURIComponent(cd[1]).replace(/[/\\:*?"<>|]+/g,'_') : null;
            const blob = new Blob([res.response], { type:'text/csv;charset=utf-8' });
            resolve({ blob, filename: name });
          } else reject(new Error('Download HTTP '+res.status));
        },
        onerror: ()=>reject(new Error('Network error while downloading'))
      });
    });
  }

  /** ====== GAS call (CORS-safe via GM_) ====== **/
  function gmPostJson(url, obj) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(obj),
        responseType: 'text',
        onload: (res) => {
          const text = res.responseText || '';
          try {
            const json = JSON.parse(text);
            resolve(json);
          } catch {
            reject(new Error(`Non-JSON from GAS (HTTP ${res.status}): ${text.slice(0, 200)}`));
          }
        },
        onerror: () => reject(new Error('Network error calling GAS')),
      });
    });
  }

  /** ====== misc helpers ====== **/
  function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
  function base64ToBlob(b64, mime){
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i=0;i<bytes.length;i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr.buffer], { type: mime || 'application/octet-stream' });
  }
  function blobToBase64(blob){
    return new Promise((resolve, reject)=>{
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result.split(',')[1]);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  }

})();

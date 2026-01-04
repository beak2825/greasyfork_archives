// ==UserScript==
// @name         Dasgar YT 1.1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skin uploader (URL/file), 512x512, KB cap, local mod-library + inject+save to agar.io account, editor upload button placed inside site editor modal (best-effort). No cheats.
// @match        *://agar.io/*
// @match        *://*.agar.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550236/Dasgar%20YT%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/550236/Dasgar%20YT%2011.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- Config ---------- */
  const MAX_SIZE_BYTES = 512 * 1024; // 512 KB upload UI cap
  const FINAL_SIZE = 512;            // final canvas size 512x512
  const LIB_KEY = 'dasgar_mod_skins_v1';
  const CACHED_KEY = 'dasgar_cached_skin_v1';

  /* ---------- Styles ---------- */
  GM_addStyle(`
    #dasgar_menu {
      position: fixed;
      top: 18px;
      right: 18px;
      width: 360px;
      z-index: 2147483647;
      background: rgba(12,12,14,0.94);
      color: #eaf8ff;
      padding: 12px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      font-size: 13px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6)
    }
    #dasgar_menu h3 { margin:0 0 8px 0; color:#7ef1c7; }
    #dasgar_preview { width:120px; height:120px; border-radius:50%; display:block; margin:8px auto; background:#222; object-fit:cover; border:6px solid #ff7700; }
    #dasgar_menu input[type="text"], #dasgar_menu input[type="number"], #dasgar_menu select {
      width:100%; padding:7px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); color:#fff;
    }
    #dasgar_menu input[type="file"]{ width:100%; margin-top:6px; }
    #dasgar_menu button { width:100%; padding:8px; border-radius:8px; border:none; background:#2b8cff; color:#fff; font-weight:700; cursor:pointer; margin-top:8px; }
    .das-row { display:flex; gap:8px; align-items:center; margin-top:8px; }
    .das-small { padding:6px 8px; border-radius:8px; border:none; background:#00aaff; color:#fff; cursor:pointer; }
    .skin-entry { display:flex; gap:8px; align-items:center; padding:6px; margin-top:6px; background: rgba(255,255,255,0.03); border-radius:8px; }
    .skin-entry img { width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid rgba(0,0,0,0.18); }
    #dasgar_editor_inject { position:absolute; right:18px; bottom:18px; z-index:2147483648; }
    #dasgar_status { margin-top:6px; color:#cfefff; font-size:12px; text-align:center; }
  `);

  /* ---------- UI Build ---------- */
  const menu = document.createElement('div');
  menu.id = 'dasgar_menu';
  menu.innerHTML = `
    <h3>Dasgar YT — Skins</h3>

    <label>Skin URL (direct image)</label>
    <input type="text" id="dasgar_url" placeholder="https://.../image.png">

    <label>Upload image (max 512 KB)</label>
    <input type="file" id="dasgar_file" accept="image/*">

    <canvas id="dasgar_preview" width="120" height="120"></canvas>

    <div class="das-row">
      <input type="color" id="dasgar_bg" value="#ffcc00" style="width:58px; height:36px; border-radius:6px; border:none;">
      <input type="color" id="dasgar_border" value="#ff7700" style="width:58px; height:36px; border-radius:6px; border:none;">
      <input type="number" id="dasgar_border_w" value="6" min="0" max="40" style="width:70px; padding:6px; border-radius:6px;">
      <select id="dasgar_size" style="flex:1; padding:6px; border-radius:6px;">
        <option value="512">512 px (final)</option>
        <option value="256">256 px</option>
        <option value="128">128 px</option>
      </select>
    </div>

    <button id="dasgar_convert">Convert & Add to Library</button>
    <button id="dasgar_apply_site" style="background:#32cc6b">Upload → Save to agar.io</button>

    <h4 style="margin-top:10px">Saved (mod library)</h4>
    <div id="dasgar_library"></div>

    <div id="dasgar_status">Load via URL or Upload → Convert → Save to library or save into agar.io.</div>
  `;
  document.body.appendChild(menu);

  // preview canvas
  const preview = document.getElementById('dasgar_preview');
  const pctx = preview.getContext('2d');

  const urlInput = document.getElementById('dasgar_url');
  const fileInput = document.getElementById('dasgar_file');
  const bgInput = document.getElementById('dasgar_bg');
  const borderInput = document.getElementById('dasgar_border');
  const borderWInput = document.getElementById('dasgar_border_w');
  const sizeSelect = document.getElementById('dasgar_size');
  const convertBtn = document.getElementById('dasgar_convert');
  const applySiteBtn = document.getElementById('dasgar_apply_site');
  const libDiv = document.getElementById('dasgar_library');
  const statusEl = document.getElementById('dasgar_status');

  /* ---------- State ---------- */
  let loadedImage = null;   // HTMLImageElement or HTMLCanvasElement used for preview
  let cachedFinal = null;   // canvas 512/256/... final result stored
  // helper: write status
  function setStatus(t){ statusEl.innerText = t; console.log('[DasgarSkin]', t); }

  /* ---------- Small helpers ---------- */
  function clearPreview(){ pctx.clearRect(0,0,preview.width, preview.height); pctx.fillStyle = '#333'; pctx.fillRect(0,0,preview.width, preview.height); }
  clearPreview();
  function drawPreviewFromImage(img){
    const s = preview.width;
    pctx.clearRect(0,0,s,s);
    pctx.save();
    pctx.beginPath(); pctx.arc(s/2,s/2,s/2,0,Math.PI*2); pctx.closePath(); pctx.clip();
    const scale = Math.max(s/img.width, s/img.height);
    const iw = img.width * scale, ih = img.height * scale;
    pctx.drawImage(img, s/2 - iw/2, s/2 - ih/2, iw, ih);
    pctx.restore();
    // border
    const bw = Math.max(0, Math.min(40, parseInt(borderWInput.value) || 0));
    if (bw > 0){
      pctx.beginPath(); pctx.arc(s/2,s/2, s/2 - bw/2,0,Math.PI*2); pctx.lineWidth = bw; pctx.strokeStyle = borderInput.value || '#ff7700'; pctx.stroke();
    }
    preview.style.background = bgInput.value;
  }

  /* ---------- load image from URL helper (tries multiple ways) ---------- */
  function loadImageFromURL(url){
    return new Promise((resolve,reject) => {
      if (!url) return reject(new Error('No URL'));
      // 1) direct load
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        // 2) try with crossOrigin anonymous
        const img2 = new Image();
        img2.crossOrigin = 'anonymous';
        img2.onload = () => resolve(img2);
        img2.onerror = () => {
          // 3) try fetch → blob (some servers permit)
          fetch(url).then(r => {
            if (!r.ok) throw new Error('fetch failed');
            return r.blob();
          }).then(blob => {
            const obj = URL.createObjectURL(blob);
            const img3 = new Image();
            img3.onload = () => { URL.revokeObjectURL(obj); resolve(img3); };
            img3.onerror = () => { URL.revokeObjectURL(obj); reject(new Error('blob load failed')); };
            img3.src = obj;
          }).catch(err => {
            reject(err);
          });
        };
        img2.src = url;
      };
      img.src = url;
    });
  }

  /* ---------- file input handling ---------- */
  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > MAX_SIZE_BYTES){
      setStatus('File too large (max ' + Math.round(MAX_SIZE_BYTES/1024) + ' KB).');
      return;
    }
    setStatus('Loading file for preview...');
    const obj = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      loadedImage = img;
      drawPreviewFromImage(img);
      setStatus('File ready for conversion.');
      URL.revokeObjectURL(obj);
    };
    img.onerror = () => {
      setStatus('File could not be loaded.');
      URL.revokeObjectURL(obj);
    };
    img.src = obj;
  });

  /* ---------- URL input handling ---------- */
  urlInput.addEventListener('change', async () => {
    const u = urlInput.value.trim();
    if (!u) return;
    setStatus('Loading image from URL...');
    try {
      const img = await loadImageFromURL(u);
      loadedImage = img;
      drawPreviewFromImage(img);
      setStatus('URL loaded for preview.');
    } catch (err) {
      console.warn(err);
      setStatus('Failed to load URL (CORS or blocked). Try download & upload file instead.');
    }
  });

  /* ---------- convert to final canvas (512/256/128) ---------- */
  function makeFinalCanvas(srcImg, size, borderW, borderColor, bgColor){
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d');
    // fill bg
    ctx.fillStyle = bgColor || '#fff'; ctx.fillRect(0,0,size,size);
    // circular clip and draw
    ctx.save();
    ctx.beginPath(); ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI*2); ctx.closePath(); ctx.clip();
    if (srcImg instanceof HTMLCanvasElement) ctx.drawImage(srcImg, 0, 0, size, size);
    else {
      const scale = Math.max(size / srcImg.width, size / srcImg.height);
      const iw = srcImg.width * scale, ih = srcImg.height * scale;
      ctx.drawImage(srcImg, size/2 - iw/2, size/2 - ih/2, iw, ih);
    }
    ctx.restore();
    // stroke border inside circle
    const bw = Math.max(0, Math.min(40, borderW || 0));
    if (bw > 0) {
      ctx.beginPath(); ctx.arc(size/2, size/2, size/2 - bw/2 - 1, 0, Math.PI*2);
      ctx.lineWidth = bw; ctx.strokeStyle = borderColor || '#ff7700'; ctx.stroke();
    }
    return c;
  }

  /* ---------- library handling ---------- */
  function saveToLibrary(name, dataURL){
    const lib = JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
    lib.push({ name: name || ('Skin ' + (lib.length+1)), data: dataURL, ts: Date.now() });
    try { localStorage.setItem(LIB_KEY, JSON.stringify(lib)); setStatus('Saved to mod library.'); renderLibrary(); } catch (e) { setStatus('Save failed (storage).'); }
  }

  function renderLibrary(){
    libDiv.innerHTML = '';
    const lib = JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
    if (!lib.length) { libDiv.innerHTML = '<div style="color:#bcd7ee;font-size:12px">No saved skins yet.</div>'; return; }
    lib.forEach((s, idx) => {
      const row = document.createElement('div'); row.className = 'skin-entry';
      row.innerHTML = `<div style="display:flex;align-items:center;gap:8px"><img src="${s.data}"><div style="font-size:12px">${s.name}</div></div>
        <div style="display:flex;gap:6px">
          <button data-idx="${idx}" class="das-row use">Use</button>
          <button data-idx="${idx}" class="das-row inject" style="background:#32cc6b">Upload→Agar</button>
          <button data-idx="${idx}" class="das-row del" style="background:#ff4d4d">Del</button>
        </div>`;
      libDiv.appendChild(row);
    });

    // attach events
    libDiv.querySelectorAll('button.use').forEach(b => b.addEventListener('click', e => {
      const i = +e.currentTarget.dataset.idx;
      const lib = JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
      const item = lib[i];
      if (item) {
        // set preview & cachedFinal
        loadedImage = new Image();
        loadedImage.onload = () => { drawPreviewFromImage(loadedImage); setStatus('Loaded saved skin in preview.'); };
        loadedImage.src = item.data;
        cachedFinal = null;
      }
    }));

    libDiv.querySelectorAll('button.del').forEach(b => b.addEventListener('click', e => {
      const i = +e.currentTarget.dataset.idx;
      const lib = JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
      lib.splice(i,1);
      localStorage.setItem(LIB_KEY, JSON.stringify(lib));
      renderLibrary();
      setStatus('Deleted saved skin.');
    }));

    libDiv.querySelectorAll('button.inject').forEach(b => b.addEventListener('click', async (e) => {
      const i = +e.currentTarget.dataset.idx;
      const lib = JSON.parse(localStorage.getItem(LIB_KEY) || '[]');
      const item = lib[i];
      if (!item) return;
      // load image element
      try {
        const img = new Image();
        img.onload = async () => {
          // create final canvas from saved data (should already be final, but ensure proper size)
          const finalSize = parseInt(sizeSelect.value,10) || FINAL_SIZE;
          const canvas = makeFinalCanvas(img, finalSize, parseInt(borderWInput.value,10) || 0, borderInput.value, bgInput.value);
          cachedFinal = canvas;
          setStatus('Prepared to inject into site editor. Attempting injection & Save...');
          const ok = await injectIntoEditorAndSave(canvas);
          setStatus(ok ? 'Attempt to save on site done (check site).' : 'Failed to find site editor or Save button.');
        };
        img.src = item.data;
      } catch (err) { console.warn(err); setStatus('Error preparing injection.'); }
    }));
  }

  /* ---------- Convert button => convert current preview/loaded image and save to library ---------- */
  convertBtn.addEventListener('click', () => {
    if (!loadedImage) { setStatus('No image to convert — upload or URL first.'); return; }
    const size = parseInt(sizeSelect.value,10) || FINAL_SIZE;
    const bw = parseInt(borderWInput.value,10) || 0;
    const bc = borderInput.value;
    const bgc = bgInput.value;
    const finalCanvas = makeFinalCanvas(loadedImage, size, bw, bc, bgc);
    cachedFinal = finalCanvas;
    // show final in preview (scaled)
    const tmp = new Image();
    tmp.onload = () => { pctx.clearRect(0,0,preview.width, preview.height); pctx.drawImage(tmp,0,0,preview.width,preview.height); setStatus('Converted final skin (ready).'); };
    tmp.src = finalCanvas.toDataURL('image/png');
    // Save to library
    saveToLibrary('Skin ' + (new Date()).toLocaleTimeString(), finalCanvas.toDataURL('image/png'));
    // cache small saved (<=256) into local quick key
    try { if (size <= 256) localStorage.setItem(CACHED_KEY, finalCanvas.toDataURL('image/png')); } catch(e){}
  });

  /* ---------- initial render library ---------- */
  renderLibrary();

  /* ---------- Editor injection: find the editor canvas and container ---------- */
  function findEditorCanvas() {
    const canvases = Array.from(document.querySelectorAll('canvas')).filter(c => {
      try {
        const r = c.getBoundingClientRect();
        return r.width > 160 && r.height > 160 && r.top > 0 && r.left > 0 && getComputedStyle(c).visibility !== 'hidden';
      } catch (e) { return false; }
    });
    if (!canvases.length) return null;
    // pick canvas closest to center
    const cx = innerWidth/2, cy = innerHeight/2;
    canvases.sort((a,b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const da = Math.hypot((ra.left+ra.width/2)-cx, (ra.top+ra.height/2)-cy);
      const db = Math.hypot((rb.left+rb.width/2)-cx, (rb.top+rb.height/2)-cy);
      return da - db;
    });
    return canvases[0];
  }

  function findEditorContainer(candidateCanvas){
    if (!candidateCanvas) return null;
    let anc = candidateCanvas.parentElement;
    for (let i=0;i<10 && anc; i++){
      const style = getComputedStyle(anc);
      // heuristics for modal: white-ish background, large width and visible
      if ((/rgba?\(255,\s*255,\s*255/.test(style.backgroundColor) || style.backgroundColor === 'white' || style.backgroundColor.indexOf('rgb') >= 0) &&
          anc.clientWidth > 300) {
        return anc;
      }
      // also check if ancestor contains a "Save" button text
      if (anc.querySelector && Array.from(anc.querySelectorAll('button,a,input')).some(el=>/save|upload|create/i.test((el.innerText||el.value||el.title||'').trim()))) {
        return anc;
      }
      anc = anc.parentElement;
    }
    // fallback: return the canvas parent
    return candidateCanvas.parentElement || document.body;
  }

  /* ---------- injecting our Upload UI into site editor (bottom-right of editor) ---------- */
  let injectedEditorPanel = null;
  function injectUploadPanelIntoEditor(){
    try {
      const canvas = findEditorCanvas();
      if (!canvas) return null;
      const container = findEditorContainer(canvas);
      if (!container) return null;
      // if panel already exists and is inside same container, do nothing
      if (injectedEditorPanel && injectedEditorPanel.parentElement === container) return injectedEditorPanel;
      // remove previous if in different place
      if (injectedEditorPanel && injectedEditorPanel.parentElement) injectedEditorPanel.parentElement.removeChild(injectedEditorPanel);
      // create panel
      const panel = document.createElement('div');
      panel.id = 'dasgar_editor_inject';
      panel.style.position = 'absolute';
      panel.style.right = '18px';
      panel.style.bottom = '18px';
      panel.style.background = 'rgba(0,0,0,0.45)';
      panel.style.padding = '8px';
      panel.style.borderRadius = '8px';
      panel.style.color = '#fff';
      panel.style.zIndex = 2147483648;
      panel.innerHTML = `
        <input type="file" id="dasgar_editor_file" accept="image/*" style="width:140px"><br>
        <button id="dasgar_editor_convert" class="das-small" style="margin-top:6px;padding:6px 10px;background:#2b8cff">Convert & Inject</button>
      `;
      // append
      container.style.position = container.style.position || 'relative';
      container.appendChild(panel);
      injectedEditorPanel = panel;

      // hookup file input and button
      const editorFile = panel.querySelector('#dasgar_editor_file');
      const editorBtn = panel.querySelector('#dasgar_editor_convert');

      editorFile.addEventListener('change', (ev) => {
        const f = ev.target.files && ev.target.files[0];
        if (!f) return;
        if (f.size > MAX_SIZE_BYTES) { setStatus('Editor upload too large (max ' + Math.round(MAX_SIZE_BYTES/1024) + ' KB).'); return; }
        const obj = URL.createObjectURL(f);
        const img = new Image();
        img.onload = () => { loadedImage = img; drawPreviewFromImage(img); setStatus('Editor file loaded. Click Convert & Inject to place into editor.'); URL.revokeObjectURL(obj); };
        img.onerror = () => { setStatus('Editor file load failed.'); URL.revokeObjectURL(obj); };
        img.src = obj;
      });

      editorBtn.addEventListener('click', async () => {
        if (!loadedImage && !cachedFinal) { setStatus('No image to inject — upload or select from library.'); return; }
        // make final canvas from loadedImage or cachedFinal
        const src = loadedImage || (cachedFinal ? (()=>{ const tmp = document.createElement('canvas'); tmp.width = cachedFinal.width; tmp.height = cachedFinal.height; tmp.getContext('2d').drawImage(cachedFinal,0,0); return tmp; })() : null);
        if (!src) { setStatus('Nothing to inject.'); return; }
        const size = parseInt(sizeSelect.value,10) || FINAL_SIZE;
        const finalCanvas = makeFinalCanvas(src, size, parseInt(borderWInput.value,10)||0, borderInput.value, bgInput.value);
        cachedFinal = finalCanvas;
        // try injecting to editor canvas
        const ok = await injectIntoEditorAndSave(finalCanvas);
        setStatus(ok ? 'Injected & attempted Save on site (check site).' : 'Could not inject / find Save; try opening skin editor.');
      });

      return panel;
    } catch (err) {
      console.warn('injectEditor error', err);
      return null;
    }
  }

  // observe DOM for canvas/modal changes and inject panel when editor opens
  const domObserver = new MutationObserver(() => {
    try { injectUploadPanelIntoEditor(); } catch(e){}
  });
  domObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

  /* ---------- attempt to inject a final canvas into the editor canvas & click Save ---------- */
  async function injectIntoEditorAndSave(finalCanvas){
    try {
      const editorCanvas = findEditorCanvas();
      if (!editorCanvas) { console.warn('No editor canvas'); return false; }
      // try to draw into editor canvas context
      try {
        const ectx = editorCanvas.getContext('2d');
        ectx.save();
        // compute destination square for draw
        const dst = Math.min(editorCanvas.width, editorCanvas.height);
        const dx = (editorCanvas.width - dst) / 2, dy = (editorCanvas.height - dst) / 2;
        // clip circle area if possible
        try { ectx.beginPath(); ectx.arc(editorCanvas.width/2, editorCanvas.height/2, dst/2 - 1, 0, Math.PI*2); ectx.closePath(); ectx.clip(); } catch(e){}
        ectx.drawImage(finalCanvas, dx, dy, dst, dst);
        ectx.restore();
        setStatus('Injected into the editor canvas.');
      } catch (err) {
        console.warn('draw into editor failed', err);
        return false;
      }

      // find a visible Save button (heuristic)
      const buttons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')).filter(el => {
        try {
          if (el.offsetParent === null) return false; // not visible
          const txt = (el.innerText || el.value || el.title || '').trim().toLowerCase();
          return /save|upload|create|apply|convert/i.test(txt);
        } catch(e){ return false; }
      });
      // pick the Save-looking one closest to editorCanvas
      let saveBtn = null;
      if (buttons.length) {
        // score by proximity to editor canvas
        const rc = editorCanvas.getBoundingClientRect();
        let best = Infinity;
        buttons.forEach(b => {
          const rb = b.getBoundingClientRect();
          const dist = Math.hypot((rb.left+rb.width/2)-(rc.left+rc.width/2), (rb.top+rb.height/2)-(rc.top+rc.height/2));
          if (dist < best) { best = dist; saveBtn = b; }
        });
      }

      if (saveBtn) {
        // click it programmatically (safest: dispatch MouseEvents)
        setStatus('Found Save button — clicking to save to account (you must be logged in).');
        saveBtn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
        await new Promise(r => setTimeout(r, 80));
        saveBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        await new Promise(r => setTimeout(r, 40));
        saveBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        saveBtn.click();
        return true;
      } else {
        setStatus('No Save button found near editor — either site changed UI or editor is not open.');
        return false;
      }
    } catch (e) {
      console.warn('inject+save error', e); setStatus('Injection failed: ' + (e.message||e)); return false;
    }
  }

  /* ---------- top-level Apply button tries to inject cachedFinal or ask user steps ---------- */
  applySiteBtn.addEventListener('click', async () => {
    if (!cachedFinal) {
      if (!loadedImage) { setStatus('No skin prepared — use Upload or URL then Convert first.'); return; }
      // auto convert to final using chosen size & border
      const size = parseInt(sizeSelect.value,10) || FINAL_SIZE;
      cachedFinal = makeFinalCanvas(loadedImage, size, parseInt(borderWInput.value,10) || 0, borderInput.value, bgInput.value);
    }
    setStatus('Attempting to inject & save to agar.io (site editor must be open).');
    const ok = await injectIntoEditorAndSave(cachedFinal);
    setStatus(ok ? 'Attempt done — check site/editor and Save dialog.' : 'Could not inject — open the site skin editor and try again.');
  });

  /* ---------- try restore last cached small skin for preview ---------- */
  (function restoreCached(){
    try {
      const s = localStorage.getItem(CACHED_KEY);
      if (s) {
        const img = new Image(); img.onload = ()=>{ loadedImage = img; drawPreviewFromImage(img); setStatus('Restored cached small skin.'); }; img.src = s;
      }
    } catch(e){}
  })();

  /* ---------- wire color/border live preview (if loadedImage) ---------- */
  bgInput.addEventListener('input', ()=>{ if (loadedImage) drawPreviewFromImage(loadedImage); });
  borderInput.addEventListener('input', ()=>{ if (loadedImage) drawPreviewFromImage(loadedImage); });
  borderWInput.addEventListener('input', ()=>{ if (loadedImage) drawPreviewFromImage(loadedImage); });

  /* ---------- initial attempt to inject panel if editor already open ---------- */
  setTimeout(injectUploadPanelIntoEditor, 900);
  // and periodically try (so when user opens editor UI we inject)
  setInterval(injectUploadPanelIntoEditor, 1500);

  /* ---------- final console message ---------- */
  console.log('[Dasgar YT Skins v1.3] loaded — use URL/file → Convert & Add to Library → Upload→Save to agar.io (editor must be open & you must be signed in).');

})();
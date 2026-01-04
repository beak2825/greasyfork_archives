// ==UserScript==
// @name         Manga Colorizer Download Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Collect data:image/webp;base64 images. First -> cover.webp. Other images -> Chapter.zip (inner). Outer zip named from site title (fallback nameless). Option to download individually instead of zipping.
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/551196/Manga%20Colorizer%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551196/Manga%20Colorizer%20Download%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_PREFIX = 'image';
  const DEFAULT_PADDING = 3;
  const INNER_ZIP_NAME = 'Chapter.zip'; // required inner zip name
  const ZIP_COMPRESSION = 'STORE'; // store for speed & reliability

  /* ---------- Helpers ---------- */
  function createEl(tag, attrs = {}, css = {}) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    Object.assign(el.style, css);
    return el;
  }
  function padNumber(n, width) {
    const s = String(n);
    return s.length >= width ? s : '0'.repeat(width - s.length) + s;
  }
  function dataUrlToUint8Array(dataUrl) {
    const base64 = dataUrl.split(',')[1] || '';
    const binary = atob(base64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return arr;
  }
  function sanitizeFilename(name, fallback = 'nameless') {
    if (!name || typeof name !== 'string') return fallback;
    let s = name.trim().replace(/\s+/g, ' ');
    s = s.replace(/[\/\\?%*:|"<>]/g, '-');
    if (s.length > 160) s = s.slice(0, 160).trim();
    if (!s) return fallback;
    return s;
  }
  async function blobToArrayBuffer(blob) {
    return await blob.arrayBuffer();
  }

  /* ---------- Title search ---------- */
  function findSiteTitle() {
    try {
      const selOrder = [
        () => document.querySelector('div#info > h1.title')?.textContent,
        () => document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
        () => document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
        () => document.querySelector('.title')?.textContent,
        () => document.querySelector('h1')?.textContent,
        () => document.title,
      ];
      for (const fn of selOrder) {
        const t = fn();
        if (t && typeof t === 'string' && t.trim()) return sanitizeFilename(t.trim());
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  /* ---------- Detect only webp data URLs ---------- */
  function extractWebpFromImgs() {
    const found = [];
    Array.from(document.images || []).forEach(img => {
      const src = (img.currentSrc || img.src || '').trim();
      if (src.toLowerCase().startsWith('data:image/webp;base64,')) found.push(src);
    });
    return found;
  }
  function extractWebpFromBackgrounds() {
    const set = new Set();
    document.querySelectorAll('*').forEach(el => {
      try {
        const style = window.getComputedStyle(el);
        if (!style) return;
        const bg = style.getPropertyValue('background-image');
        if (bg && bg !== 'none') {
          const re = /url\(["']?(.*?)["']?\)/g;
          let m;
          while ((m = re.exec(bg)) !== null) {
            const raw = (m[1] || '').trim();
            if (raw.toLowerCase().startsWith('data:image/webp;base64,')) set.add(raw);
          }
        }
      } catch (e) {}
    });
    return Array.from(set);
  }
  function pageIsSingleWebpDataImg() {
    const res = [];
    try {
      if (document.body && document.body.childElementCount === 1) {
        const only = document.body.firstElementChild;
        if (only && only.tagName === 'IMG' && only.src) {
          const s = only.src.trim();
          if (s.toLowerCase().startsWith('data:image/webp;base64,')) res.push(s);
        }
      }
      if (typeof location.href === 'string' && location.href.toLowerCase().startsWith('data:image/webp;base64,')) {
        res.push(location.href.trim());
      }
    } catch (e) {}
    return res;
  }
  function collectOnlyWebpDataUrls() {
    const s = new Set();
    extractWebpFromImgs().forEach(u => s.add(u));
    extractWebpFromBackgrounds().forEach(u => s.add(u));
    pageIsSingleWebpDataImg().forEach(u => s.add(u));
    return Array.from(s);
  }

  /* ---------- UI ---------- */
  const root = createEl('div', { id: 'nested-zip-root' }, {
    position: 'fixed', right: '18px', bottom: '18px', zIndex: 2147483647, fontFamily: 'Inter, Roboto, Arial, sans-serif'
  });

  const btn = createEl('div', { title: 'Nested Zip / Download Individually' }, {
    width: '56px', height: '56px', borderRadius: '12px', background: '#0b6ad1',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 6px 18px rgba(0,0,0,0.18)'
  });
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" fill="white" aria-hidden="true"><path d="M5 20h14v-2H5v2zM11 4h2v8h3l-4 4-4-4h3V4z"/></svg>`;

  const panel = createEl('div', { id: 'nested-zip-panel' }, {
    position: 'absolute', right: '70px', bottom: '0px', width: '520px', maxWidth: 'calc(100vw - 120px)',
    borderRadius: '10px', background: '#fff', color: '#222', boxShadow: '0 8px 36px rgba(0,0,0,0.18)',
    padding: '12px', display: 'none', zIndex: 2147483648, fontSize: '13px'
  });

  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:8px">WebP Collector — Nested Zip or Download</div>
    <div id="nested-zip-info" style="margin-bottom:8px;color:#444">Ready</div>

    <div style="display:flex;gap:8px;margin-bottom:8px">
      <label style="display:flex;align-items:center;gap:6px;"><input type="radio" name="we-mode" value="nested" checked/> Nested Zip</label>
      <label style="display:flex;align-items:center;gap:6px;"><input type="radio" name="we-mode" value="individual"/> Download Individually</label>
    </div>

    <div style="display:flex;gap:8px">
      <button id="nested-zip-go" style="flex:1;padding:8px;border-radius:8px;border:none;cursor:pointer;background:#0b6ad1;color:#fff">Start (Zip / Download)</button>
      <button id="nested-zip-scan" style="padding:8px;border-radius:8px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer">Scan</button>
    </div>

    <div style="margin-top:10px;font-size:12px;color:#666">
      Prefix for other images: <input id="nested-zip-prefix" value="${DEFAULT_PREFIX}" style="width:120px;padding:4px;border-radius:4px;border:1px solid #ddd;margin-left:6px"/>
      &nbsp; Padding:
      <input id="nested-zip-pad" value="${DEFAULT_PADDING}" style="width:48px;padding:4px;border-radius:4px;border:1px solid #ddd;margin-left:6px"/>
    </div>

    <div id="nested-zip-list" style="margin-top:10px;max-height:240px;overflow:auto;font-size:12px;color:#333"></div>

    <div style="margin-top:8px;font-size:12px;color:#555">
      Notes: First detected data:image/webp;base64 is saved as <strong>cover.webp</strong>. Inner zip will be <strong>${INNER_ZIP_NAME}</strong>. Outer zip name is taken from site (or "nameless").
    </div>
  `;

  root.appendChild(btn);
  root.appendChild(panel);
  document.body.appendChild(root);

  // Toggle panel when clicking button
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    renderScan();
  });

  // Collapse panel on outside click
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!root.contains(target)) {
      panel.style.display = 'none';
    }
  });

  // Prevent clicks inside panel from closing
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const infoEl = panel.querySelector('#nested-zip-info');
  const listEl = panel.querySelector('#nested-zip-list');
  const scanBtn = panel.querySelector('#nested-zip-scan');
  const goBtn = panel.querySelector('#nested-zip-go');
  const prefixInput = panel.querySelector('#nested-zip-prefix');
  const padInput = panel.querySelector('#nested-zip-pad');

  let lastFound = [];

  function renderScan() {
    const arr = collectOnlyWebpDataUrls();
    lastFound = arr;
    infoEl.textContent = `${arr.length} webp data URL(s) found (first will be cover.webp)`;
    listEl.innerHTML = arr.map((u, i) => {
      const short = u.length > 140 ? u.slice(0, 120) + '... (truncated)' : u;
      return `<div style="padding:6px;border-bottom:1px dashed #eee;font-family:monospace;font-size:12px;"><strong>#${i+1}</strong> ${short}</div>`;
    }).join('') || '<div style="color:#666">No matching webp data URLs found</div>';
  }
  scanBtn.addEventListener('click', (e) => { e.stopPropagation(); renderScan(); });

  /* ---------- Flows ---------- */

  // 1) Nested zip: make inner Chapter.zip with others, outer zip containing cover.webp + Chapter.zip, named by site.
  async function createNestedZip(urls, prefix, padding) {
    if (!urls || !urls.length) { alert('No data:image/webp;base64 images detected.'); return; }

    goBtn.disabled = true;
    scanBtn.disabled = true;
    infoEl.textContent = `Preparing ${urls.length} files...`;

    // Build inner zip (Chapter.zip) with all except first
    const innerZip = new JSZip();
    if (urls.length > 1) {
      let counter = 1;
      for (let i = 1; i < urls.length; i++) {
        infoEl.textContent = `Adding to inner (${i}/${urls.length-1})...`;
        try {
          const arr = dataUrlToUint8Array(urls[i]);
          const filename = `${prefix}_${padNumber(counter, padding)}.webp`;
          innerZip.file(filename, arr, { binary: true });
          counter++;
        } catch (e) {
          console.warn('Failed to add to inner zip', i, e);
        }
        await new Promise(r => setTimeout(r, 20));
      }
    } else {
      infoEl.textContent = 'No other images — inner zip will be empty (0 files).';
    }

    infoEl.textContent = `Generating inner "${INNER_ZIP_NAME}"...`;
    let innerBlob;
    try {
      innerBlob = await innerZip.generateAsync({ type: 'blob', compression: ZIP_COMPRESSION }, (meta) => {
        infoEl.textContent = `Inner zip ${meta.percent.toFixed(0)}%`;
      });
    } catch (e) {
      console.error('Failed to generate inner zip', e);
      alert('Failed to create inner zip: ' + (e && e.message ? e.message : e));
      goBtn.disabled = false;
      scanBtn.disabled = false;
      return;
    }
    await new Promise(r => setTimeout(r, 60));

    // Outer zip: cover.webp + Chapter.zip
    const outerZip = new JSZip();

    infoEl.textContent = 'Adding cover.webp to outer zip...';
    try {
      const arrCover = dataUrlToUint8Array(urls[0]);
      outerZip.file('cover.webp', arrCover, { binary: true });
    } catch (e) {
      console.warn('Failed to add cover', e);
      alert('Failed to add cover image into outer zip: ' + (e && e.message ? e.message : e));
    }

    infoEl.textContent = `Adding ${INNER_ZIP_NAME} to outer zip...`;
    try {
      const innerArrayBuf = await blobToArrayBuffer(innerBlob);
      outerZip.file(INNER_ZIP_NAME, innerArrayBuf, { binary: true });
    } catch (e) {
      console.error('Failed to add inner zip to outer zip', e);
      alert('Failed to include inner zip in outer zip: ' + (e && e.message ? e.message : e));
      goBtn.disabled = false;
      scanBtn.disabled = false;
      return;
    }

    // Find outer filename from site, fallback to nameless
    let titleName = findSiteTitle();
    if (!titleName) titleName = 'nameless';
    const outerFilename = `${titleName}.zip`;

    infoEl.textContent = `Generating outer zip "${outerFilename}"...`;
    try {
      const outerBlob = await outerZip.generateAsync({ type: 'blob', compression: ZIP_COMPRESSION }, (meta) => {
        infoEl.textContent = `Outer zip ${meta.percent.toFixed(0)}%`;
      });
      saveAs(outerBlob, outerFilename);
      infoEl.textContent = `Saved ${outerFilename} (cover + ${INNER_ZIP_NAME})`;
      setTimeout(() => alert(`Saved ${outerFilename}`), 200);
    } catch (e) {
      console.error('Failed to generate outer zip', e);
      alert('Failed to create outer zip: ' + (e && e.message ? e.message : e));
    } finally {
      goBtn.disabled = false;
      scanBtn.disabled = false;
    }
  }

  // 2) Download individually: cover.webp then prefix_001.webp etc.
  async function downloadIndividually(urls, prefix, padding) {
    if (!urls || !urls.length) { alert('No data:image/webp;base64 images detected.'); return; }
    goBtn.disabled = true;
    scanBtn.disabled = true;
    infoEl.textContent = `Preparing ${urls.length} files for download...`;

    for (let i = 0; i < urls.length; i++) {
      const idx = i + 1;
      try {
        const dataUrl = urls[i];
        const arr = dataUrlToUint8Array(dataUrl);
        const blob = new Blob([arr], { type: 'image/webp' });
        const filename = i === 0 ? 'cover.webp' : `${prefix}_${padNumber(i, padding)}.webp`;
        infoEl.textContent = `Downloading ${filename} (${idx}/${urls.length})`;
        // download via temporary anchor
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 6000);
        await new Promise(r => setTimeout(r, 350)); // allow browser to process
      } catch (e) {
        console.warn('Failed to download', i, e);
      }
    }

    infoEl.textContent = `Downloaded ${urls.length} files individually.`;
    setTimeout(() => alert(`Downloaded ${urls.length} images individually.`), 200);
    goBtn.disabled = false;
    scanBtn.disabled = false;
  }

  // Start button handler: collapse UI immediately, then run chosen flow
  goBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    // collapse panel immediately
    panel.style.display = 'none';

    lastFound = collectOnlyWebpDataUrls();
    if (!lastFound.length) { alert('No data:image/webp;base64 images found on this page.'); return; }

    const prefix = (prefixInput.value || DEFAULT_PREFIX).trim() || DEFAULT_PREFIX;
    let padding = parseInt(padInput.value, 10);
    if (!Number.isFinite(padding) || padding < 1) padding = DEFAULT_PADDING;

    const mode = panel.querySelector('input[name="we-mode"]:checked')?.value || 'nested';

    if (mode === 'nested') {
      const proceed = confirm(`Nested mode: First will be cover.webp, others will be placed into "${INNER_ZIP_NAME}" inside outer zip named from the site (or "nameless"). Continue?`);
      if (!proceed) return;
      await createNestedZip(lastFound, prefix, padding);
    } else {
      const proceed = confirm(`Download individually: First will be cover.webp, others will be named ${prefix}_###.webp. Continue?`);
      if (!proceed) return;
      await downloadIndividually(lastFound, prefix, padding);
    }
  });

  // initial scan
  renderScan();

})();
// ==UserScript==
// @name         HLS Download Button (no-DRM)
// @namespace    hls-dl-btn
// @version      1.2
// @author       sharmanhall
// @description  Adds a Download button for HLS (.m3u8) streams; streams segments to disk. Falls back to ffmpeg cmd if encrypted.
// @match        *://*/*
// @match        *://*.tnmr.org/*
// @match        *://tnmr.org/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550536/HLS%20Download%20Button%20%28no-DRM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550536/HLS%20Download%20Button%20%28no-DRM%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- UI ----------
  GM_addStyle(`
    #hlsdl-panel{position:fixed;right:16px;bottom:16px;z-index:999999;font-family:system-ui,Segoe UI,Arial,sans-serif}
    #hlsdl-btn{background:#1bd760;color:#000;border:0;border-radius:999px;padding:10px 14px;
      font-weight:700;box-shadow:0 6px 16px rgba(0,0,0,.25);cursor:pointer}
    #hlsdl-btn:hover{filter:brightness(0.95)}
    #hlsdl-log{position:fixed;right:16px;bottom:64px;width:340px;max-height:40vh;overflow:auto;
      background:#111;color:#0f0;border:1px solid #333;border-radius:10px;padding:10px;font:12px/1.35 ui-monospace,Menlo,monospace;display:none;white-space:pre-wrap}
    #hlsdl-progress{height:8px;background:#2a2a2a;border-radius:6px;overflow:hidden;margin-top:8px}
    #hlsdl-bar{height:100%;width:0%;background:linear-gradient(90deg,#1bd760,#15b34c)}
  `);

  const panel = document.createElement('div');
  panel.id = 'hlsdl-panel';
  panel.innerHTML = `
    <button id="hlsdl-btn">⬇ Download HLS</button>
    <div id="hlsdl-log"><div id="hlsdl-lines"></div><div id="hlsdl-progress"><div id="hlsdl-bar"></div></div></div>
  `;
  document.documentElement.appendChild(panel);

  const logBox = panel.querySelector('#hlsdl-log');
  const lines = panel.querySelector('#hlsdl-lines');
  const bar = panel.querySelector('#hlsdl-bar');

  function log(msg, isErr = false) {
    logBox.style.display = 'block';
    const p = document.createElement('div');
    p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    if (isErr) p.style.color = '#f55';
    lines.appendChild(p);
    lines.scrollTop = lines.scrollHeight;
  }
  function setProgress(pct) { bar.style.width = `${Math.max(0, Math.min(100, pct))}%`; }

  // ---------- Capture m3u8 URLs seen on the page ----------
  const seen = new Set();
  let lastM3U8 = '';

  // 1) anchors in DOM
  const scanDOM = () => {
    document.querySelectorAll('a[href*=".m3u8"]').forEach(a => {
      try {
        const u = new URL(a.href, location.href).href;
        if (!seen.has(u)) { seen.add(u); lastM3U8 = u; }
      } catch {}
    });
  };
  const mo = new MutationObserver(scanDOM);
  mo.observe(document.documentElement, { childList: true, subtree: true });
  scanDOM();

  // 2) intercept fetch
  const origFetch = window.fetch;
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url);
    if (url && /\.m3u8(\b|[?#])/i.test(url)) { lastM3U8 = new URL(url, location.href).href; seen.add(lastM3U8); }
    return origFetch.apply(this, arguments);
  };

  // 3) intercept XHR
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    try {
      if (url && /\.m3u8(\b|[?#])/i.test(url)) {
        const u = new URL(url, location.href).href;
        lastM3U8 = u; seen.add(u);
      }
    } catch {}
    return origOpen.apply(this, arguments);
  };

  // ---------- Helpers ----------
  const gmText = (url, headers = {}) => new Promise((res, rej) => {
    GM_xmlhttpRequest({ method: 'GET', url, headers, onload: r => r.status >= 200 && r.status < 300 ? res(r.responseText) : rej(new Error(`HTTP ${r.status}`)), onerror: e => rej(e) });
  });
  const gmAB = (url, headers = {}) => new Promise((res, rej) => {
    GM_xmlhttpRequest({ method: 'GET', url, headers, responseType: 'arraybuffer', onload: r => r.status >= 200 && r.status < 300 ? res(r.response) : rej(new Error(`HTTP ${r.status}`)), onerror: e => rej(e) });
  });
  const resolveURL = (base, rel) => new URL(rel, base).href;

  function pickFileName(m3u8Url, ext = 'ts') {
    try {
      const u = new URL(m3u8Url);
      const host = u.hostname.replace(/^www\./,'').replace(/[^a-z0-9.-]/gi,'_');
      const stem = (u.pathname.split('/').pop() || 'stream').replace(/\.m3u8.*$/i,'');
      return `${host}_${stem}.${ext}`;
    } catch { return `hls_${Date.now()}.${ext}`; }
  }

  function parseMaster(playlist, baseURL) {
    // returns highest BANDWIDTH variant URL
    const lines = playlist.split(/\r?\n/);
    let best = { bw: -1, url: '' };
    for (let i=0;i<lines.length;i++) {
      if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
        const bw = /BANDWIDTH=(\d+)/.exec(lines[i]);
        const next = lines[i+1] && lines[i+1].trim();
        if (next && !next.startsWith('#')) {
          const cand = resolveURL(baseURL, next);
          const bwi = bw ? parseInt(bw[1],10) : 0;
          if (bwi > best.bw) best = { bw: bwi, url: cand };
        }
      }
    }
    return best.url;
  }

  function parseMedia(playlist, baseURL) {
    const lines = playlist.split(/\r?\n/);
    const segs = [];
    let initURI = null;
    let encrypted = false;

    for (let i=0;i<lines.length;i++) {
      const L = lines[i].trim();
      if (!L) continue;
      if (L.startsWith('#EXT-X-KEY') && !/METHOD=NONE/.test(L)) encrypted = true;
      if (L.startsWith('#EXT-X-MAP')) {
        const m = /URI="([^"]+)"/.exec(L);
        if (m) initURI = resolveURL(baseURL, m[1]);
      }
      if (L.startsWith('#')) continue;
      segs.push(resolveURL(baseURL, L));
    }
    return { segs, initURI, encrypted };
  }

  async function downloadHLS(m3u8Url) {
    try {
      log(`Fetching playlist…`);
      const hdrs = { 'Referer': location.href, 'Origin': location.origin };
      const masterTxt = await gmText(m3u8Url, hdrs);
      const base = m3u8Url.replace(/[^/?#]+(\?.*)?$/,''); // directory

      // Master or media?
      let mediaURL = m3u8Url;
      if (/^#EXTM3U/.test(masterTxt) && /#EXT-X-STREAM-INF/.test(masterTxt)) {
        mediaURL = parseMaster(masterTxt, base);
        if (!mediaURL) throw new Error('Could not find a variant in master playlist.');
      }

      const mediaTxt = mediaURL === m3u8Url ? masterTxt : await gmText(mediaURL, hdrs);
      const { segs, initURI, encrypted } = parseMedia(mediaTxt, mediaURL.replace(/[^/?#]+(\?.*)?$/,''));

      if (!segs.length) throw new Error('No segments found.');
      if (encrypted) {
        log('Detected encrypted HLS (EXT-X-KEY). Using ffmpeg fallback…', true);
        const ff = `ffmpeg -y -headers "Referer: ${location.href}\\r\\nOrigin: ${location.origin}\\r\\n" -i "${mediaURL}" -c copy "${pickFileName(mediaURL, 'mp4')}"`;
        await navigator.clipboard.writeText(ff);
        alert('Stream appears encrypted.\nI copied an ffmpeg command to your clipboard.\nPaste it in a terminal with ffmpeg installed.');
        return;
      }

      const isFmp4 = /#EXT-X-MAP/.test(mediaTxt) || /\.m4s(\b|[?#])/.test(segs[0]);
      const suggested = pickFileName(mediaURL, isFmp4 ? 'mp4' : 'ts');

      if (!('showSaveFilePicker' in window)) {
        alert('Your browser is missing showSaveFilePicker().\nUse Chrome/Brave/Edge ≥ 86, or use the ffmpeg command fallback.');
        return;
      }

      const fh = await window.showSaveFilePicker({
        suggestedName: suggested,
        types: [{ description: isFmp4 ? 'MP4' : 'MPEG-TS', accept: { 'video/*': [`.${isFmp4 ? 'mp4' : 'ts'}`] } }]
      });
      const ws = await fh.createWritable();

      let done = 0;
      const total = segs.length + (initURI ? 1 : 0);
      log(`Saving ${total} part(s) to ${suggested}…`);

      if (initURI) {
        const ab = await gmAB(initURI, hdrs);
        await ws.write(new Uint8Array(ab));
        done++; setProgress((done / total) * 100);
      }

      for (let i = 0; i < segs.length; i++) {
        const ab = await gmAB(segs[i], hdrs);
        await ws.write(new Uint8Array(ab));
        done++;
        if (i % 5 === 0) log(`Segment ${i+1}/${segs.length}`);
        setProgress((done / total) * 100);
      }

      await ws.close();
      log('✅ Done. File saved.');
      setProgress(100);
    } catch (err) {
      console.error(err);
      log(`Error: ${err.message || err}`, true);
      alert(`HLS download error:\n${err.message || err}`);
    }
  }

  // ---------- Button click ----------
  panel.querySelector('#hlsdl-btn').addEventListener('click', async () => {
    // Try to prefill with the most recently seen .m3u8
    scanDOM();
    const prefill = lastM3U8 || '';
    const url = prompt('HLS .m3u8 URL to download:', prefill);
    if (!url) return;
    logBox.style.display = 'block';
    lines.innerHTML = ''; setProgress(0);
    await downloadHLS(url.trim());
  });
})();

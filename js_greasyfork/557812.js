// ==UserScript==
// @name         Dreamina: Download Original (No Watermark)
// @namespace    yaylists.dreamina.dl
// @description  One inline button that downloads the original MP4 or PNG/JPG (no watermark). Hooks work by injecting into page context.
// @author       YAY Labs
// @match        https://dreamina.capcut.com/*
// @run-at       document-start
// @inject-into  page
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @version      2.2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557812/Dreamina%3A%20Download%20Original%20%28No%20Watermark%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557812/Dreamina%3A%20Download%20Original%20%28No%20Watermark%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== Config ======
  const CDN_HOST = /(capcutcdn|capcutcdn-us|capcutcdn-eu|capcutcdn-asia|dreamina-sign)/i;
  const MEDIA_EXT = /\.(mp4|webm|mov|m4v|mp3|m4a|wav|aac|jpg|jpeg|png|webp)(?:[?#].*)?$/i;
  const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'm4v']);
  const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp']);

  let bestVideo = null; // {url, ct, cl, score, ts}
  let bestImage = null; // {url, ct, cl, score, ts}

  // ====== Utils ======
  const now = () => Date.now();
  const baseName = () => (document.title || 'dreamina').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_') || 'asset';
  const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');
  const fmtName = (ext) => `${baseName()}_${stamp()}.${ext}`;
  const getExt = (url) => { try { const m = new URL(url).pathname.match(MEDIA_EXT); return m ? (m[1] || '').toLowerCase() : ''; } catch { return ''; } };
  const isCDN = (url) => { try { return CDN_HOST.test(new URL(url).hostname); } catch { return false; } };
  const resizeArea = (url) => { const m = url.match(/(?:resize|aigc_resize):(\d+):(\d+)/i); return m ? (+m[1])*(+m[2]) : 0; };

  function headerLookup(raw, name) {
    if (!raw) return '';
    const re = new RegExp(`^${name}:\\s*([^\\r\\n]+)`, 'im');
    const m = raw.match(re);
    return m ? m[1].trim() : '';
  }
  function headMeta(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'HEAD', url,
        onload: (res) => resolve({
          contentType: headerLookup(res.responseHeaders, 'content-type') || '',
          contentLength: headerLookup(res.responseHeaders, 'content-length') || '',
        }),
        onerror: () => resolve({}), ontimeout: () => resolve({}),
      });
    });
  }

  // ====== Scoring / keeping best ======
  function score(url, meta = {}) {
    if (!isCDN(url)) return -Infinity;
    const ext = getExt(url);
    const ct = (meta.contentType || '').toLowerCase();
    const cl = +(meta.contentLength || 0);
    let s = 0;

    if (ct.startsWith('video/') || VIDEO_EXT.has(ext)) s += 400;
    if (ct.startsWith('audio/')) s += 200;
    if (ct.startsWith('image/') || IMAGE_EXT.has(ext)) s += 60;
    if (ext === 'webp') s -= 5;

    if (cl > 2e6) s += 10;
    if (cl > 1.5e7) s += 15;
    if (cl > 4e7) s += 20;

    s += Math.min(60, Math.floor(resizeArea(url) / (1024 * 1024))); // prefer bigger aigc_resize

    return s;
  }

  function consider(url, meta = {}) {
    if (!url || !isCDN(url)) return;
    const sc = score(url, meta);
    if (sc === -Infinity) return;

    const ct = (meta.contentType || '').toLowerCase();
    const ext = getExt(url);
    const isVideo = ct.startsWith('video/') || VIDEO_EXT.has(ext);
    const isImage = ct.startsWith('image/') || IMAGE_EXT.has(ext);

    const cand = { url, ct, cl: meta.contentLength || '', score: sc, ts: now() };

    if (isVideo) {
      if (!bestVideo || sc > bestVideo.score || (sc === bestVideo.score && cand.ts > bestVideo.ts)) {
        bestVideo = cand; updateBtnState();
      }
    } else if (isImage) {
      if (!bestImage || sc > bestImage.score || (sc === bestImage.score && cand.ts > bestImage.ts)) {
        bestImage = cand; updateBtnState();
      }
    }
  }

  // ====== Conversions (WebP → PNG) ======
  function xhrBlob(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url, responseType: 'arraybuffer',
        onload: (res) => {
          try {
            const ct = headerLookup(res.responseHeaders, 'content-type') || '';
            resolve({ blob: new Blob([res.response], { type: ct || 'application/octet-stream' }), ct });
          } catch (e) { reject(e); }
        },
        onerror: reject, ontimeout: reject,
      });
    });
  }
  async function webpToPNG(url) {
    const { blob } = await xhrBlob(url);
    const bmp = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bmp.width; canvas.height = bmp.height;
    canvas.getContext('2d').drawImage(bmp, 0, 0);
    return await new Promise(r => canvas.toBlob(r, 'image/png'));
  }
  function saveBlob(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  // ====== Download ======
  async function handleDownload() {
    if (bestVideo?.url) {
      // Save MP4 (server returns MP4 bytes even if extension query looks different)
      GM_download({ url: bestVideo.url, name: fmtName('mp4'), saveAs: true });
      return;
    }
    // Image fallback
    let img = bestImage?.url;
    if (!img) {
      img = await domGetCurrentImage();
      if (img) { const m = await headMeta(img); consider(img, m); }
    }
    if (img) {
      const isWebp = /\.webp(?:[?#].*)?$/i.test(img) || (bestImage?.ct || '').toLowerCase().startsWith('image/webp');
      if (isWebp) {
        const png = await webpToPNG(img);
        saveBlob(png, fmtName('png'));
      } else {
        const ext = (getExt(img) || (bestImage?.ct?.split('/')[1] || 'png')).replace('jpeg', 'jpg');
        GM_download({ url: img, name: fmtName(ext), saveAs: true });
      }
      return;
    }
    alert('No media captured yet. Open the big preview or hover a tile so it loads, then click again.');
  }

  // ====== Hooks (WORK because of @inject-into page) ======
  function hookFetch() {
    const orig = window.fetch;
    window.fetch = function(...args) {
      const guessed = (typeof args[0] === 'string') ? args[0] : (args[0]?.url || '');
      return orig.apply(this, args).then((res) => {
        try {
          const url = res.url || guessed;
          if (url && isCDN(url)) {
            const ct = res.headers.get('content-type') || '';
            const cl = res.headers.get('content-length') || '';
            consider(url, { contentType: ct, contentLength: cl });
          }
        } catch {}
        return res;
      });
    };
  }

  function hookXHR() {
    const o = XMLHttpRequest.prototype.open;
    const s = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(m, u, ...r) { this.__u = u; return o.call(this, m, u, ...r); };
    XMLHttpRequest.prototype.send = function(...a) {
      this.addEventListener('load', () => {
        try {
          const url = this.responseURL || this.__u || '';
          if (url && isCDN(url)) {
            const ct = this.getResponseHeader('content-type') || '';
            const cl = this.getResponseHeader('content-length') || '';
            consider(url, { contentType: ct, contentLength: cl });
          }
        } catch {}
      });
      return s.apply(this, a);
    };
  }

  // ====== PerformanceObserver ======
  function perfScan(existing = true) {
    performance.getEntriesByType('resource')
      .filter(e => e.name && isCDN(e.name))
      .forEach(async e => {
        const meta = await headMeta(e.name);
        consider(e.name, meta);
      });
  }
  function startPerfObserver() {
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.name && isCDN(e.name)) headMeta(e.name).then(m => consider(e.name, m));
        }
      });
      po.observe({ type: 'resource', buffered: true });
    } catch {}
  }

  // ====== DOM sweep (pierces shadow roots) ======
  function allNodesDeep(root = document) {
    const out = [];
    const walker = (node) => {
      out.push(node);
      if (node.shadowRoot) walker(node.shadowRoot);
      node.childNodes && node.childNodes.forEach(walker);
    };
    walker(root);
    return out;
  }

  async function domSweep(root = document) {
    // src / srcset on img/video/source
    root.querySelectorAll('img[src], video[src], source[src]').forEach(async el => {
      const src = el.getAttribute('src');
      if (src && /^https?:\/\//i.test(src) && isCDN(src)) {
        const meta = await headMeta(src);
        consider(src, meta);
      }
      const ss = el.getAttribute('srcset');
      if (ss) {
        ss.split(',').forEach(async part => {
          const u = part.trim().split(/\s+/)[0];
          if (u && isCDN(u)) {
            const meta = await headMeta(u);
            consider(u, meta);
          }
        });
      }
    });

    // background-image & data-* on deep nodes
    allNodesDeep(root).forEach(async el => {
      // background-image
      if (el instanceof Element) {
        const bg = getComputedStyle(el).backgroundImage;
        const m = bg && bg.match(/url\(["']?(https?:\/\/[^"')]+)["']?\)/i);
        if (m && isCDN(m[1])) {
          const meta = await headMeta(m[1]);
          consider(m[1], meta);
        }
        // generic data-* attributes with URLs
        for (const attr of el.getAttributeNames ? el.getAttributeNames() : []) {
          if (!/^data-/.test(attr)) continue;
          const val = el.getAttribute(attr) || '';
          if (/^https?:\/\//i.test(val) && isCDN(val)) {
            const meta = await headMeta(val);
            consider(val, meta);
          }
        }
      }
      // inline script JSON
      if (el.nodeName === 'SCRIPT' && !(el).src) {
        const t = el.textContent || '';
        if (t.includes('capcutcdn')) {
          const urls = t.match(/https?:\/\/[^"'\s)]+capcutcdn[^"'\s)]+/ig);
          if (urls) {
            for (const u of urls) {
              const meta = await headMeta(u);
              consider(u, meta);
            }
          }
        }
      }
    });
  }

  // When nothing sniffed yet, try the visible preview area
  async function domGetCurrentImage() {
    const btn = [...document.querySelectorAll('button, [role="button"]')].find(b => (b.textContent || '').trim().toLowerCase() === 'download');
    const container = btn ? btn.closest('div') : document;

    // largest <img>
    let best = '', area = 0;
    (container || document).querySelectorAll('img[src]').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (!isCDN(src)) return;
      const a = (img.naturalWidth || img.width || 0) * (img.naturalHeight || img.height || 0);
      if (a > area) { area = a; best = src; }
    });
    if (best) return best;

    // background-image
    const all = (container || document).querySelectorAll('*');
    for (const el of all) {
      const bg = getComputedStyle(el).backgroundImage;
      const m = bg && bg.match(/url\(["']?(https?:\/\/[^"')]+)["']?\)/i);
      if (m && isCDN(m[1])) return m[1];
    }
    return '';
  }

  // ====== UI: single button (modal + hover group) ======
  function css() {
    GM_addStyle(`
      .dl-nwm-btn {
        margin-left: 8px; padding: 6px 10px; border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.08);
        background: rgba(20,20,20,0.90); color: #fff;
        font: 600 12px/1 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
        cursor: pointer;
      }
      .dl-nwm-btn[disabled] { opacity:.5; cursor:not-allowed; }
    `);
  }
  function makeBtn() {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dl-nwm-btn';
    b.textContent = 'Download Original (No WM)';
    b.addEventListener('click', handleDownload);
    return b;
  }
  function placeButtons(root = document) {
    // Next to their “Download” (modal)
    root.querySelectorAll('button, [role="button"]').forEach(b => {
      const label = (b.textContent || '').trim().toLowerCase();
      if (label === 'download' && !b.dataset.nwmInjected) {
        b.after(makeBtn());
        b.dataset.nwmInjected = '1';
        updateBtnState();
      }
    });
    // In the top-right hover button group
    root.querySelectorAll('div[class*="button-group-"][class*="button-group-top"]').forEach(g => {
      if (g.dataset.nwmInjected) return;
      g.appendChild(makeBtn());
      g.dataset.nwmInjected = '1';
      updateBtnState();
    });
  }
  function updateBtnState() {
    const on = !!(bestVideo?.url || bestImage?.url);
    document.querySelectorAll('.dl-nwm-btn').forEach(b => b.disabled = !on);
  }

  // ====== Boot ======
  hookFetch();
  hookXHR();
  css();
  startPerfObserver();

  // first wave early (document-start)
  // small delay to let initial scripts attach
  setTimeout(() => { try { perfScan(true); } catch {} }, 300);

  // periodic sweeps like Imageye
  let t0 = Date.now();
  const fast = setInterval(() => {
    domSweep(document).catch(()=>{});
    perfScan(false);
    if (Date.now() - t0 > 15000) { clearInterval(fast);
      setInterval(() => { domSweep(document).catch(()=>{}); perfScan(false); }, 3000);
    }
  }, 700);

  // place buttons when DOM is ready and on mutations
  const onReady = () => {
    placeButtons(document);
    const uiObs = new MutationObserver((muts) => {
      muts.forEach(m => m.addedNodes && m.addedNodes.forEach(n => {
        if (n.nodeType === 1) { placeButtons(n); }
      }));
    });
    if (document.body) uiObs.observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }
})();

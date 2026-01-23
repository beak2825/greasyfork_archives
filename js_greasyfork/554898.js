// ==UserScript==
// @name StreamGrabber
// @namespace https://github.com/streamgrabber-lite
// @version 1.2.6
// @description Lightweight downloader for HLS (.m3u8 via m3u8 parser), video blobs, and direct videos. Mobile plus Desktop. Pause or Resume. AES 128. fMP4. Minimal UI.
// @match *://*/*
// --- Existing Social and Streaming Exclusions ---
// @exclude *://*.youtube.com/*
// @exclude *://*.youtu.be/*
// @exclude *://*.x.com/*
// @exclude *://*.twitch.tv/*
// @exclude *://*.reddit.com/*
// @exclude *://*.redd.it/*
// @exclude *://*.facebook.com/*
// @exclude *://*.instagram.com/*
// @exclude *://*.tiktok.com/*
// @exclude *://*.netflix.com/*
// @exclude *://*.hulu.com/*
// @exclude *://*.disneyplus.com/*
// @exclude *://*.primevideo.com/*
// @exclude *://*.spotify.com/*
// --- Music and Audio Only ---
// @exclude *://music.youtube.com/*
// @exclude *://*.soundcloud.com/*
// @exclude *://*.deezer.com/*
// @exclude *://*.pandora.com/*
// @exclude *://music.apple.com/*
// @exclude *://*.tidal.com/*
// @exclude *://*.gaana.com/*
// @exclude *://*.jiosaavn.com/*
// @exclude *://*.wynk.in/*
// --- Productivity, Cloud and Office Suites ---
// @exclude *://*.super-productivity.com/*
// @exclude *://*.google.com/*
// @exclude *://*.office.com/*
// @exclude *://*.live.com/*
// @exclude *://*.microsoft365.com/*
// @exclude *://*.notion.so/*
// @exclude *://*.trello.com/*
// @exclude *://*.asana.com/*
// @exclude *://*.atlassian.net/*
// @exclude *://*.jira.com/*
// @exclude *://*.monday.com/*
// @exclude *://*.clickup.com/*
// @exclude *://*.linear.app/*
// @exclude *://*.miro.com/*
// @exclude *://*.figma.com/*
// @exclude *://*.canva.com/*
// @exclude *://*.dropbox.com/*
// @exclude *://*.box.com/*
// @exclude *://*.evernote.com/*
// @exclude *://*.onedrive.live.com/*
// --- Cloud Consoles and DevOps ---
// @exclude *://*.amazon.com/*
// @exclude *://*.aws.amazon.com/*
// @exclude *://*.azure.com/*
// @exclude *://portal.azure.com/*
// @exclude *://console.cloud.google.com/*
// @exclude *://*.firebase.google.com/*
// @exclude *://*.vercel.com/*
// @exclude *://*.netlify.com/*
// @exclude *://*.heroku.com/*
// @exclude *://*.digitalocean.com/*
// @exclude *://*.cloudflare.com/*
// --- Communication and Chat ---
// @exclude *://*.telegram.org/*
// @exclude *://*.slack.com/*
// @exclude *://app.slack.com/*
// @exclude *://discord.com/*
// @exclude *://web.whatsapp.com/*
// @exclude *://teams.microsoft.com/*
// @exclude *://zoom.us/*
// @exclude *://web.skype.com/*
// @exclude *://messenger.com/*
// --- Search Engines ---
// @exclude *://*.google.*/*
// @exclude *://search.brave.com/*
// @exclude *://*.bing.com/*
// @exclude *://*.duckduckgo.com/*
// @exclude *://*.yahoo.com/*
// @exclude *://*.baidu.com/*
// @exclude *://*.yandex.com/*
// @exclude *://*.ecosia.org/*
// @exclude *://*.startpage.com/*
// --- Developer Tools and Repositories ---
// @exclude *://github.com/*
// @exclude *://gitlab.com/*
// @exclude *://bitbucket.org/*
// @exclude *://stackoverflow.com/*
// @exclude *://*.stackexchange.com/*
// @exclude *://*.npmjs.com/*
// @exclude *://pypi.org/*
// @exclude *://*.w3schools.com/*
// @exclude *://developer.mozilla.org/*
// --- Wikipedia and Reference ---
// @exclude *://*.wikipedia.org/*
// @exclude *://*.wiktionary.org/*
// --- Banking and Finance Global ---
// @exclude *://*.paypal.com/*
// @exclude *://*.stripe.com/*
// @exclude *://*.wise.com/*
// @exclude *://*.revolut.com/*
// @exclude *://*.americanexpress.com/*
// @exclude *://*.mastercard.com/*
// @exclude *://*.visa.com/*
// --- Banking and Finance India ---
// @exclude *://*.onlinesbi.sbi/*
// @exclude *://retail.onlinesbi.com/*
// @exclude *://*.hdfcbank.com/*
// @exclude *://netbanking.hdfcbank.com/*
// @exclude *://*.icicibank.com/*
// @exclude *://infinity.icicibank.com/*
// @exclude *://*.axisbank.com/*
// @exclude *://*.kotak.com/*
// @exclude *://*.pnbindia.in/*
// @exclude *://*.bankofbaroda.in/*
// @exclude *://*.canarabank.com/*
// @exclude *://*.unionbankofindia.co.in/*
// @exclude *://*.idfcfirstbank.com/*
// @exclude *://*.indusind.com/*
// @exclude *://*.yesbank.in/*
// @exclude *://*.rblbank.com/*
// @exclude *://*.idbibank.in/*
// @exclude *://*.paytm.com/*
// @exclude *://*.phonepe.com/*
// @exclude *://*.razorpay.com/*
// --- Government and Official India ---
// @exclude *://*.gov.in/*
// @exclude *://*.uidai.gov.in/*
// @exclude *://*.incometax.gov.in/*
// @exclude *://*.gst.gov.in/*
// @exclude *://*.epfindia.gov.in/*
// @exclude *://*.passportindia.gov.in/*
// @exclude *://*.irctc.co.in/*
// --- Security and Password Managers ---
// @exclude *://*.lastpass.com/*
// @exclude *://*.1password.com/*
// @exclude *://*.bitwarden.com/*
// @exclude *://*.dashlane.com/*

// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      *
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/m3u8-parser/7.2.0/m3u8-parser.min.js
// @downloadURL https://update.greasyfork.org/scripts/554898/StreamGrabber.user.js
// @updateURL https://update.greasyfork.org/scripts/554898/StreamGrabber.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // =========================
  // Config
  // =========================
  const CFG = {
    RETRIES: 3,
    CONC: 6,
    REQ_MS: 60000,
    MAN_MS: 30000,
    SMALL_BYTES: 1 * 1024 * 1024, // 1MB
    UI_IDLE_MS: 5000, // idle fade delay
    IS_TOP: window.self === window.top,
  };
  const CACHE = {
    TEXT_MAX: 256,
    HEAD_MAX: 256,
    DB_MAX: 120,
    CLEAR_MS: 120000
  };

  // =========================
  // State & caches
  // =========================
  // DB items: { url, kind, label, size, type, origin, win? }
  // We use Maps now to track metadata better
  const STATE = {
    items: new Map(), // url -> item (kept uniquely by url)
  };
  const DB = {
    // Deprecated old Sets, kept for legacy compat if referenced, 
    // but we primarily use STATE.items now for the UI list.
    m3u8: new Set(),
    vid: new Set(),
  };
  const BLOBS = new Map(); // blobUrl -> { blob, type, size, kind, ts, revoked? }
  const textCache = new Map(); // url -> text (LRU-ish via bump)
  const inflightText = new Map(); // url -> Promise<string>
  const headCache = new Map(); // url -> { length, type } (LRU-ish via bump)
  const inflightHead = new Map(); // url -> Promise<meta>
  const watchedVideos = new Set();

  // Settings
  const SETTINGS = {
    excludeSmall: GM_getValue('sg_exclude_small', true)
  };
  const setExcludeSmall = (v) => { SETTINGS.excludeSmall = !!v; GM_setValue('sg_exclude_small', !!v); };

  // =========================
  // Utilities
  // =========================
  const log = (...x) => console.log('[SG]', ...x);
  const err = (...x) => console.error('[SG]', ...x);
  const isHttp = (u) => typeof u === 'string' && /^https?:/i.test(u);
  const isBlob = (u) => typeof u === 'string' && /^blob:/i.test(u);
  const isM3U8Url = (u) => /\.m3u8(\b|[?#]|$)/i.test(u || '');
  const isVideoUrl = (u) => /\.(mp4|mkv|webm|avi|mov|m4v|flv|ogv|ogg)([?#]|$)/i.test(u || '');
  const isSegmentUrl = (u) => /\.(m4s|init|seg|fmp4|ts|m2ts)([?#]|$)/i.test(u || '');
  const looksM3U8Type = (t = '') => /mpegurl|vnd\.apple\.mpegurl|application\/x-mpegurl/i.test(t);
  const looksVideoType = (t = '') => /^video\//i.test(t) || /(matroska|mp4|webm|quicktime)/i.test(t);
  const safeAbs = (u, b) => { try { return new URL(u, b).href; } catch { return u; } };
  const cleanName = (s) => (s || 'video').replace(/[\\/:*?"<>|]/g, '_').slice(0, 120).trim() || 'video';
  const fmtBytes = (n) => { if (n == null) return ''; const u = ['B', 'KB', 'MB', 'GB', 'TB']; let i = 0, v = n; while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; } return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`; };
  const extFromType = (t = '') => {
    t = t.toLowerCase();
    if (t.includes('webm')) return 'webm';
    if (t.includes('matroska') || t.includes('mkv')) return 'mkv';
    if (t.includes('quicktime') || t.includes('mov')) return 'mov';
    if (t.includes('mp2t') || t.includes('mpegts')) return 'ts';
    if (t.includes('ogg')) return 'ogg';
    if (t.includes('mp4')) return 'mp4';
    return 'mp4';
  };
  const guessExt = (url, type) => {
    const m = /(?:\.([a-z0-9]+))([?#]|$)/i.exec(url || ''); return m ? m[1].toLowerCase() : (type ? extFromType(type) : 'mp4');
  };
  function once(cache, inflight, key, loader, max) {
    const inC = lruGet(cache, key);
    if (inC !== undefined) return Promise.resolve(inC);
    if (inflight.has(key)) return inflight.get(key);
    const p = (async () => {
      try { const v = await loader(); lruSet(cache, key, v, max); return v; }
      finally { inflight.delete(key); }
    })();
    inflight.set(key, p);
    return p;
  }
  const parseRange = (v) => {
    if (!v) return null;
    const m = /bytes=(\d+)-(\d+)?/i.exec(v);
    if (!m) return null;
    return { start: +m[1], end: m[2] != null ? +m[2] : null };
  };

  // bounded add helper for STATE.items
  function boundedAddItem(item, max = CACHE.DB_MAX) {
    if (STATE.items.has(item.url)) return false;
    STATE.items.set(item.url, item);
    // keep syncing legacy sets for minimal breakage
    if (item.kind === 'hls') DB.m3u8.add(item.url);
    else DB.vid.add(item.url);

    while (STATE.items.size > max) {
      const first = STATE.items.keys().next().value;
      const it = STATE.items.get(first);
      STATE.items.delete(first);
      if (it) {
        DB.m3u8.delete(it.url);
        DB.vid.delete(it.url);
      }
    }
    return true;
  }
  // LRU-ish helpers for Maps (bump on get, trim on set)
  function lruGet(map, key) {
    if (!map.has(key)) return undefined;
    const v = map.get(key);
    map.delete(key); // bump to end
    map.set(key, v);
    return v;
  }
  function lruSet(map, key, val, max) {
    if (map.has(key)) map.delete(key);
    map.set(key, val);
    if (typeof max === 'number' && isFinite(max)) {
      while (map.size > max) {
        map.delete(map.keys().next().value);
      }
    }
  }
  // passive cache trim (+prune revoked blobs)
  function trimCaches() {
    // trim DB via bounded rule enforcement if needed, mostly handled on add
    while (STATE.items.size > CACHE.DB_MAX) {
      const k = STATE.items.keys().next().value;
      STATE.items.delete(k);
    }
    const now = Date.now();
    for (const [href, info] of BLOBS) {
      const idle = now - (info.ts || 0);
      if (info.revoked && idle > CACHE.CLEAR_MS) {
        BLOBS.delete(href);
        STATE.items.delete(href);
        DB.m3u8.delete(href);
        DB.vid.delete(href);
      }
    }
  }
  setInterval(trimCaches, CACHE.CLEAR_MS);
  window.addEventListener('pagehide', trimCaches);
  window.addEventListener('beforeunload', trimCaches);

  // =========================
  // Network helpers
  // =========================
  function gmGet({ url, responseType = 'text', headers = {}, timeout = CFG.REQ_MS, onprogress }) {
    let ref;
    const p = new Promise((resolve, reject) => {
      ref = GM_xmlhttpRequest({
        method: 'GET',
        url, responseType, headers, timeout,
        onprogress: e => onprogress?.(e),
        onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.response) : reject(new Error(`HTTP ${r.status}`)),
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout'))
      });
    });
    p.abort = () => { try { ref?.abort(); } catch { } };
    return p;
  }
  const getText = (url) => once(textCache, inflightText, url, async () => {
    if (isBlob(url)) {
      const info = BLOBS.get(url);
      if (!info?.blob) throw new Error('Blob not found');
      info.ts = Date.now();
      return info.blob.text();
    }
    return gmGet({ url, responseType: 'text', timeout: CFG.MAN_MS });
  }, CACHE.TEXT_MAX);
  function getBin(url, headers = {}, timeout = CFG.REQ_MS, onprogress) {
    if (isBlob(url)) {
      const info = BLOBS.get(url);
      if (!info?.blob) return Promise.reject(new Error('Blob not found'));
      info.ts = Date.now();
      const range = parseRange(headers.Range);
      const part = range ? info.blob.slice(range.start, (range.end == null ? info.blob.size : range.end + 1)) : info.blob;
      if (onprogress) setTimeout(() => onprogress({ loaded: part.size, total: part.size }), 0);
      return part.arrayBuffer();
    }
    return gmGet({ url, responseType: 'arraybuffer', headers, timeout, onprogress });
  }
  const headMeta = (url) => once(headCache, inflightHead, url, async () => {
    try {
      const resp = await new Promise((res, rej) => {
        GM_xmlhttpRequest({
          method: 'HEAD', url, timeout: CFG.REQ_MS,
          onload: res, onerror: () => rej(new Error('HEAD failed')),
          ontimeout: () => rej(new Error('HEAD timeout'))
        });
      });
      const h = resp.responseHeaders || '';
      const length = +(/(^|\n)content-length:\s*(\d+)/i.exec(h)?.[2] || 0) || null;
      const type = (/(^|\n)content-type:\s*([^\n]+)/i.exec(h)?.[2] || '').trim() || null;
      return { length, type };
    } catch { return { length: null, type: null }; }
  }, CACHE.HEAD_MAX);

  // =========================
  // Crypto helpers (AES-128/CBC)
  // =========================
  const hexToU8 = (hex) => {
    hex = String(hex || '').replace(/^0x/i, '').replace(/[^0-9a-f]/gi, '');
    if (hex.length % 2) hex = '0' + hex;
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  };
  const ivFromSeq = (n) => {
    n = BigInt(n >>> 0); const iv = new Uint8Array(16);
    for (let i = 15; i >= 0; i--) { iv[i] = Number(n & 0xffn); n >>= 8n; }
    return iv;
  };
  async function aesCbcDec(buf, keyBytes, iv) {
    const k = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']);
    return crypto.subtle.decrypt({ name: 'AES-CBC', iv }, k, buf);
  }

  // =========================
  // UI (Compact Dark Minimal)
  // =========================
  GM_addStyle(`
  :root{
    --sg-bg:#1e1e1e;
    --sg-bg-2:#252525;
    --sg-bg-3:#2d2d2d;
    --sg-border:#353535;
    --sg-border-2:#404040;
    --sg-fg:#e0e0e0;
    --sg-fg-dim:#aaa;
    --sg-fg-dimmer:#888;
    --sg-ok:#10b981;
    --sg-bad:#e74c3c;
    --sg-badge:#dc3545;
  }
  @keyframes umdl-spin{to{transform:rotate(360deg)}}
  .umdl-fab{
    position:fixed;right:16px;bottom:16px;z-index:2147483647;
    width:48px;height:48px;border-radius:50%;
    display:none;align-items:center;justify-content:center;
    background:var(--sg-bg-3);color:#fff;border:1px solid var(--sg-border-2);
    cursor:pointer;overflow:visible
  }
  .umdl-fab.show{display:flex}
  .umdl-fab.idle{opacity:.5}
  .umdl-fab:hover{background:#353535}
  .umdl-fab.busy svg{opacity:0}
  .umdl-fab.busy::after{
    content:'';position:absolute;width:18px;height:18px;border:2px solid var(--sg-border-2);
    border-top-color:#fff;border-radius:50%;animation:umdl-spin .6s linear infinite
  }
  .umdl-fab svg{width:16px;height:16px}
  .umdl-badge{
    position:absolute;top:-6px;right:-6px;background:var(--sg-badge);color:#fff;
    font-weight:600;font-size:10px;padding:3px 5px;border-radius:10px;display:none;
    line-height:1;border:2px solid var(--sg-bg);min-width:18px;text-align:center;
    box-shadow:0 2px 4px rgba(0,0,0,.3)
  }
  .umdl-pick{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(4px)}
  .umdl-pick.show{display:flex}
  .umdl-card{
    background:var(--sg-bg);color:var(--sg-fg);border:1px solid var(--sg-border-2);
    border-radius:10px;width:min(500px,94vw);max-height:84vh;overflow:hidden
  }
  .umdl-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #2d2d2d}
  .umdl-head .ttl{font-size:15px;font-weight:600;color:#fff}
  .umdl-x{
    background:var(--sg-bg-3);border:1px solid var(--sg-border-2);color:var(--sg-fg-dim);
    border-radius:8px;padding:6px;cursor:pointer;display:flex;min-width:32px;min-height:32px
  }
  .umdl-x:hover{background:#353535;color:#fff}
  .umdl-x svg{width:16px;height:16px}
  .umdl-body{
    padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;max-height:calc(84vh - 110px)
  }
  .umdl-body::-webkit-scrollbar{width:6px}
  .umdl-body::-webkit-scrollbar-thumb{background:var(--sg-border-2);border-radius:3px}
  .umdl-opt{
    display:flex;align-items:center;gap:9px;font-size:12px;color:var(--sg-fg-dim);
    padding:10px 12px;background:var(--sg-bg-2);border-radius:8px;border:1px solid var(--sg-border)
  }
  .umdl-opt input[type="checkbox"]{width:16px;height:16px;cursor:pointer;accent-color:#fff;margin:0}
  .umdl-list{display:flex;flex-direction:column;gap:8px}
  .umdl-item{
    background:var(--sg-bg-2);border:1px solid var(--sg-border);border-radius:8px;
    padding:12px 14px;cursor:pointer
  }
  .umdl-item:hover{background:#2d2d2d;border-color:var(--sg-border-2)}
  .umdl-item-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
  .umdl-item .t{font-weight:600;font-size:13px;color:#fff;line-height:1.4;flex:1}
  .umdl-item .s{
    font-size:11px;color:var(--sg-fg-dimmer);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    font-family:ui-monospace,SF Mono,Consolas,monospace
  }
  .umdl-copy-btn{
    background:var(--sg-bg-3);border:1px solid var(--sg-border-2);color:var(--sg-fg-dim);
    border-radius:6px;padding:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0
  }
  .umdl-copy-btn:hover{background:#353535;color:#fff}
  .umdl-copy-btn svg{width:13px;height:13px}
  .umdl-copy-btn.copied{background:#28a745;border-color:#28a745;color:#fff}
  .umdl-empty{padding:32px;color:var(--sg-fg-dimmer);font-size:13px;text-align:center}
  .umdl-toast{
    position:fixed;right:16px;bottom:72px;z-index:2147483646;
    display:flex;flex-direction:column;gap:10px;
    max-width:380px;max-height:70vh;overflow-y:auto;
    align-items:flex-end;
    font:13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif
  }
  .umdl-toast::-webkit-scrollbar{width:5px}
  .umdl-toast::-webkit-scrollbar-thumb{background:var(--sg-border-2);border-radius:3px}
  .umdl-job{
    background:var(--sg-bg);color:var(--sg-fg);border:1px solid var(--sg-border-2);border-radius:10px;
    padding:13px 15px;min-width:280px;display:flex;flex-direction:column
  }
  .umdl-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
  .umdl-row .name{
    font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    max-width:230px;color:#fff
  }
  .umdl-ctrls{display:flex;gap:6px;margin-left:auto}
  .umdl-mini{
    background:var(--sg-bg-3);color:var(--sg-fg-dim);border:1px solid var(--sg-border-2);
    border-radius:7px;padding:6px 8px;cursor:pointer;display:flex;align-items:center;justify-content:center;
    min-width:32px;min-height:32px
  }
  .umdl-mini:hover{background:#353535;color:#fff}
  .umdl-mini svg{width:13px;height:13px}
  .umdl-bar{height:7px;background:var(--sg-bg-2);border-radius:4px;overflow:hidden;border:1px solid var(--sg-border)}
  .umdl-fill{height:7px;width:0;background:#fff}
  .umdl-job.minimized{
    padding:6px;min-width:auto;width:auto;display:inline-flex
  }
  .umdl-job.minimized .umdl-bar,
  .umdl-job.minimized .umdl-row:last-child,
  .umdl-job.minimized .name{display:none!important}
  .umdl-job.minimized .umdl-row:first-child{margin-bottom:0;justify-content:center}
  .umdl-job.minimized .umdl-ctrls{margin:0;gap:0}
  .umdl-job.minimized .umdl-ctrls > :not(.btn-hide){display:none!important}
  .umdl-job.minimized .btn-hide{min-width:32px;min-height:32px;padding:6px}
  .umdl-job.minimized .btn-hide svg{width:14px;height:14px}
  @media (max-width:640px){
    .umdl-fab{right:12px;bottom:12px;width:46px;height:46px}
    .umdl-fab svg{width:15px;height:15px}
    .umdl-toast{left:12px;right:12px;bottom:68px;max-width:none}
    .umdl-card{max-height:90vh;border-radius:10px}
    .umdl-body{max-height:calc(90vh - 100px)}
    .umdl-job.minimized{padding:6px}
    .umdl-job.minimized .btn-hide svg{width:14px;height:14px}
  }
`);

  // SVG Icons
  const ICONS = {
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    cancel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
    hide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>`,
    show: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 15l7-7 7 7"/></svg>`
  };
  const DL_SVG = ICONS.download;
  const $ = (sel, root = document) => root.querySelector(sel);

  // root UI
  const FAB = document.createElement('button');
  FAB.className = 'umdl-fab'; FAB.innerHTML = DL_SVG; FAB.title = 'Download detected media';
  const BADGE = document.createElement('span'); BADGE.className = 'umdl-badge'; BADGE.style.display = 'none'; FAB.appendChild(BADGE);
  const PICK = document.createElement('div'); PICK.className = 'umdl-pick';
  PICK.innerHTML = `
    <div class="umdl-card">
      <div class="umdl-head">
        <div class="ttl">Select Media</div>
        <button class="umdl-x" title="Close">${ICONS.close}</button>
      </div>
      <div class="umdl-body">
        <label class="umdl-opt"><input type="checkbox" class="umdl-excl"> Exclude small (&lt; 1MB)</label>
        <div class="umdl-list"></div>
      </div>
    </div>`;
  const TOAST = document.createElement('div'); TOAST.className = 'umdl-toast';
  const PANEL = PICK;
  const PROG_WRAP = TOAST;

  function mountUI() {
    if (!CFG.IS_TOP) return; // Only Top Window mounts UI
    if (!document.body) { document.addEventListener('DOMContentLoaded', mountUI, { once: true }); return; }
    if (!FAB.parentNode) document.body.appendChild(FAB);
    if (!PANEL.parentNode) document.body.appendChild(PANEL);
    if (!PROG_WRAP.parentNode) document.body.appendChild(PROG_WRAP);
    try {
      const cardEl = PANEL.querySelector('.umdl-card');
      cardEl?.setAttribute('role', 'dialog');
      cardEl?.setAttribute('aria-modal', 'true');
      const ttlEl = PANEL.querySelector('.ttl');
      if (ttlEl) cardEl?.setAttribute('aria-labelledby', 'sg-ttl');
      if (ttlEl) ttlEl.id = 'sg-ttl';
    } catch { }
  }
  mountUI();

  // Menu commands (Top only)
  if (CFG.IS_TOP) {
    GM_registerMenuCommand('Show Download Panel', () => {
      mountUI();
      showFab();
      FAB.click();
    });
    GM_registerMenuCommand('Clear Cache', () => {
      STATE.items.clear();
      DB.m3u8.clear();
      DB.vid.clear();
      BLOBS.clear();
      setBadge();
      alert('Cache cleared');
    });
  }

  // Messaging (Top & Child)
  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || typeof d !== 'object') return;

    // Child Logic
    if (d.type === 'SG_CMD_DOWNLOAD') {
      const { url, kind, variant } = d.payload || {};
      if (kind === 'video') downloadDirect(url, true);
      else if (kind === 'hls' || kind === 'variant') downloadHls(url, variant, true);
    }
    if (d.type === 'SG_CMD_PICK_RESULT') {
      const { id, idx } = d.payload; // We send back index or null? Or full object?
      // Sending index is safer to map back to local object list if we can.
      // But we sent the full list.
      // Let's expect the chosen ITEM back, or null.
      const res = PICKER_REQS.get(id);
      if (res) {
        PICKER_REQS.delete(id);
        res(d.payload.item); // item or null
      }
    }
    // Control commands from Top
    if (d.type === 'SG_CMD_CONTROL') {
      const { id, action } = d.payload;
      const ctrl = PICKER_REQS.get(id + '_ctrl'); // We reused this map for controls? hacky but works
      if (ctrl) {
        if (action === 'cancel') ctrl.onCancel?.();
        if (action === 'stop') ctrl.onStop?.();
      }
    }

    // Top Logic
    if (!CFG.IS_TOP) return;

    if (d.type === 'SG_DETECT' && d.item) {
      const it = d.item;
      // Attach remote source for callbacks
      it.remoteWin = ev.source;
      it.isRemote = true;
      if (boundedAddItem(it)) {
        showFab();
        setBadge();
      }
    }
    else if (d.type === 'SG_PROGRESS_START') {
      // Create a proxy card
      const { id, title, src, stoppable } = d.payload;
      createRemoteCard(id, title, src, ev.source); // pass stoppable? in makeProgress options
    }
    else if (d.type === 'SG_PROGRESS_UPDATE') {
      updateRemoteCard(d.payload);
    }
    else if (d.type === 'SG_PROGRESS_DONE') {
      finishRemoteCard(d.payload);
    }
    else if (d.type === 'SG_CMD_PICK') {
      const { id, items, title, filterable } = d.payload;
      pickFromList(items, { title, filterable }).then(sel => {
        ev.source.postMessage({ type: 'SG_CMD_PICK_RESULT', payload: { id, item: sel } }, '*');
      });
    }
  });

  // Badge updates
  let lastBadgeCount = -1, badgeRaf = 0, badgeWanted = 0;
  function flushBadge() {
    badgeRaf = 0;
    if (badgeWanted > 0) {
      BADGE.textContent = String(badgeWanted);
      BADGE.style.display = 'inline-block';
    } else {
      BADGE.style.display = 'none';
    }
  }
  function setBadge() {
    const n = STATE.items.size;
    if (n === lastBadgeCount) return;
    lastBadgeCount = n;
    badgeWanted = n;
    if (!badgeRaf) badgeRaf = requestAnimationFrame(flushBadge);
  }

  let idleT;
  function setIdle() { clearTimeout(idleT); idleT = setTimeout(() => FAB.classList.add('idle'), CFG.UI_IDLE_MS); }
  function clearIdle() { FAB.classList.remove('idle'); clearTimeout(idleT); }
  function showFab() {
    if (!CFG.IS_TOP) return;
    mountUI(); FAB.classList.add('show'); setBadge(); clearIdle(); setIdle();
  }
  function closePanel() { PANEL.classList.remove('show'); }
  function setFabBusy(b) {
    if (b) { FAB.classList.add('busy'); FAB.disabled = true; }
    else { FAB.classList.remove('busy'); FAB.disabled = false; }
  }
  FAB.addEventListener('mouseenter', clearIdle);
  FAB.addEventListener('mouseleave', setIdle);

  // Copy to clipboard helper
  async function copyToClipboard(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      const originalHTML = btn.innerHTML;
      btn.innerHTML = ICONS.check;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
      }, 1500);
      return true;
    } catch (e) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = ICONS.check;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 1500);
        return true;
      } catch (err) {
        console.error('Copy failed:', err);
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  // =========================
  // Detection
  // =========================
  function take(url, metadata = {}) {
    try {
      if (!url || (!isHttp(url) && !isBlob(url))) return;
      if (isSegmentUrl(url)) return; // Explicitly ignore segments

      let size = metadata.size || null;
      let type = metadata.type || null;

      // Populate from BLOBS if missing
      if (isBlob(url)) {
        const info = BLOBS.get(url);
        if (info) {
          if (size == null) size = info.size;
          if (type == null) type = info.type;
        }
      }

      // Filter small video blobs (likely segments)
      // 512KB min for blobs to be considered "Video"
      if (isBlob(url) && size != null && size < 512 * 1024 && !isM3U8Url(url) && BLOBS.get(url)?.kind !== 'm3u8') {
        return;
      }

      const kind = (isM3U8Url(url) || (isBlob(url) && BLOBS.get(url)?.kind === 'm3u8')) ? 'hls' :
        (isVideoUrl(url) || (isBlob(url) && BLOBS.get(url)?.kind === 'video')) ? 'video' : null;

      if (!kind) return;

      const item = {
        url,
        kind,
        label: kind === 'hls' ? 'HLS' : (guessExt(url, type).toUpperCase()),
        size: size,
        type: type,
        origin: document.location.origin
      };

      if (!CFG.IS_TOP) {
        // We are in iframe: send to Top
        // We cannot send 'window' object, so we listen for commands
        // We use the URL as ID. If blob, it's unique enough for this session reference.
        window.top.postMessage({ type: 'SG_DETECT', item: JSON.parse(JSON.stringify(item)) }, '*');
      } else {
        // We are Top: Add locally
        if (boundedAddItem(item)) {
          showFab();
          setBadge();
        }
      }
    } catch (e) { err('take', e); }
  }
  // Hook: createObjectURL
  (() => {
    const bak = URL.createObjectURL;
    URL.createObjectURL = function (obj) {
      const href = bak.call(this, obj);
      try {
        const now = Date.now();
        if (obj instanceof Blob) {
          const type = obj.type || '';
          const info = { blob: obj, type, size: obj.size, kind: 'other', ts: now };
          if (looksM3U8Type(type)) { info.kind = 'm3u8'; BLOBS.set(href, info); take(href); }
          else if (looksVideoType(type)) { info.kind = 'video'; BLOBS.set(href, info); take(href); }
          else {
            const need = /octet-stream|text\/plain|^$/.test(type);
            if (need && obj.size > 0) {
              obj.slice(0, Math.min(2048, obj.size)).text().then(t => {
                if (/^#EXTM3U/i.test(t)) info.kind = 'm3u8';
                else info.kind = 'other';
                BLOBS.set(href, info);
                take(href);
              }).catch(() => BLOBS.set(href, info));
            } else BLOBS.set(href, info);
          }
        } else BLOBS.set(href, { blob: null, type: 'other', size: 0, kind: 'other', ts: now });
      } catch (e) { err('createObjectURL', e); }
      return href;
    };
    const r = URL.revokeObjectURL;
    URL.revokeObjectURL = function (href) {
      try {
        const info = BLOBS.get(href);
        if (info) { info.revoked = true; info.ts = Date.now(); }
      } catch { }
      return r.call(this, href);
    };
  })();
  // Hook: fetch
  (() => {
    const f = window.fetch;
    if (typeof f === 'function') {
      window.fetch = function (...args) {
        try {
          const u = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          take(u);
        } catch { }
        return f.apply(this, args);
      };
    }
  })();
  // Hook: XHR
  (() => {
    const o = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      try { take(url); } catch { }
      return o.call(this, method, url, ...rest);
    };
  })();
  // PerfObserver
  try {
    const po = new PerformanceObserver(list => list.getEntries().forEach(e => take(e.name)));
    po.observe({ entryTypes: ['resource'] });
  } catch { }
  // Video tags scanning
  function watchVideo(v) {
    if (v.__sg_watch) return;
    v.__sg_watch = true;
    const cb = () => {
      const srcs = [v.currentSrc || v.src, ...Array.from(v.querySelectorAll('source')).map(s => s.src)];
      srcs.forEach(take);
    };
    ['loadstart', 'loadedmetadata', 'canplay'].forEach(ev => v.addEventListener(ev, cb));
    watchedVideos.add(v);
    cb();
  }
  function scanVideos() {
    document.querySelectorAll('video').forEach(watchVideo);
  }
  let mo;
  document.addEventListener('DOMContentLoaded', () => {
    scanVideos();
    mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.tagName === 'VIDEO') {
            watchVideo(node);
          } else {
            node.querySelectorAll?.('video')?.forEach(watchVideo);
          }
        }
      }
      for (const v of Array.from(watchedVideos)) if (!v.isConnected) watchedVideos.delete(v);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  });

  // =========================
  // Picker helpers
  // =========================
  function renderList(list) {
    const listEl = PANEL.querySelector('.umdl-list');
    listEl.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'umdl-empty';
      empty.textContent = 'No items match the filter.';
      listEl.appendChild(empty);
      return;
    }
    list.forEach((it) => {
      const div = document.createElement('div');
      div.className = 'umdl-item';
      div.setAttribute('role', 'button');
      div.tabIndex = 0;
      const shortUrl = it.url.length > 80 ? it.url.slice(0, 80) + '…' : it.url;
      div.innerHTML = `
      <div class="umdl-item-top">
        <div class="t">${escapeHtml(it.label)}</div>
        <button class="umdl-copy-btn" title="Copy URL">${ICONS.copy}</button>
      </div>
      <div class="s" title="${escapeHtml(it.url)}">${escapeHtml(shortUrl)}</div>
    `;

      const copyBtn = div.querySelector('.umdl-copy-btn');
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(it.url, copyBtn);
      };

      const act = () => resolvePicker(it);
      div.onclick = (e) => {
        if (!e.target.closest('.umdl-copy-btn')) {
          act();
        }
      };
      div.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          act();
        }
      };

      listEl.appendChild(div);
    });
  }
  let resolvePicker = () => { };
  // =========================
  // UI interactions
  // =========================
  // Maps for async coordination
  const REMOTE_JOBS = new Map(); // id -> { update, done, remove } (Top only)
  const PICKER_REQS = new Map(); // id -> resolve (Child only)

  function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

  async function pickFromList(items, { title = 'Select Media', filterable = true } = {}) {
    if (!CFG.IS_TOP) {
      // Proxy to Top
      const id = uid();
      // We can't send complex objects (like functions) or self structures easily if they have cycles
      // Items from DB are simple JSON-able, but if they came from *another* frame, they might be complex?
      // Actually items in Slave are likely local structured ones.
      // We strip non-clonable data just in case?
      const safeItems = JSON.parse(JSON.stringify(items));
      window.top.postMessage({
        type: 'SG_CMD_PICK',
        payload: { id, items: safeItems, title, filterable }
      }, '*');
      return new Promise(res => PICKER_REQS.set(id, res));
    }

    // Top Logic (Existing)
    return new Promise((resolve) => {
      resolvePicker = (v) => { closePanel(); resolve(v ?? null); };
      const ttl = PANEL.querySelector('.ttl');
      const exWrap = PANEL.querySelector('.umdl-opt');
      const ex = PANEL.querySelector('.umdl-excl');
      const x = PANEL.querySelector('.umdl-x');

      ttl.textContent = title;
      if (filterable) {
        const anySizeKnown = items.some(i => i.size != null);
        exWrap.style.display = anySizeKnown ? 'flex' : 'none';
        ex.checked = SETTINGS.excludeSmall;
        const apply = () => {
          const listToUse = (SETTINGS.excludeSmall && anySizeKnown)
            ? items.filter(x => x.size == null || x.size >= CFG.SMALL_BYTES)
            : items;
          renderList(listToUse);
        };
        ex.onchange = () => { setExcludeSmall(ex.checked); apply(); };
        apply();
      } else {
        exWrap.style.display = 'none';
        renderList(items);
      }
      x.onclick = () => resolvePicker(null);
      PANEL.onclick = (e) => { if (e.target === PANEL) resolvePicker(null); };
      PANEL.classList.add('show');
    });
  }

  // =========================
  // UI interactions
  // =========================
  FAB.addEventListener('click', async (ev) => {
    clearIdle(); setIdle();
    let items = [];
    setFabBusy(true);
    try {
      items = await buildItems();

      // Alt-click: quick start when exactly 1 item
      if (ev.altKey && items.length === 1) {
        await handleItem(items[0]);
        return;
      }

      const sel = await pickFromList(items, { title: 'Select Media', filterable: true });
      if (!sel) return;
      await handleItem(sel);
    } catch (e) {
      alert(e?.message || String(e));
    } finally {
      setFabBusy(false);
    }
  });

  // Progress card
  function makeProgress(title, src, { stoppable = false, onStop, onCancel, segs = 0 } = {}) {
    if (!CFG.IS_TOP) {
      // Proxy to Top
      const id = uid();
      const job = {
        update(p, txt) {
          window.top.postMessage({ type: 'SG_PROGRESS_UPDATE', payload: { id, p, txt } }, '*');
        },
        done(ok, msg) {
          window.top.postMessage({ type: 'SG_PROGRESS_DONE', payload: { id, ok, msg } }, '*');
        },
        remove() { /* No op, done handles it? Or send explicit remove? */ }
      };

      // Register for control callbacks
      PICKER_REQS.set(id + '_ctrl', { onStop, onCancel });

      window.top.postMessage({
        type: 'SG_PROGRESS_START',
        payload: { id, title, src, stoppable } // 'segs' only used for UI text?
      }, '*');
      return job;
    }

    const div = document.createElement('div');
    div.className = 'umdl-job';
    div.innerHTML = `
    <div class="umdl-row">
      <div class="name" title="${escapeHtml(src)}">${escapeHtml(title)}</div>
      <div class="umdl-ctrls">
        ${stoppable ? `<button class="umdl-mini btn-stop" title="Pause">${ICONS.pause}</button>` : ''}
        <button class="umdl-mini btn-hide" title="Hide">${ICONS.hide}</button>
        <button class="umdl-mini btn-x" title="Cancel">${ICONS.cancel}</button>
      </div>
    </div>
    <div class="umdl-bar"><div class="umdl-fill"></div></div>
    <div class="umdl-row" style="margin-top:6px;font-size:11px"><span class="status" style="color:#999">${segs ? `${segs} segs` : ''}</span><span class="pct">0%</span></div>
  `;
    PROG_WRAP.appendChild(div);
    const fill = div.querySelector('.umdl-fill');
    const pct = div.querySelector('.pct');
    const btnX = div.querySelector('.btn-x');
    const btnStop = div.querySelector('.btn-stop');
    const btnHide = div.querySelector('.btn-hide');

    btnX.onclick = () => onCancel?.();

    if (btnStop) {
      btnStop.onclick = () => {
        const v = onStop?.();
        if (v === 'paused') {
          btnStop.innerHTML = ICONS.play;
          btnStop.title = 'Resume';
        } else if (v === 'resumed') {
          btnStop.innerHTML = ICONS.pause;
          btnStop.title = 'Pause';
        }
      };
    }

    btnHide.onclick = () => {
      const isMinimized = div.classList.toggle('minimized');
      btnHide.innerHTML = isMinimized ? ICONS.show : ICONS.hide;
      btnHide.title = isMinimized ? 'Show' : 'Hide';
    };

    return {
      update(p, txt = '') {
        const pc = Math.max(0, Math.min(100, Math.floor(p)));
        fill.style.width = pc + '%';
        pct.textContent = `${pc}%${txt ? ' ' + txt : ''}`;
      },
      done(ok = true, msg) {
        fill.style.background = ok ? '#10b981' : '#e74c3c';
        this.update(100, msg || (ok ? '✓' : '✗'));
        setTimeout(() => div.remove(), 2200);
      },
      remove() { div.remove(); }
    };
  }

  // Remote Card Helpers (Top)
  function createRemoteCard(id, title, src, sourceWin) {
    if (REMOTE_JOBS.has(id)) return;
    const card = makeProgress(title, src, {
      stoppable: true, // We assume stoppable if remote requests it? Or passed in payload?
      onStop: () => {
        sourceWin.postMessage({ type: 'SG_CMD_CONTROL', payload: { id, action: 'stop' } }, '*');
        return 'paused'; // UI assumes paused immediately? Sync issue. 
        // Actually Top UI updates button icon based on return value.
        // We might need to handle async state or just toggle blindly.
        // For now, let's toggle blindly.
      },
      onCancel: () => {
        sourceWin.postMessage({ type: 'SG_CMD_CONTROL', payload: { id, action: 'cancel' } }, '*');
        card.remove();
        REMOTE_JOBS.delete(id);
      }
    });
    // Extend card with ID ref if needed?
    REMOTE_JOBS.set(id, card);
  }
  function updateRemoteCard({ id, p, txt }) {
    const card = REMOTE_JOBS.get(id);
    if (card) card.update(p, txt);
  }
  function finishRemoteCard({ id, ok, msg }) {
    const card = REMOTE_JOBS.get(id);
    if (card) {
      card.done(ok, msg);
      if (ok) setTimeout(() => REMOTE_JOBS.delete(id), 2500);
      // On error/cancel, we might keep it or delete it. Done handles delete timeout.
    }
  }

  // =========================
  // M3U8 parsing via m3u8-parser
  // =========================
  const M3U8 = (typeof m3u8Parser !== 'undefined' ? m3u8Parser : (window.m3u8Parser || globalThis.m3u8Parser));
  function parseManifest(text) {
    if (!M3U8?.Parser) throw new Error('m3u8-parser not available');
    const parser = new M3U8.Parser();
    parser.push(text);
    parser.end();
    return parser.manifest;
  }
  function buildVariantsFromManifest(man, base) {
    const out = [];
    const pls = Array.isArray(man.playlists) ? man.playlists : [];
    for (const p of pls) {
      if (!p?.uri) continue;
      const a = p.attributes || {};
      const w = a.RESOLUTION?.width ?? null;
      const h = a.RESOLUTION?.height ?? null;
      const res = (w && h) ? `${w}x${h}` : null;
      out.push({
        url: safeAbs(p.uri, base),
        res, w, h,
        peak: a.BANDWIDTH != null ? parseInt(a.BANDWIDTH, 10) : null,
        avg: a['AVERAGE-BANDWIDTH'] != null ? parseInt(a['AVERAGE-BANDWIDTH'], 10) : null,
        codecs: a.CODECS || null,
      });
    }
    return out;
  }
  function rangeHeaderFromByterange(br, fallbackStart = 0) {
    if (!br || typeof br.length !== 'number') return { header: null, next: fallbackStart };
    const start = (typeof br.offset === 'number') ? br.offset : fallbackStart;
    const end = start + br.length - 1;
    return { header: `bytes=${start}-${end}`, next: end + 1 };
  }
  function buildMediaFromManifest(man, base) {
    const segs = [];
    const srcSegs = Array.isArray(man.segments) ? man.segments : [];
    let lastNext = 0;
    let prevMapSig = null;
    for (let i = 0; i < srcSegs.length; i++) {
      const s = srcSegs[i];

      // Segment byterange -> Range header
      let rangeHeader = null;
      if (s.byterange) {
        const r = rangeHeaderFromByterange(s.byterange, lastNext);
        rangeHeader = r.header;
        lastNext = r.next;
      } else {
        lastNext = 0;
      }

      // Init map (fMP4)
      let map = null;
      let needMap = false;
      if (s.map?.uri) {
        const mapUri = safeAbs(s.map.uri, base);
        let mRange = null;
        if (s.map.byterange) {
          const mr = rangeHeaderFromByterange(s.map.byterange, 0);
          mRange = mr.header;
        }
        map = { uri: mapUri, rangeHeader: mRange };
        const sig = `${mapUri}|${mRange || ''}`;
        needMap = (sig !== prevMapSig);
        if (needMap) prevMapSig = sig;
      }

      // Key
      let key = null;
      if (s.key?.method && s.key.method !== 'NONE') {
        key = {
          method: String(s.key.method).toUpperCase(),
          uri: s.key.uri ? safeAbs(s.key.uri, base) : null,
          iv: s.key.iv || null
        };
      }

      segs.push({
        uri: safeAbs(s.uri, base),
        dur: s.duration || 0,
        range: rangeHeader,
        key,
        map,
        needMap
      });
    }
    return { segs, mediaSeq: man.mediaSequence || 0, endList: !!man.endList };
  }
  function computeExactBytesFromSegments(parsed) {
    let exact = true;
    let total = 0;
    const seenInit = new Set();
    for (const s of parsed.segs) {
      if (s.range) {
        const r = parseRange(s.range);
        if (!r || r.end == null) { exact = false; } else { total += (r.end - r.start + 1); }
      } else exact = false;

      if (s.needMap && s.map) {
        if (s.map.rangeHeader) {
          const key = `${s.map.uri}|${s.map.rangeHeader}`;
          if (!seenInit.has(key)) {
            seenInit.add(key);
            const mr = parseRange(s.map.rangeHeader);
            if (!mr || mr.end == null) exact = false;
            else total += (mr.end - mr.start + 1);
          }
        } else exact = false;
      }
    }
    return exact ? total : null;
  }
  function estimateHlsFromManifest(man, base, variant = null) {
    const parsed = buildMediaFromManifest(man, base);
    const seconds = (Array.isArray(man.segments) ? man.segments : []).reduce((a, s) => a + (s.duration || 0), 0);
    const vod = !!man.endList;
    const brBytes = computeExactBytesFromSegments(parsed);
    if (brBytes != null) return { bytes: brBytes, seconds, vod, via: 'byterange' };
    const bw = variant?.avg ?? variant?.peak ?? null;
    if (vod && bw && seconds > 0) return { bytes: Math.round((bw / 8) * seconds), seconds, vod, via: 'avg-bw' };
    return { bytes: null, seconds, vod, via: 'unknown' };
  }

  // =========================
  // Build items
  // =========================
  // =========================
  // Build items
  // =========================
  async function buildItems() {
    // Return unified list from STATE
    // Sorting: Videos first? Or timestamp?
    return Array.from(STATE.items.values()).reverse();
  }

  async function handleItem(it) {
    if (it.isRemote && it.remoteWin) {
      if (it.remoteWin.closed) { alert('Source frame is gone'); return; }
      // Ask slave to download
      // For HLS master playlist, we might want to ask slave to list variants?
      // Currently implementing direct variant selection in slave logic or simple trigger.
      // For simplicity: If it's a generic HLS, we trigger downloadHls on slave.
      // Slave will do the variant fetching/prompting? 
      // Wait, UI is on master. Slave can't prompt.
      // If HLS, we might need to fetch variants via Master.
      // Complex case: Remote HLS. Master parses manifest?
      // If URL is Http, Master can fetch manifest. If Blob, Master can't.

      if (it.kind === 'hls' && !isBlob(it.url)) {
        // Master can handle it directly if public URL
        return downloadHls(it.url);
      }
      if (it.kind === 'video' && !isBlob(it.url)) {
        return downloadDirect(it.url);
      }

      // Blob or otherwise restricted: Send command
      it.remoteWin.postMessage({
        type: 'SG_CMD_DOWNLOAD',
        payload: { url: it.url, kind: it.kind, variant: it.variant }
      }, '*');
      return;
    }

    // Local handling
    if (it.kind === 'video') return downloadDirect(it.url);
    if (it.kind === 'variant') return downloadHls(it.url, it.variant);
    if (it.kind === 'hls') return downloadHls(it.url);
  }

  // =========================
  // Direct video download (GM_download)
  // =========================
  async function downloadDirect(url) {
    log('Direct:', url);
    const info = BLOBS.get(url);
    const ext = guessExt(url, info?.type);
    const fn = `${cleanName(document.title)}.${ext}`;

    const card = makeProgress(fn, url, { onCancel: () => card.remove() }); // GM_download cancellation tricky, simple UI remove

    let dlUrl = url;
    let cleanup = () => { };

    if (info?.blob) {
      dlUrl = URL.createObjectURL(info.blob);
      cleanup = () => URL.revokeObjectURL(dlUrl);
    }

    GM_download({
      url: dlUrl,
      name: fn,
      onprogress: (e) => {
        if (e.lengthComputable) {
          card.update((e.loaded / e.total) * 100, `${fmtBytes(e.loaded)}/${fmtBytes(e.total)}`);
        } else {
          card.update(0, fmtBytes(e.loaded));
        }
      },
      onload: () => {
        card.update(100, ''); card.done(true);
        cleanup();
        GM_notification({ text: 'Download complete: ' + fn, title: 'StreamGrabber', timeout: 3000 });
      },
      onerror: (e) => {
        card.done(false, 'Failed');
        cleanup();
      },
      ontimeout: () => {
        card.done(false, 'Timeout');
        cleanup();
      }
    });
  }

  // =========================
  // File writer (stream to disk when supported)
  // =========================
  async function makeFileWriter(suggestedName, mime) {
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName });
        const stream = await handle.createWritable();
        return {
          write: (chunk) => stream.write(chunk),
          close: () => stream.close(),
          abort: () => stream.abort?.()
        };
      } catch {
        // fallthrough to in-memory
      }
    }
    // Fallback: in-memory (GM_download)
    const chunks = [];
    return {
      write: (chunk) => { chunks.push(chunk); return Promise.resolve(); },
      close: () => {
        const blob = new Blob(chunks, { type: mime });
        const u = URL.createObjectURL(blob);
        GM_download({
          url: u,
          name: suggestedName,
          onload: () => {
            URL.revokeObjectURL(u);
            GM_notification({ text: 'Download complete: ' + suggestedName, title: 'StreamGrabber', timeout: 3000 });
          },
          onerror: () => URL.revokeObjectURL(u)
        });
      },
      abort: () => { chunks.length = 0; }
    };
  }

  // =========================
  // HLS download (via m3u8-parser, streamed writer)
  // =========================
  async function downloadHls(url, preVariant = null) {
    log('HLS:', url);
    const txt = await getText(url);
    const man = parseManifest(txt);

    let mediaUrl = url, chosenVariant = preVariant;

    // Master playlist: prompt for variant
    if (Array.isArray(man.playlists) && man.playlists.length > 0) {
      const variants = buildVariantsFromManifest(man, url).sort((a, b) => (b.h || 0) - (a.h || 0) || (b.avg || b.peak || 0) - (a.avg || a.peak || 0));
      if (!variants.length) throw new Error('No variants found');

      const items = [];
      for (const v of variants) {
        let label = [v.res, (v.avg || v.peak) ? `${Math.round((v.avg || v.peak) / 1000)}k` : null].filter(Boolean).join(' • ') || 'Variant';
        let size = null;
        try {
          const mediaTxt = await getText(v.url);
          const vMan = parseManifest(mediaTxt);
          const est = estimateHlsFromManifest(vMan, v.url, v);
          if (est.bytes != null) size = est.bytes;
          if (size != null) label += ` • ~${fmtBytes(size)}`;
        } catch { }
        items.push({ kind: 'variant', url: v.url, label, variant: v, size });
      }

      const selected = await pickFromList(items, { title: 'Select Quality', filterable: true });
      if (!selected) return;
      chosenVariant = selected.variant; mediaUrl = selected.url;
    }

    // Media playlist
    const mediaTxt = await getText(mediaUrl);
    const mediaMan = parseManifest(mediaTxt);
    if (!Array.isArray(mediaMan.segments) || mediaMan.segments.length === 0) throw new Error('Invalid playlist');
    const parsed = buildMediaFromManifest(mediaMan, mediaUrl);
    if (!parsed.segs.length) throw new Error('No segments');

    const isFmp4 = parsed.segs.some(s => s.map) || /\.m4s(\?|$)/i.test(parsed.segs[0].uri);
    const ext = isFmp4 ? 'mp4' : 'ts';
    const name = cleanName(document.title);
    const q = chosenVariant?.res ? `_${chosenVariant.res}` : '';
    const filename = `${name}${q}.${ext}`;
    await downloadSegments(parsed, filename, ext, isFmp4, url);
  }

  async function downloadSegments(parsed, filename, ext, isFmp4, srcUrl) {
    const segs = parsed.segs;
    const total = segs.length;
    let paused = false, canceled = false, ended = false;
    const attempts = new Uint8Array(total);
    const status = new Int8Array(total); // 0=queued,1=loading,2=done,-1=failed
    const inflight = new Map(); // idx -> req
    const inprog = new Map(); // idx -> {loaded,total}
    const buffers = new Map(); // idx -> Uint8Array (ready for ordered write)
    let done = 0, active = 0, nextIdx = 0, writePtr = 0, byteDone = 0, avgLen = 0;

    const retryQ = new Set();
    const enqueueRetry = (i) => { retryQ.add(i); };
    const takeRetry = () => {
      const it = retryQ.values().next();
      if (it.done) return -1;
      const v = it.value;
      retryQ.delete(v);
      return v;
    };

    const mime = isFmp4 ? 'video/mp4' : 'video/mp2t';
    const writer = await makeFileWriter(filename, mime);

    const card = makeProgress(filename, srcUrl, {
      stoppable: true,
      segs: total,
      onStop() { paused = !paused; if (!paused) pump(); return paused ? 'paused' : 'resumed'; },
      onCancel() {
        canceled = true;
        abortAll();
        try { writer.abort?.(); } catch { }
        card.remove();
      }
    });

    // caches for keys/maps
    const keyCache = new Map(), keyInflight = new Map();
    const mapCache = new Map(), mapInflight = new Map();
    const onceKey = (k, fn) => once(keyCache, keyInflight, k, fn);
    const onceMap = (k, fn) => once(mapCache, mapInflight, k, fn);

    const draw = (() => {
      let raf = 0;
      return () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          let partial = 0;
          inprog.forEach(({ loaded, total }) => {
            if (total > 0) partial += Math.min(1, loaded / total);
            else if (avgLen > 0) partial += Math.min(1, loaded / avgLen);
          });
          const pct = ((done + partial) / total) * 100;
          card.update(pct, `${done}/${total}`);
        });
      };
    })();

    function abortAll() {
      for (const [, r] of inflight) { try { r.abort?.(); } catch { } }
      inflight.clear(); inprog.clear();
    }
    function maybeFailFast(i) {
      if (status[i] === -1 && i === writePtr && !ended) {
        abortAll();
        finalize(false);
      }
    }
    function fail(i, why) {
      const a = ++attempts[i];
      if (a > CFG.RETRIES) {
        status[i] = -1; err(`Segment ${i} failed: ${why}`);
        maybeFailFast(i);
      } else {
        status[i] = 0;
        enqueueRetry(i);
      }
    }
    async function fetchKeyBytes(s) {
      if (!s.key || s.key.method !== 'AES-128' || !s.key.uri) return null;
      return onceKey(s.key.uri, async () => new Uint8Array(await getBin(s.key.uri)));
    }
    async function fetchMapBytes(s) {
      if (!s.needMap || !s.map?.uri) return null;
      const id = `${s.map.uri}|${s.map.rangeHeader || ''}`;
      return onceMap(id, async () => {
        const headers = s.map.rangeHeader ? { Range: s.map.rangeHeader } : {};
        return new Uint8Array(await getBin(s.map.uri, headers));
      });
    }

    let writing = Promise.resolve();
    function queueFlush() {
      writing = writing.then(async () => {
        while (buffers.has(writePtr)) {
          const chunk = buffers.get(writePtr);
          buffers.delete(writePtr);
          await writer.write(chunk);
          writePtr++;
        }
      });
    }

    async function handleSeg(i) {
      const s = segs[i];
      status[i] = 1; active++;
      if (s.key && s.key.method && s.key.method !== 'AES-128') {
        active--; status[i] = -1; err('Unsupported key method', s.key.method); maybeFailFast(i); check(); return;
      }
      const headers = s.range ? { Range: s.range } : {};
      const req = gmGet({
        url: s.uri, responseType: 'arraybuffer', headers, timeout: CFG.REQ_MS,
        onprogress: (e) => { inprog.set(i, { loaded: e?.loaded || 0, total: e?.total || 0 }); draw(); }
      });
      inflight.set(i, req);
      let buf;
      try {
        buf = await req;
        // decrypt?
        const kb = await fetchKeyBytes(s);
        if (kb) {
          const iv = s.key.iv ? hexToU8(s.key.iv) : ivFromSeq(parsed.mediaSeq + i);
          buf = await aesCbcDec(buf, kb, iv);
        }
        let u8 = new Uint8Array(buf);
        // prepend init map?
        if (s.needMap) {
          const mapBytes = await fetchMapBytes(s);
          if (mapBytes?.length) {
            const join = new Uint8Array(mapBytes.length + u8.length);
            join.set(mapBytes, 0); join.set(u8, mapBytes.length);
            u8 = join;
          }
        }
        buffers.set(i, u8);
        inprog.delete(i);
        inflight.delete(i);
        status[i] = 2; active--; done++; byteDone += u8.length; avgLen = byteDone / Math.max(1, done);
        draw();
        queueFlush();
      } catch (e) {
        inprog.delete(i);
        inflight.delete(i);
        active--;
        fail(i, e?.message || 'net/decrypt');
      } finally {
        pump();
        check();
      }
    }

    function pump() {
      if (paused || canceled || ended) return;
      while (active < CFG.CONC) {
        let idx = takeRetry();
        if (idx === -1) {
          while (nextIdx < total && status[nextIdx] !== 0) nextIdx++;
          if (nextIdx < total) idx = nextIdx++;
        }
        if (idx === -1) break;
        handleSeg(idx);
      }
    }
    function check() {
      if (ended) return;
      if (status[writePtr] === -1) {
        abortAll();
        return finalize(false);
      }
      if (done === total) return finalize(true);
      if (!active && Array.prototype.some.call(status, v => v === -1)) return finalize(false);
    }
    async function finalize(ok) {
      if (ended) return; ended = true;
      try {
        queueFlush();
        await writing;
        if (ok) {
          await writer.close();
          card.update(100, ''); card.done(true);
        } else {
          try { await writer.abort?.(); } catch { }
          card.done(false);
        }
      } catch (e) {
        err('finalize', e);
        card.done(false);
      } finally {
        for (const [, r] of inflight) { try { r.abort?.(); } catch { } }
        inflight.clear(); inprog.clear();
      }
    }
    pump();
  }

  // =========================
  // Escape helper (UI)
  // =========================
  const _escapeDiv = document.createElement('div');
  function escapeHtml(x) { _escapeDiv.textContent = x == null ? '' : String(x); return _escapeDiv.innerHTML; }

  // startup
  mountUI();
})();
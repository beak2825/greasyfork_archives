// ==UserScript==
// @name         Letterboxd → FLAM (Fenlight)..
// @namespace    http://tampermonkey.net/
// @version      15.8.4
// @description  Send Letterboxd lists
// @match        https://letterboxd.com/*/list/*
// @match        https://letterboxd.com/*/watchlist/*
// @include      /^https:\/\/letterboxd\.com\/[^\/]+\/list\/[^\/]+\/.*$/
// @include      /^https:\/\/letterboxd\.com\/[^\/]+\/watchlist\/.*$/
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      *
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547963/Letterboxd%20%E2%86%92%20FLAM%20%28Fenlight%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547963/Letterboxd%20%E2%86%92%20FLAM%20%28Fenlight%29.meta.js
// ==/UserScript==

/*
  Changes (5.8.4):
  - FLAM prompt: keep buttons GREY by default (including when focused). Only hover/touch/click flips to white.
  - Added thin white border on the panel (kept from 5.8.3). Everything else unchanged.
*/

(async function () {
  'use strict';

  // ────────────────────────────────────────────────────────────────────────
  // Guards
  // ────────────────────────────────────────────────────────────────────────
  if (window.top !== window.self) return;

  function isTargetAllowedPage() {
    const p = location.pathname.replace(/\/+$/, '/');
    const isListTree      = /^\/[^/]+\/list\/[^/]+\/(?:.*)?$/.test(p);
    const isWatchlistTree = /^\/[^/]+\/watchlist\/(?:.*)?$/.test(p);
    return isListTree || isWatchlistTree;
  }
  if (!isTargetAllowedPage()) return;

  // ────────────────────────────────────────────────────────────────────────
  // Config
  // ────────────────────────────────────────────────────────────────────────
  const TMDB_API_KEY = 'f090bb54758cabf231fb605d3e3e0468';

  const DEFAULT_BATCH_SIZE = 5;
  const DEFAULT_PAUSE_MS = 150;
  const DEFAULT_FINALRETRY_DELAY = 300;
  const DEFAULT_FINALRETRY_MIN_LIST_SIZE = 400;

  const LBD_MAX_RETRIES = 3;
  const LBD_BACKOFF_BASE = 200;
  const TMDB_MAX_RETRIES = 3;
  const TMDB_BACKOFF_BASE = 200;

  const CACHE_KEY = 'lbd_tmdb_cache_overrides';
  const CACHE_BACKUP_KEY = 'lbd_tmdb_cache_backup';

  const DEFAULT_DESCRIPTION = '';
  const RUNTIME_TOL_MIN = 3;

  const POSTER_ENABLE_DEFAULT = true;
  const POSTER_STRATEGY_DEFAULT = 'first_4';
  const FANART_ENABLE_DEFAULT = true;
  const FANART_STRATEGY_DEFAULT = 'author_fanart';
  const FANART_FALLBACK_DEFAULT = 'first_4';

  const BASE_BIN_URL_DEFAULT = 'https://raw.githubusercontent.com/hcgiub001/letterboxd-tmdb-cache/main/lbd_tmdb_pairs_u32.bin';
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  const MEDIA_TYPE_DEFAULT_FIXED = 'm';
  const MAX_LIST_ITEMS = 5000;

  const CONCURRENCY_PAGE_FETCH = 3;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function GM_GetOrSet(key, def) { const v = GM_getValue(key); return (typeof v === 'undefined') ? def : v; }

  // ────────────────────────────────────────────────────────────────────────
  // Text helpers
  // ────────────────────────────────────────────────────────────────────────
  const normalizeText = (s) => (s || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  function stripDiacritics(s) { return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function normalizeTitle(s) { return stripDiacritics(s).toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim(); }
  function normalizeName(s) { return stripDiacritics(s).toLowerCase().replace(/\s+/g, ' ').trim(); }
  function utf8ByteLen(str) { try { return new TextEncoder().encode(str).length; } catch { return unescape(encodeURIComponent(str)).length; } }

  // ────────────────────────────────────────────────────────────────────────
  // Gzip+Base64 helper
  // ────────────────────────────────────────────────────────────────────────
  async function gzipBase64(str) {
    try {
      const enc = new TextEncoder().encode(str);
      const cs = new CompressionStream('gzip');
      const compressed = new Blob([enc]).stream().pipeThrough(cs);
      const ab = await new Response(compressed).arrayBuffer();
      const u8 = new Uint8Array(ab);
      let bin = '';
      for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
      return btoa(bin);
    } catch {
      return null;
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // Description & author helpers
  // ────────────────────────────────────────────────────────────────────────
  function htmlToTextWithBreaks(html) {
    if (!html) return '';
    let t = html;
    t = t.replace(/<br\s*\/?>/gi, '\n');
    t = t.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
    t = t.replace(/<\/?p[^>]*>/gi, '');
    t = t.replace(/<li[^>]*>\s*/gi, '• ');
    t = t.replace(/<\/li>\s*/gi, '\n');
    t = t.replace(/<\/?ul[^>]*>/gi, '');
    t = t.replace(/<\/?ol[^>]*>/gi, '');
    t = t.replace(/<[^>]+>/g, '');
    const ta = document.createElement('textarea');
    ta.innerHTML = t.replace(/&nbsp;/gi, '\u00A0');
    t = ta.value;
    t = t.replace(/\u00A0/g, ' ');
    t = t.replace(/\r\n/g, '\n').replace(/^\s+/, '').replace(/\s+$/, '');
    return t;
  }
  function getListNameFromPage() {
    const h1Preferred = document.querySelector('h1.title-1.prettify');
    const prefer = normalizeText(h1Preferred?.textContent);
    if (prefer) return prefer;
    const h1Alt = document.querySelector('h1.headline-1') || document.querySelector('h1');
    return normalizeText(h1Alt?.textContent) || 'Letterboxd List';
  }
  function getListDescriptionFromPage() {
    const div = document.querySelector('div.body-text.-prose.-hero.clear.js-collapsible-text');
    if (!div) return '';
    return htmlToTextWithBreaks(div.innerHTML);
  }
  function sanitizeDescPreservingBreaks(s) {
    if (!s) return '';
    return s.replace(/\u00A0/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ')
      .trim();
  }
  function getListAuthorFromPage() {
    const span = document.querySelector('span[itemprop="name"]');
    return normalizeText(span?.textContent) || '';
  }

  // NEW: watchlist helpers
  function isListPage() { return /\/list\//.test(location.pathname); }
  function isWatchlistPage() { return /\/watchlist\//.test(location.pathname); }
  function getUsernameFromPath() {
    const m = location.pathname.match(/^\/([^/]+)\//);
    return m ? m[1] : '';
  }
  function getWatchlistListNamePretty() {
    const username = getUsernameFromPath();
    return username ? `${username} WATCHLIST` : 'WATCHLIST';
  }

  function getWatchlistAuthorFromPage(username) {
    try {
      username = username || getUsernameFromPath();
      if (!username) return '';

      let el = document.querySelector(`a[href="/${username}/"]`);
      let text = normalizeText(el?.textContent);

      if (!text) {
        const candidates = Array.from(document.querySelectorAll(`a[href="/${username}/"]`));
        let best = '';
        for (const a of candidates) {
          const t = normalizeText(a.textContent);
          if (!t) continue;
          if (t.toLowerCase() !== username.toLowerCase()) {
            if (t.length > best.length) best = t;
          } else if (!best) best = t;
        }
        text = best;
      }

      if (!text) {
        const og = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const m = og.match(/Watchlist of\s+(.+?)\s+•/i);
        if (m && m[1]) text = normalizeText(m[1]);
      }

      if (!text) {
        const title = document.title || '';
        const m2 = title.match(/Watchlist of\s+(.+?)\s+•/i);
        if (m2 && m2[1]) text = normalizeText(m2[1]);
      }

      return text || '';
    } catch { return ''; }
  }

  // ────────────────────────────────────────────────────────────────────────
  // Fanart extractors
  // ────────────────────────────────────────────────────────────────────────
  function getAuthorFanartUrl() {
    const el = document.querySelector('div.backdropimage.js-backdrop-image');
    if (!el) return '';
    const bg = (getComputedStyle(el).backgroundImage || el.style.backgroundImage || '').trim();
    const m = bg.match(/url\(["']?([^"')]+)["']?\)/i);
    return m ? m[1] : '';
  }

  const USER_PROFILE_META_CACHE = Object.create(null);

  async function fetchUserProfileMeta(username) {
    if (!username) username = getUsernameFromPath();
    if (!username) return { fanartUrl: '', bioText: '' };
    if (USER_PROFILE_META_CACHE[username]) return USER_PROFILE_META_CACHE[username];

    try {
      const url = `${location.origin}/${username}/`;
      const r = await fetch(url, { credentials: 'include' });
      if (!r.ok) {
        USER_PROFILE_META_CACHE[username] = { fanartUrl: '', bioText: '' };
        return USER_PROFILE_META_CACHE[username];
      }
      const html = await r.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      let fanartUrl = '';
      const backdrop = doc.querySelector('#backdrop');
      if (backdrop) {
        fanartUrl = backdrop.getAttribute('data-backdrop') || '';
      }
      if (!fanartUrl) {
        const el = doc.querySelector('div.backdropimage.js-backdrop-image');
        if (el) {
          const style = el.getAttribute('style') || '';
          const m = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
          if (m) fanartUrl = m[1];
        }
      }

      let bioText = '';
      const bioEl = doc.querySelector('div.collapsible-text.js-collapsible-text.body-text.-small');
      if (bioEl) bioText = htmlToTextWithBreaks(bioEl.innerHTML);

      USER_PROFILE_META_CACHE[username] = { fanartUrl, bioText };
      return USER_PROFILE_META_CACHE[username];
    } catch {
      USER_PROFILE_META_CACHE[username] = { fanartUrl: '', bioText: '' };
      return USER_PROFILE_META_CACHE[username];
    }
  }

  async function fetchUserProfileFanartUrl(username) {
    const meta = await fetchUserProfileMeta(username);
    return meta.fanartUrl || '';
  }
  async function fetchUserProfileBio(username) {
    const meta = await fetchUserProfileMeta(username);
    return meta.bioText || '';
  }

  // ────────────────────────────────────────────────────────────────────────
  // IndexedDB (v2) – overrides + base
  // ────────────────────────────────────────────────────────────────────────
  function openDB() {
    return new Promise((resolve, reject) => {
      const rq = indexedDB.open('FenlightCacheDB', 2);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains('tmdbCache')) db.createObjectStore('tmdbCache');
        if (!db.objectStoreNames.contains('tmdbBase')) db.createObjectStore('tmdbBase');
      };
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => reject(rq.error);
    });
  }
  async function getCache(key = CACHE_KEY) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('tmdbCache', 'readonly');
      const rq = tx.objectStore('tmdbCache').get(key);
      rq.onsuccess = () => res(rq.result || {}); rq.onerror = () => rej(rq.error);
    });
  }
  async function setCache(obj, key = CACHE_KEY) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('tmdbCache', 'readwrite');
      const rq = tx.objectStore('tmdbCache').put(obj, key);
      rq.onsuccess = () => res(); rq.onerror = () => rej(rq.error);
    });
  }
  async function clearCache() {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('tmdbCache', 'readwrite');
      const rq = tx.objectStore('tmdbCache').delete(CACHE_KEY);
      rq.onsuccess = () => res(); rq.onerror = () => rej(rq.error);
    });
  }
  async function getBaseFromIDB() {
    const db = await openDB();
    const tx = db.transaction('tmdbBase', 'readonly');
    const store = tx.objectStore('tmdbBase');
    const bufP = new Promise((res, rej) => { const r = store.get('base_bin'); r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error); });
    const etgP = new Promise((res, rej) => { const r = store.get('base_etag'); r.onsuccess = () => res(r.result || ''); r.onerror = () => rej(r.error); });
    const [buf, etag] = await Promise.all([bufP, etgP]);
    return { buf, etag };
  }
  async function putBaseToIDB(buf, etag) {
    const db = await openDB();
    const tx = db.transaction('tmdbBase', 'readwrite');
    await Promise.all([
      new Promise((res, rej) => { const r = tx.objectStore('tmdbBase').put(buf, 'base_bin'); r.onsuccess = res; r.onerror = () => rej(r.error); }),
      new Promise((res, rej) => { const r = tx.objectStore('tmdbBase').put(etag || '', 'base_etag'); r.onsuccess = res; r.onerror = () => rej(r.error); }),
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Binary base cache loader (packed)
  // ────────────────────────────────────────────────────────────────────────
  function baseBinUrl() { return BASE_BIN_URL_DEFAULT; }

  let BASE_PAIRS_U32 = null;
  let BASE_COUNT = 0;

  async function loadBaseBinOnce({ allowRevalidate = false } = {}) {
    if (!BASE_PAIRS_U32) {
      const { buf } = await getBaseFromIDB();
      if (buf && buf.byteLength) {
        const u32 = new Uint32Array(buf);
        if (u32.length % 2 === 0) {
          BASE_PAIRS_U32 = u32;
          BASE_COUNT = u32.length >>> 1;
        }
      }
    }
    if (!allowRevalidate) return;

    const { etag } = await getBaseFromIDB();
    await new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: baseBinUrl(),
        headers: etag ? { 'If-None-Match': etag } : {},
        responseType: 'arraybuffer',
        onload: async (res) => {
          try {
            if (res.status === 304) {
              GM_setValue('baseLastRevalidateTs', Date.now());
              resolve(); return;
            }
            if (res.status >= 200 && res.status < 300 && res.response) {
              const newBuf = res.response;
              const u32 = new Uint32Array(newBuf);
              if (u32.length % 2 === 0) {
                BASE_PAIRS_U32 = u32;
                BASE_COUNT = u32.length >>> 1;
                const m = String(res.responseHeaders || '').match(/etag:\s*(.+)/i);
                const newEtag = m ? m[1].trim() : '';
                try { await putBaseToIDB(newBuf, newEtag); } catch {}
              }
              GM_setValue('baseLastRevalidateTs', Date.now());
            }
          } finally { resolve(); }
        },
        onerror: () => { resolve(); },
        ontimeout: () => { resolve(); },
      });
    });
  }

  async function refreshBaseBinNow() {
    await new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: baseBinUrl(),
        responseType: 'arraybuffer',
        onload: async (res) => {
          try {
            if (res.status >= 200 && res.status < 300 && res.response) {
              const newBuf = res.response;
              const u32 = new Uint32Array(newBuf);
              if (u32.length % 2 === 0) {
                BASE_PAIRS_U32 = u32;
                BASE_COUNT = u32.length >>> 1;
                const m = String(res.responseHeaders || '').match(/etag:\s*(.+)/i);
                const newEtag = m ? m[1].trim() : '';
                try { await putBaseToIDB(newBuf, newEtag); } catch {}
                GM_setValue('baseLastRevalidateTs', Date.now());
                alert('✅ Base cache refreshed.');
              } else {
                alert('❌ Base cache corrupt (odd length).');
              }
            } else {
              alert(`❌ Base cache HTTP ${res.status}.`);
            }
          } finally { resolve(); }
        },
        onerror: () => { alert('❌ Base cache network error.'); resolve(); },
        ontimeout: () => { alert('❌ Base cache request timed out.'); resolve(); },
      });
    });
  }

  async function maybeRevalidateBaseMonthly() {
    try {
      const last = GM_GetOrSet('baseLastRevalidateTs', 0);
      const now = Date.now();
      if (now - last >= THIRTY_DAYS_MS) {
        await loadBaseBinOnce({ allowRevalidate: true });
        GM_setValue('baseLastRevalidateTs', Date.now());
      }
    } catch {}
  }
  setTimeout(() => { maybeRevalidateBaseMonthly(); }, 0);

  // ────────────────────────────────────────────────────────────────────────
  // Packed helpers & two-tier access
  // ────────────────────────────────────────────────────────────────────────
  function baseLookupPacked(idNum) {
    if (!BASE_PAIRS_U32) return undefined;
    let lo = 0, hi = BASE_COUNT - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const k = BASE_PAIRS_U32[mid << 1];
      if (k === idNum) return BASE_PAIRS_U32[(mid << 1) + 1];
      if (k < idNum) lo = mid + 1; else hi = mid - 1;
    }
    return undefined;
  }
  function unpack(packed) {
    return { isTv: (packed & 1) === 1, tmdbId: packed >>> 1 };
  }

  let LOCAL_OVERRIDES = null;
  let DIRTY_OVERRIDES = false;

  async function loadLocalOverridesOnce() {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = await getCache(CACHE_KEY);
  }
  function overrideGetPacked(filmIdStr) {
    const v = LOCAL_OVERRIDES ? LOCAL_OVERRIDES[filmIdStr] : undefined;
    return Number.isFinite(v) ? v : undefined;
  }
  function overrideSetPacked(filmIdStr, tmdbId, isTv) {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = {};
    const newPacked = (tmdbId << 1) | (isTv ? 1 : 0);
    const prev = LOCAL_OVERRIDES[filmIdStr];
    if (!Number.isFinite(prev) || prev !== newPacked) {
      LOCAL_OVERRIDES[filmIdStr] = newPacked;
      DIRTY_OVERRIDES = true;
    }
  }
  async function persistOverrides({ alsoBackup = true } = {}) {
    if (!DIRTY_OVERRIDES) return false;
    await setCache(LOCAL_OVERRIDES, CACHE_KEY);
    if (alsoBackup) {
      try {
        const snap = JSON.parse(JSON.stringify(LOCAL_OVERRIDES || {}));
        await setCache(snap, CACHE_BACKUP_KEY);
      } catch {}
    }
    DIRTY_OVERRIDES = false;
    return true;
  }

  function getFromAnyCachePacked(filmIdStr) {
    const vLocal = overrideGetPacked(filmIdStr);
    if (vLocal !== undefined) return vLocal;
    const idNum = Number(filmIdStr);
    if (Number.isFinite(idNum)) return baseLookupPacked(idNum);
    return undefined;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Kodi sender
  // ────────────────────────────────────────────────────────────────────────
  function sendToKodi(url) {
    const ip = GM_getValue('kodiIp', '').trim();
    const port = GM_getValue('kodiPort', '').trim();
    const user = GM_getValue('kodiUser', '');
    const pass = GM_GetOrSet('kodiPass', '');

    return new Promise((resolve) => {
      if (!ip || !port) {
        alert('⚠️ Please configure Kodi IP & port in settings.');
        resolve(false);
        return;
      }
      GM_xmlhttpRequest({
        method: 'POST',
        url: `http://${ip}:${port}/jsonrpc`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${user}:${pass}`)
        },
        data: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'Player.Open',
          params: { item: { file: url } }
        }),
        timeout: 15000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(true);
          else { alert(`❌ Kodi responded with status ${res.status}.`); resolve(false); }
        },
        onerror: () => { alert('❌ Failed to contact Kodi.'); resolve(false); },
        ontimeout: () => { alert('❌ Kodi request timed out.'); resolve(false); }
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // UI helpers
  // ────────────────────────────────────────────────────────────────────────
  function showSideInfoNearEl(el, lines, ms = 5000) {
    try { const prev = document.getElementById('kodi-send-info'); if (prev) prev.remove(); } catch {}
    const box = document.createElement('div');
    box.id = 'kodi-send-info';
    const MARGIN = 10;
    Object.assign(box.style, {
      position: 'fixed',
      top: '0px',
      right: '130px',
      background: '#1b1b1b',
      color: '#eee',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '8px 10px',
      fontSize: '12px',
      lineHeight: '1.4',
      zIndex: 2147483647,
      boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
      maxWidth: '360px',
      pointerEvents: 'none',
      whiteSpace: 'pre-wrap'
    });
    box.innerHTML = lines.join('\n');
    document.body.append(box);

    let topPx = 150;
    try {
      const rect = el.getBoundingClientRect();
      topPx = rect.top + 40;
      const boxH = box.offsetHeight;
      const maxTop = window.innerHeight - boxH - MARGIN;
      if (topPx > maxTop) topPx = rect.top - boxH - 10;
      topPx = Math.max(MARGIN, Math.min(maxTop, Math.round(topPx)));
    } catch {}
    box.style.top = `${topPx}px`;

    setTimeout(() => { try { box.remove(); } catch {} }, ms);
  }

  let PROCESS_BUBBLE_EL = null;
  function showOrUpdateProcessingBubble(targetEl, lines, persist = false) {
    const GAP = 10;
    if (!PROCESS_BUBBLE_EL) {
      PROCESS_BUBBLE_EL = document.createElement('div');
      PROCESS_BUBBLE_EL.id = 'kodi-processing-bubble';
      Object.assign(PROCESS_BUBBLE_EL.style, {
        position: 'fixed',
        background: '#1b1b1b',
        color: '#eee',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '8px 10px',
        fontSize: '12px',
        lineHeight: '1.4',
        zIndex: 2147483647,
        boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
        maxWidth: '360px',
        whiteSpace: 'pre-wrap',
      });
      document.body.append(PROCESS_BUBBLE_EL);
    }
    PROCESS_BUBBLE_EL.textContent = lines.join('\n');

    const rect = targetEl.getBoundingClientRect();
    const topPx = Math.max(0, Math.round(rect.top));
    const rightPx = Math.max(0, Math.round(window.innerWidth - rect.left + GAP));
    PROCESS_BUBBLE_EL.style.top = `${topPx}px`;
    PROCESS_BUBBLE_EL.style.right = `${rightPx}px`;
    PROCESS_BUBBLE_EL.dataset.persist = persist ? '1' : '0';
    PROCESS_BUBBLE_EL.style.display = 'block';
  }
  function hideProcessingBubble(force = false) {
    if (PROCESS_BUBBLE_EL) {
      if (force || PROCESS_BUBBLE_EL.dataset.persist !== '1') {
        PROCESS_BUBBLE_EL.remove();
        PROCESS_BUBBLE_EL = null;
      }
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // Action chooser — FLAM-styled (focus stays grey; hover/touch goes white)
  // ────────────────────────────────────────────────────────────────────────
  function askForActionOverlay() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.id = 'flam-action-overlay';
      Object.assign(overlay.style, {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.66)',
        display: 'grid', placeItems: 'center', zIndex: 2147483647,
        padding: '18px'
      });

      const panel = document.createElement('div');
      panel.className = 'flam-action-panel';
      Object.assign(panel.style, {
        position: 'relative',
        width: 'min(760px, 95vw)',
        background: 'linear-gradient(180deg,#2a2a2a 0,#1f1f1f 100%)',
        color: '#e8e8e8',
        border: '1px solid rgba(255,255,255,.85)',      // thin white border line
        borderRadius: '22px',
        boxShadow: '0 18px 44px rgba(0,0,0,.55)',
        padding: '28px 22px 20px'
      });

      const css = document.createElement('style');
      css.textContent = `
        #flam-action-overlay .flam-title {
          text-transform: uppercase;
          letter-spacing: .08em;
          text-align: center;
          font-weight: 700;
          color: #dcdcdc;
          font-size: 18px;
          margin: 0 0 12px;
        }
        #flam-action-overlay .flam-sub {
          text-align: center;
          color: #bdbdbd;
          font-size: 14px;
          margin-bottom: 18px;
        }
        #flam-action-overlay .flam-logo {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          object-fit: contain;
          background: #111;
          border: 1px solid #2b2b2b;
          box-shadow: 0 2px 10px rgba(0,0,0,.35);
        }
        #flam-action-overlay .choices {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 14px;
        }
        @media (max-width: 720px) {
          #flam-action-overlay .choices { grid-template-columns: 1fr; }
        }
        /* default state: dark grey with white text */
        #flam-action-overlay .choice-btn {
          appearance: none;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          padding: 18px 12px;
          background: #4b444b;      /* same grey as the “No” button */
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          box-shadow: inset 0 -2px 0 rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.25);
          cursor: pointer;
          transition: background .12s ease, color .12s ease, transform .06s ease, outline-color .12s ease;
          outline: none;
          width: 100%;
        }
        /* keep focus GREY; just show a subtle white ring for keyboard users */
        #flam-action-overlay .choice-btn:focus-visible {
          background: #4b444b;
          color: #ffffff;
          outline: 2px solid rgba(255,255,255,.9);
          outline-offset: 2px;
        }
        /* hover/touch/click goes WHITE with black text */
        #flam-action-overlay .choice-btn:hover,
        #flam-action-overlay .choice-btn.touching {
          background: #ffffff;
          color: #0b0b0b;
        }
        #flam-action-overlay .choice-btn:active { transform: translateY(1px); }
        #flam-action-overlay .footer { display:flex; justify-content:flex-end; margin-top:16px; }
        #flam-action-overlay .cancel-btn {
          background:#3a3a3a; color:#fff; border:none; border-radius:10px; padding:8px 12px; cursor:pointer;
        }
      `;
      panel.append(css);

      const logo = document.createElement('img');
      logo.className = 'flam-logo';
      try { if (typeof mainIcon !== 'undefined' && mainIcon && mainIcon.src) logo.src = mainIcon.src; } catch {}
      panel.append(logo);

      const title = document.createElement('div');
      title.className = 'flam-title';
      title.textContent = 'Send to FLAM';

      const sub = document.createElement('div');
      sub.className = 'flam-sub';
      sub.textContent = 'Choose what you want to do with this list';

      const choicesWrap = document.createElement('div');
      choicesWrap.className = 'choices';

      function mkBtn(label, value) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'choice-btn';
        b.textContent = label;
        b.addEventListener('pointerdown', () => b.classList.add('touching'), { passive: true });
        b.addEventListener('pointerup', () => b.classList.remove('touching'));
        b.addEventListener('pointercancel', () => b.classList.remove('touching'));
        b.addEventListener('click', (e) => { e.stopPropagation(); cleanup(value); });
        return b;
      }

      const btnView = mkBtn('View', 'view');
      const btnImport = mkBtn('Import', 'import');
      const btnBoth = mkBtn('Import + View', 'import_view');
      choicesWrap.append(btnView, btnImport, btnBoth);

      const footer = document.createElement('div');
      footer.className = 'footer';
      const cancel = document.createElement('button');
      cancel.className = 'cancel-btn';
      cancel.textContent = 'Cancel';
      cancel.addEventListener('click', () => cleanup(null));
      footer.append(cancel);

      panel.append(title, sub, choicesWrap, footer);
      overlay.append(panel);
      document.body.append(overlay);

      function onKey(e) { if (e.key === 'Escape') cleanup(null); }
      function onBackdrop(e) { if (e.target === overlay) cleanup(null); }
      overlay.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);

      // We keep initial focus for keyboard nav; CSS above keeps it grey.
      btnView.focus();

      function cleanup(val) {
        document.removeEventListener('keydown', onKey);
        try { overlay.remove(); } catch {}
        resolve(val);
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // TMDB & Lb helpers
  // ────────────────────────────────────────────────────────────────────────
  async function fetchLbdMetadata(item) {
    if (!item?.detailsEndpoint || item.title) return;
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(item.detailsEndpoint, { credentials: 'include' });
        if (r.ok) {
          const j = await r.json();
          item.title = j.name || '';
          item.year = j.releaseYear || '';
          item.originalName = j.originalName || '';
          item.runtime = (typeof j.runTime === 'number') ? j.runTime : null;
          item.directors = Array.isArray(j.directors) ? j.directors.map(d => d.name).filter(Boolean) : [];
          return;
        }
        if (r.status === 429) await new Promise(r => setTimeout(r, 200 * (i + 1)));
        else return;
      } catch {
        await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
  }
  async function fetchTmdbSearchResults(item) {
    if (!item?.title) { item.matches = []; return; }
    const url = `https://api.themoviedb.org/3/search/movie?` +
      new URLSearchParams({ api_key: TMDB_API_KEY, query: item.title, year: item.year });
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) {
          const d = await r.json();
          item.matches = Array.isArray(d.results) ? d.results : [];
          return;
        }
        if (r.status === 429) await new Promise(r => setTimeout(r, 200 * (i + 1)));
        else { item.matches = []; return; }
      } catch {
        await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
    item.matches = [];
  }
  async function fetchTmdbCredits(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?` +
      new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return r.json();
        if (r.status === 429) await new Promise(r => setTimeout(r, 200 * (i + 1)));
        else return null;
      } catch {
        await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
    return null;
  }
  async function fetchTmdbDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?` +
      new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return r.json();
        if (r.status === 429) await new Promise(r => setTimeout(r, 200 * (i + 1)));
        else return null;
      } catch {
        await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
    return null;
  }
  function extractDirectorNames(cred) {
    if (!cred || !Array.isArray(cred.crew)) return [];
    const out = [];
    for (const c of cred.crew) {
      const job = (c.job || '').toLowerCase();
      const dept = (c.department || '').toLowerCase();
      const looksDirector = dept === 'directing' || job.includes('director');
      if (looksDirector && c.name) out.push(normalizeName(c.name));
    }
    return Array.from(new Set(out));
  }

  async function resolveBestTmdbForItem(item) {
    const results = item.matches || [];
    const top = results[0] || null;

    const lbTitleNorm = normalizeTitle(item.title);
    const lbOrigNorm = normalizeTitle(item.originalName || '');
    const lbYearStr = String(item.year || '');
    const lbDirNormSet = new Set((item.directors || []).map(normalizeName));

    function tmdbYear(m) { const d = (m.release_date || '').slice(0, 4); return d || ''; }
    function tmdbTitleMatches(m) {
      const cand = [m.title, m.original_title].filter(Boolean);
      return cand.some(t => {
        const nt = normalizeTitle(t);
        return nt === lbTitleNorm || (lbOrigNorm && nt === lbOrigNorm);
      });
    }

    if (top && tmdbTitleMatches(top) && tmdbYear(top) !== lbYearStr) {
      const topCreds = await fetchTmdbCredits(top.id);
      const topDirs = extractDirectorNames(topCreds);
      const dirMatch = topDirs.some(n => lbDirNormSet.has(n));
      if (dirMatch) return top.id || '';
    }

    const exactTitleYear = results.filter(m => tmdbTitleMatches(m) && tmdbYear(m) === lbYearStr);
    if (exactTitleYear.length === 1) return exactTitleYear[0].id || '';
    if (exactTitleYear.length > 1) {
      const creditsList = await Promise.all(exactTitleYear.map(m => fetchTmdbCredits(m.id)));
      const dirMatches = [];
      for (let i = 0; i < exactTitleYear.length; i++) {
        const tmDirNames = extractDirectorNames(creditsList[i]);
        const matchNames = tmDirNames.filter(n => lbDirNormSet.has(n));
        if (matchNames.length) dirMatches.push({ idx: i, matchNames });
      }
      if (dirMatches.length === 1) return exactTitleYear[dirMatches[0].idx].id || '';
      const detailsList = await Promise.all(exactTitleYear.map(m => fetchTmdbDetails(m.id)));
      const rtMatches = [];
      for (let i = 0; i < exactTitleYear.length; i++) {
        const det = detailsList[i];
        if (!det || typeof det.runtime !== 'number' || typeof item.runtime !== 'number') continue;
        if (Math.abs(det.runtime - item.runtime) <= 3) rtMatches.push(i);
      }
      if (rtMatches.length === 1) return exactTitleYear[rtMatches[0]].id || '';
      if (top) return top.id || '';
      return exactTitleYear[0]?.id || '';
    }

    const exactTitleOnly = results.filter(m => tmdbTitleMatches(m));
    if (exactTitleOnly.length === 1) return exactTitleOnly[0].id || '';
    if (exactTitleOnly.length > 1) {
      const creditsList = await Promise.all(exactTitleOnly.map(m => fetchTmdbCredits(m.id)));
      const dirMatches = [];
      for (let i = 0; i < exactTitleOnly.length; i++) {
        const tmDirNames = extractDirectorNames(creditsList[i]);
        const matchNames = tmDirNames.filter(n => lbDirNormSet.has(n));
        if (matchNames.length) dirMatches.push({ idx: i, matchNames });
      }
      if (dirMatches.length === 1) return exactTitleOnly[dirMatches[0].idx].id || '';
      const detailsList = await Promise.all(exactTitleOnly.map(m => fetchTmdbDetails(m.id)));
      const rtMatches = [];
      for (let i = 0; i < exactTitleOnly.length; i++) {
        const det = detailsList[i];
        if (!det || typeof det.runtime !== 'number' || typeof item.runtime !== 'number') continue;
        if (Math.abs(det.runtime - item.runtime) <= 3) rtMatches.push(i);
      }
      if (rtMatches.length === 1) return exactTitleOnly[rtMatches[0]].id || '';
      if (results[0]) return results[0].id || '';
      if (exactTitleOnly.length) return exactTitleOnly[0].id || '';
    }

    if (results[0]) return results[0].id || '';
    return '';
  }

  // ────────────────────────────────────────────────────────────────────────
  // Scrape & pagination (3-thread pool)
  // ────────────────────────────────────────────────────────────────────────
  function scrapeFrom(doc) {
    return Array.from(doc.querySelectorAll('[data-details-endpoint][data-film-id]'))
      .map(ed => {
        const filmId = ed.getAttribute('data-film-id') || ed.dataset.filmId || '';
        const detailsEndpoint = ed.getAttribute('data-details-endpoint') || ed.dataset.detailsEndpoint || '';
        if (!filmId || !detailsEndpoint) return null;
        return {
          filmId,
          detailsEndpoint: location.origin + detailsEndpoint,
          title: '',
          year: '',
          originalName: '',
          directors: [],
          runtime: null,
          matches: [],
          tmdbId: '',
          isTv: false,
          listIndex: 0
        };
      })
      .filter(Boolean);
  }

  async function limitedFetchDocs(urls, limit = CONCURRENCY_PAGE_FETCH) {
    const results = new Array(urls.length);
    let next = 0, active = 0;
    return new Promise((resolve) => {
      const launch = () => {
        while (active < limit && next < urls.length) {
          const idx = next++, u = urls[idx]; active++;
          fetch(u, { credentials: 'include' })
            .then(r => r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)))
            .then(t => { results[idx] = new DOMParser().parseFromString(t, 'text/html'); })
            .catch(() => { results[idx] = new DOMParser().parseFromString('<html></html>', 'text/html'); })
            .finally(() => { active--; (next < urls.length) ? launch() : (active === 0 && resolve(results)); });
        }
      };
      urls.length ? launch() : resolve(results);
    });
  }

  async function scrapeAllItems_ListPages() {
    const pages = Array.from(document.querySelectorAll('li.paginate-page'))
      .map(li => parseInt(li.textContent, 10))
      .filter(n => n);
    const count = pages.length ? Math.max(...pages) : 1;

    const urls = [];
    const base = location.pathname.replace(/\/page\/\d+\/?$/, '').replace(/\/?$/, '/');
    for (let p = 1; p <= count; p++) urls.push(location.origin + base + (p > 1 ? `page/${p}/` : ''));

    const docs = await limitedFetchDocs(urls, CONCURRENCY_PAGE_FETCH);
    const items = docs.flatMap(scrapeFrom);
    items.forEach((it, idx) => { it.listIndex = idx + 1; });
    return items;
  }

  function scrapeNanogenreItems_CurrentPage() {
    const lis = document.querySelectorAll('section.genre-group ul.poster-list li[data-film-id], section.-themes ul.poster-list li[data-film-id], main ul.poster-list li[data-film-id][data-film-slug]');
    const items = []; let idx = 0;
    lis.forEach(li => {
      const filmId = li.getAttribute('data-film-id') || '';
      if (!filmId) return;
      const ed = li.querySelector('[data-details-endpoint]');
      const detailsEndpoint = ed ? (location.origin + ed.getAttribute('data-details-endpoint')) : '';
      const img = li.querySelector('img');
      const title = (img?.getAttribute('alt') || '').trim();
      const year = li.getAttribute('data-film-release-year') || '';
      items.push({
        filmId, detailsEndpoint, title, year, originalName: '',
        directors: [], runtime: null, matches: [], tmdbId: '', isTv: false, listIndex: ++idx
      });
    });
    return items;
  }

  async function scrapeItemsSmart() {
    if (isListPage() || isWatchlistPage()) return await scrapeAllItems_ListPages();
    const items = scrapeFrom(document);
    items.forEach((it, i) => it.listIndex = i + 1);
    return items;
  }

  async function processItems(items, providedOverrides = null) {
    await loadLocalOverridesOnce();
    if (providedOverrides) LOCAL_OVERRIDES = providedOverrides;

    const batchSize = parseInt(GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE), 10) || DEFAULT_BATCH_SIZE;
    const pauseMs = parseInt(GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS), 10) || DEFAULT_PAUSE_MS;

    const toFetch = [];
    items.forEach(it => {
      const packed = getFromAnyCachePacked(it.filmId);
      if (packed !== undefined) {
        const { tmdbId, isTv } = unpack(packed);
        it.tmdbId = tmdbId; it.isTv = isTv;
      } else toFetch.push(it);
    });

    const batches = [];
    for (let i = 0; i < toFetch.length; i += batchSize) {
      const batch = toFetch.slice(i, i + batchSize);
      batches.push((async () => {
        await Promise.all(batch.map(fetchLbdMetadata));
        await Promise.all(batch.map(fetchTmdbSearchResults));
        await Promise.all(batch.map(async it => {
          try { it.tmdbId = await resolveBestTmdbForItem(it); }
          catch (e) { console.error('resolveBestTmdbForItem failed:', it, e); it.tmdbId = ''; }
          if (it.tmdbId) { it.isTv = false; overrideSetPacked(it.filmId, it.tmdbId, it.isTv); }
        }));
      })());
      await sleep(pauseMs);
    }
    await Promise.all(batches);
    await persistOverrides({ alsoBackup: true });

    const minSize = parseInt(GM_GetOrSet('finalRetryMinListSize', DEFAULT_FINALRETRY_MIN_LIST_SIZE), 10) || 0;
    const unresolved = items.filter(it => !(it.tmdbId));

    if (items.length >= minSize && unresolved.length) {
      const delay = parseInt(GM_GetOrSet('finalRetryDelayMs', DEFAULT_FINALRETRY_DELAY), 10) || 0;
      if (delay > 0) await sleep(delay);

      const frBatches = [];
      for (let i = 0; i < unresolved.length; i += batchSize) {
        const batch = unresolved.slice(i, i + batchSize);
        frBatches.push((async () => {
          await Promise.all(batch.map(fetchLbdMetadata));
          await Promise.all(batch.map(async it => {
            const hasMatches = Array.isArray(it.matches) && it.matches.length > 0;
            if (!hasMatches && it.title) await fetchTmdbSearchResults(it);
          }));
          await Promise.all(batch.map(async it => {
            try { it.tmdbId = await resolveBestTmdbForItem(it); }
            catch (e) { console.error('resolveBestTmdbForItem failed (final):', it, e); it.tmdbId = ''; }
            if (it.tmdbId) { it.isTv = false; overrideSetPacked(it.filmId, it.tmdbId, it.isTv); }
          }));
        })());
        await sleep(pauseMs);
      }
      await Promise.all(frBatches);
      await persistOverrides({ alsoBackup: true });
    }

    return LOCAL_OVERRIDES || {};
  }

  // ────────────────────────────────────────────────────────────────────────
  // URL builder
  // ────────────────────────────────────────────────────────────────────────
  async function buildUrlFromCache(items, descriptionText, actionOverride = null) {
    const listItems = [];
    for (const it of items) {
      let packed = getFromAnyCachePacked(it.filmId);
      let tmdbId, isTv = false;
      if (packed !== undefined) ({ tmdbId, isTv } = unpack(packed));
      else if (it.tmdbId) { tmdbId = Number(it.tmdbId); isTv = !!it.isTv; }
      else tmdbId = '';
      if (isTv) listItems.push({ id: tmdbId, mt: 'tv' });
      else listItems.push({ id: tmdbId });
    }

    const rawJson = JSON.stringify(listItems);

    const isWatch = isWatchlistPage();
    const username = getUsernameFromPath();

    let listName = isWatch ? getWatchlistListNamePretty() : getListNameFromPage();
    let author = isWatch ? (getWatchlistAuthorFromPage(username) || getListAuthorFromPage() || username)
                         : getListAuthorFromPage();

    let action = (typeof actionOverride === 'string') ? actionOverride : GM_getValue('kodiAction', 'ask');
    if (action === 'ask') action = '';
    const busyIndicator = GM_GetOrSet('indicator', 'progress');
    const description = (typeof descriptionText === 'string' && descriptionText !== '') ? descriptionText : null;

    const posterEnabled = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    const posterStrategy = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    const fanartEnabled = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    const fanartStrategy = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    const fanartFallback = GM_GetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);

    async function buildCommonParts() {
      const parts = [];
      parts.push(['mode', 'personal_lists.external']);
      if (action) parts.push(['action', action]);
      parts.push(['list_type', 'tmdb']);
      parts.push(['list_name', listName]);
      parts.push(['author', author]);
      parts.push(['media_type_default', MEDIA_TYPE_DEFAULT_FIXED]);
      parts.push(['busy_indicator', busyIndicator]);
      if (description != null) parts.push(['description', description]);
      if (posterEnabled) parts.push(['poster', posterStrategy]);

      if (fanartEnabled) {
        if (fanartStrategy === 'author_fanart') {
          let url = '';
          if (isWatch) {
            url = getAuthorFanartUrl();
            if (!url) url = await fetchUserProfileFanartUrl(username);
          } else {
            url = getAuthorFanartUrl();
          }
          if (url) {
            parts.push(['fanart', url]);
          } else if (fanartFallback === 'first_4' || fanartFallback === 'random') {
            parts.push(['fanart', fanartFallback]);
          }
        } else {
          parts.push(['fanart', fanartStrategy]);
        }
      }
      return parts;
    }

    const commonParts = await buildCommonParts();

    const b64 = await gzipBase64(rawJson);
    const encodeParts = (arr) => arr.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const base = 'plugin://plugin.video.fenlight/?';

    const rawParts = [...commonParts, ['list_items', rawJson]];
    const rawUrl = base + encodeParts(rawParts);
    const rawBytes = utf8ByteLen(rawUrl);

    let gzUrl = null, gzBytes = null;
    if (b64) {
      const gzParts = [...commonParts, ['base64_items', b64]];
      gzUrl = base + encodeParts(gzParts);
      gzBytes = utf8ByteLen(gzUrl);
    }

    const choice = b64 ? 'base64' : 'raw';
    const url = (choice === 'base64') ? gzUrl : rawUrl;
    const urlBytes = (choice === 'base64') ? gzBytes : rawBytes;

    return { url, choice, urlBytes, rawUrl, rawBytes, gzUrl, gzBytes };
  }

  // ────────────────────────────────────────────────────────────────────────
  // Run control
  // ────────────────────────────────────────────────────────────────────────
  let RUN_BASE_LOADED = false;
  async function startRun() { RUN_BASE_LOADED = false; DIRTY_OVERRIDES = false; }
  async function ensureBaseLoadedOnceForRun() {
    if (!RUN_BASE_LOADED) { await loadBaseBinOnce({ allowRevalidate: false }); RUN_BASE_LOADED = true; }
  }
  async function resolveActionForThisRun() {
    const stored = GM_getValue('kodiAction', 'ask');
    if (stored === 'ask') return await askForActionOverlay();
    return stored;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Soft-limit overlay
  // ────────────────────────────────────────────────────────────────────────
  function showTooManyItemsOverlay(totalCount) {
    const existing = document.getElementById('kodi-too-many-items'); if (existing) try { existing.remove(); } catch {}
    const overlay = document.createElement('div');
    overlay.id = 'kodi-too-many-items';
    Object.assign(overlay.style, {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2147483647, padding: '20px', boxSizing: 'border-box'
    });
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      background: '#222', color: '#eee', borderRadius: '10px',
      width: '560px', maxWidth: '95vw', padding: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.45)', border: '1px solid #333'
    });
    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="background:#e50914;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800">!</div>
        <h2 style="margin:0;font-size:18px;">This list is a little too epic to send in one go</h2>
      </div>
      <div style="font-size:13px; color:#ccc; line-height:1.55;">
        Your list contains <strong>${totalCount.toLocaleString()}</strong> items. For reliability, sending lists over
        <strong>${MAX_LIST_ITEMS.toLocaleString()}</strong> items isn’t supported in a single run.
        <br><br>
        Try sending it in smaller parts (for example, a few pages at a time or the first 5,000), or filter the list and send again.
      </div>
      <div style="margin-top:14px;text-align:right;">
        <button id="kodi-too-many-items-ok" style="background:#e50914;color:#fff;border:none;border-radius:6px;padding:8px 12px;cursor:pointer">Got it</button>
      </div>
    `;
    overlay.append(panel);
    panel.querySelector('#kodi-too-many-items-ok').onclick = () => { try { overlay.remove(); } catch {} };
    document.body.append(overlay);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Show URL handler
  // ────────────────────────────────────────────────────────────────────────
  async function handleShowUrl(btnEl) {
    if (btnEl) btnEl.disabled = true;

    await startRun();
    await ensureBaseLoadedOnceForRun();
    await loadLocalOverridesOnce();

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { alert('Scrape failed'); if (btnEl) btnEl.disabled = false; return; }
    if (!items.length) { alert('No items'); if (btnEl) btnEl.disabled = false; return; }

    if (items.length > MAX_LIST_ITEMS) {
      showTooManyItemsOverlay(items.length);
      if (btnEl) { btnEl.disabled = false; }
      return;
    }

    if (isListPage() || isWatchlistPage()) {
      const how = prompt('How many items? number or "all":', 'all');
      if (how === null) { if (btnEl) btnEl.disabled = false; return; }
      const all = how.trim().toLowerCase() === 'all';
      const count = all ? Infinity : parseInt(how, 10);
      if (!all && (isNaN(count) || count < 1)) { alert('Invalid number'); if (btnEl) btnEl.disabled = false; return; }
      if (!all) items = items.slice(0, count);
    }

    let descriptionText = null;
    if (GM_GetOrSet('descEnable', true)) {
      if (isWatchlistPage()) {
        const pageBio = await fetchUserProfileBio(getUsernameFromPath());
        if (GM_GetOrSet('descMode', 'send') === 'edit') {
          const edited = await editDescriptionOverlay(pageBio || DEFAULT_DESCRIPTION);
          if (edited === null) { if (btnEl) btnEl.disabled = false; return; }
          descriptionText = sanitizeDescPreservingBreaks(edited);
        } else {
          descriptionText = pageBio || DEFAULT_DESCRIPTION;
        }
      } else {
        const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
        if (GM_GetOrSet('descMode', 'send') === 'edit') {
          const edited = await editDescriptionOverlay(pageDesc);
          if (edited === null) { if (btnEl) btnEl.disabled = false; return; }
          descriptionText = sanitizeDescPreservingBreaks(edited);
        } else { descriptionText = pageDesc; }
      }
    }

    await processItems(items, LOCAL_OVERRIDES);

    const actionChoice = await resolveActionForThisRun();
    if (GM_getValue('kodiAction', 'import_view') === 'ask' && !actionChoice) {
      if (btnEl) { btnEl.disabled = false; }
      return;
    }

    const info = await buildUrlFromCache(items, descriptionText, actionChoice);

    const existing = document.getElementById('kodishowurl'); if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'kodishowurl';
    Object.assign(overlay.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2147483647,
      padding: '20px', boxSizing: 'border-box'
    });
    const limitBytes = 65536;
    const pctUsed = Math.min(100, Math.round((info.urlBytes / limitBytes) * 1000) / 10);
    const savings = (typeof info.gzBytes === 'number') ? (info.rawBytes - info.gzBytes) : 0;
    const panel = document.createElement('div');
    panel.innerHTML = `
      <h2 style="margin:0 0 12px; color:#fff; font-size:18px;">URL</h2>
      <textarea id="kodishowurl_text" style="width:600px; height:200px; font-size:14px; box-sizing:border-box; white-space:pre-wrap;">${info.url}</textarea>
      <div style="margin-top:10px; padding:8px; background:#1b1b1b; border:1px solid #333; border-radius:6px; color:#ddd; font-size:12px; line-height:1.5">
        <div><strong>Raw URL:</strong> ${info.rawBytes} bytes</div>
        <div><strong>Gzip+Base64 URL:</strong> ${typeof info.gzBytes === 'number' ? info.gzBytes + ' bytes' : 'n/a (compression unavailable)'}</div>
        <div><strong>Savings:</strong> ${typeof info.gzBytes === 'number' ? (savings + ' bytes (' + (info.rawBytes ? Math.round((savings / info.rawBytes) * 100) : 0) + '%)') : '—'}</div>
        <div><strong>Using:</strong> ${info.choice === 'base64' ? 'base64_items (gzip+base64)' : 'list_items (raw JSON)'}</div>
        <div><strong>Limit usage:</strong> ${info.urlBytes} / ${limitBytes} bytes (${pctUsed}%)</div>
      </div>
      <div style="margin-top:12px; text-align:right;">
        <button id="kodishowurl_copy" style="margin-right:8px; padding:6px 12px; font-size:14px;">Copy URL</button>
        <button id="kodishowurl_close" style="padding:6px 12px; font-size:14px;">Close</button>
      </div>
    `;
    Object.assign(panel.style, { background: '#222', padding: '20px', borderRadius: '6px' });
    overlay.append(panel); document.body.append(overlay);
    panel.querySelector('#kodishowurl_copy').onclick = () => {
      const ta = panel.querySelector('#kodishowurl_text'); if (ta.select) { ta.select(); document.execCommand('copy'); }
      panel.querySelector('#kodishowurl_copy').textContent = 'Copied!';
    };
    panel.querySelector('#kodishowurl_close').onclick = () => overlay.remove();

    if (btnEl) btnEl.disabled = false;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Floating UI: ICON + Settings
  // ────────────────────────────────────────────────────────────────────────
  GM_addStyle(`
    #lb-tmdb-icon-wrap {
      position: fixed; bottom: 10px; right: 10px; display: flex; gap: 8px; align-items: center;
      z-index: 2147483647;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;
    }
    #lb-tmdb-main-icon {
      width: var(--lb-size, 64px); height: var(--lb-size, 64px);
      object-fit: contain; border-radius: 10px; background: rgba(0,0,0,0.03);
      box-shadow: 0 2px 10px rgba(0,0,0,0.12); cursor: pointer; user-select: none;
    }
    #lb-tmdb-main-icon:active { transform: translateY(1px); }
    #lb-settings-btn {
      width: 36px; height: 36px; display: grid; place-items: center;
      background: #444; color: #fff; border: none; border-radius: 10px; cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2); padding: 0;
    }
    #lb-settings-btn svg { display:block }
    #lb-settings-btn:active { transform: translateY(1px); }
    @media (prefers-color-scheme: dark) {
      #lb-tmdb-main-icon { background: rgba(255,255,255,0.06); }
      #lb-settings-btn { background: #333; }
    }
  `);

  const topRightBar = document.createElement('div');
  Object.assign(topRightBar.style, { position: 'fixed', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 2147483647 });
  document.body.append(topRightBar);

  const iconWrap = document.createElement('div');
  iconWrap.id = 'lb-tmdb-icon-wrap';
  iconWrap.style.setProperty('--lb-size', `${GM_GetOrSet('lb_icon_size', 64)}px`);

  const mainIcon = document.createElement('img');
  mainIcon.id = 'lb-tmdb-main-icon';
  mainIcon.alt = 'FLAM Launcher';
  mainIcon.src = '';

  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'lb-settings-btn';
  settingsBtn.title = 'Settings';
  settingsBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="#fff"/>
      <path d="M20 13.1v-2.2l-2.02-.62a6.93 6.93 0 0 0-.52-1.25l1.1-1.84-1.56-1.56-1.84 1.1c-.4-.2-.82-.37-1.25-.52L13.1 4h-2.2l-.61 2.02c-.43.14-.85.31-1.25.52l-1.84-1.1L5.64 7 6.74 8.84c-.2.4-.37.82-.52 1.25L4 10.9v2.2l2.02.62c.14.43.31.85.52 1.25L5.43 16.8l1.56 1.56 1.84-1.1c.4.2.82.37 1.25.52l.62 2.02h2.2l.62-2.02c.43-.14.85-.31 1.25-.52l1.84 1.1 1.56-1.56-1.1-1.84c.2-.4.37-.82.52-1.25L20 13.1Z" fill="#fff"/>
    </svg>
  `;

  iconWrap.append(mainIcon, settingsBtn);
  topRightBar.append(iconWrap);

  // ────────────────────────────────────────────────────────────────────────
  // Icon DB + Picker
  // ────────────────────────────────────────────────────────────────────────
  const ICONS_API_URL = 'https://api.github.com/repos/hcgiub001/letterboxd-tmdb-cache/contents/addon_icons';
  const ICON_DB_KEY = 'lb_tmdb_icon_db_v1';
  const ICON_SELECTED_NAME_KEY = 'lb_tmdb_icon_selected_name';
  const ICON_SIZE_KEY = 'lb_icon_size';

  function gmFetchJSON(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url,
        headers: { 'Accept': 'application/vnd.github+json' },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            try { resolve(JSON.parse(res.responseText)); } catch (e) { reject(e); }
          } else reject(new Error(`HTTP ${res.status}`));
        },
        onerror: reject
      });
    });
  }
  function gmFetchArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url, responseType: 'arraybuffer',
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.response);
          else reject(new Error(`HTTP ${res.status}`));
        },
        onerror: reject
      });
    });
  }
  function arrayBufferToDataURL(buf, mime = 'image/png') {
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunk) {
      const sub = bytes.subarray(i, i + chunk);
      binary += String.fromCharCode.apply(null, sub);
    }
    return `data:${mime};base64,` + btoa(binary);
  }
  async function buildIconDBFromGitHub() {
    const list = await gmFetchJSON(ICONS_API_URL);
    const files = (list || [])
      .filter(x => x && x.type === 'file' && /\.png$/i.test(x.name) && x.download_url)
      .sort((a, b) => a.name.localeCompare(b.name));
    if (!files.length) throw new Error('No PNG files found in addon_icons.');
    const downloads = await Promise.all(files.map(async (f) => {
      const buf = await gmFetchArrayBuffer(f.download_url);
      const dataUrl = arrayBufferToDataURL(buf, 'image/png');
      return { name: f.name, dataUrl };
    }));
    const newDb = { icons: downloads, lastSync: new Date().toISOString() };
    GM_setValue(ICON_DB_KEY, newDb);
    return newDb;
  }

  let ICON_DB = GM_getValue(ICON_DB_KEY, null);
  let ICON_SELECTED_NAME = GM_GetOrSet(ICON_SELECTED_NAME_KEY, '');
  let ICON_SIZE = parseInt(GM_GetOrSet(ICON_SIZE_KEY, 64), 10) || 64;

  async function ensureIconDB() {
    if (!ICON_DB || !Array.isArray(ICON_DB.icons) || !ICON_DB.icons.length) {
      try { ICON_DB = await buildIconDBFromGitHub(); }
      catch (e) {
        console.error('[Icon DB] Initial build failed:', e);
        ICON_DB = { icons: [{ name: 'fallback.png', dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=' }], lastSync: new Date().toISOString() };
        GM_setValue(ICON_DB_KEY, ICON_DB);
      }
    }
  }
  function setIconSize(px) {
    ICON_SIZE = Math.max(16, Math.min(512, +px || 64));
    iconWrap.style.setProperty('--lb-size', `${ICON_SIZE}px`);
    GM_setValue(ICON_SIZE_KEY, ICON_SIZE);
  }
  function setSelectedIconByName(name) {
    ICON_SELECTED_NAME = name || '';
    GM_setValue(ICON_SELECTED_NAME_KEY, ICON_SELECTED_NAME);
    const entry = ICON_DB?.icons?.find(i => i.name === ICON_SELECTED_NAME) || ICON_DB?.icons?.[0];
    if (entry) mainIcon.src = entry.dataUrl;
  }
  await ensureIconDB();
  if (!ICON_SELECTED_NAME && ICON_DB?.icons?.length) {
    ICON_SELECTED_NAME = ICON_DB.icons[0].name;
    GM_setValue(ICON_SELECTED_NAME_KEY, ICON_SELECTED_NAME);
  }
  setIconSize(ICON_SIZE);
  setSelectedIconByName(ICON_SELECTED_NAME);

  // ────────────────────────────────────────────────────────────────────────
  // Description editor
  // ────────────────────────────────────────────────────────────────────────
  function editDescriptionOverlay(defaultDesc) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.id = 'kodieditdesc';
      Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 2147483647,
        padding: '20px', boxSizing: 'border-box'
      });
      const panel = document.createElement('div');
      panel.innerHTML = `
        <h2 style="margin:0 0 12px; color:#fff; font-size:18px;">Edit Description</h2>
        <textarea id="kodieditdesc_text" style="width:600px; height:300px; font-size:14px; box-sizing:border-box; white-space:pre-wrap;">${defaultDesc}</textarea>
        <div style="margin-top:12px; text-align:right;">
          <button id="kodieditdesc_save" style="margin-right:8px; padding:6px 12px; font-size:14px;">Save</button>
          <button id="kodieditdesc_cancel" style="padding:6px 12px; font-size:14px;">Cancel</button>
        </div>
      `;
      Object.assign(panel.style, { background: '#222', padding: '20px', borderRadius: '6px' });
      overlay.append(panel);
      document.body.append(overlay);

      panel.querySelector('#kodieditdesc_save').onclick = () => {
        const val = panel.querySelector('#kodieditdesc_text').value;
        overlay.remove();
        resolve(val);
      };
      panel.querySelector('#kodieditdesc_cancel').onclick = () => {
        overlay.remove();
        resolve(null);
      };
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // Icon click → full run
  // ────────────────────────────────────────────────────────────────────────
  let ICON_BUSY = false;
  mainIcon.addEventListener('click', async function () {
    if (ICON_BUSY) return;
    ICON_BUSY = true;

    const startTime = performance.now();
    showOrUpdateProcessingBubble(mainIcon, ['Processing…'], true);

    await startRun();
    await ensureBaseLoadedOnceForRun();
    await loadLocalOverridesOnce();

    let actionChoice = await resolveActionForThisRun();
    if (GM_getValue('kodiAction', 'import_view') === 'ask' && !actionChoice) {
      hideProcessingBubble(true);
      ICON_BUSY = false;
      return;
    }

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { alert('Scrape failed'); hideProcessingBubble(true); ICON_BUSY = false; return; }
    if (!items.length) { alert('No items'); hideProcessingBubble(true); ICON_BUSY = false; return; }

    if (items.length > MAX_LIST_ITEMS) {
      showTooManyItemsOverlay(items.length);
      hideProcessingBubble(true);
      ICON_BUSY = false;
      return;
    }

    const overrides0 = await getCache(CACHE_KEY);
    let baseHitCount = 0, overrideHitCount = 0, uncachedCount = 0;
    for (const it of items) {
      const fid = String(it.filmId || '');
      const inOverrides = Number.isFinite(overrides0[fid]);
      if (inOverrides) { overrideHitCount++; continue; }
      const basePacked = baseLookupPacked(Number(fid));
      if (basePacked !== undefined) baseHitCount++;
      else uncachedCount++;
    }
    const totalPlanned = baseHitCount + overrideHitCount + uncachedCount;

    showOrUpdateProcessingBubble(mainIcon, [
      'Processing…',
      `Items selected: ${items.length}`,
      `Cache — base: ${baseHitCount} • overrides: ${overrideHitCount} • uncached: ${uncachedCount}`,
      `Sum check: ${totalPlanned} / ${items.length}`
    ], true);

    let descriptionText = null;
    if (GM_GetOrSet('descEnable', true)) {
      if (isWatchlistPage()) {
        const bio = await fetchUserProfileBio(getUsernameFromPath());
        if (GM_GetOrSet('descMode', 'send') === 'edit') {
          const edited = await editDescriptionOverlay(bio || DEFAULT_DESCRIPTION);
          if (edited === null) { hideProcessingBubble(true); ICON_BUSY = false; return; }
          descriptionText = sanitizeDescPreservingBreaks(edited);
        } else {
          descriptionText = bio || DEFAULT_DESCRIPTION;
        }
      } else {
        const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
        if (GM_GetOrSet('descMode', 'send') === 'edit') {
          const edited = await editDescriptionOverlay(pageDesc);
          if (edited === null) { hideProcessingBubble(true); ICON_BUSY = false; return; }
          descriptionText = sanitizeDescPreservingBreaks(edited);
        } else { descriptionText = pageDesc; }
      }
    }

    await processItems(items, LOCAL_OVERRIDES);

    const info = await buildUrlFromCache(items, descriptionText, actionChoice);

    showOrUpdateProcessingBubble(mainIcon, [
      'Sending to Kodi…',
      `URL bytes: ${info.urlBytes}${info.choice === 'base64' ? ' (gzip+base64)' : ' (raw JSON)'}`
    ], true);

    const ok = await sendToKodi(info.url);
    const elapsedMs = Math.max(0, Math.round(performance.now() - startTime));

    hideProcessingBubble(true);

    const limitBytes = 65536;
    const pct = Math.min(100, Math.round((info.urlBytes / limitBytes) * 1000) / 10);
    const infoLines = [
      `Items sent: ${items.length}`,
      `📦 Cache — base: ${baseHitCount} • overrides: ${overrideHitCount} • uncached: ${uncachedCount}`,
      `Σ = ${baseHitCount + overrideHitCount + uncachedCount} / ${items.length}`,
      `📨 Bytes: ${info.urlBytes} / ${limitBytes} (${pct}%) ${info.choice === 'base64' ? '[gzip+base64]' : '[raw JSON]'}`,
      `⏱ Elapsed: ${(elapsedMs / 1000).toFixed(1)}s`,
      ok ? '✅ Sent' : '❌ Failed'
    ];
    showSideInfoNearEl(mainIcon, infoLines, 5000);

    ICON_BUSY = false;
  });

  // ────────────────────────────────────────────────────────────────────────
  // Settings UI (with icon picker)
  // ────────────────────────────────────────────────────────────────────────
  settingsBtn.addEventListener('click', showSettings);

  function showSettings() {
    if (document.getElementById('kodisettings')) return;

    const overlay = document.createElement('div');
    overlay.id = 'kodisettings';
    Object.assign(overlay.style, {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 2147483647, padding: '20px', boxSizing: 'border-box'
    });

    const panel = document.createElement('div');

    panel.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <h2 style="color:#fff;margin:0">Kodi Settings</h2>
        <div style="display:flex; gap:6px;">
          <button class="kodi-tab-btn" data-tab="general" style="background:#e50914;color:#fff;border:none;border-radius:4px;padding:6px 10px;cursor:pointer">General</button>
          <button class="kodi-tab-btn" data-tab="tools" style="background:#444;color:#fff;border:none;border-radius:4px;padding:6px 10px;cursor:pointer">Tools</button>
        </div>
      </div>

      <div id="kodi-tab-general" class="kodi-tab" style="display:block">

        <h3 style="color:#fff;margin:10px 0 6px;">Launcher Icon</h3>
        <div style="background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:12px;color:#ddd">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <img id="iconPreview" alt="Icon preview" style="width:48px;height:48px;border-radius:10px;border:1px solid #2a2a2a;object-fit:contain; background:#111"/>
              <div style="font-size:12px;line-height:1.4">
                <div><strong>Selected:</strong> <span id="iconSelectedName">—</span></div>
                <div id="iconMeta" style="opacity:.8">Cached icons: — • Last refresh: —</div>
              </div>
            </div>
            <button id="refreshIconsBtn" style="font-size:12px;padding:6px 10px;border-radius:8px;background:#000;color:#fff;border:none;cursor:pointer">Refresh from GitHub</button>
          </div>

          <div id="iconGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:8px;max-height:220px;overflow:auto;padding-right:2px"></div>

          <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin-top:10px">
            <div>
              <label style="font-size:13px">Length (px):</label>
              <input id="iconSizeRange" type="range" min="16" max="512" step="1">
            </div>
            <input id="iconSizeNumber" type="number" min="16" max="512" step="1" style="width:90px;padding:6px 8px;border-radius:8px;border:1px solid #444;background:#111;color:#eee">
          </div>
        </div>

        <label style="color:#fff">Kodi IP:</label>
        <input id="kodiIp" style="width:100%;margin-bottom:8px"/>

        <label style="color:#fff">Kodi Port:</label>
        <input id="kodiPort" style="width:100%;margin-bottom:8px"/>

        <label style="color:#fff">Kodi User:</label>
        <input id="kodiUser" style="width:100%;margin-bottom:8px"/>

        <label style="color:#fff">Kodi Pass:</label>
        <input id="kodiPass" type="password" style="width:100%;margin-bottom:12px"/>

        <label style="color:#fff">Default Action:</label>
        <select id="kodiAction" style="width:100%;margin-bottom:16px">
          <option value="">Omit Action key</option>
          <option value="view">view</option>
          <option value="import">import</option>
          <option value="import_view">import_view</option>
          <option value="ask">Ask each time</option>
        </select>

        <label style="color:#fff">Busy indicator:</label>
        <select id="indicator" style="width:100%;margin-bottom:16px">
          <option value="none">none</option>
          <option value="busy">busy</option>
          <option value="progress">progress</option>
        </select>

        <label style="color:#fff"><input type="checkbox" id="descEnable"/> Add Description</label>
        <div id="descOptions" style="margin:8px 0;display:none;color:#fff">
          <label>Edit mode:</label>
          <select id="descMode" style="width:100%;margin-bottom:8px">
            <option value="send">Send without editing</option>
            <option value="edit">Edit before sending</option>
          </select>
        </div>

        <hr style="border-color:#444;margin:14px 0">

        <div id="advancedGroup" style="display:none;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div>
              <label style="color:#fff">Batch size:</label>
              <input id="batchSize" type="number" min="1" step="1" style="width:100%"/>
            </div>
            <div>
              <label style="color:#fff">Pause between batches (ms):</label>
              <input id="pauseMs" type="number" min="0" step="10" style="width:100%"/>
            </div>
            <div>
              <label style="color:#fff">Final retry delay (ms):</label>
              <input id="finalRetryDelayMs" type="number" min="0" step="10" style="width:100%"/>
            </div>
            <div>
              <label style="color:#fff">Final retry min list size:</label>
              <input id="finalRetryMinListSize" type="number" min="0" step="1" style="width:100%"/>
            </div>
          </div>
          <hr style="border-color:#444;margin:14px 0">
        </div>

        <div>
          <h3 style="color:#fff;margin:0 0 8px;">Artwork Options</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div style="border:1px solid #333;border-radius:6px;padding:10px;">
              <label style="color:#fff"><input type="checkbox" id="posterEnable"/> Enable Poster</label>
              <div style="color:#bbb;font-size:12px;margin:6px 0 8px">Include the <code>poster</code> key in the URL.</div>
              <label style="color:#fff">Poster selection:</label>
              <select id="posterStrategy" style="width:100%;margin-top:4px">
                <option value="first_4">first_4</option>
                <option value="random">random</option>
              </select>
            </div>
            <div style="border:1px solid #333;border-radius:6px;padding:10px;">
              <label style="color:#fff"><input type="checkbox" id="fanartEnable"/> Enable Fanart</label>
              <div style="color:#bbb;font-size:12px;margin:6px 0 8px">The <code>fanart</code> key accepts either a strategy or a direct URL.</div>
              <label style="color:#fff">Fanart selection:</label>
              <select id="fanartStrategy" style="width:100%;margin-top:4px">
                <option value="author_fanart">author_fanart (use page/profile backdrop)</option>
                <option value="first_4">first_4</option>
                <option value="random">random</option>
              </select>
              <div id="fanartFallbackBox" style="margin-top:8px; display:none;">
                <label style="color:#fff">If author_fanart missing, fallback to:</label>
                <select id="fanartFallback" style="width:100%;margin-top:4px">
                  <option value="none">none</option>
                  <option value="first_4">first_4</option>
                  <option value="random">random</option>
                </select>
              </div>
              <div style="color:#888; font-size:12px; margin-top:6px;">
                On watchlists, author display name (incl. emoji) is read from the link to the profile on this page.
              </div>
            </div>
          </div>
        </div>

        <hr style="border-color:#444;margin:14px 0">

        <div>
          <h3 style="color:#fff;margin:0 0 8px;">Cache Tools</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <button id="refreshBaseCacheBtn">Refresh Base Cache</button>
          </div>
          <div id="cacheToolMsg" style="color:#bbb;font-size:12px;margin-top:8px;"></div>
        </div>
      </div>

      <div id="kodi-tab-tools" class="kodi-tab" style="display:none">
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <button id="btnShowUrl" title="Build & view plugin URL">Show URL</button>
          <button id="btnClearCache" title="Clear overrides">Clear Cache</button>
        </div>
        <div style="color:#bbb; font-size:12px;">
          Use the top-right icon to send. These tools let you preview the URL or clear local overrides.
        </div>
      </div>

      <div style="text-align:right;margin-top:12px; position:sticky; bottom:0; background:#222; padding-top:8px;">
        <button id="kodisave" style="margin-right:8px">Save</button>
        <button id="kodicancel">Close</button>
      </div>
    `;

    Object.assign(panel.style, {
      background: '#222', padding: '16px', borderRadius: '8px',
      width: '720px', maxWidth: '95vw', maxHeight: '90vh',
      overflowY: 'auto', boxSizing: 'border-box'
    });

    overlay.append(panel);
    document.body.append(overlay);

    const tabBtns = panel.querySelectorAll('.kodi-tab-btn');
    function activateTab(name) {
      panel.querySelectorAll('.kodi-tab').forEach(el => el.style.display = 'none');
      const btns = panel.querySelectorAll('.kodi-tab-btn');
      btns.forEach(b => { b.style.background = (b.dataset.tab === name) ? '#e50914' : '#444'; });
      const shown = panel.querySelector(`#kodi-tab-${name}`);
      if (shown) shown.style.display = 'block';
    }
    tabBtns.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)));
    activateTab('general');

    panel.querySelector('#kodiIp').value = GM_getValue('kodiIp', '');
    panel.querySelector('#kodiPort').value = GM_getValue('kodiPort', '');
    panel.querySelector('#kodiUser').value = GM_getValue('kodiUser', '');
    panel.querySelector('#kodiPass').value = GM_GetOrSet('kodiPass', '');

    panel.querySelector('#kodiAction').value = GM_getValue('kodiAction', 'ask');
    panel.querySelector('#indicator').value = GM_GetOrSet('indicator', 'progress');

    panel.querySelector('#descEnable').checked = GM_GetOrSet('descEnable', true);
    panel.querySelector('#descMode').value = GM_GetOrSet('descMode', 'send');
    const descOpts = panel.querySelector('#descOptions');
    panel.querySelector('#descEnable').addEventListener('change', e => {
      descOpts.style.display = e.target.checked ? 'block' : 'none';
    });
    if (panel.querySelector('#descEnable').checked) descOpts.style.display = 'block';

    panel.querySelector('#batchSize')?.setAttribute('value', GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE));
    panel.querySelector('#pauseMs')?.setAttribute('value', GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS));
    panel.querySelector('#finalRetryDelayMs')?.setAttribute('value', GM_GetOrSet('finalRetryDelayMs', DEFAULT_FINALRETRY_DELAY));
    panel.querySelector('#finalRetryMinListSize')?.setAttribute('value', GM_GetOrSet('finalRetryMinListSize', DEFAULT_FINALRETRY_MIN_LIST_SIZE));

    panel.querySelector('#posterEnable').checked = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    panel.querySelector('#posterStrategy').value = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);

    panel.querySelector('#fanartEnable').checked = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    panel.querySelector('#fanartStrategy').value = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    panel.querySelector('#fanartFallback').value = GM_GetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);
    function refreshFanartFallbackVisibility() {
      const strat = panel.querySelector('#fanartStrategy').value;
      panel.querySelector('#fanartFallbackBox').style.display = (strat === 'author_fanart') ? 'block' : 'none';
    }
    panel.querySelector('#fanartStrategy').addEventListener('change', refreshFanartFallbackVisibility);
    refreshFanartFallbackVisibility();

    const iconPreview = panel.querySelector('#iconPreview');
    const iconNameEl = panel.querySelector('#iconSelectedName');
    const iconMeta = panel.querySelector('#iconMeta');
    const iconGrid = panel.querySelector('#iconGrid');
    const sizeRange = panel.querySelector('#iconSizeRange');
    const sizeNumber = panel.querySelector('#iconSizeNumber');
    const refreshIconsBtn = panel.querySelector('#refreshIconsBtn');

    function updateIconMeta() {
      const count = ICON_DB?.icons?.length || 0;
      const when = ICON_DB?.lastSync ? new Date(ICON_DB.lastSync).toLocaleString() : 'never';
      iconMeta.textContent = `Cached icons: ${count} • Last refresh: ${when}`;
    }
    function populateIconGrid() {
      iconGrid.innerHTML = '';
      if (!ICON_DB?.icons?.length) {
        iconGrid.textContent = 'No cached icons. Click “Refresh from GitHub”.';
        return;
      }
      for (const it of ICON_DB.icons) {
        const img = document.createElement('img');
        img.src = it.dataUrl;
        img.title = it.name;
        img.alt = it.name;
        Object.assign(img.style, {
          width: '100%', aspectRatio: '1 / 1', objectFit: 'contain',
          background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px', cursor: 'pointer'
        });
        if (it.name === ICON_SELECTED_NAME) {
          img.style.outline = '2px solid #fff';
          img.style.outlineOffset = '2px';
        }
        img.addEventListener('click', () => {
          ICON_SELECTED_NAME = it.name;
          setSelectedIconByName(ICON_SELECTED_NAME);
          iconNameEl.textContent = ICON_SELECTED_NAME;
          iconGrid.querySelectorAll('img').forEach(g => { g.style.outline = 'none'; g.style.outlineOffset = '0'; });
          img.style.outline = '2px solid #fff';
          img.style.outlineOffset = '2px';
          iconPreview.src = mainIcon.src;
        });
        iconGrid.appendChild(img);
      }
    }
    function syncSizeInputs() {
      sizeRange.value = String(ICON_SIZE);
      sizeNumber.value = String(ICON_SIZE);
    }

    iconPreview.src = mainIcon.src;
    iconNameEl.textContent = ICON_SELECTED_NAME || '—';
    updateIconMeta();
    populateIconGrid();
    syncSizeInputs();

    sizeRange.addEventListener('input', (e) => { setIconSize(e.target.value); syncSizeInputs(); });
    sizeNumber.addEventListener('input', (e) => { setIconSize(e.target.value); syncSizeInputs(); });

    refreshIconsBtn.addEventListener('click', async () => {
      const prev = refreshIconsBtn.textContent;
      refreshIconsBtn.disabled = true; refreshIconsBtn.textContent = 'Refreshing…';
      try {
        ICON_DB = await buildIconDBFromGitHub();
        if (!ICON_DB.icons.find(i => i.name === ICON_SELECTED_NAME)) {
          ICON_SELECTED_NAME = ICON_DB.icons[0].name;
          GM_setValue(ICON_SELECTED_NAME_KEY, ICON_SELECTED_NAME);
        }
        setSelectedIconByName(ICON_SELECTED_NAME);
        iconPreview.src = mainIcon.src;
        iconNameEl.textContent = ICON_SELECTED_NAME;
        updateIconMeta();
        populateIconGrid();
        refreshIconsBtn.textContent = 'Refreshed ✓';
        await sleep(700);
      } catch (e) {
        console.error('[Icon DB] Refresh failed:', e);
        refreshIconsBtn.textContent = 'Refresh failed';
        await sleep(1200);
      } finally {
        refreshIconsBtn.textContent = prev;
        refreshIconsBtn.disabled = false;
      }
    });

    const cacheMsg = panel.querySelector('#cacheToolMsg');
    function setCacheMsg(txt, ok = false) { cacheMsg.textContent = txt || ''; cacheMsg.style.color = ok ? '#8ee6a4' : '#bbb'; }
    panel.querySelector('#refreshBaseCacheBtn').onclick = async () => {
      setCacheMsg('Refreshing base cache…');
      await refreshBaseBinNow();
      setCacheMsg('Base cache refreshed.', true);
    };

    panel.querySelector('#btnShowUrl').onclick = function () { handleShowUrl(this); };
    panel.querySelector('#btnClearCache').onclick = async () => { await clearCache(); LOCAL_OVERRIDES = {}; DIRTY_OVERRIDES = false; alert('Overrides cleared'); };

    panel.querySelector('#kodisave').onclick = () => {
      GM_setValue('kodiIp', panel.querySelector('#kodiIp').value.trim());
      GM_setValue('kodiPort', panel.querySelector('#kodiPort').value.trim());
      GM_setValue('kodiUser', panel.querySelector('#kodiUser').value);
      GM_setValue('kodiPass', panel.querySelector('#kodiPass').value);
      GM_setValue('kodiAction', panel.querySelector('#kodiAction').value);
      GM_setValue('indicator', panel.querySelector('#indicator').value);
      GM_setValue('descEnable', panel.querySelector('#descEnable').checked);
      GM_setValue('descMode', panel.querySelector('#descMode').value);

      const bsEl = panel.querySelector('#batchSize');
      const pmEl = panel.querySelector('#pauseMs');
      const frdEl = panel.querySelector('#finalRetryDelayMs');
      const frsEl = panel.querySelector('#finalRetryMinListSize');
      if (bsEl) GM_setValue('batchSize', Math.max(1, parseInt(bsEl.value, 10) || DEFAULT_BATCH_SIZE));
      if (pmEl) GM_setValue('pauseMs', Math.max(0, parseInt(pmEl.value, 10) || DEFAULT_PAUSE_MS));
      if (frdEl) GM_setValue('finalRetryDelayMs', Math.max(0, parseInt(frdEl.value, 10) || DEFAULT_FINALRETRY_DELAY));
      if (frsEl) GM_setValue('finalRetryMinListSize', Math.max(0, parseInt(frsEl.value, 10) || DEFAULT_FINALRETRY_MIN_LIST_SIZE));

      GM_setValue('posterEnable', panel.querySelector('#posterEnable').checked);
      GM_setValue('posterStrategy', panel.querySelector('#posterStrategy').value);
      GM_setValue('fanartEnable', panel.querySelector('#fanartEnable').checked);
      GM_setValue('fanartStrategy', panel.querySelector('#fanartStrategy').value);
      GM_setValue('fanartFallback', panel.querySelector('#fanartFallback').value);

      overlay.remove();
      alert('✅ Settings saved');
    };
    panel.querySelector('#kodicancel').onclick = () => overlay.remove();
  }
})();

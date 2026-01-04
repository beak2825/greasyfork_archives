// ==UserScript==
// @name         IMDb List/Watchlist → FLAM Launcher
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  Letterboxd-style launcher
// @match        https://*.imdb.com/list/ls*
// @match        https://*.imdb.com/list/ls*/*
// @match        https://*.imdb.com/user/*/watchlist*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      *
// @connect      api.themoviedb.org
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/548583/IMDb%20ListWatchlist%20%E2%86%92%20FLAM%20Launcher.user.js
// @updateURL https://update.greasyfork.org/scripts/548583/IMDb%20ListWatchlist%20%E2%86%92%20FLAM%20Launcher.meta.js
// ==/UserScript==

;(async function () {
  'use strict';

  // ────────────────────────────────────────────────────────────────────────
  // Config
  // ────────────────────────────────────────────────────────────────────────
  const TMDB_API_KEY = 'f090bb54758cabf231fb605d3e3e0468';

  // Base cache (gzipped u32 pairs: imdbNumeric → packed)
  const BASE_GZ_URL = 'https://raw.githubusercontent.com/hcgiub001/letterboxd-tmdb-cache/main/imdb_tmdb_pairs_u32.bin.gz';

  // Resolver & fetch limits
  const CONCURRENCY_TMDB_FIND = 50;
  const CONCURRENCY_PAGE_FETCH = 3;   // keep the 3-thread pool for pagination
  const MAX_LIST_ITEMS = 5000;
  const URL_LIMIT_BYTES = 65536;
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const NEGATIVE_TTL_MS = THIRTY_DAYS_MS; // 30 days

  // IndexedDB stores/keys
  const CACHE_DB_NAME = 'FenlightCacheDB';
  const CACHE_DB_VERSION = 2;
  const OVERRIDES_STORE = 'tmdbCache';
  const BASE_STORE = 'tmdbBase';

  // Overrides & negative caches
  const OVERRIDES_KEY = 'imdb_tmdb_cache_overrides';          // { 'tt…': packed }
  const OVERRIDES_BACKUP_KEY = 'imdb_tmdb_cache_backup';
  const NEGATIVE_KEY = 'imdb_tmdb_cache_negative';            // { 'tt…': lastFailedTs }
  const NEGATIVE_BACKUP_KEY = 'imdb_tmdb_cache_negative_bak';

  // Base cache metadata keys
  const BASE_BIN_KEY  = 'imdb_base_bin';     // ArrayBuffer: unzipped .bin (u32 pairs)
  const BASE_ETAG_KEY = 'imdb_base_gz_etag'; // last ETag of gz
  const BASE_COUNT_KEY = 'imdb_base_count';  // pair count (info only)

  // URL/UX defaults
  const MEDIA_TYPE_DEFAULT_FIXED = 'm';
  const DEFAULT_INDICATOR = 'progress';

  // Artwork defaults (match Letterboxd)
  const POSTER_ENABLE_DEFAULT = true;
  const POSTER_STRATEGY_DEFAULT = 'first_4';
  const FANART_ENABLE_DEFAULT = true;
  const FANART_STRATEGY_DEFAULT = 'first_4';
  const FANART_FALLBACK_DEFAULT = 'first_4';

  // Info button + last stats keys
  const INFO_BTN_ENABLE_KEY = 'showInfoButton';
  const LAST_STATS_KEY = 'lastSendStats';

  // Description defaults
  const DEFAULT_DESCRIPTION = '';

  // ────────────────────────────────────────────────────────────────────────
  // Tiny utils & text helpers (match LB)
  // ────────────────────────────────────────────────────────────────────────
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const utf8ByteLen = (s) => new TextEncoder().encode(s).length;
  const gmGetOrSet = (k, d) => (typeof GM_getValue(k) === 'undefined' ? d : GM_getValue(k));

  // Basic page-type detection
  function isWatchlistPath() {
    // /user/{id or name}/watchlist/ (with or without query)
    return /^\/user\/[^/]+\/watchlist\/?$/i.test(location.pathname) || /^\/user\/[^/]+\/watchlist\/\S*/i.test(location.pathname);
  }

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
  function sanitizeDescPreservingBreaks(s) {
    if (!s) return '';
    return s.replace(/\u00A0/g, ' ')
            .replace(/\r\n/g, '\n')
            .replace(/\t/g, '  ')
            .trim();
  }

  // ────────────────────────────────────────────────────────────────────────
  // IMDb scraping (pagination + metadata) — LISTS + WATCHLISTS
  // ────────────────────────────────────────────────────────────────────────

  // Shared helpers
  function parseNextDataDoc(doc = document) {
    const el = doc.getElementById('__NEXT_DATA__');
    if (!el || !el.textContent) return null;
    try { return JSON.parse(el.textContent); } catch { return null; }
  }
  function parseNextDataFromHTML(html) {
    // fast/robust: find the script tag content
    const m = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
  }

  // ----- METADATA (name/author/desc) -----
  function getListName() {
    // LISTS: as before
    let el = document.querySelector('span.hero__primary-text[data-testid="hero__primary-text"]');
    if (el && el.textContent) return el.textContent.trim();

    // WATCHLISTS: try generic h1 / header
    const h1 = document.querySelector('h1, [data-testid="list-page-atf-title-block"] h1, [data-testid="list-page-atf-title-block"] [data-testid="hero__primary-text"]');
    if (h1 && h1.textContent) return h1.textContent.trim();

    // Fallback: __NEXT_DATA__
    const nd = parseNextDataDoc();
    const nameFromND =
      nd?.props?.pageProps?.pageTitle ||
      nd?.props?.pageProps?.listTitle ||
      nd?.props?.pageProps?.seo?.metadata?.title ||
      nd?.props?.pageProps?.seo?.meta?.title ||
      '';
    if (nameFromND) return String(nameFromND).replace(/\s*-\s*IMDb\s*$/i, '').trim();

    // Final fallback: document.title
    return (document.title || 'IMDb List').replace(/\s*-\s*IMDb\s*$/i, '').trim();
  }

  function getAuthor() {
    // LISTS: as before
    const a = document.querySelector('[data-testid="list-author-link"]');
    if (a && a.textContent) return a.textContent.trim();

    // WATCHLISTS: attempt to locate an author/owner link
    // Common patterns: link to /user/{id}/ …
    const owner =
      document.querySelector('a[href^="/user/"][data-testid*="author"], a[href^="/user/"][data-testid*="owner"]') ||
      document.querySelector('[data-testid="list-owner"] a[href^="/user/"]') ||
      document.querySelector('.ipc-title__subtitle a[href^="/user/"]') ||
      document.querySelector('a[href^="/user/"]:not([href*="watchlist"])');
    if (owner && owner.textContent) return owner.textContent.trim();

    // Fallback: __NEXT_DATA__ (if any)
    const nd = parseNextDataDoc();
    const ownerName =
      nd?.props?.pageProps?.owner?.name ||
      nd?.props?.pageProps?.user?.name ||
      nd?.props?.pageProps?.userName ||
      '';
    if (ownerName) return String(ownerName).trim();

    return '';
  }

  function getDescriptionRawHTML() {
    // LISTS: current selector (keep)
    const el = document.querySelector('.list-description-content .ipc-html-content-inner-div');
    if (el && el.innerHTML) return el.innerHTML;

    // WATCHLISTS: often no description; try generic content area
    const w = document.querySelector('[data-testid="list-page-description"], [data-testid="list-page-atf-title-block"] .ipc-html-content-inner-div');
    if (w && w.innerHTML) return w.innerHTML;

    return '';
  }
  function getDescriptionText() {
    return htmlToTextWithBreaks(getDescriptionRawHTML() || '');
  }

  // ----- LIST PAGES (unchanged logic) -----
  function extractItemList(html) {
    // robustly parse the item list from <script type="application/ld+json">
    const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m;
    while ((m = re.exec(html))) {
      try {
        const j = JSON.parse(m[1]);
        if (j['@type'] === 'ItemList') return j.itemListElement;
      } catch {}
    }
    return [];
  }

  async function gatherItemsFromListPages() {
    const origin = location.origin;
    const basePath = location.pathname.replace(/\?.*$/,'');
    const sel = document.getElementById('listPagination');
    const total = sel ? sel.options.length : 1;

    // page 1
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    let page1 = null;
    for (const s of scripts) {
      try {
        const j = JSON.parse(s.textContent);
        if (j['@type'] === 'ItemList') { page1 = j.itemListElement; break; }
      } catch {}
    }
    if (!page1) { alert('⚠️ Failed to parse page 1'); return null; }

    // rest
    const urls = [];
    for (let p = 2; p <= total; p++) urls.push(`${origin+basePath}?page=${p}`);

    const rest = await (async function limitedFetch(urls, limit = CONCURRENCY_PAGE_FETCH) {
      const out = new Array(urls.length); let next = 0, active = 0;
      return new Promise((resolve) => {
        const launch = () => {
          while (active < limit && next < urls.length) {
            const i = next++, u = urls[i]; active++;
            fetch(u, { credentials: 'include' })
              .then(r => r.ok ? r.text() : Promise.reject(new Error('HTTP '+r.status)))
              .then(html => { out[i] = extractItemList(html); })
              .catch(() => { out[i] = []; })
              .finally(() => { active--; (next < urls.length) ? launch() : (active === 0 && resolve(out)); });
          }
        };
        urls.length ? launch() : resolve(out);
      });
    })(urls, CONCURRENCY_PAGE_FETCH);

    const all = page1.concat(...rest);

    return all
      .map(e => {
        const idMatch = (e.item && e.item.url) ? e.item.url.match(/tt\d+/) : null;
        const t = (e.item && e.item['@type']) ? String(e.item['@type']) : '';
        const mtHint = (t === 'Movie') ? 'm' : (/^TV/i.test(t) ? 'tv' : 'm');
        return idMatch ? { imdbId: idMatch[0], mtHint, listIndex: e.position || 0 } : null;
      })
      .filter(Boolean);
  }

  // ----- WATCHLIST PAGES (new) -----
  function extractWatchlistEdgesFromND(nd) {
    const mcd = nd?.props?.pageProps?.mainColumnData;
    const container = mcd?.predefinedList || mcd?.list || mcd?.titleList || null;
    const edges = container?.titleListItemSearch?.edges;
    return Array.isArray(edges) ? edges : [];
  }
  function edgesToItems(edges) {
    const items = [];
    for (const e of edges) {
      const imdbId = e?.listItem?.id; // "tt…"
      if (!imdbId) continue;
      const pos = e?.node?.absolutePosition || e?.node?.rank || 0;
      const tt = (e?.listItem?.titleType?.id || e?.listItem?.titleType?.text || '').toString().toLowerCase();
      const mtHint = tt.startsWith('tv') ? 'tv' : 'm';
      items.push({ imdbId, mtHint, listIndex: pos });
    }
    return items;
  }
  function getWatchlistPageCountFromDoc(doc) {
    // Try dropdown first
    const sel = doc.querySelector('#listPagination');
    if (sel?.options?.length) return sel.options.length;

    // Try __NEXT_DATA__ totalItems
    const nd = parseNextDataDoc(doc);
    const totalItems = nd?.props?.pageProps?.totalItems;
    if (Number.isFinite(totalItems)) return Math.max(1, Math.ceil(totalItems / 250));

    // Fallback: 1
    return 1;
  }

  async function gatherItemsFromWatchlist() {
    const base = new URL(location.href);
    base.searchParams.set('page', '1');

    // Use current DOM for page 1
    const firstND = parseNextDataDoc(document);
    if (!firstND) { alert('⚠️ Could not read watchlist data on page 1'); return null; }
    const maxPages = getWatchlistPageCountFromDoc(document);

    const resultsByPage = new Map();
    resultsByPage.set(1, edgesToItems(extractWatchlistEdgesFromND(firstND)));

    // Build remaining page URLs
    const urls = [];
    for (let p = 2; p <= maxPages; p++) {
      const u = new URL(base.toString());
      u.searchParams.set('page', String(p));
      urls.push({ p, url: u.toString() });
    }

    // Pool=3 fetch of pages 2..N, parse __NEXT_DATA__, convert to items
    await (async function poolFetchWatchlist(pairs, limit = CONCURRENCY_PAGE_FETCH) {
      let i = 0, active = 0;
      return new Promise((resolve) => {
        const launch = () => {
          while (active < limit && i < pairs.length) {
            const idx = i++; active++;
            const { p, url } = pairs[idx];
            fetch(url, { credentials: 'include' })
              .then(r => r.ok ? r.text() : Promise.reject(new Error('HTTP '+r.status)))
              .then(html => {
                const nd = parseNextDataFromHTML(html);
                const edges = extractWatchlistEdgesFromND(nd || {});
                resultsByPage.set(p, edgesToItems(edges));
              })
              .catch(() => { resultsByPage.set(p, []); })
              .finally(() => {
                active--;
                (i < pairs.length) ? launch() : (active === 0 && resolve());
              });
          }
        };
        pairs.length ? launch() : resolve();
      });
    })(urls, CONCURRENCY_PAGE_FETCH);

    // Combine in order
    const all = [];
    for (let p = 1; p <= maxPages; p++) {
      const arr = resultsByPage.get(p);
      if (Array.isArray(arr)) all.push(...arr);
    }
    return all;
  }

  // Unified entry (keeps all prior behavior, just adds watchlists)
  async function gatherItems() {
    if (isWatchlistPath()) {
      const items = await gatherItemsFromWatchlist();
      return items || [];
    }
    // default: list pages
    const items = await gatherItemsFromListPages();
    return items || [];
  }

  // Try to provide an "author_fanart" equivalent on IMDb: use og:image if present
  function getAuthorFanartUrl_IMDb() {
    const og = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    return og || '';
  }

  // ────────────────────────────────────────────────────────────────────────
  // TMDB resolver (/find/{imdb_id}) with 50-concurrency (kept)
  // ────────────────────────────────────────────────────────────────────────
  async function tmdbFindByImdb(ttid) {
    const url = `https://api.themoviedb.org/3/find/${ttid}?` + new URLSearchParams({
      api_key: TMDB_API_KEY,
      external_source: 'imdb_id'
    });
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) {
          const j = await r.json();
          const mov = Array.isArray(j.movie_results) ? j.movie_results : [];
          const tv  = Array.isArray(j.tv_results) ? j.tv_results : [];
          const ep  = Array.isArray(j.tv_episode_results) ? j.tv_episode_results : [];
          if (mov.length) return { tmdbId: mov[0].id, isTv: false };
          if (tv.length)  return { tmdbId: tv[0].id,  isTv: true  };
          if (ep.length) {
            const showId = ep[0].show_id || ep[0].id || null;
            if (showId) return { tmdbId: showId, isTv: true };
          }
          return null;
        }
        if (r.status === 429) await sleep(250 * (i + 1));
        else return null;
      } catch {
        await sleep(200 * (i + 1));
      }
    }
    return null;
  }

  // ────────────────────────────────────────────────────────────────────────
  // IndexedDB helpers + base cache load/refresh (kept & aligned)
  // ────────────────────────────────────────────────────────────────────────
  function openDB() {
    return new Promise((resolve, reject) => {
      const rq = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains(OVERRIDES_STORE)) db.createObjectStore(OVERRIDES_STORE);
        if (!db.objectStoreNames.contains(BASE_STORE)) db.createObjectStore(BASE_STORE);
      };
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => reject(rq.error);
    });
  }
  async function idbGet(store, key) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readonly');
      const rq = tx.objectStore(store).get(key);
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
  }
  async function idbPut(store, key, val) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      const rq = tx.objectStore(store).put(val, key);
      rq.onsuccess = () => res();
      rq.onerror = () => rej(rq.error);
    });
  }
  async function idbDel(store, key) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      const rq = tx.objectStore(store).delete(key);
      rq.onsuccess = () => res();
      rq.onerror = () => rej(rq.error);
    });
  }

  let BASE_PAIRS_U32 = null;   // Uint32Array (k0, v0, k1, v1, ...)
  let BASE_PAIR_COUNT = 0;

  function isLittleEndian() {
    const b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, 0x11223344, true);
    return new Uint8Array(b)[0] === 0x44;
  }
  const HOST_LE = isLittleEndian();

  function parseBaseBinToU32(buf) {
    if (!buf || !buf.byteLength) return false;
    if (buf.byteLength % 8 !== 0) return false;
    if (HOST_LE) {
      BASE_PAIRS_U32 = new Uint32Array(buf);
    } else {
      const view = new DataView(buf);
      const out = new Uint32Array(buf.byteLength / 4);
      for (let i = 0; i < out.length; i++) out[i] = view.getUint32(i * 4, true);
      BASE_PAIRS_U32 = out;
    }
    if (BASE_PAIRS_U32.length % 2 !== 0) return false;
    BASE_PAIR_COUNT = BASE_PAIRS_U32.length >>> 1;
    return true;
  }

  function baseLookupPackedByNumericImdb(imdbNumeric) {
    if (!BASE_PAIRS_U32) return undefined;
    let lo = 0, hi = BASE_PAIR_COUNT - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const k = BASE_PAIRS_U32[mid << 1];
      if (k === imdbNumeric) return BASE_PAIRS_U32[(mid << 1) + 1];
      if (k < imdbNumeric) lo = mid + 1; else hi = mid - 1;
    }
    return undefined;
  }

  function unpackPacked(packed) {
    return { isTv: !!(packed & 1), tmdbId: packed >>> 1 };
  }

  function gmFetchArrayBuffer(url, headers = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers,
        responseType: 'arraybuffer',
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve({ buf: res.response, headers: res.responseHeaders || '', status: res.status });
          else if (res.status === 304) resolve({ buf: null, headers: res.responseHeaders || '', status: 304 });
          else reject(new Error(`HTTP ${res.status}`));
        },
        onerror: (e) => reject(e.error || e),
        ontimeout: () => reject(new Error('Timeout')),
      });
    });
  }

  async function unzipGzipToArrayBuffer(gzBuf) {
    if (typeof DecompressionStream !== 'function') {
      throw new Error('DecompressionStream(gzip) not supported by this browser.');
    }
    const ds = new DecompressionStream('gzip');
    return await new Response(new Blob([gzBuf]).stream().pipeThrough(ds)).arrayBuffer();
  }

  async function loadBaseFromIDB() {
    const buf = await idbGet(BASE_STORE, BASE_BIN_KEY);
    const count = await idbGet(BASE_STORE, BASE_COUNT_KEY);
    if (!buf || !buf.byteLength) return false;
    if (!parseBaseBinToU32(buf)) return false;
    if (typeof count === 'number') BASE_PAIR_COUNT = count;
    return true;
  }

  async function saveBaseToIDB(buf, etag) {
    await idbPut(BASE_STORE, BASE_BIN_KEY, buf);
    await idbPut(BASE_STORE, BASE_ETAG_KEY, etag || '');
    await idbPut(BASE_STORE, BASE_COUNT_KEY, BASE_PAIR_COUNT);
  }

  async function refreshBaseCacheNow(showAlerts = true) {
    try {
      const prevEtag = (await idbGet(BASE_STORE, BASE_ETAG_KEY)) || '';
      const headers = prevEtag ? { 'If-None-Match': prevEtag } : {};
      const { buf: gzBuf, headers: respHeaders, status } = await gmFetchArrayBuffer(BASE_GZ_URL, headers);
      if (status === 304) {
        GM_setValue('baseLastRevalidateTs', Date.now());
        if (showAlerts) alert('✅ Base cache already up to date.');
        return true;
      }

      const m = String(respHeaders || '').match(/etag:\s*([^\r\n]+)/i);
      const etag = m ? m[1].trim() : '';

      const bin = await unzipGzipToArrayBuffer(gzBuf);
      if (!parseBaseBinToU32(bin)) throw new Error('Invalid base cache (not u32 pairs).');

      await saveBaseToIDB(bin, etag);
      GM_setValue('baseLastRevalidateTs', Date.now());
      if (showAlerts) alert(`✅ Base cache refreshed (${BASE_PAIR_COUNT.toLocaleString()} pairs).`);
      return true;
    } catch (e) {
      console.error('[Base cache] refresh failed:', e);
      if (showAlerts) alert('❌ Base cache refresh failed: ' + e.message);
      return false;
    }
  }

  async function maybeRevalidateBaseMonthly() {
    try {
      const last = gmGetOrSet('baseLastRevalidateTs', 0);
      const now = Date.now();
      if (now - last >= THIRTY_DAYS_MS) {
        await refreshBaseCacheNow(false);
        GM_setValue('baseLastRevalidateTs', Date.now());
      }
    } catch {}
  }

  async function ensureBaseLoadedOnce() {
    if (await loadBaseFromIDB()) return true;
    await refreshBaseCacheNow(false); // first-time fetch
    return await loadBaseFromIDB();
  }

  // ────────────────────────────────────────────────────────────────────────
  // Overrides + Negative caches (kept)
  // ────────────────────────────────────────────────────────────────────────
  let LOCAL_OVERRIDES = null;
  let DIRTY_OVERRIDES = false;

  let LOCAL_NEGATIVE = null;
  let DIRTY_NEGATIVE = false;

  async function overridesLoadOnce() {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = (await idbGet(OVERRIDES_STORE, OVERRIDES_KEY)) || {};
  }
  async function overridesPersist() {
    if (!DIRTY_OVERRIDES) return;
    await idbPut(OVERRIDES_STORE, OVERRIDES_KEY, LOCAL_OVERRIDES);
    try { await idbPut(OVERRIDES_STORE, OVERRIDES_BACKUP_KEY, JSON.parse(JSON.stringify(LOCAL_OVERRIDES))); } catch {}
    DIRTY_OVERRIDES = false;
  }
  async function overridesClear() {
    await idbDel(OVERRIDES_STORE, OVERRIDES_KEY);
    await idbDel(OVERRIDES_STORE, OVERRIDES_BACKUP_KEY);
    LOCAL_OVERRIDES = {};
    DIRTY_OVERRIDES = false;
  }

  async function negativeLoadOnce() {
    if (!LOCAL_NEGATIVE) LOCAL_NEGATIVE = (await idbGet(OVERRIDES_STORE, NEGATIVE_KEY)) || {};
  }
  function negativeGetTs(ttid) { return LOCAL_NEGATIVE ? LOCAL_NEGATIVE[ttid] : undefined; }
  function negativeIsFresh(ttid, now = Date.now()) {
    const ts = negativeGetTs(ttid);
    if (!Number.isFinite(ts)) return false;
    return (now - ts) < NEGATIVE_TTL_MS;
  }
  function negativeSetNow(ttid, now = Date.now()) {
    if (!LOCAL_NEGATIVE) LOCAL_NEGATIVE = {};
    LOCAL_NEGATIVE[ttid] = now;
    DIRTY_NEGATIVE = true;
  }
  async function negativePersist() {
    if (!DIRTY_NEGATIVE) return;
    await idbPut(OVERRIDES_STORE, NEGATIVE_KEY, LOCAL_NEGATIVE);
    try { await idbPut(OVERRIDES_STORE, NEGATIVE_BACKUP_KEY, JSON.parse(JSON.stringify(LOCAL_NEGATIVE))); } catch {}
    DIRTY_NEGATIVE = false;
  }
  async function negativeClear() {
    await idbDel(OVERRIDES_STORE, NEGATIVE_KEY);
    await idbDel(OVERRIDES_STORE, NEGATIVE_BACKUP_KEY);
    LOCAL_NEGATIVE = {};
    DIRTY_NEGATIVE = false;
  }

  function overrideGetPacked(ttid) {
    const v = LOCAL_OVERRIDES ? LOCAL_OVERRIDES[ttid] : undefined;
    return Number.isFinite(v) ? v : undefined;
  }
  function overrideSetPacked(ttid, tmdbId, isTv) {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = {};
    const packed = (tmdbId << 1) | (isTv ? 1 : 0);
    if (LOCAL_OVERRIDES[ttid] !== packed) {
      LOCAL_OVERRIDES[ttid] = packed;
      DIRTY_OVERRIDES = true;
    }
  }
  function getFromAnyCachePacked(ttid) {
    // 1) overrides by 'tt…'
    const ov = overrideGetPacked(ttid);
    if (ov !== undefined) return ov;

    // 2) base by numeric key
    const m = ttid.match(/^tt(\d+)$/);
    if (m) {
      const num = Number(m[1]);
      if (Number.isFinite(num)) {
        const b = baseLookupPackedByNumericImdb(num);
        if (b !== undefined) return b;
      }
    }
    return undefined;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Gzip+Base64 builder (B-style)
  // ────────────────────────────────────────────────────────────────────────
  async function gzipBase64(str) {
    try {
      if (typeof CompressionStream !== 'function') return null;
      const enc = new TextEncoder().encode(str);
      const cs = new CompressionStream('gzip');
      const gzStream = new Blob([enc]).stream().pipeThrough(cs);
      const ab = await new Response(gzStream).arrayBuffer();
      const u8 = new Uint8Array(ab);
      let bin = '';
      const chunk = 0x8000;
      for (let i = 0; i < u8.length; i += chunk) {
        const sub = u8.subarray(i, i + chunk);
        bin += String.fromCharCode.apply(null, sub);
      }
      return btoa(bin);
    } catch {
      return null;
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // Build Fenlight URL — Artwork omitted when action === 'view'
  // ────────────────────────────────────────────────────────────────────────
  async function buildFenUrlTMDB_Art(resolvedItems, opts) {
    const {
      listName, author, description, action = '',
      posterEnabled, posterStrategy,
      fanartEnabled, fanartStrategy, fanartFallback
    } = opts;

    const listItems = resolvedItems.map(it => it.isTv ? ({ id: it.tmdbId, mt: 'tv' }) : ({ id: it.tmdbId }));

    const base = 'plugin://plugin.video.fenlight/?';
    const common = [
      ['mode', 'personal_lists.external'],
      ...(action ? [['action', action]] : []),
      ['list_type', 'tmdb'],
      ['list_name', listName || 'IMDb List'],
      ['author', author || ''],
      ['media_type_default', MEDIA_TYPE_DEFAULT_FIXED],
      ['busy_indicator', gmGetOrSet('indicator', DEFAULT_INDICATOR)],
      ...(description ? [['description', description]] : []),
    ];

    // IMPORTANT CHANGE: If action is 'view', do NOT include poster/fanart keys
    const artworkAllowed = (String(action).toLowerCase() !== 'view');

    // Artwork (match LB exactly, but only if allowed)
    if (artworkAllowed && posterEnabled) {
      common.push(['poster', posterStrategy]); // 'first_4' or 'random'
    }
    if (artworkAllowed && fanartEnabled) {
      if (fanartStrategy === 'author_fanart') {
        let url = getAuthorFanartUrl_IMDb();
        if (url) {
          common.push(['fanart', url]);
        } else {
          if (fanartFallback === 'first_4' || fanartFallback === 'random') {
            common.push(['fanart', fanartFallback]);
          }
          // 'none' ⇒ omit fanart key
        }
      } else {
        // direct strategy: 'first_4' or 'random'
        common.push(['fanart', fanartStrategy]);
      }
    }

    const rawJson = JSON.stringify(listItems);
    const encode = (arr) => arr.map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

    // Raw
    const rawParts = [...common, ['list_items', rawJson]];
    const rawUrl = base + encode(rawParts);
    const rawBytes = utf8ByteLen(rawUrl);

    // Gzip+Base64 (if supported)
    let gzB64 = await gzipBase64(rawJson);
    let gzUrl = null, gzBytes = null;
    if (gzB64) {
      const gzParts = [...common, ['base64_items', gzB64]];
      gzUrl = base + encode(gzParts);
      gzBytes = utf8ByteLen(gzUrl);
    }

    // Choose
    const url = gzUrl || rawUrl;
    const urlBytes = (gzBytes != null) ? gzBytes : rawBytes;

    return { url, urlBytes, rawUrl, rawBytes, gzUrl, gzBytes };
  }

  // ────────────────────────────────────────────────────────────────────────
  // Kodi JSON-RPC + trust preflight (kept)
  // ────────────────────────────────────────────────────────────────────────
  function preflightKodiPermission() {
    const ip   = GM_getValue('kodiIp','').trim();
    const port = GM_getValue('kodiPort','').trim();
    const user = GM_getValue('kodiUser','');
    const pass = gmGetOrSet('kodiPass','');

    if (!ip || !port) return; // nothing to preflight

    try {
      GM_xmlhttpRequest({
        method: 'POST',
        url:    `http://${ip}:${port}/jsonrpc`,
        headers: { 'Content-Type':'application/json', 'Authorization':'Basic ' + btoa(`${user}:${pass}`) },
        data: JSON.stringify({ jsonrpc:'2.0', id:0, method:'JSONRPC.Ping' }),
        timeout: 7000,
        onload: () => {}, onerror: () => {}, ontimeout: () => {}
      });
    } catch {}
  }

  function sendToKodi(url) {
    const ip   = GM_getValue('kodiIp','').trim();
    const port = GM_getValue('kodiPort','').trim();
    const user = GM_getValue('kodiUser','');
    const pass = gmGetOrSet('kodiPass','');
    return new Promise((resolve) => {
      if (!ip || !port) { alert('⚠️ Please configure Kodi IP & port in settings.'); resolve(false); return; }
      GM_xmlhttpRequest({
        method: 'POST',
        url:    `http://${ip}:${port}/jsonrpc`,
        headers: { 'Content-Type':'application/json', 'Authorization':'Basic ' + btoa(`${user}:${pass}`) },
        data: JSON.stringify({ jsonrpc:'2.0', id:1, method:'Player.Open', params:{ item:{ file:url } } }),
        timeout: 15000,
        onload: (res) => resolve(res.status >= 200 && res.status < 300),
        onerror: () => resolve(false),
        ontimeout: () => resolve(false),
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // UI: bubbles, overlays, and ASK — EXACT same visual as Letterboxd
  // ────────────────────────────────────────────────────────────────────────
  function showSideInfoNearEl(el, lines, ms = 5000) {
    try { const prev = document.getElementById('kodi-send-info'); if (prev) prev.remove(); } catch {}
    const box = document.createElement('div');
    box.id = 'kodi-send-info';
    Object.assign(box.style, {
      position:'fixed', top:'0px', right:'130px',
      background:'#1b1b1b', color:'#eee', border:'1px solid #333',
      borderRadius:'6px', padding:'8px 10px', fontSize:'12px',
      lineHeight:'1.4', zIndex:2147483647, boxShadow:'0 2px 10px rgba(0,0,0,.35)',
      maxWidth:'360px', whiteSpace:'pre-wrap', pointerEvents:'none'
    });
    box.innerText = lines.join('\n');
    document.body.append(box);
    let topPx = 150;
    try {
      const rect = el.getBoundingClientRect();
      const boxH = box.offsetHeight;
      topPx = Math.max(10, Math.min(window.innerHeight - boxH - 10, Math.round(rect.top + 40)));
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
        position:'fixed', background:'#1b1b1b', color:'#eee',
        border:'1px solid #333', borderRadius:'8px', padding:'8px 10px',
        fontSize:'12px', lineHeight:'1.4', zIndex:2147483647,
        boxShadow:'0 2px 10px rgba(0,0,0,.35)', maxWidth:'360px', whiteSpace:'pre-wrap'
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

  // Action chooser — FLAM-styled (MOBILE-SAFE) — same as LB
  function askForActionOverlay() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.id = 'flam-action-overlay';
      const SAFE_INSET = 16;
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.66)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 2147483647,
        padding: `${SAFE_INSET}px`,
        boxSizing: 'border-box'
      });

      const panel = document.createElement('div');
      panel.className = 'flam-action-panel';
      Object.assign(panel.style, {
        position: 'relative',
        width: `min(760px, calc(100vw - ${SAFE_INSET * 2}px))`,
        maxWidth: `calc(100vw - ${SAFE_INSET * 2}px)`,
        maxHeight: `calc(100vh - ${SAFE_INSET * 2}px)`,
        overflow: 'auto',
        background: 'linear-gradient(180deg,#2a2a2a 0,#1f1f1f 100%)',
        color: '#e8e8e8',
        border: '1px solid rgba(255,255,255,.85)',
        borderRadius: '22px',
        boxShadow: '0 18px 44px rgba(0,0,0,.55)',
        padding: '28px 22px 20px',
        boxSizing: 'border-box'
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
        #flam-action-overlay .choice-btn {
          appearance: none;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          padding: 18px 12px;
          background: #4b444b;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          box-shadow: inset 0 -2px 0 rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.25);
          cursor: pointer;
          transition: background .12s ease, color .12s ease, transform .06s ease, outline-color .12s ease;
          outline: none;
          width: 100%;
        }
        #flam-action-overlay .choice-btn:focus-visible {
          background: #4b444b;
          color: #ffffff;
          outline: 2px solid rgba(255,255,255,.9);
          outline-offset: 2px;
        }
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
        b.addEventListener('click', () => cleanup(value));
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

      btnView.focus();

      function cleanup(val) {
        document.removeEventListener('keydown', onKey);
        try { overlay.remove(); } catch {}
        resolve(val);
      }
    });
  }

  function showTooManyItemsOverlay(totalCount) {
    const existing = document.getElementById('kodi-too-many-items'); if (existing) try { existing.remove(); } catch {}
    const overlay = document.createElement('div');
    overlay.id = 'kodi-too-many-items';
    Object.assign(overlay.style, {
      position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:2147483647, padding:'20px', boxSizing:'border-box'
    });
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      background:'#222', color:'#eee', borderRadius:'10px',
      width:'560px', maxWidth:'95vw', padding:'20px',
      boxShadow:'0 10px 30px rgba(0,0,0,0.45)', border:'1px solid #333'
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
        Try sending it in smaller parts (for example, a few pages at a time) or filter the list and send again.
      </div>
      <div style="margin-top:14px;text-align:right;">
        <button id="kodi-too-many-items-ok" style="background:#e50914;color:#fff;border:none;border-radius:6px;padding:8px 12px;cursor:pointer">Got it</button>
      </div>
    `;
    overlay.append(panel);
    panel.querySelector('#kodi-too-many-items-ok').onclick = () => { try { overlay.remove(); } catch {} };
    document.body.append(overlay);
  }

  // Description editor (same as LB)
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
        <textarea id="kodieditdesc_text" style="width:600px; max-width:95vw; height:300px; font-size:14px; box-sizing:border-box; white-space:pre-wrap;">${defaultDesc}</textarea>
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
  // Processing core (partition, resolve, persist)
  // ────────────────────────────────────────────────────────────────────────
  async function processAll(ttItems) {
    const baseHits = [];
    const overrideHits = [];
    const negativeHits = [];
    const toResolve = [];

    const now = Date.now();

    // Partition by caches
    for (const it of ttItems) {
      const packed = getFromAnyCachePacked(it.imdbId);
      if (packed !== undefined) {
        const { tmdbId, isTv } = unpackPacked(packed);
        if (overrideGetPacked(it.imdbId) !== undefined) overrideHits.push({ ...it, tmdbId, isTv });
        else baseHits.push({ ...it, tmdbId, isTv });
        continue;
      }
      if (negativeIsFresh(it.imdbId, now)) {
        negativeHits.push({ ...it });
      } else {
        toResolve.push(it);
      }
    }

    const preCounts = {
      base: baseHits.length,
      overrides: overrideHits.length,
      cachedNoId: negativeHits.length,
      uncached: toResolve.length
    };

    // Resolve uncached via TMDB (pool)
    if (toResolve.length) {
      const launchEl = mainIcon || document.body;
      showOrUpdateProcessingBubble(launchEl, [
        'Resolving via TMDB…',
        `Uncached: ${toResolve.length}`,
        `Pool: ${CONCURRENCY_TMDB_FIND}`
      ], true);

      const results = await (async function resolveUncachedWithPool(ttids, onProgress) {
        let idx = 0, active = 0, done = 0;
        const results = Object.create(null);

        return new Promise((resolve) => {
          const launch = () => {
            while (active < CONCURRENCY_TMDB_FIND && idx < ttids.length) {
              const ttid = ttids[idx++]; active++;
              (async () => {
                let tries = 0, res = null;
                while (tries < 3 && res === null) {
                  tries++;
                  try { res = await tmdbFindByImdb(ttid); }
                  catch { res = null; await sleep(300 * tries); }
                }
                results[ttid] = res;
              })().finally(() => {
                active--; done++;
                if (typeof onProgress === 'function') onProgress(done, ttids.length);
                if (idx < ttids.length) launch(); else if (active === 0) resolve(results);
              });
            }
          };
          ttids.length ? launch() : resolve(results);
        });
      })(toResolve.map(x => x.imdbId), (d, total) => {
        showOrUpdateProcessingBubble(launchEl, [
          'Resolving via TMDB…',
          `Progress: ${d} / ${total}`,
          `Pool: ${CONCURRENCY_TMDB_FIND}`
        ], true);
      });

      hideProcessingBubble(true);

      for (const it of toResolve) {
        const r = results[it.imdbId];
        if (r && r.tmdbId) {
          overrideSetPacked(it.imdbId, r.tmdbId, !!r.isTv);
          overrideHits.push({ ...it, tmdbId: r.tmdbId, isTv: !!r.isTv });
        } else {
          negativeSetNow(it.imdbId, now);
          negativeHits.push({ ...it });
        }
      }
      await overridesPersist();
      await negativePersist();
    }

    const resolved = baseHits.concat(overrideHits);
    return {
      resolved,
      counts: preCounts
    };
  }

  // ────────────────────────────────────────────────────────────────────────
  // Launcher ICON + Settings + optional INFO button (LETTERBOXD-STYLE)
  // ────────────────────────────────────────────────────────────────────────
  GM_addStyle(`
    #lb-tmdb-icon-wrap {
      position: fixed; bottom: 10px; right: 10px; display: flex; gap: 8px; align-items: stretch;
      z-index: 2147483647;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;
    }
    #lb-tmdb-main-icon {
      width: var(--lb-size, 64px); height: var(--lb-size, 64px);
      object-fit: contain; border-radius: 10px; background: rgba(0,0,0,0.03);
      box-shadow: 0 2px 10px rgba(0,0,0,0.12); cursor: pointer; user-select: none;
    }
    #lb-tmdb-main-icon:active { transform: translateY(1px); }

    /* Right column that matches the icon's full height */
    #lb-side-buttons {
      display: flex; flex-direction: column; gap: 8px;
      height: var(--lb-size, 64px);
      width: 36px;
    }

    #lb-settings-btn, #lb-info-btn {
      flex: 1; width: 36px; display: grid; place-items: center;
      background: #444; color: #fff; border: none; border-radius: 10px; cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2); padding: 0;
    }
    #lb-settings-btn:active, #lb-info-btn:active { transform: translateY(1px); }

    #lb-settings-btn svg, #lb-info-btn svg { display:block }

    @media (prefers-color-scheme: dark) {
      #lb-tmdb-main-icon { background: rgba(255,255,255,0.06); }
      #lb-settings-btn, #lb-info-btn { background: #333; }
    }
  `);

  const topRightBar = document.createElement('div');
  Object.assign(topRightBar.style, { position: 'fixed', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 2147483647 });
  document.body.append(topRightBar);

  const iconWrap = document.createElement('div');
  iconWrap.id = 'lb-tmdb-icon-wrap';
  iconWrap.style.setProperty('--lb-size', `${gmGetOrSet('lb_icon_size', 64)}px`);

  const mainIcon = document.createElement('img');
  mainIcon.id = 'lb-tmdb-main-icon';
  mainIcon.alt = 'FLAM Launcher';
  mainIcon.src = '';

  // Right-side vertical buttons column
  const sideButtons = document.createElement('div');
  sideButtons.id = 'lb-side-buttons';

  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'lb-settings-btn';
  settingsBtn.title = 'Settings';
  settingsBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="#fff"/>
      <path d="M20 13.1v-2.2l-2.02-.62a6.93 6.93 0 0 0-.52-1.25l1.1-1.84-1.56-1.56-1.84 1.1c-.4-.2-.82-.37-1.25-.52L13.1 4h-2.2l-.61 2.02c-.43.14-.85.31-1.25.52l-1.84-1.1L5.64 7 6.74 8.84c-.2.4-.37.82-.52 1.25L4 10.9v2.2l2.02.62c.14.43.31.85.52 1.25L5.43 16.8l1.56 1.56 1.84-1.1c.4.2.82.37 1.25.52l.62 2.02h2.2l.62-2.02c.43-.14.85-.31 1.25-.52l1.84 1.1 1.56-1.56-1.1-1.84c.2-.4.37-.82.52-1.25L20 13.1Z" fill="#fff"/>
    </svg>
  `;

  // NEW: Info button (simple white "i" silhouette) — toggled by setting
  const infoBtn = document.createElement('button');
  infoBtn.id = 'lb-info-btn';
  infoBtn.title = 'Last Send Info';
  infoBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#fff" opacity=".12"/>
      <path d="M12 6.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-1.25 4.25a1 1 0 0 0-1 1v5.25a1 1 0 1 0 2 0V12h1.25a1 1 0 1 0 0-2H10.75Z" fill="#fff"/>
      <circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.5" opacity=".85"/>
    </svg>
  `;

  sideButtons.append(settingsBtn, infoBtn);
  iconWrap.append(mainIcon, sideButtons);
  topRightBar.append(iconWrap);

  // Icon DB + Picker (same as LB)
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
  function gmFetchArrayBuffer2(url) {
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
      const buf = await gmFetchArrayBuffer2(f.download_url);
      const dataUrl = arrayBufferToDataURL(buf, 'image/png');
      return { name: f.name, dataUrl };
    }));
    const newDb = { icons: downloads, lastSync: new Date().toISOString() };
    GM_setValue(ICON_DB_KEY, newDb);
    return newDb;
  }

  let ICON_DB = GM_getValue(ICON_DB_KEY, null);
  let ICON_SELECTED_NAME = gmGetOrSet(ICON_SELECTED_NAME_KEY, '');
  let ICON_SIZE = parseInt(gmGetOrSet(ICON_SIZE_KEY, 64), 10) || 64;

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

  // NEW: Info button visibility control
  function updateInfoButtonVisibility() {
    const show = gmGetOrSet(INFO_BTN_ENABLE_KEY, true);
    infoBtn.style.display = show ? 'grid' : 'none';
    // If hidden, let settings fill full height (already flex:1) — done via CSS layout.
  }
  updateInfoButtonVisibility();

  // ────────────────────────────────────────────────────────────────────────
  // Run control
  // ────────────────────────────────────────────────────────────────────────
  async function startRun() {
    await ensureBaseLoadedOnce();
    await overridesLoadOnce();
    await negativeLoadOnce();
    setTimeout(() => { maybeRevalidateBaseMonthly(); }, 0);
  }

  async function resolveActionForThisRun() {
    const stored = GM_getValue('kodiAction', 'ask');
    if (stored === 'ask') return await askForActionOverlay();
    return stored;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Show URL (Tools) — LB-style panel and bytes/savings readout
  // ────────────────────────────────────────────────────────────────────────
  async function handleShowUrl(btnEl) {
    if (btnEl) btnEl.disabled = true;

    await startRun();

    let items = await gatherItems();
    if (!items || !items.length) { alert('No items'); if (btnEl) btnEl.disabled = false; return; }
    if (items.length > MAX_LIST_ITEMS) { showTooManyItemsOverlay(items.length); if (btnEl) btnEl.disabled = false; return; }

    let how = prompt('How many items? number or "all":', 'all');
    if (how === null) { if (btnEl) btnEl.disabled = false; return; }
    how = how.trim().toLowerCase();
    if (how !== 'all') {
      const n = parseInt(how, 10);
      if (isNaN(n) || n < 1) { alert('Invalid number'); if (btnEl) btnEl.disabled = false; return; }
      items = items.slice(0, n);
    }

    const { resolved, counts } = await processAll(items);

    const listName = getListName();
    const author = getAuthor();

    // Description (same behavior as Letterboxd = optional edit)
    let descriptionText = '';
    if (gmGetOrSet('descEnable', true)) {
      const pageDesc = getDescriptionText() || DEFAULT_DESCRIPTION;
      if (gmGetOrSet('descMode', 'send') === 'edit') {
        const edited = await editDescriptionOverlay(pageDesc);
        if (edited === null) { if (btnEl) btnEl.disabled = false; return; }
        descriptionText = sanitizeDescPreservingBreaks(edited);
      } else {
        descriptionText = pageDesc;
      }
    }

    // Action (ASK matches LB)
    let action = GM_getValue('kodiAction', 'ask');
    if (action === 'ask') {
      const chosen = await askForActionOverlay();
      if (!chosen && chosen !== '') { if (btnEl) btnEl.disabled = false; return; } // cancel
      action = chosen || '';
    }

    // Artwork options (same keys & behavior as LB)
    const posterEnabled = gmGetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    const posterStrategy = gmGetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    const fanartEnabled = gmGetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    const fanartStrategy = gmGetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    const fanartFallback = gmGetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);

    const fen = await buildFenUrlTMDB_Art(resolved, {
      listName, author, description: descriptionText, action,
      posterEnabled, posterStrategy,
      fanartEnabled, fanartStrategy, fanartFallback
    });

    const pct = Math.min(100, Math.round((fen.urlBytes / URL_LIMIT_BYTES) * 1000) / 10);
    const savings = (typeof fen.gzBytes === 'number') ? (fen.rawBytes - fen.gzBytes) : 0;

    const existing = document.getElementById('kodishowurl'); if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'kodishowurl';
    Object.assign(overlay.style, {
      position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
      background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:2147483647, padding:'20px', boxSizing:'border-box'
    });
    const panel = document.createElement('div');
    Object.assign(panel.style, { background:'#222', padding:'20px', borderRadius:'6px', maxWidth:'95vw' });
    panel.innerHTML = `
      <h2 style="margin:0 0 12px; color:#fff; font-size:18px;">URL (${fen.gzUrl ? 'gzip+base64' : 'raw JSON'})</h2>
      <textarea id="kodishowurl_text" style="width:600px; max-width:95vw; height:200px; font-size:14px; box-sizing:border-box; white-space:pre-wrap;">${fen.url}</textarea>
      <div style="margin-top:10px; padding:8px; background:#1b1b1b; border:1px solid #333; border-radius:6px; color:#ddd; font-size:12px; line-height:1.5">
        <div><strong>Raw URL:</strong> ${fen.rawBytes} bytes</div>
        <div><strong>Gzip+Base64 URL:</strong> ${typeof fen.gzBytes === 'number' ? fen.gzBytes + ' bytes' : 'n/a (compression unavailable)'}</div>
        <div><strong>Savings:</strong> ${typeof fen.gzBytes === 'number' ? (savings + ' bytes (' + (fen.rawBytes ? Math.round((savings / fen.rawBytes) * 100) : 0) + '%)') : '—'}</div>
        <div><strong>Using:</strong> ${fen.gzUrl ? 'base64_items (gzip+base64)' : 'list_items (raw JSON)'}</div>
        <div><strong>Limit usage:</strong> ${fen.urlBytes} / ${URL_LIMIT_BYTES} (${pct}%)</div>
        <div><strong>Cache:</strong> base ${counts.base} • overrides ${counts.overrides} • cached_no_id ${counts.cachedNoId} • uncached ${counts.uncached} (Σ=${counts.base+counts.overrides+counts.cachedNoId+counts.uncached} / ${items.length})</div>
      </div>
      <div style="margin-top:12px; text-align:right;">
        <button id="kodishowurl_copy" style="margin-right:8px; padding:6px 12px; font-size:14px;">Copy URL</button>
        <button id="kodishowurl_close" style="padding:6px 12px; font-size:14px;">Close</button>
      </div>
    `;
    overlay.append(panel);
    document.body.append(overlay);
    panel.querySelector('#kodishowurl_copy').onclick = () => {
      const ta = panel.querySelector('#kodishowurl_text'); ta.select(); document.execCommand('copy');
      panel.querySelector('#kodishowurl_copy').textContent = 'Copied!';
    };
    panel.querySelector('#kodishowurl_close').onclick = () => overlay.remove();

    if (btnEl) btnEl.disabled = false;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Main icon click → EARLY ASK + TRUST PREFLIGHT + full run (LB styling)
  // ────────────────────────────────────────────────────────────────────────
  let ICON_BUSY = false;
  mainIcon.addEventListener('click', async function () {
    if (ICON_BUSY) return;
    ICON_BUSY = true;

    const startTime = performance.now();

    // Trigger TM trust prompt immediately (harmless ping)
    preflightKodiPermission();

    showOrUpdateProcessingBubble(mainIcon, ['Processing…'], true);

    await startRun();

    // Show ASK immediately (if configured) while processing runs
    const stored = GM_getValue('kodiAction', 'ask');
    const actionPromise = (stored === 'ask') ? askForActionOverlay() : Promise.resolve(stored);

    // Process in background
    const processingPromise = (async () => {
      let items;
      try { items = await gatherItems(); }
      catch { alert('Scrape failed'); hideProcessingBubble(true); ICON_BUSY = false; return null; }
      if (!items || !items.length) { alert('No items'); hideProcessingBubble(true); ICON_BUSY = false; return null; }

      if (items.length > MAX_LIST_ITEMS) {
        showTooManyItemsOverlay(items.length);
        hideProcessingBubble(true);
        ICON_BUSY = false;
        return null;
      }

      // Pre-cache stats
      const overrides0 = (await idbGet(OVERRIDES_STORE, OVERRIDES_KEY)) || {};
      let baseHitCount = 0, overrideHitCount = 0, uncachedCount = 0;
      for (const it of items) {
        const fid = String(it.imdbId || '');
        const inOverrides = Number.isFinite(overrides0[fid]);
        if (inOverrides) { overrideHitCount++; continue; }
        const m = fid.match(/^tt(\d+)$/);
        const basePacked = m ? baseLookupPackedByNumericImdb(Number(m[1])) : undefined;
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

      const { resolved, counts } = await processAll(items);

      // Description (same as LB)
      let descriptionText = '';
      if (gmGetOrSet('descEnable', true)) {
        const pageDesc = getDescriptionText() || DEFAULT_DESCRIPTION;
        if (gmGetOrSet('descMode', 'send') === 'edit') {
          const edited = await editDescriptionOverlay(pageDesc);
          if (edited === null) { hideProcessingBubble(true); ICON_BUSY = false; return null; }
          descriptionText = sanitizeDescPreservingBreaks(edited);
        } else {
          descriptionText = pageDesc;
        }
      }

      const listName = getListName();
      const author = getAuthor();

      return { resolved, counts, listName, author, descriptionText, totalItems: items.length };
    })();

    const action = await actionPromise;
    const proc = await processingPromise;
    if (!proc) { ICON_BUSY = false; return; }

    if (stored === 'ask' && !action) { hideProcessingBubble(true); ICON_BUSY = false; return; } // canceled

    // Artwork options pulled from settings (LB parity)
    const posterEnabled = gmGetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    const posterStrategy = gmGetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    const fanartEnabled = gmGetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    const fanartStrategy = gmGetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    const fanartFallback = gmGetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);

    showOrUpdateProcessingBubble(mainIcon, [
      'Building URL…',
      (String(action).toLowerCase() === 'view') ? `Artwork disabled for 'view'` :
      (posterEnabled ? `Poster: ${posterStrategy}` : `Poster: disabled`),
      (String(action).toLowerCase() === 'view') ? `` :
      (fanartEnabled ? `Fanart: ${fanartStrategy}${fanartStrategy==='author_fanart' ? ` (fallback: ${fanartFallback})` : ''}` : `Fanart: disabled`)
    ].filter(Boolean), true);

    const fen = await buildFenUrlTMDB_Art(proc.resolved, {
      listName: proc.listName,
      author: proc.author,
      description: proc.descriptionText,
      action: action || '',
      posterEnabled, posterStrategy,
      fanartEnabled, fanartStrategy, fanartFallback
    });

    showOrUpdateProcessingBubble(mainIcon, [
      'Sending to Kodi…',
      `URL bytes: ${fen.urlBytes} ${fen.gzUrl ? '(gzip+base64)' : '(raw JSON)'}`
    ], true);

    const ok = await sendToKodi(fen.url);
    const elapsedMs = Math.max(0, Math.round(performance.now() - startTime));

    hideProcessingBubble(true);

    const pct = Math.min(100, Math.round((fen.urlBytes / URL_LIMIT_BYTES) * 1000) / 10);
    const lines = [
      `Items sent: ${proc.resolved.length}`,
      `📦 Cache — base: ${proc.counts.base} • overrides: ${proc.counts.overrides} • cached_no_id: ${proc.counts.cachedNoId} • uncached: ${proc.counts.uncached}`,
      `Σ = ${proc.counts.base + proc.counts.overrides + proc.counts.cachedNoId + proc.counts.uncached} / ${proc.totalItems}`,
      `📨 Bytes: ${fen.urlBytes} / ${URL_LIMIT_BYTES} (${pct}%) ${fen.gzUrl ? '[gzip+base64]' : '[raw JSON]'}`,
      `⏱ Elapsed: ${(elapsedMs/1000).toFixed(1)}s`,
      ok ? '✅ Sent' : '❌ Failed'
    ];
    showSideInfoNearEl(mainIcon, lines, 7000);

    // NEW: persist last send stats for Info button
    try {
      GM_setValue(LAST_STATS_KEY, { lines, when: Date.now() });
    } catch {}

    ICON_BUSY = false;
  });

  // NEW: Info button handler — show last saved stats
  infoBtn.addEventListener('click', () => {
    const last = gmGetOrSet(LAST_STATS_KEY, null);
    if (!last || !Array.isArray(last.lines)) {
      showSideInfoNearEl(mainIcon, ['No previous send stats found.', 'Send a list to populate this.'], 5000);
      return;
    }
    const when = new Date(last.when || Date.now());
    const whenStr = `${when.toLocaleDateString()} ${when.toLocaleTimeString()}`;
    const lines = [...last.lines, `🕒 Last sent: ${whenStr}`];
    showSideInfoNearEl(mainIcon, lines, 8000);
  });

  // ────────────────────────────────────────────────────────────────────────
  // Settings (Letterboxd-style): General + Tools tabs (kept, plus info toggle)
  // ────────────────────────────────────────────────────────────────────────
  settingsBtn.addEventListener('click', showSettings);

  function showSettings() {
    if (document.getElementById('kodisettings')) return;

    const overlay = document.createElement('div');
    overlay.id = 'kodisettings';
    Object.assign(overlay.style, {
      position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
      background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center',
      justifyContent:'center', zIndex:2147483647, padding:'20px', boxSizing:'border-box'
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

        <div style="background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:10px;margin-bottom:12px;color:#ddd">
          <label style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="showInfoBtn">
            <span>Show Info Button (shows last send stats)</span>
          </label>
          <div style="font-size:12px;color:#bbb;margin-top:6px;">When enabled, an Info button appears below the settings button. Clicking it shows the last stats bubble from your most recent send.</div>
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

        <div>
          <h3 style="color:#fff;margin:0 0 8px;">Artwork Options</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div style="border:1px solid #333;border-radius:6px;padding:10px;">
              <label style="color:#fff"><input type="checkbox" id="posterEnable"/> Enable Poster</label>
              <div style="color:#bbb;font-size:12px;margin:6px 0 8px">Include the <code>poster</code> key in the URL.<br>(Ignored when action=<code>view</code>)</div>
              <label style="color:#fff">Poster selection:</label>
              <select id="posterStrategy" style="width:100%;margin-top:4px">
                <option value="first_4">first_4</option>
                <option value="random">random</option>
              </select>
            </div>
            <div style="border:1px solid #333;border-radius:6px;padding:10px;">
              <label style="color:#fff"><input type="checkbox" id="fanartEnable"/> Enable Fanart</label>
              <div style="color:#bbb;font-size:12px;margin:6px 0 8px">The <code>fanart</code> key accepts either a strategy or a direct URL.<br>(Ignored when action=<code>view</code>)</div>
              <label style="color:#fff">Fanart selection:</label>
              <select id="fanartStrategy" style="width:100%;margin-top:4px">
                <option value="author_fanart">author_fanart (use page og:image)</option>
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
                On IMDb, “author fanart” uses the page’s OpenGraph image if present; otherwise the chosen fallback strategy.
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
          <button id="btnClearOverrides" title="Clear overrides">Clear Overrides</button>
        </div>
        <div style="color:#bbb; font-size:12px;">
          Use the bottom-right icon to send. Tools let you preview the URL or clear positive overrides.
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
      overflowY: 'auto', boxSizing: 'border-box', color:'#fff'
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

    // hydrate
    panel.querySelector('#iconPreview').src = mainIcon.src;

    panel.querySelector('#kodiIp').value = GM_getValue('kodiIp','');
    panel.querySelector('#kodiPort').value = GM_getValue('kodiPort','');
    panel.querySelector('#kodiUser').value = GM_getValue('kodiUser','');
    panel.querySelector('#kodiPass').value = gmGetOrSet('kodiPass','');
    panel.querySelector('#kodiAction').value = GM_getValue('kodiAction','ask');
    panel.querySelector('#indicator').value = gmGetOrSet('indicator', DEFAULT_INDICATOR);

    panel.querySelector('#descEnable').checked = gmGetOrSet('descEnable', true);
    panel.querySelector('#descMode').value = gmGetOrSet('descMode', 'send');
    const descOpts = panel.querySelector('#descOptions');
    panel.querySelector('#descEnable').addEventListener('change', e => {
      descOpts.style.display = e.target.checked ? 'block' : 'none';
    });
    if (panel.querySelector('#descEnable').checked) descOpts.style.display = 'block';

    // Info toggle
    panel.querySelector('#showInfoBtn').checked = gmGetOrSet(INFO_BTN_ENABLE_KEY, true);

    panel.querySelector('#posterEnable').checked = gmGetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    panel.querySelector('#posterStrategy').value = gmGetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    panel.querySelector('#fanartEnable').checked = gmGetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    panel.querySelector('#fanartStrategy').value = gmGetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    panel.querySelector('#fanartFallback').value = gmGetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);
    function refreshFanartFallbackVisibility() {
      const strat = panel.querySelector('#fanartStrategy').value;
      panel.querySelector('#fanartFallbackBox').style.display = (strat === 'author_fanart') ? 'block' : 'none';
    }
    panel.querySelector('#fanartStrategy').addEventListener('change', refreshFanartFallbackVisibility);
    refreshFanartFallbackVisibility();

    // Icon controls
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
          panel.querySelector('#iconPreview').src = mainIcon.src;
        });
        iconGrid.appendChild(img);
      }
    }
    function syncSizeInputs() {
      sizeRange.value = String(ICON_SIZE);
      sizeNumber.value = String(ICON_SIZE);
    }

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
        panel.querySelector('#iconPreview').src = mainIcon.src;
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

    // Cache tools (base)
    const cacheMsg = panel.querySelector('#cacheToolMsg');
    const setCacheMsg = (txt, ok=false) => { cacheMsg.textContent = txt || ''; cacheMsg.style.color = ok ? '#8ee6a4' : '#bbb'; };
    panel.querySelector('#refreshBaseCacheBtn').onclick = async () => {
      setCacheMsg('Refreshing base cache…');
      const ok = await refreshBaseCacheNow(true);
      setCacheMsg(ok ? `Base cache ready (${BASE_PAIR_COUNT.toLocaleString()} pairs).` : 'Base cache refresh failed.', ok);
    };

    // Tools tab buttons
    panel.querySelector('#btnShowUrl').onclick = function () { handleShowUrl(this); };
    panel.querySelector('#btnClearOverrides').onclick = async () => { await overridesClear(); alert('Overrides cleared'); };

    // Save/Close
    panel.querySelector('#kodisave').onclick = () => {
      GM_setValue('kodiIp', panel.querySelector('#kodiIp').value.trim());
      GM_setValue('kodiPort', panel.querySelector('#kodiPort').value.trim());
      GM_setValue('kodiUser', panel.querySelector('#kodiUser').value);
      GM_setValue('kodiPass', panel.querySelector('#kodiPass').value);
      GM_setValue('kodiAction', panel.querySelector('#kodiAction').value);
      GM_setValue('indicator', panel.querySelector('#indicator').value);

      GM_setValue('descEnable', panel.querySelector('#descEnable').checked);
      GM_setValue('descMode', panel.querySelector('#descMode').value);

      GM_setValue('posterEnable', panel.querySelector('#posterEnable').checked);
      GM_setValue('posterStrategy', panel.querySelector('#posterStrategy').value);
      GM_setValue('fanartEnable', panel.querySelector('#fanartEnable').checked);
      GM_setValue('fanartStrategy', panel.querySelector('#fanartStrategy').value);
      GM_setValue('fanartFallback', panel.querySelector('#fanartFallback').value);

      GM_setValue(INFO_BTN_ENABLE_KEY, panel.querySelector('#showInfoBtn').checked);
      updateInfoButtonVisibility();

      overlay.remove();
      alert('✅ Settings saved');
    };
    panel.querySelector('#kodicancel').onclick = () => overlay.remove();
  }

})();

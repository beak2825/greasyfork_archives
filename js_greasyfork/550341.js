// ==UserScript==
// @name         SHOPEE CATALOG MAKER
// @namespace    https://markg.dev/userscripts/shopee-recommend-auto-visit
// @version      2.0
// @description  One button: detect total → auto-visit ?page=0..N (same tab) → aggregate → auto-append to Google Sheets (A:id, B:title, C:link, D:image_link, E:video_url). Adds support for /api/v4/search/search_items (15-page cap if total_count > 1000) and /api/v4/shop/rcmd_items (page-based on shop pages). Preserves all query params when paginating, includes JSON XHR handling, stall watchdog, and robust CLEAR.
// @author       You
// @match        https://shopee.ph/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/550341/SHOPEE%20CATALOG%20MAKER.user.js
// @updateURL https://update.greasyfork.org/scripts/550341/SHOPEE%20CATALOG%20MAKER.meta.js
// ==/UserScript==

// ---- GM XHR wrapper (Tampermonkey/Violentmonkey) ----
const gmXhr = (typeof GM_xmlhttpRequest === 'function')
  ? GM_xmlhttpRequest
  : (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function'
      ? GM.xmlHttpRequest
      : null);

(function () {
  'use strict';

  /*** ===== Constants ===== ***/
  const RECO_ENDPOINTS = ['/api/v4/recommend/recommend_v2','/api/v4/recommend/recommend'];
  const SEARCH_ENDPOINT = '/api/v4/search/search_items';
  const SHOP_RCMD_ENDPOINT = '/api/v4/shop/rcmd_items';

  const isRecoEndpoint   = (u)=> RECO_ENDPOINTS.some(p => u && u.includes(p));
  function isSearchEndpoint(u) {
    try { const url = new URL(u, location.origin); return url.pathname.replace(/\/+$/, '') === SEARCH_ENDPOINT; }
    catch { return typeof u === 'string' && u.includes(SEARCH_ENDPOINT); }
  }
  function isShopRcmdEndpoint(u) {
    try { const url = new URL(u, location.origin); return url.pathname.replace(/\/+$/, '') === SHOP_RCMD_ENDPOINT; }
    catch { return typeof u === 'string' && u.includes(SHOP_RCMD_ENDPOINT); }
  }
  function isShopPage() {
    try { return /^\/shop\/\d+\/?$/.test(new URL(location.href).pathname); } catch { return false; }
  }

  const DEFAULT_LIMIT = 60; // legacy per-page for page math on search/reco
  const UI_ID = 'shp-reco-capture-root';
  const SESSION_KEY = '__shp_reco_crawl_session__';
  const SETTINGS_KEY = '__shp_reco_settings__';
  const AUTO_RUN_KEY = '__shp_reco_auto_run__'; // {pending:true}
  const NUDGE_ON_LOAD = false;

  // Stall watchdog
  const STALL_CHECK_EVERY_MS = 1500;
  const STALL_THRESHOLD_MS   = 6000;
  let __lastCaptureTs = 0;
  function markCapturedNow() { __lastCaptureTs = Date.now(); }

  // rcmd helpers
  let __shopRcmdLimit = 0;      // learned per-page (≈30)
  let __modePin = null;
  let __modePinUntil = 0;
  function pinMode(mode, ms=2000){ __modePin = mode; __modePinUntil = Date.now() + ms; }
  function isPinned(mode){ return __modePin === mode && Date.now() < __modePinUntil; }

  /*** ===== Session helpers ===== ***/
  function loadSession() { try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
  function saveSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {} }
  function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch {} }

  function getEmptySession() {
    // mode: 'reco' | 'search' | 'shop_rcmd'
    return { active: false, completed: false, baseUrl: '', total: 0, pages: 0, nextPage: 0, collectedCount: 0, items: {}, mode: '', limit: 0 };
  }

  /*** ===== Auto-run flag ===== ***/
  function setAutoRunPending(p) { try { localStorage.setItem(AUTO_RUN_KEY, JSON.stringify({ pending: !!p })); } catch {} }
  function isAutoRunPending()  { try { const v = JSON.parse(localStorage.getItem(AUTO_RUN_KEY)||'null'); return !!(v && v.pending); } catch { return false; } }

  /*** ===== URL helpers (preserve existing query params) ===== ***/
  function getBaseUrl() {
    const u = new URL(location.href);
    u.searchParams.delete('page'); // keep all other params
    u.hash = '';
    return u.toString();
  }
  function urlWithPage(base, page) {
    const u = new URL(base, location.origin);
    u.searchParams.set('page', String(page));
    return u.toString();
  }
  function getCurrentPageParam() {
    const u = new URL(location.href);
    const p = u.searchParams.get('page');
    return p ? Number(p) : 0;
  }
  function isAtBase(session) {
    if (!session || !session.baseUrl) return false;
    try {
      const now  = new URL(location.href);
      const base = new URL(session.baseUrl, location.origin);
      now.searchParams.delete('page'); base.searchParams.delete('page');
      return now.origin === base.origin && now.pathname === base.pathname && now.search === base.search;
    } catch { return false; }
  }
  function resetIfUrlChanged() {
    const s = loadSession();
    if (!s) return;
    if (!s.active) {
      const currentBase = getBaseUrl();
      if (typeof s.baseUrl === 'string' && s.baseUrl !== '' && s.baseUrl !== currentBase) {
        clearSession();
        updateLog('Detected navigation/filter change → cleared stale session.');
      }
    }
  }

  /*** ===== Global state ===== ***/
  let lastTotal = 0;    // numeric total from last intercepted response
  let lastMode  = '';   // 'reco' | 'search' | 'shop_rcmd'

  /*** ===== Settings (GSheets) ===== ***/
  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || {};
      return { webappUrl: s.webappUrl || '', sheetIdOrUrl: s.sheetIdOrUrl || '', tabName: s.tabName || '' };
    } catch { return { webappUrl:'', sheetIdOrUrl:'', tabName:'' }; }
  }
  function saveSettings(o) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(o)); } catch {} }
  function parseSheetId(input) {
    if (!input) return '';
    const m = String(input).match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return m ? m[1] : String(input).trim();
  }

  /*** ===== Utilities ===== ***/
  function safeGet(obj, path, fallback = undefined) {
    try { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj) ?? fallback; }
    catch { return fallback; }
  }
  function maybeFirst(x) { return Array.isArray(x) ? x[0] : x; }
  function firstNonEmpty() { for (const v of arguments) if (v != null && v !== '') return v; return ''; }
  function looksLikeHex32(s){ return /^[0-9a-f]{32}$/i.test(String(s||'')); }
  function looksLikeRegionKey(s){ return /^[a-z]{2}-\d{5,}-/i.test(String(s||'')); }

  function getSearchTotal(payload) {
    const root = payload && payload.total_count;
    if (Number.isFinite(+root)) return +root;
    const d1 = safeGet(payload, 'data.total_count'); if (Number.isFinite(+d1)) return +d1;
    const d2 = safeGet(payload, 'data.totalCount');  if (Number.isFinite(+d2)) return +d2;
    const d3 = safeGet(payload, 'data.total_with_ads'); if (Number.isFinite(+d3)) return +d3;
    const d4 = safeGet(payload, 'data.total'); if (Number.isFinite(+d4)) return +d4;
    return 0;
  }

  function imageKeyToJpegUrl(imageKey) {
    if (!imageKey) return '';
    const baseShopee = 'https://down-ph.img.susercontent.com/file/';
    let key = String(imageKey).split('?')[0];
    const hasExt = /\.(jpe?g|png|webp)$/i.test(key);

    if (looksLikeHex32(key)) return 'https://images.weserv.nl/?output=jpg&url=' + encodeURIComponent(baseShopee + key);
    if (hasExt) return /\.webp$/i.test(key)
      ? 'https://images.weserv.nl/?output=jpg&url=' + encodeURIComponent(baseShopee + key)
      : baseShopee + key;
    if (looksLikeRegionKey(key)) return baseShopee + key + '.jpg';
    return 'https://images.weserv.nl/?output=jpg&url=' + encodeURIComponent(baseShopee + key);
  }

  function getVideoUrlFromFormats(formatsArr) {
    if (Array.isArray(formatsArr)) {
      const exact = formatsArr?.[0]?.url || '';
      if (exact) return exact;
      const f = formatsArr.find(x => x && x.url);
      if (f && f.url) return f.url;
    }
    return '';
  }

  /*** ===== Data mapping (RECOMMEND) ===== ***/
  function buildRowsFromRecoPayload(payload) {
    const total = Number(safeGet(payload, 'data.total', 0)) || 0;
    const units = safeGet(payload, 'data.units', []) || [];
    const rows = units.map(u => {
      const name   = safeGet(u, 'item.item_card_displayed_asset.name', '');
      const image  = safeGet(u, 'item.item_card_displayed_asset.image', '');
      const itemid = safeGet(u, 'item.item_data.itemid', '');
      const shopid = safeGet(u, 'item.item_data.shopid', '');
      const link        = (itemid && shopid) ? `https://shopee.ph/product/${shopid}/${itemid}` : '';
      const image_link  = imageKeyToJpegUrl(image);

      const directFormats = safeGet(u,'item.item_data.video_info_list.0.formats',[]);
      const video0_url =
        getVideoUrlFromFormats(directFormats) ||
        firstNonEmpty(
          safeGet(u,'item.item_data.video_info_list.0.video_url',''),
          safeGet(u,'item.item_card_displayed_asset.video_info_list.0.video_url',''),
          safeGet(u,'item.item_card_displayed_asset.video_url',''),
          ''
        );

      return { id: itemid || '', title: name || '', link, image_link, video0_url };
    });
    return { total, rows };
  }

  /*** ===== Data mapping (SEARCH) ===== ***/
function buildRowsFromSearchPayload(payload) {
  // Total variants
  const total = getSearchTotal(payload) || 0;

  // Prefer root.items → data.items → sections[…].data.items/item
  let items = Array.isArray(payload?.items) ? payload.items : [];
  if ((!items || !items.length) && Array.isArray(safeGet(payload, 'data.items'))) {
    items = safeGet(payload, 'data.items');
  }
  if ((!items || !items.length) && Array.isArray(safeGet(payload, 'data.sections'))) {
    const sections = safeGet(payload, 'data.sections', []);
    for (const s of sections) {
      const secItems = safeGet(s, 'data.items', safeGet(s, 'data.item', []));
      if (Array.isArray(secItems) && secItems.length) { items = secItems; break; }
    }
  }

  const rows = (items || []).map((it) => {
    // === Your requested selectors (highest priority) ===
    const itemid = firstNonEmpty(
      it?.itemid,
      safeGet(it, 'item_data.itemid'),
      safeGet(it, 'item_basic.itemid'),
      ''
    );

    const shopid = firstNonEmpty(
      safeGet(it, 'item_data.shopid'),
      it?.shopid,
      safeGet(it, 'item_basic.shopid'),
      ''
    );

    const name = firstNonEmpty(
      safeGet(it, 'item_card_displayed_asset.name'),
      safeGet(it, 'item_basic.name'),
      it?.name,
      ''
    );

    const image = firstNonEmpty(
      safeGet(it, 'item_card_displayed_asset.image'),
      safeGet(it, 'item_basic.image'),
      it?.image,
      ''
    );

    // Build link & image_link
    const link       = (itemid && shopid) ? `https://shopee.ph/product/${shopid}/${itemid}` : '';
    const image_link = imageKeyToJpegUrl(image);

    // Video (try item_data → displayed_asset → item_basic)
    const vf1 = safeGet(it, 'item_data.video_info_list.0.formats', []);
    const vf2 = safeGet(it, 'item_card_displayed_asset.video_info_list.0.formats', []);
    const vf3 = safeGet(it, 'item_basic.video_info_list.0.formats', []);
    const videoFromFormats = getVideoUrlFromFormats(vf1) || getVideoUrlFromFormats(vf2) || getVideoUrlFromFormats(vf3);

    const videoFallback = firstNonEmpty(
      safeGet(it, 'item_data.video_info_list.0.video_url', ''),
      safeGet(it, 'item_card_displayed_asset.video_info_list.0.video_url', ''),
      safeGet(it, 'item_card_displayed_asset.video_url', ''),
      safeGet(it, 'item_basic.video_info_list.0.video_url', ''),
      ''
    );

    const video0_url = firstNonEmpty(videoFromFormats, videoFallback, '');

    return {
      id: itemid ? String(itemid) : '',
      title: name || '',
      link,
      image_link,
      video0_url
    };
  }).filter(r => r.id && r.link); // keep only valid rows

  return { total, rows };
}



  /*** ===== Data mapping (SHOP RCMD) ===== ***/
  // Strict to your fields; resilient to [0] arrays and sections wrapper.
  function buildRowsFromShopRcmdPayload(payload) {
    const total = Number(safeGet(payload, 'data.total', 0)) || 0;

    let cards = [];
    const central = maybeFirst(safeGet(payload, 'data.centralize_item_card'));
    if (central && Array.isArray(central.item_cards)) cards = central.item_cards;

    if (!cards.length) {
      const sections = safeGet(payload, 'data.sections', []);
      if (Array.isArray(sections)) {
        for (const sec of sections) {
          const c2 = maybeFirst(safeGet(sec, 'data.centralize_item_card'));
          if (c2 && Array.isArray(c2.item_cards) && c2.item_cards.length) { cards = c2.item_cards; break; }
          const altArr = safeGet(sec, 'data.item_cards', []);
          if (Array.isArray(altArr) && altArr.length) { cards = altArr; break; }
        }
      }
    }
    if (!cards.length) {
      const alt2 = safeGet(payload, 'data.item_cards', []);
      if (Array.isArray(alt2) && alt2.length) cards = alt2;
    }

    const payloadShopId = firstNonEmpty(
      safeGet(payload, 'data.shopid', ''),
      safeGet(payload, 'data.shop.shopid', '')
    );

    const rows = [];
    for (const card of (cards || [])) {
      const priceNode  = maybeFirst(safeGet(card, 'item_card_display_price')) || {};
      const assetNode  = maybeFirst(safeGet(card, 'item_card_displayed_asset')) || {};

      const itemid = safeGet(priceNode, 'item_id', '');
      const name   = safeGet(assetNode, 'name', '');
      const image  = safeGet(assetNode, 'image', '');
      const shopid = firstNonEmpty(safeGet(card, 'shopid', ''), payloadShopId);

      const link = (itemid && shopid) ? `https://shopee.ph/product/${shopid}/${itemid}` : '';
      const image_link = imageKeyToJpegUrl(image);

      if (itemid && link) rows.push({ id: String(itemid), title: String(name || ''), link, image_link, video0_url: '' });
    }

    // learn per-page on first hit (≈30)
    if (!__shopRcmdLimit && Array.isArray(cards)) __shopRcmdLimit = cards.length || 0;

    return { total, rows, perPage: Array.isArray(cards) ? cards.length : 0 };
  }

  /*** ===== Interceptors (page context) ===== ***/
  (function installNetworkHooks(){
    const PAGE = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    if (PAGE.__SHOPEE_RECO_SEARCH_HOOKS_192__) return;
    PAGE.__SHOPEE_RECO_SEARCH_HOOKS_192__ = true;

    const handleJson = (url, data) => {
      if (!data || typeof data !== 'object') return;

      if (isShopRcmdEndpoint(url)) {
        const parsed = buildRowsFromShopRcmdPayload(data);
        lastTotal = parsed.total;
        lastMode  = 'shop_rcmd';
        pinMode('shop_rcmd', 2000);
        updateLog(`(shop_rcmd) Total items: ${lastTotal}`);
        markCapturedNow();
        onPageDataArrived(parsed.rows);
        maybeKickAutoStartAfterTotal();
        return;
      }

      // If we're on a shop page and just pinned rcmd, ignore search/reco noise
      if (isShopPage() && isPinned('shop_rcmd')) return;

      if (isSearchEndpoint(url)) {
        const parsed = buildRowsFromSearchPayload(data);
        lastTotal = parsed.total;
        lastMode  = 'search';
        updateLog(`(search) Total items: ${lastTotal}`);
        markCapturedNow();
        onPageDataArrived(parsed.rows);
        maybeKickAutoStartAfterTotal();
        return;
      }

      if (isRecoEndpoint(url)) {
        const parsed = buildRowsFromRecoPayload(data);
        lastTotal = parsed.total;
        lastMode  = 'reco';
        updateLog(`(recommend) Total items: ${lastTotal}`);
        markCapturedNow();
        onPageDataArrived(parsed.rows);
        maybeKickAutoStartAfterTotal();
        return;
      }
    };

    // fetch
    const origFetch = PAGE.fetch && PAGE.fetch.bind(PAGE);
    if (origFetch) {
      PAGE.fetch = function(...args){
        let url = '';
        try { url = (typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url) || ''; } catch {}
        const watching = isRecoEndpoint(url) || isSearchEndpoint(url) || isShopRcmdEndpoint(url);
        const p = origFetch(...args);
        if (!watching) return p;

        return p.then(async (res) => {
          try { const copy = res.clone(); const data = await copy.json(); handleJson(url, data); } catch {}
          return res;
        });
      };
    }

    // XMLHttpRequest
    const XHR = PAGE.XMLHttpRequest && PAGE.XMLHttpRequest.prototype;
    if (XHR) {
      const oopen = XHR.open;
      const osend = XHR.send;

      XHR.open = function(method, url){ try { this._url = url; } catch {} return oopen.apply(this, arguments); };
      XHR.send = function(body){
        if (typeof this.addEventListener === 'function') {
          this.addEventListener('loadend', function(){
            try {
              const url = this._url || '';
              const watching = isRecoEndpoint(url) || isSearchEndpoint(url) || isShopRcmdEndpoint(url);
              if (!watching) return;

              if (this.responseType === 'json' && this.response) { handleJson(url, this.response); return; }
              const isText = (this.responseType === '' || this.responseType === 'text' || this.responseType == null);
              if (isText && this.responseText) { try { const data = JSON.parse(this.responseText); handleJson(url, data); } catch {} }
            } catch {}
          });
        }
        return osend.apply(this, arguments);
      };
    }
  })();
  /*** ===== Crawl engine ===== ***/
function calculatePages(total, mode, sessionLimit = 0) {
  const perPage = (mode === 'shop_rcmd')
      ? (Number(sessionLimit) || Number(__shopRcmdLimit) || 30)
      : DEFAULT_LIMIT;

  const rawPages = Math.ceil((Number(total) || 0) / perPage);
  const t = Number(total) || 0;

  if (mode === 'search') {
    // Dynamic caps based on reported total_count.
    // Adjust thresholds if you want more/less aggression.
    if (t <= 1000) return rawPages;                 // full (small sets)
    if (t <= 2000) return Math.min(rawPages, 25);   // ~1500 items cap
    if (t <= 5000) return Math.min(rawPages, 50);   // ~3000 items cap
    return Math.min(rawPages, 100);                 // hard max (~6000 items)
  }

  // shop_rcmd and recommend use default rawPages
  return rawPages;
}


  function preferredMode() {
    // If we're on a shop page, crawl rcmd regardless of any search/reco noise
    return isShopPage() ? 'shop_rcmd' : (lastMode || 'reco');
  }

  function startCrawl(autoNote = '') {
    const baseUrl = getBaseUrl();
    const session = getEmptySession();
    session.mode  = preferredMode();
    session.total = lastTotal || 0;

    // seed limit for rcmd if already learned
    if (session.mode === 'shop_rcmd') session.limit = Number(__shopRcmdLimit) || session.limit || 0;

    session.pages = calculatePages(session.total, session.mode, session.limit);
    session.active = true;
    session.completed = false;
    session.baseUrl = baseUrl;
    session.nextPage = 0;
    saveSession(session);

    updateLog(`Crawl started${autoNote}.\nMode=${session.mode} | Total=${session.total} | Pages=${session.pages}\nVisiting page 0…`);

    // keep original UX (visible ?page=0) and let SPA fire the call
    location.href = urlWithPage(baseUrl, 0);
  }

  function onPageDataArrived(rows) {
    markCapturedNow();

    const session = loadSession();
    if (!session || !session.active) return;

    // For rcmd: learn per-page from first page if unknown, then recompute pages
    if (session.mode === 'shop_rcmd' && !session.limit) {
      const inferred = Number(__shopRcmdLimit) || (Array.isArray(rows) ? rows.length : 0) || 0;
      if (inferred) {
        session.limit = inferred;
        session.pages = calculatePages(session.total, session.mode, session.limit);
      }
    }

    const currentPage = getCurrentPageParam();
    let added = 0;
    for (const r of rows || []) {
      const id = String(r?.id || '');
      if (!id) continue;
      if (!session.items[id]) { session.items[id] = r; added++; }
    }
    session.collectedCount = Object.keys(session.items).length;
    saveSession(session);

 if (currentPage === session.nextPage) {
  // 1) Hard stop if this page yielded ZERO new items
  if (added === 0) {
    updateLog(
      `Page ${currentPage} captured (+0). No new items → stopping crawl.\n` +
      `Collected so far: ${session.collectedCount}/${session.total}\n` +
      `Proceeding to store & push to Google Sheets…`
    );
    session.active = false;
    session.completed = true;
    saveSession(session);

    // Push immediately (don’t rely on returning to base)
    try { pushToGSheets(true); } catch (e) {}

    // Optionally return to base after a short delay (for UI/table render)
    setTimeout(() => { location.href = session.baseUrl; }, 800);
    return;
  }

  // 2) Normal flow: continue or finish when all planned pages are done
  const done = (session.nextPage >= session.pages - 1);
  if (done) {
    updateLog(
      `Page ${currentPage} captured (+${added}). All pages done.\n` +
      `Collected: ${session.collectedCount}/${session.total}\nReturning to base…`
    );
    session.active = false;
    session.completed = true;
    saveSession(session);

    // Push as soon as we’re finished
    try { pushToGSheets(true); } catch (e) {}

    setTimeout(() => { location.href = session.baseUrl; }, 500);
  } else {
    session.nextPage += 1;
    saveSession(session);

    // --- Anti-rate-limit: every 15 pages pause random 5–10s ---
    // Pause BEFORE navigating to the milestone page
    let delay = 400; // default quick delay
    if ((session.nextPage % 15) === 0) {
      const extra = 5000 + Math.floor(Math.random() * 5001); // 5000–10000ms
      delay = extra;
      updateLog(
        `Page ${currentPage} captured (+${added}). ` +
        `Pausing ${(extra / 1000).toFixed(1)}s (anti-rate-limit) before page ${session.nextPage}…`
      );
    } else {
      updateLog(
        `Page ${currentPage} captured (+${added}).\n` +
        `Collected: ${session.collectedCount}/${session.total}\n` +
        `Next → page ${session.nextPage}`
      );
    }

    setTimeout(() => {
      location.href = urlWithPage(session.baseUrl, session.nextPage);
    }, delay);
  }
}


  }

  function maybeResumeCrawl() {
    const session = loadSession();
    if (!session || !session.active) return;
    const currentPage = getCurrentPageParam();
    if (currentPage !== session.nextPage) {
      updateLog(`Resuming crawl… expected page ${session.nextPage}, navigating…`);
      setTimeout(() => { location.href = urlWithPage(session.baseUrl, session.nextPage); }, 200);
      return;
    }
    updateLog(`Resuming crawl on page ${currentPage}/${Math.max(0, session.pages - 1)}…`);
  }

  function maybeRenderResultsAtBase() {
    const session = loadSession();
    if (!session) return;
    const atBase = isAtBase(session);
    const finished = (session.completed || (!session.active && Object.keys(session.items).length > 0));
    if (finished && atBase) {
      const rows = Object.values(session.items);
      populateTable(rows);
      updateLog(`DONE.\nMode=${session.mode || '-'}\nCollected: ${rows.length}/${session.total}\nReady to push to GSheets.`);
      if (isAutoRunPending()) pushToGSheets(true);
    }
  }

  /*** ===== Auto-run orchestration ===== ***/
  function maybeKickAutoStartAfterTotal() {
    if (!isAutoRunPending()) return;

    const wantMode = preferredMode();
    if (!Number(lastTotal)) return;
    if (wantMode === 'shop_rcmd' && lastMode !== 'shop_rcmd') return; // wait for rcmd total

    const s = loadSession();
    if (s) {
      if (s.active || s.completed) return;
      if (Object.keys(s.items || {}).length > 0) return;
    }
    startCrawl(' (auto)');
  }

  /*** ===== UI ===== ***/
  let uiRoot, btnCapture, btnCaptureAll, btnClear, table, logArea, inputWebApp, inputSheetId, inputTab;

  function ensureUI() {
    if (uiRoot) return;
    const host = document.createElement('div');
    host.id = UI_ID;
    Object.assign(host.style, {
      position: 'fixed', zIndex: 999999, bottom: '20px', right: '20px',
      width: '900px', maxHeight: '78vh', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, system-ui, Arial, sans-serif', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      borderRadius: '12px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.1)'
    });

    const header = document.createElement('div');
    Object.assign(header.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 12px', background: '#f6f7f9', borderBottom: '1px solid rgba(0,0,0,0.08)' });

    const title = document.createElement('div');
    title.textContent = 'Shopee Auto-Pagination Capture + GSheets (Recommend + Search + Shop Rcmd)';
    Object.assign(title.style, { fontWeight: '600', fontSize: '14px' });

    const btnWrap = document.createElement('div');
    Object.assign(btnWrap.style, { display: 'flex', gap: '8px', flexWrap: 'wrap' });

    const btnCaptureAllHandler = () => {
      const settings = loadSettings();
      const webappUrl = (settings.webappUrl || '').trim();
      const sheetId   = parseSheetId(settings.sheetIdOrUrl || '');
      const tabName   = (settings.tabName || '').trim();
      if (!webappUrl || !sheetId || !tabName) {
        updateLog(`⚠️ Fill Settings (Web App /exec, Sheet ID/URL, Tab) then Save. Aborting CAPTURE ALL.`);
        return;
      }
      const s = getEmptySession();
      s.total = lastTotal || 0;
      s.baseUrl = getBaseUrl();
      s.mode = preferredMode(); // lock mode by page type
      saveSession(s);
      setAutoRunPending(true);

      if (Number(lastTotal) && (s.mode === lastMode)) {
        startCrawl(' (auto)');
      } else {
        updateLog('Waiting for feed to report total for the chosen mode… Nudging page to trigger load…');
        try { window.scrollBy(0, 1); setTimeout(() => window.scrollBy(0, -1), 150); } catch {}
        const u = new URL(location.href);
        if (!u.searchParams.has('page')) location.href = urlWithPage(getBaseUrl(), 0);
      }
    };

    const button = (txt, bg, onClick) => {
      const b = document.createElement('button');
      b.textContent = txt;
      Object.assign(b.style, { cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '8px',
        padding: '6px 10px', background: bg, color: '#fff', fontWeight: '600' });
      b.addEventListener('click', onClick);
      return b;
    };

    const mkInput = (ph) => { const i = document.createElement('input'); i.type='text'; i.placeholder=ph;
      Object.assign(i.style, { padding:'6px 8px', border:'1px solid rgba(0,0,0,0.2)', borderRadius:'8px' }); return i; };

    const btnCaptureAll = button('CAPTURE ALL', '#198754', btnCaptureAllHandler);
    const btnCapture = button('CAPTURE', '#0d6efd', () => {
      const s = loadSession();
      const rows = s ? Object.values(s.items || {}) : [];
      populateTable(rows);
      const baseForLog = getBaseUrl();
      updateLog(`${summaryLine(rows.length, s && s.total)}\nMode=${(s && s.mode) || lastMode || '-'}\nBase: ${baseForLog}`);
    });
    const btnClear = button('CLEAR', '#6c757d', () => {
      try { localStorage.removeItem(SESSION_KEY); } catch {}
      try { localStorage.removeItem(AUTO_RUN_KEY); } catch {}
      populateTable([]); updateLog('Cleared local session (items, flags, baseUrl). Ready for a fresh capture.');
    });

    btnWrap.append(btnCaptureAll, btnCapture, btnClear);
    header.append(title, btnWrap);

    const body = document.createElement('div');
    Object.assign(body.style, { display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 12px', overflow: 'hidden' });

    const settingsRow = document.createElement('div');
    Object.assign(settingsRow.style, { display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.7fr 130px', gap: '8px', alignItems: 'center' });
    const inputWebApp = mkInput('GAS Web App URL (/exec)');
    const inputSheetId = mkInput('Sheet ID or full URL');
    const inputTab = mkInput('Tab name');
    const btnSave = button('Save Settings', '#0b7285', () => {
      saveSettings({ webappUrl: inputWebApp.value.trim(), sheetIdOrUrl: inputSheetId.value.trim(), tabName: inputTab.value.trim() });
      updateLog('Settings saved.');
    });
    settingsRow.append(inputWebApp, inputSheetId, inputTab, btnSave);

    const tableWrap = document.createElement('div');
    Object.assign(tableWrap.style, { overflow: 'auto', maxHeight: '48vh', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' });

    const table = document.createElement('table');
    Object.assign(table.style, { width: '100%', borderCollapse: 'collapse', fontSize: '12px' });
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    ['id', 'title', 'link', 'image_link (JPEG)', 'video[0].url'].forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      Object.assign(th.style, { textAlign: 'left', position: 'sticky', top: '0', background: '#fafafa',
        borderBottom: '1px solid rgba(0,0,0,0.12)', padding: '8px' });
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);
    table.appendChild(document.createElement('tbody'));
    tableWrap.appendChild(table);

    const logArea = document.createElement('div');
    logArea.textContent = 'Total items: 0';
    Object.assign(logArea.style, { fontSize: '12px', whiteSpace: 'pre-wrap' });

    const logWrap = document.createElement('div');
    Object.assign(logWrap.style, { border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '8px', background: '#fcfcfd' });
    logWrap.appendChild(logArea);

    body.append(settingsRow, tableWrap, logWrap);
    host.append(header, body);
    (document.body || document.documentElement).appendChild(host);
    uiRoot = host;

    // Prefill settings
    const s = loadSettings();
    inputWebApp.value = s.webappUrl || '';
    inputSheetId.value = s.sheetIdOrUrl || '';
    inputTab.value = s.tabName || '';

    // locals for closures
    function populateTable(rows) {
      const tbody = table.querySelector('tbody');
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
      for (const r of rows) {
        const tr = document.createElement('tr');
        tr.appendChild(td(r.id)); tr.appendChild(td(r.title));
        tr.appendChild(linkTd(r.link)); tr.appendChild(linkTd(r.image_link)); tr.appendChild(linkTd(r.video0_url));
        tbody.appendChild(tr);
      }
    }
    function td(text) { const el = document.createElement('td'); el.textContent = String(text || '');
      Object.assign(el.style, { borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '6px 8px' }); return el; }
    function linkTd(url) {
      const el = document.createElement('td');
      Object.assign(el.style, { borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '6px 8px' });
      if (url) { const a = document.createElement('a'); a.href = url; a.textContent = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; el.appendChild(a); }
      else { el.textContent = ''; }
      return el;
    }
    function updateLog(msg) { logArea.textContent = msg; }
    window.__shp_ui = { populateTable, updateLog }; // expose to outer functions
  }

  // bridge to UI helpers created inside ensureUI
  function populateTable(rows){ window.__shp_ui?.populateTable?.(rows); }
  function updateLog(msg){ window.__shp_ui?.updateLog?.(msg); }

  function summaryLine(capturedOpt, totalOpt) {
    const s = loadSession();
    const total = (typeof totalOpt === 'number') ? totalOpt : (s && s.total) || lastTotal || 0;
    const captured = (typeof capturedOpt === 'number') ? capturedOpt : (s ? Object.keys(s.items || {}).length : 0);
    return `Total items: ${total}\nCaptured: ${captured}`;
  }

  /*** ===== Push to Google Sheets (append A..E) ===== ***/
  function mapRowsForSheet(rows) {
    return rows.map(r => [ r.id || '', r.title || '', r.link || '', r.image_link || '', r.video0_url || '' ]);
  }

  function pushToGSheets(fromAuto = false) {
    if (!gmXhr) { updateLog('❌ GM_xmlhttpRequest not available (check userscript grants).'); setAutoRunPending(false); return; }
    const settings = loadSettings();
    const webappUrl = (settings.webappUrl || '').trim();
    const sheetId   = parseSheetId(settings.sheetIdOrUrl || '');
    const tabName   = (settings.tabName || '').trim();

    if (!webappUrl || !sheetId || !tabName) {
      updateLog(`${summaryLine()}\n⚠️ Fill Settings (Web App URL /exec, Sheet ID/URL, Tab name) then Save.`);
      setAutoRunPending(false);
      return;
    }

    const s = loadSession();
    const rowsObj = s ? Object.values(s.items || {}) : [];
    if (!rowsObj.length) { updateLog(`${summaryLine()}\n⚠️ No rows to push.`); setAutoRunPending(false); return; }

    const values = mapRowsForSheet(rowsObj);
    updateLog(`${summaryLine(rowsObj.length, s && s.total)}\nAppending ${values.length} rows to GSheets…`);

    const payload = JSON.stringify({ sheetId, tabName, startRow: 2, mode: 'append', values });

    gmXhr({
      method: 'POST',
      url: webappUrl,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      data: payload,
      timeout: 30000,
      onload: function (res) {
        const txt = res.responseText || '';
        let parsed = null; try { parsed = JSON.parse(txt); } catch {}
        if (res.status >= 200 && res.status < 300) {
          if (parsed && parsed.ok === true) {
            updateLog(`${summaryLine(rowsObj.length, s && s.total)}\n✅ Appended ${parsed.inserted ?? values.length} rows to "${tabName}".`);
          } else if (/TypeError:\s*out\.setHeader/i.test(txt) || /^<!DOCTYPE html>/i.test(txt)) {
            updateLog(`${summaryLine(rowsObj.length, s && s.total)}\n✅ Appended (server returned HTML). Fix GAS to return JSON only.\nPreview: ${txt.slice(0,160)}…`);
          } else {
            updateLog(`${summaryLine(rowsObj.length, s && s.total)}\n✅ Appended (HTTP ${res.status}). Server response: ${txt.slice(0,160)}…`);
          }
          setAutoRunPending(false); return;
        }
        updateLog(`${summaryLine(rowsObj.length, s && s.total)}\n❌ Append failed.\nHTTP: ${res.status}\nResponse: ${txt.slice(0,300)}`);
        setAutoRunPending(false);
      },
      onerror: function (err) { updateLog(`${summaryLine()}\n❌ GM_xhr error: ${err && err.error ? err.error : 'network error'}`); setAutoRunPending(false); },
      ontimeout: function () { updateLog(`${summaryLine()}\n❌ GM_xhr timeout after 30s`); setAutoRunPending(false); }
    });
  }

  /*** ===== Boot ===== ***/
  document.addEventListener('DOMContentLoaded', ensureUI);
  if (document.readyState === 'complete' || document.readyState === 'interactive') ensureUI();

  window.addEventListener('load', () => {
    ensureUI();
    resetIfUrlChanged();

    // Stall watchdog: skip for rcmd (we wait for SPA to fire), keep for search/reco
    setInterval(() => {
      const s = loadSession();
      if (!s || !s.active) return;
      if (s.mode === 'shop_rcmd') return; // avoid nudging shop pages
      const currentPage = getCurrentPageParam();
      if (currentPage !== s.nextPage) return;
      const idle = Date.now() - __lastCaptureTs;
      if (idle > STALL_THRESHOLD_MS) {
        updateLog(`No data on page ${currentPage} for ${Math.round(idle/1000)}s — nudging & retrying page…`);
        try { window.scrollBy(0, 1); setTimeout(() => window.scrollBy(0, -1), 120); } catch {}
        setTimeout(() => { const u = urlWithPage(s.baseUrl, s.nextPage); location.href = u; }, 200);
      }
    }, STALL_CHECK_EVERY_MS);

    const s = loadSession();
    if (s && s.active) { maybeResumeCrawl(); return; }

    // Render previous results at base
    maybeRenderResultsAtBase();

    if (isAutoRunPending() && !Number(lastTotal)) {
      updateLog('CAPTURE ALL pending → waiting for first feed response (shop_rcmd on shop page).');
      try { window.scrollBy(0, 1); setTimeout(() => window.scrollBy(0, -1), 150); } catch {}
      return;
    }

    if (!Number(lastTotal)) {
      const modeMsg = isShopPage() ? 'shop_rcmd' : 'recommend/search';
      updateLog(`Idle. Waiting for ${modeMsg} calls…`);
    }
  });

})();



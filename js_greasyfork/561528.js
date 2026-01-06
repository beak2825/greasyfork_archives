// ==UserScript==
// @name         Torn — Item prices
// @namespace    https://www.torn.com/
// @version      2.0
// @description  Adds a hover-only button between Qty and Price on ItemMarket Add Listing; shows item name in a small overlay panel.
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      tornexchange.com
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561528/Torn%20%E2%80%94%20Item%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/561528/Torn%20%E2%80%94%20Item%20prices.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_ID = 'sg-im-hover-panel';
  const BTN_CLASS = 'sg-im-hover-btn';

  const SETTINGS_ID = 'sg-im-settings-panel';
  const SETTINGS_HEADER_ID = 'sg-im-settings-header';

  const PANEL_W = 300;
  const PANEL_H = 160;
  const GAP = 15;

  const APIKEY_STORE = 'sg_im_api_key_v2';
  const MARKUP_STORE = 'sg_im_markup_pct_v1';
  const SETTINGS_POS_STORE = 'sg_im_settings_pos_v1';
  const SETTINGS_VISIBLE_STORE = 'sg_im_settings_visible_v1';

  const PAID_CACHE_KEY = 'sg_im_paid_cache_v1';
  const PAID_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

  const bazaarPriceCache = new Map();
  const itemMarketPriceCache = new Map();

  let activeToken = 0;
  let tracking = false;
  let lastPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  let itemMarketHoverTimer = null;
  let lastItemMarketCallAt = 0;

  let lastLogCallAt = 0;

  let paidCache = loadPaidCache();

  GM_addStyle(`
    #${PANEL_ID}{
      position:fixed;
      width:${PANEL_W}px;
      height:${PANEL_H}px;
      background:rgba(25,25,25,0.90);
      color:#fff;
      border:2px solid #39ff14;
      border-radius:10px;
      display:flex;
      flex-direction:column;
      align-items:flex-start;
      justify-content:center;
      gap:6px;
      padding:10px 12px;
      box-sizing:border-box;
      font-family:Arial, Helvetica, sans-serif;
      font-size:14px;
      line-height:1.15;
      z-index:999999;
      pointer-events:none;
      text-align:left;
      text-shadow:0 1px 2px rgba(0,0,0,0.7);
      left:50%;
      top:50%;
      transform:translate(-50%,-100%);
    }
    #${PANEL_ID} .sg-line{
      width:100%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #${PANEL_ID} .sg-title{
      font-size:16px;
      font-weight:700;
    }
    .${BTN_CLASS}{
      width:26px;
      height:26px;
      min-width:26px;
      min-height:26px;
      margin:0 10px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border:2px solid #39ff14;
      border-radius:6px;
      background:rgba(25,25,25,0.35);
      color:#fff;
      font-weight:700;
      cursor:default;
      user-select:none;
      box-shadow:0 0 10px rgba(57,255,20,0.25);
      vertical-align:middle;
    }
    .${BTN_CLASS}:hover{
      box-shadow:0 0 14px rgba(57,255,20,0.45);
    }

    #${SETTINGS_ID}{
      position:fixed;
      width:340px;
      background:rgba(20,20,20,0.92);
      color:#fff;
      border:2px solid #39ff14;
      border-radius:12px;
      z-index:1000001;
      box-shadow:0 0 18px rgba(57,255,20,0.18);
      font-family:Arial, Helvetica, sans-serif;
      user-select:none;
      display:none;
    }
    #${SETTINGS_HEADER_ID}{
      padding:10px 12px;
      font-weight:700;
      cursor:move;
      border-bottom:1px solid rgba(57,255,20,0.35);
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
    }
    #${SETTINGS_ID} .sg-body{
      padding:10px 12px 12px 12px;
      display:flex;
      flex-direction:column;
      gap:10px;
      user-select:text;
    }
    #${SETTINGS_ID} label{
      font-size:12px;
      opacity:0.9;
    }
    #${SETTINGS_ID} input[type="password"], #${SETTINGS_ID} input[type="text"]{
      width:100%;
      box-sizing:border-box;
      padding:8px 10px;
      border-radius:8px;
      border:1px solid rgba(57,255,20,0.55);
      background:rgba(0,0,0,0.35);
      color:#fff;
      outline:none;
      font-size:12px;
    }
    #${SETTINGS_ID} .sg-row{
      display:flex;
      gap:8px;
      align-items:center;
    }
    #${SETTINGS_ID} .sg-btn{
      border:1px solid rgba(57,255,20,0.85);
      background:rgba(25,25,25,0.55);
      color:#fff;
      border-radius:8px;
      padding:8px 10px;
      font-weight:700;
      cursor:pointer;
      font-size:12px;
      white-space:nowrap;
    }
    #${SETTINGS_ID} .sg-btn:active{
      transform:translateY(1px);
    }
    #${SETTINGS_ID} .sg-small{
      font-size:11px;
      opacity:0.85;
      line-height:1.2;
    }
    #${SETTINGS_ID} .sg-pill{
      font-size:11px;
      opacity:0.9;
      border:1px solid rgba(57,255,20,0.35);
      padding:4px 8px;
      border-radius:999px;
      white-space:nowrap;
    }
    #${SETTINGS_ID} .sg-slider-wrap{
      display:flex;
      flex-direction:column;
      gap:6px;
    }
    #${SETTINGS_ID} input[type="range"]{
      width:100%;
      accent-color:#39ff14;
    }
    #${SETTINGS_ID} .sg-slider-top{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
    }
  `);

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function fmtMoneySuffix(n) {
    if (typeof n !== 'number' || !isFinite(n)) return 'N/A';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n) + '$';
  }

  function getApiKey() {
    return (GM_getValue(APIKEY_STORE, '') || '').trim();
  }
  function setApiKey(k) {
    GM_setValue(APIKEY_STORE, (k || '').trim());
  }

  function getMarkupPct() {
    const v = parseInt(GM_getValue(MARKUP_STORE, '0') || '0', 10);
    if (!isFinite(v)) return 0;
    return Math.max(0, Math.min(100, v));
  }
  function setMarkupPct(v) {
    const n = Math.max(0, Math.min(100, parseInt(String(v), 10) || 0));
    GM_setValue(MARKUP_STORE, String(n));
  }

  function isItemMarketAddListing() {
    return location.href.includes('sid=ItemMarket') && /#\/addListing\b/i.test(location.hash || '');
  }
  function isBazaarAdd() {
    return /\/bazaar\.php$/i.test(location.pathname) && /#\/add\b/i.test(location.hash || '');
  }

  function positionPanelAtCursor(panel, clientX, clientY) {
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    let left = clientX;
    let top = clientY - GAP - PANEL_H;

    const halfW = PANEL_W / 2;
    left = clamp(left, halfW + 8, vw - halfW - 8);
    top = clamp(top, 8, vh - PANEL_H - 8);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.transform = 'translate(-50%, 0)';
  }

  function removeHoverPanel() {
    const p = document.getElementById(PANEL_ID);
    if (p) p.remove();
  }

  function onMouseMove(e) {
    lastPos = { x: e.clientX, y: e.clientY };
    const p = document.getElementById(PANEL_ID);
    if (p) positionPanelAtCursor(p, lastPos.x, lastPos.y);
  }

  function startTracking() {
    if (tracking) return;
    tracking = true;
    document.addEventListener('mousemove', onMouseMove, true);
  }
  function stopTracking() {
    if (!tracking) return;
    tracking = false;
    document.removeEventListener('mousemove', onMouseMove, true);
  }

  function updateLine(which, text) {
    const p = document.getElementById(PANEL_ID);
    if (!p) return;
    const el = p.querySelector(`[data-sg="${which}"]`);
    if (el) el.textContent = text;
  }

  function setPanelPaid(paid) {
    const p = document.getElementById(PANEL_ID);
    if (!p) return;
    p.dataset.paid = String(paid);
    updateLine('paid', `Paid: ${fmtMoneySuffix(paid)}`);
    const m = getMarkupPct();
    const sell = Math.round(paid * (1 + m / 100));
    updateLine('sell', `Sell for: ${fmtMoneySuffix(sell)} (${m}% profit)`);
  }

  function setPanelPaidSearching() {
    updateLine('paid', 'Paid: Searching...');
    updateLine('sell', 'Sell for: Searching...');
    const p = document.getElementById(PANEL_ID);
    if (p) p.dataset.paid = '';
  }

  function setPanelPaidNA() {
    updateLine('paid', 'Paid: N/A');
    updateLine('sell', 'Sell for: N/A');
    const p = document.getElementById(PANEL_ID);
    if (p) p.dataset.paid = '';
  }

  function refreshSellLineIfOpen() {
    const p = document.getElementById(PANEL_ID);
    if (!p) return;
    const paid = parseFloat(p.dataset.paid || '');
    if (!isFinite(paid) || paid <= 0) return;
    const m = getMarkupPct();
    const sell = Math.round(paid * (1 + m / 100));
    updateLine('sell', `Sell for: ${fmtMoneySuffix(sell)} (${m}% profit)`);
  }

  function getItemName(container) {
    const img = container.querySelector('img[alt]');
    if (img && img.alt) return img.alt.trim();

    const tOverflow = container.querySelector('.t-overflow');
    if (tOverflow && tOverflow.textContent) return tOverflow.textContent.trim();

    const nameEl = container.querySelector('span[class*="name___"], span[class*="name"]');
    if (nameEl && nameEl.textContent) return nameEl.textContent.trim();

    const ariaBtn = container.querySelector('button[aria-label]');
    if (ariaBtn) {
      const m = (ariaBtn.getAttribute('aria-label') || '').match(/View all the\s+(.+)\s*$/i);
      if (m && m[1]) return m[1].trim();
    }
    return 'Unknown item';
  }

  function getItemId(container) {
    const btn = container.querySelector('button[aria-controls*="itemInfo-"]');
    if (btn) {
      const ac = btn.getAttribute('aria-controls') || '';
      const m = ac.match(/itemInfo-(\d+)-/i);
      if (m && m[1]) return m[1];
    }

    const img = container.querySelector('img[src*="/images/items/"], img[srcset*="/images/items/"]');
    if (img) {
      const s = (img.getAttribute('src') || '') + ' ' + (img.getAttribute('srcset') || '');
      const m = s.match(/\/images\/items\/(\d+)\//i);
      if (m && m[1]) return m[1];
    }
    return null;
  }

  function loadPaidCache() {
    try {
      const raw = localStorage.getItem(PAID_CACHE_KEY);
      const now = Date.now();
      const obj = raw ? JSON.parse(raw) : {};
      if (!obj || typeof obj !== 'object') return {};
      let changed = false;
      for (const k of Object.keys(obj)) {
        const e = obj[k];
        if (!e || typeof e !== 'object' || typeof e.exp !== 'number' || typeof e.p !== 'number' || e.exp <= now) {
          delete obj[k];
          changed = true;
        }
      }
      if (changed) localStorage.setItem(PAID_CACHE_KEY, JSON.stringify(obj));
      return obj;
    } catch {
      return {};
    }
  }

  function savePaidCache() {
    try {
      localStorage.setItem(PAID_CACHE_KEY, JSON.stringify(paidCache));
    } catch {}
  }

  function getPaidCached(itemId) {
    if (!itemId) return null;
    const e = paidCache[itemId];
    const now = Date.now();
    if (!e || typeof e.p !== 'number' || typeof e.exp !== 'number') return null;
    if (e.exp <= now) {
      delete paidCache[itemId];
      savePaidCache();
      return null;
    }
    return e.p;
  }

  function setPaidCached(itemId, unitPrice) {
    if (!itemId || typeof unitPrice !== 'number' || !isFinite(unitPrice) || unitPrice <= 0) return;
    paidCache[itemId] = { p: unitPrice, exp: Date.now() + PAID_CACHE_TTL_MS };
    savePaidCache();
  }

  function fetchBazaarBestListing(itemId) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://tornexchange.com/api/best_listing?item_id=${encodeURIComponent(itemId)}`,
        headers: { accept: 'application/json' },
        timeout: 3000,
        onload: (r) => {
          try {
            const j = JSON.parse(r.responseText || '{}');
            const price = j && j.status === 'success' && j.data && typeof j.data.price === 'number' ? j.data.price : null;
            resolve(price);
          } catch {
            resolve(null);
          }
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }

  async function ensureBazaarPrice(itemId, token) {
    if (!itemId) {
      if (token === activeToken) updateLine('bazaar', 'Lowest Bazaar price: N/A');
      return;
    }

    if (bazaarPriceCache.has(itemId)) {
      if (token === activeToken) updateLine('bazaar', `Lowest Bazaar price: ${bazaarPriceCache.get(itemId)}`);
      return;
    }

    if (token === activeToken) updateLine('bazaar', 'Lowest Bazaar price: Loading...');

    const price = await fetchBazaarBestListing(itemId);
    const txt = price == null ? 'N/A' : fmtMoneySuffix(price);
    bazaarPriceCache.set(itemId, txt);

    if (token === activeToken) updateLine('bazaar', `Lowest Bazaar price: ${txt}`);
  }

  function fetchLowestItemMarket(itemId, apiKey) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.torn.com/v2/market/${encodeURIComponent(itemId)}/itemmarket?limit=1&offset=0&key=${encodeURIComponent(apiKey)}`,
        headers: { accept: 'application/json' },
        timeout: 1000,
        onload: (r) => {
          try {
            const j = JSON.parse(r.responseText || '{}');
            const listings = j && j.itemmarket && Array.isArray(j.itemmarket.listings) ? j.itemmarket.listings : null;
            const price = listings && listings[0] && typeof listings[0].price === 'number' ? listings[0].price : null;
            resolve(price);
          } catch {
            resolve(null);
          }
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }

  async function ensureItemMarketPrice(itemId, token) {
    if (!itemId) {
      if (token === activeToken) updateLine('itemmarket', 'Lowest Item Market price: N/A');
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      if (token === activeToken) updateLine('itemmarket', 'Lowest Item Market price: (SET_API KEY)');
      return;
    }

    if (itemMarketPriceCache.has(itemId)) {
      if (token === activeToken) updateLine('itemmarket', `Lowest Item Market price: ${itemMarketPriceCache.get(itemId)}`);
      return;
    }

    const now = Date.now();
    const wait = Math.max(0, 1000 - (now - lastItemMarketCallAt));
    if (wait > 0) {
      await sleep(wait);
      if (token !== activeToken) return;
    }

    lastItemMarketCallAt = Date.now();
    if (token === activeToken) updateLine('itemmarket', 'Lowest Item Market price: Loading...');

    const price = await fetchLowestItemMarket(itemId, apiKey);
    const txt = price == null ? 'N/A' : fmtMoneySuffix(price);
    itemMarketPriceCache.set(itemId, txt);

    if (token === activeToken) updateLine('itemmarket', `Lowest Item Market price: ${txt}`);
  }

  function extractPaidFromLogEntry(entry) {
    if (!entry || !entry.details || !entry.data) return [];
    const d = entry.data;
    const unit = typeof d.cost_each === 'number' ? d.cost_each : null;
    if (unit == null) return [];

    if (entry.details.id === 4201) {
      const itemId = typeof d.item === 'number' ? String(d.item) : null;
      return itemId ? [{ itemId, unit }] : [];
    }

    if (Array.isArray(d.items)) {
      const out = [];
      for (const it of d.items) {
        const itemId = it && typeof it.id === 'number' ? String(it.id) : null;
        if (itemId) out.push({ itemId, unit });
      }
      return out;
    }

    return [];
  }

  function fetchUserLogsPage(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { accept: 'application/json' },
        timeout: 1500,
        onload: (r) => {
          try {
            resolve(JSON.parse(r.responseText || '{}'));
          } catch {
            resolve(null);
          }
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }

  function addKeyToUrl(url, apiKey) {
    if (!url) return null;
    if (url.includes('key=')) return url;
    const joiner = url.includes('?') ? '&' : '?';
    return url + joiner + 'key=' + encodeURIComponent(apiKey);
  }

  async function ensurePaidFromLogs(itemId, token) {
    const apiKey = getApiKey();
    if (!apiKey) {
      if (token === activeToken) {
        updateLine('paid', 'Paid: (SET_API KEY)');
        updateLine('sell', 'Sell for: (SET_API KEY)');
      }
      return;
    }

    const cached = getPaidCached(itemId);
    if (cached != null) {
      if (token === activeToken) setPanelPaid(cached);
      return;
    }

    if (token === activeToken) setPanelPaidSearching();

    let url = `https://api.torn.com/v2/user/log?log=1225,4201,1112&limit=20&sort=desc&key=${encodeURIComponent(apiKey)}`;
    let found = null;

    while (token === activeToken && url) {
      const now = Date.now();
      const wait = Math.max(0, 700 - (now - lastLogCallAt));
      if (wait > 0) {
        await sleep(wait);
        if (token !== activeToken) return;
      }
      lastLogCallAt = Date.now();

      const j = await fetchUserLogsPage(url);
      if (token !== activeToken) return;

      const logs = j && Array.isArray(j.log) ? j.log : [];
      for (const entry of logs) {
        const pairs = extractPaidFromLogEntry(entry);
        for (const p of pairs) {
          if (p.itemId === String(itemId)) {
            found = p.unit;
            break;
          }
        }
        if (found != null) break;
      }

      if (found != null) break;

      const prev = j && j._metadata && j._metadata.links ? j._metadata.links.prev : null;
      if (!prev) break;
      url = addKeyToUrl(prev, apiKey);
    }

    if (token !== activeToken) return;

    if (found != null) {
      setPaidCached(String(itemId), found);
      setPanelPaid(found);
    } else {
      setPanelPaidNA();
    }
  }

  function showHoverPanel(container, e) {
    removeHoverPanel();
    if (itemMarketHoverTimer) {
      clearTimeout(itemMarketHoverTimer);
      itemMarketHoverTimer = null;
    }

    const name = getItemName(container);
    const itemId = getItemId(container);
    const token = ++activeToken;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.dataset.itemId = itemId || '';
    panel.dataset.paid = '';

    const title = document.createElement('div');
    title.className = 'sg-line sg-title';
    title.textContent = name;

    const paidLine = document.createElement('div');
    paidLine.className = 'sg-line';
    paidLine.dataset.sg = 'paid';
    paidLine.textContent = 'Paid: Searching...';

    const sellLine = document.createElement('div');
    sellLine.className = 'sg-line';
    sellLine.dataset.sg = 'sell';
    sellLine.textContent = 'Sell for: Searching...';

    const bazaarLine = document.createElement('div');
    bazaarLine.className = 'sg-line';
    bazaarLine.dataset.sg = 'bazaar';
    bazaarLine.textContent = `Lowest Bazaar price: ${itemId && bazaarPriceCache.has(itemId) ? bazaarPriceCache.get(itemId) : 'Loading...'}`;

    const apiKey = getApiKey();
    const itemMarketLine = document.createElement('div');
    itemMarketLine.className = 'sg-line';
    itemMarketLine.dataset.sg = 'itemmarket';
    itemMarketLine.textContent = `Lowest Item Market price: ${
      !apiKey ? '(SET_API KEY)' : (itemId && itemMarketPriceCache.has(itemId) ? itemMarketPriceCache.get(itemId) : '(hover 1s...)')
    }`;

    panel.appendChild(title);
    panel.appendChild(paidLine);
    panel.appendChild(sellLine);
    panel.appendChild(bazaarLine);
    panel.appendChild(itemMarketLine);

    document.body.appendChild(panel);

    if (e && typeof e.clientX === 'number') lastPos = { x: e.clientX, y: e.clientY };
    positionPanelAtCursor(panel, lastPos.x, lastPos.y);

    if (itemId) {
      const cachedPaid = getPaidCached(itemId);
      if (cachedPaid != null) {
        setPanelPaid(cachedPaid);
      } else {
        ensurePaidFromLogs(itemId, token);
      }
      ensureBazaarPrice(itemId, token);
      if (apiKey && !itemMarketPriceCache.has(itemId)) {
        itemMarketHoverTimer = setTimeout(() => {
          itemMarketHoverTimer = null;
          if (token !== activeToken) return;
          ensureItemMarketPrice(itemId, token);
        }, 1000);
      }
    } else {
      setPanelPaidNA();
      ensureBazaarPrice(null, token);
      updateLine('itemmarket', 'Lowest Item Market price: N/A');
    }
  }

  function leaveHover() {
    if (itemMarketHoverTimer) {
      clearTimeout(itemMarketHoverTimer);
      itemMarketHoverTimer = null;
    }
    removeHoverPanel();
    stopTracking();
    activeToken++;
  }

  function makeHoverBtn(container) {
    const btn = document.createElement('div');
    btn.className = BTN_CLASS;
    btn.setAttribute('aria-hidden', 'true');
    btn.textContent = 'i';

    btn.addEventListener('mouseenter', (e) => {
      startTracking();
      showHoverPanel(container, e);
    }, true);

    btn.addEventListener('mouseleave', leaveHover, true);
    container.addEventListener('mouseleave', leaveHover, true);

    btn.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
    btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);

    return btn;
  }

  function findPriceAnchorItemMarket(row) {
    let a = row.querySelector('div[class*="priceInputWrapper"], div[class*="priceInput"]');
    if (a) return a;

    const priceInput = row.querySelector('input[name="price"], input[placeholder="Price"], input.input-money[name="price"], input.input-money');
    if (priceInput) return priceInput.closest('div') || priceInput;

    const priceBtn = Array.from(row.querySelectorAll('button,div,span')).find(el => (el.textContent || '').trim() === 'Price');
    return priceBtn || null;
  }

  function injectItemMarketRow(row) {
    if (!row) return;

    const anchor = findPriceAnchorItemMarket(row);
    if (!anchor) return;

    const parent = anchor.parentElement;
    if (!parent) return;

    if (parent.querySelector(`.${BTN_CLASS}`)) return;

    const btn = makeHoverBtn(row);
    parent.insertBefore(btn, anchor);
  }

  function injectBazaarRow(li) {
    if (!li) return;

    const price = li.querySelector('.actions-main-wrap .amount-main-wrap .price') ||
                  li.querySelector('.actions-main-wrap .price') ||
                  li.querySelector('.price');

    if (!price) return;

    const parent = price.parentElement;
    if (!parent) return;

    if (parent.querySelector(`.${BTN_CLASS}`)) return;

    const btn = makeHoverBtn(li);
    parent.insertBefore(btn, price);
  }

  function scan() {
    if (isItemMarketAddListing()) {
      document.querySelectorAll('div[class*="itemRow___"], div[class*="itemRow"]').forEach(injectItemMarketRow);
    }
    if (isBazaarAdd()) {
      document.querySelectorAll('li.clearfix, li[data-group], li.no-mods').forEach(injectBazaarRow);
    }
  }

  function loadSettingsPos() {
    const raw = GM_getValue(SETTINGS_POS_STORE, '');
    if (!raw) return null;
    try {
      const j = JSON.parse(raw);
      if (j && typeof j.x === 'number' && typeof j.y === 'number') return j;
    } catch {}
    return null;
  }

  function saveSettingsPos(x, y) {
    GM_setValue(SETTINGS_POS_STORE, JSON.stringify({ x, y }));
  }

  function setSettingsVisible(v) {
    GM_setValue(SETTINGS_VISIBLE_STORE, v ? '1' : '0');
    const p = document.getElementById(SETTINGS_ID);
    if (p) p.style.display = v ? 'block' : 'none';
  }

  function getSettingsVisible() {
    return (GM_getValue(SETTINGS_VISIBLE_STORE, '0') || '0') === '1';
  }

  function ensureSettingsPanel() {
    if (document.getElementById(SETTINGS_ID)) return;

    const panel = document.createElement('div');
    panel.id = SETTINGS_ID;

    const header = document.createElement('div');
    header.id = SETTINGS_HEADER_ID;

    const title = document.createElement('div');
    title.textContent = 'Global Settings';

    const badge = document.createElement('div');
    badge.className = 'sg-pill';
    badge.textContent = 'Drag me';

    header.appendChild(title);
    header.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'sg-body';

    const label = document.createElement('label');
    label.textContent = 'Torn API key (v2)';

    const input = document.createElement('input');
    input.type = 'password';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.value = getApiKey();
    input.placeholder = 'Enter API key...';

    const row = document.createElement('div');
    row.className = 'sg-row';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'sg-btn';
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save';

    const showBtn = document.createElement('button');
    showBtn.className = 'sg-btn';
    showBtn.type = 'button';
    showBtn.textContent = 'Show';

    row.appendChild(saveBtn);
    row.appendChild(showBtn);

    const sliderWrap = document.createElement('div');
    sliderWrap.className = 'sg-slider-wrap';

    const sliderTop = document.createElement('div');
    sliderTop.className = 'sg-slider-top';

    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = 'Markup';

    const sliderValue = document.createElement('div');
    sliderValue.className = 'sg-pill';
    sliderValue.textContent = `${getMarkupPct()}%`;

    sliderTop.appendChild(sliderLabel);
    sliderTop.appendChild(sliderValue);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = String(getMarkupPct());

    sliderWrap.appendChild(sliderTop);
    sliderWrap.appendChild(slider);

    const hint = document.createElement('div');
    hint.className = 'sg-small';
    hint.textContent = 'Paid is found from localStorage cache or by scanning logs (1225, 4201, 1112). Sell for = Paid + markup%.';

    body.appendChild(label);
    body.appendChild(input);
    body.appendChild(row);
    body.appendChild(sliderWrap);
    body.appendChild(hint);

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    const saved = loadSettingsPos();
    const defaultX = 20;
    const defaultY = 120;

    panel.style.left = `${saved ? saved.x : defaultX}px`;
    panel.style.top = `${saved ? saved.y : defaultY}px`;

    panel.style.display = getSettingsVisible() ? 'block' : 'none';

    saveBtn.addEventListener('click', () => {
      setApiKey(input.value || '');
      itemMarketPriceCache.clear();
      saveBtn.textContent = 'Saved';
      setTimeout(() => { saveBtn.textContent = 'Save'; }, 800);
    }, true);

    showBtn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        showBtn.textContent = 'Hide';
      } else {
        input.type = 'password';
        showBtn.textContent = 'Show';
      }
    }, true);

    slider.addEventListener('input', () => {
      const v = clamp(parseInt(slider.value, 10) || 0, 0, 100);
      slider.value = String(v);
      sliderValue.textContent = `${v}%`;
      setMarkupPct(v);
      refreshSellLineIfOpen();
    }, true);

    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    const onDragMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      const rect = panel.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
    };

    const onDragUp = () => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener('mousemove', onDragMove, true);
      document.removeEventListener('mouseup', onDragUp, true);

      const left = parseFloat(panel.style.left) || defaultX;
      const top = parseFloat(panel.style.top) || defaultY;
      saveSettingsPos(left, top);
    };

    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging = true;

      startX = e.clientX;
      startY = e.clientY;

      startLeft = parseFloat(panel.style.left) || defaultX;
      startTop = parseFloat(panel.style.top) || defaultY;

      document.addEventListener('mousemove', onDragMove, true);
      document.addEventListener('mouseup', onDragUp, true);
    }, true);
  }

  function resetSettingsLocation() {
    GM_setValue(SETTINGS_POS_STORE, '');
    const p = document.getElementById(SETTINGS_ID);
    if (p) {
      p.style.left = '20px';
      p.style.top = '120px';
    }
    saveSettingsPos(20, 120);
  }

  function toggleSettingsPanel() {
    ensureSettingsPanel();
    setSettingsVisible(!getSettingsVisible());
  }

  GM_registerMenuCommand('SET_API KEY', () => {
    ensureSettingsPanel();
    setSettingsVisible(true);
    const p = document.getElementById(SETTINGS_ID);
    if (p) {
      const inp = p.querySelector('input[type="password"], input[type="text"]');
      if (inp) inp.focus();
    }
  });

  GM_registerMenuCommand('SHOW/HIDE SETTINGS', () => {
    toggleSettingsPanel();
  });

  GM_registerMenuCommand('RESET SETTINGS LOCATION', () => {
    ensureSettingsPanel();
    resetSettingsLocation();
    setSettingsVisible(true);
  });

  let obs = null;

  function start() {
    ensureSettingsPanel();
    scan();
    if (obs) return;
    obs = new MutationObserver(() => scan());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('hashchange', () => {
    leaveHover();
    setTimeout(start, 50);
  });

  start();
})();

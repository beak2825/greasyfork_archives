// ==UserScript==
// @name         Steam 额外地区价格显示
// @namespace    https://github.com/linyaocrush/My-Tampermonkey-script
// @version      0.3.2
// @description  商店与购物车价格追加；购物车页显示“目标地区预计付款”，统计并剔除区域不可购买项
// @match        https://store.steampowered.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559826/Steam%20%E9%A2%9D%E5%A4%96%E5%9C%B0%E5%8C%BA%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559826/Steam%20%E9%A2%9D%E5%A4%96%E5%9C%B0%E5%8C%BA%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY_REGION_ID = 'sapx_target_region_id_v1';
  const STORAGE_KEY_SHOW_CODE = 'sapx_show_region_code_v1';

  const REGIONS = [
    { id: 'SASIA_USD', short: 'SASIA', label: 'South Asia - USD', currency: 'USD', ccCandidates: ['PK'] },
    { id: 'CNY', short: 'CN', label: 'Chinese Yuan', currency: 'CNY', ccCandidates: ['CN'] },
    { id: 'INR', short: 'IN', label: 'Indian Rupee', currency: 'INR', ccCandidates: ['IN'] },
    { id: 'UAH', short: 'UA', label: 'Ukrainian Hryvnia', currency: 'UAH', ccCandidates: ['UA'] },
    { id: 'VND', short: 'VN', label: 'Vietnamese Dong', currency: 'VND', ccCandidates: ['VN'] },
    { id: 'IDR', short: 'ID', label: 'Indonesian Rupiah', currency: 'IDR', ccCandidates: ['ID'] },
    { id: 'KZT', short: 'KZ', label: 'Kazakhstani Tenge', currency: 'KZT', ccCandidates: ['KZ'] },
    { id: 'PHP', short: 'PH', label: 'Philippine Peso', currency: 'PHP', ccCandidates: ['PH'] },
    { id: 'KRW', short: 'KR', label: 'South Korea Won', currency: 'KRW', ccCandidates: ['KR'] },
    { id: 'PEN', short: 'PE', label: 'Peruvian Sol', currency: 'PEN', ccCandidates: ['PE'] },
    { id: 'JPY', short: 'JP', label: 'Japanese Yen', currency: 'JPY', ccCandidates: ['JP'] },
    { id: 'CIS_USD', short: 'CIS', label: 'CIS - U.S. Dollar', currency: 'USD', ccCandidates: ['AZ'] },
    { id: 'LATAM_USD', short: 'LATAM', label: 'LATAM - U.S. Dollar', currency: 'USD', ccCandidates: ['AR'] },
    { id: 'MENA_USD', short: 'MENA', label: 'MENA - U.S. Dollar', currency: 'USD', ccCandidates: ['TR'] },
    { id: 'THB', short: 'TH', label: 'Thai Baht', currency: 'THB', ccCandidates: ['TH'] },
    { id: 'MYR', short: 'MY', label: 'Malaysian Ringgit', currency: 'MYR', ccCandidates: ['MY'] },
    { id: 'CLP', short: 'CL', label: 'Chilean Peso', currency: 'CLP', ccCandidates: ['CL'] },
    { id: 'MXN', short: 'MX', label: 'Mexican Peso', currency: 'MXN', ccCandidates: ['MX'] },
    { id: 'UYU', short: 'UY', label: 'Uruguayan Peso', currency: 'UYU', ccCandidates: ['UY'] },
    { id: 'BRL', short: 'BR', label: 'Brazilian Real', currency: 'BRL', ccCandidates: ['BR'] },
    { id: 'TWD', short: 'TW', label: 'Taiwan Dollar', currency: 'TWD', ccCandidates: ['TW'] },
    { id: 'ZAR', short: 'ZA', label: 'South African Rand', currency: 'ZAR', ccCandidates: ['ZA'] },
    { id: 'AED', short: 'AE', label: 'U.A.E. Dirham', currency: 'AED', ccCandidates: ['AE'] },
    { id: 'HKD', short: 'HK', label: 'Hong Kong Dollar', currency: 'HKD', ccCandidates: ['HK'] },
    { id: 'NZD', short: 'NZ', label: 'New Zealand Dollar', currency: 'NZD', ccCandidates: ['NZ'] },
    { id: 'NOK', short: 'NO', label: 'Norwegian Krone', currency: 'NOK', ccCandidates: ['NO'] },
    { id: 'KWD', short: 'KW', label: 'Kuwaiti Dinar', currency: 'KWD', ccCandidates: ['KW'] },
    { id: 'COP', short: 'CO', label: 'Colombian Peso', currency: 'COP', ccCandidates: ['CO'] },
    { id: 'AUD', short: 'AU', label: 'Australian Dollar', currency: 'AUD', ccCandidates: ['AU'] },
    { id: 'USD', short: 'US', label: 'U.S. Dollar', currency: 'USD', ccCandidates: ['US'] },
    { id: 'CAD', short: 'CA', label: 'Canadian Dollar', currency: 'CAD', ccCandidates: ['CAD'] },
    { id: 'SGD', short: 'SG', label: 'Singapore Dollar', currency: 'SGD', ccCandidates: ['SG'] },
    { id: 'SAR', short: 'SA', label: 'Saudi Riyal', currency: 'SAR', ccCandidates: ['SA'] },
    { id: 'QAR', short: 'QA', label: 'Qatari Riyal', currency: 'QAR', ccCandidates: ['QA'] },
    { id: 'GBP', short: 'GB', label: 'British Pound', currency: 'GBP', ccCandidates: ['GB'] },
    { id: 'EUR', short: 'EU', label: 'Euro', currency: 'EUR', ccCandidates: ['EU', 'DE'] },
    { id: 'PLN', short: 'PL', label: 'Polish Zloty', currency: 'PLN', ccCandidates: ['PL'] },
    { id: 'CRC', short: 'CR', label: 'Costa Rican Colon', currency: 'CRC', ccCandidates: ['CR'] },
    { id: 'ILS', short: 'IL', label: 'Israeli New Shekel', currency: 'ILS', ccCandidates: ['IL'] },
    { id: 'CHF', short: 'CH', label: 'Swiss Franc', currency: 'CHF', ccCandidates: ['CH'] },
    { id: 'RUB', short: 'RU', label: 'Russian Ruble', currency: 'RUB', ccCandidates: ['RU'] }
  ];

  function getRegionById(id) { return REGIONS.find(r => r.id === id) || null; }
  function getTargetRegion() { const id = GM_getValue(STORAGE_KEY_REGION_ID, 'CNY'); return getRegionById(id) || getRegionById('CNY'); }
  function getShowRegionCode() { return Boolean(GM_getValue(STORAGE_KEY_SHOW_CODE, true)); }
  function isCartPage() { return location.pathname === '/cart/' || location.pathname.startsWith('/cart'); }

  const STYLE_ID = 'sapx-style';
  const EXTRA_CLASS = 'sapx-extra-price';
  const CART_SUMMARY_ID = 'sapx-cart-summary';
  const MARK_ATTR = 'data-sapx-region';

  const UI_STYLE_ID = 'sapx-ui-style';
  const UI_ROOT_ID = 'sapx-ui-root';

  function addStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent =
        '.sapx-extra-price{margin-left:6px;font-size:0.9em;opacity:1;white-space:nowrap;pointer-events:none;color:#67c1f5;display:inline-block;font-weight:normal}' +
        'strike .sapx-extra-price,.discount_original_price .sapx-extra-price,.StoreOriginalPrice .sapx-extra-price{opacity:0.65;font-size:0.85em;color:#acb2b8;text-decoration:line-through}' +
        '#sapx-cart-summary{margin-top:8px;margin-bottom:8px;padding:8px 0;border-top:1px solid rgba(255,255,255,0.1);color:#c6d4df;font-size:12px;line-height:1.4}' +
        '#sapx-cart-summary .sapx-row{display:flex;justify-content:space-between;gap:8px;align-items:center}' +
        '#sapx-cart-summary .sapx-label{font-size:11px;opacity:0.8;color:#acb2b8}' +
        '#sapx-cart-summary .sapx-value{font-weight:700;white-space:nowrap;color:#67c1f5;font-size:14px}' +
        '#sapx-cart-summary .sapx-warn{margin-top:4px;color:#e46767;font-size:10px;opacity:0.9}' +
        '.game_purchase_action_bg .discount_prices .discount_original_price{text-decoration:none!important}' +
        '.game_purchase_action_bg .discount_prices .discount_original_price::before,.game_purchase_action_bg .discount_prices .discount_original_price::after{content:none!important;display:none!important}' +
        '.game_purchase_action_bg .discount_prices .discount_original_price .sapx-extra-price{text-decoration:none!important}';
      document.head.appendChild(style);
    }
    if (!document.getElementById(UI_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = UI_STYLE_ID;
      style.textContent =
        '#' + UI_ROOT_ID + '{position:fixed;inset:0;z-index:2147483647;display:none}' +
        '#' + UI_ROOT_ID + '.sapx-open{display:block}' +
        '#' + UI_ROOT_ID + ' .sapx-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.72)}' +
        '#' + UI_ROOT_ID + ' .sapx-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(520px,calc(100vw - 24px));background:linear-gradient(180deg,#1b2838 0%,#171a21 100%);border:1px solid rgba(255,255,255,0.08);box-shadow:0 18px 60px rgba(0,0,0,0.65);border-radius:6px;color:#c6d4df;font-family:Arial,Helvetica,sans-serif}' +
        '#' + UI_ROOT_ID + ' .sapx-header{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 10px 14px;border-bottom:1px solid rgba(255,255,255,0.08)}' +
        '#' + UI_ROOT_ID + ' .sapx-title{font-size:14px;font-weight:700;letter-spacing:0.2px;color:#e5e5e5}' +
        '#' + UI_ROOT_ID + ' .sapx-close{appearance:none;border:0;background:transparent;color:#8f98a0;font-size:18px;line-height:1;cursor:pointer;padding:4px 6px}' +
        '#' + UI_ROOT_ID + ' .sapx-close:hover{color:#c6d4df}' +
        '#' + UI_ROOT_ID + ' .sapx-body{padding:14px}' +
        '#' + UI_ROOT_ID + ' .sapx-field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}' +
        '#' + UI_ROOT_ID + ' .sapx-label{font-size:12px;color:#acb2b8}' +
        '#' + UI_ROOT_ID + ' select.sapx-select{appearance:none;background:#0f141b;border:1px solid rgba(255,255,255,0.12);border-radius:4px;color:#c6d4df;padding:8px 10px;font-size:13px;outline:none}' +
        '#' + UI_ROOT_ID + ' select.sapx-select:focus{border-color:rgba(103,193,245,0.8);box-shadow:0 0 0 2px rgba(103,193,245,0.15)}' +
        '#' + UI_ROOT_ID + ' .sapx-details{border:1px solid rgba(255,255,255,0.08);border-radius:4px;background:rgba(0,0,0,0.15);padding:10px}' +
        '#' + UI_ROOT_ID + ' .sapx-details summary{cursor:pointer;color:#67c1f5;font-size:12px;list-style:none}' +
        '#' + UI_ROOT_ID + ' .sapx-details summary::-webkit-details-marker{display:none}' +
        '#' + UI_ROOT_ID + ' .sapx-row{display:flex;align-items:center;gap:10px;margin-top:10px}' +
        '#' + UI_ROOT_ID + ' .sapx-check{display:flex;align-items:center;gap:8px;font-size:13px;color:#c6d4df}' +
        '#' + UI_ROOT_ID + ' input[type="checkbox"].sapx-checkbox{width:16px;height:16px;accent-color:#67c1f5}' +
        '#' + UI_ROOT_ID + ' .sapx-footer{display:flex;justify-content:flex-end;gap:10px;padding:12px 14px;border-top:1px solid rgba(255,255,255,0.08)}' +
        '#' + UI_ROOT_ID + ' .sapx-btn{appearance:none;border:0;border-radius:2px;padding:8px 12px;font-weight:700;cursor:pointer;font-size:13px}' +
        '#' + UI_ROOT_ID + ' .sapx-btn-primary{background:linear-gradient(180deg,#67c1f5 0%,#4aa3d6 100%);color:#0b1117}' +
        '#' + UI_ROOT_ID + ' .sapx-btn-primary:hover{filter:brightness(1.03)}' +
        '#' + UI_ROOT_ID + ' .sapx-btn-ghost{background:rgba(255,255,255,0.06);color:#c6d4df}' +
        '#' + UI_ROOT_ID + ' .sapx-btn-ghost:hover{background:rgba(255,255,255,0.09)}';
      document.head.appendChild(style);
    }
  }

  function ensureSettingsUI() {
    let root = document.getElementById(UI_ROOT_ID);
    if (root) return root;
    root = document.createElement('div');
    root.id = UI_ROOT_ID;
    root.innerHTML =
      '<div class="sapx-backdrop"></div>' +
      '<div class="sapx-panel" role="dialog" aria-modal="true">' +
      '<div class="sapx-header">' +
      '<div class="sapx-title">额外地区价格显示 设置</div>' +
      '<button class="sapx-close" type="button" aria-label="Close">×</button>' +
      '</div>' +
      '<div class="sapx-body">' +
      '<div class="sapx-field">' +
      '<div class="sapx-label">额外显示的地区</div>' +
      '<select class="sapx-select" id="sapx-region-select"></select>' +
      '</div>' +
      '<details class="sapx-details" id="sapx-adv">' +
      '<summary>更多设置</summary>' +
      '<div class="sapx-row">' +
      '<label class="sapx-check">' +
      '<input class="sapx-checkbox" id="sapx-show-code" type="checkbox" />' +
      '<span>显示地区代码（例如 CN / US）</span>' +
      '</label>' +
      '</div>' +
      '</details>' +
      '</div>' +
      '<div class="sapx-footer">' +
      '<button class="sapx-btn sapx-btn-ghost" type="button" id="sapx-cancel">取消</button>' +
      '<button class="sapx-btn sapx-btn-primary" type="button" id="sapx-save">保存并刷新</button>' +
      '</div>' +
      '</div>';
    document.documentElement.appendChild(root);
    const close = () => { root.classList.remove('sapx-open'); };
    root.querySelector('.sapx-backdrop').addEventListener('click', close);
    root.querySelector('.sapx-close').addEventListener('click', close);
    root.querySelector('#sapx-cancel').addEventListener('click', close);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('sapx-open')) close(); }, { passive: true });
    return root;
  }

  function openSettingsUI() {
    const root = ensureSettingsUI();
    const select = root.querySelector('#sapx-region-select');
    const showCode = root.querySelector('#sapx-show-code');
    const adv = root.querySelector('#sapx-adv');
    adv.removeAttribute('open');
    const cur = getTargetRegion();
    select.innerHTML = REGIONS.map(r => '<option value="' + r.id + '">' + r.label + '</option>').join('');
    select.value = cur.id;
    showCode.checked = getShowRegionCode();
    root.querySelector('#sapx-save').onclick = () => {
      GM_setValue(STORAGE_KEY_REGION_ID, select.value);
      GM_setValue(STORAGE_KEY_SHOW_CODE, Boolean(showCode.checked));
      location.reload();
    };
    root.classList.add('sapx-open');
    select.focus();
  }

  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: 20000,
        onload: (res) => {
          if ((res.status >= 200 && res.status < 300) || (res.status === 0 && res.responseText)) resolve(res.responseText);
          else reject(new Error('HTTP ' + res.status));
        },
        onerror: reject,
        ontimeout: () => reject(new Error('Timeout'))
      });
    });
  }

  class RequestQueue {
    constructor(concurrency = 4) { this.concurrency = concurrency; this.running = 0; this.queue = []; }
    enqueue(task) {
      return new Promise((resolve, reject) => {
        this.queue.push({ task, resolve, reject });
        this._deq();
      });
    }
    _deq() {
      if (this.running >= this.concurrency) return;
      const job = this.queue.shift();
      if (!job) return;
      this.running++;
      Promise.resolve().then(job.task).then(job.resolve).catch(job.reject).finally(() => { this.running--; this._deq(); });
    }
  }

  const requestQueue = new RequestQueue(4);
  const currencyDigitsCache = new Map();

  function getCurrencyFractionDigits(currency) {
    if (currencyDigitsCache.has(currency)) return currencyDigitsCache.get(currency);
    let digits = 2;
    try { digits = new Intl.NumberFormat('en-US', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits; } catch (e) {}
    currencyDigitsCache.set(currency, digits);
    return digits;
  }

  function formatMinorToCurrency(minor, currency) {
    const fd = getCurrencyFractionDigits(currency);
    const major = minor / Math.pow(10, fd);
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(major); } catch (e) { return String(major.toFixed(fd)) + ' ' + currency; }
  }

  function parseFormattedToMinor(formatted, currency) {
    if (!formatted) return null;
    const fd = getCurrencyFractionDigits(currency);
    let s = String(formatted).replace(/\s+/g, '').replace(/[^\d.,]/g, '');
    if (!s) return null;
    if (fd === 0) {
      const digits = s.replace(/\D/g, '');
      if (!digits) return null;
      const n = parseInt(digits, 10);
      return Number.isFinite(n) ? n : null;
    }
    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    let decSep = null;
    if (lastDot >= 0 && lastComma >= 0) decSep = lastDot > lastComma ? '.' : ',';
    else if (lastDot >= 0) { const after = s.length - lastDot - 1; decSep = (after === fd) ? '.' : null; }
    else if (lastComma >= 0) { const after = s.length - lastComma - 1; decSep = (after === fd) ? ',' : null; }
    let intPart = s;
    let fracPart = '';
    if (decSep) { const parts = s.split(decSep); fracPart = parts.pop() || ''; intPart = parts.join(''); }
    intPart = intPart.replace(/[.,]/g, '').replace(/\D/g, '');
    fracPart = fracPart.replace(/\D/g, '');
    if (!intPart) intPart = '0';
    if (fracPart.length > fd) fracPart = fracPart.slice(0, fd);
    while (fracPart.length < fd) fracPart += '0';
    const i = parseInt(intPart, 10);
    const f = parseInt(fracPart || '0', 10);
    if (!Number.isFinite(i) || !Number.isFinite(f)) return null;
    return i * Math.pow(10, fd) + f;
  }

  const priceCache = new Map();
  const CACHE_TTL_MS = 5 * 60 * 1000;

  function cacheGet(key) {
    const v = priceCache.get(key);
    if (!v) return undefined;
    if (Date.now() - v.ts > CACHE_TTL_MS) { priceCache.delete(key); return undefined; }
    return v.value;
  }

  function cacheSet(key, value) { priceCache.set(key, { ts: Date.now(), value }); }

  function normalizePrice(o) {
    return {
      ok: Boolean(o.finalFormatted || o.initialFormatted),
      currency: o.currency,
      final: o.final,
      initial: o.initial,
      finalFormatted: o.finalFormatted,
      initialFormatted: o.initialFormatted,
      discountPercent: o.discountPercent
    };
  }

  async function getAppPrice(appid, cc, currencyFallback) {
    const url = 'https://store.steampowered.com/api/appdetails?appids=' + appid + '&cc=' + cc + '&filters=price_overview,is_free';
    const text = await requestQueue.enqueue(() => gmGet(url));
    const block = JSON.parse(text) && JSON.parse(text)[String(appid)];
    if (!block || !block.success) return null;
    const data = block.data || {};
    if (data.is_free) return normalizePrice({ currency: currencyFallback, final: 0, initial: 0, finalFormatted: 'Free', initialFormatted: 'Free' });
    const po = data.price_overview;
    if (!po) return null;
    return normalizePrice({
      currency: po.currency,
      final: po.final,
      initial: po.initial,
      finalFormatted: po.final_formatted,
      initialFormatted: po.initial_formatted || po.final_formatted,
      discountPercent: po.discount_percent
    });
  }

  async function getPackagePrice(packageid, cc, currencyFallback) {
    const url = 'https://store.steampowered.com/api/packagedetails?packageids=' + packageid + '&cc=' + cc;
    const text = await requestQueue.enqueue(() => gmGet(url));
    const block = JSON.parse(text) && JSON.parse(text)[String(packageid)];
    if (!block || !block.success) return null;
    const p = (block.data && (block.data.price || block.data.price_overview)) || null;
    if (!p) return null;
    return normalizePrice({
      currency: p.currency,
      final: p.final,
      initial: p.initial,
      finalFormatted: p.final_formatted,
      initialFormatted: p.initial_formatted,
      discountPercent: p.discount_percent
    });
  }

  async function getBundlePrice(bundleid, cc, currencyFallback) {
    const url = 'https://store.steampowered.com/bundle/' + bundleid + '/?cc=' + cc + '&l=english';
    const html = await requestQueue.enqueue(() => gmGet(url));
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const finalEl = doc.querySelector('.discount_final_price') || doc.querySelector('.game_purchase_price');
    if (!finalEl) return null;
    const finalFormatted = finalEl.textContent.trim();
    return normalizePrice({
      currency: currencyFallback,
      final: parseFormattedToMinor(finalFormatted, currencyFallback),
      initial: parseFormattedToMinor(finalFormatted, currencyFallback),
      finalFormatted: finalFormatted,
      initialFormatted: finalFormatted,
      discountPercent: undefined
    });
  }

  async function getPriceForItem(item, region) {
    const key = item.type + ':' + item.id + ':' + region.id;
    const cached = cacheGet(key);
    if (cached !== undefined) return cached;
    for (const cc of region.ccCandidates) {
      try {
        let res = null;
        if (item.type === 'app') res = await getAppPrice(item.id, cc, region.currency);
        else if (item.type === 'package') res = await getPackagePrice(item.id, cc, region.currency);
        else if (item.type === 'bundle') res = await getBundlePrice(item.id, cc, region.currency);
        if (res && res.ok) { cacheSet(key, res); return res; }
      } catch (e) {}
    }
    cacheSet(key, null);
    return null;
  }

  function inferItemFromScope(scopeEl) {
    if (!scopeEl) return null;
    const holder = scopeEl.closest('[data-ds-appid],[data-ds-packageid],[data-ds-bundleid]');
    if (holder) {
      const pkg = holder.dataset.dsPackageid && holder.dataset.dsPackageid.split(',')[0];
      const bnd = holder.dataset.dsBundleid;
      const app = holder.dataset.dsAppid && holder.dataset.dsAppid.split(',')[0];
      if (pkg) return { type: 'package', id: pkg };
      if (bnd) return { type: 'bundle', id: bnd };
      if (app) return { type: 'app', id: app };
    }
    const link = scopeEl.closest('a') || scopeEl.querySelector('a[href*="/app/"],a[href*="/sub/"],a[href*="/bundle/"]');
    if (link) {
      const h = link.getAttribute('href') || '';
      let m = h.match(/\/app\/(\d+)/); if (m) return { type: 'app', id: m[1] };
      m = h.match(/\/sub\/(\d+)/); if (m) return { type: 'package', id: m[1] };
      m = h.match(/\/bundle\/(\d+)/); if (m) return { type: 'bundle', id: m[1] };
    }
    const p = location.pathname;
    let m = p.match(/^\/app\/(\d+)/); if (m) return { type: 'app', id: m[1] };
    m = p.match(/^\/sub\/(\d+)/); if (m) return { type: 'package', id: m[1] };
    return null;
  }

  function isOriginalPriceElement(el) {
    return el.classList.contains('discount_original_price') || el.classList.contains('StoreOriginalPrice') || el.tagName === 'STRIKE' || !!el.closest('strike');
  }

  function upsertExtraInside(priceEl, region, formatted) {
    let span = priceEl.querySelector('.' + EXTRA_CLASS);
    const text = getShowRegionCode() ? '(' + region.short + ' ' + formatted + ')' : '(' + formatted + ')';
    if (!span) {
      span = document.createElement('span');
      span.className = EXTRA_CLASS;
      span.setAttribute(MARK_ATTR, region.id);
      span.textContent = text;
      priceEl.appendChild(span);
    } else {
      span.setAttribute(MARK_ATTR, region.id);
      span.textContent = text;
    }
  }

  async function enhancePriceElement(priceEl) {
    if (!priceEl || priceEl.nodeType !== 1 || priceEl.classList.contains(EXTRA_CLASS)) return;
    const txt = priceEl.textContent.trim();
    if (!txt || /^-\d+%$/.test(txt) || txt.length > 40) return;
    if (priceEl.offsetWidth === 0 && !priceEl.closest('.game_area_purchase_game_dropdown_menu')) return;

    const region = getTargetRegion();
    const exist = priceEl.querySelector('.' + EXTRA_CLASS);
    if (exist && exist.getAttribute(MARK_ATTR) === region.id) return;

    const item = inferItemFromScope(priceEl);
    if (!item) return;

    const price = await getPriceForItem(item, region);
    if (!price) return;

    const wantInitial = isOriginalPriceElement(priceEl);
    const formatted = wantInitial ? price.initialFormatted : price.finalFormatted;
    if (!formatted) return;

    upsertExtraInside(priceEl, region, formatted);
  }

  async function updateCartSummary() {
    if (!isCartPage()) return;
    const region = getTargetRegion();
    const items = document.querySelectorAll('._3ypRUtQoOfOrCsyHlzfGm4 > div.Panel.Focusable');
    if (!items.length) return;

    let sumMinor = 0;
    let missingCount = 0;

    for (const row of items) {
      const item = inferItemFromScope(row);
      if (!item) continue;
      const price = await getPriceForItem(item, region);
      if (price && price.ok && price.final !== null && Number.isFinite(price.final)) sumMinor += price.final;
      else missingCount++;
    }

    const cartSummaryRow = document.querySelector('._2DjadWLFH3keW9rGWZKxSk._1G8JdfmCwhonn-pZk-tfwP');
    if (!cartSummaryRow) return;

    let box = document.getElementById(CART_SUMMARY_ID);
    if (!box) {
      box = document.createElement('div');
      box.id = CART_SUMMARY_ID;
      cartSummaryRow.appendChild(box);
    }

    const totalText = formatMinorToCurrency(sumMinor, region.currency);
    const label = getShowRegionCode() ? '目标地区预计付款 (' + region.short + ')' : '目标地区预计付款';

    let html = '<div class="sapx-row"><div class="sapx-label">' + label + '：</div><div class="sapx-value">' + totalText + '</div></div>';
    if (missingCount > 0) html += '<div class="sapx-warn">注意：有 ' + missingCount + ' 项商品无法在目标地区购买（已从合计剔除）</div>';
    box.innerHTML = html;
  }

  const PRICE_SELECTORS = [
    '.discount_final_price', '.discount_original_price', '.game_purchase_price',
    '.game_area_dlc_price', '.col.search_price.responsive_secondrow strike',
    '.col.search_price.responsive_secondrow .discount_final_price',
    '.Panel.Focusable .StoreOriginalPrice', '.Panel.Focusable .pk-LoKoNmmPK4GBiC9DR8',
    '._2WLaY5TxjBGVyuWe_6KS3N', '.game_area_purchase_game_dropdown_selection > span',
    '.game_area_purchase_game_dropdown_menu_item_text'
  ].join(',');

  let scanTimer = null;

  function scheduleScan() {
    if (scanTimer) return;
    scanTimer = setTimeout(() => {
      scanTimer = null;
      document.querySelectorAll(PRICE_SELECTORS).forEach(el => { enhancePriceElement(el); });
      if (isCartPage()) updateCartSummary();
    }, 450);
  }

  function startObserver() {
    const obs = new MutationObserver(() => scheduleScan());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function registerMenu() {
    GM_registerMenuCommand('设置：额外地区价格显示', () => openSettingsUI());
  }

  addStyle();
  registerMenu();
  scheduleScan();
  startObserver();
})();

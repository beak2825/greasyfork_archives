// ==UserScript==
// @name         BTC-Mini-Terminal
// @namespace
// @version      1.1
// @description  JavaScript
// @author       CHN-DST (modified)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.binance.com
// @connect      fxhapi.feixiaohao.com
// @connect      api.huobi.pro
// @connect      api.coingecko.com
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1548267
// @downloadURL https://update.greasyfork.org/scripts/558986/BTC-Mini-Terminal.user.js
// @updateURL https://update.greasyfork.org/scripts/558986/BTC-Mini-Terminal.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 注入检查 ----------
  try {
    if (window.top !== window.self) return;
    const EXCLUDE_HOSTNAME_PATTERNS = [
      /doubleclick\.net/i, /googlesyndication\.com/i, /google-analytics\.com/i,
      /adservice\.google\.com/i, /ads\.youtube\.com/i, /adsrvr\.org/i
    ];
    const hostname = (location.hostname || '').toLowerCase();
    if (EXCLUDE_HOSTNAME_PATTERNS.some(r => r.test(hostname))) return;
  } catch (e) { /* ignore */ }

  // ---------- 配置 ----------
  const SYMBOL = 'BTCUSDT';
  const FIAT = 'usd';
  const WIDTH = 370;
  const HEIGHT = 230;
  const PRICE_REFRESH_MS = 5000;
  const DEFAULT_INTERVAL = '1m';

  const CANDLE_OPTIONS = [50, 100, 200];
  const CANDLE_KEY = 'btc_widget_candles';
  const COLLAPSED_KEY = 'btc_widget_collapsed';
  const PROXY_KEY = 'btc_widget_proxy';
  const PUBLIC_PROXY_PREFIXES = [
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://thingproxy.org/fetch/'
  ];

  // ---------- DOM / 状态  (will be assigned during init) ----------
  let container = null;
  let canvas = null;
  let ctx = null;
  let tooltip = null;

  let currentInterval = DEFAULT_INTERVAL;
  let priceTimer = null;
  let klineTimer = null;
  let lastPrice = null;
  let selectedCandleCount = 200;

  // ---------- style ----------
  const style = document.createElement('style');
  style.textContent = `
  #btc-widget {
    position: fixed;
    left: 12px;
    bottom: 12px;
    width: ${WIDTH}px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    border-radius: 10px;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    z-index: 2147483647;
    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,245,247,0.96));
    color: #111;
    user-select: none;
  }
  #btc-widget.dark {
    background: linear-gradient(180deg, rgba(18,18,20,0.96), rgba(12,12,14,0.96));
    color: #e8e8e8;
  }

  #btc-header { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; cursor: move; gap:8px; white-space:nowrap; min-width:0; overflow:hidden; }
  #btc-header .left { display:flex; align-items:center; gap:8px; white-space:nowrap; min-width:0; overflow:hidden; }
  #btc-symbol { font-weight:700; font-size:13px; white-space:nowrap; flex:0 0 auto; }
  #btc-price { font-weight:700; font-size:15px; white-space:nowrap; flex:0 1 auto; min-width:56px; max-width:140px; overflow:hidden; text-overflow:ellipsis; }
  #btc-pct { font-size:12px; padding:2px 6px; border-radius:6px; flex:0 0 auto; }

  #btc-controls { display:flex; gap:6px; align-items:center; flex:0 0 auto; }
  .btc-btn { font-size:12px; padding:6px 8px; border-radius:6px; border:1px solid rgba(0,0,0,0.06); background:transparent; cursor:pointer; }
  .count-btn { font-size:12px; padding:4px 6px; border-radius:6px; border:1px solid rgba(0,0,0,0.06); background:transparent; cursor:pointer; }

  #btc-footer { display:flex; align-items:center; justify-content:space-between; padding:6px 10px; font-size:12px; color:#666; position: relative; }
  #btc-counts { position:absolute; left:50%; transform:translateX(-50%); bottom:6px; display:flex; gap:6px; align-items:center; pointer-events:auto; }
  #btc-chart-wrap { padding:6px 8px 12px 8px; display:block; }
  #btc-canvas { width:100%; height:140px; background:transparent; display:block; border-radius:6px; }
  #btc-minimap { margin-top:6px; font-size:11px; color:#666; text-align:right; }
  #btc-toggle { font-size:12px; padding:6px; border-radius:6px; cursor:pointer; }

  #btc-widget.collapsed #btc-chart-wrap, #btc-widget.collapsed #btc-footer { display:none; }
  #btc-widget.collapsed #btc-counts { display:none !important; }

  #btc-error { color:#b91c1c; font-size:12px; margin-top:6px; text-align:left; white-space:pre-wrap; word-break:break-word; }

  #btc-price-tooltip {
    position: fixed;
    z-index: 2147483650;
    padding:6px 8px;
    border-radius:6px;
    background: rgba(0,0,0,0.85);
    color: #fff;
    font-size:13px;
    pointer-events: none;
    white-space: nowrap;
    transform: translateY(-6px);
    display: none;
    box-shadow: 0 6px 18px rgba(0,0,0,0.3);
  }
  #btc-price-tooltip.light {
    background: rgba(255,255,255,0.95);
    color: #111;
    border: 1px solid rgba(0,0,0,0.06);
  }
  `;
  document.head.appendChild(style);

  // ---------- 存储 helpers (GM优先，回退到localStorage) ----------
  async function getStored(key, defaultVal = null) {
    try {
      if (typeof GM_getValue === 'function') {
        // GM_getValue might be sync or return a value or a promise - handle both
        const maybe = GM_getValue(key);
        if (maybe && typeof maybe.then === 'function') {
          const v = await maybe;
          if (typeof v !== 'undefined' && v !== null) return v;
        } else {
          if (typeof maybe !== 'undefined' && maybe !== null) return maybe;
        }
      }
    } catch (e) { /* ignore GM read error */ }

    try {
      const ls = localStorage.getItem(key);
      if (ls !== null) {
        // try parse numbers/booleans if appropriate
        if (ls === 'true') return true;
        if (ls === 'false') return false;
        if (!isNaN(Number(ls))) return Number(ls);
        return ls;
      }
    } catch (e) {}
    return defaultVal;
  }

  async function setStored(key, val) {
    try {
      if (typeof GM_setValue === 'function') {
        const ret = GM_setValue(key, val);
        if (ret && typeof ret.then === 'function') await ret;
        return;
      }
    } catch (e) { /* ignore GM write error */ }
    try {
      localStorage.setItem(key, String(val));
    } catch (e) {}
  }

  // ---------- 通用网络 helpers（不变） ----------
  async function tryFetchJson(url) {
    const res = await fetch(url, { cache: 'no-store', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  }
  async function tryGMJson(url) {
    if (typeof GM_xmlhttpRequest !== 'function') throw new Error('GM_xmlhttpRequest not available');
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'json',
        onload(resp) {
          if (resp.status >= 200 && resp.status < 300) resolve(resp.response);
          else reject(new Error('GM_xmlhttpRequest HTTP ' + resp.status));
        },
        onerror(err) { reject(err); },
        ontimeout() { reject(new Error('GM_xmlhttpRequest timeout')); }
      });
    });
  }
  async function httpGetJson(url) {
    try { return await tryFetchJson(url); } catch (fetchErr) { console.debug('fetch failed', fetchErr); }
    try { return await tryGMJson(url); } catch (gmErr) { console.debug('GM failed', gmErr); }

    try {
      const userProxy = await getStored(PROXY_KEY, '');
      if (userProxy && typeof userProxy === 'string' && userProxy.trim()) {
        const proxied = userProxy.trim() + encodeURIComponent(url);
        try { return await tryFetchJson(proxied); } catch (e1) { try { return await tryGMJson(proxied); } catch (e2) {} }
      }
    } catch (e) { console.debug('proxy check error', e); }

    for (const prefix of PUBLIC_PROXY_PREFIXES) {
      try {
        const proxied = prefix + encodeURIComponent(url);
        try { return await tryFetchJson(proxied); } catch (pf) { try { return await tryGMJson(proxied); } catch (pg) {} }
      } catch (err) { console.debug('public proxy iteration error', err); }
    }

    const hint = '所有直接/代理请求均失败';
    throw new Error('网络请求失败。' + hint);
  }

  // ---------- 数据源实现（保持原样） ----------
  async function fetchPriceFeixiaohao() {
    const url = 'https://fxhapi.feixiaohao.com/public/v1/ticker?limit=5&convert=USD';
    try {
      const json = await httpGetJson(url);
      if (!Array.isArray(json)) throw new Error('Feixiaohao response invalid');
      const btc = json.find(item => (item.id && String(item.id).toLowerCase() === 'bitcoin') || (item.symbol && String(item.symbol).toUpperCase() === 'BTC'));
      if (!btc) throw new Error('Feixiaohao bitcoin entry not found');
      const p = (typeof btc.price_usd !== 'undefined') ? btc.price_usd : (btc.price || btc.price_usd);
      if (typeof p === 'number' || !isNaN(Number(p))) return parseFloat(p);
      throw new Error('Feixiaohao price missing');
    } catch (e) { throw new Error('Feixiaohao price error: ' + (e.message || e)); }
  }

  async function fetchKlinesHuobi(intervalHuobi, size = 200) {
    const base = 'https://api.huobi.pro/market/history/kline';
    const url = `${base}?symbol=btcusdt&period=${intervalHuobi}&size=${size}`;
    try {
      const json = await httpGetJson(url);
      if (!json || (json.status && json.status !== 'ok') || !Array.isArray(json.data)) throw new Error('Huobi response invalid');
      return json.data.map(item => ({ time: Number(item.id), open: parseFloat(item.open), high: parseFloat(item.high), low: parseFloat(item.low), close: parseFloat(item.close) })).reverse();
    } catch (e) { throw new Error('Huobi klines error: ' + (e.message || e)); }
  }

  async function fetchPriceHuobi() {
    const url = `https://api.huobi.pro/market/detail/merged?symbol=btcusdt`;
    try {
      const json = await httpGetJson(url);
      if (json && json.tick && typeof json.tick.close !== 'undefined') return parseFloat(json.tick.close);
      throw new Error('Huobi price missing');
    } catch (e) { throw new Error('Huobi price error: ' + (e.message || e)); }
  }

  async function fetchKlinesBinance(intervalBin, limit = 200) {
    const base = 'https://api.binance.com/api/v3/klines';
    const url = `${base}?symbol=${SYMBOL}&interval=${intervalBin}&limit=${limit}`;
    try {
      const json = await httpGetJson(url);
      return json.map(item => ({ time: Math.floor(item[0] / 1000), open: parseFloat(item[1]), high: parseFloat(item[2]), low: parseFloat(item[3]), close: parseFloat(item[4]) }));
    } catch (e) { throw new Error('Binance klines error: ' + (e.message || e)); }
  }
  async function fetchPriceBinance() {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${SYMBOL}`;
    try { const json = await httpGetJson(url); return parseFloat(json.price); } catch (e) { throw new Error('Binance price error: ' + (e.message || e)); }
  }

  async function fetchOhlcCoinGecko(days = 1) {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=${FIAT}&days=${days}`;
    try {
      const json = await httpGetJson(url);
      return json.map(item => ({ time: Math.floor(item[0] / 1000), open: item[1], high: item[2], low: item[3], close: item[4] }));
    } catch (e) { throw new Error('CoinGecko OHLC error: ' + (e.message || e)); }
  }
  async function fetchMarketChartPricesCoinGecko(days = 1) {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${FIAT}&days=${days}`;
    try {
      const json = await httpGetJson(url);
      return (json.prices || []).map(p => ({ time: Math.floor(p[0] / 1000), price: p[1] }));
    } catch (e) { throw new Error('CoinGecko market_chart error: ' + (e.message || e)); }
  }

  // ---------- 聚合/转换 ----------
  function aggregatePricesToCandles(pricePoints, secondsPerCandle, maxCandles = 200) {
    if (!pricePoints || pricePoints.length === 0) return [];
    pricePoints.sort((a, b) => a.time - b.time);
    const firstTime = pricePoints[0].time;
    const buckets = new Map();
    for (const p of pricePoints) {
      const idx = Math.floor((p.time - firstTime) / secondsPerCandle);
      const key = firstTime + idx * secondsPerCandle;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(p.price);
    }
    const candles = [];
    for (const [t, arr] of buckets) {
      if (!arr || arr.length === 0) continue;
      const open = arr[0];
      const close = arr[arr.length - 1];
      let high = -Infinity, low = Infinity;
      for (const v of arr) { if (v > high) high = v; if (v < low) low = v; }
      candles.push({ time: t, open, high, low, close });
    }
    return candles.slice(-maxCandles);
  }

  const INTERVAL_MAP = {
    '1m': { bin: '1m', huobi: '1min', seconds: 60, binLimit: 200 },
    '1h': { bin: '1h', huobi: '60min', seconds: 3600, binLimit: 200 },
    '1d': { bin: '1d', huobi: '1day', seconds: 86400, binLimit: 365 },
  };

  // ---------- Kline + price fallback (保持原逻辑) ----------
  async function fetchKlinesWithFallback(intervalKey, limitOverride) {
    const cfg = INTERVAL_MAP[intervalKey];
    const limitToUse = Number(limitOverride) || cfg.binLimit;
    try {
      const kl = await fetchKlinesBinance(cfg.bin, limitToUse);
      return { source: 'binance', kl };
    } catch (binErr) {
      try {
        const huobiLimit = Math.min(limitToUse, 200);
        const kl = await fetchKlinesHuobi(cfg.huobi, huobiLimit);
        return { source: 'huobi', kl };
      } catch (huErr) {
        try {
          if (intervalKey === '1d') {
            const ohlc = await fetchOhlcCoinGecko(90);
            const last = ohlc.slice(-Math.min(limitToUse, ohlc.length));
            return { source: 'coingecko_ohlc', kl: last };
          } else {
            const days = intervalKey === '1m' ? 1 : 7;
            const prices = await fetchMarketChartPricesCoinGecko(days);
            const sPer = cfg.seconds;
            const candles = aggregatePricesToCandles(prices, sPer, limitToUse);
            if (candles.length === 0) throw new Error('CoinGecko aggregation returned 0 candles');
            return { source: 'coingecko_prices_agg', kl: candles };
          }
        } catch (cgErr) {
          throw new Error('All sources failed. BinErr: ' + (binErr.message || binErr) + ' ; HuErr: ' + (huErr.message || huErr) + ' ; CGErr: ' + (cgErr.message || cgErr));
        }
      }
    }
  }

  async function fetchPriceWithFallback() {
    try {
      const p = await fetchPriceBinance();
      return { source: 'binance', price: p };
    } catch (binErr) {
      try {
        const pfx = await fetchPriceFeixiaohao();
        return { source: 'feixiaohao', price: pfx };
      } catch (fxhErr) {
        try {
          const p2 = await fetchPriceHuobi();
          return { source: 'huobi', price: p2 };
        } catch (huErr) {
          try {
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${FIAT}`;
            const json = await httpGetJson(url);
            if (json && json.bitcoin && json.bitcoin[FIAT]) return { source: 'coingecko', price: parseFloat(json.bitcoin[FIAT]) };
            throw new Error('CoinGecko price missing');
          } catch (cgErr) {
            throw new Error('Price sources failed. BinErr: ' + (binErr.message || binErr) + ' ; FXHErr: ' + (fxhErr && fxhErr.message || fxhErr) + ' ; HuErr: ' + (huErr && huErr.message || huErr) + ' ; CGErr: ' + (cgErr.message || cgErr));
          }
        }
      }
    }
  }

  // ---------- Grid & 绘图 helper（保持原样，改为使用上层 ctx/canvas 变量） ----------
  function drawGridAndAxis(minPrice, maxPrice, w, h, topPad, bottomPad) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    const rows = 4;
    for (let i = 0; i <= rows; i++) {
      const y = topPad + (h - topPad - bottomPad) * (i / rows);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.font = '11px system-ui, Arial';
    ctx.fillStyle = getComputedStyle(document.body).color || '#111';
    const labelCount = 4;
    for (let i = 0; i <= labelCount; i++) {
      const y = topPad + (h - topPad - bottomPad) * (i / labelCount);
      const val = (maxPrice - (maxPrice - minPrice) * (i / labelCount));
      const txt = (val >= 1 ? val.toLocaleString(undefined, { maximumFractionDigits: 2 }) : val.toPrecision(6));
      const txtW = ctx.measureText(txt).width;
      const tx = w - txtW - 4;
      const ty = Math.max(topPad + 8, Math.min(h - bottomPad - 2, y + 4));
      ctx.fillText(txt, tx, ty);
    }
    ctx.restore();
  }

  function fitCanvasToDisplaySize() {
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const displayWidth = Math.max(1, canvas.clientWidth || (WIDTH));
    const displayHeight = Math.max(1, canvas.clientHeight || (HEIGHT));
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    const newW = Math.floor(displayWidth * dpr);
    const newH = Math.floor(displayHeight * dpr);
    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width = newW;
      canvas.height = newH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawCandles(candles) {
    if (!canvas || !ctx) return;
    const cssWidth = canvas.clientWidth || (canvas.width / Math.max(1, window.devicePixelRatio || 1));
    const cssHeight = canvas.clientHeight || (canvas.height / Math.max(1, window.devicePixelRatio || 1));

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (!candles || candles.length === 0) {
      ctx.save();
      ctx.font = '12px system-ui, Arial';
      ctx.fillStyle = '#888';
      ctx.fillText('无可用 K 线数据', 8, 20);
      ctx.restore();
      return;
    }

    let minP = Infinity, maxP = -Infinity;
    for (const c of candles) {
      if (typeof c.low === 'number' && c.low < minP) minP = c.low;
      if (typeof c.high === 'number' && c.high > maxP) maxP = c.high;
    }
    if (!isFinite(minP) || !isFinite(maxP)) return;
    const rawRange = Math.max(1e-12, maxP - minP);

    const padRatio = Math.max(0.01, Math.min(0.18, rawRange / Math.max(Math.abs(maxP), 1)));

    const topPad = Math.max(10, Math.round(padRatio * cssHeight * 0.9 + 8));
    const bottomPad = Math.max(12, Math.round(padRatio * cssHeight * 1.2 + 12));

    const absPad = rawRange > 0 ? rawRange * 0.03 : Math.max(Math.abs(maxP) * 0.01, 1);
    minP -= absPad; maxP += absPad;

    const isDark = container.classList.contains('dark');
    ctx.save();
    ctx.fillStyle = isDark ? 'rgba(10,10,12,0.85)' : 'rgba(255,255,255,0.95)';
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.restore();

    drawGridAndAxis(minP, maxP, cssWidth, cssHeight, topPad, bottomPad);

    const leftPad = 6, rightPad = 56;
    const drawW = Math.max(1, cssWidth - leftPad - rightPad);
    const drawH = Math.max(8, cssHeight - topPad - bottomPad);

    const maxCandlesVis = Math.floor(drawW / 3) || 1;
    const n = Math.min(candles.length, maxCandlesVis);
    const start = Math.max(0, candles.length - n);
    const slice = candles.slice(start);

    const effectiveN = Math.max(1, n);
    const candleW = Math.max(1, Math.floor((drawW / effectiveN) * 0.6));
    const gap = Math.max(1, Math.floor((drawW - effectiveN * candleW) / (effectiveN + 1)));

    function priceToY(p) {
      if (maxP === minP) return topPad + drawH / 2;
      const y = topPad + ((maxP - p) / (maxP - minP)) * drawH;
      return Math.round(Math.max(topPad + 0.5, Math.min(topPad + drawH - 0.5, y)));
    }

    let x = leftPad + gap;
    for (let i = 0; i < slice.length; i++) {
      const c = slice[i];
      const openY = priceToY(c.open);
      const closeY = priceToY(c.close);
      const highY = priceToY(c.high);
      const lowY = priceToY(c.low);

      const top = Math.min(openY, closeY);
      const bottom = Math.max(openY, closeY);
      const bodyH = Math.max(1, bottom - top);

      const isUp = c.close >= c.open;
      const color = isUp ? '#10B981' : '#ef4444';

      const cx = Math.round(x + Math.floor(candleW / 2));
      const cw = Math.max(1, Math.round(candleW));
      // wick
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, Math.round(cw / 6));
      ctx.moveTo(cx, highY);
      ctx.lineTo(cx, lowY);
      ctx.stroke();

      // body
      const bx = Math.round(x);
      ctx.fillStyle = color;
      ctx.fillRect(bx, top, cw, bodyH);

      x += candleW + gap;
    }

    const last = slice[slice.length - 1];
    if (last) {
      let ly = priceToY(last.close);
      ly = Math.round(Math.max(topPad + 1, Math.min(topPad + drawH - 1, ly)));

      ctx.beginPath();
      ctx.strokeStyle = '#888';
      ctx.setLineDash([4, 3]);
      ctx.moveTo(0, ly);
      ctx.lineTo(cssWidth, ly);
      ctx.stroke();
      ctx.setLineDash([]);

      const text = (last.close >= 1 ? last.close.toLocaleString(undefined, { maximumFractionDigits: 2 }) : last.close.toPrecision(6));
      ctx.font = '12px system-ui, Arial';
      ctx.textBaseline = 'middle';
      const txtW = ctx.measureText(text).width;

      ctx.fillStyle = isDark ? '#e8e8e8' : '#111';
      const textX = Math.max(8, cssWidth - txtW - 10);
      const textY = ly;
      ctx.fillText(text, textX, textY);
    }
  }

  // ---------- Orchestration ----------
  async function updateKlinesAndDraw() {
    setError(null);
    try {
      const res = await fetchKlinesWithFallback(currentInterval, selectedCandleCount);
      const kl = res.kl || [];
      setRangeUI(kl.length);
      setUpdateTimeUI(Date.now(), res.source);
      const prevClose = kl.length >= 2 ? kl[kl.length - 2].close : null;
      setPriceUI(lastPrice || (kl.length ? kl[kl.length - 1].close : null), prevClose);
      fitCanvasToDisplaySize();
      drawCandles(kl);
      document.getElementById('btc-error').style.display = 'none';
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      setError(msg);
      // draw error text
      if (canvas && ctx) {
        fitCanvasToDisplaySize();
        ctx.font = '12px system-ui, Arial';
        ctx.fillStyle = '#b91c1c';
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillText('K线获取失败：' + msg, 8, 18);
      }
    }
  }

  async function updatePriceOnce() {
    try {
      const res = await fetchPriceWithFallback();
      const price = res.price;
      lastPrice = price;
      let prevClose = null;
      try {
        const cfg = INTERVAL_MAP[currentInterval];
        try {
          const kl = await fetchKlinesBinance(cfg.bin, 3);
          if (kl && kl.length >= 2) prevClose = kl[kl.length - 2].close;
        } catch (be) {
          try {
            const klh = await fetchKlinesHuobi(cfg.huobi, 3);
            if (klh && klh.length >= 2) prevClose = klh[klh.length - 2].close;
          } catch (huInner) {
            const days = currentInterval === '1m' ? 1 : (currentInterval === '1h' ? 7 : 90);
            const prices = await fetchMarketChartPricesCoinGecko(days);
            const agg = aggregatePricesToCandles(prices, cfg.seconds, 3);
            if (agg && agg.length >= 2) prevClose = agg[agg.length - 2].close;
          }
        }
      } catch (inner) {}
      setPriceUI(price, prevClose);
      setUpdateTimeUI(Date.now(), res.source);
    } catch (e) {
      setError('价格获取失败：' + (e && e.message ? e.message : String(e)));
    }
  }

  function startTimers() {
    stopTimers();
    updateKlinesAndDraw();
    updatePriceOnce();
    priceTimer = setInterval(updatePriceOnce, PRICE_REFRESH_MS);
    const cfg = INTERVAL_MAP[currentInterval];
    let kRefresh = 60000;
    if (currentInterval === '1m') kRefresh = 15000;
    if (currentInterval === '1h') kRefresh = 60000;
    if (currentInterval === '1d') kRefresh = 300000;
    klineTimer = setInterval(updateKlinesAndDraw, kRefresh);
  }
  function stopTimers() {
    if (priceTimer) { clearInterval(priceTimer); priceTimer = null; }
    if (klineTimer) { clearInterval(klineTimer); klineTimer = null; }
  }

  // ---------- UI helpers ----------
  function refreshCountButtonsUI() {
    document.querySelectorAll('.count-btn').forEach(b => {
      const val = Number(b.getAttribute('data-count'));
      b.style.fontWeight = val === selectedCandleCount ? '700' : '400';
    });
  }

  function setError(msg) {
    const el = document.getElementById('btc-error');
    if (!el) return;
    if (!msg) { el.style.display = 'none'; el.textContent = ''; }
    else { el.style.display = 'block'; el.textContent = '初始化/网络错误：' + msg; }
  }

  function setPriceUI(price, prevClose) {
    const priceEl = document.getElementById('btc-price');
    const pctEl = document.getElementById('btc-pct');
    if (!priceEl) return;
    if (price == null) { priceEl.textContent = '--'; if (pctEl) pctEl.style.display = 'none'; return; }
    lastPrice = price;
    priceEl.textContent = price >= 1 ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : price.toPrecision(6);
    tooltip.textContent = (price >= 1 ? price.toLocaleString(undefined, { maximumFractionDigits: 8 }) : price.toPrecision(12));
    if (prevClose != null && pctEl) {
      const pct = ((price - prevClose) / prevClose) * 100;
      pctEl.style.display = 'inline-block';
      pctEl.textContent = `${pct >= 0 ? '▲' : '▼'}${Math.abs(pct).toFixed(2)}%`;
      pctEl.style.background = pct >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
      pctEl.style.color = pct >= 0 ? '#10B981' : '#ef4444';
      pctEl.style.border = pct >= 0 ? '1px solid rgba(16,185,129,0.12)' : '1px solid rgba(239,68,68,0.12)';
    } else if (pctEl) { pctEl.style.display = 'none'; }
  }
  function setUpdateTimeUI(ts, source) {
    const el = document.getElementById('btc-minimap');
    if (!el) return;
    const d = ts ? new Date(ts) : new Date();
    el.textContent = `数据来源：${source} · 更新时间：${d.toLocaleString()}`;
  }
  function setRangeUI(n) { const el = document.getElementById('btc-range'); if (el) el.textContent = `点数: ${n}`; }

  // ---------- Events binding ----------
  function bindEvents() {
    document.querySelectorAll('.btc-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const iv = btn.getAttribute('data-interval');
        if (iv === currentInterval) return;
        currentInterval = iv;
        document.querySelectorAll('.btc-btn').forEach(b => b.style.fontWeight = b.getAttribute('data-interval') === currentInterval ? '700' : '400');
        stopTimers();
        await updateKlinesAndDraw();
        startTimers();
      });
    });

    document.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const cnt = Number(btn.getAttribute('data-count'));
        if (!cnt || cnt === selectedCandleCount) return;
        selectedCandleCount = cnt;
        try { await setStored(CANDLE_KEY, selectedCandleCount); } catch (e) {}
        refreshCountButtonsUI();
        stopTimers();
        await updateKlinesAndDraw();
        startTimers();
      });
    });

    const toggle = document.getElementById('btc-toggle');
    if (toggle) {
      toggle.textContent = container.classList.contains('collapsed') ? '+' : '−';
      toggle.addEventListener('click', () => {
        container.classList.toggle('collapsed');
        const collapsed = container.classList.contains('collapsed');
        toggle.textContent = collapsed ? '+' : '−';
        // persist (async, no await necessary)
        setStored(COLLAPSED_KEY, collapsed ? 1 : 0).catch(() => {});
      });
    }

    const header = document.getElementById('btc-header');
    if (header) header.addEventListener('dblclick', () => container.classList.toggle('dark'));

    // drag
    let dragging = false;
    let startX = 0, startY = 0, initLeft = 0, initBottom = 0;
    if (header) header.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = container.getBoundingClientRect();
      initLeft = rect.left;
      initBottom = window.innerHeight - rect.bottom;
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = initLeft + dx;
      let newBottom = initBottom - dy;
      newLeft = Math.max(6, Math.min(window.innerWidth - container.offsetWidth - 6, newLeft));
      newBottom = Math.max(6, Math.min(window.innerHeight - container.offsetHeight - 6, newBottom));
      container.style.left = `${newLeft}px`;
      container.style.bottom = `${newBottom}px`;
    });
    window.addEventListener('mouseup', () => { dragging = false; document.body.style.userSelect = ''; });

    // tooltip only when price text truncated
    const priceEl = document.getElementById('btc-price');
    function isTruncated(el) { return el && el.scrollWidth > el.clientWidth + 1; }
    if (priceEl) {
      priceEl.addEventListener('mouseenter', (e) => {
        try {
          if (!isTruncated(priceEl)) return;
          const rect = priceEl.getBoundingClientRect();
          const isDark = container.classList.contains('dark');
          tooltip.className = isDark ? '' : 'light';
          tooltip.style.display = 'block';
          tooltip.textContent = tooltip.textContent || priceEl.textContent || '';
          tooltip.style.left = Math.max(6, Math.min(window.innerWidth - 12 - tooltip.offsetWidth, rect.left + (rect.width - tooltip.offsetWidth) / 2)) + 'px';
          tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
        } catch (err) {}
      });
      priceEl.addEventListener('mousemove', (e) => {
        try {
          if (tooltip.style.display !== 'block') return;
          const rect = priceEl.getBoundingClientRect();
          tooltip.style.left = Math.max(6, Math.min(window.innerWidth - 12 - tooltip.offsetWidth, rect.left + (rect.width - tooltip.offsetWidth) / 2)) + 'px';
        } catch (err) {}
      });
      priceEl.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
      window.addEventListener('scroll', () => { tooltip.style.display = 'none'; }, true);
    }
  }

  // ---------- resize debounce ----------
  let __resizeTimer = null;
  function onResizeDebounced() {
    if (__resizeTimer) clearTimeout(__resizeTimer);
    __resizeTimer = setTimeout(() => {
      try {
        fitCanvasToDisplaySize();
        if (typeof updateKlinesAndDraw === 'function') updateKlinesAndDraw();
      } catch (e) { console.error('resize redraw error', e); }
    }, 60);
  }
  window.addEventListener('resize', onResizeDebounced);

  // ---------- init (now reads persisted settings first, then creates DOM) ----------
  (async function init() {
    try {
      // read persisted settings (GM preferred, fallback to localStorage)
      const savedCollapsed = await getStored(COLLAPSED_KEY, null);
      const savedCount = await getStored(CANDLE_KEY, null);
      try {
        if (savedCount !== null && !isNaN(Number(savedCount))) selectedCandleCount = Number(savedCount);
      } catch (e) {}
      // If COLLAPSED_KEY not present, we keep default true for compatibility with prior behavior,
      // but you can change the default to false here if you prefer expanded by default.
      const collapsedDefault = (savedCollapsed === null) ? true : (Number(savedCollapsed) === 1 || savedCollapsed === true || String(savedCollapsed) === '1');

      // build DOM AFTER reading storage so initial state matches persisted state (no flicker)
      container = document.createElement('div');
      container.id = 'btc-widget';
      if (collapsedDefault) container.classList.add('collapsed');

      container.innerHTML = `
        <div id="btc-header" title="拖拽移动 / 双击切换深色">
          <div class="left">
            <div id="btc-symbol">BTC / USDT</div>
            <div id="btc-price">--</div>
            <div id="btc-pct" style="display:none">--</div>
          </div>
          <div id="btc-controls">
            <button class="btc-btn" data-interval="1m">分</button>
            <button class="btc-btn" data-interval="1h">时</button>
            <button class="btc-btn" data-interval="1d">天</button>
            <button id="btc-toggle" title="折叠">+</button>
          </div>
        </div>
        <div id="btc-chart-wrap">
          <canvas id="btc-canvas" width="${WIDTH - 16}" height="140"></canvas>
          <div id="btc-minimap">数据来源：-- · 更新时间：--</div>
          <div id="btc-error" style="display:none"></div>
        </div>
        <div id="btc-footer">
          <div id="btc-range">点数: --</div>
          <div id="btc-counts" aria-label="点数选择">
            <button class="count-btn" data-count="50">50</button>
            <button class="count-btn" data-count="100">100</button>
            <button class="count-btn" data-count="200">200</button>
          </div>
          <div id="btc-note">刷新：自动</div>
        </div>
      `;
      document.body.appendChild(container);

      tooltip = document.createElement('div');
      tooltip.id = 'btc-price-tooltip';
      document.body.appendChild(tooltip);

      // assign canvas & ctx AFTER DOM created
      canvas = document.getElementById('btc-canvas');
      ctx = canvas ? canvas.getContext('2d') : null;

      // UI init
      document.querySelectorAll('.btc-btn').forEach(b => {
        b.style.fontWeight = b.getAttribute('data-interval') === currentInterval ? '700' : '400';
      });
      refreshCountButtonsUI();
      fitCanvasToDisplaySize();
      bindEvents();
      startTimers();

      try {
        const userProxy = await getStored(PROXY_KEY, '');
        if (!userProxy) {
          console.info('如遇数据获取失败，可在控制台执行：localStorage.setItem("btc_widget_proxy", "https://api.allorigins.win/raw?url=") 并刷新页面。');
        }
      } catch (e) {}
    } catch (e) {
      setError('初始化失败：' + (e && e.message ? e.message : String(e)));
      console.error('BTC widget init error', e);
    }
  })();

  window.addEventListener('beforeunload', () => stopTimers());

})();

// ==UserScript==
// @name         EDGAR ↔ Yahoo Finance Bridge
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Floating Action Button that jumps between Yahoo Finance quote pages and SEC EDGAR browse pages, using the official company_tickers.json.
// @author       vacuity
// @license      MIT
// @match        https://finance.yahoo.com/quote/*
// @match        https://www.sec.gov/edgar/browse/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      sec.gov
// @connect      www.sec.gov
// @downloadURL https://update.greasyfork.org/scripts/555670/EDGAR%20%E2%86%94%20Yahoo%20Finance%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/555670/EDGAR%20%E2%86%94%20Yahoo%20Finance%20Bridge.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------------------------------
  // Constants & Utilities
  // ------------------------------
  const SEC_JSON_URL = 'https://www.sec.gov/files/company_tickers.json';
  const STORAGE_KEY = 'sec_company_tickers_v1';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  const isYahoo = location.hostname.endsWith('yahoo.com') && location.pathname.includes('/quote/');
  const isEdgar = location.hostname.endsWith('sec.gov') && location.pathname.startsWith('/edgar/browse/');

  if (!isYahoo && !isEdgar) return; // Defensive: only run on the two target sites.

  // Minimal FAB CSS — high z-index; left-bottom; subtle shadow; accessible contrast.
  GM_addStyle(`
    .yf-edgar-fab {
      position: fixed;
      left: 18px;
      bottom: 18px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #5b6ef5; /* accessible indigo */
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font: 600 13px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.22);
      z-index: 2147483647; /* above site chrome */
      user-select: none;
      opacity: 0.96;
      transition: transform .12s ease, opacity .2s ease, background-color .2s ease;
    }
    .yf-edgar-fab:hover { transform: translateY(-1px); opacity: 1; }
    .yf-edgar-fab:active { transform: translateY(0); }
    .yf-edgar-fab[aria-disabled="true"] { background:#9aa0ff; cursor: default; }
    .yf-edgar-fab .label { pointer-events:none; text-align:center; }
    .yf-edgar-fab .spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.45); border-top-color: #fff;
      animation: yf-edgar-spin 0.9s linear infinite;
    }
    @keyframes yf-edgar-spin { to { transform: rotate(360deg); } }
  `);

  // ------------------------------
  // Mapping: Fetch + Cache
  // ------------------------------
  async function getSecMapping() {
    const cached = await GM.getValue(STORAGE_KEY, null);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.ts && (Date.now() - parsed.ts) < CACHE_TTL_MS && parsed.rawJson) {
          const mapsFresh = buildMaps(parsed.rawJson);
          if (mapsFresh) return mapsFresh;
        }
      } catch (e) {
        // ignore
      }
    }

    const rawJson = await fetchSecJson();
    if (rawJson) {
      const maps = buildMaps(rawJson);
      if (maps) {
        await GM.setValue(STORAGE_KEY, JSON.stringify({ ts: Date.now(), rawJson: rawJson }));
        return maps;
      }
    }

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.rawJson) {
          const mapsStale = buildMaps(parsed.rawJson);
          if (mapsStale) return mapsStale;
        }
      } catch (e) {
        // ignore
      }
    }

    return { byTicker: new Map(), byCik: new Map() };
  }

  function fetchSecJson() {
    return new Promise(function (resolve) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: SEC_JSON_URL,
        headers: { 'Accept': 'application/json' },
        onload: function (res) {
          if (res.status === 200 && res.responseText) {
            try {
              JSON.parse(res.responseText);
              resolve(res.responseText);
            } catch (e) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        onerror: function () { resolve(null); },
        ontimeout: function () { resolve(null); },
        timeout: 10000
      });
    });
  }

  function buildMaps(rawJson) {
    var data;
    try {
      data = JSON.parse(rawJson);
    } catch (e) {
      return null;
    }

    var byTicker = new Map();
    var byCik = new Map();

    for (var k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
      var entry = data[k];
      if (!entry || typeof entry.ticker !== 'string' || entry.cik_str == null) continue;

      var secTicker = String(entry.ticker).toUpperCase().trim();
      var cikStr = String(entry.cik_str).replace(/^0+/, '');

      if (!byCik.has(cikStr)) byCik.set(cikStr, { ticker: secTicker, cik_str: cikStr });

      var secForm = secTicker; // e.g., BRK.B
      var yahooForm = secTicker.replace(/\./g, '-'); // e.g., BRK-B

      if (!byTicker.has(secForm)) byTicker.set(secForm, { ticker: secTicker, cik_str: cikStr });
      if (!byTicker.has(yahooForm)) byTicker.set(yahooForm, { ticker: secTicker, cik_str: cikStr });
    }

    return { byTicker: byTicker, byCik: byCik };
  }

  // ------------------------------
  // URL helpers
  // ------------------------------
  function getYahooTickerFromUrl(url) {
    try {
      var u = new URL(url, location.origin);
      var segs = u.pathname.split('/').filter(Boolean);
      var i = segs.indexOf('quote');
      var t = (i >= 0 && segs[i + 1]) ? segs[i + 1] : '';
      if (!t) t = u.searchParams.get('p') || '';
      t = decodeURIComponent(t);

      // Hide FAB for indices (^GSPC), futures (/=F), FX (USDJPY=X), or foreign suffix (.TO, .L etc.)
      if (!t || /^(\^|.*=|.*\.[A-Z]{1,4}$)/.test(t)) return '';
      return t.toUpperCase();
    } catch (e) {
      return '';
    }
  }

  function getCikFromEdgarUrl(url) {
    try {
      var u = new URL(url, location.origin);
      var val = u.searchParams.get('CIK') || u.searchParams.get('cik') || '';
      return String(val).trim().replace(/^0+/, '');
    } catch (e) {
      return '';
    }
  }

  // ------------------------------
  // FAB setup (single persistent button)
  // ------------------------------
  var fab = createFab(isYahoo ? 'EDGAR' : 'YF');
  document.documentElement.appendChild(fab);
  setFabBusy(true);

  var mapsPromise = getSecMapping();
  var lastUrl = location.href;

  // One stable click listener; target URL is stored in data-target.
  fab.addEventListener('click', function (ev) {
    var disabled = fab.getAttribute('aria-disabled') === 'true';
    if (disabled) return;
    var target = fab.getAttribute('data-target') || '';
    if (target) {
      window.open(target, '_blank', 'noopener');
    }
  }, { passive: true });

  resolveAndWire();

  // Handle SPA changes on Yahoo (and any URL change on SEC)
  window.addEventListener('popstate', onUrlMaybeChanged, true);
  var urlCheckTimer = setInterval(onUrlMaybeChanged, 800);

  function onUrlMaybeChanged() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      resolveAndWire();
    }
  }

  async function resolveAndWire() {
    setFabBusy(true);

    var maps = await mapsPromise;
    var target = '';

    if (isYahoo) {
      var t = getYahooTickerFromUrl(location.href);
      if (t && maps.byTicker.has(t)) {
        var item = maps.byTicker.get(t);
        target = 'https://www.sec.gov/edgar/browse/?CIK=' + encodeURIComponent(item.cik_str);
      }
    } else if (isEdgar) {
      var cik = getCikFromEdgarUrl(location.href);
      if (cik && maps.byCik.has(cik)) {
        var entry = maps.byCik.get(cik);
        var yfTicker = entry.ticker.replace(/\./g, '-');
        target = 'https://finance.yahoo.com/quote/' + encodeURIComponent(yfTicker);
      }
    }

    if (!target) {
      hideFab();
      return;
    }

    showFab();
    fab.setAttribute('data-target', target);
    setFabBusy(false);
  }

  // ------------------------------
  // FAB UI helpers
  // ------------------------------
  function createFab(label) {
    var btn = document.createElement('button');
    btn.className = 'yf-edgar-fab';
    btn.type = 'button';
    btn.setAttribute('title', isYahoo ? 'Open SEC EDGAR' : 'Open Yahoo Finance');
    btn.setAttribute('aria-disabled', 'true');
    btn.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
    return btn;
  }

  function setFabBusy(busy) {
    if (busy) {
      fab.setAttribute('aria-disabled', 'true');
      if (!fab.querySelector('.spinner')) {
        fab.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
      }
    } else {
      fab.setAttribute('aria-disabled', 'false');
      fab.innerHTML = '<div class="label">' + (isYahoo ? 'EDGAR' : 'YF') + '</div>';
    }
  }

  function hideFab() {
    fab.style.display = 'none';
    fab.removeAttribute('data-target');
  }

  function showFab() {
    fab.style.display = 'flex';
  }
})();

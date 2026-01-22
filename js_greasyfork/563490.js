// ==UserScript==
// @name         Recent Trade Monitor
// @namespace    coda.xsyphon.monitor
// @version      0.5.2
// @description  Monitor "Recent Trades" on /exposure. Rule-based alerts with percentage deviation from market price. Supports multiple accounts and account types. Manual acknowledge. SPA-safe with throttled observer. Sidebar UI.
// @author       CODA
// @match        https://portal.xsyphon.com/exposure*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  /********************************************************************
   * CONFIG (edit here)
   ********************************************************************/
  const CONFIG = {
    // --- Monitor enable ---
    ENABLED_BY_DEFAULT: true,

    // --- Market price polling (NEW) ---
    MARKET_PRICE_POLL_INTERVAL_MS: 10 * 1000,  // 10 seconds
    PRICE_DEVIATION_THRESHOLD_PERCENT: 1,      // 1% deviation triggers alert

// --- Rule engine (UI configurable, persisted in localStorage) ---
// If no saved rules exist, a default emergency rule is created automatically:
//   Account: FTWW0002 (CUSTOMER), Symbol: XAUUSD, Open Price > 5000, STP: ANY
RULES_STORAGE_KEY: 'recent-trade-monitor-rules-v1',
DEFAULT_RULES: [
  {
    id: 'rule-1',
    name: 'Emergency Gold Spike',
    enabled: true,
    accountMode: 'exact',     // exact | contains | regex
    accountValue: 'FTWW0002',
    symbol: 'XAUUSD',
    priceOp: '>',
    priceValue: 5000,
    // null => ANY, true => only STP=true, false => only STP=false
    isStp: null,
    // NEW: use percentage-based price check instead of fixed value
    usePriceDeviation: true,  // if true, ignore priceOp/priceValue, use market price ± threshold
  }
],

// --- Polling fallback ---
    POLL_INTERVAL_MS: 5 * 60 * 1000,

    // --- Auto scan throttling (CRITICAL to avoid freeze) ---
    AUTO_SCAN_MIN_INTERVAL_MS: 2000,   // auto triggers at most once per 2s
    AUTO_SCAN_DEBOUNCE_MS: 350,        // small debounce window for bursts

    // --- Rule: account match ---
    TARGET_ACCOUNTS: ['MAHE0001'], // staging test
    ACCOUNT_MATCH_MODE: 'exact',    // exact | contains | regex

    // --- Rule: STP ---
    // true  => alert only when Is STP is true
    // false => alert only when Is STP is false
    // null  => ignore Is STP
    IS_STP_REQUIRED_VALUE: true,   // staging test

    // --- Rule: trade size (qty) ---
    TRADE_SIZE_RULE: {
      ENABLED: false,
      OP: '>=', // >, >=, ==, <=, <
      VALUE: 0,
    },

    // --- Table location ---
    TABLE_SECTION_TITLE: 'Recent Trades',

    // --- Alert behavior ---
    SOUND_ENABLED: true,
    SOUND_PATTERN: { beepMs: 220, silenceMs: 180, frequencyHz: 880, gain: 0.12 },

    // --- History / Dedupe ---
    DEDUPE_MAX_KEYS: 2000,
    RECENT_ALERTS_MAX: 12,

    // --- Sidebar UI ---
    UI: {
      SIDE: 'right',             // 'right' or 'left'
      COLLAPSED_BY_DEFAULT: true,
      WIDTH_PX: 380,
      TAB_WIDTH_PX: 44,
      TOP_PX: 88,
      Z_INDEX: 300000,
    }
  };

  /********************************************************************
   * Helpers
   ********************************************************************/
  const normalizeText = (s) => (s ?? '').toString().replace(/\s+/g, ' ').trim();
  const safeLower = (s) => normalizeText(s).toLowerCase();

  function isTrueText(s) {
    const v = safeLower(s);
    return v === 'true' || v === 'yes' || v === 'y' || v === '1';
  }

  function parseNumberLoose(s) {
    const t = normalizeText(s);
    if (!t) return NaN;
    const cleaned = t.replace(/,/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }

  function compare(op, a, b) {
    switch (op) {
      case '>': return a > b;
      case '>=': return a >= b;
      case '==': return a === b;
      case '<=': return a <= b;
      case '<': return a < b;
      default: return false;
    }
  }

  function debounce(fn, waitMs) {
    let t = null;
    return (...args) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), waitMs);
    };
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'style' && v && typeof v === 'object') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, String(v));
    }
    for (const child of children) {
      if (child === null || child === undefined) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function formatShortISO(iso) {
    if (!iso) return '-';
    return iso.replace('T', ' ').replace('Z', 'Z');
  }

  function buildAlertTitle() {
  const ruleName = LAST_HIT_RULE_NAME ? `Rule: ${LAST_HIT_RULE_NAME}` : 'Rule hit';
  return `Recent Trade Monitor Alert! (${ruleName})`;
}


/********************************************************************
 * Rule engine (persisted)
 ********************************************************************/
function loadRules() {
  try {
    const raw = localStorage.getItem(CONFIG.RULES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveRules(rules) {
  try {
    localStorage.setItem(CONFIG.RULES_STORAGE_KEY, JSON.stringify(rules));
  } catch {}
}

function normalizeRule(r) {
  const rr = { ...(r || {}) };
  rr.id = normalizeText(rr.id) || `rule-${Math.random().toString(16).slice(2)}`;
  rr.name = normalizeText(rr.name) || rr.id;
  rr.enabled = !!rr.enabled;
  rr.accountMode = rr.accountMode || 'exact';
  rr.accountValue = normalizeText(rr.accountValue);
  rr.symbol = normalizeText(rr.symbol).toUpperCase();
  rr.priceOp = rr.priceOp || '>';
  rr.priceValue = Number(rr.priceValue);
  rr.isStp = (rr.isStp === true) ? true : (rr.isStp === false) ? false : null;
  rr.usePriceDeviation = (rr.usePriceDeviation === undefined) ? true : !!rr.usePriceDeviation;  // NEW: default true
  return rr;
}

function ensureRulesInitialized() {
  const existing = loadRules();
  if (existing && existing.length) {
    return existing.map(normalizeRule);
  }
  const defaults = (CONFIG.DEFAULT_RULES || []).map(normalizeRule);
  saveRules(defaults);
  return defaults;
}

let RULES = ensureRulesInitialized();
let LAST_HIT_RULE_NAME = null;

/********************************************************************
   * Account match logic
   ********************************************************************/
  function accountMatches(accountText) {
    const acct = normalizeText(accountText);
    if (!acct) return false;

    const mode = CONFIG.ACCOUNT_MATCH_MODE;
    const targets = (CONFIG.TARGET_ACCOUNTS || []).map(normalizeText).filter(Boolean);
    if (!targets.length) return false;

    if (mode === 'exact') return targets.some(t => safeLower(t) === safeLower(acct));
    if (mode === 'contains') {
      const a = safeLower(acct);
      return targets.some(t => a.includes(safeLower(t)));
    }
    if (mode === 'regex') {
      return targets.some(pattern => {
        try { return new RegExp(pattern).test(acct); } catch { return false; }
      });
    }
    return false;
  }

  function stpMatches(isSTPText) {
    const required = CONFIG.IS_STP_REQUIRED_VALUE; // true/false/null
    if (required === null || required === undefined) return true;
    const actual = isTrueText(isSTPText);
    return actual === required;
  }


function accountMatchesForRule(accountText, rule) {
  const acct = normalizeText(accountText);
  if (!acct) return false;
  
  const mode = rule.accountMode || 'exact';
  
  // NEW: All accounts mode
  if (mode === 'all') return true;
  
  // NEW: All CUSTOMER accounts mode
  if (mode === 'all-customer') {
    // Need to check account_type from the trade data
    // This will be handled in matchesRule function
    return true; // Placeholder, actual check happens in matchesRule
  }
  
  const targetValue = normalizeText(rule.accountValue);
  if (!targetValue) return false;

  // Split by comma to support multiple accounts
  const targets = targetValue.split(',').map(t => normalizeText(t)).filter(Boolean);
  if (!targets.length) return false;

  // Check if any of the targets match
  for (const target of targets) {
    if (mode === 'exact' && safeLower(target) === safeLower(acct)) return true;
    if (mode === 'contains' && safeLower(acct).includes(safeLower(target))) return true;
    if (mode === 'regex') {
      try { 
        if (new RegExp(target).test(acct)) return true;
      } catch { 
        // Invalid regex, skip
      }
    }
  }
  
  return false;
}

function symbolMatchesForRule(symbolText, rule) {
  const s = normalizeText(symbolText).toUpperCase();
  const target = normalizeText(rule.symbol).toUpperCase();
  if (!target) return false;
  return s === target;
}

function stpMatchesForRule(isSTPText, rule) {
  const required = (rule && (rule.isStp === true || rule.isStp === false)) ? rule.isStp : null;
  if (required === null) return true;
  const actual = isTrueText(isSTPText);
  return actual === required;
}

function priceMatchesForRule(openPriceText, rule, tradeSymbol) {
  const n = parseNumberLoose(openPriceText);
  if (!Number.isFinite(n)) return false;

  // NEW: percentage-based deviation check
  if (rule.usePriceDeviation) {
    const marketPrice = STATE.marketPrices[tradeSymbol];
    if (!marketPrice || !Number.isFinite(marketPrice)) {
      // No market price available, fallback to old logic
      const threshold = Number(rule.priceValue);
      if (!Number.isFinite(threshold)) return false;
      return compare(rule.priceOp, n, threshold);
    }

    const deviationPercent = Math.abs((n - marketPrice) / marketPrice) * 100;
    const thresholdPercent = CONFIG.PRICE_DEVIATION_THRESHOLD_PERCENT;
    return deviationPercent > thresholdPercent;
  }

  // OLD: fixed price threshold
  const threshold = Number(rule.priceValue);
  if (!Number.isFinite(threshold)) return false;
  return compare(rule.priceOp, n, threshold);
}


  /********************************************************************
   * Market price polling (NEW)
   ********************************************************************/
  function updateMarketPrices() {
    try {
      // Step 1: Find the price table by looking for thead with Symbol/Bid/Ask headers
      let priceTableBody = null;
      const tables = document.querySelectorAll('table');
      
      for (const table of tables) {
        const headers = [...table.querySelectorAll('thead th')].map(th => normalizeText(th.textContent));
        // Check if this table has the exact headers we need
        if (headers.includes('Symbol') && headers.includes('Bid') && headers.includes('Ask')) {
          // Found the header table, now find the corresponding body table
          // It's in the next sibling div with class 'n-scrollbar'
          const container = table.closest('.flex-1.flex.flex-col.overflow-auto');
          if (container) {
            priceTableBody = container.querySelector('.n-scrollbar-content tbody');
          }
          break;
        }
      }

      // Fallback: if we can't find by headers, try the old method
      if (!priceTableBody) {
        const rows = document.querySelectorAll('tr[data-draggable="true"]');
        if (rows.length === 0) return;
        
        // Verify first row has 3 cells (Symbol, Bid, Ask)
        const firstRow = rows[0];
        const cells = firstRow.querySelectorAll('td');
        if (cells.length < 3) return;
        
        // Extract prices using old method
        const prices = {};
        for (const row of rows) {
          const cells = row.querySelectorAll('td');
          if (cells.length < 3) continue;

          const symbolCell = cells[0];
          const symbolText = symbolCell.textContent.trim().split(/\s+/)[0];
          if (!symbolText) continue;

          const bidText = cells[1]?.textContent.trim();
          const askText = cells[2]?.textContent.trim();

          const bid = parseNumberLoose(bidText);
          const ask = parseNumberLoose(askText);

          if (Number.isFinite(bid) && Number.isFinite(ask)) {
            prices[symbolText] = (bid + ask) / 2;
          }
        }

        STATE.marketPrices = prices;
        STATE.lastMarketPriceUpdate = nowISO();
        return;
      }

      // Step 2: Extract prices from the verified table body
      const prices = {};
      const rows = priceTableBody.querySelectorAll('tr[data-draggable="true"]');
      
      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) continue;

        // Extract symbol (first cell, text only, ignore SVG icons)
        const symbolCell = cells[0];
        const symbolText = symbolCell.textContent.trim().split(/\s+/)[0]; // Get first word
        if (!symbolText) continue;

        // Extract bid and ask (second and third cells)
        const bidText = cells[1]?.textContent.trim();
        const askText = cells[2]?.textContent.trim();

        const bid = parseNumberLoose(bidText);
        const ask = parseNumberLoose(askText);

        if (Number.isFinite(bid) && Number.isFinite(ask)) {
          prices[symbolText] = (bid + ask) / 2;  // Mid price
        }
      }

      STATE.marketPrices = prices;
      STATE.lastMarketPriceUpdate = nowISO();
      
      // Log success for debugging (can be removed in production)
      if (Object.keys(prices).length > 0) {
        console.log(`[Recent Trade Monitor] Updated ${Object.keys(prices).length} market prices`);
      }
    } catch (e) {
      console.warn('[Recent Trade Monitor] Failed to update market prices:', e);
      STATE.lastError = 'Market price update failed';
    }
  }

  /********************************************************************
   * Find Recent Trades table root
   ********************************************************************/
  function findRecentTradesTableRoot() {
    const wanted = safeLower(CONFIG.TABLE_SECTION_TITLE);

    const candidates = [...document.querySelectorAll('h1,h2,h3,h4,div,span')]
      .filter(n => safeLower(n.textContent) === wanted);

    for (const header of candidates) {
      let p = header;
      for (let i = 0; i < 6 && p; i++) {
        const table = p.querySelector?.('.n-data-table');
        if (table) return table;
        p = p.parentElement;
      }

      const parent = header.parentElement;
      if (parent) {
        let sib = parent.nextElementSibling;
        for (let i = 0; i < 6 && sib; i++) {
          const table = sib.querySelector?.('.n-data-table');
          if (table) return table;
          sib = sib.nextElementSibling;
        }
      }
    }

    const allTables = [...document.querySelectorAll('.n-data-table')];
    if (allTables.length === 1) return allTables[0];

    return null;
  }

  function extractTradesFromTable(tableRoot) {
    const tbody = tableRoot.querySelector('tbody.n-data-table-tbody');
    if (!tbody) return [];

    const rows = [...tbody.querySelectorAll('tr.n-data-table-tr')];
    const trades = [];

    for (const tr of rows) {
      const get = (colKey) => {
        const td = tr.querySelector(`td[data-col-key="${colKey}"]`);
        return td ? normalizeText(td.textContent) : '';
      };

      const t = {
        time: get('timestamp'),
        accountType: get('account_type'),
        account: get('account'),
        symbol: get('symbol'),
        tradeSizeText: get('volume'),
        side: get('side'),
        openPrice: get('price'),
        counterParty: get('counter_party_account_id'),
        clientOrderId: get('cl_ord_id'),
        initiator: get('initiator'),
        isSTPText: get('is_stped'),
      };

      const hasAny = Object.values(t).some(v => normalizeText(v) !== '');
      if (hasAny) trades.push(t);
    }

    return trades;
  }

  function tradeKey(t) {
    return [
      t.time || '',
      t.clientOrderId || '',
      t.accountType || '',
      t.account || '',
      t.symbol || '',
      t.side || ''
    ].join('|');
  }

  function matchesRule(t) {
  // Rule engine: ANY enabled rule match triggers an alert.
  // (Legacy CONFIG fields remain in file but are not used for matching.)
  for (const r0 of (RULES || [])) {
    const r = normalizeRule(r0);
    if (!r.enabled) continue;
    
    // NEW: Handle special account modes
    const accountMode = r.accountMode || 'exact';
    if (accountMode === 'all-customer') {
      // Only match CUSTOMER account type
      if (safeLower(t.accountType) !== 'customer') continue;
    } else if (accountMode !== 'all') {
      // For specific account modes, check account name
      if (!accountMatchesForRule(t.account, r)) continue;
    }
    // If mode is 'all', skip account check (matches everything)
    
    if (!symbolMatchesForRule(t.symbol, r)) continue;
    if (!priceMatchesForRule(t.openPrice, r, t.symbol)) continue;  // NEW: pass symbol
    if (!stpMatchesForRule(t.isSTPText, r)) continue;

    // Optional: still honor legacy trade size rule if enabled (keeps parity with older usage)
    if (CONFIG.TRADE_SIZE_RULE?.ENABLED) {
      const qty = parseNumberLoose(t.tradeSizeText);
      if (!Number.isFinite(qty)) continue;
      if (!compare(CONFIG.TRADE_SIZE_RULE.OP, qty, CONFIG.TRADE_SIZE_RULE.VALUE)) continue;
    }

    LAST_HIT_RULE_NAME = r.name || r.id;
    return true;
  }
  return false;
}

  /********************************************************************
   * UI styles
   ********************************************************************/
  const UI = {
    bg: '#FFF4B8',
    panel: '#FFF4B8',
    border: '#000000',
    text: '#000000',
    muted: '#333333',
    shadow: '0 12px 36px rgba(0,0,0,0.45)',
  };

  function btnStyle(kind = 'default') {
    const base = {
      background: UI.bg,
      border: `2px solid ${UI.border}`,
      color: UI.text,
      borderRadius: '10px',
      padding: '8px 10px',
      fontSize: '12px',
      cursor: 'pointer',
      userSelect: 'none',
      fontWeight: '900',
      lineHeight: '1',
      minWidth: '64px',
      textAlign: 'center',
    };
    if (kind === 'danger') return { ...base, background: '#FFD1D1' };
    if (kind === 'ok') return { ...base, background: '#D9FFD9' };
    return base;
  }

  /********************************************************************
   * State
   ********************************************************************/
  let sidebar = null;
  let sidebarCollapsed = !!CONFIG.UI.COLLAPSED_BY_DEFAULT;
  let monitorEnabled = CONFIG.ENABLED_BY_DEFAULT;

  const STATE = {
    lastScanAt: null,
    lastHitAt: null,
    lastHitCount: 0,
    lastError: null,
    seenKeys: new Set(),
    recentAlerts: [],
    marketPrices: {},  // NEW: { symbol: midPrice }
    lastMarketPriceUpdate: null,
    // UI state
    sectionCollapsed: {
      rule: false,
      stats: false,
    },
  };

  // Prevent observer feedback loops while we update our own UI
  let UI_UPDATING = false;

  /********************************************************************
   * Toast (ONLY for manual/explicit actions)
   ********************************************************************/
  let toastNode = null;
  let toastTimer = null;

  function toast(msg) {
    UI_UPDATING = true;
    try {
      if (!toastNode || !document.body.contains(toastNode)) {
        toastNode = el('div', {
          id: 'coda-toast',
          style: {
            position: 'fixed',
            right: '14px',
            top: '52px',
            zIndex: String(CONFIG.UI.Z_INDEX + 3000),
            background: UI.bg,
            color: UI.text,
            border: `2px solid ${UI.border}`,
            borderRadius: '12px',
            padding: '8px 10px',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '12px',
            fontWeight: '900',
            boxShadow: UI.shadow,
            maxWidth: '520px',
            opacity: '0',
            transition: 'opacity 160ms ease',
          }
        }, ['']);
        document.body.appendChild(toastNode);
      }
      toastNode.textContent = msg;
      toastNode.style.opacity = '1';
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        if (toastNode) toastNode.style.opacity = '0';
      }, 1400);
    } finally {
      // small delay so observer sees stable state
      setTimeout(() => { UI_UPDATING = false; }, 50);
    }
  }

  /********************************************************************
   * Alerts list
   ********************************************************************/
  function formatAlertLine(a) {
  return [
    a.detectedAt,
    a.ruleName ? `rule=${a.ruleName}` : '',
    a.account,
    a.symbol || '-',
    a.side || '-',
    `qty=${a.tradeSizeText || '-'}`,
    `px=${a.openPrice || '-'}`,
    `stp=${a.isSTPText || '-'}`,
    a.clientOrderId ? `id=${a.clientOrderId}` : ''
  ].filter(Boolean).join(' | ');
}

  function getRecentAlertsText() {
    const list = STATE.recentAlerts || [];
    const max = CONFIG.RECENT_ALERTS_MAX;
    return list.slice(0, max).map(formatAlertLine).join('\n');
  }

  function getStatusTextForCopy() {
    return [
      'Recent Trade Monitor Status',
      `Captured: ${nowISO()}`,
      `Enabled: ${monitorEnabled}`,
      `Accounts: ${JSON.stringify(CONFIG.TARGET_ACCOUNTS)}`,
      `Account match: ${CONFIG.ACCOUNT_MATCH_MODE}`,
      `Is STP required value: ${CONFIG.IS_STP_REQUIRED_VALUE === null ? 'ANY' : CONFIG.IS_STP_REQUIRED_VALUE}`,
      `Trade size rule: ${CONFIG.TRADE_SIZE_RULE?.ENABLED ? `${CONFIG.TRADE_SIZE_RULE.OP} ${CONFIG.TRADE_SIZE_RULE.VALUE}` : 'DISABLED'}`,
      `Poll interval (ms): ${CONFIG.POLL_INTERVAL_MS}`,
      `Last scan: ${STATE.lastScanAt || '-'}`,
      `Last hit: ${STATE.lastHitAt || '-'}`,
      `Last hit count: ${STATE.lastHitCount || 0}`,
      STATE.lastError ? `Error: ${STATE.lastError}` : '',
      '',
      'Recent Alerts:',
      getRecentAlertsText() || '(none)',
    ].filter(Boolean).join('\n');
  }

  /********************************************************************
   * Sidebar UI
   ********************************************************************/
  function ensureSidebar() {
    if (sidebar && document.body.contains(sidebar)) return;

    UI_UPDATING = true;
    try {
      const side = (CONFIG.UI.SIDE === 'left') ? 'left' : 'right';
      const width = Math.max(280, CONFIG.UI.WIDTH_PX | 0);
      const tabW = Math.max(34, CONFIG.UI.TAB_WIDTH_PX | 0);

      sidebar = el('div', {
        id: 'coda-stp-sidebar',
        style: {
          position: 'fixed',
          top: `${CONFIG.UI.TOP_PX}px`,
          [side]: '0px',
          zIndex: String(CONFIG.UI.Z_INDEX),
          width: `${sidebarCollapsed ? tabW : width}px`,
          transition: 'width 180ms ease',
          background: UI.bg,
          color: UI.text,
          border: `2px solid ${UI.border}`,
          borderRight: side === 'left' ? `2px solid ${UI.border}` : 'none',
          borderLeft: side === 'right' ? `2px solid ${UI.border}` : 'none',
          borderRadius: side === 'right' ? '14px 0 0 14px' : '0 14px 14px 0',
          boxShadow: UI.shadow,
          fontFamily: 'Arial, Helvetica, sans-serif',
          overflow: 'hidden',
        }
      });

      const tab = el('div', {
        id: 'coda-stp-tab',
        style: {
          width: `${tabW}px`,
          height: '100%',
          minHeight: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: side === 'right' ? `2px solid ${UI.border}` : 'none',
          borderLeft: side === 'left' ? `2px solid ${UI.border}` : 'none',
          cursor: 'pointer',
          userSelect: 'none',
          background: UI.bg,
        },
        onclick: () => {
          sidebarCollapsed = !sidebarCollapsed;
          applySidebarWidth();
          renderSidebar();
          installAudioGestureUnlock();
        }
      }, [
        el('div', {
          style: {
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontWeight: '900',
            letterSpacing: '2px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
          }
        }, ['Recent Trades'])
      ]);

      const content = el('div', {
        id: 'coda-stp-content',
        style: {
          display: sidebarCollapsed ? 'none' : 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'hidden',
        }
      });

      const header = el('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '10px 12px',
          borderBottom: `2px solid ${UI.border}`,
          flexShrink: '0',
        }
      }, [
        el('div', { style: { fontSize: '14px', fontWeight: '900' } }, ['Recent Trade Monitor']),
        el('div', { style: { display: 'flex', gap: '8px' } }, [
          el('button', {
            id: 'coda-btn-toggle',
            style: btnStyle('ok'),
            onclick: (e) => { e.stopPropagation(); monitorEnabled = !monitorEnabled; renderSidebar(); }
          }, ['']),
          el('button', {
            id: 'coda-btn-scan',
            style: btnStyle(),
            onclick: (e) => { e.stopPropagation(); scanNow('manual', true); }
          }, ['Scan']),
        ])
      ]);

      const audioBar = el('div', {
        id: 'coda-audio-bar',
        style: {
          display: 'none',
          border: `2px solid ${UI.border}`,
          borderRadius: '12px',
          background: '#FFFBE3',
          padding: '8px 10px',
          margin: '10px 12px 0',
          flexShrink: '0',
        }
      }, []);

      const scrollableContent = el('div', {
        style: {
          flex: '1',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px 12px',
        }
      }, [
        el('div', { id: 'coda-content-wrap' }, []),
      ]);

      const actions = el('div', { 
        style: { 
          padding: '10px 12px',
          borderTop: `2px solid ${UI.border}`,
          display: 'flex', 
          gap: '8px', 
          flexWrap: 'wrap',
          flexShrink: '0',
        } 
      }, [
        el('button', {
          style: btnStyle(),
          onclick: () => { showRulesModal(); }
        }, ['Rules']),
        el('button', {
          style: btnStyle(),
          onclick: async () => {
            try { await navigator.clipboard.writeText(getStatusTextForCopy()); toast('Copied status'); }
            catch { toast('Copy failed'); }
          }
        }, ['Copy Status']),
        el('button', {
          style: btnStyle(),
          onclick: () => {
            STATE.recentAlerts = [];
            STATE.lastHitCount = 0;
            hideAlert();
            renderSidebar();
            installAudioGestureUnlock();
            toast('Cleared');
          }
        }, ['Clear']),
        el('button', {
          style: btnStyle(),
          onclick: () => {
            if (STATE.recentAlerts.length) showAlert();
            else toast('No alerts yet');
          }
        }, ['Show Alerts'])
      ]);

      const recent = el('div', { 
        style: { 
          padding: '0 12px 10px',
          flexShrink: '0',
        } 
      }, [
        el('div', { style: { fontSize: '12px', fontWeight: '900', marginBottom: '6px' } }, ['🔔 Recent Alerts']),
        el('div', {
          id: 'coda-recent',
          style: {
            border: `2px solid ${UI.border}`,
            borderRadius: '12px',
            background: '#FFFBE3',
            padding: '8px 10px',
            fontFamily: 'Consolas, Menlo, monospace',
            fontSize: '11px',
            lineHeight: '1.35',
            maxHeight: '120px',
            overflow: 'auto',
            whiteSpace: 'pre',
          }
        }, ['(none)'])
      ]);

      content.appendChild(header);
      content.appendChild(audioBar);
      content.appendChild(scrollableContent);
      content.appendChild(actions);
      content.appendChild(recent);

      sidebar.appendChild(tab);
      sidebar.appendChild(content);
      document.body.appendChild(sidebar);

      applySidebarWidth();
      renderSidebar();
      installAudioGestureUnlock();
    } finally {
      setTimeout(() => { UI_UPDATING = false; }, 50);
    }
  }

  function applySidebarWidth() {
    if (!sidebar) return;
    const width = Math.max(280, CONFIG.UI.WIDTH_PX | 0);
    const tabW = Math.max(34, CONFIG.UI.TAB_WIDTH_PX | 0);
    sidebar.style.width = `${sidebarCollapsed ? tabW : width}px`;
    const content = sidebar.querySelector('#coda-stp-content');
    if (content) content.style.display = sidebarCollapsed ? 'none' : 'block';
  }

  function buildSidebarSections() {
    const r = (RULES && RULES[0]) ? normalizeRule(RULES[0]) : null;
    const symbol = r ? (r.symbol || '-') : '-';
    const marketPrice = (r && r.symbol && STATE.marketPrices[r.symbol]) 
      ? STATE.marketPrices[r.symbol].toFixed(2) 
      : '-';
    const priceRule = r ? (r.usePriceDeviation ? `±${CONFIG.PRICE_DEVIATION_THRESHOLD_PERCENT}%` : `${r.priceOp} ${r.priceValue}`) : '-';
    
    // NEW: Display account info based on mode
    let accountDisplay = '-';
    if (r) {
      const mode = r.accountMode || 'exact';
      if (mode === 'all') {
        accountDisplay = 'All accounts';
      } else if (mode === 'all-customer') {
        accountDisplay = 'All CUSTOMER';
      } else {
        accountDisplay = r.accountValue || '-';
      }
    }

    return {
      status: {
        enabled: monitorEnabled,
        ruleEnabled: r ? r.enabled : false,
      },
      rule: [
        ['Symbol', symbol],
        ['Price Rule', priceRule],
        ['Market Price', marketPrice],
        ['Account', accountDisplay],
      ],
      stats: [
        ['Last Scan', STATE.lastScanAt ? formatShortISO(STATE.lastScanAt).split(' ')[1].slice(0, 8) : '-'],
        ['Hits', String(STATE.lastHitCount ?? 0)],
        ['Seen Trades', String(STATE.seenKeys.size)],
      ],
      error: STATE.lastError ? String(STATE.lastError) : null,
    };
  }

  function renderSidebar() {
    if (!sidebar) return;

    UI_UPDATING = true;
    try {
      const sections = buildSidebarSections();

      const toggleBtn = sidebar.querySelector('#coda-btn-toggle');
      if (toggleBtn) {
        toggleBtn.textContent = sections.status.enabled ? 'ON' : 'OFF';
        toggleBtn.style.background = sections.status.enabled ? '#D9FFD9' : '#FFD1D1';
      }

      const audioBar = sidebar.querySelector('#coda-audio-bar');
      if (audioBar) {
        const st = getAudioStatus();
        if (st !== 'READY') {
          audioBar.style.display = 'block';
          audioBar.innerHTML = '';
          audioBar.appendChild(el('div', { style: { fontWeight: '900', marginBottom: '4px' } }, ['🔊 ENABLE AUDIO']));
          audioBar.appendChild(el('div', { style: { fontSize: '12px', fontWeight: '900', color: UI.muted, marginBottom: '6px' } },
            ['Audio: BLOCKED. Click once anywhere (or press any key) to unlock audio, or click Enable Audio.']));
          audioBar.appendChild(el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
            el('button', {
              style: btnStyle(),
              onclick: async (e) => {
                e.stopPropagation();
                const ok = await unlockAudio();
                renderSidebar();
                if (!ok) toast('Audio unlock failed');
              }
            }, ['Enable Audio']),
            el('div', { style: { fontWeight: '900' } }, ['Audio: BLOCKED'])
          ]));
        } else {
          audioBar.style.display = 'none';
        }
      }

      const contentWrap = sidebar.querySelector('#coda-content-wrap');
      if (contentWrap) {
        contentWrap.innerHTML = '';

        // Status indicator (big and clear)
        const statusIndicator = el('div', {
          style: {
            padding: '12px',
            background: sections.status.enabled ? '#D9FFD9' : '#FFD1D1',
            border: `2px solid ${UI.border}`,
            borderRadius: '12px',
            marginBottom: '10px',
            textAlign: 'center',
          }
        }, [
          el('div', { style: { fontSize: '16px', fontWeight: '900' } }, [
            sections.status.enabled ? '🟢 Monitor: ON' : '🔴 Monitor: OFF'
          ]),
          el('div', { style: { fontSize: '11px', fontWeight: '900', color: UI.muted, marginTop: '4px' } }, [
            `Rule: ${sections.status.ruleEnabled ? 'ENABLED' : 'DISABLED'}`
          ])
        ]);
        contentWrap.appendChild(statusIndicator);

        // Current Rule section
        const ruleSection = el('div', {
          style: {
            marginBottom: '10px',
            border: `2px solid ${UI.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }
        });

        const ruleHeader = el('div', {
          style: {
            padding: '8px 10px',
            background: '#FFFBE3',
            borderBottom: `2px solid ${UI.border}`,
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          },
          onclick: () => {
            STATE.sectionCollapsed.rule = !STATE.sectionCollapsed.rule;
            renderSidebar();
          }
        }, [STATE.sectionCollapsed.rule ? '▶ Current Rule' : '▼ Current Rule']);

        const ruleBody = el('div', {
          id: 'coda-rule-body',
          style: {
            padding: '8px 10px',
            background: UI.bg,
            display: STATE.sectionCollapsed.rule ? 'none' : 'block',
          }
        });

        const ruleGrid = el('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 8px',
            fontSize: '11px',
          }
        }, sections.rule.flatMap(([k, v]) => [
          el('div', { style: { fontWeight: '900', color: UI.muted } }, [k]),
          el('div', { style: { fontWeight: '900', textAlign: 'right' } }, [v]),
        ]));

        ruleBody.appendChild(ruleGrid);
        ruleSection.appendChild(ruleHeader);
        ruleSection.appendChild(ruleBody);
        contentWrap.appendChild(ruleSection);

        // Statistics section
        const statsSection = el('div', {
          style: {
            marginBottom: '10px',
            border: `2px solid ${UI.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }
        });

        const statsHeader = el('div', {
          style: {
            padding: '8px 10px',
            background: '#FFFBE3',
            borderBottom: `2px solid ${UI.border}`,
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          },
          onclick: () => {
            STATE.sectionCollapsed.stats = !STATE.sectionCollapsed.stats;
            renderSidebar();
          }
        }, [STATE.sectionCollapsed.stats ? '▶ Statistics' : '▼ Statistics']);

        const statsBody = el('div', {
          id: 'coda-stats-body',
          style: {
            padding: '8px 10px',
            background: UI.bg,
            display: STATE.sectionCollapsed.stats ? 'none' : 'block',
          }
        });

        const statsGrid = el('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 8px',
            fontSize: '11px',
          }
        }, sections.stats.flatMap(([k, v]) => [
          el('div', { style: { fontWeight: '900', color: UI.muted } }, [k]),
          el('div', { style: { fontWeight: '900', textAlign: 'right' } }, [v]),
        ]));

        statsBody.appendChild(statsGrid);
        statsSection.appendChild(statsHeader);
        statsSection.appendChild(statsBody);
        contentWrap.appendChild(statsSection);

        // Error display (if any)
        if (sections.error) {
          const errorBox = el('div', {
            style: {
              padding: '8px 10px',
              background: '#FFD1D1',
              border: `2px solid ${UI.border}`,
              borderRadius: '12px',
              marginBottom: '10px',
              fontSize: '11px',
              fontWeight: '900',
            }
          }, ['⚠️ ' + sections.error]);
          contentWrap.appendChild(errorBox);
        }
      }

      const recentBox = sidebar.querySelector('#coda-recent');
      if (recentBox) recentBox.textContent = getRecentAlertsText() || '(none)';
    } finally {
      setTimeout(() => { UI_UPDATING = false; }, 50);
    }
  }

  /********************************************************************
   * Alert overlay + sound (only on trigger)
   ********************************************************************/
  let alertOverlay = null;
  let alertListBox = null;
  let alertTitleNode = null;

  let audioCtx = null;
  let beepTimer = null;
  let isBeeping = false;

  // --- Audio Ready (copied from LP Margin Dashboard alarms logic) ---
  const AUDIO_STATE_KEY = 'recent-trade-monitor-audioState-v1';

  function loadAudioState() {
    try {
      const raw = localStorage.getItem(AUDIO_STATE_KEY);
      return raw ? JSON.parse(raw) : { audioUnlocked: false };
    } catch {
      return { audioUnlocked: false };
    }
  }

  function saveAudioState(partial) {
    try {
      const curr = loadAudioState();
      localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify({ ...curr, ...(partial || {}) }));
    } catch {}
  }

  function getAudioStatus() {
    // Safety-first: audio is only "READY" when we *know* an AudioContext is running.
    if (!audioCtx) return 'BLOCKED';
    return audioCtx.state === 'running' ? 'READY' : 'BLOCKED';
  }

  async function unlockAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state !== 'running') {
        await audioCtx.resume?.();
      }
      saveAudioState({ audioUnlocked: true });
      return audioCtx && audioCtx.state === 'running';
    } catch (e) {
      console.warn('[Recent Trade Monitor] Audio unlock failed:', e);
      return false;
    }
  }

  let __audioGestureUnlockInstalled = false;
  function installAudioGestureUnlock() {
    if (__audioGestureUnlockInstalled) return;
    __audioGestureUnlockInstalled = true;

    const handler = async () => {
      try {
        if (getAudioStatus() === 'READY') { cleanup(); return; }
        const ok = await unlockAudio();
        if (ok) {
          cleanup();
          try { renderSidebar(); } catch (_) {}
        }
      } catch (_) {}
    };

    const cleanup = () => {
      window.removeEventListener('click', handler, true);
      window.removeEventListener('keydown', handler, true);
    };

    // Click anywhere or press any key once to unlock audio.
    window.addEventListener('click', handler, true);
    window.addEventListener('keydown', handler, true);
  }

  async function tryResumeAudio() {
    if (!CONFIG.SOUND_ENABLED) return;
    await unlockAudio();
  }

  function startBeepLoop() {
    if (!CONFIG.SOUND_ENABLED) return;
    if (isBeeping) return;

    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    } catch { return; }

    isBeeping = true;
    const { beepMs, silenceMs, frequencyHz, gain } = CONFIG.SOUND_PATTERN;

    const beepOnce = () => {
      if (!isBeeping || !audioCtx) return;

      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      g.gain.value = gain;

      osc.frequency.value = frequencyHz;
      osc.connect(g);
      g.connect(audioCtx.destination);

      const t0 = audioCtx.currentTime;
      osc.start(t0);
      osc.stop(t0 + beepMs / 1000);

      beepTimer = window.setTimeout(beepOnce, beepMs + silenceMs);
    };

    audioCtx.resume?.().finally(() => beepOnce());
  }

  function stopBeepLoop() {
    isBeeping = false;
    if (beepTimer) { clearTimeout(beepTimer); beepTimer = null; }
  }

  function ensureAlertOverlay() {
    if (alertOverlay && document.body.contains(alertOverlay)) return;

    UI_UPDATING = true;
    try {
      alertOverlay = el('div', {
        id: 'coda-stp-alert-overlay',
        style: {
          position: 'fixed',
          inset: '0',
          zIndex: String(CONFIG.UI.Z_INDEX + 5000),
          background: 'rgba(0,0,0,0.55)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }
      });

      const panel = el('div', {
        style: {
          width: 'min(860px, 96vw)',
          background: UI.panel,
          color: UI.text,
          border: `2px solid ${UI.border}`,
          borderRadius: '14px',
          boxShadow: UI.shadow,
          overflow: 'hidden',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }
      });

      const header = el('div', {
        style: {
          padding: '14px 16px',
          borderBottom: `2px solid ${UI.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }
      });

      const left = el('div', {}, [
        (alertTitleNode = el('div', { style: { fontSize: '16px', fontWeight: '900' } }, [buildAlertTitle()])),
        el('div', { style: { fontSize: '12px', color: UI.muted, marginTop: '6px', fontWeight: '900' } },
          ['Triggered trade(s) detected. This alert will not auto-close.'])
      ]);

      const right = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
        el('button', {
          id: 'coda-alert-sound',
          style: btnStyle(),
          onclick: async () => {
            CONFIG.SOUND_ENABLED = !CONFIG.SOUND_ENABLED;
            const btn = document.getElementById('coda-alert-sound');
            if (btn) btn.textContent = CONFIG.SOUND_ENABLED ? 'Sound: ON' : 'Sound: OFF';
            if (CONFIG.SOUND_ENABLED) { installAudioGestureUnlock(); await tryResumeAudio(); startBeepLoop(); }
            else stopBeepLoop();
          }
        }, ['Sound: ON']),
        el('button', {
          id: 'coda-alert-copy',
          style: btnStyle(),
          onclick: async () => {
            try { await navigator.clipboard.writeText(getRecentAlertsText() || '(none)'); toast('Copied recent alerts'); }
            catch { toast('Copy failed'); }
          }
        }, ['Copy']),
        el('button', {
          id: 'coda-alert-close',
          style: btnStyle('danger'),
          onclick: () => hideAlert()
        }, ['Acknowledge'])
      ]);

      header.appendChild(left);
      header.appendChild(right);

      const body = el('div', { style: { padding: '12px 16px' } }, [
        el('div', { style: { fontSize: '12px', fontWeight: '900', marginBottom: '8px' } }, ['Recent Alerts']),
        (alertListBox = el('div', {
          style: {
            border: `2px solid ${UI.border}`,
            borderRadius: '12px',
            padding: '10px 12px',
            background: '#FFFBE3',
            maxHeight: '52vh',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.45',
            fontFamily: 'Consolas, Menlo, monospace',
            whiteSpace: 'pre',
          }
        }, ['']))
      ]);

      panel.appendChild(header);
      panel.appendChild(body);
      alertOverlay.appendChild(panel);
      document.body.appendChild(alertOverlay);

      const soundBtn = document.getElementById('coda-alert-sound');
      if (soundBtn) soundBtn.textContent = CONFIG.SOUND_ENABLED ? 'Sound: ON' : 'Sound: OFF';
    } finally {
      setTimeout(() => { UI_UPDATING = false; }, 50);
    }
  }

  function showAlert() {
    ensureAlertOverlay();
    if (!alertOverlay) return;

    if (alertTitleNode) alertTitleNode.textContent = buildAlertTitle();
    if (alertListBox) alertListBox.textContent = getRecentAlertsText() || '(none)';
    alertOverlay.style.display = 'flex';
    window.focus?.();
    installAudioGestureUnlock();
    if (CONFIG.SOUND_ENABLED) tryResumeAudio().finally(() => startBeepLoop());
  }

  function hideAlert() {
    if (!alertOverlay) return;
    alertOverlay.style.display = 'none';
    stopBeepLoop();
  }


/********************************************************************
 * Rules modal (single-rule MVP)
 ********************************************************************/
let rulesOverlay = null;

function ensureRulesOverlay() {
  if (rulesOverlay && document.body.contains(rulesOverlay)) return;

  UI_UPDATING = true;
  try {
    rulesOverlay = el('div', {
      id: 'coda-rules-overlay',
      style: {
        position: 'fixed',
        inset: '0',
        zIndex: String(CONFIG.UI.Z_INDEX + 4500),
        background: 'rgba(0,0,0,0.35)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }
    });

    const panel = el('div', {
      style: {
        width: 'min(780px, 96vw)',
        background: UI.panel,
        color: UI.text,
        border: `2px solid ${UI.border}`,
        borderRadius: '14px',
        boxShadow: UI.shadow,
        overflow: 'hidden',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }
    });

    const header = el('div', {
      style: {
        padding: '12px 14px',
        borderBottom: `2px solid ${UI.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }
    }, [
      el('div', { style: { fontSize: '14px', fontWeight: '900' } }, ['Rule Settings']),
      el('div', { style: { display: 'flex', gap: '8px' } }, [
        el('button', {
          style: btnStyle(),
          onclick: () => {
            // Restore defaults
            RULES = (CONFIG.DEFAULT_RULES || []).map(normalizeRule);
            saveRules(RULES);
            renderRulesOverlay();
            renderSidebar();
      installAudioGestureUnlock();
            toast('Rules reset');
          }
        }, ['Reset']),
        el('button', {
          style: btnStyle('danger'),
          onclick: () => hideRulesModal()
        }, ['Close'])
      ])
    ]);

    const body = el('div', { style: { padding: '12px 14px' } }, [
      el('div', { style: { fontSize: '12px', fontWeight: '900', marginBottom: '8px' } }, ['Rule #1 (default)']),
      el('div', {
        id: 'coda-rule-summary',
        style: {
          border: `2px solid ${UI.border}`,
          borderRadius: '12px',
          background: '#FFFBE3',
          padding: '10px 12px',
          fontFamily: 'Consolas, Menlo, monospace',
          fontSize: '12px',
          lineHeight: '1.45',
          whiteSpace: 'pre',
          marginBottom: '10px',
        }
      }, ['']),
      el('div', { style: { fontSize: '12px', fontWeight: '900', marginBottom: '6px' } }, ['Edit']),
      el('div', { id: 'coda-rule-form' }, []),
      el('div', { style: { marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
        el('button', {
          style: btnStyle('ok'),
          onclick: () => saveRuleFromForm()
        }, ['Save']),
        el('button', {
          style: btnStyle(),
          onclick: () => renderRulesOverlay()
        }, ['Cancel']),
      ]),
    ]);

    panel.appendChild(header);
    panel.appendChild(body);
    rulesOverlay.appendChild(panel);
    document.body.appendChild(rulesOverlay);

    renderRulesOverlay();
  } finally {
    setTimeout(() => { UI_UPDATING = false; }, 50);
  }
}

function showRulesModal() {
  ensureRulesOverlay();
  if (!rulesOverlay) return;
  renderRulesOverlay();
  rulesOverlay.style.display = 'flex';
}

function hideRulesModal() {
  if (!rulesOverlay) return;
  rulesOverlay.style.display = 'none';
}

function renderRulesOverlay() {
  ensureRulesOverlay();
  if (!rulesOverlay) return;

  const r = (RULES && RULES[0]) ? normalizeRule(RULES[0]) : normalizeRule((CONFIG.DEFAULT_RULES || [])[0] || {});
  RULES = [r];

  const summary = rulesOverlay.querySelector('#coda-rule-summary');
  if (summary) {
    const priceRuleText = r.usePriceDeviation 
      ? `Market Price ±${CONFIG.PRICE_DEVIATION_THRESHOLD_PERCENT}%` 
      : `${r.priceOp} ${r.priceValue}`;
    const marketPrice = (r.symbol && STATE.marketPrices[r.symbol]) 
      ? STATE.marketPrices[r.symbol].toFixed(3) 
      : 'N/A';
    
    summary.textContent =
      `Enabled: ${r.enabled ? 'YES' : 'NO'}\n` +
      `Account (${(r.accountMode || 'exact').toUpperCase()}): ${r.accountValue || '-'}\n` +
      `Symbol: ${r.symbol || '-'}\n` +
      `Current Market Price: ${marketPrice}\n` +
      `Price Rule: ${priceRuleText}\n` +
      `Is STP: ${r.isStp === null ? 'ANY' : String(r.isStp).toUpperCase()}`;
  }

  const form = rulesOverlay.querySelector('#coda-rule-form');
  if (!form) return;

  form.innerHTML = '';
  const rowStyle = { display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', alignItems: 'center', marginBottom: '8px' };
  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: `2px solid ${UI.border}`,
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '900',
    background: '#FFFFFF',
    color: UI.text,
    boxSizing: 'border-box'
  };
  const selectStyle = { ...inputStyle, padding: '7px 8px' };

  const enabled = el('input', { id: 'coda-rule-enabled', type: 'checkbox', ...(r.enabled ? { checked: 'checked' } : {}) });
  enabled.style.transform = 'scale(1.2)';

  form.appendChild(el('div', { style: rowStyle }, [
    el('div', { style: { fontWeight: '900' } }, ['Enabled']),
    el('div', {}, [enabled]),
  ]));

  const usePriceDeviation = el('input', { id: 'coda-rule-use-deviation', type: 'checkbox', ...(r.usePriceDeviation ? { checked: 'checked' } : {}) });
  usePriceDeviation.style.transform = 'scale(1.2)';

  form.appendChild(el('div', { style: rowStyle }, [
    el('div', { style: { fontWeight: '900' } }, ['Use % Deviation']),
    el('div', {}, [usePriceDeviation]),
  ]));

  // Add change listener to re-render form when checkbox changes
  usePriceDeviation.addEventListener('change', (e) => {
    // Update the rule temporarily
    r.usePriceDeviation = e.target.checked;
    renderRulesOverlay();
  });

  const acct = el('input', { id: 'coda-rule-account', value: r.accountValue || '' });
  Object.assign(acct.style, inputStyle);

  const acctMode = el('select', { id: 'coda-rule-account-mode' }, [
    el('option', { value: 'exact' }, ['Specific: Exact']),
    el('option', { value: 'contains' }, ['Specific: Contains']),
    el('option', { value: 'regex' }, ['Specific: Regex']),
    el('option', { value: 'all-customer' }, ['All CUSTOMER accounts']),
    el('option', { value: 'all' }, ['All accounts']),
  ]);
  Object.assign(acctMode.style, selectStyle);
  acctMode.value = r.accountMode || 'exact';

  // Show/hide account input based on mode
  const updateAccountInputVisibility = () => {
    const mode = acctMode.value;
    if (mode === 'all' || mode === 'all-customer') {
      acct.style.display = 'none';
      acct.disabled = true;
    } else {
      acct.style.display = 'block';
      acct.disabled = false;
    }
  };
  
  acctMode.addEventListener('change', updateAccountInputVisibility);
  updateAccountInputVisibility(); // Initial state

  const acctWrap = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [acctMode, acct]);

  form.appendChild(el('div', { style: rowStyle }, [
    el('div', { style: { fontWeight: '900' } }, ['Account']),
    acctWrap,
  ]));

  const sym = el('input', { id: 'coda-rule-symbol', value: r.symbol || '' });
  Object.assign(sym.style, inputStyle);
  form.appendChild(el('div', { style: rowStyle }, [
    el('div', { style: { fontWeight: '900' } }, ['Symbol']),
    sym,
  ]));

  // Conditional fields based on usePriceDeviation
  if (r.usePriceDeviation) {
    // Percentage mode: show deviation threshold
    const pctThreshold = el('input', {
      id: 'coda-rule-pct-threshold',
      type: 'number',
      value: String(CONFIG.PRICE_DEVIATION_THRESHOLD_PERCENT),
      min: '0.1',
      max: '100',
      step: '0.1',
    });
    Object.assign(pctThreshold.style, inputStyle);

    form.appendChild(el('div', { style: rowStyle }, [
      el('div', { style: { fontWeight: '900' } }, ['Deviation %']),
      pctThreshold,
    ]));

    form.appendChild(el('div', {
      style: {
        gridColumn: '1 / -1',
        fontSize: '11px',
        color: UI.muted,
        fontWeight: '900',
        marginTop: '-4px',
        marginBottom: '4px',
      }
    }, ['💡 Alert when trade price deviates from market price by more than this %.']));

  } else {
    // Fixed price mode: show operator and value
    const op = el('select', { id: 'coda-rule-price-op' }, [
      el('option', { value: '>' }, ['>']),
      el('option', { value: '>=' }, ['>=']),
      el('option', { value: '==' }, ['==']),
      el('option', { value: '<=' }, ['<=']),
      el('option', { value: '<' }, ['<']),
    ]);
    Object.assign(op.style, selectStyle);
    op.value = r.priceOp || '>';

    const pv = el('input', { id: 'coda-rule-price-value', type: 'number', value: String(r.priceValue ?? '') });
    Object.assign(pv.style, inputStyle);

    form.appendChild(el('div', { style: rowStyle }, [
      el('div', { style: { fontWeight: '900' } }, ['Open Price']),
      el('div', { style: { display: 'flex', gap: '8px' } }, [op, pv]),
    ]));

    form.appendChild(el('div', {
      style: {
        gridColumn: '1 / -1',
        fontSize: '11px',
        color: UI.muted,
        fontWeight: '900',
        marginTop: '-4px',
        marginBottom: '4px',
      }
    }, ['💡 Alert when trade price matches this fixed condition.']));
  }

  const stp = el('select', { id: 'coda-rule-stp' }, [
    el('option', { value: 'any' }, ['ANY']),
    el('option', { value: 'true' }, ['TRUE']),
    el('option', { value: 'false' }, ['FALSE']),
  ]);
  Object.assign(stp.style, selectStyle);
  stp.value = (r.isStp === null) ? 'any' : (r.isStp ? 'true' : 'false');

  form.appendChild(el('div', { style: rowStyle }, [
    el('div', { style: { fontWeight: '900' } }, ['Is STP']),
    stp,
  ]));
}

function saveRuleFromForm() {
  if (!rulesOverlay) return;
  const enabled = !!rulesOverlay.querySelector('#coda-rule-enabled')?.checked;
  const usePriceDeviation = !!rulesOverlay.querySelector('#coda-rule-use-deviation')?.checked;
  const accountMode = rulesOverlay.querySelector('#coda-rule-account-mode')?.value || 'exact';
  const accountValue = rulesOverlay.querySelector('#coda-rule-account')?.value || '';
  const symbol = rulesOverlay.querySelector('#coda-rule-symbol')?.value || '';
  
  let priceOp = '>';
  let priceValue = 5000;
  
  if (usePriceDeviation) {
    // In percentage mode, save the threshold to CONFIG
    const pctInput = rulesOverlay.querySelector('#coda-rule-pct-threshold');
    if (pctInput) {
      const pct = Number(pctInput.value);
      if (Number.isFinite(pct) && pct > 0) {
        CONFIG.PRICE_DEVIATION_THRESHOLD_PERCENT = pct;
      }
    }
  } else {
    // In fixed price mode, get operator and value
    priceOp = rulesOverlay.querySelector('#coda-rule-price-op')?.value || '>';
    priceValue = Number(rulesOverlay.querySelector('#coda-rule-price-value')?.value) || 5000;
  }
  
  const stpSel = rulesOverlay.querySelector('#coda-rule-stp')?.value || 'any';
  const isStp = (stpSel === 'true') ? true : (stpSel === 'false') ? false : null;

  const base = (RULES && RULES[0]) ? RULES[0] : (CONFIG.DEFAULT_RULES || [])[0] || {};
  const updated = normalizeRule({
    ...base,
    enabled,
    usePriceDeviation,
    accountMode,
    accountValue,
    symbol,
    priceOp,
    priceValue,
    isStp,
  });

  RULES = [updated];
  saveRules(RULES);
  renderRulesOverlay();
  renderSidebar();
  toast('Rule saved');
}

/********************************************************************
   * Scanning core
   ********************************************************************/
  function clampDedupeSize() {
    const max = CONFIG.DEDUPE_MAX_KEYS;
    if (STATE.seenKeys.size <= max) return;

    const keep = [];
    let i = 0;
    for (const k of STATE.seenKeys) {
      if (i >= STATE.seenKeys.size - max) keep.push(k);
      i++;
    }
    STATE.seenKeys = new Set(keep);
  }

  function pushRecentAlert(trade, reason) {
    const record = {
      ruleName: LAST_HIT_RULE_NAME,
      detectedAt: nowISO(),
      reason,
      time: trade.time,
      accountType: trade.accountType,
      account: trade.account,
      symbol: trade.symbol,
      tradeSizeText: trade.tradeSizeText,
      side: trade.side,
      openPrice: trade.openPrice,
      counterParty: trade.counterParty,
      clientOrderId: trade.clientOrderId,
      initiator: trade.initiator,
      isSTPText: trade.isSTPText,
    };
    STATE.recentAlerts.unshift(record);
    if (STATE.recentAlerts.length > CONFIG.RECENT_ALERTS_MAX) {
      STATE.recentAlerts.length = CONFIG.RECENT_ALERTS_MAX;
    }
  }

  function scanOnce(reason = 'auto', wantToast = false) {
    if (!monitorEnabled) {
      STATE.lastError = null;
      renderSidebar();
      installAudioGestureUnlock();
      if (wantToast) toast('Scan skipped (monitor is OFF)');
      return;
    }

    STATE.lastScanAt = nowISO();
    STATE.lastError = null;

    const table = findRecentTradesTableRoot();
    if (!table) {
      STATE.lastError = `Table not found: "${CONFIG.TABLE_SECTION_TITLE}"`;
      renderSidebar();
      installAudioGestureUnlock();
      if (wantToast) toast('Recent Trades table not found');
      return;
    }

    const trades = extractTradesFromTable(table);
    const hits = [];

    for (const t of trades) {
      const key = tradeKey(t);
      if (STATE.seenKeys.has(key)) continue;
      STATE.seenKeys.add(key);
      if (matchesRule(t)) hits.push(t);
    }

    clampDedupeSize();

    if (hits.length > 0) {
      STATE.lastHitAt = nowISO();
      STATE.lastHitCount = hits.length;
      for (const h of hits) pushRecentAlert(h, reason);
      showAlert();
    } else {
      STATE.lastHitCount = 0;
    }

    renderSidebar();
    if (wantToast) toast(`Scan complete (rows: ${trades.length}, hits: ${hits.length})`);
  }

  /********************************************************************
   * Auto scan scheduler (throttled, no toast)
   ********************************************************************/
  let lastAutoScanAt = 0;

  const debouncedAutoScan = debounce((reason) => {
    const now = Date.now();
    if (now - lastAutoScanAt < CONFIG.AUTO_SCAN_MIN_INTERVAL_MS) return;
    lastAutoScanAt = now;
    scanOnce(reason, false);
  }, CONFIG.AUTO_SCAN_DEBOUNCE_MS);

  function requestAutoScan(reason) {
    debouncedAutoScan(reason);
  }

  function scanNow(reason = 'manual', wantToast = true) {
    if (wantToast) toast(`Scanning... (${reason})`);
    // manual scan should always run immediately
    scanOnce(reason, wantToast);
  }

  /********************************************************************
   * MutationObserver: ignore our own UI changes + throttle
   ********************************************************************/
  function isInsideOurUI(node) {
    if (!(node instanceof Node)) return false;
    const elNode = (node.nodeType === 1) ? node : node.parentElement;
    if (!elNode) return false;
    return !!elNode.closest('#coda-stp-sidebar, #coda-stp-alert-overlay, #coda-rules-overlay, #coda-toast');
  }

  let mo = null;
  let pollTimer = null;
  let marketPricePollTimer = null;  // NEW

  function startObservers() {
    if (mo) mo.disconnect();

    mo = new MutationObserver((mutations) => {
      if (UI_UPDATING) return;

      // If mutations are only within our UI, ignore
      let hasRelevant = false;
      for (const m of mutations) {
        if (isInsideOurUI(m.target)) continue;
        // Also ignore if added nodes are our UI
        const added = [...(m.addedNodes || [])];
        if (added.length && added.every(isInsideOurUI)) continue;

        hasRelevant = true;
        break;
      }
      if (!hasRelevant) return;

      requestAutoScan('mutation');
    });

    mo.observe(document.body, { childList: true, subtree: true });

    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      requestAutoScan('poll');
    }, CONFIG.POLL_INTERVAL_MS);

    // NEW: market price polling
    if (marketPricePollTimer) clearInterval(marketPricePollTimer);
    updateMarketPrices();  // Initial update
    marketPricePollTimer = setInterval(() => {
      updateMarketPrices();
      renderSidebar();  // Update UI with new prices
    }, CONFIG.MARKET_PRICE_POLL_INTERVAL_MS);
  }

  /********************************************************************
   * Boot
   ********************************************************************/
  function boot() {
    ensureSidebar();
    ensureAlertOverlay();
    startObservers();

    // boot scan (no toast)
    requestAutoScan('boot');

    // keep UI alive across SPA changes (lightweight)
    setInterval(() => {
      ensureSidebar();
      ensureAlertOverlay();
    }, 2500);
  }

  boot();
})();

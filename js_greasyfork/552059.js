// ==UserScript==
// @name         RabbitMQ Total Column Monitor (persist sort + enforce direction + coloring + trends + titles)
// @namespace    http://bosbec.io/
// @version      2025-10-22
// @description  Persist sorting, enforce saved direction after render, color Messages→Total thresholds, show trend arrows, set title on links for ellipsis hover, and outline rows where Name ends with ".error".
// @author       Rokker
// @match        http://rabbit.bosbec.io:15672/*
// @match        https://rabbit.bosbec.io:15672/*
// @match        http://rabbit1-test.bosbec.io:15672/*
// @match        http://rabbit2-test.bosbec.io:15672/*
// @match        http://rabbit3-test.bosbec.io:15672/*
// @match        https://rabbit1-test.bosbec.io:15672/*
// @match        https://rabbit2-test.bosbec.io:15672/*
// @match        https://rabbit3-test.bosbec.io:15672/*
// @match        http://rabbit1-eu-north-1.bosbec.io:15672/*
// @match        http://rabbit2-eu-north-1.bosbec.io:15672/*
// @match        http://rabbit3-eu-north-1.bosbec.io:15672/*
// @match        https://rabbit1-eu-north-1.bosbec.io:15672/*
// @match        https://rabbit2-eu-north-1.bosbec.io:15672/*
// @match        https://rabbit3-eu-north-1.bosbec.io:15672/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rabbitmq.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552059/RabbitMQ%20Total%20Column%20Monitor%20%28persist%20sort%20%2B%20enforce%20direction%20%2B%20coloring%20%2B%20trends%20%2B%20titles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552059/RabbitMQ%20Total%20Column%20Monitor%20%28persist%20sort%20%2B%20enforce%20direction%20%2B%20coloring%20%2B%20trends%20%2B%20titles%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WARNING_THRESHOLD = 100;   // >=100 → amber
  const ERROR_THRESHOLD   = 1000;  // >=1000 → red

  const HISTORY_LIMIT   = 12;
  const STREAK_LEN      = 4;
  const MIN_ABS_DELTA   = 20;
  const MIN_PCT_DELTA   = 0.20;

  // Trend arrow colors: DOWN is good (green), UP is bad (red)
  const ARROW_UP_COLOR = '#b80600';
  const ARROW_DOWN_COLOR = '#188038';

  const SORT_KEY = `rmq_sort:${location.host}${location.pathname}`;
  const history = new Map();

  /* ===================== Styles ===================== */
  function ensureStyles() {
    if (document.getElementById('rmq-ux-style')) return;
    const style = document.createElement('style');
    style.id = 'rmq-ux-style';
    style.textContent = `
      /* Threshold highlights */
      table.list td.rmq-error {
        background: #d93025 !important;
        color: #fff !important;
        font-weight: 700 !important;
      }
      table.list td.rmq-warn {
        background: #f9ab00 !important;
        color: #202124 !important;
        font-weight: 700 !important;
      }

      /* Trend arrows (::before on Name cell) */
      td.rmq-trend-up, td.rmq-trend-down, td.rmq-trend-steady {
        padding-right: 1.6em;
      }
      td.rmq-trend-up::before,
      td.rmq-trend-down::before,
      td.rmq-trend-steady::before {
        float: right;
        margin-left: .4em;
        font-size: 20px;
        line-height: 0.8em;   /* per your tweak */
        height: 1em;
        display: inline-block;
        pointer-events: none;
        user-select: none;
      }
      td.rmq-trend-up::before     { content: '↑'; color: ${ARROW_UP_COLOR}; }
      td.rmq-trend-down::before   { content: '↓'; color: ${ARROW_DOWN_COLOR}; }
      td.rmq-trend-steady::before { content: '→'; color: #5f6368; }

      /* Layout tweaks */
      #main a {
        max-width: 500px;   /* per your tweak */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: bottom;
      }
      #main td {
        white-space: nowrap;
        vertical-align: middle;
      }
      #main th {
        white-space: nowrap;
      }

      /* Row outline for names ending with ".error" */
      table.list tr.rmq-name-ends-error td:nth-of-type(2) a {
        text-decoration-line: underline;
        text-decoration-color: #a12121;
      }
    `;
    document.head.appendChild(style);
  }

  /* ===================== Sort persistence ===================== */
  function getSavedSort() {
    try {
      const raw = localStorage.getItem(SORT_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj.sort !== 'string') return null;
      return { sort: obj.sort, reverse: !!obj.reverse };
    } catch { return null; }
  }

  // Prime globals ASAP so the built-in indicator/logic can pick them up
  (function primeSortGlobalsEarly() {
    const saved = getSavedSort();
    if (saved) {
      window.current_sort = saved.sort;
      window.current_sort_reverse = !!saved.reverse;
    }
  })();

  // Save after site updates its globals on click
  document.addEventListener('click', (e) => {
    const link = e.target && e.target.closest && e.target.closest('a.sort');
    if (!link) return;
    setTimeout(() => {
      try {
        const sort = window.current_sort;
        const reverse = !!window.current_sort_reverse;
        if (typeof sort === 'string' && sort.length) {
          localStorage.setItem(SORT_KEY, JSON.stringify({ sort, reverse }));
        }
      } catch {}
    }, 0);
  }, true);

  // Inject saved sort into /api/queues URLs if missing (server-side order)
  function injectSortIntoUrl(url) {
    try {
      const u = new URL(url, location.origin);
      if (!/\/api\/queues/.test(u.pathname)) return url;
      if (u.searchParams.has('sort')) return url; // respect existing
      const saved = getSavedSort();
      if (!saved) return url;
      u.searchParams.set('sort', saved.sort);
      u.searchParams.set('sort_reverse', saved.reverse ? 'true' : 'false');
      return u.toString();
    } catch {
      return url;
    }
  }

  // Hook fetch for sort injection + run trigger
  if (window.fetch && !window.fetch.__rmqUxHooked) {
    const origFetch = window.fetch;
    window.fetch = function (...args) {
      try {
        if (args[0] instanceof Request) {
          const newUrl = injectSortIntoUrl(args[0].url);
          if (newUrl !== args[0].url) args[0] = new Request(newUrl, args[0]);
        } else if (typeof args[0] === 'string') {
          const newUrl = injectSortIntoUrl(args[0]);
          if (newUrl !== args[0]) args[0] = newUrl;
        }
      } catch {}
      return origFetch.apply(this, args).then(res => {
        try {
          const url = (args[0] instanceof Request) ? args[0].url : String(args[0] || '');
          if (url.includes('/api/queues')) {
            scheduleRun('fetch');
            scheduleRunIn(75, 'fetch+75ms');
            scheduleRunIn(250, 'fetch+250ms');
            scheduleRunIn(500, 'fetch+500ms');
          }
        } catch {}
        return res;
      });
    };
    window.fetch.__rmqUxHooked = true;
  }

  // Hook XHR for sort injection + run trigger
  if (!XMLHttpRequest.prototype.__rmqUxHooked) {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      try {
        if (typeof url === 'string') url = injectSortIntoUrl(url);
        this.__rmqIsQueues = typeof url === 'string' && url.includes('/api/queues');
      } catch {}
      return origOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function (...args) {
      try {
        if (this.__rmqIsQueues) {
          this.addEventListener('load', () => {
            scheduleRun('xhr');
            scheduleRunIn(75, 'xhr+75ms');
            scheduleRunIn(250, 'xhr+250ms');
            scheduleRunIn(500, 'xhr+500ms');
          }, { once: true });
        }
      } catch {}
      return origSend.apply(this, args);
    };
    XMLHttpRequest.prototype.__rmqUxHooked = true;
  }

  /* ===================== Helpers ===================== */
  function parseIntSafe(text) {
    const raw = String(text).trim().replace(/[, \u00A0]/g, '');
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? null : n;
  }

  function updateHistory(key, val) {
    if (val == null) return;
    const arr = history.get(key) || [];
    if (arr.length === 0 || arr[arr.length - 1] !== val) {
      arr.push(val);
      if (arr.length > HISTORY_LIMIT) arr.shift();
      history.set(key, arr);
    }
  }

  function trendFor(arr) {
    if (!arr || arr.length < STREAK_LEN) return 'none';
    const tail = arr.slice(-STREAK_LEN);
    const up   = tail.every((v, i) => i === 0 || v > tail[i - 1]);
    const down = tail.every((v, i) => i === 0 || v < tail[i - 1]);
    const delta = tail[tail.length - 1] - tail[0];
    const pct = Math.abs(delta) / Math.max(1, Math.abs(tail[0]));
    if (up   && (delta >= MIN_ABS_DELTA || pct >= MIN_PCT_DELTA)) return 'up';
    if (down && (-delta >= MIN_ABS_DELTA || pct >= MIN_PCT_DELTA)) return 'down';
    if (Math.abs(delta) < 10 && pct < 0.05) return 'steady';
    return 'none';
  }

  /* ===================== Column detection ===================== */
  function findColumns(table) {
    const thead = table.querySelector('thead');
    if (!thead) return null;

    const leafRow = thead.querySelector('tr:last-child');
    if (!leafRow) return null;

    const leafThs = Array.from(leafRow.querySelectorAll('th'));
    if (!leafThs.length) return null;

    // Prefer the Messages "Total"
    let targetLink = leafRow.querySelector('th a.sort[sort="messages"]');

    // Fallback: compute via group "Messages"
    if (!targetLink) {
      const groupRow = thead.querySelector('tr:first-child');
      const groupThs = groupRow ? Array.from(groupRow.querySelectorAll('th')) : [];
      const messagesGroup = groupThs.find(th => th.textContent.trim() === 'Messages');
      if (messagesGroup) {
        let start = 0;
        for (const gth of groupThs) {
          if (gth === messagesGroup) break;
          start += parseInt(gth.getAttribute('colspan') || '1', 10);
        }
        const span = parseInt(messagesGroup.getAttribute('colspan') || '1', 10);
        const end = start + span - 1;
        for (let i = start; i <= end && i < leafThs.length; i++) {
          const a = leafThs[i].querySelector('a.sort');
          if (a && a.textContent.trim() === 'Total') { targetLink = a; break; }
        }
      }
    }

    // Fallback: first “Total”
    if (!targetLink) {
      const anyTotals = leafRow.querySelectorAll('th a.sort');
      for (const a of anyTotals) {
        if (a.textContent.trim() === 'Total') { targetLink = a; break; }
      }
    }

    if (!targetLink) return null;

    const totalTh = targetLink.closest('th');
    const totalColIndex = leafThs.indexOf(totalTh);

    const idxByText = (txt, fallback) => {
      const th = leafThs.find(h => h.textContent.trim() === txt);
      return th ? leafThs.indexOf(th) : fallback;
    };
    const nameColIndex  = idxByText('Name', 1);
    const vhostColIndex = idxByText('Virtual host', 0);

    return { totalColIndex, nameColIndex, vhostColIndex };
  }

  /* ===================== Enforce saved sort (column & direction) ===================== */
  let enforcedThisLoad = false;
  function enforceSort() {
    if (enforcedThisLoad) return;
    const saved = getSavedSort();
    if (!saved) return;

    const table = document.querySelector('#main table.list') || document.querySelector('table.list');
    const thead = table?.querySelector('thead');
    if (!thead) return;

    const targetLink = thead.querySelector(`a.sort[sort="${saved.sort}"]`);
    if (!targetLink) return;

    const curSort = window.current_sort;
    const curRev  = !!window.current_sort_reverse;

    const clickAndWait = (el, delay=60) => new Promise(resolve => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      setTimeout(resolve, delay);
    });

    (async () => {
      try {
        if (curSort !== saved.sort) {
          await clickAndWait(targetLink);
          if (saved.reverse) await clickAndWait(targetLink);
        } else if (curRev !== saved.reverse) {
          await clickAndWait(targetLink);
        }
        window.current_sort = saved.sort;
        window.current_sort_reverse = !!saved.reverse;
        enforcedThisLoad = true;
      } catch {}
    })();
  }

  /* ===================== Titles for truncated links ===================== */
  function applyLinkTitles() {
    // Only affect visible data rows to avoid touching header sort links etc.
    const links = document.querySelectorAll('#main table.list tbody a');
    links.forEach(a => {
      const txt = (a.textContent || '').trim();
      // Avoid stomping on existing, non-empty titles that may be meaningful
      if (!a.hasAttribute('title') || a.getAttribute('title') !== txt) {
        a.setAttribute('title', txt);
      }
    });
  }

  /* ===================== Color + trend pass ===================== */
  function runPass() {
    ensureStyles();

    const table = document.querySelector('#main table.list') || document.querySelector('table.list');
    if (!table) return false;

    // Enforce saved sort once per load
    enforceSort();

    // Ensure titles exist for truncated anchor text
    applyLinkTitles();

    const cols = findColumns(table);
    if (!cols) return false;

    const { totalColIndex, nameColIndex, vhostColIndex } = cols;
    const rows = table.querySelectorAll('tbody tr');
    if (!rows.length) return false;

    rows.forEach(row => {
      const tds = row.querySelectorAll('td');
      if (!tds.length) return;

      const totalTd = tds[totalColIndex];
      const nameTd  = tds[nameColIndex];
      const vhostTd = tds[vhostColIndex];
      if (!totalTd || !nameTd) return;

      // Threshold coloring
      totalTd.classList.remove('rmq-warn', 'rmq-error');
      const totalVal = parseIntSafe(totalTd.textContent);
      if (totalVal != null) {
        if (totalVal >= ERROR_THRESHOLD) { totalTd.classList.add('rmq-error'); }
        else if (totalVal >= WARNING_THRESHOLD) { totalTd.classList.add('rmq-warn'); }
      }

      // Trends on Name col
      const name = (nameTd.textContent || '').trim();
      const vhost = (vhostTd?.textContent || '').trim();
      const key = `${vhost}::${name}`;
      updateHistory(key, totalVal);
      const trend = trendFor(history.get(key));

      nameTd.classList.remove('rmq-trend-up', 'rmq-trend-down', 'rmq-trend-steady');
      if (trend === 'up') { nameTd.classList.add('rmq-trend-up'); }
      else if (trend === 'down') { nameTd.classList.add('rmq-trend-down'); }
      else if (trend === 'steady') { nameTd.classList.add('rmq-trend-steady'); }

      // === Outline rows where Name slutar på ".error" ===
      const endsWithError = /\.error$/.test(name);
      row.classList.toggle('rmq-name-ends-error', endsWithError);
    });

    return true;
  }

  /* ===================== Reactive triggers & robust timing ===================== */
  let rafId = null;
  function scheduleRun(_from='') {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      setTimeout(() => { runPass(); }, 0);
    });
  }
  function scheduleRunIn(ms, from='') { setTimeout(() => scheduleRun(from), ms); }

  // Observe table body changes once it exists
  let tableObserver = null;
  function attachTableObserver() {
    const tbody = document.querySelector('#main table.list tbody') || document.querySelector('table.list tbody');
    if (!tbody) return false;
    if (tableObserver) tableObserver.disconnect();
    tableObserver = new MutationObserver(() => scheduleRun('tbody MutationObserver'));
    tableObserver.observe(tbody, { childList: true, subtree: true, characterData: true });
    return true;
  }

  // Observe #main (or body) until table appears
  let mainObserver = null;
  function attachMainObserver() {
    const main = document.querySelector('#main') || document.body;
    if (mainObserver) mainObserver.disconnect();
    mainObserver = new MutationObserver(() => {
      const table = document.querySelector('#main table.list, table.list');
      if (table) {
        attachTableObserver();
        scheduleRun('main observer (table appeared)');
      }
    });
    mainObserver.observe(main, { childList: true, subtree: true });
  }

  function init() {
    const ready = () => {
      attachMainObserver();
      scheduleRun('DOMContentLoaded');
      scheduleRunIn(100, 'DOMContentLoaded+100ms');
      scheduleRunIn(500, 'DOMContentLoaded+500ms');
      window.addEventListener('hashchange', () => {
        enforcedThisLoad = false;
        const saved = getSavedSort();
        if (saved) { window.current_sort = saved.sort; window.current_sort_reverse = !!saved.reverse; }
        attachMainObserver();
        scheduleRun('hashchange');
        scheduleRunIn(100, 'hashchange+100ms');
        scheduleRunIn(500, 'hashchange+500ms');
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
    else ready();
  }

  init();
})();

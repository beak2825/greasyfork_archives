// ==UserScript==
// @name         Torn – Last Action + Job (Advanced Search, Enemies & Targets)
// @namespace    torn.unified.lastaction
// @version      1.2.0
// @description  Shows user status/last action and job.position on Advanced Search, Enemies and Targets lists. Right-aligned in Description for Enemies/Targets; absolute on the right in Advanced Search. No caching. Web vs Mobile API key logic.
// @author       JohnNash
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/page.php?sid=list&type=enemies*
// @match        https://www.torn.com/page.php?sid=list&type=targets*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561969/Torn%20%E2%80%93%20Last%20Action%20%2B%20Job%20%28Advanced%20Search%2C%20Enemies%20%20Targets%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561969/Torn%20%E2%80%93%20Last%20Action%20%2B%20Job%20%28Advanced%20Search%2C%20Enemies%20%20Targets%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONF = {
    startDelayMs: 1500,

    // Advanced Search
    advUserItemSelector: 'li[class*="user"]',
    advSkipHiddenClass: 'tt-hidden',

    // Enemies/Targets
    listRowSelector: 'li[class*="tableRowWrapper"]',
    listDescBaseSelector: 'div[class*="description___"][class*="border___"]',
    enemiesFlagClass: 'enemies___', // present only on enemies list cells

    // Badge
    badgeClass: 'tlaj-badge',
    badgeAbsClass: 'tlaj-abs',

    requestTimeoutMs: 12000,
    debounceMs: 120,

    // Safety rescan interval for virtualized lists (ms)
    listRescanMs: 3000,

    // Throttle to reduce 429 (ms between API calls)
    throttleMs: 350,
  };

  const STATUS_COLORS = {
    online:  '#2ecc71', // green
    idle:    '#f39c12', // orange
    offline: '#e74c3c', // red
    unknown: '#bbbbbb', // grey
  };

  // -------------------------
  // GM wrappers (PDA-safe)
  // -------------------------
  const GMX = {
    hasGM: () =>
      (typeof GM_getValue !== 'undefined') &&
      (typeof GM_setValue !== 'undefined') &&
      (typeof GM_addStyle !== 'undefined'),

    get: (k, d = '') =>
      (typeof GM_getValue !== 'undefined') ? GM_getValue(k, d) : (localStorage.getItem(k) ?? d),

    set: (k, v) =>
      (typeof GM_setValue !== 'undefined') ? GM_setValue(k, v) : localStorage.setItem(k, v),

    addStyle: (css) => {
      if (typeof GM_addStyle !== 'undefined') return GM_addStyle(css);
      const s = document.createElement('style');
      s.textContent = css;
      document.head.appendChild(s);
    }
  };

  GMX.addStyle(`
    /* Shared look */
    .${CONF.badgeClass} {
      display: inline-flex; align-items: center; gap: 8px;
      font-weight: 700; font-size: 12px; padding: 2px 8px;
      border-radius: 6px; background: rgba(0,0,0,0.35); color: #ddd;
      line-height: 1; white-space: nowrap;
    }
    .${CONF.badgeClass} .job { font-weight: 600; opacity: .95; }
    .${CONF.badgeClass} .status { font-weight: 800; }

    /* Advanced Search: absolute at the right edge of the LI */
    .${CONF.badgeClass}.${CONF.badgeAbsClass} {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      z-index: 250;
    }
    ${CONF.advUserItemSelector} { position: relative; }

    /* Enemies/Targets: push badge to the right inside Description cell */
    ${CONF.listDescBaseSelector} {
      display: flex; justify-content: space-between; align-items: center;
    }
    ${CONF.listDescBaseSelector} .${CONF.badgeClass} {
      margin-left: auto;
    }
  `);

  // --- Page detection ---
  const isAdvancedSearch = () => /[?&]sid=UserList/i.test(location.search);
  function getListType() {
    const m = location.search.match(/(?:^|[?&])type=(enemies|targets)(?:&|$)/i);
    return m ? m[1].toLowerCase() : null; // 'enemies' | 'targets' | null
  }

  // -------------------------
  // API key: GM present => "web"; no GM => "mobile/PDA"
  // -------------------------
  const getApiKey = () => GMX.hasGM() ? getApiKeyWeb() : '###PDA-APIKEY###';
  function getApiKeyWeb() { return GM_GetOrAsk('torn_api_key', 'Enter your Torn API key (stored in Tampermonkey):'); }
  function GM_GetOrAsk(key, promptText) {
    let v = GMX.get(key, '');
    if (!v) {
      v = prompt(promptText, '') || '';
      if (v) GMX.set(key, v.trim());
    }
    return (v || '').trim();
  }

  // --- Utilities ---
  async function fetchWithTimeout(url, timeoutMs = CONF.requestTimeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { signal: controller.signal, mode: 'cors', credentials: 'omit' });
    } finally {
      clearTimeout(timer);
    }
  }

  function compactRelative(relative) {
    if (!relative || typeof relative !== 'string') return 'N/A';
    const s = relative.trim().toLowerCase();
    if (s === 'online') return 'ON';
    if (s === 'just now') return '0m';
    let m = s.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
    if (m) {
      const n = m[1], unit = m[2].toLowerCase();
      const map = { second: 's', minute: 'm', hour: 'h', day: 'd', week: 'w', month: 'mo', year: 'y' };
      return `${n}${map[unit] || ''}`;
    }
    m = s.match(/(\d+)\s*(sec|second|min|minute|hour|day|week|month|year)/i);
    if (m) {
      const n = m[1], u = m[2].toLowerCase();
      const norm = { sec:'s', second:'s', min:'m', minute:'m', hour:'h', day:'d', week:'w', month:'mo', year:'y' }[u] || '';
      return `${n}${norm}`;
    }
    return relative;
  }

  // --- Advanced Search helpers ---
  function advParseUserId(li) {
    const m = [...li.classList].join(' ').match(/(?:^|\s)user(\d+)(?:\s|$)/);
    if (m) return m[1];
    const a = li.querySelector('a[href*="profiles.php?XID="]');
    const m2 = a?.href.match(/XID=(\d+)/);
    return m2 ? m2[1] : null;
  }
  function advIsHidden(li) {
    return li.classList.contains(CONF.advSkipHiddenClass) || li.hasAttribute('data-hide-reason');
  }
  function advEnsureBadge(li) {
    let wrap = li.querySelector('.' + CONF.badgeClass);
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = `${CONF.badgeClass} ${CONF.badgeAbsClass}`;
      const job = document.createElement('span'); job.className = 'job'; job.textContent = '…';
      const status = document.createElement('span'); status.className = 'status'; status.textContent = '…';
      wrap.appendChild(job); wrap.appendChild(status);
      li.appendChild(wrap);
    }
    return {
      wrap,
      jobEl: wrap.querySelector('.job'),
      statusEl: wrap.querySelector('.status'),
    };
  }
  function advFindListRoot() {
    const firstLi = document.querySelector(CONF.advUserItemSelector);
    if (!firstLi) return null;
    const ul = firstLi.closest('ul, ol');
    if (ul) return ul;
    let p = firstLi.parentElement;
    while (p && p !== document.body) {
      if (p.querySelectorAll(CONF.advUserItemSelector).length >= 3) return p;
      p = p.parentElement;
    }
    return null;
  }

  // --- Enemies/Targets helpers ---
  function listParseUserId(li) {
    // prefer profile link
    const a = li.querySelector('a[href*="/profiles.php?XID="]');
    const m = a?.getAttribute('href')?.match(/XID=(\d+)/);
    if (m) return m[1];
    // fallback: attack link (user2ID)
    const atk = li.querySelector('a[href*="loader2.php?sid=getInAttack"]');
    const m2 = atk?.getAttribute('href')?.match(/user2ID=(\d+)/);
    if (m2) return m2[1];
    return null;
  }
  function listFindDescriptionCell(li, pageType) {
    const base = CONF.listDescBaseSelector;
    const sel = pageType === 'enemies'
      ? `${base}[class*="${CONF.enemiesFlagClass}"]`
      : base;
    return li.querySelector(sel);
  }
  function listEnsureBadge(descCell) {
    if (!descCell) return { jobEl: null, statusEl: null, wrap: null };
    let wrap = descCell.querySelector('.' + CONF.badgeClass);
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = CONF.badgeClass;
      const job = document.createElement('span'); job.className = 'job'; job.textContent = '…';
      const status = document.createElement('span'); status.className = 'status'; status.textContent = '…';
      wrap.appendChild(job); wrap.appendChild(status);
      descCell.appendChild(wrap);
    }
    return {
      wrap,
      jobEl: wrap.querySelector('.job'),
      statusEl: wrap.querySelector('.status'),
    };
  }
  function listFindRoot() {
    // find the actual scrolling list container by anchoring on the first row
    const firstRow = document.querySelector(CONF.listRowSelector);
    if (!firstRow) return null;
    const ul = firstRow.closest('ul, ol');
    if (ul) return ul;
    // fallback: climb to a container that holds multiple rows
    let p = firstRow.parentElement;
    while (p && p !== document.body) {
      if (p.querySelectorAll(CONF.listRowSelector).length >= 3) return p;
      p = p.parentElement;
    }
    return null;
  }

  // -------------------------
  // Throttled request queue (rate-limit protection)
  // -------------------------
  const queue = [];
  let pumping = false;

  function enqueue(taskFn) {
    queue.push(taskFn);
    pump();
  }

  async function pump() {
    if (pumping) return;
    pumping = true;
    while (queue.length) {
      const job = queue.shift();
      try { await job(); } catch (_) {}
      await new Promise(r => setTimeout(r, CONF.throttleMs));
    }
    pumping = false;
  }

  // --- Shared fill (API call) ---
  async function fillFromProfile({ jobEl, statusEl }, userId, apiKey) {
    if (!jobEl || !statusEl) return;

    jobEl.textContent = '…';
    statusEl.textContent = '…';
    statusEl.style.color = STATUS_COLORS.unknown;

    const url = `https://api.torn.com/user/${userId}?selections=profile&key=${encodeURIComponent(apiKey)}`;

    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        jobEl.textContent = '—';
        statusEl.textContent = 'N/A';
        statusEl.style.color = STATUS_COLORS.unknown;
        return;
      }

      const data = await res.json().catch(() => ({}));

      const statusRaw = (data?.last_action?.status || '').toString().toLowerCase();
      const relative  = data?.last_action?.relative || '';
      const jobPos    = data?.job?.position || '—';

      jobEl.textContent = jobPos;

      let color = STATUS_COLORS.unknown;
      let text;
      if (statusRaw === 'online') {
        color = STATUS_COLORS.online;  text = 'ON';
      } else if (statusRaw === 'idle') {
        color = STATUS_COLORS.idle;    text = compactRelative(relative);
      } else if (statusRaw === 'offline') {
        color = STATUS_COLORS.offline; text = compactRelative(relative);
      } else {
        color = STATUS_COLORS.unknown; text = compactRelative(relative || statusRaw || 'N/A');
      }

      statusEl.textContent = text || 'N/A';
      statusEl.style.color = color;
      statusEl.title = relative || (statusRaw ? statusRaw : 'N/A');

    } catch (_) {
      jobEl.textContent = '—';
      statusEl.textContent = 'N/A';
      statusEl.style.color = STATUS_COLORS.unknown;
    }
  }

  // --- Debounce helper ---
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  // --- main ---
  setTimeout(() => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    if (isAdvancedSearch()) {
      const seen = new Set();
      const root = advFindListRoot();

      const scan = () => {
        const scope = root || document;
        scope.querySelectorAll(CONF.advUserItemSelector).forEach(li => {
          const id = advParseUserId(li);
          if (!id || seen.has(id) || advIsHidden(li)) return;
          seen.add(id);
          const els = advEnsureBadge(li);
          enqueue(() => fillFromProfile(els, id, apiKey)); // throttled
        });
      };
      const debouncedScan = debounce(scan, CONF.debounceMs);

      // initial pass
      scan();

      // observe the actual list container (fallback to body)
      const target = root || document.body;
      new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) { debouncedScan(); break; }
        }
      }).observe(target, { childList: true, subtree: true });

    } else {
      const type = getListType() || 'targets';
      const seen = new Set();

      const scan = () => {
        document.querySelectorAll(CONF.listRowSelector).forEach(li => {
          const id = listParseUserId(li);
          if (!id || seen.has(id)) return;
          seen.add(id);
          const desc = listFindDescriptionCell(li, type);
          const els = listEnsureBadge(desc);
          if (!els.jobEl || !els.statusEl) return;
          enqueue(() => fillFromProfile(els, id, apiKey)); // throttled
        });
      };
      const debouncedScan = debounce(scan, CONF.debounceMs);

      // initial pass
      scan();

      // observe the correct list root to catch further batches
      const listRoot = listFindRoot() || document.body;
      new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) { debouncedScan(); break; }
        }
      }).observe(listRoot, { childList: true, subtree: true });

      // safety net for virtualized/lazy-loaded lists
      setInterval(scan, CONF.listRescanMs);
    }
  }, CONF.startDelayMs);

})();

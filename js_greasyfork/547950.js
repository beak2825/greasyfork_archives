// ==UserScript==
// @name         Torn – Networth in Advanced Search
// @namespace    torn.networth.userlist
// @version      3.0
// @description  Minimal: filter tt-hidden rows and fetch networth for the rest.
// @author       JohnNash
// @match        https://www.torn.com/page.php?sid=UserList*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547950/Torn%20%E2%80%93%20Networth%20in%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/547950/Torn%20%E2%80%93%20Networth%20in%20Advanced%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONF = {
    startDelayMs: 2000,
    userItemSelector: 'li[class*="user"]',
    skipHiddenClass: 'tt-hidden',
    badgeClass: 'networth-badge',
    cacheTtlMs: 60 * 60 * 1000,
    requestTimeoutMs: 12000,
    debounceMs: 120, // collapse bursts of mutations
  };

  GM_addStyle(`
    .${CONF.badgeClass} {
      position: absolute;
      right: 12px; top: 50%; transform: translateY(-50%);
      font-weight: 700; font-size: 12px; padding: 2px 6px;
      border-radius: 6px; background: rgba(0,0,0,0.35); color: #ff6b6b;
      line-height: 1; z-index: 250;
    }
    ${CONF.userItemSelector} { position: relative; }
  `);

  const getApiKey = () => GM_GetOrAsk('torn_api_key', 'Enter your Torn API key (stored locally in Tampermonkey):');
  function GM_GetOrAsk(key, promptText) {
    let v = GM_getValue(key, '');
    if (!v) {
      v = prompt(promptText, '') || '';
      if (v) GM_setValue(key, v.trim());
    }
    return v.trim();
  }

  function formatCompact(n) {
    if (n == null || isNaN(n)) return 'N/A';
    const abs = Math.abs(n);
    if (abs >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
    if (abs >= 1e9)  return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (abs >= 1e6)  return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (abs >= 1e3)  return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  function parseUserId(li) {
    const m = [...li.classList].join(' ').match(/(?:^|\s)user(\d+)(?:\s|$)/);
    if (m) return m[1];
    const a = li.querySelector('a[href*="profiles.php?XID="]');
    const m2 = a?.href.match(/XID=(\d+)/);
    return m2 ? m2[1] : null;
  }

  function isHidden(li) {
    return li.classList.contains(CONF.skipHiddenClass) || li.hasAttribute('data-hide-reason');
  }

  const cacheKey = (id) => 'networth_cache_' + id;
  function getCache(id) {
    try {
      const raw = localStorage.getItem(cacheKey(id));
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return (Date.now() - obj.t) < CONF.cacheTtlMs ? obj.v : null;
    } catch { return null; }
  }
  function setCache(id, v) {
    localStorage.setItem(cacheKey(id), JSON.stringify({ t: Date.now(), v }));
  }

  function ensureBadge(li, text='…') {
    let badge = li.querySelector('.' + CONF.badgeClass);
    if (!badge) {
      badge = document.createElement('span');
      badge.className = CONF.badgeClass;
      li.appendChild(badge);
    }
    badge.textContent = text;
    return badge;
  }

  async function fetchWithTimeout(url, timeoutMs=CONF.requestTimeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { signal: controller.signal, mode: 'cors', credentials: 'omit' });
    } finally {
      clearTimeout(timer);
    }
  }

  function processRow(li, apiKey, seen) {
    const id = parseUserId(li);
    if (!id || seen.has(id)) return;
    seen.add(id);

    if (isHidden(li)) return;

    const badge = ensureBadge(li, '…');

    const cached = getCache(id);
    if (cached != null) {
      badge.textContent = formatCompact(cached);
      return;
    }

    const url = `https://api.torn.com/user/${id}?selections=personalstats&key=${encodeURIComponent(apiKey)}`;

    fetchWithTimeout(url).then(async res => {
      if (isHidden(li)) { badge.textContent = ''; return; }
      if (!res.ok) {
        badge.textContent = 'N/A';
        badge.style.color = '#bbb';
        return;
      }
      const data = await res.json().catch(()=>({}));
      const val = data?.personalstats?.networth ?? null;
      if (typeof val === 'number') setCache(id, val);
      badge.textContent = formatCompact(val);
      if (val == null) badge.style.color = '#bbb';
    }).catch(() => { badge.textContent='N/A'; badge.style.color='#bbb'; });
  }

  // tenta encontrar o "root" da tabela/lista para limitar o observer
  function findListRoot() {
    const firstLi = document.querySelector(CONF.userItemSelector);
    if (!firstLi) return null;
    // preferir o UL/OL que contém os LIs dos users
    const ul = firstLi.closest('ul, ol');
    if (ul) return ul;
    // fallback: o pai direto que contém múltiplos LIs
    let p = firstLi.parentElement;
    while (p && p !== document.body) {
      if (p.querySelectorAll(CONF.userItemSelector).length >= 3) return p;
      p = p.parentElement;
    }
    return null;
  }

  // debounce utilitário
  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // --- main ---
  setTimeout(() => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    const seen = new Set();
    const root = findListRoot();
    const scan = () => {
      const scope = root || document;
      scope.querySelectorAll(CONF.userItemSelector).forEach(li => processRow(li, apiKey, seen));
    };
    const debouncedScan = debounce(scan, CONF.debounceMs);

    // primeira passagem
    scan();

    // observar apenas a lista (root); se falhar, cai para body
    const target = root || document.body;
    const mo = new MutationObserver(muts => {
      // só reagir a nós adicionados; não precisamos de atributos aqui
      for (const m of muts) {
        if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
          debouncedScan();
          break;
        }
      }
    });
    mo.observe(target, { childList: true, subtree: true });

  }, CONF.startDelayMs);

})();

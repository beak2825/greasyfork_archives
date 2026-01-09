// ==UserScript==
// @name         Mangadex - Hide Title Button
// @namespace    https://greasyfork.org/users/1476331-jon78
// @version      1.0
// @description  Button to hide titles.
// @author       jon78
// @license      CC0
// @match        https://mangadex.org/*
// @icon         https://mangadex.org/img/brand/mangadex-logo.svg
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561836/Mangadex%20-%20Hide%20Title%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561836/Mangadex%20-%20Hide%20Title%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------------- CONFIG ---------------- */
  const STORAGE_KEY = 'htb_hidden_titles';
  const SESSION_CACHE_KEY = 'htb_cache';

  /* --------------- STYLES & ICON --------------- */
  const HIDE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3.001 3.001 0 0 1-5.194-2.098A3 3 0 0 1 9.88 9.88m8.06 8.06A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94zM1 1l22 22"></path></svg>`;
  const HIDE_SVG_TITLE_PAGE = HIDE_SVG.replace('stroke-width="2"', 'stroke-width="3"');
  const SHOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-eye icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const SHOW_SVG_TITLE_PAGE = SHOW_SVG.replace('stroke-width="2"', 'stroke-width="3"');

  const CSS = `/* minimalized copy of the styles from the original script (kept) */
  .hide-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:1.75rem!important;height:1.75rem!important;position:absolute!important;right:0.375rem!important;top:0.375rem!important;border-radius:0.25rem!important;opacity:0.95!important;z-index:2}
  .hide-btn svg{width:1rem!important;height:1rem!important;pointer-events:none!important}
  .manga-card.cover-only>.hide-btn{background-color:rgb(var(--md-accent)/0.5)!important}
  .manga-card.dense .hide-btn,.manga-card:not(.cover-only)>.hide-btn{background-color:transparent!important}
  .manga-card.dense .status{margin-right:1.8rem}
  .manga-card .title{display:block;padding-right:2.5rem;box-sizing:border-box;white-space:normal;word-break:break-word}
  .ext-card-hidden{display:none!important}
  .hidden-titles-list{width:100%;margin:1rem 0;display:flex;flex-direction:column;color:inherit;font-size:0.875rem}
  .hidden-titles-table{display:grid;grid-template-rows:auto 1fr;gap:0.25rem;background-color:rgb(var(--md-accent));border-radius:0.25rem;padding:0.25rem}
  .hidden-titles-header{display:grid;grid-template-columns:1fr 120px 100px;align-items:center;font-size:1rem;font-weight:bold;padding:0 0.25rem;color:inherit;border-bottom:1px solid rgba(86,86,86,0.65)}
  .hidden-titles-header .header-left { display:flex; align-items:center; gap:1rem; min-width:0; }
  .hidden-titles-header .header-left h2 { margin:0; font-size:1rem; font-weight:700; line-height:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .hidden-titles-header .header-controls { margin-left:auto; display:flex; gap:0.5rem; align-items:center; }

  .hidden-titles-header>.time-cell{display:flex;align-items:center;justify-content:center}
  .hidden-titles-entry>.time-cell{display:flex;align-items:center;justify-content:flex-start;gap:0.5rem}
  .hidden-titles-titles{display:flex;flex-direction:column}
  .hidden-titles-entry{display:grid;grid-template-columns:0.99fr 130px 90px;align-items:center;width:100%;border-bottom:1px solid rgba(255,255,255,0.06);overflow:hidden;transition:background-color 0.15s ease-in-out;color:inherit;text-decoration:none}
  .hidden-titles-titles>.hidden-titles-entry:last-child{border-bottom:none;border-bottom-width:0}
  .hidden-titles-entry:hover{background-color:rgb(var(--md-accent-hover));text-decoration:none}
  .hidden-titles-entry:first-child:hover{border-radius:0.25rem 0.25rem 0 0}
  .hidden-titles-entry:last-child:hover{border-radius:0 0 0.25rem 0.25rem}
  .hidden-titles-entry>div,.hidden-titles-entry .cell{padding:0.375rem 0.5rem;box-sizing:border-box}
  .hidden-title-cover {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 0.25rem;
    flex: 0 0 48px;
  }
  .hidden-titles-entry .title-cell{display:flex;align-items:center;gap:0.4rem;overflow:hidden;min-width:0}
  .table_image_thumbnail{width:48px;height:48px;background-size:cover;background-position:center;border-radius:0.25rem;flex:0 0 48px}
  .hidden-title-flag{width:20px;height:20px;object-fit:contain;border-radius:2px;display:inline-block;vertical-align:middle;flex:0 0 20px}
  .hidden-title-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;font-weight:700}
  .hidden-titles-entry .time-cell{display:flex;align-items:center;gap:0.5rem;justify-content:flex-start}
  .hidden-titles-entry .time-cell svg{width:16px;height:16px;flex:0 0 16px}
  .hidden-titles-header>div:nth-child(3),.hidden-titles-entry>.unhide-cell{display:flex;align-items:center;justify-content:center}
  .unhide-btn{background:none;border:none;cursor:pointer;color:inherit;padding:0.25rem;font-size:0.875rem;align-self:center;line-height:1;border-radius:0.25rem;transition:background-color 0.2s ease}
  .unhide-btn:hover{background-color:rgb(var(--md-accent-30-hover))}
  .unhide-btn svg{width:1rem;height:1rem;pointer-events:none}
  .hidden-titles-entry button{-webkit-tap-highlight-color:transparent}
  .hidden-titles-entry .title-cell>*{pointer-events:auto}

  .ht-btn {
    background: rgb(var(--md-accent));
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all .1s ease-out;
  }
  .ht-btn:hover { background: rgb(var(--md-accent-hover)); }
  @media (max-width:520px){.hidden-titles-header,.hidden-titles-entry{grid-template-columns:1fr 110px 80px}}`;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ------------- Storage helpers (minimal) ------------- */
  const loadHidden = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } };
  const saveHidden = (obj) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch {}
    if (location.pathname.startsWith('/my/history')) {
      renderHiddenTitlesList();
      updateHistoryPageView(); // ensure header / feed visibility updates
    }
  };

  /* ---------- Relative time util ---------- */
  const plural = (v, unit) => `${v} ${unit}${v === 1 ? '' : 's'} ago`;
  const formatRelative = ts => {
    if (!ts) return 'N/A';
    const seconds = Math.floor((Date.now() - ts) / 1000);
    if (seconds < 60) return plural(seconds, 'second');
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return plural(minutes, 'minute');
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return plural(hours, 'hour');
    const days = Math.floor(hours / 24);
    if (days < 30) return plural(days, 'day');
    const months = Math.floor(days / 30);
    if (months < 12) return plural(months, 'month');
    const years = Math.floor(months / 12);
    return plural(years, 'year');
  };

  /* ---------- Card helpers ---------- */
  const getCardId = card => card.querySelector('a[href*="/title/"]')?.getAttribute('href')?.match(/\/title\/([0-9a-fA-F-]{36})/)?.[1] || null;
  const getCardTitle = card => card.querySelector('.title span')?.textContent?.trim() || card.querySelector('.title')?.textContent?.trim() || '';
  const getCardHref = card => card.querySelector('a[href*="/title/"]')?.getAttribute('href') || '#';
  function getCardLangCode(card) {
    const img = card.querySelector('img[src^="/img/flags/"]');
    if (!img) return null;

    const m = img.src.match(/\/img\/flags\/([a-z0-9-]+)\.svg/i);
    return m ? m[1].toLowerCase() : null;
  }

  /* ---------------- Minimal hide storage & toggle (stores only title/href/hiddenAt) ---------------- */
  function toggleHide(card) {
    const id = getCardId(card);
    if (!id) return;
    const store = loadHidden();

    if (store[id]) {
      delete store[id];
      card.classList.remove('ext-card-hidden');
    } else {
      store[id] = {
        title: getCardTitle(card),
        href: getCardHref(card),
        lang: getCardLangCode(card),
        hiddenAt: Date.now()
      };
      card.classList.add('ext-card-hidden');
    }

    saveHidden(store);
  }

  /* ---------- UI injection & card adjust (batched RAF) ---------- */
  const cardAdjustQueue = new Set();
  let rafScheduled = false;
  function scheduleAdjust() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      if (cardAdjustQueue.size === 0) return;
      const items = Array.from(cardAdjustQueue);
      cardAdjustQueue.clear();
      try {
        // measure & apply in a single batch
        const widths = items.map(card => {
          const btn = card.querySelector('.hide-btn');
          return { card, btn, width: btn ? (btn.offsetWidth + 8) : 0 };
        });
        widths.forEach(({ card, btn, width }) => {
          const title = card.querySelector('.title');
          if (!title) return;
          title.style.paddingRight = width ? (width + 'px') : '';
        });
      } catch (e) { /* silent */ }
    });
  }
  function markCardForAdjust(card) { if (!(card instanceof HTMLElement)) return; cardAdjustQueue.add(card); scheduleAdjust(); }

  window.addEventListener('resize', () => document.querySelectorAll('.manga-card').forEach(markCardForAdjust));

  function attachButtonToCard(card) {
    try {
      if (!card || card.dataset.extHideInjected === '1') return;
      if (location.pathname.startsWith('/my/history')) return;
      if (card.classList.contains('add-item')) return;
      if (card.closest && card.closest('.add-wrap')) return;
      if (card.querySelector('.add-buttons')) return;

      card.dataset.extHideInjected = '1';
      const comp = window.getComputedStyle(card);
      if (!comp.position || comp.position === 'static') card.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'hide-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Hide this title');
      btn.title = 'Hide this title';
      btn.innerHTML = HIDE_SVG;

      btn.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); toggleHide(card); });

      card.appendChild(btn);
      markCardForAdjust(card);

      const id = getCardId(card);
      if (id && loadHidden()[id]) card.classList.add('ext-card-hidden');
    } catch (err) { console.error('attachButtonToCard error', err); }
  }

  function scanAndAttach(root = document) {
    if (location.pathname.startsWith('/my/history')) return;
    (root.querySelectorAll?.('.manga-card') || []).forEach(attachButtonToCard);
    (root.querySelectorAll?.('.manga-card') || []).forEach(markCardForAdjust);
  }

  /* ---------- Title-page hide button (icon-only) ---------- */
  function getTitleIdFromPath() {
    const m = location.pathname.match(/^\/title\/([0-9a-fA-F-]{36})/);
    return m ? m[1] : null;
  }
  function getTitleTextOnPage() {
    return (document.querySelector('h1')?.textContent?.trim())
      || (document.querySelector('.font-header')?.textContent?.trim())
      || document.title.replace(' - MangaDex', '').trim();
  }

  function insertHideButtonOnTitlePageOnce() {
    // only on /title/:id pages
    if (!location.pathname.startsWith('/title/')) return;
    const id = getTitleIdFromPath();
    if (!id) return;

    // parent that holds the action buttons (from your snippet)
    const parent = document.querySelector('div[style*="grid-area: buttons"]');
    if (!parent) return;

    // the row containing buttons (flex gap-2)
    const row = parent.querySelector('.flex.gap-2') || parent.querySelector('.flex') || parent;
    if (!row) return;

    // don't duplicate
    if (row.querySelector('.title-page-hide-btn')) return;

    // create icon-only button similar to other small action buttons
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'title-page-hide-btn rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden accent';
    btn.style.minHeight = '3rem';
    btn.style.minWidth = '3rem';
    btn.setAttribute('aria-label', 'Hide this title');
    btn.title = 'Hide this title';
    // use the existing HIDE_SVG from your script
    btn.innerHTML = `<span class="flex relative items-center justify-center font-medium select-none w-full pointer-events-none" style="justify-content: center;">${HIDE_SVG_TITLE_PAGE}</span>`;

    // visual active state
    const setBtnActive = (active) => {
      const iconSpan = btn.querySelector('span');
      if (active) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        btn.title = 'Unhide this title';
        if (iconSpan) iconSpan.innerHTML = SHOW_SVG_TITLE_PAGE; // switch to eye icon
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        btn.title = 'Hide this title';
        btn.style.backgroundColor = 'rgb(var(--md-button-accent))'; // default/transparent
        if (iconSpan) iconSpan.innerHTML = HIDE_SVG_TITLE_PAGE; // switch back to eye-slash icon
      }
    };

    // initial state from storage
    try {
      const store = loadHidden();
      setBtnActive(Boolean(store[id]));
    } catch (e) {}

    // click toggles the same hide storage as cards
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const store = loadHidden();
      if (store[id]) {
        // unhide
        delete store[id];
        try { saveHidden(store); } catch (e) {}
        setBtnActive(false);
        // if there's any card on page (rare on title page) remove ext-card-hidden
        document.querySelectorAll(`.manga-card a[href*="/title/${id}"]`)?.forEach(a => a.closest('.manga-card')?.classList.remove('ext-card-hidden'));
      } else {
        // hide
        store[id] = {
          title: getTitleTextOnPage() || (`Title ${id}`),
          href: location.pathname,
          hiddenAt: Date.now()
        };
        try { saveHidden(store); } catch (e) {}
        setBtnActive(true);
      }
    });

    // small CSS to make the icon look right (scoped)
    if (!document.getElementById('title-page-hide-btn-style')) {
      const s = document.createElement('style');
      s.id = 'title-page-hide-btn-style';
      s.textContent = `
        .title-page-hide-btn { min-width: 3rem !important; min-height: 3rem !important; padding: 0.5rem !important; }
        .title-page-hide-btn svg { width: 1rem !important; height: 1rem !important; pointer-events: none; }
        .title-page-hide-btn.active { background-color: rgb(var(--md-primary)) !important; }
      `;
      document.head.appendChild(s);
    }

    // append as last child so it appears at the end of the toolbar
    row.appendChild(btn);

    // If the page's UI re-renders (some Vue replacements), re-insert the button
    // Observe the parent row for replacements and re-run insertion if removed
    const mo = new MutationObserver(() => {
      if (!row.contains(btn)) {
        try { insertHideButtonOnTitlePageOnce(); } catch (e) {}
        mo.disconnect();
      }
    });
    mo.observe(row, { childList: true, subtree: false });
  }

  // ensure insertion when the container appears (SPA): uses your wait helper
  function ensureTitleHideButton() {
    if (!location.pathname.startsWith('/title/')) return;
    // wait for the buttons container; if it appears re-run insertion
    waitForOneSelector('div[style*="grid-area: buttons"]', 3000)
      .then(() => insertHideButtonOnTitlePageOnce())
      .catch(() => { /* ignore: maybe no container yet */ });
  }

  // Call on init and on route changes
  ensureTitleHideButton();

  // Also run on location changes (you already dispatch locationchange)
  window.addEventListener('locationchange', () => {
    // slight delay to allow SPA to mount
    setTimeout(() => ensureTitleHideButton(), 60);
  });

  /* ---------- wait helper (small) ---------- */
  function waitForOneSelector(selectors, timeout = 3000) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(selectors)) selectors = [selectors];
      const found = selectors.map(s => document.querySelector(s)).find(Boolean);
      if (found) return resolve(found);

      const obs = new MutationObserver(() => {
        const el = selectors.map(s => document.querySelector(s)).find(Boolean);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => { obs.disconnect(); const el = selectors.map(s => document.querySelector(s)).find(Boolean); if (el) return resolve(el); reject(new Error('timeout waiting for selectors: ' + selectors.join(', '))); }, timeout);
    });
  }

  /* --------------- API fetch queue with token-bucket & backoff --------------- */

  // Session cache (in-memory map + persisted in sessionStorage)
  const coverCache = new Map();
  try {
    const persisted = JSON.parse(sessionStorage.getItem(SESSION_CACHE_KEY) || '{}');
    for (const [k, v] of Object.entries(persisted || {})) {
      coverCache.set(k, v);
    }
  } catch (e) {}

  // persist with cleanup and debounce
  let persistTimer = null;
  function persistCacheSoon() {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      try {
        const obj = {};
        const cutoff = Date.now() - 604800000;
        for (const [k, v] of coverCache.entries()) {
          // v may have fetchedAt
          if (v && v.fetchedAt && v.fetchedAt < cutoff) continue;
          obj[k] = v;
        }
        sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(obj));
      } catch (e) {}
    }, 1000);
  }

  // token bucket
  let tokens = 3;
  setInterval(() => {
    tokens = Math.min(3, tokens + 3);
    // schedule immediate processing when tokens refill
    processFetchQueue();
  }, 1000);

  // queue item: { id, callbacks: [fn], priority: number (higher= sooner), addedAt, attempts, nextAttemptAt }
  const fetchQueue = [];
  let inflight = 0;

  // IntersectionObserver to mark visible entries (higher priority)
  const visibilityMap = new Map(); // id => visible boolean
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const card = e.target;
      const id = getCardId(card);
      if (!id) continue;
      const isVisible = e.isIntersecting;
      visibilityMap.set(id, isVisible);
      // bump priority for visible ones
      for (const item of fetchQueue) {
        if (item.id === id) item.priority = isVisible ? 100 : item.priority;
      }
      processFetchQueue();
    }
  }, { root: null, rootMargin: '400px', threshold: 0.01 }); // prefetch when near viewport

  function observeCardVisibility(card) {
    try {
      const id = getCardId(card);
      if (!id) return;
      io.observe(card);
    } catch (e) {}
  }

  function enqueueMangaFetch(id, callback, preferVisible = false) {
    // fast path: cached
    const cached = coverCache.get(id);
    if (cached) {
      callback(cached);
      return;
    }
    // merge callbacks if already queued
    const existing = fetchQueue.find(it => it.id === id);
    if (existing) {
      existing.callbacks.push(callback);
      // bump priority if requested
      if (preferVisible) existing.priority = Math.max(existing.priority, 50);
      return;
    }
    // push new
    const priority = (preferVisible || visibilityMap.get(id)) ? 100 : 0;
    fetchQueue.push({ id, callbacks: [callback], priority, addedAt: Date.now(), attempts: 0, nextAttemptAt: 0 });
    // sort by priority & addedAt (simple)
    fetchQueue.sort((a, b) => (b.priority - a.priority) || (a.addedAt - b.addedAt));
    processFetchQueue();
  }

  function safeFetchWithTimeout(url, opts = {}, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(url, Object.assign({}, opts, { signal: controller.signal }))
      .finally(() => clearTimeout(id));
  }

  async function processFetchQueue() {
    if (inflight >= 2) return;
    if (tokens <= 0) return;
    if (fetchQueue.length === 0) return;

    // pick next eligible item whose nextAttemptAt <= now
    const now = Date.now();
    const idx = fetchQueue.findIndex(it => (it.nextAttemptAt || 0) <= now);
    if (idx === -1) return;

    // compute how many we can start
    while (tokens > 0 && inflight < 2) {
      const pickIndex = fetchQueue.findIndex(it => (it.nextAttemptAt || 0) <= Date.now());
      if (pickIndex === -1) break;
      const item = fetchQueue.splice(pickIndex, 1)[0];
      tokens = Math.max(0, tokens - 1);
      inflight++;
      (async function handle(item) {
        try {
          // double check cache before network
          if (coverCache.has(item.id)) {
            const val = coverCache.get(item.id);
            item.callbacks.forEach(fn => { try { fn(val); } catch (e) {} });
            return;
          }

          const resp = await safeFetchWithTimeout(`https://api.mangadex.org/manga/${item.id}?includes[]=cover_art`, { method: 'GET', headers: { 'Accept': 'application/json' }, credentials: 'omit' }, 15000);

          if (resp.status === 429) {
            // rate-limited: respect headers if present
            const ra = resp.headers.get('X-RateLimit-Retry-After') || resp.headers.get('Retry-After');
            const retryAfterSec = ra ? parseInt(ra, 10) : null;
            const backoffBase = 2000;
            item.attempts = (item.attempts || 0) + 1;
            const exponential = backoffBase * Math.pow(2, Math.min(item.attempts, 6));
            const waitMs = retryAfterSec ? Math.max(1000, (retryAfterSec * 1000) - Date.now()) : exponential;
            // schedule next attempt
            item.nextAttemptAt = Date.now() + waitMs;
            fetchQueue.push(item);
            // re-sort
            fetchQueue.sort((a, b) => (b.priority - a.priority) || (a.addedAt - b.addedAt));
            return;
          }

          if (!resp.ok) {
            // mark failed but cache result to avoid infinite retries
            const failureObj = { cover: '', langCode: null, fetchedAt: Date.now(), failed: true, status: resp.status };
            coverCache.set(item.id, failureObj);
            persistCacheSoon();
            item.callbacks.forEach(fn => { try { fn(failureObj); } catch (e) {} });
            return;
          }

          const json = await resp.json();

          let coverUrl = '';
          try {
            const coverRel = (json.data.relationships || []).find(r => r.type === 'cover_art');
            if (coverRel && coverRel.attributes && coverRel.attributes.fileName) {
              // use 256 size like original
              coverUrl = `https://uploads.mangadex.org/covers/${item.id}/${coverRel.attributes.fileName}.256.jpg`;
            }
          } catch (e) { coverUrl = ''; }

          const langCode = (json.data?.attributes?.originalLanguage) ? json.data.attributes.originalLanguage : null;
          const result = { cover: (coverUrl || ''), langCode: (langCode || null), fetchedAt: Date.now() };
          coverCache.set(item.id, result);
          persistCacheSoon();
          item.callbacks.forEach(fn => { try { fn(result); } catch (e) {} });
        } catch (err) {
          // network error or aborted; schedule retry with backoff
          item.attempts = (item.attempts || 0) + 1;
          const backoff = Math.min(6, item.attempts);
          const waitMs = 1000 * Math.pow(2, backoff); // 2^n * 1s
          item.nextAttemptAt = Date.now() + waitMs;
          fetchQueue.push(item);
        } finally {
          inflight = Math.max(0, inflight - 1);
          // ensure processing continues as tokens refill or work finishes
          setTimeout(processFetchQueue, 0);
        }
      })(item);

      // allow loop to continue if tokens remain
      if (tokens <= 0 || inflight >= 2) break;
    }
  }

  /* ------------ Multi-tab sync ------------ */
  window.addEventListener('storage', (ev) => {
    if (ev.key === STORAGE_KEY) {
      const store = loadHidden();
      document.querySelectorAll('.manga-card').forEach(card => {
        const id = getCardId(card);
        if (!id) return;
        if (store[id]) card.classList.add('ext-card-hidden'); else card.classList.remove('ext-card-hidden');
      });
      if (location.pathname.startsWith('/my/history')) renderHiddenTitlesList();
    }
  });

  /* ---------------- Export / Import / Unhide-all helpers ---------------- */
  function exportHiddenTitles() {
    try {
      const store = loadHidden();
      const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mangadex_hidden_titles.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      alert('Export failed: ' + e?.message);
    }
  }

  function importHiddenTitlesFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const txt = reader.result;
        const parsed = JSON.parse(txt);
        const store = loadHidden();
        let added = 0, skipped = 0;

        if (Array.isArray(parsed)) {
          // accept array of { id, title, href, hiddenAt }
          for (const it of parsed) {
            if (!it || !it.id || !it.title) { skipped++; continue; }
            store[it.id] = { title: it.title, href: it.href || '#', hiddenAt: it.hiddenAt || Date.now() };
            added++;
          }
        } else if (parsed && typeof parsed === 'object') {
          // expect mapping id -> { title, href, hiddenAt }
          for (const [k, v] of Object.entries(parsed)) {
            if (!v || !v.title) { skipped++; continue; }
            store[k] = { title: v.title, href: v.href || '#', hiddenAt: v.hiddenAt || Date.now() };
            added++;
          }
        } else {
          throw new Error('Unsupported JSON shape');
        }

        saveHidden(store);
        alert(`Import complete — added ${added} entries, skipped ${skipped} invalid entries.`);
      } catch (err) {
        alert('Import failed: ' + (err && err.message ? err.message : 'invalid file'));
      }
    };
    reader.onerror = () => alert('Failed to read file');
    reader.readAsText(file);
  }

  // hidden file input for import
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = 'application/json';
  importInput.style.display = 'none';
  importInput.addEventListener('change', (ev) => {
    const f = importInput.files && importInput.files[0];
    if (f) importHiddenTitlesFile(f);
    importInput.value = '';
  });
  document.body.appendChild(importInput);

  function startImportFlow() {
    importInput.click();
  }

  function unhideAllConfirm() {
    if (!confirm('Unhide ALL titles? This will remove all hidden titles stored locally.')) return;
    try {
      saveHidden({}); // clears and triggers rerender
      // remove ext-card-hidden from cards
      document.querySelectorAll('.manga-card.ext-card-hidden').forEach(c => c.classList.remove('ext-card-hidden'));
    } catch (e) {
      console.error('unhideAll error', e);
    }
  }

  /* ---------------- Render hidden titles with lazy fetch (updated header controls) ---------------- */
  function renderHiddenTitlesList() {
      if (!location.pathname.startsWith('/my/history')) {
          document.querySelector('#hidden-titles-history-container')?.remove();
          return;
      }

      const store = loadHidden();
      const ids = Object.keys(store).sort((a,b)=> (store[b].hiddenAt||0)-(store[a].hiddenAt||0));

      // ensure container exists (we keep it visible even if ids.length === 0)
      let container = document.querySelector('#hidden-titles-history-container');
      if (!container) {
          container = document.createElement('div');
          container.id = 'hidden-titles-history-container';
          container.className = 'hidden-titles-list';
          container.style.marginTop = '1.25rem';
          const pageContainer = document.querySelector('.page-container.wide') || document.querySelector('main') || document.body;
          pageContainer.appendChild(container);
      }

      // wipe and re-render
      container.innerHTML = '';

      // Header line: title + buttons (always shown)
      const headerLine = document.createElement('div');
      headerLine.style.display = 'flex';
      headerLine.style.justifyContent = 'space-between';
      headerLine.style.alignItems = 'center';
      headerLine.style.marginBottom = '0.5rem';

      const h2 = document.createElement('h2');
      h2.className = 'font-header text-2xl font-semibold';
      h2.textContent = 'Hidden Titles';
      headerLine.appendChild(h2);

      const buttonGroup = document.createElement('div');
      buttonGroup.style.display = 'flex';
      buttonGroup.style.gap = '0.5rem';

      const btnExport = document.createElement('button');
      btnExport.className = 'ht-btn';
      btnExport.type = 'button';
      btnExport.textContent = 'Export';
      btnExport.title = 'Export hidden titles as JSON';
      btnExport.addEventListener('click', exportHiddenTitles);
      buttonGroup.appendChild(btnExport);

      const btnImport = document.createElement('button');
      btnImport.className = 'ht-btn';
      btnImport.type = 'button';
      btnImport.textContent = 'Import';
      btnImport.title = 'Import hidden titles from JSON (merge)';
      btnImport.addEventListener('click', startImportFlow);
      buttonGroup.appendChild(btnImport);

      const btnUnhideAll = document.createElement('button');
      btnUnhideAll.className = 'ht-btn';
      btnUnhideAll.type = 'button';
      btnUnhideAll.textContent = 'Unhide all';
      btnUnhideAll.title = 'Unhide all hidden titles';
      btnUnhideAll.addEventListener('click', unhideAllConfirm);
      buttonGroup.appendChild(btnUnhideAll);

      headerLine.appendChild(buttonGroup);
      container.appendChild(headerLine);

      // Table wrapper (always present)
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'hidden-titles-table';
      container.appendChild(tableWrapper);

      // Table header row (always present)
      const tableHeader = document.createElement('div');
      tableHeader.className = 'hidden-titles-header';
      const titleCell = document.createElement('div');
      titleCell.textContent = 'Title';
      tableHeader.appendChild(titleCell);
      const timeCell = document.createElement('div');
      timeCell.className = 'time-cell';
      timeCell.textContent = 'Added';
      tableHeader.appendChild(timeCell);
      const unhideCell = document.createElement('div');
      unhideCell.textContent = 'Unhide';
      tableHeader.appendChild(unhideCell);
      tableWrapper.appendChild(tableHeader);

      // Table content container
      const titlesList = document.createElement('div');
      titlesList.className = 'hidden-titles-titles';
      tableWrapper.appendChild(titlesList);

      // If no entries — show message
      if (ids.length === 0) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'hidden-titles-empty';
        // basic styling in case CSS doesn't include it
        emptyRow.style.padding = '0.75rem';
        emptyRow.textContent = 'No hidden titles yet.';
        titlesList.appendChild(emptyRow);
        return;
      }

      // Otherwise render entries
      ids.forEach((id) => {
          const item = store[id];
          const entry = document.createElement('a');
          entry.className = 'hidden-titles-entry';
          entry.href = item.href || '#';
          entry.target = '_blank';
          entry.rel = 'noopener noreferrer';

          // Title cell
          const titleDiv = document.createElement('div');
          titleDiv.className = 'title-cell cell';
          const coverImg = document.createElement('img');
          coverImg.className = 'hidden-title-cover rounded shadow-md';
          coverImg.alt = 'Cover image';
          coverImg.loading = 'lazy';
          coverImg.src = ''; // empty until fetched
          titleDiv.appendChild(coverImg);

          const titleSpan = document.createElement('span');
          titleSpan.className = 'hidden-title-text';
          titleSpan.textContent = item.title || 'Untitled';
          titleDiv.appendChild(titleSpan);

          entry.appendChild(titleDiv);

          // Time cell
          const timeDiv = document.createElement('div');
          timeDiv.className = 'time-cell cell';
          timeDiv.style.display = 'flex';
          timeDiv.style.alignItems = 'center';
          timeDiv.style.gap = '0.25rem';

          const clockSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
          clockSvg.setAttribute('width','16'); clockSvg.setAttribute('height','16');
          clockSvg.setAttribute('fill','none'); clockSvg.setAttribute('stroke','currentColor');
          clockSvg.setAttribute('stroke-linecap','round'); clockSvg.setAttribute('stroke-linejoin','round');
          clockSvg.setAttribute('stroke-width','2'); clockSvg.setAttribute('viewBox','0 0 24 24');
          clockSvg.innerHTML = `<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>`;
          timeDiv.appendChild(clockSvg);

          const timeEl = document.createElement('time');
          timeEl.className = 'whitespace-nowrap';
          timeEl.dateTime = new Date(item.hiddenAt).toISOString();
          timeEl.title = new Date(item.hiddenAt).toLocaleString();
          timeEl.textContent = formatRelative(item.hiddenAt);
          timeDiv.appendChild(timeEl);
          entry.appendChild(timeDiv);

          // Unhide button
          const unhideDiv = document.createElement('div');
          unhideDiv.className = 'unhide-cell cell';

          const unhideBtn = document.createElement('button');
          unhideBtn.className = 'unhide-btn';
          unhideBtn.type = 'button';

          // Use SHOW_SVG instead of the old inline SVG
          unhideBtn.innerHTML = SHOW_SVG;

          unhideBtn.addEventListener('click', (ev) => {
              ev.preventDefault();
              ev.stopPropagation();

              // Remove from hidden
              const s = loadHidden();
              delete s[id];
              saveHidden(s);

              // Reveal card if present
              const card = document.querySelector(`.manga-card a[href*="/title/${id}"]`)?.closest('.manga-card');
              if (card) card.classList.remove('ext-card-hidden');

              // Refresh list
              renderHiddenTitlesList();
          });

          unhideDiv.appendChild(unhideBtn);
          entry.appendChild(unhideDiv);

          titlesList.appendChild(entry);

          // Lazy fetch for cover / flag (prefer visible)
          // Prefer visible if the corresponding card is present & observed
          const card = document.querySelector(`.manga-card a[href*="/title/${id}"]`)?.closest('.manga-card');
          if (card) observeCardVisibility(card);

          enqueueMangaFetch(id, (meta) => {
              if (!meta) return;

              // Cover
              if (meta.cover) coverImg.src = meta.cover;

              // Flag
              if (item.lang) {
                let flagImg = titleDiv.querySelector('.hidden-title-flag');
                if (!flagImg) {
                  flagImg = document.createElement('img');
                  flagImg.className = 'hidden-title-flag';
                  flagImg.style.marginLeft = '0.25rem';
                  titleDiv.insertBefore(flagImg, titleSpan);
                }

                flagImg.src = `/img/flags/${item.lang}.svg`;
                flagImg.title = item.lang.toUpperCase();
              }
          }, Boolean(card && visibilityMap.get(getCardId(card))));
      });
  }

  /* ---------- Add Hidden Titles button & highlight active link ---------- */
  function addHiddenTitlesMenuLink() {
      const SECTION_ID = 'section-Follows';
      const LINK_ID = 'section-link-_hidden_titles';

      const section = document.getElementById(SECTION_ID);
      if (!section) return;

      // Avoid duplicates
      if (!document.getElementById(LINK_ID)) {
          const link = document.createElement('a');
          link.id = LINK_ID;
          link.className = 'flex-shrink-0';
          // use hyphen variant as canonical
          link.href = '/my/history#hidden-titles';
          link.title = '';

          // Preserve Vue styling attributes if necessary
          link.setAttribute('data-v-b36f49bc', '');
          link.setAttribute('data-v-fdb87198', '');

          link.innerHTML = `
            <div data-v-b36f49bc class="list__item px-2 menu__item--hover-highlight">
              <div data-v-b36f49bc class="mx-2">Hidden Titles</div>
            </div>
          `;

          section.appendChild(link);
      }

      // Update highlighting after adding
      updateSidebarHighlight();
  }

  /* ---------- Highlight the active sidebar link ---------- */
  function updateSidebarHighlight() {
      const historyLink = document.getElementById('section-link-_my_history');
      const hiddenLink = document.getElementById('section-link-_hidden_titles');
      if (!historyLink || !hiddenLink) return;

      // accept both underscore and hyphen hash forms
      const onHidden = (location.hash === '#hidden_titles' || location.hash === '#hidden-titles');

      // Remove all previous highlights
      [historyLink, hiddenLink].forEach(link => {
          link.classList.remove('router-link-active', 'router-link-exact-active');
          link.querySelector('.list__item')?.classList.remove('menu__item--active-highlight');
      });

      // Apply correct highlight
      if (onHidden) {
          hiddenLink.classList.add('router-link-active', 'router-link-exact-active');
          hiddenLink.querySelector('.list__item')?.classList.add('menu__item--active-highlight');
      } else if (location.pathname.startsWith('/my/history')) {
          historyLink.classList.add('router-link-active', 'router-link-exact-active');
          historyLink.querySelector('.list__item')?.classList.add('menu__item--active-highlight');
      }
  }

  /* ---------- Sidebar observer ---------- */
  function updateSidebarMenu() {
      addHiddenTitlesMenuLink(); // add button if missing and update highlight
  }

  // Observe for SPA DOM changes
  const menuObserver = new MutationObserver(updateSidebarMenu);
  menuObserver.observe(document.body, { childList: true, subtree: true });

  // Initial call
  updateSidebarMenu();

  // Re-run on SPA navigation & hash changes
  window.addEventListener('locationchange', () => setTimeout(updateSidebarHighlight, 20));
  window.addEventListener('hashchange', updateSidebarHighlight);

  /* ---------- Init & SPA handling (optimized observer) ---------- */
  function init() {
    scanAndAttach(document);
    if (location.pathname.startsWith('/my/history')) {
      waitForOneSelector(['.page-container.wide', 'main', '.md-content'], 2500)
        .then(() => { renderHiddenTitlesList(); updateSidebarHighlight(); updateHistoryPageView(); })
        .catch(() => { renderHiddenTitlesList(); updateSidebarHighlight(); updateHistoryPageView(); });
    }

    function findListRoot() {
      return document.querySelector('.manga-list') || document.querySelector('.manga-grid') || document.querySelector('#content') || document.querySelector('main') || document.body;
    }

    let mutationDebounceTimer = null;
    function onMutationsBatch(mutations) {
      const addedCards = new Set();
      for (const m of mutations) {
        if (!m.addedNodes) continue;
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches && node.matches('.manga-card')) addedCards.add(node);
          else if (node.querySelector) {
            node.querySelectorAll?.('.manga-card')?.forEach(c => addedCards.add(c));
          }
        });
        if (m.type === 'attributes') {
          const card = m.target.closest?.('.manga-card');
          if (card) addedCards.add(card);
        }
      }

      if (addedCards.size) {
        addedCards.forEach(card => { try { attachButtonToCard(card); observeCardVisibility(card); } catch (e) {} });
        addedCards.forEach(card => markCardForAdjust(card));
      }

      if (mutationDebounceTimer) clearTimeout(mutationDebounceTimer);
      mutationDebounceTimer = setTimeout(() => {
        mutationDebounceTimer = null;
        if (addedCards.size === 0) {
          const root = (document.querySelector('.manga-list') || document.querySelector('#content') || document.querySelector('main') || document.body);
          (root.querySelectorAll?.('.manga-card') || []).forEach(markCardForAdjust);
        }
      }, 100);
    }

    const listRoot = findListRoot();
    const listObserver = new MutationObserver(mutations => onMutationsBatch(mutations));
    try {
      listObserver.observe(listRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    } catch (e) {
      try { listObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] }); } catch (e2) {}
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ---------- Hook SPA history ---------- */
  (function(){
    const _wr = function(type){ const orig = history[type]; return function(){ const rv = orig.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); return rv; }; };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    window.addEventListener('popstate', ()=>window.dispatchEvent(new Event('locationchange')));
  })();

  let locationChangeTimer = null;
  window.addEventListener('locationchange', () => {
    if (locationChangeTimer) clearTimeout(locationChangeTimer);
    locationChangeTimer = setTimeout(() => { locationChangeTimer = null; handleRouteChange(); }, 50);
  });

  /* ---------- History page view transform (swap to Hidden Titles when hash present) ---------- */
  let _originalHistoryHeaderText = null;
  function updateHistoryPageView() {
    // Only consider /my/history pages
    if (!location.pathname.startsWith('/my/history')) {
      // if leaving history page, restore header text if we stored it
      const pageContainer = document.querySelector('.page-container.wide');
      if (pageContainer) {
        const h2 = pageContainer.querySelector('h2');
        if (h2 && _originalHistoryHeaderText) h2.textContent = _originalHistoryHeaderText;
        // remove our container
        document.querySelector('#hidden-titles-history-container')?.remove();
        // unhide original feed area
        const feed = pageContainer.querySelector('div[start]');
        if (feed) feed.style.display = '';
      }
      return;
    }

    const onHidden = (location.hash === '#hidden_titles' || location.hash === '#hidden-titles');
    const pageContainer = document.querySelector('.page-container.wide');
    if (!pageContainer) return;

    // Header h2
    const headerH2 = pageContainer.querySelector('h2');
    if (headerH2 && !_originalHistoryHeaderText) _originalHistoryHeaderText = headerH2.textContent;

    if (onHidden) {
      // change header text
      if (headerH2) headerH2.textContent = 'Hidden Titles';

      // hide original history feed region (the first big div after header often contains the feed)
      const feed = pageContainer.querySelector('div[start]') || headerH2?.parentElement?.nextElementSibling;
      if (feed) feed.style.display = 'none';

      // ensure our Hidden Titles container is present (render will create it)
      renderHiddenTitlesList();

    } else {
      // restore header and show feed
      if (headerH2 && _originalHistoryHeaderText) headerH2.textContent = _originalHistoryHeaderText;
      const feed = pageContainer.querySelector('div[start]') || headerH2?.parentElement?.nextElementSibling;
      if (feed) feed.style.display = '';
      // remove our container
      document.querySelector('#hidden-titles-history-container')?.remove();
    }
  }

  function handleRouteChange() {
    if (location.pathname.startsWith('/my/history')) {
      waitForOneSelector(['.page-container.wide', 'main', '.md-content'], 3000)
        .then(() => { renderHiddenTitlesList(); updateSidebarHighlight(); updateHistoryPageView(); })
        .catch(() => { renderHiddenTitlesList(); updateSidebarHighlight(); updateHistoryPageView(); });
    } else {
      // leaving history
      document.querySelector('#hidden-titles-history-container')?.remove();
      waitForOneSelector(['.manga-list', '.manga-card', '.page-container.wide', 'main', '.md-content'], 1500)
        .then(()=>setTimeout(()=>scanAndAttach(document),80))
        .catch(()=>scanAndAttach(document));
    }
  }

  handleRouteChange();

  // keep sidebar highlight / page transform in sync with hash changes
  window.addEventListener('hashchange', () => {
    updateSidebarHighlight();
    updateHistoryPageView();
  });

})();

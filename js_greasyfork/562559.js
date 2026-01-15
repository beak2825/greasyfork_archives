// ==UserScript==
// @name         Ratinguri OLX pe pagina cu produse
// @description  Arata ratingurile de pe pagina cu produse
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        https://www.olx.ro/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      rating-cdn.css.olx.io
// @downloadURL https://update.greasyfork.org/scripts/562559/Ratinguri%20OLX%20pe%20pagina%20cu%20produse.user.js
// @updateURL https://update.greasyfork.org/scripts/562559/Ratinguri%20OLX%20pe%20pagina%20cu%20produse.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  // ----------------------------
  // Constants
  // ----------------------------
  const DEBUG = false; // Set to true for debug logging
  const CARD_SEL = 'div[data-cy="l-card"], div[data-testid="l-card"]';
  const MAX_CONCURRENT = 3;
  const MIN_SPACING_MS = 200;
  const DEBOUNCE_DELAY = 80;
  const IDLE_TIMEOUT = 800;
  const STATE_CHECK_INTERVAL = 2000; // Reduced frequency
  const URL_STABILIZE_DELAY = 800;
  const CACHE_KEY = 'olx_rating_cache';
  const CACHE_VERSION = 'v1';
  const MAX_CACHE_ENTRIES = 10000; // Maximum number of ratings to cache
  const CACHE_MAX_AGE_DAYS = 30; // Maximum cache age in days

  // CSS injected once
  const CSS = `
    .olx-rating-rowwrap{display:flex;align-items:stretch;gap:12px;width:100%;max-width:100%;justify-content:center}
    .olx-rating-cardhost{flex:0 0 75%;min-width:0}
    .olx-rating-box{flex:0 0 25%;border:4px solid var(--olx-accent,red);box-sizing:border-box;background:rgba(var(--olx-accent-rgb,255,0,0),.06);color:var(--olx-accent,red);padding:12px;display:none;align-items:center;justify-content:center;overflow:hidden}
    .olx-rating-rowwrap[data-olx-show-rating="1"]>.olx-rating-box{display:flex}
    .olx-rating-rowwrap[data-olx-show-rating="0"]{justify-content:flex-start}
    .olx-rating-rowwrap[data-olx-show-rating="0"]>.olx-rating-cardhost{flex-basis:100%}
    .olx-rating-inner{width:100%;display:flex;gap:12px;align-items:center}
    .olx-rating-left{width:110px;flex:0 0 110px}
    .olx-rating-score{font-weight:700;display:flex;align-items:baseline;gap:6px}
    .olx-rating-score .val{font-size:28px;line-height:1}
    .olx-rating-score .max{font-size:14px;opacity:.85}
    .olx-rating-stars{margin-top:4px;font-size:14px;letter-spacing:1px}
    .olx-rating-meta{margin-top:4px;font-size:12px;opacity:.95}
    .olx-rating-meta.small{margin-top:3px;font-size:12px;opacity:.85}
    .olx-rating-divider{width:1px;align-self:stretch;background:rgba(var(--olx-accent-rgb,255,0,0),.35)}
    .olx-rating-right{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0}
    .olx-rating-row{display:flex;align-items:center;gap:8px}
    .olx-rating-label{width:28px;text-align:right;font-weight:600}
    .olx-rating-bar{flex:1;height:6px;background:rgba(var(--olx-accent-rgb,255,0,0),.18);border-radius:999px;overflow:hidden}
    .olx-rating-barfill{height:100%;width:0%;background:var(--olx-accent,red)}
    .olx-rating-count{width:22px;text-align:left;font-weight:600}
    .olx-rating-state{opacity:.8;text-align:center;font:14px/1.2 monospace}
    @media (max-width:1100px){.olx-rating-cardhost{flex-basis:70%}.olx-rating-box{flex-basis:30%}}
  `;

  // ----------------------------
  // State
  // ----------------------------
  const state = {
    uuidByAdId: new Map(),
    ratingByUuid: new Map(),
    lastRenderKeyByCard: new WeakMap(),
    processedCards: new WeakSet(),
    visibleCards: new WeakSet(),
    queuedUuids: new Set(),
    inFlightUuids: new Set(),
    queue: [],
    lastRequestAt: 0,
    io: null,
    stateCheckInterval: null,
    hasPrerenderedState: false,
    lastUrl: location.href,
    urlChangeTimeout: null,
    urlChangeDebounceTimer: null,
    updateScheduled: false,
    cssInjected: false,
    cacheSaveTimer: null,
    cacheNeedsSave: false
  };

  // ----------------------------
  // CSS Injection
  // ----------------------------
  function injectCss() {
    if (state.cssInjected) return;
    const style = document.createElement('style');
    style.id = 'olx-rating-css';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
    state.cssInjected = true;
  }

  // ----------------------------
  // Utility Functions
  // ----------------------------
  const debugLog = (...args) => {
    if (DEBUG) console.log('[OLX Rating]', ...args);
  };

  // ----------------------------
  // Persistent Cache Management
  // ----------------------------
  function loadCacheFromSession() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return 0;

      const parsed = JSON.parse(cached);
      if (parsed.version !== CACHE_VERSION) {
        debugLog('Cache version mismatch, clearing');
        localStorage.removeItem(CACHE_KEY);
        return 0;
      }

      // Check cache age
      const cacheAgeMs = Date.now() - (parsed.timestamp || 0);
      const cacheAgeDays = cacheAgeMs / (1000 * 60 * 60 * 24);
      if (cacheAgeDays > CACHE_MAX_AGE_DAYS) {
        debugLog(`Cache too old (${cacheAgeDays.toFixed(1)} days), clearing`);
        localStorage.removeItem(CACHE_KEY);
        return 0;
      }

      let loaded = 0;
      for (const [uuid, entry] of Object.entries(parsed.data || {})) {
        if (!state.ratingByUuid.has(uuid)) {
          state.ratingByUuid.set(uuid, entry);
          loaded++;
        }
      }

      debugLog(`Loaded ${loaded} ratings from cache (age: ${cacheAgeDays.toFixed(1)} days)`);
      return loaded;
    } catch (e) {
      debugLog('Failed to load cache:', e);
      return 0;
    }
  }

  function saveCacheToSession() {
    try {
      const data = {};
      const entries = [];

      // Collect all completed entries with timestamps
      for (const [uuid, entry] of state.ratingByUuid.entries()) {
        if (entry.status === 'ok' || entry.status === 'none') {
          entries.push({ uuid, entry });
        }
      }

      // If we exceed the limit, keep only the most recent entries
      if (entries.length > MAX_CACHE_ENTRIES) {
        debugLog(`Cache limit reached (${entries.length}/${MAX_CACHE_ENTRIES}), trimming oldest entries`);
        // Sort by timestamp (most recent first) - entries without timestamp go to end
        entries.sort((a, b) => {
          const aTime = a.entry.timestamp || 0;
          const bTime = b.entry.timestamp || 0;
          return bTime - aTime;
        });
        // Keep only MAX_CACHE_ENTRIES most recent
        entries.splice(MAX_CACHE_ENTRIES);
      }

      // Build data object
      for (const { uuid, entry } of entries) {
        // Add timestamp if not present
        if (!entry.timestamp) {
          entry.timestamp = Date.now();
        }
        data[uuid] = entry;
      }

      const cacheObj = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        data
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
      debugLog(`Saved ${Object.keys(data).length} ratings to cache`);
      state.cacheNeedsSave = false;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        debugLog('localStorage quota exceeded, clearing old cache');
        // Try to clear and save again with fewer entries
        localStorage.removeItem(CACHE_KEY);
        // Reduce max entries and try again
        const reducedEntries = Math.floor(MAX_CACHE_ENTRIES / 2);
        debugLog(`Retrying with reduced cache size: ${reducedEntries}`);
        // This is a simple fallback - in production you might want more sophisticated handling
      } else {
        debugLog('Failed to save cache:', e);
      }
    }
  }

  function scheduleCacheSave() {
    state.cacheNeedsSave = true;

    // Clear existing timer
    if (state.cacheSaveTimer) {
      clearTimeout(state.cacheSaveTimer);
    }

    // Debounce: only save after 2 seconds of no new requests
    state.cacheSaveTimer = setTimeout(() => {
      if (state.cacheNeedsSave) {
        saveCacheToSession();
      }
    }, 2000);
  }

  const hexToRgbStr = (hex) => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(full, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  };

  const accentForRating = (value) => {
    if (value >= 4.995) return '#ADD8E6';
    if (value >= 4.0) return '#84CC16';
    if (value >= 3.0) return '#FFFF00';
    if (value >= 2.0) return '#F97316';
    if (value >= 1.0) return '#FF6B6B';
    return '#800020';
  };

  const starsString = (value) => {
    const n = Math.max(0, Math.min(5, Math.round(value)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  };

  const buildRenderKey = (entry) => {
    if (!entry) return 'none';
    if (entry.status !== 'ok') return entry.status;
    const j = entry.data || {};
    const value = typeof j.value === 'number' ? j.value.toFixed(2) : 'na';
    const t = j?.ratings?.totalCount ?? 'na';
    const d = j?.ratings?.deletedCount ?? 'na';
    const det = j?.details || {};
    return `ok|${value}|${t}|${d}|${det.stars_1 ?? 0}|${det.stars_2 ?? 0}|${det.stars_3 ?? 0}|${det.stars_4 ?? 0}|${det.stars_5 ?? 0}`;
  };

  // ----------------------------
  // Visibility Observer
  // ----------------------------
  function ensureIntersectionObserver() {
    if (state.io) return;
    state.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const card = e.target;
        if (e.isIntersecting) {
          state.visibleCards.add(card);
          processCard(card);
        } else {
          state.visibleCards.delete(card);
          const wrapper = getWrapperForCard(card);
          if (wrapper) wrapper.dataset.olxShowRating = '0';
        }
      }
    }, { threshold: 0.01 });
  }

  // ----------------------------
  // DOM Manipulation
  // ----------------------------
  function getWrapperForCard(card) {
    const host = card.parentElement;
    const wrapper = host?.parentElement;
    return wrapper?.classList.contains('olx-rating-rowwrap') ? wrapper : null;
  }

  function getBoxForCard(card) {
    const wrapper = getWrapperForCard(card);
    return wrapper?.querySelector(':scope > .olx-rating-box') || null;
  }

  function ensureWrapped(card) {
    if (state.processedCards.has(card)) return;
    const parent = card.parentElement;
    if (!parent) return;

    if (parent.classList.contains('olx-rating-cardhost') &&
        parent.parentElement?.classList.contains('olx-rating-rowwrap')) {
      state.processedCards.add(card);
      return;
    }

    injectCss();

    const wrapper = document.createElement('div');
    wrapper.className = 'olx-rating-rowwrap';
    wrapper.dataset.olxShowRating = '0';

    const host = document.createElement('div');
    host.className = 'olx-rating-cardhost';

    const box = document.createElement('div');
    box.className = 'olx-rating-box';
    box.innerHTML = '<div class="olx-rating-state">Se încarcă…</div>';

    parent.insertBefore(wrapper, card);
    host.appendChild(card);
    wrapper.appendChild(host);
    wrapper.appendChild(box);

    state.processedCards.add(card);
    ensureIntersectionObserver();
    state.io.observe(card);
  }

  // ----------------------------
  // Rendering
  // ----------------------------
  function applyBoxColor(box, value) {
    const accent = accentForRating(value);
    box.style.setProperty('--olx-accent', accent);
    box.style.setProperty('--olx-accent-rgb', hexToRgbStr(accent));
  }

  function createBarHtml(star, count, maxCount) {
    const pct = Math.round((count / maxCount) * 100);
    return `<div class="olx-rating-row"><div class="olx-rating-label">${star}★</div><div class="olx-rating-bar"><div class="olx-rating-barfill" style="width:${pct}%"></div></div><div class="olx-rating-count">${count}</div></div>`;
  }

  function renderBox(box, entry) {
    if (!entry || entry.status === 'loading') {
      box.innerHTML = '<div class="olx-rating-state">Se încarcă…</div>';
      applyBoxColor(box, 1.0);
      return;
    }
    if (entry.status === 'none') {
      box.innerHTML = '<div class="olx-rating-state">Nu are ratinguri</div>';
      applyBoxColor(box, 1.0);
      return;
    }

    const j = entry.data || {};
    const value = typeof j.value === 'number' ? j.value : 0;

    // Hide box for 0.0 rating
    if (value === 0) {
      return;
    }

    const total = j?.ratings?.totalCount ?? 0;
    const deleted = j?.ratings?.deletedCount ?? 0;
    const det = j?.details || {};
    const counts = [det.stars_1 ?? 0, det.stars_2 ?? 0, det.stars_3 ?? 0, det.stars_4 ?? 0, det.stars_5 ?? 0];
    const maxCount = Math.max(1, ...counts);

    applyBoxColor(box, value);

    box.innerHTML = `
      <div class="olx-rating-inner">
        <div class="olx-rating-left">
          <div class="olx-rating-score"><span class="val">${value.toFixed(1)}</span><span class="max">/ 5</span></div>
          <div class="olx-rating-stars">${starsString(value)}</div>
          <div class="olx-rating-meta">${total} ratinguri</div>
          <div class="olx-rating-meta small">${deleted} ratinguri șterse</div>
        </div>
        <div class="olx-rating-divider"></div>
        <div class="olx-rating-right">
          ${createBarHtml(5, counts[4], maxCount)}
          ${createBarHtml(4, counts[3], maxCount)}
          ${createBarHtml(3, counts[2], maxCount)}
          ${createBarHtml(2, counts[1], maxCount)}
          ${createBarHtml(1, counts[0], maxCount)}
        </div>
      </div>`;
  }

  // ----------------------------
  // API Request Management
  // ----------------------------
  function requestJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'accept': 'application/json' },
        onload: (res) => {
          try { resolve(JSON.parse(res.responseText || '')); }
          catch (e) { reject(e); }
        },
        onerror: reject,
        ontimeout: () => reject(new Error('timeout')),
        timeout: 15000
      });
    });
  }

  function enqueueUuid(uuid) {
    if (!uuid || state.ratingByUuid.has(uuid) ||
        state.queuedUuids.has(uuid) || state.inFlightUuids.has(uuid)) return;

    // Check if we already have cached data for this UUID
    const cached = state.ratingByUuid.get(uuid);
    if (cached) {
      debugLog(`Using cached rating for ${uuid}`);
      return;
    }

    state.queuedUuids.add(uuid);
    state.ratingByUuid.set(uuid, { status: 'loading' });
    state.queue.push(uuid);
    pumpQueue();
  }

  function pumpQueue() {
    if (state.inFlightUuids.size >= MAX_CONCURRENT || !state.queue.length) return;

    const now = Date.now();
    const wait = Math.max(0, (state.lastRequestAt + MIN_SPACING_MS) - now);
    if (wait > 0) {
      setTimeout(pumpQueue, wait);
      return;
    }

    while (state.inFlightUuids.size < MAX_CONCURRENT && state.queue.length) {
      const uuid = state.queue.shift();
      state.queuedUuids.delete(uuid);
      state.inFlightUuids.add(uuid);
      state.lastRequestAt = Date.now();

      const url = `https://rating-cdn.css.olx.io/ratings/v1/public/olxro/user/${encodeURIComponent(uuid)}/score/details?includeDeletedRatings=true`;

      requestJson(url)
        .then(j => {
          const total = j?.ratings?.totalCount ?? 0;
          state.ratingByUuid.set(uuid, total ? { status: 'ok', data: j } : { status: 'none' });
          scheduleCacheSave(); // Debounced save
          scheduleApplyToAllVisibleCards();
        })
        .catch(() => {
          state.ratingByUuid.set(uuid, { status: 'none' });
          scheduleCacheSave(); // Debounced save
          scheduleApplyToAllVisibleCards();
        })
        .finally(() => {
          state.inFlightUuids.delete(uuid);
          pumpQueue();
        });
    }
  }

  // ----------------------------
  // Card Processing
  // ----------------------------
  function processCard(card) {
    if (!(card instanceof Element)) return;

    ensureWrapped(card);

    if (!state.visibleCards.has(card)) {
      const wrapper = getWrapperForCard(card);
      if (wrapper) wrapper.dataset.olxShowRating = '0';
      return;
    }

    const adId = card.getAttribute('id');
    const uuid = adId ? state.uuidByAdId.get(adId) : null;
    if (!uuid) return;

    enqueueUuid(uuid);

    const entry = state.ratingByUuid.get(uuid);
    const wrapper = getWrapperForCard(card);
    const box = getBoxForCard(card);
    if (!wrapper || !box) return;

    // Hide box for loading, none, or 0.0 rating
    if (!entry || entry.status === 'loading' || entry.status === 'none') {
      wrapper.dataset.olxShowRating = '0';
      return;
    }

    // Check if rating value is 0.0
    const value = entry.data?.value;
    if (typeof value === 'number' && value === 0) {
      wrapper.dataset.olxShowRating = '0';
      return;
    }

    wrapper.dataset.olxShowRating = '1';

    const key = buildRenderKey(entry);
    if (state.lastRenderKeyByCard.get(card) === key) return;

    renderBox(box, entry);
    state.lastRenderKeyByCard.set(card, key);
  }

  function processCardsIn(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(CARD_SEL)) {
      processCard(root);
    } else {
      root.querySelectorAll(CARD_SEL).forEach(processCard);
    }
  }

  function scheduleApplyToAllVisibleCards() {
    if (state.updateScheduled) return;
    state.updateScheduled = true;

    const run = () => {
      state.updateScheduled = false;
      injectCss();
      document.querySelectorAll(CARD_SEL).forEach(processCard);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT });
    } else {
      setTimeout(run, DEBOUNCE_DELAY);
    }
  }

  // ----------------------------
  // DOM Observer
  // ----------------------------
  function observeDomForCards() {
    const mo = new MutationObserver((mutations) => {
      let hasNewCards = false;

      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (!(n instanceof Element)) continue;
          if (n.matches(CARD_SEL) || n.querySelector(CARD_SEL)) {
            hasNewCards = true;
            processCardsIn(n);
          }
        }
      }

      if (hasNewCards) {
        debugLog('New cards detected');
        tryIndexStateAgain();
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  // ----------------------------
  // State Parsing
  // ----------------------------
  function parsePossiblyEscapedState(raw) {
    if (raw == null || typeof raw === 'object') return raw;

    let v = raw;
    for (let i = 0; i < 3; i++) {
      if (v && typeof v === 'object') return v;
      const s = String(v).trim();

      try {
        v = JSON.parse(s);
        if (typeof v !== 'string') return v;
      } catch (_) {
        // Try eval as last resort
        try {
          v = (new Function('return (' + s + ');'))();
          if (typeof v === 'object') return v;
        } catch (_) {}
      }
    }

    return typeof v === 'object' ? v : null;
  }

  function indexUuidsFromState(state_obj) {
    const ads = state_obj?.listing?.listing?.ads;
    if (!Array.isArray(ads) || !ads.length) return 0;

    let changed = 0;
    for (const ad of ads) {
      const uuid = ad?.user?.uuid;
      const adId = ad?.id ?? ad?.adId ?? ad?.offerId ?? ad?.listingId ?? ad?.advertId;
      if (!uuid || adId == null) continue;

      const key = String(adId);
      const val = String(uuid);
      if (state.uuidByAdId.get(key) !== val) {
        state.uuidByAdId.set(key, val);
        changed++;
      }
    }

    if (changed) {
      debugLog(`Indexed ${changed} new UUIDs from __PRERENDERED_STATE__`);
      scheduleApplyToAllVisibleCards();
    }
    return changed;
  }

  function handleRawState(raw) {
    const parsed = parsePossiblyEscapedState(raw);
    if (!parsed) return;
    state.hasPrerenderedState = true;
    indexUuidsFromState(parsed);
  }

  function tryIndexStateAgain() {
    if (w.__PRERENDERED_STATE__ != null) {
      handleRawState(w.__PRERENDERED_STATE__);
    }
  }

  function hookWindowSetter() {
    try {
      let internalValue = w.__PRERENDERED_STATE__;
      Object.defineProperty(w, '__PRERENDERED_STATE__', {
        configurable: true,
        get() { return internalValue; },
        set(v) {
          internalValue = v;
          debugLog('__PRERENDERED_STATE__ updated');
          handleRawState(v);
        }
      });
      if (internalValue != null) handleRawState(internalValue);
    } catch (_) {
      const t0 = Date.now();
      const timer = setInterval(() => {
        if (w.__PRERENDERED_STATE__ != null) {
          clearInterval(timer);
          handleRawState(w.__PRERENDERED_STATE__);
        } else if (Date.now() - t0 > 15000) {
          clearInterval(timer);
        }
      }, 250);
    }
  }

  // ----------------------------
  // GraphQL Interception
  // ----------------------------
  function setupGraphQLInterception() {
    const inject = (fn) => {
      const s = document.createElement("script");
      s.textContent = `(${fn.toString()})();`;
      (document.documentElement || document.head || document.body).appendChild(s);
      s.remove();
    };

    inject(function () {
      const TARGET_SUBSTR = "/apigateway/graphql";
      const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;

      window.__olxGraphQLData = window.__olxGraphQLData || [];

      function extractUUIDsFromResponse(json) {
        const results = [];
        const listings = json?.data?.clientCompatibleListings?.data;

        if (Array.isArray(listings)) {
          for (const item of listings) {
            const uuidMatch = item?.user?.uuid?.match(UUID_RE);
            const uuid = uuidMatch ? uuidMatch[0].toLowerCase() : null;
            const adId = item?.id ?? item?.adId ?? item?.offerId;
            if (uuid && adId) {
              results.push({ uuid, adId: String(adId) });
            }
          }
        }

        return results;
      }

      function handleJson(json, sourceLabel) {
        if (!json || typeof json !== "object") return;

        const extracted = extractUUIDsFromResponse(json);
        if (extracted.length > 0) {
          if (window.__OLX_DEBUG) console.log(`[OLX Rating] GraphQL: extracted ${extracted.length} UUIDs`);
          window.__olxGraphQLData.push(...extracted);
          window.dispatchEvent(new CustomEvent('olxGraphQLData', { detail: extracted }));
        }
      }

      // Hook fetch
      const origFetch = window.fetch;
      if (typeof origFetch === "function") {
        window.fetch = function (...args) {
          const url = typeof args[0] === "string" ? args[0] : args[0]?.url || "";

          return origFetch.apply(this, args).then((res) => {
            if (url.includes(TARGET_SUBSTR) && res?.clone) {
              res.clone().text()
                .then(t => handleJson(JSON.parse(t), `fetch: ${url}`))
                .catch(() => {});
            }
            return res;
          });
        };
      }

      // Hook XHR
      const XHR = window.XMLHttpRequest;
      if (XHR?.prototype) {
        const origOpen = XHR.prototype.open;
        const origSend = XHR.prototype.send;

        XHR.prototype.open = function (method, url, ...rest) {
          this.__olx_url = url;
          return origOpen.call(this, method, url, ...rest);
        };

        XHR.prototype.send = function (...sendArgs) {
          const url = this.__olx_url || "";
          if (url.includes(TARGET_SUBSTR)) {
            this.addEventListener("load", () => {
              try {
                const json = JSON.parse(this.responseText);
                handleJson(json, `xhr: ${url}`);
              } catch (_) {}
            });
          }
          return origSend.apply(this, sendArgs);
        };
      }

      if (window.__OLX_DEBUG) console.log("[OLX Rating] GraphQL interceptor active");
    });

    window.addEventListener('olxGraphQLData', (e) => {
      const data = e.detail;
      if (!Array.isArray(data)) return;

      let changed = 0;
      for (const item of data) {
        if (!item.uuid || !item.adId) continue;
        if (state.uuidByAdId.get(item.adId) !== item.uuid) {
          state.uuidByAdId.set(item.adId, item.uuid);
          changed++;
        }
      }

      if (changed > 0) {
        debugLog(`Indexed ${changed} new UUIDs from GraphQL`);
        scheduleApplyToAllVisibleCards();
      }
    });

    debugLog('GraphQL interception setup complete');
  }

  // ----------------------------
  // Periodic State Check
  // ----------------------------
  function startPeriodicStateCheck() {
    if (state.stateCheckInterval) return;

    state.stateCheckInterval = setInterval(() => {
      const cards = document.querySelectorAll(CARD_SEL);
      if (!cards.length) return;

      let missingUuids = 0;
      for (const card of cards) {
        const adId = card.getAttribute('id');
        if (adId && !state.uuidByAdId.has(adId)) missingUuids++;
      }

      if (missingUuids > 0) {
        debugLog(`${missingUuids} cards without UUIDs`);
        tryIndexStateAgain();
      }
    }, STATE_CHECK_INTERVAL);
  }

  // ----------------------------
  // URL Change Handling
  // ----------------------------
  function resetPageState() {
    debugLog('Resetting page state');
    state.uuidByAdId.clear();
    state.hasPrerenderedState = false;
    // Note: We intentionally do NOT clear ratingByUuid here
    // so ratings persist across page navigations

    if (state.stateCheckInterval) {
      clearInterval(state.stateCheckInterval);
      state.stateCheckInterval = null;
    }

    if (w.__olxGraphQLData) w.__olxGraphQLData.length = 0;
  }

  function rerunForCurrentUrl() {
    debugLog('Processing URL:', location.href.substring(0, 80));
    tryIndexStateAgain();
    scheduleApplyToAllVisibleCards();
    if (!state.stateCheckInterval) startPeriodicStateCheck();
  }

  function onUrlChange() {
    const now = location.href;
    if (now === state.lastUrl) return;

    debugLog('URL changed');
    state.lastUrl = now;

    if (state.urlChangeTimeout) clearTimeout(state.urlChangeTimeout);
    if (state.urlChangeDebounceTimer) clearTimeout(state.urlChangeDebounceTimer);

    resetPageState();

    state.urlChangeDebounceTimer = setTimeout(() => {
      debugLog('URL stabilized');
      rerunForCurrentUrl();
      setTimeout(rerunForCurrentUrl, 300);
      setTimeout(rerunForCurrentUrl, 600);
      state.urlChangeTimeout = setTimeout(rerunForCurrentUrl, 1200);
    }, URL_STABILIZE_DELAY);
  }

  function hookHistoryUrlChanges() {
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    history.pushState = function (...args) {
      const r = _pushState.apply(this, args);
      onUrlChange();
      return r;
    };

    history.replaceState = function (...args) {
      const r = _replaceState.apply(this, args);
      onUrlChange();
      return r;
    };

    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('hashchange', onUrlChange);
  }

  // ----------------------------
  // Initialization
  // ----------------------------
  function init() {
    debugLog('Script (optimized with debounced cache)');

    // Load cached ratings from localStorage
    const cacheCount = loadCacheFromSession();
    if (cacheCount > 0) {
      debugLog(`Restored ${cacheCount} ratings from cache`);
    }

    injectCss();
    scheduleApplyToAllVisibleCards();
    observeDomForCards();
    rerunForCurrentUrl();
    startPeriodicStateCheck();
  }

  // Set debug flag on window for injected GraphQL script
  w.__OLX_DEBUG = DEBUG;

  hookHistoryUrlChanges();
  hookWindowSetter();
  setupGraphQLInterception();

  // Save cache before page unload
  window.addEventListener('beforeunload', () => {
    if (state.cacheNeedsSave) {
      saveCacheToSession();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
// ==UserScript==
// @name         Reddit community list Join buttons
// @namespace    https://github.com/quantavil/reddit-join
// @version      0.8
// @description  Add Reddit's native Join/Joined button with 2-column grid layout, using /subreddits/mine for accurate state
// @author       you
// @match        https://www.reddit.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556099/Reddit%20community%20list%20Join%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/556099/Reddit%20community%20list%20Join%20buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- CONFIG ----------
  const CACHE_STORAGE_KEY = 'redditJoinSubStateCache_v2';
  const FULL_LOAD_TIMESTAMP_KEY = 'redditJoinFullLoadTS_v2'; 
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // ---------- CSS INJECTION ----------
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Force 2-column grid layout for community list */
      .community-list {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 1rem !important;
        width: 100% !important;
      }

      /* Row layout */
      .community-list > div[data-community-id] {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 0.75rem !important;
        flex-wrap: nowrap !important;
        padding: 0.75rem !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }

      /* Title and description section - allow growth */
      .community-list > div[data-community-id] > div:not([style*="margin-left"]) {
        flex-grow: 1 !important;
        min-width: 0 !important;
        display: flex !important;
        flex-direction: column !important;
      }

      /* Position join button container inline */
      .community-list > div[data-community-id] > div[style*="margin-left"] {
        margin-left: auto !important;
        order: 3 !important;
        flex-shrink: 0 !important;
      }

      /* Ensure icon stays at start */
      .community-list > div[data-community-id] > span {
        order: 1 !important;
        flex-shrink: 0 !important;
      }

      /* Ensure rank number stays first */
      .community-list > div[data-community-id] > h6:first-child {
        order: 0 !important;
        flex-shrink: 0 !important;
        width: 2rem !important;
      }

      /* Text content container */
      .community-list > div[data-community-id] > div.flex-col {
        order: 2 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- CACHING LAYER ----------
  const subStateCache = new Map();
  const pendingButtons = new Map(); 

  function now() {
    return Date.now();
  }

  function loadCacheFromStorage() {
    try {
      const raw = localStorage.getItem(CACHE_STORAGE_KEY);
      if (!raw) return;
      const obj = JSON.parse(raw);
      const cutoff = now() - CACHE_TTL_MS;
      Object.entries(obj).forEach(([name, entry]) => {
        if (!entry || typeof entry !== 'object') return;
        if (typeof entry.ts !== 'number') return;
        if (entry.ts < cutoff) return;
        subStateCache.set(name, { isSub: !!entry.isSub, ts: entry.ts });
      });
    } catch (e) {
      console.warn('[Reddit Join] Failed to load cache:', e);
    }
  }

  function saveCacheToStorage() {
    try {
      const cutoff = now() - CACHE_TTL_MS;
      const obj = {};
      for (const [name, entry] of subStateCache.entries()) {
        if (!entry || entry.ts < cutoff) continue;
        obj[name] = { isSub: !!entry.isSub, ts: entry.ts };
      }
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn('[Reddit Join] Failed to save cache:', e);
    }
  }

  function getCachedSubState(normName) {
    const entry = subStateCache.get(normName);
    if (!entry) return null;
    if (entry.ts < now() - CACHE_TTL_MS) {
      subStateCache.delete(normName);
      return null;
    }
    return entry.isSub;
  }

  function setCachedSubState(normName, isSub) {
    subStateCache.set(normName, { isSub: !!isSub, ts: now() });
    // Save asynchronously so we don't block UI
    queueMicrotask(saveCacheToStorage);
  }

  // ---------- UTILS ----------
  function normalizeSubName(text) {
    if (!text) return null;
    return text
      .trim()
      .replace(/^\/?r\//i, '')
      .replace(/\/$/, '');
  }

  // Apply state to shreddit-join-button
  function applySubscribedState(joinEl, isSub) {
    if (!joinEl) return;

    if (isSub) {
      joinEl.setAttribute('subscribed', '');
    } else {
      joinEl.removeAttribute('subscribed');
    }

    // Also try setting as property (Lit element)
    try {
      joinEl.subscribed = isSub;
    } catch (e) {
      // property might be read-only; ignore
    }

    // If Lit has already initialized, request re-render
    if (typeof joinEl.updateComplete !== 'undefined') {
      joinEl.requestUpdate?.();
    }
  }

  // ---------- LOAD ALL SUBSCRIPTIONS ONCE ----------
  let subsLoadingPromise = null;

  async function loadAllSubscribedOnce() {
    if (subsLoadingPromise) return subsLoadingPromise;

    subsLoadingPromise = (async () => {
      try {
        const lastFullLoad = parseInt(localStorage.getItem(FULL_LOAD_TIMESTAMP_KEY)) || 0;
        const cutoff = now() - CACHE_TTL_MS;

        if (lastFullLoad >= cutoff) {
          console.log('[Reddit Join] Using recent full load from cache');
          return;
        }

        console.log('[Reddit Join] Fetching fresh subscription list...');
        
        // ✅ Clear stale cache before fresh load
        subStateCache.clear();

        let after = null;
        let pageCount = 0;
        let totalLoaded = 0;

        while (pageCount < 10) { // safety limit: max 1000 subs
          const url = new URL('https://www.reddit.com/subreddits/mine/subscriber.json');
          url.searchParams.set('limit', '100');
          if (after) url.searchParams.set('after', after);

          const resp = await fetch(url.toString(), {
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
          });

          if (!resp.ok) {
            console.warn('[Reddit Join] /subreddits/mine/subscriber HTTP', resp.status);
            break;
          }

          const json = await resp.json();
          const children = json?.data?.children || [];

          for (const child of children) {
            const name = child?.data?.display_name;
            const norm = normalizeSubName(name);
            if (norm) {
              setCachedSubState(norm, true);
              totalLoaded++;
            }
          }

          after = json?.data?.after || null;
          pageCount += 1;

          if (!after) break;
        }

        localStorage.setItem(FULL_LOAD_TIMESTAMP_KEY, now().toString());
        saveCacheToStorage();

        console.log(`[Reddit Join] ✓ Loaded ${totalLoaded} subscribed subreddits`);
      } catch (e) {
        console.error('[Reddit Join] Failed to load subscribed list:', e);
      }
    })();

    return subsLoadingPromise;
  }

  function updateAllPendingButtons() {
    if (pendingButtons.size === 0) return;
    
    console.log(`[Reddit Join] Updating ${pendingButtons.size} pending buttons...`);
    
    for (const [normName, joinEl] of pendingButtons.entries()) {
      // Check if element still in DOM
      if (!joinEl.isConnected) {
        pendingButtons.delete(normName);
        continue;
      }
      
      const state = getCachedSubState(normName);
      // Subscribed = true, not in list = false
      applySubscribedState(joinEl, !!state);
    }
    
    pendingButtons.clear();
  }

  // ---------- COMMUNITY LIST PROCESSING ----------
  function createJoinButton(normName, communityId, initialState = null) {
    const join = document.createElement('shreddit-join-button');

    // IMPORTANT: name is just the subreddit name, no "r/" prefix
    join.setAttribute('name', normName);
    join.setAttribute('subreddit-id', communityId);
    join.setAttribute('buttonsize', 'medium');
    join.setAttribute('button-classes', 'px-sm py-xs');
    join.setAttribute('subscribe-label', 'Join');
    join.setAttribute('unsubscribe-label', 'Joined');
    join.setAttribute('unsubscribe-button-type-override', 'bordered');
    join.dataset.normName = normName;

    // If cache already knows, set state
    if (initialState !== null) {
      applySubscribedState(join, initialState);
    }
    const observer = new MutationObserver(() => {
      const isSubbed = join.hasAttribute('subscribed');
      const currentCache = getCachedSubState(normName);
      
      // Only update if state actually changed
      if (currentCache !== isSubbed) {
        setCachedSubState(normName, isSubbed);
        console.log(`[Cache Updated] r/${normName} → ${isSubbed ? 'Joined ✓' : 'Left ✗'}`);
        
        // Invalidate full load timestamp to force refresh on next page load
        // This ensures we catch any subscription changes made outside this page
        localStorage.removeItem(FULL_LOAD_TIMESTAMP_KEY);
      }
    });

    observer.observe(join, {
      attributes: true,
      attributeFilter: ['subscribed']
    });

    // Store observer reference for potential cleanup
    join.dataset.stateObserver = 'active';

    return join;
  }

  function processCommunityList(root = document) {
    const rows = root.querySelectorAll('.community-list > div[data-community-id]');
    let newPendingCount = 0;

    rows.forEach((row) => {
      if (row.dataset.joinButtonInjected === '1') return;
      row.dataset.joinButtonInjected = '1';

      const communityId = row.dataset.communityId;
      let prefixed = row.dataset.prefixedName;

      if (!prefixed) {
        const link = row.querySelector('a[id^="/r/"], a[href^="/r/"]');
        if (link) {
          prefixed = (link.textContent || link.getAttribute('href') || '').trim();
        }
      }

      const normName = normalizeSubName(prefixed);
      if (!normName || !communityId) return;
      const cachedState = getCachedSubState(normName);
      const join = createJoinButton(normName, communityId, cachedState);

      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.marginLeft = 'auto';
      container.appendChild(join);
      row.appendChild(container);
      if (cachedState === null) {
        pendingButtons.set(normName, join);
        newPendingCount++;
      }
    });
    if (pendingButtons.size > 0) {
      loadAllSubscribedOnce().then(updateAllPendingButtons);
    }
  }

  // ---------- INIT ----------
  function initObserver() {
    injectStyles();
    loadCacheFromStorage();

    // Kick off global subscribed list load in background
    loadAllSubscribedOnce().then(() => {
      processCommunityList();
    });

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          if (node.matches?.('.community-list') || node.querySelector?.('.community-list')) {
            processCommunityList(node);
          } else if (
            node.matches?.('[data-community-id]') &&
            node.parentElement?.classList.contains('community-list')
          ) {
            processCommunityList(node.parentElement);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('[Reddit Join] ✓ Initialized, cache entries:', subStateCache.size);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
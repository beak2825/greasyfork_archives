// ==UserScript==
// @name         Sniffies Toolkit: Chat Smart Hide + Helper/AdBlock + Ratings Filter (Combined)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  All-in-one: (1) Auto-hide global chat by time/distance/age/weight, (2) add helper buttons & block house ads, scrape place data to a local Flask app, (3) hide map markers by your ratings (stackable toggles).
// @author       You
// @match        https://sniffies.com/*
// @match        https://*.sniffies.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      100.88.77.24
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555367/Sniffies%20Toolkit%3A%20Chat%20Smart%20Hide%20%2B%20HelperAdBlock%20%2B%20Ratings%20Filter%20%28Combined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555367/Sniffies%20Toolkit%3A%20Chat%20Smart%20Hide%20%2B%20HelperAdBlock%20%2B%20Ratings%20Filter%20%28Combined%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // CONFIG
  // =========================
  const FLASK_HOST = '100.88.77.24';
  const FLASK_PORT = 3989;
  const FLASK_APP_URL = `http://${FLASK_HOST}:${FLASK_PORT}`;
  const API_ORIGIN = FLASK_APP_URL;

  // Internal guard so we don't double-initialize sections on SPA nav or reloads
  const FLAGS = {
    fetchPatched: false,
    chatFilterInit: false,
    helperObserverInit: false,
    ratingsInit: false,
  };

  // =========================
  // UTILITIES
  // =========================
  const debounce = (fn, ms = 150) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  };

  // ----- Chat parsing helpers -----
  function getMinutesAgo(text) {
    const m = text?.trim().match(/(\d+)\s*(second|minute|hour|day)s?\s+ago/i);
    if (!m) return Infinity;
    const n = parseInt(m[1], 10);
    switch ((m[2] || '').toLowerCase()) {
      case 'second': return n / 60;
      case 'minute': return n;
      case 'hour':   return n * 60;
      case 'day':    return n * 60 * 24;
      default:       return Infinity;
    }
  }

  function getMiles(text) {
    const m = text?.trim().match(/([\d.]+)\s*miles/i);
    return m ? parseFloat(m[1]) : Infinity;
  }

  function getStats(container) {
    const el = container.querySelector('[data-testid="userStats"]');
    if (!el) return { age: Infinity, weight: Infinity };
    const txt = el.textContent || '';
    const ageMatch    = txt.match(/^(\d+)\s*,/);
    const weightMatch = txt.match(/(\d+)\s*lb/i);
    return {
      age:    ageMatch    ? parseInt(ageMatch[1], 10)    : Infinity,
      weight: weightMatch ? parseInt(weightMatch[1], 10) : Infinity,
    };
  }

  // =========================
  // SECTION A: Fetch interceptor for place metadata → send to Flask
  // =========================
  function patchFetchOnce() {
    if (FLAGS.fetchPatched) return;
    FLAGS.fetchPatched = true;

    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch.apply(this, args).then((response) => {
        try {
          // Only clone/inspect JSON if URL looks like place metadata
          if (response?.url?.includes('/api/place/metadata')) {
            const cloned = response.clone();
            cloned.json().then((data) => {
              if (data && data.place && data.place._id) {
                sendPlaceDataToFlask(data);
              }
            }).catch(() => {});
          }
        } catch (_) {}
        return response;
      });
    };
  }

  function sendPlaceDataToFlask(placeData) {
    try {
      GM_xmlhttpRequest({
        method: 'POST',
        url: `${FLASK_APP_URL}/api/place_data`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(placeData),
        onload: (resp) => {
          if (resp.status === 200) {
            console.log('[SniffiesToolkit] Place data sent:', placeData.place._id);
          } else {
            console.warn('[SniffiesToolkit] Place send failed:', resp.status);
          }
        },
        onerror: (e) => console.error('[SniffiesToolkit] Place send error:', e),
      });
    } catch (e) {
      console.error('[SniffiesToolkit] GM_xmlhttpRequest error:', e);
    }
  }

  // =========================
  // SECTION B: Ad blocker + helper buttons (user + place)
  // =========================
  function removeAds(root = document) {
    // 1) remove custom component
    root.querySelectorAll('app-house-ads').forEach((el) => el.remove());
    // 2) remove overset DIVs with ng-tns-c*
    root.querySelectorAll('div.overset').forEach((div) => {
      for (const cls of div.classList) {
        if (/^ng-tns-c/.test(cls)) {
          div.remove();
          break;
        }
      }
    });
    // 3) remove 3-level-up ancestor of Upgrade CTA
    root.querySelectorAll('[aria-label="Upgrade to Sniffies Plus"]').forEach((el) => {
      let anc = el;
      for (let i = 0; i < 3 && anc; i++) anc = anc.parentElement;
      if (anc) anc.remove();
    });
    // 4) remove chat ads
    root.querySelectorAll('tr[data-testid="sniffiesChatRow"]').forEach((el) => el.remove());
    root.querySelectorAll('[aria-label="View Advertisement"]').forEach((el) => {
      const row = el.closest('tr');
      if (row) row.remove();
    });
  }

  const buildLocalViewURL = (id) => `${FLASK_APP_URL}/?_id=${id}`;
  const buildLocalPlaceURL = (placeId) => `${FLASK_APP_URL}/place/${placeId}`;

  function injectUserButtons() {
    const targetDiv = document.querySelector('div[data-testid="cruiserInfoContainer"]');
    if (!targetDiv || document.getElementById('local-helper-buttons-container')) return;

    const userId = window.location.pathname.split('/').pop();
    if (!/^[0-9a-f]{24,}$/i.test(userId || '')) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'local-helper-buttons-container';
    Object.assign(buttonContainer.style, {
      display: 'flex', gap: '10px', marginTop: '10px', width: '100%',
    });

    const baseCSS = `
      padding: 10px 15px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9em;
      font-weight: bold;
      color: white;
      transition: background-color 0.3s;
    `;

    const btnView = document.createElement('button');
    btnView.textContent = 'View Local';
    btnView.title = 'Open this profile in your local viewer';
    btnView.style.cssText = baseCSS + 'background-color:#6c757d;';
    btnView.onmouseover = () => (btnView.style.backgroundColor = '#5a6268');
    btnView.onmouseout  = () => (btnView.style.backgroundColor = '#6c757d');
    btnView.addEventListener('click', () => window.open(buildLocalViewURL(userId), '_blank'));

    const btnScrape = document.createElement('button');
    btnScrape.textContent = 'Manual Scrape';
    btnScrape.title = 'Add this user to the manual scrape queue';
    btnScrape.style.cssText = baseCSS + 'background-color:#4CAF50;';
    btnScrape.addEventListener('click', () => {
      btnScrape.textContent = 'Requesting...';
      btnScrape.disabled = true;
      GM_xmlhttpRequest({
        method: 'POST',
        url: `${FLASK_APP_URL}/trigger_scrape/${userId}`,
        onload: (resp) => {
          const ok = resp.status === 200;
          btnScrape.textContent = ok ? '✅ Queued!' : '❌ Failed!';
          btnScrape.style.backgroundColor = ok ? '#007BFF' : '#DC3545';
        },
        onerror: () => {
          btnScrape.textContent = '❌ Error!';
          btnScrape.style.backgroundColor = '#DC3545';
          alert('Error: Could not connect to the local Flask app. Is it running?');
        },
      });
    });

    buttonContainer.append(btnView, btnScrape);
    targetDiv.insertAdjacentElement('afterend', buttonContainer);
  }

  function injectPlaceButtons() {
    if (!window.location.pathname.includes('/place/')) return;

    const placeTitle = document.querySelector('h1[data-testid="place-title"]');
    if (!placeTitle || document.getElementById('place-helper-buttons-container')) return;

    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('place');
    const placeId = idx >= 0 ? parts[idx + 1] : '';
    if (!placeId || placeId.length < 10) return;

    const wrap = document.createElement('div');
    wrap.id = 'place-helper-buttons-container';
    wrap.style.cssText = `
      display:flex!important; gap:10px; margin:10px; padding:10px;
      width:calc(100% - 20px); background-color:rgba(0,0,0,0.1);
      border-radius:8px; z-index:9999; position:relative;
    `;

    const base = `
      padding:10px 15px!important; border:none!important; border-radius:8px!important;
      cursor:pointer!important; font-size:0.9em!important; font-weight:bold!important;
      color:white!important; transition:background-color .3s!important; min-width:120px!important;
      text-align:center!important; z-index:10000!important; position:relative!important;
    `;

    const btnView = document.createElement('button');
    btnView.textContent = 'View Place Local';
    btnView.title = 'Open this place in your local viewer';
    btnView.style.cssText = base + 'background-color:#17a2b8;';
    btnView.onmouseover = () => (btnView.style.backgroundColor = '#138496');
    btnView.onmouseout  = () => (btnView.style.backgroundColor = '#17a2b8');
    btnView.addEventListener('click', () => window.open(buildLocalPlaceURL(placeId), '_blank'));

    const btnScrape = document.createElement('button');
    btnScrape.textContent = 'Scrape Place';
    btnScrape.title = 'Add this place to the manual scrape queue';
    btnScrape.style.cssText = base + 'background-color:#fd7e14;';
    btnScrape.addEventListener('click', () => {
      btnScrape.textContent = 'Requesting...';
      btnScrape.disabled = true;
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${FLASK_APP_URL}/trigger_place_scrape/${placeId}`,
        onload: (resp) => {
          const ok = resp.status === 200;
          btnScrape.textContent = ok ? '✅ Queued!' : '❌ Failed!';
          btnScrape.style.backgroundColor = ok ? '#007BFF' : '#DC3545';
        },
        onerror: () => {
          btnScrape.textContent = '❌ Error!';
          btnScrape.style.backgroundColor = '#DC3545';
          alert('Error: Could not connect to the local Flask app. Is it running?');
        },
      });
    });

    wrap.append(btnView, btnScrape);
    placeTitle.insertAdjacentElement('afterend', wrap);
  }

  // One observer to keep ads gone and buttons injected
  function initHelperObserver() {
    if (FLAGS.helperObserverInit) return;
    FLAGS.helperObserverInit = true;

    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1) removeAds(n);
        }
      }
      injectUserButtons();
      injectPlaceButtons();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // Initial & periodic passes
    setTimeout(() => { removeAds(); injectUserButtons(); injectPlaceButtons(); }, 1000);
    setInterval(() => { removeAds(); injectUserButtons(); injectPlaceButtons(); }, 1500);
  }

  // =========================
  // SECTION C: Global Chat Smart Hide
  // =========================
  function filterChatMessages() {
    document.querySelectorAll('app-global-chat-user-container').forEach((c) => {
      const tsEl = c.querySelector('[data-testid="messageTimestamp"]');
      const distEl = c.querySelector('.chat-distance');
      const mins = tsEl ? getMinutesAgo(tsEl.textContent) : Infinity;
      const miles = distEl ? getMiles(distEl.textContent) : Infinity;
      const { age, weight } = getStats(c);

      if (mins > 60 || miles > 15 || age > 40 || weight > 220) {
        c.style.display = 'none';
      } else {
        c.style.display = '';
      }
    });
  }

  function initChatFilter() {
    if (FLAGS.chatFilterInit) return;
    FLAGS.chatFilterInit = true;

    // initial pass after render
    setTimeout(filterChatMessages, 1500);
    // observe DOM for changes
    const chatObserver = new MutationObserver(debounce(filterChatMessages, 200));
    chatObserver.observe(document.body, { childList: true, subtree: true });
    // periodic safety pass
    setInterval(filterChatMessages, 60 * 1000);
  }

  // =========================
  // SECTION D: Ratings-based marker hide (stackable)
  // =========================
  const RatingsFilter = (() => {
    let hideRated = false;   // hide ratings 1 or 2
    let hideUnrated = false; // hide users with no rating
    let ratingsCache = new Map();
    let lastStamp = 0;
    let pendingTimeout = null;
    const FILTER_DEBOUNCE_MS = 100;

    function getVisibleUserIds() {
      const ids = new Set();
      document.querySelectorAll('.marker-container.user[id]').forEach((el) => ids.add(el.id));
      return Array.from(ids);
    }

    function fetchRatings(userIds) {
      return new Promise((resolve, reject) => {
        const uncached = userIds.filter((id) => !ratingsCache.has(id));
        if (!uncached.length) {
          const map = {};
          userIds.forEach((id) => { if (ratingsCache.has(id)) map[id] = ratingsCache.get(id); });
          resolve(map);
          return;
        }

        GM_xmlhttpRequest({
          method: 'POST',
          url: `${API_ORIGIN}/api/ratings`,
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ ids: uncached }),
          timeout: 5000,
          onload(resp) {
            if (resp.status >= 200 && resp.status < 300) {
              try {
                const api = JSON.parse(resp.responseText);
                const map = {};
                uncached.forEach((id) => {
                  const userData = api[id];
                  const rating = (userData && userData.rating != null) ? userData.rating : null;
                  ratingsCache.set(id, rating);
                  map[id] = rating;
                });
                userIds.forEach((id) => {
                  if (!(id in map) && ratingsCache.has(id)) map[id] = ratingsCache.get(id);
                });
                resolve(map);
              } catch (e) { reject(e); }
            } else {
              reject(new Error(`API ${resp.status}`));
            }
          },
          onerror(e) { reject(e); },
          ontimeout() { reject(new Error('timeout')); },
        });
      });
    }

    function applyFiltersNow() {
      const stamp = Date.now();
      lastStamp = stamp;
      if (pendingTimeout) {
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
      }

      const ids = getVisibleUserIds();
      if (!ids.length) {
        // try shortly later (map not ready yet)
        pendingTimeout = setTimeout(applyFiltersNow, 500);
        return;
      }

      fetchRatings(ids).then((ratingsMap) => {
        if (stamp !== lastStamp) return; // obsolete run

        let hidden = 0, shown = 0;
        document.querySelectorAll('.marker-container.user[id]').forEach((el) => {
          const uid = el.id;
          const rating = ratingsMap[uid]; // null/undefined → unrated
          const shouldHide =
            (hideRated && (rating === 1 || rating === 2)) ||
            (hideUnrated && (rating == null));

          const marker = el.closest('.mgl-marker');
          if (marker) {
            if (shouldHide) { marker.style.display = 'none'; hidden++; }
            else { marker.style.display = ''; shown++; }
          }
        });
        console.log(`[SniffiesToolkit] Ratings filter → hidden ${hidden}, shown ${shown}`);
      }).catch((e) => {
        console.warn('[SniffiesToolkit] Ratings fetch error:', e);
        pendingTimeout = setTimeout(applyFiltersNow, 2000);
      });
    }

    const applyFiltersDebounced = debounce(applyFiltersNow, FILTER_DEBOUNCE_MS);

    function injectControls() {
      if (document.getElementById('ratings-filter-controls')) return;

      const box = document.createElement('div');
      box.id = 'ratings-filter-controls';
      Object.assign(box.style, {
        position: 'absolute',
        top: '50px',
        left: '10px',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '10px',
        zIndex: 999999,
        fontFamily: 'sans-serif',
        fontSize: '12px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      });

      function makeBtn(label) {
        const b = document.createElement('button');
        b.textContent = label;
        b.style.cssText = 'padding:4px 8px;border:1px solid #999;border-radius:3px;background:#f5f5f5;cursor:pointer;';
        return b;
      }

      const btn12 = makeBtn('Hide rated 1/2');
      const btnUn = makeBtn('Hide unrated');
      const btnAll = makeBtn('Show All');
      const btnClear = makeBtn('Clear Cache');
      btnClear.style.background = '#ffe0e0';
      btnClear.style.fontSize = '10px';

      btn12.onclick = () => {
        hideRated = !hideRated;
        btn12.style.fontWeight = hideRated ? 'bold' : 'normal';
        btn12.style.background = hideRated ? '#e0e0e0' : '#f5f5f5';
        applyFiltersDebounced();
      };
      btnUn.onclick = () => {
        hideUnrated = !hideUnrated;
        btnUn.style.fontWeight = hideUnrated ? 'bold' : 'normal';
        btnUn.style.background = hideUnrated ? '#e0e0e0' : '#f5f5f5';
        applyFiltersDebounced();
      };
      btnAll.onclick = () => {
        hideRated = false; hideUnrated = false;
        btn12.style.fontWeight = 'normal'; btn12.style.background = '#f5f5f5';
        btnUn.style.fontWeight = 'normal'; btnUn.style.background = '#f5f5f5';
        applyFiltersDebounced();
      };
      btnClear.onclick = () => {
        ratingsCache.clear();
        applyFiltersDebounced();
      };

      box.append(btn12, btnUn, btnAll, btnClear);
      document.body.appendChild(box);
    }

    function observeMap() {
      const obs = new MutationObserver(debounce((muts) => {
        let should = false;
        for (const m of muts) {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) {
              if (n.classList?.contains('marker-container') || n.querySelector?.('.marker-container.user[id]')) {
                should = true;
              }
            }
          }
        }
        if (should) applyFiltersDebounced();
      }, 120));
      obs.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
      if (FLAGS.ratingsInit) return;
      FLAGS.ratingsInit = true;
      injectControls();
      observeMap();
      setTimeout(() => applyFiltersDebounced(), 1000);
    }

    return { init };
  })();

  // =========================
  // SECTION E: SPA navigation detection (global)
  // =========================
  function onUrlChange() {
    patchFetchOnce();          // ensure fetch is patched once
    initHelperObserver();      // always keep ads/buttons live

    if (location.pathname.startsWith('/global-chat')) {
      initChatFilter();        // start smart hide when in global chat
    }

    // ratings filter is useful anywhere map markers appear
    RatingsFilter.init();
  }

  // Patch history APIs once, trigger on popstate and initial load
  (function patchHistory() {
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function (...args) { const r = push.apply(this, args); onUrlChange(); return r; };
    history.replaceState = function (...args) { const r = replace.apply(this, args); onUrlChange(); return r; };
    window.addEventListener('popstate', onUrlChange);
  })();

  // Kick off
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(onUrlChange, 0));
  } else {
    onUrlChange();
  }
})();

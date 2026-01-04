// ==UserScript==
// @name         Reddit → LiveContainer (iOS)
// @namespace    sharmanhall
// @version      0.5
// @description  Redirect Reddit links to LiveContainer so they open in the containerized Reddit app.
// @author       sharmanhall
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://np.reddit.com/*
// @match        https://reddit.com/*
// @match        https://redd.it/*
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550408/Reddit%20%E2%86%92%20LiveContainer%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550408/Reddit%20%E2%86%92%20LiveContainer%20%28iOS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- prefs ----
  const VERBOSE = true; // set false to quiet logs
  const AUTO_REDIRECT_ON_REDDIT_PAGES = true;  // when you're *on* a Reddit page
  const REWRITE_LINKS_ON_ALL_PAGES = true;     // intercept <a> to Reddit anywhere
  const ADD_LC_FLAG = true;                    // append lc=1 to avoid bounce loops

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Cover reddit root + all subdomains; include redd.it shortener.
  const redditHosts = new Set([
    'reddit.com',       // matches www/old/np/amp/etc via endsWith
    'redd.it'           // shortlinks (posts, comments, media pages)
  ]);

  function log(...args){ if (VERBOSE) console.log('[LC-Reddit]', ...args); }

  function isRedditURL(u) {
    try {
      const url = (u instanceof URL) ? u : new URL(u, location.href);
      return [...redditHosts].some(h => url.hostname === h || url.hostname.endsWith('.' + h));
    } catch { return false; }
  }

  // Encode for LiveContainer's open-web-page scheme (expects Base64)
  function toBase64(str) {
    try {
      return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
    } catch {
      // Fallback for older Safari
      return btoa(unescape(encodeURIComponent(str)));
    }
  }

  function buildLcUrl(originalUrl) {
    const url = new URL(originalUrl, location.href);
    if (ADD_LC_FLAG && !url.searchParams.has('lc')) url.searchParams.set('lc', '1');
    return `livecontainer://open-web-page?url=${toBase64(url.toString())}`;
  }

  function redirectToLC(u) {
    const lc = buildLcUrl(u);
    log('Redirecting to LiveContainer:', lc);
    location.replace(lc); // avoid extra history entries
  }

  // 1) If we're on a Reddit page already, bounce to LiveContainer (iOS only)
  if (isIOS && AUTO_REDIRECT_ON_REDDIT_PAGES && isRedditURL(location.href)) {
    const cur = new URL(location.href);
    if (!cur.searchParams.get('lc')) {
      redirectToLC(location.href);
      return; // stop executing further on this page
    } else {
      log('lc=1 present; skipping auto-redirect to avoid loop.');
    }
  }

  if (!isIOS) return; // iOS-only behavior below

  // Some pages expose expanded URLs (e.g., via data-* attributes). Prefer those when they point to Reddit.
  function resolveTargetHref(a) {
    const expanded =
      a?.dataset?.expandedUrl ||
      a?.getAttribute?.('data-expanded-url') ||
      a?.dataset?.fullUrl ||
      a?.getAttribute?.('data-full-url');
    if (expanded && isRedditURL(expanded)) return expanded;
    return a?.href || '';
  }

  // 2) Global capture fallback for delegated clicks (robust vs dynamic UIs)
  if (REWRITE_LINKS_ON_ALL_PAGES) {
    document.addEventListener('click', (e) => {
      const a = e.target?.closest?.('a[href]');
      if (!a) return;
      const targetHref = resolveTargetHref(a);
      if (!isRedditURL(targetHref)) return;
      try {
        e.preventDefault();
        e.stopPropagation();
        redirectToLC(targetHref);
      } catch (err) {
        log('Error redirecting (global):', err);
      }
    }, { capture: true, passive: false });
  }

  // 3) Per-anchor hook + dynamic observer (in case sites block global handlers)
  if (REWRITE_LINKS_ON_ALL_PAGES) {
    const processAnchor = (a) => {
      if (!a || !a.href) return;
      if (a.dataset.lcReddit === '1') return; // double-hook guard
      const targetHref = resolveTargetHref(a);
      if (!isRedditURL(targetHref)) return;

      const handler = (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          redirectToLC(targetHref);
        } catch (err) {
          log('Error redirecting (anchor):', err);
        }
      };
      a.addEventListener('click', handler, { capture: true, passive: false });
      a.dataset.lcReddit = '1';
      log('Hooked Reddit link:', targetHref);
    };

    // Initial pass
    document.querySelectorAll('a[href]:not([data-lc-reddit])').forEach(processAnchor);

    // Observe dynamically-added links (SPAs, infinite scroll, etc.)
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'A' && node.href) processAnchor(node);
          else node.querySelectorAll?.('a[href]:not([data-lc-reddit])').forEach(processAnchor);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();

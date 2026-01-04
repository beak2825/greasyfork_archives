// ==UserScript==
// @name         Instagram → LiveContainer (iOS)
// @namespace    sharmanhall
// @version      0.5
// @description  Redirect Instagram links to LiveContainer so they open in the containerized Instagram app on iOS.
// @author       sharmanhall
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @match        https://instagr.am/*
// @match        https://ig.me/*
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550409/Instagram%20%E2%86%92%20LiveContainer%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550409/Instagram%20%E2%86%92%20LiveContainer%20%28iOS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- prefs ----
  const VERBOSE = true; // set false to quiet logs
  const AUTO_REDIRECT_ON_INSTAGRAM_PAGES = true;  // when you're *on* an Instagram page
  const REWRITE_LINKS_ON_ALL_PAGES = true;        // rewrite <a> that point to Instagram anywhere
  const ADD_LC_FLAG = true;                       // append lc=1 to avoid bounce loops

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // First-party IG domains only. (Intentionally NOT including l.instagram.com redirector.)
  const igHosts = new Set([
    'instagram.com',
    'instagr.am',
    'ig.me'
  ]);

  function log(...args){ if (VERBOSE) console.log('[LC-Instagram]', ...args); }

  function isInstagramURL(u) {
    try {
      const url = (u instanceof URL) ? u : new URL(u, location.href);
      return [...igHosts].some(h => url.hostname === h || url.hostname.endsWith('.' + h));
    } catch { return false; }
  }

  // Encode for LiveContainer's open-web-page scheme (expects Base64)
  function toBase64(str) {
    try {
      return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
    } catch {
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

  // 1) If we're on an Instagram page already, bounce to LiveContainer (iOS only)
  if (isIOS && AUTO_REDIRECT_ON_INSTAGRAM_PAGES && isInstagramURL(location.href)) {
    const cur = new URL(location.href);
    if (!cur.searchParams.get('lc')) {
      redirectToLC(location.href);
      return; // stop executing further on this page
    } else {
      log('lc=1 present; skipping auto-redirect to avoid loop.');
    }
  }

  if (!isIOS) return; // iOS-only behavior below

  // Prefer any expanded URL attributes if present and first-party.
  function resolveTargetHref(a) {
    const expanded =
      a?.dataset?.expandedUrl ||
      a?.getAttribute?.('data-expanded-url') ||
      a?.dataset?.fullUrl ||
      a?.getAttribute?.('data-full-url');
    if (expanded && isInstagramURL(expanded)) return expanded;
    return a?.href || '';
  }

  // 2) Global capture fallback for delegated clicks (most robust)
  if (REWRITE_LINKS_ON_ALL_PAGES) {
    document.addEventListener('click', (e) => {
      const a = e.target?.closest?.('a[href]');
      if (!a) return;
      const targetHref = resolveTargetHref(a);
      if (!isInstagramURL(targetHref)) return;
      try {
        e.preventDefault();
        e.stopPropagation();
        redirectToLC(targetHref);
      } catch (err) {
        log('Error redirecting (global):', err);
      }
    }, { capture: true, passive: false });
  }

  // 3) Per-anchor hook + dynamic observer (helps on hostile pages)
  if (REWRITE_LINKS_ON_ALL_PAGES) {
    const processAnchor = (a) => {
      if (!a || !a.href) return;
      if (a.dataset.lcInstagram === '1') return; // double-hook guard
      const targetHref = resolveTargetHref(a);
      if (!isInstagramURL(targetHref)) return;

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
      a.dataset.lcInstagram = '1';
      log('Hooked Instagram link:', targetHref);
    };

    // Initial pass
    document.querySelectorAll('a[href]:not([data-lc-instagram])').forEach(processAnchor);

    // Observe dynamically-added links (SPAs, infinite scroll, etc.)
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'A' && node.href) processAnchor(node);
          else node.querySelectorAll?.('a[href]:not([data-lc-instagram])').forEach(processAnchor);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();

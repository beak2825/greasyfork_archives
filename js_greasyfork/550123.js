// ==UserScript==
// @name         TikTok → LiveContainer (iOS)
// @namespace    sharmanhall
// @version      0.4
// @description  Redirect TikTok links to LiveContainer so they open in the containerized TikTok app.
// @author       You
// @match        https://www.tiktok.com/*
// @match        https://m.tiktok.com/*
// @match        https://vm.tiktok.com/*
// @match        https://vt.tiktok.com/*
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550123/TikTok%20%E2%86%92%20LiveContainer%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550123/TikTok%20%E2%86%92%20LiveContainer%20%28iOS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- prefs ----
  const VERBOSE = true; // set false to quiet logs
  const AUTO_REDIRECT_ON_TIKTOK_PAGES = true;  // when you're *on* a TikTok page
  const REWRITE_LINKS_ON_ALL_PAGES = true;     // rewrite <a> that point to TikTok anywhere
  const ADD_LC_FLAG = true;                    // append lc=1 to avoid bounce loops

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const tiktokHosts = new Set([
    'tiktok.com', 'www.tiktok.com', 'm.tiktok.com',
    'vm.tiktok.com', 'vt.tiktok.com'
  ]);

  function log(...args){ if (VERBOSE) console.log('[LC-TikTok]', ...args); }

  function isTikTokURL(u) {
    try {
      const url = (u instanceof URL) ? u : new URL(u, location.href);
      return [...tiktokHosts].some(h => url.hostname === h || url.hostname.endsWith('.' + h));
    } catch { return false; }
  }

  // Encode for LiveContainer's open-web-page scheme (expects Base64)
  function toBase64(str) { return btoa(unescape(encodeURIComponent(str))); }

  function buildLcUrl(originalUrl) {
    const url = new URL(originalUrl, location.href);
    if (ADD_LC_FLAG && !url.searchParams.has('lc')) url.searchParams.set('lc', '1');
    return `livecontainer://open-web-page?url=${toBase64(url.toString())}`;
  }

  function redirectToLC(u) {
    const lc = buildLcUrl(u);
    log('Redirecting to LiveContainer:', lc);
    // replace() avoids adding extra history entries
    location.replace(lc);
  }

  // 1) If we’re on a TikTok page already, bounce to LiveContainer (iOS only)
  if (isIOS && AUTO_REDIRECT_ON_TIKTOK_PAGES && isTikTokURL(location.href)) {
    // small guard to prevent rapid loops if you come back with lc=1
    if (!new URL(location.href).searchParams.get('lc')) {
      redirectToLC(location.href);
      return; // stop executing further on this page
    } else {
      log('lc=1 present; skipping auto-redirect to avoid loop.');
    }
  }

  // 2) Rewrite TikTok anchors anywhere on the web
  if (isIOS && REWRITE_LINKS_ON_ALL_PAGES) {
    const processAnchor = (a) => {
      if (!a || !a.href) return;
      if (!isTikTokURL(a.href)) return;
      // Don’t mutate to custom-scheme href to keep long-press previews working; hook click instead.
      a.addEventListener('click', (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          redirectToLC(a.href);
        } catch (err) {
          log('Error redirecting:', err);
        }
      }, { capture: true, passive: false });
      // As a fallback (if scripts disable listeners), set data attribute so you know it’s hooked.
      a.dataset.lcTikTok = '1';
      log('Hooked TikTok link:', a.href);
    };

    // Initial pass
    document.querySelectorAll('a[href]').forEach(processAnchor);

    // Observe dynamically-added links
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'A' && node.href) processAnchor(node);
          else node.querySelectorAll?.('a[href]').forEach(processAnchor);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();

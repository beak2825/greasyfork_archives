// ==UserScript==
// @name         YouTube Home → Subscriptions (SPA-aware)
// @author       prothales
// @license      MIT
// @namespace    https://github.com/prothales/no-youtube-feed
// @homepageURL  https://github.com/prothales/no-youtube-feed
// @supportURL   https://github.com/prothales/no-youtube-feed/issues
// @version      1.1
// @description  Redirect root "/" to /feed/subscriptions, including clicks on the YouTube logo (client-side navigation).
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551636/YouTube%20Home%20%E2%86%92%20Subscriptions%20%28SPA-aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551636/YouTube%20Home%20%E2%86%92%20Subscriptions%20%28SPA-aware%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const TARGET = 'https://www.youtube.com/feed/subscriptions';

  function isRoot() {
    const p = location.pathname || '/';
    return (p === '/' || p === '') && !location.pathname.startsWith('/feed/subscriptions');
  }

  function redirectIfRoot() {
    try {
      if (isRoot()) location.replace(TARGET);
    } catch(e) {}
  }

  // initial attempt (covers full loads)
  redirectIfRoot();

  // wrap history methods so SPA navigations trigger a custom event
  ['pushState','replaceState'].forEach(m => {
    const orig = history[m];
    history[m] = function(...args) {
      const res = orig.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return res;
    };
  });
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', () => setTimeout(redirectIfRoot, 60));

  // listen to YouTube navigation events if present
  window.addEventListener('yt-navigate-start', redirectIfRoot);
  window.addEventListener('yt-navigate-finish', redirectIfRoot);

  // lightweight polling fallback
  let last = location.pathname + location.search + location.hash;
  setInterval(() => {
    const cur = location.pathname + location.search + location.hash;
    if (cur !== last) { last = cur; redirectIfRoot(); }
  }, 500);
})();
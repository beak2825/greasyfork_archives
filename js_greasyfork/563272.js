
// ==UserScript==
// @name         Hacker News → HackerWeb Redirect
// @namespace    https://github.com/yixu
// @version      1.0.0
// @description  Always open Hacker News pages on HackerWeb equivalents (e.g., item?id=123 → #/item/123)
// @author       Yi Xu
// @license      MIT
// @match        https://news.ycombinator.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @homepageURL  https://hackerweb.app/
// @supportURL   https://news.ycombinator.com/
// @downloadURL https://update.greasyfork.org/scripts/563272/Hacker%20News%20%E2%86%92%20HackerWeb%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/563272/Hacker%20News%20%E2%86%92%20HackerWeb%20Redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Only act on HN
  if (location.hostname !== 'news.ycombinator.com') return;

  const url = new URL(location.href);
  const path = url.pathname.replace(/^\/+/, ''); // normalize (e.g., "" or "item")
  const id = url.searchParams.get('id');

  function mapToHackerWebRoute() {
    // Lists
    if (path === '' || path === 'news') return '#/news';
    if (path === 'newest') return '#/newest';
    if (path === 'ask') return '#/ask';
    if (path === 'show') return '#/show';
    if (path === 'jobs') return '#/jobs';
    if (path === 'newcomments') return '#/newcomments';

    // Items & users
    if (path === 'item' && id) return `#/item/${id}`;
    if ((path === 'user' || path === 'threads') && id) return `#/user/${id}`;

    // Fallback
    return '#/news';
  }

  const route = mapToHackerWebRoute();
  const target = `https://hackerweb.app/${route}`;

  if (target && target !== location.href) {
    // Use replace so back button doesn't bounce user back to HN
    location.replace(target);
  }
})();
``

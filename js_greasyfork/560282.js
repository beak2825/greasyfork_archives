// ==UserScript==
// @name         PrimeWire missing poster fixer
// @namespace    pw_fix
// @description  Fetches missing poster images from amazon and tvmaze.
// @version 3.0
// @license MIT
// @match       https://www.primewire.mov/*
// @match       https://www.primewire.tf/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/560282/PrimeWire%20missing%20poster%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/560282/PrimeWire%20missing%20poster%20fixer.meta.js
// ==/UserScript==

(function () {
  const CACHE_DAYS = 14;
  const PREFIX = 'pw_cache_';
  const SELECTORS = '.movie_thumb img, .index_item img, .index_item_ie img';
  const ttl = Date.now() + CACHE_DAYS * 864e5;

  function readCache(key) {
    try {
      const j = JSON.parse(localStorage.getItem(PREFIX + key));
      if (j && j.t > Date.now()) return j.url;
      localStorage.removeItem(PREFIX + key);
    } catch {}
    return null;
  }

  function saveCache(key, url) {
    if (url) localStorage.setItem(PREFIX + key, JSON.stringify({ t: ttl, url }));
  }

  function keyFromURL(urlstring) {
    try {
      const u = new URL(urlstring, location.href);
      return u.pathname.replace(/\/$/, '');
    } catch { return urlstring; }
  }

  async function fetchPosterURL(movieURL) {
    const key = keyFromURL(movieURL);
    const cached = readCache(key);
    if (cached) return cached;

    try {
      const resp = await fetch(movieURL, { credentials: 'include' });
      const html = await resp.text();

      // Support both amazon and tvmaze sources
      const m = html.match(/<a[^>]+href="(https:\/\/(?:m\.media-amazon\.com|static\.tvmaze\.com)[^"]+)"/i);
      if (m && m[1]) {
        saveCache(key, m[1]);
        return m[1];
      }
    } catch (e) { console.warn('Poster fetch failed', e); }
    return null;
  }

  function isBroken(img) {
    const w = img.naturalWidth, h = img.naturalHeight;
    return !w || !h || (w < 10 && h < 10);
  }

  async function fixImage(img) {
    if (!isBroken(img)) return; // leave good images alone

    const parent = img.closest('.movie_thumb, .index_item, .index_item_ie');
    if (!parent) return;

    // Case 1: movie page with direct amazon or tvmaze link
    const direct = parent.querySelector("a[href*='m.media-amazon.com'], a[href*='static.tvmaze.com']");
    if (direct) {
      const poster = direct.href;
      const key = keyFromURL(location.pathname);
      saveCache(key, poster);
      if (isBroken(img)) img.src = poster;
      return;
    }

    // Case 2: index/front page item -> need to look into movie subpage
    const a = parent.querySelector('a[href*="/movie/"], a[href*="/tv/"]');
    if (!a) return;
    const key = keyFromURL(a.href);
    const cached = readCache(key);
    if (cached) {
      if (isBroken(img)) img.src = cached;
      return;
    }

    const poster = await fetchPosterURL(a.href);
    if (poster && isBroken(img)) img.src = poster;
  }

  function scanAll() {
    document.querySelectorAll(SELECTORS).forEach(fixImage);
  }

  window.addEventListener('load', scanAll);
  new MutationObserver(() => scanAll()).observe(document.body, { childList: true, subtree: true });
})();
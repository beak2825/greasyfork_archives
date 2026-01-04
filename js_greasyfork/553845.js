// ==UserScript==
// @name         pornolabFullSizeImages
// @namespace    https://greasyfork.org/en/users/108513
// @version 3.0.2
// @description  Auto-expand spoilers + remplace les miniatures Fastpic par les images full-size
// @author       seb du 17
// @match        https://pornolab.net/*
// @match        http://pornolab.net/*
// @match        https://*.pornolab.net/*
// @match        http://*.pornolab.net/*
// @run-at       document-idle
// @icon         https://static.pornolab.net/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      fastpic.org
// @connect      i.fastpic.org
// @connect      *.fastpic.org
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553845/pornolabFullSizeImages.user.js
// @updateURL https://update.greasyfork.org/scripts/553845/pornolabFullSizeImages.meta.js
// ==/UserScript==

/* jshint esversion: 11, browser: true, curly: true */
/* global GM, GM_xmlhttpRequest */

(function () {
  'use strict';

  const CONFIG = {
    SCAN_DEBOUNCE_MS: 120,
    FETCH_TIMEOUT_MS: 5000,
    CACHE_SIZE: 150,

    EXPAND_SPOILERS: true,
    MAX_SPOILERS_CLICK: 1200,
    SPOILER_CLICK_CHUNK: 25
  };

  const REGEX = {
    MD5_PARAM: /[?&]md5=/i,
    BIG_PATH: /fastpic\.org\/big\//i,
    FULLVIEW_PATH: /fastpic\.org\/fullview\/.+\.html/i,
    BIG_URL: /https?:\/\/i\d+\.fastpic\.org\/big\/[^\"' \s]+md5=[^\"'&]+&expires=\d+/i
  };

  const processed = new WeakSet();
  const pending = new WeakSet();

  const urlCache = new Map();   // fullviewUrl -> bigUrl | ''
  const inFlight = new Map();   // fullviewUrl -> Promise<string>

  const scanQueue = new Set();
  let scanTimer = null;

  function cacheGet(key) {
    if (!urlCache.has(key)) {
      return undefined;
    }
    const v = urlCache.get(key);
    urlCache.delete(key);
    urlCache.set(key, v);
    return v;
  }

  function cacheSet(key, value) {
    if (urlCache.has(key)) {
      urlCache.delete(key);
    }
    urlCache.set(key, value);

    if (urlCache.size > CONFIG.CACHE_SIZE) {
      const firstKey = urlCache.keys().next().value;
      urlCache.delete(firstKey);
    }
  }

  function safeURL(str) {
    try {
      return new URL(str, location.href);
    } catch (e) {
      return null;
    }
  }

  function ensureParam(urlStr, key, value) {
    try {
      const u = new URL(urlStr, location.href);
      if (!u.searchParams.has(key)) {
        u.searchParams.set(key, value);
      }
      return u.toString();
    } catch (e) {
      const sep = (urlStr.indexOf('?') >= 0) ? '&' : '?';
      return urlStr + sep + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
  }

  function setOptimizedImageFlags(img) {
    try { img.loading = 'lazy'; } catch (e) {}
    try { img.decoding = 'async'; } catch (e) {}
  }

  function xfetchText(url) {
    // Priorité à GM.xmlHttpRequest (API GM moderne, y compris dans Violentmonkey).
    if (typeof GM !== 'undefined' && GM && typeof GM.xmlHttpRequest === 'function') {
      return new Promise(function (resolve) {
        GM.xmlHttpRequest({
          method: 'GET',
          url: url,
          timeout: CONFIG.FETCH_TIMEOUT_MS,
          onload: function (r) { resolve((r && r.responseText) ? r.responseText : ''); },
          onerror: function () { resolve(''); },
          ontimeout: function () { resolve(''); }
        });
      });
    }

    // Compat GM_xmlhttpRequest (nom historique).
    if (typeof GM_xmlhttpRequest === 'function') {
      return new Promise(function (resolve) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          timeout: CONFIG.FETCH_TIMEOUT_MS,
          onload: function (r) { resolve((r && r.responseText) ? r.responseText : ''); },
          onerror: function () { resolve(''); },
          ontimeout: function () { resolve(''); }
        });
      });
    }

    // Fallback fetch (souvent bloqué par CORS sur du cross-origin).
    return fetch(url, { credentials: 'omit', cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) {
          return '';
        }
        return r.text();
      })
      .catch(function () { return ''; });
  }

  function fetchBigUrlFromFullview(fullviewUrl) {
    const cached = cacheGet(fullviewUrl);
    if (cached !== undefined) {
      return Promise.resolve(cached);
    }

    if (inFlight.has(fullviewUrl)) {
      return inFlight.get(fullviewUrl);
    }

    const p = xfetchText(fullviewUrl).then(function (html) {
      let result = '';
      if (html) {
        const m = html.match(REGEX.BIG_URL);
        result = m ? m[0] : '';
      }
      cacheSet(fullviewUrl, result);
      inFlight.delete(fullviewUrl);
      return result;
    }).catch(function () {
      cacheSet(fullviewUrl, '');
      inFlight.delete(fullviewUrl);
      return '';
    });

    inFlight.set(fullviewUrl, p);
    return p;
  }

  function processAnchor(a) {
    if (!a || a.nodeType !== 1) {
      return;
    }

    const img = a.querySelector('img.postImg, img');
    if (!img) {
      return;
    }

    if (processed.has(img) || pending.has(img)) {
      return;
    }

    const raw =
      img.currentSrc ||
      img.src ||
      img.getAttribute('data-src') ||
      img.getAttribute('data-original') ||
      '';

    const rawUrl = raw ? safeURL(raw) : null;
    const hrefUrl = a.href ? safeURL(a.href) : null;

    const rawHost = rawUrl ? rawUrl.hostname : '';
    const hrefHost = hrefUrl ? hrefUrl.hostname : '';

    if (rawHost.indexOf('fastpic.org') < 0 && hrefHost.indexOf('fastpic.org') < 0) {
      return;
    }

    setOptimizedImageFlags(img);

    // Cas 1: thumb -> big
    if (raw && raw.indexOf('/thumb/') >= 0) {
      const candidate = raw.replace('/thumb/', '/big/');
      if (REGEX.MD5_PARAM.test(candidate)) {
        processed.add(img);
        img.src = ensureParam(candidate, 'noht', '1');
        return;
      }
    }

    // Cas 2: lien direct big
    if (a.href && REGEX.BIG_PATH.test(a.href) && REGEX.MD5_PARAM.test(a.href)) {
      processed.add(img);
      img.src = ensureParam(a.href, 'noht', '1');
      return;
    }

    // Cas 3: fullview HTML -> fetch -> big URL
    if (a.href && REGEX.FULLVIEW_PATH.test(a.href)) {
      pending.add(img);
      fetchBigUrlFromFullview(a.href).then(function (bigUrl) {
        pending.delete(img);
        if (!bigUrl) {
          return;
        }
        processed.add(img);
        img.src = ensureParam(bigUrl, 'noht', '1');
      });
    }
  }

  function scanRoot(root) {
    if (!root || root.nodeType !== 1) {
      return;
    }

    if (root.matches && root.matches('a.postLink, a[href*="fastpic.org/"]')) {
      processAnchor(root);
    }

    if (root.querySelectorAll) {
      const anchors = root.querySelectorAll('a.postLink, a[href*="fastpic.org/"]');
      for (let i = 0; i < anchors.length; i++) {
        processAnchor(anchors[i]);
      }
    }
  }

  function enqueueScan(node) {
    if (!node) {
      return;
    }
    scanQueue.add(node);

    if (scanTimer !== null) {
      return;
    }

    scanTimer = window.setTimeout(function () {
      scanTimer = null;
      const nodes = Array.from(scanQueue);
      scanQueue.clear();
      for (let i = 0; i < nodes.length; i++) {
        scanRoot(nodes[i]);
      }
    }, CONFIG.SCAN_DEBOUNCE_MS);
  }

  function expandAllSpoilers() {
    if (!CONFIG.EXPAND_SPOILERS) {
      return;
    }

    const spoilers = document.querySelectorAll('.sp-head:not(.unfolded)');
    if (!spoilers.length) {
      return;
    }

    if (spoilers.length > CONFIG.MAX_SPOILERS_CLICK) {
      console.warn('[pornolabFullSizeImages] Trop de spoilers, auto-expand désactivé pour perf.');
      return;
    }

    let i = 0;
    function step() {
      const end = Math.min(i + CONFIG.SPOILER_CLICK_CHUNK, spoilers.length);
      for (; i < end; i++) {
        try { spoilers[i].click(); } catch (e) {}
      }
      if (i < spoilers.length) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const observer = new MutationObserver(function (mutationList) {
    for (let i = 0; i < mutationList.length; i++) {
      const m = mutationList[i];

      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        for (let j = 0; j < m.addedNodes.length; j++) {
          const n = m.addedNodes[j];
          if (n && n.nodeType === 1) {
            enqueueScan(n);
          }
        }
      } else if (m.type === 'attributes' && m.target && m.target.nodeType === 1) {
        const t = m.target;
        if (t.tagName === 'IMG') {
          const a = t.closest ? t.closest('a.postLink, a[href*="fastpic.org/"]') : null;
          if (a) {
            enqueueScan(a);
          }
        }
      }
    }
  });

  function init() {
    expandAllSpoilers();
    enqueueScan(document.body);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'data-src', 'data-original', 'href']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
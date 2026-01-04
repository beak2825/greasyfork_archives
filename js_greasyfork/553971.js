// ==UserScript==
// @name Pornolab Preview Light
// @namespace https://greasyfork.org/users/108513
// @version 3.3.1
// @description affiche une preview sur la page de recherche pour les liens
// @author seb-du17
// @license MIT
// @match *://pornolab.net/forum/tracker*
// @match *://pornolab.net/forum/viewforum*
// @match *://pornolab.net/forum/search*
// @run-at document-idle
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/553971/Pornolab%20Preview%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/553971/Pornolab%20Preview%20Light.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* global AbortController, IntersectionObserver, DOMParser, Image */

(function() {
'use strict';

// ========== Configuration ==========
const CONFIG = {
  MAX_CONCURRENT: 3,
  TIMEOUT: 5000,
  CACHE_SIZE: 200,
  DEBOUNCE: 100,
  IMG_WIDTH: 180,
  IMG_HEIGHT: 210,

  // PATCH: plus large => précharge plus tôt pendant le scroll
  ROOT_MARGIN: '1200px'
};

// ========== Cache LRU ==========
function createLRUCache(maxSize) {
  const cache = new Map();
  return {
    get: function(key) {
      if (!cache.has(key)) { return null; }
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    },
    set: function(key, value) {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    has: function(key) {
      return cache.has(key);
    }
  };
}

const cache = createLRUCache(CONFIG.CACHE_SIZE);
const requestQueue = [];
let activeRequests = 0;

// ========== CSS optimisé ==========
const style = document.createElement('style');
style.textContent = `
.pornolab-preview-wrapper {
  display: flex !important;
  align-items: flex-end !important;
  gap: 10px !important;
  width: 100% !important;
}
.pornolab-preview-wrapper-link {
  flex: 1 1 auto !important;
  min-width: 0 !important;
}
.pornolab-preview-img-container {
  width: ${CONFIG.IMG_WIDTH}px !important;
  height: ${CONFIG.IMG_HEIGHT}px !important;
  flex-shrink: 0 !important;
  overflow: hidden !important;
  border: 1px solid #444 !important;
  border-radius: 2px !important;
  content-visibility: auto !important;
}
.pornolab-preview-img-container img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}
`;
document.head.appendChild(style);

// ========== Fetch avec timeout ==========
function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(function() {
    controller.abort();
  }, timeout);

  return fetch(url, {
    signal: controller.signal,
    priority: 'low'
  }).then(function(response) {
    clearTimeout(timeoutId);
    return response;
  }).catch(function(error) {
    clearTimeout(timeoutId);
    throw error;
  });
}

// PATCH: extraction plus robuste, sans changer le principe
function extractPreviewUrl(doc) {
  const firstImg = doc.querySelector('.postImg');
  if (!firstImg) { return ''; }

  // Ton script utilisait uniquement title [file:168]
  // -> on garde title en priorité, puis fallback data-src/src.
  return (firstImg.title || firstImg.getAttribute('data-src') || firstImg.getAttribute('src') || '');
}

// ========== Queue de requêtes ==========
function processQueueItem(item) {
  const resolve = item.resolve;
  const url = item.url;

  fetchWithTimeout(url, CONFIG.TIMEOUT)
    .then(function(response) {
      if (!response.ok) { return ''; }
      return response.text();
    })
    .then(function(html) {
      if (!html) { return []; }

      const doc = new DOMParser().parseFromString(html, 'text/html');
      const u = extractPreviewUrl(doc); // PATCH
      const urls = u ? [u] : [];

      cache.set(url, urls);
      return urls;
    })
    .then(resolve)
    .catch(function() {
      resolve([]);
    })
    .finally(function() {
      activeRequests--;
      if (requestQueue.length) {
        processQueue();
      }
    });
}

function processQueue() {
  while (requestQueue.length && activeRequests < CONFIG.MAX_CONCURRENT) {
    const item = requestQueue.shift();
    activeRequests++;
    processQueueItem(item);
  }
}

function fetchPreviewUrls(url) {
  const cached = cache.get(url);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  return new Promise(function(resolve) {
    requestQueue.push({ resolve: resolve, url: url });
    processQueue();
  });
}

// ========== Insert preview ==========
function createPreviewWrapper(urls, link) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pornolab-preview-wrapper';

  const linkWrapper = document.createElement('div');
  linkWrapper.className = 'pornolab-preview-wrapper-link';
  linkWrapper.appendChild(link.cloneNode(true));

  const imgContainer = document.createElement('div');
  imgContainer.className = 'pornolab-preview-img-container';

  const img = new Image();
  img.src = urls[0];
  img.loading = 'lazy';
  img.decoding = 'async';
  img.onerror = function() {
    imgContainer.remove();
  };

  imgContainer.appendChild(img);

  wrapper.appendChild(linkWrapper);
  wrapper.appendChild(imgContainer);
  return wrapper;
}

function insertPreview(link) {
  if (link.dataset.previewDone) { return; }

  const href = link.getAttribute('href');

  // PATCH: ne marque done qu'après avoir validé href
  if (!href || href.charAt(0) !== '.') { return; }

  link.dataset.previewDone = '1';

  const url = 'https://pornolab.net/forum' + href.slice(1);

  fetchPreviewUrls(url).then(function(urls) {
    if (!urls.length) { return; }
    const wrapper = createPreviewWrapper(urls, link);
    if (link.parentNode) {
      link.parentNode.replaceChild(wrapper, link);
    }
  });
}

// ========== Process links avec IntersectionObserver ==========
const pendingLinks = new Set();
let debounceTimer;
let intersectionObserver;

function handleIntersection(entry) {
  if (entry.isIntersecting) {
    insertPreview(entry.target);
    intersectionObserver.unobserve(entry.target);
  }
}

intersectionObserver = new IntersectionObserver(
  function(entries) {
    for (let i = 0; i < entries.length; i++) {
      handleIntersection(entries[i]);
    }
  },
  // PATCH: rootMargin configurable
  { rootMargin: CONFIG.ROOT_MARGIN }
);

function processLinks() {
  const selector = '.tLink:not([data-preview-done]), .tt-text:not([data-preview-done])';
  const links = document.querySelectorAll(selector);

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (!pendingLinks.has(link)) {
      pendingLinks.add(link);
      intersectionObserver.observe(link);
    }
  }
}

function debouncedProcessLinks() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(processLinks, CONFIG.DEBOUNCE);
}

// ========== MutationObserver ==========
const mutationObserver = new MutationObserver(debouncedProcessLinks);

function init() {
  processLinks();
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();

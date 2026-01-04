// ==UserScript==
// @name         DODI Repacks - Endless Scroll + Page Label (Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Robust endless scroll for dodi-repacks.site with floating page number indicator (fixed init + debounce).
// @author       Doc00n
// @match        https://dodi-repacks.site/*
// @match        http://dodi-repacks.site/*
// @icon         https://dodi-repacks.site/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552422/DODI%20Repacks%20-%20Endless%20Scroll%20%2B%20Page%20Label%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552422/DODI%20Repacks%20-%20Endless%20Scroll%20%2B%20Page%20Label%20%28Fixed%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let loading = false;
  let reachedEnd = false;
  let nextUrlCache = null;
  let currentPageNum = 1;
  let scrollTimeout = null;

  // ---------- UI ----------
  function createLoader() {
    let loader = document.getElementById('tm-endless-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'tm-endless-loader';
      loader.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:12px;padding:6px 10px;border-radius:8px;background:rgba(0,0,0,0.75);color:#fff;font-size:13px;z-index:999999;display:none';
      loader.textContent = 'Loading...';
      document.body.appendChild(loader);
    }
    return loader;
  }
  function showLoader(show, text) {
    const loader = createLoader();
    loader.style.display = show ? 'block' : 'none';
    if (text) loader.textContent = text;
  }

  function createPageLabel() {
    let label = document.getElementById('tm-page-label');
    if (!label) {
      label = document.createElement('div');
      label.id = 'tm-page-label';
      label.style.cssText = [
        'position:fixed',
        'top:40%',
        'left:50%',
        'transform:translate(-50%,-50%)',
        'background:rgba(0,0,0,0.8)',
        'color:#fff',
        'font-size:56px',
        'font-weight:700',
        'padding:18px 36px',
        'border-radius:18px',
        'z-index:999999',
        'opacity:0',
        'pointer-events:none',
        'transition:opacity 0.6s ease'
      ].join(';');
      document.body.appendChild(label);
    }
    return label;
  }
  function showPageLabel(pageNum, timeout = 1600) {
    const label = createPageLabel();
    label.textContent = `Page ${pageNum}`;
    label.style.opacity = '1';
    clearTimeout(label._hideTimeout);
    label._hideTimeout = setTimeout(() => {
      label.style.opacity = '0';
    }, timeout);
  }

  // ---------- Helpers ----------
  function findPostContainer(doc = document) {
    const selectors = ['main', '#content', '.site-main', '.content', '.posts', '.post-list', '.container'];
    for (const sel of selectors) {
      const el = doc.querySelector(sel);
      if (el && el.children.length > 0) return el;
    }
    return doc.body;
  }

  function extractPosts(doc) {
    const postSelectors = ['article', '.post', '.entry', '.post-item', '.blog-entry', '.post-wrap'];
    for (const sel of postSelectors) {
      const nodes = doc.querySelectorAll(sel);
      if (nodes && nodes.length > 0) return Array.from(nodes);
    }
    // fallback: children of main
    const main = findPostContainer(doc);
    return main ? Array.from(main.children) : [];
  }

  function deriveNextFromUrl(urlStr) {
    try {
      const u = new URL(urlStr, location.origin);
      const path = u.pathname.replace(/\/$/, '');
      const m = path.match(/\/page\/(\d+)$/);
      if (m) {
        const nextNum = Number(m[1]) + 1;
        return u.origin + path.replace(/\/page\/\d+$/, `/page/${nextNum}/`);
      }
      // If at root or other, try appending /page/2/
      return u.origin + (path === '' ? '/' : path) + (path.endsWith('/') ? 'page/2/' : '/page/2/');
    } catch (e) {
      return null;
    }
  }

  function detectNextUrl(doc = document) {
    // 1) <link rel="next">
    const relNext = doc.querySelector('link[rel="next"]');
    if (relNext && relNext.href) return relNext.href;

    // 2) anchors that suggest next
    const anchors = Array.from(doc.querySelectorAll('a'));
    const nextTexts = ['next', 'next ›', 'next »', '›', '»', '>>'];
    for (const a of anchors) {
      const txt = (a.textContent || '').trim().toLowerCase();
      const aria = (a.getAttribute('aria-label') || '').toLowerCase();
      const rel = (a.getAttribute('rel') || '').toLowerCase();
      const cl = (a.className || '').toLowerCase();
      if (rel.includes('next') || aria.includes('next') || cl.includes('next') || nextTexts.includes(txt)) {
        if (a.href) return a.href;
      }
    }

    // 3) pagination container - try to find currently active and return next sibling anchor
    const pagination = doc.querySelector('.pagination, .nav-links, .page-numbers, .paging-navigation, .pagination-wrap');
    if (pagination) {
      const anchorsIn = Array.from(pagination.querySelectorAll('a'));
      for (let i = 0; i < anchorsIn.length; i++) {
        const a = anchorsIn[i];
        if (a.classList.contains('current') || a.getAttribute('aria-current') === 'page') {
          if (anchorsIn[i + 1] && anchorsIn[i + 1].href) return anchorsIn[i + 1].href;
        }
      }
      // fallback: look for anchor with class or text next
      for (const a of anchorsIn) {
        const txt = (a.textContent || '').trim().toLowerCase();
        if (txt.includes('next') || a.className.toLowerCase().includes('next')) return a.href;
      }
    }

    // 4) derive from current location
    const derived = deriveNextFromUrl(location.href);
    if (derived) return derived;

    return null;
  }

  // ---------- Fetch & Append ----------
  async function fetchAndAppend(url) {
    if (!url || loading || reachedEnd) return;
    loading = true;
    showLoader(true, 'Loading...');
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Fetch failed: ' + res.status);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');

      const newPosts = extractPosts(doc);
      if (!newPosts || newPosts.length === 0) {
        reachedEnd = true;
        showLoader(true, 'End of content');
        setTimeout(() => showLoader(false), 2000);
        return;
      }

      const dest = findPostContainer(document);
      const frag = document.createDocumentFragment();
      newPosts.forEach(node => frag.appendChild(document.importNode(node, true)));
      dest.appendChild(frag);

      // update page number
      const match = url.match(/\/page\/(\d+)\/?/);
      if (match) {
        currentPageNum = Number(match[1]);
      } else {
        // if no number in fetched URL, try increment
        currentPageNum = (Number(currentPageNum) || 1) + 1;
      }
      showPageLabel(currentPageNum);

      // update cached next url from fetched doc (prefer authoritative)
      nextUrlCache = detectNextUrl(doc);
      // fallback: derive from fetched url if still null
      if (!nextUrlCache) nextUrlCache = deriveNextFromUrl(url);

      console.log(`Appended ${newPosts.length} items from ${url}`);
    } catch (err) {
      console.warn('Error loading next page:', err);
      reachedEnd = true;
      showLoader(true, 'End of content');
      setTimeout(() => showLoader(false), 2000);
    } finally {
      loading = false;
      if (!reachedEnd) showLoader(false);
    }
  }

  // ---------- Scroll handler with debounce ----------
  function onScrollDebounced() {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(async () => {
      if (loading || reachedEnd) return;
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 700);
      if (!nearBottom) return;

      if (!nextUrlCache) nextUrlCache = detectNextUrl(document);
      if (!nextUrlCache) {
        // last resort, try deriving from current page
        nextUrlCache = deriveNextFromUrl(location.href);
      }
      if (nextUrlCache) {
        await fetchAndAppend(nextUrlCache);
      } else {
        console.warn('Could not determine next page URL.');
        reachedEnd = true;
      }
    }, 120); // small debounce
  }

  // ---------- Init ----------
  function init() {
    // set current page from location if present
    const m = location.pathname.match(/\/page\/(\d+)\/?/);
    if (m) currentPageNum = Number(m[1]);
    else currentPageNum = 1;

    // show initial label briefly so you know where you started
    showPageLabel(currentPageNum, 900);

    nextUrlCache = detectNextUrl(document) || deriveNextFromUrl(location.href);

    window.addEventListener('scroll', onScrollDebounced, { passive: true });

    // keep nextUrlCache updated if pagination area changes
    try {
      const pagArea = document.querySelector('.pagination, .nav-links, .page-numbers, .paging-navigation, .pagination-wrap');
      if (pagArea) {
        const mo = new MutationObserver(() => {
          nextUrlCache = detectNextUrl(document);
        });
        mo.observe(pagArea, { childList: true, subtree: true });
      }
    } catch (e) { /* ignore */ }

    console.log('%cTM Endless Scroll + Page Label initialized', 'color:lime');
  }

  init();
})();

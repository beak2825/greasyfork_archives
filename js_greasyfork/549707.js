// ==UserScript==
// @name         Google -> Dog Logo (robust)
// @namespace    https://example.local/
// @version      1.1
// @description  Replace Google's logo/wordmark with a dog picture (more robust selectors + logging)
// @match        https://www.google.*/*
// @match        http://www.google.*/*
// @match        https://google.*/*
// @match        http://google.*/*
// @include      /^https?:\/\/(.*\.)?google\.[a-z]+(\/.*)?$/
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549707/Google%20-%3E%20Dog%20Logo%20%28robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549707/Google%20-%3E%20Dog%20Logo%20%28robust%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const TAG = '[https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ9pfJM6VKaBv1iIzVD07dDMbLUYyKgChJSe9yaMmivKV6kKr7VH0zKmz5DCtIv-V_3XUrEicErKxTZT7Od4yHZBpafz6TbKnk7WeQXtVl0]';

  // Inline SVG (emoji) so no external requests are needed
  const dogDataUrl =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 272 92' width='272' height='92'>
      <rect width='100%' height='100%' fill='transparent'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Segoe UI Emoji, Noto Color Emoji, Apple Color Emoji, emoji' font-size='72'>🐶</text>
    </svg>`);

  function log(...args) { console.log(TAG, ...args); }
  function err(...args) { console.error(TAG, ...args); }

  function isVisible(el) {
    if (!el || !(el.getBoundingClientRect)) return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  }

  // Try multiple sensible selectors + fallbacks
  function findLogoNode() {
    // Common logo elements
    const selectors = [
      'img[alt*="Google"]',
      'img[id^="hplogo"]',
      'img[aria-label*="Google"]',
      'a[aria-label*="Google"]',
      'a[title*="Google"]',
      'svg[aria-label*="Google"]',
      'div#logo',             // older containers
      '.lnXdpd',              // sometimes used for doodles
      'a[href="/"] img',      // logo image inside root link
    ];

    for (const s of selectors) {
      try {
        const node = document.querySelector(s);
        if (node && isVisible(node)) { log('found by selector', s, node); return node; }
      } catch (e) { /* ignore selector errors */ }
    }

    // Fallback: anchor that navigates home (common for logo)
    const anchors = Array.from(document.querySelectorAll('a[href="/"], a[href^="/?"]'));
    for (const a of anchors) {
      if (isVisible(a) && (a.querySelector('img') || (a.textContent && a.textContent.toLowerCase().includes('google')))) {
        log('found home anchor', a);
        return a;
      }
    }

    // Final fallback: any element with visible text "Google"
    const all = Array.from(document.querySelectorAll('a,div,span'));
    for (const el of all) {
      if (isVisible(el) && el.textContent && el.textContent.trim().toLowerCase().includes('google')) {
        log('found by text content', el);
        return el;
      }
    }

    return null;
  }

  function makeDogImg(sizePx = 92) {
    const img = document.createElement('img');
    img.src = dogDataUrl;
    img.alt = 'Dog';
    img.title = 'Dog logo';
    img.id = 'dog-logo-replacement';
    img.style.height = sizePx + 'px';
    img.style.display = 'block';
    img.style.cursor = 'pointer';
    img.style.maxHeight = sizePx + 'px';
    return img;
  }

  function replaceLogo() {
    try {
      // Already replaced?
      if (document.getElementById('dog-logo-replacement')) return true;

      const node = findLogoNode();
      if (!node) { log('no logo node found (yet)'); return false; }

      // If it's an <img>, replace it directly
      if (node.tagName === 'IMG') {
        const newImg = makeDogImg(node.height || 92);
        node.parentNode.replaceChild(newImg, node);
        newImg.addEventListener('click', () => window.location.href = '/');
        log('replaced <img> logo');
        return true;
      }

      // If it's an anchor, try to clear children and insert our image
      const anchor = (node.tagName === 'A') ? node : node.querySelector('a');
      if (anchor && isVisible(anchor)) {
        while (anchor.firstChild) anchor.removeChild(anchor.firstChild);
        anchor.appendChild(makeDogImg(anchor.offsetHeight || 92));
        log('replaced inside <a>');
        return true;
      }

      // Otherwise replace inner content of the found node
      node.innerHTML = '';
      node.appendChild(makeDogImg(node.offsetHeight || 92));
      log('replaced generic node');
      return true;
    } catch (e) {
      err('replaceLogo error', e);
      return false;
    }
  }

  function start() {
    // initial attempt
    replaceLogo();

    // Observe DOM changes (Google often re-renders parts)
    const obs = new MutationObserver(() => replaceLogo());
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Also do a few periodic retries in case of lazy load
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (replaceLogo() || tries > 20) clearInterval(interval);
    }, 500);
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start, { once: true });
  } else start();

})();

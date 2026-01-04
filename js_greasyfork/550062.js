// ==UserScript==
// @name         Block all ads
// @license MIT
// @namespace    http://tampermonkey.net/
// @description  Block ads
// @version      0.0.1
// @author       an vu an
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550062/Block%20all%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/550062/Block%20all%20ads.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 🔗 Link thay thế (link an toàn hoặc rỗng)
  const SAFE_LINK = 'https://youtu.be/NG9FSIJ5cio';

  const FIXED_SELECTORS = [
    'ins.adsbygoogle',
    '.adsbygoogle',
    'iframe[name^="google_ads_"]',
    'div[id^="google_ads"]',
    '.ad-slot',
    '.ad-container',
    '.adbanner',
    '.advertisement',
    '.sponsored',
    '[data-ad]',
    '[data-ad-client]',
    '[data-ad-slot]',
    'iframe[src*="ads."]',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="adservice"]'
  ];

  const KEYWORDS_REGEX = [
    /\bad\b/i,
    /ads/i,
    /advert/i,
    /banner/i,
    /sponsor/i,
    /promoted/i,
    /promo/i,
    /doubleclick/i,
    /googlesyndication/i,
    /taboola/i,
    /outbrain/i
  ];

  const BLOCKED_SRC_KEYWORDS = [
    'doubleclick', 'googlesyndication', 'adservice',
    'adsystem', 'adsafeprotected', 'taboola',
    'outbrain', 'pubmatic'
  ];

  function replaceNodeLink(el) {
    if (!el) return;

    if (el.hasAttribute('href')) {
      el.setAttribute('href', SAFE_LINK);
    }
    if (el.hasAttribute('src')) {
      el.setAttribute('src', SAFE_LINK);
    }

    el.__ad_replaced = true;
  }

  function matchesKeyword(str) {
    if (!str) return false;
    return KEYWORDS_REGEX.some(rx => rx.test(str));
  }

  function shouldReplace(el) {
    // 🚫 Không đụng tới YouTube player hoặc video
    if (el.closest('#player, #movie_player, ytd-player')) return false;
    if (el.tagName && el.tagName.toLowerCase() === 'video') return false;

    // 🚫 Không đụng tới worksheet-preview-elements
    if (el.closest('#worksheet-preview-elements')) return false;

    const attrs = ['id', 'className', 'name', 'title', 'alt'];
    for (const a of attrs) {
      const val = el[a] || el.getAttribute?.(a) || '';
      if (matchesKeyword(String(val))) return true;
    }
    if (el.dataset) {
      for (const k in el.dataset) {
        if (matchesKeyword(k) || matchesKeyword(String(el.dataset[k]))) return true;
      }
    }
    const src = el.src || el.href || el.getAttribute?.('src') || el.getAttribute?.('href') || '';
    if (matchesKeyword(String(src))) return true;

    return false;
  }

  function scan(root = document) {
    // fixed selectors
    for (const sel of FIXED_SELECTORS) {
      root.querySelectorAll(sel).forEach(el => replaceNodeLink(el));
    }

    root.querySelectorAll('body *').forEach(el => {
      if (!el || el.__ad_replaced) return;

      const tag = (el.tagName || '').toLowerCase();
      if (['iframe', 'script', 'img', 'a'].includes(tag)) {
        const src = el.src || el.getAttribute?.('src') || el.getAttribute?.('href') || '';
        if (src) {
          const s = src.toLowerCase();
          for (const k of BLOCKED_SRC_KEYWORDS) {
            if (s.includes(k)) {
              replaceNodeLink(el);
              return;
            }
          }
        }
      }

      if (shouldReplace(el)) {
        replaceNodeLink(el);
      }
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const mut of mutations) {
      mut.addedNodes?.forEach(n => {
        if (n.nodeType === 1) scan(n);
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => scan(document), 200);
  });

  // quét nhanh vài lần đầu
  let fastRuns = 6;
  const fast = setInterval(() => {
    scan(document);
    if (--fastRuns <= 0) {
      clearInterval(fast);
      setInterval(() => scan(document), 5000);
    }
  }, 500);
})();

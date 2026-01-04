// ==UserScript==
// @name         Yahoo!ニュース 自動跳轉完整文章（高速版）
// @namespace    http://tampermonkey.net/
// @author       gpt5
// @version      2.0
// @description  在 Yahoo!ニュース pickup 頁自動跳轉至完整文章
// @match        https://news.yahoo.co.jp/pickup/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550969/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%E5%AE%8C%E6%95%B4%E6%96%87%E7%AB%A0%EF%BC%88%E9%AB%98%E9%80%9F%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550969/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%E5%AE%8C%E6%95%B4%E6%96%87%E7%AB%A0%EF%BC%88%E9%AB%98%E9%80%9F%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let redirected = false;
  const root = document.querySelector('main, #__next, #content, body') || document.body;

  function findReadMoreLink(container) {
    let a = container.querySelector('a[aria-label*="記事全文"], a[aria-label*="全文"], a[role="button"]');
    if (a && /articles\//.test(a.href)) return a;

    a = container.querySelector('a[class*="read"], a[class*="more"], a[class*="全文"], a[class*="pickup"]');
    if (a && /articles\//.test(a.href)) return a;

    const candidates = container.querySelectorAll('a[href*="/articles/"], a[href*="news.yahoo.co.jp/articles/"]');
    if (candidates.length === 1) return candidates[0];

    for (const link of candidates) {
      const text = (link.innerText || link.textContent || '').trim();
      if (text.includes('記事全文を読む') || text.includes('続きを読む') || text.includes('全文')) {
        return link;
      }
    }
    return null;
  }

  function redirectIfFound() {
    if (redirected) return;
    const link = findReadMoreLink(root);
    if (link && link.href && !redirected) {
      redirected = true;
      location.replace(link.href);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', redirectIfFound, { once: true, passive: true });
  } else {
    setTimeout(redirectIfFound, 0);
  }

  let timer = null;
  const observer = new MutationObserver(() => {
    if (redirected) {
      observer.disconnect();
      return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      redirectIfFound();
    }, 50);
  });

  observer.observe(root, { childList: true, subtree: true });

  setTimeout(redirectIfFound, 1000);
  setTimeout(() => {
    redirectIfFound();
    if (!redirected) observer.disconnect();
  }, 3000);
})();

// ==UserScript==
// @name         Quizlet 광고 완전차단 (요청 차단 + DOM 가로채기)
// @namespace    https://quizlet.com/
// @version      6.0
// @description  Quizlet 광고 로딩 자체를 차단하고, 남는 박스까지 제거
// @match        *://quizlet.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554928/Quizlet%20%EA%B4%91%EA%B3%A0%20%EC%99%84%EC%A0%84%EC%B0%A8%EB%8B%A8%20%28%EC%9A%94%EC%B2%AD%20%EC%B0%A8%EB%8B%A8%20%2B%20DOM%20%EA%B0%80%EB%A1%9C%EC%B1%84%EA%B8%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554928/Quizlet%20%EA%B4%91%EA%B3%A0%20%EC%99%84%EC%A0%84%EC%B0%A8%EB%8B%A8%20%28%EC%9A%94%EC%B2%AD%20%EC%B0%A8%EB%8B%A8%20%2B%20DOM%20%EA%B0%80%EB%A1%9C%EC%B1%84%EA%B8%B0%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 1️⃣ 광고 관련 도메인 요청 자체를 차단
  const blockList = [
    'googlesyndication.com',
    'doubleclick.net',
    'safeframe.googlesyndication.com',
    'ads.pubmatic.com',
    'adservice.google.com',
    'imasdk.googleapis.com'
  ];

  // fetch 가로채기
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString() || '';
    if (blockList.some(b => url.includes(b))) {
      console.warn('[AdBlock] fetch blocked:', url);
      return new Promise(() => {}); // 응답 안 함
    }
    return originalFetch.apply(this, args);
  };

  // XHR 가로채기
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (blockList.some(b => url.includes(b))) {
      console.warn('[AdBlock] xhr blocked:', url);
      return; // 요청 자체 중단
    }
    return originalOpen.call(this, method, url, ...rest);
  };

  // 2️⃣ DOM 생성 차단 (iframe, video, 광고div)
  const origCreateElement = document.createElement;
  document.createElement = function(tag, ...args) {
    const el = origCreateElement.call(document, tag, ...args);
    if (['iframe', 'video'].includes(tag.toLowerCase())) {
      const obs = new MutationObserver(() => {
        const src = el.src || '';
        if (blockList.some(b => src.includes(b)) || src.startsWith('blob:')) {
          el.remove();
          obs.disconnect();
        }
      });
      obs.observe(el, { attributes: true });
    }
    return el;
  };

  // 3️⃣ 광고 박스 제거 반복 (비워진 자리 포함)
  const purge = () => {
    const selectors = [
      '.has-billboard-ad',
      '.SiteAd-adContainer',
      '[id^="dfp-"]',
      '[id*="SidebarAds"]',
      '.__exco_root_container',
      '.exp-ui',
      'iframe[title="3rd party ad content"]'
    ];
    selectors.forEach(s =>
      document.querySelectorAll(s).forEach(el => el.remove())
    );
  };
  new MutationObserver(purge).observe(document, { childList: true, subtree: true });
  purge();
})();
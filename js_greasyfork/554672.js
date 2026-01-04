// ==UserScript==
// @name           自分用 YouTube to Braveリダイレクト（SPA対応版）
// @namespace      http://tampermonkey.net/
// @version        0.3
// @description    YouTubeをSafariで開いたら自動でBraveに転送（shortsは除外）
// @author         kmikrt
// @license        MIT
// @match          *://www.youtube.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/554672/%E8%87%AA%E5%88%86%E7%94%A8%20YouTube%20to%20Brave%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%EF%BC%88SPA%E5%AF%BE%E5%BF%9C%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554672/%E8%87%AA%E5%88%86%E7%94%A8%20YouTube%20to%20Brave%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%EF%BC%88SPA%E5%AF%BE%E5%BF%9C%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  // Braveで開く処理
  function redirectIfNeeded() {
    const url = location.href;

    // Shortsは除外
    if (url.includes("/shorts/")) return;

    // Braveで開くURLを生成
    const braveURL = 'brave://open-url?url=' + encodeURIComponent(url);

    // 二重リダイレクト防止
    if (window._redirectingToBrave) return;
    window._redirectingToBrave = true;

    // Braveへ転送
    location.href = braveURL;

    // ページを一時停止
    document.documentElement.innerHTML = `
      <style>
        body {
          background-color: black !important;
          color: white !important;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 18px;
        }
      </style>
      <body>
        Braveで開いています...
      </body>
    `;
  }

  // 最初のロード時
  redirectIfNeeded();

  // YouTube SPA対応：内部ナビゲーションを検知
  const observeUrlChange = () => {
    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        redirectIfNeeded();
      }
    }).observe(document, { subtree: true, childList: true });
  };

  observeUrlChange();

  // 追加: YouTubeの独自ナビゲーションイベントでも反応
  window.addEventListener("yt-navigate-finish", redirectIfNeeded);
  window.addEventListener("popstate", redirectIfNeeded);
})();

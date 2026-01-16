// ==UserScript==
// @name         GoodSmile Force Japanese
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動將 GoodSmile EN 頁面轉為 JA 頁面
// @author       61
// @match        https://www.goodsmile.com/en/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562819/GoodSmile%20Force%20Japanese.user.js
// @updateURL https://update.greasyfork.org/scripts/562819/GoodSmile%20Force%20Japanese.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = location.href;

    // 已經是日文版 → 不需要轉跳
    if (currentUrl.includes("/ja/")) return;

    // 不是英文頁面 → 不處理（避免誤動其他語系）
    if (!currentUrl.includes("/en/")) return;

    // 計算日文用的網址
    const jaUrl = currentUrl.replace("/en/", "/ja/");

    // 用 <img> 試探是否存在日文頁面，避免404
    const tester = new Image();
    tester.onload = () => {
        // 若能載入資源，表示 ja 頁面存在 → 轉跳
        location.replace(jaUrl);
    };
    tester.onerror = () => {
        // 若無法載入 → fallback 回英文（保持原樣）
        console.warn("GoodSmile: JA page not found, staying on EN");
    };

    // 激活測試（測試 favicon）
    tester.src = "https://www.goodsmile.com/ja/favicon.ico?" + Date.now();

    // 阻止網站之後再把你導回英文
    const redirectBlocker = new MutationObserver((muts) => {
        muts.forEach(m => {
            if (location.href.includes("/en/")) {
                location.replace(location.href.replace("/en/", "/ja/"));
            }
        });
    });

    redirectBlocker.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
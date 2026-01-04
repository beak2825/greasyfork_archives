// ==UserScript==
// @name         Sponichi 自動展開「続きを表示」
// @namespace    http://tampermonkey.net/
// @author       gpt5
// @version      1.0
// @description  頁面載入自動點擊「続きを表示」按鈕
// @match        https://www.sponichi.co.jp/entertainment/news/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550971/Sponichi%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%80%8C%E7%B6%9A%E3%81%8D%E3%82%92%E8%A1%A8%E7%A4%BA%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/550971/Sponichi%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E3%80%8C%E7%B6%9A%E3%81%8D%E3%82%92%E8%A1%A8%E7%A4%BA%E3%80%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickShowMore() {
        const btn = document.querySelector('span[data-component="button-show-more"], [data-component="button-show-more"]');
        if (btn) {
            btn.click();
        }
    }

    // 頁面載入後立即嘗試
    window.addEventListener('DOMContentLoaded', clickShowMore);
    // 若有延遲載入，監聽 DOM 變動
    new MutationObserver(clickShowMore).observe(document.body, {childList: true, subtree: true});
})();

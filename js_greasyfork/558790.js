// ==UserScript==
// @name        twbzmg_ad
// @namespace   https://www.twbzmg.com/comic/chapter/*
// @icon        https://static-tw.baozimh.com/static/bzmh/img/favicon-16x16.png
// @match       https://www.twbzmg.com/comic/chapter/*
// @grant       none
// @version     2025-12-13
// @author      qq
// @license     MIT
// @description zh
// @downloadURL https://update.greasyfork.org/scripts/558790/twbzmg_ad.user.js
// @updateURL https://update.greasyfork.org/scripts/558790/twbzmg_ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定每秒檢查一次
    const interval = setInterval(() => {
        // 尋找關閉按鈕
        const closeButton = document.querySelector('#baoziAdPopup .baozi-ad-close');

        if (closeButton) {
            console.log('找到廣告關閉按鈕，正在點擊...');
            closeButton.click();

            // 停止迴圈
            clearInterval(interval);
            console.log('已關閉廣告並停止偵測');
        }
    }, 1000); // 每 1000 毫秒 (1秒) 執行一次

})();
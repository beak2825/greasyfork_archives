// ==UserScript==
// @name                巴哈姆特動畫瘋热度筛选
// @icon                https://ani.gamer.com.tw/favicon.ico
// @name:zh-CN          巴哈姆特动画疯热度筛选
// @name:zh-TW          巴哈姆特動畫瘋熱度篩選
// @namespace           http://tampermonkey.net/
// @version             1.0
// @description         动画疯热度筛选  大于阈值的封面标注  or  删除小于阈值内容
// @author              e
// @match               *://*.gamer.com.tw/animeList*
// @grant               none
// @license             MIT
// @description:zh-TW   動畫瘋熱度篩選 【編輯程式碼設定過濾閾值和啟用功能】
// @description:zh-CN   动画疯热度筛选 【编辑代码设置过滤阈值和启用功能】
// @downloadURL https://update.greasyfork.org/scripts/550130/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E7%83%AD%E5%BA%A6%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550130/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E7%83%AD%E5%BA%A6%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
 
    /*********** 可配置區 ***********/
    const MIN_HOT = 2000000;      // 熱度過濾閾值，單位：數字（例如 2000000 = 200 萬）
    const ENABLE_BORDER = true;   // 啟用紅框標注  false   true
    const ENABLE_REMOVE = true;   // 啟用刪除不達標內容
    /*******************************/
 
    // 解析熱度文字，例如 "170.5萬", "2.3億", "2345000"
    function parseHot(str) {
        str = str.replace(/[^\d\.萬億]/g, ""); // 清理雜訊
        if (str.includes("億")) {
            return parseFloat(str) * 100000000;
        } else if (str.includes("萬")) {
            return parseFloat(str) * 10000;
        } else {
            return parseInt(str, 10);
        }
    }
 
    // 處理單個卡片
    function processCard(card) {
        if (card.dataset.processed) return; // 避免重複處理
        card.dataset.processed = "true";
 
        const viewEl = card.querySelector(".show-view-number p");
        if (!viewEl) return;
 
        const hot = parseHot(viewEl.innerText);
        if (isNaN(hot)) return;
 
        if (hot >= MIN_HOT) {
            if (ENABLE_BORDER) {
                card.style.border = "5px solid red";
                card.style.borderRadius = "8px";
                card.style.boxSizing = "border-box";
            }
        } else {
            if (ENABLE_REMOVE) {
                card.remove(); // 直接從DOM刪掉，不佔空間
            }
 
        }
    }
 
    // 遍歷所有卡片
    function scan() {
        document.querySelectorAll("a.theme-list-main").forEach(processCard);
    }
 
    // 初始掃描
    scan();
 
    // 監控動態加載
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
})();
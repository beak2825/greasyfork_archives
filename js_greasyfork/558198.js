// ==UserScript==
// @name         手機版巴哈姆特熱門話題強力修正 (Mobile Menu Fix)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  強制將手機版側邊欄的「熱門話題」按鈕導向HOTTOPIC
// @author       BaconEgg
// @match        https://*.gamer.com.tw/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558198/%E6%89%8B%E6%A9%9F%E7%89%88%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%86%B1%E9%96%80%E8%A9%B1%E9%A1%8C%E5%BC%B7%E5%8A%9B%E4%BF%AE%E6%AD%A3%20%28Mobile%20Menu%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558198/%E6%89%8B%E6%A9%9F%E7%89%88%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%86%B1%E9%96%80%E8%A9%B1%E9%A1%8C%E5%BC%B7%E5%8A%9B%E4%BF%AE%E6%AD%A3%20%28Mobile%20Menu%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_HREF = "https://m.gamer.com.tw/?t=HOTTOPIC";
    const KEYWORD_ICON = "fa-fire"; // 識別火焰圖示
    const KEYWORD_TEXT = "熱門話題"; // 識別文字

    // -----------------------------------------------------------
    // 方法 1: 事件攔截 (最強制，點擊當下直接生效)
    // -----------------------------------------------------------
    document.addEventListener('click', function(e) {
        // 尋找被點擊元素的父層是否為 <a> 標籤
        const link = e.target.closest('a');

        if (link) {
            // 檢查該連結是否符合特徵 (原始連結包含 #hot 或是我們已經改過的連結)
            // 並且確認內容文字或內部圖示包含特徵，避免誤判
            const isHotTopic = (link.href.includes('#hot') || link.href.includes('t=HOTTOPIC')) &&
                               (link.innerText.includes(KEYWORD_TEXT) || link.querySelector(`.${KEYWORD_ICON}`));

            if (isHotTopic) {
                // 如果目前的連結不是我們要的目標，或者這是攔截點擊
                if (link.href !== TARGET_HREF) {
                    // 阻止巴哈姆特原本的動作
                    e.preventDefault();
                    e.stopPropagation();
                    // 強制跳轉
                    window.location.href = TARGET_HREF;
                }
            }
        }
    }, true); // 注意這裡的 true，代表在「捕獲階段」就攔截，比網頁本身的 JS 更早執行

    // -----------------------------------------------------------
    // 方法 2: 視覺修改 (定時檢查，確保右鍵開啟也正確)
    // -----------------------------------------------------------
    function modifyLinkVisuals() {
        // 針對你提供的 HTML 結構尋找
        // 尋找所有包含 #hot 的連結
        const links = document.querySelectorAll('a[href*="#hot"]');

        links.forEach(link => {
            // 再次確認內容包含「熱門話題」，以免改錯其他東西
            if (link.innerText.includes(KEYWORD_TEXT) && link.href !== TARGET_HREF) {
                link.href = TARGET_HREF;
                // 移除 target="_blank" 如果有的話，確保在當前頁面開啟(依需求可保留)
                // link.removeAttribute('target');
                console.log('Tampermonkey: 側邊欄連結已視覺修正');
            }
        });
    }

    // 有需要可以取消下面註解:每 1秒檢查一次 (因為側邊欄是動態滑出的，MutationObserver 有時會漏接)
    //setInterval(modifyLinkVisuals, 1000);

})();
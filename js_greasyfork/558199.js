// ==UserScript==
// @name         手機版巴哈姆特側邊欄 - 新增熱門話題按鈕
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在巴哈姆特首頁側邊欄的「哈啦區」上方插入舊版「熱門話題」按鈕
// @author       BaconEgg
// @match        https://www.gamer.com.tw/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558199/%E6%89%8B%E6%A9%9F%E7%89%88%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%81%B4%E9%82%8A%E6%AC%84%20-%20%E6%96%B0%E5%A2%9E%E7%86%B1%E9%96%80%E8%A9%B1%E9%A1%8C%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/558199/%E6%89%8B%E6%A9%9F%E7%89%88%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%81%B4%E9%82%8A%E6%AC%84%20-%20%E6%96%B0%E5%A2%9E%E7%86%B1%E9%96%80%E8%A9%B1%E9%A1%8C%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL = "https://m.gamer.com.tw/?t=HOTTOPIC";
    const BUTTON_TEXT = "熱門話題";
    const BUTTON_ID = "tm-hot-topic-btn";

    // 火焰圖示 SVG (加上 width/height 100% 以適應原本的 div 大小)
    const FIRE_SVG = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" style="pointer-events: none; display: block;"><path d="M19.48 13.03A9.63 9.63 0 0 1 12 19a9.63 9.63 0 0 1-7.48-5.97 7.69 7.69 0 0 1-.52-2.86A9.12 9.12 0 0 1 12 2a9.12 9.12 0 0 1 8 8.17 7.69 7.69 0 0 1-.52 2.86zM13.35 12l2.1-4.2-4.2 2.1-2.1 4.2 4.2-2.1z"></path></svg>`;

    function addHotTopicButton() {
        // 1. 檢查是否已存在
        if (document.getElementById(BUTTON_ID)) return;

        // 2. 定位「哈啦區」按鈕 (針對您的 HTML 結構)
        // 您的 HTML 中，哈啦區的連結是 https://forum.gamer.com.tw
        const forumLink = document.querySelector('a[href="https://forum.gamer.com.tw"]');
        if (!forumLink) return;

        const forumLi = forumLink.closest('li.sidenav-section__item');
        if (!forumLi) return;

        // 3. 複製 LI 元素
        const newLi = forumLi.cloneNode(true);
        newLi.id = BUTTON_ID;

        // 4. 修改內部的 Anchor 連結
        const newAnchor = newLi.querySelector('a');
        if (newAnchor) {
            newAnchor.href = TARGET_URL;
            newAnchor.classList.remove('is-active'); // 移除選取狀態

            // 修改 Tooltip (滑鼠懸停提示)
            if (newAnchor.hasAttribute('data-collapse-tippy')) {
                newAnchor.setAttribute('data-collapse-tippy', BUTTON_TEXT);
            }
            if (newAnchor.hasAttribute('data-gtm-type')) {
                newAnchor.setAttribute('data-gtm-type', BUTTON_TEXT);
            }

            // --- 修正重點 1: 修改文字 ---
            // 您的 HTML 使用 <p class="sidenav-section__title">
            const titleP = newAnchor.querySelector('.sidenav-section__title');
            if (titleP) {
                // 移除可能的子元素 (例如 span)，直接設定純文字
                titleP.innerText = BUTTON_TEXT;
            }

            // --- 修正重點 2: 修改圖示 ---
            // 您的 HTML 使用 <div class="sidenav__icon service__icon icon-forum">
            const iconDiv = newAnchor.querySelector('.sidenav__icon');
            if (iconDiv) {
                // 移除原本的 icon-forum class (因為它是用背景圖片顯示圖示的)
                iconDiv.classList.remove('icon-forum');

                // 插入我們自定義的 SVG
                iconDiv.innerHTML = FIRE_SVG;

                // 調整一下顏色，確保跟旁邊的一樣是深灰色 (繼承父層顏色)
                iconDiv.style.color = "inherit";
                // 修正 SVG 位置微調 (如果需要)
                iconDiv.style.display = "flex";
                iconDiv.style.alignItems = "center";
                iconDiv.style.justifyContent = "center";
            }
        }

        // 5. 插入到列表 (插在原本哈啦區的上方)
        forumLi.parentNode.insertBefore(newLi, forumLi);
    }

    // 監測網頁變動 (確保動態載入時也能運作)
    const observer = new MutationObserver(() => {
        addHotTopicButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初次執行
    addHotTopicButton();
})();
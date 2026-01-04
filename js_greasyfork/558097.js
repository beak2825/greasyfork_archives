// ==UserScript==
// @name         JavDB to MissAV Linker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a direct link from a JavDB page to the corresponding MissAV page.
// @author       https://github.com/aizhimou
// @match        *://javdb456.com/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558097/JavDB%20to%20MissAV%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/558097/JavDB%20to%20MissAV%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ----------------------------------------------------------------
     * 步驟 1: 提取影片番號
     * ----------------------------------------------------------------
     * 我們通過CSS選擇器 '.panel-block.first-block .value' 來精準定位到包含番號的<span>元素。
     * .textContent 用於獲取該元素的純文本內容。
     * .trim() 用於移除文本前後可能存在的空白字符。
     */
    const videoIdElement = document.querySelector('.panel-block.first-block .value');

    // 如果頁面上沒有找到番號元素，則終止腳本執行，避免出錯。
    if (!videoIdElement) {
        console.log('無法在此頁面找到番號元素，腳本停止執行。');
        return;
    }

    const videoId = videoIdElement.textContent.trim();

    /**
     * ----------------------------------------------------------------
     * 步驟 2: 創建並插入新的按鈕
     * ----------------------------------------------------------------
     * 找到右下角的浮動按鈕容器 '.float-buttons'。
     * 如果找到了這個容器，我們就在裡面創建並添加新按鈕。
     */
    const floatButtonsContainer = document.querySelector('.float-buttons');

    if (floatButtonsContainer) {
        // 創建一個新的<a>元素（也就是鏈接）
        const missAvButton = document.createElement('a');

        // 設置新鏈接的屬性
        // 1. href: 這是鏈接的目標地址。我們使用提取到的小寫番號來構建URL。
        // 2. className: 為了讓新按鈕樣式與現有按鈕保持一致，我們賦予它相同的class。
        // 3. textContent: 這是按鈕上顯示的文字。
        missAvButton.href = `https://missav.ws/dm58/${videoId.toLowerCase()}`;
        missAvButton.className = 'material-scroll-magnets'; // 沿用現有樣式
        missAvButton.style = 'background:#fe628e'; // 设置新的背景颜色
        missAvButton.textContent = 'MissAV'; // 按鈕顯示文字

        // 為了在新標籤頁中打開鏈接，可以添加以下這行
        missAvButton.target = '_blank';

        // 使用 prepend 方法將新按鈕添加到浮動按鈕組的最前面。
        floatButtonsContainer.prepend(missAvButton);
    } else {
        console.log('無法找到浮動按鈕容器，無法添加新按鈕。');
    }
})();
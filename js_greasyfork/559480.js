// ==UserScript==
// @name         PTT Web Image Preview (term.ptt.cc) Centered & Large
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 term.ptt.cc 預覽圖片 (置中放大顯示、防切邊、防卡圖)
// @author       Gemini
// @match        https://term.ptt.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559480/PTT%20Web%20Image%20Preview%20%28termpttcc%29%20Centered%20%20Large.user.js
// @updateURL https://update.greasyfork.org/scripts/559480/PTT%20Web%20Image%20Preview%20%28termpttcc%29%20Centered%20%20Large.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PREVIEW_ID = 'ptt-center-preview-img';
    const IMG_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

    let activeLinkElement = null;
    let watchDogTimer = null;

    // 建立或取得預覽圖片元素
    function getPreviewElement() {
        let img = document.getElementById(PREVIEW_ID);
        if (!img) {
            img = document.createElement('img');
            img.id = PREVIEW_ID;

            // === CSS 樣式設定：置中與最大化 ===
            img.style.position = 'fixed';
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)'; // 讓圖片真正的中心點對準畫面中心

            img.style.zIndex = '2147483647'; // 最上層
            img.style.maxWidth = '95vw';     // 最大寬度：視窗寬度的 95%
            img.style.maxHeight = '95vh';    // 最大高度：視窗高度的 95%
            img.style.objectFit = 'contain'; // 保持比例縮放，確保圖片完整顯示不裁切

            img.style.border = '2px solid rgba(255, 255, 255, 0.5)';
            img.style.borderRadius = '8px';
            img.style.backgroundColor = '#000'; // 背景黑，避免透明圖看不清
            img.style.boxShadow = '0 0 30px rgba(0,0,0,0.9)'; // 強烈的陰影增加對比
            img.style.pointerEvents = 'none'; // 讓滑鼠穿透，避免游標誤觸圖片
            img.style.display = 'none';

            document.body.appendChild(img);
        }
        return img;
    }

    // 關閉預覽
    function removePreviewImage() {
        const img = document.getElementById(PREVIEW_ID);
        if (img) {
            img.style.display = 'none';
            img.src = '';
        }
        activeLinkElement = null;
        if (watchDogTimer) {
            clearInterval(watchDogTimer);
            watchDogTimer = null;
        }
    }

    // 滑鼠進入連結
    document.addEventListener('mouseover', function(e) {
        const target = e.target.closest('a');

        if (target && target.href && IMG_EXTENSIONS.test(target.href)) {
            // 防止重複觸發
            if (activeLinkElement === target) return;

            activeLinkElement = target;

            const img = getPreviewElement();
            img.src = target.href;
            img.style.display = 'block'; // 顯示圖片 (位置由 CSS 自動置中)

            // 啟動 WatchDog：防止換頁後圖片卡住
            if (watchDogTimer) clearInterval(watchDogTimer);
            watchDogTimer = setInterval(() => {
                // 檢查元素是否還存在於頁面上
                if (activeLinkElement && !activeLinkElement.isConnected) {
                    removePreviewImage();
                }
            }, 200);
        }
    }, true);

    // 滑鼠離開連結
    document.addEventListener('mouseout', function(e) {
        const target = e.target.closest('a');
        if (target && target === activeLinkElement) {
            removePreviewImage();
        }
    }, true);

    // === 安全機制：按鍵或滾動時強制關閉 ===
    window.addEventListener('keydown', function() {
        if (activeLinkElement) removePreviewImage();
    }, true);

    window.addEventListener('wheel', function() {
        if (activeLinkElement) removePreviewImage();
    }, true);

})();
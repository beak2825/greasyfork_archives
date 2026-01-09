// ==UserScript==
// @name         PTT Web Image Preview (term.ptt.cc)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在 term.ptt.cc 預覽圖片
// @author       Gemini
// @match        https://term.ptt.cc/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559480/PTT%20Web%20Image%20Preview%20%28termpttcc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559480/PTT%20Web%20Image%20Preview%20%28termpttcc%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PREVIEW_ID = 'ptt-center-preview-img';

    // 1. 標準圖片副檔名檢查
    const IMG_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

    // 2. Imgur 網址特徵 (針對沒有副檔名的連結)
    // 支援: imgur.com/ID, i.imgur.com/ID, m.imgur.com/ID
    const IMGUR_PATTERN = /^https?:\/\/(?:i\.|m\.)?imgur\.com\/([a-zA-Z0-9]{5,})(\/?)$/;

    let activeLinkElement = null;
    let watchDogTimer = null;

    /**
     * 判斷並取得真實圖片網址
     * @param {string} url 原始連結網址
     * @returns {string|null} 如果是圖片則回傳直連網址，否則回傳 null
     */
    function getImageUrl(url) {
        // Case A: 網址本身就有圖片副檔名 (例如 .jpg)
        if (IMG_EXTENSIONS.test(url)) {
            return url;
        }

        // Case B: Imgur 網址但沒有副檔名 (例如 https://imgur.com/PA3rQqo)
        const match = url.match(IMGUR_PATTERN);
        if (match) {
            // match[1] 是 ID (例如 PA3rQqo)
            // 強制轉為 i.imgur.com 並加上 .jpg，這樣 Imgur 才會給圖片而不是網頁
            return `https://i.imgur.com/${match[1]}.jpg`;
        }

        return null;
    }

    // 建立或取得預覽圖片元素
    function getPreviewElement() {
        let img = document.getElementById(PREVIEW_ID);
        if (!img) {
            img = document.createElement('img');
            img.id = PREVIEW_ID;

            // 解決 Imgur 403 Forbidden
            img.referrerPolicy = "no-referrer";

            // CSS 樣式
            img.style.position = 'fixed';
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.style.zIndex = '2147483647';
            img.style.maxWidth = '95vw';
            img.style.maxHeight = '95vh';
            img.style.objectFit = 'contain';
            img.style.border = '2px solid rgba(255, 255, 255, 0.5)';
            img.style.borderRadius = '8px';
            img.style.backgroundColor = '#000';
            img.style.boxShadow = '0 0 30px rgba(0,0,0,0.9)';
            img.style.pointerEvents = 'none';
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

        if (target && target.href) {
            // 透過 getImageUrl 檢查是否為支援的圖片連結
            const imageUrl = getImageUrl(target.href);

            if (imageUrl) {
                if (activeLinkElement === target) return;

                activeLinkElement = target;

                const img = getPreviewElement();
                img.src = imageUrl; // 使用處理過後的網址
                img.style.display = 'block';

                // WatchDog
                if (watchDogTimer) clearInterval(watchDogTimer);
                watchDogTimer = setInterval(() => {
                    if (activeLinkElement && !activeLinkElement.isConnected) {
                        removePreviewImage();
                    }
                }, 200);
            }
        }
    }, true);

    // 滑鼠離開連結
    document.addEventListener('mouseout', function(e) {
        const target = e.target.closest('a');
        if (target && target === activeLinkElement) {
            removePreviewImage();
        }
    }, true);

    // 安全機制
    window.addEventListener('keydown', function() {
        if (activeLinkElement) removePreviewImage();
    }, true);

    window.addEventListener('wheel', function() {
        if (activeLinkElement) removePreviewImage();
    }, true);

})();
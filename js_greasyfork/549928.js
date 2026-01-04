// ==UserScript==
// @name         YouTube 右下角放一顆複製短網址
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  The most robust script for cleaning YouTube URLs and copying short links.
// @author       You
// @match        https://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549928/YouTube%20%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%94%BE%E4%B8%80%E9%A1%86%E8%A4%87%E8%A3%BD%E7%9F%AD%E7%B6%B2%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/549928/YouTube%20%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%94%BE%E4%B8%80%E9%A1%86%E8%A4%87%E8%A3%BD%E7%9F%AD%E7%B6%B2%E5%9D%80.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let activityTimer = null;
    const buttonId = 'yt-copy-short-url-btn';
    const INACTIVITY_TIMEOUT_MS = 5000; // 5秒

    // 取得乾淨的網址和影片ID
    function getCleanUrlAndVideoId() {
        const url = new URL(window.location.href);
        let videoId = '';

        if (url.pathname.startsWith('/shorts/')) {
            videoId = url.pathname.split('/')[2];
        } else {
            videoId = url.searchParams.get('v');
        }

        if (videoId) {
            const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const shortUrl = `https://youtu.be/${videoId}`;
            return { cleanUrl, shortUrl, videoId };
        }

        return null;
    }

    // 將網址列的網址清理乾淨
    function cleanUrlInAddressBar() {
        const urls = getCleanUrlAndVideoId();
        if (urls && window.location.href !== urls.cleanUrl) {
            window.history.replaceState({}, '', urls.cleanUrl);
        }
    }

    // 隱藏按鈕
    function hideButton() {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.display = 'none';
        }
    }

    // 顯示按鈕
    function showButton() {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.display = 'block';
        }
    }

    // 重設計時器，用於偵測閒置
    function resetTimer() {
        clearTimeout(activityTimer);
        showButton();
        activityTimer = setTimeout(hideButton, INACTIVITY_TIMEOUT_MS);
    }

    // 監聽使用者活動，並重設計時器
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('mousedown', resetTimer);
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('scroll', resetTimer);

    // 處理網址變更，負責建立或移除按鈕
    function handleUrlChange() {
        cleanUrlInAddressBar(); // 確保網址列是乾淨的

        const urls = getCleanUrlAndVideoId();
        const existingButton = document.getElementById(buttonId);

        if (urls) {
            // 如果是影片頁面且按鈕不存在，就建立按鈕
            if (!existingButton) {
                const button = document.createElement('button');
                button.id = buttonId;
                button.textContent = '複製短網址';
                button.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    background-color: #ff0000;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                `;

                document.body.appendChild(button);
                resetTimer();

                button.onclick = async () => {
                    const currentUrls = getCleanUrlAndVideoId();
                    if (!currentUrls) return;

                    try {
                        await navigator.clipboard.writeText(currentUrls.shortUrl);
                        button.textContent = '已複製!';
                        resetTimer();
                        setTimeout(() => button.textContent = '複製短網址', 2000);
                    } catch (err) {
                        console.error('無法複製到剪貼簿:', err);
                        alert('無法複製短網址，請手動複製: ' + currentUrls.shortUrl);
                    }
                };
            } else {
                // 如果按鈕已存在，只重設計時器
                resetTimer();
            }
        } else {
            // 如果不是影片頁面且按鈕存在，就移除按鈕
            if (existingButton) {
                existingButton.remove();
                clearTimeout(activityTimer); // 移除按鈕後，清除計時器
            }
        }
    }

    // 程式載入時立即執行一次
    handleUrlChange();

    // 監聽 YouTube 內部的導航完成事件
    window.addEventListener('yt-navigate-finish', handleUrlChange);

})();
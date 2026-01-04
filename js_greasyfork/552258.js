// ==UserScript==
// @name         移除 YouTube 暫停提示＋自動繼續播放
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動移除 YouTube「影片已暫停」提示，並在影片暫停時自動繼續播放。
// @author       issac
// @license      GPL-3.0 License
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552258/%E7%A7%BB%E9%99%A4%20YouTube%20%E6%9A%AB%E5%81%9C%E6%8F%90%E7%A4%BA%EF%BC%8B%E8%87%AA%E5%8B%95%E7%B9%BC%E7%BA%8C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/552258/%E7%A7%BB%E9%99%A4%20YouTube%20%E6%9A%AB%E5%81%9C%E6%8F%90%E7%A4%BA%EF%BC%8B%E8%87%AA%E5%8B%95%E7%B9%BC%E7%BA%8C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tryResumePlayback() {
        const video = document.querySelector('video');
        if (!video) return;

        // 若影片存在且被暫停
        if (video.paused) {
            video.play().then(() => {
                console.log('▶️ 自動繼續播放');
            }).catch(err => {
                // 若被瀏覽器攔截，就模擬點擊播放按鈕
                const playBtn = document.querySelector('.ytp-play-button');
                if (playBtn) {
                    playBtn.click();
                    console.log('🖱️ 模擬點擊播放');
                }
            });
        }
    }

    setInterval(() => {
        // 移除提示框
        const dialog = document.querySelector('tp-yt-paper-dialog, .ytd-popup-container, .ytp-pause-overlay');
        if (dialog) {
            dialog.remove();
            console.log('🧹 已移除暫停提示');
        }

        // 檢查是否暫停、嘗試恢復播放
        tryResumePlayback();
    }, 5000); // 每5秒檢查一次
})();

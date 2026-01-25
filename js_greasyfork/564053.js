// ==UserScript==
// @name         YouTube Mobile Autoplay (Chrome Android)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Force autoplay for YouTube videos on Chrome Android without any manual touch
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       Agreasyforkuser+ME
// @match        https://m.youtube.com/watch?v=*
// @match        https://m.youtube.com/shorts/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564053/YouTube%20Mobile%20Autoplay%20%28Chrome%20Android%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564053/YouTube%20Mobile%20Autoplay%20%28Chrome%20Android%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceAutoplay() {
        // 直接操作 video 元素
        const video = document.querySelector('video');
        if (video) {
            video.muted = false; // 尝试不静音播放
            video.play().then(() => {
                console.log('YouTube Autoplay: Video playing');
            }).catch(err => {
                // 如果失败，尝试静音播放
                console.log('Trying muted autoplay...');
                video.muted = true;
                video.play();
            });
            return true;
        }

        // 如果找不到 video，尝试点击播放按钮
        const playButton = document.querySelector('.ytp-large-play-button');
        if (playButton) {
            playButton.click();
            console.log('YouTube Autoplay: Play button clicked');
            return true;
        }

        return false;
    }

    // 使用 MutationObserver 监听页面变化
    const observer = new MutationObserver((mutations) => {
        if (forceAutoplay()) {
            // 成功后可以选择停止观察
            // observer.disconnect();
        }
    });

    // 立即尝试
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(forceAutoplay, 100);
            // 开始观察 DOM 变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        setTimeout(forceAutoplay, 100);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 多次重试机制
    [500, 1000, 1500, 2000, 3000].forEach(delay => {
        setTimeout(forceAutoplay, delay);
    });
})();
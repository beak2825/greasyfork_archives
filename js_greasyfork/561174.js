// ==UserScript==
// @name         YouTube 油管去广告 Pro
// @version      3.6.3
// @description  采用倍速快进跳过技术，避开检测（修复 document.body 为 null 问题）
// @author       stephchow
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @namespace    https://greasyfork.org/users/1555314
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561174/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561174/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 第一步：立即注入 CSS（安全，可在 document-start 执行）
    const adSelectors = [
        '.video-ads', '.ytp-ad-module', 'ytd-ad-slot-renderer',
        'ytd-rich-item-renderer:has([aria-label*="Ad"])',
        'ytd-rich-item-renderer:has([aria-label*="廣告"])',
        '#player-ads', 'ytd-banner-promo-renderer',
        '#masthead-ad', '.ad-showing', '.ad-interrupting'
    ].join(', ');

    GM_addStyle(`${adSelectors} { display: none !important; }`);

    // ✅ 第二步：等待 DOM 加载完成后再启动 JS 逻辑
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // --- 核心逻辑 ---
        function handleVideoAds() {
            const video = document.querySelector('video');
            const moviePlayer = document.getElementById('movie_player');

            const isAd = moviePlayer?.classList.contains('ad-showing') ||
                         moviePlayer?.classList.contains('ad-interrupting');

            if (video && isAd) {
                video.muted = true;
                video.playbackRate = 16;
                if (isFinite(video.duration) && video.duration > 0) {
                    video.currentTime = video.duration - 0.1;
                }

                const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern');
                if (skipButton) skipButton.click();
            }
        }

        function removeEnforcement() {
            // 安全检查：确保 body 存在
            if (!document.body) return;

            const overlays = document.querySelectorAll(
                'ytd-enforcement-message-view-model, tp-yt-iron-overlay-backdrop, ytd-popup-container'
            );
            overlays.forEach(el => {
                if (el.parentNode) el.remove();
            });

            // 修复滚动锁定
            if (document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
            }
        }

        // 启动监听
        const observer = new MutationObserver(() => {
            handleVideoAds();
            removeEnforcement();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });

        setInterval(handleVideoAds, 500);
    }
})();
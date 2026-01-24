// ==UserScript==
// @name         YouTube 油管去广告 Pro
// @version      3.6.5
// @description  修复账号切换问题：不再误删 ytd-popup-container，仅移除广告相关弹窗
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

    // ✅ 第一步：注入 CSS 隐藏广告（安全，无副作用）
    const adSelectors = [
        '.video-ads', '.ytp-ad-module', 'ytd-ad-slot-renderer',
        'ytd-rich-item-renderer:has([aria-label*="Ad"])',
        'ytd-rich-item-renderer:has([aria-label*="廣告"])',
        '#player-ads', 'ytd-banner-promo-renderer',
        '#masthead-ad', '.ad-showing', '.ad-interrupting'
    ].join(', ');

    GM_addStyle(` $ {adSelectors} { display: none !important; }`);

    // ✅ 第二步：等待 DOM 加载后启动逻辑
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // --- 视频广告处理 ---
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

        // --- 仅移除广告/反广告弹窗，不碰账号菜单！---
        function removeAdOverlays() {
            if (!document.body) return;

            // ✅ 只移除明确与广告或“请停用广告拦截器”相关的元素
            const adOverlays = document.querySelectorAll([
                'ytd-enforcement-message-view-model',           // “请停用广告拦截器”弹窗
                'tp-yt-paper-dialog[aria-label*="ad blocker"]', // 老版反广告弹窗
                'ytd-statement-banner-renderer',                // 顶部声明横幅（有时含广告提示）
                'ytd-mealbar-promo-renderer'                    // 促销条（非账号相关）
            ].join(', '));

            adOverlays.forEach(el => {
                if (el.parentNode && el.isConnected) {
                    el.remove();
                }
            });

            // ✅ 修复因弹窗导致的页面滚动锁定
            if (document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
            }
        }

        // --- 启动监听（仅监听广告高发区域）---
        const observer = new MutationObserver(() => {
            handleVideoAds();
            removeAdOverlays();
        });

        // 只监听 #player 和主内容区，避免全局监听影响性能
        const player = document.getElementById('player');
        const app = document.getElementById('app');
        if (player) observer.observe(player, { childList: true, subtree: true });
        if (app) observer.observe(app, { childList: true, subtree: true });

        // 定时检查（兜底）
        setInterval(handleVideoAds, 1000);
    }
})();
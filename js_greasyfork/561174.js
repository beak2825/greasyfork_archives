// ==UserScript==
// @name         YouTube油管去广告
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  屏蔽 YouTube 广告（包括视频前贴片、信息流广告、弹窗等），并绕过反广告拦截提示。
// @author       stephchow
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561174/YouTube%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/561174/YouTube%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============= 1. 注入 CSS 隐藏广告元素 =============
    const adSelectors = [
        // 视频播放器广告（前贴片、暂停广告等）
        '.video-ads',
        'ytd-ad-slot-renderer',
        'ytd-promoted-sparkles-text-search-renderer',
        '#masthead-ad',

        // 信息流中的推广视频
        'ytd-rich-item-renderer:has(ytd-badge-supported-renderer[aria-label*="廣告"]), ' +
        'ytd-rich-item-renderer:has(ytd-badge-supported-renderer[aria-label*="Ad"]), ' +
        'ytd-rich-item-renderer:has(ytd-badge-supported-renderer[aria-label*="Sponsor"])',

        // 赞助内容徽章
        'ytd-badge-supported-renderer[aria-label*="廣告"], ' +
        'ytd-badge-supported-renderer[aria-label*="Ad"], ' +
        'ytd-badge-supported-renderer[aria-label*="Sponsor"]',

        // 购物广告、商品横幅
        'ytd-merch-shelf-renderer',
        'ytd-in-feed-ad-layout-renderer'
    ].join(', ');

    GM_addStyle(`
        ${adSelectors} {
            display: none !important;
        }
    `);

    // ============= 2. 动态移除反广告拦截弹窗 =============
    function removeAntiAdBlockDialog() {
        const dialogs = document.querySelectorAll('tp-yt-paper-dialog, ytd-enforcement-message-view-model, ytd-popup-container');
        dialogs.forEach(dialog => {
            const text = dialog.innerText || '';
            if (text.includes('ad blocker') ||
                text.includes('廣告攔截') ||
                text.includes('停用廣告攔截') ||
                text.includes('disable your ad blocker')) {
                dialog.remove();
                // 恢复页面滚动和视频播放
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                const video = document.querySelector('video');
                if (video && video.paused) {
                    video.play().catch(() => {}); // 忽略 play() 的权限错误
                }
            }
        });
    }

    // 定期检查弹窗（每秒一次）
    setInterval(removeAntiAdBlockDialog, 1000);

    // ============= 3. 禁用 YouTube 内部广告检测（实验性） =============
    const originalPush = history.pushState;
    history.pushState = function () {
        originalPush.apply(this, arguments);
        setTimeout(() => {
            try {
                // 尝试清除可能触发广告检测的配置
                if (window.yt && window.yt.config_) {
                    delete window.yt.config_.EXPERIMENT_FLAGS?.['kevlar_watch_ads_instream'];
                    delete window.yt.config_.EXPERIMENT_FLAGS?.['polymer_video_carousel_ad_badge'];
                }
            } catch (e) {}
        }, 500);
    };

})();
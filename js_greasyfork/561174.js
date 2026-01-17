// ==UserScript==
// @name         🔥 YouTube 油管去广告 Pro (2026 增强版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  屏蔽 YouTube 广告 + 绕过反广告检测 + 自动恢复播放
// @author       stephchow
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561174/%F0%9F%94%A5%20YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro%20%282026%20%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561174/%F0%9F%94%A5%20YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro%20%282026%20%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============= 1. 隐藏广告元素（扩展选择器） =============
    const adSelectors = [
        // 播放器广告
        '.video-ads', '#player-ads', '.ytp-ad-module',
        'ytd-ad-slot-renderer', 'ytd-player-legacy-desktop-watch-ads-renderer',

        // 信息流推广
        'ytd-rich-item-renderer:has(ytd-badge-supported-renderer[aria-label*="廣告"]), ' +
        'ytd-rich-item-renderer:has(ytd-badge-supported-renderer[aria-label*="Ad"]), ' +
        'ytd-rich-item-renderer:has(ytd-badge-supported-renderer[aria-label*="Sponsor"]), ' +
        'ytd-rich-item-renderer:has(.ytd-video-meta-block span:contains("Ad"))',

        // 徽章 & 商品
        'ytd-badge-supported-renderer[aria-label*="廣告"], ' +
        'ytd-badge-supported-renderer[aria-label*="Ad"], ' +
        'ytd-merch-shelf-renderer', 'ytd-in-feed-ad-layout-renderer',

        // 新版动态广告容器（2025+）
        '[id^="ad-"]', '[class*="ad-"][class*="renderer"]'
    ].join(', ');

    GM_addStyle(`
        ${adSelectors} {
            display: none !important;
            height: 0 !important;
            visibility: hidden !important;
        }
        /* 防止布局跳动 */
        ytd-rich-grid-row > #contents > ytd-rich-item-renderer[style*="display: none"] {
            display: none !important;
        }
    `);

    // ============= 2. 智能移除反广告弹窗 + 恢复播放 =============
    function removeAntiAdBlock() {
        // 方法1：移除已知弹窗组件
        const badElements = [
            'ytd-enforcement-message-view-model',
            'tp-yt-paper-dialog',
            'ytd-popup-container',
            'ytd-engagement-panel-section-list-renderer[page-subtype="ad"]'
        ];
        badElements.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });

        // 方法2：劫持错误状态，强制播放
        const video = document.querySelector('video');
        if (video) {
            // 解除暂停状态
            if (video.paused && !document.hidden) {
                video.play().catch(e => console.debug('[AdBlock] Auto-play failed:', e));
            }

            // 伪造广告上报（防止后台检测）
            if (!window.__adReported__) {
                window.__adReported__ = true;
                // 模拟广告可见事件（欺骗 IntersectionObserver）
                video.dispatchEvent(new CustomEvent('yt-visibility-change', { detail: { visible: true } }));
            }
        }

        // 方法3：恢复页面滚动
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    // 高频检查（初期密集，后期降频）
    let checkCount = 0;
    const checkInterval = setInterval(() => {
        removeAntiAdBlock();
        checkCount++;
        if (checkCount > 20) clearInterval(checkInterval); // 20秒后停止高频检查
    }, 500);

    // 低频保活
    setInterval(removeAntiAdBlock, 3000);

    // ============= 3. 劫持历史路由，修复 SPA 广告残留 =============
    const originalPush = history.pushState;
    history.pushState = function () {
        originalPush.apply(this, arguments);
        setTimeout(removeAntiAdBlock, 800);
    };

    // ============= 4. 阻止广告相关请求（可选，需配合 uBlock） =============
    // 注意：纯脚本无法拦截 fetch/XHR，此处仅为示意
    // 实际建议搭配 uBOPa 规则

    console.log('[YouTube AdBlock Pro] 已启动 | 2026 增强版');
})();
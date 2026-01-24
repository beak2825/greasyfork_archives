// ==UserScript==
// @name         YouTube 油管去广告 Pro
// @version      3.6.6
// @description  修复账号切换问题+新增广告选择器+诊断日志
// @author       stephchow
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @namespace    https://greasyfork.org/users/1555314
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561174/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561174/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E5%B9%BF%E5%91%8A%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======================
   const logger = {
    logLevel: 'warn',

    log(level, ...args) {
        if (this.logLevel === 'silent') return;

        // 定义层级权重，用于过滤低优先级日志
        const levels = { 'info': 1, 'warn': 2, 'error': 3 };
        const currentWeight = levels[this.logLevel] || 0;
        const targetWeight = levels[level] || 0;

        // 如果当前设置的等级高于目标等级，则不打印（例如：warn 模式下不打印 info）
        if (targetWeight < currentWeight) return;

        const styleMap = {
            info: 'color: #00aa00; font-weight: bold;',
            warn: 'color: #ff8c00; font-weight: bold;',
            error: 'color: #ff3333; font-weight: bold;'
        };

        // 这里的 [ ${level.toUpperCase()}] 修复了之前可能存在的语法隐患
        console.log(
            `%c[YT-AdBlock]%c [${level.toUpperCase()}]`,
            'color: #666; font-weight: bold;',
            styleMap[level] || '',
            ...args
        );
    },

    info(...args)  { this.log('info', ...args); },
    warn(...args)  { this.log('warn', ...args); },
    error(...args) { this.log('error', ...args); }
};

    // ======================
    // 🎨 注入 CSS 隐藏广告元素
    // ======================
    const adSelectors = [
        // 主广告容器
        '.video-ads', '.ytp-ad-module', 'ytd-ad-slot-renderer',
        '#player-ads', 'ytd-banner-promo-renderer', '#masthead-ad',
        '.ad-showing', '.ad-interrupting',

        // 信息流广告
        'ytd-in-feed-ad-layout-renderer',
        'ytd-ad-slot',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-promoted-video-renderer',

        // 带 "Ad"/"廣告" 标签的推荐项
        'ytd-rich-item-renderer:has([aria-label*="Ad" i])',
        'ytd-rich-item-renderer:has([aria-label*="廣告"])',

        // 反广告检测弹窗 & 推广横幅
        'ytd-enforcement-message-view-model',
        'tp-yt-paper-dialog[aria-label*="ad blocker" i]',
        'ytd-statement-banner-renderer',
        'ytd-mealbar-promo-renderer',
        '.yt-mealbar-skeleton-renderer'
    ].join(', ');

    try {
        GM_addStyle(`${adSelectors} { display: none !important; }`);
        logger.info('CSS 广告规则注入成功。');
    } catch (e) {
        logger.error('CSS 注入失败:', e);
    }

    // ======================
    // ⚙️ 主逻辑初始化
    // ======================
    function init() {
        // --- 跳过视频广告 ---
       function handleVideoAds() {
    const video = document.querySelector('video');
    const moviePlayer = document.getElementById('movie_player');

    // 多重检测：类名 + 广告覆盖层
    const isAd =
        (moviePlayer?.classList.contains('ad-showing') ||
         moviePlayer?.classList.contains('ad-interrupting')) ||
        !!document.querySelector('.ytp-ad-player-overlay');

    if (!video || !isAd) return;

    logger.info('检测到视频广告，正在处理…');

            // 尝试点击跳过按钮
            const skipButton = document.querySelector(
                '.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern'
            );

            if (skipButton && skipButton.offsetParent !== null) {
                skipButton.click();
                logger.info('✅ 已点击“跳过广告”按钮。');
                return;
            }

            // 否则强制快进
            try {
                video.muted = true;
                video.playbackRate = 16;
                if (isFinite(video.duration) && video.duration > 1) {
                    video.currentTime = video.duration - 0.1;
                    logger.info('⏩ 已快进至广告结尾。');
                }
            } catch (err) {
                logger.warn('⚠️ 快进广告时发生异常（通常可忽略）:', err.message);
            }
        }

        // --- 移除广告相关遮罩/弹窗 ---
        function removeAdOverlays() {
            const selectors = [
                'ytd-enforcement-message-view-model',
                'tp-yt-paper-dialog[aria-label*="ad blocker" i]',
                'ytd-statement-banner-renderer',
                'ytd-mealbar-promo-renderer',
                '.yt-mealbar-skeleton-renderer'
            ].join(', ');

            const overlays = document.querySelectorAll(selectors);
            if (overlays.length > 0) {
                logger.warn(`🗑️ 正在移除  ${overlays.length} 个广告相关遮罩层。`);
                overlays.forEach(el => {
                    if (el.isConnected) el.remove();
                });

                // 恢复页面滚动
                if (document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = '';
                    logger.info('🔓 已恢复页面滚动。');
                }
            }
        }

        // --- 启动监听 ---
        const observer = new MutationObserver(() => {
            handleVideoAds();
            removeAdOverlays();
        });

        // 监听整个 body，覆盖动态内容
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // 定时检查视频状态（兜底）
        const videoInterval = setInterval(handleVideoAds, 800);

        // 清理函数（可选：用于 SPA 路由切换时不重复监听）
        // 本脚本为简单场景，暂不实现 SPA 卸载逻辑

        logger.info('🚀 YouTube 广告拦截脚本已启动！');
    }

    // 确保 DOM 就绪（@run-at document-idle 已保证，但仍做安全检查）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
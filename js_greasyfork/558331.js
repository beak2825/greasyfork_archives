// ==UserScript==
// @name         粉笔题库 - 自动隐藏视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动隐藏粉笔题库中的视频解析部分（适配移动端）
// @author       You
// @match        *://*.fenbi.com/*
// @match        *://fenbi.com/*
// @match        *://*.fenbike.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558331/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%20-%20%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558331/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%20-%20%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式隐藏视频
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏视频相关元素 */
        .video-wrapper,
        .video-container,
        .video-section,
        .video-player,
        [class*="video"],
        [class*="Video"],
        [class*="player"],
        iframe[src*="video"],
        iframe[src*="player"],
        video,

        /* 视频标签/按钮 */
        [data-type="video"],
        .tab-video,
        .video-tab,
        button[class*="video"],

        /* 移动端视频容器 */
        div[class*="video-"],
        div[class*="Video-"],
        section[class*="video"],
        .m-video,
        .mobile-video {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
            opacity: 0 !important;
        }

        /* 确保文字解析正常显示 */
        .text-analysis,
        .analysis-text,
        [class*="解析"],
        [class*="analysis"] {
            display: block !important;
            visibility: visible !important;
        }
    `;

    // 注入样式
    function injectStyle() {
        if (document.head) {
            document.head.appendChild(style);
        } else {
            setTimeout(injectStyle, 50);
        }
    }
    injectStyle();

    // 持续监听并隐藏动态加载的视频
    function hideVideos() {
        const selectors = [
            'video',
            'iframe[src*="video"]',
            'iframe[src*="player"]',
            '[class*="video"]',
            '[class*="Video"]',
            '[class*="player"]',
            '[data-type="video"]'
        ];

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // 排除文字解析元素
                    if (!el.className.includes('text') &&
                        !el.className.includes('analysis-text')) {
                        el.style.cssText = 'display:none!important;visibility:hidden!important;height:0!important;';
                    }
                });
            } catch(e) {}
        });
    }

    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideVideos);
    } else {
        hideVideos();
    }

    // 监听DOM变化
    const observer = new MutationObserver(hideVideos);

    window.addEventListener('load', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 每秒检查一次（针对延迟加载）
        setInterval(hideVideos, 1000);
    });

    console.log('✅ 粉笔题库视频隐藏脚本已启动');

})();

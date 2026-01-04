// ==UserScript==
// @name         基金培训-挂机 (防暂停+2倍速+静音)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  彻底解决鼠标移出暂停问题，强制锁定2倍速播放，强制静音。支持 iframe 嵌套视频。
// @match        *://*.amac.org.cn/*
// @match        *://*.ataschool.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556953/%E5%9F%BA%E9%87%91%E5%9F%B9%E8%AE%AD-%E6%8C%82%E6%9C%BA%20%28%E9%98%B2%E6%9A%82%E5%81%9C%2B2%E5%80%8D%E9%80%9F%2B%E9%9D%99%E9%9F%B3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556953/%E5%9F%BA%E9%87%91%E5%9F%B9%E8%AE%AD-%E6%8C%82%E6%9C%BA%20%28%E9%98%B2%E6%9A%82%E5%81%9C%2B2%E5%80%8D%E9%80%9F%2B%E9%9D%99%E9%9F%B3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        playbackRate: 2.0, // 设置播放速度 (支持 2.0, 3.0, 16.0 等，建议不要超过 2.0 否则可能不计入进度)
        mute: true // 是否静音
    };

    console.log(`%c[全能挂机脚本] 初始化... 目标速度: ${CONFIG.playbackRate}x, 静音: ${CONFIG.mute}`, 'color: #0f0; background: #000; padding: 4px;');

    // ==========================================
    // 核心策略 1: 欺骗浏览器可见性 API (底层防御)
    // ==========================================
    function mockVisibility() {
        Object.defineProperty(document, 'hidden', { value: false, writable: false, configurable: true });
        Object.defineProperty(document, 'webkitHidden', { value: false, writable: false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false, configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { value: 'visible', writable: false, configurable: true });

        const originalHasFocus = document.hasFocus;
        document.hasFocus = function() { return true; };

        const originalAddEventListener = window.addEventListener;
        window.addEventListener = function(type, listener, options) {
            if (['blur', 'visibilitychange', 'webkitvisibilitychange', 'pagehide'].includes(type)) {
                console.log(`[挂机脚本] 拦截了网页对 ${type} 的监听`);
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // ==========================================
    // 核心策略 2: 视频元素监控 (速度/静音/防暂停)
    // ==========================================
    function hookVideoElement() {
        const processVideo = (video) => {
            if (video.getAttribute('data-hooked') === 'true') return;
            video.setAttribute('data-hooked', 'true');

            console.log('[挂机脚本] 捕获视频，正在注入增强逻辑...');

            // --- A. 强制设置参数 ---
            const applySettings = () => {
                // 1. 设置倍速
                if (video.playbackRate !== CONFIG.playbackRate) {
                    video.playbackRate = CONFIG.playbackRate;
                    console.log(`[挂机脚本] 速度已重置为 ${CONFIG.playbackRate}x`);
                }
                // 2. 设置静音
                if (CONFIG.mute && !video.muted) {
                    video.muted = true;
                    console.log('[挂机脚本] 视频已静音');
                }
            };

            // 初始应用
            applySettings();

            // --- B. 事件监听与锁定 ---

            // 1. 防暂停：监听 pause 事件，非结束状态下强制播放
            video.addEventListener('pause', function(e) {
                if (!video.ended && video.currentTime > 0) {
                    console.log('[挂机脚本] 检测到异常暂停，强制恢复...');
                    setTimeout(() => video.play().catch(() => {}), 100);
                }
            });

            // 2. 锁倍速：监听 ratechange，防止网站把速度改回去
            video.addEventListener('ratechange', function() {
                if (video.playbackRate !== CONFIG.playbackRate) {
                    video.playbackRate = CONFIG.playbackRate;
                }
            });

            // 3. 播放时再次确认设置 (双重保险)
            video.addEventListener('play', applySettings);

            // 4. 加载元数据时确认设置
            video.addEventListener('loadedmetadata', applySettings);

            // 5. 尝试自动播放
            video.play().catch(() => {});
        };

        // 监控 DOM 变化 (针对动态加载的 iframe 或 video)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') {
                        processVideo(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(processVideo);
                    }
                });
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
        document.querySelectorAll('video').forEach(processVideo);
    }

    // ==========================================
    // 执行
    // ==========================================
    mockVisibility();
    hookVideoElement();
    window.addEventListener('load', hookVideoElement);

})();
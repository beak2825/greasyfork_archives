// ==UserScript==
// @name         Sora2 - 禁止视频自动播放 (Hover to Play)
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  禁止Sora探索页面的视频自动缓存和播放。仅当鼠标悬停在视频上时才加载并播放，移开则停止。已修复SPA页面切换导致@exclude失效的问题。
// @author       Your Name
// @match        https://sora.chatgpt.com/*
// @exclude      https://sora.chatgpt.com/p/*
// @exclude      https://sora.chatgpt.com/d/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551544/Sora2%20-%20%E7%A6%81%E6%AD%A2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%28Hover%20to%20Play%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551544/Sora2%20-%20%E7%A6%81%E6%AD%A2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%28Hover%20to%20Play%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Sora Hover-to-Play 脚本 v1.3 已启动');

    // --- 新增：检查当前是否为详情页 ---
    // 这个函数会贯穿整个脚本，用于判断是否应该执行核心逻辑
function isDetailPage() {
    return window.location.pathname.startsWith('/p/') || window.location.pathname.startsWith('/d/');
}

    function processVideo(video) {
        // 在处理任何视频前，先检查页面路径
        if (isDetailPage()) {
            return; // 如果是详情页，则不执行任何操作
        }

        // 如果视频已经被处理过，就跳过
        if (video.dataset.hoverPlayReady) {
            return;
        }

        const container = video.closest('div.group');
        if (!container) {
            console.warn('未找到视频的悬停目标:', video);
            return;
        }

        container.classList.remove('animate-pulse', 'bg-secondary/20');

        if (video.src) {
            video.dataset.originalSrc = video.src;
            video.removeAttribute('src');
        }

        video.preload = 'none';
        video.muted = true;

        container.addEventListener('mouseenter', () => {
            // 悬停时再次检查，确保万无一失
            if (isDetailPage()) return;
            if (video.dataset.originalSrc && !video.getAttribute('src')) {
                video.src = video.dataset.originalSrc;
                video.play().catch(e => {
                    // 忽略浏览器可能报出的播放中断错误
                });
            }
        });

        container.addEventListener('mouseleave', () => {
            video.pause();
            video.removeAttribute('src');
            video.load();
        });

        video.dataset.hoverPlayReady = 'true';
    }

    function initAllVideos() {
        // 初始化时检查
        if (isDetailPage()) {
            return;
        }
        document.querySelectorAll('video[poster]').forEach(processVideo);
    }

    const observer = new MutationObserver((mutations) => {
        // --- 修改：在监听到DOM变化时，首先检查URL ---
        // 这是处理SPA导航的关键
        if (isDetailPage()) {
            return; // 如果是详情页，忽略所有DOM变化
        }

        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches('video[poster]')) {
                            processVideo(node);
                        }
                        node.querySelectorAll('video[poster]').forEach(processVideo);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后，先执行一次
    initAllVideos();

    // 保留 @exclude 规则也是有好处的，它可以防止在直接通过URL访问详情页时，脚本被注入。
    // 我们将 @match 范围扩大到 `https://sora.chatgpt.com/*`，这样脚本在网站的任何地方都会被注入，
    // 然后依靠内部的 isDetailPage() 函数来决定是否执行功能。
})();
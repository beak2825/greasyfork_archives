// ==UserScript==
// @name         抖音防闪烁 & 视频音量适配
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  去除抖音网页版点击/长按时的蓝色高亮闪烁；抖音/TikTok视频自动取消静音并最大音量
// @author       Lin
// @match        *://*.douyin.com/*
// @match        *://*.tiktok.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561688/%E6%8A%96%E9%9F%B3%E9%98%B2%E9%97%AA%E7%83%81%20%20%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/561688/%E6%8A%96%E9%9F%B3%E9%98%B2%E9%97%AA%E7%83%81%20%20%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 功能模块1：去除点击高亮闪烁
    // ==========================================
    
    // 创建 style 元素
    var style = document.createElement('style');
    
    // 设置 CSS 规则
    // -webkit-tap-highlight-color: transparent; 用于去除点击高亮
    // outline: none; 用于去除可能的轮廓线
    style.innerHTML = `
        * {
            -webkit-tap-highlight-color: transparent !important;
            outline: none !important;
        }
    `;
    
    // 将样式添加到页面头部，尝试支持 document-start
    var addStyle = function() {
        if (document.head) {
            document.head.appendChild(style);
        } else if (document.documentElement) {
            document.documentElement.appendChild(style);
        } else {
            requestAnimationFrame(addStyle);
        }
    };
    
    addStyle();

    // ==========================================
    // 功能模块2：视频自动取消静音 & 音量适配
    // ==========================================

    // 强力解除静音函数
    function forceUnmute(video) {
        if (video.muted) {
            video.muted = false;
        }
        if (video.volume < 1.0) {
            video.volume = 1.0;
        }
    }

    // 核心函数：处理视频元素
    function handleVideoElement(video) {
        if (!video) return;
        
        // 标记已处理，避免重复绑定事件
        if (video.dataset.muteHandled) return;
        video.dataset.muteHandled = 'true';

        // 1. 立即尝试解除
        forceUnmute(video);

        // 2. 绑定关键事件，持续强制解除（应对网站反复重置）
        const enforceEvents = ['loadstart', 'loadeddata', 'play', 'playing', 'timeupdate'];
        enforceEvents.forEach(eventType => {
            video.addEventListener(eventType, () => forceUnmute(video), { passive: true });
        });
    }

    // 查找页面所有视频元素并处理
    function findAndHandleVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => handleVideoElement(video));
    }

    // 全局交互解锁：用户第一次点击/触摸屏幕时，强制解除所有视频静音
    // 这是为了绕过浏览器的"无用户交互禁止自动播放有声视频"策略
    function unlockAudioContext() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => forceUnmute(video));
        // 注意：不移除监听器，因为抖音是单页应用，后续加载的视频也需要交互权限
    }
    document.addEventListener('click', unlockAudioContext, { capture: true, passive: true });
    document.addEventListener('touchstart', unlockAudioContext, { capture: true, passive: true });
    document.addEventListener('keydown', unlockAudioContext, { capture: true, passive: true });

    // 1. 首次加载尝试处理
    findAndHandleVideos();

    // 2. 监听DOM变化（处理动态加载的视频，如滑动切换视频）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 直接是 video 元素
                    if (node.tagName === 'VIDEO') {
                        handleVideoElement(node);
                    } 
                    // 包含 video 元素的容器
                    else if (node.nodeType === 1 && node.querySelector) { 
                        const innerVideos = node.querySelectorAll('video');
                        innerVideos.forEach(v => handleVideoElement(v));
                    }
                });
            }
        });
    });

    // 启动DOM监听
    // 确保在 document.body 或 documentElement 可用时启动
    var startObserver = function() {
        var targetNode = document.body || document.documentElement;
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        } else {
            requestAnimationFrame(startObserver);
        }
    };
    startObserver();

    // 3. 定时兜底（每2秒检查，防止漏检）
    setInterval(findAndHandleVideos, 2000);

    console.log('抖音防闪烁 & 视频适配脚本已加载');
})();

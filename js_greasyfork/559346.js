// ==UserScript==
// @name         抖音自动重定向+解除静音
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动跳转推荐页并尝试将音量设为最大
// @author       Gemini
// @match        https://www.douyin.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559346/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%2B%E8%A7%A3%E9%99%A4%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/559346/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%2B%E8%A7%A3%E9%99%A4%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 重定向逻辑 ---
    if (window.location.pathname === '/' && !window.location.search.includes('recommend=1')) {
        window.location.replace("https://www.douyin.com/?recommend=1");
        return; // 跳转后结束本次执行
    }

    // --- 2. 自动音量逻辑 ---
    // 等待 DOM 加载后开始查找视频元素
    const setMaxVolume = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.muted) {
                video.muted = false; // 解除静音
            }
            video.volume = 1.0; // 设置音量为 100%
        });
    };

    // 抖音是单页应用，视频会动态切换，所以用观察器持续监听
    const observer = new MutationObserver(() => {
        setMaxVolume();
    });

    // 开始监听
    window.addEventListener('load', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // 初始执行一次
        setMaxVolume();
    });

})();
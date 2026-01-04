// ==UserScript==
// @name         Bilibili 自动开启中文字幕 (支持视频切换)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在B站视频页面自动开启中文字幕，并支持在合集中切换视频时自动开启。
// @author       橙子
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553214/Bilibili%20%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95%20%28%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%88%87%E6%8D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553214/Bilibili%20%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95%20%28%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%88%87%E6%8D%A2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心逻辑：检查并开启字幕 ---
    const enableSubtitles = () => {
        // 设置一个最大尝试次数，防止脚本无限运行
        const maxAttempts = 20; // 20 * 500ms = 10秒
        let attempts = 0;

        // 清除可能存在的旧定时器
        if (window.bilibiliSubtitleIntervalId) {
            clearInterval(window.bilibiliSubtitleIntervalId);
        }

        const checkAndEnable = () => {
            attempts++;

            // 寻找“中文”字幕的选项
            const chineseSubtitleOption = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');

            if (chineseSubtitleOption) {
                // 检查它是否已经被激活
                if (!chineseSubtitleOption.classList.contains('bpx-state-active')) {
                    console.log('Bilibili 自动字幕: 发现未激活的中文字幕，正在为您开启...');
                    chineseSubtitleOption.click();
                } else {
                    console.log('Bilibili 自动字幕: 中文字幕已经开启。');
                }
                // 任务完成，清除定时器
                clearInterval(window.bilibiliSubtitleIntervalId);
            } else if (attempts >= maxAttempts) {
                // 如果尝试次数过多，就放弃
                console.log('Bilibili 自动字幕: 在10秒内未找到中文字幕选项，可能该视频没有字幕。');
                clearInterval(window.bilibiliSubtitleIntervalId);
            }
        };

        // 启动定时检查
        window.bilibiliSubtitleIntervalId = setInterval(checkAndEnable, 500);
    };

    // --- 监听URL变化的逻辑 ---
    const setupHistoryListener = () => {
        // 保存原始的 history.pushState 和 history.replaceState 方法
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 重写 pushState
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            // 在 pushState 执行后，触发我们的字幕开启逻辑
            setTimeout(enableSubtitles, 1000); // 延迟1秒执行，等待播放器加载
        };

        // 重写 replaceState
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            // 在 replaceState 执行后，触发我们的字幕开启逻辑
            setTimeout(enableSubtitles, 1000); // 延迟1秒执行，等待播放器加载
        };

        // 监听浏览器前进/后退按钮
        window.addEventListener('popstate', () => {
            setTimeout(enableSubtitles, 1000);
        });
    };

    // --- 主程序入口 ---
    // 1. 设置URL变化监听
    setupHistoryListener();

    // 2. 页面首次加载时，执行一次字幕开启逻辑
    // 延迟一点时间，确保播放器已经初始化
    setTimeout(enableSubtitles, 1500);

})();
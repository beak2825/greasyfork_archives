// ==UserScript==
// @name         全站单声道
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将全站视频自动混音为单声道，并支持白名单例外，优化淡入体验无割裂感，排除了哔哩哔哩直播
// @author       You
// @match        *://*/*
// @exclude      *://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548048/%E5%85%A8%E7%AB%99%E5%8D%95%E5%A3%B0%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/548048/%E5%85%A8%E7%AB%99%E5%8D%95%E5%A3%B0%E9%81%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = ['music.', 'twitch.tv', 'spotify'];

    function isWhitelisted() {
        return whitelist.some(site => window.location.hostname.includes(site));
    }

    if (isWhitelisted()) {
        console.log('[单声道脚本] 当前站点在白名单中，已跳过。');
        return;
    }

    let processedVideos = new WeakSet();

    function setupMono(video) {
        if (processedVideos.has(video)) return;
        processedVideos.add(video);

        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const source = context.createMediaElementSource(video);

            const splitter = context.createChannelSplitter(2);
            const merger = context.createChannelMerger(2);

            splitter.connect(merger, 0, 0);
            splitter.connect(merger, 0, 1);

            const gainNode = context.createGain();
            gainNode.gain.value = 1; // 默认直接 1

            source.connect(splitter);
            merger.connect(gainNode);
            gainNode.connect(context.destination);

            // 如果已经在播放 → 快速淡入 (0.05s)
            if (!video.paused) {
                gainNode.gain.setValueAtTime(0, context.currentTime);
                gainNode.gain.linearRampToValueAtTime(1, context.currentTime + 0.05);
            }

            console.log('[单声道脚本] 已应用单声道：', video);
        } catch (e) {
            console.warn('[单声道脚本] 处理视频失败：', e);
        }
    }

    // 使用 MutationObserver 动态监听 video
    const observer = new MutationObserver(() => {
        document.querySelectorAll('video').forEach(video => {
            if (!processedVideos.has(video)) {
                video.addEventListener('loadedmetadata', () => setupMono(video), { once: true });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始检查
    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('loadedmetadata', () => setupMono(video), { once: true });
    });

})();

// ==UserScript==
// @name         B站哔哩鼠标双击改为网页全屏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在B站视频播放区域双击时
// @author       YourName
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547812/B%E7%AB%99%E5%93%94%E5%93%A9%E9%BC%A0%E6%A0%87%E5%8F%8C%E5%87%BB%E6%94%B9%E4%B8%BA%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/547812/B%E7%AB%99%E5%93%94%E5%93%A9%E9%BC%A0%E6%A0%87%E5%8F%8C%E5%87%BB%E6%94%B9%E4%B8%BA%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 防止重复执行的标志
    let isHandlingDoubleClick = false;

    // 主要函数：尝试查找并点击网页全屏按钮
    function triggerWebFullscreen() {
        // 常见的B站网页全屏按钮选择器
        const webFullscreenSelectors = [
            '.bpx-player-ctrl-web',
            '.bilibili-player-web-fullscreen',
            '[data-name="webFullscreen"]',
            '.web-fullscreen-btn'
        ];

        let webFullscreenButton = null;

        for (const selector of webFullscreenSelectors) {
            webFullscreenButton = document.querySelector(selector);
            if (webFullscreenButton) break;
        }

        if (webFullscreenButton) {
            // 先获取当前视频元素和播放状态
            const video = document.querySelector('video');
            const wasPlaying = video && !video.paused;
            const currentTime = video ? video.currentTime : 0;

            // 执行网页全屏操作
            webFullscreenButton.click();
            console.log('已触发网页全屏');

            // 重点：恢复视频播放状态
            if (video && wasPlaying) {
                // 短暂延迟后恢复播放
                setTimeout(() => {
                    if (video.paused) {
                        video.play().catch(e => console.log('自动播放受阻，可能需要用户交互'));
                        // 恢复之前的播放时间（防止跳转）
                        if (video.currentTime !== currentTime) {
                            video.currentTime = currentTime;
                        }
                    }
                }, 100);
            }
            return true;
        } else {
            console.warn('未找到网页全屏按钮');
            return false;
        }
    }

    // 设置双击事件监听器
    function setupDoubleClickListener(playerContainer) {
        playerContainer.removeEventListener('dblclick', handleDoubleClick);
        playerContainer.addEventListener('dblclick', handleDoubleClick);
        console.log('B站双击网页全屏脚本已生效');
    }

    // 处理双击事件
    function handleDoubleClick(event) {
        // 防止重复处理
        if (isHandlingDoubleClick) return;
        isHandlingDoubleClick = true;

        // 阻止事件冒泡和默认行为
        event.stopPropagation();
        event.preventDefault();

        // 尝试触发网页全屏
        triggerWebFullscreen();

        // 重置处理标志
        setTimeout(() => { isHandlingDoubleClick = false; }, 300);
    }

    // 等待播放器加载
    function waitForPlayer() {
        const maxAttempts = 15;
        let attempts = 0;

        const interval = setInterval(() => {
            const playerContainer = document.querySelector('.bpx-player-video-wrap') || document.querySelector('.bilibili-player-video');
            if (playerContainer) {
                clearInterval(interval);
                setupDoubleClickListener(playerContainer);
                // 额外监听视频状态变化
                monitorVideoStatus();
            } else if (attempts > maxAttempts) {
                clearInterval(interval);
                console.warn('未能找到B站播放器容器');
            }
            attempts++;
        }, 500);
    }

    // 监控视频状态变化
    function monitorVideoStatus() {
        const video = document.querySelector('video');
        if (!video) return;

        // 监听暂停事件，但不干预用户手动暂停
        const originalPause = video.pause;
        video.pause = function() {
            // 只有在不是我们处理双击期间才允许正常暂停
            if (!isHandlingDoubleClick) {
                originalPause.call(this);
            }
        };
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        const playerContainer = document.querySelector('.bpx-player-video-wrap') || document.querySelector('.bilibili-player-video');
        if (playerContainer) {
            setupDoubleClickListener(playerContainer);
            monitorVideoStatus();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForPlayer);
    } else {
        waitForPlayer();
    }
})();
// ==UserScript==
// @name         鸽子宝宝自动学习
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动找到视频播放按钮并触发播放，处理自动播放限制
// @author       x2in
// @match        *://ols.v.zzu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548313/%E9%B8%BD%E5%AD%90%E5%AE%9D%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/548313/%E9%B8%BD%E5%AD%90%E5%AE%9D%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 - 新增播放速度设置
    const config = {
        // 课程项选择器
        dirItemSelector: '.dir-item',
        // 状态元素选择器
        statusSelector: '.item-status',
        // 完成状态文本
        completedText: '已完成',
        // 视频播放相关选择器
        playButtonSelectors: [
            '.prism-big-play-btn',
            '.prism-play-btn',
            '#J_prismPlayer_component_A506AD5A-D221-4218-B5E1-9E3BE9AEFBB7'
        ],
        videoSelector: '.prism-player video',
        // 倍速控制相关选择器
        speedSelector: '.prism-speed-selector',      // 倍速选择器容器
        speedOptionSelector: '.prism-speed-selector .selector-list li', // 倍速选项
        // 播放速度设置
        targetPlaybackRate: 2,                       // 默认2倍速
        // 重试与检查间隔配置
        maxRetries: 20,
        checkInterval: 1000,
        statusCheckInterval: 5000,
        speedCheckInterval: 3000,                    // 倍速检查间隔
        allowUnmuteAfterInteraction: true
    };

    // 全局状态变量
    let currentItemIndex = 0;
    let dirItems = [];
    let videoElement = null;
    let isPlaying = false;
    let userInteracted = false;
    let statusCheckTimer = null;
    let speedCheckTimer = null;

    // 初始化
    function init() {
        console.log('自动课程学习脚本初始化');
        handleUserInteraction();
        processDirItems();
    }

    // 获取并处理所有课程项
    function processDirItems() {
        dirItems = Array.from(document.querySelectorAll(config.dirItemSelector));
        if (dirItems.length === 0) {
            console.log('未找到课程项('.concat(config.dirItemSelector,')，将在',config.checkInterval,'ms后重试'));
            setTimeout(processDirItems, config.checkInterval);
            return;
        }

        console.log('找到'.concat(dirItems.length,'个课程项，开始处理'));
        processCurrentDirItem();
    }

    // 处理当前课程项
    function processCurrentDirItem() {
        // 清除之前的定时器
        if (speedCheckTimer) {
            clearInterval(speedCheckTimer);
        }

        // 检查是否所有课程都已完成
        if (currentItemIndex >= dirItems.length) {
            checkAllCompleted();
            return;
        }

        const currentItem = dirItems[currentItemIndex];
        console.log('正在处理第'.concat(currentItemIndex + 1,'个课程项'));

        // 查找状态元素
        const statusElement = currentItem.querySelector(config.statusSelector);
        if (!statusElement) {
            console.log('未找到状态元素，跳过当前项');
            currentItemIndex++;
            setTimeout(processCurrentDirItem, config.checkInterval);
            return;
        }

        const statusText = statusElement.textContent.trim();
        console.log('当前课程状态: '.concat(statusText));

        // 检查是否已完成
        if (statusText === config.completedText) {
            console.log('当前课程已完成，处理下一个');
            currentItemIndex++;
            setTimeout(processCurrentDirItem, config.checkInterval);
        } else {
            console.log('当前课程未完成，准备学习');
            // 点击当前课程项
            clickElement(currentItem);
            // 等待课程加载
            setTimeout(startVideoPlayback, 2000);
        }
    }

    // 开始视频播放
    function startVideoPlayback() {
        // 清除之前的状态检查定时器
        if (statusCheckTimer) {
            clearInterval(statusCheckTimer);
        }

        // 尝试播放视频
        const playInterval = setInterval(async () => {
            const success = await tryPlayVideo();
            if (success) {
                clearInterval(playInterval);
                console.log('视频开始播放，开始监控状态和设置倍速');
                // 设置2倍速
                setPlaybackSpeed();
                // 定期检查倍速是否保持
                startSpeedMonitoring();
                // 开始监控课程状态
                startStatusMonitoring();
            }
        }, config.checkInterval);
    }

    // 设置播放速度为2倍速
    function setPlaybackSpeed() {
        // 方法1: 直接设置video元素的playbackRate（最直接有效）
        if (videoElement) {
            videoElement.playbackRate = config.targetPlaybackRate;
            console.log('已直接设置视频播放速度为'.concat(config.targetPlaybackRate,'倍'));
        }

        // 方法2: 尝试通过页面的倍速控制UI设置（作为备份）
        setTimeout(() => {
            try {
                // 先点击倍速按钮打开选项列表
                const speedButton = document.querySelector(config.speedSelector);
                if (speedButton) {
                    speedButton.click();
                    console.log('已点击倍速按钮');

                    // 查找并点击2倍速选项
                    setTimeout(() => {
                        const speedOptions = document.querySelectorAll(config.speedOptionSelector);
                        let targetOption = null;

                        // 查找包含"2x"或"2.0x"或"2倍"的选项
                        speedOptions.forEach(option => {
                            const text = option.textContent.trim().toLowerCase();
                            if (text.includes('2x') || text.includes('2.0x') || text.includes('2倍')) {
                                targetOption = option;
                            }
                        });

                        if (targetOption) {
                            targetOption.click();
                            console.log('已通过UI设置2倍速');
                            // 关闭倍速选择面板
                            if (speedButton) speedButton.click();
                        } else {
                            console.log('未找到2倍速选项，将继续使用直接设置方式');
                            if (speedButton) speedButton.click(); // 关闭面板
                        }
                    }, 500);
                }
            } catch (err) {
                console.log('通过UI设置倍速失败，将继续使用直接设置方式:', err);
            }
        }, 1000);
    }

    // 监控播放速度，确保保持2倍速
    function startSpeedMonitoring() {
        speedCheckTimer = setInterval(() => {
            if (videoElement && Math.abs(videoElement.playbackRate - config.targetPlaybackRate) > 0.1) {
                console.log('检测到播放速度变化，重新设置为2倍速');
                videoElement.playbackRate = config.targetPlaybackRate;
            }
        }, config.speedCheckInterval);
    }

    // 监控课程状态，判断是否完成
    function startStatusMonitoring() {
        statusCheckTimer = setInterval(() => {
            if (currentItemIndex >= dirItems.length) {
                clearInterval(statusCheckTimer);
                return;
            }

            const currentItem = dirItems[currentItemIndex];
            const statusElement = currentItem.querySelector(config.statusSelector);

            if (statusElement && statusElement.textContent.trim() === config.completedText) {
                console.log('当前课程已完成');
                clearInterval(statusCheckTimer);
                // 停止当前视频
                stopVideo();
                // 处理下一个课程
                currentItemIndex++;
                setTimeout(processCurrentDirItem, 2000);
            } else if (videoElement && videoElement.ended) {
                console.log('视频播放结束，等待状态更新');
            }
        }, config.statusCheckInterval);
    }

    // 检查是否所有课程都已完成
    function checkAllCompleted() {
        const allCompleted = dirItems.every(item => {
            const statusElement = item.querySelector(config.statusSelector);
            return statusElement && statusElement.textContent.trim() === config.completedText;
        });

        if (allCompleted) {
            console.log('所有课程已学习完成！');
            showCompletionMessage();
        } else {
            console.log('检测到有课程未完成，重新开始处理');
            currentItemIndex = 0;
            setTimeout(processDirItems, config.checkInterval);
        }
    }

    // 显示学习完成提示
    function showCompletionMessage() {
        // 创建提示元素
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.padding = '20px 40px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.fontSize = '24px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '999999';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.textContent = '所有课程学习完成！';

        document.body.appendChild(notification);

        // 5秒后自动移除提示
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // 尝试播放视频
    async function tryPlayVideo() {
        // 先尝试直接播放视频元素
        if (await playVideoElement()) {
            return true;
        }

        // 再尝试点击播放按钮
        if (clickPlayButtons()) {
            setTimeout(playVideoElement, 500);
            return true;
        }

        return false;
    }

    // 直接播放视频元素
    async function playVideoElement() {
        videoElement = document.querySelector(config.videoSelector);
        if (!videoElement) return false;

        try {
            // 检查是否已经在播放
            if (!videoElement.paused) {
                isPlaying = true;
                return true;
            }

            // 强制保持静音，直到用户交互
            if (!videoElement.muted) {
                videoElement.muted = true;
                console.log('已强制静音以符合浏览器自动播放政策');
            }

            // 尝试播放
            const promise = videoElement.play();
            if (promise !== undefined) {
                await promise;
                console.log('视频已静音播放');
                isPlaying = true;
                return true;
            }
        } catch (err) {
            console.log('播放尝试失败:', err.message);
            return false;
        }
    }

    // 点击播放按钮
    function clickPlayButtons() {
        for (const selector of config.playButtonSelectors) {
            const button = document.querySelector(selector);
            if (button) {
                console.log('找到播放按钮并点击: '.concat(selector));
                return simulateClick(button);
            }
        }
        return false;
    }

    // 停止视频播放
    function stopVideo() {
        if (videoElement && !videoElement.paused) {
            videoElement.pause();
            isPlaying = false;
            console.log('已停止当前视频播放');
        }
    }

    // 模拟点击元素
    function simulateClick(element) {
        if (!element) return false;
        try {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            element.dispatchEvent(clickEvent);
            console.log('已模拟点击元素');
            return true;
        } catch (err) {
            console.error('模拟点击失败:', err);
            return false;
        }
    }

    // 点击元素（直接点击）
    function clickElement(element) {
        if (element.click) {
            try {
                element.click();
                console.log('已点击元素');
                return true;
            } catch (err) {
                console.error('点击元素失败:', err);
                return simulateClick(element);
            }
        }
        return simulateClick(element);
    }

    // 监听用户交互
    function handleUserInteraction() {
        const markAsInteracted = () => {
            if (!userInteracted) {
                userInteracted = true;
                console.log('检测到用户交互');
            }
        };

        // 监听所有可能的用户交互
        window.addEventListener('click', markAsInteracted);
        window.addEventListener('keydown', markAsInteracted);
        window.addEventListener('touchstart', markAsInteracted);
    }

    // 监控页面动态变化
    const observer = new MutationObserver((mutations) => {
        if (dirItems.length === 0) {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches(config.dirItemSelector)) {
                        console.log('检测到新的课程项，重新处理');
                        processDirItems();
                    }
                });
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

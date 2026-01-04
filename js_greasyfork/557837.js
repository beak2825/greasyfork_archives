// ==UserScript==
// @name         视频时间计算器
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在所有视频右上角显示加速后的时间信息
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557837/%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557837/%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        fontSize: '10px',  // 减小字体大小
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textColor: 'white',
        borderRadius: '3px',  // 减小圆角
        padding: '3px 6px',  // 减小内边距
        zIndex: 9999,
        position: 'absolute',
        top: '8px',  // 调整位置
        right: '40px',  // 向左移动（原来是8px，现在是40px）
        left: 'auto'  // 确保left为auto
    };

    // 创建时间显示元素
    function createTimeDisplay() {
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'video-time-display';
        timeDisplay.style.cssText = `
            font-size: ${CONFIG.fontSize};
            font-family: ${CONFIG.fontFamily};
            background-color: ${CONFIG.backgroundColor};
            color: ${CONFIG.textColor};
            border-radius: ${CONFIG.borderRadius};
            padding: ${CONFIG.padding};
            z-index: ${CONFIG.zIndex};
            position: ${CONFIG.position};
            top: ${CONFIG.top};
            right: ${CONFIG.right};
            left: ${CONFIG.left};
            pointer-events: none;
            font-family: Roboto, Arial, sans-serif;
            display: flex;
            gap: 5px;  // 减小间距
            align-items: center;
        `;
        return timeDisplay;
    }

    // 格式化时间为 MM:SS 格式
    function formatTime(seconds) {
        // 检查是否为无效时间
        if (isNaN(seconds) || seconds === Infinity || seconds === -Infinity) {
            return '00:00';
        }
        
        const mins = Math.floor(Math.abs(seconds) / 60);
        const secs = Math.floor(Math.abs(seconds) % 60);
        const sign = seconds < 0 ? '-' : '';
        return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 检查是否为直播视频
    function isLiveVideo(video) {
        // 检查视频是否为直播
        // 直播视频通常duration为Infinity
        if (video.duration === Infinity) {
            return true;
        }
        
        // 检查是否有其他直播标识
        if (video.duration && video.duration > 1000000) { // 很大的duration值通常是直播
            return true;
        }
        
        return false;
    }

    // 获取页面中的视频元素（特别针对YouTube优化）
    function getVideoElement() {
        // YouTube特定选择器
        const youtubeSelectors = [
            '#movie_player video',
            '.html5-video-container video',
            '.ytp-large-play-button video',
            'video'
        ];
        
        for (const selector of youtubeSelectors) {
            const videos = document.querySelectorAll(selector);
            for (const video of videos) {
                if (video && 
                    video.readyState > 0 && 
                    (video.clientHeight > 0 || video.clientWidth > 0)) {
                    return video;
                }
            }
        }
        
        // 通用选择器
        const videos = Array.from(document.querySelectorAll('video'));
        
        // 优先选择正在播放且可见的视频
        for (let video of videos) {
            if (video.offsetParent !== null && 
                video.readyState > 0 && 
                video.clientHeight > 0 && 
                video.clientWidth > 0 &&
                !video.paused) {
                return video;
            }
        }
        
        // 如果没有正在播放的视频，选择第一个可见的视频
        for (let video of videos) {
            if (video.offsetParent !== null && 
                video.readyState > 0 && 
                video.clientHeight > 0 && 
                video.clientWidth > 0) {
                return video;
            }
        }
        
        // 如果没有可见的视频，选择第一个加载的视频
        for (let video of videos) {
            if (video.readyState > 0) {
                return video;
            }
        }
        
        return videos[0] || null;
    }

    // 获取视频容器（特别针对YouTube优化）
    function getVideoContainer(video) {
        // 针对YouTube的特殊处理
        if (window.location.hostname.includes('youtube.com')) {
            const youtubePlayer = video.closest('#movie_player');
            if (youtubePlayer) {
                if (getComputedStyle(youtubePlayer).position === 'static') {
                    youtubePlayer.style.position = 'relative';
                }
                return youtubePlayer;
            }
            
            const html5VideoContainer = video.closest('.html5-video-container');
            if (html5VideoContainer) {
                if (getComputedStyle(html5VideoContainer).position === 'static') {
                    html5VideoContainer.style.position = 'relative';
                }
                return html5VideoContainer;
            }
        }
        
        // 通用处理
        const parent = video.parentElement;
        if (parent && getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        return parent || document.body;
    }

    // 更新时间显示
    function updateTimeDisplay() {
        const video = getVideoElement();
        if (!video || video.readyState === 0) {
            // 如果没有找到视频，移除时间显示元素
            const timeDisplay = document.getElementById('video-time-display');
            if (timeDisplay) {
                timeDisplay.remove();
            }
            return;
        }

        // 检查是否为直播视频，如果是则不显示任何内容
        if (isLiveVideo(video)) {
            const timeDisplay = document.getElementById('video-time-display');
            if (timeDisplay) {
                timeDisplay.remove();
            }
            return;
        }

        let timeDisplay = document.getElementById('video-time-display');
        
        // 检查时间显示元素是否在正确的容器中
        const videoContainer = getVideoContainer(video);
        const currentContainer = timeDisplay ? timeDisplay.parentElement : null;
        
        if (!timeDisplay || currentContainer !== videoContainer) {
            if (timeDisplay) {
                timeDisplay.remove();
            }
            
            timeDisplay = createTimeDisplay();
            videoContainer.appendChild(timeDisplay);
        }

        // 获取播放速度
        const playbackRate = video.playbackRate;
        
        // 计算加速后的时间
        const originalDuration = video.duration;
        const originalCurrentTime = video.currentTime;
        
        // 检查数值是否有效
        if (isNaN(originalDuration) || isNaN(originalCurrentTime) || 
            originalDuration <= 0 || playbackRate <= 0) {
            timeDisplay.innerHTML = `
                <span style="font-size: ${CONFIG.fontSize};">加载中...</span>
            `;
            return;
        }
        
        // 加速后的时间计算
        const adjustedDuration = originalDuration / playbackRate;
        const adjustedCurrentTime = originalCurrentTime / playbackRate;
        const adjustedRemainingTime = adjustedDuration - adjustedCurrentTime;

        // 格式化时间
        const formattedTotalTime = formatTime(adjustedDuration);
        const formattedRemainingTime = formatTime(adjustedRemainingTime);
        const formattedCurrentTime = formatTime(adjustedCurrentTime);

        // 更新显示内容（剩余时间在前）
        timeDisplay.innerHTML = `
            <span style="font-size: ${CONFIG.fontSize};">剩: ${formattedRemainingTime}</span>
            <span style="font-size: ${CONFIG.fontSize};">总: ${formattedTotalTime}</span>
        `;
    }

    // 监听播放速度变化
    function watchPlaybackRate(video) {
        video.addEventListener('ratechange', updateTimeDisplay);
        
        // 使用属性观察器监听播放速度变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'playbackrate' || 
                     mutation.attributeName === 'defaultplaybackrate')) {
                    updateTimeDisplay();
                }
            });
        });

        observer.observe(video, { attributes: true });
    }

    // 初始化函数
    function initialize() {
        const video = getVideoElement();
        if (!video) return;

        // 监听播放速度变化
        watchPlaybackRate(video);

        // 每200ms更新一次时间显示（减少性能影响）
        setInterval(updateTimeDisplay, 200);

        // 初始更新
        updateTimeDisplay();
    }

    // 页面加载完成后执行
    function initWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            // 对于YouTube，可能需要等待视频加载
            const video = getVideoElement();
            if (video && video.readyState > 0) {
                initialize();
            } else {
                // 如果视频还没加载，稍后重试
                setTimeout(initWhenReady, 1000);
            }
        }
    }

    // 监听动态添加的视频元素
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'VIDEO' || 
                            (node.querySelector && node.querySelector('video'))) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (shouldUpdate) {
            setTimeout(initialize, 500); // 延迟执行以确保视频已加载
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 启动初始化
    initWhenReady();
})();
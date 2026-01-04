// ==UserScript==
// @name         视频控制栏自动隐藏
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  鼠标静止0.1秒后自动隐藏视频控制栏，视频播放时自动隐藏，支持控制栏悬停保持显示
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557835/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E6%A0%8F%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/557835/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E6%A0%8F%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const HIDE_DELAY = 100; // 0.1秒延迟
    const VIDEO_SELECTORS = [
        'video',
        '.video-player',
        '.player',
        '.video-container',
        '.mejs-container',
        '.jw-video',
        '.plyr__video-wrapper',
        'iframe[src*="youtube.com"]',
        'iframe[src*="vimeo.com"]',
        '.dplayer'
    ];

    let hideTimer = null;
    let currentVideo = null;
    let controls = null;
    let isMouseOverVideo = false;
    let isMouseOverControls = false; // 新增：鼠标是否在控制栏上
    let lastMouseTime = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseMoveThreshold = 5; // 鼠标移动阈值
    let isVideoPlaying = false; // 视频播放状态

    // 获取当前时间戳
    function getCurrentTime() {
        return new Date().getTime();
    }

    // 查找视频元素
    function findVideoElement() {
        // 首先查找DPlayer容器
        let dplayerElements = document.querySelectorAll('.dplayer');
        for (let element of dplayerElements) {
            let video = element.querySelector('video');
            if (video) {
                return element; // 返回DPlayer容器
            }
        }
        
        // 如果没有找到DPlayer，按常规方式查找
        for (let selector of VIDEO_SELECTORS) {
            if (selector === '.dplayer') continue; // 已经处理过DPlayer
            let elements = document.querySelectorAll(selector);
            for (let element of elements) {
                if (element.tagName === 'VIDEO' || 
                    element.querySelector('video')) {
                    return element;
                }
            }
        }
        return null;
    }

    // 查找控制栏元素 - 增强DPlayer支持
    function findControls(video) {
        // 常见的视频控制栏选择器
        const controlSelectors = [
            // DPlayer特有选择器
            '.dplayer-controller',
            '.dplayer-controller-mask',
            '.dplayer-controller-wrap',
            '.dplayer-controller-bottom',
            '.dplayer-controller-bottom-left',
            '.dplayer-controller-bottom-right',
            '.dplayer-controller-setting',
            '.dplayer-controller-time',
            '.dplayer-controller-play',
            '.dplayer-controller-danmaku',
            '.dplayer-controller-volume',
            '.dplayer-controller-full',
            // 主要控制栏
            '.controls',
            '.control-bar',
            '.video-controls',
            '.mejs-controls',
            '.jw-controlbar',
            '.plyr__controls',
            '.ytp-chrome-bottom',
            '.vjs-control-bar',
            // 特定播放器控制栏
            '.aplayer-controller',
            '.video-js .vjs-control-bar',
            '.hls-video-controls',
            '.video-player-controls',
            '.player-controls',
            '.control-container',
            // 底部控制栏
            '.video-bottom-controls',
            '.video-progress-bar',
            '.video-time',
            '.video-play-pause',
            '.video-volume',
            '.video-fullscreen',
            '.video-settings',
            '.video-subtitle',
            '.video-quality',
            '.video-speed',
            '.video-progress',
            '.video-duration',
            '.video-current-time',
            '.video-progress-loaded',
            '.video-progress-played',
            '.video-progress-bar-wrap',
            // 通用控制类名
            '[class*="control"]',
            '[id*="control"]',
            // 通用底部控制
            '.bottom-controls',
            '.progress-controls',
            '.time-controls',
            '.playback-controls'
        ];

        // 如果是DPlayer容器
        if (video.classList.contains('dplayer')) {
            // 优先查找DPlayer的控制栏
            let dplayerControls = video.querySelector('.dplayer-controller');
            if (dplayerControls) {
                return dplayerControls;
            }
        }

        // 首先在视频元素内部查找
        for (let selector of controlSelectors) {
            let controlElements = video.querySelectorAll(selector);
            for (let element of controlElements) {
                return element; // 返回第一个匹配的元素
            }
        }

        // 尝试通过父元素查找
        let parent = video.parentElement;
        while (parent && parent !== document.body) {
            for (let selector of controlSelectors) {
                let control = parent.querySelector(selector);
                if (control && control !== video) {
                    return control;
                }
            }
            parent = parent.parentElement;
        }

        return null;
    }

    // 显示控制栏
    function showControls() {
        if (controls && controls.style) {
            controls.style.opacity = '1';
            controls.style.visibility = 'visible';
            controls.style.transition = 'opacity 0.1s ease, visibility 0.1s';
        }
    }

    // 隐藏控制栏
    function hideControls() {
        if (controls && controls.style) {
            controls.style.opacity = '0';
            controls.style.visibility = 'hidden';
            controls.style.transition = 'opacity 0.1s ease, visibility 0.1s';
        }
    }

    // 检查鼠标是否移动
    function hasMouseMoved(event) {
        const deltaX = Math.abs(event.clientX - lastMouseX);
        const deltaY = Math.abs(event.clientY - lastMouseY);
        const moved = deltaX > mouseMoveThreshold || deltaY > mouseMoveThreshold;
        
        if (moved) {
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            lastMouseTime = getCurrentTime();
        }
        
        return moved;
    }

    // 检查鼠标是否静止
    function checkMouseIdle() {
        const now = getCurrentTime();
        const timeSinceLastMove = now - lastMouseTime;
        
        if (timeSinceLastMove >= HIDE_DELAY && isMouseOverVideo && !isMouseOverControls) {
            hideControls();
        } else if (isMouseOverVideo && !isMouseOverControls) {
            // 如果鼠标还在视频区域内且未达到隐藏时间，继续检查
            setTimeout(checkMouseIdle, Math.max(10, HIDE_DELAY - timeSinceLastMove));
        }
    }

    // 重置状态
    function resetState() {
        lastMouseTime = getCurrentTime();
        showControls();
        
        if (isMouseOverVideo && !isMouseOverControls) {
            // 继续检查鼠标是否静止
            setTimeout(checkMouseIdle, HIDE_DELAY);
        }
    }

    // 检查视频播放状态
    function checkVideoPlayState() {
        // 对于DPlayer，需要特殊处理
        if (currentVideo && currentVideo.classList.contains('dplayer')) {
            let video = currentVideo.querySelector('video');
            if (video) {
                isVideoPlaying = !video.paused;
            }
        } else {
            isVideoPlaying = currentVideo && !currentVideo.paused;
        }
        
        // 如果视频在播放且鼠标不在视频区域，则隐藏控制栏
        if (isVideoPlaying && !isMouseOverVideo && !isMouseOverControls) {
            hideControls();
        } else if (!isVideoPlaying) {
            showControls(); // 如果视频暂停，显示控制栏
        }
    }

    // 鼠标进入视频区域
    function handleMouseEnter(e) {
        isMouseOverVideo = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMouseTime = getCurrentTime();
        showControls();
        
        // 开始检查鼠标是否静止
        setTimeout(checkMouseIdle, HIDE_DELAY);
    }

    // 鼠标离开视频区域
    function handleMouseLeave() {
        isMouseOverVideo = false;
        if (hideTimer) {
            clearTimeout(hideTimer);
        }
        
        // 如果视频正在播放，鼠标离开后隐藏控制栏
        if (isVideoPlaying && !isMouseOverControls) {
            hideControls();
        } else {
            showControls(); // 如果视频暂停，保持显示控制栏
        }
    }

    // 鼠标移动事件
    function handleMouseMove(e) {
        if (!hasMouseMoved(e)) {
            return; // 如果鼠标没有实际移动，不触发重置
        }
        
        resetState();
    }

    // 鼠标点击事件
    function handleMouseClick() {
        resetState();
    }

    // 视频播放事件
    function handleVideoPlay() {
        checkVideoPlayState(); // 更新播放状态
        
        // 视频开始播放时，如果鼠标不在视频区域则隐藏控制栏
        if (!isMouseOverVideo && !isMouseOverControls) {
            setTimeout(() => {
                if (isVideoPlaying && !isMouseOverVideo && !isMouseOverControls) {
                    hideControls();
                }
            }, 500); // 延迟一点时间，让用户可以看到播放按钮生效
        }
    }

    // 视频暂停事件
    function handleVideoPause() {
        checkVideoPlayState(); // 更新播放状态
        // 视频暂停时显示控制栏
        showControls();
    }

    // 视频时间更新事件（用于检测播放状态变化）
    function handleTimeUpdate() {
        checkVideoPlayState();
    }

    // 鼠标进入控制栏（新增）
    function handleControlsMouseEnter() {
        isMouseOverControls = true;
        showControls(); // 确保控制栏显示
        
        // 清除任何可能的隐藏定时器
        if (hideTimer) {
            clearTimeout(hideTimer);
        }
    }

    // 鼠标离开控制栏（新增）
    function handleControlsMouseLeave() {
        isMouseOverControls = false;
        
        // 如果鼠标同时不在视频区域，则隐藏控制栏
        if (!isMouseOverVideo) {
            if (isVideoPlaying) {
                hideControls();
            } else {
                showControls(); // 视频暂停时保持显示
            }
        } else {
            // 如果鼠标在视频区域但不在控制栏上，重新开始计时
            resetState();
        }
    }

    // 监听视频元素
    function watchVideo(video) {
        if (!video) return;

        // 查找控制栏
        controls = findControls(video);
        if (!controls) {
            console.log('未找到视频控制栏');
            return;
        }

        // 设置初始样式
        controls.style.transition = 'opacity 0.1s ease, visibility 0.1s';
        showControls(); // 初始显示控制栏

        // 记录初始鼠标位置
        lastMouseTime = getCurrentTime();
        
        // 检查播放状态
        if (video.classList.contains('dplayer')) {
            let actualVideo = video.querySelector('video');
            isVideoPlaying = actualVideo ? !actualVideo.paused : false;
        } else {
            isVideoPlaying = !video.paused;
        }

        // 添加事件监听器
        video.addEventListener('mouseenter', handleMouseEnter);
        video.addEventListener('mouseleave', handleMouseLeave);
        video.addEventListener('mousemove', handleMouseMove);
        video.addEventListener('click', handleMouseClick);
        
        // 对于DPlayer，需要监听内部的video元素
        if (video.classList.contains('dplayer')) {
            let actualVideo = video.querySelector('video');
            if (actualVideo) {
                actualVideo.addEventListener('play', handleVideoPlay);
                actualVideo.addEventListener('pause', handleVideoPause);
                actualVideo.addEventListener('timeupdate', handleTimeUpdate);
            }
        } else {
            video.addEventListener('play', handleVideoPlay);
            video.addEventListener('pause', handleVideoPause);
            video.addEventListener('timeupdate', handleTimeUpdate);
        }

        // 为控制栏添加事件监听器（新增）
        controls.addEventListener('mouseenter', handleControlsMouseEnter);
        controls.addEventListener('mouseleave', handleControlsMouseLeave);

        // 如果视频在容器内，也要监听容器
        if (video.parentElement && video.parentElement !== document.body) {
            video.parentElement.addEventListener('mouseenter', handleMouseEnter);
            video.parentElement.addEventListener('mouseleave', handleMouseLeave);
            video.parentElement.addEventListener('mousemove', handleMouseMove);
            video.parentElement.addEventListener('click', handleMouseClick);
        }

        currentVideo = video;
        console.log('已开始监控视频:', video);
        
        // 检查当前播放状态
        checkVideoPlayState();
    }

    // 检查并监控视频
    function checkAndWatchVideo() {
        let video = findVideoElement();
        
        if (video && video !== currentVideo) {
            // 移除旧的监听器
            if (currentVideo) {
                currentVideo.removeEventListener('mouseenter', handleMouseEnter);
                currentVideo.removeEventListener('mouseleave', handleMouseLeave);
                currentVideo.removeEventListener('mousemove', handleMouseMove);
                currentVideo.removeEventListener('click', handleMouseClick);
                
                // 移除视频事件监听器
                if (currentVideo.classList.contains('dplayer')) {
                    let actualVideo = currentVideo.querySelector('video');
                    if (actualVideo) {
                        actualVideo.removeEventListener('play', handleVideoPlay);
                        actualVideo.removeEventListener('pause', handleVideoPause);
                        actualVideo.removeEventListener('timeupdate', handleTimeUpdate);
                    }
                } else {
                    currentVideo.removeEventListener('play', handleVideoPlay);
                    currentVideo.removeEventListener('pause', handleVideoPause);
                    currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
                }
                
                if (controls) {
                    controls.removeEventListener('mouseenter', handleControlsMouseEnter);
                    controls.removeEventListener('mouseleave', handleControlsMouseLeave);
                }
                
                if (currentVideo.parentElement) {
                    currentVideo.parentElement.removeEventListener('mouseenter', handleMouseEnter);
                    currentVideo.parentElement.removeEventListener('mouseleave', handleMouseLeave);
                    currentVideo.parentElement.removeEventListener('mousemove', handleMouseMove);
                    currentVideo.parentElement.removeEventListener('click', handleMouseClick);
                }
            }
            
            watchVideo(video);
        } else if (video && video === currentVideo) {
            // 如果是同一个视频，检查播放状态
            checkVideoPlayState();
        }
    }

    // 页面加载完成后立即检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndWatchVideo);
    } else {
        checkAndWatchVideo();
    }

    // 页面完全加载后再次检查
    window.addEventListener('load', checkAndWatchVideo);

    // 定期检查页面中的视频元素
    setInterval(checkAndWatchVideo, 1000);

    console.log('增强版视频控制栏自动隐藏脚本已加载（DPlayer兼容版）');
})();
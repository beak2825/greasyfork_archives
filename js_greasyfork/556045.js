// ==UserScript==
// @name         视频倒计时提醒工具  
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT
// @description  显示视频时长并设置倒计时提醒，支持自定义延时
// @author       You
// @match        http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556045/%E8%A7%86%E9%A2%91%E5%80%92%E8%AE%A1%E6%97%B6%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/556045/%E8%A7%86%E9%A2%91%E5%80%92%E8%AE%A1%E6%97%B6%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        CHECK_INTERVAL: 1000, // 检查视频状态的间隔时间（毫秒）
        DEFAULT_DELAY: 10,    // 默认延时（分钟）
        UPDATE_INTERVAL: 1000 // 倒计时更新间隔（毫秒）
    };

    // 全局变量
    let videoElement = null;
    let videoDuration = 0; // 视频总时长（秒）
    let remainingTime = 0; // 剩余倒计时时间（秒）
    let countdownInterval = null;
    let isCountdownRunning = false;
    let initialPlaybackTime = 0; // 记录倒计时开始时的播放时间
    let delayMinutes = CONFIG.DEFAULT_DELAY; // 存储当前设置的延时（分钟）

    // 创建UI元素
    function createUI() {
        // 创建右上角显示面板
        const displayPanel = document.createElement('div');
        displayPanel.id = 'video-timer-panel';
        displayPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;

        // 创建视频时长显示
        const videoInfo = document.createElement('div');
        videoInfo.id = 'video-info';
        videoInfo.innerHTML = `视频时长：--:-- / --:--`;
        videoInfo.style.marginBottom = '5px';
        displayPanel.appendChild(videoInfo);

        // 创建倒计时设置
        const countdownSettings = document.createElement('div');
        countdownSettings.innerHTML = `
            <div style="margin-bottom: 5px;">
                <span>延时设置：</span>
                <input type="number" id="delay-input" value="${CONFIG.DEFAULT_DELAY}" 
                       min="0" max="120" style="width: 50px; margin: 0 5px;">
                <span>分钟</span>
                <button id="cancel-countdown" style="margin-left: 5px;">取消</button>
            </div>
            <div id="countdown-display">倒计时：--:--:--</div>
        `;
        displayPanel.appendChild(countdownSettings);

        // 创建全屏提醒
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.id = 'fullscreen-notification';
        fullscreenDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 48px;
            font-weight: bold;
            z-index: 9999999;
            display: none;
        `;
        fullscreenDiv.innerHTML = `
            <div>倒计时结束</div>
            <div style="font-size: 24px; margin-top: 20px; opacity: 0.8;">点击任意位置关闭</div>
        `;

        document.body.appendChild(displayPanel);
        document.body.appendChild(fullscreenDiv);

        // 添加事件监听
        document.getElementById('cancel-countdown').addEventListener('click', cancelCountdown);
        document.getElementById('delay-input').addEventListener('input', handleDelayChange);
        fullscreenDiv.addEventListener('click', hideFullscreenNotification);
    }

    // 查找视频元素
    function findVideoElement() {
        // 首先尝试直接在页面中查找视频元素
        let video = document.querySelector('video');
        if (video) return video;

        // 尝试在iframe中查找视频元素
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                video = iframeDoc.querySelector('video');
                if (video) return video;
            } catch (e) {
                // 跨域iframe无法访问，忽略
            }
        }

        return null;
    }

    // 格式化时间显示
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // 更新视频信息显示
    function updateVideoInfo() {
        if (!videoElement) {
            document.getElementById('video-info').textContent = '视频时长：--:-- / --:--';
            return;
        }

        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;
        
        // 更新视频总时长
        if (duration > 0) {
            videoDuration = duration;
            
            // 如果视频时长已可用且倒计时未运行，则自动启动倒计时
            if (!isCountdownRunning) {
                startCountdown();
            }
        }
        
        document.getElementById('video-info').textContent = 
            `视频时长：${formatTime(currentTime)} / ${formatTime(duration)}`;
    }

    // 更新倒计时显示
    function updateCountdown() {
        if (!isCountdownRunning || !videoElement) {
            document.getElementById('countdown-display').textContent = `倒计时：--:--:--`;
            return;
        }
        
        // 基于当前视频播放时间动态计算剩余时间
        const currentPlaybackTime = videoElement.currentTime;
        const remainingVideoTime = videoDuration - currentPlaybackTime;
        const totalRemainingSeconds = remainingVideoTime + (delayMinutes * 60);
        remainingTime = Math.max(0, Math.floor(totalRemainingSeconds));
        
        document.getElementById('countdown-display').textContent = 
            `倒计时：${formatTime(remainingTime)}`;
        
        // 检查倒计时是否结束
        if (remainingTime <= 0 && isCountdownRunning) {
            endCountdown();
        }
    }

    // 开始倒计时
    function startCountdown() {
        // 停止之前的倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // 获取当前视频播放时间
        initialPlaybackTime = videoElement.currentTime;
        
        isCountdownRunning = true;
        
        // 更新显示
        updateCountdown();
        
        // 启动定时器，仅用于更新显示，不直接减少剩余时间
        countdownInterval = setInterval(() => {
            updateCountdown();
        }, CONFIG.UPDATE_INTERVAL);
        
        // 计算初始剩余时长
        const remainingVideoTime = videoDuration - initialPlaybackTime;
        const totalSeconds = remainingVideoTime + (delayMinutes * 60);
        console.log(`倒计时已启动，初始剩余时长：${formatTime(totalSeconds)}`);
    }
    
    // 处理延时设置变化
    function handleDelayChange() {
        delayMinutes = parseInt(document.getElementById('delay-input').value) || CONFIG.DEFAULT_DELAY;
        // 更新显示
        updateCountdown();
        console.log(`延时设置已更新为：${delayMinutes}分钟`);
    }
    
    // 处理视频播放进度变化
    function handlePlaybackProgressChange() {
        if (!isCountdownRunning || !videoElement) return;
        
        // 更新显示
        updateCountdown();
    }

    // 取消倒计时
    function cancelCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        
        isCountdownRunning = false;
        remainingTime = 0;
        updateCountdown();
        
        console.log('倒计时已取消');
    }

    // 结束倒计时
    function endCountdown() {
        cancelCountdown();
        showFullscreenNotification();
        
        // 显示通知后自动关闭窗口，无需用户点击
        setTimeout(() => {
            hideFullscreenNotification();
        }, 1000); // 延迟1秒后自动关闭
    }

    // 显示全屏通知
    function showFullscreenNotification() {
        const fullscreenDiv = document.getElementById('fullscreen-notification');
        fullscreenDiv.style.display = 'flex';
        console.log('显示倒计时结束通知，将在1秒后自动关闭窗口');
    }

    // 隐藏全屏通知并关闭播放窗口
    function hideFullscreenNotification() {
        const fullscreenDiv = document.getElementById('fullscreen-notification');
        fullscreenDiv.style.display = 'none';
        
        // 关闭当前播放窗口
        console.log('关闭当前播放窗口');
        window.close();
    }

    // 初始化视频元素
    function initVideoElement() {
        videoElement = findVideoElement();
        if (videoElement) {
            console.log('已找到视频元素');
            
            // 设置视频为静音
            if (!videoElement.muted) {
                videoElement.muted = true;
                console.log('视频已设置为静音');
            }
            
            // 立即检查视频是否已加载完成
            if (videoElement.duration > 0) {
                console.log('视频已加载完成，立即启动倒计时');
                videoDuration = videoElement.duration;
                startCountdown();
            }
            
            // 监听视频加载完成事件，获取准确时长
            videoElement.addEventListener('loadedmetadata', () => {
                videoDuration = videoElement.duration;
                console.log(`loadedmetadata事件触发，视频时长：${formatTime(videoDuration)}`);
                
                // 确保视频静音
                if (!videoElement.muted) {
                    videoElement.muted = true;
                    console.log('视频已设置为静音');
                }
                
                // 视频加载完成后自动开始倒计时
                startCountdown();
            });
            
            // 监听视频播放进度变化事件
            videoElement.addEventListener('timeupdate', handlePlaybackProgressChange);
            
            // 监听视频播放事件，确保倒计时启动和静音
            videoElement.addEventListener('play', () => {
                console.log('视频播放事件触发，检查倒计时状态和静音状态');
                
                // 确保视频静音
                if (!videoElement.muted) {
                    videoElement.muted = true;
                    console.log('视频已设置为静音');
                }
                
                if (videoElement.duration > 0 && !isCountdownRunning) {
                    startCountdown();
                }
            });
        }
    }

    // 初始化函数
    function init() {
        console.log('视频倒计时提醒工具已启动');
        
        // 创建UI
        createUI();
        
        // 初始化视频元素
        initVideoElement();
        
        // 如果没有找到视频元素，尝试定期查找
        if (!videoElement) {
            const videoCheckInterval = setInterval(() => {
                initVideoElement();
                if (videoElement) {
                    clearInterval(videoCheckInterval);
                }
            }, 3000);
        }
        
        // 定期更新视频信息
        setInterval(updateVideoInfo, CONFIG.CHECK_INTERVAL);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

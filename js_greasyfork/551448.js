// ==UserScript==
// @name         升学e网通视频自动连续播放与认真度检查
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动播放完当前视频后播放下一个视频，并自动通过认真度检查
// @author       AI Assistant
// @match        https://teacher.ewt360.com/*
// @match        https://web.ewt360.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551448/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E4%B8%8E%E8%AE%A4%E7%9C%9F%E5%BA%A6%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/551448/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E4%B8%8E%E8%AE%A4%E7%9C%9F%E5%BA%A6%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎬 升学e网通视频自动连续播放与认真度检查脚本已加载');

    // 存储当前状态
    let currentVideoEnded = false;
    let isSwitching = false;
    let checkInterval = null;
    let observer = null;

    // 1. 监控当前视频播放状态
    function monitorVideoPlayback() {
        const videoElement = document.querySelector('video');

        if (!videoElement) {
            console.log('❌ 未找到视频元素，5秒后重试...');
            setTimeout(monitorVideoPlayback, 5000);
            return;
        }

        console.log('✅ 找到视频元素，开始监控播放状态');

        // 清除旧的事件监听器（避免重复绑定）
        videoElement.removeEventListener('ended', handleVideoEnded);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('error', handleVideoError);

        // 监听视频结束事件
        videoElement.addEventListener('ended', handleVideoEnded);

        // 监听时间更新（用于调试）
        videoElement.addEventListener('timeupdate', handleTimeUpdate);

        // 监听播放错误
        videoElement.addEventListener('error', handleVideoError);
    }

    function handleVideoEnded() {
        console.log('📺 当前视频播放结束');
        currentVideoEnded = true;
        playNextVideo();
    }

    function handleTimeUpdate() {
        const videoElement = document.querySelector('video');
        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;
        const progress = ((currentTime / duration) * 100).toFixed(1);

        // 每10%进度输出一次日志
        if (progress % 10 === 0 && currentTime > 1) {
            console.log(`📊 播放进度: ${progress}% (${formatTime(currentTime)}/${formatTime(duration)})`);
        }
    }

    function handleVideoError(e) {
        console.error('❌ 视频播放错误:', e);
    }

    // 2. 播放下一个视频
    function playNextVideo() {
        if (isSwitching) {
            console.log('⏳ 正在切换视频中，请稍候...');
            return;
        }

        isSwitching = true;
        console.log('🔄 正在查找下一个视频...');

        // 获取当前活动的视频项
        const currentActiveItem = document.querySelector('.item-blpma.active-EI2Hl');
        if (!currentActiveItem) {
            console.log('❌ 未找到当前活动视频项');
            isSwitching = false;
            return;
        }

        // 找到下一个视频项
        const allVideoItems = document.querySelectorAll('.item-blpma');
        let nextVideoItem = null;
        let foundCurrent = false;

        for (let i = 0; i < allVideoItems.length; i++) {
            if (foundCurrent && !allVideoItems[i].classList.contains('active-EI2Hl')) {
                nextVideoItem = allVideoItems[i];
                break;
            }
            if (allVideoItems[i] === currentActiveItem) {
                foundCurrent = true;
            }
        }

        if (!nextVideoItem) {
            console.log('✅ 所有视频已播放完成');
            isSwitching = false;
            return;
        }

        console.log('👉 找到下一个视频:', nextVideoItem.querySelector('.lessontitle-G206y')?.textContent || '未知标题');

        // 点击下一个视频
        setTimeout(() => {
            nextVideoItem.click();
            console.log('🎯 已点击下一个视频');

            // 等待页面加载新视频
            setTimeout(() => {
                console.log('🔄 新视频加载中，等待5秒...');

                // 重新开始监控新视频
                setTimeout(() => {
                    currentVideoEnded = false;
                    isSwitching = false;
                    monitorVideoPlayback();
                    console.log('🔁 新视频监控已启动');
                }, 5000);

            }, 2000);

        }, 1000);
    }

    // 3. 自动通过认真度检查
    function monitorEarnestCheck() {
        // 清除旧的检查间隔
        if (checkInterval) {
            clearInterval(checkInterval);
        }

        checkInterval = setInterval(() => {
            const checkBox = document.querySelector('.video_earnest_check_box-D3ptB');
            const checkBtn = document.querySelector('.btn-DOCWn');

            if (checkBox) {
                console.log('✅ 检测到认真度检查框');
            }

            if (checkBtn) {
                console.log('🎯 找到通过按钮，正在自动点击...');
                checkBtn.click();
                console.log('👍 已点击通过按钮');
                clearInterval(checkInterval);
            }
        }, 1000);
    }

    // 辅助函数：格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 4. 初始化函数
    function initAutoPlay() {
        console.log('🚀 初始化自动播放功能...');

        // 开始监控视频播放
        monitorVideoPlayback();

        // 开始监控认真度检查
        monitorEarnestCheck();

        // 添加全局样式
        const style = document.createElement('style');
        style.textContent = `
            .video_earnest_check_box-D3ptB {
                display: none !important;
            }
            .earnest_check_tip-hAMr7 {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        // 添加键盘快捷键
        document.addEventListener('keydown', function(e) {
            // Ctrl+Alt+N: 手动触发下一个视频
            if (e.ctrlKey && e.altKey && e.key === 'N') {
                console.log('⌨️ 手动触发播放下一个视频');
                playNextVideo();
            }
            // Ctrl+Alt+R: 重新加载监控
            if (e.ctrlKey && e.altKey && e.key === 'R') {
                console.log('🔄 手动重新加载视频监控');
                monitorVideoPlayback();
            }
        });

        console.log('🎮 快捷键已启用: Ctrl+Alt+N = 下一个视频, Ctrl+Alt+R = 重新加载监控');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoPlay);
    } else {
        setTimeout(initAutoPlay, 2000);
    }

    // 监听DOM变化（应对动态加载）
    if (observer) {
        observer.disconnect();
    }

    observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                const checkBtn = document.querySelector('.btn-DOCWn');
                if (checkBtn) {
                    console.log('🔍 通过DOM变化检测到认真度检查按钮');
                    checkBtn.click();
                }

                // 检查是否有新的视频元素加载
                const videoElement = document.querySelector('video');
                if (videoElement && !videoElement.hasListener) {
                    console.log('🆕 检测到新视频元素，重新绑定监听');
                    videoElement.hasListener = true;
                    monitorVideoPlayback();
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 清理函数
    window.addEventListener('beforeunload', function() {
        if (checkInterval) clearInterval(checkInterval);
        if (observer) observer.disconnect();
    });

})();
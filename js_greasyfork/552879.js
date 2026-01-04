// ==UserScript==
// @name         刷课脚本-4倍速-自动关闭弹窗-增强版
// @namespace    https://greasyfork.org/
// @version      2.0
// @description  辅助脚本：自动4倍速播放 + 自动点击继续学习按钮
// @author       xln-tj
// @match        https://study.enaea.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552879/%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-4%E5%80%8D%E9%80%9F-%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97-%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552879/%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-4%E5%80%8D%E9%80%9F-%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97-%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_SPEED = 4;
    let processedVideos = new WeakSet();

    // ==================== 功能1: 4倍速播放 ====================

    // 设置视频播放速度的函数
    function setVideoSpeed(video) {
        if (!video || processedVideos.has(video)) return false;

        try {
            video.playbackRate = TARGET_SPEED;
            processedVideos.add(video);
            console.log(`✅ 视频播放速度已设置为${TARGET_SPEED}倍速`, video);

            // 持续监控该视频，防止被重置
            const keepSpeed = setInterval(() => {
                if (!document.contains(video)) {
                    clearInterval(keepSpeed);
                    return;
                }
                if (Math.abs(video.playbackRate - TARGET_SPEED) > 0.01) {
                    video.playbackRate = TARGET_SPEED;
                    console.log(`🔄 播放速度被重置，已恢复为${TARGET_SPEED}倍速`);
                }
            }, 500);

            return true;
        } catch (e) {
            console.error('设置播放速度失败:', e);
            return false;
        }
    }

    // 查找并设置所有视频
    function setAllVideos() {
        const videos = document.querySelectorAll('video');
        let count = 0;
        videos.forEach(video => {
            if (setVideoSpeed(video)) count++;
        });
        if (count > 0) {
            console.log(`🎬 找到并设置了 ${count} 个视频`);
        }
        return count > 0;
    }

    // 劫持 playbackRate 属性（更激进的方法）
    function hijackPlaybackRate() {
        const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');

        Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
            get: function() {
                return originalDescriptor.get.call(this);
            },
            set: function(value) {
                // 总是设置为目标速度
                originalDescriptor.set.call(this, TARGET_SPEED);
                console.log(`🎯 拦截并强制设置播放速度为${TARGET_SPEED}倍速`);
            },
            configurable: true
        });
    }

    // 初始化4倍速功能
    function init4xSpeed() {
        console.log('🚀 视频4倍速脚本已启动');

        // 方法1: 立即尝试设置
        setTimeout(setAllVideos, 100);
        setTimeout(setAllVideos, 500);
        setTimeout(setAllVideos, 1000);
        setTimeout(setAllVideos, 2000);
        setTimeout(setAllVideos, 3000);

        // 方法2: MutationObserver 监听新增的视频元素
        const observer = new MutationObserver(function(mutations) {
            setAllVideos();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 方法3: 持续定时检查
        setInterval(setAllVideos, 2000);

        // 方法4: 监听各种视频相关事件
        const events = ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'play', 'ratechange'];
        events.forEach(eventName => {
            document.addEventListener(eventName, function(e) {
                if (e.target && e.target.tagName === 'VIDEO') {
                    setVideoSpeed(e.target);
                }
            }, true);
        });

        // 方法5: 劫持 playbackRate 属性（可选，更激进）
        // 如果上面的方法都不行，取消下面这行的注释
        // hijackPlaybackRate();

        // 页面加载完成后再次尝试
        window.addEventListener('load', function() {
            setTimeout(setAllVideos, 500);
            setTimeout(setAllVideos, 1500);
        });

        // 检查 iframe 中的视频
        function checkIframes() {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const videos = iframeDoc.querySelectorAll('video');
                    videos.forEach(video => setVideoSpeed(video));
                } catch (e) {
                    // 跨域 iframe 无法访问
                }
            });
        }

        setTimeout(checkIframes, 2000);
        setInterval(checkIframes, 5000);
    }

    // ==================== 功能2: 自动点击继续学习 ====================

    function autoClickContinue() {
        setInterval(function () {
            const dialogBoxes = document.getElementsByClassName("dialog-box");
            if (dialogBoxes.length != 0) {
                console.log("🔔 检测到20分钟限制弹窗，自动点击继续学习");
                try {
                    const buttonContainer = document.getElementsByClassName("dialog-button-container")[0];
                    if (buttonContainer && buttonContainer.children[0]) {
                        buttonContainer.children[0].click();
                        console.log("✅ 已自动点击继续学习按钮");
                    }
                } catch (e) {
                    console.error("点击继续学习按钮失败:", e);
                }
            }
        }, 5000);

        console.log('🚀 自动点击继续学习功能已启动（每5秒检测一次）');
    }

    // ==================== 启动所有功能 ====================

    console.log('═══════════════════════════════════════');
    console.log('📚 刷课脚本-4倍速-自动关闭弹窗-增强版 v2.0');
    console.log('功能1: 视频4倍速播放');
    console.log('功能2: 自动点击继续学习按钮');
    console.log('═══════════════════════════════════════');

    // 启动4倍速功能
    init4xSpeed();

    // 启动自动点击继续学习功能
    autoClickContinue();

    console.log('📌 提示: 打开控制台(F12)可以看到脚本运行日志');

})();
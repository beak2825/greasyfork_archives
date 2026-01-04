// ==UserScript==
// @name         B站快捷键增强：Enter全屏 + 倍速播放
// @namespace    https://dqtx.cc/
// @version      1.0
// @description  在B站按Enter键全屏/退出全屏，按1/2/3键控制播放倍速
// @author       Derek
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551519/B%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A2%9E%E5%BC%BA%EF%BC%9AEnter%E5%85%A8%E5%B1%8F%20%2B%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/551519/B%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A2%9E%E5%BC%BA%EF%BC%9AEnter%E5%85%A8%E5%B1%8F%20%2B%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待视频元素加载完成
    function waitForVideo() {
        const video = document.querySelector('video');
        if (video) {
            init(video);
        } else {
            setTimeout(waitForVideo, 500);
        }
    }

    function init(video) {
        console.log('[B站快捷键增强] 已启动');

        document.addEventListener('keydown', (e) => {
            // 忽略输入框（防止在评论区或搜索框触发）
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

            // 按 Enter 键切换全屏
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!document.fullscreenElement) {
                    const player = document.querySelector('.bpx-player-video-wrap') || video;
                    if (player.requestFullscreen) player.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }

            // 按数字键控制播放速度
            if (['1', '2', '3'].includes(e.key)) {
                e.preventDefault();
                switch (e.key) {
                    case '1':
                        video.playbackRate = 1.0;
                        showToast('倍速：1.0x');
                        break;
                    case '2':
                        video.playbackRate = 2.0;
                        showToast('倍速：2.0x');
                        break;
                    case '3':
                        video.playbackRate = 3.0;
                        showToast('倍速：3.0x');
                        break;
                }
            }
        });

        // 简易提示气泡
        function showToast(text) {
            let toast = document.createElement('div');
            toast.innerText = text;
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                zIndex: 9999,
                transition: 'opacity 0.5s',
                opacity: 1
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.style.opacity = 0, 1000);
            setTimeout(() => toast.remove(), 1500);
        }
    }

    waitForVideo();
})();
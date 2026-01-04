// ==UserScript==
// @name         B站自动点赞
// @namespace    momo325-bilibili-autolike
// @version      3.5
// @description  自动在真实观看达70%后点赞；短视频兼容；忽略快进；不会误取消手动点赞；支持倍速和分P切换
// @author       momo325
// @match        https://www.bilibili.com/video/*
// @grant        none
// @homepage     https://github.com/momo325/BiliBiliAutoLike
// @icon          https://static.hdslb.com/images/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551849/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/551849/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

/*
GitHub: https://github.com/momo325/BiliBiliAutoLike
*/


(function () {
    'use strict';

    let currentVideo = null;
    let currentDuration = 0;
    let liked = false;
    let watchTime = 0;
    let lastTime = 0;
    let monitorTimer = null;

    const WATCH_RATIO = 0.7; // 改为70%
    const DELTA_LIMIT = 5;// 快进判定放宽到5秒

    console.log('🎬 B站自动点赞 已启动');

    // 监听页面内视频变化（支持分P）
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            if (video !== currentVideo) {
                console.log('📺 检测到新视频元素');
                switchToNewVideo(video);
            } else if (video.duration !== currentDuration && !isNaN(video.duration) && video.duration > 0) {
                console.log('🔁 检测到视频时长变化（可能切P）');
                switchToNewVideo(video);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function switchToNewVideo(video) {
        currentVideo = video;
        currentDuration = video.duration || 0;
        liked = false;
        watchTime = 0;
        lastTime = video.currentTime;
        if (monitorTimer) clearInterval(monitorTimer);
        startMonitor(video);
    }

    function startMonitor(video) {
        monitorTimer = setInterval(() => {
            if (!video || isNaN(video.duration) || video.duration === 0) return;

            const current = video.currentTime;
            let delta = current - lastTime;
            lastTime = current;

            // ✅ 跳转幅度超过5秒视为快进，不计入观看时间
            if (delta > DELTA_LIMIT || delta < 0) {
                console.log('⏩ 检测到快进操作，跳过本次计时');
                return;
            }

            if (!video.paused) watchTime += delta;

            const ratio = watchTime / video.duration;

            if (!liked && ratio >= WATCH_RATIO) {
                liked = true;
                if (!isLiked()) {
                    triggerLikeByQ();
                    console.log(`👍 已自动点赞（累计真实观看 ${(ratio * 100).toFixed(1)}%）`);
                } else {
                    console.log('💡 用户已手动点赞，跳过自动点赞');
                }
            }
        }, 1000);
    }

    // 检查是否已点赞（防取消）
    function isLiked() {
        const btn = document.querySelector('.video-like, .like, .toolbar-left .like');
        return btn && (
            btn.getAttribute('aria-pressed') === 'true' ||
            btn.classList.contains('on') ||
            btn.classList.contains('active')
        );
    }

    // 模拟“轻按 Q 键”点赞（防三连）
    function triggerLikeByQ() {
        const keyDown = new KeyboardEvent('keydown', {
            key: 'q',
            code: 'KeyQ',
            keyCode: 81,
            bubbles: true,
            cancelable: true
        });
        const keyUp = new KeyboardEvent('keyup', {
            key: 'q',
            code: 'KeyQ',
            keyCode: 81,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(keyDown);
        setTimeout(() => document.dispatchEvent(keyUp), 50);
    }
})();

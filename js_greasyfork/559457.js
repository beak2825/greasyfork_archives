// ==UserScript==
// @name         浙江研究生课程联盟（自动播放）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  模拟真实点击播放，自动2倍速播放，非视频自动跳过，确保进度有效上报
// @author       Jim
// @match        *://zjyjs.zj.zju.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559457/%E6%B5%99%E6%B1%9F%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%BE%E7%A8%8B%E8%81%94%E7%9B%9F%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559457/%E6%B5%99%E6%B1%9F%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%BE%E7%A8%8B%E8%81%94%E7%9B%9F%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('[学习助手] 模拟真实点击版启动中...');

    const PLAYBACK_RATE = 2; // 推荐使用低倍速
    const CHECK_INTERVAL = 5000; // 每5秒检测一次状态

    function mainLoop() {
        const video = document.querySelector('video');
        const playBtn = document.querySelector('button.mvp-toggle-play');

        if (video) {
            // 如果暂停，就尝试模拟点击播放按钮
            if (video.paused) {
                if (playBtn) {
                    playBtn.click();
                    console.log('[学习助手] 模拟点击播放按钮');
                } else {
                    video.play().catch(() => {});
                }
            }

            // 设置播放速度
            if (video.playbackRate !== PLAYBACK_RATE) {
                video.playbackRate = PLAYBACK_RATE;
                console.log(`[学习助手] 设置倍速为 ${PLAYBACK_RATE}x`);
            }

            // 伪造timeupdate事件，保证进度心跳
            video.dispatchEvent(new Event('timeupdate'));

            // 监听播放结束自动跳转
            if (!video.dataset.boundEnded) {
                video.dataset.boundEnded = 'true';
                video.addEventListener('ended', () => {
                    console.log('[学习助手] 视频播放结束，跳转下一个...');
                    goNext();
                });
            }

        } else {
            // 当前小节不是视频，自动跳过
            console.log('[学习助手] 当前章节非视频内容，跳转下一个...');
            goNext();
        }
    }

    function goNext() {
        const nextButton = document.querySelector('button.button[ng-if="nextActivity"][ng-click="changeActivity(nextActivity)"]');
        if (nextButton) {
            setTimeout(() => {
                nextButton.click();
                console.log('[学习助手] 已点击“下一个”');
            }, 1500);
        } else {
            console.log('[学习助手] 未检测到“下一个”按钮，可能是最后一章。');
        }
    }

    // 初始化
    console.log(`[学习助手] 每${CHECK_INTERVAL/1000}秒检测一次播放状态`);
    setInterval(mainLoop, CHECK_INTERVAL);
})();

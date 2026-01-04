// ==UserScript==
// @name         Universal Picture-in-Picture
// @name:zh-CN   通用画中画
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically enable Picture-in-Picture mode for the video you are watching. Supports ignoring ads and unlocking blocked videos.
// @description:zh-CN 自动将你正在观看的视频切换到画中画模式。智能识别正片，忽略广告，并解除网站的画中画限制。
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_showNotification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560940/Universal%20Picture-in-Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/560940/Universal%20Picture-in-Picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心逻辑：查找并切换画中画
    async function togglePictureInPicture() {
        // 1. 查找所有视频（包括 Shadow DOM）
        function findVideos(root) {
            let videos = Array.from(root.querySelectorAll('video'));
            const allElements = root.querySelectorAll('*');
            for (let el of allElements) {
                if (el.shadowRoot) {
                    videos = videos.concat(findVideos(el.shadowRoot));
                }
            }
            return videos;
        }

        const videos = findVideos(document);

        if (videos.length === 0) {
            showToast('未找到视频元素');
            return;
        }

        // 2. 视频评分系统
        function calculateScore(video) {
            let score = 0;
            const rect = video.getBoundingClientRect();
            const area = rect.width * rect.height;
            const duration = video.duration;

            // 过滤不可见或微小的视频
            if (rect.width < 100 || rect.height < 100 || getComputedStyle(video).display === 'none') return -1;

            // 时长权重
            if (duration === Infinity || duration > 60) {
                score += 10000000; // 长视频或直播
            } else if (duration > 0 && duration <= 60) {
                score += 1000;     // 短视频/可能广告
            } else {
                score += 5000;     // 未知时长
            }

            // 面积权重 (归一化，最大加分 999999)
            score += Math.min(area, 999999);

            // 播放状态权重
            if (!video.paused) {
                score += 500000;
            }

            return score;
        }

        // 筛选并排序
        const candidates = videos.map(v => ({
            video: v,
            score: calculateScore(v)
        })).filter(item => item.score > 0);

        if (candidates.length === 0) {
            showToast('未找到有效视频');
            return;
        }

        candidates.sort((a, b) => b.score - a.score);
        const targetVideo = candidates[0].video;

        // 3. 执行切换
        if (targetVideo) {
            try {
                // 解锁限制
                if (targetVideo.hasAttribute('disablePictureInPicture')) {
                    targetVideo.removeAttribute('disablePictureInPicture');
                }
                targetVideo.disablePictureInPicture = false;

                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                    // showToast('已退出画中画'); // 退出通常不需要提示
                } else {
                    await targetVideo.requestPictureInPicture();
                    // showToast('已进入画中画'); // 浏览器通常会有原生提示
                }
            } catch (error) {
                console.error('PiP Error:', error);
                showToast('无法开启画中画: ' + error.message);
            }
        }
    }

    // 简单的提示框 UI
    function showToast(message) {
        // 如果 GM_showNotification 可用则使用（部分管理器支持）
        // if (typeof GM_showNotification === 'function') {
        //     GM_showNotification({text: message, timeout: 3000});
        //     return;
        // }

        // 自定义 DOM 提示
        let toast = document.getElementById('pip-toast-msg');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pip-toast-msg';
            Object.assign(toast.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '999999',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                transition: 'opacity 0.5s',
                pointerEvents: 'none'
            });
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        
        clearTimeout(toast.timeout);
        toast.timeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }

    // 注册菜单命令 (在插件菜单中显示)
    GM_registerMenuCommand("切换画中画 (Alt+P)", togglePictureInPicture);

    // 注册快捷键监听 (Alt + P)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault(); // 防止与网页原有快捷键冲突
            togglePictureInPicture();
        }
    });

    console.log('Universal PiP script loaded. Press Alt+P to toggle.');
})();

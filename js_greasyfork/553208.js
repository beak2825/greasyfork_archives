// ==UserScript==
// @name         Bilibili 音量调节步进修改(AI生成）（5% + 居中提示 + 全屏支持）
// @name:en      Bilibili Volume Step Modifier (5% + Centered Indicator + Fullscreen Support)
// @namespace    https://bilibili.com/
// @version      1.3.2
// @description  使用方向键↑↓以5%步进调节Bilibili音量，支持全屏并在屏幕中央显示提示框。
// @description:en Adjust Bilibili video volume in 5% steps using ↑↓ keys, with centered on-screen display and fullscreen support.
// @author       chuangzaoh666
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @match        *://bilibili.tv/video/*
// @match        *://www.bilibili.com/list/watchlater*
// @grant        none
// @homepageURL  https://greasyfork.org/scripts/553208
// @supportURL   https://greasyfork.org/users/1528875
// @icon         https://static.hdslb.com/images/favicon.ico
// @source       Script created with assistance from ChatGPT (GPT-5)
// @downloadURL https://update.greasyfork.org/scripts/553208/Bilibili%20%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82%E6%AD%A5%E8%BF%9B%E4%BF%AE%E6%94%B9%28AI%E7%94%9F%E6%88%90%EF%BC%89%EF%BC%885%25%20%2B%20%E5%B1%85%E4%B8%AD%E6%8F%90%E7%A4%BA%20%2B%20%E5%85%A8%E5%B1%8F%E6%94%AF%E6%8C%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553208/Bilibili%20%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82%E6%AD%A5%E8%BF%9B%E4%BF%AE%E6%94%B9%28AI%E7%94%9F%E6%88%90%EF%BC%89%EF%BC%885%25%20%2B%20%E5%B1%85%E4%B8%AD%E6%8F%90%E7%A4%BA%20%2B%20%E5%85%A8%E5%B1%8F%E6%94%AF%E6%8C%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForVideo(callback) {
        const timer = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                clearInterval(timer);
                callback(video);
            }
        }, 500);
    }

    waitForVideo((video) => {
        console.log('[音量步进修改脚本] 已加载');

        // 创建中心提示元素
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            background: rgba(0, 0, 0, 0.65);
            color: #fff;
            padding: 20px 30px;
            border-radius: 16px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            z-index: 999999;
            opacity: 0;
            transition: opacity 0.25s ease, transform 0.25s ease;
            pointer-events: none;
            backdrop-filter: blur(4px);
            font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
        `;

        // 查找播放器容器
        function getPlayerContainer() {
            return (
                document.querySelector('.bpx-player-container') ||
                document.querySelector('.bilibili-player') ||
                document.body
            );
        }

        let container = getPlayerContainer();
        container.appendChild(hint);

        // 监听DOM变化（切换全屏时自动跟随）
        const observer = new MutationObserver(() => {
            const newContainer = getPlayerContainer();
            if (newContainer !== container) {
                container = newContainer;
                if (!hint.isConnected) container.appendChild(hint);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 提示动画
        let hideTimer = null;
        function showVolumeHint(vol) {
            hint.textContent = `音量：${Math.round(vol * 100)}%`;
            hint.style.opacity = 1;
            hint.style.transform = 'translate(-50%, -50%) scale(1.05)';
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                hint.style.opacity = 0;
                hint.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 800);
        }

        // 键盘控制
        document.addEventListener(
            'keydown',
            (e) => {
                const active = document.activeElement;
                if (
                    active &&
                    (active.tagName === 'INPUT' ||
                        active.tagName === 'TEXTAREA' ||
                        active.isContentEditable)
                )
                    return;

                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    let delta = 0.05;
                    if (e.key === 'ArrowDown') delta = -delta;

                    video.volume = Math.min(1, Math.max(0, video.volume + delta));
                    showVolumeHint(video.volume);
                }
            },
            true
        );
    });
})();
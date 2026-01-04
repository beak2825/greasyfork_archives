// ==UserScript==
// @name         暗区突围安全巡查视频播放器优化
// @namespace    http://tampermonkey.net/
// @version      2025-12-28.1
// @description  按键盘的上的左右方向键快退快进 5 秒，长按右键是 2 倍速快放，按住 Shift + 左右键可以快退快进 1.5 秒，按住 Ctrl + 左右键可以快退快进 10 秒。按空格暂停继续。按上下可以调整播放倍速。按住 Ctrl 键显示屏幕中心白点。按住 Ctrl+Shift 键显示屏幕中心十字线。点击拖动进度条可以调整进度。
// @author       Ganlv
// @match        https://aqtwwx.qq.com/act/a20250928patroller/*
// @icon         https://aqtwwx.qq.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560431/%E6%9A%97%E5%8C%BA%E7%AA%81%E5%9B%B4%E5%AE%89%E5%85%A8%E5%B7%A1%E6%9F%A5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560431/%E6%9A%97%E5%8C%BA%E7%AA%81%E5%9B%B4%E5%AE%89%E5%85%A8%E5%B7%A1%E6%9F%A5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let existsToastEl = null;
    let existsToastTimeoutId = null;
    const showToast = (msg) => {
        const parent = document.querySelector('#drillPlayer');
        if (existsToastEl) {
            parent.removeChild(existsToastEl);
            clearTimeout(existsToastTimeoutId);
        }
        const toast = document.createElement('div');
        toast.innerText = msg;
        toast.style.position = 'absolute';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        toast.style.color = 'black';
        toast.style.padding = '10px 20px';
        toast.style.fontSize = '1.5em';
        toast.style.zIndex = '10000';
        parent.appendChild(toast);
        existsToastTimeoutId = setTimeout(() => {
            parent.removeChild(toast);
            existsToastEl = null;
        }, 500);
        existsToastEl = toast;
    };

    const playbackRates = [0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.25, 1.5, 2];
    let savedPlaybackRate = 1;
    let arrowRightTimeoutId = null;
    document.addEventListener('keydown', (e) => {
        if (e.repeat) {
            return;
        }
        const video = document.querySelector('video[data-idx][src]');
        if (!video) {
            return;
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (e.key === 'ArrowRight') {
                arrowRightTimeoutId = setTimeout(() => {
                    savedPlaybackRate = video.playbackRate;
                    video.playbackRate = 2;
                    showToast(`${video.playbackRate}x`);
                    arrowRightTimeoutId = null;
                }, 700);
            } else {
                const deltaTime = e.shiftKey ? 1 : e.ctrlKey ? 10 : 5;
                video.currentTime -= deltaTime;
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const currentSpeed = video.playbackRate;
            const currentSpeedIndex = playbackRates.findIndex(rate => Math.abs(rate - currentSpeed) < 0.01);
            if (e.key === 'ArrowUp') {
                video.playbackRate = playbackRates[Math.min(currentSpeedIndex + 1, playbackRates.length - 1)];
            } else {
                video.playbackRate = playbackRates[Math.max(currentSpeedIndex - 1, 0)];
            }
            showToast(`${video.playbackRate}x`);
        } else if (e.key === ' ') {
            e.preventDefault();
            document.querySelector('.txp_btn_play').click();
        } else if (e.key === 'f') {
            document.querySelector('.txp_btn_fullscreen').click();
        }
    });
    document.addEventListener('keyup', (e) => {
        const video = document.querySelector('video[data-idx][src]');
        if (!video) {
            return;
        }
        if (e.key === 'ArrowRight') {
            if (arrowRightTimeoutId) {
                clearTimeout(arrowRightTimeoutId);
                arrowRightTimeoutId = null;
                const deltaTime = e.shiftKey ? 1.5 : e.ctrlKey ? 10 : 5;
                video.currentTime += deltaTime;
            } else {
                video.playbackRate = savedPlaybackRate;
                showToast(`${video.playbackRate}x`);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && !document.querySelector('#drillPlayer .center-dot')) {
            const centerDot = document.createElement('div');
            centerDot.className = 'center-dot';
            centerDot.style.pointerEvents = 'none';
            centerDot.style.position = 'absolute';
            centerDot.style.top = '50%';
            centerDot.style.left = '50%';
            centerDot.style.transform = 'translate(-50%, -50%)';
            centerDot.style.width = '4px';
            centerDot.style.height = '4px';
            centerDot.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            centerDot.style.borderRadius = '50%';
            centerDot.style.zIndex = '9999';
            document.querySelector('#drillPlayer').appendChild(centerDot);
        }
        if (e.ctrlKey && e.shiftKey && !document.querySelector('#drillPlayer .crosshair-lines')) {
            const verticalLine = document.createElement('div');
            verticalLine.className = 'crosshair-lines';
            verticalLine.style.pointerEvents = 'none';
            verticalLine.style.position = 'absolute';
            verticalLine.style.top = '0';
            verticalLine.style.bottom = '0';
            verticalLine.style.left = '50%';
            verticalLine.style.transform = 'translate(-50%, 0)';
            verticalLine.style.width = '2px';
            verticalLine.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            verticalLine.style.zIndex = '9999';
            const horizontalLine = document.createElement('div');
            horizontalLine.className = 'crosshair-lines';
            horizontalLine.style.pointerEvents = 'none';
            horizontalLine.style.position = 'absolute';
            horizontalLine.style.left = '0';
            horizontalLine.style.right = '0';
            horizontalLine.style.top = '50%';
            horizontalLine.style.transform = 'translate(0, -50%)';
            horizontalLine.style.height = '2px';
            horizontalLine.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            horizontalLine.style.zIndex = '9999';
            document.querySelector('#drillPlayer').appendChild(verticalLine);
            document.querySelector('#drillPlayer').appendChild(horizontalLine);
        }
    });
    document.addEventListener('keyup', (e) => {
        if (!e.ctrlKey) {
            document.querySelector('#drillPlayer .center-dot').remove();
        }
        if (!e.ctrlKey || !e.shiftKey) {
            document.querySelectorAll('#drillPlayer .crosshair-lines').forEach(el => el.remove());
        }
    });

    let isMouseDown = false;
    const handleProgressBarClick = (e) => {
        const progressBarContainer = document.querySelector('.txp_progress_bar_container');
        const video = document.querySelector('video[data-idx][src]');
        if (!progressBarContainer || !video) {
            return;
        }
        const rect = progressBarContainer.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        if ((e.type === 'mousedown' && mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) || (e.type === 'mousemove' && isMouseDown)) {
            if (e.type === 'mousedown') {
                isMouseDown = true;
            }
            document.querySelector('.plugin_ctrl_txp_shadow').style.pointerEvents = 'none';
            const percentage = (mouseX - rect.left) / rect.width;
            video.currentTime = video.duration * percentage;
            e.stopPropagation();
            e.preventDefault();
        }
    };
    document.addEventListener('mousedown', handleProgressBarClick);
    document.addEventListener('mousemove', handleProgressBarClick);
    document.addEventListener('mouseup', (e) => {
        if (isMouseDown) {
            e.stopPropagation();
            e.preventDefault();
            isMouseDown = false;
        }
    });
})();
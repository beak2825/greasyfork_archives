// ==UserScript==
// @name         悬浮球全屏按钮（小巧+边界限制+透明）
// @namespace    https://muyyy.link/
// @version      1.5
// @description  小号悬浮球按钮，点击切换全屏，右键/长按隐藏，自动限制边界，保持可见，高透明度美化！在没有键盘的设备上仍然可以随时“全屏显示”，让平板、手机的显示空间不再被约束！
// @author       Muyu
// @homepage     https://muyyy.link/
// @license      Apache-2.0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549568/%E6%82%AC%E6%B5%AE%E7%90%83%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE%EF%BC%88%E5%B0%8F%E5%B7%A7%2B%E8%BE%B9%E7%95%8C%E9%99%90%E5%88%B6%2B%E9%80%8F%E6%98%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549568/%E6%82%AC%E6%B5%AE%E7%90%83%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE%EF%BC%88%E5%B0%8F%E5%B7%A7%2B%E8%BE%B9%E7%95%8C%E9%99%90%E5%88%B6%2B%E9%80%8F%E6%98%8E%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ball = document.createElement('div');
    ball.innerText = '⛶';
    Object.assign(ball.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        zIndex: 99999,
        cursor: 'grab',
        userSelect: 'none',
        transition: 'opacity 0.3s',
    });

    document.body.appendChild(ball);

    function isFullscreen() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }

    function enterFullscreen() {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }

    function exitFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }

    ball.addEventListener('click', () => {
        if (isDragging) return;
        if (isFullscreen()) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    });

    ball.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        ball.style.display = 'none';
    });

    // 长按隐藏
    let pressTimer = null;
    let longPressTriggered = false;

    ball.addEventListener('touchstart', (e) => {
        isDragging = false;
        longPressTriggered = false;
        pressTimer = setTimeout(() => {
            longPressTriggered = true;
            ball.style.display = 'none';
        }, 800);
    });

    ball.addEventListener('touchend', () => {
        if (pressTimer) clearTimeout(pressTimer);
    });

    ball.addEventListener('touchmove', () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });

    // 拖动逻辑
    let isDragging = false;
    let isDraggingFromBall = false;
    let offsetX, offsetY;

    function clamp(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    function moveBall(x, y) {
        const margin = 5;
        const maxX = window.innerWidth - ball.offsetWidth - margin;
        const maxY = window.innerHeight - ball.offsetHeight - margin;

        const newX = clamp(x, margin, maxX);
        const newY = clamp(y, margin, maxY);

        ball.style.left = `${newX}px`;
        ball.style.top = `${newY}px`;
        ball.style.right = 'auto';
        ball.style.bottom = 'auto';
    }

    // 鼠标拖动
    ball.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        isDraggingFromBall = true;
        ball.style.cursor = 'grabbing';
        offsetX = e.clientX - ball.getBoundingClientRect().left;
        offsetY = e.clientY - ball.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !isDraggingFromBall) return;
        moveBall(e.clientX - offsetX, e.clientY - offsetY);
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingFromBall) {
            isDragging = false;
            isDraggingFromBall = false;
            ball.style.cursor = 'grab';
        }
    });

    // 触摸拖动
    ball.addEventListener('touchstart', (e) => {
        isDragging = true;
        isDraggingFromBall = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - ball.getBoundingClientRect().left;
        offsetY = touch.clientY - ball.getBoundingClientRect().top;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging || !isDraggingFromBall) return;
        const touch = e.touches[0];
        moveBall(touch.clientX - offsetX, touch.clientY - offsetY);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
        isDraggingFromBall = false;
    });
})();

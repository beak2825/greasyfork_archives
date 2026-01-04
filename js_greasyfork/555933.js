// ==UserScript==
// @name         全屏视频自动隐藏鼠标（通用版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在任何网站全屏播放视频时自动隐藏鼠标指针
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555933/%E5%85%A8%E5%B1%8F%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E9%BC%A0%E6%A0%87%EF%BC%88%E9%80%9A%E7%94%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555933/%E5%85%A8%E5%B1%8F%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E9%BC%A0%E6%A0%87%EF%BC%88%E9%80%9A%E7%94%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideTimer = null;
    let isFullscreen = false;

    // 创建样式来隐藏鼠标
    const style = document.createElement('style');
    style.textContent = `
        .hide-cursor,
        .hide-cursor * {
            cursor: none !important;
        }
    `;
    document.head.appendChild(style);

    // 隐藏鼠标的函数
    function hideCursor() {
        document.body.classList.add('hide-cursor');
    }

    // 显示鼠标的函数
    function showCursor() {
        document.body.classList.remove('hide-cursor');
    }

    // 鼠标移动时的处理
    function handleMouseMove() {
        if (!isFullscreen) return;

        showCursor();
        clearTimeout(hideTimer);

        // 3秒无操作后隐藏鼠标
        hideTimer = setTimeout(hideCursor, 3000);
    }

    // 监听全屏状态变化
    function handleFullscreenChange() {
        isFullscreen = !!(document.fullscreenElement ||
                         document.webkitFullscreenElement ||
                         document.mozFullScreenElement ||
                         document.msFullscreenElement);

        if (isFullscreen) {
            // 进入全屏，启动自动隐藏
            hideTimer = setTimeout(hideCursor, 3000);
        } else {
            // 退出全屏，清除定时器并显示鼠标
            clearTimeout(hideTimer);
            showCursor();
        }
    }

    // 添加事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    console.log('通用全屏自动隐藏鼠标脚本已加载 - 适用于所有网站');
})();
// ==UserScript==
// @name         星穹云游戏防离线
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  每5秒肉眼可见抖动鼠标，无页面提示，避免离线检测
// @author       You
// @match        https://sr.mihoyo.com/cloud/*
// @match        https://sr.mihoyo.com/cloud/#/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sr.mihoyo.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556151/%E6%98%9F%E7%A9%B9%E4%BA%91%E6%B8%B8%E6%88%8F%E9%98%B2%E7%A6%BB%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/556151/%E6%98%9F%E7%A9%B9%E4%BA%91%E6%B8%B8%E6%88%8F%E9%98%B2%E7%A6%BB%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 抖动间隔：5000毫秒（5秒），可按需修改
    const SHAKE_INTERVAL = 5000;
    // 抖动幅度：±8像素（肉眼可见，不会影响操作）
    const SHAKE_RANGE = 8;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // 生成随机偏移量
    function getRandomOffset() {
        return Math.floor(Math.random() * (SHAKE_RANGE * 2 + 1)) - SHAKE_RANGE;
    }

    // 核心抖动逻辑（适配游戏canvas）
    function shakeMouse() {
        // 基于上一次位置偏移，轨迹更自然
        lastX += getRandomOffset();
        lastY += getRandomOffset();
        // 优先获取游戏画布，确保事件被检测到
        const gameCanvas = document.querySelector('canvas') || document.body;

        // 构造真实鼠标移动事件
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: lastX,
            clientY: lastY,
            screenX: lastX + window.screenX,
            screenY: lastY + window.screenY,
            movementX: getRandomOffset(),
            movementY: getRandomOffset(),
            bubbles: true,
            cancelable: true,
            view: window,
            composed: true
        });

        gameCanvas.dispatchEvent(mouseEvent);
        console.log(`鼠标抖动：X=${lastX.toFixed(0)}, Y=${lastY.toFixed(0)}`);
    }

    // 延迟1.5秒启动，确保页面完全加载
    setTimeout(() => {
        setInterval(shakeMouse, SHAKE_INTERVAL);
        console.log('防离线脚本（无可视化+肉眼可见）已启动，每5秒抖动一次');
    }, 1500);
})();
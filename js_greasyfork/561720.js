// ==UserScript==
// @name         星穹云游戏防离线
// @namespace    starRailAwaysOnline
// @version      3.3
// @description  每10秒抖动鼠标，避免离线检测
// @author       You
// @match        https://sr.mihoyo.com/cloud/*
// @match        https://sr.mihoyo.com/cloud/#/*
// @license      MIT
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sr.mihoyo.com
// @downloadURL https://update.greasyfork.org/scripts/561720/%E6%98%9F%E7%A9%B9%E4%BA%91%E6%B8%B8%E6%88%8F%E9%98%B2%E7%A6%BB%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/561720/%E6%98%9F%E7%A9%B9%E4%BA%91%E6%B8%B8%E6%88%8F%E9%98%B2%E7%A6%BB%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 抖动间隔：10000毫秒（10秒）
    const SHAKE_INTERVAL = 10000;
    // 抖动幅度：±8像素（肉眼可见，不会影响操作）
    const SHAKE_RANGE = 8;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    // 生成随机偏移量
    function getRandomOffset() {
        return Math.floor(Math.random() * (SHAKE_RANGE * 2 + 1)) - SHAKE_RANGE;
    }

    // 核心抖动逻辑（适配星穹铁道云游戏的容器）
    function shakeMouse() {
        // 基于上一次位置偏移，轨迹更自然
        lastX += getRandomOffset();
        lastY += getRandomOffset();

        // 优先获取游戏容器（使用从HTML中提取的类名）
        const gameContainer = document.querySelector('.src-component-components-flexible-canvas-container__flexible-canvas-container--1Sogl') ||
                             document.querySelector('.flexible-canvas-container') ||
                             document.querySelector('.flexible-frame-to-layout') ||
                             document.querySelector('canvas') ||
                             document.body;

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

        gameContainer.dispatchEvent(mouseEvent);
        console.log(`鼠标抖动：X=${lastX.toFixed(0)}, Y=${lastY.toFixed(0)}`);
    }

    // 延迟1.5秒启动，确保页面完全加载
    setTimeout(() => {
        setInterval(shakeMouse, SHAKE_INTERVAL);
        console.log('防离线脚本已启动，每10秒抖动一次');
    }, 1500);
})();

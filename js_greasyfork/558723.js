// ==UserScript==
// @name         FA-Ruffle(Flash)大小调整
// @namespace    Lecrp.com
// @version      1.0
// @description  FA-调整Ruffle(Flash)内容为视口宽度，防止超出可见范围
// @author       jcjyids
// @match        https://www.furaffinity.net/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558723/FA-Ruffle%28Flash%29%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/558723/FA-Ruffle%28Flash%29%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_CONTAINER = '#columnpage > .submission-content';
    const MAX_WAIT_TIME = 3000; // 3秒监听窗口

    // 核心缩放函数
    function scaleRuffle(el) {
        const originalWidth = parseFloat(el.getAttribute('data-width'));
        const originalHeight = parseFloat(el.getAttribute('data-height'));

        if (originalWidth && originalHeight) {
            const viewportWidth = window.innerWidth;
            const ratio = viewportWidth / originalWidth;
            const targetHeight = Math.round(originalHeight * ratio);

            // 写入 HTML 属性
            el.setAttribute('width', `${viewportWidth}px`);
            el.setAttribute('height', `${targetHeight}px`);

            console.log(`[Ruffle-Resizer] 已缩放: ${viewportWidth}x${targetHeight}`);
            return true;
        }
        return false;
    }

    // 寻找并执行
    function tryScale() {
        const container = document.querySelector(TARGET_CONTAINER);
        if (!container) return false;

        const ruffleObj = container.querySelector('ruffle-object');
        // 必须存在 ruffle-object 且已有 data-width 属性
        if (ruffleObj && ruffleObj.hasAttribute('data-width')) {
            return scaleRuffle(ruffleObj);
        }
        return false;
    }

    // 1. 立即尝试一次（针对静态加载情况）
    if (tryScale()) return;

    // 2. 开启监听（针对动态加载情况）
    const observer = new MutationObserver((mutations, obs) => {
        if (tryScale()) {
            obs.disconnect(); // 命中后立即停止监听
            clearTimeout(timeoutId);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-width'] // 精准监听属性变化
    });

    // 3. 3秒超时自动停止
    const timeoutId = setTimeout(() => {
        observer.disconnect();
        console.log('[Ruffle-Resizer] 超过3秒未检测到目标，停止监听。');
    }, MAX_WAIT_TIME);

})();
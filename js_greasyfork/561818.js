// ==UserScript==
// @name         Page Zoom Controller
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  快速控制页面缩放：缩到最小/还原默认
// @author       onionycs
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561818/Page%20Zoom%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/561818/Page%20Zoom%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 缩放到最小（模拟持续按 Cmd+-/Ctrl+-）
    function zoomToMinimum() {
        // 浏览器最小缩放比例通常是 25%，循环减小直到达到最小值
        const minZoom = 0.25;
        let currentZoom = document.body.style.zoom || 1;

        // 方式1：直接设置到最小（高效）
        document.body.style.zoom = minZoom;

        // 方式2（备选）：模拟按键递减（和手动按Cmd+-效果一致）
        // while (parseFloat(currentZoom) > minZoom) {
        //     currentZoom = parseFloat(currentZoom) - 0.05;
        //     document.body.style.zoom = currentZoom.toFixed(2);
        // }

        alert(`页面已缩放到最小值：${minZoom * 100}%`);
    }

    // 2. 还原缩放（重置为100%）
    function resetZoom() {
        document.body.style.zoom = 1;
        alert(`页面缩放已还原：100%`);
    }

    // 注册油猴菜单项
    GM_registerMenuCommand("🔍 缩放到最小", zoomToMinimum);
    GM_registerMenuCommand("🔄 缩放还原", resetZoom);
})();
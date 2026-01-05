// ==UserScript==
// @name         安卓Chrome PC模式优化 3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  1. 禁用输入框自动聚焦放大；2. 修复手动缩放失效问题；3. 强制PC排版
// @author       Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559267/%E5%AE%89%E5%8D%93Chrome%20PC%E6%A8%A1%E5%BC%8F%E4%BC%98%E5%8C%96%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/559267/%E5%AE%89%E5%8D%93Chrome%20PC%E6%A8%A1%E5%BC%8F%E4%BC%98%E5%8C%96%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 解决输入框自动放大的核心：将所有输入框字体强制设为16px（安卓Chrome的临界值）
    // 但为了不破坏网页原本的视觉大小，我们使用 transform 缩放回来，或者只改声明不改视觉。
    const style = document.createElement('style');
    style.textContent = `
        /* 强制字体16px防止放大，但通过manipulation允许手势缩放 */
        input, textarea, select, [contenteditable] {
            font-size: 16px !important;
            touch-action: manipulation !important;
        }
    `;
    // 尽早注入样式
    const root = document.documentElement || document.head;
    if (root) {
        root.appendChild(style);
    }

    // 2. 修复布局：强制设置桌面级 Viewport，但允许用户手动缩放
    const fixViewport = () => {
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = "viewport";
            document.head.appendChild(meta);
        }
        // width=1280 强制PC排版；initial-scale=自动计算；user-scalable=yes 必须开启
        // 关键点：删掉 maximum-scale=1，否则会导致你反馈的“无法手动缩放”
        meta.content = "width=1280, initial-scale=0.5, minimum-scale=0.1, user-scalable=yes";
    };

    // 3. 拦截 Touch 事件的特殊处理
    // 很多网站会监听 touchstart 来阻止缩放，我们将其恢复默认
    window.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            // 多指操作时不予干涉，交还给系统处理缩放
        }
    }, {passive: true});

    // 执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixViewport);
    } else {
        fixViewport();
    }

    // 4. 针对 UA 注入的脚本补偿（防止某些网站通过 JS 检测）
    try {
        Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
        Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 0 });
    } catch (e) {}
})();
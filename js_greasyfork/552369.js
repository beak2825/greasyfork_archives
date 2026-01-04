// ==UserScript==
// @name         music.163.com add viewport
// @namespace    https://music.163.com/
// @version      1.1
// @description  为 music.163.com 添加<meta name="viewport" content="width=device-width, initial-scale=1.0">以改善移动设备显示
// @author       You
// @match        *://music.163.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552369/music163com%20add%20viewport.user.js
// @updateURL https://update.greasyfork.org/scripts/552369/music163com%20add%20viewport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertViewport() {
        if (!document || !document.head) return;
        // 检查是否已存在相同的 meta
        var existing = document.querySelector('meta[name="viewport"]');
        if (existing) {
            // 如果存在但内容不同，可替换或设置为期望值（这里替换为指定值）
            existing.setAttribute('content', 'width=device-width, initial-scale=1.0');
            return;
        }
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(meta);
    }

    // 如果在 document-start 阶段 head 可能还不存在，观察 DOM 直到 head 可用
    if (document.head) {
        insertViewport();
    } else {
        var obs = new MutationObserver(function(mutations, observer) {
            if (document.head) {
                observer.disconnect();
                insertViewport();
            }
        });
        obs.observe(document.documentElement || document, { childList: true, subtree: true });
        // 作为后备，页面加载后再尝试一次
        window.addEventListener('DOMContentLoaded', insertViewport, { once: true });
    }
})();

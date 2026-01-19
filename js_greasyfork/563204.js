// ==UserScript==
// @name         Block ALL images and videos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除页面上所有主流格式的图片、视频、画布及背景图
// @author       MINGDAY
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      WTFPLv2
// @downloadURL https://update.greasyfork.org/scripts/563204/Block%20ALL%20images%20and%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/563204/Block%20ALL%20images%20and%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义需要抹除的标签（包含 Reddit 特有的自定义标签）
    const targetTags = [
        'IMG', 'VIDEO', 'CANVAS', 'SVG', 'PICTURE', 'OBJECT', 'EMBED',
        'SHREDDIT-PLAYER', 'SHREDDIT-ASPECT-RATIO', 'FACEPLATE-IMG'
    ];

    // 2. 强力 CSS 预封锁（防止初次加载时的闪现）
    const css = `
        img, video, canvas, svg, picture, shreddit-player, shreddit-aspect-ratio, faceplate-img {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
        }
        * {
            background-image: none !important;
        }
    `;

    const injectStyle = () => {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    };

    // 3. 核心功能：移除元素并停止视频流
    const nukeElement = (el) => {
        if (targetTags.includes(el.tagName)) {
            // 如果是视频，先暂停并排空资源，防止后台消耗流量和声音
            if (el.tagName === 'VIDEO' || el.tagName === 'SHREDDIT-PLAYER') {
                if (typeof el.pause === 'function') el.pause();
                el.src = "";
                el.load();
            }
            el.remove();
        }
    };

    // 4. 实时观察器：应对 Reddit 的无限滚动和动态加载
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // 元素节点
                    // 检查自身
                    nukeElement(node);
                    // 检查子元素
                    node.querySelectorAll(targetTags.join(',')).forEach(nukeElement);
                }
            });
        });
    });

    // 5. 启动执行
    injectStyle();

    // 在文档开始加载后立即启动观察
    const startObserver = () => {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        // 先手动清理一遍已有的
        document.querySelectorAll(targetTags.join(',')).forEach(nukeElement);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

})();
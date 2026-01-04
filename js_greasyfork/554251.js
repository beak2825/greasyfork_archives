// ==UserScript==
// @name         解除原神千星奇域文本选中复制限制
// @namespace    https://github.com/Glume-9345
// @version      1.0.2
// @description  用于解决米游社中千星奇域的文档无法选中复制的问题
// @author       Glume_9345
// @match        *://act.mihoyo.com/*
// @match        *://webstatic.mihoyo.com/*
// @grant        none
// @run-at       document-start
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/554251/%E8%A7%A3%E9%99%A4%E5%8E%9F%E7%A5%9E%E5%8D%83%E6%98%9F%E5%A5%87%E5%9F%9F%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/554251/%E8%A7%A3%E9%99%A4%E5%8E%9F%E7%A5%9E%E5%8D%83%E6%98%9F%E5%A5%87%E5%9F%9F%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const forbid = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
            pointer-events: auto !important;
        }
    `;

    function injectCSS() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = forbid;
        document.head.appendChild(style);
    }

    function killEvents() {
        const tags = ['selectstart', 'copy', 'cut', 'paste', 'contextmenu', 'mousedown', 'mouseup'];
        tags.forEach(ev => {
            document.addEventListener(ev, e => e.stopPropagation(), true);
            document.addEventListener(ev, e => e.stopImmediatePropagation(), true);
        });
    }

    function stripNodeEvents(root) {
        if (!root) return;
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
        );
        let el;
        while (el = walker.nextNode()) {
            el.onselectstart = el.oncopy = el.onpaste = el.oncontextmenu = null;
            if (el.style) el.style.webkitUserSelect = 'text';
        }
    }

    /* 主逻辑 */
    injectCSS();
    killEvents();

    /* 等 DOM 好了再扫一遍，防止服务端渲染时锁 */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => stripNodeEvents(document.body));
    } else {
        stripNodeEvents(document.body);
    }

    /* 动态 SPA 页面后续再锁，也能秒破 */
    setInterval(() => stripNodeEvents(document.body), 500);
})();
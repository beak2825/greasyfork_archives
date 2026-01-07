// ==UserScript==
// @name         强制启用文字复制
// @namespace    https://viayoo.com/
// @version      1.0.0
// @description  在网页中强制允许选中和复制文字，适用于禁用复制的站点
// @author       Grok
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561700/%E5%BC%BA%E5%88%B6%E5%90%AF%E7%94%A8%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/561700/%E5%BC%BA%E5%88%B6%E5%90%AF%E7%94%A8%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 移除常见的复制禁用事件
    const disableEvents = ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart', 'mousedown', 'mouseup'];
    disableEvents.forEach(event => {
        document.addEventListener(event, e => {
            e.stopPropagation();
        }, true);
    });

    // 强制设置样式以允许选中
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        body {
            -webkit-touch-callout: default !important;
        }
    `;
    document.documentElement.appendChild(style);

    // 动态处理新添加的元素
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.style.userSelect = 'text';
                    node.style.webkitUserSelect = 'text';
                    node.style.mozUserSelect = 'text';
                    node.style.msUserSelect = 'text';
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
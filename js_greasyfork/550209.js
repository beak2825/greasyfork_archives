// ==UserScript==
// @name         移除极客时间文本选择工具栏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除极客时间文章页面选中文本后弹出的工具栏（荧光笔、直线、曲线、笔记等）
// @author       You
// @match        https://time.geekbang.org/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550209/%E7%A7%BB%E9%99%A4%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9%E5%B7%A5%E5%85%B7%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550209/%E7%A7%BB%E9%99%A4%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9%E5%B7%A5%E5%85%B7%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方法1：通过CSS隐藏工具栏
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏笔记菜单 */
        [class*="noteMenu_noteMenu"],
        [class*="noteDialog"],
        .noteMenu_noteMenu_zbKHG,
        div[class^="noteMenu_"],
        div[class*="_noteMenu_"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);

    // 方法2：监听DOM变化，移除工具栏元素
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 确保是元素节点
                    // 检查是否是工具栏元素
                    if (node.className && typeof node.className === 'string') {
                        if (node.className.includes('noteMenu') ||
                            node.className.includes('noteDialog') ||
                            node.className.includes('noteMenu_noteMenu')) {
                            node.remove();
                            console.log('已移除工具栏:', node.className);
                        }
                    }

                    // 检查子元素
                    const noteMenus = node.querySelectorAll('[class*="noteMenu"], [class*="noteDialog"]');
                    noteMenus.forEach(menu => {
                        menu.remove();
                        console.log('已移除子工具栏:', menu.className);
                    });
                }
            });
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 方法3：阻止选择事件的默认行为（可选，较激进）
    // 如果上述方法不够，可以取消下面的注释
    /*
    document.addEventListener('mouseup', function(e) {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            // 延迟一点时间再清理，让原始事件处理完
            setTimeout(() => {
                const menus = document.querySelectorAll('[class*="noteMenu"], [class*="noteDialog"]');
                menus.forEach(menu => menu.remove());
            }, 10);
        }
    }, true);
    */

    // 方法4：定期清理（备用方案）
    setInterval(() => {
        const menus = document.querySelectorAll('[class*="noteMenu"], [class*="noteDialog"]');
        if (menus.length > 0) {
            menus.forEach(menu => menu.remove());
        }
    }, 500);

    console.log('极客时间工具栏移除脚本已启动');
})();
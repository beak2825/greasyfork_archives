// ==UserScript==
// @name         解除网页右键屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除网页的右键菜单、复制、选择等限制
// @author       默默无名
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553304/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553304/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解除右键菜单限制
    document.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    // 解除选择文本限制
    document.addEventListener('selectstart', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    // 解除复制限制
    document.addEventListener('copy', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    // 解除剪切限制
    document.addEventListener('cut', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    // 解除粘贴限制
    document.addEventListener('paste', function(e) {
        e.stopPropagation();
        return true;
    }, true);

    // 解除键盘事件限制（只阻止网页的阻止行为，不影响正常快捷键）
    document.addEventListener('keydown', function(e) {
        // 只在事件被网页阻止时才介入
        if (e.defaultPrevented) {
            e.stopPropagation();
        }
    }, true);

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 移除所有阻止右键的内联事件
        document.body.oncontextmenu = null;
        document.body.onselectstart = null;
        document.body.oncopy = null;
        document.body.oncut = null;
        document.body.onpaste = null;

        // 移除所有元素的右键限制
        const allElements = document.querySelectorAll('*');
        allElements.forEach(function(element) {
            element.oncontextmenu = null;
            element.onselectstart = null;
            element.oncopy = null;
            element.oncut = null;
            element.onpaste = null;
        });

        // 恢复CSS样式限制
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ 右键限制已解除');
    });

    // 使用MutationObserver监听DOM变化，防止动态添加的限制
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 元素节点
                    node.oncontextmenu = null;
                    node.onselectstart = null;
                    node.oncopy = null;
                }
            });
        });
    });

    // 开始观察
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
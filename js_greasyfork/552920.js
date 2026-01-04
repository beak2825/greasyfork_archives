// ==UserScript==
// @name         移除微博热搜
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.2
// @description  隐藏网页微博上的热搜栏
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552920/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/552920/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在文档加载前就注入 CSS，确保元素一开始就不会显示
    const css = `
        .hotBand {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 使用 MutationObserver 在元素添加到 DOM 时立即处理
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 检查新添加的节点
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查当前节点
                        if (node.classList && node.classList.contains('hotBand')) {
                            hideElement(node);
                        }
                        // 检查子节点
                        const hotBandElements = node.querySelectorAll?.('.hotBand') || [];
                        hotBandElements.forEach(hideElement);
                    }
                });
            }
        });
    });

    // 彻底隐藏元素的函数
    function hideElement(element) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.width = '0';
        element.style.margin = '0';
        element.style.padding = '0';
        element.style.pointerEvents = 'none';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        
        // 尝试从父元素中移除（更彻底）
        if (element.parentNode) {
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 0);
        }
    }

    // 开始观察整个文档
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 定时检查兜底，处理特殊情况
    setInterval(() => {
        const hotBandElements = document.querySelectorAll('.hotBand');
        hotBandElements.forEach(hideElement);
    }, 1000);

    // 页面加载完成后也执行一次
    window.addEventListener('DOMContentLoaded', () => {
        const hotBandElements = document.querySelectorAll('.hotBand');
        hotBandElements.forEach(hideElement);
    });

    console.log('[Tampermonkey] 移除微博热搜 已加载');
})();
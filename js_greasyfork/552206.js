// ==UserScript==
// @name         去除吉利SRM4.0页面全屏水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  尝试移除吉利SRM4.0页面全屏水印
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552206/%E5%8E%BB%E9%99%A4%E5%90%89%E5%88%A9SRM40%E9%A1%B5%E9%9D%A2%E5%85%A8%E5%B1%8F%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552206/%E5%8E%BB%E9%99%A4%E5%90%89%E5%88%A9SRM40%E9%A1%B5%E9%9D%A2%E5%85%A8%E5%B1%8F%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方式1：通过CSS样式移除
    const removeByCss = () => {
        const style = document.createElement('style');
        style.textContent = `
            [class*="watermark"],
            [id*="watermark"] {
                display: none !important;
            }
            /* 添加更多可能的水印选择器 */
        `;
        document.head.appendChild(style);
    };

    // 方式2：直接删除DOM元素
    const removeElements = () => {
        const selectors = [
            'div.watermark',
            '[class*="watermark"]',
            '[id*="watermark"]',
            // 添加更多可能的选择器
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.parentNode.removeChild(el);
                console.log('已移除水印元素:', selector);
            });
        });
    };

    // 方式3：处理背景水印
    const removeBgWatermark = () => {
        document.querySelectorAll('*').forEach(el => {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (bg.includes('watermark')) {
                el.style.backgroundImage = 'none';
            }
        });
    };

    // 方式4：使用MutationObserver监听动态加载的水印
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && (
                    node.classList.contains('watermark') ||
                    node.id.includes('watermark')
                )) {
                    node.remove();
                    console.log('动态水印已被移除');
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 执行所有清除方法
    removeByCss();
    removeElements();
    removeBgWatermark();

    // 可选：阻止水印相关的网络请求
    if (typeof window.unsafeWindow === 'undefined') {
        window.unsafeWindow = window;
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.includes('watermark')) {
            console.log('已阻止水印请求:', url);
            return;
        }
        originalOpen.apply(this, arguments);
    };
})();
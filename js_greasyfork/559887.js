// ==UserScript==
// @name         智慧建业去水印+解除公文禁止复制功能20251223
// @match        *://zh.jianye.com.cn/*
// @run-at       document-start
// @version      1.0.0
// @namespace    http://tampermonkey.net/
// @description  移除水印并解除禁止复制限制
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559887/%E6%99%BA%E6%85%A7%E5%BB%BA%E4%B8%9A%E5%8E%BB%E6%B0%B4%E5%8D%B0%2B%E8%A7%A3%E9%99%A4%E5%85%AC%E6%96%87%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD20251223.user.js
// @updateURL https://update.greasyfork.org/scripts/559887/%E6%99%BA%E6%85%A7%E5%BB%BA%E4%B8%9A%E5%8E%BB%E6%B0%B4%E5%8D%B0%2B%E8%A7%A3%E9%99%A4%E5%85%AC%E6%96%87%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD20251223.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 添加CSS样式，允许选择和复制
    GM_addStyle(`
        * {
            user-select: auto !important;
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
        }

        body {
            -webkit-user-drag: auto !important;
        }

        .mask_div, #mask_div00, [class*="mask"], [id*="mask"] {
            display: none !important;
            pointer-events: none !important;
        }

        [style*="pointer-events: none"] {
            pointer-events: auto !important;
        }

        [style*="user-select: none"] {
            user-select: auto !important;
            -webkit-user-select: auto !important;
        }
    `);

    // 2. 解除复制限制的事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        // 移除复制相关的事件监听器
        ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                e.stopPropagation();
            }, true); // 使用捕获阶段，确保先执行

            // 重置事件处理函数
            document['on' + eventType] = null;
            window['on' + eventType] = null;
        });

        // 允许右键菜单
        document.oncontextmenu = function() { return true; };
        document.body.oncontextmenu = function() { return true; };

        // 允许选择文本
        document.onselectstart = function() { return true; };
        document.body.onselectstart = function() { return true; };
    });

    // 3. 移除水印并阻止重新创建
    function removeWatermarks() {
        // 通过多种选择器移除水印
        const selectors = [
            '#mask_div00',
            '.mask_div',
            '[class*="mask"]',
            '[id*="mask"]',
            '[style*="position: absolute"][style*="top: 0"]',
            '[style*="pointer-events: none"]',
            'div[style*="z-index"][style*="999"]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // 检查元素是否是水印
                if (isWatermarkElement(el)) {
                    el.remove();
                }
            });
        });
    }

    function isWatermarkElement(el) {
        const style = window.getComputedStyle(el);
        const text = el.textContent || '';

        // 水印的典型特征
        const watermarkIndicators = [
            style.pointerEvents === 'none',
            style.userSelect === 'none',
            el.classList.value.includes('mask'),
            el.id.includes('mask'),
            text.includes('水印') || text.includes('严禁复制') || text.includes('禁止复制'),
            style.opacity < 1 && style.opacity > 0.1,
            parseInt(style.zIndex) > 100
        ];

        return watermarkIndicators.some(indicator => indicator === true);
    }

    // 4. 使用MutationObserver监视DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeWatermarks();

                // 对新添加的节点解除复制限制
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        ['copy', 'cut', 'contextmenu', 'selectstart'].forEach(eventType => {
                            node.addEventListener(eventType, function(e) {
                                e.stopPropagation();
                            }, true);
                        });
                    }
                });
            }
        });
    });

    // 5. 初始化
    window.addEventListener('load', function() {
        removeWatermarks();

        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id', 'style']
        });

        // 延迟再次检查，确保所有元素都已加载
        setTimeout(removeWatermarks, 1000);
        setTimeout(removeWatermarks, 3000);
    });

    // 6. 重写可能阻止复制的方法
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // 过滤掉阻止复制的事件
        const blockedEvents = ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup'];
        if (blockedEvents.includes(type) &&
            listener.toString().includes('preventDefault') ||
            listener.toString().includes('return false')) {
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();
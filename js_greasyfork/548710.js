// ==UserScript==
// @name         芋道文档 VIP 阅读器 (Yudao VIP Reader)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动移除芋道文档(doc.iocoder.cn)的 VIP 弹窗遮罩，让你能正常阅读被遮挡的内容。
// @author       Your Name
// @match        *://*.iocoder.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548710/%E8%8A%8B%E9%81%93%E6%96%87%E6%A1%A3%20VIP%20%E9%98%85%E8%AF%BB%E5%99%A8%20%28Yudao%20VIP%20Reader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548710/%E8%8A%8B%E9%81%93%E6%96%87%E6%A1%A3%20VIP%20%E9%98%85%E8%AF%BB%E5%99%A8%20%28Yudao%20VIP%20Reader%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 核心思想：在网站自身的JS执行前，提前“缴械”它用来弹窗和替换内容的关键函数。
    // @run-at document-start 确保了我们的脚本优先执行。

    console.log('[Yudao Patcher] Script loaded and running...');

    const patchInterval = setInterval(() => {
        // 等待 jQuery 和 jqueryAlert 在页面上被定义
        // 因为网站是通过 <script> 标签加载这些库的，我们需要轮询检查
        if (typeof unsafeWindow.jQuery !== 'undefined' && typeof unsafeWindow.jqueryAlert !== 'undefined') {
            clearInterval(patchInterval); // 找到目标，停止轮询
            applyPatches();
        }
    }, 50); // 每 50ms 检查一次，速度很快

    // 设置一个超时，以防万一网站结构改变，导致找不到函数而无限循环
    setTimeout(() => {
        clearInterval(patchInterval);
    }, 5000); // 5秒后自动停止

    function applyPatches() {
        console.log('[Yudao Patcher] Found jQuery and jqueryAlert. Applying patches...');

        // 2. “缴械”弹窗函数：重写 jqueryAlert 为一个空壳
        // 这样，当网站脚本调用 jqueryAlert 时，什么都不会发生。
        unsafeWindow.jqueryAlert = function(options) {
            console.log('%c[Yudao Patcher] Blocked popup alert!', 'color: #E9405A; font-weight: bold;');
            // 返回一个包含 close 方法的空对象，防止原始代码调用 .close() 时报错
            return {
                close: function() {}
            };
        };

        // 3. “缴械”内容替换函数：包装 jQuery.prototype.html
        const originalHtml = unsafeWindow.jQuery.prototype.html;
        unsafeWindow.jQuery.prototype.html = function(content) {
            // 检查内容是否是那个“仅 VIP 可见”的红字
            if (typeof content === 'string' && content.includes('仅 VIP 可见')) {
                console.log('%c[Yudao Patcher] Blocked content replacement!', 'color: #E9405A; font-weight: bold;');
                return this; // 拒绝执行，并返回 this 以支持链式调用
            }
            // 如果是其他正常的.html()调用，则执行原始功能
            return originalHtml.apply(this, arguments);
        };

        // 4. 最后一道保险：移除body的overflow:hidden，确保页面可以滚动
        // 尽管缴械了jqueryAlert，但以防万一有其他脚本锁定了滚动
        const bodyObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'style' && document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = 'auto';
                    console.log('[Yudao Patcher] Force-unlocked body scroll.');
                }
            });
        });

        document.body.style.overflow = 'auto'; // 立即解锁一次
        bodyObserver.observe(document.body, { attributes: true }); // 持续监控
    }
})();
// ==UserScript==
// @name         解除网页复制限制 
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  解除网页的禁止复制、禁止选中文本、禁止右键菜单限制。基于原“页面限制解除”脚本提取。
// @author       zskfree 
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563315/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/563315/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TAG = '[Copy-Unlock]';
    const win = unsafeWindow || window;
    const doc = win.document;

    // ============ 配置模块 ============
    // 定义需要解锁的事件类型
    const BLOCKED_EVENTS = [
        'copy',          // 复制
        'cut',           // 剪切
        'paste',         // 粘贴
        'contextmenu',   // 右键菜单
        'selectstart',   // 开始选择
        'dragstart',     // 拖拽
        'mousedown',     // 某些网站通过此事件限制选择
        'mouseup'
    ];

    // ============ CSS 强制选择模块 ============
    // 通过 CSS 强制允许用户选中文字
    const injectStyle = () => {
        try {
            // user-select: text 强制允许选择
            // pointer-events: auto 恢复鼠标事件响应
            GM_addStyle(`
                * {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    user-select: text !important;
                    -webkit-user-drag: auto !important;
                }
            `);
            console.log(`${TAG} CSS 文本选择样式已注入。`);
        } catch (e) {
            console.error(`${TAG} CSS 注入失败:`, e);
        }
    };

    // ============ 事件监听拦截模块 ============
    // 核心逻辑：劫持 addEventListener，阻止网站添加针对 BLOCKED_EVENTS 的监听器
    const interceptEventListeners = () => {
        const originalAddEventListener = win.EventTarget.prototype.addEventListener;

        win.EventTarget.prototype.addEventListener = function (type, listener, options) {
            const lowerType = String(type).toLowerCase();

            // 如果网站试图监听被禁止的事件（例如监听 'copy' 来阻止复制），则拦截该操作
            if (BLOCKED_EVENTS.includes(lowerType)) {
                // 仅为了调试，可以打印拦截日志
                // console.log(`${TAG} 已拦截事件监听: ${type} (目标: ${this.tagName || 'window'})`);
                return; // 直接返回，不执行原有的添加监听操作
            }

            // 正常事件放行
            return originalAddEventListener.call(this, type, listener, options);
        };
        console.log(`${TAG} 事件监听拦截器已启动。`);
    };

    // ============ On-Event 属性清理模块 ============
    // 清除标签内联的限制，例如 <body oncopy="return false">
    const clearInlineEvents = () => {
        const eventsToClear = BLOCKED_EVENTS.map(e => 'on' + e);

        const clear = (target) => {
            if (!target) return;
            eventsToClear.forEach(eventName => {
                if (target[eventName]) {
                    target[eventName] = null;
                }
                // 某些网站使用 setAttribute 设置
                if (target.hasAttribute && target.hasAttribute(eventName)) {
                    target.removeAttribute(eventName);
                }
            });
        };

        // 立即清理 document 和 body
        clear(doc);
        clear(doc.body);

        // 使用 MutationObserver 监听动态插入的元素
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        clear(node);
                    }
                });
            });
        });

        // 开始监听
        const startObserving = () => {
            if (doc.body) {
                observer.observe(doc.body, { childList: true, subtree: true });
                clear(doc.body); // 再次清理确保万一
            }
        };

        if (doc.body) {
            startObserving();
        } else {
            doc.addEventListener('DOMContentLoaded', startObserving, { once: true });
        }
    };

    // ============ 辅助：阻止事件冒泡 (Capture Phase) ============
    // 在捕获阶段阻止网站已有的处理逻辑（作为双重保险）
    const stopPropagationStrategies = () => {
        BLOCKED_EVENTS.forEach(eventType => {
            win.addEventListener(eventType, (e) => {
                e.stopPropagation(); // 阻止冒泡，防止被网站的顶层监听器捕获并阻止默认行为
            }, true); // useCapture = true
        });
    };

    // ============ 初始化 ============
    const init = () => {
        injectStyle();
        interceptEventListeners();
        clearInlineEvents();
        stopPropagationStrategies();
    };

    init();

})();
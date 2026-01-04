// ==UserScript==
// @name         页面限制解除 (可见性/焦点/复制/右键/调试)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  使页面始终“可见”和“激活”，解除复制和右键限制，允许打开开发者工具。可用于绕过在线考试、文档网站的各种限制。通过MutationObserver适配动态加载内容的页面。
// @author       zskfree
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550564/%E9%A1%B5%E9%9D%A2%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%20%28%E5%8F%AF%E8%A7%81%E6%80%A7%E7%84%A6%E7%82%B9%E5%A4%8D%E5%88%B6%E5%8F%B3%E9%94%AE%E8%B0%83%E8%AF%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550564/%E9%A1%B5%E9%9D%A2%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%20%28%E5%8F%AF%E8%A7%81%E6%80%A7%E7%84%A6%E7%82%B9%E5%A4%8D%E5%88%B6%E5%8F%B3%E9%94%AE%E8%B0%83%E8%AF%95%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TAG = '[Bypass]';
    const win = unsafeWindow;
    const doc = win.document;

    // ============ 配置模块 ============
    const CONFIG = {
        // 需要阻止的事件类型
        blockedEvents: ['visibilitychange', 'webkitvisibilitychange', 'contextmenu', 'selectstart', 'copy', 'cut', 'paste', 'dragstart'],
        // 需要智能处理的事件（不完全阻止）
        conditionalEvents: ['blur', 'focusout', 'mouseleave', 'beforeunload', 'keydown', 'keyup'],
        // 需要清理的 on-event 属性
        onEventsToClear: ['oncontextmenu', 'onselectstart', 'oncopy', 'oncut', 'onpaste', 'ondragstart'],
        // 白名单：不处理这些标签的 blur/focusout 事件（避免影响表单验证）
        formElements: ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'FORM']
    };

    // ============ 工具函数模块 ============
    const Utils = {
        log: (msg, ...args) => console.info(`${TAG} ${msg}`, ...args),
        warn: (msg, ...args) => console.warn(`${TAG} ${msg}`, ...args),
        error: (msg, ...args) => console.error(`${TAG} ${msg}`, ...args),

        // 检查元素是否为表单相关元素
        isFormElement: (target) => {
            if (!target || !target.tagName) return false;
            return CONFIG.formElements.includes(target.tagName);
        },

        // 检查事件是否应该被阻止
        shouldBlockEvent: (type, target) => {
            const lowerType = String(type).toLowerCase();

            // 完全阻止的事件
            if (CONFIG.blockedEvents.includes(lowerType)) return true;

            // blur/focusout：如果是表单元素，允许触发（用于表单验证）
            if ((lowerType === 'blur' || lowerType === 'focusout') && Utils.isFormElement(target)) {
                return false;
            }

            // mouseleave：如果是表单元素，允许触发
            if (lowerType === 'mouseleave' && Utils.isFormElement(target)) {
                return false;
            }

            // beforeunload：检查是否有真正的表单修改
            if (lowerType === 'beforeunload') {
                return !Utils.hasFormChanges();
            }

            return false;
        },

        // 检查页面是否有未保存的表单更改
        hasFormChanges: () => {
            try {
                const forms = doc.querySelectorAll('form');
                for (const form of forms) {
                    const inputs = form.querySelectorAll('input, textarea, select');
                    for (const input of inputs) {
                        if (input.value && input.value !== input.defaultValue) {
                            return true;
                        }
                    }
                }
            } catch (e) { }
            return false;
        }
    };

    // ============ CSS 强制选择模块 ============
    const StyleModule = {
        init: () => {
            try {
                GM_addStyle(`* { user-select: text !important; -webkit-user-select: text !important; }`);
                Utils.log('CSS 文本选择已启用。');
            } catch (e) {
                Utils.error('CSS 注入失败:', e);
            }
        }
    };

    // ============ 页面可见性 API 劫持模块 ============
    const VisibilityModule = {
        init: () => {
            try {
                Object.defineProperties(doc, {
                    'visibilityState': { value: 'visible', configurable: true },
                    'hidden': { value: false, configurable: true },
                    'webkitVisibilityState': { value: 'visible', configurable: true },
                    'webkitHidden': { value: false, configurable: true },
                });
                Utils.log('页面可见性 API 已劫持。');
            } catch (e) {
                Utils.error('劫持可见性 API 失败:', e);
            }
        }
    };

    // ============ 事件监听拦截模块 ============
    const EventModule = {
        originalAddEventListener: win.EventTarget.prototype.addEventListener,

        init: () => {
            win.EventTarget.prototype.addEventListener = EventModule.interceptedAddEventListener;
            Utils.log('事件监听拦截已激活。');
        },

        interceptedAddEventListener: function (type, listener, options) {
            const lowerType = String(type).toLowerCase();

            // 检查是否应该阻止此事件
            if (Utils.shouldBlockEvent(type, this)) {
                Utils.log(`已阻止事件监听: ${type} (目标: ${this.tagName || 'window'})`);
                return;
            }

            // 对 keydown/keyup 进行特殊处理（允许开发者工具快捷键）
            if (lowerType === 'keydown' || lowerType === 'keyup') {
                const wrappedListener = function (event) {
                    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key?.toUpperCase()))) {
                        Utils.warn('已阻止禁用开发者工具的键盘事件。');
                        event.stopImmediatePropagation();
                        return false;
                    }
                    return listener.apply(this, arguments);
                };
                return EventModule.originalAddEventListener.call(this, type, wrappedListener, options);
            }

            return EventModule.originalAddEventListener.call(this, type, listener, options);
        }
    };

    // ============ On-Event 属性清理模块 ============
    const OnEventModule = {
        init: () => {
            OnEventModule.clearOnEvents(win);
            OnEventModule.clearOnEvents(doc);
            if (doc.body) OnEventModule.clearOnEvents(doc.body);

            // 监听动态添加的元素
            OnEventModule.observeDynamicElements();
            Utils.log('On-Event 属性清理已启用。');
        },

        clearOnEvents: (target) => {
            if (!target) return;
            CONFIG.onEventsToClear.forEach(eventName => {
                try {
                    if (typeof target[eventName] === 'function') {
                        target[eventName] = null;
                    }
                } catch (e) { }
            });
        },

        observeDynamicElements: () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && !Utils.isFormElement(node)) {
                            OnEventModule.clearOnEvents(node);
                        }
                    });
                });
            });

            const startObserving = () => observer.observe(doc, { childList: true, subtree: true });
            doc.body ? startObserving() : doc.addEventListener('DOMContentLoaded', startObserving, { once: true });
        }
    };

    // ============ Window 方法覆盖模块 ============
    const WindowModule = {
        init: () => {
            try {
                const noop = () => Utils.log('已阻止 window.blur() 调用。');
                win.blur = noop;
                // 不覆盖 focus，避免影响正常的焦点管理
            } catch (e) {
                Utils.error('覆盖 window 方法失败:', e);
            }
        }
    };

    // ============ 主初始化 ============
    const init = () => {
        StyleModule.init();
        VisibilityModule.init();
        EventModule.init();
        OnEventModule.init();
        WindowModule.init();
        Utils.log('脚本已完全激活。');
    };

    init();
})();
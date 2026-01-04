// ==UserScript==
// @name         通用阻止切屏检测
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  尝试阻止各类网站的切屏、焦点丢失等检测
// @author       114514
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/549967/%E9%80%9A%E7%94%A8%E9%98%BB%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549967/%E9%80%9A%E7%94%A8%E9%98%BB%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const window = unsafeWindow; // 使用原始 window 对象

    // 黑名单事件，这些事件的监听器将被阻止
    const blackListedEvents = new Set([
        "visibilitychange", // 页面可见性改变
        "blur",             // 元素或窗口失去焦点
        "focus",            // 元素或窗口获得焦点 (某些检测可能反向利用focus)
        "pagehide",         // 页面隐藏（例如导航到其他页面）
        "freeze",           // 页面被冻结 (较新的事件)
        "resume",           // 页面从冻结状态恢复 (较新的事件)
        "mouseleave",       // 鼠标移出元素（通常是 document 或 body）
        "mouseout",         // 鼠标移出元素（更通用的移出，但要小心副作用）
        // "focusout",      // 元素将要失去焦点（与blur类似，但更通用，看情况添加）
        // "focusin",       // 元素将要获得焦点（与focus类似，看情况添加）
    ]);

    // 白名单属性，这些属性在 document 对象上将被伪造
    const spoofedDocumentProperties = {
        hidden: { value: false, configurable: true },
        mozHidden: { value: false, configurable: true }, // Firefox (旧版)
        msHidden: { value: false, configurable: true },  // Internet Explorer
        webkitHidden: { value: false, configurable: true }, // Chrome, Safari, Opera (旧版 Blink/WebKit)
        visibilityState: { value: "visible", configurable: true },
        hasFocus: { value: () => true, configurable: true }
    };

    // 需要清空/置空的事件处理器属性 (on-event handlers)
    const eventHandlersToNullifyDocument = [
        "onvisibilitychange",
        "onblur",
        "onfocus",
        "onmouseleave",
        "onmouseout",
        // "onfocusout",
        // "onfocusin",
        "onpagehide",
        "onfreeze",
        "onresume"
    ];

    const eventHandlersToNullifyWindow = [
        "onblur",
        "onfocus",
        "onpagehide",
        "onpageshow", // 有些检测可能通过 pageshow 结合 persisted 属性判断
        "onfreeze",
        "onresume",
        "onmouseleave", // window 也有 onmouseleave
        "onmouseout"
    ];

    const isDebug = false; // 设置为 true 以启用调试日志
    const scriptPrefix = "[通用阻止切屏检测]";
    const log = console.log.bind(console, `%c${scriptPrefix}`, 'color: #4CAF50; font-weight: bold;');
    const warn = console.warn.bind(console, `%c${scriptPrefix}`, 'color: #FFC107; font-weight: bold;');
    const error = console.error.bind(console, `%c${scriptPrefix}`, 'color: #F44336; font-weight: bold;');
    const debug = isDebug ? log : () => { };

    /**
     * 伪装函数的 toString 方法，使其看起来像原始函数。
     * @param {Function} modifiedFunction 被修改的函数
     * @param {Function} originalFunction 原始函数
     */
    function patchToString(modifiedFunction, originalFunction) {
        if (typeof modifiedFunction !== 'function' || typeof originalFunction !== 'function') {
            warn("patchToString: 传入的参数不是函数。", modifiedFunction, originalFunction);
            return;
        }
        try {
            const originalToStringSource = Function.prototype.toString.call(originalFunction);
            modifiedFunction.toString = () => originalToStringSource;

            // 进一步伪装 toString.toString
            const originalToStringToStringSource = Function.prototype.toString.call(originalFunction.toString);
            Object.defineProperty(modifiedFunction.toString, 'toString', {
                value: () => originalToStringToStringSource,
                enumerable: false,
                configurable: true, // 保持可配置，以防万一
                writable: false
            });
            debug(`patchToString applied for: ${originalFunction.name || 'anonymous function'}`);
        } catch (e) {
            error("patchToString failed:", e, "for function:", originalFunction.name);
        }
    }


    /**
     * 劫持并修改对象的 addEventListener 方法。
     * @param {EventTarget} targetObject 要劫持的对象 (window, document, Element)
     * @param {string} objectName 用于日志记录的对象名称
     */
    function patchAddEventListener(targetObject, objectName) {
        if (!targetObject || typeof targetObject.addEventListener !== 'function') {
            warn(`Cannot patch addEventListener for invalid target: ${objectName}`);
            return;
        }
        const originalAddEventListener = targetObject.addEventListener;

        targetObject.addEventListener = function (type, listener, optionsOrCapture) {
            if (blackListedEvents.has(type.toLowerCase())) {
                log(`BLOCKED ${objectName}.addEventListener: ${type}`);
                return undefined; // 阻止添加黑名单中的事件监听器
            }
            debug(`ALLOWED ${objectName}.addEventListener: ${type}`, listener, optionsOrCapture);
            return originalAddEventListener.call(this, type, listener, optionsOrCapture);
        };

        patchToString(targetObject.addEventListener, originalAddEventListener);
        log(`${objectName}.addEventListener patched.`);
    }

    /**
     * 劫持并修改对象的 removeEventListener 方法 (可选，但建议一起修改)。
     * @param {EventTarget} targetObject 要劫持的对象
     * @param {string} objectName 用于日志记录的对象名称
     */
    function patchRemoveEventListener(targetObject, objectName) {
        if (!targetObject || typeof targetObject.removeEventListener !== 'function') {
            warn(`Cannot patch removeEventListener for invalid target: ${objectName}`);
            return;
        }
        const originalRemoveEventListener = targetObject.removeEventListener;

        targetObject.removeEventListener = function (type, listener, optionsOrCapture) {
            if (blackListedEvents.has(type.toLowerCase())) {
                log(`Original call to ${objectName}.removeEventListener for blacklisted event '${type}' would have been ignored by our addEventListener patch anyway. Allowing native call if needed.`);
                // 即使我们阻止了 addEventListener，原始的 removeEventListener 仍然应该能安全调用
                // 因为如果监听器从未被添加，调用 remove 也无害。
            }
            debug(`PASSTHROUGH ${objectName}.removeEventListener: ${type}`, listener, optionsOrCapture);
            return originalRemoveEventListener.call(this, type, listener, optionsOrCapture);
        };
        patchToString(targetObject.removeEventListener, originalRemoveEventListener);
        log(`${objectName}.removeEventListener patched.`);
    }


    /**
     * 修改对象上的属性，使其返回伪造的值。
     * @param {object} targetObject 目标对象 (e.g., document)
     * @param {object} propertiesToSpoof 属性描述对象
     * @param {string} objectName 对象名称
     */
    function spoofProperties(targetObject, propertiesToSpoof, objectName) {
        if (!targetObject) {
            warn(`Cannot spoof properties for invalid target: ${objectName}`);
            return;
        }
        for (const prop in propertiesToSpoof) {
            if (Object.prototype.hasOwnProperty.call(propertiesToSpoof, prop)) {
                try {
                    Object.defineProperty(targetObject, prop, propertiesToSpoof[prop]);
                    debug(`Spoofed ${objectName}.${prop}`);
                } catch (e) {
                    error(`Failed to spoof ${objectName}.${prop}:`, e);
                }
            }
        }
        log(`${objectName} properties spoofed.`);
    }

    /**
     * 清空或置空对象上的事件处理器属性。
     * @param {object} targetObject 目标对象
     * @param {string[]} eventHandlerNames 事件处理器名称数组
     * @param {string} objectName 对象名称
     */
    function nullifyEventHandlers(targetObject, eventHandlerNames, objectName) {
        if (!targetObject) {
            warn(`Cannot nullify event handlers for invalid target: ${objectName}`);
            return;
        }
        eventHandlerNames.forEach(handlerName => {
            try {
                Object.defineProperty(targetObject, handlerName, {
                    get: () => {
                        debug(`Access to ${objectName}.${handlerName} (get), returning undefined.`);
                        return undefined;
                    },
                    set: (newHandler) => {
                        log(`Attempt to set ${objectName}.${handlerName} blocked.`);
                        if (typeof newHandler === 'function') {
                             // 可以选择性地调用 newHandler，或者完全阻止
                             // debug(`(Blocked) Handler function was:`, newHandler);
                        }
                    },
                    configurable: true // 保持可配置，以便脚本可以多次运行或被其他脚本修改
                });
                debug(`Nullified ${objectName}.${handlerName}`);
            } catch (e) {
                error(`Failed to nullify ${objectName}.${handlerName}:`, e);
            }
        });
        log(`${objectName} on-event handlers nullified.`);
    }

    // --- 开始执行 ---

    log("Script starting...");

    // 1. 劫持 window 和 document 的 addEventListener/removeEventListener
    patchAddEventListener(window, "window");
    patchRemoveEventListener(window, "window"); // 也 patch removeEventListener 以保持一致性
    patchAddEventListener(document, "document");
    patchRemoveEventListener(document, "document");

    // 2. 修改 document 的属性
    spoofProperties(document, spoofedDocumentProperties, "document");

    // 3. 置空 document 和 window 上的事件处理器
    nullifyEventHandlers(document, eventHandlersToNullifyDocument, "document");
    nullifyEventHandlers(window, eventHandlersToNullifyWindow, "window");

    // 4. 对于 document.body，需要等待 DOMContentLoaded
    // 使用 MutationObserver 确保 body 存在时立即 patch，比 DOMContentLoaded 更早且更可靠
    const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
            patchAddEventListener(document.body, "document.body");
            patchRemoveEventListener(document.body, "document.body");
            // 对于 document.body，也可以考虑 nullify onmouseleave, onmouseout 等
            nullifyEventHandlers(document.body, ["onmouseleave", "onmouseout", "onblur", "onfocus"], "document.body");
            log("document.body patched via MutationObserver.");
            obs.disconnect(); // 完成任务后断开观察者
        }
    });

    if (document.body) { // 如果 body 已经存在 (不太可能在 document-start，但以防万一)
        patchAddEventListener(document.body, "document.body");
        patchRemoveEventListener(document.body, "document.body");
        nullifyEventHandlers(document.body, ["onmouseleave", "onmouseout", "onblur", "onfocus"], "document.body");
        log("document.body patched directly.");
    } else {
        observer.observe(document.documentElement || document, { childList: true, subtree: true });
    }


    // 5. 调试：劫持计时器 (如果 isDebug 为 true)
    if (isDebug) {
        const originalSetInterval = window.setInterval;
        window.setInterval = function(...args) {
            const id = originalSetInterval.apply(this, args);
            debug("calling window.setInterval", id, args);
            return id;
        };
        patchToString(window.setInterval, originalSetInterval);

        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(...args) {
            const id = originalSetTimeout.apply(this, args);
            debug("calling window.setTimeout", id, args);
            return id;
        };
        patchToString(window.setTimeout, originalSetTimeout);
        log("Timer functions (setInterval, setTimeout) wrapped for debugging.");
    }

    log("Script execution finished. Monitoring active.");

})();
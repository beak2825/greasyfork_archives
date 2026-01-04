// ==UserScript==
// @name         解锁网页复制/粘贴/右键/切屏限制💉
// @namespace    https://greasyfork.org/zh-CN/users/1534803-ookamiame
// @version      1.0.2
// @description  移除网页对复制、粘贴、右键、选中、切屏检测（onblur / visibilitychange）的限制，支持 iframe 与 Shadow DOM 深层拦截。
// @author       狼小雨
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555006/%E8%A7%A3%E9%94%81%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8F%B3%E9%94%AE%E5%88%87%E5%B1%8F%E9%99%90%E5%88%B6%F0%9F%92%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555006/%E8%A7%A3%E9%94%81%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8F%B3%E9%94%AE%E5%88%87%E5%B1%8F%E9%99%90%E5%88%B6%F0%9F%92%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //防重复执行标记
    if (window.__UNLOCK_SCRIPT_LOADED__) return;
    window.__UNLOCK_SCRIPT_LOADED__ = true;

    /** =======================================================
     *   通用工具函数：移除指定事件的内联绑定
     * ======================================================= */
    function removeInlineHandlers(events = ['copy', 'contextmenu'], root = document) {
        try {
            const all = root.querySelectorAll('*');
            const targets = Array.prototype.concat.call(all, root);
            targets.forEach(el => {
                for (const ev of events) {
                    const attr = 'on' + ev;
                    if (el[attr]) {
                        el[attr] = null;
                        console.log(`[Cleaner] 移除 ${attr} 绑定于:`, el);
                    }
                }
            });
        } catch (err) {
            console.warn('[Cleaner] 清理事件时发生异常:', err);
        }
    }

    /** =======================================================
     *   屏蔽事件类型（复制、粘贴、右键、切屏等）
     * ======================================================= */
    const blockEvents = new Set([
        'copy', 'cut', 'paste', 'selectstart', 'contextmenu',
        'dragstart', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress',
        'blur', 'focus', 'visibilitychange',
        'mouseleave', 'mouseout', 'pagehide', 'beforeunload', 'unload'
    ]);

    /** =======================================================
     *   Hook 全局焦点与可见性检测
     * ======================================================= */
    function hookGlobalFocus() {
        if (window.__FOCUS_HOOKED__) return;
        window.__FOCUS_HOOKED__ = true;

        // 工具函数：安全重定义属性
        function redefine(obj, key, getter, setter) {
            try {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: true,
                    get: getter,
                    set: setter || (() => {}),
                });
            } catch (e) {
                console.log(`[Hook] 无法定义属性 ${key}:`, e);
            }
        }

        // Hook window.onblur
        let customOnBlur = () =>
            redefine(window, 'onblur',
                () => customOnBlur,
                (v) => {
                    if (typeof v === 'function') {
                        console.log('[Hook] 阻止网页覆盖 window.onblur');
                        return;
                    }
                    if (v == null) customOnBlur = null;
                });

        // Hook window.addEventListener
        const _addEventListener = window.addEventListener;
        window.addEventListener = function (type, listener, options) {
            if (blockEvents.has(type)) {
                console.log('[Hook] 阻止添加事件:', type);
                return;
            }
            return _addEventListener.call(this, type, listener, options);
        };

        // Hook document.onvisibilitychange
        let customVisibility = () =>
            redefine(document, 'onvisibilitychange',
                () => customVisibility,
                (v) => {
                    if (typeof v === 'function') {
                        console.log('[Hook] 阻止网页覆盖 document.onvisibilitychange');
                        return;
                    }
                    if (v == null) customVisibility = null;
                });

        // 页面始终处于前台聚焦状态
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
        document.hasFocus = () => true;
    }

    /** =======================================================
     *   解锁网页交互限制
     * ======================================================= */
    function unlockPageRestrictions(root = document) {
        if (!root || root.__UNLOCKED__) return;
        root.__UNLOCKED__ = true;

        // 阻止限制事件冒泡
        blockEvents.forEach(event => {
            root.addEventListener(event, e => e.stopPropagation(), true);
        });

        // 遍历元素解除事件绑定与样式限制
        const all = root.querySelectorAll('*');
        all.forEach(el => {
            ['oncopy','oncut','onpaste','onselectstart','oncontextmenu',
             'ondragstart','onmousedown','onmouseup','onkeydown','onkeypress']
                .forEach(attr => {
                    if (el[attr]) el[attr] = null;
                });

            // 恢复用户选择样式
            const style = getComputedStyle(el);
            if (style.userSelect === 'none') {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
                el.style.msUserSelect = 'text';
                el.style.mozUserSelect = 'text';
            }
        });

        // 全局解除焦点限制
        window.onblur = window.onfocus = document.onvisibilitychange = null;
        document.onkeydown = document.oncontextmenu = null;
    }

    /** =======================================================
     *   深层处理 iframe 与 Shadow DOM
     * ======================================================= */
    function deepUnlock(root = document) {
        unlockPageRestrictions(root);
        removeInlineHandlers(['copy', 'contextmenu', 'paste', 'cut'], root);

        // iframe
        root.querySelectorAll('iframe').forEach(iframe => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc && !doc.__UNLOCKED__) deepUnlock(doc);
            } catch (e) {
                console.log('跨域 iframe 无法访问:', e);
            }
        });

        // shadow DOM
        const traverse = node => {
            if (!node) return;
            if (node.shadowRoot && !node.shadowRoot.__UNLOCKED__) deepUnlock(node.shadowRoot);
            node.childNodes.forEach(traverse);
        };
        traverse(root.body || root);
    }

    /** =======================================================
     *   Hook SPA 路由（React/Vue/Angular）
     * ======================================================= */
    function hookSPARouter() {
        if (window.__SPA_HOOKED__) return;
        window.__SPA_HOOKED__ = true;

        const _pushState = history.pushState;
        const _replaceState = history.replaceState;

        function handleRouteChange() {
            console.log('检测到 SPA 路由切换，重新解锁');
            setTimeout(() => deepUnlock(document), 500);
        }

        history.pushState = function (...args) {
            const res = _pushState.apply(this, args);
            handleRouteChange();
            return res;
        };

        history.replaceState = function (...args) {
            const res = _replaceState.apply(this, args);
            handleRouteChange();
            return res;
        };

        window.addEventListener('popstate', handleRouteChange);
    }

    /** =======================================================
     *  Hook 全屏检测（防止检测退出全屏）
     * ======================================================= */
 /*   function hookFullScreen() {
        const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];
        events.forEach(event => {
            document.addEventListener(event, e => {
                e.stopPropagation();
                e.stopImmediatePropagation?.();
                console.log('[Hook] 阻止全屏检测事件:', event);
            }, true);
        });

        Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => document.body });
        Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, get: () => true });

        const noop = () => { console.log('[Hook] 阻止 exit/requestFullscreen'); return Promise.resolve(); };
        if (document.exitFullscreen) document.exitFullscreen = noop;
        const proto = Element.prototype;
        ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'].forEach(fn => {
            if (proto[fn]) proto[fn] = noop;
        });
    }*/

    /** =======================================================
     *   初始化执行
     * ======================================================= */
    function init() {
        hookGlobalFocus();
        hookSPARouter();
     //   hookFullScreen();
        deepUnlock(document);

        // 添加辅助样式恢复选择功能
        const style = document.createElement('style');
        style.textContent = `
            body *:not(input):not(textarea) {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
            }`;
        document.documentElement.appendChild(style);
    }

    // 初始化触发
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // DOM 变化监控（持续防御动态绑定）
    const observer = new MutationObserver(() => {
        requestIdleCallback(() => deepUnlock(document));
    });
    observer.observe(document, { childList: true, subtree: true });

    // 监听键盘与右键事件触发强制清理
    window.addEventListener('contextmenu', () => removeInlineHandlers(['copy', 'contextmenu']));
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) removeInlineHandlers(['copy', 'contextmenu']);
    });

})();

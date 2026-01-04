// ==UserScript==
// @name         Bilibili Live - Prevent Tab/Browser Detection
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  尝试阻止Bilibili直播页面检测浏览器标签页切换或页面离开。
// @author       ChatGPT
// @match        https://live.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552367/Bilibili%20Live%20-%20Prevent%20TabBrowser%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/552367/Bilibili%20Live%20-%20Prevent%20TabBrowser%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Bilibili Live Detection Blocker] Script initialized.");

    // --- 策略 1: 劫持 document.hidden 和 document.visibilityState ---
    // 这个策略对于很多网站的隐藏/可见性检测非常有效
    try {
        Object.defineProperty(document, 'hidden', {
            get: function() { return false; },
            configurable: true // 允许重新定义
        });
        Object.defineProperty(document, 'visibilityState', {
            get: function() { return 'visible'; },
            configurable: true // 允许重新定义
        });
        console.log("[Bilibili Live Detection Blocker] document.hidden and visibilityState spoofed.");
    } catch (e) {
        console.error("[Bilibili Live Detection Blocker] Failed to spoof document.hidden/visibilityState:", e);
    }

    // --- 策略 2: 阻止 visibilitychange 事件触发 ---
    // 通过阻止事件冒泡和默认行为的封装函数
    const preventEvent = (eventType) => {
        // 使用 addEventListener 的 UseCapture = true (捕获阶段) 更早地拦截事件
        window.addEventListener(eventType, function(e) {
            e.stopImmediatePropagation(); // 阻止同类型事件的后续监听器被调用
            // e.preventDefault(); // 对于一些可取消的事件，可以阻止其默认行为，但对于 visibilitychange 通常不必要
            // console.log(`[Bilibili Live Detection Blocker] Prevented ${eventType} event.`);
        }, true); // `true` 表示在捕获阶段执行
    };

    // 针对 visibilitychange 事件
    preventEvent('visibilitychange');
    console.log("[Bilibili Live Detection Blocker] Prevented 'visibilitychange' event listeners.");

    // --- 策略 3: 阻止 blur/focus 事件触发 (针对窗口失去/获得焦点) ---
    // 页面切换标签页时，整个窗口可能不会失去焦点，但当浏览器最小化或切换到其他应用程序时，窗口可能会失去焦点。
    // 这两个事件对于检测窗口激活状态很重要。
    preventEvent('blur');
    preventEvent('focus'); // 虽然主要目的是阻止检测离开，但如果 focus 也被检测，也一并处理
    console.log("[Bilibili Live Detection Blocker] Prevented 'blur' and 'focus' event listeners.");


    // --- 策略 4: 劫持 requestAnimationFrame (不常用，但某些高级检测可能用到) ---
    // 如果网站通过检测 requestAnimationFrame 是否暂停来判断页面是否激活，这个策略会有用。
    // 但通常不建议无差别劫持，因为它可能影响页面动画性能。
    // 在这里暂时不启用，因为可能不是主要检测手段，且可能带来副作用。
    // let originalRequestAnimationFrame = window.requestAnimationFrame;
    // window.requestAnimationFrame = function(callback) {
    //     // 可以在这里加一个判断，例如在特定条件下才调用原始的 requestAnimationFrame
    //     // 例如：如果页面不是真的隐藏，就正常调用
    //     // 但为了阻止检测，我们假设它总是可见的
    //     return originalRequestAnimationFrame.call(window, callback);
    // };
    // console.log("[Bilibili Live Detection Blocker] Potentially spoofed requestAnimationFrame (disabled by default).");


    // --- 策略 5: 劫持 Page Visibility API 的事件监听方法 ---
    // 这样可以阻止通过 document.addEventListener('visibilitychange', ...) 注册的监听器
    // 尽管策略2已经通过捕获阶段阻止了事件，但这个方法提供了另一种层面的保护
    const original_addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // console.log(`[Bilibili Live Detection Blocker] addEventListener called for: ${type}`);
        if (this === document) { // 只作用于 document 对象
            if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
                // 不注册这些事件的监听器 或者 注册一个空函数
                console.log(`[Bilibili Live Detection Blocker] Blocked registration of ${type} listener on document.`);
                return; // 阻止原生的监听器被注册
            }
        }
        original_addEventListener.call(this, type, listener, options);
    };
    console.log("[Bilibili Live Detection Blocker] Modified EventTarget.prototype.addEventListener to block specific document events.");

    // --- 策略 6: 阻止 unload/beforeunload 事件 (防止页面关闭前的提示或数据上报) ---
    // 虽然不是直接的标签页切换检测，但可以阻止页面关闭时的触发
    preventEvent('beforeunload');
    preventEvent('unload');
    console.log("[Bilibili Live Detection Blocker] Prevented 'beforeunload' and 'unload' event listeners.");


    console.log("[Bilibili Live Detection Blocker] All detection prevention strategies applied.");

})();

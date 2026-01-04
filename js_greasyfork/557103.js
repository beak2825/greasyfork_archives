// ==UserScript==
// @name         你的雨姐 - missav连续播放不暂停
// @namespace    https://github.com/
// @version      49.0.0
// @author       东北雨姐
// @license      MIT
// @description  哎呀妈呀，来了老铁！missav不赞停
// @match        https://missav.ai/*
// @match        https://missav.ws/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557103/%E4%BD%A0%E7%9A%84%E9%9B%A8%E5%A7%90%20-%20missav%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/557103/%E4%BD%A0%E7%9A%84%E9%9B%A8%E5%A7%90%20-%20missav%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log('[Keep Video Playing] Script started.');
    // Helper function to stop event propagation
    function stopEvent(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
    // 1. Spoof Page Visibility API
    // Many sites check document.hidden or document.visibilityState
    const spoofVisibility = () => {
        Object.defineProperty(document, 'hidden', {
            get: function () { return false; },
            configurable: true
        });
        Object.defineProperty(document, 'visibilityState', {
            get: function () { return 'visible'; },
            configurable: true
        });
    };
    spoofVisibility();
    // 2. Spoof Focus
    // Some sites check document.hasFocus()
    const originalHasFocus = document.hasFocus;
    document.hasFocus = function () {
        return true;
    };
    // 3. Block Visibility/Focus related events
    // Sites listen for 'visibilitychange', 'blur', 'pagehide' to trigger pause
    const eventsToBlock = [
        'visibilitychange',
        'webkitvisibilitychange',
        'mozvisibilitychange',
        'msvisibilitychange',
        'blur',
        'pagehide'
    ];
    // Capture events at the window level
    eventsToBlock.forEach(eventName => {
        window.addEventListener(eventName, stopEvent, true);
        document.addEventListener(eventName, stopEvent, true);
    });
    // 4. Aggressive Loop to ensure properties stay spoofed
    // Some sites might try to reset these properties or re-attach listeners
    setInterval(() => {
        spoofVisibility();
        document.hasFocus = function () { return true; };
        // Clear direct property assignments
        if (window.onblur) window.onblur = null;
        if (document.onvisibilitychange) document.onvisibilitychange = null;
        if (document.onwebkitvisibilitychange) document.onwebkitvisibilitychange = null;
        if (document.onmozvisibilitychange) document.onmozvisibilitychange = null;
    }, 1000);
    // 5. Specific fix for missav (if they use specific global variables)
    // Sometimes sites use a global variable to track focus
    // We can try to freeze common ones if we knew them, but the event blocking is usually enough.
})();
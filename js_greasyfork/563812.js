// ==UserScript==
// @name         Wayground Anti-Cheat Bypass
// @namespace    http://tampermonkey.net/
// @version      2.40
// @description  Stop being detected by wayground's anti-cheat no more tab switch, fullscreen, resize, copy and paste, right click detections, allow copy and paste.
// @match        *://wayground.com/*
// @match        *://*.wayground.com/*
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563812/Wayground%20Anti-Cheat%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/563812/Wayground%20Anti-Cheat%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************
     * CONFIG
     **********************/
    const blockedEvents = [
        'copy', 'cut', 'paste',
        'contextmenu',
        'fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange',
        'resize',
        'blur', 'focusout', 'visibilitychange'
    ];

    /**********************
     * LOGGER GUI
     **********************/
    const gui = document.createElement('div');
    gui.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 320px;
        height: 220px;
        background: rgba(0,0,0,0.85);
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        overflow-y: auto;
        padding: 10px;
        border-radius: 8px;
        z-index: 999999;
        display: none;
        box-shadow: 0 0 12px #0f0;
    `;
    gui.innerHTML = '<b>Wayground Event Log</b><hr>';
    document.body.appendChild(gui);

    function log(msg) {
        const line = document.createElement('div');
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        gui.appendChild(line);
        gui.scrollTop = gui.scrollHeight;
    }

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
            gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
        }
    });

    /**********************
     * STOP PROPAGATION
     **********************/
    blockedEvents.forEach(evt => {
        window.addEventListener(evt, e => {
            e.stopImmediatePropagation();
        }, true);
    });

    /**********************
     * BLOCK NEW LISTENERS
     **********************/
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (blockedEvents.includes(type)) {
            log(`Removed listener: ${type}`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    /**********************
     * REMOVE INLINE HANDLERS
     **********************/
    const clearInlineHandlers = el => {
        blockedEvents.forEach(evt => {
            const attr = 'on' + evt;
            if (el.removeAttribute) el.removeAttribute(attr);
        });
    };

    document.querySelectorAll('*').forEach(clearInlineHandlers);

    new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(n => {
                if (n.nodeType === 1) clearInlineHandlers(n);
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true });

    /**********************
     * FORCE COPY / PASTE / SELECTION
     **********************/
    const style = document.createElement('style');
    style.textContent = `
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
        }
    `;
    document.documentElement.appendChild(style);

    document.execCommand = () => true;

    /**********************
     * SPOOF FULLSCREEN & FOCUS
     **********************/
    const spoofFullscreenAndFocus = () => {
        Object.defineProperty(document, "fullscreenElement", {
            get: () => document.documentElement,
            configurable: true,
        });

        Object.defineProperty(document, "fullscreen", {
            get: () => true,
            configurable: true,
        });

        Object.defineProperty(document, "hasFocus", {
            value: () => true,
            configurable: true,
        });

        window.focus = () => {};

        Object.defineProperty(document, "visibilityState", {
            get: () => "visible",
            configurable: true,
        });

        const originalDispatch = document.dispatchEvent;
        document.dispatchEvent = function (event) {
            if (event.type === "visibilitychange") {
                log("Suppressed visibilitychange");
                return true;
            }
            return originalDispatch.call(this, event);
        };

        const removeToastManager = () => {
            const toast = document.querySelector(".toast-manager");
            if (toast) {
                toast.remove();
                log("Removed toast-manager");
            }
        };

        new MutationObserver(removeToastManager)
            .observe(document.body, { childList: true, subtree: true });

        removeToastManager();

        GM_log("[+] Wayground spoofing active");
        log("Fullscreen & focus spoofing enabled");
    };

    spoofFullscreenAndFocus();

    log("Wayground unlocker initialized (Ctrl + Shift + H)");
})();

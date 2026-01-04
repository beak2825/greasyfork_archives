// ==UserScript==
// @name         通用失焦反检测
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  相当激进的失焦检测对抗，仅在需要时启用！
// @author       Klready
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/556396/%E9%80%9A%E7%94%A8%E5%A4%B1%E7%84%A6%E5%8F%8D%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556396/%E9%80%9A%E7%94%A8%E5%A4%B1%E7%84%A6%E5%8F%8D%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '[Anti-Detect]';
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const processedWindows = new WeakSet();


    const NativeUtils = (function() {
        const nativeMap = new WeakMap();
        const originalToString = Function.prototype.toString;
        const originalGetDescriptor = Object.getOwnPropertyDescriptor;
        const originalDefineProperty = Object.defineProperty;

        const fakeToString = function() {
            const func = this;
            return nativeMap.has(func) ? nativeMap.get(func) : originalToString.call(func);
        };

        nativeMap.set(fakeToString, originalToString.call(originalToString));

        try {
            const protoDesc = originalGetDescriptor(Function.prototype, 'toString');
            originalDefineProperty(Function.prototype, 'toString', { ...protoDesc, value: fakeToString });
        } catch (e) {}

        function makeNative(fakeFunc, sourceFunc, customName) {
            let nativeString = typeof sourceFunc === 'function' ? originalToString.call(sourceFunc) : sourceFunc;
            let nativeName = typeof sourceFunc === 'function' ? sourceFunc.name : 'anonymous';
            let nativeLength = typeof sourceFunc === 'function' ? sourceFunc.length : 0;
            if (customName) nativeName = customName;

            nativeMap.set(fakeFunc, nativeString);
            originalDefineProperty(fakeFunc, 'name', { value: nativeName, writable: false, enumerable: false, configurable: true });
            originalDefineProperty(fakeFunc, 'length', { value: nativeLength, writable: false, enumerable: false, configurable: true });
            return fakeFunc;
        }

        function hookPrototype(proto, prop, newDesc) {
            const originalDesc = originalGetDescriptor(proto, prop);
            if (!originalDesc) return;
            const finalDesc = { ...originalDesc, ...newDesc };
            if (newDesc.get && originalDesc.get) finalDesc.get = makeNative(newDesc.get, originalDesc.get, `get ${prop}`);
            if (newDesc.value && typeof originalDesc.value === 'function') finalDesc.value = makeNative(newDesc.value, originalDesc.value, prop);
            originalDefineProperty(proto, prop, finalDesc);
        }

        return { makeNative, hookPrototype, originalDefineProperty };
    })();

    function installClockHooks(targetWindow) {
        try {
            const workerBlob = new Blob([`
                const timerIds = new Map();
                let rafInterval = null;

                self.onmessage = function(e) {
                    const { command, id, delay, type } = e.data;

                    if (command === 'start-timer') {
                        let tid;
                        if (type === 'interval') {
                            tid = setInterval(() => self.postMessage({ command: 'timer-tick', id }), delay);
                        } else {
                            tid = setTimeout(() => self.postMessage({ command: 'timer-tick', id }), delay);
                        }
                        timerIds.set(id, tid);
                    } else if (command === 'clear-timer') {
                        const tid = timerIds.get(id);
                        if (tid) {
                            clearInterval(tid);
                            clearTimeout(tid);
                            timerIds.delete(id);
                        }
                    }

                    else if (command === 'start-raf-loop') {
                        if (!rafInterval) {
                            rafInterval = setInterval(() => {
                                self.postMessage({ command: 'raf-tick' });
                            }, 16); // 16ms ≈ 60fps
                        }
                    } else if (command === 'stop-raf-loop') {
                        if (rafInterval) {
                            clearInterval(rafInterval);
                            rafInterval = null;
                        }
                    }
                };
            `], { type: 'application/javascript' });

            const workerUrl = URL.createObjectURL(workerBlob);
            const clockWorker = new Worker(workerUrl);
            const callbackMap = new Map();
            let globalIdCounter = 1;
            const rafQueue = new Map();
            let rafIdCounter = 1;
            let isRafLoopRunning = false;

            clockWorker.onmessage = function(e) {
                const { command, id } = e.data;

                if (command === 'timer-tick') {
                    const task = callbackMap.get(id);
                    if (task) {
                        try { task.callback.apply(targetWindow, task.args); } catch(err) { console.error(err); }
                        if (task.type === 'timeout') callbackMap.delete(id);
                    }
                }

                else if (command === 'raf-tick') {
                    const currentQueue = new Map(rafQueue);
                    rafQueue.clear();
                    const now = performance.now();
                    currentQueue.forEach((cb, rafId) => {
                        try { cb(now); } catch(err) { console.error(err); }
                    });
                }
            };

            const originalSetInterval = targetWindow.setInterval;
            const originalSetTimeout = targetWindow.setTimeout;
            const originalClearInterval = targetWindow.clearInterval;
            const originalClearTimeout = targetWindow.clearTimeout;

            const fakeSetInterval = function(cb, delay, ...args) {
                if (delay > 1000 || delay === undefined) return originalSetInterval.apply(this, arguments);
                const id = globalIdCounter++;
                callbackMap.set(id, { callback: cb, args, type: 'interval' });
                clockWorker.postMessage({ command: 'start-timer', id, delay, type: 'interval' });
                return id;
            };

            const fakeSetTimeout = function(cb, delay, ...args) {
                if (delay > 1000 || delay === undefined) return originalSetTimeout.apply(this, arguments);
                const id = globalIdCounter++;
                callbackMap.set(id, { callback: cb, args, type: 'timeout' });
                clockWorker.postMessage({ command: 'start-timer', id, delay, type: 'timeout' });
                return id;
            };

            const fakeClearTimer = function(id) {
                if (callbackMap.has(id)) {
                    callbackMap.delete(id);
                    clockWorker.postMessage({ command: 'clear-timer', id });
                } else {
                    originalClearInterval(id);
                    originalClearTimeout(id);
                }
            };

            const originalRAF = targetWindow.requestAnimationFrame;
            const originalCancelRAF = targetWindow.cancelAnimationFrame;

            const fakeRAF = function(callback) {
                if (!isRafLoopRunning) {
                    clockWorker.postMessage({ command: 'start-raf-loop' });
                    isRafLoopRunning = true;
                }
                const id = rafIdCounter++;
                rafQueue.set(id, callback);
                return id;
            };

            const fakeCancelRAF = function(id) {
                rafQueue.delete(id);
            };

            NativeUtils.makeNative(fakeSetInterval, originalSetInterval, 'setInterval');
            NativeUtils.makeNative(fakeSetTimeout, originalSetTimeout, 'setTimeout');
            NativeUtils.makeNative(fakeClearTimer, originalClearInterval, 'clearInterval');

            NativeUtils.originalDefineProperty(targetWindow, 'setInterval', { value: fakeSetInterval });
            NativeUtils.originalDefineProperty(targetWindow, 'setTimeout', { value: fakeSetTimeout });
            NativeUtils.originalDefineProperty(targetWindow, 'clearInterval', { value: fakeClearTimer });
            NativeUtils.originalDefineProperty(targetWindow, 'clearTimeout', { value: fakeClearTimer });

            NativeUtils.makeNative(fakeRAF, originalRAF, 'requestAnimationFrame');
            NativeUtils.makeNative(fakeCancelRAF, originalCancelRAF, 'cancelAnimationFrame');

            NativeUtils.originalDefineProperty(targetWindow, 'requestAnimationFrame', { value: fakeRAF });
            NativeUtils.originalDefineProperty(targetWindow, 'cancelAnimationFrame', { value: fakeCancelRAF });

            if (targetWindow.webkitRequestAnimationFrame) {
                 NativeUtils.originalDefineProperty(targetWindow, 'webkitRequestAnimationFrame', { value: fakeRAF });
            }

        } catch (e) {
            console.error(LOG_PREFIX, 'Clock hook failed', e);
        }
    }

    function applyPrototypeHacks(targetWindow) {
        if (!targetWindow || processedWindows.has(targetWindow)) return;

        const DocProto = targetWindow.Document.prototype;
        const ScreenProto = targetWindow.Screen.prototype;

        NativeUtils.hookPrototype(DocProto, 'hidden', { get: function() { return false; } });
        NativeUtils.hookPrototype(DocProto, 'visibilityState', { get: function() { return 'visible'; } });
        NativeUtils.hookPrototype(DocProto, 'hasFocus', { value: function() { return true; } });

        if (Object.getOwnPropertyDescriptor(ScreenProto, 'isExtended')) {
             NativeUtils.hookPrototype(ScreenProto, 'isExtended', { get: function() { return false; } });
        }
        processedWindows.add(targetWindow);
    }

    function injectEventStopper(targetWindow) {
        const blockEvents = ['blur', 'visibilitychange', 'webkitvisibilitychange', 'mouseleave', 'mouseout', 'pagehide', 'fullscreenchange', 'resize'];
        const eventFilter = (e) => { if (e.isTrusted) { e.stopImmediatePropagation(); e.stopPropagation(); } };

        blockEvents.forEach(evt => {
            try { targetWindow.addEventListener(evt, eventFilter, { capture: true, passive: false }); } catch (e) {}
        });
    }

    function installIframeHook() {
        const IframeProto = win.HTMLIFrameElement.prototype;
        const originalDesc = Object.getOwnPropertyDescriptor(IframeProto, 'contentWindow');
        if (!originalDesc) return;

        const fakeGet = function() {
            const realContentWindow = originalDesc.get.call(this);
            if (realContentWindow && !processedWindows.has(realContentWindow)) {
                try {
                    applyPrototypeHacks(realContentWindow);
                    injectEventStopper(realContentWindow);
                    installClockHooks(realContentWindow);
                } catch (e) {}
            }
            return realContentWindow;
        };

        const hookFunc = NativeUtils.makeNative(fakeGet, originalDesc.get, 'get contentWindow');
        Object.defineProperty(IframeProto, 'contentWindow', { ...originalDesc, get: hookFunc });
    }

    try {
        applyPrototypeHacks(win);
        injectEventStopper(win);
        installClockHooks(win);
        installIframeHook();
        console.log(LOG_PREFIX, 'Initialized (Holographic Mode).');
    } catch (e) {
        console.error(LOG_PREFIX, 'Init error:', e);
    }
})();
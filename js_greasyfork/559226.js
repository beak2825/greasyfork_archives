// ==UserScript==
// @name         DevTools Anti-Detector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ultimate protection against all DevTools detection
// @author       Kaypi
// @match        *://*/*
// @license MIT2
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559226/DevTools%20Anti-Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/559226/DevTools%20Anti-Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const win = unsafeWindow || window;

    // ========== CONFIGURATION ==========
    const CONFIG = {
        blockDebugger: true,
        blockConsoleClear: true,
        blockTimingDetection: true,
        logBlocked: false, // Set true to see blocked actions
        refreshInterval: 50 // How often to re-enforce protections
    };

    const log = CONFIG.logBlocked
        ? (...args) => console.log('%c[Anti-Detector]', 'color: #4CAF50; font-weight: bold;', ...args)
        : () => {};

    // ========== 1. ULTIMATE CONSOLE.CLEAR BLOCK ==========
    (function blockConsoleClear() {
        if (!CONFIG.blockConsoleClear) return;

        const noop = function() {
            log('console.clear() blocked');
            return undefined;
        };

        // Method 1: Direct override
        try {
            win.console.clear = noop;
            Object.defineProperty(win.console, 'clear', {
                value: noop,
                writable: false,
                configurable: false,
                enumerable: true
            });
        } catch(e) {}

        // Method 2: Proxy the entire console object
        try {
            const originalConsole = win.console;
            const consoleProxy = new Proxy(originalConsole, {
                get(target, prop) {
                    if (prop === 'clear') return noop;
                    const value = target[prop];
                    return typeof value === 'function' ? value.bind(target) : value;
                },
                set(target, prop, value) {
                    if (prop === 'clear') return true;
                    target[prop] = value;
                    return true;
                }
            });

            Object.defineProperty(win, 'console', {
                get: () => consoleProxy,
                set: () => true,
                configurable: false
            });
        } catch(e) {}

        // Method 3: Continuously re-enforce (for JSVMP that keeps overwriting)
        const enforceConsoleClear = () => {
            try {
                if (win.console.clear !== noop &&
                    win.console.clear.toString().indexOf('undefined') === -1) {
                    win.console.clear = noop;
                }
            } catch(e) {}
        };

        setInterval(enforceConsoleClear, CONFIG.refreshInterval);
    })();

    // ========== 2. ULTIMATE DEBUGGER BLOCK ==========
    (function blockDebugger() {
        if (!CONFIG.blockDebugger) return;

        // Helper to clean debugger from code
        const cleanDebugger = (code) => {
            if (typeof code !== 'string') return code;
            return code
                .replace(/\bdebugger\b\s*;?/gi, '/* dbg removed */;')
                .replace(/["']debugger["']/gi, '""');
        };

        // Method 1: Override Function constructor
        try {
            const OriginalFunction = win.Function;
            const NewFunction = function(...args) {
                if (args.length > 0) {
                    const lastIndex = args.length - 1;
                    if (typeof args[lastIndex] === 'string') {
                        const original = args[lastIndex];
                        args[lastIndex] = cleanDebugger(original);
                        if (original !== args[lastIndex]) {
                            log('Debugger removed from Function constructor');
                        }
                    }
                }
                return OriginalFunction.apply(this, args);
            };
            NewFunction.prototype = OriginalFunction.prototype;
            NewFunction.prototype.constructor = NewFunction;
            Object.defineProperty(NewFunction, 'name', { value: 'Function' });
            NewFunction.toString = () => 'function Function() { [native code] }';
            win.Function = NewFunction;
        } catch(e) {}

        // Method 2: Override eval
        try {
            const originalEval = win.eval;
            win.eval = function(code) {
                if (typeof code === 'string') {
                    const cleaned = cleanDebugger(code);
                    if (code !== cleaned) log('Debugger removed from eval');
                    code = cleaned;
                }
                return originalEval.call(win, code);
            };
            win.eval.toString = () => 'function eval() { [native code] }';
        } catch(e) {}

        // Method 3: Override setInterval for debugger loops
        try {
            const originalSetInterval = win.setInterval;
            win.setInterval = function(fn, delay, ...args) {
                // Block very fast intervals (debugger loops)
                if (delay !== undefined && delay < 10) {
                    delay = 100;
                }

                if (typeof fn === 'function') {
                    const fnStr = fn.toString();
                    // Block tiny functions that just contain debugger
                    if (fnStr.includes('debugger') && fnStr.length < 100) {
                        log('Blocked debugger setInterval');
                        return originalSetInterval.call(win, () => {}, 999999);
                    }
                }

                if (typeof fn === 'string' && fn.includes('debugger')) {
                    log('Blocked debugger string setInterval');
                    return originalSetInterval.call(win, () => {}, 999999);
                }

                return originalSetInterval.call(win, fn, delay, ...args);
            };
        } catch(e) {}

        // Method 4: Override setTimeout
        try {
            const originalSetTimeout = win.setTimeout;
            win.setTimeout = function(fn, delay, ...args) {
                if (typeof fn === 'function') {
                    const fnStr = fn.toString();
                    if (fnStr.includes('debugger') && fnStr.length < 100) {
                        log('Blocked debugger setTimeout');
                        return 0;
                    }
                }

                if (typeof fn === 'string' && fn.includes('debugger')) {
                    log('Blocked debugger string setTimeout');
                    return 0;
                }

                return originalSetTimeout.call(win, fn, delay, ...args);
            };
        } catch(e) {}

        // Method 5: Nullify debugger via Error.prototype
        try {
            // Some JSVMP uses Error to detect debugger timing
            const OriginalError = win.Error;
            win.Error = function(...args) {
                const err = new OriginalError(...args);
                // Clean stack trace
                if (err.stack) {
                    Object.defineProperty(err, 'stack', {
                        get() {
                            return '';
                        },
                        set() {},
                        configurable: true
                    });
                }
                return err;
            };
            win.Error.prototype = OriginalError.prototype;
            win.Error.captureStackTrace = OriginalError.captureStackTrace;
        } catch(e) {}

    })();

    // ========== 3. WORKER MESSAGE INTERCEPTION ==========
    (function blockWorkerDetection() {
        try {
            const OriginalWorker = win.Worker;

            win.Worker = function(scriptURL, options) {
                const worker = new OriginalWorker(scriptURL, options);

                // Intercept postMessage to worker
                const originalPostMessage = worker.postMessage.bind(worker);
                worker.postMessage = function(message, transfer) {
                    // Block console clear/detection commands
                    if (message && typeof message === 'object') {
                        if (message.type === 'clear' ||
                            message.action === 'clear' ||
                            (message.type && message.type.includes && message.type.includes('clear'))) {
                            log('Blocked Worker console.clear command');
                            return;
                        }
                    }
                    return originalPostMessage(message, transfer);
                };

                // Intercept messages from worker
                const originalAddEventListener = worker.addEventListener.bind(worker);
                worker.addEventListener = function(type, listener, options) {
                    if (type === 'message') {
                        const wrappedListener = function(event) {
                            // Modify timing results to hide debugger
                            if (event.data && event.data.time !== undefined) {
                                if (event.data.time > 100) {
                                    event.data.time = Math.random() * 10;
                                }
                            }
                            return listener.call(this, event);
                        };
                        return originalAddEventListener(type, wrappedListener, options);
                    }
                    return originalAddEventListener(type, listener, options);
                };

                // Also wrap onmessage
                let _onmessage = null;
                Object.defineProperty(worker, 'onmessage', {
                    get: () => _onmessage,
                    set: (fn) => {
                        _onmessage = function(event) {
                            if (event.data && event.data.time !== undefined) {
                                if (event.data.time > 100) {
                                    event.data.time = Math.random() * 10;
                                }
                            }
                            return fn.call(this, event);
                        };
                    }
                });

                return worker;
            };
            win.Worker.prototype = OriginalWorker.prototype;
        } catch(e) {}
    })();

    // ========== 4. TIMING PROTECTION ==========
    (function blockTimingDetection() {
        if (!CONFIG.blockTimingDetection) return;

        try {
            const originalNow = performance.now.bind(performance);
            let lastReal = originalNow();
            let virtual = lastReal;

            performance.now = function() {
                const real = originalNow();
                const delta = real - lastReal;

                // Cap delta to hide debugger pauses
                const maxDelta = 16; // ~60fps
                virtual += Math.min(delta, maxDelta);
                lastReal = real;

                return virtual;
            };
        } catch(e) {}

        try {
            const originalDateNow = Date.now;
            let lastDateNow = originalDateNow();
            let virtualDate = lastDateNow;

            Date.now = function() {
                const real = originalDateNow();
                const delta = real - lastDateNow;

                virtualDate += Math.min(delta, 50);
                lastDateNow = real;

                return virtualDate;
            };
        } catch(e) {}
    })();

    // ========== 5. DATE.TOSTRING PROTECTION ==========
    (function blockDateToString() {
        try {
            const originalToString = Date.prototype.toString;
            let callCount = 0;

            Date.prototype.toString = function() {
                // Don't increment counter - breaks detection
                return originalToString.call(this);
            };

            // Make it look native
            Date.prototype.toString.toString = () => 'function toString() { [native code] }';
        } catch(e) {}
    })();

    // ========== 6. REGEXP.TOSTRING PROTECTION ==========
    (function blockRegExpToString() {
        try {
            const original = RegExp.prototype.toString;
            Object.defineProperty(RegExp.prototype, 'toString', {
                value: original,
                writable: false,
                configurable: false
            });
        } catch(e) {}
    })();

    // ========== 7. WINDOW SIZE PROTECTION ==========
    (function blockWindowSizeDetection() {
        try {
            Object.defineProperty(win, 'outerWidth', {
                get: () => win.innerWidth,
                configurable: true
            });
            Object.defineProperty(win, 'outerHeight', {
                get: () => win.innerHeight + 80,
                configurable: true
            });
        } catch(e) {}
    })();

    // ========== 8. DEVTOOLS DETECTOR LIBRARY BLOCK ==========
    (function blockDetectorLibraries() {
        const fakeDetector = {
            launch: () => {},
            stop: () => {},
            addListener: () => {},
            removeListener: () => {},
            isLaunch: () => false,
            setDetectDelay: () => {},
            isOpen: () => false,
            isEnable: () => false
        };

        const detectorNames = [
            'devtoolsDetector',
            '__DEVTOOLS_DETECTOR__',
            'DevtoolsDetector',
            'devToolsDetector'
        ];

        detectorNames.forEach(name => {
            try {
                Object.defineProperty(win, name, {
                    get: () => fakeDetector,
                    set: () => true,
                    configurable: false
                });
            } catch(e) {}
        });
    })();

    // ========== 9. JSVMP SPECIFIC BYPASS ==========
    (function bypassJSVMP() {
        // Block cbb_jsvmp debugger checks
        try {
            // These are common JSVMP global variables
            const jsvmpVars = ['cbb_jsvmp', 'cshduei', 'changlc', 'offnew', 'cltothis'];

            jsvmpVars.forEach(name => {
                if (win[name] !== undefined) {
                    const original = win[name];
                    if (typeof original === 'function') {
                        win[name] = function(...args) {
                            // Remove debugger-related returns
                            const result = original.apply(this, args);
                            if (result === "-90_cbb") {
                                return undefined;
                            }
                            return result;
                        };
                    }
                }
            });
        } catch(e) {}

        // Monitor for JSVMP initialization
        const observer = new MutationObserver((mutations) => {
            if (win.cbb_jsvmp && !win.cbb_jsvmp._patched) {
                try {
                    const original = win.cbb_jsvmp;
                    win.cbb_jsvmp = function(...args) {
                        const result = original.apply(this, args);
                        if (result === "-90_cbb") return undefined;
                        return result;
                    };
                    win.cbb_jsvmp._patched = true;
                    log('Patched cbb_jsvmp');
                } catch(e) {}
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    })();

    // ========== 10. IFRAME PROTECTION ==========
    (function protectIframes() {
        try {
            const originalContentWindow = Object.getOwnPropertyDescriptor(
                HTMLIFrameElement.prototype, 'contentWindow'
            );

            if (originalContentWindow && originalContentWindow.get) {
                const originalGet = originalContentWindow.get;

                Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
                    get: function() {
                        const cw = originalGet.call(this);
                        if (cw) {
                            // Apply protections to iframe window
                            try {
                                if (cw.console && cw.console.clear) {
                                    cw.console.clear = () => {};
                                }
                            } catch(e) {} // Cross-origin will fail
                        }
                        return cw;
                    },
                    configurable: true
                });
            }
        } catch(e) {}
    })();

    // ========== 11. BLOB URL PROTECTION ==========
    (function protectBlobURLs() {
        try {
            const originalCreateObjectURL = URL.createObjectURL.bind(URL);

            URL.createObjectURL = function(blob) {
                // Can't easily modify blob content, but we can track it
                const url = originalCreateObjectURL(blob);
                log('Blob URL created:', url);
                return url;
            };
        } catch(e) {}
    })();

    // ========== 12. CONTINUOUS ENFORCEMENT ==========
    (function continuousEnforcement() {
        const enforce = () => {
            // Re-block console.clear
            try {
                const noop = () => undefined;
                if (win.console && win.console.clear &&
                    win.console.clear.toString().indexOf('undefined') === -1) {
                    win.console.clear = noop;
                }
            } catch(e) {}

            // Check for detector libraries
            try {
                if (win.devtoolsDetector && win.devtoolsDetector.isLaunch) {
                    if (win.devtoolsDetector.isLaunch()) {
                        win.devtoolsDetector.stop();
                    }
                }
            } catch(e) {}
        };

        // Run frequently
        setInterval(enforce, CONFIG.refreshInterval);

        // Also run on various events
        ['load', 'DOMContentLoaded', 'readystatechange'].forEach(event => {
            document.addEventListener(event, enforce);
        });
    })();

    // ========== 13. CHROME DEVTOOLS API PROTECTION ==========
    (function blockChromeAPIs() {
        try {
            Object.defineProperty(win, 'devtoolsFormatters', {
                get: () => undefined,
                set: () => true,
                configurable: false
            });
        } catch(e) {}

        try {
            Object.defineProperty(win, 'Firebug', {
                get: () => undefined,
                set: () => true,
                configurable: false
            });
        } catch(e) {}
    })();

    // ========== STARTUP ==========
    console.log(
        '%c[DevTools Anti-Detector v4.0] Ultimate Protection Active\n' +
        '%c✓ console.clear() - BLOCKED\n' +
        '✓ debugger statements - BLOCKED\n' +
        '✓ Worker detection - BLOCKED\n' +
        '✓ Timing detection - BYPASSED\n' +
        '✓ Continuous enforcement - ENABLED',
        'color: #4CAF50; font-size: 14px; font-weight: bold;',
        'color: #8BC34A; font-size: 11px;'
    );

})();
// ==UserScript==
// @name         JustLemmeDebug
// @version      2.0
// @description  Disable anti-devtools techniques, block unwanted scripts, bypass debugger spammers, and filter console spam (dates, divs, empty errors)
//
// @author       Cufiy <https://cufiy.net> + deeeeone
// @namespace      https://github.com/JMcrafter26/userscripts
//
// @supportURL  https://github.com/JMcrafter26/userscripts/issues
// @homepageURL https://github.com/JMcrafter26/userscripts/tree/main/justlemmedebug
//
// @license      MIT
//
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562680/JustLemmeDebug.user.js
// @updateURL https://update.greasyfork.org/scripts/562680/JustLemmeDebug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///////////////////////////
    // SPAM FILTER - Store originals early
    ///////////////////////////
    const OriginalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        info: console.info,
        table: console.table,
        clear: console.clear
    };

    let blockedSpamCount = 0;

    // Helper function to check if argument is spam
    function isSpam(arg) {
        // Check for Date objects directly
        if (arg instanceof Date) {
            return true;
        }

        // Check for date array spam
        if (Array.isArray(arg)) {
            if (arg.length > 0 && arg.every(item => 
                item instanceof Date || 
                (typeof item === 'string' && !isNaN(Date.parse(item)))
            )) {
                return true;
            }
        }

        // Check for DIV element spam
        if (arg instanceof HTMLDivElement || arg instanceof HTMLElement) {
            return true;
        }

        // Check for empty strings or whitespace-only strings
        if (typeof arg === 'string' && arg.trim() === '') {
            return true;
        }

        // Check if string is a date representation
        if (typeof arg === 'string') {
            const fullDatePattern = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}/;
            if (fullDatePattern.test(arg)) {
                return true;
            }

            const datePatterns = /\d{4}-\d{2}-\d{2}|Mon|Tue|Wed|Thu|Fri|Sat|Sun/gi;
            const matches = arg.match(datePatterns);
            if (matches && matches.length > 3) {
                return true;
            }
        }

        return false;
    }

    // Filter function for console arguments
    function shouldFilterSpam(...args) {
        if (args.length === 0) return false;
        
        if (args.every(arg => arg === '' || arg === null || arg === undefined)) {
            return true;
        }

        return args.some(arg => isSpam(arg));
    }

    // Check if error is the "Uncaught <empty string>" spam
    function isUncaughtEmptyError(event) {
        const hasEmptyMessage = !event.message || event.message === '' || event.message.trim() === '';
        const hasEmptyError = !event.error || event.error === '' || 
                             (event.error && event.error.message === '');
        
        const isFromBundle = event.filename && event.filename.includes('bundle.js');
        
        if ((hasEmptyMessage || hasEmptyError) && isFromBundle) {
            return true;
        }
        
        if (hasEmptyMessage && hasEmptyError) {
            return true;
        }
        
        return false;
    }

    ///////////////////////////
    // 1) BLOCK USUAL ANTI DEBUG SCRIPTS
    ///////////////////////////

    const BLOCKED_DOMAINS = [
        'theajack.github.io',
    ];

    function isBlockedSrc(src) {
        try {
            const url = new URL(src, location.href);
            return BLOCKED_DOMAINS.includes(url.hostname);
        } catch (e) {
            return false;
        }
    }

    const origCreate = Document.prototype.createElement;
    Document.prototype.createElement = function(tagName, options) {
        const el = origCreate.call(this, tagName, options);
        if (tagName.toLowerCase() === 'script') {
            Object.defineProperty(el, 'src', {
                set(value) {
                    if (isBlockedSrc(value)) {
                        OriginalConsole.warn(`[Blocklist] Blocked script: ${value}`);
                        return;
                    }
                    HTMLScriptElement.prototype.__lookupSetter__('src').call(this, value);
                },
                get() {
                    return HTMLScriptElement.prototype.__lookupGetter__('src').call(this);
                },
                configurable: true,
                enumerable: true
            });
        }
        return el;
    };

    ['appendChild','insertBefore','replaceChild'].forEach(fnName => {
        const orig = Node.prototype[fnName];
        Node.prototype[fnName] = function(newNode, refNode) {
            if (newNode.tagName && newNode.tagName.toLowerCase() === 'script') {
                const src = newNode.src || newNode.getAttribute('src');
                if (src && isBlockedSrc(src)) {
                    OriginalConsole.warn(`[Blocklist] Prevented ${fnName} of blocked: ${src}`);
                    return newNode;
                }
            }
            return orig.call(this, newNode, refNode);
        };
    });

    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = typeof input === 'string' ? input : input.url;
        if (isBlockedSrc(url)) {
            OriginalConsole.warn(`[Blocklist] fetch blocked: ${url}`);
            return new Promise(() => {});
        }
        return origFetch.call(this, input, init);
    };

    const OrigOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        if (isBlockedSrc(url)) {
            OriginalConsole.warn(`[Blocklist] XHR blocked: ${url}`);
            return;
        }
        return OrigOpen.call(this, method, url, async, user, pass);
    };

    ///////////////////////////
    // 2) ANTI-ANTI-DEVTOOLS
    ///////////////////////////

    window.Function = new Proxy(Function, {
        apply(target, thisArg, args) {
            if (typeof args[0] === 'string') args[0] = args[0].replace(/debugger\s*;?/g, '');
            return Reflect.apply(target, thisArg, args);
        },
        construct(target, args) {
            if (typeof args[0] === 'string') args[0] = args[0].replace(/debugger\s*;?/g, '');
            return Reflect.construct(target, args);
        }
    });

    if (console && typeof console.clear === 'function') {
        console.clear = () => OriginalConsole.log('[Anti-Anti] console.clear() blocked');
    }

    window.addEventListener('keydown', e => {
        if ((e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) || e.key === 'F12') {
            e.stopImmediatePropagation(); e.preventDefault();
        }
    }, true);
    window.addEventListener('contextmenu', e => {
        e.stopImmediatePropagation();
    }, true);

    ['outerWidth','outerHeight'].forEach(prop => {
        Object.defineProperty(window, prop, { get: () => 1000, configurable: true });
    });

    // const origAdd = EventTarget.prototype.addEventListener;
    // EventTarget.prototype.addEventListener = function(type, fn, opts) {
    //     if (type === 'keydown' || type === 'contextmenu') {
    //         return origAdd.call(this, type, e => e.stopImmediatePropagation(), opts);
    //     }
    //     return origAdd.call(this, type, fn, opts);
    // };

    ///////////////////////////
    // 3) DEBUGGER BYPASS
    ///////////////////////////

    const Originals = {
        createElement: document.createElement,
        log: OriginalConsole.log,
        warn: OriginalConsole.warn,
        table: OriginalConsole.table,
        clear: OriginalConsole.clear,
        functionConstructor: window.Function.prototype.constructor,
        setInterval: window.setInterval,
        toString: Function.prototype.toString,
        addEventListener: window.addEventListener
    };

    const cutoffs = {
        table: {amount:5, within:5000},
        clear: {amount:5, within:5000},
        redactedLog: {amount:5, within:5000},
        debugger: {amount:10, within:10000},
        debuggerThrow: {amount:10, within:10000}
    };

    function shouldLog(type) {
        const cutoff = cutoffs[type]; if (cutoff.tripped) return false;
        cutoff.current = cutoff.current||0;
        const now = Date.now(); cutoff.last = cutoff.last||now;
        if (now - cutoff.last > cutoff.within) cutoff.current=0;
        cutoff.last = now; cutoff.current++;
        if (cutoff.current > cutoff.amount) {
            Originals.warn(`Limit reached! Ignoring ${type}`);
            cutoff.tripped = true; return false;
        }
        return true;
    }

    function wrapFn(newFn, old) {
        return new Proxy(newFn, { get(target, prop) {
            return ['apply','bind','call'].includes(prop) ? target[prop] : old[prop];
        }});
    }

    ///////////////////////////
    // 4) CONSOLE SPAM FILTER (OUR LOGIC)
    ///////////////////////////

    window.console.log = wrapFn((...args) => {
        // First check for spam filtering
        if (shouldFilterSpam(...args)) {
            blockedSpamCount++;
            return;
        }

        // Then apply LemmeDebug redaction logic
        let redactedCount=0;
        const newArgs = args.map(a => {
            if (typeof a==='function'){redactedCount++;return 'Redacted Function';}
            if (typeof a!=='object'||a===null) return a;
            const props = Object.getOwnPropertyDescriptors(a);
            for(const name in props){
                if(props[name].get){redactedCount++;return 'Redacted Getter';}
                if(name==='toString'){redactedCount++;return 'Redacted Str';}
            }
            if (Array.isArray(a)&&a.length===50&&typeof a[0]==='object'){redactedCount++;return 'Redacted LargeObjArray';}
            return a;
        });
        if (redactedCount>=Math.max(args.length-1,1)&&!shouldLog('redactedLog')) return;
        return Originals.log.apply(console,newArgs);
    }, Originals.log);

    window.console.warn = wrapFn((...args) => {
        if (shouldFilterSpam(...args)) {
            blockedSpamCount++;
            return;
        }
        return Originals.warn.apply(console, args);
    }, Originals.warn);

    window.console.error = wrapFn((...args) => {
        if (shouldFilterSpam(...args)) {
            blockedSpamCount++;
            return;
        }
        return OriginalConsole.error.apply(console, args);
    }, OriginalConsole.error);

    window.console.debug = wrapFn((...args) => {
        if (shouldFilterSpam(...args)) {
            blockedSpamCount++;
            return;
        }
        return OriginalConsole.debug.apply(console, args);
    }, OriginalConsole.debug);

    window.console.info = wrapFn((...args) => {
        if (shouldFilterSpam(...args)) {
            blockedSpamCount++;
            return;
        }
        return OriginalConsole.info.apply(console, args);
    }, OriginalConsole.info);

    window.console.table = wrapFn(obj=>{
        if(shouldLog('table')) Originals.warn('Redacted table');
    }, Originals.table);

    window.console.clear = wrapFn(()=>{
        if(shouldLog('clear')) Originals.warn('Prevented clear');
    }, Originals.clear);

    let debugCount=0;
    window.Function.prototype.constructor = wrapFn((...args)=>{
        const originalFn = Originals.functionConstructor.apply(this,args);
        const content = args[0]||'';
        if(content.includes('debugger')){
            if(shouldLog('debugger')) Originals.warn('Prevented debugger');
            debugCount++;
            if(debugCount>100){
                if(shouldLog('debuggerThrow')) Originals.warn('Debugger loop! Throwing');
                throw new Error('Execution halted');
            } else {
                setTimeout(()=>debugCount--,1);
            }
            const newArgs=[content.replaceAll('debugger',''), ...args.slice(1)];
            return new Proxy(Originals.functionConstructor.apply(this,newArgs),{
                get(target,prop){ return prop==='toString'?originalFn.toString:target[prop]; }
            });
        }
        return originalFn;
    }, Originals.functionConstructor);

    // keep console preserved inside iframes
    document.createElement = wrapFn((el,o)=>{
        const element = Originals.createElement.call(document,el,o);
        if(el.toLowerCase()==='iframe'){
            element.addEventListener('load',()=>{
                try{ element.contentWindow.console = window.console; }catch{};
            });
        }
        return element;
    }, Originals.createElement);

    ///////////////////////////
    // 5) ERROR INTERCEPTION FOR SPAM
    ///////////////////////////

    // Aggressive error interception - capture phase
    window.addEventListener('error', function(event) {
        if (isUncaughtEmptyError(event)) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            blockedSpamCount++;
            return false;
        }
    }, true);

    // Bubble phase backup
    window.addEventListener('error', function(event) {
        if (isUncaughtEmptyError(event)) {
            event.preventDefault();
            event.stopPropagation();
            blockedSpamCount++;
            return false;
        }
    }, false);

    // Intercept unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason === '' || 
            event.reason === null || 
            event.reason === undefined ||
            (typeof event.reason === 'object' && (!event.reason.message || event.reason.message === ''))) {
            event.preventDefault();
            event.stopPropagation();
            blockedSpamCount++;
        }
    }, true);

    // Override window.onerror
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        const isEmpty = !message || message === '';
        const isFromBundle = source && source.includes('bundle.js');
        
        if (isEmpty || (isEmpty && isFromBundle)) {
            blockedSpamCount++;
            return true;
        }
        
        if (originalOnError) {
            return originalOnError.apply(this, arguments);
        }
        return false;
    };

    ///////////////////////////
    // 6) HELPER FUNCTIONS
    ///////////////////////////

    window.getSpamStats = function() {
        Originals.log(`%c[Spam Filter] Blocked ${blockedSpamCount} spam messages`, 'color: cyan; font-weight: bold;');
        return blockedSpamCount;
    };

    window.resetSpamStats = function() {
        const old = blockedSpamCount;
        blockedSpamCount = 0;
        Originals.log(`%c[Spam Filter] Reset counter (was ${old})`, 'color: cyan;');
    };

    // Initial message
    Originals.log('%c[LemmeDebug + Spam Filter] Active', 'color: green; font-weight: bold;');
    Originals.log('%c  • Anti-devtools protection enabled', 'color: green;');
    Originals.log('%c  • Debugger bypass active', 'color: green;');
    Originals.log('%c  • Console spam filter running', 'color: green;');
    Originals.log('%c  • Use getSpamStats() to see blocked messages', 'color: cyan;');

})();

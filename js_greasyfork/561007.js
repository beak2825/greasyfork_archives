// ==UserScript==
// @name         bilinovel反检测
// @namespace    https://viayoo.com/zt6kh2
// @version      1.0
// @description  移除www.bilinovel.com和www.linovelib.com的Adblock检测，移除复制限制。
// @author       Aloazny
// @match        http*://*.bilinovel.*/*
// @match        https://www.bilinovel.com/*
// @match        https://www.linovelib.com/*
// @icon         https://www.bilinovel.com/favicon.ico
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561007/bilinovel%E5%8F%8D%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561007/bilinovel%E5%8F%8D%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
        const adsbygoogle = window.adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.loaded = true;
        adsbygoogle.push = function() {};
        const originalError = window.onerror;
        window.onerror = function(msg, src) {
            if (src && src.includes('googlesyndication.com')) return true;
            if (originalError) return originalError.apply(this, arguments);
        };
    })();

    (function() {
        const interceptors = {
            eval: function(original) {
                return function(code) {
                    if (typeof code === 'string') {
                        const test = code.toLowerCase();
                        if (test.includes('debugger') && test.includes('about:blank')) return;
                    }
                    return original.apply(this, arguments);
                };
            },
            setInterval: function(original) {
                return function(fn, delay) {
                    if (typeof fn === 'function') {
                        const str = Function.prototype.toString.call(fn);
                        if (str.includes('adBlockCheck') || str.includes('checkAdBlock')) return 0;
                    }
                    return original.apply(this, arguments);
                };
            }
        };
        Object.keys(interceptors).forEach(key => {
            if (window[key]) {
                window[key] = interceptors[key](window[key]);
            }
        });
    })();

    const domProtector = new MutationObserver(mutations => {
        mutations.forEach(({addedNodes}) => {
            addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches?.('div[style*="z-index:9999"], .hairlie-top')) {
                    node.remove();
                    return;
                }
                const contentIds = ['acontent', 'TextContent', 'volume-list'];
                if (contentIds.includes(node.id)) {
                    node.style.cssText = 'display: block !important';
                }
                if (node.tagName === 'STYLE') {
                    const content = node.textContent || '';
                    if (content.includes('AdGuard') && content.includes(':before')) {
                        node.remove();
                    }
                }
            });
        });
    });

    const restoreCopy = () => {
        const events = ['copy', 'select', 'selectstart', 'contextmenu', 'beforecopy'];
        events.forEach(e => document.addEventListener(e, e => e.stopImmediatePropagation(), true));
        Object.defineProperty(document, 'oncopy', { get: () => null, configurable: true });
        Object.defineProperty(document, 'onselectstart', { get: () => null, configurable: true });
    };

    const createAdPlaceholder = () => {
        if (document.querySelector('ins.adsbygoogle')) return;
        const ad = document.createElement('ins');
        ad.className = 'adsbygoogle';
        ad.style.cssText = 'display: none !important';
        ad.setAttribute('data-ad-status', 'filled');
        const content = document.createElement('div');
        content.textContent = ' ';
        content.style.cssText = 'height: 1px; width: 1px;';
        ad.appendChild(content);
        document.body.appendChild(ad);
    };

    const init = () => {
        domProtector.observe(document, { childList: true, subtree: true, attributes: false, characterData: false });
        createAdPlaceholder();
        restoreCopy();
        const checkContent = () => {
            document.querySelectorAll('#acontent, #TextContent, [id*="volume"]').forEach(el => {
                if (el.style.display === 'none') {
                    el.style.display = 'block';
                }
            });
        };
        setInterval(checkContent, 1000);
        document.addEventListener('DOMContentLoaded', checkContent);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }

    Object.defineProperty(window, 'anra', { value: () => {}, writable: false });
    document.writeln = new Proxy(document.writeln, {
        apply: function(target, thisArg, args) {
            if (args[0]?.includes?.('hairlie-top')) return;
            return target.apply(thisArg, args);
        }
    });
})();
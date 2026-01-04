// ==UserScript==
// @name         E621 Image Mirror Replacer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Replace static1.e621.net with static1.e926.net before the browser tries to load images/videos
// @author       You
// @match        *://e621.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550897/E621%20Image%20Mirror%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/550897/E621%20Image%20Mirror%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OLD_HOST = 'static1.e621.net';
    const NEW_HOST = 'static1.e926.net';

    // Replace old host in a string
    function replaceHost(str) {
        return str.includes(OLD_HOST) ? str.replaceAll(OLD_HOST, NEW_HOST) : str;
    }

    // Intercept element.setAttribute
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (typeof value === 'string' && ['src', 'href', 'poster', 'data-src'].includes(name)) {
            value = replaceHost(value);
        }
        return originalSetAttribute.call(this, name, value);
    };

    // Intercept property assignments like el.src = ...
    const overrideProperty = (proto, prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
        if (!descriptor || !descriptor.set || !descriptor.get) return;

        Object.defineProperty(proto, prop, {
            get: descriptor.get,
            set: function (val) {
                if (typeof val === 'string') val = replaceHost(val);
                return descriptor.set.call(this, val);
            },
            configurable: true,
            enumerable: true,
        });
    };

    // Intercept image/video/link loads
    overrideProperty(HTMLImageElement.prototype, 'src');
    overrideProperty(HTMLSourceElement.prototype, 'src');
    overrideProperty(HTMLVideoElement.prototype, 'src');
    overrideProperty(HTMLLinkElement.prototype, 'href');
    overrideProperty(HTMLAnchorElement.prototype, 'href');

    // Handle early DOM already present (just in case)
    const ATTRIBUTES = ['src', 'href', 'poster', 'data-src'];
    const selector = ATTRIBUTES.map(attr => `[${attr}*="${OLD_HOST}"]`).join(',');
    const fixExisting = () => {
        document.querySelectorAll(selector).forEach(el => {
            ATTRIBUTES.forEach(attr => {
                if (el.hasAttribute(attr)) {
                    const val = el.getAttribute(attr);
                    if (val.includes(OLD_HOST)) {
                        el.setAttribute(attr, replaceHost(val));
                    }
                }
            });
        });
    };

    // MutationObserver as fallback for dynamically added elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    fixExisting();
                }
            });
        });
    });

    observer.observe(document, { childList: true, subtree: true });

    // Just in case anything's already there
    fixExisting();
})();
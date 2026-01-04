// ==UserScript==
// @name         Zefoy.com – Full Anti-Debug + DevTools Bypass
// @namespace    https://greasyfork.org/users/1547272-dot-omar
// @version      2.6
// @description  Clean & silent bypass for all zefoy.com protections – Google Ads 100% safe
// @author       Catrine
// @match        https://zefoy.com/*
// @match        https://www.zefoy.com/*
// @homepageURL  https://discord.gg/tcnksFMCR9
// @supportURL   https://discord.gg/tcnksFMCR9
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558730/Zefoycom%20%E2%80%93%20Full%20Anti-Debug%20%2B%20DevTools%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/558730/Zefoycom%20%E2%80%93%20Full%20Anti-Debug%20%2B%20DevTools%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SAFE = ['google.com','googlesyndication.com','doubleclick.net','gstatic.com','pagead2.googlesyndication.com'];

    delete window.performance;
    Object.defineProperty(window, 'performance', {value: void 0, configurable: false});

    const OrigImage = window.Image;
    window.Image = function () {
        const img = new OrigImage();
 Object.defineProperty(img, 'id', {get: () => 'fake-id', set: () => {}});
 return img;
    };

    const origEval = window.eval;
    window.eval = code => /debugger/.test(code) ? void 0 : origEval(code);
    Function.prototype.constructor = () => function () {};

    window.open = () => null;
    window.close = () => false;

    const origSI = setInterval;
    setInterval = (cb, delay) => typeof cb === 'function' && /debugger/.test(cb.toString()) ? 1337 : origSI(cb, delay);

    Object.defineProperty(window, 'event', {value: {isTrusted: true}, writable: false});

    const hooked = new WeakSet();
    const hook = el => {
        if (!el || hooked.has(el) || SAFE.some(d => el.src?.includes(d))) return;
        hooked.add(el);
        const oc = el.click;
        el.click = function () { return event?.isTrusted !== false ? oc?.apply(this, arguments) : false; };
        const od = el.dispatchEvent;
        el.dispatchEvent = e => e?.type === 'click' && !e.isTrusted ? false : od.apply(this, arguments);
    };

    new MutationObserver(m => m.forEach(mu => mu.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
            hook(n);
            n.querySelectorAll?.('button,a,input[type="button"],input[type="submit"],[onclick]').forEach(hook);
        }
    }))).observe(document.documentElement, {childList: true, subtree: true});

    setTimeout(() => document.querySelectorAll('button,a,input[type="button"],input[type="submit"],[onclick]').forEach(hook), 1000);
})();
// ==UserScript==
// @name         强制所有跳转新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截网页中所有跳转，让它们在新标签页打开。
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556766/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E8%B7%B3%E8%BD%AC%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/556766/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E8%B7%B3%E8%BD%AC%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 拦截 <a> 标签点击事件
    document.addEventListener('click', function(e) {
        let el = e.target;
        while (el && el.tagName !== 'A') {
            el = el.parentElement;
        }
        if (!el) return;

        const href = el.href;
        if (!href) return;

        e.preventDefault();
        window.open(href, '_blank');
    }, true);

    // 2. 拦截 window.open
    const oldOpen = window.open;
    window.open = function(url, target, features) {
        return oldOpen.call(window, url, '_blank');
    };

    // 3. 拦截 location.href / assign / replace
    function openNewTab(url) {
        window.open(url, '_blank');
    }

    const loc = window.location;
    const descriptors = ['href'];
    const methods = ['assign', 'replace'];

    // 重写 location.href setter
    descriptors.forEach(prop => {
        const orig = Object.getOwnPropertyDescriptor(Location.prototype, prop);
        Object.defineProperty(Location.prototype, prop, {
            configurable: true,
            get() { return orig.get.call(this); },
            set(url) { openNewTab(url); }
        });
    });

    // 重写 location.assign 和 replace
    methods.forEach(fn => {
        const origFn = loc[fn];
        Location.prototype[fn] = function(url) {
            openNewTab(url);
        };
    });

})();

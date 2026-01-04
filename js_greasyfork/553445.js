// ==UserScript==
// @name         Discord 任務影片在切換分頁時繼續計時
// @name:en      Discord mission video timer running when switching tabs
// @namespace    https://greasyfork.org/users/1447528
// @version      1.0
// @description  讓 Discord 任務影片在切換分頁時繼續計時
// @description:en  Keep Discord mission video timer running when switching tabs
// @author       love8585962
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553445/Discord%20%E4%BB%BB%E5%8B%99%E5%BD%B1%E7%89%87%E5%9C%A8%E5%88%87%E6%8F%9B%E5%88%86%E9%A0%81%E6%99%82%E7%B9%BC%E7%BA%8C%E8%A8%88%E6%99%82.user.js
// @updateURL https://update.greasyfork.org/scripts/553445/Discord%20%E4%BB%BB%E5%8B%99%E5%BD%B1%E7%89%87%E5%9C%A8%E5%88%87%E6%8F%9B%E5%88%86%E9%A0%81%E6%99%82%E7%B9%BC%E7%BA%8C%E8%A8%88%E6%99%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(document, 'hidden', {
        get: () => false,
        configurable: true
    });

    Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible',
        configurable: true
    });

    document.hasFocus = () => true;

    ['visibilitychange', 'blur', 'focusout', 'pagehide'].forEach(event => {
        window.addEventListener(event, e => e.stopImmediatePropagation(), true);
        document.addEventListener(event, e => e.stopImmediatePropagation(), true);
    });

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (['visibilitychange', 'blur', 'focusout', 'pagehide'].includes(type)) {
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();

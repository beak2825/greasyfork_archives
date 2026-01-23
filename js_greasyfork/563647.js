// ==UserScript==
// @name         おんj通信量削減
// @namespace    tm-block-ga-only-strict
// @version      1.2
// @license	     CC0-1.0
// @description  GA/GA4を完全遮断
// @match        https://*.open2ch.net/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563647/%E3%81%8A%E3%82%93j%E9%80%9A%E4%BF%A1%E9%87%8F%E5%89%8A%E6%B8%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/563647/%E3%81%8A%E3%82%93j%E9%80%9A%E4%BF%A1%E9%87%8F%E5%89%8A%E6%B8%9B.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const isGA = url =>
        typeof url === 'string' &&
        (
            url.startsWith('https://analytics.google.com/g/collect') ||
            url.startsWith('https://www.google-analytics.com/g/collect') ||
            url.startsWith('https://www.google-analytics.com/collect')
        );

    /* fetch（Request対応） */
    const _fetch = window.fetch;
    window.fetch = function (input, init) {
        const url =
            typeof input === 'string'
                ? input
                : input instanceof Request
                    ? input.url
                    : '';

        if (isGA(url)) {
            return Promise.resolve(new Response(null, { status: 204 }));
        }
        return _fetch.apply(this, arguments);
    };

    /* XMLHttpRequest */
    const _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (isGA(url)) {
            this.abort();
            return;
        }
        return _open.apply(this, arguments);
    };

    /* sendBeacon（GA4の本命） */
    if (navigator.sendBeacon) {
        const _beacon = navigator.sendBeacon;
        navigator.sendBeacon = function (url, data) {
            if (isGA(url)) {
                return false;
            }
            return _beacon.call(this, url, data);
        };
    }
})();
// ==UserScript==
// @name         Reddit Theme Cookie Modifier
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Modify the `theme` value inside the cookie so reddit can switch dark mode automatically
// @author       Orthon Jiang
// @match        *://*.reddit.com/*
// @icon         https://www.reddit.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556000/Reddit%20Theme%20Cookie%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/556000/Reddit%20Theme%20Cookie%20Modifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const domains = ['.reddit.com', 'reddit.com', 'www.reddit.com'];

    function futureExpires(days = 365) {
        const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        return d.toUTCString();
    }

    function replaceThemeOnDomain(domain) {
        try {
            document.cookie = `theme=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        } catch (e) {
            // ignore
        }
        try {
            document.cookie = `theme=0; domain=${domain}; path=/; expires=${futureExpires()}; Secure`;
        } catch (e) {
            // ignore
        }
    }

    function applyOnce() {
        for (const d of domains) {
            replaceThemeOnDomain(d);
        }
    }

    let lastCookieSnapshot = document.cookie;
    function pollAndFix() {
        const cur = document.cookie;
        if (cur !== lastCookieSnapshot) {
            applyOnce();
            lastCookieSnapshot = document.cookie;
        }
    }

    applyOnce();

    const intervalId = setInterval(pollAndFix, 10000);

    window.addEventListener('load', () => {
        applyOnce();
        lastCookieSnapshot = document.cookie;
    });

})();
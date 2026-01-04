// ==UserScript==
// @name         LeechTop – Skip Countdown & Bypass limit
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remove the 70s delay on leechtop.com download pages
// @author       ShadowLin21
// @match        https://leechtop.com/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/557090/LeechTop%20%E2%80%93%20Skip%20Countdown%20%20Bypass%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/557090/LeechTop%20%E2%80%93%20Skip%20Countdown%20%20Bypass%20limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearAllCookies() {
        const cookieString = document.cookie;
        if (!cookieString) return;

        const cookies = cookieString.split(';');

        const domains = [location.hostname];
        const parts = location.hostname.split('.');
        if (parts.length > 2) {
            domains.push(parts.slice(-2).join('.'));
        }

        cookies.forEach(c => {
            const eq = c.indexOf('=');
            const name = (eq > -1 ? c.substr(0, eq) : c).trim();

            domains.forEach(domain => {
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + domain;
            });

            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
    }

    clearAllCookies();

    function unlockButton() {
        const btn = document.querySelector('a.go-download-direct');
        if (!btn) return false;

        if (!btn.classList.contains('zing-disabled')) return true;

        btn.classList.remove('zing-disabled');

        const secSpan = btn.querySelector('.sec-count');
        if (secSpan) secSpan.remove();

        btn.textContent = 'Download Now';

        return true;
    }

    function initUnlock() {
        let tries = 0;
        const maxTries = 50;
        const interval = 200;

        const timer = setInterval(() => {
            tries++;
            if (unlockButton() || tries >= maxTries) {
                clearInterval(timer);
            }
        }, interval);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initUnlock();
    } else {
        window.addEventListener('DOMContentLoaded', initUnlock);
    }
})();
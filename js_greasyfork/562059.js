// ==UserScript==
// @name         Tenhou 4/0 -> 3 Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically convert tenhou.net URLs that use /4/ or /0/ to /3/ while preserving query string and hash.
// @match        https://tenhou.net/*
// @match        http://tenhou.net/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562059/Tenhou%2040%20-%3E%203%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/562059/Tenhou%2040%20-%3E%203%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        const pathname = location.pathname || '/';
        // Act when path begins with /4 or /0 (or is exactly /4 or /0)
        if (/^\/[40](?:\/|$)/.test(pathname)) {
            const newPath = pathname.replace(/^\/[40](\/|$)/, '/3$1');
            const newUrl = location.origin + newPath + location.search + location.hash;
            if (newUrl !== location.href) {
                // Replace so it doesn't create a history entry
                location.replace(newUrl);
            }
        }
    } catch (err) {
        // Fail silently but log for debugging
        console.error('Tenhou 4/0 -> 3 redirect error:', err);
    }
})();

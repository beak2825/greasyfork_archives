// ==UserScript==
// @name         Isra.cloud – Restore Original File URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays the original file URL from isra.cloud in the address again, without reloading the page.
// @author       Yaknar (high-way.me)
// @match        https://isra.cloud/download*
// @run-at       document-start
// @grant        none
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/556751/Isracloud%20%E2%80%93%20Restore%20Original%20File%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/556751/Isracloud%20%E2%80%93%20Restore%20Original%20File%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCookie(name) {
        const match = document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='));
        if (!match) return null;
        return decodeURIComponent(match.split('=')[1]);
    }

    function updateUrlFromCookie() {
        const code = getCookie('file_code');
        if (!code) return;

        const desiredPath = '/' + code;
        const currentPath = window.location.pathname;

        // Schon umgestellt? Dann nichts tun.
        if (currentPath === desiredPath) return;

        const newUrl = window.location.origin + desiredPath + window.location.search + window.location.hash;

        // URL in der Adressleiste ändern, ohne Reload
        window.history.replaceState(null, '', newUrl);
    }
    updateUrlFromCookie();
})();
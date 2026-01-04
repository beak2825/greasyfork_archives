// ==UserScript==
// @name         Quicklink Smart Prefetch
// @namespace    https://www.tampermonkey.net/
// @version      1.9
// @description  Quicklink with browser-specific options + network-aware + ignores for login/logout/account links
// @author       Chatgpt
// @match        *://*/*
// @grant        none
// @require      https://unpkg.com/quicklink@3.0.1/dist/quicklink.umd.js
// @downloadURL https://update.greasyfork.org/scripts/549298/Quicklink%20Smart%20Prefetch.user.js
// @updateURL https://update.greasyfork.org/scripts/549298/Quicklink%20Smart%20Prefetch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        const ua = navigator.userAgent.toLowerCase();
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        // Skip Quicklink on very slow (2G) connections or Save-Data mode
        if (connection) {
            if (connection.saveData) {
                console.warn("Quicklink disabled: Save-Data mode is ON");
                return;
            }
            if (connection.effectiveType && /2g/.test(connection.effectiveType)) {
                console.warn("Quicklink disabled: Connection is too slow (" + connection.effectiveType + ")");
                return;
            }
        }

        // Quicklink options & thank you Shannon Turner for the code for the logout,login,etc
        const options = {
            origins: true,
            ignores: [
                /\/api\/?/,
                uri => uri.includes('.zip'),
                (uri, elem) => elem.hasAttribute('noprefetch'),
                uri => uri.includes('logout'),
                uri => uri.includes('login'),
                uri => uri.includes('account')
            ],
            onError: (err, url, el) => {
                console.error("Quicklink error:", {err, url, el});
            }
        };

        if (ua.includes("chrome") || ua.includes("edg")) {
            options.prerenderAndPrefetch = true;
        } else if (ua.includes("firefox") || ua.includes("safari")) {
            options.prerenderAndPrefetch = false;
        }

        // Initialize Quicklink
        quicklink.listen(options);

        console.log("Quicklink initialized with options:", options, "connection:", connection || "n/a");
    } catch (e) {
        console.error("Quicklink failed to initialize:", e);
    }
})();
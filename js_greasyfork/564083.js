// ==UserScript==
// @name         Google Redirect Bypass / Auto-Follow 2026
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Automatically follows Google's redirect notices after a short delay.
// @author       Axer128
// @icon         https://www.google.com/favicon.ico
// @match        https://www.google.com/url?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564083/Google%20Redirect%20Bypass%20%20Auto-Follow%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/564083/Google%20Redirect%20Bypass%20%20Auto-Follow%202026.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('q');

    if (targetUrl) {
        setTimeout(() => {
            window.location.replace(targetUrl);
        }, 300);
    }
})();
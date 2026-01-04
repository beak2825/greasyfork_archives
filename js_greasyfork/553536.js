// ==UserScript==
// @name         HTTP to HTTPS Redirector
// @namespace    SFRUUCB0byBIVFRQUyBSZWRpcmVjdG9y
// @version      1.0
// @description  Automatically redirect HTTP pages to their HTTPS equivalent
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/https11.png
// @match        http://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553536/HTTP%20to%20HTTPS%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/553536/HTTP%20to%20HTTPS%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current page is already on HTTPS
    if (window.location.protocol === 'https:') {
        return;
    }

    // Construct the HTTPS URL
    const httpsUrl = window.location.href.replace('http://', 'https://');

    // Redirect to HTTPS version
    try {
        window.location.replace(httpsUrl);
    } catch (error) {
        console.error('Failed to redirect to HTTPS:', error);
    }
})();

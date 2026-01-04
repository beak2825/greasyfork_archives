// ==UserScript==
// @name         Google Drive Account Selector
// @namespace    https://example.com/
// @version      1.0
// @description  Always open Google Drive links with a specific account number
// @match        https://drive.google.com/drive/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554160/Google%20Drive%20Account%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/554160/Google%20Drive%20Account%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === USER CONFIG ===
    const accountNumber = 3; // change this to your desired account index (0 = 1st, 1 = 2nd, etc.)

    // Get current URL
    const url = new URL(window.location.href);

    // Only modify if the URL does not already contain a /u/{number}/
    const drivePath = url.pathname;

    const uPattern = /^\/drive\/u\/\d+\//;
    if (!uPattern.test(drivePath)) {
        // Insert /u/{number}/ after /drive/
        const newPath = drivePath.replace(/^\/drive\//, `/drive/u/${accountNumber}/`);
        url.pathname = newPath;

        // Redirect to the corrected URL
        window.location.replace(url.toString());
    }
})();

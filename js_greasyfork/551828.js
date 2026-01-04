// ==UserScript==
// @name         Override AJAX Timeout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reduces Zing cooldown
// @author       You
// @match        https://rawlazy.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551828/Override%20AJAX%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/551828/Override%20AJAX%20Timeout.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log('[TM] Script loaded. Waiting for zing...');

    const waitForZing = setInterval(() => {
        if (typeof window.zing !== 'undefined') {
            console.log('[TM] Found zing:', window.zing);

            // Patch timeleft directly
            const originalTimeleft = window.zing.timeleft;
            window.zing.timeleft = 2;

            console.log(`[TM] Patched zing.timeleft from ${originalTimeleft} to ${window.zing.timeleft}`);

            clearInterval(waitForZing);
        }
    }, 100);
})();
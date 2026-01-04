// ==UserScript==
// @name         Remove Photopea ad blocker alert
// @namespace    http://tampermonkey.net/
// @version      2025-10-14-3
// @description  Removes Photopea ad blocker alert. Doesn't remove ads/blank bar when ads removed.
// @author       Kevinf100
// @match        https://www.photopea.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552587/Remove%20Photopea%20ad%20blocker%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/552587/Remove%20Photopea%20ad%20blocker%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Save the real browser alert before Photopea changes it ===
    const realAlert = window.alert;


    // === Poll until Photopea overwrites alert ===
    function safelyOverrideAlert(retryDelay = 1000, maxRetries = 30) {
        let retries = 0;

        const tryOverride = () => {
            retries++;

            // If the current alert is NOT the real one we saved, it's been replaced.
            if (window.alert !== realAlert) {
                const photopeaAlert = window.alert;

                // Wrap it — block the specific "changing source code" message
                window.alert = function(msg, ...rest) {
                    if (!msg?.includes("Something is changing our source code")) {
                        return photopeaAlert.call(this, msg, ...rest);
                    } else {
                        console.log('Blocked Photopea source-code warning');
                    }
                };

                console.log('Custom alert overridden');
                window.alert("Ad alerts will no longer display.");
                return;
            }

            // Retry later if not yet replaced
            if (retries < maxRetries) {
                setTimeout(tryOverride, retryDelay);
            } else {
                console.warn('Gave up waiting for Photopea to modify alert');
            }
        };

        tryOverride();
    }

    safelyOverrideAlert(1000, 30);
})();

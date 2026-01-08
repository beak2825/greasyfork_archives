// ==UserScript==
// @name         Microsoft Teams Safe Link Bypass
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes link verification (Safe Links) on Microsoft Teams web app by stopping the click interception.
// @author       bbbenji
// @match        https://teams.microsoft.com/*
// @match        https://teams.live.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561738/Microsoft%20Teams%20Safe%20Link%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/561738/Microsoft%20Teams%20Safe%20Link%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // We use the third argument 'true' to enable the Capture Phase.
    // This allows our script to see the click BEFORE the Teams web app does.
    document.addEventListener('click', function(e) {
        // Look for the specific Safe Link identifier from your snippet
        const targetLink = e.target.closest('a[data-testid="atp-safelink"]');

        if (targetLink) {
            // 1. Stop the event from bubbling up to the Teams event handlers
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 2. Prevent the default behavior just in case Teams has other hooks
            e.preventDefault();

            // 3. Manually open the clean URL found in the href attribute
            const cleanUrl = targetLink.href;
            if (cleanUrl) {
                window.open(cleanUrl, '_blank', 'noopener,noreferrer');
            }
        }
    }, true); // 'true' is critical here
})();
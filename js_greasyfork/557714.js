// ==UserScript==
// @name         Instagram "More" Auto-Clicker (Focus Only)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clicks "more" only when the tab is active.
// @author       Jim Chen
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557714/Instagram%20%22More%22%20Auto-Clicker%20%28Focus%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557714/Instagram%20%22More%22%20Auto-Clicker%20%28Focus%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 2000; // 2 seconds

    function clickMoreButtons() {
        // 1. THE CHILL CHECK
        // If the user isn't actually looking at this tab/window, stop immediately.
        // This prevents background processing.
        if (!document.hasFocus()) {
            return;
        }

        // 2. The Selector (XPath)
        // Finds <div role="button"> containing <span>more</span>
        const xpath = "//div[@role='button'][.//span[text()='more']]";
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // 3. The click loop
        for (let i = 0; i < result.snapshotLength; i++) {
            let button = result.snapshotItem(i);

            // Check if visible to avoid ghost clicks
            if (button.offsetParent !== null) {
                button.click();
            }
        }
    }

    setInterval(clickMoreButtons, CHECK_INTERVAL);

})();
// ==UserScript==
// @name         Auto-close Nag Dialogs
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @author       Mark Zinzow
// @version      1.2
// @description  Automatically close or remove nag dialogs (cookie banners, adblock warnings, etc.)
// @match        *://www.wunderground.com/*
// @match        *://www.howtogeek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557365/Auto-close%20Nag%20Dialogs.user.js
// @updateURL https://update.greasyfork.org/scripts/557365/Auto-close%20Nag%20Dialogs.meta.js
// ==/UserScript==
/* eslint-disable spaced-comment */

(function() {
    'use strict';

    /**
     * Helper: click the first element matching a selector
     */
    function clickBySelector(selector) {
        const el = document.querySelector(selector);
        if (el) {
            console.log("Clicking element:", selector);
            el.click();
        }
    }

    /**
     * Mapping: hostname → single selector
     * Add new sites here by adding a key (hostname) and its selector.
     */
    const siteSelectors = {
        "wunderground.com": "a.no-thanks", // "No Thanks" button
        "howtogeek.com": "button.adblock-close" // adblock nag close button
        // Example:
        // "example.com": ".cookie-banner"
    };

    /**
     * Dispatcher: run rule for current hostname
     */
    function runRule() {
        const hostname = window.location.hostname.replace(/^www\./, "");
        if (siteSelectors[hostname]) {
            const success = clickBySelector(siteSelectors[hostname]);
            if (success) {
                clearInterval(timer); // stop checking once clicked
            }
        }
    }

    // Run immediately and then every 1.25 seconds until success
    runRule();
    const timer = setInterval(runRule, 1250);

})();
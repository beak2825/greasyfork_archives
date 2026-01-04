// ==UserScript==
// @name         Gmail Big Reply and Forward button remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gmail introduced big new Reply and Forward buttons at the bottom of the email pane. These take up a lot of room. This script just removes them giving you back your valuable screen space again.
// @author       You
// @match        https://mail.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557169/Gmail%20Big%20Reply%20and%20Forward%20button%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/557169/Gmail%20Big%20Reply%20and%20Forward%20button%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the target div
    function removeTargetDiv() {
        // The class selector - Gmail uses multiple classes, so we need to match all of them
        const selector = '.nH.btDi4d.tyMQmc';
        const element = document.querySelector(selector);

        if (element) {
            element.remove();
            console.log('Removed target div');
        }
    }

    // Remove immediately if already present
    removeTargetDiv();

    // Use MutationObserver to watch for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        removeTargetDiv();
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also check periodically as a fallback
    setInterval(removeTargetDiv, 1000);
})();

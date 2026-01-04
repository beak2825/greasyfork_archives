// ==UserScript==
// @name         Hellorubric (UNSW/Arc) Middle-click New Tab
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Opens non-link buttons on hellorubric.com (UNSW/ARC version) in a new tab upon middle-mouse click.
// @author       A. Frederiksen
// @match        *://*.hellorubric.com/*
// @grant        GM_openInTab
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/550213/Hellorubric%20%28UNSWArc%29%20Middle-click%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/550213/Hellorubric%20%28UNSWArc%29%20Middle-click%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('mousedown', function(event) {
        // Check if the middle mouse button was clicked (button code 1)
        if (event.button === 1) {
            // Find the closest ancestor (or the element itself) with a 'destination' attribute
            const targetElement = event.target.closest('[destination]');

            // If such an element is found and it's not a standard link
            if (targetElement && targetElement.tagName.toLowerCase() !== 'a') {
                // Prevent the default middle-click action (e.g., autoscroll)
                event.preventDefault();
                // Stop the event from bubbling up and triggering other listeners
                event.stopPropagation();

                const destination = targetElement.getAttribute('destination');
                if (destination) {
                    // Construct the full URL
                    const url = 'https://campus.hellorubric.com' + destination;
                    // Open the URL in a new background tab
                    GM_openInTab(url, { active: false });
                }
            }
        }
    }, true); // Use capture phase to intercept the event early
})();
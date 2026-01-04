// ==UserScript==
// @name         Auto-Collapse Google Sponsored Results
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically collapses sponsored sections in Google search results
// @author       Steve
// @match        https://www.google.com/search*
// @match        https://www.google.co.uk/search*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560794/Auto-Collapse%20Google%20Sponsored%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/560794/Auto-Collapse%20Google%20Sponsored%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAllSponsored() {
        let hiddenCount = 0;
        
        // Target the exact parent container: div with jscontroller="tY2w9d" and class "vbIt3d"
        const containers = document.querySelectorAll('div[jscontroller="tY2w9d"].vbIt3d');
        containers.forEach(function(container) {
            if (container.style.display !== 'none') {
                container.style.display = 'none';
                hiddenCount++;
            }
        });
        
        if (hiddenCount > 0) {
            console.log(`Hidden ${hiddenCount} sponsored containers`);
        }
    }

    // Run multiple times to catch dynamically loaded content
    [50, 200, 500, 1000, 2000].forEach(delay => {
        setTimeout(hideAllSponsored, delay);
    });

    // Watch for DOM changes
    const observer = new MutationObserver(hideAllSponsored);
    if (document.body) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true
        });
    }
})();

// ==UserScript==
// @name         aoe2recs TW flag replaced
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces Taiwan flag SVG with "TW" text by detecting path data
// @author       You
// @match        https://aoe2recs.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563751/aoe2recs%20TW%20flag%20replaced.user.js
// @updateURL https://update.greasyfork.org/scripts/563751/aoe2recs%20TW%20flag%20replaced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The unique path data for the white sun in the Taiwan flag
    const taiwanSunPath = "m8.73 10.81";

    function replaceFlags() {
        // Find all flag icons that haven't been processed yet
        const svgs = document.querySelectorAll('svg.iconify--flagpack:not([data-tw-fixed])');

        svgs.forEach(svg => {
            // Check if the SVG contains the specific drawing path for the Taiwan flag
            if (svg.innerHTML.includes(taiwanSunPath)) {

                // 1. Hide the SVG
                svg.style.display = 'none';

                // 2. Add the text (only if not already added)
                // We check the next sibling to avoid duplicates
                if (!svg.nextElementSibling || svg.nextElementSibling.className !== 'tw-replacement-text') {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = "TW";
                    textSpan.className = "tw-replacement-text";

                    // Apply your styles
                    textSpan.style.fontWeight = "600";
                    textSpan.style.fontSize = "0.5em";
                    textSpan.style.color = "#aaa";

                    // Insert after the hidden SVG
                    svg.parentNode.insertBefore(textSpan, svg.nextSibling);
                }

                // Mark as processed so we don't check it again
                svg.setAttribute('data-tw-fixed', 'true');
            }
        });
    }

    // Run immediately
    replaceFlags();

    // Watch for changes (since the site loads data dynamically)
    const observer = new MutationObserver(replaceFlags);
    observer.observe(document.body, { childList: true, subtree: true });

})();
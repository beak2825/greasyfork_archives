// ==UserScript==
// @name        Arrow Key Navigation (Generic)
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Gemini
// @description Navigate Next/Prev pages with Left/Right arrow keys. Tries to detect common pagination patterns.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561377/Arrow%20Key%20Navigation%20%28Generic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561377/Arrow%20Key%20Navigation%20%28Generic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Add specific CSS selectors here if the generic ones don't work for a specific site.
    const NEXT_SELECTORS = [
        'a[rel="next"]',                // Standard HTML5
        '.next a',                      // Common class structure
        'a.next',                       // Common class
        '.pagination .next',            // Common pagination
        'a:contains("Next")',           // jQuery-ish pseudo (implemented manually below)
        'a:contains("›")',
        'a:contains(">>")'
    ];

    const PREV_SELECTORS = [
        'a[rel="prev"]',                // Standard HTML5
        '.prev a',
        'a.prev',
        '.previous a',
        'a.previous',
        '.pagination .prev',
        'a:contains("Previous")',
        'a:contains("Prev")',
        'a:contains("‹")',
        'a:contains("<<")'
    ];

    // Helper to find a link based on selectors or text content
    function findLink(selectors, directionText) {
        for (let selector of selectors) {
            // Handle text-based search specifically
            if (selector.includes(':contains')) {
                const textToFind = selector.match(/"(.*?)"/)[1].toLowerCase();
                const links = document.querySelectorAll('a');
                for (let link of links) {
                    if (link.innerText.toLowerCase().includes(textToFind)) {
                        return link;
                    }
                }
            } else {
                // Handle standard CSS selectors
                const element = document.querySelector(selector);
                if (element) return element;
            }
        }
        return null;
    }

    // Event Listener
    document.addEventListener('keydown', function(e) {
        // 1. Safety Check: Don't trigger if user is typing in a text box
        const tag = e.target.tagName.toLowerCase();
        const isEditable = e.target.isContentEditable;
        if (tag === 'input' || tag === 'textarea' || isEditable) {
            return;
        }

        // 2. logic for Arrow Keys
        let linkToClick = null;

        if (e.key === 'ArrowLeft') {
            linkToClick = findLink(PREV_SELECTORS, "prev");
        } else if (e.key === 'ArrowRight') {
            linkToClick = findLink(NEXT_SELECTORS, "next");
        }

        // 3. Navigate if link found
        if (linkToClick) {
            console.log(`[ArrowNav] Navigating via:`, linkToClick);
            // Visual feedback (optional: highlights the button briefly)
            linkToClick.style.border = "2px solid red";
            
            // Click the link
            linkToClick.click();
        }
    });

})();
// ==UserScript==
// @name         Hide Facebook Reels
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the Reels section from Facebook
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564088/Hide%20Facebook%20Reels.user.js
// @updateURL https://update.greasyfork.org/scripts/564088/Hide%20Facebook%20Reels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS approach - hides elements containing "Reels" or with reels-related attributes
    GM_addStyle(`
        /* Hide Reels section by aria-label */
        [aria-label="Reels"], [aria-label="Reels and short videos"] {
            display: none !important;
        }

        /* Hide spans/links containing "Reels" text in feed */
        div[data-pagelet*="Reels"],
        div[data-pagelet*="reels"] {
            display: none !important;
        }
    `);

    // DOM observer for dynamically loaded content
    function hideReels() {
        // Find and hide elements with "Reels" headers
        document.querySelectorAll('span, h2, h3').forEach(el => {
            if (el.textContent.trim() === 'Reels' || 
                el.textContent.trim() === 'Reels and short videos') {
                // Traverse up to find the container and hide it
                let container = el.closest('[data-pagelet]') || 
                                el.closest('div[class*="x1"]')?.parentElement?.parentElement?.parentElement;
                if (container) {
                    container.style.display = 'none';
                }
            }
        });
    }

    // Run on load and observe for changes (Facebook is an SPA)
    const observer = new MutationObserver(() => {
        hideReels();
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        hideReels();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
            hideReels();
        });
    }
})();
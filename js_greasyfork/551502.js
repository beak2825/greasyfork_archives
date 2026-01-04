// ==UserScript==
// @name         Amazon Search Bar Highlight Fix
// @namespace    fixThisAmazonSeriously
// @version      1.3
// @description  Keep Amazon's search bar active and allow proper text highlighting/editing, using a lightweight self-healing observer only when needed.
// @author       Max Lemkin
// @match        https://*.amazon.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551502/Amazon%20Search%20Bar%20Highlight%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/551502/Amazon%20Search%20Bar%20Highlight%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyFix(searchInput) {
        if (!searchInput || searchInput.dataset.fixApplied) return;
        searchInput.dataset.fixApplied = "true";

        let mouseDownInside = false;

        searchInput.addEventListener('mousedown', () => {
            mouseDownInside = true;
        });

        document.addEventListener('mouseup', () => {
            if (mouseDownInside) {
                setTimeout(() => {
                    searchInput.focus();
                    mouseDownInside = false;
                }, 0);
            }
        });

        searchInput.addEventListener('blur', (e) => {
            if (mouseDownInside) {
                e.stopImmediatePropagation();
                setTimeout(() => searchInput.focus(), 0);
            }
        }, true);

        console.log('Fix applied to search bar');
    }

    function init() {
        const searchInput = document.getElementById('twotabsearchtextbox');
        if (searchInput) {
            applyFix(searchInput);
        } else {
            // Start temporary observer only if the box is missing
            const observer = new MutationObserver(() => {
                const found = document.getElementById('twotabsearchtextbox');
                if (found) {
                    applyFix(found);
                    observer.disconnect(); // Stop watching once fixed
                    console.log("Observer disconnected (search bar found)");
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            console.log("Observer enabled (waiting for search bar)");
        }
    }

    // Initial run
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();
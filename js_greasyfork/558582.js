// ==UserScript==
// @name         Reload Shorts + Auto Open Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reload Shorts when URL changes and auto-open comment panel for the visible Short.
// @match        https://www.youtube.com/shorts/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558582/Reload%20Shorts%20%2B%20Auto%20Open%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/558582/Reload%20Shorts%20%2B%20Auto%20Open%20Comments.meta.js
// ==/UserScript==

(function () {
    let lastUrl = location.href;

    // Detect URL change (YouTube navigation)
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;

            // Only reload when switching to another Short
            if (currentUrl.includes("/shorts/")) {
                location.reload();
            }
        }
    }, 300);

    // Auto-open comments AFTER reload
    document.addEventListener("DOMContentLoaded", () => {
        autoOpenComments();
    });

    function autoOpenComments() {
        // Try multiple times because Shorts load slowly
        const tryClick = () => {
            // Find ALL possible comment buttons
            let commentButtons = [
                ...document.querySelectorAll('ytd-toggle-button-renderer#comments-button button'),
                ...document.querySelectorAll('button[aria-label^="Comments"]'),
                ...document.querySelectorAll('button[aria-label*="comment"]')
            ];

            // Filter to the visible one (like your like-button script)
            commentButtons = commentButtons.filter(btn => {
                const rect = btn.getBoundingClientRect();
                return rect.top > 0 && rect.top < window.innerHeight;
            });

            if (commentButtons.length > 0) {
                commentButtons[0].click();
            } else {
                // Retry until Shorts UI appears
                setTimeout(tryClick, 200);
            }
        };

        // Delay slightly to let the Shorts UI load
        setTimeout(tryClick, 400);
    }
})();

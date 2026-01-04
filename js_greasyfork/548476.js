// ==UserScript==
// @name         Gmail Enhancer
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Enhance Gmail inbox by: 1. Forcing subjects to display fully 2. Removing message preview snippets 3. Showing email username (before "@") instead of sender's display name
// @author       Bui Quoc Dung
// @match        https://mail.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548476/Gmail%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/548476/Gmail%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* -------------------------------
     * Feature 1: Show full subject
     * ------------------------------- */
    GM_addStyle(`
        span[data-thread-id] {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: unset !important;
            display: inline !important;
        }
    `);

    /* -------------------------------
     * Feature 2: Remove snippets
     * ------------------------------- */
    function removeSnippets() {
        document.querySelectorAll("span.y2").forEach(el => el.remove());
    }

    /* -------------------------------
     * Feature 3: Replace name with email username
     * ------------------------------- */
    function replaceSenderNames() {
        document.querySelectorAll("span.yP[email]").forEach(el => {
            const email = el.getAttribute("email");
            if (email) {
                const username = email.split("@")[0];
                if (el.textContent !== username) {
                    el.textContent = username;
                }
            }
        });
    }

    /* -------------------------------
     * Init + Observe DOM changes
     * ------------------------------- */
    function applyEnhancements() {
        removeSnippets();
        replaceSenderNames();
    }

    // Run once on load
    applyEnhancements();

    // Keep watching for dynamic Gmail updates
    const observer = new MutationObserver(() => {
        applyEnhancements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();

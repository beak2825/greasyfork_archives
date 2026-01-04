// ==UserScript==
// @name         No Click Profile & ClearURLs
// @namespace    No Click Profile & ClearURLs
// @version      1.5
// @description  Prevents profile clicks in comment columns and clears URL parameters
// @author       Mochamad Adi MR (adimuham.mad)
// @match        *://*.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @supportURL   https://buymeacoffee.com/mochadimr
// @homepageURL  https://github.com/adimuhamad/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559224/No%20Click%20Profile%20%20ClearURLs.user.js
// @updateURL https://update.greasyfork.org/scripts/559224/No%20Click%20Profile%20%20ClearURLs.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --- 1. CONFIGURATION ---
    const CONFIG = {
        // URL parameters to remove
        URL_PARAMS_TO_REMOVE: ["list", "index", 'pp', "si"],

        // Selectors to detect comment areas (can be added if YouTube updates its structure)
        COMMENT_SECTION_SELECTORS: ["#comments", "ytd-comments", "ytd-comment-thread-renderer"],

        // Confirmation message
        MESSAGES: {
            CONFIRM_NAV: "You clicked on a user's profile in the comments.\ n\nAre you sure you want to navigate away?"
        }
    };

    // --- 2. MODULE: URL CLEANER ---
    const UrlCleaner = {
        /**
         * Cleans unwanted URL parameters
         */
        clean: () => {
            try {
                const currentUrl = new URL(window.location.href);
                let isDirty = false;

                CONFIG.URL_PARAMS_TO_REMOVE.forEach((param) => {
                    if (currentUrl.searchParams.has(param)) {
                        currentUrl.searchParams.delete(param);
                        isDirty = true;
                    }
                });

                if (isDirty) {
                    // Use replace() so that users cannot press the Back button to return to the dirty URL.
                    window.location.replace(currentUrl.toString());
                    console.log("[Cleaner] URL parameters cleaned.");
                }
            } catch (e) {
                console.error("[Cleaner] Error processing URL:", e);
            }
        },

        init: () => {
            // Run when the script is loaded
            UrlCleaner.clean();

            // Run every time YouTube finishes navigation (SPA navigation)
            window.addEventListener("yt-navigate-finish", UrlCleaner.clean);
        }
    };

    // --- 3. MODULE: PROFILE GUARD ---
    const ProfileGuard = {
        /**
         * Checks whether the element is inside the comments area
         */
        isInsideComments: (element) => {
            return CONFIG.COMMENT_SECTION_SELECTORS.some(selector => element.closest(selector));
        },

        /**
         * Checks whether the link points to a user/channel profile
         */
        isProfileLink: (anchor) => {
            const path = anchor.pathname;
            return path.startsWith("/@") || path.startsWith("/channel/") || path.startsWith("/user/");
        },

        /**
         * Main handler for click events
         */
        handleClick: (event) => {
            // 1. Bypass if the Shift key is pressed
            if (event.shiftKey) return;

            // 2. Find the closest <a> element from the click target
            const linkElement = event.target.closest("a");
            if (!linkElement || !linkElement.href) return;

            // 3. Validation: Is this a profile link AND is it inside a comment?
            if (ProfileGuard.isProfileLink(linkElement) && ProfileGuard.isInsideComments(linkElement)) {

                // Immediately stop the default YouTube event execution
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                // Display confirmation
                const userConfirmed = confirm(CONFIG.MESSAGES.CONFIRM_NAV);

                if (userConfirmed) {
                    window.location.href = linkElement.href;
                }
            }
        },

        init: () => {
            // Use capture: true so that events are captured BEFORE they reach the YouTube script
            document.addEventListener("click", ProfileGuard.handleClick, true);
        }
    };

    // --- 4. INITIALIZATION ---
    // Run both modules
    UrlCleaner.init();
    ProfileGuard.init();

})();
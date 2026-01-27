// ==UserScript==
// @name         Gemini Safari Fix (The NB9 Architect's Version)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes the double-enter bug on Gemini for Safari. clean and safe.
// @author       The NB9 Architect
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564161/Gemini%20Safari%20Fix%20%28The%20NB9%20Architect%27s%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564161/Gemini%20Safari%20Fix%20%28The%20NB9%20Architect%27s%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Listen for any key press on the page
    document.addEventListener('keydown', function(e) {

        // Check 1: Is the key "Enter"?
        // Check 2: Is "Shift" NOT pressed? (Because Shift+Enter means new line)
        if (e.key === 'Enter' && !e.shiftKey) {

            // Check 3: Are we typing in the chat box?
            const activeElement = document.activeElement;
            const isChatBox = activeElement.getAttribute('contenteditable') === 'true' || activeElement.tagName === 'TEXTAREA';

            if (isChatBox) {
                // Find the "Send" button.
                // Google labels it "Send message" which is consistent.
                const sendButton = document.querySelector('button[aria-label="Send message"]');

                // If button exists and is not greyed out (disabled)
                if (sendButton && !sendButton.disabled) {
                    // Prevent the browser's default behavior (which is failing)
                    e.preventDefault();
                    e.stopPropagation();

                    // FORCE CLICK the button
                    sendButton.click();
                }
            }
        }
    }, true); // 'true' means we catch the key press before anyone else
})();
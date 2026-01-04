// ==UserScript==
// @name         Google AI Studio - Custom Tab Title
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces the generic "Google AI Studio" tab title with the actual conversation title found on the page.
// @author       Milor123
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556783/Google%20AI%20Studio%20-%20Custom%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/556783/Google%20AI%20Studio%20-%20Custom%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Do you want to keep " - AI Studio" at the end?
    // true = "My Conversation Title - AI Studio"
    // false = "My Conversation Title"
    const KEEP_SUFFIX = false;

    function updateTitle() {
        // We target the H1 element with the class 'mode-title'
        // This selector is based on the current Google AI Studio DOM structure
        const titleElement = document.querySelector('h1.mode-title');

        if (titleElement) {
            let titleText = titleElement.textContent.trim();

            // If the title element is empty, do nothing
            if (!titleText) return;

            // Optional: Add suffix to easily identify the website
            if (KEEP_SUFFIX) {
                titleText = titleText + " - AI Studio";
            }

            // Only update the document title if it differs from the current one
            // This prevents unnecessary updates
            if (document.title !== titleText) {
                document.title = titleText;
            }
        }
    }

    // Since AI Studio is a Single Page Application (SPA), the content changes without a full reload.
    // We use a standard interval to check for title changes every second.
    setInterval(updateTitle, 1000);

})();
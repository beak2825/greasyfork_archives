// ==UserScript==
// @name         Fix SharePoint "Sign in to continue" bug
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the 'Not now' button on SharePoint login pop-ups.
// @author       Gemini 2.5 Pro & Lukas Tesar <lukastesar03@gmail.com>
// @match        https://*.sharepoint.com/*
// @icon         https://www.microsoft.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550185/Fix%20SharePoint%20%22Sign%20in%20to%20continue%22%20bug.user.js
// @updateURL https://update.greasyfork.org/scripts/550185/Fix%20SharePoint%20%22Sign%20in%20to%20continue%22%20bug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonSelector = "div.ms-Dialog-actions .ms-Button--default";

    const findAndClick = () => {
        const button = document.querySelector(buttonSelector);

        // Check if the button exists and is visible on the page.
        // An element's offsetParent is null if it or its ancestors are hidden via `display: none`.
        if (button && button.offsetParent !== null) {
            button.click();
        }
    };

    const observerCallback = () => {
        findAndClick();
    };

    /*
     * Configure the observer to watch for:
     * - childList: New elements being added/removed from the DOM.
     * - attributes: Changes to element attributes (like 'style' or 'class' for visibility).
     * - subtree: The entire document body and all its descendants.
    */
    const observerConfig = {
        childList: true,
        attributes: true,
        subtree: true,
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, observerConfig);

    // Run once on initial script load in case the popup is already present.
    findAndClick();
})();
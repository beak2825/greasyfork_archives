// ==UserScript==
// @name         Skip intro on Duck.ai
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Clicks on specific buttons based on the domain in order to skip clicking buttons and write directly to the chat. Also presets to GPT-5 model.
// @author       EB
// @match        https://duckduckgo.com/*
// @match        https://duck.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563912/Skip%20intro%20on%20Duckai.user.js
// @updateURL https://update.greasyfork.org/scripts/563912/Skip%20intro%20on%20Duckai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set local storage variable as soon as possible for duck.ai
    if (window.location.hostname.includes('duck.ai')) {
        localStorage.setItem('preferredDuckaiModel', '"203"');
    }

    // Set to store clicked XPaths to prevent multiple clicks
    const clickedXPaths = new Set();

    // Helper function to find a button by XPath, check visibility, and click it
    function clickElementByXPath(xpath) {
        // If we've already clicked this button, skip it
        if (clickedXPaths.has(xpath)) {
            return;
        }

        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // Check if element exists and is visible (offsetParent is null if hidden)
        if (element && element.offsetParent !== null) {
            element.click();
            clickedXPaths.add(xpath); // Mark as clicked
            console.log('Button clicked: ' + xpath);
        }
    }

    // Main function to check for the buttons
    function clickButtons() {
        const hostname = window.location.hostname;

        // --- Logic for DuckDuckGo.com ---
        if (hostname.includes('duckduckgo.com')) {
            clickElementByXPath('/html/body/div[2]/div[6]/div[4]/div/div[2]/div/div/div[2]/div/button');
        }

        // --- Logic for Duck.ai ---
        if (hostname.includes('duck.ai')) {
            // Button 2
            clickElementByXPath('/html/body/div[1]/div/div/div[2]/div/button');

            // Button 3
            clickElementByXPath('/html/body/div[9]/div/div/div[3]/div/button');

            // Button 4
            clickElementByXPath('/html/body/div[10]/div/div/div[3]/div/button');
        }
    }

    // Create a MutationObserver to watch for changes in the body
    const observer = new MutationObserver((mutations) => {
        // We don't need to iterate through every mutation; just triggering the check is enough
        clickButtons();
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
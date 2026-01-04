// ==UserScript==
// @name         Bring back next video button
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       Etshy
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @description Show the hidden next video button
// @downloadURL https://update.greasyfork.org/scripts/550685/Bring%20back%20next%20video%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/550685/Bring%20back%20next%20video%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showNextButton() {
        waitForElm('.ytp-next-button').then(elm => {
            elm.style.removeProperty("display");
        });
    }

    // A helper function to wait for a specific element to exist in the DOM.
    function waitForElm(selector) {
        return new Promise(resolve => {
            //If the element already exists, resolve the Promise
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            //Or observe document.body
            const observer = new MutationObserver(mutations => {
                //as soon as the element exists, resolve the Promise
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Initial run of the script.
    showNextButton();

    // Listen for URL changes and re-run the script.
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            showNextButton();
        }
    });

    // Observe the body for changes in the subtree, which indicates a new page load.
    urlObserver.observe(document, {
        childList: true,
        subtree: true
    });
})();

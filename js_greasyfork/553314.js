// ==UserScript==
// @name         Udemy Quiz Un-Pauser
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Instantly removes the "Your test is paused" modal from the page, leaving the quiz content intact and scrollable.
// @author       Gemini
// @license MIT
// @match        *://www.udemy.com/course/*/quiz/*
// @match        *://www.udemy.com/course/*/learn/quiz/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553314/Udemy%20Quiz%20Un-Pauser.user.js
// @updateURL https://update.greasyfork.org/scripts/553314/Udemy%20Quiz%20Un-Pauser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Attempts to find and click the modal dialog to dismiss it.
     * This function is more reliable as it mimics user interaction.
     */
    function dismissModal() {
        // Target the specific container class that holds the pop-up and its background.
        const dialogContainer = document.querySelector('.modal-module--dialog-container--URcz3');
        if (dialogContainer) {
            console.log('Udemy Quiz Un-Pauser: Found the modal container. Attempting to click it to dismiss.');
            // This click event is the key to solving the issue.
            dialogContainer.click();
        }

        // Failsafe: if the modal is still somehow present, try to find and click the "Resume test" button.
        const resumeButton = document.querySelector('[data-purpose="resume-button"]');
        if (resumeButton) {
            console.log('Udemy Quiz Un-Pauser: Found the "Resume test" button. Clicking it to dismiss the modal.');
            resumeButton.click();
        }
    }

    // Use a MutationObserver to watch for changes to the DOM.
    // This is the most reliable and performant way to catch dynamically added elements.
    const observer = new MutationObserver((mutationsList, obs) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                dismissModal();
            }
        }
    });

    // Start observing the document body for new nodes.
    observer.observe(document.body, { childList: true, subtree: true });

    // As a failsafe, also run the check every second in case the observer is missed.
    setInterval(dismissModal, 1000);

})();

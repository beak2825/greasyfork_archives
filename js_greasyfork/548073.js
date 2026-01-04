// ==UserScript==
// @name         Green Donkeys
// @description  Changes positive donkey channel indicators from pink to green
// @include      /^https?://(www\.)?ovtlyr\.com/market-breadth$/
// @run-at       document-idle
// @grant        none
// @license      GPL
// @version 0.0.1.20250901221808
// @namespace https://greasyfork.org/users/1509889
// @downloadURL https://update.greasyfork.org/scripts/548073/Green%20Donkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/548073/Green%20Donkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process a single element
    function processElement(element) {
        // Check if the element has the 'block_txt' and 'pinkBg' classes
        if (element.classList.contains('block_txt') && element.classList.contains('pinkBg')) {
            const textContent = element.textContent;

            // Use a regular expression to find the number in the string
            const match = textContent.match(/OC : (-?\d+)/);

            if (match) {
                const number = parseInt(match[1], 10);

                // If the number is positive, change the class
                if (number > 0) {
                    element.classList.remove('pinkBg');
                    element.classList.add('greenBg');
                }
            }
        }
    }

    // Function to observe the DOM for new elements
    function observeDOM() {
        // Create a MutationObserver to watch for changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Check if it's an element
                        // Process the node itself if it's a match
                        processElement(node);
                        // Also check for matching elements inside the added node
                        node.querySelectorAll('.block_txt.pinkBg').forEach(processElement);
                    }
                });
            });
        });

        // Start observing the entire document body for changes
        observer.observe(document.body, { childList: true, subtree: true });

        // Run the script on all existing elements on initial page load
        document.querySelectorAll('.block_txt.pinkBg').forEach(processElement);
    }

    // Start observing the DOM
    observeDOM();

})();
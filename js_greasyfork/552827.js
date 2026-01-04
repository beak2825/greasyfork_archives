// ==UserScript==
// @name         Torn Trade Chat Max Length Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes trade chat textarea maxlength from 125 to 500 characters
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552827/Torn%20Trade%20Chat%20Max%20Length%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/552827/Torn%20Trade%20Chat%20Max%20Length%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify maxlength of trade chat textareas
    function modifyMaxLength() {
        // Find all textareas with the specific class
        const textareas = document.querySelectorAll('textarea.textarea___V8HsV');

        textareas.forEach(textarea => {
            if (textarea.getAttribute('maxlength') === '125') {
                textarea.setAttribute('maxlength', '500');
            }
        });
    }

    // Run immediately when script loads
    modifyMaxLength();

    // Run when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyMaxLength);
    } else {
        modifyMaxLength();
    }

    // Create a MutationObserver to watch for dynamically added content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if new nodes were added
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    // Only process element nodes
                    if (node.nodeType === 1) {
                        // Check if the added node is a textarea with our class
                        if (node.matches && node.matches('textarea.textarea___V8HsV')) {
                            if (node.getAttribute('maxlength') === '125') {
                                node.setAttribute('maxlength', '500');
                            }
                        }
                        // Also check for textareas within the added node
                        const childTextareas = node.querySelectorAll ? node.querySelectorAll('textarea.textarea___V8HsV') : [];
                        childTextareas.forEach(textarea => {
                            if (textarea.getAttribute('maxlength') === '125') {
                                textarea.setAttribute('maxlength', '500');
                            }
                        });
                    }
                });
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
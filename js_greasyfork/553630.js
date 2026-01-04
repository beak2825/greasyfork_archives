// ==UserScript==
// @name         Remove Code Indentation and Asterisks
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes indentation and asterisks from code blocks on specific websites.
// @match        https://www.aiuncensored.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553630/Remove%20Code%20Indentation%20and%20Asterisks.user.js
// @updateURL https://update.greasyfork.org/scripts/553630/Remove%20Code%20Indentation%20and%20Asterisks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove indentation and asterisks from a code element
    function cleanCodeElement(codeElement) {
        const textNode = codeElement.firstChild;

        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            let text = textNode.textContent;
            // Remove leading and trailing whitespace, including indentation
            text = text.replace(/^\s+|\s+$/g, '');
            // Remove asterisks
            text = text.replace(/\*/g, '');
            textNode.textContent = text;
        }
    }

    // Observe for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    // Check if the added node is an element and contains a code element
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const codeElements = node.querySelectorAll('code');
                        codeElements.forEach(cleanCodeElement);
                    }
                });
            }
        });
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up existing code elements on the page
    document.querySelectorAll('code').forEach(cleanCodeElement);

})();
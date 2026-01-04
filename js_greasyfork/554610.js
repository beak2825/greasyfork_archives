// ==UserScript==
// @name         Remove Asterisk Symbols from Text
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Removes all asterisk (*) symbols from visible text on any website
// @author       YourName
// @match        https://www.aiuncensored.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554610/Remove%20Asterisk%20Symbols%20from%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/554610/Remove%20Asterisk%20Symbols%20from%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper: Recursively process all text nodes under a root element
    function removeAsterisks(root) {
        // Skip certain elements for safety and performance
        const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'OPTION']);
        if (root.nodeType === Node.TEXT_NODE) {
            // Replace * with '' in text nodes if present
            if (root.nodeValue && root.nodeValue.includes('*')) {
                root.nodeValue = root.nodeValue.replace(/\*/g, '');
            }
        } else if (root.nodeType === Node.ELEMENT_NODE && !SKIP_TAGS.has(root.tagName)) {
            // Recurse into child nodes
            for (let i = 0; i < root.childNodes.length; i++) {
                removeAsterisks(root.childNodes[i]);
            }
        }
    }

    // Initial run for already-loaded content
    removeAsterisks(document.body);

    // Observe changes for dynamic content
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            // Handle new nodes added to the DOM
            for (const node of mutation.addedNodes) {
                // Only process elements or text nodes
                if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                    removeAsterisks(node);
                }
            }
            // Process text changes directly
            if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
                removeAsterisks(mutation.target);
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true
    });

    // Optional: Re-run removal when DOM is fully loaded, just in case script loaded early
    if (document.readyState !== 'complete') {
        window.addEventListener('DOMContentLoaded', () => {
            removeAsterisks(document.body);
        });
    }
})();
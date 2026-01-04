// ==UserScript==
// @name         Force Dark Mode & Aggressively Clean Text
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Forces dark mode, removes specific characters (*, -, —), and eliminates leading whitespace/indentation from all text content on a page.
// @author       YourName
// @match        https://www.aiuncensored.info/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553629/Force%20Dark%20Mode%20%20Aggressively%20Clean%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/553629/Force%20Dark%20Mode%20%20Aggressively%20Clean%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. FORCE DARK MODE THEME (Visual Style)
    // This section forces the dark background and light text style you requested.
    GM_addStyle(`
        html, body {
            background-color: #1a1a1a !important; /* Dark background */
            color: #e0e0e0 !important; /* Light text color */
            font-family: Arial, sans-serif !important; /* Clean font */
            line-height: 1.5 !important;
            padding: 0 !important; /* Try to clean up body padding */
            margin: 0 !important;
        }

        /* Adjustments for various elements to ensure styling consistency */
        body, div, p, span, a, li, ul, ol, h1, h2, h3, h4, h5, h6 {
            background-color: inherit !important;
            color: inherit !important;
            border-color: #333 !important;
            /* Force left alignment and zero padding/margins on blocks */
            text-align: left !important;
            margin-left: 0 !important;
            padding-left: 0 !important;
        }

        /* Specific clean-up for pre-formatted text (like code blocks) */
        pre, code {
            white-space: pre-wrap !important; /* Prevents horizontal scrolling */
        }
    `);


    // 2. TEXT CLEANING AND REFORMATTING LOGIC
    function cleanAndFormatText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;

            // --- Aggressive Character Removal ---
            // 1. Remove all asterisks, hyphens, and em dashes.
            text = text.replace(/[\*—-]/g, '');

            // 2. Remove Indentation/Leading Whitespace
            // This targets any whitespace (spaces, tabs) at the beginning of a line.
            // This is the most effective way to remove typical indentation.
            text = text.replace(/^[ \t]+/gm, '');

            // 3. Normalize multiple newlines to single newlines (optional but helpful)
            // text = text.replace(/\n\s*\n/g, '\n\n').trim();

            // --- Update the node's value if it changed ---
            if (text !== node.nodeValue) {
                node.nodeValue = text;
            }

        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Recursively process child nodes, but skip script and style elements
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'HEAD') {
                for (let i = 0; i < node.childNodes.length; i++) {
                    cleanAndFormatText(node.childNodes[i]);
                }
            }
        }
    }

    // Run the cleaning and formatting on the entire document body after a short delay
    // The delay helps ensure all initial content has loaded before processing.
    setTimeout(() => {
        cleanAndFormatText(document.body);
    }, 500);


    // 3. MUTATION OBSERVER (Handle Dynamically Loaded Content)
    // Watches for new content being added to the page and cleans it instantly.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // Only process elements (skip text nodes being added for performance)
                if (node.nodeType === Node.ELEMENT_NODE) {
                    cleanAndFormatText(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
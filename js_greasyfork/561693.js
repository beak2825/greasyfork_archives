// ==UserScript==
// @name        Magnet Hash Autolinker
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      chimez
// @description Converts 40-char hex hashes into clickable magnet links
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561693/Magnet%20Hash%20Autolinker.user.js
// @updateURL https://update.greasyfork.org/scripts/561693/Magnet%20Hash%20Autolinker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 1. The Regex: Matches exactly 40 hexadecimal characters (case insensitive)
    // \b ensures we don't cut off longer strings or match inside css/js code
    const hashRegex = /\b[a-fA-F0-9]{40}\b/g;

    // 2. Tags to ignore (to avoid breaking scripts, styles, or existing links)
    const ignoredTags = new Set(['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'BUTTON', 'CODE', 'PRE']);

    /**
     * scans a specific DOM node (and its children) for hashes
     */
    function processNode(rootNode) {
        // We only care about Elements (1) to traverse, but we actually modify Text Nodes (3)
        if (!rootNode || !rootNode.nodeType) return;

        // Create a TreeWalker to find all text nodes under the rootNode
        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip if parent is a forbidden tag (e.g. don't link inside a <script> or existing <a>)
                    if (node.parentNode && ignoredTags.has(node.parentNode.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip if text doesn't contain a hash (optimization)
                    if (!hashRegex.test(node.nodeValue)) {
                        return NodeFilter.FILTER_SKIP;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodesToReplace = [];

        // Collect nodes first to avoid messing up the walker while modifying the DOM
        while (walker.nextNode()) {
            nodesToReplace.push(walker.currentNode);
        }

        // Process the collected nodes
        nodesToReplace.forEach(textNode => {
            replaceTextWithLinks(textNode);
        });
    }

    /**
     * Replaces the text node with a DocumentFragment containing the text and the new links
     */
    function replaceTextWithLinks(textNode) {
        const text = textNode.nodeValue;
        let match;
        let lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let found = false;

        // Reset regex state
        hashRegex.lastIndex = 0;

        while ((match = hashRegex.exec(text)) !== null) {
            found = true;

            // 1. Append text before the match
            const before = text.substring(lastIndex, match.index);
            if (before) fragment.appendChild(document.createTextNode(before));

            // 2. Create the link
            const a = document.createElement('a');
            const hash = match[0];
            a.href = `magnet:?xt=urn:btih:${hash}`;
            a.textContent = hash;
            a.style.color = 'green'; // Optional: make it distinct
            a.style.fontWeight = 'bold';
            a.title = "Click to open Magnet Link";
            fragment.appendChild(a);

            lastIndex = hashRegex.lastIndex;
        }

        // If we found matches, append the rest of the text and replace the original node
        if (found) {
            const after = text.substring(lastIndex);
            if (after) fragment.appendChild(document.createTextNode(after));
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }

    // --- Execution ---

    // 1. Run on initial page load
    processNode(document.body);

    // 2. Run on dynamic content changes (AJAX/Infinite Scroll)
    const observer = new MutationObserver(mutations => {
        // We debounce or just limit scope to avoid freezing browser on huge updates
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                // If an element was added, scan it
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processNode(node);
                }
                // If a text node was added directly (rare but possible)
                else if (node.nodeType === Node.TEXT_NODE) {
                    // Check parent before processing
                    if (node.parentNode && !ignoredTags.has(node.parentNode.tagName)) {
                        replaceTextWithLinks(node);
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
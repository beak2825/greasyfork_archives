// ==UserScript==
// @name         DOI to Google Scholar Link
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add Google Scholar links next to DOIs on any page
// @author       You
// @match        *://*/*
// @exclude      *://scholar.google.com/*
// homepage      https://greasyfork.org/en/scripts/563946
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563946/DOI%20to%20Google%20Scholar%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/563946/DOI%20to%20Google%20Scholar%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DOI regex patterns
    // Pattern 1: Full DOI URLs (https://doi.org/10.xxxx)
    const doiURLPattern = /https?:\/\/doi\.org\/(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?![\"&\'<>])\S)*)/gi;

    // Pattern 2: DOI text format (doi: 10.xxxx or doi:10.xxxx)
    const doiTextPattern = /\b(?:doi|DOI)\s*:\s*(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?![\"&\'<>])\S)*)/gi;

    // Function to create Scholar link
    function createScholarLink(doi) {
        const link = document.createElement('a');
        link.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(doi)}`;
        link.textContent = ' 🎓';
        link.title = 'Search in Google Scholar';
        link.target = '_blank';
        link.style.textDecoration = 'none';
        link.style.marginLeft = '4px';
        return link;
    }

    // Function to process text nodes for plain text DOI URLs and DOI text
    function processTextNode(node) {
        const text = node.textContent;

        // Find all matches from both patterns
        const urlMatches = [...text.matchAll(doiURLPattern)];
        const textMatches = [...text.matchAll(doiTextPattern)];

        // Combine and sort matches by position
        const allMatches = [...urlMatches, ...textMatches].sort((a, b) => a.index - b.index);

        if (allMatches.length === 0) return;

        const parent = node.parentNode;
        if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;

        // Skip if parent is a link (anchor tag)
        if (parent.tagName === 'A') return;

        let lastIndex = 0;
        const fragment = document.createDocumentFragment();

        allMatches.forEach(match => {
            const fullMatch = match[0];
            const doi = match[1];
            const startIndex = match.index;

            // Skip overlapping matches
            if (startIndex < lastIndex) return;

            // Add text before DOI
            if (startIndex > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, startIndex)));
            }

            // Add DOI text/URL
            fragment.appendChild(document.createTextNode(fullMatch));

            // Add Scholar link
            fragment.appendChild(createScholarLink(doi));

            lastIndex = startIndex + fullMatch.length;
        });

        // Add remaining text
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        parent.replaceChild(fragment, node);
    }

    // Function to process anchor elements with DOI links
    function processAnchor(anchor) {
        // Skip if already has a scholar link after it
        if (anchor.nextSibling?.textContent?.includes('🎓')) return;

        const href = anchor.href;

        // Check if it's a DOI link (https://doi.org/10.xxxx/...)
        if (href && href.includes('doi.org/10.')) {
            const match = href.match(/10\.\d{4,}(?:\.\d+)*\/\S+/);
            if (match) {
                const doi = match[0];
                const scholarLink = createScholarLink(doi);
                anchor.parentNode.insertBefore(scholarLink, anchor.nextSibling);
            }
        }
    }

    // Walk through all text nodes and anchor elements
    function processPage() {
        // Process text nodes for plain text DOI URLs
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip script, style, and already processed nodes
                    if (node.parentNode.tagName === 'SCRIPT' ||
                        node.parentNode.tagName === 'STYLE' ||
                        node.textContent.includes('🎓')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            textNodes.push(currentNode);
        }

        textNodes.forEach(processTextNode);

        // Process anchor elements with DOI links
        document.querySelectorAll('a[href*="doi.org/10."]').forEach(processAnchor);
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processPage);
    } else {
        processPage();
    }

    // Watch for dynamic content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Process new text nodes
                    const walker = document.createTreeWalker(
                        node,
                        NodeFilter.SHOW_TEXT,
                        null
                    );
                    let textNode;
                    while (textNode = walker.nextNode()) {
                        if (!textNode.textContent.includes('🎓')) {
                            processTextNode(textNode);
                        }
                    }
                    // Process new anchor elements
                    if (node.tagName === 'A' && node.href && node.href.includes('doi.org/10.')) {
                        processAnchor(node);
                    }
                    node.querySelectorAll('a[href*="doi.org/10."]').forEach(processAnchor);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
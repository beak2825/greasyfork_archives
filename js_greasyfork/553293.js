// ==UserScript==
// @name         8chan Replace Blank Filenames with Href Name
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces blank filenames (like ".png") with the actual filename from the href attribute
// @author       Your Name
// @match        *://8chan.moe/*/res/*
// @match        *://8chan.se/*/res/*
// @match        *://8chan.cc/*/res/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/res/*
// @match        *://8chan.moe/*/last/*
// @match        *://8chan.se/*/last/*
// @match        *://8chan.cc/*/last/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*/last/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553293/8chan%20Replace%20Blank%20Filenames%20with%20Href%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/553293/8chan%20Replace%20Blank%20Filenames%20with%20Href%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract filename from URL
    function getFilenameFromUrl(url) {
        // Handle cases where URL might have query parameters or fragments
        const cleanUrl = url.split('?')[0].split('#')[0];
        const parts = cleanUrl.split('/');
        return parts[parts.length - 1];
    }

    // Function to process a single link
    function processLink(link) {
        const currentText = link.textContent.trim();
        // Check if the text is just an extension (like ".png") or blank
        if (currentText === '' || (currentText.startsWith('.') && currentText.split('.').length === 2)) {
            const href = link.getAttribute('href');
            if (href) {
                const filename = getFilenameFromUrl(href);
                link.textContent = filename;

                // Also update the download attribute if it exists
                if (link.hasAttribute('download')) {
                    link.setAttribute('download', filename);
                }
            }
        }
    }

    // Main function to process all matching links in a container
    function replaceBlankFilenames(container = document) {
        const links = container.querySelectorAll('a.originalNameLink');
        links.forEach(processLink);
    }

    // Initial processing
    replaceBlankFilenames();

    // Set up MutationObserver for dynamic content
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Process added nodes
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // If this is a container that might have links, process it
                    if (node.matches('a.originalNameLink')) {
                        processLink(node);
                    }
                    // Also look for links within added nodes
                    const links = node.querySelectorAll?.('a.originalNameLink') || [];
                    links.forEach(processLink);
                }
            }
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Optional: If you know specific containers where dynamic content loads
    // you can add additional observers for those containers
    const postsContainer = document.querySelector('.posts-container') || document.body;
    const postObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.postCell')) {
                    replaceBlankFilenames(node);
                }
            }
        }
    });
    postObserver.observe(postsContainer, { childList: true, subtree: true });

    // For quote hover functionality (similar to your example)
    const quoteTooltip = document.querySelector('.quote-tooltip') || document.body;
    const hoverObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.innerPost')) {
                    replaceBlankFilenames(node);
                }
            }
        }
    });
    hoverObserver.observe(quoteTooltip, { childList: true });

    // For inline quotes
    postsContainer.addEventListener("click", (evt) => {
        const quoteLink = evt.target.closest(".quoteLink");
        if (quoteLink) {
            setTimeout(() => {
                if (quoteLink.nextElementSibling?.classList.contains("inlineQuote")) {
                    replaceBlankFilenames(quoteLink.nextElementSibling);
                }
            }, 0);
        }
    });
})();
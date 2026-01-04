// ==UserScript==
// @name         Reddit to Narwhal URL Rewriter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Rewrite Reddit URLs to open in Narwhal 2 app on iOS
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550813/Reddit%20to%20Narwhal%20URL%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/550813/Reddit%20to%20Narwhal%20URL%20Rewriter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redditDomains = ['reddit.com', 'www.reddit.com', 'old.reddit.com', 'm.reddit.com', 'reddit.app.link'];

    // Function to check if URL is a Reddit URL
    function isRedditURL(url) {
        try {
            const urlObj = new URL(url);
            return redditDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
        } catch {
            return false;
        }
    }

    // Function to convert Reddit URL to Narwhal URL
    function convertToNarwhalURL(url) {
        return 'narwhal://open-url/' + encodeURIComponent(url);
    }

    // Handle direct navigation to Reddit
    function handleDirectNavigation() {
        if (isRedditURL(window.location.href)) {
            const narwhalURL = convertToNarwhalURL(window.location.href);
            window.location.href = narwhalURL;
            // Try to close the tab after redirect
            setTimeout(() => window.close(), 500);
            return true;
        }
        return false;
    }

    // Rewrite Reddit links on the page
    function rewriteRedditLinks() {
        const links = document.querySelectorAll('a[href*="reddit"]');
        links.forEach(link => {
            if (link.href && !link.href.startsWith('narwhal://') && isRedditURL(link.href)) {
                link.href = convertToNarwhalURL(link.href);
            }
        });
    }

    // Handle dynamically added links
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'A' && node.href && isRedditURL(node.href)) {
                                node.href = convertToNarwhalURL(node.href);
                            }
                            // Check child links
                            const links = node.querySelectorAll?.('a[href*="reddit"]');
                            links?.forEach(link => {
                                if (link.href && !link.href.startsWith('narwhal://') && isRedditURL(link.href)) {
                                    link.href = convertToNarwhalURL(link.href);
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Main execution
    if (handleDirectNavigation()) {
        return; // We're redirecting from Reddit itself
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            rewriteRedditLinks();
            setupMutationObserver();
        });
    } else {
        rewriteRedditLinks();
        setupMutationObserver();
    }

    // Also rewrite links immediately if body exists
    if (document.body) {
        rewriteRedditLinks();
    }
})();
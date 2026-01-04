// ==UserScript==
// @name         4chan.org to kiwi.st Redirector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirects all 4chan.org URLs to kiwi.st, except find.4chan.org and specific endpoints
// @author       Joshua Moon
// @match        *://*.4chan.org/*
// @match        *://4chan.org/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548651/4chanorg%20to%20kiwist%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/548651/4chanorg%20to%20kiwist%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of excluded paths
    const excludedPaths = [
        '/faq',
        '/feedback',
        '/legal',
        '/contact',
        '/blotter',
        '/4channews.php',
        '/advertise',
        '/press',
        '/japanese',
        '/frames',
        '/rules'
    ];

    // Function to check if current URL should be excluded
    function shouldExcludeRedirect(url) {
        // Skip find.4chan.org entirely
        if (url.includes('find.4chan.org')) {
            return true;
        }

        // Check if the path matches any excluded paths
        const urlObj = new URL(url);
        return excludedPaths.some(path => urlObj.pathname === path);
    }

    // Main URL redirect
    const currentURL = window.location.href;
    if (currentURL.includes('4chan.org') && !shouldExcludeRedirect(currentURL)) {
        const newURL = currentURL.replace(/4chan\.org/g, 'kiwi.st');
        if (newURL !== currentURL) {
            window.location.replace(newURL);
            return; // Stop execution after redirect
        }
    }

    // Function to check if a link should be rewritten
    function shouldRewriteLink(linkUrl) {
        // Skip find.4chan.org links
        if (linkUrl.includes('find.4chan.org')) {
            return false;
        }

        // Check if the link path matches any excluded paths
        try {
            const urlObj = new URL(linkUrl);
            return !excludedPaths.some(path => urlObj.pathname === path);
        } catch (e) {
            // If URL parsing fails, be conservative and don't rewrite
            return false;
        }
    }

    // Link rewriting function
    function rewriteLinks() {
        document.querySelectorAll('a[href*="4chan.org"]').forEach(link => {
            try {
                if (shouldRewriteLink(link.href)) {
                    link.href = link.href.replace(/4chan\.org/g, 'kiwi.st');
                }
            } catch (e) {
                // Skip invalid URLs
                console.log('Skipping invalid URL:', link.href);
            }
        });
    }

    // MutationObserver for dynamically added content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            rewriteLinks();
        });
    });

    // Initialize link rewriting
    window.addEventListener('DOMContentLoaded', () => {
        rewriteLinks();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
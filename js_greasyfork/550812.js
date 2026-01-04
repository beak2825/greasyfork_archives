// ==UserScript==
// @name         YouTube to iOS App Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rewrite YouTube URLs to youtube:// scheme for iOS app opening
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550812/YouTube%20to%20iOS%20App%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/550812/YouTube%20to%20iOS%20App%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to rewrite YouTube URLs
    function rewriteYouTubeURL(url) {
        try {
            const urlObj = new URL(url);
            
            // Check if it's a YouTube URL
            if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com' || 
                urlObj.hostname === 'm.youtube.com' || urlObj.hostname === 'youtu.be') {
                
                // Handle different YouTube URL formats
                if (urlObj.hostname === 'youtu.be') {
                    // Short URL format: youtu.be/VIDEO_ID
                    const videoId = urlObj.pathname.slice(1);
                    return `youtube://www.youtube.com/watch?v=${videoId}`;
                } else {
                    // Regular YouTube URL
                    return url.replace(/^https?:\/\//, 'youtube://');
                }
            }
        } catch (e) {
            // Invalid URL, return original
        }
        return url;
    }

    // Intercept link clicks
    document.addEventListener('click', function(e) {
        let target = e.target;
        
        // Find the actual link element if clicked on a child element
        while (target && target !== document && target.tagName !== 'A') {
            target = target.parentNode;
        }
        
        if (target && target.tagName === 'A' && target.href) {
            const rewrittenURL = rewriteYouTubeURL(target.href);
            
            if (rewrittenURL !== target.href) {
                e.preventDefault();
                window.location.href = rewrittenURL;
            }
        }
    }, true);

    // Optionally, rewrite all links on page load
    function rewriteAllLinks() {
        const links = document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
        links.forEach(link => {
            const rewrittenURL = rewriteYouTubeURL(link.href);
            if (rewrittenURL !== link.href) {
                link.href = rewrittenURL;
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', rewriteAllLinks);
    } else {
        rewriteAllLinks();
    }

    // Watch for dynamically added links
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'A' && node.href) {
                        const rewrittenURL = rewriteYouTubeURL(node.href);
                        if (rewrittenURL !== node.href) {
                            node.href = rewrittenURL;
                        }
                    }
                    // Check child links
                    const links = node.querySelectorAll && node.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
                    if (links) {
                        links.forEach(link => {
                            const rewrittenURL = rewriteYouTubeURL(link.href);
                            if (rewrittenURL !== link.href) {
                                link.href = rewrittenURL;
                            }
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
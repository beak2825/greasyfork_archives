// ==UserScript==
// @name         Medium to Scribe Redirector
// @namespace    https://scribe.rip/
// @version      1.0
// @description  Redirect Medium articles to Scribe for free reading
// @author       Arkina Romeon
// @match        *://medium.com/*
// @match        *://*.medium.com/*
// @exclude      *://medium.com/
// @exclude      *://*.medium.com/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557735/Medium%20to%20Scribe%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/557735/Medium%20to%20Scribe%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if current URL is a Medium article page
    function isMediumArticle(url) {
        // Medium articles typically follow these patterns:
        // - medium.com/@username/article-title-hash
        // - username.medium.com/article-title-hash
        const mediumPattern = /(?:medium\.com\/[^\/]+\/[^\/]+|\.medium\.com\/[^\/]+)/;
        return mediumPattern.test(url);
    }

    // Convert Medium URL to Scribe URL
    function convertToScribeUrl(mediumUrl) {
        try {
            const url = new URL(mediumUrl);
            let scribeUrl = 'https://scribe.rip' + url.pathname;
            
            // Preserve query parameters (if any)
            if (url.search) {
                scribeUrl += url.search;
            }
            
            // Preserve hash fragment (if any)
            if (url.hash) {
                scribeUrl += url.hash;
            }
            
            return scribeUrl;
        } catch (e) {
            console.error('Error converting URL:', e);
            return null;
        }
    }

    // Main function
    function main() {
        const currentUrl = window.location.href;
        
        // Check if it's an article page (exclude homepage)
        if (isMediumArticle(currentUrl) && 
            !currentUrl.includes('/me/') && 
            !currentUrl.includes('/new-story') &&
            !currentUrl.includes('/edit/') &&
            !currentUrl.includes('/draft/')) {
            
            const scribeUrl = convertToScribeUrl(currentUrl);
            
            if (scribeUrl && scribeUrl !== currentUrl) {
                console.log(`Redirecting from Medium to Scribe: ${scribeUrl}`);
                window.location.replace(scribeUrl);
            }
        }
    }

    // Execute redirect check immediately
    main();

    // Listen for URL changes (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(main, 100); // Small delay to ensure DOM updates
        }
    }).observe(document, { subtree: true, childList: true });

})();

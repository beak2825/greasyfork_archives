// ==UserScript==
// @name         Search Engine Result Filter
// @namespace    https://github.com/smed79/search-engine-result-filter
// @version      1.1
// @description  Filters out specified domains from multiple search engines
// @author       smed79
// @license      GPLv3
// @icon         https://raw.githubusercontent.com/smed79/search-engine-result-filter/refs/heads/main/icon.png
// @match        https://www.google.*/search*
// @match        https://www.bing.com/search*
// @match        https://yandex.com/search*
// @match        https://duckduckgo.com/?*
// @match        https://*.startpage.com/*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558977/Search%20Engine%20Result%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558977/Search%20Engine%20Result%20Filter.meta.js
// ==/UserScript==

// How to Use?
// https://github.com/smed79/search-engine-result-filter#how-to-use

(function() {
    'use strict';

    // Configuration: List of domains to block with wildcard support
    const BLOCKED_DOMAINS = [
        '*.example.com',
        'www.example.org'
        // Add more domains here
    ];

    // Search engine-specific result container selectors
    // You can use comma-separated selectors to target multiple containers
    const SEARCH_ENGINES = {
        google: '.xpd',
        bing: '.b_algo',
        yandex: '.aR0S6LvzTmyFF',
        duckduckgo: '[id^="r1-"]',
        startpage: '.css-z73qjy, .result'  // Multiple selectors
        // Add more search engines here
    };

    // Function to detect current search engine
    function detectSearchEngine() {
        const hostname = window.location.hostname;
        if (hostname.includes('google.com')) return 'google';
        if (hostname.includes('bing.com')) return 'bing';
        if (hostname.includes('yandex.com')) return 'yandex';
        if (hostname.includes('duckduckgo.com')) return 'duckduckgo';
        if (hostname.includes('startpage.com')) return 'startpage';
        // Add more search engines as needed
        return null;
    }

    // Function to check if a hostname matches a domain pattern
    function matchesDomainPattern(hostname, pattern) {
        return hostname === pattern ||  // Exact match
               hostname === 'www.' + pattern ||  // www. subdomain
               hostname.endsWith('.' + pattern);  // Any subdomain
    }

    // Optimized function to check if a link matches blocked domains
    function isBlockedDomain(href) {
        try {
            const hostname = new URL(href).hostname;
            
            return BLOCKED_DOMAINS.some(pattern => 
                pattern.startsWith('*.') 
                    ? matchesDomainPattern(hostname, pattern.replace('*.', ''))
                    : hostname === pattern
            );
        } catch {
            return false;
        }
    }

    // Faster result hiding function
    function hideBlockedResults() {
        const currentEngine = detectSearchEngine();
        if (!currentEngine) return;

        const selector = SEARCH_ENGINES[currentEngine];
        const containers = document.querySelectorAll(selector);
        
        containers.forEach(container => {
            const links = container.querySelectorAll('a[href]');
            
            const shouldHide = Array.from(links).some(link => 
                isBlockedDomain(link.href)
            );

            if (shouldHide) {
                container.style.display = 'none';
            }
        });
    }

    // Optimization: Use requestAnimationFrame for smoother performance
    function efficientHideResults() {
        requestAnimationFrame(hideBlockedResults);
    }

    // Run on initial page load
    hideBlockedResults();

    // Set up a more efficient MutationObserver
    const observer = new MutationObserver((mutations) => {
        if (!observer.isProcessing) {
            observer.isProcessing = true;
            efficientHideResults();
            
            setTimeout(() => {
                observer.isProcessing = false;
            }, 100);
        }
    });

    // Configure the observer to watch for changes in the search results
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// ==UserScript==
// @name        Remove Perplexity Comet promotion and thread warning banners
// @match       https://www.perplexity.ai/*
// @grant       none
// @version     1.7
// @license     MIT
// @description Remove Comet promotion and thread warning banners
// @namespace your.namespace
// @downloadURL https://update.greasyfork.org/scripts/555131/Remove%20Perplexity%20Comet%20promotion%20and%20thread%20warning%20banners.user.js
// @updateURL https://update.greasyfork.org/scripts/555131/Remove%20Perplexity%20Comet%20promotion%20and%20thread%20warning%20banners.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function removeBanners() {
        // Target the common banner container classes
        const selectors = [
            'div.rounded-xl.shadow-xl',
            'div[role="alert"]',
            'div.h-bannerHeight',
            'div.absolute.bottom-4',
            'div.fixed.bottom-0.right-0'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent;
                if (text.includes('Comet can do this faster') || 
                    text.includes('Thread is getting long') ||
                    text.includes('Save this thread as a Space') ||
                    text.includes('Get AI power in your browser with Comet') ||
                    text.includes('Comet can plan your perfect itinerary') ||
                    text.includes('Invite your team') ||
                    text.includes('Try Comet, a faster, smarter browser')) {
                    el.remove();
                }
            });
        });
    }
    
    // Run immediately on page load
    removeBanners();
    
    // Watch for new elements being added
    const observer = new MutationObserver((mutations) => {
        removeBanners();
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

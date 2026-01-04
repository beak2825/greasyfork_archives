// ==UserScript==
// @name         AutoTrader.ca Sponsored Remover
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes "Sponsored" listings and ad banners from AutoTrader.ca search results.
// @match        https://www.autotrader.ca/*
// @icon         https://www.autotrader.ca/favicon.ico
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557326/AutoTraderca%20Sponsored%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/557326/AutoTraderca%20Sponsored%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEBUG = false;

    function log(msg) {
        if (DEBUG) console.log(`[AT Remover]: ${msg}`);
    }

    function removeSponsoredListings() {
        // 1. Identify Sponsored Listings by Data Attribute (Most robust method)
        const sponsoredArticles = document.querySelectorAll('article[data-relevance_adjustment="sponsored"]');
        
        // 2. Fallback: Identify by "Sponsored" text label inside the article
        // (Useful if they change the data attribute name in the future)
        const potentialSponsored = document.querySelectorAll('article p');
        const textBasedSponsored = [];
        
        potentialSponsored.forEach(p => {
            if (p.textContent.trim() === 'Sponsored' && p.className.includes('Sponsored_wrapper')) {
                const parentArticle = p.closest('article');
                if (parentArticle) textBasedSponsored.push(parentArticle);
            }
        });

        // Combine lists
        const allSponsored = new Set([...sponsoredArticles, ...textBasedSponsored]);

        // Remove them
        allSponsored.forEach(article => {
            if (article.style.display !== 'none') {
                article.style.display = 'none'; // Hiding is safer than removing for React apps
                log('Hid a sponsored listing.');
            }
        });
    }

    function removeAdBanners() {
        // Selects the horizontal banner ads inserted between legitimate listings
        // These usually have classes like 'AdContentBanner_adContentBannerMinHeight...'
        const adBanners = document.querySelectorAll('div[class*="AdContentBanner"]');
        
        // Also select the dedicated ad slot custom elements
        const adSlots = document.querySelectorAll('s24-ad-slot');

        // Also remove the "Sky" ads (side skyscrapers)
        const skyAds = document.querySelectorAll('div[class*="AdSky_"]');

        const allAds = [...adBanners, ...adSlots, ...skyAds];

        allAds.forEach(ad => {
            if (ad.style.display !== 'none') {
                ad.style.display = 'none';
                log('Hid an ad banner.');
            }
        });
    }

    function cleanPage() {
        removeSponsoredListings();
        removeAdBanners();
    }

    // --- Execution ---

    // 1. Run immediately on load
    cleanPage();

    // 2. Set up a MutationObserver to handle infinite scroll/dynamic loading
    // AutoTrader is a Next.js app, so listings load dynamically.
    const observer = new MutationObserver((mutations) => {
        let shouldClean = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                shouldClean = true;
                break;
            }
        }
        if (shouldClean) {
            cleanPage();
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    log('Script initialized.');

})();
// ==UserScript==
// @name         Remove Ads and expand content for Mobalytics
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove advertisement blocks and anti-adblock banners on Mobalytics.gg, and expand the content block.
// @author       Chickyd3v
// @match        https://mobalytics.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559204/Remove%20Ads%20and%20expand%20content%20for%20Mobalytics.user.js
// @updateURL https://update.greasyfork.org/scripts/559204/Remove%20Ads%20and%20expand%20content%20for%20Mobalytics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove advertisement elements
    function removeAds() {
        const adElements = document.querySelectorAll('div.m-1b70aff, div.m-mi6bts, div.m-1hsuptt, aside');
        if (adElements.length > 0) {
            adElements.forEach(ad => {
                // Check if it's an ad element (contains "Advertisement" text or has ad-related classes)
                const adText = ad.textContent || '';
                const isAd = adText.includes('Advertisement') ||
                           adText.includes('Remove ads') ||
                           ad.classList.contains('m-1b70aff') ||
                           ad.classList.contains('m-mi6bts') ||
                           ad.classList.contains('m-1hsuptt');

                if (isAd) {
                    ad.remove();
                }
            });
        }
    }

    // Function to expand main content area
    function expandMainContent() {
        // Target the main element with class m-7h4k23
        const mainElement = document.querySelector('main.m-7h4k23');
        if (mainElement) {
            // Set width to 1500px (expanded from 1200px)
            mainElement.style.width = '1500px';
            mainElement.style.maxWidth = '1500px';
        }

        // Target the div inside main that also needs width adjustment
        const mainContentDiv = document.querySelector('main.m-7h4k23 > div');
        if (mainContentDiv) {
            mainContentDiv.style.width = '1500px';
            mainContentDiv.style.maxWidth = '1500px';
        }

        // Also check for any container divs that might constrain the width
        const containerDiv = document.querySelector('div.m-njn7bv');
        if (containerDiv) {
            // Ensure the container allows the expanded width
            containerDiv.style.maxWidth = 'none';
        }
    }

    // Function to run all adjustments
    function applyAllChanges() {
        removeAds();
        expandMainContent();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllChanges);
    } else {
        applyAllChanges();
    }

    // Observe for dynamically added ads and re-apply changes
    const observer = new MutationObserver(() => {
        applyAllChanges();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Re-apply on window resize to ensure styles persist
    window.addEventListener('resize', expandMainContent);
})();

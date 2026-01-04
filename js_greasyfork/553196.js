// ==UserScript==
// @name        Remove Comet Ad from Perplexity
// @namespace   https://greasyfork.org/en/users/1528865-blati
// @match       https://www.perplexity.ai/*
// @grant       none
// @version     1.1
// @author      Blati
// @description Removes the Comet browser advertisement banner and download button from Perplexity AI
// @license     MIT
// @icon        https://www.perplexity.ai/favicon.ico
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/553196/Remove%20Comet%20Ad%20from%20Perplexity.user.js
// @updateURL https://update.greasyfork.org/scripts/553196/Remove%20Comet%20Ad%20from%20Perplexity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove Comet-related elements
    function removeCometElements() {
        // Remove the main banner ad
        const adBanners = document.querySelectorAll('div.rounded-xl.shadow-xl');
        adBanners.forEach(banner => {
            const text = banner.textContent;
            if (text && (text.includes('Comet can do this faster') || 
                        text.includes('Download Comet') || 
                        text.includes('AI-powered browser'))) {
                banner.remove();
            }
        });

        // Remove the horizontal banner with "Get AI power in your browser with Comet Assistant"
        const horizontalBanners = document.querySelectorAll('div.h-bannerHeight, div[class*="h-banner"]');
        horizontalBanners.forEach(banner => {
            const text = banner.textContent;
            if (text && (text.includes('Get AI power in your browser with Comet Assistant') ||
                        text.includes('Comet Assistant') ||
                        text.includes('Download Comet'))) {
                banner.remove();
            }
        });

        // Remove any div with bg-super class containing Comet-related text
        const bgSuperDivs = document.querySelectorAll('div.bg-super, div[class*="bg-super"]');
        bgSuperDivs.forEach(div => {
            const text = div.textContent;
            if (text && (text.includes('Comet') || 
                        text.includes('AI power in your browser'))) {
                div.remove();
            }
        });

        // Remove standalone "Download Comet" buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const text = button.textContent;
            if (text && text.includes('Download Comet')) {
                button.remove();
            }
        });
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeCometElements);
    } else {
        removeCometElements();
    }

    // Use MutationObserver to catch dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        removeCometElements();
    });

    // Start observing when document body is available
    const startObserving = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(startObserving, 100);
        }
    };

    startObserving();

    // CSS-based approach for instant hiding
    const style = document.createElement('style');
    style.textContent = `
        div.rounded-xl.shadow-xl:has([class*="Download Comet"]),
        div.rounded-xl.shadow-xl:has([class*="Comet can do this faster"]) {
            display: none !important;
        }
        div.h-bannerHeight {
            display: none !important;
        }
        div[class*="h-banner"]:has([class*="text-inverse"]) {
            display: none !important;
        }
        div.bg-super:has(svg):has([class*="Download Comet"]) {
            display: none !important;
        }
        button:has(span:contains("Download Comet")) {
            display: none !important;
        }
        button.bg-super:has(svg + span) {
            display: none !important;
        }
        button[class*="bg-super"][class*="text-inverse"]:has(span) {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);
})();
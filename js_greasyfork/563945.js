// ==UserScript==
// @name         YouTube Low Video Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove low count videos on main page
// @author       djh816
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/563945/YouTube%20Low%20Video%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/563945/YouTube%20Low%20Video%20Remover.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- CONFIGURATION ---
    const VIEW_THRESHOLD = 1000;
    // ---------------------

    const absoluteUrls = ['https://www.youtube.com', 'https://www.youtube.com/'];
    const partialUrls = ['https://www.youtube.com/watch?'];

    const removeSmallViews = () => {
        // Select spans from both old and new YouTube layouts
        const allMetadata = [...document.querySelectorAll('span.inline-metadata-item, span.yt-content-metadata-view-model__metadata-text')];

        const smallViewElements = allMetadata.filter((el) => {
            const text = el.textContent.toLowerCase();

            // Only process strings that contain "views" and don't have K, M, or B (thousands, millions, billions)
            if (text.includes('views') && !text.includes('k') && !text.includes('m') && !text.includes('b')) {

                // Handle "No views" or "1 view" cases
                if (text.includes('no views')) return true;

                // Extract number (remove commas and non-digits)
                const count = parseInt(text.replace(/[^0-9]/g, ''), 10);

                return !isNaN(count) && count < VIEW_THRESHOLD;
            }
            return false;
        });

        // Map to the actual container elements that need to be hidden
        const containersToHide = smallViewElements.map((el) =>
            el.closest('ytd-rich-item-renderer') ||
            el.closest('ytd-compact-video-renderer') ||
            el.closest('yt-lockup-view-model')
        ).filter(el => el && el.style.display !== 'none');

        if (containersToHide.length === 0) return false;

        containersToHide.forEach((el) => {
            // If it's the new lockup inside a grid, hide the whole grid item (rich-item)
            const gridItem = el.closest('ytd-rich-item-renderer');
            if (gridItem) {
                gridItem.style.display = 'none';
            } else {
                el.style.display = 'none';
            }
        });

        return true;
    }

    const interval = setInterval(() => {
        if (absoluteUrls.includes(window.location.href) || partialUrls.some(u => window.location.href.includes(u))) {
            removeSmallViews();
        }
    }, 1000);
})();
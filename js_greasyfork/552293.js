// ==UserScript==
// @name         XVideos Upload Date
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Displays the upload date 'cause that's a pretty basic thing that a video website should have.
// @author       nereids
// @match        https://www.xvideos.com/video*
// @grant        none
// @license      MIT
// @author       nereids
// @icon         https://icons.duckduckgo.com/ip3/xvideos.com.ico
// @downloadURL https://update.greasyfork.org/scripts/552293/XVideos%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/552293/XVideos%20Upload%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract uploadDate from JSON-LD
    function getUploadDate() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent);
                if (json.uploadDate) {
                    // Format the date to a readable string, e.g., "October 9, 2025"
                    return new Date(json.uploadDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            } catch (e) {
                console.error('Error parsing JSON-LD:', e);
            }
        }
        return 'Unknown';
    }

    // Get the upload date
    const uploadDate = getUploadDate();

    // Find the duration element: <span class="duration">1 h 31 min</span>
    const durationElement = document.querySelector('span.duration');

    if (durationElement) {
        // Create a new span element for the upload date
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `${uploadDate}`;
        dateSpan.className = 'duration'; // Reuse the same class for identical styling

        // Apply inline styles to ensure consistency (in case class is overridden)
        const style = {
            display: 'inline-block',
            fontSize: '15px',
            lineHeight: '22px',
            height: '22px',
            padding: '0 6px',
            background: '#de2600',
            borderRadius: '3px',
            color: '#FFFFFF',
            fontWeight: '700',
            margin: '5px 0 0 4px',
            verticalAlign: 'top'
        };

        Object.assign(dateSpan.style, style);

        // Insert the date span right after the duration element
        durationElement.parentNode.insertBefore(dateSpan, durationElement.nextSibling);
    } else {
        console.warn('Duration element not found. Selector may need adjustment.');
    }
})();
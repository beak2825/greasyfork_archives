// ==UserScript==
// @name         PornOne Upload Date
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds the EXACT upload date for videos. Not just the useless "XX days/months ago".
// @author       nereids
// @match        https://pornone.com/*
// @grant        none
// @icon         https://icons.duckduckgo.com/ip3/pornone.com.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553981/PornOne%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/553981/PornOne%20Upload%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract uploadDate from JSON-LD script
    function getUploadDateFromJSON() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (let script of scripts) {
            try {
                const data = JSON.parse(script.textContent.trim());
                if (data['@type'] === 'VideoObject' && data.uploadDate) {
                    return data.uploadDate;
                }
            } catch (e) {
                console.log('Failed to parse JSON-LD script:', e);
            }
        }
        return null;
    }

    // Function to add the date
    function addUploadDate() {
        const uploadDateStr = getUploadDateFromJSON();
        if (!uploadDateStr) {
            console.log('Upload date not found in JSON-LD');
            return;
        }

        // Parse the ISO date string
        const uploadDate = new Date(uploadDateStr);
        if (isNaN(uploadDate.getTime())) {
            console.log('Invalid upload date format:', uploadDateStr);
            return;
        }

        // Format as YYYY-MM-DD
        const formattedDate = uploadDate.toISOString().split('T')[0];

        // Find the exact span with the views text
        const targetElement = document.querySelector('span.text-left.mx-4.md\\:ml-0.md\\:my-2.font-medium.md\\:text-f15.text-warm-grey');
        if (!targetElement) {
            console.log('Views span element not found');
            return;
        }

        // Avoid adding multiple times
        if (targetElement.querySelector('.pornone-upload-date')) {
            return;
        }

        // Create the date span
        const dateSpan = document.createElement('span');
        dateSpan.className = 'pornone-upload-date';
        dateSpan.textContent = ` = ${formattedDate}`;

        // Match the exact Tailwind-style color
        dateSpan.style.setProperty('--tw-text-opacity', '1');
        dateSpan.style.color = 'rgba(136,136,136,var(--tw-text-opacity))';
        dateSpan.style.display = 'inline';

        // Append directly to the span
        targetElement.appendChild(dateSpan);

        console.log('Upload date added:', formattedDate);
    }

    // Run on load
    function runOnLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addUploadDate);
        } else {
            addUploadDate();
        }
    }

    runOnLoad();

    // Observe for dynamic content changes (in case the element loads later)
    const observer = new MutationObserver(function(mutations) {
        let shouldRun = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
            }
        });
        if (shouldRun) {
            setTimeout(addUploadDate, 500);
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
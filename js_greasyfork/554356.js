// ==UserScript==
// @name         TNAFlix Upload Date
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays exact upload date for a video instead of some X amount of time since upload.
// @author       nereids
// @license      MIT
// @icon         https://icons.duckduckgo.com/ip3/tnaflix.com.ico
// @match        https://www.tnaflix.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554356/TNAFlix%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/554356/TNAFlix%20Upload%20Date.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------------------------
    // Helper: format ISO date → “March 14, 2024”
    // -------------------------------------------------
    function formatUploadDate(isoString) {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    // -------------------------------------------------
    // 1. Find the JSON-LD script that contains uploadDate
    // -------------------------------------------------
    const jsonScript = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .find(script => {
            try {
                const data = JSON.parse(script.textContent);
                return data.uploadDate;
            } catch (e) {
                return false;
            }
        });

    if (!jsonScript) return;

    let jsonData;
    try {
        jsonData = JSON.parse(jsonScript.textContent);
    } catch (e) {
        console.error('Failed to parse JSON-LD');
        return;
    }

    const uploadDate = jsonData.uploadDate;
    if (!uploadDate) return;

    const formattedDate = formatUploadDate(uploadDate);

    // -------------------------------------------------
    // 2. Replace the “X year ago” text in the badge
    // -------------------------------------------------
    const badges = document.querySelectorAll('span.badge.badge-video.btn-nohover.my-auto');

    badges.forEach(badge => {
        // Look for the text node that contains “… ago”
        const agoNode = Array.from(badge.childNodes)
            .find(node => node.nodeType === Node.TEXT_NODE &&
                         /\d+\s*(year|month|day|week)s?\s+ago/i.test(node.textContent.trim()));

        if (agoNode) {
            // Preserve the clock icon, replace only the text part
            const icon = badge.querySelector('i.icon-clock-o');
            badge.innerHTML = '';               // clear everything
            if (icon) badge.appendChild(icon);  // re-add icon
            badge.appendChild(document.createTextNode(' ' + formattedDate));
        }
    });
})();
// ==UserScript==
// @name        Eporner Upload Date
// @namespace   http://tampermonkey.net/
// @version     0.8
// @description Displays the upload date to the right of the length and qualiy on Eporner video pages.
// @license     MIT
// @author      nereids
// @icon        https://icons.duckduckgo.com/ip3/eporner.com.ico
// @match       https://www.eporner.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/553785/Eporner%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/553785/Eporner%20Upload%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Safely extract and parse JSON-LD
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
        console.log('JSON-LD script tag not found.');
        return;
    }

    let jsonData;
    try {
        // Get raw text and clean it
        let raw = jsonLdScript.textContent.trim();

        // Fix common issues: unescaped newlines, tabs, etc.
        raw = raw.replace(/[\n\r\t]+/g, ' '); // Replace newlines/tabs with space
        raw = raw.replace(/\\+/g, '\\\\');    // Escape backslashes
        raw = raw.replace(/'/g, "\\'");       // Escape single quotes if any

        // Try parsing
        jsonData = JSON.parse(raw);
    } catch (e) {
        console.warn('JSON.parse failed, attempting manual fix...', e);

        // Fallback: Extract uploadDate using regex (robust)
        const uploadMatch = jsonLdScript.textContent.match(/"uploadDate"\s*:\s*"([^"]+)"/);
        if (!uploadMatch) {
            console.log('uploadDate not found even with regex.');
            return;
        }
        const uploadDate = uploadMatch[1];
        const formattedDate = new Date(uploadDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Insert with icon
        insertUploadDate(formattedDate);
        return;
    }

    // Normal path: JSON parsed successfully
    const uploadDate = jsonData.uploadDate;
    if (!uploadDate) {
        console.log('uploadDate not found in JSON-LD.');
        return;
    }

    const formattedDate = new Date(uploadDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    insertUploadDate(formattedDate);

    // Helper function to insert the date (shared)
    function insertUploadDate(dateText) {
        // Find ALL .vid-quality elements, use the LAST one
        const qualityElements = document.querySelectorAll('span.vid-quality');
        if (qualityElements.length === 0) {
            console.log('No .vid-quality element found.');
            return;
        }
        const qualityElement = qualityElements[qualityElements.length - 1]; // Use last one

        // Avoid adding multiple times
        if (qualityElement.nextSibling && qualityElement.nextSibling.classList && qualityElement.nextSibling.classList.contains('upload-date-span')) {
            return;
        }

        // Create span with SVG icon
        const dateSpan = document.createElement('span');
        dateSpan.className = 'upload-date-span'; // For deduplication
        dateSpan.style.marginLeft = '10px';
        dateSpan.style.color = '#999';
        dateSpan.style.fontSize = '12px';
        dateSpan.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align: middle; padding-right: 4px; display: inline-block; fill: #999;">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h10v2H7zm0 4h10v2H7zm0 4h10v2H7z"/>
            </svg>
            ${dateText}
        `;

        // Insert after quality
        qualityElement.parentNode.insertBefore(dateSpan, qualityElement.nextSibling);

        // Apply flex centering to h1
        const h1 = document.querySelector('#video-info h1');
        if (h1) {
            h1.style.display = 'flex';
            h1.style.alignItems = 'center';
            h1.style.justifyContent = 'flex-start';
        }

        // Style all spans
        h1.querySelectorAll('span').forEach(span => {
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.verticalAlign = 'middle';
            span.style.fontSize = '12px';
        });
    }
})();
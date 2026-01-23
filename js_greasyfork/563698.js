// ==UserScript==
// @name         Telegram Web: PDF Wide & Full Titles
// @namespace    https://web.telegram.org/
// @version      1.1
// @description  Expands message bubbles and shows full titles only for .pdf files.
// @author       Gemini
// @match        https://web.telegram.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563698/Telegram%20Web%3A%20PDF%20Wide%20%20Full%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/563698/Telegram%20Web%3A%20PDF%20Wide%20%20Full%20Titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS INJECTION: Layout Handling
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- GLOBAL STYLES --- */
        /* Remove width limits for the central message column on Web K */
        .MessageList, .messages-container {
            max-width: 100% !important;
        }

        /* --- WEB K HANDLING --- */
        /* Expand chat bubbles containing PDF files */
        .bubble.document-message:has(.document.ext-pdf) {
            max-width: 95% !important; /* Maximize expansion */
            width: auto !important;
        }

        .bubble.document-message:has(.document.ext-pdf) .bubble-content-wrapper,
        .bubble.document-message:has(.document.ext-pdf) .document-container {
            max-width: 100% !important;
            width: 100% !important;
        }

        /* Force middle-ellipsis-element to display full text */
        middle-ellipsis-element[title*=".pdf" i] {
            white-space: normal !important;
            display: block !important;
            overflow: visible !important;
            max-width: 100% !important;
            word-break: break-all !important;
            height: auto !important;
        }

        /* --- WEB A HANDLING --- */
        .message-content-wrapper:has(.file-title[title*=".pdf" i]),
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) .message-content {
            max-width: 100% !important;
            width: 100% !important;
        }
        .file-title[title*=".pdf" i] {
            white-space: normal !important;
            word-break: break-all !important;
            text-overflow: initial !important;
            display: block !important;
        }
    `;
    document.head.appendChild(style);

    // 2. JAVASCRIPT HANDLING: Fix stubborn ellipsis on Web K
    // Since Web K uses JS to truncate strings, we must use JS to overwrite it with the original title attribute
    const applyFullTitles = () => {
        // Find all middle-ellipsis-elements for PDF files
        const pdfElements = document.querySelectorAll('middle-ellipsis-element[title*=".pdf" i]');

        pdfElements.forEach(el => {
            const fullTitle = el.getAttribute('title');

            // If the current text is truncated (differs from the original title)
            if (fullTitle && el.textContent !== fullTitle) {
                el.textContent = fullTitle; // Force full name display
                el.style.whiteSpace = 'normal';
                el.style.wordBreak = 'break-all';

                // Expand the parent container to accommodate the long text
                const parentDoc = el.closest('.document-name');
                if (parentDoc) {
                    parentDoc.style.maxWidth = '100%';
                    parentDoc.style.width = '100%';
                }
            }
        });
    };

    // DOM Observation: Re-run script when new messages are loaded via scrolling
    const observer = new MutationObserver(() => {
        applyFullTitles();
    });

    // Initialize when the page has fully loaded
    window.addEventListener('load', () => {
        observer.observe(document.body, { childList: true, subtree: true });
        applyFullTitles();
    });

    // Periodic check every 1 second to ensure Telegram doesn't overwrite the titles back
    setInterval(applyFullTitles, 1000);

})();
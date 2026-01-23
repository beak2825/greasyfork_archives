// ==UserScript==
// @name        Telegram Web: PDF Full Width & Titles Only
// @namespace   https://web.telegram.org/
// @version     1.0
// @description Expands message bubbles and shows full titles only for .pdf files.
// @author      Gemini
// @match       https://web.telegram.org/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/563698/Telegram%20Web%3A%20PDF%20Full%20Width%20%20Titles%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/563698/Telegram%20Web%3A%20PDF%20Full%20Width%20%20Titles%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. Target the wrapper ONLY if it contains a file-title ending in .pdf */
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) {
            max-width: 100% !important;
            width: 100% !important;
        }

        /* 2. Expand the message bubble for PDF files */
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) .message-content {
            max-width: 100% !important;
            width: 100% !important;
        }

        /* 3. Apply flex layout to internal PDF containers */
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) .content-inner,
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) .File.interactive {
            max-width: 100% !important;
            width: 100% !important;
            display: flex !important;
        }

        /* 4. Allow file-info to occupy the newly available space */
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) .file-info {
            flex-grow: 1 !important;
            min-width: 0;
        }

        /* 5. Display the full filename without truncation (...) */
        .message-content-wrapper:has(.file-title[title*=".pdf" i]) .file-title {
            white-space: normal !important;
            word-break: break-word !important;
            overflow: visible !important;
            text-overflow: initial !important;
        }
    `;
    document.head.appendChild(style);
})();
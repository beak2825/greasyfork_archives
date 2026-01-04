// ==UserScript==
// @name        Notion Split Screen Full Width (Final Fix + 15px Padding)
// @description     script made to remove borders in notion. Made using AI(gemini)
// @namespace   Notion Custom Scripts
// @match       *://www.notion.so/*
// @grant       GM_addStyle
// @version     3.0
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558251/Notion%20Split%20Screen%20Full%20Width%20%28Final%20Fix%20%2B%2015px%20Padding%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558251/Notion%20Split%20Screen%20Full%20Width%20%28Final%20Fix%20%2B%2015px%20Padding%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS OVERRIDES
    const css = `
        /* 1. Force the outer containers to stretch to the full viewport width */
        .notion-frame, .notion-scroller, .layout, .layout-content {
            width: 100% !important;
            max-width: 100vw !important;
            display: flex !important;
            flex-direction: column !important;
        }

        /* 2. Target the nameless div inside .layout-content that enforces "align-items: center" */
        .layout-content > div {
            align-items: stretch !important; /* This stops the centering */
            width: 100% !important;
            max-width: 100% !important;
        }

        /* 3. Target the inner container of the content */
        /* ADDED 15px PADDING HERE */
        .layout-content > div > div {
            max-width: 100% !important;
            width: 100% !important;
            padding-left: 15px !important;
            padding-right: 15px !important;
            box-sizing: border-box !important; /* Ensures padding doesn't cause horizontal scroll */
        }

        /* 4. Target the actual text blocks (which have inline max-width: 189px in your HTML) */
        [data-block-id] {
            max-width: 100% !important;
            width: 100% !important;
        }

        /* 5. Force the page content area to fill space */
        .notion-page-content {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
        }
    `;

    GM_addStyle(css);

    // 2. JS LOOP (To fight Notion's React updates)
    function forceLayout() {

        // A. Find the container that centers content and force it to stretch
        const layoutContent = document.querySelector('.layout-content');
        if (layoutContent && layoutContent.firstElementChild) {
            const centerDiv = layoutContent.firstElementChild;
            // Overwrite the inline style 'align-items: center'
            centerDiv.style.setProperty('align-items', 'stretch', 'important');
            centerDiv.style.setProperty('max-width', '100%', 'important');
        }

        // B. Find every single block and remove the pixel restriction
        const blocks = document.querySelectorAll('[data-block-id]');
        blocks.forEach(block => {
            if (block.style.maxWidth !== '100%') {
                block.style.setProperty('max-width', '100%', 'important');
                block.style.setProperty('width', '100%', 'important');
            }
        });
    }

    // Run repeatedly to catch new blocks as you scroll or type
    setInterval(forceLayout, 500);

})();
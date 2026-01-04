// ==UserScript==
// @name         Center Lore.kernel.org Content
// @namespace    https://github.com/zampierilucas
// @version      1.0
// @description  Centers the content on lore.kernel.org instead of left-alignment
// @author       Lucas Zampieri
// @match        https://lore.kernel.org/*
// @match        http://lore.kernel.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552446/Center%20Lorekernelorg%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/552446/Center%20Lorekernelorg%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        /* Center the main content container */
        body {
            margin: 0 auto !important;
            max-width: 1200px !important;
            padding: 0 20px !important;
        }

        /* Ensure pre-formatted text (code blocks) don't overflow */
        pre {
            max-width: 100% !important;
            overflow-x: auto !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
        }

        /* Center any tables that might be present */
        table {
            margin: 0 auto !important;
            max-width: 100% !important;
        }

        /* Ensure content flows naturally within the centered container */
        .container,
        .content,
        .main {
            margin: 0 auto !important;
            max-width: 100% !important;
        }

        /* Handle any specific lore.kernel.org elements */
        div[style*="margin"] {
            margin-left: auto !important;
            margin-right: auto !important;
        }
    `;

    // Wait for the page to load before applying styles
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(style);
        });
    } else {
        document.head.appendChild(style);
    }

    // Also apply some immediate styling to the body if it exists
    if (document.body) {
        document.body.style.cssText += 'margin: 0 auto !important; max-width: 1200px !important; padding: 0 20px !important;';
    }

})();
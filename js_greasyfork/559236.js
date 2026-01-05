// ==UserScript==
// @name         FabSwingers – Larger Video Previews
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Enlarge video preview thumbnails on FabSwingers gallery pages
// @match        https://www.fabswingers.com/*
// @match        https://fabswingers.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559236/FabSwingers%20%E2%80%93%20Larger%20Video%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/559236/FabSwingers%20%E2%80%93%20Larger%20Video%20Previews.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Make each grid item bigger */
            .photo-grid {
                width: 260px !important;
                height: auto !important;
                margin: 15px !important;
            }

            /* Enlarge thumbnail images */
            .photo-grid img {
                max-width: 240px !important;
                max-height: 360px !important;
                width: auto !important;
                height: auto !important;
            }

            /* Keep play icon centered and scaled nicely */
            .photo-grid img[src*="white-play"] {
                width: 64px !important;
                height: 64px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Run once page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyStyles);
    } else {
        applyStyles();
    }
})();

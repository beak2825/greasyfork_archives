// ==UserScript==
// @name         RuTracker Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dark theme for rutracker.org
// @author       dil83
// @license      MIT
// @match        https://rutracker.org/*
// @match        http://rutracker.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553417/RuTracker%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/553417/RuTracker%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        /* Main body styling */
        body {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* General text elements */
        div, span, td, th, p, li, a, label, input[type="text"], textarea, select {
            color: #e0e0e0 !important;
        }

        /* Preserve colored links and text */
        a[style*="color: #"], span[style*="color: #"], b[style*="color: #"] {
            color: inherit !important;
        }

        /* Background elements */
        #page_container, #page_content, #main_content, #main_content_wrap,
        .category, table, tr, td, th, .row1, .forums {
            background-color: #2a2a2a !important;
        }

        /* Headers and titles */
        h3, h4, .cat_title {
            background-color: #333333 !important;
            color: #e0e0e0 !important;
        }

        .cat_title a {
            color: #e0e0e0 !important;
        }

        /* Sidebar */
        #sidebar1, #sidebar1_wrap, #idx-sidebar2 {
            background-color: #2a2a2a !important;
        }

        /* Input fields */
        input[type="text"], input[type="submit"], select, textarea {
            background-color: #333333 !important;
            color: #e0e0e0 !important;
            border-color: #555555 !important;
        }

        /* News and info boxes */
        #latest_news, .sb2-block {
            background-color: #2a2a2a !important;
        }

        /* Footer */
        #page_footer {
            background-color: #1a1a1a !important;
        }

        /* Menu and navigation */
        #main-nav, .topmenu, .menu-sub {
            background-color: #2a2a2a !important;
        }

        /* Statistics */
        #board_stats_wrap {
            background-color: #2a2a2a !important;
        }

        /* Preserve important colored text (blue, pink, etc) */
        [style*="color: #00f"], [style*="color: #0000ff"],
        [style*="color: #7b1fa2"], [style*="color: #880e4f"],
        [style*="color: #3f51b5"], [style*="color: #9c27b0"],
        b[style*="color:"], span[style*="color: rgb"] {
            /* Keep original colors */
        }

        /* Links with specific colors */
        .bold[style*="color"], .med[style*="color"] {
            /* Keep original colors */
        }

        /* Ensure links are visible */
        a:not([style*="color"]) {
            color: #6db3ff !important;
        }

        a:not([style*="color"]):hover {
            color: #8fc5ff !important;
        }

        /* Images and icons */
        img {
            opacity: 0.9;
        }

        /* Special blocks */
        .row1, .row2 {
            background-color: #2a2a2a !important;
        }

        /* Buttons */
        .btn, button, input[type="button"] {
            background-color: #333333 !important;
            color: #e0e0e0 !important;
            border-color: #555555 !important;
        }
    `;

    // Wait for page to load
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
        });
    }
})();
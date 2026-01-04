// ==UserScript==
// @name         AI Studio Ultimate Collapsible Sidebar
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Hides the default sidebar toggle and makes the sidebar a slim, hover-to-expand panel on desktop. Restores default button behavior on smaller screens.
// @author       EchoesRealmArrow
// @copyright    2025, Mason Teeters (https://greasyfork.org/en/users/1242079-m-t-echoesrealmarrow)
// @license      MIT
// @match        https://aistudio.google.com/prompts/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556146/AI%20Studio%20Ultimate%20Collapsible%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/556146/AI%20Studio%20Ultimate%20Collapsible%20Sidebar.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2025, Mason Teeters

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const collapsedWidth = '24px';
    const expandedWidth = '256px';
    const responsiveBreakpoint = '1007px'; // The width where behavior changes
    // --- END CONFIGURATION ---

    GM_addStyle(`
        /* --- STYLES FOR DESKTOP VIEW (> 1007px) --- */

        /* 1. Hide the original hamburger toggle button on large screens */
        button[aria-label="Toggle navigation menu"] {
            display: none !important;
        }

        /* 2. The main sidebar container for hover behavior */
        .v3-left-nav {
            width: ${collapsedWidth} !important;
            transition: width 0.3s ease-in-out !important;
            overflow-x: hidden;
        }

        .v3-left-nav:hover {
            width: ${expandedWidth} !important;
        }

        /* 3. The <nav> content, hidden when collapsed */
        .v3-left-nav nav {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
        }

        .v3-left-nav:hover nav {
            opacity: 1;
            pointer-events: auto;
            transition-delay: 0.15s;
        }


        /* --- STYLES FOR TABLET & MOBILE VIEW (<= 1007px) --- */
        @media (max-width: ${responsiveBreakpoint}) {
            /* 1. RESTORE the hamburger toggle button */
            button[aria-label="Toggle navigation menu"] {
                /* 'flex' is likely the site's default, this makes it visible again */
                display: flex !important;
            }

            /* 2. DISABLE our custom hover functionality */
            /* 'unset' tells the browser to ignore our width rules and use the website's original CSS.
               This gives control back to the default click-to-toggle behavior. */
            .v3-left-nav,
            .v3-left-nav:hover {
                width: unset !important;
                transition: none !important; /* Turn off our animation */
            }

            /* 3. ENSURE the nav content is always visible */
            /* This prevents our opacity rule from hiding the content when the user
               clicks the button to open the sidebar. */
            .v3-left-nav nav {
                opacity: 1 !important;
                pointer-events: auto !important;
                transition: none !important;
            }
        }
    `);
})();
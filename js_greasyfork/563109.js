// ==UserScript==
// @name         Torn Ultra-Wide Bazaar (Version 1.5)
// @namespace    http://torn.com/
// @version      1.5
// @description  The stable multi-column version that works best for ultra-wide monitors.
// @author       srsbsns / Gemini
// @match        *://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563109/Torn%20Ultra-Wide%20Bazaar%20%28Version%2015%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563109/Torn%20Ultra-Wide%20Bazaar%20%28Version%2015%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
        /* Force the main container to use the full screen width */
        div[data-testid="bazaar-items"] {
            width: 100% !important;
            max-width: none !important;
            display: flex !important;
            flex-wrap: wrap !important;
            height: auto !important;
            gap: 10px !important;
            justify-content: flex-start !important;
        }
        /* Neutralize the game's forced row containers */
        div[class*="row___LkdFI"] {
            display: contents !important;
        }
        /* Set the stable item box size that preserves the grid */
        div[class*="item___GYCYJ"],
        div[class*="itemDescription___j4EfE"] {
            flex: 0 0 205px !important;    /* ← CHANGE THIS NUMBER */
            width: 205px !important;       /* ← AND THIS NUMBER */
            height: 80px !important;
            margin: 0 !important;
        }
        /* Expand the overall page layout */
        .content-wrapper, #mainContainer, div[class*="core-layout"] {
            max-width: 100% !important;
            width: 100% !important;
        }
        #sidebar {
            flex-shrink: 0 !important;
        }
    `);
})();
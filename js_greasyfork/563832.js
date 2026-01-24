// ==UserScript==
// @name         Torn Bazaar - buy reposition
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Moves description into the right gap and keeps it inside the box.
// @author       Gemini
// @match        *.torn.com/bazaar.php*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563832/Torn%20Bazaar%20-%20buy%20reposition.user.js
// @updateURL https://update.greasyfork.org/scripts/563832/Torn%20Bazaar%20-%20buy%20reposition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customCSS = `
        /* 1. Parent Box */
        div[class*="buyMenu"] {
            position: relative !important;
            height: 80px !important;
            display: block !important;
        }

        /* 2. THE BUY UNIT - Kept at your -40px shift */
        div[class*="buyForm"] {
            position: absolute !important;
            left: calc(50% - 40px) !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 120px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 100 !important;
        }

        div[class*="buyForm"] > div[class*="field"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            height: auto !important;
        }

        /* 3. THE FILL MAX LINK - Stays stacked as requested */
        span.tt-max-buy {
            display: block !important;
            position: relative !important;
            top: 0 !important;
            margin-top: 5px !important;
            text-align: center !important;
            font-size: 11px !important;
            line-height: 1 !important;
            color: #b3d900 !important;
        }

        /* 4. DESCRIPTION - Anchored to the Right Gap */
        div[class*="info___"] p {
            position: absolute !important;
            /* Anchored to right gap, avoids the X button */
            right: -100px !important;
            left: auto !important;
            /* Fixed top value to keep it inside the dark box */
            top: 15px !important;
            transform: none !important;
            margin: 0 !important;
            width: 150px !important;
            text-align: left !important;
            z-index: 1 !important;
        }

        /* 5. RIGHT SIDE - Price and X stay pinned */
        /* Only apply the -50px shift if we are NOT in a confirmation dialog */
        div[class*="buyMenu"]:not([class*="confirm"]) button[class*="close___"] {
            position: absolute !important;
            right: -50px !important;
            top: -7px !important;
            left: auto !important;
        }

        /* Keep the X in the standard spot during confirmation/success */
        div[class*="confirm"] button[class*="close___"] {
            position: absolute !important;
            right: 10px !important;
            top: 10px !important;
        }

        #tt-total-cost, .tt-total-cost {
            position: absolute !important;
            right: 75px !important;
            bottom: 12px !important;
            left: auto !important;
            color: #7cfc00 !important;
            font-weight: bold !important;
            text-align: right !important;
        }
    `;

    GM_addStyle(customCSS);
})();
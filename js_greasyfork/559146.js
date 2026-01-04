// ==UserScript==
// @name         Pink Fighter Jet
// @namespace    https://torn.com/
// @version      1.3
// @description  Replace travel planes with a smaller, angled pink fighter jet centered in clouds on Torn
// @author       2115907
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559146/Pink%20Fighter%20Jet.user.js
// @updateURL https://update.greasyfork.org/scripts/559146/Pink%20Fighter%20Jet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const jetImage = 'https://i.ibb.co/8LMWmTPZ/pink-jetx2.png';

    GM_addStyle(`
        /* Background-based planes */
        .travel-plane,
        .plane,
        [class*="plane"] {
            background-image: url("${jetImage}") !important;
            background-repeat: no-repeat !important;

            /* Center it into the cloud trail */
            background-position: 58% 45% !important;
            background-size: 45% auto !important;

            transform: rotate(-18deg) translate(6px, -4px) !important;
            transform-origin: center center !important;
        }

        /* <img> fallback */
        img[src*="plane"] {
            content: url("${jetImage}") !important;
            object-fit: contain !important;

            width: 45% !important;
            height: auto !important;

            transform: rotate(-18deg) translate(6px, -4px) !important;
            transform-origin: center center !important;
        }
    `);

    console.log('[Pink Fighter Jet] Jet centered into cloud trail ✈️💗');
})();
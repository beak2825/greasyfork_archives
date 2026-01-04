// ==UserScript==
// @name         Neopets: Grayscale Forgotten Shore
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Makes the Forgotten Shore image black and white when there's nothing to be found
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/pirates/forgottenshore.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/553555/Neopets%3A%20Grayscale%20Forgotten%20Shore.user.js
// @updateURL https://update.greasyfork.org/scripts/553555/Neopets%3A%20Grayscale%20Forgotten%20Shore.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.insertAdjacentHTML("beforeEnd", `<style>
    #shore_back:not(:has(a)) {
      filter: grayscale(1);
    }
    </style>`);
})();

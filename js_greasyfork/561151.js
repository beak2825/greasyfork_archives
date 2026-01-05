// ==UserScript==
// @name         toonkor adblock css
// @author       Minjae Kim
// @version      1.02
// @description  cleans the site 
// @include      /^https?:\/\/(?:www\.)?tkor\d{3}\.com\/.*/
// @grant        none
// @license      MIT
// @run-at       document-start
// @grant        GM_addStyle
// @namespace    clearjade
// @downloadURL https://update.greasyfork.org/scripts/561151/toonkor%20adblock%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/561151/toonkor%20adblock%20css.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Using display: none !important is the nuclear option for speed.
    // It tells the browser "Don't even bother drawing this."
    const css = `
        #mobile_nav,
        .navbar.navbar-default.navbar-static-top,
        .col-md-12.mobile-banner,
        #banner_21_img,
        .bn.bnt
        {
            display: none !important;
        }
    `;

    // GM_addStyle is highly optimized for userscripts
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.append(style);
    }
})();
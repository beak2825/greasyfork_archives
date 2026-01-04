// ==UserScript==
// @name         lzt white
// @match        *://lolz.live/*
// @version      0.1
// @description  белая тема для lolzteam
// @author       sh4te
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/1539533
// @downloadURL https://update.greasyfork.org/scripts/556328/lzt%20white.user.js
// @updateURL https://update.greasyfork.org/scripts/556328/lzt%20white.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inverseCSS = `
        html {
            filter: invert(100%) hue-rotate(180deg) !important;
        }

        img,
        video,
        iframe,
        embed,
        object,

        .username,
        .onlineMarker,
        .userStatus,
        .userCounters,
        .img,

        [style*="background-image"] {
            filter: invert(100%) hue-rotate(180deg);
        }
    `;

    GM_addStyle(inverseCSS);

})();
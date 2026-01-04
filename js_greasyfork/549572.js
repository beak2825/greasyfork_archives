// ==UserScript==
// @name         Pink Classroom v6 (fix overlay, bright pink, dark gray text)
// @namespace    chaziel
// @version      6.0
// @description  Makes Google Classroom pink with dark gray text, keeps overlays readable
// @author       Carnayx
// @match        https://classroom.google.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549572/Pink%20Classroom%20v6%20%28fix%20overlay%2C%20bright%20pink%2C%20dark%20gray%20text%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549572/Pink%20Classroom%20v6%20%28fix%20overlay%2C%20bright%20pink%2C%20dark%20gray%20text%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Overall backgrounds -> stronger pink */
        body,
        .Kk7lMc,
        .pco8Kc,
        .VfPpkd-StrnGf-rymPhb-f7MjDc,
        .VfPpkd-StrnGf-rymPhb-ibnC6b,
        .VfPpkd-TkwUic,
        .VfPpkd-Bz112c-RLmnJb {
            background-color: #ffb6c9 !important; /* brighter pastel pink */
            color: #333 !important;
        }

        /* Top bar */
        header, .gb_uc, .gb_Xc {
            background-color: #ff4f9d !important; /* hot pink header */
            color: #333 !important;
        }

        /* Sidebar */
        nav, .onkcGd, .YVvGBb {
            background-color: #ff99bb !important;
            color: #333 !important;
        }

        /* Buttons */
        .VfPpkd-Bz112c-LgbsSe {
            background-color: #ff4f9d !important;
            color: #333 !important;  /* dark gray text instead of white */
            border-radius: 6px !important;
        }
        .VfPpkd-Bz112c-LgbsSe:hover {
            background-color: #ff6fb6 !important;
        }

        /* Kill inline highlights ONLY in main UI, not overlays */
        body:not(.XvhY1d) span,
        body:not(.XvhY1d) div,
        body:not(.XvhY1d) p {
            background-color: transparent !important;
            color: #333 !important;  /* enforce dark gray text */
        }

        /* Links */
        a {
            color: #b0005d !important; /* deep pink links */
            background-color: transparent !important;
        }

        /* Preserve overlays (like PDF viewer dark background) */
        .XvhY1d, /* overlay root */
        .pEED0b, /* PDF backdrop */
        .pEED0b * {
            background-color: rgba(0,0,0,0.7) !important;
            color: #fff !important;
        }
    `);
})();
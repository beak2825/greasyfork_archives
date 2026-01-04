// ==UserScript==
// @name         rick
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays a reversed funny alert message when page loads
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548715/rick.user.js
// @updateURL https://update.greasyfork.org/scripts/548715/rick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const event = window.alert;
    event("uoy_tuohtiw_dnuora_nur_annog_reven_nwod_uoy_tel_annog_reven_pu_uoy_evig_annog_reven"
        .split("")
        .reverse()
        .join("")
        .replaceAll("_", " "));
})();

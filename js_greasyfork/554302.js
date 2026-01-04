// ==UserScript==
// @name         Bunkr Full Names in Gallery
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables text truncation for file names in Bunkr albums, showing the full title.
// @author       medy17
// @match        *://bunkr.si/a/*
// @match        *://bunkr.la/a/*
// @match        *://bunkr.cc/a/*
// @match        *://bunkr.ru/a/*
// @match        *://bunkr.cr/a/*
// @match        *://*.bunkr.*/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunkr.cr
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554302/Bunkr%20Full%20Names%20in%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/554302/Bunkr%20Full%20Names%20in%20Gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The 'truncate' class uses CSS to hide overflowing text.
    // We override these properties to make the text wrap and be fully visible.
    // This is version-agnostic as it relies only on the stable 'truncate' class name.
    GM_addStyle(`
        .truncate.theName {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: unset !important;
        }
    `);
})();
// ==UserScript==
// @name         bdsmlr move Previous Next Page changer to the left
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Changes pagination direction from LTR to RTL by setting CSS properties.
// @author       grok
// @match        https://*.bdsmlr.com/*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/547909/bdsmlr%20move%20Previous%20Next%20Page%20changer%20to%20the%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/547909/bdsmlr%20move%20Previous%20Next%20Page%20changer%20to%20the%20left.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Customize this selector to target the pagination container on your site
    // For example: '.pagination', '#paginator', '.page-nav', etc.
    const paginationSelector = '.paginatelinks';

    // Add CSS to reverse the direction
    GM_addStyle(`
        ${paginationSelector} {
            float: left !important;
        }
    `);
})();
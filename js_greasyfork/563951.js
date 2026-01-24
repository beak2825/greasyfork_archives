// ==UserScript==
// @name         Get Image Links from Page
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Collect and print all image URLs from the current page
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563951/Get%20Image%20Links%20from%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/563951/Get%20Image%20Links%20from%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const images = [...document.images]
        .map(img => img.currentSrc || img.src)
        .filter(Boolean);

    console.log('Found image URLs:\n' + images.join('\n'));
})();
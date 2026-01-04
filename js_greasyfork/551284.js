// ==UserScript==
// @name         Fix Advanced Search button hitbox
// @namespace    https://github.com/nate-kean/
// @version      2025-09-29
// @description  Fix a bug where the button to go to Advanced Search doesn't register if you don't click right in the middle.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551284/Fix%20Advanced%20Search%20button%20hitbox.user.js
// @updateURL https://update.greasyfork.org/scripts/551284/Fix%20Advanced%20Search%20button%20hitbox.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-search-button-fix">
            #advanced-link {
                display: block;
                width: 100%;
                height: 100%;
            }
        </style>
    `);
})();

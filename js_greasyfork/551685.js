// ==UserScript==
// @name         Fix group X button hitbox
// @namespace    https://github.com/nate-kean/
// @version      20251019
// @description  Expand the tiny hitbox of the delete button on groups.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551685/Fix%20group%20X%20button%20hitbox.user.js
// @updateURL https://update.greasyfork.org/scripts/551685/Fix%20group%20X%20button%20hitbox.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-group-x-button-hitbox-fix">
            .remove-group {
                width: 30px !important;
                height: 30px !important;
            }
        </style>
    `);

})();
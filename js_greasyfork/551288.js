// ==UserScript==
// @name         Move the Delete button to the left
// @namespace    https://github.com/nate-kean/
// @version      2025-09-23
// @description  Move the Edit Profile delete button farther away from the save button to make it harder to click on accident.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551288/Move%20the%20Delete%20button%20to%20the%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/551288/Move%20the%20Delete%20button%20to%20the%20left.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-delete-button-fix">
            input.deleteMember {
                margin-right: unset !important;
                margin-left: 30px;
                float: unset !important;
            }
        </style>
    `);
})();

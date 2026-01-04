// ==UserScript==
// @name         Family Assign Interaction: fix action dropdown width
// @namespace    https://github.com/nate-kean/
// @version      2025.11.6.1
// @description  Fix some messed up CSS in the Assign Interaction popup on the Family page.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554793/Family%20Assign%20Interaction%3A%20fix%20action%20dropdown%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/554793/Family%20Assign%20Interaction%3A%20fix%20action%20dropdown%20width.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-family-assign-interaction-action-dropdown-width-fixer">
            #assignInteractionForm > .modal-body label {
                display: block;
            }

            #aid_chosen {
                width: 100% !important;
            }
        </style>
    `);
})();

// ==UserScript==
// @name         Taller Assign Interaction popup
// @namespace    https://github.com/nate-kean/
// @version      2025.11.4.1
// @description  So the whole thing fits on screen at once.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @match        https://jamesriver.fellowshiponego.com/members/timeline/*
// @match        https://jamesriver.fellowshiponego.com/members/giving/*
// @match        https://jamesriver.fellowshiponego.com/members/account/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554785/Taller%20Assign%20Interaction%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/554785/Taller%20Assign%20Interaction%20popup.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-taller-assign-interaction-css">
            #assignInteractionForm .modal-body {
                max-height: 584px !important;
                padding-bottom: 15px !important;
            }
        </style>
    `);
})();

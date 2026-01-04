// ==UserScript==
// @name         Hide section collapse buttons
// @namespace    https://github.com/nate-kean/
// @version      2025.11.6
// @description  Hide the buttons that let you minimize sections in the Add/Edit page. I've never clicked them on purpose but I have clicked them on accident.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554784/Hide%20section%20collapse%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/554784/Hide%20section%20collapse%20buttons.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-collapse-button-hider">
            .panel.panel-default.form-wrapper .collapse-fieldset {
                display: none;
            }
        </style>
    `);
})();

// ==UserScript==
// @name         Nate's Day Button
// @namespace    https://github.com/nate-kean/
// @version      2025.11.4
// @description  CSS common for a few scripts that put an autofill button next to a date
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-day-button-css">
            .nates-day-button {
                font-weight: 600;
                border: none;
                font-size: 13px;
                padding: 0;
            }
        </style>
    `);
})();

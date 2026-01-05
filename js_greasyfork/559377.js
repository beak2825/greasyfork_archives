// ==UserScript==
// @name         Edit Individual - Groups: focus input in Add tab
// @namespace    https://github.com/nate-kean/
// @version      2025.12.18
// @description  Autofocus the "Search to Add a Group" textbox so you can start typing faster.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559377/Edit%20Individual%20-%20Groups%3A%20focus%20input%20in%20Add%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559377/Edit%20Individual%20-%20Groups%3A%20focus%20input%20in%20Add%20tab.meta.js
// ==/UserScript==

(function() {
    const inputAddAGroup = document.querySelector("#memberEditSearchGroups");
    document
        .querySelector(
            "#memberEditGroupToggle > li > a[href='#addGroupsHolder']"
        )
        .addEventListener("click", () => {
            inputAddAGroup.focus();
        }, { passive: true });
})();

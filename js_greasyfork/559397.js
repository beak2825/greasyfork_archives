// ==UserScript==
// @name         Assign Interaction: Ctrl+Enter to submit
// @namespace    https://github.com/nate-kean/
// @version      2025.12.18
// @description  Add Ctrl+Enter as a hotkey for clicking Save on Assign Interaction.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @match        https://jamesriver.fellowshiponego.com/members/timeline/*
// @match        https://jamesriver.fellowshiponego.com/members/giving/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559397/Assign%20Interaction%3A%20Ctrl%2BEnter%20to%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/559397/Assign%20Interaction%3A%20Ctrl%2BEnter%20to%20submit.meta.js
// ==/UserScript==

(function() {
    for (const modal of document.querySelectorAll("#assignInteractionsModal, #logInteractionModal")) {
        modal.addEventListener("keydown", (evt) => {
            if (evt.ctrlKey && evt.key === "Enter") {
                evt.preventDefault();
                modal.querySelector("input[type='submit']").click();
            }
        });
    }
})();

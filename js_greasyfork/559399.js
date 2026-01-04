// ==UserScript==
// @name         Edit Interaction: Ctrl+Enter to submit
// @namespace    https://github.com/nate-kean/
// @version      2025.12.18
// @description  Add Ctrl+Enter as a hotkey for clicking Save on Edit Interaction.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/interactions/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559399/Edit%20Interaction%3A%20Ctrl%2BEnter%20to%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/559399/Edit%20Interaction%3A%20Ctrl%2BEnter%20to%20submit.meta.js
// ==/UserScript==

(function() {
    document.addEventListener("keydown", (evt) => {
        if (evt.ctrlKey && evt.key === "Enter") {
            evt.preventDefault();
            document.querySelector("input[type='submit'][value='Save']").click();
        }
    });
})();

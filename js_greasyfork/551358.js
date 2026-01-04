// ==UserScript==
// @name         Type / to search
// @namespace    https://github.com/nate-kean/
// @version      2025-09-29
// @description  Keyboard shortcut inspired by GitHub. Press / to focus the search bar.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551358/Type%20%20to%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/551358/Type%20%20to%20search.meta.js
// ==/UserScript==

(function() {
    const topNavSearch = document.querySelector("#top-nav-search");
    document.addEventListener("keyup", (evt) => {
        if (
            evt.keyCode === 191
            && document.activeElement.keyCode !== "input"
            && document.activeElement.keyCode !== "textarea"
        ) {
            topNavSearch.focus();
        }
    });
    topNavSearch.setAttribute("placeholder", "Type / to search for a person by name");
})();

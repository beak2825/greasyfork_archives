// ==UserScript==
// @name         Family: auto-focus search box when clicking Add to Family button
// @namespace    https://github.com/nate-kean/
// @version      2025.12.30
// @description  Typing into the search box is what you usually do after clicking the Add Individuals to Family button, so this focuses it for you so you can start typing immediately.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560835/Family%3A%20auto-focus%20search%20box%20when%20clicking%20Add%20to%20Family%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/560835/Family%3A%20auto-focus%20search%20box%20when%20clicking%20Add%20to%20Family%20button.meta.js
// ==/UserScript==

(function() {
    function setImmediate(cb) {
        return setTimeout(cb, 0);
    }
    document.querySelector("#addFamilyMember").addEventListener("click", () => {
        setImmediate(() => document.querySelector("#addMemberFamily").focus());
    }, { passive: true });
    document.querySelector("#addFamilyConnection").addEventListener("click", () => {
        setImmediate(() => document.querySelector("#familySearch").focus());
    }, { passive: true });
})();

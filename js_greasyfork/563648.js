// ==UserScript==
// @name         Assign Interaction: Prevent double-submitting
// @namespace    https://github.com/nate-kean/
// @version      2026.1.22.1
// @description  Disable the interaction submit button after clicking so you can't double-click and assign a duplicate.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563648/Assign%20Interaction%3A%20Prevent%20double-submitting.user.js
// @updateURL https://update.greasyfork.org/scripts/563648/Assign%20Interaction%3A%20Prevent%20double-submitting.meta.js
// ==/UserScript==

(function() {
    const btn = document.querySelector("#assignInteractionSubmit");
    btn?.addEventListener("click", () => {
        setTimeout(
            () => { btn.disabled = true },
            0,
        );
    }, { passive: true });
})();

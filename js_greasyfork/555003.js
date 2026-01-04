// ==UserScript==
// @name         Family page: Fix Assign To comment font
// @namespace    https://github.com/nate-kean/
// @version      2025.11.4
// @description  Fix an odd wrong font setting for this little piece of text on just this page.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/family/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555003/Family%20page%3A%20Fix%20Assign%20To%20comment%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/555003/Family%20page%3A%20Fix%20Assign%20To%20comment%20font.meta.js
// ==/UserScript==

(function() {
        document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-funny-family-footnote-font-fixer">
            .help-block {
                font-family: inherit;
            }
        </style>
    `);
})();

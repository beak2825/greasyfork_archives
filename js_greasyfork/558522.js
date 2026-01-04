// ==UserScript==
// @name         Interactions: always show filter box
// @namespace    https://github.com/nate-kean/
// @version      2025.12.15
// @description  What's the first thing you do on the Interactions page? Open the filter box! So why not have it open by itself?
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/interactions/completed*
// @match        https://jamesriver.fellowshiponego.com/interactions/outstanding*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558522/Interactions%3A%20always%20show%20filter%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/558522/Interactions%3A%20always%20show%20filter%20box.meta.js
// ==/UserScript==

(function() {
        document.head.insertAdjacentHTML("beforeend", `
            <style id="nates-filter-box-unhider">
                #completedFilterBox, #outstandingFilterBox {
                    display: unset !important;
                }
            </style>
        `);
})();

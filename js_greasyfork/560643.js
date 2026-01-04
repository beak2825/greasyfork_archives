// ==UserScript==
// @name         Highlight "Confirm or fix this location"
// @namespace    https://github.com/nate-kean/
// @version      2025.12.29
// @description  While mapping cookie visits, this is very important to see, because it will cause the address not to save properly in lists.
// @author       Nate Kean
// @match        https://www.google.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560643/Highlight%20%22Confirm%20or%20fix%20this%20location%22.user.js
// @updateURL https://update.greasyfork.org/scripts/560643/Highlight%20%22Confirm%20or%20fix%20this%20location%22.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-css-that-highlights-the-address-warning">
            .AG25L {
                background-color: hsl(36deg 100% 62% / 30%);
            }
        </style>
    `);
})();

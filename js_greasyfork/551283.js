// ==UserScript==
// @name         Dark Reader checkbox fix
// @namespace    https://github.com/nate-kean/
// @version      2025-10-01
// @description  (For Dark Reader): restore a visual distinction between checkboxes and are and are not grayed out.
// @author       Nate Kean
// @match        https://us2.admin.mailchimp.com/campaigns/edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mailchimp.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551283/Dark%20Reader%20checkbox%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/551283/Dark%20Reader%20checkbox%20fix.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-css-that-fixes-the-checkbox-icons">
            .empty-3FSP- {
                filter: invert(1);
            }
        </style>
    `);
})();

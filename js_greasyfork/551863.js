// ==UserScript==
// @name         Fix sidebar item hitboxes
// @namespace    https://github.com/nate-kean/
// @version      2025-10-07
// @description  The left and right edges of the buttons don't register.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551863/Fix%20sidebar%20item%20hitboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/551863/Fix%20sidebar%20item%20hitboxes.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-sidebar-item-hitbox-fix">
            .side-nav-sub-itm-holder > a:last-child {
                width: 100%;
                height: 100%;
            }
        </style>
    `);
})();

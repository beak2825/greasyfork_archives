// ==UserScript==
// @name         Fix cursor not turning to pointer on some buttons/links
// @namespace    https://github.com/nate-kean/
// @version      2025-09-30
// @description  Like the ones on the sidebar.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551353/Fix%20cursor%20not%20turning%20to%20pointer%20on%20some%20buttonslinks.user.js
// @updateURL https://update.greasyfork.org/scripts/551353/Fix%20cursor%20not%20turning%20to%20pointer%20on%20some%20buttonslinks.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-cursor-pointer-visual-fix">
            data-link {
                cursor: pointer;
            }
        </style>
    `);
})();

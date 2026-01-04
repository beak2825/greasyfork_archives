// ==UserScript==
// @name         Export all if none selected
// @namespace    https://github.com/nate-kean/
// @version      20251028
// @description  If I don't have anyone selected, I want to export everyone.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553964/Export%20all%20if%20none%20selected.user.js
// @updateURL https://update.greasyfork.org/scripts/553964/Export%20all%20if%20none%20selected.meta.js
// ==/UserScript==

(function() {
    document.querySelector('[data-option="export_csv"]').addEventListener("click", () => {
        if (document.querySelectorAll('.search-table tbody input[type="checkbox"][checked]').length === 0) {
            document.querySelector('.search-table thead input[type="checkbox"]').click();
        }
        return true;
    });
})();

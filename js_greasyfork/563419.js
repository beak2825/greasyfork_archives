// ==UserScript==
// @name         POD Console Column Dividers - adthornq
// @namespace    amazon-pod-console
// @version      2.0
// @description  Add vertical dividers between table columns for readability
// @match        https://mod-paperback-cle7.corp.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563419/POD%20Console%20Column%20Dividers%20-%20adthornq.user.js
// @updateURL https://update.greasyfork.org/scripts/563419/POD%20Console%20Column%20Dividers%20-%20adthornq.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COLOR = '#b6bcc6'; // red divider
    const WIDTH = '2px';

    function applyDividers() {
        // Target all table cells except the first column
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('th.css-18tzy6q, td.css-18tzy6q');

            cells.forEach((cell, index) => {
                if (index === 0) return; // skip label column

                cell.style.borderLeft = `${WIDTH} solid ${COLOR}`;
                cell.style.boxSizing = 'border-box';
            });
        });
    }

    // Initial run
    applyDividers();

    // Re-apply if table reloads
    const observer = new MutationObserver(() => applyDividers());
    observer.observe(document.body, { childList: true, subtree: true });
})();

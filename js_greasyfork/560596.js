// ==UserScript==
// @name         Highlight HR-Offboarding Tasks
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight rows that contain HR-Offboarding in Azure DevOps
// @author       azure
// @match        https://dev.azure.com/sourcecode-smartbilling/Smartbilling/_queries/query/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560596/Highlight%20HR-Offboarding%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/560596/Highlight%20HR-Offboarding%20Tasks.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const HIGHLIGHT_COLOR = '#ffd1dd';
    const HIGHLIGHT_BORDER = '2px solid #ffc107';

    function highlightHROffboarding() {
        const rows = document.querySelectorAll('tr.bolt-tree-row, tr.bolt-table-row');

        rows.forEach(row => {
            const links = row.querySelectorAll('a.bolt-link');
            let hasHROffboarding = false;

            links.forEach(link => {
                if (link.textContent.includes('HR-Offboarding')) {
                    hasHROffboarding = true;
                }
            });

            if (!hasHROffboarding && row.textContent.includes('HR-Offboarding')) {
                hasHROffboarding = true;
            }

            if (hasHROffboarding) {
                row.style.backgroundColor = HIGHLIGHT_COLOR;
                row.style.borderLeft = HIGHLIGHT_BORDER;
                row.style.transition = 'background-color 0.3s ease';
            }
        });
    }

    function init() {
        setTimeout(highlightHROffboarding, 1000);

        const observer = new MutationObserver(() => {
            highlightHROffboarding();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(highlightHROffboarding, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

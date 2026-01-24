// ==UserScript==
// @name         Torn Company Addiction Indicator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Background tint based on employee addiction level
// @author       blacksmithop
// @match        https://www.torn.com/companies.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563714/Torn%20Company%20Addiction%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/563714/Torn%20Company%20Addiction%20Indicator.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const LOG_PREFIX = '%c[Addiction UI]';
    const LOG_STYLE  = 'color: #f39c12; font-weight: bold;';

    function addStyles() {
        if (document.getElementById('addiction-ui-styles')) return;

        const style = document.createElement("style");
        style.id = 'addiction-ui-styles';
        style.textContent = `
            /* Reset any previous experiment styles if needed */
            .acc-header {
                border-left: none !important;
            }

            /* Full-row background tints — stronger opacity for higher addiction */
            .addict-0   { background-color: rgba(76, 175, 80, 0.08)  !important; }  /* Clean - very light green */
            .addict-low { background-color: rgba(139, 195, 74, 0.12) !important; }  /* 1-2 - light lime */
            .addict-med { background-color: rgba(33, 150, 243, 0.14) !important; }  /* 3-4 - light blue */
            .addict-warn{ background-color: rgba(255, 235, 59, 0.18) !important; }  /* 5-6 - noticeable yellow */
            .addict-high{ background-color: rgba(255, 152, 0, 0.22)  !important; }  /* 7-9 - strong orange */
            .addict-crit{ background-color: rgba(244, 67, 54, 0.28)  !important; }  /* 10+ - obvious red */

            /* Optional: subtle border + text contrast boost on critical levels */
            .addict-crit {
                border: 1px solid rgba(244, 67, 54, 0.4) !important;
                font-weight: 500 !important;
            }

            /* Make sure hover / active states remain readable */
            li[data-user]:hover {
                filter: brightness(1.08);
            }
        `;
        document.head.appendChild(style);
        console.log(LOG_PREFIX, LOG_STYLE, "Full-row addiction styles applied");
    }

    function getAddictionClass(val) {
        if (val === 0)   return 'addict-0';
        if (val <= 2)    return 'addict-low';
        if (val <= 4)    return 'addict-med';
        if (val <= 6)    return 'addict-warn';
        if (val <= 9)    return 'addict-high';
        return 'addict-crit';
    }

    function processEmployees() {
        // Target the employee <li> rows
        const employees = document.querySelectorAll("li[data-user]:not([data-addiction-processed])");

        if (employees.length === 0) return;

        employees.forEach((employee) => {
            const effContainer = employee.querySelector(".effectiveness");
            const ariaLabel    = effContainer?.getAttribute("aria-label");

            let val = 0;
            if (ariaLabel) {
                const match = ariaLabel.match(/Addiction:?\s*([+-]?\d+)/i);
                if (match) {
                    val = Math.abs(parseInt(match[1], 10));
                }
            }

            // Remove all possible addiction classes first
            employee.classList.remove(
                'addict-0', 'addict-low', 'addict-med',
                'addict-warn', 'addict-high', 'addict-crit'
            );

            // Apply the new class
            employee.classList.add(getAddictionClass(val));

            if (val > 0) {
                console.log(LOG_PREFIX, LOG_STYLE,
                    `Row for user ${employee.getAttribute('data-user')} → -${val} addiction (${getAddictionClass(val)})`
                );
            }

            // Mark as processed so we don't re-process on every mutation
            employee.setAttribute("data-addiction-processed", "true");
        });
    }

    function init() {
        addStyles();
        processEmployees();

        // Watch for dynamic loading / tab switches / employee list refreshes
        const observer = new MutationObserver(() => {
            processEmployees();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run when employees tab is active (hash or SPA navigation)
    function tryInit() {
        if (window.location.hash.includes("option=employees") ||
            document.querySelector('ul.employees-list, li[data-user]')) {
            init();
        }
    }

    tryInit();
    window.addEventListener('hashchange', tryInit);

    // Extra safety net — Torn sometimes loads content very late
    setTimeout(tryInit, 1500);
    setTimeout(tryInit, 4000);
})();
// ==UserScript==
// @name         8thGear Car Column Condenser
// @namespace    8thGear Car Column Condenser by Tentakill
// @version      1.1.0
// @description  Limits the "Car" column width, freezes the "Time" column, and moves the page buttons to the left.
// @author       Tentakill
// @match        https://8thgear.racing/laptimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8thgear.racing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557582/8thGear%20Car%20Column%20Condenser.user.js
// @updateURL https://update.greasyfork.org/scripts/557582/8thGear%20Car%20Column%20Condenser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        colName: "Car",
        timeColName: "Time",
        minWidth: "175px",
        hoverMaxWidth: "800px"
    };

    function addCustomStyles() {
        const styleId = 'tm-8thgear-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Default Condensed State for Car Column */
            th.tm-condensed-col {
                max-width: ${CONFIG.minWidth} !important;
                min-width: ${CONFIG.minWidth} !important;
                /* Crucial Fix: Set width to auto consistently so max-width controls the animation.
                   Toggling between fixed width and auto breaks transitions. */
                width: auto !important;

                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;

                vertical-align: top;
                position: relative;
                z-index: 10;

                /* Shrinking Animation (When mouse leaves)
                   Set to 1s as requested
                */
                transition: max-width 1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease !important;
            }

            /* Hover Expanded State for Car Column */
            th.tm-condensed-col:hover {
                max-width: ${CONFIG.hoverMaxWidth} !important;
                /* width stays auto (inherited) */

                white-space: normal !important;
                overflow: visible !important;
                z-index: 100;

                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                /* Updated hover background color */
                background-color: #101929;
                border-radius: 0 0 4px 4px;

                /* Expanding Animation (When mouse enters)
                   Set to 1s as requested
                */
                transition: max-width 1s ease-out, box-shadow 0.3s ease !important;
            }

            th.tm-condensed-col .p-multiselect,
            th.tm-condensed-col .dropdown {
                width: 100% !important;
            }

            /* Freeze Pane: Sticky Time Column */
            .tm-sticky-right {
                position: sticky !important;
                right: 0 !important;
                z-index: 20;
                /* Updated to match the requested visual style (#101929) */
                background-color: #101929;
                box-shadow: -5px 0 10px rgba(0,0,0,0.3);
                border-left: 1px solid rgba(255, 255, 255, 0.1); /* Subtler border to blend better */
            }

            th.tm-sticky-right {
                z-index: 30 !important;
            }

            /* Move Pagination Controls to the Left
               User specific override for utility class
            */
            .justify-end {
                justify-content: flex-start !important;
            }
        `;
        document.head.appendChild(style);
    }

    function applyTargeting() {
        const headers = document.querySelectorAll('th');
        let timeIndex = -1;
        let timeHeader = null;

        for (const th of headers) {
            const text = th.textContent.trim();

            // 1. Handle "Car" Column (Condensing)
            if (text.startsWith(CONFIG.colName)) {
                if (!th.classList.contains('tm-condensed-col')) {
                    th.classList.add('tm-condensed-col');
                    th.title = "Hover to expand filter";
                }
            }

            // 2. Handle "Time" Column (Freezing)
            if (text.includes(CONFIG.timeColName)) {
                timeHeader = th;
                if (!th.classList.contains('tm-sticky-right')) {
                    th.classList.add('tm-sticky-right');
                }
            }
        }

        // Apply sticky class to Time column cells
        if (timeHeader) {
            const headerRow = timeHeader.parentElement;
            if (headerRow) {
                const siblings = Array.from(headerRow.children);
                timeIndex = siblings.indexOf(timeHeader);

                const table = timeHeader.closest('table');
                if (table) {
                    const rows = table.querySelectorAll('tbody tr');
                    for (const row of rows) {
                        if (row.children.length > timeIndex) {
                            const cell = row.children[timeIndex];
                            if (!cell.classList.contains('tm-sticky-right')) {
                                cell.classList.add('tm-sticky-right');
                            }
                        }
                    }
                }
            }
        }
    }

    // Initialize
    addCustomStyles();
    applyTargeting();

    // Watch for dynamic page changes
    const observer = new MutationObserver((mutations) => {
        applyTargeting();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
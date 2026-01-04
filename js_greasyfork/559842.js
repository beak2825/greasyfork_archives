// ==UserScript==
// @name         Chartink TradingView Link
// @namespace    http://tampermonkey.net/
// @version      2025-12-16
// @description  Inserts a Trading View link for each stock in the chartink query result.
// @author       gafoorgk@gmail.com
// @license      GNU GPLv3
// @match        https://chartink.com/screener*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chartink.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559842/Chartink%20TradingView%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/559842/Chartink%20TradingView%20Link.meta.js
// ==/UserScript==


function main() {
    'use strict';

    // Define constants
    const TIMEOUT = 500;
    const STOCK_NAME_COLUMN = 1;
    const LINK_REGEX = /<a.+?href="\/stocks-new\?.+?symbol=(.+?)">(.+?)<\/a>/;

    // Define function wide variables
    let dataTable = undefined;

    // Create an observer to monitor query result table modification
    const observerConfig = { childList: true, subtree: true, attributes: true };
    const observer = new MutationObserver(handleTableUpdate);
    let isObserverActive = false;

    // Create a node template for TradingView link
    const svgTradingView = `<svg id="egdAUoQGMJu1" xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" height="16" viewBox="0 0 149.2 87.4" 
        shape-rendering="geometricPrecision" text-rendering="geometricPrecision" 
        project-id="6e48a2c610194abea3303bdb905bf886" export-id="c9c2d820c17e42298b9dd81122cbfc3d" 
        cached="false" style="display: inline;"><g transform="translate(-19.49975 -48.671346)">
        <rect width="139.567868" height="80.307988" rx="10" ry="10" 
        transform="matrix(1.060416 0 0 1.063157 19.99975 49.67135)" fill="#fff" stroke="#000" stroke-width="2"/>
        <path d="M115.055,72.5c0,7.3638-5.969,13.3333-13.333,13.3333-7.3637,
        0-13.3332-5.9695-13.3332-13.3333s5.9695-13.3333,13.3332-13.3333c7.364,0,13.333,5.9695,13.333,
        13.3333ZM81.9999,59.7778h-53.3332l-.0002,26.6666h26.6667v39.1116h26.6667v-65.7782Zm46.7551,
        0h30.578L131.778,125.556h-30.667l27.644-65.7782Z" clip-rule="evenodd" fill-rule="evenodd"/></g></svg>`;
    const tvElementTemplate = document.createElement('a');
    tvElementTemplate.className = 'gk-chartink-tradingview-link';
    tvElementTemplate.innerHTML = svgTradingView;
    tvElementTemplate.target = '_blank';
    tvElementTemplate.href = '#';

    // Function to run at timeout interval to check existance of query result table
    function checkDataTableExistance() {
        dataTable = document.querySelector('table.rounded-b-\\[0\\.4375rem\\]');
        if (dataTable && !isObserverActive) {
            console.log('Data table got created and a MutationObserver is started on it.');
            // Activate observer on query result table
            observer.observe(dataTable, observerConfig);
            isObserverActive = true;
            // Update the table with custom links initially
            processTable();
        }
        else if (!dataTable && isObserverActive) {
            console.log('Data table got removed and MutationObserver is disconnected.');
            // Deactivate observer
            observer.disconnect();
            isObserverActive = false;
        }
    }

    // The function to run when the table is updated
    function handleTableUpdate(mutationsList, observer) {
        // Consider table change only when it is not custom link append/modification
        let isTableChanged = false;
        for (const mutation of mutationsList) {
            if ((mutation.type === 'attributes') && (mutation.target.className != 'gk-chartink-tradingview-link')) {
                isTableChanged = true;
                break;
            }
        }
        // If table changed for real, update the custom links
        if (isTableChanged) {
            console.log('Table content or attributes were updated!');
            processTable();
        }
    }

    function processTable() {
        // Get all rows from the data table
        const dataRows = dataTable.querySelector('tbody').querySelectorAll('tr');

        if (dataRows.length > 0) {
            dataRows.forEach(row => {
                const dataCell = row.querySelectorAll('td')[STOCK_NAME_COLUMN];
                const dataElement = dataCell.querySelector('a');

                if (dataElement) {
                    const match = dataElement.outerHTML.match(LINK_REGEX);

                    if (match && (dataElement.outerHTML === match[0])) {
                        let tvElement = dataCell.querySelector('a.gk-chartink-tradingview-link');
                        if (!tvElement) {
                            tvElement = tvElementTemplate.cloneNode(true);
                            dataCell.append('\u00A0', tvElement);
                        }
                        tvElement.href = `https://in.tradingview.com/chart/?symbol=NSE:${match[1]}`;
                    }
                }
            });
        }
    }

    const checkTableExistanceInterval = setInterval(checkDataTableExistance, TIMEOUT);
}


main();
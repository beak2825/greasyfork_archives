// ==UserScript==
// @name         Hera Tools
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  Hera Tools for User
// @author       You
// @match        https://hera-private.mokamrp.com/
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mokamrp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550534/Hera%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/550534/Hera%20Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const cache = {}; // Cache object to store fetched data
    const lock = {};  // Lock object to prevent duplicate requests
    let tooltip; // Tooltip element

    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#fff';
        tooltip.style.border = '1px solid #ccc';
        tooltip.style.padding = '5px';
        tooltip.style.display = 'none';
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);
    }

    function showTooltip(event, message) {
        tooltip.innerText = message;
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.style.display = 'block';
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    function checkTableData() {
        const table = document.querySelector('.el-table.el-table--fit.el-table--border');
        if (table) {
            const headerCells = table.querySelectorAll('.el-table__header-wrapper th');
            let uniqueCodeColumnIndex = -1;

            // Find the index of the column with the unique code
            headerCells.forEach((th, index) => {
                if (th.innerText.includes('唯一编码')) {
                    uniqueCodeColumnIndex = index;
                }
            });

            if (uniqueCodeColumnIndex !== -1) {
                const rows = table.querySelectorAll('.el-table__body-wrapper tbody tr');
                if (rows.length > 0) {
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells[uniqueCodeColumnIndex]) {
                            // Add a special class or style to the cell
                            cells[uniqueCodeColumnIndex].style.backgroundColor = 'yellow';
                            cells[uniqueCodeColumnIndex].style.fontWeight = 'bold';

                            // Add click event listener to fetch data and copy to clipboard
                            cells[uniqueCodeColumnIndex].addEventListener('click', (event) => {
                                const uniqueCode = cells[uniqueCodeColumnIndex].innerText;
                                if(!uniqueCode){
                                    return
                                }
                                let data = cache[uniqueCode];
                                if (!data) {
                                    fetchData(uniqueCode, event, () => {
                                        data = cache[uniqueCode];
                                    });
                                }
                                navigator.clipboard.writeText(data).then(() => {
                                    console.log('Data copied to clipboard');
                                }).catch(err => {
                                    console.error('Failed to copy data: ', err);
                                });
                            });

                            // Add mouseover and mouseout event listeners for tooltip
                            cells[uniqueCodeColumnIndex].addEventListener('mouseover', (event) => {
                                const uniqueCode = cells[uniqueCodeColumnIndex].innerText;
                                if(!uniqueCode){
                                    return
                                }
                                if (cache[uniqueCode]) {
                                    showTooltip(event, cache[uniqueCode]);
                                } else {
                                    fetchData(uniqueCode, event, () => {
                                        showTooltip(event, cache[uniqueCode]);
                                    });
                                }
                            });

                            cells[uniqueCodeColumnIndex].addEventListener('mouseout', hideTooltip);
                        }
                    });
                    observer.disconnect(); // Stop observing once data is loaded
                }
            }
        }
    }

    function fetchData(uniqueCode, event, callback) {
        // Prevent duplicate requests using a lock
        if (lock[uniqueCode]) {
            return; // Request already in progress
        }
        lock[uniqueCode] = true; // Set lock

        // Replace with your API endpoint
        const apiUrl = `https://hera-private.mokamrp.com/pangu/private/pangu/fosterwxMobile/getMainMobileUnionCode?mobileUnioCode=${uniqueCode}`;

        fetch(apiUrl, {
            credentials: 'include' // Include cookies in the request
        })
            .then(response => response.json())
            .then(data => {
                cache[uniqueCode] = data.msg; // Save to cache
                delete lock[uniqueCode]; // Remove lock
                if (callback) callback(); // Call the callback function
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                delete lock[uniqueCode]; // Remove lock even on error
                if (callback) callback(); // Ensure the callback is called even on error
            });
    }

    const observer = new MutationObserver(checkTableData);

    const config = { childList: true, subtree: true };

    function startObserving() {
        observer.observe(document.body, config);
    }

    // Check periodically in case of route changes
    setInterval(() => {
        checkTableData();
        startObserving();
    }, 1000);

    // Initial check in case the table is already loaded
    checkTableData();

    // Initialize tooltip
    createTooltip();
})();
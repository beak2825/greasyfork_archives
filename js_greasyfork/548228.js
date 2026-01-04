// ==UserScript==
// @name         Popmundo Mass Show Canceller
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Finds and cancels shows at specific times within a given date range.
// @author       Gemini
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/UpcomingPerformances/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/PerformanceDetails/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/548228/Popmundo%20Mass%20Show%20Canceller.user.js
// @updateURL https://update.greasyfork.org/scripts/548228/Popmundo%20Mass%20Show%20Canceller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        storageKey: 'pm_massCancel_status',
        startDateKey: 'pm_massCancel_startDate',
        endDateKey: 'pm_massCancel_endDate',
        // MODIFICATION: Key updated to reflect multiple times.
        targetTimesKey: 'pm_massCancel_targetTimes'
    };

    // =================================================================================
    // ## Logic for the "Upcoming Performances" Page
    // =================================================================================
    function handleUpcomingPage() {
        const setupUI = () => {
            const tableWrapper = document.getElementById('tableupcoming_wrapper');
            if (!tableWrapper || document.getElementById('massCancelPanel')) return;

            const controlPanel = document.createElement('div');
            // MODIFICATION: The UI now includes a multi-select box for times.
            controlPanel.innerHTML = `
                <div id="massCancelPanel" style="padding: 15px; margin-bottom: 10px; border: 2px solid #c00; background-color: #fdd; text-align: center;">
                    <h3 style="margin: 0 0 10px 0;">Mass Show Canceller</h3>
                    <div style="display: flex; justify-content: center; align-items: flex-start; gap: 20px;">
                        <span>
                            <label for="cancelStartDate">From Date:</label><br>
                            <input type="date" id="cancelStartDate" style="padding: 5px;">
                        </span>
                        <span>
                            <label for="cancelEndDate">To Date:</label><br>
                            <input type="date" id="cancelEndDate" style="padding: 5px;">
                        </span>
                        <span>
                            <label for="cancelTimes">At Times (Ctrl+Click):</label><br>
                            <select id="cancelTimes" multiple size="5" style="padding: 5px; height: 100px; width: 100px;">
                                <option value="14:00" selected>14:00</option>
                                <option value="16:00">16:00</option>
                                <option value="18:00">18:00</option>
                                <option value="20:00">20:00</option>
                                <option value="22:00">22:00</option>
                            </select>
                        </span>
                    </div>
                    <div style="margin-top: 15px;">
                        <button id="startCancelBtn" style="padding: 8px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; font-size: 14px;">Start Mass Cancel</button>
                        <button id="stopCancelBtn" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; cursor: pointer; margin-left: 10px; font-size: 14px;">Stop Process</button>
                    </div>
                    <p id="cancelStatus" style="margin-top: 10px; font-weight: bold; min-height: 1.2em;"></p>
                </div>
            `;
            tableWrapper.prepend(controlPanel);

            addEventListeners();

            // MODIFICATION: Logic to restore the multi-select state on page load.
            if (sessionStorage.getItem(CONFIG.storageKey) === 'RUNNING') {
                document.getElementById('cancelStartDate').value = sessionStorage.getItem(CONFIG.startDateKey);
                document.getElementById('cancelEndDate').value = sessionStorage.getItem(CONFIG.endDateKey);

                const savedTimes = JSON.parse(sessionStorage.getItem(CONFIG.targetTimesKey) || '[]');
                if (savedTimes.length > 0) {
                    document.querySelectorAll('#cancelTimes option').forEach(opt => {
                        opt.selected = savedTimes.includes(opt.value);
                    });
                }
                findAndCancelNextShow();
            }
        };

        const findAndCancelNextShow = () => {
            const statusElement = document.getElementById('cancelStatus');
            const startDateStr = sessionStorage.getItem(CONFIG.startDateKey);
            const endDateStr = sessionStorage.getItem(CONFIG.endDateKey);
            // MODIFICATION: Retrieve the stored times array.
            const targetTimesStr = sessionStorage.getItem(CONFIG.targetTimesKey);

            if (!startDateStr || !endDateStr || !targetTimesStr) return;

            // MODIFICATION: Parse the JSON string into an array and format for display.
            const targetTimes = JSON.parse(targetTimesStr);
            const timesForDisplay = `<b>${targetTimes.join(', ')}</b>`;

            statusElement.innerHTML = `PROCESS RUNNING... Searching for shows at ${timesForDisplay} between ${startDateStr} and ${endDateStr}.`;
            statusElement.style.color = '#c00';

            const startDate = new Date(startDateStr + 'T00:00:00');
            const endDate = new Date(endDateStr + 'T00:00:00');

            const showRows = document.querySelectorAll('#tableupcoming tbody tr');
            let foundShowToCancel = false;

            for (const row of showRows) {
                const dateCell = row.querySelector('td:first-child');
                const detailsCell = row.querySelector('td:last-child');
                if (!dateCell || !detailsCell) continue;

                const sortKeySpan = dateCell.querySelector('span.sortkey');
                let fullDateText = dateCell.textContent;
                if (sortKeySpan) {
                    fullDateText = fullDateText.replace(sortKeySpan.textContent, '').trim();
                }

                const parts = fullDateText.split(',');
                if (parts.length !== 2) continue;

                const showDateStr = parts[0].trim();
                const showTimeStr = parts[1].trim();

                const [day, month, year] = showDateStr.split('/');
                const showDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

                // MODIFICATION: Check if the show's time is in our array of target times.
                if ((showDate >= startDate && showDate <= endDate) && (targetTimes.includes(showTimeStr))) {
                    const detailsLink = detailsCell.querySelector('a');
                    if (detailsLink) {
                        statusElement.textContent = `Found matching show on ${showDateStr} at ${showTimeStr}. Navigating to cancel...`;
                        foundShowToCancel = true;
                        window.location.href = detailsLink.href;
                        return; // Exit after finding one to process
                    }
                }
            }

            if (!foundShowToCancel) {
                statusElement.textContent = `All shows at ${timesForDisplay} in the specified date range have been cancelled.`;
                statusElement.style.color = 'green';
                alert('Mass cancel process finished! ✅');
                sessionStorage.removeItem(CONFIG.storageKey);
                sessionStorage.removeItem(CONFIG.startDateKey);
                sessionStorage.removeItem(CONFIG.endDateKey);
                sessionStorage.removeItem(CONFIG.targetTimesKey); // Use updated key
            }
        };

        const addEventListeners = () => {
            document.getElementById('startCancelBtn').addEventListener('click', () => {
                const startDate = document.getElementById('cancelStartDate').value;
                const endDate = document.getElementById('cancelEndDate').value;

                // MODIFICATION: Get all selected time values.
                const selectedOptions = document.querySelectorAll('#cancelTimes option:checked');
                const targetTimes = Array.from(selectedOptions).map(el => el.value);

                if (!startDate || !endDate || targetTimes.length === 0) {
                    alert('Please select a Start Date, End Date, and at least one Time.');
                    return;
                }
                if (new Date(startDate) > new Date(endDate)) {
                    alert('The start date cannot be after the end date.');
                    return;
                }

                sessionStorage.setItem(CONFIG.storageKey, 'RUNNING');
                sessionStorage.setItem(CONFIG.startDateKey, startDate);
                sessionStorage.setItem(CONFIG.endDateKey, endDate);
                // MODIFICATION: Stringify the array for storage.
                sessionStorage.setItem(CONFIG.targetTimesKey, JSON.stringify(targetTimes));
                findAndCancelNextShow();
            });

            document.getElementById('stopCancelBtn').addEventListener('click', () => {
                sessionStorage.removeItem(CONFIG.storageKey);
                sessionStorage.removeItem(CONFIG.startDateKey);
                sessionStorage.removeItem(CONFIG.endDateKey);
                sessionStorage.removeItem(CONFIG.targetTimesKey); // Use updated key
                alert('Process stopped.');
                location.reload();
            });
        };

        const interval = setInterval(setupUI, 250);
    }

    // =================================================================================
    // ## Logic for the "Performance Details" Page (No changes needed here)
    // =================================================================================
    function handleDetailsPage() {
        if (sessionStorage.getItem(CONFIG.storageKey) === 'RUNNING') {
            const initialCancelButton = document.querySelector('#ctl00_cphLeftColumn_ctl01_btnCancelPerformance');
            if (initialCancelButton) {
                initialCancelButton.click();
                setTimeout(() => {
                    const finalConfirmButton = document.querySelector('body > div:nth-child(4) > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    if (finalConfirmButton && (finalConfirmButton.textContent.includes('Yes') || finalConfirmButton.textContent.includes('Ok'))) {
                        finalConfirmButton.click();
                    } else {
                        console.error("Could not find the FINAL confirmation button. Stopping process.");
                        alert("Error: Could not find the final confirmation button. The process has been stopped.");
                        sessionStorage.removeItem(CONFIG.storageKey);
                    }
                }, 500);
            } else {
                console.log("No 'Cancel Show' button found, maybe it's already cancelled. Returning to list.");
                setTimeout(() => {
                    history.back();
                }, 250);
            }
        }
    }

    // --- Script Router ---
    const path = window.location.pathname;
    if (path.includes('/Artist/UpcomingPerformances/')) {
        handleUpcomingPage();
    } else if (path.includes('/Artist/PerformanceDetails/')) {
        handleDetailsPage();
    }
})();
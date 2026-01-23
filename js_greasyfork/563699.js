// ==UserScript==
// @name         Automatic Change/AH-Change For Finviz (With Auto-Refresh)
// @version      1.0
// @description  Modifies URL parameter based on time and auto-refreshes at specific times (NY Time).
// @author       Game Abuse Studios
// @license      MIT
// @match        https://elite.finviz.com/screener.ashx*
// @grant        none
// @namespace https://greasyfork.org/users/1510982
// @downloadURL https://update.greasyfork.org/scripts/563699/Automatic%20ChangeAH-Change%20For%20Finviz%20%28With%20Auto-Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563699/Automatic%20ChangeAH-Change%20For%20Finviz%20%28With%20Auto-Refresh%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const targetUrlPath = 'screener.ashx';

    // URL Parameter Values
    const changeValue = '-change';
    const afterChangeValue = '-afterchange';

    // Parameter Switch Times (NY Time)
    // Switch to '-afterchange' window starts:
    const afterChangeStartHour = 15; // 3 PM
    const afterChangeStartMinute = 59;
    // Switch back to '-change' window starts:
    const changeTimeHour = 19; // 7 PM
    const changeTimeMinute = 59;

    // Refresh Times (NY Time) - [Hour, Minute] (24-hour format)
    const refreshSchedule = [
        [3, 59],   // 3:59 AM
        [9, 29],   // 9:29 AM
        [15, 0],   // 3:00 PM
        [23, 0]    // 11:00 PM
    ];
    // -----------------------

    // Helper: Get current NY Time object
    function getNyTime() {
        const now = new Date();
        const nyString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
        return new Date(nyString);
    }

    // Function 1: Update URL Parameter 'o'
    function updateUrlParam() {
        const url = new URL(window.location.href);
        if (!url.pathname.includes(targetUrlPath)) return;

        const currentTime = getNyTime();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        // Check if we are inside the "After Hours" window (approx 4pm - 8pm)
        // Logic: After 3:59PM ... AND ... Before 7:59PM
        const isAfterStart = (currentHour > afterChangeStartHour) ||
                             (currentHour === afterChangeStartHour && currentMinute >= afterChangeStartMinute);

        const isBeforeEnd = (currentHour < changeTimeHour) ||
                            (currentHour === changeTimeHour && currentMinute < changeTimeMinute);

        const isAfterChangeWindow = isAfterStart && isBeforeEnd;

        let newOValue = isAfterChangeWindow ? afterChangeValue : changeValue;
        const existingOValue = url.searchParams.get('o');

        if (existingOValue !== newOValue) {
            console.log(`[Finviz Script] Switching 'o' from '${existingOValue}' to '${newOValue}'`);
            url.searchParams.set('o', newOValue);
            window.location.replace(url.toString());
        }
    }

    // Function 2: Handle Scheduled Page Refreshes
    function checkScheduledRefresh() {
        const currentTime = getNyTime();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        // Create a unique key for today to prevent infinite loops (e.g., "refresh-2023-10-25-9-29")
        const dateKey = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`;

        refreshSchedule.forEach(time => {
            const [targetHour, targetMinute] = time;

            if (currentHour === targetHour && currentMinute === targetMinute) {
                const storageKey = `finviz-refreshed-${dateKey}-${targetHour}-${targetMinute}`;

                // Check if we already refreshed for this specific time slot today
                if (!sessionStorage.getItem(storageKey)) {
                    console.log(`[Finviz Script] Triggering scheduled refresh at ${targetHour}:${targetMinute}`);

                    // Mark as done so we don't refresh again in the same minute
                    sessionStorage.setItem(storageKey, 'true');

                    window.location.reload();
                }
            }
        });
    }

    // Main Orchestrator
    function runChecks() {
        updateUrlParam();
        checkScheduledRefresh();
    }

    // Run checks every 5 seconds (more frequent to catch the exact minute)
    setInterval(runChecks, 5000);

    // Run immediately on load
    runChecks();

})();
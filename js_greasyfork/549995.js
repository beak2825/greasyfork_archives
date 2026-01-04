// ==UserScript==
// @name         Torn HoF - Last Jailed Tracker
// @namespace    https://greasyfork.org/users/yourname
// @version      0.1
// @description  Adds a "Last Jailed" column to the Hall of Fame showing how many days ago each player was last jailed.
// @author       You
// @match        https://www.torn.com/halloffame.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549995/Torn%20HoF%20-%20Last%20Jailed%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/549995/Torn%20HoF%20-%20Last%20Jailed%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper: fetch last jailed info
    async function getLastJailDays(userID) {
        try {
            const resp = await fetch("/personalstats.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: new URLSearchParams({
                    step: "getGraphData",
                    statNames: JSON.stringify(["jailed"]),
                    ID: userID
                }),
                credentials: "include"
            });

            const data = await resp.json();
            if (!data?.data?.jailed) return null;

            const points = data.data.jailed;
            let lastJail = null;

            for (let i = 1; i < points.length; i++) {
                if (points[i].value > points[i - 1].value) {
                    lastJail = points[i].timestamp;
                }
            }

            if (!lastJail) return null;
            const daysSince = Math.floor((Date.now() / 1000 - lastJail) / 86400);
            return daysSince;
        } catch (e) {
            console.error("Error fetching jail stats for user", userID, e);
            return null;
        }
    }

    // Add header column
    const table = document.querySelector('.table');
    if (!table) return;
    const headerRow = table.querySelector('tr');
    if (headerRow) {
        const th = document.createElement('th');
        th.textContent = 'Last Jailed';
        headerRow.appendChild(th);
    }

    // Loop through rows
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index === 0) return; // skip header

        const profileLink = row.querySelector('a[href*="profiles.php"]');
        if (!profileLink) return;

        const match = profileLink.href.match(/XID=(\d+)/);
        if (!match) return;
        const userID = match[1];

        // Placeholder cell
        const td = document.createElement('td');
        td.textContent = '…';
        row.appendChild(td);

        // Fill asynchronously
        getLastJailDays(userID).then(days => {
            td.textContent = days !== null ? `${days}d ago` : 'N/A';
        });
    });
})();
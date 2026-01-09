// ==UserScript==
// @name         Torn Prayer Reminder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows praying hands on Torn pages until you go to church.
// @author       srsbsns
// @match        *.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561978/Torn%20Prayer%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/561978/Torn%20Prayer%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const RESET_HOUR_TCT = 17; // Set this to the hour (0-23) you want the reminder to appear (0 = Midnight TCT)
    const ICON_URL = "https://img.icons8.com/ios-filled/50/prayer.png"; // Praying hands icon
    // ---------------------

    function checkPrayerStatus() {
        const now = new Date();
        const currentTCTHour = now.getUTCHours();

        // Create a unique key for "today" based on the reset hour
        // If it's currently before the reset hour, it's still "yesterday" in terms of the reminder
        let effectiveDate = now.getUTCDate();
        if (currentTCTHour < RESET_HOUR_TCT) {
            effectiveDate -= 1;
        }

        const dateKey = `torn_prayer_${now.getUTCFullYear()}_${now.getUTCMonth()}_${effectiveDate}`;
        const hasPrayed = localStorage.getItem(dateKey);

        // If on the church page, and we haven't marked today as done,
        // we can't automate the button click (against rules),
        // but we can set the reminder to "hidden" when you click the icon to get here.
        if (window.location.href.includes("church.php")) {
            // Optional: You can manually click the icon to dismiss it,
            // or we can hide it automatically once you land on the church page.
        }

        if (!hasPrayed) {
            showReminder(dateKey);
        }
    }

    function showReminder(dateKey) {
        const container = document.createElement('div');
        container.id = 'prayer-reminder-icon';
        container.innerHTML = `
            <img src="${ICON_URL}" style="width:50px; height:50px; cursor:pointer; filter: drop-shadow(0px 0px 5px gold);">
            <div style="font-size:10px; color:white; text-align:center; background:rgba(0,0,0,0.7); border-radius:4px;">PRAY</div>
        `;

        // Styling the floating position
        Object.assign(container.style, {
            position: 'fixed',
            top: '20%',
            right: '70px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        });

        // Action when clicked
        container.onclick = function() {
            localStorage.setItem(dateKey, 'true');
            window.location.href = "https://www.torn.com/church.php";
        };

        document.body.appendChild(container);
    }

    // Run the check
    checkPrayerStatus();
})();
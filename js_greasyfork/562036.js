// ==UserScript==
// @name         Faction RW Start Time
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reads the countdown timer from the Faction RW page and calculates and displays RW start time in the current timezone.
// @author       Ryskill [2989738]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562036/Faction%20RW%20Start%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/562036/Faction%20RW%20Start%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function readTimer() {
        // Find the timer span element using multiple methods
        let timerSpan = document.querySelector('span[role="alert"][aria-live="off"]');

        // If not found, try looking for any span with role="alert" inside the war list
        if (!timerSpan) {
            const warList = document.querySelector('ul[class*="statsBox"]');
            if (warList) {
                timerSpan = warList.querySelector('span[role="alert"]');
            }
        }

        if (!timerSpan) {
            return null;
        }

        // Get all span children and extract their text content
        const spans = timerSpan.querySelectorAll('span');
        let timerText = '';

        spans.forEach(span => {
            const text = span.textContent.trim();
            // Only add if it's a digit or colon
            if (/^[\d:]$/.test(text)) {
                timerText += text;
            }
        });

        // Parse the timer format DD:HH:MM:SS
        const parts = timerText.split(':');

        if (parts.length !== 4) {
            return null;
        }

        const days = parseInt(parts[0], 10);
        const hours = parseInt(parts[1], 10);
        const minutes = parseInt(parts[2], 10);
        const seconds = parseInt(parts[3], 10);

        // Validate that we got valid numbers
        if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return null;
        }

        return { days, hours, minutes, seconds, timerText };
    }

    function calculateEndTime(timerData) {
        if (!timerData) return null;

        const { days, hours, minutes, seconds } = timerData;

        // Calculate total milliseconds remaining
        const totalMs = (days * 24 * 60 * 60 * 1000) +
                       (hours * 60 * 60 * 1000) +
                       (minutes * 60 * 1000) +
                       (seconds * 1000);

        // Current time (in user's local timezone)
        const now = new Date();

        // Calculate when the timer will reach zero (end time)
        const endTime = new Date(now.getTime() + totalMs);

        // Round end time to nearest 5-minute mark
        const endTimeRounded = new Date(endTime);
        const mins = endTimeRounded.getMinutes();
        const remainder = mins % 5;

        if (remainder < 2.5) {
            // Round down
            endTimeRounded.setMinutes(mins - remainder);
        } else {
            // Round up
            endTimeRounded.setMinutes(mins + (5 - remainder));
        }
        endTimeRounded.setSeconds(0, 0); // Set seconds and milliseconds to 0

        return {
            now,
            endTime: endTimeRounded,
            totalSecondsRemaining: Math.floor(totalMs / 1000)
        };
    }

    function displayInfo() {
        const timerData = readTimer();

        if (!timerData) {
            return;
        }

        const timeInfo = calculateEndTime(timerData);

        if (!timeInfo) {
            return;
        }

        // Find the timer element
        let timerSpan = document.querySelector('span[role="alert"][aria-live="off"]');

        if (!timerSpan) {
            const warList = document.querySelector('ul[class*="statsBox"]');
            if (warList) {
                timerSpan = warList.querySelector('span[role="alert"]');
            }
        }

        if (timerSpan) {
            // Check if we already added the end time after the timer
            let endTimeSpan = timerSpan.nextElementSibling;

            if (!endTimeSpan || !endTimeSpan.classList.contains('timer-end-time-display')) {
                endTimeSpan = document.createElement('span');
                endTimeSpan.classList.add('timer-end-time-display');
                endTimeSpan.style.cssText = `
                    color: #999;
                    font-size: 1em;
                    margin-left: 8px;
                `;
                timerSpan.parentNode.insertBefore(endTimeSpan, timerSpan.nextSibling);
            }

            // Format the end time (uses user's local timezone automatically)
            const endTimeStr = timeInfo.endTime.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            endTimeSpan.textContent = endTimeStr;
        }
    }

    // Wait for page to load, then check for timer
    function init() {
        // Use MutationObserver to wait for the timer to appear
        const observer = new MutationObserver((mutations, obs) => {
            const timer = document.querySelector('span[role="alert"]');
            if (timer) {
                displayInfo();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also try immediately in case it's already loaded
        setTimeout(displayInfo, 1000);

        // Try again after a longer delay
        setTimeout(displayInfo, 3000);
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
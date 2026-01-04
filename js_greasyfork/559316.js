// ==UserScript==
// @name         Bardiensten
// @namespace    http://tampermonkey.net/
// @version      2025-12-18
// @description  Shows the length of the shifts calculated from the start and end time
// @author       You
// @match        https://mijn.knltb.club/*
// @icon         https://www.knltb.club/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559316/Bardiensten.user.js
// @updateURL https://update.greasyfork.org/scripts/559316/Bardiensten.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculateDuration(startTime, endTime) {
        // Parse time strings (format: HH:MM)
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        // Convert to minutes
        let startMinutes = startHour * 60 + startMin;
        let endMinutes = endHour * 60 + endMin;

        // Handle shifts that cross midnight
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }

        // Calculate duration
        const durationMinutes = endMinutes - startMinutes;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        // Format as H:MM and return both formatted string and total minutes
        return {
            formatted: `${hours}:${minutes.toString().padStart(2, '0')}`,
            minutes: durationMinutes
        };
    }

    function addDurations() {
        // Find all time spans
        const timeElements = document.querySelectorAll('.time');

        timeElements.forEach(element => {
            const timeText = element.textContent.trim();
            const match = timeText.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);

            if (match) {
                const startTime = match[1];
                const endTime = match[2];
                const duration = calculateDuration(startTime, endTime);

                // Check if duration hasn't been added yet
                if (!element.querySelector('.duration')) {
                    const durationSpan = document.createElement('span');
                    durationSpan.className = 'duration';
                    durationSpan.style.fontWeight = 'bold';
                    durationSpan.style.marginLeft = '3px';
                    durationSpan.textContent = `= ${duration.formatted}`;

                    // Make red if 3 hours or less
                    if (duration.minutes <= 180) {
                        durationSpan.style.color = 'red';
                    }

                    element.appendChild(durationSpan);
                }
            }
        });
    }

    // Run when page loads
    addDurations();

    // Also observe for dynamic content changes
    const observer = new MutationObserver(addDurations);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
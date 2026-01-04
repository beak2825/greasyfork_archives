// ==UserScript==
// @name         FV - Highest Login Streak Tracker
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Tracks and displays your highest login streak on Furvilla from the Daily Streak Page.
// @author       necroam
// @match        https://www.furvilla.com/dailies
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555788/FV%20-%20Highest%20Login%20Streak%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/555788/FV%20-%20Highest%20Login%20Streak%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const streakContainer = document.querySelector('.registration-well.text-center');
        if (!streakContainer) return;

        const streakText = streakContainer.textContent;
        const currentMatch = streakText.match(/logged in (\d+) days in a row/i);
        if (!currentMatch) return;

        const currentStreak = parseInt(currentMatch[1]);
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const lastUpdateDate = localStorage.getItem('furvillaStreakLastUpdated');
        const storedStreak = parseInt(localStorage.getItem('furvillaCurrentStreak')) || 0;
        const storedHigh = parseInt(localStorage.getItem('furvillaHighestStreak')) || 0;

        // Update stored streak only if the date has changed
        if (lastUpdateDate !== today) {
            localStorage.setItem('furvillaCurrentStreak', currentStreak);
            localStorage.setItem('furvillaStreakLastUpdated', today);
        }

        // Update highest streak if needed
        if (currentStreak > storedHigh) {
            localStorage.setItem('furvillaHighestStreak', currentStreak);
        }

        const highestStreak = Math.max(currentStreak, storedHigh);

        const highStreakLine = document.createElement('div');
        highStreakLine.textContent = `Your highest login streak is ${highestStreak} days!`;
        highStreakLine.style.marginTop = '8px';
        highStreakLine.style.fontWeight = 'bold';
        highStreakLine.style.fontSize = '1.1em';
        highStreakLine.style.textShadow = getTextShadow(); // subtle outline for light mode

        streakContainer.appendChild(highStreakLine);
    });

    function getTextShadow() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'none' : '0 0 1px #000, 0 0 2px #000';
    }
})();

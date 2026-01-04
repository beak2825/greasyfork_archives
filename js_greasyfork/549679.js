// ==UserScript==
// @name         Microsoft Authentication Timer
// @namespace    http://tampermonkey.net/
// @version      2025.09.15.1
// @description  Time how long we're waiting on loading screens...
// @author       Vance M. Allen, Office of the State Board of Education, Idaho
// @match        https://login.microsoftonline.com/a4e2c576-1d02-4d7c-9d04-5564f6af8fe7/wsfed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/549679/Microsoft%20Authentication%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/549679/Microsoft%20Authentication%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = 500;

    const body = document.getElementsByTagName('body')[0];
    const heading = document.createElement('h1');
    heading.textContent = 'Microsoft Authentication Timers';

    const status = document.createElement('p');
    const statusYear = document.createElement('p');
    const statusWeek = document.createElement('p');

    [heading,status,statusYear,statusWeek].forEach(x => {
        x.style.fontSize = (x.tagName === 'H1' ? '2em' : '1.5em');
        body.appendChild(x);
    });

    const friendlyTime = sec => {
        const d = Math.floor(sec/(3600*24));
        const h = Math.floor(sec % (3600*24) / 3600);
        const m = Math.floor(sec % 3600 / 60);
        const s = Math.floor(sec % 60);
        return `${d ? d + (d > 1 ? ' days ' : ' day ') : ''}` +
            `${h ? h + (h > 1 ? ' hours ' : ' hour ') : ''}` +
            `${m ? m + (m > 1 ? ' minutes ' : ' minute ') : ''}` +
            `${s ? s + (s != 1 ? ' seconds ' : ' second ') : ''}`.trim();
    };

    // Week Number Calculation
    // Courtesy of: https://stackoverflow.com/a/14127528
    Date.prototype.iso8601Week = function() {
        // Create a copy of the current date, we don't want to mutate the original
        const date = new Date(this.getTime());

        // Find Thursday of this week starting on Monday
        date.setDate(date.getDate() + 4 - (date.getDay() || 7));
        const thursday = date.getTime();

        // Find January 1st
        date.setMonth(0); // January
        date.setDate(1); // 1st
        const jan1st = date.getTime();

        // Round the amount of days to compensate for daylight saving time
        const days = Math.round((thursday - jan1st) / 86400000); // 1 day = 86400000 ms
        return Math.floor(days / 7) + 1;
    };

    // Get the current week number.
    let currentWeek = new Date().iso8601Week();
    localStorage.setItem(`msLoadingTimer_Week_Number`, currentWeek);

    // Cycle through local storage to clean things up.
    for(let i in localStorage) {
        let key = localStorage.key(i);

        // Clean up results from week(s) that aren't the current week.
        if(
            // Regex to test that key is a weekly key
            /^msLoadingTimer_Week_\d+/.test(key) &&
            // Regex to test if key is NOT the current week
            !new RegExp(`^msLoadingTimer_Week_${currentWeek}`).test(key)
        ) {
            // It is a weekly key, but not for the current week, so take it out.
            console.debug('removing key: ', key);
            localStorage.removeItem(key);
        }
    }

    // Pull current overall time
    let t = parseFloat(localStorage.getItem('msLoadingTimer')) || 0;

    // Set up the status
    setInterval(function() {
        let week = new Date().iso8601Week();
        let w = parseFloat(localStorage.getItem(`msLoadingTimer_Week_${currentWeek}`)) || 0;

        let year = new Date().getFullYear();
        let y = parseFloat(localStorage.getItem(`msLoadingTimer_${year}`)) || 0;

        // Increment each of the timers by interval, but in seconds (not milliseconds).
        t += (interval/1000);
        w += (interval/1000);
        y += (interval/1000);

        status.textContent = `Total Time: ${friendlyTime(t)}...`;
        statusYear.textContent = `This Year: ${friendlyTime(y)}...`;
        statusWeek.textContent = `This Week: ${friendlyTime(w)}...`;

        localStorage.setItem(`msLoadingTimer`, t);
        localStorage.setItem(`msLoadingTimer_Week_${currentWeek}`, w);
        localStorage.setItem(`msLoadingTimer_${year}`, y);
    },interval);
})();
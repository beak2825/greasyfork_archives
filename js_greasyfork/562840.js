// ==UserScript==
// @name         Rem4rk's Torn Flight Arrival Alarm
// @namespace    https://torn.com/
// @version      1.2
// @description  Plays a persistent alarm when flight reaches ~100% until user interacts (click, key, scroll, or touch)
// @match        https://www.torn.com/*
// @author       rem4rk [2375926] - https://www.torn.com/profiles.php?XID=2375926
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562840/Rem4rk%27s%20Torn%20Flight%20Arrival%20Alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/562840/Rem4rk%27s%20Torn%20Flight%20Arrival%20Alarm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 1000; // 1 second
    const ALARM_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

    let alarm = new Audio(ALARM_URL);
    alarm.volume = 1.0;
    alarm.loop = true;
    let triggered = false;

    // Stop alarm on any user interaction
    function stopAlarm() {
        if (triggered) {
            alarm.pause();
            alarm.currentTime = 0;
            triggered = false;
            console.log('[Flight Alarm] Stopped by user interaction');
            window.removeEventListener('click', stopAlarm);
            window.removeEventListener('keydown', stopAlarm);
            window.removeEventListener('scroll', stopAlarm);
            window.removeEventListener('touchstart', stopAlarm);
            window.removeEventListener('touchend', stopAlarm);
        }
    }

    window.addEventListener('click', stopAlarm);
    window.addEventListener('keydown', stopAlarm);
    window.addEventListener('scroll', stopAlarm);
    window.addEventListener('touchstart', stopAlarm);
    window.addEventListener('touchend', stopAlarm);

    function getFlightProgress() {
        const flightBar = document.querySelector('.flightProgressBar___HI4pY');
        if (!flightBar) return null;

        const progressDiv = flightBar.querySelector('.fill___Tn02w');
        const progressHead = flightBar.querySelector('.fillHead___VoWpT');

        let progress = null;
        if (progressDiv) progress = parseFloat(progressDiv.style.width);
        if (progressHead) {
            const style = progressHead.style.left || progressHead.style.right;
            progress = Math.max(progress ?? 0, parseFloat(style));
        }

        return progress;
    }

    function checkProgress() {
        const progress = getFlightProgress();
        if (progress === null) return;

        console.log(`[Flight Alarm] Flight progress: ${progress.toFixed(1)}%`);

        if (!triggered && progress >= 99.9) {
            triggered = true;
            console.log('[Flight Alarm] Flight complete — playing alarm');
            alarm.play().catch(err => console.error('[Flight Alarm] Audio failed:', err));
        }
    }

    setInterval(checkProgress, CHECK_INTERVAL);
})();

// ==UserScript==
// @name         Coindoog Faucet Auto Refresh + Timer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-refresh Coindoog faucet page every 1 minute with on-screen countdown
// @author        KukuModZ
// @match        https://coindoog.com/faucet/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554600/Coindoog%20Faucet%20Auto%20Refresh%20%2B%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/554600/Coindoog%20Faucet%20Auto%20Refresh%20%2B%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REFRESH_INTERVAL = 60; // seconds

    // Create timer element
    const timerBox = document.createElement('div');
    timerBox.style.position = 'fixed';
    timerBox.style.bottom = '10px';
    timerBox.style.right = '10px';
    timerBox.style.padding = '8px 12px';
    timerBox.style.background = 'rgba(0,0,0,0.7)';
    timerBox.style.color = 'white';
    timerBox.style.fontSize = '14px';
    timerBox.style.borderRadius = '5px';
    timerBox.style.zIndex = '9999';
    timerBox.style.fontFamily = 'monospace';
    document.body.appendChild(timerBox);

    let secondsLeft = REFRESH_INTERVAL;
    timerBox.textContent = `Refreshing in ${secondsLeft}s`;

    // Countdown timer
    const interval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
            clearInterval(interval);
            location.reload();
        } else {
            timerBox.textContent = `Refreshing in ${secondsLeft}s`;
        }
    }, 1000);
})();

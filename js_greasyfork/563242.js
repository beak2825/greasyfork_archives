// ==UserScript==
// @name         Adlink Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  12 second wait
// @author       pcayb96
// @match        https://www.diudemy.com/*
// @match        https://www.maqal360.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563242/Adlink%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/563242/Adlink%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timeLeft = 12; // 12 seconds timer

    // Screen par ek chota sa timer dikhane ke liye (Optional)
    const timerDiv = document.createElement('div');
    timerDiv.style = "position: fixed; top: 10px; right: 10px; z-index: 9999; background: orange; color: white; padding: 10px; border-radius: 5px; font-weight: bold; font-family: sans-serif;";
    document.body.appendChild(timerDiv);

    function startCounting() {
        const countdown = setInterval(() => {
            timerDiv.innerHTML = "Auto-Click in: " + timeLeft + "s";

            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerDiv.innerHTML = "Clicking Now...";
                timerDiv.style.background = "green";
                performClick();
            }
            timeLeft--;
        }, 1000);
    }

    function performClick() {
        const skipBtn = document.querySelector("#skip-btn");

        if (skipBtn) {
            // Force Show (agar hidden ho)
            skipBtn.style.setProperty('display', 'block', 'important');
            skipBtn.style.setProperty('visibility', 'visible', 'important');

            console.log("Timer khatam! Clicking #skip-btn...");

            // 1. Try Click
            skipBtn.click();

            // 2. Try Mouse Event (Backup)
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            skipBtn.dispatchEvent(clickEvent);

            // 3. Try Redirect (Agar click kaam na kare)
            setTimeout(() => {
                if (skipBtn.href && skipBtn.href !== "#") {
                    window.location.href = skipBtn.href;
                }
            }, 1000);
        } else {
            timerDiv.innerHTML = "Error: Button nahi mila!";
            timerDiv.style.background = "red";
        }
    }

    // Page load hote hi countdown shuru karein
    window.addEventListener('load', startCounting);

})();

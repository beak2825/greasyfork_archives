// ==UserScript==
// @name         Auto-extend ATI module sessions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Redirect navigation to ATI modules into a new tab instead of the current one
// @author       beepbopboop
// @match        *://lms.atitesting.com/*
// @match        *://tutorials.atitesting.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563289/Auto-extend%20ATI%20module%20sessions.user.js
// @updateURL https://update.greasyfork.org/scripts/563289/Auto-extend%20ATI%20module%20sessions.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const WATCH_INTERVAL_MS = 30 * 1000; // 30 seconds
    const TOTAL_DURATION_MS = 90 * 60 * 1000; // 90 minutes

    const startTime = Date.now();

    const watcher = setInterval(() => {
        const elapsed = Date.now() - startTime;

        if (elapsed >= TOTAL_DURATION_MS) {
            clearInterval(watcher);
            return;
        }

        const lmsContinueButton = document.querySelector('button.continue-btn');
        if (lmsContinueButton) {
            lmsContinueButton.click();
        }

        const tutorialContinueButton = document.querySelector('a.button[aria-label="continue button"]');
        if (tutorialContinueButton) {
            tutorialContinueButton.click();
        }
    }, WATCH_INTERVAL_MS);
})();

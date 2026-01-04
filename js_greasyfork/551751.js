// ==UserScript==
// @name         Monkey.app Auto Skip (v6 - Final)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Skips males and duo matches, using the correct skip button for each scenario.
// @author       You
// @match        https://www.monkey.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551751/Monkeyapp%20Auto%20Skip%20%28v6%20-%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551751/Monkeyapp%20Auto%20Skip%20%28v6%20-%20Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Monkey.app Auto Skip v6 is active (handles all skip buttons).");

    const observer = new MutationObserver(() => {
        // Step 1: Look for the 'Connecting...' screen.
        const connectingScreen = document.querySelector('.enter-room-before');

        if (!connectingScreen) {
            return;
        }

        // Step 2: Decide if we need to skip.
        let shouldSkip = false;
        let reason = "";

        // Condition A: Check if it's a duo match.
        if (connectingScreen.innerText.includes('Meet two friends from')) {
            shouldSkip = true;
            reason = "Duo match detected.";
        }
        // Condition B: If not a duo, check if the user is male.
        else {
            const boldSpans = connectingScreen.querySelectorAll('span.bold');
            for (const span of boldSpans) {
                if (span.textContent.trim() === 'He') {
                    shouldSkip = true;
                    reason = "Male detected.";
                    break;
                }
            }
        }

        // Step 3: If a skip is needed, find the correct button and click it.
        if (shouldSkip) {
            console.log(reason + " Waiting for a skip button.");
            observer.disconnect();

            const interval = setInterval(() => {
                // THIS IS THE MODIFIED LINE:
                // This selector uses a comma to act as an "OR". It will find the first element
                // that is EITHER the regular skip button OR the duo skip button.
                const skipButton = document.querySelector(
                    'div.ps-next[data-role="action"], div.leave-btn.onevtwo'
                );

                if (skipButton) {
                    console.log("A valid skip button was found. Clicking now.");
                    skipButton.click();
                    clearInterval(interval);

                    setTimeout(() => {
                        console.log("Observer re-activated for next match.");
                        observer.observe(document.body, { childList: true, subtree: true });
                    }, 500);
                }
            }, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
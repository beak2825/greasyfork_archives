// ==UserScript==
// @name         Google Gemini: Auto-Select Pro Model
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically selects Gemini Pro (once per session) and allows manual switching afterward.
// @author       BillRenCN
// @license      MIT
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564382/Google%20Gemini%3A%20Auto-Select%20Pro%20Model.user.js
// @updateURL https://update.greasyfork.org/scripts/564382/Google%20Gemini%3A%20Auto-Select%20Pro%20Model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 500; // Check every 0.5 seconds
    const MAX_RETRIES = 20;     // Stop checking after 10 seconds (to save resources)
    let retryCount = 0;

    const PRO_OPTION_SELECTOR = 'button[data-test-id="bard-mode-option-pro"]';
    const MODEL_LABEL_SELECTOR = 'div[data-test-id="logo-pill-label-container"]';

    const intervalId = setInterval(() => {
        const currentLabel = document.querySelector(MODEL_LABEL_SELECTOR);

        // 1. If element isn't loaded yet, keep waiting
        if (!currentLabel) {
            retryCount++;
            if (retryCount > MAX_RETRIES) clearInterval(intervalId); // Give up if page takes too long
            return;
        }

        // 2. SUCCESS STATE: If we are already on "Pro", stop the script immediately.
        // This ensures that if you manually switch back to Fast later, the script won't fight you.
        if (currentLabel.innerText.includes("Pro")) {
            console.log("Gemini Pro Auto-Select: Pro mode active. Script stopping.");
            clearInterval(intervalId);
            return;
        }

        // 3. ACTION STATE: If we are on "Fast", perform the switch.
        if (currentLabel.innerText.includes("Fast")) {
            const triggerButton = currentLabel.closest('button') || currentLabel.closest('[role="button"]');

            if (triggerButton) {
                // Open the dropdown
                triggerButton.click();

                // Wait slightly for the dropdown to render, then click Pro
                setTimeout(() => {
                    const proButton = document.querySelector(PRO_OPTION_SELECTOR);
                    if (proButton) {
                        proButton.click();
                        // We do NOT clear interval here. We let the next loop verify the text changed to "Pro".
                    }
                }, 100);
            }
        }
    }, CHECK_INTERVAL);

})();
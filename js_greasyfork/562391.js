// ==UserScript==
// @name         BlockPulse Auto-Claimer
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Automatically clicks the claim button after Turnstile captcha is solved.
// @author       Rubystance
// @license      MIT
// @match        https://blockpulse.fun/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562391/BlockPulse%20Auto-Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/562391/BlockPulse%20Auto-Claimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REF_URL = "https://blockpulse.fun/?r=1929";

    const handleReferral = () => {
        const hasRedirected = sessionStorage.getItem('refRedirected');
        const currentUrl = window.location.href;

        if (!hasRedirected && !currentUrl.includes('?r=1929')) {
            sessionStorage.setItem('refRedirected', 'true');
            window.location.href = REF_URL;
        }
    };

    const startClaimProcess = () => {
        const checkInterval = setInterval(() => {

            const claimBtn = document.querySelector('button[name="start_shortlink"]');

            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');

            if (claimBtn && turnstileResponse) {

                if (turnstileResponse.value.length > 0) {
                    console.log("Turnstile solved! Preparing to claim...");

                    clearInterval(checkInterval);

                    const randomDelay = Math.floor(Math.random() * 1000) + 1500;

                    setTimeout(() => {
                        console.log("Button clicked.");
                        claimBtn.click();
                    }, randomDelay);
                }
            }
        }, 1000);
    };

    handleReferral();
    startClaimProcess();

})();
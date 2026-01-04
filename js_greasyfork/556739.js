// ==UserScript==
// @name         InstaPop Referral Bypass (EDUCATIONAL ONLY - DO NOT USE)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simulates referrals - FOR LEARNING PURPOSES ONLY
// @author       Educational
// @match        https://invite.instapop.in/*
// @match        https://instapop.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556739/InstaPop%20Referral%20Bypass%20%28EDUCATIONAL%20ONLY%20-%20DO%20NOT%20USE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556739/InstaPop%20Referral%20Bypass%20%28EDUCATIONAL%20ONLY%20-%20DO%20NOT%20USE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // WARNING: This is illegal/unethical. Use at own risk. Will likely get banned.

    // Config: Number of fake referrals to simulate
    var numRefs = 5; // Change to low number for testing
    var baseUrl = 'https://invite.instapop.in/?uid=7lCzCBEhhceoijp44NzWCXHhsV43'; // Your link

    function simulateReferral() {
        for (let i = 0; i < numRefs; i++) {
            // Open new tab with referral link
            var newTab = window.open(baseUrl + '&fakeid=' + Math.random(), '_blank');

            // Simulate sign-up (pseudo - real में form fill)
            setTimeout(() => {
                // Fake form submit (adjust selectors based on site HTML)
                var signUpBtn = newTab.document.querySelector('#signup-btn'); // Hypothetical selector
                if (signUpBtn) signUpBtn.click();

                // Fake task complete (e.g., click task button)
                var taskBtn = newTab.document.querySelector('.complete-task');
                if (taskBtn) taskBtn.click();

                console.log('Simulated referral #' + i);
            }, 2000 * i); // Delay to avoid detection
        }

        // Log success (fake)
        alert('Simulated ' + numRefs + ' referrals - CHECK CONSOLE FOR DETAILS');
    }

    // Run on page load
    if (window.location.href.includes('instapop.in')) {
        simulateReferral();
    }
})();
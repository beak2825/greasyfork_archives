// ==UserScript==
// @name         Hide Pornhub Age Disclaimer
// @namespace    https://github.com/danmaclann
// @version      1.03
// @license      MIT
// @description  Hides overlays after load, stops polling/observer once hidden
// @author       danmaclann
// @match        https://*.pornhub.com/*
// @grant        none
// @run-at       document-start
// @icon         https://ei.phncdn.com/www-static/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/563750/Hide%20Pornhub%20Age%20Disclaimer.user.js
// @updateURL https://update.greasyfork.org/scripts/563750/Hide%20Pornhub%20Age%20Disclaimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block modal immediately
    const style = document.createElement('style');
    style.textContent = `
        #modalWrapMTubes,
        #ageDisclaimerMainBG {
            display: none !important;
        }
        #modalWrapMTubes *,
        #ageDisclaimerMainBG * {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    console.log('Pornhub age gate blocker injected');

    function autoConfirm() {
        // Target the exact Enter button from your HTML
        const enterBtn = document.querySelector('.gtm-event-age-verification.js-closeAgeModal.buttonOver18[data-label="over18_enter"]') ||
                        document.querySelector('button[data-label="over18_exit"]') ||
                        document.querySelector('#modalWrapMTubes button');

        if (enterBtn) {
            // console.log('Found Enter button, clicking...');
            // enterBtn.focus();
            // enterBtn.click();
            // Hide modal too
            const modal = document.getElementById('modalWrapMTubes');
            if (modal) {
                modal.remove();
                console.log('Modal removed');
            }
            return true;
        }

        const modal = document.getElementById('modalWrapMTubes');
        if (modal) {
            modal.remove();
            console.log('Modal removed directly');
            return true;
        }

        return false;
    }

    // Try immediately and poll aggressively
    if (autoConfirm()) return;

    const interval = setInterval(() => {
        if (autoConfirm()) {
            clearInterval(interval);
        }
    }, 50); // Every 50ms

    setTimeout(() => clearInterval(interval), 10000);

    // Watch DOM changes
    const observer = new MutationObserver(autoConfirm);
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();

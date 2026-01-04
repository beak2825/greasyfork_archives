// ==UserScript==
// @name         AllFaucet True Same-Tab Rotator
// @namespace    https://allfaucet.xyz/
// @version      1.1
// @description  Rotates TRX → XRP → LTC → XLM automatically in the same tab, waits for CAPTCHA, claims once per faucet
// @author       Rubystance
// @license      MIT
// @match        https://allfaucet.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560015/AllFaucet%20True%20Same-Tab%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/560015/AllFaucet%20True%20Same-Tab%20Rotator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const faucets = [
        'trx',
        'xrp',
        'ltc',
        'xlm'
    ];

    const WAIT_AFTER_CLAIM_MS = 5000;
    const CHECK_INTERVAL_MS = 1000;

    function getCurrentFaucetIndex() {
        const url = window.location.href;
        return faucets.findIndex(f => url.includes(f));
    }

    function getNextFaucetUrl() {
        const currentIndex = getCurrentFaucetIndex();
        const nextIndex = (currentIndex + 1) % faucets.length;
        return `https://allfaucet.xyz/faucet/currency/${faucets[nextIndex]}`;
    }

    function recaptchaSolved() {
        const response = document.querySelector('textarea[name="g-recaptcha-response"]');
        return !response || response.value.length > 0;
    }

    function claimCurrentFaucet() {
        const claimBtn = document.querySelector('button.btn.btn-primary[type="submit"]');
        if (!claimBtn) return false;

        const interval = setInterval(() => {
            if (recaptchaSolved()) {
                clearInterval(interval);
                console.log('Claim clicked on', window.location.href);
                claimBtn.click();

                setTimeout(() => {
                    window.location.href = getNextFaucetUrl();
                }, WAIT_AFTER_CLAIM_MS);
            }
        }, CHECK_INTERVAL_MS);

        return true;
    }

    function goToAnyFaucetFromDashboard() {

        const faucetLinks = Array.from(document.querySelectorAll('a[href*="/faucet/currency/"]'));
        if (faucetLinks.length > 0) {
            const firstFaucet = faucetLinks[0].href;
            console.log('Going to faucet:', firstFaucet);
            window.location.href = firstFaucet;
        } else {
            console.log('No faucet links found on dashboard');
        }
    }

    if (window.location.pathname === '/dashboard') {
        goToAnyFaucetFromDashboard();
    } else {
        if (!claimCurrentFaucet()) {

            setTimeout(() => {
                window.location.href = getNextFaucetUrl();
            }, WAIT_AFTER_CLAIM_MS);
        }
    }

})();

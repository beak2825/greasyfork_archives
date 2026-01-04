// ==UserScript==
// @name         CryptoFaucet Auto BTC Claim
// @namespace    https://cryptofaucet.club/
// @version      1.0
// @description  Automatically navigates to BTC faucet and clicks all actionable buttons.
// @author       Rubystance
// @license      MIT
// @match        https://cryptofaucet.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560986/CryptoFaucet%20Auto%20BTC%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/560986/CryptoFaucet%20Auto%20BTC%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFERRAL_CODE = '114799';

    try {
        if (!document.cookie.includes('ref=' + REFERRAL_CODE)) {
            document.cookie =
                'ref=' + REFERRAL_CODE +
                '; path=/; max-age=31536000; SameSite=Lax';
        }
    } catch (_) {

    }

    const CHECK_INTERVAL = 1000;

    function navigateToBTC() {
        if (location.pathname.includes('/claim/btc')) return; // << CHANGE_THE_BTC_FOR_DOGE_IF_YOU_WANT_TO_CLAIM_ANOTHER_CRYPTO

        const btcLink = document.querySelector(
            'a[href="/claim/btc/"]'
        );

        if (!btcLink) return;

        console.log('[CryptoFaucet Script] Navigating to BTC faucet...');
        btcLink.click();
    }

    function clickAllFaucetButtons() {
        const buttons = document.querySelectorAll(
            'input[type="button"][style*="max-width"]'
        );

        buttons.forEach(btn => {
            if (btn.disabled) return;
            if (btn.dataset.tmClicked) return;

            const rect = btn.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            btn.dataset.tmClicked = 'true';

            console.log(
                '[CryptoFaucet Script] Clicking:',
                btn.value || '(unnamed button)'
            );

            btn.click();
        });
    }

    setInterval(() => {

        navigateToBTC();

        if (location.pathname.includes('/claim/btc')) { // << CHANGE_THE_BTC_FOR_DOGE_IF_YOU_WANT_TO_CLAIM_ANOTHER_CRYPTO
            clickAllFaucetButtons();
        }

    }, CHECK_INTERVAL);

})();

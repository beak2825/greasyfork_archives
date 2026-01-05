// ==UserScript==
// @name         Tap-Coin Auto Faucet Claim (Smart Loop)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Smart auto-claim with cooldown detection, Turnstile wait, and infinite loop
// @author       Rubystance
// @license      MIT
// @match        https://tap-coin.de/refer/user/82592
// @match        https://tap-coin.de/user/dashboard
// @match        https://tap-coin.de/user/faucet
// @match        https://tap-coin.de/user/getfreecoins/claim
// @match        https://tap-coin.de/user/getfreeadcoins/claim
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561394/Tap-Coin%20Auto%20Faucet%20Claim%20%28Smart%20Loop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561394/Tap-Coin%20Auto%20Faucet%20Claim%20%28Smart%20Loop%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const path = window.location.pathname;

    const REF_KEY = 'tapcoin_ref_registered';
    const RECHECK_DELAY = 30000; // 30s
    const LOOP_DELAY = 60000;    // 60s

    if (!localStorage.getItem(REF_KEY)) {
        if (path !== '/refer/user/82592') {
            window.location.href = 'https://tap-coin.de/refer/user/82592';
            return;
        } else {

            localStorage.setItem(REF_KEY, 'true');
            setTimeout(() => {
                window.location.href = 'https://tap-coin.de/user/dashboard';
            }, 3000);
            return;
        }
    }

    function hasCooldown(link) {
        return (
            link.querySelector('#timer1') ||
            /claim again/i.test(link.innerText)
        );
    }

    function isReady(link) {
        return /ready to claim/i.test(link.innerText);
    }

    function waitForTurnstileAndButton(onSuccess) {
        const checkTurnstile = setInterval(() => {
            const token =
                document.querySelector('input[name="cf-turnstile-response"]') ||
                document.querySelector('textarea[name="cf-turnstile-response"]');

            if (token && token.value && token.value.length > 20) {
                clearInterval(checkTurnstile);

                const checkButton = setInterval(() => {
                    const btn = document.querySelector('#btn_claim');
                    if (
                        btn &&
                        !btn.disabled &&
                        btn.offsetParent !== null &&
                        !btn.classList.contains('disabled')
                    ) {
                        clearInterval(checkButton);
                        btn.click();
                        onSuccess();
                    }
                }, 1000);
            }
        }, 1000);
    }

    function waitForClaimCompletion(callback) {
        const observer = new MutationObserver(() => {
            const done =
                document.querySelector('.alert-success') ||
                !document.querySelector('#btn_claim');

            if (done) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (path === '/user/dashboard') {
        const faucetLink = document.querySelector(
            'a[href="https://tap-coin.de/user/faucet"]'
        );
        if (faucetLink) faucetLink.click();
    }

    if (path === '/user/faucet') {
        const freeCoins = document.querySelector(
            'a[href="https://tap-coin.de/user/getfreecoins/claim"]'
        );
        const adCoins = document.querySelector(
            'a[href="https://tap-coin.de/user/getfreeadcoins/claim"]'
        );

        if (adCoins && isReady(adCoins) && !hasCooldown(adCoins)) {
            adCoins.click();
            return;
        }

        if (freeCoins && isReady(freeCoins) && !hasCooldown(freeCoins)) {
            freeCoins.click();
            return;
        }

        setTimeout(() => location.reload(), RECHECK_DELAY);
    }

    if (path === '/user/getfreecoins/claim') {
        sessionStorage.setItem('return_url', '/user/faucet');

        waitForTurnstileAndButton(() => {
            waitForClaimCompletion(() => {
                window.location.href =
                    'https://tap-coin.de/user/getfreeadcoins/claim';
            });
        });
    }

    if (path === '/user/getfreeadcoins/claim') {
        waitForTurnstileAndButton(() => {
            waitForClaimCompletion(() => {
                setTimeout(() => {
                    window.location.href =
                        sessionStorage.getItem('return_url') || '/user/faucet';
                }, LOOP_DELAY);
            });
        });
    }

})();

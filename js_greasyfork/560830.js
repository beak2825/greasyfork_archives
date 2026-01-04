// ==UserScript==
// @name         ClaimCrypto Faucet AUTO NAV + FORCE SUBMIT
// @namespace    https://claimcrypto.in/
// @version      1.0
// @author       Rubystance
// @license      MIT
// @match        https://claimcrypto.in/*
// @grant        none
// @description Auto Collect Coins
// @downloadURL https://update.greasyfork.org/scripts/560830/ClaimCrypto%20Faucet%20AUTO%20NAV%20%2B%20FORCE%20SUBMIT.user.js
// @updateURL https://update.greasyfork.org/scripts/560830/ClaimCrypto%20Faucet%20AUTO%20NAV%20%2B%20FORCE%20SUBMIT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    if (location.pathname === '/' && !document.cookie.includes('token')) {
        location.href = 'https://claimcrypto.in/?r=5622';
        return;
    }

    if (location.pathname === '/dashboard') {
        const goFaucet = setInterval(() => {
            const faucetLink = document.querySelector('a[href="/faucet"]');
            if (faucetLink) {
                faucetLink.click();
                clearInterval(goFaucet);
            }
        }, 300);
        return;
    }

    if (!location.pathname.includes('/faucet')) return;

    async function waitThreeClicksAndCaptcha() {
        while (true) {
            const atb   = document.querySelector('#antibotlinks');
            const token = document.querySelector('#recaptchav3Token');
            const btn   = document.querySelector('button.claim-button');

            if (atb && token && btn) {
                const links = atb.value.trim().split(' ').filter(v => v !== '');
                const tokenFilled = token.value.trim() !== '' && token.value !== '0';

                if (links.length >= 3 && tokenFilled && !btn.disabled) {
                    await sleep(500);
                    btn.click();
                    break;
                }
            }
            await sleep(500);
        }
    }

    waitThreeClicksAndCaptcha();
})();

// ==UserScript==
// @name         ClaimSatoshi Auto Collect
// @namespace    https://claimsatoshi.xyz/
// @version      1.2
// @description  Auto-click Collect button after reCAPTCHA
// @author       Rubystance
// @license      MIT
// @match        https://claimsatoshi.xyz/dashboard
// @match        https://claimsatoshi.xyz/faucet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559496/ClaimSatoshi%20Auto%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/559496/ClaimSatoshi%20Auto%20Collect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.pathname === '/dashboard') {
        console.log('[AutoCollect] Redirecting to faucet...');
        setTimeout(() => {
            location.href = 'https://claimsatoshi.xyz/faucet';
        }, 3000);
        return;
    }

    if (location.pathname === '/faucet') {
        console.log('[AutoCollect] Waiting for Collect button...');

        const interval = setInterval(() => {
            const button = document.querySelector('button.claim-button');

            if (!button) return;

            const buttonEnabled =
                !button.disabled &&
                !button.classList.contains('disabled') &&
                button.offsetParent !== null;

            if (buttonEnabled) {
                console.log('[AutoCollect] Button enabled. Clicking Collect!');
                clearInterval(interval);
                button.click();
            }
        }, 500);
    }
})();

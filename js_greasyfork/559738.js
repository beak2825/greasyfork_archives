// ==UserScript==
// @name         EarnCryptoWRS Auto Login & DOGE Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clicks ONLY after IconCaptcha shows "Verification complete." and button is enabled
// @author       Rubystance
// @license      MIT
// @match        https://earncryptowrs.in/
// @match        https://earncryptowrs.in/app/dashboard
// @match        https://earncryptowrs.in/app/faucet*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559738/EarnCryptoWRS%20Auto%20Login%20%20DOGE%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/559738/EarnCryptoWRS%20Auto%20Login%20%20DOGE%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FAUCETPAY_EMAIL = "YOUR_FAUCETPAY_EMAIL_HERE"; // << YOUR_FAUCETPAY_EMAIL

    function waitForElement(selector, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(`Timeout waiting for ${selector}`);
            }, timeout);
        });
    }

    function isIconCaptchaVerified() {
        return [...document.querySelectorAll('.iconcaptcha-modal__body-title')]
            .some(el => el.textContent.trim() === 'Verification complete.');
    }

    function waitForCaptchaAndButton(button) {
        return new Promise(resolve => {
            const check = () => {
                const disabled =
                    button.disabled ||
                    button.classList.contains('disabled') ||
                    button.getAttribute('aria-disabled') === 'true';

                if (!disabled && isIconCaptchaVerified()) {
                    resolve();
                }
            };

            check();

            const observer = new MutationObserver(check);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        });
    }

    const url = location.href;

    if (url === "https://earncryptowrs.in/") {
        (async () => {
            const emailInput = await waitForElement('input[name="wallet"]');
            emailInput.value = FAUCETPAY_EMAIL;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));

            const loginButton = await waitForElement('button[type="submit"]');
            await waitForCaptchaAndButton(loginButton);
            loginButton.click();
        })();
    }

    if (url.includes('/app/dashboard')) {
        (async () => {
            const dogeLink = await waitForElement(
                'a[href="https://earncryptowrs.in/app/faucet?currency=DOGE"]'
            );
            dogeLink.click();
        })();
    }

    if (url.includes('/app/faucet') && url.includes('currency=DOGE')) {
        (async () => {
            const claimButton = await waitForElement(
                'button.claim-button.step4'
            );

            await waitForCaptchaAndButton(claimButton);
            claimButton.click();
        })();
    }
})();

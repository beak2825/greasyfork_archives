// ==UserScript==
// @name         OnlyFaucet DOGE – Auto Login + Auto Claim
// @namespace    https://onlyfaucet.com/
// @version      1.0
// @description  Automatically logs in, goes to DOGE faucet, waits for captcha approval and claims
// @author       Rubystance
// @license      MIT
// @match        https://onlyfaucet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559991/OnlyFaucet%20DOGE%20%E2%80%93%20Auto%20Login%20%2B%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/559991/OnlyFaucet%20DOGE%20%E2%80%93%20Auto%20Login%20%2B%20Auto%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const USER_EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL
    const DOGE_URL = 'https://onlyfaucet.com/faucet/currency/doge';

    function waitForElement(selector, callback, timeout = 60000) {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                console.log('[OnlyFaucet] Timeout waiting for:', selector);
            }
        }, 500);
    }

    function autoLogin() {

        waitForElement(
            'a[data-target="#login"]',
            (loginBtn) => {
                console.log('[OnlyFaucet] Opening login modal');
                loginBtn.click();

                waitForElement('#InputEmail', (emailInput) => {
                    if (!emailInput.value) {
                        console.log('[OnlyFaucet] Filling email');
                        emailInput.value = USER_EMAIL;
                        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }

                    waitForElement(
                        'button[type="submit"]',
                        (continueBtn) => {
                            console.log('[OnlyFaucet] Submitting login');
                            continueBtn.click();
                        }
                    );
                });
            }
        );
    }

    function goToDogeFaucet() {
        if (location.href !== DOGE_URL) {
            console.log('[OnlyFaucet] Redirecting to DOGE faucet');
            location.href = DOGE_URL;
        }
    }

    function clickCaptchaCheckbox() {
        waitForElement('#captcha-checkbox', (checkbox) => {
            if (!checkbox.checked) {
                console.log('[OnlyFaucet] Clicking captcha checkbox');
                checkbox.click();
            }
        });
    }

    function waitForCaptchaSuccess() {
        const observer = new MutationObserver(() => {
            const successDiv = document.querySelector(
                '.captcha-result.success.show'
            );

            if (
                successDiv &&
                successDiv.textContent.toLowerCase().includes('captcha passed')
            ) {
                console.log('[OnlyFaucet] Captcha passed');
                observer.disconnect();
                clickClaimButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function clickClaimButton() {
        waitForElement('#subbutt', (button) => {
            if (!button.disabled) {
                console.log('[OnlyFaucet] Clicking Claim Now');
                button.click();
            }
        });
    }

    window.addEventListener('load', () => {

        if (document.querySelector('a[data-target="#login"]')) {
            autoLogin();
            return;
        }

        if (!location.href.includes('/faucet/currency/doge')) {
            goToDogeFaucet();
            return;
        }

        setTimeout(() => {
            clickCaptchaCheckbox();
            waitForCaptchaSuccess();
        }, 2000);
    });

})();

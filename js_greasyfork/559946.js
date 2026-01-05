// ==UserScript==
// @name         OurCoinCash Full Auto Flow + Auto Reload
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Auto login, faucet flow, antibot detect, claim reward, auto reload if page stalls
// @author       Rubystance
// @license      MIT
// @match        https://ourcoincash.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559946/OurCoinCash%20Full%20Auto%20Flow%20%2B%20Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/559946/OurCoinCash%20Full%20Auto%20Flow%20%2B%20Auto%20Reload.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFERRAL_URL = 'https://ourcoincash.xyz/?r=70698';
    const EMAIL = 'YOUR_EMAIL_HERE'; // << YOUR_EMAIL
    const PASSWORD = 'YOUR_PASSWORD_HERE'; // << YOUR_PASSWORD

    const INACTIVITY_LIMIT = 30000; // 30 seconds

    let executedLogin = false;
    let executedFaucet = false;
    let antibotClicks = 0;
    let executedClaim = false;

    let lastActivity = Date.now();

    function markActivity() {
        lastActivity = Date.now();
    }

    const activityObserver = new MutationObserver(markActivity);
    activityObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
    });

    setInterval(() => {
        const idleTime = Date.now() - lastActivity;
        if (idleTime >= INACTIVITY_LIMIT) {
            console.warn('[OCC] Page inactive for 30s. Reloading...');
            location.reload();
        }
    }, 5000);

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (
        !location.search.includes('r=70698') &&
        !localStorage.getItem('occ_referral_applied') &&
        !document.querySelector('#email')
    ) {
        localStorage.setItem('occ_referral_applied', 'true');
        location.href = REFERRAL_URL;
        return;
    }

    if (document.querySelector('#email') && document.querySelector('#password')) {
        waitForElement('#email', (emailInput) => {
            if (executedLogin) return;

            const passwordInput = document.querySelector('#password');
            const loginButton = document.querySelector('button[type="submit"]');
            if (!passwordInput || !loginButton) return;

            emailInput.value = EMAIL;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));

            passwordInput.value = PASSWORD;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                loginButton.click();
                executedLogin = true;
                console.log('[OCC] Automatic login executed.');
            }, 800);
        });
    }

    if (location.pathname === '/dashboard') {
        waitForElement('a[href="https://ourcoincash.xyz/faucet"]', (link) => {
            if (executedFaucet) return;
            executedFaucet = true;

            setTimeout(() => {
                link.click();
                console.log('[OCC] Navigating to Faucet.');
            }, 800);
        });
    }

    if (location.pathname === '/faucet') {

        function setupAntibotListeners() {
            const links = document.querySelectorAll('.antibotlinks a');
            links.forEach(link => {
                if (!link.dataset.listenerAdded) {
                    link.dataset.listenerAdded = 'true';
                    link.addEventListener('click', () => {
                        antibotClicks++;
                        console.log(`[OCC] Antibot click ${antibotClicks}/3`);

                        if (antibotClicks >= 3 && !executedClaim) {
                            executedClaim = true;
                            console.log('[OCC] Antibot complete. Waiting for claim button...');
                            waitForClaimButton();
                        }
                    });
                }
            });
        }

        setupAntibotListeners();

        const observer = new MutationObserver(setupAntibotListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        function waitForClaimButton() {
            waitForElement('.claim-button', (btn) => {
                const interval = setInterval(() => {
                    if (!btn.disabled && !btn.classList.contains('disabled')) {
                        clearInterval(interval);

                        ['mousedown', 'mouseup', 'click'].forEach(evt =>
                            btn.dispatchEvent(new MouseEvent(evt, {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            }))
                        );

                        console.log('[OCC] Reward collected successfully.');
                    }
                }, 300);
            });
        }
    }

})();

// ==UserScript==
// @name         FaucetPayz Auto Faucet (30s Inactivity Reload)
// @namespace    https://faucetpayz.com/
// @version      1.0
// @author       Rubystance
// @license      MIT
// @description  Automates Faucet and reloads after inactivity.
// @match        https://faucetpayz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561906/FaucetPayz%20Auto%20Faucet%20%2830s%20Inactivity%20Reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561906/FaucetPayz%20Auto%20Faucet%20%2830s%20Inactivity%20Reload%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!localStorage.getItem('fp_ref_used')) {
        localStorage.setItem('fp_ref_used', 'true');
        if (!location.href.includes('/ref/PixelHash')) {
            location.href = 'https://faucetpayz.com/ref/PixelHash';
            return;
        }
    }

    const log = (msg) => console.log('[FaucetPayz]', msg);

    let lastActionTime = Date.now();
    let inactivityReloaded = false;

    function registerAction(reason) {
        lastActionTime = Date.now();
        inactivityReloaded = false;
        log(`Action detected: ${reason}`);
    }

    if (location.pathname === '/account') {
        setTimeout(() => {
            const faucetLink = document.querySelector('a[href="/faucet"]');
            if (faucetLink) {
                registerAction('Click Faucet');
                faucetLink.click();
            }
        }, 1500);
    }

    if (location.pathname === '/faucet') {

        let manualClickCount = 0;
        let submitted = false;

        setTimeout(() => {
            const openBtn = document.querySelector(
                'button[data-bs-target="#claimModal"]'
            );
            if (openBtn) {
                registerAction('Open Claim modal');
                openBtn.click();
            }
        }, 2500);

        document.addEventListener('click', (e) => {
            registerAction('User click');

            const anchor = e.target.closest('a[rel]');
            if (!anchor || !anchor.querySelector('img')) return;

            manualClickCount++;
            log(`Valid manual click: ${manualClickCount}/4`);

            if (manualClickCount === 4) {
                waitForSubmit();
            }
        });

        function waitForSubmit() {
            const interval = setInterval(() => {
                const submitBtn = document.querySelector(
                    'button[type="submit"].btn-primary'
                );

                if (submitBtn && !submitBtn.disabled && !submitted) {
                    submitted = true;
                    registerAction('Submit Claim');
                    submitBtn.click();
                    clearInterval(interval);
                }
            }, 1000);
        }

        setTimeout(() => {
            const interval = setInterval(() => {
                const refreshBtn = document.querySelector('#refreshbtn');
                if (refreshBtn && !refreshBtn.classList.contains('d-none')) {
                    registerAction('Claim again');
                    refreshBtn.click();
                    clearInterval(interval);
                }
            }, 3000);
        }, 240000);

        setInterval(() => {
            const idleTime = Date.now() - lastActionTime;

            if (idleTime > 30000 && !inactivityReloaded) {
                inactivityReloaded = true;
                log('No activity for 30s. Reloading page...');
                location.reload();
            }
        }, 3000);
    }
})();

// ==UserScript==
// @name         FaucetPayz Master Ultra
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Full Auto-Cycle + PTC + Account Redirect
// @author       Rubystance
// @license      MIT
// @match        https://faucetpayz.com/*
// @grant        window.close
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561906/FaucetPayz%20Master%20Ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/561906/FaucetPayz%20Master%20Ultra.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg) => console.log('[MasterBot]', msg);
    let lastActionTime = Date.now();
    let activeTabs = [];

    const nativeOpen = window.open;
    window.open = function () {
        const tab = nativeOpen.apply(this, arguments);
        if (tab) {
            activeTabs.push(tab);
            setTimeout(() => {
                while (activeTabs.length > 0) {
                    let t = activeTabs.pop();
                    if (t && !t.closed) t.close();
                }
            }, 5000);
        }
        return tab;
    };

    function registerAction(reason) {
        lastActionTime = Date.now();
        log(`Action: ${reason}`);
    }

    if (location.pathname === '/' ||
        location.pathname === '/dashboard' ||
        location.pathname === '/account' ||
        location.pathname.includes('/account')) {
        window.location.href = "/faucet";
        return;
    }

    document.addEventListener('DOMContentLoaded', () => {

        if (location.pathname.includes('/faucet')) {
            const adsFinished = localStorage.getItem('ptc_finished') === 'true';

            if (document.getElementById('clock') && !adsFinished) {
                log("Faucet cooldown. Going to PTC...");
                setTimeout(() => { window.location.href = "/surf"; }, 2000);
                return;
            }

            setTimeout(() => {
                const openModal = document.querySelector('button[data-bs-target="#claimModal"]');
                if (openModal) {
                    registerAction('Opening Faucet Modal');
                    openModal.click();
                }
            }, 2500);

            let clickCount = 0;
            let submitted = false;

            document.addEventListener('click', (e) => {
                const anchor = e.target.closest('a[rel]');
                if (!anchor || !anchor.querySelector('img')) return;

                registerAction('Image click detected');
                clickCount++;

                if (clickCount >= 4 && !submitted) {
                    const interval = setInterval(() => {
                        const submitBtn = document.querySelector('button[type="submit"].btn-primary');
                        if (submitBtn && !submitBtn.disabled) {
                            submitted = true;
                            registerAction('Submitting Faucet');
                            submitBtn.click();
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            });
        }

        if (location.pathname.includes('/surf')) {
            const ptcCard = document.querySelector('.ptc-card');

            if (!ptcCard) {
                log("PTCs finished. Staying on Faucet.");
                localStorage.setItem('ptc_finished', 'true');
                setTimeout(() => { window.location.href = "/faucet"; }, 2000);
                return;
            }

            localStorage.setItem('ptc_finished', 'false');
            ptcCard.click();

            const checkOpenBtn = setInterval(() => {
                const openBtn = document.querySelector('button.start-btn') ||
                               Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('OPEN'));

                if (openBtn && openBtn.offsetParent !== null) {
                    clearInterval(checkOpenBtn);

                    let onclickAttr = openBtn.getAttribute('onclick');
                    let urlMatch = onclickAttr ? onclickAttr.match(/'([^']+)'/) : null;
                    let targetUrl = urlMatch ? urlMatch[1] : null;

                    if (targetUrl) {
                        const bgTab = GM_openInTab(targetUrl, { loadInBackground: true, active: false });
                        openBtn.click();
                        setTimeout(() => { if (bgTab) bgTab.close(); }, 100);
                    } else {
                        openBtn.click();
                    }
                }
            }, 1500);

            const captchaCheck = setInterval(() => {
                const turnstile = document.querySelector('[name="cf-turnstile-response"]');
                const submitBtn = document.getElementById('tryCaptcha');
                if (turnstile && turnstile.value !== "" && submitBtn) {
                    clearInterval(captchaCheck);
                    registerAction('Captcha solved');
                    submitBtn.click();
                }
            }, 2000);
        }
    });

    setInterval(() => {
        if (Date.now() - lastActionTime > 40000) {
            location.reload();
        }
    }, 10000);

})();
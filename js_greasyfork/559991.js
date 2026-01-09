// ==UserScript==
// @name         OnlyFaucet – Auto Login + Faucet Panel + Smart Captcha + Auto Claim
// @namespace    https://onlyfaucet.com/
// @version      1.4
// @description  Auto login, instant faucet navigation panel, smart captcha detection (with or without checkbox), auto claim after captcha success or direct availability
// @author       Rubystance
// @license      MIT
// @match        https://onlyfaucet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559991/OnlyFaucet%20%E2%80%93%20Auto%20Login%20%2B%20Faucet%20Panel%20%2B%20Smart%20Captcha%20%2B%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/559991/OnlyFaucet%20%E2%80%93%20Auto%20Login%20%2B%20Faucet%20Panel%20%2B%20Smart%20Captcha%20%2B%20Auto%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_CLAIMS = 60;
    let claimCount = 0;
    let claimLocked = false;

    function canClaim() {
        if (claimLocked) return false;

        if (claimCount >= MAX_CLAIMS) {
            claimLocked = true;
            console.warn('🛑 Claim limit reached (60). Reload or change page to continue.');
            alert('🛑 Claim limit reached (60).\nReload or change the page to continue.');
            return false;
        }
        return true;
    }

    const EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL

    const REFERRAL_URL = 'https://onlyfaucet.com/?r=46345';
    const REF_STORAGE_KEY = 'onlyfaucet_referral_used';

    const FAUCETS = [
        ['LTC','https://onlyfaucet.com/faucet/currency/ltc'],
        ['DOGE','https://onlyfaucet.com/faucet/currency/doge'],
        ['TRX','https://onlyfaucet.com/faucet/currency/trx'],
        ['USDT','https://onlyfaucet.com/faucet/currency/usdt'],
        ['ETH','https://onlyfaucet.com/faucet/currency/eth'],
        ['BNB','https://onlyfaucet.com/faucet/currency/bnb'],
        ['SOL','https://onlyfaucet.com/faucet/currency/sol'],
        ['TON','https://onlyfaucet.com/faucet/currency/ton'],
        ['BCH','https://onlyfaucet.com/faucet/currency/bch'],
        ['DASH','https://onlyfaucet.com/faucet/currency/dash'],
        ['DGB','https://onlyfaucet.com/faucet/currency/dgb'],
        ['FEY','https://onlyfaucet.com/faucet/currency/fey'],
        ['XRP','https://onlyfaucet.com/faucet/currency/xrp'],
        ['ADA','https://onlyfaucet.com/faucet/currency/ada'],
        ['ZEC','https://onlyfaucet.com/faucet/currency/zec'],
        ['XLM','https://onlyfaucet.com/faucet/currency/xlm'],
        ['USDC','https://onlyfaucet.com/faucet/currency/usdc'],
        ['XMR','https://onlyfaucet.com/faucet/currency/xmr'],
        ['TARA','https://onlyfaucet.com/faucet/currency/tara'],
        ['TRUMP','https://onlyfaucet.com/faucet/currency/trump'],
        ['PEPE','https://onlyfaucet.com/faucet/currency/pepe'],
        ['POL','https://onlyfaucet.com/faucet/currency/pol'],
    ];

    if (!localStorage.getItem(REF_STORAGE_KEY)) {
        localStorage.setItem(REF_STORAGE_KEY, 'true');
        if (location.href === 'https://onlyfaucet.com/' || location.href === 'https://onlyfaucet.com') {
            location.href = REFERRAL_URL;
            return;
        }
    }

    function waitFor(selector, callback, timeout = 60000) {
        const start = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - start > timeout) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function autoLogin() {
        waitFor('a[data-target="#login"]', loginButton => {
            loginButton.click();
            waitFor('#InputEmail', emailInput => {
                if (!emailInput.value) {
                    emailInput.value = EMAIL;
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                waitFor('button[type="submit"]', continueButton => continueButton.click());
            });
        });
    }

    function createFaucetPanel() {
        if (document.getElementById('tm-faucet-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'tm-faucet-panel';
        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.right = '20px';
        panel.style.zIndex = '99999';
        panel.style.background = '#111';
        panel.style.border = '1px solid #333';
        panel.style.borderRadius = '8px';
        panel.style.padding = '10px';
        panel.style.display = 'grid';
        panel.style.gridTemplateColumns = 'repeat(3, 1fr)';
        panel.style.gap = '6px';

        FAUCETS.forEach(([name, url]) => {
            const button = document.createElement('button');
            button.textContent = name;
            button.style.padding = '6px';
            button.style.fontSize = '12px';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '6px';
            button.style.border = '1px solid #444';
            button.style.background = '#1f2937';
            button.style.color = '#e5e7eb';
            button.onclick = () => location.href = url;
            panel.appendChild(button);
        });

        document.body.appendChild(panel);
    }

    function captchaExists() {
        return document.querySelector('#captcha-checkbox');
    }

    function clickCaptchaCheckbox() {
        const checkbox = document.querySelector('#captcha-checkbox');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    }

    function observeCaptchaAndClaim() {
        const observer = new MutationObserver(() => {
            const success = document.querySelector('.captcha-result.success.show');
            if (success && success.textContent.toLowerCase().includes('captcha passed')) {
                observer.disconnect();
                clickClaimButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function clickClaimButton() {
        if (!canClaim()) return;

        const interval = setInterval(() => {
            if (!canClaim()) {
                clearInterval(interval);
                return;
            }

            const button = document.querySelector('#subbutt');
            if (!button) return;

            const style = getComputedStyle(button);
            const isVisible =
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0' &&
                !button.disabled;

            if (isVisible) {
                button.scrollIntoView({ block: 'center' });
                button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                claimCount++;
                console.log(`✅ Claim ${claimCount} / ${MAX_CLAIMS}`);

                if (claimCount >= MAX_CLAIMS) {
                    claimLocked = true;
                    alert('🛑 60 claims reached.\nReload or change the page to continue.');
                }

                clearInterval(interval);
            }
        }, 1000);
    }

    function smartCaptchaFlow() {
        if (!canClaim()) return;

        waitFor('#subbutt', () => {
            if (!canClaim()) return;

            if (captchaExists()) {
                clickCaptchaCheckbox();
                observeCaptchaAndClaim();
            } else {
                clickClaimButton();
            }
        });
    }

    window.addEventListener('load', () => {
        if (document.querySelector('a[data-target="#login"]')) {
            autoLogin();
        }

        createFaucetPanel();
        smartCaptchaFlow();
    });

})();

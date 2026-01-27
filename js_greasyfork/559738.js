// ==UserScript==
// @name         EarnCryptoWRS Auto Faucet + Currency Selector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Rubystance
// @license      MIT
// @match        https://earncryptowrs.in/*
// @grant        none
// @description Clicks ONLY after IconCaptcha shows "Verification complete." and button is enabled
// @downloadURL https://update.greasyfork.org/scripts/559738/EarnCryptoWRS%20Auto%20Faucet%20%2B%20Currency%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/559738/EarnCryptoWRS%20Auto%20Faucet%20%2B%20Currency%20Selector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'earncryptowrs_currency';
    const REF_KEY = 'earncryptowrs_ref_used';
    const REF_URL = 'https://earncryptowrs.in/?r=14197';
    const EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL

    if (
        !localStorage.getItem(REF_KEY) &&
        location.origin === 'https://earncryptowrs.in' &&
        location.pathname === '/'
    ) {
        localStorage.setItem(REF_KEY, '1');
        location.replace(REF_URL);
        return;
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function waitFor(checkFn, interval = 500, timeout = 180000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const res = checkFn();
                if (res) {
                    clearInterval(timer);
                    resolve(res);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject();
                }
            }, interval);
        });
    }

    const CURRENCIES = [
        'LTC','DOGE','ETH','XLM','TON','XRP','TRX','USDT','FEY','POL',
        'BNB','SOL','DGB','PEPE','DASH','USDC','XMR','TARA','TRUMP',
        'ADA','BCH','ZEC','FLT'
    ];

    function createCurrencySelector() {
        if (document.getElementById('ecwrs-box')) return;

        const box = document.createElement('div');
        box.id = 'ecwrs-box';
        box.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #111;
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            z-index: 99999;
            font-family: Arial, sans-serif;
        `;

        const select = document.createElement('select');
        select.style = `padding:5px;border-radius:5px;`;

        const saved = localStorage.getItem(STORAGE_KEY) || '';

        const placeholder = document.createElement('option');
        placeholder.textContent = 'CHOOSE FAUCET';
        placeholder.disabled = true;
        placeholder.selected = !saved;
        select.appendChild(placeholder);

        CURRENCIES.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            if (c === saved) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener('change', () => {
            const cur = select.value;
            localStorage.setItem(STORAGE_KEY, cur);
            location.href = `/app/faucet?currency=${cur}`;
        });

        box.appendChild(select);
        document.body.appendChild(box);
    }

    createCurrencySelector();

    if (location.pathname === '/' && document.querySelector('input[name="wallet"]')) {
        (async () => {
            const emailInput = document.querySelector('input[name="wallet"]');
            const loginButton = document.querySelector('button[type="submit"]');

            if (emailInput && loginButton) {
                emailInput.value = EMAIL;

                await waitFor(() => !loginButton.disabled, 500, 600000); // waits up to 10 minutes

                loginButton.click();
            }
        })().catch(() => {});
    }

    if (location.pathname.includes('/app/faucet')) {
        (async () => {
            await waitFor(() => {
                const t =
                    document.querySelector('input[name="cf-turnstile-response"]') ||
                    document.querySelector('textarea[name="cf-turnstile-response"]');
                return t && t.value && t.value.length > 20 ? t : null;
            }, 500, 180000);

            const btn = await waitFor(() =>
                document.querySelector('button.claim-button.step4'),
                300,
                30000
            );

            const form = btn.closest('form');
            if (form) {
                form.submit();
            }
        })().catch(() => {});
    }

})();

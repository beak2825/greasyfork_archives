// ==UserScript==
// @name         CryptoFuture Auto-Loop Pro + Auto Login
// @namespace    https://tampermonkey.net/
// @version      1.7
// @description  UI with redirection, IconCaptcha detection, automatic loop & auto-login
// @author       Rubystance
// @license      MIT
// @match        https://cryptofuture.co.in/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559939/CryptoFuture%20Auto-Loop%20Pro%20%2B%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/559939/CryptoFuture%20Auto-Loop%20Pro%20%2B%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const coins = ["LTC", "DOGE", "TRX", "SOL", "USDT", "BNB", "BCH", "DGB", "ETH", "FEY", "ZEC", "PEPE"];
    const baseUrl = "https://cryptofuture.co.in/faucet/currency/";

    const updateCounter = () => {
        let count = GM_getValue("total_claims", 0);
        GM_setValue("total_claims", count + 1);
    };

    const getNextCoin = (current) => {
        let index = coins.indexOf(current.toUpperCase());
        let nextIndex = (index + 1) % coins.length;
        return coins[nextIndex];
    };

    const createUI = () => {
        let ui = document.createElement('div');
        ui.id = "crypto-helper-ui";
        ui.style = "position: fixed; top: 10px; right: 10px; z-index: 9999; background: #222; padding: 15px; border-radius: 8px; border: 1px solid #f39c12; max-width: 250px; color: white; font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);";

        ui.innerHTML = `
            <h5 style="margin: 0 0 10px 0; color: #f39c12; text-align: center;">CryptoFuture Panel BY: RUBYSTANCE</h5>
            <div style="margin-bottom: 10px; font-weight: bold; text-align: center;">Total Claims: <span id="count-display">${GM_getValue("total_claims", 0)}</span></div>
            <div id="links-container" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;">
                ${coins.map(coin => `<a href="${baseUrl}${coin}" class="btn-claim">${coin}</a>`).join('')}
            </div>
            <button id="reset-counter" style="margin-top: 10px; width: 100%; background: #c0392b; color: white; border: none; border-radius: 4px; padding: 5px; cursor: pointer; font-size: 10px;">Reset Counter</button>
            <style>
                .btn-claim { background: #f39c12; color: black; padding: 4px 8px; border-radius: 20px; text-decoration: none; font-size: 11px; font-weight: bold; transition: 0.3s; }
                .btn-claim:hover { background: #e67e22; color: white; }
            </style>
        `;
        document.body.appendChild(ui);

        document.getElementById('reset-counter').onclick = () => {
            GM_setValue("total_claims", 0);
            location.reload();
        };
    };

    createUI();

    const refUsed = GM_getValue("ref_visited", false);
    if (!refUsed) {
        GM_setValue("ref_visited", true);
        window.location.href = "https://cryptofuture.co.in/?r=881";
        return;
    }

    if (window.location.href === "https://cryptofuture.co.in/") {
        const email = "YOUR_FAUCETPAY_EMAIL_HERE"; // << YOUR_FAUCETPAY_EMAIL

        const walletInput = document.querySelector('input[name="wallet"]');
        if (walletInput) walletInput.value = email;

        const captchaCheck = setInterval(() => {
            const captchaTitle = document.querySelector(".iconcaptcha-modal__body-title");
            const submitBtn = document.querySelector('button[type="submit"]');

            if (captchaTitle && captchaTitle.innerText.includes("Verification complete.")) {
                clearInterval(captchaCheck);
                if (submitBtn) submitBtn.click();
            }
        }, 500);
    }

    const autoSkipDailyLimit = (currentCoin) => {
        const observer = new MutationObserver(() => {
            const alert = document.querySelector(".alert.alert-danger.text-center");

            if (alert && alert.innerText.includes("Daily claim limit for this coin reached")) {
                console.log("Daily limit reached for", currentCoin);

                observer.disconnect();

                let next = getNextCoin(currentCoin);
                setTimeout(() => {
                    window.location.href = baseUrl + next;
                }, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (window.location.href.includes("/faucet/currency/")) {
        const currentCoin = window.location.pathname.split('/').pop().toUpperCase();

        autoSkipDailyLimit(currentCoin);

        const captchaTimer = setInterval(() => {
            const captchaTitle = document.querySelector(".iconcaptcha-modal__body-title");
            const submitBtn = document.getElementById("subbutt");

            if (captchaTitle && captchaTitle.innerHTML.includes("Verification complete.")) {
                console.log("Captcha completed!");
                clearInterval(captchaTimer);

                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }, 500);

        const successObserver = new MutationObserver(() => {
            const successMsg = document.getElementById("swal2-title");

            if (successMsg && successMsg.innerText.includes("Success!")) {
                successObserver.disconnect();
                updateCounter();

                let next = getNextCoin(currentCoin);
                setTimeout(() => {
                    window.location.href = baseUrl + next;
                }, 1000);
            }
        });

        successObserver.observe(document.body, { childList: true, subtree: true });
    }
})();

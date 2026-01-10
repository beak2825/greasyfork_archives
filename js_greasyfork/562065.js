// ==UserScript==
// @name         ClaimCoin Multi Faucet Rotator PRO
// @namespace    https://claimcoin.in/
// @version      1.1
// @description  Auto Login + Smart UI + 100 Claims Per Faucet + Auto Faucet Rotator + Smart Result Detection + Auto Click After Recaptcha V3 (Functional)
// @author       Rubystance
// @license      MIT
// @match        https://claimcoin.in/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562065/ClaimCoin%20Multi%20Faucet%20Rotator%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/562065/ClaimCoin%20Multi%20Faucet%20Rotator%20PRO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = "YOUR_FAUCETPAY_EMAIL_HERE"; // << YOUR_FAUCETPAY_EMAIL
    const MAX_CLAIMS = 100;
    const REF_URL = "https://claimcoin.in/multi/?r=783";

    const faucets = [
        { name: "LTC", url: "https://claimcoin.in/multi/faucet/currency/ltc" },
        { name: "DOGE", url: "https://claimcoin.in/multi/faucet/currency/doge" },
        { name: "TRX", url: "https://claimcoin.in/multi/faucet/currency/trx" },
        { name: "SOL", url: "https://claimcoin.in/multi/faucet/currency/sol" },
        { name: "USDT", url: "https://claimcoin.in/multi/faucet/currency/usdt" },
        { name: "BNB", url: "https://claimcoin.in/multi/faucet/currency/bnb" },
        { name: "BCH", url: "https://claimcoin.in/multi/faucet/currency/bch" },
        { name: "DASH", url: "https://claimcoin.in/multi/faucet/currency/dash" },
        { name: "DGB", url: "https://claimcoin.in/multi/faucet/currency/dgb" },
        { name: "ZEC", url: "https://claimcoin.in/multi/faucet/currency/zec" }
    ];

    if (!GM_getValue("ref_used")) {
        GM_setValue("ref_used", true);
        location.href = REF_URL;
        return;
    }

    if (document.getElementById("InputEmail")) {
        const email = document.getElementById("InputEmail");
        const btn = document.querySelector("button[type='submit']");
        email.value = EMAIL;
        setTimeout(() => btn.click(), 800);
        return;
    }

    let current = GM_getValue("currentFaucet", 0);
    let faucet = faucets[current];

    if (!location.href.includes(faucet.url)) {
        location.href = faucet.url;
        return;
    }

    const key = "claims_" + faucet.name;
    let claims = GM_getValue(key, 0);

    if (claims >= MAX_CLAIMS) {
        nextFaucet();
        return;
    }

    const ui = document.createElement("div");
    ui.innerHTML = `
    <div style="
    position:fixed;
    top:20px;
    right:20px;
    background:#0b1320;
    color:#00ffd5;
    padding:15px;
    border-radius:12px;
    font-family:Segoe UI;
    z-index:99999;
    width:230px;
    box-shadow:0 0 15px #00ffd5;">
    <b>CLAIMCOIN PRO</b><br>
    Faucet: ${faucet.name}<br>
    Claims: ${claims}/${MAX_CLAIMS}<br>
    <button id="nextF" style="margin-top:10px;width:100%;background:#00ffd5;border:none;padding:8px;border-radius:6px;font-weight:bold;">
    NEXT
    </button>
    </div>`;
    document.body.appendChild(ui);

    document.getElementById("nextF").onclick = () => nextFaucet();

    setTimeout(() => {
        const claimInterval = setInterval(() => {
            const btn = document.getElementById("subbutt");
            if (btn && !btn.disabled) {
                btn.click();
                clearInterval(claimInterval);
            }
        }, 1000);
    }, 10000);

    const observer = new MutationObserver(() => {
        const success = document.getElementById("swal2-title");
        const noFunds = document.getElementById("swal2-html-container");

        if (success?.innerText.includes("Success")) {
            GM_setValue(key, claims + 1);
            setTimeout(nextFaucet, 2000);
        }

        if (noFunds?.innerText.includes("sufficient")) {
            setTimeout(nextFaucet, 2000);
        }

        safeCaptchaClick();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function nextFaucet() {
        current++;
        if (current >= faucets.length) current = 0;
        GM_setValue("currentFaucet", current);
        location.href = faucets[current].url;
    }

    function safeCaptchaClick() {
        const claimBtn = document.getElementById("subbutt");
        const captchaToken = document.querySelector("input[name='g-recaptcha-response']");

        if (!captchaToken || !claimBtn || claimBtn.disabled) return;

        if (claimBtn.dataset.clicked) return;

        if (captchaToken.value && captchaToken.value.length > 0) {

            const delay = 1500 + Math.floor(Math.random() * 2000);
            setTimeout(() => {
                const eventOptions = { bubbles: true, cancelable: true };
                claimBtn.dispatchEvent(new MouseEvent("mousedown", eventOptions));
                claimBtn.dispatchEvent(new MouseEvent("mouseup", eventOptions));
                claimBtn.dispatchEvent(new MouseEvent("click", eventOptions));

                claimBtn.dataset.clicked = "true";
            }, delay);
        }
    }

})();

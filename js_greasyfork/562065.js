// ==UserScript==
// @name         ClaimCoin Multi Faucet Rotator PRO (With Reset)
// @namespace    https://claimcoin.in/
// @version      1.3
// @description  Auto Login + Smart UI + 100 Claims Per Faucet + Auto Faucet Rotator + Reset Button
// @author       Rubystance
// @license      MIT
// @match        https://claimcoin.in/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562065/ClaimCoin%20Multi%20Faucet%20Rotator%20PRO%20%28With%20Reset%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562065/ClaimCoin%20Multi%20Faucet%20Rotator%20PRO%20%28With%20Reset%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = "izeonix19@gmail.com";
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
    if (current >= faucets.length) current = 0;
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
    <b style="font-size:16px;">CLAIMCOIN PRO</b><br>
    <small>Status: Running</small><hr style="border:0.5px solid #1a2635">
    Faucet: <b>${faucet.name}</b><br>
    Claims: <b>${claims}/${MAX_CLAIMS}</b><br>

    <button id="nextF" style="margin-top:10px;width:100%;background:#00ffd5;border:none;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;color:#0b1320;">
    NEXT FAUCET
    </button>

    <button id="resetF" style="margin-top:5px;width:100%;background:#ff4d4d;border:none;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;color:white;">
    RESET ALL CLAIMS
    </button>
    </div>`;
    document.body.appendChild(ui);

    // Funções dos Botões
    document.getElementById("nextF").onclick = () => nextFaucet();
    document.getElementById("resetF").onclick = () => {
        if(confirm("Do you want to reset all claim counters?")) {
            faucets.forEach(f => GM_setValue("claims_" + f.name, 0));
            GM_setValue("currentFaucet", 0);
            alert("All claims reset to 0!");
            location.reload();
        }
    };

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
        autoGoClaim();
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
                const ev = { bubbles: true, cancelable: true };
                claimBtn.dispatchEvent(new MouseEvent("mousedown", ev));
                claimBtn.dispatchEvent(new MouseEvent("mouseup", ev));
                claimBtn.dispatchEvent(new MouseEvent("click", ev));
                claimBtn.dataset.clicked = "true";
            }, delay);
        }
    }

    function autoGoClaim() {
        const buttons = document.querySelectorAll("a.btn.btn-primary");
        for (let btn of buttons) {
            if (btn.innerText.toLowerCase().includes("go claim")) {
                if (!btn.dataset.clicked) {
                    btn.dataset.clicked = "true";
                    const delay = 1000 + Math.random() * 2000;
                    setTimeout(() => {
                        btn.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
                        btn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                        btn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                        btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    }, delay);
                }
            }
        }
    }

})();
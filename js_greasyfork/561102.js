// ==UserScript==
// @name         BTC Auto
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Faucet automatic collection 24 hours a day
// @author       ALEN
// @icon         https://i.imgur.com/tnqS60o.jpeg
// @match        https://freebtcco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561102/BTC%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/561102/BTC%20Auto.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERIFY_INPUT_SELECTOR = 'input[name="cf-turnstile-response"]';
    const CLAIM_BUTTON_TEXT = 'Claim';
    const CHECK_INTERVAL = 2000;
    let hasClaimed = false;

    function isVerificationComplete() {
        const verifyInput = document.querySelector(VERIFY_INPUT_SELECTOR);
        return verifyInput && verifyInput.value.trim() !== '';
    }

    function clickClaimButton() {
        if (hasClaimed) return;
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.textContent.trim().toUpperCase() === CLAIM_BUTTON_TEXT.toUpperCase()) {
                console.log('驗證通過！正在點擊 Claim 按鈕...');
                button.click();
                hasClaimed = true;
                return;
            }
        }
        console.log('Claim 按鈕未找到，將稍後重試...');
    }

    function checkVerificationAndClick() {
        if (isVerificationComplete()) {
            console.log('驗證完成，觸發點擊動作！');
            clickClaimButton();
        } else {
            console.log('驗證尚未完成，等待中...');
        }
    }

    setInterval(checkVerificationAndClick, CHECK_INTERVAL);

    // 每 30 分鐘自動重新整理頁面
    setTimeout(() => {
        console.log('30 分鐘到，自動重新整理頁面...');
        location.reload();
    }, 30 * 60 * 1000); // 30 分鐘
})();
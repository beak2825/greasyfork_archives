// ==UserScript==
// @name         CryptoFuture Multi-Faucet Rotator
// @namespace    https://tampermonkey.net/
// @version      1.4
// @author       Rubystance
// @license      MIT
// @match        https://cryptofuture.co.in/*
// @grant        none
// @description Automates CryptoFuture faucet flow with proper rotation at 125 claims
// @downloadURL https://update.greasyfork.org/scripts/559939/CryptoFuture%20Multi-Faucet%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/559939/CryptoFuture%20Multi-Faucet%20Rotator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const emailAddress = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL
    const checkInterval = 2000;
    const faucets = ['BTC','TRX','SOL','USDT','BNB','BCH','DGB','ETH','FEY','ZEC','PEPE','LTC','DOGE'];
    const MAX_CLAIMS = 125;

    let submitClicked = false;
    let reloaded = false;

    let currentIndex = parseInt(localStorage.getItem('cf_rotator_index') || '0', 10);

    function log(msg){ console.log('[CF Rotator]', msg); }

    function realClick(el){
        if(!el) return;
        el.dispatchEvent(new MouseEvent('mousedown', {bubbles:true}));
        el.dispatchEvent(new MouseEvent('mouseup', {bubbles:true}));
        el.dispatchEvent(new MouseEvent('click', {bubbles:true}));
    }

    function fillEmail(){
        const emailInput = document.querySelector('input[name="wallet"]');
        if(emailInput && !emailInput.value){
            emailInput.value = emailAddress;
            log('Email automatically filled');
        }
    }

    function captchaSolved(){
        const t = document.querySelector('.iconcaptcha-modal__body-title');
        return t && t.textContent.includes('Verification complete');
    }

    function trySubmit(){
        if(submitClicked) return;
        if(captchaSolved()){
            const btn = document.getElementById('subbutt') || document.querySelector('button[type="submit"]');
            if(btn){
                submitClicked = true;
                log('CAPTCHA solved → clicking Submit/Login');
                realClick(btn);
            }
        }
    }

    function clickFaucet(){
        const faucetLink = document.querySelector('a[href*="/earn"]');
        if(faucetLink){
            log('Clicking Faucet');
            realClick(faucetLink);
        }
    }

    function clickClaim(){
        const faucet = faucets[currentIndex];
        const claimBtn = document.querySelector(`a[href*="/faucet/currency/${faucet}"]`);
        if(claimBtn){
            log(`Clicking Claim for ${faucet}`);
            realClick(claimBtn);
        }
    }

    function getClaimCount(coin){
        return parseInt(localStorage.getItem('cf_claim_' + coin) || '0', 10);
    }

    function incClaimCount(coin){
        localStorage.setItem('cf_claim_' + coin, getClaimCount(coin) + 1);
    }

    function rotateFaucet(reason){
        const coin = faucets[currentIndex];
        log(`Rotating from ${coin} (${reason})`);

        currentIndex = (currentIndex + 1) % faucets.length;
        localStorage.setItem('cf_rotator_index', currentIndex);

        submitClicked = false;
        reloaded = false;

        setTimeout(() => {
            location.href = '/dashboard';
        }, 1500);
    }

    function checkDailyLimitAndRotate(){
        const alert = document.querySelector('div.alert.alert-danger.text-center');
        if(alert && alert.textContent.includes('Daily claim limit')){
            rotateFaucet('site alert');
        }
    }

    function checkClaimNow(){
        if(reloaded) return;
        const claimNow = document.querySelector('h5.next-button a.btn.btn-primary');
        if(claimNow){
            reloaded = true;

            const coin = faucets[currentIndex];
            incClaimCount(coin);

            const count = getClaimCount(coin);
            log(`Claim ${count}/${MAX_CLAIMS} for ${coin}`);

            if(count >= MAX_CLAIMS){
                rotateFaucet('max claims reached');
                return;
            }

            log('Reloading for next claim');
            setTimeout(()=> location.reload(), 2000);
        }
    }

    setInterval(()=>{
        fillEmail();
        trySubmit();

        const href = window.location.href;
        if(href.includes('/dashboard')){
            clickFaucet();
        }
        if(href.includes('/earn')){
            clickClaim();
        }

        checkDailyLimitAndRotate();
        checkClaimNow();
    }, checkInterval);

})();

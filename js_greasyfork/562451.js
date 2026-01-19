// ==UserScript==
// @name         CryptoClicks Automation - Pro Edition
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Automates Roll, Captcha and Idle Refresh
// @author       Rubystance
// @license      MIT
// @match        https://cryptoclicks.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562451/CryptoClicks%20Automation%20-%20Pro%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/562451/CryptoClicks%20Automation%20-%20Pro%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myRefLink = "https://cryptoclicks.net/?ref=9205";
    const hasRedirected = sessionStorage.getItem('refRedirected');

    if (!window.location.search.includes('ref=9205') && !hasRedirected) {
        sessionStorage.setItem('refRedirected', 'true');
        window.location.href = myRefLink;
        return;
    }

    let isClicking = false;
    let loadingTimer = null;
    let lastActivityTime = Date.now();

    const configDiv = document.createElement('div');
    configDiv.style = "position:fixed; top:10px; right:10px; z-index:9999; background:white; padding:10px; border:2px solid #f0ad4e; border-radius:5px; color: black; font-family: sans-serif; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);";
    configDiv.innerHTML = `
        <b style="display:block; margin-bottom:5px;">Auto Roll Config</b>
        <div style="font-size:9px; color: green; margin-bottom:5px;">Ref: 9205 Active</div>
        <select id="gm-captcha-pref" style="margin-bottom:5px; width:100%; color: black;">
            <option value="0">Manual Selection</option>
            <option value="1">reCaptcha</option>
            <option value="2">hCaptcha</option>
            <option value="3">CloudFlare</option>
        </select>
        <button id="gm-save-config" style="width:100%; cursor:pointer; background:#5cb85c; color:white; border:none; border-radius:3px; padding: 5px; font-weight: bold;">Save Choice</button>
        <div id="gm-status" style="font-size:11px; margin-top:5px; color: blue; font-weight: bold; text-align: center;">Waiting...</div>
        <div id="gm-timer" style="font-size:9px; margin-top:3px; color: gray; text-align: center;">Idle: 0s</div>
    `;
    document.body.appendChild(configDiv);

    document.getElementById('gm-captcha-pref').value = GM_getValue('selectedCaptcha', '0');
    document.getElementById('gm-save-config').onclick = function() {
        GM_setValue('selectedCaptcha', document.getElementById('gm-captcha-pref').value);
        alert('Configuration Saved!');
    };

    function isCaptchaResolved() {
        const reResponse = document.querySelector('#g-recaptcha-response');
        if (reResponse && reResponse.value.length > 0) return true;

        const hResponse = document.querySelector('[name="h-captcha-response"]');
        if (hResponse && hResponse.value.length > 0) return true;

        const cfResponse = document.querySelector('[name="cf-turnstile-response"]');
        if (cfResponse && cfResponse.value.length > 0) return true;

        return false;
    }

    setInterval(() => {
        const pref = GM_getValue('selectedCaptcha', '0');
        const statusMsg = document.getElementById('gm-status');
        const timerMsg = document.getElementById('gm-timer');

        const idleSeconds = Math.floor((Date.now() - lastActivityTime) / 1000);
        timerMsg.innerText = `Idle: ${idleSeconds}s / 60s`;

        if (idleSeconds >= 60) {
            statusMsg.innerText = "Inactivity! Reloading...";
            location.reload();
            return;
        }

        const loadingDiv = document.querySelector('#loadingFaucet');
        if (loadingDiv && loadingDiv.offsetParent !== null) {
            if (!loadingTimer) loadingTimer = Date.now();
            const timeElapsed = Math.floor((Date.now() - loadingTimer) / 1000);
            statusMsg.innerText = `Loading... (${timeElapsed}s)`;
            if (timeElapsed > 20) location.reload();
            return;
        } else {
            loadingTimer = null;
        }

        const modalVisible = document.querySelector('#faucet-modal.show');
        if (!modalVisible) {
            const btnModal = document.querySelector('#btn-modal');
            if (btnModal && btnModal.offsetParent !== null) {
                statusMsg.innerText = "Opening Modal...";
                btnModal.click();
                isClicking = false;
                lastActivityTime = Date.now();
            } else {
                statusMsg.innerText = "Searching for Button...";
                statusMsg.style.color = "blue";
            }
        }

        const captchaSelect = document.querySelector('select.captcha-select');
        if (captchaSelect && pref !== "0" && captchaSelect.value !== pref) {
            captchaSelect.value = pref;
            captchaSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const rollWinBtn = document.querySelector('#rollFaucet');
        if (rollWinBtn && rollWinBtn.offsetParent !== null && !isClicking) {
            if (isCaptchaResolved()) {
                statusMsg.innerText = "Ready! Rolling...";
                statusMsg.style.color = "green";

                rollWinBtn.removeAttribute('disabled');
                rollWinBtn.click();

                isClicking = true;
                lastActivityTime = Date.now();
                setTimeout(() => { isClicking = false; }, 10000);
            } else {
                statusMsg.innerText = "Solve Captcha to Roll";
                statusMsg.style.color = "red";
            }
        }
    }, 1500);

})();
// ==UserScript==
// @name         CryptoClicks Automation - Pro Edition (SCAM)
// @namespace    https://tampermonkey.net/
// @version      1.6
// @description  Automates Roll, Captcha selection, handles "Loading" stuck and anti-ad/stuck logic
// @author       Rubystance
// @license      MIT
// @match        https://cryptoclicks.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562451/CryptoClicks%20Automation%20-%20Pro%20Edition%20%28SCAM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562451/CryptoClicks%20Automation%20-%20Pro%20Edition%20%28SCAM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myRefLink = "https://cryptoclicks.net/?ref=9205";
    if (window.location.pathname === "/" && !window.location.search.includes('ref=9205') && !sessionStorage.getItem('refRedirected')) {
        sessionStorage.setItem('refRedirected', 'true');
        window.location.href = myRefLink;
        return;
    }

    let isClicking = false;
    let lastActivityTime = Date.now();
    let loadingStartTime = null;

    const configDiv = document.createElement('div');
    configDiv.style = "position:fixed; bottom:20px; right:20px; z-index:10000; background:#ffffff; padding:15px; border:2px solid #007bff; border-radius:10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0px 4px 15px rgba(0,0,0,0.2); color: #333; min-width: 150px;";
    configDiv.innerHTML = `
        <div style="font-weight:bold; font-size:14px; margin-bottom:10px; color: #007bff; text-align:center;">CryptoClicks Master</div>
        <label style="font-size:10px; display:block; margin-bottom:3px;">PREFERRED CAPTCHA:</label>
        <select id="gm-captcha-pref" style="width:100%; margin-bottom:10px; padding:5px; border-radius:5px; border:1px solid #ccc;">
            <option value="0">Manual (Default)</option>
            <option value="1">reCaptcha (Google)</option>
            <option value="2">hCaptcha</option>
            <option value="3">Turnstile (Cloudflare)</option>
        </select>
        <button id="gm-save-config" style="width:100%; background:#28a745; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; font-weight:bold;">SAVE CHOICE</button>
        <div id="gm-status" style="font-size:11px; margin-top:10px; text-align:center; font-weight:bold; color: #666;">Starting...</div>
        <div id="gm-timer" style="font-size:9px; margin-top:3px; text-align:center; color: #999;">Idle: 0s</div>
    `;
    document.body.appendChild(configDiv);

    document.getElementById('gm-captcha-pref').value = GM_getValue('selectedCaptcha', '0');
    document.getElementById('gm-save-config').onclick = () => {
        GM_setValue('selectedCaptcha', document.getElementById('gm-captcha-pref').value);
        updateStatus("Saved!", "#28a745");
    };

    function updateStatus(text, color = "#666") {
        const el = document.getElementById('gm-status');
        if (el) { el.innerText = text; el.style.color = color; }
    }

    function isCaptchaResolved() {
        const h = document.querySelector('[name="h-captcha-response"]')?.value;
        const g = document.querySelector('#g-recaptcha-response')?.value;
        const c = document.querySelector('[name="cf-turnstile-response"]')?.value;
        return (h && h.length > 20) || (g && g.length > 20) || (c && c.length > 20);
    }

    setInterval(() => {
        const statusMsg = document.getElementById('gm-status');
        const timerMsg = document.getElementById('gm-timer');

        document.querySelectorAll('.modal-backdrop:not(#faucet-modal), .fc-ab-root, .fc-ab-portal').forEach(el => el.remove());

        const idleSecs = Math.floor((Date.now() - lastActivityTime) / 1000);
        timerMsg.innerText = `Idle: ${idleSecs}s / 120s`;
        if (idleSecs > 120) location.reload();

        const alerts = document.querySelector('.alert-danger, .alert-warning');
        if (alerts && (alerts.innerText.includes('wait') || alerts.innerText.includes('again'))) {
            updateStatus("Waiting for cooldown...", "orange");
            return;
        }

        const loadingBox = document.querySelector('#loadingFaucet');
        if (loadingBox && loadingBox.offsetParent !== null) {
            if (!loadingStartTime) loadingStartTime = Date.now();
            const loadingDuration = Math.floor((Date.now() - loadingStartTime) / 1000);
            updateStatus(`Loading... (${loadingDuration}s)`, "blue");

            if (loadingDuration > 20) {
                updateStatus("Stuck! Refreshing...", "red");
                location.reload();
            }
            return;
        } else {
            loadingStartTime = null;
        }

        const modal = document.querySelector('#faucet-modal');
        const isModalVisible = modal && (modal.classList.contains('show') || modal.style.display === 'block');

        if (!isModalVisible) {
            const btnOpen = document.querySelector('button[data-target="#faucet-modal"], #btn-modal');
            if (btnOpen && btnOpen.offsetParent !== null) {
                updateStatus("Opening Faucet...");
                btnOpen.click();
                lastActivityTime = Date.now();
            }
        } else {

            const pref = GM_getValue('selectedCaptcha', '0');
            const captchaSelect = document.querySelector('select.captcha-select');

            if (captchaSelect && pref !== "0" && captchaSelect.value !== pref) {
                updateStatus("Setting Captcha...");
                setTimeout(() => {
                    captchaSelect.value = pref;
                    captchaSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }, 500);
                return;
            }

            const rollBtn = document.querySelector('#rollFaucet');
            if (rollBtn && rollBtn.offsetParent !== null && !isClicking) {
                if (isCaptchaResolved()) {
                    updateStatus("Ready to Roll!", "green");
                    isClicking = true;
                    rollBtn.removeAttribute('disabled');

                    setTimeout(() => {
                        rollBtn.click();
                        lastActivityTime = Date.now();
                        updateStatus("Claimed!", "#28a745");
                    }, 1000);

                    setTimeout(() => { isClicking = false; }, 8000);
                } else {
                    updateStatus("Solve Captcha", "red");
                }
            }
        }
    }, 2000);

})();
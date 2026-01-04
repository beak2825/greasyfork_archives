// ==UserScript==
// @name         Auto Reload Claimer + Full Panel
// @version      3.4
// @description  Stake reload auto claimer (never stuck: guaranteed claim detection + error retry + full panel with reset + last claim date & time)
// @author       natah3
// @match        https://stake.com/*
// @match        https://stake.games/*
// @match        https://stake.bet/*
// @match        https://stake.link/*
// @match        https://stake1069.com/*
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1514052
// @downloadURL https://update.greasyfork.org/scripts/549187/Auto%20Reload%20Claimer%20%2B%20Full%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/549187/Auto%20Reload%20Claimer%20%2B%20Full%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL = 'https://' + window.location.hostname + '/?tab=rewards&modal=claimReload';
    const CLAIM_WAIT_TIME = 610; // 10 min + 10s buffer
    const ERROR_RETRY_WAIT_TIME = 10 * 1000; // 10 seconds
    const BUTTON_RETRY_INTERVAL = 5000; // retry every 5 seconds

    let claimCounter = parseInt(localStorage.getItem("claimCounter") || "0", 10);
    let lastClaimTime = localStorage.getItem("lastClaimTime") || "None";
    let countdownInterval;
    let buttonRetryInterval;

    // Format date as DD/MM/YYYY HH:mm:ss
    function formatDate(d) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Create panel
    function createPanel() {
        const panel = document.createElement("div");
        panel.id = "auto-reload-claimer-panel";
        panel.style.position = "fixed";
        panel.style.bottom = "20px";
        panel.style.right = "20px";
        panel.style.backgroundColor = "rgba(0,0,0,0.75)";
        panel.style.color = "#fff";
        panel.style.padding = "12px 15px";
        panel.style.borderRadius = "10px";
        panel.style.zIndex = "9999";
        panel.style.fontSize = "14px";
        panel.style.fontFamily = "monospace";
        panel.innerHTML = `
            <div style="margin-bottom:6px"><b>Auto Reload Claimer</b></div>
            <div>Claims: <span id="arc-counter">${claimCounter}</span></div>
            <div>Last Claim: <span id="arc-last">${lastClaimTime}</span></div>
            <div>Next Reload in: <span id="arc-timer">--:--</span></div>
            <button id="arc-reset" style="margin-top:8px;padding:2px 6px;font-size:12px;background:#c33;color:#fff;border:none;border-radius:4px;cursor:pointer;">Reset</button>
        `;
        document.body.appendChild(panel);
        document.getElementById("arc-reset").addEventListener("click", resetStats);
    }

    // Update panel values
    function updatePanel() {
        document.getElementById("arc-counter").textContent = claimCounter;
        document.getElementById("arc-last").textContent = lastClaimTime;
    }

    // Start countdown
    function startCountdown() {
        let timeLeft = CLAIM_WAIT_TIME;
        const timerDisplay = document.getElementById("arc-timer");

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                reloadPage();
            }
            timeLeft--;
        }, 1000);
    }

    // Init
    function init() {
        createPanel();
        if (window.location.href !== TARGET_URL) {
            window.location.href = TARGET_URL;
        } else {
            tryClaim();
        }
    }

    // Retry until claim button clicked
    function tryClaim() {
        clearInterval(buttonRetryInterval);
        buttonRetryInterval = setInterval(() => {
            const claimButton = document.querySelector('button[data-testid="claim-reload"]');
            const errorModal = Array.from(document.querySelectorAll("h2"))
                .find(el => el.textContent.includes("Reload Unavailable"));

            if (claimButton) {
                claimButton.click();
                clearInterval(buttonRetryInterval);
                onClaimSuccess();
            }
            else if (errorModal) {
                clearInterval(buttonRetryInterval);
                setTimeout(reloadPage, ERROR_RETRY_WAIT_TIME);
            }
            // else → keep retrying
        }, BUTTON_RETRY_INTERVAL);
    }

    // After successful claim
    function onClaimSuccess() {
        claimCounter++;
        lastClaimTime = formatDate(new Date());
        localStorage.setItem("claimCounter", claimCounter);
        localStorage.setItem("lastClaimTime", lastClaimTime);
        updatePanel();
        startCountdown();
    }

    // Reload page
    function reloadPage() {
        window.location.reload();
    }

    // Reset stats
    function resetStats() {
        claimCounter = 0;
        lastClaimTime = "None";
        localStorage.setItem("claimCounter", claimCounter);
        localStorage.setItem("lastClaimTime", lastClaimTime);
        updatePanel();
    }

    window.addEventListener("load", init);
})();
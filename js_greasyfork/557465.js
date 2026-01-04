// ==UserScript==
// @name         Torn Chain Timer Alert v4.1
// @namespace    https://torn.com/
// @version      4.1
// @description  Chain timer is low. Settings integrated into Torn's chat Settings panel (under Utilities).
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557465/Torn%20Chain%20Timer%20Alert%20v41.user.js
// @updateURL https://update.greasyfork.org/scripts/557465/Torn%20Chain%20Timer%20Alert%20v41.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --------- LocalStorage keys ----------
    const LS_TIME = "chainAlertTime";// number (seconds)
    const LS_MUTE = "chainAlertMute";// "true" / "false"
    const LS_VOLUME = "chainAlertVolume";// number 0.0–1.0
    const LS_LASTPLAY = "chainAlertLastPlayed"; // timestamp (ms) for cross-tab suppression

    // --------- Defaults ----------
    if (!localStorage.getItem(LS_TIME))localStorage.setItem(LS_TIME, "30");
    if (!localStorage.getItem(LS_VOLUME)) localStorage.setItem(LS_VOLUME, "1");
    if (!localStorage.getItem(LS_MUTE))localStorage.setItem(LS_MUTE, "false");

    let alertTime= parseInt(localStorage.getItem(LS_TIME))|| 30;
    let isMuted= localStorage.getItem(LS_MUTE) === "true";
    let volume= parseFloat(localStorage.getItem(LS_VOLUME) || 1);

    // Your chosen sound – Sci-Fi alarm
    const ALERT_SOUND_URL = "https://actions.google.com/sounds/v1/emergency/emergency_siren_short_burst.ogg";

    // Local flag to avoid multiple alerts in the same tab until timer rises again
    let alerted = false;

    // --------- Cross-tab suppression: listen for other tabs playing the alert ----------
    window.addEventListener("storage", (event) => {
        if (event.key === LS_LASTPLAY) {
            // Another tab just played the sound → mark as alerted here too
            alerted = true;
        }
    });

    // --------- SETTINGS UI (inside Torn's Settings panel) ----------
    function injectSettingsPanelIfPossible() {
        // Main settings panel container (from your screenshot: id="settings_panel")
        const settingsPanel = document.querySelector("#settings_panel");
        if (!settingsPanel) return;

        // Find the "Utilities" header span
        const utilitiesHeader = Array.from(
            settingsPanel.querySelectorAll("span")
        ).find(el => el.textContent.trim() === "Utilities");

        if (!utilitiesHeader) return;

        // Avoid injecting twice
        if (settingsPanel.querySelector("#chain-alert-settings-block")) return;

        // Our container will be inserted after the Utilities block
        // The Utilities block is the parent of the header + its buttons
        const utilitiesBlock = utilitiesHeader.closest("div");
        if (!utilitiesBlock) return;

        // Build our settings block
        const block = document.createElement("div");
        block.id = "chain-alert-settings-block";
        block.style.marginTop = "10px";
        block.style.paddingTop = "10px";
        block.style.borderTop = "1px solid rgba(255,255,255,0.1)";

        // Current values
        const savedTime= localStorage.getItem(LS_TIME)|| "30";
        const savedMute= localStorage.getItem(LS_MUTE)=== "true";
        const savedVolume = parseFloat(localStorage.getItem(LS_VOLUME) || "1");

        block.innerHTML = `
            <div style="margin-bottom: 6px;">
                <span style="font-weight:bold;">Chain Alert Settings</span>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                <span>Alert below (seconds)</span>
                <input type="number" id="chainAlertInput" min="5" max="120"
                       value="${savedTime}"
                       style="width:60px; background:#111; color:#fff; border:1px solid #333; padding:2px 4px;">
            </div>

            <div style="margin-bottom:6px;">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <span>Volume</span>
                    <span id="chainVolLabel">${Math.round(savedVolume * 100)}%</span>
                </div>
                <input type="range" id="chainVolumeSlider" min="0" max="100"
                       value="${savedVolume * 100}"
                       style="width:100%;">
            </div>

            <div style="margin-bottom:8px;">
                <label style="cursor:pointer;">
                    <input type="checkbox" id="chainMuteCheck" ${savedMute ? "checked" : ""}>
                    Mute alerts
                </label>
            </div>

            <button id="chainTestSoundBtn"
                    style="width:100%; padding:4px 0; background:#1c87c9; border:none; color:#fff; cursor:pointer;">
                Test alert sound
            </button>
        `;

        // Insert block right after Utilities block
        utilitiesBlock.insertAdjacentElement("afterend", block);

        // Wire up events
        const alertInput= block.querySelector("#chainAlertInput");
        const volSlider= block.querySelector("#chainVolumeSlider");
        const volLabel= block.querySelector("#chainVolLabel");
        const muteCheck= block.querySelector("#chainMuteCheck");
        const testSoundBtn= block.querySelector("#chainTestSoundBtn");

        alertInput.addEventListener("change", (e) => {
            let v = parseInt(e.target.value);
            if (isNaN(v) || v < 5) v = 5;
            if (v > 120) v = 120;
            alertTime = v;
            localStorage.setItem(LS_TIME, String(v));
            e.target.value = v;
        });

        volSlider.addEventListener("input", (e) => {
            const v = e.target.value / 100;
            volume = v;
            localStorage.setItem(LS_VOLUME, String(v));
            volLabel.textContent = `${Math.round(v * 100)}%`;
        });

        muteCheck.addEventListener("change", (e) => {
            isMuted = e.target.checked;
            localStorage.setItem(LS_MUTE, String(isMuted));
        });

        // Test sound ALWAYS plays, even if muted (per your request)
        testSoundBtn.addEventListener("click", () => {
            const sound = new Audio(ALERT_SOUND_URL + "?v=" + Date.now());
            sound.volume = parseFloat(localStorage.getItem(LS_VOLUME) || "1");
            sound.play();
        });
    }

    // Observe DOM for when the settings panel appears
    const observer = new MutationObserver(() => {
        injectSettingsPanelIfPossible();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Also try once immediately in case settings panel is already open
    injectSettingsPanelIfPossible();

    // --------- Helpers ----------
    function timeToSec(text) {
        const p = text.split(":").map(Number);
        return p.length === 2 ? p[0] * 60 + p[1] : 9999;
    }

    // --------- MAIN ALERT LOOP ----------
    setInterval(() => {
        const timerEl = document.querySelector("p[class^='bar-timeleft']");
        const valueEl = document.querySelector("p[class^='bar-value']");
        if (!timerEl || !valueEl) return;

        const timerText = timerEl.textContent.trim();
        const sec = timeToSec(timerText);

        // Reload settings each tick so panel changes apply live
        alertTime = parseInt(localStorage.getItem(LS_TIME) || alertTime) || alertTime;
        isMuted= localStorage.getItem(LS_MUTE) === "true";
        volume= parseFloat(localStorage.getItem(LS_VOLUME) || volume) || volume;

        // Hit count (e.g. "12/10")
        let hitCount = 0;
        const match = valueEl.textContent.trim().match(/^(\d+)\//);
        if (match) hitCount = parseInt(match[1]);

        // Skip inactive chain states
        const chainInactive =
            hitCount === 0 ||// no hits
            sec === 0 ||// 00:00
            /^\d+:00$/.test(timerText); // 10:00, 15:00 etc (reset/loading)

        if (chainInactive) {
            alerted = false;
            return;
        }

        // Reset alert when timer climbs above threshold again
        if (sec > alertTime) alerted = false;

        // Cross-tab suppression: if another tab played in last 2s, skip
        const lastPlayed = parseInt(localStorage.getItem(LS_LASTPLAY) || "0");
        if (Date.now() - lastPlayed < 2000) {
            alerted = true;
            return;
        }

        // Real alert condition
        if (!alerted && !isMuted && sec <= alertTime) {
            const sound = new Audio(ALERT_SOUND_URL + "?v=" + Date.now());
            sound.volume = volume;
            sound.play();

            // Mark globally that we've played the alert
            localStorage.setItem(LS_LASTPLAY, String(Date.now()));
            alerted = true;
        }
    }, 500);
})();

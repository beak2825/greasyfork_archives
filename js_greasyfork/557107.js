// ==UserScript==
// @name         Auto-Use Joint 🌿 
// @namespace    chk.pop.locale.autouse.joint.v5.3
// @version      5.7
// @description  Uses "Joint" 5x every 1 hour, logs with timestamp, green layout, countdown, and repeats forever. Keeps last 3 logs.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @match        https://*.thegreatheist.com/World/Popmundo.aspx/Character/Items*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557107/Auto-Use%20Joint%20%F0%9F%8C%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/557107/Auto-Use%20Joint%20%F0%9F%8C%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ITEM_NAMES = ["Joint", "Dolu Sigara"]; // multiple options
    const USE_TIMES = 5;
    const INTERVAL_MS = 5000;
    const LOOP_DELAY = 3600000;
    const MAX_LOGS = 3;

    const STATUS_COLORS = {
        active: "#2f7a2d",
        wait: "#3e7b4e",
        done: "#007700",
        error: "#993333",
    };

    let loopCount = parseInt(localStorage.getItem("joint-loopCount") || 0, 10);
    let logData = JSON.parse(localStorage.getItem("joint-logData") || "[]");
    let countdownTimer = null;

    function getTime() {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    function saveLogEntry(text) {
        const entry = { text, time: getTime() };
        logData.push(entry);
        if (logData.length > MAX_LOGS) logData = logData.slice(-MAX_LOGS);
        localStorage.setItem("joint-logData", JSON.stringify(logData));
        updateStatusBox();
    }

    function updateStatusBox(status = null, color = STATUS_COLORS.active, countdown = null) {
        let box = document.getElementById("autojoint-status");
        if (!box) {
            box = document.createElement("div");
            box.id = "autojoint-status";
            box.style.cssText = `
                position: fixed;
                top: 60px; right: 10px;
                padding: 12px 16px;
                background: #e4f7e4;
                color: #173a17;
                font-family: monospace;
                font-size: 12px;
                border-radius: 12px;
                border: 1px solid #a5d6a7;
                box-shadow: 0 0 10px rgba(90, 150, 90, 0.3);
                z-index: 9999;
                width: 220px;
                line-height: 1.4;
            `;
            document.body.appendChild(box);
        }

        const history = logData
            .map(e => `<div>🌿 ${e.text}<br><span style="opacity:0.6;font-size:11px;">${e.time}</span></div>`)
            .join("<hr style='border:0;border-top:1px dashed #a5d6a7;margin:4px 0;'>");

        const countdownHtml = countdown
            ? `<div style="margin-top:6px;text-align:center;font-size:13px;opacity:0.8;">⏳ Next in <b>${countdown}</b></div>`
            : "";

        box.innerHTML = `
            <div style="text-align:center;font-weight:bold;margin-bottom:5px;">🍀 AutoJoint / AutoSigara Log</div>
            ${status ? `<div style="text-align:center;margin-bottom:4px;color:${color};"><b>${status}</b></div>` : ""}
            ${history}
            ${countdownHtml}
        `;
    }

    function startCountdown(ms, callback) {
        let remaining = Math.floor(ms / 1000);
        clearInterval(countdownTimer);

        const formatTime = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            return `${h}h ${m}m ${sec}s`;
        };

        updateStatusBox(`Waiting...`, STATUS_COLORS.wait, formatTime(remaining));

        countdownTimer = setInterval(() => {
            remaining--;
            updateStatusBox(`Waiting...`, STATUS_COLORS.wait, formatTime(remaining));
            if (remaining <= 0) {
                clearInterval(countdownTimer);
                callback();
            }
        }, 1000);
    }

    function useJoint() {
        if (!window.location.href.includes("/Character/Items/")) {
            window.location.href = `${window.location.origin}/World/Popmundo.aspx/Character/Items/`;
            return;
        }

        const timesLeft = parseInt(sessionStorage.getItem("joint-timesLeft") || USE_TIMES, 10);
        if (timesLeft <= 0) {
            saveLogEntry(`Finished ${USE_TIMES}x uses ✅ (Loop #${loopCount + 1})`);
            updateStatusBox(`Loop #${loopCount + 1} done 🌈`, STATUS_COLORS.done);
            sessionStorage.removeItem("joint-timesLeft");
            localStorage.setItem("joint-loopCount", loopCount + 1);

            saveLogEntry("Restarting new loop 🔁");
            setTimeout(() => {
                sessionStorage.setItem("joint-timesLeft", USE_TIMES);
                startCountdown(LOOP_DELAY, useJoint);
            }, 2000);
            return;
        }

        const jointRow = [...document.querySelectorAll("tr")]
            .find(r => ITEM_NAMES.some(name => r.textContent.toLowerCase().includes(name.toLowerCase())));
        if (!jointRow) {
            saveLogEntry(`Item not found ❌`);
            updateStatusBox(`Item not found ❌`, STATUS_COLORS.error);
            sessionStorage.removeItem("joint-timesLeft");
            return;
        }

        const matchedName = ITEM_NAMES.find(name => jointRow.textContent.toLowerCase().includes(name.toLowerCase()));
        const useBtn = jointRow.querySelector("input[title='Use'], input[title='Kullan']");
        if (!useBtn) {
            saveLogEntry(`Use/Kullan button not found for ${matchedName} ❌`);
            updateStatusBox(`Use/Kullan button not found ❌`, STATUS_COLORS.error);
            sessionStorage.removeItem("joint-timesLeft");
            return;
        }

        const num = USE_TIMES - timesLeft + 1;
        saveLogEntry(`Used ${matchedName} (${num}/${USE_TIMES})`);
        sessionStorage.setItem("joint-timesLeft", timesLeft - 1);
        updateStatusBox(`Using ${matchedName} (${num}/${USE_TIMES})`, STATUS_COLORS.active);
        sessionStorage.setItem("joint-waiting", "1");
        useBtn.click();
    }

    function ensureItemsPage() {
        const url = window.location.href;
        if (url.includes("/Character/Items/")) return true;
        window.location.href = `${window.location.origin}/World/Popmundo.aspx/Character/Items/`;
        return false;
    }

    // === MAIN ===
    updateStatusBox();

    // Resume after reload
    if (sessionStorage.getItem("joint-waiting") === "1") {
        sessionStorage.removeItem("joint-waiting");
        setTimeout(useJoint, INTERVAL_MS);
        return;
    }

    if (!ensureItemsPage()) return;

    if (sessionStorage.getItem("joint-timesLeft")) {
        const timesLeft = parseInt(sessionStorage.getItem("joint-timesLeft"), 10);
        if (timesLeft > 0) {
            saveLogEntry(`Cooldown started (${timesLeft} left)`);
            setTimeout(useJoint, INTERVAL_MS);
        } else {
            useJoint();
        }
    } else {
        saveLogEntry("🍃 Started hourly Joint/Sigara loop");
        sessionStorage.setItem("joint-timesLeft", USE_TIMES);
        setTimeout(useJoint, 1000);
    }
})();

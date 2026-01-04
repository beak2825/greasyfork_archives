// ==UserScript==
// @name         #gotshittodo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pings when Torn chain timer hits a specific time
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550798/gotshittodo.user.js
// @updateURL https://update.greasyfork.org/scripts/550798/gotshittodo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Settings ===
    const DEFAULT_ALARM_TIME = "0:30"; // default alarm time
    const PING_SOUND_URL = "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"; // ping sound

    const CHECK_INTERVAL = 1000; // check every 1 second
    let alarmTime = DEFAULT_ALARM_TIME;
    let hasAlerted = false;

    // === Audio Element ===
    const audio = new Audio();
    audio.preload = "auto";

    function playPing() {
        audio.src = PING_SOUND_URL;
        audio.currentTime = 0;
        audio.play().catch(err => console.log("🔇 Audio blocked until user interaction:", err));
    }

    function normalizeTime(str) {
        if (!str) return null;
        str = str.trim();
        const [m, s] = str.split(":").map(Number);
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    function checkChainTimer() {
        // Find chain timer element
        const timerElement = document.querySelector("p[class^='bar-timeleft']");
        if (!timerElement) {
            hasAlerted = false;
            return;
        }

        const timeText = normalizeTime(timerElement.textContent);
        const alarmNormalized = normalizeTime(alarmTime);

        if (timeText && timeText === alarmNormalized && !hasAlerted) {
            console.log(`🔔 Chain ping at ${timeText}!`);
            playPing();
            hasAlerted = true;
        }

        if (timeText !== alarmNormalized) {
            hasAlerted = false;
        }
    }

    setInterval(checkChainTimer, CHECK_INTERVAL);

    // === UI Panel ===
    function createUI() {
        const saved = localStorage.getItem("chainPingTime");
        if (saved) {
            alarmTime = saved;
        }

        const panel = document.createElement("div");
        panel.id = "chainPingPanel";
        panel.innerHTML = `
            <div style="background:#333;color:#fff;padding:12px;border-radius:6px;
                        font-size:13px;position:fixed;top:80px;right:20px;z-index:9999;
                        box-shadow:0 2px 8px rgba(0,0,0,0.3);width:200px;font-family:Arial;">
                <b>🔔 Chain Ping</b><br><br>
                Alert at: <input type="text" id="pingTime" value="${alarmTime}"
                    style="width:60px;padding:2px;margin-left:5px;" placeholder="m:ss"><br><br>
                <button id="savePing" style="width:100%;padding:6px;background:#007acc;color:white;border:none;border-radius:3px;cursor:pointer;">Save Time</button>
                <button id="testPing" style="width:100%;padding:6px;background:#28a745;color:white;border:none;border-radius:3px;cursor:pointer;margin-top:5px;">Test Ping</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById("savePing").addEventListener("click", () => {
            const newTime = document.getElementById("pingTime").value;
            if (normalizeTime(newTime)) {
                alarmTime = newTime;
                localStorage.setItem("chainPingTime", alarmTime);
                alert(`✅ Ping set for ${alarmTime}`);
            } else {
                alert("❌ Invalid time format. Use m:ss (e.g., 0:30)");
            }
        });

        document.getElementById("testPing").addEventListener("click", () => {
            playPing();
        });
    }

    // Wait for page to load before creating UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();
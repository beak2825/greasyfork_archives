// ==UserScript==
// @name         Auto Wyzwania Gangsters.pl
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-wyzwania z listami wyjątków (stali/dzienni), panelem sterującym, resetem dziennych o północy i losowym timingiem.
// @match        *://*.gangsters.pl/*
// @grant        none
// @author       mleko95
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/549124/Auto%20Wyzwania%20Gangsterspl.user.js
// @updateURL https://update.greasyfork.org/scripts/549124/Auto%20Wyzwania%20Gangsterspl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadList(key) { return JSON.parse(localStorage.getItem(key) || "[]"); }
    function saveList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }
    function loadFlag(key, def=false) { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
    function saveFlag(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

    let stale = loadList("autoFight_stali");
    let dzienni = loadList("autoFight_dzienni");
    let running = loadFlag("autoFight_running", false);

    let autoFightTimeout = null;

    // ------------------------------
    // Reset dziennych o północy
    // ------------------------------
    function resetDailyListIfNeeded() {
        const today = new Date().toISOString().split("T")[0];
        const lastReset = localStorage.getItem("autoFight_lastReset");

        if (lastReset !== today) {
            dzienni = [];
            saveList("autoFight_dzienni", dzienni);
            localStorage.setItem("autoFight_lastReset", today);
            console.log("🔄 Lista dziennych wyczyszczona (nowy dzień).");
        }
    }

    // ------------------------------
    // Panel sterujący
    // ------------------------------
    function createPanel() {
        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "100px";
        panel.style.right = "20px";
        panel.style.background = "black";
        panel.style.color = "yellow";
        panel.style.padding = "10px";
        panel.style.zIndex = 99999;
        panel.style.fontSize = "12px";
        panel.style.width = "220px";
        panel.style.fontFamily = "monospace";

        panel.innerHTML = `
            <b>⚔ Auto-Wyzwania</b><br><br>
            <div>
              <b>Stali:</b><br>
              <textarea id="staliBox" style="width:100%;height:60px;background:#202020;color:yellow;">${stale.join("\n")}</textarea>
            </div>
            <div style="margin-top:5px;">
              <b>Dzienni:</b><br>
              <textarea id="dzienniBox" style="width:100%;height:60px;background:#202020;color:yellow;">${dzienni.join("\n")}</textarea>
            </div>
            <div style="margin-top:8px;text-align:center;">
              <button id="saveBtn">💾 Zapisz</button>
              <button id="toggleBtn">${running ? "⏹ Stop" : "▶ Start"}</button>
              <button id="fightNowBtn">⚔ Wyzwij teraz</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById("saveBtn").onclick = () => {
            stale = document.getElementById("staliBox").value.split("\n").map(x => x.trim()).filter(x => x);
            dzienni = document.getElementById("dzienniBox").value.split("\n").map(x => x.trim()).filter(x => x);
            saveList("autoFight_stali", stale);
            saveList("autoFight_dzienni", dzienni);
            alert("✅ Listy zapisane!");
        };

        document.getElementById("toggleBtn").onclick = () => {
            running = !running;
            saveFlag("autoFight_running", running);
            document.getElementById("toggleBtn").textContent = running ? "⏹ Stop" : "▶ Start";
            if (running) startAutoFight();
            else stopAutoFight();
        };

        document.getElementById("fightNowBtn").onclick = () => {
            autoFight();
        };
    }

    // ------------------------------
    // Automatyczne wyzwania
    // ------------------------------
    function autoFight() {
        const forms = document.querySelectorAll('form[action="/action.php"] input[name="opponentId"]');
        forms.forEach(input => {
            const form = input.closest("form");
            const nickEl = form.closest("tr")?.querySelector("b");
            const nick = nickEl ? nickEl.innerText.trim() : null;

            if (!nick) return;

            if (stale.includes(nick) || dzienni.includes(nick)) {
                console.log("⏩ Pomijam:", nick);
                return;
            }

            console.log("⚔ Wyzywam:", nick);
            form.submit();
        });
    }

    function scheduleNextFight() {
        if (running) {
            const delay = 300 + (Math.random() * (800 - 50) + 50); // 300ms + losowe 50–800ms
            autoFightTimeout = setTimeout(() => {
                autoFight();
                scheduleNextFight();
            }, delay);
        }
    }

    function startAutoFight() {
        if (!autoFightTimeout) {
            console.log("▶ Auto-wyzwania włączone");
            scheduleNextFight();
        }
    }

    function stopAutoFight() {
        if (autoFightTimeout) {
            clearTimeout(autoFightTimeout);
            autoFightTimeout = null;
            console.log("⏹ Auto-wyzwania wyłączone");
        }
    }

    // ------------------------------
    // Start
    // ------------------------------
    window.addEventListener("load", () => {
        resetDailyListIfNeeded();
        createPanel();
        if (running) startAutoFight();
    });

})();

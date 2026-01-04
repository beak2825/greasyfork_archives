// ==UserScript==
// @name         Premium Torn Energy Calculator
// @namespace    https://PremiumEnergyCalc.github.io/premium-torn-energy-calculator
// @version      1.9
// @description  Premium Energy Torn Dashboard — auto energy loading, action calculator, polished UI panel. Users input their own API key. MIT licensed.
// @author       PowerJuice
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557271/Premium%20Torn%20Energy%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/557271/Premium%20Torn%20Energy%20Calculator.meta.js
// ==/UserScript==

(function() {

    // ======================
    // 1. GET USER API KEY
    // ======================
    let API_KEY = localStorage.getItem("pj_torn_api_key");
    function requestApiKey() {
        const key = prompt("Enter your Torn API key for the Premium Torn Energy Calculator:", API_KEY || "");
        if (key) {
            API_KEY = key;
            localStorage.setItem("pj_torn_api_key", API_KEY);
            updatePanel();
        }
    }

    if (!API_KEY) requestApiKey();

    // ======================
    // 2. CREATE TOGGLE BUTTON
    // ======================
    let btnContainer = document.createElement("div");
    btnContainer.style.position = "fixed";
    btnContainer.style.bottom = "90px";
    btnContainer.style.right = "20px";
    btnContainer.style.zIndex = "9999";

    let btn = document.createElement("button");
    btn.textContent = "⚡  Energy Dashboard";
    btn.style.padding = "10px 16px";
    btn.style.borderRadius = "10px";
    btn.style.border = "none";
    btn.style.background = "#00c853";
    btn.style.color = "white";
    btn.style.fontWeight = "bold";
    btn.style.boxShadow = "0px 0px 8px rgba(0,0,0,0.4)";
    btn.style.cursor = "pointer";

    btnContainer.appendChild(btn);
    document.body.appendChild(btnContainer);

    // ======================
    // 3. CREATE DASHBOARD PANEL
    // ======================
    let panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "140px";
    panel.style.right = "20px";
    panel.style.width = "300px";
    panel.style.maxHeight = "450px";
    panel.style.background = "#1e1e1e";
    panel.style.color = "#fff";
    panel.style.fontFamily = "Arial, sans-serif";
    panel.style.borderRadius = "12px";
    panel.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.7)";
    panel.style.padding = "10px";
    panel.style.overflowY = "auto";
    panel.style.display = "none";
    panel.style.zIndex = "9998";

    panel.innerHTML = `<h3 style="margin:0 0 10px 0; color:#00c853; font-weight:bold;">⚡ Energy Dashboard</h3>
                       <p id="pj-loading">Loading stats...</p>
                       <button id="pj-set-key" style="margin-top:10px; padding:6px 10px; border:none; border-radius:6px; background:#ff9800; color:#fff; cursor:pointer;">Set/Change API Key</button>`;

    document.body.appendChild(panel);

    document.getElementById("pj-set-key").addEventListener("click", requestApiKey);

    // ======================
    // 4. FETCH PLAYER STATS
    // ======================
    async function fetchStats() {
        if (!API_KEY) return { energy: "N/A", nerve: "N/A", health: "N/A", maxEnergy: 100, maxNerve: 100, maxHealth: 100 };

        const url = `https://api.torn.com/user/?selections=bars,personalstats&key=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.error) return null;

            return {
                energy: data.energy?.current ?? "N/A",
                nerve: data.nerve?.current ?? "N/A",
                health: data.health?.current ?? "N/A",
                maxEnergy: data.energy?.max ?? 100,
                maxNerve: data.nerve?.max ?? 100,
                maxHealth: data.health?.max ?? 100
            };
        } catch {
            return null;
        }
    }

    // ======================
    // 5. CALCULATE ACTIONS
    // ======================
    function calculateActions(stats) {
        const attackCost = 25, gymCost = 5, bustCost = 15, crimeCost = 10, ocCost = 30;
        if (stats.energy === "N/A") return { attacks:"N/A", trains:"N/A", busts:"N/A", crimes:"N/A", ocs:"N/A", refillReady:"N/A" };

        return {
            attacks: Math.floor(stats.energy / attackCost),
            trains: Math.floor(stats.energy / gymCost),
            busts: Math.floor(stats.energy / bustCost),
            crimes: Math.floor(stats.energy / crimeCost),
            ocs: Math.floor(stats.energy / ocCost),
            refillReady: stats.energy >= 150 ? "YES" : "NO"
        };
    }

    // ======================
    // 6. UPDATE PANEL
    // ======================
    async function updatePanel() {
        const loading = document.getElementById("pj-loading");
        if (loading) loading.textContent = "Loading stats...";

        const stats = await fetchStats();
        if (!stats) {
            if (loading) loading.textContent = "Failed to load stats (check API key).";
            return;
        }

        const actions = calculateActions(stats);
        const energyColor = stats.energy !== "N/A" ? (stats.energy / stats.maxEnergy > 0.5 ? "#00ff00" : stats.energy / stats.maxEnergy > 0.25 ? "#ffff00" : "#ff0000") : "#888";
        const nerveColor = stats.nerve !== "N/A" ? (stats.nerve / stats.maxNerve > 0.5 ? "#00ff00" : stats.nerve / stats.maxNerve > 0.25 ? "#ffff00" : "#ff0000") : "#888";
        const healthColor = stats.health !== "N/A" ? (stats.health / stats.maxHealth > 0.5 ? "#00ff00" : stats.health / stats.maxHealth > 0.25 ? "#ffff00" : "#ff0000") : "#888";

        panel.innerHTML = `<h3 style="margin:0 0 10px 0; color:#00c853; font-weight:bold;">⚡ Energy Dashboard</h3>
            <p>Energy: <span style="color:${energyColor}">${stats.energy}/${stats.maxEnergy}</span></p>
            <p>Nerve: <span style="color:${nerveColor}">${stats.nerve}/${stats.maxNerve}</span></p>
            <p>Health: <span style="color:${healthColor}">${stats.health}/${stats.maxHealth}</span></p>
            <hr style="border:1px solid #333;">
            <p>⚔️ Attacks: ${actions.attacks}</p>
            <p>🏋️ Gym Trains: ${actions.trains}</p>
            <p>🚨 Busts: ${actions.busts}</p>
            <p>💰 Crimes: ${actions.crimes}</p>
            <p>🗂️ OC Starts: ${actions.ocs}</p>
            <p>💊 Refill Ready: ${actions.refillReady}</p>
            <hr style="border:1px solid #333;">
            <button id="pj-set-key" style="margin-top:10px; padding:6px 10px; border:none; border-radius:6px; background:#ff9800; color:#fff; cursor:pointer;">Set/Change API Key</button>
            <p style="font-size:12px; color:#888;"> Premium Energy Torn Dashboard — MIT License</p>`;

        document.getElementById("pj-set-key").addEventListener("click", requestApiKey);
    }

    // ======================
    // 7. BUTTON TOGGLE PANEL
    // ======================
    btn.addEventListener("click", async function() {
        if (panel.style.display === "none") {
            panel.style.display = "block";
            await updatePanel();
        } else {
            panel.style.display = "none";
        }
    });

    // ======================
    // 8. AUTO REFRESH PANEL
    // ======================
    setInterval(async () => { if (panel.style.display === "block") await updatePanel(); }, 60000);

})();
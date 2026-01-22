// ==UserScript==
// @name         Manarion Market ROI Master v3.5 (Targeted)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Targeted Column Parsing + Interval Safety + Implied Baseline Debug.
// @author       GeminiOptimiser
// @match        https://manarion.com/*
// @match        https://*.manarion.com/*
// @connect      api.manarion.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563520/Manarion%20Market%20ROI%20Master%20v35%20%28Targeted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563520/Manarion%20Market%20ROI%20Master%20v35%20%28Targeted%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const DEFAULT_TOTAL_PCT = 24782;
    const DEFAULT_DAILY_T = 162.90;
    const API_URL = "https://api.manarion.com/players/";

    // Only count these stats on EQUIPPED items (avoids Health/Mana flat values)
    const VALID_ROI_IDS = ["120", "121", "122", "123", "124"];

    const COLORS = {
        INSANE: "#d042ff",      // < 7 Days
        EXCELLENT: "#00ff00",   // < 14 Days
        GOOD: "#ffff00",        // < 30 Days
        PRIORITIZE: "#ffa500",  // < 45 Days
        PASS: "#ff4444",        // > 45 Days
        NEUTRAL: "#666"
    };

    let playerData = null;
    let processorInterval = null; // Guard against duplicate intervals

    // --- UI SETUP ---
    function createControlPanel() {
        if (document.getElementById('roi-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'roi-panel';
        panel.style.cssText = "position: fixed; bottom: 10px; right: 10px; background: #080808; border: 1px solid #444; padding: 10px; z-index: 999999; font-family: monospace; color: white; width: 210px; border-radius: 5px; box-shadow: 0 0 10px #000;";
        
        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0; color:#d042ff; text-align:center; font-size: 14px;">ROI Master v3.5</h3>
            <div style="margin-bottom:5px; font-size: 12px;"><label>Daily T:</label> <input id="roi-daily" style="width:70px; float:right; background:#222; color:#fff; border:1px solid #555; text-align:right;"></div>
            <div style="margin-bottom:5px; font-size: 12px;"><label>Total %:</label> <input id="roi-total" style="width:70px; float:right; background:#222; color:#fff; border:1px solid #555; text-align:right;"></div>
            <div style="margin-bottom:8px"><input id="roi-user" placeholder="Username" style="width:100%; background:#222; color:#fff; border:1px solid #555; padding: 2px; box-sizing: border-box;"></div>
            <button id="roi-fetch" style="width:100%; background:#446; color:#fff; border:none; padding:6px; cursor:pointer; font-weight:bold; border-radius:3px;">Fetch My Gear</button>
            <div id="roi-status" style="text-align:center; margin-top:5px; color:#888; font-size: 11px;">Ready</div>
            <div style="text-align:center; margin-top:5px; font-size: 10px; color: #555;">Check Console (F12) for Baseline Debug</div>
        `;
        document.body.appendChild(panel);

        document.getElementById('roi-daily').value = GM_getValue('roi_daily', DEFAULT_DAILY_T);
        document.getElementById('roi-total').value = GM_getValue('roi_total', DEFAULT_TOTAL_PCT);
        document.getElementById('roi-user').value = GM_getValue('roi_user', '');

        ['roi-daily', 'roi-total', 'roi-user'].forEach(id => {
            document.getElementById(id).addEventListener('change', e => GM_setValue(id.replace('-', '_'), e.target.value));
        });
        document.getElementById('roi-fetch').onclick = fetchPlayerData;
    }

    function fetchPlayerData() {
        const user = document.getElementById('roi-user').value.trim();
        const status = document.getElementById('roi-status');
        if (!user) return;
        
        status.textContent = "Fetching...";
        status.style.color = "yellow";

        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL + encodeURIComponent(user),
            onload: function(response) {
                if (response.status === 200) {
                    playerData = JSON.parse(response.responseText);
                    status.textContent = "Synced!";
                    status.style.color = "#0f0";
                    console.log("[ROI Master] Player Data Loaded. Equipment Keys:", Object.keys(playerData.Equipment || {}));
                    runProcessor();
                } else {
                    status.textContent = "Error " + response.status;
                    status.style.color = "red";
                }
            }
        });
    }

    // --- LOGIC ---
    function getSlotId(name) {
        name = name.toLowerCase();
        if (name.includes("staff") || name.includes("wand") || name.includes("sword") || name.includes("bow")) return 1;
        if (name.includes("robes") || name.includes("chest") || name.includes("tunic")) return 2;
        if (name.includes("sandals") || name.includes("boots")) return 3;
        if (name.includes("gloves") || name.includes("hands")) return 4;
        if (name.includes("hood") || name.includes("helm")) return 5;
        if (name.includes("cloak") || name.includes("cape")) return 6;
        if (name.includes("pendant") || name.includes("necklace") || name.includes("amulet")) return 7;
        if (name.includes("ring")) return 8;
        return 0;
    }

    function getEquippedPower(slotId) {
        if (!playerData || !playerData.Equipment) return 0;
        // Ensure string key lookup
        const item = playerData.Equipment[String(slotId)];
        if (!item || !item.Boosts) return 0;

        let maxBase = 0;
        // Filter: Only look for percentage-based ROI stats (Dust, XP, Shards, etc)
        // Ignores Health/Mana flat values
        for (const validId of VALID_ROI_IDS) {
            if (item.Boosts[validId]) {
                const val = item.Boosts[validId];
                if (val > maxBase) maxBase = val;
            }
        }

        // Infusion Math: Base * (1 + 0.05 * Infusions)
        const infusions = item.Infusions || 0;
        return maxBase * (1 + infusions * 0.05);
    }

    function runProcessor() {
        // Clear existing interval to prevent duplicates
        if (processorInterval) clearInterval(processorInterval);
        // Run immediately, then interval
        processTable();
        processorInterval = setInterval(processTable, 1500);
    }

    function processTable() {
        if (!playerData) return;

        const dailyT = parseFloat(document.getElementById('roi-daily').value) || DEFAULT_DAILY_T;
        const totalPct = parseFloat(document.getElementById('roi-total').value) || DEFAULT_TOTAL_PCT;
        const ratio = dailyT / totalPct;

        // 1. Target the Table Header to find Columns
        const table = document.querySelector('table');
        if (!table) return;
        
        const thead = table.querySelector('thead tr');
        if (!thead) return;

        // Inject Our Header
        if (!thead.querySelector('.my-roi-header')) {
            const th = document.createElement('th');
            th.className = 'my-roi-header';
            th.textContent = "My ROI";
            th.style.color = COLORS.INSANE;
            th.style.textAlign = "center";
            thead.appendChild(th);
        }

        // Detect Column Indices
        const headers = Array.from(thead.querySelectorAll('th'));
        let priceIdx = headers.findIndex(h => h.textContent.toLowerCase().includes('price'));
        let boostIdx = headers.findIndex(h => h.textContent.toLowerCase().includes('boost'));
        
        // Fallback indices if detection fails
        if (priceIdx === -1) priceIdx = 1;
        if (boostIdx === -1) boostIdx = 2;

        // 2. Process Rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (row.querySelector('.my-roi-cell')) return; // Skip processed

            const cols = row.querySelectorAll('td');
            if (cols.length <= Math.max(priceIdx, boostIdx)) return;

            // Create Cell
            const cell = document.createElement('td');
            cell.className = 'my-roi-cell';
            cell.style.fontWeight = "bold";
            cell.style.textAlign = "center";
            row.appendChild(cell);

            // Parse Data
            const name = cols[0].textContent.trim();
            const slotId = getSlotId(name);
            
            if (slotId === 0) {
                cell.textContent = "";
                return;
            }

            const priceTxt = cols[priceIdx].textContent.trim().toUpperCase();
            const boostTxt = cols[boostIdx].textContent.trim().toUpperCase();

            let priceT = 0;
            let marketPower = 0;

            // Robust Price Parsing (Handle commas, spaces)
            // Removes commas, looks for number
            if (/[0-9]/.test(priceTxt) && (priceTxt.endsWith('T') || priceTxt.endsWith('B') || priceTxt.endsWith('M'))) {
                let cleanPrice = priceTxt.replace(/,/g, '').replace(/[^0-9.TBM]/g, ''); // Strip junk
                let val = parseFloat(cleanPrice.replace(/[TBM]/, ''));
                if (priceTxt.endsWith('B')) val /= 1000;
                if (priceTxt.endsWith('M')) val /= 1000000;
                priceT = val;
            }

            // Hardened Boost Parsing
            // Looks for digits + optional decimal + optional space + %
            // Ignores lines without %
            const boostMatch = boostTxt.match(/(\d+(?:\.\d+)?)\s*%/);
            if (boostMatch) {
                marketPower = parseFloat(boostMatch[1]);
            }

            if (priceT === 0 || marketPower === 0) return;

            // Math
            const equippedPower = getEquippedPower(slotId);
            const delta = marketPower - equippedPower;

            if (delta > 0) {
                const dailyGain = delta * ratio;
                const days = priceT / dailyGain;
                
                cell.textContent = days.toFixed(2) + "d";
                
                if (days < 7) { cell.style.color = COLORS.INSANE; cell.textContent += " 🚀"; }
                else if (days < 14) cell.style.color = COLORS.EXCELLENT;
                else if (days < 30) cell.style.color = COLORS.GOOD;
                else if (days < 45) cell.style.color = COLORS.PRIORITIZE;
                else cell.style.color = COLORS.PASS;

                cell.title = `Gain: +${delta.toFixed(0)}%\n(M:${marketPower} - E:${equippedPower.toFixed(0)})`;
            } else {
                cell.textContent = "-";
                cell.style.color = COLORS.NEUTRAL;
                cell.title = `Downgrade\nMarket: ${marketPower}%\nEquipped: ${equippedPower.toFixed(0)}%`;
            }

            // --- DEBUG: Reverse Engineer Game's Baseline ---
            // Only logs if the game has its OWN ROI column
            // Look for a column that has "d" but isn't ours
            // This validates the Senior Dev's theory
            /*
            const gameROICell = Array.from(cols).find(c => c.textContent.includes('d') && !c.classList.contains('my-roi-cell'));
            if (gameROICell && delta > 0) {
                const gameDays = parseFloat(gameROICell.textContent);
                if (gameDays) {
                    const gameDailyGain = priceT / gameDays;
                    const gameRatio = gameDailyGain / delta;
                    const gameImpliedDaily = gameRatio * totalPct;
                    console.log(`[Baseline Spy] Item: ${name} | Game uses Daily T ≈ ${gameImpliedDaily.toFixed(3)}T`);
                }
            }
            */
        });
    }

    window.addEventListener('load', () => setTimeout(createControlPanel, 1500));

})();
// ==UserScript==
// @name         Manarion Market ROI Master v4.4 (Visibility Fix)
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Cost/100%. Draggable. Forces Panel Visible on Market Page.
// @author       GeminiOptimiser
// @match        https://manarion.com/*
// @match        https://*.manarion.com/*
// @connect      api.manarion.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563520/Manarion%20Market%20ROI%20Master%20v44%20%28Visibility%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563520/Manarion%20Market%20ROI%20Master%20v44%20%28Visibility%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[ROI Master] v4.4 Loaded");

    // --- CONFIGURATION ---
    const API_URL = "https://api.manarion.com/players/";

    // --- STAT FILTER ---
    const VALID_ROI_IDS = ["120", "121", "122", "123", "124"];

    // --- RUBRIC ---
    const THRESHOLDS = {
        INSANE: 6.5,
        EXCELLENT: 10.0,
        GOOD: 13.5
    };

    const COLORS = {
        INSANE: "#d042ff",
        EXCELLENT: "#00ff00",
        GOOD: "#ffff00",
        PASS: "#ff4444",
        NEUTRAL: "#666"
    };

    let playerData = null;
    let processorInterval = null;

    // --- UI SETUP ---
    function createControlPanel() {
        if (document.getElementById('roi-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'roi-panel';
        
        // VISIBILITY LOGIC: Default to hidden, show if URL matches
        const initialDisplay = window.location.href.includes('market') ? 'block' : 'none';

        panel.style.cssText = `position: fixed; background: #080808; border: 1px solid #444; padding: 12px; z-index: 2147483647; font-family: monospace; color: white; width: 200px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: ${initialDisplay};`;
        
        // Restore Saved Position (or default to bottom-right)
        const savedLeft = GM_getValue('roi_panel_left');
        const savedTop = GM_getValue('roi_panel_top');

        if (savedLeft && savedTop) {
            panel.style.left = savedLeft;
            panel.style.top = savedTop;
        } else {
            panel.style.bottom = "10px";
            panel.style.right = "10px";
        }
        
        panel.innerHTML = `
            <h3 id="roi-header" style="margin:0 0 10px 0; color:#d042ff; text-align:center; font-size: 14px; border-bottom: 1px solid #333; padding-bottom: 8px; cursor: move; user-select: none;">
                ROI Master v4.4 <span style="opacity:0.5; font-size:12px">⋮⋮</span>
            </h3>
            
            <div style="margin-bottom:8px">
                <input id="roi-user" placeholder="Username" style="width:100%; background:#222; color:#fff; border:1px solid #555; padding: 4px; box-sizing: border-box; border-radius: 3px;">
            </div>
            
            <button id="roi-fetch" style="width:100%; background:#446; color:#fff; border:none; padding:8px; cursor:pointer; font-weight:bold; border-radius:3px; transition: background 0.2s;">Fetch My Gear</button>
            
            <div id="roi-status" style="text-align:center; margin-top:8px; color:#888; font-size: 11px;">Ready</div>
            
            <div style="margin-top: 10px; font-size: 10px; color: #555; border-top: 1px solid #333; padding-top: 5px;">
                <strong>Metric:</strong> Cost per 100% Boost<br>
                <span style="color:${COLORS.INSANE}">●</span> < 6.5T (Insane)<br>
                <span style="color:${COLORS.EXCELLENT}">●</span> < 10.0T (Excellent)<br>
                <span style="color:${COLORS.GOOD}">●</span> < 13.5T (Good)
            </div>
        `;
        document.body.appendChild(panel);

        // --- DRAG LOGIC ---
        const header = document.getElementById('roi-header');
        let dragController = null;

        header.addEventListener('mousedown', (e) => {
            const startX = e.clientX;
            const startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            const initialLeft = rect.left;
            const initialTop = rect.top;

            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
            panel.style.left = initialLeft + 'px';
            panel.style.top = initialTop + 'px';
            
            header.style.cursor = 'grabbing';

            dragController = new AbortController();
            const signal = dragController.signal;

            window.addEventListener('mousemove', (me) => {
                const dx = me.clientX - startX;
                const dy = me.clientY - startY;
                
                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;

                const maxLeft = window.innerWidth - panel.offsetWidth;
                const maxTop = window.innerHeight - panel.offsetHeight;
                
                newLeft = Math.max(0, Math.min(maxLeft, newLeft));
                newTop = Math.max(0, Math.min(maxTop, newTop));

                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
            }, { signal });

            window.addEventListener('mouseup', () => {
                header.style.cursor = 'move';
                GM_setValue('roi_panel_left', panel.style.left);
                GM_setValue('roi_panel_top', panel.style.top);
                dragController.abort();
                dragController = null;
            }, { signal });
        });

        const btn = document.getElementById('roi-fetch');
        btn.onmouseover = function() { this.style.background = '#558'; };
        btn.onmouseout = function() { this.style.background = '#446'; };
        btn.onclick = fetchPlayerData;

        document.getElementById('roi-user').value = GM_getValue('roi_user', '');
        document.getElementById('roi-user').addEventListener('change', e => GM_setValue('roi_user', e.target.value));
    }

    // --- API HANDLER ---
    function fetchPlayerData() {
        const user = document.getElementById('roi-user').value.trim();
        const status = document.getElementById('roi-status');
        if (!user) {
            status.textContent = "Enter Username";
            status.style.color = COLORS.PASS;
            return;
        }
        
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
                    
                    if (processorInterval) clearInterval(processorInterval);
                    processTable();
                    processorInterval = setInterval(processTable, 1500);

                } else if (response.status === 404) {
                    status.textContent = "User Not Found";
                    status.style.color = COLORS.PASS;
                } else {
                    status.textContent = "Error " + response.status;
                    status.style.color = COLORS.PASS;
                }
            },
            onerror: function() {
                status.textContent = "Network Error";
                status.style.color = COLORS.PASS;
            }
        });
    }

    // --- HELPERS ---
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
        const item = playerData.Equipment[String(slotId)];
        if (!item || !item.Boosts) return 0;

        let maxBase = 0;
        for (const validId of VALID_ROI_IDS) {
            if (item.Boosts[validId]) {
                const val = item.Boosts[validId];
                if (val > maxBase) maxBase = val;
            }
        }
        const infusions = item.Infusions || 0;
        return maxBase * (1 + infusions * 0.05);
    }

    // --- DOM PROCESSOR ---
    function processTable() {
        const panel = document.getElementById('roi-panel');
        if (!panel) return;

        // VISIBILITY CHECK (Simpler)
        if (window.location.href.includes('market')) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
            return; // Stop processing if not on market
        }

        if (!playerData) return;

        const table = document.querySelector('table');
        if (!table) return;
        
        const thead = table.querySelector('thead tr');
        if (!thead) return;

        if (!thead.querySelector('.my-roi-header')) {
            const th = document.createElement('th');
            th.className = 'my-roi-header';
            th.textContent = "Cost/100%";
            th.style.color = COLORS.INSANE;
            th.style.textAlign = "center";
            thead.appendChild(th);
        }

        const headers = Array.from(thead.querySelectorAll('th'));
        let priceIdx = headers.findIndex(h => h.textContent.toLowerCase().includes('price'));
        let boostIdx = headers.findIndex(h => h.textContent.toLowerCase().includes('boost'));
        
        if (priceIdx === -1) priceIdx = 1;
        if (boostIdx === -1) boostIdx = 2;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (row.querySelector('.my-roi-cell')) return; 

            const cols = row.querySelectorAll('td');
            if (cols.length <= Math.max(priceIdx, boostIdx)) return;

            const cell = document.createElement('td');
            cell.className = 'my-roi-cell';
            cell.style.fontWeight = "bold";
            cell.style.textAlign = "center";
            row.appendChild(cell);

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

            if (/[0-9]/.test(priceTxt) && (priceTxt.endsWith('T') || priceTxt.endsWith('B') || priceTxt.endsWith('M'))) {
                let cleanPrice = priceTxt.replace(/,/g, '').replace(/[^0-9.TBM]/g, ''); 
                let val = parseFloat(cleanPrice.replace(/[TBM]/, ''));
                if (priceTxt.endsWith('B')) val /= 1000;
                if (priceTxt.endsWith('M')) val /= 1000000;
                priceT = val;
            }

            const boostMatch = boostTxt.match(/(\d+(?:\.\d+)?)\s*%/);
            if (boostMatch) {
                marketPower = parseFloat(boostMatch[1]);
            }

            if (priceT === 0 || marketPower === 0) return;

            const equippedPower = getEquippedPower(slotId);
            const delta = marketPower - equippedPower;

            if (delta > 0) {
                const costPer1Pct = priceT / delta;
                const costPer100Pct = costPer1Pct * 100;
                
                cell.textContent = `${costPer100Pct.toFixed(2)}T (+${delta.toFixed(0)}%)`;
                cell.style.fontSize = "0.9em"; 
                
                if (costPer100Pct <= THRESHOLDS.INSANE) { 
                    cell.style.color = COLORS.INSANE; 
                    cell.textContent += " 🚀"; 
                }
                else if (costPer100Pct <= THRESHOLDS.EXCELLENT) { 
                    cell.style.color = COLORS.EXCELLENT; 
                }
                else if (costPer100Pct <= THRESHOLDS.GOOD) { 
                    cell.style.color = COLORS.GOOD; 
                }
                else { 
                    cell.style.color = COLORS.PASS; 
                }

                cell.title = `Delta: +${delta.toFixed(0)}%\nPrice: ${priceT}T\nMetric: ${costPer100Pct.toFixed(2)}T per 100% boost`;
            } else {
                cell.textContent = "-";
                cell.style.color = COLORS.NEUTRAL;
                cell.title = `Downgrade\nMarket: ${marketPower}%\nEquipped: ${equippedPower.toFixed(0)}%`;
            }
        });
    }

    // --- STARTUP ---
    // Start interval immediately to catch URL changes, but rely on window load for panel creation
    window.addEventListener('load', () => {
        setTimeout(createControlPanel, 1500);
        // Check for visibility every second
        setInterval(() => {
            const panel = document.getElementById('roi-panel');
            if (panel) {
                if (window.location.href.includes('market')) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            }
        }, 1000);
    });

})();
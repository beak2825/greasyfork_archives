// ==UserScript==
// @name         Torn Random Attack (v3.3 - PDA + Travel Filter)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Persistent UI for Torn PDA and Mobile. Supports 1b range.
// @author       John_Of_Mud [712511]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.codetabs.com
// @connect      api.allorigins.win
// @connect      api.torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561306/Torn%20Random%20Attack%20%28v33%20-%20PDA%20%2B%20Travel%20Filter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561306/Torn%20Random%20Attack%20%28v33%20-%20PDA%20%2B%20Travel%20Filter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "torn_api_key_v1";
    const STAT_RANGE_KEY = "user_stat_range";
    const MASTER_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_NxnqPMZeOS9iSHTcqkcoP0Q1LsbilWghsaUjgPCUlx6Anmpg6pBxv0FHSsNmczENvMtNLE9lpSJN/pub?output=csv";

    const COLUMN_MAP = {
        "100k": 0, "500k": 3, "1m": 6, "5m": 9, "20m": 12,
        "50m": 15, "100m": 18, "500m": 21, "1b": 24
    };

    const getApiKey = () => GM_getValue(STORAGE_KEY, "");
    const getStatRange = () => GM_getValue(STAT_RANGE_KEY, "20m");

    // --- API STATUS CHECKER (Filters everything not "Okay") ---
    function isUserAvailable(userId, apiKey) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/user/${userId}?selections=basic&key=${apiKey}`,
                timeout: 3000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        // "Okay" means NOT traveling, NOT in hospital, NOT in jail.
                        resolve(data?.status?.state === "Okay");
                    } catch (e) { resolve(false); }
                },
                ontimeout: () => resolve(false),
                onerror: () => resolve(false)
            });
        });
    }

    // --- SETTINGS INJECTION ---
    function injectSettings() {
        if (!window.location.href.includes("preferences.php")) return;
        const mobileDropdown = document.getElementById('categories');
        if (mobileDropdown && !document.querySelector('option[value="attack-script"]')) {
            const opt = document.createElement('option');
            opt.value = "attack-script";
            opt.textContent = "⭐ ATTACK SCRIPT SETTINGS";
            mobileDropdown.appendChild(opt);
            mobileDropdown.addEventListener('change', (e) => {
                if (e.target.value === "attack-script") renderSettingsPanel();
            });
        }
    }

    function renderSettingsPanel() {
        const contentWrapper = document.querySelector('.preferences-wrap');
        if (!contentWrapper) return;
        contentWrapper.innerHTML = `
            <div class="prefs-tab-title title-black top-round">Attack Script Preferences</div>
            <div style="padding: 20px; background: #333; color: #fff;">
                <p style="font-size:11px; color:#ff5555; margin-bottom:10px;">Filters: Hospital, Jail, & Traveling</p>
                <div style="margin-bottom: 15px;"><label>API KEY</label><br><input type="text" id="script-api-key" value="${getApiKey()}" style="width:100%; color:#000; padding:8px;"></div>
                <div style="margin-bottom: 15px;"><label>STAT RANGE</label><br><select id="stat-range-selector" style="width:100%; color:#000; padding:8px;">
                        ${Object.keys(COLUMN_MAP).map(r => `<option value="${r}" ${r === getStatRange() ? 'selected' : ''}>${r} and Under</option>`).join('')}
                    </select></div>
                <button id="save-attack-prefs" style="width:100%; background:#ff5555; color:#fff; padding:12px; border:none; font-weight:bold;">SAVE & RELOAD</button>
            </div>
        `;
        document.getElementById('save-attack-prefs').onclick = () => {
            GM_setValue(STORAGE_KEY, document.getElementById('script-api-key').value.trim());
            GM_setValue(STAT_RANGE_KEY, document.getElementById('stat-range-selector').value);
            location.reload();
        };
    }

    // --- PERSISTENT FLOATING BUTTON ---
    function ensureButtonExists() {
        if (document.getElementById("chain-attack-btn")) return;
        const btn = document.createElement("button");
        btn.id = "chain-attack-btn";
        btn.innerText = "CHAIN";
        Object.assign(btn.style, {
            position: "fixed", bottom: "80px", right: "15px", zIndex: "2147483647",
            width: "60px", height: "60px", backgroundColor: "#ff5555", color: "#fff",
            border: "2px solid #fff", borderRadius: "50%", fontWeight: "bold", 
            boxShadow: "0 4px 10px rgba(0,0,0,0.8)", fontSize: "10px"
        });

        btn.onclick = async (e) => {
            e.preventDefault();
            const apiKey = getApiKey();
            if (!apiKey || apiKey.length < 16) { 
                alert("Please enter a valid API Key in Settings."); 
                return; 
            }
            
            btn.style.backgroundColor = "#ffaa00";
            btn.innerText = "Sheet...";
            const range = getStatRange();
            const colIndex = COLUMN_MAP[range];
            
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.allorigins.win/raw?url=${encodeURIComponent(MASTER_SHEET_URL)}`,
                onload: async (res) => {
                    const rows = res.responseText.split(/\r?\n/);
                    let targets = [];
                    for (let i = 2; i < rows.length; i++) {
                        const cols = rows[i].split(',');
                        if (cols[colIndex]) targets.push({ id: cols[colIndex].replace(/\D/g, ''), stat: cols[colIndex+1] });
                    }

                    // Try random targets until one is "Okay"
                    for (let attempt = 0; attempt < 12; attempt++) {
                        const pick = targets[Math.floor(Math.random() * targets.length)];
                        btn.innerText = `Chk: ${pick.stat}`;
                        
                        const available = await isUserAvailable(pick.id, apiKey);
                        if (available) {
                            btn.style.backgroundColor = "#55ff55";
                            btn.innerText = "GO!";
                            window.location.assign(`https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${pick.id}`);
                            return;
                        }
                    }
                    btn.style.backgroundColor = "#ff5555";
                    btn.innerText = "BUSY";
                    setTimeout(() => btn.innerText = "CHAIN", 2000);
                }
            });
        };
        document.body.appendChild(btn);
    }

    setInterval(() => {
        ensureButtonExists();
        injectSettings();
    }, 1500);
})();
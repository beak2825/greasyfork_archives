// ==UserScript==
// @name         Torn Random Attack (v3.2 - Full Master)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Shows stat est when target is found, random attack based on database of compiled ID's
// @author       John_Of_Mud [712511]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.codetabs.com
// @connect      api.allorigins.win
// @connect      api.torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561311/Torn%20Random%20Attack%20%28v32%20-%20Full%20Master%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561311/Torn%20Random%20Attack%20%28v32%20-%20Full%20Master%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const MAX_ATTEMPTS = 30;
    const CONCURRENCY = 5;
    const STORAGE_KEY = "torn_api_key_v1";
    const STAT_RANGE_KEY = "user_stat_range";

    // SINGLE MASTER GOOGLE SHEET URL
    const MASTER_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_NxnqPMZeOS9iSHTcqkcoP0Q1LsbilWghsaUjgPCUlx6Anmpg6pBxv0FHSsNmczENvMtNLE9lpSJN/pub?output=csv";

    /** * Complete Column Mapping based on Master Sheet Layout
     * Index 0 = Column A, Index 3 = Column D, etc.
     */
    const COLUMN_MAP = {
        "100k": 0,
        "500k": 3,
        "1m":   6,
        "5m":   9,
        "20m":  12,
        "50m":  15,
        "100m": 18,
        "500m": 21,
        "1b":   24
    };

    const getApiKey = () => GM_getValue(STORAGE_KEY, "");
    const getStatRange = () => GM_getValue(STAT_RANGE_KEY, "20m");

    // --- PREFERENCES UI INJECTION ---

    function injectSettingsTab() {
        if (!window.location.href.includes("preferences.php")) return;
        const sidebar = document.querySelector('ul.headers.left');
        if (!sidebar || document.getElementById('attack-script-tab')) return;

        const li = document.createElement('li');
        li.id = "attack-script-tab";
        li.className = "c-pointer";
        li.innerHTML = `<a class="t-gray-6 bold h" style="color: #ff5555 !important;">John_Of_Mud's Attack Script</a>`;
        sidebar.appendChild(li);

        li.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('ul.headers.left li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            renderSettingsPanel();
        });
    }

    function renderSettingsPanel() {
        const contentWrapper = document.querySelector('.preferences-wrap');
        if (!contentWrapper) return;

        const title = contentWrapper.querySelector('.prefs-tab-title');
        if (title) title.innerText = "Attack Script Preferences";

        const currentKey = getApiKey();
        const currentRange = getStatRange();

        const panelHTML = `
            <div id="custom-attack-panel" class="inner-block" style="padding: 30px; min-height: 450px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                    <h2 style="font-size: 16px; font-weight: bold; color: #fff;">Configuration</h2>
                    <div id="conn-status" style="padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; background: ${currentKey ? '#414b21' : '#444'}; color: ${currentKey ? '#8fb324' : '#888'};">
                        ${currentKey ? 'Connected!' : 'Disconnected'}
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #ccc; text-transform: uppercase; font-size: 11px;">API KEY</label>
                    <input type="text" id="script-api-key" value="${currentKey}" placeholder="Enter your API key"
                           style="width: 100%; max-width: 450px; background: #222; color: #fff; border: 1px solid #444; padding: 10px; border-radius: 4px; font-family: monospace;">
                </div>

                <div style="margin-bottom: 35px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #ccc; text-transform: uppercase; font-size: 11px;">TARGET STAT RANGE</label>
                    <select id="stat-range-selector" style="width: 100%; max-width: 450px; background: #222; color: #fff; border: 1px solid #444; padding: 10px; border-radius: 4px; cursor: pointer;">
                        ${Object.keys(COLUMN_MAP).map(r => `<option value="${r}" ${r === currentRange ? 'selected' : ''}>${r} and Under</option>`).join('')}
                    </select>
                </div>

                <div class="btn-wrap silver">
                    <div class="btn">
                        <button id="save-attack-prefs" class="torn-btn" style="padding: 8px 20px; cursor: pointer;">SAVE ALL SETTINGS</button>
                    </div>
                </div>
                <p id="save-loader" style="display:none; color: #8fb324; margin-top: 15px; font-weight: bold;">Verifying key...</p>
            </div>
        `;

        document.querySelectorAll('.prefs-cont').forEach(el => el.style.display = 'none');
        let wrapper = document.getElementById('custom-attack-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'custom-attack-wrapper';
            wrapper.className = 'prefs-cont left';
            wrapper.style.cssText = "width: 70% !important; display: block; border-left: 1px solid #333;";
            contentWrapper.appendChild(wrapper);
        }
        wrapper.style.display = 'block';
        wrapper.innerHTML = panelHTML;

        document.getElementById('save-attack-prefs').onclick = function() {
            const keyInput = document.getElementById('script-api-key').value.trim();
            const rangeInput = document.getElementById('stat-range-selector').value;
            GM_setValue(STORAGE_KEY, keyInput);
            GM_setValue(STAT_RANGE_KEY, rangeInput);
            location.reload();
        };
    }

    // --- ATTACK CORE LOGIC ---

    function updateButtonLabel(text) {
        const btn = document.getElementById("chain-attack-btn");
        if (btn) btn.innerText = text;
    }

    function checkStatusOkay(userId, apiKey, cb) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${userId}?selections=basic&key=${apiKey}`,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    cb(data?.status?.state === "Okay");
                } catch (e) { cb(false); }
            },
            onerror: () => cb(false)
        });
    }

    function findOkayUser(targets, apiKey, cb) {
        let tried = new Set(), found = false, attempts = 0, inFlight = 0;
        function next() {
            if (found || attempts >= MAX_ATTEMPTS) return;
            const remaining = targets.filter(t => !tried.has(t.id));
            if (!remaining.length) { if (inFlight === 0 && !found) cb(null); return; }

            const pick = remaining[Math.floor(Math.random() * remaining.length)];
            tried.add(pick.id); attempts++; inFlight++;

            updateButtonLabel(`Checking: ${pick.stat}`); // Show Stat Est on button

            checkStatusOkay(pick.id, apiKey, okay => {
                inFlight--;
                if (found) return;
                if (okay) { found = true; cb(pick.id); }
                else {
                    if (attempts < MAX_ATTEMPTS && inFlight < CONCURRENCY) next();
                    else if (!found && inFlight === 0) cb(null);
                }
            });
            if (inFlight < CONCURRENCY && attempts < MAX_ATTEMPTS) next();
        }
        for (let i = 0; i < CONCURRENCY; i++) next();
    }

    function tryFetch(proxyIndex = 0) {
        const apiKey = getApiKey();
        const range = getStatRange();
        const colIndex = COLUMN_MAP[range];
        const PROXIES = [
            `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(MASTER_SHEET_URL)}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(MASTER_SHEET_URL)}`
        ];

        if (proxyIndex >= PROXIES.length) {
            updateButtonLabel("Error");
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: PROXIES[proxyIndex],
            onload: function(response) {
                const rows = response.responseText.split(/\r?\n/);
                const targets = [];

                // Skip headers (Row 1 & 2)
                for (let i = 2; i < rows.length; i++) {
                    const cols = rows[i].split(',');
                    const id = cols[colIndex]?.replace(/\D/g, '');
                    const stat = cols[colIndex + 1]; // Pull Stat Est from next column
                    if (id && id.length >= 4) {
                        targets.push({ id, stat });
                    }
                }

                if (targets.length > 0) {
                    findOkayUser(targets, apiKey, id => {
                        if (id) window.location.assign(`https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}`);
                        else { alert("None available."); updateButtonLabel("Chain Attack"); }
                    });
                } else {
                    tryFetch(proxyIndex + 1);
                }
            },
            onerror: () => tryFetch(proxyIndex + 1)
        });
    }

    function addUI() {
        if (document.getElementById("chain-attack-btn")) return;
        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed", top: "80px", right: "20px", zIndex: "9999",
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px"
        });

        const btn = document.createElement("button");
        btn.id = "chain-attack-btn";
        btn.innerText = "Chain Attack";
        Object.assign(btn.style, {
            padding: "10px 15px", backgroundColor: "#ff5555", color: "#fff",
            border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.5)"
        });

        btn.onclick = () => {
            updateButtonLabel("Searching...");
            tryFetch(0);
        };

        const info = document.createElement("div");
        info.id = "target-count";
        info.innerText = `Range: ${getStatRange()}`;
        info.style.cssText = "font-size: 10px; color: #fff; background: rgba(0,0,0,0.7); padding: 3px 6px; border-radius: 3px;";

        container.appendChild(btn);
        container.appendChild(info);
        document.body.appendChild(container);
    }

    const observer = new MutationObserver(() => injectSettingsTab());
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("load", () => {
        setTimeout(addUI, 1200);
        injectSettingsTab();
    });
})();
// ==UserScript==
// @name         Torn OC 2.0 Helper (Payouts, Highlighter, CPR & Avail Timers)
// @namespace    torn-oc2-helper-felsync
// @version      2.0
// @description  Adds payouts, scrapes CPR, tracks idle members, provides advanced filtering, color-codes scores, and handles unavailable members correctly.
// @author       Felsync [3921027]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558250/Torn%20OC%2020%20Helper%20%28Payouts%2C%20Highlighter%2C%20CPR%20%20Avail%20Timers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558250/Torn%20OC%2020%20Helper%20%28Payouts%2C%20Highlighter%2C%20CPR%20%20Avail%20Timers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // CONFIGURATION: Crime Data
    // =========================================================
    const CRIME_DATA = {
        "Mob Mentality": { money: "$673k - $1.5m", respect: "30 - 53", weights: { "Looter #1": 34, "Looter #2": 26, "Looter #3": 18, "Looter #4": 21 }, items: { "Looter #1": "Jemmy", "Looter #3": "Jemmy" } },
        "Pet Project": { money: "$414k - $806k", respect: "19 - 40", weights: { "Kidnapper": 31, "Muscle": 33, "Picklock": 36 }, items: { "Kidnapper": "Dog Treats", "Muscle": "Net", "Picklock": "Lockpicks" } },
        "Cash Me if You Can": { money: "$829k - $1.6m", respect: "25 - 51", weights: { "Thief #1": 54, "Thief #2": 28, "Lookout": 18 }, items: { "Thief #1": "ID Badge", "Thief #2": "ATM Key" } },
        "Best of the Lot": { money: "Loot (Cars)", respect: "34 - 69", weights: { "Picklock": 21, "Car Thief": 20, "Muscle": 44, "Imitator": 16 }, items: { "Picklock": "Lockpicks", "Imitator": "Police Badge" } },
        "Smoke and Wing Mirrors": { money: "Loot (Cars)", respect: "39 - 89", weights: { "Car Thief": 51, "Imitator": 27, "Hustler #1": 9, "Hustler #2": 13 }, items: { "Car Thief": "RF Detector", "Imitator": "DSLR Camera" } },
        "Market Forces": { money: "$5.1m - $8.6m", respect: "69 - 111", weights: { "Enforcer": 29, "Negotiator": 27, "Lookout": 16, "Arsonist": 4, "Muscle": 23 }, items: { "Arsonist": "Gasoline" } },
        "Gaslight the Way": { money: "Items (Alcohol/Energy)", respect: "74 - 127", weights: { "Imitator #1": 9, "Imitator #2": 27, "Imitator #3": 41, "Looter #1": 9, "Looter #2": 0, "Looter #3": 12 }, items: { "Imitator #1": ["Construction Helmet"], "Imitator #2": ["ID Badge"], "Imitator #3": ["ID Badge"] } },
        "Snow Blind": { money: "$5.6m - $10.6m", respect: "48 - 116", weights: { "Hustler": 48, "Imitator": 35, "Muscle #1": 9, "Muscle #2": 9 }, items: { "Imitator": "PCP" } },
        "Stage Fright": { money: "10 - 30 Xanax", respect: "67 - 174", weights: { "Enforcer": 16, "Muscle #1": 20, "Muscle #2": 3, "Muscle #3": 9, "Lookout": 6, "Sniper": 46 }, items: { "Lookout": "Binoculars" } },
        "Guardian Angels": { money: "$6.3m - $8.9m", respect: "84 - 112", weights: { "Enforcer": 27, "Hustler": 42, "Engineer": 30 }, items: { "Engineer": "Hand Drill" } },
        "Leave No Trace": { money: "$9.7m - $13.5m", respect: "75 - 108", weights: { "Techie": 29, "Negotiator": 34, "Imitator": 37 }, items: { "Negotiator": "Police Badge", "Imitator": "Police Badge" } },
        "Counter Offer": { money: "Weapons/Armor (~$24m+)", respect: "113 - 189", weights: { "Robber": 36, "Looter": 7, "Hacker": 12, "Picklock": 17, "Engineer": 28 }, items: { "Robber": "Zip Ties", "Looter": "Zip Ties", "Hacker": "Polymorphic Virus", "Picklock": "Lockpicks", "Engineer": "Wire Cutters" } },
        "No Reserve": { money: "Unlocks Bidding War", respect: "N/A", weights: { "Car Thief": 31, "Techie": 38, "Engineer": 31 }, items: { "Car Thief": "Bolt Cutters", "Techie": "Spray Paint : Black", "Engineer": "Chloroform" } },
        "Bidding War": { money: "$71.3m - $134m", respect: "298 - 520", weights: { "Robber #1": 7, "Driver": 13, "Robber #2": 23, "Robber #3": 32, "Bomber #1": 8, "Bomber #2": 18 }, items: { "Bomber #1": "C4 Explosive", "Bomber #2": "C4 Explosive", "Robber #1": "Flash Grenade", "Robber #2": "Dental Mirror", "Robber #3": "Jemmy" } },
        "Honey Trap": { money: "$15.8m - $25.7m", respect: "88 - 141", weights: { "Enforcer": 27, "Muscle #1": 31, "Muscle #2": 42 }, items: { "Muscle #1": "Billfold", "Enforcer": "Billfold" } },
        "Sneaky Git Grab": { money: "$21.4m - $38.8m", respect: "108 - 195", weights: { "Imitator": 18, "Pickpocket": 51, "Hacker": 14, "Techie": 17 }, items: { "Hacker": "Tunneling Virus", "Techie": "Wireless Dongle" } },
        "Blast from the Past": { money: "$98.3m - $202m", respect: "231 - 375", weights: { "Picklock #1": 11, "Hacker": 12, "Engineer": 24, "Bomber": 16, "Muscle": 35, "Picklock #2": 3 }, items: { "Hacker": "Firewalk Virus", "Engineer": "Core Drill", "Bomber": "Shaped Charge", "Muscle": "Zip Ties" } },
        "Break the Bank": { money: "$195m - $396m", respect: "111 - 497", weights: { "Robber": 13, "Muscle #1": 14, "Muscle #2": 10, "Thief #1": 3, "Muscle #3": 32, "Thief #2": 29 }, items: { "Robber": "Hand Drill", "Muscle #1": "Hand Drill", "Muscle #2": "Zip Ties", "Thief #1": "Hand Drill", "Muscle #3": "Hand Drill", "Thief #2": "Hand Drill" } },
        "Clinical Precision": { money: "$61.4m - $122.6m", respect: "136 - 331", weights: { "Imitator": 43, "Cat Burglar": 19, "Assassin": 16, "Cleaner": 22 }, items: { "Assassin": "Chloroform", "Cleaner": "Blood Bag : Irradiated", "Imitator": "Syringe" } },
        "Stacking the Deck": { money: "Unlocks Ace in the Hole", respect: "N/A", weights: { "Cat Burglar": 23, "Driver": 3, "Hacker": 25, "Imitator": 48 }, items: { "Cat Burglar": "Jemmy", "Driver": "Smoke Grenade", "Hacker": "Stealth Virus", "Imitator": "ID Badge" } },
        "Pier Pressure": { money: "Unknown", respect: "Unknown", weights: { }, items: { "Hacker": "Stealth Virus", "Interrogator": "Cigar Cutter", "Reviver": "Car Battery", "Cat Burglar": "Zip Ties" } },
        "Ace in the Hole": { money: "$289m - $580m", respect: "339 - 1,034", weights: { "Imitator": 21, "Muscle #1": 18, "Muscle #2": 25, "Hacker": 28, "Driver": 8 }, items: { "Imitator": "ID Badge" } },
    };
    const ITEM_IDS = { "ATM Key": 1379, "Billfold": 1080, "Binoculars": 1258, "Blood Bag : Irradiated": 1012, "Bolt Cutters": 159, "C4 Explosive": 190, "Car Battery": 884, "Chloroform": 576, "Cigar Cutter": 1223, "Construction Helmet": 643, "Core Drill": 1431, "DSLR Camera": 1383, "Dental Mirror": 1284, "Dog Treats": 1361, "Firewalk Virus": 103, "Flash Grenade": 222, "Gasoline": 172, "Hand Drill": 1331, "ID Badge": 1381, "Jemmy": 568, "Lockpicks": 1203, "Net": 1362, "PCP": 201, "Police Badge": 1350, "Polymorphic Virus": 70, "RF Detector": 1380, "Shaped Charge": 1430, "Smoke Grenade": 226, "Spray Paint : Black": 856, "Stealth Virus": 73, "Syringe": 1094, "Tunneling Virus": 71, "Wire Cutters": 981, "Wireless Dongle": 579, "Zip Ties": 1429 };

    // =========================================================
    // STYLES
    // =========================================================
    GM_addStyle(`
        .tm-oc-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            font-size: 11px;
            font-family: 'Arial', sans-serif;
            background: rgba(0, 0, 0, 0.4);
            padding: 4px 8px;
            border-radius: 5px;
            border: 1px solid #444;
            white-space: nowrap;
            margin-left: auto;
        }
        .tm-oc-money { color: #85c700; font-weight: bold; margin-bottom: 2px; }
        .tm-oc-respect { color: #aaa; font-weight: bold; }
        .tm-oc-respect::before { content: '★ '; color: #ffcc00; }

        #tm-global-tooltip { position: fixed; background: rgba(0, 0, 0, 0.95); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 12px; font-family: 'Arial', sans-serif; font-weight: 400; white-space: nowrap; z-index: 10000000; pointer-events: none; border: 1px solid #555; box-shadow: 0 4px 8px rgba(0,0,0,0.6); display: none; transform: translate(-50%, -100%); margin-top: -8px; }
        #tm-global-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: rgba(0,0,0,0.95) transparent transparent transparent; }

        .tm-cpr-popover { position: absolute; z-index: 10000; background: rgba(20, 20, 20, 0.98); border: 1px solid #666; padding: 8px; border-radius: 6px; font-size: 11px; color: #ddd; min-width: 240px; width: 260px; box-shadow: 0 4px 12px rgba(0,0,0,0.7); pointer-events: none; opacity: 0; transition: opacity 0.2s; }
        .tm-cpr-popover.visible { opacity: 1; pointer-events: auto; }
        .tm-cpr-header { font-weight: bold; color: #4db3f9; border-bottom: 1px solid #555; padding-bottom: 4px; margin-bottom: 4px; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
        .tm-cpr-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 10px; color: #ccc; }
        .tm-cpr-controls input[type="number"] { width: 40px; background: #333; border: 1px solid #555; color: #fff; border-radius: 3px; padding: 2px; font-size: 10px; }
        .tm-cpr-controls label { cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .tm-scroll-list { max-height: 200px; overflow-y: auto; padding-right: 4px; }
        .tm-scroll-list::-webkit-scrollbar { width: 4px; }
        .tm-scroll-list::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }
        .tm-cpr-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #333; }
        .tm-cpr-row:last-child { border-bottom: none; }
        .tm-cpr-row.highlight { color: #85c700; font-weight: bold; background: rgba(133, 199, 0, 0.1); padding: 3px 4px; border-radius: 3px;}
        .tm-cpr-val { font-weight: bold; margin-left: 10px; }
        .tm-cpr-expand-btn { width: 100%; background: #333; border: 1px solid #444; color: #bbb; font-size: 9px; padding: 3px; margin-top: 5px; cursor: pointer; border-radius: 3px; }
        .tm-cpr-expand-btn:hover { background: #444; color: #fff; }

        /* Availability Text Colors */
        .tm-avail-preparing { font-size: 9px; color: #aaa; margin-left: 5px; font-style: italic; }
        .tm-avail-inprogress { font-size: 9px; color: #ff6666; margin-left: 5px; }
        .tm-avail-recruiting { font-size: 9px; color: #88ccff; margin-left: 5px; font-style: italic; }
        .tm-avail-timer { font-size: 9px; color: #ffae00; margin-left: 5px; }
        .tm-avail-ready { font-size: 9px; color: #00ffcc; margin-left: 5px; font-weight: bold; }
        .tm-avail-available { font-size: 9px; color: #85c700; margin-left: 5px; font-weight: bold; }

        .tm-weight-row-header { position: absolute; top: 17px; left: 0; width: 100%; height: 17px; display: flex; justify-content: center; align-items: center; font-size: 9px; color: #ccc; border-bottom: 1px solid rgba(0,0,0,1); pointer-events: none; padding: 0; line-height: 17px; text-transform: uppercase; letter-spacing: 1.2px; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }
        .tm-weight-text { font-weight: 800; font-size: 10px; margin-left: 4px; cursor: default; pointer-events: auto; }
        .tm-weight-text.high { color: #76c043; }
        .tm-weight-text.med { color: #f2ae00; }
        .tm-weight-text.low { color: #aaaaaa; }

        .tm-missing-item { border: 1px solid #ff4c4c !important; box-shadow: 0 0 6px 2px rgba(255, 76, 76, 0.4) !important; }
        .tm-missing-container { margin-top: 5px; padding: 8px; background: rgba(50, 20, 20, 0.9); border: 1px solid #ff4c4c; border-radius: 5px; font-size: 12px; color: #fff; }
        .tm-missing-title { font-weight: bold; color: #ff794c; margin-bottom: 4px; display: block; }
        .tm-missing-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;}
        .tm-missing-row:last-child { border-bottom: none; margin-bottom: 0; }
        .tm-item-name { color: #ddd; }
        .tm-action-link { color: #4db3f9; text-decoration: none; margin-left: 10px; font-weight: bold; font-size: 11px; }
        .tm-action-link:hover { text-decoration: underline; color: #fff; }

        .tm-cpr-btn { position: absolute; top: 0; left: 0; width: 100%; height: 17px; line-height: 17px; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; background: rgba(40, 40, 40, 0.95); color: #ccc; border: none; border-bottom: 1px solid #555; border-radius: 4px 4px 0 0; cursor: pointer; transition: all 0.15s ease-in-out; z-index: 50; text-align: center; opacity: 0.9; }
        .tm-cpr-btn:hover { background: rgba(60, 60, 60, 1); color: #fff; border-bottom-color: #888; opacity: 1; }

        button[class*="slotHeader___"] { position: relative !important; }

        .tm-btn-update { margin-left: 10px !important; padding: 0 12px !important; max-width: 100px; }
        .tm-btn-loading { opacity: 0.7; cursor: not-allowed; }
        .tm-btn-settings { width: 30px !important; max-width: 30px; padding: 0 !important; margin-left: 4px !important; display: flex; align-items: center; justify-content: center; }

        /* Modal Structure */
        #tm-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
        .tm-modal-content { background: #222; border: 1px solid #444; border-radius: 8px; width: 400px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: 'Arial', sans-serif; color: #ddd; }
        .tm-modal-header { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #fff; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; }
        .tm-modal-close { cursor: pointer; color: #888; font-size: 20px; }
        .tm-modal-close:hover { color: #fff; }
        .tm-form-group { margin-bottom: 15px; }
        .tm-form-group label { display: block; margin-bottom: 5px; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }
        .tm-form-group input { width: 100%; box-sizing: border-box; background: #333; border: 1px solid #555; padding: 8px; color: #fff; border-radius: 4px; font-size: 13px; }
        .tm-form-group input:focus { border-color: #007bff; outline: none; }
        .tm-modal-actions { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
        .tm-btn-save { background: #28a745; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .tm-btn-save:hover { background: #218838; }
        .tm-btn-wipe { background: #dc3545; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .tm-btn-wipe:hover { background: #c82333; }
    `);

    // =========================================================
    // MODAL UI
    // =========================================================
    function createSettingsModal() {
        if (document.getElementById('tm-settings-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-settings-modal';

        const tsKey = GM_getValue('tornstats_api_key', '');
        const tornKey = GM_getValue('torn_api_key', '');
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-modal-header">
                    <span>OC 2.0 Helper Settings</span>
                    <span class="tm-modal-close">×</span>
                </div>
                <div class="tm-form-group">
                    <label>TornStats API Key (For CPR Data)</label>
                    <input type="text" id="tm-input-ts" value="${tsKey}" placeholder="Enter key from tornstats.com">
                </div>
                <div class="tm-form-group">
                    <label>Torn API Key (For Names & Availability)</label>
                    <input type="text" id="tm-input-torn" value="${tornKey}" placeholder="Public key is sufficient">
                </div>
                <div class="tm-modal-actions">
                    <button class="tm-btn-wipe" id="tm-btn-wipe">Clear All Data</button>
                    <button class="tm-btn-save" id="tm-btn-save">Save & Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.tm-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        modal.querySelector('#tm-btn-save').addEventListener('click', () => {
            const newTsKey = document.getElementById('tm-input-ts').value.trim();
            const newTornKey = document.getElementById('tm-input-torn').value.trim();

            if (newTsKey) GM_setValue('tornstats_api_key', newTsKey);
            else GM_deleteValue('tornstats_api_key');

            if (newTornKey) GM_setValue('torn_api_key', newTornKey);
            else GM_deleteValue('torn_api_key');

            modal.remove();
            alert("Settings saved.");
        });
        modal.querySelector('#tm-btn-wipe').addEventListener('click', () => {
            if(confirm("Are you sure? This will delete all API keys and cached data.")) {
                GM_deleteValue('tornstats_api_key');
                GM_deleteValue('torn_api_key');
                GM_deleteValue('torn_oc_cpr_data_api');
                GM_deleteValue('torn_member_map');
                GM_deleteValue('torn_oc_available_ids');
                GM_deleteValue('torn_oc_crime_status_v2'); // New key for V2 data

                document.getElementById('tm-input-ts').value = '';
                document.getElementById('tm-input-torn').value = '';
                alert("Data cleared.");
            }
        });
    }

    // =========================================================
    // HELPER FUNCTIONS
    // =========================================================
    function getGlobalTooltip() {
        let tooltip = document.getElementById('tm-global-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tm-global-tooltip';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }

    function normalizeRole(role) {
        return role.replace(/ #\d+$/, '').trim();
    }

    function getScoreColor(score) {
        if (score >= 70) return '#85c700';
        if (score >= 60) return '#ffd700';
        if (score >= 50) return '#ff8c00';
        return '#d11f1f';
    }

    // NEW: Status text logic using V2 Data
    function getMemberStatusHtml(crimeStatus) {
        if (!crimeStatus) return '';

        const status = crimeStatus.status;
        const endTime = crimeStatus.ready_at;

        // 1. Initiated
        if (status === "Initiated") {
            return `<span class="tm-avail-inprogress">(In OC: Active)</span>`;
        }

        // 2. Recruiting
        if (status === "Recruiting") {
             return `<span class="tm-avail-recruiting">(In OC: Recruiting)</span>`;
        }

        // 3. Planning (Preparing)
        if (status === "Planning") {
            // Check timer
            const now = Date.now() / 1000;

            // If API v2 says "ready_at" is 0 or null, it's just starting
            if (!endTime || endTime === 0) {
                 return `<span class="tm-avail-preparing">(In OC: Preparing)</span>`;
            }

            const diff = endTime - now;

            // If time passed, it is Ready
            if (diff <= 0) {
                return `<span class="tm-avail-ready">(In OC: Ready)</span>`;
            }

            // If time is future, show countdown
            const days = Math.floor(diff / 86400);
            const hours = Math.floor((diff % 86400) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);

            let str = "";
            if (days > 0) str += `${days}d `;
            if (hours > 0) str += `${hours}h `;
            str += `${minutes}m`;

            return `<span class="tm-avail-timer">(In OC: ${str})</span>`;
        }

        return '';
    }

    // =========================================================
    // API & DATA HANDLING
    // =========================================================

    // --- 1. FETCH CPR FROM TORNSTATS ---
    function fetchTornStatsData(callback, errorCallback) {
        let apiKey = GM_getValue('tornstats_api_key');
        if (!apiKey) {
            createSettingsModal();
            if(errorCallback) errorCallback();
            return;
        }

        const url = `https://www.tornstats.com/api/v2/${apiKey}/faction/cpr`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 10000,
            onload: function(response) {
                if (response.status !== 200) {
                     console.error("TornStats HTTP Error:", response.status);
                     if(errorCallback) errorCallback();
                     return;
                }
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.status && json.members) {
                        GM_setValue('torn_oc_cpr_data_api', JSON.stringify(json.members));
                        console.log(`[OC2.0] TornStats data loaded.`);
                        if (callback) callback();
                    } else {
                        alert("TornStats Error: " + (json.message || "Unknown"));
                        if(errorCallback) errorCallback();
                    }
                } catch (e) {
                    console.error("TS Parse Error", e);
                    if(errorCallback) errorCallback();
                }
            },
            onerror: function(err) {
                console.error("TS Network Error", err);
                if(errorCallback) errorCallback();
            },
            ontimeout: function() {
                console.error("TS Request Timed Out");
                if(errorCallback) errorCallback();
            }
        });
    }

    // --- 2. FETCH NAMES FROM TORN API ---
    function fetchTornMemberData(callback, errorCallback) {
        let apiKey = GM_getValue('torn_api_key');
        if (!apiKey) {
            createSettingsModal();
            if(errorCallback) errorCallback();
            return;
        }

        const url = `https://api.torn.com/faction/?selections=basic&key=${apiKey}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 10000,
            onload: function(response) {
                if (response.status !== 200) {
                     console.error("Torn API HTTP Error:", response.status);
                     if(errorCallback) errorCallback();
                     return;
                }
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.members) {
                        const nameMap = {};
                        Object.keys(json.members).forEach(id => {
                            nameMap[id] = json.members[id].name;
                        });
                        GM_setValue('torn_member_map', JSON.stringify(nameMap));
                        console.log(`[OC2.0] Torn data loaded.`);
                        if (callback) callback();
                    } else if (json.error) {
                        alert("Torn API Error: " + json.error.error);
                        if(errorCallback) errorCallback();
                    }
                } catch (e) {
                    console.error("Torn API Parse Error", e);
                    if(errorCallback) errorCallback();
                }
            },
            onerror: function(err) {
                console.error("Torn API Network Error", err);
                if(errorCallback) errorCallback();
            },
            ontimeout: function() {
                console.error("Torn API Request Timed Out");
                if(errorCallback) errorCallback();
            }
        });
    }

    // --- 3. FETCH CRIME TIMERS FROM TORN API V2 ---
    // Using API v2 endpoint structure with Headers Authentication
    function fetchTornCrimeData(callback, errorCallback) {
        let apiKey = GM_getValue('torn_api_key');
        if (!apiKey) return;

        // SWITCHED TO V2 with Headers Auth (fix for 403/Broken state)
        //
        const url = `https://api.torn.com/v2/faction/crimes?cat=available`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                'Authorization': 'ApiKey ' + apiKey // This matches the working script's method
            },
            timeout: 10000,
            onload: function(response) {
                if (response.status !== 200) {
                     console.error("API V2 Error Status:", response.status);
                     if(errorCallback) errorCallback();
                     return;
                }
                try {
                    const json = JSON.parse(response.responseText);
                    // V2 returns crimes inside 'crimes' array directly or inside object
                    // Standard v2 response is { crimes: [ ... ] }
                    if (json.crimes) {
                        const busyMap = {};

                        // Iterate through Array (V2 format)
                        json.crimes.forEach(crime => {
                            if (crime.slots) {
                                crime.slots.forEach(slot => {
                                    if (slot.user && slot.user.id) {
                                         busyMap[slot.user.id] = {
                                             status: crime.status,    // "Planning", "Recruiting", "Initiated"
                                             ready_at: crime.ready_at // The correct timestamp
                                         };
                                    }
                                });
                            }
                        });

                        // Save to new key to avoid conflicts with old V1 data
                        GM_setValue('torn_oc_crime_status_v2', JSON.stringify(busyMap));
                        console.log(`[OC2.0] Crime timers loaded (V2).`);
                        if (callback) callback();
                    } else if (json.error) {
                        console.error("Torn API Error (Crimes): " + json.error.error);
                        if(errorCallback) errorCallback();
                    }
                } catch (e) {
                    console.error("Torn API Parse Error (Crimes)", e);
                    if(errorCallback) errorCallback();
                }
            },
            onerror: function(err) {
                console.error("Torn API Network Error (Crimes)", err);
                if(errorCallback) errorCallback();
            }
        });
    }

    // --- 4. MASTER UPDATE FUNCTION ---
    function updateAllData(btnElement) {
        if (!GM_getValue('tornstats_api_key') || !GM_getValue('torn_api_key')) {
            createSettingsModal();
            return;
        }

        if (btnElement) {
            btnElement.disabled = true;
            btnElement.classList.add('tm-btn-loading');
            btnElement.innerHTML = `Fetching...`;
        }

        // Chain the requests: Stats -> Members -> Crimes
        fetchTornStatsData(() => {
            fetchTornMemberData(() => {
                fetchTornCrimeData(() => {
                    if (btnElement) {
                        btnElement.innerHTML = `Success`;
                        setTimeout(() => {
                            btnElement.disabled = false;
                            btnElement.classList.remove('tm-btn-loading');
                            btnElement.innerHTML = `<span class="tabName___DdwH3">Update Data</span>`;
                        }, 1500);
                    }
                }, () => { if (btnElement) resetButtonState(btnElement, "Error Crime API"); });
            }, () => { if (btnElement) resetButtonState(btnElement, "Error Torn API"); });
        }, () => { if (btnElement) resetButtonState(btnElement, "Error TS API"); });
    }

    function resetButtonState(btn, msg) {
        btn.innerHTML = `${msg}`;
        setTimeout(() => {
            btn.disabled = false;
            btn.classList.remove('tm-btn-loading');
            btn.innerHTML = `<span class="tabName___DdwH3">Update Data</span>`;
        }, 2000);
    }

    function createApiButtons() {
        const filterBar = document.querySelector('.buttonsContainer___aClaa');
        if (filterBar && !document.getElementById('tm-api-trigger')) {
            // Update Button
            const btn = document.createElement('button');
            btn.id = 'tm-api-trigger';
            btn.className = 'button___cwmLf tm-btn-update';
            btn.style.marginLeft = '10px';
            btn.innerHTML = `<span class="tabName___DdwH3">Update Data</span>`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                updateAllData(btn);
            });
            // Settings Button
            const setBtn = document.createElement('button');
            setBtn.className = 'button___cwmLf tm-btn-settings';
            setBtn.style.marginLeft = '4px';
            setBtn.innerHTML = `⚙️`;
            setBtn.title = "Settings";
            setBtn.addEventListener('click', (e) => {
                e.preventDefault();
                createSettingsModal();
            });
            filterBar.appendChild(btn);
            filterBar.appendChild(setBtn);
        }
    }

    function scanAvailableMembers() {
        const notInOCContainer = document.querySelector('.notInvolvedMembers___ifZnn');
        if (notInOCContainer) {
            const list = [];
            notInOCContainer.querySelectorAll('a[href*="XID="]').forEach(link => {
                const xidMatch = link.href.match(/XID=(\d+)/);
                if (xidMatch) list.push(xidMatch[1]);
            });
            const uniqueList = [...new Set(list)];
            if (uniqueList.length > 0) {
                GM_setValue('torn_oc_available_ids', JSON.stringify(uniqueList));
            }
        }
    }

    // =========================================================
    // TORN OC PAGE LOGIC
    // =========================================================
    function processCrimes() {
        // Fetch fresh data for each scan/click
        const crimeCards = document.querySelectorAll('div[data-oc-id]');
        crimeCards.forEach(card => {
            const titleElement = card.querySelector('[class*="panelTitle"]');
            let crimeData = null;
            let crimeName = "";

            if (titleElement) {
                crimeName = titleElement.textContent.trim();
                crimeData = CRIME_DATA[crimeName];
            }

            const phaseTitle = card.querySelector('.phase___LcbAX .title___pB5FU');
            const phaseText = phaseTitle ? phaseTitle.textContent.trim().toLowerCase() : '';
            const isCompleted = phaseText.includes('success') || phaseText.includes('failed');
            const isUnavailable = card.querySelector('.member-unavailable___KarVR');

            let missingItemsList = [];

            if (titleElement && crimeData && crimeData.weights) {
                const slots = card.querySelectorAll('div[class*="wrapper___Lpz_D"]');
                slots.forEach(slot => {
                    const roleTitleEl = slot.querySelector('span[class*="title___"]');
                    let roleNameFull = "";
                    if (roleTitleEl) {
                        for (const node of roleTitleEl.childNodes) {
                            if (node.nodeType === Node.TEXT_NODE) roleNameFull += node.nodeValue;
                        }
                        roleNameFull = roleNameFull.trim();
                    }

                    // --- 1. MISSING ITEMS ---
                    let isMissingItem = false;
                    if (!isCompleted) {
                        const slotIcon = slot.querySelector('div[class*="slotIcon"]');
                        if (slotIcon) {
                            const warningIcon = slotIcon.querySelector('path[fill="#ff794c"]');
                            if (warningIcon) {
                                slot.classList.add('tm-missing-item');
                                isMissingItem = true;
                            } else {
                                slot.classList.remove('tm-missing-item');
                            }
                        }

                        if (isMissingItem && !isUnavailable && roleNameFull && crimeData.items && crimeData.items[roleNameFull]) {
                            const playerImg = slot.querySelector('img[alt]');
                            const playerName = playerImg ? playerImg.alt : "Member";
                            let requiredItems = crimeData.items[roleNameFull];
                            if (!Array.isArray(requiredItems)) requiredItems = [requiredItems];
                            requiredItems.forEach(item => {
                                missingItemsList.push({ player: playerName, item: item });
                            });
                        }
                    } else {
                        slot.classList.remove('tm-missing-item');
                    }

                    // --- 2. WEIGHT ROW (Clean Text Version) ---
                    const normalizedRole = normalizeRole(roleNameFull);
                    const slotButton = roleTitleEl.closest('button[class*="slotHeader___"]');

                    if (slotButton && !slotButton.querySelector('.tm-cpr-btn')) {
                        // Increase top padding to fit TWO rows (CPR btn + Weight row)
                        slotButton.style.position = 'relative';
                        slotButton.style.paddingTop = '34px';

                        // Fix for flex alignment issues caused by padding
                        slotButton.style.display = 'flex';
                        slotButton.style.flexDirection = 'row';
                        slotButton.style.alignItems = 'center';
                        slotButton.style.justifyContent = 'center';

                        // A. CPR BUTTON (Row 1)
                        const cprBtn = document.createElement('span');
                        cprBtn.className = 'tm-cpr-btn';
                        cprBtn.innerText = 'CPR DATA';
                        cprBtn.title = "View CPR Stats";
                        slotButton.appendChild(cprBtn);
                        // B. WEIGHT ROW (Row 2) - Clean Text
                        const weight = crimeData.weights[roleNameFull];
                        if (weight !== undefined) {
                            const weightRow = document.createElement('div');
                            weightRow.className = 'tm-weight-row-header';
                            weightRow.innerText = 'WEIGHT:';

                            const badge = document.createElement('span');
                            badge.innerText = `${Math.round(weight)}`;
                            badge.className = 'tm-weight-text';
                            if (weight >= 40) badge.classList.add('high');
                            else if (weight >= 20) badge.classList.add('med');
                            else badge.classList.add('low');

                            weightRow.appendChild(badge);
                            slotButton.appendChild(weightRow);
                        }

                        // C. POPOVER LOGIC
                        let slotUserId = null;
                        const profileLink = slot.querySelector('a[href*="profiles.php?XID="]');
                        if (profileLink) {
                            const match = profileLink.href.match(/XID=(\d+)/);
                            if (match) slotUserId = match[1];
                        }

                        const popover = document.createElement('div');
                        popover.className = 'tm-cpr-popover';
                        // Append to BODY not Button to prevent clipping
                        document.body.appendChild(popover);
                        let isExpanded = false;
                        let filterAvail = false;
                        let filterMin = 0;
                        let filterMax = 0;
                        const getRoleList = (cprData, nameMap) => {
                            const list = [];
                            Object.keys(cprData).forEach(uid => {
                                const memberData = cprData[uid];
                                if (memberData[crimeName] && memberData[crimeName][normalizedRole] !== undefined) {
                                     const mappedName = nameMap[uid] || `ID: ${uid}`;
                                    list.push({
                                        id: uid,
                                        score: memberData[crimeName][normalizedRole],
                                        name: mappedName
                                    });
                                }
                            });
                            return list.sort((a, b) => b.score - a.score);
                        };

                        const refreshListOnly = (cprData, nameMap, availableIds, busyStatusMap) => {
                            const listContainer = popover.querySelector('.tm-scroll-list');
                            if (!listContainer) return;

                            const fullRoleList = getRoleList(cprData, nameMap);

                            let filteredList = fullRoleList.filter(p => {
                                if (filterMin > 0 && p.score < filterMin) return false;
                                if (filterMax > 0 && p.score > filterMax) return false;
                                if (filterAvail) {
                                    return availableIds.includes(p.id);
                                }
                                return true;
                            });
                            let listHtml = '';
                            const displayList = isExpanded ? filteredList : filteredList.slice(0, 5);
                            if (displayList.length === 0) {
                                listHtml = `<div style="text-align:center; color:#777; padding:5px;">No matches</div>`;
                            } else {
                                displayList.forEach(p => {
                                    const isAvailable = availableIds.includes(p.id);
                                    let availHtml = '';
                                    let nameStyle = '';

                                    if (isAvailable) {
                                        nameStyle = 'text-decoration: underline; text-decoration-color: #85c700; text-underline-offset: 2px;';
                                        availHtml = `<span class="tm-avail-available">(Available)</span>`;
                                    } else if (busyStatusMap && busyStatusMap[p.id]) {
                                        // User is in a crime, check logic
                                        availHtml = getMemberStatusHtml(busyStatusMap[p.id]);
                                    }

                                    const scoreColor = getScoreColor(p.score);
                                    listHtml += `
                                        <div class="tm-cpr-row">
                                            <span>
                                                <span style="${nameStyle}">${p.name}</span>
                                                ${availHtml}
                                            </span>
                                            <span class="tm-cpr-val" style="color:${scoreColor}">${p.score}</span>
                                        </div>`;
                                });
                            }
                            listContainer.innerHTML = listHtml;
                            const expBtn = popover.querySelector('.tm-cpr-expand-btn');
                            if (expBtn) {
                                expBtn.style.display = filteredList.length > 5 ? 'block' : 'none';
                                expBtn.innerText = isExpanded ? 'Show Less' : 'Show All (' + filteredList.length + ')';
                            }
                        };
                        const renderFullPopover = () => {
                            const cprData = JSON.parse(GM_getValue('torn_oc_cpr_data_api', '{}'));
                            const nameMap = JSON.parse(GM_getValue('torn_member_map', '{}'));
                            const availableIds = JSON.parse(GM_getValue('torn_oc_available_ids', '[]'));
                            const busyStatusMap = JSON.parse(GM_getValue('torn_oc_crime_status_v2', '{}')); // New Key

                            const playerImg = slot.querySelector('img[alt]');
                            const currentPlayerName = playerImg ? playerImg.alt : "Member";

                            let html = `<div class="tm-cpr-header">CPR Data (${normalizedRole})</div>`;
                            if (slotUserId && cprData[slotUserId] && cprData[slotUserId][crimeName]) {
                                const score = cprData[slotUserId][crimeName][normalizedRole];
                                if (score !== undefined) {
                                    const scoreColor = getScoreColor(score);
                                    html += `
                                        <div class="tm-cpr-row highlight">
                                            <span>${currentPlayerName} (Cur)</span>
                                            <span class="tm-cpr-val" style="color:${scoreColor}">${score}</span>
                                        </div>`;
                                } else {
                                    html += `<div class="tm-cpr-row" style="color:#aaa"><span>${currentPlayerName}</span><span class="tm-cpr-val">No Data</span></div>`;
                                }
                            }

                            html += `<div style="border-bottom:1px dashed #444; margin: 4px 0;"></div>`;
                            html += `
                                <div class="tm-cpr-controls">
                                    <label><input type="checkbox" id="tm-filter-avail" ${filterAvail ? 'checked' : ''}> Avail</label>
                                    <input type="number" id="tm-filter-min" value="${filterMin || ''}" placeholder="Min">
                                    <input type="number" id="tm-filter-max" value="${filterMax || ''}" placeholder="Max">
                                </div>
                                <div class="tm-scroll-list"></div>
                                <button class="tm-cpr-expand-btn" style="display:none">Show All</button>
                            `;

                            popover.innerHTML = html;
                            refreshListOnly(cprData, nameMap, availableIds, busyStatusMap);

                            const chk = popover.querySelector('#tm-filter-avail');
                            if(chk) chk.addEventListener('change', (e) => { filterAvail = e.target.checked; refreshListOnly(cprData, nameMap, availableIds, busyStatusMap); });
                            const inpMin = popover.querySelector('#tm-filter-min');
                            if(inpMin) inpMin.addEventListener('input', (e) => { filterMin = parseInt(e.target.value) || 0; refreshListOnly(cprData, nameMap, availableIds, busyStatusMap); });
                            const inpMax = popover.querySelector('#tm-filter-max');
                            if(inpMax) inpMax.addEventListener('input', (e) => { filterMax = parseInt(e.target.value) || 0; refreshListOnly(cprData, nameMap, availableIds, busyStatusMap); });
                            const expBtn = popover.querySelector('.tm-cpr-expand-btn');
                            if(expBtn) expBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                isExpanded = !isExpanded;
                                refreshListOnly(cprData, nameMap, availableIds, busyStatusMap);
                            });
                        };

                        cprBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            document.querySelectorAll('.tm-cpr-popover.visible').forEach(p => {
                                if(p !== popover) p.classList.remove('visible');
                            });

                            if (popover.classList.contains('visible')) {
                                popover.classList.remove('visible');
                            } else {
                                renderFullPopover();
                                const btnRect = cprBtn.getBoundingClientRect();
                                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                                // SMART POSITIONING
                                const popoverWidth = 260; // Matches CSS width
                                const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
                                // Default Left Align
                                let popLeft = btnRect.left;
                                // Check if it overflows right
                                if (popLeft + popoverWidth > viewportWidth) {
                                    // Align Right
                                    popLeft = btnRect.right - popoverWidth;
                                    // Safety check for left overflow
                                    if(popLeft < 5) popLeft = 5;
                                }

                                popover.style.top = `${btnRect.bottom + scrollTop + 2}px`;
                                popover.style.left = `${popLeft}px`;

                                popover.classList.add('visible');
                            }
                        });
                        document.addEventListener('click', (event) => {
                            if (!popover.contains(event.target) && event.target !== cprBtn) {
                                popover.classList.remove('visible');
                            }
                        });
                        slotButton.appendChild(cprBtn);
                    }
                });
            }

            // --- 6. MISSING ITEMS DISPLAY ---
            if (!isCompleted && !isUnavailable && missingItemsList.length > 0) {
                let missingContainer = card.querySelector('.tm-missing-container');
                if (!missingContainer) {
                    missingContainer = document.createElement('div');
                    missingContainer.className = 'tm-missing-container';
                    const slotsWrapper = card.querySelector('div[class*="wrapper___g3mPt"]');
                    if (slotsWrapper) {
                        slotsWrapper.parentNode.insertBefore(missingContainer, slotsWrapper.nextSibling);
                    }
                }
                let html = `<span class="tm-missing-title">⚠️ Missing Items Detected</span>`;
                missingItemsList.forEach(entry => {
                    let buyLink;
                    if (ITEM_IDS[entry.item]) {
                        buyLink = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${ITEM_IDS[entry.item]}`;
                    } else {
                        const encodedItem = encodeURIComponent(entry.item);
                        buyLink = `https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${encodedItem}`;
                    }
                    html += `
                        <div class="tm-missing-row">
                            <span class="tm-item-name"><strong>${entry.player}</strong> needs <strong>${entry.item}</strong></span>
                            <span>
                                <a href="${buyLink}" class="tm-action-link" target="_blank">Buy</a>
                                <a href="https://www.torn.com/factions.php?step=your#/tab=armoury" class="tm-action-link" target="_blank">Armory</a>
                            </span>
                        </div>
                    `;
                });
                missingContainer.innerHTML = html;
            } else {
                const existing = card.querySelector('.tm-missing-container');
                if (existing) existing.remove();
            }

            // --- 7. HEADER INFO ---
            if (titleElement && crimeData) {
                let infoDiv = card.querySelector('.tm-oc-info');
                if (!infoDiv) {
                    infoDiv = document.createElement('div');
                    infoDiv.className = 'tm-oc-info';
                    const moneySpan = document.createElement('span');
                    moneySpan.className = 'tm-oc-money';
                    moneySpan.innerText = `${crimeData.money}`;
                    infoDiv.appendChild(moneySpan);
                    const respectSpan = document.createElement('span');
                    respectSpan.className = 'tm-oc-respect';
                    const respectText = (crimeData.respect === "N/A" || crimeData.respect === "Unknown")
                        ? `${crimeData.respect}`
                        : `${crimeData.respect} Respect`;
                    respectSpan.innerText = respectText;
                    infoDiv.appendChild(respectSpan);
                    const panelBody = card.querySelector('[class*="panel___"]');
                    if (panelBody) {
                         panelBody.appendChild(infoDiv);
                    }
                }
            }
        });
    }

    // =========================================================
    // INITIALIZATION
    // =========================================================
    function activeScan() {
        if (window.location.hash.includes('tab=crimes')) {
            createApiButtons();
            scanAvailableMembers();
            processCrimes();
        }
    }

    setInterval(activeScan, 1000);
    window.addEventListener('hashchange', () => {
        activeScan();
        setTimeout(activeScan, 500);
    });
    activeScan();

})();
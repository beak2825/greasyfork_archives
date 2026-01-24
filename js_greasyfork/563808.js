// ==UserScript==
// @name         RA War Dibs
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Instant clicks, no blinking, fixed variable errors
// @author       You
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563808/RA%20War%20Dibs.user.js
// @updateURL https://update.greasyfork.org/scripts/563808/RA%20War%20Dibs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= CONFIGURATION =================
    // Your Google Script URL
    const API_URL = "https://script.google.com/macros/s/AKfycbx23VmWQnd_VG87phe3Me_Z9vGuqqfNWNOHQW3nB-4B9A9V1S20EXma3_4c-SXefvH_uw/exec";

    const DATA_SYNC_RATE = 2000; // Fetch data from Google every 2 seconds
    const UI_CHECK_RATE = 250;   // Check the UI every 0.25 seconds (Fast updates)
    // =================================================

    // Get Username
    let myName = GM_getValue("claim_username", "");
    if (!myName) {
        myName = prompt("Enter your name for the Target Claimer:");
        if (myName) GM_setValue("claim_username", myName);
    }

    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .claim-container {
            float: right;
            margin-right: 15px;
            font-family: Arial, sans-serif;
            z-index: 9999;
            position: relative;
        }
        .claim-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            color: #ffffff !important;
            text-shadow: 1px 1px 0 #000;
            border: 1px solid rgba(255,255,255,0.3);
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
            user-select: none;
            text-decoration: none !important;
            min-width: 60px;
            text-align: center;
        }
        .claim-badge.is-free { background-color: #455a64; border-color: #78909c; }
        .claim-badge.is-free:hover { background-color: #607d8b; }

        .claim-badge.is-mine { background-color: #2e7d32; border-color: #66bb6a; }
        .claim-badge.is-mine:hover { background-color: #388e3c; }

        .claim-badge.is-taken { background-color: #c62828; border-color: #ef5350; cursor: default; opacity: 1; }

        /* Safe styles for the injected row to prevent layout shifting */
        .custom-action-row {
            clear: both;
            padding-top: 5px;
            padding-bottom: 2px;
            min-height: 20px;
            width: 100%;
            display: block;
        }
    `;
    document.head.appendChild(style);

    let currentClaims = {};
    let ignoreServerSync = {}; // Stores timestamps for when to ignore server data

    // --- NETWORK FUNCTIONS ---

    function fetchClaims() {
        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: function(response) {
                if (response.status === 200) {
                    const serverData = JSON.parse(response.responseText);
                    const now = Date.now();

                    // Smart Merge: Only update IDs that we aren't currently "ignoring"
                    for (const [id, user] of Object.entries(serverData)) {
                        if (!ignoreServerSync[id] || now > ignoreServerSync[id]) {
                            currentClaims[id] = user;
                        }
                    }

                    // Also handle unclaims (if server says undefined, but we have it locally)
                    for (const id in currentClaims) {
                        if (!serverData[id]) {
                            // If server says it's free, but we are ignoring sync, keep it as ours
                            if (!ignoreServerSync[id] || now > ignoreServerSync[id]) {
                                delete currentClaims[id];
                            }
                        }
                    }
                }
            }
        });
    }

    function sendClaim(enemyId, action) {
        // 1. SET IGNORE TIMER: Don't listen to server for this ID for 5 seconds
        ignoreServerSync[enemyId] = Date.now() + 5000;

        // 2. OPTIMISTIC UPDATE: Update local data instantly
        if (action === 'claim') currentClaims[enemyId] = myName;
        else delete currentClaims[enemyId];

        // 3. FORCE REDRAW: Update UI immediately
        enforceInterface();

        // 4. SEND TO SERVER
        const payload = JSON.stringify({
            enemyId: enemyId,
            claimant: myName,
            action: action
        });

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            data: payload,
            headers: { "Content-Type": "application/json" }
        });
    }

    // --- UI LOGIC ---

    function enforceInterface() {
        const enemies = document.querySelectorAll('.members-list li.enemy');

        enemies.forEach(node => {
            // Get ID
            let enemyId = null;
            const statusDiv = node.querySelector('.status[data-twse-userid]');
            if (statusDiv) {
                enemyId = statusDiv.getAttribute('data-twse-userid');
            } else {
                const link = node.querySelector('a[href*="profiles.php?XID="]');
                if (link) {
                    const match = link.href.match(/XID=(\d+)/);
                    if (match) enemyId = match[1];
                }
            }
            if (!enemyId) return;

            // Ensure Rows Exist
            let lastActionRow = node.querySelector('.last-action-row');
            if (!lastActionRow) {
                lastActionRow = node.querySelector('.custom-action-row');
                if (!lastActionRow) {
                    lastActionRow = document.createElement('div');
                    lastActionRow.className = 'last-action-row custom-action-row';
                    node.appendChild(lastActionRow);
                }
            }

            let container = lastActionRow.querySelector('.claim-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'claim-container';
                lastActionRow.appendChild(container);
            }

            // Determine Status
            const claimedBy = currentClaims[enemyId];

            let stateClass = "";
            let btnText = "";
            let clickAction = null;

            if (claimedBy && claimedBy !== myName) {
                stateClass = "is-taken";
                btnText = `⛔ ${claimedBy}`;
            } else if (claimedBy === myName) {
                stateClass = "is-mine";
                btnText = `✓ MINE`;
                clickAction = (e) => { e.preventDefault(); e.stopPropagation(); sendClaim(enemyId, 'unclaim'); };
            } else {
                stateClass = "is-free";
                btnText = `CLAIM`;
                clickAction = (e) => { e.preventDefault(); e.stopPropagation(); sendClaim(enemyId, 'claim'); };
            }

            // UPDATE EXISTING BUTTON (Don't destroy/recreate)
            let btn = container.querySelector('.claim-badge');

            // If button doesn't exist, create it
            if (!btn) {
                btn = document.createElement('div');
                btn.className = `claim-badge ${stateClass}`;
                btn.innerText = btnText;
                if (clickAction) btn.onclick = clickAction;
                container.appendChild(btn);
            }
            else {
                // If button exists, only update properties that changed
                if (btn.innerText !== btnText) btn.innerText = btnText;

                if (!btn.classList.contains(stateClass)) {
                    btn.className = `claim-badge ${stateClass}`;
                }

                if (clickAction) {
                    btn.onclick = clickAction;
                    btn.style.cursor = "pointer";
                } else {
                    btn.onclick = null;
                    btn.style.cursor = "default";
                }
            }
        });
    }

    // --- LOOPS ---
    setInterval(fetchClaims, DATA_SYNC_RATE);
    setInterval(enforceInterface, UI_CHECK_RATE);
    fetchClaims();

})();
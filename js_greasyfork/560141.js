// ==UserScript==
// @name         Torn City Universal Streak Tracker
// @namespace    PlethoraGaming
// @version      1.9
// @description  A minimalist, TCT-synchronized streak tracker. Works with Public Access API keys. Resets if inactive for 24h.
// @author       PlethoraGaming [2284368]
// @license      MIT
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/item.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560141/Torn%20City%20Universal%20Streak%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/560141/Torn%20City%20Universal%20Streak%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch the saved API key
    let apiKey = GM_getValue('torn_streak_api_key', '');

    // Initial setup for new users
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn Public Access API Key to begin tracking your streak:");
        if (apiKey) {
            GM_setValue('torn_streak_api_key', apiKey);
            // Streak starts the moment they provide a key
            GM_setValue('streakAnchor', new Date().toISOString());
            alert("API Key saved! Your streak starts today.");
        }
    }

    // Menu option to update key
    GM_registerMenuCommand("Update API Key", () => {
        let newKey = prompt("Enter new Public API Key:", GM_getValue('torn_streak_api_key', ''));
        if (newKey) {
            GM_setValue('torn_streak_api_key', newKey);
            location.reload();
        }
    });

    // Create the Top-Middle UI box
    const streakBox = document.createElement('div');
    streakBox.id = 'pg-streak-box';
    streakBox.style = `
        position: fixed; top: 0; left: 50%; transform: translateX(-50%);
        background: rgba(10, 10, 10, 0.9); color: #00ff00;
        padding: 3px 15px; border-radius: 0 0 6px 6px;
        border: 1px solid #444; border-top: none;
        font-family: "Courier New", monospace; font-size: 11px;
        z-index: 999999; pointer-events: none;
        box-shadow: 0 0 8px rgba(0,0,0,0.5);
    `;
    streakBox.innerHTML = 'SYNCING...';
    document.body.appendChild(streakBox);

    function checkStreak() {
        if (!apiKey) {
            streakBox.innerHTML = 'SET API KEY';
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=profile&key=${apiKey}`,
            headers: {
                "User-Agent": "TornUniversalStreakTracker",
                "Accept": "application/json"
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        streakBox.innerHTML = 'API ERROR';
                        return;
                    }

                    const now = new Date();
                    let anchorDateStr = GM_getValue('streakAnchor', now.toISOString());
                    let anchorDate = new Date(anchorDateStr);

                    // RESET LOGIC: Check last_action timestamp
                    const lastActionTCT = new Date(data.last_action.timestamp * 1000);
                    const hoursSinceActive = (now - lastActionTCT) / (1000 * 60 * 60);

                    // If more than 24 hours have passed since last activity, reset the anchor to now
                    if (hoursSinceActive > 24) {
                        anchorDate = now;
                        GM_setValue('streakAnchor', now.toISOString());
                        streakBox.style.color = "#ff4444"; // Visual indicator of reset
                    }

                    // Calculate days since anchor
                    const diffTime = Math.abs(now - anchorDate);
                    const currentStreak = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    // Birthday UI (Jan 8)
                    if (now.getUTCMonth() === 0 && now.getUTCDate() === 8) {
                        streakBox.style.background = "#d4af37";
                        streakBox.style.color = "#000";
                        streakBox.innerHTML = `🎂 HAPPY BIRTHDAY! STREAK: ${currentStreak} 🎂`;
                    } else {
                        streakBox.innerHTML = `STREAK: ${currentStreak} DAYS`;
                    }
                } catch (e) {
                    streakBox.innerHTML = 'OFFLINE';
                }
            }
        });
    }

    checkStreak();
})();

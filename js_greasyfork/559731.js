// ==UserScript==
// @name         SN's GLB Trains Remaining with suggested Slughead42 edits
// @namespace    Slughead42
// @description  Track career BT goals with a red warning before it's too late. THIS IS SEATTLE NINER'S CODE WITH JUST A FEW TWEAKS BY ME, PUBLISHING JUST SO PEOPLE CAN USE TO TEST IF THEY WANT. * Added number of Multi and Normal trains possible once a BT goal is entered.
// @version      3.1
// @match        https://glb.warriorgeneral.com/game/training.pl?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559731/SN%27s%20GLB%20Trains%20Remaining%20with%20suggested%20Slughead42%20edits.user.js
// @updateURL https://update.greasyfork.org/scripts/559731/SN%27s%20GLB%20Trains%20Remaining%20with%20suggested%20Slughead42%20edits.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const PLATEAU_AGE = 160;
    const DAYS_PER_SEASON = 40;
    const DAILY_TP = 4;
    const ROLLOVER_TP = 36;
    const EQ_COLOR = "#0000ff";

    const CAPS = [
        48.06, 60.51, 67.97, 73.24, 77.28, 80.53, 83.25, 85.58, 87.60,
        89.40, 91.01, 92.46, 93.79, 95.00, 96.13, 97.18, 98.15, 99.06, 99.99
    ];

    async function fetchData(pId, force = false) {
        const sessionKey = `glb_session_data_${pId}`;
        const cached = sessionStorage.getItem(sessionKey);
        if (cached && !force) return JSON.parse(cached);

        const response = await fetch('https://glb.warriorgeneral.com/game/home.pl');
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const sMatch = (doc.getElementById('season')?.innerText || "").match(/Season\s*(\d+),\s*Day\s*(-?\d+)/i);
        const playerLink = doc.querySelector(`a[href*="player_id=${pId}"]`);
        const row = playerLink ? playerLink.closest('tr') : null;
        const ageCells = row ? row.querySelectorAll('.list_lv') : [];

        const results = {
            day: sMatch ? parseInt(sMatch[2]) : 0,
            season: sMatch ? parseInt(sMatch[1]) : 0,
            age: ageCells.length > 1 ? parseInt(ageCells[1].innerText) : 0
        };
        sessionStorage.setItem(sessionKey, JSON.stringify(results));
        return results;
    }

    async function init(forceRefresh = false) {
        const pId = new URLSearchParams(window.location.search).get('player_id');
        const container = document.getElementById('training_settings');
        if (!pId || !container) return;

        const oldBar = document.getElementById('sn_bt_bar');
        if (oldBar) oldBar.remove();

        handleAttributeDisplay();

        const bar = document.createElement('div');
        bar.id = 'sn_bt_bar';
        bar.style = `background:#222; color:#fff; padding:4px 10px; margin-bottom:8px; border-radius:3px; font-weight:bold; font-size:11px; display:flex; justify-content:space-between; align-items:center; border: 1px solid #444; clear:both;`;
        bar.innerHTML = `<span>Syncing...</span>`;
        container.prepend(bar);

        try {
            const data = await fetchData(pId, forceRefresh);
            const bankedTP = parseInt(document.querySelector('#training_points_box .points')?.innerText || 0);
            const currentBT = parseInt(document.querySelector('a[href*="bonus_tokens.pl"]')?.innerText || 0);
            const goal = parseInt(localStorage.getItem(`glb_bt_goal_${pId}`) || 0);

            let futureTP = 0;
            let simAge = data.age;
            let currentDay = data.day;
            let trainDays = 160 - simAge;
            if (simAge > 159) {
                trainDays = 0;
            }

/*            // --- IMPROVED CAREER LOGIC ---
            // 1. Handle current season remaining days
            if (currentDay >= 1 && currentDay <= 40) {
                let daysLeft = 40 - currentDay;
                futureTP += (daysLeft * DAILY_TP);
                simAge += daysLeft;
                // If we finished the season, we move to the next season's rollover
                if (simAge < PLATEAU_AGE) futureTP += ROLLOVER_TP;
            }
            else if (currentDay > 40) {
                // Postseason: Age is capped at 40/80/120, but Rollover hasn't happened yet
                if (simAge < PLATEAU_AGE) futureTP += ROLLOVER_TP;
            }
            else if (currentDay <= 0) {
                // Preseason: D-4 has passed, Rollover TP is likely already in the bank
                // No immediate TP or Aging added; loop starts from Day 1 of next season
            }

            // 2. Loop for all subsequent full seasons
            while (simAge < (PLATEAU_AGE - 39)) { // Move in 40-day blocks
                futureTP += (DAYS_PER_SEASON * DAILY_TP);
                simAge += DAYS_PER_SEASON;
                if (simAge < PLATEAU_AGE) futureTP += ROLLOVER_TP;
            }
*/
            futureTP += trainDays * 4;
            futureTP += Math.floor(trainDays/40,0) * 36;
            if (currentDay < 1) {
                futureTP -= 36;
            }
            if (simAge !== 0 && simAge <160 ) {
                futureTP += 36;
            }

            const totalTrains = Math.floor((bankedTP + futureTP) / 2);
            const multBT = currentBT + Math.floor(totalTrains * 3);
            const normBT = currentBT + (totalTrains * 4);
            const maxBT = currentBT + (totalTrains * 6);
            const leftMT = Math.max(Math.floor(((maxBT - goal)/3)/4), 0);
            const leftNT = Math.max(Math.floor((maxBT - goal)/2),0);

            let bg = (maxBT < goal) ? "#000" : (maxBT < (goal + (goal * 0.1)) ? "#dc3545" : (normBT >= goal ? "#28a745" : "#ffc107"));
            if (goal === 0) bg = "#007bff";
            let displayInfo = totalTrains + " trains left, " + maxBT + " maximum BT on Light training.";
            let displayInfo2 = "Max trains still possible: " + leftMT + " Multi(4X) or " + leftNT + " Normal trains";
            let disclaimer = "DO NOT USE 'ENTER' key to set BT goal, it could cause unintended training! CLICK THE 'Set Goal' button instead.";
            if (goal === 0) {
                displayInfo2 = "Set a BT goal for this dot to see max normal and 4Xmulti trains possible.";
            }

            bar.style.background = bg;
            bar.style.color = (bg === "#ffc107") ? "#000" : "#fff";
            bar.innerHTML = `
                <span>${displayInfo}<br>${displayInfo2}<br>${disclaimer}</span>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button id="refresh_sn" type="button" style="height:30px; font-size:12px; cursor:pointer; background:#444; color:#fff; border:1px solid #666; border-radius:2px;">Refresh</button>
                    Goal: <input type="number" id="set_goal" value="${goal||''}" style="width:40px; height:20px; font-size:10px; border:none; padding:0 2px;">
                    <button id="save_bt" type="button" style="height:30px; font-size:12px; cursor:pointer; background:#eee; color:#000; border:none; border-radius:2px;">Set Goal</button>
                </div>
            `;

            document.getElementById('save_bt').onclick = () => {
                localStorage.setItem(`glb_bt_goal_${pId}`, document.getElementById('set_goal').value);
                window.location.reload();
            };
            document.getElementById('refresh_sn').onclick = () => init(true);

        } catch (e) { bar.innerHTML = "Sync Error."; }
    }

    function handleAttributeDisplay() {
        const statValueCells = document.querySelectorAll('.stat_value_tall, .stat_value_tall_boosted');
        statValueCells.forEach(cell => {
            const rawText = cell.innerText;
            const match = rawText.match(/([\d.]+)\s*\(\+(\d+)\)/);
            let baseNum, bonusText = "";
            if (match) {
                const total = parseFloat(match[1]);
                const bonus = parseInt(match[2]);
                baseNum = parseFloat((total - bonus).toFixed(2));
                bonusText = ` <span style="color:${EQ_COLOR}; font-weight:normal; font-size:10px; vertical-align:middle;">+${bonus}</span>`;
            } else { baseNum = parseFloat(rawText); }
            if (!isNaN(baseNum)) {
                let color = "inherit";
                for (let cap of CAPS) {
                    if (baseNum >= (cap - 2.0) && baseNum <= cap) { color = "#dc3545"; break; }
                }
                cell.style.color = color;
                cell.style.fontWeight = "bold";
                cell.innerHTML = `${baseNum.toFixed(2)}${bonusText}`;
            }
        });
    }

    init();
})();
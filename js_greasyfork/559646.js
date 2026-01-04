// ==UserScript==
// @name         SN's GLB Trains Remaining
// @namespace    SeattleNiner
// @description  Track career BT goals with a red warning before it's too late.
// @version      3.4
// @match        https://glb.warriorgeneral.com/game/training.pl?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559646/SN%27s%20GLB%20Trains%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/559646/SN%27s%20GLB%20Trains%20Remaining.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PLATEAU_AGE = 160;
    const TP_PER_DAY = 4;
    const TP_PER_TRAIN = 2;

    function init() {
        const playerId = new URLSearchParams(window.location.search).get('player_id');
        if (!playerId) return;

        const storageKey = `glb_bt_goal_${playerId}`;
        const currentBT = parseInt(document.querySelector('a[href*="bonus_tokens.pl"]')?.innerText || 0);
        const bankedTP = parseInt(document.querySelector('#training_points_box .points')?.innerText || 0);
        const currentAge = parseInt(document.body.innerText.match(/Age:\s*(\d+)/i)?.[1] || 0);

        if (currentAge > PLATEAU_AGE) return;

        // --- MATH: Future Earnings ---
        const daysLeft = PLATEAU_AGE - currentAge;
        let futureTP = daysLeft * TP_PER_DAY;

        // Add the final 36 TP award only if the player hasn't reached Age 160 yet.
        // Once they are Age 160, they are in the final season and have already received it.
        if (currentAge < 160) {
            futureTP += 36;
        }

        const trainsLeft = Math.floor((bankedTP + futureTP) / TP_PER_TRAIN);
        const minBT = currentBT + (trainsLeft * 2);
        const maxBT = currentBT + (trainsLeft * 6);
        let goal = localStorage.getItem(storageKey) || 0;

        // --- UI STYLE ---
        let bg = "#007bff"; // Default Blue
        let warn = "";
        if (goal > 0) {
            if (maxBT < goal) { bg = "#000"; warn = " (FAIL)"; }
            else if (maxBT < (parseFloat(goal) + (goal * 0.1))) { bg = "#dc3545"; warn = " (DANGER)"; }
            else if (minBT >= goal) { bg = "#28a745"; warn = " (SAFE)"; }
            else { bg = "#ffc107"; } // Yellow
        }

        const container = document.getElementById('training_settings');
        if (!container) return;

        const bar = document.createElement('div');
        bar.style = `background:${bg}; color:${bg==="#ffc107"?"#000":"#fff"}; padding:3px 10px; margin-bottom:5px; border-radius:3px; font-weight:bold; font-size:11px; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(0,0,0,0.1);`;

        bar.innerHTML = `
            <span>${trainsLeft} trains left <span style="font-weight:normal; opacity:0.8;">(${minBT}-${maxBT} BT)${warn}</span></span>
            <span>Goal: <input type="number" id="bt_g" value="${goal}" style="width:45px; border:none; border-radius:2px; padding:0 3px; height:16px; font-size:10px;"> <button id="bt_s" style="height:16px; font-size:9px; cursor:pointer;">Set</button></span>
        `;

        container.prepend(bar);

        document.getElementById('bt_s').onclick = (e) => {
            e.preventDefault();
            localStorage.setItem(storageKey, document.getElementById('bt_g').value);
            window.location.reload();
        };
    }

    window.addEventListener('load', init);
    if (document.readyState === 'complete') init();
})();
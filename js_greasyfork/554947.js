// ==UserScript==
// @name         Papanad 2 Stat Boxes (v2 API)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Display battle and working stats in separate boxes using v2 API for working stats
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554947/Papanad%202%20Stat%20Boxes%20%28v2%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554947/Papanad%202%20Stat%20Boxes%20%28v2%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - replace YOUR_API_KEY with your actual Torn API key
    const API_KEY = 'TORJQEK2eDQljrt3';

    // Create the battle stats box
    const battleStatsBox = document.createElement('div');
    battleStatsBox.id = 'torn-battle-stats-box';
    battleStatsBox.style.position = 'fixed';
    battleStatsBox.style.top = '10px';
    battleStatsBox.style.left = '10px';
    battleStatsBox.style.backgroundColor = 'rgba(120, 0, 0, 0.85)';
    battleStatsBox.style.color = '#39FF14';
    battleStatsBox.style.padding = '12px';
    battleStatsBox.style.borderRadius = '5px';
    battleStatsBox.style.zIndex = '9999';
    battleStatsBox.style.fontFamily = 'monospace, Arial, sans-serif';
    battleStatsBox.style.fontSize = '13px';
    battleStatsBox.style.boxShadow = '0 0 15px #ff0000, inset 0 0 10px #ff0000';
    battleStatsBox.style.border = '1px solid #ff3333';
    battleStatsBox.style.minWidth = '160px';
    battleStatsBox.style.textShadow = '0 0 5px #39ff14';
    battleStatsBox.innerHTML = '<div style="text-align: center; font-weight: bold; margin-bottom: 6px; text-shadow: 0 0 8px #39ff14; letter-spacing: 1px;">BATTLE STATS</div><div style="text-align: center;">LOADING...</div>';
    document.body.appendChild(battleStatsBox);

    // Create the working stats box (positioned to the right of battle stats)
    const workingStatsBox = document.createElement('div');
    workingStatsBox.id = 'torn-working-stats-box';
    workingStatsBox.style.position = 'fixed';
    workingStatsBox.style.top = '155px';
    workingStatsBox.style.left = '10px'; // Positioned to the right of battle stats box
    workingStatsBox.style.backgroundColor = 'rgba(0, 0, 120, 0.85)';
    workingStatsBox.style.color = '#39FF14';
    workingStatsBox.style.padding = '12px';
    workingStatsBox.style.borderRadius = '5px';
    workingStatsBox.style.zIndex = '9999';
    workingStatsBox.style.fontFamily = 'monospace, Arial, sans-serif';
    workingStatsBox.style.fontSize = '13px';
    workingStatsBox.style.boxShadow = '0 0 15px #00ffff, inset 0 0 10px #00ffff';
    workingStatsBox.style.border = '1px solid #33ffff';
    workingStatsBox.style.minWidth = '160px';
    workingStatsBox.style.textShadow = '0 0 5px #39ff14';
    workingStatsBox.innerHTML = '<div style="text-align: center; font-weight: bold; margin-bottom: 6px; text-shadow: 0 0 8px #39ff14; letter-spacing: 1px;">WORKING STATS</div><div style="text-align: center;">LOADING...</div>';
    document.body.appendChild(workingStatsBox);

    // Function to handle API errors
    function handleApiError(error, section, isWorkingStats = false) {
        console.error(`API error in ${section}:`, error);
        const box = isWorkingStats ? workingStatsBox : battleStatsBox;
        box.innerHTML = `<div style="text-align: center; font-weight: bold; margin-bottom: 6px; text-shadow: 0 0 8px #39ff14; letter-spacing: 1px;">${isWorkingStats ? 'WORKING STATS' : 'BATTLE STATS'}</div>
                         <div style="color: #ff6666; text-shadow: 0 0 8px #ff0000; text-align: center;">${section.toUpperCase()} ERROR</div>`;
    }

    // Fetch battle stats using v1 API
    fetch(`https://api.torn.com/user/?selections=personalstats&key=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error(`Battle stats API request failed with status ${response.status}`);
            return response.json();
        })
        .then(battleData => {
            if (battleData.error) {
                handleApiError(new Error(battleData.error.error), 'battle stats');
                return;
            }

            // Extract battle stats
            const strength = battleData.personalstats.strength || 0;
            const defense = battleData.personalstats.defense || 0;
            const speed = battleData.personalstats.speed || 0;
            const dexterity = battleData.personalstats.dexterity || 0;
            const battleTotal = strength + defense + speed + dexterity;

            // Build battle stats display
            let battleHTML = `
                <div style="text-align: center; font-weight: bold; margin-bottom: 6px; text-shadow: 0 0 8px #39ff14; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 3px;">BATTLE STATS</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; text-shadow: 0 0 4px #39ff14;">
                    <span>STRENGTH:</span>
                    <span style="font-weight: bold; font-family: monospace;">${strength.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; text-shadow: 0 0 4px #39ff14;">
                    <span>DEFENSE:</span>
                    <span style="font-weight: bold; font-family: monospace;">${defense.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; text-shadow: 0 0 4px #39ff14;">
                    <span>SPEED:</span>
                    <span style="font-weight: bold; font-family: monospace;">${speed.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; text-shadow: 0 0 4px #39ff14;">
                    <span>DEXTERITY:</span>
                    <span style="font-weight: bold; font-family: monospace;">${dexterity.toLocaleString()}</span>
                </div>
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); margin: 5px 0;"></div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; text-shadow: 0 0 6px #ff6666;">
                    <span>TOTAL:</span>
                    <span style="font-family: monospace; text-shadow: 0 0 6px #ff6666;">${battleTotal.toLocaleString()}</span>
                </div>
            `;

            battleStatsBox.innerHTML = battleHTML;
        })
        .catch(error => {
            handleApiError(error, 'battle stats');
        });

    // Fetch working stats using v2 API
    fetch(`https://api.torn.com/v2/user/workstats?key=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw new Error(`Working stats API request failed with status ${response.status}`);
            return response.json();
        })
        .then(workingData => {
            if (workingData.error) {
                handleApiError(new Error(workingData.error.error), 'working stats', true);
                return;
            }

            // Extract working stats
            const manualLabor = workingData.workstats.manual_labor || 0;
            const intelligence = workingData.workstats.intelligence || 0;
            const endurance = workingData.workstats.endurance || 0;
            const workingTotal = manualLabor + intelligence + endurance;

            // Build working stats display
            let workingHTML = `
                <div style="text-align: center; font-weight: bold; margin-bottom: 6px; text-shadow: 0 0 8px #39ff14; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 3px;">WORKING STATS</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; text-shadow: 0 0 4px #39ff14;">
                    <span>MANUAL LABOR:</span>
                    <span style="font-weight: bold; font-family: monospace;">${manualLabor.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; text-shadow: 0 0 4px #39ff14;">
                    <span>INTELLIGENCE:</span>
                    <span style="font-weight: bold; font-family: monospace;">${intelligence.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; text-shadow: 0 0 4px #39ff14;">
                    <span>ENDURANCE:</span>
                    <span style="font-weight: bold; font-family: monospace;">${endurance.toLocaleString()}</span>
                </div>
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); margin: 5px 0;"></div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; text-shadow: 0 0 6px #ff6666;">
                    <span>TOTAL:</span>
                    <span style="font-family: monospace; text-shadow: 0 0 6px #ff6666;">${workingTotal.toLocaleString()}</span>
                </div>
            `;

            workingStatsBox.innerHTML = workingHTML;
        })
        .catch(error => {
            handleApiError(error, 'working stats', true);
        });
})();
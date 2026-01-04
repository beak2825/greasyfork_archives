// ==UserScript==
// @name         Energy To Burn
// @namespace    TornScripts.EnergyBurn
// @license      GPL-3.0
// @version      1.0.1
// @description  Calculate optimal energy to burn before Xanax cooldown is ready
// @author       ButtChew [3840391]
// @icon         https://www.torn.com/favicon.ico
// @homepageURL  https://greasyfork.org/en/scripts/555959-energy-to-burn
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555959/Energy%20To%20Burn.user.js
// @updateURL https://update.greasyfork.org/scripts/555959/Energy%20To%20Burn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== SETTINGS ==========
    const SETTINGS = {
        apiKey: GM_getValue('tornApiKey', ''),
        gymEnergyCost: GM_getValue('gymEnergyCost', 10)
    };

    // Register Tampermonkey menu commands
    GM_registerMenuCommand('⚙️ Energy Burn Settings', openSettingsModal);

    // ========== UTILITY FUNCTIONS ==========
    function formatTime(seconds) {
        if (seconds <= 0) return 'Ready!';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    // ========== API FUNCTIONS ==========
    function fetchTornAPI(endpoint, callback) {
        const apiKey = GM_getValue('tornApiKey', '');

        if (!apiKey) {
            showError('API Key not set. Please configure in Tampermonkey menu: Energy Burn Settings');
            return;
        }

        const url = `https://api.torn.com/v2/user/${endpoint}?key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            showError(`API Error: ${data.error.error}`);
                        } else {
                            callback(data);
                        }
                    } catch (e) {
                        showError('Failed to parse API response');
                    }
                } else {
                    showError(`API request failed: ${response.status}`);
                }
            },
            onerror: function() {
                showError('Network error while fetching API data');
            }
        });
    }

    // ========== CALCULATION LOGIC ==========
    function calculateEnergyBurn(energyData, cooldownData) {
        const currentEnergy = energyData.bars.energy.current;
        const maxEnergy = energyData.bars.energy.maximum;
        const energyIncrement = energyData.bars.energy.increment;
        const energyInterval = energyData.bars.energy.interval;
        const energyFullTime = energyData.bars.energy.full_time;
        const energyTickTime = energyData.bars.energy.tick_time;

        const xanaxCooldown = cooldownData.cooldowns.drug;
        const gymEnergyCost = GM_getValue('gymEnergyCost', 10);

        // If Xanax is ready or will be ready before energy is full
        if (xanaxCooldown <= energyFullTime) {
            return {
                currentEnergy: currentEnergy,
                maxEnergy: maxEnergy,
                energyFullTime: energyFullTime,
                xanaxCooldown: xanaxCooldown,
                energyToBurn: 0,
                actionsToDo: 0,
                actualBurn: 0,
                gymEnergyCost: gymEnergyCost,
                message: 'No energy burn needed! Xanax will be ready before or when energy is full.'
            };
        }

        // Calculate optimal energy to burn
        const optimalEnergyToBurn = (xanaxCooldown * energyIncrement / energyInterval) + currentEnergy - maxEnergy;

        // Round down to gym increment (never over-burn)
        const actionsToDo = Math.floor(optimalEnergyToBurn / gymEnergyCost);
        const actualBurn = actionsToDo * gymEnergyCost;

        // Check if user has enough energy to burn right now
        const canBurnNow = currentEnergy >= actualBurn;

        // Calculate time until user has enough energy to burn
        let timeUntilCanBurn = 0;
        if (!canBurnNow && actualBurn > 0) {
            const energyNeededToBurn = actualBurn - currentEnergy;
            const ticksNeededToBurn = Math.ceil(energyNeededToBurn / energyIncrement);
            // First tick happens at tick_time, remaining ticks at interval
            timeUntilCanBurn = energyTickTime + ((ticksNeededToBurn - 1) * energyInterval);
        }

        // Calculate new full time after burning
        // If can't burn now, assume we burn at 0 (after waiting to regenerate the needed amount)
        const newEnergy = canBurnNow ? currentEnergy - actualBurn : 0;
        const energyNeeded = maxEnergy - newEnergy;
        const ticksNeeded = Math.ceil(energyNeeded / energyIncrement);
        const newFullTime = canBurnNow ? ticksNeeded * energyInterval : (timeUntilCanBurn + ticksNeeded * energyInterval);

        return {
            currentEnergy: currentEnergy,
            maxEnergy: maxEnergy,
            energyFullTime: energyFullTime,
            xanaxCooldown: xanaxCooldown,
            energyToBurn: optimalEnergyToBurn,
            actionsToDo: actionsToDo,
            actualBurn: actualBurn,
            newEnergy: newEnergy,
            newFullTime: newFullTime,
            gymEnergyCost: gymEnergyCost,
            timeDifference: Math.abs(newFullTime - xanaxCooldown),
            canBurnNow: canBurnNow,
            timeUntilCanBurn: timeUntilCanBurn,
            message: null
        };
    }

    // ========== UI FUNCTIONS ==========
    function addSidebarLink() {
        // Wait for sidebar to load
        const checkSidebar = setInterval(() => {
            const areasSection = document.querySelector('.areas___ElnyB .toggle-content___BJ9Q9');
            if (areasSection && !document.getElementById('nav-energy_burn')) {
                clearInterval(checkSidebar);

                // Create the energy burn link
                const energyBurnDiv = document.createElement('div');
                energyBurnDiv.className = 'area-desktop___bpqAS';
                energyBurnDiv.id = 'nav-energy_burn';
                energyBurnDiv.innerHTML = `
                    <div class="area-row___iBD8N">
                        <a href="#" class="desktopLink___SG2RU" id="energy-burn-link">
                            <span class="svgIconWrap___AMIqR">
                                <span class="defaultIcon___iiNis mobile___paLva">
                                    <svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" stroke-width="0" width="16" height="20" viewBox="0 0 16 20">
                                        <path d="M8.5,0L0,10h6l-2,10l10-12H8L8.5,0z" fill="url(#sidebar_svg_gradient_regular_desktop)"/>
                                    </svg>
                                </span>
                            </span>
                            <span class="linkName___FoKha">Energy Burn</span>
                        </a>
                    </div>
                `;

                // Insert after Gym (or at end of areas)
                const gymNav = document.getElementById('nav-gym');
                if (gymNav && gymNav.nextSibling) {
                    areasSection.insertBefore(energyBurnDiv, gymNav.nextSibling);
                } else {
                    areasSection.appendChild(energyBurnDiv);
                }

                // Add click handler
                document.getElementById('energy-burn-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    openEnergyBurnModal();
                });
            }
        }, 500);

        // Clear interval after 10 seconds if sidebar not found
        setTimeout(() => clearInterval(checkSidebar), 10000);
    }

    function openEnergyBurnModal() {
        // Check if API key is set
        if (!GM_getValue('tornApiKey', '')) {
            if (confirm('API Key not configured. Would you like to set it up now?')) {
                openSettingsModal();
            }
            return;
        }

        // Create modal overlay
        if (document.getElementById('energy-burn-modal')) {
            document.getElementById('energy-burn-modal').remove();
        }

        const modal = document.createElement('div');
        modal.id = 'energy-burn-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        modal.innerHTML = `
            <div style="
                background: #2e2e2e;
                border-radius: 10px;
                width: 500px;
                max-width: 90%;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                <div style="
                    background: linear-gradient(to bottom, #1a1a1a, #2a2a2a);
                    padding: 15px 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0; color: #fff; font-size: 18px;">⚡ Energy To Burn</h2>
                    <button id="close-energy-modal" style="
                        background: none;
                        border: none;
                        color: #aaa;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    ">×</button>
                </div>
                <div style="
                    padding: 20px;
                    color: #ccc;
                ">
                    <div id="energy-burn-content" style="text-align: center; padding: 20px;">
                        <p style="color: #aaa;">Loading data...</p>
                        <div style="
                            border: 3px solid #f3f3f3;
                            border-radius: 50%;
                            border-top: 3px solid #3498db;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin: 20px auto;
                        "></div>
                    </div>
                    <div style="margin-top: 15px; text-align: center;">
                        <button id="refresh-energy-data" class="torn-btn" style="
                            background: linear-gradient(to bottom, #799427, #a3c248);
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            margin-right: 10px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            vertical-align: middle;
                        ">🔄 Refresh</button>
                        <button id="open-settings-btn" class="torn-btn" style="
                            background: linear-gradient(to bottom, #555, #777);
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            vertical-align: middle;
                        ">⚙️ Settings</button>
                    </div>
                </div>
            </div>
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('close-energy-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('refresh-energy-data').addEventListener('click', () => {
            loadEnergyData();
        });

        document.getElementById('open-settings-btn').addEventListener('click', () => {
            openSettingsModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Load data
        loadEnergyData();
    }

    function loadEnergyData() {
        const contentDiv = document.getElementById('energy-burn-content');
        contentDiv.innerHTML = `
            <p style="color: #aaa;">Fetching energy data...</p>
            <div style="
                border: 3px solid #f3f3f3;
                border-radius: 50%;
                border-top: 3px solid #3498db;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
            "></div>
        `;

        // Fetch both APIs
        let energyData = null;
        let cooldownData = null;

        fetchTornAPI('bars', (data) => {
            energyData = data;
            checkAndDisplay();
        });

        fetchTornAPI('cooldowns', (data) => {
            cooldownData = data;
            checkAndDisplay();
        });

        function checkAndDisplay() {
            if (energyData && cooldownData) {
                displayResults(energyData, cooldownData);
            }
        }
    }

    function displayResults(energyData, cooldownData) {
        const result = calculateEnergyBurn(energyData, cooldownData);
        const contentDiv = document.getElementById('energy-burn-content');

        if (result.message) {
            // No burn needed
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <p style="font-size: 16px; color: #90EE90; font-weight: bold;">${result.message}</p>
                    <hr style="border: 1px solid #444; margin: 20px 0;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;">
                        <div>
                            <p style="color: #aaa; margin: 5px 0;">Current Energy:</p>
                            <p style="color: #fff; font-size: 18px; font-weight: bold; margin: 5px 0;">${result.currentEnergy} / ${result.maxEnergy}</p>
                        </div>
                        <div>
                            <p style="color: #aaa; margin: 5px 0;">Energy Full In:</p>
                            <p style="color: #fff; font-size: 18px; font-weight: bold; margin: 5px 0;">${formatTime(result.energyFullTime)}</p>
                        </div>
                        <div>
                            <p style="color: #aaa; margin: 5px 0;">Xanax Ready In:</p>
                            <p style="color: #fff; font-size: 18px; font-weight: bold; margin: 5px 0;">${formatTime(result.xanaxCooldown)}</p>
                        </div>
                        <div>
                            <p style="color: #aaa; margin: 5px 0;">Gym Energy Cost:</p>
                            <p style="color: #fff; font-size: 18px; font-weight: bold; margin: 5px 0;">${result.gymEnergyCost}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Burn needed
            const earlyLate = result.newFullTime > result.xanaxCooldown ?
                `<span style="color: #FFB84D;">${formatTime(result.timeDifference)} after Xanax ready</span>` :
                `<span style="color: #90EE90;">${formatTime(result.timeDifference)} before Xanax ready</span>`;

            contentDiv.innerHTML = `
                <div style="padding: 10px;">
                    <div style="background: rgba(255, 107, 62, 0.2); border-left: 4px solid #EF6B3E; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                        <div style="font-size: 14px; color: #aaa; margin-bottom: 5px;">RECOMMENDED ACTION</div>
                        <div style="font-size: 24px; color: #EF6B3E; font-weight: bold;">
                            Burn ${formatNumber(result.actualBurn)} Energy
                        </div>
                        <div style="font-size: 14px; color: #ccc; margin-top: 5px;">
                            = ${result.actionsToDo} Gym Train${result.actionsToDo !== 1 ? 's' : ''} @ ${result.gymEnergyCost} energy each
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <p style="color: #aaa; font-size: 12px; margin: 0 0 5px 0;">CURRENT ENERGY</p>
                            <p style="color: #fff; font-size: 20px; font-weight: bold; margin: 0;">${result.currentEnergy} / ${result.maxEnergy}</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <p style="color: #aaa; font-size: 12px; margin: 0 0 5px 0;">ENERGY FULL IN</p>
                            <p style="color: #FFB84D; font-size: 20px; font-weight: bold; margin: 0;">${formatTime(result.energyFullTime)}</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <p style="color: #aaa; font-size: 12px; margin: 0 0 5px 0;">XANAX READY IN</p>
                            <p style="color: #90EE90; font-size: 20px; font-weight: bold; margin: 0;">${formatTime(result.xanaxCooldown)}</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <p style="color: #aaa; font-size: 12px; margin: 0 0 5px 0;">CAN BURN IN</p>
                            <p style="color: ${result.canBurnNow ? '#90EE90' : '#FFB84D'}; font-size: 20px; font-weight: bold; margin: 0;">
                                ${result.canBurnNow ? 'READY!' : formatTime(result.timeUntilCanBurn)}
                            </p>
                        </div>
                    </div>

                    <hr style="border: 1px solid #444; margin: 15px 0;">

                    <div style="background: rgba(144, 238, 144, 0.1); padding: 15px; border-radius: 5px; border-left: 4px solid #90EE90;">
                        <p style="color: #aaa; font-size: 12px; margin: 0 0 10px 0;">AFTER BURNING ${formatNumber(result.actualBurn)} ENERGY:</p>
                        <p style="color: #fff; margin: 5px 0;">Energy Full In: <strong>${formatTime(result.newFullTime)}</strong></p>
                        <p style="color: #ccc; margin: 5px 0; font-size: 13px;">Energy reaches full ${earlyLate}</p>
                    </div>

                    ${result.actualBurn < result.energyToBurn ? `
                        <div style="background: rgba(255, 184, 77, 0.1); padding: 10px; margin-top: 10px; border-radius: 5px; font-size: 12px; color: #FFB84D;">
                            ℹ️ Note: Optimal burn is ${result.energyToBurn.toFixed(1)} energy, but we round down to ${result.actualBurn} to ensure energy is full when Xanax is ready.
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }

    function showError(message) {
        const contentDiv = document.getElementById('energy-burn-content');
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; color: #EF6B3E; margin-bottom: 10px;">⚠️</div>
                    <p style="color: #EF6B3E; font-size: 16px; font-weight: bold;">Error</p>
                    <p style="color: #ccc; margin-top: 10px;">${message}</p>
                </div>
            `;
        } else {
            alert('Energy Burn Error: ' + message);
        }
    }

    function openSettingsModal() {
        const currentApiKey = GM_getValue('tornApiKey', '');
        const currentGymCost = GM_getValue('gymEnergyCost', 10);

        const settingsModal = document.createElement('div');
        settingsModal.id = 'energy-settings-modal';
        settingsModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        settingsModal.innerHTML = `
            <div style="
                background: #2e2e2e;
                border-radius: 10px;
                width: 450px;
                max-width: 90%;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                <div style="
                    background: linear-gradient(to bottom, #1a1a1a, #2a2a2a);
                    padding: 15px 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0; color: #fff; font-size: 18px;">⚙️ Energy Burn Settings</h2>
                    <button id="close-settings-modal" style="
                        background: none;
                        border: none;
                        color: #aaa;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    ">×</button>
                </div>
                <div style="padding: 20px; color: #ccc;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 14px;">
                            Torn API Key:
                        </label>
                        <input type="text" id="api-key-input" value="${currentApiKey}" placeholder="Enter your Torn API key" style="
                            width: 100%;
                            padding: 10px;
                            background: #1a1a1a;
                            border: 1px solid #444;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                        <p style="font-size: 12px; color: #888; margin-top: 5px;">
                            Requires "Minimal" API key or higher.
                        </p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 14px;">
                            Gym Energy Cost per Train:
                        </label>
                        <input type="number" id="gym-energy-input" value="${currentGymCost}" min="1" max="100" style="
                            width: 100%;
                            padding: 10px;
                            background: #1a1a1a;
                            border: 1px solid #444;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                        <p style="font-size: 12px; color: #888; margin-top: 5px;">
                            Common values: 10 (basic gyms), 20, 50 (advanced gyms)
                        </p>
                    </div>

                    <div style="text-align: right;">
                        <button id="cancel-settings" style="
                            background: linear-gradient(to bottom, #555, #777);
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            margin-right: 10px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            vertical-align: middle;
                        ">Cancel</button>
                        <button id="save-settings" style="
                            background: linear-gradient(to bottom, #799427, #a3c248);
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            vertical-align: middle;
                        ">Save Settings</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(settingsModal);

        // Event listeners
        document.getElementById('close-settings-modal').addEventListener('click', () => {
            settingsModal.remove();
        });

        document.getElementById('cancel-settings').addEventListener('click', () => {
            settingsModal.remove();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            const apiKey = document.getElementById('api-key-input').value.trim();
            const gymCost = parseInt(document.getElementById('gym-energy-input').value);

            if (!apiKey) {
                alert('Please enter a valid API key');
                return;
            }

            if (gymCost < 1 || gymCost > 100) {
                alert('Gym energy cost must be between 1 and 100');
                return;
            }

            GM_setValue('tornApiKey', apiKey);
            GM_setValue('gymEnergyCost', gymCost);

            alert('Settings saved successfully!');
            settingsModal.remove();

            // Refresh data if main modal is open
            if (document.getElementById('energy-burn-modal')) {
                loadEnergyData();
            }
        });

        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.remove();
            }
        });
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Wait for page to fully load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addSidebarLink);
        } else {
            addSidebarLink();
        }
    }

    init();
})();

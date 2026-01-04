// ==UserScript==
// @name         Torn Pickpocket Module Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhanced pickpocketing with advanced risk assessment, color coding and auto-picker - Framework Module
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at document-end
// @license MIT (With recognition)
// @downloadURL https://update.greasyfork.org/scripts/550551/Torn%20Pickpocket%20Module%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/550551/Torn%20Pickpocket%20Module%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use unsafeWindow to match framework
    const globalWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    console.log('[PICKPOCKET] Enhanced Module starting...');

    // ENHANCED RISK ASSESSMENT CONFIG
    const riskFactors = {
        targets: {
            // Very High Risk
            "Police officer": 100,
            // High Risk
            "Thug": 80,
            "Gang member": 85,
            "Mobster": 90,
            // Medium-High Risk
            "Laborer": 60,
            "Cyclist": 65,
            "Jogger": 55,
            // Medium Risk
            "Businessman": 45,
            "Businesswoman": 45,
            "Young man": 40,
            "Rich kid": 50,
            // Low-Medium Risk
            "Young woman": 30,
            "Student": 35,
            "Classy lady": 40,
            "Postal worker": 35,
            "Sex worker": 45,
            // Low Risk
            "Elderly man": 15,
            "Elderly woman": 10,
            "Drunk man": 5,
            "Drunk woman": 5,
            "Homeless person": 5,
            "Junkie": 8
        },
        activities: {
            // High Risk Activities
            "Running": 25,
            "Alert": 30,
            "Chasing": 35,
            // Medium Risk
            "Walking": 10,
            "Jogging": 15,
            "Cycling": 20,
            "On Phone": 5,
            // Low Risk
            "Stumbling": -15,
            "Begging": -10,
            "Distracted": -12,
            "Loitering": -8,
            "Listening to music": -5,
            "Soliciting": 0
        },
        builds: {
            "Muscular": 20,
            "Athletic": 15,
            "Average": 5,
            "Heavyset": 8,
            "Skinny": -5
        }
    };

    // Enhanced color coding based on total risk score
    const riskColorMap = {
        "Minimal": "#26de81",    // Green - 0-20
        "Low": "#51cf66",        // Light Green - 21-40
        "Moderate": "#74b816",   // Yellow-Green - 41-60
        "High": "#ffa502",       // Orange - 61-80
        "Dangerous": "#f76707",  // Red-Orange - 81-100
        "Extreme": "#f03e3e"     // Red - 100+
    };

    // Legacy category mapping for backwards compatibility
    const markGroups = {
        "Safe": ["Drunk man", "Drunk woman", "Homeless person", "Junkie", "Elderly man", "Elderly woman"],
        "Moderately Unsafe": ["Classy lady", "Laborer", "Postal worker", "Young man", "Young woman", "Student"],
        "Unsafe": ["Rich kid", "Sex worker", "Thug"],
        "Risky": ["Jogger", "Businessman", "Businesswoman", "Gang member", "Mobster"],
        "Dangerous": ["Cyclist"],
        "Very Dangerous": ["Police officer"],
    };

    const activityTypes = ["Walking", "Stumbling", "Loitering", "Listening to music", "Distracted", "Soliciting", "Running", "Jogging"];

    // Settings
    let ppSettings = {
        coloringEnabled: GM_getValue('ppColoringEnabled', true),
        enhancedRiskMode: GM_getValue('ppEnhancedRiskMode', true),
        showRiskScores: GM_getValue('ppShowRiskScores', true),
        autoPickerEnabled: GM_getValue('ppAutoPickerEnabled', false),
        targetCategories: GM_getValue('ppTargetCategories', ["Safe"]),
        targetActivities: GM_getValue('ppTargetActivities', ["Stumbling"]),
        maxRiskScore: GM_getValue('ppMaxRiskScore', 40),
        autoPickDelay: GM_getValue('ppAutoPickDelay', 3000),
        maxNerve: GM_getValue('ppMaxNerve', 5),
        randomDelay: GM_getValue('ppRandomDelay', true),
        maxActions: GM_getValue('ppMaxActions', 50),
        safetyMode: GM_getValue('ppSafetyMode', true),
        avoidHighRisk: GM_getValue('ppAvoidHighRisk', true)
    };

    // State
    let processedTargets = new Set();
    let autoPickerInterval = null;
    let actionCount = 0;
    let sessionStart = Date.now();

    function saveSettings() {
        Object.keys(ppSettings).forEach(key => {
            GM_setValue(`pp${key.charAt(0).toUpperCase() + key.slice(1)}`, ppSettings[key]);
        });
    }

    function log(msg, type = 'info') {
        if (globalWindow.TornFramework && globalWindow.TornFramework.log) {
            globalWindow.TornFramework.log(msg, type, 'PICKPOCKET');
        } else {
            console.log(`[PICKPOCKET] ${msg}`);
        }
    }

    // Enhanced risk calculation
    function calculateRiskScore(targetName, activity, physical) {
        let score = 0;

        // Base target risk
        const targetRisk = riskFactors.targets[targetName] || 25;
        score += targetRisk;

        // Activity modifier
        const activityWords = Object.keys(riskFactors.activities);
        for (const activityWord of activityWords) {
            if (activity.toLowerCase().includes(activityWord.toLowerCase())) {
                score += riskFactors.activities[activityWord];
                break;
            }
        }

        // Physical build modifier
        const buildWords = Object.keys(riskFactors.builds);
        for (const buildWord of buildWords) {
            if (physical.toLowerCase().includes(buildWord.toLowerCase())) {
                score += riskFactors.builds[buildWord];
                break;
            }
        }

        return Math.max(0, score);
    }

    function getRiskCategory(score) {
        if (score <= 20) return "Minimal";
        if (score <= 40) return "Low";
        if (score <= 60) return "Moderate";
        if (score <= 80) return "High";
        if (score <= 100) return "Dangerous";
        return "Extreme";
    }

    function getLegacyCategory(targetName) {
        for (const category in markGroups) {
            if (markGroups[category].includes(targetName)) {
                return category;
            }
        }
        return "Unknown";
    }

    function extractTargetInfo(crimeOption) {
        try {
            const titleElement = crimeOption.querySelector('.titleAndProps___DdeVu > div');
            const activityElement = crimeOption.querySelector('.activity___e7mdA');
            const physicalElement = crimeOption.querySelector('.physicalProps___E5YrR span[aria-hidden="true"]');

            const name = titleElement ? titleElement.textContent.trim().split(' (')[0] : '';
            let activity = '';
            let physical = '';

            if (activityElement) {
                const activityText = activityElement.childNodes[0];
                activity = activityText ? activityText.textContent.trim() : '';
            }

            if (physicalElement) {
                physical = physicalElement.textContent.trim();
            }

            return { name, activity, physical };
        } catch (error) {
            return { name: '', activity: '', physical: '' };
        }
    }

    function addRandomDelay(baseDelay) {
        if (!ppSettings.randomDelay) return baseDelay;
        const variance = baseDelay * 0.3;
        return baseDelay + (Math.random() * variance * 2 - variance);
    }

    function isRateLimited() {
        if (!ppSettings.safetyMode) return false;
        if (actionCount >= ppSettings.maxActions) {
            return true;
        }
        return false;
    }

    function processCurrentTargets() {
        if (!ppSettings.coloringEnabled) return;

        try {
            const crimeOptions = document.querySelectorAll('.crime-option, .crimeOptionWrapper___IOnLO');

            crimeOptions.forEach((option) => {
                const titleElement = option.querySelector('.titleAndProps___DdeVu > div');
                if (!titleElement) return;

                const targetInfo = extractTargetInfo(option);
                if (!targetInfo.name) return;

                let displayText = targetInfo.name;
                let color = '#ffffff';

                if (ppSettings.enhancedRiskMode && targetInfo.activity && targetInfo.physical) {
                    // Enhanced risk assessment mode
                    const riskScore = calculateRiskScore(targetInfo.name, targetInfo.activity, targetInfo.physical);
                    const riskCategory = getRiskCategory(riskScore);
                    color = riskColorMap[riskCategory];

                    if (ppSettings.showRiskScores) {
                        displayText = `${targetInfo.name} (${riskCategory} - ${riskScore})`;
                    } else {
                        displayText = `${targetInfo.name} (${riskCategory})`;
                    }

                    // Add risk indicator dot
                    const existing = option.querySelector('.risk-indicator');
                    if (existing) existing.remove();

                    const indicator = document.createElement('div');
                    indicator.className = 'risk-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: ${color};
                        border: 1px solid rgba(255,255,255,0.5);
                        box-shadow: 0 0 4px rgba(0,0,0,0.3);
                        z-index: 10;
                    `;
                    indicator.title = `Risk: ${riskCategory} (${riskScore})`;

                    const wrapper = option.querySelector('.crimeOptionWrapper___IOnLO') || option;
                    if (wrapper) {
                        wrapper.style.position = 'relative';
                        wrapper.appendChild(indicator);
                    }

                } else {
                    // Legacy category mode
                    const legacyCategory = getLegacyCategory(targetInfo.name);
                    if (legacyCategory !== "Unknown") {
                        color = riskColorMap.Moderate; // Default color for legacy mode
                        displayText = `${targetInfo.name} (${legacyCategory})`;
                    }
                }

                // Apply styling
                titleElement.style.color = color;
                titleElement.style.fontWeight = 'bold';
                titleElement.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';

                if (!titleElement.textContent.includes('(')) {
                    titleElement.textContent = displayText;
                }
            });
        } catch (error) {
            log(`Target processing failed: ${error.message}`, 'error');
        }
    }

    function getCurrentNerve() {
        try {
            const nerveElement = document.querySelector('.bar-value___NTdce');
            if (nerveElement) {
                const nerveText = nerveElement.textContent;
                const match = nerveText.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            }

            const altNerveElement = document.querySelector('[class*="nerve"] .bar-value, .nerve-bar .bar-value');
            if (altNerveElement) {
                const match = altNerveElement.textContent.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            }

            return 100;
        } catch (error) {
            log(`Nerve reading failed: ${error.message}`, 'error');
            return 0;
        }
    }

    function findBestTarget() {
        if (isRateLimited()) {
            log('Rate limited - skipping target search', 'warning');
            return null;
        }

        try {
            const crimeOptions = document.querySelectorAll('.crime-option');
            const currentNerve = getCurrentNerve();

            if (currentNerve < 1) {
                log('Insufficient nerve for pickpocketing', 'warning');
                return null;
            }

            const validTargets = [];

            for (const option of crimeOptions) {
                const titleElement = option.querySelector('.titleAndProps___DdeVu > div');
                const buttonElement = option.querySelector('.commit-button');

                if (!titleElement || !buttonElement) continue;

                const targetInfo = extractTargetInfo(option);
                if (!targetInfo.name) continue;

                const ariaLabel = buttonElement.getAttribute('aria-label') || '';
                const nerveMatch = ariaLabel.match(/(\d+)\s*nerve/i);
                const nerveCost = nerveMatch ? parseInt(nerveMatch[1]) : 5;

                if (currentNerve < nerveCost || nerveCost > ppSettings.maxNerve) continue;
                if (buttonElement.getAttribute('aria-disabled') === 'true') continue;

                let riskScore = 50; // Default risk
                let targetCategory = "Unknown";

                if (ppSettings.enhancedRiskMode && targetInfo.activity && targetInfo.physical) {
                    riskScore = calculateRiskScore(targetInfo.name, targetInfo.activity, targetInfo.physical);
                    targetCategory = getRiskCategory(riskScore);

                    // Skip if risk too high
                    if (ppSettings.avoidHighRisk && riskScore > ppSettings.maxRiskScore) {
                        continue;
                    }
                } else {
                    // Legacy mode
                    targetCategory = getLegacyCategory(targetInfo.name);
                    if (!ppSettings.targetCategories.includes(targetCategory)) continue;
                }

                // Activity filter (still applies in enhanced mode)
                if (ppSettings.targetActivities.length > 0) {
                    if (!ppSettings.targetActivities.some(activity =>
                        targetInfo.activity.toLowerCase().includes(activity.toLowerCase()))) {
                        continue;
                    }
                }

                validTargets.push({
                    element: buttonElement,
                    title: targetInfo.name,
                    activity: targetInfo.activity,
                    category: targetCategory,
                    nerve: nerveCost,
                    riskScore: riskScore,
                    priority: ppSettings.enhancedRiskMode ? riskScore : getCategoryPriority(targetCategory)
                });
            }

            // Sort by risk score (lower is better) then by nerve cost
            validTargets.sort((a, b) => {
                if (a.riskScore !== b.riskScore) return a.riskScore - b.riskScore;
                return a.nerve - b.nerve;
            });

            return validTargets[0] || null;

        } catch (error) {
            log(`Target search failed: ${error.message}`, 'error');
            return null;
        }
    }

    function getCategoryPriority(category) {
        const priorities = {
            "Safe": 1,
            "Moderately Unsafe": 2,
            "Unsafe": 3,
            "Risky": 4,
            "Dangerous": 5,
            "Very Dangerous": 6
        };
        return priorities[category] || 999;
    }

    function performAutoPick(isTest = false) {
        try {
            const target = findBestTarget();

            if (!target) {
                const msg = isTest ? 'No valid targets available for test' : 'No targets match current criteria';
                log(msg, 'warning');
                return false;
            }

            if (isTest) {
                const riskInfo = ppSettings.enhancedRiskMode ?
                    ` - Risk: ${target.riskScore}` : '';
                log(`Test successful: Would pick ${target.title} (${target.category})${riskInfo} - ${target.activity} [${target.nerve} nerve]`, 'success');
                return true;
            }

            if (ppSettings.safetyMode && isRateLimited()) {
                log('Safety mode: Action blocked due to rate limiting', 'warning');
                return false;
            }

            target.element.click();
            actionCount++;

            const riskInfo = ppSettings.enhancedRiskMode ?
                ` - Risk: ${target.riskScore}` : '';
            log(`Auto-picked: ${target.title} (${target.category})${riskInfo} [${target.nerve} nerve] - Activity: ${target.activity}`, 'success');

            processedTargets.add(target.title + target.activity);
            setTimeout(() => {
                processedTargets.delete(target.title + target.activity);
            }, 30000);

            return true;

        } catch (error) {
            log(`Auto pick failed: ${error.message}`, 'error');
            return false;
        }
    }

    function startAutoPicker() {
        if (autoPickerInterval) return;

        try {
            log('Auto picker starting...', 'success');

            autoPickerInterval = setInterval(() => {
                if (ppSettings.autoPickerEnabled && isOnPickpocketPage()) {
                    if (ppSettings.safetyMode && isRateLimited()) {
                        log('Auto picker paused - rate limit reached', 'warning');
                        return;
                    }
                    performAutoPick();
                }
            }, addRandomDelay(ppSettings.autoPickDelay));

        } catch (error) {
            log(`Auto picker start failed: ${error.message}`, 'error');
        }
    }

    function stopAutoPicker() {
        if (autoPickerInterval) {
            clearInterval(autoPickerInterval);
            autoPickerInterval = null;
            log('Auto picker stopped', 'warning');
        }
    }

    function isOnPickpocketPage() {
        return window.location.href.includes('crimes') &&
               (document.querySelector('.pickpocketing-root') !== null ||
                document.querySelector('[class*="pickpocket"]') !== null ||
                document.querySelector('.crime-option') !== null);
    }

    // Create enhanced menu section HTML
    const menuSection = `
        <h4 style="margin: 0 0 12px 0; color: #37b24d;">👤 Enhanced Pickpocketing</h4>

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; margin-bottom: 12px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="ppColoringEnabled" ${ppSettings.coloringEnabled ? 'checked' : ''}>
                <span style="margin-left: 8px;">Target Color Coding</span>
            </label>
            <div style="font-size: 10px; color: #999;">Visual aid</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="ppEnhancedRiskMode" ${ppSettings.enhancedRiskMode ? 'checked' : ''}>
                <span style="margin-left: 8px; font-size: 11px;">Enhanced Risk Mode</span>
            </label>
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="ppShowRiskScores" ${ppSettings.showRiskScores ? 'checked' : ''}>
                <span style="margin-left: 8px; font-size: 11px;">Show Risk Scores</span>
            </label>
        </div>

        <div style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: rgba(55,178,77,0.1); border-radius: 6px;">
            <label style="display: flex; align-items: center; cursor: pointer; flex-grow: 1;">
                <input type="checkbox" id="ppAutoPickerEnabled" ${ppSettings.autoPickerEnabled ? 'checked' : ''}>
                <span style="margin-left: 8px; font-weight: bold; color: #37b24d;">Auto Picker</span>
            </label>
            <div id="ppAutoPickStatus" style="padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${ppSettings.autoPickerEnabled ? '#37b24d' : '#666'}; color: white;">
                ${ppSettings.autoPickerEnabled ? 'ACTIVE' : 'DISABLED'}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div>
                <label style="display: block; margin-bottom: 4px; font-size: 10px;">Delay (ms):</label>
                <input type="number" id="ppAutoPickDelay" value="${ppSettings.autoPickDelay}" min="1000" max="30000" step="500" style="width: 100%; padding: 6px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; font-size: 11px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 4px; font-size: 10px;">Max Nerve:</label>
                <input type="number" id="ppMaxNerve" value="${ppSettings.maxNerve}" min="1" max="50" style="width: 100%; padding: 6px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; font-size: 11px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 4px; font-size: 10px;">Max Risk:</label>
                <input type="number" id="ppMaxRiskScore" value="${ppSettings.maxRiskScore}" min="0" max="150" style="width: 100%; padding: 6px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; font-size: 11px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 12px; align-items: center;">
            <div>
                <label style="display: block; margin-bottom: 4px; font-size: 10px;">Max Actions/Hour:</label>
                <input type="number" id="ppMaxActions" value="${ppSettings.maxActions}" min="10" max="200" style="width: 100%; padding: 6px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; font-size: 11px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="ppSafetyMode" ${ppSettings.safetyMode ? 'checked' : ''}>
                    <span style="margin-left: 6px; font-size: 10px;">Safety Mode</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="ppAvoidHighRisk" ${ppSettings.avoidHighRisk ? 'checked' : ''}>
                    <span style="margin-left: 6px; font-size: 10px;">Avoid High Risk</span>
                </label>
            </div>
        </div>

        <div id="ppLegacyControls" style="display: ${ppSettings.enhancedRiskMode ? 'none' : 'block'};">
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; font-weight: bold; font-size: 11px;">Target Categories (Legacy Mode):</label>
                <div id="ppCategoryCheckboxes" style="max-height: 80px; overflow-y: auto; border: 1px solid #555; padding: 6px; border-radius: 4px; background: rgba(0,0,0,0.3);">
                    ${Object.keys(markGroups).map(category => `
                        <label style="display: block; margin-bottom: 2px; cursor: pointer; font-size: 10px;">
                            <input type="checkbox" class="ppCategoryCheck" value="${category}" ${ppSettings.targetCategories.includes(category) ? 'checked' : ''}>
                            <span style="margin-left: 4px;">${category}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>

        <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 6px; font-weight: bold; font-size: 11px;">Target Activities:</label>
            <div id="ppActivityCheckboxes" style="max-height: 80px; overflow-y: auto; border: 1px solid #555; padding: 6px; border-radius: 4px; background: rgba(0,0,0,0.3);">
                ${activityTypes.map(activity => `
                    <label style="display: block; margin-bottom: 2px; cursor: pointer; font-size: 10px;">
                        <input type="checkbox" class="ppActivityCheck" value="${activity}" ${ppSettings.targetActivities.includes(activity) ? 'checked' : ''}>
                        <span style="margin-left: 4px;">${activity}</span>
                    </label>
                `).join('')}
            </div>
        </div>

        <button id="ppTestPick" style="width: 100%; padding: 8px; background: linear-gradient(45deg, #37b24d, #51cf66); border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; box-shadow: 0 2px 8px rgba(55,178,77,0.3); transition: all 0.2s;">Test Auto Pick</button>
    `;

    function setupEventHandlers() {
        // Coloring toggle
        const coloringToggle = document.getElementById('ppColoringEnabled');
        if (coloringToggle) {
            coloringToggle.onchange = function() {
                ppSettings.coloringEnabled = this.checked;
                saveSettings();
                setTimeout(processCurrentTargets, 100);
                log(`Color coding ${this.checked ? 'enabled' : 'disabled'}`, 'info');
            };
        }

        // Enhanced risk mode toggle
        const enhancedToggle = document.getElementById('ppEnhancedRiskMode');
        if (enhancedToggle) {
            enhancedToggle.onchange = function() {
                ppSettings.enhancedRiskMode = this.checked;
                saveSettings();

                // Toggle legacy controls visibility
                const legacyControls = document.getElementById('ppLegacyControls');
                if (legacyControls) {
                    legacyControls.style.display = this.checked ? 'none' : 'block';
                }

                setTimeout(processCurrentTargets, 100);
                log(`Enhanced risk mode ${this.checked ? 'enabled' : 'disabled'}`, 'info');
            };
        }

        // Show risk scores toggle
        const scoresToggle = document.getElementById('ppShowRiskScores');
        if (scoresToggle) {
            scoresToggle.onchange = function() {
                ppSettings.showRiskScores = this.checked;
                saveSettings();
                setTimeout(processCurrentTargets, 100);
                log(`Risk scores ${this.checked ? 'shown' : 'hidden'}`, 'info');
            };
        }

        // Auto picker toggle
        const autoPickToggle = document.getElementById('ppAutoPickerEnabled');
        if (autoPickToggle) {
            autoPickToggle.onchange = function() {
                ppSettings.autoPickerEnabled = this.checked;

                const status = document.getElementById('ppAutoPickStatus');
                if (status) {
                    status.textContent = ppSettings.autoPickerEnabled ? 'ACTIVE' : 'DISABLED';
                    status.style.background = ppSettings.autoPickerEnabled ? '#37b24d' : '#666';
                }

                if (ppSettings.autoPickerEnabled && isOnPickpocketPage() && !isRateLimited()) {
                    startAutoPicker();
                } else {
                    stopAutoPicker();
                }

                saveSettings();
                log(`Auto picker ${this.checked ? 'enabled' : 'disabled'}`, 'info');
            };
        }

        // Number inputs
        ['ppAutoPickDelay', 'ppMaxNerve', 'ppMaxActions', 'ppMaxRiskScore'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.onchange = function() {
                    const setting = id.replace('pp', '').charAt(0).toLowerCase() + id.replace('pp', '').slice(1);
                    ppSettings[setting] = parseInt(this.value);
                    saveSettings();

                    // Restart auto picker if running and delay changed
                    if (id === 'ppAutoPickDelay' && autoPickerInterval) {
                        stopAutoPicker();
                        startAutoPicker();
                    }
                };
            }
        });

        // Boolean toggles
        const booleanToggles = ['ppSafetyMode', 'ppAvoidHighRisk'];
        booleanToggles.forEach(id => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.onchange = function() {
                    const setting = id.replace('pp', '').charAt(0).toLowerCase() + id.replace('pp', '').slice(1);
                    ppSettings[setting] = this.checked;
                    saveSettings();
                    log(`${setting} ${this.checked ? 'enabled' : 'disabled'}`, 'info');
                };
            }
        });

        // Category checkboxes
        document.querySelectorAll('.ppCategoryCheck').forEach(checkbox => {
            checkbox.onchange = () => {
                ppSettings.targetCategories = Array.from(document.querySelectorAll('.ppCategoryCheck:checked')).map(cb => cb.value);
                saveSettings();
                log(`Target categories updated: ${ppSettings.targetCategories.join(', ')}`, 'info');
            };
        });

        // Activity checkboxes
        document.querySelectorAll('.ppActivityCheck').forEach(checkbox => {
            checkbox.onchange = () => {
                ppSettings.targetActivities = Array.from(document.querySelectorAll('.ppActivityCheck:checked')).map(cb => cb.value);
                saveSettings();
                log(`Target activities updated: ${ppSettings.targetActivities.join(', ')}`, 'info');
            };
        });

        // Test button
        const testBtn = document.getElementById('ppTestPick');
        if (testBtn) {
            testBtn.onclick = () => {
                log('Testing auto pick functionality...', 'warning');
                const result = performAutoPick(true);
                if (!result) {
                    log('Test failed - check your target settings or visit crimes page', 'error');
                }
            };
        }
    }

    // Module configuration
    const moduleConfig = {
        name: 'Enhanced Pickpocket',
        version: '1.2',
        description: 'Enhanced pickpocketing with advanced risk assessment, color coding and auto-picker',
        menuSection: menuSection,
        initialize: function() {
            log('Enhanced Pickpocket module initializing...', 'info');

            setupEventHandlers();

            // Start observer for target processing
            const observer = new MutationObserver(() => {
                if (ppSettings.coloringEnabled) {
                    clearTimeout(observer.debounceTimer);
                    observer.debounceTimer = setTimeout(processCurrentTargets, 300);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // Initial target processing
            setTimeout(processCurrentTargets, 1000);

            // Auto-start if enabled and on pickpocket page
            if (ppSettings.autoPickerEnabled && isOnPickpocketPage()) {
                setTimeout(startAutoPicker, 2000);
                log('Auto picker will start in 2 seconds (on pickpocket page)', 'info');
            }

            log('Enhanced Pickpocket module initialized successfully', 'success');
        },
        cleanup: function() {
            stopAutoPicker();
            log('Enhanced Pickpocket module cleaned up', 'info');
        },
        isActive: function() {
            return ppSettings.autoPickerEnabled && autoPickerInterval !== null && isOnPickpocketPage();
        },
        getStats: function() {
            const uptime = Math.floor((Date.now() - sessionStart) / 1000);
            return {
                'Actions Performed': actionCount,
                'Session Uptime': `${uptime}s`,
                'Rate Limit Status': isRateLimited() ? 'ACTIVE' : 'OK',
                'Risk Mode': ppSettings.enhancedRiskMode ? 'Enhanced' : 'Legacy',
                'Max Risk Score': ppSettings.maxRiskScore
            };
        }
    };

    function initializePickpocketModule() {
        log('Attempting to register enhanced pickpocket module with framework...', 'info');

        // Register with framework
        if (globalWindow.TornFramework && globalWindow.TornFramework.registerModule(moduleConfig)) {
            log('Enhanced Pickpocket module registered successfully', 'success');

            // Page change detection
            let currentUrl = window.location.href;
            const urlObserver = new MutationObserver(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;

                    if (!isOnPickpocketPage() && autoPickerInterval) {
                        stopAutoPicker();
                        log('Left pickpocket page - auto picker stopped', 'info');
                    } else if (isOnPickpocketPage() && ppSettings.autoPickerEnabled && !autoPickerInterval) {
                        setTimeout(startAutoPicker, 1000);
                        log('Entered pickpocket page - auto picker starting', 'info');
                    }
                }
            });

            urlObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            log('Failed to register enhanced pickpocket module - framework not available', 'error');
        }
    }

    // Wait for framework
    function waitForFramework() {
        console.log('[PICKPOCKET] Checking for framework...');
        if (globalWindow.TornFramework && globalWindow.TornFramework.initialized) {
            console.log('[PICKPOCKET] Framework found, initializing enhanced module');
            initializePickpocketModule();
        } else {
            console.log('[PICKPOCKET] Framework not ready, waiting...');
            setTimeout(waitForFramework, 500);
        }
    }

    // Start initialization
    waitForFramework();

})();
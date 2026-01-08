// ==UserScript==
// @name         Torn Ranked War Habit Protector
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Warns before training energy or using booster cooldown before a ranked war; needs API key with public and faction rights. Created using Claude.
// @author       Trondin (2712718)
// @license MIT
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561882/Torn%20Ranked%20War%20Habit%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/561882/Torn%20Ranked%20War%20Habit%20Protector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        GYM_WARNING_HOURS: GM_getValue('gymWarningHours', 72), // Warn 72h before for gym
        BOOSTER_WARNING_HOURS: GM_getValue('boosterWarningHours', 48), // Warn 48h before for boosters
        API_KEY: GM_getValue('tornApiKey', ''),
        CHECK_INTERVAL: 5 * 60 * 1000, // Check every 5 minutes
        ENABLED: GM_getValue('enabled', true),
        GYM_WARNINGS_ENABLED: GM_getValue('gymWarningsEnabled', true), // Individual gym toggle
        BOOSTER_WARNINGS_ENABLED: GM_getValue('boosterWarningsEnabled', true), // Individual booster toggle
        PAGE_ENTRY_WARNINGS: GM_getValue('pageEntryWarnings', true) // Show warning when entering pages
    };

    let upcomingWar = null;
    let originalFetch = window.fetch;
    let pageWarningShown = false; // Track if we've shown the page warning this session

    // CSS for warning modal
    const styles = `
        #war-warning-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border: 3px solid #ff4444;
            border-radius: 12px;
            padding: 25px;
            z-index: 999999;
            box-shadow: 0 10px 40px rgba(255, 68, 68, 0.4);
            min-width: 400px;
            max-width: 500px;
        }
        #war-warning-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999998;
        }
        .war-warning-title {
            color: #ff4444;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .war-warning-content {
            color: #ffffff;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .war-warning-details {
            background: rgba(255, 255, 255, 0.05);
            padding: 12px;
            border-radius: 6px;
            margin: 15px 0;
            color: #cccccc;
        }
        .war-warning-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .war-warning-btn {
            padding: 10px 25px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .war-warning-btn-cancel {
            background: #4a4a4a;
            color: #ffffff;
        }
        .war-warning-btn-cancel:hover {
            background: #5a5a5a;
        }
        .war-warning-btn-proceed {
            background: #ff4444;
            color: #ffffff;
        }
        .war-warning-btn-proceed:hover {
            background: #ff6666;
        }
    `;

    // Add styles to page
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Show page entry warning
    function showPageEntryWarning(pageType) {
        if (!CONFIG.PAGE_ENTRY_WARNINGS) return;
        if (pageWarningShown) return; // Already shown this session
        
        const actionType = pageType === 'gym' ? 'gym' : 'booster';
        if (!shouldWarn(actionType)) return;
        
        pageWarningShown = true; // Mark as shown for this session
        
        const overlay = document.createElement('div');
        overlay.id = 'war-warning-overlay';
        
        const modal = document.createElement('div');
        modal.id = 'war-warning-modal';
        
        const timeUntilWar = Math.floor((upcomingWar.start - Date.now() / 1000) / 3600);
        const warStartTime = new Date(upcomingWar.start * 1000).toLocaleString();
        const opponentName = getOpponentName(upcomingWar);
        
        let pageMessage = '';
        let cautionMessage = '';
        if (pageType === 'gym') {
            pageMessage = 'You are viewing the <strong>Gym page</strong>.';
            cautionMessage = `Training now will use energy that could be saved for the war in ~${timeUntilWar} hours!`;
        } else {
            pageMessage = 'You are viewing the <strong>Items page</strong>.';
            cautionMessage = `Using booster items now will increase your cooldown before the war in ~${timeUntilWar} hours!`;
        }
        
        modal.innerHTML = `
            <div class="war-warning-title">⚠️ Ranked War Alert ⚠️</div>
            <div class="war-warning-content">
                ${pageMessage}
                <div class="war-warning-details">
                    <strong>Upcoming War:</strong><br>
                    Opponent: ${opponentName}<br>
                    Start Time: ${warStartTime}<br>
                    Time Until War: ~${timeUntilWar} hours
                </div>
                <strong>⚡ Caution:</strong><br>
                ${cautionMessage}
            </div>
            <div class="war-warning-buttons">
                <button class="war-warning-btn war-warning-btn-proceed" id="war-understand-btn">I Understand</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        const closeModal = () => {
            overlay.remove();
            modal.remove();
        };
        
        document.getElementById('war-understand-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    // Get opponent name from war object
    function getOpponentName(war) {
        if (!war) return 'Unknown';
        
        // New structure has opponentName directly
        if (war.opponentName) {
            return war.opponentName;
        }
        
        // Fallback to trying different structures
        if (war.factions && war.opponentId && war.factions[war.opponentId]) {
            return war.factions[war.opponentId].name;
        }
        
        return 'Unknown Faction';
    }

    // Show warning modal
    function showWarning(action, onProceed) {
        const overlay = document.createElement('div');
        overlay.id = 'war-warning-overlay';
        
        const modal = document.createElement('div');
        modal.id = 'war-warning-modal';
        
        const timeUntilWar = Math.floor((upcomingWar.start - Date.now() / 1000) / 3600);
        const warStartTime = new Date(upcomingWar.start * 1000).toLocaleString();
        const opponentName = getOpponentName(upcomingWar);
        
        let actionMessage = '';
        if (action === 'gym') {
            actionMessage = 'You are about to <strong>train in the gym</strong>, which will consume your energy.';
        } else if (action === 'booster') {
            actionMessage = 'You are about to <strong>use a booster item</strong>, which will increase your cooldown.';
        }
        
        modal.innerHTML = `
            <div class="war-warning-title">⚠️ Ranked War Approaching ⚠️</div>
            <div class="war-warning-content">
                ${actionMessage}
                <div class="war-warning-details">
                    <strong>War Details:</strong><br>
                    Opponent: ${opponentName}<br>
                    Start Time: ${warStartTime}<br>
                    Time Until War: ~${timeUntilWar} hours
                </div>
                <strong>Are you sure you want to proceed?</strong><br>
                Consider saving your resources for the war!
            </div>
            <div class="war-warning-buttons">
                <button class="war-warning-btn war-warning-btn-cancel" id="war-cancel-btn">Cancel</button>
                <button class="war-warning-btn war-warning-btn-proceed" id="war-proceed-btn">Proceed Anyway</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        document.getElementById('war-cancel-btn').addEventListener('click', () => {
            overlay.remove();
            modal.remove();
        });
        
        document.getElementById('war-proceed-btn').addEventListener('click', () => {
            overlay.remove();
            modal.remove();
            if (onProceed) onProceed();
        });
        
        overlay.addEventListener('click', () => {
            overlay.remove();
            modal.remove();
        });
    }

    // Check if action should be warned based on action type
    function shouldWarn(actionType) {
        if (!CONFIG.ENABLED) return false; // Master toggle
        if (!upcomingWar) return false;
        
        // Check individual toggles
        if (actionType === 'gym' && !CONFIG.GYM_WARNINGS_ENABLED) return false;
        if (actionType === 'booster' && !CONFIG.BOOSTER_WARNINGS_ENABLED) return false;
        
        const timeUntilWar = (upcomingWar.start - Date.now() / 1000) / 3600; // hours
        
        // Use different thresholds based on action
        let threshold;
        if (actionType === 'gym') {
            threshold = CONFIG.GYM_WARNING_HOURS;
        } else if (actionType === 'booster') {
            threshold = CONFIG.BOOSTER_WARNING_HOURS;
        } else {
            threshold = CONFIG.GYM_WARNING_HOURS; // Default to gym threshold
        }
        
        return timeUntilWar > 0 && timeUntilWar <= threshold;
    }

    // Fetch ranked war info from API
    async function checkRankedWar() {
        if (!CONFIG.API_KEY) {
            console.log('[War Guard] No API key configured');
            return null;
        }
        
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/faction/?selections=basic,rankedwars&key=${CONFIG.API_KEY}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (data.error) {
                            console.error('[War Guard] API Error:', data.error);
                            resolve(null);
                            return;
                        }
                        
                        console.log('[War Guard] API Response:', data);
                        
                        // Get user's faction ID
                        const userFactionId = data.ID ? data.ID.toString() : null;
                        console.log('[War Guard] User faction ID:', userFactionId);
                        
                        // Check if there's an active or upcoming ranked war
                        // Note: API uses 'rankedwars' not 'ranked_wars'
                        if (data.rankedwars && Object.keys(data.rankedwars).length > 0) {
                            console.log('[War Guard] Ranked wars found:', Object.keys(data.rankedwars).length);
                            
                            const wars = Object.entries(data.rankedwars);
                            const now = Date.now() / 1000;
                            
                            // Find a war that hasn't started yet or is ongoing without a winner
                            const futureWar = wars.find(([warId, warData]) => {
                                const hasntStarted = warData.war.start > now;
                                const ongoingNoWinner = warData.war.start <= now && warData.war.end === 0;
                                return hasntStarted || ongoingNoWinner;
                            });
                            
                            if (futureWar) {
                                const [warId, warData] = futureWar;
                                
                                // Find opponent faction
                                let opponentFactionId = null;
                                const factionIds = Object.keys(warData.factions);
                                
                                if (userFactionId) {
                                    opponentFactionId = factionIds.find(id => id !== userFactionId);
                                } else {
                                    // If we can't determine user faction, just take the "other" one
                                    opponentFactionId = factionIds[0];
                                }
                                
                                console.log('[War Guard] Opponent faction ID:', opponentFactionId);
                                
                                // Build war object with all necessary info
                                upcomingWar = {
                                    ...warData.war,
                                    warId: warId,
                                    factions: warData.factions,
                                    opponentId: opponentFactionId,
                                    opponentName: opponentFactionId ? warData.factions[opponentFactionId].name : 'Unknown'
                                };
                                
                                console.log('[War Guard] Upcoming war detected:', upcomingWar);
                                resolve(upcomingWar);
                            } else {
                                console.log('[War Guard] No future wars found');
                                upcomingWar = null;
                                resolve(null);
                            }
                        } else {
                            console.log('[War Guard] No ranked wars in response');
                            upcomingWar = null;
                            resolve(null);
                        }
                    } catch (e) {
                        console.error('[War Guard] Parse error:', e);
                        console.error('[War Guard] Response text:', response.responseText);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('[War Guard] Request error:', error);
                    resolve(null);
                }
            });
        });
    }

    // Intercept gym training (only on gym.php)
    function interceptGym() {
        if (!window.location.pathname.includes('gym.php')) {
            return; // Not on gym page, don't intercept
        }
        
        // Show page entry warning when first loading gym page
        setTimeout(() => showPageEntryWarning('gym'), 1000);
        
        document.addEventListener('click', function(e) {
            // Look for gym training buttons
            if (e.target.closest('.gym-strength, .gym-defense, .gym-speed, .gym-dexterity') ||
                e.target.closest('[class*="train"]')) {
                
                if (shouldWarn('gym')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    showWarning('gym', () => {
                        // Allow the click to proceed
                        const newEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        e.target.dispatchEvent(newEvent);
                    });
                    
                    return false;
                }
            }
        }, true);
    }

    // Intercept booster usage via fetch/XHR (only on item.php and inventory pages)
    function interceptBoosters() {
        const relevantPages = ['item.php', 'index.php', 'factions.php', 'profiles.php'];
        const isRelevantPage = relevantPages.some(page => window.location.pathname.includes(page));
        
        if (!isRelevantPage) {
            return; // Not on relevant page, don't intercept
        }
        
        // Show page entry warning when first loading items page
        if (window.location.pathname.includes('item.php')) {
            setTimeout(() => showPageEntryWarning('items'), 1000);
        }
        
        // Override fetch
        window.fetch = function(...args) {
            const url = args[0];
            
            if (typeof url === 'string' && shouldWarn('booster')) {
                // Check if this is a booster/item usage request
                if (url.includes('item.php') || url.includes('action=useItem') || 
                    url.includes('useItem') || url.includes('consumables')) {
                    return new Promise((resolve, reject) => {
                        showWarning('booster', () => {
                            // Proceed with original request
                            originalFetch.apply(this, args).then(resolve).catch(reject);
                        });
                    });
                }
            }
            
            return originalFetch.apply(this, args);
        };

        // Override XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            if (shouldWarn('booster') && this._url) {
                if (this._url.includes('item.php') || this._url.includes('action=useItem') ||
                    this._url.includes('useItem') || this._url.includes('consumables')) {
                    showWarning('booster', () => {
                        originalSend.apply(this, [body]);
                    });
                    return;
                }
            }
            return originalSend.apply(this, [body]);
        };
    }

    // Register Tampermonkey menu commands
    function registerMenuCommands() {
        GM_registerMenuCommand('⚙️ Configure API Key', () => {
            const apiKey = prompt(
                'Enter your Torn API Key:\n\n' +
                'Get your API key from:\n' +
                'https://www.torn.com/preferences.php#tab=api\n\n' +
                'Required permissions: Public or Faction',
                CONFIG.API_KEY
            );
            
            if (apiKey !== null) {
                CONFIG.API_KEY = apiKey.trim();
                GM_setValue('tornApiKey', CONFIG.API_KEY);
                alert('API Key saved!\n\nChecking for wars...');
                checkRankedWar().then((war) => {
                    if (war) {
                        const timeUntilWar = Math.floor((war.start - Date.now() / 1000) / 3600);
                        const opponentName = getOpponentName(war);
                        alert(
                            `✅ War Detected!\n\n` +
                            `Opponent: ${opponentName}\n` +
                            `Start: ${new Date(war.start * 1000).toLocaleString()}\n` +
                            `Time until war: ~${timeUntilWar} hours`
                        );
                    } else {
                        alert('✓ No upcoming wars detected\n\nCheck browser console (F12) for API response details.');
                    }
                }).catch((err) => {
                    alert('Error checking wars:\n\n' + err);
                    console.error('[War Guard] Error:', err);
                });
            }
        });
        
        GM_registerMenuCommand('🔔 Toggle Warnings', () => {
            CONFIG.ENABLED = !CONFIG.ENABLED;
            GM_setValue('enabled', CONFIG.ENABLED);
            alert(`All Warnings are now ${CONFIG.ENABLED ? 'ENABLED ✓' : 'DISABLED ✗'}`);
        });
        
        GM_registerMenuCommand('💪 Toggle Gym Warnings', () => {
            CONFIG.GYM_WARNINGS_ENABLED = !CONFIG.GYM_WARNINGS_ENABLED;
            GM_setValue('gymWarningsEnabled', CONFIG.GYM_WARNINGS_ENABLED);
            alert(
                `Gym Training Warnings: ${CONFIG.GYM_WARNINGS_ENABLED ? 'ENABLED ✓' : 'DISABLED ✗'}\n\n` +
                (CONFIG.GYM_WARNINGS_ENABLED ? 
                    'You will be warned before training in the gym during war prep.' :
                    'Gym training warnings are now OFF. You can train freely without warnings.')
            );
        });
        
        GM_registerMenuCommand('🍬 Toggle Booster Warnings', () => {
            CONFIG.BOOSTER_WARNINGS_ENABLED = !CONFIG.BOOSTER_WARNINGS_ENABLED;
            GM_setValue('boosterWarningsEnabled', CONFIG.BOOSTER_WARNINGS_ENABLED);
            alert(
                `Booster Usage Warnings: ${CONFIG.BOOSTER_WARNINGS_ENABLED ? 'ENABLED ✓' : 'DISABLED ✗'}\n\n` +
                (CONFIG.BOOSTER_WARNINGS_ENABLED ? 
                    'You will be warned before using booster items during war prep.' :
                    'Booster usage warnings are now OFF. You can use items freely without warnings.')
            );
        });
        
        GM_registerMenuCommand('🚪 Toggle Page Entry Warnings', () => {
            CONFIG.PAGE_ENTRY_WARNINGS = !CONFIG.PAGE_ENTRY_WARNINGS;
            GM_setValue('pageEntryWarnings', CONFIG.PAGE_ENTRY_WARNINGS);
            alert(
                `Page Entry Warnings: ${CONFIG.PAGE_ENTRY_WARNINGS ? 'ENABLED ✓' : 'DISABLED ✗'}\n\n` +
                (CONFIG.PAGE_ENTRY_WARNINGS ? 
                    'You will see a warning when entering gym/items pages during war prep period.' :
                    'You will only see warnings when actually training or using items.')
            );
        });
        
        GM_registerMenuCommand('⏰ Set Gym Warning Hours', () => {
            const hours = prompt(
                'Warn before TRAINING when war is within X hours:\n\n' +
                'Default: 72 hours (3 days)\n' +
                'Recommended: 48-96 hours for energy stacking\n\n' +
                'This is when you should stop training to save energy.',
                CONFIG.GYM_WARNING_HOURS
            );
            
            if (hours !== null) {
                const parsed = parseInt(hours);
                if (!isNaN(parsed) && parsed > 0) {
                    CONFIG.GYM_WARNING_HOURS = parsed;
                    GM_setValue('gymWarningHours', CONFIG.GYM_WARNING_HOURS);
                    alert(`Gym training warnings set to ${parsed} hours before war`);
                } else {
                    alert('Invalid number. Please enter a positive number.');
                }
            }
        });
        
        GM_registerMenuCommand('⏱️ Set Booster Warning Hours', () => {
            const hours = prompt(
                'Warn before USING BOOSTERS when war is within X hours:\n\n' +
                'Default: 48 hours (2 days)\n' +
                'Recommended: 24-72 hours to save booster cooldown\n\n' +
                'This is when you should stop using candy/cans.',
                CONFIG.BOOSTER_WARNING_HOURS
            );
            
            if (hours !== null) {
                const parsed = parseInt(hours);
                if (!isNaN(parsed) && parsed > 0) {
                    CONFIG.BOOSTER_WARNING_HOURS = parsed;
                    GM_setValue('boosterWarningHours', CONFIG.BOOSTER_WARNING_HOURS);
                    alert(`Booster usage warnings set to ${parsed} hours before war`);
                } else {
                    alert('Invalid number. Please enter a positive number.');
                }
            }
        });
        
        GM_registerMenuCommand('🔍 Check War Status Now', () => {
            if (!CONFIG.API_KEY) {
                alert('⚠️ No API Key Configured\n\nPlease set your API key first using "⚙️ Configure API Key"');
                return;
            }
            
            // Don't block with alert before API call
            checkRankedWar().then((war) => {
                if (war) {
                    const timeUntilWar = Math.floor((war.start - Date.now() / 1000) / 3600);
                    const gymWarning = timeUntilWar <= CONFIG.GYM_WARNING_HOURS;
                    const boosterWarning = timeUntilWar <= CONFIG.BOOSTER_WARNING_HOURS;
                    const opponentName = getOpponentName(war);
                    
                    alert(
                        `⚔️ UPCOMING WAR DETECTED\n\n` +
                        `Opponent: ${opponentName}\n` +
                        `Start Time: ${new Date(war.start * 1000).toLocaleString()}\n` +
                        `Hours until war: ~${timeUntilWar}\n\n` +
                        `GYM Warnings: ${gymWarning ? '✓ ACTIVE' : '✗ Not yet'}\n` +
                        `BOOSTER Warnings: ${boosterWarning ? '✓ ACTIVE' : '✗ Not yet'}\n\n` +
                        `(Check browser console for full war details)`
                    );
                } else {
                    alert(
                        '✓ No Upcoming Wars\n\n' +
                        'Your faction is either:\n' +
                        '• Not enlisted in ranked wars\n' +
                        '• Not yet matched with an opponent\n' +
                        '• Between war cycles\n\n' +
                        'Matchmaking happens Tuesday 12:00 TCT\n\n' +
                        'Check browser console (F12) for API response details.'
                    );
                }
            }).catch((err) => {
                alert('❌ Error checking wars:\n\n' + err + '\n\nCheck browser console (F12) for details.');
                console.error('[War Guard] Error:', err);
            });
        });
        
        GM_registerMenuCommand('📋 View Current Settings', () => {
            const status = CONFIG.ENABLED ? 'ENABLED ✓' : 'DISABLED ✗';
            const gymStatus = CONFIG.GYM_WARNINGS_ENABLED ? 'ENABLED ✓' : 'DISABLED ✗';
            const boosterStatus = CONFIG.BOOSTER_WARNINGS_ENABLED ? 'ENABLED ✓' : 'DISABLED ✗';
            const pageWarnings = CONFIG.PAGE_ENTRY_WARNINGS ? 'ENABLED ✓' : 'DISABLED ✗';
            const apiStatus = CONFIG.API_KEY ? 'Configured ✓' : 'Not set ✗';
            
            let warStatus = 'Checking...';
            if (upcomingWar) {
                const timeUntilWar = Math.floor((upcomingWar.start - Date.now() / 1000) / 3600);
                const opponentName = getOpponentName(upcomingWar);
                warStatus = `Yes - ${opponentName} in ~${timeUntilWar}h`;
            } else {
                warStatus = 'No upcoming wars';
            }
            
            alert(
                '⚔️ WAR GUARD SETTINGS\n\n' +
                `Master Toggle: ${status}\n` +
                `├─ Gym Warnings: ${gymStatus}\n` +
                `└─ Booster Warnings: ${boosterStatus}\n\n` +
                `API Key: ${apiStatus}\n` +
                `Page Entry Warnings: ${pageWarnings}\n` +
                `Gym Warning: ${CONFIG.GYM_WARNING_HOURS} hours\n` +
                `Booster Warning: ${CONFIG.BOOSTER_WARNING_HOURS} hours\n` +
                `Upcoming War: ${warStatus}\n\n` +
                `Last Check: ${new Date().toLocaleTimeString()}`
            );
        });
    }

    // Initialize
    function init() {
        addStyles();
        registerMenuCommands();
        interceptGym();
        interceptBoosters();
        
        // Initial check
        checkRankedWar();
        
        // Periodic checks
        setInterval(checkRankedWar, CONFIG.CHECK_INTERVAL);
    }

    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

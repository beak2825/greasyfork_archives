// ==UserScript==
// @name         Torn War Energy and Booster protection (TornPDA)
// @namespace    http://tampermonkey.net/
// @version      3.1-mobile
// @description  TornPDA compatible:Warns before training energy or using booster cooldown before a ranked war; needs API key with public and faction rights. Created using Claude.
// @author       Trondin (2712718)// @author       Trondin
// @match        https://www.torn.com/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561940/Torn%20War%20Energy%20and%20Booster%20protection%20%28TornPDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561940/Torn%20War%20Energy%20and%20Booster%20protection%20%28TornPDA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use localStorage instead of GM_setValue
    const storage = {
        get: (key, defaultValue) => {
            const value = localStorage.getItem('warguard_' + key);
            return value !== null ? JSON.parse(value) : defaultValue;
        },
        set: (key, value) => {
            localStorage.setItem('warguard_' + key, JSON.stringify(value));
        }
    };

    // Configuration
    const CONFIG = {
        GYM_WARNING_HOURS: storage.get('gymWarningHours', 72),
        BOOSTER_WARNING_HOURS: storage.get('boosterWarningHours', 48),
        API_KEY: storage.get('tornApiKey', ''),
        CHECK_INTERVAL: 5 * 60 * 1000,
        ENABLED: storage.get('enabled', true),
        GYM_WARNINGS_ENABLED: storage.get('gymWarningsEnabled', true),
        BOOSTER_WARNINGS_ENABLED: storage.get('boosterWarningsEnabled', true),
        PAGE_ENTRY_WARNINGS: storage.get('pageEntryWarnings', true)
    };

    let upcomingWar = null;
    let originalFetch = window.fetch;
    let pageWarningShown = false;

    // CSS for mobile-friendly UI
    const styles = `
        #war-warning-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border: 3px solid #ff4444;
            border-radius: 12px;
            padding: 20px;
            z-index: 999999;
            box-shadow: 0 10px 40px rgba(255, 68, 68, 0.4);
            max-width: 90%;
            width: 400px;
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
            font-size: 20px;
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
            font-size: 13px;
        }
        .war-warning-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .war-warning-btn {
            padding: 10px 20px;
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
        
        /* Mobile Settings Panel */
        #war-settings-fab {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 999995;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #war-settings-fab:active {
            transform: scale(0.95);
        }
        #war-settings-panel {
            position: fixed;
            top: 0;
            right: -100%;
            width: 90%;
            max-width: 400px;
            height: 100%;
            background: #1a1a1a;
            z-index: 999997;
            transition: right 0.3s ease;
            overflow-y: auto;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
        }
        #war-settings-panel.open {
            right: 0;
        }
        .settings-header {
            background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
            padding: 20px;
            border-bottom: 2px solid #ff4444;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .settings-title {
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
            margin: 0;
        }
        .settings-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
        }
        .settings-content {
            padding: 20px;
        }
        .settings-section {
            margin-bottom: 25px;
        }
        .settings-section-title {
            color: #ff4444;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #333;
        }
        .settings-row {
            margin: 15px 0;
            color: #cccccc;
        }
        .settings-row label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #ffffff;
        }
        .settings-row input[type="text"],
        .settings-row input[type="number"] {
            width: 100%;
            padding: 10px;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 6px;
            color: #ffffff;
            font-size: 14px;
        }
        .toggle-switch {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            background: #2a2a2a;
            border-radius: 6px;
            margin: 10px 0;
        }
        .toggle-switch label {
            margin: 0;
            flex: 1;
        }
        .toggle-switch input[type="checkbox"] {
            width: 50px;
            height: 26px;
            -webkit-appearance: none;
            appearance: none;
            background: #444;
            border-radius: 13px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        .toggle-switch input[type="checkbox"]:checked {
            background: #ff4444;
        }
        .toggle-switch input[type="checkbox"]::before {
            content: '';
            position: absolute;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: left 0.3s;
        }
        .toggle-switch input[type="checkbox"]:checked::before {
            left: 26px;
        }
        .settings-btn {
            width: 100%;
            padding: 12px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 10px 0;
        }
        .settings-btn:active {
            background: #cc0000;
        }
        .settings-btn.secondary {
            background: #4a4a4a;
        }
        .settings-btn.secondary:active {
            background: #5a5a5a;
        }
        .war-status-box {
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid #ff4444;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        .war-status-box.inactive {
            background: rgba(255, 255, 255, 0.05);
            border-color: #666;
        }
        .war-status-text {
            color: #ffffff;
            font-size: 14px;
            line-height: 1.6;
        }
    `;

    // Add styles
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Get opponent name
    function getOpponentName(war) {
        if (!war) return 'Unknown';
        if (war.opponentName) return war.opponentName;
        if (war.factions && war.opponentId && war.factions[war.opponentId]) {
            return war.factions[war.opponentId].name;
        }
        return 'Unknown Faction';
    }

    // Show page entry warning
    function showPageEntryWarning(pageType) {
        if (!CONFIG.PAGE_ENTRY_WARNINGS) return;
        if (pageWarningShown) return;
        
        const actionType = pageType === 'gym' ? 'gym' : 'booster';
        if (!shouldWarn(actionType)) return;
        
        pageWarningShown = true;
        
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

    // Show action warning
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

    // Check if should warn
    function shouldWarn(actionType) {
        if (!CONFIG.ENABLED) return false;
        if (!upcomingWar) return false;
        
        if (actionType === 'gym' && !CONFIG.GYM_WARNINGS_ENABLED) return false;
        if (actionType === 'booster' && !CONFIG.BOOSTER_WARNINGS_ENABLED) return false;
        
        const timeUntilWar = (upcomingWar.start - Date.now() / 1000) / 3600;
        
        let threshold;
        if (actionType === 'gym') {
            threshold = CONFIG.GYM_WARNING_HOURS;
        } else if (actionType === 'booster') {
            threshold = CONFIG.BOOSTER_WARNING_HOURS;
        } else {
            threshold = CONFIG.GYM_WARNING_HOURS;
        }
        
        return timeUntilWar > 0 && timeUntilWar <= threshold;
    }

    // Fetch war data - using regular fetch instead of GM_xmlhttpRequest
    async function checkRankedWar() {
        if (!CONFIG.API_KEY) {
            console.log('[War Guard] No API key configured');
            return null;
        }
        
        try {
            const response = await fetch(`https://api.torn.com/faction/?selections=basic,rankedwars&key=${CONFIG.API_KEY}`);
            const data = await response.json();
            
            if (data.error) {
                console.error('[War Guard] API Error:', data.error);
                return null;
            }
            
            console.log('[War Guard] API Response:', data);
            
            const userFactionId = data.ID ? data.ID.toString() : null;
            console.log('[War Guard] User faction ID:', userFactionId);
            
            if (data.rankedwars && Object.keys(data.rankedwars).length > 0) {
                console.log('[War Guard] Ranked wars found:', Object.keys(data.rankedwars).length);
                
                const wars = Object.entries(data.rankedwars);
                const now = Date.now() / 1000;
                
                const futureWar = wars.find(([warId, warData]) => {
                    const hasntStarted = warData.war.start > now;
                    const ongoingNoWinner = warData.war.start <= now && warData.war.end === 0;
                    return hasntStarted || ongoingNoWinner;
                });
                
                if (futureWar) {
                    const [warId, warData] = futureWar;
                    
                    let opponentFactionId = null;
                    const factionIds = Object.keys(warData.factions);
                    
                    if (userFactionId) {
                        opponentFactionId = factionIds.find(id => id !== userFactionId);
                    } else {
                        opponentFactionId = factionIds[0];
                    }
                    
                    console.log('[War Guard] Opponent faction ID:', opponentFactionId);
                    
                    upcomingWar = {
                        ...warData.war,
                        warId: warId,
                        factions: warData.factions,
                        opponentId: opponentFactionId,
                        opponentName: opponentFactionId ? warData.factions[opponentFactionId].name : 'Unknown'
                    };
                    
                    console.log('[War Guard] Upcoming war detected:', upcomingWar);
                    return upcomingWar;
                } else {
                    console.log('[War Guard] No future wars found');
                    upcomingWar = null;
                    return null;
                }
            } else {
                console.log('[War Guard] No ranked wars in response');
                upcomingWar = null;
                return null;
            }
        } catch (e) {
            console.error('[War Guard] Error:', e);
            return null;
        }
    }

    // Intercept gym training
    function interceptGym() {
        if (!window.location.pathname.includes('gym.php')) return;
        
        setTimeout(() => showPageEntryWarning('gym'), 1000);
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('.gym-strength, .gym-defense, .gym-speed, .gym-dexterity') ||
                e.target.closest('[class*="train"]')) {
                
                if (shouldWarn('gym')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    showWarning('gym', () => {
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

    // Intercept boosters
    function interceptBoosters() {
        const relevantPages = ['item.php', 'index.php', 'factions.php', 'profiles.php'];
        const isRelevantPage = relevantPages.some(page => window.location.pathname.includes(page));
        
        if (!isRelevantPage) return;
        
        if (window.location.pathname.includes('item.php')) {
            setTimeout(() => showPageEntryWarning('items'), 1000);
        }
        
        window.fetch = function(...args) {
            const url = args[0];
            
            if (typeof url === 'string' && shouldWarn('booster')) {
                if (url.includes('item.php') || url.includes('action=useItem') || 
                    url.includes('useItem') || url.includes('consumables')) {
                    return new Promise((resolve, reject) => {
                        showWarning('booster', () => {
                            originalFetch.apply(this, args).then(resolve).catch(reject);
                        });
                    });
                }
            }
            
            return originalFetch.apply(this, args);
        };

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

    // Create mobile settings panel
    function createSettingsPanel() {
        // FAB button
        const fab = document.createElement('button');
        fab.id = 'war-settings-fab';
        fab.innerHTML = '⚔️';
        fab.title = 'War Guard Settings';
        
        // Settings panel
        const panel = document.createElement('div');
        panel.id = 'war-settings-panel';
        
        function updatePanel() {
            const warStatusHtml = upcomingWar ? `
                <div class="war-status-box">
                    <div class="war-status-text">
                        <strong>⚔️ Upcoming War</strong><br>
                        Opponent: ${getOpponentName(upcomingWar)}<br>
                        Start: ${new Date(upcomingWar.start * 1000).toLocaleString()}<br>
                        Time: ~${Math.floor((upcomingWar.start - Date.now() / 1000) / 3600)} hours
                    </div>
                </div>
            ` : `
                <div class="war-status-box inactive">
                    <div class="war-status-text">
                        <strong>No Upcoming Wars</strong><br>
                        Your faction is not currently matched for a ranked war.
                    </div>
                </div>
            `;
            
            panel.innerHTML = `
                <div class="settings-header">
                    <h2 class="settings-title">⚔️ War Guard</h2>
                    <button class="settings-close" id="settings-close">✕</button>
                </div>
                <div class="settings-content">
                    <div class="settings-section">
                        <div class="settings-section-title">War Status</div>
                        ${warStatusHtml}
                        <button class="settings-btn secondary" id="check-war-btn">🔍 Check For Wars Now</button>
                    </div>
                    
                    <div class="settings-section">
                        <div class="settings-section-title">⚙️ Configuration</div>
                        <div class="settings-row">
                            <label>Torn API Key:</label>
                            <input type="text" id="api-key-input" value="${CONFIG.API_KEY}" placeholder="Enter your API key">
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <div class="settings-section-title">🔔 Warning Toggles</div>
                        <div class="toggle-switch">
                            <label>Master Toggle (All Warnings)</label>
                            <input type="checkbox" id="enabled-toggle" ${CONFIG.ENABLED ? 'checked' : ''}>
                        </div>
                        <div class="toggle-switch">
                            <label>Gym Training Warnings</label>
                            <input type="checkbox" id="gym-toggle" ${CONFIG.GYM_WARNINGS_ENABLED ? 'checked' : ''}>
                        </div>
                        <div class="toggle-switch">
                            <label>Booster Usage Warnings</label>
                            <input type="checkbox" id="booster-toggle" ${CONFIG.BOOSTER_WARNINGS_ENABLED ? 'checked' : ''}>
                        </div>
                        <div class="toggle-switch">
                            <label>Page Entry Warnings</label>
                            <input type="checkbox" id="page-entry-toggle" ${CONFIG.PAGE_ENTRY_WARNINGS ? 'checked' : ''}>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <div class="settings-section-title">⏰ Warning Thresholds</div>
                        <div class="settings-row">
                            <label>Gym Warning Hours (before war):</label>
                            <input type="number" id="gym-hours-input" value="${CONFIG.GYM_WARNING_HOURS}" min="1" max="168">
                        </div>
                        <div class="settings-row">
                            <label>Booster Warning Hours (before war):</label>
                            <input type="number" id="booster-hours-input" value="${CONFIG.BOOSTER_WARNING_HOURS}" min="1" max="168">
                        </div>
                    </div>
                    
                    <button class="settings-btn" id="save-settings-btn">💾 Save Settings</button>
                </div>
            `;
        }
        
        updatePanel();
        document.body.appendChild(fab);
        document.body.appendChild(panel);
        
        // Event listeners
        fab.addEventListener('click', () => {
            panel.classList.add('open');
        });
        
        panel.addEventListener('click', (e) => {
            if (e.target.id === 'settings-close') {
                panel.classList.remove('open');
            }
            
            if (e.target.id === 'check-war-btn') {
                e.target.textContent = '🔍 Checking...';
                e.target.disabled = true;
                checkRankedWar().then(() => {
                    updatePanel();
                    e.target.textContent = '🔍 Check For Wars Now';
                    e.target.disabled = false;
                });
            }
            
            if (e.target.id === 'save-settings-btn') {
                // Save all settings
                CONFIG.API_KEY = document.getElementById('api-key-input').value.trim();
                CONFIG.ENABLED = document.getElementById('enabled-toggle').checked;
                CONFIG.GYM_WARNINGS_ENABLED = document.getElementById('gym-toggle').checked;
                CONFIG.BOOSTER_WARNINGS_ENABLED = document.getElementById('booster-toggle').checked;
                CONFIG.PAGE_ENTRY_WARNINGS = document.getElementById('page-entry-toggle').checked;
                CONFIG.GYM_WARNING_HOURS = parseInt(document.getElementById('gym-hours-input').value);
                CONFIG.BOOSTER_WARNING_HOURS = parseInt(document.getElementById('booster-hours-input').value);
                
                storage.set('tornApiKey', CONFIG.API_KEY);
                storage.set('enabled', CONFIG.ENABLED);
                storage.set('gymWarningsEnabled', CONFIG.GYM_WARNINGS_ENABLED);
                storage.set('boosterWarningsEnabled', CONFIG.BOOSTER_WARNINGS_ENABLED);
                storage.set('pageEntryWarnings', CONFIG.PAGE_ENTRY_WARNINGS);
                storage.set('gymWarningHours', CONFIG.GYM_WARNING_HOURS);
                storage.set('boosterWarningHours', CONFIG.BOOSTER_WARNING_HOURS);
                
                e.target.textContent = '✓ Saved!';
                setTimeout(() => {
                    e.target.textContent = '💾 Save Settings';
                    panel.classList.remove('open');
                }, 1500);
            }
        });
    }

    // Initialize
    function init() {
        addStyles();
        createSettingsPanel();
        interceptGym();
        interceptBoosters();
        
        checkRankedWar();
        setInterval(checkRankedWar, CONFIG.CHECK_INTERVAL);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
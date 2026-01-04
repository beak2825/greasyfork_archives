// ==UserScript==
// @name         Phantom Core v1.3.1 Beta
// @namespace    http://tampermonkey.net/
// @version      1.3.1 Beta
// @description  Universal nano plugin host: Loads Phantom Plugins for TornPDA on Torn.com
// @author       Daturax [2627396]
// @match        https://www.torn.com/*
// @match        https://beta.tornstats.com/*
// @icon         https://images2.imgbox.com/4b/15/ke3r9iVY_o.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @connect      api.torn.com
// @connect      docs.google.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-end
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/559916/Phantom%20Core%20v131%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/559916/Phantom%20Core%20v131%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CORE_VERSION = '1.3.1 Beta';
    const CORE_ID = 'phantom_core_' + CORE_VERSION.replace(/\./g, '_').replace(/\s+/g, '_');
    
    // Error handler
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (message && (message.includes('Cannot redefine property: GM') || 
                        message.includes('GM') && message.includes('redefine'))) {
            return true;
        }
        
        if (message && (message.includes('Content Security Policy') || 
                        message.includes('violates the following Content Security Policy'))) {
            return true;
        }
        
        if (message && message.includes('google') && message.includes('analytics')) {
            return true;
        }
        
        if (message && message.includes('phantom')) {
            console.warn('Phantom Core caught error:', message, error);
            return true;
        }
        
        if (originalErrorHandler) {
            return originalErrorHandler(message, source, lineno, colno, error);
        }
        return false;
    };
    
    // Prevent duplicate initialization
    if (window[CORE_ID] && window[CORE_ID].initialized) {
        console.log(`Phantom ${CORE_VERSION}: Using existing instance`);
        return;
    }
    
    // State container
    const CORE_STATE = {
        version: CORE_VERSION,
        initialized: false,
        isLeader: false,
        isFollower: false,
        broadcastChannel: null,
        tabId: Math.random().toString(36).substring(2, 10),
        uiReady: false,
        allPluginsLoaded: false,
        loadedPlugins: new Set(),
        pluginIcons: new Map(),
        uiFinalized: false,
        windowSize: 280,
        hybridModeEnabled: false,
        gatekeeper: null,
        inLockdown: false,
        lockdownStart: 0,
        selfDestructTimeout: null,
        masterState: null,
        localState: null,
        pluginLoaderInterval: null,
        glowIntervals: new Map(),
        cleanupCallbacks: [],
        pluginQueue: [],
        pluginLoading: false,
        pendingRequests: new Map(),
        retryCount: 0
    };
    
    // Store in window
    try {
        window[CORE_ID] = CORE_STATE;
    } catch (e) {
        console.error('Failed to initialize core state:', e);
        return;
    }

    // Configuration
    const CONFIG = {
        VERSION: CORE_VERSION,
        API_RATE_LIMIT: 80,
        CACHE_TTL: 86400000,
        DEFAULT_WINDOW_SIZE: 280,
        BASE_API_URL: 'https://api.torn.com',
        MAX_PLUGINS: 50,
        GATEKEEPER_VERIFICATION_SHEET_URL: "https://docs.google.com/spreadsheets/d/1fUmO0cEzUkRqJyakKkZBsFFRyDfITOs63p7h8aDKgHg/gviz/tq?tqx=out:json",
        GATEKEEPER_VERIFICATION_TTL: 86400000,
        GATEKEEPER_LOCKDOWN_DURATION: 86400000,
        HYBRID_MODES: ['solo', 'hybrid'],
        DEFAULT_HYBRID_MODE: 'hybrid',
        LOCK_KEY: 'phantomCoreLock',
        HEARTBEAT_INTERVAL: 1000,
        HEARTBEAT_TIMEOUT: 2500,
        LEADER_SYNC_INTERVAL: 2000,
        LAUNCHER_COLUMNS: 3,
        GLOW_INTERVAL: 10000,
        GLOW_DURATION: 2000,
        LAZY_LOAD_BATCH_SIZE: 3,
        LAZY_LOAD_DELAY: 100,
        MAX_RETRIES: 3,
        ALERT_TOAST_DELAY: 30000
    };

    // Theme defaults
    const THEME_DEFAULTS = {
        primaryColor: '#00ff00',
        backgroundColor: 'rgba(0,0,0,0.7)',
        frostBlur: '10px',
        buttonGlow: true,
        windowTransparency: 0.7,
        windowFrost: 10
    };

    // Wait for DOM
    const waitForDOMReady = () => {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    };

    // Safe sanitizer
    const XSSSanitizer = {
        sanitize: function(html) {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            temp.querySelectorAll('script, style, iframe').forEach(el => el.remove());
            return temp.innerHTML;
        }
    };

    // Cache manager
    class CacheManager {
        constructor() {
            this.cache = new Map();
            this.accessTimes = new Map();
        }

        get(key, ignoreExpiry = false) {
            const item = this.cache.get(key);
            if (!item) return null;
            if (!ignoreExpiry && Date.now() > item.expiry) {
                this.delete(key);
                return null;
            }
            this.accessTimes.set(key, Date.now());
            return item.data;
        }

        set(key, data, ttl = CONFIG.CACHE_TTL) {
            const now = Date.now();
            if (this.cache.size >= 100) this.evictLRU();
            this.cache.set(key, {data, expiry: now + ttl, timestamp: now});
            this.accessTimes.set(key, now);
        }

        delete(key) {
            this.cache.delete(key);
            this.accessTimes.delete(key);
        }

        evictLRU() {
            if (this.accessTimes.size === 0) return;
            let lruKey = null;
            let oldestTime = Date.now();
            for (const [key, time] of this.accessTimes) {
                if (time < oldestTime) {
                    oldestTime = time;
                    lruKey = key;
                }
            }
            if (lruKey) this.delete(lruKey);
        }

        clear() {
            this.cache.clear();
            this.accessTimes.clear();
        }
    }

    // GateKeeper - Fixed API key placeholder
    class GateKeeper {
        constructor(safeGM, api, toastManager) {
            this.safeGM = safeGM;
            this.api = api;
            this.toastManager = toastManager;
            this.verificationData = {
                verified: false,
                lastCheck: 0,
                lastSuccessfulVerification: 0,
                userName: '',
                userId: '',
                userAlert: '',
                lockdownStart: 0,
                lastDailyToast: 0,
                alertShown: false
            };
            this.alertToastCount = 0;
            this.lastAlertReset = 0;
            this.verificationInterval = null;
            this.lockdownTimer = null;
            this.initialized = false;
            this.isLockdown = false;
            this.flashInterval = null;
            this.alertTimeout = null;
        }

        async init() {
            console.log(`GateKeeper ${CORE_VERSION}: Initializing...`);
            this.loadVerificationData();
            await this.verifyUser();
            this.startVerificationChecks();
            this.initialized = true;
            console.log(`GateKeeper ${CORE_VERSION}: Ready`);
            return true;
        }

        loadVerificationData() {
            try {
                const stored = this.safeGM.getValue('gatekeeper_data', null);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.verificationData = parsed.verificationData || this.verificationData;
                    this.alertToastCount = parsed.alertToastCount || 0;
                    this.lastAlertReset = parsed.lastAlertReset || Date.now();
                    this.verificationData.lastDailyToast = parsed.lastDailyToast || 0;
                    
                    // Initialize missing fields
                    if (!this.verificationData.lastSuccessfulVerification) {
                        this.verificationData.lastSuccessfulVerification = 0;
                    }
                    if (this.verificationData.alertShown === undefined) {
                        this.verificationData.alertShown = false;
                    }
                    
                    if (this.verificationData.lockdownStart > 0) {
                        const elapsed = Date.now() - this.verificationData.lockdownStart;
                        if (elapsed >= CONFIG.GATEKEEPER_LOCKDOWN_DURATION) {
                            this.handleSelfDestruct();
                        } else {
                            this.isLockdown = true;
                            if (window[CORE_ID]) {
                                window[CORE_ID].inLockdown = true;
                                window[CORE_ID].lockdownStart = this.verificationData.lockdownStart;
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('GateKeeper: Failed to load stored data');
            }
        }

        saveVerificationData() {
            try {
                const data = {
                    verificationData: this.verificationData,
                    alertToastCount: this.alertToastCount,
                    lastAlertReset: this.lastAlertReset,
                    lastDailyToast: this.verificationData.lastDailyToast,
                    savedAt: Date.now()
                };
                this.safeGM.setValue('gatekeeper_data', JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('GateKeeper: Failed to save data', error);
                return false;
            }
        }

        async fetchTornUserData() {
            return new Promise((resolve, reject) => {
                // TornPDA will replace this
                const apiKey = '###PDA-APIKEY###';

                const url = `${CONFIG.BASE_API_URL}/v2/user/basic?striptags=true&key=${apiKey}`;
                
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    fetch(url)
                        .then(response => {
                            if (response.ok) return response.json();
                            throw new Error(`HTTP ${response.status}`);
                        })
                        .then(data => {
                            if (data.error) {
                                reject(new Error(`Torn API Error: ${data.error.code}`));
                            } else if (data.profile) {
                                resolve({
                                    name: data.profile.name,
                                    id: data.profile.id.toString(),
                                    level: data.profile.level
                                });
                            } else {
                                reject(new Error('Invalid API response'));
                            }
                        })
                        .catch(error => {
                            reject(error);
                        });
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 8000,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.error) {
                                    reject(new Error(`Torn API Error: ${data.error.code}`));
                                } else if (data.profile) {
                                    resolve({
                                        name: data.profile.name,
                                        id: data.profile.id.toString(),
                                        level: data.profile.level
                                    });
                                } else {
                                    reject(new Error('Invalid API response'));
                                }
                            } catch (e) {
                                reject(new Error('Failed to parse API response'));
                            }
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error('Network error'));
                    },
                    ontimeout: () => {
                        reject(new Error('API request timed out'));
                    }
                });
            });
        }

        async fetchVerificationSheet() {
            return new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    fetch(CONFIG.GATEKEEPER_VERIFICATION_SHEET_URL)
                        .then(response => {
                            if (response.ok) return response.text();
                            throw new Error(`HTTP ${response.status}`);
                        })
                        .then(text => {
                            try {
                                let jsonText = text;
                                if (jsonText.includes('google.visualization.Query.setResponse')) {
                                    jsonText = jsonText.substring(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1);
                                }
                                const data = JSON.parse(jsonText);
                                const table = data.table;
                                if (!table?.rows) {
                                    reject(new Error('No verification data available'));
                                    return;
                                }

                                const result = [];
                                for (let i = 0; i < table.rows.length; i++) {
                                    const row = table.rows[i];
                                    if (row.c && row.c.length >= 3) {
                                        const user_name = row.c[0]?.v || '';
                                        const user_id = row.c[1]?.v || '';
                                        const user_alert = row.c[2]?.v || '';
                                        if (user_name && user_id) {
                                            result.push({
                                                user_name: user_name.toString().trim(),
                                                user_id: user_id.toString().trim(),
                                                user_alert: user_alert.toString().trim()
                                            });
                                        }
                                    }
                                }
                                resolve(result);
                            } catch (error) {
                                reject(new Error('Failed to parse verification sheet'));
                            }
                        })
                        .catch(() => reject(new Error('Cannot access verification sheet')));
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: CONFIG.GATEKEEPER_VERIFICATION_SHEET_URL,
                    timeout: 10000,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                let jsonText = response.responseText;
                                if (jsonText.includes('google.visualization.Query.setResponse')) {
                                    jsonText = jsonText.substring(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1);
                                }
                                const data = JSON.parse(jsonText);
                                const table = data.table;
                                if (!table?.rows) {
                                    reject(new Error('No verification data available'));
                                    return;
                                }

                                const result = [];
                                for (let i = 0; i < table.rows.length; i++) {
                                    const row = table.rows[i];
                                    if (row.c && row.c.length >= 3) {
                                        const user_name = row.c[0]?.v || '';
                                        const user_id = row.c[1]?.v || '';
                                        const user_alert = row.c[2]?.v || '';
                                        if (user_name && user_id) {
                                            result.push({
                                                user_name: user_name.toString().trim(),
                                                user_id: user_id.toString().trim(),
                                                user_alert: user_alert.toString().trim()
                                            });
                                        }
                                    }
                                }
                                resolve(result);
                            } catch (error) {
                                reject(new Error('Failed to parse verification sheet'));
                            }
                        } else {
                            reject(new Error(`Verification server error: ${response.status}`));
                        }
                    },
                    onerror: () => reject(new Error('Cannot connect to verification server')),
                    ontimeout: () => reject(new Error('Verification server timeout'))
                });
            });
        }

        async verifyUser() {
            const now = Date.now();
            
            // Check if we have a recent successful verification
            const timeSinceLastSuccess = now - this.verificationData.lastSuccessfulVerification;
            const needsSheetCheck = timeSinceLastSuccess >= CONFIG.GATEKEEPER_VERIFICATION_TTL;
            
            // If we have a recent successful verification and not in lockdown, skip sheet check
            if (!needsSheetCheck && this.verificationData.verified && !this.isLockdown) {
                console.log('GateKeeper: Using cached verification');
                this.verificationData.lastCheck = now;
                this.saveVerificationData();
                
                this.verificationData.alertShown = false;
                this.scheduleDelayedAlert();
                return true;
            }
            
            try {
                const userData = await this.fetchTornUserData();
                const sheetData = await this.fetchVerificationSheet();
                
                let verified = false;
                let userAlert = '';

                const userFound = sheetData.find(row => {
                    const nameMatch = row.user_name.toLowerCase() === userData.name.toLowerCase();
                    const idMatch = row.user_id === userData.id;
                    return nameMatch && idMatch;
                });

                if (userFound) {
                    verified = true;
                    userAlert = userFound.user_alert;
                    this.verificationData.lastSuccessfulVerification = now;
                }

                const wasLockdown = this.isLockdown;
                this.verificationData.verified = verified;
                this.verificationData.userName = userData.name;
                this.verificationData.userId = userData.id;
                this.verificationData.userAlert = userAlert;
                this.verificationData.lastCheck = now;
                this.verificationData.alertShown = false;

                if (verified) {
                    this.verificationData.lockdownStart = 0;
                    this.isLockdown = false;
                    if (window[CORE_ID]) {
                        window[CORE_ID].inLockdown = false;
                        window[CORE_ID].lockdownStart = 0;
                    }
                    
                    this.toastManager.show('✅ Verification successful!', 'success', 3000);
                    this.showDailyToastIfNeeded();
                    this.scheduleDelayedAlert();

                    if (wasLockdown) {
                        this.broadcastMessage('lockdownEnded', { verified: true, userName: userData.name });
                        this.updateUIAfterVerification();
                    }
                } else {
                    this.handleVerificationFailure();
                }

                this.saveVerificationData();
                return verified;

            } catch (error) {
                console.error('GateKeeper: Verification failed', error);
                
                if (!needsSheetCheck && this.verificationData.verified && !this.isLockdown) {
                    console.log('GateKeeper: Network error, but using cached verification');
                    return true;
                }
                
                this.handleVerificationFailure();
                return false;
            }
        }

        scheduleDelayedAlert() {
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
            }
            
            this.alertTimeout = setTimeout(() => {
                if (this.verificationData.verified && 
                    this.verificationData.userAlert && 
                    this.canShowAlertToast() && 
                    !this.verificationData.alertShown) {
                    
                    this.alertToastCount++;
                    this.verificationData.alertShown = true;
                    this.saveVerificationData();
                    this.toastManager.show(`📢 ${this.verificationData.userAlert}`, 'info', 5000);
                }
            }, CONFIG.ALERT_TOAST_DELAY);
        }

        handleVerificationFailure() {
            const now = Date.now();
            this.verificationData.verified = false;
            this.verificationData.alertShown = false;
            
            if (!this.verificationData.lockdownStart) {
                this.verificationData.lockdownStart = now;
                this.isLockdown = true;
                if (window[CORE_ID]) {
                    window[CORE_ID].inLockdown = true;
                    window[CORE_ID].lockdownStart = now;
                }
                
                this.startLockdownCountdown();
                this.startSelfDestructTimer();
            }

            this.saveVerificationData();
            this.toastManager.show('⚠️ User not verified - Lockdown active', 'warning', 4000);
            
            this.broadcastMessage('lockdownStarted', { lockdownStart: now });
            this.updateUILockdownMode();
        }

        handleSelfDestruct() {
            console.error('GateKeeper: 24-hour lockdown expired');
            this.toastManager.show('🔒 24-hour verification period expired', 'error', 8000);
            
            this.broadcastMessage('selfDestruct', { reason: '24-hour verification period expired' });
            
            this.cleanupIntervals();
            this.removeAllPhantomElements();
            
            try {
                localStorage.removeItem('gatekeeper_data');
                localStorage.removeItem('phantom_core_settings');
                localStorage.removeItem('phantom_enabled_plugins');
            } catch (error) {}
            
            if (window[CORE_ID]) {
                window[CORE_ID].initialized = false;
            }
            try { delete window.phantomCore; } catch (e) {}
            try { delete window.PhantomCoreAPI; } catch (e) {}
            try { delete window.GatekeeperAPI; } catch (e) {}
            
            setTimeout(() => {
                alert('Phantom Core has been disabled due to failed verification.');
            }, 1000);
        }

        startSelfDestructTimer() {
            if (window[CORE_ID] && window[CORE_ID].selfDestructTimeout) {
                clearTimeout(window[CORE_ID].selfDestructTimeout);
            }
            
            const timeLeft = CONFIG.GATEKEEPER_LOCKDOWN_DURATION - (Date.now() - this.verificationData.lockdownStart);
            
            if (timeLeft > 0) {
                if (window[CORE_ID]) {
                    window[CORE_ID].selfDestructTimeout = setTimeout(() => {
                        this.handleSelfDestruct();
                    }, timeLeft);
                }
            } else {
                this.handleSelfDestruct();
            }
        }

        startVerificationChecks() {
            setTimeout(() => this.verifyUser(), 3000);
            
            this.verificationInterval = setInterval(() => {
                this.verifyUser();
            }, 180000);
        }

        startLockdownCountdown() {
            this.lockdownTimer = setInterval(() => {
                if (!this.verificationData.verified && this.verificationData.lockdownStart) {
                    const elapsed = Date.now() - this.verificationData.lockdownStart;
                    const timeLeft = CONFIG.GATEKEEPER_LOCKDOWN_DURATION - elapsed;
                    
                    if (timeLeft <= 0) {
                        this.handleSelfDestruct();
                        clearInterval(this.lockdownTimer);
                    }
                } else if (this.verificationData.verified) {
                    clearInterval(this.lockdownTimer);
                }
            }, 60000);
        }

        updateUILockdownMode() {
            const button = window.phantomCore?.ui?.mainButton;
            if (!button) return;
            
            if (this.isLockdown) {
                button.classList.add('phantom-lockdown-button');
                button.classList.remove('phantom-leader-button', 'phantom-follower-button', 'phantom-solo-button');
                button.style.cursor = 'not-allowed';
                button.style.pointerEvents = 'none';
                this.startButtonFlashing();
                window.phantomCore?.ui?.hideAllWindows();
            } else {
                button.classList.remove('phantom-lockdown-button');
                button.style.cursor = 'pointer';
                button.style.pointerEvents = 'auto';
                
                const currentMode = window.phantomCore?.hybridManager?.runningMode || CONFIG.DEFAULT_HYBRID_MODE;
                if (currentMode === 'solo') {
                    button.classList.add('phantom-solo-button');
                    button.style.opacity = '0.5';
                    button.style.cursor = 'default';
                } else {
                    button.classList.remove('phantom-solo-button');
                    button.style.opacity = '';
                    button.style.cursor = 'pointer';
                }
                
                if (window[CORE_ID] && window[CORE_ID].isLeader) {
                    button.classList.add('phantom-leader-button');
                } else if (window[CORE_ID] && window[CORE_ID].isFollower) {
                    button.classList.add('phantom-follower-button');
                }
                this.stopButtonFlashing();
            }
        }

        startButtonFlashing() {
            const button = window.phantomCore?.ui?.mainButton;
            if (!button) return;
            
            let isRed = true;
            this.flashInterval = setInterval(() => {
                if (button) {
                    button.style.backgroundColor = isRed ? 'rgba(255,0,0,0.85)' : 'rgba(200,0,0,0.85)';
                    isRed = !isRed;
                }
            }, 500);
        }

        stopButtonFlashing() {
            if (this.flashInterval) {
                clearInterval(this.flashInterval);
                this.flashInterval = null;
            }
            
            const button = window.phantomCore?.ui?.mainButton;
            if (button) {
                button.style.backgroundColor = '';
            }
        }

        updateUIAfterVerification() {
            this.updateUILockdownMode();
            if (window.phantomCore?.ui) {
                window.phantomCore.ui.refreshAllVisuals();
            }
        }

        showDailyToastIfNeeded() {
            if (!this.verificationData.verified) return;
            const now = Date.now();
            const lastToast = this.verificationData.lastDailyToast || 0;
            if (now - lastToast >= 86400000) {
                this.verificationData.lastDailyToast = now;
                this.saveVerificationData();
                this.toastManager.show('✅ You are verified and ready!', 'success', 5000);
            }
        }

        canShowAlertToast() {
            const now = Date.now();
            if (now - this.lastAlertReset > 86400000) {
                this.alertToastCount = 0;
                this.lastAlertReset = now;
                this.saveVerificationData();
            }
            return this.alertToastCount < 5;
        }

        removeAllPhantomElements() {
            document.querySelectorAll('.phantom-core, .phantom-main-button, .phantom-window').forEach(el => el.remove());
            document.querySelectorAll('style[id*="phantom"]').forEach(el => el.remove());
        }

        broadcastMessage(action, payload) {
            if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                try {
                    window[CORE_ID].broadcastChannel.postMessage({
                        from: window[CORE_ID].tabId,
                        action: action,
                        payload: payload
                    });
                } catch (error) {
                    console.warn('GateKeeper: Failed to broadcast message', error);
                }
            }
        }

        cleanupIntervals() {
            if (this.verificationInterval) clearInterval(this.verificationInterval);
            if (this.lockdownTimer) clearInterval(this.lockdownTimer);
            if (this.flashInterval) clearInterval(this.flashInterval);
            if (this.alertTimeout) clearTimeout(this.alertTimeout);
            if (window[CORE_ID] && window[CORE_ID].selfDestructTimeout) {
                clearTimeout(window[CORE_ID].selfDestructTimeout);
                window[CORE_ID].selfDestructTimeout = null;
            }
        }

        cleanup() {
            this.cleanupIntervals();
        }

        isVerified() {
            return this.verificationData.verified && !this.isLockdown;
        }

        getVerificationStatus() {
            return {
                verified: this.verificationData.verified,
                userName: this.verificationData.userName,
                userId: this.verificationData.userId,
                lastCheck: this.verificationData.lastCheck,
                lastSuccessfulVerification: this.verificationData.lastSuccessfulVerification,
                userAlert: this.verificationData.userAlert,
                isLockdown: this.isLockdown,
                lockdownStart: this.verificationData.lockdownStart,
                timeLeft: this.isLockdown ? 
                    CONFIG.GATEKEEPER_LOCKDOWN_DURATION - (Date.now() - this.verificationData.lockdownStart) : 0
            };
        }
    }

    // Hybrid Manager with Solo mode
    class HybridManager {
        constructor() {
            this.tabId = window[CORE_ID] ? window[CORE_ID].tabId : Math.random().toString(36).substring(2, 10);
            this.lockKey = CONFIG.LOCK_KEY;
            this.heartbeatInterval = CONFIG.HEARTBEAT_INTERVAL;
            this.heartbeatTimeout = CONFIG.HEARTBEAT_TIMEOUT;
            this.heartbeatTimer = null;
            this.leaderSyncInterval = null;
            this.pendingApiCalls = new Map();
            this.runningMode = CONFIG.DEFAULT_HYBRID_MODE;
            this.isLeader = false;
            this.masterState = {plugins: {}, settings: {}, enabledPlugins: [], version: 0, gatekeeperStatus: null, inLockdown: false};
            this.localState = null;
            
            this.loadMode();
            
            if (window[CORE_ID]) {
                window[CORE_ID].isLeader = this.isLeader;
                window[CORE_ID].isFollower = !this.isLeader;
                window[CORE_ID].hybridModeEnabled = this.runningMode === 'hybrid';
            }
            this.setupBroadcastChannel();
            this.setupStorageListener();
        }

        loadMode() {
            try {
                const saved = localStorage.getItem('phantom_hybrid_mode');
                if (saved) {
                    // Handle migration from 'single' to 'solo'
                    if (saved === 'single') {
                        this.runningMode = 'solo';
                        this.saveMode();
                    } else if (saved === 'solo' || saved === 'hybrid') {
                        this.runningMode = saved;
                    }
                }
            } catch (e) {}
        }

        saveMode() {
            try {
                localStorage.setItem('phantom_hybrid_mode', this.runningMode);
                return true;
            } catch (e) {
                return false;
            }
        }

        setupBroadcastChannel() {
            if (!window[CORE_ID] || !window[CORE_ID].broadcastChannel) return;
            
            window[CORE_ID].broadcastChannel.onmessage = async (event) => {
                const { from, action, payload, requestId } = event.data;
                if (from === this.tabId) return;

                switch (action) {
                    case 'stateUpdate':
                        if (!this.isLeader && payload.version > (this.localState?.version || 0)) {
                            this.localState = this.deepClone(payload);
                            this.applyStateToCore(this.localState);
                            if (this.runningMode === 'hybrid') {
                                this.startPluginLoader();
                            } else {
                                this.stopPluginLoader();
                            }
                        }
                        break;

                    case 'apiCall':
                        if (this.isLeader) {
                            const { pluginName, methodName, args } = payload;
                            try {
                                const result = await this.executePluginApi(pluginName, methodName, args);
                                this.masterState.version++;
                                if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                                    window[CORE_ID].broadcastChannel.postMessage({ 
                                        from: this.tabId, 
                                        action: 'stateUpdate', 
                                        payload: this.deepClone(this.masterState) 
                                    });
                                    window[CORE_ID].broadcastChannel.postMessage({ 
                                        from: this.tabId, 
                                        action: 'apiResponse', 
                                        payload: { requestId, result } 
                                    });
                                }
                                this.saveState();
                            } catch (err) {
                                if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                                    window[CORE_ID].broadcastChannel.postMessage({ 
                                        from: this.tabId, 
                                        action: 'apiResponse', 
                                        payload: { requestId, error: err.message } 
                                    });
                                }
                            }
                        }
                        break;

                    case 'apiResponse':
                        if (!this.isLeader && this.pendingApiCalls.has(requestId)) {
                            const { resolve, reject } = this.pendingApiCalls.get(requestId);
                            this.pendingApiCalls.delete(requestId);
                            payload.error ? reject(new Error(payload.error)) : resolve(payload.result);
                        }
                        break;

                    case 'leaderLeft':
                        this.tryAcquireLock();
                        break;

                    case 'toggleMode':
                        if (payload && (payload.mode === 'solo' || payload.mode === 'hybrid')) {
                            this.runningMode = payload.mode;
                            this.saveMode();
                            if (window[CORE_ID]) {
                                window[CORE_ID].hybridModeEnabled = this.runningMode === 'hybrid';
                            }
                            
                            if (this.isLeader) {
                                if (this.runningMode === 'solo') {
                                    this.stopPluginLoader();
                                } else {
                                    this.startPluginLoader();
                                }
                            } else {
                                if (this.runningMode === 'hybrid') {
                                    this.startPluginLoader();
                                } else {
                                    this.stopPluginLoader();
                                }
                            }
                            
                            // Update button visual state
                            if (window.phantomCore?.gatekeeper) {
                                window.phantomCore.gatekeeper.updateUILockdownMode();
                            }
                            
                            if (window.phantomCore?.ui) {
                                window.phantomCore.ui.refreshAllVisuals();
                            }
                        }
                        break;

                    case 'lockdownStarted':
                        if (window.phantomCore?.gatekeeper) {
                            window.phantomCore.gatekeeper.isLockdown = true;
                            if (window[CORE_ID]) {
                                window[CORE_ID].inLockdown = true;
                                window[CORE_ID].lockdownStart = payload.lockdownStart;
                            }
                            window.phantomCore.gatekeeper.updateUILockdownMode();
                        }
                        break;

                    case 'lockdownEnded':
                        if (window.phantomCore?.gatekeeper) {
                            window.phantomCore.gatekeeper.isLockdown = false;
                            if (window[CORE_ID]) {
                                window[CORE_ID].inLockdown = false;
                                window[CORE_ID].lockdownStart = 0;
                            }
                            window.phantomCore.gatekeeper.updateUILockdownMode();
                        }
                        break;

                    case 'selfDestruct':
                        if (window.phantomCore?.gatekeeper) {
                            window.phantomCore.gatekeeper.handleSelfDestruct();
                        }
                        break;

                    case 'themeUpdate':
                        if (window.phantomCore?.settings) {
                            window.phantomCore.settings.theme = payload;
                            window.phantomCore.saveSettings();
                            if (window.phantomCore.ui) {
                                window.phantomCore.ui.applyTheme();
                            }
                        }
                        break;
                }
            };
        }

        setupStorageListener() {
            window.addEventListener('storage', (e) => {
                if (e.key === this.lockKey) {
                    const lock = JSON.parse(e.newValue || '{}');
                    if (lock.tabId !== this.tabId && this.isLeader) {
                        this.resignLeadership();
                    }
                }
            });
        }

        deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        async saveState() {
            try {
                if (!this.isLeader) return;
                const stateToSave = {...this.masterState, savedAt: Date.now()};
                localStorage.setItem('phantom_core_state', JSON.stringify(stateToSave));
            } catch (e) {}
        }

        async loadState() {
            try {
                const saved = localStorage.getItem('phantom_core_state');
                if (saved) {
                    const state = JSON.parse(saved);
                    this.masterState = this.deepClone(state);
                    this.localState = this.deepClone(state);
                    return true;
                }
            } catch {}
            return false;
        }

        tryAcquireLock() {
            const now = performance.now();
            const lockRaw = localStorage.getItem(this.lockKey);
            const lock = lockRaw ? JSON.parse(lockRaw) : {};

            if (!lock.tabId || (now - lock.timestamp) > this.heartbeatTimeout) {
                localStorage.setItem(this.lockKey, JSON.stringify({ tabId: this.tabId, timestamp: now }));
                this.becomeLeader();
            } else if (lock.tabId === this.tabId) {
                localStorage.setItem(this.lockKey, JSON.stringify({ tabId: this.tabId, timestamp: now }));
                if (!this.isLeader) this.becomeLeader();
            } else {
                if (this.isLeader) this.resignLeadership();
            }
        }

        becomeLeader() {
            if (this.isLeader) return;
            this.isLeader = true;
            if (window[CORE_ID]) {
                window[CORE_ID].isLeader = true;
                window[CORE_ID].isFollower = false;
            }
            this.startHeartbeat();
            this.startLeaderSync();
            if (this.runningMode === 'hybrid') {
                this.startPluginLoader();
            }
            const button = window.phantomCore?.ui?.mainButton;
            if (button) {
                button.classList.add('phantom-leader-button');
                button.classList.remove('phantom-follower-button', 'phantom-solo-button');
            }
            this.startGlowEffect('leader');
        }

        resignLeadership() {
            if (!this.isLeader) return;
            this.isLeader = false;
            if (window[CORE_ID]) {
                window[CORE_ID].isLeader = false;
                window[CORE_ID].isFollower = true;
            }
            this.stopHeartbeat();
            this.stopLeaderSync();
            this.stopPluginLoader();
            const button = window.phantomCore?.ui?.mainButton;
            if (button) {
                button.classList.add('phantom-follower-button');
                button.classList.remove('phantom-leader-button', 'phantom-solo-button');
            }
            this.stopGlowEffect('leader');
            this.startGlowEffect('follower');
        }

        startHeartbeat() {
            this.heartbeatTimer = setInterval(() => {
                if (this.isLeader) {
                    localStorage.setItem(this.lockKey, JSON.stringify({ 
                        tabId: this.tabId, 
                        timestamp: performance.now() 
                    }));
                }
            }, this.heartbeatInterval);
        }

        stopHeartbeat() {
            clearInterval(this.heartbeatTimer);
        }

        startLeaderSync() {
            this.leaderSyncInterval = setInterval(() => {
                if (this.isLeader) {
                    this.updateMasterState();
                    if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                        window[CORE_ID].broadcastChannel.postMessage({ 
                            from: this.tabId, 
                            action: 'stateUpdate', 
                            payload: this.deepClone(this.masterState) 
                        });
                    }
                    this.saveState();
                }
            }, CONFIG.LEADER_SYNC_INTERVAL);
        }

        stopLeaderSync() {
            clearInterval(this.leaderSyncInterval);
        }

        updateMasterState() {
            if (!window.phantomCore) return;
            this.masterState.settings = window.phantomCore.settings || {};
            this.masterState.enabledPlugins = Array.from(window.phantomCore.pluginManager?.enabledPlugins || []);
            this.masterState.gatekeeperStatus = window.phantomCore.gatekeeper?.getVerificationStatus();
            this.masterState.inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
            this.masterState.version++;
        }

        applyStateToCore(state) {
            if (!window.phantomCore) return;
            if (state.settings) {
                const currentTheme = window.phantomCore.settings?.theme || {};
                window.phantomCore.settings = { ...state.settings, theme: currentTheme };
                if (window.phantomCore.ui) {
                    window.phantomCore.ui.applyTheme();
                }
            }
            if (state.enabledPlugins && window.phantomCore.pluginManager) {
                window.phantomCore.pluginManager.enabledPlugins = new Set(state.enabledPlugins);
            }
            if (state.gatekeeperStatus && window.phantomCore.gatekeeper) {
                window.phantomCore.gatekeeper.verificationData = state.gatekeeperStatus;
                window.phantomCore.gatekeeper.isLockdown = state.inLockdown || false;
                if (window[CORE_ID]) {
                    window[CORE_ID].inLockdown = state.inLockdown || false;
                }
                window.phantomCore.gatekeeper.updateUILockdownMode();
            }
        }

        startGlowEffect(type) {
            this.stopGlowEffect(type);
            
            const intervalId = setInterval(() => {
                const button = window.phantomCore?.ui?.mainButton;
                if (button) {
                    const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
                    const currentMode = this.runningMode;
                    if (!inLockdown && currentMode === 'hybrid') {
                        if ((type === 'leader' && this.isLeader) || 
                            (type === 'follower' && !this.isLeader)) {
                            
                            button.classList.add(`phantom-${type}-glow`);
                            
                            setTimeout(() => {
                                if (button) button.classList.remove(`phantom-${type}-glow`);
                            }, CONFIG.GLOW_DURATION);
                        }
                    }
                }
            }, CONFIG.GLOW_INTERVAL);
            
            if (window[CORE_ID]) {
                window[CORE_ID].glowIntervals.set(type, intervalId);
            }
        }

        stopGlowEffect(type) {
            if (window[CORE_ID]) {
                const intervalId = window[CORE_ID].glowIntervals.get(type);
                if (intervalId) {
                    clearInterval(intervalId);
                    window[CORE_ID].glowIntervals.delete(type);
                }
            }
            const button = window.phantomCore?.ui?.mainButton;
            if (button) button.classList.remove(`phantom-${type}-glow`);
        }

        async executePluginApi(pluginName, methodName, args) {
            await new Promise(r => setTimeout(r, 30));
            return `Plugin API ${pluginName}.${methodName} executed`;
        }

        startPluginLoader() {
            if (window[CORE_ID] && window[CORE_ID].pluginLoaderInterval) return;
            if (window[CORE_ID]) {
                window[CORE_ID].pluginLoaderInterval = setInterval(() => {
                    if (this.runningMode === 'solo' && !this.isLeader) {
                        this.stopPluginLoader();
                        return;
                    }
                }, 3000);
            }
        }

        stopPluginLoader() {
            if (window[CORE_ID] && window[CORE_ID].pluginLoaderInterval) {
                clearInterval(window[CORE_ID].pluginLoaderInterval);
                window[CORE_ID].pluginLoaderInterval = null;
            }
        }

        toggleRunningMode() {
            this.runningMode = this.runningMode === 'solo' ? 'hybrid' : 'solo';
            this.saveMode();
            if (window[CORE_ID]) {
                window[CORE_ID].hybridModeEnabled = this.runningMode === 'hybrid';
                if (window[CORE_ID].broadcastChannel) {
                    window[CORE_ID].broadcastChannel.postMessage({ 
                        from: this.tabId, 
                        action: 'toggleMode', 
                        payload: { mode: this.runningMode } 
                    });
                }
            }
            if (this.isLeader) {
                if (this.runningMode === 'solo') {
                    this.stopPluginLoader();
                } else {
                    this.startPluginLoader();
                }
            } else {
                if (this.runningMode === 'hybrid') {
                    this.startPluginLoader();
                } else {
                    this.stopPluginLoader();
                }
            }
            
            // Update button visual state
            if (window.phantomCore?.gatekeeper) {
                window.phantomCore.gatekeeper.updateUILockdownMode();
            }
            
            if (window.phantomCore?.ui) {
                window.phantomCore.ui.refreshAllVisuals();
            }
            return this.runningMode;
        }

        async initialize() {
            await this.loadState();
            this.tryAcquireLock();
            setInterval(() => {
                if (!this.isLeader) this.tryAcquireLock();
            }, this.heartbeatInterval);
            
            window.addEventListener('beforeunload', () => {
                if (this.isLeader) {
                    localStorage.removeItem(this.lockKey);
                    if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                        window[CORE_ID].broadcastChannel.postMessage({ 
                            from: this.tabId, 
                            action: 'leaderLeft' 
                        });
                    }
                }
                if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                    window[CORE_ID].broadcastChannel.close();
                }
            });
            
            if (this.isLeader) {
                this.startGlowEffect('leader');
            } else {
                this.startGlowEffect('follower');
            }
            
            return true;
        }

        cleanup() {
            this.stopHeartbeat();
            this.stopLeaderSync();
            this.stopPluginLoader();
            this.stopGlowEffect('leader');
            this.stopGlowEffect('follower');
            this.pendingApiCalls.clear();
            if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                window[CORE_ID].broadcastChannel.close();
            }
        }
    }

    // Toast Manager
    class ToastManager {
        static show(message, type = 'info', duration = 4000) {
            const toast = document.createElement('div');
            const toastId = 'phantom-toast-' + Date.now();
            
            const typeStyles = {
                success: `background: rgba(0,0,0,0.9); border-color: var(--phantom-primary-color, #0f0); color: #fff;`,
                error: `background: rgba(255,0,0,0.9); border-color: var(--phantom-primary-color, #f00); color: #fff;`,
                warning: `background: rgba(255,165,0,0.9); border-color: var(--phantom-primary-color, #fa0); color: #fff;`,
                info: `background: rgba(0,0,0,0.9); border-color: var(--phantom-primary-color, #0f0); color: #fff;`
            };

            toast.id = toastId;
            toast.style.cssText = `
                position: fixed; top: 15px; right: 15px; 
                color: white; padding: 10px 15px; border-radius: 6px; z-index: 10050;
                font-family: Arial; font-size: 12px; max-width: 250px; word-wrap: break-word;
                box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid;
                ${typeStyles[type] || typeStyles.info}
                animation: phantomToastSlideIn 0.25s ease;
            `;
            toast.textContent = message;
            
            if (!document.body) return;
            document.body.appendChild(toast);

            if (!document.getElementById('phantom-toast-animations')) {
                const style = document.createElement('style');
                style.id = 'phantom-toast-animations';
                style.textContent = `
                    @keyframes phantomToastSlideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes phantomToastSlideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                const toastElement = document.getElementById(toastId);
                if (toastElement && toastElement.parentNode) {
                    toastElement.style.animation = 'phantomToastSlideOut 0.25s ease';
                    setTimeout(() => {
                        if (toastElement.parentNode) {
                            toastElement.parentNode.removeChild(toastElement);
                        }
                    }, 250);
                }
            }, duration);
        }
    }

    // SafeGM wrapper
    const initializeSafeGM = () => {
        let hasGM = false;
        let hasGM_xhr = false;
        
        try {
            hasGM = typeof GM_getValue !== 'undefined' && typeof GM_setValue !== 'undefined';
            hasGM_xhr = typeof GM_xmlhttpRequest !== 'undefined';
        } catch (e) {
            console.warn('Phantom Core: GM functions not available');
        }
        
        return {
            setValue: (key, value) => {
                try {
                    if (hasGM) {
                        GM_setValue(key, value);
                        return true;
                    }
                    localStorage.setItem(`phantom_${key}`, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.warn('Failed to set value:', key, error);
                    return false;
                }
            },

            getValue: (key, defaultValue) => {
                try {
                    if (hasGM) {
                        return GM_getValue(key, defaultValue);
                    }
                    const item = localStorage.getItem(`phantom_${key}`);
                    if (item === null) return defaultValue;
                    try {
                        return JSON.parse(item);
                    } catch (error) {
                        return item;
                    }
                } catch (error) {
                    return defaultValue;
                }
            },

            hasGM: hasGM,
            hasGM_xhr: hasGM_xhr
        };
    };

    // Plugin Manager
    class PluginManager {
        constructor(safeGM) {
            this.safeGM = safeGM;
            this.plugins = new Map();
            this.enabledPlugins = new Set();
            this.pluginEvents = new Map();
            this.dependencies = new Map();
            this.loadedDependencies = new Set();
            this.pluginQueue = [];
            this.isProcessingQueue = false;
            this.loadPluginSettings();
        }

        loadPluginSettings() {
            try {
                const saved = this.safeGM.getValue('phantom_enabled_plugins', []);
                this.enabledPlugins = new Set(saved);
            } catch (error) {
                this.enabledPlugins = new Set();
            }
        }

        savePluginSettings() {
            try {
                const toSave = Array.from(this.enabledPlugins);
                this.safeGM.setValue('phantom_enabled_plugins', toSave);
                return true;
            } catch (error) {
                return false;
            }
        }

        async registerPlugin(plugin) {
            if (this.plugins.size >= CONFIG.MAX_PLUGINS) return false;
            if (!plugin.id || !plugin.name || !plugin.version || !plugin.author) return false;

            plugin.icon = plugin.icon || 'https://img.icons8.com/ios/50/ffffff/application.png';
            plugin.enabled = this.enabledPlugins.has(plugin.id);
            plugin.loaded = false;

            this.plugins.set(plugin.id, plugin);
            this.pluginQueue.push(plugin);
            
            if (!this.isProcessingQueue) {
                this.processPluginQueue();
            }
            
            return true;
        }

        async processPluginQueue() {
            if (this.isProcessingQueue || this.pluginQueue.length === 0) return;
            
            this.isProcessingQueue = true;
            
            while (this.pluginQueue.length > 0) {
                const batch = this.pluginQueue.splice(0, CONFIG.LAZY_LOAD_BATCH_SIZE);
                
                for (const plugin of batch) {
                    try {
                        await this.registerPluginImmediate(plugin);
                        await new Promise(resolve => setTimeout(resolve, CONFIG.LAZY_LOAD_DELAY));
                    } catch (error) {
                        console.error(`Failed to register plugin ${plugin.id}:`, error);
                    }
                }
                
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
            
            this.isProcessingQueue = false;
        }

        async registerPluginImmediate(plugin) {
            if (window.phantomCore?.ui) {
                if (plugin.enabled && (plugin.id === 'phantomstorage' || plugin.id === 'phantomlook')) {
                    window.phantomCore.ui.addSystemPluginToLauncher(plugin);
                } else if (plugin.id !== 'phantomstorage' && plugin.id !== 'phantomlook') {
                    window.phantomCore.ui.addPluginToLauncher(plugin);
                }
            }
            
            this.emitEvent('pluginRegistered', { plugin });
        }

        enablePlugin(pluginId, silent = false) {
            try {
                const plugin = this.plugins.get(pluginId);
                if (plugin && !plugin.enabled) {
                    const deps = this.dependencies.get(pluginId) || [];
                    const missingDeps = deps.filter(dep => !this.enabledPlugins.has(dep));
                    
                    if (missingDeps.length > 0) {
                        if (!silent) {
                            ToastManager.show(`❌ Cannot enable ${plugin.name}: Missing dependencies`, 'error');
                        }
                        return false;
                    }
                    
                    plugin.enabled = true;
                    this.enabledPlugins.add(pluginId);
                    this.savePluginSettings();
                    
                    if (window.phantomCore?.ui) {
                        if (plugin.id === 'phantomstorage' || plugin.id === 'phantomlook') {
                            window.phantomCore.ui.addSystemPluginToLauncher(plugin);
                        } else {
                            window.phantomCore.ui.addPluginToLauncher(plugin);
                            window.phantomCore.ui.updateLauncherItemVisual(pluginId);
                        }
                    }
                    
                    if (!silent) {
                        ToastManager.show(`✅ ${plugin.name} enabled`, 'success');
                    }
                    
                    this.emitEvent('pluginToggled', { pluginId, enabled: true });
                    
                    if (window.phantomCore?.ui) {
                        window.phantomCore.ui.refreshAllVisuals();
                    }
                    
                    return true;
                }
                return false;
            } catch (error) {
                if (!silent) {
                    ToastManager.show(`❌ Failed to enable plugin`, 'error');
                }
                return false;
            }
        }

        disablePlugin(pluginId, silent = false) {
            try {
                const plugin = this.plugins.get(pluginId);
                if (plugin && plugin.enabled) {
                    const dependents = Array.from(this.dependencies.entries())
                        .filter(([id, deps]) => deps.includes(pluginId))
                        .map(([id]) => id)
                        .filter(id => this.enabledPlugins.has(id));
                    
                    if (dependents.length > 0) {
                        if (!silent) {
                            ToastManager.show(`❌ Cannot disable ${plugin.name}: Other plugins depend on it`, 'error');
                        }
                        return false;
                    }
                    
                    plugin.enabled = false;
                    this.enabledPlugins.delete(pluginId);
                    this.savePluginSettings();
                    
                    if (typeof plugin.cleanup === 'function' && plugin.loaded) {
                        plugin.cleanup();
                        plugin.loaded = false;
                    }
                    
                    if (!silent) {
                        ToastManager.show(`🔴 ${plugin.name} disabled`, 'warning');
                    }
                    
                    this.emitEvent('pluginToggled', { pluginId, enabled: false });
                    
                    if (window.phantomCore?.ui) {
                        window.phantomCore.ui.updateLauncherItemVisual(pluginId);
                    }
                    
                    return true;
                }
                return false;
            } catch (error) {
                if (!silent) {
                    ToastManager.show(`❌ Failed to disable plugin`, 'error');
                }
                return false;
            }
        }

        async executePlugin(pluginId, data = {}) {
            try {
                const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
                if (inLockdown && pluginId !== 'gatekeeper') {
                    ToastManager.show('❌ Phantom Core is in lockdown mode', 'error');
                    return false;
                }

                const plugin = this.plugins.get(pluginId);
                if (!plugin || !plugin.enabled) return false;

                if (!plugin.loaded && typeof plugin.init === 'function') {
                    plugin.init();
                    plugin.loaded = true;
                }

                if (typeof plugin.execute === 'function') {
                    const result = plugin.execute(data);
                    this.emitEvent('pluginExecuted', { pluginId, result });
                    return result;
                }
                
                if (typeof plugin.showWindow === 'function') {
                    const result = plugin.showWindow(data);
                    this.emitEvent('pluginWindowOpened', { pluginId, result });
                    return result;
                }
                
                return false;
            } catch (error) {
                this.emitEvent('pluginError', { pluginId, error });
                return false;
            }
        }

        on(event, callback) {
            if (!this.pluginEvents.has(event)) {
                this.pluginEvents.set(event, []);
            }
            this.pluginEvents.get(event).push(callback);
        }

        emitEvent(event, data) {
            const callbacks = this.pluginEvents.get(event) || [];
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {}
            });
        }

        scanForPlugins() {
            try {
                if (window.PhantomPlugins?.length) {
                    window.PhantomPlugins.forEach(plugin => {
                        if (!this.plugins.has(plugin.id)) {
                            this.registerPlugin(plugin);
                        }
                    });
                    window.PhantomPlugins.length = 0;
                }
            } catch (error) {}
        }

        startAutoDiscovery() {
            this.scanForPlugins();
            setInterval(() => this.scanForPlugins(), 180000);
        }

        getAllPlugins() {
            return Array.from(this.plugins.values());
        }

        getEnabledPlugins() {
            return this.getAllPlugins().filter(plugin => plugin.enabled);
        }

        cleanup() {
            this.plugins.forEach((plugin, id) => {
                if (plugin.loaded && typeof plugin.cleanup === 'function') {
                    try {
                        plugin.cleanup();
                    } catch (error) {}
                }
            });
            this.plugins.clear();
            this.enabledPlugins.clear();
            this.pluginEvents.clear();
            this.dependencies.clear();
            this.loadedDependencies.clear();
            this.pluginQueue = [];
            this.isProcessingQueue = false;
        }
    }

    // Torn API wrapper
    class TornAPI {
        constructor(safeGM) {
            this.safeGM = safeGM;
            this.cacheManager = new CacheManager();
            this.baseURL = CONFIG.BASE_API_URL;
        }

        async makeRequest(endpoint, selections = '', retryCount = 0) {
            const apiKey = '###PDA-APIKEY###'; // TornPDA will replace
            const cacheKey = `${endpoint}_${selections}_${apiKey.substring(0, 8)}`;
            
            const cached = this.cacheManager.get(cacheKey);
            if (cached) return cached;

            return new Promise((resolve, reject) => {
                const url = `${this.baseURL}/${endpoint}?key=${apiKey}&selections=${selections}&comment=PhantomCore`;
                
                const makeCall = () => {
                    if (this.safeGM.hasGM_xhr) {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url,
                            timeout: 8000,
                            onload: (response) => {
                                if (response.status === 200) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.error) {
                                            reject(new Error(`API Error: ${data.error.code}`));
                                        } else {
                                            this.cacheManager.set(cacheKey, data, CONFIG.CACHE_TTL);
                                            resolve(data);
                                        }
                                    } catch (e) {
                                        reject(new Error('Invalid JSON response'));
                                    }
                                } else {
                                    reject(new Error(`HTTP ${response.status}`));
                                }
                            },
                            ontimeout: () => {
                                if (retryCount < CONFIG.MAX_RETRIES) {
                                    setTimeout(() => makeCall(), 1000);
                                } else {
                                    reject(new Error('API request timed out'));
                                }
                            },
                            onerror: () => {
                                if (retryCount < CONFIG.MAX_RETRIES) {
                                    setTimeout(() => makeCall(), 1000);
                                } else {
                                    reject(new Error('Network error occurred'));
                                }
                            }
                        });
                    } else {
                        // Fallback to fetch
                        fetch(url)
                            .then(response => {
                                if (response.ok) return response.json();
                                throw new Error(`HTTP ${response.status}`);
                            })
                            .then(data => {
                                if (data.error) {
                                    reject(new Error(`API Error: ${data.error.code}`));
                                } else {
                                    this.cacheManager.set(cacheKey, data, CONFIG.CACHE_TTL);
                                    resolve(data);
                                }
                            })
                            .catch(error => reject(error));
                    }
                };
                
                makeCall();
            });
        }

        async getUserData() {
            try {
                const userData = await this.makeRequest('user', 'profile,basic');
                if (userData?.name && userData.player_id) {
                    this.cacheManager.set('user_profile', userData, CONFIG.CACHE_TTL);
                    window.phantomCore?.pluginManager?.emitEvent('userDataUpdated', userData);
                    return userData;
                }
                throw new Error('Invalid user data response');
            } catch (error) {
                const cached = this.cacheManager.get('user_profile', true);
                if (cached) return cached;
                throw error;
            }
        }

        cleanup() {
            this.cacheManager.clear();
        }
    }

    // UI Handler - FIXED: Button shows in Solo mode
    class UIHandler {
        constructor(safeGM) {
            this.safeGM = safeGM;
            this.isRepositioning = false;
            this.dragStart = null;
            this.dragOffset = { x: 0, y: 0 };
            this.mainButton = null;
            this.launcherWindow = null;
            this.aboutWindow = null;
            this.configWindow = null;
            this.pluginsWindow = null;
            this.userData = null;
            this.windowSize = CONFIG.DEFAULT_WINDOW_SIZE;
            this.lastActiveWindow = null;
            this.lastButtonTap = 0;
            this.tapCount = 0;
            this.doubleTapTimeout = null;
            this.tripleTapTimeout = null;
            this.initialized = false;
            this.eventListeners = new Map();
            this.currentTheme = THEME_DEFAULTS;
        }

        async init() {
            if (this.initialized) return;

            try {
                // FIXED: Always create UI regardless of mode
                await waitForDOMReady();
                
                this.createMainButton();
                setTimeout(() => {
                    this.createLauncherWindow();
                    this.loadUserData();
                    this.setupPluginEvents();
                    this.applyTheme();
                    this.applyWindowSize(this.windowSize);
                    
                    if (window[CORE_ID] && window[CORE_ID].inLockdown) {
                        window.phantomCore.gatekeeper.updateUILockdownMode();
                    }
                    
                    this.finalizeUI();
                }, 50);
                
                this.initialized = true;
            } catch (error) {
                console.error('UI initialization failed:', error);
            }
        }

        applyTheme() {
            const theme = window.phantomCore?.settings?.theme || THEME_DEFAULTS;
            this.currentTheme = theme;
            
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : {r: 0, g: 255, b: 0};
            };
            
            const primaryRgb = hexToRgb(theme.primaryColor);
            const bgColor = theme.backgroundColor || `rgba(0, 0, 0, ${theme.windowTransparency || 0.7})`;
            const frostBlur = theme.windowFrost || 10;
            
            document.documentElement.style.setProperty('--phantom-primary-color', theme.primaryColor);
            document.documentElement.style.setProperty('--phantom-primary-r', primaryRgb.r);
            document.documentElement.style.setProperty('--phantom-primary-g', primaryRgb.g);
            document.documentElement.style.setProperty('--phantom-primary-b', primaryRgb.b);
            document.documentElement.style.setProperty('--phantom-bg-color', bgColor);
            document.documentElement.style.setProperty('--phantom-frost-blur', `${frostBlur}px`);
            document.documentElement.style.setProperty('--phantom-window-alpha', theme.windowTransparency || '0.7');
            
            this.injectCSS();
        }

        injectCSS() {
            if (document.getElementById('phantom-core-styles')) {
                document.getElementById('phantom-core-styles').remove();
            }
            
            const theme = this.currentTheme;
            const primaryColor = theme.primaryColor;
            const bgColor = theme.backgroundColor || `rgba(0, 0, 0, ${theme.windowTransparency || 0.7})`;
            const frostBlur = theme.windowFrost || 10;
            const windowAlpha = theme.windowTransparency || 0.7;
            
            const css = `
                :root {
                    --phantom-primary-color: ${primaryColor};
                    --phantom-bg-color: ${bgColor};
                    --phantom-frost-blur: ${frostBlur}px;
                    --phantom-window-alpha: ${windowAlpha};
                }
                
                .phantom-core { all: initial; font-family: Arial, sans-serif; z-index: 10000; position: fixed; }
                .phantom-main-button { width: 60px; height: 60px; background: rgba(0,0,0,0.85); border-radius: 50%; 
                    border: 2px solid var(--phantom-primary-color); cursor: pointer; display: flex; align-items: center; 
                    justify-content: center; box-shadow: 0 3px 10px ${primaryColor}30; 
                    transition: all 0.15s ease; user-select: none; z-index: 10010; touch-action: none; }
                .phantom-main-button:active { transform: scale(0.92); background: ${primaryColor}20; }
                .phantom-leader-button { border-width: 3px; }
                .phantom-follower-button { border-width: 2px; opacity: 0.8; }
                .phantom-lockdown-button { border-width: 3px; cursor: not-allowed !important; pointer-events: none !important; }
                .phantom-solo-button { border-color: #888 !important; opacity: 0.5 !important; }
                
                .phantom-leader-glow {
                    animation: phantomLeaderOutlineGlow 2s ease;
                }
                
                .phantom-follower-glow {
                    animation: phantomFollowerOutlineGlow 2s ease;
                }
                
                @keyframes phantomLeaderOutlineGlow {
                    0% { outline: 2px solid transparent; outline-offset: 3px; }
                    50% { outline: 2px solid ${primaryColor}; outline-offset: 3px; box-shadow: 0 0 20px ${primaryColor}80; }
                    100% { outline: 2px solid transparent; outline-offset: 3px; }
                }
                
                @keyframes phantomFollowerOutlineGlow {
                    0% { outline: 2px solid transparent; outline-offset: 3px; }
                    50% { outline: 2px solid ${primaryColor}80; outline-offset: 3px; box-shadow: 0 0 15px ${primaryColor}60; }
                    100% { outline: 2px solid transparent; outline-offset: 3px; }
                }
                
                .phantom-main-button img { width: 70%; height: 70%; opacity: 0.9; }
                
                .phantom-window { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: var(--phantom-bg-color); border: 2px solid var(--phantom-primary-color); border-radius: 12px; padding: 15px;
                    z-index: 10002; max-height: 70vh; overflow-y: auto; color: #fff; width: ${this.windowSize}px;
                    backdrop-filter: blur(var(--phantom-frost-blur)) !important;
                    -webkit-backdrop-filter: blur(var(--phantom-frost-blur)) !important; }
                .phantom-launcher-content { display: flex; flex-direction: column; gap: 8px; }
                .phantom-launcher-section { margin-bottom: 12px; }
                .phantom-launcher-section h4 { margin: 0 0 8px 0; color: var(--phantom-primary-color); text-align: center; font-size: 14px; }
                .phantom-launcher-items { display: grid; grid-template-columns: repeat(${CONFIG.LAUNCHER_COLUMNS}, 1fr); gap: 8px; }
                .phantom-launcher-item { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 8px; padding: 10px; text-align: center; cursor: pointer;
                    transition: all 0.15s ease; min-height: 55px; display: flex; align-items: center; justify-content: center; }
                .phantom-launcher-item:active { background: ${primaryColor}30; transform: scale(0.95); }
                .phantom-system-item { background: ${primaryColor}15; border: 1px solid ${primaryColor}50; }
                .phantom-launcher-enabled { background: ${primaryColor}20; border: 1px solid ${primaryColor}80; }
                .phantom-launcher-icon { width: 28px; height: 28px; opacity: 0.9; object-fit: contain; }
                .phantom-window h3 { text-align: center; margin: 0 0 12px 0; color: var(--phantom-primary-color); font-size: 16px; }
                .phantom-close-button { background: rgba(255,0,0,0.15); border: 1px solid #f00; border-radius: 6px;
                    padding: 8px 12px; color: #fff; cursor: pointer; margin-top: 12px; width: 100%; }
                .phantom-close-button:active { background: rgba(255,0,0,0.3); transform: scale(0.95); }
                .phantom-option-row, .phantom-plugin-row { display: flex; justify-content: space-between; align-items: center;
                    margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; font-size: 13px; }
                .phantom-user-data { background: rgba(255,255,255,0.08); border-radius: 6px; padding: 8px; margin: 8px 0; font-size: 11px; }
                .phantom-slider { width: 100%; margin: 8px 0; }
                .phantom-toggle { position: relative; display: inline-block; width: 48px; height: 22px; }
                .phantom-toggle input { opacity: 0; width: 0; height: 0; }
                .phantom-slider-toggle { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background: #ccc; transition: .3s; border-radius: 22px; }
                .phantom-slider-toggle:before { position: absolute; content: ""; height: 14px; width: 14px; left: 4px;
                    bottom: 4px; background: white; transition: .3s; border-radius: 50%; }
                input:checked + .phantom-slider-toggle { background: var(--phantom-primary-color); }
                input:checked + .phantom-slider-toggle:before { transform: translateX(26px); }
                input[type="text"], input[type="number"], input[type="color"] { padding: 4px; background: rgba(0,0,0,0.5); color: #fff;
                    border: 1px solid var(--phantom-primary-color); border-radius: 3px; font-size: 12px; }
                input[type="text"] { width: 140px; }
                input[type="number"] { width: 70px; }
                input[type="color"] { width: 40px; height: 30px; cursor: pointer; }
                select { padding: 4px; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid var(--phantom-primary-color); border-radius: 3px; font-size: 12px; }
            `;

            try {
                const style = document.createElement('style');
                style.id = 'phantom-core-styles';
                style.textContent = css;
                document.head.appendChild(style);
            } catch (error) {}
        }

        createMainButton() {
            const existingButton = document.querySelector('.phantom-main-button');
            if (existingButton) existingButton.remove();

            this.mainButton = document.createElement('div');
            this.mainButton.className = 'phantom-core phantom-main-button';
            
            const isFollower = window[CORE_ID] ? window[CORE_ID].isFollower : false;
            const isLeader = window[CORE_ID] ? window[CORE_ID].isLeader : false;
            const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
            const currentMode = window.phantomCore?.hybridManager?.runningMode || CONFIG.DEFAULT_HYBRID_MODE;
            
            if (isFollower) {
                this.mainButton.classList.add('phantom-follower-button');
            }
            
            if (isLeader) {
                this.mainButton.classList.add('phantom-leader-button');
            }
            
            if (inLockdown) {
                this.mainButton.classList.add('phantom-lockdown-button');
                this.mainButton.style.cursor = 'not-allowed';
                this.mainButton.style.pointerEvents = 'none';
            }
            
            if (currentMode === 'solo') {
                this.mainButton.classList.add('phantom-solo-button');
                this.mainButton.style.opacity = '0.5';
                this.mainButton.style.cursor = 'default';
            }
            
            const img = document.createElement('img');
            img.src = 'https://images2.imgbox.com/4b/15/ke3r9iVY_o.png';
            img.alt = 'Phantom Core';
            img.onerror = () => {
                img.src = 'https://img.icons8.com/ios/50/ffffff/application.png';
            };
            this.mainButton.appendChild(img);
            
            const savedPos = window.phantomCore?.settings?.buttonPosition || { x: 15, y: 15 };
            const x = Math.max(5, Math.min(savedPos.x, window.innerWidth - 65));
            const y = Math.max(5, Math.min(savedPos.y, window.innerHeight - 65));
            
            this.mainButton.style.left = `${x}px`;
            this.mainButton.style.top = `${y}px`;

            this.injectCSS();
            this.setupButtonEvents();
            document.body.appendChild(this.mainButton);
        }

        setupButtonEvents() {
            if (!this.mainButton) return;

            const touchStartHandler = (e) => {
                const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
                if (inLockdown) {
                    e.preventDefault();
                    ToastManager.show('🔒 Lockdown active', 'error', 2000);
                    return;
                }
                this.isRepositioning = false;
                const touch = e.touches ? e.touches[0] : e;
                this.dragStart = { x: touch.clientX, y: touch.clientY };
                this.dragOffset.x = touch.clientX - this.mainButton.offsetLeft;
                this.dragOffset.y = touch.clientY - this.mainButton.offsetTop;
            };

            const touchMoveHandler = (e) => {
                const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
                if (!this.dragStart || inLockdown) return;
                const touch = e.touches ? e.touches[0] : e;
                const deltaX = Math.abs(touch.clientX - this.dragStart.x);
                const deltaY = Math.abs(touch.clientY - this.dragStart.y);
                
                if (deltaX > 8 || deltaY > 8) {
                    this.isRepositioning = true;
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    const x = Math.max(0, Math.min(touch.clientX - this.dragOffset.x, window.innerWidth - 60));
                    const y = Math.max(0, Math.min(touch.clientY - this.dragOffset.y, window.innerHeight - 60));
                    
                    this.mainButton.style.left = `${x}px`;
                    this.mainButton.style.top = `${y}px`;
                }
            };

            const touchEndHandler = async () => {
                if (this.isRepositioning && window.phantomCore?.settings) {
                    let x = parseInt(this.mainButton.style.left) || 15;
                    let y = parseInt(this.mainButton.style.top) || 15;

                    if (window.phantomCore.settings.snapToBorder) {
                        const threshold = 40;
                        if (x < threshold) x = 5;
                        if (x > window.innerWidth - 60 - threshold) x = window.innerWidth - 65;
                        if (y < threshold) y = 5;
                        if (y > window.innerHeight - 60 - threshold) y = window.innerHeight - 65;
                        
                        this.mainButton.style.left = `${x}px`;
                        this.mainButton.style.top = `${y}px`;
                    }

                    x = Math.max(5, Math.min(x, window.innerWidth - 65));
                    y = Math.max(5, Math.min(y, window.innerHeight - 65));

                    window.phantomCore.settings.buttonPosition = { x, y };
                    await window.phantomCore.saveSettings();
                }
                this.dragStart = null;
            };

            const clickHandler = (e) => {
                const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
                if (inLockdown) {
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    e.stopPropagation();
                    ToastManager.show('🔒 Lockdown active', 'error', 2000);
                    return;
                }
                
                const currentMode = window.phantomCore?.hybridManager?.runningMode || CONFIG.DEFAULT_HYBRID_MODE;
                const now = Date.now();
                
                // Triple tap detection
                if (now - this.lastButtonTap > 500) {
                    this.tapCount = 0;
                }
                
                this.tapCount++;
                this.lastButtonTap = now;
                
                // Clear any existing timeouts
                if (this.doubleTapTimeout) {
                    clearTimeout(this.doubleTapTimeout);
                    this.doubleTapTimeout = null;
                }
                if (this.tripleTapTimeout) {
                    clearTimeout(this.tripleTapTimeout);
                    this.tripleTapTimeout = null;
                }
                
                if (this.tapCount === 3) {
                    // Triple tap - toggle mode
                    this.tapCount = 0;
                    this.isRepositioning = false;
                    
                    if (window.phantomCore?.hybridManager) {
                        const newMode = window.phantomCore.hybridManager.toggleRunningMode();
                        ToastManager.show(`Mode changed to ${newMode}`, 'info', 3000);
                    }
                    
                    return;
                } else if (this.tapCount === 2) {
                    // Double tap detection
                    this.doubleTapTimeout = setTimeout(() => {
                        if (this.tapCount === 2) {
                            // Double tap - clear windows
                            this.hideAllWindows();
                            this.showLauncherWindow();
                            ToastManager.show('🔄 Window states cleared', 'info');
                        }
                        this.tapCount = 0;
                    }, 300);
                } else {
                    // Single tap
                    this.tripleTapTimeout = setTimeout(() => {
                        if (this.tapCount === 1 && !this.isRepositioning) {
                            // Single tap in hybrid mode only
                            if (currentMode === 'hybrid') {
                                if (this.lastActiveWindow) {
                                    this.toggleWindow(this.lastActiveWindow);
                                } else {
                                    this.toggleLauncherWindow();
                                }
                            }
                        }
                        this.tapCount = 0;
                    }, 300);
                }
                
                this.isRepositioning = false;
            };

            this.mainButton.addEventListener('mousedown', touchStartHandler);
            this.mainButton.addEventListener('mousemove', touchMoveHandler);
            this.mainButton.addEventListener('mouseup', touchEndHandler);
            this.mainButton.addEventListener('mouseleave', touchEndHandler);
            
            this.mainButton.addEventListener('touchstart', touchStartHandler, { passive: true });
            this.mainButton.addEventListener('touchmove', touchMoveHandler, { passive: false });
            this.mainButton.addEventListener('touchend', touchEndHandler, { passive: true });
            this.mainButton.addEventListener('click', clickHandler, { passive: false });

            this.eventListeners.set(this.mainButton, {
                mousedown: touchStartHandler,
                mousemove: touchMoveHandler,
                mouseup: touchEndHandler,
                mouseleave: touchEndHandler,
                touchstart: touchStartHandler,
                touchmove: touchMoveHandler,
                touchend: touchEndHandler,
                click: clickHandler
            });
        }

        createLauncherWindow() {
            if (this.launcherWindow) return;
            
            this.launcherWindow = document.createElement('div');
            this.launcherWindow.className = 'phantom-window phantom-launcher-window';
            this.launcherWindow.style.width = `${this.windowSize}px`;
            
            const content = document.createElement('div');
            content.className = 'phantom-launcher-content';
            
            const pluginsSection = document.createElement('div');
            pluginsSection.className = 'phantom-launcher-section';
            pluginsSection.innerHTML = '<h4>Plugins</h4>';
            
            const pluginsItems = document.createElement('div');
            pluginsItems.className = 'phantom-launcher-items';
            pluginsItems.id = 'phantom-launcher-plugins-container';
            
            pluginsSection.appendChild(pluginsItems);
            content.appendChild(pluginsSection);
            
            const systemSection = document.createElement('div');
            systemSection.className = 'phantom-launcher-section';
            systemSection.innerHTML = '<h4>System</h4>';
            
            const systemItems = document.createElement('div');
            systemItems.className = 'phantom-launcher-items';
            systemItems.id = 'phantom-launcher-system-container';
            
            const staticSystemItems = [
                { action: 'plugins', icon: 'https://img.icons8.com/ios/50/ffffff/plugin.png', name: 'Plugins' },
                { action: 'config', icon: 'https://img.icons8.com/ios/50/ffffff/settings.png', name: 'Config' },
                { action: 'about', icon: 'https://images2.imgbox.com/4b/15/ke3r9iVY_o.png', name: 'About' }
            ];

            staticSystemItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'phantom-launcher-item phantom-system-item';
                
                const icon = document.createElement('img');
                icon.src = item.icon;
                icon.className = 'phantom-launcher-icon';
                icon.alt = item.name;
                icon.onerror = () => {
                    icon.src = 'https://img.icons8.com/ios/50/ffffff/application.png';
                };
                
                itemElement.appendChild(icon);

                const clickHandler = () => {
                    switch(item.action) {
                        case 'about': this.showAbout(); break;
                        case 'config': this.showConfig(); break;
                        case 'plugins': this.showPlugins(); break;
                    }
                };
                
                itemElement.addEventListener('click', clickHandler);
                this.eventListeners.set(itemElement, { click: clickHandler });

                systemItems.appendChild(itemElement);
            });
            
            systemSection.appendChild(systemItems);
            content.appendChild(systemSection);
            
            this.launcherWindow.appendChild(content);
            document.body.appendChild(this.launcherWindow);
        }

        addPluginToLauncher(plugin) {
            if (!this.launcherWindow) this.createLauncherWindow();
            if (plugin.id === 'phantomstorage' || plugin.id === 'phantomlook') {
                this.addSystemPluginToLauncher(plugin);
                return;
            }
            
            const pluginsContainer = document.getElementById('phantom-launcher-plugins-container');
            if (!pluginsContainer) return;
            
            const existingItem = pluginsContainer.querySelector(`[data-plugin-id="${plugin.id}"]`);
            if (existingItem) existingItem.remove();

            const pluginItem = document.createElement('div');
            pluginItem.className = 'phantom-launcher-item';
            pluginItem.dataset.pluginId = plugin.id;
            
            const icon = document.createElement('img');
            icon.src = plugin.icon || 'https://img.icons8.com/ios/50/ffffff/application.png';
            icon.className = 'phantom-launcher-icon';
            icon.alt = plugin.name;
            icon.onerror = () => {
                icon.src = 'https://img.icons8.com/ios/50/ffffff/application.png';
            };
            
            pluginItem.appendChild(icon);

            const clickHandler = () => this.executePlugin(plugin);
            pluginItem.addEventListener('click', clickHandler);
            this.eventListeners.set(pluginItem, { click: clickHandler });

            if (plugin.enabled) {
                pluginItem.classList.add('phantom-launcher-enabled');
            }

            pluginsContainer.appendChild(pluginItem);
            if (window[CORE_ID]) {
                window[CORE_ID].pluginIcons.set(plugin.id, pluginItem);
            }
        }

        addSystemPluginToLauncher(plugin) {
            if (!plugin.enabled) return;
            const systemContainer = document.getElementById('phantom-launcher-system-container');
            if (!systemContainer) return;
            
            const existingItem = systemContainer.querySelector(`[data-plugin-id="${plugin.id}"]`);
            if (existingItem) existingItem.remove();

            const systemItem = document.createElement('div');
            systemItem.className = 'phantom-launcher-item phantom-system-item';
            systemItem.dataset.pluginId = plugin.id;
            
            const icon = document.createElement('img');
            icon.src = plugin.icon || 'https://img.icons8.com/ios/50/ffffff/application.png';
            icon.className = 'phantom-launcher-icon';
            icon.alt = plugin.name;
            icon.onerror = () => {
                icon.src = 'https://img.icons8.com/ios/50/ffffff/application.png';
            };
            
            systemItem.appendChild(icon);

            const clickHandler = () => this.executePlugin(plugin);
            systemItem.addEventListener('click', clickHandler);
            this.eventListeners.set(systemItem, { click: clickHandler });

            systemContainer.appendChild(systemItem);
        }

        updateLauncherItemVisual(pluginId) {
            const pluginItem = document.querySelector(`[data-plugin-id="${pluginId}"]`);
            if (!pluginItem) return;
            
            const plugin = window.phantomCore?.pluginManager?.plugins.get(pluginId);
            if (!plugin) return;
            
            if ((pluginId === 'phantomstorage' || pluginId === 'phantomlook') && !plugin.enabled) {
                pluginItem.remove();
                return;
            }
            
            if (plugin.enabled) {
                pluginItem.classList.add('phantom-launcher-enabled');
            } else {
                pluginItem.classList.remove('phantom-launcher-enabled');
            }
        }

        executePlugin(plugin) {
            const inLockdown = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
            if (inLockdown) {
                ToastManager.show('❌ Phantom Core is in lockdown mode', 'error');
                return;
            }
            
            window.phantomCore?.pluginManager?.executePlugin(plugin.id);
            if (window.phantomCore?.settings?.autoCloseWindows) {
                this.hideAllWindows();
            }
        }

        async loadUserData() {
            try {
                this.userData = await window.phantomCore?.api?.getUserData();
                this.updateAboutWindow();
            } catch (error) {
                console.warn('Failed to load user data:', error);
            }
        }

        showAbout() {
            this.hideAllWindows();
            if (!this.aboutWindow) {
                this.aboutWindow = document.createElement('div');
                this.aboutWindow.className = 'phantom-window';
                this.aboutWindow.style.width = `${this.windowSize}px`;
                document.body.appendChild(this.aboutWindow);
            }
            this.updateAboutWindow();
            this.aboutWindow.style.display = 'block';
            this.lastActiveWindow = this.aboutWindow;
        }

        updateAboutWindow() {
            if (!this.aboutWindow) return;
            
            try {
                const gs = window.phantomCore?.gatekeeper?.getVerificationStatus() || {};
                const ld = window[CORE_ID] ? window[CORE_ID].inLockdown : false;
                const tll = ld ? Math.max(0, CONFIG.GATEKEEPER_LOCKDOWN_DURATION - (Date.now() - (window[CORE_ID] ? window[CORE_ID].lockdownStart : 0))) : 0;
                const th = Math.floor(tll / 3600000);
                const tm = Math.floor((tll % 3600000) / 60000);
                
                const userName = this.userData?.name || gs.userName || 'Unknown';
                const userId = this.userData?.player_id || gs.userId || 'Unknown';
                
                this.aboutWindow.innerHTML = XSSSanitizer.sanitize(`
                    <div>
                        <h3>Phantom v${CONFIG.VERSION}</h3>
                        <div class="phantom-user-data">
                            <strong>Author:</strong> Daturax [2627396]<br>
                            <strong>Version:</strong> ${CORE_VERSION}
                        </div>
                        <div class="phantom-user-data">
                            <strong>Torn Username:</strong> ${userName}<br>
                            <strong>Torn User ID:</strong> ${userId}<br>
                            <strong>Status:</strong> <span style="color:var(--phantom-primary-color);">ACTIVE</span>
                        </div>
                        <div class="phantom-user-data" style="${ld ? 'background:rgba(255,0,0,0.15);border:1px solid #f00;' : 'background:var(--phantom-primary-color)15;border:1px solid var(--phantom-primary-color);'}">
                            <strong>GateKeeper:</strong> ${gs.verified ? '✅ VERIFIED' : '🔒 NOT VERIFIED'}<br>
                            <strong>Lockdown:</strong> ${ld ? '🔴 ACTIVE' : '✅ INACTIVE'}<br>
                            ${ld ? `<strong>Time Left:</strong> ${th}h ${tm}m<br>` : ''}
                            <strong>Last Check:</strong> ${gs.lastCheck ? new Date(gs.lastCheck).toLocaleTimeString() : 'Never'}<br>
                            <strong>Alert:</strong> ${gs.userAlert || 'None'}
                        </div>
                        <div class="phantom-user-data">
                            <strong>Mode:</strong> ${(window.phantomCore?.hybridManager?.runningMode || 'hybrid').toUpperCase()}<br>
                            <strong>Leader:</strong> ${window[CORE_ID] ? (window[CORE_ID].isLeader ? 'YES' : 'NO') : 'NO'}<br>
                            <strong>Follower:</strong> ${window[CORE_ID] ? (window[CORE_ID].isFollower ? 'YES' : 'NO') : 'NO'}<br>
                            <strong>Plugins:</strong> ${window.phantomCore?.pluginManager?.getAllPlugins().length || 0}<br>
                            <strong>Enabled:</strong> ${window.phantomCore?.pluginManager?.getEnabledPlugins().length || 0}
                        </div>
                        <button class="phantom-close-button" id="about-close-btn">Close</button>
                    </div>
                `);

                const closeBtn = this.aboutWindow.querySelector('#about-close-btn');
                if (closeBtn) {
                    const closeHandler = () => this.hideAbout();
                    closeBtn.addEventListener('click', closeHandler);
                    this.eventListeners.set(closeBtn, { click: closeHandler });
                }
            } catch (error) {
                console.error('Error updating about window:', error);
            }
        }

        hideAbout() {
            if (this.aboutWindow) {
                this.aboutWindow.style.display = 'none';
                this.cleanupWindowEventListeners(this.aboutWindow);
                this.lastActiveWindow = null;
            }
        }

        showConfig() {
            this.hideAllWindows();
            if (!this.configWindow) {
                this.configWindow = document.createElement('div');
                this.configWindow.className = 'phantom-window';
                this.configWindow.style.width = `${this.windowSize}px`;
                document.body.appendChild(this.configWindow);
            }
            this.updateConfigWindow();
            this.configWindow.style.display = 'block';
            this.lastActiveWindow = this.configWindow;
        }

        updateConfigWindow() {
            if (!this.configWindow) return;
            const s = window.phantomCore?.settings || {
                windowSize: this.windowSize, 
                autoCloseWindows: true, 
                apiKey: '', 
                balancedMode: false, 
                balancedModeDelay: 100, 
                snapToBorder: false,
                theme: THEME_DEFAULTS
            };
            const m = window.phantomCore?.hybridManager?.runningMode || CONFIG.DEFAULT_HYBRID_MODE;
            const theme = s.theme || THEME_DEFAULTS;

            this.configWindow.innerHTML = XSSSanitizer.sanitize(`
                <div>
                    <h3>Configuration</h3>
                    
                    <div class="phantom-option-row">
                        <span>Primary Color:</span>
                        <input type="color" id="primary-color-picker" value="${theme.primaryColor}">
                    </div>
                    
                    <div class="phantom-option-row">
                        <span>Window Transparency:</span>
                        <input type="range" class="phantom-slider" id="transparency-slider" min="10" max="90" step="5" value="${Math.round((theme.windowTransparency || 0.7) * 100)}">
                        <span id="transparency-value">${Math.round((theme.windowTransparency || 0.7) * 100)}%</span>
                    </div>
                    
                    <div class="phantom-option-row">
                        <span>Frost Effect:</span>
                        <input type="range" class="phantom-slider" id="frost-slider" min="0" max="30" step="1" value="${theme.windowFrost || 10}">
                        <span id="frost-value">${theme.windowFrost || 10}px</span>
                    </div>
                    
                    <div class="phantom-option-row">
                        <span>Window Size:</span>
                        <input type="range" class="phantom-slider" id="window-size-slider" min="200" max="500" step="10" value="${s.windowSize || this.windowSize}">
                        <span id="window-size-value">${s.windowSize || this.windowSize}px</span>
                    </div>
                    
                    <div class="phantom-option-row">
                        <span>Auto Close Windows:</span>
                        <label class="phantom-toggle">
                            <input type="checkbox" id="auto-close-toggle" ${s.autoCloseWindows ? 'checked' : ''}>
                            <span class="phantom-slider-toggle"></span>
                        </label>
                    </div>
                    
                    <div class="phantom-option-row">
                        <span>Hybrid Mode:</span>
                        <select id="hybrid-mode-select">
                            <option value="solo" ${m === 'solo' ? 'selected' : ''}>Solo</option>
                            <option value="hybrid" ${m === 'hybrid' ? 'selected' : ''}>Hybrid</option>
                        </select>
                    </div>
                    
                    <div class="phantom-option-row">
                        <span>GateKeeper Recheck:</span>
                        <button id="gatekeeper-recheck-btn" style="padding:4px 8px;background:rgba(0,0,0,0.5);color:#fff;border:1px solid var(--phantom-primary-color);border-radius:3px;">Recheck</button>
                    </div>
                    
                    <button class="phantom-close-button" id="config-save-button">Save Settings</button>
                </div>
            `);

            const colorPicker = this.configWindow.querySelector('#primary-color-picker');
            if (colorPicker) {
                const colorHandler = (e) => {
                    const newColor = e.target.value;
                    document.documentElement.style.setProperty('--phantom-primary-color', newColor);
                };
                colorPicker.addEventListener('input', colorHandler);
                this.eventListeners.set(colorPicker, { input: colorHandler });
            }

            const transparencySlider = this.configWindow.querySelector('#transparency-slider');
            const transparencyValue = this.configWindow.querySelector('#transparency-value');
            if (transparencySlider && transparencyValue) {
                const transparencyHandler = (e) => {
                    const value = parseInt(e.target.value);
                    transparencyValue.textContent = `${value}%`;
                    const alpha = value / 100;
                    document.documentElement.style.setProperty('--phantom-window-alpha', alpha.toString());
                };
                transparencySlider.addEventListener('input', transparencyHandler);
                this.eventListeners.set(transparencySlider, { input: transparencyHandler });
            }

            const frostSlider = this.configWindow.querySelector('#frost-slider');
            const frostValue = this.configWindow.querySelector('#frost-value');
            if (frostSlider && frostValue) {
                const frostHandler = (e) => {
                    const value = parseInt(e.target.value);
                    frostValue.textContent = `${value}px`;
                    document.documentElement.style.setProperty('--phantom-frost-blur', `${value}px`);
                };
                frostSlider.addEventListener('input', frostHandler);
                this.eventListeners.set(frostSlider, { input: frostHandler });
            }

            const sizeSlider = this.configWindow.querySelector('#window-size-slider');
            const sizeValue = this.configWindow.querySelector('#window-size-value');
            if (sizeSlider && sizeValue) {
                let sliderTimeout = null;
                const sliderHandler = (e) => {
                    const newSize = parseInt(e.target.value);
                    sizeValue.textContent = `${newSize}px`;
                    this.applyWindowSize(newSize);
                    if (sliderTimeout) clearTimeout(sliderTimeout);
                    sliderTimeout = setTimeout(() => {
                        if (window.phantomCore?.settings) {
                            window.phantomCore.settings.windowSize = newSize;
                        }
                    }, 800);
                };
                sizeSlider.addEventListener('input', sliderHandler);
                this.eventListeners.set(sizeSlider, { input: sliderHandler });
            }

            const hybridModeSelect = this.configWindow.querySelector('#hybrid-mode-select');
            if (hybridModeSelect) {
                const hybridModeHandler = (e) => {
                    if (window.phantomCore?.hybridManager) {
                        const newMode = e.target.value;
                        if (newMode === 'solo' || newMode === 'hybrid') {
                            window.phantomCore.hybridManager.runningMode = newMode;
                            window.phantomCore.hybridManager.saveMode();
                            if (window[CORE_ID]) {
                                window[CORE_ID].hybridModeEnabled = newMode === 'hybrid';
                            }
                            
                            if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                                window[CORE_ID].broadcastChannel.postMessage({ 
                                    from: window[CORE_ID].tabId, 
                                    action: 'toggleMode', 
                                    payload: { mode: newMode } 
                                });
                            }
                            
                            ToastManager.show(`Mode changed to ${newMode}`, 'info', 3000);
                        }
                    }
                };
                hybridModeSelect.addEventListener('change', hybridModeHandler);
                this.eventListeners.set(hybridModeSelect, { change: hybridModeHandler });
            }

            const gatekeeperRecheckBtn = this.configWindow.querySelector('#gatekeeper-recheck-btn');
            if (gatekeeperRecheckBtn) {
                const recheckHandler = async () => {
                    if (window.phantomCore?.gatekeeper) {
                        gatekeeperRecheckBtn.disabled = true;
                        gatekeeperRecheckBtn.textContent = 'Checking...';
                        const verified = await window.phantomCore.gatekeeper.verifyUser();
                        gatekeeperRecheckBtn.disabled = false;
                        gatekeeperRecheckBtn.textContent = 'Recheck';
                        ToastManager.show(verified ? '✅ GateKeeper verification successful!' : '❌ GateKeeper verification failed!', verified ? 'success' : 'error');
                    }
                };
                gatekeeperRecheckBtn.addEventListener('click', recheckHandler);
                this.eventListeners.set(gatekeeperRecheckBtn, { click: recheckHandler });
            }

            const saveButton = this.configWindow.querySelector('#config-save-button');
            if (saveButton) {
                const saveHandler = async () => {
                    if (window.phantomCore?.settings) {
                        window.phantomCore.settings.theme = {
                            primaryColor: colorPicker?.value || theme.primaryColor,
                            windowTransparency: parseInt(transparencySlider?.value || 70) / 100,
                            windowFrost: parseInt(frostSlider?.value || 10),
                            backgroundColor: `rgba(0, 0, 0, ${parseInt(transparencySlider?.value || 70) / 100})`
                        };
                        
                        window.phantomCore.settings.windowSize = parseInt(sizeSlider?.value || this.windowSize);
                        window.phantomCore.settings.autoCloseWindows = this.configWindow.querySelector('#auto-close-toggle')?.checked || true;
                        
                        const saved = await window.phantomCore.saveSettings();
                        
                        this.applyTheme();
                        
                        if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                            window[CORE_ID].broadcastChannel.postMessage({
                                from: window[CORE_ID].tabId,
                                action: 'themeUpdate',
                                payload: window.phantomCore.settings.theme
                            });
                        }
                        
                        ToastManager.show(saved ? '✅ Settings saved!' : '❌ Failed to save settings', saved ? 'success' : 'error');
                        this.applyWindowSize(window.phantomCore.settings.windowSize);
                    }
                    this.hideConfig();
                };
                saveButton.addEventListener('click', saveHandler);
                this.eventListeners.set(saveButton, { click: saveHandler });
            }
        }

        hideConfig() {
            if (this.configWindow) {
                this.configWindow.style.display = 'none';
                this.cleanupWindowEventListeners(this.configWindow);
                this.lastActiveWindow = null;
            }
        }

        showPlugins() {
            this.hideAllWindows();
            if (!this.pluginsWindow) {
                this.pluginsWindow = document.createElement('div');
                this.pluginsWindow.className = 'phantom-window';
                this.pluginsWindow.style.width = `${this.windowSize}px`;
                document.body.appendChild(this.pluginsWindow);
            }
            this.updatePluginsWindow();
            this.pluginsWindow.style.display = 'block';
            this.lastActiveWindow = this.pluginsWindow;
        }

        updatePluginsWindow() {
            if (!this.pluginsWindow) return;
            const plugins = window.phantomCore?.pluginManager?.getAllPlugins() || [];
            let pluginsHTML = '';

            plugins.forEach(plugin => {
                const isSystemPlugin = plugin.id === 'phantomstorage' || plugin.id === 'phantomlook';
                pluginsHTML += `
                    <div class="phantom-plugin-row">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <img src="${plugin.icon || 'https://img.icons8.com/ios/50/ffffff/application.png'}" style="width:20px;height:20px;object-fit:contain;" alt="${plugin.name}">
                            <div>
                                <strong>${plugin.name}</strong><br>
                                <small>v${plugin.version} by ${plugin.author}</small>
                            </div>
                        </div>
                        <label class="phantom-toggle" ${isSystemPlugin ? 'style="opacity:0.5;"' : ''}>
                            <input type="checkbox" ${plugin.enabled ? 'checked' : ''} 
                                data-plugin-id="${plugin.id}" ${isSystemPlugin ? 'disabled' : ''}>
                            <span class="phantom-slider-toggle"></span>
                        </label>
                    </div>
                `;
            });

            this.pluginsWindow.innerHTML = XSSSanitizer.sanitize(`
                <div>
                    <h3>Plugin Management</h3>
                    <p>Total Plugins: ${plugins.length} / ${CONFIG.MAX_PLUGINS}</p>
                    ${pluginsHTML}
                    <button class="phantom-close-button" id="plugins-close-btn">Close</button>
                </div>
            `);

            this.pluginsWindow.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
                const changeHandler = (e) => {
                    const pluginId = e.target.getAttribute('data-plugin-id');
                    if (window.phantomCore?.pluginManager) {
                        if (e.target.checked) {
                            window.phantomCore.pluginManager.enablePlugin(pluginId);
                        } else {
                            window.phantomCore.pluginManager.disablePlugin(pluginId);
                        }
                    }
                };
                toggle.addEventListener('change', changeHandler);
                this.eventListeners.set(toggle, { change: changeHandler });
            });

            const closeButton = this.pluginsWindow.querySelector('#plugins-close-btn');
            if (closeButton) {
                const closeHandler = () => this.hidePlugins();
                closeButton.addEventListener('click', closeHandler);
                this.eventListeners.set(closeButton, { click: closeHandler });
            }
        }

        hidePlugins() {
            if (this.pluginsWindow) {
                this.pluginsWindow.style.display = 'none';
                this.cleanupWindowEventListeners(this.pluginsWindow);
                this.lastActiveWindow = null;
            }
        }

        applyWindowSize(size) {
            if (!size) return;
            this.windowSize = size;
            if (window[CORE_ID]) {
                window[CORE_ID].windowSize = size;
            }
            
            const windows = [this.launcherWindow, this.aboutWindow, this.configWindow, this.pluginsWindow];
            windows.forEach(el => {
                if (el) {
                    el.style.width = `${size}px`;
                }
            });
            
            if (this.configWindow && this.configWindow.style.display === 'block') {
                const sizeSlider = this.configWindow.querySelector('#window-size-slider');
                const sizeValue = this.configWindow.querySelector('#window-size-value');
                if (sizeSlider) sizeSlider.value = size;
                if (sizeValue) sizeValue.textContent = `${size}px`;
            }
        }

        refreshAllVisuals() {
            this.applyTheme();
            this.applyWindowSize(this.windowSize);
            this.updateAboutWindow();
            this.updatePluginsWindow();
        }

        setupPluginEvents() {
            if (!window.phantomCore?.pluginManager) return;
            
            const pluginRegisteredHandler = (data) => {
                if (data.plugin) {
                    this.addPluginToLauncher(data.plugin);
                }
            };
            
            const pluginToggledHandler = (data) => {
                this.updatePluginsWindow();
                if (data.pluginId) {
                    this.updateLauncherItemVisual(data.pluginId);
                }
            };

            window.phantomCore.pluginManager.on('pluginRegistered', pluginRegisteredHandler);
            window.phantomCore.pluginManager.on('pluginToggled', pluginToggledHandler);

            this.eventListeners.set(window.phantomCore.pluginManager, {
                pluginRegistered: pluginRegisteredHandler,
                pluginToggled: pluginToggledHandler
            });
        }

        toggleWindow(windowElement) {
            if (!windowElement) return;
            if (windowElement.style.display === 'block') {
                windowElement.style.display = 'none';
                this.lastActiveWindow = null;
            } else {
                this.hideAllWindows();
                windowElement.style.display = 'block';
                this.lastActiveWindow = windowElement;
            }
        }

        toggleLauncherWindow() {
            if (!this.launcherWindow) this.createLauncherWindow();
            if (this.launcherWindow.style.display === 'block') {
                this.launcherWindow.style.display = 'none';
                this.lastActiveWindow = null;
            } else {
                this.hideAllWindows();
                this.launcherWindow.style.display = 'block';
                this.lastActiveWindow = this.launcherWindow;
            }
        }

        showLauncherWindow() {
            this.hideAllWindows();
            if (this.launcherWindow) this.launcherWindow.style.display = 'block';
            this.lastActiveWindow = this.launcherWindow;
        }

        hideAllWindows() {
            const windows = [this.launcherWindow, this.aboutWindow, this.configWindow, this.pluginsWindow];
            windows.forEach(window => {
                if (window) {
                    window.style.display = 'none';
                    this.cleanupWindowEventListeners(window);
                }
            });
            this.lastActiveWindow = null;
        }

        cleanupWindowEventListeners(windowElement) {
            if (!windowElement) return;
            windowElement.querySelectorAll('button, input, select').forEach(el => {
                if (this.eventListeners.has(el)) {
                    const listeners = this.eventListeners.get(el);
                    Object.keys(listeners).forEach(eventType => {
                        if (typeof listeners[eventType] === 'function') {
                            el.removeEventListener(eventType, listeners[eventType]);
                        }
                    });
                    this.eventListeners.delete(el);
                }
            });
        }

        finalizeUI() {
            if (window[CORE_ID] && window[CORE_ID].uiFinalized) return;
            this.refreshAllVisuals();
            if (window[CORE_ID]) {
                window[CORE_ID].uiFinalized = true;
                window[CORE_ID].uiReady = true;
            }
        }

        cleanup() {
            this.hideAllWindows();
            
            this.eventListeners.forEach((listeners, element) => {
                if (element instanceof Node && element.parentNode) {
                    Object.keys(listeners).forEach(eventType => {
                        if (typeof listeners[eventType] === 'function') {
                            element.removeEventListener(eventType, listeners[eventType]);
                        }
                    });
                }
            });
            this.eventListeners.clear();

            // Clear tap timeouts
            if (this.doubleTapTimeout) clearTimeout(this.doubleTapTimeout);
            if (this.tripleTapTimeout) clearTimeout(this.tripleTapTimeout);

            [this.mainButton, this.launcherWindow, this.aboutWindow, this.configWindow, this.pluginsWindow].forEach(el => {
                try { 
                    if (el?.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                } catch(e) {
                    console.warn('Error removing element:', e);
                }
            });

            try {
                document.getElementById('phantom-core-styles')?.remove();
                document.getElementById('phantom-toast-animations')?.remove();
            } catch (error) {
                console.warn('Error removing styles:', error);
            }

            this.initialized = false;
        }
    }

    // Main Phantom Core class
    class PhantomCore {
        constructor() {
            if (window.phantomCore) {
                return window.phantomCore;
            }

            this.isInitialized = false;
            this.pluginManager = null;
            this.safeGM = null;
            this.settings = null;
            this.api = null;
            this.ui = null;
            this.hybridManager = null;
            this.gatekeeper = null;
            
            this.initWithRetry();
        }

        async initWithRetry() {
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries && !this.isInitialized) {
                try {
                    await this.parallelInit();
                    break;
                } catch (error) {
                    retryCount++;
                    console.warn(`Phantom Core: Initialization attempt ${retryCount} failed`, error);
                    
                    if (retryCount === maxRetries) {
                        console.error('Phantom Core: Max retries reached');
                        await this.forceInitialize();
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    }
                }
            }
        }

        async parallelInit() {
            if (this.isInitialized) return;

            try {
                this.safeGM = initializeSafeGM();
                this.loadSettings();
                
                try {
                    if (!window[CORE_ID] && typeof BroadcastChannel !== 'undefined') {
                        window[CORE_ID].broadcastChannel = new BroadcastChannel('phantom_core_channel');
                    }
                } catch (error) {
                    console.warn('BroadcastChannel not available:', error);
                }
                
                this.hybridManager = new HybridManager();
                await this.hybridManager.initialize();
                
                this.initializeUI();
                
                if (window[CORE_ID] && window[CORE_ID].broadcastChannel) {
                    const originalHandler = window[CORE_ID].broadcastChannel.onmessage;
                    window[CORE_ID].broadcastChannel.onmessage = (event) => {
                        if (originalHandler) {
                            try {
                                originalHandler(event);
                            } catch (e) {}
                        }
                        
                        if (event.data && event.data.action === 'themeUpdate' && event.data.from !== window[CORE_ID].tabId) {
                            if (this.settings) {
                                this.settings.theme = event.data.payload;
                                this.saveSettings();
                                if (this.ui) {
                                    this.ui.applyTheme();
                                }
                            }
                        }
                    };
                }
                
                setTimeout(() => {
                    this.pluginManager = new PluginManager(this.safeGM);
                    this.api = new TornAPI(this.safeGM);
                    this.gatekeeper = new GateKeeper(this.safeGM, this.api, ToastManager);
                    
                    this.gatekeeper.init().then(() => {
                        if (window[CORE_ID] && !window[CORE_ID].inLockdown) {
                            this.startPluginDiscovery();
                        }
                    }).catch(error => {
                        console.error('GateKeeper init failed:', error);
                    });
                    
                    this.storageBackend = this.safeGM.hasGM ? 'gm' : 'localstorage';
                }, 100);
                
                this.isInitialized = true;
                if (window[CORE_ID]) {
                    window[CORE_ID].initialized = true;
                }
                
                console.log(`Phantom Core v${CONFIG.VERSION} initialized - Leader: ${window[CORE_ID] ? window[CORE_ID].isLeader : false}, Follower: ${window[CORE_ID] ? window[CORE_ID].isFollower : false}, Mode: ${this.hybridManager.runningMode}`);

            } catch (error) {
                console.error('Phantom Core: Initialization error', error);
                throw error;
            }
        }

        async forceInitialize() {
            try {
                if (!this.safeGM) this.safeGM = initializeSafeGM();
                if (!this.pluginManager) this.pluginManager = new PluginManager(this.safeGM);
                if (!this.api) this.api = new TornAPI(this.safeGM);
                if (!this.gatekeeper) this.gatekeeper = new GateKeeper(this.safeGM, this.api, ToastManager);
                if (!this.ui) this.initializeUI();
                if (!this.hybridManager) {
                    this.hybridManager = new HybridManager();
                    await this.hybridManager.initialize();
                }
                
                await this.gatekeeper.init();
                
                if (window[CORE_ID] && !window[CORE_ID].inLockdown) {
                    this.startPluginDiscovery();
                }
                
                this.isInitialized = true;
                if (window[CORE_ID]) {
                    window[CORE_ID].initialized = true;
                }
            } catch (error) {
                console.error('Phantom Core: Force initialization failed', error);
            }
        }

        loadSettings() {
            try {
                const savedSettings = localStorage.getItem('phantom_core_settings');
                if (savedSettings) {
                    try {
                        this.settings = JSON.parse(savedSettings);
                        if (!this.settings.theme) {
                            this.settings.theme = THEME_DEFAULTS;
                        }
                        if (!this.settings.windowSize) {
                            this.settings.windowSize = CONFIG.DEFAULT_WINDOW_SIZE;
                        }
                    } catch (error) {
                        this.settings = this.getDefaultSettings();
                    }
                } else {
                    this.settings = this.getDefaultSettings();
                }
            } catch (error) {
                this.settings = this.getDefaultSettings();
            }
        }

        getDefaultSettings() {
            return {
                buttonPosition: { x: 15, y: 15 },
                windowSize: CONFIG.DEFAULT_WINDOW_SIZE,
                apiKey: '', 
                autoCloseWindows: true,
                balancedMode: false,
                balancedModeDelay: 100,
                snapToBorder: false,
                theme: THEME_DEFAULTS
            };
        }

        async saveSettings() {
            try {
                if (!this.settings) return false;
                localStorage.setItem('phantom_core_settings', JSON.stringify(this.settings));
                return true;
            } catch (error) {
                console.error('Failed to save settings:', error);
                return false;
            }
        }

        initializeUI() {
            try {
                this.ui = new UIHandler(this.safeGM);
                this.ui.init();
            } catch (error) {
                console.error('Phantom Core: UI initialization failed', error);
            }
        }

        startPluginDiscovery() {
            try {
                if (this.pluginManager) {
                    this.pluginManager.scanForPlugins();
                    this.pluginManager.startAutoDiscovery();
                }
            } catch (error) {
                console.error('Phantom Core: Plugin discovery failed', error);
            }
        }

        registerPlugin(plugin) {
            try {
                if (this.pluginManager) {
                    return this.pluginManager.registerPlugin(plugin);
                }
                return false;
            } catch (error) {
                return false;
            }
        }

        cleanup() {
            try {
                if (this.pluginManager) this.pluginManager.cleanup();
                if (this.api) this.api.cleanup();
                if (this.ui) this.ui.cleanup();
                if (this.gatekeeper) this.gatekeeper.cleanup();
                if (this.hybridManager) this.hybridManager.cleanup();

                if (window[CORE_ID]) {
                    Object.keys(window[CORE_ID]).forEach(key => {
                        if (key.includes('Interval') || key.includes('Timeout')) {
                            const value = window[CORE_ID][key];
                            if (value && typeof value === 'object' && 'clear' in value) {
                                value.clear();
                            } else if (value) {
                                clearInterval(value);
                                clearTimeout(value);
                            }
                        }
                    });
                    
                    if (window[CORE_ID].broadcastChannel) {
                        window[CORE_ID].broadcastChannel.close();
                    }
                    
                    if (window[CORE_ID].glowIntervals) {
                        window[CORE_ID].glowIntervals.forEach(interval => clearInterval(interval));
                        window[CORE_ID].glowIntervals.clear();
                    }
                    
                    if (window[CORE_ID].pendingRequests) {
                        window[CORE_ID].pendingRequests.clear();
                    }
                }
                
                try { 
                    delete window.phantomCore; 
                } catch (e) {}
                try { 
                    delete window.PhantomCoreAPI; 
                } catch (e) {}
                try { 
                    if (window[CORE_ID]) {
                        delete window[CORE_ID];
                    }
                } catch (e) {}
                
            } catch (error) {
                console.error('Phantom Core: Cleanup failed', error);
            }
        }
    }

    // Define global properties
    const defineGlobalProperty = (name, value) => {
        try {
            const descriptor = Object.getOwnPropertyDescriptor(window, name);
            
            if (descriptor && !descriptor.configurable) {
                if (descriptor.writable) {
                    window[name] = value;
                }
                return false;
            }
            
            Object.defineProperty(window, name, {
                value: value,
                writable: false,
                configurable: true
            });
            return true;
        } catch (e) {
            try {
                window[name] = value;
                return true;
            } catch (e2) {
                console.warn(`Failed to define global property ${name}:`, e2);
                return false;
            }
        }
    };

    let phantomCore;
    try {
        phantomCore = new PhantomCore();
        
        try {
            defineGlobalProperty('phantomCore', phantomCore);
        } catch (e) {
            window.phantomCore = phantomCore;
        }
        
        const PhantomCoreAPI = {
            registerPlugin: (plugin) => phantomCore.registerPlugin(plugin),
            makeAPIRequest: (endpoint, selections) => {
                if (!phantomCore?.api) return Promise.reject('API not available');
                return phantomCore.api.makeRequest(endpoint, selections);
            },
            getUserData: () => {
                if (!phantomCore?.api) return Promise.reject('API not available');
                return phantomCore.api.getUserData();
            },
            getPluginManager: () => phantomCore?.pluginManager,
            showAbout: () => phantomCore?.ui?.showAbout(),
            showConfig: () => phantomCore?.ui?.showConfig(),
            showPlugins: () => phantomCore?.ui?.showPlugins(),
            getVersion: () => CORE_VERSION,
            getStorageAPI: () => {
                if (window.PhantomStorageAPI) return window.PhantomStorageAPI;
                return {
                    set: (key, value) => window.phantomCore?.safeGM?.setValue(key, value) || false,
                    get: (key) => window.phantomCore?.safeGM?.getValue(key),
                    remove: (key) => {
                        window.phantomCore?.safeGM?.setValue(key, null);
                        return true;
                    }
                };
            },
            isLeaderTab: () => window[CORE_ID] ? window[CORE_ID].isLeader : false,
            isFollowerTab: () => window[CORE_ID] ? window[CORE_ID].isFollower : false,
            getHybridMode: () => phantomCore?.hybridManager?.runningMode || CONFIG.DEFAULT_HYBRID_MODE,
            toggleHybridMode: () => phantomCore?.hybridManager?.toggleRunningMode(),
            hasBroadcastChannel: () => !!(window[CORE_ID] && window[CORE_ID].broadcastChannel),
            getWindowSize: () => window[CORE_ID] ? window[CORE_ID].windowSize : (phantomCore?.settings?.windowSize || CONFIG.DEFAULT_WINDOW_SIZE),
            getTheme: () => phantomCore?.settings?.theme || THEME_DEFAULTS,
            applyTheme: (theme) => {
                if (phantomCore?.settings && theme) {
                    phantomCore.settings.theme = { ...THEME_DEFAULTS, ...theme };
                    phantomCore.saveSettings();
                    if (phantomCore.ui) {
                        phantomCore.ui.applyTheme();
                    }
                    return true;
                }
                return false;
            },
            getGateKeeperStatus: () => phantomCore?.gatekeeper?.getVerificationStatus(),
            forceGateKeeperRecheck: () => phantomCore?.gatekeeper?.verifyUser(),
            isGateKeeperVerified: () => phantomCore?.gatekeeper?.isVerified(),
            isInLockdown: () => window[CORE_ID] ? window[CORE_ID].inLockdown : false,
            getLockdownTimeLeft: () => {
                if (!window[CORE_ID] || !window[CORE_ID].inLockdown) return 0;
                const timeLeft = CONFIG.GATEKEEPER_LOCKDOWN_DURATION - (Date.now() - window[CORE_ID].lockdownStart);
                return Math.max(0, timeLeft);
            },
            cleanup: () => phantomCore?.cleanup()
        };
        
        try {
            defineGlobalProperty('PhantomCoreAPI', PhantomCoreAPI);
        } catch (e) {
            window.PhantomCoreAPI = PhantomCoreAPI;
        }
        
        try {
            defineGlobalProperty('registerPhantomPlugin', (plugin) => {
                return window.PhantomCoreAPI?.registerPlugin(plugin) || false;
            });
        } catch (e) {
            window.registerPhantomPlugin = (plugin) => {
                return window.PhantomCoreAPI?.registerPlugin(plugin) || false;
            };
        }
        
        const GatekeeperAPI = {
            verifyUser: () => phantomCore?.gatekeeper?.verifyUser(),
            getVerificationStatus: () => phantomCore?.gatekeeper?.getVerificationStatus(),
            isVerified: () => phantomCore?.gatekeeper?.isVerified(),
            forceRecheck: () => phantomCore?.gatekeeper?.verifyUser(),
            cleanup: () => phantomCore?.gatekeeper?.cleanup()
        };
        
        try {
            defineGlobalProperty('GatekeeperAPI', GatekeeperAPI);
        } catch (e) {
            window.GatekeeperAPI = GatekeeperAPI;
        }

        if (!window.PhantomPlugins) {
            try {
                defineGlobalProperty('PhantomPlugins', []);
            } catch (e) {
                window.PhantomPlugins = [];
            }
        }

    } catch (error) {
        console.error('Phantom Core: Global initialization failed', error);
        setTimeout(async () => {
            if (!window.phantomCore) {
                try {
                    const minimalCore = new PhantomCore();
                    await minimalCore.forceInitialize();
                    window.phantomCore = minimalCore;
                } catch (e) {
                    console.error('Phantom Core: Fallback initialization failed', e);
                }
            }
        }, 3000);
    }

    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.phantomCore) {
            window.phantomCore.cleanup();
        }
    });

})();
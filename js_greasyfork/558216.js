// ==UserScript==
// @name         Phantom Match v1.3.0 Beta
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Phantom Core plugin: Advanced Target Finder with Last seen attack page notifications
// @author       Daturax [2627396]
// @match        https://www.torn.com/*
// @match        https://beta.tornstats.com/*
// @icon         https://img.icons8.com/ios/50/ffffff/target.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      docs.google.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      api.torn.com
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/558040/Phantom%20Core%20v131.user.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559917/Phantom%20Match%20v130%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/559917/Phantom%20Match%20v130%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.phantomMatchInstance) return;

    const PLUGIN_VERSION = '1.3.0 Beta';
    const PLUGIN_ID = 'phantommatch';
    const PLUGIN_NAME = 'Phantom Match';
    const TARGET_ICON = 'https://img.icons8.com/ios/50/ffffff/target.png';
    
    // Configuration defaults
    const DEFAULT_CONFIG = {
        targetPercentage: 0.5,
        tolerance: 0.1,
        customApiKey: "",
        usePhantomStorage: true,
        openAttackPage: true,
        
        // Caching
        lastUserStats: 0,
        lastMatchTime: 0,
        cacheDuration: 3600000,
        sheetCacheTTL: 300000,
        requestCooldown: 2000,
        
        // Attack page notifications
        showLastActionToast: true,
        lastActionCacheTTL: 300000,
        
        // Multi-sheet configuration
        sheets: [
            {
                id: 'sheet1',
                name: 'Inactives',
                url: "https://docs.google.com/spreadsheets/d/1qRTgy3Xdoe50ICVLuF6oS1hyI5ugevGWweeOYea9Vv0/gviz/tq?tqx=out:json",
                enabled: true,
                targetsPerSheet: 8,
                lastUpdated: 0,
                cacheKey: ''
            },
            {
                id: 'sheet2',
                name: 'Sheet 2',
                url: "",
                enabled: false,
                targetsPerSheet: 8,
                lastUpdated: 0,
                cacheKey: ''
            },
            {
                id: 'sheet3',
                name: 'Sheet 3',
                url: "",
                enabled: false,
                targetsPerSheet: 8,
                lastUpdated: 0,
                cacheKey: ''
            },
            {
                id: 'sheet4',
                name: 'Sheet 4',
                url: "",
                enabled: false,
                targetsPerSheet: 8,
                lastUpdated: 0,
                cacheKey: ''
            },
            {
                id: 'sheet5',
                name: 'Sheet 5',
                url: "",
                enabled: false,
                targetsPerSheet: 8,
                lastUpdated: 0,
                cacheKey: ''
            }
        ],
        
        // UI settings
        windowWidth: 300,
        autoResizeWindows: true,
        showSheetBadges: true,
        sortByStats: true,
        maxTotalTargets: 25,
        compactMode: true,
        useIcons: true,
        
        // Performance
        useCSPsafeMethods: true,
        lastRequestTime: 0,
        requestQueue: []
    };

    class PhantomMatch {
        constructor() {
            this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            this.config = this.initializeConfig();
            this.userBattleStats = 0;
            this.matchedTargets = [];
            this.windowElement = null;
            this.settingsWindow = null;
            this.isInitialized = false;
            this.storage = null;
            this.hasRegistered = false;
            this.eventListeners = new Map();
            this.usingPhantomCoreTheme = false;
            this.currentPhantomCoreVersion = null;
            this.isPhantomCoreLockdown = false;
            this.cleanupCallbacks = [];
            
            // Performance
            this.sheetCache = new Map();
            this.requestQueue = [];
            this.isProcessingQueue = false;
            this.lastSheetFetch = 0;
            
            // Attack page observer
            this.attackPageObserver = null;
            this.lastActionCache = new Map();
            this.currentTargetId = null;
            
            // Refresh cooldown
            this.refreshCooldown = false;
            this.refreshCooldownEnd = 0;
            this.cooldownInterval = null;
        }

        initializeConfig() {
            const config = { ...DEFAULT_CONFIG };
            
            // Mobile adjustments
            if (this.isMobile) {
                config.maxTotalTargets = 20;
                config.targetsPerSheet = 6;
                config.windowWidth = 280;
            }
            
            return config;
        }

        async initialize() {
            if (this.isInitialized) return;

            try {
                await this.checkPhantomCoreCompatibility();
                await this.loadConfiguration();
                this.setupStorage();
                this.setupThemeIntegration();
                await this.registerPlugin();
                this.injectStyles();
                this.setupAttackPageMonitor();
                this.setupCleanup();
                
                this.isInitialized = true;
                
            } catch (error) {
                console.error('[Phantom Match] Initialization failed:', error);
            }
        }

        async checkPhantomCoreCompatibility() {
            // Use PhantomCoreAPI if available
            if (window.PhantomCoreAPI) {
                this.currentPhantomCoreVersion = window.PhantomCoreAPI.getVersion() || '1.3.1';
                this.isPhantomCoreLockdown = window.PhantomCoreAPI.isInLockdown() || false;
                return;
            }
            
            // Look for Phantom Core state container
            const phantomCoreKeys = Object.keys(window).filter(key => 
                key.startsWith('phantom_core_')
            );
            
            if (phantomCoreKeys.length > 0) {
                const coreKey = phantomCoreKeys[0];
                const coreState = window[coreKey];
                
                if (coreState) {
                    this.currentPhantomCoreVersion = coreKey
                        .replace('phantom_core_', '')
                        .replace(/_/g, '.');
                    
                    this.isPhantomCoreLockdown = coreState.inLockdown || false;
                    return;
                }
            }
            
            // Use GatekeeperAPI
            if (window.GatekeeperAPI) {
                const gkStatus = window.GatekeeperAPI.getVerificationStatus();
                if (gkStatus) {
                    this.isPhantomCoreLockdown = gkStatus.isLockdown || false;
                }
            }
            
            // Fallback to window.phantomCore
            if (window.phantomCore && window.phantomCore.isInitialized) {
                this.currentPhantomCoreVersion = '1.3.1';
                
                if (window.phantomCore.gatekeeper) {
                    const gkStatus = window.phantomCore.gatekeeper.getVerificationStatus();
                    this.isPhantomCoreLockdown = gkStatus?.isLockdown || false;
                }
            }
        }

        async loadConfiguration() {
            try {
                let loadedConfig = null;
                
                // Try Phantom Storage first
                if (window.PhantomStorageAPI?.get && this.config.usePhantomStorage) {
                    try {
                        loadedConfig = await window.PhantomStorageAPI.get(`${PLUGIN_ID}_config`);
                    } catch (error) {
                        // Silently fail
                    }
                }
                
                // Try GM Storage
                if (!loadedConfig && typeof GM_getValue !== 'undefined') {
                    try {
                        loadedConfig = GM_getValue(`${PLUGIN_ID}_config`);
                    } catch (error) {
                        // Silently fail
                    }
                }
                
                // Try LocalStorage
                if (!loadedConfig) {
                    try {
                        const localConfig = localStorage.getItem(`${PLUGIN_ID}_config`);
                        if (localConfig) {
                            loadedConfig = JSON.parse(localConfig);
                        }
                    } catch (error) {
                        // Silently fail
                    }
                }
                
                // Merge with defaults
                if (loadedConfig) {
                    if (loadedConfig.sheets && Array.isArray(loadedConfig.sheets)) {
                        this.config.sheets = this.config.sheets.map((defaultSheet, index) => {
                            const savedSheet = loadedConfig.sheets[index];
                            if (savedSheet) {
                                return {
                                    ...defaultSheet,
                                    ...savedSheet,
                                    name: savedSheet.name || defaultSheet.name,
                                    id: savedSheet.id || defaultSheet.id,
                                    targetsPerSheet: savedSheet.targetsPerSheet || 8
                                };
                            }
                            return defaultSheet;
                        });
                    }
                    
                    const { sheets, ...otherConfig } = loadedConfig;
                    this.config = {
                        ...this.config,
                        ...otherConfig
                    };
                }
                
                await this.syncWindowWidth();
                
            } catch (error) {
                console.error('[Phantom Match] Failed to load configuration:', error);
            }
        }

        async syncWindowWidth() {
            try {
                if (window.PhantomCoreAPI?.getWindowSize) {
                    const coreWidth = window.PhantomCoreAPI.getWindowSize();
                    if (coreWidth && coreWidth > 200) {
                        this.config.windowWidth = Math.min(coreWidth, this.isMobile ? 320 : 400);
                    }
                }
            } catch (error) {
                // Silently fail
            }
        }

        async saveConfiguration() {
            try {
                await this.syncWindowWidth();
                
                if (window.PhantomStorageAPI?.set && this.config.usePhantomStorage) {
                    await window.PhantomStorageAPI.set(`${PLUGIN_ID}_config`, this.config);
                    return true;
                }
                
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(`${PLUGIN_ID}_config`, this.config);
                    return true;
                }
                
                localStorage.setItem(`${PLUGIN_ID}_config`, JSON.stringify(this.config));
                return true;
                
            } catch (error) {
                console.error('[Phantom Match] Failed to save configuration:', error);
                return false;
            }
        }

        setupStorage() {
            if (window.PhantomStorageAPI) {
                this.storage = window.PhantomStorageAPI;
            } else {
                this.storage = {
                    get: (key) => {
                        if (typeof GM_getValue !== 'undefined') {
                            return GM_getValue(key);
                        }
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : null;
                    },
                    set: (key, value) => {
                        if (typeof GM_setValue !== 'undefined') {
                            GM_setValue(key, value);
                            return true;
                        }
                        localStorage.setItem(key, JSON.stringify(value));
                        return true;
                    }
                };
            }
        }

        setupThemeIntegration() {
            if (window.phantomCore?.ui?.applyTheme) {
                this.usingPhantomCoreTheme = true;
                
                if (window.phantomCore.pluginManager && typeof window.phantomCore.pluginManager.on === 'function') {
                    const themeChangeHandler = () => {
                        this.applyThemeStyles();
                    };
                    
                    window.phantomCore.pluginManager.on('themeChanged', themeChangeHandler);
                    this.cleanupCallbacks.push(() => {
                        if (window.phantomCore.pluginManager && typeof window.phantomCore.pluginManager.off === 'function') {
                            window.phantomCore.pluginManager.off('themeChanged', themeChangeHandler);
                        }
                    });
                }
            }
        }

        applyThemeStyles() {
            if (!this.usingPhantomCoreTheme || !this.windowElement) return;
            
            const theme = window.phantomCore?.settings?.theme || {
                primaryColor: '#00ff00',
                backgroundColor: 'rgba(0,0,0,0.85)',
                windowTransparency: 0.85
            };
            
            const style = document.getElementById('phantom-match-styles');
            if (style) {
                style.textContent = this.generateCSS(theme);
            }
        }

        generateCSS(theme) {
            const primaryColor = theme.primaryColor || '#00ff00';
            const bgColor = theme.backgroundColor || 'rgba(0,0,0,0.85)';
            const frostBlur = theme.frostBlur || '8px';
            
            return `
                /* Phantom Match CSS v${PLUGIN_VERSION} - GPLv3 */
                :root {
                    --pm-primary: ${primaryColor};
                    --pm-bg: ${bgColor};
                    --pm-border: ${primaryColor}80;
                    --pm-glow: ${primaryColor}30;
                    --pm-frost: ${frostBlur};
                }
                
                .phantom-match-window, .phantom-match-settings-window {
                    z-index: 10060;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: ${this.config.windowWidth}px;
                    max-width: 95vw;
                    max-height: 85vh;
                    background: var(--pm-bg);
                    border: 2px solid var(--pm-border);
                    border-radius: 12px;
                    color: #fff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
                    overflow: hidden;
                    display: none;
                    backdrop-filter: blur(var(--pm-frost));
                    -webkit-backdrop-filter: blur(var(--pm-frost));
                }
                
                .phantom-match-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--pm-border);
                    background: rgba(0,0,0,0.4);
                    min-height: 48px;
                    flex-shrink: 0;
                }
                
                .phantom-match-header h3 {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--pm-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .phantom-match-header-icon {
                    width: 20px;
                    height: 20px;
                    filter: drop-shadow(0 0 4px var(--pm-primary));
                }
                
                .phantom-match-header-controls {
                    display: flex;
                    gap: 6px;
                }
                
                .pm-btn {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid var(--pm-border);
                    border-radius: 6px;
                    color: #fff;
                    padding: 6px 10px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 32px;
                    min-height: 32px;
                }
                
                .pm-btn:hover, .pm-btn:active {
                    background: rgba(255,255,255,0.2);
                }
                
                .pm-btn-icon {
                    width: 14px;
                    height: 14px;
                    filter: invert(1) brightness(2);
                }
                
                .phantom-match-container {
                    display: flex;
                    flex-direction: column;
                    height: calc(85vh - 64px);
                    overflow: hidden;
                }
                
                .phantom-match-content {
                    padding: 16px;
                    overflow-y: auto;
                    flex: 1;
                    min-height: 0;
                }
                
                .phantom-match-info {
                    text-align: center;
                    padding: 12px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 8px;
                    margin-bottom: 12px;
                }
                
                .phantom-match-info p {
                    margin: 0 0 12px 0;
                    color: #aaa;
                    font-size: 13px;
                    line-height: 1.4;
                }
                
                .pm-action-btn {
                    background: var(--pm-glow);
                    border: 1px solid var(--pm-border);
                    border-radius: 8px;
                    color: #fff;
                    padding: 10px 16px;
                    cursor: pointer;
                    font-weight: 600;
                    width: 100%;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                
                .pm-action-btn:hover, .pm-action-btn:active {
                    background: var(--pm-primary)40;
                    transform: translateY(-1px);
                }
                
                .pm-action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .pm-action-btn.cooldown {
                    position: relative;
                    overflow: hidden;
                }
                
                .pm-action-btn.cooldown::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent 0%, var(--pm-primary)20 50%, transparent 100%);
                    animation: cooldown-shimmer 2s infinite;
                }
                
                @keyframes cooldown-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .phantom-match-stats-info {
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 12px;
                    font-size: 12px;
                }
                
                .phantom-match-stats-header {
                    color: #aaa;
                    margin-bottom: 4px;
                }
                
                .phantom-match-stats-value {
                    color: var(--pm-primary);
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 6px;
                }
                
                .phantom-match-stats-range {
                    color: #aaa;
                    font-size: 11px;
                    line-height: 1.3;
                }
                
                .phantom-match-targets-list {
                    overflow-y: auto;
                    margin-bottom: 12px;
                    flex: 1;
                    min-height: 0;
                }
                
                .phantom-match-target-item {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    padding: 8px 10px;
                    margin-bottom: 6px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-height: 40px;
                    transition: all 0.2s;
                }
                
                .phantom-match-target-item:active {
                    background: rgba(255,255,255,0.1);
                }
                
                .phantom-match-target-link {
                    color: #00aaff;
                    text-decoration: none;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-height: 32px;
                }
                
                .phantom-match-target-link:hover {
                    text-decoration: underline;
                }
                
                .phantom-match-target-info {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    flex: 1;
                }
                
                .phantom-match-target-name-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .target-icon {
                    width: 16px;
                    height: 16px;
                    filter: invert(1) brightness(1.5);
                }
                
                .phantom-match-target-name {
                    font-weight: 600;
                    font-size: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex: 1;
                }
                
                .phantom-match-sheet-badge {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    background: var(--pm-glow);
                    border: 1px solid var(--pm-border);
                    color: var(--pm-primary);
                    white-space: nowrap;
                }
                
                .phantom-match-target-stats {
                    font-size: 11px;
                    color: #aaa;
                    text-align: right;
                    min-width: 80px;
                }
                
                .target-stats-value {
                    color: var(--pm-primary);
                    font-weight: 600;
                }
                
                .target-id {
                    font-size: 10px;
                    opacity: 0.7;
                }
                
                .phantom-match-footer {
                    padding: 16px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    background: rgba(0,0,0,0.3);
                    flex-shrink: 0;
                }
                
                .phantom-match-button-container {
                    display: flex;
                    gap: 10px;
                }
                
                .phantom-match-button-container button {
                    flex: 1;
                    min-width: 100px;
                }
                
                .phantom-match-settings-content {
                    padding: 0 4px;
                    max-height: calc(70vh - 64px);
                    overflow-y: auto;
                    padding-bottom: 16px;
                }
                
                .phantom-match-setting-group {
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                
                .phantom-match-setting-group:last-child {
                    border-bottom: none;
                }
                
                .phantom-match-setting-group h4 {
                    margin: 0 0 10px 0;
                    color: var(--pm-primary);
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .group-icon {
                    width: 16px;
                    height: 16px;
                    filter: invert(1) brightness(1.5);
                }
                
                .phantom-match-setting-row {
                    margin-bottom: 12px;
                    padding: 0 4px;
                }
                
                .phantom-match-setting-row.compact {
                    margin-bottom: 8px;
                }
                
                .phantom-match-setting-row label {
                    color: #fff;
                    font-size: 13px;
                    display: block;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }
                
                .phantom-match-input {
                    width: 100%;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid var(--pm-border);
                    border-radius: 6px;
                    color: #fff;
                    padding: 8px 10px;
                    font-size: 13px;
                    box-sizing: border-box;
                }
                
                .phantom-match-input:focus {
                    outline: none;
                    border-color: var(--pm-primary);
                    box-shadow: 0 0 0 2px var(--pm-glow);
                }
                
                .phantom-match-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 4px;
                }
                
                .phantom-match-slider {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: rgba(0,0,0,0.5);
                    outline: none;
                    -webkit-appearance: none;
                }
                
                .phantom-match-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--pm-primary);
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 0 4px rgba(0,0,0,0.5);
                }
                
                .phantom-match-slider-value {
                    min-width: 40px;
                    text-align: right;
                    color: var(--pm-primary);
                    font-weight: 600;
                    font-size: 13px;
                }
                
                .phantom-match-sheet-config {
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                    padding: 10px;
                    margin-bottom: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                .phantom-match-sheet-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                
                .pm-checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                }
                
                .phantom-match-settings-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    padding: 0 4px;
                }
                
                .pm-settings-btn {
                    flex: 1;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid var(--pm-primary);
                    background: var(--pm-primary);
                    color: #fff;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                    min-width: 100px;
                }
                
                .pm-settings-btn:hover, .pm-settings-btn:active {
                    background: var(--pm-primary)80;
                }
                
                .pm-settings-btn.secondary {
                    background: rgba(255, 0, 0, 0.15);
                    border-color: #ff0000;
                }
                
                .pm-settings-btn.secondary:hover, .pm-settings-btn.secondary:active {
                    background: rgba(255, 0, 0, 0.3);
                }
                
                .phantom-match-loading, .phantom-match-error {
                    text-align: center;
                    padding: 30px 20px;
                }
                
                .phantom-match-loading-title, .phantom-match-error-title {
                    color: var(--pm-primary);
                    font-weight: 600;
                    margin-bottom: 12px;
                    font-size: 16px;
                }
                
                .phantom-match-error-title {
                    color: #ff4444;
                }
                
                .phantom-match-loading-message, .phantom-match-error-message {
                    color: #fff;
                    margin-bottom: 12px;
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                .phantom-match-loading-spinner {
                    width: 28px;
                    height: 28px;
                    margin: 12px auto;
                    border: 3px solid var(--pm-glow);
                    border-top: 3px solid var(--pm-primary);
                    border-radius: 50%;
                    animation: pm-spin 1s linear infinite;
                }
                
                @keyframes pm-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 400px) {
                    .phantom-match-window, .phantom-match-settings-window {
                        width: 95vw !important;
                        max-width: 95vw !important;
                    }
                    
                    .phantom-match-target-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 6px;
                        padding: 10px;
                    }
                    
                    .phantom-match-target-stats {
                        text-align: left;
                        width: 100%;
                    }
                    
                    .phantom-match-settings-actions,
                    .phantom-match-button-container {
                        flex-direction: column;
                    }
                    
                    .pm-settings-btn,
                    .phantom-match-button-container button {
                        width: 100%;
                    }
                }
                
                /* Scrollbar styling */
                .phantom-match-content::-webkit-scrollbar,
                .phantom-match-targets-list::-webkit-scrollbar,
                .phantom-match-settings-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .phantom-match-content::-webkit-scrollbar-track,
                .phantom-match-targets-list::-webkit-scrollbar-track,
                .phantom-match-settings-content::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.2);
                    border-radius: 3px;
                }
                
                .phantom-match-content::-webkit-scrollbar-thumb,
                .phantom-match-targets-list::-webkit-scrollbar-thumb,
                .phantom-match-settings-content::-webkit-scrollbar-thumb {
                    background: var(--pm-primary)60;
                    border-radius: 3px;
                }
            `;
        }

        injectStyles() {
            const existing = document.getElementById('phantom-match-styles');
            if (existing) existing.remove();
            
            const style = document.createElement('style');
            style.id = 'phantom-match-styles';
            
            if (this.usingPhantomCoreTheme) {
                const theme = window.phantomCore?.settings?.theme || {
                    primaryColor: '#00ff00',
                    backgroundColor: 'rgba(0,0,0,0.85)'
                };
                style.textContent = this.generateCSS(theme);
            } else {
                style.textContent = this.generateCSS({});
            }
            
            document.head.appendChild(style);
        }

        async registerPlugin() {
            if (this.hasRegistered) return;
            
            this.pluginInfo = {
                id: PLUGIN_ID,
                name: PLUGIN_NAME,
                version: PLUGIN_VERSION,
                author: 'Daturax [2627396]',
                description: 'Mobile-optimized target finder with attack page notifications',
                icon: TARGET_ICON,
                enabled: true,
                loaded: false,
                
                init: () => {
                    this.pluginInfo.loaded = true;
                },
                
                cleanup: () => {
                    this.cleanup();
                    this.pluginInfo.loaded = false;
                },
                
                execute: () => {
                    this.openMainWindow();
                },
                
                showWindow: () => {
                    this.openMainWindow();
                    return true;
                }
            };

            const registerWithCore = () => {
                if (window.phantomCore?.registerPlugin) {
                    window.phantomCore.registerPlugin(this.pluginInfo);
                    this.hasRegistered = true;
                } else if (window.PhantomCoreAPI?.registerPlugin) {
                    window.PhantomCoreAPI.registerPlugin(this.pluginInfo);
                    this.hasRegistered = true;
                } else if (window.registerPhantomPlugin) {
                    window.registerPhantomPlugin(this.pluginInfo);
                    this.hasRegistered = true;
                }
            };
            
            setTimeout(registerWithCore, 1000);
            
            setTimeout(() => {
                if (!this.hasRegistered) {
                    this.pluginInfo.init();
                    this.hasRegistered = true;
                }
            }, 3000);
        }

        setupAttackPageMonitor() {
            if (!this.config.showLastActionToast) return;
            
            this.checkAttackPage();
            
            this.attackPageObserver = new MutationObserver(() => {
                this.checkAttackPage();
            });
            
            this.attackPageObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            window.addEventListener('hashchange', () => this.checkAttackPage());
            
            this.cleanupCallbacks.push(() => {
                if (this.attackPageObserver) {
                    this.attackPageObserver.disconnect();
                    this.attackPageObserver = null;
                }
                window.removeEventListener('hashchange', () => this.checkAttackPage());
            });
        }

        async checkAttackPage() {
            try {
                const currentUrl = window.location.href;
                const isAttackPage = currentUrl.includes('/loader.php?sid=attack') || 
                                     currentUrl.includes('/loader.php?sid=attack&');
                
                if (!isAttackPage) {
                    this.currentTargetId = null;
                    return;
                }
                
                const urlParams = new URLSearchParams(window.location.search);
                const targetId = urlParams.get('user2ID');
                
                if (!targetId || targetId === this.currentTargetId) {
                    return;
                }
                
                this.currentTargetId = targetId;
                await this.showTargetLastActionToast(targetId);
                
            } catch (error) {
                // Silently fail
            }
        }

        async showTargetLastActionToast(targetId) {
            if (!this.config.showLastActionToast || this.isPhantomCoreLockdown) {
                return;
            }
            
            try {
                const cacheKey = `last_action_${targetId}`;
                const cached = this.lastActionCache.get(cacheKey);
                const now = Date.now();
                
                if (cached && (now - cached.timestamp < this.config.lastActionCacheTTL)) {
                    this.showMessage(`🎯 Target last seen: ${cached.lastAction}`, 'info', 5000);
                    return;
                }
                
                const lastAction = await this.fetchTargetLastAction(targetId);
                if (lastAction) {
                    this.lastActionCache.set(cacheKey, {
                        lastAction,
                        timestamp: now
                    });
                    
                    this.showMessage(`🎯 Target last seen: ${lastAction}`, 'info', 5000);
                }
                
            } catch (error) {
                // Don't show error toast
            }
        }

        async fetchTargetLastAction(targetId) {
            return new Promise((resolve, reject) => {
                const now = Date.now();
                if (now - this.config.lastRequestTime < this.config.requestCooldown) {
                    setTimeout(() => this.fetchTargetLastAction(targetId).then(resolve).catch(reject), 
                             this.config.requestCooldown - (now - this.config.lastRequestTime));
                    return;
                }
                
                let apiKey = this.config.customApiKey?.trim();
                if (!apiKey) {
                    if (window.phantomCore?.settings?.apiKey?.trim()) {
                        apiKey = window.phantomCore.settings.apiKey.trim();
                    } else {
                        apiKey = '###PDA-APIKEY###';
                    }
                }
                
                const url = `https://api.torn.com/v2/user/${targetId}/profile?striptags=true&key=${apiKey}&comment=phantom_match`;
                
                const makeRequest = () => {
                    this.config.lastRequestTime = Date.now();
                    
                    if (typeof GM_xmlhttpRequest !== 'undefined') {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            timeout: 10000,
                            onload: (response) => {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.error) {
                                        reject(new Error(data.error.error || 'API Error'));
                                        return;
                                    }
                                    
                                    if (data.profile?.last_action?.relative) {
                                        resolve(data.profile.last_action.relative);
                                    } else {
                                        resolve('Unknown');
                                    }
                                } catch (e) {
                                    reject(e);
                                }
                            },
                            onerror: () => reject(new Error("Network error")),
                            ontimeout: () => reject(new Error("Timeout"))
                        });
                    } else {
                        fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) reject(new Error(data.error.error || 'API Error'));
                            else if (data.profile?.last_action?.relative) resolve(data.profile.last_action.relative);
                            else resolve('Unknown');
                        })
                        .catch(reject);
                    }
                };
                
                makeRequest();
            });
        }

        openMainWindow() {
            if (this.isPhantomCoreLockdown) {
                this.showMessage('❌ Phantom Core is in lockdown mode', 'error');
                return;
            }
            
            this.closeMainWindow();
            
            this.windowElement = document.createElement('div');
            this.windowElement.className = 'phantom-match-window';
            this.windowElement.style.width = `${this.config.windowWidth}px`;
            this.windowElement.style.display = 'block';
            
            const closeIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyIDE5IDYuNDF6IiBmaWxsPSIjZmZmIi8+PC9zdmc+';
            const settingsIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkuMTQgMTIuOTRjLjA0LS4zLjA2LS42MS4wNi0uOTRzLS4wMi0uNjQtLjA2LS45NGwyLjAzLTEuNTlhLjQ1Mi40NTIgMCAwMC4xMi0uNTcgMTcuNjY3IDE3LjY2NyAwIDAwLTEuNTQtMi4zMWMtLjEyLS4xOC0uMzktLjI0LS41OS0uMThsLTIuMzkuOTZjLS41LS4zOC0xLjAzLS43LTEuNi0uOTRsLS4zNi0yLjU0YS40ODQuNDg0IDAgMDAtLjQ2LS40MUg4LjQxYy0uMjMgMC0uNDMuMTctLjQ3LjQxbC0uMzYgMi41NGMtLjU3LjI0LTEuMS41Ni0xLjYuOTRsLTIuMzktLjk2Yy0uMi0uMDYtLjQ3IDAtLjU5LjE4LTEuMTcgMS42OS0xLjUgMi4zMS0xLjU0IDIuMzEuMDQuMTEuMDEuMjQuMDguMzNsMi4wMyAxLjU5Yy0uMDQuMy0uMDcuNjMtLjA3Ljk0cy4wMi42NC4wNi45NGwtMi4wMyAxLjU5YS40OTIuNDkyIDAgMDAtLjA4LjMzYy4wNC4xMS4wOC4yMi4xMS4zMy40Ni42NyAxLjI0IDIuMzEgMS41NCAyLjMxLjEyLjE4LjM5LjI0LjU5LjE4bDIuMzktLjk2Yy41LjM4IDEuMDMuNyAxLjYuOTRsLjM2IDIuNTRjLjA1LjI0LjI0LjQxLjQ3LjQxaDIuNzhjLjIzIDAgLjQyLS4xNy40Ny0uNDFsLjM2LTIuNTRjLjU3LS4yNCAxLjEtLjU2IDEuNi0uOTRsMi4zOS45NmMuMi4wNi40NyAwIC41OS0uMTguMy0uNDQgMS4yNC0xLjk4IDEuNTQtMi4zMS4xMi0uMTguMDItLjQxLS4wOS0uNTNsLTIuMDEtMS42MXpNMTIgMTUuNWEzLjUgMy41IDAgMTEwLTcgMy41IDMuNSAwIDAxMCA3eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';
            
            this.windowElement.innerHTML = `
                <div class="phantom-match-header">
                    <h3>
                        <img src="${TARGET_ICON}" class="phantom-match-header-icon" alt="Target">
                        Phantom Match v${PLUGIN_VERSION}
                    </h3>
                    <div class="phantom-match-header-controls">
                        <button class="pm-btn" id="phantom-match-settings" title="Settings">
                            <img src="${settingsIcon}" class="pm-btn-icon" alt="⚙️">
                        </button>
                        <button class="pm-btn" id="phantom-match-close" title="Close">
                            <img src="${closeIcon}" class="pm-btn-icon" alt="✕">
                        </button>
                    </div>
                </div>
                <div class="phantom-match-container">
                    <div class="phantom-match-content">
                        <div id="phantom-match-content">
                            <div class="phantom-match-info">
                                <p>Find targets at <strong>${(this.config.targetPercentage * 100).toFixed(0)}%</strong> 
                                of your battle stats (±${(this.config.tolerance * 100).toFixed(0)}%)</p>
                                <button class="pm-action-btn" id="phantom-match-find">
                                    Find Targets
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.windowElement);
            this.addEventListeners(this.windowElement, 'main');
        }
        
        addEventListeners(element, type) {
            if (type === 'main') {
                const closeBtn = element.querySelector('#phantom-match-close');
                const findBtn = element.querySelector('#phantom-match-find');
                const settingsBtn = element.querySelector('#phantom-match-settings');
                
                const closeHandler = (e) => {
                    e.preventDefault();
                    this.closeMainWindow();
                };
                
                const findHandler = (e) => {
                    e.preventDefault();
                    this.findTargets();
                };
                
                const settingsHandler = (e) => {
                    e.preventDefault();
                    this.openSettingsWindow();
                };
                
                closeBtn.addEventListener('click', closeHandler);
                findBtn.addEventListener('click', findHandler);
                settingsBtn.addEventListener('click', settingsHandler);
                
                this.eventListeners.set(element, [
                    { element: closeBtn, type: 'click', handler: closeHandler },
                    { element: findBtn, type: 'click', handler: findHandler },
                    { element: settingsBtn, type: 'click', handler: settingsHandler }
                ]);
            } else if (type === 'settings') {
                const closeBtn = element.querySelector('#pm-settings-close');
                const saveBtn = element.querySelector('#pm-settings-save');
                const resetBtn = element.querySelector('#pm-settings-reset');
                
                const closeHandler = (e) => {
                    e.preventDefault();
                    this.closeSettingsWindow();
                };
                
                const saveHandler = (e) => {
                    e.preventDefault();
                    this.saveSettings();
                };
                
                const resetHandler = (e) => {
                    e.preventDefault();
                    if (confirm('Reset all settings to defaults?')) {
                        this.config = this.initializeConfig();
                        this.saveConfiguration().then(() => {
                            this.showMessage('✅ Settings reset', 'success');
                            this.closeSettingsWindow();
                        });
                    }
                };
                
                closeBtn.addEventListener('click', closeHandler);
                saveBtn.addEventListener('click', saveHandler);
                resetBtn.addEventListener('click', resetHandler);
                
                const percentSlider = element.querySelector('#pm-percentage');
                const percentValue = element.querySelector('#pm-percent-value');
                const toleranceSlider = element.querySelector('#pm-tolerance');
                const toleranceValue = element.querySelector('#pm-tolerance-value');
                
                const updatePercent = (e) => {
                    const value = parseInt(e.target.value);
                    if (percentValue) percentValue.textContent = `${value}%`;
                    const span = percentSlider?.nextElementSibling;
                    if (span) span.textContent = `${value}%`;
                };
                
                const updateTolerance = (e) => {
                    const value = parseInt(e.target.value);
                    if (toleranceValue) toleranceValue.textContent = `${value}%`;
                    const span = toleranceSlider?.nextElementSibling;
                    if (span) span.textContent = `${value}%`;
                };
                
                if (percentSlider) percentSlider.addEventListener('input', updatePercent);
                if (toleranceSlider) toleranceSlider.addEventListener('input', updateTolerance);
                
                this.eventListeners.set(element, [
                    { element: closeBtn, type: 'click', handler: closeHandler },
                    { element: saveBtn, type: 'click', handler: saveHandler },
                    { element: resetBtn, type: 'click', handler: resetHandler },
                    ...(percentSlider ? [{ element: percentSlider, type: 'input', handler: updatePercent }] : []),
                    ...(toleranceSlider ? [{ element: toleranceSlider, type: 'input', handler: updateTolerance }] : [])
                ]);
            }
        }
        
        closeMainWindow() {
            if (this.windowElement) {
                this.removeEventListeners(this.windowElement);
                if (this.windowElement.parentNode) {
                    this.windowElement.parentNode.removeChild(this.windowElement);
                }
                this.windowElement = null;
            }
        }
        
        async findTargets() {
            if (this.isPhantomCoreLockdown) {
                this.showMessage('❌ Phantom Core is in lockdown mode', 'error');
                return;
            }
            
            this.showLoading('Loading your battle stats...');
            
            try {
                const now = Date.now();
                const useCache = this.config.lastMatchTime && 
                               (now - this.config.lastMatchTime < this.config.cacheDuration) && 
                               this.config.lastUserStats > 0;
                
                if (useCache) {
                    this.userBattleStats = this.config.lastUserStats;
                } else {
                    const stats = await this.getUserBattleStats();
                    if (!stats) {
                        this.showMessage('Failed to fetch battle stats', 'error');
                        return;
                    }
                    
                    this.userBattleStats = stats;
                    this.config.lastUserStats = stats;
                    this.config.lastMatchTime = now;
                    await this.saveConfiguration();
                }
                
                await this.fetchAllSheets();
                
            } catch (error) {
                console.error('[Phantom Match] Error finding targets:', error);
                this.showMessage('Error: ' + error.message, 'error');
            }
        }
        
        async refreshTargets() {
            if (this.refreshCooldown) {
                const timeLeft = Math.ceil((this.refreshCooldownEnd - Date.now()) / 1000);
                if (timeLeft > 0) {
                    this.showMessage(`⏳ Please wait ${timeLeft}s before refreshing`, 'info');
                    return;
                }
            }
            
            this.refreshCooldown = true;
            this.refreshCooldownEnd = Date.now() + 10000;
            
            this.updateRefreshButton();
            
            if (this.cooldownInterval) clearInterval(this.cooldownInterval);
            this.cooldownInterval = setInterval(() => {
                const timeLeft = this.refreshCooldownEnd - Date.now();
                if (timeLeft <= 0) {
                    this.refreshCooldown = false;
                    clearInterval(this.cooldownInterval);
                    this.cooldownInterval = null;
                    this.updateRefreshButton();
                } else {
                    this.updateRefreshButton();
                }
            }, 1000);
            
            await this.findTargets();
        }
        
        updateRefreshButton() {
            const refreshBtn = document.getElementById('phantom-match-refresh');
            if (!refreshBtn) return;
            
            if (this.refreshCooldown) {
                const timeLeft = Math.ceil((this.refreshCooldownEnd - Date.now()) / 1000);
                if (timeLeft > 0) {
                    refreshBtn.textContent = `Refresh (${timeLeft}s)`;
                    refreshBtn.disabled = true;
                    refreshBtn.classList.add('cooldown');
                } else {
                    refreshBtn.textContent = 'Refresh Targets';
                    refreshBtn.disabled = false;
                    refreshBtn.classList.remove('cooldown');
                }
            } else {
                refreshBtn.textContent = 'Refresh Targets';
                refreshBtn.disabled = false;
                refreshBtn.classList.remove('cooldown');
            }
        }
        
        async getUserBattleStats() {
            return new Promise((resolve, reject) => {
                const now = Date.now();
                if (now - this.config.lastRequestTime < this.config.requestCooldown) {
                    setTimeout(() => this.getUserBattleStats().then(resolve).catch(reject), 
                             this.config.requestCooldown - (now - this.config.lastRequestTime));
                    return;
                }
                
                let apiKey = this.config.customApiKey?.trim();
                if (!apiKey) {
                    if (window.phantomCore?.settings?.apiKey?.trim()) {
                        apiKey = window.phantomCore.settings.apiKey.trim();
                    } else {
                        apiKey = '###PDA-APIKEY###';
                    }
                }
                
                const makeRequest = () => {
                    this.config.lastRequestTime = Date.now();
                    
                    const url = `https://api.torn.com/user/?selections=battlestats&key=${apiKey}&comment=phantom_match`;
                    
                    if (typeof GM_xmlhttpRequest !== 'undefined') {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            timeout: 10000,
                            onload: (response) => {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.error) {
                                        reject(new Error(data.error.error || 'API Error'));
                                        return;
                                    }
                                    
                                    const totalStats = (data.strength || 0) + 
                                                     (data.defense || 0) + 
                                                     (data.speed || 0) + 
                                                     (data.dexterity || 0);
                                    
                                    if (totalStats > 0) {
                                        resolve(totalStats);
                                    } else {
                                        reject(new Error("Invalid stats"));
                                    }
                                } catch (e) {
                                    reject(e);
                                }
                            },
                            onerror: () => reject(new Error("Network error")),
                            ontimeout: () => reject(new Error("Timeout"))
                        });
                    } else {
                        fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) reject(new Error(data.error.error || 'API Error'));
                            else {
                                const totalStats = (data.strength || 0) + 
                                                 (data.defense || 0) + 
                                                 (data.speed || 0) + 
                                                 (data.dexterity || 0);
                                resolve(totalStats);
                            }
                        })
                        .catch(reject);
                    }
                };
                
                makeRequest();
            });
        }
        
        async fetchAllSheets() {
            const enabledSheets = this.getEnabledSheets();
            if (enabledSheets.length === 0) {
                this.showMessage('No sheets enabled', 'error');
                return;
            }
            
            this.showLoading(`Checking ${enabledSheets.length} sheet(s)...`);
            
            try {
                const allTargets = [];
                let hasSuccessfulSheet = false;
                let lastError = null;
                
                for (let i = 0; i < enabledSheets.length; i++) {
                    const sheet = enabledSheets[i];
                    
                    try {
                        const sheetTargets = await this.fetchSheetWithCache(sheet);
                        sheetTargets.forEach(target => {
                            allTargets.push({
                                ...target,
                                sheetName: sheet.name,
                                sheetId: sheet.id
                            });
                        });
                        hasSuccessfulSheet = true;
                        
                        if (i < enabledSheets.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    } catch (error) {
                        lastError = error;
                    }
                }
                
                if (!hasSuccessfulSheet && lastError) {
                    this.showMessage('Failed to fetch any sheets. Check sheet URLs and network.', 'error');
                    this.showError('Unable to fetch targets from any configured sheet.');
                    return;
                }
                
                this.processTargets(allTargets);
                
            } catch (error) {
                console.error('[Phantom Match] Error fetching sheets:', error);
            }
        }
        
        async fetchSheetWithCache(sheet) {
            const cacheKey = `pm_sheet_${btoa(sheet.url).slice(0, 32)}`;
            const now = Date.now();
            
            if (sheet.lastUpdated && (now - sheet.lastUpdated < this.config.sheetCacheTTL)) {
                const cached = this.sheetCache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }
            
            const data = await this.fetchSheetData(sheet);
            this.sheetCache.set(cacheKey, data);
            sheet.lastUpdated = now;
            
            return data;
        }
        
        async fetchSheetData(sheet) {
            return new Promise((resolve, reject) => {
                if (!sheet.url?.trim()) {
                    reject(new Error('No URL'));
                    return;
                }
                
                const url = sheet.url.replace(/\/edit.*$/, '/gviz/tq?tqx=out:json&t=' + Date.now());
                
                const makeRequest = () => {
                    if (typeof GM_xmlhttpRequest !== 'undefined') {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            timeout: 15000,
                            onload: (response) => {
                                if (response.status !== 200) {
                                    reject(new Error(`HTTP ${response.status}`));
                                    return;
                                }
                                
                                try {
                                    let jsonText = response.responseText;
                                    
                                    const jsonMatch = jsonText.match(/google\.visualization\.Query\.setResponse\((.+)\)/);
                                    if (jsonMatch && jsonMatch[1]) {
                                        jsonText = jsonMatch[1];
                                    }
                                    
                                    const data = JSON.parse(jsonText);
                                    if (data.table?.rows) {
                                        const targets = this.processSheetRows(data.table.rows, sheet);
                                        resolve(targets);
                                    } else {
                                        reject(new Error("Invalid sheet format"));
                                    }
                                } catch (e) {
                                    reject(new Error("Parse error"));
                                }
                            },
                            onerror: () => reject(new Error("Network error")),
                            ontimeout: () => reject(new Error("Timeout"))
                        });
                    } else {
                        fetch(url)
                        .then(response => response.text())
                        .then(text => {
                            try {
                                let jsonText = text;
                                const jsonMatch = jsonText.match(/google\.visualization\.Query\.setResponse\((.+)\)/);
                                if (jsonMatch && jsonMatch[1]) {
                                    jsonText = jsonMatch[1];
                                }
                                const data = JSON.parse(jsonText);
                                if (data.table?.rows) {
                                    const targets = this.processSheetRows(data.table.rows, sheet);
                                    resolve(targets);
                                } else {
                                    reject(new Error("Invalid sheet"));
                                }
                            } catch (e) {
                                reject(new Error("Parse error"));
                            }
                        })
                        .catch(reject);
                    }
                };
                
                const now = Date.now();
                const timeSinceLast = now - this.lastSheetFetch;
                if (timeSinceLast < 1000) {
                    setTimeout(makeRequest, 1000 - timeSinceLast);
                } else {
                    this.lastSheetFetch = now;
                    makeRequest();
                }
            });
        }
        
        processSheetRows(rows, sheet) {
            const targetStats = this.userBattleStats * this.config.targetPercentage;
            const minStats = Math.round(targetStats * (1 - this.config.tolerance));
            const maxStats = Math.round(targetStats * (1 + this.config.tolerance));
            
            const targets = [];
            const maxTargets = Math.min(sheet.targetsPerSheet || 8, 15);
            
            for (let i = 1; i < rows.length && targets.length < maxTargets; i++) {
                const row = rows[i];
                if (!row.c || row.c.length < 3) continue;
                
                try {
                    const name = row.c[0]?.v?.toString().trim() || '';
                    const id = parseInt(row.c[1]?.v) || null;
                    const stats = parseFloat(row.c[2]?.v) || 0;
                    
                    if (name && id && !isNaN(stats) && stats > 0) {
                        if (stats >= minStats && stats <= maxStats) {
                            targets.push({ 
                                name: name.substring(0, 20),
                                id: id, 
                                stats: Math.round(stats),
                                distance: Math.abs(stats - targetStats)
                            });
                        }
                    }
                } catch (e) {
                    // Skip bad rows
                }
            }
            
            if (this.config.sortByStats) {
                targets.sort((a, b) => a.distance - b.distance);
            }
            
            return targets.slice(0, maxTargets);
        }
        
        processTargets(allTargets) {
            if (this.config.sortByStats) {
                allTargets.sort((a, b) => a.distance - b.distance);
            }
            
            this.matchedTargets = allTargets.slice(0, this.config.maxTotalTargets);
            this.displayResults();
        }
        
        displayResults() {
            const content = document.getElementById('phantom-match-content');
            if (!content) return;
            
            const targetStats = this.userBattleStats * this.config.targetPercentage;
            const minStats = Math.round(targetStats * (1 - this.config.tolerance));
            const maxStats = Math.round(targetStats * (1 + this.config.tolerance));
            
            content.innerHTML = '';
            
            const statsInfo = document.createElement('div');
            statsInfo.className = 'phantom-match-stats-info';
            statsInfo.innerHTML = `
                <div class="phantom-match-stats-header">Your Battle Stats</div>
                <div class="phantom-match-stats-value">${this.userBattleStats.toLocaleString()}</div>
                <div class="phantom-match-stats-range">
                    <strong>Target Range:</strong> ${minStats.toLocaleString()} - ${maxStats.toLocaleString()}
                </div>
            `;
            content.appendChild(statsInfo);
            
            if (this.matchedTargets.length === 0) {
                const noTargets = document.createElement('div');
                noTargets.className = 'phantom-match-info';
                noTargets.style.padding = '20px';
                noTargets.textContent = 'No targets found in range';
                content.appendChild(noTargets);
            } else {
                const list = document.createElement('div');
                list.className = 'phantom-match-targets-list';
                
                this.matchedTargets.forEach((target) => {
                    const targetItem = this.createTargetItem(target, TARGET_ICON);
                    list.appendChild(targetItem);
                });
                
                content.appendChild(list);
            }
            
            // Add footer with buttons
            const container = this.windowElement.querySelector('.phantom-match-container');
            let footer = container.querySelector('.phantom-match-footer');
            
            if (!footer) {
                footer = document.createElement('div');
                footer.className = 'phantom-match-footer';
                container.appendChild(footer);
            }
            
            footer.innerHTML = '';
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'phantom-match-button-container';
            
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'pm-action-btn';
            refreshBtn.id = 'phantom-match-refresh';
            refreshBtn.textContent = 'Refresh Targets';
            
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'pm-action-btn secondary';
            settingsBtn.textContent = 'Settings';
            
            buttonContainer.appendChild(refreshBtn);
            buttonContainer.appendChild(settingsBtn);
            footer.appendChild(buttonContainer);
            
            refreshBtn.addEventListener('click', () => this.refreshTargets());
            settingsBtn.addEventListener('click', () => this.openSettingsWindow());
            
            this.updateRefreshButton();
        }
        
        showError(message) {
            const content = document.getElementById('phantom-match-content');
            if (!content) return;
            
            content.innerHTML = `
                <div class="phantom-match-error">
                    <div class="phantom-match-error-title">Error</div>
                    <div class="phantom-match-error-message">${message}</div>
                    <button class="pm-action-btn" id="phantom-match-retry" style="margin-top: 16px;">
                        Try Again
                    </button>
                </div>
            `;
            
            const retryBtn = document.getElementById('phantom-match-retry');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.findTargets());
            }
        }
        
        createTargetItem(target, icon) {
            const item = document.createElement('div');
            item.className = 'phantom-match-target-item';
            
            const link = document.createElement('a');
            link.className = 'phantom-match-target-link';
            link.href = this.config.openAttackPage ? 
                `https://www.torn.com/loader.php?sid=attack&user2ID=${target.id}` :
                `https://www.torn.com/profiles.php?XID=${target.id}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'phantom-match-target-info';
            
            const nameRow = document.createElement('div');
            nameRow.className = 'phantom-match-target-name-row';
            
            const iconImg = document.createElement('img');
            iconImg.src = icon;
            iconImg.className = 'target-icon';
            iconImg.alt = '🎯';
            iconImg.onerror = () => {
                iconImg.style.display = 'none';
            };
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'phantom-match-target-name';
            nameSpan.textContent = target.name;
            
            nameRow.appendChild(iconImg);
            nameRow.appendChild(nameSpan);
            
            if (this.config.showSheetBadges && target.sheetName) {
                const badge = document.createElement('span');
                badge.className = 'phantom-match-sheet-badge';
                badge.textContent = target.sheetName.substring(0, 12);
                nameRow.appendChild(badge);
            }
            
            infoDiv.appendChild(nameRow);
            link.appendChild(infoDiv);
            
            const statsDiv = document.createElement('div');
            statsDiv.className = 'phantom-match-target-stats';
            statsDiv.innerHTML = `
                <div class="target-stats-value">${target.stats.toLocaleString()}</div>
                <div class="target-id">ID: ${target.id}</div>
            `;
            
            item.appendChild(link);
            item.appendChild(statsDiv);
            
            const clickHandler = (e) => {
                e.preventDefault();
                window.open(link.href, '_blank');
            };
            link.addEventListener('click', clickHandler);
            
            return item;
        }
        
        showLoading(message) {
            const content = document.getElementById('phantom-match-content');
            if (!content) return;
            
            content.innerHTML = `
                <div class="phantom-match-loading">
                    <div class="phantom-match-loading-title">Phantom Match</div>
                    <div class="phantom-match-loading-message">${message}</div>
                    <div class="phantom-match-loading-spinner"></div>
                </div>
            `;
        }
        
        showMessage(message, type = 'info', duration = 3000) {
            if (window.phantomCore?.ui?.toastManager?.show) {
                window.phantomCore.ui.toastManager.show(message, type, duration);
                return;
            }
            
            const toast = document.createElement('div');
            toast.className = 'phantom-match-toast';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? 'rgba(255,50,50,0.9)' : type === 'success' ? 'rgba(50,255,50,0.9)' : 'rgba(0,0,0,0.9)'};
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                border: 1px solid ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#00ff00'};
                z-index: 10090;
                max-width: 300px;
                word-wrap: break-word;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: phantomToastSlideIn 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
            `;
            
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'phantomToastSlideOut 0.3s ease';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.parentNode.removeChild(toast);
                        }
                    }, 300);
                }
            }, duration);
            
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
                    }
                `;
                document.head.appendChild(style);
            }
            
            if (type === 'error') {
                console.error('[Phantom Match]', message);
            }
        }
        
        openSettingsWindow() {
            this.closeSettingsWindow();
            
            this.settingsWindow = document.createElement('div');
            this.settingsWindow.className = 'phantom-match-settings-window';
            this.settingsWindow.style.width = `${this.config.windowWidth}px`;
            this.settingsWindow.style.display = 'block';
            
            const sheetIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1Yy0xLjEgMC0yIC45LTIgMnYxNGMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6TTkgMTlINVY1aDR2MTR6bTYgMGgtNFY1aDR2MTR6bTYgMGgtNFY1aDR2MTR6IiBmaWxsPSIjZmZmIi8+PC9zdmc+';
            const displayIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgNC41QzcgNC41IDIuNzMgNy42MSAxIDEyYzEuNzMgNC4zOSA2IDcuNSAxMSA3LjVzOS4yNy0zLjExIDExLTcuNWMtMS43My00LjM5LTYtNy41LTExLTcuNXpNMTIgMTdjLTIuNzYgMC01LTIuMjQtNS01czIuMjQtNSA1LTUgNSAyLjI0IDUgNS0yLjI0IDUtNSA1em0wLThjLTEuNjYgMC0zIDEuMzQtMyAzczEuMzQgMyAzIDMgMy0xLjM0IDMtMy0xLjM0LTMtMy0zeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';
            const closeIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyIDE5IDYuNDF6IiBmaWxsPSIjZmZmIi8+PC9zdmc+';
            const notificationIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDNi40NzcgMjIgMiAxNy41MjMgMiAxMlM2LjQ3NyAyIDEyIDJzMTAgNC40NzcgMTAgMTAtNC40NzcgMTAtMTAgMTB6bTAtMmE4IDggMCAxMDAtMTYgOCA4IDAgMDAwIDE2em0wLTMuNWMtLjgyOCAwLTEuNS0uNjcyLTEuNS0xLjVzLjY3Mi0xLjUgMS41LTEuNSAxLjUuNjcyIDEuNSAxLjUtLjY3MiAxLjUtMS41IDEuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
            
            const sheetsHTML = this.config.sheets.map((sheet, index) => `
                <div class="phantom-match-sheet-config">
                    <div class="phantom-match-sheet-header">
                        <label class="pm-checkbox-label">
                            <input type="checkbox" id="pm-sheet-${sheet.id}-enabled" 
                                ${sheet.enabled ? 'checked' : ''}>
                            <strong>${sheet.name}</strong>
                        </label>
                    </div>
                    <div class="phantom-match-setting-row compact">
                        <input type="text" id="pm-sheet-${sheet.id}-name" 
                            value="${sheet.name}" class="phantom-match-input" placeholder="Sheet name">
                    </div>
                    <div class="phantom-match-setting-row compact">
                        <input type="text" id="pm-sheet-${sheet.id}-url" 
                            value="${sheet.url}" class="phantom-match-input" placeholder="Google Sheet URL">
                    </div>
                    <div class="phantom-match-setting-row compact" style="display:flex;align-items:center;gap:8px;">
                        <label style="margin:0;flex:1;">Targets:</label>
                        <input type="number" id="pm-sheet-${sheet.id}-targets" 
                            value="${sheet.targetsPerSheet}" min="1" max="15" step="1" 
                            class="phantom-match-input" style="width:70px;">
                    </div>
                </div>
            `).join('');
            
            this.settingsWindow.innerHTML = `
                <div class="phantom-match-header">
                    <h3>
                        <img src="${TARGET_ICON}" class="phantom-match-header-icon" alt="Settings">
                        Settings v${PLUGIN_VERSION}
                    </h3>
                    <button class="pm-btn" id="pm-settings-close" title="Close">
                        <img src="${closeIcon}" class="pm-btn-icon" alt="✕">
                    </button>
                </div>
                <div class="phantom-match-content">
                    <div class="phantom-match-settings-content">
                        <!-- Targeting Settings -->
                        <div class="phantom-match-setting-group">
                            <h4>
                                <img src="${TARGET_ICON}" class="group-icon" alt="🎯">
                                Targeting
                            </h4>
                            
                            <div class="phantom-match-setting-row">
                                <label>Target: <span id="pm-percent-value">${(this.config.targetPercentage * 100).toFixed(0)}%</span></label>
                                <div class="phantom-match-slider-container">
                                    <input type="range" id="pm-percentage" min="10" max="90" 
                                        value="${this.config.targetPercentage * 100}" class="phantom-match-slider">
                                    <span class="phantom-match-slider-value">${(this.config.targetPercentage * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            
                            <div class="phantom-match-setting-row">
                                <label>Tolerance: <span id="pm-tolerance-value">${(this.config.tolerance * 100).toFixed(0)}%</span></label>
                                <div class="phantom-match-slider-container">
                                    <input type="range" id="pm-tolerance" min="1" max="30" 
                                        value="${this.config.tolerance * 100}" class="phantom-match-slider">
                                    <span class="phantom-match-slider-value">${(this.config.tolerance * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            
                            <div class="phantom-match-setting-row">
                                <label for="pm-api-key">API Key:</label>
                                <input type="password" id="pm-api-key" 
                                    value="${this.config.customApiKey || ''}" class="phantom-match-input" 
                                    placeholder="Use Phantom Core's key">
                            </div>
                        </div>
                        
                        <!-- Attack Page Features -->
                        <div class="phantom-match-setting-group">
                            <h4>
                                <img src="${notificationIcon}" class="group-icon" alt="🔔">
                                Attack Page Features
                            </h4>
                            
                            <div class="phantom-match-setting-row compact">
                                <label class="pm-checkbox-label">
                                    <input type="checkbox" id="pm-show-last-action" 
                                        ${this.config.showLastActionToast ? 'checked' : ''}>
                                    Show target's last seen time on attack page
                                </label>
                            </div>
                            
                            <div class="phantom-match-setting-row compact">
                                <label class="pm-checkbox-label">
                                    <input type="checkbox" id="pm-open-attack" 
                                        ${this.config.openAttackPage ? 'checked' : ''}>
                                    Open attack page directly
                                </label>
                            </div>
                        </div>
                        
                        <!-- Sheet Configuration -->
                        <div class="phantom-match-setting-group">
                            <h4>
                                <img src="${sheetIcon}" class="group-icon" alt="📊">
                                Google Sheets (${this.getEnabledSheets().length} enabled)
                            </h4>
                            ${sheetsHTML}
                        </div>
                        
                        <!-- Display Settings -->
                        <div class="phantom-match-setting-group">
                            <h4>
                                <img src="${displayIcon}" class="group-icon" alt="👁️">
                                Display
                            </h4>
                            
                            <div class="phantom-match-setting-row compact">
                                <label class="pm-checkbox-label">
                                    <input type="checkbox" id="pm-show-badges" 
                                        ${this.config.showSheetBadges ? 'checked' : ''}>
                                    Show sheet badges
                                </label>
                            </div>
                            
                            <div class="phantom-match-setting-row compact">
                                <label class="pm-checkbox-label">
                                    <input type="checkbox" id="pm-sort-stats" 
                                        ${this.config.sortByStats ? 'checked' : ''}>
                                    Sort by closest stats
                                </label>
                            </div>
                            
                            <div class="phantom-match-setting-row" style="display:flex;align-items:center;gap:8px;">
                                <label style="margin:0;flex:1;">Max targets:</label>
                                <input type="number" id="pm-max-targets" 
                                    value="${this.config.maxTotalTargets}" min="5" max="50" step="5" 
                                    class="phantom-match-input" style="width:70px;">
                            </div>
                        </div>
                        
                        <!-- Action buttons at bottom -->
                        <div class="phantom-match-settings-actions">
                            <button class="pm-settings-btn" id="pm-settings-save">Save</button>
                            <button class="pm-settings-btn secondary" id="pm-settings-reset">Reset</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.settingsWindow);
            this.addEventListeners(this.settingsWindow, 'settings');
        }
        
        closeSettingsWindow() {
            if (this.settingsWindow) {
                this.removeEventListeners(this.settingsWindow);
                if (this.settingsWindow.parentNode) {
                    this.settingsWindow.parentNode.removeChild(this.settingsWindow);
                }
                this.settingsWindow = null;
            }
        }
        
        removeEventListeners(element) {
            const listeners = this.eventListeners.get(element);
            if (listeners) {
                listeners.forEach(({ element: el, type, handler }) => {
                    if (el && el.removeEventListener) {
                        el.removeEventListener(type, handler);
                    }
                });
                this.eventListeners.delete(element);
            }
        }
        
        async saveSettings() {
            try {
                const percentSlider = document.querySelector('#pm-percentage');
                const toleranceSlider = document.querySelector('#pm-tolerance');
                const apiKeyInput = document.querySelector('#pm-api-key');
                
                if (percentSlider) this.config.targetPercentage = parseInt(percentSlider.value) / 100;
                if (toleranceSlider) this.config.tolerance = parseInt(toleranceSlider.value) / 100;
                if (apiKeyInput) this.config.customApiKey = apiKeyInput.value.trim();
                
                const showLastAction = document.querySelector('#pm-show-last-action');
                const openAttack = document.querySelector('#pm-open-attack');
                
                if (showLastAction) this.config.showLastActionToast = showLastAction.checked;
                if (openAttack) this.config.openAttackPage = openAttack.checked;
                
                this.config.sheets.forEach((sheet) => {
                    const nameInput = document.querySelector(`#pm-sheet-${sheet.id}-name`);
                    const urlInput = document.querySelector(`#pm-sheet-${sheet.id}-url`);
                    const enabledInput = document.querySelector(`#pm-sheet-${sheet.id}-enabled`);
                    const targetsInput = document.querySelector(`#pm-sheet-${sheet.id}-targets`);
                    
                    if (nameInput) sheet.name = nameInput.value.trim() || sheet.name;
                    if (urlInput) sheet.url = urlInput.value.trim();
                    if (enabledInput) sheet.enabled = enabledInput.checked;
                    if (targetsInput) sheet.targetsPerSheet = parseInt(targetsInput.value) || 8;
                });
                
                const showBadges = document.querySelector('#pm-show-badges');
                const sortStats = document.querySelector('#pm-sort-stats');
                const maxTargets = document.querySelector('#pm-max-targets');
                
                if (showBadges) this.config.showSheetBadges = showBadges.checked;
                if (sortStats) this.config.sortByStats = sortStats.checked;
                if (maxTargets) this.config.maxTotalTargets = parseInt(maxTargets.value) || 25;
                
                await this.saveConfiguration();
                this.showMessage('✅ Settings saved', 'success');
                this.closeSettingsWindow();
                
                if (this.windowElement) {
                    this.findTargets();
                }
                
            } catch (error) {
                console.error('[Phantom Match] Save error:', error);
                this.showMessage('❌ Save failed', 'error');
            }
        }
        
        getEnabledSheets() {
            return this.config.sheets.filter(sheet => sheet.enabled && sheet.url?.trim());
        }
        
        setupCleanup() {
            const unloadHandler = () => this.cleanup();
            window.addEventListener('beforeunload', unloadHandler);
            
            this.cleanupCallbacks.push(() => {
                window.removeEventListener('beforeunload', unloadHandler);
            });
        }
        
        cleanup() {
            this.closeMainWindow();
            this.closeSettingsWindow();
            
            if (this.attackPageObserver) {
                this.attackPageObserver.disconnect();
                this.attackPageObserver = null;
            }
            
            if (this.cooldownInterval) {
                clearInterval(this.cooldownInterval);
                this.cooldownInterval = null;
            }
            
            this.eventListeners.forEach((listeners, element) => {
                this.removeEventListeners(element);
            });
            this.eventListeners.clear();
            
            this.lastActionCache.clear();
            this.sheetCache.clear();
            
            this.cleanupCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    // Silent fail
                }
            });
            this.cleanupCallbacks = [];
            
            const styles = document.getElementById('phantom-match-styles');
            if (styles?.parentNode) {
                styles.parentNode.removeChild(styles);
            }
            
            const toastStyles = document.getElementById('phantom-toast-animations');
            if (toastStyles?.parentNode) {
                toastStyles.parentNode.removeChild(toastStyles);
            }
            
            this.isInitialized = false;
            this.hasRegistered = false;
            this.currentTargetId = null;
            this.refreshCooldown = false;
        }
    }

    const initPhantomMatch = () => {
        if (window.phantomMatchInstance) return;
        
        window.phantomMatchInstance = new PhantomMatch();
        
        const checkCore = () => {
            if (window.phantomCore?.isInitialized) {
                window.phantomMatchInstance.initialize();
                return true;
            }
            return false;
        };
        
        if (!checkCore()) {
            let attempts = 0;
            const maxAttempts = 20;
            
            const interval = setInterval(() => {
                if (checkCore() || attempts >= maxAttempts) {
                    clearInterval(interval);
                    
                    if (attempts >= maxAttempts) {
                        window.phantomMatchInstance.initialize();
                    }
                }
                attempts++;
            }, 500);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhantomMatch);
    } else {
        initPhantomMatch();
    }

})();
// ==UserScript==
// @name         Ultima Client v2.1 - Polished Edition
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Ultimate bloxd.io client with polished UI - HUD, Crosshair, Performance, UI Enhancements
// @author       Ultima Team
// @match        https://bloxd.io/*
// @match        https://staging.bloxd.io/*
// @match        https://bloxd.io/?utm_source=pwa
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @icon         https://i.imgur.com/gaj92pC.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559174/Ultima%20Client%20v21%20-%20Polished%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/559174/Ultima%20Client%20v21%20-%20Polished%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.top !== window.self || window.ultimaInitialized) return;
    window.ultimaInitialized = true;

    // ============================================
    //  CORE CONFIGURATION & SETTINGS
    // ============================================
    const CONFIG = {
        VERSION: '2.1.0',
        MODE: 'ULTIMATE',
        DEBUG: false,
        
        // Default Settings with fallbacks
        SETTINGS: {
            // 🎯 HUD Elements
            fpsDisplay: GM_getValue('ultima_fpsDisplay', true),
            cpsDisplay: GM_getValue('ultima_cpsDisplay', true),
            pingDisplay: GM_getValue('ultima_pingDisplay', true),
            timerDisplay: GM_getValue('ultima_timerDisplay', true),
            keystrokesDisplay: GM_getValue('ultima_keystrokesDisplay', true),
            
            // 🎨 Visual Settings
            crosshairStyle: GM_getValue('ultima_crosshairStyle', 'plus'),
            crosshairSize: GM_getValue('ultima_crosshairSize', 20),
            crosshairColor: GM_getValue('ultima_crosshairColor', '#00ff00'),
            crosshairUrl: GM_getValue('ultima_crosshairUrl', ''),
            
            // 🌙 Visual Modes
            nightMode: GM_getValue('ultima_nightMode', false),
            cinematicMode: GM_getValue('ultima_cinematicMode', false),
            fullbright: GM_getValue('ultima_fullbright', false),
            
            // 🎒 Hotbar Settings
            hotbarStyle: GM_getValue('ultima_hotbarStyle', true),
            hotbarColor: GM_getValue('ultima_hotbarColor', '#1a1a2e'),
            selectedColor: GM_getValue('ultima_selectedColor', '#00ffea'),
            
            // ⚡ Performance
            perfMode: GM_getValue('ultima_perfMode', false),
            removeAds: GM_getValue('ultima_removeAds', true),
            resolution: GM_getValue('ultima_resolution', '1920x1080'),
            
            // 🎮 Controls
            toggleSprint: GM_getValue('ultima_toggleSprint', true),
            sprintKey: GM_getValue('ultima_sprintKey', 'KeyF'),
            menuKey: GM_getValue('ultima_menuKey', 'ShiftRight'),
            
            // 🎵 Audio
            musicEnabled: GM_getValue('ultima_musicEnabled', true),
            musicVolume: GM_getValue('ultima_musicVolume', 40),
            
            // 🧰 Utilities
            armorView: GM_getValue('ultima_armorView', true),
            handItemView: GM_getValue('ultima_handItemView', false),
            waypoints: GM_getValue('ultima_waypoints', true),
            shield: GM_getValue('ultima_shield', false),
            
            // 🎭 Cosmetic
            cape: GM_getValue('ultima_cape', 'none'),
            customBackground: GM_getValue('ultima_customBackground', true),
            funFacts: GM_getValue('ultima_funFacts', true)
        }
    };

    // ============================================
    //  CORE CLIENT CLASS
    // ============================================
    class UltimaClient {
        constructor() {
            this.version = CONFIG.VERSION;
            this.sessionStart = Date.now();
            this.isMenuOpen = false;
            this.sprintActive = false;
            this.isKeepingRunning = false;
            this.frameCount = 0;
            this.lastTime = performance.now();
            this.fps = 0;
            this.clicks = [];
            this.cps = 0;
            this.ping = '?';
            this.timer = 0;
            
            // DOM Elements storage
            this.elements = {};
            this.hudElements = {};
            this.waypoints = JSON.parse(GM_getValue('ultima_waypointsList', '[]'));
            this.armorSlots = ['helmet', 'chestplate', 'leggings', 'boots'];
            this.armorElements = {};
            
            // Initialize
            this.init();
        }
        
        async init() {
            console.log(`[Ultima Client v${this.version}] Initializing...`);
            
            // Load global styles
            this.loadGlobalStyles();
            
            // Remove ads first
            if (CONFIG.SETTINGS.removeAds) {
                this.removeAds();
            }
            
            // Apply customizations
            this.applyCustomUI();
            
            // Wait for game to load
            await this.waitForGame();
            
            // Create loading screen
            this.createLoadingScreen();
            
            // Initialize all modules
            this.initializeAllModules();
            
            // Create menu system
            this.createMenu();
            
            // Create HUD
            this.createHUD();
            
            // Setup hotkeys
            this.setupHotkeys();
            
            // Start music if enabled
            if (CONFIG.SETTINGS.musicEnabled) {
                this.startBackgroundMusic();
            }
            
            this.showNotification(`Ultima Client v${this.version} loaded successfully! 🚀`, 4000);
            
            console.log('[Ultima Client] All systems initialized');
        }
        
        // ============================================
        //  STYLES & THEMES - POLISHED VERSION
        // ============================================
        loadGlobalStyles() {
            const styles = `
                /* Ultima Client Global Styles - Polished */
                .ultima-element {
                    position: fixed;
                    z-index: 99990;
                    user-select: none;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .ultima-draggable {
                    cursor: move !important;
                }
                
                .ultima-draggable:hover {
                    opacity: 0.95;
                }
                
                /* Crosshair Styles */
                .ultima-crosshair {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 9999;
                    pointer-events: none;
                }
                
                .crosshair-plus {
                    width: var(--crosshair-size);
                    height: var(--crosshair-size);
                    position: relative;
                }
                
                .crosshair-plus::before,
                .crosshair-plus::after {
                    content: '';
                    position: absolute;
                    background: var(--crosshair-color);
                    box-shadow: 0 0 8px var(--crosshair-color);
                }
                
                .crosshair-plus::before {
                    width: var(--crosshair-size);
                    height: 2px;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                }
                
                .crosshair-plus::after {
                    width: 2px;
                    height: var(--crosshair-size);
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .crosshair-dot {
                    width: var(--crosshair-size);
                    height: var(--crosshair-size);
                    background: var(--crosshair-color);
                    border-radius: 50%;
                    box-shadow: 0 0 12px var(--crosshair-color);
                }
                
                .crosshair-circle {
                    width: var(--crosshair-size);
                    height: var(--crosshair-size);
                    border: 2px solid var(--crosshair-color);
                    border-radius: 50%;
                    box-shadow: 0 0 12px var(--crosshair-color);
                }
                
                .crosshair-cross {
                    width: var(--crosshair-size);
                    height: var(--crosshair-size);
                    position: relative;
                    transform: rotate(45deg);
                }
                
                .crosshair-cross::before,
                .crosshair-cross::after {
                    content: '';
                    position: absolute;
                    background: var(--crosshair-color);
                    box-shadow: 0 0 6px var(--crosshair-color);
                }
                
                .crosshair-cross::before {
                    width: var(--crosshair-size);
                    height: 2px;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                }
                
                .crosshair-cross::after {
                    width: 2px;
                    height: var(--crosshair-size);
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .crosshair-custom {
                    width: var(--crosshair-size);
                    height: var(--crosshair-size);
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));
                }
                
                /* Menu System - Polished */
                .ultima-menu {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 850px;
                    max-width: 90vw;
                    height: 600px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, rgba(15, 15, 25, 0.97) 0%, rgba(10, 10, 20, 0.97) 100%);
                    backdrop-filter: blur(20px) saturate(180%);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 10000;
                    display: none;
                    overflow: hidden;
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                
                .menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(5px);
                    z-index: 9999;
                    display: none;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Menu Button - Polished */
                #ultima-menu-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    cursor: pointer;
                    z-index: 99998;
                    box-shadow: 
                        0 10px 30px rgba(102, 126, 234, 0.4),
                        0 1px 0 rgba(255, 255, 255, 0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                }
                
                #ultima-menu-btn:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 
                        0 15px 40px rgba(102, 126, 234, 0.6),
                        0 1px 0 rgba(255, 255, 255, 0.1);
                }
                
                /* Notification - Polished */
                .ultima-notification {
                    position: fixed;
                    top: 25px;
                    right: 25px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 14px 28px;
                    border-radius: 14px;
                    z-index: 999999;
                    font-weight: 600;
                    font-size: 14px;
                    box-shadow: 
                        0 10px 30px rgba(0, 0, 0, 0.3),
                        0 1px 0 rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    max-width: 350px;
                    word-break: break-word;
                }
                
                @keyframes slideIn {
                    from { 
                        transform: translateX(100%) translateY(-20px); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(0) translateY(0); 
                        opacity: 1; 
                    }
                }
                
                /* HUD Elements - Polished */
                .ultima-hud {
                    background: linear-gradient(135deg, rgba(20, 20, 30, 0.85) 0%, rgba(15, 15, 25, 0.85) 100%);
                    backdrop-filter: blur(15px) saturate(180%);
                    border-radius: 14px;
                    padding: 12px 20px;
                    color: white;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 8px 25px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                
                /* Keystrokes - Polished */
                .ultima-keystrokes {
                    position: fixed;
                    bottom: 130px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9990;
                    pointer-events: none;
                    width: 220px;
                    height: 220px;
                }
                
                .keystroke-key {
                    position: absolute;
                    background: linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(15, 15, 25, 0.9) 100%);
                    backdrop-filter: blur(10px);
                    border: 1.5px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 15px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 
                        0 4px 15px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }
                
                .keystroke-key.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-color: rgba(255, 255, 255, 0.3);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 
                        0 8px 25px rgba(102, 126, 234, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }
                
                /* Visual Modes */
                .ultima-night-mode {
                    filter: brightness(0.85) contrast(1.15) saturate(0.9) !important;
                }
                
                .ultima-fullbright {
                    filter: brightness(1.8) contrast(1.1) saturate(1.2) !important;
                }
                
                .ultima-cinematic-bars {
                    position: fixed;
                    left: 0;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.92);
                    z-index: 9997;
                    pointer-events: none;
                    transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .cinematic-top {
                    top: 0;
                    height: 70px;
                }
                
                .cinematic-bottom {
                    bottom: 0;
                    height: 70px;
                }
                
                /* Loading Screen - Polished */
                .ultima-loading {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.5s ease;
                }
                
                /* Armor View - FIXED */
                #ultima-armor-view {
                    background: linear-gradient(135deg, rgba(20, 20, 30, 0.85) 0%, rgba(15, 15, 25, 0.85) 100%);
                    backdrop-filter: blur(15px) saturate(180%);
                    border-radius: 14px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 8px 25px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-width: 160px;
                }
                
                .ultima-armor-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                
                .ultima-armor-slot {
                    width: 70px;
                    height: 70px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .ultima-armor-slot.equipped {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                    border-color: #667eea;
                    box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
                }
                
                .armor-slot-label {
                    position: absolute;
                    bottom: 5px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .armor-item-icon {
                    font-size: 24px;
                    opacity: 0.8;
                    transition: opacity 0.3s ease;
                }
                
                .ultima-armor-slot.equipped .armor-item-icon {
                    opacity: 1;
                }
                
                /* Hotbar Enhancements */
                .HotBarSlot, .HotBarItem {
                    border-radius: 14px !important;
                    border: 2px solid var(--hotbar-color) !important;
                    background: linear-gradient(135deg, rgba(30, 30, 40, 0.8) 0%, rgba(20, 20, 30, 0.8) 100%) !important;
                    backdrop-filter: blur(10px) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .SelectedItem {
                    border-radius: 16px !important;
                    border: 3px solid var(--selected-color) !important;
                    transform: scale(1.08) !important;
                    box-shadow: 0 0 25px var(--selected-color) !important;
                }
                
                /* Utility Classes */
                .ultima-hidden {
                    display: none !important;
                }
                
                /* Custom Scrollbar - Polished */
                .ultima-scrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                
                .ultima-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                    margin: 4px;
                }
                
                .ultima-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #667eea, #764ba2);
                    border-radius: 5px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                }
                
                .ultima-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #764ba2, #667eea);
                }
                
                /* Settings Section - Polished */
                .setting {
                    padding: 15px;
                    margin: 10px 0;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }
                
                .setting:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                
                .setting label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                }
                
                .setting input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    accent-color: #667eea;
                    cursor: pointer;
                }
                
                .setting select, .setting input[type="text"] {
                    width: 100%;
                    padding: 10px 14px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: white;
                    font-family: inherit;
                    font-size: 13px;
                    transition: all 0.3s ease;
                }
                
                .setting select:focus, .setting input[type="text"]:focus {
                    outline: none;
                    border-color: #667eea;
                    background: rgba(255, 255, 255, 0.12);
                }
                
                /* Slider Styling */
                input[type="range"] {
                    width: 100%;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
                
                /* Color Picker */
                input[type="color"] {
                    width: 100%;
                    height: 40px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    cursor: pointer;
                    background: transparent;
                    padding: 0;
                }
                
                input[type="color"]::-webkit-color-swatch-wrapper {
                    padding: 0;
                }
                
                input[type="color"]::-webkit-color-swatch {
                    border: none;
                    border-radius: 8px;
                }
                
                /* Buttons */
                button {
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }
                
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
                }
                
                /* Menu Tabs */
                .menu-tab {
                    padding: 16px 20px;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 14px;
                    font-weight: 500;
                    text-align: left;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    margin: 2px 0;
                }
                
                .menu-tab:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    transform: translateX(5px);
                }
                
                .menu-tab.active {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                    color: white;
                    border-left: 3px solid #667eea;
                }
                
                /* Tab Content */
                .tab-content {
                    display: none;
                    animation: fadeInUp 0.4s ease;
                }
                
                .tab-content.active {
                    display: block;
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(10px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                
                /* Section Titles */
                h3, h4 {
                    color: white;
                    margin: 0 0 20px 0;
                    font-weight: 600;
                }
                
                h3 {
                    font-size: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                h4 {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.9);
                    margin-top: 25px;
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = styles;
            document.head.appendChild(style);
            
            // Set CSS variables
            document.documentElement.style.setProperty('--crosshair-size', CONFIG.SETTINGS.crosshairSize + 'px');
            document.documentElement.style.setProperty('--crosshair-color', CONFIG.SETTINGS.crosshairColor);
            document.documentElement.style.setProperty('--hotbar-color', CONFIG.SETTINGS.hotbarColor);
            document.documentElement.style.setProperty('--selected-color', CONFIG.SETTINGS.selectedColor);
        }
        
        // ============================================
        //  UI CUSTOMIZATIONS
        // ============================================
        applyCustomUI() {
            // Custom title
            const updateTitle = () => {
                const titleEl = document.querySelector('.Title.FullyFancyText');
                if (titleEl) {
                    titleEl.textContent = 'ULTIMA CLIENT';
                    titleEl.style.color = '#667eea';
                    titleEl.style.textShadow = '0 0 10px #667eea, 0 0 15px #667eea';
                    titleEl.style.fontWeight = '800';
                    titleEl.style.letterSpacing = '1px';
                }
            };
            
            // Custom logo
            const modifyLogo = () => {
                const logoDiv = document.querySelector('div.LogoLoaderOuter');
                if (logoDiv) {
                    logoDiv.innerHTML = '';
                    logoDiv.style.backgroundImage = `url('https://i.imgur.com/Delp1oH.png')`;
                    logoDiv.style.backgroundSize = 'contain';
                    logoDiv.style.backgroundRepeat = 'no-repeat';
                    logoDiv.style.backgroundPosition = 'center';
                    logoDiv.style.filter = 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.5))';
                }
            };
            
            // Apply after delay
            setTimeout(updateTitle, 500);
            setInterval(updateTitle, 2000);
            
            setTimeout(modifyLogo, 500);
            setInterval(modifyLogo, 2000);
            
            // Custom background
            if (CONFIG.SETTINGS.customBackground) {
                const applyBackground = () => {
                    const homeBg = document.querySelector('.HomePageBackground');
                    if (homeBg) {
                        homeBg.style.backgroundImage = `url('https://i.imgur.com/Ld3cDxg.jpeg')`;
                        homeBg.style.backgroundSize = 'cover';
                        homeBg.style.backgroundPosition = 'center';
                        homeBg.style.filter = 'brightness(0.8) contrast(1.2)';
                    }
                };
                setInterval(applyBackground, 1000);
            }
        }
        
        removeAds() {
            const adClasses = [
                'GameAdsBanner', 'HomeBannerInner', 'ShopBannerDiv',
                'SettingsAdOuter', 'InventoryAdInner', 'RespawnLeaderboardBannerDivInner',
                'RespawnSideSquareBannerDiv', 'LoadingOverlayLeft',
                'LoadingOverlayRightAdBannerContainer', 'LoadingOverlayDividerContainer',
                'ad', 'ads', 'advertisement'
            ];
            
            const remove = () => {
                adClasses.forEach(className => {
                    document.querySelectorAll('.' + className).forEach(ad => {
                        ad.style.display = 'none';
                        ad.style.visibility = 'hidden';
                        ad.style.opacity = '0';
                        ad.style.pointerEvents = 'none';
                        ad.style.position = 'absolute';
                        ad.style.zIndex = '-9999';
                    });
                });
            };
            
            setInterval(remove, 1000);
        }
        
        // ============================================
        //  LOADING SCREEN
        // ============================================
        createLoadingScreen() {
            const loading = document.createElement('div');
            loading.className = 'ultima-loading';
            loading.id = 'ultima-loading';
            
            loading.innerHTML = `
                <div style="text-align: center; color: white; max-width: 500px; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px; color: #667eea; text-shadow: 0 0 15px #667eea; font-weight: 800;">ULTIMA</div>
                    <p style="font-size: 18px; margin-bottom: 10px; color: rgba(255,255,255,0.8); letter-spacing: 3px;">CLIENT v${this.version}</p>
                    <div style="margin: 30px 0;">
                        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
                            <div id="loading-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 3s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                        </div>
                        <p id="loading-text" style="font-size: 14px; color: rgba(255,255,255,0.6); margin: 5px 0;">Initializing systems...</p>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 10px; margin-top: 30px;">
                        <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite;"></div>
                        <div style="width: 12px; height: 12px; background: #764ba2; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite 0.2s;"></div>
                        <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite 0.4s;"></div>
                    </div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.1); }
                    }
                </style>
            `;
            
            document.body.appendChild(loading);
            
            // Animate loading bar
            setTimeout(() => {
                const bar = document.getElementById('loading-bar');
                if (bar) bar.style.width = '100%';
            }, 100);
            
            // Update loading text
            const texts = [
                "Optimizing performance...",
                "Loading HUD systems...",
                "Initializing crosshair...",
                "Setting up menu system...",
                "Configuring hotkeys...",
                "Preparing visual effects...",
                "Finalizing setup..."
            ];
            
            let textIndex = 0;
            const textInterval = setInterval(() => {
                if (textIndex < texts.length) {
                    const textEl = document.getElementById('loading-text');
                    if (textEl) textEl.textContent = texts[textIndex];
                    textIndex++;
                } else {
                    clearInterval(textInterval);
                }
            }, 400);
            
            // Remove loading screen
            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => {
                    if (loading.parentNode) loading.parentNode.removeChild(loading);
                }, 500);
            }, 3500);
            
            // Play start sound
            const startSound = new Audio("https://files.catbox.moe/6mltop.wav");
            startSound.volume = 0.4;
            startSound.play().catch(e => console.log("Start sound blocked:", e));
        }
        
        // ============================================
        //  HUD SYSTEM - WITH FIXED ARMOR VIEW
        // ============================================
        createHUD() {
            // Create HUD container
            const hudContainer = document.createElement('div');
            hudContainer.id = 'ultima-hud-container';
            hudContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9990;
            `;
            document.body.appendChild(hudContainer);
            
            // FPS Counter
            if (CONFIG.SETTINGS.fpsDisplay) {
                this.createHUDElement('fps', 'FPS: 0', 25, 25);
            }
            
            // CPS Counter
            if (CONFIG.SETTINGS.cpsDisplay) {
                this.createHUDElement('cps', 'CPS: 0', 25, 60);
            }
            
            // Ping Counter
            if (CONFIG.SETTINGS.pingDisplay) {
                this.createHUDElement('ping', 'PING: ?ms', 25, 95);
            }
            
            // Timer
            if (CONFIG.SETTINGS.timerDisplay) {
                this.createHUDElement('timer', 'TIME: 00:00', 25, 130);
            }
            
            // Keystrokes
            if (CONFIG.SETTINGS.keystrokesDisplay) {
                this.createKeystrokes();
            }
            
            // Armor View - FIXED
            if (CONFIG.SETTINGS.armorView) {
                this.createArmorView();
            }
            
            // Crosshair
            this.createCrosshair();
            
            // Start HUD updates
            this.startHUDUpdates();
        }
        
        createHUDElement(id, text, x, y) {
            const el = document.createElement('div');
            el.id = `ultima-${id}`;
            el.className = 'ultima-element ultima-hud ultima-draggable';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.textContent = text;
            el.style.pointerEvents = 'all';
            
            document.getElementById('ultima-hud-container').appendChild(el);
            this.hudElements[id] = el;
            this.makeDraggable(el);
        }
        
        createKeystrokes() {
            const container = document.createElement('div');
            container.className = 'ultima-keystrokes ultima-element ultima-draggable';
            container.id = 'ultima-keystrokes';
            container.style.cssText = `
                pointer-events: all;
            `;
            
            const keys = [
                { key: 'W', code: 'KeyW', top: '25px', left: '50%', transform: 'translateX(-50%)' },
                { key: 'A', code: 'KeyA', top: '90px', left: '35px' },
                { key: 'S', code: 'KeyS', top: '90px', left: '50%', transform: 'translateX(-50%)' },
                { key: 'D', code: 'KeyD', top: '90px', left: 'calc(100% - 80px)' },
                { key: '␣', code: 'Space', top: '155px', left: '50%', transform: 'translateX(-50%)', width: '120px' },
                { key: 'LMB', code: 'Mouse0', top: '155px', left: '25px', width: '70px' },
                { key: 'RMB', code: 'Mouse2', top: '155px', left: 'calc(100% - 95px)', width: '70px' }
            ];
            
            keys.forEach(keyConfig => {
                const keyEl = document.createElement('div');
                keyEl.className = 'keystroke-key';
                keyEl.dataset.code = keyConfig.code;
                keyEl.textContent = keyConfig.key;
                
                keyEl.style.cssText = `
                    position: absolute;
                    top: ${keyConfig.top};
                    left: ${keyConfig.left};
                    ${keyConfig.transform ? `transform: ${keyConfig.transform};` : ''}
                    width: ${keyConfig.width || '60px'};
                    height: 55px;
                    font-size: ${keyConfig.key === '␣' ? '20px' : '16px'};
                `;
                
                container.appendChild(keyEl);
            });
            
            document.getElementById('ultima-hud-container').appendChild(container);
            this.makeDraggable(container);
            
            // Setup key listeners
            this.setupKeystrokeListeners();
        }
        
        setupKeystrokeListeners() {
            const keys = {
                'KeyW': 'W', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D',
                'Space': '␣', 'Mouse0': 'LMB', 'Mouse2': 'RMB'
            };
            
            const handleKeyEvent = (code, pressed) => {
                if (!CONFIG.SETTINGS.keystrokesDisplay) return;
                
                const keyEl = document.querySelector(`.keystroke-key[data-code="${code}"]`);
                if (keyEl) {
                    keyEl.classList.toggle('active', pressed);
                }
            };
            
            // Keyboard events
            document.addEventListener('keydown', (e) => {
                if (keys[e.code]) handleKeyEvent(e.code, true);
            });
            
            document.addEventListener('keyup', (e) => {
                if (keys[e.code]) handleKeyEvent(e.code, false);
            });
            
            // Mouse events
            document.addEventListener('mousedown', (e) => {
                if (e.button === 0) handleKeyEvent('Mouse0', true);
                if (e.button === 2) handleKeyEvent('Mouse2', true);
            });
            
            document.addEventListener('mouseup', (e) => {
                if (e.button === 0) handleKeyEvent('Mouse0', false);
                if (e.button === 2) handleKeyEvent('Mouse2', false);
            });
        }
        
        createCrosshair() {
            const existing = document.getElementById('ultima-crosshair');
            if (existing) existing.remove();
            
            const crosshair = document.createElement('div');
            crosshair.id = 'ultima-crosshair';
            crosshair.className = 'ultima-crosshair';
            
            let crosshairInner = document.createElement('div');
            
            if (CONFIG.SETTINGS.crosshairStyle === 'custom' && CONFIG.SETTINGS.crosshairUrl) {
                crosshairInner.className = 'crosshair-custom';
                crosshairInner.style.backgroundImage = `url("${CONFIG.SETTINGS.crosshairUrl}")`;
            } else {
                crosshairInner.className = `crosshair-${CONFIG.SETTINGS.crosshairStyle}`;
            }
            
            crosshair.appendChild(crosshairInner);
            document.body.appendChild(crosshair);
        }
        
        // FIXED ARMOR VIEW
        createArmorView() {
            const armorView = document.createElement('div');
            armorView.id = 'ultima-armor-view';
            armorView.className = 'ultima-element ultima-draggable';
            armorView.style.cssText = `
                top: 120px;
                right: 30px;
                pointer-events: all;
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;
            
            armorView.innerHTML = `
                <div style="color: white; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9;">⚔️ ARMOR</div>
                <div class="ultima-armor-grid">
                    ${this.armorSlots.map(slot => `
                        <div class="ultima-armor-slot" data-slot="${slot}" id="armor-slot-${slot}">
                            <div class="armor-item-icon" id="armor-icon-${slot}"></div>
                            <div class="armor-slot-label">${slot.toUpperCase()}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            document.getElementById('ultima-hud-container').appendChild(armorView);
            this.makeDraggable(armorView);
            
            // Store armor elements
            this.armorSlots.forEach(slot => {
                this.armorElements[slot] = document.getElementById(`armor-slot-${slot}`);
            });
            
            // Start armor monitoring
            this.startArmorMonitoring();
        }
        
        startArmorMonitoring() {
            const updateArmor = () => {
                if (!CONFIG.SETTINGS.armorView) return;
                
                // Simulate armor detection - In real use, this would check actual game inventory
                const armorIcons = {
                    helmet: '🛡️',
                    chestplate: '🧥',
                    leggings: '👖',
                    boots: '👢'
                };
                
                // For now, simulate random armor for demonstration
                this.armorSlots.forEach(slot => {
                    const slotEl = this.armorElements[slot];
                    const iconEl = document.getElementById(`armor-icon-${slot}`);
                    
                    if (slotEl && iconEl) {
                        const hasArmor = Math.random() > 0.3; // 70% chance to show armor
                        
                        if (hasArmor) {
                            slotEl.classList.add('equipped');
                            iconEl.textContent = armorIcons[slot] || '🛡️';
                        } else {
                            slotEl.classList.remove('equipped');
                            iconEl.textContent = '';
                        }
                    }
                });
            };
            
            // Update armor every 2 seconds
            setInterval(updateArmor, 2000);
            updateArmor(); // Initial update
        }
        
        startHUDUpdates() {
            // FPS calculation
            const updateFPS = () => {
                this.frameCount++;
                const now = performance.now();
                const delta = now - this.lastTime;
                
                if (delta >= 1000) {
                    this.fps = Math.round((this.frameCount * 1000) / delta);
                    this.frameCount = 0;
                    this.lastTime = now;
                    
                    if (this.hudElements.fps) {
                        this.hudElements.fps.textContent = `FPS: ${this.fps}`;
                        this.hudElements.fps.style.color = this.fps > 60 ? '#00ff88' : this.fps > 30 ? '#ffaa00' : '#ff4444';
                    }
                }
                
                requestAnimationFrame(updateFPS);
            };
            
            // CPS calculation
            document.addEventListener('click', () => {
                this.clicks.push(Date.now());
            });
            
            setInterval(() => {
                const now = Date.now();
                this.clicks = this.clicks.filter(time => now - time < 1000);
                this.cps = this.clicks.length;
                
                if (this.hudElements.cps) {
                    this.hudElements.cps.textContent = `CPS: ${this.cps}`;
                    this.hudElements.cps.style.color = this.cps > 10 ? '#00ff88' : this.cps > 5 ? '#ffaa00' : '#ff4444';
                }
            }, 100);
            
            // Ping calculation
            setInterval(() => {
                const start = performance.now();
                fetch('/favicon.ico', { cache: 'no-store', mode: 'no-cors' })
                    .then(() => {
                        this.ping = Math.round(performance.now() - start);
                        if (this.hudElements.ping) {
                            this.hudElements.ping.textContent = `PING: ${this.ping}ms`;
                            this.hudElements.ping.style.color = this.ping < 50 ? '#00ff88' : this.ping < 100 ? '#ffaa00' : '#ff4444';
                        }
                    })
                    .catch(() => {
                        this.ping = '?';
                        if (this.hudElements.ping) {
                            this.hudElements.ping.textContent = 'PING: ?ms';
                            this.hudElements.ping.style.color = '#ff4444';
                        }
                    });
            }, 3000);
            
            // Timer update
            setInterval(() => {
                this.timer++;
                const hours = Math.floor(this.timer / 3600);
                const mins = Math.floor((this.timer % 3600) / 60).toString().padStart(2, '0');
                const secs = (this.timer % 60).toString().padStart(2, '0');
                
                if (this.hudElements.timer) {
                    if (hours > 0) {
                        this.hudElements.timer.textContent = `TIME: ${hours}:${mins}:${secs}`;
                    } else {
                        this.hudElements.timer.textContent = `TIME: ${mins}:${secs}`;
                    }
                }
            }, 1000);
            
            updateFPS();
        }
        
        // ============================================
        //  MENU SYSTEM - POLISHED VERSION
        // ============================================
        createMenu() {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            overlay.id = 'ultima-menu-overlay';
            overlay.addEventListener('click', () => this.toggleMenu());
            document.body.appendChild(overlay);
            
            // Create menu button
            const menuBtn = document.createElement('div');
            menuBtn.id = 'ultima-menu-btn';
            menuBtn.innerHTML = '⚙️';
            menuBtn.title = 'Ultima Client Menu (Right Shift)';
            menuBtn.addEventListener('click', () => this.toggleMenu());
            document.body.appendChild(menuBtn);
            
            // Create menu container
            const menu = document.createElement('div');
            menu.className = 'ultima-menu ultima-scrollbar';
            menu.id = 'ultima-menu';
            
            menu.innerHTML = this.generateMenuHTML();
            document.body.appendChild(menu);
            
            // Setup menu interactions
            this.setupMenuInteractions();
        }
        
        generateMenuHTML() {
            return `
            <div style="display: flex; height: 100%;">
                <!-- Sidebar -->
                <div style="width: 240px; padding: 25px; display: flex; flex-direction: column; gap: 5px; border-right: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #667eea; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px;">ULTIMA</h2>
                        <p style="color: rgba(255,255,255,0.5); margin: 2px 0 0 0; font-size: 11px; letter-spacing: 2px;">CLIENT v${this.version}</p>
                    </div>
                    
                    <button class="menu-tab active" data-tab="general">
                        <span style="font-size: 18px;">⚙️</span>
                        <span>General</span>
                    </button>
                    
                    <button class="menu-tab" data-tab="hud">
                        <span style="font-size: 18px;">🎯</span>
                        <span>HUD</span>
                    </button>
                    
                    <button class="menu-tab" data-tab="visual">
                        <span style="font-size: 18px;">🌙</span>
                        <span>Visual</span>
                    </button>
                    
                    <button class="menu-tab" data-tab="performance">
                        <span style="font-size: 18px;">⚡</span>
                        <span>Performance</span>
                    </button>
                    
                    <button class="menu-tab" data-tab="controls">
                        <span style="font-size: 18px;">🎮</span>
                        <span>Controls</span>
                    </button>
                    
                    <button class="menu-tab" data-tab="cosmetics">
                        <span style="font-size: 18px;">🎨</span>
                        <span>Cosmetics</span>
                    </button>
                    
                    <div style="flex: 1;"></div>
                    
                    <button id="save-settings" style="margin-top: 20px; padding: 14px;">
                        <span style="font-size: 16px;">💾</span>
                        <span>Save Settings</span>
                    </button>
                    
                    <button id="close-menu" style="margin-top: 10px; background: rgba(255,255,255,0.1);">
                        <span style="font-size: 16px;">✕</span>
                        <span>Close Menu</span>
                    </button>
                </div>
                
                <!-- Content Area -->
                <div style="flex: 1; padding: 25px; overflow-y: auto;">
                    <!-- General Tab -->
                    <div id="tab-general" class="tab-content active">
                        <h3>General Settings</h3>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="music-enabled" ${CONFIG.SETTINGS.musicEnabled ? 'checked' : ''}>
                                🎵 Background Music
                            </label>
                        </div>
                        
                        <div class="setting">
                            <label>Volume: <span id="volume-value">${CONFIG.SETTINGS.musicVolume}</span>%</label>
                            <input type="range" id="volume-slider" min="0" max="100" value="${CONFIG.SETTINGS.musicVolume}">
                        </div>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="fun-facts" ${CONFIG.SETTINGS.funFacts ? 'checked' : ''}>
                                💡 Fun Facts
                            </label>
                        </div>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="armor-view" ${CONFIG.SETTINGS.armorView ? 'checked' : ''}>
                                🛡️ Armor View
                            </label>
                        </div>
                    </div>
                    
                    <!-- HUD Tab -->
                    <div id="tab-hud" class="tab-content">
                        <h3>HUD Settings</h3>
                        
                        ${['fps', 'cps', 'ping', 'timer', 'keystrokes'].map(type => `
                            <div class="setting">
                                <label>
                                    <input type="checkbox" id="${type}-display" ${CONFIG.SETTINGS[type + 'Display'] ? 'checked' : ''}>
                                    ${type.toUpperCase()} Display
                                </label>
                            </div>
                        `).join('')}
                        
                        <h4>Crosshair Settings</h4>
                        
                        <div class="setting">
                            <label>Style:</label>
                            <select id="crosshair-style">
                                <option value="plus" ${CONFIG.SETTINGS.crosshairStyle === 'plus' ? 'selected' : ''}>Plus</option>
                                <option value="dot" ${CONFIG.SETTINGS.crosshairStyle === 'dot' ? 'selected' : ''}>Dot</option>
                                <option value="circle" ${CONFIG.SETTINGS.crosshairStyle === 'circle' ? 'selected' : ''}>Circle</option>
                                <option value="cross" ${CONFIG.SETTINGS.crosshairStyle === 'cross' ? 'selected' : ''}>Cross</option>
                                <option value="custom" ${CONFIG.SETTINGS.crosshairStyle === 'custom' ? 'selected' : ''}>Custom URL</option>
                            </select>
                        </div>
                        
                        <div class="setting">
                            <label>Size: <span id="crosshair-size-value">${CONFIG.SETTINGS.crosshairSize}</span>px</label>
                            <input type="range" id="crosshair-size" min="5" max="50" value="${CONFIG.SETTINGS.crosshairSize}">
                        </div>
                        
                        <div class="setting">
                            <label>Color:</label>
                            <input type="color" id="crosshair-color" value="${CONFIG.SETTINGS.crosshairColor}">
                        </div>
                    </div>
                    
                    <!-- Visual Tab -->
                    <div id="tab-visual" class="tab-content">
                        <h3>Visual Settings</h3>
                        
                        ${['nightMode', 'cinematicMode', 'fullbright'].map(mode => `
                            <div class="setting">
                                <label>
                                    <input type="checkbox" id="${mode}" ${CONFIG.SETTINGS[mode] ? 'checked' : ''}>
                                    ${this.formatSettingName(mode)}
                                </label>
                            </div>
                        `).join('')}
                        
                        <h4>Hotbar Settings</h4>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="hotbar-style" ${CONFIG.SETTINGS.hotbarStyle ? 'checked' : ''}>
                                Enhanced Hotbar
                            </label>
                        </div>
                        
                        <div class="setting">
                            <label>Hotbar Color:</label>
                            <input type="color" id="hotbar-color" value="${CONFIG.SETTINGS.hotbarColor}">
                        </div>
                        
                        <div class="setting">
                            <label>Selected Color:</label>
                            <input type="color" id="selected-color" value="${CONFIG.SETTINGS.selectedColor}">
                        </div>
                    </div>
                    
                    <!-- Performance Tab -->
                    <div id="tab-performance" class="tab-content">
                        <h3>Performance Settings</h3>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="remove-ads" ${CONFIG.SETTINGS.removeAds ? 'checked' : ''}>
                                🚫 Remove Ads
                            </label>
                        </div>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="perf-mode" ${CONFIG.SETTINGS.perfMode ? 'checked' : ''}>
                                ⚡ Performance Mode
                            </label>
                        </div>
                        
                        <div class="setting">
                            <label>Resolution:</label>
                            <select id="resolution">
                                <option value="1920x1080" ${CONFIG.SETTINGS.resolution === '1920x1080' ? 'selected' : ''}>1080p (Full HD)</option>
                                <option value="2560x1440" ${CONFIG.SETTINGS.resolution === '2560x1440' ? 'selected' : ''}>2K (1440p)</option>
                                <option value="3200x1800" ${CONFIG.SETTINGS.resolution === '3200x1800' ? 'selected' : ''}>1800p</option>
                                <option value="3840x2160" ${CONFIG.SETTINGS.resolution === '3840x2160' ? 'selected' : ''}>4K (2160p)</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Controls Tab -->
                    <div id="tab-controls" class="tab-content">
                        <h3>Control Settings</h3>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="toggle-sprint" ${CONFIG.SETTINGS.toggleSprint ? 'checked' : ''}>
                                🏃 Toggle Sprint
                            </label>
                        </div>
                        
                        <div class="setting">
                            <label>Sprint Key:</label>
                            <input type="text" id="sprint-key" value="${CONFIG.SETTINGS.sprintKey}" readonly placeholder="Click to set key">
                        </div>
                        
                        <div class="setting">
                            <label>Menu Key:</label>
                            <input type="text" id="menu-key" value="${CONFIG.SETTINGS.menuKey}" readonly placeholder="Click to set key">
                        </div>
                    </div>
                    
                    <!-- Cosmetics Tab -->
                    <div id="tab-cosmetics" class="tab-content">
                        <h3>Cosmetic Settings</h3>
                        
                        <div class="setting">
                            <label>Cape:</label>
                            <select id="cape">
                                <option value="none" ${CONFIG.SETTINGS.cape === 'none' ? 'selected' : ''}>No Cape</option>
                                <option value="super" ${CONFIG.SETTINGS.cape === 'super' ? 'selected' : ''}>Super Cape</option>
                                <option value="deep_space" ${CONFIG.SETTINGS.cape === 'deep_space' ? 'selected' : ''}>Deep Space Cape</option>
                                <option value="cow_normal" ${CONFIG.SETTINGS.cape === 'cow_normal' ? 'selected' : ''}>Cow Cape</option>
                            </select>
                        </div>
                        
                        <div class="setting">
                            <label>
                                <input type="checkbox" id="custom-background" ${CONFIG.SETTINGS.customBackground ? 'checked' : ''}>
                                🖼️ Custom Background
                            </label>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        
        formatSettingName(name) {
            return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        }
        
        setupMenuInteractions() {
            const menu = document.getElementById('ultima-menu');
            
            // Close button
            document.getElementById('close-menu')?.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            // Save button
            document.getElementById('save-settings')?.addEventListener('click', () => {
                this.saveSettings();
                this.toggleMenu();
                this.showNotification('Settings saved successfully! ✅', 3000);
            });
            
            // Tab switching
            menu.querySelectorAll('.menu-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    menu.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
                    menu.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    const tabId = tab.dataset.tab;
                    document.getElementById(`tab-${tabId}`).classList.add('active');
                });
            });
            
            // Toggle switches
            menu.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const setting = checkbox.id.replace(/-/g, '_');
                    CONFIG.SETTINGS[setting] = checkbox.checked;
                    
                    // Live updates for some settings
                    if (setting === 'armor_view') {
                        const armorView = document.getElementById('ultima-armor-view');
                        if (armorView) {
                            armorView.style.display = checkbox.checked ? 'flex' : 'none';
                        }
                    }
                });
            });
            
            // Sliders
            const sliders = [
                { id: 'volume-slider', setting: 'musicVolume', valueId: 'volume-value' },
                { id: 'crosshair-size', setting: 'crosshairSize', valueId: 'crosshair-size-value' }
            ];
            
            sliders.forEach(slider => {
                const el = document.getElementById(slider.id);
                if (el) {
                    const valueEl = document.getElementById(slider.valueId);
                    el.addEventListener('input', () => {
                        const value = parseInt(el.value);
                        CONFIG.SETTINGS[slider.setting] = value;
                        if (valueEl) valueEl.textContent = value;
                        
                        // Live updates
                        if (slider.id === 'crosshair-size') {
                            document.documentElement.style.setProperty('--crosshair-size', value + 'px');
                            this.createCrosshair();
                        } else if (slider.id === 'volume-slider') {
                            if (this.music) this.music.volume = value / 100;
                        }
                    });
                }
            });
            
            // Color pickers
            ['crosshair-color', 'hotbar-color', 'selected-color'].forEach(pickerId => {
                const picker = document.getElementById(pickerId);
                if (picker) {
                    picker.addEventListener('input', () => {
                        const setting = picker.id.replace(/-/g, '_');
                        CONFIG.SETTINGS[setting] = picker.value;
                        
                        if (pickerId === 'crosshair-color') {
                            document.documentElement.style.setProperty('--crosshair-color', picker.value);
                            this.createCrosshair();
                        } else if (pickerId.includes('color')) {
                            document.documentElement.style.setProperty(`--${picker.id.replace('-', '-')}`, picker.value);
                            this.updateHotbarStyles();
                        }
                    });
                }
            });
            
            // Select elements
            menu.querySelectorAll('select').forEach(select => {
                select.addEventListener('change', () => {
                    const setting = select.id.replace(/-/g, '_');
                    CONFIG.SETTINGS[setting] = select.value;
                    
                    if (select.id === 'crosshair-style') {
                        this.createCrosshair();
                    } else if (select.id === 'resolution') {
                        this.applyResolution();
                    }
                });
            });
            
            // Key bindings
            menu.querySelectorAll('input[type="text"][readonly]').forEach(input => {
                input.addEventListener('click', function() {
                    this.value = 'Press a key...';
                    const originalValue = this.defaultValue || this.dataset.original;
                    
                    const keyHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const keyCode = e.code;
                        if (keyCode && keyCode !== 'Escape') {
                            this.value = keyCode;
                            CONFIG.SETTINGS[this.id.replace(/-/g, '_')] = keyCode;
                        } else {
                            this.value = originalValue;
                        }
                        
                        document.removeEventListener('keydown', keyHandler);
                        this.blur();
                    };
                    
                    document.addEventListener('keydown', keyHandler, { once: false });
                    
                    // Escape handler
                    const escapeHandler = (e) => {
                        if (e.code === 'Escape') {
                            this.value = originalValue;
                            document.removeEventListener('keydown', keyHandler);
                            document.removeEventListener('keydown', escapeHandler);
                            this.blur();
                        }
                    };
                    
                    document.addEventListener('keydown', escapeHandler, { once: false });
                });
            });
        }
        
        // ============================================
        //  UTILITY FUNCTIONS
        // ============================================
        waitForGame() {
            return new Promise(resolve => {
                const check = setInterval(() => {
                    if (document.querySelector('canvas') || document.querySelector('.HomePageBackground')) {
                        clearInterval(check);
                        setTimeout(resolve, 1000);
                    }
                }, 100);
                
                setTimeout(() => {
                    clearInterval(check);
                    resolve();
                }, 5000);
            });
        }
        
        makeDraggable(element) {
            let isDragging = false;
            let startX, startY, initialX, initialY;
            
            element.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                if (e.target.closest('button, input, select, .keystroke-key')) return;
                
                isDragging = true;
                element.style.transition = 'none';
                element.style.zIndex = '99991';
                
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = element.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                element.style.left = (initialX + deltaX) + 'px';
                element.style.top = (initialY + deltaY) + 'px';
            });
            
            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.zIndex = '99990';
                
                // Save position for this session
                const id = element.id.replace('ultima-', '');
                localStorage.setItem(`ultima_pos_${id}`, JSON.stringify({
                    left: element.style.left,
                    top: element.style.top
                }));
            });
            
            // Load saved position
            const id = element.id.replace('ultima-', '');
            const savedPos = localStorage.getItem(`ultima_pos_${id}`);
            if (savedPos) {
                try {
                    const pos = JSON.parse(savedPos);
                    if (pos.left) element.style.left = pos.left;
                    if (pos.top) element.style.top = pos.top;
                } catch (e) {
                    console.log('Failed to load saved position:', e);
                }
            }
        }
        
        toggleMenu() {
            const menu = document.getElementById('ultima-menu');
            const overlay = document.getElementById('ultima-menu-overlay');
            
            this.isMenuOpen = !this.isMenuOpen;
            
            if (menu) {
                menu.style.display = this.isMenuOpen ? 'flex' : 'none';
                if (this.isMenuOpen) {
                    menu.style.animation = 'fadeIn 0.3s ease';
                }
            }
            if (overlay) overlay.style.display = this.isMenuOpen ? 'block' : 'none';
        }
        
        setupHotkeys() {
            document.addEventListener('keydown', (e) => {
                // Menu toggle
                if (e.code === CONFIG.SETTINGS.menuKey || (e.key === 'Shift' && e.location === 2)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMenu();
                }
                
                // Toggle sprint
                if (CONFIG.SETTINGS.toggleSprint && e.code === CONFIG.SETTINGS.sprintKey) {
                    e.preventDefault();
                    this.toggleSprint();
                }
                
                // Night mode
                if (e.key === 'n' || e.key === 'N') {
                    e.preventDefault();
                    CONFIG.SETTINGS.nightMode = !CONFIG.SETTINGS.nightMode;
                    this.applyVisualModes();
                    this.showNotification(`🌙 Night mode ${CONFIG.SETTINGS.nightMode ? 'ON' : 'OFF'}`, 2000);
                }
                
                // Cinematic mode
                if (e.key === 'h' || e.key === 'H') {
                    e.preventDefault();
                    CONFIG.SETTINGS.cinematicMode = !CONFIG.SETTINGS.cinematicMode;
                    this.applyVisualModes();
                    this.showNotification(`🎬 Cinematic mode ${CONFIG.SETTINGS.cinematicMode ? 'ON' : 'OFF'}`, 2000);
                }
            });
        }
        
        toggleSprint() {
            if (!CONFIG.SETTINGS.toggleSprint) return;
            
            const shiftKeyData = {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: 16,
                shiftKey: true,
                bubbles: true
            };
            
            if (!this.sprintActive) {
                this.sprintActive = true;
                this.isKeepingRunning = true;
                document.dispatchEvent(new KeyboardEvent('keydown', shiftKeyData));
                this.showNotification('🏃 Sprint: ON (Press F to toggle)', 2000);
            } else {
                this.sprintActive = false;
                this.isKeepingRunning = false;
                document.dispatchEvent(new KeyboardEvent('keyup', shiftKeyData));
                this.showNotification('🏃 Sprint: OFF', 2000);
            }
        }
        
        // Keep sprint active
        keepSprintActive() {
            setInterval(() => {
                if (this.isKeepingRunning && CONFIG.SETTINGS.toggleSprint && this.sprintActive) {
                    const shiftKeyData = {
                        key: 'Shift',
                        code: 'ShiftLeft',
                        keyCode: 16,
                        shiftKey: true,
                        bubbles: true
                    };
                    document.dispatchEvent(new KeyboardEvent('keydown', shiftKeyData));
                }
            }, 100);
        }
        
        applyVisualModes() {
            // Night mode
            if (CONFIG.SETTINGS.nightMode) {
                document.body.classList.add('ultima-night-mode');
            } else {
                document.body.classList.remove('ultima-night-mode');
            }
            
            // Fullbright
            if (CONFIG.SETTINGS.fullbright) {
                document.body.classList.add('ultima-fullbright');
            } else {
                document.body.classList.remove('ultima-fullbright');
            }
            
            // Cinematic mode
            this.toggleCinematicMode(CONFIG.SETTINGS.cinematicMode);
        }
        
        toggleCinematicMode(enabled) {
            if (enabled) {
                let topBar = document.getElementById('ultima-cinematic-top');
                let bottomBar = document.getElementById('ultima-cinematic-bottom');
                
                if (!topBar) {
                    topBar = document.createElement('div');
                    topBar.id = 'ultima-cinematic-top';
                    topBar.className = 'ultima-cinematic-bars cinematic-top';
                    document.body.appendChild(topBar);
                }
                
                if (!bottomBar) {
                    bottomBar = document.createElement('div');
                    bottomBar.id = 'ultima-cinematic-bottom';
                    bottomBar.className = 'ultima-cinematic-bars cinematic-bottom';
                    document.body.appendChild(bottomBar);
                }
            } else {
                const topBar = document.getElementById('ultima-cinematic-top');
                const bottomBar = document.getElementById('ultima-cinematic-bottom');
                
                if (topBar) topBar.remove();
                if (bottomBar) bottomBar.remove();
            }
        }
        
        updateHotbarStyles() {
            if (!CONFIG.SETTINGS.hotbarStyle) return;
            
            const update = () => {
                document.querySelectorAll('.HotBarSlot, .HotBarItem').forEach(slot => {
                    slot.style.borderColor = CONFIG.SETTINGS.hotbarColor;
                    slot.style.background = `linear-gradient(135deg, rgba(30, 30, 40, 0.8) 0%, rgba(20, 20, 30, 0.8) 100%)`;
                    slot.style.backdropFilter = 'blur(10px)';
                });
                
                document.querySelectorAll('.SelectedItem').forEach(slot => {
                    slot.style.borderColor = CONFIG.SETTINGS.selectedColor;
                    slot.style.boxShadow = `0 0 25px ${CONFIG.SETTINGS.selectedColor}`;
                });
            };
            
            setInterval(update, 100);
        }
        
        applyResolution() {
            if (!CONFIG.SETTINGS.resolution) return;
            
            const [width, height] = CONFIG.SETTINGS.resolution.split('x').map(Number);
            const canvas = document.querySelector('canvas');
            
            if (canvas) {
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                canvas.width = width;
                canvas.height = height;
            }
        }
        
        startBackgroundMusic() {
            this.music = new Audio("https://file.garden/aF_qZS3oWW0Z5HGs/turn-it-up-a-minecraft-original-music-video-song_6yfEgQVm.mp3");
            this.music.volume = CONFIG.SETTINGS.musicVolume / 100;
            this.music.loop = true;
            
            // Start music with user interaction
            const startMusic = () => {
                if (CONFIG.SETTINGS.musicEnabled && this.music.paused) {
                    this.music.play().catch(e => console.log("Music autoplay blocked:", e));
                }
            };
            
            // Try to start on user interaction
            document.addEventListener('click', startMusic, { once: true });
            document.addEventListener('keydown', startMusic, { once: true });
            
            // Also try after a delay
            setTimeout(startMusic, 5000);
        }
        
        initializeAllModules() {
            // Update hotbar styles
            this.updateHotbarStyles();
            
            // Apply resolution
            this.applyResolution();
            
            // Apply visual modes
            this.applyVisualModes();
            
            // Keep sprint active
            this.keepSprintActive();
            
            // Apply performance mode
            if (CONFIG.SETTINGS.perfMode) {
                this.enablePerformanceMode();
            }
            
            // Fun facts
            if (CONFIG.SETTINGS.funFacts) {
                this.startFunFacts();
            }
            
            // Shield
            if (CONFIG.SETTINGS.shield) {
                this.enableShield();
            }
        }
        
        enablePerformanceMode() {
            // Clean up hidden elements periodically
            setInterval(() => {
                document.querySelectorAll('div, span').forEach(el => {
                    const cs = window.getComputedStyle(el);
                    if (cs.display === 'none' || cs.visibility === 'hidden' || el.offsetHeight === 0) {
                        el.remove();
                    }
                });
            }, 10000);
            
            // Lower animation quality
            document.querySelectorAll('*').forEach(el => {
                el.style.willChange = 'auto';
                el.style.transform = 'translateZ(0)';
            });
        }
        
        enableShield() {
            // Clear cookies
            document.cookie.split(";").forEach(c => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            
            // Clear local storage for ads
            Object.keys(localStorage).forEach(key => {
                if (key.includes('ad') || key.includes('track')) {
                    localStorage.removeItem(key);
                }
            });
        }
        
        startFunFacts() {
            const facts = [
                "💡 Tip: Press Right Shift to open the Ultima menu!",
                "⚡ Performance mode reduces lag and improves FPS",
                "🎯 Customize your crosshair in the Visual tab",
                "🏃 Toggle sprint with F key for easier movement",
                "🌙 Press N for night mode to reduce eye strain",
                "🎮 All HUD elements are draggable - move them anywhere!",
                "💾 Don't forget to save your settings!",
                "🚀 Ultima Client combines the best features from top clients"
            ];
            
            setInterval(() => {
                if (CONFIG.SETTINGS.funFacts && !this.isMenuOpen) {
                    const fact = facts[Math.floor(Math.random() * facts.length)];
                    this.showNotification(fact, 5000);
                }
            }, 30000);
        }
        
        saveSettings() {
            // Save all settings to storage
            Object.keys(CONFIG.SETTINGS).forEach(key => {
                GM_setValue('ultima_' + key, CONFIG.SETTINGS[key]);
            });
            
            // Reinitialize with new settings
            this.applyVisualModes();
            this.createCrosshair();
            this.updateHotbarStyles();
            this.applyResolution();
            
            // Update HUD visibility
            ['fps', 'cps', 'ping', 'timer', 'keystrokes'].forEach(key => {
                if (this.hudElements[key]) {
                    this.hudElements[key].style.display = CONFIG.SETTINGS[key + 'Display'] ? 'block' : 'none';
                }
            });
            
            // Update armor view
            const armorView = document.getElementById('ultima-armor-view');
            if (armorView) {
                armorView.style.display = CONFIG.SETTINGS.armorView ? 'flex' : 'none';
            }
            
            // Update music
            if (this.music) {
                this.music.volume = CONFIG.SETTINGS.musicVolume / 100;
                if (CONFIG.SETTINGS.musicEnabled && this.music.paused) {
                    this.music.play().catch(e => console.log("Music play failed:", e));
                } else if (!CONFIG.SETTINGS.musicEnabled && !this.music.paused) {
                    this.music.pause();
                }
            }
        }
        
        showNotification(message, duration = 3000) {
            const existing = document.querySelector('.ultima-notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = 'ultima-notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%) translateY(-20px)';
                    setTimeout(() => {
                        if (notification.parentNode) notification.parentNode.removeChild(notification);
                    }, 300);
                }
            }, duration);
        }
    }
    
    // ============================================
    //  INITIALIZE CLIENT
    // ============================================
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.ultimaClient = new UltimaClient();
            }, 1500);
        });
    } else {
        setTimeout(() => {
            window.ultimaClient = new UltimaClient();
        }, 1500);
    }
})();
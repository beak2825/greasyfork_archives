// ==UserScript==
// @name         Torn Radial UI Components Library
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  UI component generators for Torn Radial Menu
// @author       Sensimillia (2168012)
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== UI COMPONENT GENERATOR ====================
    class UIComponents {
        
        // Search Overlay
        static createSearchOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'torn-radial-search-overlay';
            overlay.className = 'torn-radial-overlay';
            overlay.innerHTML = `
                <div class="torn-radial-container-base">
                    <div class="torn-radial-header-base">
                        <h2>🔍 Quick Search</h2>
                        <button class="modal-close" id="search-close">✕</button>
                    </div>
                    <div class="torn-radial-body-base">
                        <div style="margin-bottom: 16px;">
                            <input type="text" class="torn-radial-input" id="torn-search-input" placeholder="Search players, items, pages...">
                        </div>
                        <div id="torn-search-results"></div>
                        <div class="torn-radial-section" id="torn-search-history" style="display: none; margin-top: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 12px; opacity: 0.7;">Recent Searches</span>
                                <button class="torn-radial-btn-base btn-danger" id="clear-search-history" style="padding: 4px 8px; font-size: 11px;">Clear</button>
                            </div>
                            <div id="search-history-items"></div>
                        </div>
                    </div>
                </div>
            `;
            return overlay;
        }

        // Calculator Overlay
        static createCalculatorOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'torn-radial-calculator';
            overlay.className = 'torn-radial-overlay';
            overlay.innerHTML = `
                <div class="torn-radial-container-base" style="max-width: 400px;">
                    <div class="torn-radial-header-base">
                        <h2>🔢 Calculator</h2>
                        <button class="modal-close" id="calculator-close">✕</button>
                    </div>
                    <div style="padding: 30px 20px; background: rgba(50, 50, 50, 0.5); text-align: right; font-size: 36px; font-weight: 300; min-height: 80px; word-break: break-all; font-family: 'Courier New', monospace;" id="calc-display">0</div>
                    <div style="padding: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                        <button class="torn-radial-btn-base btn-danger" data-value="C">C</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="/">/</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="*">×</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="-">-</button>
                        
                        <button class="torn-radial-btn-base btn-secondary" data-value="7">7</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="8">8</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="9">9</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="+">+</button>
                        
                        <button class="torn-radial-btn-base btn-secondary" data-value="4">4</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="5">5</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="6">6</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="%">%</button>
                        
                        <button class="torn-radial-btn-base btn-secondary" data-value="1">1</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="2">2</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value="3">3</button>
                        <button class="torn-radial-btn-base btn-success" data-value="=" style="grid-row: span 2;">=</button>
                        
                        <button class="torn-radial-btn-base btn-secondary" data-value="0" style="grid-column: span 2;">0</button>
                        <button class="torn-radial-btn-base btn-secondary" data-value=".">.</button>
                    </div>
                </div>
            `;
            return overlay;
        }

        // Mini Apps Overlay
        static createMiniAppsOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'torn-radial-mini-apps';
            overlay.className = 'torn-radial-overlay';
            overlay.innerHTML = `
                <div class="torn-radial-container-base" style="max-width: 800px;">
                    <div class="torn-radial-header-base">
                        <h2>🛠️ Mini Apps</h2>
                        <button class="modal-close" id="mini-apps-close">✕</button>
                    </div>
                    <div class="torn-radial-body-base">
                        <div class="torn-radial-section">
                            <h3>⏱️ Timer Manager</h3>
                            <div id="timers-list"></div>
                            <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
                                <input type="text" class="torn-radial-input" id="timer-name" placeholder="Timer name" style="flex: 1; min-width: 150px;">
                                <input type="number" class="torn-radial-input" id="timer-minutes" placeholder="Minutes" style="width: 100px;">
                                <button class="torn-radial-btn-base btn-success" id="add-timer-btn">Add</button>
                            </div>
                        </div>
                        
                        <div class="torn-radial-section" id="api-monitor-section">
                            <h3>📊 API Monitor</h3>
                            <div id="api-status">
                                <p style="font-size: 12px; margin: 0; opacity: 0.7;">Configure your API key in settings to enable real-time monitoring</p>
                            </div>
                            <div id="api-bars" style="display: none; margin-top: 12px;">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                    <div class="torn-radial-section" style="margin: 0; padding: 12px;">
                                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 4px;">Energy</div>
                                        <div style="font-size: 18px; font-weight: 600;" id="energy-value">-/-</div>
                                        <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 8px; overflow: hidden;">
                                            <div id="energy-progress" style="height: 100%; width: 0%; background: #4aa3df; transition: width 0.3s ease;"></div>
                                        </div>
                                    </div>
                                    <div class="torn-radial-section" style="margin: 0; padding: 12px;">
                                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 4px;">Nerve</div>
                                        <div style="font-size: 18px; font-weight: 600;" id="nerve-value">-/-</div>
                                        <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 8px; overflow: hidden;">
                                            <div id="nerve-progress" style="height: 100%; width: 0%; background: #a33a3a; transition: width 0.3s ease;"></div>
                                        </div>
                                    </div>
                                    <div class="torn-radial-section" style="margin: 0; padding: 12px;">
                                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 4px;">Happy</div>
                                        <div style="font-size: 18px; font-weight: 600;" id="happy-value">-/-</div>
                                        <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 8px; overflow: hidden;">
                                            <div id="happy-progress" style="height: 100%; width: 0%; background: #3ea34a; transition: width 0.3s ease;"></div>
                                        </div>
                                    </div>
                                    <div class="torn-radial-section" style="margin: 0; padding: 12px;">
                                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 4px;">Life</div>
                                        <div style="font-size: 18px; font-weight: 600;" id="life-value">-/-</div>
                                        <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 8px; overflow: hidden;">
                                            <div id="life-progress" style="height: 100%; width: 0%; background: #FF3B30; transition: width 0.3s ease;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button class="torn-radial-btn-base btn-primary" id="refresh-api-btn" style="width: 100%; margin-top: 12px; display: none;">Refresh Data</button>
                        </div>
                        
                        <div class="torn-radial-section">
                            <h3>📝 Quick Notes</h3>
                            <textarea class="torn-radial-input" id="quick-notes" placeholder="Jot down quick notes..." style="min-height: 120px; resize: vertical; font-family: monospace;"></textarea>
                            <button class="torn-radial-btn-base btn-success" id="save-notes-btn" style="margin-top: 8px; width: 100%;">Save Notes</button>
                        </div>
                        
                        <div class="torn-radial-section">
                            <h3>⚔️ Faction Shortcuts</h3>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                                <a href="/factions.php?step=your" class="torn-radial-btn-base btn-secondary" style="text-decoration: none; text-align: center; display: block;">Faction Home</a>
                                <a href="/factions.php?step=your#/tab=crimes" class="torn-radial-btn-base btn-secondary" style="text-decoration: none; text-align: center; display: block;">OC</a>
                                <a href="/factions.php?step=your#/tab=armoury" class="torn-radial-btn-base btn-secondary" style="text-decoration: none; text-align: center; display: block;">Armory</a>
                                <a href="/factions.php?step=your#/tab=controls" class="torn-radial-btn-base btn-secondary" style="text-decoration: none; text-align: center; display: block;">Controls</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            return overlay;
        }

        // Calibration Overlay
        static createCalibrationOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'torn-radial-calibration';
            overlay.innerHTML = `
                <div class="calibration-instruction">Click the TOP-LEFT corner of your safe area</div>
                <button class="calibration-cancel" id="calibration-cancel-btn">Cancel (ESC)</button>
            `;
            return overlay;
        }

        // Settings Modal
        static createSettingsModal(isPDA) {
            const modal = document.createElement('div');
            modal.id = 'torn-radial-modal';
            modal.style.cssText = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
                z-index: 1000000;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                padding: ${isPDA ? '8px' : '20px'};
                overflow-y: auto;
            `;
            modal.innerHTML = `
                <div class="torn-radial-container-base">
                    <div class="torn-radial-header-base">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                            <h2>⚙️ Quick Travel Settings</h2>
                        </div>
                        <button class="error-log-btn" id="show-error-log" title="View Error Log">🐞</button>
                        <button class="modal-close" id="modal-close-btn">✕</button>
                    </div>
                    <div class="torn-radial-body-base">
                        <div class="torn-radial-section">
                            <h3>📋 Loadouts</h3>
                            <div class="loadout-tabs" id="loadout-tabs"></div>
                            <div style="display: grid; grid-template-columns: repeat(${isPDA ? '2' : '3'}, 1fr); gap: 8px; margin-top: 12px;">
                                <button class="torn-radial-btn-base btn-success" id="new-loadout-btn" style="font-size: ${isPDA ? '11px' : '13px'};">➕ New</button>
                                <button class="torn-radial-btn-base btn-secondary" id="rename-loadout-btn" style="font-size: ${isPDA ? '11px' : '13px'};">✏️ Rename</button>
                                <button class="torn-radial-btn-base btn-danger" id="delete-loadout-btn" style="font-size: ${isPDA ? '11px' : '13px'}; ${isPDA ? 'grid-column: span 2;' : ''}">🗑️ Delete</button>
                            </div>
                        </div>
                        
                        <button class="torn-radial-btn-base btn-success" id="add-current-page-btn" style="width: 100%; margin-bottom: 12px;">📄 Add Current Page to Loadout</button>
                        
                        <div class="torn-radial-section">
                            <h3>🎨 Appearance</h3>
                            <div class="setting-item">
                                <label>Theme</label>
                                <select class="torn-radial-select" id="theme-select">
                                    <option value="torn">Torn</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="cyberpunk">Cyberpunk</option>
                                    <option value="ocean">Ocean</option>
                                    <option value="sunset">Sunset</option>
                                    <option value="neonNoir">NeonNoir</option>
                                    <option value="bloodline">Bloodline</option>
                                    <option value="stealth">Stealth</option>
                                    <option value="terminal">Terminal</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Layout</label>
                                <select class="torn-radial-select" id="layout-select">
                                    <option value="circular">Circular</option>
                                    <option value="vertical">Vertical</option>
                                    <option value="horizontal">Horizontal</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Size</label>
                                <select class="torn-radial-select" id="size-select">
                                    <option value="pda">PDA</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="torn-radial-section">
                            <h3>🔔 Notifications</h3>
                            <div class="setting-item">
                                <label>Enable Notifications</label>
                                <input type="checkbox" id="notif-enabled">
                            </div>
                        </div>
                        
                        <div class="torn-radial-section">
                            <h3>🔑 API Configuration</h3>
                            <div class="setting-item" style="flex-direction: column; align-items: stretch;">
                                <label>Torn API Key</label>
                                <input type="password" class="torn-radial-input" id="api-key-input" placeholder="Enter your Torn API key" style="margin-top: 8px;">
                                <p style="font-size: 11px; opacity: 0.7; margin: 8px 0 0 0;">Used for API Monitor in Mini Apps. Get your key at torn.com/preferences.php#tab=api</p>
                            </div>
                        </div>
                        
                        <div id="links-container"></div>
                        
                        <div class="torn-radial-section" style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                            <h3>💡 v2.2.0 Features</h3>
                            <p style="margin: 6px 0;">• <strong>📦 Modular Architecture:</strong> Separate libraries for easier updates</p>
                            <p style="margin: 6px 0;">• <strong>📱 PDA Optimized:</strong> All UI scales perfectly for mobile</p>
                            <p style="margin: 6px 0;">• <strong>🎨 6 Themes:</strong> Torn, Light, Dark, Cyberpunk, Ocean, Sunset</p>
                            <p style="margin: 6px 0;">• <strong>⚡ Performance:</strong> Faster loading with cached libraries</p>
                        </div>
                    </div>
                    <div class="torn-radial-footer-base" style="${isPDA ? 'flex-direction: column;' : ''}">
                        <button class="torn-radial-btn-base btn-success" id="add-link-btn">➕ Add Link</button>
                        <button class="torn-radial-btn-base btn-secondary" id="restore-btn">🔄 Restore</button>
                        <button class="torn-radial-btn-base btn-secondary" id="export-btn">📤 Export</button>
                        <button class="torn-radial-btn-base btn-secondary" id="import-btn">📥 Import</button>
                        <button class="torn-radial-btn-base btn-secondary" id="calibrate-btn" style="background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%); color: white;">📐 Calibrate</button>
                        <button class="torn-radial-btn-base btn-primary" id="save-btn" style="${isPDA ? 'grid-column: span 2;' : ''}">Save Changes</button>
                    </div>
                </div>
            `;
            return modal;
        }

        // Error Log Modal
        static createErrorLogModal() {
            const modal = document.createElement('div');
            modal.id = 'error-log-modal';
            modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000001; justify-content: center; align-items: center; padding: 20px;';
            modal.innerHTML = `
                <div class="torn-radial-container-base" style="max-width: 800px;">
                    <div class="torn-radial-header-base">
                        <h2>🐞 Error Log</h2>
                        <button class="modal-close" id="error-log-close">✕</button>
                    </div>
                    <div class="torn-radial-body-base" id="error-log-body" style="font-family: 'Courier New', monospace; font-size: 12px;"></div>
                    <div class="torn-radial-footer-base">
                        <button class="torn-radial-btn-base btn-secondary" id="export-log-btn">💾 Export</button>
                        <button class="torn-radial-btn-base btn-secondary" id="clear-log-btn">🗑️ Clear</button>
                        <button class="torn-radial-btn-base btn-primary" id="close-log-btn">Close</button>
                    </div>
                </div>
            `;
            return modal;
        }

        // Timer Item HTML
        static createTimerItem(timer, index, timeRemaining) {
            return `
                <div class="torn-radial-section" style="margin: 8px 0; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600;">${timer.name}</div>
                        <div style="font-size: 12px; opacity: 0.7;">${timeRemaining.minutes}m ${timeRemaining.seconds}s remaining</div>
                    </div>
                    <button class="torn-radial-btn-base btn-danger" onclick="window.tornRadialRemoveTimer(${index})" style="padding: 6px 12px; font-size: 12px;">Remove</button>
                </div>
            `;
        }

        // Search Result Item HTML
        static createSearchResultItem(result, isSelected = false) {
            return `
                <div class="torn-radial-section ${isSelected ? 'selected' : ''}" style="margin: 8px 0; padding: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px;" data-url="${result.url}" data-type="${result.type}">
                    <span style="font-size: 20px;">${result.icon}</span>
                    <span>${result.name}</span>
                </div>
            `;
        }

        // Link Item HTML
        static createLinkItem(link, index, totalLinks, isPDA) {
            return `
                <div class="link-item">
                    <input type="text" value="${link.icon}" placeholder="Icon" maxlength="2" data-index="${index}" data-field="icon">
                    <input type="text" value="${link.name}" placeholder="Name" data-index="${index}" data-field="name">
                    <input type="text" value="${link.url}" placeholder="URL" data-index="${index}" data-field="url">
                    <div class="color-picker-wrapper">
                        <input type="color" class="color-picker" value="${link.color}" data-index="${index}" data-field="color">
                    </div>
                    <button class="delete-btn" data-index="${index}" title="Delete">🗑️</button>
                    <div class="reorder-controls">
                        <button class="reorder-btn" data-index="${index}" data-direction="up" ${index === 0 ? 'disabled' : ''} title="Move Up">▲</button>
                        <button class="reorder-btn" data-index="${index}" data-direction="down" ${index === totalLinks - 1 ? 'disabled' : ''} title="Move Down">▼</button>
                    </div>
                </div>
            `;
        }
    }

    // ==================== EXPORT ====================
    window.TornRadialUI = {
        UIComponents: UIComponents
    };

})();
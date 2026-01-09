// ==UserScript==
// @name         Anime AFK - Simple Shop Helper
// @namespace    https://animeafk.xyz/
// @version      1.1.0
// @description  Simple UI tool for supporters - No network hooks
// @author       Support Team
// @match        http://animeafk.xyz/*
// @match        http://animeafk.xyz/*
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://animeafk.xyz/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/561950/Anime%20AFK%20-%20Simple%20Shop%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561950/Anime%20AFK%20-%20Simple%20Shop%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        PASSWORD: 'AFK_SUPP_2024', // Default password
        VERSION: '1.1.0'
    };

    // ============================================
    // MAIN CLASS
    // ============================================
    class SimpleShopHelper {
        constructor() {
            this.isAuthenticated = false;
            this.settings = {
                priceMultiplier: 1.0,
                discount: 0,
                unlimitedStock: false,
                active: false
            };
            this.init();
        }

        // =============== INITIALIZATION ===============
        init() {
            console.log(`%c🎮 Simple Shop Helper v${CONFIG.VERSION}`, 
                       'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
            
            // Add styles first
            this.addStyles();
            
            // Create floating menu
            this.createFloatingMenu();
            
            // Load saved settings
            this.loadSettings();
            
            // Auto-start if previously authenticated
            if (localStorage.getItem('afk_helper_authenticated') === 'true') {
                this.authenticateWithSaved();
            }
        }

        // =============== STYLES ===============
        addStyles() {
            const css = `
                /* Floating Menu */
                #afk-helper-floating-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 99990;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    font-size: 24px;
                    color: white;
                    user-select: none;
                }
                
                #afk-helper-floating-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
                }
                
                #afk-helper-floating-btn.active {
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                }
                
                /* Authentication Modal */
                .afk-auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    backdrop-filter: blur(5px);
                }
                
                .afk-auth-modal.hidden {
                    display: none;
                }
                
                .afk-auth-content {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    padding: 30px;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 400px;
                    border: 2px solid #667eea;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: modalSlideIn 0.3s ease;
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Control Panel */
                .afk-control-panel {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 300px;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 15px;
                    z-index: 99991;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    border: 2px solid #667eea;
                    overflow: hidden;
                    animation: panelSlideUp 0.3s ease;
                }
                
                @keyframes panelSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .afk-panel-header {
                    padding: 15px;
                    background: rgba(0,0,0,0.3);
                    border-bottom: 1px solid #2d3748;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                }
                
                .afk-panel-body {
                    padding: 20px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                /* UI Controls */
                .afk-slider-container {
                    margin-bottom: 20px;
                }
                
                .afk-slider-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    color: #cbd5e0;
                    font-size: 14px;
                }
                
                .afk-slider-value {
                    color: #667eea;
                    font-weight: bold;
                }
                
                .afk-slider {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: #2d3748;
                    outline: none;
                    -webkit-appearance: none;
                }
                
                .afk-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #667eea;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                
                .afk-button-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin: 20px 0;
                }
                
                .afk-btn {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    color: white;
                }
                
                .afk-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }
                
                .afk-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .afk-btn-success {
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                }
                
                .afk-btn-warning {
                    background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
                }
                
                .afk-btn-danger {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                }
                
                .afk-btn-secondary {
                    background: #4a5568;
                }
                
                .afk-preset-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin: 15px 0;
                }
                
                .afk-preset-btn {
                    padding: 8px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    color: white;
                    transition: all 0.2s ease;
                }
                
                .afk-preset-btn:hover {
                    opacity: 0.9;
                    transform: scale(1.05);
                }
                
                /* Modified Price Styling */
                .afk-original-price {
                    text-decoration: line-through !important;
                    opacity: 0.6 !important;
                    color: #e74c3c !important;
                    margin-right: 5px !important;
                }
                
                .afk-modified-price {
                    color: #27ae60 !important;
                    font-weight: bold !important;
                }
                
                /* Toggle Switch */
                .afk-toggle {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                    margin: 0 10px;
                }
                
                .afk-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .afk-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #4a5568;
                    transition: .4s;
                    border-radius: 34px;
                }
                
                .afk-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                
                .afk-toggle input:checked + .afk-toggle-slider {
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                }
                
                .afk-toggle input:checked + .afk-toggle-slider:before {
                    transform: translateX(26px);
                }
            `;

            GM_addStyle(css);
        }

        // =============== FLOATING MENU ===============
        createFloatingMenu() {
            const floatingBtn = document.createElement('div');
            floatingBtn.id = 'afk-helper-floating-btn';
            floatingBtn.innerHTML = '💰';
            floatingBtn.title = 'Shop Helper (Click to open)';
            
            floatingBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.isAuthenticated) {
                    this.toggleControlPanel();
                } else {
                    this.showAuthModal();
                }
            });
            
            document.body.appendChild(floatingBtn);
            this.floatingBtn = floatingBtn;
            
            // Make draggable
            this.makeDraggable(floatingBtn);
        }

        makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            element.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                
                // Add dragging class
                element.style.opacity = '0.8';
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                // Calculate new position
                let newTop = element.offsetTop - pos2;
                let newLeft = element.offsetLeft - pos1;
                
                // Keep within window bounds
                const maxTop = window.innerHeight - element.offsetHeight;
                const maxLeft = window.innerWidth - element.offsetWidth;
                
                newTop = Math.max(0, Math.min(newTop, maxTop));
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                
                element.style.top = newTop + "px";
                element.style.left = newLeft + "px";
                element.style.right = "auto";
                element.style.bottom = "auto";
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                element.style.opacity = '1';
            }
        }

        // =============== AUTHENTICATION ===============
        showAuthModal() {
            // Remove existing modal
            this.removeAuthModal();
            
            const modal = document.createElement('div');
            modal.className = 'afk-auth-modal';
            modal.innerHTML = `
                <div class="afk-auth-content">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="font-size: 40px; margin-bottom: 10px;">🔐</div>
                        <h3 style="margin: 0 0 5px 0; color: white;">Supporter Access</h3>
                        <div style="color: #8892b0; font-size: 12px;">Internal tool - Version ${CONFIG.VERSION}</div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <input type="password" id="afk-auth-password" 
                               placeholder="Enter supporter password" 
                               style="width: 100%; padding: 12px 15px; border-radius: 8px; 
                                      border: 1px solid #4a5568; background: #0f172a; 
                                      color: white; font-size: 14px; outline: none;"
                               autocomplete="off">
                        <div id="afk-auth-error" style="color: #e74c3c; font-size: 12px; margin-top: 5px; height: 18px;"></div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button id="afk-auth-submit" class="afk-btn afk-btn-primary">Access</button>
                        <button id="afk-auth-cancel" class="afk-btn afk-btn-secondary">Cancel</button>
                    </div>
                    
                    <div style="margin-top: 20px; font-size: 11px; color: #4a5568; text-align: center;">
                        For internal supporter team use only
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('afk-auth-submit').addEventListener('click', () => this.checkPassword());
            document.getElementById('afk-auth-cancel').addEventListener('click', () => this.removeAuthModal());
            
            // Enter key support
            document.getElementById('afk-auth-password').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkPassword();
            });
            
            // Auto-focus
            setTimeout(() => {
                document.getElementById('afk-auth-password').focus();
            }, 100);
            
            this.authModal = modal;
        }

        checkPassword() {
            const input = document.getElementById('afk-auth-password');
            const errorDiv = document.getElementById('afk-auth-error');
            
            if (!input) return;
            
            const password = input.value.trim();
            
            // Check password
            if (password === CONFIG.PASSWORD) {
                this.isAuthenticated = true;
                this.floatingBtn.classList.add('active');
                this.floatingBtn.innerHTML = '🛒';
                this.floatingBtn.title = 'Shop Helper (Authenticated)';
                
                // Save authentication state
                localStorage.setItem('afk_helper_authenticated', 'true');
                localStorage.setItem('afk_helper_password', password);
                
                // Remove modal
                this.removeAuthModal();
                
                // Show control panel
                setTimeout(() => {
                    this.showControlPanel();
                }, 300);
                
                // Show welcome message
                this.showNotification('🔓 Access Granted', 'Welcome, supporter!');
                
            } else {
                errorDiv.textContent = 'Invalid password';
                input.style.borderColor = '#e74c3c';
                input.value = '';
                
                setTimeout(() => {
                    errorDiv.textContent = '';
                    input.style.borderColor = '#4a5568';
                }, 2000);
            }
        }

        authenticateWithSaved() {
            const savedPassword = localStorage.getItem('afk_helper_password');
            if (savedPassword === CONFIG.PASSWORD) {
                this.isAuthenticated = true;
                this.floatingBtn.classList.add('active');
                this.floatingBtn.innerHTML = '🛒';
                this.floatingBtn.title = 'Shop Helper (Authenticated)';
                
                console.log('🔓 Auto-authenticated from saved session');
            }
        }

        removeAuthModal() {
            if (this.authModal) {
                this.authModal.remove();
                this.authModal = null;
            }
        }

        logout() {
            this.isAuthenticated = false;
            this.floatingBtn.classList.remove('active');
            this.floatingBtn.innerHTML = '💰';
            this.floatingBtn.title = 'Shop Helper (Click to open)';
            
            // Remove control panel
            this.removeControlPanel();
            
            // Clear saved auth
            localStorage.removeItem('afk_helper_authenticated');
            localStorage.removeItem('afk_helper_password');
            
            // Reset settings
            this.settings.active = false;
            this.saveSettings();
            
            // Restore original prices
            this.restoreOriginalPrices();
            
            this.showNotification('👋 Logged Out', 'Supporter session ended');
        }

        // =============== CONTROL PANEL ===============
        showControlPanel() {
            // Remove existing panel
            this.removeControlPanel();
            
            const panel = document.createElement('div');
            panel.className = 'afk-control-panel';
            panel.innerHTML = `
                <div class="afk-panel-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">🛒</span>
                        <div>
                            <div style="font-weight: bold; color: white;">Shop Helper</div>
                            <div style="font-size: 11px; color: #8892b0;">v${CONFIG.VERSION}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button id="afk-panel-minimize" style="
                            background: none;
                            border: none;
                            color: #cbd5e0;
                            cursor: pointer;
                            padding: 5px;
                            font-size: 16px;
                        ">−</button>
                        <button id="afk-panel-close" style="
                            background: none;
                            border: none;
                            color: #cbd5e0;
                            cursor: pointer;
                            padding: 5px;
                            font-size: 16px;
                        ">×</button>
                    </div>
                </div>
                
                <div class="afk-panel-body">
                    <div class="afk-slider-container">
                        <div class="afk-slider-label">
                            <span>Price Multiplier:</span>
                            <span id="afk-multiplier-value" class="afk-slider-value">x${this.settings.priceMultiplier}</span>
                        </div>
                        <input type="range" class="afk-slider" id="afk-price-multiplier" 
                               min="0" max="2" step="0.1" value="${this.settings.priceMultiplier}">
                    </div>
                    
                    <div class="afk-slider-container">
                        <div class="afk-slider-label">
                            <span>Discount:</span>
                            <span id="afk-discount-value" class="afk-slider-value">${this.settings.discount}%</span>
                        </div>
                        <input type="range" class="afk-slider" id="afk-discount-slider" 
                               min="0" max="100" step="5" value="${this.settings.discount}">
                    </div>
                    
                    <div style="margin: 20px 0; display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #cbd5e0; font-size: 14px;">Unlimited Stock:</span>
                        <label class="afk-toggle">
                            <input type="checkbox" id="afk-unlimited-stock" ${this.settings.unlimitedStock ? 'checked' : ''}>
                            <span class="afk-toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div style="margin: 20px 0; display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #cbd5e0; font-size: 14px;">Active Modifications:</span>
                        <label class="afk-toggle">
                            <input type="checkbox" id="afk-active-toggle" ${this.settings.active ? 'checked' : ''}>
                            <span class="afk-toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div style="margin: 25px 0;">
                        <div style="color: #8892b0; font-size: 12px; margin-bottom: 10px; text-align: center;">QUICK PRESETS</div>
                        <div class="afk-preset-grid">
                            <button class="afk-preset-btn" data-preset="free" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">FREE</button>
                            <button class="afk-preset-btn" data-preset="half" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);">50% OFF</button>
                            <button class="afk-preset-btn" data-preset="test" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">TEST</button>
                            <button class="afk-preset-btn" data-preset="normal" style="background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);">NORMAL</button>
                        </div>
                    </div>
                    
                    <div class="afk-button-group">
                        <button id="afk-apply-btn" class="afk-btn afk-btn-success">Apply Now</button>
                        <button id="afk-reset-btn" class="afk-btn afk-btn-warning">Reset</button>
                    </div>
                    
                    <div style="margin-top: 20px; border-top: 1px solid #2d3748; padding-top: 15px;">
                        <button id="afk-logout-btn" class="afk-btn afk-btn-danger" style="width: 100%;">Logout</button>
                        <div style="font-size: 10px; color: #4a5568; text-align: center; margin-top: 10px;">
                            Changes are visual only
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // Make draggable
            this.makePanelDraggable(panel);
            
            // Add event listeners
            this.setupPanelEvents(panel);
            
            this.controlPanel = panel;
            
            // Apply current settings if active
            if (this.settings.active) {
                setTimeout(() => this.applyModifications(), 500);
            }
        }

        makePanelDraggable(panel) {
            const header = panel.querySelector('.afk-panel-header');
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            header.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                
                panel.style.opacity = '0.9';
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                // Calculate new position
                let newTop = panel.offsetTop - pos2;
                let newLeft = panel.offsetLeft - pos1;
                
                // Keep within window bounds
                const maxTop = window.innerHeight - panel.offsetHeight;
                const maxLeft = window.innerWidth - panel.offsetWidth;
                
                newTop = Math.max(0, Math.min(newTop, maxTop));
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                
                panel.style.top = newTop + "px";
                panel.style.left = newLeft + "px";
                panel.style.right = "auto";
                panel.style.bottom = "auto";
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                panel.style.opacity = '1';
            }
        }

        setupPanelEvents(panel) {
            // Close button
            panel.querySelector('#afk-panel-close').addEventListener('click', () => {
                this.removeControlPanel();
            });
            
            // Minimize button
            panel.querySelector('#afk-panel-minimize').addEventListener('click', () => {
                const body = panel.querySelector('.afk-panel-body');
                body.style.display = body.style.display === 'none' ? 'block' : 'none';
            });
            
            // Sliders
            const priceSlider = panel.querySelector('#afk-price-multiplier');
            const discountSlider = panel.querySelector('#afk-discount-slider');
            
            priceSlider.addEventListener('input', (e) => {
                this.settings.priceMultiplier = parseFloat(e.target.value);
                panel.querySelector('#afk-multiplier-value').textContent = `x${e.target.value}`;
                this.saveSettings();
            });
            
            discountSlider.addEventListener('input', (e) => {
                this.settings.discount = parseInt(e.target.value);
                panel.querySelector('#afk-discount-value').textContent = `${e.target.value}%`;
                this.saveSettings();
            });
            
            // Toggles
            panel.querySelector('#afk-unlimited-stock').addEventListener('change', (e) => {
                this.settings.unlimitedStock = e.target.checked;
                this.saveSettings();
            });
            
            panel.querySelector('#afk-active-toggle').addEventListener('change', (e) => {
                this.settings.active = e.target.checked;
                this.saveSettings();
                
                if (this.settings.active) {
                    this.applyModifications();
                } else {
                    this.restoreOriginalPrices();
                }
            });
            
            // Preset buttons
            panel.querySelectorAll('.afk-preset-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const preset = e.target.dataset.preset;
                    this.applyPreset(preset);
                });
            });
            
            // Apply button
            panel.querySelector('#afk-apply-btn').addEventListener('click', () => {
                this.applyModifications();
                this.showNotification('✅ Applied', 'Modifications applied to shop prices');
            });
            
            // Reset button
            panel.querySelector('#afk-reset-btn').addEventListener('click', () => {
                this.resetSettings();
            });
            
            // Logout button
            panel.querySelector('#afk-logout-btn').addEventListener('click', () => {
                this.logout();
            });
        }

        toggleControlPanel() {
            if (this.controlPanel) {
                this.removeControlPanel();
            } else {
                this.showControlPanel();
            }
        }

        removeControlPanel() {
            if (this.controlPanel) {
                this.controlPanel.remove();
                this.controlPanel = null;
            }
        }

        // =============== SETTINGS MANAGEMENT ===============
        loadSettings() {
            try {
                const saved = localStorage.getItem('afk_helper_settings');
                if (saved) {
                    this.settings = { ...this.settings, ...JSON.parse(saved) };
                }
            } catch (e) {
                console.log('Could not load settings:', e);
            }
        }

        saveSettings() {
            try {
                localStorage.setItem('afk_helper_settings', JSON.stringify(this.settings));
            } catch (e) {
                console.log('Could not save settings:', e);
            }
        }

        resetSettings() {
            this.settings = {
                priceMultiplier: 1.0,
                discount: 0,
                unlimitedStock: false,
                active: false
            };
            
            this.saveSettings();
            
            // Update UI if panel is open
            if (this.controlPanel) {
                this.controlPanel.querySelector('#afk-price-multiplier').value = this.settings.priceMultiplier;
                this.controlPanel.querySelector('#afk-multiplier-value').textContent = `x${this.settings.priceMultiplier}`;
                
                this.controlPanel.querySelector('#afk-discount-slider').value = this.settings.discount;
                this.controlPanel.querySelector('#afk-discount-value').textContent = `${this.settings.discount}%`;
                
                this.controlPanel.querySelector('#afk-unlimited-stock').checked = this.settings.unlimitedStock;
                this.controlPanel.querySelector('#afk-active-toggle').checked = this.settings.active;
            }
            
            // Restore prices
            this.restoreOriginalPrices();
            
            this.showNotification('🔄 Reset', 'Settings restored to default');
        }

        // =============== PRESETS ===============
        applyPreset(preset) {
            const presets = {
                free: { multiplier: 0, discount: 100, stock: true },
                half: { multiplier: 0.5, discount: 50, stock: false },
                test: { multiplier: 0.1, discount: 90, stock: true },
                normal: { multiplier: 1.0, discount: 0, stock: false }
            };
            
            if (presets[preset]) {
                const p = presets[preset];
                this.settings.priceMultiplier = p.multiplier;
                this.settings.discount = p.discount;
                this.settings.unlimitedStock = p.stock;
                this.settings.active = true;
                
                // Update UI
                if (this.controlPanel) {
                    this.controlPanel.querySelector('#afk-price-multiplier').value = this.settings.priceMultiplier;
                    this.controlPanel.querySelector('#afk-multiplier-value').textContent = `x${this.settings.priceMultiplier}`;
                    
                    this.controlPanel.querySelector('#afk-discount-slider').value = this.settings.discount;
                    this.controlPanel.querySelector('#afk-discount-value').textContent = `${this.settings.discount}%`;
                    
                    this.controlPanel.querySelector('#afk-unlimited-stock').checked = this.settings.unlimitedStock;
                    this.controlPanel.querySelector('#afk-active-toggle').checked = this.settings.active;
                }
                
                this.saveSettings();
                this.applyModifications();
                
                this.showNotification('🎮 Preset Applied', `${preset.toUpperCase()} settings loaded`);
            }
        }

        // =============== PRICE MODIFICATION ===============
        applyModifications() {
            if (!this.settings.active) return;
            
            // Find all price elements
            this.modifyAllPrices();
            
            // Add visual indicators
            this.addVisualIndicators();
            
            // Setup observer for dynamic content
            this.setupPriceObserver();
            
            console.log(`✅ Modified prices with multiplier: x${this.settings.priceMultiplier}`);
        }

        modifyAllPrices() {
            // Common price selectors for AFK games
            const priceSelectors = [
                // Class-based selectors
                '.price', '.cost', '.gold', '.diamond', '.gem',
                '.coin', '.currency', '.money', '.value',
                '.item-price', '.shop-price', '.buy-price',
                '.price-text', '.cost-text', '.gold-text',
                
                // ID-based selectors
                '[id*="price"]', '[id*="cost"]', '[id*="gold"]',
                '[id*="diamond"]', '[id*="coin"]',
                
                // Attribute-based selectors
                '[class*="price"]', '[class*="cost"]', '[class*="gold"]',
                '[class*="diamond"]', '[class*="currency"]'
            ];
            
            priceSelectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(element => {
                        this.modifyElementPrice(element);
                    });
                } catch (e) {
                    // Ignore selector errors
                }
            });
        }

        modifyElementPrice(element) {
            // Skip if already modified or not a text element
            if (element.hasAttribute('data-afk-modified') || 
                element.tagName === 'IMG' || 
                element.tagName === 'INPUT') {
                return;
            }
            
            const text = element.textContent || element.innerText;
            if (!text || text.length > 50) return; // Skip long text
            
            // Find numbers that look like prices
            const priceRegex = /[\d,]+(?:\.[\d]{2})?/g;
            const matches = text.match(priceRegex);
            if (!matches) return;
            
            let modified = false;
            let newHtml = element.innerHTML;
            
            matches.forEach(match => {
                // Clean the number (remove commas, etc)
                const cleanNum = parseInt(match.replace(/[^0-9]/g, ''));
                
                // Check if this looks like a price (reasonable range for game prices)
                if (cleanNum > 0 && cleanNum < 10000000) {
                    const newPrice = Math.round(cleanNum * this.settings.priceMultiplier);
                    
                    if (newPrice !== cleanNum) {
                        // Replace in HTML
                        const originalDisplay = match;
                        const modifiedDisplay = match.replace(cleanNum.toString(), newPrice.toString());
                        
                        newHtml = newHtml.replace(
                            originalDisplay,
                            `<span class="afk-original-price">${originalDisplay}</span>` +
                            `<span class="afk-modified-price">${modifiedDisplay}</span>`
                        );
                        
                        modified = true;
                        
                        // Store original data
                        element.setAttribute('data-afk-original', text);
                        element.setAttribute('data-afk-original-price', cleanNum);
                        element.setAttribute('data-afk-modified-price', newPrice);
                    }
                }
            });
            
            if (modified) {
                element.innerHTML = newHtml;
                element.setAttribute('data-afk-modified', 'true');
            }
        }

        restoreOriginalPrices() {
            document.querySelectorAll('[data-afk-modified]').forEach(element => {
                const original = element.getAttribute('data-afk-original');
                if (original) {
                    element.innerHTML = original;
                }
                element.removeAttribute('data-afk-modified');
                element.removeAttribute('data-afk-original');
                element.removeAttribute('data-afk-original-price');
                element.removeAttribute('data-afk-modified-price');
            });
            
            // Remove indicators
            document.querySelectorAll('.afk-price-indicator').forEach(el => el.remove());
        }

        addVisualIndicators() {
            // Add small indicator to shop buttons
            const shopButtons = document.querySelectorAll('button, .btn, [class*="button"], [class*="btn"]');
            shopButtons.forEach(btn => {
                const text = btn.textContent || '';
                if (text.match(/buy|purchase|shop|store|price|cost/i)) {
                    if (!btn.querySelector('.afk-price-indicator')) {
                        const indicator = document.createElement('span');
                        indicator.className = 'afk-price-indicator';
                        indicator.textContent = '💰';
                        indicator.style.cssText = `
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            background: #27ae60;
                            color: white;
                            border-radius: 50%;
                            width: 16px;
                            height: 16px;
                            font-size: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 100;
                        `;
                        btn.style.position = 'relative';
                        btn.appendChild(indicator);
                    }
                }
            });
        }

        setupPriceObserver() {
            // Observe for new price elements being added
            if (this.priceObserver) {
                this.priceObserver.disconnect();
            }
            
            this.priceObserver = new MutationObserver((mutations) => {
                if (this.settings.active) {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                // Check the node itself
                                if (node.matches && (node.matches('.price, .cost, [class*="price"], [class*="cost"]') || 
                                    node.textContent.match(/[\d,]+(?:\.[\d]{2})?/))) {
                                    this.modifyElementPrice(node);
                                }
                                
                                // Check children
                                if (node.querySelectorAll) {
                                    node.querySelectorAll('.price, .cost, [class*="price"], [class*="cost"]').forEach(el => {
                                        this.modifyElementPrice(el);
                                    });
                                }
                            }
                        });
                    });
                }
            });
            
            this.priceObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // =============== UTILITIES ===============
        showNotification(title, message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 99999;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
                <div style="font-size: 13px; color: #cbd5e0;">${message}</div>
            `;
            
            // Add CSS for animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                
                // Add slideOut animation
                const slideOutStyle = document.createElement('style');
                slideOutStyle.textContent = `
                    @keyframes slideOut {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                    }
                `;
                document.head.appendChild(slideOutStyle);
                
                setTimeout(() => {
                    notification.remove();
                    style.remove();
                    slideOutStyle.remove();
                }, 300);
            }, 3000);
        }

        // =============== CLEANUP ===============
        destroy() {
            this.removeAuthModal();
            this.removeControlPanel();
            
            if (this.floatingBtn) {
                this.floatingBtn.remove();
            }
            
            if (this.priceObserver) {
                this.priceObserver.disconnect();
            }
            
            this.restoreOriginalPrices();
            
            console.log('🧹 Simple Shop Helper destroyed');
        }
    }

    // ============================================
    // MAIN EXECUTION
    // ============================================
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHelper);
    } else {
        initHelper();
    }

    function initHelper() {
        // Start the helper
        window.afkShopHelper = new SimpleShopHelper();
        
        // Expose to console for debugging
        window.SHOP_HELPER = window.afkShopHelper;
        
        // Add console commands
        console.log(`%c🛒 Anime AFK Shop Helper Commands:
• SHOP_HELPER.showControlPanel() - Show control panel
• SHOP_HELPER.applyPreset('free') - Apply FREE preset
• SHOP_HELPER.logout() - Logout from tool
• SHOP_HELPER.destroy() - Remove tool completely`, 
        'background: #1a1a2e; color: #667eea; padding: 10px; border-radius: 5px;');
    }

})();
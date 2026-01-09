// ==UserScript==
// @name         Anime AFK - Shop Supporter Tool
// @namespace    https://animeafk.xyz/
// @version      3.0.0
// @description  Internal shop management tool for supporters (NOT for players)
// @author       Support Team
// @match        https://animeafk.xyz/*
// @match        http://animeafk.xyz/*
// @match        *://*.animeafk.xyz/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://animeafk.xyz/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/561948/Anime%20AFK%20-%20Shop%20Supporter%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/561948/Anime%20AFK%20-%20Shop%20Supporter%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        PASSWORD: 'AFK_SUPPORTER_2024', // Password for internal use
        VERSION: '3.0.0',
        DEBUG: true,
        AUTO_START: false,
        PERSIST_SETTINGS: true
    };

    // ============================================
    // SHOP SUPPORTER TOOL CLASS
    // ============================================
    class ShopSupporterTool {
        constructor() {
            this.settings = this.loadSettings();
            this.isAuthenticated = false;
            this.hooksInstalled = false;
            this.uiCreated = false;
            this.originalAPIs = {};
            this.shopElements = new Map();
            this.init();
        }

        // =============== INITIALIZATION ===============
        init() {
            console.log(`%c🎮 Anime AFK Supporter Tool v${CONFIG.VERSION}`, 
                       'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
            
            this.waitForGameLoad().then(() => {
                this.authenticate();
            });
        }

        waitForGameLoad() {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                    // Fallback timeout
                    setTimeout(resolve, 5000);
                }
            });
        }

        // =============== AUTHENTICATION ===============
        authenticate() {
            // Check if already authenticated in this session
            const sessionAuth = sessionStorage.getItem('afk_supporter_authenticated');
            if (sessionAuth === 'true') {
                this.isAuthenticated = true;
                this.startTool();
                return;
            }

            // Show authentication modal
            this.showAuthModal();
        }

        showAuthModal() {
            // Create modal
            const modal = document.createElement('div');
            modal.id = 'supporter-auth-modal';
            modal.innerHTML = `
                <div class="modal-overlay" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                ">
                    <div class="modal-content" style="
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 15px;
                        max-width: 400px;
                        width: 90%;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                        border: 2px solid #667eea;
                    ">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 24px; color: #667eea; margin-bottom: 5px;">🔒</div>
                            <h2 style="margin: 0 0 10px 0; color: #fff;">Supporter Access</h2>
                            <div style="font-size: 12px; color: #8892b0; margin-bottom: 20px;">
                                Internal tool for support team only
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="password" id="supporter-password" placeholder="Enter supporter password" 
                                   style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #333; 
                                          background: #0f3460; color: white; font-size: 14px; outline: none;">
                            <div id="auth-error" style="color: #ff6b6b; font-size: 12px; margin-top: 5px; display: none;">
                                Invalid password
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <button id="auth-submit" style="
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 8px;
                                font-weight: bold;
                                cursor: pointer;
                            ">Access Tool</button>
                            
                            <button id="auth-cancel" style="
                                background: #333;
                                color: #ccc;
                                border: 1px solid #444;
                                padding: 12px;
                                border-radius: 8px;
                                cursor: pointer;
                            ">Cancel</button>
                        </div>
                        
                        <div style="margin-top: 20px; font-size: 10px; color: #556; text-align: center;">
                            v${CONFIG.VERSION} • animeafk.xyz
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Add event listeners
            document.getElementById('auth-submit').addEventListener('click', () => this.checkPassword());
            document.getElementById('auth-cancel').addEventListener('click', () => this.removeAuthModal());
            
            // Enter key support
            document.getElementById('supporter-password').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkPassword();
            });
        }

        checkPassword() {
            const input = document.getElementById('supporter-password');
            const errorDiv = document.getElementById('auth-error');
            
            if (input.value === CONFIG.PASSWORD) {
                this.isAuthenticated = true;
                sessionStorage.setItem('afk_supporter_authenticated', 'true');
                this.removeAuthModal();
                this.startTool();
                
                // Show welcome notification
                this.showNotification('🔓 Access granted', 'Supporter tool activated', 'success');
            } else {
                errorDiv.style.display = 'block';
                input.style.borderColor = '#ff6b6b';
                input.value = '';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                    input.style.borderColor = '#333';
                }, 2000);
            }
        }

        removeAuthModal() {
            const modal = document.getElementById('supporter-auth-modal');
            if (modal) modal.remove();
        }

        // =============== SETTINGS MANAGEMENT ===============
        loadSettings() {
            const defaultSettings = {
                active: true,
                priceMultiplier: 1.0,
                discountPercentage: 0,
                unlimitedStock: false,
                autoApply: true,
                uiVisible: true,
                presets: {
                    free: { multiplier: 0, discount: 100, stock: true },
                    halfPrice: { multiplier: 0.5, discount: 50, stock: false },
                    test: { multiplier: 0.1, discount: 90, stock: true },
                    double: { multiplier: 2.0, discount: 0, stock: false }
                }
            };

            if (CONFIG.PERSIST_SETTINGS) {
                const saved = GM_getValue('afk_supporter_settings');
                return saved ? { ...defaultSettings, ...saved } : defaultSettings;
            }
            
            return defaultSettings;
        }

        saveSettings() {
            if (CONFIG.PERSIST_SETTINGS) {
                GM_setValue('afk_supporter_settings', this.settings);
            }
        }

        // =============== TOOL STARTUP ===============
        startTool() {
            if (!this.isAuthenticated) return;

            console.log('%c🛠️ Starting Anime AFK Supporter Tool...', 'color: #667eea; font-weight: bold;');
            
            // 1. Install hooks
            this.installHooks();
            
            // 2. Create UI
            this.createUI();
            
            // 3. Apply initial settings
            if (this.settings.autoApply) {
                setTimeout(() => this.applyModifications(), 1000);
            }
            
            // 4. Listen for shop changes
            this.setupObservers();
            
            // 5. Add global shortcuts
            this.addShortcuts();
            
            console.log('%c✅ Tool ready! Use ALT+S to toggle UI', 'color: #27ae60; font-weight: bold;');
        }

        // =============== HOOK INSTALLATION ===============
        installHooks() {
            if (this.hooksInstalled) return;

            // Hook fetch API
            this.originalAPIs.fetch = window.fetch;
            window.fetch = (...args) => {
                return this.originalAPIs.fetch.apply(this, args)
                    .then(response => this.interceptResponse(response, args[0]));
            };

            // Hook XMLHttpRequest
            this.originalAPIs.XMLHttpRequest = window.XMLHttpRequest.prototype.open;
            window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                this._requestUrl = url;
                this._requestMethod = method;
                
                const originalAddEventListener = this.addEventListener;
                this.addEventListener = function(type, listener, options) {
                    if (type === 'load' && url.includes('shop')) {
                        const wrappedListener = function() {
                            try {
                                if (this.responseText) {
                                    const data = JSON.parse(this.responseText);
                                    const modified = window.shopSupporter.modifyShopData(data, url);
                                    if (modified !== data) {
                                        Object.defineProperty(this, 'responseText', {
                                            value: JSON.stringify(modified),
                                            writable: false
                                        });
                                    }
                                }
                            } catch(e) {}
                            listener.call(this);
                        };
                        return originalAddEventListener.call(this, type, wrappedListener, options);
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                };
                
                return this.originalAPIs.XMLHttpRequest.apply(this, [method, url, async, user, password]);
            };

            this.hooksInstalled = true;
            if (CONFIG.DEBUG) console.log('🔗 API hooks installed');
        }

        interceptResponse(response, url) {
            if (!this.settings.active || !url || typeof url !== 'string') return response;

            const shopKeywords = ['shop', 'buy', 'price', 'cost', 'item', 'store', 'market', 'mall', 'recharge'];
            const isShopRequest = shopKeywords.some(keyword => 
                url.toLowerCase().includes(keyword)
            );

            if (!isShopRequest) return response;

            return response.clone().json().then(data => {
                const modified = this.modifyShopData(data, url);
                return new Response(JSON.stringify(modified), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }).catch(() => response);
        }

        // =============== DATA MODIFICATION ===============
        modifyShopData(data, url) {
            if (!data || typeof data !== 'object') return data;

            const modified = JSON.parse(JSON.stringify(data));
            
            this.modifyPrices(modified);
            this.modifyStock(modified);
            this.addModificationInfo(modified, url);
            
            return modified;
        }

        modifyPrices(obj) {
            if (!obj || typeof obj !== 'object') return;

            const priceKeys = ['price', 'cost', 'gold', 'diamond', 'gem', 'coin', 'token', 'currency', 'yuanbao'];
            const discountKeys = ['discount', 'sale', 'off', 'percent'];

            for (const key in obj) {
                const value = obj[key];

                // Modify prices
                if (priceKeys.some(k => key.toLowerCase().includes(k))) {
                    if (typeof value === 'number' && value > 0) {
                        obj[key] = Math.round(value * this.settings.priceMultiplier);
                        if (CONFIG.DEBUG) {
                            obj[`_original_${key}`] = value;
                        }
                    }
                }

                // Modify discounts
                if (discountKeys.some(k => key.toLowerCase().includes(k))) {
                    if (typeof value === 'number') {
                        obj[key] = this.settings.discountPercentage;
                    }
                }

                // Recursive
                if (value && typeof value === 'object') {
                    this.modifyPrices(value);
                }
            }
        }

        modifyStock(obj) {
            if (!obj || typeof obj !== 'object') return;

            const stockKeys = ['stock', 'quantity', 'limit', 'count', 'amount', 'remaining'];

            for (const key in obj) {
                const value = obj[key];

                if (this.settings.unlimitedStock && 
                    stockKeys.some(k => key.toLowerCase().includes(k))) {
                    if (typeof value === 'number') {
                        obj[key] = 999999;
                    }
                }

                if (value && typeof value === 'object') {
                    this.modifyStock(value);
                }
            }
        }

        addModificationInfo(obj, url) {
            if (!CONFIG.DEBUG) return;

            obj._supporter_tool = {
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                url: url,
                config: {
                    multiplier: this.settings.priceMultiplier,
                    discount: this.settings.discountPercentage,
                    unlimitedStock: this.settings.unlimitedStock
                }
            };
        }

        // =============== UI MODIFICATION ===============
        applyModifications() {
            if (!this.settings.active) return;

            // Modify UI prices
            this.modifyUIPrices();
            
            // Add visual indicators
            this.addVisualIndicators();
            
            // Update UI controls
            this.updateUIControls();
        }

        modifyUIPrices() {
            // Common price selectors for anime AFK games
            const selectors = [
                '.price', '.cost', '.gold-text', '.diamond-text',
                '.currency', '.price-text', '.item-price',
                '[class*="price"]', '[class*="cost"]', '[class*="gold"]',
                '[id*="price"]', '[id*="cost"]',
                '.shop-item .price', '.store-item .cost',
                '.recharge-price', '.vip-price'
            ];

            selectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(element => {
                        this.modifyElementPrice(element);
                    });
                } catch(e) {}
            });
        }

        modifyElementPrice(element) {
            const text = element.textContent || element.innerText;
            if (!text) return;

            // Find numbers in text (prices)
            const priceRegex = /[\d,]+(?:\.[\d]{2})?/g;
            const matches = text.match(priceRegex);
            if (!matches) return;

            let newHtml = element.innerHTML;
            matches.forEach(match => {
                const cleanNum = parseInt(match.replace(/[^0-9]/g, ''));
                if (cleanNum > 0 && cleanNum < 10000000) {
                    const newPrice = Math.round(cleanNum * this.settings.priceMultiplier);
                    if (newPrice !== cleanNum) {
                        const originalDisplay = match;
                        const modifiedDisplay = match.replace(cleanNum.toString(), newPrice.toString());
                        
                        newHtml = newHtml.replace(
                            originalDisplay,
                            `<span class="supporter-original-price" style="text-decoration: line-through; opacity: 0.6; color: #e74c3c;">${originalDisplay}</span> ` +
                            `<span class="supporter-modified-price" style="color: #27ae60; font-weight: bold;">${modifiedDisplay}</span>`
                        );
                        
                        element.setAttribute('data-supporter-modified', 'true');
                        element.setAttribute('data-original-price', cleanNum);
                        element.setAttribute('data-modified-price', newPrice);
                    }
                }
            });

            element.innerHTML = newHtml;
        }

        addVisualIndicators() {
            // Add indicator to shop buttons
            document.querySelectorAll('.shop-button, .buy-button, .purchase-btn').forEach(btn => {
                if (!btn.hasAttribute('data-supporter-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.textContent = '💰';
                    indicator.setAttribute('data-supporter-indicator', 'true');
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
            });
        }

        // =============== UI CREATION ===============
        createUI() {
            if (this.uiCreated) return;

            // Add CSS styles
            this.addStyles();

            // Create control panel
            this.createControlPanel();

            this.uiCreated = true;
        }

        addStyles() {
            const css = `
                #supporter-control-panel {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    transition: all 0.3s ease;
                }
                
                .supporter-original-price {
                    text-decoration: line-through !important;
                    opacity: 0.6 !important;
                    color: #e74c3c !important;
                }
                
                .supporter-modified-price {
                    color: #27ae60 !important;
                    font-weight: bold !important;
                }
                
                .supporter-shop-item {
                    border: 2px solid #27ae60 !important;
                    position: relative;
                }
                
                .supporter-shop-item::before {
                    content: "💰";
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    font-size: 12px;
                    z-index: 10;
                }
            `;

            GM_addStyle(css);
        }

        createControlPanel() {
            const panel = document.createElement('div');
            panel.id = 'supporter-control-panel';
            panel.innerHTML = `
                <div class="panel-header" style="
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: white;
                    padding: 12px 15px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                    border-bottom: 2px solid #667eea;
                ">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 18px;">🎮</span>
                        <div>
                            <div style="font-weight: bold; font-size: 14px;">Anime AFK Supporter</div>
                            <div style="font-size: 10px; color: #8892b0;">v${CONFIG.VERSION}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="panel-btn minimize" title="Minimize" style="
                            background: #2d3748;
                            border: none;
                            color: white;
                            width: 25px;
                            height: 25px;
                            border-radius: 4px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">−</button>
                        <button class="panel-btn close" title="Close" style="
                            background: #e53e3e;
                            border: none;
                            color: white;
                            width: 25px;
                            height: 25px;
                            border-radius: 4px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">×</button>
                    </div>
                </div>
                
                <div class="panel-body" style="
                    background: #0f172a;
                    color: #cbd5e0;
                    padding: 15px;
                    border-radius: 0 0 10px 10px;
                    max-height: 500px;
                    overflow-y: auto;
                ">
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 13px;">Price Multiplier:</span>
                            <span id="multiplier-value" style="color: #667eea; font-weight: bold;">x${this.settings.priceMultiplier}</span>
                        </div>
                        <input type="range" id="price-multiplier" min="0" max="2" step="0.1" value="${this.settings.priceMultiplier}" 
                               style="width: 100%; height: 6px; border-radius: 3px; background: #1e293b; outline: none;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 13px;">Discount (%):</span>
                            <span id="discount-value" style="color: #667eea; font-weight: bold;">${this.settings.discountPercentage}%</span>
                        </div>
                        <input type="range" id="discount-slider" min="0" max="100" step="5" value="${this.settings.discountPercentage}" 
                               style="width: 100%; height: 6px; border-radius: 3px; background: #1e293b; outline: none;">
                    </div>
                    
                    <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="toggle-stock" class="panel-action-btn" style="
                            background: ${this.settings.unlimitedStock ? '#27ae60' : '#4a5568'};
                            border: none;
                            color: white;
                            padding: 8px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            ${this.settings.unlimitedStock ? '✓' : '✗'} Unlimited Stock
                        </button>
                        <button id="toggle-active" class="panel-action-btn" style="
                            background: ${this.settings.active ? '#27ae60' : '#4a5568'};
                            border: none;
                            color: white;
                            padding: 8px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            ${this.settings.active ? '✓' : '✗'} Active
                        </button>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 12px; color: #8892b0; margin-bottom: 8px;">Quick Presets:</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                            <button class="preset-btn" data-preset="free" style="
                                background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                                border: none;
                                color: white;
                                padding: 8px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">FREE</button>
                            <button class="preset-btn" data-preset="half" style="
                                background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                                border: none;
                                color: white;
                                padding: 8px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">50% OFF</button>
                            <button class="preset-btn" data-preset="test" style="
                                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                                border: none;
                                color: white;
                                padding: 8px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">TEST</button>
                            <button class="preset-btn" data-preset="normal" style="
                                background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
                                border: none;
                                color: white;
                                padding: 8px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                            ">NORMAL</button>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <button id="apply-now" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border: none;
                            color: white;
                            padding: 10px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                            width: 100%;
                            font-size: 13px;
                        ">Apply Now</button>
                    </div>
                    
                    <div style="border-top: 1px solid #2d3748; padding-top: 10px;">
                        <div style="font-size: 11px; color: #718096; margin-bottom: 5px;">Stats:</div>
                        <div id="tool-stats" style="font-size: 10px; color: #a0aec0;">
                            Modified: 0 items | Active: ${this.settings.active ? 'Yes' : 'No'}
                        </div>
                    </div>
                </div>
            `;

            // Positioning
            panel.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                width: 300px;
                z-index: 999998;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.5);
                display: ${this.settings.uiVisible ? 'block' : 'none'};
            `;

            document.body.appendChild(panel);
            this.setupPanelEvents(panel);
        }

        setupPanelEvents(panel) {
            // Make draggable
            this.makeDraggable(panel);

            // Control buttons
            panel.querySelector('.minimize').addEventListener('click', () => {
                panel.querySelector('.panel-body').style.display = 
                    panel.querySelector('.panel-body').style.display === 'none' ? 'block' : 'none';
            });

            panel.querySelector('.close').addEventListener('click', () => {
                panel.style.display = 'none';
            });

            // Sliders
            panel.querySelector('#price-multiplier').addEventListener('input', (e) => {
                this.settings.priceMultiplier = parseFloat(e.target.value);
                panel.querySelector('#multiplier-value').textContent = `x${e.target.value}`;
                this.saveSettings();
            });

            panel.querySelector('#discount-slider').addEventListener('input', (e) => {
                this.settings.discountPercentage = parseInt(e.target.value);
                panel.querySelector('#discount-value').textContent = `${e.target.value}%`;
                this.saveSettings();
            });

            // Toggle buttons
            panel.querySelector('#toggle-stock').addEventListener('click', () => {
                this.settings.unlimitedStock = !this.settings.unlimitedStock;
                const btn = panel.querySelector('#toggle-stock');
                btn.textContent = `${this.settings.unlimitedStock ? '✓' : '✗'} Unlimited Stock`;
                btn.style.background = this.settings.unlimitedStock ? '#27ae60' : '#4a5568';
                this.saveSettings();
            });

            panel.querySelector('#toggle-active').addEventListener('click', () => {
                this.settings.active = !this.settings.active;
                const btn = panel.querySelector('#toggle-active');
                btn.textContent = `${this.settings.active ? '✓' : '✗'} Active`;
                btn.style.background = this.settings.active ? '#27ae60' : '#4a5568';
                this.saveSettings();
                
                if (this.settings.active) {
                    this.applyModifications();
                } else {
                    this.removeModifications();
                }
            });

            // Preset buttons
            panel.querySelectorAll('.preset-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const preset = e.target.dataset.preset;
                    this.applyPreset(preset);
                });
            });

            // Apply button
            panel.querySelector('#apply-now').addEventListener('click', () => {
                this.applyModifications();
                this.showNotification('✅ Applied', 'Modifications applied to all shops');
            });
        }

        makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const header = element.querySelector('.panel-header');
            
            header.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // =============== PRESETS ===============
        applyPreset(preset) {
            const presets = {
                free: { multiplier: 0, discount: 100, stock: true },
                half: { multiplier: 0.5, discount: 50, stock: false },
                test: { multiplier: 0.1, discount: 90, stock: true },
                normal: { multiplier: 1.0, discount: 0, stock: false },
                double: { multiplier: 2.0, discount: 0, stock: false }
            };

            if (presets[preset]) {
                const p = presets[preset];
                this.settings.priceMultiplier = p.multiplier;
                this.settings.discountPercentage = p.discount;
                this.settings.unlimitedStock = p.stock;
                
                // Update UI
                this.updateUIControls();
                this.applyModifications();
                this.saveSettings();
                
                this.showNotification('🎮 Preset applied', `${preset.toUpperCase()} settings loaded`);
            }
        }

        updateUIControls() {
            const panel = document.getElementById('supporter-control-panel');
            if (!panel) return;

            panel.querySelector('#price-multiplier').value = this.settings.priceMultiplier;
            panel.querySelector('#multiplier-value').textContent = `x${this.settings.priceMultiplier}`;
            
            panel.querySelector('#discount-slider').value = this.settings.discountPercentage;
            panel.querySelector('#discount-value').textContent = `${this.settings.discountPercentage}%`;
            
            const stockBtn = panel.querySelector('#toggle-stock');
            stockBtn.textContent = `${this.settings.unlimitedStock ? '✓' : '✗'} Unlimited Stock`;
            stockBtn.style.background = this.settings.unlimitedStock ? '#27ae60' : '#4a5568';
            
            const activeBtn = panel.querySelector('#toggle-active');
            activeBtn.textContent = `${this.settings.active ? '✓' : '✗'} Active`;
            activeBtn.style.background = this.settings.active ? '#27ae60' : '#4a5568';
        }

        // =============== UTILITIES ===============
        setupObservers() {
            // Observe DOM changes for dynamic shop content
            const observer = new MutationObserver((mutations) => {
                if (this.settings.active) {
                    this.applyModifications();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            this.observer = observer;
        }

        addShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Alt+S to toggle UI
                if (e.altKey && e.key === 's') {
                    e.preventDefault();
                    const panel = document.getElementById('supporter-control-panel');
                    if (panel) {
                        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    }
                }
                
                // Alt+R to refresh modifications
                if (e.altKey && e.key === 'r') {
                    e.preventDefault();
                    this.applyModifications();
                }
            });
        }

        removeModifications() {
            // Remove all visual modifications
            document.querySelectorAll('[data-supporter-modified]').forEach(el => {
                const original = el.getAttribute('data-original-price');
                if (original) {
                    el.innerHTML = el.innerHTML.replace(/<span[^>]*supporter-(original|modified)-price[^>]*>[^<]*<\/span>/g, original);
                }
                el.removeAttribute('data-supporter-modified');
            });
            
            // Remove indicators
            document.querySelectorAll('[data-supporter-indicator]').forEach(el => el.remove());
        }

        showNotification(title, message, type = 'info') {
            if (typeof GM_notification === 'function') {
                GM_notification({
                    title: title,
                    text: message,
                    timeout: 3000
                });
            } else {
                // Fallback to console
                console.log(`%c${title}: ${message}`, 
                    type === 'success' ? 'color: #27ae60;' : 
                    type === 'error' ? 'color: #e74c3c;' : 
                    'color: #3498db;');
            }
        }

        // =============== CLEANUP ===============
        destroy() {
            // Restore original APIs
            if (this.originalAPIs.fetch) {
                window.fetch = this.originalAPIs.fetch;
            }
            
            if (this.originalAPIs.XMLHttpRequest) {
                window.XMLHttpRequest.prototype.open = this.originalAPIs.XMLHttpRequest;
            }
            
            // Remove observers
            if (this.observer) {
                this.observer.disconnect();
            }
            
            // Remove UI
            document.getElementById('supporter-control-panel')?.remove();
            document.getElementById('supporter-auth-modal')?.remove();
            
            // Remove modifications
            this.removeModifications();
            
            // Clear session
            sessionStorage.removeItem('afk_supporter_authenticated');
            
            console.log('%c🧹 Supporter tool destroyed', 'color: #95a5a6;');
        }
    }

    // ============================================
    // MAIN EXECUTION
    // ============================================
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTool);
    } else {
        initTool();
    }

    function initTool() {
        // Create and start the tool
        window.shopSupporter = new ShopSupporterTool();
        
        // Expose to console for debugging
        window.SHOP_SUPPORTER = window.shopSupporter;
        
        // Auto-start if configured
        if (CONFIG.AUTO_START) {
            setTimeout(() => {
                if (window.shopSupporter && !window.shopSupporter.isAuthenticated) {
                    window.shopSupporter.authenticate();
                }
            }, 2000);
        }
    }

    // ============================================
    // CONSOLE COMMANDS
    // ============================================
    // Add helper commands to console
    console.log(`%c🔧 Anime AFK Supporter Commands:
• SHOP_SUPPORTER.applyPreset('free') - Free everything
• SHOP_SUPPORTER.applyPreset('half') - 50% off
• SHOP_SUPPORTER.applyPreset('test') - Test mode
• SHOP_SUPPORTER.applyModifications() - Apply changes
• SHOP_SUPPORTER.destroy() - Remove tool
• ALT+S - Toggle control panel
• ALT+R - Refresh modifications`, 
    'background: #1a1a2e; color: #667eea; padding: 10px; border-radius: 5px;');

})();
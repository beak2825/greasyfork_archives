// ==UserScript==
// @name         Aternos Universal Plugin Loader
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Universal loader for plugins, mods, and custom scripts on Aternos
// @author       You
// @match        https://aternos.org/*
// @match        https://*.aternos.org/*
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @grant        GM.notification
// @grant        GM.info
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554070/Aternos%20Universal%20Plugin%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/554070/Aternos%20Universal%20Plugin%20Loader.meta.js
// ==/UserScript==

class UniversalPluginLoader {
    constructor() {
        this.pluginsLoaded = 0;
        this.totalPlugins = 0;
        this.isInitialized = false;
        this.pluginRegistry = new Map();
        
        this.config = {
            timeout: 30000,
            retryAttempts: 2,
            retryDelay: 1000,
            sequentialLoading: true,
            enablePluginManager: true,
            autoUpdateCheck: false
        };
        
        // Enhanced plugin configuration with types
        this.plugins = Object.freeze([
            // === PLUGIN TYPES EXAMPLES ===
            
            // 1. JAVASCRIPT PLUGINS (Most common)
            {
                name: "Custom Chat Enhancer",
                url: "https://example.com/plugins/chat-enhancer.js",
                type: "script",
                enabled: true,
                description: "Enhances chat functionality"
            },
            
            // 2. CSS/THEME PLUGINS
            {
                name: "Dark Theme",
                url: "https://example.com/themes/dark-theme.css",
                type: "style",
                enabled: true,
                description: "Dark theme for Aternos"
            },
            
            // 3. JSON CONFIGURATION PLUGINS
            {
                name: "Server Settings",
                url: "https://example.com/configs/server-settings.json",
                type: "config",
                enabled: true,
                description: "Custom server configurations"
            },
            
            // 4. HTML WIDGET PLUGINS
            {
                name: "Status Widget",
                url: "https://example.com/widgets/status-widget.html",
                type: "widget",
                enabled: true,
                description: "Server status widget"
            },
            
            // 5. EXTERNAL LIBRARIES
            {
                name: "Utility Library",
                url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js",
                type: "library",
                enabled: true,
                description: "Utility functions library"
            },
            
            // 6. CUSTOM ELEMENTS
            {
                name: "Quick Actions",
                url: "https://example.com/plugins/quick-actions.js",
                type: "custom-element",
                enabled: true,
                description: "Adds quick action buttons"
            }
            
            // Add your actual plugin URLs here
            // Example for Minecraft server plugins:
            // {
            //     name: "EssentialsX Helper",
            //     url: "https://raw.githubusercontent.com/your-repo/essentials-helper/main/plugin.js",
            //     type: "script",
            //     enabled: true
            // }
        ]);
        
        this.bindMethods();
    }

    bindMethods() {
        this.init = this.init.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handlePromiseRejection = this.handlePromiseRejection.bind(this);
        this.showStatusNotification = this.showStatusNotification.bind(this);
        this.togglePlugin = this.togglePlugin.bind(this);
        this.openPluginManager = this.openPluginManager.bind(this);
    }

    async init() {
        if (this.isInitialized) {
            this.log('Loader already initialized', 'warn');
            return;
        }

        try {
            this.isInitialized = true;
            await this.waitForDOMReady();
            await this.waitForAternosInterface();
            await this.loadPlugins();
            await this.injectPluginManager();
            this.setupErrorHandling();
            this.log('Universal Plugin Loader initialized successfully', 'success');
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }

    waitForAternosInterface() {
        const aternosSelectors = [
            '.server-status',
            '.navigation',
            '[class*="aternos"]',
            '[id*="aternos"]',
            'body'
        ];

        return new Promise((resolve) => {
            const checkInterface = () => {
                const isLoaded = aternosSelectors.some(selector => {
                    try {
                        return document.querySelector(selector);
                    } catch (e) {
                        return false;
                    }
                });
                
                if (isLoaded) {
                    resolve();
                } else {
                    setTimeout(checkInterface, 500);
                }
            };
            
            checkInterface();
            setTimeout(resolve, 10000);
        });
    }

    async loadPlugins() {
        if (!this.plugins || !Array.isArray(this.plugins)) {
            this.log('Invalid plugins configuration', 'error');
            return;
        }

        const enabledPlugins = this.plugins.filter(plugin => 
            plugin && plugin.enabled !== false && plugin.url
        );

        this.totalPlugins = enabledPlugins.length;
        
        if (this.totalPlugins === 0) {
            this.log('No enabled plugins configured', 'info');
            return;
        }

        this.log(`Loading ${this.totalPlugins} plugins...`, 'info');

        try {
            if (this.config.sequentialLoading) {
                for (const [index, plugin] of enabledPlugins.entries()) {
                    await this.loadSinglePlugin(plugin, index);
                    await this.delay(100);
                }
            } else {
                const concurrencyLimit = 3;
                for (let i = 0; i < enabledPlugins.length; i += concurrencyLimit) {
                    const chunk = enabledPlugins.slice(i, i + concurrencyLimit);
                    await Promise.allSettled(
                        chunk.map((plugin, index) => 
                            this.loadSinglePlugin(plugin, i + index)
                        )
                    );
                }
            }

            this.log(`Completed loading ${this.pluginsLoaded}/${this.totalPlugins} plugins`, 'success');
        } catch (error) {
            this.handleError('Plugin loading process failed', error);
        }
    }

    async loadSinglePlugin(plugin, index) {
        try {
            this.log(`Loading plugin ${index + 1}/${this.totalPlugins}: ${plugin.name}`, 'info');
            
            switch (plugin.type) {
                case 'script':
                case 'library':
                case 'custom-element':
                    await this.loadScriptPlugin(plugin);
                    break;
                    
                case 'style':
                case 'theme':
                    await this.loadStylePlugin(plugin);
                    break;
                    
                case 'config':
                    await this.loadConfigPlugin(plugin);
                    break;
                    
                case 'widget':
                    await this.loadWidgetPlugin(plugin);
                    break;
                    
                default:
                    // Auto-detect type by extension
                    await this.autoDetectAndLoad(plugin);
            }
            
            this.pluginRegistry.set(plugin.name, {
                ...plugin,
                loaded: true,
                loadTime: new Date()
            });
            
        } catch (error) {
            this.log(`Failed to load plugin: ${plugin.name} - ${error.message}`, 'error');
            this.pluginRegistry.set(plugin.name, {
                ...plugin,
                loaded: false,
                error: error.message
            });
        }
    }

    async loadScriptPlugin(plugin) {
        await this.loadScriptWithRetry(plugin.url);
        this.pluginsLoaded++;
        this.log(`✅ Script plugin loaded: ${plugin.name}`, 'success');
        
        // Initialize plugin if it has an init function
        if (typeof window[`init${plugin.name.replace(/\s+/g, '')}`] === 'function') {
            try {
                window[`init${plugin.name.replace(/\s+/g, '')}`]();
                this.log(`🔧 Plugin initialized: ${plugin.name}`, 'success');
            } catch (e) {
                this.log(`⚠️ Plugin init failed: ${plugin.name}`, 'warn');
            }
        }
    }

    async loadStylePlugin(plugin) {
        await this.loadCSSWithRetry(plugin.url);
        this.pluginsLoaded++;
        this.log(`🎨 Style plugin loaded: ${plugin.name}`, 'success');
    }

    async loadConfigPlugin(plugin) {
        const config = await this.fetchJSON(plugin.url);
        if (config && typeof config === 'object') {
            // Store config in global namespace
            window[`config${plugin.name.replace(/\s+/g, '')}`] = config;
            this.pluginsLoaded++;
            this.log(`⚙️ Config plugin loaded: ${plugin.name}`, 'success');
        } else {
            throw new Error('Invalid JSON configuration');
        }
    }

    async loadWidgetPlugin(plugin) {
        const html = await this.fetchText(plugin.url);
        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = html;
        widgetContainer.setAttribute('data-plugin-widget', plugin.name);
        widgetContainer.style.cssText = 'position: fixed; z-index: 10000;';
        document.body.appendChild(widgetContainer);
        this.pluginsLoaded++;
        this.log(`🧩 Widget plugin loaded: ${plugin.name}`, 'success');
    }

    async autoDetectAndLoad(plugin) {
        const url = plugin.url.toLowerCase();
        if (url.endsWith('.js')) {
            await this.loadScriptPlugin(plugin);
        } else if (url.endsWith('.css')) {
            await this.loadStylePlugin(plugin);
        } else if (url.endsWith('.json')) {
            await this.loadConfigPlugin(plugin);
        } else if (url.endsWith('.html')) {
            await this.loadWidgetPlugin(plugin);
        } else {
            // Default to script
            await this.loadScriptPlugin(plugin);
        }
    }

    async loadScriptWithRetry(url, attempt = 0) {
        try {
            await this.loadScript(url);
        } catch (error) {
            if (attempt < this.config.retryAttempts) {
                this.log(`Retrying script load (${attempt + 1}/${this.config.retryAttempts}): ${url}`, 'warn');
                await this.delay(this.config.retryDelay * (attempt + 1));
                return this.loadScriptWithRetry(url, attempt + 1);
            }
            throw error;
        }
    }

    async loadCSSWithRetry(url, attempt = 0) {
        try {
            await this.loadCSS(url);
        } catch (error) {
            if (attempt < this.config.retryAttempts) {
                this.log(`Retrying CSS load (${attempt + 1}/${this.config.retryAttempts}): ${url}`, 'warn');
                await this.delay(this.config.retryDelay * (attempt + 1));
                return this.loadCSSWithRetry(url, attempt + 1);
            }
            throw error;
        }
    }

    loadScript(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM?.xmlHttpRequest !== 'function') {
                reject(new Error('GM.xmlHttpRequest is not available'));
                return;
            }

            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                timeout: this.config.timeout,
                responseType: 'text',
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const script = document.createElement('script');
                            script.textContent = response.responseText;
                            script.setAttribute('data-plugin-url', url);
                            script.setAttribute('data-loaded-by', 'UniversalPluginLoader');
                            script.setAttribute('type', 'text/javascript');
                            
                            script.onerror = (e) => {
                                this.log(`Script execution error: ${url}`, 'error');
                            };
                            
                            document.head.appendChild(script);
                            resolve(response);
                        } catch (e) {
                            reject(new Error(`Script execution failed: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: (error) => reject(new Error(`Network error: ${error}`)),
                ontimeout: () => reject(new Error('Request timeout'))
            });
        });
    }

    loadCSS(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM?.xmlHttpRequest !== 'function') {
                reject(new Error('GM.xmlHttpRequest is not available'));
                return;
            }

            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                timeout: this.config.timeout,
                responseType: 'text',
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            if (typeof GM.addStyle === 'function') {
                                GM.addStyle(response.responseText);
                            } else {
                                const style = document.createElement('style');
                                style.textContent = response.responseText;
                                style.setAttribute('data-plugin-url', url);
                                document.head.appendChild(style);
                            }
                            resolve(response);
                        } catch (e) {
                            reject(new Error(`CSS application failed: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: (error) => reject(new Error(`Network error: ${error}`)),
                ontimeout: () => reject(new Error('Request timeout'))
            });
        });
    }

    async fetchJSON(url) {
        const response = await this.fetchText(url);
        return JSON.parse(response);
    }

    fetchText(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                timeout: this.config.timeout,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Request timeout'))
            });
        });
    }

    // Plugin Manager UI
    async injectPluginManager() {
        if (!this.config.enablePluginManager) return;

        try {
            this.createStatusIndicator();
            this.createPluginManagerPanel();
            this.log('Plugin manager injected successfully', 'success');
        } catch (error) {
            this.handleError('Failed to inject plugin manager', error);
        }
    }

    createStatusIndicator() {
        if (!document.body) {
            this.log('Document body not available for status indicator', 'warn');
            return;
        }

        try {
            const indicator = document.createElement('div');
            indicator.innerHTML = `
                <div class="universal-plugin-indicator">
                    <div class="plugin-stats">
                        <span class="plugin-icon">🔌</span>
                        <span class="plugin-count">${this.pluginsLoaded}/${this.totalPlugins}</span>
                    </div>
                    <div class="plugin-status">PLUGINS ACTIVE</div>
                </div>
            `;

            const style = `
                .universal-plugin-indicator {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    font-size: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    user-select: none;
                }
                
                .universal-plugin-indicator:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }
                
                .plugin-stats {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                
                .plugin-icon {
                    font-size: 14px;
                }
                
                .plugin-count {
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .plugin-status {
                    opacity: 0.9;
                    font-size: 10px;
                    letter-spacing: 0.5px;
                }
            `;

            try {
                if (typeof GM.addStyle === 'function') {
                    GM.addStyle(style);
                } else {
                    const styleElement = document.createElement('style');
                    styleElement.textContent = style;
                    document.head.appendChild(styleElement);
                }
            } catch (styleError) {
                this.log('Failed to add status indicator styles', 'warn');
            }

            document.body.appendChild(indicator);
            indicator.addEventListener('click', this.openPluginManager);
            
        } catch (error) {
            this.handleError('Failed to create status indicator', error);
        }
    }

    createPluginManagerPanel() {
        // Advanced plugin manager UI
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            padding: 20px;
            min-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: 'Segoe UI', sans-serif;
            display: none;
        `;

        panel.innerHTML = `
            <div class="plugin-manager">
                <h2 style="margin: 0 0 20px 0; color: #333;">🔌 Plugin Manager</h2>
                <div class="plugins-list">
                    ${this.plugins.map(plugin => `
                        <div class="plugin-item" data-plugin-name="${plugin.name}">
                            <div class="plugin-info">
                                <h3>${plugin.name}</h3>
                                <p>${plugin.description || 'No description'}</p>
                                <small>Type: ${plugin.type} | URL: ${plugin.url}</small>
                            </div>
                            <div class="plugin-controls">
                                <button class="toggle-btn ${plugin.enabled ? 'enabled' : 'disabled'}">
                                    ${plugin.enabled ? 'Disable' : 'Enable'}
                                </button>
                                <span class="status ${this.pluginRegistry.get(plugin.name)?.loaded ? 'loaded' : 'failed'}">
                                    ${this.pluginRegistry.get(plugin.name)?.loaded ? '✅' : '❌'}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="close-plugin-manager" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Add panel styles
        const panelStyle = `
            .plugin-manager {
                color: #333;
            }
            .plugins-list {
                max-height: 400px;
                overflow-y: auto;
            }
            .plugin-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-bottom: 8px;
                background: #f9f9f9;
            }
            .plugin-info h3 {
                margin: 0 0 5px 0;
                font-size: 14px;
            }
            .plugin-info p {
                margin: 0 0 5px 0;
                font-size: 12px;
                color: #666;
            }
            .plugin-info small {
                color: #999;
            }
            .toggle-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            .toggle-btn.enabled {
                background: #4CAF50;
                color: white;
            }
            .toggle-btn.disabled {
                background: #f44336;
                color: white;
            }
        `;

        GM.addStyle(panelStyle);

        // Event listeners
        panel.querySelector('#close-plugin-manager').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Toggle buttons
        panel.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pluginName = e.target.closest('.plugin-item').dataset.pluginName;
                this.togglePlugin(pluginName);
            });
        });
    }

    openPluginManager() {
        const panel = document.querySelector('.plugin-manager')?.closest('div');
        if (panel) {
            panel.style.display = 'block';
        }
    }

    togglePlugin(pluginName) {
        this.log(`Toggling plugin: ${pluginName}`, 'info');
        // Implementation for dynamically enabling/disabling plugins
        // This would require more advanced state management
    }

    // Utility methods
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(message, type = 'info') {
        const emojis = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' };
        const emoji = emojis[type] || '📝';
        const styles = { info: 'color: blue;', success: 'color: green;', warn: 'color: orange;', error: 'color: red;' };
        console.log(`%c${emoji} Aternos Plugin Loader: ${message}`, styles[type] || '');
    }

    handleError(context, error) {
        this.log(`${context}: ${error?.message || error}`, 'error');
        console.error(context, error);
    }

    handlePromiseRejection(event) {
        this.log(`Unhandled promise rejection: ${event.reason}`, 'error');
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            if (event.target?.tagName === 'SCRIPT' && event.target.hasAttribute('data-plugin-url')) {
                this.log(`Runtime error in plugin: ${event.target.getAttribute('data-plugin-url')}`, 'error');
            }
        });

        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }
}

// Initialize the universal plugin loader
(async function() {
    'use strict';
    
    if (window.aternosPluginLoaderInstance) {
        console.log('Aternos Plugin Loader already running');
        return;
    }
    
    try {
        if (document.readyState === 'loading') {
            await new Promise(resolve => 
                document.addEventListener('DOMContentLoaded', resolve, { once: true })
            );
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const loader = new UniversalPluginLoader();
        window.aternosPluginLoaderInstance = loader;
        await loader.init();
        
    } catch (error) {
        console.error('🚨 Aternos Universal Plugin Loader: Critical initialization error', error);
    }
})();
// ==UserScript==
// @name         Universal Captcha Solver
// @namespace    http://github.com/quantavil
// @version      1.3
// @description  Solve captchas on any website using Gemini AI with a generic selector picker
// @author       quantavil
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/562283/Universal%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/562283/Universal%20Captcha%20Solver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration & Constants ---
    const CONSTANTS = {
        STORAGE_KEYS: {
            API_KEY: 'gemini_api_key',
            MODEL: 'gemini_model'
        },
        DEFAULTS: {
            MODEL: 'gemma-3-27b-it'
        },
        TIMEOUTS: {
            IMAGE_LOAD: 5000,
            API: 12000
        },
        DELAYS: {
            INITIAL_RUN: 100,
            AFTER_REFRESH: 100,
            AFTER_SRC_CHANGE: 50
        }
    };

    // --- Shared Utilities ---
    const createToast = () => {
        const show = (message, isError = false) => {
            const toast = document.createElement('div');
            toast.className = `ucs-toast ${isError ? 'error' : 'success'}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        };
        return { show };
    };
    const Toast = createToast();

    class HttpClient {
        static async request(method, url, options = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: options.headers || {},
                    data: options.data,
                    responseType: options.responseType,
                    timeout: options.timeout || 10000,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(res);
                        } else {
                            // Try to parse error message if JSON
                            let errorMessage = `HTTP ${res.status}`;
                            try {
                                const json = JSON.parse(res.responseText);
                                if (json.error && json.error.message) {
                                    errorMessage = json.error.message;
                                }
                            } catch (e) { }
                            reject(new Error(errorMessage));
                        }
                    },
                    onerror: () => reject(new Error('Network Error')),
                    ontimeout: () => reject(new Error('Timeout'))
                });
            });
        }

        static async post(url, data, options = {}) {
            return this.request('POST', url, { ...options, data });
        }

        static async get(url, options = {}) {
            return this.request('GET', url, options);
        }
    }

    // --- Minimal Clean UI Styles ---
    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap');

        :root {
            --ucs-bg: #fafafa;
            --ucs-bg-elevated: #ffffff;
            --ucs-border: #e5e5e5;
            --ucs-border-strong: #d4d4d4;
            --ucs-text: #171717;
            --ucs-text-secondary: #737373;
            --ucs-text-muted: #a3a3a3;
            --ucs-accent: #171717;
            --ucs-success: #22c55e;
            --ucs-error: #ef4444;
            --ucs-warning: #f59e0b;
            --ucs-font: 'Geist Mono', 'SF Mono', 'Monaco', monospace;
            --ucs-radius: 8px;
            --ucs-radius-sm: 4px;
            --ucs-shadow: 0 4px 12px rgba(0,0,0,0.08);
            --ucs-shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
        }

        /* Floating Widget */
        .ucs-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2147483647;
            background: var(--ucs-bg-elevated);
            border: 1px solid var(--ucs-border);
            padding: 10px 16px;
            border-radius: var(--ucs-radius);
            box-shadow: var(--ucs-shadow);
            font-family: var(--ucs-font);
            color: var(--ucs-text);
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
            font-size: 12px;
        }

        .ucs-widget:hover {
            box-shadow: var(--ucs-shadow-lg);
            transform: translateY(-2px);
        }

        .ucs-widget.minimized {
            width: 40px;
            height: 40px;
            padding: 0;
            justify-content: center;
            border-radius: 50%;
        }

        .ucs-widget.minimized .ucs-content { display: none; }
        .ucs-widget.minimized .ucs-icon { display: block; }

        .ucs-icon {
            display: none;
            cursor: pointer;
            font-size: 16px;
        }

        .ucs-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .ucs-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--ucs-text-muted);
            transition: all 0.2s ease;
        }

        .ucs-status-idle .ucs-status-dot { background: var(--ucs-text-muted); }
        .ucs-status-ready .ucs-status-dot { background: var(--ucs-text); }
        .ucs-status-solving .ucs-status-dot { background: var(--ucs-warning); animation: ucs-pulse 1s infinite; }
        .ucs-status-success .ucs-status-dot { background: var(--ucs-success); }
        .ucs-status-error .ucs-status-dot { background: var(--ucs-error); }

        @keyframes ucs-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.9); }
        }

        /* Buttons */
        .ucs-btn {
            background: var(--ucs-text);
            border: none;
            color: #fff;
            padding: 10px 16px;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.3px;
            cursor: pointer;
            font-family: var(--ucs-font);
            border-radius: var(--ucs-radius-sm);
            transition: all 0.15s ease;
        }

        .ucs-btn:hover {
            opacity: 0.85;
        }

        .ucs-btn:active {
            transform: scale(0.98);
        }

        .ucs-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .ucs-btn.secondary {
            background: transparent;
            color: var(--ucs-text);
            border: 1px solid var(--ucs-border-strong);
        }

        .ucs-btn.secondary:hover {
            background: var(--ucs-bg);
            border-color: var(--ucs-text);
        }

        .ucs-btn.danger {
            background: var(--ucs-error);
        }

        /* Modal */
        .ucs-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            z-index: 2147483647;
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            padding: 20px;
            font-family: var(--ucs-font);
        }

        .ucs-modal {
            background: var(--ucs-bg-elevated);
            border: 1px solid var(--ucs-border);
            border-radius: var(--ucs-radius);
            width: 380px;
            max-height: calc(100vh - 40px);
            overflow: hidden;
            box-shadow: var(--ucs-shadow-lg);
            display: flex;
            flex-direction: column;
        }

        .ucs-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--ucs-border);
            flex-shrink: 0;
        }

        .ucs-modal-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--ucs-text);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .ucs-modal-close {
            background: transparent;
            border: none;
            color: var(--ucs-text-secondary);
            font-size: 18px;
            cursor: pointer;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--ucs-radius-sm);
            transition: all 0.15s;
        }

        .ucs-modal-close:hover {
            background: var(--ucs-bg);
            color: var(--ucs-text);
        }

        /* Tabs */
        .ucs-tabs {
            display: flex;
            border-bottom: 1px solid var(--ucs-border);
            padding: 0 20px;
            flex-shrink: 0;
        }

        .ucs-tab {
            padding: 12px 0;
            margin-right: 24px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--ucs-text-secondary);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            font-family: var(--ucs-font);
            transition: all 0.15s;
        }

        .ucs-tab:hover {
            color: var(--ucs-text);
        }

        .ucs-tab.active {
            color: var(--ucs-text);
            border-bottom-color: var(--ucs-text);
        }

        .ucs-tab-content {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .ucs-tab-content::-webkit-scrollbar { width: 6px; }
        .ucs-tab-content::-webkit-scrollbar-track { background: transparent; }
        .ucs-tab-content::-webkit-scrollbar-thumb { background: var(--ucs-border-strong); border-radius: 3px; }

        /* Form Fields */
        .ucs-field {
            margin-bottom: 16px;
        }

        .ucs-field:last-child { margin-bottom: 0; }

        .ucs-label {
            display: block;
            font-size: 11px;
            font-weight: 500;
            color: var(--ucs-text-secondary);
            margin-bottom: 6px;
        }

        .ucs-input {
            width: 100%;
            padding: 10px 12px;
            background: var(--ucs-bg);
            border: 1px solid var(--ucs-border);
            border-radius: var(--ucs-radius-sm);
            color: var(--ucs-text);
            font-size: 12px;
            font-family: var(--ucs-font);
            box-sizing: border-box;
            transition: all 0.15s;
        }

        .ucs-input:focus {
            outline: none;
            border-color: var(--ucs-text);
            background: var(--ucs-bg-elevated);
        }

        .ucs-input::placeholder {
            color: var(--ucs-text-muted);
        }

        .ucs-btn-row {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }

        .ucs-btn-row .ucs-btn { flex: 1; }

        /* Site List */
        .ucs-site-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .ucs-site-item {
            background: var(--ucs-bg);
            border: 1px solid var(--ucs-border);
            border-radius: var(--ucs-radius-sm);
            padding: 12px 14px;
            position: relative;
            transition: all 0.15s;
        }

        .ucs-site-item:hover {
            border-color: var(--ucs-border-strong);
        }

        .ucs-site-pattern {
            font-size: 11px;
            font-weight: 600;
            color: var(--ucs-text);
            margin-bottom: 6px;
            word-break: break-all;
            padding-right: 60px;
            line-height: 1.4;
        }

        .ucs-site-selectors {
            font-size: 10px;
            color: var(--ucs-text-secondary);
            line-height: 1.5;
        }

        .ucs-site-selectors code {
            background: var(--ucs-bg-elevated);
            padding: 1px 4px;
            border-radius: 2px;
            border: 1px solid var(--ucs-border);
            font-family: var(--ucs-font);
            font-size: 10px;
        }

        .ucs-site-actions {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 4px;
        }

        .ucs-site-action-btn {
            width: 24px;
            height: 24px;
            background: var(--ucs-bg-elevated);
            border: 1px solid var(--ucs-border);
            border-radius: var(--ucs-radius-sm);
            color: var(--ucs-text-secondary);
            font-size: 11px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s;
        }

        .ucs-site-action-btn:hover {
            border-color: var(--ucs-text);
            color: var(--ucs-text);
        }

        .ucs-site-action-btn.delete:hover {
            background: var(--ucs-error);
            border-color: var(--ucs-error);
            color: #fff;
        }

        .ucs-empty {
            text-align: center;
            color: var(--ucs-text-muted);
            font-size: 11px;
            padding: 32px 20px;
            border: 1px dashed var(--ucs-border);
            border-radius: var(--ucs-radius-sm);
        }

        /* Add Site Form */
        .ucs-add-form {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--ucs-border);
        }

        .ucs-add-form .ucs-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--ucs-text);
            margin-bottom: 12px;
        }

        /* Picker Overlay */
        .ucs-picker-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 2147483646;
            cursor: crosshair;
            background: rgba(0, 0, 0, 0.1);
        }

        .ucs-highlight {
            outline: 2px solid var(--ucs-text) !important;
            outline-offset: 2px !important;
        }

        .ucs-tooltip {
            position: fixed;
            background: var(--ucs-text);
            color: #fff;
            padding: 6px 10px;
            border-radius: var(--ucs-radius-sm);
            font-size: 11px;
            font-weight: 500;
            font-family: var(--ucs-font);
            pointer-events: none;
            z-index: 2147483648;
            transform: translate(10px, 10px);
        }

        /* Toast */
        .ucs-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 500;
            font-family: var(--ucs-font);
            z-index: 2147483648;
            border-radius: var(--ucs-radius-sm);
            box-shadow: var(--ucs-shadow);
        }

        .ucs-toast.success {
            background: var(--ucs-success);
            color: #fff;
        }

        .ucs-toast.error {
            background: var(--ucs-error);
            color: #fff;
        }
    `;

    // --- Modules ---

    /**
     * Handles Local Storage / Configuration with path-based matching
     */
    class ConfigManager {
        constructor() {
            this.hostname = window.location.hostname;
            this.pathname = window.location.pathname;
            this.siteKey = this.hostname + this.pathname;
            this.reservedKeys = Object.values(CONSTANTS.STORAGE_KEYS);
        }

        /**
         * Get full site key (hostname + pathname)
         */
        getSiteKey() {
            return this.siteKey;
        }

        /**
         * Check if a pattern matches the current URL
         */
        matchesPattern(pattern) {
            const currentUrl = this.hostname + this.pathname;

            // Exact match
            if (pattern === currentUrl) return { match: true, specificity: 3 };

            // Wildcard pattern: domain/* or domain/path/*
            if (pattern.endsWith('/*')) {
                const base = pattern.slice(0, -2); // Remove /*
                if (currentUrl.startsWith(base + '/') || currentUrl === base) {
                    // Specificity based on how much of the path is matched
                    return { match: true, specificity: base.split('/').length };
                }
            }

            // Legacy hostname-only match (backwards compatibility)
            if (pattern === this.hostname && !pattern.includes('/')) {
                return { match: true, specificity: 1 };
            }

            return { match: false, specificity: 0 };
        }

        /**
         * Get config for current page (with pattern matching)
         */
        getConfig() {
            // 1. Check User Overrides
            const keys = GM_listValues();
            let bestMatch = null;
            let bestSpecificity = 0;

            for (const key of keys) {
                if (this.reservedKeys.includes(key)) continue;

                const { match, specificity } = this.matchesPattern(key);
                if (match && specificity > bestSpecificity) {
                    try {
                        const value = GM_getValue(key);
                        if (value && typeof value === 'string' && value.startsWith('{')) {
                            bestMatch = { key, config: JSON.parse(value) };
                            bestSpecificity = specificity;
                        }
                    } catch (e) {
                        console.warn(`Invalid config for ${key}`, e);
                    }
                }
            }

            return bestMatch ? bestMatch.config : null;
        }

        /**
         * Save config for a specific pattern (defaults to current hostname+pathname)
         */
        saveConfig(config, pattern = null) {
            const key = pattern || this.siteKey;
            GM_setValue(key, JSON.stringify(config));
        }

        /**
         * Clear config for current site key
         */
        clearConfig() {
            // Find and delete the matching config
            const keys = GM_listValues();
            for (const key of keys) {
                if (this.reservedKeys.includes(key)) continue;
                const { match } = this.matchesPattern(key);
                if (match) {
                    GM_deleteValue(key);
                    return true;
                }
            }
            return false;
        }

        /**
         * Delete a specific site config by its key/pattern
         */
        deleteSiteConfig(key) {
            GM_deleteValue(key);
        }

        /**
         * Get all site configurations
         */
        getAllSiteConfigs() {
            const keys = GM_listValues();
            const sites = [];

            for (const key of keys) {
                if (this.reservedKeys.includes(key)) continue;

                try {
                    const value = GM_getValue(key);
                    if (value && typeof value === 'string' && value.startsWith('{')) {
                        sites.push({ pattern: key, config: JSON.parse(value) });
                    }
                } catch (e) {
                    console.warn(`Skipping invalid config for ${key}`, e);
                }
            }

            return sites;
        }

        exportSettings() {
            const sites = this.getAllSiteConfigs();
            const configs = {};
            sites.forEach(({ pattern, config }) => {
                configs[pattern] = config;
            });

            const exportData = {
                details: {
                    exportedAt: new Date().toISOString(),
                    scriptVersion: '1.3',
                    author: 'Universal Solver'
                },
                configs: configs
            };

            return JSON.stringify(exportData, null, 2);
        }

        importSettings(jsonString) {
            try {
                const data = JSON.parse(jsonString);
                if (!data.configs) throw new Error('Invalid export file format');

                const entries = Object.entries(data.configs);
                let importedCount = 0;

                entries.forEach(([pattern, config]) => {
                    if (config.captchaSelector && config.inputSelector) {
                        GM_setValue(pattern, JSON.stringify(config));
                        importedCount++;
                    }
                });

                return { success: true, count: importedCount };
            } catch (e) {
                return { success: false, error: e.message };
            }
        }
    }

    /**
     * Unified Settings Dialog
     */
    class SettingsDialog {
        constructor(configManager, callbacks = {}) {
            this.configManager = configManager;
            this.callbacks = callbacks;
            this.overlay = null;
            this.activeTab = 'api';
            this.editingPattern = null; // Track editing state
        }

        open() {
            this.createModal();
            document.body.appendChild(this.overlay);
        }

        close() {
            this.overlay?.remove();
            this.overlay = null;
        }

        createModal() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'ucs-modal-overlay';
            this.overlay.onclick = (e) => {
                if (e.target === this.overlay) this.close();
            };

            const modal = document.createElement('div');
            modal.className = 'ucs-modal';
            modal.innerHTML = `
                <div class="ucs-modal-header">
                    <h3 class="ucs-modal-title">⚙️ Captcha Solver Settings</h3>
                    <button class="ucs-modal-close">×</button>
                </div>
                <div class="ucs-tabs">
                    <button class="ucs-tab active" data-tab="api">API</button>
                    <button class="ucs-tab" data-tab="sites">Sites</button>
                </div>
                <div class="ucs-tab-content" id="ucs-tab-api">
                    ${this.renderApiTab()}
                </div>
                <div class="ucs-tab-content" id="ucs-tab-sites" style="display: none;">
                    ${this.renderSitesTab()}
                </div>
            `;

            modal.querySelector('.ucs-modal-close').onclick = () => this.close();

            // Tab switching
            modal.querySelectorAll('.ucs-tab').forEach(tab => {
                tab.onclick = () => this.switchTab(tab.dataset.tab, modal);
            });

            // API tab handlers
            this.bindApiHandlers(modal);

            this.overlay.appendChild(modal);
        }

        renderApiTab() {
            const currentKey = GM_getValue(CONSTANTS.STORAGE_KEYS.API_KEY, '');
            const currentModel = GM_getValue(CONSTANTS.STORAGE_KEYS.MODEL, CONSTANTS.DEFAULTS.MODEL);

            return `
                <div class="ucs-field">
                    <label class="ucs-label">API Key</label>
                    <input type="text" class="ucs-input" id="ucs-api-key" 
                           value="${currentKey}" placeholder="Enter Gemini API key">
                </div>
                <div class="ucs-field">
                    <label class="ucs-label">Model</label>
                    <input type="text" class="ucs-input" id="ucs-model" 
                           value="${currentModel}" placeholder="${CONSTANTS.DEFAULTS.MODEL}">
                </div>
                <div class="ucs-btn-row">
                    <button class="ucs-btn" id="ucs-save-api">Save</button>
                    <button class="ucs-btn secondary" id="ucs-verify-api">Verify</button>
                </div>
                <div class="ucs-btn-row">
                    <button class="ucs-btn secondary" id="ucs-export">📤 Export</button>
                    <button class="ucs-btn secondary" id="ucs-import">📥 Import</button>
                </div>
                <div class="ucs-btn-row">
                    <button class="ucs-btn danger" id="ucs-reset-current">Reset This Site</button>
                </div>
            `;
        }

        renderSitesTab() {
            const sites = this.configManager.getAllSiteConfigs();

            const addFormHtml = `
                <div class="ucs-add-form">
                     <div class="ucs-label" id="ucs-form-title">➕ Add New Site</div>
                     <input type="text" class="ucs-input" id="ucs-new-pattern" placeholder="Domain or URL Pattern" style="margin-bottom: 8px;">
                     <input type="text" class="ucs-input" id="ucs-new-captcha" placeholder="Captcha Selector (e.g. #img)" style="margin-bottom: 8px;">
                     <input type="text" class="ucs-input" id="ucs-new-input" placeholder="Input Selector (e.g. #code)" style="margin-bottom: 8px;">
                     <div class="ucs-btn-row" style="margin-top: 10px;">
                        <button class="ucs-btn" id="ucs-add-site" style="width: 100%;">Add Site</button>
                        <button class="ucs-btn secondary" id="ucs-cancel-edit" style="display: none;">Cancel</button>
                     </div>
                </div>
            `;

            if (sites.length === 0) {
                return `
                    <div class="ucs-empty">No sites configured yet</div>
                    ${addFormHtml}
                `;
            }

            return `
            <div class="ucs-site-list">
                ${sites.map(({ pattern, config }) => `
                    <div class="ucs-site-item" data-pattern="${this.escapeHtml(pattern)}" 
                         data-captcha="${this.escapeHtml(config.captchaSelector)}"
                         data-input="${this.escapeHtml(config.inputSelector)}">
                        <div class="ucs-site-actions">
                            <button class="ucs-site-action-btn edit ucs-site-edit" title="Edit">✎</button>
                            <button class="ucs-site-action-btn delete ucs-site-delete" title="Remove">×</button>
                        </div>
                        <div class="ucs-site-pattern">${this.escapeHtml(pattern)}</div>
                        <div class="ucs-site-selectors">
                            Captcha: <code>${this.escapeHtml(config.captchaSelector)}</code><br>
                            Input: <code>${this.escapeHtml(config.inputSelector)}</code>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${addFormHtml}
        `;
        }

        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        switchTab(tabName, modal) {
            this.activeTab = tabName;

            modal.querySelectorAll('.ucs-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.tab === tabName);
            });

            modal.querySelector('#ucs-tab-api').style.display = tabName === 'api' ? 'block' : 'none';
            modal.querySelector('#ucs-tab-sites').style.display = tabName === 'sites' ? 'block' : 'none';

            // Rebind site delete handlers when switching to sites tab
            if (tabName === 'sites') {
                this.bindSiteHandlers(modal);
                this.resetForm(modal); // Reset form state when switching to sites tab
            }
        }

        bindApiHandlers(modal) {
            // Save API key/model
            modal.querySelector('#ucs-save-api').onclick = () => {
                const apiKey = modal.querySelector('#ucs-api-key').value.trim();
                const model = modal.querySelector('#ucs-model').value.trim();

                if (apiKey) GM_setValue(CONSTANTS.STORAGE_KEYS.API_KEY, apiKey);
                if (model) GM_setValue(CONSTANTS.STORAGE_KEYS.MODEL, model);

                Toast.show('Settings saved!');
            };

            // Verify API key
            modal.querySelector('#ucs-verify-api').onclick = async () => {
                const apiKey = modal.querySelector('#ucs-api-key').value.trim();
                const model = modal.querySelector('#ucs-model').value.trim() || CONSTANTS.DEFAULTS.MODEL;

                if (!apiKey) {
                    Toast.show('Enter an API key first', true);
                    return;
                }

                const btn = modal.querySelector('#ucs-verify-api');
                const originalText = btn.textContent;
                btn.textContent = '...';
                btn.disabled = true;

                try {
                    await HttpClient.post(
                        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                        JSON.stringify({ contents: [{ parts: [{ text: 'test' }] }] }),
                        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
                    );
                    Toast.show('✓ Valid!');
                } catch (e) {
                    Toast.show(`✗ ${e.message}`, true);
                } finally {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            };

            // Export
            modal.querySelector('#ucs-export').onclick = () => {
                this.callbacks.onExport?.();
                this.close();
            };

            // Import
            modal.querySelector('#ucs-import').onclick = () => {
                this.callbacks.onImport?.();
                this.close();
            };

            // Reset current site
            modal.querySelector('#ucs-reset-current').onclick = () => {
                if (confirm('Reset configuration for this site?')) {
                    this.configManager.clearConfig();
                    this.close();
                    location.reload();
                }
            };
        }

        bindSiteHandlers(modal) {
            // Delete handlers
            modal.querySelectorAll('.ucs-site-delete').forEach(btn => {
                btn.onclick = (e) => {
                    const item = e.target.closest('.ucs-site-item');
                    const pattern = item.dataset.pattern;

                    if (confirm(`Remove configuration for "${pattern}"?`)) {
                        this.configManager.deleteSiteConfig(pattern);
                        // Refresh tab
                        this.refreshSitesTab(modal);
                    }
                };
            });

            // Edit handlers
            modal.querySelectorAll('.ucs-site-edit').forEach(btn => {
                btn.onclick = (e) => {
                    const item = e.target.closest('.ucs-site-item');
                    const pattern = item.dataset.pattern;
                    const captcha = item.dataset.captcha;
                    const input = item.dataset.input;

                    this.editingPattern = pattern;

                    modal.querySelector('#ucs-new-pattern').value = pattern;
                    modal.querySelector('#ucs-new-captcha').value = captcha;
                    modal.querySelector('#ucs-new-input').value = input;

                    modal.querySelector('#ucs-form-title').textContent = 'Edit Site';
                    modal.querySelector('#ucs-add-site').textContent = 'Update Site';
                    modal.querySelector('#ucs-cancel-edit').style.display = 'inline-block';

                    // Highlight being edited
                    modal.querySelectorAll('.ucs-site-item').forEach(el => el.style.opacity = '0.5');
                    item.style.opacity = '1';
                    item.style.border = '2px solid var(--ucs-text)';
                };
            });

            // Cancel Edit
            const cancelBtn = modal.querySelector('#ucs-cancel-edit');
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    this.resetForm(modal);
                };
            }

            // Add/Update Site Handler
            const addBtn = modal.querySelector('#ucs-add-site');
            if (addBtn) {
                addBtn.onclick = () => {
                    const pattern = modal.querySelector('#ucs-new-pattern').value.trim();
                    const captcha = modal.querySelector('#ucs-new-captcha').value.trim();
                    const input = modal.querySelector('#ucs-new-input').value.trim();

                    if (!pattern || !captcha || !input) {
                        Toast.show('Fill all fields', true);
                        return;
                    }

                    // Validate Selectors
                    try {
                        // We can only validate syntax, we can't find element on this page if it's for another site.
                        // But document.querySelector throws if selector is invalid.
                        document.querySelector(captcha);
                        document.querySelector(input);
                    } catch (e) {
                        Toast.show('Invalid CSS Selector syntax', true);
                        return;
                    }

                    // If editing and pattern changed, delete old one
                    if (this.editingPattern && this.editingPattern !== pattern) {
                        this.configManager.deleteSiteConfig(this.editingPattern);
                    }

                    this.configManager.saveConfig({
                        captchaSelector: captcha,
                        inputSelector: input
                    }, pattern);

                    Toast.show(this.editingPattern ? 'Site Updated' : 'Site Added');
                    this.resetForm(modal);
                    this.refreshSitesTab(modal);
                };
            }
        }

        refreshSitesTab(modal) {
            modal.querySelector('#ucs-tab-sites').innerHTML = this.renderSitesTab();
            this.bindSiteHandlers(modal);
        }

        resetForm(modal) {
            this.editingPattern = null;
            modal.querySelector('#ucs-new-pattern').value = '';
            modal.querySelector('#ucs-new-captcha').value = '';
            modal.querySelector('#ucs-new-input').value = '';

            modal.querySelector('#ucs-form-title').textContent = '➕ Add New Site';
            modal.querySelector('#ucs-add-site').textContent = 'Add Site';
            modal.querySelector('#ucs-cancel-edit').style.display = 'none';

            // Reset styles
            modal.querySelectorAll('.ucs-site-item').forEach(el => {
                el.style.opacity = '1';
                el.style.border = '1px solid var(--ucs-border)';
            });
        }
    }

    /**
     * Handles Visual Selection of Elements
     */
    class SelectorPicker {
        constructor(onSelect) {
            this.onSelect = onSelect;
            this.active = false;
            this.overlay = null;
            this.tooltip = null;
            this.currentElement = null;
            this.rafId = null;

            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleClick = this.handleClick.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
        }

        start(message) {
            this.active = true;
            this.createOverlay(message);
            document.addEventListener('mousemove', this.handleMouseMove, true);
            document.addEventListener('click', this.handleClick, true);
            document.addEventListener('keydown', this.handleKeyDown, true);
        }

        stop() {
            this.active = false;
            if (this.currentElement) {
                this.currentElement.classList.remove('ucs-highlight');
            }
            if (this.rafId) cancelAnimationFrame(this.rafId);

            this.overlay?.remove();
            this.tooltip?.remove();
            document.removeEventListener('mousemove', this.handleMouseMove, true);
            document.removeEventListener('click', this.handleClick, true);
            document.removeEventListener('keydown', this.handleKeyDown, true);
        }

        createOverlay(msg) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'ucs-picker-overlay';
            document.body.appendChild(this.overlay);

            this.tooltip = document.createElement('div');
            this.tooltip.className = 'ucs-tooltip';
            this.tooltip.textContent = msg;
            document.body.appendChild(this.tooltip);
        }

        handleMouseMove(e) {
            if (!this.active) return;

            // Optimization: Throttling with rAF
            if (this.rafId) return;

            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;

                // Update tooltip pos
                this.tooltip.style.left = (e.clientX + 10) + 'px';
                this.tooltip.style.top = (e.clientY + 10) + 'px';

                this.overlay.style.pointerEvents = 'none';
                const el = document.elementFromPoint(e.clientX, e.clientY);
                this.overlay.style.pointerEvents = 'auto';

                if (el && el !== this.currentElement && el !== this.overlay && !el.classList.contains('ucs-widget')) {
                    if (this.currentElement) this.currentElement.classList.remove('ucs-highlight');
                    this.currentElement = el;
                    this.currentElement.classList.add('ucs-highlight');
                }
            });
        }

        handleClick(e) {
            if (!this.active) return;
            e.preventDefault();
            e.stopPropagation();

            if (this.currentElement) {
                const selector = this.generateSelector(this.currentElement);
                this.stop();
                this.onSelect(selector, this.currentElement.tagName);
            }
        }

        handleKeyDown(e) {
            if (e.key === 'Escape') this.stop();
        }

        generateSelector(el) {
            if (el.id) return `#${el.id}`;
            let path = [];
            while (el && el.nodeType === Node.ELEMENT_NODE && el.tagName !== 'HTML') {
                let selector = el.tagName.toLowerCase();
                if (el.className && typeof el.className === 'string') {
                    const classes = Array.from(el.classList).filter(c => !c.startsWith('ucs-'));
                    if (classes.length > 0) selector += '.' + classes.join('.');
                }
                path.unshift(selector);
                el = el.parentNode;
                if (path.length > 3) break;
            }
            return path.join(' > ');
        }
    }

    /**
     * Main Solver Logic (Gemini)
     */
    class GeminiSolver {
        constructor() {
            // config handled dynamically
        }

        get apiKey() { return GM_getValue(CONSTANTS.STORAGE_KEYS.API_KEY, ''); }
        get model() { return GM_getValue(CONSTANTS.STORAGE_KEYS.MODEL, CONSTANTS.DEFAULTS.MODEL); }

        async solve(base64Image) {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
            const payload = {
                contents: [{
                    parts: [
                        { text: "Solve this captcha. Output ONLY the alphanumeric characters visible in the image. Do not include spaces or special characters." },
                        { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                    ]
                }]
            };

            const response = await HttpClient.post(apiUrl, JSON.stringify(payload), {
                headers: { "Content-Type": "application/json" },
                timeout: CONSTANTS.TIMEOUTS.API
            });

            try {
                const data = JSON.parse(response.responseText);
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                const solution = text ? text.trim().replace(/[^a-zA-Z0-9]/g, '') : '';
                if (solution.length < 3) throw new Error("Invalid format");
                return solution;
            } catch (e) {
                if (e.message === "Invalid format") throw e;
                throw new Error("Parse Error");
            }
        }
    }

    /**
     * Main Controller
     */
    class UniversalSolver {
        constructor() {
            this.configManager = new ConfigManager();
            this.picker = null;
            this.solver = new GeminiSolver();
            this.siteConfig = this.configManager.getConfig();
            this.observer = null;
            this.cachedCaptchaEl = null;

            this.registerMenu();

            if (this.siteConfig) {
                this.injectStyles();
                this.createUI();
                this.initAutoSolve();

                // Cleanup on unload to prevent memory leaks
                window.addEventListener('beforeunload', () => this.cleanup());
            }
        }

        registerMenu() {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand("⚙️ Settings", () => {
                    this.injectStyles();
                    this.openSettings();
                });

                GM_registerMenuCommand("🎯 Configure Captcha", () => {
                    this.injectStyles();
                    this.startSetup();
                });
            }
        }

        openSettings() {
            const dialog = new SettingsDialog(this.configManager, {
                onExport: () => this.handleExport(),
                onImport: () => this.handleImport()
            });
            dialog.open();
        }

        handleExport() {
            try {
                const json = this.configManager.exportSettings();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `universal_solver_configs_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            } catch (e) {
                Toast.show(`Export failed: ${e.message}`, true);
            }
        }

        handleImport() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = this.configManager.importSettings(event.target.result);
                    if (result.success) {
                        Toast.show(`Successfully imported ${result.count} configurations! Reloading...`);
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        Toast.show(`Import failed: ${result.error}`, true);
                    }
                };
                reader.readAsText(file);
            };

            input.click();
        }

        injectStyles() {
            if (this.stylesInjected) return;
            this.stylesInjected = true;

            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(STYLES);
            } else {
                const style = document.createElement('style');
                style.textContent = STYLES;
                document.head.appendChild(style);
            }
        }

        createUI() {
            document.querySelector('.ucs-widget')?.remove();

            this.widget = document.createElement('div');
            this.widget.className = 'ucs-widget ucs-status-idle';
            this.widget.innerHTML = `
                <div class="ucs-icon">🤖</div>
                <div class="ucs-content">
                    <div class="ucs-status-dot"></div>
                    <span class="ucs-status-text">Ready</span>
                    <button class="ucs-btn cmd-solve">Solve</button>
                    <button class="ucs-btn secondary cmd-close" title="Close Session">✕</button>
                </div>
            `;

            this.widget.querySelector('.ucs-icon').onclick = () => this.toggleMinimize();

            const solveBtn = this.widget.querySelector('.cmd-solve');
            const closeBtn = this.widget.querySelector('.cmd-close');

            if (solveBtn) solveBtn.onclick = () => this.runSolve();
            if (closeBtn) closeBtn.onclick = () => {
                this.cleanup();
                this.widget.remove();
            };

            this.updateStatus('ready', 'Ready');
            document.body.appendChild(this.widget);
        }

        updateStatus(status, text) {
            if (!this.widget) return;
            this.widget.className = `ucs-widget ucs-status-${status}`;
            const txt = this.widget.querySelector('.ucs-status-text');
            if (txt) txt.textContent = text;

            const btn = this.widget.querySelector('.cmd-solve');
            if (btn) {
                if (status === 'solving') {
                    btn.textContent = '...';
                    btn.disabled = true;
                } else if (status === 'error') {
                    btn.textContent = 'Retry';
                    btn.disabled = false;
                } else {
                    btn.textContent = 'Solve';
                    btn.disabled = false;
                }
            }
        }

        toggleMinimize() {
            this.widget.classList.toggle('minimized');
        }

        async startSetup() {
            this.picker = new SelectorPicker((selector, tagName) => {
                const imgSelector = selector;
                const isCanvas = tagName === 'CANVAS';

                setTimeout(() => {
                    this.picker = new SelectorPicker((inputSelector) => {
                        const config = {
                            captchaSelector: imgSelector,
                            inputSelector: inputSelector,
                            isCanvas: isCanvas
                        };
                        this.configManager.saveConfig(config);
                        Toast.show('Configuration Saved! Reloading...');
                        setTimeout(() => location.reload(), 1000);
                    });
                    this.picker.start("CLICK THE INPUT FIELD");
                }, 500);
            });
            this.picker.start("CLICK THE CAPTCHA IMAGE");
        }

        async getImageBase64() {
            // Use cached element if valid, otherwise query
            let el = this.cachedCaptchaEl;
            if (!el || !document.contains(el)) {
                el = document.querySelector(this.siteConfig.captchaSelector);
                this.cachedCaptchaEl = el;
            }

            if (!el) throw new Error('Captcha element not found');

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            try {
                if (this.siteConfig.isCanvas || el.tagName === 'CANVAS') {
                    canvas.width = el.width;
                    canvas.height = el.height;
                    ctx.drawImage(el, 0, 0);
                    return canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
                } else {
                    if (!el.complete || el.naturalWidth === 0) {
                        await new Promise((resolve, reject) => {
                            el.onload = resolve;
                            el.onerror = () => reject(new Error('Image failed to load'));
                            setTimeout(() => reject(new Error('Timeout')), CONSTANTS.TIMEOUTS.IMAGE_LOAD);
                        });
                    }
                    canvas.width = el.naturalWidth || el.width;
                    canvas.height = el.naturalHeight || el.height;
                    ctx.drawImage(el, 0, 0);
                    try {
                        return canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
                    } catch (corsError) {
                        return await this.fetchCrossOriginImage(el.src);
                    }
                }
            } catch (e) {
                console.error(e);
                throw new Error('Image extraction failed');
            }
        }

        async fetchCrossOriginImage(url) {
            const response = await HttpClient.request('GET', url, {
                responseType: 'blob',
                timeout: CONSTANTS.TIMEOUTS.IMAGE_LOAD
            });

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.replace(/^data:image\/[^;]+;base64,/, '');
                    resolve(base64);
                };
                reader.onerror = () => reject(new Error('Failed to read blob'));
                reader.readAsDataURL(response.response);
            });
        }

        async runSolve() {
            if (!this.siteConfig) return;

            // Validate API key
            const apiKey = GM_getValue(CONSTANTS.STORAGE_KEYS.API_KEY, '');
            if (!apiKey) {
                this.updateStatus('error', 'No API Key');
                Toast.show('Please configure API Key in settings', true);
                return;
            }

            try {
                this.updateStatus('solving', 'Solving...');
                const base64 = await this.getImageBase64();
                const solution = await this.solver.solve(base64);

                this.fillInput(solution);
                this.updateStatus('success', 'Solved');

            } catch (e) {
                console.error('Solver Error:', e);
                this.updateStatus('error', 'Failed');
                Toast.show(e.message, true);
            }
        }

        fillInput(text) {
            const input = document.querySelector(this.siteConfig.inputSelector);
            if (!input) {
                Toast.show('Input field not found', true);
                return;
            };

            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        initAutoSolve() {
            setTimeout(() => this.runSolve(), CONSTANTS.DELAYS.INITIAL_RUN);

            let el = document.querySelector(this.siteConfig.captchaSelector);
            if (el && !this.siteConfig.isCanvas) {
                this.observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        if (m.attributeName === 'src') {
                            setTimeout(() => this.runSolve(), CONSTANTS.DELAYS.AFTER_SRC_CHANGE);
                        }
                    }
                });
                this.observer.observe(el, { attributes: true });
            }
        }

        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new UniversalSolver());
    } else {
        new UniversalSolver();
    }
})();

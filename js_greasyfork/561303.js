// ==UserScript==
// @name         YouTube Feed Purifier
// @namespace    http://tampermonkey.net/
// @version      3.4.0
// @description  Clean YouTube homepage from sponsored, low-view, and old content
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561303/YouTube%20Feed%20Purifier.user.js
// @updateURL https://update.greasyfork.org/scripts/561303/YouTube%20Feed%20Purifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for our UI
    GM_addStyle(`
    /* YouTube Feed Purifier - Scoped Styling */
    .yt-purifier-settings-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        color: #0f0f0f;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 24px;
        z-index: 10000;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        font-family: 'Roboto', 'Arial', sans-serif;
        animation: yt-purifier-modal-appear 0.2s ease;
    }

    .yt-purifier-sections-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin: 20px 0;
    }

    @media (max-width: 700px) {
        .yt-purifier-sections-grid {
            grid-template-columns: 1fr;
        }
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
        .yt-purifier-settings-modal {
            background: #0f0f0f;
            color: #f1f1f1;
            border-color: #3a3a3a;
        }
    }

    .yt-purifier-settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
        animation: yt-purifier-fade-in 0.2s ease;
    }

    @keyframes yt-purifier-modal-appear {
        from {
            opacity: 0;
            transform: translate(-50%, -48%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }

    @keyframes yt-purifier-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .yt-purifier-section {
        margin: 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        border-left: 4px solid #3ea6ff;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-section {
            background: #212121;
        }
    }

    .yt-purifier-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 12px 0;
        padding: 8px 0;
    }

    .yt-purifier-toggle label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        line-height: 20px;
    }

    .yt-purifier-switch {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
        flex-shrink: 0;
    }

    .yt-purifier-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .yt-purifier-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .2s;
        border-radius: 34px;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-slider {
            background-color: #606060;
        }
    }

    .yt-purifier-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .2s;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    input:checked + .yt-purifier-slider {
        background-color: #3ea6ff;
    }

    input:checked + .yt-purifier-slider:before {
        transform: translateX(24px);
    }

    .yt-purifier-select {
        width: 100%;
        padding: 10px 12px;
        margin: 8px 0;
        background: white;
        color: #0f0f0f;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: 'Roboto', 'Arial', sans-serif;
        font-size: 14px;
        transition: border-color 0.2s;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-select {
            background: #0f0f0f;
            color: #f1f1f1;
            border-color: #606060;
        }
    }

    .yt-purifier-select:focus {
        outline: none;
        border-color: #3ea6ff;
    }

    .yt-purifier-input {
        width: 100%;
        padding: 10px 12px;
        margin: 8px 0;
        background: white;
        color: #0f0f0f;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: 'Roboto', 'Arial', sans-serif;
        font-size: 14px;
        transition: border-color 0.2s;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-input {
            background: #0f0f0f;
            color: #f1f1f1;
            border-color: #606060;
        }
    }

    .yt-purifier-input:focus {
        outline: none;
        border-color: #3ea6ff;
    }

    .yt-purifier-button {
        background: #3ea6ff;
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        font-family: 'Roboto', 'Arial', sans-serif;
        margin: 5px;
        transition: all 0.2s;
        min-height: 36px;
    }

    .yt-purifier-button:hover {
        background: #65b8ff;
        transform: translateY(-1px);
    }

    .yt-purifier-button-secondary {
        background: transparent;
        color: #606060;
        border: 1px solid #ddd;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-button-secondary {
            color: #aaa;
            border-color: #606060;
        }
    }

    .yt-purifier-button-secondary:hover {
        background: rgba(0,0,0,0.05);
        border-color: #aaa;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-button-secondary:hover {
            background: rgba(255,255,255,0.1);
        }
    }

    .yt-purifier-indicator {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 50, 50, 0.95);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 500;
        z-index: 1000;
        cursor: help;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-family: 'Roboto', 'Arial', sans-serif;
        letter-spacing: 0.3px;
    }

    .yt-purifier-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #0f0f0f;
        color: #f1f1f1;
        padding: 14px 24px;
        border-radius: 20px;
        border: 1px solid #3a3a3a;
        z-index: 10001;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: yt-purifier-slide-up 0.3s ease;
        font-family: 'Roboto', 'Arial', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    @keyframes yt-purifier-slide-up {
        from {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }

    .yt-purifier-stats {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #fff;
        color: #0f0f0f;
        padding: 16px;
        border-radius: 12px;
        font-size: 13px;
        z-index: 9998;
        backdrop-filter: blur(10px);
        border: 1px solid #ddd;
        min-width: 220px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        font-family: 'Roboto', 'Arial', sans-serif;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-stats {
            background: #0f0f0f;
            color: #f1f1f1;
            border-color: #3a3a3a;
        }
    }

    .yt-purifier-stats-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        font-weight: 500;
        font-size: 14px;
        color: #3ea6ff;
    }

    .yt-purifier-stats-row {
        display: flex;
        justify-content: space-between;
        margin: 6px 0;
        padding: 4px 0;
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-stats-row {
            border-bottom-color: rgba(255,255,255,0.1);
        }
    }

    .yt-purifier-stats-percentage {
        font-weight: 500;
        color: #3ea6ff;
    }

    .yt-purifier-health-score {
        margin-top: 12px;
        padding: 12px;
        background: rgba(62, 166, 255, 0.1);
        border-radius: 8px;
        text-align: center;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-health-score {
            background: rgba(62, 166, 255, 0.15);
        }
    }

    .yt-purifier-health-score-value {
        font-size: 28px;
        font-weight: 700;
        color: #3ea6ff;
        margin: 4px 0;
    }

    .yt-purifier-health-score-label {
        font-size: 11px;
        color: #606060;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-health-score-label {
            color: #aaa;
        }
    }

    .yt-purifier-help-text {
        font-size: 13px;
        color: #606060;
        margin-top: 6px;
        line-height: 1.5;
        font-weight: 400;
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-help-text {
            color: #aaa;
        }
    }

    .yt-purifier-help-section {
        margin-top: 24px;
        padding: 20px;
        background: rgba(62, 166, 255, 0.08);
        border-radius: 10px;
        border-left: 4px solid #3ea6ff;
        border-top: 1px solid rgba(62, 166, 255, 0.2);
        border-right: 1px solid rgba(62, 166, 255, 0.1);
        border-bottom: 1px solid rgba(62, 166, 255, 0.1);
    }

    @media (prefers-color-scheme: dark) {
        .yt-purifier-help-section {
            background: rgba(62, 166, 255, 0.12);
            border-color: rgba(62, 166, 255, 0.3);
        }
    }

    /* UPDATED: Fixed position floating button that works with extension conflicts */
    .yt-purifier-floating-button {
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        background: #3ea6ff !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        width: 40px !important;
        height: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 999999 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        transition: all 0.2s !important;
        font-family: 'Roboto', 'Arial', sans-serif !important;
        padding: 0 !important;
        margin: 0 !important;
        line-height: 1 !important;
        text-decoration: none !important;
    }

    .yt-purifier-floating-button:hover {
        background: #65b8ff !important;
        transform: scale(1.1) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
    }

    .yt-purifier-floating-button:active {
        transform: scale(0.95) !important;
    }

    /* Video hiding with smooth transition */
    .yt-purifier-hidden {
        opacity: 0.3 !important;
        transition: opacity 0.5s ease !important;
        pointer-events: none !important;
        user-select: none !important;
        filter: grayscale(100%) blur(1px) !important;
        transform: scale(0.98) !important;
    }

    .yt-purifier-hidden:hover {
        opacity: 0.4 !important;
    }

    /* Debug panel styling */
    .yt-purifier-debug-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(15, 15, 15, 0.95);
        color: #0f0;
        padding: 12px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        z-index: 9997;
        max-height: 300px;
        overflow-y: auto;
        max-width: 500px;
        border: 1px solid #3ea6ff;
        display: none;
        backdrop-filter: blur(10px);
    }

    .yt-purifier-debug-panel.visible {
        display: block;
    }

    .yt-purifier-debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid #0f0;
    }

    .yt-purifier-debug-close {
        color: #0f0;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
    }

    .yt-purifier-debug-log {
        margin: 4px 0;
        padding: 2px 0;
        border-bottom: 1px solid rgba(0, 255, 0, 0.2);
    }

    .yt-purifier-debug-timestamp {
        color: #8f8;
        margin-right: 8px;
    }

    .yt-purifier-debug-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #0f0;
        color: #000;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9996;
        opacity: 0.7;
    }

    .yt-purifier-debug-toggle:hover {
        opacity: 1;
    }
    `);

    // ====================
    // DEBUG LOGGER
    // ====================
    class DebugLogger {
        constructor() {
            this.logs = [];
            this.maxLogs = 100;
            this.panel = null;
            this.toggleButton = null;
            this.enabled = false;
        }

        init() {
            this.createDebugPanel();
            this.createToggleButton();
        }

        createDebugPanel() {
            this.panel = document.createElement('div');
            this.panel.className = 'yt-purifier-debug-panel';

            const header = document.createElement('div');
            header.className = 'yt-purifier-debug-header';

            const title = document.createElement('div');
            title.textContent = '🛠️ YouTube Purifier Debug Log';

            const closeButton = document.createElement('button');
            closeButton.className = 'yt-purifier-debug-close';
            closeButton.textContent = '×';
            closeButton.onclick = () => this.hidePanel();

            header.appendChild(title);
            header.appendChild(closeButton);
            this.panel.appendChild(header);

            document.body.appendChild(this.panel);
        }

        createToggleButton() {
            this.toggleButton = document.createElement('button');
            this.toggleButton.className = 'yt-purifier-debug-toggle';
            this.toggleButton.textContent = 'DEBUG';
            this.toggleButton.onclick = () => this.togglePanel();

            document.body.appendChild(this.toggleButton);
        }

        togglePanel() {
            if (this.panel.classList.contains('visible')) {
                this.hidePanel();
            } else {
                this.showPanel();
            }
        }

        showPanel() {
            this.panel.classList.add('visible');
            this.toggleButton.textContent = 'HIDE DEBUG';
            this.toggleButton.style.opacity = '1';
        }

        hidePanel() {
            this.panel.classList.remove('visible');
            this.toggleButton.textContent = 'DEBUG';
            this.toggleButton.style.opacity = '0.7';
        }

        log(message, data = null) {
            if (!this.enabled) return;

            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.className = 'yt-purifier-debug-log';

            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'yt-purifier-debug-timestamp';
            timestampSpan.textContent = `[${timestamp}]`;

            const messageSpan = document.createElement('span');
            messageSpan.textContent = message;

            logEntry.appendChild(timestampSpan);
            logEntry.appendChild(messageSpan);

            if (data) {
                const dataSpan = document.createElement('div');
                dataSpan.style.color = '#8ff';
                dataSpan.style.fontSize = '10px';
                dataSpan.style.marginTop = '2px';
                dataSpan.textContent = JSON.stringify(data, null, 2).slice(0, 200) + '...';
                logEntry.appendChild(dataSpan);
            }

            this.panel.appendChild(logEntry);
            this.logs.push({timestamp, message, data});

            // Keep only maxLogs entries
            while (this.logs.length > this.maxLogs) {
                this.logs.shift();
                if (this.panel.children.length > 1) {
                    this.panel.removeChild(this.panel.children[1]);
                }
            }

            // Auto-scroll to bottom
            this.panel.scrollTop = this.panel.scrollHeight;

            // Also log to console for development
            console.log(`[YouTube Purifier] ${message}`, data || '');
        }

        setEnabled(enabled) {
            this.enabled = enabled;
            if (enabled) {
                this.toggleButton.style.display = 'block';
                this.log('Debug logging enabled');
            } else {
                this.toggleButton.style.display = 'none';
                if (this.panel.classList.contains('visible')) {
                    this.hidePanel();
                }
            }
        }

        clear() {
            this.logs = [];
            // Remove all log entries except header
            while (this.panel.children.length > 1) {
                this.panel.removeChild(this.panel.lastChild);
            }
        }
    }

    // Create global debug logger instance
    const debugLogger = new DebugLogger();

    // ====================
    // CONFIGURATION SYSTEM
    // ====================
    const DEFAULT_CONFIG = {
        enabled: true,
        filters: {
            sponsored: {
                enabled: true,
                strictness: 'medium' // low, medium, high
            },
            lowViews: {
                enabled: true,
                threshold: 1000
            },
            oldContent: {
                enabled: true,
                maxAgeDays: 90,
                exemptCategories: ['Education', 'Science', 'Technology']
            }
        },
        ui: {
            showFilteredCount: true,
            showFilterIndicators: true,
            showToastNotifications: true,
            enableDebugLogging: false
        },
        scope: {
            homepage: true,
            subscriptions: false,
            channelPages: false
        }
    };

    class ConfigManager {
        constructor() {
            this.config = this.loadConfig();
            debugLogger.log('Config loaded', this.config);
            this.initMenuCommands();
            this.toastTimeout = null;
            this.buttonObserver = null;
            this.floatingButton = null;
            // Start button management
            this.manageFloatingButton();
        }

        loadConfig() {
            try {
                const saved = GM_getValue('yt_purifier_config');
                let config;

                if (saved) {
                    config = {...DEFAULT_CONFIG, ...saved};
                    // Clean up old config property if it exists
                    if (config.filters && config.filters.lowViews && config.filters.lowViews.exemptSubscriptions !== undefined) {
                        delete config.filters.lowViews.exemptSubscriptions;
                    }
                } else {
                    config = DEFAULT_CONFIG;
                }

                debugLogger.setEnabled(config.ui.enableDebugLogging);
                return config;
            } catch (e) {
                debugLogger.log('Error loading config, using defaults', e);
                return DEFAULT_CONFIG;
            }
        }

        saveConfig() {
            GM_setValue('yt_purifier_config', this.config);
            debugLogger.setEnabled(this.config.ui.enableDebugLogging);
            debugLogger.log('Config saved', this.config);
        }

        manageFloatingButton() {
            // Check if we should show the button on current page
            if (!this.shouldShowFloatingButton()) {
                this.removeFloatingButton();
                return;
            }

            // Create button if it doesn't exist
            if (!this.floatingButton || !document.body.contains(this.floatingButton)) {
                this.createFloatingButton();
            }

            // Set up observer to re-add button if removed by other extensions
            this.setupButtonObserver();
        }

        shouldShowFloatingButton() {
            const path = window.location.pathname;

            if (!this.config.enabled) {
                debugLogger.log('Purifier not enabled');
                return false;
            }

            if (path === '/' || path === '' || path === '/') {
                debugLogger.log('On homepage, scope.homepage =', this.config.scope.homepage);
                return this.config.scope.homepage;
            } else if (path.startsWith('/feed/subscriptions')) {
                debugLogger.log('On subscriptions, scope.subscriptions =', this.config.scope.subscriptions);
                return this.config.scope.subscriptions;
            } else if (path.startsWith('/@') || path.startsWith('/c/') || path.startsWith('/user/') || path.startsWith('/channel/')) {
                debugLogger.log('On channel page, scope.channelPages =', this.config.scope.channelPages);
                return this.config.scope.channelPages;
            }

            debugLogger.log('Not on supported page for floating button');
            return false;
        }

        createFloatingButton() {
            // Remove existing button if any
            this.removeFloatingButton();

            debugLogger.log('Creating floating button...');

            this.floatingButton = document.createElement('button');
            this.floatingButton.className = 'yt-purifier-floating-button';
            this.floatingButton.title = 'YouTube Purifier Settings';
            this.floatingButton.setAttribute('aria-label', 'YouTube Purifier Settings');

            // Create SVG icon
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '20');
            svg.setAttribute('height', '20');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('aria-hidden', 'true');

            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z');
            path1.setAttribute('fill', 'currentColor');

            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', 'M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.66 4.5 12C4.5 12.34 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.04 4.95 18.95L7.44 17.95C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z');
            path2.setAttribute('fill', 'currentColor');

            svg.appendChild(path1);
            svg.appendChild(path2);
            this.floatingButton.appendChild(svg);

            // Add click handler
            this.floatingButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openSettingsModal();
            };

            // Append to body - using fixed positioning to avoid conflicts
            document.body.appendChild(this.floatingButton);

            debugLogger.log('Floating button created and appended to body');

            // Verify button is visible
            setTimeout(() => {
                if (this.floatingButton) {
                    const rect = this.floatingButton.getBoundingClientRect();
                    const styles = window.getComputedStyle(this.floatingButton);

                    debugLogger.log('Floating button status', {
                        exists: !!this.floatingButton,
                        inDOM: document.body.contains(this.floatingButton),
                        visible: rect.width > 0 && rect.height > 0,
                        display: styles.display,
                        visibility: styles.visibility,
                        opacity: styles.opacity,
                        zIndex: styles.zIndex
                    });

                    // If button is not visible, try to force it
                    if (rect.width === 0 || rect.height === 0 || styles.display === 'none') {
                        debugLogger.log('Button not visible, attempting to fix...');
                        this.floatingButton.style.display = 'flex !important';
                        this.floatingButton.style.visibility = 'visible !important';
                        this.floatingButton.style.opacity = '1 !important';
                    }
                }
            }, 100);
        }

        removeFloatingButton() {
            if (this.floatingButton && this.floatingButton.parentNode) {
                this.floatingButton.parentNode.removeChild(this.floatingButton);
                debugLogger.log('Floating button removed');
            }
            this.floatingButton = null;
        }

        setupButtonObserver() {
            // Clean up existing observer
            if (this.buttonObserver) {
                this.buttonObserver.disconnect();
            }

            // Create new observer to watch for button removal
            this.buttonObserver = new MutationObserver((mutations) => {
                let buttonRemoved = false;

                for (const mutation of mutations) {
                    if (mutation.removedNodes.length > 0) {
                        for (const node of mutation.removedNodes) {
                            if (node === this.floatingButton ||
                                (node.contains && node.contains(this.floatingButton))) {
                                buttonRemoved = true;
                                break;
                            }
                        }
                    }

                    if (buttonRemoved) break;
                }

                if (buttonRemoved ||
                    (this.floatingButton && !document.body.contains(this.floatingButton))) {
                    debugLogger.log('Floating button was removed by another extension, re-adding...');

                    // Re-add button after a short delay
                    setTimeout(() => {
                        if (this.shouldShowFloatingButton()) {
                            this.createFloatingButton();
                        }
                    }, 1000);
                }
            });

            // Start observing the body for changes
            if (document.body) {
                this.buttonObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                debugLogger.log('Button observer started');
            }
        }

        initMenuCommands() {
            try {
                GM_registerMenuCommand('⚙️ YouTube Purifier Settings', () => this.openSettingsModal());
                GM_registerMenuCommand('🔄 Toggle Purifier', () => this.toggleEnabled());
                GM_registerMenuCommand('📊 Show Stats', () => this.showStats());
                GM_registerMenuCommand('🗑️ Reset Settings', () => this.resetSettings());
                GM_registerMenuCommand('🐛 Show Debug Panel', () => debugLogger.showPanel());
            } catch (e) {
                debugLogger.log('Error registering menu commands:', e);
            }
        }

        toggleEnabled() {
            this.config.enabled = !this.config.enabled;
            this.saveConfig();
            this.showToast(`YouTube Purifier ${this.config.enabled ? 'ENABLED' : 'DISABLED'}`);
            setTimeout(() => window.location.reload(), 1500);
        }

        showToast(message, duration = 3000) {
            if (!this.config.ui.showToastNotifications) return;

            // Remove existing toast
            const existingToast = document.querySelector('.yt-purifier-toast');
            if (existingToast) {
                existingToast.remove();
            }

            // Create new toast
            const toast = document.createElement('div');
            toast.className = 'yt-purifier-toast';

            const icon = document.createElement('span');
            icon.textContent = '🛡️';

            const text = document.createElement('span');
            text.textContent = message;

            toast.appendChild(icon);
            toast.appendChild(text);
            document.body.appendChild(toast);

            // Auto-remove after duration
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, duration);
        }

        openSettingsModal() {
            this.createSettingsModal();
        }

        showStats() {
            const stats = this.getStats();
            this.showToast(`📊 Filtered ${stats.filtered} videos out of ${stats.processed} (${stats.percentage}%)`);
        }

        getStats() {
            const stats = GM_getValue('yt_purifier_stats', { filtered: 0, processed: 0 });
            const percentage = stats.processed > 0
                ? Math.round((stats.filtered / stats.processed) * 100)
                : 0;
            return {...stats, percentage};
        }

        resetSettings() {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                this.config = DEFAULT_CONFIG;
                this.saveConfig();
                this.showToast('Settings reset to default');
                setTimeout(() => window.location.reload(), 1000);
            }
        }

        createSettingsModal() {
            // Remove existing modal if any
            const existingModal = document.querySelector('.yt-purifier-settings-modal');
            const existingOverlay = document.querySelector('.yt-purifier-settings-overlay');
            if (existingModal) existingModal.remove();
            if (existingOverlay) existingOverlay.remove();

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'yt-purifier-settings-overlay';

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'yt-purifier-settings-modal';

            // Header
            const header = document.createElement('h2');
            header.textContent = '🛡️ YouTube Purifier Settings';
            header.style.marginTop = '0';

            // Global toggle
            const globalSection = document.createElement('div');
            globalSection.className = 'yt-purifier-section';

            const globalToggle = this.createToggle(
                'Enabled',
                'enabled',
                this.config.enabled,
                'Enable or disable the entire purifier'
            );
            globalSection.appendChild(globalToggle);

            // Scope settings
            const scopeSection = document.createElement('div');
            scopeSection.className = 'yt-purifier-section';

            const scopeTitle = document.createElement('h3');
            scopeTitle.textContent = '📍 Apply On';
            scopeSection.appendChild(scopeTitle);

            const scopeToggle1 = this.createToggle(
                'Homepage',
                'scope-homepage',
                this.config.scope.homepage,
                'Apply filters on YouTube homepage'
            );
            scopeSection.appendChild(scopeToggle1);

            const scopeToggle2 = this.createToggle(
                'Subscriptions feed',
                'scope-subscriptions',
                this.config.scope.subscriptions,
                'Apply filters on subscriptions feed'
            );
            scopeSection.appendChild(scopeToggle2);

            const scopeToggle3 = this.createToggle(
                'Channel pages',
                'scope-channelpages',
                this.config.scope.channelPages,
                'Apply filters on channel/video pages'
            );
            scopeSection.appendChild(scopeToggle3);

            // Sponsored filter
            const sponsoredSection = document.createElement('div');
            sponsoredSection.className = 'yt-purifier-section';

            const sponsoredTitle = document.createElement('h3');
            sponsoredTitle.textContent = '🎯 Sponsored Content Filter';
            sponsoredSection.appendChild(sponsoredTitle);

            const sponsoredToggle = this.createToggle(
                'Filter sponsored content',
                'sponsored-enabled',
                this.config.filters.sponsored.enabled,
                'Hide videos marked as sponsored or containing promotion'
            );
            sponsoredSection.appendChild(sponsoredToggle);

            const strictnessLabel = document.createElement('label');
            strictnessLabel.textContent = 'Strictness level:';
            strictnessLabel.style.display = 'block';
            strictnessLabel.style.margin = '10px 0 5px 0';

            const strictnessSelect = document.createElement('select');
            strictnessSelect.className = 'yt-purifier-select';
            strictnessSelect.id = 'sponsored-strictness';

            const options = [
                {value: 'low', text: 'Low (only obvious ads)'},
                {value: 'medium', text: 'Medium (most promotions)'},
                {value: 'high', text: 'High (all promotional content)'}
            ];

            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                if (opt.value === this.config.filters.sponsored.strictness) {
                    option.selected = true;
                }
                strictnessSelect.appendChild(option);
            });

            sponsoredSection.appendChild(strictnessLabel);
            sponsoredSection.appendChild(strictnessSelect);

            // Low views filter
            const viewsSection = document.createElement('div');
            viewsSection.className = 'yt-purifier-section';

            const viewsTitle = document.createElement('h3');
            viewsTitle.textContent = '👁️ Low Views Filter';
            viewsSection.appendChild(viewsTitle);

            const viewsToggle = this.createToggle(
                'Filter low-view videos',
                'lowviews-enabled',
                this.config.filters.lowViews.enabled,
                'Hide videos with view count below threshold'
            );
            viewsSection.appendChild(viewsToggle);

            const thresholdLabel = document.createElement('label');
            thresholdLabel.textContent = 'Minimum views:';
            thresholdLabel.style.display = 'block';
            thresholdLabel.style.margin = '10px 0 5px 0';

            const thresholdInput = document.createElement('input');
            thresholdInput.type = 'number';
            thresholdInput.className = 'yt-purifier-input';
            thresholdInput.id = 'lowviews-threshold';
            thresholdInput.value = this.config.filters.lowViews.threshold;
            thresholdInput.min = 0;
            thresholdInput.step = 100;

            viewsSection.appendChild(thresholdLabel);
            viewsSection.appendChild(thresholdInput);

            // Old content filter
            const ageSection = document.createElement('div');
            ageSection.className = 'yt-purifier-section';

            const ageTitle = document.createElement('h3');
            ageTitle.textContent = '📅 Old Content Filter';
            ageSection.appendChild(ageTitle);

            const ageToggle = this.createToggle(
                'Filter old content',
                'age-enabled',
                this.config.filters.oldContent.enabled,
                'Hide videos older than specified days'
            );
            ageSection.appendChild(ageToggle);

            const ageLabel = document.createElement('label');
            ageLabel.textContent = 'Maximum age (days):';
            ageLabel.style.display = 'block';
            ageLabel.style.margin = '10px 0 5px 0';

            const ageInput = document.createElement('input');
            ageInput.type = 'number';
            ageInput.className = 'yt-purifier-input';
            ageInput.id = 'age-maxdays';
            ageInput.value = this.config.filters.oldContent.maxAgeDays;
            ageInput.min = 1;
            ageInput.max = 3650;

            ageSection.appendChild(ageLabel);
            ageSection.appendChild(ageInput);

            // UI settings
            const uiSection = document.createElement('div');
            uiSection.className = 'yt-purifier-section';

            const uiTitle = document.createElement('h3');
            uiTitle.textContent = '🎨 UI Settings';
            uiSection.appendChild(uiTitle);

            const uiToggle1 = this.createToggle(
                'Show filtered count',
                'ui-showcount',
                this.config.ui.showFilteredCount,
                'Display stats indicator in corner'
            );
            uiSection.appendChild(uiToggle1);

            const uiToggle2 = this.createToggle(
                'Show filter indicators',
                'ui-showindicators',
                this.config.ui.showFilterIndicators,
                'Show why videos were filtered'
            );
            uiSection.appendChild(uiToggle2);

            const uiToggle3 = this.createToggle(
                'Show toast notifications',
                'ui-shownotifications',
                this.config.ui.showToastNotifications,
                'Show temporary notifications for actions'
            );
            uiSection.appendChild(uiToggle3);

            const uiToggle4 = this.createToggle(
                'Enable debug logging',
                'ui-debug',
                this.config.ui.enableDebugLogging,
                'Show detailed debug information (for troubleshooting)'
            );
            uiSection.appendChild(uiToggle4);

            // Help section
            const helpSection = document.createElement('div');
            helpSection.className = 'yt-purifier-help-section';

            const helpTitle = document.createElement('h3');
            helpTitle.textContent = '💡 Why Filter These?';
            helpTitle.style.marginTop = '0';
            helpTitle.style.marginBottom = '12px';
            helpTitle.style.fontSize = '16px';
            helpTitle.style.color = '#3ea6ff';

            const helpContent = document.createElement('div');
            helpContent.style.fontSize = '13px';

            // Sponsored content explanation
            const sponsoredDiv = document.createElement('div');
            sponsoredDiv.style.marginBottom = '14px';

            const sponsoredStrong = document.createElement('strong');
            sponsoredStrong.textContent = '🎯 Sponsored Content: ';
            sponsoredStrong.style.color = '#3ea6ff';
            sponsoredDiv.appendChild(sponsoredStrong);

            const sponsoredText = document.createTextNode('These are paid promotions that interrupt your organic discovery. Hiding them helps maintain an authentic browsing experience.');
            sponsoredDiv.appendChild(sponsoredText);

            // Low views explanation
            const viewsDiv = document.createElement('div');
            viewsDiv.style.marginBottom = '14px';

            const viewsStrong = document.createElement('strong');
            viewsStrong.textContent = '👁️ Low Views: ';
            viewsStrong.style.color = '#3ea6ff';
            viewsDiv.appendChild(viewsStrong);

            const viewsText = document.createTextNode('Videos with very few views are often low-quality reuploads, AI-generated content, or spam. Filtering these helps surface content with community validation.');
            viewsDiv.appendChild(viewsText);

            // Old content explanation
            const oldDiv = document.createElement('div');

            const oldStrong = document.createElement('strong');
            oldStrong.textContent = '📅 Old Content: ';
            oldStrong.style.color = '#3ea6ff';
            oldDiv.appendChild(oldStrong);

            const oldText = document.createTextNode('While some evergreen content is valuable, very old videos (especially news, tech, and trends) can be outdated. This filter keeps your feed fresh.');
            oldDiv.appendChild(oldText);

            helpContent.appendChild(sponsoredDiv);
            helpContent.appendChild(viewsDiv);
            helpContent.appendChild(oldDiv);

            helpSection.appendChild(helpTitle);
            helpSection.appendChild(helpContent);

            // Buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'flex-end';
            buttonContainer.style.marginTop = '20px';
            buttonContainer.style.gap = '10px';

            const saveButton = document.createElement('button');
            saveButton.className = 'yt-purifier-button';
            saveButton.textContent = 'Save';
            saveButton.onclick = () => this.saveSettings(modal, overlay);

            const cancelButton = document.createElement('button');
            cancelButton.className = 'yt-purifier-button yt-purifier-button-secondary';
            cancelButton.textContent = 'Cancel';
            cancelButton.onclick = () => {
                modal.remove();
                overlay.remove();
            };

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(saveButton);

            // Create grid container for sections
            const sectionsGrid = document.createElement('div');
            sectionsGrid.className = 'yt-purifier-sections-grid';

            // Add sections to grid
            sectionsGrid.appendChild(scopeSection);
            sectionsGrid.appendChild(sponsoredSection);
            sectionsGrid.appendChild(viewsSection);
            sectionsGrid.appendChild(ageSection);
            sectionsGrid.appendChild(uiSection);

            // Assemble modal
            modal.appendChild(header);
            modal.appendChild(globalSection);
            modal.appendChild(sectionsGrid);
            modal.appendChild(helpSection);
            modal.appendChild(buttonContainer);

            // Add to page
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Close on overlay click
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    modal.remove();
                    overlay.remove();
                }
            };
        }

        createToggle(labelText, id, checked, tooltip) {
            const container = document.createElement('div');
            container.className = 'yt-purifier-toggle';

            const label = document.createElement('label');
            label.title = tooltip;

            const switchContainer = document.createElement('div');
            switchContainer.className = 'yt-purifier-switch';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = id;
            input.checked = checked;

            const slider = document.createElement('span');
            slider.className = 'yt-purifier-slider';

            const textSpan = document.createElement('span');
            textSpan.textContent = labelText;

            switchContainer.appendChild(input);
            switchContainer.appendChild(slider);

            label.appendChild(switchContainer);
            label.appendChild(textSpan);

            container.appendChild(label);
            return container;
        }

        saveSettings(modal, overlay) {
            // Update config from form
            this.config.enabled = document.getElementById('enabled').checked;

            // Scope settings
            this.config.scope.homepage = document.getElementById('scope-homepage').checked;
            this.config.scope.subscriptions = document.getElementById('scope-subscriptions').checked;
            this.config.scope.channelPages = document.getElementById('scope-channelpages').checked;

            this.config.filters.sponsored.enabled = document.getElementById('sponsored-enabled').checked;
            this.config.filters.sponsored.strictness = document.getElementById('sponsored-strictness').value;

            this.config.filters.lowViews.enabled = document.getElementById('lowviews-enabled').checked;
            this.config.filters.lowViews.threshold = parseInt(document.getElementById('lowviews-threshold').value) || 1000;

            this.config.filters.oldContent.enabled = document.getElementById('age-enabled').checked;
            this.config.filters.oldContent.maxAgeDays = parseInt(document.getElementById('age-maxdays').value) || 90;

            this.config.ui.showFilteredCount = document.getElementById('ui-showcount').checked;
            this.config.ui.showFilterIndicators = document.getElementById('ui-showindicators').checked;
            this.config.ui.showToastNotifications = document.getElementById('ui-shownotifications').checked;
            this.config.ui.enableDebugLogging = document.getElementById('ui-debug').checked;

            this.saveConfig();
            this.showToast('Settings saved! Reloading...');

            modal.remove();
            overlay.remove();

            setTimeout(() => window.location.reload(), 1000);
        }

        shouldRunOnCurrentPage() {
            const path = window.location.pathname;

            if (!this.config.enabled) return false;

            if (path === '/' || path === '' || path === '/') {
                return this.config.scope.homepage;
            } else if (path.startsWith('/feed/subscriptions')) {
                return this.config.scope.subscriptions;
            } else if (path.startsWith('/@') || path.startsWith('/c/') || path.startsWith('/user/') || path.startsWith('/channel/')) {
                return this.config.scope.channelPages;
            }

            // Default: only run on homepage/feed pages
            return path.startsWith('/feed');
        }
    }

    // ====================
    // FILTERING ENGINE
    // ====================
    class YouTubeFilter {
        constructor(configManager) {
            this.configManager = configManager;
            this.config = configManager.config;
            this.stats = { filtered: 0, processed: 0 };
            this.loadStats();
            this.observer = null;
            this.processedItems = new WeakSet();
            debugLogger.log('YouTubeFilter initialized', {
                enabled: this.config.enabled,
                filters: this.config.filters
            });
        }

        loadStats() {
            try {
                const saved = GM_getValue('yt_purifier_stats');
                if (saved) this.stats = saved;
            } catch (e) {
                this.stats = { filtered: 0, processed: 0 };
            }
            debugLogger.log('Loaded stats', this.stats);
        }

        saveStats() {
            GM_setValue('yt_purifier_stats', this.stats);
        }

        init() {
            if (!this.configManager.shouldRunOnCurrentPage()) {
                debugLogger.log('Script should not run on this page, skipping initialization');
                return;
            }

            debugLogger.log('Starting initialization...');

            // Initial cleanup
            this.cleanupFeed();

            // Set up observer for infinite scroll
            this.setupObserver();

            // Add stats indicator if enabled
            if (this.config.ui.showFilteredCount) {
                this.addStatsIndicator();
            }

            // Show welcome message
            if (this.config.ui.showToastNotifications) {
                setTimeout(() => {
                    this.configManager.showToast('YouTube Purifier is active', 2000);
                }, 1000);
            }

            debugLogger.log('Initialization complete');
        }

        setupObserver() {
            debugLogger.log('Setting up MutationObserver...');

            // Try multiple selectors for YouTube's content container
            const selectors = [
                '#contents',
                'ytd-rich-grid-renderer',
                '#primary',
                '#items',
                '#content',
                'ytd-browse[page-subtype="home"]'
            ];

            let targetNode = null;
            for (const selector of selectors) {
                targetNode = document.querySelector(selector);
                if (targetNode) {
                    debugLogger.log(`Found target node with selector: ${selector}`, {
                        nodeType: targetNode.nodeName,
                        id: targetNode.id,
                        className: targetNode.className
                    });
                    break;
                }
            }

            if (!targetNode) {
                debugLogger.log('No target node found, will retry in 1 second');
                setTimeout(() => this.setupObserver(), 1000);
                return;
            }

            this.observer = new MutationObserver((mutations) => {
                let shouldCleanup = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        debugLogger.log('Mutation detected with added nodes', {
                            addedNodes: mutation.addedNodes.length,
                            type: mutation.type
                        });
                        shouldCleanup = true;
                        break;
                    }
                }
                if (shouldCleanup) {
                    debugLogger.log('Scheduling cleanup...');
                    setTimeout(() => this.cleanupFeed(), 500);
                }
            });

            const observerConfig = {
                childList: true,
                subtree: true
            };

            this.observer.observe(targetNode, observerConfig);
            debugLogger.log('MutationObserver started on target node');
        }

        cleanupFeed() {
            if (!this.configManager.shouldRunOnCurrentPage()) {
                debugLogger.log('Script should not run on this page, skipping cleanup');
                return;
            }

            debugLogger.log('Starting cleanup...');

            // Try multiple selectors for video items
            const videoSelectors = [
                'ytd-rich-item-renderer',
                'ytd-video-renderer',
                '#dismissible',
                'ytd-grid-video-renderer'
            ];

            let videoItems = [];
            for (const selector of videoSelectors) {
                const items = document.querySelectorAll(selector);
                if (items.length > 0) {
                    videoItems = Array.from(items);
                    debugLogger.log(`Found ${items.length} video items with selector: ${selector}`);
                    break;
                }
            }

            if (videoItems.length === 0) {
                debugLogger.log('No video items found with any selector');
                return;
            }

            debugLogger.log(`Processing ${videoItems.length} video items`);

            videoItems.forEach((item, index) => {
                if (this.processedItems.has(item)) {
                    debugLogger.log(`Item ${index} already processed, skipping`);
                    return;
                }

                this.stats.processed++;
                let shouldHide = false;
                let reason = '';

                // Extract basic info for debugging
                const titleElement = item.querySelector('#video-title, .yt-core-attributed-string, #video-title-link');
                const title = titleElement ? titleElement.textContent.substring(0, 50) + '...' : 'No title';
                const videoId = item.getAttribute('href') || item.getAttribute('video-id') || 'unknown';

                debugLogger.log(`Processing item ${index}: ${title}`, {
                    id: videoId,
                    processed: this.stats.processed
                });

                if (this.config.filters.sponsored.enabled) {
                    const isSponsored = this.isSponsored(item);
                    debugLogger.log(`Sponsored check: ${isSponsored ? 'TRUE' : 'FALSE'}`, {
                        title: title,
                        result: isSponsored
                    });
                    if (isSponsored) {
                        shouldHide = true;
                        reason = 'Sponsored';
                    }
                }

                if (!shouldHide && this.config.filters.lowViews.enabled) {
                    const hasLowViews = this.hasLowViews(item);
                    debugLogger.log(`Low views check: ${hasLowViews ? 'TRUE' : 'FALSE'}`, {
                        title: title,
                        result: hasLowViews
                    });
                    if (hasLowViews) {
                        shouldHide = true;
                        reason = 'Low Views';
                    }
                }

                if (!shouldHide && this.config.filters.oldContent.enabled) {
                    const isTooOld = this.isTooOld(item);
                    debugLogger.log(`Old content check: ${isTooOld ? 'TRUE' : 'FALSE'}`, {
                        title: title,
                        result: isTooOld
                    });
                    if (isTooOld) {
                        shouldHide = true;
                        reason = 'Old Content';
                    }
                }

                if (shouldHide) {
                    debugLogger.log(`Hiding video: ${title} - Reason: ${reason}`);
                    this.hideVideo(item, reason);
                    this.stats.filtered++;
                } else {
                    debugLogger.log(`Keeping video: ${title} - Passed all filters`);
                }

                this.processedItems.add(item);
            });

            debugLogger.log('Cleanup complete', {
                processed: this.stats.processed,
                filtered: this.stats.filtered,
                percentage: this.stats.processed > 0 ? Math.round((this.stats.filtered / this.stats.processed) * 100) : 0
            });

            this.saveStats();
            this.updateStatsIndicator();
        }

        isSponsored(videoElement) {
            const strictness = this.config.filters.sponsored.strictness;
            let indicators = [];

            if (strictness === 'low') {
                indicators = ['[sponsored]', '#ad', 'paid partnership'];
            } else if (strictness === 'medium') {
                indicators = ['[sponsored]', '#ad', 'paid partnership', 'includes paid promotion', 'sponsored by'];
            } else { // high
                indicators = ['[sponsored]', '#ad', 'paid', 'promotion', 'sponsored', 'partner'];
            }

            // Check for sponsor thumbnail label (uBlock selector)
            const sponsorSelectors = [
                '.sponsorThumbnailLabel',
                '.sponsorThumbnailLabelVisible',
                '[class*="sponsorThumbnail"]',
                // More comprehensive selectors
                'ytd-ad-badge-renderer',
                '[aria-label*="advertisement"]',
                '[aria-label*="sponsored"]',
                '.video-ad-badge',
                '.badge-style-type-ad',
                '.ytd-badge-supported-renderer[aria-label*="ad"]'
            ];

            for (const selector of sponsorSelectors) {
                const sponsorElements = videoElement.querySelectorAll(selector);
                if (sponsorElements.length > 0) {
                    debugLogger.log(`Sponsored: Found ${sponsorElements.length} elements with selector "${selector}"`);

                    // Check if visible
                    for (const elem of sponsorElements) {
                        const style = window.getComputedStyle(elem);
                        if (style.display !== 'none' && style.visibility !== 'hidden') {
                            debugLogger.log(`Sponsored: Visible sponsor element found: ${selector}`);
                            return true;
                        }
                    }

                    // Presence alone might indicate sponsorship
                    return true;
                }
            }

            // Check title and metadata
            const titleElement = videoElement.querySelector('#video-title, .yt-core-attributed-string, #video-title-link');
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                for (const indicator of indicators) {
                    if (title.includes(indicator.toLowerCase())) {
                        debugLogger.log(`Sponsored: Found indicator "${indicator}" in title`, {title: title.substring(0, 100)});
                        return true;
                    }
                }
            }

            // Check all text content for sponsor indicators
            const allText = videoElement.textContent?.toLowerCase() || '';
            if (indicators.some(ind => allText.includes(ind.toLowerCase()))) {
                debugLogger.log(`Sponsored: Found indicator in video text`);
                return true;
            }

            return false;
        }

        hasLowViews(videoElement) {
            // First try the specific selectors we found in diagnostics
            const metadataSelectors = [
                'div.yt-content-metadata-view-model__metadata-row',
                'div.yt-lockup-metadata-view-model__metadata',
                'yt-content-metadata-view-model.yt-content-metadata-view-model',
                '#metadata-line',
                '.ytd-video-meta-block'
            ];

            for (const selector of metadataSelectors) {
                const elements = videoElement.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent || '';
                    debugLogger.log(`Checking views in ${selector}: "${text.substring(0, 100)}"`);

                    // View patterns in multiple languages
                    const viewPatterns = [
                        // Russian
                        /([\d,\.]+)\s*(тыс\.?|тысяч?|тыс\. просмотр)/i,
                        /([\d,\.]+[KMB]?)\s*просмотр/i,
                        // English
                        /([\d,\.]+[KMB]?)\s*views?/i,
                        // German
                        /([\d,\.]+[KMB]?)\s*Aufruf/i,
                        // French
                        /([\d,\.]+[KMB]?)\s*vue/i,
                        // Spanish
                        /([\d,\.]+[KMB]?)\s*visualizaci/i,
                        // Japanese
                        /([\d,\.]+[KMB]?)\s*次視聴/i,
                        // Generic
                        /([\d,\.]+[KMB]?)\s*watching/i,
                        /Live now/i
                    ];

                    for (const pattern of viewPatterns) {
                        const match = text.match(pattern);
                        if (match) {
                            let views = 0;
                            const viewStr = match[1].toUpperCase();

                            // Handle Russian "тыс" (thousand)
                            if (text.includes('тыс')) {
                                views = parseFloat(viewStr.replace(',', '.')) * 1000;
                            }
                            // Handle K, M, B suffixes
                            else if (viewStr.includes('K')) {
                                views = parseFloat(viewStr.replace('K', '')) * 1000;
                            } else if (viewStr.includes('M')) {
                                views = parseFloat(viewStr.replace('M', '')) * 1000000;
                            } else if (viewStr.includes('B')) {
                                views = parseFloat(viewStr.replace('B', '')) * 1000000000;
                            } else {
                                views = parseInt(viewStr.replace(/,/g, '')) || 0;
                            }

                            debugLogger.log(`Parsed view count: ${views} from "${viewStr}"`);

                            const result = views < this.config.filters.lowViews.threshold;
                            debugLogger.log(`Low views result: ${result} (${views} < ${this.config.filters.lowViews.threshold})`);
                            return result;
                        }
                    }
                }
            }

            // If no view count found, check if it says "No views" or similar
            const allText = videoElement.textContent || '';
            if (allText.match(/no views|0 views|без просмотр/i)) {
                return this.config.filters.lowViews.threshold > 0;
            }

            debugLogger.log('No view count found in any metadata element');
            return false;
        }

        isTooOld(videoElement) {
            // Try the specific selectors we found in diagnostics
            const metadataSelectors = [
                'div.yt-content-metadata-view-model__metadata-row',
                'div.yt-lockup-metadata-view-model__metadata',
                'yt-content-metadata-view-model.yt-content-metadata-view-model',
                'span.yt-core-attributed-string',
                '#metadata-line',
                '.ytd-video-meta-block'
            ];

            for (const selector of metadataSelectors) {
                const elements = videoElement.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent || '';
                    debugLogger.log(`Checking age in ${selector}: "${text.substring(0, 100)}"`);

                    // Age patterns in multiple languages
                    const agePatterns = [
                        // Russian
                        /(\d+)\s*(минут|час|день|недел|месяц|год)\s*назад/i,
                        /(\d+)\s*(минут|час|день|недел|месяц|год)/i,
                        // English
                        /(\d+)\s*(minutes?|hours?|days?|weeks?|months?|years?)\s*ago/i,
                        // German
                        /vor\s*(\d+)\s*(Minuten|Stunden|Tagen|Wochen|Monaten|Jahren)/i,
                        // French
                        /il\s*y\s*a\s*(\d+)\s*(minute|heure|jour|semaine|mois|an)/i,
                        // Spanish
                        /hace\s*(\d+)\s*(minuto|hora|día|semana|mes|año)/i
                    ];

                    for (const pattern of agePatterns) {
                        const match = text.match(pattern);
                        if (match) {
                            const amount = parseInt(match[1]);
                            const unit = match[2] ? match[2].toLowerCase() : '';

                            let days = 0;

                            // Russian units
                            if (unit.includes('год')) {
                                days = amount * 365;
                            } else if (unit.includes('месяц')) {
                                days = amount * 30;
                            } else if (unit.includes('недел')) {
                                days = amount * 7;
                            } else if (unit.includes('день')) {
                                days = amount;
                            } else if (unit.includes('час')) {
                                days = amount / 24;
                            } else if (unit.includes('минут')) {
                                days = amount / 1440;
                            }
                            // English units
                            else if (unit.includes('year')) {
                                days = amount * 365;
                            } else if (unit.includes('month')) {
                                days = amount * 30;
                            } else if (unit.includes('week')) {
                                days = amount * 7;
                            } else if (unit.includes('day')) {
                                days = amount;
                            } else if (unit.includes('hour')) {
                                days = amount / 24;
                            } else if (unit.includes('minute')) {
                                days = amount / 1440;
                            }
                            // German units
                            else if (unit.includes('jahr')) {
                                days = amount * 365;
                            } else if (unit.includes('monat')) {
                                days = amount * 30;
                            } else if (unit.includes('woche')) {
                                days = amount * 7;
                            } else if (unit.includes('tag')) {
                                days = amount;
                            } else if (unit.includes('stunde')) {
                                days = amount / 24;
                            } else if (unit.includes('minute')) {
                                days = amount / 1440;
                            }
                            // Default fallback
                            else {
                                const firstChar = unit.charAt(0);
                                if (firstChar === 'y') days = amount * 365;
                                else if (firstChar === 'm') {
                                    if (unit.includes('month') || unit.includes('месяц') || unit.includes('monat')) {
                                        days = amount * 30;
                                    } else {
                                        days = amount / (24 * 60);
                                    }
                                } else if (firstChar === 'w') days = amount * 7;
                                else if (firstChar === 'd') days = amount;
                                else if (firstChar === 'h') days = amount / 24;
                                else if (firstChar === 'n' || unit.includes('min')) days = amount / 1440;
                            }

                            debugLogger.log(`Age parsed: ${amount} ${unit} = ${days.toFixed(2)} days`);

                            const result = days > this.config.filters.oldContent.maxAgeDays;
                            debugLogger.log(`Too old result: ${result} (${days.toFixed(2)} > ${this.config.filters.oldContent.maxAgeDays})`);
                            return result;
                        }
                    }
                }
            }

            debugLogger.log('No age information found');
            return false;
        }

        hideVideo(videoElement, reason) {
            debugLogger.log(`Hiding video with reason: ${reason}`);

            // Apply smooth transition class
            videoElement.classList.add('yt-purifier-hidden');

            // Add filter indicator
            if (this.config.ui.showFilterIndicators) {
                const existingIndicator = videoElement.querySelector('.yt-purifier-indicator');
                if (!existingIndicator) {
                    const indicator = document.createElement('div');
                    indicator.className = 'yt-purifier-indicator';
                    indicator.textContent = `🛡️ ${reason}`;
                    indicator.title = `Filtered: ${reason}\nClick gear icon for settings`;

                    videoElement.style.position = 'relative';
                    videoElement.appendChild(indicator);

                    // Make indicator interactive
                    indicator.onclick = (e) => {
                        e.stopPropagation();
                        this.configManager.openSettingsModal();
                    };

                    indicator.style.cursor = 'pointer';
                    indicator.style.zIndex = '1000';
                }
            }
        }

        addStatsIndicator() {
            const existing = document.querySelector('.yt-purifier-stats');
            if (existing) return;

            const statsContainer = document.createElement('div');
            statsContainer.className = 'yt-purifier-stats';

            const header = document.createElement('div');
            header.className = 'yt-purifier-stats-header';

            const icon = document.createElement('span');
            icon.textContent = '🛡️';

            const title = document.createElement('span');
            title.textContent = 'Feed Purifier';

            header.appendChild(icon);
            header.appendChild(title);

            const processedRow = document.createElement('div');
            processedRow.className = 'yt-purifier-stats-row';

            const processedLabel = document.createElement('span');
            processedLabel.textContent = 'Videos Processed:';
            processedLabel.style.color = '#606060';

            const processedValue = document.createElement('span');
            processedValue.id = 'yt-purifier-processed';
            processedValue.textContent = this.stats.processed.toString();

            processedRow.appendChild(processedLabel);
            processedRow.appendChild(processedValue);

            const filteredRow = document.createElement('div');
            filteredRow.className = 'yt-purifier-stats-row';

            const filteredLabel = document.createElement('span');
            filteredLabel.textContent = 'Videos Filtered:';
            filteredLabel.style.color = '#606060';

            const filteredValue = document.createElement('span');
            filteredValue.id = 'yt-purifier-filtered';
            filteredValue.textContent = this.stats.filtered.toString();
            filteredValue.style.color = '#ff4e45';

            filteredRow.appendChild(filteredLabel);
            filteredRow.appendChild(filteredValue);

            const percentageRow = document.createElement('div');
            percentageRow.className = 'yt-purifier-stats-row';

            const percentageLabel = document.createElement('span');
            percentageLabel.textContent = 'Filter Rate:';
            percentageLabel.style.color = '#606060';

            const percentageValue = document.createElement('span');
            percentageValue.id = 'yt-purifier-percentage';
            percentageValue.className = 'yt-purifier-stats-percentage';

            percentageRow.appendChild(percentageLabel);
            percentageRow.appendChild(percentageValue);

            // Health Score Section
            const healthScore = document.createElement('div');
            healthScore.className = 'yt-purifier-health-score';

            const healthScoreLabel = document.createElement('div');
            healthScoreLabel.className = 'yt-purifier-health-score-label';
            healthScoreLabel.textContent = 'Feed Health Score';

            const healthScoreValue = document.createElement('div');
            healthScoreValue.id = 'yt-purifier-health-score';
            healthScoreValue.className = 'yt-purifier-health-score-value';

            const healthScoreDesc = document.createElement('div');
            healthScoreDesc.className = 'yt-purifier-help-text';
            healthScoreDesc.textContent = 'Higher is better';
            healthScoreDesc.style.marginTop = '4px';

            healthScore.appendChild(healthScoreLabel);
            healthScore.appendChild(healthScoreValue);
            healthScore.appendChild(healthScoreDesc);

            const hint = document.createElement('div');
            hint.className = 'yt-purifier-help-text';
            hint.style.marginTop = '12px';
            hint.textContent = 'Click gear icon for settings';

            statsContainer.appendChild(header);
            statsContainer.appendChild(processedRow);
            statsContainer.appendChild(filteredRow);
            statsContainer.appendChild(percentageRow);
            statsContainer.appendChild(healthScore);
            statsContainer.appendChild(hint);

            document.body.appendChild(statsContainer);
            this.updateStatsIndicator();

            debugLogger.log('Added enhanced stats indicator');
        }

        updateStatsIndicator() {
            if (!this.config.ui.showFilteredCount) return;

            const processedElem = document.getElementById('yt-purifier-processed');
            const filteredElem = document.getElementById('yt-purifier-filtered');
            const percentageElem = document.getElementById('yt-purifier-percentage');
            const healthScoreElem = document.getElementById('yt-purifier-health-score');

            if (!processedElem || !filteredElem || !percentageElem || !healthScoreElem) return;

            processedElem.textContent = this.stats.processed.toString();
            filteredElem.textContent = this.stats.filtered.toString();

            const percentage = this.stats.processed > 0
                ? Math.round((this.stats.filtered / this.stats.processed) * 100)
                : 0;
            percentageElem.textContent = `${percentage}%`;

            // Calculate health score (100 - filter percentage, but with bonus for keeping quality content)
            // Base score: 100% - filter rate, adjusted to favor moderate filtering
            const filterRate = this.stats.processed > 0 ? this.stats.filtered / this.stats.processed : 0;

            // Ideal filtering is around 20-40% for optimal feed health
            let healthScore;
            if (filterRate === 0) {
                healthScore = 70; // No filtering = moderate health (ads still there)
            } else if (filterRate <= 0.1) {
                healthScore = 75 + (filterRate * 100); // Light filtering
            } else if (filterRate <= 0.3) {
                healthScore = 80 + (filterRate * 50); // Good filtering range
            } else if (filterRate <= 0.5) {
                healthScore = 85 + (filterRate * 30); // Heavy filtering
            } else {
                healthScore = 90; // Maximum
            }

            // Cap at 100
            healthScore = Math.min(100, Math.round(healthScore));

            // Color code based on score
            if (healthScore >= 90) {
                healthScoreElem.style.color = '#2ba640';
            } else if (healthScore >= 70) {
                healthScoreElem.style.color = '#3ea6ff';
            } else {
                healthScoreElem.style.color = '#ffa500';
            }

            healthScoreElem.textContent = `${healthScore}`;
        }
    }

    // ====================
    // INITIALIZATION
    // ====================
    function init() {
        // Initialize debug logger first
        debugLogger.init();
        debugLogger.log('=== YouTube Purifier Starting ===');

        // Wait for page to load
        if (!document.body) {
            debugLogger.log('Document body not ready, waiting...');
            setTimeout(init, 100);
            return;
        }

        debugLogger.log('Document body ready, initializing...');

        const configManager = new ConfigManager();
        const filter = new YouTubeFilter(configManager);

        // Initialize after a short delay to ensure YouTube's DOM is fully loaded
        setTimeout(() => {
            debugLogger.log('Delayed initialization starting...');
            filter.init();
        }, 3000);

        // Show initial notification
        if (configManager.config.enabled && configManager.config.ui.showToastNotifications && configManager.shouldRunOnCurrentPage()) {
            setTimeout(() => {
                configManager.showToast('YouTube Purifier is active', 2000);
            }, 4000);
        }

        // Re-initialize on page changes (SPA navigation)
        let lastUrl = location.href;
        const pageObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                debugLogger.log(`Page changed: ${lastUrl} -> ${url}`);
                lastUrl = url;

                // Re-manage floating button
                setTimeout(() => {
                    configManager.manageFloatingButton();
                    debugLogger.log('Re-initializing after page change...');
                    debugLogger.clear();
                    filter.init();
                }, 2000);
            }
        });

        pageObserver.observe(document, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['href']
        });

        debugLogger.log('Page observer set up');
    }

    // Start the script
    if (document.readyState === 'loading') {
        debugLogger.log('Document still loading, adding DOMContentLoaded listener');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        debugLogger.log('Document already loaded, initializing now');
        init();
    }

})();
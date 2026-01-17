// ==UserScript==
// @name         ▶ Open YouTube Optimizer (EN ver.)
// @name:ru      ▶ Open YouTube Optimizer (RU ver.)
// @version      1.1
// @description    Script that improves YouTube's performance and simplifies its interface
// @description:ru Скрипт улучшающий производительность и упрощающий интерфейс YouTube
// @author       | tg: @lag_cs | github: tglagcs |
// @match        https://*.youtube.com/*
// @match        https://*.youtube-nocookie.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-start
// @license      MIT
// @icon         https://raw.githubusercontent.com/tglagcs/OYO/refs/heads/main/imgs/OYO%20ICO.png
// @namespace https://greasyfork.org/users/1561081
// @downloadURL https://update.greasyfork.org/scripts/562908/%E2%96%B6%20Open%20YouTube%20Optimizer%20%28EN%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562908/%E2%96%B6%20Open%20YouTube%20Optimizer%20%28EN%20ver%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============================================================================
    // CONFIGURATION SYSTEM
    // ============================================================================
    const DEFAULT_CONFIG = {
        // Main settings
        disableAnimations: true,
        throttleTimers: true,
        removeJunkUI: true,

        // Advanced settings
        removeShorts: true,
        removeComments: true,
        disableAutoplay: true,
        simplifyUI: true,
        limitVideoQuality: true,
        maxQuality: '1080p',

        // Experimental
        lazyLoadImages: true,

        // UI settings
        showSettingsButton: true
    };

    // Load saved configuration
    function loadConfig() {
        try {
            const saved = GM_getValue('ytOptimizerConfig');
            if (saved) {
                return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load config:', e);
        }
        return DEFAULT_CONFIG;
    }

    // Save configuration
    function saveConfig(config) {
        try {
            GM_setValue('ytOptimizerConfig', JSON.stringify(config));
            return true;
        } catch (e) {
            console.error('Failed to save config:', e);
            return false;
        }
    }

    // Initialize configuration
    let CONFIG = loadConfig();

    // Check for duplicate injection
    if (window.__ytOptimizerProInjected) return;
    window.__ytOptimizerProInjected = true;

    // ============================================================================
    // UTILITIES
    // ============================================================================
    class Logger {
        static enabled = true;
        static prefix = '[YT-Optimizer Pro]';

        static log(message, data = null) {
            if (!this.enabled) return;
            console.log(`${this.prefix} ${message}`, data || '');
        }

        static warn(message) {
            console.warn(`${this.prefix} ⚠ ${message}`);
        }

        static error(message, error) {
            console.error(`${this.prefix} ❌ ${message}`, error);
        }
    }

    // Safe execution with error handling
    function safeExecute(fn, name) {
        try {
            return fn();
        } catch (error) {
            Logger.error(`Error in ${name}:`, error);
            return null;
        }
    }

    // ============================================================================
    // SETTINGS UI (SIMPLIFIED VERSION)
    // ============================================================================
    class SettingsUI {
        constructor() {
            this.isOpen = false;
            this.modal = null;
            this.overlay = null;
            this.settingsButton = null;
            this.isFullscreen = false;
            this.initialize();
        }

        initialize() {
            // Create settings button if enabled
            if (CONFIG.showSettingsButton) {
                this.createSettingsButton();
            }

            // Register Tampermonkey menu command
            try {
                GM_registerMenuCommand('⚙ Open YouTube Optimizer Settings', () => this.open());
            } catch (e) {
                Logger.log('GM_registerMenuCommand not available');
            }

            // Add fullscreen mode handlers
            this.setupFullscreenHandlers();
        }

        setupFullscreenHandlers() {
            // Listen to fullscreen events
            document.addEventListener('fullscreenchange', () => {
                this.checkFullscreen();
            });

            document.addEventListener('webkitfullscreenchange', () => {
                this.checkFullscreen();
            });

            document.addEventListener('mozfullscreenchange', () => {
                this.checkFullscreen();
            });

            document.addEventListener('MSFullscreenChange', () => {
                this.checkFullscreen();
            });

            // Also listen to YouTube player events
            document.addEventListener('yt-fullscreen-change', (e) => {
                this.isFullscreen = e.detail.isFullscreen;
                this.updateButtonVisibility();
            });

            // Periodic state check
            setInterval(() => {
                this.checkFullscreen();
            }, 1000);
        }

        checkFullscreen() {
            const isFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                document.querySelector('.html5-video-player[fullscreen]') ||
                document.querySelector('.html5-video-player.ytp-fullscreen')
            );

            if (this.isFullscreen !== isFullscreen) {
                this.isFullscreen = isFullscreen;
                this.updateButtonVisibility();
            }
        }

        updateButtonVisibility() {
            if (!this.settingsButton) return;

            if (this.isFullscreen) {
                this.settingsButton.style.display = 'none';
                Logger.log('Settings button hidden (fullscreen mode)');
            } else {
                this.settingsButton.style.display = 'flex';
                Logger.log('Settings button shown (normal mode)');
            }
        }

        createSettingsButton() {
            this.settingsButton = document.createElement('button');
            this.settingsButton.id = 'yt-optimizer-settings-btn';
            this.settingsButton.innerHTML = '⚡';
            this.settingsButton.title = 'Open YouTube Optimizer Settings';
            this.settingsButton.setAttribute('aria-label', 'Open YouTube Optimizer Settings');

            const buttonStyle = {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '10000',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                color: 'white',
                border: '2px solid white',
                fontSize: '24px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none'
            };

            Object.assign(this.settingsButton.style, buttonStyle);

            // Add hover animation
            this.settingsButton.addEventListener('mouseenter', () => {
                if (!this.isFullscreen) {
                    this.settingsButton.style.transform = 'scale(1.1) rotate(15deg)';
                    this.settingsButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
                }
            });

            this.settingsButton.addEventListener('mouseleave', () => {
                if (!this.isFullscreen) {
                    this.settingsButton.style.transform = 'scale(1) rotate(0deg)';
                    this.settingsButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                }
            });

            this.settingsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.open();
            });

            // Add smooth appearance
            setTimeout(() => {
                this.settingsButton.style.opacity = '0';
                document.body.appendChild(this.settingsButton);
                requestAnimationFrame(() => {
                    this.settingsButton.style.transition = 'opacity 0.5s ease';
                    this.settingsButton.style.opacity = '1';
                });
            }, 1000);
        }

        createModal() {
            // Overlay
            this.overlay = document.createElement('div');
            Object.assign(this.overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: '9998',
                backdropFilter: 'blur(4px)',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });

            // Modal window
            this.modal = document.createElement('div');
            Object.assign(this.modal.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.9)',
                background: '#0f0f0f',
                color: 'white',
                borderRadius: '16px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'auto',
                zIndex: '9999',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                opacity: '0',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: '16px',
                lineHeight: '1.5'
            });

            // Close on overlay click
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        generateSettingsHTML() {
            const categories = {
                'Main Settings': [
                    { key: 'disableAnimations', label: 'Disable animations', description: 'Removes CSS animations and transitions' },
                    { key: 'throttleTimers', label: 'Optimize timers', description: 'Slows down background timers to save resources' },
                    { key: 'removeJunkUI', label: 'Remove unnecessary elements', description: 'Removes unnecessary interface elements' },
                ],
                'Content Optimization': [
                    { key: 'removeShorts', label: 'Remove Shorts', description: 'Hides all Shorts from homepage and recommendations' },
                    { key: 'removeComments', label: 'Remove comments', description: 'Hides comments section' },
                    { key: 'simplifyUI', label: 'Simplified interface', description: 'Removes sidebar and recommendations' },
                    { key: 'disableAutoplay', label: 'Disable autoplay', description: 'Disables next video autoplay' },
                ],
                'Video Quality': [
                    {
                        key: 'limitVideoQuality',
                        label: 'Limit video quality',
                        description: 'Automatically sets maximum quality'
                    },
                    {
                        type: 'select',
                        key: 'maxQuality',
                        label: 'Maximum quality',
                        options: [
                            { value: '360p', label: '360p' },
                            { value: '480p', label: '480p' },
                            { value: '720p', label: '720p (HD)' },
                            { value: '1080p', label: '1080p (Full HD)' },
                            { value: '1440p', label: '1440p (2K)' },
                            { value: '2160p', label: '2160p (4K)' }
                        ],
                        disabled: !CONFIG.limitVideoQuality
                    }
                ],
                'Experimental': [
                    { key: 'lazyLoadImages', label: 'Lazy loading', description: 'Optimizes image loading (experimental)' },
                ],
                'Interface': [
                    { key: 'showSettingsButton', label: 'Show settings button', description: 'Show floating settings button' }
                ]
            };

            const appliedFeatures = Object.values(CONFIG).filter(v => v === true).length;

            return `
                <div style="margin-bottom: 24px;">
                    <h2 style="margin: 0 0 12px 0; color: #fff; font-size: 28px; display: flex; align-items: center; gap: 10px;">
                        <span style="background: linear-gradient(135deg, #ff0000, #cc0000); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">⚡</span>
                        Open YouTube Optimizer by @lag_cs
                    </h2>
                    <p style="margin: 0; color: #aaa; font-size: 16px;">Version 1.1</p>
                </div>

                <div style="background: #1a1a1a; padding: 16px; border-radius: 10px; margin-bottom: 24px; border-left: 4px solid #ff0000;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 500; font-size: 16px;">
                            Applied optimizations: <strong style="color: #4CAF50;">${appliedFeatures}</strong>
                        </span>
                    </div>
                </div>

                ${Object.entries(categories).map(([categoryName, settings]) => `
                    <div style="margin-bottom: 28px;">
                        <h3 style="
                            margin: 0 0 16px 0;
                            color: #fff;
                            font-size: 20px;
                            padding-bottom: 10px;
                            border-bottom: 2px solid #333;
                            font-weight: 600;
                        ">
                            ${categoryName}
                        </h3>
                        ${settings.map(setting => this.renderSetting(setting)).join('')}
                    </div>
                `).join('')}

                <div style="
                    display: flex;
                    gap: 16px;
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 2px solid #333;
                ">
                    <button
                        id="yt-optimizer-apply"
                        style="
                            flex: 1;
                            padding: 16px 24px;
                            background: linear-gradient(135deg, #ff0000, #cc0000);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 18px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 12px;
                        "
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Apply and reload
                    </button>
                    <button
                        id="yt-optimizer-reset"
                        style="
                            padding: 16px 24px;
                            background: #333;
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: background 0.2s;
                            font-weight: 500;
                        "
                    >
                        Reset
                    </button>
                </div>

                <div style="
                    margin-top: 20px;
                    font-size: 14px;
                    color: #666;
                    text-align: center;
                    padding: 12px;
                    background: #1a1a1a;
                    border-radius: 8px;
                ">
                    ⚠ Changes will take effect after page reload
                </div>
            `;
        }

        renderSetting(setting) {
            if (setting.type === 'select') {
                const isDisabled = setting.disabled || false;
                return `
                    <div style="
                        margin-bottom: 20px;
                        opacity: ${isDisabled ? '0.5' : '1'};
                        padding: 16px;
                        background: #1a1a1a;
                        border-radius: 10px;
                    ">
                        <label style="
                            display: block;
                            margin-bottom: 10px;
                            font-weight: 600;
                            color: #fff;
                            font-size: 16px;
                        ">
                            ${setting.label}
                        </label>
                        <select
                            id="setting-${setting.key}"
                            style="
                                width: 100%;
                                padding: 12px 16px;
                                background: #2a2a2a;
                                color: white;
                                border: 1px solid #444;
                                border-radius: 8px;
                                font-size: 16px;
                                outline: none;
                                transition: border-color 0.2s;
                                cursor: pointer;
                            "
                            ${isDisabled ? 'disabled' : ''}
                        >
                            ${setting.options.map(opt => `
                                <option value="${opt.value}" ${CONFIG[setting.key] === opt.value ? 'selected' : ''}>
                                    ${opt.label}
                                </option>
                            `).join('')}
                        </select>
                        ${setting.description ? `
                            <div style="
                                font-size: 14px;
                                color: #aaa;
                                margin-top: 8px;
                                line-height: 1.4;
                            ">
                                ${setting.description}
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                const isChecked = CONFIG[setting.key];
                return `
                    <div style="
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 20px;
                        padding: 16px;
                        background: #1a1a1a;
                        border-radius: 10px;
                        transition: background 0.2s;
                        border: 1px solid #2a2a2a;
                    ">
                        <div style="flex-shrink: 0; margin-right: 16px;">
                            <input
                                type="checkbox"
                                id="setting-${setting.key}"
                                ${isChecked ? 'checked' : ''}
                                style="
                                    width: 22px;
                                    height: 22px;
                                    margin: 0;
                                    cursor: pointer;
                                    accent-color: #ff0000;
                                "
                            >
                        </div>
                        <div style="flex-grow: 1;">
                            <label
                                for="setting-${setting.key}"
                                style="
                                    display: block;
                                    font-weight: 600;
                                    color: #fff;
                                    margin-bottom: 6px;
                                    cursor: pointer;
                                    font-size: 16px;
                                "
                            >
                                ${setting.label}
                            </label>
                            ${setting.description ? `
                                <div style="
                                    font-size: 14px;
                                    color: #aaa;
                                    line-height: 1.4;
                                ">
                                    ${setting.description}
                                </div>
                            ` : ''}
                        </div>
                        <div style="flex-shrink: 0; margin-left: 16px;">
                            <span style="
                                display: inline-block;
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                background: ${isChecked ? '#4CAF50' : '#666'};
                            "></span>
                        </div>
                    </div>
                `;
            }
        }

        open() {
            if (this.isOpen) return;

            this.createModal();
            this.modal.innerHTML = this.generateSettingsHTML();

            document.body.appendChild(this.overlay);
            document.body.appendChild(this.modal);

            // Appearance animation
            requestAnimationFrame(() => {
                this.overlay.style.opacity = '1';
                this.modal.style.opacity = '1';
                this.modal.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            this.isOpen = true;
            this.addEventListeners();
        }

        addEventListeners() {
            // Process all settings elements
            Object.keys(CONFIG).forEach(key => {
                const element = document.getElementById(`setting-${key}`);
                if (!element) return;

                if (element.type === 'checkbox') {
                    element.addEventListener('change', (e) => {
                        CONFIG[key] = e.target.checked;

                        // Special case for limitVideoQuality
                        if (key === 'limitVideoQuality') {
                            const qualitySelect = document.getElementById('setting-maxQuality');
                            if (qualitySelect) {
                                qualitySelect.disabled = !e.target.checked;
                                qualitySelect.style.opacity = e.target.checked ? '1' : '0.5';
                            }
                        }

                        // Special case for showSettingsButton
                        if (key === 'showSettingsButton') {
                            if (e.target.checked) {
                                if (!this.settingsButton) {
                                    this.createSettingsButton();
                                } else {
                                    this.settingsButton.style.display = 'flex';
                                }
                            } else if (this.settingsButton) {
                                this.settingsButton.style.display = 'none';
                            }
                        }
                    });
                } else if (element.tagName === 'SELECT') {
                    element.addEventListener('change', (e) => {
                        CONFIG[key] = e.target.value;
                    });
                }
            });

            // Apply button
            const applyBtn = document.getElementById('yt-optimizer-apply');
            applyBtn.addEventListener('mouseenter', () => {
                applyBtn.style.transform = 'translateY(-2px)';
                applyBtn.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.3)';
            });

            applyBtn.addEventListener('mouseleave', () => {
                applyBtn.style.transform = 'translateY(0)';
                applyBtn.style.boxShadow = 'none';
            });

            applyBtn.addEventListener('click', () => this.applySettings());

            // Reset button
            document.getElementById('yt-optimizer-reset').addEventListener('click', () => {
                if (confirm('Reset all settings to default values?')) {
                    CONFIG = { ...DEFAULT_CONFIG };
                    this.rebuildModal();
                }
            });

            // Close on outside click
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        rebuildModal() {
            if (!this.isOpen) return;

            // Save scroll position
            const scrollTop = this.modal.scrollTop;

            // Rebuild content
            this.modal.innerHTML = this.generateSettingsHTML();
            this.addEventListeners();

            // Restore scroll position
            setTimeout(() => {
                this.modal.scrollTop = scrollTop;
            }, 10);
        }

        applySettings() {
            if (saveConfig(CONFIG)) {
                // Show notification
                this.showNotification('Settings saved. Reloading in 2 seconds...', 'success');

                // Update button
                const applyBtn = document.getElementById('yt-optimizer-apply');
                applyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Saved...
                `;
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.7';

                // Reload page after 2 seconds
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                this.showNotification('Error saving settings', 'error');
            }
        }

        showNotification(message, type = 'info') {
            try {
                GM_notification({
                    text: message,
                    title: 'Open YouTube Optimizer',
                    timeout: 3000
                });
            } catch (e) {
                // Fallback notification
                this.showFallbackNotification(message, type);
            }
        }

        showFallbackNotification(message, type) {
            const notification = document.createElement('div');
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
                color: 'white',
                padding: '16px 20px',
                borderRadius: '10px',
                zIndex: '10001',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                animation: 'slideIn 0.3s ease',
                fontFamily: 'inherit',
                fontSize: '16px',
                maxWidth: '400px'
            });

            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' :
                          type === 'error' ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' :
                          '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
                    </svg>
                    <span>${message}</span>
                </div>
            `;

            document.body.appendChild(notification);

            // Add CSS for animation
            if (!document.getElementById('notification-animation')) {
                const style = document.createElement('style');
                style.id = 'notification-animation';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        close() {
            if (!this.isOpen) return;

            this.modal.style.opacity = '0';
            this.modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            this.overlay.style.opacity = '0';

            setTimeout(() => {
                if (this.modal && this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                }
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                this.modal = null;
                this.overlay = null;
                this.isOpen = false;
            }, 300);
        }
    }

    // ============================================================================
    // ANIMATION DISABLER
    // ============================================================================
    function disableAnimations() {
        if (!CONFIG.disableAnimations) return;

        const css = `
            ytd-app,
            ytd-page-manager,
            ytd-browse,
            ytd-watch-flexy,
            #columns,
            #primary,
            #secondary,
            ytd-rich-item-renderer,
            ytd-video-renderer,
            ytd-compact-video-renderer {
                animation: none !important;
                animation-delay: 0ms !important;
                animation-duration: 0ms !important;
                transition: none !important;
                transition-delay: 0ms !important;
                transition-duration: 0ms !important;
            }

            html {
                scroll-behavior: auto !important;
            }

            video,
            ytd-player,
            .html5-video-player,
            #movie_player {
                animation: initial !important;
                transition: initial !important;
            }

            ytd-button-renderer,
            yt-icon-button,
            button,
            [role="button"] {
                transition: opacity 0.1s !important;
            }
        `;

        const style = document.createElement('style');
        style.id = 'yt-optimizer-animations';
        style.textContent = css;
        document.head.appendChild(style);

        Logger.log('Animations disabled');
    }

    // ============================================================================
    // TIMER OPTIMIZER
    // ============================================================================
    function optimizeTimers() {
        if (!CONFIG.throttleTimers) return;

        const timerStats = {
            totalThrottled: 0,
            lastReport: Date.now()
        };

        // ONLY for long timers
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {
            // Don't touch video-related timers and short timers
            if (delay < 1000) {
                return originalSetInterval(callback, delay, ...args);
            }

            const throttledDelay = Math.max(delay, 2000); // Minimum 2 seconds for long timers
            timerStats.totalThrottled++;
            Logger.log(`Throttled setInterval from ${delay}ms to ${throttledDelay}ms`);
            return originalSetInterval(callback, throttledDelay, ...args);
        };

        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            // Don't touch critical timers
            if (delay < 100) {
                return originalSetTimeout(callback, delay, ...args);
            }

            // Only for very long timeouts
            if (delay > 5000) {
                const throttledDelay = Math.max(delay, 10000); // Minimum 10 seconds
                timerStats.totalThrottled++;
                Logger.log(`Throttled setTimeout from ${delay}ms to ${throttledDelay}ms`);
                return originalSetTimeout(callback, throttledDelay, ...args);
            }

            return originalSetTimeout(callback, delay, ...args);
        };

        // DON'T touch requestAnimationFrame for video stability
        Logger.log('Safe timer optimization enabled');
    }

    // ============================================================================
    // UI CLEANER
    // ============================================================================
    function cleanUI() {
        if (!CONFIG.removeJunkUI) return;

        const removalSelectors = [
            // Short videos (Shorts)
            CONFIG.removeShorts && '[is-shorts]',
            CONFIG.removeShorts && 'ytd-reel-shelf-renderer',
            CONFIG.removeShorts && 'ytd-rich-shelf-renderer[title*="Shorts"]',
            CONFIG.removeShorts && '#shorts-container',

            // Unnecessary interface elements
            'ytd-mini-guide-renderer',
            'ytd-notification-topbar-button-renderer',
            'ytd-guide-entry-renderer[title*="Premium"]',
            'ytd-guide-entry-renderer[title*="YouTube Music"]',

            // Comments (optional)
            CONFIG.removeComments && '#comments',
            CONFIG.removeComments && 'ytd-comments',

            // Additional elements
            'ytd-merch-shelf-renderer',
            'ytd-clarification-renderer',
            'ytd-info-panel-container-renderer'
        ].filter(Boolean);

        // Interface simplification
        if (CONFIG.simplifyUI) {
            removalSelectors.push(
                '#secondary',
                '#related',
                'ytd-watch-next-secondary-results-renderer',
                '.ytp-ce-element',
                '.ytp-cards-teaser'
            );
        }

        const observer = new MutationObserver((mutations) => {
            safeExecute(() => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        removalSelectors.forEach(selector => {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1) {
                                    node.querySelectorAll?.(selector)?.forEach(el => {
                                        if (!el.closest('ytd-player')) {
                                            el.remove();
                                            Logger.log(`Removed: ${selector}`);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }, 'UI Cleaner Mutation');
        });

        // Initial cleanup
        setTimeout(() => {
            safeExecute(() => {
                removalSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        if (!el.closest('ytd-player')) {
                            el.remove();
                        }
                    });
                });
            }, 'Initial UI Clean');
        }, 2000);

        // Observe changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        Logger.log('UI cleaner activated');
    }

    // ============================================================================
    // VIDEO QUALITY LIMITER
    // ============================================================================
    function setupQualityLimiter() {
        if (!CONFIG.limitVideoQuality) return;

        const qualityMap = {
            '360p': 'medium',
            '480p': 'large',
            '720p': 'hd720',
            '1080p': 'hd1080',
            '1440p': 'hd1440',
            '2160p': 'hd2160'
        };

        const targetQuality = qualityMap[CONFIG.maxQuality];
        if (!targetQuality) {
            Logger.warn(`Unknown quality setting: ${CONFIG.maxQuality}`);
            return;
        }

        Logger.log(`Setting up quality limiter to: ${CONFIG.maxQuality} (${targetQuality})`);

        let qualityApplied = false;
        let checkInterval = null;

        // Function to check and set quality
        function checkAndSetQuality() {
            const video = document.querySelector('video');
            if (!video) return false;

            // Try to find YouTube player
            const player = document.querySelector('#movie_player') ||
                          document.querySelector('.html5-video-player') ||
                          document.querySelector('ytd-player');

            if (!player) return false;

            // Attempt 1: Through YouTube data attributes
            try {
                // Set preferred quality via dataset
                player.dataset.preferredQuality = targetQuality;
                player.dataset.quality = targetQuality;

                // YouTube player might have special attribute
                if (player.setPlaybackQualityRange) {
                    player.setPlaybackQualityRange(targetQuality, targetQuality);
                    Logger.log(`Quality range set to: ${targetQuality}`);
                    return true;
                }
            } catch (e) {}

            // Attempt 2: Through events and properties
            try {
                // Send custom event
                const qualityEvent = new CustomEvent('playbackqualitychange', {
                    detail: { quality: targetQuality }
                });
                player.dispatchEvent(qualityEvent);

                // Try to set via properties
                if (video.playbackQuality && video.playbackQuality !== targetQuality) {
                    video.playbackQuality = targetQuality;
                    Logger.log(`Playback quality set to: ${targetQuality}`);
                    return true;
                }

                if (video.suggestedQuality && video.suggestedQuality !== targetQuality) {
                    video.suggestedQuality = targetQuality;
                    Logger.log(`Suggested quality set to: ${targetQuality}`);
                    return true;
                }
            } catch (e) {}

            // Attempt 3: Through quality menu interception
            try {
                // Find quality settings button
                const settingsButton = document.querySelector('.ytp-settings-button');
                if (settingsButton) {
                    // Open settings menu
                    settingsButton.click();

                    setTimeout(() => {
                        // Find quality menu items
                        const qualityMenuItems = document.querySelectorAll('.ytp-settings-menu .ytp-menuitem');
                        qualityMenuItems.forEach(item => {
                            const label = item.textContent || '';
                            if (label.includes('Quality') || label.includes('Quality')) {
                                // Click on quality item
                                item.click();

                                setTimeout(() => {
                                    // Find target quality in submenu
                                    const targetQualityItem = Array.from(
                                        document.querySelectorAll('.ytp-quality-menu .ytp-menuitem')
                                    ).find(menuItem => {
                                        const text = menuItem.textContent || '';
                                        return text.includes(CONFIG.maxQuality) ||
                                               text.includes(targetQuality);
                                    });

                                    if (targetQualityItem) {
                                        targetQualityItem.click();
                                        Logger.log(`Quality selected from menu: ${CONFIG.maxQuality}`);
                                        qualityApplied = true;
                                    }

                                    // Close menu
                                    settingsButton.click();
                                }, 300);
                            }
                        });
                    }, 300);
                }
            } catch (e) {}

            return false;
        }

        // Quality monitoring function
        function monitorQuality() {
            if (qualityApplied) return;

            const success = checkAndSetQuality();
            if (success) {
                qualityApplied = true;
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }
                Logger.log(`Quality successfully limited to ${CONFIG.maxQuality}`);
            }
        }

        // Start monitoring with delay
        setTimeout(() => {
            monitorQuality();

            // Periodic check
            checkInterval = setInterval(monitorQuality, 3000);

            // Stop checking after 30 seconds
            setTimeout(() => {
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                    if (!qualityApplied) {
                        Logger.warn(`Failed to set quality to ${CONFIG.maxQuality} after 30 seconds`);
                    }
                }
            }, 30000);
        }, 3000);

        // Handler for new videos (SPA navigation)
        document.addEventListener('yt-navigate-finish', () => {
            qualityApplied = false;
            setTimeout(() => {
                monitorQuality();

                if (!checkInterval) {
                    checkInterval = setInterval(monitorQuality, 3000);
                }
            }, 2000);
        });

        // Intercept clicks on quality menu
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.closest('.ytp-settings-button') ||
                target.closest('[aria-label*="quality"]') ||
                target.closest('[aria-label*="quality"]')) {

                // After clicking quality menu, reapply settings
                setTimeout(() => {
                    if (!qualityApplied) {
                        monitorQuality();
                    }
                }, 1000);
            }
        });

        Logger.log('Quality limiter initialized');
    }

    // ============================================================================
    // PLAYER OPTIMIZER
    // ============================================================================
    function optimizePlayer() {
        // Disable autoplay
        if (CONFIG.disableAutoplay) {
            const disableAutoplay = () => {
                const autoplayToggle = document.querySelector('.ytp-autonav-toggle-button');
                if (autoplayToggle?.getAttribute('aria-checked') === 'true') {
                    autoplayToggle.click();
                    Logger.log('Autoplay disabled');
                    return true;
                }
                return false;
            };

            // First attempt
            setTimeout(disableAutoplay, 3000);

            // Observe changes
            const observer = new MutationObserver(() => {
                disableAutoplay();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Video quality limiter
        if (CONFIG.limitVideoQuality) {
            setupQualityLimiter();
        }
    }

    // ============================================================================
    // LAZY LOADING
    // ============================================================================
    function optimizeLazyLoading() {
        if (!CONFIG.lazyLoadImages) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '200px',
            threshold: 0.01
        });

        new MutationObserver(() => {
            document.querySelectorAll('img[data-src]:not([src])').forEach(img => {
                observer.observe(img);
            });
        }).observe(document.body, {
            childList: true,
            subtree: true
        });

        Logger.log('Lazy loading optimized');
    }

    // ============================================================================
    // MAIN INITIALIZATION
    // ============================================================================
    function initialize() {
        Logger.log('Initializing Open YouTube Optimizer v1.1...');
        Logger.log('Config loaded:', CONFIG);

        // Initialize UI
        const settingsUI = new SettingsUI();
        window.ytOptimizerUI = settingsUI;

        // Apply optimizations
        const optimizations = [
            { fn: disableAnimations, name: 'Disable Animations' },
            { fn: optimizeTimers, name: 'Optimize Timers' },
            { fn: cleanUI, name: 'Clean UI' },
            { fn: optimizePlayer, name: 'Optimize Player' },
            { fn: optimizeLazyLoading, name: 'Lazy Load Optimization' }
        ];

        optimizations.forEach(({ fn, name }) => {
            safeExecute(fn, name);
        });

        Logger.log('Open YouTube Optimizer fully initialized');

        // Statistics
        setTimeout(() => {
            const appliedCount = Object.values(CONFIG).filter(v => v === true).length;
            Logger.log(`Applied ${appliedCount} optimizations out of ${Object.keys(CONFIG).length}`);
        }, 3000);
    }

    // ============================================================================
    // STARTUP LOGIC
    // ============================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initialize, 100);
        });
    } else {
        setTimeout(initialize, 100);
    }

    // Handle SPA navigation (YouTube)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                safeExecute(cleanUI, 'SPA Navigation Cleanup');
                safeExecute(optimizePlayer, 'SPA Navigation Player Opt');
            }, 1000);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();
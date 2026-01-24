// ==UserScript==
// @name         ▶ Open YouTube Optimizer (EN ver.)
// @name:ru      ▶ Open YouTube Optimizer (RU ver.)
// @version      1.2
// @description  Script to improve YouTube performance and simplify interface
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

// Version 1.2 - Now compatible with Chromium browsers.

(function () {
    'use strict';

    // ============================================================================
    // CONFIGURATION SYSTEM
    // ============================================================================
    const DEFAULT_CONFIG = {
        // Core settings
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

    // Prevent duplicate injection
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

            // Add fullscreen handlers
            this.setupFullscreenHandlers();
        }

        setupFullscreenHandlers() {
            // Listen for fullscreen events
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

            // Also listen for YouTube player events
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
            this.settingsButton.textContent = '⚡';
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

            // Add fade-in effect
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

        createSettingElement(setting) {
            if (setting.type === 'select') {
                const isDisabled = setting.disabled || false;

                const container = document.createElement('div');
                Object.assign(container.style, {
                    marginBottom: '20px',
                    opacity: isDisabled ? '0.5' : '1',
                    padding: '16px',
                    background: '#1a1a1a',
                    borderRadius: '10px'
                });

                const label = document.createElement('label');
                Object.assign(label.style, {
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: '#fff',
                    fontSize: '16px'
                });
                label.textContent = setting.label;
                label.htmlFor = `setting-${setting.key}`;

                const select = document.createElement('select');
                select.id = `setting-${setting.key}`;
                Object.assign(select.style, {
                    width: '100%',
                    padding: '12px 16px',
                    background: '#2a2a2a',
                    color: 'white',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    cursor: 'pointer'
                });

                if (isDisabled) {
                    select.disabled = true;
                }

                setting.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (CONFIG[setting.key] === opt.value) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

                container.appendChild(label);
                container.appendChild(select);

                if (setting.description) {
                    const description = document.createElement('div');
                    Object.assign(description.style, {
                        fontSize: '14px',
                        color: '#aaa',
                        marginTop: '8px',
                        lineHeight: '1.4'
                    });
                    description.textContent = setting.description;
                    container.appendChild(description);
                }

                return container;
            } else {
                const isChecked = CONFIG[setting.key];

                const container = document.createElement('div');
                Object.assign(container.style, {
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                    padding: '16px',
                    background: '#1a1a1a',
                    borderRadius: '10px',
                    transition: 'background 0.2s',
                    border: '1px solid #2a2a2a'
                });

                const checkboxContainer = document.createElement('div');
                Object.assign(checkboxContainer.style, {
                    flexShrink: '0',
                    marginRight: '16px'
                });

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `setting-${setting.key}`;
                checkbox.checked = isChecked;
                Object.assign(checkbox.style, {
                    width: '22px',
                    height: '22px',
                    margin: '0',
                    cursor: 'pointer',
                    accentColor: '#ff0000'
                });

                checkboxContainer.appendChild(checkbox);

                const contentContainer = document.createElement('div');
                contentContainer.style.flexGrow = '1';

                const label = document.createElement('label');
                label.htmlFor = `setting-${setting.key}`;
                Object.assign(label.style, {
                    display: 'block',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    fontSize: '16px'
                });
                label.textContent = setting.label;

                contentContainer.appendChild(label);

                if (setting.description) {
                    const description = document.createElement('div');
                    Object.assign(description.style, {
                        fontSize: '14px',
                        color: '#aaa',
                        lineHeight: '1.4'
                    });
                    description.textContent = setting.description;
                    contentContainer.appendChild(description);
                }

                const statusContainer = document.createElement('div');
                Object.assign(statusContainer.style, {
                    flexShrink: '0',
                    marginLeft: '16px'
                });

                const statusDot = document.createElement('span');
                Object.assign(statusDot.style, {
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: isChecked ? '#4CAF50' : '#666'
                });

                statusContainer.appendChild(statusDot);

                container.appendChild(checkboxContainer);
                container.appendChild(contentContainer);
                container.appendChild(statusContainer);

                return container;
            }
        }

        createModalContent() {
            const fragment = document.createDocumentFragment();
            const container = document.createElement('div');

            // Header
            const titleContainer = document.createElement('div');
            titleContainer.style.marginBottom = '24px';

            const title = document.createElement('h2');
            Object.assign(title.style, {
                margin: '0 0 12px 0',
                color: '#fff',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            });

            const iconSpan = document.createElement('span');
            Object.assign(iconSpan.style, {
                background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });
            iconSpan.textContent = '⚡';

            const titleText = document.createTextNode(' Open YouTube Optimizer by @lag_cs');

            title.appendChild(iconSpan);
            title.appendChild(titleText);

            const version = document.createElement('p');
            Object.assign(version.style, {
                margin: '0',
                color: '#aaa',
                fontSize: '16px'
            });
            version.textContent = 'Version 1.2';

            titleContainer.appendChild(title);
            titleContainer.appendChild(version);

            // Statistics
            const appliedFeatures = Object.values(CONFIG).filter(v => v === true).length;
            const statsContainer = document.createElement('div');
            Object.assign(statsContainer.style, {
                background: '#1a1a1a',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '24px',
                borderLeft: '4px solid #ff0000'
            });

            const statsRow = document.createElement('div');
            Object.assign(statsRow.style, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            });

            const statsText = document.createElement('span');
            Object.assign(statsText.style, {
                fontWeight: '500',
                fontSize: '16px'
            });

            const appliedSpan = document.createElement('strong');
            appliedSpan.style.color = '#4CAF50';
            appliedSpan.textContent = appliedFeatures.toString();

            statsText.appendChild(document.createTextNode('Optimizations applied: '));
            statsText.appendChild(appliedSpan);

            statsRow.appendChild(statsText);
            statsContainer.appendChild(statsRow);

            container.appendChild(titleContainer);
            container.appendChild(statsContainer);

            // Settings categories
            const categories = {
                'Core Settings': [
                    { key: 'disableAnimations', label: 'Disable animations', description: 'Removes CSS animations and transitions' },
                    { key: 'throttleTimers', label: 'Optimize timers', description: 'Slows down background timers to save resources' },
                    { key: 'removeJunkUI', label: 'Remove unnecessary elements', description: 'Removes unwanted interface elements' },
                ],
                'Content Optimization': [
                    { key: 'removeShorts', label: 'Remove Shorts', description: 'Hides all Shorts from homepage and recommendations' },
                    { key: 'removeComments', label: 'Remove comments', description: 'Hides the comments section' },
                    { key: 'simplifyUI', label: 'Simplified interface', description: 'Removes sidebar and recommendations' },
                    { key: 'disableAutoplay', label: 'Disable autoplay', description: 'Disables automatic next video playback' },
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

            // Add all categories
            Object.entries(categories).forEach(([categoryName, settings]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.style.marginBottom = '28px';

                const categoryTitle = document.createElement('h3');
                Object.assign(categoryTitle.style, {
                    margin: '0 0 16px 0',
                    color: '#fff',
                    fontSize: '20px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #333',
                    fontWeight: '600'
                });
                categoryTitle.textContent = categoryName;

                categoryDiv.appendChild(categoryTitle);

                // Add category settings
                settings.forEach(setting => {
                    const settingElement = this.createSettingElement(setting);
                    categoryDiv.appendChild(settingElement);
                });

                container.appendChild(categoryDiv);
            });

            // Action buttons
            const actionsDiv = document.createElement('div');
            Object.assign(actionsDiv.style, {
                display: 'flex',
                gap: '16px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '2px solid #333'
            });

            // Apply button
            const applyBtn = document.createElement('button');
            applyBtn.id = 'yt-optimizer-apply';
            Object.assign(applyBtn.style, {
                flex: '1',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            });

            const applyIcon = document.createElement('span');
            // Safe SVG without innerHTML
            const applySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            applySvg.setAttribute('width', '20');
            applySvg.setAttribute('height', '20');
            applySvg.setAttribute('viewBox', '0 0 24 24');
            applySvg.setAttribute('fill', 'none');
            applySvg.setAttribute('stroke', 'currentColor');
            applySvg.setAttribute('stroke-width', '2');

            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z');
            const polyline1 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline1.setAttribute('points', '17 21 17 13 7 13 7 21');
            const polyline2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline2.setAttribute('points', '7 3 7 8 15 8');

            applySvg.appendChild(path1);
            applySvg.appendChild(polyline1);
            applySvg.appendChild(polyline2);
            applyIcon.appendChild(applySvg);

            applyBtn.appendChild(applyIcon);
            applyBtn.appendChild(document.createTextNode(' Apply and reload'));

            // Reset button
            const resetBtn = document.createElement('button');
            resetBtn.id = 'yt-optimizer-reset';
            Object.assign(resetBtn.style, {
                padding: '16px 24px',
                background: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontWeight: '500'
            });
            resetBtn.textContent = 'Reset';

            actionsDiv.appendChild(applyBtn);
            actionsDiv.appendChild(resetBtn);
            container.appendChild(actionsDiv);

            // Warning
            const warningDiv = document.createElement('div');
            Object.assign(warningDiv.style, {
                marginTop: '20px',
                fontSize: '14px',
                color: '#666',
                textAlign: 'center',
                padding: '12px',
                background: '#1a1a1a',
                borderRadius: '8px'
            });
            warningDiv.textContent = '⚠ Changes will take effect after page reload';

            container.appendChild(warningDiv);
            fragment.appendChild(container);

            return fragment;
        }

        open() {
            if (this.isOpen) return;

            this.createModal();

            // Clear and add new content
            while (this.modal.firstChild) {
                this.modal.removeChild(this.modal.firstChild);
            }

            const content = this.createModalContent();
            this.modal.appendChild(content);

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

                        // Update status dot
                        const statusDot = element.closest('div[style*="display: flex"]')?.querySelector('span[style*="border-radius: 50%"]');
                        if (statusDot) {
                            statusDot.style.background = e.target.checked ? '#4CAF50' : '#666';
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
            if (applyBtn) {
                applyBtn.addEventListener('mouseenter', () => {
                    applyBtn.style.transform = 'translateY(-2px)';
                    applyBtn.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.3)';
                });

                applyBtn.addEventListener('mouseleave', () => {
                    applyBtn.style.transform = 'translateY(0)';
                    applyBtn.style.boxShadow = 'none';
                });

                applyBtn.addEventListener('click', () => this.applySettings());
            }

            // Reset button
            const resetBtn = document.getElementById('yt-optimizer-reset');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    if (confirm('Reset all settings to default values?')) {
                        CONFIG = { ...DEFAULT_CONFIG };
                        this.rebuildModal();
                    }
                });
            }

            // Close on click outside modal
            if (this.overlay) {
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay) {
                        this.close();
                    }
                });
            }
        }

        rebuildModal() {
            if (!this.isOpen) return;

            // Save scroll position
            const scrollTop = this.modal.scrollTop;

            // Clear content
            while (this.modal.firstChild) {
                this.modal.removeChild(this.modal.firstChild);
            }

            // Create new content
            const content = this.createModalContent();
            this.modal.appendChild(content);
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
                if (applyBtn) {
                    // Clear button content
                    while (applyBtn.firstChild) {
                        applyBtn.removeChild(applyBtn.firstChild);
                    }

                    // Create new SVG
                    const savedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    savedSvg.setAttribute('width', '20');
                    savedSvg.setAttribute('height', '20');
                    savedSvg.setAttribute('viewBox', '0 0 24 24');
                    savedSvg.setAttribute('fill', 'none');
                    savedSvg.setAttribute('stroke', 'currentColor');
                    savedSvg.setAttribute('stroke-width', '2');

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4');
                    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                    polyline.setAttribute('points', '7 10 12 15 17 10');
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', '12');
                    line.setAttribute('y1', '15');
                    line.setAttribute('x2', '12');
                    line.setAttribute('y2', '3');

                    savedSvg.appendChild(path);
                    savedSvg.appendChild(polyline);
                    savedSvg.appendChild(line);

                    const iconSpan = document.createElement('span');
                    iconSpan.appendChild(savedSvg);

                    applyBtn.appendChild(iconSpan);
                    applyBtn.appendChild(document.createTextNode(' Saved...'));
                    applyBtn.disabled = true;
                    applyBtn.style.opacity = '0.7';
                }

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

            // Create notification content
            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.gap = '12px';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '22');
            svg.setAttribute('height', '22');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');

            if (type === 'success') {
                const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                polyline.setAttribute('points', '20 6 9 17 4 12');
                svg.appendChild(polyline);
            } else if (type === 'error') {
                const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line1.setAttribute('x1', '18');
                line1.setAttribute('y1', '6');
                line1.setAttribute('x2', '6');
                line1.setAttribute('y2', '18');
                const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line2.setAttribute('x1', '6');
                line2.setAttribute('y1', '6');
                line2.setAttribute('x2', '18');
                line2.setAttribute('y2', '18');
                svg.appendChild(line1);
                svg.appendChild(line2);
            } else {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '12');
                circle.setAttribute('cy', '12');
                circle.setAttribute('r', '10');
                const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line1.setAttribute('x1', '12');
                line1.setAttribute('y1', '8');
                line1.setAttribute('x2', '12');
                line1.setAttribute('y2', '12');
                const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line2.setAttribute('x1', '12');
                line2.setAttribute('y1', '16');
                line2.setAttribute('x2', '12.01');
                line2.setAttribute('y2', '16');
                svg.appendChild(circle);
                svg.appendChild(line1);
                svg.appendChild(line2);
            }

            const textSpan = document.createElement('span');
            textSpan.textContent = message;

            contentDiv.appendChild(svg);
            contentDiv.appendChild(textSpan);
            notification.appendChild(contentDiv);

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
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
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
            // Shorts
            CONFIG.removeShorts && '[is-shorts]',
            CONFIG.removeShorts && 'ytd-reel-shelf-renderer',
            CONFIG.removeShorts && 'ytd-rich-shelf-renderer[title*="Shorts"]',
            CONFIG.removeShorts && '#shorts-container',

            // Unnecessary UI elements
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

        // Observe for changes
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
                        // Find quality menu item
                        const qualityMenuItems = document.querySelectorAll('.ytp-settings-menu .ytp-menuitem');
                        qualityMenuItems.forEach(item => {
                            const label = item.textContent || '';
                            if (label.includes('Quality') || label.includes('quality')) {
                                // Click quality item
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

                // After clicking quality menu, reapply setting
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

            // Observe for changes
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
        Logger.log('Initializing Open YouTube Optimizer v1.2...');
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
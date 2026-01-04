// ==UserScript==
// @name         Torn Gym Ratios (PDA Compatible)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Gym training helper with target percentages, current distribution display, and optional raw differences
// @author       Mistborn [3037268]
// @match        https://www.torn.com/gym.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @supportURL   https://github.com/MistbornTC/torn-gym-ratios/issues
// @downloadURL https://update.greasyfork.org/scripts/549686/Torn%20Gym%20Ratios%20%28PDA%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549686/Torn%20Gym%20Ratios%20%28PDA%20Compatible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== TORN GYM RATIOS SCRIPT LOADED ===');

    // Constants for better maintainability
    const CONSTANTS = {
        TOLERANCE_PERCENT: 1, // Within 1% tolerance for "on target"
        UPDATE_INTERVAL: 5000, // 5 seconds
        THEME_CHECK_INTERVAL_PDA: 500, // 500ms for PDA
        THEME_CHECK_INTERVAL_BROWSER: 1000, // 1000ms for browser
        CSS_MONITOR_INTERVAL: 100, // 100ms for CSS property monitoring
        ELEMENT_IDS: {
            STATS_DISPLAY: 'gym-stats-display',
            HELPER_DISPLAY: 'gym-helper-display',
            HELP_BTN: 'gym-help-btn',
            COLLAPSE_BTN: 'gym-collapse-btn',
            CONFIG_BTN: 'gym-config-btn',
            HELP_TOOLTIP: 'gym-help-tooltip',
            CONFIG_PANEL: 'gym-config-panel',
            THEME_DETECTOR: 'gym-theme-detector',
            TOTAL_PERCENTAGE: 'total-percentage',
            SAVE_TARGETS: 'save-targets',
            CANCEL_CONFIG: 'cancel-config',
            SHOW_STAT_DIFFERENCES: 'show-stat-differences'
        }
    };

    // Enhanced PDA detection
    function isTornPDA() {
        const userAgentCheck = navigator.userAgent.includes('com.manuito.tornpda');
        const flutterCheck = !!window.flutter_inappwebview;
        const platformCheck = !!window.__PDA_platformReadyPromise;
        const httpCheck = !!window.PDA_httpGet;

        const result = !!(userAgentCheck || flutterCheck || platformCheck || httpCheck);
        console.log('PDA Detection:', result, {
            userAgent: userAgentCheck,
            flutter: flutterCheck,
            platform: platformCheck,
            httpGet: httpCheck
        });
        return result;
    }

    // Universal storage functions
    function safeGM_getValue(key, defaultValue) {
        try {
            if (typeof GM_getValue !== 'undefined') {
                return GM_getValue(key, defaultValue);
            }
        } catch (e) {
            console.log('GM_getValue failed, using localStorage fallback');
        }

        try {
            const stored = localStorage.getItem('gym_' + key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.log('localStorage failed, using default:', defaultValue);
            return defaultValue;
        }
    }

    function safeGM_setValue(key, value) {
        try {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(key, value);
                return;
            }
        } catch (e) {
            console.log('GM_setValue failed, using localStorage fallback');
        }

        try {
            localStorage.setItem('gym_' + key, JSON.stringify(value));
        } catch (e) {
            console.log('Storage failed');
        }
    }

    // Format numbers with abbreviations
    function formatNumber(num) {
        if (num < 100000) {
            return num.toLocaleString();
        } else if (num < 1000000) {
            return Math.round(num / 1000) + 'k';
        } else if (num < 1000000000) {
            const millions = num / 1000000;
            return millions % 1 < 0.05 ? Math.round(millions) + 'M' : millions.toFixed(1) + 'M';
        } else {
            const billions = num / 1000000000;
            if (billions % 1 < 0.005) return Math.round(billions) + 'B';
            return parseFloat(billions.toFixed(2)) + 'B'; // Auto-trims trailing zeros
        }
    }

    // Calculate stat difference text and color
    function getStatDifferenceText(statName, currentValue, targetValue, color, percentageDiff) {
        const difference = Math.abs(currentValue - targetValue);
        const formattedDiff = formatNumber(Math.round(difference));
        const isMobile = window.innerWidth <= 768;
        
        if (Math.abs(percentageDiff) <= CONSTANTS.TOLERANCE_PERCENT) {
            // Within 1% tolerance - use the same logic as color determination
            const sign = currentValue >= targetValue ? '+' : '-';
            return {
                text: `${statName} on target (${sign}${formattedDiff})`,
                color: color
            };
        } else if (currentValue > targetValue) {
            // Over target
            const suffix = isMobile ? ' over' : ' over target';
            return {
                text: `${statName} ${formattedDiff}${suffix}`,
                color: color
            };
        } else {
            // Under target
            const suffix = isMobile ? ' under' : ' under target';
            return {
                text: `${statName} ${formattedDiff}${suffix}`,
                color: color
            };
        }
    }

    // Wait for element
    function waitForElement(selector, callback, timeout = 30000) {
        const startTime = Date.now();

        function check() {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Found element:', selector);
                callback(element);
                return;
            }

            if (Date.now() - startTime > timeout) {
                console.error('Timeout waiting for element:', selector);
                return;
            }

            setTimeout(check, 100);
        }

        check();
    }

    // Extract current stat values
    function getCurrentStats() {
        const stats = { strength: 0, defense: 0, speed: 0, dexterity: 0 };

        const strengthContainer = document.querySelector('li[class*="strength___"]');
        const defenseContainer = document.querySelector('li[class*="defense___"]');
        const speedContainer = document.querySelector('li[class*="speed___"]');
        const dexterityContainer = document.querySelector('li[class*="dexterity___"]');

        function extractValue(container) {
            if (!container) return 0;

            const valueEl = container.querySelector('[class*="propertyValue___"]') ||
                           container.querySelector('.propertyValue') ||
                           container.querySelector('[data-value]');

            if (valueEl) {
                const text = valueEl.textContent || valueEl.getAttribute('data-value') || '0';
                return parseInt(text.replace(/,/g, '')) || 0;
            }
            return 0;
        }

        stats.strength = extractValue(strengthContainer);
        stats.defense = extractValue(defenseContainer);
        stats.speed = extractValue(speedContainer);
        stats.dexterity = extractValue(dexterityContainer);

        return stats;
    }

    // Calculate percentages
    function calculateCurrentDistribution(stats) {
        const total = stats.strength + stats.defense + stats.speed + stats.dexterity;
        if (total === 0) return { strength: 0, defense: 0, speed: 0, dexterity: 0 };

        return {
            strength: (stats.strength / total * 100).toFixed(1),
            defense: (stats.defense / total * 100).toFixed(1),
            speed: (stats.speed / total * 100).toFixed(1),
            dexterity: (stats.dexterity / total * 100).toFixed(1)
        };
    }

    // Load/save targets and settings
    function loadTargets() {
        return {
            strength: safeGM_getValue('gym_target_strength', 25),
            defense: safeGM_getValue('gym_target_defense', 25),
            speed: safeGM_getValue('gym_target_speed', 25),
            dexterity: safeGM_getValue('gym_target_dexterity', 25)
        };
    }

    function saveTargets(targets) {
        safeGM_setValue('gym_target_strength', targets.strength);
        safeGM_setValue('gym_target_defense', targets.defense);
        safeGM_setValue('gym_target_speed', targets.speed);
        safeGM_setValue('gym_target_dexterity', targets.dexterity);
    }

    function loadShowStatDifferences() {
        return safeGM_getValue('gym_show_stat_differences', false);
    }

    function saveShowStatDifferences(show) {
        safeGM_setValue('gym_show_stat_differences', show);
    }

    // Theme detection
    function getTheme() {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode') ||
                          body.classList.contains('dark') ||
                          body.style.background.includes('#191919') ||
                          getComputedStyle(body).backgroundColor === 'rgb(25, 25, 25)';

        return isDarkMode ? 'dark' : 'light';
    }

    function getThemeColors() {
        const theme = getTheme();

        if (theme === 'dark') {
            return {
                panelBg: '#2a2a2a',
                panelBorder: '#444',
                configBg: '#333',
                configBorder: '#555',
                statBoxBg: '#3a3a3a',
                statBoxBorder: '#444',
                statBoxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                inputBg: '#444',
                inputBorder: '#555',
                textPrimary: '#fff',
                textSecondary: '#ccc',
                textMuted: '#999',
                success: '#5cb85c',
                warning: '#f0ad4e',
                danger: '#d9534f',
                primary: '#4a90e2',
                neutral: '#666'
            };
        } else {
            return {
                panelBg: '#f8f9fa',
                panelBorder: 'rgba(102, 102, 102, 0.3)',
                configBg: '#ffffff',
                configBorder: '#ced4da',
                statBoxBg: '#ffffff',
                statBoxBorder: 'rgba(102, 102, 102, 0.3)',
                statBoxShadow: 'rgba(50, 50, 50, 0.2) 0px 0px 2px 0px',
                inputBg: '#ffffff',
                inputBorder: '#ced4da',
                textPrimary: '#212529',
                textSecondary: '#6c757d',
                textMuted: '#adb5bd',
                success: 'rgb(105, 168, 41)',
                warning: '#f0ad4e',
                danger: '#dc3545',
                primary: '#007bff',
                neutral: '#6c757d'
            };
        }
    }

    // Collapse state management
    function isCollapsed() {
        if (isTornPDA()) {
            const statsDisplay = document.getElementById('gym-stats-display');
            return statsDisplay ? statsDisplay.style.display === 'none' : false;
        }

        const isMobile = window.innerWidth <= 768;
        const key = isMobile ? 'gym_helper_collapsed_mobile' : 'gym_helper_collapsed_desktop';
        return safeGM_getValue(key, false);
    }

    function setCollapsed(collapsed) {
        if (isTornPDA()) {
            return; // No storage in PDA
        }

        const isMobile = window.innerWidth <= 768;
        const key = isMobile ? 'gym_helper_collapsed_mobile' : 'gym_helper_collapsed_desktop';
        safeGM_setValue(key, collapsed);
    }

    // Track current theme to detect changes
    let currentTheme = getTheme();
    let themeObserver = null;
    let themeCheckInterval = null;

    // Track stats monitoring
    let statsObserver = null;
    let statsUpdateInterval = null;

    // Advanced theme detection with multiple monitoring methods
    function initAdvancedThemeMonitoring() {
        // Method 1: MutationObserver for class/style changes
        if (!isTornPDA() && typeof MutationObserver !== 'undefined') {
            themeObserver = new MutationObserver((mutations) => {
                let shouldCheck = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'class' ||
                         mutation.attributeName === 'style' ||
                         mutation.attributeName === 'data-theme')) {
                        shouldCheck = true;
                    }
                });
                if (shouldCheck) {
                    checkAndUpdateTheme();
                }
            });

            themeObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['class', 'style', 'data-theme'],
                subtree: false
            });

            // Also observe html element for theme changes
            themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'style', 'data-theme'],
                subtree: false
            });
        }

        // Method 2: CSS Custom Property monitoring (for instant updates)
        if (!isTornPDA()) {
            try {
                // Create a test element to monitor CSS custom properties
                const themeTestEl = document.createElement('div');
                themeTestEl.id = 'gym-theme-detector';
                themeTestEl.style.cssText = `
                    position: absolute;
                    top: -9999px;
                    left: -9999px;
                    width: 1px;
                    height: 1px;
                    background: var(--torn-bg-color, rgb(25, 25, 25));
                    pointer-events: none;
                    z-index: -1;
                `;
                document.body.appendChild(themeTestEl);

                // Monitor background color changes
                let lastBgColor = getComputedStyle(themeTestEl).backgroundColor;
                setInterval(() => {
                    const currentBgColor = getComputedStyle(themeTestEl).backgroundColor;
                    if (currentBgColor !== lastBgColor) {
                        lastBgColor = currentBgColor;
                        checkAndUpdateTheme();
                    }
                }, CONSTANTS.CSS_MONITOR_INTERVAL);
            } catch (e) {
                console.log('CSS monitoring fallback failed, using standard detection');
            }
        }

        // Method 3: Enhanced interval checking (fallback for PDA)
        const checkFrequency = isTornPDA() ? CONSTANTS.THEME_CHECK_INTERVAL_PDA : CONSTANTS.THEME_CHECK_INTERVAL_BROWSER;
        themeCheckInterval = setInterval(checkAndUpdateTheme, checkFrequency);

        // Method 4: Event listeners for common theme switching scenarios
        if (!isTornPDA()) {
            ['focus', 'blur', 'visibilitychange'].forEach(event => {
                document.addEventListener(event, () => {
                    setTimeout(checkAndUpdateTheme, 50);
                });
            });
        }
    }

    // Optimized theme check and update function
    function checkAndUpdateTheme() {
        const newTheme = getTheme();
        if (newTheme !== currentTheme) {
            console.log('Theme changed from', currentTheme, 'to', newTheme);
            currentTheme = newTheme;
            updateMainContainerTheme();
            updateStats(); // Refresh stats display with new theme
        }
    }

    // Dynamic theme update function with CSS custom properties
    function updateMainContainerTheme() {
        const colors = getThemeColors();
        const mainPanel = document.getElementById('gym-helper-display');

        if (!mainPanel) return;

        // Set CSS custom properties for instant theme switching
        const rootStyle = document.documentElement.style;
        const customProps = {
            '--gym-panel-bg': colors.panelBg,
            '--gym-panel-border': colors.panelBorder,
            '--gym-text-primary': colors.textPrimary,
            '--gym-text-secondary': colors.textSecondary,
            '--gym-text-muted': colors.textMuted,
            '--gym-stat-box-bg': colors.statBoxBg,
            '--gym-stat-box-border': colors.statBoxBorder,
            '--gym-stat-box-shadow': colors.statBoxShadow,
            '--gym-input-bg': colors.inputBg,
            '--gym-input-border': colors.inputBorder,
            '--gym-success': colors.success,
            '--gym-warning': colors.warning,
            '--gym-danger': colors.danger,
            '--gym-primary': colors.primary,
            '--gym-neutral': colors.neutral
        };

        // Apply all custom properties at once
        Object.entries(customProps).forEach(([prop, value]) => {
            rootStyle.setProperty(prop, value);
        });

        // Update main panel styles
        mainPanel.style.background = colors.panelBg;
        mainPanel.style.border = '1px solid ' + colors.panelBorder;
        mainPanel.style.color = colors.textPrimary;
        mainPanel.style.boxShadow = colors.statBoxShadow;

        // Update title color
        const title = mainPanel.querySelector('#gym-header-clickable');
        if (title) title.style.color = colors.textPrimary;

        // Cache elements for better performance
        const elements = {
            helpBtn: document.getElementById('gym-help-btn'),
            collapseBtn: document.getElementById('gym-collapse-btn'),
            configBtn: document.getElementById('gym-config-btn'),
            tooltip: document.getElementById('gym-help-tooltip'),
            configPanel: document.getElementById('gym-config-panel')
        };

        // Update button colors
        if (elements.helpBtn) elements.helpBtn.style.background = colors.neutral;
        if (elements.collapseBtn) elements.collapseBtn.style.background = colors.neutral;
        if (elements.configBtn) elements.configBtn.style.background = colors.primary;

        // Update help tooltip
        if (elements.tooltip) {
            elements.tooltip.style.background = colors.statBoxBg;
            elements.tooltip.style.border = '1px solid ' + colors.statBoxBorder;
            elements.tooltip.style.boxShadow = colors.statBoxShadow;

            const tooltipElements = elements.tooltip.querySelectorAll('div');
            tooltipElements.forEach(el => {
                el.style.color = colors.textPrimary;
            });

            // Update the warning color text
            const middleDiv = elements.tooltip.children[2];
            if (middleDiv) {
                middleDiv.innerHTML = '<span style="color: ' + colors.warning + '; font-weight: bold; font-size: 16px;">|</span> <span style="font-weight: bold;">Orange:</span> Above target (focus on other stats)';
            }
        }

        // Update config panel
        if (elements.configPanel) {
            elements.configPanel.style.background = colors.configBg;
            elements.configPanel.style.border = '1px solid ' + colors.configBorder;

            const configTitle = elements.configPanel.querySelector('h4');
            if (configTitle) configTitle.style.color = colors.textPrimary;

            const configLabels = elements.configPanel.querySelectorAll('label');
            configLabels.forEach(label => {
                label.style.color = colors.textSecondary;
            });

            const configInputs = elements.configPanel.querySelectorAll('input');
            configInputs.forEach(input => {
                input.style.background = colors.inputBg;
                input.style.border = '1px solid ' + colors.inputBorder;
                input.style.color = colors.textPrimary;
            });

            const saveBtn = elements.configPanel.querySelector('#save-targets');
            const cancelBtn = elements.configPanel.querySelector('#cancel-config');
            if (saveBtn) saveBtn.style.background = colors.success;
            if (cancelBtn) cancelBtn.style.background = colors.danger;
        }
    }

    // Advanced stats monitoring for performance optimization
    function initStatsMonitoring() {
        // Method 1: MutationObserver for stat value changes (browser only)
        if (!isTornPDA() && typeof MutationObserver !== 'undefined') {
            statsObserver = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach((mutation) => {
                    // Check if any stat-related elements changed
                    if (mutation.type === 'childList' ||
                        (mutation.type === 'attributes' && mutation.attributeName === 'data-value') ||
                        (mutation.type === 'characterData')) {
                        const target = mutation.target;
                        const container = target.closest ? target.closest('li[class*="strength___"], li[class*="defense___"], li[class*="speed___"], li[class*="dexterity___"]') : null;
                        if (container || target.classList?.contains('propertyValue') || target.className?.includes('propertyValue')) {
                            shouldUpdate = true;
                        }
                    }
                });

                if (shouldUpdate) {
                    console.log('Stats changed detected, updating display');
                    updateStats();
                }
            });

            // Observe the entire gym page for stat changes
            const gymContainer = document.querySelector('.content-wrapper') || document.body;
            if (gymContainer) {
                statsObserver.observe(gymContainer, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['data-value', 'class'],
                    characterData: true
                });
                console.log('Stats MutationObserver initialized');
            }
        }

        // Method 2: Fallback polling for PDA or when MutationObserver isn't available
        if (isTornPDA() || !statsObserver) {
            console.log('Using fallback polling for stats monitoring');
            const pollInterval = isTornPDA() ? 3000 : 10000; // More frequent for PDA, less for browser fallback
            statsUpdateInterval = setInterval(() => {
                updateStats();
            }, pollInterval);
        } else {
            console.log('Using MutationObserver for efficient stats monitoring');
        }

        // Initial update
        updateStats();
    }

    // Cleanup functions
    function cleanupStatsMonitoring() {
        if (statsObserver) {
            statsObserver.disconnect();
            statsObserver = null;
        }
        if (statsUpdateInterval) {
            clearInterval(statsUpdateInterval);
            statsUpdateInterval = null;
        }
    }

    function cleanupThemeMonitoring() {
        if (themeObserver) {
            themeObserver.disconnect();
            themeObserver = null;
        }
        if (themeCheckInterval) {
            clearInterval(themeCheckInterval);
            themeCheckInterval = null;
        }
        const themeTestEl = document.getElementById('gym-theme-detector');
        if (themeTestEl) {
            themeTestEl.remove();
        }
    }

    // Master cleanup function
    function cleanupAllMonitoring() {
        cleanupStatsMonitoring();
        cleanupThemeMonitoring();
    }

    // Create the main display panel using innerHTML (PDA-compatible)
    function createDisplayPanel() {
        const colors = getThemeColors();

        const panel = document.createElement('div');
        panel.id = 'gym-helper-display';
        panel.style.cssText = `
            background: ${colors.panelBg};
            border: 1px solid ${colors.panelBorder};
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: ${colors.textPrimary};
            position: relative;
            box-shadow: ${colors.statBoxShadow};
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 id="gym-header-clickable" style="
                    margin: 0;
                    color: ${colors.textPrimary};
                    font-size: 16px;
                    user-select: none;
                    cursor: pointer;
                ">Gym Ratios</h3>
                <div style="margin-left: auto; margin-right: -21px;">
                    <button id="gym-help-btn" style="
                        background: ${colors.neutral};
                        color: white;
                        border: none;
                        padding: 5px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-right: 5px;
                        ${(!isTornPDA() && window.innerWidth > 768) ? '-webkit-transform: translateZ(0); transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden;' : 'outline: none; -webkit-appearance: none; appearance: none; border: none; position: relative; overflow: hidden;'}
                    ">&quest;</button>
                    <button id="gym-collapse-btn" style="
                        background: ${colors.neutral};
                        color: white;
                        border: none;
                        padding: 5px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-right: 5px;
                        ${(!isTornPDA() && window.innerWidth > 768) ? '-webkit-transform: translateZ(0); transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden;' : 'outline: none; -webkit-appearance: none; appearance: none; border: none; position: relative; overflow: hidden;'}
                    ">&minus;</button>
                    <button id="gym-config-btn" style="
                        background: ${colors.primary};
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                        ${(!isTornPDA() && window.innerWidth > 768) ? '-webkit-transform: translateZ(0); transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden;' : 'outline: none; -webkit-appearance: none; appearance: none; border: none; position: relative; overflow: hidden;'}
                    ">Config</button>
                </div>
            </div>
            <div id="gym-help-tooltip" style="
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: ${colors.statBoxBg};
                border: 1px solid ${colors.statBoxBorder};
                border-radius: 5px;
                padding: 12px;
                margin-top: 5px;
                z-index: 1001;
                display: none;
                box-shadow: ${colors.statBoxShadow};
                font-size: 13px;
                line-height: 1.4;
            ">
                <div style="margin-bottom: 8px; font-weight: bold; color: ${colors.textPrimary};">Color Guide:</div>
                <div style="margin-bottom: 6px; color: ${colors.textPrimary};">
                    <span style="color: ${colors.success}; font-weight: bold; font-size: 16px;">|</span> <span style="font-weight: bold;">Green:</span> On target (within &plusmn;1% of target)
                </div>
                <div style="margin-bottom: 6px; color: ${colors.textPrimary};">
                    <span style="color: ${colors.warning}; font-weight: bold; font-size: 16px;">|</span> <span style="font-weight: bold;">Orange:</span> Above target (focus on other stats)
                </div>
                <div style="color: ${colors.textPrimary};">
                    <span style="color: ${colors.danger}; font-weight: bold; font-size: 16px;">|</span> <span style="font-weight: bold;">Red:</span> Below target (needs more training)
                </div>
            </div>
            <div id="gym-stats-display" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
                font-size: 13px;
            "></div>
            <style>
                /* CSS Custom Properties for instant theme switching */
                :root {
                    --gym-panel-bg: ${colors.panelBg};
                    --gym-panel-border: ${colors.panelBorder};
                    --gym-text-primary: ${colors.textPrimary};
                    --gym-text-secondary: ${colors.textSecondary};
                    --gym-text-muted: ${colors.textMuted};
                    --gym-stat-box-bg: ${colors.statBoxBg};
                    --gym-stat-box-border: ${colors.statBoxBorder};
                    --gym-stat-box-shadow: ${colors.statBoxShadow};
                    --gym-input-bg: ${colors.inputBg};
                    --gym-input-border: ${colors.inputBorder};
                    --gym-success: ${colors.success};
                    --gym-warning: ${colors.warning};
                    --gym-danger: ${colors.danger};
                    --gym-primary: ${colors.primary};
                    --gym-neutral: ${colors.neutral};
                }

                /* Instant theme switching classes */
                #gym-helper-display {
                    background: var(--gym-panel-bg) !important;
                    border-color: var(--gym-panel-border) !important;
                    color: var(--gym-text-primary) !important;
                    box-shadow: var(--gym-stat-box-shadow) !important;
                    transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease !important;
                }

                #gym-header-clickable {
                    color: var(--gym-text-primary) !important;
                    transition: color 0.1s ease !important;
                }

                #gym-help-btn, #gym-collapse-btn {
                    background: var(--gym-neutral) !important;
                    transition: background-color 0.1s ease !important;
                }

                #gym-config-btn {
                    background: var(--gym-primary) !important;
                    transition: background-color 0.1s ease !important;
                }

                #gym-help-tooltip {
                    background: var(--gym-stat-box-bg) !important;
                    border-color: var(--gym-stat-box-border) !important;
                    box-shadow: var(--gym-stat-box-shadow) !important;
                    transition: background-color 0.1s ease, border-color 0.1s ease !important;
                }

                #gym-config-panel {
                    background: var(--gym-stat-box-bg) !important;
                    border-color: var(--gym-stat-box-border) !important;
                    transition: background-color 0.1s ease, border-color 0.1s ease !important;
                }

                #gym-config-panel h4 {
                    color: var(--gym-text-primary) !important;
                    transition: color 0.1s ease !important;
                }

                #gym-config-panel label {
                    color: var(--gym-text-secondary) !important;
                    transition: color 0.1s ease !important;
                }

                #gym-config-panel input {
                    background: var(--gym-input-bg) !important;
                    border-color: var(--gym-input-border) !important;
                    color: var(--gym-text-primary) !important;
                    transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease !important;
                }

                #save-targets {
                    background: var(--gym-success) !important;
                    transition: background-color 0.1s ease !important;
                }

                #cancel-config {
                    background: var(--gym-danger) !important;
                    transition: background-color 0.1s ease !important;
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    #gym-stats-display {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 8px !important;
                        font-size: 12px !important;
                    }
                    #gym-stats-display > div {
                        padding: 8px !important;
                    }
                    #gym-helper-display {
                        padding: 10px !important;
                        margin: 5px 0 !important;
                    }
                }
                @media (max-width: 480px) {
                    #gym-stats-display {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 6px !important;
                        font-size: 11px !important;
                    }
                    #gym-helper-display {
                        margin-left: -5px !important;
                        position: relative !important;
                        z-index: 100 !important;
                    }
                    #gym-config-panel, #gym-help-tooltip {
                        left: 0 !important;
                        right: 0 !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        z-index: 1010 !important;
                    }
                }
            </style>
        `;

        return panel;
    }

    // Create config panel using innerHTML (PDA-compatible) 
    function createConfigPanel() {
        const colors = getThemeColors();
        const targets = loadTargets();
        const showStatDifferences = loadShowStatDifferences();

        const configPanel = document.createElement('div');
        configPanel.id = 'gym-config-panel';
        configPanel.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: ${colors.configBg};
            border: 1px solid ${colors.configBorder};
            border-radius: 5px;
            padding: 15px;
            margin-top: 5px;
            z-index: 1000;
            display: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        `;

        configPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 15px;">
                <h4 style="margin: 0; padding: 0; color: ${colors.textPrimary}; font-size: 16px;">Target Percentages</h4>
                <span id="total-percentage" style="margin: 0; padding: 0; color: ${colors.textSecondary}; font-weight: bold; font-size: 12px;">Total: 100%</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; color: ${colors.textSecondary};">Strength (%)</label>
                    <input type="number" id="target-strength" value="${targets.strength}" min="0" max="100" step="0.1" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid ${colors.inputBorder};
                        border-radius: 3px;
                        background: ${colors.inputBg};
                        color: ${colors.textPrimary};
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; color: ${colors.textSecondary};">Defense (%)</label>
                    <input type="number" id="target-defense" value="${targets.defense}" min="0" max="100" step="0.1" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid ${colors.inputBorder};
                        border-radius: 3px;
                        background: ${colors.inputBg};
                        color: ${colors.textPrimary};
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; color: ${colors.textSecondary};">Speed (%)</label>
                    <input type="number" id="target-speed" value="${targets.speed}" min="0" max="100" step="0.1" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid ${colors.inputBorder};
                        border-radius: 3px;
                        background: ${colors.inputBg};
                        color: ${colors.textPrimary};
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; color: ${colors.textSecondary};">Dexterity (%)</label>
                    <input type="number" id="target-dexterity" value="${targets.dexterity}" min="0" max="100" step="0.1" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid ${colors.inputBorder};
                        border-radius: 3px;
                        background: ${colors.inputBg};
                        color: ${colors.textPrimary};
                        box-sizing: border-box;
                    ">
                </div>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; color: ${colors.textSecondary}; cursor: pointer;">
                    <input type="checkbox" id="show-stat-differences" ${showStatDifferences ? 'checked' : ''} style="
                        margin-right: 8px;
                        transform: scale(1.1);
                    ">
                    Include raw stat difference?
                </label>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <button id="save-targets" style="
                    background: ${colors.success};
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    width: 100%;
                    box-sizing: border-box;
                ">Save</button>
                <button id="cancel-config" style="
                    background: ${colors.danger};
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    width: 100%;
                    box-sizing: border-box;
                ">Cancel</button>
            </div>
        `;

        return configPanel;
    }

    // Toggle collapse state
    function toggleCollapsed() {
        const statsDisplay = document.getElementById('gym-stats-display');
        const collapseBtn = document.getElementById('gym-collapse-btn');
        const configPanel = document.getElementById('gym-config-panel');
        const mainPanel = document.getElementById('gym-helper-display');
        const header = mainPanel ? mainPanel.querySelector('div:first-child') : null;

        if (!statsDisplay || !collapseBtn) return;

        const collapsed = isCollapsed();
        const newState = !collapsed;

        setCollapsed(newState);

        if (newState) {
            // Collapse
            statsDisplay.style.display = 'none';
            collapseBtn.innerHTML = '+';
            if (configPanel) configPanel.style.display = 'none';

            // Adjust spacing when collapsed for tighter layout
            if (header) header.style.marginBottom = '2px';
            if (mainPanel) {
                if (isTornPDA()) {
                    mainPanel.style.padding = '10px 15px 8px 15px';
                    mainPanel.style.marginBottom = '5px';
                } else {
                    mainPanel.style.padding = '10px 15px 8px 15px';
                }
            }
        } else {
            // Expand
            statsDisplay.style.display = 'grid';
            collapseBtn.innerHTML = '&minus;';

            // Restore normal spacing when expanded
            if (header) header.style.marginBottom = '10px';
            if (mainPanel) {
                if (isTornPDA()) {
                    mainPanel.style.padding = '15px';
                    mainPanel.style.marginBottom = '10px';
                } else {
                    mainPanel.style.padding = '15px';
                }
            }
            updateStats();
        }
    }

    // Apply saved collapse state
    function applySavedCollapseState() {
        if (isTornPDA()) {
            return; // Always start expanded in PDA
        }

        if (isCollapsed()) {
            setTimeout(() => {
                const statsDisplay = document.getElementById('gym-stats-display');
                const collapseBtn = document.getElementById('gym-collapse-btn');

                if (statsDisplay && collapseBtn) {
                    statsDisplay.style.display = 'none';
                    collapseBtn.innerHTML = '+';
                    const mainPanel = document.getElementById('gym-helper-display');
                    if (mainPanel) mainPanel.style.paddingBottom = '5px';
                }
            }, 100);
        }
    }

    // Update stats display
    function updateStats() {
        const stats = getCurrentStats();
        const dist = calculateCurrentDistribution(stats);
        const targets = loadTargets();
        const showStatDifferences = loadShowStatDifferences();
        const colors = getThemeColors();

        const statsDiv = document.getElementById('gym-stats-display');
        if (!statsDiv) return;

        if (isCollapsed()) return; // Don't update if collapsed

        const total = stats.strength + stats.defense + stats.speed + stats.dexterity;
        if (total === 0) {
            statsDiv.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: ' + colors.textSecondary + ';">No stats found. Make sure you\'re on the gym page.</div>';
            return;
        }

        const statNames = ['strength', 'defense', 'speed', 'dexterity'];
        const statLabels = ['Strength', 'Defense', 'Speed', 'Dexterity'];

        statsDiv.innerHTML = statNames.map((stat, index) => {
            const current = parseFloat(dist[stat]);
            const target = targets[stat];
            const diff = current - target;
            const color = Math.abs(diff) <= CONSTANTS.TOLERANCE_PERCENT ? colors.success : (diff > 0 ? colors.warning : colors.danger);

            let additionalContent = '';
            if (showStatDifferences) {
                // Calculate target value in absolute numbers
                const targetValue = (target / 100) * total;
                const currentValue = stats[stat];

                // Get difference text and color
                const diffInfo = getStatDifferenceText(statLabels[index], currentValue, targetValue, color, diff);

                additionalContent = `
                    <div style="font-size: 10px; color: ${colors.textMuted}; margin-bottom: 10px;">
                        Target: ${target}%
                    </div>
                    <div style="font-size: 10px; color: ${diffInfo.color}; font-weight: bold;">
                        ${diffInfo.text}
                    </div>
                `;
            } else {
                additionalContent = `
                    <div style="font-size: 10px; color: ${colors.textMuted};">
                        Target: ${target}%
                    </div>
                `;
            }

            return `
                <div style="
                    background: ${colors.statBoxBg};
                    padding: 10px;
                    border-radius: 3px;
                    text-align: center;
                    border-left: 3px solid ${color};
                    border-top: 1px solid ${colors.statBoxBorder};
                    border-right: 1px solid ${colors.statBoxBorder};
                    border-bottom: 1px solid ${colors.statBoxBorder};
                    box-shadow: ${colors.statBoxShadow};
                ">
                    <div style="font-weight: bold; margin-bottom: 5px; color: ${colors.textPrimary};">${statLabels[index]}</div>
                    <div style="color: ${color}; font-weight: bold; margin-bottom: 4px;">
                        ${current}% (${diff > 0 ? '+' : ''}${diff.toFixed(1)})
                    </div>
                    ${additionalContent}
                </div>
            `;
        }).join('');

        console.log('Stats updated' + (showStatDifferences ? ' with differences' : ''));
    }

    // Get all target input values as object
    function getTargetValues() {
        return {
            strength: parseFloat(document.getElementById('target-strength').value) || 0,
            defense: parseFloat(document.getElementById('target-defense').value) || 0,
            speed: parseFloat(document.getElementById('target-speed').value) || 0,
            dexterity: parseFloat(document.getElementById('target-dexterity').value) || 0
        };
    }

    // Update total percentage in config
    function updateTotalPercentage() {
        const targets = getTargetValues();
        const total = targets.strength + targets.defense + targets.speed + targets.dexterity;
        const totalSpan = document.getElementById('total-percentage');
        const colors = getThemeColors();

        if (totalSpan) {
            totalSpan.textContent = 'Total: ' + total.toFixed(1) + '%';
            totalSpan.style.color = Math.abs(total - 100) <= 0.1 ? colors.success : colors.danger;
        }

        const saveBtn = document.getElementById('save-targets');
        if (saveBtn) {
            saveBtn.disabled = Math.abs(total - 100) > 0.1;
            saveBtn.style.opacity = saveBtn.disabled ? '0.5' : '1';
        }
    }

    // SPEED OPTIMIZED INITIALIZATION
    function initOptimized() {
        console.log('=== INITIALIZING PDA-FIXED SPEED OPTIMIZED SCRIPT ===');
        console.log('Platform:', isTornPDA() ? 'PDA' : 'Browser');
        console.log('URL:', window.location.href);

        if (isTornPDA()) {
            console.log('Using PDA-compatible (slower) initialization method');
            waitForElement('.page-head-delimiter', function(delimiter) {
                console.log('Found page delimiter, creating panel');

                const displayPanel = createDisplayPanel();
                const configPanel = createConfigPanel();

                displayPanel.appendChild(configPanel);
                delimiter.parentNode.insertBefore(displayPanel, delimiter.nextSibling);

                console.log('Panel inserted, waiting for stats to load');

                setTimeout(function() {
                    applySavedCollapseState();
                    initAdvancedThemeMonitoring();
                    initStatsMonitoring();
                }, 2000);

                setupEventListeners();

            }, 15000);
        } else {
            console.log('Using browser-optimized (faster) initialization method');
            waitForElement('li[class*="strength___"]', function(strengthEl) {
                console.log('Found strength element, checking for delimiter');

                const delimiter = document.querySelector('.page-head-delimiter');
                if (!delimiter) {
                    console.log('Delimiter not found, retrying in 100ms');
                    setTimeout(initOptimized, 100);
                    return;
                }

                console.log('Both stats and delimiter found, creating panel');

                const displayPanel = createDisplayPanel();
                const configPanel = createConfigPanel();

                displayPanel.appendChild(configPanel);
                delimiter.parentNode.insertBefore(displayPanel, delimiter.nextSibling);

                console.log('Panel inserted, updating stats');

                applySavedCollapseState();
                initAdvancedThemeMonitoring();
                initStatsMonitoring();

                setupEventListeners();

            }, 5000);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Help button
        document.getElementById('gym-help-btn').addEventListener('click', () => {
            const tooltip = document.getElementById('gym-help-tooltip');
            tooltip.style.display = tooltip.style.display === 'none' ? 'block' : 'none';
            const configPanel = document.getElementById('gym-config-panel');
            if (tooltip.style.display === 'block') configPanel.style.display = 'none';
        });

        // Header click and collapse button
        document.getElementById('gym-header-clickable').addEventListener('click', toggleCollapsed);
        document.getElementById('gym-collapse-btn').addEventListener('click', toggleCollapsed);

        // Config button
        document.getElementById('gym-config-btn').addEventListener('click', () => {
            if (isCollapsed()) {
                toggleCollapsed();
                setTimeout(() => {
                    const panel = document.getElementById('gym-config-panel');
                    if (panel) panel.style.display = 'block';
                }, 100);
            } else {
                const panel = document.getElementById('gym-config-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    const tooltip = document.getElementById('gym-help-tooltip');
                    if (panel.style.display === 'block') tooltip.style.display = 'none';
                }
            }
        });

        // Config panel buttons
        document.getElementById('cancel-config').addEventListener('click', () => {
            document.getElementById('gym-config-panel').style.display = 'none';
        });

        document.getElementById('save-targets').addEventListener('click', () => {
            const targets = getTargetValues();
            const showStatDifferences = document.getElementById('show-stat-differences').checked;

            saveTargets(targets);
            saveShowStatDifferences(showStatDifferences);
            updateStats();
            document.getElementById('gym-config-panel').style.display = 'none';
        });

        // Add input listeners for real-time validation
        ['target-strength', 'target-defense', 'target-speed', 'target-dexterity'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.addEventListener('input', updateTotalPercentage);
        });

        // Initial total percentage update
        updateTotalPercentage();

        // Cleanup on page unload
        if (!isTornPDA()) {
            window.addEventListener('beforeunload', cleanupAllMonitoring);
            window.addEventListener('unload', cleanupAllMonitoring);
        }

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            const helpBtn = document.getElementById('gym-help-btn');
            const tooltip = document.getElementById('gym-help-tooltip');
            const configBtn = document.getElementById('gym-config-btn');
            const configPanel = document.getElementById('gym-config-panel');

            if (!helpBtn.contains(e.target) && !tooltip.contains(e.target)) {
                tooltip.style.display = 'none';
            }

            if (!configBtn.contains(e.target) && !configPanel.contains(e.target)) {
                configPanel.style.display = 'none';
            }
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOptimized);
    } else {
        initOptimized();
    }

})();

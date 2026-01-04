// ==UserScript==
// @name         Gemini Theme Switcher with Auto Day/Night
// @name:zh-CN   Gemini 主题切换器（含日夜自动切换）
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  Instantly switch between themes (Warm Yellow, Mint Light, Atom One Dark, etc.) for Gemini, with auto day/night mode that remembers your last chosen light and dark themes.
// @description:zh-CN 为Gemini提供可切换的数种护眼主题。自动日夜模式可记忆您最后选择的浅色与深色主题。
// @author       Gemini
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550844/Gemini%20Theme%20Switcher%20with%20Auto%20DayNight.user.js
// @updateURL https://update.greasyfork.org/scripts/550844/Gemini%20Theme%20Switcher%20with%20Auto%20DayNight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Theme Definitions ---
    const themes = {
        warm: {
            className: 'warm-yellow-theme',
            displayName: 'Warm Yellow',
            isDark: false,
            css: `
                body.warm-yellow-theme{color-scheme:light !important;--gem-sys-color--primary:#D97706 !important;--gem-sys-color--on-primary:#fff !important;--gem-sys-color--primary-container:#FAEFE0 !important;--gem-sys-color--on-primary-container:#5D4037 !important;--gem-sys-color--secondary:#A1887F !important;--gem-sys-color--on-secondary:#fff !important;--gem-sys-color--secondary-container:#EFEBE9 !important;--gem-sys-color--on-secondary-container:#5D4037 !important;--gem-sys-color--tertiary:#689F38 !important;--gem-sys-color--on-tertiary:#fff !important;--gem-sys-color--error:#C62828 !important;--gem-sys-color--on-error:#fff !important;--gem-sys-color--surface:#FDF6E3 !important;--gem-sys-color--surface-bright:#FEFBF3 !important;--gem-sys-color--surface-container:#F8F0D9 !important;--gem-sys-color--surface-container-high:#F3EADF !important;--gem-sys-color--surface-container-highest:#EDE4D5 !important;--gem-sys-color--surface-container-low:#FEFBF3 !important;--gem-sys-color--surface-container-lowest:#fff !important;--bard-color-synthetic--chat-window-surface:var(--gem-sys-color--surface) !important;--mat-app-background-color:var(--gem-sys-color--surface) !important;--gem-sys-color--on-surface:#4F4A45 !important;--gem-sys-color--on-surface-variant:#655F5A !important;--mat-app-text-color:var(--gem-sys-color--on-surface) !important;--bard-color-form-field-placeholder:#9E9A97 !important;--gem-sys-color--outline:#DCD5C9 !important;--gem-sys-color--outline-variant:#CEC8BD !important;--bard-color-response-container-flipped-background:#F8F0D9 !important;--bard-color-zero-state-prompt-chip-background:#FAEFE0 !important;--bard-color-zero-state-prompt-chip-text:#D97706 !important;--bard-color-image-placeholder-background:#EDE4D5 !important;--bard-color-code-comment:#A08C7D !important;--bard-color-code-variables:#B7410E !important;--bard-color-code-literal:#6C6C6C !important;--bard-color-code-class:#A67B5B !important;--bard-color-code-string:#556B2F !important;--bard-color-code-quotes-and-meta:#3E646E !important;--bard-color-code-keyword:#C77800 !important;background-color:var(--gem-sys-color--surface) !important;color:var(--gem-sys-color--on-surface) !important}
                body.warm-yellow-theme bard-sidenav {background-color: var(--gem-sys-color--surface-container) !important;}`
        },
        mintLight: {
            className: 'mint-light-theme',
            displayName: 'Mint Light',
            isDark: false,
            css: `
                body.mint-light-theme{color-scheme:light !important;--gem-sys-color--primary:#00695c !important;--gem-sys-color--on-primary:#fff !important;--gem-sys-color--primary-container:#dceddd !important;--gem-sys-color--on-primary-container:#1b5e20 !important;--gem-sys-color--secondary:#a5d6a7 !important;--gem-sys-color--on-secondary:#335c49 !important;--gem-sys-color--secondary-container:#e0ebe4 !important;--gem-sys-color--on-secondary-container:#335c49 !important;--gem-sys-color--tertiary:#a5d6a7 !important;--gem-sys-color--on-tertiary:#335c49 !important;--gem-sys-color--error:#C62828 !important;--gem-sys-color--on-error:#fff !important;--gem-sys-color--surface:#F1F8F2 !important;--gem-sys-color--surface-bright:#f7fbf7 !important;--gem-sys-color--surface-container:#e8f5e9 !important;--gem-sys-color--surface-container-high:#e0ebe4 !important;--gem-sys-color--surface-container-highest:#d5e2d9 !important;--gem-sys-color--surface-container-low:#f7fbf7 !important;--gem-sys-color--surface-container-lowest:#fff !important;--bard-color-synthetic--chat-window-surface:var(--gem-sys-color--surface) !important;--mat-app-background-color:var(--gem-sys-color--surface) !important;--gem-sys-color--on-surface:#335c49 !important;--gem-sys-color--on-surface-variant:#527865 !important;--mat-app-text-color:var(--gem-sys-color--on-surface) !important;--bard-color-form-field-placeholder:#759686 !important;--gem-sys-color--outline:#c8d5cb !important;--gem-sys-color--outline-variant:#b8c5bc !important;--bard-color-response-container-flipped-background:#e8f5e9 !important;--bard-color-zero-state-prompt-chip-background:#dceddd !important;--bard-color-zero-state-prompt-chip-text:#00695c !important;--bard-color-image-placeholder-background:#d5e2d9 !important;--bard-color-code-comment:#759686 !important;--bard-color-code-variables:#00796b !important;--bard-color-code-literal:#388e3c !important;--bard-color-code-class:#558b2f !important;--bard-color-code-string:#2e7d32 !important;--bard-color-code-quotes-and-meta:#8d6e63 !important;--bard-color-code-keyword:#8d6e63 !important;background-color:var(--gem-sys-color--surface) !important;color:var(--gem-sys-color--on-surface) !important}
                body.mint-light-theme bard-sidenav {background-color: var(--gem-sys-color--surface-container) !important;}`
        },
        atom: {
            className: 'atom-one-dark-theme',
            displayName: 'Atom One Dark',
            isDark: true,
            css: `
                body.atom-one-dark-theme{color-scheme:dark !important;--gem-sys-color--primary:#528bff !important;--gem-sys-color--on-primary:#fff !important;--gem-sys-color--primary-container:#2a3a5c !important;--gem-sys-color--on-primary-container:#a6c8ff !important;--gem-sys-color--secondary:#c679dd !important;--gem-sys-color--on-secondary:#fff !important;--gem-sys-color--secondary-container:#4a2c58 !important;--gem-sys-color--on-secondary-container:#e0aaff !important;--gem-sys-color--tertiary:#97c378 !important;--gem-sys-color--on-tertiary:#1a2b1f !important;--gem-sys-color--error:#df6a73 !important;--gem-sys-color--on-error:#fff !important;--gem-sys-color--surface:#272b33 !important;--gem-sys-color--surface-bright:#3d4350 !important;--gem-sys-color--surface-container:#2b3039 !important;--gem-sys-color--surface-container-high:#3d4350 !important;--gem-sys-color--surface-container-highest:#4a5160 !important;--gem-sys-color--surface-container-low:#292d35 !important;--gem-sys-color--surface-container-lowest:#272b33 !important;--bard-color-synthetic--chat-window-surface:var(--gem-sys-color--surface) !important;--mat-app-background-color:var(--gem-sys-color--surface) !important;--gem-sys-color--on-surface:#abb2c0 !important;--gem-sys-color--on-surface-variant:#5b626f !important;--mat-app-text-color:var(--gem-sys-color--on-surface) !important;--bard-color-form-field-placeholder:#5b626f !important;--gem-sys-color--outline:#3d4350 !important;--gem-sys-color--outline-variant:#636e84 !important;--bard-color-response-container-flipped-background:#2b3039 !important;--bard-color-zero-state-prompt-chip-background:#3d4350 !important;--bard-color-zero-state-prompt-chip-text:#97c378 !important;--bard-color-image-placeholder-background:#2b3039 !important;--bard-color-code-comment:#5b626f !important;--bard-color-code-variables:#df6a73 !important;--bard-color-code-literal:#d29b67 !important;--bard-color-code-class:#e5c17c !important;--bard-color-code-string:#97c378 !important;--bard-color-code-quotes-and-meta:#57b6c2 !important;--bard-color-code-keyword:#c679dd !important;--mat-form-field-outlined-input-text-color:#abb2c0 !important;--mat-form-field-filled-input-text-color:#abb2c0 !important;--mat-select-enabled-trigger-text-color:#abb2c0 !important;--mat-menu-item-label-text-color:#abb2c0 !important;--mat-list-list-item-label-text-color:#abb2c0 !important;--mat-dialog-subhead-color:#abb2c0 !important;--mat-dialog-supporting-text-color:#abb2c0 !important;background-color:var(--gem-sys-color--surface) !important;color:var(--gem-sys-color--on-surface) !important}
                body.atom-one-dark-theme bard-sidenav {background-color: var(--gem-sys-color--surface-container) !important;}`
        },
        monokai: {
            className: 'monokai-dark-theme',
            displayName: 'Monokai',
            isDark: true,
            css: `
                body.monokai-dark-theme{color-scheme:dark !important;--gem-sys-color--primary:#AE81FF !important;--gem-sys-color--on-primary:#272822 !important;--gem-sys-color--primary-container:#3D3063 !important;--gem-sys-color--on-primary-container:#E0CFFD !important;--gem-sys-color--secondary:#F92672 !important;--gem-sys-color--on-secondary:#fff !important;--gem-sys-color--secondary-container:#5D1D38 !important;--gem-sys-color--on-secondary-container:#F92672 !important;--gem-sys-color--tertiary:#A6E22E !important;--gem-sys-color--on-tertiary:#272822 !important;--gem-sys-color--error:#F92672 !important;--gem-sys-color--on-error:#fff !important;--gem-sys-color--surface:#272822 !important;--gem-sys-color--surface-bright:#49483E !important;--gem-sys-color--surface-container:#373831 !important;--gem-sys-color--surface-container-high:#49483E !important;--gem-sys-color--surface-container-highest:#5A5953 !important;--gem-sys-color--surface-container-low:#2E2F29 !important;--gem-sys-color--surface-container-lowest:#272822 !important;--bard-color-synthetic--chat-window-surface:var(--gem-sys-color--surface) !important;--mat-app-background-color:var(--gem-sys-color--surface) !important;--gem-sys-color--on-surface:#afaea3 !important;--gem-sys-color--on-surface-variant:#75715E !important;--mat-app-text-color:var(--gem-sys-color--on-surface) !important;--bard-color-form-field-placeholder:#75715E !important;--gem-sys-color--outline:#49483E !important;--gem-sys-color--outline-variant:#75715E !important;--bard-color-response-container-flipped-background:#373831 !important;--bard-color-zero-state-prompt-chip-background:#49483E !important;--bard-color-zero-state-prompt-chip-text:#E6DB74 !important;--bard-color-image-placeholder-background:#373831 !important;--bard-color-code-comment:#75715e !important;--bard-color-code-variables:#a6e22e !important;--bard-color-code-literal:#ae81ff !important;--bard-color-code-class:#a6e22e !important;--bard-color-code-string:#e6db74 !important;--bard-color-code-quotes-and-meta:#fd971f !important;--bard-color-code-keyword:#f92672 !important;--mat-form-field-outlined-input-text-color:#F8F8F2 !important;--mat-form-field-filled-input-text-color:#F8F8F2 !important;--mat-select-enabled-trigger-text-color:#F8F8F2 !important;--mat-menu-item-label-text-color:#F8F8F2 !important;--mat-list-list-item-label-text-color:#F8F8F2 !important;--mat-dialog-subhead-color:#F8F8F2 !important;--mat-dialog-supporting-text-color:#F8F8F2 !important;background-color:var(--gem-sys-color--surface) !important;color:var(--gem-sys-color--on-surface) !important}
                body.monokai-dark-theme bard-sidenav {background-color: var(--gem-sys-color--surface-container) !important;}`
        },
        dracula: {
            className: 'dracula-dark-theme',
            displayName: 'Dracula',
            isDark: true,
            css: `
                body.dracula-dark-theme{color-scheme:dark !important;--gem-sys-color--primary:#bd93f9 !important;--gem-sys-color--on-primary:#282a36 !important;--gem-sys-color--primary-container:#4c396e !important;--gem-sys-color--on-primary-container:#e0b3ff !important;--gem-sys-color--secondary:#8be9fd !important;--gem-sys-color--on-secondary:#282a36 !important;--gem-sys-color--secondary-container:#2a505c !important;--gem-sys-color--on-secondary-container:#b5ffff !important;--gem-sys-color--tertiary:#50fa7b !important;--gem-sys-color--on-tertiary:#282a36 !important;--gem-sys-color--error:#ff5555 !important;--gem-sys-color--on-error:#fff !important;--gem-sys-color--surface:#282a36 !important;--gem-sys-color--surface-bright:#44475a !important;--gem-sys-color--surface-container:#44475a !important;--gem-sys-color--surface-container-high:#535870 !important;--gem-sys-color--surface-container-highest:#6272a4 !important;--gem-sys-color--surface-container-low:#353746 !important;--gem-sys-color--surface-container-lowest:#282a36 !important;--bard-color-synthetic--chat-window-surface:var(--gem-sys-color--surface) !important;--mat-app-background-color:var(--gem-sys-color--surface) !important;--gem-sys-color--on-surface:#BFC2D9 !important;--gem-sys-color--on-surface-variant:#6272a4 !important;--mat-app-text-color:var(--gem-sys-color--on-surface) !important;--bard-color-form-field-placeholder:#6272a4 !important;--gem-sys-color--outline:#44475a !important;--gem-sys-color--outline-variant:#6272a4 !important;--bard-color-response-container-flipped-background:#44475a !important;--bard-color-zero-state-prompt-chip-background:#44475a !important;--bard-color-zero-state-prompt-chip-text:#f1fa8c !important;--bard-color-image-placeholder-background:#44475a !important;--bard-color-code-comment:#6272a4 !important;--bard-color-code-variables:#ffb86c !important;--bard-color-code-literal:#bd93f9 !important;--bard-color-code-class:#8be9fd !important;--bard-color-code-string:#f1fa8c !important;--bard-color-code-quotes-and-meta:#50fa7b !important;--bard-color-code-keyword:#ff79c6 !important;--mat-form-field-outlined-input-text-color:#f8f8f2 !important;--mat-form-field-filled-input-text-color:#f8f8f2 !important;--mat-select-enabled-trigger-text-color:#f8f8f2 !important;--mat-menu-item-label-text-color:#f8f8f2 !important;--mat-list-list-item-label-text-color:#f8f8f2 !important;--mat-dialog-subhead-color:#f8f8f2 !important;--mat-dialog-supporting-text-color:#f8f8f2 !important;background-color:var(--gem-sys-color--surface) !important;color:var(--gem-sys-color--on-surface) !important}
                body.dracula-dark-theme bard-sidenav {background-color: var(--gem-sys-color--surface-container) !important;}`
        }
    };

    // --- Script Logic ---
    let menuCommands = [];

    // 1. Combine all theme CSS and inject
    let fullCSS = "";
    for (const themeKey in themes) {
        fullCSS += themes[themeKey].css;
    }
    fullCSS += `
        body, .mat-app-background { transition: background-color 0.3s ease, color 0.3s ease !important; }
        .ia-redesign infinite-scroller { --bottom-gradient-color: transparent !important; --top-gradient-color: transparent !important; }
    `;
    GM_addStyle(fullCSS);

    // 2. Core function to apply a theme class to the body
    function updateBodyClass(themeKey) {
        const themeInfo = themes[themeKey];
        // Force Gemini's internal theme state to match our selection
        if (themeInfo && themeInfo.isDark) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else { // This handles both light themes and the 'default' case
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }

        // Remove all our custom theme classes
        for (const key in themes) {
            document.body.classList.remove(themes[key].className);
        }
        // Add the selected one if it's not default
        if (themeInfo) {
            document.body.classList.add(themeInfo.className);
        }
    }

    // 3. Main function to determine and apply the correct theme based on settings
    function applyActiveTheme() {
        const settings = {
            autoSwitchEnabled: GM_getValue('autoSwitchEnabled', true),
            darkTime: GM_getValue('darkTime', '19:00'),
            lightTime: GM_getValue('lightTime', '07:00'),
            lastDarkTheme: GM_getValue('lastDarkTheme', 'atom'),
            lastLightTheme: GM_getValue('lastLightTheme', 'warm'),
            selectedTheme: GM_getValue('selectedTheme', 'default')
        };

        let themeToApplyKey = settings.selectedTheme;

        if (settings.autoSwitchEnabled) {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const [darkHour, darkMinute] = settings.darkTime.split(':').map(Number);
            const darkTimeTotalMinutes = darkHour * 60 + darkMinute;
            const [lightHour, lightMinute] = settings.lightTime.split(':').map(Number);
            const lightTimeTotalMinutes = lightHour * 60 + lightMinute;

            if (darkTimeTotalMinutes > lightTimeTotalMinutes) { // Normal day/night
                if (currentTime >= darkTimeTotalMinutes || currentTime < lightTimeTotalMinutes) {
                    themeToApplyKey = settings.lastDarkTheme;
                } else {
                    themeToApplyKey = settings.lastLightTheme;
                }
            } else { // Inverted
                if (currentTime >= darkTimeTotalMinutes && currentTime < lightTimeTotalMinutes) {
                    themeToApplyKey = settings.lastDarkTheme;
                } else {
                    themeToApplyKey = settings.lastLightTheme;
                }
            }
        }
        updateBodyClass(themeToApplyKey);
        GM_setValue('selectedTheme', themeToApplyKey);
    }

    // 4. Function to rebuild the menu commands.
    function registerMenuCommands() {
        menuCommands.forEach(cmdId => GM_unregisterMenuCommand(cmdId));
        menuCommands = [];

        const settings = {
            autoSwitchEnabled: GM_getValue('autoSwitchEnabled', true),
            darkTime: GM_getValue('darkTime', '19:00'),
            lightTime: GM_getValue('lightTime', '07:00'),
            selectedTheme: GM_getValue('selectedTheme', 'default')
        };

        const addCmd = (name, func) => menuCommands.push(GM_registerMenuCommand(name, func));
        const isActive = (key) => !settings.autoSwitchEnabled && settings.selectedTheme === key;

        for (const themeKey in themes) {
            const theme = themes[themeKey];
            addCmd(`${isActive(themeKey) ? '✅ ' : ''}${theme.displayName}`, () => manualThemeChange(themeKey));
        }

        addCmd(`${isActive('default') ? '✅ ' : ''}Restore Default`, () => manualThemeChange('default'));
        addCmd(`Auto Day/Night: ${settings.autoSwitchEnabled ? '✅ On' : '❌ Off'}`, toggleAutoSwitch);
        addCmd(`Set Times (Dark: ${settings.darkTime}, Light: ${settings.lightTime})`, setTimes);
    }

    // 5. Handler functions for menu actions
    function manualThemeChange(themeKey) {
        if (themes[themeKey]) {
            if (themes[themeKey].isDark) {
                GM_setValue('lastDarkTheme', themeKey);
            } else {
                GM_setValue('lastLightTheme', themeKey);
            }
        }
        GM_setValue('selectedTheme', themeKey);
        GM_setValue('autoSwitchEnabled', false);
        updateBodyClass(themeKey);
        registerMenuCommands();
    }

    function toggleAutoSwitch() {
        const currentVal = GM_getValue('autoSwitchEnabled', true);
        GM_setValue('autoSwitchEnabled', !currentVal);
        applyActiveTheme();
        registerMenuCommands();
    }

    function setTimes() {
        const oldDark = GM_getValue('darkTime', '19:00');
        const newDarkTime = prompt('Enter dark theme start time (HH:MM, 24-hour format):', oldDark);
        if (newDarkTime && /^\d{2}:\d{2}$/.test(newDarkTime)) {
            GM_setValue('darkTime', newDarkTime);
        }

        const oldLight = GM_getValue('lightTime', '07:00');
        const newLightTime = prompt('Enter light theme start time (HH:MM, 24-hour format):', oldLight);
        if (newLightTime && /^\d{2}:\d{2}$/.test(newLightTime)) {
            GM_setValue('lightTime', newLightTime);
        }

        applyActiveTheme();
        registerMenuCommands();
    }


    // --- Initial Execution ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const selectedTheme = GM_getValue('selectedTheme', 'default');
                const themeInfo = themes[selectedTheme];

                // This is the crucial fix:
                // Only act if a custom theme IS selected but its class is MISSING.
                // Do NOTHING if the selected theme is 'default'.
                if (themeInfo && !document.body.classList.contains(themeInfo.className)) {
                    console.log("Gemini Theme Switcher: Detected theme override, re-applying theme.");
                    applyActiveTheme();
                }
            }
        }
    });

    // We must wait for the body to exist before observing it.
    if (document.body) {
         observer.observe(document.body, { attributes: true });
         applyActiveTheme();
         registerMenuCommands();
    } else {
        new MutationObserver((_m, obs) => {
            if(document.body) {
                obs.disconnect();
                observer.observe(document.body, { attributes: true });
                applyActiveTheme();
                registerMenuCommands();
            }
        }).observe(document.documentElement, {childList: true});
    }

    console.log(`Gemini Theme Switcher: Initialized. Theme changes are now instant and stable.`);
})();
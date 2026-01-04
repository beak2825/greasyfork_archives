// ==UserScript==
// @name         Smart Grammar Fixer Pro
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Smart grammar fixing with LanguageTool and language detection
// @author       You
// @match        *://*/*
// @exclude      https://docs.google.com/*
// @exclude      https://*.office.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      api.languagetool.org
// @connect      ws.detectlanguage.com
// @antifeature  none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556531/Smart%20Grammar%20Fixer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/556531/Smart%20Grammar%20Fixer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API Configuration
    const API_CONFIG = {
        languagetool: 'https://api.languagetool.org/v2/check',
        detectlanguage: 'https://ws.detectlanguage.com/0.2/detect'
    };

    // Language Support
    const LANGUAGE_SUPPORT = {
        'en-US': 'English (US)',
        'en-GB': 'English (GB)',
        'ar': 'Arabic',
        'de-DE': 'German',
        'fr-FR': 'French',
        'es-ES': 'Spanish',
        'it-IT': 'Italian',
        'pt-PT': 'Portuguese',
        'pt-BR': 'Portuguese (BR)',
        'nl-NL': 'Dutch',
        'ru-RU': 'Russian',
        'ja-JP': 'Japanese',
        'zh-CN': 'Chinese',
        'ko-KR': 'Korean',
        'pl-PL': 'Polish',
        'sv-SE': 'Swedish',
        'da-DK': 'Danish',
        'fi-FI': 'Finnish',
        'no-NO': 'Norwegian',
        'tr-TR': 'Turkish'
    };

    // Default settings
    const DEFAULT_SETTINGS = {
        // Core Behavior
        enabled: true,
        debugMode: false,

        // API Keys
        apiKeys: {
            detectlanguage: 'a40f80d21131976bdedf653088a12ce0'
        },

        // Language Configuration
        language: {
            main: 'en-US',
            fallback: 'en-US',
            autoDetect: true,
            confidenceThreshold: 0.7,
            forceLanguage: false,
            correctionLanguage: 'auto'
        },

        // Correction Settings
        correction: {
            autoFixOnSend: true,
            minTextLength: 3,
            maxTextLength: 5000,
            fixPunctuation: true,
            fixCapitalization: true,
            aggressiveCorrection: false
        },

        // User Interface
        ui: {
            showIcons: true,
            showNotifications: true,
            iconPosition: 'top-right',
            iconSize: 'medium',
            darkMode: 'auto',
            animations: true,
            showLoadingBar: true
        },

        // Shortcuts
        shortcuts: {
            smartFix: 'Alt+A',
            fixAndSend: 'Alt+Enter',
            quickFix: 'Alt+Q',
            toggleEnabled: 'Alt+Shift+G',
            openSettings: 'Alt+Shift+S'
        },

        // Domain-specific Rules
        domainRules: {
            'gmail.com': { autoFixOnSend: true },
            'outlook.com': { autoFixOnSend: true },
            'twitter.com': { minTextLength: 5 },
            'facebook.com': { minTextLength: 10 },
            'chat.openai.com': { enabled: false },
            'docs.google.com': { enabled: false }
        }
    };

    let settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    let isProcessing = false;
    let currentDomain = window.location.hostname;
    let observedElements = new Set();
    let isRecordingShortcut = false;
    let currentRecordingInput = null;
    let mainObserver = null;

    // Inject styles
    function injectStyles() {
        const styles = `
            .grammar-helper-icon {
                position: absolute;
                width: 24px;
                height: 24px;
                background: #4CAF50;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                border: 2px solid white;
            }
            .grammar-helper-icon:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }
            .grammar-language-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #2196F3;
                color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                font-size: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid white;
                font-weight: bold;
            }

            /* Loading bar container around text area */
            .grammar-loading-container {
                position: relative;
                transition: all 0.3s ease;
            }

            .grammar-loading-bar {
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                border: 3px solid transparent;
                border-radius: 8px;
                background:
                    linear-gradient(white, white) padding-box,
                    linear-gradient(45deg, #4CAF50, #2196F3, #9C27B0, #4CAF50) border-box;
                background-size: 400% 400%;
                animation: loadingBorder 2s linear infinite, borderPulse 3s ease-in-out infinite;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .grammar-loading-bar.show {
                opacity: 1;
            }

            .grammar-loading-bar.processing::before {
                content: '';
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                height: 3px;
                background: linear-gradient(90deg, #4CAF50, #2196F3, #9C27B0, #4CAF50);
                background-size: 400% 100%;
                animation: loadingProgress 2s linear infinite;
                border-radius: 8px 8px 0 0;
            }

            .grammar-loading-bar.processing::after {
                content: 'Fixing grammar...';
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-family: Arial, sans-serif;
                white-space: nowrap;
                z-index: 10001;
                animation: fadeIn 0.3s ease;
            }

            @keyframes loadingBorder {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }

            @keyframes borderPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
                }
                50% {
                    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
                }
            }

            @keyframes loadingProgress {
                0% {
                    background-position: 0% 50%;
                    width: 0%;
                }
                50% {
                    background-position: 100% 50%;
                    width: 100%;
                }
                100% {
                    background-position: 0% 50%;
                    width: 0%;
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Enhanced notification animations */
            .grammar-notification {
                position: absolute;
                background: #4CAF50;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-family: Arial, sans-serif;
                z-index: 10002;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 200px;
                white-space: nowrap;
                transform: translateY(-20px);
                opacity: 0;
            }
            .grammar-notification.error {
                background: #f44336;
            }
            .grammar-notification.warning {
                background: #FF9800;
            }
            .grammar-notification.info {
                background: #2196F3;
            }
            .grammar-notification.processing {
                background: #9C27B0;
            }
            .grammar-notification.success {
                background: #4CAF50;
            }

            /* Animation classes */
            .grammar-notification.show {
                animation: slideInBounce 0.5s ease-out forwards;
            }
            .grammar-notification.hide {
                animation: slideOutUp 0.3s ease-in forwards;
            }

            /* Processing animation */
            .grammar-notification.processing::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255,255,255,0.7);
                border-radius: 0 0 6px 6px;
                animation: processingBar 2s linear infinite;
            }

            @keyframes slideInBounce {
                0% {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                60% {
                    transform: translateY(5px);
                    opacity: 1;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutUp {
                0% {
                    transform: translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-20px);
                    opacity: 0;
                }
            }

            @keyframes processingBar {
                0% {
                    width: 0%;
                }
                50% {
                    width: 100%;
                }
                100% {
                    width: 0%;
                }
            }

            /* Pulse animation for icon when processing */
            .grammar-helper-icon.processing {
                animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
            }

            .grammar-global-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2196F3;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                z-index: 100000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 400px;
                word-wrap: break-word;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .grammar-global-notification.show {
                transform: translateX(0);
            }
            .grammar-global-notification.success {
                background: #4CAF50;
            }
            .grammar-global-notification.error {
                background: #f44336;
            }
            .grammar-global-notification.warning {
                background: #FF9800;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Inject settings panel styles
        injectSettingsPanelStyles();
    }

    function injectSettingsPanelStyles() {
        const settingsStyles = `
        .grammar-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99998;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .grammar-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 99999;
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: scaleIn 0.3s ease forwards;
        }

        @keyframes scaleIn {
            to {
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .grammar-settings-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .grammar-settings-title h2 {
            margin: 0;
            font-size: 1.5em;
            font-weight: 600;
        }

        .grammar-settings-subtitle {
            opacity: 0.9;
            font-size: 0.9em;
            margin-top: 4px;
        }

        .grammar-settings-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        .grammar-settings-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .grammar-settings-content {
            padding: 24px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .settings-section {
            margin-bottom: 24px;
            animation: slideDown 0.4s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .settings-section h3 {
            margin: 0 0 16px 0;
            font-size: 1.1em;
            color: #495057;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 8px;
        }

        .settings-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
        }

        .settings-row label {
            flex: 1;
            margin-right: 16px;
            font-size: 14px;
            color: #495057;
        }

        .settings-row input[type="text"],
        .settings-row input[type="password"],
        .settings-row input[type="number"],
        .settings-row select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            min-width: 200px;
            transition: border-color 0.2s ease;
        }

        .settings-row input:focus,
        .settings-row select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }

        .settings-row input[type="checkbox"] {
            margin-right: 8px;
            transform: scale(1.1);
        }

        .shortcut-input {
            background: #f8f9fa !important;
            cursor: pointer;
            min-width: 120px !important;
            text-align: center;
            font-family: monospace;
        }

        .shortcut-input.recording {
            background: #fff3cd !important;
            border-color: #ffc107;
            color: #856404;
        }

        .grammar-settings-footer {
            padding: 20px 24px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .grammar-settings-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .grammar-settings-btn.primary {
            background: #667eea;
            color: white;
        }

        .grammar-settings-btn.primary:hover {
            background: #5a6fd8;
            transform: translateY(-1px);
        }

        .grammar-settings-btn.secondary {
            background: #6c757d;
            color: white;
        }

        .grammar-settings-btn.secondary:hover {
            background: #5a6268;
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            .grammar-settings-panel {
                width: 95%;
                height: 95vh;
            }

            .settings-row {
                flex-direction: column;
                align-items: flex-start;
            }

            .settings-row label {
                margin-bottom: 8px;
                margin-right: 0;
            }
        }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = settingsStyles;
        document.head.appendChild(styleSheet);
    }

    // Initialize the script
    async function init() {
        try {
            console.log('🔄 Starting Grammar Fixer initialization...');
            await loadSettings();
            applyDomainSpecificRules();
            injectStyles();
            setupGlobalShortcuts();
            setupSmartElementObservers();
            registerMenuCommands();

            console.log('✅ Smart Grammar Fixer Pro initialized successfully');
            console.log('🌐 Current domain:', currentDomain);

            showGlobalNotification('Grammar Fixer Pro ready! Use ' + settings.shortcuts.smartFix + ' to fix grammar.', 'success', 3000);

        } catch (error) {
            console.error('❌ Failed to initialize grammar fixer:', error);
            showGlobalNotification('Grammar fixer failed to initialize', 'error');
        }
    }

    function applyDomainSpecificRules() {
        const domainRule = settings.domainRules[currentDomain];
        if (domainRule) {
            // Merge domain rules with current settings
            Object.keys(domainRule).forEach(key => {
                if (typeof settings[key] === 'object' && settings[key] !== null && typeof domainRule[key] === 'object') {
                    Object.assign(settings[key], domainRule[key]);
                } else {
                    settings[key] = domainRule[key];
                }
            });
            if (settings.debugMode) {
                console.log('🔧 Applied domain-specific rules for:', currentDomain, domainRule);
            }
        }
    }

    // Settings management
    async function loadSettings() {
        try {
            const savedSettings = await GM_getValue('grammarSettings');
            if (savedSettings) {
                // Deep merge settings
                settings = deepMerge(DEFAULT_SETTINGS, savedSettings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        }
    }

    function deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    async function saveSettings() {
        try {
            await GM_setValue('grammarSettings', settings);
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            showGlobalNotification('Failed to save settings', 'error');
            return false;
        }
    }

    // Menu commands
    function registerMenuCommands() {
        try {
            GM_registerMenuCommand('⚙️ Grammar Settings', showSettingsPanel);
            GM_registerMenuCommand('🔄 Toggle Enabled', toggleEnabled);
            GM_registerMenuCommand('📊 Status Info', showStatusInfo);
        } catch (error) {
            console.warn('Menu commands not available:', error);
        }
    }

    function toggleEnabled() {
        settings.enabled = !settings.enabled;
        saveSettings();
        showGlobalNotification(`Grammar fixer ${settings.enabled ? 'enabled' : 'disabled'}`);

        if (!settings.enabled) {
            removeAllUIElements();
            if (mainObserver) {
                mainObserver.disconnect();
            }
        } else {
            setupSmartElementObservers();
            setTimeout(() => {
                scanForWritableElements();
            }, 1000);
        }
    }

    function showStatusInfo() {
        const status = `
Status: ${settings.enabled ? '✅ Enabled' : '❌ Disabled'}
Domain: ${currentDomain}
Main Language: ${settings.language.main}
Correction Language: ${settings.language.correctionLanguage}
Auto-detect: ${settings.language.autoDetect ? '✅' : '❌'}
Loading Bar: ${settings.ui.showLoadingBar ? '✅ Enabled' : '❌ Disabled'}
Observed Elements: ${observedElements.size}
Shortcuts: ${Object.values(settings.shortcuts).join(', ')}
        `.trim();

        showGlobalNotification(status, 'info', 5000);
    }

    // Shortcuts
    function setupGlobalShortcuts() {
        document.addEventListener('keydown', function(e) {
            if (!settings.enabled) return;

            const activeEl = document.activeElement;
            if (!isWritableElement(activeEl)) return;

            // Smart Fix
            if (checkShortcut(e, settings.shortcuts.smartFix)) {
                e.preventDefault();
                e.stopPropagation();
                handleSmartGrammarFix(activeEl);
            }

            // Fix and Send
            if (checkShortcut(e, settings.shortcuts.fixAndSend)) {
                e.preventDefault();
                e.stopPropagation();
                handleFixAndSend(activeEl);
            }

            // Quick Fix
            if (checkShortcut(e, settings.shortcuts.quickFix)) {
                e.preventDefault();
                e.stopPropagation();
                handleQuickFix(activeEl);
            }

            // Toggle Enabled
            if (checkShortcut(e, settings.shortcuts.toggleEnabled)) {
                e.preventDefault();
                e.stopPropagation();
                toggleEnabled();
            }

            // Open Settings
            if (checkShortcut(e, settings.shortcuts.openSettings)) {
                e.preventDefault();
                e.stopPropagation();
                showSettingsPanel();
            }
        }, true);
    }

    function checkShortcut(event, shortcut) {
        const keys = shortcut.split('+');
        let match = true;

        keys.forEach(key => {
            key = key.trim().toLowerCase();
            if (key === 'alt' && !event.altKey) match = false;
            else if (key === 'ctrl' && !event.ctrlKey) match = false;
            else if (key === 'shift' && !event.shiftKey) match = false;
            else if (key === 'enter' && event.key !== 'Enter') match = false;
            else if (key.length === 1 && event.key.toLowerCase() !== key) match = false;
            else if (key.length > 1 && !['alt', 'ctrl', 'shift', 'enter'].includes(key)) {
                // Handle special keys
                if (key === 'space' && event.key !== ' ') match = false;
                else if (event.key.toLowerCase() !== key) match = false;
            }
        });

        return match;
    }

    // Keyboard Shortcut Recording
    function setupShortcutRecording() {
        document.addEventListener('keydown', function(e) {
            if (!isRecordingShortcut || !currentRecordingInput) return;

            e.preventDefault();
            e.stopPropagation();

            const keys = [];
            if (e.ctrlKey) keys.push('Ctrl');
            if (e.altKey) keys.push('Alt');
            if (e.shiftKey) keys.push('Shift');

            // Don't include modifier keys alone
            if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
                let key = e.key;
                if (key === ' ') key = 'Space';
                else if (key.length === 1) key = key.toUpperCase();

                keys.push(key);

                // Set the shortcut
                const shortcutName = currentRecordingInput.dataset.shortcut;
                if (shortcutName && keys.length > 0) {
                    const shortcutString = keys.join('+');
                    currentRecordingInput.value = shortcutString;
                    settings.shortcuts[shortcutName] = shortcutString;

                    // Stop recording
                    stopShortcutRecording();
                }
            }
        }, true);

        // Stop recording when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (isRecordingShortcut && currentRecordingInput && !currentRecordingInput.contains(e.target)) {
                stopShortcutRecording();
            }
        }, true);
    }

    function startShortcutRecording(input, shortcutName) {
        if (isRecordingShortcut) {
            stopShortcutRecording();
        }

        isRecordingShortcut = true;
        currentRecordingInput = input;
        input.classList.add('recording');
        input.value = 'Press shortcut...';

        showGlobalNotification('Press a key combination for the shortcut...', 'info', 2000);
    }

    function stopShortcutRecording() {
        if (currentRecordingInput) {
            currentRecordingInput.classList.remove('recording');

            // Restore the current shortcut value
            const shortcutName = currentRecordingInput.dataset.shortcut;
            if (shortcutName && settings.shortcuts[shortcutName]) {
                currentRecordingInput.value = settings.shortcuts[shortcutName];
            }
        }

        isRecordingShortcut = false;
        currentRecordingInput = null;
    }

    function handleQuickFix(element) {
        if (!settings.enabled || isProcessing) return;

        const text = getElementText(element);
        if (text.length < settings.correction.minTextLength) return;

        fixWithLanguageTool(text, settings.language.main)
            .then(fixedText => {
                setElementText(element, fixedText);
                showNotification(element, 'Quick fix applied', 'success');
            })
            .catch(error => {
                console.error('Quick fix error:', error);
                showNotification(element, 'Quick fix failed', 'error');
            });
    }

    // Smart Element Detection - IMPROVED VERSION
    function setupSmartElementObservers() {
        if (!settings.enabled || !settings.ui.showIcons) return;

        // Clean up any existing observers
        if (mainObserver) {
            mainObserver.disconnect();
        }

        // Initial scan
        scanForWritableElements();

        // Observe DOM changes for elements being removed
        mainObserver = new MutationObserver((mutations) => {
            if (!settings.enabled) return;

            for (const mutation of mutations) {
                // Handle removed nodes - Clean up icons for removed elements
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Remove icon if the element itself was removed
                            if (observedElements.has(node)) {
                                removeIconFromElement(node);
                            }

                            // Remove icons for any child elements that were removed
                            const childElements = findWritableElements(node);
                            childElements.forEach(childElement => {
                                if (observedElements.has(childElement)) {
                                    removeIconFromElement(childElement);
                                }
                            });
                        }
                    });
                }

                // Handle added nodes
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check the node itself
                            if (isWritableElement(node)) {
                                addSmartIconToElement(node);
                            }
                            // Check all writable elements within the node
                            const writableElements = findWritableElements(node);
                            writableElements.forEach(addSmartIconToElement);
                        }
                    });
                }

                // Handle attribute changes (like when contenteditable becomes true/false)
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'contenteditable' ||
                     mutation.attributeName === 'disabled' ||
                     mutation.attributeName === 'readonly' ||
                     mutation.attributeName === 'style' ||
                     mutation.attributeName === 'class')) {

                    if (isWritableElement(mutation.target)) {
                        addSmartIconToElement(mutation.target);
                    } else {
                        removeIconFromElement(mutation.target);
                    }
                }
            }
        });

        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['contenteditable', 'disabled', 'readonly', 'style', 'class']
        });

        // Also observe focus and blur events to catch dynamic elements
        document.addEventListener('focusin', handleFocusIn, true);
        document.addEventListener('focusout', handleFocusOut, true);

        // Handle page navigation in single-page applications
        setupSPANavigationHandler();
    }

    function handleFocusIn(e) {
        if (isWritableElement(e.target)) {
            addSmartIconToElement(e.target);
        }
    }

    function handleFocusOut(e) {
        // Don't immediately remove on blur - keep it visible but check if element still exists
        setTimeout(() => {
            if (!document.body.contains(e.target)) {
                removeIconFromElement(e.target);
            }
        }, 100);
    }

    function setupSPANavigationHandler() {
        // Handle Single Page Application navigation
        let currentUrl = window.location.href;

        const checkUrlChange = () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                console.log('🔗 URL changed, cleaning up icons');
                cleanupOrphanedIcons();
                setTimeout(scanForWritableElements, 500);
            }
        };

        // Check for URL changes periodically
        setInterval(checkUrlChange, 1000);

        // Also listen for pushState and replaceState (common in SPAs)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(() => {
                console.log('🔗 pushState detected, cleaning up icons');
                cleanupOrphanedIcons();
                setTimeout(scanForWritableElements, 500);
            }, 100);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(() => {
                console.log('🔗 replaceState detected, cleaning up icons');
                cleanupOrphanedIcons();
                setTimeout(scanForWritableElements, 500);
            }, 100);
        };
    }

    function cleanupOrphanedIcons() {
        // Remove icons for elements that no longer exist in the DOM
        observedElements.forEach(element => {
            if (!document.body.contains(element)) {
                removeIconFromElement(element);
            }
        });
    }

    function scanForWritableElements() {
        if (!settings.enabled) return;

        const writableElements = findWritableElements(document.body);
        console.log(`🔍 Found ${writableElements.length} writable elements`);

        writableElements.forEach(element => {
            addSmartIconToElement(element);
        });

        // Clean up any orphaned icons
        cleanupOrphanedIcons();
    }

    function findWritableElements(root = document) {
        const selectors = [
            'textarea',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="search"]',
            'input[type="url"]',
            'input[type="password"]',
            'input:not([type])', // Inputs without type attribute (defaults to text)
            '[contenteditable="true"]',
            '[contenteditable=""]', // contenteditable without value also means true
            '.editable',
            '.text-input',
            '.composer',
            '.message-input',
            '.chat-input',
            '.post-input',
            '.comment-input'
        ];

        const elements = Array.from(root.querySelectorAll(selectors.join(',')));

        // Filter to only actually writable elements
        return elements.filter(element => isWritableElement(element));
    }

    function isWritableElement(element) {
        if (!element || !element.nodeName) return false;

        // Skip hidden or disabled elements
        if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;
        if (element.disabled) return false;
        if (element.readOnly) return false;

        // Check computed style for visibility
        const style = window.getComputedStyle(element);
        if (style.visibility === 'hidden' || style.display === 'none') return false;

        // Check for common hidden patterns
        if (element.closest('[style*="display: none"], [style*="visibility: hidden"]')) return false;

        // Specific element type checks
        if (element.nodeName === 'TEXTAREA') return true;

        if (element.nodeName === 'INPUT') {
            const type = element.type.toLowerCase();
            const writableTypes = ['text', 'email', 'search', 'url', 'password', 'tel'];
            return writableTypes.includes(type) || !type; // No type defaults to text
        }

        // Contenteditable elements
        if (element.isContentEditable) {
            // Make sure it's not just a container but actually editable
            return element.closest('[contenteditable="false"]') === null;
        }

        // Common class patterns for editable areas
        const editableClasses = ['editable', 'text-input', 'composer', 'message-input', 'chat-input', 'post-input', 'comment-input'];
        if (editableClasses.some(className => element.classList.contains(className))) {
            return true;
        }

        return false;
    }

    function addSmartIconToElement(element) {
        if (!settings.ui.showIcons) return;
        if (observedElements.has(element)) return;
        if (!isWritableElement(element)) return;

        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Don't add to very small elements (like search boxes)
        if (rect.width < 100 || rect.height < 20) return;

        const icon = createSmartIcon(element);
        positionIcon(icon, element);
        document.body.appendChild(icon);

        observedElements.add(element);
        element._grammarIcon = icon;

        if (settings.debugMode) {
            console.log('➕ Added icon to element:', element);
        }
    }

    function removeIconFromElement(element) {
        if (element._grammarIcon) {
            if (element._grammarIcon._cleanup) {
                element._grammarIcon._cleanup();
            }
            element._grammarIcon.remove();
            delete element._grammarIcon;
        }
        observedElements.delete(element);

        if (settings.debugMode) {
            console.log('➖ Removed icon from element:', element);
        }
    }

    function createSmartIcon(element) {
        const icon = document.createElement('div');
        icon.className = 'grammar-helper-icon';
        icon.innerHTML = 'A<div class="grammar-language-badge">LT</div>';
        icon.title = `Fix Grammar (${settings.shortcuts.smartFix})`;

        icon.addEventListener('click', async (e) => {
            e.stopPropagation();
            const text = getElementText(element);
            if (text.trim()) {
                await handleSmartGrammarFix(element);
            }
        });

        return icon;
    }

    function positionIcon(icon, element) {
        const updatePosition = () => {
            // Check if element still exists and is visible
            if (!document.body.contains(element)) {
                removeIconFromElement(element);
                return;
            }

            const rect = element.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            if (rect.width === 0 || rect.height === 0) {
                icon.style.display = 'none';
                return;
            }

            icon.style.display = 'flex';

            const top = rect.top + scrollY - 30;
            const left = rect.right + scrollX - 30;

            icon.style.top = top + 'px';
            icon.style.left = left + 'px';
        };

        updatePosition();

        // Update position on scroll and resize
        const debouncedUpdate = debounce(updatePosition, 100);
        window.addEventListener('scroll', debouncedUpdate);
        window.addEventListener('resize', debouncedUpdate);

        // Also update when element moves (for dynamic content)
        const elementObserver = new MutationObserver(debouncedUpdate);
        if (element.parentNode) {
            elementObserver.observe(element, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        icon._cleanup = () => {
            window.removeEventListener('scroll', debouncedUpdate);
            window.removeEventListener('resize', debouncedUpdate);
            elementObserver.disconnect();
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function removeAllUIElements() {
        document.querySelectorAll('.grammar-helper-icon, .grammar-notification, .grammar-loading-bar, .grammar-loading-container')
            .forEach(el => {
                if (el._cleanup) el._cleanup();
                el.remove();
            });

        observedElements.forEach(element => {
            delete element._grammarIcon;
        });
        observedElements.clear();
    }

    // Loading Bar Functions
    function showLoadingBar(element) {
        if (!settings.ui.showLoadingBar) return;

        // Remove existing loading bar
        hideLoadingBar(element);

        // Create loading container if needed
        let container = element.parentNode;
        if (!container.classList.contains('grammar-loading-container')) {
            const newContainer = document.createElement('div');
            newContainer.className = 'grammar-loading-container';
            element.parentNode.insertBefore(newContainer, element);
            newContainer.appendChild(element);
            container = newContainer;
        }

        // Create loading bar
        const loadingBar = document.createElement('div');
        loadingBar.className = 'grammar-loading-bar processing';
        container.appendChild(loadingBar);

        // Show with animation
        setTimeout(() => {
            loadingBar.classList.add('show');
        }, 10);

        return loadingBar;
    }

    function hideLoadingBar(element) {
        if (!settings.ui.showLoadingBar) return;

        const container = element.closest('.grammar-loading-container');
        if (container) {
            const loadingBar = container.querySelector('.grammar-loading-bar');
            if (loadingBar) {
                loadingBar.classList.remove('show');
                setTimeout(() => {
                    if (loadingBar.parentNode) {
                        loadingBar.remove();
                    }
                }, 300);
            }
        }
    }

    // Core Grammar Functions
    async function handleSmartGrammarFix(element) {
        if (isProcessing) {
            showNotification(element, 'Already fixing grammar...', 'warning');
            return;
        }

        isProcessing = true;

        const text = getElementText(element);
        if (!text.trim() || text.length < settings.correction.minTextLength) {
            showNotification(element, 'Text too short to fix', 'warning');
            isProcessing = false;
            return;
        }

        if (text.length > settings.correction.maxTextLength) {
            showNotification(element, 'Text too long to fix', 'warning');
            isProcessing = false;
            return;
        }

        let loadingBar = null;

        try {
            // Add processing animation to icon
            const icon = element._grammarIcon;
            if (icon && settings.ui.animations) {
                icon.classList.add('processing');
            }

            // Show loading bar around text area
            loadingBar = showLoadingBar(element);

            showNotification(element, 'Fixing grammar...', 'processing');

            let languageCode = settings.language.correctionLanguage;

            // Auto-detect language if set to auto
            if (languageCode === 'auto') {
                if (settings.language.autoDetect && settings.apiKeys.detectlanguage) {
                    try {
                        const detectedLang = await detectLanguage(text);
                        languageCode = detectedLang.code;
                        console.log(`🌍 Detected language: ${detectedLang.name} (${detectedLang.code})`);
                    } catch (error) {
                        console.warn('Language detection failed, using main language:', error);
                        languageCode = settings.language.main;
                    }
                } else {
                    languageCode = settings.language.main;
                }
            }

            const fixedText = await fixWithLanguageTool(text, languageCode);
            setElementText(element, fixedText);

            // Remove processing animation
            if (icon && settings.ui.animations) {
                icon.classList.remove('processing');
            }

            // Hide loading bar
            hideLoadingBar(element);

            showNotification(element, `Grammar fixed! (${LANGUAGE_SUPPORT[languageCode] || languageCode})`, 'success');

        } catch (error) {
            console.error('Smart grammar fix error:', error);

            // Remove processing animation on error
            const icon = element._grammarIcon;
            if (icon && settings.ui.animations) {
                icon.classList.remove('processing');
            }

            // Hide loading bar on error
            hideLoadingBar(element);

            showNotification(element, 'Failed to fix grammar', 'error');
        } finally {
            isProcessing = false;
        }
    }

    async function detectLanguage(text) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: API_CONFIG.detectlanguage,
                headers: {
                    'Authorization': `Bearer ${settings.apiKeys.detectlanguage}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ q: text }),
                timeout: 10000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.data && data.data.detections && data.data.detections.length > 0) {
                            const detection = data.data.detections[0];
                            if (detection.confidence >= settings.language.confidenceThreshold) {
                                const langName = LANGUAGE_SUPPORT[detection.language] || detection.language;
                                resolve({
                                    code: detection.language,
                                    name: langName,
                                    confidence: detection.confidence
                                });
                            } else {
                                reject('Language detection confidence too low: ' + detection.confidence);
                            }
                        } else {
                            reject('No language detections found');
                        }
                    } catch (e) {
                        reject('Error parsing language detection response: ' + e);
                    }
                },
                onerror: reject,
                ontimeout: () => reject('Language detection timeout')
            });
        });
    }

    async function fixWithLanguageTool(text, languageCode) {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams();
            params.append('text', text);
            params.append('language', languageCode);
            params.append('enabledOnly', 'false');

            GM_xmlhttpRequest({
                method: 'POST',
                url: API_CONFIG.languagetool,
                data: params.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 15000,
                onload: function(response) {
                    try {
                        if (response.status !== 200) {
                            reject(`LanguageTool API error: ${response.status}`);
                            return;
                        }

                        const result = JSON.parse(response.responseText);
                        let fixedText = text;

                        if (result.matches && result.matches.length > 0) {
                            // Sort matches by offset in reverse order to avoid position shifts
                            const matches = [...result.matches].sort((a, b) => b.offset - a.offset);

                            for (const match of matches) {
                                if (match.replacements && match.replacements.length > 0) {
                                    const replacement = match.replacements[0].value;
                                    const before = fixedText.substring(0, match.offset);
                                    const after = fixedText.substring(match.offset + match.length);
                                    fixedText = before + replacement + after;
                                }
                            }
                        }

                        resolve(fixedText);
                    } catch (e) {
                        reject('Error parsing LanguageTool response: ' + e);
                    }
                },
                onerror: reject,
                ontimeout: () => reject('LanguageTool request timeout')
            });
        });
    }

    async function handleFixAndSend(element) {
        await handleSmartGrammarFix(element);
        if (settings.correction.autoFixOnSend) {
            setTimeout(() => clickSendButton(element), 500);
        }
    }

    function clickSendButton(element) {
        const sendSelectors = [
            'button[type="submit"]', 'input[type="submit"]',
            'button[data-testid*="send"]', 'button[data-testid*="submit"]',
            '[aria-label*="send" i]', '[aria-label*="submit" i]'
        ];

        let sendButton = null;
        const form = element.closest('form');

        if (form) {
            for (const selector of sendSelectors) {
                sendButton = form.querySelector(selector);
                if (sendButton && sendButton.offsetParent !== null) break;
            }
        }

        if (sendButton) {
            sendButton.click();
            return true;
        }

        return false;
    }

    // Utility Functions
    function getElementText(element) {
        if (element.nodeName === 'TEXTAREA' || element.nodeName === 'INPUT') {
            return element.value;
        } else {
            return element.textContent || element.innerText || '';
        }
    }

    function setElementText(element, text) {
        if (element.nodeName === 'TEXTAREA' || element.nodeName === 'INPUT') {
            element.value = text;
        } else {
            element.textContent = text;
        }

        // Trigger events to notify the page of the change
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(inputEvent);
        element.dispatchEvent(changeEvent);
    }

    function showNotification(element, message, type = 'info') {
        if (!settings.ui.showNotifications) return;

        // Remove existing notification
        const existingNotification = document.querySelector('.grammar-notification');
        if (existingNotification) {
            if (settings.ui.animations) {
                existingNotification.classList.add('hide');
                setTimeout(() => existingNotification.remove(), 300);
            } else {
                existingNotification.remove();
            }
        }

        const notification = document.createElement('div');
        notification.className = `grammar-notification ${type}`;
        notification.textContent = message;

        const rect = element.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        notification.style.top = (rect.top + scrollY - 40) + 'px';
        notification.style.left = (rect.right + scrollX - 10) + 'px';

        document.body.appendChild(notification);

        // Add show animation
        if (settings.ui.animations) {
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            // Auto hide after 3 seconds
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }, 3000);
        } else {
            // No animation - just remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 3000);
        }
    }

    function showGlobalNotification(message, type = 'info', duration = 3000) {
        if (!settings.ui.showNotifications) return;

        const notification = document.createElement('div');
        notification.className = `grammar-global-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        if (settings.ui.animations) {
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }, duration);
        } else {
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, duration);
        }
    }

    // Settings Panel
    function showSettingsPanel() {
        // Remove existing settings panel if any
        const existingPanel = document.querySelector('.grammar-settings-overlay');
        if (existingPanel) existingPanel.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'grammar-settings-overlay';

        // Create settings panel
        const panel = document.createElement('div');
        panel.className = 'grammar-settings-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'grammar-settings-header';
        header.innerHTML = `
            <div class="grammar-settings-title">
                <h2>Smart Grammar Fixer Pro</h2>
                <div class="grammar-settings-subtitle">Version 6.5</div>
            </div>
            <button class="grammar-settings-close">&times;</button>
        `;

        // Content
        const content = document.createElement('div');
        content.className = 'grammar-settings-content';
        content.innerHTML = createSettingsContent();

        // Footer
        const footer = document.createElement('div');
        footer.className = 'grammar-settings-footer';
        footer.innerHTML = `
            <button class="grammar-settings-btn secondary" id="grammar-settings-reset">Reset to Defaults</button>
            <button class="grammar-settings-btn secondary" id="grammar-settings-cancel">Cancel</button>
            <button class="grammar-settings-btn primary" id="grammar-settings-save">Save Settings</button>
        `;

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Add event listeners
        header.querySelector('.grammar-settings-close').addEventListener('click', closeSettings);
        footer.querySelector('#grammar-settings-cancel').addEventListener('click', closeSettings);
        footer.querySelector('#grammar-settings-reset').addEventListener('click', resetSettings);
        footer.querySelector('#grammar-settings-save').addEventListener('click', saveSettingsFromPanel);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSettings();
        });

        // Setup shortcut recording
        setupShortcutInputs();

        // Focus first input
        const firstInput = panel.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }

    function createSettingsContent() {
        return `
            <div class="settings-section">
                <h3>Core Settings</h3>
                <div class="settings-row">
                    <label for="grammar-enabled">Enabled</label>
                    <input type="checkbox" id="grammar-enabled" ${settings.enabled ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-debug">Debug Mode</label>
                    <input type="checkbox" id="grammar-debug" ${settings.debugMode ? 'checked' : ''}>
                </div>
            </div>

            <div class="settings-section">
                <h3>Keyboard Shortcuts</h3>
                <div class="settings-row">
                    <label for="grammar-shortcut-smartfix">Smart Fix</label>
                    <input type="text" id="grammar-shortcut-smartfix" class="shortcut-input"
                           data-shortcut="smartFix" value="${settings.shortcuts.smartFix}" readonly>
                </div>
                <div class="settings-row">
                    <label for="grammar-shortcut-fixandsend">Fix and Send</label>
                    <input type="text" id="grammar-shortcut-fixandsend" class="shortcut-input"
                           data-shortcut="fixAndSend" value="${settings.shortcuts.fixAndSend}" readonly>
                </div>
                <div class="settings-row">
                    <label for="grammar-shortcut-quickfix">Quick Fix</label>
                    <input type="text" id="grammar-shortcut-quickfix" class="shortcut-input"
                           data-shortcut="quickFix" value="${settings.shortcuts.quickFix}" readonly>
                </div>
                <div class="settings-row">
                    <label for="grammar-shortcut-toggle">Toggle Enabled</label>
                    <input type="text" id="grammar-shortcut-toggle" class="shortcut-input"
                           data-shortcut="toggleEnabled" value="${settings.shortcuts.toggleEnabled}" readonly>
                </div>
                <div class="settings-row">
                    <label for="grammar-shortcut-settings">Open Settings</label>
                    <input type="text" id="grammar-shortcut-settings" class="shortcut-input"
                           data-shortcut="openSettings" value="${settings.shortcuts.openSettings}" readonly>
                </div>
            </div>

            <div class="settings-section">
                <h3>Language Settings</h3>
                <div class="settings-row">
                    <label for="grammar-main-language">Main Language</label>
                    <select id="grammar-main-language">
                        ${Object.entries(LANGUAGE_SUPPORT).map(([code, name]) =>
                            `<option value="${code}" ${settings.language.main === code ? 'selected' : ''}>${name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="settings-row">
                    <label for="grammar-correction-language">Correction Language</label>
                    <select id="grammar-correction-language">
                        <option value="auto" ${settings.language.correctionLanguage === 'auto' ? 'selected' : ''}>Auto-detect</option>
                        ${Object.entries(LANGUAGE_SUPPORT).map(([code, name]) =>
                            `<option value="${code}" ${settings.language.correctionLanguage === code ? 'selected' : ''}>${name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="settings-row">
                    <label for="grammar-auto-detect">Auto-detect Language</label>
                    <input type="checkbox" id="grammar-auto-detect" ${settings.language.autoDetect ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-confidence">Confidence Threshold</label>
                    <input type="number" id="grammar-confidence" min="0.1" max="1.0" step="0.1" value="${settings.language.confidenceThreshold}">
                </div>
            </div>

            <div class="settings-section">
                <h3>Correction Settings</h3>
                <div class="settings-row">
                    <label for="grammar-auto-fix">Auto-fix on Send</label>
                    <input type="checkbox" id="grammar-auto-fix" ${settings.correction.autoFixOnSend ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-min-length">Minimum Text Length</label>
                    <input type="number" id="grammar-min-length" min="1" max="1000" value="${settings.correction.minTextLength}">
                </div>
                <div class="settings-row">
                    <label for="grammar-max-length">Maximum Text Length</label>
                    <input type="number" id="grammar-max-length" min="100" max="10000" value="${settings.correction.maxTextLength}">
                </div>
                <div class="settings-row">
                    <label for="grammar-punctuation">Fix Punctuation</label>
                    <input type="checkbox" id="grammar-punctuation" ${settings.correction.fixPunctuation ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-capitalization">Fix Capitalization</label>
                    <input type="checkbox" id="grammar-capitalization" ${settings.correction.fixCapitalization ? 'checked' : ''}>
                </div>
            </div>

            <div class="settings-section">
                <h3>UI Settings</h3>
                <div class="settings-row">
                    <label for="grammar-show-icons">Show Icons</label>
                    <input type="checkbox" id="grammar-show-icons" ${settings.ui.showIcons ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-show-notifications">Show Notifications</label>
                    <input type="checkbox" id="grammar-show-notifications" ${settings.ui.showNotifications ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-show-loading">Show Loading Bar</label>
                    <input type="checkbox" id="grammar-show-loading" ${settings.ui.showLoadingBar ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <label for="grammar-animations">Enable Animations</label>
                    <input type="checkbox" id="grammar-animations" ${settings.ui.animations ? 'checked' : ''}>
                </div>
            </div>

            <div class="settings-section">
                <h3>API Keys</h3>
                <div class="settings-row">
                    <label for="grammar-detection-key">Detect Language API Key</label>
                    <input type="password" id="grammar-detection-key" value="${settings.apiKeys.detectlanguage || ''}">
                </div>
            </div>
        `;
    }

    function setupShortcutInputs() {
        const shortcutInputs = document.querySelectorAll('.shortcut-input');
        shortcutInputs.forEach(input => {
            input.addEventListener('click', function(e) {
                e.preventDefault();
                startShortcutRecording(this, this.dataset.shortcut);
            });
        });
    }

    function closeSettings() {
        stopShortcutRecording();
        const overlay = document.querySelector('.grammar-settings-overlay');
        if (overlay) overlay.remove();
    }

    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            saveSettings();
            closeSettings();
            showGlobalNotification('Settings reset to defaults', 'success');

            // Restart the script
            removeAllUIElements();
            setTimeout(init, 500);
        }
    }

    function saveSettingsFromPanel() {
        // Core Settings
        settings.enabled = document.getElementById('grammar-enabled').checked;
        settings.debugMode = document.getElementById('grammar-debug').checked;

        // Language Settings
        settings.language.main = document.getElementById('grammar-main-language').value;
        settings.language.correctionLanguage = document.getElementById('grammar-correction-language').value;
        settings.language.autoDetect = document.getElementById('grammar-auto-detect').checked;
        settings.language.confidenceThreshold = parseFloat(document.getElementById('grammar-confidence').value);

        // Correction Settings
        settings.correction.autoFixOnSend = document.getElementById('grammar-auto-fix').checked;
        settings.correction.minTextLength = parseInt(document.getElementById('grammar-min-length').value);
        settings.correction.maxTextLength = parseInt(document.getElementById('grammar-max-length').value);
        settings.correction.fixPunctuation = document.getElementById('grammar-punctuation').checked;
        settings.correction.fixCapitalization = document.getElementById('grammar-capitalization').checked;

        // UI Settings
        settings.ui.showIcons = document.getElementById('grammar-show-icons').checked;
        settings.ui.showNotifications = document.getElementById('grammar-show-notifications').checked;
        settings.ui.showLoadingBar = document.getElementById('grammar-show-loading').checked;
        settings.ui.animations = document.getElementById('grammar-animations').checked;

        // API Keys
        settings.apiKeys.detectlanguage = document.getElementById('grammar-detection-key').value;

        if (saveSettings()) {
            closeSettings();
            showGlobalNotification('Settings saved successfully', 'success');

            // Restart observers with new settings
            removeAllUIElements();
            setTimeout(init, 500);
        }
    }

    function formatActionName(action) {
        return action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    // Initialize shortcut recording system
    setupShortcutRecording();

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global access for debugging
    unsafeWindow.grammarFixer = {
        settings: settings,
        fixText: handleSmartGrammarFix,
        showSettings: showSettingsPanel,
        scanElements: scanForWritableElements,
        getObservedElements: () => Array.from(observedElements)
    };

})();;